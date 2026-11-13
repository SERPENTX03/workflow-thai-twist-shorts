import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../../engine/episode';
import {CastSprite} from '../../cast/CastSprite';
import {T} from '../../engine/theme';
import {Hand} from '../../kit/inserts';
import {FoamBox, HangBulb, Pool, Svg} from './common';
import {MERU} from './meru';
import {STALL} from './stall';

// Three covers. Each is a picture from the film, with the channel's cover grammar on top (what has done best so far: one
// big readable face on the right third, two big lines on the left, one concrete object). brief.md: no meat and no body on
// a cover, and nothing here gives the twist away.

const mk = (scene: string, view: string, data: Record<string, unknown>): ShotProps =>
  ({shot: {scene, view, i: 0, frames: 1, data} as unknown as ShotProps['shot'], f: 0, len: 1, W: 1920, H: 1080});

/** Heavy Thai display line: the outline sits under the fill, so the letters keep their weight */
const Line: React.FC<{x: number; y: number; size: number; color?: string; glow?: string; children: React.ReactNode}> = ({x, y, size, color = '#fff', glow, children}) => {
  const base: React.CSSProperties = {position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', fontFamily: T.display, fontWeight: 700, fontSize: size, lineHeight: 1.2};
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{...base, color: '#08070a', WebkitTextStroke: `${size * 0.11}px #08070a`, textShadow: `0 ${size * 0.05}px ${size * 0.04}px rgba(0,0,0,.9)${glow ? `, 0 0 ${size * 0.3}px ${glow}` : ''}`}}>{children}</div>
      <div style={{...base, position: 'relative', color}}>{children}</div>
    </div>
  );
};

const Chip: React.FC<{x: number; y: number; bg?: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, bg = '#d91f26', color = '#fff', size = 54, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'rotate(-1.6deg)', background: bg, color, fontFamily: T.display, fontWeight: 700, fontSize: size, lineHeight: 1.25, padding: '4px 30px 8px', borderRadius: 12, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,.6)'}}>{children}</div>
);

/** darkens the left of the frame so the words sit on something quiet */
const LeftShade: React.FC<{to?: number; a?: number}> = ({to = 62, a = 0.86}) => (
  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(5,3,4,${a}) 0%, rgba(5,3,4,${a * 0.72}) ${to * 0.6}%, rgba(5,3,4,0) ${to}%)`}} />
);

// A: the strangest number in the book --------------------------------------------------------------------------------

const Tag: React.FC = () => (
  <div style={{position: 'absolute', left: 74, top: 690, width: 880, height: 290, transform: 'rotate(-2.5deg)', background: '#e9dfc0', boxShadow: '0 22px 50px rgba(0,0,0,.75)', overflow: 'hidden',
    backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 69px, rgba(70,90,130,.3) 69px 72px)'}}>
    <div style={{position: 'absolute', left: 44, top: 22, fontFamily: T.display, fontWeight: 600, fontSize: 74, color: '#6b6655'}}>หมู 180.- / กิโล</div>
    {[['A-0', 44], ['350.-', 306], ['/ กรัม', 590]].map(([t, x]) => <div key={t} style={{position: 'absolute', left: x, top: 150, fontFamily: T.display, fontWeight: 700, fontSize: 96, color: '#1b2750', whiteSpace: 'nowrap'}}>{t}</div>)}
    <Svg><ellipse cx={428} cy={212} rx={158} ry={68} fill="none" stroke="#d3131b" strokeWidth={11} transform="rotate(-3 428 212)" /></Svg>
  </div>
);

export const CoverA: React.FC = () => {
  const Scene = STALL.stall;
  return (
    <AbsoluteFill style={{background: '#090405'}}>
      <CastSprite />
      <Scene {...mk('stall', 'cover', {set: 'in', time: 'night', shirt: false, light: 'warm', lightAt: [1100, 200], shade: 'r', shadeA: 0.34, cam: [3.5, 3.5, 880, 510], cast: ['thyme@1000 shock yaw=-0.32']})} />
      <Pool x={1060} y={220} rx={760} ry={600} color="255,40,30" a={0.42} />
      <HangBulb x={1060} y={116} top={-60} r={34} />
      <LeftShade to={50} />
      <Chip x={74} y={26}>สมุดบัญชีลับของพ่อ</Chip>
      <Line x={74} y={140} size={178}>เนื้ออะไร</Line>
      <Line x={74} y={332} size={178} color="#ff3b36" glow="rgba(255,30,30,.55)">กรัมละ <span style={{color: '#ffcf3f'}}>350</span></Line>
      <Tag />
    </AbsoluteFill>
  );
};

// B: the lid nobody may open -----------------------------------------------------------------------------------------

const Lid: React.FC = () => (
  <>
    <Svg>
      <defs>
        <linearGradient id="cv-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf7ec" /><stop offset="1" stopColor="#d4cdbc" /></linearGradient>
        <linearGradient id="cv-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8a293" /><stop offset="1" stopColor="#3b3833" /></linearGradient>
      </defs>
      {/* lid top going away from us, then the long side with its gold trim */}
      <path d="M-40 840 L120 628 L2000 628 L2000 840 Z" fill="url(#cv-lid)" stroke="#c8a44e" strokeWidth={10} />
      <rect x={-40} y={840} width={2000} height={260} fill="url(#cv-front)" />
      <rect x={-40} y={836} width={2000} height={14} fill="#c8a44e" />
      {[1270, 1780].map(x => <g key={x}><circle cx={x} cy={950} r={40} fill="none" stroke="#b9994a" strokeWidth={9} /><path d={`M${x - 150} 950 H${x - 50} M${x + 50} 950 H${x + 150}`} stroke="#b9994a" strokeWidth={8} /></g>)}
      {/* the nails */}
      {[[205, 672], [1660, 672], [60, 800], [1800, 800]].map(([x, y]) => <g key={x}><ellipse cx={x} cy={y} rx={24} ry={15} fill="#55524b" /><ellipse cx={x - 6} cy={y - 4} rx={8} ry={5} fill="#d5d0c2" /></g>)}
    </Svg>
    {/* a candle on the lid is what lights it */}
    <Pool x={1010} y={700} rx={520} ry={190} color="255,190,110" a={0.5} />
    <Svg>
      <rect x={992} y={630} width={36} height={94} rx={5} fill="#f2e4c0" stroke="#a58f60" strokeWidth={3} />
      <path d="M1010 548 Q1038 594 1010 628 Q982 594 1010 548 Z" fill="#ffb13d" />
      <path d="M1010 582 Q1022 604 1010 626 Q998 604 1010 582 Z" fill="#fff2b0" />
    </Svg>
    <Pool x={1010} y={590} rx={230} color="255,170,70" a={0.75} />
    {/* Prasit's hand flat on the lid, safari cuff from the left, foreshortened with the surface */}
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '430px 740px', transform: 'scale(-1, 0.66)'}}>
      <Hand x={430} y={740} s={1.9} rot={200} skin="#c79a78" sleeve="#4f6653" mode="open" />
    </div>
  </>
);

export const CoverB: React.FC = () => {
  const Scene = MERU.meru;
  return (
    <AbsoluteFill style={{background: '#0d0604'}}>
      <CastSprite />
      <Scene {...mk('meru', 'cover', {tone: 'dusk', light: 'warm', lightAt: [1010, 590], key: '255,150,70', shade: 'r', shadeA: 0.4, cam: [3.5, 3.5, 880, 536], coffin: 'none', door: 'open', cast: ['thyme1@1000 worried yaw=-0.3 mark=drops']})} />
      <LeftShade to={56} />
      <Lid />
      <Chip x={74} y={22}>หมอประจำตลาดสั่งไว้</Chip>
      <Line x={74} y={128} size={186}>ห้ามเปิด</Line>
      <Line x={74} y={330} size={186} color="#ff3b36" glow="rgba(255,30,30,.55)">โลงพ่อ</Line>
      <Line x={74} y={958} size={62}>เผาแล้ว... <span style={{color: '#ffcf3f'}}>ไม่เหลือกระดูกสักชิ้น</span></Line>
    </AbsoluteFill>
  );
};

// C: the father himself, half a man behind the block ------------------------------------------------------------------

const BlockFront: React.FC = () => (
  <>
    <Svg>
      <defs><linearGradient id="cv-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b58a5e" /><stop offset="1" stopColor="#70502f" /></linearGradient></defs>
      <path d="M660 1100 L660 950 Q1320 805 1980 950 L1980 1100 Z" fill="#41291a" />
      <ellipse cx={1320} cy={950} rx={760} ry={110} fill="url(#cv-wood)" stroke="#1c120a" strokeWidth={6} />
      <ellipse cx={1320} cy={950} rx={520} ry={70} fill="none" stroke="#8a6340" strokeWidth={4} />
      <ellipse cx={1320} cy={950} rx={270} ry={36} fill="none" stroke="#8a6340" strokeWidth={4} />
    </Svg>
    <FoamBox x={1000} y={1004} w={290} />
  </>
);

export const CoverC: React.FC = () => {
  const Scene = STALL.stall;
  return (
    <AbsoluteFill style={{background: '#090405'}}>
      <CastSprite />
      <Scene {...mk('stall', 'cover', {set: 'in', time: 'night', light: 'warm', shirt: false, lightAt: [1050, 120], shade: 'r', shadeA: 0.42, cam: [3.5, 3.5, 880, 520], cast: ['charn@1000 wary']})} />
      <Pool x={1050} y={160} rx={620} ry={520} color="255,40,30" a={0.26} />
      <HangBulb x={1050} y={120} top={-60} r={34} />
      <LeftShade to={52} a={0.9} />
      <BlockFront />
      <Chip x={74} y={46} bg="#ffcf3f" color="#17120a">ลูกเป็นหมอ · พ่อขายหมู</Chip>
      <Line x={74} y={136} size={170}>เงินของพ่อ</Line>
      <Line x={74} y={336} size={170} color="#ff3b36" glow="rgba(255,30,30,.55)">มาจากไหน?</Line>
      <Line x={74} y={578} size={64}>หมูกิโลละ 180</Line>
      <Line x={74} y={662} size={64}>โอนให้ลูกเดือนละ <span style={{color: '#ffcf3f'}}>50,000</span></Line>
    </AbsoluteFill>
  );
};

export const COVERS = [
  {id: 'FatherLedgerCoverA', component: CoverA},
  {id: 'FatherLedgerCoverB', component: CoverB},
  {id: 'FatherLedgerCoverC', component: CoverC},
];
