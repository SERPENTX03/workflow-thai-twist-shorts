import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../../engine/episode';
import {CastSprite} from '../../cast/CastSprite';
import {T} from '../../engine/theme';
import {Pool, Svg} from '../../kit/frame';
import {Actors} from './cast';
import scenes from './scenes';

// Three covers in the channel's cover grammar (memory: one big readable face on the right third, two big lines on the
// left, a number or a ห้าม / ทำไม? hook). Only what the cold open shows (longform-rules.md → Concealment 8): a new
// nurse, 5,000 a night, one coma patient, two beds, rule 2 = never open bed 2's curtain, the red light behind it.
// Nothing about who the patient is, the drug, the speaker or the watcher. Bottom-right stays free for the duration badge.

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

const Chip: React.FC<{x: number; y: number; bg?: string; fg?: string; children: React.ReactNode}> = ({x, y, bg = '#ffcf3f', fg = '#17120a', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'rotate(-1.6deg)', background: bg, color: fg, fontFamily: T.display, fontWeight: 700, fontSize: 58, lineHeight: 1.25, padding: '4px 30px 8px', borderRadius: 12, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,.6)'}}>{children}</div>
);

const LeftShade: React.FC<{to?: number; a?: number}> = ({to = 60, a = 0.86}) => (
  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(4,4,6,${a}) 0%, rgba(4,4,6,${a * 0.72}) ${to * 0.6}%, rgba(4,4,6,0) ${to}%)`}} />
);

const Ward: React.FC<{view: string; data: Record<string, unknown>; blur?: number; bright?: number}> = ({view, data, blur = 2.5, bright = 0.9}) => (
  <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px) brightness(${bright})`}}>{scenes.ward(mk('ward', view, data))}</div>
);

const Big: React.FC<{cast: string; data?: Record<string, unknown>}> = ({cast, data = {}}) => (
  <Actors p={mk('ward', 'cover', {rim: 0, light: 'lamp', cast: [cast], ...data})} />
);

/** the red light through the curtain seam, cover-sized */
const RedDot: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 1}) => (
  <>
    <Pool x={x} y={y} rx={360 * r} color="255,40,30" a={0.55} />
    <Svg><circle cx={x} cy={y} r={70 * r} fill="#ff2a1f" opacity={0.35} /><circle cx={x} cy={y} r={22 * r} fill="#ff4a38" /></Svg>
  </>
);

// A: her shocked face, the closed curtain of bed 2 behind her with the red light in the seam --------------------------

export const CoverA: React.FC = () => (
  <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
    <CastSprite />
    <Ward view="beds-wide" data={{light: 'lamp', lamp: 'on', cast: [], cam: [1.7, 1.7, 1330, 470]}} blur={1} bright={1.25} />
    <RedDot x={940} y={560} r={1.1} />
    <Big cast="may@1430,2250 h=2120 shock yaw=-0.25 look=-0.6" data={{lightAt: [900, 500]}} />
    <Pool x={1250} y={560} rx={300} color="255,60,40" a={0.18} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(4,3,8,.6) 0%, rgba(4,3,8,0) 22%)'}} />
    <LeftShade to={48} a={0.8} />
    <Chip x={70} y={34}>พยาบาลเวรดึก</Chip>
    <Line x={70} y={190} size={168}>ห้ามเปิด</Line>
    <Line x={70} y={410} size={150} color="#ff3b36" glow="rgba(255,30,30,.55)">ม่านเตียง <span style={{color: '#ffcf3f'}}>2</span></Line>
  </AbsoluteFill>
);

// B: the number first: 5,000 a night, the rule sheet with rule 2 circled, her worried face ----------------------------

export const CoverB: React.FC = () => (
  <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
    <CastSprite />
    <Ward view="beds-wide" data={{light: 'lamp', lamp: 'on', cast: [], cam: [1.6, 1.6, 1200, 500]}} blur={3} bright={0.75} />
    <RedDot x={1640} y={430} r={0.8} />
    <Big cast="may@1450,2250 h=2120 worried yaw=-0.3 look=-0.5" data={{lightAt: [700, 300]}} />
    <LeftShade to={50} a={0.85} />
    <Chip x={70} y={34}>รับจ้างเฝ้าไข้ 3 คืน</Chip>
    <Line x={70} y={170} size={150}>คืนละ</Line>
    <Line x={70} y={350} size={210} color="#ffcf3f" glow="rgba(255,200,40,.35)">5,000</Line>
    {/* the rule sheet, rule 2 circled in red */}
    <div style={{position: 'absolute', left: 60, top: 690, width: 760, padding: '18px 34px 22px', background: '#f3ecd9', transform: 'rotate(-2.5deg)', borderRadius: 6, boxShadow: '0 14px 30px rgba(0,0,0,.65)', fontFamily: T.display, fontWeight: 700, color: '#2a2a33'}}>
      <div style={{fontSize: 40, opacity: 0.55}}>1. ฉีดยาทุกชั่วโมง ห้ามข้าม</div>
      <div style={{fontSize: 54, marginTop: 6, position: 'relative'}}>2. ห้ามเปิดม่านเตียงสอง
        <div style={{position: 'absolute', left: -34, top: -14, width: 680, height: 96, border: '7px solid #d8261e', borderRadius: '50%'}} />
      </div>
    </div>
  </AbsoluteFill>
);

// C: the question: one patient, two beds: the ward from behind the counter, her face at the right edge ----------------

export const CoverC: React.FC = () => (
  <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
    <CastSprite />
    <Ward view="beds-wide" data={{light: 'lamp', lamp: 'on', cast: ['woraT@464,699 h=435 lie sleep acc=none cover=dfe8ee'], cam: [1.25, 1.25, 900, 470]}} blur={1.2} bright={0.95} />
    <RedDot x={1300} y={500} r={0.9} />
    {/* the two beds, numbered: one occupied, one behind its curtain */}
    <Svg>
      <circle cx={520} cy={600} r={64} fill="#ffcf3f" stroke="#17120a" strokeWidth={8} /><text x={520} y={624} textAnchor="middle" fontFamily={T.display} fontWeight={700} fontSize={70} fill="#17120a">1</text>
      <circle cx={1180} cy={330} r={64} fill="#ff3b36" stroke="#17120a" strokeWidth={8} /><text x={1180} y={354} textAnchor="middle" fontFamily={T.display} fontWeight={700} fontSize={70} fill="#fff">2</text>
    </Svg>
    <Big cast="may@1640,2300 h=2050 wary yaw=-0.45 look=-0.8" data={{lightAt: [700, 300]}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 420, background: 'linear-gradient(180deg, rgba(4,4,6,.88) 0%, rgba(4,4,6,.6) 60%, rgba(4,4,6,0) 100%)'}} />
    <Chip x={70} y={34} bg="#ff3b36" fg="#fff">ชั้น 4 ตึกปิด</Chip>
    <Line x={70} y={120} size={124}>คนไข้มีคนเดียว</Line>
    <Line x={70} y={270} size={124} color="#ff3b36" glow="rgba(255,30,30,.55)">ทำไมมี <span style={{color: '#ffcf3f'}}>2</span> เตียง?</Line>
  </AbsoluteFill>
);

export const COVERS = [
  {id: 'BedTwoCoverA', component: CoverA},
  {id: 'BedTwoCoverB', component: CoverB},
  {id: 'BedTwoCoverC', component: CoverC},
];
