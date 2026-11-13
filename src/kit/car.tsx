import React from 'react';
import {rnd} from '../engine/anim';
import {W, full} from './world';

// Inside a right-hand-drive Thai saloon (first used by same-child). World 1920×1080, overscan like the other sets.
//
//   view 'seat'  the passenger seat seen from the driver's side: headrest, backrest with bolsters and fresh stitching,
//                cushion, glove box, B-pillar with the seatbelt, door panel, morning light through the side window.
//   view 'drive' the cabin seen from the front through the windscreen: driver's seat at the left-centre, passenger seat at the right,
//                side mirror outside the left A-pillar, dashboard along the bottom. See DRIVER below for where the actor goes.
//
// night = dark glass, lit gauges. moving = trees slide past (drive only).

const LINE = '#1e232b';

const Outside: React.FC<{f: number; night?: boolean; moving?: boolean; morning?: boolean}> = ({f, night, moving, morning}) => {
  const slide = moving ? (f * 6) % 600 : 0;
  if (night) return <div style={full('linear-gradient(#060914 0%, #0e1630 55%, #141a24 56%, #0a0c10 100%)')} />;
  return (
    <>
      <div style={full(morning ? 'linear-gradient(#cfe0ea 0%, #e9eadf 60%, #c9d2b8 100%)' : 'linear-gradient(#a8cfe8 0%, #dcebf2 48%, #9cc07a 49%, #6f9a52 100%)')} />
      <svg width={W + 1400} height={1080} style={{position: 'absolute', left: -700, top: 0}}>
        {/* far hills + the winding road */}
        <path d="M0 470 Q400 400 800 450 T1600 440 T2400 450 T3320 440 V560 H0Z" fill={morning ? '#b9c9a6' : '#7fa864'} />
        {!morning && <path d="M700 560 Q980 470 1200 450 Q1330 444 1400 448 L1430 452 Q1300 470 1120 560Z" fill="#6c6c6a" />}
        {!morning && <path d="M760 560 Q1000 482 1210 457" stroke="#f2c94c" strokeWidth="6" fill="none" />}
        {/* trees passing */}
        {Array.from({length: 16}, (_, i) => {
          const x = ((i * 230 - slide) % 3600 + 3600) % 3600 - 100;
          const h = 160 + rnd(5, i) * 160, palm = i % 3 === 0;
          return palm ? (
            <g key={i} transform={`translate(${x} ${470})`}>
              <path d={`M0 0 Q6 ${-h / 2} 2 ${-h}`} stroke="#6a5a3a" strokeWidth="8" fill="none" />
              {[0, 60, 120, 180, 240, 300].map(a => <ellipse key={a} cx={2} cy={-h} rx="46" ry="12" transform={`rotate(${a} 2 ${-h})`} fill={morning ? '#9fb88a' : '#3f7a3a'} />)}
            </g>
          ) : (
            <g key={i} transform={`translate(${x} ${480})`}>
              <rect x="-6" y={-h * 0.5} width="12" height={h * 0.5} fill="#5a4a32" />
              <circle cx="0" cy={-h * 0.6} r={h * 0.32} fill={morning ? '#a8c290' : i % 2 ? '#3d7038' : '#4f8a42'} />
            </g>
          );
        })}
      </svg>
    </>
  );
};

/** passenger seat close-up (the seat Phak just had re-covered) */
const SeatView: React.FC<{f: number; night?: boolean; seat?: 'new' | 'torn'}> = ({f, night, seat = 'new'}) => {
  const fab = '#4d5a6c', fabL = '#5f6d80', fabD = '#38424f';
  const stitch = seat === 'new' ? 'rgba(214,222,234,.75)' : 'rgba(150,150,150,.4)';
  return (
    <>
      <Outside f={f} night={night} morning />
      <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {/* cabin below the glass line */}
        <rect x="-700" y="500" width="3320" height="800" fill={night ? '#12151a' : '#2a3038'} />
        {/* roof lining */}
        <path d="M-700 -500 H2620 V40 Q960 0 -700 90Z" fill="#8a929c" />
        {/* dashboard + glove box (left) */}
        <path d="M-700 220 Q100 200 600 250 L640 560 L-700 620Z" fill="#3a4250" />
        <path d="M-700 220 Q100 200 600 250 L605 290 Q100 245 -700 270Z" fill="#2c333e" />
        <rect x="120" y="360" width="400" height="120" rx="18" fill="#343c48" stroke={LINE} strokeWidth="4" />
        <rect x="430" y="400" width="60" height="18" rx="6" fill="#1e232b" />
        <path d="M-700 420 Q20 390 60 460 L70 640 L-700 680Z" fill="#2c333e" />
        <rect x="-10" y="300" width="70" height="44" rx="10" fill="#1a1e26" />
        {/* side window frame + B-pillar with the seatbelt */}
        <path d="M650 20 L1920 0 L1920 470 Q1300 500 700 520Z" fill="none" stroke="#3a4250" strokeWidth="18" />
        <rect x="860" y="0" width="90" height="600" fill="#5a6470" stroke={LINE} strokeWidth="4" />
        <rect x="880" y="120" width="40" height="80" rx="8" fill="#3a3f48" />
        <path d="M900 190 L900 560" stroke="#2a2e36" strokeWidth="26" />
        <rect x="880" y="470" width="42" height="56" rx="8" fill="#9aa0a8" stroke={LINE} strokeWidth="3" />
        {/* door panel (right) */}
        <path d="M950 470 Q1400 450 1980 430 L1980 1180 L950 1180Z" fill="#3a4250" />
        <path d="M1000 600 Q1450 580 1980 560 L1980 660 Q1450 680 1010 700Z" fill="#4a5462" />
        <path d="M1380 650 Q1500 640 1640 600 Q1660 640 1620 660 Q1500 690 1390 690Z" fill="#c9ced6" stroke={LINE} strokeWidth="4" />
        <rect x="1560" y="560" width="120" height="40" rx="12" fill="#2a3038" stroke="#8a929c" strokeWidth="3" />
        <path d="M1100 860 H1980" stroke="#2c333e" strokeWidth="10" />
        {/* the seat */}
        <g stroke={LINE} strokeWidth="5" strokeLinejoin="round">
          {/* headrest + posts */}
          <rect x="565" y="230" width="22" height="70" fill="#9aa0a8" />
          <rect x="705" y="230" width="22" height="70" fill="#9aa0a8" />
          <path d="M520 110 Q646 70 772 110 L782 230 Q646 262 510 230Z" fill={fabL} />
          {/* backrest: bolsters + centre insert */}
          <path d="M440 300 Q646 262 852 300 L880 640 Q646 700 410 640Z" fill={fab} />
          <path d="M520 330 Q646 306 772 330 L790 600 Q646 640 502 600Z" fill={fabL} />
          {/* cushion */}
          <path d="M360 640 Q646 690 940 640 L1060 760 Q980 860 640 880 Q360 870 300 790Z" fill={fab} />
          <path d="M430 680 Q646 720 880 680 L960 760 Q860 820 640 830 Q440 820 400 770Z" fill={fabL} />
          <path d="M300 790 Q360 870 640 880 Q980 860 1060 760 L1060 820 Q980 930 640 950 Q340 940 300 860Z" fill={fabD} />
        </g>
        {/* fresh stitching */}
        <g fill="none" stroke={stitch} strokeWidth="3" strokeDasharray="10 8">
          <path d="M530 124 Q646 92 762 124" />
          <path d="M534 344 Q646 322 758 344 L774 590 Q646 624 518 590Z" />
          <path d="M446 696 Q646 732 870 696 L940 760 Q850 808 640 816 Q456 808 416 768Z" />
        </g>
        {seat === 'torn' && <path d="M800 700 q20 -40 50 -10 q-20 30 10 60" stroke="#b8bcc4" strokeWidth="6" fill="none" />}
        {/* floor + console edge */}
        <path d="M-700 900 L300 860 Q640 960 1000 900 L1980 1000 V1600 H-700Z" fill="#1e232b" />
        <path d="M-700 760 Q-200 760 120 820 L80 1600 H-700Z" fill="#2c333e" />
      </svg>
      {/* low morning sun through the side glass */}
      {!night && <div style={{position: 'absolute', left: 1000, top: -100, width: 900, height: 900, background: 'linear-gradient(160deg, rgba(255,240,200,.35), rgba(255,240,200,0) 60%)', pointerEvents: 'none'}} />}
    </>
  );
};

/** the cabin seen from the front through the windscreen (reference: driver at the left-centre, passenger seat at the right,
 *  side mirror outside the left A-pillar, dashboard along the bottom). World px; the driver actor goes at x≈740 on a STAND
 *  pose, floor 1225, pxPerCm 5.81, with `arm=b-wheel prop=wheel` when he is driving. Draw <CarWheel /> first (behind him)
 *  when he is not holding the wheel, and <CarKnee /> last to hide his legs. */
export const DRIVER = {x: 740, floor: 1225, pxPerCm: 5.81} as const;

const DriveView: React.FC<{f: number; night?: boolean; moving?: boolean}> = ({f, night, moving}) => {
  const slide = moving ? (f * 3) % 520 : 0;
  const cabin = night ? '#161b2b' : '#3a4352';
  const seat = night ? '#2b2923' : '#6a6458';
  const seatL = night ? '#34312a' : '#7a7466';
  const pillar = night ? '#8f8a78' : '#d8d2bc';
  return (
    <>
      {/* outside: sky, hills, ground */}
      <div style={full(night ? 'linear-gradient(#04060d 0%, #0b1330 55%, #121722 100%)' : 'linear-gradient(#a8cfe8 0%, #dcebf2 58%, #cfe0c0 100%)')} />
      <svg width={W + 1400} height={1080} style={{position: 'absolute', left: -700, top: 0}}>
        <g transform={`translate(${-slide} 0)`}>
          {Array.from({length: 14}, (_, i) => (
            <path key={i} d={`M${i * 260 - 200} 1080 Q${i * 260 - 60} ${690 - (i % 3) * 50} ${i * 260 + 80} 1080Z`} fill={night ? '#080c16' : i % 2 ? '#7fa864' : '#6c9a55'} />
          ))}
        </g>
      </svg>
      <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {/* side mirror outside the left A-pillar */}
        <rect x="344" y="498" width="160" height="108" rx="22" fill={night ? '#14192a' : '#2a2f3a'} stroke={LINE} strokeWidth="6" />
        <rect x="360" y="512" width="128" height="78" rx="14" fill={night ? '#243a66' : '#8fb4d4'} />
        <path d="M372 580 L430 520 L470 520 L400 584Z" fill="rgba(255,255,255,.18)" />
        {/* cabin behind the glass */}
        <polygon points="430,-10 1608,-10 1571,842 525,842" fill={cabin} />
        {/* rear window */}
        <rect x="612" y="39" width="810" height="284" rx="40" fill={night ? '#10152a' : '#b7d3e6'} stroke={night ? '#0a0e1c' : '#7a8896'} strokeWidth="8" />
        {!night && <rect x="640" y="60" width="760" height="120" rx="30" fill="rgba(255,255,255,.22)" />}
        {/* passenger seat (right) */}
        <g stroke={LINE} strokeWidth="5" strokeLinejoin="round">
          <rect x="1260" y="268" width="24" height="40" fill="#6a6f78" /><rect x="1304" y="268" width="24" height="40" fill="#6a6f78" />
          <path d="M1210 190 Q1294 170 1378 190 L1384 282 Q1294 296 1204 282Z" fill={seatL} />
          <path d="M1107 300 Q1294 272 1483 300 L1500 842 L1090 842Z" fill={seat} />
          <path d="M1130 330 Q1294 306 1460 330 L1472 830 L1120 830Z" fill={seatL} opacity=".7" />
        </g>
        <path d="M1130 504 Q1294 488 1462 504 M1128 650 Q1294 636 1464 650" stroke="rgba(0,0,0,.35)" strokeWidth="5" fill="none" />
        {/* driver's seat back behind the actor */}
        <g stroke={LINE} strokeWidth="5" strokeLinejoin="round">
          <rect x="690" y="236" width="22" height="44" fill="#6a6f78" /><rect x="770" y="236" width="22" height="44" fill="#6a6f78" />
          <path d="M555 285 Q741 262 927 285 L950 842 L525 842Z" fill={seat} />
        </g>
        {/* A-pillars */}
        <polygon points="335,-10 430,-10 525,842 480,842" fill={pillar} stroke={LINE} strokeWidth="4" />
        <polygon points="1608,-10 1700,-10 1571,842 1510,842" fill={pillar} stroke={LINE} strokeWidth="4" />
        {/* windscreen reflection */}
        <polygon points="560,0 760,0 640,842 560,842" fill="rgba(255,255,255,.06)" />
        <polygon points="1000,0 1100,0 960,842 900,842" fill="rgba(255,255,255,.04)" />
        {/* dashboard along the bottom */}
        <rect x="-700" y="842" width="3320" height="500" fill={night ? '#0c0f18' : '#23272f'} />
        <path d="M-700 842 H2620" stroke={night ? '#1e2434' : '#3e4552'} strokeWidth="14" />
        <path d="M600 842 Q740 812 900 842 L890 884 L610 884Z" fill="#1a1e26" stroke={LINE} strokeWidth="4" />
        {[702, 776].map(cx => (
          <g key={cx}>
            <circle cx={cx} cy={866} r={27} fill="#0a0c10" stroke="#8a8f96" strokeWidth="3" />
            <line x1={cx} y1={866} x2={cx + Math.cos(Math.PI * (moving ? 1.35 : 0.85)) * 20} y2={866 + Math.sin(Math.PI * (moving ? 1.35 : 0.85)) * 20} stroke={night ? '#ffb070' : '#e5383b'} strokeWidth="3" />
          </g>
        ))}
        <rect x="967" y="872" width="152" height="38" rx="8" fill="#14171d" stroke="#3a3f4a" strokeWidth="3" />
        <rect x="1000" y="884" width="86" height="12" rx="3" fill={night ? '#3d7a5a' : '#2f5a46'} />
        <rect x="1205" y="893" width="268" height="94" rx="10" fill="none" stroke={night ? '#1e2434' : '#3a3f4a'} strokeWidth="5" />
      </svg>
      {night && <div style={{position: 'absolute', left: 620, top: 800, width: 300, height: 140, borderRadius: '50%', background: 'radial-gradient(rgba(255,170,100,.28), rgba(255,170,100,0) 70%)'}} />}
    </>
  );
};

export const CarInterior: React.FC<{view: 'seat' | 'drive'; f: number; seat?: 'new' | 'torn'; night?: boolean; moving?: boolean}> = ({view, f, seat, night, moving}) =>
  view === 'seat' ? <SeatView f={f} night={night} seat={seat} /> : <DriveView f={f} night={night} moving={moving} />;

/** a steering wheel drawn BEHIND the driver, for when he sits at the wheel without holding it (phone, notebook); when he is
 *  driving use `arm=b-wheel prop=wheel` on the actor instead (the wheel is part of the pose). */
export const CarWheel: React.FC<{night?: boolean}> = ({night}) => (
  <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
    <g transform="translate(743 877)">
      <ellipse rx="198" ry="125" fill="none" stroke={night ? '#0a0c10' : '#16181c'} strokeWidth="34" />
      <ellipse rx="198" ry="125" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="4" />
      <path d="M-176 20 Q0 70 176 20" stroke={night ? '#0a0c10' : '#16181c'} strokeWidth="26" fill="none" />
      <path d="M0 40 L0 160" stroke={night ? '#0a0c10' : '#16181c'} strokeWidth="30" />
      <ellipse cx="0" cy="30" rx="56" ry="40" fill="#252a31" stroke="#3a3f48" strokeWidth="4" />
    </g>
  </svg>
);

/** the dash / knee panel in front of the driver's lower body: hides his legs and the foot of the wheel */
export const CarKnee: React.FC<{night?: boolean}> = ({night}) => (
  <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
    <path d="M-700 1000 Q300 975 743 968 Q1200 975 2620 1000 V1400 H-700Z" fill={night ? '#080a10' : '#1a1d24'} />
    <path d="M-700 1000 Q300 975 743 968 Q1200 975 2620 1000" stroke={night ? '#161b28' : '#343a46'} strokeWidth="10" fill="none" />
  </svg>
);
