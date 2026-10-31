import {rnd} from '../engine/anim';

// Life for whole-body cast symbols (one drawing per pose, no joints): a walk that bobs, rocks and squashes on
// each step instead of sliding, a breath for anyone standing still, and a blink now and then.
// All of it is a transform about the feet, so it works on any symbol. Ideas from what-if-studio's rig.tsx.

export type BodyMotion = {dx: number; dy: number; rot: number; sx: number; sy: number; shadow: number; phase?: number};

const STILL: BodyMotion = {dx: 0, dy: 0, rot: 0, sx: 1, sy: 1, shadow: 1};

/** Walk / run. `f` frame, `h` body height px, `speed` px per frame (0 = walking on the spot at a natural cadence),
 *  `dir` direction of travel. Each step is half a cycle of `phase` (returned, for a jointed body: Rig.tsx).
 *  `rigged`: the legs show the step, so drop the fake bob and the foot-to-foot rock (the rig's feet do both). */
export function gait(f: number, h: number, speed: number, dir: 1 | -1, run = false, seed = 0, rigged = false): BodyMotion {
  const stride = h * (run ? 0.55 : 0.36);
  // steps per frame follow the speed, kept inside a believable cadence (walk 8-18 f per step, run 5-9)
  const [lo, hi] = run ? [1 / 9, 1 / 5] : [1 / 18, 1 / 8];
  const rate = Math.min(hi, Math.max(lo, Math.abs(speed) / stride || (run ? 1 / 7 : 1 / 14)));
  const phase = Math.PI * (f * rate + seed * 0.37);
  const s = Math.sin(phase);
  const up = Math.abs(Math.cos(phase)); // legs are widest at |sin| = 1 (contact), together at the passing position
  const down = Math.pow(1 - up, 4); // a short dip right at contact
  return {
    dx: dir * stride * 0.04 * Math.sin(2 * phase), // surge: quicker off the back foot
    dy: rigged ? (run ? -h * 0.03 * up : 0) : -h * (run ? 0.045 : 0.016) * up + h * 0.006 * down,
    rot: (run ? 7 : 1.6) * dir + (rigged ? 0.5 : run ? 1.2 : 2) * s, // lean into the travel + weight rocking foot to foot
    sx: 1 + 0.012 * down,
    sy: 1 - (run ? 0.04 : 0.018) * down,
    shadow: 1 - (run ? 0.3 : 0.12) * up,
    phase,
  };
}

/** A slow breath for a still body: rises a little from the feet. */
export function breathe(f: number, seed = 0): BodyMotion {
  const b = Math.sin(f / 24 + seed * 2.1);
  return {...STILL, sy: 1 + 0.006 * b, sx: 1 - 0.002 * b};
}

/** True on the frames the eyes are shut: three frames, once every 2.5-4.5 s, offset per character. */
export function blinkAt(f: number, seed = 0) {
  const P = 105;
  const g = f + Math.floor(rnd(seed, 99) * P);
  const k = Math.floor(g / P);
  const start = 6 + Math.floor(rnd(seed, k) * (P - 14));
  const local = g - k * P;
  return local >= start && local < start + 3;
}

/** CSS transform for a body motion; use with transformOrigin '50% 100%' (the feet). */
export const motionCss = (m: BodyMotion) =>
  `translate(${m.dx.toFixed(2)}px, ${m.dy.toFixed(2)}px) rotate(${m.rot.toFixed(2)}deg) scale(${m.sx.toFixed(4)}, ${m.sy.toFixed(4)})`;

/** a stable number per name, for seeding */
export const seedOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 9973;
