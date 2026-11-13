import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {D, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {Actors, C, Shot} from './cast';
import {WardrobeInside} from './rooms';

// ห้องที่ห้า (brief.md → Sets): 2.40 × 3.00 m. The camera has no room to stand back, so most frames are close, low or high.
// Bulb on its flex at the centre (data.mode: bulb), battery lamp once the power is cut (mode: lamp). On the walls: pencil
// tallies, a child's drawing and, at the head of the mattress, the whole family photo, only ever soft until Ch6.

export const R5 = makeRoom({x: 900, y: 400}, {x0: 590, x1: 1290, y0: 180, y1: 690}, 2.5);

const Tally: React.FC = () => {
  const r = R5, marks: React.ReactNode[] = [];
  let n = 0;
  for (let row = 0; row < 8; row++) for (let g = 0; g < 7; g++) {
    if (rnd(5, row * 11 + g) < 0.1) continue;
    const u = 0.04 + g * 0.074, v = 0.16 + row * 0.07;
    for (let i = 0; i < 4; i++) { const a = r.P(u + i * 0.012, v, 0), b = r.P(u + i * 0.012, v + 0.045, 0); marks.push(<line key={`${n++}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#312e29" strokeWidth={2.4} />); }
    const a = r.P(u - 0.006, v + 0.04, 0), b = r.P(u + 0.044, v + 0.006, 0); marks.push(<line key={`${n++}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#312e29" strokeWidth={2.4} />);
  }
  return <Svg>{marks}</Svg>;
};

const Room5World: React.FC<{p: ShotProps}> = ({p}) => {
  const r = R5, d = D(p), mode = d.mode ?? 'bulb';
  const b = r.P(0.5, 0.2, 0.42);
  const fan = r.P(0.82, 1, 0.3);
  const spin = mode === 'bulb' ? p.f * 0.9 : 0;
  const lamp: [number, number] = d.lamp ?? [680, 720];
  return (
    <>
      <RoomShell r={r} id="r5" wall="#7c7867" side="#615d4f" sideFar="#6a6657" floorC="#514b3f" ceiling="#2c2a24" floor="plain" walls="plain" />
      <Tally />
      {/* a child's drawing of a house with people outside, taped up */}
      <RFace r={r} pts={[[0.66, 0.18, 0], [0.92, 0.18, 0], [0.92, 0.44, 0], [0.66, 0.44, 0]]} fill="#e2dbc6" stroke="#8d8772" />
      <Svg>{(() => { const q = r.P(0.79, 0.34, 0); return <g transform={`translate(${q.x} ${q.y})`} fill="none" strokeWidth={4}><path d="M-52 26 v-40 l52 -30 l52 30 v40 z" stroke="#2f5da8" /><circle cx={-74} cy={8} r={7} stroke="#b0322a" /><path d="M-74 15 v20" stroke="#b0322a" /><circle cx={74} cy={8} r={7} stroke="#b0322a" /><path d="M74 15 v20" stroke="#b0322a" /></g>; })()}</Svg>
      {/* the photo at the head of the mattress: only a soft rectangle from here */}
      <RFace r={r} pts={[[0.14, 0.56, 0], [0.3, 0.56, 0], [0.3, 0.72, 0], [0.14, 0.72, 0]]} fill="#b9ae93" stroke="#2c2119" sw={4} />
      {/* mattress, jugs along the left wall, a bucket curtain in the far corner */}
      <RBox r={r} u={[0.02, 0.56]} v={[0.94, 1]} w={[0.02, 0.7]} front="#7c7560" top="#9a9378" side="#5e5847" />
      <RFace r={r} pts={[[0.06, 0.94, 0.42], [0.52, 0.94, 0.42], [0.52, 0.94, 0.68], [0.06, 0.94, 0.68]]} fill="#6f7984" o={0.9} />
      {[0.74, 0.82, 0.9].map((w, i) => <RBox key={w} r={r} u={[0.02, 0.15]} v={[0.76, 1]} w={[w - 0.05, w + 0.03]} front={i === 2 ? '#68849a' : '#8ba7bd'} top="#c6d7e4" side="#5d7b92" />)}
      <RFace r={r} pts={[[0.76, 0.3, 0.01], [0.98, 0.3, 0.01], [0.98, 1, 0.01], [0.76, 1, 0.01]]} fill="#475058" stroke="#2c2f33" />
      {/* the boarded window high on the right wall: street light in lines */}
      <RFace r={r} pts={[[1, 0.2, 0.2], [1, 0.2, 0.46], [1, 0.56, 0.46], [1, 0.56, 0.2]]} fill="#26201a" stroke="#120d09" sw={5} />
      {[0, 1, 2, 3].map(i => <RFace key={i} r={r} pts={[[1, 0.26 + i * 0.08, 0.21], [1, 0.26 + i * 0.08, 0.45], [1, 0.272 + i * 0.08, 0.45], [1, 0.272 + i * 0.08, 0.21]]} fill="#ffb060" o={0.72} />)}
      {/* the fan on the floor */}
      <Svg>
        <rect x={fan.x - 8} y={fan.y - 150} width={16} height={150} fill="#3c3c3a" />
        <ellipse cx={fan.x} cy={fan.y - 6} rx={46} ry={13} fill="#2a2a28" />
        <circle cx={fan.x} cy={fan.y - 190} r={86} fill="#1b1b1a" opacity={0.75} stroke="#55554f" strokeWidth={4} />
        {[0, 120, 240].map(a => <ellipse key={a} cx={fan.x} cy={fan.y - 230} rx={22} ry={46} fill="#9a9a90" opacity={0.6} transform={`rotate(${a + spin} ${fan.x} ${fan.y - 190})`} />)}
      </Svg>
      {mode === 'bulb' && <>
        <Svg><line x1={b.x} y1={-400} x2={b.x} y2={b.y - 20} stroke="#0d0b0a" strokeWidth={5} /><rect x={b.x - 8} y={b.y - 32} width={16} height={18} fill="#2a2522" /><circle cx={b.x} cy={b.y} r={22} fill="#ffe7a8" /></Svg>
        <LightVeil id="r5" lights={[[b.x, b.y + 180, 640]]} o={0.56} color="#070503" />
        <Pool x={b.x} y={b.y} rx={560} color="255,214,140" a={0.5} />
        <Pool x={b.x} y={b.y + 240} rx={520} ry={320} color="255,214,140" a={0.16} />
      </>}
      {mode === 'lamp' && <>
        <LightVeil id="r5l" lights={[[lamp[0], lamp[1], 540]]} o={0.86} color="#020102" />
        <Pool x={lamp[0]} y={lamp[1]} rx={380} color="255,226,170" a={0.6 * flicker(p.f, 3, 0.08)} />
      </>}
    </>
  );
};

const Hatch: React.FC<{p: ShotProps; open?: boolean}> = ({p, open}) => {
  const d = D(p);
  return (
    <Macro p={p} bg="#050403" at={[50, 62]} vig={0.72} inner={30} z={1.05} oy={620}>
      <Svg>
        <rect x={-30} y={-30} width={1980} height={1140} fill="#6b6757" />
        <rect x={-30} y={870} width={1980} height={240} fill="#46413a" />
        <rect x={480} y={330} width={960} height={530} fill="#463324" stroke="#1b130c" strokeWidth={12} />
        <rect x={510} y={360} width={900} height={470} fill="#3a291c" stroke="#1b130c" strokeWidth={4} />
        {[640, 790, 950, 1110, 1270].map(x => <line key={x} x1={x} y1={360} x2={x} y2={830} stroke="#2a1d12" strokeWidth={5} />)}
        {Array.from({length: 18}, (_, i) => <path key={i} d={`M${600 + i * 44} ${520 + rnd(9, i) * 240} q18 -14 36 0`} stroke="#201510" strokeWidth={8} fill="none" opacity={0.55} />)}
        {!open && [[300, 880], [230, 930], [370, 950], [1600, 880]].map(([x, y], i) => <g key={i}><path d={`M${x - 66} ${y + 58} L${x - 44} ${y - 30} L${x + 44} ${y - 30} L${x + 66} ${y + 58} Z`} fill="#c8c8bd" opacity={0.92} /><rect x={x - 14} y={y - 42} width={28} height={16} fill="#b3201f" /></g>)}
        {open && <><rect x={720} y={480} width={600} height={260} fill="#100b07" /><rect x={720} y={480} width={600} height={260} fill="none" stroke="#1b130c" strokeWidth={8} /></>}
      </Svg>
      {open && <>
        <Pool x={1020} y={620} rx={320} color="60,70,90" a={0.3} />
        <div style={{position: 'absolute', left: 780, top: 500, width: 480, height: 230, background: `radial-gradient(ellipse at 40% 60%, ${C.skinC}, ${C.skinCD} 60%, #0d0907 100%)`, clipPath: 'ellipse(32% 62% at 44% 80%)', filter: 'brightness(.45)'}} />
        <Svg><rect x={880} y={578} width={200} height={38} rx={10} fill="none" stroke="#090806" strokeWidth={12} /><path d="M980 596 h26" stroke="#090806" strokeWidth={12} /></Svg>
      </>}
      {d.mode !== 'lamp' && <Pool x={720} y={140} rx={980} color="255,214,140" a={0.28} />}
      {d.mode === 'lamp' && <><div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 760px 480px at 50% 58%, rgba(0,0,0,0) 40%, rgba(0,0,0,.9) 100%)'}} /><Pool x={1020} y={1020} rx={620} ry={420} color="255,226,170" a={0.5} /></>}
    </Macro>
  );
};

const Room5: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'hatch-mouth-ecu') return <Hatch p={p} open />;
  if (v === 'reveal-fif') return (
    <Shot p={p} world={<>
      <Soft p={p}><Room5World p={p} /></Soft>
      <Actors p={p} />
    </>} fore={<Svg>
      <path d="M-20 -20 H560 V1100 H-20 Z" fill="#0b0705" />
      <path d="M1380 -20 H1940 V1100 H1380 Z" fill="#0b0705" />
      <path d="M-20 -20 H1940 V120 H-20 Z" fill="#0b0705" />
    </Svg>} foreDark={0.7} foreBlur={6} foreK={0.2} />
  );
  if (d.inside) return <Shot p={p} world={<>
    <WardrobeInside p={p} open={1} />
    <Actors p={p} />
  </>} />;
  return <Shot p={p} world={<>
    <Soft p={p}><Room5World p={p} /></Soft>
    <Actors p={p} />
    {d.lampHeld && <Svg><rect x={d.lampHeld[0] - 22} y={d.lampHeld[1] - 60} width={44} height={60} rx={8} fill="#d8d3c2" stroke="#3a3730" strokeWidth={3} /><rect x={d.lampHeld[0] - 16} y={d.lampHeld[1] - 52} width={32} height={30} fill="#ffe7a8" /></Svg>}
    {d.ricebag && <Svg><path d={`M${d.ricebag[0] - 40} ${d.ricebag[1]} q0 -60 40 -60 q40 0 40 60 Z`} fill="#c8c8bd" opacity={0.9} /><rect x={d.ricebag[0] - 10} y={d.ricebag[1] - 66} width={20} height={10} fill="#b3201f" /></Svg>}
  </>} />;
};

export const ROOM5: Record<string, ShotComponent> = {room5: Room5};
