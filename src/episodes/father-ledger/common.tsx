import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {Shot as KitShot} from '../../kit/frame';
import {C, ROSTER} from './cast';

export {D, K, zOf, FONT, Macro, CapShade, Soft, Svg, Pool, FloorMist, Sheet, Pen, Typed, BigEye, BigMouth, HangBulb} from '../../kit/frame';

// Pieces only this story uses: smoke, flames, the lotus stamp, the foam box. The shared frame pieces live in src/kit/frame.tsx.

export const Shot: React.FC<Omit<React.ComponentProps<typeof KitShot>, 'roster'>> = props => <KitShot {...props} roster={ROSTER} />;


/** Rising smoke from (x, y), puffs widening as they climb */
export const Smoke: React.FC<{x: number; y: number; h?: number; f: number; a?: number; color?: string; n?: number; w?: number; seed?: number}> = ({x, y, h = 620, f, a = 0.5, color = '95,88,84', n = 14, w = 130, seed = 7}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const t = ((f * 0.0032 + i / n) % 1);
      const r = w * (0.25 + t * 1.25);
      const xx = x + Math.sin(t * 5 + i + seed) * 34 * t + t * t * 60;
      return <div key={i} style={{position: 'absolute', left: xx - r, top: y - t * h - r, width: r * 2, height: r * 2, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(10px)',
        background: `radial-gradient(circle, rgba(${color},${a * (1 - t) * 0.95}) 0%, rgba(${color},0) 70%)`}} />;
    })}
  </>
);

/** Fire: a stack of flame tongues inside a w×h box whose bottom-centre is (x, y) */
export const Flames: React.FC<{x: number; y: number; w: number; h: number; f: number; a?: number; seed?: number}> = ({x, y, w, h, f, a = 1, seed = 2}) => {
  const tongue = (i: number, n: number, k: number, fill: string) => {
    const u = (i + 0.5) / n, cx = -w / 2 + u * w, tw = (w / n) * 1.5;
    const hh = h * k * (0.55 + 0.45 * Math.sin(u * Math.PI)) * (0.8 + 0.2 * Math.sin(f / 3.1 + i * 2.1 + seed));
    const sway = Math.sin(f / 5 + i * 1.3) * tw * 0.3;
    return <path key={`${k}-${i}`} d={`M${cx - tw / 2} 0 Q${cx - tw * 0.3 + sway} ${-hh * 0.55} ${cx + sway} ${-hh} Q${cx + tw * 0.3 + sway} ${-hh * 0.55} ${cx + tw / 2} 0 Z`} fill={fill} />;
  };
  return (
    <svg width={w} height={h} viewBox={`${-w / 2} ${-h} ${w} ${h}`} style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible', opacity: a}}>
      {Array.from({length: 9}, (_, i) => tongue(i, 9, 1, '#e8481c'))}
      {Array.from({length: 8}, (_, i) => tongue(i, 8, 0.72, '#f98a22'))}
      {Array.from({length: 7}, (_, i) => tongue(i, 7, 0.42, '#ffd25a'))}
    </svg>
  );
};

/** Eight-petalled gold lotus: the stamp on the wreath, the card, the contract and the cheque. `faded` = the pale print
 *  on the old loan; the same geometry every time, so the two lay exactly over each other in shot 223. */
export const Lotus: React.FC<{x: number; y: number; r: number; color?: string; o?: number; emboss?: boolean}> = ({x, y, r, color = C.lotus, o = 1, emboss}) => (
  <svg width={r * 2} height={r * 2} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - r, top: y - r, overflow: 'visible', opacity: o, filter: emboss ? 'drop-shadow(1px 2px 1px rgba(0,0,0,.45)) drop-shadow(-1px -1px 0 rgba(255,245,200,.5))' : undefined}}>
    {Array.from({length: 8}, (_, i) => <path key={i} transform={`rotate(${i * 45})`} d="M0 -8 C-24 -30 -22 -74 0 -94 C22 -74 24 -30 0 -8 Z" fill={color} stroke="rgba(60,40,0,.45)" strokeWidth={3} />)}
    <circle r={15} fill={color} stroke="rgba(60,40,0,.5)" strokeWidth={3} />
    <circle r={100} fill="none" stroke={color} strokeWidth={5} />
  </svg>
);

/** Foam box with red tape and the marker "A-0". (x, y) = bottom centre on its table, w = front width. */
export const FoamBox: React.FC<{x: number; y: number; w?: number; tag?: boolean; seep?: number; tapeless?: boolean}> = ({x, y, w = 420, tag, seep = 0, tapeless}) => {
  const h = w * 0.62, top = w * 0.26;
  return (
    <svg width={w * 1.4} height={h + top + 40} viewBox={`${-w * 0.7} ${-h - top - 10} ${w * 1.4} ${h + top + 40}`} style={{position: 'absolute', left: x - w * 0.7, top: y - h - top - 10, overflow: 'visible'}}>
      <path d={`M${-w / 2} ${-h} L${-w * 0.38} ${-h - top} L${w * 0.38} ${-h - top} L${w / 2} ${-h} Z`} fill="#fbf9f1" stroke="#a8a496" strokeWidth={3} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={C.foam} stroke="#a8a496" strokeWidth={3} />
      <path d={`M${-w / 2} ${-h * 0.5} h${w}`} stroke="#c9c5b6" strokeWidth={2} />
      {!tapeless && <>
        <rect x={-w * 0.09} y={-h} width={w * 0.18} height={h} fill={C.tape} />
        <path d={`M${-w * 0.09} ${-h} L${-w * 0.07} ${-h - top} L${w * 0.07} ${-h - top} L${w * 0.09} ${-h} Z`} fill="#c91d24" />
        <rect x={-w / 2} y={-h * 0.62} width={w} height={h * 0.16} fill={C.tape} />
      </>}
      {!tapeless && <text x={-w * 0.3} y={-h * 0.14} fontFamily="Kanit, sans-serif" fontWeight={700} fontSize={w * 0.14} fill="#17151a" textAnchor="middle">A-0</text>}
      {tag && <g transform={`translate(${w * 0.33} ${-h * 0.2}) rotate(6)`}>
        <rect x={-w * 0.13} y={-w * 0.05} width={w * 0.3} height={w * 0.15} fill="#e7dcbf" stroke="#8a7f65" strokeWidth={2} />
        <text x={w * 0.02} y={w * 0.05} fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={w * 0.058} fill="#2a2620" textAnchor="middle">ส่งวันพระ</text>
      </g>}
      {seep > 0 && <path d={`M${w / 2 - 6} -6 Q${w / 2 + 40 * seep} 10 ${w / 2 + 150 * seep} 18 Q${w / 2 + 40 * seep} 24 ${w / 2 - 20} 6 Z`} fill="#a10f16" />}
    </svg>
  );
};
