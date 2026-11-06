import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CastSprite} from '../../cast/CastSprite';
import {ChildRoom} from '../../kit/childroom';
import {Grain} from '../../kit/horror';
import {ActorView, parseActor} from '../../kit/stage';
import {HouseFront} from '../../kit/village';
import {Glow} from '../../kit/world';
import {C, ROSTER} from './cast';

// Three YouTube covers (1920×1080 → export 1280×720) for "หมู่บ้านที่ทุกบ้านมีห้องของเด็กคนเดียวกัน" (same-child).
// Layers in every cover: Background (set) → Scrim (left shade behind the words) → Characters / props → Text / badges.
// Story facts kept: Ton's chipped front tooth and the duck plaster round his FINGER (story.json shot "นิ้วพันด้วยพลาสเตอร์ลายเป็ด"),
// the rocket blanket, Prae's light-blue jacket with the crooked elbow patch, Rumpai's lantern, the back door of the child's room.

const FONT = 'Kanit, sans-serif';
const T: React.CSSProperties = {fontFamily: FONT, fontWeight: 700, lineHeight: 1.08};
const stroke = (c: string, w: number) => ({WebkitTextStroke: `${w}px ${c}`, paintOrder: 'stroke fill'} as React.CSSProperties);
const RED = '#ff3b30', GOLD = '#ffd24a';
const F = 20; // frame used for blinks / flicker

// ------------------------------------------------------------------ shared pieces
const Shell: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = '#05070a'}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
    <CastSprite />
    {children}
  </AbsoluteFill>
);

const Actor: React.FC<{s: string; ppc: number; floor: number; style?: React.CSSProperties}> = ({s, ppc, floor, style}) => (
  <ActorView a={{...parseActor(s), talk: false}} roster={ROSTER} floor={floor} pxPerCm={ppc} f={F} style={style} />
);

/** scrim: the dark shade on the left that carries the words */
const Scrim: React.FC<{to?: number; c?: string}> = ({to = 58, c = '3,4,7'}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(${c},.95) 0%, rgba(${c},.78) ${to - 22}%, rgba(${c},0) ${to}%)`}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, transparent 40%, rgba(0,0,0,.65) 100%)'}} />
  </>
);

const Badge: React.FC<{text: string; bg?: string; color?: string; tilt?: number}> = ({text, bg = '#d6261f', color = '#fff', tilt = -2}) => (
  <div style={{display: 'inline-block', ...T, fontSize: 54, color, background: bg, padding: '8px 28px 16px', borderRadius: 14,
    transform: `rotate(${tilt}deg)`, boxShadow: '0 8px 24px rgba(0,0,0,.6)'}}>{text}</div>
);

/** big two-line headline + small line under it, all on the left */
const Words: React.FC<{badge: React.ReactNode; l1: string; l2: string; c2: string; sub: string; size?: number}> = ({badge, l1, l2, c2, sub, size = 168}) => (
  <>
    <div style={{position: 'absolute', left: 84, top: 84}}>{badge}</div>
    <div style={{position: 'absolute', left: 78, top: 236, ...T}}>
      <div style={{fontSize: size, color: '#fff', ...stroke('#000', 16), textShadow: '0 12px 40px rgba(0,0,0,.9)'}}>{l1}</div>
      <div style={{fontSize: size, color: c2, marginTop: 8, ...stroke(c2 === RED ? '#2a0000' : '#000', 16), textShadow: c2 === RED ? '0 0 50px rgba(255,40,30,.55)' : '0 10px 36px rgba(0,0,0,.85)'}}>{l2}</div>
    </div>
    <div style={{position: 'absolute', left: 86, bottom: 72, ...T, fontWeight: 600, fontSize: 60, color: '#eef1f4', ...stroke('#000', 10)}}>{sub}</div>
  </>
);

/** rocket-print pillow hugged in front of the chest, with Ton's two hands — one finger wrapped in the duck plaster */
const RocketPillow: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <svg width="300" height="220" viewBox="-150 -110 300 220" style={{position: 'absolute', left: x - 150, top: y - 110, transform: `rotate(${rot}deg) scale(${s})`, overflow: 'visible'}}>
    <path d="M-128 -70 Q-140 0 -126 72 Q0 92 126 72 Q140 0 128 -70 Q0 -92 -128 -70Z" fill="#2f5b8f" stroke="#172c47" strokeWidth="6" strokeLinejoin="round" />
    {[[-70, -30, -20], [10, 20, 25], [80, -35, 10], [-40, 45, -30], [70, 45, 40]].map(([rx, ry, rr], i) => (
      <g key={i} transform={`translate(${rx} ${ry}) rotate(${rr}) scale(1.15)`}>
        <path d="M0 -26 Q10 -14 10 6 L-10 6 Q-10 -14 0 -26Z" fill="#f2efe6" />
        <path d="M-10 0 L-17 12 L-10 9Z M10 0 L17 12 L10 9Z" fill="#e5383b" />
        <circle cx="0" cy="-8" r="4" fill="#5aa0d8" />
        <path d="M-5 8 L0 18 L5 8Z" fill="#f6c445" />
      </g>
    ))}
    {/* hands over the pillow (object first, hands on top) */}
    {[-62, 62].map(hx => (
      <g key={hx} transform={`translate(${hx} -6)`}>
        <rect x="-26" y="-18" width="52" height="40" rx="18" fill="#dca27a" stroke="#8a5a3c" strokeWidth="3.5" />
        <path d="M-12 -16 V6 M0 -18 V8 M12 -16 V6" stroke="#b47e58" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ))}
    {/* duck plaster round the left hand's finger */}
    <g transform="translate(-74 -14)">
      <rect x="-9" y="-10" width="18" height="22" rx="4" fill="#f3d35a" stroke="#9a7a1c" strokeWidth="2" />
      <ellipse cx="0" cy="3" rx="4.5" ry="3.2" fill="#fff6d0" />
      <circle cx="3" cy="-2" r="2.4" fill="#fff6d0" />
      <path d="M5 -2 L8 -1.4 L5 -0.6Z" fill="#e88a2a" />
    </g>
  </svg>
);

/** Prae's sleeve and hand: light-blue jacket cuff with the crooked elbow patch */
const PraeSleeve: React.FC<{x: number; y: number; s?: number; rot?: number; patch?: boolean; light?: number}> = ({x, y, s = 1, rot = 0, patch = true, light = 1}) => (
  <svg width="420" height="200" viewBox="-60 -100 420 200" style={{position: 'absolute', left: x - 60, top: y - 100, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: '60px 100px', overflow: 'visible',
    filter: `brightness(${light})`}}>
    <path d="M-60 -46 Q120 -60 250 -28 L262 30 Q120 52 -60 46Z" fill={C.prae} stroke="#2a4466" strokeWidth="6" strokeLinejoin="round" />
    <path d="M20 -40 Q30 0 20 42" fill="none" stroke="#4e7aa8" strokeWidth="5" />
    {patch && (
      <g transform="translate(110 -4) rotate(-22)">
        <rect x="-30" y="-22" width="60" height="44" rx="6" fill={C.praePatch} stroke="#6b5a3a" strokeWidth="4" />
        <path d="M-20 -12 H20 M-20 0 H20 M-20 12 H20" stroke="#8f7c56" strokeWidth="3" strokeDasharray="5 5" />
      </g>
    )}
    <rect x="236" y="-34" width="34" height="70" rx="8" fill="#4e7aa8" stroke="#2a4466" strokeWidth="5" />
    {/* hand, fingers spread on the floor / door edge */}
    <path d="M268 -24 Q300 -34 322 -26 L352 -30 Q362 -24 352 -16 L330 -12 L358 -4 Q366 4 356 10 L330 8 L350 20 Q356 28 346 32 L320 24 Q296 34 270 26Z"
      fill="#e9bd98" stroke="#8a5a3c" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

// ------------------------------------------------------------------ 1. CCTV / found footage
/** night-vision CCTV: high angle on the canal walk, Ton walking into house no. 2 with his pillow at 03:14 */
export const SameChildCoverA: React.FC = () => (
  <Shell bg="#020806">
    {/* Background: the house front + canal, seen from a camera on a post (high angle) */}
    <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) sepia(1) hue-rotate(110deg) saturate(2.4) brightness(.95) contrast(1.25)'}}>
      <div style={{position: 'absolute', inset: 0, transform: 'perspective(1500px) rotateX(-16deg) scale(.86) translate(360px, -20px)', transformOrigin: '50% 0%'}}>
        <HouseFront night open={0.55} c="#7a5a3e" />
        <Actor s="ton@1010 walk happy" ppc={4.6} floor={930} />
        <RocketPillow x={1030} y={735} s={0.6} rot={-6} />
        {/* the walkway and the canal in front */}
        <div style={{position: 'absolute', left: -700, top: 1010, width: 3320, height: 60, background: '#5e4a36'}} />
        <div style={{position: 'absolute', left: -700, top: 1070, width: 3320, height: 500, background: 'linear-gradient(#1c2a2a, #070c0c)'}} />
        {Array.from({length: 22}, (_, i) => <div key={i} style={{position: 'absolute', left: -660 + i * 160, top: 1000, width: 22, height: 120, background: '#3d2e22'}} />)}
        {/* house number plate */}
        <div style={{position: 'absolute', left: 960, top: 300, transform: 'translateX(-50%)', ...T, fontSize: 46, color: '#1c140c', background: '#e8dcc0', padding: '0 18px 6px', borderRadius: 8}}>บ้านหลังที่ 2</div>
      </div>
      <Glow x={1360} y={520} r={420} color="255,230,170" a={0.35} />
    </div>
    {/* night-vision vignette, scanlines, grain */}
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 62% 50%, rgba(0,0,0,0) 35%, rgba(0,12,8,.85) 100%)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.34) 0 2px, transparent 2px 5px)'}} />
    <div style={{position: 'absolute', left: 0, top: 612, width: 1920, height: 18, background: 'rgba(170,255,210,.10)'}} />
    <Grain f={F} opacity={0.22} />

    {/* CCTV HUD (right side) */}
    <div style={{position: 'absolute', right: 70, top: 66, display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'monospace', fontWeight: 700, fontSize: 52, color: '#eafff2', textShadow: '0 0 10px rgba(120,255,180,.7), 0 2px 0 #000'}}>
      <div style={{width: 34, height: 34, borderRadius: '50%', background: RED, boxShadow: '0 0 22px rgba(255,40,30,.9)'}} />REC
    </div>
    <div style={{position: 'absolute', right: 70, bottom: 64, fontFamily: 'monospace', fontWeight: 700, fontSize: 46, color: '#eafff2', textShadow: '0 0 10px rgba(120,255,180,.7), 0 2px 0 #000'}}>
      03:14:22 AM [CAM-02]
    </div>
    {[[1010, 40, 'lt'], [1860, 40, 'rt'], [1010, 1040, 'lb'], [1860, 1040, 'rb']].map(([x, y, k]) => (
      <div key={k as string} style={{position: 'absolute', left: (x as number) - 30, top: (y as number) - 30, width: 60, height: 60,
        borderLeft: (k as string)[0] === 'l' ? '5px solid #cfffe0' : undefined, borderRight: (k as string)[0] === 'r' ? '5px solid #cfffe0' : undefined,
        borderTop: (k as string)[1] === 't' ? '5px solid #cfffe0' : undefined, borderBottom: (k as string)[1] === 'b' ? '5px solid #cfffe0' : undefined, opacity: 0.8}} />
    ))}
    {/* red box round the boy */}
    <div style={{position: 'absolute', left: 1130, top: 330, width: 300, height: 400, border: `7px dashed ${RED}`, borderRadius: 14, boxShadow: '0 0 28px rgba(255,59,48,.5)'}} />

    <Scrim to={54} c="2,8,6" />
    <Words badge={<Badge text="คดีคนหายริมคลอง" />} l1="เด็กคนเดียวกัน" l2="นอนทุกบ้าน" c2={GOLD} sub="ทั้งหมู่บ้าน... เรียกเขาว่าลูก" size={150} />
  </Shell>
);

// ------------------------------------------------------------------ 2. Flashlight POV into the identical room
export const SameChildCoverB: React.FC = () => (
  <Shell>
    {/* Background: the same child's room, framed on the bed */}
    <div style={{position: 'absolute', inset: 0, transform: 'scale(1.3)', transformOrigin: '1300px 640px', filter: 'brightness(.9) saturate(.9)'}}>
      <ChildRoom f={F} wall="#7f9690" blanket="rocket" photo="boy" mirror={false} door="closed" toyCar={false} />
      {/* Ton's long bent shadow on the wall behind him */}
      <div style={{position: 'absolute', inset: 0, transform: 'translate(170px, -40px) skewX(-18deg) scale(1.25)', transformOrigin: '1180px 930px', filter: 'blur(6px)', opacity: 0.55}}>
        <Actor s="ton-sil@1180 sit" ppc={3.9} floor={930} />
      </div>
      <Actor s="ton@1120 sit grin" ppc={3.9} floor={930} />
      <RocketPillow x={1120} y={720} s={0.62} />
      {/* Prae's sleeve sliding out from under the bed */}
      <PraeSleeve x={1300} y={905} s={0.55} rot={170} light={0.7} />
    </div>
    {/* flashlight: a cone from the bottom-left (the viewer's hand) and darkness everywhere else */}
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="torch" cx="1360" cy="560" r="560" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0.15" />
          <stop offset="1" stopColor="#000" stopOpacity="0.96" />
        </radialGradient>
        <linearGradient id="cone" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#torch)" />
      <polygon points="760,1080 980,1080 1820,220 1000,140" fill="url(#cone)" />
    </svg>
    <Glow x={1360} y={560} r={360} color="255,244,214" a={0.28} />
    {/* the torch in the viewer's hand, bottom edge */}
    <svg width="400" height="300" viewBox="0 0 400 300" style={{position: 'absolute', left: 520, top: 880}}>
      <g transform="rotate(-42 200 150)">
        <rect x="120" y="120" width="210" height="64" rx="16" fill="#1d1f24" stroke="#000" strokeWidth="5" />
        <rect x="300" y="108" width="54" height="88" rx="12" fill="#3a3d44" stroke="#000" strokeWidth="5" />
        <ellipse cx="354" cy="152" rx="10" ry="40" fill="#fffbe8" />
      </g>
    </svg>
    <Grain f={F} opacity={0.12} />

    <Scrim to={52} />
    <Words badge={<Badge text="ห้องนอนลับ 7 หลังคาเรือน" bg={GOLD} color="#141414" />} l1="เปิดเข้าไป..." l2="เจอเด็กคนเดิม" c2={RED}
      sub={'“น้ามาหาหนูอีกแล้วเหรอ?”'} size={156} />
  </Shell>
);

// ------------------------------------------------------------------ 3. The back door and two lights
export const SameChildCoverC: React.FC = () => (
  <Shell bg="#030303">
    {/* Background: the back wall of the child's room with the door, almost black */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #0a0806, #1a130d 60%, #0b0806)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.25) 0 4px, transparent 4px 120px)'}} />
    <div style={{position: 'absolute', left: 0, top: 960, width: 1920, height: 120, background: 'linear-gradient(#2a1d13, #0c0805)'}} />
    {/* the door: frame, the black crack, the leaf swung a little */}
    <div style={{position: 'absolute', left: 1180, top: 140, width: 400, height: 840, background: '#3a2818', boxShadow: 'inset 0 0 0 18px #5a3f2a'}} />
    <div style={{position: 'absolute', left: 1198, top: 158, width: 364, height: 804, background: '#000'}} />
    <div style={{position: 'absolute', left: 1198, top: 158, width: 364, height: 804, background: 'linear-gradient(90deg, #7a5638, #5a3e28)', transformOrigin: '0% 50%',
      transform: 'perspective(1100px) rotateY(38deg)', boxShadow: 'inset 0 0 0 10px rgba(0,0,0,.25)'}}>
      <div style={{position: 'absolute', left: 30, top: 40, width: 300, height: 320, border: '8px solid rgba(0,0,0,.25)'}} />
      <div style={{position: 'absolute', left: 30, top: 420, width: 300, height: 330, border: '8px solid rgba(0,0,0,.25)'}} />
      <div style={{position: 'absolute', left: 26, top: 400, width: 22, height: 22, borderRadius: '50%', background: '#c9a24a'}} />
    </div>
    {/* Prae's hand and blue sleeve in the crack, gripping the door edge */}
    <PraeSleeve x={1548} y={560} s={0.36} rot={184} light={0.9} />

    {/* flashlight beam from Phak to the crack */}
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="beamC" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points="1150,650 1180,690 1560,900 1560,360" fill="url(#beamC)" />
    </svg>
    <Glow x={1300} y={540} r={330} color="255,255,255" a={0.3} />

    {/* Rumpai in the dark corner with her lantern */}
    <Glow x={1770} y={600} r={380} color="255,140,40" a={0.55} />
    <Actor s="rampai-sil@1790" ppc={4.6} floor={1010} style={{filter: 'drop-shadow(0 0 14px rgba(255,140,40,.8))'}} />
    <svg width="120" height="180" viewBox="-60 -90 120 180" style={{position: 'absolute', left: 1650, top: 610}}>
      <path d="M0 -84 Q-26 -84 -26 -60" fill="none" stroke="#2a1c10" strokeWidth="5" />
      <rect x="-30" y="-58" width="60" height="12" rx="4" fill="#3a2a18" />
      <path d="M-26 -46 Q-38 0 -26 46 H26 Q38 0 26 -46Z" fill="rgba(255,190,90,.85)" stroke="#3a2a18" strokeWidth="5" />
      <ellipse cx="0" cy="8" rx="9" ry="18" fill="#fff2c4" />
      <rect x="-32" y="44" width="64" height="16" rx="4" fill="#3a2a18" />
    </svg>

    {/* Phak from behind, big in the foreground, torch in his raised hand */}
    <Actor s="phak@1010 back" ppc={5.0} floor={1330} style={{filter: 'brightness(.55) drop-shadow(0 0 20px rgba(255,255,255,.25))'}} />
    <svg width="160" height="100" viewBox="0 0 160 100" style={{position: 'absolute', left: 1080, top: 640}}>
      <g transform="rotate(32 80 50)">
        <rect x="10" y="34" width="110" height="34" rx="9" fill="#1d1f24" stroke="#000" strokeWidth="4" />
        <rect x="112" y="28" width="30" height="46" rx="7" fill="#3a3d44" stroke="#000" strokeWidth="4" />
        <ellipse cx="142" cy="51" rx="6" ry="20" fill="#fffbe8" />
      </g>
    </svg>
    <Grain f={F} opacity={0.12} />

    <Scrim to={44} />
    <Words badge={<Badge text="คดีคนหายริมคลอง" />} l1="หลังประตูนี้" l2="ขังใครไว้?" c2={RED} sub="อย่าตอบรับเสียงเคาะ 3 ครั้ง" size={176} />
  </Shell>
);
