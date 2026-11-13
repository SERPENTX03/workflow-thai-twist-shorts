import React from 'react';

// A hospital bed on wheels seen from the side, with whoever lies on it: for any shot where a bed is pushed, rolled,
// wheeled down a corridor or a ramp. The patient is the cast's own `lie` body (cover=<colour> gives the blanket), placed
// by `gurneyPatient` so it lies ON the mattress; draw <Gurney part="back"/>, the patient, then <Gurney part="front"/>
// so the near rail and the frame sit over the body. `tilt` rotates the whole bed (a ramp), around its wheels.
//
//   const g = {x, y, s: 1, tilt: -12, dir: 1}                 // y = the floor under the wheels, dir 1 = head at the left
//   <Gurney {...g} part="back" pole bag />  <Actors cast={[gurneyPatient(g, 'wora', 'shock')]} />  <Gurney {...g} part="front" />
//   wrap all three in <GurneyTilt g={g}> so they tip together
//
// Sizes are sprite-proportioned (a 170 cm sprite lies ~ the bed's length), not real centimetres.

export type GurneyPos = {x: number; y: number; s?: number; tilt?: number; dir?: 1 | -1};

const L = 420, MAT = 150; // bed length and mattress-top height at s = 1

/** the cast string of the person lying on the bed: their head at the bed's head end, on the mattress */
export const gurneyPatient = (g: GurneyPos, who: string, rest = 'sleep acc=none cover=dfe8ee') => {
  const s = g.s ?? 1, h = L * 0.98 * s;
  return `${who}@${(g.x).toFixed(0)},${(g.y - MAT * s + 6 * s).toFixed(0)} h=${h.toFixed(0)} lie ${rest}${(g.dir ?? 1) < 0 ? ' flip' : ''}`;
};

/** rotate a bed and whatever is on it about the wheels */
export const GurneyTilt: React.FC<{g: GurneyPos; children: React.ReactNode}> = ({g, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1, height: 1, overflow: 'visible', transformOrigin: `${g.x}px ${g.y}px`, transform: `rotate(${g.tilt ?? 0}deg)`}}>{children}</div>
);

export const Gurney: React.FC<GurneyPos & {part: 'back' | 'front'; pole?: boolean; bag?: boolean; squeeze?: number; sheet?: string; f?: number}> = ({x, y, s = 1, dir = 1, part, pole, bag, squeeze = 0, sheet = '#e4e8e6', f = 0}) => {
  const head = -dir * L / 2; // head end, relative x
  const spin = (f * 9) % 360;
  return (
    <svg width={1} height={1} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {part === 'back' ? <>
          {/* far rail and the head board, the IV pole clamped at the head, the bag swinging */}
          {pole && <g transform={`rotate(${Math.sin(f / 7) * 4} ${head} ${-MAT})`}>
            <line x1={head + dir * 10} y1={-MAT} x2={head + dir * 10} y2={-MAT - 300} stroke="#b9c2c6" strokeWidth={6} />
            <path d={`M${head + dir * 10 - 30} ${-MAT - 300} h60`} stroke="#b9c2c6" strokeWidth={5} />
            <rect x={head + dir * 10 - 46} y={-MAT - 296} width={32} height={56} rx={8} fill="#dfeef4" stroke="#8aa3ad" strokeWidth={3} />
            <path d={`M${head + dir * 10 - 30} ${-MAT - 240} q${dir * 60} 90 ${dir * 110} 170`} stroke="#cfd8db" strokeWidth={3} fill="none" />
          </g>}
          <rect x={head - (dir > 0 ? 14 : 0)} y={-MAT - 70} width={14} height={90} rx={5} fill="#c3c9c6" stroke="#5c625f" strokeWidth={3} />
          <rect x={-L / 2} y={-MAT - 26} width={L} height={8} rx={4} fill="#9aa19e" />
        </> : <>
          {/* mattress edge, frame, legs, castors, the near rail, the foot board */}
          <rect x={-L / 2} y={-MAT} width={L} height={26} rx={6} fill={sheet} stroke="#5c625f" strokeWidth={3} />
          <rect x={-L / 2 + 6} y={-MAT + 26} width={L - 12} height={16} fill="#8f9693" stroke="#4a4f4d" strokeWidth={3} />
          {[-L / 2 + 30, L / 2 - 30].map(lx => <g key={lx}>
            <line x1={lx} y1={-MAT + 42} x2={lx} y2={-22} stroke="#7e8582" strokeWidth={10} />
            <g transform={`translate(${lx} ${-12}) rotate(${spin})`}><circle r={14} fill="#1c1d1f" /><line x1={-9} y1={0} x2={9} y2={0} stroke="#555" strokeWidth={3} /></g>
          </g>)}
          <line x1={-L / 2 + 20} y1={-MAT - 34} x2={L / 2 - 60} y2={-MAT - 34} stroke="#aab2b4" strokeWidth={6} strokeLinecap="round" />
          {[-L / 2 + 40, 0, L / 2 - 80].map(rx => <line key={rx} x1={rx} y1={-MAT - 34} x2={rx} y2={-MAT} stroke="#aab2b4" strokeWidth={4} />)}
          <rect x={-head - (dir > 0 ? 0 : 12)} y={-MAT - 50} width={12} height={70} rx={4} fill="#c3c9c6" stroke="#5c625f" strokeWidth={3} />
          {/* the orange bag-valve mask on his face, squeezed by hand */}
          {bag && <g transform={`translate(${head + dir * 70} ${-MAT - 40})`}>
            <ellipse cx={0} cy={0} rx={30 - squeeze * 6} ry={18 - squeeze * 4} fill="#ff8a2a" stroke="#9a4a10" strokeWidth={3} />
            <path d={`M${-dir * 30} 4 q${-dir * 16} 6 ${-dir * 26} 16`} stroke="#e8e8e8" strokeWidth={6} fill="none" />
          </g>}
        </>}
      </g>
    </svg>
  );
};
