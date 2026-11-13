import React from 'react';

// Side-on vehicles at any scale (x = centre, y = ground line). Promoted from rear-cam's flashback.
//   Sedan        dark car, headlight on: a passing car, the car that hit someone. Motorcycle (places.tsx) for bikes.
//   FallenBike   a motorcycle on its side after a crash, rot = how far over

export const Sedan: React.FC<{x: number; y: number; s?: number; c?: string; lights?: boolean}> = ({x, y, s = 1, c = '#2a2f38', lights = true}) => (
  <svg width={760 * s} height={260 * s} viewBox="0 0 760 260" style={{position: 'absolute', left: x - 380 * s, top: y - 260 * s, overflow: 'visible'}}>
    <path d="M30 180 Q40 120 140 110 L250 50 Q380 20 500 50 L620 110 Q730 120 740 180 L740 220 L30 220 Z" fill={c} stroke="#0b0c0e" strokeWidth="6" />
    <path d="M270 60 L380 44 L380 110 L220 110 Z M400 44 Q480 46 560 104 L400 110 Z" fill="#141a22" />
    {[170, 600].map(cx => <circle key={cx} cx={cx} cy="220" r="46" fill="#0a0b0c" stroke="#2a2c30" strokeWidth="10" />)}
    {lights && <ellipse cx="736" cy="160" rx="14" ry="20" fill="#fff6cf" />}
  </svg>
);

export const FallenBike: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = -78}) => (
  <svg width={500 * s} height={300 * s} viewBox="0 0 500 300" style={{position: 'absolute', left: x - 250 * s, top: y - 150 * s, overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 50%'}}>
    <circle cx="90" cy="220" r="70" fill="none" stroke="#111" strokeWidth="20" />
    <circle cx="410" cy="220" r="70" fill="none" stroke="#111" strokeWidth="20" />
    <path d="M60 140 Q200 100 300 150 L380 70 L430 80 L400 170 L120 190 Z" fill="#2c3a4a" stroke="#111" strokeWidth="6" />
  </svg>
);
