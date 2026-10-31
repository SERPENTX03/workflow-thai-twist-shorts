// Chapters of a long-form episode (shots with `"chapter": "name"` in story.json).
//   node scripts/chapter.mjs episodes/<slug>              list chapters + YouTube chapter lines
//   node scripts/chapter.mjs episodes/<slug> 3 --board    Board frames for chapter 3 only, then contact sheets
//   node scripts/chapter.mjs episodes/<slug> 3 --sheet    contact sheets from the Board frames already in out/<slug>-board/
//   node scripts/chapter.mjs episodes/<slug> 3 --render   preview mp4 of chapter 3 (no loudness pass; not for upload)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { episodeDir, loadStory, die, npx, compId, clock, writeRegistry, ROOT } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const slug = path.basename(dir);
const args = process.argv.slice(3);
const n = args.find(a => /^\d+$/.test(a));
const flag = f => args.includes(f);

if (!S.chapters.length) die('no chapters — set "chapter": "<name>" on the first shot of each chapter in story.json');

if (n === undefined) {
  console.log(`${slug}: ${S.chapters.length} chapters, ${clock(S.total)}\n`);
  console.log(' #  start   length  shots      frames         name');
  for (const c of S.chapters) {
    console.log(`${String(c.n).padStart(2)}  ${clock(c.start).padStart(5)}  ${clock(c.dur).padStart(6)}  ${`${c.first}–${c.last}`.padEnd(9)}  ${`${c.from}–${c.to}`.padEnd(13)}  ${c.name}`);
  }
  console.log('\nYouTube chapters (paste into the description):');
  for (const c of S.chapters) console.log(`${clock(c.start)} ${c.name}`);
  process.exit(0);
}

const c = S.chapters[+n];
if (!c) die(`no chapter ${n} (0–${S.chapters.length - 1})`);
console.log(`chapter ${c.n} "${c.name}": shots ${c.first}–${c.last}, ${clock(c.start)} +${clock(c.dur)}, frames ${c.from}–${c.to}`);
const board = path.join(ROOT, 'out', `${slug}-board`);

if (flag('--render')) {
  writeRegistry();
  const file = path.join(ROOT, 'out', `${slug}-ch${c.n}.mp4`);
  const r = npx(['remotion', 'render', 'src/index.ts', compId(slug), file, `--frames=${c.from}-${c.to}`, '--codec=h264', '--crf=20'], { cwd: ROOT, stdio: 'inherit' });
  if (r.status) die('render failed');
  console.log(`✓ ${path.relative(ROOT, file)} (preview only — npm run final makes the upload file)`);
}

if (flag('--board')) {
  writeRegistry();
  // Board frame k = shot k, so a chapter's Board frames are its shot range
  const r = npx(['remotion', 'render', 'src/index.ts', `${compId(slug)}Board`, board, '--sequence', '--image-format=jpeg', `--frames=${c.first}-${c.last}`], { cwd: ROOT, stdio: 'inherit' });
  if (r.status) die('board render failed');
}

if (flag('--board') || flag('--sheet')) {
  if (!fs.existsSync(board)) die(`no ${path.relative(ROOT, board)} — run with --board, or npm run check first`);
  const pad = String(S.shots.length - 1).length;
  const frame = i => path.join(board, `element-${String(i).padStart(pad, '0')}.jpeg`);
  const PER = 30;
  for (let a = c.first; a <= c.last; a += PER) {
    const b = Math.min(c.last, a + PER - 1);
    const missing = [];
    for (let i = a; i <= b; i++) if (!fs.existsSync(frame(i))) missing.push(i);
    if (missing.length) die(`board frames missing for shots ${missing.join(', ')} — run with --board`);
    const out = path.join(ROOT, 'out', `${slug}-ch${c.n}-sheet-${a}.jpg`);
    const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-start_number', String(a), '-i', path.join(board, `element-%0${pad}d.jpeg`),
      '-vf', `trim=end_frame=${b - a + 1},scale=480:-1,tile=5x6:padding=6:color=white`, '-frames:v', '1', out], { encoding: 'utf8' });
    if (r.status) die(`ffmpeg failed: ${r.stderr}`);
    console.log(`✓ ${path.relative(ROOT, out)}  shots ${a}–${b}`);
  }
  console.log('look at every sheet before scoring the chapter (thai-long-story → review-long.md)');
}
