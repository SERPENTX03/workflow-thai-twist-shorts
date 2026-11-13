import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {D, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {RainStreaks} from '../../kit/inserts';
import {FaceEcu} from '../../kit/ecu';
import {Macro} from '../../kit/frame';
import {Motorcycle} from '../../kit/places';
import {LightVeil, RBox, RFace, makeRoom} from '../../kit/room';
import {Actors, C, ROSTER, Shot} from './cast';

// ป้อมสับราง (brief.md → Sets): a small wooden hut at the end of the platform.
//   inside   the lever frame along the back wall under the window onto the rails; the right pane cracked and taped
//            yellow; the wooden document cabinet on the left wall (the drawer Khem pries); the door on the right wall;
//            a bulb on its flex (off now, on in 2542); the control desk on the right (the bottle, the logbook in 2542)
//   outside  the hut on short stilts beside the siding; next to it the cracked concrete slab of the old staff house
//            and the bent buffer stop at the end of the siding pointing into it
// Light: torches now (data.torch = [x, y, r] world px), the bulb in the past (data.past).

export const BOX = makeRoom({x: 1010, y: 470}, {x0: 560, x1: 1440, y0: 220, y1: 760}, 2.8);
const R = BOX;

const BoxWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p), past = !!d.past;
  const bulb = R.P(0.5, 0.12, 0.5);
  const lights: [number, number, number][] = [];
  if (past) lights.push([bulb.x, bulb.y + 120, 620]);
  if (d.torch) lights.push(d.torch);
  if (d.door) lights.push([R.P(1, 0.5, 0.55).x, R.P(1, 0.5, 0.55).y, 260]);
  return (
    <>
      <Svg><rect x={-1200} y={-1200} width={4400} height={3400} fill="#05070a" /></Svg>
      <RFace r={R} pts={[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]} fill="#241a12" />
      <RFace r={R} pts={[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]} fill="#4a3424" />
      <RFace r={R} pts={[[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]]} fill="#43301f" />
      <RFace r={R} pts={[[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]]} fill="#3a2a1c" />
      <RFace r={R} pts={[[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]} fill="#53392a" />
      <Svg>{Array.from({length: 16}, (_, i) => { const a = R.P(i / 16, 0, 0), b = R.P(i / 16, 1, 0); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2a1d12" strokeWidth={2} />; })}</Svg>
      <Svg>{Array.from({length: 10}, (_, i) => { const a = R.P(i / 10, 1, 0), b = R.P(i / 10, 1, 1); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#24180f" strokeWidth={3} />; })}</Svg>
      {/* the window onto the rails: two panes, the right one cracked and taped */}
      <RFace r={R} pts={[[0.2, 0.16, 0], [0.8, 0.16, 0], [0.8, 0.48, 0], [0.2, 0.48, 0]]} fill={past ? '#0c1220' : '#0b1018'} stroke="#2a1d12" sw={10} />
      <RFace r={R} pts={[[0.495, 0.16, 0], [0.505, 0.16, 0], [0.505, 0.48, 0], [0.495, 0.48, 0]]} fill="#2a1d12" />
      {!past && <Svg>{(() => { const c = R.P(0.66, 0.3, 0); return <path d={`M${c.x} ${c.y} l-70 -60 M${c.x} ${c.y} l90 -40 M${c.x} ${c.y} l60 80 M${c.x} ${c.y} l-40 90 M${c.x} ${c.y} l-90 20`} stroke="#b9cad6" strokeWidth={3} opacity={0.75} />; })()}</Svg>}
      {!past && <RFace r={R} pts={[[0.52, 0.18, 0], [0.78, 0.18, 0], [0.78, 0.2, 0], [0.52, 0.2, 0]]} fill={C.keyTag} o={0.7} />}
      {/* the light of the house beyond the window, only in 2542 */}
      {past && (() => { const q = R.P(0.66, 0.36, 0); return <><Svg><rect x={q.x - 40} y={q.y - 20} width={80} height={44} fill="#ffcf7a" /></Svg><Pool x={q.x} y={q.y} rx={120} color="255,200,120" a={0.6} /></>; })()}
      {/* lever frame */}
      <RBox r={R} u={[0.08, 0.92]} v={[0.9, 1]} w={[0.04, 0.16]} front="#2a2d31" top="#3a3e44" side="#1f2226" />
      {Array.from({length: 9}, (_, i) => { const u = 0.13 + i * 0.09, red = i === 4; const lean = past && red ? -0.06 : (i % 2 ? 0.02 : -0.02); const a = R.P(u, 0.9, 0.1), b = R.P(u + lean, 0.52, 0.1); return <Svg key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={red ? '#8d2a24' : '#5b6066'} strokeWidth={14} strokeLinecap="round" /><rect x={b.x - 14} y={b.y - 10} width={28} height={20} rx={5} fill={red ? '#c23a30' : '#7a7f86'} /></Svg>; })}
      {/* document cabinet on the left wall */}
      <RBox r={R} u={[0, 0.12]} v={[0.42, 1]} w={[0.3, 0.6]} front="#5a3e28" top="#6b4a30" side="#4a321f" />
      {[0.56, 0.7, 0.84].map(v => <RFace key={v} r={R} pts={[[0.12, v, 0.31], [0.12, v, 0.59], [0.12, v + 0.006, 0.59], [0.12, v + 0.006, 0.31]]} fill="#2a1d12" />)}
      {d.pried && <RBox r={R} u={[0.12, 0.2]} v={[0.7, 0.84]} w={[0.32, 0.58]} front="#6b4a30" top="#4a321f" side="#5a3e28" />}
      {/* control desk on the right */}
      <RBox r={R} u={[0.72, 0.98]} v={[0.72, 1]} w={[0.12, 0.34]} front="#4a3424" top="#6a4a32" side="#3a2818" />
      {past && <RBox r={R} u={[0.8, 0.83]} v={[0.62, 0.72]} w={[0.2, 0.23]} front="#cfe0e6" top="#a32b26" />}
      {/* door on the right wall */}
      <RFace r={R} pts={[[1, 0.2, 0.42], [1, 0.2, 0.68], [1, 1, 0.68], [1, 1, 0.42]]} fill={d.door ? '#1d2a2a' : '#2c1e13'} stroke="#140e08" sw={6} />
      {/* the bulb on its flex */}
      <Svg><line x1={bulb.x} y1={R.P(0.5, 0, 0.5).y} x2={bulb.x} y2={bulb.y - 18} stroke="#111" strokeWidth={4} /><circle cx={bulb.x} cy={bulb.y} r={18} fill={past ? '#ffe2a0' : '#4a4a40'} /></Svg>
      <LightVeil id="box" lights={lights} o={past ? 0.42 : 0.7} color="#040305" />
      {past && <Pool x={bulb.x} y={bulb.y + 60} rx={520} color="255,206,130" a={0.5 * flicker(p.f, 4, 0.05)} />}
      {d.torch && <Pool x={d.torch[0]} y={d.torch[1]} rx={d.torch[2] * 0.8} color="255,236,190" a={0.7} />}
      {d.door && (() => { const q = R.P(1, 0.5, 0.55); return <Pool x={q.x} y={q.y} rx={200} ry={380} color={C.neon} a={0.3} />; })()}
    </>
  );
};

const Box: ShotComponent = p => {
  const d = D(p);
  return <Shot p={p} world={<>
    <Soft p={p}><BoxWorld p={p} /></Soft>
    <Actors p={p} />
    {d.past && d.rain !== false && <RainStreaks f={p.f} a={0.25} />}
  </>} fore={d.fore === 'window' ? <BoxWindowFore /> : undefined} foreBlur={4} foreDark={0.6} />;
};

/** looking in through the cracked pane from outside */
const BoxWindowFore: React.FC = () => (
  <Svg>
    <path d="M-40 -40 H1960 V1120 H-40 Z M360 160 H1560 V880 H360 Z" fill="#100b07" fillRule="evenodd" />
    <rect x={940} y={160} width={40} height={720} fill="#100b07" />
    <path d="M1260 420 l-160 -160 M1260 420 l200 -140 M1260 420 l240 140 M1260 420 l-40 300 M1260 420 l-210 120" stroke="#cfe0ea" strokeWidth={5} opacity={0.75} />
    <path d="M1000 190 h540 M1500 190 v160" stroke={C.keyTag} strokeWidth={20} opacity={0.7} />
  </Svg>
);

// ---------------------------------------------------------------- the hut from outside, the old slab, the buffer stop

const BoxExt: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  const high = v.endsWith('-high');
  const hy = high ? 260 : 480;
  return <Shot p={p} world={<>
    <Soft p={p}>
      <Svg>
        <rect x={-1200} y={-1200} width={4400} height={3400} fill="#05070a" />
        <path d={`M-1200 ${hy} L3200 ${hy} L3200 2200 L-1200 2200 Z`} fill="#141713" />
        {/* the main line and the siding running to the buffer stop */}
        <path d={`M-400 1300 L900 ${hy} L960 ${hy} L1300 1300 Z`} fill={C.ballast} />
        {[-1, 1].map(s => <path key={s} d={`M${930 + s * 12} ${hy} L${850 + s * 260} 1300`} stroke={C.rail} strokeWidth={10} />)}
        <path d={`M${1400} 1300 L${1500} ${hy + 280} L1640 ${hy + 280} L2200 1300 Z`} fill={C.ballast} />
        <path d={`M1450 1300 L1540 ${hy + 280} M1950 1300 L1610 ${hy + 280}`} stroke={C.rail} strokeWidth={9} />
        {/* the buffer stop, bent, pointing into the slab */}
        <path d={`M1530 ${hy + 270} l40 -70 l80 10 l10 60`} stroke="#8a2a24" strokeWidth={18} fill="none" transform={`rotate(-12 1580 ${hy + 250})`} />
        {/* the slab of the old house */}
        <path d={`M1560 ${hy + 160} L2300 ${hy + 120} L2600 ${hy + 360} L1700 ${hy + 420} Z`} fill="#5c5a54" />
        <path d={`M1700 ${hy + 220} l200 60 l40 -30 l180 70 M2000 ${hy + 160} l60 120`} stroke="#2e2c28" strokeWidth={6} fill="none" />
        {Array.from({length: 26}, (_, i) => <path key={i} d={`M${1650 + rnd(181, i) * 820} ${hy + 160 + rnd(182, i) * 240} q4 -30 10 -40`} stroke="#3e5a34" strokeWidth={6} fill="none" />)}
        {/* the hut on short stilts with its steps */}
        <g transform={`translate(${high ? 300 : 260} ${hy - 330})`}>
          <rect x={0} y={90} width={460} height={300} fill="#4a3424" stroke="#1f150d" strokeWidth={6} />
          {Array.from({length: 9}, (_, i) => <line key={i} x1={i * 52} y1={90} x2={i * 52} y2={390} stroke="#2a1d12" strokeWidth={3} />)}
          <path d="M-30 100 L230 0 L490 100 Z" fill="#2a2420" />
          <rect x={90} y={160} width={220} height={130} fill={d.past ? '#ffd27a' : '#0d121a'} stroke="#1f150d" strokeWidth={8} />
          {!d.past && <rect x={200} y={168} width={104} height={116} fill="#1b2a3a" />}
          {[30, 420].map(x => <rect key={x} x={x} y={390} width={18} height={80} fill="#1f150d" />)}
          {Array.from({length: 4}, (_, i) => <rect key={i} x={470 + i * 26} y={390 + i * 22} width={60} height={10} fill="#3a2a1c" />)}
          <rect x={360} y={170} width={70} height={220} fill={d.doorOpen ? '#e8c27a' : '#2c1e13'} stroke="#1f150d" strokeWidth={4} />
        </g>
      </Svg>
      {d.torch && <Pool x={d.torch[0]} y={d.torch[1]} rx={d.torch[2]} color="255,236,190" a={0.45} />}
      {d.lit && <Pool x={(high ? 300 : 260) + 200} y={hy - 330 + 225} rx={260} color={C.lamp} a={0.55} />}
      <LightVeil id="bxe" lights={[...(d.torch ? [d.torch] : []), ...(d.lit ? [[(high ? 300 : 260) + 200, hy - 105, 340] as [number, number, number]] : [])]} o={0.6} color="#030406" />
    </Soft>
    <Actors p={p} />
    <RainStreaks f={p.f} a={d.rain === 'heavy' ? 1 : 0.3} />
  </>} />;
};

// ---------------------------------------------------------------- the workers' shed at the end of the platform

export const SHED = makeRoom({x: 900, y: 500}, {x0: 300, x1: 1500, y0: 140, y1: 820}, 2.6);

const ShedWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = SHED, d = D(p);
  const door = r.P(0.62, 0.62, 0);
  return (
    <>
      <Svg><rect x={-1200} y={-1200} width={4400} height={3400} fill="#05070a" /></Svg>
      <RFace r={r} pts={[[-0.6, 1, 0], [1.6, 1, 0], [1.6, 1, 1.2], [-0.6, 1, 1.2]]} fill="#26241f" />
      <Svg>{Array.from({length: 22}, (_, i) => { const q = r.P(-0.5 + rnd(191, i) * 2, 1, 0.2 + rnd(192, i) * 0.9); return <ellipse key={i} cx={q.x} cy={q.y} rx={50 + rnd(193, i) * 90} ry={8} fill="#8aa0b0" opacity={0.2} />; })}</Svg>
      <RFace r={r} pts={[[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]} fill="#5d5a4e" />
      <Svg>{Array.from({length: 14}, (_, i) => { const a = r.P(i / 14, 0, 0), b = r.P(i / 14, 1, 0); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#3e3c34" strokeWidth={3} />; })}</Svg>
      <RFace r={r} pts={[[0.52, 0.28, 0], [0.72, 0.28, 0], [0.72, 1, 0], [0.52, 1, 0]]} fill="#e4ecea" stroke="#2a2a26" sw={8} />
      <RFace r={r} pts={[[0.54, 0.3, 0], [0.7, 0.3, 0], [0.7, 0.5, 0], [0.54, 0.5, 0]]} fill="#bfcac8" />
      <RFace r={r} pts={[[0.12, 0.3, 0], [0.36, 0.3, 0], [0.36, 0.56, 0], [0.12, 0.56, 0]]} fill="#1a2224" stroke="#2a2a26" sw={6} />
      <RFace r={r} pts={[[0.8, 0.5, 0], [0.92, 0.5, 0], [0.92, 0.68, 0], [0.8, 0.68, 0]]} fill="#c9a24a" />
      {/* eave over the door */}
      <RFace r={r} pts={[[-0.2, 0.12, 0], [1.2, 0.12, 0], [1.2, 0.12, 0.35], [-0.2, 0.12, 0.35]]} fill="#2a2d31" />
      <RFace r={r} pts={[[-0.2, 0.12, 0.35], [1.2, 0.12, 0.35], [1.2, 0.15, 0.35], [-0.2, 0.15, 0.35]]} fill="#1d2023" />
      {/* tool rack, tyre, oil drums */}
      <RBox r={r} u={[0.02, 0.1]} v={[0.72, 1]} w={[0.04, 0.14]} front="#3a4a5a" top="#4a5a6a" side="#2a3a4a" />
      <RBox r={r} u={[0.88, 0.98]} v={[0.74, 1]} w={[0.04, 0.14]} front="#8a3a2a" top="#9a4a3a" side="#6a2a1a" />
      <LightVeil id="shed" lights={[[door.x, door.y, 520]]} o={0.62} color="#030406" />
      <Pool x={door.x} y={door.y} rx={460} color={C.fluo} a={0.4 * flicker(p.f, 6, d.flick ? 0.4 : 0.04)} />
    </>
  );
};

const Shed: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'sommai-ecu') return (
    <Macro p={p} bg="#020203" at={[50, 42]} vig={0.86} inner={26} z={1.05}>
      <FaceEcu who="sommai shock look=-0.2" roster={ROSTER} f={p.f} len={p.len} part="eyes" at={[0.5, 0.42]} fill={0.92} shade="l" shadeA={0.6}
        back={<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 20%, #4a5a58, #06080a 70%)'}} />} />
      <RainStreaks f={p.f} a={0.35} />
    </Macro>
  );
  const bike = SHED.P(0.32, 1, 0.42);
  const k = SHED.s(0.42);
  return <Shot p={p} world={<>
    <Soft p={p}><ShedWorld p={p} /></Soft>
    {d.bike !== false && <div style={{position: 'absolute', left: 0, top: 0}}><Motorcycle x={bike.x} y={bike.y} scale={0.62 * k} color="#2f4a6b" flip /></div>}
    <Actors p={p} />
    <RainStreaks f={p.f} a={0.9} />
  </>} />;
};

export const BOX_SCENES: Record<string, ShotComponent> = {box: Box, boxext: BoxExt, shed: Shed};
