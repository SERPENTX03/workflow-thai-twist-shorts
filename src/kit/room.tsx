import React from 'react';
import {lerp} from '../engine/anim';

// A room the camera can walk into (thai-twist-short/references/directing.md §3).
//
// Our older sets are front elevations: one wall parallel to the screen and one floor line, so every camera on them is
// the same picture zoomed. A room built here is a one-point-perspective box: the back wall's rectangle on screen, one
// vanishing point, and a depth. Any point inside is (u across 0..1, v down 0..1, w toward camera 0..1, 0 = on the
// back wall). Draw the set once in world px, then frame it wide, medium, close, low or high with the camera: the walls,
// floor and furniture stay true from every framing. Pattern from what-if-studio's room kit (src/engine/room.tsx).
//
//   const R = makeRoom({x: 620, y: 470}, {x0: 380, x1: 1340, y0: 220, y1: 760}, 3.4);
//   <RoomShell r={R} id="sh12" floor="boards" wall="planks" />
//   <RFace r={R} pts={[[0.6, 0.15, 0], [0.85, 0.15, 0], [0.85, 0.55, 0], [0.6, 0.55, 0]]} fill="#9fb6d8" />  // window
//   <RBox r={R} u={[0.1, 0.4]} v={[0.72, 1]} w={[0.3, 0.6]} front="#5a3d28" top="#7a5636" side="#3a2818" />  // bed
//   const s = standAt(R, 0.55, 0.5);   // feet point + scale for someone standing there
//   <Sprite id="lead-male-A" height={personHeight('lead-male-A', roomPxPerCm(R, 0.5))} />  at (s.x, s.y)
//   <LightVeil id="sh12" lights={[[1020, 330, 380]]} o={0.5} />   // mid-tones sink, light stays where it falls

export type Pt = {x: number; y: number};
export type V3 = [number, number, number];
const pts = (a: Pt[]) => a.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

export const makeRoom = (vp: Pt, back: {x0: number; x1: number; y0: number; y1: number}, depth = 3.4) => {
  /** screen scale at depth w: 1 on the back wall, `depth` at the near plane; equal w steps = equal depth steps */
  const s = (w: number) => 1 / lerp(1, 1 / depth, w);
  const P = (u: number, v: number, w: number): Pt => {
    const k = s(w);
    return {x: vp.x + (lerp(back.x0, back.x1, u) - vp.x) * k, y: vp.y + (lerp(back.y0, back.y1, v) - vp.y) * k};
  };
  const Q = (a: V3[]) => pts(a.map(([u, v, w]) => P(u, v, w)));
  return {vp, back, depth, s, P, Q};
};
export type Room = ReturnType<typeof makeRoom>;

/** Where someone standing on floor point (u, w) has their feet, and how much bigger than on the back wall they are. */
export const standAt = (r: Room, u: number, w: number) => ({...r.P(u, 1, w), k: r.s(w)});
/** px per cm at depth w, for `personHeight(id, pxPerCm)`; `roomCm` = how tall the back wall is in the story world. */
export const roomPxPerCm = (r: Room, w: number, roomCm = 280) => ((r.back.y1 - r.back.y0) / roomCm) * r.s(w);

const Svg: React.FC<{children: React.ReactNode; W?: number; H?: number}> = ({children, W = 1920, H = 1080}) => (
  <svg width={W + 2000} height={H + 2000} viewBox={`-1000 -1000 ${W + 2000} ${H + 2000}`}
    style={{position: 'absolute', left: -1000, top: -1000, overflow: 'visible', pointerEvents: 'none'}}>{children}</svg>
);

/** Any flat shape on a room surface, given as room points: a window, a door, a rug, a poster, a pool of light. */
export const RFace: React.FC<{r: Room; pts: V3[]; fill: string; stroke?: string; sw?: number; o?: number; blend?: 'screen' | 'multiply'}> = ({r, pts: p, fill, stroke, sw = 3, o = 1, blend}) => (
  <Svg><polygon points={r.Q(p)} fill={fill} stroke={stroke} strokeWidth={stroke ? sw : 0} opacity={o} style={blend ? {mixBlendMode: blend} : undefined} /></Svg>
);

/** The shell: ceiling, two side walls, floor and back wall, with boards / planks running to the vanishing point,
 *  and dark corners where planes meet (cheap ambient occlusion). Colours are the lit values; the veil sinks them. */
export const RoomShell: React.FC<{
  r: Room; id: string; W?: number; H?: number;
  wall?: string; side?: string; sideFar?: string; floorC?: string; ceiling?: string; ink?: string;
  floor?: 'boards' | 'tiles' | 'plain'; walls?: 'planks' | 'plain'; boards?: number; skirting?: boolean;
}> = ({r, id, W = 1920, H = 1080, wall = '#6a4c34', side = '#563d2a', sideFar, floorC = '#4a3424', ceiling = '#2a1e16', ink = '#140e0a', floor = 'boards', walls = 'planks', boards = 14, skirting = true}) => {
  const {Q, P} = r;
  const sideR = sideFar ?? side;
  const lines: React.ReactNode[] = [];
  if (floor !== 'plain') for (let i = 1; i < boards; i++) {
    const u = i / boards, a = P(u, 1, 0), b = P(u, 1, 1);
    lines.push(<line key={'f' + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeOpacity={0.35} strokeWidth={2.5} />);
  }
  if (floor === 'tiles') for (let i = 1; i < 9; i++) {
    const w = i / 9, a = P(0, 1, w), b = P(1, 1, w);
    lines.push(<line key={'t' + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeOpacity={0.3} strokeWidth={2} />);
  }
  if (walls === 'planks') {
    const n = Math.round(boards * 1.2);
    for (let i = 1; i < n; i++) {
      const u = i / n, a = P(u, 0, 0), b = P(u, 1, 0);
      lines.push(<line key={'b' + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeOpacity={0.28} strokeWidth={2} />);
    }
    for (let i = 1; i < 8; i++) for (const u of [0, 1]) {
      const w = i / 8, a = P(u, 0, w), b = P(u, 1, w);
      lines.push(<line key={`s${u}${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeOpacity={0.3} strokeWidth={2.5} />);
    }
  }
  const g = `${id}-ao`;
  const c = (u: number, v: number, w: number) => P(u, v, w);
  const edge = (a: Pt, b: Pt, k: string) => <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeOpacity={0.55} strokeWidth={6} />;
  return (
    <Svg W={W} H={H}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.45} />
        </linearGradient>
      </defs>
      <polygon points={Q([[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]])} fill={ceiling} />
      <polygon points={Q([[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]])} fill={side} />
      <polygon points={Q([[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]])} fill={sideR} />
      <polygon points={Q([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]])} fill={floorC} />
      <polygon points={Q([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]])} fill={wall} />
      {lines}
      {/* dark band at the foot of the back wall, then the four corner seams */}
      <rect x={r.back.x0} y={r.back.y1 - 80} width={r.back.x1 - r.back.x0} height={80} fill={`url(#${g})`} />
      {skirting && <polygon points={Q([[0, 0.97, 0], [1, 0.97, 0], [1, 1, 0], [0, 1, 0]])} fill={ink} opacity={0.5} />}
      {edge(c(0, 0, 0), c(0, 0, 1), 'e1')}{edge(c(1, 0, 0), c(1, 0, 1), 'e2')}
      {edge(c(0, 1, 0), c(0, 1, 1), 'e3')}{edge(c(1, 1, 0), c(1, 1, 1), 'e4')}
      {edge(c(0, 0, 0), c(0, 1, 0), 'e5')}{edge(c(1, 0, 0), c(1, 1, 0), 'e6')}
    </Svg>
  );
};

/** A box standing in the room (bed, table, cabinet, crate), drawn face by face: only the faces this camera sees.
 *  `v` runs 0 (ceiling) … 1 (floor), so a 70 cm table in a 280 cm room is v = [0.75, 1]. */
export const RBox: React.FC<{r: Room; u: [number, number]; v: [number, number]; w: [number, number]; front: string; top?: string; side?: string; ink?: string; rim?: string}> = ({
  r, u: [u0, u1], v: [v0, v1], w: [w0, w1], front, top, side, ink = '#140e0a', rim,
}) => {
  const bx = (u: number) => lerp(r.back.x0, r.back.x1, u);
  const by = (v: number) => lerp(r.back.y0, r.back.y1, v);
  const faces: React.ReactNode[] = [];
  if (by(v0) > r.vp.y) faces.push(<polygon key="t" points={r.Q([[u0, v0, w0], [u1, v0, w0], [u1, v0, w1], [u0, v0, w1]])} fill={top ?? front} stroke={ink} strokeWidth={3} />);
  if (by(v1) < r.vp.y) faces.push(<polygon key="b" points={r.Q([[u0, v1, w0], [u1, v1, w0], [u1, v1, w1], [u0, v1, w1]])} fill={side ?? front} stroke={ink} strokeWidth={3} />);
  if (bx(u0) > r.vp.x) faces.push(<polygon key="l" points={r.Q([[u0, v0, w0], [u0, v0, w1], [u0, v1, w1], [u0, v1, w0]])} fill={side ?? front} stroke={ink} strokeWidth={3} />);
  if (bx(u1) < r.vp.x) faces.push(<polygon key="r" points={r.Q([[u1, v0, w0], [u1, v0, w1], [u1, v1, w1], [u1, v1, w0]])} fill={side ?? front} stroke={ink} strokeWidth={3} />);
  const a = r.P(u0, v0, w1), b = r.P(u1, v0, w1);
  return (
    <Svg>
      {/* contact shadow on the floor, a little wider than the box */}
      {v1 >= 0.999 && <polygon points={r.Q([[u0 - 0.02, 1, w0 - 0.02], [u1 + 0.02, 1, w0 - 0.02], [u1 + 0.03, 1, w1 + 0.03], [u0 - 0.03, 1, w1 + 0.03]])} fill="#000" opacity={0.35} />}
      {faces}
      <polygon points={r.Q([[u0, v0, w1], [u1, v0, w1], [u1, v1, w1], [u0, v1, w1]])} fill={front} stroke={ink} strokeWidth={3} />
      {rim && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={rim} strokeWidth={3} opacity={0.7} />}
    </Svg>
  );
};

/** A soft contact shadow on the floor under someone at (u, w). */
export const RShadow: React.FC<{r: Room; u: number; w: number; size?: number; o?: number}> = ({r, u, w, size = 0.07, o = 0.4}) => {
  const c = r.P(u, 1, w), k = r.s(w), rx = size * (r.back.x1 - r.back.x0) * k * 0.5;
  return <Svg><ellipse cx={c.x} cy={c.y} rx={rx} ry={rx * 0.22} fill="#000" opacity={o} /></Svg>;
};

/** The contrast pass: a dark veil over everything drawn before it, with soft holes where light falls, so the mid-tones
 *  sink and the pools of light around a window, a lamp or a phone glow. Draw it after the set and before the people
 *  who stand in the light (they stay at full value), or after them for a figure in the dark. Each hole about the size
 *  of its pool of light: one as big as the wall lights it evenly and the frame goes flat again. */
export const LightVeil: React.FC<{id: string; lights: [number, number, number][]; o?: number; color?: string; W?: number; H?: number}> = ({id, lights, o = 0.5, color = '#07040c', W = 1920, H = 1080}) => (
  <Svg W={W} H={H}>
    <defs>
      <radialGradient id={`${id}-hole`}>
        <stop offset="0%" stopColor="#000" stopOpacity={1} />
        <stop offset="45%" stopColor="#000" stopOpacity={0.75} />
        <stop offset="100%" stopColor="#000" stopOpacity={0} />
      </radialGradient>
      <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={-1000} y={-1000} width={W + 2000} height={H + 2000}>
        <rect x={-1000} y={-1000} width={W + 2000} height={H + 2000} fill="#fff" />
        {lights.map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr} fill={`url(#${id}-hole)`} />)}
      </mask>
    </defs>
    <rect x={-1000} y={-1000} width={W + 2000} height={H + 2000} fill={color} opacity={o} mask={`url(#${id}-mask)`} />
  </Svg>
);
