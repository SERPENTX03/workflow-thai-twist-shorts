import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {D, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {Actors, Shot} from './cast';
import {Street} from './ext';

// บ้านป้านิ่ม (brief.md → Sets): one low room under an orange bulb. The back wall is the green party wall with house 5:
// the cat sits at it, the knocks come through it. Bench to the left, small altar on the left wall. Spirit house views use
// the street (data.tone). The bulb stops short of the green wall, so the wall is always the darkest thing in the room.

export const NIM = makeRoom({x: 1020, y: 430}, {x0: 500, x1: 1500, y0: 230, y1: 720}, 3.1);

/** a cat seen from behind, sitting up straight (the library cat faces the camera) */
export const CatBack: React.FC<{x: number; y: number; s?: number; tail?: number; color?: string}> = ({x, y, s = 1, tail = 0, color = '#0b0b0e'}) => (
  <svg width={300} height={340} viewBox="-150 -300 300 340" style={{position: 'absolute', left: x - 150 * s, top: y - 300 * s, width: 300 * s, height: 340 * s, overflow: 'visible'}}>
    <path d="M-62 0 Q-82 -90 -44 -150 Q-52 -190 -30 -204 L-40 -252 L-6 -222 Q4 -224 12 -222 L44 -252 L34 -204 Q56 -190 46 -150 Q84 -90 62 0 Z" fill={color} />
    <path d={`M50 -4 Q${130 + tail} -8 ${118 + tail} -70`} stroke={color} strokeWidth={20} fill="none" strokeLinecap="round" />
    <path d="M-60 -6 H60" stroke="#000" strokeWidth={6} />
    <path d="M-50 -130 Q-68 -60 -52 -8" stroke="rgba(255,160,90,.55)" strokeWidth={5} fill="none" />
    <path d="M-30 -204 L-40 -252 L-20 -236" stroke="rgba(255,160,90,.55)" strokeWidth={4} fill="none" />
  </svg>
);

const NimWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = NIM, d = D(p);
  const b = r.P(0.34, 0.14, 0.5);
  const a = 0.95 * flicker(p.f, 11, 0.03);
  const morning = d.time === 'morning' || d.time === 'sun';
  return (
    <>
      <RoomShell r={r} id="nim" wall="#3f5a4c" side="#6b5a45" sideFar="#5a4b39" floorC="#54412f" ceiling="#2b2119" boards={11} walls="plain" />
      {/* damp on the green wall */}
      <Svg>
        {Array.from({length: 16}, (_, i) => { const q = r.P(0.04 + i * 0.06, 0.05 + rnd(81, i) * 0.1, 0); return <rect key={i} x={q.x} y={q.y} width={20 + rnd(82, i) * 30} height={80 + rnd(83, i) * 160} fill="#2d4438" opacity={0.6} />; })}
        {Array.from({length: 7}, (_, i) => { const q = r.P(0.2 + i * 0.1, 0.36 + rnd(84, i) * 0.4, 0); return <path key={i} d={`M${q.x} ${q.y} q30 40 6 90`} stroke="#27362f" strokeWidth={4} fill="none" />; })}
      </Svg>
      {/* a door on the right wall, altar shelf on the left wall, calendar, shelves */}
      <RFace r={r} pts={[[1, 0.18, 0.3], [1, 0.18, 0.6], [1, 1, 0.6], [1, 1, 0.3]]} fill="#2e2118" stroke="#17100b" sw={6} />
      <RBox r={r} u={[0, 0.1]} v={[0.46, 0.5]} w={[0.14, 0.38]} front="#3d2b1b" top="#6a4c33" />
      <Svg>{(() => { const q = r.P(0.04, 0.46, 0.25); return <><path d={`M${q.x - 24} ${q.y} q0 -60 24 -64 q24 4 24 64 Z`} fill="#c9a24a" /><rect x={q.x + 34} y={q.y - 18} width={20} height={18} fill="#807459" /><circle cx={q.x + 44} cy={q.y - 28} r={4} fill="#ff7a33" /></>; })()}</Svg>
      <RFace r={r} pts={[[0.78, 0.12, 0], [0.92, 0.12, 0], [0.92, 0.32, 0], [0.78, 0.32, 0]]} fill="#d9d2bf" o={0.75} />
      <RBox r={r} u={[0.02, 0.3]} v={[0.82, 1]} w={[0.42, 0.74]} front="#6b5a3a" top="#a48d5c" side="#493d27" />
      <Svg>{Array.from({length: 9}, (_, i) => { const a1 = r.P(0.03 + i * 0.03, 0.82, 0.42), b1 = r.P(0.03 + i * 0.03, 0.82, 0.74); return <line key={i} x1={a1.x} y1={a1.y} x2={b1.x} y2={b1.y} stroke="#5f4e2f" strokeWidth={4} />; })}</Svg>
      <RBox r={r} u={[0.62, 0.72]} v={[0.86, 1]} w={[0.3, 0.42]} front="#5a2e22" top="#3b2015" />
      {/* the bulb */}
      <Svg><line x1={b.x} y1={-300} x2={b.x} y2={b.y - 22} stroke="#120d09" strokeWidth={5} /><circle cx={b.x} cy={b.y} r={20} fill="#ffc06a" /></Svg>
      {morning ? <><LightVeil id="nim" lights={[[1400, 620, 820]]} o={0.2} color="#0a0705" /></> : <>
        <LightVeil id="nim" lights={[[b.x, b.y + 300, 560]]} o={0.5} color="#0a0503" />
        <Pool x={b.x} y={b.y} rx={560} color="255,170,90" a={0.5 * a} />
      </>}
    </>
  );
};

/** the wall from up close: fist, palm or a hand, drawn for the knock */
const Shrine: React.FC<{p: ShotProps; empty?: boolean; rubber?: boolean; am?: boolean}> = ({p, empty, rubber, am}) => (
  <Macro p={p} bg="#060508" at={[48, 46]} vig={am ? 0.5 : 0.8} inner={32} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: am ? 'linear-gradient(#b9c6c9, #827e6f)' : 'linear-gradient(#141522, #24232b)'}} />
    <Svg>
      <rect x={-20} y={720} width={1960} height={400} fill={am ? '#4d493e' : '#1c1a1e'} />
      <rect x={880} y={700} width={160} height={400} fill={am ? '#bdb29a' : '#5a5448'} />
      <rect x={300} y={140} width={1320} height={40} fill="#8a6f33" />
      <path d="M240 150 L960 -40 L1680 150 Z" fill={am ? '#a43f2f' : '#5c261d'} stroke="#59421a" strokeWidth={6} />
      <rect x={340} y={180} width={1240} height={520} fill={am ? '#d7b65c' : '#5e4d2a'} stroke="#59421a" strokeWidth={6} />
      <rect x={620} y={230} width={680} height={420} fill={am ? '#6e5b2c' : '#1d170e'} stroke="#59421a" strokeWidth={5} />
      {[430, 1490].map(x => <rect key={x} x={x - 28} y={180} width={56} height={520} fill={am ? '#c9a24a' : '#7a6535'} />)}
      <rect x={260} y={680} width={1400} height={44} fill={am ? '#8a6f33' : '#4a3c20'} />
      {/* incense and a tiny figure at the back */}
      <rect x={1270} y={610} width={110} height={70} rx={8} fill="#807459" />
      {[1290, 1320, 1350].map((x, i) => <line key={x} x1={x} y1={610} x2={x + i * 3} y2={empty ? 560 : 470} stroke="#8c3b2a" strokeWidth={5} />)}
      {!empty && [1292, 1326, 1358].map(x => <circle key={x} cx={x} cy={470} r={6} fill="#ff7a33" />)}
      <path d="M960 480 q-34 -40 0 -130 q34 90 0 130 Z" fill={am ? '#a88d40' : '#3f3417'} />
      {!empty && <g>
        <path d="M740 670 Q720 520 800 500 Q840 480 880 500 Q960 520 940 670 Z" fill="#e4e0d2" opacity={0.92} stroke="#a7a395" strokeWidth={4} />
        <rect x={812} y={470} width={56} height={22} rx={8} fill="#c9201f" />
        <path d="M780 560 q40 -30 90 0" stroke="#fff" strokeWidth={6} opacity={0.5} fill="none" />
      </g>}
      {rubber && <path d="M1110 768 q50 -24 90 6 q-30 34 -70 18 q-30 -8 -20 -24" stroke="#c9201f" strokeWidth={13} fill="none" />}
      {empty && Array.from({length: 18}, (_, i) => <circle key={i} cx={720 + rnd(91, i) * 340} cy={648 + rnd(92, i) * 26} r={3} fill="#3a2f1a" opacity={0.45} />)}
    </Svg>
    {!empty && <Pool x={1320} y={470} rx={330} color="255,140,70" a={0.6} />}
    {!empty && <Pool x={820} y={590} rx={280} color="255,170,110" a={0.3} />}
    {d0(p).torch && <Pool x={720} y={560} rx={560} color="255,236,190" a={0.42} />}
    {!am && d0(p).torch && <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 560px 460px at 40% 54%, rgba(0,0,0,0) 40%, rgba(0,0,0,.85) 100%)'}} />}
  </Macro>
);
const d0 = D;

/** Composition from the Flow reference: bulb far left in the dark, the damp green wall filling the right, Rin between them, her
 *  own hand flat on the wall. All sprite: costume, hair and hand stay hers. */
const WallListen: React.FC<{p: ShotProps}> = ({p}) => {
  const a = 0.95 * flicker(p.f, 11, 0.03);
  return <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -200, top: -200, width: 2400, height: 1500, background: '#0d0806'}} />
    <Svg>
      {/* the dark room behind her: a door, the altar shelf */}
      <rect x={60} y={280} width={330} height={840} fill="#17100b" stroke="#080503" strokeWidth={6} />
      <rect x={-40} y={560} width={150} height={12} fill="#3a2a1c" />
      <line x1={320} y1={-40} x2={320} y2={130} stroke="#050302" strokeWidth={6} />
      <rect x={309} y={122} width={22} height={22} fill="#2a2522" />
      <circle cx={320} cy={170} r={32} fill="#ffb45e" />
    </Svg>
    <Pool x={320} y={170} rx={520} color="255,140,60" a={0.86 * a} />
    <Pool x={320} y={170} rx={120} color="255,226,170" a={0.75 * a} />
    <Svg>
      {/* the wall, running away slightly, with damp and cracked plaster */}
      <path d="M1040 -40 H1960 V1140 H1110 Z" fill="#34493c" />
      <path d="M1040 -40 L1110 1140" stroke="#0c120e" strokeWidth={10} />
      {Array.from({length: 34}, (_, i) => { const x = 1140 + rnd(85, i) * 820, y = -20 + rnd(86, i) * 1000, w = 50 + rnd(87, i) * 130, h = 40 + rnd(88, i) * 120; return <ellipse key={i} cx={x} cy={y} rx={w} ry={h} fill={i % 3 ? '#26392e' : '#44604c'} opacity={0.5} transform={`rotate(${rnd(89, i + 40) * 50 - 25} ${x} ${y})`} />; })}
      {Array.from({length: 12}, (_, i) => { const x = 1190 + rnd(89, i) * 680, y = 80 + rnd(90, i) * 680; return <path key={i} d={`M${x} ${y} q26 44 4 104 q-12 34 14 64`} stroke="#14221b" strokeWidth={4} fill="none" />; })}
    </Svg>
    <div style={{position: 'absolute', left: 1040, top: -40, width: 900, height: 1180, background: 'linear-gradient(90deg, rgba(255,130,60,.14), rgba(0,0,0,.42) 62%)'}} />
    <Actors p={p} />
    {/* the bulb warms the side of her turned toward it */}
    <Pool x={560} y={430} rx={420} ry={560} color="255,150,70" a={0.2} />
  </>} />;
};

const Nim: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'wall-palm-close') return <WallListen p={p} />;
  if (v === 'shrine-empty-ins') return <Shrine p={p} empty />;
  if (v === 'shrine-empty2-ins') return <Shrine p={p} empty rubber am />;
  if (d.street) return <Shot p={p} world={<>
    <Soft p={p}><Street p={p} tone={d.tone} five={d.five ?? 'off'} /></Soft>
    {d.cat && <CatBack x={d.cat[0]} y={d.cat[1]} s={d.cat[2] ?? 0.5} />}
    <Actors p={p} />
    {d.ricebag && <Svg><path d={`M${d.ricebag[0] - 34} ${d.ricebag[1]} q0 -56 34 -56 q34 0 34 56 Z`} fill="#e4e0d2" opacity={0.95} /><rect x={d.ricebag[0] - 12} y={d.ricebag[1] - 64} width={24} height={10} fill="#c9201f" /></Svg>}
  </>} />;
  return <Shot p={p} world={<>
    <Soft p={p}><NimWorld p={p} /></Soft>
    {d.cat && <CatBack x={d.cat[0]} y={d.cat[1]} s={d.cat[2] ?? 0.5} />}
    <Actors p={p} />
    {d.bulbFace && <Pool x={d.bulbFace[0]} y={d.bulbFace[1]} rx={260} color="255,170,90" a={0.3} />}
  </>} fore={d.foreWin ? <Svg><path d="M-20 -20 H1940 V110 H-20 Z M-20 -20 H360 V1100 H-20 Z M1600 -20 H1940 V1100 H1600 Z M-20 860 H1940 V1100 H-20 Z" fill="#0c0806" /><path d="M960 110 V860" stroke="#0c0806" strokeWidth={22} /></Svg> : undefined} foreBlur={3} foreDark={0.65} foreK={0.15} />;
};

export const NIMS: Record<string, ShotComponent> = {nim: Nim};
