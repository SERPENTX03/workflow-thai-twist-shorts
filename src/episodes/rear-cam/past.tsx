import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {Stage} from '../../kit/stage';
import {Cctv} from '../../kit/pov';
import {CemeteryRoad, Grave, Headlight, Sala8} from '../../kit/cemetery';
import {Haze} from '../../kit/depth';
import {full} from '../../kit/world';
import {FallenBike, Sedan} from '../../kit/vehicles';

// Flashbacks (data.past: the warm desaturated memory look from Stage, one size tighter, heavier vignette):
//   CH1  crash-wide · driver-low · file-cctv        Jay's crash a year ago, the rear camera that cleared him
//   CH2  rider-sil · curve-low · road-high · sala-fif  the legend Chat tells (Tom, ten years ago — no face shown)
//   CH9  board-ins · stake-fif · road-high            Teer's investigation, Chat's confession

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;

/** a generic sedan side-on (the car that hit them), headlights on */

/** the fallen scooter on its side */

const Intersection: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={full('linear-gradient(#141826, #2a2c38)')} />
    {/* shophouse fronts across the junction */}
    {Array.from({length: 7}, (_, i) => <div key={i} style={{position: 'absolute', left: -300 + i * 360, top: 230, width: 340, height: 290, background: i % 2 ? '#3a3430' : '#443c34',
      borderTop: '18px solid #2a2420'}}><div style={{position: 'absolute', left: 30, top: 60, width: 120, height: 90, background: i === 2 ? '#e8c87a' : '#1c1a18'}} /></div>)}
    <div style={{position: 'absolute', left: -700, top: 520, width: 3320, height: 1000, background: 'linear-gradient(#3a3b3e, #2c2d30)'}} />
    {/* the street lamp that lights the junction */}
    <div style={{position: 'absolute', left: 820, top: 60, width: 18, height: 470, background: '#1a1a1a'}} />
    <div style={{position: 'absolute', left: 780, top: 50, width: 120, height: 26, borderRadius: 10, background: '#fff1c4', boxShadow: '0 0 60px 20px rgba(255,220,150,.5)'}} />
    <div style={{position: 'absolute', left: 240, top: 500, width: 1300, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,215,150,.32), rgba(255,215,150,0) 70%)'}} />
    {[0, 1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{position: 'absolute', left: -200 + i * 320, top: 760, width: 180, height: 14, background: '#d8cf8a', opacity: 0.6}} />)}
    {/* the traffic light, red */}
    <div style={{position: 'absolute', left: 1540, top: 120, width: 26, height: 420, background: '#111'}} />
    <div style={{position: 'absolute', left: 1500, top: 120, width: 110, height: 270, borderRadius: 18, background: '#0c0d0e'}} />
    <div style={{position: 'absolute', left: 1525, top: 140, width: 60, height: 60, borderRadius: '50%', background: '#ff3b30', boxShadow: '0 0 60px 20px rgba(255,59,48,.4)'}} />
    <div style={{position: 'absolute', left: 1400, top: 80, width: 300, height: 600, background: 'radial-gradient(ellipse, rgba(255,60,50,.12), rgba(0,0,0,0) 70%)'}} />
  </>
);

const PastScene: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? '';
  const data = {...d, past: true};
  const pp = {...p, shot: {...p.shot, data}};
  const k = kf(p.f, [[0, 0], [p.len, 1]]);
  if (v === 'crash-wide') {
    return (
      <Stage p={pp} light="lamp" cam={[1.05, 1.12, 960, 560]} world={
        <>
          <Intersection f={p.f} />
          <Sedan x={1100 - k * 60} y={800} s={0.9} c="#5a6270" />
          <FallenBike x={620 - k * 80} y={820} s={0.8} rot={-12 - k * 10} />
          {/* sparks off the stand on the asphalt */}
          {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: 700 + rnd(91, i) * 200 - k * 80, top: 850 - rnd(92, i) * 90, width: 6, height: 6, borderRadius: 3,
            background: '#ffd27a', boxShadow: '0 0 10px 4px rgba(255,200,100,.6)', opacity: (i + Math.floor(p.f / 2)) % 3 ? 1 : 0}} />)}
        </>
      } />
    );
  }
  if (v === 'driver-low') {
    return (
      <Stage p={pp} light="lamp" cam={[1.1, 1.14, 960, 520]} world={
        <>
          <Intersection f={p.f} />
          {/* the driver from below: a dark figure pointing down at the lens; a policeman writing, out of focus behind */}
          <div style={{position: 'absolute', left: 1220, top: 200, width: 220, height: 600, borderRadius: '40% 40% 0 0', background: '#4a3b2c', filter: 'blur(8px)', opacity: 0.7}} />
          <svg width={900} height={1080} viewBox="0 0 900 1080" style={{position: 'absolute', left: 420, top: -40}}>
            <path d="M260 1080 L300 420 Q400 360 520 420 L580 1080 Z" fill="#1c2430" />
            <circle cx="410" cy="300" r="120" fill="#c48c62" />
            <path d="M300 250 Q410 150 520 250 L520 210 Q410 120 300 210 Z" fill="#111" />
            <path d="M500 470 L760 760" stroke="#1c2430" strokeWidth="80" strokeLinecap="round" />
            <circle cx="780" cy="780" r="38" fill="#c48c62" />
            <path d="M360 340 Q410 320 460 340" stroke="#3a1a14" strokeWidth="10" fill="none" />
          </svg>
        </>
      } />
    );
  }
  if (v === 'file-cctv') {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Cctv W={p.W} H={p.H} f={p.f} cam="REAR · เจย์" time="23:41:16" tint="grey">
          <Stage p={{...pp, shot: {...pp.shot, data: {...data, hud: undefined}}}} light="lamp" cam={[1, 1, 960, 540]} grain={0} world={
            <>
              <Intersection f={p.f} />
              <Sedan x={300 + k * 700} y={860 - k * 60} s={1.1} c="#8a929e" />
              <div style={{position: 'absolute', left: 560 + k * 500, top: 700, width: 600, height: 20, background: '#ffcf4a', transform: 'rotate(-6deg)', opacity: 0.55}} />
            </>
          } />
        </Cctv>
      </AbsoluteFill>
    );
  }
  if (v === 'rider-sil') {
    return (
      <Stage p={pp} light="lantern" cam={[1.25, 1.3, 1000, 600]} world={
        <>
          <CemeteryRoad f={p.f} horizon={600} vx={1000} road={false} />
          <Sala8 x={1000} y={980} s={0.95} box="placed" lit={0.8} />
          {/* funeral candles on the table, and the rider as a dark shape with no face */}
          {[860, 1140].map(x => <div key={x} style={{position: 'absolute', left: x, top: 660, width: 12, height: 50, background: '#f2e8c8', boxShadow: '0 -20px 30px 10px rgba(255,200,120,.45)'}} />)}
          <div style={{position: 'absolute', left: 1160, top: 440, width: 160, height: 420, borderRadius: '60px 60px 10px 10px', background: '#08080a'}} />
          <div style={{position: 'absolute', left: 1180, top: 360, width: 120, height: 120, borderRadius: '50%', background: '#08080a'}} />
        </>
      } />
    );
  }
  if (v === 'curve-low') {
    return (
      <Stage p={pp} light="night" cam={[1, 1.1, 960, 560]} world={
        <>
          <CemeteryRoad f={p.f} horizon={640} vx={700} />
          <div style={{position: 'absolute', left: 1040, top: 660, width: 70, height: 50, borderRadius: 14, background: '#0a0b0c'}} />
          <div style={{position: 'absolute', left: 1080, top: 664, width: 10, height: 10, borderRadius: 5, background: '#ff3b30'}} />
          {/* the car's headlights rushing at the lens */}
          {[300, 560].map(x => <div key={x} style={{position: 'absolute', left: x - 120 * (1 + k * 2), top: 620 - 120 * (1 + k * 2), width: 240 * (1 + k * 2), height: 240 * (1 + k * 2), borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,250,225,.95), rgba(255,240,200,0) 70%)'}} />)}
          <div style={{position: 'absolute', inset: -400, background: `rgba(255,245,220,${0.3 * k})`, mixBlendMode: 'screen'}} />
        </>
      } />
    );
  }
  if (v === 'road-high') {
    const many = !!d.passing;
    return (
      <Stage p={pp} light="night" cam={[1, 1.04, 960, 540]} world={
        <>
          {/* straight down on the gravel: the helmet stopped by the wheel that still turns, tail lights going away */}
          <div style={full('#1d1b18')} />
          {/* the fallen bike's headlight, still on, pooling across the gravel: the only light */}
          <div style={{position: 'absolute', left: 200, top: 120, width: 1600, height: 900, borderRadius: '50%', background: 'radial-gradient(ellipse at 40% 55%, rgba(255,230,170,.42), rgba(255,230,170,0) 62%)'}} />
          {Array.from({length: 300}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(101, i) * 1920, top: rnd(102, i) * 1080, width: 6 + rnd(103, i) * 8, height: 5 + rnd(104, i) * 6, borderRadius: 3, background: '#3a342a'}} />)}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <g transform={`translate(820 600) rotate(${p.f * 3})`}>
              <circle r="190" fill="none" stroke="#0a0a0b" strokeWidth="56" />
              {Array.from({length: 8}, (_, i) => <line key={i} x1="0" y1="0" x2={Math.cos(i * 0.785) * 170} y2={Math.sin(i * 0.785) * 170} stroke="#3a3e44" strokeWidth="8" />)}
            </g>
            <ellipse cx="1180" cy="520" rx="130" ry="110" fill="#1b1e23" stroke="#050506" strokeWidth="8" />
            <path d="M1100 470 Q1180 430 1260 470" stroke="rgba(255,255,255,.14)" strokeWidth="10" fill="none" />
          </svg>
          {/* tail lights streaming away up the frame (one in CH2, a stream of cars in CH9) */}
          {(many ? [0, 1, 2, 3] : [0]).map(i => {
            const t = ((k + i * 0.25) % 1);
            return <div key={i} style={{position: 'absolute', left: 1500 - t * 300, top: 980 - t * 900, width: 40 * (1 - t * 0.6), height: 16, borderRadius: 8, background: '#ff2a20',
              boxShadow: '0 0 30px 10px rgba(255,40,30,.5)', opacity: 1 - t * 0.5}} />;
          })}
        </>
      } />
    );
  }
  if (v === 'sala-fif') {
    return (
      <Stage p={pp} light="lantern" cam={[1.2, 1.26, 1000, 620]} world={
        <>
          <CemeteryRoad f={p.f} horizon={600} vx={1000} road={false} />
          <Sala8 x={1000} y={980} s={0.95} box="placed" lit={0.4} />
          {/* one incense stick burnt half way, its smoke straight up */}
          <div style={{position: 'absolute', left: 1086, top: 660, width: 4, height: 50, background: '#a86a3a'}} />
          <div style={{position: 'absolute', left: 1086, top: 656, width: 6, height: 6, borderRadius: 3, background: '#ff7a3a', boxShadow: '0 0 12px 4px rgba(255,120,60,.6)'}} />
          {Array.from({length: 8}, (_, i) => <div key={i} style={{position: 'absolute', left: 1080 + Math.sin(p.f / 12 + i) * 8, top: 640 - i * 30, width: 14, height: 30, borderRadius: 7, background: 'rgba(200,200,210,.12)'}} />)}
          <Haze y={840} h={200} f={p.f} a={0.18} />
        </>
      } fore={<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><rect x="-40" y="-40" width="560" height="1160" fill="#060607" /><rect x="1620" y="-40" width="360" height="1160" fill="#060607" /></svg>}
        foreBlur={10} foreDark={0.6} />
    );
  }
  if (v === 'board-ins') {
    return (
      <Stage p={pp} light="lamp" cam={[1, 1.06, 960, 520]} world={
        <>
          <div style={full('#1c1a16')} />
          <div style={{position: 'absolute', left: 260, top: 120, width: 1400, height: 760, background: '#e8e6e0', border: '14px solid #555'}} />
          {Array.from({length: 6}, (_, i) => {
            const x = 340 + (i % 3) * 440, y = 170 + Math.floor(i / 3) * 520;
            return (
              <React.Fragment key={i}>
                <div style={{position: 'absolute', left: x, top: y, width: 160, height: 200, background: '#9aa0a6', border: '6px solid #fff', transform: `rotate(${(rnd(111, i) - 0.5) * 8}deg)`}} />
                <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><line x1={x + 80} y1={y + 100} x2={960} y2={500} stroke="#c0392b" strokeWidth="5" /></svg>
              </React.Fragment>
            );
          })}
          {/* the one photo in the middle: an orange vest, number 17 */}
          <div style={{position: 'absolute', left: 860, top: 400, width: 200, height: 240, background: '#c8642e', border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 900, fontSize: 80, color: '#fff'}}>17</div>
          <div style={{position: 'absolute', left: 1500, top: -60, width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,214,150,.35), rgba(0,0,0,0) 70%)'}} />
        </>
      } />
    );
  }
  if (v === 'stake-fif') {
    return (
      <Stage p={pp} light="night" cam={[1.05, 1.1, 960, 560]} world={
        <>
          <div style={full('linear-gradient(#0a0f1c, #26304a)')} />
          {/* the moon over the path: the only thing that gives the men and the bike an edge */}
          <div style={{position: 'absolute', left: 500, top: 120, width: 1000, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(190,205,235,.65), rgba(190,205,235,0) 68%)'}} />
          <div style={{position: 'absolute', left: -700, top: 620, width: 3320, height: 800, background: '#14130f'}} />
          <svg width={3320} height={500} viewBox="-700 620 3320 500" style={{position: 'absolute', left: -700, top: 620}}>
            <polygon points="900,620 1000,620 1500,1120 400,1120" fill="#3a3226" />
          </svg>
          {/* three officers crouched in the scrub, torches off; the unlit bike slipping past, only a rim of wheel */}
          {[300, 520, 1540].map((x, i) => <div key={x} style={{position: 'absolute', left: x, top: 640 + i * 10, width: 150, height: 220, borderRadius: '60px 60px 10px 10px', background: '#05070a', boxShadow: '0 0 0 3px rgba(190,205,235,.4)'}} />)}
          <div style={{position: 'absolute', left: 1580, top: 690, width: 26, height: 26, borderRadius: '50%', background: 'rgba(160,255,190,.5)'}} />
          {d.ghostBike && <div style={{position: 'absolute', left: 1300 - k * 900, top: 760, width: 260, height: 120, borderRadius: '50%', border: '9px solid rgba(225,235,250,.8)', borderBottomColor: 'transparent', borderLeftColor: 'transparent'}} />}
        </>
      } fore={<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 14}, (_, i) => <path key={i} d={`M${rnd(121, i) * 1920} 1100 Q${rnd(122, i) * 1920} ${500 + rnd(123, i) * 300} ${rnd(124, i) * 1920} ${300 + rnd(125, i) * 300}`} stroke="#030304" strokeWidth={20 + rnd(126, i) * 30} fill="none" />)}
      </svg>} foreBlur={12} foreDark={0.35} />
    );
  }
  // fallback: a memory of the cemetery road
  return <Stage p={pp} light="night" world={<><CemeteryRoad f={p.f} /><Grave x={960} y={900} s={1.4} /><Headlight x={200} y={700} /></>} />;
};

export const PAST: Record<string, ShotComponent> = {past: PastScene};
