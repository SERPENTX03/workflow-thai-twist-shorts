import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {D, K, Macro, Pool, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {FaceEcu} from '../../kit/ecu';
import {Pov} from '../../kit/pov';
import {IvStand} from '../../kit/props';
import {LightVeil, RBox, RFace, RoomShell, makeRoom, roomPxPerCm, type Room} from '../../kit/room';
import {roomAt} from '../../kit/seating';
import {Gurney, GurneyTilt, gurneyPatient} from '../../kit/gurney';
import {Actors, C, ROSTER, Shot} from './cast';

// วอร์ดชั้น 4 ตึกเมตตา (brief.md → Sets): one room in perspective, seen from three heights.
//   back wall   bed 1 (left, head to the left, ventilator at its head, monitor on the wall), the window, bed 2 (right) in its curtain
//   left wall   the old fridge in the far corner, the frosted glass ward door (corridor light behind it)
//   right wall  the old pharmacy door far, the fire exit (green EXIT) near
//   near left   the nurse counter with the one gooseneck lamp: the warm light of every night shot
// data: lamp ('on' default | 'off') · curtain ('closed' default | 'open' | 'rip' | 'tied') · power ('on' | 'off') ·
//       time ('night' default | 'day' | 'dawn') · bed1 ('patient' default | 'empty' | 'gone') · bin ('full' | 'spilled')

export const WARD = makeRoom({x: 900, y: 430}, {x0: 300, x1: 1560, y0: 190, y1: 700}, 3.2);
export const WARD_HI = makeRoom({x: 900, y: 120}, {x0: 330, x1: 1530, y0: 250, y1: 660}, 3.0);
export const WARD_LO = makeRoom({x: 900, y: 860}, {x0: 300, x1: 1560, y0: 110, y1: 880}, 3.2);
const ROOMS: Record<string, Room> = {eye: WARD, high: WARD_HI, low: WARD_LO};

const WALL = '#8fa294', WALL_LO = '#5d786a', SIDE = '#7b8d80', FLOOR = '#6c706b';
const CURT = '#b7c4c6', CURT_D = '#8d9b9e';

const st = (p: ShotProps) => {
  const d = D(p);
  return {
    lamp: d.lamp !== 'off' && d.power !== 'off',
    curtain: (d.curtain ?? 'closed') as string,
    power: d.power !== 'off',
    time: (d.time ?? (d.light === 'day' ? 'day' : d.light === 'dawn' ? 'dawn' : 'night')) as string,
    bed1: (d.bed1 ?? 'patient') as string,
    bin: (d.bin ?? 'full') as string,
  };
};

/** the light sources of a frame, in world px, for the veil and the pools */
export const wardLights = (r: Room, p: ShotProps) => {
  const s = st(p);
  const L: [number, number, number][] = [];
  const lamp = r.P(0.12, 0.6, 0.86), mon = r.P(0.1, 0.43, 0.02), door = r.P(0, 0.45, 0.35), win = r.P(0.5, 0.4, 0);
  if (s.time === 'day') return [[win.x, win.y + 120, 900], [door.x + 100, door.y, 420]] as [number, number, number][];
  if (s.time === 'dawn') L.push([win.x, win.y + 80, 600]);
  if (s.lamp) L.push([lamp.x + 60, lamp.y + 40, 520 * r.s(0.86) / 2]);
  if (s.power) { L.push([mon.x, mon.y + 60, 260]); L.push([door.x, door.y, 300 * r.s(0.35) / 1.5]); }
  L.push([win.x, win.y, 260]);
  return L;
};

const Curtain: React.FC<{r: Room; mode: string; f: number}> = ({r, mode, f}) => {
  const folds = (u0: number, u1: number, w: number, n: number) => Array.from({length: n}, (_, i) => {
    const u = u0 + ((u1 - u0) * (i + 0.5)) / n;
    const a = r.P(u, 0.08, w), b = r.P(u, 0.94, w);
    return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={CURT_D} strokeWidth={6 * r.s(w)} opacity={0.55} />;
  });
  const rail = (() => { const a = r.P(0.555, 0.07, 0.12), b = r.P(0.555, 0.07, 0.6), c = r.P(0.975, 0.07, 0.6); return <path d={`M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y}`} stroke="#9aa2a4" strokeWidth={5} fill="none" />; })();
  if (mode === 'closed') {
    const led = r.P(0.765, 0.6, 0.6), on = true, pulse = 0.6 + 0.4 * Math.abs(Math.sin(f / 9));
    const HEM = 0.86, k6 = r.s(0.6);
    // scalloped hem along the front, the bed's wheels showing under it; a mesh band under the rail; the bed plate
    const hem = (() => {
      const n = 9, pts: string[] = [];
      for (let i = 0; i <= n; i++) { const a = r.P(0.555 + (0.42 * i) / n, HEM, 0.6); pts.push(`${i ? 'Q' + (a.x - (r.P(0.555 + 0.42 / n, HEM, 0.6).x - r.P(0.555, HEM, 0.6).x) / 2).toFixed(1) + ' ' + (a.y + 16 * k6).toFixed(1) + ' ' : 'M'}${a.x.toFixed(1)} ${a.y.toFixed(1)}`); }
      return pts.join(' ');
    })();
    const plate = r.P(0.62, 0.3, 0.6);
    return (
      <>
        <Svg>{rail}{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => { const q = r.P(0.555 + 0.042 * i, 0.075, 0.6); return <circle key={i} cx={q.x} cy={q.y} r={4 * k6} fill="#c9cfd1" />; })}</Svg>
        <RFace r={r} pts={[[0.555, 0.08, 0.12], [0.555, 0.08, 0.6], [0.555, HEM, 0.6], [0.555, HEM, 0.12]]} fill={CURT_D} />
        <RFace r={r} pts={[[0.555, 0.08, 0.6], [0.975, 0.08, 0.6], [0.975, HEM, 0.6], [0.555, HEM, 0.6]]} fill={CURT} />
        <RFace r={r} pts={[[0.555, 0.08, 0.6], [0.975, 0.08, 0.6], [0.975, 0.17, 0.6], [0.555, 0.17, 0.6]]} fill="#dfe6e7" o={0.85} />
        <Svg>
          <path d={`${hem} L${r.P(0.975, HEM - 0.02, 0.6).x} ${r.P(0.975, HEM - 0.02, 0.6).y} L${r.P(0.555, HEM - 0.02, 0.6).x} ${r.P(0.555, HEM - 0.02, 0.6).y} Z`} fill={CURT} />
          <path d={hem} stroke={CURT_D} strokeWidth={4} fill="none" />
          {Array.from({length: 22}, (_, i) => { const a = r.P(0.555 + 0.42 * i / 21, 0.08, 0.6), b = r.P(0.555 + 0.42 * i / 21, 0.17, 0.6); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#9aa6a8" strokeWidth={1.5} opacity={0.6} />; })}
          {[0.11, 0.14].map(v => { const a = r.P(0.555, v, 0.6), b = r.P(0.975, v, 0.6); return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#9aa6a8" strokeWidth={1.5} opacity={0.6} />; })}
          <rect x={plate.x - 46 * k6} y={plate.y - 24 * k6} width={92 * k6} height={48 * k6} rx={5 * k6} fill="#f2f0e6" stroke="#4a4f4d" strokeWidth={2} />
          <text x={plate.x} y={plate.y + 11 * k6} textAnchor="middle" fontFamily="Kanit" fontWeight={700} fontSize={30 * k6} fill="#2a2e2d">เตียง 2</text>
        </Svg>
        <Svg>{folds(0.555, 0.975, 0.6, 9).map((l, i) => React.cloneElement(l, {y1: r.P(0.555, 0.17, 0.6).y, y2: r.P(0.555, HEM, 0.6).y}))}
          {/* faint grid weave and the stamp on the hem (only readable up close, in the clip at the reveal) */}
          {[0.3, 0.5, 0.7].map(v => { const a = r.P(0.555, v, 0.6), b = r.P(0.975, v, 0.6); return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={CURT_D} strokeWidth={2} opacity={0.35} />; })}
          {(() => { const q = r.P(0.9, 0.88, 0.6); return <rect x={q.x - 26 * r.s(0.6)} y={q.y - 8 * r.s(0.6)} width={52 * r.s(0.6)} height={16 * r.s(0.6)} fill="none" stroke="#6f6a8c" strokeWidth={2} opacity={0.5} />; })()}
          {/* the seam where the two curtains meet, and the red dot behind it */}
          {(() => { const a = r.P(0.765, 0.08, 0.6), b = r.P(0.765, HEM, 0.6); return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2b3133" strokeWidth={4 * r.s(0.6)} opacity={0.8} />; })()}
          {on && <><circle cx={led.x} cy={led.y} r={30 * r.s(0.6)} fill="#ff2a1f" opacity={0.3 * pulse} /><circle cx={led.x} cy={led.y} r={7 * r.s(0.6)} fill="#ff3a2a" opacity={0.5 + 0.5 * pulse} /></>}
        </Svg>
      </>
    );
  }
  // open: the curtain bunched at the right end of its rail; 'rip' = still swinging
  const swing = mode === 'rip' ? kf(f, [[0, 0.62], [10, 0.95]]) : 0.95;
  return (
    <>
      <Svg>{rail}</Svg>
      <RFace r={r} pts={[[swing - 0.04, 0.08, 0.6], [0.975, 0.08, 0.6], [0.975, 0.95, 0.6], [swing - 0.06, 0.95, 0.6]]} fill={CURT} />
      <Svg>{folds(swing - 0.04, 0.975, 0.6, 4)}</Svg>
      <RFace r={r} pts={[[0.975, 0.08, 0.52], [0.975, 0.08, 0.6], [0.975, 0.95, 0.6], [0.975, 0.95, 0.52]]} fill={CURT_D} />
    </>
  );
};

const Bed: React.FC<{r: Room; u: number; sheet: string}> = ({r, u, sheet}) => (
  <>
    <RBox r={r} u={[u - 0.01, u + 0.008]} v={[0.66, 1]} w={[0.32, 0.52]} front="#c3c9c6" side="#8f9693" />
    {[[u + 0.01, 0.34], [u + 0.29, 0.34], [u + 0.01, 0.5], [u + 0.29, 0.5]].map(([uu, ww], i) => <RBox key={i} r={r} u={[uu, uu + 0.008]} v={[0.9, 1]} w={[ww, ww + 0.012]} front="#7e8582" />)}
    <RBox r={r} u={[u, u + 0.3]} v={[0.86, 0.9]} w={[0.32, 0.52]} front="#9aa19e" top="#b4bbb8" />
    <RBox r={r} u={[u, u + 0.3]} v={[0.81, 0.86]} w={[0.32, 0.52]} front={sheet} top={sheet} side="#c9ced0" />
    <RBox r={r} u={[u + 0.012, u + 0.07]} v={[0.78, 0.81]} w={[0.35, 0.49]} front="#f3f4f2" top="#fbfbf9" />
  </>
);

/** the nurse counter in the near left, the gooseneck lamp, the log book. `shade` darkens it when it is drawn after the
 *  light veil (someone sits behind it and it has to cover them) */
export const COUNTER = {u: [-0.12, 0.22] as [number, number], w: [0.78, 0.97] as [number, number], v: 0.64};
const WardCounter: React.FC<{r: Room; shade?: number; lamp?: boolean}> = ({r, shade = 0, lamp = true}) => (
  <>
    <RBox r={r} u={COUNTER.u} v={[COUNTER.v, 1]} w={COUNTER.w} front="#a98a63" top="#c8ad85" side="#7d6446" />
    <RFace r={r} pts={[[0.02, 0.638, 0.86], [0.12, 0.638, 0.86], [0.12, 0.638, 0.92], [0.02, 0.638, 0.92]]} fill="#f1ede1" />
    {shade > 0 && <>
      <RFace r={r} pts={[[COUNTER.u[0], COUNTER.v, COUNTER.w[1]], [COUNTER.u[1], COUNTER.v, COUNTER.w[1]], [COUNTER.u[1], 1, COUNTER.w[1]], [COUNTER.u[0], 1, COUNTER.w[1]]]} fill="#05070b" o={shade} />
      <RFace r={r} pts={[[COUNTER.u[1], COUNTER.v, COUNTER.w[0]], [COUNTER.u[1], COUNTER.v, COUNTER.w[1]], [COUNTER.u[1], 1, COUNTER.w[1]], [COUNTER.u[1], 1, COUNTER.w[0]]]} fill="#05070b" o={shade * 1.1} />
    </>}
    <Svg>{(() => { const b = r.P(0.17, 0.64, 0.88), k = r.s(0.88); return <><path d={`M${b.x} ${b.y} q${-10 * k} ${-60 * k} ${-50 * k} ${-80 * k}`} stroke="#2a2a2a" strokeWidth={5 * k} fill="none" /><path d={`M${b.x - 70 * k} ${b.y - 96 * k} l${30 * k} ${-6 * k} l${10 * k} ${26 * k} l${-44 * k} ${8 * k} Z`} fill="#3a3a38" /></>; })()}</Svg>
    {lamp && shade > 0 && (() => { const q = r.P(0.12, 0.6, 0.86); return <Pool x={q.x - 40} y={q.y + 20} rx={300 * r.s(0.86) / 2} color="255,214,150" a={0.35} />; })()}
  </>
);

export const WardWorld: React.FC<{p: ShotProps; r?: Room; noCounter?: boolean}> = ({p, r: rr, noCounter}) => {
  const r = rr ?? ROOMS[D(p).room ?? 'eye'] ?? WARD, s = st(p), f = p.f;
  const day = s.time === 'day', dawn = s.time === 'dawn';
  const lamp = r.P(0.12, 0.6, 0.86), mon = r.P(0.1, 0.43, 0.02);
  const winFill = day ? '#e9f1ee' : dawn ? '#8e9ec4' : '#141a2b';
  return (
    <>
      <RoomShell r={r} id="ward" wall={WALL} side={SIDE} sideFar="#86998b" floorC={FLOOR} ceiling="#4b524f" floor="tiles" walls="plain" boards={12} />
      {/* two-tone hospital paint, a dado line all round */}
      <RFace r={r} pts={[[0, 0.55, 0], [1, 0.55, 0], [1, 1, 0], [0, 1, 0]]} fill={WALL_LO} />
      <RFace r={r} pts={[[0, 0.55, 0], [0, 0.55, 1], [0, 1, 1], [0, 1, 0]]} fill="#557062" />
      <RFace r={r} pts={[[1, 0.55, 0], [1, 0.55, 1], [1, 1, 1], [1, 1, 0]]} fill="#5c776a" />
      {/* ceiling: two fluorescent tubes, lit only by day */}
      {[0.3, 0.7].map(u => <RFace key={u} r={r} pts={[[u - 0.08, 0, 0.3], [u + 0.08, 0, 0.3], [u + 0.08, 0, 0.36], [u - 0.08, 0, 0.36]]} fill={day ? '#f4f7f4' : '#6d7471'} />)}
      {/* window with old louvres, the street lamp outside */}
      <RFace r={r} pts={[[0.43, 0.2, 0], [0.57, 0.2, 0], [0.57, 0.6, 0], [0.43, 0.6, 0]]} fill={winFill} stroke="#3b4441" sw={7} />
      {[0.27, 0.34, 0.41, 0.48, 0.55].map(v => <RFace key={v} r={r} pts={[[0.43, v, 0], [0.57, v, 0], [0.57, v + 0.02, 0], [0.43, v + 0.02, 0]]} fill="#4a5450" o={0.85} />)}
      {!day && <Svg>{(() => { const q = r.P(0.53, 0.3, 0); return <circle cx={q.x} cy={q.y} r={12} fill="#ffb25c" opacity={0.9} />; })()}</Svg>}
      {/* old fridge in the far left corner, the frosted glass door on the left wall */}
      <RBox r={r} u={[0, 0.06]} v={[0.42, 1]} w={[0.04, 0.18]} front="#d7d6cd" side="#b4b3aa" top="#e3e2d9" />
      <RFace r={r} pts={[[0, 0.16, 0.26], [0, 0.16, 0.45], [0, 1, 0.45], [0, 1, 0.26]]} fill="#3c4542" stroke="#262b29" sw={6} />
      <RFace r={r} pts={[[0, 0.24, 0.28], [0, 0.24, 0.43], [0, 0.7, 0.43], [0, 0.7, 0.28]]} fill={s.power || day ? '#cfe1e6' : '#20262a'} o={0.92} />
      <RFace r={r} pts={[[0, 0.16, 0.355], [0, 0.16, 0.36], [0, 1, 0.36], [0, 1, 0.355]]} fill="#262b29" />
      {/* pharmacy door far right, fire exit near right with the green sign */}
      <RFace r={r} pts={[[1, 0.18, 0.06], [1, 0.18, 0.2], [1, 1, 0.2], [1, 1, 0.06]]} fill="#6b5a45" stroke="#2e261d" sw={5} />
      <RFace r={r} pts={[[1, 0.24, 0.09], [1, 0.24, 0.17], [1, 0.3, 0.17], [1, 0.3, 0.09]]} fill="#ece6d4" />
      <RFace r={r} pts={[[1, 0.2, 0.66], [1, 0.2, 0.86], [1, 1, 0.86], [1, 1, 0.66]]} fill="#58615d" stroke="#2c3230" sw={6} />
      <RFace r={r} pts={[[1, 0.12, 0.7], [1, 0.12, 0.82], [1, 0.18, 0.82], [1, 0.18, 0.7]]} fill={s.power || !day ? '#2fd36a' : '#4a7a5a'} />
      {/* bed 1: ventilator at its head, the monitor on the wall, an IV stand at the foot */}
      <RFace r={r} pts={[[0.06, 0.36, 0], [0.15, 0.36, 0], [0.15, 0.5, 0], [0.06, 0.5, 0]]} fill="#101614" stroke="#3a403e" sw={5} />
      {s.power && <Svg>{(() => { const a = r.P(0.07, 0.43, 0), b = r.P(0.14, 0.43, 0); const n = 18; const pts = Array.from({length: n}, (_, i) => { const x = a.x + (b.x - a.x) * i / (n - 1); const ph = (i + f * 0.6) % 9; return `${x.toFixed(1)},${(a.y - (ph < 1 ? 26 : ph < 2 ? -14 : 0)).toFixed(1)}`; }).join(' '); return <polyline points={pts} stroke="#3dff8a" strokeWidth={3} fill="none" />; })()}</Svg>}
      <RBox r={r} u={[0.005, 0.07]} v={[0.6, 1]} w={[0.36, 0.46]} front="#a7afb0" side="#808889" top="#c2c9ca" />
      <RFace r={r} pts={[[0.012, 0.64, 0.46], [0.06, 0.64, 0.46], [0.06, 0.72, 0.46], [0.012, 0.72, 0.46]]} fill={s.power ? '#123a26' : '#3a2410'} />
      {s.power && <Svg>{(() => { const q = r.P(0.036, 0.68, 0.46); return <circle cx={q.x} cy={q.y} r={6 * r.s(0.46)} fill={Math.floor(f / 75) % 2 ? '#47ff95' : '#2aa864'} />; })()}</Svg>}
      {!s.power && <Svg>{(() => { const q = r.P(0.036, 0.68, 0.46); return <circle cx={q.x} cy={q.y} r={7 * r.s(0.46)} fill={Math.floor(f / 8) % 2 ? '#ff8a1e' : '#6a3a10'} />; })()}</Svg>}
      {s.bed1 !== 'gone' && <Bed r={r} u={0.08} sheet="#e4e8e6" />}
      {/* the bed plate over bed 1, the twin of the one on bed 2's curtain */}
      <Svg>{(() => { const q = r.P(0.22, 0.34, 0); return <><rect x={q.x - 40} y={q.y - 20} width={80} height={40} rx={4} fill="#f2f0e6" stroke="#4a4f4d" strokeWidth={2} /><text x={q.x} y={q.y + 9} textAnchor="middle" fontFamily="Kanit" fontWeight={700} fontSize={25} fill="#2a2e2d">เตียง 1</text></>; })()}</Svg>
      {s.bed1 !== 'gone' && <Svg>{(() => { const a = r.P(0.07, 0.72, 0.42), b = r.P(0.12, 0.79, 0.42); return <path d={`M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${b.y + 30} ${b.x} ${b.y}`} stroke="#cfd8db" strokeWidth={9 * r.s(0.42)} fill="none" />; })()}</Svg>}
      {/* bedside table with the framed photo, the red sharps bin in front of it */}
      <RBox r={r} u={[0.4, 0.47]} v={[0.82, 1]} w={[0.36, 0.44]} front="#8a8f8c" top="#a3a8a5" side="#6c716e" />
      <RFace r={r} pts={[[0.415, 0.75, 0.4], [0.445, 0.75, 0.4], [0.445, 0.82, 0.4], [0.415, 0.82, 0.4]]} fill="#e2c35a" stroke="#51462a" sw={2} />
      <RBox r={r} u={[0.385, 0.415]} v={[0.88, 1]} w={[0.47, 0.53]} front="#c22a24" top="#e2463c" side="#8e1d18" />
      {s.bin === 'full' && <Svg>{Array.from({length: 7}, (_, i) => { const q = r.P(0.388 + rnd(71, i) * 0.024, 0.875, 0.48 + rnd(72, i) * 0.04); return <rect key={i} x={q.x - 3} y={q.y - 10 * r.s(0.5)} width={6} height={12 * r.s(0.5)} fill={i % 2 ? '#eae6dc' : '#d7442e'} />; })}</Svg>}
      {/* bed 2 behind its curtain */}
      <Bed r={r} u={0.62} sheet="#dfe3e1" />
      {(s.curtain === 'open' || s.curtain === 'rip') && <>
        {/* what was behind it: a Bluetooth speaker on the pillow, an old phone taped to the IV pole */}
        <Svg>{(() => { const q = r.P(0.665, 0.78, 0.42), k = r.s(0.42); return <><ellipse cx={q.x} cy={q.y} rx={34 * k} ry={22 * k} fill="#141416" /><circle cx={q.x + 12 * k} cy={q.y - 4 * k} r={4 * k} fill="#ff3a2a" opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 9))} /></>; })()}</Svg>
        <Svg>{(() => { const q = r.P(0.885, 0.42, 0.5), k = r.s(0.5); return <><rect x={q.x - 20 * k} y={q.y - 36 * k} width={40 * k} height={72 * k} rx={6 * k} fill="#0d0f12" /><rect x={q.x - 16 * k} y={q.y - 31 * k} width={32 * k} height={60 * k} fill="#7fb7ff" opacity={0.9} /><rect x={q.x - 24 * k} y={q.y - 6 * k} width={48 * k} height={10 * k} fill="#c9c08a" opacity={0.9} /></>; })()}</Svg>
      </>}
      <IvStand x={r.P(0.89, 1, 0.5).x} y={r.P(0.89, 1, 0.5).y} s={(r.back.y1 - r.back.y0) / 280 * r.s(0.5) / 3} />
      <IvStand x={r.P(0.36, 1, 0.53).x} y={r.P(0.36, 1, 0.53).y} s={(r.back.y1 - r.back.y0) / 280 * r.s(0.53) / 3} />
      <Curtain r={r} mode={s.curtain === 'tied' ? 'open' : s.curtain} f={f} />
      {!noCounter && <WardCounter r={r} />}
      {/* light: the lamp pool on the counter and floor, the monitor's green, the corridor through the glass */}
      {s.lamp && <RFace r={r} pts={[[-0.1, 1, 0.55], [0.32, 1, 0.55], [0.36, 1, 0.98], [-0.14, 1, 0.98]]} fill="#ffd9a0" o={0.22} blend="screen" />}
      {day && <RFace r={r} pts={[[0.4, 1, 0.05], [0.6, 1, 0.05], [0.72, 1, 0.7], [0.3, 1, 0.7]]} fill="#fff4d8" o={0.35} blend="screen" />}
      <LightVeil id="ward" lights={wardLights(r, p)} o={day ? 0.14 : dawn ? 0.42 : !s.power ? 0.86 : s.lamp ? 0.6 : 0.74} color="#05070b" />
      {s.lamp && <Pool x={lamp.x - 40} y={lamp.y + 20} rx={360 * r.s(0.86) / 2} color="255,214,150" a={0.5 * flicker(f, 7, 0.04)} />}
      {s.power && !day && <Pool x={mon.x} y={mon.y} rx={170} color="80,255,150" a={0.18} />}
      {!s.power && (s.curtain === 'open' || s.curtain === 'rip') && <Pool x={r.P(0.885, 0.42, 0.5).x} y={r.P(0.885, 0.42, 0.5).y} rx={260} color="130,180,255" a={0.55} />}
      {!s.power && <Pool x={r.P(0.036, 0.68, 0.46).x} y={r.P(0.036, 0.68, 0.46).y} rx={220} color="255,140,40" a={0.45 * (0.6 + 0.4 * Math.abs(Math.sin(f / 6)))} />}
      {day && <Pool x={r.P(0.5, 0.4, 0).x} y={r.P(0.5, 0.4, 0).y} rx={520} color="255,246,220" a={0.4} />}
      {dawn && <Pool x={r.P(0.5, 0.4, 0).x} y={r.P(0.5, 0.4, 0).y} rx={420} color="170,190,255" a={0.35} />}
    </>
  );
};

// ---------------------------------------------------------------- custom pictures

/** the frosted glass ward door seen from inside, from behind the counter: corridor light, shadows on the glass */
const GlassDoor: React.FC<{p: ShotProps; mode: string}> = ({p, mode}) => {
  const f = p.f, d = D(p);
  const dark = mode === 'dark', open = mode === 'ton' || mode === 'leave' || mode === 'phonwatch';
  const day = mode === 'leave' || d.light === 'day';
  const knock = (mode === 'knock' || mode === 'dark') ? Math.abs(Math.sin(f / (mode === 'dark' ? 2.2 : 5))) : 0;
  const glass = dark ? '#151a20' : day ? '#e4eef0' : '#bcd6de';
  const beams = dark ? [Math.sin(f / 9) * 60, Math.cos(f / 11) * 50] : [0, 0];
  return (
    <Macro p={p} bg="#040507" z={1.05} ox={960} oy={480} at={[50, 44]} vig={0.75}>
      <Svg>
        {/* the corridor wall and floor around the door, dark */}
        <rect x={0} y={0} width={1920} height={1080} fill={day ? '#5d6e66' : '#10151a'} />
        <polygon points="0,1080 1920,1080 1500,860 420,860" fill={day ? '#6a6f6b' : '#0b0e11'} />
        {/* door frame and two leaves */}
        <rect x={640} y={150} width={640} height={720} fill="#2a302e" />
        {open ? <>
          <rect x={660} y={170} width={600} height={690} fill={day ? '#f4f6f0' : '#e9f2f4'} />
          <polygon points="660,860 1260,860 1500,1080 420,1080" fill={day ? '#d8dcd4' : '#9fb2b8'} opacity={0.55} />
          <rect x={660} y={170} width={70} height={690} fill="#3a413f" />
        </> : <>
          <rect x={660} y={170} width={290} height={690} fill="#37403d" /><rect x={970} y={170} width={290} height={690} fill="#37403d" />
          <rect x={690} y={210} width={230} height={420} fill={glass} /><rect x={1000} y={210} width={230} height={420} fill={glass} />
        </>}
        {/* shadows on the glass: two people, the knuckle of one raised */}
        {(mode === 'knock' || mode === 'two') && <g opacity={0.5} style={{filter: 'blur(7px)'}}>
          <ellipse cx={820} cy={310} rx={52} ry={62} fill="#22323a" /><path d="M700 640 L712 450 Q730 395 790 388 L850 388 Q912 395 930 450 L940 640 Z" fill="#22323a" />
          <ellipse cx={1110} cy={330} rx={48} ry={58} fill="#22323a" opacity={0.75} /><path d="M1010 640 L1020 465 Q1036 412 1090 406 L1130 406 Q1186 412 1200 465 L1210 640 Z" fill="#22323a" opacity={0.75} />
          <circle cx={940 - knock * 16} cy={430} r={24} fill="#1a2a30" />
        </g>}
        {mode === 'nuan' && <g opacity={0.8}>
          <ellipse cx={1050} cy={300} rx={60} ry={70} fill="#1a2226" /><path d="M960 640 Q980 390 1050 370 Q1130 390 1150 640 Z" fill="#1a2226" />
          <path d="M1000 330 Q1050 300 1100 330 L1094 350 Q1050 336 1006 350 Z" fill="#232c30" />
          <g transform={`translate(${880} ${400 + Math.sin(f / 3) * 4})`}><rect x={-34} y={-10} width={68} height={86} rx={20} fill="#1a2226" />{[0, 1, 2, 3].map(i => <rect key={i} x={-34 + i * 18} y={-56} width={15} height={56} rx={7} fill="#1a2226" />)}</g>
        </g>}
        {dark && <>
          <defs><radialGradient id="gd-beam"><stop offset="0" stopColor="#fff6d8" stopOpacity={0.85} /><stop offset="0.4" stopColor="#fff0c8" stopOpacity={0.35} /><stop offset="1" stopColor="#fff0c8" stopOpacity={0} /></radialGradient></defs>
          {/* two people with torches behind the frosted glass: the beams bloom on the glass, their bodies dark against them */}
          {[[810 + beams[0], 470], [1110 + beams[1], 500]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={200} ry={170} fill="url(#gd-beam)" />)}
          <g opacity={0.55} style={{filter: 'blur(8px)'}}><ellipse cx={820} cy={300} rx={52} ry={62} fill="#05080a" /><path d="M700 640 L712 440 Q730 380 790 374 L850 374 Q912 380 930 440 L940 640 Z" fill="#05080a" />
            <ellipse cx={1110} cy={330} rx={48} ry={58} fill="#05080a" /><path d="M1010 640 L1020 460 Q1036 408 1090 402 L1130 402 Q1186 408 1200 460 L1210 640 Z" fill="#05080a" /></g>
          <circle cx={930 - knock * 16} cy={430} r={26} fill="#05080a" opacity={0.7} /></>}
        {mode === 'ton' && <g><ellipse cx={980} cy={320} rx={56} ry={66} fill="#07090b" /><path d="M880 860 L900 420 Q980 380 1060 420 L1080 860 Z" fill="#07090b" /><path d="M1060 520 L1100 600" stroke="#ffe9a8" strokeWidth={10} /><circle cx={1110} cy={612} r={20} fill="#fff1c0" /></g>}
        {mode === 'leave' && <g opacity={0.5}><ellipse cx={1010} cy={420} rx={22} ry={26} fill="#3a3a40" /><rect x={990} y={446} width={40} height={130} rx={12} fill="#3a3a40" /><ellipse cx={1080} cy={430} rx={20} ry={24} fill="#23232a" /><rect x={1062} y={454} width={36} height={120} rx={10} fill="#23232a" /></g>}
        {/* the door handles */}
        {!open && <><rect x={930} y={500} width={14} height={90} rx={6} fill="#9aa3a5" /><rect x={976} y={500} width={14} height={90} rx={6} fill="#9aa3a5" /></>}
        {/* foreground: the counter edge and the lamp's arm, out of focus, frame the door */}
        <g style={{filter: 'blur(6px)'}}>
          <rect x={-40} y={880} width={2000} height={240} fill={dark ? '#050505' : '#2a1f14'} />
          {!dark && <rect x={-40} y={872} width={2000} height={14} fill="#5a4630" />}
          <rect x={-60} y={-20} width={240} height={1120} fill="#06080a" opacity={0.9} />
        </g>
        {!dark && !day && <rect x={0} y={872} width={1920} height={10} fill="#ffc77a" opacity={0.4} />}
      </Svg>
      {!day && !dark && <Pool x={960} y={420} rx={420} color="190,225,235" a={0.18} />}
    </Macro>
  );
};

/** ECU of the curtain edge in a gloved hand, the red dot through the seam */
const CurtainHand: React.FC<{p: ShotProps}> = ({p}) => {
  const f = p.f, pulse = 0.6 + 0.4 * Math.abs(Math.sin(f / 9));
  const pull = kf(f, [[0, 0], [p.len, 18]]);
  return (
    <Macro p={p} bg="#08090b" z={1.07} ox={1100} oy={460} at={[40, 44]} vig={0.82}>
      <Svg>
        <defs><linearGradient id="ch-fold" x1="0" x2="1"><stop offset="0" stopColor="#4c5659" /><stop offset=".5" stopColor="#77848a" /><stop offset="1" stopColor="#434c4f" /></linearGradient></defs>
        {Array.from({length: 7}, (_, i) => <rect key={i} x={-40 + i * 190 + (i >= 6 ? pull : 0)} y={-20} width={200} height={1140} fill="url(#ch-fold)" />)}
        {[200, 420, 640, 860].map(y => <line key={y} x1={0} y1={y} x2={1180} y2={y} stroke="#3c4548" strokeWidth={3} opacity={0.5} />)}
        {/* the seam: the curtain edge in her hand, the dark gap behind it, the red dot inside */}
        <rect x={1180 + pull} y={-20} width={900} height={1140} fill="#050607" />
        <path d={`M${1180 + pull} -20 Q${1200 + pull} 540 ${1180 + pull} 1100`} stroke="#8e9b9f" strokeWidth={10} fill="none" />
        <circle cx={1560} cy={300} r={130} fill="#ff2a1f" opacity={0.25 * pulse} /><circle cx={1560} cy={300} r={18} fill="#ff4030" opacity={0.6 + 0.4 * pulse} />
      </Svg>
      <Hand x={1130 + pull} y={520} s={1.6} rot={8} skin="#dfe7ee" sleeve={C.white} mode="grip" />
      <Pool x={260} y={420} rx={760} color="255,206,140" a={0.38} />
    </Macro>
  );
};

/** view through the seam of the curtain: the hidden lens' picture (not named until chapter 6) */
const Seam: React.FC<{p: ShotProps; inner: React.ReactNode; open?: number}> = ({p, inner, open = 0.55}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <Pov kind="crack" W={1920} H={1080} f={p.f} open={open} sway={0} id={`seam${p.shot.i}`}>{inner}</Pov>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="none" />{[0, 1].map(i => <rect key={i} x={i ? 1290 : 0} y={0} width={630} height={1080} fill="#4a5658" opacity={0.0} />)}</Svg>
  </div>
);

/** big face of the patient: tape on the eyes or the eyes open (FaceEcu on his own sprite), the trach tube at the neck */
const PatientEcu: React.FC<{p: ShotProps; part: 'face' | 'eyes' | 'eye-r'; taped?: number; who: string; tears?: boolean; glint?: string}> = ({p, part, taped = 0, who, tears, glint}) => {
  const f = p.f;
  const fill = part === 'face' ? 0.62 : part === 'eyes' ? 0.95 : 0.9;
  const at: [number, number] = part === 'face' ? [0.5, 0.42] : [0.5, 0.44];
  const span = part === 'face' ? 175 : part === 'eyes' ? 120 : 56;
  const u = (1920 * fill) / span;
  const cx = part === 'eye-r' ? 123 : 100, cy = part === 'face' ? 80 : part === 'eyes' ? 66 : 70;
  const X = (sx: number) => 1920 * at[0] + (sx - cx) * u, Y = (sy: number) => 1080 * at[1] + (sy - cy) * u;
  const lift = taped ? Math.max(0, Math.sin(f / 4)) * taped : 0;
  return (
    <Macro p={p} bg="#0a0c0c" z={1.05} ox={960} oy={460} at={[50, 44]} vig={0.6}>
      <FaceEcu who={who + ' acc=none'} roster={ROSTER} f={f} len={p.len} part={part} fill={fill} at={at} shade="l" shadeA={0.45}
        glint={glint ? (rr => <text x={0} y={rr * 0.35} textAnchor="middle" fontSize={rr * 1.1} fill="#f6efd8" opacity={0.85} fontFamily="Kanit">{glint}</text>) : undefined}
        back={<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #e8ece9 0%, #9aa3a0 45%, #2a302e 100%)'}} />} bg="#1a1e1d" />
      <Svg>
        {taped > 0 && [77, 123].map(ex => <g key={ex} transform={`translate(${X(ex)} ${Y(74) - lift * u * 1.5}) rotate(${ex < 100 ? -6 : 6})`}><rect x={-15 * u} y={-6 * u} width={30 * u} height={12 * u} rx={2 * u} fill="#f4f2ea" opacity={0.96} /><rect x={-15 * u} y={-6 * u} width={30 * u} height={12 * u} rx={2 * u} fill="none" stroke="#c9c5b8" strokeWidth={0.6 * u} /></g>)}
        {tears && <path d={`M${X(130)} ${Y(80)} q${4 * u} ${12 * u} ${2 * u} ${24 * u + kf(f, [[0, 0], [p.len, 10]]) * u}`} stroke="#cfe8f6" strokeWidth={2.4 * u} fill="none" opacity={0.85} />}
        {part === 'face' && <g><rect x={X(84)} y={Y(150)} width={32 * u} height={14 * u} rx={4 * u} fill="#e4ecef" stroke="#9aa6aa" strokeWidth={u} /><path d={`M${X(116)} ${Y(157)} q${40 * u} ${10 * u} ${70 * u} ${-20 * u}`} stroke="#d4dee2" strokeWidth={6 * u} fill="none" /></g>}
      </Svg>
      <Pool x={1500} y={300} rx={700} color={D(p).light === 'day' ? '255,246,220' : '255,214,150'} a={0.25} />
    </Macro>
  );
};

/** under the counter: May crouched in the dark, the corridor light a cold strip on the floor */
const UnderCounter: React.FC<{p: ShotProps; close?: boolean}> = ({p, close}) => {
  const d = D(p);
  return (
    <Shot p={{...p, shot: {...p.shot, data: {...d, cam: d.cam ?? (close ? [3.1, 3.2, 980, 470] : [1, 1.05, 960, 540])}}}} world={<>
      <Svg>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#0d0b09" />
        <polygon points="-200,900 2200,900 2200,1300 -200,1300" fill="#2a2620" />
        <polygon points="1100,900 1500,900 2200,1300 1400,1300" fill="#bcd6de" opacity={0.35} />
        <rect x={-200} y={140} width={2400} height={60} fill="#5a4630" />
        <rect x={1460} y={180} width={60} height={760} fill="#3a2d1f" />
        <rect x={180} y={180} width={60} height={760} fill="#3a2d1f" />
      </Svg>
      <Actors p={p} />
      {close && <Pool x={1000} y={560} rx={260} color="150,200,255" a={0.3} />}
    </>} />
  );
};

/** Bed 1 on the move, the patient on it (CLAUDE.md rule 18: he goes where the bed goes). data.gurney =
 *  {x0, x1, y, s, tilt, dir, bag}: the bed rolls x0 → x1 across the shot on floor line y (on a ramp, tilt° tips it and
 *  the floor with it). The cast's `lie` entry is the patient (placed on the mattress); the next one is the nurse at the
 *  head end, pushing and squeezing the bag; anyone else keeps their own place. */
export const RollingBed: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p), G = d.gurney as {x0: number; x1?: number; y: number; s?: number; tilt?: number; dir?: 1 | -1; bag?: boolean; push?: boolean};
  const t = kf(p.f, [[0, 0], [p.len, 1]]);
  const s = G.s ?? 1, dir = G.dir ?? 1, tilt = G.tilt ?? 0;
  const g = {x: G.x0 + ((G.x1 ?? G.x0) - G.x0) * t, y: G.y, s, tilt, dir};
  const cast = (d.cast ?? []) as string[];
  const lieAt = cast.findIndex(c => /\blie\b/.test(c));
  const rest = (c: string) => c.trim().split(/\s+/).slice(1).filter(k => !/^(h=|lie$|flip$)/.test(k)).join(' ');
  const patient = lieAt >= 0 ? gurneyPatient(g, cast[lieAt].split('@')[0], rest(cast[lieAt])) : undefined;
  const others = cast.filter((_, i) => i !== lieAt);
  const pusher = G.push === false ? undefined : others[0];
  const px = g.x - dir * (210 * s + 40 * s), py = g.y + Math.tan((tilt * Math.PI) / 180) * (px - g.x);
  const pushed = pusher ? [`${pusher.split('@')[0]}@${px.toFixed(0)},${py.toFixed(0)} ${pusher.trim().split(/\s+/).slice(1).join(' ')}`] : [];
  const q = {...p, shot: {...p.shot, data: {...d, move: undefined, cast: []}}};
  const squeeze = Math.max(0, Math.sin(p.f / 6));
  return (
    <>
      <Actors p={q} cast={pushed} />
      <GurneyTilt g={g}>
        <Gurney {...g} part="back" pole f={p.f} />
        {patient && <Actors p={q} cast={[patient]} />}
        <Gurney {...g} part="front" bag={G.bag !== false} squeeze={squeeze} f={p.f} />
      </GurneyTilt>
      <Actors p={q} cast={G.push === false ? others : others.slice(1)} />
    </>
  );
};

const Ward: ShotComponent = p => {
  const v = p.shot.view ?? '', d = D(p);
  if (d.gurney) {
    const q = {...p, shot: {...p.shot, data: {...d, bed1: 'gone', curtain: d.curtain ?? 'open'}}};
    const r = ROOMS[d.room ?? 'eye'] ?? WARD;
    // in the blackout the bed is lit by the torch in May's mouth and the green of the EXIT sign it rolls toward
    const ex = r.P(1, 0.15, 0.76), g = d.gurney as {x0: number; x1?: number; y: number};
    const gx = g.x0 + ((g.x1 ?? g.x0) - g.x0) * kf(p.f, [[0, 0], [p.len, 1]]);
    return <Shot p={q} world={<><WardWorld p={q} r={r} /><RollingBed p={q} />
      <Pool x={ex.x} y={ex.y + 200} rx={700} color="60,230,120" a={0.3} />
      <Pool x={gx - 120} y={g.y - 260} rx={420} color="255,240,200" a={0.32} /></>} />;
  }
  if (v === 'curtain-hand-ecu' || v === 'curtain-hand2-ecu') return <CurtainHand p={p} />;
  if (v === 'door-fif' || v === 'door-knock-fif' || v === 'door-knock2-fif') return <GlassDoor p={p} mode="knock" />;
  if (v === 'door-dark-fif') return <GlassDoor p={p} mode="dark" />;
  if (v === 'door-nuan-sil') return <GlassDoor p={p} mode="nuan" />;
  if (v === 'door-ton-sil') return <GlassDoor p={p} mode="ton" />;
  if (v === 'door-leave-close') return <GlassDoor p={p} mode="leave" />;
  if (v === 'hide-low') return <UnderCounter p={p} />;
  if (v === 'hide-watch-close') return <UnderCounter p={p} close />;
  if (v === 'bed1-close') return <PatientEcu p={p} part="face" taped={0.15} who="wora sleep" />;
  if (v === 'tape-ecu') return <PatientEcu p={p} part="eyes" taped={1} who="wora sleep" />;
  if (v === 'eye-ecu') return <PatientEcu p={p} part="eye-r" who="wora shock look=0.2" tears />;
  if (v === 'blink-ecu' || v === 'blink2-ecu' || v === 'blink3-ecu') return <PatientEcu p={p} part="eye-r" who={`wora faces=shock@0,sleep@${v === 'blink3-ecu' ? 18 : 24},shock@${v === 'blink3-ecu' ? 62 : 36}`} tears={v !== 'blink-ecu'} />;
  if (v === 'letter-ecu') return <PatientEcu p={p} part="eye-r" who="wora faces=shock@0,sleep@30,shock@42" glint="ห" />;
  if (v === 'curtain-pov') return <Seam p={p} open={0.35} inner={<Shot p={{...p, shot: {...p.shot, data: {...d, cam: [1.5, 1.56, 1180, 520], cast: []}}}} world={<><WardWorld p={{...p, shot: {...p.shot, data: {...d, lamp: 'off'}}}} /><Svg><rect x={-500} y={-500} width={3000} height={2200} fill="#030405" opacity={0.85} /><circle cx={1190} cy={560} r={9} fill={Math.floor(p.f / 14) % 2 ? '#ff3a2a' : '#661410'} /><circle cx={1190} cy={560} r={60} fill="#ff2a1f" opacity={Math.floor(p.f / 14) % 2 ? 0.22 : 0.06} /></Svg></>} />} />;
  if (v === 'may-sit-cctv') return <Seam p={p} open={1} inner={<Shot p={p} world={<><WardWorld p={p} /><Actors p={p} /></>} />} />;
  const r = ROOMS[d.room ?? (v.endsWith('-high') ? 'high' : v.endsWith('-low') ? 'low' : 'eye')] ?? WARD;
  const data = {...d, ...(v === 'rip-wide' ? {curtain: 'rip'} : {}), ...(v === 'bed2-reveal-wide' || v === 'may-betrayed-close' || v === 'may-watched-close' ? {curtain: 'open'} : {}), ...(v === 'blackout-wide' ? {power: 'off', curtain: 'open'} : {})};
  const q = {...p, shot: {...p.shot, data}};
  // whoever sits or stands behind the nurse counter is covered by it: the counter is drawn over them, shaded like the room
  const cast = (d.cast ?? []) as string[];
  const behind = cast.filter(c => { if (!/\bsit\b/.test(c)) return false; const [x, y] = (c.split(/\s+/)[0].split('@')[1] ?? '').split(',').map(Number); if (!Number.isFinite(y)) return false; const a = roomAt(r, x, y); return a.u < COUNTER.u[1] + 0.02 && a.w > 0.66 && a.w < COUNTER.w[0]; });
  if (behind.length) {
    const s = st(q), shade = s.time === 'day' ? 0.1 : s.time === 'dawn' ? 0.3 : 0.45;
    // a seat behind a 100 cm counter is the tall counter chair: the sitter rides 36 cm higher, chest above the top
    const lifted = behind.map(c => {
      if (!/\bsit\b/.test(c)) return c;
      const [head, ...rest] = c.trim().split(/\s+/), [who, pos] = head.split('@'), [x, y] = pos.split(',').map(Number);
      return [`${who}@${x},${(y - 36 * roomPxPerCm(r, roomAt(r, x, y).w)).toFixed(0)}`, ...rest].join(' ');
    });
    return <Shot p={q} world={<><WardWorld p={q} r={r} noCounter /><Actors p={q} cast={lifted} /><WardCounter r={r} shade={shade} lamp={s.lamp} /><Actors p={q} cast={cast.filter(c => !behind.includes(c))} /></>}
      fore={d.foreShoulder ? undefined : d.fore === 'curtain' ? <Svg><rect x={-40} y={-40} width={420} height={1160} fill={CURT_D} /></Svg> : undefined} />;
  }
  return <Shot p={q} world={<><WardWorld p={q} r={r} /><Actors p={q} /></>} fore={d.foreShoulder ? undefined : d.fore === 'curtain' ? <Svg><rect x={-40} y={-40} width={420} height={1160} fill={CURT_D} /></Svg> : undefined} />;
};

export const WARDS: Record<string, ShotComponent> = {ward: Ward};
export {K};
