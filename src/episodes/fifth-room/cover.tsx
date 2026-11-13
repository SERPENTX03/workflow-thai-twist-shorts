import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../../engine/episode';
import {CastSprite} from '../../cast/CastSprite';
import {T} from '../../engine/theme';
import {Pool, Svg} from '../../kit/frame';
import {Actors} from './cast';
import {Street, WINDOW5} from './ext';
import {NIMS} from './nim';

// Three covers, each a picture from the film with the channel's cover grammar on top (memory: one big readable face on the
// right third, two big lines on the left, a specific number). Nothing here names who is inside the room or who the villain is.
// The bottom-right corner stays free for YouTube's duration badge.

const mk = (scene: string, view: string, data: Record<string, unknown>): ShotProps =>
  ({shot: {scene, view, i: 0, frames: 1, data} as unknown as ShotProps['shot'], f: 0, len: 1, W: 1920, H: 1080});

const Line: React.FC<{x: number; y: number; size: number; color?: string; glow?: string; children: React.ReactNode}> = ({x, y, size, color = '#fff', glow, children}) => {
  const base: React.CSSProperties = {position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', fontFamily: T.display, fontWeight: 700, fontSize: size, lineHeight: 1.2};
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{...base, color: '#08070a', WebkitTextStroke: `${size * 0.11}px #08070a`, textShadow: `0 ${size * 0.05}px ${size * 0.04}px rgba(0,0,0,.9)${glow ? `, 0 0 ${size * 0.3}px ${glow}` : ''}`}}>{children}</div>
      <div style={{...base, position: 'relative', color}}>{children}</div>
    </div>
  );
};

const Chip: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'rotate(-1.6deg)', background: '#ffcf3f', color: '#17120a', fontFamily: T.display, fontWeight: 700, fontSize: 58, lineHeight: 1.25, padding: '4px 30px 8px', borderRadius: 12, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,.6)'}}>{children}</div>
);

const LeftShade: React.FC<{to?: number; a?: number}> = ({to = 62, a = 0.86}) => (
  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(5,3,4,${a}) 0%, rgba(5,3,4,${a * 0.72}) ${to * 0.6}%, rgba(5,3,4,0) ${to}%)`}} />
);

/** the street at night scaled about window five, which lands at (x, y) */
const NightHouse: React.FC<{p: ShotProps; s: number; x: number; y: number; blur?: number}> = ({p, s, x, y, blur = 0}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${x - WINDOW5.x * s}px, ${y - WINDOW5.y * s}px) scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined}}>
    <Street p={p} tone="night" five="lit" />
  </div>
);

// A: the number that does not add up, with Rin's face ---------------------------------------------------------------

/** five small windows in a row, the last one lit: the count at a glance */
const CountRow: React.FC<{x: number; y: number}> = ({x, y}) => (
  <Svg>
    {[0, 1, 2, 3, 4].map(i => {
      const wx = x + i * 164, lit = i === 4;
      return (
        <g key={i}>
          {lit && <rect x={wx - 12} y={y - 12} width={148} height={190} rx={8} fill="#ffb648" opacity={0.35} />}
          <rect x={wx} y={y} width={124} height={166} rx={5} fill={lit ? '#ffd27a' : '#1a1d26'} stroke={lit ? '#fff0c4' : '#59606f'} strokeWidth={7} />
          {lit
            ? [0, 1, 2, 3].map(j => <rect key={j} x={wx - 8} y={y + 14 + j * 38} width={140} height={22} fill="#2c1f14" />)
            : <path d={`M${wx + 62} ${y} V${y + 166} M${wx} ${y + 83} H${wx + 124}`} stroke="#59606f" strokeWidth={6} />}
        </g>
      );
    })}
  </Svg>
);

export const CoverA: React.FC = () => {
  const p = mk('ext', 'cover', {tone: 'night', five: 'lit', rim: 0, cam: [1, 1, 960, 540], cast: ['rin@1490,2190 h=2060 shock yaw=-0.25']});
  return (
    <AbsoluteFill style={{background: '#04050a', overflow: 'hidden'}}>
      <CastSprite />
      <NightHouse p={p} s={1.9} x={1110} y={250} blur={1.5} />
      <Pool x={1020} y={250} rx={470} ry={400} color="255,190,90" a={0.4} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(3,4,10,0) 45%, rgba(3,4,10,.92) 80%)'}} />
      <Actors p={p} />
      {/* her far side falls off; the window behind her warms the near one */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(4,3,8,.82) 0%, rgba(4,3,8,.3) 20%, rgba(4,3,8,0) 34%)'}} />
      <Pool x={1200} y={440} rx={300} ry={520} color="255,180,100" a={0.2} />
      <LeftShade to={50} />
      <Chip x={70} y={34}>ห้องที่ห้า</Chip>
      <Line x={70} y={160} size={142}>หน้าต่าง <span style={{color: '#ffcf3f'}}>5</span> บาน</Line>
      <Line x={70} y={350} size={142} color="#ff3b36" glow="rgba(255,30,30,.55)">ห้องมีแค่ <span style={{color: '#ffcf3f'}}>4</span></Line>
      <CountRow x={80} y={640} />
    </AbsoluteFill>
  );
};

// B: the lit window of an empty house, with the line the brief keeps for the cover -------------------------------------

export const CoverB: React.FC = () => {
  const p = mk('ext', 'cover', {tone: 'night', five: 'lit', cam: [1, 1, 960, 540], cast: []});
  const wx = 1370, wy = 460;
  return (
    <AbsoluteFill style={{background: '#04050a', overflow: 'hidden'}}>
      <CastSprite />
      <NightHouse p={p} s={2.2} x={wx + 96} y={wy} />
      <Pool x={wx} y={wy} rx={640} ry={560} color="255,180,80" a={0.5} />
      <LeftShade to={58} a={0.92} />
      <Svg><circle cx={wx} cy={wy} r={400} fill="none" stroke="#ff2b2b" strokeWidth={18} /></Svg>
      <Chip x={70} y={34}>ห้องที่ห้า</Chip>
      <Line x={70} y={170} size={136}>บ้านว่าง</Line>
      <Line x={70} y={340} size={136}>ไฟต้องเป็น <span style={{color: '#ffcf3f', fontSize: 170}}>0</span></Line>
      <Line x={70} y={570} size={136} color="#ff3b36" glow="rgba(255,30,30,.55)">หลังนี้</Line>
      <Line x={70} y={740} size={136} color="#ff3b36" glow="rgba(255,30,30,.55)">ไม่เคยเป็น <span style={{color: '#ffcf3f', fontSize: 170}}>0</span></Line>
    </AbsoluteFill>
  );
};

// C: Rin against the damp wall, the three knocks ------------------------------------------------------------------------

const Knock: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>
    {[34, 62, 94].map((r, i) => <circle key={r} cx={x} cy={y} r={r} fill="none" stroke="#ffcf3f" strokeWidth={10 - i * 2} opacity={1 - i * 0.28} />)}
    <circle cx={x} cy={y} r={16} fill="#ffcf3f" />
  </g>
);

export const CoverC: React.FC = () => {
  const Scene = NIMS.nim;
  return (
    <AbsoluteFill style={{background: '#090604', overflow: 'hidden'}}>
      <CastSprite />
      {/* shot 98 turned round and moved in, so the wall takes the left for the words and her face sits on the right third */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: 'translate(0px, -150px) scale(1.3)'}}>
        <div style={{position: 'absolute', inset: 0, transform: 'scaleX(-1)'}}>
          <Scene {...mk('nim', 'wall-palm-close', {light: 'lamp', lightAt: [320, 170], cam: [1, 1, 960, 540], rim: 0, cast: ['rin@830,1500 h=1240 scared yaw=0.6 head=8 armR=reach']})} />
        </div>
      </div>
      {/* the bulb that lights her, back in frame after the move in */}
      <Svg>
        <line x1={1790} y1={-20} x2={1790} y2={92} stroke="#050302" strokeWidth={6} />
        <circle cx={1790} cy={126} r={34} fill="#ffc77e" />
      </Svg>
      <Pool x={1790} y={126} rx={300} color="255,160,80" a={0.7} />
      <Pool x={1790} y={126} rx={90} color="255,232,180" a={0.85} />
      <Pool x={480} y={470} rx={760} ry={560} color="150,190,160" a={0.16} />
      <Pool x={1400} y={470} rx={170} ry={170} color="255,190,120" a={0.14} />
      <LeftShade to={40} a={0.34} />
      <Chip x={70} y={34}>ห้องที่ห้า</Chip>
      <Line x={70} y={170} size={158}>เคาะ <span style={{color: '#ffcf3f'}}>3</span> ที</Line>
      <Line x={70} y={370} size={158} color="#ff3b36" glow="rgba(255,30,30,.55)">ผนังเคาะตอบ</Line>
      <Svg>{[210, 460, 710].map(x => <Knock key={x} x={x} y={730} />)}</Svg>
    </AbsoluteFill>
  );
};

export const COVERS = [
  {id: 'FifthRoomCoverA', component: CoverA},
  {id: 'FifthRoomCoverB', component: CoverB},
  {id: 'FifthRoomCoverC', component: CoverC},
];
