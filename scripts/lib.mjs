// Shared helpers for the episode scripts.
import fs from 'node:fs';
import path from 'node:path';
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
      vo: s.vo === undefined ? (s.text || '').replace(/\n/g, ' ').replace(/[“”"]/g, '') : s.vo,
      voLead: s.voLead ?? 0.12,
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
  return { ...story, bpm, beat, shots, totalBeats: b, total: round(b * beat) };
}

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
