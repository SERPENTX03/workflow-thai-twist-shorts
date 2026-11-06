import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {Stage, Fore} from '../../kit/stage';
import {CemeteryGate, CemeteryRoad, Grave, Headlight, Sala8, Tamarind, type CemTone} from '../../kit/cemetery';
import {SideRoadSet, ShopRow} from '../../kit/places';
import {Haze} from '../../kit/depth';
import {Grain} from '../../kit/horror';
import {full} from '../../kit/world';
import {JayBike, Actors, aimData} from './cast';
import {Dapple} from '../../kit/hut';

// Night places outside the station: the cemetery road, the sala, the khao-tom shop shutter, the shortcut behind the
// station, and the picture the rear camera records (SalaFeed), which the handlebar screen, the laptop and the live
// stream all show.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const toneOf = (d: Record<string, any>): CemTone => (d.light === 'day' ? 'day' : d.light === 'dawn' ? 'dawn' : 'night');

// ---------------------------------------------------------------- the rear camera's picture

export type FeedState = 'sala-far' | 'sala-box' | 'figure-step' | 'figure-take' | 'figure-turn' | 'bike' | 'rider' | 'count' | 'wait' | 'leave' | 'none';

/** The cemetery as the rear camera sees it while Jay rides away: the road behind him, the sala small in the fog with
 *  the white box on the table, and the figure in the black raincoat. Drawn at 1920×1080; frame it with a camera. */
export const SalaFeed: React.FC<{f: number; state: FeedState; recede?: number; keychain?: boolean}> = ({f, state, recede = 0, keychain}) => {
  const s = 0.55 - recede * 0.2;
  const figX = state === 'figure-step' ? 820 + Math.min(1, f / 60) * 70 : 900;
  const show = ['figure-step', 'figure-take', 'figure-turn', 'rider', 'count', 'leave'].includes(state);
  const boxOn = state !== 'figure-take' && state !== 'figure-turn' && state !== 'leave';
  return (
    <div style={{position: 'absolute', inset: 0, background: '#050608', overflow: 'hidden'}}>
      <CemeteryRoad f={f} horizon={560} vx={960} fog="thick" />
      {/* the bike's tail light on the fog and the white box: the one lit thing the rear camera sees */}
      <div style={{position: 'absolute', left: 260, top: 300, width: 1400, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(200,205,220,.4), rgba(200,205,220,0) 66%)'}} />
      <Sala8 x={960} y={760} s={s} box={boxOn ? 'placed' : 'none'} lit={1} />
      <div style={{position: 'absolute', left: 760, top: 560, width: 400, height: 160, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(240,240,250,.45), rgba(240,240,250,0) 70%)'}} />
      {/* the bike that comes out of the bushes, lights off */}
      {(state === 'bike' || state === 'wait' || state === 'leave') && (
        <div style={{position: 'absolute', left: state === 'leave' ? 1260 + Math.min(1, f / 50) * 140 : 1300 - (state === 'bike' ? Math.min(1, f / 50) * 120 : 0), top: 690,
          width: 150, height: 70, borderRadius: 30, background: '#020203', boxShadow: '0 0 0 2px rgba(200,210,230,.25)'}}>
          {keychain && <div style={{position: 'absolute', left: 118, top: 8, width: 8, height: 14, borderRadius: 4, background: '#7dff6a', boxShadow: '0 0 10px 3px rgba(125,255,106,.7)'}} />}
        </div>
      )}
      {show && (
        <svg width={200} height={340} viewBox="0 0 200 340" style={{position: 'absolute', left: figX - 100 * s * 1.4, top: 760 - 330 * s * 1.4, overflow: 'visible',
          transform: `scale(${s * 1.4})`, transformOrigin: '0 0'}}>
          {/* raincoat: a dark cone with a hood-less tinted helmet */}
          <path d="M60 90 Q100 70 140 90 L170 330 L30 330 Z" fill="#030304" />
          <circle cx="100" cy="58" r="46" fill="#08090b" stroke="rgba(180,190,210,.25)" strokeWidth="3" />
          <path d="M62 52 Q100 40 138 52 L134 74 Q100 82 66 74 Z" fill={state === 'figure-turn' ? '#140808' : '#0e1014'} />
          {state === 'figure-turn' && <circle cx="114" cy="62" r="5" fill="#ff3b30" />}
          {(state === 'figure-take' || state === 'count') && <path d="M140 150 L190 190" stroke="#030304" strokeWidth="30" strokeLinecap="round" />}
          {state === 'figure-take' && <rect x="170" y="170" width="60" height="40" rx="4" fill="#d9d6ce" />}
        </svg>
      )}
      <Haze y={700} h={240} f={f} a={0.16} />
    </div>
  );
};

// ---------------------------------------------------------------- the cemetery road

const RoadScene: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const v = p.shot.view ?? 'soi11-wide';
  const t = toneOf(d);
  const fog = d.fog === 'thick' ? 'thick' : d.fog !== false;
  if (v === 'highway-side') {
    return (
      <Stage p={p} light={t === 'day' ? 'day' : t === 'dawn' ? 'dawn' : 'night'} world={
        <>
          <SideRoadSet tone={t === 'day' ? 'day' : 'night'} moving frame={p.f} />
          <JayBike x={980} y={930} f={p.f} face="wary" rec={d.rec !== false && d.hud !== 'จันทร์ 01:40'} headlight={t !== 'day'} box={d.box === 'on-seat'} spin={p.f * 14} />
        </>
      } />
    );
  }
  if (v === 'soi11-high' || v === 'dawn-high') {
    const k = kf(p.f, [[0, 0], [p.len, 1]]);
    return (
      <Stage p={p} light={t === 'dawn' ? 'dawn' : 'night'} cam={[0.95, 1.02, 1000, 520]} world={
        <>
          <CemeteryRoad f={p.f} tone={t} horizon={230} vx={1180} fog={fog} />
          {/* the headlight lights the fog it runs into: a wide pale pool around the road ahead of it */}
          {t !== 'dawn' && <div style={{position: 'absolute', left: 500, top: 300, width: 1100, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(230,225,205,.32), rgba(230,225,205,0) 66%)'}} />}
          {/* one headlight working up the road through the fog, dust trailing behind */}
          {t !== 'dawn' && <Headlight x={980 - k * 120} y={760 - k * 160} angle={-64} len={620} spread={18} a={0.5} />}
          {t !== 'dawn' && <div style={{position: 'absolute', left: 940 - k * 120, top: 760 - k * 160, width: 40, height: 40, borderRadius: '50%', background: '#fff6d0', boxShadow: '0 0 40px 18px rgba(255,240,200,.5)'}} />}
          {t !== 'dawn' && Array.from({length: 8}, (_, i) => <div key={i} style={{position: 'absolute', left: 960 - k * 120 + i * 30, top: 800 - k * 160 + i * 34, width: 160, height: 80, borderRadius: '50%',
            background: `rgba(150,140,120,${0.16 - i * 0.015})`, filter: 'blur(10px)'}} />)}
          {t === 'dawn' && <div style={{position: 'absolute', left: 1200, top: 680, width: 160, height: 60, borderRadius: 20, background: '#e9e6dc', border: '4px solid #111'}} />}
          {t === 'dawn' && <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: 'linear-gradient(100deg, rgba(0,0,0,0) 35%, rgba(255,190,105,.5))', mixBlendMode: 'screen'}} />}
        </>
      } fore={<Tamarind x={260} y={520} s={1.6} seed={21} />} foreBlur={14} foreDark={0.2} />
    );
  }
  if (v === 'wheel-low') {
    return (
      <Stage p={p} light="night" cam={[1, 1.06, 960, 540]} world={
        <>
          <CemeteryRoad f={p.f} tone={t} horizon={760} vx={900} fog={fog} />
          <Headlight x={980} y={740} angle={-6} len={1400} spread={16} a={0.5} />
          <div style={{position: 'absolute', left: 920, top: 690, width: 120, height: 120, borderRadius: '50%', background: '#fff6cf', boxShadow: '0 0 90px 40px rgba(255,240,200,.45)'}} />
        </>
      } fore={
        // the front wheel rolling past the lens, gravel kicked up
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${380 + p.f * 3} 860) rotate(${p.f * 9})`}>
            <circle r="420" fill="none" stroke="#050506" strokeWidth="120" />
            {Array.from({length: 10}, (_, i) => <line key={i} x1="0" y1="0" x2={Math.cos(i * 0.63) * 360} y2={Math.sin(i * 0.63) * 360} stroke="#0d0e10" strokeWidth="14" />)}
          </g>
          {Array.from({length: 30}, (_, i) => <circle key={i} cx={700 + rnd(41, i) * 900} cy={980 + rnd(42, i) * 100} r={6 + rnd(43, i) * 16} fill="#1a1814" />)}
        </svg>
      } foreBlur={6} foreDark={0.8} />
    );
  }
  if (v === 'gate-fif') {
    const k = kf(p.f, [[0, 0], [p.len, 1]]);
    // The gate stands whole in the frame, arch and both pillars, so it reads as a gate and not as two dark bars. The fog
    // inside it is the brightest thing in the shot; the road runs up the middle; one red light goes away down it.
    const vx = 985, hz = 560;
    return (
      <Stage p={p} light={t === 'day' ? 'day' : 'warm'} world={
        <>
          <CemeteryRoad f={p.f} tone={t} horizon={hz} vx={vx} fog={t === 'night' ? 'thick' : fog} />
          {t === 'night' && <div style={{position: 'absolute', left: -460, top: -420, width: 2900, height: 1500, background: 'radial-gradient(ellipse 1500px 950px at 50% 62%, rgba(205,218,242,.95), rgba(190,205,235,.62) 45%, rgba(160,175,205,.2) 75%, rgba(160,175,205,0) 100%)',
            maskImage: 'linear-gradient(#000 66%, transparent 76%)', WebkitMaskImage: 'linear-gradient(#000 66%, transparent 76%)'}} />}
          {t === 'night' && <svg width={1920} height={560} viewBox={`0 ${hz} 1920 560`} style={{position: 'absolute', left: 0, top: hz}}><polygon points={`${vx - 16},${hz} ${vx + 16},${hz} 1450,1120 520,1120`} fill="rgba(118,106,90,.62)" /></svg>}
          {t === 'dawn' && <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: 'linear-gradient(100deg, rgba(0,0,0,0) 30%, rgba(255,186,100,.58))', mixBlendMode: 'screen'}} />}
          {t === 'night' && (
            <>
              {/* the tail light and its red on the wet road under it */}
              <div style={{position: 'absolute', left: vx - 90 + k * 8, top: hz + 28 - k * 22, width: 180, height: 90, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,50,38,${0.6 - k * 0.3}), rgba(0,0,0,0) 70%)`}} />
              <div style={{position: 'absolute', left: vx - 26 + k * 8, top: hz + 4 - k * 22, width: 52 - k * 18, height: 30 - k * 10, borderRadius: 8, background: '#ff2a20', boxShadow: '0 0 54px 26px rgba(255,40,30,.72)', opacity: 1 - k * 0.45}} />
            </>
          )}
          {t !== 'night' && <div style={{position: 'absolute', left: vx - 45 + k * 10, top: hz + 28 - k * 18, width: 90 - k * 26, height: 40 - k * 12, borderRadius: 14, background: '#141619'}} />}
        </>
      } fore={<CemeteryGate x={960} y={1120} s={1.35} ink />} foreBlur={2} foreDark={1} />
    );
  }
  // any other view of the road: a wide on the verge, eye level
  return <Stage p={p} light={t === 'day' ? 'day' : 'night'} world={<><CemeteryRoad f={p.f} tone={t} fog={fog} /><Actors p={p} /></>} />;
};

// ---------------------------------------------------------------- the sala

const SalaScene: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const t = toneOf(d);
  return (
    <Stage p={p} light={t === 'day' ? 'day' : 'night'} world={
      <>
        <CemeteryRoad f={p.f} tone={t} horizon={600} vx={1000} fog={d.fog === 'thick' ? 'thick' : true} road={false} />
        {/* moonlit fog behind the pavilion: the sala reads as a dark shape against it, the table catches the light */}
        {t === 'night' && <div style={{position: 'absolute', left: 300, top: 220, width: 1400, height: 760, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(165,180,210,.6), rgba(165,180,210,0) 68%)'}} />}
        <Grave x={300} y={980} s={1.6} tone={t} lean={-6} />
        <Grave x={1660} y={1000} s={1.8} tone={t} lean={5} kind={1} />
        <Sala8 x={1000} y={960} s={0.92} tone={t} box={d.box === 'placed' ? 'placed' : 'none'} lit={0.15} />
        <Haze y={860} h={260} f={p.f} a={0.22} />
        <Actors p={p} />
      </>
    } />
  );
};

// ---------------------------------------------------------------- the khao-tom shop in town

const ShopScene: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const v = p.shot.view ?? 'shutter-wide';
  if (v === 'gap-low') {
    const push = kf(p.f, [[0, 0], [p.len, 1]]);
    return (
      <AbsoluteFill style={{background: '#050506', overflow: 'hidden'}}>
        {/* the shutter's bottom edge low in frame, the gap under it a line of yellow light, the pavement in front */}
        <div style={{position: 'absolute', left: -40, top: -40, width: 2000, height: 640,
          background: 'repeating-linear-gradient(180deg, #2a2c2e 0 36px, #151617 36px 44px)', transform: `scale(${1 + push * 0.04})`}} />
        <div style={{position: 'absolute', left: -40, top: 600, width: 2000, height: 22, background: '#0b0c0d'}} />
        <div style={{position: 'absolute', left: -40, top: 622, width: 2000, height: 24, background: 'linear-gradient(#ffcf6a, rgba(255,190,80,.2))', boxShadow: '0 0 60px 20px rgba(255,190,80,.35)'}} />
        <div style={{position: 'absolute', left: -40, top: 646, width: 2000, height: 500, background: 'linear-gradient(#3a3226, #121010)'}} />
        <div style={{position: 'absolute', left: 300, top: 650, width: 1400, height: 200, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,110,.35), rgba(255,200,110,0) 70%)'}} />
        <Grain f={p.f} opacity={0.14} />
      </AbsoluteFill>
    );
  }
  return (
    <Stage p={p} light="night" world={
      <>
        <div style={{position: 'absolute', inset: 0, filter: 'blur(3px) brightness(.55)'}}><ShopRow tone="night" f={p.f} /></div>
        {/* the one shop that matters: shutter half down, one bulb over the sign */}
        <div style={{position: 'absolute', left: 620, top: 300, width: 680, height: 630, background: '#1a1716'}} />
        <div style={{position: 'absolute', left: 640, top: 380, width: 640, height: 300, background: 'repeating-linear-gradient(180deg, #34363a 0 26px, #1c1d20 26px 32px)'}} />
        <div style={{position: 'absolute', left: 640, top: 680, width: 640, height: 250, background: 'linear-gradient(#3a2a14, #120c08)'}} />
        <div style={{position: 'absolute', left: 650, top: 270, width: 620, height: 90, background: '#5a1e14', border: '6px solid #200a06', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Plex Thai, sans-serif', fontWeight: 700, fontSize: 64, color: '#f0d68a'}}>ข้าวต้มโต้รุ่ง</div>
        <div style={{position: 'absolute', left: 940, top: 228, width: 40, height: 40, borderRadius: '50%', background: '#fff1c0', boxShadow: '0 0 120px 50px rgba(255,210,130,.5)'}} />
        <div style={{position: 'absolute', left: 560, top: 930, width: 800, height: 120, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,210,130,.3), rgba(255,210,130,0) 70%)'}} />
        <Actors p={p} helmeted />
      </>
    } />
  );
};

// ---------------------------------------------------------------- the shortcut behind the station

const ShortcutScene: ShotComponent = p => {
  const d = D(p);
  const t = toneOf(d);
  const v = p.shot.view ?? 'gate-fif';
  return (
    <Stage p={p} light={t === 'day' ? 'day' : t === 'dawn' ? 'dawn' : 'night'} world={
      <>
        <div style={full(t === 'day' ? 'linear-gradient(#9cc0dc, #dfe8e2)' : t === 'dawn' ? 'linear-gradient(#2f3d62, #c6a08a)' : 'linear-gradient(#020306, #0b1020)')} />
        {/* moonlight over the far end of the path: the one light on it */}
        {t === 'night' && <div style={{position: 'absolute', left: 700, top: 160, width: 1000, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(165,180,215,.62), rgba(165,180,215,0) 66%)'}} />}
        {/* the chedi spire of the cemetery far beyond the scrub */}
        <svg width={200} height={300} viewBox="0 0 200 300" style={{position: 'absolute', left: 1180, top: 300}}>
          <path d="M100 0 L112 160 Q160 200 170 300 L30 300 Q40 200 88 160 Z" fill={t === 'day' ? '#cfc8b6' : '#0a0c10'} />
        </svg>
        <Tamarind x={500} y={720} s={1.1} tone={t} seed={13} />
        <Tamarind x={1560} y={740} s={1.2} tone={t} seed={17} />
        <div style={{position: 'absolute', left: -700, top: 600, width: 3320, height: 1000, background: t === 'day' ? 'linear-gradient(#5a6a3a, #3a3a22)' : 'linear-gradient(#06070a, #12110e)'}} />
        <svg width={3320} height={600} viewBox="-700 600 3320 600" style={{position: 'absolute', left: -700, top: 600}}>
          <polygon points="1180,600 1220,600 1700,1200 640,1200" fill={t === 'day' ? '#6a5a3a' : '#3a3228'} />
          {[-0.3, 0.3].map(k => <line key={k} x1={1200 + k * 40} y1="600" x2={1170 + k * 1000} y2="1200" stroke="rgba(0,0,0,.4)" strokeWidth="18" />)}
        </svg>
        {/* by day: the herringbone tread down the middle of the path, sun spots through the trees */}
        {t === 'day' && (
          <svg width={1920} height={600} viewBox="0 600 1920 600" style={{position: 'absolute', left: 0, top: 600}}>
            {Array.from({length: 22}, (_, i) => {
              const q = (i / 21) ** 1.6, y = 610 + q * 590, x = 1200 - q * 60, w = 6 + q * 40;
              return <path key={i} d={`M${x - w} ${y - w * 0.6} L${x} ${y} L${x + w} ${y - w * 0.6}`} stroke="rgba(40,28,14,.6)" strokeWidth={2 + q * 10} fill="none" />;
            })}
          </svg>
        )}
        {t === 'day' && <Dapple f={p.f} x={500} y={640} w={1300} h={440} seed={21} a={0.4} />}
        {/* the zinc gate at the far end of the path, the gap under it where the tread goes in */}
        {v === 'gate-day-fif' && <div style={{position: 'absolute', left: -700, top: 440, width: 3320, height: 174, background: 'repeating-linear-gradient(90deg, #7a7f80 0 14px, #5a5f60 14px 20px)', borderBottom: '10px solid #3a3a30'}} />}
        {v === 'gate-day-fif' && (
          <svg width={360} height={240} viewBox="0 0 360 240" style={{position: 'absolute', left: 1020, top: 400}}>
            <rect x="0" y="0" width="360" height="200" fill="#8a9092" />
            {Array.from({length: 18}, (_, i) => <rect key={i} x={i * 20} y="0" width="8" height="200" fill="#6a7072" />)}
            <rect x="0" y="150" width="360" height="10" fill="#8a5a32" opacity=".6" />
            <rect x="0" y="200" width="360" height="14" fill="#0e0c08" />
            <text x="180" y="70" textAnchor="middle" fontSize="22" fontWeight="700" fill="#b03a2e" fontFamily="Plex Thai, sans-serif">ห้ามจอดขวางประตู</text>
          </svg>
        )}
        {t !== 'day' && <Haze y={640} h={220} f={p.f} a={0.14} />}
      </>
    } fore={v.endsWith('-fif') && v !== 'gate-day-fif' ? (
      // the zinc gate leaves frame the picture
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <rect x="-40" y="-40" width="620" height="1160" fill="#0a0b0c" />
        <rect x="1340" y="-40" width="640" height="1160" fill="#0a0b0c" />
        {Array.from({length: 12}, (_, i) => <rect key={i} x={i * 50} y="-40" width="10" height="1160" fill="#16181a" />)}
        {Array.from({length: 12}, (_, i) => <rect key={'r' + i} x={1360 + i * 50} y="-40" width="10" height="1160" fill="#16181a" />)}
      </svg>
    ) : undefined} foreBlur={4} foreDark={0.7} />
  );
};

export const NIGHT: Record<string, ShotComponent> = {road: RoadScene, sala: SalaScene, shop: ShopScene, shortcut: ShortcutScene};
