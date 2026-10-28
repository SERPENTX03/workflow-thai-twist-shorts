// Long-form timing from the real voice: size every voiced shot to its measured line, then re-run audio.
//   node scripts/fit.mjs episodes/<slug>        (npm run fit -- episodes/<slug>)
// Needs assets/vo/index.json from a voice run (lines are cached, so the re-run after fitting costs nothing).
// For each shot with a line: beats = (voLead + line + tail + breath) rounded up to half a beat, plus `hold` beats
// (time to look after the line), never under `minBeats` (default 2). When the next line has another speaker
// (`who`, default "narrator") it adds `switchBreath` seconds, so two characters on the same voice are heard apart.
// Silent shots keep their beats. story.json knobs: breath (0.3 s), switchBreath (0.35 s), minBeats (2),
// fitStep (0.5 = round up to half a beat; a long-form film can use 0.125 for tighter cuts).
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const file = path.join(dir, 'story.json');
const story = JSON.parse(fs.readFileSync(file, 'utf8'));
const S = loadStory(dir);
const idxFile = path.join(dir, 'assets', 'vo', 'index.json');
if (!fs.existsSync(idxFile)) { console.error('✖ no assets/vo/index.json — run npm run voice first'); process.exit(1); }
const lines = new Map(JSON.parse(fs.readFileSync(idxFile, 'utf8')).map(v => [v.shot, v]));
const TAIL = 0.15, breath = story.breath ?? 0.3, switchBreath = story.switchBreath ?? 0.35, minBeats = story.minBeats ?? 2, step = story.fitStep ?? 0.5;
const who = s => s.who || 'narrator';

let stale = 0, changed = 0;
const before = S.total;
story.shots.forEach((shot, i) => {
  const s = S.shots[i], v = lines.get(i);
  if (!s.vo) return;
  if (!v || v.raw === undefined || v.vo !== s.vo) { stale++; console.log(`⚠ shot ${i}: line not voiced yet (or text changed) — run npm run voice, then fit again`); return; }
  const next = story.shots.slice(i + 1).find((x, k) => S.shots[i + 1 + k].vo);
  const gap = breath + (next && who(next) !== who(shot) ? switchBreath : 0);
  const need = Math.ceil((s.voLead + v.raw + TAIL + gap) / S.beat / step - 1e-6) * step;
  const beats = Math.round(Math.max(minBeats, need + (shot.hold || 0)) * 1000) / 1000;
  if (beats !== shot.beats) { shot.beats = beats; changed++; }
});
fs.writeFileSync(file, JSON.stringify(story, null, 2) + '\n');
const after = loadStory(dir).total;
console.log(`✓ fitted ${changed} shot(s): ${before.toFixed(1)}s → ${after.toFixed(1)}s (${Math.floor(after / 60)}:${String(Math.round(after % 60)).padStart(2, '0')})${stale ? `  ·  ${stale} line(s) not fitted` : ''}`);
console.log('  next: npm run audio -- ' + path.relative(process.cwd(), dir));
