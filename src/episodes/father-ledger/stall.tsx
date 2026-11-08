import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {Haze} from '../../kit/depth';
import {Hand} from '../../kit/inserts';
import {ActorView, parseActor} from '../../kit/stage';
import {Actors, C, PX_CM, ROSTER} from './cast';
import {BigEye, BigMouth, D, FloorMist, HangBulb, K, Lotus, Macro, Pen, Pool, Shot, Soft, Svg, Typed} from './common';

// เขียงหมู (brief.md → Sets), the story's main place, built once and shot from four positions:
//   in      inside the stall, looking at its back wall: hooks, the sawn-down block, the steel cabinet on hidden wheels
//   front   from the alley, looking in through the parted bamboo blind
//   out     from inside, looking out through the blind at the alley and whatever has parked in it
//   alley   the alley itself, one long perspective to the stall at its far end, the old ice plant's wall above
//   market  the morning market next door, canvas and yellow bulbs
// data.time: day (sun), dusk (headlights), night (torch only). The red bulb over the block is always the stall's own light.

const WALL = '#5a5147', FLOOR_C = '#3f3a35';
const R = makeRoom({x: 820, y: 400}, {x0: 420, x1: 1440, y0: 225, y1: 665}, 3.3);
const RED = (r = R) => r.P(0.55, 0.3, 0.5);

type Time = 'day' | 'dusk' | 'night';
const timeOf = (p: ShotProps): Time => (D(p).time as Time) ?? 'day';

/** block: h = surface height. The story's block is low: a seated man's height. `tall` is before the saw. */
const Block: React.FC<{r: typeof R; u?: number; w?: number; tall?: boolean}> = ({r, u = 0.55, w = 0.55, tall}) => {
  const v0 = tall ? 0.68 : 0.84;
  const c = r.P(u, v0, w), rx = 0.13 * (r.back.x1 - r.back.x0) * r.s(w);
  const f = r.P(u, 1, w);
  return (
    <Svg>
      {[-0.7, 0.7].map(k => <rect key={k} x={c.x + k * rx - 18} y={c.y + 30} width={36} height={f.y - c.y - 24} fill="#3a2a1c" stroke="#120c08" strokeWidth={3} />)}
      {!tall && [-0.7, 0.7].map(k => <rect key={'s' + k} x={c.x + k * rx - 18} y={f.y - 14} width={36} height={8} fill="#b59c78" />)}
      <path d={`M${c.x - rx} ${c.y} A${rx} ${rx * 0.34} 0 0 1 ${c.x + rx} ${c.y} L${c.x + rx} ${c.y + 56} A${rx} ${rx * 0.34} 0 0 1 ${c.x - rx} ${c.y + 56} Z`} fill="#6f4f33" stroke="#1c120a" strokeWidth={4} />
      <ellipse cx={c.x} cy={c.y} rx={rx} ry={rx * 0.34} fill="#a67d55" stroke="#1c120a" strokeWidth={4} />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${c.x - rx * 0.7 + rnd(5, i) * rx * 1.1} ${c.y - rx * 0.2 + rnd(6, i) * rx * 0.34} l${30 + rnd(7, i) * 50} ${rnd(8, i) * 20 - 10}`} stroke="#5d3f27" strokeWidth={3} />)}
      <ellipse cx={c.x} cy={c.y} rx={rx * 0.5} ry={rx * 0.16} fill="none" stroke="#8a6340" strokeWidth={2.5} />
    </Svg>
  );
};

const Hooks: React.FC<{r: typeof R; shirt?: boolean}> = ({r, shirt = true}) => {
  const a = r.P(0.08, 0.2, 0), b = r.P(0.58, 0.2, 0);
  return (
    <Svg>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#25221f" strokeWidth={9} />
      {Array.from({length: 7}, (_, i) => { const q = r.P(0.1 + i * 0.075, 0.2, 0); return <path key={i} d={`M${q.x} ${q.y} v24 q0 16 -12 16 q-10 0 -10 -12`} stroke="#8d8880" strokeWidth={5} fill="none" />; })}
      {shirt && (() => { const q = r.P(0.55, 0.26, 0); return <path d={`M${q.x - 54} ${q.y} L${q.x - 20} ${q.y - 14} Q${q.x} ${q.y - 2} ${q.x + 20} ${q.y - 14} L${q.x + 54} ${q.y} L${q.x + 40} ${q.y + 38} L${q.x + 28} ${q.y + 30} L${q.x + 30} ${q.y + 130} L${q.x - 30} ${q.y + 130} L${q.x - 28} ${q.y + 30} L${q.x - 40} ${q.y + 38} Z`} fill={C.tee} stroke="#7d7566" strokeWidth={3} />; })()}
    </Svg>
  );
};

const Blind: React.FC<{x: number; w: number; y0: number; y1: number; slats?: number; c?: string}> = ({x, w, y0, y1, slats = 40, c = '#8a7145'}) => (
  <Svg>
    {Array.from({length: slats}, (_, i) => <rect key={i} x={x} y={y0 + (i * (y1 - y0)) / slats} width={w} height={(y1 - y0) / slats - 3} fill={i % 3 ? c : '#77603a'} />)}
    <rect x={x - 6} y={y0 - 10} width={w + 12} height={14} fill="#3a2a1a" />
  </Svg>
);

/** Inside, looking at the back wall */
const In: React.FC<{p: ShotProps; time: Time; opened?: boolean; tall?: boolean; pushed?: boolean; shirt?: boolean; id?: string}> = ({p, time, tall, pushed, shirt = true, id = 'stall-in'}) => {
  const r = R, sun = time === 'day';
  const blindSide = r.P(1, 0.5, 0.5);
  const bulb = RED(r);
  return (
    <>
      <RoomShell r={r} id={id} wall={WALL} side="#4a433b" sideFar="#6b6355" floorC={FLOOR_C} ceiling="#1d1a18" floor="plain" walls="plain" />
      {/* stains and tile along the wall: decades of washing down */}
      <RFace r={r} pts={[[0, 0.62, 0], [1, 0.62, 0], [1, 1, 0], [0, 1, 0]]} fill="#7d7a70" />
      <Svg>
        {Array.from({length: 20}, (_, i) => { const a = r.P(i / 20, 0.62, 0), b = r.P(i / 20, 1, 0); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,.25)" strokeWidth={2} />; })}
        {[0.74, 0.87].map(v => { const a = r.P(0, v, 0), b = r.P(1, v, 0); return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,.25)" strokeWidth={2} />; })}
        {Array.from({length: 7}, (_, i) => { const q = r.P(0.1 + i * 0.13, 0.62, 0); return <path key={i} d={`M${q.x} ${q.y} q6 ${60 + rnd(3, i) * 90} -2 ${130 + rnd(4, i) * 100}`} stroke="rgba(40,24,18,.3)" strokeWidth={12 + rnd(5, i) * 10} fill="none" />; })}
      </Svg>
      <Hooks r={r} shirt={shirt} />
      {/* the price board */}
      <RFace r={r} pts={[[0.04, 0.32, 0], [0.22, 0.32, 0], [0.22, 0.56, 0], [0.04, 0.56, 0]]} fill="#3f2d1d" stroke="#120c08" />
      {(() => { const q = r.P(0.13, 0.42, 0); return <div style={{position: 'absolute', left: q.x - 60, top: q.y - 28, fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 44, color: '#dfd9c8'}}>180.-</div>; })()}
      {/* the steel cabinet; pushed aside it shows the low iron door behind */}
      {pushed && <RFace r={r} pts={[[0.68, 0.34, 0], [0.92, 0.34, 0], [0.92, 1, 0], [0.68, 1, 0]]} fill="#191c1f" stroke="#050505" />}
      <RBox r={r} u={pushed ? [0.42, 0.66] : [0.68, 0.94]} v={[0.16, 1]} w={[0.01, 0.16]} front="#5f6a6e" side="#3d4548" top="#7a868a" />
      {(() => { const c = r.P(pushed ? 0.54 : 0.81, 0.58, 0.16); return <Svg><line x1={c.x} y1={c.y - 190} x2={c.x} y2={c.y + 210} stroke="#2a2f31" strokeWidth={5} /><rect x={c.x + 12} y={c.y - 20} width={12} height={50} rx={3} fill="#c9cfd0" /></Svg>; })()}
      {/* a radio, a stack of crates, a hose */}
      <RBox r={r} u={[0.02, 0.2]} v={[0.74, 1]} w={[0.02, 0.26]} front="#4f6a7a" top="#6a8796" side="#3b505c" />
      <Svg>{(() => { const q = r.P(0.3, 1, 0.1); return <path d={`M${q.x} ${q.y} q90 20 60 70 q-40 50 40 60 q120 10 90 -50`} stroke="#27321f" strokeWidth={12} fill="none" />; })()}</Svg>
      <Block r={r} tall={tall} />
      {/* the blind on the right wall lets the sun in as rakes across the floor and wall */}
      {sun && <Svg>
        {Array.from({length: 7}, (_, i) => {
          const u0 = 0.2 + i * 0.1, a = r.P(u0, 1, 0.08), b = r.P(u0 + 0.05, 1, 0.08), c = r.P(u0 + 0.3, 1, 0.9), d = r.P(u0 + 0.22, 1, 0.9);
          return <polygon key={i} points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`} fill="#ffdf9a" opacity={0.3} />;
        })}
      </Svg>}
      <LightVeil id={id} lights={[[bulb.x, bulb.y + 180, 460], ...(sun ? [[1600, 720, 720] as [number, number, number]] : [])]} o={sun ? 0.34 : 0.62} color="#0a0406" />
      <HangBulb x={bulb.x} y={bulb.y} top={r.P(0.55, 0, 0.5).y} r={22} />
      <Pool x={bulb.x} y={bulb.y + 240} rx={520} ry={420} color="255,40,30" a={0.26} />
      {sun && <Pool x={1760} y={560} rx={520} ry={560} color="255,226,170" a={0.3} />}
      {sun && <Blind x={1760} w={260} y0={-60} y1={980} />}
      {sun && <Svg>{Array.from({length: 14}, (_, i) => <rect key={i} x={1760} y={40 + i * 70} width={260} height={10} fill="#fff1c9" opacity={0.75} />)}</Svg>}
    </>
  );
};

/** The alley behind the market, a long box open to the sky. Stall at the far end, the plant's wall above it. */
const ALLEY = makeRoom({x: 980, y: 420}, {x0: 800, x1: 1200, y0: 150, y1: 560}, 7);

const Alley: React.FC<{p: ShotProps; time: Time; sign?: boolean; benz?: 'near' | 'none'}> = ({p, time, benz = 'none'}) => {
  const r = ALLEY;
  const dusk = time === 'dusk', night = time === 'night';
  const skyTop = dusk ? '#191633' : night ? '#07080f' : '#b9cfdb', skyLow = dusk ? '#57345c' : night ? '#10121c' : '#e8ece2';
  const wall = dusk || night ? '#25222a' : '#8c8373', wallD = dusk || night ? '#15141a' : '#5d564b';
  const floor = dusk || night ? '#16151a' : '#6d675d';
  const shop = (u0: number, u1: number, side: 0 | 1, i: number) => {
    const col = ['#6f7a7c', '#7c6d5a', '#5e6a70', '#756a5f'][i % 4];
    return <RFace key={side + '-' + i} r={r} pts={[[side, 0.34, u0], [side, 0.34, u1], [side, 1, u1], [side, 1, u0]]} fill={dusk || night ? '#1b1c21' : col} stroke="#191816" sw={4} />;
  };
  return (
    <>
      <div style={{position: 'absolute', left: -800, top: -600, width: 3500, height: 1300, background: `linear-gradient(${skyTop}, ${skyLow})`}} />
      <RFace r={r} pts={[[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]]} fill={floor} />
      <RFace r={r} pts={[[0, -1, 0], [0, -1, 1], [0, 1, 1], [0, 1, 0]]} fill={wallD} />
      <RFace r={r} pts={[[1, -1, 0], [1, -1, 1], [1, 1, 1], [1, 1, 0]]} fill={wall} />
      {Array.from({length: 6}, (_, i) => shop(0.05 + i * 0.155, 0.17 + i * 0.155, 0, i))}
      {Array.from({length: 6}, (_, i) => shop(0.05 + i * 0.155, 0.17 + i * 0.155, 1, i + 2))}
      {/* the old ice plant's wall, closing the alley, with its faded sign */}
      <RFace r={r} pts={[[0, -1, 0], [1, -1, 0], [1, 1, 0], [0, 1, 0]]} fill={dusk || night ? '#1e1c22' : '#a39a88'} />
      {(() => { const a = r.P(0.2, -0.5, 0); return <div style={{position: 'absolute', left: a.x, top: a.y, fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 40, color: dusk || night ? '#34323a' : '#6e6554', whiteSpace: 'nowrap', opacity: 0.85}}>โรงน้ำแข็ง</div>; })()}
      {/* the stall: a lean-to of tin and bamboo against that wall */}
      <RFace r={r} pts={[[0.04, 0.24, 0.02], [0.72, 0.24, 0.02], [0.72, 1, 0.02], [0.04, 1, 0.02]]} fill="#15110f" />
      <RFace r={r} pts={[[0.04, 0.24, 0.02], [0.72, 0.24, 0.02], [0.72, 0.3, 0.08], [0.04, 0.3, 0.08]]} fill={dusk || night ? '#2c2f35' : '#7b8388'} />
      <RFace r={r} pts={[[0.09, 0.3, 0.03], [0.36, 0.3, 0.03], [0.36, 1, 0.03], [0.09, 1, 0.03]]} fill="#8a7145" stroke="#3a2a1a" />
      <RFace r={r} pts={[[0.42, 0.3, 0.03], [0.68, 0.3, 0.03], [0.68, 1, 0.03], [0.42, 1, 0.03]]} fill="#7f6840" stroke="#3a2a1a" />
      {(() => { const c = r.P(0.39, 0.5, 0.03); return <Pool x={c.x} y={c.y} rx={60} ry={110} color="255,50,30" a={dusk || night ? 0.9 : 0.55} />; })()}
      {/* the sun drops one bar into the alley */}
      {!dusk && !night && <RFace r={r} pts={[[0.26, 1, 0.3], [0.86, 1, 0.3], [0.8, 1, 0.74], [0.2, 1, 0.74]]} fill="#ffefc4" o={0.55} />}
      {/* wet patches shining along the middle of the floor */}
      <Svg>{Array.from({length: 6}, (_, i) => { const q = r.P(0.3 + rnd(41, i) * 0.4, 1, 0.2 + i * 0.13); return <ellipse key={i} cx={q.x} cy={q.y} rx={46 * r.s(0.2 + i * 0.13)} ry={8 * r.s(0.2 + i * 0.13)} fill={dusk || night ? '#2c2a3c' : '#c8d2d4'} opacity={0.5} />; })}</Svg>
      {/* overhead wires */}
      <Svg><path d="M-200 120 Q600 300 1200 180 T2200 150 M-200 200 Q700 340 1300 220" stroke="#0f0e10" strokeWidth={6} fill="none" /></Svg>
      {benz === 'near' && (dusk || night) && <Svg>
        <path d="M900 800 L840 500 L1120 500 L1060 800 Z" fill="#fff6d0" opacity={0.26} style={{filter: 'blur(10px)'}} />
      </Svg>}
      {benz === 'near' && (dusk || night) && (() => { const c = r.P(0.39, 0.62, 0); return <Pool x={c.x} y={c.y} rx={190} ry={190} color="255,246,214" a={0.55} />; })()}
      {!dusk && !night && <Haze y={520} h={260} f={p.f} a={0.1} />}
      <LightVeil id="stall-alley" lights={dusk || night ? [[r.P(0.39, 0.6, 0).x, r.P(0.39, 0.6, 0).y, 340]] : [[960, 760, 700]]} o={dusk || night ? 0.42 : 0.28} color="#06060c" />
    </>
  );
};

/** A black saloon seen from behind / front, wide enough to fill the alley. (x, y) = the ground at its centre. */
export const Benz: React.FC<{x: number; y: number; s?: number; lights?: boolean; back?: boolean; window?: boolean}> = ({x, y, s = 1, lights, back, window: win}) => (
  <svg width={760 * s} height={420 * s} viewBox="-380 -420 760 420" style={{position: 'absolute', left: x - 380 * s, top: y - 420 * s, overflow: 'visible'}}>
    <ellipse cx={0} cy={-4} rx={370} ry={22} fill="#000" opacity={0.6} />
    <path d="M-320 -60 Q-340 -150 -296 -196 L-222 -318 Q-210 -340 -170 -340 H170 Q210 -340 222 -318 L296 -196 Q340 -150 320 -60 Z" fill="#101116" stroke="#000" strokeWidth={5} />
    <path d="M-214 -196 L-164 -306 Q-156 -318 -140 -318 H140 Q156 -318 164 -306 L214 -196 Z" fill={win ? '#1d2228' : '#262c34'} stroke="#000" strokeWidth={4} />
    <path d="M-150 -206 L-110 -300 L-60 -300 L-110 -206 Z" fill="rgba(200,220,240,.13)" />
    <rect x={-320} y={-196} width={640} height={8} fill="#2c2f38" />
    <rect x={-296} y={-110} width={592} height={40} rx={8} fill="#08090c" stroke="#3b3e47" strokeWidth={3} />
    {back
      ? <>{[-250, 250].map(q => <g key={q}><rect x={q - 42} y={-168} width={84} height={34} rx={6} fill={lights ? '#ff3b30' : '#6c1c1a'} />{lights && <ellipse cx={q} cy={-151} rx={110} ry={50} fill="rgba(255,50,40,.35)" />}</g>)}</>
      : <>{[-250, 250].map(q => <g key={q}><ellipse cx={q} cy={-152} rx={44} ry={26} fill={lights ? '#fff6d6' : '#90969f'} /></g>)}<rect x={-58} y={-178} width={116} height={60} rx={6} fill="#20222a" stroke="#8f939c" strokeWidth={4} /></>}
    {!back && <><circle cy={-205} r={15} fill="none" stroke="#c9ccd3" strokeWidth={4} /><path d="M0 -220 V-205 M0 -205 L-12 -197 M0 -205 L12 -197" stroke="#c9ccd3" strokeWidth={3} /></>}
    <rect x={-320} y={-60} width={110} height={60} rx={10} fill="#050507" />
    <rect x={210} y={-60} width={110} height={60} rx={10} fill="#050507" />
  </svg>
);

/** From the alley, looking in: the stall as a dark mouth behind parted bamboo, the block low in the middle */
const Front: React.FC<{p: ShotProps; time: Time}> = ({p, time}) => {
  const r = makeRoom({x: 1000, y: 400}, {x0: 620, x1: 1380, y0: 240, y1: 660}, 3.3);
  const b = r.P(0.5, 0.25, 0.3);
  return (
    <>
      <div style={{position: 'absolute', left: -700, top: -500, width: 3300, height: 2000, background: '#3a362f'}} />
      <RoomShell r={r} id="stall-front" wall="#332d27" side="#27221d" floorC="#3a342d" ceiling="#120f0d" floor="plain" walls="plain" />
      <Hooks r={r} shirt={false} />
      <RBox r={r} u={[0.68, 0.94]} v={[0.16, 1]} w={[0.01, 0.16]} front="#4c5558" side="#30373a" top="#5f6a6e" />
      <Block r={r} u={0.5} w={0.62} />
      <LightVeil id="stall-front" lights={[[b.x, b.y + 200, 380]]} o={0.55} color="#0a0406" />
      <HangBulb x={b.x} y={b.y} top={-120} r={18} />
      <Pool x={b.x} y={b.y + 210} rx={430} ry={330} color="255,40,30" a={0.24} />
      {/* the blind drawn apart to either side, the tin edge above */}
      <Blind x={-60} w={560} y0={-30} y1={960} c="#a08552" />
      <Blind x={1460} w={560} y0={-30} y1={960} c="#a08552" />
      <div style={{position: 'absolute', left: -60, top: -60, width: 2100, height: 90, background: '#59605f', borderBottom: '6px solid #2b2e2e'}} />
      {time === 'day' && <div style={{position: 'absolute', left: -200, top: 790, width: 2400, height: 400, background: 'linear-gradient(rgba(255,235,190,.3), rgba(255,235,190,.05))'}} />}
    </>
  );
};

/** From inside, looking out through the blind: the alley bright behind whoever stands in it */
const Out: React.FC<{p: ShotProps; time: Time; benz?: boolean; bright?: number}> = ({p, time, benz = true, bright = 1}) => (
  <>
    <div style={{position: 'absolute', left: -800, top: -600, width: 3500, height: 2200, background: time === 'day' ? 'linear-gradient(#e9eee8 0%, #e8e4d2 48%, #b9b09c 62%, #8f8778 100%)' : '#0d0c14'}} />
    {/* far wall of the alley with its shutters */}
    <Svg>
      <rect x={-800} y={150} width={3500} height={520} fill="#6f675a" />
      {Array.from({length: 9}, (_, i) => <g key={i}><rect x={-300 + i * 340} y={250} width={280} height={420} fill="#57534a" stroke="#34302a" strokeWidth={5} />{Array.from({length: 12}, (_, k) => <line key={k} x1={-300 + i * 340} y1={270 + k * 34} x2={-20 + i * 340} y2={270 + k * 34} stroke="rgba(0,0,0,.2)" strokeWidth={3} />)}</g>)}
    </Svg>
    {benz && <Benz x={1370} y={800} s={1.15} window />}
    <div style={{position: 'absolute', left: -800, top: 660, width: 3500, height: 900, background: 'linear-gradient(#7d7668, #4f4a40)'}} />
    {benz && <div style={{position: 'absolute', left: 900, top: 770, width: 1100, height: 50, background: '#000', opacity: 0.45, filter: 'blur(14px)', borderRadius: '50%'}} />}
    <Svg>{Array.from({length: 7}, (_, i) => <ellipse key={i} cx={300 + i * 280} cy={760 + rnd(61, i) * 170} rx={120 + rnd(62, i) * 110} ry={14 + rnd(63, i) * 12} fill="#d9e2e4" opacity={0.42} />)}</Svg>
    <Pool x={700} y={330} rx={900} ry={520} color="255,244,214" a={0.34 * bright} />
    <div style={{position: 'absolute', left: 300, top: -200, width: 720, height: 1200, background: 'linear-gradient(100deg, rgba(255,246,216,0), rgba(255,246,216,.38), rgba(255,246,216,0))', transform: 'skewX(-10deg)', mixBlendMode: 'screen'}} />
    {/* the blind drawn back at the frame edges, dark from in here */}
    <Blind x={-130} w={300} y0={-40} y1={1120} c="#2d2417" />
    <Blind x={1790} w={280} y0={-40} y1={1120} c="#2d2417" />
    <div style={{position: 'absolute', left: -200, top: -120, width: 2400, height: 150, background: '#110d0b'}} />
  </>
);

/** Morning market next door: tarp, stacked crates, yellow bulbs, greens */
const Market: React.FC<{p: ShotProps; shut?: boolean; tape?: boolean}> = ({p, tape}) => {
  const r = makeRoom({x: 1120, y: 410}, {x0: 780, x1: 1460, y0: 230, y1: 650}, 3.3);
  return (
    <>
      <RoomShell r={r} id="market" wall="#6c7b69" side="#5a6455" sideFar="#6e6a56" floorC="#55514a" ceiling="#334a56" floor="plain" walls="plain" />
      {/* the canvas roof, in strips */}
      <Svg>{Array.from({length: 7}, (_, i) => { const a = r.P(i / 7, 0, 0), b = r.P((i + 1) / 7, 0, 0), c = r.P((i + 1) / 7, 0, 1), d = r.P(i / 7, 0, 1); return <polygon key={i} points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`} fill={i % 2 ? '#30485a' : '#3f6073'} />; })}</Svg>
      {/* shut stalls along the back */}
      {[[0.02, 0.3], [0.33, 0.62], [0.66, 0.98]].map(([a, b], i) => <RFace key={i} r={r} pts={[[a, 0.2, 0], [b, 0.2, 0], [b, 1, 0], [a, 1, 0]]} fill={['#7f6840', '#6e7476', '#8a7145'][i]} stroke="#2a241c" />)}
      {tape && <Svg><path d="M300 560 L1700 530" stroke="#ffd400" strokeWidth={22} /><path d="M300 620 L1700 590" stroke="#ffd400" strokeWidth={22} /></Svg>}
      {/* the vegetable stall left of frame: crates and greens */}
      <RBox r={r} u={[-0.7, 0.26]} v={[0.66, 1]} w={[0.38, 0.72]} front="#6b4c2f" top="#3f7c35" side="#54391f" />
      <Svg>{Array.from({length: 60}, (_, i) => { const q = r.P(-0.65 + rnd(71, i) * 0.88, 0.66, 0.4 + rnd(72, i) * 0.3); return <ellipse key={i} cx={q.x} cy={q.y} rx={26 + rnd(73, i) * 22} ry={13 + rnd(74, i) * 9} fill={['#3f8f3b', '#58a646', '#2e7a35', '#d84f2a', '#e8b83a'][i % 5]} />; })}</Svg>
      <LightVeil id="market" lights={[[480, 420, 620], [1500, 360, 420]]} o={0.2} color="#100c10" />
      <HangBulb x={460} y={230} color="255,206,110" top={-100} r={24} />
      <HangBulb x={1480} y={210} color="255,206,110" top={-100} r={18} />
    </>
  );
};

// ---------------------------------------------------------------- macros, drawn for themselves

const BlockTop: React.FC<{p: ShotProps; empty?: boolean; incense?: boolean}> = ({p, empty, incense}) => (
  <Macro p={p} bg="#0a0606" at={[50, 45]} vig={0.8} inner={30}>
    <div style={{position: 'absolute', inset: 0, background: empty ? 'radial-gradient(ellipse at 40% 20%, #75695a, #2b241f)' : 'radial-gradient(ellipse at 50% 10%, #3a1412, #0c0605 70%)'}} />
    {!empty && <Blind x={-30} w={2000} y0={-30} y1={330} c="#3c2c18" />}
    <Svg>
      <path d="M340 560 A620 210 0 0 1 1580 560 L1580 780 A620 210 0 0 1 340 780 Z" fill="#54391f" stroke="#120a06" strokeWidth={8} />
      <ellipse cx={960} cy={560} rx={620} ry={210} fill="#a57c52" stroke="#20130a" strokeWidth={8} />
      {[0.8, 0.58, 0.34].map(k => <ellipse key={k} cx={960} cy={560} rx={620 * k} ry={210 * k} fill="none" stroke="#8a6340" strokeWidth={5} />)}
      {Array.from({length: 40}, (_, i) => { const a = rnd(31, i) * 6.28, r = Math.sqrt(rnd(32, i)); return <path key={i} d={`M${960 + Math.cos(a) * r * 560} ${560 + Math.sin(a) * r * 180} l${30 + rnd(33, i) * 90} ${rnd(34, i) * 34 - 17}`} stroke="#573a22" strokeWidth={5} />; })}
      {!empty && <g transform="translate(1040 530) rotate(14)">
        <rect x={-40} y={-360} width={70} height={250} rx={18} fill="#4b3320" stroke="#1a0f08" strokeWidth={5} />
        <path d="M-150 -120 H130 Q150 -120 150 -92 V70 Q40 34 -150 42 Z" fill="#b6bcbf" stroke="#1d2022" strokeWidth={6} />
        <path d="M-150 42 Q40 34 150 70" stroke="#eef2f3" strokeWidth={8} fill="none" />
      </g>}
      {incense && <g><rect x={1120} y={290} width={8} height={280} fill="#8c3b2a" /><circle cx={1124} cy={288} r={8} fill="#ff7a33" /><path d="M1124 280 q-20 -60 6 -120 q24 -60 -4 -130" stroke="rgba(240,240,240,.55)" strokeWidth={7} fill="none" /></g>}
    </Svg>
    {empty ? <Pool x={760} y={280} rx={1000} ry={620} color="255,235,190" a={0.45} /> : <>
      <HangBulb x={960} y={120} top={-40} r={32} />
      <Pool x={960} y={520} rx={900} ry={520} color="255,40,30" a={0.38} />
    </>}
  </Macro>
);

const PriceBoard: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#0f0806" at={[48, 44]} vig={0.72}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill="#4a4139" />
      <line x1={960} y1={-10} x2={960} y2={190} stroke="#17110c" strokeWidth={8} />
      <rect x={420} y={180} width={1080} height={620} fill="#20150c" stroke="#0a0603" strokeWidth={16} />
    </Svg>
    <div style={{position: 'absolute', left: 500, top: 240, fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 210, color: '#e4decd'}}>180.-</div>
    <div style={{position: 'absolute', left: 620, top: 500, fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 130, color: '#ffbf52', opacity: 0.95, transform: 'rotate(-3deg)'}}>350/ก.</div>
    <Pool x={1500} y={300} rx={800} color="255,50,35" a={0.42} />
    <div style={{position: 'absolute', left: -20, top: -20, width: 700, height: 1120, background: 'linear-gradient(90deg, rgba(4,2,2,.8), rgba(4,2,2,0))'}} />
  </Macro>
);

/** The white shoes on wet concrete, from the ground */
const ShoesLow: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#c8c8bc" at={[40, 30]} vig={0.42} z={1.03} oy={640}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#efeee2 0%, #d8d4c2 42%, #7b7669 56%, #4a463e 100%)'}} />
    <Svg>
      {/* the car's flank and open door, black above */}
      <path d="M1040 -10 H1940 V600 H1100 Q1040 600 1040 540 Z" fill="#0c0d11" />
      <path d="M1040 -10 L1040 540 L860 500 L860 -10 Z" fill="#17181f" stroke="#050506" strokeWidth={6} />
      <rect x={1120} y={530} width={260} height={18} fill="#3a3d46" />
      <ellipse cx={560} cy={850} rx={460} ry={46} fill="#b4c3c8" opacity={0.65} />
      {/* driver's black trouser leg by the door */}
      <rect x={880} y={-10} width={120} height={700} fill="#0a0a0d" />
      <path d="M872 680 H1060 Q1072 730 1020 736 H872 Z" fill="#050506" />
      {/* lace hem and the leg */}
      <rect x={470} y={560} width={70} height={230} fill={C.skinP} />
      <path d="M340 -10 H680 L720 590 Q700 620 660 596 Q630 630 590 596 Q560 630 520 596 Q480 630 450 596 Q410 620 380 590 Z" fill={C.lace} stroke={C.laceD} strokeWidth={5} />
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${370 + i * 24} ${560 - (i % 2) * 24} q12 18 24 0`} stroke={C.laceD} strokeWidth={4} fill="none" />)}
      <path d="M420 780 L560 780 Q640 790 690 836 Q700 860 660 862 L430 862 Q406 830 420 780 Z" fill="#fbfaf4" stroke="#b9b5a6" strokeWidth={5} />
      <rect x={424} y={862} width={70} height={16} fill="#d8d3c5" />
      {/* the shoe's reflection in the wet */}
      <path d="M430 880 L660 880 Q640 960 560 980 L470 980 Q430 950 430 880 Z" fill="#f3f2ea" opacity={0.3} />
    </Svg>
  </Macro>
);

const CardHands: React.FC<{p: ShotProps; police?: boolean}> = ({p, police}) => (
  <Macro p={p} bg="#17120d" at={[50, 40]} vig={0.66}>
    <div style={{position: 'absolute', inset: 0, background: police ? '#1d1a18' : 'radial-gradient(ellipse at 45% 30%, #6c6456, #17120d 72%)', filter: 'blur(10px)'}} />
    <Hand x={1540} y={300} s={2.1} rot={180} skin={C.skinP} sleeve={C.lace} mode="grip" />
    <div style={{position: 'absolute', left: 740, top: 250, width: 660, height: 380, background: 'linear-gradient(135deg, #f7f0dc, #dfd2b1)', borderRadius: 10, transform: 'rotate(-5deg)', boxShadow: '0 20px 50px rgba(0,0,0,.6)'}}>
      <Lotus x={140} y={190} r={110} emboss />
      <div style={{position: 'absolute', left: 280, top: 110, fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 48, color: '#2e271b'}}>คุณหญิงพรรณี</div>
      <div style={{position: 'absolute', left: 280, top: 180, fontFamily: '"Plex Thai", sans-serif', fontSize: 34, color: '#6a5f49'}}>บัวทองทรัพย์</div>
    </div>
    <Hand x={480} y={690} s={2.1} rot={-22} skin={C.skinT} sleeve={C.dayShirt} mode="open" />
    <Pool x={1000} y={330} rx={560} color="255,240,200" a={0.45} />
    <div style={{position: 'absolute', left: 840, top: 280, width: 8, height: 8, boxShadow: '0 0 40px 18px rgba(255,240,180,.9)', borderRadius: '50%'}} />
  </Macro>
);

/** Her left ear from the side: the one flaw. `shake` = the mirror at the reveal, fingers feeling for the line, pin slipping */
export const EarEcu: React.FC<{p: ShotProps; shake?: boolean; dark?: boolean}> = ({p, shake, dark}) => (
  <Macro p={p} bg="#0e0a08" at={[52, 42]} vig={dark ? 0.86 : 0.55} inner={dark ? 30 : 44} z={1.05}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1120} fill={C.skinP} />
      <path d="M-20 -20 H1940 V260 Q1400 200 1240 340 Q1120 450 1160 640 Q1180 760 1060 1100 H-20 Z" fill={C.skinPD} opacity={0.08} />
      {/* hair swept up, black, behind the ear */}
      <path d="M1020 -20 H1940 V1100 H1240 Q1320 640 1180 330 Q1120 180 1020 -20 Z" fill="#17131a" />
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M${1120 + i * 62} -20 Q${1380 + i * 40} 360 ${1320 + i * 44} 1100`} stroke="#2a2430" strokeWidth={7} fill="none" />)}
      {/* the ear */}
      <path d="M980 260 Q1160 200 1210 380 Q1236 520 1150 640 Q1090 730 1040 800 Q990 820 980 760 Q990 690 1010 640 Q920 560 920 430 Q924 300 980 260 Z" fill={C.skinP} stroke={C.skinPD} strokeWidth={8} />
      <path d="M990 330 Q1110 290 1140 410 Q1156 510 1090 600 Q1050 640 1040 690" stroke={C.skinPD} strokeWidth={10} fill="none" />
      <path d="M1000 420 Q1060 400 1076 460 Q1080 520 1040 560" stroke={C.skinPD} strokeWidth={8} fill="none" />
      {/* THE LINE, pale, running behind the ear */}
      <path d="M1218 300 Q1252 480 1176 690 Q1140 770 1090 830" stroke="#fff4e4" strokeWidth={9} fill="none" />
      <path d="M1218 300 Q1252 480 1176 690 Q1140 770 1090 830" stroke="#caa488" strokeWidth={3} fill="none" transform="translate(9 3)" />
      {/* the gold pin */}
      <g transform={shake ? 'rotate(32 1300 200)' : undefined}>
        <path d="M1560 40 L1090 210" stroke={C.gold} strokeWidth={15} strokeLinecap="round" />
        <circle cx={1580} cy={32} r={34} fill={C.gold} stroke="#7a5d18" strokeWidth={6} />
      </g>
      {shake && <path d="M1250 200 Q1190 420 1270 640 Q1300 760 1250 960" stroke="#17131a" strokeWidth={40} fill="none" strokeLinecap="round" />}
    </Svg>
    <Hand x={shake ? 1490 : 1650} y={shake ? 640 : 760} s={2.1} rot={shake ? 205 + Math.sin(p.f / 1.5) * 1.6 : 215} skin={C.skinP} mode="open" />
    <Pool x={dark ? 800 : 700} y={300} rx={900} color={dark ? '255,250,240' : '255,244,214'} a={0.3} />
  </Macro>
);

/** Thyme's hands fist the policeman's card and the red book together, or the wheel tracks under a torch, etc. */
const TracksIns: React.FC<{p: ShotProps; second?: boolean}> = ({p, second}) => (
  <Macro p={p} bg="#050505" at={[46, 56]} vig={0.94} inner={22} z={1.04}>
    <div style={{position: 'absolute', inset: 0, background: '#3b3a37'}} />
    <Svg>
      {Array.from({length: 200}, (_, i) => <circle key={i} cx={rnd(81, i) * 1920} cy={rnd(82, i) * 1080} r={1 + rnd(83, i) * 5} fill={i % 2 ? '#2a2927' : '#4d4c48'} />)}
      {[0, 1].map(k => (
        <g key={k}>
          <path d={`M${k ? 1120 : 520} 1100 L${k ? 980 : 830} 200`} stroke="#22211f" strokeWidth={70} />
          <path d={`M${k ? 1120 : 520} 1100 L${k ? 980 : 830} 200`} stroke="#6a6862" strokeWidth={70} strokeDasharray="10 20" opacity={0.8} />
        </g>
      ))}
      {/* the cabinet's foot, the tracks going under */}
      <rect x={-20} y={-20} width={1960} height={230} fill="#40474a" />
      <rect x={-20} y={190} width={1960} height={22} fill="#15181a" />
      {[420, 1420].map(x => <g key={x}><rect x={x} y={205} width={100} height={30} fill="#0c0d0e" /><circle cx={x + 50} cy={246} r={26} fill="#1d1f20" stroke="#6d7375" strokeWidth={6} /></g>)}
    </Svg>
    <Pool x={880} y={620} rx={880} ry={560} color="255,250,235" a={0.3} />
  </Macro>
);

/** Macro of a low iron door by phone light */
const IronDoor: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#050506" at={[56, 48]} vig={0.92} inner={22}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1120} fill="#26211d" />
      <rect x={480} y={120} width={960} height={980} fill="#23292c" stroke="#0a0c0d" strokeWidth={22} />
      {Array.from({length: 6}, (_, i) => <circle key={i} cx={520} cy={170 + i * 170} r={10} fill="#4d5558" />)}
      {Array.from({length: 6}, (_, i) => <circle key={i} cx={1400} cy={170 + i * 170} r={10} fill="#4d5558" />)}
      <rect x={1000} y={470} width={240} height={36} fill="#505a5e" />
      <path d="M1130 500 v40 a56 56 0 1 0 0.1 0" stroke="#80868a" strokeWidth={18} fill="none" />
      <rect x={1060} y={590} width={140} height={120} rx={14} fill="#b28a3a" stroke="#5d4516" strokeWidth={6} />
      <rect x={1118} y={636} width={22} height={40} rx={8} fill="#2a2010" />
      {Array.from({length: 22}, (_, i) => <path key={i} d={`M${500 + i * 42} 124 q6 ${30 + rnd(91, i) * 60} 0 ${90 + rnd(92, i) * 100}`} stroke="rgba(190,220,235,.75)" strokeWidth={6} fill="none" strokeLinecap="round" />)}
    </Svg>
    <FloorMist y={1040} f={p.f} a={0.3} />
    <Hand x={560} y={830} s={2} rot={-30} skin={C.skinT} sleeve={C.dayShirt} mode="open" />
    <Pool x={1090} y={640} rx={560} color="225,235,255" a={0.4} />
  </Macro>
);

const Unlock: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#040405" at={[54, 44]} vig={0.92} inner={20} z={1.06}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1120} fill="#1d1f21" />
      <path d="M1040 180 a170 170 0 0 0 -340 0 V400" stroke="#8a9094" strokeWidth={50} fill="none" />
      <path d="M1040 180 V400" stroke="#8a9094" strokeWidth={50} />
      <rect x={610} y={380} width={520} height={460} rx={40} fill="#b4893a" stroke="#5d4516" strokeWidth={10} />
      <circle cx={870} cy={560} r={46} fill="#1c1408" />
      <rect x={852} y={560} width={36} height={110} fill="#1c1408" />
      <rect x={868} y={530} width={520} height={46} rx={10} fill="#d8b75c" stroke="#6b5219" strokeWidth={6} />
      <path d="M1388 553 a60 60 0 1 0 120 0 a60 60 0 1 0 -120 0" fill="none" stroke="#d8b75c" strokeWidth={26} />
      <ellipse cx={1120} cy={380} rx={16} ry={26} fill="rgba(210,235,250,.9)" />
    </Svg>
    <Hand x={1500} y={610} s={2.1} rot={205 + Math.sin(p.f / 1.4) * 1.2} skin={C.skinT} mode="grip" />
    <Pool x={960} y={500} rx={640} color="225,235,255" a={0.3} />
  </Macro>
);

const CardBook: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#0a0605" at={[50, 42]} vig={0.8} inner={30}>
    <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#1b1311" /></Svg>
    <div style={{position: 'absolute', left: 520, top: 170, width: 840, height: 620, background: C.book, borderRadius: 14, border: `10px solid ${C.bookD}`, boxShadow: '0 30px 70px rgba(0,0,0,.7)', transform: 'rotate(-4deg)'}} />
    <div style={{position: 'absolute', left: 640, top: 340, width: 560, height: 260, background: '#e9e6da', transform: 'rotate(4deg) skewX(-6deg)', boxShadow: '0 10px 30px rgba(0,0,0,.5)'}}>
      <div style={{position: 'absolute', left: 40, top: 30, fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 40, color: '#2a2a33'}}>ร.ต.ท. ...</div>
      <div style={{position: 'absolute', left: 40, top: 96, fontFamily: '"Plex Thai", sans-serif', fontSize: 30, color: '#555'}}>พนักงานสอบสวน</div>
    </div>
    <Hand x={560} y={640} s={2.6} rot={-14} skin={C.skinT} mode="grip" />
    <Pool x={1000} y={330} rx={700} color="255,60,44" a={0.3} />
  </Macro>
);

const RadioIns: React.FC<{p: ShotProps; open?: boolean}> = ({p, open}) => (
  <Macro p={p} bg="#17120c" at={[46, 40]} vig={0.55}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#8d8a7c, #4a453b)', filter: 'blur(14px)'}} />
    {open && <Svg><path d="M-20 300 L1940 240" stroke="#ffd400" strokeWidth={40} style={{filter: 'blur(6px)'}} /><path d="M-20 380 L1940 320" stroke="#ffd400" strokeWidth={40} style={{filter: 'blur(6px)'}} /></Svg>}
    <Svg>
      <rect x={-20} y={720} width={1960} height={400} fill="#6b4c2f" />
      {[760, 860, 960].map(y => <line key={y} x1={-20} y1={y} x2={1940} y2={y} stroke="#3e2b1a" strokeWidth={8} />)}
      <line x1={1040} y1={340} x2={1240} y2={40} stroke="#b7bcc0" strokeWidth={11} />
      <rect x={420} y={330} width={880} height={430} rx={34} fill="#3e3a33" stroke="#17140f" strokeWidth={10} />
      <rect x={470} y={380} width={430} height={330} rx={16} fill="#272420" />
      {Array.from({length: 11}, (_, i) => <line key={i} x1={490} y1={400 + i * 28} x2={880} y2={400 + i * 28} stroke="#141210" strokeWidth={8} />)}
      <rect x={950} y={390} width={300} height={120} fill="#f2c168" stroke="#1a1712" strokeWidth={6} />
      {Array.from({length: 9}, (_, i) => <line key={i} x1={975 + i * 30} y1={400} x2={975 + i * 30} y2={430} stroke="#5d4516" strokeWidth={3} />)}
      <line x1={1140} y1={395} x2={1140} y2={505} stroke="#c22a18" strokeWidth={6} />
      <circle cx={1020} cy={620} r={64} fill="#6b6459" stroke="#1a1712" strokeWidth={6} />
      <circle cx={1190} cy={620} r={44} fill="#6b6459" stroke="#1a1712" strokeWidth={6} />
    </Svg>
    <Pool x={1100} y={450} rx={300} color="255,170,70" a={0.5} />
    <Hand x={1680} y={830} s={1.8} rot={195} skin="#c9916d" mode="open" />
  </Macro>
);

/** A low view of the alley floor with the concrete near and the stall soft beyond: the empty last image */
const EmptyLow: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#b9b4a4" at={[40, 30]} vig={0.4} inner={50} z={1.03} oy={700}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#eae6d6 0%, #cfc9b6 44%, #5f5a4f 56%, #8a8474 100%)', filter: 'blur(1px)'}} />
    <div style={{position: 'absolute', left: 540, top: 90, width: 840, height: 500, filter: 'blur(9px)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 840, height: 500, background: '#2a2622'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 840, height: 40, background: '#8a7145'}} />
      <div style={{position: 'absolute', left: 310, top: 340, width: 220, height: 80, borderRadius: '50%', background: '#a67d55'}} />
      {[340, 480].map(x => <div key={x} style={{position: 'absolute', left: x, top: 400, width: 22, height: 100, background: '#3a2a1c'}} />)}
    </div>
    <Svg>
      <path d="M-20 1100 L-20 620 L1940 620 L1940 1100 Z" fill="#7d7768" />
      {[0, 1].map(k => <path key={k} d={`M${k ? 1300 : 620} 1100 L${k ? 1010 : 910} 620`} stroke="#5e594e" strokeWidth={46} opacity={0.55} />)}
      {Array.from({length: 120}, (_, i) => <circle key={i} cx={rnd(95, i) * 1920} cy={620 + rnd(96, i) * 470} r={1 + rnd(97, i) * 4} fill="#615c50" />)}
    </Svg>
    <Pool x={700} y={300} rx={1000} ry={500} color="255,244,214" a={0.4} />
  </Macro>
);

// ---------------------------------------------------------------- shots with people

const SETS: Record<string, React.FC<{p: ShotProps; time: Time}>> = {
  in: ({p, time}) => <In p={p} time={time} shirt={D(p).shirt !== false} tall={!!D(p).tall} pushed={!!D(p).pushed} />,
  front: Front,
  out: ({p, time}) => <Out p={p} time={time} benz={D(p).benz !== false} />,
  alley: ({p, time}) => <Alley p={p} time={time} benz={D(p).benz === 'near' ? 'near' : 'none'} />,
  market: ({p}) => <Market p={p} tape={!!D(p).tape} />,
};

const StallScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  const time = timeOf(p);
  // macros
  if (v === 'block-ins') return <BlockTop p={p} />;
  if (v === 'block-close') return <BlockTop p={p} empty incense />;
  if (v === 'price-ins') return <PriceBoard p={p} />;
  if (v === 'door-low') return <ShoesLow p={p} />;
  if (v === 'card-ins') return <CardHands p={p} />;
  if (v === 'ear-ecu') return <EarEcu p={p} />;
  if (v === 'tracks-ins') return <TracksIns p={p} />;
  if (v === 'door-close') return <IronDoor p={p} />;
  if (v === 'unlock-ecu') return <Unlock p={p} />;
  if (v === 'thyme-card-ecu') return <CardBook p={p} />;
  if (v === 'radio-ins2') return <RadioIns p={p} open />;
  if (v === 'empty-low') return <EmptyLow p={p} />;
  if (v === 'phannee-ecu') return (
    <Macro p={p} bg="#0f0a08" at={[48, 40]} vig={0.6} z={1.06}>
      <BigMouth skin={C.skinP} skinD={C.skinPD} lip="#c9838a" smile={1} teeth open={0.08} />
      <div style={{position: 'absolute', left: 900, top: -20, width: 1040, height: 1120, background: 'linear-gradient(270deg, rgba(10,6,4,.72), rgba(10,6,4,0))'}} />
    </Macro>
  );
  if (v === 'thyme-eye-ecu') return (
    <Macro p={p} bg="#0a0505" at={[46, 42]} vig={0.86} inner={30} z={1.05}>
      <BigEye skin={C.skinT} skinD={C.skinTD} lid={0.34} look={-0.42} browTilt={-24} glint={<circle cx={-20} cy={-30} r={26} fill="#ff3a2c" />} />
      <div style={{position: 'absolute', left: 900, top: -20, width: 1040, height: 1120, background: 'linear-gradient(270deg, rgba(6,2,2,.86), rgba(6,2,2,0))'}} />
      <Pool x={500} y={360} rx={800} color="255,50,36" a={0.42} />
    </Macro>
  );
  if (v === 'thyme-shock-ecu') return (
    <Macro p={p} bg="#39393a" at={[50, 44]} vig={0.7} inner={36} z={1.08}>
      <div style={{filter: 'saturate(.38)', position: 'absolute', inset: 0}}><BigEye skin={C.skinT} skinD={C.skinTD} lid={0.02} look={0} glint={<circle cx={-30} cy={-40} r={18} fill="#fff" />} /></div>
      <div style={{position: 'absolute', left: -20, top: -20, width: 720, height: 1120, background: 'linear-gradient(90deg, rgba(10,10,12,.7), rgba(10,10,12,0))'}} />
    </Macro>
  );
  if (v === 'block-low' || v === 'block-low2') return <BlockLow p={p} tracks={v === 'block-low2'} />;
  if (v === 'cabinet-push-low') return <CabinetPush p={p} />;
  if (v === 'meter-low') return <Meter p={p} />;
  if (v === 'door-open-low') return <RampMouth p={p} />;
  if (v === 'benz-wide') return <BenzWide p={p} />;
  if (v === 'benz-past-fif') return <BenzPast p={p} />;
  if (v === 'father-chair-sil') return <FatherChairSil p={p} />;
  if (v === 'thyme-alone-sil') return <AloneSil p={p} />;
  const Set = SETS[d.set ?? 'in'] ?? SETS.in;
  const ppc = d.ppc ?? PX_CM;
  return <Shot p={p} world={<>
    <Soft p={p}><Set p={p} time={time} /></Soft>
    {d.slats && <SunSlats x={d.slats[0]} y={d.slats[1]} w={d.slats[2]} h={d.slats[3]} />}
    {d.lowBlock && <Pool x={d.lowBlock[0]} y={d.lowBlock[1]} rx={620} color="255,250,235" a={0.95} />}
    <Actors p={p} pxPerCm={ppc} floor={d.floor ?? 930} />
    {d.benzFront && <Benz x={d.benzFront[0]} y={d.benzFront[1]} s={d.benzFront[2]} lights={time !== 'day'} back={!!d.benzBack} />}
    {d.shirtHeld && <HeldShirt x={d.shirtHeld[0]} y={d.shirtHeld[1]} s={d.shirtHeld[2] ?? 1} />}
    {d.prop === 'card' && <SmallCard x={d.propAt[0]} y={d.propAt[1]} s={d.propAt[2] ?? 1} />}
    {d.mist && <FloorMist y={d.mist} f={p.f} a={0.3} />}
    {d.lowBlock && <Svg><ellipse cx={960} cy={1180} rx={960} ry={250} fill="#6f4f33" stroke="#1c120a" strokeWidth={8} /></Svg>}
  </>} fore={d.fore === 'ots' ? <Shoulder side={d.foreSide ?? 'l'} color={d.foreColor ?? '#e8e2d2'} head={d.foreHead} /> : d.fore === 'pig' ? <PigFore /> : undefined} foreBlur={d.foreBlur ?? 11} foreDark={d.foreDark ?? 0.72} />;
};

const SunSlats: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
  <Svg>{Array.from({length: 9}, (_, i) => <rect key={i} x={x} y={y + (i * h) / 9} width={w} height={h / 22} fill="#ffe6ae" opacity={0.42} style={{mixBlendMode: 'screen'}} />)}</Svg>
);

const HeldShirt: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <svg width={260 * s} height={200 * s} viewBox="-130 -100 260 200" style={{position: 'absolute', left: x - 130 * s, top: y - 100 * s, overflow: 'visible', zIndex: 18}}>
    <path d="M-120 -56 Q-40 -96 0 -66 Q50 -96 120 -50 Q110 40 76 80 Q0 100 -80 76 Q-120 30 -120 -56 Z" fill={C.tee} stroke="#857c6a" strokeWidth={4} />
    <path d="M-70 -30 Q-20 10 60 -24 M-80 30 Q0 60 80 24" stroke="#a79f8c" strokeWidth={5} fill="none" />
  </svg>
);

const SmallCard: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <div style={{position: 'absolute', left: x - 50 * s, top: y - 30 * s, width: 100 * s, height: 60 * s, background: '#efe8d4', border: '2px solid #a59b80', transform: 'rotate(-8deg)', zIndex: 18}}>
    <div style={{position: 'absolute', left: 8 * s, top: 8 * s, width: 40 * s, height: 6 * s, background: '#333'}} />
    <div style={{position: 'absolute', left: 8 * s, top: 22 * s, width: 66 * s, height: 4 * s, background: '#777'}} />
  </div>
);

const Shoulder: React.FC<{side: 'l' | 'r'; color: string; head?: string}> = ({side, color, head = '#0d0b0e'}) => (
  <div style={{position: 'absolute', [side]: -240, top: 300, width: 900, height: 950, borderRadius: '46% 46% 0 0', background: color} as React.CSSProperties}>
    <div style={{position: 'absolute', left: side === 'l' ? 300 : 240, top: -310, width: 360, height: 400, borderRadius: '50%', background: head}} />
  </div>
);

const PigFore: React.FC = () => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {[[-40, 1], [1960, -1]].map(([x, k], j) => <g key={j} transform={`translate(${x} 0) scale(${k} 1)`}>
        <path d="M-160 60 Q300 40 400 300 Q470 560 340 840 Q240 1040 -160 1120 Z" fill={j ? '#c67e6f' : '#d18d7c'} />
        <path d="M-120 110 Q240 100 330 310 Q390 560 280 800 Q200 960 -120 1040 Z" fill="#b65f58" />
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M-120 ${220 + i * 92} Q160 ${200 + i * 92} 300 ${270 + i * 74}`} stroke="#ecc5b4" strokeWidth={24} fill="none" />)}
        <path d="M120 60 V-30 M120 60 q-34 -6 -30 -40" stroke="#70777a" strokeWidth={16} fill="none" />
      </g>)}
    </svg>
    <div style={{position: 'absolute', left: 0, top: -30, width: 1920, height: 80, background: '#111'}} />
  </>
);

// ---------------------------------------------------------------- shots built whole

/** From the floor beside the block: its sawn legs huge, a butcher's knees for scale. mirror: the wheel tracks */
const BlockLow: React.FC<{p: ShotProps; tracks?: boolean}> = ({p, tracks}) => (
  <Macro p={p} bg="#0a0505" at={[52, 42]} vig={0.78} inner={36} z={1.03}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 10%, #4a1d19, #150b09 70%)'}} />
    <Svg>
      <rect x={-20} y={760} width={1960} height={340} fill="#35312c" />
      <path d="M-20 760 H1940" stroke="#1a1714" strokeWidth={8} />
      {/* top slab of the block, right above the frame's middle */}
      <path d="M360 300 H1560 Q1620 300 1620 350 V430 H300 V350 Q300 300 360 300 Z" fill="#6a4a2e" stroke="#180f08" strokeWidth={8} />
      <rect x={300} y={286} width={1320} height={30} fill="#a57c52" />
      {/* four legs, the saw marks fresh and pale at the cut */}
      {[430, 780, 1100, 1450].map((x, i) => <g key={x}>
        <rect x={x} y={430} width={80} height={320 - i % 2 * 26} fill="#44301f" stroke="#150e08" strokeWidth={5} />
        <rect x={x - 3} y={738 - i % 2 * 26} width={86} height={24} fill="#d9c49d" />
        {Array.from({length: 5}, (_, k) => <line key={k} x1={x + 6 + k * 15} y1={740 - i % 2 * 26} x2={x + 14 + k * 15} y2={760 - i % 2 * 26} stroke="#9a835c" strokeWidth={2.5} />)}
      </g>)}
      {/* Thyme's trouser leg beside it, knee at the slab */}
      {!tracks && <><rect x={1640} y={40} width={210} height={730} fill={C.dayPants} /><path d="M1628 770 H1870 Q1890 820 1830 826 H1628 Z" fill="#111" /></>}
      {tracks && [760, 1110].map((x, i) => <g key={x}>
        <path d={`M${x + (i ? 70 : -70)} 1100 L${x} 790`} stroke="#6d675d" strokeWidth={64} />
        <path d={`M${x + (i ? 70 : -70)} 1100 L${x} 790`} stroke="#23201c" strokeWidth={64} strokeDasharray="8 16" />
      </g>)}
    </Svg>
    <Pool x={960} y={140} rx={900} ry={420} color="255,44,30" a={0.48} />
    <HangBulb x={960} y={64} top={-30} r={26} />
  </Macro>
);

const CabinetPush: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p), dx = 90 * k;
  return (
    <Macro p={p} bg="#030303" at={[58, 54]} vig={0.86} inner={26} z={1.03}>
      <Svg>
        <rect x={-20} y={-20} width={1960} height={1120} fill="#121415" />
        <rect x={-20} y={850} width={1960} height={260} fill="#2a2926" />
        {/* behind the cabinet, the dark it was hiding */}
        <rect x={1120} y={-20} width={820} height={870} fill="#040404" />
        <g transform={`translate(${-dx} 0)`}>
          <rect x={420} y={-40} width={900} height={850} fill="#606b6f" stroke="#1d2224" strokeWidth={8} />
          <line x1={870} y1={-40} x2={870} y2={810} stroke="#2a2f31" strokeWidth={8} />
          <rect x={880} y={330} width={18} height={80} rx={4} fill="#d0d6d7" />
          <rect x={420} y={810} width={900} height={22} fill="#272c2e" />
          {[500, 1200].map(x => <g key={x}><rect x={x} y={830} width={70} height={16} fill="#111" /><circle cx={x + 35} cy={870} r={26} fill="#1a1c1d" stroke="#70777a" strokeWidth={6} /></g>)}
        </g>
        <path d="M480 900 L1400 900" stroke="#3d3b36" strokeWidth={22} />
      </Svg>
      <Hand x={220} y={430} s={2.3} rot={0} skin={C.skinT} sleeve={C.dayShirt} mode="open" />
      <Hand x={190} y={700} s={2.3} rot={6} skin={C.skinT} sleeve={C.dayShirt} mode="open" />
      <Pool x={560} y={520} rx={720} color="225,235,255" a={0.3} />
      <div style={{position: 'absolute', left: 1120 - dx, top: 700, width: 800, height: 170, background: 'linear-gradient(90deg, rgba(205,225,240,.3), rgba(205,225,240,0))', filter: 'blur(20px)'}} />
    </Macro>
  );
};

const Meter: React.FC<{p: ShotProps}> = ({p}) => {
  const a = (p.f * 12) % 360;
  return (
    <Macro p={p} bg="#040405" at={[52, 36]} vig={0.92} inner={22} z={1.03}>
      <Svg>
        <rect x={-20} y={-20} width={1960} height={1120} fill="#1e1c1b" />
        <rect x={720} y={-20} width={280} height={1120} fill="#3b3935" />
        <rect x={700} y={140} width={320} height={380} rx={20} fill="#c4c8c6" stroke="#26282a" strokeWidth={10} />
        <circle cx={860} cy={300} r={120} fill="#eef0ec" stroke="#26282a" strokeWidth={6} />
        <rect x={780} y={230} width={160} height={40} fill="#111" />
        <text x={860} y={262} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={34} fill="#f4f4ee">11024</text>
        <g transform={`translate(860 340) rotate(${a})`}><rect x={-80} y={-6} width={160} height={12} fill="#b31b1b" /></g>
        {/* the fat cable, strapped, running along the wall and under the blind */}
        <path d="M860 520 V770 Q860 860 960 860 H1990" stroke="#090909" strokeWidth={46} fill="none" />
        {[1120, 1440, 1760].map(x => <rect key={x} x={x - 24} y={830} width={48} height={60} fill="#6d7072" />)}
        <path d="M860 520 V770 Q860 860 960 860 H1990" stroke="#2c2c2c" strokeWidth={8} fill="none" transform="translate(0 -13)" />
        <rect x={1620} y={-20} width={320} height={880} fill="#2d2417" />
        {Array.from({length: 24}, (_, i) => <line key={i} x1={1620} y1={i * 36} x2={1940} y2={i * 36} stroke="#15110b" strokeWidth={4} />)}
        <rect x={-20} y={890} width={1960} height={210} fill="#2e2c29" />
      </Svg>
      <Pool x={860} y={320} rx={520} color="225,235,255" a={0.38} />
    </Macro>
  );
};

/** From inside the ramp looking back up: his black figure in the door, the red bulb behind, mist flowing past us */
const RampMouth: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#020203" at={[50, 34]} vig={0.9} inner={24} z={1.04} oy={420}>
    <Svg>
      <path d="M-20 1100 L620 500 L1300 500 L1940 1100 Z" fill="#26262a" />
      <path d="M-20 -20 L620 180 L1300 180 L1940 -20 Z" fill="#0c0c0e" />
      <path d="M-20 -20 L620 180 L620 500 L-20 1100 Z" fill="#141416" />
      <path d="M1940 -20 L1300 180 L1300 500 L1940 1100 Z" fill="#101012" />
      <rect x={620} y={180} width={680} height={320} fill="#671710" />
      <rect x={620} y={180} width={680} height={320} fill="none" stroke="#000" strokeWidth={8} />
      {[0, 1].map(k => <path key={k} d={`M${k ? 1450 : 480} 1100 L${k ? 1010 : 910} 500`} stroke="#121214" strokeWidth={40} />)}
    </Svg>
    <Pool x={960} y={300} rx={640} ry={360} color="255,50,34" a={0.6} />
    <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.04)'}}><ActorView a={{...parseActor('thyme-sil@960,520'), h: 330}} roster={ROSTER} floor={520} pxPerCm={PX_CM} f={p.f} /></div>
    <FloorMist y={640} f={p.f * 3} a={0.34} h={300} />
    <FloorMist y={980} f={p.f * 4} a={0.42} h={320} seed={9} />
  </Macro>
);

/** From inside the stall, between the parted slats: the car fills the alley and its shadow comes along the floor to his feet */
const BenzWide: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Shot p={p} world={<>
      <Out p={p} time="day" benz={false} bright={1 - k * 0.3} />
      <Benz x={960} y={770} s={2.4 + k * 0.1} window />
      <div style={{position: 'absolute', left: -200, top: 790, width: 2400, height: 400, background: `linear-gradient(rgba(5,5,8,${0.7 + k * 0.2}), rgba(5,5,8,${0.2 + k * 0.5}))`}} />
      <Actors p={p} />
    </>} />
  );
};

/** Memory: the blind from inside, the same car, a lace arm holding an envelope over the block */
const BenzPast: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#121010" past at={[50, 42]} vig={0.64} z={1.03}>
    <Out p={p} time="day" benz />
    <Svg>
      <ellipse cx={560} cy={1010} rx={620} ry={150} fill="#a67d55" stroke="#20130a" strokeWidth={8} />
      <rect x={-20} y={1000} width={1200} height={100} fill="#6a4a2e" opacity={0.6} />
    </Svg>
    <Hand x={1120} y={560} s={2.2} rot={190} skin={C.skinP} sleeve={C.lace} mode="grip" />
    <div style={{position: 'absolute', left: 500, top: 510, width: 370, height: 200, background: '#efe7d2', transform: 'rotate(-4deg)', boxShadow: '0 10px 30px rgba(0,0,0,.5)'}}><Lotus x={65} y={100} r={40} /></div>
    <Hand x={250} y={640} s={2.2} rot={-10} skin="#d6a57f" sleeve={C.tee} mode="grip" />
  </Macro>
);

const FatherChairSil: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#0c0605" past={false} at={[60, 40]} vig={0.7} z={1.03}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #17100c, #2a1f18 40%, #6b5a42 75%, #e5d5ac)'}} />
    <Blind x={1000} w={1040} y0={-40} y1={1120} c="#a08552" />
    <Svg>{Array.from({length: 30}, (_, i) => <rect key={i} x={1000} y={i * 37} width={1040} height={7} fill="#fff7dc" opacity={0.9} />)}</Svg>
    <Pool x={1500} y={540} rx={900} color="255,240,200" a={0.5} />
    <Svg>
      <path d="M-20 900 H1940 V1100 H-20 Z" fill="#100b09" />
      {/* the low block, the chair and the man cut out against the light */}
      <ellipse cx={1320} cy={690} rx={300} ry={60} fill="#060404" />
      <rect x={1040} y={690} width={560} height={60} fill="#060404" />
      {[1100, 1500].map(x => <rect key={x} x={x} y={740} width={36} height={170} fill="#060404" />)}
      {/* wheel, frame */}
      <circle cx={640} cy={780} r={130} fill="none" stroke="#050404" strokeWidth={20} />
      {Array.from({length: 8}, (_, i) => <line key={i} x1={640} y1={780} x2={640 + Math.cos((i * Math.PI) / 4) * 130} y2={780 + Math.sin((i * Math.PI) / 4) * 130} stroke="#050404" strokeWidth={5} />)}
      <circle cx={880} cy={880} r={40} fill="none" stroke="#050404" strokeWidth={13} />
      <path d="M540 470 L560 660 L860 660 L880 860 M480 460 H560" stroke="#050404" strokeWidth={20} fill="none" />
      {/* a thin torso and head, one arm raised with the cleaver */}
      <path d="M570 660 Q540 460 610 330 Q650 300 700 330 Q760 460 800 660 Z" fill="#050404" />
      <circle cx={655} cy={230} r={84} fill="#050404" />
      <path d="M730 380 L930 350 L1040 480" stroke="#050404" strokeWidth={42} fill="none" strokeLinecap="round" />
      <path d="M1000 400 L1150 440 L1110 590 L980 540 Z" fill="#050404" />
      {/* a flat rug over his lap, nothing under it */}
      <path d="M560 670 H870 L880 690 H550 Z" fill="#050404" />
    </Svg>
  </Macro>
);

const AloneSil: React.FC<{p: ShotProps}> = ({p}) => (
  <Shot p={p} world={<>
    <In p={p} time="day" />
    <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><ActorView a={{...parseActor('thyme-sil@1320 back'), h: 516}} roster={ROSTER} floor={930} pxPerCm={PX_CM} f={p.f} /></div>
    <Svg><path d="M1320 930 L680 900 L720 985 L1360 950 Z" fill="#000" opacity={0.55} style={{filter: 'blur(8px)'}} /></Svg>
  </>} />
);

export const STALL: Record<string, ShotComponent> = {stall: StallScene};
export {kf, Pen, Typed};
