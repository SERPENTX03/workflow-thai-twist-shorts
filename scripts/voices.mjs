// Voice previews for the studio gallery: one line per voice role (voices.json) and one per character (src/cast.json),
// spoken by ElevenLabs with the role's voice id. Writes studio/audio/<kind>-<id>.mp3. Costs ElevenLabs credits.
//
//   npm run voices            only lines that changed (cached by voice, model, settings and text)
//   npm run voices -- --force  everything again
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT } from './lib.mjs';
import { elevenKey } from './eleven_tts.mjs';

const OUT = path.join(ROOT, 'studio', 'audio');
const CACHE = path.join(OUT, 'cache.json');
const force = process.argv.includes('--force');

async function tts({ voiceId, model, settings, text, out }) {
  const body = JSON.stringify({ text, model_id: model, voice_settings: settings });
  let lastErr = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: 'POST', headers: { 'xi-api-key': elevenKey(), 'Content-Type': 'application/json' }, body,
    });
    if (res.ok) { fs.writeFileSync(out, Buffer.from(await res.arrayBuffer())); return; }
    lastErr = `${res.status} ${(await res.text()).slice(0, 300)}`;
    if (res.status !== 429 && res.status < 500) break;   // quota, bad voice or bad key: retrying will not help
    await new Promise(r => setTimeout(r, 4000 * (attempt + 1)));
  }
  throw new Error(`ElevenLabs TTS failed: ${lastErr}`);
}

const V = JSON.parse(fs.readFileSync(path.join(ROOT, 'voices.json'), 'utf8'));
const CAST = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'cast.json'), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};

// tone is sent as v3 audio tags in front of the line: "slowly, warm" -> "[slowly] [warm] line"
const tagged = (tone, line) => (tone ? tone.split(',').map(t => `[${t.trim()}]`).join(' ') + ' ' + line : line);
const jobs = [
  ...Object.entries(V.roles).map(([id, r]) => ({ file: `role-${id}.mp3`, role: id, text: tagged(r.tone, r.line) })),
  ...Object.entries(CAST).filter(([id, c]) => !id.startsWith('_') && c.role && c.line)
    .map(([id, c]) => ({ file: `cast-${id}.mp3`, role: c.role, text: tagged(c.tone, c.line) })),
];

let made = 0;
for (const j of jobs) {
  const role = V.roles[j.role];
  if (!role) throw new Error(`${j.file}: unknown voice role "${j.role}" (voices.json roles: ${Object.keys(V.roles).join(', ')})`);
  const hash = crypto.createHash('sha1').update(JSON.stringify([role.id, V.model, V.settings, j.text])).digest('hex').slice(0, 16);
  const out = path.join(OUT, j.file);
  if (!force && cache[j.file] === hash && fs.existsSync(out)) continue;
  process.stdout.write(`${j.file} (${j.role}) ... `);
  await tts({ voiceId: role.id, model: V.model, settings: V.settings, text: j.text, out });
  cache[j.file] = hash;
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));
  made++;
  console.log('ok');
}
console.log(`${made} made, ${jobs.length - made} unchanged -> studio/audio`);
