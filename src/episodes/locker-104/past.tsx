import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {D, K, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {RainStreaks} from '../../kit/inserts';
import {LightVeil, RBox, RFace, makeRoom} from '../../kit/room';
import {BOX_SCENES} from './box';
import {Actors, C, Shot} from './cast';
import {OFFICE_SCENES} from './office';
import {PLATFORM_SCENES} from './platform';

// The past (data.past grade). 2542: the staff house room where Fon draws and later sleeps holding the ticket
// (one room, one camera for both: the mirror pair fon-memory), the storm by the siding (the false memory and the true
// one share a frame: the mirror pair raincoat), the freight train into the siding, the crash.
// The 2542 signal box, the 2560 office and the morning the padlock goes back on reuse the present sets in the past grade.

export const HOUSE = makeRoom({x: 820, y: 470}, {x0: 460, x1: 1320, y0: 220, y1: 760}, 2.9);

const HouseWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = HOUSE, d = D(p);
  const lamp = r.P(0.78, 0.66, 0.3);
  return (
    <>
      <Svg><rect x={-1200} y={-1200} width={4400} height={3400} fill="#0a0705" /></Svg>
      <RFace r={r} pts={[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]} fill="#2c1e13" />
      <RFace r={r} pts={[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]} fill="#6b4a30" />
      <RFace r={r} pts={[[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]]} fill="#5f4129" />
      <RFace r={r} pts={[[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]]} fill="#5a3e28" />
      <RFace r={r} pts={[[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]} fill="#7a5638" />
      <Svg>{Array.from({length: 14}, (_, i) => { const a = r.P(i / 14, 0, 0), b = r.P(i / 14, 1, 0); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4a3220" strokeWidth={3} />; })}</Svg>
      <Svg>{Array.from({length: 9}, (_, i) => { const a = r.P(i / 9, 1, 0), b = r.P(i / 9, 1, 1); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#3a2818" strokeWidth={3} />; })}</Svg>
      {/* window on the back wall: the rails and the hut's lit window beyond, rain on the glass */}
      <RFace r={r} pts={[[0.14, 0.2, 0], [0.42, 0.2, 0], [0.42, 0.52, 0], [0.14, 0.52, 0]]} fill="#0c1018" stroke="#3a2818" sw={9} />
      {(() => { const q = r.P(0.34, 0.38, 0); return <><Svg><rect x={q.x - 14} y={q.y - 8} width={28} height={16} fill="#ffd27a" /></Svg><Pool x={q.x} y={q.y} rx={50} color="255,200,120" a={0.6} /></>; })()}
      {/* calendar, a school bag on a nail, a mosquito net rolled up */}
      <RFace r={r} pts={[[0.56, 0.22, 0], [0.68, 0.22, 0], [0.68, 0.42, 0], [0.56, 0.42, 0]]} fill="#e2d8c0" />
      <RFace r={r} pts={[[0.56, 0.22, 0], [0.68, 0.22, 0], [0.68, 0.26, 0], [0.56, 0.26, 0]]} fill={C.red} />
      <RFace r={r} pts={[[0.78, 0.3, 0], [0.88, 0.3, 0], [0.88, 0.48, 0], [0.78, 0.48, 0]]} fill="#3a5a8a" />
      {/* the mattress on the floor, a low table with crayons */}
      <RBox r={r} u={[0.1, 0.56]} v={[0.94, 1]} w={[0.36, 0.7]} front="#cbbfa4" top="#e4dac2" side="#a99c80" />
      <RFace r={r} pts={[[0.12, 0.94, 0.38], [0.24, 0.94, 0.38], [0.24, 0.94, 0.48], [0.12, 0.94, 0.48]]} fill="#f3eee2" />
      <RBox r={r} u={[0.62, 0.86]} v={[0.88, 1]} w={[0.44, 0.62]} front="#4a3020" top="#6b4a30" side="#3a2416" />
      <Svg>{Array.from({length: 6}, (_, i) => { const q = r.P(0.66 + i * 0.03, 0.88, 0.52); return <rect key={i} x={q.x} y={q.y - 4} width={22} height={8} fill={['#d2342c', '#3a8ad0', '#f2c230', '#5b9a52', '#8a4ad0', '#e07a2a'][i]} />; })}</Svg>
      {/* the oil lamp on the table */}
      <Svg><rect x={lamp.x - 14} y={lamp.y - 50} width={28} height={50} rx={6} fill="#cfd8d8" opacity={0.7} /><ellipse cx={lamp.x} cy={lamp.y - 36} rx={7} ry={14} fill="#ffd890" /></Svg>
      <LightVeil id="hou" lights={[[lamp.x, lamp.y - 40, 620]]} o={0.5} color="#060403" />
      <Pool x={lamp.x} y={lamp.y - 40} rx={520} color="255,190,110" a={0.75 * flicker(p.f, 5, 0.08)} />
      {d.rain !== false && <RainStreaks f={p.f} a={0.15} />}
    </>
  );
};

const House: ShotComponent = p => <Shot p={p} world={<><Soft p={p}><HouseWorld p={p} /></Soft><Actors p={p} /></>} />;

/** the storm by the siding, 2542: the house's window lit at the end of the rails, torches, the red signal */
const StormWorld: React.FC<{p: ShotProps; crash?: number}> = ({p, crash = 0}) => {
  const d = D(p), v = p.shot.view ?? '';
  const high = v.endsWith('-high');
  const hy = high ? 260 : 470;
  const torches = d.torches !== false;
  return (
    <>
      <Svg>
        <rect x={-1200} y={-1200} width={4400} height={3400} fill="#0c1018" />
        <rect x={-1200} y={hy - 140} width={4400} height={200} fill="#3e4652" opacity={0.6} />
        <path d={`M-1200 ${hy} L3200 ${hy} L3200 2200 L-1200 2200 Z`} fill="#221e18" />
        <path d={`M-400 1300 L900 ${hy} L1000 ${hy} L1900 1300 Z`} fill={C.ballast} />
        {[-1, 1].map(s => <path key={s} d={`M${950 + s * 14} ${hy} L${750 + s * 420} 1300`} stroke="#b8c2ca" strokeWidth={10} />)}
        {Array.from({length: 18}, (_, i) => { const t = Math.pow(i / 18, 1.8); const y = hy + t * 830, w = 40 + t * 1300; return <rect key={i} x={950 - w / 2 - t * 200} y={y} width={w} height={5 + t * 26} fill="#2a241e" />; })}
        {/* the house at the end of the siding */}
        {crash < 1 && <g transform={`translate(1260 ${hy - 150})`}><rect x={0} y={40} width={300} height={170} fill="#4a3424" /><path d="M-20 50 L150 -20 L320 50 Z" fill="#2a1d12" /><rect x={110} y={90} width={70} height={60} fill="#ffcf7a" /></g>}
        {crash >= 1 && <g transform={`translate(1260 ${hy - 150})`}>{Array.from({length: 18}, (_, i) => <rect key={i} x={rnd(201, i) * 340 - 20} y={60 + rnd(202, i) * 160} width={60 + rnd(203, i) * 120} height={14} fill="#3a2818" transform={`rotate(${rnd(204, i) * 120 - 60} ${150} ${150})`} />)}</g>}
        <line x1={600} y1={hy + 320} x2={600} y2={hy - 60} stroke="#1a1a1a" strokeWidth={10} />
        <circle cx={600} cy={hy - 60} r={16} fill="#ff2a1a" />
      </Svg>
      <Pool x={600} y={hy - 60} rx={120} color="255,60,40" a={0.5} />
      {crash < 1 && <Pool x={1405} y={hy - 30} rx={140} color="255,200,120" a={0.6} />}
      {crash >= 1 && <Pool x={1400} y={hy} rx={420} color="255,140,60" a={0.5 * flicker(p.f, 11, 0.4)} />}
      {torches && [[420, 0.2], [760, 1.1], [1640, 2.3]].map(([x, s], i) => { const a = Math.sin(p.f / 9 + (s as number)) * 40; return <React.Fragment key={i}><Pool x={(x as number) + a} y={hy + 120} rx={22} color="255,244,204" a={0.95} /><Pool x={(x as number) - 60 + a} y={hy + 470} rx={200} ry={60} color="255,244,204" a={0.35} /></React.Fragment>; })}
      {d.tail && <><Pool x={930} y={hy + 30} rx={110} color="255,40,30" a={1} /><Pool x={990} y={hy + 30} rx={110} color="255,40,30" a={1} /><Svg><rect x={900} y={hy - 40} width={120} height={80} fill="#1a1d22" /><circle cx={925} cy={hy + 25} r={12} fill="#ff4a3a" /><circle cx={995} cy={hy + 25} r={12} fill="#ff4a3a" /></Svg></>}
      {d.coatPile && <Svg><path d={`M${d.coatPile[0] - 160} ${d.coatPile[1]} q160 -110 320 0 q-10 40 -160 46 q-150 -6 -160 -46 Z`} fill={C.coat} /><path d={`M${d.coatPile[0] - 120} ${d.coatPile[1] - 20} q120 -60 240 0`} stroke={C.coatD} strokeWidth={8} fill="none" /></Svg>}
      {d.bow && <Svg><path d={`M880 ${hy + 470} q-40 -30 -60 0 q20 30 60 0 q40 -30 60 0 q-20 30 -60 0 Z`} fill="#d2342c" /><ellipse cx={880} cy={hy + 490} rx={180} ry={26} fill="#7a90a0" opacity={0.3} /></Svg>}
      <RainStreaks f={p.f} a={1} />
    </>
  );
};

const Storm: ShotComponent = p => <Shot p={p} world={<><Soft p={p}><StormWorld p={p} crash={D(p).crashed ? 1 : 0} /></Soft><Actors p={p} /></>} />;

const Freight: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#030405" at={[50, 46]} vig={0.8} inner={30} z={1.04} past>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#05060a" />
        <path d="M-40 470 L1960 470 L1960 1120 L-40 1120 Z" fill="#16140f" />
        <path d="M200 1120 L900 470 L1000 470 L1500 1120 Z" fill={C.ballast} />
        <path d="M940 470 L1540 900 L1700 900" stroke={C.rail} strokeWidth={10} fill="none" />
        <path d="M960 470 L1500 1120 M920 470 L320 1120" stroke={C.rail} strokeWidth={10} />
        <g transform="translate(1600 760)"><rect x={0} y={40} width={300} height={170} fill="#4a3424" /><path d="M-20 50 L150 -20 L320 50 Z" fill="#2a1d12" /><rect x={110} y={90} width={70} height={60} fill="#ffcf7a" /></g>
        <rect x={1540} y={860} width={60} height={50} fill="#8a2a24" />
        <g transform={`translate(${940 + k * 300} ${470 + k * 220}) scale(${0.2 + k * 0.9})`}><rect x={-200} y={-260} width={400} height={300} fill="#1e2228" /><circle cx={0} cy={-150} r={60} fill="#fff6d0" /></g>
      </Svg>
      <Pool x={940 + k * 300} y={470 + k * 220 - (0.2 + k * 0.9) * 150} rx={200 + k * 400} color={C.head} a={0.9} />
      <Pool x={1745} y={880} rx={100} color="255,200,120" a={0.6} />
      <RainStreaks f={p.f} a={1} />
    </Macro>
  );
};

const Crash: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  const flash = Math.max(0, 1 - k * 3);
  return (
    <Macro p={p} bg="#030303" at={[50, 50]} vig={0.7} inner={30} z={1.08} past>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#0c0a08" />
        <path d={`M200 900 L1700 900 L1700 1120 L200 1120 Z`} fill="#16140f" />
        <rect x={180} y={300} width={760} height={560} fill="#1e2228" transform={`translate(${k * 200} 0)`} />
        <circle cx={300 + k * 200} cy={420} r={50} fill="#fff6d0" />
        {Array.from({length: 40}, (_, i) => <rect key={i} x={960 + rnd(211, i) * 200 + k * rnd(212, i) * 700} y={360 + rnd(213, i) * 400 - k * rnd(214, i) * 300} width={30 + rnd(215, i) * 120} height={12} fill="#4a3424" transform={`rotate(${rnd(216, i) * 360 * k} ${1100} ${600})`} />)}
      </Svg>
      <div style={{position: 'absolute', inset: 0, background: `rgba(255,248,230,${flash * 0.9})`}} />
      <Pool x={1100} y={600} rx={700} color="255,170,90" a={0.5} />
      <RainStreaks f={p.f} a={0.8} />
    </Macro>
  );
};

const BOW: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#030404" at={[50, 52]} vig={0.85} inner={26} z={1.05} past>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1160} fill="#1c1a16" />
      {Array.from({length: 6}, (_, i) => <rect key={i} x={-40} y={140 + i * 170} width={2000} height={60} fill="#3a2e22" />)}
      <rect x={-40} y={600} width={2000} height={26} fill={C.rail} />
      <ellipse cx={960} cy={760} rx={560} ry={110} fill="#5a6c78" opacity={0.5} />
      <path d="M960 740 q-120 -90 -180 0 q60 90 180 0 q120 -90 180 0 q-60 90 -180 0 Z" fill="#d2342c" />
      <circle cx={960} cy={740} r={26} fill="#a3221c" />
      {Array.from({length: 8}, (_, i) => <ellipse key={i} cx={760 + i * 60} cy={760 + Math.sin(p.f / 4 + i) * 6} rx={30} ry={5} fill="#cfe0ea" opacity={0.3} />)}
    </Svg>
    {[300, 1500].map((x, i) => { const a = Math.sin(p.f / 8 + i) * 80; return <Svg key={x}><path d={`M${x} -40 L${x - 200 + a} 900 L${x + 200 + a} 900 Z`} fill="#fff4cc" opacity={0.1} /></Svg>; })}
    <RainStreaks f={p.f} a={1} />
  </Macro>
);

const STORM_VIEWS = new Set(['bow-storm-wide', 'raincoat-sil', 'raincoat-sil2', 'raincoat-sil3', 'track-high', 'taillights-ew', 'flash-cut', 'raincoat-cover', 'raincoat-close']);
const OFFICE_VIEWS = new Set(['office-2560', 'record-dawn']);
const BOX_VIEWS = new Set(['box-1999-wide', 'sommai35-bottle-close', 'sleep-high']);

const Past: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'bow-puddle-ins') return <BOW p={p} />;
  if (v === 'freight-ew') return <Freight p={p} />;
  if (v === 'crash') return <Crash p={p} />;
  if (OFFICE_VIEWS.has(v)) return OFFICE_SCENES.office(p);
  if (BOX_VIEWS.has(v)) return BOX_SCENES.box(p);
  if (v === 'locker-lock') return PLATFORM_SCENES.platform(p);
  if (STORM_VIEWS.has(v)) return Storm(p);
  return House(p);
};

export const PAST_SCENES: Record<string, ShotComponent> = {past: Past};
