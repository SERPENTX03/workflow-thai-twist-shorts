// Thai voiceover from story.json (needs internet). `voice` is an edge-tts voice (th-TH-NiwatNeural) or a
// Gemini voice written `gemini:<Name>` (e.g. gemini:Finn; key in .env, style from `voiceStyle`).
// `voices` maps role names to voice ids ({"male":"gemini:Finn","female":"gemini:Sulafat"}); a shot may set
// "voice" (a role or an id) to override the episode voice for its line.
// One line per shot (shot.vo, default = its caption), fitted inside the shot (max 1.3x speed-up),
// then laid onto one track: assets/voice.wav + assets/vo/index.json (used by score.mjs to duck).
//
//   node scripts/voice.mjs episodes/<slug>
//   pip install edge-tts      (once)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { episodeDir, loadStory, run, mediaDuration, round } from './lib.mjs';

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

const index = [];
for (const s of S.shots) {
  if (!s.vo) continue;
  const id = String(s.i).padStart(2, '0');
  const voice = s.voice ? pick(s.voice) : VOICE;
  const mp3 = path.join(out, `${id}.${voice.startsWith('gemini:') ? 'g.wav' : 'mp3'}`), raw = path.join(out, `${id}_raw.wav`), wav = path.join(out, `${id}.wav`);
  if (voice.startsWith('gemini:')) run('python', ['-I', path.join(HERE, 'gemini_tts.py'), '--voice', voice.slice(7), '--style', STYLE, '--text', s.vo, '--out', mp3]);
  else run('python', ['-m', 'edge_tts', '--voice', voice, `--rate=${RATE}`, `--pitch=${PITCH}`, '--text', s.vo, '--write-media', mp3]);
  run('ffmpeg', ['-v', 'error', '-y', '-i', mp3, '-af',
    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
    '-ar', '48000', '-ac', '1', raw]);
  const room = s.dur - s.voLead - TAIL;
  const d = mediaDuration(raw);
  const tempo = Math.min(1.3, Math.max(1, d / room));
  run('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-af', `atempo=${tempo.toFixed(3)}`, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
  fs.rmSync(mp3); fs.rmSync(raw);
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
