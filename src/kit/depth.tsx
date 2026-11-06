import React from 'react';
import {clamp, rnd} from '../engine/anim';
import {FLOOR, W} from './world';

// Depth and light against the flat look (thai-twist-short/references/depth-light.md): a floor that recedes to a
// vanishing point, side walls in perspective, a long shadow thrown away from the one light, haze between layers.
// All in world px (the 1920×1080 world with FLOOR 930, or a portrait set's own floor line), so the stage camera
// moves them with the set.

const L = -700, R = W + 700; // world overscan the stage camera can reach

/** Floor seams converging to a vanishing point (vx, vy) and cross rows that bunch toward the back wall.
 *  With `c0`/`c1` it paints the floor too; without, it only draws the lines over a floor a set already has. */
export const PerspFloor: React.FC<{
  y?: number; vx?: number; vy?: number; bottom?: number; seams?: number; rows?: number; step?: number;
  c0?: string; c1?: string; ink?: string; a?: number; width?: number;
}> = ({y = FLOOR, vx = 960, vy = 420, bottom = y + 650, seams = 15, rows = 7, step = 0.13, c0, c1, ink = '0,0,0', a = 0.28, width = 3}) => {
  const span = R - L;
  const xs = Array.from({length: seams + 1}, (_, i) => L + (span * i) / seams);
  // ground plane: screen y - vy ∝ 1/depth, so equal depth steps give rows that widen toward the camera
  const ys: number[] = [];
  for (let k = 1; k <= rows; k++) {
    const yy = vy + (y - vy) / Math.max(0.05, 1 - k * step);
    if (yy >= bottom) break;
    ys.push(yy);
  }
  const atBottom = (x: number) => vx + ((x - vx) * (bottom - vy)) / (y - vy);
  const gid = `pf-${vx}-${vy}-${`${c0}${c1}`.replace(/\W/g, '')}`;
  return (
    <svg width={span} height={bottom - y} viewBox={`${L} ${y} ${span} ${bottom - y}`} style={{position: 'absolute', left: L, top: y, pointerEvents: 'none', overflow: 'visible'}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c0 ?? 'transparent'} />
          <stop offset="1" stopColor={c1 ?? c0 ?? 'transparent'} />
        </linearGradient>
      </defs>
      {c0 && <rect x={L} y={y} width={span} height={bottom - y} fill={`url(#${gid})`} />}
      {xs.map((x, i) => <line key={i} x1={x} y1={y} x2={atBottom(x)} y2={bottom} stroke={`rgba(${ink},${a})`} strokeWidth={width} />)}
      {ys.map((yy, i) => <line key={'r' + i} x1={L} y1={yy} x2={R} y2={yy} stroke={`rgba(${ink},${a * 0.8})`} strokeWidth={width * 0.8} />)}
      {/* contact shade where the floor meets the back wall */}
      <rect x={L} y={y} width={span} height={36} fill={`rgba(${ink},${a * 0.9})`} />
    </svg>
  );
};

/** A side wall receding from the frame edge to the back wall at `x` (top `top`, bottom `y`), both edges aimed at the
 *  vanishing point. `side` = which side of the room it is on. `studs` = posts / boards, spaced in perspective;
 *  `opening` = [t0, t1] along the wall (0 = back edge, 1 = outer edge) cut as a dark doorway. */
export const SideWall: React.FC<{
  side: 'l' | 'r'; x: number; top: number; y?: number; vx?: number; vy?: number; reach?: number;
  fill?: string; edge?: string; studs?: number; ink?: string; opening?: [number, number]; openingFill?: string; light?: number;
}> = ({side, x, top, y = FLOOR, vx = 960, vy = 420, reach, fill = '#2a2018', edge = '#3a2c20', studs = 6, ink = 'rgba(0,0,0,.35)', opening, openingFill = '#040507', light = 0}) => {
  const out = reach ?? (side === 'l' ? L : R);
  const k = (out - vx) / (x - vx);
  const yt = vy + (top - vy) * k, yb = vy + (y - vy) * k;
  // a point t (0 back … 1 outer) along the wall, at equal steps in depth: a side wall keeps one lateral offset, so its
  // screen distance from the vanishing point is ∝ 1/depth (depth 1 at the back edge, 1/k at the outer edge)
  const along = (t: number) => {
    const kk = 1 / (1 + t * (1 / k - 1));
    return {x: vx + (x - vx) * kk, top: vy + (top - vy) * kk, bot: vy + (y - vy) * kk};
  };
  const poly = (pts: {x: number; y: number}[]) => pts.map(p => `${p.x},${p.y}`).join(' ');
  const minX = Math.min(x, out), w = Math.abs(out - x), minY = Math.min(top, yt), h = Math.max(y, yb) - minY;
  const grad = `sw-${side}-${x}-${top}`;
  return (
    <svg width={w} height={h} viewBox={`${minX} ${minY} ${w} ${h}`} style={{position: 'absolute', left: minX, top: minY, pointerEvents: 'none', overflow: 'visible'}}>
      <defs>
        {/* the wall darkens toward the camera unless the light is on that side (`light` 0–1) */}
        <linearGradient id={grad} x1={side === 'l' ? '1' : '0'} y1="0" x2={side === 'l' ? '0' : '1'} y2="0">
          <stop offset="0" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor={`rgba(0,0,0,${0.55 * (1 - light)})`} />
        </linearGradient>
      </defs>
      <polygon points={poly([{x, y: top}, {x: out, y: yt}, {x: out, y: yb}, {x, y}])} fill={fill} />
      {Array.from({length: studs}, (_, i) => {
        const p = along((i + 1) / (studs + 1));
        return <line key={i} x1={p.x} y1={p.top} x2={p.x} y2={p.bot} stroke={ink} strokeWidth={4 + 6 * ((i + 1) / (studs + 1))} />;
      })}
      {opening && (() => {
        const a = along(opening[0]), b = along(opening[1]);
        const lift = (p: typeof a) => p.top + (p.bot - p.top) * 0.18;
        return <polygon points={poly([{x: a.x, y: lift(a)}, {x: b.x, y: lift(b)}, {x: b.x, y: b.bot}, {x: a.x, y: a.bot}])} fill={openingFill} />;
      })()}
      <polygon points={poly([{x, y: top}, {x: out, y: yt}, {x: out, y: yb}, {x, y}])} fill={`url(#${grad})`} />
      <line x1={x} y1={top} x2={x} y2={y} stroke={edge} strokeWidth={6} />
    </svg>
  );
};

/** The shadow a figure throws along the floor away from one light at (lx, ly). Long and thin when the light is low or
 *  far to the side, short when it hangs overhead. x = feet centre, y = floor line, h = body height in px.
 *  `Actors` draws one for everyone when the shot has `data.lightAt` (stage.tsx). */
export const CastShadow: React.FC<{x: number; y: number; h: number; light: [number, number]; a?: number; blur?: number; max?: number; o?: number}> = ({
  x, y, h, light, a = 0.55, blur = 6, max = 2.2, o = 1,
}) => {
  const [lx, ly] = light;
  const dx = x - lx;
  const lift = y - ly; // light height above the floor
  const s = dx >= 0 ? 1 : -1;
  // similar triangles: tip distance = h·|dx| / (lift − h); a light at or below head height throws it to `max`
  const len = clamp((h * Math.abs(dx)) / Math.max(lift - h, h * 0.4), h * 0.18, h * max);
  const thick = h * 0.13;
  const tilt = s * clamp(4 + (h / Math.max(80, lift)) * 4, 3, 9); // the floor is seen from above: tip runs toward camera
  return (
    <div style={{position: 'absolute', left: s > 0 ? x - thick * 0.4 : x - len + thick * 0.4, top: y - thick / 2, width: len, height: thick, pointerEvents: 'none', opacity: o,
      transformOrigin: s > 0 ? `${thick * 0.4}px 50%` : `calc(100% - ${thick * 0.4}px) 50%`, transform: `rotate(${tilt}deg)`, filter: `blur(${blur}px)`,
      clipPath: s > 0 ? 'polygon(0 28%, 100% 0, 100% 100%, 0 72%)' : 'polygon(0 0, 100% 28%, 100% 72%, 0 100%)',
      background: `linear-gradient(${s > 0 ? 90 : 270}deg, rgba(3,4,8,${a}) 0%, rgba(3,4,8,${a * 0.55}) 45%, rgba(3,4,8,0) 100%)`}} />
  );
};

/** Haze drifting between the layers (the fourth, atmosphere layer): soft bands at height `y`. Put it after the
 *  background set and before the actors. `a` ≈ 0.12–0.25; colour follows the light (cold night, warm lamp). */
export const Haze: React.FC<{y: number; h?: number; f: number; color?: string; a?: number; drift?: number; seed?: number}> = ({
  y, h = 260, f, color = '150,170,205', a = 0.18, drift = 0.35, seed = 3,
}) => (
  <>
    {Array.from({length: 5}, (_, i) => {
      const w = 900 + rnd(seed, i) * 700;
      const span = R - L + w;
      const x = L - w + ((rnd(seed, i + 9) * span + f * drift * (0.6 + rnd(seed, i + 20) * 0.8)) % span);
      const yy = y - h / 2 + rnd(seed, i + 30) * h * 0.6;
      return <div key={i} style={{position: 'absolute', left: x, top: yy, width: w, height: h * (0.5 + rnd(seed, i + 40) * 0.5), borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 50%, rgba(${color},${a}) 0%, rgba(${color},${a * 0.4}) 45%, rgba(${color},0) 72%)`}} />;
    })}
  </>
);
