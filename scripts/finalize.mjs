// Render the episode with HyperFrames, then normalise the mix to -14 LUFS / -1.5 dBTP (social delivery).
//   node scripts/finalize.mjs episodes/<slug> [--skip-render]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { episodeDir, loadStory, run, die, npx } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const slug = path.basename(dir);
const rendered = path.join(dir, 'renders', `${slug}.mp4`);
const final = path.join(dir, 'renders', `${slug}-final.mp4`);

if (!process.argv.includes('--skip-render')) {
  const r = npx(['hyperframes', 'render', '--quality', 'looks', '-o', rendered], { cwd: dir, stdio: 'inherit' });
  if (r.status !== 0) die('render failed');
}
if (!fs.existsSync(rendered)) die(`no render at ${rendered}`);

const m = spawnSync('ffmpeg', ['-hide_banner', '-i', rendered, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
const j = JSON.parse(m.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/)[0]);
const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
run('ffmpeg', ['-v', 'error', '-y', '-i', rendered, '-af', ln + ',aresample=48000', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', final]);
const chk = spawnSync('ffmpeg', ['-hide_banner', '-i', final, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const I = (chk.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop();
console.log(`✓ ${path.relative(process.cwd(), final)}  ${S.total.toFixed(1)}s  ${I || ''}`);
spawnSync(process.execPath, ['scripts/qc.mjs', dir], { stdio: 'inherit' });   // report only; a failed check does not delete the render
