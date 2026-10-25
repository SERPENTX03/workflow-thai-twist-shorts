// Thai voiceover from story.json (needs internet). `voice` is an edge-tts voice (th-TH-NiwatNeural), a
// Gemini voice written `gemini:<Name>` (e.g. gemini:Finn; key in .env, style from `voiceStyle`) or an
// ElevenLabs voice written `eleven:<Name or voice_id>` (e.g. eleven:Jessica; ELEVENLABS_API_KEY in .env;
// `voiceModel`, `voiceLang`, `voiceSpeed`, `voiceSettings` are optional).
// `voices` maps role names to voice ids ({"male":"eleven:Vasko","female":"eleven:Jessica"}); a shot may set
// "voice" (a role or an id) to override the episode voice for its line, and "tone" (ElevenLabs v3 audio tags,
// e.g. "whispers", "scared", "sad, softly") to set how the line is acted; the tags are sent as "[tone] line".
// One line per shot (shot.vo, default = its caption), fitted inside the shot (max 1.3x speed-up),
// then laid onto one track: assets/voice.wav + assets/vo/index.json (used by score.mjs to duck).
//
//   node scripts/voice.mjs episodes/<slug>
//   pip install edge-tts      (once)
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { episodeDir, loadStory, run, mediaDuration, round, die } from './lib.mjs';
import { elevenTTS } from './eleven_tts.mjs';

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROLES = S.voices || {};
const pick = v => ROLES[v] || v;
const VOICE = pick(S.voice || 'th-TH-NiwatNeural');
const STYLE = S.voiceStyle || '';
const RATE = S.voiceRate || '-8%';
const PITCH = S.voicePitch || '-6Hz';
const TAIL = 0.15;
const out = path.join(dir, 'assets', 'vo');
fs.mkdirSync(out, { recursive: true });

// ElevenLabs: model, language and voice settings come from story.json (all optional)
const E_MODEL = S.voiceModel || 'eleven_v3';
const E_LANG = S.voiceLang || '';
const E_SETTINGS = { stability: 0.5, similarity_boost: 0.75, ...(S.voiceSpeed ? { speed: S.voiceSpeed } : {}), ...(S.voiceSettings || {}) };

// A line is synthesized once: the raw result is cached by (voice, settings, text), so re-running after an edit
// only pays for the lines that changed. Cache lives in assets/vo/cache (git-ignored with assets/vo).
const cacheDir = path.join(out, 'cache');
fs.mkdirSync(cacheDir, { recursive: true });

const index = [];
for (const s of S.shots) {
  if (!s.vo) continue;
  const id = String(s.i).padStart(2, '0');
  // a typo'd role ("femal") would otherwise fall through to edge-tts and read the line in the wrong voice
  if (s.voice && !ROLES[s.voice] && !/^(eleven|gemini):|^[a-z]{2}-[A-Z]{2}-/.test(s.voice))
    die(`shot ${s.i}: unknown voice role "${s.voice}" (roles: ${Object.keys(ROLES).join(', ')})`);
  const voice = s.voice ? pick(s.voice) : VOICE;
  const provider = voice.startsWith('gemini:') ? 'gemini' : voice.startsWith('eleven:') ? 'eleven' : 'edge';
  const ext = provider === 'gemini' ? 'wav' : 'mp3';
  const tone = s.tone || S.voiceTone;
  const eText = tone ? String(tone).split(',').map(t => `[${t.trim()}]`).join(' ') + ' ' + s.vo : s.vo;
  const key = crypto.createHash('sha1').update(JSON.stringify(
    provider === 'eleven' ? [voice, E_MODEL, E_LANG, E_SETTINGS, eText]
      : provider === 'gemini' ? [voice, STYLE, s.vo] : [voice, RATE, PITCH, s.vo])).digest('hex').slice(0, 16);
  const mp3 = path.join(cacheDir, `${key}.${ext}`), raw = path.join(out, `${id}_raw.wav`), wav = path.join(out, `${id}.wav`);
  if (!fs.existsSync(mp3)) {
    if (provider === 'gemini') run('python', ['-I', path.join(HERE, 'gemini_tts.py'), '--voice', voice.slice(7), '--style', STYLE, '--text', s.vo, '--out', mp3]);
    else if (provider === 'eleven') {
      try { await elevenTTS({ voice: voice.slice(7), text: eText, out: mp3, model: E_MODEL, lang: E_LANG, settings: E_SETTINGS }); }
      catch (e) { die(`line ${id}: ${e.message}`); }
    }
    else run('python', ['-m', 'edge_tts', '--voice', voice, `--rate=${RATE}`, `--pitch=${PITCH}`, '--text', s.vo, '--write-media', mp3]);
  }
  run('ffmpeg', ['-v', 'error', '-y', '-i', mp3, '-af',
    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
    '-ar', '48000', '-ac', '1', raw]);
  const room = s.dur - s.voLead - TAIL;
  const d = mediaDuration(raw);
  const tempo = Math.min(1.3, Math.max(1, d / room));
  run('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-af', `atempo=${tempo.toFixed(3)}`, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
  fs.rmSync(raw);
  const len = mediaDuration(wav);
  const over = len > room + 0.02;
  index.push({ shot: s.i, file: `${id}.wav`, start: round(s.start + s.voLead), dur: round(len), tempo: round(tempo) });
  console.log(`${id}  ${len.toFixed(2)}s / ${s.dur.toFixed(1)}s ${tempo > 1 ? 'x' + tempo.toFixed(2) : '     '} ${over ? '⚠ OVER — shorten the line or add beats' : ''}  ${s.vo}`);
}
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 1));

// lay all lines on one track at their shot times
const inputs = index.flatMap(v => ['-i', path.join(out, v.file)]);
const delays = index.map((v, k) => `[${k}:a]adelay=${Math.round(v.start * 1000)}:all=1[a${k}]`).join(';');
// speech sits at -16 LUFS; score.mjs keeps the bed ~10 dB under it while a line plays
const mix = index.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${index.length}:normalize=0,highpass=f=90,loudnorm=I=-16:TP=-2:LRA=7,aresample=48000,apad=whole_dur=${S.total},atrim=0:${S.total}[out]`;
run('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', `${delays};${mix}`, '-map', '[out]', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', path.join(dir, 'assets', 'voice.wav')]);
console.log(`✓ assets/voice.wav  (${index.length} lines, voice ${VOICE})`);
