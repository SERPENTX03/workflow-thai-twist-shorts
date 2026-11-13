import React from 'react';
import {rnd} from '../engine/anim';

// Light that sits on top of the sets: a rim on the actors so they read on dark backgrounds, a lamp's cone with
// dust drifting in it, and soft shade where floor meets wall. Ideas from what-if-studio's light.tsx / kit.tsx.

/** rim colour per light grade (stage.tsx GRADES); day has none */
const RIM_TONE: Record<string, [string, string]> = {
  night: ['rgba(170,200,255,.95)', 'rgba(120,160,255,.28)'],
  dim: ['rgba(160,190,250,.85)', 'rgba(110,150,240,.24)'],
  dark: ['rgba(150,180,240,.8)', 'rgba(100,140,230,.22)'],
  noir: ['rgba(165,195,250,.9)', 'rgba(110,150,240,.26)'],
  dawn: ['rgba(200,210,255,.8)', 'rgba(150,170,255,.2)'],
  morning: ['rgba(255,245,220,.6)', 'rgba(255,240,200,.12)'],
  dusk: ['rgba(255,190,140,.9)', 'rgba(255,140,90,.26)'],
  lamp: ['rgba(255,214,150,.95)', 'rgba(255,170,90,.3)'],
  lantern: ['rgba(255,200,130,.95)', 'rgba(255,150,70,.32)'],
  warm: ['rgba(255,210,160,.8)', 'rgba(255,160,90,.22)'],
  red: ['rgba(255,90,80,1)', 'rgba(255,40,50,.45)'],
};

/** CSS filter for a rim light. `rim`: 'l' | 'r' (side the light comes from), 'red', '0' for none; `light` picks the
 *  colour. Scale `k` with the body (1 = a 500 px adult). Returns undefined when there is no rim. */
export function rimFilter(rim: string | number | boolean | undefined, light = 'night', k = 1): string | undefined {
  if (rim === 0 || rim === false || rim === '0' || rim === 'none') return undefined;
  const tone = rim === 'red' ? RIM_TONE.red : RIM_TONE[light];
  if (!tone) return undefined;
  const side = rim === 'l' ? -1 : 1;
  const px = (n: number) => `${(n * k).toFixed(1)}px`;
  // Both layers lean to the light side. The soft one used to be `0 0 16px`, a glow all the way round the figure:
  // on a dark set that reads as a sticker's white border, not as light (fifth-room shot 126). Offset by about its
  // own blur, it spills on the lit side only and the far side stays in the dark.
  return `drop-shadow(${px(side * 3.5)} ${px(-1.5)} ${px(1.2)} ${tone[0]}) drop-shadow(${px(side * 9)} ${px(-3)} ${px(8)} ${tone[1]})`;
}

/** The ink of an outline under a light grade: the grade's own light colour pulled halfway to black, so a line
 *  under lamplight is amber-brown and under moonlight steel blue, never flat black. `k` 0 = the light colour, 1 = black. */
export function inkFor(light = 'night', k = 0.5): string {
  const tone = RIM_TONE[light];
  const rgb = tone ? tone[0].match(/\d+/g)!.slice(0, 3).map(Number) : [200, 190, 180]; // day / unknown: a warm grey
  const ink = [10, 9, 16];
  const hex = rgb.map((v, i) => Math.round(v + (ink[i] - v) * k).toString(16).padStart(2, '0')).join('');
  return '#' + hex;
}

/** Light falling from a lamp at (x, y) to the floor: a soft trapezoid, a pool on the ground and dust in the beam. */
export const Cone: React.FC<{x: number; y: number; floor: number; top?: number; spread?: number; f: number; color?: string; a?: number; dust?: number; seed?: number}> = ({
  x, y, floor, top = 30, spread = 260, f, color = '255,214,150', a = 0.22, dust = 18, seed = 1,
}) => {
  const h = floor - y;
  return (
    <>
      <div style={{position: 'absolute', left: x - spread, top: y, width: spread * 2, height: h, pointerEvents: 'none', mixBlendMode: 'screen',
        clipPath: `polygon(${50 - (top / spread) * 50}% 0, ${50 + (top / spread) * 50}% 0, 100% 100%, 0 100%)`,
        background: `linear-gradient(rgba(${color},${a}), rgba(${color},${a * 0.25}))`}} />
      <div style={{position: 'absolute', left: x - spread * 1.15, top: floor - 34, width: spread * 2.3, height: 68, borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen',
        background: `radial-gradient(ellipse, rgba(${color},${a * 1.4}), rgba(${color},0) 70%)`}} />
      <Dust x={x} y={y} floor={floor} top={top} spread={spread} f={f} n={dust} color={color} seed={seed} />
    </>
  );
};

/** Motes drifting slowly inside a lamp's cone; brighter near the lamp. */
export const Dust: React.FC<{x: number; y: number; floor: number; top?: number; spread?: number; f: number; n?: number; color?: string; seed?: number}> = ({
  x, y, floor, top = 30, spread = 260, f, n = 18, color = '255,230,190', seed = 1,
}) => {
  const h = floor - y;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const v = (rnd(seed, i * 3) * h + f * (0.25 + rnd(seed, i * 3 + 1) * 0.35)) % h; // falls slowly, wraps
        const t = v / h;
        const half = top + (spread - top) * t;
        const u = rnd(seed, i * 3 + 2) * 2 - 1;
        const px = x + u * half * 0.85 + Math.sin(f / 30 + i) * 8;
        const r = 1.5 + rnd(seed, i + 50) * 2.5;
        const o = (0.25 + 0.6 * rnd(seed, i + 70)) * (1 - t * 0.7) * (0.6 + 0.4 * Math.sin(f / 9 + i * 1.7));
        return <div key={i} style={{position: 'absolute', left: px - r, top: y + v - r, width: r * 2, height: r * 2, borderRadius: '50%', pointerEvents: 'none', background: `rgba(${color},${Math.max(0, o).toFixed(3)})`}} />;
      })}
    </>
  );
};

/** Soft shade where the floor meets the wall (and down the room's sides): what makes a flat set feel enclosed. */
export const CornerShade: React.FC<{floor: number; left?: number; right?: number; a?: number; W?: number}> = ({floor, left = -700, right = 2620, a = 0.45, W = right - left}) => (
  <>
    <div style={{position: 'absolute', left, top: floor - 120, width: W, height: 120, pointerEvents: 'none', background: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,${a * 0.8}))`}} />
    <div style={{position: 'absolute', left, top: floor, width: W, height: 70, pointerEvents: 'none', background: `linear-gradient(rgba(0,0,0,${a}), rgba(0,0,0,0))`}} />
  </>
);
