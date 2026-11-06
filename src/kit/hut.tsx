import React from 'react';
import {rnd} from '../engine/anim';

// กระท่อมคนเฝ้าสุสาน (from rear-cam, shared): a plank hut with a lean-to tin roof under a big tree at the edge of a
// cemetery or a field — open door, one shuttered window, a water jar, a clothesline with a pha khao ma, a pressure
// lantern on the eave and a black raincoat on a nail by the door. Drawn at the people's scale when s = 1
// (3 px/cm: the door is ≈ 190 cm), anchored at the middle of the front wall on the ground (x, y).
//
//   <CaretakerHut x={1260} y={930} s={1.07} tone="day" door="open" lantern={0} raincoat />
//   <HutBench x={1640} y={930} />                 // the bamboo platform (แคร่) out front — sit someone on it
//   <PressureLantern x y s lit={1} />             // big, for an insert
//   <Raincoat x y s logo="มูลนิธิ" tag />         // big, for an insert
//   <Dapple f x y w h />                          // sun spots through leaves (screen blend)
//   hutAt(x, y, s) → {door, lantern, raincoat, bench}  world points for staging

export type HutTone = 'day' | 'night' | 'dusk';

export const hutAt = (x: number, y: number, s = 1) => ({
  door: {x: x - 60 * s, y, w: 260 * s, h: 560 * s},
  lantern: {x: x + 300 * s, y: y - 600 * s},
  raincoat: {x: x + 140 * s, y: y - 470 * s},
  bench: {x: x + 380 * s, y},
});

const wood = (t: HutTone) => (t === 'day' ? ['#8a6a48', '#6e5238', '#5a4230'] : t === 'dusk' ? ['#4a3a30', '#3a2e26', '#2a221c'] : ['#1c1712', '#15110d', '#0e0b09']);
const tin = (t: HutTone) => (t === 'day' ? ['#9aa0a2', '#7a7f80', '#b8a07a'] : t === 'dusk' ? ['#4a4c52', '#3a3c40', '#5a4a3a'] : ['#16171a', '#101114', '#1a1612']);

/** the pressure lantern (ตะเกียงเจ้าพายุ): a 120 × 200 box hung from its top hook at (x, y) */
export const PressureLantern: React.FC<{x: number; y: number; s?: number; lit?: number; soot?: boolean; tone?: HutTone}> = ({x, y, s = 1, lit = 0, soot = true, tone = 'day'}) => {
  const metal = tone === 'night' ? '#2a2c30' : '#8c8e86';
  return (
    <>
      {lit > 0 && <div style={{position: 'absolute', left: x - 260 * s, top: y + 20 * s, width: 520 * s, height: 420 * s, borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen',
        background: `radial-gradient(ellipse, rgba(255,220,140,${0.75 * lit}), rgba(255,190,90,${0.25 * lit}) 35%, rgba(0,0,0,0) 70%)`}} />}
      <svg width={120 * s} height={210 * s} viewBox="0 0 120 210" style={{position: 'absolute', left: x - 60 * s, top: y, overflow: 'visible'}}>
        <path d="M60 0 L60 14" stroke={metal} strokeWidth="4" />
        <circle cx="60" cy="18" r="6" fill="none" stroke={metal} strokeWidth="3" />
        <path d="M30 40 Q60 22 90 40 L94 52 L26 52 Z" fill={metal} stroke="#1a1a18" strokeWidth="2" />
        {/* the glass globe, sooty at the top, the mantle inside */}
        <path d="M30 54 Q22 96 34 130 L86 130 Q98 96 90 54 Z" fill={lit ? `rgba(255,236,180,${0.5 + 0.5 * lit})` : tone === 'night' ? 'rgba(60,64,70,.5)' : 'rgba(225,232,230,.55)'} stroke="#2a2a28" strokeWidth="2.5" />
        {soot && <path d="M32 56 Q60 74 88 56 Q90 66 86 76 Q60 86 34 76 Q30 66 32 56 Z" fill="rgba(30,26,22,.55)" />}
        <ellipse cx="60" cy="100" rx="11" ry="15" fill={lit ? '#fffbe8' : '#d8d2c0'} />
        <path d="M60 86 L60 70" stroke="#3a3a36" strokeWidth="2" />
        <rect x="26" y="130" width="68" height="14" rx="3" fill={metal} stroke="#1a1a18" strokeWidth="2" />
        {/* the tank, pump knob and valve */}
        <path d="M24 144 L96 144 Q108 176 92 200 L28 200 Q12 176 24 144 Z" fill={tone === 'night' ? '#3a1c18' : '#a8352a'} stroke="#1a1a18" strokeWidth="2.5" />
        <rect x="96" y="160" width="16" height="8" rx="3" fill={metal} />
        <circle cx="60" cy="172" r="8" fill={metal} />
      </svg>
    </>
  );
};

/** the black raincoat on a nail: 220 × 420 box hung at (x, y); `logo` prints white on the chest, `tag` = the free-giveaway tag */
export const Raincoat: React.FC<{x: number; y: number; s?: number; logo?: string; tag?: boolean; mud?: boolean; tone?: HutTone}> = ({x, y, s = 1, logo, tag, mud = true, tone = 'day'}) => (
  <svg width={220 * s} height={430 * s} viewBox="0 0 220 430" style={{position: 'absolute', left: x - 110 * s, top: y, overflow: 'visible'}}>
    <circle cx="110" cy="6" r="6" fill="#5a5a58" />
    <path d="M110 8 Q86 20 70 34 L40 40 Q14 120 8 250 L30 256 L42 150 L46 420 L174 420 L178 150 L190 256 L212 250 Q206 120 180 40 L150 34 Q134 20 110 8 Z" fill="#0d0e10" stroke="#000" strokeWidth="3" />
    {/* the hood folded behind, a sheen down one side where the light catches the plastic */}
    <path d="M84 30 Q110 54 136 30" stroke="#24262a" strokeWidth="8" fill="none" />
    <path d="M60 60 Q52 200 58 410" stroke={tone === 'night' ? 'rgba(255,210,140,.18)' : 'rgba(255,255,255,.22)'} strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M110 40 L110 420" stroke="#050506" strokeWidth="3" />
    {logo && <text x="110" y="130" textAnchor="middle" fontSize="22" fontWeight="700" fill="#e8e8e4" fontFamily="Plex Thai, sans-serif">{logo}</text>}
    {logo && <circle cx="110" cy="90" r="16" fill="none" stroke="#e8e8e4" strokeWidth="4" />}
    {mud && <path d="M46 392 Q80 380 110 396 Q150 384 174 394 L174 420 L46 420 Z" fill="#5a4630" opacity=".85" />}
    {tag && (
      <g transform="translate(14 70) rotate(10 150 50)">
        <path d="M150 50 L170 90" stroke="#c8c0a8" strokeWidth="2" />
        <rect x="150" y="88" width="56" height="34" rx="4" fill="#f1ead8" stroke="#8a7a5a" strokeWidth="2" />
        <text x="178" y="111" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b03a2e" fontFamily="Plex Thai, sans-serif">แจกฟรี</text>
      </g>
    )}
  </svg>
);

/** the bamboo platform out front, 380 × 120, its middle on the ground at (x, y); sit height ≈ 45 cm */
export const HutBench: React.FC<{x: number; y: number; s?: number; tone?: HutTone}> = ({x, y, s = 1, tone = 'day'}) => {
  const c = tone === 'day' ? ['#c8a868', '#a88a50', '#7a6238'] : tone === 'dusk' ? ['#5a4a32', '#4a3c28', '#33291c'] : ['#1e1a12', '#17140e', '#100e0a'];
  return (
    <svg width={400 * s} height={140 * s} viewBox="0 0 400 140" style={{position: 'absolute', left: x - 200 * s, top: y - 140 * s, overflow: 'visible'}}>
      <ellipse cx="200" cy="138" rx="210" ry="10" fill="rgba(0,0,0,.28)" />
      {[30, 370].map(lx => <rect key={lx} x={lx - 8} y="40" width="16" height="100" fill={c[2]} />)}
      <rect x="10" y="22" width="380" height="26" fill={c[1]} stroke="#3a2a14" strokeWidth="2" />
      {Array.from({length: 9}, (_, i) => <rect key={i} x={12 + i * 42} y="14" width="38" height="12" rx="5" fill={c[0]} stroke="#3a2a14" strokeWidth="1.5" />)}
    </svg>
  );
};

/** sun spots through leaves: soft ellipses scattered over an area, drifting a little with the wind */
export const Dapple: React.FC<{f: number; x: number; y: number; w: number; h: number; n?: number; seed?: number; a?: number; flat?: number}> = ({f, x, y, w, h, n = 22, seed = 1, a = 0.45, flat = 0.4}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, pointerEvents: 'none', mixBlendMode: 'screen'}}>
    {Array.from({length: n}, (_, i) => {
      const r = 18 + rnd(seed, i) * 46;
      const dx = Math.sin(f / 40 + i) * 6;
      return <div key={i} style={{position: 'absolute', left: rnd(seed + 1, i) * w + dx, top: rnd(seed + 2, i) * h, width: r * 2, height: r * 2 * flat, borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(255,246,210,${a}), rgba(255,246,210,0) 70%)`}} />;
    })}
  </div>
);

/** the hut, front wall centred on (x, y) on the ground. `lantern` 0..1 = how lit the eave lantern is. */
export const CaretakerHut: React.FC<{x: number; y: number; s?: number; tone?: HutTone; door?: 'open' | 'closed'; lantern?: number; raincoat?: boolean; line?: boolean; jar?: boolean}> = ({
  x, y, s = 1, tone = 'day', door = 'open', lantern = 0, raincoat = true, line = true, jar = true,
}) => {
  const [w0, w1, w2] = wood(tone);
  const [t0, t1, t2] = tin(tone);
  const g = hutAt(x, y, s);
  const inside = tone === 'day' ? '#1a140e' : '#050403';
  return (
    <>
      <svg width={1200 * s} height={900 * s} viewBox="-600 -820 1200 900" style={{position: 'absolute', left: x - 600 * s, top: y - 820 * s, overflow: 'visible'}}>
        {/* clothesline from the roof post off to the left, a checked pha khao ma and a shirt on it */}
        {line && (
          <>
            <rect x="-590" y="-560" width="12" height="560" fill={w2} />
            <path d="M-584 -540 Q-520 -500 -460 -536" stroke={tone === 'night' ? '#222' : '#ddd'} strokeWidth="2" fill="none" />
            <rect x="-560" y="-528" width="60" height="120" fill={tone === 'night' ? '#1a1018' : '#b0384a'} />
            {[0, 1, 2].map(i => <rect key={i} x="-560" y={-508 + i * 36} width="60" height="8" fill={tone === 'night' ? '#120a10' : '#e8d8c8'} opacity=".7" />)}
          </>
        )}
        {/* the wall: vertical planks on a low plinth, a dark gap between each */}
        <rect x="-450" y="-620" width="900" height="600" fill={w0} />
        {Array.from({length: 19}, (_, i) => <rect key={i} x={-450 + i * 48} y="-620" width="4" height="600" fill={w2} />)}
        {Array.from({length: 12}, (_, i) => <rect key={'k' + i} x={-440 + rnd(31, i) * 860} y={-600 + rnd(32, i) * 560} width="6" height="6" rx="3" fill={w2} />)}
        <rect x="-460" y="-24" width="920" height="24" fill={tone === 'day' ? '#8a8578' : '#14130f'} />
        {/* the door: dark inside, the leaf swung in against the frame */}
        <rect x={-60 - 130} y={-560} width="260" height="540" fill={door === 'open' ? inside : w1} />
        {door === 'open' && <path d={`M${-60 - 130} -560 L${-60 - 70} -540 L${-60 - 70} -40 L${-60 - 130} -20 Z`} fill={w1} />}
        <rect x={-60 - 140} y={-570} width="280" height="14" fill={w2} />
        <rect x={-60 - 140} y={-570} width="14" height="550" fill={w2} />
        <rect x={-60 + 126} y={-570} width="14" height="550" fill={w2} />
        {/* window with its shutter propped open on a stick */}
        <rect x="250" y="-470" width="150" height="170" fill={inside} />
        <path d="M250 -470 L400 -470 L420 -560 L230 -560 Z" fill={w1} stroke={w2} strokeWidth="4" />
        <path d="M325 -300 L325 -470" stroke={w2} strokeWidth="6" />
        {/* the lean-to tin roof: corrugations, rust at the eave, overhang throwing a band of shade on the wall */}
        <path d="M-540 -640 L540 -640 L500 -780 L-500 -780 Z" fill={t0} />
        {Array.from({length: 22}, (_, i) => <path key={i} d={`M${-530 + i * 49} -640 L${-492 + i * 46} -780`} stroke={t1} strokeWidth="10" />)}
        <path d="M-540 -640 L540 -640" stroke={t2} strokeWidth="12" />
        <rect x="-540" y="-640" width="1080" height="6" fill="rgba(0,0,0,.4)" />
        {tone === 'day' && <rect x="-450" y="-620" width="900" height="110" fill="rgba(20,14,8,.42)" />}
        {/* the water jar */}
        {jar && (
          <>
            <ellipse cx="-360" cy="-4" rx="86" ry="12" fill="rgba(0,0,0,.3)" />
            <path d="M-420 -150 Q-470 -80 -420 -10 L-300 -10 Q-250 -80 -300 -150 Z" fill={tone === 'day' ? '#6a3a22' : '#1a0e08'} stroke="#2a160c" strokeWidth="3" />
            <ellipse cx="-360" cy="-150" rx="62" ry="12" fill={tone === 'day' ? '#4a2614' : '#0e0804'} />
            <path d="M-440 -90 Q-360 -70 -280 -90" stroke="rgba(255,220,160,.2)" strokeWidth="8" fill="none" />
          </>
        )}
        {/* the lantern's hook on the eave */}
        <path d={`M300 -640 L300 -620`} stroke={tone === 'night' ? '#2a2c30' : '#5a5a58'} strokeWidth="4" />
      </svg>
      {raincoat && <Raincoat x={g.raincoat.x} y={g.raincoat.y} s={0.75 * s} tone={tone} />}
      <PressureLantern x={g.lantern.x} y={g.lantern.y} s={0.62 * s} lit={lantern} tone={tone} />
    </>
  );
};

/** hard sun raking in from the upper left: lifts that corner, sinks the far right into shade (day sets need a direction) */
export const SunRake: React.FC<{a?: number; angle?: number}> = ({a = 1, angle = 115}) => (
  <div style={{position: 'absolute', left: -800, top: -600, width: 3520, height: 2280, pointerEvents: 'none',
    background: `linear-gradient(${angle}deg, rgba(255,246,215,${0.28 * a}) 20%, rgba(0,0,0,0) 45%, rgba(24,18,10,${0.42 * a}) 75%)`}} />
);
