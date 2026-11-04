import React from 'react';
import {kf, rnd} from '../engine/anim';

// Landscape world primitives (from temple-boy): drawn in a 1920×1080 world that runs past the frame edges so the
// stage camera (src/kit/stage.tsx) can push and pan. Floor line at FLOOR.

export const W = 1920, H = 1080, FLOOR = 930;

/** default wood tones for planks, doors, tables */
export const WOOD = {wood0: '#6a4b31', wood1: '#3f2c1d', wood2: '#8a6a48'};

/** a fill that covers the whole world plus the camera overscan */
export const full = (bg: string, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: -700, top: -500, width: W + 1400, height: H + 1000, background: bg, ...extra});

/** soft round light pool (screen blend) */
export const Glow: React.FC<{x: number; y: number; r: number; color?: string; a?: number}> = ({x, y, r, color = '255,196,120', a = 0.35}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', mixBlendMode: 'screen', pointerEvents: 'none',
    background: `radial-gradient(circle, rgba(${color},${a}), rgba(${color},0) 65%)`}} />
);

/** vertical plank wall */
export const Planks: React.FC<{x?: number; y?: number; w?: number; h?: number; c0?: string; c1?: string; step?: number}> = ({
  x = -700, y = -500, w = W + 1400, h = FLOOR + 500, c0 = WOOD.wood0, c1 = WOOD.wood1, step = 96,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h,
    background: `repeating-linear-gradient(90deg, ${c1} 0 5px, ${c0} 5px ${step * 0.55}px, ${c0}ee ${step * 0.55}px ${step}px)`}} />
);

/** wooden floor boards from the floor line down */
export const Boards: React.FC<{y?: number; c0?: string; c1?: string; wet?: number}> = ({y = FLOOR, c0 = '#5a4030', c1 = '#2e2219', wet = 0}) => (
  <>
    <div style={{position: 'absolute', left: -700, top: y, width: W + 1400, height: H + 500 - y,
      background: `repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 3px, transparent 3px 46px), linear-gradient(180deg, ${c0}, ${c1})`}} />
    {wet > 0 && <div style={{position: 'absolute', left: -700, top: y, width: W + 1400, height: H + 500 - y, opacity: wet,
      background: 'linear-gradient(180deg, rgba(120,150,170,.5), rgba(40,60,80,.25)), repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 2px, transparent 2px 120px)'}} />}
  </>
);

/** sky + far tree line silhouette */
export const Sky: React.FC<{tone: 'dusk' | 'night' | 'dawn' | 'morning'; y?: number}> = ({tone, y = 640}) => {
  const g = {
    dusk: 'linear-gradient(180deg, #2b2346 0%, #6b3f5b 48%, #c77a52 82%, #e3a463 100%)',
    night: 'linear-gradient(180deg, #050912 0%, #0d1730 60%, #1a2540 100%)',
    dawn: 'linear-gradient(180deg, #1b2440 0%, #4b5a86 55%, #a9a2b4 100%)',
    morning: 'linear-gradient(180deg, #a9c4d8 0%, #d7e2e6 70%, #efe6d2 100%)',
  }[tone];
  const tree = tone === 'morning' ? '#7d8f7a' : tone === 'dusk' ? '#2a2233' : '#070a12';
  return (
    <>
      <div style={full(g)} />
      <svg width={W + 1400} height={500} style={{position: 'absolute', left: -700, top: y - 260}}>
        <path d={`M0 500 ${Array.from({length: 34}, (_, i) => `Q ${i * 100 + 50} ${180 + rnd(4, i) * 140} ${i * 100 + 100} ${260 + rnd(5, i) * 80}`).join(' ')} L 3400 500 Z`} fill={tree} />
      </svg>
    </>
  );
};

/** flashlight disc position over a shot; keys = [[t 0..1, x, y], …] (pair with LightMask from horror.tsx) */
export function beamAt(f: number, len: number, keys: number[][] | undefined, def: [number, number] = [960, 520]) {
  if (!keys?.length) return def;
  const t = f / Math.max(1, len);
  const x = kf(t, keys.map(k => [k[0], k[1]] as [number, number]));
  const y = kf(t, keys.map(k => [k[0], k[2]] as [number, number]));
  return [x + Math.sin(f / 7) * 6, y + Math.cos(f / 9) * 5] as [number, number];
}

/** flashlight cone from (x,y) toward angle (deg) */
export const Beam: React.FC<{x: number; y: number; angle: number; len?: number; spread?: number; a?: number}> = ({x, y, angle, len = 900, spread = 26, a = 0.5}) => (
  <div style={{position: 'absolute', left: x, top: y - len, width: 0, height: 0, transformOrigin: `0 ${len}px`, transform: `rotate(${angle}deg)`, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: -len * Math.tan((spread * Math.PI) / 180), top: 0, width: 2 * len * Math.tan((spread * Math.PI) / 180), height: len,
      clipPath: 'polygon(50% 100%, 0 0, 100% 0)', mixBlendMode: 'screen',
      background: `linear-gradient(0deg, rgba(255,240,190,${a}), rgba(255,240,190,0))`}} />
  </div>
);

/** wall clock showing `t` ("HH:MM"); `tick` = second-hand angle in radians */
export const WallClock: React.FC<{x: number; y: number; t: string; r?: number; tick?: number}> = ({x, y, t, r = 70, tick = 0}) => {
  const [hh, mm] = t.split(':').map(Number);
  const ma = (mm / 60) * 360, ha = ((hh % 12) / 12) * 360 + mm * 0.5;
  return (
    <svg width={r * 2 + 20} height={r * 2 + 20} style={{position: 'absolute', left: x - r - 10, top: y - r - 10}}>
      <circle cx={r + 10} cy={r + 10} r={r + 6} fill="#3a2a1c" />
      <circle cx={r + 10} cy={r + 10} r={r} fill="#efe8d6" />
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={r + 10 + Math.sin(a) * r * 0.82} y1={r + 10 - Math.cos(a) * r * 0.82} x2={r + 10 + Math.sin(a) * r * 0.93} y2={r + 10 - Math.cos(a) * r * 0.93} stroke="#2a2a2a" strokeWidth={i % 3 ? 3 : 6} />;
      })}
      <line x1={r + 10} y1={r + 10} x2={r + 10 + Math.sin((ha * Math.PI) / 180) * r * 0.5} y2={r + 10 - Math.cos((ha * Math.PI) / 180) * r * 0.5} stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
      <line x1={r + 10} y1={r + 10} x2={r + 10 + Math.sin((ma * Math.PI) / 180) * r * 0.75} y2={r + 10 - Math.cos((ma * Math.PI) / 180) * r * 0.75} stroke="#1a1a1a" strokeWidth={5} strokeLinecap="round" />
      <line x1={r + 10} y1={r + 10} x2={r + 10 + Math.sin(tick) * r * 0.8} y2={r + 10 - Math.cos(tick) * r * 0.8} stroke="#b3261e" strokeWidth={2} />
      <circle cx={r + 10} cy={r + 10} r={6} fill="#b3261e" />
    </svg>
  );
};
