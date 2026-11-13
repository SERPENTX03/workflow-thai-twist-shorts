import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {D, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {Actors, C, Shot} from './cast';

// หลังบ้าน (brief.md → Sets): cracked concrete, the rotten pier running out into a green canal, the far bank with stilt
// houses. The camera looks along the pier toward the water, so it runs to a vanishing point off-centre. data.tone: sun | dusk |
// night | moon. Pier shots keep one framing for the told and the true flashback (pier-false-wide, pier-true-wide).

const TONE: Record<string, {sky: [string, string]; water: [string, string]; ground: string; pier: string; bank: string; glint: string}> = {
  sun: {sky: ['#c3d8dd', '#eef0dc'], water: ['#5f7c60', '#3c5a48'], ground: '#8c8778', pier: '#6b4d33', bank: '#4f6b43', glint: 'rgba(240,250,230,.34)'},
  dusk: {sky: ['#3d3460', '#d48a5e'], water: ['#b47a58', '#3a3440'], ground: '#5a5048', pier: '#3f2c20', bank: '#2b2a28', glint: 'rgba(255,190,130,.4)'},
  night: {sky: ['#04060e', '#0e1626'], water: ['#101a26', '#05080e'], ground: '#1d1c1e', pier: '#1c1612', bank: '#07090c', glint: 'rgba(170,200,240,.26)'},
  moon: {sky: ['#101830', '#2c3c60'], water: ['#3a5578', '#16222f'], ground: '#44444e', pier: '#6a5a46', bank: '#141a24', glint: 'rgba(220,235,255,.6)'},
};

export const YardWorld: React.FC<{p: ShotProps; tone?: string}> = ({p, tone: t0}) => {
  const d = D(p), tone = t0 ?? d.tone ?? 'sun', t = TONE[tone];
  return (
    <>
      <div style={{position: 'absolute', left: -800, top: -500, width: 3500, height: 1000, background: `linear-gradient(${t.sky[0]}, ${t.sky[1]})`}} />
      {(tone === 'moon' || tone === 'night') && <div style={{position: 'absolute', left: 1460, top: 60, width: 74, height: 74, borderRadius: '50%', background: '#e8e8d8', boxShadow: '0 0 60px 20px rgba(220,230,255,.3)'}} />}
      {/* far bank: stilt houses, palms */}
      <Svg>
        <rect x={-800} y={380} width={3500} height={110} fill={t.bank} />
        {Array.from({length: 8}, (_, i) => { const x = -500 + i * 400 + rnd(71, i) * 90, w = 200 + rnd(72, i) * 80; return <g key={i} fill={t.bank} stroke={tone === 'sun' ? '#3e5636' : '#000'}><path d={`M${x} 300 L${x + w / 2} 230 L${x + w} 300 Z`} /><rect x={x + 16} y={300} width={w - 32} height={110} fill={tone === 'sun' ? '#8f7d60' : '#101218'} />{i === 2 && (tone === 'night' || tone === 'moon' || tone === 'dusk') && <rect x={x + 60} y={325} width={46} height={40} fill="#e9a24e" />}</g>; })}
      </Svg>
      {/* water, with long glints */}
      <div style={{position: 'absolute', left: -800, top: 470, width: 3500, height: 900, background: `linear-gradient(${t.water[0]}, ${t.water[1]})`}} />
      <Svg>{Array.from({length: 46}, (_, i) => { const y = 480 + rnd(73, i) * 420, x = ((rnd(74, i) * 2900 + p.f * (0.4 + rnd(75, i) * 0.7)) % 2900) - 500; return <rect key={i} x={x} y={y} width={40 + rnd(76, i) * ((y - 440) * 0.5)} height={3 + ((y - 470) / 120)} fill={t.glint} rx={2} />; })}</Svg>
      {/* the bank, concrete, the back wall edge at left */}
      <Svg>
        <path d="M-800 700 L560 560 L900 620 L1040 1400 H-800 Z" fill={t.ground} />
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${-300 + i * 130} ${820 + rnd(77, i) * 150} l${70 + rnd(78, i) * 70} ${-12 - rnd(79, i) * 34} l40 22`} stroke="#000" strokeOpacity={0.35} strokeWidth={3} fill="none" />)}
        {/* the pier runs out over the water to the point */}
        <path d="M760 700 L1120 500 L1320 500 L1500 700 Z" fill={t.pier} />
        <path d="M760 700 L1500 700 L1520 760 L740 760 Z" fill="#000" fillOpacity={0.38} />
        {Array.from({length: 12}, (_, i) => { const k = i / 11, y = 500 + 200 * k * k, x0 = 1120 - 360 * k * k, x1 = 1320 + 180 * k * k; return <line key={i} x1={x0} y1={y} x2={x1} y2={y} stroke="#000" strokeOpacity={0.4} strokeWidth={1.5 + k * 3} />; })}
        {[[790, 700, 11], [1470, 700, 11], [1010, 560, 6], [1360, 560, 6], [1130, 500, 4], [1320, 500, 4]].map(([x, y, w], i) => <g key={i}><rect x={x - w} y={y - w * 4.5} width={w * 2} height={w * 11} fill={t.pier} stroke="#000" strokeOpacity={0.5} strokeWidth={2} /></g>)}
        {tone === 'sun' && <path d="M790 660 l-14 16 l28 0 Z" fill="#b84c3a" opacity={0.8} />}
        {tone !== 'moon' && d.boatMoored && <path d="M1540 700 q60 40 200 34 q60 -2 100 -44 l-30 30 q-140 16 -270 -20 Z" fill={t.pier} />}
      </Svg>
      {/* back wall of the house at the left edge, door light */}
      <Svg>
        <rect x={-800} y={-400} width={1030} height={1120} fill={tone === 'sun' ? '#938a74' : '#27262a'} />
        <rect x={40} y={210} width={160} height={490} fill={d.doorLit ? '#ffcc88' : tone === 'sun' ? '#2a241c' : '#0e0c0a'} stroke="#17100b" strokeWidth={6} />
      </Svg>
      {d.doorLit && <Pool x={120} y={460} rx={360} color="255,200,130" a={0.46} />}
      {(tone === 'night' || tone === 'moon') && <Pool x={1400} y={420} rx={980} ry={520} color="170,195,240" a={0.34} />}
      {tone === 'dusk' && <Pool x={1500} y={330} rx={900} color="255,170,110" a={0.3} />}
    </>
  );
};

const PostIns: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#1a2120" at={[46, 40]} vig={0.5} inner={38} z={1.04}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#6d8a72 10%, #2d4a3a)'}} />
    <Svg>
      {Array.from({length: 26}, (_, i) => <rect key={i} x={(rnd(95, i) * 2000 + p.f) % 2000 - 40} y={560 + rnd(96, i) * 500} width={60 + rnd(97, i) * 220} height={5} fill="rgba(230,245,230,.32)" />)}
      <path d="M720 -40 h300 l-20 700 q160 40 180 50 q-120 80 -300 40 q-160 30 -210 -50 q60 -20 60 -40 Z" fill="#4a3625" stroke="#1b130c" strokeWidth={8} />
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${760 + i * 50} ${40 + i * 120} q10 200 -6 460`} stroke="#2e2015" strokeWidth={6} fill="none" />)}
      <path d="M716 270 Q860 320 1012 262 L1016 360 Q870 412 712 366 Z" fill="#c9b184" />
      {[0, 1, 2].map(i => <path key={i} d={`M780 ${300 + i * 22} q86 12 170 -6`} stroke="#8e2a22" strokeWidth={5} fill="none" />)}
      <path d="M1012 310 q70 40 54 110 M1012 330 q30 60 8 120" stroke="#b3a182" strokeWidth={8} fill="none" />
    </Svg>
    <Pool x={1400} y={120} rx={800} color="255,246,214" a={0.2} />
  </Macro>
);

const WaterMeter: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#141413" at={[50, 42]} vig={0.52} inner={36} z={1.04}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1120} fill="#6f6c5f" />
      <rect x={380} y={80} width={1160} height={720} fill="#1b1a18" stroke="#3b3a33" strokeWidth={16} />
      <rect x={-20} y={380} width={460} height={110} fill="#4c5a62" stroke="#1d2428" strokeWidth={6} />
      <rect x={1480} y={380} width={460} height={110} fill="#4c5a62" stroke="#1d2428" strokeWidth={6} />
      <circle cx={960} cy={430} r={270} fill="#8f8a5b" stroke="#3d3a21" strokeWidth={20} />
      <circle cx={960} cy={430} r={230} fill="#d8d3b7" />
      {['0', '4', '1', '7', '9'].map((c, i) => <g key={i}><rect x={800 + i * 64} y={330} width={60} height={82} fill={i > 2 ? '#a02a20' : '#14130f'} /><text x={830 + i * 64} y={394} textAnchor="middle" fontFamily={'"Courier New", monospace'} fontWeight={700} fontSize={64} fill="#eee8d2">{c}</text></g>)}
      <path d="M960 530 L960 460" stroke="#a11818" strokeWidth={10} strokeLinecap="round" />
      <circle cx={960} cy={530} r={16} fill="#1b1a18" />
      <path d="M710 210 Q920 330 1210 240 M700 330 L1190 620 M820 170 L900 640 M1090 200 L760 610" stroke="#f0ede0" strokeWidth={2.5} opacity={0.72} />
      <circle cx={960} cy={430} r={90} fill="none" stroke="#f0ede0" strokeWidth={2} opacity={0.5} />
      <circle cx={960} cy={430} r={165} fill="none" stroke="#f0ede0" strokeWidth={2} opacity={0.5} />
    </Svg>
    <Pool x={1300} y={100} rx={800} color="255,246,214" a={0.3} />
  </Macro>
);

const Yard: ShotComponent = p => {
  const v = p.shot.view ?? '', d = D(p);
  if (v === 'pier-post-ins') return <PostIns p={p} />;
  if (v === 'watermeter-ins') return <WaterMeter p={p} />;
  if (v === 'boat-far-ins') return <Shot p={p} world={<><Soft p={p}><YardWorld p={p} /></Soft>
    <Svg><path d="M1120 556 q60 18 150 12 l30 -18 q-90 12 -180 6 Z" fill="#060709" /><rect x={1192} y={480} width={6} height={80} fill="#060709" /><circle cx={1195} cy={520} r={9} fill="#fff6c8" /></Svg>
    <Pool x={1195} y={520} rx={110} color="255,230,160" a={0.6} /></>}
    fore={<Svg><path d="M-20 -20 H820 V1100 H-20 Z M1420 -20 H1940 V1100 H1420 Z" fill="#090806" />{[880, 1000, 1120, 1240, 1360].map(x => <rect key={x} x={x} y={-20} width={14} height={1120} fill="#090806" />)}</Svg>} foreBlur={5} foreDark={0.6} foreK={0.1} />;
  return <Shot p={p} world={<>
    <Soft p={p}><YardWorld p={p} /></Soft>
    <Actors p={p} />
    {d.sil && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.06)'}}><Actors p={p} cast={d.sil} /></div>}
    {d.boat && <Svg>
      <path d={`M${d.boat[0] - 210} ${d.boat[1]} q40 54 200 56 q170 -2 220 -56 l-70 26 q-160 18 -290 -6 Z`} fill={C.woodD} stroke="#000" strokeWidth={3} />
      <path d={`M${d.boat[0] + 60} ${d.boat[1] - 240} L${d.boat[0] + 150} ${d.boat[1] + 90}`} stroke="#000" strokeWidth={7} />
    </Svg>}
    {d.envelope && <Svg><g transform={`translate(${d.envelope[0]} ${d.envelope[1]}) rotate(-14)`}><rect x={-42} y={-27} width={84} height={54} fill="#e7dcbf" stroke="#7b7056" strokeWidth={3} /><path d="M-42 -27 L0 6 L42 -27" stroke="#7b7056" strokeWidth={3} fill="none" /></g></Svg>}
  </>} />;
};

export const YARD: Record<string, ShotComponent> = {yard: Yard};
