// Replaces build.mjs. story.json + assets/vo/index.json -> episodes/<slug>/timeline.json,
// links voice.wav / score.wav into public/<slug>/ (Remotion staticFile) and regenerates the episode registry.
//   node scripts/timeline.mjs episodes/<slug>
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory, writeRegistry, compId, ROOT } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const slug = path.basename(dir);
const pub = path.join(ROOT, 'public', slug);
fs.mkdirSync(pub, { recursive: true });

const audio = {};
for (const [key, file] of [['voice', 'voice.wav'], ['score', 'score.wav']]) {
  const src = path.join(dir, 'assets', file);
  if (!fs.existsSync(src)) continue;
  const dst = path.join(pub, file);
  fs.rmSync(dst, { force: true });
  try { fs.linkSync(src, dst); } catch { fs.copyFileSync(src, dst); }
  audio[key] = `${slug}/${file}`;
}
const voIdx = path.join(dir, 'assets', 'vo', 'index.json');
const timeline = {
  slug, id: compId(slug), format: S.format, W: S.W, H: S.H, bpm: S.bpm, total: S.total,
  audio,
  shots: S.shots.map(s => ({ i: s.i, scene: s.scene, start: s.start, dur: s.dur })),
  chapters: S.chapters,
  vo: fs.existsSync(voIdx) ? JSON.parse(fs.readFileSync(voIdx, 'utf8')) : [],
};
fs.writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify(timeline, null, 2) + '\n');
writeRegistry();
console.log(`✓ episodes/${slug}/timeline.json  ${S.shots.length} shots, ${S.total.toFixed(1)}s, audio: ${Object.keys(audio).join(', ') || 'none yet'}`);
