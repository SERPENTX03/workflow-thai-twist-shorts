// Synthesized score + SFX on the story's beat grid -> assets/score.wav (+ beats.json).
// Nothing is sampled: drone, music box, heartbeat, clock and every SFX are generated here,
// seeded, so the same story.json always gives the same sound.
// If assets/vo/index.json exists the score ducks under each voice line.
//
//   node scripts/score.mjs episodes/<slug>
//
// story.json knobs per shot:  mood 0..1 (dread), music true (music-box motif), hush true (drone fades out: a held silence),
// cues [[beat, type], ...]
// cue types: hit bighit stamp scratch creak scrape step shriek whoosh bell flip tick
// or a name from story.json `sfx` (ElevenLabs effect cached in sfx-library/ by `npm run sfx`; mixed here, never generated here)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { episodeDir, loadStory, run, sfxFile } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const SR = 48000;
const N = Math.ceil(S.total * SR);
const B = S.beat;
// last shot that has started by t (binary search: a long film has hundreds of shots and this runs per sample)
const shotAt = t => { let lo = 0, hi = S.shots.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (t >= S.shots[m].start) lo = m; else hi = m - 1; } return S.shots[lo]; };

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(1234);
const env = (x, a, d) => (x < a ? x / a : Math.exp(-(x - a) / d));
function biquad(type, f, q) {
  const w = 2 * Math.PI * f / SR, al = Math.sin(w) / (2 * q), c = Math.cos(w);
  let b0, b1, b2; const a0 = 1 + al, a1 = -2 * c, a2 = 1 - al;
  if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = al; b1 = 0; b2 = -al; }
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return x => { const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}

// two buses so the voice can duck music harder than SFX
const bus = { music: [new Float32Array(N), new Float32Array(N)], sfx: [new Float32Array(N), new Float32Array(N)] };
let cur = bus.music;
const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { cur[0][i] += v * (1 - Math.max(0, pan)); cur[1][i] += v * (1 + Math.min(0, pan)); } };

// ---------- SFX ----------
const SFX = {
  hit(t0, g = 1) {
    const s = Math.floor(t0 * SR), lp = biquad('lp', 400, 0.7); let ph = 0;
    for (let i = 0; i < 1.6 * SR; i++) {
      const x = i / SR; ph += 2 * Math.PI * (35 + 70 * Math.exp(-x * 9)) / SR;
      add(s + i, (Math.sin(ph) * env(x, 0.004, 0.45) * 0.9 + lp(rnd() * 2 - 1) * env(x, 0.002, 0.08) * 0.8) * g);
    }
  },
  bighit(t0) {
    const s0 = Math.floor((t0 - 1) * SR), bp = biquad('bp', 900, 0.8);
    for (let i = 0; i < SR; i++) { const x = i / SR; add(s0 + i, bp(rnd() * 2 - 1) * x ** 3 * 0.6, Math.sin(x * 6) * 0.3); }
    SFX.hit(t0, 1.5);
    const s = Math.floor(t0 * SR);
    for (let i = 0; i < 4 * SR; i++) { const x = i / SR; add(s + i, (Math.sin(2 * Math.PI * 41.2 * x) + 0.5 * Math.sin(2 * Math.PI * 58.3 * x)) * env(x, 0.01, 1.4) * 0.35); }
  },
  stamp(t0) {
    const s = Math.floor(t0 * SR), lp = biquad('lp', 1200, 0.7);
    for (let i = 0; i < 0.25 * SR; i++) { const x = i / SR; add(s + i, (Math.sin(2 * Math.PI * 120 * x) * 0.7 + lp(rnd() * 2 - 1) * 0.6) * env(x, 0.002, 0.05)); }
  },
  scratch(t0) {
    const s = Math.floor(t0 * SR), bp = biquad('bp', 2600, 1.5);
    for (let i = 0; i < 0.3 * SR; i++) { const x = i / SR; add(s + i, bp(rnd() * 2 - 1) * Math.sin(Math.PI * x / 0.3) * 0.7, 0.3); }
  },
  creak(t0) {
    const s = Math.floor(t0 * SR); let ph = 0;
    for (let i = 0; i < 1.2 * SR; i++) {
      const x = i / SR; ph += 2 * Math.PI * (260 + 140 * Math.sin(x * 2.2) + 30 * Math.sin(x * 37)) / SR;
      add(s + i, (((ph / Math.PI) % 2) - 1) * 0.12 * Math.sin(Math.PI * x / 1.2) * (0.6 + 0.4 * Math.sin(x * 90)), -0.4);
    }
  },
  scrape(t0) {
    const s = Math.floor(t0 * SR), bp = biquad('bp', 1400, 2);
    for (let i = 0; i < 0.8 * SR; i++) { const x = i / SR; add(s + i, bp(rnd() * 2 - 1) * Math.sin(Math.PI * x / 0.8) * 0.9 * (0.7 + 0.3 * Math.sin(x * 140)), 0.2); }
  },
  step(t0) {
    const s = Math.floor(t0 * SR), lp = biquad('lp', 500, 0.8), pan = rnd() * 0.6 - 0.3;
    for (let i = 0; i < 0.22 * SR; i++) { const x = i / SR; add(s + i, (Math.sin(2 * Math.PI * 70 * x) * 0.9 + lp(rnd() * 2 - 1) * 1.2) * env(x, 0.004, 0.05), pan); }
  },
  shriek(t0) {
    const s = Math.floor(t0 * SR);
    for (let i = 0; i < 1.6 * SR; i++) {
      const x = i / SR, a = Math.sin(Math.PI * Math.min(1, x / 1.6)) * 0.08;
      add(s + i, a * (Math.sin(2 * Math.PI * (1800 + 400 * x) * x) + Math.sin(2 * Math.PI * (1865 - 300 * x) * x)), 0.5);
    }
  },
  whoosh(t0) {
    const s = Math.floor(t0 * SR); let f = biquad('bp', 500, 1);
    for (let i = 0; i < 0.6 * SR; i++) {
      const x = i / SR; if (i % 256 === 0) f = biquad('bp', 300 + 2500 * (x / 0.6), 1.2);
      add(s + i, f(rnd() * 2 - 1) * Math.sin(Math.PI * x / 0.6) * 0.8, Math.cos(Math.PI * x / 0.6) * 0.6);
    }
  },
  bell(t0) {
    const s = Math.floor(t0 * SR), f0 = 880;
    for (let i = 0; i < 3.5 * SR; i++) {
      const x = i / SR;
      add(s + i, (Math.sin(2 * Math.PI * f0 * x) * Math.exp(-x * 1.2) + 0.5 * Math.sin(2 * Math.PI * f0 * 2.76 * x) * Math.exp(-x * 2.5) + 0.25 * Math.sin(2 * Math.PI * f0 * 5.4 * x) * Math.exp(-x * 4)) * 0.16 * Math.min(1, x / 0.003));
    }
  },
  flip(t0) {
    const s = Math.floor(t0 * SR), hp = biquad('hp', 2000, 0.7);
    for (let i = 0; i < 0.12 * SR; i++) { const x = i / SR; add(s + i, hp(rnd() * 2 - 1) * env(x, 0.005, 0.03) * 0.8, 0.2); }
  },
  tick(t0) {
    const s = Math.floor(t0 * SR), hp = biquad('hp', 3000, 0.7);
    for (let i = 0; i < 0.03 * SR; i++) add(s + i, hp(rnd() * 2 - 1) * Math.exp(-i / SR * 200) * 0.4, -0.5);
  },
};

// ---------- score ----------
const BIG = S.shots.flatMap(s => s.cues.filter(c => c[1] === 'bighit').map(c => s.start + c[0] * B));
const moodAt = t => {
  const s = shotAt(t), nx = S.shots[s.i + 1];
  const u = (t - s.start) / s.dur;
  return nx ? s.mood + (nx.mood - s.mood) * Math.max(0, u - 0.7) / 0.3 : s.mood;
};
{
  // drone: low A with a fifth, darker and noisier as mood rises; drops out right before each big hit
  const lpL = biquad('lp', 260, 0.7), lpR = biquad('lp', 260, 0.7), hushK = 1 - Math.exp(-1 / (0.35 * SR));
  let hush = 1;
  for (let i = 0; i < N; i++) {
    const t = i / SR, m = moodAt(t);
    let g = 0.1 + 0.16 * m;
    if (shotAt(t).hush || hush !== 1) { hush += ((shotAt(t).hush ? 0.02 : 1) - hush) * hushK; if (Math.abs(hush - 1) < 1e-4) hush = 1; g *= hush; }
    if (BIG.some(b => t > b - 0.45 && t < b)) g *= 0.05;
    if (t > S.total - 2) g *= Math.max(0, (S.total - t) / 2);
    if (t < 0.05) g *= t / 0.05;
    const det = 0.4 * Math.sin(t * 0.3);
    const v = Math.sin(2 * Math.PI * 55 * t) + 0.7 * Math.sin(2 * Math.PI * (82.41 + det) * t) + 0.5 * Math.sin(2 * Math.PI * (110 - det) * t) + 0.25 * m * Math.sin(2 * Math.PI * 116.5 * t);
    const n = (rnd() * 2 - 1) * 0.3 * m;
    bus.music[0][i] += lpL(v + n) * g * 0.9;
    bus.music[1][i] += lpR(v * 0.98 + n) * g * 0.9;
  }
}
// music box (A minor) on every beat of shots with music: true
const MOTIF = [69, 72, 76, 74, 72, 71, 69, 64];
let k = 0;
for (const s of S.shots) {
  if (!s.music) continue;
  for (let b = 0; b < s.beats; b++) {
    const t0 = s.start + b * B, f = 440 * 2 ** ((MOTIF[k++ % MOTIF.length] - 69) / 12), st = Math.floor(t0 * SR);
    for (let i = 0; i < 2.4 * SR; i++) {
      const x = i / SR;
      const v = (Math.sin(2 * Math.PI * f * x) + 0.3 * Math.sin(2 * Math.PI * f * 3.01 * x) * Math.exp(-x * 6)) * Math.exp(-x * 2.2) * Math.min(1, x / 0.004) * 0.1;
      add(st + i, v, 0.25); add(st + i + Math.floor(0.3 * SR), v * 0.35, -0.35);
    }
  }
}
// heartbeat on each beat once mood >= 0.8
for (const s of S.shots) {
  if (s.mood < 0.8) continue;
  for (let b = 0; b < s.beats; b++) for (const [off, g] of [[0, 0.55], [0.22, 0.35]]) {
    const st = Math.floor((s.start + b * B + off) * SR);
    for (let i = 0; i < 0.25 * SR; i++) { const x = i / SR; add(st + i, Math.sin(2 * Math.PI * 48 * x) * env(x, 0.006, 0.07) * g); }
  }
}
cur = bus.sfx;
// generated effect: decode the cached mp3 to 48 kHz stereo float, trim to `dur`, fade the last 0.15 s, scale by `gain`
const sampled = new Map();
function loadSampled(name) {
  if (sampled.has(name)) return sampled.get(name);
  const e = S.sfx[name], f = sfxFile(e);
  let out = null;
  if (!fs.existsSync(f)) console.warn(`⚠ sfx "${name}" is not generated yet (npm run sfx -- ${path.relative(process.cwd(), dir)}); cue skipped`);
  else {
    const r = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-t', String(e.dur ?? 2), '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
    if (r.status !== 0) console.warn(`⚠ sfx "${name}" could not be decoded`);
    else out = new Float32Array(new Uint8Array(r.stdout).buffer, 0, Math.floor(r.stdout.length / 4));   // copy: the Buffer's offset may not be 4-aligned
  }
  sampled.set(name, out);
  return out;
}
function playSampled(name, t0) {
  const pcm = loadSampled(name);
  if (!pcm) return;
  const g = S.sfx[name].gain ?? 0.7, n = pcm.length / 2, fade = Math.min(n, Math.floor(0.15 * SR)), s0 = Math.floor(t0 * SR);
  for (let i = 0; i < n; i++) {
    const k = g * (i > n - fade ? (n - i) / fade : 1);
    if (s0 + i >= 0 && s0 + i < N) { bus.sfx[0][s0 + i] += pcm[2 * i] * k; bus.sfx[1][s0 + i] += pcm[2 * i + 1] * k; }
  }
}
for (const s of S.shots) for (const [beat, type] of s.cues) {
  if (SFX[type]) SFX[type](s.start + beat * B);
  else if (S.sfx && S.sfx[type]) playSampled(type, s.start + beat * B);
  else console.warn(`⚠ shot ${s.i}: unknown cue "${type}"`);
}

// ---------- room reverb ----------
const reverb = (buf, mix) => {
  const out = Float32Array.from(buf);
  for (const [d, g] of [[1557, 0.6], [1617, 0.58], [1491, 0.62], [1422, 0.6]]) {
    const dl = Math.floor(d * SR / 44100), c = new Float32Array(N);
    for (let i = dl; i < N; i++) c[i] = buf[i - dl] + c[i - dl] * g;
    for (let i = 0; i < N; i++) out[i] += c[i] * mix * 0.25;
  }
  return out;
};
const M = bus.music.map(b => reverb(b, 0.35)), X = bus.sfx.map(b => reverb(b, 0.35));

// ---------- duck under the voice ----------
const duck = new Float32Array(N);
const voIndex = path.join(dir, 'assets', 'vo', 'index.json');
if (fs.existsSync(voIndex)) {
  for (const v of JSON.parse(fs.readFileSync(voIndex, 'utf8')))
    for (let i = Math.max(0, Math.floor((v.start - 0.15) * SR)); i < Math.min(N, (v.start + v.dur + 0.25) * SR); i++) duck[i] = 1;
  let e = 0; const att = 1 - Math.exp(-1 / (0.06 * SR)), rel = 1 - Math.exp(-1 / (0.3 * SR));
  for (let i = 0; i < N; i++) { e += (duck[i] - e) * (duck[i] > e ? att : rel); duck[i] = e; }
}
const L = new Float32Array(N), R = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const m = 1 - 0.72 * duck[i], fx = 1 - 0.45 * duck[i];
  L[i] = M[0][i] * m + X[0][i] * fx;
  R[i] = M[1][i] * m + X[1][i] * fx;
}

// ---------- write (peak -1 dBFS), then set loudness so the bed sits under -16 LUFS speech ----------
let peak = 1e-9; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const gain = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), 46 + i * 4);
}
const raw = path.join(dir, 'assets', 'score_raw.wav'), wav = path.join(dir, 'assets', 'score.wav');
fs.writeFileSync(raw, buf);
run('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-22:TP=-1.5:LRA=14', '-ar', '48000', '-c:a', 'pcm_s16le', wav]);
fs.rmSync(raw);
fs.writeFileSync(path.join(dir, 'beats.json'), JSON.stringify({
  bpm: S.bpm, beat: S.beat, total: S.total,
  beats: Array.from({ length: S.totalBeats }, (_, i) => Math.round(i * B * 1000) / 1000),
  cuts: S.shots.map(s => s.start),
}, null, 1));
console.log(`✓ assets/score.wav  ${S.total.toFixed(1)}s${fs.existsSync(voIndex) ? '  (ducked under voice)' : '  (no voice yet: run voice first, then score again)'}`);
