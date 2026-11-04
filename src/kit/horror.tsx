import React from 'react';
import {rnd} from '../engine/anim';
import {T} from '../engine/theme';

// Night-horror set pieces shared by every episode: grain, flicker, knock ripples, flashlight mask, a side-view bed.

/** film grain over the whole frame (portrait or landscape); changes every 2 frames so it crawls without strobing */
export const Grain: React.FC<{f: number; opacity?: number}> = ({f, opacity = 0.16}) => {
  const seed = Math.floor(f / 2) % 7;
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <filter id={`grain-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
    </svg>
  );
};

/** light level for a tired bulb or tube: ~1 with rare dips. */
export const flicker = (f: number, seed = 1, depth = 0.45) => {
  const k = Math.floor(f / 2);
  const dip = rnd(seed, k) > 0.9 ? depth : 0;
  return 1 - dip - rnd(seed + 7, k) * 0.06;
};

/** expanding sound rings for knocks; `at` = local frames of each knock */
export const Ripple: React.FC<{x: number; y: number; f: number; at: number[]; color?: string; size?: number; jagged?: boolean}> = ({
  x, y, f, at, color = T.white, size = 220, jagged,
}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible'}}>
    {at.flatMap((t0, i) =>
      [0, 6].map(d => {
        const k = (f - t0 - d) / 16;
        if (k < 0 || k > 1) return null;
        const r = 24 + size * k;
        const o = (1 - k) * 0.9;
        if (jagged) {
          const pts = Array.from({length: 22}, (_, j) => {
            const a = (j / 22) * Math.PI * 2;
            const rr = r * (j % 2 ? 0.82 : 1.08);
            return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr * 0.7}`;
          }).join(' ');
          return <polygon key={`${i}-${d}`} points={pts} fill="none" stroke={color} strokeWidth={6} opacity={o} />;
        }
        return <ellipse key={`${i}-${d}`} cx={x} cy={y} rx={r} ry={r * 0.75} fill="none" stroke={color} strokeWidth={7 - d * 0.5} opacity={o} />;
      }),
    )}
  </svg>
);

/** darkness with one soft hole of light (flashlight, phone glow) */
export const LightMask: React.FC<{x: number; y: number; rx?: number; ry?: number; dark?: number}> = ({x, y, rx = 300, ry = 360, dark = 0.94}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
    background: `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, rgba(2,3,6,0) 0%, rgba(2,3,6,0) 35%, rgba(2,3,6,${dark}) 100%)`}} />
);

/** cold night grade + heavy vignette for horror frames */
export const NightGrade: React.FC<{amount?: number}> = ({amount = 0.5}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `rgba(6,12,22,${amount})`, pointerEvents: 'none'}} />
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)'}} />
  </>
);

/** dust smear on a floor: `fingers` parallel drag marks from (x,y) going right */
export const DragMarks: React.FC<{x: number; y: number; len?: number; fingers?: number; opacity?: number; reveal?: number}> = ({
  x, y, len = 260, fingers = 3, opacity = 0.55, reveal = 1,
}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
    {Array.from({length: fingers}, (_, i) => (
      <path key={i} d={`M ${x} ${y + i * 14} q ${len * 0.5} ${-8 + i * 4} ${len * reveal} ${6 - i * 3}`} stroke="#b9b2a2" strokeWidth={9 - i}
        strokeLinecap="round" fill="none" opacity={opacity * (1 - i * 0.15)} />
    ))}
  </svg>
);

/**
 * Side-view dorm bed against the back wall. `x` = left edge, `floor` = floor line y.
 * `under` is drawn in the gap (behind the front rail and the sheet). `sheet` 0..1 = how far the front sheet hangs to the floor.
 */
export const Bed: React.FC<{x: number; floor: number; w?: number; clear?: number; sheet?: number; under?: React.ReactNode; light?: number}> = ({
  x, floor, w = 780, clear = 400, sheet = 0.12, under, light = 1,
}) => {
  const rail = floor - clear; // underside of the frame
  const top = rail - 90; // mattress top
  const hang = 30 + (clear - 40) * sheet;
  return (
    <>
      {/* the gap: darkest place in the room */}
      <div style={{position: 'absolute', left: x + 20, top: rail, width: w - 40, height: clear,
        background: 'linear-gradient(180deg, #020305 0%, #05080c 70%, #0b0f14 100%)'}} />
      {under}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {/* iron posts */}
        <rect x={x} y={top - 120} width={22} height={floor - top + 120} fill="#1d2228" />
        <rect x={x + w - 22} y={top - 40} width={22} height={floor - top + 40} fill="#1d2228" />
        <rect x={x} y={top - 120} width={70} height={14} fill="#1d2228" />
        {/* mattress, pillow, blanket */}
        <rect x={x + 10} y={top} width={w - 20} height={70} rx={18} fill={`rgba(196,190,174,${0.55 + 0.45 * light})`} />
        <rect x={x + 30} y={top - 46} width={190} height={58} rx={28} fill="#d9d3c4" />
        <path d={`M ${x + 240} ${top + 4} q ${w * 0.3} -40 ${w - 260} -6 l 0 40 l ${-(w - 260)} 0 z`} fill="#4c5a6b" />
        {/* front rail */}
        <rect x={x} y={rail - 22} width={w} height={22} fill="#262c33" />
        {/* hanging sheet (front) */}
        <path d={`M ${x + 14} ${top + 50} L ${x + w - 14} ${top + 50} L ${x + w - 30} ${top + 50 + hang} Q ${x + w * 0.5} ${top + 62 + hang} ${x + 30} ${top + 50 + hang} Z`}
          fill="#cfc8b6" />
        <path d={`M ${x + 30} ${top + 50 + hang} Q ${x + w * 0.5} ${top + 62 + hang} ${x + w - 30} ${top + 50 + hang}`} stroke="rgba(0,0,0,.25)" strokeWidth={6} fill="none" />
        {/* legs */}
        <rect x={x + 6} y={rail} width={18} height={clear} fill="#1a1e23" />
        <rect x={x + w - 24} y={rail} width={18} height={clear} fill="#1a1e23" />
      </svg>
    </>
  );
};

/** Back wall + floor of a cheap rented room. `damp` adds stains; the shared wall is always the back wall. */
export const RoomBack: React.FC<{floor?: number; wall?: [string, string]; floorC?: [string, string]; damp?: number}> = ({
  floor = 1250, wall = ['#46524f', '#2c3634'], floorC = ['#4b4239', '#221d19'], damp = 1,
}) => (
  <>
    <div style={{position: 'absolute', left: -200, right: -200, top: -200, height: floor + 200,
      background: `repeating-linear-gradient(90deg, rgba(255,255,255,.018) 0 3px, transparent 3px 140px), linear-gradient(180deg, ${wall[0]}, ${wall[1]})`}} />
    <div style={{position: 'absolute', left: 80, top: floor - 520, width: 380, height: 300, borderRadius: '45% 55% 40% 60%', opacity: 0.18 * damp,
      background: 'radial-gradient(circle, #1a201e 0%, rgba(26,32,30,0) 70%)'}} />
    <div style={{position: 'absolute', left: 640, top: 120, width: 300, height: 520, borderRadius: '50%', opacity: 0.16 * damp,
      background: 'radial-gradient(ellipse, #171c1b 0%, rgba(23,28,27,0) 70%)'}} />
    <div style={{position: 'absolute', left: -200, right: -200, top: floor - 26, height: 26, background: '#1f2523'}} />
    <div style={{position: 'absolute', left: -200, right: -200, top: floor, height: 1920 - floor + 200,
      background: `repeating-linear-gradient(90deg, rgba(0,0,0,.2) 0 3px, transparent 3px 160px), linear-gradient(180deg, ${floorC[0]}, ${floorC[1]})`}} />
  </>
);

/** a bare bulb hanging from the ceiling with its glow; `level` from flicker() */
export const Bulb: React.FC<{x: number; y: number; level?: number; warm?: string}> = ({x, y, level = 1, warm = '255,196,120'}) => (
  <>
    <div style={{position: 'absolute', left: x - 2, top: -20, width: 4, height: y + 20, background: '#111'}} />
    <div style={{position: 'absolute', left: x - 22, top: y, width: 44, height: 56, borderRadius: '45% 45% 50% 50%', background: `rgba(${warm},${0.4 + 0.6 * level})`}} />
    <div style={{position: 'absolute', left: x - 700, top: y - 600, width: 1400, height: 1400, borderRadius: '50%', mixBlendMode: 'screen', pointerEvents: 'none',
      background: `radial-gradient(circle, rgba(${warm},${0.32 * level}), rgba(${warm},0) 62%)`}} />
  </>
);
