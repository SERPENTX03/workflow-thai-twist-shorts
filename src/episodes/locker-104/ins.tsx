import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {appear, rnd} from '../../engine/anim';
import {T} from '../../engine/theme';
import {EndCardScene} from '../../kit/EndCard';
import {D, FONT, K, Macro, Pen, Pool, Sheet, Svg, Typed} from '../../kit/frame';
import {Grain} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {C} from './cast';

// Inserts of ล็อคเกอร์ 104 (brief.md → Clues). Every clue object has one drawing and one framing, reused wherever the
// story meets it, so the pay-off frame repeats the planting frame with the missing piece visible:
//   locks    the hasp with six bite marks + the bright padlock  → six cut padlocks in Theera's hand (same frame)
//   memo     the board by the radio, red-headed memo           → the same board in a torch, the memo readable
//   window   the cracked signal-box pane                       → the fist through that pane (2542)
// Hands: Sommai's right hand carries the scar; sleeves in the cast colours.

const SKIN_S = C.skinS, SLEEVE_S = C.khaki;
const HandS: React.FC<{x: number; y: number; rot?: number; s?: number; mode?: 'grip' | 'open' | 'flat' | 'fist' | 'point' | 'pinch'; scar?: boolean; sleeve?: string; skin?: string}> = ({x, y, rot = 0, s = 2, mode = 'grip', scar, sleeve = SLEEVE_S, skin = SKIN_S}) => (
  <>
    <Hand x={x} y={y} s={s} rot={rot} skin={skin} sleeve={sleeve} mode={mode} />
    {scar && <Svg><path d={`M${x - 26 * s} ${y + 4 * s} q${20 * s} ${-12 * s} ${50 * s} ${-6 * s}`} stroke="#9a5a4a" strokeWidth={5 * s} fill="none" strokeLinecap="round" opacity={0.85} transform={`rotate(${rot} ${x} ${y})`} /></Svg>}
  </>
);

// ---------------------------------------------------------------- backgrounds

const DeskTop: React.FC<{lamp?: [number, number]; morning?: boolean}> = ({lamp = [560, 220], morning}) => (
  <>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1160} fill={morning ? '#7a5c3e' : '#4a3626'} />
      {Array.from({length: 22}, (_, i) => <path key={i} d={`M-40 ${i * 54 + rnd(3, i) * 20} Q960 ${i * 54 + 30 - rnd(4, i) * 40} 1960 ${i * 54 + rnd(5, i) * 20}`} stroke="#2f2218" strokeWidth={2 + rnd(6, i) * 3} fill="none" opacity={0.45} />)}
    </Svg>
    <div style={{position: 'absolute', inset: 0, background: morning ? 'linear-gradient(100deg, rgba(0,0,0,.35), rgba(0,0,0,0) 70%)' : `radial-gradient(ellipse 900px 700px at ${lamp[0]}px ${lamp[1]}px, rgba(0,0,0,0) 20%, rgba(0,0,0,.82) 100%)`}} />
    <Pool x={lamp[0]} y={lamp[1]} rx={760} ry={520} color={morning ? '255,236,190' : C.lamp} a={0.34} />
  </>
);

const WetFloor: React.FC<{tone?: string; light?: [number, number]}> = ({tone = '#2a2622', light = [960, 200]}) => (
  <>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1160} fill={tone} />
      {Array.from({length: 9}, (_, i) => <line key={i} x1={-40} y1={i * 130 + 40} x2={1960} y2={i * 130 + 20} stroke="#151210" strokeWidth={7} />)}
      {Array.from({length: 14}, (_, i) => <ellipse key={i} cx={rnd(21, i) * 1920} cy={rnd(22, i) * 1080} rx={60 + rnd(23, i) * 160} ry={12 + rnd(24, i) * 22} fill="#9fb3c2" opacity={0.08 + rnd(25, i) * 0.1} />)}
    </Svg>
    <Pool x={light[0]} y={light[1]} rx={900} ry={600} color={C.neon} a={0.18} />
  </>
);

// ---------------------------------------------------------------- the objects

/** brass padlock, `cut` = shackle cut through on the right leg, `rust` 0–1 */
const Padlock: React.FC<{x: number; y: number; s?: number; cut?: boolean; rust?: number; rot?: number}> = ({x, y, s = 1, cut, rust = 0, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d={cut ? 'M-46 0 V-70 Q-46 -120 0 -120 Q46 -120 46 -70 V-40' : 'M-46 0 V-70 Q-46 -120 0 -120 Q46 -120 46 -70 V0'} fill="none" stroke="#a7aab0" strokeWidth={20} strokeLinecap="butt" />
    {cut && <path d="M40 -40 l14 -6 M46 -18 v18" stroke="#d9dcdf" strokeWidth={6} />}
    <rect x={-74} y={-10} width={148} height={130} rx={18} fill={C.brass} stroke={C.brassD} strokeWidth={6} />
    <rect x={-60} y={2} width={120} height={20} rx={8} fill="#e8cf86" opacity={0.6} />
    <path d="M0 52 v30" stroke="#3a2a12" strokeWidth={14} strokeLinecap="round" />
    <circle cx={0} cy={48} r={12} fill="#3a2a12" />
    <text x={0} y={108} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#6e521c">50</text>
    {rust > 0 && Array.from({length: Math.round(6 + rust * 22)}, (_, i) => <circle key={i} cx={-64 + rnd(31 + x, i) * 128} cy={-4 + rnd(32 + y, i) * 120} r={3 + rnd(33, i) * 9} fill="#6e3a1c" opacity={0.35 + rust * 0.4} />)}
  </g>
);

/** the hasp of locker 104: six bite marks, chain, padlock */
const Hasp: React.FC<{p: ShotProps; pay?: boolean; cutter?: boolean}> = ({p, pay, cutter}) => (
  <Macro p={p} bg="#050606" at={[46, 46]} vig={0.86} inner={24} z={1.05}>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1160} fill={C.lockerD} />
      <rect x={280} y={-40} width={1100} height={1160} fill={C.locker} />
      {Array.from({length: 30}, (_, i) => <circle key={i} cx={300 + rnd(41, i) * 1060} cy={rnd(42, i) * 1080} r={4 + rnd(43, i) * 16} fill="#6e3a1c" opacity={0.25} />)}
      <text x={620} y={300} fontFamily={FONT.title} fontSize={190} fill="#a33028" opacity={0.85}>104</text>
      <rect x={1300} y={420} width={320} height={110} rx={10} fill="#8d9095" stroke="#2b2d30" strokeWidth={6} />
      <rect x={1140} y={440} width={190} height={70} rx={8} fill="#7a7d82" stroke="#2b2d30" strokeWidth={6} />
      {Array.from({length: 6}, (_, i) => <path key={i} d={`M${1330 + i * 44} 420 l12 26 l12 -26`} fill="#2b2d30" stroke="#d6d9dc" strokeWidth={2} />)}
      {Array.from({length: 6}, (_, i) => <path key={i} d={`M${1330 + i * 44} 530 l12 -22 l12 22`} fill="#2b2d30" />)}
    </Svg>
    {!pay && <Svg><Padlock x={1460} y={600} s={1.25} /></Svg>}
    {cutter && <Svg><g transform={`rotate(${-8 + Math.min(1, K(p) * 2) * 6} 1420 470)`}><path d="M1380 470 L1180 760 L1120 1120 M1460 470 L1500 760 L1560 1120" stroke="#3a3d42" strokeWidth={34} strokeLinecap="round" fill="none" /><path d="M1170 760 L1100 1120 M1510 760 L1580 1120" stroke="#a32b26" strokeWidth={46} strokeLinecap="round" /></g></Svg>}
    {cutter && <HandS x={1120} y={960} rot={-70} s={2.6} mode="grip" scar />}
    {pay && <Svg>{Array.from({length: 6}, (_, i) => <Padlock key={i} x={520 + i * 190} y={760 + (i % 2) * 40} s={0.8} cut rust={0.15 + i * 0.14} rot={-8 + i * 4} />)}</Svg>}
    {pay && <HandS x={1640} y={930} rot={200} s={2.2} mode="open" skin={C.skinT} sleeve={C.coat} />}
    <Pool x={1380} y={520} rx={520} color="255,236,190" a={0.4} />
  </Macro>
);

/** locker door front from the cold open: red 104, chain, padlock, one drip */
const LockerDoor: React.FC<{p: ShotProps}> = ({p}) => {
  const drip = (p.f % 40) / 40;
  return (
    <Macro p={p} bg="#050606" at={[52, 40]} vig={0.8} inner={30} z={1.06}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#22302a" />
        <rect x={420} y={-40} width={1080} height={1160} fill={C.locker} stroke={C.lockerD} strokeWidth={10} />
        {[160, 220, 280].map(y => <rect key={y} x={600} y={y} width={720} height={16} rx={6} fill={C.lockerD} />)}
        <text x={700} y={600} fontFamily={FONT.title} fontSize={260} fill="#a33028">104</text>
        {Array.from({length: 40}, (_, i) => <circle key={i} cx={440 + rnd(51, i) * 1040} cy={rnd(52, i) * 1080} r={4 + rnd(53, i) * 18} fill="#6e3a1c" opacity={0.3} />)}
        <rect x={1300} y={330} width={260} height={90} rx={10} fill="#8d9095" stroke="#2b2d30" strokeWidth={6} />
        <rect x={1180} y={345} width={150} height={60} rx={8} fill="#7a7d82" stroke="#2b2d30" strokeWidth={6} />
        {Array.from({length: 6}, (_, i) => <path key={i} d={`M${1316 + i * 38} 330 l10 22 l10 -22`} fill="#2b2d30" />)}
        <Padlock x={1430} y={470} s={1.0} />
        <ellipse cx={1430} cy={240 + drip * 200} rx={7} ry={12} fill="#cfe0ea" opacity={0.85} />
      </Svg>
      <Pool x={960} y={160} rx={800} color={C.neon} a={0.3} />
    </Macro>
  );
};

/** portable cassette player, front: two reels, counter, PLAY. `count` shows on the counter */
const Player: React.FC<{x: number; y: number; s?: number; f: number; count: number; spin?: boolean; side?: string}> = ({x, y, s = 1, f, count, spin = true, side = 'A'}) => {
  const a = spin ? f * 6 : 0;
  const reel = (cx: number, r: number) => (
    <g transform={`rotate(${a} ${cx} 0)`}>
      <circle cx={cx} cy={0} r={r} fill="#3b2f26" />
      <circle cx={cx} cy={0} r={34} fill="#e4ded0" />
      {[0, 60, 120, 180, 240, 300].map(k => <rect key={k} x={cx - 5} y={-30} width={10} height={14} fill="#2a2a2a" transform={`rotate(${k} ${cx} 0)`} />)}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-520} y={-300} width={1040} height={600} rx={40} fill="#1d1f23" stroke="#0b0c0e" strokeWidth={8} />
      <rect x={-430} y={-230} width={860} height={300} rx={20} fill="#2c3035" />
      <rect x={-380} y={-200} width={760} height={240} rx={14} fill="#8c9096" opacity={0.35} />
      <g transform="translate(0 -80)">{reel(-190, 92)}{reel(190, 72)}</g>
      <rect x={-200} y={-20} width={400} height={50} rx={6} fill="#e6dfcd" />
      <text x={0} y={16} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={34} fill={C.ink}>{side === 'B' ? 'ด้าน B' : '14 พ.ย. — ห้ามหยุดฟัง'}</text>
      <rect x={-430} y={110} width={150} height={120} rx={10} fill="#111214" />
      <text x={-355} y={192} textAnchor="middle" fontFamily={FONT.type} fontWeight={700} fontSize={64} fill="#e8e2d0">{String(count).padStart(3, '0')}</text>
      {[['PLAY', '#3a9a52'], ['STOP', '#7a7e86'], ['REW', '#7a7e86'], ['FF', '#7a7e86']].map(([t, c], i) => (
        <g key={t}><rect x={-220 + i * 150} y={120} width={130} height={90} rx={10} fill={c} /><text x={-155 + i * 150} y={232 + 10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#9da2aa">{t}</text></g>
      ))}
      <circle cx={430} cy={160} r={14} fill={spin ? '#ff3b30' : '#3a1210'} />
    </g>
  );
};

const PlayerShot: React.FC<{p: ShotProps; count: number; ecu?: 'reels' | 'counter'; side?: string; thumb?: boolean}> = ({p, count, ecu, side, thumb}) => {
  const s = ecu === 'counter' ? 2.4 : ecu === 'reels' ? 1.5 : 1;
  const ox = ecu === 'counter' ? 1250 : 960, oy = ecu === 'counter' ? 270 : ecu === 'reels' ? 640 : 560;
  return (
    <Macro p={p} bg="#060505" at={[48, 44]} vig={0.84} inner={28} z={1.07}>
      <DeskTop lamp={[560, 260]} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px`}}>
        <Svg><Player x={960} y={560} f={p.f} count={count + Math.floor(K(p) * 6)} side={side} /></Svg>
        {thumb && <HandS x={890} y={1046} rot={-90} s={1.5} mode="point" />}
      </div>
    </Macro>
  );
};

/** brass pocket watch, cracked glass, hands stopped at 01:15; `run` = the second hand moving again */
const Watch: React.FC<{x: number; y: number; s?: number; f: number; run?: boolean}> = ({x, y, s = 1, f, run}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-300} r={30} fill="none" stroke={C.brass} strokeWidth={12} />
    <circle cx={0} cy={0} r={280} fill={C.brass} stroke={C.brassD} strokeWidth={14} />
    <circle cx={0} cy={0} r={238} fill="#efe6cf" />
    {Array.from({length: 12}, (_, i) => <text key={i} x={Math.sin((i + 1) * Math.PI / 6) * 190} y={-Math.cos((i + 1) * Math.PI / 6) * 190 + 16} textAnchor="middle" fontFamily={T.title} fontSize={46} fill="#2a2420">{i + 1}</text>)}
    <line x1={0} y1={0} x2={Math.sin(1.25 / 12 * 2 * Math.PI) * 120} y2={-Math.cos(1.25 / 12 * 2 * Math.PI) * 120} stroke="#1a1612" strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.sin(Math.PI / 2) * 180} y2={0} stroke="#1a1612" strokeWidth={9} strokeLinecap="round" />
    {run && <line x1={0} y1={0} x2={Math.sin(f / 30 * Math.PI / 30) * 200} y2={-Math.cos(f / 30 * Math.PI / 30) * 200} stroke={C.red} strokeWidth={4} />}
    <circle cx={0} cy={0} r={14} fill="#1a1612" />
    <path d="M-60 -40 L40 30 L150 -90 M40 30 L10 170 M40 30 L180 110 M-60 -40 L-190 20" stroke="#fff" strokeWidth={4} opacity={0.75} fill="none" />
    <ellipse cx={-80} cy={-120} rx={90} ry={50} fill="#fff" opacity={0.2} />
  </g>
);

const WatchShot: React.FC<{p: ShotProps; kind: 'hand' | 'two' | 'swing' | 'end'}> = ({p, kind}) => {
  const sw = kind === 'swing' ? Math.sin(p.f / 9) * 14 : 0;
  return (
    <Macro p={p} bg="#050404" at={kind === 'two' ? [40, 50] : [50, 46]} vig={0.85} inner={26} z={1.05}>
      {kind === 'end' ? <DeskTop morning lamp={[1500, 200]} /> : kind === 'hand' ? <DeskTop lamp={[700, 300]} /> : <WetFloor />}
      {kind === 'two' && <Svg><circle cx={1520} cy={300} r={170} fill="#e8e2d0" opacity={0.25} style={{filter: 'blur(6px)'}} /><text x={1520} y={330} textAnchor="middle" fontFamily={FONT.type} fontSize={80} fill="#e8e2d0" opacity={0.4} style={{filter: 'blur(3px)'}}>01:13</text></Svg>}
      <Svg><g transform={`rotate(${sw} 760 120)`}><Watch x={760} y={kind === 'swing' ? 520 : 470} s={kind === 'two' ? 1.05 : 1.15} f={p.f} run={kind === 'end'} /></g></Svg>
            {kind === 'two' && <HandS x={1080} y={800} rot={150} s={2.4} mode="grip" />}
      {kind === 'end' && <Svg><Ticket x={1250} y={560} s={0.75} rot={-6} /></Svg>}
      {kind === 'swing' && <Pool x={1500} y={300} rx={600} color={C.head} a={0.3} />}
    </Macro>
  );
};

/** Fon's crayon ticket */
const Ticket: React.FC<{x: number; y: number; s?: number; rot?: number; stain?: boolean}> = ({x, y, s = 1, rot = 0, stain = true}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-420} y={-230} width={840} height={460} rx={18} fill="#efe2c2" stroke="#b9a578" strokeWidth={6} />
    <path d="M-420 -90 H420" stroke="#d2554c" strokeWidth={10} strokeDasharray="30 18" />
    <text x={0} y={-130} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={66} fill="#c23a30">ตั๋วรถไฟ</text>
    <text x={0} y={0} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={58} fill="#2f58a8">พ่อพาฝนไปทะเล</text>
    <text x={0} y={82} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={70} fill="#2a2a2a">01:15</text>
    <path d="M-380 180 q60 -40 120 0 t120 0 t120 0 t120 0 t120 0 t120 0" stroke="#3a8ad0" strokeWidth={14} fill="none" />
    <g transform="translate(-300 120)"><rect x={-60} y={-40} width={120} height={50} rx={8} fill="#5b9a52" /><circle cx={-30} cy={14} r={12} fill="#333" /><circle cx={30} cy={14} r={12} fill="#333" /></g>
    <circle cx={330} cy={-150} r={40} fill="#f2c230" />
    {stain && <path d="M240 120 q60 -40 120 10 q40 50 -20 90 q-80 30 -110 -20 q-20 -50 10 -80 Z" fill="#6b3a26" opacity={0.55} />}
  </g>
);

const TicketShot: React.FC<{p: ShotProps; kind: 'lamp' | 'past' | 'box'}> = ({p, kind}) => (
  <Macro p={p} bg="#050404" at={[50, 46]} vig={0.8} inner={30} z={1.05}>
    <DeskTop lamp={kind === 'box' ? [1500, 160] : [700, 260]} />
    {kind === 'box' && <Svg><rect x={1050} y={420} width={760} height={560} rx={20} fill="#5d6268" stroke="#2c2f33" strokeWidth={10} /><Player x={1430} y={700} s={0.45} f={0} count={0} spin={false} /></Svg>}
    <Svg><Ticket x={kind === 'box' ? 720 : 960} y={kind === 'box' ? 560 : 500} s={kind === 'past' ? 1 : 0.95} rot={kind === 'past' ? 0 : -4} stain={kind !== 'past'} /></Svg>
    {kind === 'past' && <><HandS x={500} y={760} rot={-20} s={1.6} mode="grip" skin="#e8b995" sleeve="#24365a" /><HandS x={1420} y={760} rot={200} s={1.6} mode="grip" skin="#e8b995" sleeve="#24365a" /></>}
    {kind === 'box' && <HandS x={540} y={860} rot={-30} s={2.2} mode="pinch" />}
  </Macro>
);

/** the group photo, 2541: Sommai, Theera in uniform, Chod with a bottle of rice whisky, young Sai with her cart, Fon */
const GroupPhoto: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const fig = (cx: number, h: number, shirt: string, hair: string, extra?: React.ReactNode) => (
    <g>
      <rect x={cx - 46 * h} y={330 - 220 * h} width={92 * h} height={220 * h} rx={30 * h} fill={shirt} />
      <circle cx={cx} cy={330 - 270 * h} r={50 * h} fill="#d9a982" />
      <path d={`M${cx - 52 * h} ${330 - 280 * h} q${52 * h} ${-70 * h} ${104 * h} 0`} fill={hair} />
      <circle cx={cx - 16 * h} cy={330 - 270 * h} r={5} fill="#222" /><circle cx={cx + 16 * h} cy={330 - 270 * h} r={5} fill="#222" />
      <path d={`M${cx - 16 * h} ${330 - 246 * h} q${16 * h} ${12 * h} ${32 * h} 0`} stroke="#5a2a20" strokeWidth={4} fill="none" />
      {extra}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-620} y={-380} width={1240} height={760} rx={10} fill="#3a2a1d" stroke="#1c140d" strokeWidth={16} />
      <rect x={-580} y={-340} width={1160} height={680} fill="#b9a98a" />
      <rect x={-580} y={-340} width={1160} height={300} fill="#8fa3a6" />
      <rect x={-300} y={-300} width={600} height={90} rx={6} fill="#e9e4d6" />
      <text x={0} y={-240} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#2a2a2a">คลองหมอก</text>
      <g transform="translate(0 -40)">
        {fig(-420, 1, '#5a6b8d', '#2b2522', <rect x={-480} y={150} width={120} height={60} fill="#7a5a3a" />)}
        {fig(-210, 1.05, C.khaki, '#2a2420')}
        {fig(10, 1.1, '#8b7355', '#221d1a', <g><rect x={-30} y={130} width={60} height={14} fill="#a32b26" /><path d="M-50 -10 h120 l-14 -36 h-92 Z" fill="#6b5a3e" /><rect x={-50} y={-14} width={120} height={10} fill="#2a2218" /></g>)}
        {fig(230, 1.08, '#354b61', '#3a302a', <g><circle cx={292} cy={180} r={18} fill="#d9a982" /><rect x={280} y={92} width={30} height={90} rx={8} fill="#cfe0e6" opacity={0.9} /><rect x={286} y={74} width={18} height={22} fill="#a32b26" /></g>)}
        {fig(-90, 0.62, '#24365a', '#241e22', <g><circle cx={-122} cy={140} r={13} fill="#d2342c" /><circle cx={-58} cy={140} r={13} fill="#d2342c" /></g>)}
      </g>
      <rect x={-580} y={-340} width={1160} height={680} fill="#d9b98a" opacity={0.22} />
      <text x={520} y={310} textAnchor="end" fontFamily={FONT.type} fontSize={30} fill="#f0e2c0" opacity={0.85}>'41</text>
      <path d="M-560 -320 L-200 330" stroke="#fff" strokeWidth={30} opacity={0.08} />
    </g>
  );
};

const PhotoShot: React.FC<{p: ShotProps; kind: 'all' | 'pan' | 'theera'}> = ({p, kind}) => {
  const k = K(p);
  const s = kind === 'all' ? 1 : 2.2;
  const ox = kind === 'pan' ? 560 + k * 900 : kind === 'theera' ? 970 : 960;
  return (
    <Macro p={p} bg="#050404" at={[50, 44]} vig={0.8} inner={30} z={1.04}>
      <DeskTop lamp={[640, 260]} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: `${ox}px ${kind === 'all' ? 520 : 420}px`}}>
        <Svg><GroupPhoto x={960} y={520} s={0.95} /></Svg>
      </div>
      <Pool x={600} y={260} rx={700} color={C.lamp} a={0.25} />
    </Macro>
  );
};

/** the notice board by the radio; `read` = close on the memo in a torch (pay-off) */
const Board: React.FC<{p: ShotProps; radio: 'on' | 'dies' | 'board'; read?: boolean}> = ({p, radio, read}) => {
  const dead = radio === 'dies' && K(p) > 0.55;
  const z = read ? 1.9 : 1;
  return (
    <Macro p={p} bg="#050505" at={read ? [40, 40] : [58, 50]} vig={0.86} inner={26} z={1.04}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: '520px 360px'}}>
        <Svg>
          <rect x={-40} y={-40} width={2000} height={1160} fill="#3f453b" />
          <rect x={120} y={60} width={820} height={640} fill="#7d5f3d" stroke="#3a2a1a" strokeWidth={10} />
          {[[150, 90, 270, 260], [450, 90, 230, 200], [710, 120, 200, 300], [160, 380, 260, 290], [460, 330, 220, 330]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={i === 0 ? '#e4dcc4' : '#cfc6ad'} transform={`rotate(${[-2, 3, -1, 2, -3][i]} ${x} ${y})`} />)}
          <g transform="rotate(-2 150 90)">
            <rect x={150} y={90} width={270} height={40} fill={C.red} />
            <text x={285} y={120} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#fff">ประกาศ</text>
            <text x={162} y={162} fontFamily={FONT.ui} fontWeight={600} fontSize={read ? 19 : 18} fill="#2c2820">ปิดวิทยุทวนสัญญาณสายแยก</text>
            <text x={162} y={190} fontFamily={FONT.ui} fontWeight={600} fontSize={18} fill="#2c2820">เวลา 23.15 น. ทุกคืน</text>
            <text x={162} y={218} fontFamily={FONT.ui} fontWeight={600} fontSize={18} fill="#2c2820">ตั้งแต่ 1 ต.ค. 2563</text>
            <text x={162} y={252} fontFamily={FONT.hand} fontWeight={700} fontSize={24} fill={C.ink}>รับทราบ: สมหมาย</text>
          </g>
          {/* the radio on its charger */}
          <rect x={1160} y={560} width={420} height={60} rx={10} fill="#232528" />
          <rect x={1280} y={260} width={170} height={320} rx={22} fill="#1a1c1f" stroke="#0a0b0c" strokeWidth={6} />
          <rect x={1350} y={120} width={22} height={150} rx={8} fill="#1a1c1f" />
          {Array.from({length: 6}, (_, i) => <line key={i} x1={1300} y1={300 + i * 18} x2={1430} y2={300 + i * 18} stroke="#2e3236" strokeWidth={6} />)}
          <rect x={1300} y={430} width={130} height={60} rx={6} fill={dead ? '#0c0e0d' : '#1e3a2a'} />
          <circle cx={1430} cy={610} r={10} fill={dead ? '#16251a' : '#47ff6a'} />
        </Svg>
        {!dead && <Pool x={1430} y={610} rx={60} color="80,255,110" a={0.7} />}
        {!dead && <Pool x={1365} y={460} rx={140} color="80,255,140" a={0.18} />}
      </div>
      {read ? <Pool x={620} y={460} rx={620} color="255,236,190" a={0.4} /> : <Pool x={700} y={300} rx={800} color={C.lamp} a={0.24} />}
    </Macro>
  );
};

const DigitalClock: React.FC<{p: ShotProps}> = ({p}) => {
  const sec = 58 + Math.min(1, Math.floor(K(p) * 2));
  return (
    <Macro p={p} bg="#030303" at={[50, 46]} vig={0.7} inner={34} z={1.08}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#24281f" />
        <rect x={360} y={260} width={1200} height={420} rx={24} fill="#0d0d0d" stroke="#2c2c2c" strokeWidth={14} />
        <text x={960} y={560} textAnchor="middle" fontFamily={FONT.type} fontWeight={700} fontSize={250} fill="#ff4030">23:14:{sec}</text>
      </Svg>
      <Pool x={960} y={470} rx={700} ry={300} color="255,70,50" a={0.26} />
    </Macro>
  );
};

const StationClock: React.FC<{p: ShotProps}> = ({p}) => {
  const sec = 52 + K(p) * 8;
  const ang = sec / 60 * 2 * Math.PI;
  return (
    <Macro p={p} bg="#030405" at={[50, 42]} vig={0.75} inner={30} z={1.06}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#1a1f22" />
        <rect x={0} y={-40} width={1920} height={120} fill={C.tinD} />
        <line x1={960} y1={-40} x2={960} y2={140} stroke="#2a2d30" strokeWidth={20} />
        <circle cx={960} cy={500} r={380} fill="#e8e4d8" stroke="#2a2d30" strokeWidth={30} />
        {Array.from({length: 60}, (_, i) => <line key={i} x1={960 + Math.sin(i * Math.PI / 30) * (i % 5 ? 340 : 310)} y1={500 - Math.cos(i * Math.PI / 30) * (i % 5 ? 340 : 310)} x2={960 + Math.sin(i * Math.PI / 30) * 360} y2={500 - Math.cos(i * Math.PI / 30) * 360} stroke="#1a1a1a" strokeWidth={i % 5 ? 4 : 12} />)}
        <line x1={960} y1={500} x2={960 + Math.sin(-0.01) * 200} y2={500 - 200} stroke="#1a1a1a" strokeWidth={22} strokeLinecap="round" />
        <line x1={960} y1={500} x2={960 + Math.sin(-0.02) * 300} y2={500 - 300} stroke="#1a1a1a" strokeWidth={14} strokeLinecap="round" />
        <line x1={960} y1={500} x2={960 + Math.sin(ang) * 320} y2={500 - Math.cos(ang) * 320} stroke={C.red} strokeWidth={6} />
        <circle cx={960} cy={500} r={20} fill="#1a1a1a" />
      </Svg>
      <Pool x={960} y={300} rx={700} color={C.neon} a={0.3} />
    </Macro>
  );
};

const Mug: React.FC<{p: ShotProps; cold?: boolean}> = ({p, cold}) => (
  <Macro p={p} bg="#050404" at={[52, 48]} vig={0.82} inner={28} z={1.05}>
    <DeskTop lamp={[600, 280]} />
    <Svg>
      <ellipse cx={cold ? 1380 : 1000} cy={760} rx={240} ry={50} fill="#000" opacity={0.4} />
      <path d={`M${cold ? 1160 : 780} 420 h440 l-30 340 q-190 40 -380 0 Z`} fill="#e8e2d0" stroke="#9c9480" strokeWidth={6} />
      <ellipse cx={cold ? 1380 : 1000} cy={420} rx={220} ry={46} fill="#7a4e2a" />
      <path d={`M${cold ? 1600 : 1220} 480 q110 20 80 140 q-30 90 -100 70`} stroke="#e8e2d0" strokeWidth={30} fill="none" />
      {!cold && [0, 1, 2].map(i => <path key={i} d={`M${920 + i * 80} 380 q-30 -80 10 -160 q30 -60 -10 -120`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.18 + 0.05 * Math.sin(p.f / 8 + i)} />)}
      {!cold && <Player x={360} y={620} s={0.42} f={p.f} count={60} />}
      {cold && <rect x={1810} y={-40} width={150} height={1160} fill="#000" opacity={0.5} />}
    </Svg>
  </Macro>
);

const Basket: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#050404" at={[48, 52]} vig={0.85} inner={26} z={1.05}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#2a2620" />
        <path d="M300 380 Q960 300 1620 380 L1520 1000 H400 Z" fill="#a57c48" stroke="#5c4124" strokeWidth={10} />
        {Array.from({length: 14}, (_, i) => <path key={i} d={`M${340 + i * 90} 390 L${420 + i * 80} 1000`} stroke="#7a5832" strokeWidth={8} />)}
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${320 - i * 6} ${450 + i * 80} Q960 ${400 + i * 80} ${1600 + i * 6} ${450 + i * 80}`} stroke="#7a5832" strokeWidth={7} fill="none" />)}
        <path d="M300 380 Q960 -40 1620 380" stroke="#6b4a26" strokeWidth={34} fill="none" />
        {/* the pills and the padlock box under the cloth */}
        <rect x={560} y={430} width={360} height={180} rx={12} fill="#d9dde2" stroke="#9aa1a8" strokeWidth={4} transform="rotate(-8 740 520)" />
        {Array.from({length: 10}, (_, i) => <circle key={i} cx={610 + (i % 5) * 64} cy={480 + Math.floor(i / 5) * 70} r={22} fill={i < 4 ? '#bfc4ca' : '#fafafa'} stroke="#a4abb2" strokeWidth={3} transform="rotate(-8 740 520)" />)}
        <rect x={1000} y={420} width={300} height={220} rx={10} fill="#c9a24a" stroke="#8a6b26" strokeWidth={5} transform="rotate(6 1150 530)" />
        <text x={1150} y={545} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#5a4214" transform="rotate(6 1150 530)">แม่กุญแจ</text>
        {/* the pha khao ma sliding back over them */}
        <path d={`M${200 + (1 - k) * 0} ${360 - k * 60} L${1200 - k * 520} ${330} L${1100 - k * 520} 720 L200 760 Z`} fill="#b03a3a" />
        {Array.from({length: 6}, (_, i) => <path key={i} d={`M200 ${400 + i * 60} L${1180 - k * 520} ${380 + i * 60}`} stroke="#e3d4b2" strokeWidth={8} opacity={0.6} />)}
      </Svg>
      <Pool x={1100} y={300} rx={800} color={C.fluo} a={0.18} />
    </Macro>
  );
};

/** Sommai's notebook under the lamp; `ecu` closes on the double-underlined line */
const Diary: React.FC<{p: ShotProps; ecu?: boolean}> = ({p, ecu}) => (
  <Macro p={p} bg="#050404" at={[46, 44]} vig={0.84} inner={28} z={ecu ? 1.08 : 1.05}>
    <DeskTop lamp={[640, 260]} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${ecu ? 1.9 : 1})`, transformOrigin: '760px 470px'}}>
      <Sheet x={260} y={110} w={700} h={820} color="#e7ddc0" lines rot={-2}>
        <Pen x={60} y={40} size={52}>14 พ.ย.</Pen>
        <Pen x={60} y={170} size={40}>ฝนตกหนัก รถไฟ 01:15</Pen>
        <Pen x={60} y={240} size={40}>กลิ่นเหล้าขาวฉุนในป้อมสับราง</Pen>
        <div style={{position: 'absolute', left: 60, top: 300, width: 560, height: 6, background: C.ink, transform: 'rotate(-1deg)'}} />
        <Pen x={60} y={380} size={46} shake={0.3}>คนร้ายเมาเหล้า</Pen>
        <div style={{position: 'absolute', left: 60, top: 440, width: 420, height: 6, background: C.ink}} />
        <div style={{position: 'absolute', left: 60, top: 452, width: 420, height: 6, background: C.ink}} />
        <Pen x={60} y={520} size={40}>เสื้อกันฝนสีเขียว อุ้มฝนไป</Pen>
      </Sheet>
      <Sheet x={960} y={120} w={700} h={810} color="#e2d7b8" lines rot={1.5}>
        <Pen x={60} y={40} size={52} shake={0.4}>14 พ.ย.</Pen>
        <Pen x={60} y={170} size={40} shake={0.5}>กลิ่นเหล้าขาว ในป้อม</Pen>
        <Pen x={60} y={240} size={40} shake={0.6}>คนร้าย... เสื้อเขียว</Pen>
        <div style={{position: 'absolute', left: 300, top: 360, width: 80, height: 500, background: 'repeating-linear-gradient(180deg, #8a8f95 0 10px, transparent 10px 40px)', opacity: 0.8}} />
      </Sheet>
    </div>
  </Macro>
);

const KeysEcu: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#040405" at={[50, 50]} vig={0.85} inner={26} z={1.05}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill={C.shop} />
        <rect x={-40} y={260} width={2000} height={60} fill="#d9d36a" opacity={0.8} />
        <rect x={-40} y={320} width={2000} height={30} fill="#c8ccd0" opacity={0.8} />
        <rect x={-40} y={560} width={2000} height={120} fill="#1d2b36" />
        <rect x={840} y={540} width={160} height={160} rx={16} fill="#8d9095" stroke="#3a3c40" strokeWidth={8} />
        <path d="M960 680 v80" stroke="#8d9095" strokeWidth={10} />
        <circle cx={960} cy={790} r={34} fill="none" stroke="#a7aab0" strokeWidth={10} />
        <path d="M940 820 l-20 90 l14 6 l6 -20 l10 4 l4 -18" fill="#c9ccd0" stroke="#6a6d72" strokeWidth={3} />
        <rect x={880} y={820} width={170} height={230} rx={12} fill={C.keyTag} stroke={C.keyTagD} strokeWidth={6} />
        <text x={965} y={910} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#3a2a06">ป้อมสับราง</text>
        <text x={965} y={952} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#3a2a06">คลองหมอก</text>
      </Svg>
      <HandS x={1500 - k * 340} y={880} rot={190} s={2.3} mode="flat" skin={C.skinK} sleeve={C.shop} />
      <Pool x={700} y={500} rx={700} color="255,236,190" a={0.36} />
    </Macro>
  );
};

/** the 2542 train log: `under` = the ledger edge under the shop shirt; 'page' | 'ecu' | 'scrape' | 'name' | 'write' */
const Logbook: React.FC<{p: ShotProps; kind: 'shirt' | 'page' | 'ecu' | 'scrape' | 'name' | 'write' | 'hand'}> = ({p, kind}) => {
  const k = K(p);
  if (kind === 'shirt') return (
    <Macro p={p} bg="#040405" at={[50, 50]} vig={0.85} inner={26} z={1.05}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill={C.shop} />
        <rect x={-40} y={200} width={2000} height={50} fill="#d9d36a" opacity={0.7} />
        <path d="M420 520 L1500 470 L1520 760 L440 810 Z" fill="#5b6d58" stroke="#2c372b" strokeWidth={10} />
        <text x={980} y={680} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={88} fill="#d8d0b0" transform="rotate(-3 980 650)">2542</text>
        <path d="M380 420 Q960 560 1580 400 L1600 1120 H360 Z" fill={C.shop} opacity={0.96} />
      </Svg>
      <Pool x={980} y={600} rx={600} color="255,236,190" a={0.4} />
    </Macro>
  );
  const z = kind === 'page' ? 1 : 2.1;
  const scraped = kind === 'name' ? 1 : kind === 'scrape' ? Math.min(1, k * 1.3) : 0;
  const ox = 1080, oy = 560;
  return (
    <Macro p={p} bg="#040405" at={[48, 46]} vig={0.86} inner={26} z={1.04}>
      <Svg><rect x={-40} y={-40} width={2000} height={1160} fill="#1d1a16" /></Svg>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: `${ox}px ${oy}px`}}>
        <Sheet x={160} y={70} w={1600} h={900} color="#d8cfae">
          <Typed x={60} y={30} size={44} weight={700}>บันทึกการเดินรถ สถานีคลองหมอก · 14 พ.ย. 2542</Typed>
          {['เวลา', 'ขบวน', 'ผู้ควบคุมประแจ', 'หมายเหตุ'].map((t, i) => <Typed key={t} x={[60, 300, 620, 1120][i]} y={130} size={34} weight={700}>{t}</Typed>)}
          {[['22:40', 'ท้องถิ่น 437', 'ชด', 'ปกติ'], ['00:20', 'สินค้า 702', 'ชด', 'ปกติ'], ['01:15', 'สินค้า 704', '', '']].map((r, i) => (
            <div key={i}>{r.map((t, j) => <Typed key={j} x={[60, 300, 620, 1120][j]} y={220 + i * 110} size={38}>{t}</Typed>)}</div>
          ))}
          {[200, 310, 420, 530].map(y => <div key={y} style={{position: 'absolute', left: 40, top: y, width: 1520, height: 3, background: '#8a7f62'}} />)}
          {/* the 01:15 row: the scratched-out name, and what was under it */}
          <div style={{position: 'absolute', left: 610, top: 432, width: 460, height: 80, overflow: 'hidden'}}>
            <Pen x={10} y={8} size={44} color="#2a3a6a">รับเวรแทน: สมหมาย</Pen>
            <div style={{position: 'absolute', left: 0, top: 0, width: `${(1 - scraped) * 100}%`, height: 80, background: 'repeating-linear-gradient(115deg, #111 0 14px, #1c1c1c 14px 22px)'}} />
          </div>
          {kind !== 'write' && <Pen x={1110} y={440} size={34} shake={0.7} color="#3a2a2a">ประแจรางหลีกขัดข้องเอง</Pen>}
          {kind !== 'write' && <Pen x={1110} y={490} size={34} shake={0.7} color="#3a2a2a">— นายชด ผู้รับผิดชอบ</Pen>}
          {kind === 'write' && <>
            <Pen x={1110} y={440} size={34} shake={0.7} color="#3a2a2a" style={{textDecoration: 'line-through'}}>— นายชด ผู้รับผิดชอบ</Pen>
            <Pen x={1110} y={500} size={36} shake={0.9} color="#14306a">นายสมหมาย ผู้รับผิดชอบ</Pen>
          </>}
          <div style={{position: 'absolute', left: 0, top: 0, width: 1600, height: 900, background: 'radial-gradient(ellipse at 70% 80%, rgba(90,60,20,.25), rgba(0,0,0,0) 60%)'}} />
        </Sheet>
        {kind === 'scrape' && <Svg><path d={`M${700 + scraped * 380} 520 L${1100 + scraped * 380} 820`} stroke="#c9ccd0" strokeWidth={16} strokeLinecap="round" /><path d={`M${1100 + scraped * 380} 820 L${1280 + scraped * 380} 1000`} stroke="#3a2a1d" strokeWidth={40} strokeLinecap="round" /></Svg>}
      </div>
      {kind === 'hand' && <><HandS x={500} y={760} rot={-20} s={2.2} mode="grip" skin={C.skinK} sleeve={C.shop} /><HandS x={1500} y={760} rot={200} s={2.2} mode="grip" scar /></>}
      {kind === 'write' && <HandS x={1420} y={900} rot={210} s={2.2} mode="pinch" scar />}
      <Pool x={1000} y={480} rx={720} color="255,236,190" a={kind === 'write' ? 0.3 : 0.42} />
    </Macro>
  );
};

const Revolver: React.FC<{x: number; y: number; s?: number; open?: boolean; rot?: number; count?: number; hammer?: number}> = ({x, y, s = 1, open, rot = 0, count = 5, hammer = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-120 40 L-70 -40 L40 -40 L10 60 Q-20 220 -90 230 Q-170 230 -160 150 Z" fill="#4a3426" stroke="#24180f" strokeWidth={8} />
    <rect x={-80} y={-130} width={260} height={110} rx={18} fill="#2a2c30" stroke="#121315" strokeWidth={8} />
    <rect x={170} y={-112} width={420} height={54} rx={10} fill="#2a2c30" stroke="#121315" strokeWidth={8} />
    <rect x={560} y={-130} width={22} height={22} fill="#2a2c30" />
    <path d={`M-70 -120 L${-120 - hammer * 30} ${-170 + hammer * 20} L-90 -170 Z`} fill="#3a3d43" stroke="#121315" strokeWidth={6} />
    <path d="M10 -20 Q30 60 110 50" fill="none" stroke="#121315" strokeWidth={14} />
    {!open && <rect x={20} y={-150} width={150} height={150} rx={40} fill="#3d4047" stroke="#121315" strokeWidth={8} />}
    {open && <g transform="translate(110 120)">
      <circle cx={0} cy={0} r={150} fill="#3d4047" stroke="#121315" strokeWidth={10} />
      {Array.from({length: 6}, (_, i) => { const a = i * Math.PI / 3 - Math.PI / 2; return <g key={i}><circle cx={Math.cos(a) * 90} cy={Math.sin(a) * 90} r={38} fill="#0d0d0e" />{i < count && <><circle cx={Math.cos(a) * 90} cy={Math.sin(a) * 90} r={32} fill={C.brass} /><circle cx={Math.cos(a) * 90} cy={Math.sin(a) * 90} r={10} fill="#e0c47a" /></>}</g>; })}
      <circle cx={0} cy={0} r={26} fill="#121315" />
    </g>}
  </g>
);

const GunShot: React.FC<{p: ShotProps; kind: 'drawer' | 'belt' | 'hammer' | 'trigger' | 'drop'}> = ({p, kind}) => {
  const k = K(p);
  if (kind === 'drawer') return (
    <Macro p={p} bg="#040404" at={[50, 50]} vig={0.85} inner={26} z={1.05}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#3a3e44" />
        <rect x={160} y={160} width={1600} height={900} fill="#1a1c1f" stroke="#55595f" strokeWidth={14} />
        <path d="M300 300 Q900 220 1600 320 L1700 980 H220 Z" fill="#ebe6da" />
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M${320 + i * 180} 300 q40 300 -20 680`} stroke="#c9c3b3" strokeWidth={4} fill="none" />)}
        <Revolver x={760} y={560} s={1.25} open count={5} rot={-6} />
      </Svg>
      <Pool x={900} y={420} rx={720} color={C.lamp} a={0.4} />
    </Macro>
  );
  if (kind === 'drop') return (
    <Macro p={p} bg="#040404" at={[50, 56]} vig={0.85} inner={26} z={1.04}>
      <WetFloor tone="#2c2620" light={[1300, 200]} />
      <Svg>
        <g transform={`translate(0 ${Math.min(1, k * 2.5) * 400 - 400})`}><Revolver x={820} y={640} s={1.0} rot={-24 + k * 20} /></g>
        {k > 0.4 && Array.from({length: 10}, (_, i) => <circle key={i} cx={900 + Math.cos(i) * (60 + k * 200)} cy={760 - Math.abs(Math.sin(i * 1.7)) * k * 160} r={8} fill="#b8cad6" opacity={1 - k} />)}
      </Svg>
    </Macro>
  );
  const z = kind === 'belt' ? 1 : 1.6;
  return (
    <Macro p={p} bg="#030303" at={[50, 46]} vig={0.88} inner={24} z={1.06}>
      <WetFloor tone="#1e1f22" light={[400, 200]} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: '900px 520px'}}>
        <Svg>
          {kind === 'belt' && <><rect x={-40} y={600} width={2000} height={90} fill="#3e3328" /><rect x={-40} y={-40} width={2000} height={640} fill={C.khaki} opacity={0.85} /></>}
          <Revolver x={kind === 'belt' ? 700 - k * 120 : 760} y={kind === 'belt' ? 620 - k * 180 : 520} s={1.2} rot={kind === 'belt' ? -10 : -4} hammer={kind === 'hammer' ? Math.min(1, k * 2) : kind === 'trigger' ? 1 - Math.min(1, (k * 3) % 1) : 0} />
          {Array.from({length: 7}, (_, i) => <circle key={i} cx={1000 + rnd(81, i) * 500} cy={450 + rnd(82, i) * 100} r={6} fill="#cfe0ea" opacity={0.6} />)}
        </Svg>
        <HandS x={kind === 'belt' ? 600 - k * 120 : 640} y={kind === 'belt' ? 820 - k * 180 : 720} rot={-10} s={2.6} mode={kind === 'hammer' ? 'point' : 'grip'} scar />
      </div>
      <Pool x={500} y={300} rx={800} color={kind === 'belt' ? C.fluo : C.head} a={0.3} />
    </Macro>
  );
};

/** the police record, 15 พ.ย. 2542, signed ร.ต.อ.ธีระ; 'staple' | 'page' | 'ecu' | 'sign' | 'signTorch' */
const Record: React.FC<{p: ShotProps; kind: 'staple' | 'page' | 'ecu' | 'sign' | 'signTorch'}> = ({p, kind}) => {
  const k = K(p);
  const z = kind === 'page' ? 1 : kind === 'staple' ? 1.4 : kind === 'ecu' ? 1.9 : 2.3;
  const oy = kind === 'ecu' ? 520 : kind === 'staple' ? 360 : 760;
  return (
    <Macro p={p} bg="#040404" at={[48, 46]} vig={0.86} inner={26} z={1.04}>
      <DeskTop lamp={[640, 280]} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: `${kind === 'sign' || kind === 'signTorch' ? 1180 : 960}px ${oy}px`}}>
        <Sheet x={420} y={60} w={1080} h={960} color="#e6dcc0" rot={-1}>
          <Typed x={340} y={40} size={42} weight={700}>สำเนาบันทึกประจำวัน</Typed>
          <Typed x={360} y={100} size={34}>สภ.คลองหมอก · 15 พ.ย. 2542</Typed>
          <Typed x={70} y={210} size={32} style={{fontFamily: FONT.type}}>เหตุรถสินค้าขบวน 704 ชนบ้านพักนายสถานี</Typed>
          <Typed x={70} y={270} size={32} style={{fontFamily: FONT.type}}>ผู้เสียชีวิต 1 ราย ด.ญ.ฝน อายุ 10 ปี</Typed>
          <Typed x={70} y={380} size={34} weight={700} style={{fontFamily: FONT.type}}>ไม่พบร่องรอยบุคคลภายนอก</Typed>
          <Typed x={70} y={440} size={34} weight={700} style={{fontFamily: FONT.type}}>ให้ปิดสำนวนเป็นอุบัติเหตุ</Typed>
          <Pen x={560} y={640} size={60} color="#1c3a8a" shake={0.2}>ธีระ</Pen>
          <Typed x={480} y={740} size={30}>ร.ต.อ.ธีระ พงศ์ไพรัช</Typed>
          <div style={{position: 'absolute', left: 120, top: 600, width: 220, height: 220, borderRadius: '50%', border: '8px solid rgba(110,50,140,.55)'}} />
        </Sheet>
        {kind === 'staple' && <Svg>
          {[700, 1200].map(x => <rect key={x} x={x} y={40 + (x === 700 ? k * 30 : 0)} width={110} height={18} fill="#8a6a4a" stroke="#4a3220" strokeWidth={3} transform={x === 700 ? `rotate(${-k * 30} 700 40)` : undefined} />)}
        </Svg>}
      </div>
      {kind === 'signTorch' && <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle 380px at ${880 + Math.sin(p.f / 5) * 18}px 520px, rgba(0,0,0,0) 40%, rgba(0,0,0,.9) 100%)`}} />}
      {kind === 'staple' && <HandS x={1260} y={760} rot={200} s={2.2} mode="pinch" />}
    </Macro>
  );
};

const SpillTop: React.FC<{p: ShotProps; receipt?: boolean}> = ({p, receipt}) => (
  <Macro p={p} bg="#040404" at={[50, 50]} vig={0.85} inner={26} z={receipt ? 1.08 : 1.04}>
    <WetFloor tone="#3a3631" light={[960, 120]} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${receipt ? 2.2 : 1})`, transformOrigin: '1360px 640px'}}>
      <Svg>
        <rect x={260} y={420} width={420} height={210} rx={12} fill="#d9dde2" stroke="#9aa1a8" strokeWidth={4} transform="rotate(-18 470 520)" />
        {Array.from({length: 10}, (_, i) => <circle key={i} cx={310 + (i % 5) * 80} cy={470 + Math.floor(i / 5) * 90} r={26} fill={i < 5 ? '#aab0b8' : '#fafafa'} stroke="#a4abb2" strokeWidth={3} transform="rotate(-18 470 520)" />)}
        {Array.from({length: 18}, (_, i) => <circle key={i} cx={720 + rnd(91, i) * 160} cy={560 + rnd(92, i) * 100} r={3 + rnd(93, i) * 5} fill="#f2f2f2" opacity={0.7} />)}
        <Padlock x={960} y={460} s={1.1} rot={14} />
        <rect x={1200} y={500} width={320} height={300} fill="#ece8dc" transform="rotate(8 1360 650)" />
        <g transform="rotate(8 1360 650)">
          <text x={1230} y={550} fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#2c2820">ร้านวัสดุคลองหมอก</text>
          <text x={1230} y={600} fontFamily={FONT.ui} fontSize={20} fill="#2c2820">แม่กุญแจทองเหลือง</text>
          <text x={1230} y={630} fontFamily={FONT.ui} fontSize={20} fill="#2c2820">50 มม. · 1 ตัว · 120.-</text>
          <text x={1230} y={680} fontFamily={FONT.ui} fontSize={18} fill="#6a6355">13/11/67</text>
          <rect x={1200} y={700} width={320} height={100} fill="#8fa6b8" opacity={0.25} />
        </g>
      </Svg>
    </div>
    {!receipt && <HandS x={960} y={60} rot={90} s={2} mode="open" skin={C.skinA} sleeve="#d9c9a8" />}
    <Pool x={960} y={200} rx={900} color={C.lamp} a={0.22} />
  </Macro>
);

const Timer: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#030405" at={[48, 46]} vig={0.85} inner={26} z={1.05}>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1160} fill="#1b2024" />
      <rect x={760} y={-40} width={140} height={1160} fill="#5b6066" />
      <rect x={560} y={360} width={540} height={420} rx={20} fill="#8d9298" stroke="#3a3e44" strokeWidth={10} />
      <circle cx={830} cy={540} r={120} fill="#e8e4d8" stroke="#3a3e44" strokeWidth={8} />
      {Array.from({length: 24}, (_, i) => <rect key={i} x={826} y={428} width={8} height={30} fill={i % 6 ? '#555' : C.red} transform={`rotate(${i * 15} 830 540)`} />)}
      <rect x={600} y={690} width={460} height={60} fill="#e8e1b0" />
      <text x={830} y={732} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#3a3214">ตั้งเวลา 00.00 น. · 2564</text>
      {Array.from({length: 12}, (_, i) => <ellipse key={i} cx={600 + rnd(71, i) * 500} cy={380 + rnd(72, i) * 380} rx={7} ry={11} fill="#cfe0ea" opacity={0.75} />)}
      <path d="M830 -40 V360" stroke="#1a1a1a" strokeWidth={12} />
    </Svg>
    <Pool x={830} y={120} rx={600} color={C.neon} a={0.36} />
  </Macro>
);

const Window: React.FC<{p: ShotProps; punch?: boolean}> = ({p, punch}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#030405" at={[50, 46]} vig={0.86} inner={26} z={1.05}>
      <Svg>
        <rect x={-40} y={-40} width={2000} height={1160} fill="#3a2a1d" />
        <rect x={360} y={120} width={1200} height={800} fill={punch ? '#0b0f16' : '#0d121a'} stroke="#2a1d12" strokeWidth={40} />
        <line x1={960} y1={120} x2={960} y2={920} stroke="#2a1d12" strokeWidth={30} />
        {punch && <rect x={360} y={120} width={1200} height={800} fill="#fff8e0" opacity={k > 0.3 ? 0.18 : 0.6} />}
        <path d="M1220 420 L1060 260 M1220 420 L1420 280 M1220 420 L1500 560 M1220 420 L1180 720 M1220 420 L1010 540 M1220 420 L1300 160" stroke="#cfe0ea" strokeWidth={6} opacity={0.8} />
        {!punch && <path d="M980 200 h560 M980 230 h80 M1480 200 v140" stroke={C.keyTag} strokeWidth={22} opacity={0.75} />}
        {punch && Array.from({length: 16}, (_, i) => <path key={i} d={`M${1220 + Math.cos(i) * k * 380} ${420 + Math.sin(i * 1.3) * k * 300} l${18} ${-26} l${14} ${30} Z`} fill="#dfeef6" opacity={0.85} />)}
      </Svg>
      {punch && <HandS x={1220 - (1 - Math.min(1, k * 3)) * 400} y={470} rot={-6} s={2.8} mode="fist" sleeve={C.khaki} />}
      {punch && <Svg><g transform="rotate(12 1500 760)"><Watch x={1500} y={780} s={0.42} f={0} /></g></Svg>}
      <Pool x={1220} y={420} rx={520} color={punch ? '255,250,230' : '255,236,190'} a={punch ? 0.4 : 0.32} />
    </Macro>
  );
};

const BagTop: React.FC<{p: ShotProps; seven?: boolean}> = ({p, seven}) => (
  <Macro p={p} bg="#040404" at={[50, 50]} vig={seven ? 0.5 : 0.85} inner={seven ? 40 : 26} z={1.04}>
    {seven ? <DeskTop morning lamp={[1600, 120]} /> : <WetFloor tone="#2c2620" light={[960, 160]} />}
    <Svg>
      {seven ? <>
        <rect x={-40} y={600} width={2000} height={60} fill="#6b5236" />
        {Array.from({length: 7}, (_, i) => <Padlock key={i} x={300 + i * 220} y={470} s={0.85} cut rust={i === 6 ? 0 : 0.15 + (5 - i) * 0.14} rot={-4 + (i % 3) * 3} />)}
      </> : <>
        <path d="M260 220 L1660 220 L1720 960 L200 960 Z" fill="#1a1512" stroke="#0a0806" strokeWidth={12} />
        <path d="M300 260 H1620 L1660 900 H260 Z" fill="#2a221c" />
        <rect x={360} y={320} width={560} height={420} rx={8} fill="#5f8fb4" transform="rotate(-6 640 530)" />
        <text x={640} y={430} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#f2f4f6" transform="rotate(-6 640 530)">แฟ้มประวัติคนไข้</text>
        <text x={640} y={490} textAnchor="middle" fontFamily={FONT.ui} fontWeight={600} fontSize={30} fill="#f2f4f6" transform="rotate(-6 640 530)">ภาวะสมองเสื่อม</text>
        <text x={640} y={550} textAnchor="middle" fontFamily={FONT.ui} fontWeight={600} fontSize={30} fill="#f2f4f6" transform="rotate(-6 640 530)">นายสมหมาย</text>
        <rect x={980} y={340} width={260} height={160} rx={10} fill="#e9e6dc" stroke="#9a968a" strokeWidth={4} />
        <text x={1110} y={430} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill="#a32b26">ยา</text>
        {Array.from({length: 6}, (_, i) => <Padlock key={i} x={1060 + (i % 3) * 170} y={640 + Math.floor(i / 3) * 170} s={0.55} cut rust={0.15 + i * 0.14} rot={-10 + i * 5} />)}
      </>}
    </Svg>
    {!seven && <Pool x={900} y={420} rx={760} color={C.lamp} a={0.3} />}
  </Macro>
);

const Simple: React.FC<{p: ShotProps; kind: string}> = ({p, kind}) => {
  const k = K(p);
  switch (kind) {
    case 'fm': return (
      <Macro p={p} bg="#040404" at={[50, 48]} vig={0.85} inner={26} z={1.05}>
        <Svg>
          <rect x={-40} y={-40} width={2000} height={1160} fill="#3a2a1f" />
          <rect x={360} y={260} width={1200} height={560} rx={40} fill="#6b4a32" stroke="#2a1b10" strokeWidth={12} />
          <rect x={440} y={340} width={560} height={400} rx={30} fill="#3a2a1f" />
          {Array.from({length: 12}, (_, i) => <line key={i} x1={460} y1={360 + i * 32} x2={980} y2={360 + i * 32} stroke="#2a1b10" strokeWidth={10} />)}
          <rect x={1060} y={360} width={420} height={120} rx={10} fill="#1a0c08" />
          <rect x={1080} y={380} width={380} height={80} fill="#ff4a30" opacity={0.8} />
          <line x1={1240 + Math.sin(p.f / 4) * 6} y1={372} x2={1240 + Math.sin(p.f / 4) * 6} y2={468} stroke="#111" strokeWidth={6} />
          <circle cx={1170} cy={620} r={70} fill="#2a1b10" /><circle cx={1370} cy={620} r={70} fill="#2a1b10" />
          <text x={1270} y={520} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#e8d6b8">คลองหมอก FM 98.5</text>
        </Svg>
        <Pool x={1270} y={420} rx={460} color="255,90,60" a={0.4} />
      </Macro>
    );
    case 'phone-screen': return (
      <Macro p={p} bg="#030303" at={[50, 46]} vig={0.85} inner={26} z={1.05}>
        <Svg>
          <rect x={-40} y={-40} width={2000} height={1160} fill="#101418" />
          <rect x={700} y={60} width={520} height={960} rx={60} fill="#0c0c0e" stroke="#2a2c30" strokeWidth={14} />
          <rect x={730} y={130} width={460} height={820} rx={20} fill="#18233a" />
          <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={52} fill="#eef2f8">สารวัตรธีระ</text>
          <text x={960} y={460} textAnchor="middle" fontFamily={FONT.ui} fontWeight={500} fontSize={38} fill="#ff6a5a">ไม่มีผู้รับสาย</text>
          <circle cx={960} cy={760} r={70} fill="#d23a30" />
          {Array.from({length: 14}, (_, i) => <ellipse key={i} cx={760 + rnd(61, i) * 400} cy={160 + rnd(62, i) * 760} rx={10} ry={16} fill="#cfe0ea" opacity={0.4} />)}
        </Svg>
        <HandS x={960} y={1060} rot={-90} s={2.6} mode="grip" skin={C.skinK} sleeve={C.shop} />
        <Pool x={960} y={500} rx={560} color="120,150,220" a={0.4} />
      </Macro>
    );
    case 'boots': return (
      <Macro p={p} bg="#030303" at={[50, 60]} vig={0.85} inner={26} z={1.05}>
        <WetFloor tone="#2c2620" light={[960, 120]} />
        <Svg>
          <path d="M520 -40 L1400 -40 L1360 600 L560 600 Z" fill={C.coat} />
          <path d="M560 560 L1360 560 L1380 640 L540 640 Z" fill={C.coatD} />
          {[0, 1].map(i => <path key={i} d={`M${700 + i * 320} 600 h180 v260 q120 10 160 90 h-360 Z`} fill="#121212" stroke="#000" strokeWidth={6} />)}
          <ellipse cx={1000} cy={980} rx={520} ry={60} fill="#7a90a0" opacity={0.25 + 0.15 * Math.sin(p.f / 3)} />
          {Array.from({length: 12}, (_, i) => <ellipse key={i} cx={700 + rnd(101, i) * 600} cy={620 + rnd(102, i) * 260} rx={6} ry={12} fill="#cfe0ea" opacity={0.6} />)}
        </Svg>
        <Pool x={960} y={200} rx={760} color="255,236,180" a={0.3} />
      </Macro>
    );
    case 'sleeve': return (
      <Macro p={p} bg="#030303" at={[50, 50]} vig={0.85} inner={26} z={1.05}>
        <WetFloor tone="#24211d" />
        <Svg>
          <path d="M-40 260 Q900 200 1500 420 L1460 760 Q860 620 -40 700 Z" fill={C.coat} />
          {Array.from({length: 6}, (_, i) => <path key={i} d={`M${200 + i * 200} ${300 - i * 6} q20 200 0 380`} stroke={C.coatD} strokeWidth={6} fill="none" />)}
          <path d="M1300 380 l40 60 l-30 60 l40 60 l-30 60" stroke="#e8e2d0" strokeWidth={6} fill="none" strokeDasharray="14 10" />
          <path d="M1480 430 L1560 430 L1560 760 L1460 760 Z" fill="#2b2620" />
        </Svg>
        <HandS x={1600} y={600} rot={0} s={2.4} mode="open" skin={C.skinT} sleeve={C.coat} />
        <Pool x={900} y={300} rx={700} color={C.lamp} a={0.28} />
      </Macro>
    );
    case 'scar': return (
      <Macro p={p} bg="#030303" at={[50, 46]} vig={0.86} inner={26} z={1.06}>
        <WetFloor tone="#24211d" />
        <HandS x={960} y={560} rot={-90} s={4.2} mode="open" scar />
        <Svg>{Array.from({length: 10}, (_, i) => <line key={i} x1={700 + i * 60} y1={(p.f * 14 + i * 120) % 1100} x2={690 + i * 60} y2={(p.f * 14 + i * 120) % 1100 + 60} stroke="#b8cad6" strokeWidth={3} opacity={0.5} />)}</Svg>
        <Pool x={960} y={420} rx={600} color={C.lamp} a={0.3} />
      </Macro>
    );
    case 'mic': return (
      <Macro p={p} bg="#050404" at={[50, 46]} vig={0.6} inner={36} z={1.05}>
        <DeskTop morning lamp={[1500, 200]} />
        <Svg>
          <Player x={760} y={600} s={0.7} f={p.f} count={12} />
          <path d="M1240 420 L1380 280" stroke="#1a1a1a" strokeWidth={14} />
          <rect x={1340} y={180} width={90} height={150} rx={40} fill="#2a2c30" transform="rotate(45 1385 255)" />
          <circle cx={1100} cy={370} r={16} fill="#ff3b30" />
          <Ticket x={1400} y={820} s={0.45} rot={8} />
        </Svg>
        <Pool x={1500} y={200} rx={800} color="255,236,190" a={0.3} />
      </Macro>
    );
    case 'tape-hand': return (
      <Macro p={p} bg="#050404" at={[50, 46]} vig={0.6} inner={36} z={1.05}>
        <DeskTop morning lamp={[1500, 200]} />
        <Svg><g transform={`translate(${-k * 80} 0)`}><rect x={760} y={440} width={400} height={250} rx={14} fill="#1d1f23" /><rect x={800} y={480} width={320} height={110} fill="#5a5e66" /><rect x={820} y={610} width={280} height={44} fill="#e6dfcd" /></g></Svg>
        <HandS x={600 - k * 80} y={640} rot={-10} s={2.2} mode="pinch" scar />
        <HandS x={1440} y={640} rot={190} s={2.2} mode="open" skin={C.skinT} sleeve="#c9c2b0" />
      </Macro>
    );
    case 'lever': return (
      <Macro p={p} bg="#050404" at={[48, 44]} vig={0.86} inner={26} z={1.05}>
        <Svg>
          <rect x={-40} y={-40} width={2000} height={1160} fill="#3a2a1d" />
          <rect x={-40} y={780} width={2000} height={340} fill="#2a1d12" />
          {Array.from({length: 7}, (_, i) => <g key={i}><rect x={260 + i * 220} y={i === 3 ? 260 : 300} width={46} height={540} rx={10} fill={i === 3 ? '#8d2a24' : '#5b6066'} transform={i === 3 ? 'rotate(-14 283 800)' : `rotate(${i % 2 ? 10 : -10} ${283 + i * 220} 800)`} /><rect x={240 + i * 220} y={i === 3 ? 230 : 270} width={86} height={50} rx={10} fill={i === 3 ? '#c23a30' : '#7a7f86'} transform={i === 3 ? 'rotate(-14 283 800)' : `rotate(${i % 2 ? 10 : -10} ${283 + i * 220} 800)`} /></g>)}
          <rect x={-40} y={760} width={2000} height={40} fill="#1a120b" />
        </Svg>
        <Pool x={900} y={160} rx={800} color={C.lamp} a={0.36} />
      </Macro>
    );
    case 'handover': return (
      <Macro p={p} bg="#030303" at={[50, 48]} vig={0.85} inner={26} z={1.05}>
        <Svg>
          <rect x={-40} y={-40} width={2000} height={1160} fill="#1f2a2c" />
          {Array.from({length: 26}, (_, i) => <line key={i} x1={rnd(111, i) * 1920} y1={(p.f * 18 + i * 90) % 1100 - 100} x2={rnd(111, i) * 1920 - 8} y2={(p.f * 18 + i * 90) % 1100 - 40} stroke="#b8cad6" strokeWidth={3} opacity={0.4} />)}
          <rect x={700} y={360} width={540} height={360} rx={10} fill="#5b6d58" stroke="#2c372b" strokeWidth={8} transform={`rotate(${-6 + k * 4} 970 540)`} />
          <text x={970} y={560} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#d8d0b0" transform={`rotate(${-6 + k * 4} 970 540)`}>2542</text>
        </Svg>
        <HandS x={600 + k * 60} y={600} rot={-6 + Math.sin(p.f / 2) * 2} s={2.4} mode="grip" skin={C.skinK} sleeve={C.shop} />
        <HandS x={1360 - k * 40} y={600} rot={186} s={2.4} mode="grip" scar />
        <Pool x={960} y={240} rx={800} color={C.fluo} a={0.3} />
      </Macro>
    );
    default: return null;
  }
};

const BoxIns: React.FC<{p: ShotProps; top?: boolean}> = ({p, top}) => (
  <Macro p={p} bg="#040404" at={[48, 48]} vig={0.86} inner={26} z={1.05}>
    {top ? <DeskTop lamp={[600, 240]} /> : <Svg><rect x={-40} y={-40} width={2000} height={1160} fill="#141a17" /><rect x={260} y={60} width={1400} height={1000} fill="#0a0d0c" stroke={C.locker} strokeWidth={40} /></Svg>}
    <Svg>
      <rect x={360} y={260} width={1200} height={720} rx={24} fill="#5d6268" stroke="#2c2f33" strokeWidth={12} />
      <rect x={400} y={300} width={1120} height={640} rx={14} fill="#2c2f33" />
      <Player x={720} y={560} s={0.45} f={0} count={0} spin={false} />
      <Ticket x={1180} y={480} s={0.42} rot={8} />
      <rect x={1000} y={680} width={460} height={230} rx={10} fill="#1c1a18" stroke="#000" strokeWidth={6} transform="rotate(-4 1230 795)" />
      <rect x={1000} y={790} width={460} height={14} fill="#8a8f95" transform="rotate(-4 1230 795)" />
      {!top && Array.from({length: 40}, (_, i) => <circle key={i} cx={500 + rnd(121, i) * 900} cy={100 + rnd(122, i) * 400} r={2 + rnd(123, i) * 4} fill="#d8d2c4" opacity={0.25 + 0.2 * Math.sin(p.f / 10 + i)} />)}
    </Svg>
    {!top && <Svg><path d="M-100 -100 L700 400 L900 300 Z" fill="#fff4cc" opacity={0.12} /></Svg>}
    <Pool x={top ? 640 : 760} y={top ? 300 : 360} rx={760} color="255,236,190" a={0.36} />
  </Macro>
);

const DrawerIns: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#040404" at={[50, 52]} vig={0.86} inner={26} z={1.05}>
    <Svg>
      <rect x={-40} y={-40} width={2000} height={1160} fill="#3e3a33" />
      <rect x={300} y={140} width={1320} height={760} fill="#6b7077" stroke="#3a3e44" strokeWidth={10} />
      {[340, 600].map(y => <rect key={y} x={340} y={y} width={1240} height={8} fill="#3a3e44" />)}
      <rect x={860} y={700} width={200} height={40} rx={8} fill="#c9ccd0" />
      <rect x={1100} y={690} width={60} height={70} rx={6} fill="#8a6b26" />
      {Array.from({length: 20}, (_, i) => <circle key={i} cx={1110 + rnd(131, i) * 40} cy={700 + rnd(132, i) * 50} r={3 + rnd(133, i) * 4} fill="#6e3a1c" opacity={0.6} />)}
      <ellipse cx={600} cy={960} rx={60} ry={14} fill="#9fb3c2" opacity={0.35} />
    </Svg>
    <Pool x={700} y={260} rx={800} color={C.lamp} a={0.34} />
  </Macro>
);

// ---------------------------------------------------------------- router

const pv = (C2: React.FC<any>, props: Record<string, unknown> = {}): ShotComponent => p => <C2 p={p} {...props} />;

export const VIEWS: Record<string, ShotComponent> = {
  'locker104-ins': pv(LockerDoor),
  'hasp-ins': pv(Hasp),
  'cutter-ots': pv(Hasp, {cutter: true}),
  'padlocks-ins': pv(Hasp, {pay: true}),
  'box-ins': pv(BoxIns),
  'desk-top': pv(BoxIns, {top: true}),
  'reels-ecu': pv(PlayerShot, {count: 0, ecu: 'reels'}),
  'reels-ecu2': pv(PlayerShot, {count: 40, ecu: 'reels'}),
  'cassette-ins': pv(PlayerShot, {count: 0, thumb: true}),
  'counter-ecu': pv(PlayerShot, {count: 18, ecu: 'counter'}),
  'counter-085': pv(PlayerShot, {count: 85, ecu: 'counter'}),
  'counter-164': pv(PlayerShot, {count: 164, ecu: 'counter'}),
  'sideb-ins': pv(PlayerShot, {count: 250, side: 'B', thumb: true}),
  'watch-ins': pv(WatchShot, {kind: 'hand'}),
  'two-clocks-ins': pv(WatchShot, {kind: 'two'}),
  'watch-swing-ins': pv(WatchShot, {kind: 'swing'}),
  'watch-end-ins': pv(WatchShot, {kind: 'end'}),
  'ticket-lamp-ins': pv(TicketShot, {kind: 'lamp'}),
  'ticket-ins': pv(TicketShot, {kind: 'past'}),
  'ticket-box-ins': pv(TicketShot, {kind: 'box'}),
  'photo-ins': pv(PhotoShot, {kind: 'all'}),
  'photo-ecu': pv(PhotoShot, {kind: 'pan'}),
  'photo-theera-ecu': pv(PhotoShot, {kind: 'theera'}),
  'radio-ins': pv(Board, {radio: 'on'}),
  'radio-dies-ins': pv(Board, {radio: 'dies'}),
  'memo-ins': pv(Board, {radio: 'board', read: true}),
  'clock-ecu': pv(DigitalClock),
  'platform-clock-ecu': pv(StationClock),
  'mug-ins': pv(Mug),
  'mug-cold-ins': pv(Mug, {cold: true}),
  'basket-ecu': pv(Basket),
  'diary-ins': pv(Diary),
  'diary-ecu': pv(Diary, {ecu: true}),
  'keys-ecu': pv(KeysEcu),
  'logbook-shirt-ins': pv(Logbook, {kind: 'shirt'}),
  'logbook-ins': pv(Logbook, {kind: 'page'}),
  'logbook-ecu': pv(Logbook, {kind: 'ecu'}),
  'knife-ecu': pv(Logbook, {kind: 'scrape'}),
  'name-ecu': pv(Logbook, {kind: 'name'}),
  'logbook-write-ins': pv(Logbook, {kind: 'write'}),
  'revolver-ins': pv(GunShot, {kind: 'drawer'}),
  'gun-hand-ins': pv(GunShot, {kind: 'belt'}),
  'hammer-ecu': pv(GunShot, {kind: 'hammer'}),
  'trigger-ecu': pv(GunShot, {kind: 'trigger'}),
  'gun-drop-ins': pv(GunShot, {kind: 'drop'}),
  'staple-ecu': pv(Record, {kind: 'staple'}),
  'record-ins': pv(Record, {kind: 'page'}),
  'record-ecu': pv(Record, {kind: 'ecu'}),
  'signature-ecu': pv(Record, {kind: 'sign'}),
  'record-sign-ins': pv(Record, {kind: 'signTorch'}),
  'spill-top': pv(SpillTop),
  'receipt-ecu': pv(SpillTop, {receipt: true}),
  'timer-ins': pv(Timer),
  'window-crack-ins': pv(Window),
  'punch-ins': pv(Window, {punch: true}),
  'bag-top': pv(BagTop),
  'seven-locks-ins': pv(BagTop, {seven: true}),
  'drawer-ins': pv(DrawerIns),
  'fm-ins': pv(Simple, {kind: 'fm'}),
  'phone-screen-ins': pv(Simple, {kind: 'phone-screen'}),
  'boots-ins': pv(Simple, {kind: 'boots'}),
  'sleeve-ins': pv(Simple, {kind: 'sleeve'}),
  'scar-ecu': pv(Simple, {kind: 'scar'}),
  'mic-ins': pv(Simple, {kind: 'mic'}),
  'tape-hand-ins': pv(Simple, {kind: 'tape-hand'}),
  'lever-ins': pv(Simple, {kind: 'lever'}),
  'handover-ins': pv(Simple, {kind: 'handover'}),
};

const Ins: ShotComponent = p => {
  const V = VIEWS[p.shot.view ?? ''];
  if (V) return V(p);
  return <Macro p={p} bg="#121212"><Typed x={200} y={420} size={60} color="#888">{p.shot.view}</Typed><Pen x={200} y={520} size={40} color="#666">ยังไม่ได้วาด</Pen></Macro>;
};

const Title: ShotComponent = p => {
  const a = appear(p.f, 4, 22), d = D(p);
  return (
    <AbsoluteFill style={{background: '#030405', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 1360, top: 380, width: 900, height: 420, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${C.head},.32), rgba(0,0,0,0) 70%)`, filter: 'blur(20px)', opacity: 0.6 + 0.4 * a}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 24}px)`}}>
        <div style={{fontFamily: T.title, fontSize: 176, color: T.white, lineHeight: 1.2, textShadow: '0 8px 40px rgba(0,0,0,.9)'}}>{d.title}</div>
        <div style={{marginTop: 18, fontFamily: T.title, fontSize: 70, color: '#ffd27a', textShadow: '0 4px 24px rgba(0,0,0,.9)'}}>{d.sub}</div>
        <div style={{marginTop: 60, fontFamily: T.ui, fontWeight: 500, fontSize: 30, color: '#8f897d'}}>{d.note}</div>
      </div>
      <Grain f={p.f} opacity={0.14} />
    </AbsoluteFill>
  );
};

/** the channel end card over the last picture of the film: the ticket and the watch running again, sunk */
const End: ShotComponent = p => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', inset: 0, filter: 'brightness(.42) blur(3px)'}}><WatchShot p={p} kind="end" /></div>
    <div style={{position: 'absolute', inset: 0, mixBlendMode: 'lighten'}}><EndCardScene p={p} /></div>
  </AbsoluteFill>
);

export const INS: Record<string, ShotComponent> = {ins: Ins, title: Title, endcard: End};
