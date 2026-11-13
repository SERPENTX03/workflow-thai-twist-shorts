import React from 'react';
import {rnd} from '../engine/anim';
import {FLOOR, Glow, W, full} from './world';

// The narrow wooden passage behind the walls (first used by same-child ch8): one plank floor with nail heads, a low
// ceiling, side walls that close in, light only from the doorway behind (`from` = 'left' | 'right' | 'none').
// view: 'passage' long corridor · 'line' a wall people push at · 'deep' the far end, a crack stuffed with cloth ·
// 'meet' two people face to face.

export const DarkPassage: React.FC<{f: number; view?: 'passage' | 'line' | 'deep' | 'meet'; from?: 'left' | 'right' | 'none'; cloth?: boolean}> = ({f, view = 'passage', from = 'left', cloth}) => {
  const flick = 0.9 + 0.1 * Math.sin(f / 5) * rnd(3, Math.floor(f / 6));
  return (
    <>
      <div style={full('#050608')} />
      {/* back wall boards */}
      <div style={{position: 'absolute', left: -700, top: 160, width: W + 1400, height: FLOOR - 160,
        background: 'repeating-linear-gradient(90deg, #120d0a 0 6px, #1e1610 6px 96px)', opacity: view === 'passage' ? 0.55 : 0.9}} />
      {/* ceiling beam */}
      <div style={{position: 'absolute', left: -700, top: 110, width: W + 1400, height: 60, background: '#0c0907'}} />
      {view === 'passage' && (
        // perspective of a long corridor: side walls converging to a dark vanishing point
        <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M0 0 L860 420 L860 640 L0 1080Z" fill="#17110c" />
          <path d="M1920 0 L1060 420 L1060 640 L1920 1080Z" fill="#17110c" />
          <rect x="860" y="420" width="200" height="220" fill="#020203" />
          {Array.from({length: 10}, (_, i) => <path key={i} d={`M${i * 86} ${i * 42} L${i * 86} ${1080 - i * 44}`} stroke="#241a12" strokeWidth="5" />)}
          {Array.from({length: 10}, (_, i) => <path key={'r' + i} d={`M${1920 - i * 86} ${i * 42} L${1920 - i * 86} ${1080 - i * 44}`} stroke="#241a12" strokeWidth="5" />)}
        </svg>
      )}
      {/* plank floor with nail heads */}
      <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 700, background: 'repeating-linear-gradient(0deg, #0a0706 0 4px, #2a1e14 4px 40px)'}} />
      {Array.from({length: 26}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: -300 + i * 110 + rnd(11, i) * 40, top: FLOOR + 14 + (i % 3) * 30, width: 10, height: 10, borderRadius: '50%', background: '#8a8f96', boxShadow: '0 0 4px rgba(200,210,220,.4)'}} />
      ))}
      {view === 'deep' && cloth && (
        <div style={{position: 'absolute', left: 1320, top: 380, width: 70, height: 220, background: '#0a0706'}}>
          <div style={{position: 'absolute', left: 6, top: 60, width: 60, height: 90, borderRadius: 18, background: '#d8d0c0', transform: 'rotate(8deg)'}} />
        </div>
      )}
      {/* the only light: from the doorway they came through */}
      {from !== 'none' && <Glow x={from === 'left' ? -60 : 1980} y={560} r={900} color="255,215,150" a={0.62 * flick} />}
      {view !== 'passage' && <Glow x={960} y={600} r={620} color="255,215,150" a={0.22} />}
      {view === 'passage' && <Glow x={960} y={530} r={260} color="255,215,150" a={0.08} />}
      <div style={{...full('radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 30%, rgba(0,0,0,.45) 90%)'), pointerEvents: 'none'}} />
    </>
  );
};
