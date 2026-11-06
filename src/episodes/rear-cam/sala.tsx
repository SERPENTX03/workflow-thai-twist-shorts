import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {Stage} from '../../kit/stage';
import {CemeteryGate, CemeteryRoad, Grave, Headlight, RoadsideMemorial, Sala8, Tamarind, type CemTone} from '../../kit/cemetery';
import {Dapple, SunRake} from '../../kit/hut';
import {full} from '../../kit/world';
import {Shoulder} from './station';
import {Haze} from '../../kit/depth';
import {Grain} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {Actors, aimData, C, JayBike} from './cast';
import {NIGHT} from './night';

// Nights 1–2 at the cemetery (CH3–4): the sala at the people's scale, with Jay's bike parked nose-out and its
// headlight the one light (HEAD_SALA), the road's other angles, and the shop's close-ups.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const toneOf = (d: Record<string, any>): CemTone => (d.light === 'day' ? 'day' : d.light === 'dawn' ? 'dawn' : 'night');
const K = (p: ShotProps) => kf(p.f, [[0, 0], [p.len, 1]]);

const Plate: React.FC<{p: ShotProps; children: React.ReactNode; bg?: string; glow?: string; z?: number}> = ({p, children, bg = '#06070a', glow, z = 1.05}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
    {glow && <div style={{position: 'absolute', inset: 0, background: glow}} />}
    <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + (z - 1) * K(p)})`, filter: D(p).past || D(p).recall ? 'saturate(.35) sepia(.3) brightness(.9)' : undefined}}>{children}</div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)'}} />
    <Grain f={p.f} opacity={0.12} />
  </AbsoluteFill>
);
const HEADLAMP = 'radial-gradient(ellipse at 10% 60%, rgba(255,240,200,.38), rgba(0,0,0,0) 70%)';
const DAYLIGHT = 'radial-gradient(ellipse at 0% 0%, rgba(255,245,215,.55), rgba(0,0,0,0) 75%)';

// ---------------------------------------------------------------- the sala, inside, at the people's scale

/** sala floor at the actors' floor; the table top at ~y 717. Jay's bike parked frame left, nose out (facing left),
 *  its headlight across the gravel toward the road */
const SalaWorld: React.FC<{p: ShotProps; box?: 'none' | 'placed' | 'open' | 'can'; bike?: boolean}> = ({p, box = 'placed', bike = true}) => {
  const d = D(p);
  const t = toneOf(d);
  return (
    <>
      <CemeteryRoad f={p.f} tone={t} horizon={560} vx={1000} road={false} fog={d.fog === 'thick' ? 'thick' : true} />
      {t === 'night' && <div style={{position: 'absolute', left: 200, top: 160, width: 1600, height: 800, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,165,195,.3), rgba(150,165,195,0) 68%)'}} />}
      <Sala8 x={1000} y={990} s={1.3} tone={t} box={box} lit={t === 'night' ? 0.8 : 0} />
      {/* the mud path behind the sala to the shortcut, frame right */}
      <svg width={900} height={400} viewBox="0 0 900 400" style={{position: 'absolute', left: 1500, top: 620}}>
        <path d="M0 400 Q300 200 900 120 L900 180 Q340 260 140 400 Z" fill={t === 'day' ? '#6a5236' : '#1c1610'} />
      </svg>
      {bike && t === 'night' && (
        <>
          <Headlight x={170} y={760} angle={186} len={900} spread={18} a={0.4} />
          <div style={{position: 'absolute', left: -600, top: 500, width: 1500, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,240,200,.2), rgba(0,0,0,0) 65%)'}} />
        </>
      )}
      <Haze y={860} h={220} f={p.f} a={0.16} />
      <Actors p={p} flipBike box={false} headlight={t === 'night'} helmeted={t === 'night'} />
    </>
  );
};

const SalaScene: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const v = p.shot.view ?? 'fog-wide';
  const t = toneOf(d);
  const k = K(p);
  if (v === 'fog-wide' || v === 'day-wide') return NIGHT.sala(p0);
  if (v === 'table-top' || v === 'table-can-ins') {
    const placing = d.box === 'placing';
    const can = !!d.can;
    return (
      <Plate p={p} bg="#08090b" glow={t === 'night' ? HEADLAMP : DAYLIGHT}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* the marble disc seen from straight above, old candle wax, the headlight raking from frame left */}
          <circle cx="960" cy="540" r="470" fill={t === 'night' ? '#7a7c80' : t === 'dawn' ? '#b5ae9e' : '#ecebe6'} stroke="#2a2a2c" strokeWidth="10" />
          {Array.from({length: 7}, (_, i) => <path key={i} d={`M${700 + rnd(141, i) * 500} ${300 + rnd(142, i) * 480} q${40 + rnd(143, i) * 80} ${-20 + rnd(144, i) * 40} ${100 + rnd(145, i) * 60} ${rnd(146, i) * 30}`} stroke="rgba(90,90,96,.35)" strokeWidth="6" fill="none" />)}
          {Array.from({length: 9}, (_, i) => <circle key={'w' + i} cx={650 + rnd(147, i) * 600} cy={300 + rnd(148, i) * 500} r={8 + rnd(149, i) * 22} fill="rgba(240,232,210,.6)" />)}
          {can ? (
            <g>
              <ellipse cx="1060" cy="560" rx="120" ry="40" fill="rgba(0,0,0,.35)" transform="rotate(-8 1060 560)" />
              <circle cx="960" cy="540" r="62" fill="#c0392b" stroke="#5a1a14" strokeWidth="6" />
              <circle cx="960" cy="540" r="40" fill="#d8dde3" />
              <rect x="950" y="520" width="20" height="10" rx="4" fill="#9aa2ac" />
              {Array.from({length: 10}, (_, i) => <circle key={i} cx={900 + rnd(151, i) * 120} cy={480 + rnd(152, i) * 120} r={3 + rnd(153, i) * 4} fill="rgba(255,255,255,.7)" />)}
            </g>
          ) : (
            <g transform={`translate(${placing ? 0 : 0} ${placing ? (1 - Math.min(1, k * 2)) * -80 : 0})`}>
              <polygon points="1030,560 1500,520 1520,640 1050,700" fill="rgba(0,0,0,.4)" />
              <rect x="760" y="430" width="380" height="240" rx="12" fill="#f3f0e8" stroke="#a8a294" strokeWidth="6" />
              {[0, 1, 2].map(i => <rect key={i} x="760" y={470 + i * 70} width="380" height="30" fill="#0d0d0d" />)}
            </g>
          )}
        </svg>
        {placing && <Hand x={1240} y={500 - (1 - Math.min(1, k * 2)) * 80} s={1.4} rot={190} skin={C.skin} sleeve="#21466b" mode="open" />}
      </Plate>
    );
  }
  if (v === 'mud-macro') {
    const dry = t === 'day';
    return (
      <Plate p={p} bg={dry ? '#4a3a26' : '#0c0a08'} glow={dry ? DAYLIGHT : HEADLAMP}>
        <div style={{position: 'absolute', inset: 0, background: dry ? 'linear-gradient(#6a5236, #4a3a26)' : 'linear-gradient(#2a2016, #120e0a)'}} />
        {!dry && <div style={{position: 'absolute', left: 80, top: 260, width: 1700, height: 820, borderRadius: '50%', background: 'radial-gradient(ellipse at 45% 60%, rgba(150,118,80,.9), rgba(90,70,48,.5) 40%, rgba(0,0,0,0) 72%)'}} />}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {dry && Array.from({length: 40}, (_, i) => <path key={i} d={`M${rnd(161, i) * 1920} ${rnd(162, i) * 1080} l${(rnd(163, i) - 0.5) * 200} ${(rnd(164, i) - 0.5) * 200}`} stroke="#3a2a18" strokeWidth="4" />)}
          {/* herringbone tread, curving away toward the path behind the sala; several layers when dry (every night) */}
          {(dry ? [-120, 0, 110, 210] : [0]).map((off, L) => (
            <g key={L} opacity={L ? 0.5 : 1} transform={`translate(${off} ${off * 0.3})`}>
              {Array.from({length: 24}, (_, i) => {
                const x = 120 + i * 78, y = 820 - i * 22 - Math.sin(i / 5) * 40;
                return <path key={i} d={`M${x - 40} ${y - 30} L${x} ${y} L${x - 40} ${y + 30}`} stroke={dry ? '#2e2214' : '#050403'} strokeWidth="16" fill="none" strokeLinecap="round" />;
              })}
            </g>
          ))}
          {!dry && Array.from({length: 18}, (_, i) => <ellipse key={i} cx={150 + i * 100} cy={830 - i * 26} rx="24" ry="8" fill="rgba(190,200,210,.25)" />)}
        </svg>
      </Plate>
    );
  }
  if (v === 'step-low') {
    return (
      <Plate p={p} bg="#060708" glow={HEADLAMP}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* three steps at lens height, moss on the third; a sneaker landing on it; the box held above, out of frame top */}
          {[0, 1, 2].map(i => <rect key={i} x="-40" y={820 - i * 180} width="2000" height="190" fill={['#3a3a3c', '#333335', '#2c2c2e'][i]} stroke="#111" strokeWidth="6" />)}
          {Array.from({length: 26}, (_, i) => <ellipse key={i} cx={rnd(171, i) * 1920} cy={470 + rnd(172, i) * 30} rx={30 + rnd(173, i) * 50} ry="10" fill="#2f4a2a" opacity=".8" />)}
          <path d="M700 520 Q900 430 1160 470 L1180 560 L680 580 Z" fill="#e8e6e0" />
          <path d="M680 580 L1180 560" stroke="#9a2a2a" strokeWidth="18" />
          <rect x="560" y="-40" width="560" height="300" fill="#f3f0e8" stroke="#a8a294" strokeWidth="6" />
          {[0, 1, 2].map(i => <rect key={i} x={620 + i * 150} y="-40" width="44" height="300" fill="#0d0d0d" />)}
        </svg>
      </Plate>
    );
  }
  if (v === 'trip-wide') {
    // inside the sala, Jay a black shape against his own headlight, pitching forward; the box leaving his hands
    return (
      <Stage p={p} light="night" cam={d.cam ?? [1, 1.05, 960, 540]} world={
        <>
          <SalaWorld p={{...p, shot: {...p.shot, data: {...d, cast: []}}}} box="none" />
          <svg width={420} height={560} viewBox="0 0 420 560" style={{position: 'absolute', left: 700, top: 420, transform: 'rotate(24deg)', transformOrigin: '50% 100%'}}>
            <circle cx="210" cy="70" r="66" fill="#040405" />
            <path d="M150 140 L270 140 L300 380 L120 380 Z" fill="#040405" />
            <path d="M150 380 L90 550 M270 380 L360 520" stroke="#040405" strokeWidth="44" strokeLinecap="round" />
            <path d="M270 170 L400 120" stroke="#040405" strokeWidth="40" strokeLinecap="round" />
          </svg>
          <div style={{position: 'absolute', left: 1080 + k * 40, top: 560 + k * 80, width: 160, height: 100, borderRadius: 6, background: '#f3f0e8', transform: `rotate(${20 + k * 30}deg)`,
            boxShadow: '0 0 0 4px #0d0d0d inset'}} />
        </>
      } />
    );
  }
  if (v === 'tape-ecu') {
    return (
      <Plate p={p} bg="#070708" glow={HEADLAMP} z={1.08}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <rect x="-40" y="360" width="2000" height="760" fill="#f3f0e8" />
          <rect x="-40" y="300" width="2000" height="80" fill="#e6e2d8" transform={`rotate(${-3 - K(p) * 3} 960 340)`} />
          {/* the lid lifting into a gap, light falling into it */}
          <polygon points="-40,382 1960,372 1960,420 -40,430" fill="#0a0a0a" />
          <polygon points="200,390 1700,384 1600,430 300,436" fill="rgba(255,236,190,.25)" />
          {[0, 1].map(i => <rect key={i} x="-40" y={560 + i * 220} width="2000" height="90" fill="#0d0d0d" />)}
          {/* the torn wrap springing loose */}
          <path d={`M600 340 Q800 ${200 - K(p) * 80} 1100 ${150 - K(p) * 60}`} stroke="#0d0d0d" strokeWidth="60" fill="none" strokeLinecap="round" />
          <path d="M600 340 l-20 40 l30 -10 l10 40 l20 -50" fill="#0d0d0d" />
        </svg>
      </Plate>
    );
  }
  if (v === 'box-open-ecu') {
    return (
      <Plate p={p} bg="#030303" z={1.07}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* inside the gap: the fried rice in plastic, and under it the curve of an old gold bangle catching the headlight */}
          <rect x="-40" y="-40" width="2000" height="1160" fill="#0b0a08" />
          <path d="M-40 300 L1960 260 L1960 360 L-40 400 Z" fill="#f3f0e8" />
          <ellipse cx="760" cy="560" rx="560" ry="200" fill="#c89a4a" opacity=".55" />
          <ellipse cx="760" cy="560" rx="560" ry="200" fill="rgba(255,255,255,.2)" />
          <path d="M300 520 Q760 440 1220 520" stroke="rgba(255,255,255,.5)" strokeWidth="10" fill="none" />
          <ellipse cx="1300" cy="760" rx="380" ry="170" fill="none" stroke="#d4a017" strokeWidth="70" />
          <ellipse cx="1300" cy="760" rx="380" ry="170" fill="none" stroke="#ffe27a" strokeWidth="18" strokeDasharray="40 30" />
          {[[1080, 660], [1500, 690], [1600, 820]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="14" fill="#fff8d0" opacity={(i + Math.floor(p.f / 6)) % 3 ? 1 : 0.3} />)}
        </svg>
        <div style={{position: 'absolute', left: 900, top: 520, width: 900, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,215,90,.35), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen'}} />
      </Plate>
    );
  }
  if (v === 'tag-macro') {
    return (
      <Plate p={p} bg="#050505" glow={HEADLAMP} z={1.06}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <ellipse cx="1500" cy="300" rx="700" ry="260" fill="none" stroke="#d4a017" strokeWidth="110" />
          <path d="M1100 380 Q1000 500 960 600" stroke="#b89a6a" strokeWidth="10" fill="none" />
          <g transform="rotate(-8 900 720)">
            <rect x="560" y="580" width="700" height="300" rx="20" fill="#c8a678" stroke="#7a5a38" strokeWidth="6" />
            <circle cx="620" cy="640" r="22" fill="#050505" />
            <text x="920" y="770" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="120" fill="#2a1a0a">ท.0417</text>
            {/* half a museum stamp */}
            <circle cx="1220" cy="840" r="110" fill="none" stroke="rgba(150,30,30,.7)" strokeWidth="10" />
            <text x="1160" y="860" fontSize="34" fill="rgba(150,30,30,.75)" fontFamily="Plex Thai, sans-serif">พิพิธภัณฑ์</text>
          </g>
        </svg>
      </Plate>
    );
  }
  if (v === 'rewrap-ecu') {
    const turns = Math.min(4, Math.floor(K(p) * 4.5));
    return (
      <Plate p={p} bg="#060606" glow={HEADLAMP}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <rect x="360" y="380" width="1200" height="560" rx="20" fill="#f3f0e8" stroke="#a8a294" strokeWidth="8" />
          {Array.from({length: turns}, (_, i) => <rect key={i} x={560 + i * 210} y="370" width="80" height="580" fill="#0d0d0d" transform={`rotate(${i === 3 ? 4 : 0} ${600 + i * 210} 660)`} />)}
          <circle cx="1560" cy="300" r="120" fill="#141414" />
          <circle cx="1560" cy="300" r="50" fill="#e6e2d8" />
          <path d={`M1480 340 L${560 + turns * 210} 380`} stroke="#0d0d0d" strokeWidth="60" />
        </svg>
        <Hand x={1640} y={340} s={1.3} rot={210 + Math.sin(p.f / 3) * 4} skin={C.skin} sleeve="#21466b" mode="grip" />
        <Hand x={320} y={640} s={1.3} rot={-10 + Math.sin(p.f / 2.5) * 3} skin={C.skin} sleeve="#21466b" mode="open" />
      </Plate>
    );
  }
  // the sala at the people's scale, from where the view stands
  const fore = v === 'pillar-fif' ? (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><rect x="-40" y="-40" width="640" height="1160" fill="#0a0a0b" /></svg>
  ) : v === 'dark-fif' || v === 'path-fif' ? (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 16}, (_, i) => <path key={i} d={`M${rnd(181, i) * 1920} ${-40} Q${rnd(182, i) * 1920} ${300 + rnd(183, i) * 400} ${rnd(184, i) * 1920} 1120`} stroke="#030304" strokeWidth={30 + rnd(185, i) * 50} fill="none" />)}
      {Array.from({length: 30}, (_, i) => <ellipse key={'l' + i} cx={rnd(186, i) * 1920} cy={rnd(187, i) * 400} rx="90" ry="40" fill="#030304" />)}
    </svg>
  ) : undefined;
  if (v === 'path-fif') {
    // looking along the tyre tracks past the sala's back into the scrub: no light at all down there
    return (
      <Stage p={p} light="night" cam={d.cam ?? [1.4, 1.5, 1100, 540]} world={
        <>
          <SalaWorld p={{...p, shot: {...p.shot, data: {...d, cast: []}}}} />
          {Array.from({length: 10}, (_, i) => <div key={i} style={{position: 'absolute', left: 1560 + i * 50, top: 900 - i * 26, width: 40, height: 10, borderRadius: 5, background: 'rgba(0,0,0,.6)'}} />)}
        </>
      } fore={fore} foreBlur={10} foreDark={0.7} />
    );
  }
  return <Stage p={p} light={t === 'day' ? 'day' : 'night'} world={<SalaWorld p={p} box={d.box === 'placing' ? 'none' : 'placed'} />} fore={fore} foreBlur={10} foreDark={0.6} />;
};

// ---------------------------------------------------------------- more of the cemetery road

const RoadMore: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const v = p.shot.view ?? '';
  const t = toneOf(d);
  const k = K(p);
  if (v === 'gate-low') {
    return (
      <Stage p={p} light="night" cam={d.cam ?? [1.05, 1.12, 960, 640]} world={
        <>
          <CemeteryRoad f={p.f} tone={t} horizon={760} vx={1000} fog={d.fog !== false} />
          <div style={{position: 'absolute', left: 300, top: 100, width: 1400, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,165,195,.4), rgba(150,165,195,0) 68%)'}} />
          <CemeteryGate x={1000} y={1000} s={1.25} tone={t} />
          <JayBike x={760 + k * 300} y={990} scale={0.75} f={p.f} face="wary" rec headlight box spin={p.f * 14} />
        </>
      } fore={<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>{Array.from({length: 24}, (_, i) => <circle key={i} cx={rnd(191, i) * 1920} cy={1000 + rnd(192, i) * 120} r={14 + rnd(193, i) * 26} fill="#050404" />)}</svg>} foreBlur={8} foreDark={0.8} />
    );
  }
  if (v === 'headlight-pov') {
    return (
      <Stage p={p} light="night" cam={[1, 1.06, 960, 540]} world={
        <>
          <CemeteryRoad f={p.f} tone={t} horizon={500} vx={960} fog="thick" />
          {/* the cone of the headlight: five metres of road, then fog */}
          <div style={{position: 'absolute', left: 160, top: 480, width: 1600, height: 700, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,240,200,.85), rgba(255,236,190,.35) 35%, rgba(255,240,200,0) 68%)', mixBlendMode: 'screen'}} />
          <div style={{position: 'absolute', left: 360, top: 400, width: 1200, height: 260, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,220,210,.32), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen', filter: 'blur(20px)'}} />
          {[[560, 760, 0.9], [1360, 720, 0.8], [700, 600, 0.45], [1240, 590, 0.4]].map(([x, y, s], i) => <Grave key={i} x={x} y={y} s={s} tone="night" lean={(i - 1.5) * 4} kind={i} />)}
        </>
      } fore={<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M-40 1040 Q960 900 1960 1040 L1960 1120 L-40 1120 Z" fill="#0b0c0e" /></svg>} foreBlur={4} foreDark={0.7} />
    );
  }
  if (v === 'memorial-ins') {
    const legible = !!d.legible;
    const fresh = d.garland === 'fresh';
    return (
      <Plate p={p} bg={t === 'day' || t === 'dawn' ? '#5a5a48' : '#06070a'} glow={t === 'day' || t === 'dawn' ? DAYLIGHT : `radial-gradient(ellipse at ${20 + k * 50}% 50%, rgba(255,240,200,.4), rgba(0,0,0,0) 55%)`}>
        <div style={{position: 'absolute', inset: 0, background: t === 'day' ? 'linear-gradient(#8aa0a8, #6a6a50)' : t === 'dawn' ? 'linear-gradient(#6a6080, #b89070)' : 'transparent', opacity: 0.6, filter: 'blur(14px)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <rect x="900" y="560" width="70" height="560" fill={t === 'night' ? '#2a2016' : '#6a5032'} />
          <rect x="560" y="260" width="760" height="360" rx="10" fill={t === 'night' ? '#3a2c1e' : '#9a7a54'} stroke="#1a1208" strokeWidth="8" />
          {Array.from({length: 6}, (_, i) => <path key={i} d={`M580 ${300 + i * 55} h720`} stroke="rgba(0,0,0,.25)" strokeWidth="3" />)}
          {legible ? (
            <>
              <text x="940" y="400" textAnchor="middle" fontFamily="Plex Thai, sans-serif" fontWeight="700" fontSize="96" fill="#1a1208">ต้อม</text>
              <text x="940" y="520" textAnchor="middle" fontFamily="Plex Thai, sans-serif" fontSize="62" fill="#1a1208">ไรเดอร์ อายุ ๒๒</text>
            </>
          ) : (
            <text x="940" y="460" textAnchor="middle" fontFamily="Plex Thai, sans-serif" fontWeight="700" fontSize="96" fill="rgba(26,18,8,.25)" style={{filter: 'blur(3px)'}}>ต อ  ไ ด อ</text>
          )}
          {/* the marigold garland: dry and brown, or fresh orange in CH10 */}
          {Array.from({length: 18}, (_, i) => {
            const a = (i / 17) * Math.PI;
            return <circle key={i} cx={940 + Math.cos(a) * 300} cy={620 + Math.sin(a) * 150} r="30" fill={fresh ? '#f39c12' : '#6a4a22'} stroke={fresh ? '#c87a0a' : '#3a2810'} strokeWidth="4" />;
          })}
          {fresh && [0, 1, 2].map(i => <rect key={i} x={760 + i * 30} y={980} width="6" height="140" fill="#a86a3a" />)}
        </svg>
        {d.lightAt && t !== 'night' && fresh && <Hand x={720} y={1000} s={1.2} rot={-70} skin="#c48c62" sleeve="#253d5b" mode="grip" />}
      </Plate>
    );
  }
  if (v === 'graves-wide') {
    const lit = d.lantern === 'off-at-end' ? (k < 0.78 ? 1 : 0) : 1;
    return (
      <Stage p={p} light="night" cam={[0.95, 1.0, 1000, 540]} world={
        <>
          <CemeteryRoad f={p.f} tone={t} horizon={500} vx={1000} road={false} fog />
          <div style={{position: 'absolute', left: -200, top: 360, width: 2320, height: 320, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,170,200,.38), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen', filter: 'blur(30px)'}} />
          <div style={{position: 'absolute', left: 1360, top: 520, width: 18, height: 22, borderRadius: 5, background: lit ? '#ffcf6a' : '#1a1208', boxShadow: lit ? '0 0 50px 24px rgba(255,190,90,.5)' : 'none',
            transform: `translateY(${Math.sin(p.f / 10) * 6}px)`}} />
          {lit > 0 && <div style={{position: 'absolute', left: 1200, top: 420, width: 340, height: 260, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,190,90,.45), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen'}} />}
        </>
      } />
    );
  }
  if (v === 'tail-low') {
    return (
      <Stage p={p} light="night" cam={[1, 1.06, 960, 560]} world={
        <>
          <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: 'linear-gradient(#020306, #0d1120 50%, #1a1b1e 52%, #2a2a2c)'}} />
          {/* the beacon ahead in the dark, red / blue, growing */}
          <div style={{position: 'absolute', left: 940 - 30 * (1 + k), top: 470 - 30 * (1 + k), width: 60 * (1 + k), height: 60 * (1 + k), borderRadius: '50%',
            background: Math.floor(p.f / 8) % 2 ? 'rgba(255,60,60,.9)' : 'rgba(70,120,255,.9)', boxShadow: `0 0 ${80 + 60 * k}px ${30 + 20 * k}px ${Math.floor(p.f / 8) % 2 ? 'rgba(255,60,60,.4)' : 'rgba(70,120,255,.4)'}`}} />
          <Headlight x={960} y={980} angle={-90} len={600} spread={26} a={0.3} />
        </>
      } fore={
        // the rear of the seat and the taped box filling the bottom of the frame, shaking with the road
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, transform: `translateY(${Math.sin(p.f / 1.7) * 6}px)`}}>
          <path d="M-40 1120 L-40 860 Q960 760 1960 860 L1960 1120 Z" fill="#0d0f12" />
          <rect x="560" y="640" width="800" height="380" rx="20" fill="#d8d4ca" />
          {[0, 1, 2].map(i => <rect key={i} x={650 + i * 260} y="636" width="80" height="388" fill="#0a0a0a" />)}
          <rect x="1380" y="900" width="90" height="60" rx="8" fill="#e5383b" />
        </svg>
      } foreBlur={3} foreDark={0.75} />
    );
  }
  if (v === 'gate-high') {
    return (
      <Stage p={p} light="night" cam={[0.95, 1.0, 1000, 600]} world={
        <>
          <CemeteryRoad f={p.f} tone={t} horizon={260} vx={1000} fog="thick" />
          <div style={{position: 'absolute', left: 300, top: 300, width: 1400, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(200,205,220,.35), rgba(0,0,0,0) 66%)'}} />
          <div style={{position: 'absolute', left: 930, top: 760 - k * 120, width: 30, height: 30, borderRadius: '50%', background: '#fff2c8', boxShadow: '0 0 50px 24px rgba(255,240,200,.5)', opacity: 1 - k * 0.6}} />
        </>
      } fore={<CemeteryGate x={960} y={1500} s={2.4} ink />} foreBlur={6} foreDark={1} />
    );
  }
  if (v === 'gate-day-wide') {
    // the same arch as night 1, in hard sun from the left: cracks and moss, faded graves, Jay's bike parked before it
    return (
      <Stage p={p} light="day" cam={d.cam ?? [0.92, 0.96, 1000, 540]} world={
        <>
          <CemeteryRoad f={p.f} tone="day" horizon={600} vx={1000} fog={false} />
          <CemeteryGate x={1000} y={960} s={1.05} tone="day" aged />
          <div style={{position: 'absolute', left: 1040, top: 940, width: 620, height: 50, borderRadius: '50%', background: 'rgba(40,30,15,.3)', filter: 'blur(6px)'}} />
          <JayBike x={560} y={1000} scale={0.8} f={p.f} face="wary" rec helmet={false} />
          <SunRake />
        </>
      } />
    );
  }
  if (t === 'day' && v === 'curve-high') {
    // straight down-ish over the laterite curve at noon: empty road, the little board, two small people beside it
    return (
      <Stage p={p} light="day" cam={d.cam ?? [1, 1.04, 960, 540]} world={
        <>
          <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: '#8a8a62'}} />
          {Array.from({length: 40}, (_, i) => <Grave key={i} x={rnd(301, i) * 1920} y={rnd(302, i) * 380 + (i % 2 ? 0 : 720)} s={0.32} tone="day" kind={i} />)}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <path d="M-80 380 Q700 420 980 620 Q1220 800 2000 820" stroke="#b8784a" strokeWidth="230" fill="none" />
            <path d="M-80 380 Q700 420 980 620 Q1220 800 2000 820" stroke="rgba(90,50,26,.35)" strokeWidth="6" strokeDasharray="40 60" fill="none" />
          </svg>
          <Tamarind x={300} y={760} s={0.55} tone="day" seed={31} />
          <RoadsideMemorial x={930} y={790} s={0.55} />
          <Actors p={p} bike={false} floor={800} pxPerCm={1.1} />
          <SunRake a={1.2} />
        </>
      } />
    );
  }
  if (t === 'day' && v === 'curve-pov') {
    // Jay's eye from beside Tom's board: across the road, the mouth of the shortcut behind the sala, far apart
    return (
      <Stage p={p} light="day" cam={d.cam ?? [1, 1.05, 1100, 540]} world={
        <>
          <div style={full('linear-gradient(#9cc0dc, #e6eef0)')} />
          <Tamarind x={700} y={560} s={0.8} tone="day" seed={33} />
          <Sala8 x={520} y={600} s={0.5} tone="day" box="none" />
          <div style={{position: 'absolute', left: -700, top: 520, width: 3320, height: 200, background: 'linear-gradient(#5a6a3a, #4a5a30)'}} />
          {/* the scrub line, and in it the dark mouth of the path, tyre tracks running into it */}
          {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: -100 + i * 85, top: 440 + rnd(311, i) * 40, width: 160, height: 140, borderRadius: '50%', background: i % 3 ? '#4a6234' : '#3a5228'}} />)}
          <div style={{position: 'absolute', left: 1330, top: 500, width: 170, height: 120, borderRadius: '50% 50% 0 0', background: '#141a0e'}} />
          <div style={{position: 'absolute', left: -700, top: 610, width: 3320, height: 900, background: 'linear-gradient(#b8784a, #a86a3e 40%, #8a8a62 41%)'}} />
          <svg width={1920} height={500} viewBox="0 600 1920 500" style={{position: 'absolute', left: 0, top: 600}}>
            {[0, 1].map(k => <path key={k} d={`M${1390 + k * 40} 620 Q${1300 + k * 60} 700 ${1180 + k * 80} 1000`} stroke="rgba(70,40,20,.45)" strokeWidth="12" fill="none" />)}
          </svg>
        </>
      } fore={
        // the board itself, out of focus at the left edge of the frame
        <div style={{position: 'absolute', left: -60, top: 200, width: 520, height: 1000}}>
          <RoadsideMemorial x={260} y={1000} s={2.4} />
        </div>
      } foreBlur={10} foreDark={0.3} />
    );
  }
  if (t === 'day' && !['memorial-ins', 'graves-wide', 'gate-low', 'gate-high', 'tail-low', 'headlight-pov'].includes(v)) {
    // the curve at the people's scale: laterite road bending away right, Tom's board between Jay (700) and Hem (1240)
    const otsWho = v.match(/^over-([a-z]+)-ots$/)?.[1];
    const pc = otsWho ? {...p, shot: {...p.shot, data: {...d, ots: otsWho}}} : p;
    return (
      <Stage p={pc} light="day" world={
        <>
          <CemeteryRoad f={p.f} tone="day" horizon={560} vx={1300} fog={false} road={false} />
          <svg width={3320} height={700} viewBox="-700 540 3320 700" style={{position: 'absolute', left: -700, top: 540}}>
            <path d="M-700 1240 Q600 820 1320 600 L1420 600 Q900 900 400 1240 Z" fill="#b8784a" />
            <path d="M-300 1240 Q700 860 1360 600" stroke="rgba(90,50,26,.3)" strokeWidth="14" fill="none" />
          </svg>
          <Tamarind x={1560} y={720} s={1.3} tone="day" seed={35} />
          <Dapple f={p.f} x={1100} y={820} w={800} h={200} seed={17} a={0.3} />
          <RoadsideMemorial x={1010} y={940} s={1.05} fresh={d.garland === 'fresh'} />
          <Actors p={pc} bike={false} />
          <SunRake />
        </>
      } fore={otsWho ? <Shoulder side={otsWho === 'jay' ? 'l' : 'r'} color={otsWho === 'jay' ? '#1b3550' : '#26304a'} /> : undefined} foreBlur={18} foreDark={0.6} />
    );
  }
  return NIGHT.road(p0);
};

// ---------------------------------------------------------------- the shop's close-ups

const ShopMore: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const v = p.shot.view ?? '';
  const BULB = 'radial-gradient(ellipse at 50% 0%, rgba(255,210,130,.4), rgba(0,0,0,0) 70%)';
  if (v === 'knock-ins') {
    const hit = Math.floor(p.f / 10) % 3 === 0;
    return (
      <Plate p={p} bg="#101112" glow={BULB}>
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(180deg, #3a3c40 0 60px, #1c1d20 60px 76px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(160,90,40,.35), rgba(0,0,0,0) 60%)'}} />
        {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: 900 + rnd(201, i) * 300, top: 520 + rnd(202, i) * 400 + (p.f % 30) * 4, width: 6, height: 6, background: '#8a4a22', opacity: 0.8}} />)}
        <Hand x={1080 + (hit ? -20 : 20)} y={480} s={1.6} rot={180} skin={C.skin} sleeve="#21466b" mode="grip" />
      </Plate>
    );
  }
  if (v === 'hands-ecu') {
    const k = K(p);
    return (
      <Plate p={p} bg="#030303">
        <div style={{position: 'absolute', left: -40, top: -40, width: 2000, height: 520, background: 'repeating-linear-gradient(180deg, #26282b 0 34px, #141517 34px 42px)'}} />
        <div style={{position: 'absolute', left: -40, top: 480, width: 2000, height: 260, background: '#030303'}} />
        <div style={{position: 'absolute', left: -40, top: 480, width: 2000, height: 260, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,200,110,.3), rgba(0,0,0,0) 70%)'}} />
        <div style={{position: 'absolute', left: -40, top: 740, width: 2000, height: 400, background: 'linear-gradient(#3a3226, #121010)'}} />
        {/* the envelope sliding out; thin pale fingers that go back in; no wrist */}
        <div style={{position: 'absolute', left: 780, top: 690 + k * 60, width: 360, height: 120, background: '#a5814e', transform: 'rotate(-3deg)'}} />
        {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 820 + i * 70, top: 620 + (k > 0.6 ? (k - 0.6) * -200 : 0), width: 34, height: 150, borderRadius: 17, background: '#d9cfc0', opacity: k > 0.85 ? 0 : 1}} />)}
      </Plate>
    );
  }
  if (v === 'radio-ins') {
    return (
      <Plate p={p} bg="#050404">
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 70%, rgba(255,200,110,.35), rgba(0,0,0,0) 65%)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* through the shutter gap: a fish-sauce crate, an old transistor radio on it, its dial glowing orange */}
          <rect x="-40" y="-40" width="2000" height="300" fill="#1c1d20" />
          {Array.from({length: 6}, (_, i) => <rect key={i} x="-40" y={-30 + i * 48} width="2000" height="10" fill="#0e0f10" />)}
          <rect x="420" y="760" width="1080" height="360" fill="#5a3a1a" stroke="#2a1a0a" strokeWidth="8" />
          <rect x="620" y="420" width="680" height="360" rx="30" fill="#3a2a1e" stroke="#1a120a" strokeWidth="8" />
          <rect x="680" y="480" width="560" height="120" rx="10" fill="#e8952a" />
          <line x1={760 + (p.f % 60) * 0.5} y1="490" x2={760 + (p.f % 60) * 0.5} y2="590" stroke="#3a1a0a" strokeWidth="6" />
          {Array.from({length: 40}, (_, i) => <circle key={i} cx={700 + (i % 10) * 26} cy={650 + Math.floor(i / 10) * 26} r="7" fill="#1a120a" />)}
          <circle cx="1170" cy="690" r="50" fill="#1a120a" />
        </svg>
      </Plate>
    );
  }
  return NIGHT.shop(p0);
};

export const SALA: Record<string, ShotComponent> = {sala: SalaScene, road: RoadMore, shop: ShopMore};
