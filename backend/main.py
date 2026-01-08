import os
import asyncio
import logging
from typing import List, Tuple, Optional
from urllib.parse import quote, quote_plus
import json
import httpx
import yt_dlp
import openai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Path, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain.chat_models import ChatOpenAI
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from datetime import datetime
#from postgrest import APIError
from utils import *


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

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY, ClientOptions().replace(schema="travel-reel"))

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)
logger.info("Starting TravelReel Itinerary API (Supabase)")

# === Pydantic models ===

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

class ItineraryCreateResponse(ItineraryResponse):
    itinerary_id: str

class LinkTripRequest(BaseModel):
    trip_id: str

class ItineraryListItem(BaseModel):
    itinerary_id: str
    itinerary_date: datetime
    description: str
    count_stops: int
    avg_time: int
    categories: List[str] = Field(default_factory=list)


class TripSummary(BaseModel):
    trip_id: str
    name: str
    country: str
    stops_count: int


class TripStats(BaseModel):
    itineraries_count: int
    stops_count: int


class detectedCountry(BaseModel):
    continent: Optional[str]
    country: Optional[str]

# === LangChain setup ===
parser = PydanticOutputParser(pydantic_object=DayItinerary)
itinerary_system_msg = SystemMessagePromptTemplate.from_template(
    "Eres un asistente que genera itinerarios de un día en una ciudad específica.\n"
    "Genera **solo** un JSON que cumpla este esquema:\n{format_instructions}\n"
    "Transcripción de audio:\n'''{transcript}'''\n"
    "Ciudad: {city}"
)
prompt = ChatPromptTemplate.from_messages([itinerary_system_msg])

country_detection_parser = PydanticOutputParser(pydantic_object=detectedCountry)
detect_country_system_msg = SystemMessagePromptTemplate.from_template(
    "Tu tarea es deducir el país y el continente a partir del nombre de un viaje, solo si éste hace referencia a un lugar geográfico.\n"
    "Reglas:\n"
    "- El continente debe ser uno de: 'América', 'Europa', 'Asia', 'África', 'Oceanía'.\n"
    "- El país debe devolverse en código ISO 3166-1 alpha-2 (por ejemplo, 'US', 'FR').\n"
    "- Si el nombre del viaje no contiene ninguna ciudad, país o lugar reconocible geográficamente, responde con null en ambos campos.\n"
    "- No infieras por comidas, actividades o palabras culturales: solo si hay evidencia directa de un lugar geográfico.\n"
    "- Devuelve solo un JSON con el siguiente formato:\n"
    "{format_output}\n\n\n"
    "Nombre del viaje: {trip_name}"
)
detect_country_prompt = ChatPromptTemplate.from_messages([detect_country_system_msg])





llm = ChatOpenAI(model_name="o4-mini", temperature=1)
chain = LLMChain(llm=llm, prompt=prompt)
detect_country_chain = LLMChain(llm=llm, prompt=detect_country_prompt)

# === FastAPI app ===
app = FastAPI(title="TravelReel Itinerary API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


# 1) Crear + persistir todo & vincular al viaje
@app.post(
    "/api/itineraries",
    response_model=ItineraryCreateResponse,
    summary="Genera un itinerario"
)
async def create_itinerary_for_trip(
    req: ItineraryRequest = Body(...)
):
    logger.info(f"Received itinerary request for URL {req.url} in city {req.city}")
    try:
        
        # --- 1) Buscar el reel
        reel = (
                supabase
                .table("reels")
                .select("reel_id")
                .match({"video_url": req.url})
                .execute()
            )
        
        # --- 2) Si no existe el reel, hay que que ir realizar toda la lógica
        if not reel.data:

            # ─── 2.1) Download & extract audio ─────────────────────────────
            transcript = download_and_transcript(req)

            # ─── 2.3) Generate itinerary via LangChain ────────────────────
            result = chain.invoke({
                "transcript": transcript,
                "city": req.city,
                "format_instructions": parser.get_format_instructions()
            })

            # -- Parse a DayItinerary y extraemos la lista:
            day: DayItinerary = parser.parse(result["text"])
            ordered_items: List[ItineraryItem] = day.items

            # ─── 4) Geocode places ──────────────────────────────────────
            places = [it.place for it in ordered_items]
            geocoded = await geocode_places(places, req.city)
            lats, lngs, place_ids = zip(*geocoded)
            coords = list(zip(lats, lngs))

            # ─── 5) Solve TSP ────────────────────────────────────────────
            route = solve_tsp(coords)
            ordered_items = [ordered_items[i] for i in route]
            ordered_place_ids = [place_ids[i] for i in route]
            ordered_labels = [places[i] for i in route]

            # ─── 6) Build Maps URL ──────────────────────────────────────
            route_link = build_maps_url(ordered_place_ids, ordered_labels)

            # ─── 7) Persistir en Supabase ───────────────────────────────
            # --- 7.1) Inserto el reel
            reel = supabase.table("reels") \
                        .insert([{
                            "video_url": req.url,
                            "city": req.city,
                            "itinerary_json": json.dumps([i.dict() for i in ordered_items]),
                            "route_link": route_link
                        }]) \
                        .execute()
            
            # A pesar de hacer un insert, en reel.data tengo el registro insertado en forma de lista
            reel_id = reel.data[0]["reel_id"]

            # 7.2) itinerary
            itinerary = supabase.table("itineraries") \
                .insert([{
                    "reel_id": reel_id,
                    "description": ""
                }]) \
                .execute()

            itinerary_id = itinerary.data[0]["itinerary_id"]


            # 7.3) stops + stops_by_itinerary
            for item in ordered_items:
                stop = (
                    supabase
                    .table("stops")
                    .select("stop_id")
                    .match({"description": item.place,
                            "city": req.city})
                    .execute()
                )

                if stop.data:
                    stop_id = stop.data[0]["stop_id"]
                else:
                    stop_insert = supabase.table("stops") \
                        .insert([{
                            "description": item.place,
                            "city": req.city,
                            "original_time": item.order
                        }]) \
                        .execute()

                    stop_id = stop_insert.data[0]["stop_id"]

                supabase.table("stops_by_itinerary") \
                    .insert([{
                        "itinerary_id": itinerary_id,
                        "stop_id": stop_id,
                        "time": item.duration_minutes or 0,
                        "comments": item.notes or None,
                        "order": item.order
                    }]) \
                    .execute()

            # 7.4) link many-to-many
            #supabase.table("itineraries_by_trip") \
            #    .insert([{
            #        "itinerary_id": itinerary_id,
            #        "trip_id": trip_id
            #    }]) \
            #    .execute()

            # ─── 8) Devolver resultado ──────────────────────────────────
            return ItineraryCreateResponse(
                itinerary_id=itinerary_id,
                ordered=ordered_items,
                route_link=route_link
            )
    
   # except APIError as e:
   #     logger.error(f"Supabase API error: {e}")
   #      raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        logger.exception("Error processing itinerary request")
        raise HTTPException(status_code=500, detail=str(e))

# 2) añadir un itinerario existente a otro viaje
@app.post(
    "/api/itineraries/{itinerary_id}/trips",
    status_code=201,
    summary="Vincula un itinerario ya creado a un nuevo viaje"
)
async def add_itinerary_to_trip(
    itinerary_id: str = Path(...),
    body: LinkTripRequest = Body(...)
):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY, ClientOptions().replace(schema="travel-reel"))

    supabase.table("itineraries_by_trip").insert([{
        "itinerary_id": itinerary_id,
        "trip_id": body.trip_id
    }]).execute()
    return {"message": "Itinerario añadido al viaje"}

# 3) listar itinerarios de un viaje
@app.get(
    "/api/trips/{trip_id}/itineraries",
    response_model=List[ItineraryListItem],
    summary="Lista los itinerarios asociados a un viaje"
)
async def list_itineraries_of_trip(
    trip_id: str = Path(...)
):
    resp = supabase.rpc('list_itineraries_of_trip', {'trip_id_input': trip_id}).execute()
    
    logger.info(resp)

    return [
        ItineraryListItem(
            itinerary_id=r["itinerary_id"],
            itinerary_date=r["itinerary_date"],
            description=r["description"],
            count_stops=r["count_stops"],
            avg_time=r["avg_time"],
            categories=r["categories"]

        )
        for r in resp.data
    ]

# 4) detalle de un itinerario
@app.get(
    "/api/itineraries/{itinerary_id}",
    response_model=ItineraryResponse,
    summary="Obtiene el detalle de un itinerario (stops + route_link)"
)
async def get_itinerary_detail(
    itinerary_id: str = Path(...)
):
    # 4.1) stops ordenadas
    r1 = supabase.table("stops_by_itinerary")\
        .select("order, time, comments, stops(description, city)")\
        .eq("itinerary_id", itinerary_id)\
        .order("order")\
        .execute()
    stops_data = r1.data
    ordered = [
        ItineraryItem(
          order=s["order"],
          place=s["stops"]["description"],
          duration_minutes=s["time"],
          notes=s["comments"]
        )
        for s in stops_data
    ]

    # 4.2) route_link desde reels via itineraries
    r2 = supabase.table("itineraries")\
        .select("reel_id")\
        .eq("itinerary_id", itinerary_id)\
        .single().execute()
    reel_id = r2.data["reel_id"]

    r3 = supabase.table("reels")\
        .select("route_link")\
        .eq("reel_id", reel_id)\
        .single().execute()
    route_link = r3.data["route_link"]

    return ItineraryResponse(ordered=ordered, route_link=route_link)



@app.get(
    "/api/trips",
    response_model=List[TripSummary],
    summary="Lista los viajes con la cantidad de paradas de todos sus itinerarios"
)
async def list_trips_with_stops(created_by: str = Query(..., description="ID del usuario que creó los viajes")):
    try:
        resp = supabase.rpc("get_trip_summaries_with_stops", {"created_by": created_by}).execute()
    except Exception as e:
        raise HTTPException(500, detail=str(e))

    return resp.data  # [{ trip_id, name, country, stops_count }]
    
@app.get(
    "/api/trips/{trip_id}/stats",
    response_model=TripStats,
    summary="Estadísticas de un viaje: cantidad de itinerarios y paradas"
)
async def get_trip_stats(trip_id: str = Path(...)):
    # 1) Count itineraries
    it_resp = supabase.table("itineraries_by_trip")\
        .select("itinerary_id", count="exact")\
        .eq("trip_id", trip_id)\
        .execute()
    itineraries_count = it_resp.count or 0

    # 2) Fetch all itinerary_ids
    ids = [r["itinerary_id"] for r in supabase.table("itineraries_by_trip")
                                    .select("itinerary_id")
                                    .eq("trip_id", trip_id)
                                    .execute().data]
    # 3) Count stops
    if ids:
        stops_resp = supabase.table("stops_by_itinerary")\
            .select("stop_id", count="exact")\
            .in_("itinerary_id", ids)\
            .execute()
        stops_count = stops_resp.count or 0
    else:
        stops_count = 0

    return TripStats(itineraries_count=itineraries_count, stops_count=stops_count)



@app.post(
    "/api/detect-country",
    response_model=detectedCountry,
    summary="Detecta el país y continente a partir del nombre del viaje"
)
async def detect_country_endpoint(
    trip_name: str = Body(..., embed=True, description="Nombre del viaje")
):
    try:
        # Invoca la chain de LangChain
        result = detect_country_chain.invoke({
            "trip_name": trip_name,
            "format_output": country_detection_parser.get_format_instructions()
        })
        # Parsea la respuesta usando el parser de Pydantic
        parsed = country_detection_parser.parse(result["text"])
        return parsed
    except Exception as e:
        logger.exception("Error detecting country")
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/api/reels/{reel_id}",
    summary="Devuelve el JSON y el link de ruta de un reel",
)
async def get_reel_detail(
    reel_id: str = Path(...)
):
    r = supabase.table("reels")\
        .select("itinerary_json, route_link")\
        .eq("reel_id", reel_id)\
        .single().execute()
    if not r.data:
        raise HTTPException(status_code=404, detail="Reel no encontrado")
    return r.data