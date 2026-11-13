import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {D, FONT, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {RainStreaks} from '../../kit/inserts';
import {FaceEcu} from '../../kit/ecu';
import {LightVeil, RBox, RFace, makeRoom, type Room} from '../../kit/room';
import {Actors, C, ROSTER, Shot} from './cast';

// ชานชาลาสถานีชุมทางคลองหมอก (brief.md → Sets): one platform in perspective, seen from several positions.
//   u 0 = platform edge (tracks beyond, lower), u 1 = station wall; v 0 = tin roof, v 1 = planks; w 0 far end … 1 camera
//   on the wall from far to near: ticket window + vinyl banner (w .1–.24) · office door and lit window (w .28–.46) ·
//   the green locker row (w .56–.92), locker 104 the far one (w .56–.6) under neon lamp 3
//   neon lamps 1, 2, 3 hang at w .9, .76, .6 (lamp 3 dies at midnight: data.lamp3 = 'off'); the station clock at w .44
// data: rain (after midnight), lamp3, train (the last train standing at the near track), headlight (approaching),
//       time = night | dawn. A view ending -high / -low uses the same platform from a raised / ground camera.

const mk = (vy: number) => makeRoom({x: 700, y: vy}, {x0: 590, x1: 870, y0: vy - 110, y1: vy + 80}, 7);
export const PLAT = mk(480);
export const PLAT_LOW = makeRoom({x: 700, y: 690}, {x0: 590, x1: 870, y0: 560, y1: 750}, 7);
export const PLAT_HIGH = makeRoom({x: 700, y: 250}, {x0: 590, x1: 870, y0: 160, y1: 340}, 7);
export const roomOf = (view: string) => (/-low\b|-low-/.test(view) ? PLAT_LOW : /-high\b/.test(view) ? PLAT_HIGH : PLAT);

export const LAMPS: [number, number][] = [[0.55, 0.9], [0.55, 0.76], [0.55, 0.6]];
const LOCKERS = Array.from({length: 9}, (_, i) => 0.56 + i * 0.04);

const PlatformWorld: React.FC<{p: ShotProps; R: Room}> = ({p, R}) => {
  const d = D(p);
  const dawn = d.time === 'dawn';
  const lamp3Off = d.lamp3 === 'off';
  const Q = R.Q, P = R.P;
  const lampOn = (i: number) => !dawn && (Array.isArray(d.lit) ? d.lit.includes(i) : !(i === 2 && lamp3Off));
  const k3 = d.lamp3 === 'flicker' ? flicker(p.f, 3, 0.9) : 1;
  const lights: [number, number, number][] = [];
  LAMPS.forEach(([u, w], i) => { if (lampOn(i)) { const q = P(u, 0.6, w); lights.push([q.x, q.y + 80, 280 * R.s(w) / 2.2]); } });
  const win = P(1, 0.45, 0.4); lights.push([win.x, win.y, 160]);
  if (d.headlight) lights.push([R.vp.x - 140, R.vp.y + 40, 260]);
  return (
    <>
      <Svg>
        {/* sky and the dark beyond the far end */}
        <rect x={-1200} y={-1200} width={4400} height={3400} fill={dawn ? '#8796ab' : '#070a10'} />
        {dawn && <rect x={-1200} y={R.vp.y - 60} width={4400} height={260} fill="#e7c79a" opacity={0.55} />}
        {/* track bed beyond the platform edge, two tracks, ballast */}
        <polygon points={Q([[-1.6, 1.28, 0], [0, 1.28, 0], [0, 1.28, 1.1], [-1.6, 1.28, 1.1]])} fill={dawn ? '#5b5650' : C.ballast} />
        {[-0.95, -0.55, -0.4, -1.4].map((u, i) => <polyline key={i} points={Q([[u, 1.27, 0], [u, 1.27, 1.1]])} stroke={C.rail} strokeWidth={6} fill="none" />)}
        {Array.from({length: 16}, (_, i) => { const w = i / 16; return <polygon key={i} points={Q([[-1.05, 1.28, w], [-0.3, 1.28, w], [-0.3, 1.28, w + 0.012], [-1.05, 1.28, w + 0.012]])} fill="#2a241e" />; })}
        {/* platform edge face and the planks */}
        <polygon points={Q([[0, 1, 0], [0, 1.28, 0], [0, 1.28, 1.1], [0, 1, 1.1]])} fill="#4a4136" />
        <polygon points={Q([[0, 1, 0], [1, 1, 0], [1, 1, 1.1], [0, 1, 1.1]])} fill={dawn ? '#7a6248' : C.plank} />
        {Array.from({length: 11}, (_, i) => <polyline key={i} points={Q([[i / 11, 1, 0], [i / 11, 1, 1.1]])} stroke={C.plankD} strokeWidth={3} fill="none" opacity={0.7} />)}
        <polyline points={Q([[0.04, 1, 0], [0.04, 1, 1.1]])} stroke="#d9c76a" strokeWidth={7} fill="none" opacity={0.7} />
        {/* the station wall */}
        <polygon points={Q([[1, 0, 0], [1, 0, 1.1], [1, 1, 1.1], [1, 1, 0]])} fill={dawn ? '#9a917e' : '#4f5048'} />
        <polygon points={Q([[1, 0.62, 0], [1, 0.62, 1.1], [1, 1, 1.1], [1, 1, 0]])} fill={dawn ? '#7c6a52' : '#3c3428'} />
        {/* tin roof with beams */}
        <polygon points={Q([[-0.12, 0, 0], [1, 0, 0], [1, 0, 1.1], [-0.12, 0, 1.1]])} fill={dawn ? '#6d7277' : C.tinD} />
        {Array.from({length: 12}, (_, i) => <polyline key={i} points={Q([[-0.12 + i * 0.1, 0, 0], [-0.12 + i * 0.1, 0, 1.1]])} stroke="#2a2d31" strokeWidth={3} fill="none" />)}
        {Array.from({length: 9}, (_, i) => { const w = 0.1 + i * 0.11; return <polygon key={i} points={Q([[-0.12, 0, w], [1, 0, w], [1, 0.04, w], [-0.12, 0.04, w]])} fill="#25282c" />; })}
        <polygon points={Q([[-0.12, 0, 0], [-0.12, 0, 1.1], [-0.12, 0.06, 1.1], [-0.12, 0.06, 0]])} fill="#1d2023" />
      </Svg>
      {/* roof posts along the edge */}
      {[0.12, 0.34, 0.56, 0.78, 1.0].map(w => <RBox key={w} r={R} u={[0.02, 0.035]} v={[0.04, 1]} w={[w, w + 0.012]} front="#2f3236" side="#24272a" />)}
      {/* ticket window + vinyl banner */}
      <RFace r={R} pts={[[1, 0.38, 0.12], [1, 0.38, 0.2], [1, 0.62, 0.2], [1, 0.62, 0.12]]} fill={dawn ? '#c8bfa6' : '#d9b56a'} stroke="#2a2017" sw={5} />
      <RFace r={R} pts={[[0.995, 0.16, 0.08], [0.995, 0.16, 0.26], [0.995, 0.32, 0.26], [0.995, 0.32, 0.08]]} fill="#e9e2cf" />
      <RFace r={R} pts={[[0.995, 0.16, 0.08], [0.995, 0.16, 0.26], [0.995, 0.2, 0.26], [0.995, 0.2, 0.08]]} fill={C.red} />
      {/* office: door and lit window */}
      <RFace r={R} pts={[[1, 0.24, 0.28], [1, 0.24, 0.33], [1, 1, 0.33], [1, 1, 0.28]]} fill="#3a2a1c" stroke="#1d150e" />
      <RFace r={R} pts={[[1, 0.3, 0.36], [1, 0.3, 0.46], [1, 0.6, 0.46], [1, 0.6, 0.36]]} fill={dawn ? '#c9c0a6' : '#e8c27a'} stroke="#2a2017" sw={5} />
      {!dawn && <Pool x={win.x} y={win.y} rx={140 * R.s(0.4) / 1.6} color={C.lamp} a={0.5} />}
      {/* the lockers */}
      {LOCKERS.map((w, i) => (
        <g key={w}>
          <RFace r={R} pts={[[0.999, 0.3, w], [0.999, 0.3, w + 0.038], [0.999, 1, w + 0.038], [0.999, 1, w]]} fill={i === 0 ? '#566b5e' : C.locker} stroke={C.lockerD} sw={3} />
          <RFace r={R} pts={[[0.998, 0.64, w], [0.998, 0.64, w + 0.038], [0.998, 0.65, w + 0.038], [0.998, 0.65, w]]} fill={C.lockerD} />
          {[0.36, 0.4].map(v => <RFace key={v} r={R} pts={[[0.998, v, w + 0.008], [0.998, v, w + 0.03], [0.998, v + 0.01, w + 0.03], [0.998, v + 0.01, w + 0.008]]} fill={C.lockerD} />)}
        </g>
      ))}
      {(() => { const q = R.P(0.999, 0.47, 0.58); const k = R.s(0.58); return <Svg><text x={q.x} y={q.y} fontFamily={FONT.title} fontSize={14 * k} fill="#a33028" textAnchor="middle" transform={`skewY(${-18}) `} style={{transformOrigin: `${q.x}px ${q.y}px`}}>104</text></Svg>; })()}
      {d.lockerOpen && <RFace r={R} pts={[[0.999, 0.3, 0.56], [0.92, 0.3, 0.6], [0.92, 1, 0.6], [0.999, 1, 0.56]]} fill="#3a4a40" stroke={C.lockerD} />}
      {d.tape && <RFace r={R} pts={[[0.997, 0.5, 0.62], [0.997, 0.5, 0.9], [0.997, 0.52, 0.9], [0.997, 0.52, 0.62]]} fill="#c23a30" o={0.8} />}
      {/* bench near the lockers */}
      <RBox r={R} u={[0.82, 0.96]} v={[0.88, 0.9]} w={[0.3, 0.5]} front="#6b4a2f" top="#7d5a3a" side="#4e3622" />
      {[0.32, 0.48].map(w => <RBox key={w} r={R} u={[0.83, 0.95]} v={[0.9, 1]} w={[w, w + 0.01]} front="#3a2a1c" />)}
      {d.sevenLocks && (() => { const a = R.P(0.83, 0.88, 0.34), b = R.P(0.95, 0.88, 0.46); return <Svg>{Array.from({length: 7}, (_, i) => <rect key={i} x={a.x + (b.x - a.x) * i / 7} y={a.y + (b.y - a.y) * i / 7 - 10} width={10} height={10} fill={C.brass} />)}</Svg>; })()}
      {/* the station clock hanging from the roof */}
      {(() => { const q = R.P(0.5, 0.17, 0.44), k = R.s(0.44); return <Svg><line x1={q.x} y1={R.P(0.5, 0.04, 0.44).y} x2={q.x} y2={q.y - 18 * k} stroke="#1a1b1d" strokeWidth={3 * k} /><circle cx={q.x} cy={q.y} r={18 * k} fill={dawn ? '#e8e4d8' : '#c9c6bc'} stroke="#1a1b1d" strokeWidth={3 * k} /><line x1={q.x} y1={q.y} x2={q.x} y2={q.y - 12 * k} stroke="#111" strokeWidth={2 * k} /><line x1={q.x} y1={q.y} x2={q.x + 9 * k} y2={q.y + 4 * k} stroke="#111" strokeWidth={2 * k} /></Svg>; })()}
      {/* neon lamps */}
      {LAMPS.map(([u, w], i) => {
        const a = R.P(u - 0.08, 0.06, w), b = R.P(u + 0.08, 0.06, w), k = R.s(w), on = lampOn(i);
        return <Svg key={i}><rect x={a.x} y={a.y} width={b.x - a.x} height={5 * k} rx={2 * k} fill={on ? '#f1fbf4' : '#3f4442'} opacity={i === 2 ? (on ? k3 : 1) : 1} /><line x1={a.x + (b.x - a.x) / 2} y1={R.P(u, 0, w).y} x2={a.x + (b.x - a.x) / 2} y2={a.y} stroke="#1d2023" strokeWidth={2 * k} /></Svg>;
      })}
      {/* the train standing at the near track: carriage side facing the platform, the last door lit */}
      {d.train && <>
        <RFace r={R} pts={[[-0.32, 0.12, 0.05], [-0.32, 0.12, 1.1], [-0.32, 1.22, 1.1], [-0.32, 1.22, 0.05]]} fill="#2f3a46" />
        <RFace r={R} pts={[[-0.32, 0.12, 0.05], [-0.32, 0.12, 1.1], [-0.32, 0.2, 1.1], [-0.32, 0.2, 0.05]]} fill="#7b2a26" />
        {Array.from({length: 12}, (_, i) => { const w = 0.08 + i * 0.085; return <RFace key={i} r={R} pts={[[-0.319, 0.3, w], [-0.319, 0.3, w + 0.05], [-0.319, 0.55, w + 0.05], [-0.319, 0.55, w]]} fill="#0b0e12" />; })}
        <RFace r={R} pts={[[-0.318, 0.24, 0.6], [-0.318, 0.24, 0.66], [-0.318, 1.0, 0.66], [-0.318, 1.0, 0.6]]} fill={d.trainDoor === false ? '#0b0e12' : '#f0dca0'} />
      </>}
      {d.headlight && (() => { const q = R.P(-0.68, 1.1, 0.02); return <><Pool x={q.x} y={q.y} rx={220} color={C.head} a={0.95} /><Pool x={q.x} y={q.y} rx={60} color="255,255,240" a={1} /></>; })()}
      {/* far end fog */}
      <div style={{position: 'absolute', left: R.vp.x - 900, top: R.vp.y - 260, width: 1400, height: 520, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${dawn ? '230,220,200' : '120,140,150'},.28), rgba(0,0,0,0) 70%)`, filter: 'blur(20px)'}} />
      <LightVeil id="plat" lights={lights} o={dawn ? 0.2 : 0.58} color="#04060a" />
      {LAMPS.map(([u, w], i) => { if (!lampOn(i)) return null; const q = R.P(u, 0.08, w), f = R.P(u, 1, w), k = R.s(w); return <React.Fragment key={i}><Pool x={q.x} y={q.y} rx={60 * k} color={C.neon} a={1 * (i === 2 ? k3 : 1)} /><Pool x={f.x + 40 * k} y={f.y - 10 * k} rx={150 * k} ry={45 * k} color={C.neon} a={0.6 * (i === 2 ? k3 : 1)} /></React.Fragment>; })}
      {dawn && <Pool x={R.vp.x} y={R.vp.y} rx={900} ry={300} color="255,214,150" a={0.4} />}
    </>
  );
};

const Platform: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'sommai-eye-ecu' || v === 'truth-ecu') return <EyeEcu p={p} dark={v === 'truth-ecu'} />;
  if (v === 'clock-low') return <ClockLow p={p} />;
  const R = roomOf(v);
  return <Shot p={p} world={<>
    <Soft p={p}><PlatformWorld p={p} R={R} /></Soft>
    {d.dark ? <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(0.16) saturate(.6)'}}><Actors p={p} /></div> : <Actors p={p} />}
    {d.rain && <RainStreaks f={p.f} a={d.rain === 'heavy' ? 1 : 0.6} />}
  </>} fore={d.fore === 'window' ? <WindowFore /> : undefined} foreBlur={5} foreDark={0.55} />;
};

/** looking into the office from the dark platform through its window */
const WindowFore: React.FC = () => (
  <Svg>
    <path d="M-40 -40 H1960 V1120 H-40 Z M420 180 H1500 V860 H420 Z" fill="#0a0c0e" fillRule="evenodd" />
    <rect x={940} y={180} width={36} height={680} fill="#0a0c0e" />
    {Array.from({length: 30}, (_, i) => <line key={i} x1={440 + rnd(141, i) * 1040} y1={200 + rnd(142, i) * 600} x2={436 + rnd(141, i) * 1040} y2={230 + rnd(142, i) * 600} stroke="#a8bccb" strokeWidth={4} opacity={0.6} />)}
  </Svg>
);

/** the station clock from below: the empty track running into fog behind it */
const ClockLow: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#04060a" at={[50, 40]} vig={0.8} inner={30} z={1.06}>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1160} fill="#0a0e14" />
      <path d="M-40 -40 L1960 -40 L1960 180 L-40 260 Z" fill={C.tinD} />
      {Array.from({length: 10}, (_, i) => <line key={i} x1={i * 220} y1={-40} x2={i * 230 - 60} y2={240} stroke="#1d2023" strokeWidth={10} />)}
      <path d="M700 1120 L930 620 M1300 1120 L990 620" stroke={C.rail} strokeWidth={10} />
      <ellipse cx={960} cy={620} rx={600} ry={120} fill="#7d8c96" opacity={0.18} style={{filter: 'blur(24px)'}} />
      <circle cx={1500} cy={720} r={20} fill="#ff3020" />
      <line x1={960} y1={180} x2={960} y2={300} stroke="#1a1b1d" strokeWidth={14} />
      <circle cx={960} cy={480} r={190} fill="#d9d6cc" stroke="#1a1b1d" strokeWidth={22} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={960 + Math.sin(i * Math.PI / 6) * 150} y1={480 - Math.cos(i * Math.PI / 6) * 150} x2={960 + Math.sin(i * Math.PI / 6) * 172} y2={480 - Math.cos(i * Math.PI / 6) * 172} stroke="#111" strokeWidth={8} />)}
      <line x1={960} y1={480} x2={960 + Math.sin(-0.62) * 100} y2={480 - Math.cos(-0.62) * 100} stroke="#111" strokeWidth={14} strokeLinecap="round" />
      <line x1={960} y1={480} x2={960 + Math.sin(5.97) * 150} y2={480 - Math.cos(5.97) * 150} stroke="#111" strokeWidth={9} strokeLinecap="round" />
    </Svg>
    <Pool x={960} y={330} rx={500} color={C.neon} a={0.4 * flicker(p.f, 5, 0.2)} />
  </Macro>
);

/** eyes as big as the frame, from the sprite's own face; `dark` = the darkest frame of the film */
const EyeEcu: React.FC<{p: ShotProps; dark?: boolean}> = ({p, dark}) => {
  const d = D(p);
  return (
    <Macro p={p} bg="#020203" at={[50, 42]} vig={dark ? 0.96 : 0.8} inner={dark ? 16 : 30} z={1.05}>
      <FaceEcu who={d.face ?? (dark ? 'sommai cry' : 'sommai angry look=0.3')} roster={ROSTER} f={p.f} len={p.len} part="eyes" at={[0.5, 0.42]} fill={0.92} shade={dark ? 'r' : 'l'} shadeA={dark ? 0.85 : 0.55} talking={false}
        back={<div style={{position: 'absolute', inset: 0, background: dark ? '#050405' : 'radial-gradient(ellipse at 80% 30%, #3a4a48, #07090c 70%)'}} />} />
      {d.rain && <RainStreaks f={p.f} a={0.5} />}
      {dark && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,.25), rgba(0,0,0,.9) 70%)'}} />}
      {dark && <Pool x={420} y={420} rx={300} color={C.lamp} a={0.22} />}
    </Macro>
  );
};

// ---------------------------------------------------------------- the front of the station (ticket hall, Sai's cart)

export const FRONT = makeRoom({x: 980, y: 520}, {x0: 380, x1: 1560, y0: 160, y1: 760}, 3.0);

const Cart: React.FC<{r: Room; u: number; w: number; f: number; fallen?: boolean}> = ({r, u, w, f, fallen}) => {
  const k = r.s(w), q = r.P(u, 1, w);
  const sc = k * 0.42;
  return (
    <>
      <Svg>
        <g transform={`translate(${q.x} ${q.y}) scale(${sc}) ${fallen ? 'rotate(-14)' : ''}`}>
          <rect x={-220} y={-300} width={440} height={230} rx={10} fill="#6b4a2f" stroke="#2c1d10" strokeWidth={8} />
          <rect x={-200} y={-460} width={400} height={160} fill="#cfe0e6" opacity={0.35} stroke="#8a9aa0" strokeWidth={6} />
          {[-150, -60, 30, 120].map(x => <rect key={x} x={x} y={-440} width={60} height={120} rx={10} fill="#e8d6b0" opacity={0.8} />)}
          <line x1={0} y1={-460} x2={0} y2={-620} stroke="#222" strokeWidth={8} />
          <circle cx={-150} cy={-40} r={44} fill="#222" /><circle cx={150} cy={-40} r={44} fill="#222" />
          <rect x={-260} y={-320} width={520} height={30} fill="#3a2a1c" />
        </g>
      </Svg>
      {!fallen && (() => { const b = r.P(u, 1, w); return <><Svg><circle cx={b.x} cy={b.y - 620 * sc} r={18 * sc * 2} fill="#ffe6a8" /></Svg><Pool x={b.x} y={b.y - 600 * sc} rx={260 * k} color={C.lamp} a={0.6 * flicker(f, 9, 0.05)} /></>; })()}
    </>
  );
};

const FrontWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p), r = FRONT;
  const dawn = d.time === 'dawn';
  return (
    <>
      <Svg><rect x={-1200} y={-1200} width={4400} height={3400} fill={dawn ? '#9fa9b8' : '#06080c'} /></Svg>
      {/* forecourt and the eaves of the ticket hall */}
      <RFace r={r} pts={[[-0.6, 1, 0], [1.6, 1, 0], [1.6, 1, 1.2], [-0.6, 1, 1.2]]} fill={dawn ? '#8a8172' : '#2e2b27'} />
      {d.rain && Array.from({length: 18}, (_, i) => { const q = r.P(-0.4 + rnd(151, i) * 1.8, 1, 0.2 + rnd(152, i) * 0.9); return <Svg key={i}><ellipse cx={q.x} cy={q.y} rx={40 + rnd(153, i) * 80} ry={8} fill="#8aa0b0" opacity={0.25} /></Svg>; })}
      <RFace r={r} pts={[[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]} fill={dawn ? '#b3a88f' : '#4b4a42'} />
      <RFace r={r} pts={[[0, 0.62, 0], [1, 0.62, 0], [1, 1, 0], [0, 1, 0]]} fill={dawn ? '#8a7558' : '#3a3026'} />
      {/* ticket windows with bars, the vinyl banner over them */}
      {[0.18, 0.62].map(u => <RFace key={u} r={r} pts={[[u, 0.36, 0], [u + 0.2, 0.36, 0], [u + 0.2, 0.62, 0], [u, 0.62, 0]]} fill={dawn ? '#ddd3b8' : '#e3b864'} stroke="#2a2017" sw={7} />)}
      {[0.18, 0.62].map(u => Array.from({length: 5}, (_, i) => <RFace key={`${u}${i}`} r={r} pts={[[u + 0.03 + i * 0.035, 0.36, 0], [u + 0.036 + i * 0.035, 0.36, 0], [u + 0.036 + i * 0.035, 0.62, 0], [u + 0.03 + i * 0.035, 0.62, 0]]} fill="#26282c" />))}
      <RFace r={r} pts={[[0.12, 0.08, 0], [0.88, 0.08, 0], [0.88, 0.3, 0], [0.12, 0.3, 0]]} fill="#ece6d4" />
      <RFace r={r} pts={[[0.12, 0.08, 0], [0.88, 0.08, 0], [0.88, 0.14, 0], [0.12, 0.14, 0]]} fill={C.red} />
      {(() => { const a = r.P(0.5, 0.21, 0), b = r.P(0.5, 0.27, 0); return <Svg><text x={a.x} y={a.y} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#2a2a2a">ประกาศยุบสถานีชุมทางคลองหมอก</text><text x={b.x} y={b.y} textAnchor="middle" fontFamily={FONT.ui} fontWeight={600} fontSize={26} fill="#2a2a2a">ตั้งแต่วันที่ 15 พ.ย. เป็นต้นไป</text></Svg>; })()}
      {(() => { const a = r.P(0.5, 0.115, 0); return <Svg><text x={a.x} y={a.y} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#fff">การแจ้งเตือน</text></Svg>; })()}
      {/* boxes stacked, the door to the office on the right */}
      <RBox r={r} u={[0.02, 0.14]} v={[0.82, 1]} w={[0.05, 0.2]} front="#9a7a52" top="#b08e62" side="#7c6040" />
      <RBox r={r} u={[0.04, 0.12]} v={[0.68, 0.82]} w={[0.07, 0.17]} front="#a5845a" top="#bb9a6c" side="#83663f" />
      <RFace r={r} pts={[[0.9, 0.24, 0], [0.99, 0.24, 0], [0.99, 1, 0], [0.9, 1, 0]]} fill={dawn ? '#5a4a36' : '#2a1d12'} stroke="#140e08" />
      {/* eaves edge */}
      <RFace r={r} pts={[[-0.6, 0, 0], [1.6, 0, 0], [1.6, 0, 0.5], [-0.6, 0, 0.5]]} fill="#1f2226" />
      <RFace r={r} pts={[[-0.6, 0, 0.5], [1.6, 0, 0.5], [1.6, 0.04, 0.5], [-0.6, 0.04, 0.5]]} fill="#15171a" />
      {d.cart !== false && <Cart r={r} u={d.cartAt?.[0] ?? 0.78} w={d.cartAt?.[1] ?? 0.55} f={p.f} fallen={d.cart === 'fallen'} />}
      {d.cart === 'fallen' && (() => { const q = r.P(0.6, 1, 0.62); return <Svg>{Array.from({length: 7}, (_, i) => <rect key={i} x={q.x - 80 + i * 26} y={q.y - 6 + (i % 2) * 8} width={18} height={12} fill={['#e8e8e8', C.brass, '#ece8dc'][i % 3]} />)}</Svg>; })()}
      <LightVeil id="front" lights={[[r.P(0.28, 0.5, 0).x, r.P(0.28, 0.5, 0).y, 360], [r.P(0.72, 0.5, 0).x, r.P(0.72, 0.5, 0).y, 360], ...(d.cart !== false && d.cart !== 'fallen' ? [[r.P(d.cartAt?.[0] ?? 0.78, 0.6, d.cartAt?.[1] ?? 0.55).x, r.P(d.cartAt?.[0] ?? 0.78, 0.6, d.cartAt?.[1] ?? 0.55).y, 340] as [number, number, number]] : [])]} o={dawn ? 0.18 : 0.62} color="#04060a" />
      {!dawn && [0.28, 0.72].map(u => { const q = r.P(u, 0.5, 0); return <Pool key={u} x={q.x} y={q.y} rx={300} color={C.lamp} a={0.35} />; })}
      {dawn && <Pool x={1500} y={200} rx={900} color="255,214,150" a={0.35} />}
    </>
  );
};

/** the road outside the station at dawn / the cart leaving into the rain: ground running to a far vanishing point */
const RoadWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p), dawn = d.time === 'dawn';
  return (
    <Svg>
      <rect x={-1200} y={-1200} width={4400} height={3400} fill={dawn ? '#a7b3c3' : '#05070b'} />
      {dawn && <rect x={-1200} y={420} width={4400} height={200} fill="#f0cc96" opacity={0.6} />}
      <path d="M-400 1200 L900 520 L1020 520 L2400 1200 Z" fill={dawn ? '#6e6a63' : '#1d1c1a'} />
      <path d="M960 520 L960 1200" stroke={dawn ? '#d8d0b8' : '#5a5650'} strokeWidth={8} strokeDasharray="40 50" />
      <path d="M-400 520 Q300 470 900 520 L-400 600 Z" fill={dawn ? '#5d6b52' : '#0b0f0c'} />
      <path d="M2400 520 Q1600 470 1020 520 L2400 600 Z" fill={dawn ? '#5d6b52' : '#0b0f0c'} />
      {/* the station corner on the left edge */}
      <path d="M-40 120 L520 260 L520 760 L-40 900 Z" fill={dawn ? '#9a8f7a' : '#2a2824'} />
      <path d="M-40 120 L520 260 L560 230 L-40 60 Z" fill="#3a3530" />
      <rect x={60} y={420} width={300} height={200} fill={dawn ? '#cfc6ac' : '#e3b864'} opacity={dawn ? 1 : 0.6} />
    </Svg>
  );
};

const Front: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  const road = v === 'sai-push-ew' || v === 'exit-ew';
  return <Shot p={p} world={<>
    <Soft p={p}>{road ? <RoadWorld p={p} /> : <FrontWorld p={p} />}</Soft>
    {road && d.cart !== false && v === 'sai-push-ew' && <Svg><circle cx={1000 - p.f * 0.5} cy={560} r={8} fill="#ffe6a8" /></Svg>}
    {road && v === 'sai-push-ew' && <Pool x={1000 - p.f * 0.5} y={560} rx={60} color={C.lamp} a={0.6} />}
    <Actors p={p} />
    {d.rain && <RainStreaks f={p.f} a={d.rain === 'heavy' ? 1 : 0.6} />}
  </>} />;
};

// ---------------------------------------------------------------- the tracks

const TrackWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p), v = p.shot.view ?? '';
  const storm = d.rain === 'heavy' || v.includes('storm');
  const hx = 980, hy = 470;
  return (
    <>
      <Svg>
        <rect x={-1200} y={-1200} width={4400} height={3400} fill="#0a0f16" />
        <rect x={-1200} y={hy - 140} width={4400} height={200} fill="#3a4a58" opacity={0.55} />
        <rect x={-1200} y={hy - 40} width={4400} height={90} fill="#6b7f8e" opacity={0.45} />
        <path d={`M-600 1200 L${hx - 60} ${hy} L${hx + 60} ${hy} L2600 1200 Z`} fill={C.ballast} />
        {Array.from({length: 22}, (_, i) => { const t = Math.pow(i / 22, 1.8); const y = hy + t * 760, w = 60 + t * 1500; return <rect key={i} x={hx - w / 2} y={y} width={w} height={6 + t * 30} fill="#2a241e" />; })}
        {[-1, 1].map(s => <path key={s} d={`M${hx + s * 20} ${hy} L${hx + s * 700} 1200`} stroke="#c9d3da" strokeWidth={14} />)}
        {[-1, 1].map(s => <path key={`b${s}`} d={`M${hx - 200 + s * 14} ${hy} L${hx - 1500 + s * 600} 1200`} stroke={C.railD} strokeWidth={10} />)}
        {/* the signal box hut far along the line, its window lit */}
        {!v.startsWith('headlight') && <g><rect x={1250} y={380} width={120} height={90} fill="#2a2018" /><path d="M1240 380 L1310 340 L1380 380 Z" fill="#1a140f" /><rect x={1275} y={400} width={40} height={30} fill="#ffd27a" /></g>}
        {/* the red signal */}
        <line x1={1500} y1={760} x2={1500} y2={360} stroke="#1a1a1a" strokeWidth={12} />
        <circle cx={1500} cy={360} r={22} fill="#ff2a1a" />
        {v.includes('wait') && <g><rect x={500} y={430} width={420} height={40} fill="#3a3026" /><rect x={600} y={330} width={16} height={100} fill="#222" /><rect x={560} y={320} width={100} height={10} fill="#f1fbf4" /><rect x={600} y={400} width={10} height={34} fill="#111" /></g>}
      </Svg>
      <Pool x={1500} y={360} rx={160} color="255,60,40" a={0.5} />
      {v.includes('wait') && <Pool x={610} y={330} rx={180} color={C.neon} a={0.6} />}
      {!v.startsWith('headlight') && <Pool x={1295} y={415} rx={100} color={C.lamp} a={0.6 + 0.2 * flicker(p.f, 2, 0.3)} />}
      {v.startsWith('headlight') && <><Pool x={hx} y={hy} rx={420} color={C.head} a={1} /><Pool x={hx} y={hy} rx={90} color="255,255,245" a={1} /><Svg><path d={`M${hx} ${hy} L${hx - 700} 1200 L${hx + 700} 1200 Z`} fill="#fff6d0" opacity={0.12} /></Svg></>}
      {storm && <RainStreaks f={p.f} a={1} />}
      {!storm && <RainStreaks f={p.f} a={0.35} />}
    </>
  );
};

const Track: ShotComponent = p => <Shot p={p} world={<TrackWorld p={p} />} />;

// ---------------------------------------------------------------- the train

const Train: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '', k = p.f / Math.max(1, p.len);
  if (v === 'wheels-low') return (
    <Macro p={p} bg="#030405" at={[50, 50]} vig={0.85} inner={26} z={1.04}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#0b0e12" />
        <rect x={-40} y={860} width={2000} height={40} fill={C.rail} />
        <rect x={-40} y={900} width={2000} height={220} fill={C.ballast} />
        <g transform={`translate(${-k * 300} 0)`}>
          <rect x={-200} y={120} width={2600} height={560} fill="#2f3a46" />
          <rect x={-200} y={120} width={2600} height={60} fill="#7b2a26" />
          {[300, 1300].map(x => <g key={x}>{[0, 380].map(o => <g key={o} transform={`rotate(${p.f * 6} ${x + o} 760)`}><circle cx={x + o} cy={760} r={110} fill="#1c1d20" stroke="#3a3c40" strokeWidth={14} />{[0, 60, 120].map(a => <line key={a} x1={x + o - 100} y1={760} x2={x + o + 100} y2={760} stroke="#3a3c40" strokeWidth={10} transform={`rotate(${a} ${x + o} 760)`} />)}</g>)}</g>)}
        </g>
        {Array.from({length: 18}, (_, i) => <circle key={i} cx={420 + rnd(161, i) * 160 + (p.f * 4) % 100} cy={850 - rnd(162, i) * 60} r={4} fill="#ffcf6a" />)}
        <ellipse cx={900} cy={640} rx={900} ry={220} fill="#d8e2ea" opacity={0.18} style={{filter: 'blur(30px)'}} />
      </Svg>
      <RainStreaks f={p.f} a={0.8} />
      <Pool x={470} y={850} rx={240} color="255,190,90" a={0.5} />
    </Macro>
  );
  if (v === 'door-sil' || v === 'guard-fif') {
    const guard = v === 'guard-fif';
    return (
      <Macro p={p} bg="#030405" at={[50, 46]} vig={0.86} inner={24} z={1.05}>
        <Svg>
          <rect x={-40} y={-40} width={2000} height={1160} fill="#2f3a46" />
          <rect x={-40} y={-40} width={2000} height={90} fill="#7b2a26" />
          {guard ? <>
            <rect x={460} y={200} width={1000} height={560} rx={30} fill="#0b0e12" stroke="#1d242c" strokeWidth={20} />
            <rect x={480} y={220} width={960} height={520} fill="#e9d79a" opacity={0.85} />
            <rect x={480 + (1 - k) * 0} y={220} width={Math.max(0, 960 * Math.min(1, k * 1.6))} height={520} fill="#8a6a44" />
          </> : <>
            <rect x={700} y={60} width={520} height={1060} fill="#f0dca0" />
            <rect x={680} y={40} width={560} height={1080} fill="none" stroke="#1d242c" strokeWidth={30} />
            {[880, 980].map(y => <rect key={y} x={720} y={y} width={480} height={30} fill="#3a3a3a" />)}
          </>}
        </Svg>
        {!guard && <Pool x={960} y={420} rx={700} color="255,226,160" a={0.4} />}
        {d.dark ? <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(0.05)'}}><Actors p={p} /></div> : <Actors p={p} />}
        {guard && <Svg>{Array.from({length: 34}, (_, i) => <line key={i} x1={480 + rnd(171, i) * 960} y1={220 + rnd(172, i) * 520} x2={476 + rnd(171, i) * 960} y2={250 + rnd(172, i) * 520} stroke="#d6e2ec" strokeWidth={4} opacity={0.6} />)}</Svg>}
        <RainStreaks f={p.f} a={1} />
        {guard && <Pool x={960} y={480} rx={700} color="255,226,160" a={0.4} />}
      </Macro>
    );
  }
  return <Shot p={p} world={<><Soft p={p}><PlatformWorld p={{...p, shot: {...p.shot, data: {...d, train: true}}}} R={PLAT} /></Soft><Actors p={p} /><RainStreaks f={p.f} a={1} /></>} />;
};

export const PLATFORM_SCENES: Record<string, ShotComponent> = {platform: Platform, front: Front, track: Track, train: Train};
export {PlatformWorld};
