import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {flicker} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {Actors, C} from './cast';
import {D, K, Macro, Pool, Sheet, Shot, Soft, Svg, Typed} from './common';

// บ้านไม้ (brief.md → Sets): one room on stilts, boards running to the shrine on the back wall. Lit by whatever hour it is:
// late sun through louvres (right wall) and one incense glow; a floor lamp at night; a candle for the amulet.

const R = makeRoom({x: 780, y: 420}, {x0: 400, x1: 1360, y0: 230, y1: 670}, 3.3);
const WOOD = {wall: '#59402b', side: '#4a3423', far: '#6a4c33', floor: '#51392a', ceil: '#231810'};

const Altar: React.FC<{r: typeof R}> = ({r}) => {
  const a = r.P(0.5, 0.48, 0), s = 1;
  return (
    <>
      <RBox r={r} u={[0.36, 0.64]} v={[0.46, 0.5]} w={[0, 0.07]} front="#2f1e12" top="#6a4730" />
      <Svg>
        {/* Buddha, a small dark seated shape on a gold base; the bulb's picture on the wall above */}
        <path d={`M${a.x - 40} ${a.y - 18} Q${a.x - 46} ${a.y - 78} ${a.x} ${a.y - 88} Q${a.x + 46} ${a.y - 78} ${a.x + 40} ${a.y - 18} Z`} fill="#b89237" stroke="#5e4716" strokeWidth={3} />
        <circle cx={a.x} cy={a.y - 104} r={21} fill="#c9a24a" stroke="#5e4716" strokeWidth={3} />
        <path d={`M${a.x} ${a.y - 126} v-16`} stroke="#c9a24a" strokeWidth={5} />
        <rect x={a.x - 56} y={a.y - 20} width={112} height={20} fill="#6e4f1d" />
        <rect x={a.x + 76} y={a.y - 24} width={44} height={24} rx={4} fill="#807459" />
        {[0, 12, 24].map(d => <line key={d} x1={a.x + 86 + d} y1={a.y - 24} x2={a.x + 84 + d} y2={a.y - 62} stroke="#8c3b2a" strokeWidth={3} />)}
        <rect x={a.x - 118} y={a.y - 40} width={34} height={40} rx={4} fill="#dcd5c4" />
        <rect x={r.P(0.2, 0.2, 0).x} y={r.P(0.2, 0.2, 0).y} width={132 * s} height={160} fill="#2b2118" stroke="#120c08" strokeWidth={4} />
        <rect x={r.P(0.2, 0.2, 0).x + 12} y={r.P(0.2, 0.2, 0).y + 12} width={108} height={136} fill="#8d8671" />
        <circle cx={r.P(0.2, 0.2, 0).x + 66} cy={r.P(0.2, 0.2, 0).y + 66} r={30} fill="#c79a78" />
      </Svg>
    </>
  );
};

const Room: React.FC<{p: ShotProps; time: 'sun' | 'dusk' | 'night' | 'morning'}> = ({p, time}) => {
  const r = R;
  const lit = time !== 'night';
  const a = r.P(0.5, 0.48, 0);
  const inc: [number, number, number] = [a.x + 100, a.y - 70, 200];
  return (
    <>
      <RoomShell r={r} id={`house-${time}`} wall={WOOD.wall} side={WOOD.side} sideFar={WOOD.far} floorC={WOOD.floor} ceiling={WOOD.ceil} boards={12} />
      {/* the things of a butcher's house */}
      <RBox r={r} u={[0.74, 0.96]} v={[0.34, 1]} w={[0.02, 0.2]} front="#3c2a1b" top="#51392a" side="#2c1e13" />
      <RFace r={r} pts={[[0.77, 0.4, 0.2], [0.93, 0.4, 0.2], [0.93, 0.62, 0.2], [0.77, 0.62, 0.2]]} fill="#55432f" />
      <RBox r={r} u={[0.03, 0.2]} v={[0.82, 1]} w={[0.04, 0.26]} front="#54402c" top="#6b533a" />
      <RFace r={r} pts={[[0.82, 0.04, 0], [0.98, 0.04, 0], [0.98, 0.18, 0], [0.82, 0.18, 0]]} fill="#d9d2bf" />
      <Svg><line x1={r.P(0.5, 0, 0.35).x} y1={r.P(0.5, 0, 0.35).y} x2={r.P(0.5, 0.16, 0.35).x} y2={r.P(0.5, 0.16, 0.35).y} stroke="#111" strokeWidth={4} /><circle cx={r.P(0.5, 0.17, 0.35).x} cy={r.P(0.5, 0.17, 0.35).y} r={13} fill="#7b7468" /></Svg>
      <Altar r={r} />
      {/* louvres on the right wall */}
      {[0.2, 0.46, 0.72].map(w => <React.Fragment key={w}>
        <RFace r={r} pts={[[1, 0.2, w], [1, 0.2, w + 0.16], [1, 0.72, w + 0.16], [1, 0.72, w]]} fill={time === 'night' ? '#0b0a10' : '#e7c58c'} stroke="#201409" sw={5} />
        {Array.from({length: 7}, (_, i) => { const y = 0.24 + i * 0.07, q1 = r.P(1, y, w), q2 = r.P(1, y, w + 0.16); return <Svg key={i}><line x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} stroke="#25190d" strokeWidth={9} /></Svg>; })}
      </React.Fragment>)}
      {lit && <Svg>
        {[0.2, 0.46, 0.72].map(w => { const o = time === 'morning' ? 0.42 : 0.3, u0 = time === 'dusk' ? 0.1 : 0.34; const q = [[1, 1, w], [1, 1, w + 0.16], [u0, 1, w + 0.2], [u0, 1, w - 0.04]].map(([u, v, ww]) => r.P(u, v, ww)); return <polygon key={w} points={q.map(k => `${k.x},${k.y}`).join(' ')} fill={time === 'morning' ? '#fff3cf' : '#ffb868'} opacity={o} />; })}
      </Svg>}
      <LightVeil id={`house-${time}`} lights={time === 'night' ? [inc] : [[1500, 620, 620], inc]} o={time === 'night' ? 0.64 : time === 'dusk' ? 0.42 : 0.26} color="#0a0507" />
      <Pool x={inc[0]} y={inc[1]} rx={150} color="255,160,80" a={0.8 * flicker(p.f, 2, 0.2)} />
      <Svg><circle cx={inc[0] - 12} cy={inc[1] + 8} r={4} fill="#ff7a33" /><circle cx={inc[0]} cy={inc[1] + 8} r={4} fill="#ff7a33" /><circle cx={inc[0] + 12} cy={inc[1] + 8} r={4} fill="#ff7a33" /></Svg>
    </>
  );
};

const Album: React.FC<{p: ShotProps; second?: boolean}> = ({p, second}) => (
  <Macro p={p} bg="#1c130b" at={[60, 42]} vig={0.66}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill="#4a3424" />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 180} y1={-10} x2={i * 180 - 120} y2={1100} stroke="#2a1c10" strokeWidth={6} />)}
      <rect x={180} y={60} width={1560} height={960} fill="#1b1a24" stroke="#0c0b12" strokeWidth={12} />
      <rect x={950} y={60} width={20} height={960} fill="#060608" />
    </Svg>
    {!second && <Sheet x={420} y={140} w={1000} h={760} color="#efe7cf" rot={-1.5}>
      <div style={{position: 'absolute', left: 30, top: 30, width: 940, height: 700, background: 'linear-gradient(#b8ad96, #8d8069)', filter: 'sepia(.5)'}}>
        <div style={{position: 'absolute', left: 340, top: 60, width: 230, height: 240, borderRadius: '50%', background: '#c79a78'}} />
        <div style={{position: 'absolute', left: 330, top: 40, width: 250, height: 110, borderRadius: '110px 110px 30px 30px', background: '#2b2823'}} />
        <div style={{position: 'absolute', left: 290, top: 310, width: 330, height: 390, borderRadius: '40% 40% 0 0', background: '#efece2'}} />
        <div style={{position: 'absolute', left: 258, top: 320, width: 92, height: 90, borderRadius: '40%', background: '#b5805f', border: '3px solid #7f523c'}} />
        <div style={{position: 'absolute', left: 620, top: 320, width: 280, height: 380, background: '#6a4a2e'}} />
        <div style={{position: 'absolute', left: 0, top: 560, width: 300, height: 140, background: '#6a4a2e'}} />
      </div>
    </Sheet>}
    {second && [0, 1, 2].map(i => (
      <Sheet key={i} x={230 + i * 490} y={220 + (i % 2) * 40} w={460} h={560} color="#f5f1e5" rot={[-2, 1.4, -1][i]}>
        <div style={{position: 'absolute', left: 20, top: 20, width: 420, height: 460, background: ['#a8b6bd', '#9eaab0', '#b0b6a6'][i]}}>
          <div style={{position: 'absolute', left: 130, top: 60, width: 160, height: 170, borderRadius: '50%', background: '#c79a78'}} />
          <div style={{position: 'absolute', left: 120, top: 44, width: 180, height: 80, borderRadius: '80px 80px 20px 20px', background: '#4c463f'}} />
          <div style={{position: 'absolute', left: 90, top: 220, width: 240, height: 120, borderRadius: '40% 40% 0 0', background: C.tee}} />
          <div style={{position: 'absolute', left: 0, top: 330, width: 420, height: 130, background: i === 1 ? '#6a4a2e' : '#7d6a50'}} />
        </div>
      </Sheet>
    ))}
    {second && <Hand x={1480} y={950} s={1.6} rot={205} skin={C.skinT} mode="open" />}
    <div style={{position: 'absolute', left: -60, top: 0, width: 1500, height: 1080, background: 'linear-gradient(95deg, rgba(0,0,0,.6) 0, rgba(0,0,0,.05) 70%)'}} />
    <Pool x={1400} y={220} rx={880} color="255,226,170" a={0.3} />
  </Macro>
);

/** From the floor up at the shelf. `ins` close at the base with the hand drawing out the red book */
const AltarLow: React.FC<{p: ShotProps; ins?: boolean}> = ({p, ins}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#0a0504" at={[50, 34]} vig={0.8} inner={30} z={1.04}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#3b2919" />
        {Array.from({length: 13}, (_, i) => <line key={i} x1={i * 160} y1={-10} x2={i * 160} y2={1100} stroke="#20150c" strokeWidth={5} />)}
        <rect x={ins ? -20 : 420} y={ins ? 740 : 620} width={ins ? 1960 : 1080} height={ins ? 80 : 50} fill="#6e4b2d" stroke="#21150c" strokeWidth={5} />
        {!ins && <path d="M450 670 L420 900 L490 900 L530 670 Z" fill="#3a2717" />}
        {!ins && <path d="M1470 670 L1500 900 L1430 900 L1390 670 Z" fill="#3a2717" />}
      </Svg>
      {/* the seated figure, bigger than life from here */}
      <div style={{position: 'absolute', left: 0, top: 0, filter: ins ? 'blur(14px) brightness(.6)' : undefined}}>
        <Svg>
          <path d="M700 620 Q690 370 960 340 Q1230 370 1220 620 Z" fill="#b89237" stroke="#5e4716" strokeWidth={6} />
          <circle cx={960} cy={270} r={92} fill="#c9a24a" stroke="#5e4716" strokeWidth={6} />
          <path d="M960 178 q-12 -48 0 -70 q12 22 0 70 Z" fill="#c9a24a" />
          <path d="M925 276 q12 6 24 0 M971 276 q12 6 24 0" stroke="#5e4716" strokeWidth={5} fill="none" />
          <path d="M830 460 Q960 560 1090 460" stroke="#7e611c" strokeWidth={8} fill="none" />
        </Svg>
      </div>
      <Svg>
        <rect x={1250} y={560} width={120} height={60} rx={6} fill="#807459" stroke="#2f291c" strokeWidth={4} />
        {[1280, 1310, 1340].map(x => <line key={x} x1={x} y1={560} x2={x + 6} y2={430} stroke="#8c3b2a" strokeWidth={5} />)}
        <path d="M1310 430 q-30 -80 10 -160 q34 -80 -8 -170" stroke="rgba(235,235,235,.5)" strokeWidth={9} fill="none" />
      </Svg>
      {ins && <>
        <div style={{position: 'absolute', left: 500 + k * 210, top: 420, width: 620, height: 340, background: C.book, border: `10px solid ${C.bookD}`, borderRadius: 12, transform: 'rotate(-5deg)', boxShadow: '0 20px 50px rgba(0,0,0,.6)'}} />
        <Svg>{Array.from({length: 26}, (_, i) => <circle key={i} cx={600 + rnd(201, i) * 680} cy={760 + rnd(202, i) * 260} r={2 + rnd(203, i) * 4} fill="#d8c8a8" opacity={0.75} />)}</Svg>
        <Hand x={1320 + k * 210} y={560} s={2.1} rot={196} skin={C.skinT} mode="grip" />
      </>}
      {!ins && <Hand x={1560} y={120} s={2} rot={136} skin={C.skinT} mode="open" />}
      <Pool x={1310} y={500} rx={420} color="255,160,80" a={0.5} />
      <div style={{position: 'absolute', left: 1300, top: -40, width: 800, height: 1200, background: 'linear-gradient(270deg, rgba(255,190,110,.32), rgba(255,190,110,0) 80%)', mixBlendMode: 'screen'}} />
    </Macro>
  );
};

/** Straight down from the beam: sun in one bar on the page, the man cross-legged, the rest dark */
const FloorHigh: React.FC<{p: ShotProps; shoebox?: boolean}> = ({p, shoebox}) => (
  <Macro p={p} bg="#050302" at={[50, 50]} vig={0.92} inner={24} z={1.03}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill="#3b2919" />
      {Array.from({length: 16}, (_, i) => <line key={i} x1={i * 130} y1={-10} x2={i * 130} y2={1100} stroke="#21150c" strokeWidth={5} />)}
      {shoebox && <rect x={500} y={160} width={920} height={760} rx={30} fill="#7f7a5f" />}
      {shoebox && Array.from({length: 12}, (_, i) => <g key={i} transform={`translate(${760 + rnd(211, i) * 480} ${620 + rnd(212, i) * 240}) rotate(${rnd(213, i) * 60 - 30})`}><rect x={-70} y={-45} width={140} height={90} fill={i % 3 ? '#e8d48a' : '#ddc26f'} stroke="#857237" strokeWidth={2} /></g>)}
      {shoebox && <g transform="translate(1200 720) rotate(16)"><rect x={-130} y={-70} width={260} height={140} fill="#b7ae97" stroke="#4c4634" strokeWidth={5} /></g>}
      {/* crossed legs, shoulders, the top of a head */}
      <ellipse cx={960} cy={650} rx={330} ry={120} fill={C.dayPants} />
      <ellipse cx={960} cy={500} rx={210} ry={140} fill={C.dayShirt} />
      <path d={shoebox ? 'M780 520 Q840 640 900 700' : 'M780 520 Q790 640 880 680'} stroke={C.dayShirt} strokeWidth={66} fill="none" strokeLinecap="round" />
      <path d={shoebox ? 'M1140 520 Q1160 620 1080 700' : 'M1140 520 Q1130 640 1040 680'} stroke={C.dayShirt} strokeWidth={66} fill="none" strokeLinecap="round" />
      <circle cx={960} cy={430} r={118} fill="#16161c" />
      {!shoebox && <><rect x={790} y={640} width={340} height={210} fill="#efe6cf" stroke="#7d7566" strokeWidth={3} /><line x1={960} y1={640} x2={960} y2={850} stroke="#7d7566" strokeWidth={5} />{[0, 1, 2, 3].map(i => <g key={i}><line x1={812} y1={676 + i * 42} x2={940} y2={676 + i * 42} stroke="#31406a" strokeWidth={5} /><line x1={980} y1={676 + i * 42} x2={1110} y2={676 + i * 42} stroke="#31406a" strokeWidth={5} /></g>)}</>}
      {shoebox && <><path d="M1420 -10 L1500 920" stroke="#111" strokeWidth={8} /><ellipse cx={1500} cy={930} rx={70} ry={22} fill="#312217" /></>}
    </Svg>
    {shoebox
      ? <Pool x={1400} y={120} rx={900} ry={760} color="255,214,150" a={0.55} />
      : <div style={{position: 'absolute', left: 520, top: 560, width: 880, height: 310, background: 'linear-gradient(90deg, rgba(255,224,160,0), rgba(255,224,160,.6) 18%, rgba(255,224,160,.6) 82%, rgba(255,224,160,0))', transform: 'rotate(-18deg)', mixBlendMode: 'screen'}} />}
    {shoebox && <><div style={{position: 'absolute', left: 1380, top: -30, width: 240, height: 220, background: '#c8b888', clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0 100%)'}} /></>}
  </Macro>
);

/** Rust wheelchair folded against the boards, sun in stripes across the wheel */
const Chair: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#060302" at={[56, 42]} vig={0.78} inner={30} z={1.03}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#34261a" />
        {Array.from({length: 10}, (_, i) => <line key={i} x1={i * 210} y1={-10} x2={i * 210} y2={1100} stroke="#1c120a" strokeWidth={6} />)}
        <rect x={-10} y={860} width={1940} height={240} fill="#4a3424" />
        <circle cx={980} cy={590} r={260} fill="none" stroke="#6b5742" strokeWidth={18} />
        {Array.from({length: 18}, (_, i) => <line key={i} x1={980} y1={590} x2={980 + Math.cos((i * Math.PI) / 9) * 256} y2={590 + Math.sin((i * Math.PI) / 9) * 256} stroke="#594633" strokeWidth={4} />)}
        <circle cx={980} cy={590} r={34} fill="#3d3226" />
        <path d="M760 880 L860 200 H1140 L1200 880" stroke="#7a5b3c" strokeWidth={22} fill="none" />
        <path d="M860 200 L800 130 M1140 200 L1210 130" stroke="#6a4a2e" strokeWidth={22} strokeLinecap="round" />
        <path d="M870 280 Q990 340 1130 280 V470 Q990 520 870 470 Z" fill="#2c3136" stroke="#111" strokeWidth={4} />
        <path d="M900 330 Q990 390 1100 330" stroke="#191c20" strokeWidth={14} fill="none" />
      </Svg>
      {/* old curtain being pulled away left */}
      <Svg><path d={`M-20 -20 H${620 - k * 220} Q${560 - k * 200} 500 ${660 - k * 220} 1100 H-20 Z`} fill="#6d4f58" /><path d={`M${100} -20 Q60 500 120 1100 M${300 - k * 90} -20 Q270 500 330 1100`} stroke="#4c3540" strokeWidth={22} fill="none" /></Svg>
      <Hand x={650 - k * 220} y={420} s={2} rot={-6} skin={C.skinT} sleeve={C.dayShirt} mode="grip" />
      <Svg>{Array.from({length: 8}, (_, i) => <rect key={i} x={560} y={300 + i * 72} width={1100} height={22} fill="#ffe6ae" opacity={0.16} transform={`rotate(-6 960 ${300 + i * 72})`} style={{filter: 'blur(5px)'}} />)}</Svg>
      <Pool x={1500} y={260} rx={820} color="255,226,170" a={0.3} />
    </Macro>
  );
};

const Amulet: React.FC<{p: ShotProps; v: string}> = ({p, v}) => {
  const k = K(p);
  const candle = <>
    <Svg><rect x={1650} y={420} width={36} height={420} fill="#efe8cf" /><path d="M1668 340 Q1644 390 1668 420 Q1692 390 1668 340 Z" fill="#ffcf6a" /></Svg>
    <Pool x={1668} y={390} rx={560} color="255,190,110" a={0.62 * flicker(p.f, 3, 0.25)} />
  </>;
  if (v === 'necklace-ins') return (
    <Macro p={p} bg="#0b0604" at={[64, 42]} vig={0.8} inner={30}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#302116" /><rect x={-10} y={760} width={1940} height={340} fill="#5e4229" /></Svg>
      <Sheet x={280} y={720} w={1120} h={320} color="#e6dfc8" rot={-1.5}><Typed x={90} y={100} size={70} weight={700} color="#2e2a22">นายชาญ ...</Typed></Sheet>
      <div style={{position: 'absolute', left: 340, top: 200, width: 900, height: 640, borderRadius: 30, background: 'rgba(235,240,245,.14)', border: '4px solid rgba(240,245,250,.5)'}} />
      <Svg>
        <path d="M640 330 Q430 500 640 700 Q880 780 940 560" stroke="#3a3a3f" strokeWidth={10} strokeDasharray="4 8" fill="none" />
        <rect x={840} y={440} width={190} height={250} rx={24} fill="#b28a3a" stroke="#5d4516" strokeWidth={8} />
        <path d="M935 480 Q880 530 900 640 H970 Q990 530 935 480 Z" fill="#6a4f18" />
      </Svg>
      {candle}
    </Macro>
  );
  if (v === 'amulet-ecu') return (
    <Macro p={p} bg="#060302" at={[52, 44]} vig={0.88} inner={26} z={1.06}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#241810" />
        <g transform={`rotate(${-k * 14} 700 540)`}>
          <rect x={560} y={170} width={620} height={810} rx={60} fill="#b28a3a" stroke="#5d4516" strokeWidth={14} />
        </g>
        <rect x={700} y={230} width={620} height={720} rx={60} fill="#8e6c29" stroke="#4a3812" strokeWidth={14} />
        <path d="M1200 520 L1760 460 L1780 490 L1210 560 Z" fill="#d7dfe2" stroke="#353a3c" strokeWidth={5} />
      </Svg>
      <Hand x={1720} y={620} s={2} rot={198} skin={C.skinT} mode="grip" />
      <Pool x={1300} y={300} rx={700} color="255,190,110" a={0.45} />
    </Macro>
  );
  return (
    <Macro p={p} bg="#060302" at={[50, 44]} vig={0.9} inner={24} z={1.07}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#1a110a" />
        <rect x={420} y={70} width={1080} height={940} rx={80} fill="#8e6c29" stroke="#4a3812" strokeWidth={16} />
        <rect x={500} y={150} width={920} height={780} rx={50} fill="#5d4516" />
        <rect x={870} y={220} width={160} height={560} rx={16} fill="#ffcf6a" stroke="#6f5216" strokeWidth={6} />
        <circle cx={950} cy={720} r={120} fill="none" stroke="#ffcf6a" strokeWidth={44} />
        {[0, 1, 2].map(i => <rect key={i} x={1030} y={270 + i * 76} width={70 - i * 12} height={38} fill="#ffcf6a" stroke="#6f5216" strokeWidth={4} />)}
      </Svg>
      <Pool x={950} y={460} rx={460} color="255,214,120" a={0.6 * flicker(p.f, 5, 0.3)} />
    </Macro>
  );
};

const HouseScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'album-ins') return <Album p={p} />;
  if (v === 'album-ins2') return <Album p={p} second />;
  if (v === 'altar-low') return <AltarLow p={p} />;
  if (v === 'altar-ins') return <AltarLow p={p} ins />;
  if (v === 'thyme-floor-high') return <FloorHigh p={p} />;
  if (v === 'shoebox-high') return <FloorHigh p={p} shoebox />;
  if (v === 'curtain-med') return <Chair p={p} />;
  if (v === 'necklace-ins' || v === 'amulet-ecu' || v === 'key-ins') return <Amulet p={p} v={v} />;
  const time = d.time ?? 'sun';
  return <Shot p={p} world={<>
    <Soft p={p}><Room p={p} time={time} /></Soft>
    <Actors p={p} />
    {d.heldPhoto && <Sheet x={d.heldPhoto[0]} y={d.heldPhoto[1]} w={150} h={190} color="#efe8d4" rot={-5}><div style={{position: 'absolute', left: 10, top: 10, width: 130, height: 150, background: '#99a8ae'}} /></Sheet>}
    {d.phoneGlow && <Pool x={d.phoneGlow[0]} y={d.phoneGlow[1]} rx={120} color="175,205,255" a={0.42} />}
  </>} />;
};

export const HOUSE: Record<string, ShotComponent> = {house: HouseScene};
