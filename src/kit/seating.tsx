import React from 'react';
import {RBox, roomPxPerCm, type Room} from './room';

// Seats that belong to a place, for rooms built with room.tsx (CLAUDE.md rule 16: nobody sits on air, and a set that
// has its own seat seats people on it: no wooden chair pulled in beside a bench, a bed or a counter stool).
//
// The cast's sit pose is cartoon-proportioned: the seat is ~14 % of standing height and the lap ~22 %, so furniture
// people sit at is sized to the pose, not to real centimetres (a 73 cm table reaches a sprite's shoulders).
//   SIT_CM   seat and table heights as a share of a 160 cm person, in room cm
//
//   <BenchTable r u={[0.08, 0.3]} w={0.72} part="far" />     the bench on the far side (people sit on it facing camera)
//   …seated people of that row (benchSeat → x, y, h)…
//   <BenchTable r u={[0.08, 0.3]} w={0.72} part="front" />   the table top, its legs and the near bench, over their laps
//
//   roomAt(r, x, y)           screen floor point → room (u, w): snap an actor written as `who@x,y` to the nearest seat
//   benchSeat(r, u, w, cm)    where someone sitting on the far bench of the table at row w has feet and height

export const SIT_CM = {bench: 22, table: 50, legInset: 0.01};

/** room (u, w) of a screen point on the floor */
export const roomAt = (r: Room, x: number, y: number) => {
  const s = (y - r.vp.y) / (r.back.y1 - r.vp.y);
  const w = (1 - 1 / s) / (1 - 1 / r.depth);
  const X = r.vp.x + (x - r.vp.x) / s;
  return {u: (X - r.back.x0) / (r.back.x1 - r.back.x0), w};
};

const vAt = (cm: number, roomCm: number) => 1 - cm / roomCm;

/** the far bench of a table at row w sits at w - 0.045 … w - 0.02; a seated person's feet go under the table edge */
export const benchSeat = (r: Room, u: number, w: number, cm: number, roomCm = 280) => {
  const wf = w - 0.012;
  const q = r.P(u, 1, wf);
  return {x: q.x, y: q.y, h: cm * roomPxPerCm(r, wf, roomCm), w: wf};
};

export const BenchTable: React.FC<{
  r: Room; u: [number, number]; w: number; part: 'far' | 'front'; depth?: number; roomCm?: number;
  steel?: string; steelTop?: string; leg?: string; benchC?: string; benchTop?: string;
}> = ({r, u: [u0, u1], w, part, depth = 0.1, roomCm = 280, steel = '#b9bdbf', steelTop = '#d7dbdd', leg = '#7d8284', benchC = '#8f9496', benchTop = '#a7acae'}) => {
  const vt = vAt(SIT_CM.table, roomCm), vb = vAt(SIT_CM.bench, roomCm);
  if (part === 'far') return (
    <>
      {[u0 + 0.02, u1 - 0.02].map(uu => <RBox key={uu} r={r} u={[uu, uu + 0.006]} v={[vb + 0.01, 1]} w={[w - 0.035, w - 0.03]} front={leg} />)}
      <RBox r={r} u={[u0, u1]} v={[vb, vb + 0.012]} w={[w - 0.045, w - 0.02]} front={benchC} top={benchTop} />
    </>
  );
  return (
    <>
      {/* the table: two legs at each end on a foot rail, the steel top over the laps */}
      {[u0 + 0.012, u1 - 0.02].map(uu => <RBox key={uu} r={r} u={[uu, uu + 0.008]} v={[vt + 0.01, 1]} w={[w + depth * 0.45, w + depth * 0.55]} front={leg} />)}
      <RBox r={r} u={[u0, u1]} v={[vt, vt + 0.014]} w={[w, w + depth]} front={steel} top={steelTop} />
      {/* the near bench, empty, on the camera side */}
      {[u0 + 0.02, u1 - 0.02].map(uu => <RBox key={'n' + uu} r={r} u={[uu, uu + 0.006]} v={[vb + 0.01, 1]} w={[w + depth + 0.035, w + depth + 0.04]} front={leg} />)}
      <RBox r={r} u={[u0, u1]} v={[vb, vb + 0.012]} w={[w + depth + 0.025, w + depth + 0.05]} front={benchC} top={benchTop} />
    </>
  );
};
