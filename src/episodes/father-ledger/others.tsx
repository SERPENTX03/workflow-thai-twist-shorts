import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {flicker} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {ActorView, parseActor} from '../../kit/stage';
import {Actors, C, PX_CM, ROSTER} from './cast';
import {D, Flames, HangBulb, Macro, Pool, Shot, Soft, Svg, Typed} from './common';
import {Benz} from './stall';

// The small places, one shot-list each: sala, temple gate, the fire, the school road, the rented room, farm,
// hospital bench, police station, graduation, the free clinic in the old stall.

// ---------------------------------------------------------------- sala: open temple hall, plastic chairs, a far white coffin

const SALA = makeRoom({x: 1040, y: 420}, {x0: 720, x1: 1400, y0: 250, y1: 640}, 5);
const COFFIN = SALA.P(0.5, 0.74, 0.12);

const Sala: React.FC<{p: ShotProps; chairs?: boolean}> = ({p, chairs = true}) => {
  const r = SALA;
  return (
    <>
      <RoomShell r={r} id="sala" wall="#c1aa79" side="#8f7a57" sideFar="#6c5c43" floorC="#6e6a5c" ceiling="#332a1e" floor="tiles" walls="plain" boards={14} />
      {/* open on the left: posts, evening light coming through and raking the floor */}
      <RFace r={r} pts={[[0, 0.1, 0.02], [0, 0.1, 1], [0, 1, 1], [0, 1, 0.02]]} fill="#e6c183" />
      {[0.06, 0.28, 0.5, 0.72, 0.94].map(w => <RFace key={w} r={r} pts={[[0, 0, w], [0, 0, w + 0.05], [0, 1, w + 0.05], [0, 1, w]]} fill="#4b3a26" />)}
      <RFace r={r} pts={[[0, 1, 0.1], [0.6, 1, 0.3], [0.6, 1, 0.6], [0, 1, 0.4]]} fill="#ffdc9c" o={0.3} />
      <RFace r={r} pts={[[0, 1, 0.56], [0.6, 1, 0.76], [0.6, 1, 1], [0, 1, 0.84]]} fill="#ffdc9c" o={0.3} />
      {/* shrine wall behind the coffin */}
      <RFace r={r} pts={[[0.3, 0.1, 0], [0.7, 0.1, 0], [0.7, 0.72, 0], [0.3, 0.72, 0]]} fill="#6f2a20" stroke="#2c130e" />
      {/* neon */}
      {[0.3, 0.7].map(u => { const a = r.P(u, 0.04, 0.3), b = r.P(u, 0.04, 0.7); return <Svg key={u}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f7fbf6" strokeWidth={9} /></Svg>; })}
      {/* the coffin */}
      <RBox r={r} u={[0.34, 0.66]} v={[0.62, 1]} w={[0.06, 0.18]} front="#ece7da" top="#f8f4ea" side="#cfc8b6" rim="#c8a44e" />
      <RBox r={r} u={[0.25, 0.31]} v={[0.8, 1]} w={[0.08, 0.12]} front="#3a2418" />
      <RBox r={r} u={[0.69, 0.75]} v={[0.8, 1]} w={[0.08, 0.12]} front="#3a2418" />
      {[[0.28, 0.72], [0.72, 0.72]].map(([u, v]) => { const q = r.P(u, v, 0.1); return <React.Fragment key={u}><Svg><rect x={q.x - 4} y={q.y} width={8} height={36} fill="#efe6cf" /></Svg><Pool x={q.x} y={q.y - 6} rx={60} color="255,190,110" a={0.85} /></React.Fragment>; })}
      {/* wreaths: the small pair, and the white lotus one taller than a man */}
      <Wreath x={r.P(0.87, 1, 0.14).x} y={r.P(0.87, 1, 0.14).y} s={0.82} />
      <SmallWreath x={r.P(0.15, 1, 0.12).x} y={r.P(0.15, 1, 0.12).y} s={1} />
      {/* rows of plastic chairs */}
      {chairs && Array.from({length: 6}, (_, row) => Array.from({length: 8}, (_, i) => {
        const w = 0.42 + row * 0.09, u = 0.07 + i * 0.125;
        if (u > 0.42 && u < 0.56) return null;
        const q = r.P(u, 1, w), k = r.s(w) * 0.9;
        return <Svg key={row + '-' + i}><path d={`M${q.x - 15 * k} ${q.y - 30 * k} V${q.y} M${q.x + 15 * k} ${q.y - 30 * k} V${q.y}`} stroke="#6b2a1f" strokeWidth={3 * k} /><rect x={q.x - 18 * k} y={q.y - 34 * k} width={36 * k} height={7 * k} fill="#b0432f" /><rect x={q.x - 18 * k} y={q.y - 66 * k} width={36 * k} height={22 * k} rx={4 * k} fill="#c44f38" /></Svg>;
      }))}
      <LightVeil id="sala" lights={[[COFFIN.x, COFFIN.y, 360], [300, 560, 680]]} o={0.3} color="#0a0604" />
    </>
  );
};

/** the tall one: white lotus on a stand, black ribbon, gold print */
const Wreath: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg width={360 * s} height={660 * s} viewBox="-180 -660 360 660" style={{position: 'absolute', left: x - 180 * s, top: y - 660 * s, overflow: 'visible'}}>
    <path d="M-110 0 L-20 -300 M110 0 L20 -300 M0 0 V-300" stroke="#402c1a" strokeWidth={9} />
    <circle cy={-470} r={168} fill="#26331f" />
    {Array.from({length: 40}, (_, i) => { const a = (i / 40) * 6.283 * 3, rr = 44 + (i / 40) * 112; return <g key={i} transform={`translate(${Math.cos(a) * rr} ${-470 + Math.sin(a) * rr}) rotate(${(a * 180) / Math.PI})`}><path d="M0 -22 Q16 0 0 22 Q-16 0 0 -22 Z" fill="#f4f1e6" stroke="#b6b09c" strokeWidth={2} /></g>; })}
    <rect x={-90} y={-330} width={180} height={190} fill="#141318" />
    <path d="M-90 -140 L-90 -80 L-60 -110 L-30 -80 L-30 -140 Z M30 -140 L30 -80 L60 -110 L90 -80 L90 -140 Z" fill="#141318" />
    <text y={-246} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={26} fill={C.gold}>คุณหญิงพรรณี</text>
    <circle cy={-192} r={22} fill={C.gold} />
  </svg>
);

const SmallWreath: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg width={220 * s} height={320 * s} viewBox="-110 -320 220 320" style={{position: 'absolute', left: x - 110 * s, top: y - 320 * s, overflow: 'visible'}}>
    <path d="M-50 0 L-10 -130 M50 0 L10 -130" stroke="#402c1a" strokeWidth={6} />
    <circle cy={-210} r={92} fill="#8a5a50" />
    <circle cy={-210} r={50} fill="#b9ad96" />
  </svg>
);

const SalaScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'coffin-low') return <CoffinLow p={p} />;
  if (v === 'wreath-wide') return <WreathWide p={p} />;
  return <Shot p={p} world={<>
    <Soft p={p}><Sala p={p} chairs={d.chairs !== false} /></Soft>
    <Actors p={p} />
    {d.envelope && <div style={{position: 'absolute', left: d.envelope[0], top: d.envelope[1], width: 130, height: 86, background: '#d9c79d', border: '2px solid #8f7d55', transform: 'rotate(-6deg)'}} />}
  </>} fore={d.fore === 'ots' ? <div style={{position: 'absolute', left: -240, top: 300, width: 900, height: 950, borderRadius: '46% 46% 0 0', background: '#2f3b31'}}><div style={{position: 'absolute', left: 300, top: -320, width: 360, height: 400, borderRadius: '50%', background: '#1a1817'}} /></div> : undefined} foreBlur={11} foreDark={0.5} />;
};

/** From stand height along the lid: four nails, a dry garland, two candle flames in the white paint, Thyme small behind */
const CoffinLow: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#0c0806" at={[50, 42]} vig={0.66} z={1.03}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill="#3a2a1c" />
      <rect x={-10} y={-10} width={1940} height={560} fill="#58261d" />
    </Svg>
    <div style={{position: 'absolute', left: 0, top: 0, filter: 'blur(5px)'}}><ActorView a={{...parseActor('thyme1@1320,720 sad'), h: 300}} roster={ROSTER} floor={720} pxPerCm={PX_CM} f={p.f} /></div>
    <Svg>
      <path d="M-40 1120 L-40 720 L420 520 L1500 520 L1960 720 L1960 1120 Z" fill="#f4f0e4" />
      <path d="M-40 720 L420 520 L1500 520 L1960 720" fill="none" stroke="#c8a44e" strokeWidth={10} />
      {[[300, 620], [1600, 620], [120, 860], [1780, 860]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={18 + (y - 600) * 0.05} fill="#726d62" /><circle cx={x - 5} cy={y - 5} r={7} fill="#d7d2c4" /></g>)}
      <path d="M520 620 Q960 770 1400 620" stroke="#8d6a3a" strokeWidth={14} fill="none" strokeDasharray="20 10" />
      {Array.from({length: 12}, (_, i) => <circle key={i} cx={560 + i * 72} cy={636 + Math.sin((i / 11) * Math.PI) * 84} r={15} fill={i % 2 ? '#c6a15a' : '#9a7a3f'} />)}
      {[0, 1].map(i => <path key={i} d={`M${820 + i * 280} 900 Q${800 + i * 280} 820 ${820 + i * 280} 760 Q${840 + i * 280} 820 ${820 + i * 280} 900 Z`} fill="#f7c675" opacity={0.75} />)}
    </Svg>
    <Pool x={960} y={520} rx={700} color="255,200,120" a={0.28} />
  </Macro>
);

const WreathWide: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#0c0806" at={[52, 42]} vig={0.76} inner={30} z={1.03}>
    <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#332418" /><rect x={-10} y={820} width={1940} height={290} fill="#4f4b40" /></Svg>
    <div style={{filter: 'blur(4px)', position: 'absolute', left: 0, top: 0}}>
      <Svg><rect x={-200} y={590} width={720} height={250} fill="#ece7da" /><rect x={-200} y={580} width={720} height={14} fill="#c8a44e" /></Svg>
    </div>
    <Wreath x={960} y={900} s={1.25} />
    <SmallWreath x={1420} y={900} s={0.84} />
    <SmallWreath x={1680} y={900} s={0.72} />
    <div style={{position: 'absolute', left: 620, top: -40, width: 680, height: 950, clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)', background: 'linear-gradient(rgba(255,250,235,.4), rgba(255,250,235,.08))', mixBlendMode: 'screen'}} />
    <Pool x={960} y={300} rx={460} color="255,250,235" a={0.34} />
  </Macro>
);

// ---------------------------------------------------------------- the gate, seen from inside the sala

const BenzGate: ShotComponent = p => (
  <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: 'linear-gradient(#cc8a54, #eab874 58%, #877357 72%)'}} />
    <Svg>
      {/* the temple's wall and gate, a dusty lane */}
      <rect x={-600} y={420} width={3100} height={200} fill="#cfc0a2" />
      <rect x={-600} y={400} width={3100} height={28} fill="#7a3b2a" />
      <rect x={620} y={250} width={90} height={380} fill="#e6dcc5" stroke="#7a6b4e" strokeWidth={4} />
      <rect x={1430} y={250} width={90} height={380} fill="#e6dcc5" stroke="#7a6b4e" strokeWidth={4} />
      <path d="M570 250 Q1070 90 1570 250 L1570 300 Q1070 150 570 300 Z" fill="#8b3d2b" stroke="#47231a" strokeWidth={5} />
      <rect x={-600} y={620} width={3100} height={600} fill="#7d6a51" />
    </Svg>
    <Benz x={1090} y={720} s={1.15} window />
    <Svg>
      {/* rear side window down by half: a white hand and fan in the dark */}
      <rect x={950} y={402} width={290} height={70} fill="#050507" />
      <path d="M1060 470 L1010 420 A70 70 0 0 1 1110 420 Z" fill="#f7f4ea" />
    </Svg>
    <Pool x={500} y={500} rx={820} color="255,206,140" a={0.3} />
  </>} fore={
    <>
      <div style={{position: 'absolute', left: -80, top: -40, width: 460, height: 1200, background: '#3a2a1a'}} />
      <div style={{position: 'absolute', left: 1680, top: -40, width: 380, height: 1200, background: '#2c1f13'}} />
      <div style={{position: 'absolute', left: 240, top: -40, width: 1500, height: 240, background: '#171a10', borderRadius: '0 0 50% 40%'}} />
      {Array.from({length: 30}, (_, i) => <div key={i} style={{position: 'absolute', left: 300 + rnd(231, i) * 1300, top: 120 + rnd(232, i) * 150, width: 60, height: 40, borderRadius: '60% 10%', background: '#171a10', transform: `rotate(${rnd(233, i) * 180}deg)`}} />)}
    </>
  } foreBlur={8} foreDark={0.6} foreK={0.2} />
);

// ---------------------------------------------------------------- fire, 18 years ago

const FireWide: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#060204" at={[50, 44]} vig={0.76} past={false} z={1.04}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#0a0309, #3b0d0d 52%, #120505 72%)'}} />
    <Svg>
      <rect x={-10} y={740} width={1940} height={360} fill="#100505" />
      {/* a wooden house on posts, in flames */}
      <path d="M360 330 L960 110 L1560 330 Z" fill="#190807" />
      <rect x={470} y={330} width={980} height={290} fill="#170706" />
      {[500, 900, 1400].map(x => <rect key={x} x={x} y={620} width={36} height={150} fill="#0b0403" />)}
    </Svg>
    <Flames x={960} y={640} w={1360} h={560} f={p.f} seed={5} />
    <Flames x={560} y={770} w={460} h={320} f={p.f} seed={7} />
    <Flames x={1420} y={770} w={480} h={360} f={p.f} seed={11} />
    <Pool x={960} y={420} rx={1000} ry={620} color="255,120,50" a={0.5} />
    <Svg>{Array.from({length: 46}, (_, i) => { const t = (p.f * 0.006 + rnd(241, i)) % 1; return <circle key={i} cx={300 + rnd(242, i) * 1320 + t * 80} cy={700 - t * 700} r={3 + rnd(243, i) * 4} fill="#ffb24a" opacity={1 - t} />; })}</Svg>
    {/* one thin black man running at us, a bundle held to his chest */}
    <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.03)'}}><ActorView a={{...parseActor('charn-sil@960,960 armR=chest armL=chest'), h: 560}} roster={ROSTER} floor={960} pxPerCm={PX_CM} f={p.f} /></div>
    <Svg><ellipse cx={960} cy={660} rx={72} ry={92} fill="#020101" /><circle cx={960} cy={585} r={38} fill="#020101" /></Svg>
  </Macro>
);

const FireClose: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#0d0302" at={[50, 44]} vig={0.8} past={false} z={1.04}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, #501611, #0c0302 70%)'}} />
    <Flames x={960} y={1120} w={2300} h={520} f={p.f} seed={13} />
    <Flames x={250} y={1120} w={700} h={1040} f={p.f} seed={5} />
    <Flames x={1700} y={1120} w={700} h={1000} f={p.f} seed={7} />
    <div style={{position: 'absolute', left: 0, top: 0}}><ActorView a={{...parseActor('charn@830,1660 sad head=12'), h: 1400}} roster={ROSTER} floor={1660} pxPerCm={PX_CM} f={p.f} /></div>
    {/* the child against his neck, the back of a small head; the torn right shoulder glows */}
    <Svg>
      <circle cx={1110} cy={620} r={170} fill="#2b221e" />
      <path d="M940 1100 Q940 800 1110 780 Q1290 800 1290 1100 Z" fill="#c5b7a3" />
      <path d="M570 660 Q640 590 720 620 L700 780 Q620 800 560 760 Z" fill="#a1321a" />
      <path d="M582 680 q60 -24 116 2 M578 716 q60 -24 118 4" stroke="#ffb24a" strokeWidth={8} fill="none" />
    </Svg>
    <Svg>{Array.from({length: 26}, (_, i) => { const t = (p.f * 0.009 + rnd(251, i)) % 1; return <circle key={i} cx={rnd(252, i) * 1920} cy={t * 900} r={4 + rnd(253, i) * 5} fill="#ffb24a" opacity={1 - t * 0.4} />; })}</Svg>
  </Macro>
);

// ---------------------------------------------------------------- school road

const SKY_S = 'linear-gradient(#e49a5c, #f6cf8e 42%, #e9d9b2 58%)';
const SCHOOL = makeRoom({x: 1180, y: 450}, {x0: 960, x1: 1300, y0: 280, y1: 500}, 9);
const SchoolRoad: React.FC<{p: ShotProps; gate?: boolean; dim?: boolean}> = ({gate}) => (
  <>
    <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: SKY_S}} />
    <Svg>
      {/* road running away, kerb, wall of the school on the left, one lamp post at the corner */}
      <path d="M-300 1100 L1140 470 L1250 470 L2200 1100 Z" fill="#6e6a61" />
      <path d="M-300 1100 L1140 470 L-300 470 Z" fill="#a28d6e" />
      <path d="M-300 400 L1120 450 L1120 470 L-300 760 Z" fill="#d9cda9" />
      <path d="M1220 470 L1380 1100" stroke="#e6dcc6" strokeWidth={5} strokeDasharray="28 22" />
      <path d="M1660 1100 L1270 470 L2200 470 L2200 1100 Z" fill="#8e7f60" />
      {Array.from({length: 8}, (_, i) => <rect key={i} x={1320 + i * 90} y={360 - i * 20} width={70 + i * 8} height={110 + i * 40} fill={i % 2 ? '#a48e68' : '#8f7e5c'} stroke="#55492f" strokeWidth={3} />)}
      {gate && <>
        <rect x={320} y={220} width={70} height={500} fill="#e8dfc8" stroke="#6a5e45" strokeWidth={4} />
        <rect x={920} y={320} width={50} height={190} fill="#e8dfc8" stroke="#6a5e45" strokeWidth={4} />
        <path d="M290 220 L990 320 L990 360 L290 280 Z" fill="#2e5f8c" stroke="#16314a" strokeWidth={4} />
        <text x={620} y={300} transform="rotate(8 620 300)" textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={40} fill="#f2efe6">โรงเรียน</text>
      </>}
      {/* the post the man stands by: same place in the mirror shot */}
      <rect x={1046} y={260} width={10} height={260} fill="#2a2520" />
      <path d="M1050 262 Q1090 240 1120 260" stroke="#2a2520" strokeWidth={7} fill="none" />
    </Svg>
    <Pool x={1600} y={360} rx={720} ry={320} color="255,214,150" a={0.5} />
  </>
);

/** Old motorbike parked apart from the rest; the father beside it */
const SchoolScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  return <Shot p={p} world={<>
    <Soft p={p}><SchoolRoad p={p} gate={v !== 'corner-ew'} /></Soft>
    {d.crowd && <div style={{position: 'absolute', left: 0, top: 0, filter: 'blur(1.5px)'}}><Actors p={{...p, shot: {...p.shot, data: {...d, cast: d.crowd}}}} /></div>}
    {d.bike && <SimpleBike x={d.bike[0]} y={d.bike[1]} s={d.bike[2]} />}
    <Actors p={p} />
    {d.rag && <Svg><path d={`M${d.rag[0] - 44} ${d.rag[1]} Q${d.rag[0]} ${d.rag[1] - 30} ${d.rag[0] + 44} ${d.rag[1]} Q${d.rag[0] + 20} ${d.rag[1] + 50} ${d.rag[0] - 44} ${d.rag[1]} Z`} fill="#6e6a5c" /></Svg>}
  </>} />;
};

const SimpleBike: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <svg width={380 * s} height={250 * s} viewBox="-190 -250 380 250" style={{position: 'absolute', left: x - 190 * s, top: y - 250 * s, overflow: 'visible'}}>
    <circle cx={-130} cy={-58} r={56} fill="none" stroke="#17171a" strokeWidth={16} />
    <circle cx={130} cy={-58} r={56} fill="none" stroke="#17171a" strokeWidth={16} />
    <path d="M-130 -58 L-40 -130 H40 L130 -58 M40 -130 L90 -200 L140 -210" stroke="#7e241c" strokeWidth={14} fill="none" />
    <path d="M-110 -150 H30 V-120 H-100 Z" fill="#1e1e22" />
    <rect x={-40} y={-110} width={90} height={60} rx={6} fill="#333338" />
  </svg>
);

// ---------------------------------------------------------------- rented room in Bangkok, a duty room

const Flash: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'wheelchair-fif') return (
    <Shot p={p} world={<>
      <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: 'linear-gradient(#e8cf9c, #b9a578 60%, #7e6f54 62%, #5e5240)'}} />
      <Svg>
        {[260, 720, 1180, 1640].map((x, i) => <rect key={x} x={x} y={130} width={330} height={450} fill={['#8a7145', '#6e7476', '#7f6840', '#6e7476'][i]} stroke="#2a241c" strokeWidth={5} />)}
        {/* the chair, the thin man */}
        <circle cx={960} cy={770} r={92} fill="none" stroke="#2a2826" strokeWidth={13} />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={960} y1={770} x2={960 + Math.cos((i * Math.PI) / 6) * 90} y2={770 + Math.sin((i * Math.PI) / 6) * 90} stroke="#3e3b38" strokeWidth={3} />)}
        <path d="M850 450 L870 690 H1080 L1110 830" stroke="#2a2826" strokeWidth={13} fill="none" />
      </Svg>
      <Actors p={p} pxPerCm={2.6} />
      <Svg><path d="M840 700 H1130 Q1140 780 1100 790 L850 790 Q820 760 840 700 Z" fill="#7c5a6e" /></Svg>
    </>} fore={
      <>
        <div style={{position: 'absolute', left: -80, top: -40, width: 400, height: 1200, background: '#3a2f22'}} />
        <div style={{position: 'absolute', left: 1640, top: -40, width: 400, height: 1200, background: '#3a2f22'}} />
        {Array.from({length: 20}, (_, i) => <div key={i} style={{position: 'absolute', left: -80 + i * 110, top: 900 + rnd(261, i) * 100, width: 150, height: 100, borderRadius: '50%', background: ['#3f8f3b', '#58a646', '#d84f2a'][i % 3]}} />)}
      </>
    } foreBlur={9} foreDark={0.6} foreK={0.2} />
  );
  // the desk from above, a phone lighting up beside open books: 69 rent · 133 exam
  if (v === 'rent-ins' || v === 'exam-ins') {
    const night = v === 'exam-ins';
    return (
      <Macro p={p} bg="#050404" past at={[50, 40]} vig={0.82} inner={28} z={1.03}>
        <Svg>
          <rect x={-10} y={-10} width={1940} height={1100} fill="#3b2c1f" />
          {[[120, 120, -8, '#c9c1aa'], [520, 70, 4, '#d9d2bc'], [1100, 130, -3, '#cfc8b0']].map(([x, y, r, c], i) => <g key={i} transform={`rotate(${r} ${x} ${y})`}><rect x={x as number} y={y as number} width={580} height={420} fill={c as string} stroke="#7d7566" strokeWidth={4} /><line x1={(x as number) + 290} y1={y as number} x2={(x as number) + 290} y2={(y as number) + 420} stroke="#7d7566" strokeWidth={6} />{[0, 1, 2, 3, 4, 5, 6].map(k => <g key={k}><line x1={(x as number) + 30} y1={(y as number) + 40 + k * 50} x2={(x as number) + 260} y2={(y as number) + 40 + k * 50} stroke="#5f5b4c" strokeWidth={5} /><line x1={(x as number) + 320} y1={(y as number) + 40 + k * 50} x2={(x as number) + 550} y2={(y as number) + 40 + k * 50} stroke="#5f5b4c" strokeWidth={5} /></g>)}</g>)}
          <g transform="translate(860 620) rotate(-6)"><rect x={-170} y={-100} width={340} height={200} rx={18} fill="#0c0c10" stroke="#2c2c34" strokeWidth={5} /><rect x={-154} y={-86} width={308} height={172} rx={6} fill="#c9dbf5" /></g>
        </Svg>
        <div style={{position: 'absolute', left: 720, top: 545, width: 280, textAlign: 'center', transform: 'rotate(-6deg)', fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: night ? 44 : 34, color: '#1b2536', lineHeight: 1.2}}>{night ? 'พ่อ\nโทรเข้า' : 'เงินเข้า\n+50,000'}</div>
        <Hand x={night ? 1380 : 1560} y={790} s={2} rot={204} skin={C.skinT} mode="open" />
        <Pool x={860} y={620} rx={500} color="180,210,255" a={0.46} />
        {!night && <HangBulb x={280} y={60} color="255,214,150" top={-40} r={30} />}
      </Macro>
    );
  }
  // account balance, a doctor's ID card beside the phone, cold duty-room light
  return (
    <Macro p={p} bg="#070a0c" at={[50, 42]} vig={0.76} inner={30} z={1.03}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#8a5f38" />
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M-10 ${i * 150 + 40} Q960 ${i * 150 + 70} 1930 ${i * 150 + 30}`} stroke="#6f4a2a" strokeWidth={5} fill="none" />)}
        <g transform="translate(330 300)"><path d="M-70 -90 H70 L60 110 H-60 Z" fill="#5f8f5e" stroke="#2b4d31" strokeWidth={6} /><ellipse cx={0} cy={-90} rx={70} ry={20} fill="#3e2413" stroke="#2b4d31" strokeWidth={6} /></g>
        <g transform="rotate(-3 880 500)">
          <rect x={560} y={40} width={640} height={1020} rx={40} fill="#0c0c10" stroke="#2c2c34" strokeWidth={8} />
          <rect x={592} y={84} width={576} height={930} rx={12} fill="#f1f5f4" />
          <rect x={592} y={84} width={576} height={120} fill="#3e7a6e" />
        </g>
        <g transform="rotate(10 1500 620)"><rect x={1300} y={400} width={420} height={560} rx={18} fill="#eaf0f0" stroke="#5f7276" strokeWidth={5} /><rect x={1380} y={480} width={260} height={280} fill="#bfcfd2" /><circle cx={1510} cy={590} r={60} fill={C.skinT} /><path d="M1450 400 L1510 200 L1570 400" stroke="#2c4d7a" strokeWidth={16} fill="none" /></g>
      </Svg>
      <div style={{position: 'absolute', left: 615, top: 100, transform: 'rotate(-3deg)', fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 40, color: '#fff'}}>บัญชีแยก</div>
      <div style={{position: 'absolute', left: 640, top: 320, transform: 'rotate(-3deg)', fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 100, color: '#1b2536'}}>700,000</div>
      <div style={{position: 'absolute', left: 670, top: 490, transform: 'rotate(-3deg)', fontFamily: '"Plex Thai", sans-serif', fontSize: 40, color: '#6b7a7e'}}>ไม่มีรายการถอน</div>
    </Macro>
  );
};

// ---------------------------------------------------------------- farm, in hard sun

const Farm: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'bill-ins') return (
    <Macro p={p} bg="#1b1309" at={[50, 44]} vig={0.6}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#6b4c2f" />
        {Array.from({length: 7}, (_, i) => <line key={i} x1={-10} y1={i * 170} x2={1940} y2={i * 170 + 20} stroke="#3e2b1a" strokeWidth={8} />)}
        <rect x={460} y={120} width={1000} height={800} fill="#efe5a8" stroke="#8a8250" strokeWidth={5} transform="rotate(-2 960 500)" />
        {[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`rotate(-2 960 500) translate(0 ${i * 100})`}><line x1={500} y1={240} x2={1430} y2={240} stroke="#857d4c" strokeWidth={3} /></g>)}
      </Svg>
      <div style={{position: 'absolute', left: 540, top: 200, transform: 'rotate(-2deg)', fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 56, color: '#23305a', lineHeight: '100px', whiteSpace: 'pre'}}>{'หมูเกรด C   ×1\nหมูเกรด C   ×1\nหมูเกรด C   ×1\nหมูเกรด C   ×1'}</div>
      <Hand x={1620} y={720} s={2.4} rot={205} skin="#b8835a" mode="open" />
      <Svg>{Array.from({length: 12}, (_, i) => <circle key={i} cx={rnd(271, i) * 1920} cy={rnd(272, i) * 1000} r={14 + rnd(273, i) * 20} fill="#fff3c9" opacity={0.34} />)}</Svg>
    </Macro>
  );
  if (v === 'truck-ins') return (
    <Macro p={p} bg="#5b5240" at={[50, 42]} vig={0.4} inner={48}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#c5b48d" />
        <rect x={-10} y={760} width={1940} height={340} fill="#7e796b" />
        {[0, 1].map(i => <rect key={i} x={i * 1460 - 40} y={110} width={500} height={660} fill={i ? '#7c6d5a' : '#8b7f6a'} stroke="#3f382c" strokeWidth={5} />)}
        <rect x={500} y={230} width={920} height={440} fill="#d7d7cf" stroke="#2c2c2c" strokeWidth={8} />
        <rect x={470} y={660} width={980} height={90} fill="#2a2b2e" />
        {[640, 1200].map(x => <g key={x}><circle cx={x} cy={800} r={70} fill="#0e0e10" /><circle cx={x} cy={800} r={30} fill="#7c7f84" /></g>)}
        {[-1, 0, 1, 2, 3, 4].map(i => <line key={i} x1={520 + i * 150 + 130} y1={230} x2={520 + i * 150 + 130} y2={670} stroke="#46464a" strokeWidth={8} />)}
        <path d="M500 330 H1420 M500 460 H1420" stroke="#46464a" strokeWidth={8} />
        <rect x={700} y={330} width={520} height={190} fill="#ece6cf" stroke="#333" strokeWidth={5} />
      </Svg>
      <div style={{position: 'absolute', left: 760, top: 370, fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 92, color: '#262320'}}>ส่ง ชาญ</div>
    </Macro>
  );
  return <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: 'linear-gradient(#b8dceb, #eaf2ea 52%, #b39f72 54%, #8a7a5a)'}} />
    <Svg>
      {Array.from({length: 5}, (_, i) => { const s = 1 - i * 0.16, y = 560 - i * 34, x0 = 60 + i * 120, w = 1100 * s; return <g key={i}><path d={`M${x0} ${y} L${x0 + 90 * s} ${y - 110 * s} H${x0 + w} L${x0 + w + 90 * s} ${y} Z`} fill={i % 2 ? '#c2c6c7' : '#a9aeaf'} stroke="#5f6465" strokeWidth={3} /><rect x={x0} y={y} width={w + 90 * s} height={70 * s} fill="#6d6555" /></g>; })}
      {/* post-and-rail fence */}
      {[420, 600, 780, 960, 1140, 1320, 1500, 1680, 1860].map(x => <rect key={x} x={x} y={620} width={16} height={190} fill="#6b4c2f" />)}
      {[640, 700, 760].map(y => <line key={y} x1={320} y1={y} x2={1920} y2={y} stroke="#6b4c2f" strokeWidth={9} />)}
      {D(p).car && <g><path d="M60 680 L100 600 H300 L360 680 H420 V740 H20 V680 Z" fill="#5a6773" stroke="#222" strokeWidth={3} /><circle cx={110} cy={748} r={28} fill="#111" /><circle cx={330} cy={748} r={28} fill="#111" /></g>}
    </Svg>
    <Actors p={p} />
    <Pool x={1500} y={100} rx={1000} ry={560} color="255,250,225" a={0.62} />
  </>} />;
};

// ---------------------------------------------------------------- hospital bench, police station, graduation, the free clinic

const HospBench: ShotComponent = p => (
  <Shot p={p} world={<>
    <RoomShell r={HB} id="hb" wall="#b9c8c4" side="#a1b2ae" sideFar="#c8d6d2" floorC="#88999b" ceiling="#d9e3df" floor="tiles" walls="plain" boards={10} />
    <RFace r={HB} pts={[[0.1, 0.24, 0], [0.34, 0.24, 0], [0.34, 1, 0], [0.1, 1, 0]]} fill="#7d9491" stroke="#3f504e" />
    <RFace r={HB} pts={[[1, 0.2, 0.25], [1, 0.2, 0.75], [1, 0.72, 0.75], [1, 0.72, 0.25]]} fill="#fbfbe9" />
    <RFace r={HB} pts={[[1, 1, 0.25], [0.2, 1, 0.45], [0.2, 1, 0.95], [1, 1, 0.75]]} fill="#fbfbe9" o={0.42} />
    <LightVeil id="hb" lights={[[1400, 620, 720]]} o={0.3} color="#0a1014" />
    <Svg><rect x={860} y={796} width={640} height={22} rx={4} fill="#7c7669" stroke="#3f3b34" strokeWidth={3} />{[900, 1460].map(x => <rect key={x} x={x - 9} y={818} width={18} height={54} fill="#3f3b34" />)}<rect x={860} y={680} width={640} height={16} fill="#68635a" />{[880, 1480].map(x => <rect key={x} x={x - 7} y={690} width={14} height={110} fill="#57524a" />)}</Svg>
    <Actors p={p} />
    {D(p).walkers && <div style={{position: 'absolute', left: 0, top: 0, filter: 'blur(5px) brightness(.8)'}}><Actors p={{...p, shot: {...p.shot, data: {...D(p), cast: D(p).walkers}}}} /></div>}
    <div style={{position: 'absolute', left: 1260, top: 742, width: 130, height: 56, background: '#d9c79d', border: '2px solid #8f7d55', transform: 'rotate(-6deg)'}} />
  </>} />
);
const HB = makeRoom({x: 780, y: 400}, {x0: 480, x1: 1340, y0: 240, y1: 660}, 3.3);

const Station: ShotComponent = p => {
  const v = p.shot.view ?? '';
  return <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: 'linear-gradient(#bcd8e3, #eef1e4 60%)'}} />
    <Svg>
      <rect x={380} y={120} width={1300} height={560} fill="#ddd3b8" stroke="#766c53" strokeWidth={5} />
      <rect x={380} y={120} width={1300} height={70} fill="#8a3a2a" />
      <text x={1030} y={172} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={50} fill="#fff4dd">สถานีตำรวจ</text>
      {Array.from({length: 5}, (_, i) => <rect key={i} x={460 + i * 240} y={240} width={150} height={190} fill="#39505e" stroke="#2a2a22" strokeWidth={4} />)}
      <rect x={880} y={440} width={300} height={240} fill="#2e2c28" />
      {Array.from({length: 6}, (_, i) => <path key={i} d={`M${820 - i * 28} ${680 + i * 32} h${420 + i * 56} l18 32 h${-(456 + i * 56)} Z`} fill={i % 2 ? '#a79d84' : '#bfb59c'} />)}
      <rect x={-600} y={870} width={3100} height={300} fill="#7e796b" />
      <path d="M-200 860 V600 M-200 620 H400" stroke="#3b3a35" strokeWidth={8} />
      {Array.from({length: 18}, (_, i) => <rect key={i} x={-40 + i * 24} y={620} width={5} height={240} fill="#3b3a35" />)}
    </Svg>
    {v === 'thyme-nod-close' ? <Pool x={1200} y={200} rx={900} color="255,250,225" a={0.4} /> : <><Pool x={1400} y={160} rx={880} color="255,250,225" a={0.42} /><div style={{position: 'absolute', left: -600, top: 120, width: 1640, height: 800, background: 'linear-gradient(90deg, rgba(8,12,22,.5), rgba(8,12,22,0))'}} /></>}
    <Actors p={p} />
    {D(p).bag && <div style={{position: 'absolute', left: D(p).bag[0], top: D(p).bag[1], width: 110, height: 80, background: '#573a22', borderRadius: 8, border: '3px solid #20130a'}} />}
    {v === 'thyme-nod-close' && <Svg>{Array.from({length: 30}, (_, i) => <circle key={i} cx={rnd(281, i) * 1000 + 200} cy={rnd(282, i) * 700} r={10 + rnd(283, i) * 24} fill="#fff3c9" opacity={0.2} />)}</Svg>}
  </>} />;
};

const Grad: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'corner-ew') return <Shot p={p} world={<><SchoolRoad p={p} /><Actors p={p} /></>} />;
  return <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: 'linear-gradient(#b9dcf0, #f2efe0 55%, #94a07a 57%, #7d8a62)'}} />
    <Svg>
      <rect x={400} y={130} width={1120} height={420} fill="#ece4cf" stroke="#807558" strokeWidth={5} />
      <path d="M340 130 L960 20 L1580 130 Z" fill="#a0533c" stroke="#59291c" strokeWidth={5} />
      {Array.from({length: 7}, (_, i) => <rect key={i} x={470 + i * 150} y={180} width={46} height={370} fill="#d7ccb0" stroke="#807558" strokeWidth={3} />)}
      {Array.from({length: 40}, (_, i) => {
        const x = 200 + rnd(291, i) * 1500, y = 620 + rnd(292, i) * 150;
        return <g key={i}><circle cx={x} cy={y - 34} r={15} fill="#e0b48c" /><rect x={x - 17} y={y - 18} width={34} height={60} rx={8} fill={i % 5 === 0 ? '#111116' : ['#d84f6a', '#3f8f3b', '#2d6fb0', '#e8b83a'][i % 4]} /><circle cx={x + 18} cy={y - 8} r={9} fill={['#ffdb4c', '#ff6f91', '#fff'][i % 3]} /></g>;
      })}
    </Svg>
    <Actors p={p} />
    <Pool x={1500} y={100} rx={1000} ry={520} color="255,250,225" a={0.42} />
  </>} />;
};

const FreeClinic: ShotComponent = p => (
  <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: 'linear-gradient(#e7e2d0, #b6ae98)'}} />
    <Svg>
      <rect x={-600} y={830} width={3100} height={400} fill="#8a8474" />
      <rect x={300} y={100} width={1340} height={740} fill="#6a6355" stroke="#2d2a24" strokeWidth={6} />
      <rect x={260} y={70} width={1420} height={60} fill="#7b8388" />
      {/* the blind rolled up */}
      <rect x={280} y={130} width={1380} height={50} rx={24} fill="#a08552" stroke="#5a4a2a" strokeWidth={4} />
      <rect x={520} y={190} width={900} height={130} fill="#efe4c5" stroke="#6c5d3c" strokeWidth={5} />
      <text x={970} y={280} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={82} fill="#2a4d3d">คลินิกชาญ ตรวจฟรี</text>
      {/* the same low block, now a table: a blood pressure cuff, a jar of cotton */}
      <ellipse cx={1240} cy={700} rx={200} ry={60} fill="#a67d55" stroke="#1c120a" strokeWidth={4} />
      <path d="M1040 700 V744 A200 60 0 0 0 1440 744 V700" fill="#6f4f33" stroke="#1c120a" strokeWidth={4} />
      {[1110, 1370].map(x => <rect key={x} x={x} y={770} width={28} height={70} fill="#3a2a1c" />)}
      <rect x={1160} y={640} width={70} height={60} rx={8} fill="#dfe6e5" stroke="#55605f" strokeWidth={3} />
      <rect x={1270} y={650} width={100} height={46} rx={6} fill="#2c4a6a" />
    </Svg>
    <Pool x={500} y={260} rx={900} ry={600} color="255,244,214" a={0.36} />
    <Actors p={p} />
  </>} />
);

export const OTHERS: Record<string, ShotComponent> = {sala: SalaScene, temple: BenzGate, fire: p => (p.shot.view === 'shoulder-close' ? <FireClose p={p} /> : <FireWide p={p} />), school: SchoolScene, flash: Flash, farm: Farm, hospital: HospBench, station: Station, grad: Grad, clinic2: FreeClinic};
export {Typed, SCHOOL};
