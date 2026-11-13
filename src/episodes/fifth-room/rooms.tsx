import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {Hand as HandKit} from '../../kit/inserts';
import {D, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {LightVeil, RBox, RFace, RoomShell, makeRoom, type Room} from '../../kit/room';
import {Actors, C, Shot} from './cast';

// Inside บ้านเลขที่ 5 (brief.md → Sets): three rooms in perspective, each with its own vanishing point and one light.
//   living   window on the left wall, the "false window" wall on the right, the cropped photo on the back wall
//   kitchen  small window over the sink, breaker box on the left wall, back door on the right wall with the canal in it
//   bedroom  the small room: the built-in wardrobe fills the right wall; its back panel is the door
// data.time: sun | dusk | morning | night; at night data.torch = [x, y, r] is Rin's torch, data.lamp = [x, y] the battery lamp.

export const LIVING = makeRoom({x: 760, y: 430}, {x0: 420, x1: 1400, y0: 210, y1: 720}, 3.3);
export const KITCHEN = makeRoom({x: 1120, y: 420}, {x0: 560, x1: 1500, y0: 220, y1: 710}, 3.2);
export const BEDROOM = makeRoom({x: 620, y: 440}, {x0: 400, x1: 1200, y0: 220, y1: 740}, 2.9);

const pool3 = (r: Room, pts: [number, number, number][], fill: string, o: number) => <RFace r={r} pts={pts} fill={fill} o={o} blend="screen" />;

const lightsOf = (d: Record<string, any>, def: [number, number, number][]) => {
  const out: [number, number, number][] = [...def];
  if (d.torch) out.push(d.torch);
  if (d.lamp) out.push([d.lamp[0], d.lamp[1], 420]);
  return out;
};

const Glows: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p);
  return (
    <>
      {d.torch && <Pool x={d.torch[0]} y={d.torch[1]} rx={d.torch[2] * 0.9} color="255,236,190" a={0.62} />}
      {d.lamp && <Pool x={d.lamp[0]} y={d.lamp[1]} rx={300} color="255,226,170" a={0.42 * flicker(p.f, 3, 0.05)} />}
    </>
  );
};

// ---------------------------------------------------------------- living room

const LivingWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = LIVING, d = D(p), time = d.time ?? 'sun';
  const lit = time === 'sun' || time === 'morning';
  return (
    <>
      <RoomShell r={r} id="liv" wall="#8f8671" side="#6e6655" sideFar="#7d7562" floorC="#6f6a5e" ceiling="#3d3a33" floor="tiles" walls="plain" boards={10} />
      {/* left wall: window with bars and curtains. Right wall: the plain wall where the fifth window should open */}
      <RFace r={r} pts={[[0, 0.26, 0.35], [0, 0.26, 0.72], [0, 0.68, 0.72], [0, 0.68, 0.35]]} fill={lit ? '#fff6dc' : time === 'dusk' ? '#c2795c' : '#0a0d16'} stroke="#2c1f14" sw={7} />
      {[0.42, 0.5, 0.58, 0.65].map(w => <RFace key={w} r={r} pts={[[0, 0.26, w], [0, 0.26, w + 0.008], [0, 0.68, w + 0.008], [0, 0.68, w]]} fill="#26282c" />)}
      {/* cabinet, TV shelf, covered sofas */}
      <RBox r={r} u={[0.02, 0.28]} v={[0.4, 1]} w={[0, 0.1]} front="#4a3322" top="#5b4230" side="#33241a" />
      {[0.46, 0.6].map(y => <RFace key={y} r={r} pts={[[0.03, y, 0.1], [0.27, y, 0.1], [0.27, y + 0.1, 0.1], [0.03, y + 0.1, 0.1]]} fill="#1d1712" stroke="#2c1f14" />)}
      <RBox r={r} u={[0.4, 0.8]} v={[0.78, 1]} w={[0.04, 0.2]} front="#a9a59a" top="#bdb9ad" side="#8e8a80" />
      <RBox r={r} u={[0.84, 0.99]} v={[0.76, 1]} w={[0.2, 0.46]} front="#a9a59a" top="#bdb9ad" side="#8e8a80" />
      <RBox r={r} u={[0.34, 0.62]} v={[0.88, 1]} w={[0.34, 0.5]} front="#5a4433" top="#6d5340" side="#3c2c20" />
      {/* the one photo left on the back wall, a pale square where others hung, a calendar */}
      <RFace r={r} pts={[[0.6, 0.26, 0], [0.74, 0.26, 0], [0.74, 0.5, 0], [0.6, 0.5, 0]]} fill="#2b2118" stroke="#120c08" sw={5} />
      <RFace r={r} pts={[[0.615, 0.285, 0], [0.71, 0.285, 0], [0.71, 0.48, 0], [0.615, 0.48, 0]]} fill="#b4a98c" />
      <RFace r={r} pts={[[0.8, 0.28, 0], [0.92, 0.28, 0], [0.92, 0.46, 0], [0.8, 0.46, 0]]} fill="#7f7663" o={0.65} />
      <RFace r={r} pts={[[0.36, 0.28, 0], [0.48, 0.28, 0], [0.48, 0.46, 0], [0.36, 0.46, 0]]} fill="#7f7663" o={0.65} />
      <RFace r={r} pts={[[0.03, 0.2, 0], [0.15, 0.2, 0], [0.15, 0.35, 0], [0.03, 0.35, 0]]} fill="#d9d2bf" />
      {/* a fan on the ceiling */}
      <Svg>{(() => { const a = r.P(0.5, 0, 0.45), b = r.P(0.5, 0.1, 0.45); return <><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#1a1712" strokeWidth={8} /><ellipse cx={b.x} cy={b.y} rx={180} ry={15} fill="#23201a" /><circle cx={b.x} cy={b.y} r={18} fill="#14120e" /></>; })()}</Svg>
      {/* floor dust */}
      <Svg>{Array.from({length: 40}, (_, i) => { const q = r.P(rnd(61, i), 1, rnd(62, i)); return <circle key={i} cx={q.x} cy={q.y} r={2 + rnd(63, i) * 5} fill="#514c41" opacity={0.5} />; })}</Svg>
      {lit && pool3(r, [[0, 1, 0.35], [0, 1, 0.72], [0.62, 1, 0.92], [0.5, 1, 0.42]], '#fff0c8', time === 'morning' ? 0.42 : 0.34)}
      {time === 'dusk' && pool3(r, [[0, 1, 0.35], [0, 1, 0.72], [0.4, 1, 0.92], [0.3, 1, 0.42]], '#ff9a5a', 0.3)}
      <LightVeil id="liv" lights={lightsOf(d, lit ? [[300, 640, 760]] : time === 'dusk' ? [[280, 620, 520]] : [])} o={time === 'night' ? 0.66 : time === 'dusk' ? 0.42 : 0.22} color="#060509" />
      {lit && <Pool x={210} y={440} rx={520} color="255,240,200" a={0.34} />}
      <Glows p={p} />
    </>
  );
};

const Living: ShotComponent = p => (
  <Shot p={p} world={<>
    <Soft p={p}><LivingWorld p={p} /></Soft>
    {D(p).tape && <Svg><line x1={D(p).tape[0]} y1={D(p).tape[1]} x2={D(p).tape[2]} y2={D(p).tape[3]} stroke={C.tape} strokeWidth={7} /></Svg>}
    <Actors p={p} />
    {D(p).sil && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><Actors p={p} cast={D(p).sil} /></div>}
  </>} fore={D(p).fore === 'door' ? <Svg><rect x={-20} y={-20} width={250} height={1120} fill="#0a0806" /></Svg> : undefined} foreBlur={8} foreDark={0.5} />
);

// ---------------------------------------------------------------- kitchen

const KitchenWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = KITCHEN, d = D(p), time = d.time ?? 'dusk';
  const lit = time === 'sun' || time === 'morning' || time === 'dusk';
  const win = time === 'morning' ? '#e3edf0' : time === 'sun' ? '#fff3cf' : time === 'dusk' ? '#ffb068' : '#090c14';
  return (
    <>
      <RoomShell r={r} id="kit" wall="#7e8576" side="#5f6459" sideFar="#6c7165" floorC="#58544b" ceiling="#2f2d28" floor="tiles" walls="plain" boards={9} />
      {/* tile splash and the sink under the small window */}
      <RFace r={r} pts={[[0.05, 0.5, 0], [0.62, 0.5, 0], [0.62, 0.74, 0], [0.05, 0.74, 0]]} fill="#b4bcae" />
      <Svg>{Array.from({length: 8}, (_, i) => { const a = r.P(0.05 + i * 0.08, 0.5, 0), b = r.P(0.05 + i * 0.08, 0.74, 0); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#7e8576" strokeWidth={2} />; })}</Svg>
      <RFace r={r} pts={[[0.2, 0.2, 0], [0.5, 0.2, 0], [0.5, 0.48, 0], [0.2, 0.48, 0]]} fill={win} stroke="#2c1f14" sw={7} />
      {[0.3, 0.4].map(u => <RFace key={u} r={r} pts={[[u, 0.2, 0], [u + 0.006, 0.2, 0], [u + 0.006, 0.48, 0], [u, 0.48, 0]]} fill="#26282c" />)}
      <RBox r={r} u={[0.04, 0.64]} v={[0.72, 1]} w={[0, 0.16]} front="#50483a" top="#8d8f82" side="#3a3429" />
      <RBox r={r} u={[0.22, 0.42]} v={[0.71, 0.73]} w={[0.03, 0.13]} front="#6a6d65" top="#3c3e39" />
      <Svg>{(() => { const a = r.P(0.32, 0.72, 0.02), b = r.P(0.32, 0.62, 0.05), c = r.P(0.32, 0.65, 0.09); return <path d={`M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y}`} stroke="#8e918b" strokeWidth={9} fill="none" />; })()}</Svg>
      {/* food safe, shelf with pots, calendar */}
      <RBox r={r} u={[0.68, 0.94]} v={[0.36, 1]} w={[0, 0.12]} front="#46382a" top="#5a4a39" side="#31271c" />
      <RFace r={r} pts={[[0.7, 0.42, 0.12], [0.92, 0.42, 0.12], [0.92, 0.62, 0.12], [0.7, 0.62, 0.12]]} fill="#6b7267" stroke="#31271c" />
      <RFace r={r} pts={[[0.7, 0.68, 0.12], [0.92, 0.68, 0.12], [0.92, 0.88, 0.12], [0.7, 0.88, 0.12]]} fill="#6b7267" stroke="#31271c" />
      <RFace r={r} pts={[[0.04, 0.12, 0], [0.16, 0.12, 0], [0.16, 0.34, 0], [0.04, 0.34, 0]]} fill="#ddd7c4" />
      <RFace r={r} pts={[[0.04, 0.12, 0], [0.16, 0.12, 0], [0.16, 0.17, 0], [0.04, 0.17, 0]]} fill="#a33028" />
      {/* breaker box on the left wall */}
      <RFace r={r} pts={[[0, 0.3, 0.45], [0, 0.3, 0.58], [0, 0.48, 0.58], [0, 0.48, 0.45]]} fill="#88867b" stroke="#2a2925" sw={5} />
      {/* back door on the right wall, open: canal light */}
      <RFace r={r} pts={[[1, 0.12, 0.25], [1, 0.12, 0.52], [1, 1, 0.52], [1, 1, 0.25]]} fill={time === 'night' ? '#0f1826' : time === 'dusk' ? '#c47c55' : '#d9e4dc'} stroke="#2c1f14" sw={8} />
      {/* table and two plastic chairs */}
      <RBox r={r} u={[0.3, 0.62]} v={[0.74, 0.77]} w={[0.42, 0.66]} front="#4f3a28" top="#6e533b" />
      {[[0.31, 0.44], [0.61, 0.44], [0.31, 0.64], [0.61, 0.64]].map(([u, w], i) => <RBox key={i} r={r} u={[u, u + 0.012]} v={[0.77, 1]} w={[w, w + 0.012]} front="#35261a" />)}
      {lit && pool3(r, [[0.2, 1, 0.1], [0.5, 1, 0.1], [0.72, 1, 0.8], [0.3, 1, 0.8]], time === 'dusk' ? '#ff9a5a' : '#fff0c8', 0.28)}
      <LightVeil id="kit" lights={lightsOf(d, lit ? [[880, 470, 620], [1820, 620, 360]] : [])} o={time === 'night' ? 0.8 : time === 'dusk' ? 0.42 : 0.24} color="#060509" />
      {lit && <Pool x={860} y={350} rx={420} color={time === 'dusk' ? '255,170,100' : '255,240,200'} a={0.4} />}
      {d.lampOn && (() => { const q = r.P(0.46, 0.74, 0.54); return <><Svg><rect x={q.x - 24} y={q.y - 64} width={48} height={64} rx={8} fill="#d8d3c2" stroke="#3a3730" strokeWidth={4} /></Svg><Pool x={q.x} y={q.y - 40} rx={520} color="255,226,170" a={0.56 * flicker(p.f, 3, 0.05)} /></>; })()}
      <Glows p={p} />
    </>
  );
};

const Kitchen: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'tap-ins' || v === 'tap-dutch') return <Tap p={p} dutch={v === 'tap-dutch'} />;
  if (v === 'breaker-ins' || v === 'breaker-torch-close') return <Breaker p={p} night={v !== 'breaker-ins'} />;
  return <Shot p={p} world={<>
    <Soft p={p}><KitchenWorld p={p} /></Soft>
    {D(p).fridge && <Svg>
      <rect x={1400} y={300} width={300} height={590} rx={14} fill="#c9cdc6" stroke="#44463f" strokeWidth={6} />
      <rect x={1420} y={320} width={260} height={550} fill="#8d918a" />
      {[470, 620, 760].map(y => <line key={y} x1={1420} y1={y} x2={1680} y2={y} stroke="#e4e7e0" strokeWidth={6} />)}
      {[1470, 1570].map(x => <g key={x}><rect x={x} y={500} width={48} height={118} rx={10} fill="#bcd2dd" opacity={0.9} /><rect x={x + 12} y={486} width={24} height={16} fill="#2c6a8d" /></g>)}
      <path d="M1700 310 L1860 268 V930 L1700 888 Z" fill="#dcdfd8" stroke="#44463f" strokeWidth={6} />
      <path d="M1450 890 Q1480 960 1420 985 L1400 978" stroke="#111" strokeWidth={7} fill="none" />
      <rect x={1384} y={970} width={28} height={18} fill="#e4e0d2" stroke="#222" strokeWidth={2} />
    </Svg>}
    <Actors p={p} />
    {D(p).sil && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><Actors p={p} cast={D(p).sil} /></div>}
    {D(p).tea && (() => { const q = KITCHEN.P(D(p).tea[0], 0.74, D(p).tea[1]); return <Svg><rect x={q.x - 15} y={q.y - 36} width={30} height={36} rx={3} fill="#e0cf9f" opacity={0.85} stroke="#5a4a30" strokeWidth={2} /></Svg>; })()}
  </>} />;
};

/** the dry tap: same frame in the sun and later in the lamp */
const Tap: React.FC<{p: ShotProps; dutch?: boolean}> = ({p, dutch}) => (
  <Macro p={p} bg="#0a0a0a" at={[46, 34]} vig={dutch ? 0.86 : 0.62} inner={dutch ? 26 : 34} z={1.05} oy={380} tilt={dutch ? -6 : 0}>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1200} fill={dutch ? '#2a2c28' : '#7c8275'} />
      {Array.from({length: 13}, (_, i) => <line key={i} x1={-20 + i * 170} y1={-40} x2={-20 + i * 170} y2={700} stroke={dutch ? '#1a1b18' : '#5f6459'} strokeWidth={4} />)}
      {Array.from({length: 5}, (_, i) => <line key={i} x1={-40} y1={i * 170} x2={1960} y2={i * 170} stroke={dutch ? '#1a1b18' : '#5f6459'} strokeWidth={4} />)}
      <path d="M-40 680 H1960 V1120 H-40 Z" fill={dutch ? '#17181a' : '#3f3f3a'} />
      <path d="M280 700 Q960 650 1640 700 L1540 1100 H380 Z" fill={dutch ? '#0d0e10' : '#6a6d65'} stroke="#26261f" strokeWidth={8} />
      <circle cx={960} cy={960} r={44} fill="#17181a" />
      <path d="M1000 680 V300 Q1000 180 800 180 H640 V300" stroke={dutch ? '#55585a' : '#a3a69f'} strokeWidth={70} fill="none" />
      <path d="M1000 680 V300 Q1000 180 800 180 H640 V300" stroke={dutch ? '#2e3032' : '#7b7e78'} strokeWidth={18} fill="none" transform="translate(16 0)" />
      <rect x={600} y={300} width={80} height={34} fill="#3a3b38" />
      <rect x={950} y={300} width={100} height={40} rx={12} fill="#6d706a" />
      <path d="M1000 300 h120 q30 0 30 -30" stroke="#6d706a" strokeWidth={34} fill="none" strokeLinecap="round" />
      {dutch && <><path d="M1040 150 L1900 150" stroke="#55585a" strokeWidth={46} /><path d="M1900 150 L1960 150" stroke="#55585a" strokeWidth={46} /></>}
      {!dutch && <><path d="M1880 440 Q1560 380 1340 330 L1200 330" stroke={C.skinR} strokeWidth={84} fill="none" strokeLinecap="round" /><path d="M1240 300 q-60 -6 -100 -30" stroke={C.skinR} strokeWidth={30} fill="none" strokeLinecap="round" /></>}
    </Svg>
    {dutch ? <Pool x={900} y={260} rx={560} color="255,226,170" a={0.32} /> : <Pool x={700} y={120} rx={820} color="255,240,200" a={0.28} />}
  </Macro>
);

/** the breaker box: hand throwing it in the morning (the short finger shows), its lever down in the torch at night */
const Breaker: React.FC<{p: ShotProps; night?: boolean}> = ({p, night}) => {
  const k = Math.min(1, p.f / Math.max(1, p.len * 0.5));
  const lever = night ? 1 : k;
  return (
    <Macro p={p} bg="#050404" at={night ? [42, 40] : [46, 42]} vig={night ? 0.92 : 0.55} inner={night ? 18 : 36} z={1.05}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1200} fill={night ? '#26271f' : '#6f7367'} />
        <rect x={560} y={70} width={700} height={760} rx={12} fill="#a6a397" stroke="#35332b" strokeWidth={10} />
        <path d="M600 110 H1220 V200 H600 Z" fill="#7f7c70" />
        <text x={910} y={172} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={46} fill="#2c2a24">ตู้เมน</text>
        <rect x={720} y={260} width={380} height={420} rx={8} fill="#1b1b1a" />
        <rect x={860} y={300} width={100} height={340} fill="#0c0c0b" />
        <rect x={826} y={300 + lever * 220} width={168} height={120} rx={10} fill={lever > 0.6 ? '#a4262a' : '#5b5e5a'} stroke="#000" strokeWidth={5} />
        <text x={910} y={290} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={32} fill="#cfcabb">ON</text>
        <text x={910} y={668} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={32} fill="#cfcabb">OFF</text>
        <path d="M1260 200 C1420 200 1460 60 1500 -40" stroke="#111" strokeWidth={14} fill="none" />
      </Svg>
      {night ? <>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 520px 460px at 44% 38%, rgba(0,0,0,0) 38%, rgba(0,0,0,.9) 100%)'}} />
        <Pool x={820} y={400} rx={520} color="255,236,190" a={0.38} />
      </> : <Pool x={360} y={160} rx={900} color="220,232,240" a={0.26} />}
      {!night && <HandBig x={1090} y={420 + lever * 180} rot={200} pinkyCut />}
    </Macro>
  );
};

/** a right hand big enough for an insert, in Chaloem's shirt colour */
export const HandBig: React.FC<{x: number; y: number; rot?: number; s?: number; pinkyCut?: boolean; skin?: string; sleeve?: string; mode?: 'grip' | 'open'}> = ({x, y, rot = 0, s = 1.8, pinkyCut, skin = C.skinC, sleeve = C.shirtC, mode = 'grip'}) => {
  return <HandKit x={x} y={y} s={s} rot={rot} skin={skin} sleeve={sleeve} pinkyCut={pinkyCut} mode={mode} />;
};

// ---------------------------------------------------------------- small bedroom

const Sticker: React.FC<{x: number; y: number; c: string; o?: number}> = ({x, y, c, o = 1}) => <g opacity={o}><circle cx={x} cy={y} r={15} fill={c} /><circle cx={x - 5} cy={y - 3} r={2.5} fill="#111" /><circle cx={x + 5} cy={y - 3} r={2.5} fill="#111" /><path d={`M${x - 6} ${y + 5} q6 5 12 0`} stroke="#111" strokeWidth={2} fill="none" /></g>;

const BedroomWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = BEDROOM, d = D(p), time = d.time ?? 'night';
  const lit = time === 'sun' || time === 'morning';
  const doors = [0.08, 0.26, 0.44, 0.62, 0.8];
  return (
    <>
      <RoomShell r={r} id="bed" wall="#8b8a77" side="#6c6c5c" sideFar="#747463" floorC="#54422f" ceiling="#35332c" boards={10} walls="plain" />
      {/* little window on the back wall, a stripped bed along the left wall */}
      <RFace r={r} pts={[[0.2, 0.24, 0], [0.46, 0.24, 0], [0.46, 0.58, 0], [0.2, 0.58, 0]]} fill={lit ? '#fff3cf' : '#0a0d16'} stroke="#2c1f14" sw={7} />
      {[0.28, 0.37].map(u => <RFace key={u} r={r} pts={[[u, 0.24, 0], [u + 0.006, 0.24, 0], [u + 0.006, 0.58, 0], [u, 0.58, 0]]} fill="#26282c" />)}
      <RBox r={r} u={[0.01, 0.34]} v={[0.8, 1]} w={[0.18, 0.72]} front="#4a3626" top="#8c8878" side="#33251a" />
      <RFace r={r} pts={[[0.02, 0.795, 0.2], [0.33, 0.795, 0.2], [0.33, 0.795, 0.4], [0.02, 0.795, 0.4]]} fill="#a7a395" />
      {/* the built-in wardrobe: the whole right wall */}
      <RBox r={r} u={[0.68, 1]} v={[0.08, 1]} w={[0, 1]} front="#5c4330" top="#4a3626" side="#6b4f39" />
      {doors.map(w => <RFace key={w} r={r} pts={[[0.68, 0.14, w], [0.68, 0.14, w + 0.16], [0.68, 0.94, w + 0.16], [0.68, 0.94, w]]} fill="#6f5441" stroke="#2c1f14" sw={4} />)}
      {doors.map(w => { const q = r.P(0.68, 0.54, w + 0.14); return <Svg key={w}><circle cx={q.x} cy={q.y} r={6} fill="#c9b98c" /></Svg>; })}
      <Svg>{[[0.3, 0.46], [0.42, 0.62], [0.5, 0.4], [0.32, 0.7]].map(([w, v], i) => { const q = r.P(0.68, v, w); return <Sticker key={i} x={q.x} y={q.y} c={['#e6b73a', '#d9574c', '#4d9bb0', '#7ab05a'][i]} />; })}</Svg>
      {/* the wire: leaves the ceiling edge and drops behind the wardrobe top */}
      {d.wire && <Svg>{(() => { const a = r.P(0.25, 0.02, 0.2), b = r.P(0.68, 0.02, 0.34), c = r.P(0.68, 0.08, 0.34); return <path d={`M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y}`} stroke="#0b0b0a" strokeWidth={6} fill="none" />; })()}</Svg>}
      {lit && pool3(r, [[0.2, 1, 0.1], [0.46, 1, 0.1], [0.62, 1, 0.8], [0.3, 1, 0.8]], '#fff0c8', 0.3)}
      <LightVeil id="bed" lights={lightsOf(d, lit ? [[760, 460, 660]] : [])} o={time === 'night' ? 0.66 : 0.24} color="#060509" />
      {lit && <Pool x={690} y={370} rx={360} color="255,240,200" a={0.42} />}
      <Glows p={p} />
    </>
  );
};

/** looking into the wardrobe, its back panel square-on: hangers, panel, bolt, hatch. Every shot at the panel uses this. */
export const WardrobeInside: React.FC<{p: ShotProps; open?: number}> = ({p, open = 0}) => {
  const d = D(p);
  return (
    <>
      <Svg>
        <rect x={-500} y={-400} width={2920} height={1900} fill="#0d0a08" />
        {/* the box of the wardrobe receding to its back panel */}
        <path d="M-200 -100 L560 120 L560 960 L-200 1180 Z" fill="#3b2b1e" />
        <path d="M2120 -100 L1360 120 L1360 960 L2120 1180 Z" fill="#2f2218" />
        <path d="M-200 -100 L2120 -100 L1360 120 L560 120 Z" fill="#231910" />
        <path d="M-200 1180 L2120 1180 L1360 960 L560 960 Z" fill="#2a1e14" />
        <rect x={560} y={120} width={800} height={840} fill="#4a3525" />
        {Array.from({length: 7}, (_, i) => <line key={i} x1={560 + i * 114} y1={120} x2={560 + i * 114} y2={960} stroke="#33241a" strokeWidth={5} />)}
        {/* hatch and bolt low on the panel */}
        <rect x={840} y={700} width={240} height={190} fill="#3b2a1d" stroke="#1a120c" strokeWidth={7} />
        <rect x={880} y={768} width={160} height={24} rx={6} fill="#7c7f7c" stroke="#222" strokeWidth={3} />
        <rect x={1180} y={480} width={150} height={38} rx={8} fill="#8c8f8c" stroke="#222" strokeWidth={4} />
        <rect x={1140} y={470} width={50} height={58} fill="#56585a" stroke="#222" strokeWidth={3} />
        {/* the rail and hangers in front */}
        <line x1={160} y1={200} x2={1760} y2={200} stroke="#6c6b63" strokeWidth={14} />
        {[300, 430, 1490, 1610].map(x => <g key={x} stroke="#46453e" strokeWidth={7} fill="none"><path d={`M${x} 200 q18 -22 -8 -30`} /><path d={`M${x} 200 L${x - 96} 260 H${x + 96} Z`} /></g>)}
      </Svg>
      {open > 0 && <div style={{position: 'absolute', left: 560, top: 120, width: 800, height: 840, background: 'rgba(255,214,120,.55)', transform: `scaleX(${open})`, transformOrigin: '0 50%'}} />}
      {d.slit && <div style={{position: 'absolute', left: 560, top: 955, width: 800, height: 8, background: '#ffd27a', boxShadow: '0 0 26px 6px rgba(255,200,110,.55)'}} />}
    </>
  );
};

const Bedroom: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (d.inside) return <Shot p={p} world={<>
    <WardrobeInside p={p} />
    {d.torch && <><div style={{position: 'absolute', left: -500, top: -400, width: 2920, height: 1900, background: `radial-gradient(circle ${d.torch[2]}px at ${d.torch[0] + 500}px ${d.torch[1] + 400}px, rgba(0,0,0,0) 40%, rgba(0,0,0,.9) 100%)`}} /><Pool x={d.torch[0]} y={d.torch[1]} rx={d.torch[2] * 0.7} color="255,236,190" a={0.34} /></>}
    <Actors p={p} />
  </>} fore={d.foreHangers ? <Svg><path d="M-20 -20 H1940 V60 H-20 Z" fill="#0a0806" /></Svg> : undefined} />;
  return <Shot p={p} world={<>
    <Soft p={p}><BedroomWorld p={p} /></Soft>
    <Actors p={p} />
  </>} />;
};

export const ROOMS: Record<string, ShotComponent> = {living: Living, kitchen: Kitchen, bedroom: Bedroom};
