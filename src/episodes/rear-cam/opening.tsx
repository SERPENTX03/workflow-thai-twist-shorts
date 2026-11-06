import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {Stage} from '../../kit/stage';
import {CemeteryGate, Grave, Tamarind} from '../../kit/cemetery';
import {Haze} from '../../kit/depth';
import {JayBike} from './cast';

// The first two pictures of the film. They have to say, with the sound off, within a second:
//   soi11-high  one rider, alone, on a pale road through the middle of a graveyard, heading for the gate
//   wheel-low   the bike is right here, fast, on gravel, its headlight the only thing holding the dark back
// The high view returns at dawn (dawn-high, shot 347): same road, same gate, a patrol truck where Jay was.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const K = (p: ShotProps) => kf(p.f, [[0, 0], [p.len, 1]]);
const noCam = (p: ShotProps): ShotProps => ({...p, shot: {...p.shot, data: {...D(p), cam: undefined}}});

// ---------------------------------------------------------------- the road from above

/** the road's centre at t (0 near, bottom left .. 1 far, top right), and its width there */
const roadAt = (t: number) => ({x: -220 + 2520 * t, y: 1000 - 610 * t - 36 * Math.sin(t * Math.PI * 2), w: 300 - 190 * t});
const roadSlope = (t: number) => {
  const a = roadAt(t - 0.01), b = roadAt(t + 0.01);
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
};
const roadEdges = () => {
  const n = 40, top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const r = roadAt(i / n);
    top.push(`${r.x},${r.y - r.w / 2}`);
    bot.unshift(`${r.x},${r.y + r.w / 2}`);
  }
  return [...top, ...bot].join(' ');
};
/** graves in rows on both sides of the road, never on it, far ones first so near ones overlap them */
const GRAVES = Array.from({length: 70}, (_, i) => {
  const x = -80 + rnd(401, i) * 2360, y = 60 + rnd(402, i) * 1100;
  const t = (x + 220) / 2520;
  const r = roadAt(Math.max(0, Math.min(1, t)));
  return {i, x, y, off: Math.abs(y - r.y) - r.w / 2, s: 0.42 + (y / 1080) * 0.72, lean: (rnd(403, i) - 0.5) * 16, kind: Math.floor(rnd(404, i) * 3)};
}).filter(g => g.off > 60 + g.s * 40).sort((a, b) => a.y - b.y);

const PatrolTruck: React.FC<{f: number}> = ({f}) => (
  <svg width={560} height={260} viewBox="0 0 560 260" style={{position: 'absolute', left: -280, top: -230, overflow: 'visible'}}>
    <path d="M20 190 L20 130 L250 130 L300 50 L440 50 L500 130 L545 150 L545 190 Z" fill="#e8e4d8" stroke="#1a1a1c" strokeWidth="6" />
    <path d="M316 66 L430 66 L478 128 L286 128 Z" fill="#2a3a4c" />
    <rect x="20" y="146" width="525" height="18" fill="#2e4f86" />
    {[120, 450].map(x => <circle key={x} cx={x} cy="196" r="44" fill="#0c0d0f" stroke="#55585e" strokeWidth="10" />)}
    <rect x="340" y="30" width="80" height="20" rx="6" fill={Math.floor(f / 12) % 2 ? '#d83a30' : '#3560c8'} />
  </svg>
);

const HighRoad: ShotComponent = p => {
  const d = D(p);
  const dawn = d.light === 'dawn';
  const k = K(p);
  const t = dawn ? 0.42 + k * 0.09 : 0.36 + k * 0.17;
  const at = roadAt(t);
  const rot = roadSlope(t);
  const scale = 0.72 - t * 0.42;
  const rad = (rot * Math.PI) / 180;
  // the lamp sits ahead of the wheel and up off the road, in the bike's own rotated frame (places.tsx: 196, -254)
  const lx = at.x + (196 * Math.cos(rad) + 254 * Math.sin(rad)) * scale;
  const ly = at.y + (196 * Math.sin(rad) - 254 * Math.cos(rad)) * scale;
  const far = roadAt(t + 0.27), farW = far.w * 1.25;
  const gate = roadAt(0.73);
  return (
    <Stage p={p} light="warm" world={
      <>
        {/* the ground, seen from up in the tree: no sky at all */}
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: dawn ? 'linear-gradient(#57566a, #3a3a44)' : 'linear-gradient(#20252e, #15181d)'}} />
        {Array.from({length: 150}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: -200 + rnd(405, i) * 2500, top: rnd(406, i) * 1200, width: 40 + rnd(407, i) * 110, height: 12 + rnd(408, i) * 26, borderRadius: '50%', background: dawn ? 'rgba(40,46,44,.35)' : 'rgba(0,0,0,.26)'}} />
        ))}
        {/* the pale laterite road and its two ruts */}
        <svg width={3320} height={2080} viewBox="-700 -500 3320 2080" style={{position: 'absolute', left: -700, top: -500}}>
          <polygon points={roadEdges()} fill={dawn ? '#a9937a' : '#6d6050'} stroke={dawn ? '#6a5a4a' : '#2c2720'} strokeWidth="8" />
          {[-0.2, 0.2].map(q => {
            const pts = Array.from({length: 41}, (_, i) => {
              const r = roadAt(i / 40);
              return `${r.x},${r.y + q * r.w}`;
            }).join(' ');
            return <polyline key={q} points={pts} stroke="rgba(0,0,0,.26)" strokeWidth="13" fill="none" />;
          })}
          {Array.from({length: 240}, (_, i) => {
            const r = roadAt(rnd(409, i));
            return <circle key={i} cx={r.x + (rnd(410, i) - 0.5) * 90} cy={r.y + (rnd(411, i) - 0.5) * r.w * 0.9} r={1.5 + rnd(412, i) * 3} fill={dawn ? 'rgba(90,70,50,.5)' : 'rgba(30,24,18,.5)'} />;
          })}
        </svg>
        {/* graves: chedi and slab, whitewash catching the moon */}
        {GRAVES.filter(g => g.y < roadAt(Math.max(0, Math.min(1, (g.x + 220) / 2520))).y).map(g => <Grave key={g.i} x={g.x} y={g.y} s={g.s} tone="dawn" lean={g.lean} kind={g.kind} />)}
        {/* the arch at the far end of the road, the way out, against pale fog */}
        <div style={{position: 'absolute', left: gate.x - 340, top: gate.y - 360, width: 680, height: 480, borderRadius: '50%', background: dawn ? 'radial-gradient(ellipse, rgba(255,214,150,.7), rgba(255,214,150,0) 68%)' : 'radial-gradient(ellipse, rgba(170,185,215,.62), rgba(170,185,215,0) 68%)'}} />
        <CemeteryGate x={gate.x} y={gate.y + 18} s={0.4} tone={dawn ? 'dawn' : 'night'} ink={!dawn} />
        {GRAVES.filter(g => g.y >= roadAt(Math.max(0, Math.min(1, (g.x + 220) / 2520))).y).map(g => <Grave key={g.i} x={g.x} y={g.y} s={g.s} tone="dawn" lean={g.lean} kind={g.kind} />)}
        <Haze y={380} h={300} f={p.f} a={dawn ? 0.08 : 0.16} color={dawn ? '255,226,190' : '170,180,205'} />
        {dawn ? (
          <>
            <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: 'linear-gradient(100deg, rgba(0,0,0,0) 30%, rgba(255,186,100,.62))', mixBlendMode: 'screen'}} />
            <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: 'rgba(255,170,90,.1)'}} />
            <div style={{position: 'absolute', left: at.x, top: at.y, width: 0, height: 0, transform: `rotate(${rot}deg) scale(${scale * 0.92})`}}><PatrolTruck f={p.f} /></div>
          </>
        ) : (
          <>
            {/* the dark closes in on everything but the rider's pool: the eye goes to him first */}
            <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: `radial-gradient(ellipse 1050px 680px at ${lx + 240 + 700}px ${ly + 500}px, rgba(3,5,12,0) 28%, rgba(3,5,12,.5) 62%, rgba(3,5,12,.78) 100%)`}} />
            <div style={{position: 'absolute', left: -700, top: 760, width: 3320, height: 500, background: 'linear-gradient(rgba(3,5,12,0), rgba(3,5,12,.62) 55%)'}} />
            {/* dust dragged behind the bike: lit by nothing but its tail light, it goes from red to grey */}
            {Array.from({length: 8}, (_, i) => {
              const r = roadAt(t - 0.045 - i * 0.03);
              const up = 30 + i * 14 + rnd(428, i) * 26;
              return <div key={i} style={{position: 'absolute', left: r.x - 70 - i * 12, top: r.y - up - 50, width: 140 + i * 26, height: 80 + i * 13, borderRadius: '50%', background: `rgba(${i < 2 ? '170,92,76' : '128,118,106'},${0.3 - i * 0.034})`, filter: 'blur(11px)'}} />;
            })}
            {/* the beam lying along the road toward the gate */}
            <svg width={3320} height={2080} viewBox="-700 -500 3320 2080" style={{position: 'absolute', left: -700, top: -500, mixBlendMode: 'screen', pointerEvents: 'none'}}>
              <defs>
                <linearGradient id="high-beam" gradientUnits="userSpaceOnUse" x1={lx} y1={ly} x2={far.x} y2={far.y}>
                  <stop offset="0" stopColor="#fff4cc" stopOpacity="1" /><stop offset=".45" stopColor="#ffeeb8" stopOpacity=".62" /><stop offset="1" stopColor="#ffeeb8" stopOpacity="0" />
                </linearGradient>
                <filter id="high-soft"><feGaussianBlur stdDeviation="9" /></filter>
              </defs>
              <polygon points={`${lx},${ly - 6} ${far.x},${far.y - farW} ${far.x},${far.y + farW * 0.75} ${lx},${ly + 6}`} fill="url(#high-beam)" filter="url(#high-soft)" />
            </svg>
            <div style={{position: 'absolute', left: at.x, top: at.y, width: 0, height: 0, transform: `rotate(${rot}deg)`}}>
              <JayBike x={0} y={0} scale={scale} f={p.f} face="wary" rec spin={p.f * 14} />
              {/* tail light */}
              <div style={{position: 'absolute', left: -292 * scale, top: -205 * scale, width: 22, height: 14, borderRadius: 6, background: '#ff2a20', boxShadow: '0 0 34px 14px rgba(255,44,32,.6)'}} />
            </div>
            {/* the lamp: the brightest thing in the film so far */}
            <div style={{position: 'absolute', left: lx - 110, top: ly - 110, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, #fff 0 12%, rgba(255,242,200,.75) 24%, rgba(255,240,200,0) 70%)'}} />
          </>
        )}
      </>
    } fore={
      // what the camera is sitting in: the old tamarind's branches across the top of the frame
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d="M-60 300 Q240 170 520 120 Q700 90 900 -40" stroke={dawn ? '#1c1a22' : '#020305'} strokeWidth="44" fill="none" strokeLinecap="round" />
        <path d="M250 170 Q340 240 470 250 M1980 170 Q1700 90 1440 -40" stroke={dawn ? '#1c1a22' : '#020305'} strokeWidth="28" fill="none" strokeLinecap="round" />
        {Array.from({length: 110}, (_, i) => {
          const q = rnd(413, i), left = i % 3 !== 0;
          const x = left ? q * 900 - 40 : 1480 + q * 480, y = (left ? 215 - q * 240 : 70 - q * 60) + (rnd(414, i) - 0.5) * 120;
          return <ellipse key={i} cx={x} cy={y} rx={22 + rnd(415, i) * 30} ry={9 + rnd(416, i) * 9} fill={dawn ? '#1c1a22' : '#020305'} transform={`rotate(${rnd(417, i) * 120 - 60} ${x} ${y})`} />;
        })}
      </svg>
    } foreBlur={6} foreDark={0.1} />
  );
};

// ---------------------------------------------------------------- the front wheel at ground level

const WheelLow: ShotComponent = p => {
  const k = K(p);
  // JayBike at scale 3: the real bike and rider, framed on its front wheel and lamp. Wheel centre and lamp in world px.
  const BX = 100, BY = 960, S = 3;
  const wx = BX + 108 * 1.65 * S, wy = BY - 54 * 1.65 * S, wr = 60 * 1.65 * S;
  const lx = BX + 195 * S, ly = BY - 254 * S;
  const flick = 0.94 + 0.06 * Math.sin(p.f / 2.3);
  const shake = Math.sin(p.f / 1.3) * 3;
  return (
    <Stage p={noCam(p)} light="warm" cam={[1, 1.05, 930, 540]} world={
      <>
        {/* the night and the fog the lamp is pushing into */}
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 1320, background: 'linear-gradient(#04060c, #0d1320)'}} />
        <Tamarind x={1660 - k * 60} y={800} s={1.25} seed={21} />
        <div style={{position: 'absolute', left: 620, top: -60, width: 1700, height: 1010, borderRadius: '50%', background: 'radial-gradient(ellipse at 42% 50%, rgba(255,246,216,.95), rgba(240,232,205,.55) 34%, rgba(200,205,215,.16) 62%, rgba(0,0,0,0) 76%)'}} />
        {/* the road: gravel lit to the right, gone to black under and behind the wheel */}
        <div style={{position: 'absolute', left: -700, top: 780, width: 3320, height: 800, background: 'linear-gradient(90deg, #0c0c0c 0 34%, #5e5244 52%, #a9947a 72%, #8a7a66)'}} />
        {/* the beam, thrown forward and down, spreading into the fog */}
        <svg width={3320} height={2080} viewBox="-700 -500 3320 2080" style={{position: 'absolute', left: -700, top: -500, mixBlendMode: 'screen', pointerEvents: 'none'}}>
          <defs>
            <linearGradient id="wheel-beam" gradientUnits="userSpaceOnUse" x1={lx} y1={ly} x2={lx + 1400} y2={ly + 180}>
              <stop offset="0" stopColor="#fff6d2" stopOpacity={0.95 * flick} /><stop offset="1" stopColor="#fff0c0" stopOpacity="0" />
            </linearGradient>
            <filter id="wheel-soft"><feGaussianBlur stdDeviation="22" /></filter>
          </defs>
          <polygon points={`${lx},${ly - 26} ${lx + 1500},${ly - 330} ${lx + 1500},${ly + 800} ${lx},${ly + 26}`} fill="url(#wheel-beam)" filter="url(#wheel-soft)" />
        </svg>
        {/* the leaning graves, black against the lit fog, going slowly by */}
        {([[1130, 812, 1.7, -8, 0], [1440, 818, 2.5, 6, 1], [1800, 826, 3.2, -11, 0], [2150, 830, 3.6, 7, 1]] as const).map(([x, y, s, lean, kind], i) => (
          <Grave key={i} x={x - k * (24 + i * 16)} y={y} s={s} lean={lean} kind={kind} ink />
        ))}
        <Haze y={640} h={240} f={p.f} a={0.2} color="255,244,214" />
        {/* gravel racing back under the camera: streaks, longer the nearer they are */}
        {Array.from({length: 90}, (_, i) => {
          const q = rnd(421, i), y = 800 + q * q * 300, near = (y - 800) / 300;
          const x = (((rnd(422, i) * 2600 - p.f * (20 + near * 44)) % 2600) + 2600) % 2600 - 300;
          const lit = Math.max(0.12, Math.min(1, (x - 500) / 700));
          return <div key={i} style={{position: 'absolute', left: x, top: y, width: 6 + near * 60, height: 2 + near * 5, borderRadius: 8, filter: `blur(${0.5 + near * 2}px)`, background: i % 3 ? `rgba(32,24,16,${0.3 + 0.35 * near})` : `rgba(255,238,200,${0.75 * lit})`}} />;
        })}
        {/* the real bike. The tread and the blur go over its wheel */}
        <div style={{position: 'absolute', left: 0, top: shake, width: 0, height: 0}}>
          <JayBike x={BX} y={BY} scale={S} f={p.f} face="wary" rec spin={p.f * 11} />
        </div>
        <svg width={1920} height={1200} style={{position: 'absolute', left: 0, top: shake, overflow: 'visible', pointerEvents: 'none', zIndex: 30}}>
          <g transform={`translate(${wx} ${wy})`}>
            {Array.from({length: 44}, (_, i) => {
              const a = ((i / 44) * 360 + p.f * 11) % 360;
              return a > 150 && a < 320 ? null : <rect key={i} x={wr - 22} y={-9} width={32} height={18} rx={3} fill="#05060a" transform={`rotate(${a})`} />;
            })}
          </g>
          {/* the lamp's light bouncing off the road onto the leading edge of the wheel */}
          <path d={`M${wx + wr * 0.72} ${wy - wr * 0.68} A${wr} ${wr} 0 0 1 ${wx + wr * 0.8} ${wy + wr * 0.58}`} stroke="rgba(255,236,190,.55)" strokeWidth="11" fill="none" strokeLinecap="round" />
        </svg>
        {/* stones and dust thrown back off the tyre */}
        {Array.from({length: 40}, (_, i) => {
          const q = ((p.f * (0.02 + rnd(423, i) * 0.03) + rnd(424, i)) % 1);
          const x = wx - 30 - q * (420 + rnd(425, i) * 760), y = wy + wr - 8 - Math.sin(q * Math.PI) * (50 + rnd(426, i) * 210);
          const r = 7 + rnd(427, i) * 24;
          return <div key={i} style={{position: 'absolute', zIndex: 31, left: x, top: y, width: r, height: r * 0.78, borderRadius: '42%', background: i % 3 ? '#4a3c2c' : '#e0c49a', transform: `rotate(${p.f * 17 + i * 40}deg)`}} />;
        })}
        {Array.from({length: 6}, (_, i) => <div key={'d' + i} style={{position: 'absolute', left: wx - 480 - i * 120, top: wy + wr - 170 - i * 22, width: 460, height: 230, borderRadius: '50%', background: `rgba(150,130,104,${0.3 - i * 0.04})`, filter: 'blur(24px)'}} />)}
        {/* the lamp breaking into a star in the wet air */}
        <svg width={1400} height={1000} viewBox="-700 -500 1400 1000" style={{position: 'absolute', left: lx + 18 - 700, top: ly - 12 - 500 + shake, pointerEvents: 'none', zIndex: 32}}>
          <defs>
            <radialGradient id="wheel-halo"><stop offset="0" stopColor="#fff" /><stop offset=".18" stopColor="#fff4cf" stopOpacity=".9" /><stop offset=".5" stopColor="#ffe9b0" stopOpacity=".25" /><stop offset="1" stopColor="#ffe9b0" stopOpacity="0" /></radialGradient>
          </defs>
          {Array.from({length: 8}, (_, i) => {
            const a = i * 45 + 12, forward = a < 80 || a > 280;
            const len = (forward ? (i % 2 ? 340 : 640) : 170) * flick;
            return <polygon key={i} points={`0,-9 ${len},0 0,9`} fill="#fff6d8" opacity=".85" transform={`rotate(${a})`} />;
          })}
          <circle r="250" fill="url(#wheel-halo)" />
          <ellipse rx="34" ry="56" fill="#fff" />
        </svg>
      </>
    } />
  );
};

export const OPENING: Record<string, ShotComponent> = {'soi11-high': HighRoad, 'dawn-high': HighRoad, 'wheel-low': WheelLow};
