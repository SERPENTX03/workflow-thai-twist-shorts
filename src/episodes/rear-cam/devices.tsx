import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import type {CastId} from '../../cast/CastSprite';
import {kf} from '../../engine/anim';
import {Sprite} from '../../cast/Sprite';
import {Grain} from '../../kit/horror';
import {Cctv, cctvFrame} from '../../kit/pov';
import {BarScreen, HelmetBack, HelmetCams, HelmetOnSeat, HelmetShell} from '../../kit/helmet';
import {Grave, Sala8} from '../../kit/cemetery';
import {C} from './cast';
import {SalaFeed, type FeedState} from './night';

// Jay's two cameras: the helmet in close-up (back, side, on the seat, his face behind the shield) and the 2-inch
// screen on the handlebar that shows what the rear camera sees.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const push = (p: ShotProps, a: number, b: number) => a + (b - a) * kf(p.f, [[0, 0], [p.len, 1]]);

/** Jay's head in his helmet, his own sprite under the shell, framed so the head is `size` px tall at (x, y).
 *  `glow` = where the light on his face comes from: the road ahead (warm, from below) or the screen (blue). */
const JayHelmetHead: React.FC<{f: number; x: number; y: number; size: number; face: string; glow?: 'road' | 'screen' | 'beacon' | 'none'; rec?: boolean; fog?: number; look?: number}> = ({
  f, x, y, size, face, glow = 'road', rec, fog = 0.3,
}) => {
  const h = size * (520 / 150);           // the head (≈150 units incl. helmet) fills `size`
  const w = h * (200 / 520);
  const glowC = glow === 'screen' ? 'rgba(120,170,255,.55)' : glow === 'beacon' ? (Math.floor(f / 10) % 2 ? 'rgba(255,60,60,.5)' : 'rgba(70,120,255,.5)') : 'rgba(255,225,170,.45)';
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h * 0.16, width: w, height: h}}>
      <Sprite id={'lead-male-A' as CastId} height={h} vars={{shirt: C.jay, pants: C.jayPants, hair: C.jayHair, skin: C.skin, skinD: C.skinD}} hideFace
        layers={[`face-${face}` as CastId]} />
      <svg viewBox="0 0 200 520" width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <HelmetShell shield fog={fog} seed={3} />
        <HelmetCams rec={rec} f={f} />
      </svg>
      {glow !== 'none' && <div style={{position: 'absolute', left: -w * 0.2, top: h * 0.12, width: w * 1.4, height: h * 0.22, borderRadius: '50%', mixBlendMode: 'screen',
        background: `radial-gradient(ellipse at 50% ${glow === 'screen' ? 90 : 100}%, ${glowC}, rgba(0,0,0,0) 65%)`}} />}
    </div>
  );
};

const HelmetScene: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? 'back-ecu';
  const night = d.light !== 'day';
  if (v === 'back-ecu') {
    const z = push(p, 1, 1.06);
    return (
      <AbsoluteFill style={{background: '#030405', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`}}>
          <HelmetBack f={p.f} rec={d.rec !== false && !d.dead} dead={!!d.dead} wet={night} cable={!!d.dead} tilt={-4} />
        </div>
        {/* tail light / room light caught on the shell */}
        <div style={{position: 'absolute', left: 1300, top: 700, width: 500, height: 260, borderRadius: '50%', mixBlendMode: 'screen',
          background: d.reflect === 'truck' ? 'radial-gradient(ellipse, rgba(255,90,60,.35), rgba(0,0,0,0) 70%)' : 'radial-gradient(ellipse, rgba(140,160,200,.12), rgba(0,0,0,0) 70%)'}} />
        <Grain f={p.f} opacity={0.14} />
      </AbsoluteFill>
    );
  }
  if (v === 'cable-ecu') {
    // What the line says: a second camera, on the back of his helmet, looking the way he came. So: his helmet from
    // behind and to the side, big, dark against the lit fog; the camera on its back, lens toward the road behind him;
    // down that road, small, the sala it is watching. The cable runs from the camera into his collar.
    const k = kf(p.f, [[0, 0], [p.len, 1]]);
    const on = Math.floor(p.f / 15) % 2 === 0;
    return (
      <AbsoluteFill style={{background: '#05070c', overflow: 'hidden'}}>
        {/* the road behind him, out of focus: fog lit by the moon, gravel running back to the sala */}
        <div style={{position: 'absolute', inset: 0, filter: 'blur(5px)'}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#070a12, #141a26 52%, #17161a 53%, #0d0d0e)'}} />
          <div style={{position: 'absolute', left: -320, top: 90, width: 1400, height: 720, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(195,208,235,.8), rgba(195,208,235,0) 70%)'}} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <polygon points="330,560 370,560 1500,1100 -300,1100" fill="#4c4438" />
          </svg>
          {[[90, 640, 0.75, 0], [640, 610, 0.5, 1], [170, 590, 0.42, 0], [760, 700, 0.95, 1]].map(([x, y, s, kind], i) => <Grave key={i} x={x} y={y} s={s} lean={(i - 1.5) * 4} kind={kind} ink />)}
          <div style={{transform: `scale(${1 - k * 0.14})`, transformOrigin: '350px 570px', position: 'absolute', inset: 0}}>
            <Sala8 x={350} y={580} s={0.2} box="placed" ink />
            <div style={{position: 'absolute', left: 340, top: 530, width: 22, height: 13, background: '#fff', boxShadow: '0 0 22px 8px rgba(255,255,255,.65)'}} />
          </div>
        </div>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${push(p, 1, 1.04)})`, transformOrigin: '60% 45%'}}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <defs>
              <radialGradient id="cb-shell" cx="30%" cy="26%" r="78%"><stop offset="0" stopColor="#59606c" /><stop offset=".42" stopColor="#23262c" /><stop offset="1" stopColor="#08090b" /></radialGradient>
              <linearGradient id="cb-look" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stopColor="#dbe6ff" stopOpacity=".1" /><stop offset="1" stopColor="#dbe6ff" stopOpacity="0" /></linearGradient>
            </defs>
            {/* where the lens is looking: a faint wedge back down the road */}
            <polygon points="760,372 110,180 110,700 760,420" fill="url(#cb-look)" />
            {/* navy jacket shoulder, moonlit along its top; the caption sits on this dark cloth */}
            <path d="M560 1120 Q640 800 980 730 Q1400 680 1980 830 L1980 1120 Z" fill="#20456a" />
            <path d="M790 790 Q860 750 980 730" stroke="rgba(200,220,250,.5)" strokeWidth="9" fill="none" strokeLinecap="round" />
            {/* neck */}
            <path d="M960 610 L1400 610 L1420 760 L980 770 Z" fill="#a97b5c" />
            {/* the collar */}
            <path d="M930 760 Q1180 680 1450 750 L1470 815 Q1180 745 910 825 Z" fill="#163250" stroke="#0c1c2e" strokeWidth="5" />
            {/* the shell, moonlit on the side facing the fog */}
            <ellipse cx="1230" cy="350" rx="430" ry="372" fill="url(#cb-shell)" stroke="#040506" strokeWidth="6" />
            <path d="M826 300 Q880 90 1120 18" stroke="rgba(215,228,250,.72)" strokeWidth="11" fill="none" strokeLinecap="round" />
            <path d="M980 90 Q1200 10 1420 70" stroke="rgba(255,255,255,.1)" strokeWidth="26" fill="none" strokeLinecap="round" />
            <path d="M810 420 Q1230 560 1650 400" stroke="#050607" strokeWidth="12" fill="none" />
            {/* dew */}
            {[[1250, 150], [1370, 250], [1120, 150], [1480, 330], [1290, 310], [1180, 260], [1520, 210]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 3} fill="rgba(225,238,255,.3)" />)}
            {/* strap and camera on the back of the shell: bigger than life, because it is the subject */}
            <rect x="880" y="372" width="440" height="42" rx="12" fill="#090a0c" transform="rotate(5 1100 393)" />
            <rect x="810" y="260" width="280" height="210" rx="26" fill="#23262c" stroke="#040405" strokeWidth="7" />
            <rect x="822" y="270" width="256" height="24" rx="12" fill="rgba(255,255,255,.13)" />
            {/* the lens, looking back, frame left */}
            <rect x="742" y="294" width="86" height="142" rx="16" fill="#101215" stroke="#040405" strokeWidth="6" />
            <ellipse cx="744" cy="365" rx="42" ry="72" fill="#0d1a2b" stroke="#6c7480" strokeWidth="9" />
            <ellipse cx="744" cy="365" rx="22" ry="42" fill="#1c3652" />
            <ellipse cx="736" cy="338" rx="9" ry="15" fill="rgba(255,255,255,.75)" />
            {/* REC */}
            <circle cx="1030" cy="318" r="19" fill={on ? '#ff3b30' : '#6a1512'} />
            <text x="1030" y="378" textAnchor="middle" fontSize="36" fontFamily="monospace" fontWeight="700" fill={on ? '#ff6a60' : 'rgba(255,255,255,.3)'}>REC</text>
            {/* the cable, picked out by the LED, down the nape and into the collar */}
            <path d="M960 470 Q900 590 1000 660 Q1060 700 1060 770" stroke="#050506" strokeWidth="19" fill="none" strokeLinecap="round" />
            <path d="M958 470 Q898 590 998 660 Q1058 700 1058 770" stroke="rgba(255,130,110,.75)" strokeWidth="4" fill="none" />
          </svg>
          {on && <div style={{position: 'absolute', left: 860, top: 148, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,70,55,.62), rgba(255,70,55,0) 66%)', mixBlendMode: 'screen'}} />}
          <div style={{position: 'absolute', left: 860, top: 640, width: 420, height: 230, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,60,50,${on ? 0.34 : 0.15}), rgba(0,0,0,0) 68%)`, mixBlendMode: 'screen'}} />
        </div>
        <Grain f={p.f} opacity={0.12} />
      </AbsoluteFill>
    );
  }
  if (v === 'seat-med' || v === 'front-ins') {
    return (
      <AbsoluteFill style={{background: '#060708', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 22% 10%, rgba(140,255,190,.4), rgba(0,0,0,0) 70%)'}} />
        <div style={{position: 'absolute', inset: 0, transform: `scale(${push(p, 1, 1.04)})`}}>
          <HelmetOnSeat f={p.f} rec={false} rearDead={!!d.rearDead} />
        </div>
        <Grain f={p.f} opacity={0.12} />
      </AbsoluteFill>
    );
  }
  // his face behind the shield: visor-close (head ~55% of the frame) or eyes-ecu (the eyes fill it)
  const ecu = v === 'eyes-ecu';
  // the head-frame top sits at y - 0.16 h, the eyes 72/520 of h below it: put the eyes at ~470 (ECU) / ~380 (close)
  const size = ecu ? 1500 : 620;
  const y = ecu ? 582 : 420;
  const glow = (d.glow ?? 'road') as 'road' | 'screen' | 'beacon' | 'none';
  return (
    <AbsoluteFill style={{background: '#030406', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#020305, #0b0e16)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${push(p, 1, 1.05)})`, transformOrigin: '50% 40%'}}>
        <JayHelmetHead f={p.f} x={960 + (d.look ?? 0) * 0} y={y} size={size} face={d.face ?? 'wary'} glow={glow} rec />
        {/* the screen reflected in his eyes */}
        {glow === 'screen' && ecu && [760, 1160].map(x => <div key={x} style={{position: 'absolute', left: x - 30, top: 520, width: 60, height: 40, background: 'rgba(160,200,255,.75)', borderRadius: 6, filter: 'blur(1px)'}} />)}
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,.75) 100%)'}} />
      <Grain f={p.f} opacity={0.14} />
    </AbsoluteFill>
  );
};

/** what the screen shows: the live rear view, or the recording when the view zooms into it (figure-ecu …) */
const FEED: Record<string, FeedState> = {'sala-far': 'sala-far', 'sala-box': 'sala-box', 'figure-step': 'figure-step', 'figure-take': 'figure-take', 'figure-turn': 'figure-turn'};

const BarScreenScene: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? 'bar-pov';
  const feed = (FEED[d.feed] ?? 'sala-box') as FeedState;
  const f = cctvFrame(p.f, 2);
  const picture = (zoom: number, cx = 960, cy = 620) => (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${zoom})`}}>
      <SalaFeed f={f} state={feed} recede={kf(p.f, [[0, 0], [p.len, 1]])} />
    </div>
  );
  // the rider's eye line down to the bar: the screen small in the frame
  if (v === 'bar-pov' || v === 'nosignal-pov' || v === 'rear-pov') {
    const signal = d.feed !== 'none';
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <BarScreen f={p.f} signal={signal} zoom={push(p, 1, 1.05)} road={d.where === 'highway' ? 'highway' : 'gravel'} label={signal ? '● REAR' : undefined}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(.25)', transformOrigin: '0 0', filter: 'grayscale(.4) contrast(1.2)'}}>
            {d.feed === 'station-rear' ? <div style={{position: 'absolute', inset: 0, background: '#111'}} /> : picture(1)}
          </div>
        </BarScreen>
      </AbsoluteFill>
    );
  }
  // full frame: the screen's own picture, grainy, with its timecode (rear-cctv, figure-ecu, take-ecu, turn-ecu)
  const cam = d.cam as number[] | undefined;
  const z = cam ? push(p, cam[0], cam[1]) : 1;
  const freeze = !!d.freeze && p.f > p.len * 0.35;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Cctv W={p.W} H={p.H} f={freeze ? Math.round(p.len * 0.35) : p.f} cam="REAR" time={d.time ?? '02:14:07'} glitch={v === 'turn-ecu' ? 0.9 : 0.3}>
        {picture(Math.max(1, z / 2.2), cam?.[2] ?? 960, cam?.[3] ?? 620)}
      </Cctv>
      {freeze && <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 3px, rgba(0,0,0,0) 3px 40px)', mixBlendMode: 'screen'}} />}
    </AbsoluteFill>
  );
};

export const DEVICES: Record<string, ShotComponent> = {helmet: HelmetScene, barscreen: BarScreenScene};
