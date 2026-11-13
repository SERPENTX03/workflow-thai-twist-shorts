import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {ActorView, parseActor} from '../../kit/stage';
import {Hand} from '../../kit/inserts';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {Actors, C, PX_CM, ROSTER, speaking} from './cast';
import {BigEye, D, Flames, K, Macro, Pool, Shot, Soft, Svg} from './common';

// เมรุ (brief.md → Sets): one place shot from two distances. MeruFar is the yard from far off, chimney and all, for the
// opening frame and its mirror. MeruNear is the porch in front of the kiln, a real room (room.tsx) open to the sky on the
// left, where people stand at the cast's own scale. tone: dusk (the false burning, orange sky) · late (the afternoon
// before) · morning (ash) · warm (the true burning, clear gold sky). The kiln mouth is always the light.

type Tone = 'dusk' | 'late' | 'morning' | 'warm';
const SKY: Record<Tone, [string, string, string]> = {
  dusk: ['#2c1c30', '#a8482c', '#f09238'],
  late: ['#7f6a5c', '#d2925c', '#efc07c'],
  morning: ['#9fb4c4', '#d7dcd2', '#efe5cc'],
  warm: ['#5d7da0', '#e9b477', '#ffdc9a'],
};
const toneOf = (p: ShotProps): Tone => (D(p).tone as Tone) ?? 'dusk';

// ---------------------------------------------------------------- far: the yard, the tower, the chimney

const Tree: React.FC<{x: number; y: number; s: number; c: string; seed?: number}> = ({x, y, s, c, seed = 11}) => (
  <svg width={520 * s} height={520 * s} viewBox="0 0 520 520" style={{position: 'absolute', left: x - 260 * s, top: y - 520 * s, overflow: 'visible'}}>
    <path d="M250 520 Q244 380 262 300 M262 340 Q210 290 150 270 M262 320 Q320 280 380 250 M150 270 Q110 240 80 230 M380 250 Q430 220 460 190 M262 300 Q258 220 280 150" stroke={c} strokeWidth={15} fill="none" strokeLinecap="round" />
    {/* bodhi leaves: small pointed pieces along the branches, never a blob */}
    {Array.from({length: 240}, (_, i) => {
      const a = rnd(seed, i) * Math.PI * 2, r = Math.sqrt(rnd(seed + 1, i)) * 230;
      const lx = 260 + Math.cos(a) * r, ly = 170 + Math.sin(a) * r * 0.62, l = 15 + rnd(seed + 2, i) * 15;
      return <path key={i} d={`M${-l} 0 Q0 ${-l * 0.55} ${l} 0 Q0 ${l * 0.55} ${-l} 0 Z`} fill={c} transform={`translate(${lx} ${ly}) rotate(${rnd(seed + 3, i) * 180})`} />;
    })}
  </svg>
);

const MeruFar: React.FC<{p: ShotProps; tone: Tone; smoke: boolean}> = ({p, tone, smoke}) => {
  const s = SKY[tone], dark = tone === 'dusk';
  const wall = dark ? '#6e4a3c' : '#d8c7a6', wallD = dark ? '#3f2a26' : '#a99473', brick = dark ? '#4f2b22' : '#9a6246', ground = dark ? '#2a1c1a' : '#7a6650';
  return (
    <>
      <div style={{position: 'absolute', left: -600, top: -500, width: 3100, height: 1500, background: `linear-gradient(${s[0]} 22%, ${s[1]} 58%, ${s[2]} 78%)`}} />
      <Pool x={1560} y={620} rx={900} ry={300} color={dark ? '255,150,70' : '255,225,160'} a={0.5} />
      <Tree x={170} y={770} s={1.35} c={dark ? '#1c1218' : '#4f5a42'} />
      <Tree x={1800} y={770} s={0.95} c={dark ? '#1f141a' : '#5a6448'} seed={31} />
      <Tree x={720} y={770} s={0.58} c={dark ? '#2a1a1e' : '#6c7554'} seed={51} />
      <div style={{position: 'absolute', left: -600, top: 700, width: 3100, height: 600, background: `linear-gradient(${ground}, ${dark ? '#0d0808' : '#4a3d30'} 60%)`}} />
      {/* the yard's paving running to the building */}
      <svg width={2} height={2} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {Array.from({length: 11}, (_, i) => <line key={i} x1={1240 + (i - 5) * 62} y1={700} x2={1240 + (i - 5) * 420} y2={1160} stroke="rgba(0,0,0,.28)" strokeWidth={3} />)}
      </svg>
      {/* the kiln's light along the paving, so the small black figure has something to stand against */}
      <Pool x={1240} y={770} rx={560} ry={120} color={dark ? '255,150,70' : '255,214,150'} a={dark ? 0.62 : 0.34} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'translate(620px, 150px) scale(.62)', transformOrigin: '0 0'}}>
        {smoke && <Plume f={p.f} dark={dark} />}
        <Svg>
          <path d="M962 96 L1040 96 L1058 470 L944 470 Z" fill={brick} />
          <path d="M1000 96 L1040 96 L1058 470 L1006 470 Z" fill={wallD} opacity={0.55} />
          {Array.from({length: 13}, (_, i) => <path key={i} d={`M${958 - i * 1.1} ${118 + i * 27} h${86 + i * 2.4}`} stroke="rgba(0,0,0,.25)" strokeWidth={3} />)}
          <rect x={950} y={84} width={102} height={18} fill={wallD} />
          <path d="M700 470 L820 370 L1180 370 L1300 470 Z" fill={dark ? '#3a1f22' : '#a34a32'} />
          <path d="M760 370 L860 300 L1140 300 L1240 370 Z" fill={dark ? '#32191d' : '#8c3e2a'} />
          <path d="M700 470 q-30 -6 -48 -40 M1300 470 q30 -6 48 -40 M760 370 q-24 -5 -40 -34 M1240 370 q24 -5 40 -34" stroke={C.gold} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.85} />
          <rect x={740} y={470} width={520} height={250} fill={wall} />
          <rect x={1070} y={470} width={190} height={250} fill={wallD} opacity={0.75} />
          {[780, 1200].map(x => <rect key={x} x={x} y={470} width={26} height={250} fill={wallD} />)}
          <rect x={700} y={720} width={600} height={44} fill={wallD} />
          <path d="M908 720 L908 590 Q1000 516 1092 590 L1092 720 Z" fill="#160b08" />
          {Array.from({length: 6}, (_, i) => {
            const y = 764 + i * 20, hw = 170 + i * 26;
            return <path key={i} d={`M${1000 - hw} ${y} h${hw * 2} l14 20 h${-hw * 2 - 28} Z`} fill={i % 2 ? wallD : wall} />;
          })}
        </Svg>
        {smoke ? (
          <>
            <Flames x={1000} y={716} w={168} h={118} f={p.f} seed={4} />
            <Pool x={1000} y={650} rx={340} ry={260} color="255,150,60" a={0.75} />
          </>
        ) : (
          <>
            <div style={{position: 'absolute', left: 930, top: 690, width: 140, height: 30, background: 'rgba(255,130,50,.5)', filter: 'blur(10px)'}} />
            <Pool x={1000} y={700} rx={200} ry={90} color="255,190,120" a={0.35} />
          </>
        )}
      </div>
    </>
  );
};

/** the plume leans with the evening air and lies across the sky: the first thing the eye reads as "something is burning" */
const Plume: React.FC<{f: number; dark: boolean}> = ({f, dark}) => (
  <>
    {Array.from({length: 26}, (_, i) => {
      const t = (i / 26 + f * 0.0016) % 1;
      const r = 34 + t * 250;
      return <div key={i} style={{position: 'absolute', left: 1000 - t * t * 1500 + Math.sin(t * 9) * 26 - r, top: 88 - Math.sqrt(t) * 300 + Math.sin(t * 6 + i) * 10 - r, width: r * 2, height: r * 2, borderRadius: '50%', filter: 'blur(9px)',
        background: `radial-gradient(circle, rgba(${dark ? '58,50,52' : '150,146,140'},${0.92 * (1 - t * 0.75)}) 0%, rgba(${dark ? '58,50,52' : '150,146,140'},0) 72%)`}} />;
    })}
  </>
);

// ---------------------------------------------------------------- near: the porch before the kiln

/** Scale here: floor y 930 ≈ w .708, where the room's px/cm is the cast's 3.0. */
const R = makeRoom({x: 900, y: 380}, {x0: 500, x1: 1380, y0: 235, y1: 655}, 3.4);

const Near: React.FC<{p: ShotProps; tone: Tone; open?: boolean; fire?: boolean; coffin?: 'shut' | 'open' | 'none'; r?: typeof R}> = ({p, tone, open = true, fire = true, coffin = 'shut', r = R}) => {
  const s = SKY[tone], dark = tone === 'dusk' || tone === 'late';
  const plaster = tone === 'dusk' ? '#6b4b3c' : tone === 'late' ? '#9c7d62' : '#c8b796';
  const id = `meru-${tone}-${r === R ? 'n' : 'l'}`;
  const mk = (u: number, v: number) => r.P(u, v, 0);
  const a = mk(0.36, 1), b = mk(0.64, 1), t = mk(0.5, 0.3);
  return (
    <>
      <RoomShell r={r} id={id} wall={plaster} side={plaster} sideFar={tone === 'dusk' ? '#3e2b24' : '#8e7a5c'} floorC={tone === 'dusk' ? '#3a2620' : '#857058'} ceiling={tone === 'dusk' ? '#1c1210' : '#5d4c3a'} walls="plain" floor="tiles" boards={10} />
      {/* the left wall is open: posts and the sky between them */}
      <RFace r={r} pts={[[0, 0.06, 0.02], [0, 0.06, 1], [0, 0.8, 1], [0, 0.8, 0.02]]} fill={s[1]} />
      <RFace r={r} pts={[[0, 0.5, 0.02], [0, 0.5, 1], [0, 0.8, 1], [0, 0.8, 0.02]]} fill={s[2]} />
      {[0.15, 0.5, 0.86].map(w => <RFace key={w} r={r} pts={[[0, 0, w], [0, 0, w + 0.07], [0, 1, w + 0.07], [0, 1, w]]} fill={tone === 'dusk' ? '#2b1c18' : '#7f6c50'} />)}
      {/* bricks round the kiln, then its iron frame and the mouth */}
      <RFace r={r} pts={[[0.28, 0.18, 0], [0.72, 0.18, 0], [0.72, 1, 0], [0.28, 1, 0]]} fill={tone === 'dusk' ? '#4a2a22' : '#8a5a42'} />
      <Svg>
        {Array.from({length: 13}, (_, i) => {
          const q = mk(0.28, 0.2 + i * 0.062), q2 = mk(0.72, 0.2 + i * 0.062);
          return <line key={i} x1={q.x} y1={q.y} x2={q2.x} y2={q2.y} stroke="rgba(0,0,0,.28)" strokeWidth={3} />;
        })}
        <path d={`M${a.x} ${a.y} L${a.x} ${t.y + 60} Q${t.x} ${t.y - 30} ${b.x} ${t.y + 60} L${b.x} ${b.y} Z`} fill={open ? '#120806' : '#2a2422'} stroke="#17110e" strokeWidth={14} />
      </Svg>
      {open && fire && <Flames x={t.x} y={a.y} w={b.x - a.x - 30} h={300} f={p.f} seed={8} />}
      {open && !fire && <div style={{position: 'absolute', left: a.x + 12, top: t.y + 40, width: b.x - a.x - 24, height: a.y - t.y - 40, background: tone === 'morning' ? 'linear-gradient(#3a2e26, #6e5a44)' : 'linear-gradient(#5a3a24, #b57d4b)'}} />}
      {!open && <Svg>
        <path d={`M${t.x} ${t.y + 10} V${a.y}`} stroke="#0f0c0b" strokeWidth={8} />
        <rect x={t.x - 26} y={a.y - 130} width={52} height={14} fill="#6a5a50" />
        <rect x={a.x + 16} y={a.y - 22} width={b.x - a.x - 32} height={16} fill="rgba(255,120,50,.85)" style={{filter: 'blur(6px)'}} />
      </Svg>}
      {/* a shelf of offerings against the wall, flowers, a standing fan: the place is used */}
      <RBox r={r} u={[0.82, 0.96]} v={[0.76, 1]} w={[0.02, 0.2]} front="#57402e" top="#715540" />
      <RFace r={r} pts={[[0.03, 0.2, 0], [0.2, 0.2, 0], [0.2, 0.6, 0], [0.03, 0.6, 0]]} fill={tone === 'dusk' ? '#2f1d18' : '#94775a'} />
      {/* the coffin on its stand, long side to us */}
      {coffin !== 'none' && <RBox r={r} u={[0.34, 0.37]} v={[0.8, 1]} w={[0.4, 0.46]} front="#3c2c20" />}
      {coffin !== 'none' && <RBox r={r} u={[0.63, 0.66]} v={[0.8, 1]} w={[0.4, 0.46]} front="#3c2c20" />}
      {coffin !== 'none' && <RBox r={r} u={[0.31, 0.69]} v={[0.62, 0.8]} w={[0.34, 0.5]} front="#ece7da" top={coffin === 'open' ? '#26262a' : '#f8f4ea'} side="#cfc8b6" rim="#c8a44e" />}
      {coffin !== 'none' && <Svg>{[0.36, 0.5, 0.64].map(u => { const q = r.P(u, 0.71, 0.5); return <g key={u}><circle cx={q.x} cy={q.y} r={15} fill="none" stroke="#c8a44e" strokeWidth={5} /><path d={`M${q.x - 44} ${q.y} H${q.x - 16} M${q.x + 16} ${q.y} H${q.x + 44}`} stroke="#c8a44e" strokeWidth={4} /></g>; })}</Svg>}
      <LightVeil id={id} lights={[[t.x, a.y - 120, 430], ...(tone === 'dusk' ? [] : [[300, 480, 620] as [number, number, number]])]} o={tone === 'dusk' ? 0.42 : tone === 'late' ? 0.28 : 0.16} color={tone === 'dusk' ? '#0d0406' : '#120c10'} />
      {open && fire && <Pool x={t.x} y={a.y - 90} rx={560} ry={380} color="255,140,60" a={0.55} />}
    </>
  );
};

// ---------------------------------------------------------------- drawn for themselves

/** The tray from above: `bones` = the true burning, the same tray and poker as the ash */
const Tray: React.FC<{p: ShotProps; bones?: boolean}> = ({p, bones}) => (
  <Macro p={p} bg="#17120f" at={[42, 42]} vig={0.72} z={1.03}>
    <Svg>
      <rect x={300} y={130} width={1320} height={720} rx={14} fill="#37322e" stroke="#16130f" strokeWidth={18} />
      <rect x={340} y={170} width={1240} height={640} rx={6} fill="#26211d" />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${370 + i * 150} 180 v620`} stroke="rgba(255,255,255,.04)" strokeWidth={8} />)}
      {/* ash, a low uneven mound in a dozen tones of grey */}
      <ellipse cx={960} cy={480} rx={500} ry={258} fill="#4a4641" style={{filter: 'blur(26px)'}} />
      <ellipse cx={900} cy={450} rx={330} ry={150} fill="#67625b" style={{filter: 'blur(34px)'}} />
      {Array.from({length: 620}, (_, i) => {
        const a = rnd(21, i) * Math.PI * 2, r = Math.sqrt(rnd(22, i));
        const x = 960 + Math.cos(a) * r * 500, y = 480 + Math.sin(a) * r * 258, g = 24 + Math.floor(rnd(23, i) * 90);
        return <circle key={i} cx={x} cy={y} r={1.5 + rnd(24, i) * 6} fill={`rgb(${g},${g - 2},${g - 5})`} />;
      })}
      {bones && [[770, 470, 150, 40, -14], [940, 420, 120, 32, 22], [1120, 510, 170, 38, 8], [840, 560, 100, 30, 48], [1030, 590, 90, 26, -30], [1190, 400, 80, 28, 60]].map(([x, y, w, h, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="#e9e3d2" stroke="#8d8676" strokeWidth={4} />
          <path d={`M${x - w / 3} ${y - 4} h${w * 0.5}`} stroke="#bdb5a0" strokeWidth={4} />
        </g>
      ))}
      <path d="M1540 980 L1180 620" stroke="#5e4630" strokeWidth={34} strokeLinecap="round" />
      <path d="M1180 620 L1120 560" stroke="#1d1a17" strokeWidth={22} strokeLinecap="round" />
    </Svg>
    {/* morning slanting in from the kiln door, frame left */}
    <Pool x={500} y={330} rx={1000} ry={640} color="255,232,190" a={0.42} />
  </Macro>
);

/** Coffin lid from straight above, close: nails, a hand pressing it down, coconut water running. `seeThrough` = the same
 *  frame opened up in memory: what the lid was hiding */
const LidTop: React.FC<{p: ShotProps; logs?: boolean}> = ({p, logs}) => (
  <Macro p={p} bg="#100b08" past={logs} at={[50, 46]} vig={0.6} z={1.04}>
    <Svg>
      <rect x={160} y={110} width={1600} height={760} fill="#efeade" stroke="#b49a58" strokeWidth={14} />
      {logs && <>
        <rect x={210} y={160} width={1500} height={660} fill="#cfc9b9" />
        {[230, 440, 650].map((y, i) => (
          <g key={y}>
            <rect x={300 + i * 30} y={y} width={1300 - i * 40} height={170} rx={80} fill="#7a5a3c" stroke="#3c2a1a" strokeWidth={8} />
            <ellipse cx={320 + i * 30} cy={y + 85} rx={38} ry={82} fill="#c29b6a" stroke="#3c2a1a" strokeWidth={7} />
            <ellipse cx={320 + i * 30} cy={y + 85} rx={18} ry={42} fill="none" stroke="#7a5a3c" strokeWidth={5} />
            {[0.3, 0.55, 0.8].map(u => <path key={u} d={`M${300 + (1300 - i * 40) * u} ${y + 34} q40 50 0 110`} stroke="#4a3522" strokeWidth={6} fill="none" />)}
          </g>
        ))}
        {/* the white cloth laid over them, folded back */}
        <path d="M210 160 H1710 V300 Q1200 370 700 290 Q400 250 210 330 Z" fill="#f3efe4" opacity={0.95} />
      </>}
      {!logs && [[220, 170], [1700, 170], [220, 810], [1700, 810]].map(([x, y]) => <g key={x + '' + y}><circle cx={x} cy={y} r={20} fill="#6f6a60" /><circle cx={x - 5} cy={y - 5} r={7} fill="#cfc9ba" /></g>)}
      {!logs && <path d="M160 490 H1760" stroke="#d8d2c2" strokeWidth={6} />}
      {/* the water: a thin line that shines, running along the lid */}
      <path d="M880 110 Q900 280 960 400 T1130 860" stroke="rgba(120,190,225,.95)" strokeWidth={18} fill="none" strokeLinecap="round" />
    </Svg>
    {/* Prasit's hand on the lid, his safari cuff from the right; he holds the undertaker's wrist with the other */}
    <Hand x={1040} y={470} s={2.3} rot={200} skin="#c79a78" sleeve="#4f6653" mode="open" />
    <Pool x={700} y={300} rx={900} ry={520} color="255,190,120" a={logs ? 0.2 : 0.32} />
  </Macro>
);

/** Gown or box laid in the open coffin, seen from straight above */
const OnChest: React.FC<{p: ShotProps; box?: boolean}> = ({p, box}) => (
  <Macro p={p} bg="#100c09" at={[48, 44]} vig={0.66} z={1.04}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1120} fill="#e6dfd0" />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${-20 + i * 260} -20 q60 500 -30 1120`} stroke="rgba(120,105,80,.25)" strokeWidth={10} fill="none" />)}
      <path d="M420 -20 L1500 -20 L1680 1100 L240 1100 Z" fill={C.gown} />
      <path d="M760 -20 L960 610 L1160 -20" fill="none" stroke={C.gownRed} strokeWidth={70} />
      <path d="M960 610 V1100" stroke="#000" strokeWidth={8} />
      {box && <g>
        <rect x={700} y={500} width={520} height={330} fill="#f2efe6" stroke="#a8a496" strokeWidth={4} />
        <path d="M700 500 L770 440 L1150 440 L1220 500 Z" fill="#fbf9f1" stroke="#a8a496" strokeWidth={4} />
      </g>}
      {!box && <g transform="translate(960 420)">
        <circle r={78} fill={C.gold} stroke="#7c5f1a" strokeWidth={8} />
        <circle r={50} fill="none" stroke="#7c5f1a" strokeWidth={5} />
        <path d="M-40 70 L-60 170 L0 130 L60 170 L40 70 Z" fill={C.gownRed} />
        <circle cx={-26} cy={-30} r={14} fill="#fff4cc" opacity={0.9} />
      </g>}
    </Svg>
    {box
      ? <><Hand x={460} y={800} s={2} rot={-40} skin={C.skinT} mode="open" /><Hand x={1460} y={800} s={2} rot={220} skin={C.skinT} mode="open" /></>
      : <Hand x={1320} y={560} s={1.9} rot={190} skin={C.skinT} mode="open" />}
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: 'linear-gradient(110deg, rgba(255,200,130,.32), rgba(255,200,130,0) 60%)', mixBlendMode: 'screen'}} />
  </Macro>
);

/** Thyme's hand pouring coconut water over his father's face, seen from over the coffin: the face is the sprite, laid back */
export const LaidFace: React.FC<{x: number; y: number; h: number; who?: string; f: number; rot?: number}> = ({x, y, h, who = 'charn3', f, rot = 0}) => (
  <div style={{position: 'absolute', left: 0, top: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`}}>
    <ActorView a={{...parseActor(`${who}@${x},${y + h} sleep`), h}} roster={ROSTER} floor={0} pxPerCm={PX_CM} f={f} />
  </div>
);

const CoconutFace: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#17110c" at={[46, 42]} vig={0.6}>
    <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#e7dfcd" /></Svg>
    <LaidFace x={960} y={-20} h={2100} f={p.f} />
    <Svg><path d="M-20 1100 V760 Q960 660 1940 760 V1100 Z" fill="#f3efe4" stroke="#c9c1ae" strokeWidth={6} /></Svg>
    {/* half a coconut tipped in Thyme's hand, from out of frame: he is not in this picture; a thin line of water on the brow */}
    <Svg>
      <path d="M1208 104 Q1120 120 1060 190 Q1046 210 1044 226" stroke="rgba(150,215,245,.98)" strokeWidth={15} fill="none" strokeLinecap="round" />
      <circle cx={1040} cy={250} r={11} fill="rgba(170,225,250,.95)" />
      <circle cx={1080} cy={298} r={7} fill="rgba(170,225,250,.9)" />
      <g transform="translate(1310 70) rotate(-28)"><path d="M-130 0 A130 110 0 0 0 130 0 Z" fill="#6f8a3d" stroke="#2f3a18" strokeWidth={7} /><ellipse rx={130} ry={30} fill="#f3efe2" stroke="#9aa08c" strokeWidth={5} /></g>
    </Svg>
    <Hand x={1520} y={30} s={1.5} rot={176} skin={C.skinT} sleeve={C.gown} mode="grip" />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,190,110,.38), rgba(255,190,110,0) 62%)', mixBlendMode: 'screen'}} />
  </Macro>
);

/** Thyme bent over him, ear to mouth: only the side of his head, dark against the light behind */
const LineClose: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#17110c" at={[46, 42]} vig={0.6}>
    <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#e7dfcd" /></Svg>
    <LaidFace x={1180} y={-20} h={1900} f={p.f} />
    <Svg><path d="M-20 1100 V760 Q960 660 1940 760 V1100 Z" fill="#f3efe4" stroke="#c9c1ae" strokeWidth={6} /></Svg>
    <div style={{position: 'absolute', left: 60, top: 20, width: 720, height: 980}}>
      <ActorView a={{...parseActor('thyme3@360,2500 sad'), h: 2300, talk: true, rig: {yaw: '0.45', head: '14'}}} roster={ROSTER} floor={0} pxPerCm={PX_CM} f={p.f} talking={speaking(p.shot, p.f, p.len)} />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,190,110,.38), rgba(255,190,110,0) 62%)', mixBlendMode: 'screen'}} />
  </Macro>
);

// ---------------------------------------------------------------- the switch

const FAR = new Set(['chimney-ew', 'chimney-ew2']);

const MeruScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  const tone = toneOf(p);
  if (v === 'ash-top') return <Tray p={p} />;
  if (v === 'bones-top') return <Tray p={p} bones />;
  if (v === 'prasit-hand-close' || v === 'prasit-hand-ins') return <LidTop p={p} />;
  if (v === 'logs-top') return <LidTop p={p} logs />;
  if (v === 'gown-ins') return <OnChest p={p} />;
  if (v === 'box-return-ins') return <OnChest p={p} box />;
  if (v === 'coconut-close') return <CoconutFace p={p} />;
  if (v === 'line-close') return <LineClose p={p} />;
  if (FAR.has(v)) {
    return <Shot p={p} world={<>
      <MeruFar p={p} tone={tone} smoke={v === 'chimney-ew'} />
      <Actors p={p} pxPerCm={0.62} floor={900} />
    </>} />;
  }
  if (v === 'thyme-ecu') return (
    <Macro p={p} bg="#0d0604" at={[58, 42]} vig={0.86} inner={30} z={1.06}>
      <BigEye skin={C.skinT} skinD={C.skinTD} lid={0.22} look={0.2} glint={<g><path d="M-40 60 Q-26 -30 0 -74 Q30 -20 44 60 Z" fill="#ff9a2e" /><path d="M-18 60 Q-8 0 4 -30 Q16 6 22 60 Z" fill="#ffe08a" /></g>} wet tear={0.22} />
      <div style={{position: 'absolute', left: -20, top: -20, width: 900, height: 1120, background: 'linear-gradient(90deg, rgba(4,2,2,.92), rgba(4,2,2,.55) 60%, rgba(4,2,2,0))'}} />
      <Pool x={1400} y={500} rx={700} color="255,130,50" a={0.34} />
    </Macro>
  );
  if (v === 'bearers-low') return <BearersLow p={p} />;
  if (v === 'thyme-sil') return <ThymeSil p={p} />;
  const coffin = d.coffin ?? 'none';
  const fire = d.fire !== false && tone !== 'morning' && tone !== 'late';
  return <Shot p={p} world={<>
    <Soft p={p}><Near p={p} tone={tone} open={d.door !== 'shut'} fire={fire} coffin={coffin} /></Soft>
    <Actors p={p} />
    {d.frame && <PhotoFrame x={d.frame[0]} y={d.frame[1]} s={d.frame[2] ?? 1} />}
    {d.coconut && <Coconut x={d.coconut[0]} y={d.coconut[1]} open={!!d.coconutOpen} />}
    {d.stool && <Svg><rect x={d.stool[0] - 90} y={d.stool[1]} width={180} height={18} fill="#5e4630" stroke="#2c2015" strokeWidth={3} />{[-70, 70].map(k => <rect key={k} x={d.stool[0] + k - 8} y={d.stool[1] + 18} width={16} height={930 - d.stool[1] - 18} fill="#4a3522" />)}</Svg>}
    {d.urn && <Urn x={d.urn[0]} y={d.urn[1]} s={d.urn[2] ?? 1} />}
    {d.pole && <Svg><rect x={300} y={d.pole} width={1200} height={30} fill="#5e4630" stroke="#2c2015" strokeWidth={4} /><rect x={1180} y={d.pole - 120} width={420} height={120} fill="#ece7da" stroke="#c8a44e" strokeWidth={4} /></Svg>}
  </>} fore={d.ots ? <OtsShoulder side={d.ots} /> : undefined} foreBlur={10} foreDark={0.4} />;
};

/** The steps seen side-on from their foot, sky behind: men as black shapes, the white coffin on their shoulders, tilted
 *  and heavy, the kiln's mouth at the top of the climb. */
const BearersLow: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#2c1c30" at={[70, 30]} vig={0.5} z={1.03} ox={1100} oy={380}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${SKY.dusk[0]} 0%, ${SKY.dusk[1]} 45%, ${SKY.dusk[2]} 85%)`}} />
      <Svg>
        <rect x={1380} y={120} width={700} height={760} fill="#2a1712" />
        <path d="M1530 560 V300 Q1680 190 1830 300 V560 Z" fill="#0f0705" />
        <path d="M-40 1100 L-40 980 L420 930 L1380 560 L2000 560 L2000 1100 Z" fill="#150c0b" />
        {Array.from({length: 11}, (_, i) => <path key={i} d={`M${420 + i * 87} ${930 - i * 33.6} h87 v-33.6`} fill="none" stroke="#3a241d" strokeWidth={6} />)}
      </Svg>
      <Flames x={1680} y={560} w={270} h={230} f={p.f} seed={3} />
      <Pool x={1680} y={440} rx={520} color="255,140,60" a={0.7} />
      <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}>{['bearer-sil@470,930', 'bearer2-sil@760,818', 'bearer-sil@1050,706', 'bearer2-sil@1340,594'].map((a, i) => (
        <ActorView key={i} a={{...parseActor(`${a} ${i % 2 ? 'armR=raise' : 'armL=raise'} head=${i % 2 ? -8 : 8}`), h: 480}} roster={ROSTER} floor={930} pxPerCm={PX_CM} f={p.f} />
      ))}</div>
      <div style={{position: 'absolute', left: 330, top: 345 - k * 6, width: 1140, height: 150, background: 'linear-gradient(#f4efe2, #cfc6b4)', transform: 'rotate(-21.1deg)', transformOrigin: '0 100%', borderBottom: '10px solid #2a1712', borderTop: '6px solid #c8a44e', boxShadow: '0 12px 30px rgba(0,0,0,.4)'}} />
    </Macro>
  );
};

/** Thyme black in the kiln's lit doorway with the urn, all of him, a long shadow coming at us along the bricks */
const ThymeSil: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#100c0a" at={[50, 40]} vig={0.8} inner={26} z={1.05}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill="#1d1612" />
      {Array.from({length: 18}, (_, i) => <line key={i} x1={0} y1={40 + i * 48} x2={1920} y2={40 + i * 48} stroke="rgba(0,0,0,.34)" strokeWidth={4} />)}
      <rect x={-10} y={800} width={1940} height={300} fill="#2c221b" />
      <path d="M660 800 V300 Q960 70 1260 300 V800 Z" fill="#fff6df" stroke="#0d0a08" strokeWidth={30} />
      <path d="M690 800 V310 Q960 110 1230 310 V800 Z" fill="url(#mdoor)" />
      <defs><linearGradient id="mdoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffbe9" /><stop offset="1" stopColor="#e6c48a" /></linearGradient></defs>
      <path d="M660 800 L1260 800 L1580 1110 L340 1110 Z" fill="#e9c88f" opacity={0.28} />
      <path d="M880 800 L1040 800 L1120 1110 L800 1110 Z" fill="#050406" opacity={0.75} />
    </Svg>
    <Pool x={960} y={420} rx={620} color="255,240,205" a={0.5} />
    <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><ActorView a={{...parseActor('thyme1-sil@960,806 armL=chest armR=chest'), h: 560}} roster={ROSTER} floor={806} pxPerCm={PX_CM} f={p.f} /></div>
    <Svg><path d="M926 560 Q918 494 944 470 H976 Q1002 494 994 560 Z" fill="#050406" /><path d="M944 470 Q960 440 976 470 Z" fill="#050406" /><path d="M930 556 Q922 500 946 472" stroke="#e6c48a" strokeWidth={3} fill="none" /></Svg>
  </Macro>
);

/** his father's picture in a black frame, held at the chest */
export const PhotoFrame: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg width={190 * s} height={230 * s} viewBox="0 0 190 230" style={{position: 'absolute', left: x - 95 * s, top: y - 115 * s, overflow: 'visible', zIndex: 18}}>
    <rect x={0} y={0} width={190} height={230} rx={5} fill="#0e0e12" stroke="#40404a" strokeWidth={5} />
    <rect x={16} y={16} width={158} height={198} fill="#b8ad96" />
    <circle cx={95} cy={92} r={40} fill="#c79a78" />
    <path d="M58 74 Q95 40 132 74" fill="#4c463f" />
    <path d="M28 214 Q40 138 95 134 Q150 138 162 214 Z" fill={C.tee} />
    <path d="M78 108 Q95 118 112 108" stroke="#5b3b2c" strokeWidth={4} fill="none" />
    <circle cx={80} cy={88} r={4} fill="#221" /><circle cx={110} cy={88} r={4} fill="#221" />
  </svg>
);

const Coconut: React.FC<{x: number; y: number; open?: boolean}> = ({x, y, open}) => (
  <svg width={110} height={110} viewBox="-55 -55 110 110" style={{position: 'absolute', left: x - 55, top: y - 55, overflow: 'visible', zIndex: 18}}>
    <circle r={50} fill={open ? '#f3efe2' : '#6f8a3d'} stroke="#2f3a18" strokeWidth={5} />
    {open ? <ellipse cy={-6} rx={36} ry={22} fill="#d8dfd0" stroke="#9aa08c" strokeWidth={3} /> : <path d="M-30 -30 Q0 -44 30 -30" stroke="#a3bb62" strokeWidth={6} fill="none" />}
  </svg>
);

export const Urn: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg width={120 * s} height={180 * s} viewBox="-60 -180 120 180" style={{position: 'absolute', left: x - 60 * s, top: y - 180 * s, overflow: 'visible', zIndex: 18}}>
    <path d="M-34 0 Q-60 -80 -30 -130 H30 Q60 -80 34 0 Z" fill="#c9a24a" stroke="#6e5316" strokeWidth={5} />
    <rect x={-36} y={-140} width={72} height={14} rx={4} fill="#a07f30" />
    <path d="M-22 -140 Q0 -192 22 -140 Z" fill="#c9a24a" stroke="#6e5316" strokeWidth={5} />
    <path d="M-24 -100 Q-34 -60 -18 -20" stroke="#ffe9a8" strokeWidth={7} fill="none" opacity={0.8} />
  </svg>
);

const OtsShoulder: React.FC<{side: 'l' | 'r'}> = ({side}) => (
  <div style={{position: 'absolute', [side === 'l' ? 'left' : 'right']: -190, top: 250, width: 880, height: 1000, borderRadius: '46% 46% 0 0', background: '#07070a'} as React.CSSProperties}>
    <div style={{position: 'absolute', left: side === 'l' ? 300 : 260, top: -300, width: 360, height: 400, borderRadius: '50%', background: '#07070a'}} />
  </div>
);

export const MERU: Record<string, ShotComponent> = {meru: MeruScene};
