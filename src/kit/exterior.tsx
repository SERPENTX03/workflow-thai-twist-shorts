import React from 'react';

// A building seen from its corner (thai-twist-short/references/directing.md §5.2 "ภายนอกก็เป็นสถานที่").
//
// Our older exteriors are front elevations: the house parallel to the screen, a person standing face-on before it
// (fifth-room shot 49). Here the camera stands off a corner: one vertical edge is nearest, and the two walls run away
// to two vanishing points on one horizon. Like room.tsx for interiors, the place is built once from a few numbers and
// every wall, window, roof, fence and person takes its position from the same projection.
//
// Ground coordinates (a, b), height h:
//   a runs along the LEFT wall from the corner (0) to its far end (1); b along the RIGHT wall the same way.
//   The building stands on a ≥ 0, b ≥ 0. In front of the left wall is b < 0, in front of the right wall is a < 0
//   (toward the camera). h = 0 on the ground, 1 at the eaves.
//
//   const B = makeBlock({x: 1080, y0: 300, y1: 800, hy: 690, left: {x: 250, k: 0.5}, right: {x: 1700, k: 0.62}});
//   <BGround b={B} fill="#2a2622" />
//   <BWall b={B} side="l" fill="#6a5140" planks={9} />            // the wall the light falls on
//   <BWall b={B} side="r" fill="#3a2c24" />                        // the wall in shade
//   <BRect b={B} side="l" along={[0.2, 0.4]} h={[0.3, 0.75]} fill="#ffd27a" />   // a lit window
//   <BRoof b={B} fill="#4b2f2a" dark="#33201d" />
//   <BFence b={B} from={[-0.1, -0.35]} to={[1.1, -0.35]} posts={12} />
//   const s = blockStand(B, 0.3, -0.45);   // feet + scale of someone at the gate; blockPxPerCm(B, 0.3, -0.45) for the height

export type Pt = {x: number; y: number};
type Side = 'l' | 'r';

export const makeBlock = (o: {
  /** the near corner edge: x, top (eaves) and bottom (ground) on screen */
  x: number; y0: number; y1: number;
  /** horizon = the camera's eye height on screen. Between y0 and y1: eye level. Near y1 or below: a low camera. Above y0: looking down. */
  hy: number;
  /** far end of each wall on screen: its x, and how tall it is there compared with the corner (k, 0–1; smaller = longer / steeper) */
  left: {x: number; k: number};
  right: {x: number; k: number};
}) => {
  const vl = {x: o.x + (o.left.x - o.x) / (1 - o.left.k), y: o.hy};
  const vr = {x: o.x + (o.right.x - o.x) / (1 - o.right.k), y: o.hy};
  const al = (1 - o.left.k) / o.left.k, ar = (1 - o.right.k) / o.right.k;
  /** screen scale at ground point (a, b): 1 at the corner, smaller farther away, bigger toward the camera */
  const s = (a: number, b: number) => 1 / Math.max(0.05, 1 + a * al + b * ar);
  const P = (a: number, b: number, h = 0): Pt => {
    const k = s(a, b);
    const gx = (o.x + a * al * vl.x + b * ar * vr.x) * k, gy = (o.y1 + a * al * o.hy + b * ar * o.hy) * k;
    return {x: gx, y: gy - h * (o.y1 - o.y0) * k};
  };
  /** a point on a wall: `along` 0 (corner) … 1 (far end), h 0 (ground) … 1 (eaves) */
  const W = (side: Side, along: number, h: number) => (side === 'l' ? P(along, 0, h) : P(0, along, h));
  const Q = (a: Pt[]) => a.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return {o, vl, vr, s, P, W, Q};
};
export type Block = ReturnType<typeof makeBlock>;

/** Where someone standing on ground point (a, b) has their feet, and how big they are compared with the corner. */
export const blockStand = (b: Block, a: number, bb: number) => ({...b.P(a, bb, 0), k: b.s(a, bb)});
/** px per cm at ground point (a, b), for `personHeight(id, pxPerCm)` or `h=` in an actor string; `wallCm` = how tall the wall is in the story world. */
export const blockPxPerCm = (b: Block, a: number, bb: number, wallCm = 300) => ((b.o.y1 - b.o.y0) / wallCm) * b.s(a, bb);

const Svg: React.FC<{children: React.ReactNode; W?: number; H?: number}> = ({children, W = 1920, H = 1080}) => (
  <svg width={W + 2000} height={H + 2000} viewBox={`-1000 -1000 ${W + 2000} ${H + 2000}`}
    style={{position: 'absolute', left: -1000, top: -1000, overflow: 'visible', pointerEvents: 'none'}}>{children}</svg>
);

/** The ground: a fill from the horizon down, with faint lines running to both vanishing points so it reads as a plane. */
export const BGround: React.FC<{b: Block; fill: string; far?: string; lines?: number; ink?: string; W?: number; H?: number}> = ({b, fill, far, lines = 7, ink = '#000', W = 1920, H = 1080}) => {
  const id = `bg${Math.round(b.o.x)}-${Math.round(b.o.hy)}`;
  const rays: React.ReactNode[] = [];
  for (let i = 0; i < lines; i++) {
    const t = (i + 0.5) / lines, x = -600 + t * (W + 1200);
    rays.push(<line key={'l' + i} x1={b.vl.x} y1={b.vl.y} x2={x} y2={H + 400} stroke={ink} strokeOpacity={0.14} strokeWidth={3} />);
    rays.push(<line key={'r' + i} x1={b.vr.x} y1={b.vr.y} x2={x} y2={H + 400} stroke={ink} strokeOpacity={0.14} strokeWidth={3} />);
  }
  return (
    <Svg W={W} H={H}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={far ?? fill} /><stop offset="1" stopColor={fill} /></linearGradient>
        <clipPath id={id + 'c'}><rect x={-1000} y={b.o.hy} width={W + 2000} height={H + 1000 - b.o.hy} /></clipPath>
      </defs>
      <rect x={-1000} y={b.o.hy} width={W + 2000} height={H + 1000 - b.o.hy} fill={`url(#${id})`} />
      <g clipPath={`url(#${id}c)`}>{rays}</g>
    </Svg>
  );
};

/** Any flat shape on the ground, as (a, b) points: a path, a pool of lamp light, a puddle, the shadow of the house. */
export const BFloor: React.FC<{b: Block; pts: [number, number][]; fill: string; o?: number; blend?: 'screen' | 'multiply'; blur?: number}> = ({b, pts, fill, o = 1, blend, blur}) => (
  <Svg><polygon points={b.Q(pts.map(([a, bb]) => b.P(a, bb, 0)))} fill={fill} opacity={o} style={{mixBlendMode: blend, filter: blur ? `blur(${blur}px)` : undefined}} /></Svg>
);

/** One wall, corner to far end. `planks` draws that many siding lines running to the wall's vanishing point;
 *  `posts` vertical seams. `from` / `to` cut the wall shorter or run it past its far end (a long shophouse row). */
export const BWall: React.FC<{b: Block; side: Side; fill: string; planks?: number; posts?: number; ink?: string; from?: number; to?: number; top?: number}> = ({b, side, fill, planks = 0, posts = 0, ink = '#120c08', from = 0, to = 1, top = 1}) => {
  const lines: React.ReactNode[] = [];
  for (let i = 1; i < planks; i++) {
    const h = (i / planks) * top, p = b.W(side, from, h), q = b.W(side, to, h);
    lines.push(<line key={'p' + i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={ink} strokeOpacity={0.3} strokeWidth={2.5} />);
  }
  for (let i = 1; i < posts; i++) {
    const t = from + (i / posts) * (to - from), p = b.W(side, t, 0), q = b.W(side, t, top);
    lines.push(<line key={'s' + i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={ink} strokeOpacity={0.3} strokeWidth={2.5} />);
  }
  const foot0 = b.W(side, from, 0), foot1 = b.W(side, to, 0);
  return (
    <Svg>
      <polygon points={b.Q([b.W(side, from, 0), b.W(side, from, top), b.W(side, to, top), b.W(side, to, 0)])} fill={fill} />
      {lines}
      {/* where the wall meets the ground: a dark seam, so the house sits on the earth */}
      <line x1={foot0.x} y1={foot0.y} x2={foot1.x} y2={foot1.y} stroke={ink} strokeOpacity={0.55} strokeWidth={7} />
    </Svg>
  );
};

/** A rectangle on a wall: window, door, shutter, sign, a boarded panel. `bars` draws that many window bars;
 *  `boards` that many planks nailed across. `glow` adds a soft halo for a lit window (the light source of a night shot). */
export const BRect: React.FC<{b: Block; side: Side; along: [number, number]; h: [number, number]; fill: string; frame?: string; bars?: number; boards?: number; boardC?: string; glow?: string; o?: number}> = ({
  b, side, along: [t0, t1], h: [h0, h1], fill, frame, bars = 0, boards = 0, boardC = '#3a271b', glow, o = 1,
}) => {
  const c = [b.W(side, t0, h0), b.W(side, t0, h1), b.W(side, t1, h1), b.W(side, t1, h0)];
  const mid = {x: (c[0].x + c[2].x) / 2, y: (c[0].y + c[2].y) / 2};
  const sw = Math.max(3, 9 * b.s(side === 'l' ? (t0 + t1) / 2 : 0, side === 'r' ? (t0 + t1) / 2 : 0));
  const extra: React.ReactNode[] = [];
  for (let i = 1; i < bars; i++) {
    const t = t0 + (i / bars) * (t1 - t0), p = b.W(side, t, h0), q = b.W(side, t, h1);
    extra.push(<line key={'b' + i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={frame ?? '#1a1410'} strokeWidth={sw * 0.5} />);
  }
  for (let i = 0; i < boards; i++) {
    const a0 = h0 + ((i + 0.12) / boards) * (h1 - h0), a1 = h0 + ((i + 0.88) / boards) * (h1 - h0);
    extra.push(<polygon key={'n' + i} points={b.Q([b.W(side, t0 - 0.01, a0), b.W(side, t0 - 0.01, a1), b.W(side, t1 + 0.01, a1), b.W(side, t1 + 0.01, a0)])} fill={boardC} stroke="#120c08" strokeWidth={2} />);
  }
  return (
    <Svg>
      {glow && <ellipse cx={mid.x} cy={mid.y} rx={Math.abs(c[2].x - c[0].x) * 1.5 + 60} ry={Math.abs(c[1].y - c[0].y) * 1.1 + 60} fill={glow} opacity={0.22} style={{filter: 'blur(40px)', mixBlendMode: 'screen'}} />}
      <polygon points={b.Q(c)} fill={fill} stroke={frame} strokeWidth={frame ? sw : 0} opacity={o} />
      {extra}
    </Svg>
  );
};

/** A hip roof with eaves that overhang the walls. `rise` = ridge height above the eaves in wall heights; `over` =
 *  overhang in wall lengths; `depth` = how far back the ridge sits (the house's depth along b, in wall lengths). */
export const BRoof: React.FC<{b: Block; fill: string; dark?: string; rise?: number; over?: number; depth?: number; ink?: string}> = ({b, fill, dark, rise = 0.45, over = 0.07, depth = 1, ink = '#120c08'}) => {
  const e0 = b.P(-over, -over, 1), eL = b.P(1 + over, -over, 1), eR = b.P(-over, depth + over, 1);
  const r1 = b.P(0.28, depth / 2, 1 + rise), r2 = b.P(0.72, depth / 2, 1 + rise);
  return (
    <Svg>
      {/* the slope over the right wall, then the one over the left wall */}
      <polygon points={b.Q([e0, eR, r1])} fill={dark ?? fill} />
      <polygon points={b.Q([e0, eL, r2, r1])} fill={fill} />
      <line x1={e0.x} y1={e0.y} x2={eL.x} y2={eL.y} stroke={ink} strokeOpacity={0.6} strokeWidth={6} />
      <line x1={e0.x} y1={e0.y} x2={eR.x} y2={eR.y} stroke={ink} strokeOpacity={0.6} strokeWidth={6} />
      <line x1={e0.x} y1={e0.y} x2={r1.x} y2={r1.y} stroke={ink} strokeOpacity={0.35} strokeWidth={4} />
      {/* shade under the eaves on both walls */}
      <polygon points={b.Q([b.P(0, 0, 1), b.P(1, 0, 1), b.P(1, 0, 0.9), b.P(0, 0, 0.9)])} fill="#000" opacity={0.28} />
      <polygon points={b.Q([b.P(0, 0, 1), b.P(0, depth, 1), b.P(0, depth, 0.9), b.P(0, 0, 0.9)])} fill="#000" opacity={0.28} />
    </Svg>
  );
};

/** A fence or railing between two ground points: `posts` uprights of height `h` (in wall heights) and two rails.
 *  Posts shrink with distance by themselves. `gate` = [t0, t1] along the run leaves an opening. */
export const BFence: React.FC<{b: Block; from: [number, number]; to: [number, number]; posts?: number; h?: number; color?: string; gate?: [number, number]}> = ({b, from, to, posts = 10, h = 0.3, color = '#2a221c', gate}) => {
  const at = (t: number): [number, number] => [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
  const open = (t: number) => !!gate && t > gate[0] && t < gate[1];
  const els: React.ReactNode[] = [];
  for (let i = 0; i <= posts; i++) {
    const t = i / posts;
    if (open(t)) continue;
    const [a, bb] = at(t), p = b.P(a, bb, 0), q = b.P(a, bb, h);
    els.push(<line key={'p' + i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={color} strokeWidth={Math.max(3, 16 * b.s(a, bb))} strokeLinecap="round" />);
  }
  const runs: [number, number][] = gate ? [[0, gate[0]], [gate[1], 1]] : [[0, 1]];
  for (const [t0, t1] of runs) for (const hh of [h * 0.85, h * 0.4]) {
    const [a0, b0] = at(t0), [a1, b1] = at(t1), p = b.P(a0, b0, hh), q = b.P(a1, b1, hh);
    els.push(<line key={`r${t0}${hh}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={color} strokeWidth={Math.max(3, 9 * b.s((a0 + a1) / 2, (b0 + b1) / 2))} />);
  }
  return <Svg>{els}</Svg>;
};

/** A pole standing on the ground (street lamp, power pole, post): height in wall heights; `lamp` draws a lit head. */
export const BPole: React.FC<{b: Block; at: [number, number]; h?: number; color?: string; lamp?: string}> = ({b, at: [a, bb], h = 1.5, color = '#1c1a1c', lamp}) => {
  const p = b.P(a, bb, 0), q = b.P(a, bb, h), k = b.s(a, bb);
  return (
    <Svg>
      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={color} strokeWidth={Math.max(4, 20 * k)} strokeLinecap="round" />
      {lamp && <>
        <line x1={q.x} y1={q.y} x2={q.x + 70 * k} y2={q.y + 6 * k} stroke={color} strokeWidth={Math.max(3, 12 * k)} strokeLinecap="round" />
        <ellipse cx={q.x + 78 * k} cy={q.y + 18 * k} rx={26 * k} ry={12 * k} fill={lamp} />
        <circle cx={q.x + 78 * k} cy={q.y + 18 * k} r={150 * k} fill={lamp} opacity={0.25} style={{filter: `blur(${30 * k}px)`, mixBlendMode: 'screen'}} />
      </>}
    </Svg>
  );
};

/** A soft contact shadow under someone standing at ground point (a, b). */
export const BShadow: React.FC<{b: Block; at: [number, number]; size?: number; o?: number}> = ({b, at: [a, bb], size = 150, o = 0.4}) => {
  const c = b.P(a, bb, 0), k = b.s(a, bb);
  return <Svg><ellipse cx={c.x} cy={c.y} rx={size * k * 0.5} ry={size * k * 0.12} fill="#000" opacity={o} /></Svg>;
};
