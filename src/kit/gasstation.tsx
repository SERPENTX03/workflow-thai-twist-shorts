import React from 'react';
import {rnd} from '../engine/anim';
import {flicker} from './horror';
import {FLOOR, full} from './world';
import {PerspFloor} from './depth';
import {LightVeil} from './room';

// ปั๊มน้ำมันเก่า (from rear-cam, shared): an old roadside gas station built once in depth, so the camera can stand on
// the highway (front), at the pump island looking back to the corrugated back gate (back), or high under the canopy.
// One light by default: the flickering neon sign over the minimart door, frame left (`lightAt` [420, 240] front,
// [1520, 240] back). A truck's high beams can sweep across (`truck`). Floor for actors: FLOOR (930) at the front kerb.
//
//   <GasStation f={f} view="front" />                         // from the highway: minimart left, pumps right, back gate deep right
//   <GasStation f={f} view="back" gate="open" />               // from the pumps: the back gate centre-right, minimart edge right
//   <GasStation f={f} tone="day" />  · neon="off" · flick · truck="arrive" | "pass" · horizon={300} (a high camera)

export type StationTone = 'night' | 'day' | 'dawn';
export const STATION_LIGHT = {front: [420, 240] as [number, number], back: [1520, 240] as [number, number]};

const NEON = '#bff5d8';

/** neon level this frame: 1 lit, 0 off; `flick` stutters it, "off" holds it dark */
export const neonAt = (f: number, neon: 'on' | 'off' | 'flick' = 'on') =>
  neon === 'off' ? 0.06 : neon === 'flick' ? (Math.floor(f / 5) % 7 === 3 || Math.floor(f / 5) % 11 === 6 ? 0.08 : flicker(f, 7, 0.25)) : flicker(f, 3, 0.12);

const Sign: React.FC<{x: number; y: number; w: number; lit: number; text: string}> = ({x, y, w, lit, text}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: 74, borderRadius: 8, background: '#0c1310', border: '5px solid #1b231f',
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${90 * lit}px ${30 * lit}px rgba(160,255,200,${0.28 * lit})`}}>
    <span style={{fontFamily: 'Plex Thai, sans-serif', fontWeight: 700, fontSize: 54, letterSpacing: 2,
      color: lit > 0.3 ? NEON : '#2a3a33', textShadow: lit > 0.3 ? `0 0 ${18 * lit}px rgba(150,255,190,.9)` : 'none'}}>
      {/* one letter is dead: the sign has buzzed like this for years */}
      {[...text].map((ch, i) => <span key={i} style={{opacity: i === 3 ? 0.18 : 1}}>{ch}</span>)}
    </span>
  </div>
);

/** an old rusted pump (front face toward the camera) */
const Pump: React.FC<{x: number; y: number; s?: number; tone: StationTone}> = ({x, y, s = 1, tone}) => (
  <svg width={150 * s} height={330 * s} viewBox="0 0 150 330" style={{position: 'absolute', left: x - 75 * s, top: y - 330 * s, overflow: 'visible'}}>
    <rect x="18" y="20" width="114" height="290" rx="10" fill={tone === 'day' ? '#b23a2e' : '#6e221c'} stroke="#2a0f0c" strokeWidth="4" />
    <rect x="30" y="40" width="90" height="60" rx="6" fill={tone === 'day' ? '#d9e3d8' : '#26302b'} stroke="#2a0f0c" strokeWidth="3" />
    <text x="75" y="80" textAnchor="middle" fontFamily="monospace" fontSize="24" fill={tone === 'day' ? '#333' : '#6b7a70'}>0.00</text>
    <rect x="30" y="120" width="90" height="34" rx="4" fill="#e9c23a" opacity={tone === 'day' ? 1 : 0.55} />
    <path d="M40 210 q30 -10 60 6 M48 250 q20 8 52 -4" stroke="rgba(120,60,20,.6)" strokeWidth="10" fill="none" />
    <rect x="10" y="300" width="130" height="24" rx="4" fill="#3a3632" />
    {/* hose + nozzle hooked on the side */}
    <path d="M132 120 q60 40 18 140 q-20 40 -10 70" stroke="#111" strokeWidth="9" fill="none" />
    <rect x="128" y="104" width="22" height="40" rx="4" fill="#1d1d1d" />
  </svg>
);

/** the corrugated zinc back gate; `open` 0–1 swings the right leaf in to a black gap (the shortcut path beyond) */
const BackGate: React.FC<{x: number; y: number; w: number; h: number; open: number; tone: StationTone}> = ({x, y, w, h, open, tone}) => {
  const zinc = tone === 'day' ? '#8a8c86' : '#3a3d40';
  const leaf = w / 2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <div style={{position: 'absolute', left: leaf, top: 0, width: leaf, height: h, background: tone === 'day' ? '#2a3022' : '#020304'}} />
      {[0, 1].map(i => (
        <div key={i} style={{position: 'absolute', left: i * leaf, top: 0, width: leaf, height: h, transformOrigin: i ? '100% 50%' : '0 50%',
          transform: i ? `perspective(900px) rotateY(${open * 70}deg)` : undefined,
          background: `repeating-linear-gradient(90deg, ${zinc} 0 14px, rgba(0,0,0,.35) 14px 18px)`, border: '4px solid #1a1b1c', boxSizing: 'border-box'}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(120,60,30,.0), rgba(120,60,30,.45))'}} />
        </div>
      ))}
    </div>
  );
};

const Truck: React.FC<{f: number; mode: 'arrive' | 'pass' | 'parked'}> = ({f, mode}) => {
  const x = mode === 'parked' ? 1260 : mode === 'arrive' ? 2600 - Math.min(1, f / 70) * 1300 : 2700 - f * 40;
  return (
    <div style={{position: 'absolute', left: x, top: 380, width: 1300, height: 420}}>
      <div style={{position: 'absolute', left: 0, top: 40, width: 260, height: 330, borderRadius: 18, background: '#1b1f24', border: '4px solid #0b0c0e'}} />
      <div style={{position: 'absolute', left: 30, top: 70, width: 200, height: 110, borderRadius: 10, background: '#2e3a46'}} />
      <div style={{position: 'absolute', left: 270, top: 0, width: 1000, height: 360, background: '#2a2d30', border: '4px solid #0b0c0e'}} />
      {mode !== 'parked' && <div style={{position: 'absolute', left: -900, top: 230, width: 900, height: 160,
        background: 'linear-gradient(270deg, rgba(255,245,210,.55), rgba(255,245,210,0))', clipPath: 'polygon(100% 30%, 100% 70%, 0 100%, 0 0)'}} />}
      {[60, 900, 1100].map(cx => <div key={cx} style={{position: 'absolute', left: cx, top: 330, width: 120, height: 120, borderRadius: '50%', background: '#0a0b0c'}} />)}
    </div>
  );
};

/** the station seen from the highway: minimart left, canopy + pump island right of centre, back gate deep right */
const Front: React.FC<{f: number; tone: StationTone; lit: number; gate: number; truck?: 'arrive' | 'pass' | 'parked'; patrol?: boolean; horizon: number}> = ({f, tone, lit, gate, truck, patrol, horizon}) => {
  const night = tone !== 'day';
  const vy = horizon, vx = 1180;
  const sky = tone === 'day' ? 'linear-gradient(#8fb4d6, #d9e6ee)' : tone === 'dawn' ? 'linear-gradient(#2b3a5c, #8a7c8e 70%, #d8a88a)' : 'linear-gradient(#03050a, #0b1020 60%, #141a2a)';
  return (
    <>
      <div style={full(sky)} />
      {/* treeline + power line beyond the lot */}
      <svg width={3400} height={500} viewBox="-700 0 3400 500" style={{position: 'absolute', left: -700, top: vy - 300, pointerEvents: 'none'}}>
        <path d={`M-700 300 ${Array.from({length: 34}, (_, i) => `Q${-700 + i * 100 + 50} ${190 + rnd(4, i) * 70} ${-600 + i * 100} 300`).join(' ')} L2700 500 L-700 500 Z`}
          fill={night ? '#05070a' : '#3a5a3a'} />
        <path d="M-700 120 Q1000 170 2700 110" stroke={night ? '#0e1218' : '#2a2a2a'} strokeWidth="3" fill="none" />
      </svg>
      {/* concrete apron running to the vanishing point */}
      <div style={{position: 'absolute', left: -700, top: vy, width: 3320, height: 1600 - vy, background: night ? 'linear-gradient(#15171a, #24262a)' : 'linear-gradient(#8c8a84, #b0ada4)'}} />
      <PerspFloor y={vy + 1} vx={vx} vy={vy - 40} bottom={1400} seams={18} rows={8} step={0.11} a={night ? 0.35 : 0.18} />
      {/* oil stains + cracks */}
      {[[820, 980, 160], [1340, 1010, 120], [560, 1060, 220]].map(([x, y, r], i) => (
        <div key={i} style={{position: 'absolute', left: x - r, top: y - r * 0.25, width: r * 2, height: r * 0.5, borderRadius: '50%', background: 'rgba(0,0,0,.35)'}} />
      ))}
      {/* the back gate, deep right */}
      <BackGate x={1610} y={vy + 40} w={190} h={260} open={gate} tone={tone} />
      <div style={{position: 'absolute', left: 1580, top: vy + 20, width: 560, height: 290, background: night ? '#1d1c1a' : '#7a756a', clipPath: 'polygon(0 6%, 100% 0, 100% 100%, 0 100%)', zIndex: -1}} />
      {/* minimart: front wall facing us, frame left */}
      <div style={{position: 'absolute', left: -260, top: 300, width: 900, height: FLOOR - 290, background: night ? '#2c2a26' : '#d8cfbd'}} />
      <div style={{position: 'absolute', left: 640, top: 300, width: 110, height: FLOOR - 250, background: night ? '#1c1b18' : '#b5ac98', clipPath: 'polygon(0 0, 100% 12%, 100% 88%, 0 100%)'}} />
      {/* glass front with shelves behind, dim fluorescent inside */}
      <div style={{position: 'absolute', left: -200, top: 420, width: 760, height: 470, background: night ? 'linear-gradient(#3a4a48, #1e2626)' : '#7d8f92', border: '8px solid #1b1d1e', boxSizing: 'border-box'}}>
        {[0, 1, 2, 3].map(r => <div key={r} style={{position: 'absolute', left: 30, right: 30, top: 60 + r * 100, height: 12, background: 'rgba(0,0,0,.4)'}} />)}
        {Array.from({length: 40}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 40 + (i % 10) * 66, top: 26 + Math.floor(i / 10) * 100, width: 40, height: 34,
            background: ['#c0392b', '#e6c229', '#2e86c1', '#e8e2d0', '#27ae60'][i % 5], opacity: 0.55}} />
        ))}
        <div style={{position: 'absolute', left: 300, top: 0, width: 10, height: '100%', background: '#1b1d1e'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.12) 48%, rgba(255,255,255,0) 56%)'}} />
      </div>
      {/* promo posters, calendar, ice box, water crates, trash bin, air pump, plastic table + chairs */}
      <div style={{position: 'absolute', left: 580, top: 520, width: 60, height: 90, background: night ? '#6a5a3a' : '#e8c86a', transform: 'rotate(2deg)'}} />
      <div style={{position: 'absolute', left: -120, top: 830, width: 160, height: 100, background: night ? '#3a4652' : '#5a8ab0', borderRadius: 8}} />
      {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 90 + i * 70, top: 860 - (i % 2) * 40, width: 64, height: 70, background: night ? '#22303a' : '#4f7fa0', border: '3px solid #111'}} />)}
      <div style={{position: 'absolute', left: 440, top: 820, width: 80, height: 110, borderRadius: '8px 8px 4px 4px', background: night ? '#21402e' : '#2e7d4f'}} />
      <div style={{position: 'absolute', left: 980, top: 690, width: 26, height: 240, background: '#c7c2b4', opacity: night ? 0.45 : 1}} />
      <div style={{position: 'absolute', left: 960, top: 680, width: 66, height: 40, borderRadius: 8, background: night ? '#6b2a24' : '#c0392b'}} />
      {/* canopy over the pumps, receding toward the back */}
      <svg width={1920} height={400} viewBox="0 0 1920 400" style={{position: 'absolute', left: 0, top: 80, overflow: 'visible', pointerEvents: 'none'}}>
        <polygon points="760,40 1960,0 1960,130 760,150" fill={night ? '#121416' : '#cfd3d6'} stroke="#060708" strokeWidth="6" />
        <polygon points="760,150 1960,130 1820,210 900,222" fill={night ? '#0a0b0c' : '#9aa0a4'} />
        <rect x="960" y="206" width="420" height="12" rx="6" fill={night ? '#222' : '#eee'} />
        <rect x="1440" y="200" width="300" height="12" rx="6" fill={night ? '#2a2a2a' : '#eee'} />
        {[900, 1780].map(x => <rect key={x} x={x - 18} y="216" width="36" height="640" fill={night ? '#1a1c1e' : '#e0e0dc'} stroke="#070809" strokeWidth="4" />)}
      </svg>
      {/* pump island + kerb Chat sits on (front kerb top at FLOOR - 56) */}
      <div style={{position: 'absolute', left: 1020, top: FLOOR - 56, width: 560, height: 56, background: night ? '#3c3a36' : '#bdb7aa', borderTop: `8px solid ${night ? '#c9b23a' : '#e8cd3a'}`, boxShadow: '0 16px 0 rgba(0,0,0,.4)'}} />
      <Pump x={1160} y={FLOOR - 56} tone={tone} />
      <Pump x={1440} y={FLOOR - 56} s={0.92} tone={tone} />
      {/* price board on a pole, far right */}
      <div style={{position: 'absolute', left: 1760, top: 240, width: 170, height: 230, background: night ? '#1c242c' : '#1f5e9c', border: '6px solid #0b0c0d'}}>
        {['ดีเซล', '91', '95'].map((t, i) => <div key={t} style={{fontFamily: 'Plex Thai, sans-serif', fontSize: 30, color: night ? '#9aa89e' : '#fff', margin: '10px 14px'}}>{t}</div>)}
      </div>
      {truck && <Truck f={f} mode={truck} />}
      {patrol && (
        <div style={{position: 'absolute', left: 1240, top: 690, width: 440, height: 200, borderRadius: 30, background: '#e9e6dc', border: '5px solid #111'}}>
          <div style={{position: 'absolute', left: 150, top: -30, width: 140, height: 30, borderRadius: 8, background: '#2a0d0d'}} />
          <div style={{position: 'absolute', left: 40, top: 110, width: 360, height: 26, background: '#1f3a78'}} />
        </div>
      )}
      {/* the minimart sign: the station's one light */}
      <Sign x={60} y={200} w={520} lit={lit} text="มินิมาร์ท 24 ชม." />
      {night && (
        <>
          <div style={{position: 'absolute', left: -400, top: 120, width: 1500, height: 1100, borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen',
            background: `radial-gradient(ellipse at 45% 20%, rgba(140,255,190,${0.16 * lit}), rgba(140,255,190,0) 60%)`}} />
          <LightVeil id="gs-front" lights={[[420, 260, 620 * (0.6 + 0.4 * lit)], [700, 860, 380 * lit]]} o={0.52} />
        </>
      )}
    </>
  );
};

/** the reverse angle: from the pump island toward the back gate and the dark path beyond; minimart edge frame right */
const Back: React.FC<{f: number; tone: StationTone; lit: number; gate: number}> = ({f, tone, lit, gate}) => {
  const night = tone !== 'day';
  return (
    <>
      <div style={full(night ? 'linear-gradient(#020306, #0a0e18)' : 'linear-gradient(#8fb4d6, #d9e6ee)')} />
      {/* back wall: breeze block + zinc */}
      <div style={{position: 'absolute', left: -700, top: 360, width: 3320, height: 520, background: night ? '#1a1916' : '#a8a294',
        backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,.25) 0 4px, transparent 4px 120px)`}} />
      <BackGate x={980} y={420} w={420} h={480} open={gate} tone={tone} />
      {/* parked win bikes under a tarp, left */}
      {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 120 + i * 230, top: 690, width: 210, height: 190, borderRadius: '50% 50% 10px 10px',
        background: night ? '#14181c' : '#4a5a6a'}} />)}
      <div style={{position: 'absolute', left: -700, top: 880, width: 3320, height: 800, background: night ? 'linear-gradient(#1b1c1e, #26272a)' : 'linear-gradient(#8c8a84, #b0ada4)'}} />
      <PerspFloor y={881} vx={1190} vy={560} bottom={1500} seams={16} rows={6} a={night ? 0.3 : 0.15} />
      {/* minimart corner at the right edge, the sign's glow on it */}
      <div style={{position: 'absolute', left: 1700, top: 120, width: 900, height: 780, background: night ? '#2c2a26' : '#d8cfbd'}} />
      <div style={{position: 'absolute', left: 1760, top: 150, width: 400, height: 74, borderRadius: 8, background: '#0c1310',
        boxShadow: `0 0 ${90 * lit}px ${30 * lit}px rgba(160,255,200,${0.5 * lit})`}} />
      {/* the neon raking across the back wall and the zinc leaves from frame right: the gate reads, its gap stays black */}
      {night && <div style={{position: 'absolute', left: 300, top: 300, width: 1700, height: 700, borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen',
        background: `radial-gradient(ellipse at 85% 30%, rgba(140,255,190,${0.3 * lit}), rgba(140,255,190,0) 62%)`}} />}
      {night && <LightVeil id="gs-back" lights={[[1700, 300, 900 * (0.6 + 0.4 * lit)], [1190, 700, 420]]} o={0.4} />}
    </>
  );
};

export const GasStation: React.FC<{
  f: number; view?: 'front' | 'back'; tone?: StationTone; neon?: 'on' | 'off' | 'flick';
  gate?: 'closed' | 'open' | 'opening'; truck?: 'arrive' | 'pass' | 'parked'; patrol?: boolean; horizon?: number;
}> = ({f, view = 'front', tone = 'night', neon = 'on', gate = 'closed', truck, patrol, horizon = 470}) => {
  const lit = tone === 'day' ? 0.15 : neonAt(f, neon);
  const g = gate === 'open' ? 1 : gate === 'opening' ? Math.min(1, f / 40) * 0.6 : 0;
  return view === 'back' ? <Back f={f} tone={tone} lit={lit} gate={g} /> : <Front f={f} tone={tone} lit={lit} gate={g} truck={truck} patrol={patrol} horizon={horizon} />;
};
