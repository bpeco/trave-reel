import os
import sqlite3
import asyncio
import logging
from tempfile import TemporaryDirectory
from typing import List, Tuple, Optional
from urllib.parse import quote, quote_plus

import httpx
import yt_dlp
from moviepy.video.io.VideoFileClip import VideoFileClip
import openai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain.chat_models import ChatOpenAI
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

# ─── Configuración de logging ─────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger(__name__)

# ─── Configuración de entorno ─────────────────────────────────────────────────
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
GMAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
if not GMAPS_API_KEY:
    logger.error("Missing GOOGLE_MAPS_API_KEY in environment")
    raise RuntimeError("Missing GOOGLE_MAPS_API_KEY in environment")

logger.info("Starting TravelReel Itinerary API application")

# ─── Base de datos de caché ───────────────────────────────────────────────────
DB_PATH = os.getenv("GEOCODE_DB", "geocode_cache.db")
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
conn.execute(
    """
    CREATE TABLE IF NOT EXISTS geocode_cache (
        address TEXT PRIMARY KEY,
        lat REAL,
        lng REAL,
        nav_lat REAL,
        nav_lng REAL,
        place_id TEXT,
        restricted_modes TEXT
    )"""
)
conn.execute(
    """
    CREATE TABLE IF NOT EXISTS itinerary_cache (
        video_url TEXT,
        city TEXT,
        itinerary_json TEXT,
        route_link TEXT,
        PRIMARY KEY(video_url, city)
    )"""
)
conn.commit()
logger.info(f"Database initialized at {DB_PATH}")

# ─── Modelos Pydantic ──────────────────────────────────────────────────────────
class ItineraryRequest(BaseModel):
    url: str
    city: str

class ItineraryItem(BaseModel):
    order: int
    place: str
    duration_minutes: Optional[int] = Field(None)
    notes: Optional[str] = Field(None)

class DayItinerary(BaseModel):
    city: str
    items: List[ItineraryItem]

class ItineraryResponse(BaseModel):
    ordered: List[ItineraryItem]
    route_link: str

# ─── LangChain Parser y Chain ─────────────────────────────────────────────────
parser = PydanticOutputParser(pydantic_object=DayItinerary)
system_msg = SystemMessagePromptTemplate.from_template(
    "Eres un asistente que genera itinerarios de un día en una ciudad específica.\n"
    "Genera **solo** un JSON que cumpla este esquema:\n{format_instructions}\n"
    "Transcripción de audio:\n'''{transcript}'''\n"
    "Ciudad: {city}"
)
prompt = ChatPromptTemplate.from_messages([system_msg])
llm = ChatOpenAI(model_name="o4-mini", temperature=1)
chain = LLMChain(llm=llm, prompt=prompt)

# ─── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(title="TravelReel Itinerary API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("FastAPI configured with CORS")

# ─── Funciones auxiliares ──────────────────────────────────────────────────────
async def geocode_place(address: str) -> Tuple[float, float, str]:
    logger.info(f"Geocoding address: {address}")
    cur = conn.execute(
        "SELECT nav_lat, nav_lng, place_id FROM geocode_cache WHERE address = ?",
        (address,),
    )
    row = cur.fetchone()
    if row:
        nav_lat, nav_lng, pid = row
        logger.info(f"Cache hit for address: {address} (place_id={pid})")
        return nav_lat, nav_lng, pid

    logger.info(f"Cache miss; calling Geocoding API for: {address}")
    url = (
        f"https://maps.googleapis.com/maps/api/geocode/json?address={quote(address)}"
        f"&key={GMAPS_API_KEY}"
    )
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
    data = res.json()
    if data.get("status") != "OK" or not data.get("results"):
        logger.error(f"Geocoding failed for {address}")
        raise ValueError(f"Geocoding failed for {address}")
    result = data["results"][0]
    geo = result.get("geometry", {}).get("location", {})
    place_id = result.get("place_id")
    navs = result.get("navigation_points", [])
    valid = [p for p in navs if "WALK" not in p.get("restricted_travel_modes", [])]
    if valid:
        loc = valid[0]["location"]
        nav_lat, nav_lng = loc.get("latitude") or loc.get("lat"), loc.get("longitude") or loc.get("lng")
        logger.info(f"Using navigation_point for {address}: {(nav_lat, nav_lng)}")
    else:
        nav_lat, nav_lng = geo.get("lat"), geo.get("lng")
        logger.info(f"Using geometry.location for {address}: {(nav_lat, nav_lng)}")
    restricted_list = []
    for nav in navs:
        restricted_list.extend(nav.get("restricted_travel_modes", []))
    restricted = ",".join(restricted_list)
    conn.execute(
        "INSERT OR REPLACE INTO geocode_cache(address, lat, lng, nav_lat, nav_lng, place_id, restricted_modes) VALUES(?,?,?,?,?,?,?)",
        (
            address,
            geo.get("lat"),
            geo.get("lng"),
            nav_lat,
            nav_lng,
            place_id,
            restricted,
        ),
    )
    conn.commit()
    logger.info(f"Geocoding result cached for {address} (place_id={place_id})")
    return nav_lat, nav_lng, place_id

async def geocode_places(places: List[str], city: str) -> List[Tuple[float, float, str]]:
    logger.info(f"Starting parallel geocoding for {len(places)} places in {city}")
    tasks = [geocode_place(f"{p}, {city}") for p in places]
    results = await asyncio.gather(*tasks)
    logger.info(f"Geocoding completed: {results}")
    return results


def solve_tsp(points: List[Tuple[float, float]]) -> List[int]:
    logger.info("Solving TSP with OR-Tools")
    n = len(points)
    matrix = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            matrix[i][j] = int(((points[i][0]-points[j][0])**2 + (points[i][1]-points[j][1])**2)**0.5 * 100000)
    manager = pywrapcp.RoutingIndexManager(n, 1, 0)
    routing = pywrapcp.RoutingModel(manager)
    def dist_cb(from_idx, to_idx):
        return matrix[manager.IndexToNode(from_idx)][manager.IndexToNode(to_idx)]
    idx = routing.RegisterTransitCallback(dist_cb)
    routing.SetArcCostEvaluatorOfAllVehicles(idx)
    params = pywrapcp.DefaultRoutingSearchParameters()
    params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    sol = routing.SolveWithParameters(params)
    route = []
    node = routing.Start(0)
    while not routing.IsEnd(node):
        route.append(manager.IndexToNode(node))
        node = sol.Value(routing.NextVar(node))
    route.append(manager.IndexToNode(node))
    logger.info(f"TSP solution route: {route}")
    # drop the return to depot
    return route[:-1]


def build_maps_url(place_ids: List[str], labels: List[str]) -> str:
    logger.info("Building Google Maps URL with place_ids and labels")
    origin_pid = place_ids[0]
    origin_label = labels[0]
    dest_pid = place_ids[-1]
    dest_label = labels[-1]
    params = [
        "api=1",
        f"origin_place_id={origin_pid}",
        f"origin={quote_plus(origin_label)}",
        f"destination_place_id={dest_pid}",
        f"destination={quote_plus(dest_label)}",
        "travelmode=walking"
    ]
    if len(place_ids) > 2:
        wp_names = "|".join(quote_plus(lbl) for lbl in labels[1:-1])
        wp_ids = "|".join(place_ids[1:-1])
        params.append(f"waypoints={wp_names}")
        params.append(f"waypoint_place_ids={wp_ids}")
    url = "https://www.google.com/maps/dir/?" + "&".join(params)
    logger.info(f"Maps URL: {url}")
    return url

@app.post("/itinerary", response_model=ItineraryResponse)
async def create_itinerary(req: ItineraryRequest):
    logger.info(f"Received itinerary request for URL {req.url} in city {req.city}")
    try:
        # cache check
        cur = conn.execute(
            "SELECT itinerary_json, route_link FROM itinerary_cache WHERE video_url=? AND city=?",
            (req.url, req.city),
        )
        cached = cur.fetchone()
        if cached:
            import json
            items = json.loads(cached[0])
            route_link = cached[1]
            logger.info("Cache hit for itinerary; returning cached result")
            return ItineraryResponse(ordered=items, route_link=route_link)

        # 1) Download & transcribe
        logger.info("Downloading video and extracting audio")
        with TemporaryDirectory() as tmp:
            video_fp = os.path.join(tmp, "video.mp4")
            audio_fp = os.path.join(tmp, "audio.wav")
            yt_dlp.YoutubeDL({"format":"mp4","outtmpl":video_fp,"quiet":True}).download([req.url])
            VideoFileClip(video_fp).audio.write_audiofile(audio_fp, codec="pcm_s16le")
            logger.info("Calling Whisper API for transcription")
            transcript = openai.audio.transcriptions.create(
                model="whisper-1", file=open(audio_fp, "rb"), response_format="text"
            )

        # 2) Generate itinerary via AI
        logger.info("Generating itinerary via LangChain")
        result = chain.invoke({"transcript": transcript, "city": req.city,
                               "format_instructions": parser.get_format_instructions()})
        day: DayItinerary = parser.parse(result["text"])

        # 3) Geocode in parallel
        places = [item.place for item in day.items]
        geocoded = await geocode_places(places, req.city)
        # unpack triples
        lats, lngs, place_ids = zip(*geocoded)
        coords = list(zip(lats, lngs))

        # 4) Solve TSP
        order = solve_tsp(coords)
        ordered_items = [day.items[i] for i in order]
        ordered_place_ids = [place_ids[i] for i in order]
        ordered_labels = [day.items[i].place for i in order]

        # 5) Build Maps URL
        route_link = build_maps_url(ordered_place_ids, ordered_labels)

        # 6) Cache result
        import json
        conn.execute(
            "INSERT OR REPLACE INTO itinerary_cache VALUES(?,?,?,?)",
            (req.url, req.city, json.dumps([item.dict() for item in ordered_items]), route_link),
        )
        conn.commit()
        logger.info("Itinerary generated and cached successfully")
        return ItineraryResponse(ordered=ordered_items, route_link=route_link)
    except Exception as e:
        logger.exception("Error processing itinerary request")
        raise HTTPException(status_code=500, detail=str(e))

# Para desarrollo: uvicorn main:app --reload
