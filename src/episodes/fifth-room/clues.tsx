import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {FONT, K, Macro, Pen, Pool, Sheet, Svg, Typed} from '../../kit/frame';
import {Hand} from '../../kit/inserts';
import {C} from './cast';
import {WardrobeInside} from './rooms';


// The clue inserts. Rule from brief.md → Clues: same frame, same side, same hand every time, so the pay-off is recognised.
//   the key hand (key-ots) comes in from the right at (1120, 560); the hatch camera in past.tsx repeats it exactly.

type P = {p: ShotProps};
const hand = {skin: C.skinC, sleeve: C.shirtC};
const rinHand = {skin: C.skinR, sleeve: C.sleeveR};

/** a torch or lamp pool with black around it */
const Dark: React.FC<{x: number; y: number; r: number; o?: number; color?: string}> = ({x, y, r, o = 0.92, color = '255,236,190'}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(0,0,0,0) 34%, rgba(0,0,0,${o}) 100%)`}} />
    <Pool x={x} y={y} rx={r * 0.7} color={color} a={0.3} />
  </>
);

// ---------------------------------------------------------------- the notebook

const Book: React.FC<{p: ShotProps; light?: string; dark?: {x: number; y: number; r: number}; children: React.ReactNode; hand?: [number, number]}> = ({p, light = '#c9a678', dark, children, hand: h}) => (
  <Macro p={p} bg="#0c0a08" at={[50, 44]} vig={0.6} inner={34} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: light}} />
    <Sheet x={320} y={60} w={1280} h={780} color="#eee9d8" lines rot={-1.5}>{children}</Sheet>
    <Svg>{Array.from({length: 14}, (_, i) => <circle key={i} cx={366 + i * 88} cy={50 - i * 2} r={14} fill="none" stroke="#55534a" strokeWidth={6} />)}</Svg>
    {h && <Hand x={h[0]} y={h[1]} s={1.7} rot={200} {...rinHand} />}
    {dark && <Dark {...dark} />}
  </Macro>
);

const Note5: React.FC<P> = ({p}) => (
  <Book p={p} light="#8d8676" hand={[1440, 700]}>
    <Pen x={80} y={70} size={70}>บ้านเลขที่ 5</Pen>
    <Pen x={80} y={230} size={70}>หน้าต่างจากถนน</Pen>
    <Pen x={760} y={210} size={120} color="#a11818">5</Pen>
    <Svg><ellipse cx={790} cy={270} rx={84} ry={82} fill="none" stroke="#a11818" strokeWidth={8} transform="translate(0 0)" /></Svg>
  </Book>
);

const Note22: React.FC<{p: ShotProps; lamp?: boolean}> = ({p, lamp}) => (
  <Book p={p} light="#17140f" dark={lamp ? {x: 880, y: 360, r: 760} : {x: 760, y: 380, r: 720}}>
    <Pen x={80} y={120} size={110}>22:00</Pen>
    <Pen x={80} y={300} size={110} shake={0.5}>เคาะ 2 + 2</Pen>
    <Svg><path d="M90 450 Q400 470 720 442 M100 472 Q420 490 700 464" stroke="#23305a" strokeWidth={8} fill="none" /></Svg>
  </Book>
);

const NoteMonth: React.FC<P> = ({p}) => (
  <Book p={p} light="#6e3a22" dark={{x: 800, y: 340, r: 880}}>
    <Pen x={80} y={120} size={78}>เฉลิม : "เพิ่งรับงานเดือนนี้"</Pen>
    <Pen x={80} y={300} size={78} color="#a11818">ป้านิ่ม : "ตั้งแต่ปลายฝน" ?</Pen>
  </Book>
);

// ---------------------------------------------------------------- key and hand

const KeyOts: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#34332c" at={[52, 46]} vig={0.34} inner={44} z={1.03}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#9a9077 0, #8a826e 60%, #64625a)'}} />
    <div style={{position: 'absolute', inset: 0, filter: 'blur(14px)'}}>
      <Svg>
        <rect x={980} y={-20} width={960} height={1120} fill={C.shirtC} />
        <rect x={140} y={-20} width={40} height={900} fill="#2c2e30" /><rect x={320} y={-20} width={40} height={900} fill="#2c2e30" /><rect x={500} y={-20} width={40} height={900} fill="#2c2e30" />
        <rect x={1330} y={930} width={260} height={180} fill={C.boot} />
      </Svg>
    </div>
    <Svg>
      {/* her shoulder, big and soft at the left edge */}
      <g style={{filter: 'blur(9px)'}}><ellipse cx={120} cy={1000} rx={520} ry={500} fill={C.sleeveR} /><ellipse cx={210} cy={380} rx={260} ry={310} fill="#20191a" /></g>
      {/* the key ring, hanging from the fingers */}
      <circle cx={590} cy={610} r={54} fill="none" stroke="#b8b6a6" strokeWidth={9} />
      {[[-12, 110], [30, 120], [-44, 100]].map(([rot, l], i) => <g key={i} transform={`translate(590 660) rotate(${rot})`}><rect x={-10} y={0} width={20} height={l} rx={5} fill={['#c9b98c', '#a6a79f', '#b89f6a'][i]} /><circle cx={0} cy={0} r={18} fill={['#c9b98c', '#a6a79f', '#b89f6a'][i]} /></g>)}
    </Svg>
    <Hand x={1120} y={560} s={2.4} rot={-6} {...hand} pinkyCut flip />
    <Pool x={400} y={120} rx={900} color="255,246,214" a={0.26} />
  </Macro>
);

const TellKeys: React.FC<P> = ({p}) => {
  const rub = Math.sin(p.f / 5) * 14;
  return (
    <Macro p={p} bg="#050404" at={[50, 46]} vig={0.82} inner={30} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: '#1d1a15'}} />
      <Svg>
        <circle cx={760} cy={600} r={120} fill="none" stroke="#b8b6a6" strokeWidth={16} />
        <g transform="translate(760 700) rotate(14)"><rect x={-20} y={0} width={40} height={220} rx={10} fill="#c9b98c" /><circle r={40} fill="#c9b98c" /></g>
        <g transform="translate(700 690) rotate(-22)"><rect x={-20} y={0} width={40} height={190} rx={10} fill="#a6a79f" /><circle r={36} fill="#a6a79f" /></g>
      </Svg>
      <Hand x={1240} y={520 + rub * 0.2} s={3} rot={-8} {...hand} pinkyCut flip />
      <Svg><path d={`M${920 + rub} 340 q-60 40 -120 110`} stroke={C.skinC} strokeWidth={64} strokeLinecap="round" fill="none" /></Svg>
      <Pool x={500} y={300} rx={680} color="255,246,214" a={0.2} />
    </Macro>
  );
};

/** the short finger on the green-lit hatch, blown up from the camera */
const TwistCard: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#020302" at={[50, 46]} vig={0.86} inner={26} z={1.07} grain={0.34}>
    <div style={{position: 'absolute', inset: 0, background: '#061007'}} />
    <div style={{position: 'absolute', inset: 0, filter: 'grayscale(1) sepia(.4) hue-rotate(60deg) saturate(1.6) contrast(1.3) brightness(.42)'}}>
      <Svg><rect x={-20} y={560} width={1960} height={560} fill="#3a2a1c" /><rect x={500} y={600} width={760} height={40} rx={10} fill="#8c8f8c" /></Svg>
      <Hand x={1500} y={470} s={5} rot={-6} {...hand} pinkyCut flip />
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 3px, rgba(0,0,0,0) 3px 8px)'}} />
    <Svg><circle cx={870} cy={640} r={130} fill="none" stroke="#c9201f" strokeWidth={8} strokeDasharray="22 14" /></Svg>
  </Macro>
);

const HandEye: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#141010" at={[50, 42]} vig={0.6} inner={30} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#a8735a, #4f4436)'}} />
    <Svg style={{filter: 'blur(16px)'}}>
      <rect x={-20} y={520} width={1960} height={600} fill="#55604a" />
      <circle cx={560} cy={380} r={270} fill={C.skinC} />
      <path d="M300 340 Q330 90 570 90 Q800 100 830 340 Q570 240 300 340 Z" fill="#25212b" />
      <rect x={380} y={330} width={160} height={90} rx={10} fill="none" stroke="#111" strokeWidth={14} />
      <rect x={590} y={330} width={160} height={90} rx={10} fill="none" stroke="#111" strokeWidth={14} />
    </Svg>
    <Hand x={1320} y={470} s={3} rot={-6} {...hand} pinkyCut flip mode="open" />
    <Svg>{[0, 1, 2].map(i => <circle key={i} cx={780 + i * 22} cy={380 + i * 30} r={10 - i * 2} fill="#dfeaf0" opacity={0.85} />)}</Svg>
    <Pool x={1500} y={160} rx={800} color="255,180,130" a={0.26} />
  </Macro>
);

const HandBolt: React.FC<P> = ({p}) => {
  const k = K(p), off = Math.max(0, k - 0.45) * 2 * 130;
  return (
    <Macro p={p} bg="#030302" at={[50, 50]} vig={0.86} inner={26} z={1.04}>
      <div style={{position: 'absolute', inset: 0, background: '#23180f'}} />
      <Svg>
        {[0, 1, 2, 3, 4, 5, 6].map(i => <line key={i} x1={i * 330} y1={-20} x2={i * 330} y2={1100} stroke="#150e08" strokeWidth={8} />)}
        <rect x={220} y={430} width={210} height={240} fill="#55585a" stroke="#111" strokeWidth={6} />
        <rect x={430} y={480} width={620} height={140} rx={24} fill="#8c8f8c" stroke="#111" strokeWidth={6} />
        <rect x={700} y={410} width={70} height={100} rx={12} fill="#6c6f6c" stroke="#111" strokeWidth={5} />
      </Svg>
      <Hand x={1270 + off} y={560} s={3} rot={-6} {...hand} pinkyCut flip mode="open" />
      <Pool x={1300} y={1040} rx={700} ry={300} color="255,226,170" a={0.2} />
    </Macro>
  );
};

const Receipt: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#040403" at={[50, 42]} vig={0.76} inner={28} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: C.shirtC}} />
    <Svg>
      <path d="M300 500 H1620 V1100 H300 Z" fill="#2c3b3f" stroke="#1c262a" strokeWidth={10} />
      <path d="M300 500 Q960 560 1620 500" stroke="#1c262a" strokeWidth={8} fill="none" />
      {[420, 1500].map(x => <circle key={x} cx={x} cy={560} r={14} fill="#111" />)}
    </Svg>
    <Sheet x={540} y={70} w={840} h={640} color="#e9e2cb" rot={-4}>
      <Typed x={50} y={40} size={44} weight={700}>ใบเสร็จรับเงินค่าไฟฟ้า</Typed>
      <Typed x={50} y={130} size={40}>บ้านเลขที่ 5 ซอยตันหลังตลาด</Typed>
      <Typed x={50} y={200} size={40}>ชำระแล้ว อาทิตย์ก่อน</Typed>
      <Typed x={50} y={290} size={68} weight={700} color="#a11818">60 หน่วย</Typed>
      <div style={{position: 'absolute', left: 50, top: 400, width: 740, height: 4, background: '#8d8675'}} />
    </Sheet>
    <Svg><path d="M300 500 Q960 560 1620 500 V1100 H300 Z" fill="#2c3b3f" /><path d="M300 500 Q960 560 1620 500" stroke="#1c262a" strokeWidth={8} fill="none" /></Svg>
    <Pool x={600} y={200} rx={700} color="255,226,170" a={0.34} />
  </Macro>
);

// ---------------------------------------------------------------- boots

const Boots: React.FC<{p: ShotProps; tone: 'sun' | 'dusk' | 'dark'; kick?: boolean}> = ({p, tone, kick}) => {
  const k = K(p);
  const x = kick ? 1540 - Math.min(1, k * 1.6) * 460 : 1520 - k * 720;
  const ground = tone === 'sun' ? '#8c8778' : tone === 'dusk' ? '#4e4840' : '#14100c';
  return (
    <Macro p={p} bg="#050403" at={[52, 58]} vig={tone === 'dark' ? 0.9 : 0.44} inner={tone === 'dark' ? 24 : 40} z={1.03}>
      <div style={{position: 'absolute', inset: 0, background: tone === 'sun' ? 'linear-gradient(#a5a08e, #8c8778 40%)' : tone === 'dusk' ? 'linear-gradient(#675a4c, #4e4840 40%)' : '#120d09'}} />
      <Svg>
        <rect x={-20} y={560} width={1960} height={560} fill={ground} />
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M${rnd(121, i) * 1800} ${620 + rnd(122, i) * 240} l${60 + rnd(123, i) * 120} ${-8 - rnd(124, i) * 24} l60 20`} stroke="#000" strokeOpacity={0.3} strokeWidth={5} fill="none" />)}
        {!kick && [260, 640].map((px, i) => <g key={i} opacity={px > x ? 0 : 0.85 - (x - px) / 3000}><ellipse cx={px} cy={760} rx={150} ry={38} fill={C.mud} /><path d={`M${px - 110} 760 h220`} stroke="#000" strokeOpacity={0.4} strokeWidth={6} strokeDasharray="20 16" /></g>)}
        {kick && <g transform={`translate(${900 - Math.min(1, k * 1.8) * 760} ${680 - Math.sin(Math.min(1, k * 1.8) * 3.14) * 140}) rotate(${-k * 500})`}><path d="M-110 40 L110 40 L110 -20 Z" fill="#a77a4c" stroke="#3d2a15" strokeWidth={5} /></g>}
        <g transform={`translate(${x} 760)`}>
          <path d="M-20 -520 H220 L240 -130 Q430 -100 450 0 H-20 Z" fill={C.boot} stroke={C.bootD} strokeWidth={8} />
          <path d="M-20 -510 H220" stroke={C.bootL} strokeWidth={14} />
          <path d="M-22 -20 H456" stroke={C.mud} strokeWidth={26} />
          <path d="M260 -60 q60 -6 130 20" stroke={C.mud} strokeWidth={14} fill="none" opacity={0.8} />
          <rect x={-10} y={-720} width={220} height={210} fill="#384f48" />
        </g>
      </Svg>
      {tone === 'sun' && <Pool x={600} y={120} rx={900} color="255,246,214" a={0.26} />}
      {tone === 'dark' && <div style={{position: 'absolute', left: 0, top: 660, width: 1920, height: 8, background: '#ffd27a', opacity: 0.7, boxShadow: '0 0 40px 10px rgba(255,200,110,.4)'}} />}
    </Macro>
  );
};

// ---------------------------------------------------------------- the family photo

const Person: React.FC<{x: number; y: number; h: number; hair: string; shirt: string; skin?: string; bob?: boolean; bun?: boolean; glasses?: boolean}> = ({x, y, h, hair, shirt, skin = '#c79a78', bob, bun, glasses}) => {
  const r = h * 0.17;
  return (
    <g>
      <path d={`M${x - h * 0.36} ${y + h} Q${x - h * 0.34} ${y + h * 0.36} ${x} ${y + h * 0.32} Q${x + h * 0.34} ${y + h * 0.36} ${x + h * 0.36} ${y + h} Z`} fill={shirt} />
      <rect x={x - r * 0.4} y={y + h * 0.24} width={r * 0.8} height={h * 0.14} fill={skin} />
      <circle cx={x} cy={y + h * 0.14} r={r} fill={skin} />
      <path d={`M${x - r * 1.04} ${y + h * 0.14} Q${x - r * 1.1} ${y - h * 0.06} ${x} ${y - h * 0.05} Q${x + r * 1.1} ${y - h * 0.06} ${x + r * 1.04} ${y + h * 0.14} Q${x} ${y + h * 0.02} ${x - r * 1.04} ${y + h * 0.14} Z`} fill={hair} />
      {bob && <path d={`M${x - r * 1.08} ${y + h * 0.1} q${-r * 0.3} ${r} 0 ${r * 1.4} M${x + r * 1.08} ${y + h * 0.1} q${r * 0.3} ${r} 0 ${r * 1.4}`} stroke={hair} strokeWidth={r * 0.5} fill="none" strokeLinecap="round" />}
      {bun && <circle cx={x} cy={y - h * 0.06} r={r * 0.34} fill={hair} />}
      <circle cx={x - r * 0.4} cy={y + h * 0.13} r={r * 0.08} fill="#1a1412" /><circle cx={x + r * 0.4} cy={y + h * 0.13} r={r * 0.08} fill="#1a1412" />
      <path d={`M${x - r * 0.4} ${y + h * 0.2} q${r * 0.4} ${r * 0.3} ${r * 0.8} 0`} stroke="#6a3b2a" strokeWidth={r * 0.09} fill="none" />
      {glasses && <g fill="none" stroke="#111" strokeWidth={r * 0.08}><rect x={x - r * 0.72} y={y + h * 0.1} width={r * 0.62} height={r * 0.42} rx={3} /><rect x={x + r * 0.1} y={y + h * 0.1} width={r * 0.62} height={r * 0.42} rx={3} /></g>}
    </g>
  );
};

/** whole = the uncut picture from the head of the mattress; cut = what is left on the wall */
const Family: React.FC<{whole?: boolean}> = ({whole}) => (
  <>
    <rect x={0} y={0} width={1500} height={900} fill="#a8a083" />
    <rect x={0} y={560} width={1500} height={340} fill="#7a7259" />
    <rect x={120} y={120} width={1240} height={520} fill="#938a6e" />
    <Person x={300} y={220} h={560} hair="#231c1a" shirt="#7b3b44" bob />
    <Person x={620} y={150} h={640} hair="#2e2622" shirt="#58523f" />
    <Person x={200} y={470} h={360} hair="#231c1a" shirt="#efe8d4" />
    <Person x={500} y={560} h={280} hair="#231c1a" shirt="#8c1c20" />
    {whole && <Person x={1000} y={170} h={620} hair="#25212b" shirt="#36494e" skin="#d6a57f" glasses />}
    {/* the arm across, ending on Manop's far shoulder */}
    <path d={whole ? 'M905 420 Q860 380 760 372' : 'M930 430 Q870 386 760 372'} stroke={whole ? '#36494e' : '#36494e'} strokeWidth={46} fill="none" strokeLinecap="round" />
    <g transform="translate(756 372)">
      <rect x={-52} y={-26} width={62} height={52} rx={18} fill="#d6a57f" />
      {[0, 1, 2].map(i => <rect key={i} x={-112} y={-26 + i * 16} width={64} height={15} rx={7} fill="#d6a57f" />)}
      {whole && <rect x={-76} y={22} width={30} height={15} rx={5} fill="#d6a57f" stroke="#8c5f45" strokeWidth={2} />}
    </g>
  </>
);

/** cropped photo on its wall. `torch` in the dark, `cut` shows the white fresh edge */
const Photo: React.FC<{p: ShotProps; ecu?: boolean; torch?: boolean; take?: boolean}> = ({p, ecu, torch}) => (
  <Macro p={p} bg="#0a0806" at={[46, 42]} vig={torch ? 0.9 : 0.5} inner={torch ? 22 : 34} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: torch ? '#26231c' : '#7c7562'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: ecu ? 'scale(2.2)' : torch ? 'scale(1.5)' : undefined, transformOrigin: ecu ? '1090px 380px' : torch ? '1340px 420px' : '960px 400px'}}>
      <div style={{position: 'absolute', left: 340, top: 40, width: 1200, height: 830, background: '#2b2118', boxShadow: '0 24px 60px rgba(0,0,0,.6)'}} />
      <div style={{position: 'absolute', left: 380, top: 80, width: 900, height: 750, background: '#a8a083', overflow: 'hidden', filter: 'sepia(.55) saturate(.8)'}}>
        <svg width={900} height={750} viewBox="0 0 900 750"><Family /></svg>
      </div>
      <div style={{position: 'absolute', left: 1280, top: 80, width: 220, height: 750, background: '#4a3d2c'}} />
      {/* the scissor edge, whiter than the rest of the paper */}
      <div style={{position: 'absolute', left: 1272, top: 80, width: 12, height: 750, background: '#efeadb'}} />
      <div style={{position: 'absolute', left: 340, top: 40, width: 1200, height: 830, background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.14) 40%, rgba(255,255,255,0) 50%)'}} />
    </div>
    {torch && <Dark x={1240} y={420} r={760} />}
    {!torch && <Pool x={500} y={200} rx={800} color="255,246,214" a={0.2} />}
    {ecu && <Pool x={1020} y={480} rx={380} color="255,240,200" a={0.2} />}
  </Macro>
);

const FullPhoto: React.FC<P> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#030202" at={[50, 42]} vig={0.86} inner={24} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: '#14110c'}} />
      <div style={{position: 'absolute', left: 300, top: 40, width: 1320, height: 790, background: '#e9e2cb', padding: 22, boxSizing: 'border-box', transform: `rotate(${-2 + k}deg)`}}>
        <div style={{width: '100%', height: '100%', overflow: 'hidden', filter: 'sepia(.5) saturate(.8)'}}>
          <svg width={1276} height={746} viewBox="0 0 1500 876"><Family whole /></svg>
        </div>
      </div>
      <Pool x={960} y={1000} rx={760} ry={520} color="255,226,170" a={0.42} />
      <Svg><circle cx={940} cy={360} r={120} fill="none" stroke="#ffd27a" strokeWidth={5} strokeDasharray="18 14" /></Svg>
      <Hand x={150} y={760} s={1.7} rot={-16} skin={C.skinN} sleeve={C.fadedP} />
    </Macro>
  );
};

// ---------------------------------------------------------------- tea, rice

const Tea: React.FC<{p: ShotProps; lamp?: boolean}> = ({p, lamp}) => {
  const a = lamp ? 0.36 : 0.5;
  return (
    <Macro p={p} bg="#060403" at={[46, 50]} vig={lamp ? 0.84 : 0.58} inner={28} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: lamp ? '#14100c' : '#3c281a'}} />
      <Svg>
        <path d="M-20 600 H1940 V1100 H-20 Z" fill={lamp ? '#2a1e14' : '#6e533b'} />
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${-40 + i * 460} 600 L${-260 + i * 560} 1100`} stroke="#000" strokeOpacity={0.3} strokeWidth={5} />)}
        {/* flask behind */}
        <g style={{filter: 'blur(7px)'}}><rect x={1320} y={120} width={200} height={500} rx={36} fill="#7c8a84" /><rect x={1360} y={60} width={120} height={80} rx={14} fill="#3b4340" /></g>
        {/* the glass */}
        <path d="M680 300 H1000 L960 730 Q840 760 720 730 Z" fill="rgba(240,220,170,.2)" stroke="rgba(255,255,255,.55)" strokeWidth={6} />
        <path d="M694 420 H986 L960 730 Q840 760 720 730 Z" fill="#b5772c" />
        <ellipse cx={840} cy={420} rx={146} ry={22} fill="#d59a48" />
        <path d="M760 300 V720" stroke="rgba(255,255,255,.24)" strokeWidth={18} />
        {[780, 860, 930].map((x, i) => <path key={x} d={`M${x} 280 q-24 -60 6 -120 q28 -60 -6 -120`} stroke="#fff" strokeOpacity={0.26} strokeWidth={14} fill="none" transform={`translate(${Math.sin(p.f / 18 + i) * 8} ${-((p.f / 3) % 20)})`} style={{filter: 'blur(5px)'}} />)}
      </Svg>
      <Hand x={1320} y={500} s={2.4} rot={-2} {...hand} pinkyCut flip />
      <Pool x={lamp ? 620 : 300} y={lamp ? 700 : 220} rx={760} color={lamp ? '255,226,170' : '255,170,100'} a={a} />
    </Macro>
  );
};

const Rice: React.FC<{p: ShotProps; hand2?: boolean}> = ({p, hand2}) => (
  <Macro p={p} bg="#020402" at={[50, 48]} vig={0.8} inner={30} z={1.05} grain={hand2 ? 0.26 : 0.12}>
    <div style={{position: 'absolute', inset: 0, background: hand2 ? '#0c1a10' : '#15121e'}} />
    <div style={{position: 'absolute', inset: 0, filter: hand2 ? 'grayscale(.7) sepia(.3) hue-rotate(60deg) saturate(1.4)' : undefined}}>
      <Svg>
        {!hand2 && <><rect x={-20} y={740} width={1960} height={80} fill="#8a6f33" /><rect x={1270} y={610} width={160} height={130} rx={10} fill="#807459" />{[1300, 1350, 1400].map(x => <g key={x}><line x1={x} y1={610} x2={x} y2={300} stroke="#8c3b2a" strokeWidth={7} /><circle cx={x} cy={300} r={8} fill="#ff7a33" /></g>)}</>}
        {hand2 && <rect x={-20} y={800} width={1960} height={320} fill={C.skinC} />}
        <path d="M640 740 Q590 450 760 410 Q840 370 930 410 Q1110 450 1060 740 Z" fill="#e4e0d2" opacity={0.95} stroke="#a7a395" strokeWidth={6} />
        <rect x={776} y={350} width={134} height={50} rx={18} fill="#c9201f" />
        <path d="M720 560 q120 -60 260 0 M700 650 q150 -40 300 10" stroke="#fff" strokeWidth={10} opacity={0.5} fill="none" />
        {Array.from({length: 30}, (_, i) => <ellipse key={i} cx={690 + rnd(131, i) * 320} cy={480 + rnd(132, i) * 240} rx={9} ry={5} fill="#f8f5ea" opacity={0.75} />)}
      </Svg>
      {hand2 && <Hand x={1430} y={930} s={2.6} rot={-6} {...hand} pinkyCut flip mode="open" />}
    </div>
    {!hand2 && <Pool x={1350} y={300} rx={420} color="255,140,70" a={0.6} />}
    {!hand2 && <Pool x={840} y={560} rx={460} color="255,190,140" a={0.26} />}
    {hand2 && <Svg>{Array.from({length: 3}, (_, i) => <path key={i} d={`M${760 + i * 100} 340 q-30 -80 8 -160 q36 -80 -8 -170`} stroke="#d7ffe0" strokeOpacity={0.18} strokeWidth={14} fill="none" style={{filter: 'blur(6px)'}} />)}</Svg>}
  </Macro>
);

// ---------------------------------------------------------------- paper

const FileIns: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#17120c" at={[50, 44]} vig={0.52} inner={36} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: '#2d2a28'}} />
    <Svg><ellipse cx={960} cy={1130} rx={1300} ry={330} fill="#111316" /></Svg>
    <Sheet x={300} y={40} w={1320} h={810} color="#e6dfc9" rot={-1}>
      <Typed x={70} y={60} size={46} weight={700}>แฟ้มทรัพย์รอการขาย เลขที่ 5</Typed>
      <div style={{position: 'absolute', left: 870, top: 50, padding: '6px 24px', border: '6px solid #a11818', color: '#a11818', fontFamily: FONT.ui, fontWeight: 700, fontSize: 40, transform: 'rotate(-6deg)'}}>ประมูล ศุกร์นี้</div>
      <Typed x={70} y={190} size={42}>ผู้อยู่อาศัยในทรัพย์ :</Typed>
      <div style={{position: 'absolute', left: 500, top: 176, width: 560, height: 78, background: '#f3ecd0', border: '4px dashed #a11818'}} />
      <Pen x={520} y={176} size={58} color="#a11818">ไม่มีผู้อยู่อาศัย ?</Pen>
      <Typed x={70} y={300} size={42}>ผู้ตรวจ :</Typed>
      <div style={{position: 'absolute', left: 280, top: 355, width: 560, height: 3, background: '#7a7362'}} />
    </Sheet>
    <Hand x={120} y={720} s={1.8} rot={-12} {...rinHand} />
    <Pool x={1500} y={160} rx={880} color="255,246,214" a={0.3} />
  </Macro>
);

const BillsTop: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#2b2c30" at={[50, 42]} vig={0.34} inner={44} z={1.04}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, #6c7176, #454950)'}} />
    {Array.from({length: 7}, (_, i) => (
      <Sheet key={i} x={150 + (i % 4) * 400 + (i > 3 ? 190 : 0)} y={i > 3 ? 440 : 40} w={370} h={380} color="#efe9d7" rot={[-4, 2, -1.5, 3, -2.5, 1.5, -3][i]}>
        <Typed x={22} y={22} size={26} weight={700}>ค่าไฟฟ้า เดือนที่ {i + 1}</Typed>
        <Typed x={22} y={80} size={24}>บ้านเลขที่ 5</Typed>
        <Typed x={22} y={130} size={40} weight={700}>60 หน่วย</Typed>
        <div style={{position: 'absolute', left: 90, top: 220, padding: '6px 16px', border: '5px solid #2c7a3e', color: '#2c7a3e', fontFamily: FONT.ui, fontWeight: 700, fontSize: 32, transform: 'rotate(-10deg)'}}>ชำระแล้ว</div>
      </Sheet>
    ))}
    <Hand x={1800} y={640} s={1.6} rot={196} {...rinHand} />
    <Pool x={200} y={100} rx={1000} color="255,250,230" a={0.3} />
  </Macro>
);

const Withdraw: React.FC<{p: ShotProps; note?: boolean}> = ({p, note}) => (
  <Macro p={p} bg="#050403" at={[50, 42]} vig={0.72} inner={30} z={note ? 1.05 : 1.08}>
    <div style={{position: 'absolute', inset: 0, background: '#12100c'}} />
    <Sheet x={230} y={40} w={1460} h={800} color="#e6dfc9" rot={-1}>
      <Typed x={60} y={40} size={42} weight={700}>บันทึกงานประเมิน · บ้านเลขที่ 5</Typed>
      <div style={{position: 'absolute', left: 60, top: 120, width: 1340, height: 4, background: '#55534a'}} />
      {[['ผู้ประเมิน ก.', 'อยู่ 2 คืน', 'ถอนตัว'], ['ผู้ประเมิน ข.', 'อยู่ 2 คืน', 'ถอนตัว'], ['ริน', 'คืนที่ 2', '...']].map((r, i) => (
        <React.Fragment key={i}>
          <Typed x={60} y={170 + i * 150} size={56}>{r[0]}</Typed>
          <Typed x={560} y={170 + i * 150} size={56}>{r[1]}</Typed>
          <Typed x={1010} y={170 + i * 150} size={66} weight={700} color={i < 2 ? '#a11818' : '#2c2820'}>{r[2]}</Typed>
          <div style={{position: 'absolute', left: 60, top: 275 + i * 150, width: 1340, height: 3, background: '#a79f8b'}} />
        </React.Fragment>
      ))}
      {!note && <div style={{position: 'absolute', left: 60, top: 640, fontFamily: FONT.ui, fontWeight: 500, fontSize: 40, color: '#8d8675'}}>เหตุผล : (ไม่ระบุ)</div>}
    </Sheet>
    <Dark x={880} y={400} r={1000} o={0.8} color="255,226,170" />
  </Macro>
);

const Tape: React.FC<P> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#2b1e12" at={[46, 44]} vig={0.44} inner={40} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#b48c5a, #5a4632)'}} />
      <Svg>
        <rect x={-20} y={-20} width={1960} height={1120} fill={C.sleeveR} />
        <path d="M-20 240 H1940" stroke="#a88422" strokeWidth={6} />
        <rect x={-20} y={330} width={1960} height={130} fill="#6a4a2a" stroke="#332211" strokeWidth={6} />
        <rect x={120} y={460} width={1800} height={640} fill="#3d4656" />
        <rect x={580} y={200} width={620} height={560} rx={80} fill={C.tape} stroke={C.tapeD} strokeWidth={10} />
        <circle cx={890} cy={480} r={170} fill="#c8a616" stroke={C.tapeD} strokeWidth={8} />
        <text x={890} y={500} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={60} fill="#3a2e08">5 M</text>
        <rect x={1180} y={620 - k * 10} width={520 + k * 150} height={72} fill="#e8d44a" stroke="#6a5c10" strokeWidth={5} />
        {Array.from({length: 18}, (_, i) => <line key={i} x1={1200 + i * 36} y1={622} x2={1200 + i * 36} y2={i % 5 ? 640 : 665} stroke="#1a1a10" strokeWidth={4} />)}
      </Svg>
      <Hand x={1950 + k * 80} y={640} s={2.2} rot={186} {...rinHand} />
      <Pool x={1300} y={130} rx={900} color="255,246,214" a={0.3} />
    </Macro>
  );
};

const Tape1140: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#040404" at={[46, 42]} vig={0.86} inner={24} z={1.06}>
    <div style={{position: 'absolute', inset: 0, background: '#201f22'}} />
    <Svg>
      <rect x={1080} y={-20} width={860} height={1120} fill="#2d2c31" />
      <path d="M1076 -20 v1140" stroke="#111" strokeWidth={14} />
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${1090 + rnd(141, i) * 400} ${rnd(142, i) * 900} l${30 + rnd(143, i) * 40} ${40 + rnd(144, i) * 40}`} stroke="#111" strokeWidth={5} />)}
      <rect x={-20} y={300} width={1200} height={240} fill="#e8d44a" stroke="#6a5c10" strokeWidth={8} />
      {Array.from({length: 22}, (_, i) => <line key={i} x1={i * 54} y1={304} x2={i * 54} y2={i % 5 ? 370 : 420} stroke="#1a1a10" strokeWidth={8} />)}
      <text x={980} y={508} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={100} fill="#a11818">11.40</text>
    </Svg>
    <Dark x={980} y={420} r={720} />
  </Macro>
);

// ---------------------------------------------------------------- watch, phones, cams

const Watch: React.FC<{p: ShotProps; warm?: boolean}> = ({p, warm}) => {
  const tick = Math.floor(p.f / 30) * 6;
  return (
    <Macro p={p} bg="#030302" at={[50, 44]} vig={0.88} inner={26} z={1.08}>
      <div style={{position: 'absolute', inset: 0, background: warm ? '#2a1a10' : '#141310'}} />
      <Svg>
        <rect x={-20} y={330} width={1960} height={420} fill={C.skinR} />
        <path d="M-20 330 H1940 M-20 750 H1940" stroke="#a17653" strokeWidth={6} />
        <rect x={720} y={-20} width={480} height={1140} fill="#2b2118" />
        {Array.from({length: 14}, (_, i) => <line key={i} x1={720} y1={i * 86} x2={1200} y2={i * 86} stroke="#120c08" strokeWidth={4} />)}
        <circle cx={960} cy={510} r={330} fill="#16161a" stroke="#807c70" strokeWidth={22} />
        <circle cx={960} cy={510} r={296} fill="#ece6d2" />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={960 + Math.sin(i * 0.5236) * 240} y1={510 - Math.cos(i * 0.5236) * 240} x2={960 + Math.sin(i * 0.5236) * 280} y2={510 - Math.cos(i * 0.5236) * 280} stroke="#222" strokeWidth={i % 3 ? 7 : 14} />)}
        <line x1={960} y1={510} x2={960 - 160 * Math.sin(1.047)} y2={510 - 160 * Math.cos(1.047)} stroke="#111" strokeWidth={22} strokeLinecap="round" />
        <line x1={960} y1={510} x2={960} y2={270} stroke="#111" strokeWidth={14} strokeLinecap="round" />
        <line x1={960} y1={510} x2={960 + Math.sin((tick * 3.14) / 180) * 260} y2={510 - Math.cos((tick * 3.14) / 180) * 260} stroke="#a11818" strokeWidth={6} />
        <circle cx={960} cy={510} r={18} fill="#111" />
      </Svg>
      <Pool x={700} y={300} rx={720} color={warm ? '255,170,90' : '255,236,190'} a={0.36} />
    </Macro>
  );
};

const PhoneText: React.FC<{p: ShotProps; lines: string[]; head: string; night?: boolean}> = ({p, lines, head, night}) => (
  <Macro p={p} bg="#050508" at={[50, 42]} vig={0.84} inner={32} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: night ? '#0b0c12' : '#3f4140'}} />
    <div style={{position: 'absolute', left: 620, top: -40, width: 680, height: 1200, borderRadius: 60, background: '#111', border: '12px solid #2a2a2d'}}>
      <div style={{position: 'absolute', inset: 22, borderRadius: 40, background: '#eef1f4', overflow: 'hidden'}}>
        <div style={{height: 110, background: '#2c5c8a', color: '#fff', fontFamily: FONT.ui, fontWeight: 700, fontSize: 42, display: 'flex', alignItems: 'center', paddingLeft: 30}}>{head}</div>
        {lines.map((t, i) => <div key={i} style={{margin: '26px 26px 0', padding: '18px 24px', borderRadius: 24, background: i % 2 ? '#d7ecd2' : '#fff', fontFamily: FONT.ui, fontWeight: 600, fontSize: 40, color: '#1a1a1a', lineHeight: 1.3}}>{t}</div>)}
      </div>
    </div>
    <Pool x={960} y={400} rx={900} color="175,205,255" a={0.3} />
  </Macro>
);

const CamPole: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#2a2c2c" at={[46, 40]} vig={0.38} inner={42} z={1.04}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#bcd0d8, #d3d0bd)'}} />
    <Svg style={{filter: 'blur(9px)'}}>
      <rect x={-20} y={600} width={1960} height={500} fill="#6b6a64" />
      {Array.from({length: 12}, (_, i) => <rect key={i} x={i * 170} y={200} width={24} height={500} fill="#2f3033" />)}
      <rect x={-20} y={560} width={1960} height={60} fill="#a39b83" />
    </Svg>
    <Svg>
      <rect x={640} y={-20} width={190} height={1140} fill="#6b6962" stroke="#333" strokeWidth={6} />
      <g transform="translate(735 410)">
        <rect x={-30} y={-140} width={60} height={160} fill="#55555a" />
        <circle r={130} fill="#c9cbc8" stroke="#55555a" strokeWidth={10} />
        <circle r={70} fill="#16171c" stroke="#55555a" strokeWidth={8} />
        <circle cx={-18} cy={-18} r={16} fill="#6c7180" />
        <circle cx={92} cy={-52} r={8} fill="#c9201f" />
      </g>
    </Svg>
    <Hand x={260} y={420} s={2} rot={-4} {...rinHand} />
    <div style={{position: 'absolute', left: 1180, top: 230, width: 370, height: 620, borderRadius: 34, background: '#111', border: '8px solid #2a2a2d', transform: 'rotate(5deg)'}}>
      <div style={{position: 'absolute', inset: 14, borderRadius: 20, background: 'linear-gradient(#54564e, #6b6a64 50%, #2c2c2c)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 16, top: 10, fontFamily: 'monospace', fontWeight: 700, fontSize: 28, color: '#fff'}}>REC</div>
        {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: 20 + i * 50, top: 200, width: 8, height: 200, background: '#1a1a1a'}} />)}
      </div>
    </div>
    <Pool x={300} y={100} rx={900} color="255,246,214" a={0.3} />
  </Macro>
);

const WardrobeCam: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#050403" at={[46, 34]} vig={0.84} inner={26} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: '#231a12'}} />
    <Svg>
      <path d="M-20 -20 H1940 V110 H-20 Z" fill="#1a130c" />
      <line x1={-20} y1={520} x2={1940} y2={520} stroke="#6c6b63" strokeWidth={22} />
      {[260, 1660].map(x => <g key={x} stroke="#46453e" strokeWidth={14} fill="none"><path d={`M${x} 520 L${x - 170} 650 H${x + 170} Z`} /></g>)}
      <circle cx={960} cy={240} r={110} fill="#c9cbc8" stroke="#55555a" strokeWidth={8} />
      <circle cx={960} cy={240} r={56} fill="#16171c" stroke="#55555a" strokeWidth={6} />
      <circle cx={944} cy={224} r={12} fill="#6c7180" />
      <circle cx={1040} cy={190} r={8} fill="#36e070" />
    </Svg>
    <Hand x={1490} y={250} s={1.9} rot={186} {...rinHand} />
    <Dark x={980} y={280} r={700} />
  </Macro>
);

const WirePan: React.FC<P> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#040405" at={[30 + k * 50, 28]} vig={0.84} inner={22} z={1.03}>
      <div style={{position: 'absolute', inset: 0, background: '#1a1b20'}} />
      <div style={{position: 'absolute', left: -k * 900, top: 0, width: 2900, height: 1080}}>
        <svg width={2900} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M-20 -20 H3000 V130 H-20 Z" fill="#100f12" />
          <path d="M-20 130 L2900 130" stroke="#08080a" strokeWidth={22} />
          <rect x={-20} y={140} width={2940} height={1000} fill="#66646c" />
          {Array.from({length: 20}, (_, i) => <rect key={i} x={i * 160 + rnd(151, i) * 60} y={150} width={12 + rnd(152, i) * 20} height={80 + rnd(153, i) * 160} fill="#201f25" opacity={0.6} />)}
          <rect x={120} y={430} width={230} height={340} rx={10} fill="#55554f" stroke="#17170f" strokeWidth={8} />
          <circle cx={235} cy={590} r={84} fill="#3d4348" stroke="#17170f" strokeWidth={6} />
          {/* the main line, the taken-off line that doesn't go to the box */}
          <path d="M235 430 V70" stroke="#111" strokeWidth={14} />
          <path d="M270 430 Q300 280 600 240 L2500 200" stroke="#050506" strokeWidth={18} fill="none" />
          {[900, 1400, 1900, 2300].map(x => <rect key={x} x={x - 8} y={205} width={16} height={34} fill="#6c6b63" />)}
          {/* windows slip by below it */}
          {[1240, 1680, 2120].map(x => <rect key={x} x={x} y={430} width={240} height={330} fill="#08090c" stroke="#111" strokeWidth={8} />)}
        </svg>
      </div>
      <Dark x={700 + k * 420} y={330} r={640} />
    </Macro>
  );
};

const Slats: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#000" at={[62, 44]} vig={0.35} inner={46} z={1.03} oy={420}>
    <div style={{position: 'absolute', inset: 0, background: '#141c30'}} />
    <Svg>
      <rect x={-20} y={380} width={1960} height={220} fill="#26304c" />
      {/* rows of dark houses on both sides, the road, the truck far down */}
      <path d="M-20 300 L1120 400 V530 L-20 680 Z" fill="#3b3c48" />
      <path d="M1940 300 L1340 400 V530 L1940 680 Z" fill="#35363f" />
      <path d="M1120 530 H1340 L1940 760 H-20 Z" fill="#5a5a60" />
      <rect x={1140} y={468} width={170} height={58} rx={8} fill="#0a0b0e" />
      <rect x={1154} y={432} width={92} height={44} rx={8} fill="#0a0b0e" />
      {[1160, 1286].map(x => <rect key={x} x={x} y={496} width={18} height={14} fill="#e0242a" />)}
      <rect x={1098} y={456} width={22} height={70} fill="#050507" />
      <rect x={1092} y={468} width={14} height={8} fill="#a7d0ff" />
    </Svg>
    <Pool x={1228} y={508} rx={150} color="255,50,40" a={0.75} />
    <Pool x={1100} y={472} rx={60} color="170,205,255" a={0.55} />
    <Svg>
      {[[-60, 150], [186, 200], [600, 190], [826, 280]].map(([y, h], i) => <g key={i}><rect x={-20} y={y} width={1960} height={h} fill="#1b140d" stroke="#090604" strokeWidth={5} />{[90, 1830].map(x => <circle key={x} cx={x} cy={y + h / 2} r={12} fill="#060505" />)}</g>)}
    </Svg>
  </Macro>
);

const Knuckle: React.FC<{p: ShotProps; hard?: boolean; old?: boolean}> = ({p, hard: hard0, old}) => {
  const hard = hard0 || old;
  const t = (p.f % 22) / 22, hit = Math.abs(Math.sin(t * Math.PI));
  return (
    <Macro p={p} bg="#040302" at={[50, 46]} vig={0.84} inner={26} z={1.04}>
      <div style={{position: 'absolute', inset: 0, background: hard ? '#2a3c32' : '#4a3525'}} />
      <Svg>
        {hard ? Array.from({length: 12}, (_, i) => <path key={i} d={`M${rnd(161, i) * 1900} ${rnd(162, i) * 1000} q50 60 12 140`} stroke="#1a2a22" strokeWidth={6} fill="none" />)
          : Array.from({length: 7}, (_, i) => <line key={i} x1={i * 290} y1={-20} x2={i * 290} y2={1100} stroke="#33241a" strokeWidth={8} />)}
        {Array.from({length: 22}, (_, i) => <rect key={i} x={560 + rnd(163, i) * 300} y={380 + ((rnd(164, i) * 600 + p.f * 6) % 600)} width={3} height={14} fill="#d9d3bf" opacity={0.5} />)}
      </Svg>
      <Hand x={1320 + hit * 80} y={460} s={3.2} rot={-4} {...(old ? {skin: '#c9a585', sleeve: '#d9c9a8'} : rinHand)} flip />
      {hard0 && <Svg>{[1, 2].map(i => <path key={i} d={`M${820 + i * 30} ${430 + i * 90} q20 10 40 0`} stroke="#b52424" strokeWidth={10} fill="none" />)}</Svg>}
      <Dark x={880} y={440} r={780} color={old ? '255,170,90' : hard ? '255,226,170' : '255,236,190'} />
    </Macro>
  );
};

const PanelEcu: React.FC<P> = ({p}) => {
  const dip = Math.max(0, 1 - Math.abs(K(p) - 0.55) * 4);
  return (
    <Macro p={p} bg="#020201" at={[50, 62]} vig={0.86} inner={24} z={1.07}>
      <div style={{position: 'absolute', inset: 0, background: '#150f0a'}} />
      <Svg>
        {Array.from({length: 7}, (_, i) => <line key={i} x1={i * 330} y1={-20} x2={i * 330} y2={640} stroke="#080503" strokeWidth={8} />)}
        <rect x={-20} y={660} width={1960} height={30} fill="#ffd27a" />
        <rect x={700 + K(p) * 240} y={640} width={420} height={70} fill="#040302" opacity={dip} style={{filter: 'blur(8px)'}} />
        <rect x={-20} y={690} width={1960} height={410} fill="#0d0805" />
      </Svg>
      <Pool x={960} y={676} rx={1100} ry={200} color="255,206,110" a={0.45} />
    </Macro>
  );
};

/** The bolt: found in the torch; drawn back by Nim's old hand at the end. Same frame. */
const Bolt: React.FC<{p: ShotProps; nim?: boolean}> = ({p, nim}) => {
  const k = nim ? Math.min(1, p.f / Math.max(1, p.len * 0.6)) : 0;
  return (
    <Macro p={p} bg="#030302" at={[46, 42]} vig={0.84} inner={26} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: '#2c2017'}} />
      <Svg>
        {[220, 620, 1000, 1400, 1780].map(x => <line key={x} x1={x} y1={-20} x2={x} y2={1100} stroke="#1a120c" strokeWidth={7} />)}
        <rect x={1160} y={240} width={230} height={330} fill="#55585a" stroke="#111" strokeWidth={6} />
        <rect x={420 - k * 230} y={320} width={830} height={170} rx={28} fill="#a9abab" stroke="#111" strokeWidth={7} />
        <path d={`M${440 - k * 230} 345 H${1220 - k * 230}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={10} />
        <rect x={700 - k * 230} y={230} width={90} height={110} rx={16} fill="#8d8f8f" stroke="#111" strokeWidth={6} />
        <rect x={300} y={300} width={140} height={210} fill={k > 0.2 ? 'transparent' : '#55585a'} stroke={k > 0.2 ? 'transparent' : '#111'} strokeWidth={6} />
        {/* the hatch below */}
        <rect x={500} y={660} width={760} height={320} fill="#3b2a1d" stroke="#15100a" strokeWidth={8} />
        <rect x={640} y={790} width={460} height={60} rx={14} fill="#7c7f7c" stroke="#111" strokeWidth={5} />
      </Svg>
      {nim && <Hand x={1040 - k * 230} y={260} s={2.1} rot={-94} skin="#c9a585" sleeve="#d9c9a8" />}
      <Dark x={820} y={440} r={820} o={0.88} />
    </Macro>
  );
};

const Wedge: React.FC<P> = ({p}) => {
  const k = K(p), s = Math.sin(Math.min(1, k * 2) * Math.PI);
  return (
    <Macro p={p} bg="#030302" at={[48, 66]} vig={0.84} inner={24} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: '#120d09'}} />
      <Svg>
        <rect x={-20} y={-20} width={1120} height={800} fill="#4a3525" />
        <rect x={1100} y={-20} width={840} height={800} fill="#0a0705" />
        <rect x={-20} y={780} width={1960} height={330} fill="#2c2017" />
        <path d="M820 800 L1160 800 L1160 730 Z" fill="#a77a4c" stroke="#3d2a15" strokeWidth={8} />
        <rect x={1084} y={-20} width={20} height={800} fill="#ffd27a" opacity={0.85} />
        <rect x={820 - s * 30} y={560} width={160} height={210} rx={20} fill="#5a4a30" opacity={0} />
      </Svg>
      <Hand x={330 + s * 60} y={690} s={2.4} rot={8} {...rinHand} />
      <Pool x={1094} y={420} rx={460} color="255,206,110" a={0.3} />
      <Dark x={880} y={720} r={760} o={0.82} />
    </Macro>
  );
};

const BlockNote: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#050403" at={[50, 42]} vig={0.7} inner={32} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: '#5f5b4c'}} />
    {[[-3, 140, 40], [2, 560, 70], [-1, 1040, 30]].map(([rot, x, y], i) => (
      <Sheet key={i} x={x} y={y} w={500} h={620} color="#ebe5d2" lines rot={rot}>
        <div style={{position: 'absolute', left: 30, top: 34, fontFamily: FONT.ui, fontWeight: 800, fontSize: 50, color: '#222', lineHeight: 1.45}}>
          {i === 0 && <>เจ้าหนี้<br />ยังเฝ้า<br />อย่าส่งเสียง</>}
          {i === 1 && <>เคาะ 2 ที<br />2 ที<br />= ข้าว</>}
          {i === 2 && <>ห้ามเปิด<br />ห้ามตอบใคร<br />รอเขา</>}
        </div>
      </Sheet>
    ))}
    <Pool x={900} y={120} rx={880} color="255,214,140" a={0.3} />
  </Macro>
);

const HatchInside: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#050403" at={[50, 60]} vig={0.72} inner={30} z={1.05} oy={620}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1140} fill="#6b6757" />
      <rect x={-20} y={850} width={1960} height={260} fill="#46413a" />
      <rect x={420} y={250} width={1060} height={600} fill="#3a291c" stroke="#1b130c" strokeWidth={12} />
      {[580, 760, 950, 1140, 1320].map(x => <line key={x} x1={x} y1={260} x2={x} y2={840} stroke="#2a1d12" strokeWidth={6} />)}
      {Array.from({length: 22}, (_, i) => <path key={i} d={`M${520 + i * 40} ${440 + rnd(171, i) * 300} q18 -14 36 0`} stroke="#14100a" strokeWidth={10} fill="none" opacity={0.6} />)}
      {[[230, 870], [130, 930], [320, 950], [1650, 870], [1760, 940]].map(([x, y], i) => <g key={i}><path d={`M${x - 80} ${y + 66} L${x - 52} ${y - 36} L${x + 52} ${y - 36} L${x + 80} ${y + 66} Z`} fill="#c8c8bd" opacity={0.92} /><rect x={x - 18} y={y - 50} width={36} height={18} fill="#c9201f" /></g>)}
    </Svg>
    <Pool x={1200} y={60} rx={900} color="255,214,140" a={0.3} />
  </Macro>
);

const TonIns: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#040302" at={[52, 46]} vig={0.72} inner={30} z={1.04}>
    <Svg>
      <rect x={-20} y={-20} width={1960} height={1140} fill="#514b3f" />
      <rect x={-20} y={470} width={1960} height={640} fill="#6f7984" />
      <path d="M-20 470 Q960 400 1940 480" stroke="#3f4a55" strokeWidth={8} fill="none" />
      {Array.from({length: 9}, (_, i) => <g key={i} transform={`translate(${160 + i * 200} ${620 + (i % 2) * 110})`} opacity={0.65}><circle r={38} fill="#e6b73a" /><circle cx={-13} cy={-8} r={7} fill="#111" /><circle cx={13} cy={-8} r={7} fill="#111" /></g>)}
      {/* his head on her arm; two thin shins under the blanket */}
      <path d="M1100 720 Q1330 650 1800 700 L1820 780 Q1330 780 1110 790 Z" fill="#59626c" />
      <path d="M1100 830 Q1340 790 1800 830 L1810 900 Q1340 880 1110 900 Z" fill="#59626c" />
      <ellipse cx={560} cy={290} rx={210} ry={220} fill={C.skinN} />
      <path d="M350 240 Q380 60 560 60 Q760 70 770 240 Q560 170 350 240 Z" fill="#2b221e" />
      <circle cx={490} cy={300} r={18} fill="#111" /><circle cx={620} cy={300} r={18} fill="#111" />
      <path d="M520 400 q40 12 70 0" stroke="#7a5a48" strokeWidth={8} fill="none" />
      <path d="M260 500 Q560 430 900 520 L900 720 Q560 620 240 720 Z" fill={C.fadedT} />
    </Svg>
    <Pool x={1120} y={130} rx={760} color="255,214,140" a={0.28} />
  </Macro>
);

const HatchFood: React.FC<P> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#141009" at={[50, 56]} vig={0.6} inner={34} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: '#3a2a1c'}} />
      <Svg>
        {[260, 640, 1020, 1400, 1780].map(x => <line key={x} x1={x} y1={-20} x2={x} y2={1100} stroke="#231810" strokeWidth={7} />)}
        <rect x={500} y={270} width={960} height={530} fill="#0d0805" stroke="#1a120c" strokeWidth={10} />
        <rect x={500 - k * 640} y={480} width={960} height={40} fill="#7c7f7c" opacity={0} />
        <rect x={720} y={510 - k * 40} width={300} height={170} rx={10} fill="#e5e1d2" stroke="#8d8a7a" strokeWidth={5} />
        <rect x={1060} y={430 - k * 40} width={90} height={240} rx={22} fill="#f19b3b" stroke="#a7641a" strokeWidth={5} />
      </Svg>
      <Hand x={1540} y={640 - k * 40} s={2.1} rot={184} {...rinHand} />
      <Hand x={560} y={490 - k * 30} s={1.5} rot={14} skin={C.skinN} sleeve={C.fadedP} mode="open" />
      <Pool x={1500} y={200} rx={780} color="255,226,170" a={0.3} />
    </Macro>
  );
};

const NoteBlack: React.FC<{p: ShotProps; ecu?: boolean}> = ({p, ecu}) => (
  <Macro p={p} bg="#2c2e28" at={[50, 44]} vig={0.3} inner={46} z={ecu ? 1.08 : 1.04}>
    <div style={{position: 'absolute', inset: 0, background: '#8a6c4d'}} />
    <div style={{position: 'absolute', left: ecu ? 180 : 330, top: ecu ? 30 : 60, width: ecu ? 1560 : 1260, height: ecu ? 820 : 760, background: '#0f0f12', padding: 26, boxSizing: 'border-box', transform: ecu ? 'rotate(178deg)' : 'rotate(-1deg)'}}>
      <div style={{position: 'relative', width: '100%', height: '100%', background: '#f0ebda', transform: ecu ? 'rotate(180deg)' : undefined}}>
        <Typed x={50} y={30} size={ecu ? 52 : 44} weight={700}>คดีตกน้ำ ท่าน้ำบ้านเลขที่ 5</Typed>
        <Pen x={50} y={ecu ? 170 : 120} size={ecu ? 74 : 56}>ผู้ตาย นายมานพ 46</Pen>
        <Pen x={50} y={ecu ? 320 : 210} size={ecu ? 74 : 56} color={ecu ? '#a11818' : '#23305a'}>ผู้รับศพ นายเฉลิม น้องชาย</Pen>
        <Pen x={50} y={ecu ? 470 : 300} size={ecu ? 74 : 56}>เมียกับลูก หนีหนี้</Pen>
        <div style={{position: 'absolute', left: ecu ? 880 : 760, top: ecu ? 560 : 420, padding: '6px 24px', border: '7px solid #a11818', fontFamily: FONT.ui, fontWeight: 800, fontSize: ecu ? 62 : 52, color: '#a11818', transform: 'rotate(-7deg)'}}>ปิดคดี</div>
      </div>
    </div>
    {!ecu && <Hand x={1660} y={540} s={1.9} rot={186} skin="#e8b995" sleeve="#8b7355" />}
    {ecu && <Hand x={1740} y={460} s={1.9} rot={186} skin="#e8b995" sleeve="#8b7355" />}
    <Pool x={960} y={90} rx={1000} color="240,250,240" a={0.2} />
  </Macro>
);

/** the phone in his tattooed hand, the photo he has taken a hundred times. Same picture morning and night. */
const ThawatPhone: React.FC<{p: ShotProps; day?: boolean}> = ({p, day}) => (
  <Macro p={p} bg={day ? '#3c3a34' : '#040408'} at={[50, 44]} vig={day ? 0.36 : 0.8} inner={32} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: day ? 'linear-gradient(#c9b48f, #8c8878)' : '#0b0c13'}} />
    <div style={{position: 'absolute', left: 500, top: 40, width: 920, height: 830, borderRadius: 40, background: '#0c0c0e', border: '10px solid #2a2a2d'}}>
      <div style={{position: 'absolute', inset: 18, background: '#080a10', overflow: 'hidden', borderRadius: 24}}>
        <Svg style={{transform: 'scale(.46)', transformOrigin: '0 0'}}>
          <rect width={1920} height={1600} fill="#181c26" />
          {Array.from({length: 12}, (_, i) => <rect key={i} x={i * 170} y={380} width={22} height={1200} fill="#050507" />)}
          <rect width={1920} height={40} y={380} fill="#050507" />
          <rect y={1040} width={1920} height={560} fill="#2a2a2d" />
          <path d="M880 1620 V760 Q880 560 1040 560 Q1210 560 1210 760 V1620 Z" fill="#36494e" />
          <ellipse cx={1044} cy={500} rx={130} ry={148} fill="#25212b" />
          <path d="M880 1400 H1210 V1620 H880 Z" fill={C.boot} />
        </Svg>
      </div>
    </div>
    <Hand x={120} y={720} s={2} rot={-12} skin="#e8b995" sleeve="#262833" />
    <Svg><path d="M200 700 l40 60 M260 660 l30 60 M160 770 l30 50" stroke="#2b3a52" strokeWidth={9} /></Svg>
    {!day && <Pool x={960} y={420} rx={820} color="175,205,255" a={0.34} />}
    {day && <Pool x={200} y={100} rx={900} color="255,216,150" a={0.3} />}
  </Macro>
);

const LineCard: React.FC<P> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#0a0806" at={[50, 42]} vig={0.72} inner={30} z={1.03}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(#3a2c1a, #14100a)`}} />
      <div style={{position: 'absolute', inset: 0, filter: 'blur(16px) brightness(.5)'}}>
        <Svg><circle cx={960} cy={420} r={360} fill="#c9c7ba" /><rect x={740} y={230} width={440} height={120} fill="#111" /></Svg>
      </div>
      {[0.3, 0.46, 0.62].map((y, i) => <div key={i} style={{position: 'absolute', left: 0, top: `${y * 100}%`, width: '100%', height: 6, background: '#ffd27a', opacity: 0.55 * (1 - k * 0.6), boxShadow: '0 0 30px 6px rgba(255,200,110,.5)'}} />)}
      <Pool x={960} y={480} rx={1000} color="255,216,150" a={0.16 + k * 0.3} />
    </Macro>
  );
};

const CatEcu: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#030202" at={[50, 44]} vig={0.84} inner={30} z={1.06}>
    <div style={{position: 'absolute', inset: 0, background: '#0a0807'}} />
    <Svg>
      <ellipse cx={960} cy={560} rx={760} ry={560} fill="#0e0e11" />
      <path d="M260 180 L420 -40 L620 170 Z M1660 180 L1500 -40 L1300 170 Z" fill="#0e0e11" />
      {[640, 1280].map(x => <g key={x}><ellipse cx={x} cy={430} rx={170} ry={130} fill="#d7b83a" /><ellipse cx={x} cy={430} rx={26} ry={124} fill="#050404" /><circle cx={x - 50} cy={380} r={18} fill="#fff" opacity={0.75} /></g>)}
      <path d="M920 650 L1000 650 L960 700 Z" fill="#3a2f2c" />
      {[-1, 1].map(s => [0, 1, 2].map(i => <path key={`${s}${i}`} d={`M${960 + s * 120} ${690 + i * 28} q${s * 300} ${-30 + i * 30} ${s * 620} ${-70 + i * 60}`} stroke="#c7c2b5" strokeWidth={4} fill="none" opacity={0.45} />))}
    </Svg>
    <Pool x={960} y={420} rx={740} color="255,170,90" a={0.14} />
  </Macro>
);

const Radio: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#14100a" at={[44, 48]} vig={0.66} inner={32} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: '#24272e'}} />
    <Svg>
      <rect x={-20} y={300} width={1960} height={800} fill="#1c1f26" />
      <rect x={300} y={380} width={1320} height={360} rx={24} fill="#14171d" stroke="#3a3f4a" strokeWidth={6} />
      <rect x={380} y={450} width={800} height={160} rx={10} fill="#e28a2d" />
      {Array.from({length: 16}, (_, i) => <line key={i} x1={420 + i * 48} y1={470} x2={420 + i * 48} y2={i % 3 ? 500 : 520} stroke="#3a1e06" strokeWidth={6} />)}
      <rect x={760 + Math.sin(p.f / 9) * 60} y={460} width={10} height={144} fill="#b3201f" />
      <text x={780} y={590} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#3a1e06">FM วิทยุชุมชน</text>
      <circle cx={1370} cy={530} r={90} fill="#2c3038" stroke="#666" strokeWidth={8} />
      <path d="M1370 530 L1400 470" stroke="#ccc" strokeWidth={10} />
    </Svg>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 300, filter: 'blur(9px)', background: 'linear-gradient(#b5c6c6, #dcd7c1)'}} />
    <Pool x={780} y={530} rx={520} color="255,170,90" a={0.34} />
    <Pool x={1400} y={120} rx={900} color="255,246,214" a={0.26} />
  </Macro>
);

const Rinphone = (lines: string[], head: string, night = true): React.FC<P> => ({p}) => <PhoneText p={p} lines={lines} head={head} night={night} />;

const PhoneGlow: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#020302" at={[50, 42]} vig={0.86} inner={30} z={1.07}>
    <div style={{position: 'absolute', inset: 0, background: '#07070a'}} />
    <div style={{position: 'absolute', left: 420, top: 40, width: 1080, height: 820, borderRadius: 34, border: '14px solid #1f1f22', overflow: 'hidden', background: '#000', filter: 'grayscale(1) sepia(.4) hue-rotate(60deg) saturate(1.5) contrast(1.2)'}}>
      <div style={{position: 'absolute', left: -220, top: -130, width: 1920, height: 1080, transform: 'scale(.72)', transformOrigin: '50% 50%'}}><WardrobeInside p={p} /></div>
      <div style={{position: 'absolute', left: 24, bottom: 18, fontFamily: 'monospace', fontWeight: 700, fontSize: 44, color: '#d7ffe0'}}>21:59:{String(40 + Math.floor(p.f / 30)).padStart(2, '0')}</div>
    </div>
    <Pool x={960} y={440} rx={820} color="160,240,180" a={0.2} />
  </Macro>
);

const MeterDisc: React.FC<P> = ({p}) => {
  const spin = p.f * 0.14;
  return (
    <Macro p={p} bg="#030303" at={[50, 46]} vig={0.84} inner={26} z={1.05}>
      <div style={{position: 'absolute', inset: 0, background: '#141414'}} />
      <Svg>
        <ellipse cx={960} cy={500} rx={720} ry={150} fill="#b9bbb6" stroke="#4a4b45" strokeWidth={12} />
        <ellipse cx={960} cy={500} rx={700} ry={136} fill="#a4a6a1" />
        <rect x={960 + Math.sin(spin) * 660 - 80} y={400} width={160} height={200} rx={14} fill="#0d0d0d" opacity={0.35 + 0.65 * Math.max(0, Math.cos(spin))} />
        <rect x={-20} y={220} width={1960} height={100} fill="#0b0b0a" />
        <rect x={-20} y={680} width={1960} height={420} fill="#0b0b0a" />
      </Svg>
      <Dark x={760} y={500} r={880} o={0.8} />
    </Macro>
  );
};

/** the wing mirror of Rin's car at dusk, the mouth of the soi in it: pickup, tail lights, a man holding up a phone */
const WingMirror: React.FC<P> = ({p}) => (
  <Macro p={p} bg="#100c12" at={[56, 44]} vig={0.55} inner={36} z={1.05}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#3b3360, #a8664f 60%, #2c2830 61%)'}} />
    <Svg style={{filter: 'blur(10px)'}}><rect x={-20} y={560} width={1960} height={520} fill="#3a363c" /><rect x={-20} y={300} width={640} height={300} fill="#4c403c" /></Svg>
    <Svg>
      <path d="M-20 1100 L-20 720 Q300 650 720 700 L700 1100 Z" fill="#7a7f83" />
      <path d="M-20 720 Q300 650 720 700" stroke="#c9ccd0" strokeWidth={8} fill="none" />
      <path d="M560 720 L760 610" stroke="#17181c" strokeWidth={46} strokeLinecap="round" />
      <defs><clipPath id="wing"><rect x={620} y={150} width={980} height={620} rx={120} /></clipPath></defs>
      <rect x={596} y={126} width={1028} height={668} rx={136} fill="#16171b" />
      <g clipPath="url(#wing)">
        <rect x={620} y={150} width={980} height={620} fill="#a56a55" />
        <rect x={620} y={150} width={980} height={230} fill="#463c66" />
        <path d="M620 300 L1050 390 V500 L620 680 Z" fill="#2c262c" />
        <path d="M1600 280 L1250 390 V500 L1600 640 Z" fill="#2a252b" />
        <path d="M1050 500 H1250 L1600 770 H620 Z" fill="#4d4950" />
        <rect x={1070} y={440} width={170} height={66} rx={8} fill="#18181c" />
        <rect x={1090} y={402} width={86} height={46} rx={8} fill="#18181c" />
        {[1080, 1216].map(x => <rect key={x} x={x} y={470} width={16} height={12} fill="#e0242a" />)}
        <rect x={1006} y={410} width={30} height={96} rx={8} fill="#0e0e12" />
        <circle cx={1021} cy={396} r={16} fill="#0e0e12" />
        <path d="M1030 430 L1056 390" stroke="#0e0e12" strokeWidth={10} />
        <rect x={1050} y={374} width={14} height={22} fill="#bcd6ff" />
        <path d="M820 150 L700 770" stroke="#fff" strokeOpacity={0.09} strokeWidth={90} />
      </g>
    </Svg>
    <Pool x={1057} y={385} rx={70} color="175,205,255" a={0.7} />
    <Pool x={1160} y={476} rx={120} color="255,60,50" a={0.42} />
  </Macro>
);

export const CLUES: Record<string, React.FC<P>> = {
  'mirror-thawat': WingMirror,
  'tape-ins': Tape,
  'file-ins': FileIns,
  'radio-ins': Radio,
  'note5-ins': Note5,
  'key-ots': KeyOts,
  'tell-keys-ecu': TellKeys,
  'boots-low': ({p}) => <Boots p={p} tone="sun" />,
  'boots-mud-low': ({p}) => <Boots p={p} tone="dusk" />,
  'wedge-boot-low': ({p}) => <Boots p={p} tone="dark" kick />,
  'photo-ins': ({p}) => <Photo p={p} />,
  'photo-ecu': ({p}) => <Photo p={p} ecu />,
  'photo-torch-ecu': ({p}) => <Photo p={p} torch />,
  'bills-top': BillsTop,
  'tea-ins': ({p}) => <Tea p={p} />,
  'tea2-ins': ({p}) => <Tea p={p} lamp />,
  'rice-ins': ({p}) => <Rice p={p} />,
  'rice-mirror-ins': ({p}) => <Rice p={p} hand2 />,
  'withdraw-ecu': ({p}) => <Withdraw p={p} />,
  'withdraw-note-ins': ({p}) => <Withdraw p={p} note />,
  'watch-ecu': ({p}) => <Watch p={p} />,
  'watch-ecu2': ({p}) => <Watch p={p} warm />,
  'note-22-ins': ({p}) => <Note22 p={p} />,
  'note-22-mirror-ins': ({p}) => <Note22 p={p} lamp />,
  'note-month-ins': NoteMonth,
  'thawat-phone-ins': ({p}) => <ThawatPhone p={p} />,
  'thawat-photo-ecu': ({p}) => <ThawatPhone p={p} day />,
  'cam-pole-ins': CamPole,
  'tape-1140-ecu': Tape1140,
  'rin-phone-ins': Rinphone(['บ้านเลขที่ 5 ซอยตันหลังตลาด', 'เข้าไปดูคนเดียว', 'ถ้าเช้าไม่ตอบ ให้แจ้งตำรวจ'], 'หัวหน้า'),
  'text-appraiser-ins': Rinphone(['พี่ถอนตัวเพราะอะไรคะ', 'ยางรถพี่ถูกเจาะ 2 คืนติด', 'อย่าเสียเวลากับบ้านนั้นเลย'], 'ผู้ประเมินคนก่อน', false),
  'phone-glow-ecu': PhoneGlow,
  'meter-disc-ecu': MeterDisc,
  'wire-pan-low': WirePan,
  'knuckle-ecu': ({p}) => <Knuckle p={p} />,
  'fist-wall-ecu': ({p}) => <Knuckle p={p} hard />,
  'panel-ecu': PanelEcu,
  'bolt-ins': ({p}) => <Bolt p={p} />,
  'nim-bolt-ins': ({p}) => <Bolt p={p} nim />,
  'wedge-ins': Wedge,
  'block-note-ins': BlockNote,
  'hatch-inside-ins': HatchInside,
  'ton-ins': TonIns,
  'slat-pov': Slats,
  'wardrobe-cam-ins': WardrobeCam,
  'notebook-ins': ({p}) => <NoteBlack p={p} />,
  'notebook-name-ecu': ({p}) => <NoteBlack p={p} ecu />,
  'hatch-food-ins': HatchFood,
  'hand-eye-ins': HandEye,
  'receipt-ecu': Receipt,
  'twist-card-ecu': TwistCard,
  'full-photo-ecu': FullPhoto,
  'hand-bolt-ecu': HandBolt,
  'nim-hand-ins': ({p}) => <Knuckle p={p} old />,
  'nim-knock-ecu': ({p}) => <Knuckle p={p} old />,
  'cat-ecu': CatEcu,
  'line-card': LineCard,
};

