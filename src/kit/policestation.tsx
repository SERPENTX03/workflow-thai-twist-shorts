import React from 'react';
import {rnd} from '../engine/anim';
import {Pool, Svg} from './frame';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from './room';

// สภ.คลองหมอก, the duty office (universe/canon.json → places.police-station): one room in perspective under two fluorescent
// tubes. The system has nowhere to hide, so it is the flattest, brightest place in any story that comes here, on purpose.
// Duty desk at centre-left with the visitor's chair, case board on the back wall behind the officer, filing cabinets on the right,
// the door to the yard on the left wall. Shoot it wide, then over either shoulder across the desk. `board` draws the case board's
// photos; a story that needs something pinned there passes `pinned`; whoever sits behind the desk goes in `behind`.

export const POLICE_ROOM = makeRoom({x: 840, y: 400}, {x0: 470, x1: 1450, y0: 200, y1: 700}, 3.3);

export const PoliceOffice: React.FC<{id?: string; pinned?: React.ReactNode; behind?: React.ReactNode}> = ({id = 'pol', pinned, behind}) => {
  const r = POLICE_ROOM;
  const tube = (u: number, w: number) => { const a = r.P(u - 0.13, 0, w), b = r.P(u + 0.13, 0, w); return <line x1={a.x} y1={a.y + 8} x2={b.x} y2={b.y + 8} stroke="#f4fff6" strokeWidth={16} strokeLinecap="round" />; };
  return (
    <>
      <RoomShell r={r} id={id} wall="#b9bfae" side="#a2a897" sideFar="#adb3a2" floorC="#7d7f74" ceiling="#d9dccf" floor="tiles" walls="plain" boards={10} />
      <RFace r={r} pts={[[0, 0.82, 0], [1, 0.82, 0], [1, 1, 0], [0, 1, 0]]} fill="#7e8574" />
      {/* the case board behind the desk, the king's portrait, the flag */}
      <RFace r={r} pts={[[0.18, 0.2, 0], [0.62, 0.2, 0], [0.62, 0.62, 0], [0.18, 0.62, 0]]} fill="#6b5a3e" stroke="#2f2618" sw={6} />
      <Svg>{Array.from({length: 11}, (_, i) => { const q = r.P(0.21 + (i % 4) * 0.1 + rnd(31, i) * 0.02, 0.25 + Math.floor(i / 4) * 0.12 + rnd(32, i) * 0.02, 0); return <rect key={i} x={q.x} y={q.y} width={60} height={46} fill={i % 3 ? '#d7d0bb' : '#e7e2d0'} transform={`rotate(${rnd(33, i) * 8 - 4} ${q.x} ${q.y})`} />; })}</Svg>
      {pinned}
      <RFace r={r} pts={[[0.72, 0.18, 0], [0.86, 0.18, 0], [0.86, 0.42, 0], [0.72, 0.42, 0]]} fill="#c9a24a" stroke="#5e4716" sw={5} />
      <RFace r={r} pts={[[0.74, 0.2, 0], [0.84, 0.2, 0], [0.84, 0.4, 0], [0.74, 0.4, 0]]} fill="#9c8d72" />
      {/* door on the left wall, cabinets on the right */}
      <RFace r={r} pts={[[0, 0.14, 0.34], [0, 0.14, 0.62], [0, 1, 0.62], [0, 1, 0.34]]} fill="#5d6a68" stroke="#2f3633" sw={6} />
      <RFace r={r} pts={[[0, 0.2, 0.38], [0, 0.2, 0.58], [0, 0.52, 0.58], [0, 0.52, 0.38]]} fill="#dbe7e3" />
      {[0.08, 0.3, 0.52].map(w => <RBox key={w} r={r} u={[0.88, 1]} v={[0.48, 1]} w={[w, w + 0.18]} front="#67705f" top="#7d8674" side="#7d8674" />)}
      {[0.1, 0.32, 0.54].map(w => <RFace key={w} r={r} pts={[[0.88, 0.62, w], [0.88, 0.62, w + 0.14], [0.88, 0.64, w + 0.14], [0.88, 0.64, w]]} fill="#3b4237" />)}
      {behind}
      {/* the desk, stacked files, a phone, a fan */}
      <RBox r={r} u={[0.14, 0.72]} v={[0.73, 1]} w={[0.26, 0.5]} front="#6a4f35" top="#8a6c4d" side="#4e3926" />
      {[[0.18, 0.28], [0.26, 0.3], [0.2, 0.36]].map(([u, w], i) => <RBox key={i} r={r} u={[u, u + 0.08]} v={[0.66 + i * 0.01, 0.73]} w={[w, w + 0.06]} front={['#a8884a', '#907a4f', '#b39a60'][i]} top={['#c5a56a', '#ab9463', '#cdb479'][i]} />)}
      <RBox r={r} u={[0.58, 0.66]} v={[0.7, 0.73]} w={[0.32, 0.4]} front="#22242a" top="#33363e" />
      <Svg>{(() => { const q = r.P(0.47, 0.73, 0.3); return <><rect x={q.x - 5} y={q.y - 80} width={10} height={80} fill="#3c3e3a" /><circle cx={q.x} cy={q.y - 100} r={40} fill="#20221f" opacity={0.75} stroke="#5a5c56" strokeWidth={3} /></>; })()}</Svg>
      {tube(0.36, 0.34)}{tube(0.72, 0.6)}
      <LightVeil id={id} lights={[[780, 560, 1000]]} o={0.14} color="#10140e" />
      <Pool x={800} y={200} rx={1000} ry={600} color="240,250,240" a={0.2} />
    </>
  );
};
