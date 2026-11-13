import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../../engine/episode';
import {CastSprite} from '../../cast/CastSprite';
import {T} from '../../engine/theme';
import {Pool, Svg} from '../../kit/frame';
import {Actors} from './cast';
import {VIEWS} from './ins';
import {PLATFORM_SCENES} from './platform';

// Three covers in the channel's cover grammar (memory: one big readable face on the right third, two big lines on the
// left, a specific number). Only what the cold open shows (longform-rules.md → Concealment 8): locker 104, locked
// 25 years, his own voice on the tape, the 01:15 train bringing back "the one who took his daughter".
// Nothing hints at the illness, the friend or the gun. The bottom-right corner stays free for the duration badge.

const mk = (scene: string, view: string, data: Record<string, unknown>): ShotProps =>
  ({shot: {scene, view, i: 0, frames: 1, data} as unknown as ShotProps['shot'], f: 30, len: 60, W: 1920, H: 1080});

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

const Big: React.FC<{cast: string; data?: Record<string, unknown>}> = ({cast, data = {}}) => (
  <Actors p={mk('platform', 'cover', {rim: 0, light: 'lamp', cast: [cast], ...data})} />
);

// A: his own face, the tape at his ear, the lockers behind ------------------------------------------------------------

export const CoverA: React.FC = () => (
  <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
    <CastSprite />
    <div style={{position: 'absolute', inset: 0, filter: 'blur(2.5px) brightness(.85)'}}>
      {PLATFORM_SCENES.platform(mk('platform', 'lockers-med', {light: 'lamp', cast: [], cam: [1.5, 1.5, 1180, 470]}))}
    </div>
    <Pool x={1400} y={120} rx={520} color="228,246,236" a={0.45} />
    <Big cast="sommai@1460,2240 h=2120 shock armR=chest prop=cassette yaw=-0.2 look=-0.3" />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(4,3,8,.7) 0%, rgba(4,3,8,0) 26%)'}} />
    <LeftShade to={52} />
    <Chip x={70} y={34}>ล็อคเกอร์ 104</Chip>
    <Line x={70} y={170} size={138}>ล็อกไว้ <span style={{color: '#ffcf3f'}}>25</span> ปี</Line>
    <Line x={70} y={360} size={138} color="#ff3b36" glow="rgba(255,30,30,.55)">ข้างในมี</Line>
    <Line x={70} y={540} size={138} color="#ff3b36" glow="rgba(255,30,30,.55)">เสียงของฉัน</Line>
  </AbsoluteFill>
);

// B: the locker door itself, the padlock circled --------------------------------------------------------------------

export const CoverB: React.FC = () => {
  const Door = VIEWS['locker104-ins'];
  return (
    <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
      <CastSprite />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: 'translate(260px, 60px) scale(1.0)'}}>{Door(mk('ins', 'locker104-ins', {}))}</div>
      <LeftShade to={56} a={0.92} />
      <Svg><circle cx={1690} cy={540} r={175} fill="none" stroke="#ff2b2b" strokeWidth={18} /></Svg>
      <Chip x={70} y={34}>ล็อคเกอร์ 104</Chip>
      <Line x={70} y={170} size={136}>ไม่มีใครเปิด</Line>
      <Line x={70} y={350} size={136}><span style={{color: '#ffcf3f', fontSize: 176}}>25</span> ปี</Line>
      <Line x={70} y={580} size={128} color="#ff3b36" glow="rgba(255,30,30,.55)">คืนนี้ฉันตัดมัน</Line>
    </AbsoluteFill>
  );
};

// C: the headlight of the 01:15 coming through the rain, his stern face ----------------------------------------------

export const CoverC: React.FC = () => (
  <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
    <CastSprite />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: 'translate(-420px, 0px)'}}>
      {PLATFORM_SCENES.track(mk('track', 'headlight-ew', {light: 'night', cam: [1.1, 1.1, 960, 520]}))}
    </div>
    <Pool x={560} y={470} rx={520} color="255,236,170" a={0.9} />
    <Pool x={560} y={470} rx={120} color="255,255,240" a={1} />
    <Big cast="sommai@1500,2260 h=2120 angry yaw=-0.45 look=-0.6" data={{lightAt: [400, 500]}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(4,3,8,.75) 0%, rgba(4,3,8,0) 24%)'}} />
    <Pool x={1180} y={520} rx={260} ry={520} color="255,236,170" a={0.22} />
    <LeftShade to={44} a={0.7} />
    <Chip x={70} y={34}>ล็อคเกอร์ 104</Chip>
    <Line x={70} y={170} size={150}>รถไฟ <span style={{color: '#ffcf3f'}}>01:15</span></Line>
    <Line x={70} y={370} size={124} color="#ff3b36" glow="rgba(255,30,30,.55)">จะพาคนร้าย</Line>
    <Line x={70} y={540} size={124} color="#ff3b36" glow="rgba(255,30,30,.55)">กลับมา</Line>
  </AbsoluteFill>
);

export const COVERS = [
  {id: 'Locker104CoverA', component: CoverA},
  {id: 'Locker104CoverB', component: CoverB},
  {id: 'Locker104CoverC', component: CoverC},
];
