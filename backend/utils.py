import os
import asyncio
import logging
from typing import List, Tuple
from urllib.parse import quote, quote_plus
import httpx
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from datetime import datetime
from dotenv import load_dotenv
import openai
from tempfile import TemporaryDirectory
from moviepy.video.io.VideoFileClip import VideoFileClip
import yt_dlp
import subprocess


logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)
logger.info("Starting TravelReel Itinerary API (Supabase)")

# === Supabase client ===
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
GMAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not all([GMAPS_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    logging.error("Falta alguna de las variables: GOOGLE_MAPS_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
    raise RuntimeError("Env vars missing")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY, ClientOptions().replace(schema="public"))



# === Geocoding cache on Supabase ===
async def geocode_place(address: str) -> Tuple[float, float, str]:
    logger.info(f"Geocoding address: {address}")
    # 1) Intento de cache
    resp = supabase.table("geocode_cache") \
        .select("nav_lat, nav_lng, place_id, lat, lng, restricted_modes") \
        .eq("address", address) \
        .maybe_single() \
        .execute()
    #if resp.data:
    if resp and resp.data:
        nav_lat, nav_lng, pid = resp.data["nav_lat"], resp.data["nav_lng"], resp.data["place_id"]
        logger.info(f"Cache hit for {address} (place_id={pid})")
        return nav_lat, nav_lng, pid

    # 2) Llamada a Google Geocode
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
    geo = result["geometry"]["location"]
    place_id = result["place_id"]
    navs = result.get("navigation_points", [])
    valid = [p for p in navs if "WALK" not in p.get("restricted_travel_modes", [])]
    if valid:
        loc = valid[0]["location"]
        nav_lat = loc.get("latitude", loc.get("lat"))
        nav_lng = loc.get("longitude", loc.get("lng"))
    else:
        nav_lat, nav_lng = geo["lat"], geo["lng"]

    restricted = ",".join(
        mode for nav in navs for mode in nav.get("restricted_travel_modes", [])
    )

    # 3) Guardar en cache Supabase
    supabase.table("geocode_cache").upsert({
        "address": address,
        "lat": geo["lat"],
        "lng": geo["lng"],
        "nav_lat": nav_lat,
        "nav_lng": nav_lng,
        "place_id": place_id,
        "restricted_modes": restricted,
    }).execute()
    logger.info(f"Cached geocode for {address} (place_id={place_id})")
    return nav_lat, nav_lng, place_id

async def geocode_places(places: List[str], city: str) -> List[Tuple[float, float, str]]:
    logger.info(f"Parallel geocoding {len(places)} places in {city}")
    tasks = [geocode_place(f"{p}, {city}") for p in places]
    return await asyncio.gather(*tasks)
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


def download_and_transcript(req):
    # Auto-update yt-dlp extractor before download (equivalent to "yt-dlp -U")
    try:
        subprocess.run(["yt-dlp", "-vU"], check=False)
        logger.info('yt-dlp updated')
    except Exception as e:
        logger.warning(f"Could not auto-update yt-dlp binary: {e}")

    with TemporaryDirectory() as tmp:
        video_fp = os.path.join(tmp, "video.mp4")
        audio_fp = os.path.join(tmp, "audio.wav")
        logger.info(f'req.url >>> {req.url}')
        yt_dlp.YoutubeDL({
            "format": "mp4", 
            "outtmpl": video_fp, 
            "quiet": True, 
            "verbose": True
        }).download([req.url])
        VideoFileClip(video_fp).audio.write_audiofile(audio_fp, codec="pcm_s16le")

        transcript = openai.audio.transcriptions.create(
            model="whisper-1", file=open(audio_fp, "rb"), response_format="text"
        )
    return transcript