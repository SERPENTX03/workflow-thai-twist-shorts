import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {D, FONT, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {Actors, C, Shot} from './cast';

// ห้องนายสถานี (brief.md → Sets): one room in perspective, lit by the green desk lamp only.
//   back wall   window onto the dark platform (rain), notice board with the radio memo (red header), red digital clock
//   left wall   steel drawer cabinet (the bottom drawer holds the revolver), the small FM radio on top
//   right wall  door open to the platform: neon green-white
//   desk        lamp · two-way radio on its charger · cream phone · steel box · the group photo
// data.time: night (default) | morning | dawn (pale window, the lamp still on) — past shots use data.past on top.

export const OFFICE = makeRoom({x: 860, y: 470}, {x0: 470, x1: 1400, y0: 210, y1: 740}, 3.2);
export const OFFICE_HIGH = makeRoom({x: 860, y: 230}, {x0: 470, x1: 1400, y0: 40, y1: 520}, 3.2);
export const OFFICE_LOW = makeRoom({x: 860, y: 700}, {x0: 470, x1: 1400, y0: 400, y1: 900}, 3.2);
export const officeRoom = (view: string) => (/-low/.test(view) ? OFFICE_LOW : /-high/.test(view) ? OFFICE_HIGH : OFFICE);

const OfficeWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const R = officeRoom(p.shot.view ?? '');
  const LAMP = R.P(0.36, 0.6, 0.52);
  const d = D(p), time = d.time ?? 'night';
  const morning = time === 'morning', dawn = time === 'dawn';
  const win = morning ? '#f3e6c4' : dawn ? '#8a9bb3' : '#0b1018';
  const radioOn = d.radio !== 'off';
  return (
    <>
      <RoomShell r={R} id="off" wall="#5e6556" side="#4c5246" sideFar="#555b4e" floorC="#3e3a33" ceiling="#26261f" floor="tiles" walls="plain" boards={10} />
      {/* wood dado on the back wall */}
      <RFace r={R} pts={[[0, 0.62, 0], [1, 0.62, 0], [1, 1, 0], [0, 1, 0]]} fill="#4a3a29" />
      <RFace r={R} pts={[[0, 0.6, 0], [1, 0.6, 0], [1, 0.63, 0], [0, 0.63, 0]]} fill="#2c2117" />
      {/* window onto the platform */}
      <RFace r={R} pts={[[0.56, 0.2, 0], [0.86, 0.2, 0], [0.86, 0.56, 0], [0.56, 0.56, 0]]} fill={win} stroke="#2a2017" sw={9} />
      <RFace r={R} pts={[[0.705, 0.2, 0], [0.715, 0.2, 0], [0.715, 0.56, 0], [0.705, 0.56, 0]]} fill="#2a2017" />
      {time === 'night' && <Svg>{Array.from({length: 26}, (_, i) => { const a = R.P(0.57 + rnd(11, i) * 0.28, 0.21 + rnd(12, i) * 0.3, 0); const y = a.y + ((p.f * 9 + i * 37) % 60); return <line key={i} x1={a.x} y1={y} x2={a.x - 3} y2={y + 26} stroke="#8fa7b8" strokeWidth={2} opacity={0.35} />; })}</Svg>}
      {time === 'night' && (() => { const q = R.P(0.66, 0.36, 0); return <Pool x={q.x} y={q.y} rx={70} color={C.neon} a={0.5} />; })()}
      {/* notice board: cork, papers, the memo with the red header */}
      <RFace r={R} pts={[[0.12, 0.24, 0], [0.46, 0.24, 0], [0.46, 0.55, 0], [0.12, 0.55, 0]]} fill="#7d5f3d" stroke="#3a2a1a" sw={6} />
      {[[0.14, 0.27, 0.22, 0.4], [0.24, 0.26, 0.31, 0.36], [0.33, 0.28, 0.44, 0.41], [0.15, 0.42, 0.25, 0.53], [0.27, 0.39, 0.36, 0.53], [0.38, 0.43, 0.45, 0.53]].map(([u0, v0, u1, v1], i) => (
        <RFace key={i} r={R} pts={[[u0, v0, 0], [u1, v0, 0], [u1, v1, 0], [u0, v1, 0]]} fill={i === 0 ? '#e4dcc4' : '#cfc6ad'} />
      ))}
      <RFace r={R} pts={[[0.14, 0.27, 0], [0.22, 0.27, 0], [0.22, 0.295, 0], [0.14, 0.295, 0]]} fill={C.red} />
      <Svg>{[0.31, 0.33, 0.35, 0.37].map(v => { const a = R.P(0.15, v, 0), b = R.P(0.21, v, 0); return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6d6655" strokeWidth={2} />; })}</Svg>
      {/* red digital clock above the board */}
      <RFace r={R} pts={[[0.24, 0.1, 0], [0.38, 0.1, 0], [0.38, 0.18, 0], [0.24, 0.18, 0]]} fill="#121212" stroke="#2a2a2a" sw={4} />
      {(() => { const a = R.P(0.31, 0.165, 0); return <Svg><text x={a.x} y={a.y} textAnchor="middle" fontFamily={FONT.type} fontWeight={700} fontSize={34} fill="#ff4a3a">{d.clock ?? '23:14'}</text></Svg>; })()}
      {/* a calendar and a framed rule notice on the right of the window */}
      <RFace r={R} pts={[[0.89, 0.24, 0], [0.98, 0.24, 0], [0.98, 0.42, 0], [0.89, 0.42, 0]]} fill="#ddd6c2" />
      <RFace r={R} pts={[[0.89, 0.24, 0], [0.98, 0.24, 0], [0.98, 0.28, 0], [0.89, 0.28, 0]]} fill={C.red} />
      {/* left wall: steel drawer cabinet, FM radio on top */}
      <RBox r={R} u={[0, 0.06]} v={[0.52, 1]} w={[0.12, 0.42]} front="#6b7077" side="#575c63" top="#7d828a" />
      {[0.64, 0.76, 0.88].map(v => <RFace key={v} r={R} pts={[[0.06, v, 0.13], [0.06, v, 0.41], [0.06, v + 0.008, 0.41], [0.06, v + 0.008, 0.13]]} fill="#3a3e44" />)}
      {[0.6, 0.72, 0.84, 0.95].map(v => { const q = R.P(0.06, v, 0.27); return <Svg key={v}><rect x={q.x - 4} y={q.y - 10} width={8} height={20} fill="#c9ccd0" /></Svg>; })}
      <RBox r={R} u={[0.005, 0.05]} v={[0.46, 0.52]} w={[0.2, 0.32]} front="#3b2a1f" top="#4b3727" side="#2d2017" />
      {radioOn && (() => { const q = R.P(0.05, 0.49, 0.26); return <><Svg><rect x={q.x - 2} y={q.y - 9} width={14} height={9} fill="#ff4030" /></Svg><Pool x={q.x + 5} y={q.y - 4} rx={30} color="255,90,60" a={0.5} /></>; })()}
      {/* right wall: door to the platform */}
      <RFace r={R} pts={[[1, 0.18, 0.3], [1, 0.18, 0.56], [1, 1, 0.56], [1, 1, 0.3]]} fill={morning ? '#e8dcbc' : dawn ? '#6f7e93' : '#26332f'} stroke="#2a2017" sw={9} />
      {time === 'night' && (() => { const q = R.P(1, 0.5, 0.43); return <Pool x={q.x} y={q.y} rx={150} ry={300} color={C.neon} a={0.28} />; })()}
      {/* ceiling: a fluorescent tube, off */}
      <RBox r={R} u={[0.4, 0.62]} v={[0, 0.015]} w={[0.4, 0.43]} front="#9a9e98" side="#6a6e68" />
      {/* the desk and what is on it */}
      <RBox r={R} u={[0.3, 0.8]} v={[0.72, 1]} w={[0.44, 0.66]} front="#5b4430" top="#7a5d40" side="#3f2f20" />
      <RFace r={R} pts={[[0.33, 0.74, 0.66], [0.55, 0.74, 0.66], [0.55, 0.84, 0.66], [0.33, 0.84, 0.66]]} fill="#4a3727" stroke="#2c2117" />
      {d.box !== false && <RBox r={R} u={[0.47, 0.57]} v={[0.66, 0.72]} w={[0.5, 0.58]} front="#5d6268" top="#7a7f86" side="#474b50" />}
      <RBox r={R} u={[0.62, 0.68]} v={[0.69, 0.72]} w={[0.48, 0.54]} front="#d8cfb4" top="#e6dec6" side="#b8ae92" />
      <RBox r={R} u={[0.72, 0.75]} v={[0.64, 0.72]} w={[0.5, 0.54]} front="#1d1f22" top="#2c2f33" side="#141518" />
      {(() => { const q = R.P(0.735, 0.655, 0.54); const on = d.radioLed !== 'off'; return <><Svg><circle cx={q.x} cy={q.y} r={5} fill={on ? '#47ff6a' : '#16251a'} /></Svg>{on && <Pool x={q.x} y={q.y} rx={34} color="80,255,110" a={0.6} />}</>; })()}
      <RBox r={R} u={[0.41, 0.45]} v={[0.66, 0.72]} w={[0.5, 0.51]} front="#3a2a1d" top="#4a3727" />
      {d.mug && <RBox r={R} u={[0.58, 0.6]} v={[0.69, 0.72]} w={[0.56, 0.58]} front="#d7c79b" top="#6b4a2a" />}
      {/* the lamp: green shade, brass stem */}
      {(() => {
        const base = R.P(0.36, 0.72, 0.52), top = R.P(0.36, 0.6, 0.52);
        return <Svg>
          <rect x={base.x - 34} y={base.y - 10} width={68} height={12} rx={4} fill={C.brassD} />
          <line x1={base.x} y1={base.y - 8} x2={top.x + 6} y2={top.y + 20} stroke={C.brass} strokeWidth={8} />
          <path d={`M${top.x - 62} ${top.y + 26} L${top.x - 30} ${top.y - 18} H${top.x + 42} L${top.x + 70} ${top.y + 26} Z`} fill="#2d5a3a" stroke="#173322" strokeWidth={4} />
          <ellipse cx={top.x + 4} cy={top.y + 26} rx={64} ry={9} fill="#fff1c8" />
        </Svg>;
      })()}
      {/* a few things on the floor: a cardboard box of stamps, a waste bin */}
      <RBox r={R} u={[0.82, 0.94]} v={[0.86, 1]} w={[0.34, 0.5]} front="#9a7a52" top="#b08e62" side="#7c6040" />
      <RBox r={R} u={[0.2, 0.26]} v={[0.88, 1]} w={[0.56, 0.62]} front="#3d4148" top="#2a2d32" side="#30343a" />
      {morning && <RFace r={R} pts={[[0.56, 1, 0.05], [0.86, 1, 0.05], [0.9, 1, 0.7], [0.5, 1, 0.7]]} fill="#ffe7b0" o={0.28} blend="screen" />}
      <LightVeil id="off" lights={[[LAMP.x, LAMP.y + 120, 470], ...(morning ? [[1180, 420, 520] as [number, number, number]] : []), ...(d.torch ? [d.torch as [number, number, number]] : [])]} o={morning ? 0.3 : 0.56} color="#05060a" />
      <Pool x={LAMP.x} y={LAMP.y + 70} rx={460} ry={300} color={C.lamp} a={0.62 * flicker(p.f, 7, 0.03)} /><Pool x={LAMP.x + 4} y={LAMP.y + 30} rx={90} ry={40} color="255,240,200" a={0.9} />
      {morning && <Pool x={1160} y={380} rx={520} color="255,236,190" a={0.32} />}
    </>
  );
};

/** the wall behind someone at the desk, for close-ups that need the window and lamp in the frame */
const Office: ShotComponent = p => {
  const d = D(p);
  return <Shot p={p} world={<>
    <Soft p={p}><OfficeWorld p={p} /></Soft>
    {d.wallShadow && <Svg><ellipse cx={d.wallShadow[0]} cy={d.wallShadow[1]} rx={d.wallShadow[2] ?? 260} ry={(d.wallShadow[2] ?? 260) * 1.5} fill="#020203" opacity={0.6} style={{filter: 'blur(14px)'}} /></Svg>}
    <Actors p={p} />
  </>} fore={d.fore === 'window' ? <WindowFore /> : undefined} foreBlur={4} foreDark={0.6} />;
};

/** looking in from the dark platform through the office window, rain on the glass */
const WindowFore: React.FC = () => (
  <Svg>
    <path d="M-40 -40 H1960 V1120 H-40 Z M420 170 H1500 V860 H420 Z" fill="#0a0c0e" fillRule="evenodd" />
    <rect x={942} y={170} width={36} height={690} fill="#0a0c0e" />
    {Array.from({length: 34}, (_, i) => <line key={i} x1={440 + rnd(141, i) * 1040} y1={190 + rnd(142, i) * 640} x2={436 + rnd(141, i) * 1040} y2={222 + rnd(142, i) * 640} stroke="#a8bccb" strokeWidth={4} opacity={0.6} />)}
  </Svg>
);

export const OFFICE_SCENES: Record<string, ShotComponent> = {office: Office};
