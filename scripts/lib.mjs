// Shared helpers for the episode scripts.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

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
      fx: s.fx,
      view: s.view,
      who: s.who,
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
  return { ...story, bpm, beat, shots, totalBeats: b, total: round(b * beat), ...F, target: story.target || F.target };
}

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
