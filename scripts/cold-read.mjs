// Cold-read export (offline, read-only, no credits): what a first-time viewer HEARS, cut off part-way, so a reader
// who has never seen the brief can try to guess the twist. Procedure and pass rules: .claude/story/cold-read.md.
//   node scripts/cold-read.mjs episodes/<slug> [--cuts 25,50,75 | --shots 40,112]     (npm run coldread -- episodes/<slug>)
// Writes out/<slug>-coldread/cut-<n>.txt (the film up to that point), full.txt (the whole film), hook.txt (title + the
// first 15 s, the hook gate) and regular.txt (earlier twists from canon, the regular-viewer gate).
// Only the title, chapter names and spoken lines go in: no `note`, no `view`, no scene names, no brief. Those name
// the clues and the culprit ("MIRROR ของ key-ots"), and a reader who sees them is no longer cold.
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory, plain, clock, ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const dir = episodeDir(args[0]);
const slug = path.basename(dir);
const S = loadStory(dir);
const landscape = S.format === 'landscape';
const list = flag => { const k = args.indexOf(flag); return k > 0 ? String(args[k + 1] ?? '').split(',').map(Number).filter(Number.isFinite) : null; };

// a cut = the index of the last shot the reader gets
const byShots = list('--shots');
const pcts = list('--cuts') ?? (landscape ? [25, 50, 75] : [60]);
const cuts = byShots
  ? byShots.map(n => ({ label: `shot-${n}`, last: Math.min(S.shots.length - 1, Math.max(0, n)) }))
  : pcts.map(p => {
      const t = S.total * p / 100;
      let last = S.shots.findIndex(s => s.start + s.dur > t) - 1;
      if (last < 0) last = S.shots.length - 1;
      return { label: String(p), last };
    });

// A reader sees the label, a viewer only hears a voice and sees a face: an id can give the twist away (a caller whose
// id is the dead friend). Top-level `speakers` {who: label} gives each `who` the name a viewer could put to it.
const speaker = s => (s.who ? S.speakers?.[s.who] ?? String(s.who).replace(/\d+$/, '') : 'ผู้บรรยาย');
function script(last) {
  const out = [`เรื่อง: ${S.title ?? slug}`, `(${landscape ? 'เรื่องยาว' : 'คลิปสั้น'} ความยาวทั้งเรื่อง ${clock(S.total)})`, ''];
  for (const s of S.shots.slice(0, last + 1)) {
    if (s.chapter) out.push('', `— ${s.chapter} —`);
    const text = plain(s.text).replace(/\n/g, ' ').trim();
    if (!text) continue;   // a silent shot gives the listener nothing
    out.push(`[${clock(s.start)}] ${speaker(s)}: ${text}`);
  }
  return out.join('\n') + '\n';
}

const outDir = path.join(ROOT, 'out', `${slug}-coldread`);
fs.mkdirSync(outDir, { recursive: true });
console.log(`cold read — ${slug} (${S.shots.length} shots, ${clock(S.total)})`);

// Hook gate (cold-read.md → ด่านฮุก): only the title and what is heard in the first 15 s (a Short: the first 2 shots).
{
  const lastHook = landscape ? Math.max(0, S.shots.findIndex(s => s.start >= 15) - 1) : Math.min(1, S.shots.length - 1);
  const file = path.join(outDir, 'hook.txt');
  fs.writeFileSync(file, script(lastHook < 0 ? S.shots.length - 1 : lastHook) + '\n[จบฮุก]\n');
  console.log(`  ${path.relative(ROOT, file)}   the hook gate (title + first ${landscape ? '15 s' : '2 shots'})`);
}

// Regular-viewer gate (cold-read.md → ด่านคนดูประจำ): the one-line twists of the five episodes before this one, from
// universe/canon.json → episodes[*].twist.line, in file order. Spoils the old episodes on purpose.
{
  const canonFile = path.join(ROOT, 'universe', 'canon.json');
  const eps = fs.existsSync(canonFile) ? JSON.parse(fs.readFileSync(canonFile, 'utf8')).episodes ?? {} : {};
  const order = Object.keys(eps), me = order.indexOf(slug);
  const prior = (me < 0 ? order : order.slice(0, me)).filter(k => eps[k]?.twist?.line).slice(-5);
  const file = path.join(outDir, 'regular.txt');
  if (prior.length) {
    fs.writeFileSync(file, ['คุณดูช่องนี้มาหลายเรื่องแล้ว นี่คือหักมุมของเรื่องล่าสุดที่คุณดูไป:', ...prior.map(k => `- ${eps[k].twist.line}`), '', 'ต่อไปคือเรื่องใหม่ของช่องเดียวกัน', ''].join('\n'));
    console.log(`  ${path.relative(ROOT, file)}   regular-viewer primer (${prior.length} earlier twists) — paste it before a cut, for a NEW reader`);
  } else console.log('  (no regular.txt: no earlier episode in universe/canon.json has twist.line)');
}
for (const c of cuts) {
  const end = S.shots[c.last];
  const file = path.join(outDir, `cut-${c.label}.txt`);
  fs.writeFileSync(file, script(c.last) + `\n[ตัดตรงนี้ ที่ ${clock(end.start + end.dur)} จาก ${clock(S.total)}]\n`);
  console.log(`  ${path.relative(ROOT, file)}   up to shot ${c.last} (${clock(end.start + end.dur)}, ${Math.round((end.start + end.dur) / S.total * 100)} %)`);
}
const full = path.join(outDir, 'full.txt');
fs.writeFileSync(full, script(S.shots.length - 1));
console.log(`  ${path.relative(ROOT, full)}   the whole film`);
console.log('\nGive a reader ONE cut as pasted text (never the folder, the brief or story.json), ask the questions in .claude/story/cold-read.md, then the full text.');
