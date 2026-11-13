import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {D, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {FaceEcu} from '../../kit/ecu';
import {Pov, Split} from '../../kit/pov';
import {PoliceOffice} from '../../kit/policestation';
import {BFloor, BGround, BPole, BRect, BRoof, BWall, makeBlock} from '../../kit/exterior';
import {LightVeil, RBox, RFace, RoomShell, makeRoom, type Room} from '../../kit/room';
import {BenchTable, SIT_CM, benchSeat, roomAt} from '../../kit/seating';
import {Actors, C, ROSTER, Shot} from './cast';
import {RollingBed, WardWorld} from './ward';

// Every other place of the story (brief.md → Sets), each built once in perspective and framed from several positions:
//   canteen  hospital canteen at noon: long windows on the left, steel tables, the TV high on the right wall
//   lobby    ตึกเมตตา lobby: the director's portrait (left of the back wall), the closed lift, the guard booth window,
//            the ramp's foot and the chained side door on the left wall, the main doors near right
//   stair    the stairwell with the bed ramp winding beside the steps, the landing window (the one place with signal)
//   booth    the guard booth: desk, lamp, transistor radio, dead CCTV screens
//   pharm    the old pharmacy room at the end of the ward, seen through its glass hatch
//   icu      the ICU of the new building, by day
//   station  สภ.คลองหมอก (src/kit/policestation.tsx), the interview room, a hospital corridor by day
//   ext      ตึกเมตตา from the car park (exterior kit), the scaffolding
//   phone    split call, the hidden phone's screen
//   past     flashbacks, drawn in the same places with the past grade

// ---------------------------------------------------------------- canteen

export const CANTEEN = makeRoom({x: 1040, y: 430}, {x0: 380, x1: 1640, y0: 170, y1: 700}, 3.4);

// steel tables with fixed benches (src/kit/seating.tsx): whoever sits in the canteen sits on a bench, never on a chair.
const CROWS = [0.28, 0.5, 0.72], CCOLS = [0.08, 0.38, 0.68];

/** every `sit` actor snapped onto the far bench of the nearest table, with its row index; others keep their place */
const canteenSeat = (c: string) => {
  const r = CANTEEN, a = c.trim().split(/\s+/), [who, pos] = a[0].split('@');
  const [x, y] = (pos ?? '960').split(',').map(Number);
  const at = roomAt(r, x, Number.isFinite(y) ? y : 936);
  if (!a.includes('sit')) return {c, row: CROWS.findIndex(w => w + 0.1 > at.w), w: at.w};
  const row = CROWS.reduce((b, w, i) => Math.abs(w - 0.035 - at.w) < Math.abs(CROWS[b] - 0.035 - at.w) ? i : b, 0);
  const id = who.replace(/-sil$/, '');
  const cm = ROSTER[id]?.cm ?? 160;
  const s = benchSeat(r, at.u, CROWS[row], cm);
  const rest = a.slice(1).filter(t => !t.startsWith('h='));
  return {c: [`${who}@${s.x.toFixed(0)},${s.y.toFixed(0)}`, `h=${s.h.toFixed(0)}`, ...rest].join(' '), row, w: s.w};
};

const CanteenWorld: React.FC<{p: ShotProps; near?: number}> = ({p, near = 99}) => {
  const r = CANTEEN, d = D(p);
  const behind = ((d.behind ?? []) as string[]).map(canteenSeat);
  const row = (i: number, part: 'far' | 'front') => CCOLS.map(u => <BenchTable key={`${part}${u}`} r={r} u={[u, u + 0.22]} w={CROWS[i]} part={part} />);
  return (
    <>
      <RoomShell r={r} id="cant" wall="#cdbf9c" side="#b8a985" sideFar="#c2b38f" floorC="#8c877c" ceiling="#9b927a" floor="tiles" walls="plain" boards={10} />
      {/* long windows on the left wall, noon light */}
      {[0.12, 0.38, 0.64].map(w => <RFace key={w} r={r} pts={[[0, 0.2, w], [0, 0.2, w + 0.2], [0, 0.66, w + 0.2], [0, 0.66, w]]} fill="#fbf6e3" stroke="#6b6250" sw={6} />)}
      <RFace r={r} pts={[[0, 1, 0.1], [0, 1, 0.9], [0.42, 1, 0.95], [0.32, 1, 0.12]]} fill="#fff3cf" o={0.32} blend="screen" />
      {/* serving counter at the back with trays and pots */}
      <RBox r={r} u={[0.18, 0.86]} v={[0.66, 1]} w={[0, 0.08]} front="#9ea3a0" top="#c7ccc9" side="#7d827f" />
      {[0.24, 0.36, 0.48, 0.6, 0.72].map(u => <RBox key={u} r={r} u={[u, u + 0.07]} v={[0.6, 0.66]} w={[0.01, 0.06]} front="#d4d8d6" top="#6f4a2a" />)}
      <RFace r={r} pts={[[0.2, 0.14, 0], [0.84, 0.14, 0], [0.84, 0.24, 0], [0.2, 0.24, 0]]} fill="#2f5d8c" />
      {/* the TV high on the right wall */}
      <RFace r={r} pts={[[1, 0.18, 0.28], [1, 0.18, 0.5], [1, 0.42, 0.5], [1, 0.42, 0.28]]} fill="#141a22" stroke="#0a0c10" sw={6} />
      <RFace r={r} pts={[[1, 0.2, 0.3], [1, 0.2, 0.48], [1, 0.4, 0.48], [1, 0.4, 0.3]]} fill="#6c8db0" />
      <RFace r={r} pts={[[1, 0.36, 0.3], [1, 0.36, 0.48], [1, 0.4, 0.48], [1, 0.4, 0.3]]} fill="#b8312a" />
      <LightVeil id="cant" lights={[[200, 520, 900], [1800, 420, 300]]} o={0.12} color="#120c06" />
      <Pool x={160} y={460} rx={620} color="255,244,214" a={0.3} />
      {/* steel tables in rows, back to front: far bench, the people sitting on it, then the table over their laps */}
      {CROWS.map((_, i) => <React.Fragment key={i}>
        {row(i, 'far')}
        {behind.some(b => b.row === i) && <Actors p={p} cast={behind.filter(b => b.row === i).map(b => b.c)} />}
        {i < near && row(i, 'front')}
        {i < near && i === 2 && <CanteenPlates p={p} />}
      </React.Fragment>)}
      {behind.some(b => b.row < 0) && <Actors p={p} cast={behind.filter(b => b.row < 0).map(b => b.c)} />}
    </>
  );
};

/** plates on May's table (near left) */
const CanteenPlates: React.FC<{p: ShotProps}> = ({p}) => {
  const r = CANTEEN, vt = 1 - SIT_CM.table / 280;
  if (D(p).plates === false) return null;
  return <Svg>{(() => { const q = r.P(0.15, vt, 0.77), k = r.s(0.77); return <><ellipse cx={q.x} cy={q.y} rx={46 * k} ry={14 * k} fill="#f4f1e8" /><ellipse cx={q.x} cy={q.y - 4 * k} rx={30 * k} ry={9 * k} fill="#e9d6a4" /><ellipse cx={q.x + 150 * k} cy={q.y} rx={44 * k} ry={13 * k} fill="#f4f1e8" /><ellipse cx={q.x + 150 * k} cy={q.y - 4 * k} rx={28 * k} ry={8 * k} fill="#e8b84a" /></>; })()}</Svg>;
};

/** the canteen TV, full frame: the news, the director's clip, the airport CCTV */
export const TvScreen: React.FC<{p: ShotProps; mode: 'news' | 'clip' | 'clipzoom' | 'arrest'; wall?: boolean}> = ({p, mode, wall = true}) => {
  const f = p.f;
  const clipZ = mode === 'clipzoom' ? kf(f, [[0, 1], [Math.min(60, p.len), 2.3]]) : 1;
  const inner = (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', background: '#1c2026'}}>
      {mode === 'news' && (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={0} y={0} width={1920} height={1080} fill="#8fb3d6" /><rect x={0} y={760} width={1920} height={320} fill="#7c7c74" />
          <polygon points="300,300 1500,240 1500,780 300,790" fill="#d9cba8" />
          {Array.from({length: 20}, (_, i) => <rect key={i} x={360 + (i % 5) * 220} y={330 + Math.floor(i / 5) * 105} width={120} height={60} fill="#4a5a6a" />)}
          {Array.from({length: 6}, (_, i) => <line key={'s' + i} x1={340 + i * 110} y1={250} x2={350 + i * 110} y2={790} stroke="#c9b27a" strokeWidth={10} />)}
          <polygon points="330,260 900,250 880,620 340,640" fill="#2f6a3a" opacity={0.75} />
          <rect x={60} y={60} width={420} height={70} fill="#b8312a" /><text x={80} y={110} fontFamily="Kanit" fontSize={44} fill="#fff">ตึกเมตตา · ระงับงาน</text>
        </svg>
      )}
      {(mode === 'clip' || mode === 'clipzoom') && (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${clipZ})`, transformOrigin: '1620px 900px'}}>
          {/* the curtain behind him: the same weave and hem stamp as bed 2 */}
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            {Array.from({length: 9}, (_, i) => <rect key={i} x={i * 220 - 20} y={0} width={230} height={1080} fill={i % 2 ? '#a9b6b8' : '#b9c5c7'} />)}
            {[300, 560, 820].map(y => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#8d9b9e" strokeWidth={4} opacity={0.5} />)}
            <rect x={1500} y={880} width={240} height={64} fill="none" stroke="#6f6a8c" strokeWidth={5} opacity={mode === 'clipzoom' ? 0.95 : 0.45} />
            <text x={1620} y={926} textAnchor="middle" fontSize={34} fontFamily="Kanit" fill="#6f6a8c" opacity={mode === 'clipzoom' ? 0.95 : 0.0}>ตึกเมตตา 4</text>
          </svg>
          <FaceEcu who="worasuit tired look=-0.3 acc=glasses" roster={ROSTER} f={f} len={p.len} part="face" fill={0.5} at={[0.42, 0.5]} talking={!!p.shot.who} bg="transparent"
            back={<div />} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 42% 40%, rgba(255,255,255,.18), rgba(0,0,0,.35) 80%)'}} />
        </div>
      )}
      {mode === 'arrest' && (
        <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) contrast(1.2)', background: '#7d8288'}}>
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <polygon points="0,700 1920,560 1920,1080 0,1080" fill="#9ca1a6" />
            <rect x={1100} y={300} width={700} height={300} fill="#5a5f66" /><rect x={1140} y={330} width={620} height={60} fill="#d0d4d8" />
            {[[900, 520], [1040, 500], [780, 560], [1180, 540]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y - 210} rx={34} ry={40} fill={i === 1 ? '#202226' : '#3a3d42'} /><rect x={x - 46} y={y - 172} width={92} height={190} rx={22} fill={i === 1 ? '#202226' : '#3a3d42'} /></g>)}
          </svg>
          <div style={{position: 'absolute', left: 60, top: 40, fontFamily: 'Courier New', fontSize: 40, color: '#fff'}}>CAM 12 · DEPARTURE · 09:41:07</div>
        </div>
      )}
      {/* the news chrome */}
      {mode !== 'clipzoom' && <>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: '#b8312a'}} />
        <div style={{position: 'absolute', left: 40, bottom: 34, fontFamily: 'Kanit', fontWeight: 700, fontSize: 64, color: '#fff', whiteSpace: 'nowrap'}}>
          {mode === 'arrest' ? 'ผอ.วรเทพ ไม่ได้หนี · ถูกขังในตึกเมตตา 19 วัน' : 'ยาหายจากคลัง รพ. 80 ล้าน · ผอ.ส่งคลิปขอโทษ'}</div>
        <div style={{position: 'absolute', right: 40, top: 30, padding: '6px 20px', background: '#b8312a', fontFamily: 'Kanit', fontSize: 40, color: '#fff'}}>ข่าวเที่ยง</div>
      </>}
    </div>
  );
  if (!wall) return <Macro p={p} bg="#000" z={1.03}>{inner}</Macro>;
  // the TV in the canteen: the screen fills most of the frame, the wall and the TV bezel around it
  return (
    <Macro p={p} bg="#c8bb98" z={1.06} ox={960} oy={460} at={[50, 45]} vig={0.4}>
      <div style={{position: 'absolute', left: 230, top: 90, width: 1460, height: 822, background: '#0c0e12', borderRadius: 14, padding: 22, boxSizing: 'border-box'}}>
        <div style={{position: 'relative', width: 1416, height: 778, overflow: 'hidden'}}><div style={{transform: 'scale(.7375, .7204)', transformOrigin: '0 0'}}>{inner}</div></div>
      </div>
      <Svg>{[[600, 1040], [1300, 1060]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={140} ry={90} fill="#2a2620" opacity={0.85} style={{filter: 'blur(4px)'}} />)}</Svg>
    </Macro>
  );
};

const Canteen: ShotComponent = p0 => {
  const v = p0.shot.view ?? '';
  const p = {...p0, shot: {...p0.shot, data: {...D(p0), seat: false}}};
  if (v === 'tv-ins') return <TvScreen p={p} mode="news" />;
  if (v === 'tv-clip-ins') return <TvScreen p={p} mode="clip" />;
  if (v === 'arrest-cctv') return <TvScreen p={p} mode="arrest" />;
  // the shot's own people are sharp (outside Soft): their row's tables are drawn over them, sharp too
  const main = ((D(p).cast ?? []) as string[]).map(canteenSeat);
  const near = main.length ? Math.min(...main.map(m => (m.row < 0 ? 99 : m.row))) : 99;
  const q = {...p, shot: {...p.shot, data: {...D(p), cast: main.map(m => m.c)}}};
  const rows = [0, 1, 2].filter(i => i >= near);
  return <Shot p={q} world={<>
    <Soft p={p}><CanteenWorld p={p} near={near} /></Soft>
    {rows.map(i => <React.Fragment key={i}>
      <Actors p={q} cast={main.filter(m => m.row === i).map(m => m.c)} />
      {CCOLS.map(u => <BenchTable key={u} r={CANTEEN} u={[u, u + 0.22]} w={CROWS[i]} part="front" />)}
      {i === 2 && <CanteenPlates p={p} />}
    </React.Fragment>)}
    <Actors p={q} cast={main.filter(m => m.row < 0 || near === 99).map(m => m.c)} />
  </>} />;
};

// ---------------------------------------------------------------- lobby

export const LOBBY = makeRoom({x: 980, y: 440}, {x0: 360, x1: 1600, y0: 160, y1: 720}, 3.3);

const LobbyWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = LOBBY, d = D(p), f = p.f;
  const time = (d.time ?? (d.light === 'dusk' ? 'dusk' : d.light === 'dawn' ? 'dawn' : 'night')) as string;
  const dawn = time === 'dawn', dusk = time === 'dusk';
  const torch = d.torch as [number, number, number] | undefined;
  const lights: [number, number, number][] = [];
  const booth = r.P(0.86, 0.55, 0);
  lights.push([booth.x, booth.y, 260]);
  if (dusk) lights.push([r.P(1, 0.5, 0.75).x, r.P(1, 0.5, 0.75).y, 700]);
  if (dawn) lights.push([r.P(0, 0.6, 0.55).x + 200, r.P(0, 0.6, 0.55).y, 800]);
  if (torch) lights.push([torch[0], torch[1], torch[2]]);
  if (d.lit) lights.push([r.P(0.2, 0.42, 0).x, r.P(0.2, 0.42, 0).y, 260]);
  return (
    <>
      <RoomShell r={r} id="lob" wall="#b2a98f" side="#968e77" sideFar="#a39b83" floorC="#7a756b" ceiling="#3e3b34" floor="tiles" walls="plain" boards={10} />
      <RFace r={r} pts={[[0, 0.62, 0], [1, 0.62, 0], [1, 1, 0], [0, 1, 0]]} fill="#6e6a5b" />
      {/* the director's portrait: gold frame, a man in a suit and gold glasses, the name plate */}
      <RFace r={r} pts={[[0.12, 0.2, 0], [0.28, 0.2, 0], [0.28, 0.56, 0], [0.12, 0.56, 0]]} fill="#b48a3c" stroke="#5a4218" sw={6} />
      <RFace r={r} pts={[[0.13, 0.22, 0], [0.27, 0.22, 0], [0.27, 0.54, 0], [0.13, 0.54, 0]]} fill="#4a5a6a" />
      <Svg>{(() => { const c = r.P(0.2, 0.33, 0), k = r.s(0); const sc = (r.back.x1 - r.back.x0) / 1240; return <g transform={`translate(${c.x} ${c.y}) scale(${sc * k})`}>
        <path d="M-70 210 Q-60 90 0 80 Q60 90 70 210 Z" fill="#232831" /><path d="M-14 92 L0 150 L14 92 Z" fill="#e8e6dd" />
        <ellipse cx={0} cy={20} rx={46} ry={56} fill="#d9b39a" /><path d="M-46 0 Q-40 -44 0 -46 Q40 -44 46 0 Q40 -20 0 -24 Q-40 -20 -46 0 Z" fill="#cfcfcf" />
        <circle cx={-17} cy={18} r={4} fill="#222" /><circle cx={17} cy={18} r={4} fill="#222" /><circle cx={24} cy={40} r={3.4} fill="#5a3a2a" />
        <rect x={-32} y={10} width={26} height={16} rx={4} fill="none" stroke="#c9a24a" strokeWidth={3} /><rect x={6} y={10} width={26} height={16} rx={4} fill="none" stroke="#c9a24a" strokeWidth={3} />
        <path d="M-12 50 Q0 56 12 50" stroke="#7a4a3a" strokeWidth={3} fill="none" /></g>; })()}</Svg>
      <RFace r={r} pts={[[0.14, 0.57, 0], [0.26, 0.57, 0], [0.26, 0.61, 0], [0.14, 0.61, 0]]} fill="#d9c58a" />
      {/* the closed lift with its sign */}
      <RFace r={r} pts={[[0.42, 0.24, 0], [0.62, 0.24, 0], [0.62, 1, 0], [0.42, 1, 0]]} fill="#7b8287" stroke="#3b3f42" sw={6} />
      <RFace r={r} pts={[[0.519, 0.24, 0], [0.521, 0.24, 0], [0.521, 1, 0], [0.519, 1, 0]]} fill="#2b2e30" />
      <RFace r={r} pts={[[0.45, 0.46, 0], [0.59, 0.46, 0], [0.59, 0.58, 0], [0.45, 0.58, 0]]} fill="#f2e6a0" />
      <RFace r={r} pts={[[0.44, 0.5, 0], [0.6, 0.53, 0], [0.6, 0.545, 0], [0.44, 0.515, 0]]} fill="#c9302a" />
      {/* the guard booth: wooden box, lit window */}
      <RBox r={r} u={[0.76, 0.98]} v={[0.3, 1]} w={[0, 0.22]} front="#6d5236" side="#523d27" top="#7a5d3e" />
      <RFace r={r} pts={[[0.79, 0.42, 0.22], [0.95, 0.42, 0.22], [0.95, 0.62, 0.22], [0.79, 0.62, 0.22]]} fill={'#ffd895'} />
      {/* left wall: the ramp's foot and the chained steel side door */}
      <RFace r={r} pts={[[0, 0.3, 0.06], [0, 0.3, 0.3], [0, 1, 0.3], [0, 1, 0.06]]} fill="#1f2120" />
      <RFace r={r} pts={[[0, 0.62, 0.06], [0, 0.98, 0.3], [0, 1, 0.3], [0, 1, 0.06]]} fill="#4a4a44" />
      <RFace r={r} pts={[[0, 0.26, 0.4], [0, 0.26, 0.6], [0, 1, 0.6], [0, 1, 0.4]]} fill={dawn && d.doorOpen ? '#cfe0f2' : '#4c5357'} stroke="#252829" sw={6} />
      {!d.doorOpen && <Svg>{(() => { const a = r.P(0, 0.58, 0.47), b = r.P(0, 0.62, 0.53); return <path d={`M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${b.y + 30} ${b.x} ${b.y}`} stroke="#9a9a92" strokeWidth={8} fill="none" />; })()}</Svg>}
      {/* main doors on the right wall: dusk outside, or the dark */}
      <RFace r={r} pts={[[1, 0.22, 0.58], [1, 0.22, 0.9], [1, 1, 0.9], [1, 1, 0.58]]} fill={dusk ? '#e39a63' : dawn ? '#9fb1d6' : '#121722'} stroke="#2a2a2a" sw={7} />
      {dawn && d.doorOpen && <RFace r={r} pts={[[0, 1, 0.4], [0, 1, 0.6], [0.5, 1, 0.98], [0.3, 1, 0.98]]} fill="#d7e6ff" o={0.42} blend="screen" />}
      {/* bench and a potted plant */}
      <RBox r={r} u={[0.32, 0.4]} v={[0.86, 0.9]} w={[0.05, 0.14]} front="#5a4a38" top="#6e5b45" />
      <RBox r={r} u={[0.66, 0.71]} v={[0.82, 1]} w={[0.04, 0.1]} front="#7a4a2a" top="#3c6a3a" />
      <LightVeil id="lob" lights={lights} o={dawn ? 0.42 : dusk ? 0.38 : torch ? 0.82 : 0.66} color="#05060a" />
      <Pool x={booth.x} y={booth.y + 40} rx={300} color="255,214,150" a={0.35 * flicker(f, 3, 0.04)} />
      {torch && <Pool x={torch[0]} y={torch[1]} rx={torch[2] * 0.8} color="255,242,206" a={0.55} />}
      {dawn && d.doorOpen && <Pool x={r.P(0, 0.6, 0.5).x + 160} y={r.P(0, 0.6, 0.5).y} rx={700} color="200,220,255" a={0.45} />}
    </>
  );
};

/** the portrait full frame, lit by the lawyer's torch (mirror of the shot where May wai'd it in passing) */
const Portrait: React.FC<{p: ShotProps; lit: boolean}> = ({p, lit}) => (
  <Macro p={p} bg="#040405" z={lit ? 1.08 : 1.03} ox={960} oy={420} at={[50, 40]} vig={lit ? 0.85 : 0.7}>
    <Svg>
      <rect x={0} y={0} width={1920} height={1080} fill="#2e2c26" />
      <rect x={560} y={60} width={800} height={900} fill="#b48a3c" /><rect x={600} y={100} width={720} height={820} fill="#3c4a58" />

      <rect x={720} y={940} width={480} height={0} fill="none" />
    </Svg>
    <div style={{position: 'absolute', left: 600, top: 100, width: 720, height: 820, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -600, top: -100, width: 1920, height: 1080}}><FaceEcu who="worasuit acc=glasses" roster={ROSTER} f={0} len={p.len} part="face" fill={0.36} at={[0.5, 0.42]} bg="transparent" back={<div />} /></div>
    </div>
    <div style={{position: 'absolute', left: 660, top: 820, width: 600, padding: '10px 0', background: '#d9c58a', textAlign: 'center', fontFamily: 'Kanit', fontWeight: 700, fontSize: 44, color: '#3a2a10'}}>นพ.วรเทพ ผู้อำนวยการ</div>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={lit ? 0 : 0.55} /></Svg>
    {lit && <Pool x={1000} y={380} rx={520} color="255,244,210" a={0.4} />}
  </Macro>
);

const Lobby: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'portrait-lit-med') return <Portrait p={p} lit />;
  if (v === 'face-ecu') return (
    <Macro p={p} bg="#050505" z={1.06} ox={960} oy={440} at={[50, 42]} vig={0.85}>
      <FaceEcu who="wora shock look=-0.2 acc=none" roster={ROSTER} f={p.f} len={p.len} part="face" fill={0.62} at={[0.5, 0.42]} shade="l" shadeA={0.6} back={<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #6e7672, #0b0d0d 70%)'}} />} />
      
      <Pool x={1100} y={360} rx={560} color="255,244,210" a={0.35} />
    </Macro>
  );
  return <Shot p={p} world={<><Soft p={p}><LobbyWorld p={p} /></Soft><Actors p={p} /></>} />;
};

// ---------------------------------------------------------------- stairwell and the ramp

export const STAIR = makeRoom({x: 980, y: 470}, {x0: 520, x1: 1440, y0: 140, y1: 780}, 2.8);

const StairWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = STAIR, d = D(p), f = p.f;
  const torches = (d.torches ?? []) as [number, number][];
  const win = r.P(0.72, 0.3, 0);
  const lights: [number, number, number][] = [[win.x, win.y, 300], [r.P(0.12, 0.1, 0.3).x, r.P(0.12, 0.1, 0.3).y, 200], ...torches.map(([x, y]) => [x, y, 280] as [number, number, number])];
  if (d.lightAt) lights.push([d.lightAt[0], d.lightAt[1], 320]);
  return (
    <>
      <RoomShell r={r} id="stair" wall="#8d958d" side="#757d76" sideFar="#80887f" floorC="#5e605b" ceiling="#3a3e3c" floor="plain" walls="plain" />
      <RFace r={r} pts={[[0, 0.6, 0], [1, 0.6, 0], [1, 1, 0], [0, 1, 0]]} fill="#5a6b62" />
      {/* the ramp: a broad concrete slope rising from the near left to the landing at the back right, its rail */}
      <RFace r={r} pts={[[0, 1, 0.95], [0.48, 1, 0.95], [0.98, 0.42, 0.05], [0.56, 0.42, 0.05]]} fill="#8a8a84" stroke="#3c3c38" sw={4} />
      <Svg>{Array.from({length: 9}, (_, i) => { const t = i / 9; const a = r.P(0 + 0.56 * t, 1 - 0.58 * t, 0.95 - 0.9 * t), b = r.P(0.48 + 0.5 * t, 1 - 0.58 * t, 0.95 - 0.9 * t); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6c6c66" strokeWidth={3} />; })}</Svg>
      <Svg>{(() => { const a = r.P(0.48, 0.82, 0.95), b = r.P(0.98, 0.26, 0.05); return <><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b9b9b0" strokeWidth={8} />{Array.from({length: 7}, (_, i) => { const t = i / 6, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t; return <line key={i} x1={x} y1={y} x2={x} y2={y + 120 * (1 - t * 0.7)} stroke="#9a9a92" strokeWidth={5} />; })}</>; })()}</Svg>
      {/* the stairs on the far left, the landing window (street light), EXIT signs */}
      <Svg>{Array.from({length: 10}, (_, i) => { const a = r.P(0, 1 - i * 0.06, 0.1 + i * 0.02), b = r.P(0.16, 1 - i * 0.06, 0.1 + i * 0.02); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4a4c48" strokeWidth={5} />; })}</Svg>
      <RFace r={r} pts={[[0.64, 0.16, 0], [0.8, 0.16, 0], [0.8, 0.42, 0], [0.64, 0.42, 0]]} fill={d.light === 'day' ? '#e7efef' : '#1f2738'} stroke="#2f3332" sw={6} />
      {d.light !== 'day' && <Svg><circle cx={win.x + 30} cy={win.y - 10} r={14} fill="#ffb25c" /></Svg>}
      <RFace r={r} pts={[[0.08, 0.06, 0.3], [0.18, 0.06, 0.3], [0.18, 0.12, 0.3], [0.08, 0.12, 0.3]]} fill="#2fd36a" />
      <RFace r={r} pts={[[0.24, 0.3, 0], [0.38, 0.3, 0], [0.38, 0.4, 0], [0.24, 0.4, 0]]} fill="#d8cfa8" />
      {d.pole && <Svg>{(() => { const a = r.P(0.5, 0.75, 0.55), b = r.P(0.74, 0.62, 0.5); return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b9c2c6" strokeWidth={9} />; })()}</Svg>}
      <LightVeil id="stair" lights={lights} o={d.light === 'day' ? 0.2 : 0.72} color="#040608" />
      <Pool x={win.x} y={win.y + 60} rx={300} color="255,178,92" a={0.3} />
      {torches.map(([x, y], i) => <React.Fragment key={i}><Pool x={x} y={y} rx={240} color="255,244,210" a={0.55} /><Svg><circle cx={x} cy={y} r={16} fill="#fffbe8" /></Svg></React.Fragment>)}
      {d.green !== false && <Pool x={r.P(0.13, 0.09, 0.3).x} y={r.P(0.13, 0.09, 0.3).y} rx={220} color="60,230,120" a={0.22 * flicker(f, 5, 0.06)} />}
      {d.bed && (() => { const q = d.bed as [number, number, number]; return <Svg><g transform={`translate(${q[0]} ${q[1]}) scale(${q[2]}) rotate(-14)`}>
        <rect x={-210} y={-50} width={420} height={44} rx={6} fill="#e4e8e6" /><rect x={-210} y={-6} width={420} height={18} fill="#9aa19e" />
        <ellipse cx={-170} cy={-60} rx={40} ry={20} fill="#f3f4f2" /><path d="M-150 -70 q60 -30 330 -6 l0 22 -330 6 Z" fill="#a9c4d6" />
        {[-180, 180].map(x => <g key={x}><line x1={x} y1={12} x2={x} y2={70} stroke="#7e8582" strokeWidth={8} /><circle cx={x} cy={78} r={12} fill="#222" /></g>)}
      </g></Svg>; })()}
    </>
  );
};

/** torch beams from data.beams [[x, y, tx, ty, width]]: a cone of light from the lamp to where it points, a hot spot there */
const Beams: React.FC<{p: ShotProps}> = ({p}) => {
  const beams = (D(p).beams ?? []) as number[][];
  return <Svg>
    <defs><linearGradient id="beam-g" x1="0" x2="1"><stop offset="0" stopColor="#fff6d8" stopOpacity={0.75} /><stop offset="1" stopColor="#fff6d8" stopOpacity={0} /></linearGradient></defs>
    {beams.map(([x, y, tx0, ty, w = 220], i) => {
      const tx = tx0 + Math.sin(p.f / (6 + i * 2) + i) * 60;
      const a = Math.atan2(ty - y, tx - x), len = Math.hypot(tx - x, ty - y);
      return <g key={i} transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI})`}>
        <polygon points={`0,-8 ${len},${-w / 2} ${len},${w / 2} 0,8`} fill="url(#beam-g)" style={{mixBlendMode: 'screen'}} />
        <ellipse cx={len} cy={0} rx={w * 0.22} ry={w * 0.5} fill="#fff4cf" opacity={0.25} />
        <circle cx={0} cy={0} r={12} fill="#fffbe8" />
      </g>;
    })}
  </Svg>;
};

/** low at the bend of the ramp: the bed's castor scraping the wall in sparks, May's white shoe braced against the wall,
 *  the patient's arm and the orange bag on the mattress edge at the top of the frame */
const RampWheel: React.FC<{p: ShotProps}> = ({p}) => {
  const f = p.f, sq = Math.max(0, Math.sin(f / 5));
  const spin = (f * 22) % 360;
  return (
    <Macro p={p} bg="#07090a" z={1.04} ox={960} oy={540} at={[50, 50]} vig={0.7}>
      <Svg>
        {/* the wall (right) and the ramp floor sloping down to the left */}
        <polygon points="1180,-20 1960,-20 1960,1100 1180,1100" fill="#3b423e" />
        <polygon points="-20,1100 1180,1100 1180,760 -20,980" fill="#4a4b46" />
        {[0, 1, 2, 3].map(i => <line key={i} x1={-20} y1={1010 + i * 30 - 40} x2={1180} y2={790 + i * 30 - 40} stroke="#3a3b37" strokeWidth={3} />)}
        <line x1={1180} y1={-20} x2={1180} y2={1100} stroke="#20251f" strokeWidth={8} />
        {/* the bed's underside: frame bar, leg, castor against the wall */}
        <rect x={180} y={300} width={1060} height={46} fill="#7e8582" stroke="#3a3f3c" strokeWidth={5} transform="rotate(-10 700 320)" />
        <line x1={1040} y1={330} x2={1060} y2={700} stroke="#8a918e" strokeWidth={26} />
        <g transform={`translate(1090 760) rotate(${spin})`}><circle r={78} fill="#18191b" stroke="#555" strokeWidth={8} /><line x1={-50} y1={0} x2={50} y2={0} stroke="#666" strokeWidth={8} /><line x1={0} y1={-50} x2={0} y2={50} stroke="#666" strokeWidth={8} /></g>
        {/* sparks where it scrapes */}
        {Array.from({length: 14}, (_, i) => { const a = -2.2 + rnd(91, i + (f % 7)) * 1.6, l = 40 + rnd(92, i + f) * 120; return <line key={i} x1={1170} y1={740} x2={1170 + Math.cos(a) * l} y2={740 + Math.sin(a) * l} stroke={i % 3 ? '#ffd27a' : '#fff4cf'} strokeWidth={4} strokeLinecap="round" opacity={0.9} />; })}
        {/* the mattress edge and blanket at the top, his arm hanging, the orange bag squeezed */}
        <rect x={-40} y={120} width={1300} height={70} fill="#dfe3e1" stroke="#4a4f4d" strokeWidth={5} transform="rotate(-10 600 150)" />
        <path d="M-40 110 Q400 40 1240 -60 L1260 40 Q500 150 -40 200 Z" fill="#a9c4d6" />
        <path d={`M560 150 q-10 120 30 ${200 + Math.sin(f / 4) * 10}`} stroke="#d9b39a" strokeWidth={34} strokeLinecap="round" fill="none" />
        <ellipse cx={300} cy={50} rx={96 - sq * 18} ry={56 - sq * 12} fill="#ff8a2a" stroke="#9a4a10" strokeWidth={6} />
        {/* May's leg: white stocking, white nurse shoe pressed flat on the wall */}
        <path d="M60 1100 L560 760 L1030 540" stroke="#eef0ee" strokeWidth={78} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M60 1100 L560 760" stroke="#f6f6f2" strokeWidth={110} strokeLinecap="round" fill="none" />
        <ellipse cx={560} cy={760} rx={60} ry={52} fill="#e6e8e4" />
        <path d="M1020 470 L1176 452 L1176 590 L1030 590 Q990 560 1020 470 Z" fill="#f4f4f0" stroke="#9aa09c" strokeWidth={5} />
      </Svg>
      <Pool x={1170} y={740} rx={380} color="255,200,110" a={0.55 * (0.7 + 0.3 * Math.abs(Math.sin(f / 2)))} />
      <Pool x={560} y={260} rx={600} color="60,230,120" a={0.16} />
    </Macro>
  );
};

const Stair: ShotComponent = p => {
  if (p.shot.view === 'ramp-wheel-low') return <RampWheel p={p} />;
  return <Shot p={p} world={<><Soft p={p}><StairWorld p={p} /></Soft>{D(p).gurney ? <RollingBed p={p} /> : <Actors p={p} />}<Beams p={p} /></>} />;
};

// ---------------------------------------------------------------- guard booth

export const BOOTH = makeRoom({x: 900, y: 440}, {x0: 420, x1: 1460, y0: 180, y1: 740}, 2.6);

const BoothWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = BOOTH, d = D(p), day = d.light === 'day';
  const lamp = r.P(0.3, 0.55, 0.5);
  return (
    <>
      <RoomShell r={r} id="booth" wall="#8a6e4b" side="#6e5638" sideFar="#7a603f" floorC="#4a3f33" ceiling="#2c241b" floor="boards" walls="planks" boards={10} />
      <RFace r={r} pts={[[0.5, 0.2, 0], [0.95, 0.2, 0], [0.95, 0.55, 0], [0.5, 0.55, 0]]} fill={day ? '#e8efe6' : '#141822'} stroke="#3a2a18" sw={6} />
      <RFace r={r} pts={[[0.06, 0.18, 0], [0.42, 0.18, 0], [0.42, 0.44, 0], [0.06, 0.44, 0]]} fill="#1a1d20" stroke="#3a3a3a" sw={4} />
      {[[0.08, 0.2], [0.25, 0.2], [0.08, 0.32], [0.25, 0.32]].map(([u, v], i) => <RFace key={i} r={r} pts={[[u, v, 0], [u + 0.15, v, 0], [u + 0.15, v + 0.1, 0], [u, v + 0.1, 0]]} fill="#0b0d0f" stroke="#2a2d30" sw={2} />)}
      <RFace r={r} pts={[[0.09, 0.21, 0], [0.22, 0.21, 0], [0.22, 0.24, 0], [0.09, 0.24, 0]]} fill="#3a3a3a" />
      <RBox r={r} u={[0.02, 0.98]} v={[0.66, 0.7]} w={[0.3, 0.62]} front="#6b4e30" top="#8a6a44" />
      <RBox r={r} u={[0.04, 0.06]} v={[0.7, 1]} w={[0.55, 0.6]} front="#3a2a1a" /><RBox r={r} u={[0.94, 0.96]} v={[0.7, 1]} w={[0.55, 0.6]} front="#3a2a1a" />
      {/* the radio, the lamp, a kettle, a key board on the wall */}
      <RBox r={r} u={[0.52, 0.64]} v={[0.58, 0.66]} w={[0.36, 0.44]} front="#5a3a22" top="#7a5236" />
      <Svg>{(() => { const q = r.P(0.58, 0.62, 0.44), k = r.s(0.44); return <><circle cx={q.x - 20 * k} cy={q.y} r={14 * k} fill="#2a1a10" /><rect x={q.x + 4 * k} y={q.y - 10 * k} width={30 * k} height={20 * k} fill="#d8c08a" /></>; })()}</Svg>
      <RBox r={r} u={[0.72, 0.8]} v={[0.58, 0.66]} w={[0.36, 0.44]} front="#c9c4b8" top="#dedad0" />
      <RFace r={r} pts={[[1, 0.24, 0.1], [1, 0.24, 0.4], [1, 0.5, 0.4], [1, 0.5, 0.1]]} fill="#4a3826" stroke="#2a1d10" sw={4} />
      <Svg>{Array.from({length: 12}, (_, i) => { const q = r.P(1, 0.28 + (i % 3) * 0.07, 0.13 + Math.floor(i / 3) * 0.07); return <circle key={i} cx={q.x} cy={q.y} r={6} fill="#c9b26a" />; })}</Svg>
      <LightVeil id="booth" lights={[[lamp.x, lamp.y, 520]]} o={day ? 0.18 : 0.62} color="#060404" />
      <Pool x={lamp.x} y={lamp.y} rx={420} color="255,210,140" a={0.42 * flicker(p.f, 9, 0.04)} />
    </>
  );
};

/** the guard's phone face up on the desk, the clip playing small and broken */
const PhoneClip: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#2a1d12" z={1.08} ox={960} oy={460} at={[50, 45]} vig={0.75}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#4a3420" />{Array.from({length: 9}, (_, i) => <line key={i} x1={0} y1={120 * i + 30} x2={1920} y2={120 * i - 20} stroke="#3a2818" strokeWidth={6} />)}</Svg>
    <div style={{position: 'absolute', left: 560, top: 60, width: 800, height: 900, background: '#0b0c0e', borderRadius: 60, transform: 'rotate(-7deg)', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
      <div style={{position: 'absolute', left: 30, top: 150, width: 740, height: 416, overflow: 'hidden', filter: 'blur(1.2px) saturate(.8)'}}>
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, #a9b6b8 0 70px, #b9c5c7 70px 140px)'}} /><div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(.385)', transformOrigin: '0 0'}}><FaceEcu who="worasuit tired look=-0.3 acc=glasses" roster={ROSTER} f={p.f} len={p.len} part="face" fill={0.5} at={[0.42, 0.5]} talking bg="transparent" back={<div />} /></div>
      </div>
      <div style={{position: 'absolute', left: 40, top: 600, right: 40, fontFamily: 'Kanit', fontSize: 40, color: '#e8e8e8'}}>ผอ.วรเทพ ส่งคลิปขอโทษ "ผมจะไม่กลับไป"</div>
      <div style={{position: 'absolute', left: 40, top: 690, width: 720, height: 8, background: '#333'}}><div style={{width: `${30 + (p.f % 90) / 3}%`, height: 8, background: '#e33'}} /></div>
    </div>
    <Pool x={960} y={360} rx={500} color="150,190,255" a={0.25} />
  </Macro>
);

const Booth: ShotComponent = p => {
  if (p.shot.view === 'phone-clip-ins') return <PhoneClip p={p} />;
  return <Shot p={p} world={<><Soft p={p}><BoothWorld p={p} /></Soft><Actors p={p} /></>} />;
};

// ---------------------------------------------------------------- old pharmacy

export const PHARM = makeRoom({x: 940, y: 440}, {x0: 460, x1: 1460, y0: 190, y1: 730}, 2.8);

const PharmWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const r = PHARM, d = D(p);
  const torch = (d.torch ?? [1000, 520, 380]) as [number, number, number];
  return (
    <>
      <RoomShell r={r} id="pharm" wall="#9aa59c" side="#7f8a81" floorC="#5b5f5a" ceiling="#3a3e3b" floor="tiles" walls="plain" />
      {[0, 0.34, 0.68].map(u => <React.Fragment key={u}>
        <RBox r={r} u={[u + 0.02, u + 0.3]} v={[0.1, 1]} w={[0, 0.12]} front="#c7c3b4" side="#a29e90" top="#d6d2c4" />
        {[0.24, 0.42, 0.6, 0.78].map(v => <RFace key={v} r={r} pts={[[u + 0.02, v, 0.12], [u + 0.3, v, 0.12], [u + 0.3, v + 0.012, 0.12], [u + 0.02, v + 0.012, 0.12]]} fill="#8e8a7c" />)}
        <Svg>{Array.from({length: 24}, (_, i) => { const uu = u + 0.04 + (i % 6) * 0.042, vv = 0.18 + Math.floor(i / 6) * 0.18; if (rnd(91, i + u * 100) < (u === 0.34 ? 0.45 : 0.15)) return null; const q = r.P(uu, vv + 0.04, 0.1), k = r.s(0.1); return <rect key={i} x={q.x} y={q.y - 30 * k} width={34 * k} height={30 * k} fill={['#f0ece0', '#d8e4ea', '#e9d6c0', '#c22a24'][i % 4]} stroke="#6c6a60" strokeWidth={1} />; })}</Svg>
      </React.Fragment>)}
      <LightVeil id="pharm" lights={[torch]} o={0.88} color="#030405" />
      <Pool x={torch[0]} y={torch[1]} rx={torch[2] * 0.8} color="255,242,206" a={0.5} />
    </>
  );
};

const Pharm: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'ton-fif') return (
    <Shot p={p} world={<><PharmWorld p={p} /><Actors p={p} /></>} fore={<Svg>
      <path d="M0 0 H1920 V1080 H0 Z M620 300 H1300 V820 H620 Z" fill="#20262a" fillRule="evenodd" />
      <rect x={600} y={280} width={720} height={560} fill="none" stroke="#3a4044" strokeWidth={30} />
      <rect x={620} y={300} width={680} height={520} fill="#bcd6de" opacity={0.08} />
    </Svg>} foreBlur={2} foreDark={0.2} />
  );
  return <Shot p={p} world={<><Soft p={p}><PharmWorld p={p} /></Soft><Actors p={p} /></>} />;
};

// ---------------------------------------------------------------- ICU (new building, day)

export const ICU = makeRoom({x: 1000, y: 430}, {x0: 380, x1: 1620, y0: 170, y1: 720}, 3.0);

const ICU_MAT = 0.66;
/** the ICU bed; `blanket` = [u0, u1] pulls the pale blue blanket up over someone sitting in it */
const IcuBed: React.FC<{blanket?: [number, number]}> = ({blanket}) => {
  const r = ICU;
  return (
    <>
      <RBox r={r} u={[0.44, 0.84]} v={[0.8, 1]} w={[0.36, 0.48]} front="#9aa19e" />
      <RBox r={r} u={[0.44, 0.84]} v={[ICU_MAT, 0.8]} w={[0.3, 0.52]} front="#dfe4e2" top="#f4f6f4" side="#c1c7c4" />
      <RBox r={r} u={[0.44, 0.47]} v={[0.5, 0.8]} w={[0.3, 0.52]} front="#c3c9c6" />
      {blanket && <RBox r={r} u={[blanket[0], 0.83]} v={[ICU_MAT - 0.05, ICU_MAT]} w={[0.36, 0.53]} front="#a9c4d6" top="#c3d7e4" side="#8fb0c4" />}
      {/* the side rail, folded down on the near side */}
      <RBox r={r} u={[0.5, 0.78]} v={[ICU_MAT + 0.02, ICU_MAT + 0.035]} w={[0.53, 0.54]} front="#8a9296" />
    </>
  );
};
/** the raised back of the bed behind someone sitting up in it */
const IcuBackrest: React.FC<{u: number}> = ({u}) => (
  <RFace r={ICU} pts={[[u - 0.08, ICU_MAT, 0.34], [u + 0.08, ICU_MAT, 0.34], [u + 0.07, ICU_MAT - 0.3, 0.3], [u - 0.07, ICU_MAT - 0.3, 0.3]]} fill="#e9edeb" stroke="#9aa4a0" sw={4} />
);

const IcuWorld: React.FC<{p: ShotProps; inBed?: boolean}> = ({inBed}) => {
  const r = ICU;
  return (
    <>
      <RoomShell r={r} id="icu" wall="#e3e8e5" side="#cfd6d2" sideFar="#d8dfdb" floorC="#bfc4c1" ceiling="#e8ecea" floor="tiles" walls="plain" />
      <RFace r={r} pts={[[0.06, 0.16, 0], [0.4, 0.16, 0], [0.4, 0.62, 0], [0.06, 0.62, 0]]} fill="#fbfdf6" stroke="#9aa4a0" sw={6} />
      <RFace r={r} pts={[[0, 1, 0.1], [0.42, 1, 0.1], [0.62, 1, 0.8], [0.06, 1, 0.8]]} fill="#fff6dc" o={0.4} blend="screen" />
      <RFace r={r} pts={[[0.52, 0.3, 0], [0.66, 0.3, 0], [0.66, 0.46, 0], [0.52, 0.46, 0]]} fill="#101614" stroke="#3a403e" sw={4} />
      {!inBed && <IcuBed />}
      <RBox r={r} u={[0.88, 0.98]} v={[0.5, 1]} w={[0.3, 0.42]} front="#b4bcbd" top="#cdd4d5" />
      <RFace r={r} pts={[[0.86, 0.12, 0], [0.98, 0.12, 0], [0.98, 0.3, 0], [0.86, 0.3, 0]]} fill="#f3c9c1" />
      <LightVeil id="icu" lights={[[r.P(0.23, 0.4, 0).x, r.P(0.23, 0.4, 0).y, 900]]} o={0.12} color="#101010" />
      <Pool x={r.P(0.23, 0.4, 0).x} y={r.P(0.23, 0.4, 0).y} rx={700} color="255,248,226" a={0.42} />
    </>
  );
};

// someone sitting (`sit`) in the ICU sits up IN the bed: seat on the mattress, the backrest raised behind, the blanket
// and the bed's near side drawn over their legs. Everyone else stands on the floor.
const Icu: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: {...D(p0), seat: false}}};
  const cast = (D(p).cast ?? []) as string[];
  const inBed = cast.filter(c => /\bsit\b/.test(c));
  if (!inBed.length) return <Shot p={p} world={<><Soft p={p}><IcuWorld p={p} /></Soft><Actors p={p} /></>} />;
  const placed = inBed.map(c => {
    const a = c.trim().split(/\s+/), [who, pos] = a[0].split('@'), [x, y] = pos.split(',').map(Number);
    const h = Number((a.find(t => t.startsWith('h=')) ?? 'h=460').slice(2));
    const at = roomAt(ICU, x, y), w = 0.41, seat = ICU.P(at.u, ICU_MAT, w);
    return {c: [`${who}@${x},${(seat.y + 0.142 * h).toFixed(0)}`, ...a.slice(1)].join(' '), u: (x - ICU.vp.x) / ICU.s(w) + ICU.vp.x};
  }).map(o => ({...o, u: (o.u - ICU.back.x0) / (ICU.back.x1 - ICU.back.x0)}));
  const u0 = Math.min(...placed.map(o => o.u)) - 0.06;
  return <Shot p={p} world={<>
    <Soft p={p}><IcuWorld p={p} inBed /></Soft>
    {placed.map((o, i) => <IcuBackrest key={i} u={o.u} />)}
    <Actors p={p} cast={placed.map(o => o.c)} />
    <IcuBed blanket={[Math.max(0.47, u0), 0.83]} />
    <Actors p={p} cast={cast.filter(c => !inBed.includes(c))} />
  </>} />;
};

// ---------------------------------------------------------------- station, interview room, corridor

const Interview: React.FC<{p: ShotProps}> = ({p}) => (
  <>
    <Svg>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#16181b" />
      <rect x={-400} y={760} width={2800} height={700} fill="#24272a" />
      <polygon points="700,760 1260,760 1400,1080 560,1080" fill="#3a3530" />
      <rect x={640} y={640} width={680} height={40} fill="#5a4a38" /><rect x={660} y={680} width={20} height={300} fill="#2a2018" /><rect x={1280} y={680} width={20} height={300} fill="#2a2018" />
      <line x1={980} y1={-200} x2={980} y2={150} stroke="#111" strokeWidth={6} /><path d="M930 150 h100 l-20 30 h-60 Z" fill="#2a2a2a" /><circle cx={980} cy={190} r={16} fill="#fff4cf" />
    </Svg>
    <LightVeil id="iv" lights={[[980, 520, 560]]} o={0.8} color="#020203" />
    <Pool x={980} y={480} rx={460} color="255,236,190" a={0.4 * flicker(p.f, 2, 0.05)} />
  </>
);

const Corridor: React.FC = () => {
  const r = makeRoom({x: 1100, y: 440}, {x0: 900, x1: 1300, y0: 300, y1: 600}, 5.2);
  return (
    <>
      <RoomShell r={r} id="cor" wall="#dfe5e2" side="#ccd4d0" floorC="#b6bcb9" ceiling="#e6ebe8" floor="tiles" walls="plain" boards={6} />
      {[0.2, 0.45, 0.7].map(w => <RFace key={w} r={r} pts={[[0, 0.2, w], [0, 0.2, w + 0.1], [0, 1, w + 0.1], [0, 1, w]]} fill="#8aa7b9" stroke="#5a6f7c" sw={3} />)}
      <RFace r={r} pts={[[1, 0.3, 0.3], [1, 0.3, 0.5], [1, 0.42, 0.5], [1, 0.42, 0.3]]} fill="#2f6a8c" />
      {[0.15, 0.4, 0.65].map(w => <RFace key={w} r={r} pts={[[0.3, 0, w], [0.7, 0, w], [0.7, 0, w + 0.04], [0.3, 0, w + 0.04]]} fill="#ffffff" />)}
      <LightVeil id="cor" lights={[[1100, 500, 900]]} o={0.1} />
    </>
  );
};

const Station: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'nuan-room-close' || v === 'nuan-collapse-close') return <Shot p={p} world={<><Interview p={p} /><Actors p={p} /></>} />;
  if (v === 'ton-med') return <Shot p={p} world={<><Soft p={p}><Corridor /></Soft><Actors p={p} /></>} />;
  return <Shot p={p} grain={0.08} world={<><Soft p={p}><PoliceOffice /></Soft><Actors p={p} /></>} />;
};

// ---------------------------------------------------------------- exteriors

const META = makeBlock({x: 1180, y0: 140, y1: 820, hy: 860, left: {x: 220, k: 0.55}, right: {x: 1760, k: 0.7}});

const ExtWorld: React.FC<{p: ShotProps}> = ({p}) => {
  const b = META, d = D(p), day = d.light === 'day';
  const sky = day ? '#a9c9e6' : '#e08a5c';
  const winLit = (side: 'l' | 'r', i: number, fl: number) => !day && side === 'l' && fl === 3 && i === 2;
  return (
    <>
      <Svg><defs><linearGradient id="ext-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={day ? '#7fb0dc' : '#3a3156'} /><stop offset="1" stopColor={sky} /></linearGradient></defs><rect x={-400} y={-400} width={2800} height={1900} fill="url(#ext-sky)" /></Svg>
      <BGround b={b} fill={day ? '#8a8a82' : '#3a3836'} far={day ? '#9a9a90' : '#4a4642'} />
      <BWall b={b} side="l" fill={day ? '#e8dcbc' : '#a8987a'} />
      <BWall b={b} side="r" fill={day ? '#c9bd9e' : '#7a6e58'} />
      {[0, 1, 2, 3].map(fl => [0, 1, 2, 3, 4].map(i => (['l', 'r'] as const).map(side => <BRect key={`${fl}${i}${side}`} b={b} side={side} along={[0.08 + i * 0.18, 0.18 + i * 0.18]} h={[0.06 + fl * 0.24, 0.18 + fl * 0.24]} fill={winLit(side, i, fl) ? '#ffcf7a' : day ? '#5e7486' : '#1c2028'} frame="#3a332a" glow={winLit(side, i, fl) ? '#ffcf7a' : undefined} />)))}
      <BRoof b={b} fill={day ? '#8a4a32' : '#5a3020'} dark={day ? '#6a3622' : '#3a1e14'} rise={0.12} />
      {/* scaffolding with torn green cloth on half the left wall, gone by day at the end */}
      {!day && <Svg>{Array.from({length: 7}, (_, i) => { const a = b.W('l', 0.05 + i * 0.07, 0), c = b.W('l', 0.05 + i * 0.07, 1.02); return <line key={i} x1={a.x} y1={a.y} x2={c.x} y2={c.y} stroke="#c9b27a" strokeWidth={6} />; })}
        {[0.25, 0.5, 0.75, 1].map(h => { const a = b.W('l', 0.05, h), c = b.W('l', 0.47, h); return <line key={h} x1={a.x} y1={a.y} x2={c.x} y2={c.y} stroke="#c9b27a" strokeWidth={5} />; })}
        {(() => { const a = b.W('l', 0.1, 0.95), c = b.W('l', 0.45, 0.95), e = b.W('l', 0.45, 0.45), g = b.W('l', 0.1, 0.3); return <polygon points={`${a.x},${a.y} ${c.x},${c.y} ${e.x},${e.y} ${g.x},${g.y}`} fill="#2f6a3a" opacity={0.7} />; })()}</Svg>}
      {day && <Svg>{(() => { const q = b.W('l', 0.48, 0.86); return <path d={`M${q.x} ${q.y} q30 20 10 70 q-20 40 20 80`} stroke="#b9c5c7" strokeWidth={26} fill="none" opacity={0.9} />; })()}</Svg>}
      <BPole b={b} at={[-0.25, -0.6]} h={1.4} lamp={day ? undefined : '#ffd27a'} />
      <BFloor b={b} pts={[[-0.6, -0.9], [-0.1, -0.9], [-0.1, -0.3], [-0.6, -0.3]]} fill={day ? '#ffffff' : '#ffd27a'} o={day ? 0.0 : 0.18} blend="screen" />
    </>
  );
};

const Scaffold: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#a9c9e6" z={1.06} ox={960} oy={480}>
    <Svg>
      <rect x={0} y={0} width={1920} height={1080} fill="#e8dcbc" />
      {Array.from({length: 8}, (_, i) => <line key={i} x1={120 + i * 240} y1={-20} x2={140 + i * 240} y2={1100} stroke="#c9b27a" strokeWidth={22} />)}
      {[160, 460, 760].map(y => <line key={y} x1={-20} y1={y} x2={1940} y2={y + 30} stroke="#b39a62" strokeWidth={18} />)}
      <path d="M300 80 L1500 120 L1460 620 Q1200 700 980 580 Q760 760 520 600 L300 640 Z" fill="#2f6a3a" opacity={0.82} />
      <path d="M980 580 L1010 720 M760 640 L700 820" stroke="#2f6a3a" strokeWidth={30} opacity={0.7} />
      <rect x={1180} y={640} width={560} height={260} fill="#c8ccc8" stroke="#6e726e" strokeWidth={8} transform="rotate(-4 1460 770)" />
    </Svg>
    <div style={{position: 'absolute', left: 1230, top: 690, width: 480, transform: 'rotate(-4deg)', fontFamily: 'Kanit', fontWeight: 700, fontSize: 60, color: '#b8312a', lineHeight: 1.15, textAlign: 'center'}}>ระงับโครงการ<br />ชั่วคราว</div>
    <Pool x={1600} y={200} rx={700} color="255,250,230" a={0.3} />
  </Macro>
);

const Ext: ShotComponent = p => {
  if (p.shot.view === 'scaffold-ins') return <Scaffold p={p} />;
  return <Shot p={p} world={<ExtWorld p={p} />} />;
};

// ---------------------------------------------------------------- phone (split call, the hidden phone's screen)

const PhoneScene: ShotComponent = p => {
  const v = p.shot.view ?? '', f = p.f;
  if (v === 'call-split') {
    const left = <Shot p={{...p, shot: {...p.shot, data: {...D(p), cam: [2.6, 2.7, 1340, 420], cast: ['may@1300,870 h=470 worried arm=r-phone prop=phone-ear yaw=0.35 talk']}}}} world={<><StairWorld p={p} /><Actors p={{...p, shot: {...p.shot, data: {...D(p), cast: ['may@1300,870 h=470 worried arm=r-phone prop=phone-ear yaw=0.35 talk']}}}} /></>} />;
    const right = <Shot p={{...p, shot: {...p.shot, who: undefined, data: {...D(p), cam: [2.6, 2.7, 960, 420], cast: ['nuan3@960,880 h=480 worried arm=r-phone prop=phone-ear yaw=-0.35']}}}} world={<><Bedroom /><Actors p={{...p, shot: {...p.shot, who: undefined, data: {...D(p), cast: ['nuan3@960,880 h=480 worried arm=r-phone prop=phone-ear yaw=-0.35']}}}} /></>} />;
    return <Split W={1920} H={1080} a={left} b={right} angle={8} />;
  }
  if (v === 'nuan-call-close') return <Shot p={p} world={<><Soft p={p}><Bedroom /></Soft><Actors p={p} /></>} />;
  // the hidden phone's screen: the other end of the call walks up the ramp
  // The frame is the phone's screen: what the other end of the call sees and sends, the call UI over it.
  const faces = v === 'call-faces-pov';
  const cast = faces ? ['nuan2@860,980 h=640 wary yaw=0.25 look=0.5 acc=glasses', 'pakorn@1160,990 h=680 wary yaw=-0.25 arm=r-hold prop=paper'] : [];
  const sway = faces ? 0 : Math.sin(f / 6) * 18;
  const q = {...p, shot: {...p.shot, who: undefined, data: {...D(p), cam: faces ? [1.55, 1.62, 1010, 600 + sway] : [1.15, 1.25, 980 + sway, 600], light: 'night', lightAt: [1010, 1000], cast,
    torches: faces ? [[1010, 1020]] : [[980 + sway, 1040]], green: true}}};
  return (
    <div style={{position: 'absolute', inset: 0, background: '#000'}}>
      <Shot p={q} world={<><StairWorld p={q} /><Actors p={q} />
        {faces && <Pool x={1010} y={760} rx={420} color="255,244,214" a={0.45} />}
        {!faces && <Svg><g transform={`translate(${960 + sway * 2} ${1010})`}><path d="M-90 -50 Q0 -90 90 -50" stroke="#9aa2a4" strokeWidth={8} fill="none" /><rect x={-60} y={-40} width={46} height={30} rx={8} fill="none" stroke="#c9a24a" strokeWidth={6} /><rect x={14} y={-40} width={46} height={30} rx={8} fill="none" stroke="#c9a24a" strokeWidth={6} /></g></Svg>}</>} />
      {/* call UI: a dark phone bezel at the frame edge, the timer, the small self view of the ward bed */}
      <div style={{position: 'absolute', inset: 0, border: '26px solid #0b0c0e', borderRadius: 60, pointerEvents: 'none'}} />
      <div style={{position: 'absolute', left: 70, top: 56, fontFamily: 'Kanit', fontSize: 40, color: '#fff', textShadow: '0 2px 8px #000'}}>● วิดีโอคอล · 19:12:{String(40 + Math.floor(f / 30) % 20).padStart(2, '0')}</div>
      <div style={{position: 'absolute', right: 70, top: 56, width: 300, height: 190, background: '#20262a', border: '4px solid #fff', borderRadius: 16, overflow: 'hidden'}}>
        <div style={{width: 1920, height: 1080, transform: 'scale(.156)', transformOrigin: '0 0', position: 'relative'}}><WardWorld p={{...p, shot: {...p.shot, data: {curtain: 'open'}}}} /></div>
      </div>
    </div>
  );
};

/** Nuan's bedroom at night: the bedside lamp, the phone lit in her hand */
const Bedroom: React.FC = () => {
  const r = makeRoom({x: 940, y: 440}, {x0: 500, x1: 1400, y0: 200, y1: 740}, 2.8);
  return (
    <>
      <RoomShell r={r} id="nbed" wall="#6e6a7a" side="#5a5666" floorC="#4a4038" ceiling="#2a2830" floor="boards" walls="plain" />
      <RBox r={r} u={[0.2, 0.8]} v={[0.82, 0.92]} w={[0.3, 0.75]} front="#c9c2d6" top="#ddd6e8" />
      <RBox r={r} u={[0.82, 0.95]} v={[0.8, 1]} w={[0.2, 0.32]} front="#5a4030" top="#6e503c" />
      <RFace r={r} pts={[[0.06, 0.2, 0], [0.3, 0.2, 0], [0.3, 0.5, 0], [0.06, 0.5, 0]]} fill="#1a1e2a" stroke="#3a3440" sw={5} />
      <RFace r={r} pts={[[0.36, 0.24, 0], [0.48, 0.24, 0], [0.48, 0.4, 0], [0.36, 0.4, 0]]} fill="#d9c58a" />
      <LightVeil id="nbed" lights={[[r.P(0.88, 0.7, 0.26).x, r.P(0.88, 0.7, 0.26).y, 420]]} o={0.7} />
      <Pool x={r.P(0.88, 0.7, 0.26).x} y={r.P(0.88, 0.7, 0.26).y} rx={380} color="255,214,150" a={0.45} />
    </>
  );
};

// ---------------------------------------------------------------- flashbacks (past grade, same places)

const BoardRoom: React.FC = () => {
  const r = makeRoom({x: 960, y: 420}, {x0: 420, x1: 1500, y0: 180, y1: 720}, 3.2);
  return (
    <>
      <RoomShell r={r} id="board" wall="#9b8a6e" side="#7d6e56" floorC="#5a4a3a" ceiling="#3a3028" floor="boards" walls="plain" />
      {/* the one big window behind the chairman's place, blinds half down: the light of the room and his silhouette */}
      <RFace r={r} pts={[[0.62, 0.16, 0], [0.92, 0.16, 0], [0.92, 0.6, 0], [0.62, 0.6, 0]]} fill="#f6ecd0" stroke="#4a3a28" sw={6} />
      {[0.2, 0.25, 0.3].map(v => <RFace key={v} r={r} pts={[[0.62, v, 0], [0.92, v, 0], [0.92, v + 0.03, 0], [0.62, v + 0.03, 0]]} fill="#b9a67e" />)}
      {/* a framed hospital crest on the left of the back wall */}
      <RFace r={r} pts={[[0.2, 0.22, 0], [0.34, 0.22, 0], [0.34, 0.44, 0], [0.2, 0.44, 0]]} fill="#6a5034" stroke="#3a2a18" sw={5} />
      {/* the long table running away from camera, high-backed chairs down both sides, empty: the meeting is over */}
      {[0.24, 0.36, 0.48].map(w => <React.Fragment key={'l' + w}>
        <RBox r={r} u={[0.255, 0.285]} v={[0.66, 0.86]} w={[w, w + 0.06]} front="#2e2420" side="#241c18" top="#3a2e28" />
        <RBox r={r} u={[0.645, 0.675]} v={[0.66, 0.86]} w={[w, w + 0.06]} front="#2e2420" side="#241c18" top="#3a2e28" />
      </React.Fragment>)}
      {[0.32, 0.6].map(u => [0.2, 0.58].map(w => <RBox key={`${u}${w}`} r={r} u={[u, u + 0.015]} v={[0.8, 1]} w={[w, w + 0.015]} front="#3a2414" />))}
      <RBox r={r} u={[0.3, 0.62]} v={[0.78, 0.8]} w={[0.18, 0.6]} front="#5a3a22" top="#7a5236" side="#4a2e1a" />
      {/* the drug ledger slapped down at the near end: a fat red binder, pages fanned */}
      <RBox r={r} u={[0.47, 0.57]} v={[0.765, 0.78]} w={[0.5, 0.57]} front="#9a2a22" top="#b8382c" side="#7a1e18" />
      <RFace r={r} pts={[[0.48, 0.764, 0.51], [0.56, 0.764, 0.51], [0.56, 0.764, 0.56], [0.48, 0.764, 0.56]]} fill="#efe8d4" />
      <LightVeil id="board" lights={[[r.P(0.77, 0.4, 0).x, r.P(0.77, 0.4, 0).y, 760], [r.P(0.52, 0.78, 0.54).x, r.P(0.52, 0.78, 0.54).y, 300]]} o={0.55} />
      <Pool x={r.P(0.77, 0.38, 0).x} y={r.P(0.77, 0.38, 0).y} rx={520} color="255,236,190" a={0.45} />
    </>
  );
};

const Border: React.FC<{p: ShotProps}> = ({p}) => (
  <>
    <Svg>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0d1018" />
      <rect x={-400} y={700} width={2800} height={800} fill="#2a2a2a" />
      <rect x={600} y={260} width={900} height={60} fill="#5a5a5a" /><rect x={620} y={320} width={40} height={400} fill="#4a4a4a" /><rect x={1440} y={320} width={40} height={400} fill="#4a4a4a" />
      <rect x={300} y={600} width={760} height={30} fill="#d33" transform={`rotate(${-kf(p.f, [[0, 0], [40, 60]])} 300 615)`} />
      <rect x={900 - kf(p.f, [[0, 0], [p.len, 300]])} y={540} width={520} height={200} rx={30} fill="#d8d8d0" /><rect x={940 - kf(p.f, [[0, 0], [p.len, 300]])} y={560} width={200} height={70} fill="#2a3a4a" />
      {[860, 1300].map(x => <circle key={x} cx={x - kf(p.f, [[0, 0], [p.len, 300]])} cy={740} r={44} fill="#111" />)}
      <circle cx={1050} cy={290} r={30} fill="#ffb25c" />
    </Svg>
    <LightVeil id="border" lights={[[1050, 400, 600]]} o={0.6} />
    <Pool x={1050} y={420} rx={600} color="255,178,92" a={0.35} />
  </>
);

const Past: ShotComponent = p => {
  const v = p.shot.view ?? '';
  const q = {...p, shot: {...p.shot, data: {...D(p), past: true}}};
  if (v === 'board-past-wide') return <Shot p={q} world={<><BoardRoom /><Actors p={q} /></>} />;
  if (v === 'ramp-past-high') return <Shot p={q} world={<><StairWorld p={q} />{D(q).gurney ? <RollingBed p={q} /> : <Actors p={q} />}</>} />;
  if (v === 'border-past-wide') return <Shot p={q} world={<Border p={q} />} />;
  if (v === 'error-past-close') return <Shot p={q} world={<><WardWorld p={{...q, shot: {...q.shot, data: {...D(q), time: 'day', curtain: 'tied', bed1: 'patient'}}}} /><Actors p={q} /></>} />;
  return <Shot p={q} world={<BoardRoom />} />;
};

export const PLACES: Record<string, ShotComponent> = {canteen: Canteen, lobby: Lobby, stair: Stair, booth: Booth, pharm: Pharm, icu: Icu, station: Station, ext: Ext, phone: PhoneScene, past: Past};
void C;
