import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CastSprite} from '../../cast/CastSprite';
import {Grain} from '../../kit/horror';
import {ActorView, parseActor, type RosterEntry} from '../../kit/stage';
import {Glow, WallClock} from '../../kit/world';
import {ROSTER} from './cast';
import {OrnateCoffin, SalaFuneralSet} from './sets';

// Three YouTube covers (1920×1080 → export 1280×720) for "เงินปากผี" (ghost-money), in the channel's house style:
// big stroked Thai words on the left, one character large on the right, a coloured kicker label, a small tag at the bottom.
const FONT = 'Kanit, sans-serif';
const stroke = (c: string, w: number) => ({WebkitTextStroke: `${w}px ${c}`, paintOrder: 'stroke fill'} as React.CSSProperties);
const T: React.CSSProperties = {fontFamily: FONT, fontWeight: 700, lineHeight: 1};
const RED = '#ff3b30',
  GOLD = '#ffd24a';

/** Creepy sinister wide grin + wide staring eyes in 200×500 character SVG space (matching "เที่ยวสุดท้าย หนึ่งล้านบาท" ref) */
const SinisterFaceOverlay: React.FC = () => (
  <g>
    {/* Cover default face on the head (cx=100, cy=65, r=65) */}
    <circle cx="100" cy="68" r="56" fill="#d89e74" />
    {/* Wrinkle lines */}
    <path d="M68 42 Q100 36 132 42 M74 34 Q100 29 126 34" fill="none" stroke="rgba(70,40,25,.35)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Dark eye bags & wide staring eyes */}
    <circle cx="77" cy="68" r="14" fill="rgba(45,28,22,.42)" />
    <circle cx="123" cy="68" r="14" fill="rgba(45,28,22,.42)" />
    <circle cx="77" cy="67" r="11" fill="#f5f5f0" stroke="#1a1a22" strokeWidth="2" />
    <circle cx="123" cy="67" r="11" fill="#f5f5f0" stroke="#1a1a22" strokeWidth="2" />
    <circle cx="77" cy="67" r="4.8" fill="#111" />
    <circle cx="123" cy="67" r="4.8" fill="#111" />
    <circle cx="75" cy="65" r="1.8" fill="#fff" />
    <circle cx="121" cy="65" r="1.8" fill="#fff" />
    {/* furrowed sinister brows */}
    <path d="M62 52 L89 58 M138 52 L111 58" stroke="#1f1d22" strokeWidth="4.5" strokeLinecap="round" />
    {/* Wide toothy creepy grin */}
    <path d="M56 90 Q100 132 144 90 Q100 108 56 90 Z" fill="#5e1916" stroke="#240c0a" strokeWidth="2.8" strokeLinejoin="round" />
    <path d="M62 93 Q100 124 138 93 Q100 106 62 93 Z" fill="#f4efe6" />
    {[74, 86, 100, 114, 126].map(tx => (
      <line key={tx} x1={tx} y1="96" x2={tx} y2="109" stroke="#2b1d1a" strokeWidth="1.6" />
    ))}
  </g>
);

const COVER_ROSTER: Record<string, RosterEntry> = {
  ...ROSTER,
  headmanCreepy: {
    ...ROSTER.headman,
    extra: () => <SinisterFaceOverlay />,
  },
};

const Shell: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#05070a', overflow: 'hidden'}}>
    <CastSprite />
    {children}
    <Grain f={20} opacity={0.1} />
  </AbsoluteFill>
);

const Actor: React.FC<{s: string; ppc: number; floor: number; glow: string}> = ({s, ppc, floor, glow}) => (
  <ActorView
    a={parseActor(s)}
    roster={COVER_ROSTER}
    floor={floor}
    pxPerCm={ppc}
    f={20}
    style={{filter: `drop-shadow(0 0 48px ${glow})`}}
  />
);

const Label: React.FC<{text: string; bg?: string; color?: string; tilt?: number}> = ({
  text,
  bg = '#d6261f',
  color = '#fff',
  tilt = 0,
}) => (
  <div
    style={{
      display: 'inline-block',
      ...T,
      fontWeight: 700,
      fontSize: 56,
      color,
      background: bg,
      padding: '10px 28px 16px',
      borderRadius: 14,
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      boxShadow: '0 8px 24px rgba(0,0,0,.55)',
    }}
  >
    {text}
  </div>
);

const LeftShade: React.FC<{to?: number}> = ({to = 62}) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(90deg, rgba(3,4,7,.96) 0%, rgba(3,4,7,.76) ${to - 22}%, rgba(3,4,7,0) ${to}%)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 74% 48%, transparent 36%, rgba(0,0,0,.72) 100%)',
      }}
    />
  </>
);

/** Fan of three 1,000-baht banknotes held in foreground */
const BanknotesFan: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <svg
    width="320"
    height="220"
    viewBox="-160 -110 320 220"
    style={{position: 'absolute', left: x - 160, top: y - 110, transform: `scale(${scale})`, overflow: 'visible', pointerEvents: 'none'}}
  >
    {[-14, 0, 14].map((deg, i) => (
      <g key={i} transform={`rotate(${deg} 0 40) translate(0 ${-i * 8})`}>
        <rect x="-105" y="-48" width="210" height="96" rx="8" fill="#d8c3a5" stroke="#2b2118" strokeWidth="5" />
        <rect x="-93" y="-36" width="186" height="72" rx="4" fill="#efe2cc" stroke="#8c6d53" strokeWidth="2.5" />
        <circle cx="-42" cy="0" r="24" fill="#b08d6a" opacity="0.65" />
        <rect x="18" y="-22" width="62" height="24" rx="4" fill="#9c3d32" />
        <text x="49" y="-4" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff8eb" fontFamily={FONT}>
          1000
        </text>
      </g>
    ))}
  </svg>
);

/** Blue Carbon Ledger Book (สมุดลงชื่อกระดาษคาร์บอนสีน้ำเงิน) */
const BlueLedgerProp: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <svg
    width="260"
    height="260"
    viewBox="-130 -130 260 260"
    style={{position: 'absolute', left: x - 130, top: y - 130, transform: `scale(${scale}) rotate(-8deg)`, overflow: 'visible', pointerEvents: 'none'}}
  >
    <rect x="-85" y="-105" width="170" height="210" rx="10" fill="#1e3f73" stroke="#0d1d38" strokeWidth="6" />
    <rect x="-70" y="-90" width="140" height="180" rx="5" fill="#f6f1e6" stroke="#8a8270" strokeWidth="3" />
    <rect x="-70" y="-90" width="140" height="42" fill="#3b6bc4" opacity="0.32" />
    <text x="0" y="-62" textAnchor="middle" fontSize="22" fontWeight="900" fill="#182a4a" fontFamily={FONT}>
      สมุดรายชื่อ
    </text>
    <line x1="-48" y1="-22" x2="48" y2="-22" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
    <line x1="-48" y1="6" x2="48" y2="6" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
    <line x1="-48" y1="34" x2="28" y2="34" stroke="#d6261f" strokeWidth="7" strokeLinecap="round" />
    <line x1="-54" y1="34" x2="54" y2="34" stroke="#d6261f" strokeWidth="4" />
  </svg>
);

/** Steaming rice porridge bowl tied with cursed red ritual thread (ข้าวต้มด้ายแดง) */
const RedThreadBowl: React.FC<{x: number; y: number; scale?: number}> = ({x, y, scale = 1}) => (
  <svg
    width="320"
    height="260"
    viewBox="-160 -160 320 260"
    style={{position: 'absolute', left: x - 160, top: y - 160, transform: `scale(${scale})`, overflow: 'visible', pointerEvents: 'none'}}
  >
    {/* Steam wisps */}
    <path d="M-35 -65 Q-50 -95 -28 -120 Q-10 -140 -30 -160" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="6" strokeLinecap="round" />
    <path d="M25 -70 Q10 -100 32 -125 Q48 -145 28 -165" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="6" strokeLinecap="round" />
    {/* Ceramic bowl */}
    <ellipse cx="0" cy="-36" rx="108" ry="34" fill="#f7f4eb" stroke="#2b2623" strokeWidth="6" />
    <ellipse cx="0" cy="-34" rx="92" ry="24" fill="#e8dfc8" />
    {/* Cursed Red Thread coiled inside and around the bowl */}
    <path
      d="M-65 -36 C-35 -52 25 -18 62 -38 C35 -54 -25 -20 -52 -32"
      fill="none"
      stroke="#ff261b"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path d="M-108 -36 Q-96 48 0 54 Q96 48 108 -36 Z" fill="#e6dfd1" stroke="#2b2623" strokeWidth="6" strokeLinejoin="round" />
    <rect x="-48" y="50" width="96" height="16" rx="6" fill="#bfb6a4" stroke="#2b2623" strokeWidth="5" />
    {/* Glowing red ritual thread tied around bowl exterior */}
    <path d="M-102 -6 Q0 16 102 -6" fill="none" stroke="#ff261b" strokeWidth="7" />
    <path d="M18 6 Q42 36 68 48 M18 6 Q4 38 -14 52" fill="none" stroke="#ff261b" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

/**
 * แบบที่ 1 (Cover A): สไตล์ปกซ้ายบน — ธามตกใจสุดขีดถือเงิน 3,000 บาท + รูปหน้าโลงด้านหลังคือเมฆที่นั่งอยู่ข้าง ๆ
 */
export const GhostMoneyCoverA: React.FC = () => (
  <Shell>
    <div style={{position: 'absolute', inset: 0, transform: 'scale(1.08)', transformOrigin: '1300px 600px', filter: 'brightness(.58) saturate(.88)'}}>
      <SalaFuneralSet tone="night" showDesk={false} showChairs={false} showCoffin={false} frame={20} />
    </div>
    {/* Ornate coffin & glowing portrait of Mek right behind Tham's shoulder */}
    <OrnateCoffin x={990} y={960} scale={1.22} photo="mek" frame={20} />
    <Glow x={1220} y={640} r={340} color="255,210,110" a={0.55} />
    {/* Red dashed clue box highlighting the funeral portrait */}
    <div
      style={{
        position: 'absolute',
        left: 1126,
        top: 552,
        width: 190,
        height: 236,
        border: `7px dashed ${RED}`,
        borderRadius: 16,
        boxShadow: '0 0 30px rgba(255,59,48,.45)',
      }}
    />

    <Glow x={1555} y={640} r={680} color="130,195,255" a={0.52} />
    <Actor s="tham@1555,1310 shock" ppc={8.0} floor={1310} glow="rgba(130,195,255,.6)" />
    <BanknotesFan x={1355} y={880} scale={1.08} />

    <LeftShade to={56} />
    <div style={{position: 'absolute', left: 84, top: 92}}>
      <Label text="จ้างนั่งฟังสวด ชม.ละ 3,000" bg={GOLD} color="#141414" />
    </div>
    <div style={{position: 'absolute', left: 80, top: 245, ...T}}>
      <div style={{fontSize: 205, color: '#fff', ...stroke('#000', 16), textShadow: '0 12px 40px rgba(0,0,0,.85)'}}>รูปหน้าโลง</div>
      <div
        style={{
          fontSize: 196,
          color: RED,
          marginTop: 16,
          ...stroke('#2a0000', 16),
          textShadow: '0 0 50px rgba(255,40,30,.55)',
        }}
      >
        คือคนข้างๆ
      </div>
    </div>
    <div style={{position: 'absolute', left: 86, bottom: 72, ...T, fontWeight: 600, fontSize: 56, color: '#e9edf2', ...stroke('#000', 9)}}>
      “พี่… อย่าเงยหน้ามองรูปเด็ดขาด”
    </div>
  </Shell>
);

/**
 * แบบที่ 2 (Cover B): สไตล์ปกกลางล่าง ("เที่ยวสุดท้าย หนึ่งล้านบาท") — ผู้ใหญ่บ้านยิ้มหลอนใต้แสงไฟศาลา + เงิน 3,000 + สมุดคาร์บอน
 */
export const GhostMoneyCoverB: React.FC = () => (
  <Shell>
    <div style={{position: 'absolute', inset: 0, transform: 'scale(1.12)', transformOrigin: '1350px 580px', filter: 'brightness(.48) saturate(.82)'}}>
      <SalaFuneralSet tone="night" showDesk showChairs={false} coffinX={1120} photo="covered" frame={20} />
    </div>
    {/* Warm spotlight cone from ceiling lamp onto the headman */}
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <polygon points="1420,70 1040,1080 1860,1080" fill="rgba(255,195,110,0.16)" />
    </svg>
    <Glow x={1490} y={620} r={700} color="255,165,75" a={0.48} />

    <Actor s="headmanCreepy@1500,1310 smug" ppc={8.0} floor={1310} glow="rgba(255,160,70,.55)" />
    <BlueLedgerProp x={1690} y={840} scale={0.95} />
    <BanknotesFan x={1230} y={895} scale={1.15} />

    <LeftShade to={58} />
    <div style={{position: 'absolute', left: 84, top: 92}}>
      <Label text="ห้ามรับเงินก้อนนี้" bg="#d6261f" color="#fff" tilt={-3} />
    </div>
    <div style={{position: 'absolute', left: 80, top: 245, ...T}}>
      <div style={{fontSize: 196, color: '#fff', ...stroke('#000', 16), textShadow: '0 12px 40px rgba(0,0,0,.85)'}}>จ้างนั่งงานศพ</div>
      <div style={{fontSize: 205, color: GOLD, marginTop: 16, ...stroke('#000', 16), textShadow: '0 10px 36px rgba(0,0,0,.8)'}}>
        สามพันบาท
      </div>
    </div>
    <div style={{position: 'absolute', left: 86, bottom: 72, ...T, fontWeight: 700, fontSize: 64, color: '#ffffff', ...stroke('#000', 10)}}>
      “สามพันพอดี… นับดูสิพ่อหนุ่ม”
    </div>
  </Shell>
);

/**
 * แบบที่ 3 (Cover C): สไตล์ปกขวาบน ("เขาจะตาย บ่ายสองวันนี้" + ป้ายเวลา 03:52) — เมฆหน้าซีดตกใจ + ข้าวต้มด้ายแดง
 */
export const GhostMoneyCoverC: React.FC = () => (
  <Shell>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: 'scale(1.1)',
        transformOrigin: '1300px 540px',
        filter: 'brightness(.45) saturate(.9) hue-rotate(-12deg)',
      }}
    >
      <SalaFuneralSet tone="night" clockTime="03:52" showDesk={false} showChairs={false} coffinX={1140} photo="glow" frame={20} />
    </div>
    {/* Crimson ominous radial glow */}
    <Glow x={1480} y={560} r={780} color="255,45,35" a={0.5} />
    {/* Large prominent WallClock at 03:52 in the background */}
    <WallClock x={1120} y={240} t="03:52" r={115} tick={1.8} />

    <Actor s="mek@1535,1310 shock" ppc={8.0} floor={1310} glow="rgba(255,70,55,.6)" />
    {/* Cursed Red-Thread Porridge Bowl in foreground */}
    <RedThreadBowl x={1150} y={890} scale={1.08} />
    <div
      style={{
        position: 'absolute',
        left: 1005,
        top: 735,
        width: 290,
        height: 245,
        border: `7px dashed ${RED}`,
        borderRadius: 18,
        boxShadow: '0 0 30px rgba(255,59,48,.4)',
      }}
    />

    <LeftShade to={56} />
    <div style={{position: 'absolute', left: 84, top: 96, ...T, fontWeight: 600, fontSize: 64, color: '#f2c6c2', ...stroke('#000', 10)}}>
      กฎเหล็กศาลาวัดสั่งไว้ว่า…
    </div>
    <div style={{position: 'absolute', left: 80, top: 205, ...T}}>
      <div style={{fontSize: 210, color: '#fff', ...stroke('#000', 16), textShadow: '0 12px 40px rgba(0,0,0,.85)'}}>คนรับจ้าง</div>
      <div
        style={{
          fontSize: 186,
          color: RED,
          marginTop: 14,
          ...stroke('#2a0000', 16),
          textShadow: '0 0 50px rgba(255,40,30,.55)',
        }}
      >
        หายไปตอนตีสี่
      </div>
    </div>

    {/* Red Time Pill Badge with Clock Icon (matching the "14:00" badge in top-right reference cover) */}
    <div
      style={{
        position: 'absolute',
        left: 84,
        bottom: 175,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        background: '#d6261f',
        padding: '10px 32px 14px 24px',
        borderRadius: 16,
        boxShadow: '0 10px 28px rgba(0,0,0,.6)',
      }}
    >
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r="23" fill="#fff" />
        <path d="M27 12 V27 L37 33" fill="none" stroke="#d6261f" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{...T, fontSize: 72, color: '#fff', letterSpacing: 2}}>03:52</span>
    </div>

    <div style={{position: 'absolute', left: 86, bottom: 68, ...T, fontWeight: 600, fontSize: 54, color: '#e9edf2', ...stroke('#000', 9)}}>
      ข้าวต้มด้ายแดงถ้วยสุดท้ายก่อนเทียนดับ
    </div>
  </Shell>
);
