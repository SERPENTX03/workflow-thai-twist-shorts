// voice -> score (ducked) -> build, in the right order.
//   node scripts/audio.mjs episodes/<slug> [--no-voice]
import { spawnSync } from 'node:child_process';
import { episodeDir } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const steps = [...(process.argv.includes('--no-voice') ? [] : ['voice']), 'score', 'build'];
for (const s of steps) {
  const r = spawnSync(process.execPath, [`scripts/${s}.mjs`, dir], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status);
}
