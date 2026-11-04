import {Easing, interpolate} from 'remotion';

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

/** Keyframes: kf(f, [[0,0],[10,1],[30,0.5]], ease) */
export function kf(f: number, keys: [number, number][], ease: (t: number) => number = easeInOut) {
  return interpolate(f, keys.map(k => k[0]), keys.map(k => k[1]), {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
  });
}

/** Deterministic noise in [0,1) — use instead of Math.random(). */
export function rnd(seed: number, i = 0) {
  let t = (seed * 374761393 + i * 668265263) >>> 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const shake = (f: number, amp: number, seed = 1) => ({
  x: (rnd(seed, f * 2) - 0.5) * 2 * amp,
  y: (rnd(seed, f * 2 + 1) - 0.5) * 2 * amp,
});

/** A wobble that dies away after frame 0: for things that land, get hit or get knocked. */
export const settle = (t: number, amp: number, speed = 1.4, decay = 8) => (t > 0 ? Math.sin(t * speed) * amp * Math.exp(-t / decay) : 0);

export const sec = (s: number) => s * 30;
export const backOut = (k = 1.8) => Easing.out(Easing.back(k));

/** 0 -> 1 between frames [start, start+dur]; ease defaults to power3.out. Pass backOut() for a pop. */
export const appear = (f: number, start: number, dur = 9, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
