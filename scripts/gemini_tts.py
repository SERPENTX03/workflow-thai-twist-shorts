"""One line of speech via Gemini TTS -> 24 kHz mono wav. Called by voice.mjs for `gemini:<Voice>` voices.

  python scripts/gemini_tts.py --voice Finn --style "..." --text "..." --out line.wav

Key: GEMINI_API_KEY from the environment or the repo-root .env (git-ignored).
"""
import argparse, os, pathlib, sys, time, wave
from google import genai
from google.genai import types

MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-3.8-flash-tts")

def api_key():
    if os.environ.get("GEMINI_API_KEY"):
        return os.environ["GEMINI_API_KEY"].strip()
    env = pathlib.Path(__file__).resolve().parent.parent / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("GEMINI_API_KEY not found (set the env var or put it in .env)")

ap = argparse.ArgumentParser()
ap.add_argument("--voice", required=True)
ap.add_argument("--style", default="")
ap.add_argument("--text", required=True)
ap.add_argument("--out", required=True)
a = ap.parse_args()

client = genai.Client(api_key=api_key())
part = types.Part(text="## Transcript:\n" + a.text)
if a.style:
    part = types.Part(text="## Transcript:\n" + a.text,
                      speech_metadata=types.SpeechMetadata(style="Style: " + a.style))
cfg = types.GenerateContentConfig(
    temperature=1, response_modalities=["audio"],
    speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(
        prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=a.voice))))

for attempt in range(4):
    pcm = bytearray()
    try:
        for chunk in client.models.generate_content_stream(
                model=MODEL, contents=[types.Content(role="user", parts=[part])], config=cfg):
            if chunk.parts and chunk.parts[0].inline_data and chunk.parts[0].inline_data.data:
                pcm.extend(chunk.parts[0].inline_data.data)
        if pcm:
            break
    except Exception as e:  # rate limit on the free tier: back off and retry
        print(f"gemini_tts: {type(e).__name__}: {str(e)[:160]} (try {attempt + 1}/4)", file=sys.stderr)
    time.sleep(8 * (attempt + 1))
else:
    sys.exit("gemini_tts: no audio returned")

with wave.open(a.out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(bytes(pcm))
