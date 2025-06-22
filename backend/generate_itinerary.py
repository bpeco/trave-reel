import os
import sys
from moviepy.video.io.VideoFileClip import VideoFileClip
from dotenv import load_dotenv
import openai
import json

from typing import List, Optional
from pydantic import BaseModel, Field, ValidationError

from langchain.chat_models import ChatOpenAI
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser

# ─── 1. Configuración API ─────────────────────────────────────────────────────

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# ─── 2. Modelos Pydantic ───────────────────────────────────────────────────────

class ItineraryItem(BaseModel):
    order: int = Field(..., description="Posición en el día, de forma cronológica")
    place: str = Field(..., description="Nombre del sitio o actividad")
    #start_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="Hora de inicio (HH:MM)")
    duration_minutes: Optional[int] = Field(..., description="Duración en minutos")
    notes: Optional[str] = Field(None, description="Comentarios adicionales")

class DayItinerary(BaseModel):
    city: str = Field(..., description="Ciudad para la que se genera el itinerario")
    items: List[ItineraryItem]

# Parser que convierte la salida JSON en nuestro DayItinerary
parser = PydanticOutputParser(pydantic_object=DayItinerary)

# ─── 3. Definición del Prompt con LangChain ───────────────────────────────────

# Mensaje de sistema
system_msg = SystemMessagePromptTemplate.from_template(
    "Eres un asistente que genera itinerarios de un día en una ciudad específica.\n\n"
    "Genera **solo** un JSON que cumpla este esquema:\n\n"
    "{format_instructions}\n\n"
    "Si no podes deducir algún campo del JSON a partir de la transcripción y si el campo permite ser nulo, dejalo vacío.\n\n"
    "Es decir, si no se menciona la duración para una actividad, no inventes una.\n\n"
    "Sin embargo, siempre intentá llenar el campo, solamente no inventes información."
    "Transcripción de audio:\n\"\"\"\n{transcript}\n\"\"\"\n\n"
    "Ciudad: {city}"
)


prompt = ChatPromptTemplate.from_messages([system_msg])

# Modelo de LLM: o4-mini
llm = ChatOpenAI(model_name="o4-mini", temperature=1)

# Cadena que unirá LLM + Prompt
chain = LLMChain(llm=llm, prompt=prompt)

# ─── 4. Funciones de Audio y Transcripción ────────────────────────────────────

def extract_audio(video_path: str, audio_path: str = "temp_audio.wav") -> str:
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path, codec="pcm_s16le")
    video.close()
    return audio_path

def transcribe_audio(audio_path: str) -> str:
    with open(audio_path, "rb") as f:
        # Llamada a Whisper vía v1 del SDK openai
        transcript = openai.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            response_format="text"
        )
    # Guardamos por si queremos revisar
    with open("transcription.txt", "w") as tf:
        tf.write(transcript)
    return transcript

# ─── 5. Generación y Parseo del Itinerario ───────────────────────────────────

def generate_itinerary(transcript: str, city: str) -> DayItinerary:
    # Invocamos la chain, pasando también las instrucciones de formato
    result = chain.invoke({
        "transcript": transcript,
        "city": city,
        "format_instructions": parser.get_format_instructions()
    })
    raw_output = result["text"]

    try:
        itinerary = parser.parse(raw_output)
        return itinerary
    except ValidationError as e:
        print("❌ Error validando la respuesta del LLM:\n", e)
        print("Salida cruda del LLM:\n", raw_output)
        sys.exit(1)


import yt_dlp

def fetch_tiktok_video(url: str, output_path: str = "video.mp4") -> str:
    """
    Descarga el vídeo de TikTok apuntado por `url`
    y lo guarda en `output_path`. Devuelve la ruta.
    """
    ydl_opts = {
        "format": "mp4",
        "outtmpl": output_path,
        # podrías afinar con "retries", "quiet", etc.
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return output_path


# ─── 6. Script de Línea de Comandos ───────────────────────────────────────────

if __name__ == "__main__":

    if len(sys.argv) != 3:
        print("Uso: python generate_itinerary.py <video.mp4|TikTok URL> <Ciudad>")
        sys.exit(1)

    source = sys.argv[1]
    city   = sys.argv[2]

    # Si source es una URL de TikTok, la bajamos primero
    if source.startswith("http"):
        print("📥 Descargando video de TikTok…")
        video_file = fetch_tiktok_video(source)
    else:
        video_file = source

    print("1️⃣ Extrayendo audio…")
    audio_file = extract_audio(video_file)

    print("2️⃣ Transcribiendo con Whisper…")
    transcript = transcribe_audio(audio_file)
    print("   → Transcripción guardada en transcription.txt")
    print(f"   → Preview: {transcript[:200]}…\n")

    print("3️⃣ Generando itinerario estructurado…")
    itinerary = generate_itinerary(transcript, city)

    print("\n🎒 Itinerario generado:\n")
    print(itinerary.model_dump_json(indent=2))
