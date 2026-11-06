import React from 'react';
import {rnd} from '../engine/anim';
import {full} from './world';
import {PerspFloor, Haze} from './depth';
import {LightVeil} from './room';

// ด่านตรวจปากซอย (from rear-cam, shared): a night police checkpoint where a side soi leaves the main road.
// Built in depth around one vanishing point: reflective cones running away toward the soi, a red-and-white barrier
// across the lane, a patrol pickup on the right whose roof beacon is the one light (red / blue alternating), a small
// tent with a folding table, and the dark soi beyond. Floor for actors: 930. Light at BEACON_AT.
//
//   <Checkpoint f={f} />                        manned: beacon on, barrier down
//   <Checkpoint f={f} empty />                  nobody there: cones knocked over, barrier up, beacon off, one street lamp
//   <Checkpoint f={f} raise={0..1} />           the barrier lifting

export const BEACON_AT: [number, number] = [1500, 330];

/** red or blue this frame (the beacon turns about twice a second) */
export const beaconColor = (f: number) => (Math.floor(f / 8) % 2 ? '255,60,60' : '70,120,255');

const Cone: React.FC<{x: number; y: number; s: number; down?: boolean}> = ({x, y, s, down}) => (
  <svg width={80 * s} height={120 * s} viewBox="0 0 80 120" style={{position: 'absolute', left: x - 40 * s, top: y - 120 * s, overflow: 'visible',
    transform: down ? 'rotate(82deg)' : undefined, transformOrigin: '50% 100%'}}>
    <path d="M30 0 L50 0 L72 110 L8 110 Z" fill="#e8642a" />
    <path d="M24 36 L56 36 L60 54 L20 54 Z M16 74 L64 74 L67 88 L13 88 Z" fill="#e8ecef" />
    <rect x="0" y="108" width="80" height="12" rx="3" fill="#2a1a12" />
  </svg>
);

export const Checkpoint: React.FC<{f: number; empty?: boolean; raise?: number; beacon?: boolean}> = ({f, empty, raise = 0, beacon = !empty}) => {
  const vx = 1050, vy = 460;
  const bc = beaconColor(f);
  const lift = empty ? 1 : raise;
  // cones along the right edge of the lane, shrinking toward the VP
  const cones = Array.from({length: 9}, (_, i) => {
    const t = 1 - i / 9;
    return {x: vx + (1450 - vx) * t + 40, y: vy + (1020 - vy) * t, s: 0.25 + 1.3 * t};
  });
  return (
    <>
      <div style={full('linear-gradient(#020306, #070a14 60%, #0d111c)')} />
      {/* the soi beyond: black, a power line, one far bulb */}
      <svg width={3320} height={500} viewBox="-700 0 3320 500" style={{position: 'absolute', left: -700, top: vy - 320}}>
        <path d={`M-700 320 ${Array.from({length: 34}, (_, i) => `Q${-650 + i * 100} ${230 + rnd(14, i) * 60} ${-600 + i * 100} 320`).join(' ')} L2700 500 L-700 500 Z`} fill="#04060a" />
        <path d="M-700 140 Q1100 210 2700 120" stroke="#11151c" strokeWidth="3" fill="none" />
      </svg>
      <div style={{position: 'absolute', left: 1030, top: vy - 20, width: 10, height: 10, borderRadius: 5, background: '#ffd890', boxShadow: '0 0 20px 8px rgba(255,210,140,.35)'}} />
      {/* asphalt + lane lines to the VP */}
      <div style={{position: 'absolute', left: -700, top: vy, width: 3320, height: 1200, background: 'linear-gradient(#0f1012, #1d1e21)'}} />
      <PerspFloor y={vy + 1} vx={vx} vy={vy - 30} bottom={1400} seams={10} rows={6} a={0.18} />
      <svg width={3320} height={900} viewBox={`-700 ${vy} 3320 900`} style={{position: 'absolute', left: -700, top: vy}}>
        {[0, 1, 2, 3, 4].map(i => {
          const t0 = 0.12 + i * 0.2, t1 = t0 + 0.09;
          const y0 = vy + (1100 - vy) * t0 * t0, y1 = vy + (1100 - vy) * t1 * t1;
          return <line key={i} x1={vx - 10 * t0} y1={y0} x2={vx - 90 * t1} y2={y1} stroke="#cfc57a" strokeWidth={4 + 14 * t1} opacity=".55" />;
        })}
      </svg>
      {/* soi sign on a pole, left */}
      <div style={{position: 'absolute', left: 300, top: 230, width: 14, height: 700, background: '#1a1c1f'}} />
      <div style={{position: 'absolute', left: 210, top: 210, width: 200, height: 70, background: '#1f4f8a', border: '5px solid #e8e8e8', borderRadius: 6,
        fontFamily: 'Plex Thai, sans-serif', fontWeight: 700, fontSize: 40, color: '#fff', textAlign: 'center', lineHeight: '60px'}}>ซอย ๑๑</div>
      {/* the tent: canvas roof, folding table, a battery lamp (off when empty) */}
      <svg width={560} height={420} viewBox="0 0 560 420" style={{position: 'absolute', left: -80, top: 520}}>
        <polygon points="20,80 540,80 500,10 60,10" fill="#2a3a2c" stroke="#0c120c" strokeWidth="5" />
        {[40, 520].map(x => <rect key={x} x={x - 6} y="80" width="12" height="330" fill="#3a3c40" />)}
        <rect x="120" y="260" width="320" height="18" fill="#7a7468" />
        {[140, 420].map(x => <rect key={x} x={x} y="278" width="10" height="130" fill="#4a4640" />)}
        {empty ? <rect x="380" y="330" width="90" height="16" fill="#3a3632" transform="rotate(70 425 338)" /> : <rect x="180" y="226" width="34" height="34" fill="#e8e0b0" />}
        <rect x="300" y="244" width="70" height="16" fill={empty ? '#2a2620' : '#1a1a1a'} />
      </svg>
      {!empty && <div style={{position: 'absolute', left: 60, top: 680, width: 340, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,240,190,.3), rgba(0,0,0,0) 70%)'}} />}
      {/* the patrol pickup, right, nose toward the camera */}
      {!empty && (
        <svg width={720} height={460} viewBox="0 0 720 460" style={{position: 'absolute', left: 1240, top: 470}}>
          <rect x="40" y="120" width="640" height="250" rx="40" fill="#e6e3da" stroke="#0b0c0d" strokeWidth="6" />
          <rect x="120" y="40" width="380" height="120" rx="24" fill="#d8d5cc" stroke="#0b0c0d" strokeWidth="6" />
          <rect x="150" y="62" width="320" height="80" rx="12" fill="#1c2430" />
          <rect x="40" y="260" width="640" height="30" fill="#1f3a78" />
          <text x="360" y="246" textAnchor="middle" fontSize="40" fontWeight="700" fill="#1f3a78" fontFamily="Plex Thai, sans-serif">ตำรวจ</text>
          {[140, 580].map(x => <circle key={x} cx={x} cy="380" r="62" fill="#0a0b0c" />)}
          <rect x="210" y="10" width="200" height="36" rx="10" fill={beacon ? `rgb(${bc})` : '#2a1414'} />
        </svg>
      )}
      {beacon && (
        <>
          <div style={{position: 'absolute', left: BEACON_AT[0] - 900, top: BEACON_AT[1] - 700, width: 1800, height: 1400, borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen',
            background: `radial-gradient(ellipse, rgba(${bc},.32), rgba(${bc},0) 60%)`}} />
          <div style={{position: 'absolute', left: BEACON_AT[0] - 80, top: BEACON_AT[1] - 80, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, rgba(${bc},.9), rgba(${bc},0) 70%)`}} />
        </>
      )}
      {/* the barrier across the lane: pivots up from its left post */}
      <div style={{position: 'absolute', left: 520, top: 720, width: 26, height: 210, background: '#d8d8d4'}} />
      <div style={{position: 'absolute', left: 530, top: 720, width: 900, height: 34, transformOrigin: '0 50%', transform: `rotate(${-lift * 62}deg)`,
        background: 'repeating-linear-gradient(90deg, #d32f2f 0 90px, #f2f2ee 90px 180px)', border: '3px solid #111', boxSizing: 'border-box'}} />
      {cones.map((c, i) => <Cone key={i} x={c.x} y={c.y} s={c.s} down={empty && (i === 2 || i === 5)} />)}
      {empty && (
        // one orange street lamp, the only light left
        <>
          <div style={{position: 'absolute', left: 280, top: 160, width: 120, height: 22, borderRadius: 10, background: '#ffb35a', boxShadow: '0 0 70px 26px rgba(255,170,80,.45)'}} />
          <div style={{position: 'absolute', left: -100, top: 400, width: 1000, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,170,80,.22), rgba(0,0,0,0) 65%)'}} />
        </>
      )}
      <Haze y={560} h={220} f={f} a={0.08} />
      <LightVeil id="ckpt" lights={empty ? [[340, 600, 640]] : [[BEACON_AT[0], BEACON_AT[1] + 260, 820], [260, 760, 300]]} o={0.42} />
    </>
  );
};
