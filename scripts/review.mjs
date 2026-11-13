// One-pass review: renders only the Board frames that changed, collects every audit ✗ into a suspect list, and writes
// ONE page the human scrolls to flag the odd shots. Replaces scoring chapter by chapter, round after round.
//   node scripts/review.mjs episodes/<slug>             what changed + suspects (no render)       (npm run review -- episodes/<slug>)
//   node scripts/review.mjs episodes/<slug> --board     also render the Board frames of changed shots (frames already fresh are kept)
//   node scripts/review.mjs episodes/<slug> --all       treat every shot as changed (full re-render with --board)
//   node scripts/review.mjs episodes/<slug> --accept    mark the current state as reviewed (the next run lists only what changes after this)
// Writes out/<slug>-review.html: every shot at a size where hands, faces and floating things show, with its note, caption,
// ✗ reasons and a flag box. "Copy flagged" gives the shot numbers to paste to the agent. Advisory: always exits 0.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { episodeDir, loadStory, npx, compId, writeRegistry, esc, clock, ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const dir = episodeDir(args[0]);
const slug = path.basename(dir);
const flag = f => args.includes(f);
const S = loadStory(dir);
const RAW = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8')).shots;
const N = S.shots.length;
const board = path.join(ROOT, 'out', `${slug}-board`);
const cacheFile = path.join(ROOT, 'out', `${slug}-review.json`);
fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });

const sha = x => crypto.createHash('sha1').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 12);
let cache = { rendered: {}, reviewed: {}, src: {} };
try { cache = { ...cache, ...JSON.parse(fs.readFileSync(cacheFile, 'utf8')) }; } catch {}

// ---- which shots changed -------------------------------------------------------------------------------------------
// shot hash = its story.json entry; source files of the episode are hashed per file, and a changed file marks every shot
// whose scene name appears in it (a coarse but honest guess; --all overrides)
const srcDir = path.join(ROOT, 'src', 'episodes', slug);
const srcNow = {}, srcText = {};
if (fs.existsSync(srcDir)) for (const f of fs.readdirSync(srcDir)) {
  if (!/\.(tsx?|json)$/.test(f)) continue;
  srcText[f] = fs.readFileSync(path.join(srcDir, f), 'utf8');
  srcNow[f] = sha(srcText[f]);
}
const changedFiles = Object.keys(srcNow).filter(f => cache.src[f] !== srcNow[f]);
const firstRun = !Object.keys(cache.src).length && !Object.keys(cache.reviewed).length;
const hit = new Set(); // shots touched by a changed source file
if (!firstRun) for (const f of changedFiles) {
  const names = new Set(S.shots.map(s => s.scene));
  for (const name of names) if (srcText[f].includes(name)) S.shots.forEach(s => { if (s.scene === name) hit.add(s.i); });
}
const hashOf = i => sha([RAW[i], hit.has(i) ? srcNow : 0]);
const hashStory = i => sha(RAW[i]);

const frameFile = i => {
  if (!fs.existsSync(board)) return null;
  const pad = String(N - 1).length;
  const f = path.join(board, `element-${String(i).padStart(pad, '0')}.jpeg`);
  return fs.existsSync(f) ? f : null;
};
const ALL = flag('--all');
// changed since the last --accept (what the human has not yet seen)
const unseen = S.shots.map(s => s.i).filter(i => ALL || cache.reviewed[i] !== hashStory(i) || hit.has(i));
// needs a fresh frame
const stale = S.shots.map(s => s.i).filter(i => ALL || !frameFile(i) || cache.rendered[i] !== hashStory(i) || hit.has(i));

if (flag('--accept')) {
  S.shots.forEach(s => { cache.reviewed[s.i] = hashStory(s.i); cache.rendered[s.i] ??= hashStory(s.i); });
  cache.src = srcNow;
  fs.writeFileSync(cacheFile, JSON.stringify(cache));
  console.log(`✓ ${slug}: ${N} shots marked as reviewed. The next run lists only what changes after this.`);
  process.exit(0);
}

// ---- render only stale frames ---------------------------------------------------------------------------------------
if (flag('--board') && stale.length) {
  writeRegistry();
  const pad = String(N - 1).length;
  // merge into ranges, bridging gaps of up to 4 shots (one render call per range is cheaper than many)
  const ranges = [];
  for (const i of stale) {
    const r = ranges[ranges.length - 1];
    if (r && i - r[1] <= 5) r[1] = i; else ranges.push([i, i]);
  }
  console.log(`rendering ${stale.length} changed Board frames in ${ranges.length} range(s) (of ${N} shots)…`);
  for (const [a, b] of ranges) {
    const r = npx(['remotion', 'render', 'src/index.ts', `${compId(slug)}Board`, board, '--sequence', '--image-format=jpeg', `--frames=${a}-${b}`], { cwd: ROOT, stdio: 'inherit' });
    if (r.status) { console.error(`✖ board render failed for shots ${a}–${b}`); process.exit(0); }
    // remotion pads by the range's last frame number; rename to the full-film width
    for (let i = a; i <= b; i++) {
      const short = path.join(board, `element-${String(i).padStart(String(b).length, '0')}.jpeg`);
      const full = path.join(board, `element-${String(i).padStart(pad, '0')}.jpeg`);
      if (short !== full && fs.existsSync(short)) fs.renameSync(short, full);
    }
  }
  for (let i = 0; i < N; i++) if (stale.includes(i)) cache.rendered[i] = hashStory(i);
  cache.src = srcNow;
  fs.writeFileSync(cacheFile, JSON.stringify(cache));
} else if (stale.length) {
  console.log(`! ${stale.length} shots have no fresh Board frame — run again with --board (renders only those)`);
}

// ---- suspects: every audit, one list -------------------------------------------------------------------------------
const sus = new Map(); // shot -> reasons
const add = (i, why) => { if (i >= 0 && i < N) (sus.get(i) ?? sus.set(i, []).get(i)).push(why); };
const out = (script, extra = []) => spawnSync(process.execPath, [`scripts/${script}`, dir, ...extra], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 }).stdout || '';
const film = []; // film-level questions that name no shot
for (const l of out('look-audit.mjs', ['--all']).split('\n')) {
  const m = l.match(/^\s+✗\s+(\d+)\s+\S+\s+(.*)$/);
  if (m) add(+m[1], 'light: ' + m[2]);
}
for (const l of out('story-check.mjs').split('\n')) {
  const m = l.match(/^⚠ shot (\d+): (.*)$/);
  if (m) add(+m[1], 'story: ' + m[2]);
}
for (const l of out('shot-audit.mjs').split('\n')) {
  if (!l.includes('✗')) continue;
  const t = l.replace(/^\s*✗\s*/, '').trim();
  const m = t.match(/^shots (\d+)–(\d+):/);
  const list = t.match(/same framing[^,]*, shots ((?:\d+ ?)+)/) || t.match(/missing: ((?:\d+ ?)+)/);
  if (m && +m[2] - +m[1] <= 8) for (let i = +m[1]; i <= +m[2]; i++) add(i, 'shots: ' + t);
  else if (list) list[1].trim().split(/\s+/).slice(0, 8).forEach(i => add(+i, 'shots: ' + t));
  else film.push(t);
}
// a shot that changed since the last review but has no frame cannot be judged
const noFrame = S.shots.map(s => s.i).filter(i => !frameFile(i));

// ---- terminal report -----------------------------------------------------------------------------------------------
const ids = [...sus.keys()].sort((a, b) => a - b);
const worst = [...ids].sort((a, b) => sus.get(b).length - sus.get(a).length || a - b); // most reasons first
console.log(`\nreview — ${slug}: ${N} shots, ${clock(S.total)}${S.chapters.length ? `, ${S.chapters.length} chapters` : ''}`);
console.log(`  unseen since last --accept: ${unseen.length}${unseen.length && unseen.length < 40 ? ` (${unseen.join(' ')})` : ''}`);
console.log(`  frames to re-render: ${stale.length}${noFrame.length ? ` · no frame at all: ${noFrame.length}` : ''}`);
console.log(`  suspects (audit ✗ / story ⚠): ${ids.length}`);
console.log('  worst first (most reasons); the page lists all in film order:');
for (const i of worst.slice(0, 25)) console.log(`   ${String(i).padStart(3)} ${clock(S.shots[i].start).padStart(5)}  ${sus.get(i).join(' | ').slice(0, 150)}`);
if (ids.length > 25) console.log(`   … ${ids.length - 25} more in the page`);
for (const f of film) console.log(`  film: ${f.slice(0, 160)}`);

// ---- the page --------------------------------------------------------------------------------------------------
const chapterAt = new Map(S.chapters.map(c => [c.first, c]));
const cards = S.shots.map(s => {
  const i = s.i, f = frameFile(i), r = RAW[i];
  const why = sus.get(i) ?? [];
  const isNew = unseen.includes(i);
  const head = chapterAt.has(i) ? `<h2 id="ch${chapterAt.get(i).n}">ตอน ${chapterAt.get(i).n} · ${esc(chapterAt.get(i).name)} · ${clock(chapterAt.get(i).start)}</h2>` : '';
  const img = f ? `<img loading="lazy" src="${esc(slug)}-board/${esc(path.basename(f))}" alt="shot ${i}">` : '<div class="noframe">ยังไม่มีเฟรม — รัน --board</div>';
  const tags = `${isNew ? '<b class="new">ใหม่</b>' : ''}${why.length ? '<b class="sus">✗</b>' : ''}`;
  return `${head}<figure data-i="${i}" data-new="${isNew ? 1 : 0}" data-sus="${why.length ? 1 : 0}">
<label class="pick"><input type="checkbox"> <span>#${i}</span></label> <span class="t">${clock(s.start)} · ${esc(s.scene)}${s.view ? ':' + esc(s.view) : ''}</span> ${tags}
${img}
<figcaption>${r.note ? `<p class="note">${esc(r.note)}</p>` : ''}${s.text ? `<p class="cap">${esc(String(s.text).replace(/[[\]{}]/g, '').replace(/\n/g, ' / '))}</p>` : ''}${why.map(w => `<p class="why">✗ ${esc(w)}</p>`).join('')}
<input class="memo" placeholder="บอกว่าแปลกตรงไหน (ไม่บังคับ)"></figcaption></figure>`;
}).join('\n');

const html = `<!doctype html><html lang="th"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Review ${esc(slug)}</title>
<style>
:root{--bg:#fff;--fg:#1a1a1a;--mut:#666;--card:#f4f4f4;--line:#ddd;--acc:#d33}
@media(prefers-color-scheme:dark){:root{--bg:#141414;--fg:#eee;--mut:#999;--card:#1f1f1f;--line:#333;--acc:#ff6b6b}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.4 system-ui,sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:8px 16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
header button,header select{font:inherit;padding:4px 10px}
main{padding:8px 16px 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(${S.W > S.H ? 380 : 220}px),1fr);gap:12px}
h2{grid-column:1/-1;margin:18px 0 0;font-size:16px}
figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:6px;padding:6px}
figure.on{outline:3px solid var(--acc)}
figure img{width:100%;display:block;cursor:zoom-in;margin-top:4px;background:#000;min-height:40px}
.t{color:var(--mut);font-size:12px}.pick{font-weight:600}
.new{background:#2a7;color:#fff;border-radius:3px;padding:0 5px;font-size:11px}.sus{background:var(--acc);color:#fff;border-radius:3px;padding:0 5px;font-size:11px}
figcaption p{margin:3px 0;font-size:12px}.note{color:var(--mut)}.cap{font-weight:600}.why{color:var(--acc)}
.memo{width:100%;box-sizing:border-box;font:inherit;font-size:12px;margin-top:3px}
.noframe{padding:30px 6px;text-align:center;color:var(--mut)}
#big{position:fixed;inset:0;background:rgba(0,0,0,.9);display:none;align-items:center;justify-content:center;z-index:9}
#big img{max-width:96vw;max-height:96vh}
.hide{display:none}
</style>
<header>
<b>${esc(slug)}</b> · ${N} shots
<select id="flt"><option value="all">ทุกช็อต</option><option value="sus">เฉพาะที่ audit ธง (${ids.length})</option><option value="new">เฉพาะที่ใหม่/แก้ (${unseen.length})</option></select>
<span id="cnt">ติดธง 0</span>
<button id="copy">คัดลอกเลขที่ติดธง</button>
<span id="msg"></span>
</header>
<main>
${cards}
</main>
<div id="big"><img alt=""></div>
<script>
const KEY='review-${esc(slug)}';
let st={};try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const figs=[...document.querySelectorAll('figure')];
function upd(){const n=figs.filter(f=>f.querySelector('input[type=checkbox]').checked).length;document.getElementById('cnt').textContent='ติดธง '+n}
figs.forEach(f=>{const i=f.dataset.i,cb=f.querySelector('input[type=checkbox]'),memo=f.querySelector('.memo');
 const s=st[i]||{};cb.checked=!!s.on;memo.value=s.m||'';f.classList.toggle('on',cb.checked);
 const w=()=>{st[i]={on:cb.checked,m:memo.value};f.classList.toggle('on',cb.checked);save();upd()};
 cb.onchange=w;memo.oninput=w;
 const im=f.querySelector('img');if(im)im.onclick=()=>{const b=document.getElementById('big');b.querySelector('img').src=im.src;b.style.display='flex'}});
document.getElementById('big').onclick=e=>e.currentTarget.style.display='none';
document.getElementById('flt').onchange=e=>{const v=e.target.value;figs.forEach(f=>f.classList.toggle('hide',v==='sus'&&f.dataset.sus!=='1'||v==='new'&&f.dataset.new!=='1'))};
document.getElementById('copy').onclick=async()=>{
 const on=figs.filter(f=>f.querySelector('input[type=checkbox]').checked);
 const t=on.length?'shots ที่แปลก: '+on.map(f=>{const m=f.querySelector('.memo').value.trim();return f.dataset.i+(m?' ('+m+')':'')}).join(', '):'ไม่มี shot ที่แปลก';
 try{await navigator.clipboard.writeText(t);document.getElementById('msg').textContent='คัดลอกแล้ว'}catch(e){prompt('คัดลอกข้อความนี้',t)}};
upd();
</script></html>`;
const htmlFile = path.join(ROOT, 'out', `${slug}-review.html`);
fs.writeFileSync(htmlFile, html);
console.log(`\n✓ ${path.relative(ROOT, htmlFile)} — open it, scroll the whole film once, tick the odd shots, press "คัดลอกเลขที่ติดธง" and paste to the agent.`);
console.log(`  agent: look at suspects + flagged shots at full size, fix once. After the user is satisfied: npm run review -- episodes/${slug} --accept`);
