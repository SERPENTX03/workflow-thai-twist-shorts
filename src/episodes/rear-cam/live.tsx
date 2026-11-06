import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import type {CastId} from '../../cast/CastSprite';
import {appear, kf, rnd} from '../../engine/anim';
import {T} from '../../engine/theme';
import {Sprite} from '../../cast/Sprite';
import {Stage} from '../../kit/stage';
import {CemeteryRoad, Headlight, RoadsideMemorial, Sala8, Tamarind} from '../../kit/cemetery';
import {beaconColor} from '../../kit/checkpoint';
import {BarScreen, HelmetCams, HelmetShell} from '../../kit/helmet';
import {Haze} from '../../kit/depth';
import {Grain} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {CrackedGlass, GoldPile, LiveBadge, LiveComments, viewersAt} from '../../kit/live';
import {Phone} from '../../kit/phone';
import {Motorcycle, ShopRow, SideRoadSet} from '../../kit/places';
import {FLOOR} from '../../kit/world';
import {Actors, aimData, C, ChatRainHead, JayBike} from './cast';
import {OPENING} from './opening';
import {Shoulder} from './station';

// CH9 ไลฟ์สด + CH10 เช้าวันใหม่. Three places the night turns on, each one picture thought through:
//   LiveFeed     the cracked phone wedged in the sala's beam, looking down on the marble table: grainy, gained-up, the
//                LIVE badge on it. The same framing returns in full colour with the police there (beam-high).
//   Confront     the mouth of the shortcut: Jay's high beam from the left; then three police beams from behind Chat.
//                He is still in the black raincoat of the rear-camera file, the orange vest showing where it hangs open.
//   DawnSala     the same sala at six, gold from the right, nothing on the table but a can.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const K = (p: ShotProps) => kf(p.f, [[0, 0], [p.len, 1]]);
const push = (p: ShotProps, a = 1, b = 1.05) => a + (b - a) * K(p);
const noCam = (p: ShotProps): ShotProps => ({...p, shot: {...p.shot, data: {...D(p), cam: undefined}}});

const Insert: React.FC<{p: ShotProps; children: React.ReactNode; bg?: string; glow?: string; z?: [number, number]; origin?: string; grain?: number}> = ({p, children, bg = '#050608', glow, z = [1, 1.05], origin = '50% 50%', grain = 0.12}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
    {glow && <div style={{position: 'absolute', inset: 0, background: glow}} />}
    <div style={{position: 'absolute', inset: 0, transform: `scale(${push(p, z[0], z[1])})`, transformOrigin: origin}}>{children}</div>
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)'}} />
    <Grain f={p.f} opacity={grain} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- the view from the beam

/** a person seen from high up: the head near the lens and large, the body tapering away to small feet.
 *  `face` draws Chat's real head; otherwise the top of a helmet (the shield raised or down) */
const HighFigure: React.FC<{x: number; y: number; s?: number; coat?: string; head?: React.ReactNode; lit?: string; lean?: number}> = ({x, y, s = 1, coat = '#07080b', head, lit, lean = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `scale(${s}) rotate(${lean}deg)`}}>
    <svg width={500} height={560} viewBox="-250 -80 500 560" style={{position: 'absolute', left: -250, top: -80, overflow: 'visible'}}>
      <path d="M-178 50 Q0 -80 178 50 L128 330 L58 460 L-58 460 L-128 330 Z" fill={coat} />
      <path d="M-178 50 Q-120 0 -62 -8 M178 50 Q120 0 62 -8" stroke={lit ?? 'rgba(220,230,250,.28)'} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M-30 40 L-18 330 M30 40 L18 330" stroke={C.vest} strokeWidth="9" opacity=".5" />
    </svg>
    {head ?? (
      <svg width={320} height={320} viewBox="-160 -160 320 320" style={{position: 'absolute', left: -160, top: -190}}>
        <circle r="118" fill="#0a0b0e" stroke="rgba(200,210,235,.3)" strokeWidth="5" />
        <path d="M-92 -18 Q0 -60 92 -18 L84 40 Q0 62 -84 40 Z" fill="#14161b" />
      </svg>
    )}
  </div>
);

/** table top + what is on it, seen from the beam */
const BeamTable: React.FC<{f: number; box?: 'taped' | 'torn' | 'none'; gold?: boolean; grey?: boolean}> = ({f, box = 'taped', gold, grey}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(.8)', transformOrigin: '960px 690px'}}>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <ellipse cx="960" cy="668" rx="440" ry="270" fill="#141518" />
      <ellipse cx="960" cy="640" rx="440" ry="270" fill={grey ? '#8c8e92' : '#7f8186'} stroke="#26272b" strokeWidth="8" />
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${680 + rnd(211, i) * 460} ${480 + rnd(212, i) * 280} q${40 + rnd(213, i) * 70} ${-16 + rnd(214, i) * 32} ${90 + rnd(215, i) * 60} ${rnd(216, i) * 22}`} stroke="rgba(60,60,66,.4)" strokeWidth="6" fill="none" />)}
      {Array.from({length: 9}, (_, i) => <ellipse key={'w' + i} cx={640 + rnd(217, i) * 640} cy={460 + rnd(218, i) * 340} rx={8 + rnd(219, i) * 18} ry={5 + rnd(220, i) * 10} fill="rgba(235,226,204,.55)" />)}
      {box === 'taped' && (
        <g>
          <polygon points="800,540 1120,540 1150,640 770,640" fill="#f5f2ea" />
          <polygon points="770,640 1150,640 1150,720 770,720" fill="#cfcabd" />
          {[0, 1, 2].map(i => <polygon key={i} points={`${850 + i * 90},540 ${884 + i * 90},540 ${888 + i * 104},640 ${888 + i * 104},720 ${848 + i * 104},720 ${848 + i * 104},640`} fill="#0d0d0d" />)}
        </g>
      )}
      {box === 'torn' && (
        <g>
          <polygon points="620,480 830,470 850,560 610,570" fill="#d8d3c6" />
          <path d="M650 480 Q720 420 800 500" stroke="#0d0d0d" strokeWidth="26" fill="none" strokeLinecap="round" />
          {Array.from({length: 40}, (_, i) => <circle key={i} cx={1180 + rnd(221, i) * 170} cy={760 + rnd(222, i) * 90} r={4 + rnd(223, i) * 5} fill="#e4d9b8" />)}
        </g>
      )}
    </svg>
    {gold && <GoldPile x={960} y={640} s={1.05} f={f} />}
  </div>
);

/** the sala's stone floor and the scrub beyond, from the beam; the mouth of the path up frame right */
const BeamFloor: React.FC<{tone?: 'gain' | 'colour'}> = ({tone = 'gain'}) => (
  <>
    <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: tone === 'gain' ? '#17181b' : '#0d0e11'}} />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <polygon points="330,1180 110,560 420,110 1500,110 1810,560 1590,1180" fill={tone === 'gain' ? '#3a3b40' : '#2a2b30'} stroke="#101114" strokeWidth="14" />
      {Array.from({length: 13}, (_, i) => <line key={i} x1={110 + i * 142} y1="110" x2={i * 210 - 300} y2="1180" stroke="rgba(0,0,0,.22)" strokeWidth="4" />)}
      {Array.from({length: 8}, (_, i) => <line key={'h' + i} x1="0" y1={190 + i * 130} x2="1920" y2={190 + i * 130} stroke="rgba(0,0,0,.2)" strokeWidth="4" />)}
      {/* the bench round the edge, the eight posts leaning away from the lens */}
      {[[420, 110, 330, -60], [1500, 110, 1590, -60], [110, 560, -40, 500], [1810, 560, 1960, 500]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#0a0a0c" strokeWidth="46" />)}
      {/* the scrub and the mouth of the shortcut */}
      {Array.from({length: 16}, (_, i) => <ellipse key={'s' + i} cx={1220 + i * 60} cy={-30 + rnd(231, i) * 90} rx="90" ry="60" fill="#08090a" />)}
      <polygon points="1540,110 1700,110 1860,-80 1700,-80" fill="#2c2620" />
    </svg>
  </>
);

/** the phone's picture: desaturated, gained up, coarse, with the LIVE furniture */
const LiveFrame: React.FC<{p: ShotProps; children: React.ReactNode; z?: number; ox?: number; oy?: number; viewers?: number; comments?: string[]; time?: string; pixel?: number}> = ({p, children, z = 1, ox = 960, oy = 540, viewers, comments, time, pixel = 0}) => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${ox}px ${oy}px`, filter: 'saturate(.42) contrast(1.22) brightness(1.08)'}}>{children}</div>
    {pixel > 0 && <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.22) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.22) 2px, transparent 2px)', backgroundSize: `${pixel}px ${pixel}px`}} />}
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,.72) 100%)'}} />
    {/* the edge of the beam the phone is wedged against, soft across the top of the lens */}
    <div style={{position: 'absolute', left: -40, top: -80, width: 2000, height: 170, background: '#040405', filter: 'blur(26px)'}} />
    <Grain f={p.f} opacity={0.34} />
    <LiveBadge x={60} y={70} s={1.3} f={p.f} viewers={viewers} />
    {comments && <LiveComments items={comments} x={1420} y={180} s={1.2} />}
    {time && <div style={{position: 'absolute', right: 60, top: 76, fontFamily: 'monospace', fontWeight: 700, fontSize: 40, color: '#e6ece6', textShadow: '0 0 6px #000'}}>{time}</div>}
  </AbsoluteFill>
);

const COMMENTS: Record<string, string[]> = {
  'rider-high': ['ใครน่ะ', 'เจย์อยู่ไหน'],
  'gold-high': ['นั่นทองจริงเหรอ', 'แจ้งตำรวจ!!', 'ที่ไหนเนี่ย'],
};

const LiveFeed: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? 'table-high';
  const k = K(p);
  const viewers = viewersAt(d.viewers, k);
  const frame = {p, viewers: d.viewers === undefined ? undefined : viewers, time: d.time, comments: COMMENTS[v]};
  if (v === 'bike-ecu') {
    // zoomed in the stream: the unlit bike nosing out of the scrub by the path, one rim catching the white of the box
    return (
      <LiveFrame {...frame} z={2.3 + 0.1 * k} ox={1985} oy={-146} pixel={14}>
        <BeamFloor />
        <BeamTable f={p.f} />
        <div style={{position: 'absolute', left: 1640 - k * 90, top: 60 + k * 40, width: 0, height: 0}}>
          <div style={{position: 'absolute', left: -110, top: -40, width: 200, height: 80, borderRadius: 34, background: '#020203'}} />
          <div style={{position: 'absolute', left: -150, top: -14, width: 90, height: 90, borderRadius: '50%', border: '9px solid rgba(215,225,245,.75)', borderRightColor: 'transparent', borderTopColor: 'transparent'}} />
          <div style={{position: 'absolute', left: 60, top: -14, width: 90, height: 90, borderRadius: '50%', border: '7px solid rgba(215,225,245,.3)', borderRightColor: 'transparent', borderTopColor: 'transparent'}} />
          <div style={{position: 'absolute', left: -140, top: -60, width: 10, height: 22, borderRadius: 5, background: C.key, boxShadow: '0 0 12px 4px rgba(125,255,106,.7)'}} />
        </div>
      </LiveFrame>
    );
  }
  if (v === 'count-ecu') {
    // the box in the stream, close: the gloved forefinger running along the tape. Three wraps; he nods.
    const n = Math.min(3, 1 + Math.floor(kf(p.f, [[0, 0], [p.len * 0.72, 2.99]])));
    const x = 610 + (n - 1) * 320;
    return (
      <LiveFrame p={p} time={d.time} pixel={22}>
        <div style={{position: 'absolute', inset: 0, background: '#70727a'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <polygon points="240,240 1680,220 1780,860 140,880" fill="#f3f0e8" />
          {[0, 1, 2].map(i => <polygon key={i} points={`${540 + i * 320},228 ${680 + i * 320},226 ${720 + i * 330},874 ${560 + i * 330},878`} fill="#101010" />)}
          <path d={`M${x - 120} -60 L${x + 180} -60 L${x + 120} 300 L${x + 50} 500 Q${x + 10} 540 ${x - 30} 490 L${x - 40} 300 Z`} fill="#4a4a4a" />
          <path d={`M${x - 20} 320 L${x + 30} 470`} stroke="#5e5e5e" strokeWidth="20" strokeLinecap="round" />
        </svg>
        <div style={{position: 'absolute', left: 80, top: 170, fontFamily: T.display, fontWeight: 700, fontSize: 130, color: T.gold, textShadow: '0 4px 20px #000'}}>{n}</div>
      </LiveFrame>
    );
  }
  if (v === 'moth-ecu') {
    // right at the lens: the phone's own screen has woken and lights the underside of the beam; a moth comes to it
    const a = p.f / 3;
    const mx = 980 + Math.sin(p.f / 11) * 300, my = 400 + Math.cos(p.f / 7) * 170, flap = 0.55 + Math.abs(Math.sin(a * 2)) * 0.45;
    return (
      <LiveFrame p={p} time={d.time}>
        <div style={{position: 'absolute', inset: 0, filter: 'blur(13px) brightness(.7)'}}><BeamFloor /><BeamTable f={p.f} /></div>
        <div style={{position: 'absolute', left: 240, top: -420, width: 1440, height: 1100, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(215,230,255,${0.26 + 0.16 * Math.abs(Math.sin(p.f / 6))}), rgba(215,230,255,0) 68%)`, mixBlendMode: 'screen'}} />
        <svg width={700} height={500} viewBox="-350 -250 700 500" style={{position: 'absolute', left: mx - 350, top: my - 250, filter: 'blur(3px)', transform: `rotate(${Math.sin(a) * 18}deg)`}}>
          {[-1, 1].map(s => (
            <g key={s} transform={`scale(${s * flap} 1)`}>
              <path d="M6 -14 Q150 -190 280 -110 Q240 20 8 24 Z" fill="#b8ac90" stroke="#3a3428" strokeWidth="5" />
              <path d="M8 22 Q130 60 170 170 Q70 150 4 44 Z" fill="#9a8e74" stroke="#3a3428" strokeWidth="5" />
              <circle cx="160" cy="-70" r="24" fill="#4a4030" />
            </g>
          ))}
          <ellipse rx="22" ry="84" fill="#3a3224" />
        </svg>
      </LiveFrame>
    );
  }
  if (v === 'look-up-high') {
    // Chat looks straight up into the lens, the helmet pushed back, the phone's light on his face. He has just seen it.
    const z = 1 + k * 0.1;
    return (
      <LiveFrame p={p} time={d.time} z={z} ox={960} oy={440} viewers={214}>
        <div style={{position: 'absolute', inset: 0, filter: 'blur(6px) brightness(.55)'}}><BeamFloor /><BeamTable f={p.f} box="torn" gold /></div>
        <HighFigure x={960} y={640} s={1.9} lit="rgba(215,230,255,.5)" head={<ChatRainHead x={0} y={-150} size={215} face="shock" look={-1} />} />
        <div style={{position: 'absolute', left: 340, top: -100, width: 1240, height: 980, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(215,230,255,.3), rgba(215,230,255,0) 68%)', mixBlendMode: 'screen'}} />
      </LiveFrame>
    );
  }
  const walking = v === 'rider-high' ? 1 - Math.min(1, k * 1.6) : 0;
  const fig = v === 'rider-high' || v === 'gold-high';
  return (
    <LiveFrame {...frame}>
      <BeamFloor />
      {fig && (
        <HighFigure x={960 + walking * 300} y={285 - walking * 90} s={1.02} lit={v === 'gold-high' ? 'rgba(255,220,130,.5)' : undefined}
          head={<ChatRainHead x={0} y={-140} size={135} face={v === 'gold-high' ? 'smirk' : 'wary'} />} />
      )}
      {/* the white box is the one lit thing down there, and it lights his chin */}
      {v === 'rider-high' && <div style={{position: 'absolute', left: 660, top: 120, width: 600, height: 460, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 90%, rgba(240,240,250,.32), rgba(0,0,0,0) 66%)', mixBlendMode: 'screen'}} />}
      <BeamTable f={p.f} box={v === 'gold-high' ? 'torn' : 'taped'} gold={v === 'gold-high'} />
      {v === 'gold-high' && (
        <>
          <Hand x={560} y={520} s={1.1} rot={22} skin="#4a4a4a" sleeve="#08090b" mode="open" />
          <Hand x={1360} y={520} s={1.1} rot={158} skin="#4a4a4a" sleeve="#08090b" mode="open" />
          <div style={{position: 'absolute', left: 420, top: 340, width: 1080, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,214,110,.3), rgba(0,0,0,0) 68%)', mixBlendMode: 'screen'}} />
        </>
      )}
      {v === 'table-high' && <div style={{position: 'absolute', left: 660, top: 400, width: 600, height: 460, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(240,240,250,.2), rgba(0,0,0,0) 66%)', mixBlendMode: 'screen'}} />}
      <Haze y={930} h={200} f={p.f} a={0.14} />
    </LiveFrame>
  );
};

// ---------------------------------------------------------------- Jay wedging the phone in the beam

const RoofUnderside: React.FC = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
    <rect x="-40" y="-40" width="2000" height="1160" fill="#0a0a0c" />
    {/* the underside of the tiled roof: rafters running to the crown, warmed from below by the headlight */}
    {Array.from({length: 13}, (_, i) => <line key={i} x1="1040" y1="-60" x2={-300 + i * 220} y2="760" stroke={i % 2 ? '#2c2219' : '#241b14'} strokeWidth="40" />)}
    <polygon points="-40,260 1960,170 1960,370 -40,470" fill="#4a3522" stroke="#160f09" strokeWidth="6" />
    <polygon points="-40,470 1960,370 1960,420 -40,520" fill="#241910" />
    {Array.from({length: 12}, (_, i) => <path key={i} d={`M${rnd(241, i) * 1920} ${240 + rnd(242, i) * 150} q120 -8 ${160 + rnd(243, i) * 150} -6`} stroke="rgba(20,12,6,.5)" strokeWidth="4" fill="none" />)}
    {/* a post rising to the beam at the left, a far post beyond */}
    <rect x="130" y="440" width="120" height="700" fill="#2c2d31" />
    <rect x="1640" y="400" width="66" height="720" fill="#1a1b1e" />
  </svg>
);

const BeamLow: ShotComponent = p => {
  const k = K(p);
  const up = 1 - Math.min(1, k * 2.2);
  return (
    <Insert p={p} z={[1, 1.04]}>
      <RoofUnderside />
      {/* the headlight bouncing up off the gravel: warm on the beam, nothing else */}
      <div style={{position: 'absolute', left: 300, top: 40, width: 1300, height: 820, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,226,170,.36), rgba(0,0,0,0) 68%)', mixBlendMode: 'screen'}} />
      {/* the phone going into the crack between beam and rafter */}
      <div style={{position: 'absolute', left: 930, top: 110 + up * 90, width: 170, height: 300, borderRadius: 22, background: '#101216', border: '6px solid #2c3036', transform: 'rotate(-5deg)', overflow: 'hidden'}}>
        <CrackedGlass w={160} h={290} seed={5} o={0.55} />
      </div>
      <Hand x={1030} y={480 + up * 90} s={1.25} rot={-96} skin={C.skin} sleeve="#21466b" mode="grip" />
      <Hand x={720} y={480 + (1 - k) * 30} s={1.1} rot={-70} skin={C.skin} sleeve="#21466b" mode="grip" />
      {/* the tape roll in his left hand */}
      <div style={{position: 'absolute', left: 660, top: 330, width: 120, height: 120, borderRadius: '50%', border: '30px solid #0d0d0d', boxSizing: 'border-box', background: 'transparent'}} />
      {/* his helmet from below and behind, dark, near the lens, the rear camera's red eye still running */}
      <svg width={1100} height={520} viewBox="0 0 1100 520" style={{position: 'absolute', left: 470, top: 720, filter: 'blur(5px)'}}>
        <ellipse cx="520" cy="420" rx="520" ry="400" fill="#060709" />
        <rect x="320" y="110" width="150" height="100" rx="14" fill="#030304" />
      </svg>
      <div style={{position: 'absolute', left: 930, top: 862, width: 18, height: 18, borderRadius: '50%', background: Math.floor(p.f / 15) % 2 ? '#5a1210' : '#ff3b30', boxShadow: '0 0 26px 10px rgba(255,59,48,.35)'}} />
    </Insert>
  );
};

const BeamIns: ShotComponent = p => (
  <Insert p={p} z={[1, 1.06]} glow="radial-gradient(ellipse at 40% 110%, rgba(255,226,170,.3), rgba(0,0,0,0) 70%)">
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {/* old teak along the frame, grain and cracks; the phone standing in the gap, face turned away, lens looking down */}
      <rect x="-40" y="-40" width="2000" height="1160" fill="#0b0806" />
      <polygon points="-40,120 1960,60 1960,700 -40,780" fill="#55402a" stroke="#1a110a" strokeWidth="8" />
      {Array.from({length: 22}, (_, i) => <path key={i} d={`M-40 ${150 + i * 28} Q${500 + rnd(251, i) * 400} ${130 + i * 28 + rnd(252, i) * 20} 1960 ${95 + i * 28}`} stroke="rgba(25,15,8,.42)" strokeWidth={2 + rnd(253, i) * 4} fill="none" />)}
      <polygon points="730,70 1200,60 1190,780 720,800" fill="#050403" />
      <rect x="770" y="120" width="380" height="720" rx="44" fill="#14161a" stroke="#2c3036" strokeWidth="8" />
      {/* two wraps of black tape round phone and beam */}
      {[0, 1].map(i => <polygon key={i} points={`500,${250 + i * 150} 1440,${240 + i * 150} 1440,${320 + i * 150} 500,${330 + i * 150}`} fill="#0a0a0a" stroke="#1d1d1d" strokeWidth="3" />)}
      {/* the lens, small as a bean */}
      <rect x="810" y="620" width="180" height="170" rx="30" fill="#0c0d10" stroke="#2a2d33" strokeWidth="5" />
      <circle cx="900" cy="705" r="46" fill="#06090f" stroke="#3a3f47" strokeWidth="8" />
      <circle cx="900" cy="705" r="24" fill="#122236" />
      <ellipse cx="888" cy="693" rx="10" ry="6" fill="rgba(255,255,255,.6)" />
      <circle cx="1060" cy="680" r="11" fill="#06090f" stroke="#2a2d33" strokeWidth="3" />
    </svg>
  </Insert>
);

// ---------------------------------------------------------------- the confrontation at the mouth of the shortcut

const POLICE = (d: Record<string, any>) => Array.isArray(d.lightAt) && d.lightAt[0] > 1000;

/** three patrol pick-ups in the mouth of the shortcut: pairs of high beams at the lens, a beacon on each */
const PatrolBeams: React.FC<{f: number; a?: number}> = ({f, a = 1}) => {
  const bc = beaconColor(f);
  return (
    <>
      {[[1520, 640, 1], [1760, 610, 0.8], [1980, 590, 0.65]].map(([x, y, s], i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: x - 130 * s, top: y - 120 * s, width: 260 * s, height: 170 * s, background: '#07080a', borderRadius: 14}} />
          <div style={{position: 'absolute', left: x - 40 * s, top: y - 170 * s, width: 80 * s, height: 26 * s, borderRadius: 8, background: `rgb(${bc})`, boxShadow: `0 0 ${90 * s}px ${40 * s}px rgba(${bc},.5)`}} />
          {[-92, 92].map(dx => (
            <div key={dx} style={{position: 'absolute', left: x + dx * s - 170 * s, top: y - 170 * s, width: 340 * s, height: 340 * s, borderRadius: '50%', opacity: a,
              background: 'radial-gradient(circle, #fff 0 12%, rgba(240,246,255,.75) 20%, rgba(220,232,255,0) 70%)'}} />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

const ConfrontWorld: React.FC<{p: ShotProps; horizon?: number; lever?: boolean; bag?: boolean; kneel?: boolean; sil?: boolean}> = ({p, horizon = 560, lever, bag, kneel, sil}) => {
  const d = D(p);
  const police = POLICE(d);
  return (
    <>
      <CemeteryRoad f={p.f} horizon={horizon} vx={1560} road={false} fog />
      <div style={{position: 'absolute', left: 60, top: 130, width: 1500, height: 780, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,165,195,.26), rgba(150,165,195,0) 68%)'}} />
      <Sala8 x={360} y={900} s={0.88} box="none" lit={police ? 1 : 0.5} />
      <GoldPile x={360} y={716} s={0.3} f={p.f} n={7} />
      {/* the scrub either side of the mouth of the path, the mud running out of it toward us */}
      {Array.from({length: 22}, (_, i) => {
        const x = 1130 + i * 62, gap = x > 1430 && x < 1880;
        return gap ? null : <div key={i} style={{position: 'absolute', left: x - 110, top: horizon - 170 + rnd(261, i) * 70, width: 240, height: 260, borderRadius: '50%', background: i % 2 ? '#07090a' : '#0a0c0c'}} />;
      })}
      <svg width={1600} height={620} viewBox="0 0 1600 620" style={{position: 'absolute', left: 900, top: horizon}}>
        <path d={`M560 0 L720 0 Q900 ${FLOOR - horizon} 1300 620 L-200 620 Q380 ${FLOOR - horizon} 560 0 Z`} fill="#20190f" />
        {Array.from({length: 18}, (_, i) => <path key={i} d={`M${640 - i * 6 - 40} ${20 + i * 26} l40 16 l40 -16`} stroke="rgba(0,0,0,.5)" strokeWidth={3 + i * 0.5} fill="none" />)}
      </svg>
      {police && <PatrolBeams f={p.f} />}
      {/* his unlit bike at the mouth, facing the path; the braid on its handlebar glowing */}
      <Motorcycle x={1800} y={FLOOR - 40} scale={0.7} color="#101216" helmetOnBike={false} />
      <div style={{position: 'absolute', left: 1925, top: FLOOR - 225, width: 10, height: 28, borderRadius: 5, background: C.key, boxShadow: '0 0 14px 6px rgba(125,255,106,.6)'}} />
      {!police && <Headlight x={856} y={676} angle={-3} len={1200} spread={15} a={0.5} />}
      {police && <Headlight x={856} y={676} angle={-3} len={700} spread={15} a={0.28} />}
      <Haze y={820} h={240} f={p.f} a={0.15} />
      {sil && <div style={{position: 'absolute', left: 1050, top: 180, width: 1000, height: 820, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(240,246,255,.75), rgba(0,0,0,0) 66%)', mixBlendMode: 'screen'}} />}
      <div style={{position: 'absolute', inset: 0, filter: sil ? 'brightness(0)' : undefined}}><Actors p={p} rain bike headlight box={false} frontRec /></div>
      {!sil && (<>
      {/* Jay's beam lands on him: warm on his left, the police a cold edge on his right; both over the sprite so he is lit */}
      <div style={{position: 'absolute', left: 900, top: 240, width: 760, height: 800, borderRadius: '50%', background: `radial-gradient(ellipse at 42% 40%, rgba(255,236,190,${police ? 0.14 : 0.2}), rgba(0,0,0,0) 62%)`, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      {police && <div style={{position: 'absolute', left: 1040, top: 80, width: 900, height: 950, background: `linear-gradient(90deg, rgba(0,0,0,0), rgba(225,236,255,.2))`, mixBlendMode: 'screen', pointerEvents: 'none'}} />}
      {police && <div style={{position: 'absolute', inset: -400, background: `rgba(${beaconColor(p.f)},.07)`, mixBlendMode: 'screen', pointerEvents: 'none'}} />}
      </>)}
      {bag && (
        <svg width={190} height={205} viewBox="0 0 260 280" style={{position: 'absolute', left: 1060, top: 730, overflow: 'visible'}}>
          <path d="M40 60 Q130 30 220 60 L240 260 Q130 290 20 260 Z" fill="#3a3a30" stroke="#121208" strokeWidth="5" />
          <path d="M80 60 Q130 -30 180 60" stroke="#3a3a30" strokeWidth="12" fill="none" />
          <ellipse cx="130" cy="60" rx="70" ry="14" fill="#14120a" />
          <ellipse cx="110" cy="58" rx="30" ry="9" fill="none" stroke="#f0c93e" strokeWidth="7" />
          <circle cx="150" cy="54" r="5" fill="#fffbe0" />
        </svg>
      )}
      {lever && <div style={{position: 'absolute', left: 1268, top: 640, width: 13, height: 330, borderRadius: 6, background: 'linear-gradient(90deg, #ecf0f4, #5a6068)', transform: 'rotate(7deg)', zIndex: 18}} />}
      {kneel && <KneelMarks />}
      {d.cuffs && !sil && (
        <svg width={90} height={50} viewBox="0 0 90 50" style={{position: 'absolute', left: 1042 - 45, top: 662 - 25, zIndex: 19}}>
          <circle cx="26" cy="26" r="15" fill="none" stroke="#e4e9ef" strokeWidth="6" />
          <circle cx="64" cy="26" r="15" fill="none" stroke="#e4e9ef" strokeWidth="6" />
          <line x1="40" y1="26" x2="50" y2="26" stroke="#e4e9ef" strokeWidth="6" />
        </svg>
      )}
    </>
  );
};

/** on his knees (the crouch sprite): tears and mud over the scar */
const KneelMarks: React.FC = () => {
  const x = 1220, s = 510 / 520, top = FLOOR - 510 + 160 * s;
  return (
    <div style={{position: 'absolute', left: x - 100 * s, top, width: 200 * s, height: 200 * s, zIndex: 18, pointerEvents: 'none'}}>
      <svg width={200 * s} height={260 * s} viewBox="0 0 200 260" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d="M70 72 q-3 24 -2 42 M130 72 q3 22 2 38" stroke="rgba(190,225,255,.85)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M128 48 q18 6 16 26 q-12 2 -24 -8 Z" fill="rgba(52,36,20,.7)" />
        <path d="M60 40 q-14 14 -8 28 q10 -2 14 -14 Z" fill="rgba(52,36,20,.55)" />
        <path d="M134 52 L144 66" stroke="#9a5a46" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Confront: ShotComponent = p0 => {
  const v = p0.shot.view ?? '';
  // the kneel is a close on Chat; over Chat's shoulder (the one crossing of the line) Chat is the camera, not in frame
  const aimed = aimData(v === 'kneel-close' ? {...p0, shot: {...p0.shot, view: 'chat-close'}} : p0);
  const data = aimed.crossLine ? {...aimed, cast: (aimed.cast as string[]).filter(c => !c.startsWith('chat@'))} : aimed;
  const p = {...p0, shot: {...p0.shot, data}};
  const d = D(p);
  const horizon = v.endsWith('-low') ? 800 : v.endsWith('-high') ? 340 : 560;
  const lever = ['teer-low', 'teer-sil'].includes(v);
  const kneel = ((d.cast ?? []) as string[]).some(c => c.startsWith('chat@') && /\bcrouch\b/.test(c));
  const world = <ConfrontWorld p={p} horizon={horizon} bag={v === 'chat-low'} lever={lever} kneel={kneel} />;
  const fore = d.ots === 'jay' ? (
    <>
      <Shoulder side="l" color="#0b1826" w={720} />
      <div style={{position: 'absolute', left: 40, top: 300, width: 520, height: 500, borderRadius: '50% 50% 42% 42%', background: '#07080b'}} />
    </>
  ) : d.crossLine ? <Shoulder side="r" color="#07080a" w={620} /> : undefined;
  return <Stage p={p} light="lamp" world={world} fore={fore} foreBlur={18} foreDark={0.55} />;
};

const SpotlightSnap: ShotComponent = p => {
  const d = D(p);
  const flash = 1 - Math.min(1, p.f / 16);
  const world = (
    <>
      <ConfrontWorld p={p} />
      {/* his shadow thrown the whole way back to Jay's front wheel */}
      <svg width={1400} height={260} viewBox="0 0 1400 260" style={{position: 'absolute', left: 200, top: 800}}>
        <polygon points="1040,130 1120,120 280,50 90,90 150,180" fill="rgba(0,0,0,.72)" />
      </svg>
    </>
  );
  return (
    <Stage p={{...p, shot: {...p.shot, data: {...d, cam: [1, 1.02, 980, 540]}}}} light="lamp" world={world} over={
      <div style={{position: 'absolute', inset: 0, background: `rgba(255,255,255,${0.85 * flash})`, pointerEvents: 'none'}} />
    } />
  );
};

/** high from the beam: Chat small in the middle of two fans of light, the two shadows crossing on the mud */
const ChatHigh: ShotComponent = p => {
  const bc = beaconColor(p.f);
  return (
    <Stage p={{...p, shot: {...p.shot, data: {...D(p), cast: [], cam: [1, 1.04, 960, 540]}}}} light="lamp" world={
      <>
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: '#0c0a08'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <polygon points="-300,700 -300,1000 1100,640 1100,560" fill="rgba(255,226,170,.28)" />
          <polygon points="2240,80 2240,660 860,620 860,540" fill="rgba(215,230,255,.33)" />
          {Array.from({length: 120}, (_, i) => <ellipse key={i} cx={rnd(271, i) * 1920} cy={rnd(272, i) * 1080} rx={12 + rnd(273, i) * 34} ry={4 + rnd(274, i) * 9} fill="rgba(0,0,0,.28)" />)}
          {Array.from({length: 18}, (_, i) => {
            const x = 1200 + i * 42, y = 490 - i * 10;
            return <path key={'t' + i} d={`M${x - 20} ${y - 14} L${x} ${y} L${x - 20} ${y + 14}`} stroke="rgba(0,0,0,.5)" strokeWidth="8" fill="none" />;
          })}
          {/* the two shadows, one away from each light, crossing at his feet */}
          <polygon points="960,560 1000,590 1680,430 1600,360" fill="rgba(0,0,0,.78)" />
          <polygon points="960,560 930,600 200,700 260,590" fill="rgba(0,0,0,.78)" />
        </svg>
        {/* Jay's bike a dark shape at the end of his beam, the police lamps at the other */}
        <div style={{position: 'absolute', left: -20, top: 720, width: 300, height: 110, borderRadius: 40, background: '#050506', transform: 'rotate(-14deg)'}} />
        <div style={{position: 'absolute', left: 230, top: 680, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, #fff, rgba(255,240,200,0) 70%)'}} />
        {[[1760, 180], [1800, 320], [1820, 470]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #fff 0 14%, rgba(225,236,255,0) 70%)'}} />)}
        <div style={{position: 'absolute', left: 1740, top: 80, width: 60, height: 20, borderRadius: 6, background: `rgb(${bc})`, boxShadow: `0 0 80px 40px rgba(${bc},.45)`}} />
        <HighFigure x={960} y={410} s={0.92} lit="rgba(255,236,190,.6)" head={<ChatRainHead x={0} y={-132} size={116} face="scared" />} />
        <div style={{position: 'absolute', left: 1040, top: 500, width: 12, height: 190, borderRadius: 6, background: '#dfe4ea', transform: 'rotate(-10deg)'}} />
        <Haze y={540} h={240} f={p.f} a={0.1} />
      </>
    } />
  );
};

const ChatSees: ShotComponent = p => {
  const k = K(p);
  return (
    <Insert p={p} bg="#030304" z={[1, 1.06]} glow="radial-gradient(ellipse at 50% 45%, rgba(190,215,255,.2), rgba(0,0,0,0) 60%)">
      {/* behind the phone, close and out of focus: his own black coat */}
      <div style={{position: 'absolute', left: 200, top: 300, width: 1520, height: 1100, borderRadius: '50% 50% 0 0', background: '#0a0b0e', filter: 'blur(26px)'}} />
      <div style={{position: 'absolute', left: 380, top: 44, width: 1160, height: 800, borderRadius: 70, background: '#101216', boxShadow: '0 0 180px 40px rgba(180,210,255,.26)', transform: `rotate(-3deg) translateY(${Math.sin(p.f / 3) * 3}px)`}}>
        <div style={{position: 'absolute', inset: 26, borderRadius: 48, overflow: 'hidden', background: '#000'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1108, height: 748, overflow: 'hidden', filter: 'saturate(.5) contrast(1.15)'}}>
            <div style={{position: 'absolute', inset: 0, filter: 'blur(4px) brightness(.5)', transform: 'scale(.6)', transformOrigin: '0 0'}}><BeamFloor /></div>
            {/* the phone sees him looking at it: his face fills the screen */}
            <div style={{position: 'absolute', left: 554, top: 40 + k * 8, width: 0, height: 0}}>
              <ChatRainHead x={0} y={0} size={500} face="shock" look={0} />
            </div>
          </div>
          <LiveBadge x={36} y={36} s={1.25} f={p.f} viewers={214} label="คนกำลังดู" />
          <LiveComments items={['เห็นหน้าแล้ว', 'แคปไว้!!', 'นั่นวินเบอร์ 17 ไม่ใช่เหรอ']} x={790} y={250} s={1.1} gap={72} w={310} />
          <CrackedGlass w={1108} h={748} seed={5} cx={0.7} cy={0.24} o={0.85} />
        </div>
      </div>
      <Hand x={300} y={640} s={1.5} rot={8} skin="#4a4a4a" sleeve="#08090b" mode="grip" />
      <Hand x={1640} y={660} s={1.5} rot={172} skin="#4a4a4a" sleeve="#08090b" mode="grip" />
    </Insert>
  );
};

const SmashLow: ShotComponent = p => {
  const hit = Math.round(p.len * 0.14);
  const t = Math.max(0, p.f - hit);
  const fall = p.f < hit ? p.f / hit : 1;
  const walk = kf(p.f, [[p.len * 0.45, 0], [p.len * 0.85, 1]]);
  return (
    <Insert p={p} bg="#040405" z={[1, 1.03]}>
      {/* lens on the stone: the table's underside above, the gold a blur of light on top of it, the floor running away */}
      <div style={{position: 'absolute', left: 0, top: 620, width: 1920, height: 460, background: 'linear-gradient(#1a1a1c, #3a3a3e)'}} />
      <svg width={1920} height={460} style={{position: 'absolute', left: 0, top: 620}}>
        {Array.from({length: 9}, (_, i) => <line key={i} x1={960} y1={-30} x2={i * 300 - 240} y2={460} stroke="rgba(0,0,0,.34)" strokeWidth="5" />)}
      </svg>
      <div style={{position: 'absolute', left: 500, top: 80, width: 900, height: 90, borderRadius: '50%', background: '#55575c', filter: 'blur(7px)'}} />
      <div style={{position: 'absolute', left: 860, top: 120, width: 190, height: 520, background: '#232428', filter: 'blur(7px)'}} />
      <div style={{position: 'absolute', left: 600, top: 0, width: 700, height: 130, filter: 'blur(5px)'}}><GoldPile x={350} y={70} s={0.8} f={p.f} n={9} /></div>
      <div style={{position: 'absolute', left: 300, top: -90, width: 1300, height: 420, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,214,110,.3), rgba(0,0,0,0) 68%)', mixBlendMode: 'screen'}} />
      {/* the phone */}
      <div style={{position: 'absolute', left: 620, top: fall < 1 ? -300 + fall * 960 : 680, width: 520, height: fall < 1 ? 280 : 120, borderRadius: 26, background: '#101216', border: '6px solid #2c3036', transform: `rotate(${fall < 1 ? -18 : -3}deg)`, overflow: 'hidden'}}>
        {fall >= 1 && <CrackedGlass w={510} h={110} seed={9} cx={0.42} cy={0.5} o={1} />}
      </div>
      {/* the glass going everywhere, each splinter catching the gold */}
      {fall >= 1 && Array.from({length: 46}, (_, i) => {
        const a = -Math.PI * rnd(281, i), sp = 6 + rnd(282, i) * 26, g = 0.55;
        const x = 880 + Math.cos(a) * sp * Math.min(t, 26), y = 720 + Math.sin(a) * sp * Math.min(t, 26) * 0.75 + g * Math.min(t, 26) ** 2 * 0.32;
        return <div key={i} style={{position: 'absolute', left: x, top: Math.min(y, 1040 - rnd(283, i) * 150), width: 8 + rnd(284, i) * 20, height: 4 + rnd(285, i) * 9, background: i % 3 ? '#e8d48e' : '#dfe9f4', transform: `rotate(${rnd(286, i) * 180 + t * 9}deg)`, boxShadow: i % 4 === 0 ? '0 0 12px 3px rgba(255,226,140,.6)' : undefined}} />;
      })}
      {/* the mud-caked boot stepping through */}
      {walk > 0 && (
        <svg width={720} height={820} viewBox="0 0 720 820" style={{position: 'absolute', left: 2100 - walk * 1120, top: 330}}>
          <path d="M210 -40 L500 -40 L510 500 Q700 540 700 700 L700 790 L120 790 L120 620 Z" fill="#0c0d0f" />
          <path d="M120 790 L700 790 L700 740 L120 740 Z" fill="#050506" />
          {Array.from({length: 16}, (_, i) => <ellipse key={i} cx={150 + rnd(287, i) * 500} cy={620 + rnd(288, i) * 150} rx={18 + rnd(289, i) * 40} ry={10 + rnd(290, i) * 16} fill="#3a2a18" />)}
        </svg>
      )}
    </Insert>
  );
};

const LeverIns: ShotComponent = p => {
  const k = kf(p.f, [[0, 0], [p.len * 0.7, 1]]);
  return (
    <Insert p={p} z={[1, 1.04]} glow="linear-gradient(95deg, rgba(255,236,190,.32), rgba(0,0,0,0) 62%)">
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* the raised seat of his bike, the compartment under it; the bar drawn out toward us, one white line along it */}
        <path d="M-40 330 Q700 200 1980 300 L1980 90 L-40 110 Z" fill="#0d0e10" />
        <rect x="-40" y="560" width="2000" height="560" fill="#080809" />
        <path d="M280 560 L1660 560 L1560 330 L360 330 Z" fill="#030304" />
        <rect x="360" y="440" width="540" height="110" rx="20" fill="#141518" />
        <rect x="430" y="462" width="240" height="66" fill="#08090a" />
        <rect x={720 - k * 220} y="400" width="1300" height="48" rx="20" fill="url(#lever)" transform={`rotate(4 ${720 - k * 220} 424)`} />
        <defs><linearGradient id="lever" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f6f8fb" /><stop offset=".3" stopColor="#8a9098" /><stop offset="1" stopColor="#2a2d31" /></linearGradient></defs>
      </svg>
      <Hand x={1280 - k * 220} y={430} s={1.5} rot={176} skin="#4a4a4a" sleeve="#08090b" mode="grip" />
    </Insert>
  );
};

const GripEcu: ShotComponent = p => {
  const sh = Math.sin(p.f * 2.2) * 2.4;
  return (
    <Insert p={p} bg="#010102" z={[1, 1.02]} grain={0.16}>
      {/* the darkest frame of the film: only the dash's amber numbers, and what they just reach */}
      <div style={{position: 'absolute', left: 1120, top: 100, width: 700, height: 420, borderRadius: 26, background: '#050505', border: '4px solid #0d0d0e'}}>
        <div style={{position: 'absolute', left: 90, top: 80, fontFamily: 'monospace', fontWeight: 700, fontSize: 130, color: '#b9761c', textShadow: '0 0 30px rgba(220,140,40,.5)'}}>0</div>
        <div style={{position: 'absolute', left: 300, top: 118, fontFamily: 'monospace', fontSize: 40, color: '#6a4410'}}>km/h</div>
        <div style={{position: 'absolute', left: 90, top: 280, width: 500, height: 20, borderRadius: 10, background: '#2a1a08'}}><div style={{width: '22%', height: '100%', borderRadius: 10, background: '#a8681a'}} /></div>
      </div>
      <div style={{position: 'absolute', left: 660, top: 180, width: 1200, height: 900, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(200,130,50,.3), rgba(0,0,0,0) 64%)', mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh}px, ${-sh * 0.6}px)`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <rect x="-40" y="630" width="1180" height="170" rx="40" fill="#08090a" transform="rotate(-5 560 715)" />
          {Array.from({length: 13}, (_, i) => <rect key={i} x={60 + i * 80} y="640" width="16" height="150" rx="7" fill="#101114" transform="rotate(-5 560 715)" />)}
        </svg>
        <Hand x={560} y={690} s={2.2} rot={-8} skin="#7a5238" sleeve="#0a1520" mode="grip" />
        {/* white knuckles */}
        {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 610 + i * 88, top: 590 + i * 5, width: 46, height: 34, borderRadius: '50%', background: 'rgba(235,225,205,.62)', filter: 'blur(4px)'}} />)}
      </div>
      {/* the watch on his other wrist, far across the bars, trembling with the engine */}
      <div style={{position: 'absolute', left: 90 + sh * 2, top: 180 - sh, width: 240, height: 200, filter: 'blur(8px)'}}>
        <div style={{position: 'absolute', left: 60, top: 40, width: 120, height: 120, borderRadius: '50%', background: '#1a1e22', border: '10px solid #6a5a40'}} />
      </div>
    </Insert>
  );
};

/** Teer as a black cut-out against the lamps, the megaphone up. Silhouette data comes from story.json */
const TeerSil: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  return (
    <Stage p={p} light="lamp" cam={d.cam} world={
      <>
        <ConfrontWorld p={p} sil />
        {/* the megaphone, and the notebook black in his other hand */}
        <svg width={230} height={200} viewBox="0 0 200 200" style={{position: 'absolute', left: 1290, top: 440, zIndex: 19}}>
          <path d="M190 100 L140 88 L10 20 L10 180 L140 124 L190 116 Z" fill="#020203" />
        </svg>
      </>
    } />
  );
};

// ---------------------------------------------------------------- dawn at the sala

const DawnSala: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const standing = ((d.cast ?? []) as string[]).some(c => c.startsWith('jay@') && !/\bsit\b/.test(c));
  const otsWho = d.ots as string | undefined;
  // the helmet comes off and stays in his hand: the shell, both cameras and the rear LED still blinking
  const s = 516 / 520;
  return (
    <Stage p={p} light="dawn" world={
      <>
        <CemeteryRoad f={p.f} tone="dawn" horizon={560} vx={1000} road={false} fog={false} />
        <div style={{position: 'absolute', left: 300, top: 40, width: 2200, height: 1100, background: 'radial-gradient(ellipse at 88% 30%, rgba(255,200,120,.62), rgba(0,0,0,0) 62%)'}} />
        <Sala8 x={1080} y={960} s={1.05} tone="dawn" box="none" lit={0.7} />
        <svg width={900} height={400} viewBox="0 0 900 400" style={{position: 'absolute', left: 1500, top: 620}}>
          <path d="M0 400 Q300 200 900 120 L900 180 Q340 260 140 400 Z" fill="#3a2a1c" />
        </svg>
        {standing && <Motorcycle x={250} y={FLOOR - 4} scale={0.92} color="#2c3a4a" helmetOnBike={false} flip />}
        <Haze y={840} h={180} f={p.f} a={0.08} />
        <Actors p={p} bike helmet={false} flipBike={!d.lookBack} />
        {/* gold on the right side of every face */}
        <div style={{position: 'absolute', left: 300, top: 60, width: 2200, height: 1000, background: 'linear-gradient(100deg, rgba(0,0,0,0) 22%, rgba(255,196,110,.36) 62%, rgba(255,214,140,.5))', mixBlendMode: 'screen', pointerEvents: 'none'}} />
        {standing && !otsWho && (
          <svg viewBox="0 0 200 200" width={150} height={150} style={{position: 'absolute', left: 700 + 18 * s, top: FLOOR - 516 + 244 * s - 50, overflow: 'visible', zIndex: 18}}>
            <g transform="translate(0 40)">
              <HelmetShell />
              <HelmetCams rec f={p.f} />
            </g>
            <circle cx="30" cy="48" r="7" fill={Math.floor(p.f / 15) % 2 ? '#5a1210' : '#ff3b30'} />
            {Math.floor(p.f / 15) % 2 === 0 && <circle cx="30" cy="48" r="20" fill="rgba(255,59,48,.35)" />}
          </svg>
        )}
      </>
    } fore={otsWho === 'jay' ? <Shoulder side="l" color="#17293c" w={700} /> : undefined} foreBlur={18} foreDark={0.45} />
  );
};

// ---------------------------------------------------------------- the road at the curve

const BendWide: ShotComponent = p => {
  const d = D(p);
  const bc = beaconColor(p.f);
  return (
    <Stage p={p} light="lamp" cam={[0.95, 1, 1000, 540]} world={
      <>
        <CemeteryRoad f={p.f} horizon={590} vx={1400} road={false} fog="thick" />
        {/* the moon on the fog; far off behind him, small and grey, the sala he has his back to */}
        <div style={{position: 'absolute', left: 900, top: 120, width: 1100, height: 680, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,165,195,.42), rgba(150,165,195,0) 68%)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: 0.75, filter: 'blur(3px)'}}><Sala8 x={1530} y={650} s={0.26} box="placed" /></div>
        <svg width={3320} height={700} viewBox="-700 540 3320 700" style={{position: 'absolute', left: -700, top: 540}}>
          <path d="M-700 1240 Q700 860 1400 610 L1500 610 Q1000 900 500 1240 Z" fill="#2a2018" />
          <path d="M-300 1240 Q800 880 1450 610" stroke="rgba(0,0,0,.3)" strokeWidth="14" fill="none" />
        </svg>
        <Tamarind x={180} y={760} s={1.4} seed={37} />
        <div style={{position: 'absolute', left: 780, top: 500, width: 520, height: 460, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(170,185,215,.34), rgba(0,0,0,0) 66%)'}} />
        <RoadsideMemorial x={1040} y={910} s={1.05} tone="dawn" />
        {d.beaconSweep && (
          <>
            <div style={{position: 'absolute', left: 620, top: 300, width: 900, height: 700, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${bc},.55), rgba(0,0,0,0) 62%)`, mixBlendMode: 'screen'}} />
            <div style={{position: 'absolute', left: 1540, top: 590, width: 22, height: 14, borderRadius: 4, background: `rgb(${bc})`, boxShadow: `0 0 50px 22px rgba(${bc},.55)`}} />
          </>
        )}
        {!d.beaconSweep && <JayBike x={660} y={950} f={p.f} face="wary" rec flip />}
        {/* the only light on him: the little screen on the bars */}
        {!d.beaconSweep && <div style={{position: 'absolute', left: 240, top: 480, width: 520, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(120,170,255,.5), rgba(0,0,0,0) 65%)', mixBlendMode: 'screen'}} />}
        <Haze y={790} h={220} f={p.f} a={0.16} />
      </>
    } />
  );
};

const TurnLow: ShotComponent = p => {
  const k = K(p);
  const q = noCam(p);
  return (
    <Stage p={q} light="night" cam={[1, 1.05, 960, 560]} world={
      <>
        <CemeteryRoad f={p.f} horizon={760} vx={1200} fog="thick" graves />
        {/* high beam swinging across the fog toward the sala */}
        <Headlight x={520} y={700} angle={-14 + k * 12} len={1700} spread={20} a={0.7} />
        <div style={{position: 'absolute', left: 390, top: 570, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, #fff 0 16%, rgba(255,240,200,.6) 34%, rgba(255,240,200,0) 70%)'}} />
        <div style={{position: 'absolute', left: 1160, top: 420, width: 700, height: 420, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,240,210,.5), rgba(0,0,0,0) 68%)', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, filter: 'blur(4px)', opacity: 0.8}}><Sala8 x={1490} y={770} s={0.3} /></div>
      </>
    } fore={
      <>
        {/* the front wheel, thrown over hard: a thin ellipse near the lens, tyre tearing the laterite */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${430 + k * 40} 900) scale(.55 1) rotate(${p.f * 14})`}>
            <circle r="310" fill="none" stroke="#040405" strokeWidth="110" />
            {Array.from({length: 10}, (_, i) => <line key={i} x1="0" y1="0" x2={Math.cos(i * 0.63) * 270} y2={Math.sin(i * 0.63) * 270} stroke="#17181b" strokeWidth="11" />)}
          </g>
        </svg>
        {/* dust and stones coming at the lens */}
        {Array.from({length: 34}, (_, i) => {
          const t = ((k * 1.4 + rnd(291, i)) % 1);
          return <div key={i} style={{position: 'absolute', left: 640 + rnd(292, i) * 900 + t * 300, top: 1040 - t * (260 + rnd(293, i) * 420), width: 8 + t * 40, height: 8 + t * 40, borderRadius: '45%', background: i % 3 ? 'rgba(170,132,90,.55)' : '#1a1410', filter: `blur(${t * 8}px)`}} />;
        })}
        {Array.from({length: 7}, (_, i) => <div key={'d' + i} style={{position: 'absolute', left: 620 + i * 130, top: 790 - i * 26, width: 480, height: 300, borderRadius: '50%', background: `rgba(160,132,100,${0.3 - i * 0.03})`, filter: 'blur(26px)'}} />)}
      </>
    } foreBlur={2} foreDark={0.08} />
  );
};

const HemClose: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  return (
    <Stage p={p} light="dawn" world={
      <>
        <CemeteryRoad f={p.f} tone="dawn" horizon={560} vx={1300} fog={false} road={false} />
        <div style={{position: 'absolute', left: 300, top: 0, width: 2200, height: 1100, background: 'radial-gradient(ellipse at 85% 30%, rgba(255,200,120,.65), rgba(0,0,0,0) 60%)'}} />
        <Tamarind x={1720} y={740} s={1.2} tone="dawn" seed={35} />
        <RoadsideMemorial x={1010} y={940} s={1.05} tone="dawn" fresh />
        <Actors p={p} bike={false} />
        <div style={{position: 'absolute', left: 900, top: 100, width: 900, height: 900, background: 'linear-gradient(95deg, rgba(0,0,0,0) 30%, rgba(255,200,120,.36))', mixBlendMode: 'screen', pointerEvents: 'none'}} />
      </>
    } />
  );
};

/** dawn on the main road: the day set in a low gold sun. REC off now, helmet still on */
const HighwayDawn: ShotComponent = p => (
  <Stage p={noCam(p)} light="dawn" cam={[1.25, 1.3, 900, 620]} world={
    <>
      <SideRoadSet tone="day" moving frame={p.f} />
      <div style={{position: 'absolute', left: 1700 - K(p) * 700, top: 450, width: 300, height: 110, borderRadius: 8, background: '#1d5a34', border: '6px solid #e8e8e0', color: '#fff', fontFamily: T.ui, fontWeight: 700, fontSize: 52, textAlign: 'center', lineHeight: '98px'}}>ตัวเมือง</div>
      <div style={{position: 'absolute', left: 1840 - K(p) * 700, top: 560, width: 14, height: 340, background: '#6a6a6a'}} />
      <JayBike x={980} y={930} f={p.f} face="happy" dead={false} spin={p.f * 14} />
      <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: 'linear-gradient(100deg, rgba(0,0,0,.25), rgba(255,190,110,.32))', mixBlendMode: 'screen', pointerEvents: 'none'}} />
    </>
  } />
);

// ---------------------------------------------------------------- the shop at dawn

const ShopDawn: ShotComponent = p => (
  <Stage p={noCam(p)} light="dawn" cam={[0.96, 1.02, 960, 540]} world={
    <>
      <div style={{position: 'absolute', inset: 0, filter: 'blur(3px) brightness(.8)'}}><ShopRow tone="day" f={p.f} /></div>
      {/* shutter rolled all the way up for the first time: the room behind it that nobody has seen */}
      <div style={{position: 'absolute', left: 620, top: 300, width: 680, height: 630, background: '#201a15'}} />
      <div style={{position: 'absolute', left: 640, top: 362, width: 640, height: 568, background: 'linear-gradient(#3a2e22, #151009)'}} />
      <div style={{position: 'absolute', left: 640, top: 362, width: 640, height: 36, background: 'repeating-linear-gradient(180deg, #4a4c50 0 7px, #26282b 7px 9px)'}} />
      <div style={{position: 'absolute', left: 650, top: 270, width: 620, height: 90, background: '#5a1e14', border: '6px solid #200a06', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Plex Thai, sans-serif', fontWeight: 700, fontSize: 64, color: '#f0d68a'}}>ข้าวต้มโต้รุ่ง</div>
      {/* fish-sauce crate, the same transistor radio on it, chairs stacked on a table */}
      <div style={{position: 'absolute', left: 700, top: 800, width: 220, height: 130, background: '#6a4a24', border: '5px solid #2a1a0a'}} />
      <div style={{position: 'absolute', left: 730, top: 712, width: 160, height: 92, borderRadius: 12, background: '#3a2a1e', border: '4px solid #1a120a'}}>
        <div style={{position: 'absolute', left: 14, top: 12, width: 130, height: 28, borderRadius: 4, background: '#e8952a'}} />
      </div>
      <div style={{position: 'absolute', left: 1040, top: 690, width: 210, height: 14, background: '#8a7a62'}} />
      {[1054, 1226].map(x => <div key={x} style={{position: 'absolute', left: x, top: 700, width: 10, height: 230, background: '#5a4c3a'}} />)}
      {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 1080 + i * 10, top: 640 - i * 28, width: 110, height: 16, background: '#b03a2e', borderRadius: 4}} />)}
      {/* an officer in the room, turned to the crate, torch hanging; another on the pavement with a clipboard */}
      <div style={{position: 'absolute', left: 900, top: 430, width: 180, height: 500, filter: 'brightness(.9)'}}>
        <Sprite id={'police-B' as CastId} height={470} layers={['face-wary' as CastId]} hideFace />
      </div>
      <div style={{position: 'absolute', left: 1360, top: 410, width: 200, height: 540}}>
        <Sprite id={'police-A' as CastId} height={530} layers={['face-wary' as CastId]} hideFace />
      </div>
      {/* first sun down the street, from the right */}
      <div style={{position: 'absolute', left: 300, top: 0, width: 2300, height: 1080, background: 'linear-gradient(100deg, rgba(0,0,0,0) 30%, rgba(255,196,110,.5))', mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', left: 300, top: 900, width: 1800, height: 200, background: 'linear-gradient(95deg, rgba(0,0,0,.2), rgba(255,210,140,.3))', mixBlendMode: 'screen'}} />
    </>
  } />
);

// ---------------------------------------------------------------- the room: the desk before the last night

const DeskHigh: ShotComponent = p => {
  const k = K(p);
  return (
    <Stage p={{...p, shot: {...p.shot, data: {...D(p), cast: []}}}} light="lamp" cam={[1, 1.05, 960, 520]} world={
      <>
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: '#14120f'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* the folding table from straight above, laid out like instruments */}
          <polygon points="150,60 1770,60 1860,1040 60,1040" fill="#8a7a62" stroke="#2a241a" strokeWidth="10" />
          {Array.from({length: 11}, (_, i) => <line key={i} x1={150 + i * 162} y1="60" x2={60 + i * 180} y2="1040" stroke="rgba(50,38,24,.18)" strokeWidth="5" />)}
          {/* tape roll */}
          <ellipse cx="490" cy="300" rx="120" ry="110" fill="rgba(0,0,0,.3)" transform="translate(-22 24)" />
          <circle cx="470" cy="280" r="110" fill="#0e0e0e" /><circle cx="470" cy="280" r="50" fill="#a59a84" /><path d="M520 370 L620 420 L590 460 L490 390 Z" fill="#0e0e0e" />
          {/* phone mount */}
          <rect x="360" y="610" width="280" height="120" rx="24" fill="rgba(0,0,0,.3)" transform="translate(-16 22)" />
          <rect x="360" y="610" width="280" height="120" rx="24" fill="#191b1f" stroke="#050506" strokeWidth="5" />
          <rect x="470" y="720" width="70" height="170" rx="14" fill="#191b1f" stroke="#050506" strokeWidth="5" />
          <circle cx="505" cy="670" r="28" fill="#2c3036" />
          {/* the helmet with its two cameras */}
          <ellipse cx="1420" cy="350" rx="230" ry="210" fill="rgba(0,0,0,.34)" transform="translate(-26 30)" />
          <circle cx="1400" cy="320" r="210" fill="#1b1e23" stroke="#050506" strokeWidth="6" />
          <path d="M1260 210 Q1400 110 1540 220" stroke="rgba(255,255,255,.16)" strokeWidth="14" fill="none" strokeLinecap="round" />
          <rect x="1330" y="60" width="140" height="84" rx="14" fill="#101216" stroke="#000" strokeWidth="4" /><circle cx="1400" cy="102" r="28" fill="#2b3a4a" stroke="#000" strokeWidth="4" />
          <rect x="1330" y="500" width="140" height="84" rx="14" fill="#101216" stroke="#000" strokeWidth="4" /><circle cx="1400" cy="542" r="28" fill="#2b3a4a" stroke="#000" strokeWidth="4" />
          <circle cx="1450" cy="520" r="9" fill={Math.floor(p.f / 15) % 2 ? '#5a1210' : '#ff3b30'} />
        </svg>
        {/* the old phone, its screen a spider's web, turning slowly under his fingers */}
        <div style={{position: 'absolute', left: 860, top: 400, width: 300, height: 540, borderRadius: 38, background: '#14161a', border: '10px solid #24272c', transform: `rotate(${-24 + k * 26}deg)`, boxShadow: '-14px 26px 28px rgba(0,0,0,.42)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, background: '#06080c'}} />
          <CrackedGlass w={280} h={520} seed={5} />
        </div>
        <Hand x={1260} y={860} s={1.3} rot={-160 + k * 12} skin={C.skin} sleeve="#21466b" mode="grip" />
        {/* the tube overhead: a pool on the table, the corners falling off */}
        <div style={{position: 'absolute', left: -200, top: -300, width: 2320, height: 1500, background: 'radial-gradient(ellipse at 50% 42%, rgba(255,250,235,.22), rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 75%)', mixBlendMode: 'normal'}} />
      </>
    } />
  );
};

// ---------------------------------------------------------------- the phone

const Screen: React.FC<{children: React.ReactNode; cracked?: boolean}> = ({children, cracked}) => (
  <div style={{position: 'absolute', inset: 0, background: '#0d1118', fontFamily: T.ui, color: '#fff'}}>
    {children}
    {cracked && <CrackedGlass w={428} h={808} seed={5} />}
  </div>
);

const PhoneInHand: React.FC<{p: ShotProps; children: React.ReactNode; glow?: string; bg?: string; base?: string; thumb?: number}> = ({p, children, glow = 'radial-gradient(ellipse at 50% 50%, rgba(120,160,255,.34), rgba(0,0,0,0) 65%)', bg = '#070809', base = 'linear-gradient(#1c2430, #0a0d12)', thumb}) => (
  <Insert p={p} bg={bg} glow={glow}>
    <div style={{position: 'absolute', left: -100, top: 640, width: 2200, height: 600, background: base, borderRadius: '50% 50% 0 0'}} />
    <Hand x={1100} y={780} s={1.4} skin={C.skin} sleeve="#21466b" mode="grip" flip />
    <Phone x={960} y={520} rot={-4}>{children}</Phone>
    {thumb !== undefined && <Hand x={1300} y={thumb} s={1.05} rot={196} skin={C.skin} mode="open" />}
  </Insert>
);

const LiveSetup: ShotComponent = p => {
  const d = D(p);
  const press = p.f > p.len * 0.62;
  return (
    <PhoneInHand p={p} thumb={press ? 590 : 660} base="linear-gradient(#7a6c56, #4a4034)" glow="radial-gradient(ellipse at 50% 0%, rgba(255,250,235,.3), rgba(0,0,0,0) 70%)" bg="#14120f">
      <Screen cracked>
        <div style={{position: 'absolute', top: 48, width: '100%', textAlign: 'center', fontSize: 28, opacity: 0.8}}>ตั้งค่าไลฟ์</div>
        <div style={{position: 'absolute', left: 134, top: 110, width: 160, height: 160, borderRadius: '50%', background: '#1b1e23', border: '5px solid #39404a'}} />
        <div style={{position: 'absolute', top: 290, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 36}}>{d.page}</div>
        <div style={{position: 'absolute', left: 34, top: 380, width: 360, padding: '18px 22px', boxSizing: 'border-box', borderRadius: 14, background: 'rgba(255,255,255,.08)', fontSize: 30}}>
          <div style={{fontSize: 22, opacity: 0.6}}>ชื่อไลฟ์</div>{d.title}
        </div>
        <div style={{position: 'absolute', left: 64, top: 530, width: 300, height: 90, borderRadius: 45, background: press ? '#a81710' : '#e0241c', textAlign: 'center', lineHeight: '90px', fontSize: 36, fontWeight: 700, boxShadow: press ? '0 0 40px rgba(255,60,50,.7)' : undefined}}>เริ่มไลฟ์</div>
      </Screen>
    </PhoneInHand>
  );
};

const ViewersEcu: ShotComponent = p => {
  const d = D(p);
  const k = K(p);
  const n = viewersAt(d.viewers, k);
  const blink = !d.flood && Math.floor(p.f / 14) % 2 === 0;
  const FLOOD = ['นั่นทองจริงเหรอ', 'แจ้งตำรวจ!!', 'ใครถ่ายอยู่', 'ทองพิพิธภัณฑ์นี่หว่า', 'แชร์ด่วน', 'ซอยไหนเนี่ย', 'โทร 191 ยัง', 'เจย์ระวังตัว'];
  return (
    <Insert p={p} bg="#020305" z={[1, 1.08]}>
      <div style={{position: 'absolute', left: 150, top: 110, width: 1620, height: 800, borderRadius: 30, background: '#0d1118', boxShadow: '0 0 170px rgba(255,60,50,.2)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 80, top: 90, height: 170, padding: '0 56px', borderRadius: 24, background: '#e0241c', display: 'flex', alignItems: 'center', gap: 34, fontFamily: T.ui, fontWeight: 700, fontSize: 112, color: '#fff'}}>
          <span style={{width: 50, height: 50, borderRadius: '50%', background: Math.floor(p.f / 15) % 2 ? 'rgba(255,255,255,.35)' : '#fff'}} />LIVE
        </div>
        <div style={{position: 'absolute', left: 80, top: 300, fontFamily: T.ui, fontWeight: 700, fontSize: 400, lineHeight: 1, color: '#fff', opacity: blink ? 0.72 : 1, fontVariantNumeric: 'tabular-nums'}}>{n}</div>
        <div style={{position: 'absolute', left: 100 + String(n).length * 245, top: 560, fontFamily: T.ui, fontSize: 80, color: '#aeb6c2'}}>คนกำลังดู</div>
        {d.flood && FLOOD.map((c, i) => {
          const t = (p.f * 3.5 + i * 80) % 640;
          return <div key={i} style={{position: 'absolute', left: 1190 + (i % 2) * 50, top: 610 - t, padding: '10px 22px', borderRadius: 18, background: 'rgba(255,255,255,.12)', fontFamily: T.ui, fontSize: 40, color: '#fff', whiteSpace: 'nowrap'}}>{c}</div>;
        })}
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, rgba(0,0,0,0) 2px 6px)'}} />
      </div>
    </Insert>
  );
};

const LiveRestart: ShotComponent = p => {
  const d = D(p);
  const on = p.f > p.len * 0.45;
  const n = on ? Math.round(kf(p.f, [[p.len * 0.45, 12], [p.len, d.viewers ?? 214]])) : 0;
  return (
    <Insert p={p} glow="radial-gradient(ellipse at 50% 45%, rgba(120,160,255,.32), rgba(0,0,0,0) 65%)">
      {/* the main phone in its mount on the bars, the road dark past it */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d="M-60 1000 Q700 850 1980 930" stroke="#15171b" strokeWidth="80" fill="none" />
        <rect x="900" y="860" width="120" height="120" rx="20" fill="#101114" />
      </svg>
      <Phone x={960} y={480} rot={-3} s={0.98}>
        <Screen>
          {/* the front camera's picture: the gravel road ahead */}
          <div style={{position: 'absolute', left: 0, top: 0, width: 428, height: 400, background: 'linear-gradient(#050608, #1a1712)', overflow: 'hidden', filter: on ? undefined : 'grayscale(1) brightness(.6)'}}>
            <div style={{position: 'absolute', left: 60, top: 180, width: 310, height: 220, background: '#3a3226', clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)'}} />
          </div>
          {on ? <LiveBadge x={18} y={18} s={0.86} f={p.f} viewers={n} /> : null}
          <div style={{position: 'absolute', left: 30, top: 430, fontSize: 24, opacity: 0.65}}>เลือกกล้อง</div>
          {['กล้องในเครื่อง', 'หมวก-หน้า', 'หมวก-หลัง'].map((c, i) => (
            <div key={c} style={{position: 'absolute', left: 30, top: 476 + i * 76, width: 368, height: 64, lineHeight: '64px', padding: '0 22px', boxSizing: 'border-box', borderRadius: 14, fontSize: 30, background: i === 1 ? '#e0241c' : 'rgba(255,255,255,.08)', fontWeight: i === 1 ? 700 : 400}}>{c}</div>
          ))}
        </Screen>
      </Phone>
      <Hand x={1240} y={on ? 620 : 700} s={1.05} rot={196} skin={C.skin} sleeve="#21466b" mode="open" />
    </Insert>
  );
};

// ---------------------------------------------------------------- the handlebar: Jay watches his own live

const SmallBeamView: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(.25)', transformOrigin: '0 0', filter: 'saturate(.4) contrast(1.2) brightness(1.1)'}}>
    <BeamFloor />
    <BeamTable f={f} />
  </div>
);

const LivePov: ShotComponent = p => {
  const d = D(p);
  const k = K(p);
  if (d.highlight) {
    // the same picture, the comment nobody read now the whole frame. A memory: warm, faded
    const a = appear(p.f, 3, 14);
    return (
      <AbsoluteFill style={{background: '#000', filter: 'saturate(.5) sepia(.28)'}}>
        <div style={{position: 'absolute', inset: 0, filter: 'blur(9px) brightness(.5) saturate(.5)'}}><BeamFloor /><BeamTable f={p.f} /></div>
        <LiveBadge x={60} y={70} s={1.3} f={p.f} viewers={d.viewers} />
        <div style={{position: 'absolute', left: 260, top: 280, width: 1400, padding: '50px 60px', boxSizing: 'border-box', borderRadius: 36, background: 'rgba(0,0,0,.72)', border: `6px solid ${T.gold}`, fontFamily: T.ui, opacity: a, transform: `scale(${0.82 + 0.18 * a})`}}>
          <div style={{fontSize: 56, fontWeight: 700, color: T.gold}}>ธีร์ สายตรวจ</div>
          <div style={{fontSize: 108, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap'}}>อย่าลงจากรถ</div>
        </div>
        <Grain f={p.f} opacity={0.24} />
      </AbsoluteFill>
    );
  }
  const lost = d.feed === 'lost';
  const cut = lost && k > 0.5;
  const shake = lost ? Math.sin(p.f * 2.3) * 12 * (1 - k) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <BarScreen f={p.f} zoom={push(p, 1.55, 1.6)} headlight={false} road="gravel">
        {cut ? (
          <div style={{position: 'absolute', inset: 0, background: '#050507', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.ui, fontWeight: 700, fontSize: 40, color: '#aeb6c2'}}>ไลฟ์สิ้นสุด</div>
        ) : lost ? (
          // his face right on the lens, overflowing the picture, tearing
          <div style={{position: 'absolute', inset: 0, background: '#111', overflow: 'hidden', transform: `translateX(${shake}px)`, filter: 'saturate(.5) contrast(1.3)'}}>
            <div style={{position: 'absolute', left: 240, top: -20, width: 0, height: 0}}><ChatRainHead x={0} y={0} size={420} face="angry" /></div>
            {[40, 120, 210].map((y, i) => <div key={y} style={{position: 'absolute', left: 0, top: y, width: 480, height: 14 + i * 7, background: 'rgba(0,0,0,.8)', transform: `translateX(${Math.sin(p.f + i) * 60}px)`}} />)}
          </div>
        ) : (
          <>
            <SmallBeamView f={p.f} />
            <LiveBadge x={10} y={10} s={0.58} f={p.f} viewers={d.viewers} />
            <LiveComments items={(d.comments ?? []).slice(0, 3)} x={8} y={182} w={200} s={0.68} faint={d.tinyComment} gap={52} />
          </>
        )}
      </BarScreen>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- dawn inserts

const PatrolRadio: ShotComponent = p => {
  const on = Math.floor(p.f / 6) % 2 === 0;
  return (
    <Insert p={p} bg="#17120d" glow="radial-gradient(ellipse at 95% 10%, rgba(255,206,130,.6), rgba(0,0,0,0) 65%)">
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* the pick-up's dash through its open door: windscreen full of low gold, the radio under it, its mic on a coil */}
        <polygon points="480,-40 1960,-40 1960,370 760,420" fill="#e8bd80" />
        <polygon points="480,-40 760,420 700,440 400,-40" fill="#14100c" />
        <rect x="-40" y="420" width="2000" height="700" fill="#1a1612" />
        <path d="M-40 430 Q900 370 1960 400 L1960 490 Q900 460 -40 520 Z" fill="#27211b" />
        <rect x="620" y="560" width="760" height="280" rx="26" fill="#0f1113" stroke="#000" strokeWidth="7" />
        <rect x="670" y="610" width="360" height="110" rx="10" fill={on ? '#27d163' : '#0d3a1e'} />
        {on && <rect x="670" y="610" width="360" height="110" rx="10" fill="rgba(53,224,106,.3)" filter="blur(12px)" />}
        <text x="850" y="686" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="62" fill={on ? '#052a12' : '#0a2a15'}>CH 04</text>
        {[1100, 1190, 1280].map(x => <circle key={x} cx={x} cy="665" r="32" fill="#22252a" stroke="#000" strokeWidth="4" />)}
        {Array.from({length: 7}, (_, i) => <rect key={i} x={690 + i * 90} y="760" width="60" height="40" rx="7" fill="#22252a" />)}
        <path d="M1380 700 q70 -30 90 60 q-60 40 -20 90 q60 40 0 90 q-50 30 -20 100" stroke="#050506" strokeWidth="18" fill="none" />
        <rect x="1370" y="980" width="150" height="240" rx="50" fill="#0c0d0f" stroke="#000" strokeWidth="5" />
        <circle cx={850} cy={530} r={on ? 70 : 0} fill="rgba(53,224,106,.14)" />
      </svg>
    </Insert>
  );
};

const EnvelopeIns: ShotComponent = p => {
  const k = kf(p.f, [[0, 0], [p.len * 0.6, 1]]);
  return (
    <Insert p={p} bg="#2a2118" glow="radial-gradient(ellipse at 95% 10%, rgba(255,206,130,.6), rgba(0,0,0,0) 65%)">
      {/* the bike's cracked seat, low sun from the right throwing two long hand shadows left */}
      <div style={{position: 'absolute', left: -60, top: 120, width: 2040, height: 900, borderRadius: 120, background: 'linear-gradient(#26231e, #17140f)'}} />
      {Array.from({length: 8}, (_, i) => <div key={i} style={{position: 'absolute', left: 200 + rnd(301, i) * 1500, top: 220 + rnd(302, i) * 660, width: 150, height: 5, background: 'rgba(0,0,0,.42)', transform: `rotate(${rnd(303, i) * 50 - 25}deg)`}} />)}
      <div style={{position: 'absolute', left: 170, top: 610, width: 900, height: 110, borderRadius: 55, background: 'rgba(0,0,0,.45)', filter: 'blur(14px)'}} />
      <Hand x={1490 - k * 170} y={460} s={1.5} rot={182} skin="#e8b995" sleeve="#6f5b44" mode="grip" />
      <div style={{position: 'absolute', left: 860 - k * 170 + 20, top: 340, width: 500, height: 290, background: '#f7f4ec', borderRadius: 6, boxShadow: '-20px 20px 26px rgba(0,0,0,.35)', transform: 'rotate(-2deg)'}}>
        <svg width={500} height={290} viewBox="0 0 500 290" style={{position: 'absolute', inset: 0}}>
          <path d="M0 0 L250 150 L500 0" stroke="#d8d2c4" strokeWidth="4" fill="none" />
          <circle cx="400" cy="214" r="46" fill="none" stroke="#9a1e1e" strokeWidth="5" />
          <text x="400" y="222" textAnchor="middle" fontSize="20" fill="#9a1e1e" fontFamily="Plex Thai, sans-serif">พิพิธภัณฑ์</text>
          <text x="48" y="240" fontSize="30" fill="#55504a" fontFamily="Plex Thai, sans-serif">เงินนำจับ</text>
        </svg>
      </div>
      <Hand x={530 + k * 40} y={620} s={1.5} rot={-12} skin={C.skin} sleeve="#21466b" mode="open" />
      {/* the watch on Jay's left wrist */}
      <div style={{position: 'absolute', left: 300 + k * 40, top: 590, width: 130, height: 130, borderRadius: '50%', background: '#1a1e22', border: '12px solid #8a7a5a', transform: 'scale(.86, 1)'}} />
    </Insert>
  );
};

// ---------------------------------------------------------------- end card

const EndCard: ShotComponent = p => {
  const d = D(p);
  const k = appear(p.f, 4, 18);
  const lines = String(d.title ?? '').split('\n');
  return (
    <AbsoluteFill style={{background: '#14100d', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${push(p, 1.02, 1.08)})`, filter: 'blur(7px) brightness(.6)'}}>
        <CemeteryRoad f={p.f} tone="dawn" horizon={600} vx={1000} fog={false} road={false} />
        <Sala8 x={1000} y={980} s={1} tone="dawn" box="can" lit={0.5} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 85% 15%, rgba(255,200,120,.4), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 44%, rgba(0,0,0,.35) 15%, rgba(0,0,0,.78) 90%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>
        {lines.map((l, i) => <div key={i} style={{fontFamily: T.display, fontSize: 104, fontWeight: 700, color: i === 0 ? T.white : T.gold, lineHeight: 1.22, textShadow: '0 6px 30px rgba(0,0,0,.85)'}}>{l}</div>)}
        <div style={{marginTop: 34, fontFamily: T.ui, fontSize: 38, color: '#e8e2d6'}}>ทองครบ 14 ชิ้น · ค่างวด {d.money ?? '5,100 / 5,100 ✓'}</div>
        <div style={{display: 'inline-block', marginTop: 46, padding: '20px 46px', borderRadius: 50, background: '#e0241c', fontFamily: T.ui, fontWeight: 700, fontSize: 48, color: '#fff', opacity: appear(p.f, 22, 34)}}>{d.cta}</div>
        <div style={{marginTop: 44, fontFamily: T.ui, fontSize: 30, color: '#b9b2a4'}}>{d.note}</div>
      </div>
      <Grain f={p.f} opacity={0.12} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- routing into scenes.tsx

const CONFRONT_HUD = 'พฤหัส 02:02';
const SALA_VIEWS: Record<string, ShotComponent> = {
  'beam-low': BeamLow, 'beam-ins': BeamIns, 'chat-sees-ecu': ChatSees, 'smash-low': SmashLow, 'lever-ins': LeverIns, 'grip-ecu': GripEcu,
  'spotlight-snap-wide': SpotlightSnap, 'teer-sil': TeerSil, 'chat-high': ChatHigh,
};

/** the view this chapter draws itself, or undefined to let the place's usual scene handle it */
export function liveView(scene: string, p: ShotProps): ShotComponent | undefined {
  const d = D(p);
  const v = p.shot.view ?? '';
  switch (scene) {
    case 'sala':
      if (SALA_VIEWS[v]) return SALA_VIEWS[v];
      if (d.hud === CONFRONT_HUD && d.cast) return Confront;
      if (d.light === 'dawn' && d.cast) return DawnSala;
      return undefined;
    case 'road':
      if (OPENING[v]) return OPENING[v];
      if (v === 'bend-wide') return BendWide;
      if (v === 'turn-low') return TurnLow;
      if (v === 'hem-close') return HemClose;
      if (v === 'highway-side' && d.light === 'dawn') return HighwayDawn;
      return undefined;
    case 'shop': return v === 'dawn-wide' ? ShopDawn : undefined;
    case 'room': return v === 'desk-high' ? DeskHigh : undefined;
    case 'barscreen': return v === 'live-pov' ? LivePov : undefined;
    case 'phone': return ({'live-setup-ins': LiveSetup, 'viewers-ecu': ViewersEcu, 'live-restart-ins': LiveRestart} as Record<string, ShotComponent>)[v];
    case 'hand': return ({'patrol-radio-ins': PatrolRadio, 'envelope-ins': EnvelopeIns} as Record<string, ShotComponent>)[v];
    default: return undefined;
  }
}

export const LIVE: Record<string, ShotComponent> = {livefeed: LiveFeed, endcard: EndCard};
