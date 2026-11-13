// Cold-read export (offline, read-only, no credits): what a first-time viewer HEARS, cut off part-way, so a reader
// who has never seen the brief can try to guess the twist. Procedure and pass rules: .claude/story/cold-read.md.
//   node scripts/cold-read.mjs episodes/<slug> [--cuts 25,50,75 | --shots 40,112]     (npm run coldread -- episodes/<slug>)
// Writes out/<slug>-coldread/cut-<n>.txt (the film up to that point) and full.txt (the whole film).
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

const speaker = s => (s.who ? String(s.who).replace(/\d+$/, '') : 'ผู้บรรยาย');
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
