import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {flicker} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {Mitten} from '../../cast/Rig';
import {LightVeil, RBox, RFace, RoomShell, makeRoom, type Room} from '../../kit/room';
import {ActorView, parseActor} from '../../kit/stage';
import {Actors, C, PX_CM, ROSTER} from './cast';
import {BigEye, BigMouth, D, FloorMist, FoamBox, K, Lotus, Macro, Pen, Pool, Sheet, Shot, Soft, Svg, Typed, zOf} from './common';
import {EarEcu} from './stall';
import {LaidFace} from './meru';

// ห้องน้ำแข็งใต้ดิน (brief.md → Sets). A long concrete room built once in perspective: steel freezers down both walls, a
// surgical lamp over a steel table in the middle, a shelf and scale on the left, locker 0 closing the far end. Lit three
// ways, the story's clock: lamp (the lamp is the only light) · neon (Thyme turns on every tube, ch. 7) · siren (the end).
// The locker's inside is its own world: one small bulb over a slab of ice, the darkest frames in the film.

const STAND = 0.714;
const room = (vp = {x: 1080, y: 400}) => makeRoom(vp, {x0: 760, x1: 1400, y0: 267, y1: 627}, 5);
const R = room();
const RLOW = makeRoom({x: 1040, y: 830}, {x0: 740, x1: 1380, y0: 330, y1: 900}, 5);
const RFAR = makeRoom({x: 760, y: 400}, {x0: 500, x1: 1100, y0: 267, y1: 627}, 5);
const STEEL = '#8d979c', STEELD = '#5f696e';

type Mode = 'lamp' | 'neon' | 'siren';
const modeOf = (p: ShotProps): Mode => (D(p).mode as Mode) ?? 'lamp';

/** where the lamp hangs in this room */
const lampAt = (r: Room) => r.P(0.5, 0.2, 0.55);

const Room3: React.FC<{p: ShotProps; r?: Room; mode: Mode; id?: string; table?: boolean; opened?: boolean; box?: boolean}> = ({p, r = R, mode, id = 'ice', table = true, opened, box = true}) => {
  const lamp = lampAt(r);
  const neon = mode === 'neon';
  const fl = neon ? flicker(p.f, 3, 0.25) : 1;
  const concrete = neon ? '#6d7276' : '#3f4448', floorC = neon ? '#51565a' : '#2d3135';
  const lockers = (u: number) => Array.from({length: 7}, (_, i) => {
    const w0 = 0.03 + i * 0.135, w1 = w0 + 0.125;
    const q = r.P(u, 0.56, (w0 + w1) / 2);
    return (
      <React.Fragment key={u + '-' + i}>
        <RFace r={r} pts={[[u, 0.14, w0], [u, 0.14, w1], [u, 1, w1], [u, 1, w0]]} fill={u ? STEELD : STEEL} stroke="#1b2022" sw={4} />
        <Svg><rect x={q.x - 5 * r.s(w0)} y={q.y - 30 * r.s(w0)} width={10 * r.s(w0)} height={60 * r.s(w0)} fill="#c2cacd" /></Svg>
      </React.Fragment>
    );
  });
  const lockerBack = {u0: 0.26, u1: 0.74};
  return (
    <>
      <RoomShell r={r} id={id} wall={concrete} side={concrete} floorC={floorC} ceiling={neon ? '#3b3f42' : '#16181a'} floor="plain" walls="plain" />
      {/* damp on the concrete, wet on the floor */}
      <Svg>{Array.from({length: 18}, (_, i) => { const q = r.P(rnd(101, i), 1, rnd(102, i)); return <ellipse key={i} cx={q.x} cy={q.y} rx={70 * r.s(rnd(102, i))} ry={10 * r.s(rnd(102, i))} fill="#000" opacity={0.2} />; })}</Svg>
      {lockers(0)}{lockers(1)}
      {/* pipes along the ceiling */}
      <Svg>{[0.2, 0.8].map(u => { const a = r.P(u, 0.03, 0), b = r.P(u, 0.03, 1); return <line key={u} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#0d0f10" strokeWidth={16} />; })}</Svg>
      {/* neon tubes: dead unless Thyme has turned them on */}
      <Svg>{[0.14, 0.34, 0.54, 0.74, 0.92].map(w => { const a = r.P(0.42, 0.015, w), b = r.P(0.58, 0.015, w); return <line key={w} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={neon ? '#e8f4ff' : '#3a3e41'} strokeWidth={9 * r.s(w) * 0.6} opacity={neon ? fl : 1} />; })}</Svg>
      {/* locker 0, floor to ceiling, chained */}
      <RFace r={r} pts={[[lockerBack.u0, 0.02, 0], [lockerBack.u1, 0.02, 0], [lockerBack.u1, 1, 0], [lockerBack.u0, 1, 0]]} fill={opened ? '#050506' : '#6d777c'} stroke="#111416" sw={6} />
      {!opened && (() => {
        const c = r.P(0.5, 0.42, 0), a = r.P(lockerBack.u0, 0.56, 0), b = r.P(lockerBack.u1, 0.56, 0);
        return (
          <>
            <div style={{position: 'absolute', left: c.x - 80, top: c.y - 110, width: 160, textAlign: 'center', fontFamily: 'Kanit, sans-serif', fontWeight: 700, fontSize: 170, lineHeight: 1, color: '#8c1c1c', opacity: 0.85}}>0</div>
            <Svg><path d={`M${a.x} ${a.y} Q${c.x} ${a.y + 30} ${b.x} ${b.y}`} stroke="#1e2021" strokeWidth={11} strokeDasharray="14 7" fill="none" /></Svg>
          </>
        );
      })()}
      {opened && (() => { const c = r.P(0.5, 0.5, 0); return <Pool x={c.x} y={c.y} rx={120} ry={120} color="220,235,255" a={0.45} />; })()}
      {/* shelf with three files, the scale at its foot */}
      <RBox r={r} u={[0.015, 0.14]} v={[0.26, 0.3]} w={[0.74, 0.92]} front="#3a4145" top="#4e575c" side="#262b2e" />
      <RBox r={r} u={[0.015, 0.14]} v={[0.5, 0.54]} w={[0.74, 0.92]} front="#3a4145" top="#4e575c" side="#262b2e" />
      <RBox r={r} u={[0.02, 0.13]} v={[0.92, 1]} w={[0.74, 0.92]} front="#535a5e" top="#737c80" side="#3a4145" />
      {/* the table under the lamp */}
      {table && <>
        <RBox r={r} u={[0.39, 0.41]} v={[0.68, 1]} w={[0.47, 0.5]} front="#70797e" />
        <RBox r={r} u={[0.59, 0.61]} v={[0.68, 1]} w={[0.47, 0.5]} front="#70797e" />
        <RBox r={r} u={[0.36, 0.64]} v={[0.65, 0.68]} w={[0.4, 0.6]} front="#a7b1b6" top="#ccd5d9" />
        {box && (() => { const q = r.P(0.5, 0.65, 0.5); return <FoamBox x={q.x} y={q.y} w={92 * r.s(0.5)} />; })()}
      </>}
      <LightVeil id={id} lights={neon ? [[lamp.x, lamp.y + 240, 900]] : [[lamp.x, lamp.y + 300, 460]]} o={neon ? 0.16 : 0.6} color="#04060a" />
      {/* the lamp: six white eyes on a dish */}
      <Svg>
        <line x1={lamp.x} y1={r.P(0.5, 0, 0.55).y} x2={lamp.x} y2={lamp.y - 26} stroke="#111" strokeWidth={10} />
        <ellipse cx={lamp.x} cy={lamp.y} rx={120} ry={32} fill="#23282b" stroke="#0a0b0c" strokeWidth={5} />
        <ellipse cx={lamp.x} cy={lamp.y + 6} rx={104} ry={22} fill={neon ? '#7c868b' : '#fdfdf6'} />
      </Svg>
      {!neon && <>
        <div style={{position: 'absolute', left: lamp.x - 460, top: lamp.y, width: 920, height: r.P(0.5, 1, 0.55).y - lamp.y, pointerEvents: 'none', mixBlendMode: 'screen', clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)', background: 'linear-gradient(rgba(240,248,255,.34), rgba(240,248,255,.06))'}} />
        <Pool x={lamp.x} y={lamp.y} rx={260} color="245,250,255" a={0.75} />
        <Pool x={lamp.x} y={r.P(0.5, 1, 0.55).y - 10} rx={420} ry={90} color="235,245,255" a={0.3} />
      </>}
      {mode === 'siren' && <>
        <div style={{position: 'absolute', left: -600, top: -500, width: 1800, height: 2000, background: `rgba(230,30,30,${Math.floor(p.f / 12) % 2 ? 0.22 : 0.05})`, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 1200, top: -500, width: 1400, height: 2000, background: `rgba(40,80,240,${Math.floor(p.f / 12) % 2 ? 0.05 : 0.26})`, mixBlendMode: 'screen'}} />
      </>}
      <FloorMist y={r.P(0.5, 1, 0.7).y - 40} f={p.f} a={neon ? 0.16 : 0.3} h={220} />
    </>
  );
};

// ---------------------------------------------------------------- the table, close

/** Steel table under the lamp, the box on it. Same frame at 0:30 and at 12:00 (8 ↔ 125) */
const BoxIns: React.FC<{p: ShotProps; tag?: boolean; seep?: number}> = ({p, tag, seep = 0.15}) => (
  <Macro p={p} bg="#030405" at={[50, 42]} vig={0.9} inner={24}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 680, background: 'radial-gradient(ellipse at 50% 0%, #2d3236, #0a0c0d 62%)'}} />
    <Svg>
      <path d="M260 660 L1660 660 L1880 1100 L40 1100 Z" fill="#9aa5aa" />
      <path d="M260 660 L1660 660 L1880 1100 L40 1100 Z" fill="url(#ice-t)" />
      <defs><radialGradient id="ice-t" cx="50%" cy="20%" r="70%"><stop offset="0" stopColor="#fff" stopOpacity={0.6} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></radialGradient></defs>
      <rect x={260} y={648} width={1400} height={14} fill="#d7dfe2" />
    </Svg>
    <FoamBox x={960} y={760} w={560} tag={tag} seep={seep} />
    <Svg><ellipse cx={960} cy={776} rx={330} ry={22} fill="#000" opacity={0.3} /></Svg>
    <Pool x={960} y={-20} rx={640} ry={340} color="245,250,255" a={0.8} />
    <div style={{position: 'absolute', left: 300, top: -20, width: 1320, height: 800, clipPath: 'polygon(36% 0, 64% 0, 100% 100%, 0 100%)', background: 'linear-gradient(rgba(240,248,255,.34), rgba(240,248,255,.03))', mixBlendMode: 'screen'}} />
    <FloorMist y={1030} f={p.f} a={0.2} />
  </Macro>
);

const SeepEcu: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#050606" at={[44, 40]} vig={0.82} inner={28} z={1.07} ox={1100} oy={500}>
      <Svg>
        <rect x={-20} y={380} width={1960} height={720} fill="#a2adb2" />
        <rect x={-20} y={380} width={1960} height={720} fill="url(#seep-g)" />
        <defs><linearGradient id="seep-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.4} /><stop offset="1" stopColor="#000" stopOpacity={0.5} /></linearGradient></defs>
        {[560, 820].map(y => <line key={y} x1={-20} y1={y} x2={1940} y2={y} stroke="#6d777c" strokeWidth={6} />)}
        <rect x={-20} y={-20} width={1060} height={640} fill={C.foam} stroke="#a8a496" strokeWidth={5} />
        <rect x={-20} y={330} width={1060} height={80} fill={C.tape} />
        <path d={`M1040 590 Q${1090 + 90 * k} 610 ${1200 + 500 * k} 650 Q${1320 + 340 * k} 720 ${1500 + 300 * k} 816 L${1500 + 300 * k} 824 Q${1300 + 200 * k} 720 ${1180 + 200 * k} 672 Q1090 640 1020 620 Z`} fill="#a10f16" />
        <ellipse cx={1020} cy={620} rx={60} ry={12} fill="#7b0a10" />
        <ellipse cx={1500} cy={720} rx={240} ry={60} fill="#fff" opacity={0.28} />
      </Svg>
      <Pool x={800} y={200} rx={900} color="245,250,255" a={0.3} />
    </Macro>
  );
};

/** Straight down from the lamp: the box dead centre, its shadow gone, one red thread coming at us */
const BoxHigh: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#020203" at={[50, 48]} vig={0.96} inner={20} z={1.05} oy={500}>
    <Svg>
      <rect x={200} y={-100} width={1520} height={1300} fill="#a2adb2" />
      <rect x={200} y={-100} width={40} height={1300} fill="#6d777c" /><rect x={1680} y={-100} width={40} height={1300} fill="#6d777c" />
      <rect x={640} y={230} width={640} height={460} fill="#fbf9f1" stroke="#a8a496" strokeWidth={6} />
      <rect x={880} y={230} width={160} height={460} fill={C.tape} />
      <rect x={640} y={395} width={640} height={130} fill={C.tape} />
      <text x={750} y={340} fontFamily="Kanit, sans-serif" fontWeight={700} fontSize={78} fill="#17151a" textAnchor="middle">A-0</text>
      <path d="M1040 690 Q1090 800 1050 900 T1120 1200" stroke="#a10f16" strokeWidth={16} fill="none" strokeLinecap="round" />
    </Svg>
    <Pool x={960} y={450} rx={860} ry={640} color="245,250,255" a={0.3} />
  </Macro>
);

// ---------------------------------------------------------------- ramp

const Ramp: React.FC<{p: ShotProps; kind: 'pov' | 'knock' | 'run' | 'police' | 'prasit'}> = ({p, kind}) => {
  const f = p.f, k = K(p);
  const up = kind !== 'pov';
  const glow = kind === 'pov' ? '#c9d6e0' : kind === 'run' ? '#d7e8f4' : kind === 'knock' ? '#6f7880' : kind === 'police' ? '#27314f' : '#cfe0ec';
  return (
    <Macro p={p} bg="#020203" at={[50, up ? 34 : 44]} vig={0.9} inner={22} z={1.05} oy={420}>
      <Svg>
        <path d="M-40 1120 L760 520 L1160 520 L1960 1120 Z" fill={kind === 'run' ? '#3c4246' : '#22262a'} />
        <path d="M-40 -40 L760 260 L1160 260 L1960 -40 Z" fill="#0b0c0e" />
        <path d="M-40 -40 L760 260 L760 520 L-40 1120 Z" fill={kind === 'run' ? '#23272a' : '#131517'} />
        <path d="M1960 -40 L1160 260 L1160 520 L1960 1120 Z" fill={kind === 'run' ? '#1d2023' : '#101214'} />
        <rect x={760} y={260} width={400} height={260} fill={glow} />
        {[0, 1].map(j => <path key={j} d={`M${j ? 1430 : 490} 1120 L${j ? 1010 : 910} 520`} stroke="#0f1012" strokeWidth={46} />)}
        {[0, 1].map(j => <path key={'x' + j} d={`M${j ? 1430 : 490} 1120 L${j ? 1010 : 910} 520`} stroke="#3a3f43" strokeWidth={46} strokeDasharray="6 16" opacity={0.6} />)}
        {kind === 'run' && [0.2, 0.4, 0.6, 0.8].map((t, i) => { const y = 260 - 260 * t, x0 = 760 - 800 * t, x1 = 1160 + 800 * t; return <line key={i} x1={x0} y1={y} x2={x1} y2={y} stroke="#eaf6ff" strokeWidth={8} opacity={k * 4 > i ? 1 : 0.1} />; })}
      </Svg>
      <Pool x={960} y={390} rx={560} ry={320} color={kind === 'police' ? '120,140,255' : '220,235,245'} a={kind === 'knock' ? 0.26 : 0.55} />
      {kind === 'knock' && <div style={{position: 'absolute', left: 950, top: 220, width: 8, height: 460, background: 'linear-gradient(rgba(255,250,220,.9), rgba(255,250,220,0))', transform: 'rotate(16deg)', transformOrigin: '50% 0', filter: 'blur(2px)'}} />}
      {kind === 'run' && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><ActorView a={{...parseActor('thyme-sil@960,860 run'), h: 560}} roster={ROSTER} floor={860} pxPerCm={PX_CM} f={f} /></div>}
      {kind === 'prasit' && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><ActorView a={{...parseActor('prasit-sil@960,560'), h: 300}} roster={ROSTER} floor={560} pxPerCm={PX_CM} f={f} /></div>}
      {kind === 'police' && <>
        <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}>
          {[[780, 610, 400], [960, 570, 340], [1140, 610, 400]].map(([x, y, h], i) => <ActorView key={i} a={{...parseActor(`police-sil@${x},${y} armR=hold`), h}} roster={ROSTER} floor={y} pxPerCm={PX_CM} f={f} />)}
        </div>
        {[[800, 430, 1500, 900], [960, 400, 900, 1100], [1120, 430, 300, 900]].map(([x, y, x2, y2], i) => (
          <Svg key={i}><path d={`M${x} ${y} L${x2 - 90} ${y2} L${x2 + 90} ${y2} Z`} fill="#fbf6d8" opacity={0.18} style={{filter: 'blur(4px)'}} /></Svg>
        ))}
        <div style={{position: 'absolute', left: 760, top: 80, width: 400, height: 220, background: Math.floor(f / 12) % 2 ? 'rgba(255,40,40,.5)' : 'rgba(50,90,255,.55)', filter: 'blur(24px)'}} />
      </>}
      <FloorMist y={760} f={f * 2} a={kind === 'run' ? 0.22 : 0.4} h={300} />
      <FloorMist y={1000} f={f * 3} a={0.3} h={260} seed={9} />
      {kind === 'pov' && <>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 520px 460px at 50% 76%, rgba(240,246,255,.3), rgba(0,0,0,0) 100%)', mixBlendMode: 'screen'}} />
        <Pool x={960} y={830} rx={520} ry={300} color="240,246,255" a={0.36} />
      </>}
    </Macro>
  );
};

const RampTracks: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#030303" at={[50, 56]} vig={0.94} inner={22} z={1.04}>
    <div style={{position: 'absolute', inset: 0, background: '#3b3d3e'}} />
    <Svg>
      {Array.from({length: 240}, (_, i) => <circle key={i} cx={rnd(121, i) * 1920} cy={rnd(122, i) * 1080} r={1 + rnd(123, i) * 5} fill={i % 2 ? '#26272a' : '#54565a'} />)}
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${200 + i * 180} 1120 L${760 + i * 50} -20`} stroke={i % 2 ? '#1f2022' : '#262729'} strokeWidth={40 + (i % 3) * 8} opacity={0.72} />)}
      {/* his shoe stepping over them */}
      <path d="M1180 640 Q1460 620 1590 760 Q1610 810 1540 820 L1200 820 Q1130 740 1180 640 Z" fill="#141518" stroke="#000" strokeWidth={5} />
      <rect x={1160} y={280} width={210} height={410} fill={C.dayPants} />
    </Svg>
    <FloorMist y={260} f={p.f} a={0.34} h={300} />
    <Pool x={880} y={600} rx={800} ry={540} color="240,246,255" a={0.3} />
  </Macro>
);

// ---------------------------------------------------------------- locker 0

const Bulb0: React.FC<{x?: number; y?: number}> = ({x = 960, y = 60}) => (
  <>
    <Svg><line x1={x} y1={-20} x2={x} y2={y} stroke="#000" strokeWidth={6} /><circle cx={x} cy={y + 16} r={18} fill="#fff7dc" /></Svg>
    <Pool x={x} y={y + 16} rx={200} color="255,246,214" a={0.75} />
  </>
);

/** The slab: from the door, then from straight above. Head far, feet near. The sheet goes flat at the hips. */
const Slab: React.FC<{p: ShotProps; top?: boolean; reveal?: boolean}> = ({p, top, reveal}) => (
  <Macro p={p} bg="#010102" at={[50, top ? 36 : 28]} vig={0.97} inner={18} z={reveal ? 1.08 : 1.04} oy={260}>
    <Svg>
      {!top && <path d="M520 240 L1400 240 L1820 1120 L100 1120 Z" fill="#1d2a31" />}
      {top && <rect x={460} y={-60} width={1000} height={1220} fill="#2a3a42" />}
      {!top && <path d="M580 250 L1340 250 L1680 1120 L240 1120 Z" fill="#c5d7de" />}
      {top && <rect x={510} y={-40} width={900} height={1180} fill="#c5d7de" />}
      {Array.from({length: 40}, (_, i) => <circle key={i} cx={560 + rnd(131, i) * 800} cy={260 + rnd(132, i) * 800} r={2 + rnd(133, i) * 5} fill="#fff" opacity={0.75} />)}
    </Svg>
    <LaidFace x={960} y={top ? -10 : 90} h={top ? 900 : 1040} f={p.f} />
    {/* the sheet: full over the chest, a crease at the hips, and from there it lies flat on the ice */}
    <Svg>
      <path d={top ? 'M640 372 Q960 322 1280 372 L1320 1140 L600 1140 Z' : 'M680 500 Q960 462 1240 500 L1600 1120 L320 1120 Z'} fill="#efece2" stroke="#a9a99d" strokeWidth={5} />
      <ellipse cx={960} cy={top ? 490 : 590} rx={top ? 300 : 280} ry={top ? 130 : 88} fill="#fffef9" style={{filter: 'blur(22px)'}} />
      <path d={top ? 'M628 640 Q960 700 1292 640' : 'M580 700 Q960 756 1340 700'} stroke="#8d8d82" strokeWidth={10} fill="none" />
      <path d={top ? 'M628 656 Q960 716 1292 656 L1320 760 Q960 790 600 760 Z' : 'M580 716 Q960 772 1340 716 L1430 830 Q960 870 490 830 Z'} fill="#000" opacity={0.14} style={{filter: 'blur(10px)'}} />
      {(top ? [760, 960, 1160] : [-1, 0, 1]).map((q, i) => top
        ? <line key={i} x1={q} y1={720} x2={q + (q - 960) * 0.06} y2={1140} stroke="#d4d2c6" strokeWidth={5} />
        : <line key={i} x1={960 + q * 150} y1={770} x2={960 + q * 330} y2={1120} stroke="#d4d2c6" strokeWidth={5} />)}
    </Svg>
    <Bulb0 y={top ? -30 : -10} />
    <Pool x={960} y={260} rx={460} color="255,246,214" a={0.26} />
    <FloorMist y={1020} f={p.f} a={0.24} />
  </Macro>
);

const FaceClose: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#020203" at={[50, 40]} vig={0.86} inner={28} z={1.05}>
    <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#9ab0b9" /></Svg>
    <div style={{filter: 'saturate(.5) brightness(.96) contrast(1.05)', position: 'absolute', left: 0, top: 0}}><LaidFace x={960} y={-60} h={2000} f={p.f} /></div>
    <Svg>
      {Array.from({length: 26}, (_, i) => <path key={i} d={`M${760 + i * 16} ${240 + (i % 3) * 8} l6 12 M${766 + i * 16} ${240 + (i % 3) * 8} l-6 12`} stroke="#fff" strokeWidth={3} opacity={0.75} />)}
      <path d="M-20 1100 V540 Q960 480 1940 540 V1100 Z" fill="#f2f1ea" stroke="#b4b4a8" strokeWidth={5} />
    </Svg>
    <Bulb0 x={980} y={-30} />
  </Macro>
);

/** Same shoulder, same crop as `ins:scar-ins`, 18 years thinner */
export const ScarFrame: React.FC<{p: ShotProps; thin?: boolean}> = ({p, thin}) => (
  <Macro p={p} bg="#050506" at={thin ? [50, 40] : [56, 42]} vig={thin ? 0.9 : 0.7} inner={28}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill={thin ? '#0b0d10' : '#3a3026'} />
      <path d={thin ? 'M-20 1100 L-20 560 Q300 390 760 400 Q1240 410 1480 700 L1640 1100 Z' : 'M-20 1100 L-20 470 Q320 300 800 320 Q1320 350 1600 680 L1760 1100 Z'} fill={thin ? '#b99a84' : '#c79a78'} />
      {thin && <path d="M500 420 Q540 640 500 860 M840 410 Q860 620 860 860 M1120 470 Q1100 650 1140 880" stroke="#8f7361" strokeWidth={14} fill="none" opacity={0.6} />}
      {/* the burn: ridged skin, the same outline both times */}
      <path d="M430 400 Q700 330 1060 430 Q1240 520 1230 700 Q1040 800 760 760 Q470 720 430 400 Z" fill={thin ? '#a37c67' : '#b5805f'} stroke="#7f523c" strokeWidth={8} />
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${470 + i * 14} ${440 + i * 44} Q${800} ${380 + i * 50} ${1190 - i * 12} ${540 + i * 26}`} stroke="#7f523c" strokeWidth={13} fill="none" opacity={0.8} />)}
      {Array.from({length: 7}, (_, i) => <path key={'h' + i} d={`M${470 + i * 14} ${452 + i * 44} Q${800} ${392 + i * 50} ${1190 - i * 12} ${552 + i * 26}`} stroke="#deb798" strokeWidth={6} fill="none" opacity={0.75} />)}
      {thin ? <>
        {Array.from({length: 26}, (_, i) => <path key={'s' + i} d={`M${500 + i * 27} ${446 + (i % 4) * 56} l6 12 m0 -12 l-6 12`} stroke="#fff" strokeWidth={3.5} />)}
        <path d="M-20 1100 V900 Q800 830 1760 930 L1760 1100 Z" fill="#f4f2ea" />
      </> : <path d="M0 1100 L60 900 Q400 780 760 820 L900 1100 Z" fill="#e6e0d0" opacity={0.0} />}
    </Svg>
    {thin ? <Bulb0 x={800} y={-40} /> : <Pool x={1700} y={200} rx={1000} color="255,235,190" a={0.42} />}
    {!thin && <div style={{position: 'absolute', left: 900, top: -30, width: 1100, height: 1200, background: 'linear-gradient(240deg, rgba(255,235,195,.4), rgba(255,235,195,0) 60%)', mixBlendMode: 'screen'}} />}
  </Macro>
);

const SheetEdge: React.FC<{p: ShotProps; chest?: boolean}> = ({p, chest}) => (
  <Macro p={p} bg="#030304" at={[50, 40]} vig={0.88} inner={26} z={1.04}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1120} fill="#b9a18c" />
      <rect x={-20} y={-20} width={1960} height={1120} fill="#1a2730" opacity={0.3} />
      {chest
        ? <><path d="M960 -20 V520" stroke="#6d4f40" strokeWidth={12} strokeLinecap="round" />{Array.from({length: 10}, (_, i) => <path key={i} d={`M932 ${30 + i * 50} L988 ${54 + i * 50}`} stroke="#58402f" strokeWidth={7} />)}<path d="M-20 1100 V520 Q960 470 1940 540 V1100 Z" fill="#f4f2ea" stroke="#b4b4a8" strokeWidth={5} /></>
        : <><path d="M-20 1100 V460 Q960 390 1940 470 V1100 Z" fill="#f4f2ea" stroke="#b4b4a8" strokeWidth={5} />
          {/* only the top of one seam, pale and straight, nothing else */}
          <path d="M220 350 Q860 310 1660 370" stroke="#ddc9b5" strokeWidth={14} fill="none" />
          {Array.from({length: 26}, (_, i) => <path key={i} d={`M${260 + i * 54} ${328 + (i * 1.6)} l14 40`} stroke="#a58c75" strokeWidth={5} />)}
        </>}
      {Array.from({length: 30}, (_, i) => <path key={'c' + i} d={`M${rnd(141, i) * 1920} ${rnd(142, i) * 1000} l6 12 m0 -12 l-6 12`} stroke="#fff" strokeWidth={3} opacity={0.6} />)}
    </Svg>
    {!chest && <Hand x={1700} y={150} s={2} rot={150} skin={C.skinT} sleeve={C.dayShirt} mode="open" />}
    <Bulb0 x={900} y={-60} />
  </Macro>
);

/** Side-on, the only time the two of them are in one picture: the long slab, Charn on his back with his head to the left,
 *  the sheet flat from the hips (nothing under it), Thyme on a crate bent over until his face is on his father's chest,
 *  both his hands round the thin one. The little bulb over the head is the one light; it rims Thyme's back. */
const ChestHold: React.FC<{p: ShotProps}> = ({p}) => {
  const hC = 730;
  const hT = 760, sT = hT / 520;
  const neckX = 722, neckY = 458;
  const pivX = 100 * sT, pivY = 134 * sT;
  return (
    <Macro p={p} bg="#020305" at={[34, 40]} vig={0.82} inner={30} z={1.03} ox={700} oy={480}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'translate(-40px, -28px) scale(1.18)', transformOrigin: '0 0'}}>
        <Svg>
          {/* steel back of the locker, its seams; the open door's cold edge on the right */}
          <rect x={-10} y={-10} width={1940} height={1100} fill="#141b20" />
          {[300, 700, 1100, 1500].map(x => <line key={x} x1={x} y1={-10} x2={x} y2={780} stroke="#0a0e11" strokeWidth={6} />)}
          <rect x={1720} y={-10} width={220} height={800} fill="#6f8089" />
          <rect x={1700} y={-10} width={30} height={800} fill="#05070a" />
          <rect x={-10} y={780} width={1940} height={320} fill="#0d1215" />
        </Svg>
        <Pool x={520} y={250} rx={620} ry={460} color="255,236,190" a={0.5} />
        <Svg>
          <line x1={520} y1={-10} x2={520} y2={110} stroke="#000" strokeWidth={6} />
          <circle cx={520} cy={128} r={22} fill="#fff7dc" />
        </Svg>
        <Pool x={520} y={128} rx={150} color="255,246,214" a={0.85} />

        {/* Charn lying on his back on the slab (head to the left, real maternal-grandfather-A cast rig) */}
        <div style={{position: 'absolute', left: 225, top: 698, width: 0, height: 0, transformOrigin: '0 0', transform: 'rotate(-90deg)', filter: 'saturate(.78) brightness(.95)'}}>
          <ActorView
            a={{...parseActor('charn3@140,730 sleep yaw=0.38 head=12 armL=none armR=none'), h: hC}}
            roster={ROSTER}
            floor={730}
            pxPerCm={PX_CM}
            f={p.f}
            style={{'--legs-rest': 'none'} as React.CSSProperties}
          />
        </div>

        <Svg>
          {/* the slab, ice on a steel drawer, runners and a leg */}
          <rect x={100} y={700} width={1400} height={34} fill="#3d4a50" />
          {[220, 1380].map(x => <rect key={x} x={x} y={734} width={36} height={140} fill="#1f282c" />)}
          <path d="M80 610 H1520 V700 H80 Z" fill="#c2d6de" stroke="#7d949d" strokeWidth={4} />
          <path d="M80 610 H1520" stroke="#eef7fb" strokeWidth={9} />
          {Array.from({length: 40}, (_, i) => <path key={i} d={`M${100 + rnd(381, i) * 1400} ${622 + rnd(382, i) * 66} l7 13 m0 -13 l-7 13`} stroke="#fff" strokeWidth={3} opacity={0.8} />)}
          {/* white sheet over his chest, then a crease at the hips, then flat on the ice */}
          <path d="M504 610 L504 468 Q640 438 780 456 Q890 472 950 560 Q980 584 1050 590 H1500 V612 H504 Z" fill="#f4f2ea" stroke="#a9a99d" strokeWidth={4} />
          <path d="M930 548 Q958 596 1030 598" stroke="#8d8d82" strokeWidth={7} fill="none" />
          {[1120, 1240, 1360].map(x => <line key={x} x1={x} y1={594} x2={x + 26} y2={610} stroke="#cfcfc4" strokeWidth={4} />)}
          <path d="M504 468 Q640 438 780 456" stroke="#fff" strokeWidth={6} fill="none" />
          {/* the crate Thyme has pulled up beside the slab */}
          <rect x={960} y={760} width={280} height={130} fill="#6b5236" stroke="#2a1d10" strokeWidth={4} />
          <path d="M960 802 H1240 M960 844 H1240" stroke="#2a1d10" strokeWidth={3} />
        </Svg>

        {/* Thyme Pass 1: seated legs on the wooden crate (real BodyLegs sit rig) */}
        <div style={{position: 'absolute', left: 0, top: 700, width: 1920, height: 250, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: -700}}>
            <ActorView
              a={{...parseActor('thyme@1055,890 sit yaw=-0.62 armL=none armR=none'), h: hT}}
              roster={ROSTER}
              floor={890}
              pxPerCm={PX_CM}
              f={p.f}
            />
          </div>
        </div>

        {/* Thyme Pass 2: far arm, Charn's thin arm emerging from under the sheet, and Thyme's bent torso with warm rim light */}
        <Svg>
          {/* Seated hip/thigh bridge in C.dayPants on top of the crate */}
          <path d="M945 752 Q1020 718 1112 732 L1116 766 L945 768 Z" fill={C.dayPants} />
          {/* Thyme's far arm (right arm) reaching down behind the head to cup Charn's thin hand from above */}
          <g style={{filter: 'brightness(.84)'}}>
            <path d="M736 486 L764 584" stroke={C.dayShirt} strokeWidth={50} strokeLinecap="round" />
            <path d="M764 584 L710 628" stroke={C.skinT} strokeWidth={42} strokeLinecap="round" />
            <g style={{'--skin': C.skinT} as React.CSSProperties} stroke="#9c6e50" strokeWidth={1.8}>
              <Mitten x={696} y={630} ang={132} k={1.34} thumb={1} />
            </g>
          </g>
          {/* Charn's thin left arm emerging from under the sheet hem onto the ice slab (thin cold forearm + Mitten hand) */}
          <path d="M542 612 L624 638 L684 646" stroke="#c8b09a" strokeWidth={25} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M552 604 L680 638" stroke="#e8f3f8" strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
          <g style={{'--skin': '#c8b09a'} as React.CSSProperties} stroke="#8f7966" strokeWidth={1.8}>
            <Mitten x={690} y={646} ang={-82} k={1.28} thumb={-1} />
          </g>
          {/* Subtle sheet hem shadow where Charn's arm emerges from under the cloth */}
          <path d="M522 610 H576" stroke="#8d8d82" strokeWidth={5} strokeLinecap="round" />
          {/* Bent torso in lead-male-A slate-blue jacket/shirt arching from crate hips to father's chest */}
          <path d="M712 436 Q845 450 985 556 Q1090 636 1118 738 L1002 748 Q960 668 855 604 Q768 552 706 496 Z" fill={C.dayShirt} />
          <path d="M735 504 Q845 568 978 688" stroke="#36404d" strokeWidth={5} fill="none" opacity={0.75} />
          {/* lead-male-A dark blue-slate collar at the neck */}
          <path d="M716 430 L748 446 L724 506 L696 488 Z" fill="#254463" />
          {/* warm rim light from the small overhead bulb catching Thyme's curved back */}
          <path d="M726 436 Q852 454 988 558 Q1084 632 1114 726" stroke="#f3d9a6" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
        </Svg>

        {/* Thyme Pass 3: real cast head (#lead-male-A--skull, #lead-male-A--hair, #ears, #face-cry) buried on his father's chest */}
        <div style={{
          position: 'absolute',
          left: neckX - pivX,
          top: neckY - pivY,
          width: Math.ceil(200 * sT),
          height: Math.ceil(pivY),
          clipPath: 'inset(-90px -90px 0px -90px)',
          transformOrigin: `${pivX}px ${pivY}px`,
          transform: 'rotate(-54deg)',
        }}>
          <ActorView
            a={{...parseActor('thyme@0,0 cry yaw=-0.46 head=0 armL=none armR=none'), h: hT, x: pivX, y: hT}}
            roster={ROSTER}
            floor={hT}
            pxPerCm={PX_CM}
            f={p.f}
            style={{'--legs-rest': 'none'} as React.CSSProperties}
          />
        </div>

        {/* Thyme Pass 4: near arm (left arm) with sleeve, wristwatch, and cast Mitten hand clasping Charn's cold hand */}
        <Svg>
          <path d="M762 504 L818 616" stroke={C.dayShirt} strokeWidth={52} strokeLinecap="round" />
          <path d="M762 504 L818 616" stroke="rgba(255,255,255,.07)" strokeWidth={52} strokeLinecap="round" />
          <path d="M818 616 L730 650" stroke={C.skinT} strokeWidth={44} strokeLinecap="round" />
          {/* Thyme's wristwatch (#acc-wristwatch) on his left wrist */}
          <g transform="translate(758 639) rotate(22)">
            <rect x={-6} y={-22} width={12} height={44} rx={3} fill="#1a1d22" />
            <circle cx={0} cy={0} r={11} fill="#c8a24a" />
            <circle cx={0} cy={0} r={7.5} fill="#e8e4d8" />
          </g>
          <g style={{'--skin': C.skinT} as React.CSSProperties} stroke="#9c6e50" strokeWidth={1.8}>
            <Mitten x={712} y={652} ang={105} k={1.42} thumb={1} />
          </g>
          {/* tears on the sheet under Thyme's cheek */}
          <path d="M628 456 q-6 18 0 28" stroke="rgba(235,245,255,.95)" strokeWidth={6} fill="none" strokeLinecap="round" />
        </Svg>
        <FloorMist y={880} f={p.f} a={0.3} />
      </div>
    </Macro>
  );
};

// ---------------------------------------------------------------- the tape recorder

export const Recorder: React.FC<{x: number; y: number; s?: number; f: number; run?: boolean; red?: boolean; green?: boolean; label?: string; pressed?: boolean; slow?: number}> = ({x, y, s = 1, f, run, red, green, label = 'ธาม', pressed, slow = 1}) => {
  const a = run ? f * 5 * slow : 0;
  return (
    <svg width={1000 * s} height={640 * s} viewBox="0 0 1000 640" style={{position: 'absolute', left: x - 500 * s, top: y - 320 * s, overflow: 'visible'}}>
      <path d="M340 40 Q340 -30 500 -30 Q660 -30 660 40" fill="none" stroke="#1d1a17" strokeWidth={22} />
      <rect x={0} y={30} width={1000} height={610} rx={28} fill="#3b352d" stroke="#120e0a" strokeWidth={8} />
      <rect x={60} y={80} width={880} height={330} rx={14} fill="#0e0d0c" stroke="#5b5346" strokeWidth={6} />
      {[280, 720].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} 245)`}>
          <circle r={118} fill="#2a2520" stroke="#6b6355" strokeWidth={6} />
          <circle r={i ? 66 : 96} fill="#17110c" />
          <g transform={`rotate(${a + i * 40})`}><circle r={46} fill="#e7e1cf" />{[0, 120, 240].map(d => <rect key={d} x={-9} y={-44} width={18} height={34} fill="#3b352d" transform={`rotate(${d})`} />)}<circle r={12} fill="#2a2520" /></g>
        </g>
      ))}
      <path d="M280 360 L720 360" stroke="#4a3122" strokeWidth={5} />
      <rect x={370} y={120} width={260} height={92} fill="#e7dfc8" stroke="#6b6355" strokeWidth={3} />
      <text x={500} y={184} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={54} fill="#23305a" transform="skewX(-6)">{label}</text>
      {[0, 1, 2, 3, 4].map(i => {
        const isRec = i === 0, isPlay = i === 1;
        const dn = (isPlay && pressed) || (isRec && red && pressed);
        return <rect key={i} x={80 + i * 170} y={dn ? 470 : 450} width={150} height={dn ? 86 : 106} rx={8} fill={isRec ? '#a41d1d' : '#9fa3a6'} stroke="#111" strokeWidth={5} />;
      })}
      {green && <><circle cx={910} cy={500} r={16} fill="#6dff72" /><circle cx={910} cy={500} r={36} fill="rgba(109,255,114,.35)" /></>}
      {red && <><circle cx={910} cy={500} r={18} fill="#ff2a22" /><circle cx={910} cy={500} r={52} fill="rgba(255,42,34,.45)" /></>}
      {!green && !red && <circle cx={910} cy={500} r={16} fill="#2c2c2c" />}
    </svg>
  );
};

const RecorderShot: React.FC<{p: ShotProps; v: string}> = ({p, v}) => {
  const k = K(p);
  const big = v === 'reel-ins' || v === 'reel-stop-ecu' || v === 'reel-b-ins' || v === 'sideb-ecu';
  const s = big ? 2 : 1.25;
  const label = v === 'sideb-ecu' || v === 'reel-b-ins' ? 'B' : 'ธาม';
  const slow = v === 'reel-stop-ecu' ? Math.max(0, 1 - k * 1.3) : 1;
  const run = v !== 'recorder-ins' && v !== 'sideb-ecu' && v !== 'rec-ecu' && !(v === 'play-ecu' && k < 0.5);
  const pressed = v === 'play-ecu' ? k > 0.45 : v === 'reel-stop-ecu' ? k < 0.7 : v !== 'recorder-ins' && v !== 'sideb-ecu' && v !== 'rec-ecu';
  const y = v === 'play-ecu' ? 240 : big ? 560 : 500;
  const cold = v === 'lock-ecu';
  return (
    <Macro p={p} bg="#040405" at={[50, 42]} vig={0.86} inner={26} z={1.05} past={false}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 20%, #303f47, #06080a 70%)'}} />
      <Svg><rect x={-20} y={800} width={1960} height={320} fill={cold ? '#3a464c' : '#2c363b'} /></Svg>
      <Recorder x={960} y={y} s={s} f={p.f} run={run && slow > 0} slow={slow} green={run && slow > 0.1} label={label} pressed={pressed} red={v === 'rec-ecu'} />
      {v === 'play-ecu' && <Hand x={720} y={900} s={2.2} rot={-74 + (k > 0.45 ? 0 : -3)} skin={C.skinT} mode="open" />}
      {v === 'sideb-ecu' && <Hand x={1540} y={660} s={2.1} rot={200} skin={C.skinT} mode="grip" />}
      {v === 'rec-ecu' && <Hand x={320} y={930} s={2} rot={-80} skin={C.skinT} mode="open" />}
      {v === 'reel-b-ins' && <Hand x={1700} y={960} s={1.6} rot={196} skin={C.skinT} mode="open" />}
      <FloorMist y={900} f={p.f} a={0.2} />
      <Pool x={960} y={60} rx={700} color="255,246,214" a={0.36} />
    </Macro>
  );
};

// ---------------------------------------------------------------- others close

const LockEcu: React.FC<{p: ShotProps}> = ({p}) => {
  const n = Math.min(3, Math.floor(K(p) * 4));
  const code = ['1', '7', '0', '3'];
  return (
    <Macro p={p} bg="#030405" at={[50, 42]} vig={0.86} inner={26} z={1.05}>
      <Svg>
        <rect x={-20} y={-20} width={1960} height={1120} fill="#596469" />
        {Array.from({length: 7}, (_, i) => <g key={i}><ellipse cx={-30 + i * 340} cy={460} rx={170} ry={78} fill="none" stroke="#2a2e30" strokeWidth={44} /><ellipse cx={-30 + i * 340} cy={456} rx={170} ry={78} fill="none" stroke="#a5aeb2" strokeWidth={8} /></g>)}
        <rect x={500} y={230} width={920} height={500} rx={36} fill="#2a2d2f" stroke="#0a0b0c" strokeWidth={10} />
        {code.map((c, i) => <g key={i}>
          <rect x={560 + i * 205} y={300} width={180} height={340} rx={16} fill={i <= n ? '#e9e8e0' : '#b4b4ac'} stroke="#111" strokeWidth={6} />
          {Array.from({length: 7}, (_, k) => <line key={k} x1={560 + i * 205} y1={320 + k * 50} x2={740 + i * 205} y2={320 + k * 50} stroke="#8d8d85" strokeWidth={3} />)}
          <text x={650 + i * 205} y={525} textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight={700} fontSize={190} fill="#151515">{i <= n ? c : '0'}</text>
        </g>)}
        {Array.from({length: 40}, (_, i) => <path key={i} d={`M${rnd(151, i) * 1920} ${rnd(152, i) * 1080} l8 16 m0 -16 l-8 16`} stroke="#eef6fa" strokeWidth={4} opacity={0.65} />)}
      </Svg>
      <Hand x={1630} y={930} s={2} rot={198 + Math.sin(p.f / 1.5) * 1.2} skin={C.skinT} mode="grip" />
      <FloorMist y={760} f={p.f * 2} a={0.3} color="240,248,255" />
    </Macro>
  );
};

const ChainLow: React.FC<{p: ShotProps}> = ({p}) => {
  const k = Math.min(1, K(p) * 1.8);
  return (
    <Macro p={p} bg="#050608" at={[50, 56]} vig={0.8} inner={30} z={1.03}>
      <Svg>
        <rect x={-20} y={-20} width={1960} height={740} fill="#555e63" />
        <line x1={-20} y1={720} x2={1940} y2={720} stroke="#0f1112" strokeWidth={10} />
        <rect x={-20} y={720} width={1960} height={400} fill="#3a3e41" />
        <path d={`M300 ${820 - (1 - k) * 700} Q700 ${880 - (1 - k) * 640} 1000 ${830 - (1 - k) * 720} T1560 ${850 - (1 - k) * 800}`} stroke="#1a1c1e" strokeWidth={46} strokeDasharray="42 16" fill="none" />
        <path d={`M300 ${812 - (1 - k) * 700} Q700 ${872 - (1 - k) * 640} 1000 ${822 - (1 - k) * 720} T1560 ${842 - (1 - k) * 800}`} stroke="#979fa3" strokeWidth={10} strokeDasharray="42 16" fill="none" />
        {Array.from({length: 40}, (_, i) => {
          const a = rnd(161, i) * 3.14, r = 80 + rnd(162, i) * 620 * k;
          return <path key={i} d={`M${1000 + Math.cos(a) * r} ${850 - Math.sin(a) * r * 0.5} l10 16 m0 -16 l-10 16`} stroke="#eaf5fa" strokeWidth={4} opacity={k} />;
        })}
        <rect x={1460} y={260} width={240} height={510} fill={C.dayPants} />
        <path d="M1440 760 Q1760 760 1860 880 Q1860 920 1800 920 L1440 920 Z" fill="#141518" />
      </Svg>
      <Pool x={700} y={500} rx={900} color="220,235,245" a={0.24} />
    </Macro>
  );
};

/** Camera inside the locker looking out: his black figure in the frame of the door, breath of cold coming over us */
const DoorOpen: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#020203" at={[50, 46]} vig={0.86} inner={26} z={1.04}>
      <Svg>
        <rect x={380} y={80} width={1160} height={1040} fill="#cfdde4" />
        <rect x={380} y={80} width={1160} height={1040} fill="none" stroke="#050606" strokeWidth={26} />
        {Array.from({length: 5}, (_, i) => <rect key={i} x={380 + i * 250} y={110} width={160} height={16} fill="#f5fbff" />)}
        <rect x={380} y={820} width={1160} height={300} fill="#70787c" />
      </Svg>
      <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><ActorView a={{...parseActor('thyme-sil@960,1140'), h: 920}} roster={ROSTER} floor={1140} pxPerCm={PX_CM} f={p.f} /></div>
      {Array.from({length: 11}, (_, i) => <div key={i} style={{position: 'absolute', left: 150 + i * 150 - 50 * k * (i - 5), top: -120 + rnd(171, i) * 260 + k * 60, width: 620, height: 500, borderRadius: '50%', filter: 'blur(40px)', background: `rgba(235,246,255,${0.28 + k * 0.5})`}} />)}
    </Macro>
  );
};

/** Fold-out documents, the cheque, the stamps */
const Paper2: React.FC<{p: ShotProps; v: string}> = ({p, v}) => {
  const k = K(p);
  if (v === 'folder3-ins') return (
    <Macro p={p} bg="#050403" at={[50, 42]} vig={0.82} inner={28}>
      <Sheet x={380} y={70} w={1160} h={960} color="#ece1c6" rot={-1.2}>
        <Lotus x={580} y={200} r={130} emboss />
        <Typed x={260} y={380} size={70} weight={700}>สัญญาจัดหา</Typed>
        <Typed x={260} y={490} size={44} color="#544a38">ระหว่าง</Typed>
        <Typed x={260} y={560} size={64} weight={700}>คุณหญิงพรรณี ...</Typed>
        <Typed x={260} y={660} size={44} color="#544a38">กับ นายชาญ ...</Typed>
      </Sheet>
      <Hand x={1640} y={860} s={2} rot={196} skin={C.skinT} mode="open" />
      <Pool x={620} y={160} rx={620} color="255,240,190" a={0.34} />
    </Macro>
  );
  if (v === 'chart-ins') return (
    <Macro p={p} bg="#0d1012" at={[50, 42]} vig={0.6}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#70777b" /></Svg>
      <Sheet x={520} y={40} w={880} h={1020} color="#efe3a6" lines>
        <Typed x={70} y={18} size={56} weight={700} color="#1f2740">นน. ชาญ</Typed>
        {['62.0', '61.5', '61.0', '60.5', '60.0', '...', '48.5', '48.0'].map((n, i) => <React.Fragment key={i}>
          <Pen x={80} y={110 + i * 88} size={46} color="#1f2740">{i < 5 ? `${i + 1}/` : i === 5 ? '' : `${i + 21}/`}{i !== 5 ? '-' : ''}</Pen>
          <Pen x={470} y={110 + i * 88} size={70} color="#1f2740">{n}</Pen>
        </React.Fragment>)}
      </Sheet>
      <Svg><rect x={880} y={18} width={160} height={46} rx={6} fill="#2d3234" /></Svg>
    </Macro>
  );
  if (v === 'cheque-ins' || v === 'cheque-stamp-ecu') {
    const big = v === 'cheque-stamp-ecu';
    return (
      <Macro p={p} bg="#030405" at={[50, 42]} vig={0.86} inner={26} z={1.04}>
        <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#a2adb2" /><rect x={-10} y={-10} width={1940} height={1100} fill="url(#ch-g)" /><defs><radialGradient id="ch-g" cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#fff" stopOpacity={0.4} /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></radialGradient></defs></Svg>
        {!big && <FoamBox x={1660} y={330} w={380} />}
        <Sheet x={big ? -120 : 280} y={big ? -130 : 330} w={big ? 2200 : 1160} h={big ? 1220 : 540} color="#e8e5d4" rot={big ? 0 : -2}>
          <Lotus x={big ? 500 : 130} y={big ? 480 : 120} r={big ? 300 : 80} emboss />
          <Typed x={big ? 860 : 240} y={big ? 340 : 60} size={big ? 130 : 56} weight={700} color="#3f3620">บัวทองทรัพย์</Typed>
          {!big && <Typed x={240} y={140} size={36} color="#6b6250">จ่าย นายธาม ...</Typed>}
          {!big && <Typed x={560} y={320} size={94} weight={700} color="#1b2536">500,000.-</Typed>}
          {!big && <Pen x={120} y={420} size={46}>พรรณี</Pen>}
        </Sheet>
        {big ? <Hand x={1660} y={870} s={2} rot={200} skin={C.skinT} mode="open" /> : <Hand x={230} y={880} s={2} rot={-30} skin={C.skinP} sleeve={C.lace} mode="open" />}
      </Macro>
    );
  }
  if (v === 'stamp-split') {
    const m = Math.min(1, k * 1.4);
    return (
      <Macro p={p} bg="#050403" at={[50, 42]} vig={0.8} inner={30} z={1.02}>
        <Svg>
          <rect x={-10} y={-10} width={970} height={1100} fill="#e8e5d4" />
          <rect x={960} y={-10} width={970} height={1100} fill="#cfc2a2" />
          <line x1={960} y1={-10} x2={960} y2={1100} stroke="#0a0a08" strokeWidth={10} />
        </Svg>
        <Lotus x={480 + m * 220} y={420} r={280} emboss />
        <Lotus x={1440 - m * 220} y={420} r={280} color="#9c8a5c" o={0.55 + (1 - m) * 0.1} />
        {m < 1 && <Typed x={260} y={770} size={46} weight={700} color="#3f3620">หัวเช็ค</Typed>}
        {m < 1 && <Typed x={1230} y={770} size={46} weight={700} color="#4b3f2a">สัญญากู้ 3.5 ล้าน</Typed>}
      </Macro>
    );
  }
  if (v === 'lotus-red') return (
    <Macro p={p} bg="#020202" at={[56, 42]} vig={0.97} inner={16} z={1.08}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#bfae86" /></Svg>
      <Lotus x={960} y={470} r={420} color="#b8922f" emboss />
      <div style={{position: 'absolute', left: -60, top: -60, width: 1200, height: 1240, background: 'linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.4) 60%, rgba(0,0,0,0))'}} />
    </Macro>
  );
  if (v === 'cloth-ins' || v === 'cloth-off-ins') {
    const off = v === 'cloth-off-ins';
    return (
      <Macro p={p} bg="#030405" at={[46, 46]} vig={0.9} inner={24} z={1.04}>
        <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#808b90" /><rect x={-10} y={-10} width={1940} height={560} fill="#0a0c0d" /><rect x={-10} y={540} width={1940} height={18} fill="#c6cfd3" /></Svg>
        {off && <Recorder x={900} y={500} s={1.05} f={p.f} run red pressed label="" />}
        {!off && <FoamBox x={1650} y={560} w={420} />}
        {!off && <>
                    <Svg><circle cx={720} cy={640} r={13} fill="#ff2a22" /><circle cx={720} cy={640} r={34} fill="rgba(255,42,34,.5)" /></Svg>
          <Svg><path d="M100 1000 L120 640 Q320 460 720 500 Q1040 500 1250 640 L1330 1000 Z" fill="#efece1" stroke="#b1ada0" strokeWidth={5} /><path d="M220 800 Q600 700 1200 780 M180 900 Q700 800 1280 900" stroke="#cfc9b8" strokeWidth={8} fill="none" /><path d="M560 520 H880 L900 690 H540 Z" fill="#000" opacity={0.0} /></Svg>
          <Svg><ellipse cx={720} cy={640} rx={110} ry={36} fill="#000" opacity={0.0} /></Svg>
          <div style={{position: 'absolute', left: 620, top: 590, width: 200, height: 90, borderRadius: 8, background: '#100e0c', boxShadow: '0 0 30px rgba(255,42,34,.7)'}}><div style={{position: 'absolute', left: 90, top: 34, width: 22, height: 22, borderRadius: '50%', background: '#ff2a22'}} /></div>
        </>}
        {off && <>
          <Svg><path d={`M1240 ${160 - 80 * k} Q1500 ${300 - 100 * k} 1720 ${500 - 60 * k} L1960 480 L1960 -40 L1240 -40 Z`} fill="#efece1" stroke="#b1ada0" strokeWidth={5} /></Svg>
          <Hand x={1620} y={250} s={2} rot={200} skin={C.skinT} mode="grip" />
        </>}
      </Macro>
    );
  }
  if (v === 'prasit-page-ins') return (
    <Macro p={p} bg="#050403" at={[50, 42]} vig={0.84} inner={26}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#191918" /></Svg>
      <div style={{position: 'absolute', left: 240, top: 620, width: 880, height: 520, background: '#4f3522', borderRadius: 20, boxShadow: 'inset 0 30px 60px #000'}}><div style={{position: 'absolute', left: 80, top: 14, width: 720, height: 90, background: '#0d0705', borderRadius: 14}} /></div>
      <Sheet x={620} y={160} w={840} h={560} color="#ebe2c8" rot={-5}>
        <Typed x={60} y={40} size={52} weight={700}>ข้อ 29</Typed>
        <div style={{position: 'absolute', left: 0, top: 200, width: 840, height: 2, background: '#a59a7c'}} />
        <div style={{position: 'absolute', left: 0, top: 380, width: 840, height: 2, background: '#a59a7c'}} />
      </Sheet>
      <Svg><path d="M620 180 l-14 16 l16 14 l-16 16 l14 16 l-16 16 l16 14 l-16 18 l14 16 l-16 16 l14 16 l-16 16 l14 18 l-16 14 l16 18 l-16 16 l16 16 l-16 18 l14 16 l-16 16" stroke="#0b0806" strokeWidth={6} fill="none" /></Svg>
      <Hand x={1660} y={800} s={2.1} rot={196} skin="#c79a78" sleeve="#4f6653" mode="grip" />
      <Pool x={960} y={300} rx={760} color="245,250,255" a={0.36} />
    </Macro>
  );
  if (v === 'rip-ecu') {
    const t = Math.min(1, k * 1.3);
    return (
      <Macro p={p} bg="#030405" at={[50, 42]} vig={0.84} inner={26} z={1.04}>
        <Svg><rect x={-10} y={700} width={1940} height={400} fill="#868f94" /></Svg>
        {[-1, 1].map(s => (
          <div key={s} style={{position: 'absolute', left: s < 0 ? 380 - t * 110 : 960 + t * 110, top: 220, width: 580, height: 480, background: '#e8e5d4', overflow: 'hidden', transform: `rotate(${s * t * 9}deg)`, transformOrigin: s < 0 ? '100% 100%' : '0 100%',
            clipPath: s < 0 ? 'polygon(0 0, 100% 0, 95% 10%, 100% 20%, 94% 32%, 100% 44%, 95% 58%, 100% 70%, 94% 84%, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 6% 84%, 0 70%, 5% 58%, 0 44%, 6% 32%, 0 20%, 5% 10%)'}}>
            {s < 0 && <Lotus x={560} y={120} r={120} />}
            {s > 0 && <Lotus x={20} y={120} r={120} />}
            {s < 0 && <Typed x={330} y={290} size={92} weight={700} color="#1b2536">500,</Typed>}
            {s > 0 && <Typed x={20} y={290} size={92} weight={700} color="#1b2536">000.-</Typed>}
          </div>
        ))}
        <Hand x={330 - t * 110} y={530} s={2.2} rot={-8 - t * 9} skin={C.skinT} mode="grip" />
        <Hand x={1590 + t * 110} y={530} s={2.2} rot={188 + t * 9} skin={C.skinT} mode="grip" />
        {t > 0.6 && <Svg>{Array.from({length: 8}, (_, i) => <rect key={i} x={860 + i * 24} y={720 + rnd(181, i) * 240} width={24} height={16} fill="#e8e5d4" transform={`rotate(${rnd(182, i) * 90} ${860 + i * 24} 800)`} />)}</Svg>}
        <Pool x={960} y={80} rx={800} color="245,250,255" a={0.36} />
      </Macro>
    );
  }
  return null;
};

const PAPERS = new Set(['folder3-ins', 'chart-ins', 'cheque-ins', 'cheque-stamp-ecu', 'stamp-split', 'lotus-red', 'cloth-ins', 'cloth-off-ins', 'prasit-page-ins', 'rip-ecu']);
const RECORDER = new Set(['recorder-ins', 'play-ecu', 'reel-ins', 'reel-stop-ecu', 'sideb-ecu', 'reel-b-ins', 'rec-ecu']);

/** Looking up at the lamp from a man's back on the table: blinding, a masked head at the edge of it */
const LampPov: React.FC<{p: ShotProps; photo?: boolean}> = ({p, photo}) => (
  <Macro p={p} bg="#1e2428" at={[50, 42]} vig={photo ? 0.6 : 0.46} inner={36} z={1.04}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill={photo ? '#20272b' : '#d9e4e9'} />
      <ellipse cx={960} cy={430} rx={photo ? 520 : 680} ry={photo ? 320 : 420} fill="#3a4246" stroke="#14181a" strokeWidth={14} />
      {[[-260, -110], [0, -170], [260, -110], [-260, 110], [0, 170], [260, 110]].map(([x, y], i) => <circle key={i} cx={960 + x * (photo ? 0.72 : 1)} cy={430 + y * (photo ? 0.72 : 1)} r={photo ? 64 : 92} fill="#fffffa" />)}
      {photo && <rect x={1440} y={-30} width={50} height={1200} fill="#596267" transform="rotate(12 1440 500)" />}
    </Svg>
    {!photo && <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,250,.35) 10%, rgba(255,255,250,.26) 44%, rgba(255,255,250,0) 74%)'}} />}
    {!photo && <div style={{position: 'absolute', left: 1300, top: 560, filter: 'blur(14px)'}}>
      <div style={{width: 660, height: 720, borderRadius: '50%', background: '#3a5563'}} />
      <div style={{position: 'absolute', left: 90, top: 300, width: 480, height: 280, borderRadius: 40, background: '#9dc4cf'}} />
    </div>}
    {photo && <>
      <Sheet x={1120} y={210} w={460} h={580} color="#e4dfcc" rot={7}>
        <div style={{position: 'absolute', left: 30, top: 30, width: 400, height: 440, background: '#b8c6c8'}}>
          <div style={{position: 'absolute', left: 120, top: 70, width: 170, height: 180, borderRadius: '50%', background: '#e8b995'}} />
          <div style={{position: 'absolute', left: 110, top: 54, width: 190, height: 90, borderRadius: '90px 90px 20px 20px', background: '#2b221e'}} />
          <div style={{position: 'absolute', left: 60, top: 260, width: 290, height: 180, borderRadius: '50% 50% 0 0', background: '#f0eee8'}} />
        </div>
      </Sheet>
      <Svg>{[[-16, 150], [8, 200], [-6, 340], [10, 420]].map(([r, y], i) => <rect key={i} x={1090 + i * 34} y={y} width={240} height={46} fill="rgba(226,210,150,.62)" transform={`rotate(${r} 1200 ${y})`} />)}</Svg>
      <Pool x={1000} y={300} rx={900} color="255,255,250" a={0.44} />
    </>}
  </Macro>
);

const Dropdown: React.FC<{p: ShotProps; kind: 'floor' | 'collapse'}> = ({p, kind}) => {
  const fl = kind === 'floor';
  return (
    <Macro p={p} bg="#010102" at={[50, 48]} vig={0.96} inner={20} z={1.03}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#3a3f43" />
        {Array.from({length: 26}, (_, i) => <line key={i} x1={i * 80} y1={-10} x2={i * 80 + 30} y2={1100} stroke="rgba(0,0,0,.2)" strokeWidth={3} />)}
      </Svg>
      <Pool x={960} y={490} rx={620} ry={440} color="240,248,255" a={0.68} />
      {fl && <Svg>{Array.from({length: 18}, (_, i) => { const a = (i / 18) * 6.28 + rnd(191, i), r = 210 + rnd(192, i) * 240; return <g key={i} transform={`translate(${960 + Math.cos(a) * r} ${500 + Math.sin(a) * r * 0.76}) rotate(${rnd(193, i) * 120 - 60})`}><rect x={-70} y={-90} width={140} height={180} fill={i % 5 === 0 ? '#ebe2c8' : '#dfdccf'} stroke="#7e7a68" strokeWidth={2} />{[0, 1, 2, 3].map(k => <line key={k} x1={-52} y1={-58 + k * 36} x2={52} y2={-58 + k * 36} stroke="#5e5a4c" strokeWidth={4} />)}</g>; })}</Svg>}
      {fl
        ? <>
            {/* from above: black head, shoulders, arms round his shins */}
            <Svg>
              <ellipse cx={960} cy={560} rx={240} ry={200} fill={C.dayShirt} />
              <path d="M760 620 Q860 780 1060 780 Q1180 730 1160 620" stroke={C.dayShirt} strokeWidth={70} fill="none" />
              <ellipse cx={960} cy={700} rx={140} ry={70} fill={C.dayPants} />
              <circle cx={960} cy={480} r={132} fill="#16161c" />
              <path d="M900 380 Q960 420 1020 380" stroke="#2a2a36" strokeWidth={14} fill="none" />
            </Svg>
          </>
        : <>
            <Svg>
              <path d="M520 860 Q660 520 960 520 Q1260 520 1400 860 Q960 960 520 860 Z" fill={C.lace} stroke={C.laceD} strokeWidth={6} />
              {Array.from({length: 12}, (_, i) => <path key={i} d={`M${560 + i * 70} ${850 + (i % 2) * 22} q18 26 36 0`} stroke={C.laceD} strokeWidth={5} fill="none" />)}
              <path d="M1160 700 l130 90 l-110 -10 Z" fill="#7c7464" opacity={0.0} />
              <g transform="translate(1320 700) rotate(35)"><path d="M0 0 L-80 -82 A114 114 0 0 1 80 -82 Z" fill="#f7f4ea" stroke="#b9b39e" strokeWidth={4} /></g>
            </Svg>
            <ActorView a={{...parseActor('phannee@960,1020 scared hair=bun head=10'), h: 760}} roster={ROSTER} floor={1020} pxPerCm={PX_CM} f={p.f} />
          </>}
      <FloorMist y={1000} f={p.f} a={0.36} />
      <FloorMist y={40} f={p.f} a={0.3} />
    </Macro>
  );
};

/** Low from the floor at the far end: locker 0 towers, chained, the lamp small and far behind our shoulder */
const BigDoor: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#020304" at={[50, 42]} vig={0.86} inner={28} z={1.03}>
    <Svg>
      <path d="M-20 1100 L260 840 L1660 840 L1940 1100 Z" fill="#26282a" />
      <path d="M300 860 L420 -60 L1500 -60 L1620 860 Z" fill="#59636a" stroke="#0a0c0e" strokeWidth={10} />
      <path d="M960 860 V-60" stroke="#1f2428" strokeWidth={12} />
      <text x={960} y={420} textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight={700} fontSize={560} fill="#7e1818" opacity={0.85}>0</text>
      {Array.from({length: 10}, (_, i) => <g key={i}><ellipse cx={300 + i * 148} cy={530} rx={84} ry={38} fill="none" stroke="#1a1c1e" strokeWidth={26} /><ellipse cx={300 + i * 148} cy={526} rx={84} ry={38} fill="none" stroke="#9fa7ab" strokeWidth={6} /></g>)}
      <rect x={880} y={490} width={160} height={110} rx={12} fill="#2a2d2f" stroke="#0a0b0c" strokeWidth={6} />
    </Svg>
    <Pool x={900} y={500} rx={640} color="220,235,245" a={0.24} />
    <FloorMist y={860} f={p.f} a={0.32} />
  </Macro>
);

const WalkFif: React.FC<{p: ShotProps}> = ({p}) => (
  <Shot p={p} world={<><Room3 p={p} mode="neon" table={false} /><Actors p={p} /></>} fore={
    <>
      <div style={{position: 'absolute', left: -40, top: -40, width: 760, height: 1200, background: '#566066'}} />
      <div style={{position: 'absolute', left: 1240, top: -40, width: 760, height: 1200, background: '#464f54'}} />
    </>
  } foreBlur={7} foreDark={0.55} />
);

const IceScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'box-ins') return <BoxIns p={p} tag={!!d.tagged} seep={d.tagged ? 0.5 : 0.15} />;
  if (v === 'seep-ecu') return <SeepEcu p={p} />;
  if (v === 'box-high') return <BoxHigh p={p} />;
  if (v === 'ramp-pov') return <Ramp p={p} kind="pov" />;
  if (v === 'knock-low') return <Ramp p={p} kind="knock" />;
  if (v === 'ramp-run-low') return <Ramp p={p} kind="run" />;
  if (v === 'police-ramp-sil') return <Ramp p={p} kind="police" />;
  if (v === 'prasit-sil') return <Ramp p={p} kind="prasit" />;
  if (v === 'ramp-tracks-ins') return <RampTracks p={p} />;
  if (v === 'big-door-low') return <BigDoor p={p} />;
  if (v === 'body-reveal-med') return <Slab p={p} reveal />;
  if (v === 'sheet-high') return <Slab p={p} top />;
  if (v === 'face-close') return <FaceClose p={p} />;
  if (v === 'scar-ins') return <ScarFrame p={p} thin />;
  if (v === 'hem-ins') return <SheetEdge p={p} />;
  if (v === 'chest-ins') return <SheetEdge p={p} chest />;
  if (v === 'chest-hold-close') return <ChestHold p={p} />;
  if (RECORDER.has(v)) return <RecorderShot p={p} v={v} />;
  if (PAPERS.has(v)) return <Paper2 p={p} v={v} />;
  if (v === 'lock-ecu') return <LockEcu p={p} />;
  if (v === 'chain-low') return <ChainLow p={p} />;
  if (v === 'door-open-low') return <DoorOpen p={p} />;
  if (v === 'lamp-pov') return <LampPov p={p} />;
  if (v === 'lamp-photo-ins') return <LampPov p={p} photo />;
  if (v === 'thyme-floor-high') return <Dropdown p={p} kind="floor" />;
  if (v === 'phannee-collapse-high') return <Dropdown p={p} kind="collapse" />;
  if (v === 'walk-fif') return <WalkFif p={p} />;
  if (v === 'ear-ecu2') return <EarEcu p={p} shake dark />;
  if (v === 'thyme-frozen-ecu') return (
    <Macro p={p} bg="#020304" at={[50, 42]} vig={0.92} inner={24} z={1.1}>
      <BigEye skin="#c8a48a" skinD="#997b65" lid={0.02} glint={<g>{[[-14, -14], [0, -22], [14, -14], [-14, 6], [0, 14], [14, 6]].map(([x, y], i) => <circle key={i} cx={x * 1.6} cy={y * 1.6 - 20} r={7} fill="#fff" />)}</g>} />
      <div style={{position: 'absolute', inset: 0, background: 'rgba(20,40,60,.26)'}} />
    </Macro>
  );
  if (v === 'thyme-cry-ecu') return (
    <Macro p={p} bg="#020304" at={[50, 42]} vig={0.84} inner={28} z={1.06}>
      <BigMouth skin={C.skinT} skinD={C.skinTD} lip="#8f4a40" open={0.5} smile={-0.55} teeth breath={<g opacity={0.5}><ellipse cx={960} cy={270} rx={300} ry={100} fill="#eef6fa" style={{filter: 'blur(30px)'}} /></g>} />
      <Svg><path d="M1320 80 q24 130 6 250" stroke="rgba(235,245,255,.85)" strokeWidth={22} fill="none" strokeLinecap="round" /></Svg>
      <Pool x={960} y={-40} rx={760} color="245,250,255" a={0.32} />
    </Macro>
  );
  if (v === 'phannee-ecu') return (
    <Macro p={p} bg="#020304" at={[50, 42]} vig={0.84} inner={28} z={1.06}>
      <BigMouth skin={C.skinP} skinD={C.skinPD} lip="#c9838a" smile={0.5} open={0.2} teeth />
      <Svg><ellipse cx={1090} cy={560} rx={360} ry={70} fill="rgba(240,248,255,.42)" style={{filter: 'blur(26px)'}} /></Svg>
    </Macro>
  );
  if (v === 'thought-dutch' || d.tilted) {/* falls through: Stage reads data.tilt */}
  if (v === 'shoes-low') return <ShoesRamp p={p} />;
  const r = d.room === 'low' ? RLOW : d.room === 'far' ? RFAR : R;
  const mode = modeOf(p);
  return <Shot p={p} world={<>
    <Soft p={p}><Room3 p={p} r={r} mode={mode} opened={!!d.opened} table={d.table !== false && zOf(p) < 2.2} box={d.box !== false} id={`ice-${d.room ?? 'r'}`} /></Soft>
    {d.iv && <Svg><line x1={1500} y1={80} x2={1500} y2={860} stroke="#7d868a" strokeWidth={11} /><path d="M1440 80 H1560" stroke="#7d868a" strokeWidth={9} /><path d="M1450 80 q-6 40 0 60 M1550 80 q6 40 0 60" stroke="#aeb7bb" strokeWidth={4} fill="none" /><rect x={700} y={560} width={440} height={26} rx={6} fill="#9ca6ab" stroke="#2c3134" strokeWidth={4} /></Svg>}
    <Actors p={p} pxPerCm={d.ppc ?? PX_CM} floor={d.floor ?? 930} />
    {d.boxTable && <Svg><rect x={d.heldBox[0] - 240} y={d.heldBox[1]} width={480} height={20} fill="#ccd5d9" stroke="#4a5155" strokeWidth={3} />{[-210, 210].map(k => <rect key={k} x={d.heldBox[0] + k - 9} y={d.heldBox[1] + 20} width={18} height={930 - d.heldBox[1] - 20} fill="#70797e" />)}</Svg>}
    {d.heldBox && <FoamBox x={d.heldBox[0]} y={d.heldBox[1]} w={d.heldBox[2]} />}
    {d.fan && <FanH x={d.fan[0]} y={d.fan[1]} s={d.fan[2] ?? 1} />}
    {d.heldPaper && <Sheet x={d.heldPaper[0]} y={d.heldPaper[1]} w={d.heldPaper[2]} h={d.heldPaper[3]} color="#e4dfcc" rot={-6}><div style={{position: 'absolute', left: '12%', top: '12%', width: '76%', height: '58%', background: '#79868a'}} /></Sheet>}
    {d.scale && <ScaleProp x={d.scale[0]} y={d.scale[1]} s={d.scale[2] ?? 1} />}
    {d.files && <Files x={d.files[0]} y={d.files[1]} s={d.files[2] ?? 1} />}
    {d.breath && <Breath x={d.breath[0]} y={d.breath[1]} f={p.f} s={d.breath[2] ?? 1} />}
  </>} over={d.top ? <div style={{position: 'absolute', inset: 0, background: `linear-gradient(rgba(0,0,0,0) 34%, rgba(2,4,8,${d.top}) 88%)`}} /> : undefined}
    fore={d.fore === 'ots' ? <OtsBlur side={d.foreSide ?? 'l'} color={d.foreColor ?? '#20242a'} /> : d.fore === 'driver' ? <DriverBlur /> : undefined} foreBlur={11} foreDark={0.55} />;
};

const FanH: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <svg width={190 * s} height={150 * s} viewBox="-95 -130 190 150" style={{position: 'absolute', left: x - 95 * s, top: y - 130 * s, overflow: 'visible', zIndex: 18}}>
    <path d="M0 0 L-90 -92 A127 127 0 0 1 90 -92 Z" fill="#f7f4ea" stroke="#b9b39e" strokeWidth={4} />
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M0 0 L${-82 + i * 20.5} ${-96 - Math.sin((i / 8) * Math.PI) * 26}`} stroke="#c9c3ae" strokeWidth={3} />)}
    <circle r={7} fill={C.gold} />
  </svg>
);

const ScaleProp: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <svg width={520 * s} height={520 * s} viewBox="-260 -520 520 520" style={{position: 'absolute', left: x - 260 * s, top: y - 520 * s, overflow: 'visible'}}>
    <path d="M-250 0 L-140 -60 H250 V0 Z" fill="#6b7377" stroke="#14181a" strokeWidth={5} />
    <path d="M-250 0 L-140 -60 L-140 -40 L-250 10 Z" fill="#4a5155" />
    <path d="M-120 -60 H230 M-120 -46 H230" stroke="#2d3234" strokeWidth={8} />
    <rect x={200} y={-470} width={28} height={420} fill="#545c60" />
    <circle cx={214} cy={-470} r={66} fill="#e6e8e2" stroke="#14181a" strokeWidth={7} />
    <path d="M214 -470 L250 -500" stroke="#b31b1b" strokeWidth={7} />
  </svg>
);

const Files: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <svg width={220 * s} height={160 * s} viewBox="0 0 220 160" style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    {['#7c3c2b', '#3e5a66', '#d8cda9'].map((c, i) => <rect key={i} x={i * 66} y={i === 2 ? 10 : 0} width={i === 2 ? 26 : 56} height={i === 2 ? 150 : 160} fill={c} stroke="#111" strokeWidth={3} />)}
  </svg>
);

const Breath: React.FC<{x: number; y: number; f: number; s: number}> = ({x, y, f, s}) => (
  <>{[0, 1, 2].map(i => {
    const t = ((f / 44 + i / 3) % 1);
    return <div key={i} style={{position: 'absolute', left: x + t * 60 * s - 40 * s, top: y - t * 44 * s - 26 * s, width: 80 * s * (1 + t), height: 52 * s * (1 + t), borderRadius: '50%', background: `rgba(240,248,255,${0.5 * (1 - t)})`, filter: `blur(${6 * s}px)`}} />;
  })}</>
);

const OtsBlur: React.FC<{side: 'l' | 'r'; color: string}> = ({side, color}) => (
  <div style={{position: 'absolute', [side]: -240, top: 320, width: 900, height: 950, borderRadius: '46% 46% 0 0', background: color} as React.CSSProperties}>
    <div style={{position: 'absolute', left: side === 'l' ? 300 : 240, top: -320, width: 360, height: 400, borderRadius: '50%', background: '#0a0a0c'}} />
  </div>
);

const DriverBlur: React.FC = () => <div style={{position: 'absolute', left: 1280, top: 200, width: 800, height: 1040, borderRadius: '50% 50% 0 0', background: '#08080b'}} />;

const ShoesRamp: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#030304" at={[42, 50]} vig={0.92} inner={22} z={1.03}>
    <Svg>
      <path d="M-20 1100 L-20 700 L1940 300 L1940 1100 Z" fill="#3b3e40" />
      {[0, 1].map(k => <path key={k} d={`M-20 ${900 + k * 120} L1940 ${500 + k * 120}`} stroke="#1c1d1f" strokeWidth={42} />)}
      {/* white shoe, lace hem touching the mist */}
      <path d="M640 540 H840 Q940 550 980 590 Q990 616 950 618 L640 648 Q600 600 640 540 Z" fill="#fbfaf4" stroke="#b9b5a6" strokeWidth={5} />
      <rect x={680} y={330} width={90} height={230} fill={C.skinP} />
      <path d="M540 -30 H920 L950 350 Q925 374 890 354 Q860 380 820 354 Q790 380 750 354 Q720 380 680 354 Q645 376 615 350 Z" fill={C.lace} stroke={C.laceD} strokeWidth={5} />
      {/* black leather following behind */}
      <rect x={1420} y={-30} width={190} height={380} fill="#07070a" />
      <path d="M1400 340 H1630 Q1700 350 1740 400 Q1740 426 1700 428 L1400 448 Q1370 400 1400 340 Z" fill="#0d0d11" stroke="#000" strokeWidth={4} />
    </Svg>
    <FloorMist y={760} f={p.f} a={0.34} h={260} />
    <Pool x={700} y={520} rx={720} color="225,235,245" a={0.3} />
  </Macro>
);

export const ICE: Record<string, ShotComponent> = {ice: IceScene};
export {STAND, Pen, RFace, RBox};
