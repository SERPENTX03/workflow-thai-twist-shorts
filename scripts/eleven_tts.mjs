// One line of speech via ElevenLabs -> mp3. Used by voice.mjs for `eleven:<Name or voice_id>` voices.
//
// Key: ELEVENLABS_API_KEY from the environment or the repo-root .env (git-ignored).
// A voice is resolved in this order: scripts/eleven-voices.json alias -> a 20-character voice id ->
// a name search in your account (needs the key's "Voices: Read" permission).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const API = 'https://api.elevenlabs.io';

export function elevenKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const env = path.join(ROOT, '.env');
  if (fs.existsSync(env)) {
    for (const line of fs.readFileSync(env, 'utf8').split(/\r?\n/)) {
      if (line.startsWith('ELEVENLABS_API_KEY=')) return line.slice(19).trim().replace(/^["']|["']$/g, '');
    }
  }
  throw new Error('ELEVENLABS_API_KEY not found (set the env var or put it in .env)');
}

async function api(pathname, init = {}) {
  return fetch(API + pathname, { ...init, headers: { 'xi-api-key': elevenKey(), ...(init.headers || {}) } });
}

export async function searchVoices(query) {
  const res = await api(`/v2/voices?search=${encodeURIComponent(query)}&page_size=50`);
  if (!res.ok) {
    const hint = res.status === 401 || res.status === 403 ? ' — give the API key "Voices: Read", or put the voice id in scripts/eleven-voices.json' : '';
    throw new Error(`voice search failed (${res.status})${hint}`);
  }
  const data = await res.json();
  return (data.voices || []).map(v => ({ id: v.voice_id, name: v.name, category: v.category }));
}

const ID_LIKE = /^[A-Za-z0-9]{20}$/;

export async function resolveVoice(nameOrId) {
  const aliasFile = path.join(HERE, 'eleven-voices.json');
  const aliases = fs.existsSync(aliasFile) ? JSON.parse(fs.readFileSync(aliasFile, 'utf8')) : {};
  const key = Object.keys(aliases).find(k => k.toLowerCase() === nameOrId.toLowerCase());
  if (key && aliases[key]) return aliases[key];
  if (ID_LIKE.test(nameOrId)) return nameOrId;
  const found = await searchVoices(nameOrId);
  const hit = found.find(v => v.name.toLowerCase() === nameOrId.toLowerCase())
    || found.find(v => v.name.toLowerCase().startsWith(nameOrId.toLowerCase()));
  if (!hit) {
    throw new Error(`voice "${nameOrId}" not found in your account. Open it in ElevenLabs → "Add to my voices", copy its voice id, and put it in scripts/eleven-voices.json`);
  }
  return hit.id;
}

export async function elevenTTS({ voice, text, out, model, lang, settings }) {
  const voiceId = await resolveVoice(voice);
  const body = { text, model_id: model, voice_settings: settings };
  if (lang) body.language_code = lang;
  let lastErr = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await api(`/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (res.ok) { fs.writeFileSync(out, Buffer.from(await res.arrayBuffer())); return; }
    lastErr = `${res.status} ${(await res.text()).slice(0, 300)}`;
    if (res.status !== 429 && res.status < 500) break; // quota, bad voice or bad key: retrying will not help
    await new Promise(r => setTimeout(r, 4000 * (attempt + 1)));
  }
  throw new Error(`ElevenLabs TTS failed: ${lastErr}`);
}
