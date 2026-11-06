import React from 'react';
import {rnd} from '../engine/anim';
import {T} from '../engine/theme';

// A rider's helmet with action cameras, and the screen a rider watches on the handlebar (from rear-cam, shared).
//
// Every piece is drawn in the cast's 200×520 head frame (head circle at 100,65 r65), the same frame the riding rig in
// places.tsx <Motorcycle> uses for its head. So one drawing works on the bike (pass it as `rider.extra`) and over any
// close-up of a cast Sprite's head:
//
//   <Motorcycle x={900} rider={{shirt, pants, face: 'wary', vest: false, extra: <HelmetCams side rec />}} />
//   <svg viewBox="0 0 200 520">…<use href="#lead-male-A"/>…<HelmetShell shield /><HelmetCams rec /></svg>
//
// Full-frame close-ups that need no sprite: <HelmetBack> (the rear camera fills the frame), <HelmetOnSeat>,
// <BarScreen> (the rider's eye line down to a 2-inch screen; children = what the screen shows).

const SHELL = 'M26 62 C26 -16 174 -16 174 62 Q100 68 26 62 Z';

/** the matte black half-shell from the riding rig, with an optional clear flip-down shield over the face */
export const HelmetShell: React.FC<{shield?: boolean; fog?: number; seed?: number}> = ({shield, fog = 0, seed = 1}) => (
  <g>
    <path d={SHELL} fill="#1b1e23" stroke="#0d0f12" strokeWidth="2.5" />
    <path d="M48 24 C68 2 132 2 152 24" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M24 62 Q100 69 176 62" fill="none" stroke="#090b0d" strokeWidth="6" strokeLinecap="round" />
    {shield && (
      <g>
        <path d="M30 56 Q100 46 170 56 L166 122 Q100 136 34 122 Z" fill="rgba(170,200,235,.13)" stroke="rgba(230,240,255,.32)" strokeWidth="2.5" />
        <path d="M48 66 Q70 60 92 62" stroke="rgba(255,255,255,.35)" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* mist droplets beaded on the shield */}
        {Array.from({length: Math.round(fog * 26)}, (_, i) => (
          <circle key={i} cx={40 + rnd(seed, i) * 120} cy={62 + rnd(seed + 1, i) * 56} r={0.8 + rnd(seed + 2, i) * 1.6} fill="rgba(235,245,255,.55)" />
        ))}
      </g>
    )}
  </g>
);

/** action cameras strapped to the helmet. Front view: the front camera's lens looks at us from the brow.
 *  `side`: the head is seen riding to the right (the bike rig), front camera at the front, rear camera at the back.
 *  `rec` lights the rear camera's red LED (it blinks with `f`); `dead` = the rear camera's cable hangs loose. */
export const HelmetCams: React.FC<{side?: boolean; rec?: boolean; dead?: boolean; f?: number}> = ({side, rec, dead, f = 0}) => {
  const on = rec && Math.floor(f / 15) % 2 === 0;
  const led = on ? '#ff3b30' : rec ? '#7a1714' : '#2a1416';
  if (side) {
    return (
      <g>
        {/* front camera on the brow, lens forward (screen right) */}
        <rect x="140" y="-4" width="30" height="20" rx="4" fill="#111316" stroke="#000" strokeWidth="2" />
        <circle cx="168" cy="6" r="6" fill="#2b3a4a" stroke="#000" strokeWidth="1.5" />
        <circle cx="166" cy="4" r="2" fill="rgba(255,255,255,.6)" />
        {/* rear camera at the back of the shell, lens backward */}
        <rect x="24" y="12" width="28" height="20" rx="4" fill="#111316" stroke="#000" strokeWidth="2" />
        <circle cx="26" cy="22" r="6" fill="#2b3a4a" stroke="#000" strokeWidth="1.5" />
        <circle cx="46" cy="16" r="3" fill={led} />
        {on && <circle cx="46" cy="16" r="8" fill="rgba(255,59,48,.35)" />}
        {dead && <path d="M40 32 q-6 22 4 40" stroke="#e07a2c" strokeWidth="2.5" fill="none" />}
      </g>
    );
  }
  return (
    <g>
      <path d="M78 6 Q100 -2 122 6" stroke="#0a0b0d" strokeWidth="5" fill="none" />
      <rect x="84" y="-14" width="32" height="24" rx="5" fill="#111316" stroke="#000" strokeWidth="2" />
      <circle cx="100" cy="-2" r="8" fill="#2b3a4a" stroke="#000" strokeWidth="2" />
      <circle cx="97" cy="-5" r="2.6" fill="rgba(255,255,255,.65)" />
      <circle cx="112" cy="-10" r="2" fill={on ? '#ff3b30' : '#2a1416'} />
    </g>
  );
};

/** ECU of the back of the helmet: the rear camera fills the frame, its red REC LED the brightest thing in it.
 *  `wet` beads dew on the shell, `dead` hangs the torn ribbon cable, `glint` = a moving tail-light reflection. */
export const HelmetBack: React.FC<{f: number; rec?: boolean; dead?: boolean; wet?: boolean; tilt?: number; cable?: boolean}> = ({f, rec, dead, wet, tilt = 0, cable}) => {
  const on = rec && Math.floor(f / 15) % 2 === 0;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="hb-shell" cx="38%" cy="28%" r="80%">
          <stop offset="0" stopColor="#3a3f48" />
          <stop offset="0.45" stopColor="#1a1d22" />
          <stop offset="1" stopColor="#050607" />
        </radialGradient>
        <radialGradient id="hb-led">
          <stop offset="0" stopColor="#ff5a4f" stopOpacity={on ? 0.9 : 0} />
          <stop offset="1" stopColor="#ff2a20" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`rotate(${tilt} 960 540)`}>
        {/* the dome of the shell, larger than the frame */}
        <ellipse cx="900" cy="760" rx="1180" ry="900" fill="url(#hb-shell)" />
        <path d="M200 380 Q800 120 1500 300" stroke="rgba(255,255,255,.08)" strokeWidth="40" fill="none" strokeLinecap="round" />
        {/* strap mount */}
        <rect x="560" y="470" width="760" height="70" rx="20" fill="#0b0c0e" />
        <rect x="560" y="470" width="760" height="10" fill="rgba(255,255,255,.06)" />
        {/* camera body */}
        <rect x="690" y="330" width="520" height="340" rx="46" fill="#121418" stroke="#000" strokeWidth="6" />
        <rect x="700" y="340" width="500" height="40" rx="20" fill="rgba(255,255,255,.05)" />
        {/* lens */}
        <circle cx="900" cy="500" r="118" fill="#07090c" stroke="#2a2e35" strokeWidth="14" />
        <circle cx="900" cy="500" r="74" fill={dead ? '#1a1d22' : '#122236'} />
        <circle cx="900" cy="500" r="40" fill={dead ? '#121418' : '#0a1626'} />
        <ellipse cx="870" cy="466" rx="26" ry="16" fill={`rgba(255,255,255,${dead ? 0.08 : 0.32})`} transform="rotate(-30 870 466)" />
        {!dead && <circle cx="938" cy="530" r="10" fill="rgba(255,120,100,.35)" />}
        {/* REC LED + label */}
        <circle cx="1120" cy="400" r="70" fill="url(#hb-led)" />
        <circle cx="1120" cy="400" r="17" fill={on ? '#ff3b30' : rec ? '#5a1210' : '#1e1416'} />
        <text x="1070" y="618" fontSize="34" fontFamily="monospace" fontWeight="700" fill={on ? 'rgba(255,90,80,.9)' : 'rgba(255,255,255,.18)'}>REC</text>
        {dead && cable && <path d="M760 660 q-30 120 40 210 q40 50 10 140" stroke="#d9772b" strokeWidth="16" fill="none" strokeLinecap="round" />}
        {wet && Array.from({length: 70}, (_, i) => (
          <circle key={i} cx={rnd(31, i) * 1920} cy={160 + rnd(32, i) * 920} r={3 + rnd(33, i) * 9} fill="rgba(220,235,255,.22)" />
        ))}
      </g>
    </svg>
  );
};

/** The helmet resting on the seat, seen from the front of the bike: the front camera stares at the lens and the rear
 *  camera's box shows behind the shell. `rearDead` = no LED, ribbon cable hanging. */
export const HelmetOnSeat: React.FC<{f: number; rec?: boolean; rearDead?: boolean}> = ({f, rec, rearDead}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    {/* seat + tank */}
    <path d="M-40 900 Q500 760 980 820 Q1500 880 1980 820 L1980 1080 L-40 1080 Z" fill="#141619" />
    <path d="M-40 900 Q500 760 980 820 Q1500 880 1980 820" stroke="rgba(255,255,255,.12)" strokeWidth="6" fill="none" />
    <path d="M1300 860 Q1700 760 1980 780 L1980 1080 L1240 1080 Z" fill="#20476d" />
    <ellipse cx="960" cy="830" rx="420" ry="40" fill="rgba(0,0,0,.55)" />
    <g transform="translate(960 560) scale(5.2) translate(-100 -40)">
      <path d={SHELL} fill="#1b1e23" stroke="#0d0f12" strokeWidth="1.2" />
      <path d="M48 24 C68 2 132 2 152 24" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 56 Q100 46 170 56 L166 96 Q100 104 34 96 Z" fill="rgba(170,200,235,.10)" stroke="rgba(230,240,255,.25)" strokeWidth="1.2" />
      {/* rear camera box peeking out behind the shell's top-left */}
      <rect x="18" y="-6" width="26" height="18" rx="3" fill="#0d0f12" stroke="#000" strokeWidth="1" />
      <circle cx="38" cy="-1" r="1.8" fill={rearDead ? '#1e1416' : '#ff3b30'} />
      {rearDead && <path d="M26 12 q-4 14 3 26" stroke="#e07a2c" strokeWidth="1.4" fill="none" />}
      <HelmetCams rec={rec} f={f} />
    </g>
  </svg>
);

/** The rider's eye line down to the handlebar: grip, mirror stem and a 2-inch screen glowing in the dark, the road a
 *  dark blur beyond. `children` = what the screen shows, drawn in a 480×300 box. `signal` false = grey NO SIGNAL. */
export const BarScreen: React.FC<{f: number; children?: React.ReactNode; signal?: boolean; zoom?: number; road?: 'gravel' | 'highway'; headlight?: boolean; label?: string}> = ({
  f, children, signal = true, zoom = 1, road = 'gravel', headlight = true, label,
}) => {
  const sx = 960, sy = 600;
  const jog = Math.sin(f / 4) * 3;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#030406'}}>
      {/* road beyond the bars, out of focus */}
      <div style={{position: 'absolute', inset: 0, filter: 'blur(14px)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 560, background: 'linear-gradient(#020305, #0a0d14)'}} />
        <div style={{position: 'absolute', left: -200, top: 420, width: 2320, height: 700,
          background: road === 'gravel' ? 'linear-gradient(#2a2620, #121010)' : 'linear-gradient(#202228, #0e0f12)',
          clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)'}} />
        {headlight && <div style={{position: 'absolute', left: 560, top: 380, width: 800, height: 420, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,240,190,.32), rgba(255,240,190,0) 70%)'}} />}
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${jog}px) scale(${zoom})`, transformOrigin: `${sx}px ${sy}px`}}>
        {/* handlebar and grip */}
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <path d="M-60 980 Q700 820 1980 900" stroke="#15171b" strokeWidth="70" fill="none" strokeLinecap="round" />
          <path d="M-60 958 Q700 798 1980 878" stroke="rgba(255,255,255,.06)" strokeWidth="8" fill="none" />
          <rect x="1500" y="800" width="360" height="110" rx="40" fill="#0c0d10" transform="rotate(4 1680 855)" />
          {Array.from({length: 9}, (_, i) => <rect key={i} x={1520 + i * 36} y="808" width="10" height="94" rx="4" fill="#191b20" transform="rotate(4 1680 855)" />)}
          {/* mount arm */}
          <rect x={sx - 40} y={sy + 150} width="80" height="140" rx="18" fill="#101114" />
          <rect x={sx - 300} y={sy - 190} width="600" height="380" rx="36" fill="#0b0c0f" stroke="#1d2026" strokeWidth="8" />
        </svg>
        {/* the screen */}
        <div style={{position: 'absolute', left: sx - 260, top: sy - 170, width: 520, height: 340, borderRadius: 20, overflow: 'hidden',
          background: '#05070a', boxShadow: signal ? '0 0 120px 30px rgba(120,170,255,.18)' : 'none'}}>
          <div style={{position: 'absolute', left: 20, top: 20, width: 480, height: 300, overflow: 'hidden'}}>
            {signal ? children : (
              <div style={{position: 'absolute', inset: 0, background: '#2c2f34', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontWeight: 700, fontSize: 44, color: '#8a9099', letterSpacing: 4}}>NO SIGNAL</div>
            )}
          </div>
          {label && <div style={{position: 'absolute', left: 30, bottom: 8, fontFamily: T.ui, fontSize: 18, color: 'rgba(255,255,255,.55)'}}>{label}</div>}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,0) 30%)'}} />
        </div>
      </div>
      {/* the screen is the only light near the rider: it spills on the bars */}
      <div style={{position: 'absolute', left: sx - 520, top: sy - 360, width: 1040, height: 900, borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen',
        background: signal ? 'radial-gradient(ellipse, rgba(110,160,255,.14), rgba(110,160,255,0) 65%)' : 'none'}} />
    </div>
  );
};
