// Motion strip (for shots that DECLARE movement: data.motion = "walk"|"pan"|"push"|"fx", or data.move = [x0, x1]): see what moves inside a shot without rendering a video. For each chosen shot, renders the full composition
// (not the Board) at 4 moments (start, 1/3, 2/3, end) and writes one page, one row per shot, with the camera numbers.
//   node scripts/motion.mjs episodes/<slug> 13-16,201        (npm run motion -- episodes/<slug> 13-16,201)
//   node scripts/motion.mjs episodes/<slug> --chapter 2        every shot of chapter 2
//   --declared                      every shot that declares motion (the default when no list is given)
//   options: --n 5 (moments per shot) · --scale 0.4
// Flags per shot (advisory): camera push under 6 % with nothing else moving is a still picture; a pan under 80 px reads as
// a drift; a shot of 3 s or more with no move at all (cam z0 = z1 and no cx/cy change). directing.md §9 item 7.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { episodeDir, loadStory, compId, FPS, ROOT, clock, esc } from './lib.mjs';

const args = process.argv.slice(2);
const dir = episodeDir(args[0]);
const slug = path.basename(dir);
const flag = (f, d) => { const i = args.indexOf(f); return i > 0 ? args[i + 1] : d; };
const N = Number(flag('--n', 4)), SCALE = Number(flag('--scale', 0.4));
const S = loadStory(dir);
const raw = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8')).shots;

let list = [];
const chap = flag('--chapter');
if (chap !== undefined) {
  const c = S.chapters.find(x => x.n === Number(chap));
  if (!c) { console.log('no such chapter'); process.exit(0); }
  for (let i = c.first; i <= c.last; i++) list.push(i);
} else {
  const declared = args.includes('--declared') || !args.some((a, i) => i > 0 && /^[\d,-]+$/.test(a));
  if (declared) list = raw.map((r, i) => (r.data?.motion || r.data?.move ? i : -1)).filter(i => i >= 0);
  else {
  const spec = args.find((a, i) => i > 0 && /^[\d,-]+$/.test(a) && !['--n', '--scale', '--chapter'].includes(args[i - 1]));
  if (!spec && !declared) { console.log('usage: npm run motion -- episodes/<slug> [13-16,201 | --chapter <n> | --declared]'); process.exit(0); }
  if (!list.length && !spec) { console.log('no shot declares data.motion / data.move'); process.exit(0); }
  list = spec.split(',').flatMap(t => { const [a, b] = t.split('-').map(Number); return b === undefined ? [a] : Array.from({ length: b - a + 1 }, (_, k) => a + k); });
  }
}
list = list.filter(i => S.shots[i]);

const require = createRequire(path.join(ROOT, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition, openBrowser } = require('@remotion/renderer');
const out = path.join(ROOT, 'out', `${slug}-motion`);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src/index.ts'), publicDir: path.join(ROOT, 'public') });
const browser = await openBrowser('chrome');
const comp = await selectComposition({ serveUrl, id: compId(slug), puppeteerInstance: browser });

const jobs = [];
for (const i of list) {
  const s = S.shots[i], from = Math.round(s.start * FPS), len = Math.max(1, Math.round(s.dur * FPS));
  for (let k = 0; k < N; k++) jobs.push({ i, k, frame: from + Math.min(len - 1, Math.round((len * k) / (N - 1))) });
}
let j = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (j < jobs.length) {
    const t = jobs[j++];
    await renderStill({ composition: comp, serveUrl, frame: t.frame, output: path.join(out, `${t.i}-${t.k}.jpg`), imageFormat: 'jpeg', jpegQuality: 80, scale: SCALE, puppeteerInstance: browser, overwrite: true });
  }
}));
await browser.close({ silent: true });

const rows = [], flags = [];
for (const i of list) {
  const s = S.shots[i], d = raw[i].data ?? {}, cam = d.cam;
  const why = [];
  if (cam) {
    const [z0, z1, cx, cy, cx1 = cx, cy1 = cy] = cam;
    const push = Math.abs(z1 / z0 - 1), pan = Math.hypot((cx1 - cx) * z0, (cy1 - cy) * z0);
    if (s.dur >= 3 && push < 0.01 && pan < 1) why.push('camera does not move for ' + s.dur.toFixed(1) + ' s');
    else if (s.dur >= 3 && push < 0.06 && pan < 80) why.push(`push only ${(push * 100).toFixed(1)} % / pan ${Math.round(pan)} px: reads as still`);
    const m = d.motion;
    if (m === 'pan' && pan < 150) why.push(`declared pan but the camera moves only ${Math.round(pan)} px`);
    if (m === 'push' && push < 0.08) why.push(`declared push but only ${(push * 100).toFixed(1)} %`);
  } else if (s.dur >= 3) why.push('no data.cam: the camera default is a 4 % push');
  if (d.motion === 'walk' && !d.move && !(d.cast ?? []).some(a => String(a).split(' ').some(w => w === 'walk' || w === 'run'))) why.push('declared walk but nobody has walk / run or data.move');
  if (why.length) flags.push(`${i} ${why.join('; ')}`);
  rows.push(`<section><h3>#${i} · ${clock(s.start)} · ${s.dur.toFixed(1)} s · ${esc(s.scene)}:${esc(s.view ?? '')}${cam ? ` · cam ${esc(JSON.stringify(cam))}` : ''}</h3>${why.length ? `<p class="w">⚠ ${esc(why.join('; '))}</p>` : ''}<div>${Array.from({ length: N }, (_, k) => `<img src="${slug}-motion/${i}-${k}.jpg">`).join('')}</div></section>`);
}
fs.writeFileSync(path.join(ROOT, 'out', `${slug}-motion.html`), `<!doctype html><meta charset="utf-8"><title>${slug} motion</title><style>body{background:#111;color:#eee;font:14px sans-serif;margin:16px}section{margin-bottom:22px}div{display:flex;gap:6px}img{width:${Math.floor(100 / N) - 1}%}h3{margin:0 0 6px}.w{color:#ffb454;margin:0 0 6px}</style>${rows.join('')}`);
console.log(`✓ out/${slug}-motion.html  (${list.length} shots × ${N} moments)`);
for (const f of flags) console.log('  ⚠ ' + f);
