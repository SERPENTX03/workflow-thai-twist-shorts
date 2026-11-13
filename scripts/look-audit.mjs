// Light & depth audit (offline, read-only) of the Board frames: the numbers behind
// .claude/skills/thai-twist-short/references/depth-light.md.
//   node scripts/look-audit.mjs episodes/<slug> [--chapter <n>] [--list] [--all]   (npm run look -- episodes/<slug>)
// Needs out/<slug>-board/element-*.jpeg (npm run check, or npm run chapter -- … --board). Each frame is shrunk to a
// 96 px grey thumbnail by ffmpeg and measured above the caption band:
//   shadow  share of pixels with luma < 45      contrast  p95 − p5 of luma
//   light   brightest third / darkest third of the frame (columns or rows): ~1.0 = lit evenly from nowhere
// Judged by the shot's mood (data.light) — depth-light.md §2:
//   suspense  dark | dim | noir           shadow ≥ 60 %
//   night     night | lamp | lantern      shadow ≥ 45 %
//   every set shot (not cards)            light from one side: brightest/darkest third ≥ 1.25 (else "flat")
//                                         a frame under half shadow needs contrast ≥ 70 (else "washed out" — grey fog);
//                                         not ≥ 90 % black with contrast < 50 ("murky": a suspense frame still lights the
//                                         subject). A mostly dark frame with one lit pool is the chiaroscuro look, not washed out.
//   red-box lines (style "red")           darker than the median camera frame (the turn is the darkest frame)
// and from story.json alone: one figure dead centre (screen x within 6 % of the middle) on an eye-level view.
// Advisory: always exits 0. A clean audit does not mean the frame is good — look at it.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { episodeDir, loadStory, FORMATS, ROOT, clock } from './lib.mjs';

const args = process.argv.slice(2);
const dir = episodeDir(args[0]);
const slug = path.basename(dir);
const LIST = args.includes('--list');
const ALL = args.includes('--all');
const chIdx = args.indexOf('--chapter');
const CHAPTER = chIdx > 0 ? Number(args[chIdx + 1]) : undefined;

const S = loadStory(dir);
const RAW = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8')).shots;
const portrait = S.format !== 'landscape';
const { W, H } = FORMATS[S.format ?? 'portrait'] ?? (portrait ? { W: 1080, H: 1920 } : { W: 1920, H: 1080 });
const TW = portrait ? 54 : 96, TH = portrait ? 96 : 54;
// rows kept: above the caption band (portrait: captions ≈ y 1390, bottom 380 px carries nothing; landscape: subtitles
// in the bottom 220 px)
const KEEP = Math.floor(TH * (portrait ? 0.66 : 0.79));

const board = path.join(ROOT, 'out', `${slug}-board`);
if (!fs.existsSync(board)) {
  console.log(`look audit — ${slug}: no Board frames in out/${slug}-board/ — run npm run check -- episodes/${slug} first`);
  process.exit(0);
}
const files = new Map();
let pad = 3;
for (const f of fs.readdirSync(board)) {
  const m = f.match(/^element-(\d+)\.jpe?g$/);
  if (m) { files.set(Number(m[1]), path.join(board, f)); pad = m[1].length; }
}

let range = S.shots.map(s => s.i);
let label = 'film';
if (CHAPTER !== undefined) {
  const c = S.chapters.find(c => c.n === CHAPTER);
  if (!c) { console.log(`no chapter ${CHAPTER} (npm run chapter -- episodes/${slug} lists them)`); process.exit(0); }
  range = range.slice(c.first, c.last + 1);
  label = `chapter ${c.n} "${c.name}" (shots ${c.first}–${c.last})`;
}
const have = range.filter(i => files.has(i));
const storyTime = fs.statSync(path.join(dir, 'story.json')).mtimeMs;
const stale = have.filter(i => fs.statSync(files.get(i)).mtimeMs < storyTime).length;

/** grey thumbnails of shots a…b (one ffmpeg call over the numbered sequence) */
function thumbs(a, b) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-f', 'image2', '-start_number', String(a), '-i', path.join(board, `element-%0${pad}d.jpeg`),
    '-frames:v', String(b - a + 1), '-vf', `scale=${TW}:${TH}:flags=area,format=gray`, '-f', 'rawvideo', 'pipe:1'], { maxBuffer: 1 << 28 });
  if (r.status) { console.log(`ffmpeg failed: ${String(r.stderr).slice(0, 300)}`); process.exit(0); }
  return r.stdout;
}

/** contiguous runs of available frames, so a gap does not stop the image2 sequence */
const metrics = new Map();
for (let k = 0; k < have.length;) {
  let e = k;
  while (e + 1 < have.length && have[e + 1] === have[e] + 1) e++;
  const buf = thumbs(have[k], have[e]);
  for (let j = k; j <= e; j++) metrics.set(have[j], measure(buf.subarray((j - k) * TW * TH, (j - k + 1) * TW * TH)));
  k = e + 1;
}

function measure(px) {
  const vals = [];
  const col = [0, 0, 0], row = [0, 0, 0], colN = [0, 0, 0], rowN = [0, 0, 0];
  for (let y = 0; y < KEEP; y++) for (let x = 0; x < TW; x++) {
    const v = px[y * TW + x];
    vals.push(v);
    const cx = Math.min(2, Math.floor((x / TW) * 3)), ry = Math.min(2, Math.floor((y / KEEP) * 3));
    col[cx] += v; colN[cx]++; row[ry] += v; rowN[ry]++;
  }
  vals.sort((a, b) => a - b);
  const q = p => vals[Math.min(vals.length - 1, Math.floor(p * vals.length))];
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  const third = (s, n) => s.map((v, i) => v / n[i] + 4); // +4: a black third does not divide by zero
  const c3 = third(col, colN), r3 = third(row, rowN);
  const light = Math.max(Math.max(...c3) / Math.min(...c3), Math.max(...r3) / Math.min(...r3));
  return { mean, shadow: vals.filter(v => v < 45).length / vals.length, high: vals.filter(v => v > 170).length / vals.length, contrast: q(0.95) - q(0.05), light };
}

// ---------------------------------------------------------------- judging
const CARD_SCENE = /^(example-)?(rule|rules|title|diagram|news|map|next|card|end|endcard|notebook|facts?)$/i;
const NOT_EYE = /(^|-)(close|ecu|ins|low|high|top|dutch|ots|pov|fif|sil|split|mirror|cctv|snap)(-|$)/;
const MOOD = { dark: 'suspense', dim: 'suspense', noir: 'suspense', night: 'night', lamp: 'night', lantern: 'night' };
const NEED = { suspense: 0.6, night: 0.45 };
const pct = x => `${Math.round(x * 100)}%`;

const cam = have.filter(i => !CARD_SCENE.test(S.shots[i].scene));
const means = cam.map(i => metrics.get(i).mean).sort((a, b) => a - b);
const median = means.length ? means[Math.floor(means.length / 2)] : 0;

// the first three camera shots are the hook: they must read on a phone with the sound off (directing.md §7.1). The
// opening frames of rear-cam that failed this measured contrast 49–57, the ones that replaced them 124–184.
const HOOK = new Set(S.shots.map((_, i) => i).filter(i => !CARD_SCENE.test(S.shots[i].scene)).slice(0, 3));
const HOOK_CONTRAST = 80;

const issues = [];
const rowsOut = [];
for (const i of have) {
  const s = S.shots[i], d = RAW[i]?.data ?? {}, m = metrics.get(i);
  const card = CARD_SCENE.test(s.scene);
  const mood = MOOD[d.light] ?? (d.light ? 'day' : '-');
  const why = [];
  if (!card) {
    if (NEED[mood] && m.shadow < NEED[mood]) why.push(`${mood} shot only ${pct(m.shadow)} in shadow (≥ ${pct(NEED[mood])})`);
    if (HOOK.has(i) && m.contrast < HOOK_CONTRAST) why.push(`opening shot: contrast ${Math.round(m.contrast)} (≥ ${HOOK_CONTRAST}) — "dark on purpose" is no answer here; name the subject you can see in the frame, or light it`);
    const murky = m.shadow >= 0.9 && m.contrast < 50;
    if (murky) why.push(`murky: ${pct(m.shadow)} black and contrast ${Math.round(m.contrast)} — nothing is lit; give the subject the one light (pool, rim, phone glow)`);
    else {
      if (m.light < 1.25) why.push(`flat light: brightest/darkest third ${m.light.toFixed(2)} (≥ 1.25) — lit evenly from nowhere`);
      if (m.contrast < 70 && m.shadow < 0.5) why.push(`washed out: contrast ${Math.round(m.contrast)} (≥ 70)`);
    }
    if (s.style === 'red' && m.mean > median) why.push(`red-box line brighter than the film's median frame (${Math.round(m.mean)} > ${Math.round(median)})`);
    const centred = centreOf(s, d);
    if (centred !== undefined) why.push(`one figure dead centre on an eye-level view (screen x ${pct(centred)}): put it on a third`);
  }
  if (why.length) issues.push({ i, s, why });
  rowsOut.push(`  ${String(i).padStart(3)} ${clock(s.start).padStart(5)}  ${(s.scene + ':' + (s.view ?? '')).padEnd(26).slice(0, 26)} ${String(d.light ?? '').padEnd(7)} shadow ${pct(m.shadow).padStart(4)}  contrast ${String(Math.round(m.contrast)).padStart(3)}  light ${m.light.toFixed(2)}  mean ${String(Math.round(m.mean)).padStart(3)}${card ? '  (card)' : ''}${why.length ? '  ✗' : ''}`);
}

/** screen x (0–1) of a lone actor on an eye-level shot when the camera is known from story.json, else undefined */
function centreOf(s, d) {
  if (NOT_EYE.test(s.view ?? '') || !Array.isArray(d.cast)) return undefined;
  const actors = d.cast.filter(a => typeof a === 'string' && !/\bo=0(\.[0-3])?\b/.test(a));
  if (actors.length !== 1) return undefined;
  const x = Number(actors[0].split(/\s+/)[0].split('@')[1]?.split(',')[0]);
  if (!Number.isFinite(x)) return undefined;
  if (!Array.isArray(d.cam) && !portrait) return undefined; // the camera comes from a preset in the scene file
  const [z0 = 1, z1 = 1.04, cx = W / 2, , cx1 = cx] = Array.isArray(d.cam) ? d.cam : [];
  const t = 0.6; // Board shows 60 % into the shot
  const z = z0 + (z1 - z0) * t, c = cx + (cx1 - cx) * t;
  const sx = 0.5 + ((x - c) * z) / W;
  return Math.abs(sx - 0.5) < 0.06 ? sx : undefined;
}

// ---------------------------------------------------------------- report
console.log(`look audit — ${slug} (${S.format ?? 'portrait'}, ${label}: ${have.length}/${range.length} Board frames)`);
if (have.length < range.length) console.log(`  ! ${range.length - have.length} shots have no Board frame — run npm run check (or chapter --board)`);
if (stale) console.log(`  ! ${stale} Board frames are older than story.json — re-render them before trusting these numbers`);
if (LIST) console.log(rowsOut.join('\n'));
const byMood = {};
for (const i of cam) {
  const d = RAW[i]?.data ?? {}, mood = MOOD[d.light] ?? (d.light ? 'day' : '-');
  (byMood[mood] ??= []).push(metrics.get(i).shadow);
}
const avg = a => a.reduce((s, v) => s + v, 0) / a.length;
// channel-playbook.md: dark is for turns. Film mean ≥ 80/255 on landscape; the first minute no darker than the median.
if (cam.length) {
  const filmMean = avg(cam.map(i => metrics.get(i).mean));
  const first = cam.filter(i => S.shots[i].start < 60).map(i => metrics.get(i).mean);
  const firstMean = first.length ? avg(first) : filmMean;
  const okFilm = portrait || filmMean >= 80, okFirst = firstMean >= median;
  console.log(`  ${okFilm && okFirst ? '✓' : '✗'} brightness: film mean ${Math.round(filmMean)}${portrait ? '' : ' (≥ 80)'} · first minute ${Math.round(firstMean)} vs median ${Math.round(median)} — dark is for turns (thai-long-story/references/channel-playbook.md)`);
}
console.log(`  ${cam.length} set shots: ${Object.entries(byMood).map(([k, v]) => `${k} ${v.length} (shadow avg ${pct(avg(v))})`).join(' · ')}`);
const kinds = [['shadow', /in shadow/], ['flat', /flat light/], ['washed', /washed out/], ['murky', /murky/], ['reveal', /red-box/], ['centre', /dead centre/]];
console.log(`  ✗ ${kinds.map(([k, re]) => `${k} ${issues.filter(x => x.why.some(w => re.test(w))).length}`).join(' · ')}`);
const show = ALL || LIST ? issues : issues.slice(0, 14);
for (const x of show) console.log(`  ✗ ${String(x.i).padStart(3)} ${clock(x.s.start).padStart(5)} ${x.s.scene}:${x.s.view ?? ''} — ${x.why.join('; ')}`);
if (show.length < issues.length) console.log(`  … ${issues.length - show.length} more (--all lists every one, --list prints every shot's numbers)`);
console.log(issues.length
  ? `\nfixes: depth-light.md §5 (one light + data.lightAt, noir/dim grade, Far dim, Haze, PerspFloor, a subject on a third). Then look at the frames.`
  : `\nlight & depth numbers pass — now look at the frames: does each one have FG / MG / BG / atmosphere and one light you can point to?`);
