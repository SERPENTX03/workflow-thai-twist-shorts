import React from 'react';

// Furniture and things that more than one story needs, drawn in frame px at the cast's scale (3 px/cm; s scales both).
// Sizes are real: see directing.md §3.1 (table of true sizes). (x, y) is always the point on the floor under the thing.

/** the IV stand with a stethoscope on its hook: seen behind him when he is close */
export const IvStand: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <svg width={2} height={2} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={0} y1={0} x2={0} y2={-700} stroke="#aeb7bb" strokeWidth={10} />
      <path d="M-70 -700 Q-70 -730 0 -730 Q70 -730 70 -700" stroke="#aeb7bb" strokeWidth={8} fill="none" />
      <path d="M-60 -700 q-30 90 -8 130 q22 36 34 -40" stroke="#21272b" strokeWidth={8} fill="none" />
      <circle cx={-34} cy={-606} r={12} fill="#aeb7bb" stroke="#21272b" strokeWidth={3} />
      <path d="M-90 0 H90 M0 0 V30 M-90 0 V24 M90 0 V24" stroke="#aeb7bb" strokeWidth={8} />
    </g>
  </svg>
);


/** office chair: backrest behind his shoulders, a white coat hung over it */
export const OfficeChair: React.FC<{x: number; y: number; s?: number; coat?: boolean}> = ({x, y, s = 1, coat}) => (
  <svg width={2} height={2} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, -0.45, 0.45, 1].map(k => <g key={k}><path d={`M0 -34 L${k * 104} ${-8 + Math.abs(k) * 2}`} stroke="#17181b" strokeWidth={13} /><circle cx={k * 104} cy={2} r={12} fill="#0d0e10" /></g>)}
      <rect x={-9} y={-110} width={18} height={80} fill="#54585c" />
      <rect x={-104} y={-136} width={208} height={38} rx={15} fill="#191a1e" />
      <path d="M-98 -398 Q0 -432 98 -398 V-156 Q0 -130 -98 -156 Z" fill="#1e2024" stroke="#0a0a0c" strokeWidth={4} />
      {coat && <g>
        <path d="M66 -420 Q118 -428 142 -402 L176 -60 L58 -40 L34 -300 Z" fill="#f1f3f2" stroke="#a9b2b5" strokeWidth={4} />
        <path d="M66 -420 L108 -340 L90 -56" stroke="#c6cdd0" strokeWidth={5} fill="none" />
        <rect x={112} y={-222} width={46} height={58} fill="none" stroke="#c6cdd0" strokeWidth={4} transform="rotate(-3 134 -194)" />
        <line x1={122} y1={-216} x2={122} y2={-180} stroke="#2c4d7a" strokeWidth={5} />
      </g>}
    </g>
  </svg>
);

