import React from 'react';
import {rnd} from '../engine/anim';
import {T} from '../engine/theme';

// A phone's live stream as a picture, shared (from rear-cam): the LIVE badge with the viewer count, the comments rising
// up the side, the spider-web of a cracked screen, and a pile of old gold that catches whatever light there is.
//
//   <LiveBadge viewers={214} s={1.4} f={f} />                     absolute at (x, y)
//   <LiveComments items={['ดึกจัง', 'ที่ไหนเนี่ย']} x y w />        faint={i} = one comment small and pale, for a clue
//   <CrackedGlass w={428} h={808} seed={3} />                     over a screen
//   <GoldPile x y s f spill />                                    bangles, chains and beads seen from above at an angle

/** the viewer count: 3 → "3", [48, 120, 214] → steps through them over k (0..1) */
export const viewersAt = (v: number | number[] | undefined, k: number): number => {
  if (Array.isArray(v)) {
    const t = Math.min(v.length - 1, k * v.length);
    const i = Math.floor(t);
    const a = v[i], b = v[Math.min(v.length - 1, i + 1)];
    return Math.round(a + (b - a) * (t - i));
  }
  return v ?? 0;
};

export const LiveBadge: React.FC<{viewers?: number; x?: number; y?: number; s?: number; f?: number; label?: string}> = ({viewers, x = 40, y = 40, s = 1, f = 0, label = 'ผู้ชม'}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 12 * s, fontFamily: T.ui, whiteSpace: 'nowrap'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 8 * s, height: 46 * s, padding: `0 ${16 * s}px`, borderRadius: 8 * s, background: '#e0241c', color: '#fff', fontWeight: 700, fontSize: 28 * s, letterSpacing: 1}}>
      <span style={{width: 12 * s, height: 12 * s, borderRadius: '50%', background: Math.floor(f / 15) % 2 ? 'rgba(255,255,255,.35)' : '#fff'}} />LIVE
    </div>
    {viewers !== undefined && (
      <div style={{height: 46 * s, lineHeight: `${46 * s}px`, padding: `0 ${16 * s}px`, borderRadius: 8 * s, background: 'rgba(0,0,0,.6)', color: '#fff', fontWeight: 600, fontSize: 28 * s}}>{label} {viewers}</div>
    )}
  </div>
);

export const LiveComments: React.FC<{items: string[]; x: number; y: number; w?: number; s?: number; faint?: number; gap?: number}> = ({items, x, y, w = 420, s = 1, faint, gap = 58}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: T.ui}}>
    {items.map((c, i) => (
      <div key={i} style={{position: 'absolute', left: 0, top: i * gap * s, maxWidth: w, padding: `${6 * s}px ${14 * s}px`, borderRadius: 14 * s, background: 'rgba(0,0,0,.55)', whiteSpace: 'nowrap',
        fontSize: (i === faint ? 15 : 24) * s, color: i === faint ? 'rgba(255,255,255,.5)' : '#fff'}}>{c}</div>
    ))}
  </div>
);

/** cracks radiating from one impact point, for laying over a phone screen */
export const CrackedGlass: React.FC<{w: number; h: number; seed?: number; cx?: number; cy?: number; o?: number}> = ({w, h, seed = 3, cx = 0.68, cy = 0.28, o = 0.75}) => {
  const x0 = w * cx, y0 = h * cy, r = Math.hypot(w, h);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: o}}>
      {Array.from({length: 13}, (_, i) => {
        const a = (i / 13) * Math.PI * 2 + rnd(seed, i) * 0.4;
        const bx = x0 + Math.cos(a) * r * 0.22, by = y0 + Math.sin(a) * r * 0.22;
        const ex = x0 + Math.cos(a + rnd(seed + 1, i) * 0.3) * r * (0.4 + rnd(seed + 2, i) * 0.5), ey = y0 + Math.sin(a + rnd(seed + 1, i) * 0.3) * r * (0.4 + rnd(seed + 2, i) * 0.5);
        return <path key={i} d={`M${x0} ${y0} L${bx} ${by} L${ex} ${ey}`} stroke="rgba(235,245,255,.85)" strokeWidth={1 + rnd(seed + 3, i) * 1.6} fill="none" />;
      })}
      {[0.07, 0.14].map((q, j) => (
        <polygon key={j} points={Array.from({length: 9}, (_, i) => {
          const a = (i / 9) * Math.PI * 2, rr = r * q * (0.8 + rnd(seed + 4 + j, i) * 0.4);
          return `${x0 + Math.cos(a) * rr},${y0 + Math.sin(a) * rr}`;
        }).join(' ')} fill="none" stroke="rgba(235,245,255,.55)" strokeWidth="1.2" />
      ))}
      <circle cx={x0} cy={y0} r={r * 0.012} fill="rgba(255,255,255,.7)" />
    </svg>
  );
};

/** old gold seen from above at an angle: bangles, a chain and beads; the sparks twinkle with f. Drawn around (x, y). */
export const GoldPile: React.FC<{x: number; y: number; s?: number; f?: number; seed?: number; n?: number}> = ({x, y, s = 1, f = 0, seed = 7, n = 14}) => (
  <svg width={720 * s} height={440 * s} viewBox="-360 -220 720 440" style={{position: 'absolute', left: x - 360 * s, top: y - 220 * s, overflow: 'visible'}}>
    <ellipse cx="0" cy="40" rx="290" ry="110" fill="rgba(0,0,0,.4)" />
    {Array.from({length: n}, (_, i) => {
      const a = rnd(seed, i) * Math.PI * 2, q = Math.sqrt(rnd(seed + 1, i));
      const px = Math.cos(a) * q * 240, py = Math.sin(a) * q * 110;
      return (
        <g key={i} transform={`translate(${px} ${py}) rotate(${rnd(seed + 2, i) * 180})`}>
          {i % 3 === 2 ? (
            <path d={`M-70 0 Q-30 ${-30 + rnd(seed + 3, i) * 60} 0 0 T70 0`} stroke="#c79a22" strokeWidth="12" strokeDasharray="10 4" fill="none" />
          ) : (
            <>
              <ellipse rx={56 + rnd(seed + 3, i) * 26} ry={30 + rnd(seed + 4, i) * 14} fill="none" stroke="#a87a14" strokeWidth="21" />
              <ellipse rx={56 + rnd(seed + 3, i) * 26} ry={30 + rnd(seed + 4, i) * 14} fill="none" stroke="#f0c93e" strokeWidth="12" />
              <ellipse rx={56 + rnd(seed + 3, i) * 26} ry={30 + rnd(seed + 4, i) * 14} fill="none" stroke="#fff0a8" strokeWidth="3.5" strokeDasharray="24 40" />
            </>
          )}
        </g>
      );
    })}
    {Array.from({length: 9}, (_, i) => {
      const on = (i + Math.floor(f / 7)) % 3 !== 0;
      const px = (rnd(seed + 5, i) - 0.5) * 460, py = (rnd(seed + 6, i) - 0.5) * 200;
      return on ? <path key={'s' + i} d={`M${px - 22} ${py} L${px} ${py - 4} L${px + 22} ${py} L${px} ${py + 4} Z M${px} ${py - 22} L${px + 4} ${py} L${px} ${py + 22} L${px - 4} ${py} Z`} fill="#fffbe0" /> : null;
    })}
  </svg>
);
