// Replaces build.mjs. story.json + assets/vo/index.json -> episodes/<slug>/timeline.json,
// links voice.wav / score.wav into public/<slug>/ (Remotion staticFile) and regenerates the episode registry.
//   node scripts/timeline.mjs episodes/<slug>
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
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
  vo: fs.existsSync(voIdx) ? withGaps(JSON.parse(fs.readFileSync(voIdx, 'utf8'))) : [],
};

// Pauses inside each voice line ([from, to] seconds from the line's start), so phrase captions (`captionMode: "phrase"`,
// src/engine/phrases.ts) can switch where the voice actually breathes. Cached in assets/vo/gaps.json by file size + mtime.
function withGaps(index) {
  const cacheFile = path.join(dir, 'assets', 'vo', 'gaps.json');
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
  let fresh = 0;
  const out = index.map(v => {
    const wav = path.join(dir, 'assets', 'vo', v.file);
    if (!fs.existsSync(wav)) return v;
    const st = fs.statSync(wav), key = `${v.file}:${st.size}:${Math.round(st.mtimeMs)}`;
    if (!cache[key]) {
      fresh++;
      const log = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', wav, '-af', 'silencedetect=n=-38dB:d=0.08', '-f', 'null', '-'], { encoding: 'utf8' }).stderr ?? '';
      const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]);
      const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
      cache[key] = starts.map((a, k) => [Math.round(a * 100) / 100, Math.round((ends[k] ?? v.dur) * 100) / 100]).filter(([a, b]) => a > 0.05 && b < v.dur - 0.05);
    }
    return { ...v, gaps: cache[key] };
  });
  if (fresh) fs.writeFileSync(cacheFile, JSON.stringify(cache));
  return out;
}
fs.writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify(timeline, null, 2) + '\n');
writeRegistry();
console.log(`✓ episodes/${slug}/timeline.json  ${S.shots.length} shots, ${S.total.toFixed(1)}s, audio: ${Object.keys(audio).join(', ') || 'none yet'}`);
