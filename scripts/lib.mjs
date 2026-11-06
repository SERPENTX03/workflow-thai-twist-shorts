// Shared helpers for the episode scripts.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Route temp directory to .remotion-temp in workspace to avoid filling C: drive
// (ROOT is declared further down; a const can't be read before its line, so resolve the repo root here directly)
const remotionTempDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.remotion-temp');
if (!fs.existsSync(remotionTempDir)) {
  try {
    fs.mkdirSync(remotionTempDir, { recursive: true });
  } catch {}
}
process.env.TEMP = remotionTempDir;
process.env.TMP = remotionTempDir;

export function episodeDir(arg) {
  if (!arg) die('usage: node scripts/<script>.mjs episodes/<slug>');
  const dir = path.resolve(arg);
  if (!fs.existsSync(path.join(dir, 'story.json'))) die(`no story.json in ${dir}`);
  return dir;
}

export function die(msg) {
  console.error('✖ ' + msg);
  process.exit(1);
}

// story.json -> shots with absolute timing on the beat grid
export function loadStory(dir) {
  const story = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
  const bpm = story.bpm || 75;
  const beat = 60 / bpm;
  let b = 0;
  const shots = story.shots.map((s, i) => {
    if (!s.scene) die(`shot ${i} has no scene`);
    if (!s.beats) die(`shot ${i} has no beats`);
    const shot = {
      i,
      scene: s.scene,
      beats: s.beats,
      style: s.style || 'plain',
      text: s.text || '',
      vo: s.vo === undefined ? plain(s.text || '').replace(/\n/g, ' ').replace(/[“”"]/g, '') : s.vo,
      voLead: s.voLead ?? 0.12,
      tempo: s.tempo,
      fx: s.fx,
      view: s.view,
      who: s.who,
      chapter: s.chapter,
      hush: !!s.hush,
      voice: s.voice,
      tone: s.tone,
      cues: s.cues || [],
      mood: s.mood ?? 0.5,
      music: !!s.music,
      beat: b,
      start: round(b * beat),
      dur: round(s.beats * beat),
    };
    b += s.beats;
    return shot;
  });
  const F = FORMATS[story.format === 'landscape' ? 'landscape' : 'portrait'];
  const total = round(b * beat);
  return { ...story, bpm, beat, shots, totalBeats: b, total, chapters: chaptersOf(shots, total), ...F, target: story.target || F.target };
}

// Chapters: a shot with `"chapter": "name"` starts one; it runs until the next. Shots before the first marker form
// chapter 0 ("เปิดเรื่อง"). No markers = no chapters. `from`/`to` are frames (to is inclusive), for remotion --frames.
export const FPS = 30;
export function chaptersOf(shots, total) {
  if (!shots.some(s => s.chapter)) return [];
  const out = [];
  for (const s of shots) {
    if (s.chapter || !out.length) out.push({ n: out.length, name: s.chapter || 'เปิดเรื่อง', first: s.i, start: s.start });
    out[out.length - 1].last = s.i;
  }
  return out.map((c, k) => {
    const end = k + 1 < out.length ? out[k + 1].start : total;
    return { ...c, dur: round(end - c.start), from: Math.round(c.start * FPS), to: Math.round(end * FPS) - 1 };
  });
}

export const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// story.json `format`: "portrait" (default, 9:16 Shorts) or "landscape" (16:9 long-form for YouTube).
// target = runtime range in seconds that story-check and qc compare against; capChars = max Thai characters per caption line.
export const FORMATS = {
  portrait: { format: 'portrait', W: 1080, H: 1920, target: [55, 80], capChars: 26 },
  landscape: { format: 'landscape', W: 1920, H: 1080, target: [600, 720], capChars: 42 },
};

export const round = x => Math.round(x * 1000) / 1000;

// run npx (a .cmd shim on Windows) through the shell as one quoted string
export function npx(args, opts = {}) {
  const q = a => (/[\s"]/.test(a) ? '"' + a.replace(/"/g, '\\"') + '"' : a);
  return spawnSync(['npx', ...args].map(q).join(' '), { shell: true, ...opts });
}

export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', shell: process.platform === 'win32' && cmd === 'npx', ...opts });
  if (r.status !== 0) die(`${cmd} ${args.slice(0, 3).join(' ')} failed:\n${r.stderr || r.stdout}`);
  return r.stdout;
}

export function mediaDuration(file) {
  return parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]));
}

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// caption keyword marks: [คำ] = gold highlight, {คำ} = red word
export const plain = s => String(s).replace(/[[\]{}]/g, '');
export const marks = s => esc(s)
  .replace(/\[([^\]]+)\]/g, '<span class="hl">$1</span>')
  .replace(/\{([^}]+)\}/g, '<span class="hl-red">$1</span>');

// Generated sound effects (ElevenLabs) live in one repo-level library keyed by their settings, so the same
// prompt is paid for once and reused by every episode. story.json `sfx` entries: { prompt, dur, influence?, gain? }.
export const SFX_LIB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'sfx-library');
export const sfxSpec = e => ({ prompt: String(e.prompt || '').trim(), dur: e.dur ?? 2, influence: e.influence ?? 0.5 });
export const sfxKey = e => crypto.createHash('sha1').update(JSON.stringify(sfxSpec(e))).digest('hex').slice(0, 16);
export const sfxFile = e => path.join(SFX_LIB, `${sfxKey(e)}.mp3`);

// ---- Remotion glue ----
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// episodes/room-7 -> "Room7" (the Remotion composition id)
export const compId = slug => slug.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');

// Regenerates src/episodes/index.ts from every episodes/<slug>/story.json.
// Optional per-episode files: src/episodes/<slug>/scenes.tsx (default export {sceneName: ShotComponent}),
// episodes/<slug>/timeline.json (written by `npm run timeline`; carries the audio tracks).
export function writeRegistry() {
  const slugs = fs.readdirSync(path.join(ROOT, 'episodes'), { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(ROOT, 'episodes', d.name, 'story.json')))
    .map(d => d.name).sort();
  const imports = [], items = [];
  slugs.forEach((slug, n) => {
    imports.push(`import story${n} from '../../episodes/${slug}/story.json';`);
    let scenes = '{}', audio = 'undefined';
    if (fs.existsSync(path.join(ROOT, 'src', 'episodes', slug, 'scenes.tsx'))) {
      imports.push(`import scenes${n} from './${slug}/scenes';`);
      scenes = `scenes${n}`;
    }
    if (fs.existsSync(path.join(ROOT, 'episodes', slug, 'timeline.json'))) {
      imports.push(`import timeline${n} from '../../episodes/${slug}/timeline.json';`);
      audio = `timeline${n}.audio`;
    }
    items.push(`  defineEpisode('${compId(slug)}', story${n} as unknown as Story, ${scenes}, ${audio}),`);
  });
  fs.writeFileSync(path.join(ROOT, 'src', 'episodes', 'index.ts'),
`// GENERATED by scripts/lib.mjs writeRegistry() (run by npm run new / timeline / check) — do not edit.
import {defineEpisode} from '../engine/episode';
import type {Story} from '../engine/story';
${imports.join('\n')}

export const EPISODES = [
${items.join('\n')}
];
`);
  return slugs;
}
