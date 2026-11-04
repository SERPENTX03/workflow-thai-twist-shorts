import React from 'react';
import {Cone} from './light';
import {rnd} from '../engine/anim';
import {flicker} from './horror';
import {Boards, FLOOR, Glow, Planks, Sky, W, WOOD} from './world';

// Thai temple location sets (from temple-boy), landscape world coordinates (src/kit/world.tsx). Each is a backdrop:
// put actors on top with the episode's Actors at FLOOR. Story-specific rooms (a kuti with clue props, a kitchen)
// stay in the episode.

/** veranda outside a kuti: plank wall with a door, posts, railing in front */
export const Porch: React.FC<{f: number; light?: number}> = () => (
  <>
    <Sky tone="night" y={420} />
    <Planks y={160} h={FLOOR - 160} c0="#5a4030" c1="#33241a" />
    <div style={{position: 'absolute', left: -700, top: 60, width: W + 1400, height: 110, background: '#1c140e', boxShadow: '0 20px 30px rgba(0,0,0,.5)'}} />
    {[-300, 380, 1300, 2000].map(x => <div key={x} style={{position: 'absolute', left: x, top: 160, width: 46, height: FLOOR - 160, background: '#2a1d14'}} />)}
    <div style={{position: 'absolute', left: 500, top: 330, width: 260, height: FLOOR - 330, background: WOOD.wood1}}>
      {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 12 + i * 60, top: 10, width: 54, height: FLOOR - 350, background: '#5d422b'}} />)}
    </div>
    <Boards c0="#4a3527" c1="#241a13" />
    <div style={{position: 'absolute', left: -700, top: FLOOR + 40, width: W + 1400, height: 22, background: '#2a1e15'}} />
    {Array.from({length: 22}, (_, i) => <div key={i} style={{position: 'absolute', left: -600 + i * 160, top: FLOOR + 40, width: 18, height: 200, background: '#2a1e15'}} />)}
  </>
);

/** temple gate from the road: wall, two pillars, name sign, iron gate (right leaf open by `open`), sala + bodhi tree
 *  behind. `year` 0–9 ages the wall colour and grows the tree (time-lapse shots). */
export const Gate: React.FC<{tone: 'dusk' | 'night' | 'morning'; sign: string; year?: number; open?: number}> = ({tone, sign, year = 10, open = 0.45}) => {
  const wall = year < 10 ? ['#e8e1cf', '#d9cdb1', '#cdbf9e', '#c4b493', '#bba987'][year % 5] : '#c9bc9c';
  const treeS = 0.6 + Math.min(1, year / 10) * 0.4;
  return (
    <>
      <Sky tone={tone} y={520} />
      <svg width={W + 800} height={700} style={{position: 'absolute', left: -400, top: 120}}>
        <g transform={`translate(1700 420) scale(${treeS}) translate(-1700 -420)`}>
          {[[1700, 260, 330, 230], [1520, 330, 200, 150], [1880, 320, 210, 160], [1700, 150, 220, 150]].map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={tone === 'morning' ? ['#6d8a5e', '#5f7c52', '#78956a', '#6a8a5a'][i] : ['#141a1c', '#10161a', '#171e20', '#121819'][i]} />
          ))}
          <rect x={1680} y={380} width={46} height={260} fill={tone === 'morning' ? '#5d4a36' : '#0f1112'} />
        </g>
        <path d="M700 420 L1000 250 L1300 420 Z" fill={tone === 'morning' ? '#a8564a' : '#24171a'} />
        <path d="M640 470 L1000 300 L1360 470 Z" fill={tone === 'morning' ? '#8c4339' : '#1c1215'} />
        <rect x={720} y={470} width={560} height={150} fill={tone === 'morning' ? '#d8c7a4' : '#151216'} />
      </svg>
      <div style={{position: 'absolute', left: -700, top: 560, width: 1500, height: 370, background: wall, boxShadow: 'inset 0 18px 0 rgba(0,0,0,.12)'}} />
      <div style={{position: 'absolute', left: 1440, top: 560, width: 1200, height: 370, background: wall, boxShadow: 'inset 0 18px 0 rgba(0,0,0,.12)'}} />
      {[720, 1400].map(x => (
        <React.Fragment key={x}>
          <div style={{position: 'absolute', left: x, top: 250, width: 100, height: 680, background: '#efe7d4', boxShadow: 'inset -14px 0 0 rgba(0,0,0,.12)'}} />
          <svg width={160} height={80} style={{position: 'absolute', left: x - 30, top: 190}}><path d="M0 70 L80 0 L160 70 Z" fill="#9b3b2c" /><rect x={10} y={66} width={140} height={14} fill="#d6b45a" /></svg>
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: 820, top: 262, width: 580, height: 100, background: '#5a2b20', border: '8px solid #d6b45a', boxSizing: 'border-box',
        color: '#f1dca0', fontFamily: 'Kanit, sans-serif', fontWeight: 700, fontSize: 56, textAlign: 'center', lineHeight: '84px'}}>{sign}</div>
      <svg width={600} height={430} style={{position: 'absolute', left: 820, top: 500}}>
        {[0, 1].map(leaf => {
          const w = leaf === 0 ? 290 : 290 * (1 - open);
          const x0 = leaf === 0 ? 0 : 580 - w;
          return (
            <g key={leaf}>
              <rect x={x0} y={20} width={w} height={410} fill="none" stroke="#1c1f24" strokeWidth={10} />
              {Array.from({length: 9}, (_, i) => <line key={i} x1={x0 + (i + 0.5) * w / 9} y1={20} x2={x0 + (i + 0.5) * w / 9} y2={430} stroke="#1c1f24" strokeWidth={6} />)}
              <line x1={x0} y1={200} x2={x0 + w} y2={200} stroke="#1c1f24" strokeWidth={8} />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 650, background: tone === 'morning' ? 'linear-gradient(#9a958c, #7c776e)' : 'linear-gradient(#2e2c2c, #151414)'}} />
      <div style={{position: 'absolute', left: -700, top: FLOOR + 60, width: W + 1400, height: 8, background: 'repeating-linear-gradient(90deg, rgba(230,220,180,.35) 0 90px, transparent 90px 180px)'}} />
    </>
  );
};

/** looking out through the gate: empty road, poles; `voided` = nothing out there at all */
export const Road: React.FC<{tone: 'dusk' | 'night'; voided?: boolean}> = ({tone, voided}) => (
  <>
    <Sky tone={tone} y={600} />
    {!voided && (
      <svg width={W + 1400} height={600} style={{position: 'absolute', left: -700, top: 300}}>
        {[300, 900, 1500, 2100, 2700].map((x, i) => <g key={x}><rect x={x} y={20 + i * 8} width={12} height={360} fill="#121419" /><path d={`M${x - 600} 80 Q${x - 300} 130 ${x} 60`} stroke="#121419" strokeWidth={3} fill="none" /></g>)}
        <rect x={1900} y={330} width={70} height={50} fill="#1a1c22" /><rect x={1910} y={340} width={20} height={16} fill={tone === 'dusk' ? '#e9b45a' : '#0f1115'} />
      </svg>
    )}
    <svg width={W + 1400} height={700} style={{position: 'absolute', left: -700, top: 640}}>
      <path d={`M0 700 L1500 0 L1700 0 L3400 700 Z`} fill={voided ? '#07080a' : tone === 'dusk' ? '#4a4042' : '#17161a'} />
      {!voided && <path d="M1600 0 L1600 700" stroke="rgba(230,220,180,.25)" strokeWidth={10} strokeDasharray="60 70" />}
    </svg>
    <div style={{position: 'absolute', left: -200, top: -100, width: 330, height: 1300, background: '#cfc6b2', boxShadow: 'inset -20px 0 0 rgba(0,0,0,.2)'}} />
    <div style={{position: 'absolute', left: 1800, top: -100, width: 330, height: 1300, background: '#cfc6b2', boxShadow: 'inset 20px 0 0 rgba(0,0,0,.2)'}} />
  </>
);

/** ศาลา: open pavilion at dusk, tiled roof, white posts, mats */
export const Sala: React.FC = () => (
  <>
    <Sky tone="dusk" y={560} />
    <svg width={W + 1400} height={420} style={{position: 'absolute', left: -700, top: 40}}>
      <path d="M400 330 L1660 40 L2900 330 Z" fill="#7e3a2d" /><path d="M300 380 L1660 120 L3000 380 Z" fill="#9b4a36" />
      <rect x={300} y={376} width={2700} height={26} fill="#d6b45a" />
    </svg>
    {[160, 620, 1080, 1540, 2000].map(x => <div key={x} style={{position: 'absolute', left: x, top: 440, width: 56, height: FLOOR - 440, background: '#e6dcc6', boxShadow: 'inset -10px 0 0 rgba(0,0,0,.12)'}} />)}
    <Boards c0="#7a5a3e" c1="#4a3424" />
    {[250, 700, 1150, 1600].map(x => <div key={x} style={{position: 'absolute', left: x, top: FLOOR + 30, width: 360, height: 60, background: 'repeating-linear-gradient(90deg, #b9a46a 0 10px, #a48f56 10px 20px)', transform: 'skewX(-30deg)'}} />)}
  </>
);

/** night path between kutis: a ตะเคียน tree with red cloth, lamp posts, concrete walk; `mud` darkens the ground */
export const Path: React.FC<{f: number; mud?: number; tree?: boolean}> = ({f, mud = 0}) => {
  const sway = Math.sin(f / 40) * 6;
  return (
    <>
      <Sky tone="night" y={560} />
      <svg width={W + 1400} height={420} style={{position: 'absolute', left: -700, top: 420}}>
        {[200, 900, 1700, 2500].map(x => <g key={x}><path d={`M${x} 160 L${x + 220} 70 L${x + 440} 160 Z`} fill="#2a2228" /><rect x={x + 30} y={160} width={380} height={260} fill="#221e22" /><rect x={x + 180} y={230} width={60} height={70} fill="rgba(255,200,120,.35)" /></g>)}
      </svg>
      <svg width={900} height={1200} style={{position: 'absolute', left: -60, top: -300, transform: `rotate(${sway * 0.1}deg)`, transformOrigin: '300px 1200px'}}>
        <ellipse cx={330} cy={420} rx={420} ry={330} fill="#2b3d33" />
        <ellipse cx={540} cy={330} rx={260} ry={200} fill="#324638" />
        <ellipse cx={200} cy={300} rx={220} ry={160} fill="#26372d" />
        <path d="M270 1200 Q260 900 300 700 L380 700 Q400 900 430 1200 Z" fill="#3a2c22" />
        <path d="M290 1080 Q230 1140 170 1200 M410 1080 Q470 1140 530 1200" stroke="#3a2c22" strokeWidth={26} fill="none" />
        <path d="M300 640 q-10 30 0 60 M360 650 q10 30 -4 60" stroke="#9b3b36" strokeWidth={8} fill="none" opacity={0.6} />
      </svg>
      {[900, 1700].map(x => (
        <React.Fragment key={x}>
          <div style={{position: 'absolute', left: x, top: 380, width: 10, height: FLOOR - 380, background: '#0d0f12'}} />
          <div style={{position: 'absolute', left: x - 14, top: 370, width: 38, height: 22, borderRadius: 8, background: '#ffd890'}} />
          <Glow x={x + 5} y={420} r={380} a={0.3} />
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 650, background: 'linear-gradient(#77746a, #3b3a35)'}} />
      <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 650, background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.25) 0 4px, transparent 4px 260px)'}} />
      {mud > 0 && <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 650, opacity: mud, background: 'linear-gradient(#3b2b1d, #1a120b)'}} />}
      {[900, 1700].map((x, i) => <Cone key={x} x={x + 5} y={392} floor={FLOOR} top={16} spread={240} f={f} a={0.16} dust={16} seed={i + 3} />)}
    </>
  );
};

/** bench outside a temple kitchen at night, bulb over the wall; `tower` shows the bell tower far right */
export const BenchSet: React.FC<{f: number; tower?: boolean}> = ({f, tower}) => (
  <>
    <Sky tone="night" y={540} />
    {tower && <TowerShape x={1640} y={140} s={0.55} f={f} far />}
    <div style={{position: 'absolute', left: 1180, top: 640, width: 1500, height: FLOOR - 640, background: '#6d685e', boxShadow: 'inset 0 14px 0 rgba(0,0,0,.2)'}} />
    <div style={{position: 'absolute', left: -700, top: 180, width: 1900, height: FLOOR - 180, background: '#b9ad92'}} />
    <div style={{position: 'absolute', left: -700, top: 560, width: 1900, height: FLOOR - 560, background: '#4f685a'}} />
    <div style={{position: 'absolute', left: -700, top: 150, width: 1980, height: 50, background: '#3a2a20'}} />
    <div style={{position: 'absolute', left: 300, top: 300, width: 200, height: 180, background: '#1a2230', boxShadow: `inset 0 0 0 12px ${WOOD.wood1}`}} />
    <div style={{position: 'absolute', left: 1000, top: 200, width: 4, height: 80, background: '#111'}} />
    <div style={{position: 'absolute', left: 984, top: 276, width: 36, height: 44, borderRadius: '45%', background: '#ffd890'}} />
    <Glow x={1002} y={300} r={800} a={0.36} />
    <div style={{position: 'absolute', left: 700, top: 800, width: 640, height: 26, background: WOOD.wood2, borderRadius: 6}} />
    {[730, 1290].map(x => <div key={x} style={{position: 'absolute', left: x, top: 826, width: 22, height: FLOOR - 826, background: WOOD.wood1}} />)}
    <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 650, background: 'linear-gradient(#55524b, #2a2925)'}} />
  </>
);

/** หอระฆัง: bell tower; `swing` rocks the bell, `ropeSwing` the rope, `far` = blurred navy silhouette */
export const TowerShape: React.FC<{x: number; y: number; s?: number; f: number; swing?: number; far?: boolean; ropeSwing?: number}> = ({x, y, s = 1, f, swing = 0, far, ropeSwing = 0}) => {
  const a = Math.sin(f / 6) * swing;
  const ra = Math.sin(f / 22) * ropeSwing;
  const col = far ? '#26304a' : undefined;
  return (
    <svg width={700 * s} height={900 * s} viewBox="0 0 700 900" style={{position: 'absolute', left: x - 350 * s, top: y, overflow: 'visible', filter: far ? 'blur(1.5px)' : undefined}}>
      <path d="M120 170 L350 20 L580 170 Z" fill={col ?? '#8a3a2c'} />
      <rect x={140} y={170} width={420} height={20} fill={col ?? '#d6b45a'} />
      {[160, 520].map(px => <rect key={px} x={px} y={190} width={30} height={330} fill={col ?? '#6a4b31'} />)}
      <rect x={100} y={520} width={500} height={380} fill={col ?? '#b8a786'} />
      <path d="M100 520 H600 M100 600 H600 M100 680 H600 M100 760 H600" stroke={col ?? 'rgba(0,0,0,.12)'} strokeWidth={4} />
      <g transform={`rotate(${a} 350 200)`}>
        <rect x={340} y={190} width={20} height={30} fill={col ?? '#3a3a36'} />
        <path d="M270 330 Q270 220 350 220 Q430 220 430 330 L445 360 H255 Z" fill={col ?? '#b8892c'} />
        <rect x={255} y={350} width={190} height={14} fill={col ?? '#8c6a20'} />
      </g>
      <path d={`M350 364 Q${350 + ra * 6} 520 ${350 + ra * 14} 680`} stroke={col ?? '#c8a165'} strokeWidth={8} fill="none" />
    </svg>
  );
};

/** บ่อน้ำเก่า: old brick well with an iron grate, banana leaves, wet leaves round the rim */
export const WellSet: React.FC<{f: number; beam?: number; flashGround?: boolean}> = ({f}) => (
  <>
    <Sky tone="night" y={500} />
    <Glow x={1500} y={120} r={700} color="200,215,240" a={0.25} />
    <div style={{position: 'absolute', left: -700, top: 420, width: W + 1400, height: 520, background: '#5d5a52'}} />
    {Array.from({length: 7}, (_, i) => (
      <svg key={i} width={420} height={520} style={{position: 'absolute', left: -200 + i * 360, top: 120 + (i % 2) * 40, transform: `rotate(${Math.sin(f / 50 + i) * 2}deg)`, transformOrigin: '210px 520px'}}>
        <path d="M210 520 V200" stroke="#121812" strokeWidth={18} /><path d="M210 260 Q40 160 10 40 Q160 90 210 220 Z M210 240 Q380 120 410 20 Q260 70 210 200 Z" fill="#101a12" />
      </svg>
    ))}
    <svg width={700} height={420} style={{position: 'absolute', left: 1100 - 350, top: FLOOR - 300}}>
      <ellipse cx={350} cy={110} rx={300} ry={70} fill="#0a0b0c" />
      <path d="M50 110 V300 Q350 380 650 300 V110 Q350 190 50 110 Z" fill="#7a5a48" />
      {Array.from({length: 5}, (_, r) => <path key={r} d={`M50 ${140 + r * 34} Q350 ${220 + r * 34} 650 ${140 + r * 34}`} stroke="#5a4033" strokeWidth={4} fill="none" />)}
      <ellipse cx={350} cy={110} rx={300} ry={70} fill="none" stroke="#8c6a55" strokeWidth={22} />
      {Array.from({length: 9}, (_, i) => <line key={i} x1={90 + i * 65} y1={60} x2={90 + i * 65} y2={165} stroke="#3a2a22" strokeWidth={8} />)}
      <line x1={60} y1={110} x2={640} y2={110} stroke="#3a2a22" strokeWidth={10} />
    </svg>
    <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 650, background: 'linear-gradient(#57544a, #2b2a25)'}} />
    {Array.from({length: 14}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: 800 + rnd(31, i) * 600, top: FLOOR + 10 + rnd(32, i) * 70, width: 40, height: 18, borderRadius: '50%',
        background: '#3d4a2a', transform: `rotate(${rnd(33, i) * 180}deg)`, boxShadow: '0 0 8px rgba(160,190,210,.35)'}} />
    ))}
  </>
);

/** covered walkway between kutis: plank wall, doors, posts, a flickering bulb; `drip` wets the boards */
export const Corridor: React.FC<{f: number; drip?: number}> = ({f, drip = 0}) => (
  <>
    <Sky tone="night" y={420} />
    <div style={{position: 'absolute', left: -700, top: 120, width: W + 1400, height: 90, background: '#1a120d'}} />
    <Planks y={210} h={FLOOR - 210} c0="#4f3826" c1="#2a1d13" />
    {[60, 760, 1460, 2160].map(x => (
      <div key={x} style={{position: 'absolute', left: x, top: 400, width: 220, height: FLOOR - 400, background: '#2a1d13', boxShadow: 'inset 0 0 0 10px #1a120c'}} />
    ))}
    {[-120, 520, 1180, 1840].map(x => <div key={x} style={{position: 'absolute', left: x, top: 200, width: 40, height: FLOOR - 200, background: '#3a2a1c'}} />)}
    <Boards c0="#4a3527" c1="#211811" wet={drip * 0.35} />
    <div style={{position: 'absolute', left: 300, top: 260, width: 4, height: 60, background: '#111'}} />
    <div style={{position: 'absolute', left: 286, top: 316, width: 32, height: 40, borderRadius: '45%', background: '#ffd890', opacity: flicker(f, 41, 0.3)}} />
    <Glow x={302} y={340} r={700} a={0.3 * flicker(f, 41, 0.3)} />
  </>
);
