// typecheck + story lint + a Board contact sheet (one jpeg per shot) for the review loop.
//   node scripts/check.mjs episodes/<slug>
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { episodeDir, npx, compId, writeRegistry, ROOT } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const slug = path.basename(dir);
writeRegistry();
const steps = [
  ['tsc', () => npx(['tsc', '--noEmit'], { cwd: ROOT, stdio: 'inherit' })],
  ['story-check', () => spawnSync(process.execPath, ['scripts/story-check.mjs', dir], { cwd: ROOT, stdio: 'inherit' })],
  ['board', () => npx(['remotion', 'render', 'src/index.ts', `${compId(slug)}Board`, `out/${slug}-board`, '--sequence', '--image-format=jpeg'], { cwd: ROOT, stdio: 'inherit' })],
];
let bad = 0;
for (const [name, fn] of steps) {
  const r = fn();
  if (r.status) { console.error(`✖ ${name} failed`); bad = r.status; break; }
}
// light & depth numbers of the fresh Board frames (advisory, never fails the check): depth-light.md
if (!bad) { console.log(''); spawnSync(process.execPath, ['scripts/look-audit.mjs', dir], { cwd: ROOT, stdio: 'inherit' }); }
console.log(`\nboard frames: out/${slug}-board/  (one per shot; look at them before any render)`);
process.exit(bad);
