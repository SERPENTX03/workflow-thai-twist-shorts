// Post-render QC report for a finished episode: format, duration, loudness, true peak, silence and voice fit.
// Reads renders/<slug>-final.mp4 (or the plain render) and writes renders/<slug>-qc.md + .json. Offline, no credits.
//   node scripts/qc.mjs episodes/<slug>        (finalize.mjs runs it automatically)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { episodeDir, loadStory, die } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const slug = path.basename(dir);
const final = path.join(dir, 'renders', `${slug}-final.mp4`);
const plain = path.join(dir, 'renders', `${slug}.mp4`);
const file = fs.existsSync(final) ? final : fs.existsSync(plain) ? plain : die(`no render in ${dir}/renders — run npm run final first`);

// a long film's per-frame loudness log runs to megabytes: give ffmpeg's stderr room so the summary is not cut off
const ff = (args) => spawnSync('ffmpeg', ['-hide_banner', ...args], { encoding: 'utf8', maxBuffer: 1 << 28 }).stderr;
const probe = JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], { encoding: 'utf8' }).stdout);
const v = probe.streams.find(s => s.codec_type === 'video'), a = probe.streams.find(s => s.codec_type === 'audio');
const [fn, fd] = (v?.r_frame_rate || '0/1').split('/').map(Number);
const fps = fd ? fn / fd : 0;
const dur = parseFloat(probe.format.duration);

const ebur = ff(['-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-']);
const sum = ebur.slice(ebur.lastIndexOf('Summary:'));
const num = re => parseFloat((sum.match(re) || [])[1]);
const lufs = num(/I:\s+(-?[\d.]+) LUFS/), lra = num(/LRA:\s+(-?[\d.]+) LU/), tp = num(/Peak:\s+(-?[\d.]+) dBFS/);

// silent gaps > 1.2 s inside the film (dead air), ignoring the final 1 s
const sil = [...ff(['-i', file, '-af', 'silencedetect=n=-50dB:d=1.2', '-f', 'null', '-']).matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_duration: ([\d.]+)/g)]
  .map(m => ({ at: +m[1], len: +m[2] })).filter(s => s.at < dur - 1);

// voice fit from the generated index (shots whose line was sped up or ends past the cut)
const idxFile = path.join(dir, 'assets', 'vo', 'index.json');
const voice = fs.existsSync(idxFile) ? JSON.parse(fs.readFileSync(idxFile, 'utf8')) : [];
const rushed = voice.filter(x => x.tempo > 1.15).map(x => x.shot);
const over = voice.filter(x => S.shots[x.shot] && x.start + x.dur > S.shots[x.shot].start + S.shots[x.shot].dur - 0.05).map(x => x.shot);

const checks = [
  [`Resolution ${S.W}×${S.H}`, v?.width === S.W && v?.height === S.H, `${v?.width}×${v?.height}`],
  ['Frame rate 30', Math.abs(fps - 30) < 0.01, fps.toFixed(2)],
  ['Audio present', !!a, a ? `${a.codec_name} ${a.sample_rate} Hz` : 'none'],
  ['Loudness −14 ±0.5 LUFS', Math.abs(lufs + 14) <= 0.5, `${lufs} LUFS`],
  ['True peak ≤ −1.0 dBTP', tp <= -1.0, `${tp} dBTP`],
  ['Duration matches story', Math.abs(dur - S.total) <= 0.5, `${dur.toFixed(2)}s vs ${S.total.toFixed(2)}s`],
  [`Runtime in ${S.target[0]}–${S.target[1]}s target`, S.total >= S.target[0] && S.total <= S.target[1], `${S.total.toFixed(1)}s`],
  ['No dead air > 1.2s', sil.length === 0, sil.length ? sil.map(s => `${s.at.toFixed(1)}s (+${s.len.toFixed(1)})`).join(', ') : 'none'],
  ['No voice line past its cut', over.length === 0, over.length ? 'shots ' + over.join(', ') : voice.length ? 'ok' : 'no voice index'],
  ['No rushed voice (>1.15×)', rushed.length === 0, rushed.length ? 'shots ' + rushed.join(', ') : 'ok'],
];
const pass = checks.filter(c => c[1]).length;

const rows = checks.map(([n, ok, d]) => `| ${ok ? '✓' : '✖'} | ${n} | ${d} |`).join('\n');
const md = `# QC — ${slug}\n\nFile: ${path.relative(process.cwd(), file)}\n\n| | Check | Result |\n|---|---|---|\n${rows}\n\n${pass}/${checks.length} passed. LRA ${lra} LU.\n\nThis is a technical report. It does not replace inspecting the beat, phone and seam sheets (references/review.md).\n`;
fs.writeFileSync(path.join(dir, 'renders', `${slug}-qc.md`), md);
fs.writeFileSync(path.join(dir, 'renders', `${slug}-qc.json`), JSON.stringify({ file: path.basename(file), lufs, lra, truePeak: tp, duration: dur, fps, silences: sil, rushed, over, checks: checks.map(([name, ok, detail]) => ({ name, ok, detail })) }, null, 1));
console.log(md);
process.exit(pass === checks.length ? 0 : 2);
