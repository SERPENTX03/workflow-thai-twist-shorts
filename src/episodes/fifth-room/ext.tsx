import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {Far} from '../../kit/fx';
import {Haze} from '../../kit/depth';
import {D, K, Macro, Pool, Soft, Svg} from '../../kit/frame';
import {flicker} from '../../kit/horror';
import {Actors, C, Shot} from './cast';

// บ้านเลขที่ 5 จากซอย (brief.md → Sets): an old semi-detached house on one plane turned a little toward the camera, so its
// right end (window five, then ป้านิ่ม's half) is nearest. The windows are counted on this plane in every shot. Road in
// front, one street lamp behind the camera's left, the gate and meter pole at the fence. data.tone: day | dusk | night |
// morning. data.five: lit | off | open. The camera stands on the road (cam), at the gate, or in Rin's car (fif).

export const WIN_X = [270, 500, 730, 960, 1190];
const WIN_W = 150, WIN_Y = 340, WIN_H = 210;

const TONE: Record<string, {sky: [string, string]; wall: string; wallD: string; roof: string; road: string; win: string; veil: number}> = {
  day: {sky: ['#a8cfe6', '#e9e6d4'], wall: '#b3a78f', wallD: '#8a7f6a', roof: '#7b4a38', road: '#6b6a64', win: '#2e3a40', veil: 0},
  morning: {sky: ['#f0cfa0', '#fbeed2'], wall: '#c4b296', wallD: '#937f65', roof: '#86503a', road: '#7c7468', win: '#3a4042', veil: 0},
  dusk: {sky: ['#3b3360', '#c2795c'], wall: '#7a6c62', wallD: '#574c47', roof: '#4c2d28', road: '#403c42', win: '#1a1c24', veil: 0.28},
  night: {sky: ['#04060e', '#111a2c'], wall: '#55545a', wallD: '#33333a', roof: '#201a1c', road: '#1c1c20', win: '#07080c', veil: 0.3},
};

const Window: React.FC<{x: number; t: typeof TONE.day}> = ({x, t}) => (
  <g>
    <rect x={x - 10} y={WIN_Y - 10} width={WIN_W + 20} height={WIN_H + 20} fill={t.wallD} />
    <rect x={x} y={WIN_Y} width={WIN_W} height={WIN_H} fill={t.win} stroke={C.woodD} strokeWidth={6} />
    {/* bars and a glass reflection */}
    {[1, 2, 3, 4].map(i => <line key={i} x1={x + (i * WIN_W) / 5} y1={WIN_Y} x2={x + (i * WIN_W) / 5} y2={WIN_Y + WIN_H} stroke={C.iron} strokeWidth={5} />)}
    {[1, 2].map(i => <line key={i} x1={x} y1={WIN_Y + (i * WIN_H) / 3} x2={x + WIN_W} y2={WIN_Y + (i * WIN_H) / 3} stroke={C.iron} strokeWidth={5} />)}
    <rect x={x - 14} y={WIN_Y + WIN_H + 8} width={WIN_W + 28} height={12} fill={t.wall} stroke={t.wallD} strokeWidth={2} />
  </g>
);

/** window five: boards nailed across. Light comes through the gaps when someone is inside. */
const FifthWindow: React.FC<{x: number; t: typeof TONE.day; five: string; a: number}> = ({x, t, five, a}) => {
  if (five === 'open') return <Window x={x} t={{...t, win: '#3c3226'}} />;
  const n = 5, bh = WIN_H / n;
  return (
    <g>
      <rect x={x - 10} y={WIN_Y - 10} width={WIN_W + 20} height={WIN_H + 20} fill={t.wallD} />
      <rect x={x} y={WIN_Y} width={WIN_W} height={WIN_H} fill={five === 'lit' ? `rgba(255,214,120,${a})` : '#040405'} />
      {Array.from({length: n}, (_, i) => <rect key={i} x={x - 8} y={WIN_Y + i * bh + 5} width={WIN_W + 16} height={bh - 14} fill={t === TONE.day || t === TONE.morning ? C.wood : '#2a1f16'} stroke={C.woodD} strokeWidth={2} />)}
      {Array.from({length: n}, (_, i) => [x + 6, x + WIN_W - 6].map(px => <circle key={`${i}${px}`} cx={px} cy={WIN_Y + i * bh + 16} r={3} fill="#111" />))}
      <rect x={x - 14} y={WIN_Y + WIN_H + 8} width={WIN_W + 28} height={12} fill={t.wall} stroke={t.wallD} strokeWidth={2} />
    </g>
  );
};

/** The whole street front drawn flat; Plane turns it. World px: wall x 170…1420, ground at y 760. */
const Front: React.FC<{tone: string; five: string; a: number; f: number}> = ({tone, five, a, f}) => {
  const t = TONE[tone];
  const night = tone === 'night' || tone === 'dusk';
  return (
    <svg width={3000} height={1400} viewBox="-500 -200 3000 1400" style={{position: 'absolute', left: -500, top: -200, overflow: 'visible'}}>
      {/* the street beyond the left end, then ป้านิ่ม's half at the right */}
      {[-470, -210].map((x, i) => <g key={x}><rect x={x} y={300 - i * 20} width={240} height={470} fill={t.wallD} /><path d={`M${x - 20} ${300 - i * 20} L${x + 120} ${180 - i * 20} L${x + 260} ${300 - i * 20} Z`} fill={t.roof} /></g>)}
      <path d="M1420 250 L1950 250 L2030 340 L1420 340 Z" fill={t.roof} stroke={C.roofD} strokeWidth={4} />
      <rect x={1420} y={330} width={560} height={440} fill={night ? '#3f3a38' : '#a9a690'} />
      <rect x={1560} y={390} width={200} height={190} fill={night ? '#e9a24e' : '#3b3f3c'} stroke={C.woodD} strokeWidth={8} />
      <line x1={1660} y1={390} x2={1660} y2={580} stroke={C.woodD} strokeWidth={6} />
      <rect x={1830} y={470} width={120} height={300} fill="#2e2118" stroke="#17100b" strokeWidth={5} />
      {/* the roof over both, one long hip, with the party wall rising at 1420 */}
      <path d="M130 250 L290 110 L1300 110 L1440 250 Z" fill={t.roof} stroke={C.roofD} strokeWidth={5} />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${160 + i * 142} 250 L${300 + i * 112} 112`} stroke={C.roofD} strokeWidth={3} opacity={0.6} />)}
      <rect x={1416} y={230} width={14} height={540} fill={C.plasterD} />
      {/* wall, stains from the eaves, two courses of damp */}
      <rect x={170} y={245} width={1250} height={525} fill={t.wall} />
      <rect x={170} y={245} width={1250} height={26} fill={t.wallD} />
      {Array.from({length: 22}, (_, i) => <rect key={i} x={190 + i * 56 + rnd(11, i) * 20} y={268} width={8 + rnd(12, i) * 14} height={40 + rnd(13, i) * 120} fill={t.wallD} opacity={0.32} />)}
      <rect x={170} y={700} width={1250} height={70} fill={t.wallD} opacity={0.55} />
      {WIN_X.slice(0, 4).map(x => <Window key={x} x={x} t={t} />)}
      <FifthWindow x={WIN_X[4]} t={t} five={five} a={a} />
      {/* the fence: low wall, iron rails, chained gate at left, meter pole beside it, spirit house at right */}
      <rect x={-500} y={700} width={3000} height={180} fill={night ? '#201e1f' : '#7f7663'} />
      <rect x={-500} y={690} width={3000} height={18} fill={night ? '#35312f' : '#9b917a'} />
      {Array.from({length: 62}, (_, i) => <rect key={i} x={-480 + i * 48} y={590} width={7} height={106} fill={C.iron} />)}
      <rect x={-500} y={584} width={3000} height={10} fill={C.iron} />
      <rect x={70} y={520} width={230} height={362} fill={night ? '#17171a' : '#3a3c3f'} stroke={C.iron} strokeWidth={6} />
      {Array.from({length: 8}, (_, i) => <rect key={i} x={84 + i * 28} y={530} width={7} height={344} fill={C.iron} />)}
      <path d="M170 700 q14 22 32 0 q14 22 32 0" stroke="#7f8080" strokeWidth={7} fill="none" />
      {/* bank notice on the gate */}
      <rect x={118} y={590} width={140} height={84} fill={night ? '#a59f8c' : '#e5dfca'} stroke="#7a2a24" strokeWidth={5} transform="rotate(-3 188 632)" />
      <text x={188} y={640} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={22} fill="#8a2a24" transform="rotate(-3 188 632)">ทรัพย์รอขาย</text>
      {/* meter pole */}
      <rect x={20} y={200} width={26} height={690} fill="#55534d" stroke="#2f2e2a" strokeWidth={3} />
      <rect x={-4} y={500} width={76} height={110} rx={6} fill="#6c6c64" stroke="#2f2e2a" strokeWidth={4} />
      <circle cx={34} cy={550} r={26} fill={night ? '#3d4348' : '#c8d1cc'} stroke="#2f2e2a" strokeWidth={4} />
      <path d="M34 200 Q120 300 300 250 L1200 240" stroke="#111" strokeWidth={4} fill="none" />
      {/* the spirit house on its post by the fence */}
      <g transform="translate(140 0)"><rect x={1330} y={590} width={18} height={150} fill="#c9bfa8" />
      <path d="M1298 540 h82 v50 h-82 Z" fill={night ? '#a78a4a' : '#d7b65c'} stroke="#59421a" strokeWidth={3} />
      <path d="M1284 544 L1339 500 L1394 544 Z" fill="#a43f2f" stroke="#59421a" strokeWidth={3} />
      <rect x={1290} y={586} width={98} height={8} fill="#8a6f33" /></g>
      {/* a tree on ป้านิ่ม's side, breaking the roof line */}
      <path d="M1780 760 V560" stroke={C.woodD} strokeWidth={22} />
      {Array.from({length: 26}, (_, i) => <ellipse key={i} cx={1660 + rnd(21, i) * 260} cy={330 + rnd(22, i) * 280} rx={40 + rnd(23, i) * 30} ry={18 + rnd(24, i) * 14} fill={night ? '#0e1712' : '#4d6d3f'} opacity={0.92} />)}
    </svg>
  );
};

/** Sky, the turned front, the road running to its vanishing point at the far left, street lamp pool, haze */
export const Street: React.FC<{p: ShotProps; tone?: string; five?: string}> = ({p, tone: tone0, five: five0}) => {
  const d = D(p);
  const tone = tone0 ?? d.tone ?? 'night';
  const five = five0 ?? d.five ?? (tone === 'night' ? 'lit' : 'off');
  const t = TONE[tone];
  const a = five === 'lit' ? 0.92 * flicker(p.f, 7, 0.08) : 0;
  const lamp = tone === 'night' || tone === 'dusk';
  const sx = lamp ? 1 : 0;
  return (
    <>
      <div style={{position: 'absolute', left: -1200, top: -700, width: 4300, height: 1600, background: `linear-gradient(${t.sky[0]}, ${t.sky[1]})`}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'perspective(2400px) rotateY(-11deg)', transformOrigin: '0px 540px'}}>
        <Front tone={tone} five={five} a={a} f={p.f} />
        {t.veil > 0 && <div style={{position: 'absolute', left: -500, top: -200, width: 3000, height: 1100, background: `rgba(4,6,14,${t.veil})`}} />}
        {five === 'lit' && <svg width={3000} height={1400} viewBox="-500 -200 3000 1400" style={{position: 'absolute', left: -500, top: -200, overflow: 'visible'}}>
          {Array.from({length: 6}, (_, i) => <rect key={i} x={WIN_X[4]} y={WIN_Y + (i * WIN_H) / 5 - 9} width={WIN_W} height={14} fill="#ffd98a" opacity={a} />)}
        </svg>}
      </div>
      {/* the road: seams run to a point past the left end of the street */}
      <svg width={4000} height={1400} viewBox="-1000 0 4000 1400" style={{position: 'absolute', left: -1000, top: 0, overflow: 'visible'}}>
        <rect x={-1000} y={850} width={4000} height={700} fill={t.road} />
        {[-500, -60, 500, 1200, 2100, 3000].map((x, i) => <line key={i} x1={-260} y1={820} x2={x} y2={1500} stroke="#000" strokeOpacity={0.28} strokeWidth={3 + i} />)}
        <path d="M-1000 880 L3000 860" stroke="#000" strokeOpacity={0.4} strokeWidth={10} />
      </svg>
      {lamp && <>
        <Pool x={-120} y={900} rx={1500} ry={420} color="255,176,96" a={0.55} />
        <Pool x={120} y={560} rx={640} ry={520} color="255,176,96" a={0.2} />
      </>}
      {tone !== 'day' && tone !== 'morning' && <Haze y={700} h={220} f={p.f} a={0.1} />}
      {tone === 'morning' && <Pool x={-300} y={500} rx={1600} color="255,216,150" a={0.42} />}
      {tone === 'day' && <Pool x={1900} y={200} rx={1500} color="255,246,214" a={0.3} />}
      {five === 'lit' && <>
        <Pool x={WINDOW5.x} y={WINDOW5.y} rx={300} ry={270} color="255,190,90" a={0.34 * flicker(p.f, 7, 0.08)} />
      </>}
    </>
  );
};

/** where window five lands on screen once the plane is turned (world px at cam z 1) */
export const WINDOW5 = {x: 1424, y: 436};

/** the windscreen of Rin's car from the driver's seat: drawn in frame px over the street */
const Windscreen: React.FC<{night?: boolean}> = ({night = true}) => (
  <Svg>
    <path d="M-40 -40 H1960 V60 Q960 20 -40 90 Z" fill="#050507" />
    <path d="M-40 -40 H150 L300 1120 H-40 Z" fill="#07080b" />
    <path d="M1960 -40 H1760 L1600 1120 H1960 Z" fill="#07080b" />
    <path d="M-40 1120 V880 Q960 800 1960 880 V1120 Z" fill="#050507" />
    <path d="M240 880 Q960 806 1660 880" stroke={night ? 'rgba(255,190,120,.25)' : 'rgba(255,255,255,.2)'} strokeWidth={5} fill="none" />
    <rect x={1120} y={24} width={290} height={84} rx={22} fill="#141518" stroke="#000" strokeWidth={6} />
    <path d="M480 862 Q700 720 1040 690" stroke="#07080a" strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M420 0 L260 880" stroke="rgba(255,255,255,.05)" strokeWidth={70} />
  </Svg>
);

/** gate seen from the road surface: chain, notice, the dark house standing over it */
const GateLow: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#050509" at={[46, 40]} vig={0.82} inner={30} z={1.05} ox={960} oy={700}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#05060c, #161b2a 60%, #0f0f13)'}} />
    <Svg>
      <path d="M-40 440 L120 180 H1800 L1960 440 Z" fill="#18181c" />
      <rect x={-40} y={438} width={2000} height={380} fill="#252529" />
      {[140, 520, 900, 1280, 1660].map(x => <rect key={x} x={x} y={500} width={190} height={210} fill={x === 1660 ? '#0a0805' : '#07080c'} stroke="#000" strokeWidth={6} />)}
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={1652} y={508 + i * 42} width={206} height={32} fill="#1d1610" />)}
      {[0, 1, 2, 3].map(i => <rect key={i} x={1660} y={539 + i * 42} width={190} height={3} fill="#ffd27a" opacity={0.8} />)}
    </Svg>
    <div style={{position: 'absolute', inset: 0, background: 'rgba(3,4,10,.34)'}} />
    <Svg>
      {/* the gate, huge from down here */}
      <rect x={300} y={140} width={1240} height={960} fill="rgba(0,0,0,.28)" />
      {Array.from({length: 13}, (_, i) => <rect key={i} x={320 + i * 100} y={110} width={20} height={1000} fill="#0d0e12" stroke="#2a2c33" strokeWidth={2} />)}
      <rect x={290} y={120} width={1260} height={30} fill="#16171c" />
      <rect x={290} y={830} width={1260} height={30} fill="#16171c" />
      <g transform="translate(960 560)">
        {Array.from({length: 7}, (_, i) => <ellipse key={i} cx={-180 + i * 60} cy={Math.sin(i) * 12} rx={38} ry={18} fill="none" stroke="#9a9a96" strokeWidth={9} />)}
        <rect x={20} y={-10} width={90} height={80} rx={8} fill="#5d5a4e" stroke="#2a2925" strokeWidth={5} />
      </g>
      <g transform="translate(560 420) rotate(-4)">
        <rect x={-170} y={-100} width={340} height={190} fill="#c3bba5" stroke="#6e2a24" strokeWidth={8} />
        <text x={0} y={-30} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={38} fill="#8a2a24">ทรัพย์รอการขาย</text>
        <rect x={-96} y={2} width={192} height={10} fill="#8d8675" /><rect x={-96} y={28} width={150} height={10} fill="#8d8675" />
      </g>
    </Svg>
    <Pool x={420} y={1040} rx={900} ry={340} color="255,176,96" a={0.42} />
    <Svg>
      {Array.from({length: 20}, (_, i) => <rect key={i} x={rnd(71, i) * 1920} y={1000 + rnd(72, i) * 60} width={18 + rnd(73, i) * 40} height={5} fill="#000" opacity={0.5} />)}
    </Svg>
  </Macro>
);

/** window five filling the frame: the boards, the nails, light in the gaps, something passing behind them */
export const Five: React.FC<{p: ShotProps; off?: boolean; ecu?: boolean; pass?: boolean}> = ({p, off, ecu, pass}) => {
  const k = K(p);
  const a = off ? 0 : 1 * flicker(p.f, 7, 0.08);
  const dip = pass ? Math.max(0, 1 - Math.abs(k - 0.58) * 6) : 0;
  const n = 5, h = 170;
  return (
    <Macro p={p} bg="#030305" at={[50, 42]} vig={0.8} inner={off ? 12 : 26} z={ecu ? 1.08 : 1.14} ox={960} oy={430}>
      <div style={{position: 'absolute', inset: 0, background: '#2f2e33'}} />
      <div style={{position: 'absolute', inset: 0, background: 'rgba(3,4,10,.55)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: ecu ? 'scale(1.7)' : 'scale(.68)', transformOrigin: ecu ? '960px 300px' : '960px 400px'}}>
      <Svg>
        <rect x={150} y={-30} width={1620} height={930} fill="#1e1d20" />
        <rect x={240} y={20} width={1440} height={850} fill={off ? '#020203' : `rgb(${255 * a} ${208 * a} ${118 * a})`} />
        {pass && <rect x={560 + k * 500} y={-20} width={420} height={950} fill="#020203" opacity={dip} style={{filter: 'blur(16px)'}} />}
        {Array.from({length: n}, (_, i) => {
          const y = 20 + i * h;
          return (
            <g key={i}>
              <rect x={130} y={y + 8} width={1660} height={h - 22} fill="#2c2017" stroke="#100b07" strokeWidth={5} />
              {Array.from({length: 7}, (_, j) => <path key={j} d={`M${160 + j * 240} ${y + 30 + rnd(31, i + j) * 60} q120 ${-14 + rnd(32, i + j) * 28} 240 0`} stroke="#3e2f22" strokeWidth={4} fill="none" />)}
              {[182, 1738].map(x => <g key={x}><circle cx={x} cy={y + 40} r={11} fill="#0c0c0e" /><circle cx={x - 3} cy={y + 37} r={3} fill="#55535a" /></g>)}
            </g>
          );
        })}
        {!ecu && <rect x={100} y={880} width={1720} height={40} fill="#3a3934" stroke="#17160f" strokeWidth={4} />}
      </Svg>
      </div>
      {!off && <>
        <Pool x={960} y={430} rx={900} ry={460} color="255,206,110" a={0.34 * a} />
        <Svg>{Array.from({length: 30}, (_, i) => <circle key={i} cx={260 + rnd(41, i) * 1400} cy={40 + rnd(42, i) * 820} r={2 + rnd(43, i) * 3} fill="#ffe7b0" opacity={0.5 + 0.3 * Math.sin(p.f / 12 + i)} />)}</Svg>
      </>}
      {off && <Pool x={200} y={760} rx={700} ry={280} color="255,176,96" a={0.16} />}
    </Macro>
  );
};

const Ext: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'gate-low') return <GateLow p={p} />;
  if (v === 'window5-ecu') return <Five p={p} ecu pass />;
  if (v === 'window5-close' || v === 'window5-close2') return <Five p={p} pass={v === 'window5-close2'} />;
  if (v === 'window5-dark-ecu') return <Five p={p} off ecu />;
  const glass = v === 'windows-fif' || v === 'windows-fif-mirror' || v === 'windows-off-fif';
  return <Shot p={p} fore={glass ? <Windscreen /> : undefined} foreBlur={glass ? 3 : undefined} foreDark={glass ? 0.8 : undefined} foreK={glass ? 0 : undefined} world={<>
    <Soft p={p}><Street p={p} /></Soft>
    <Actors p={p} />
    {d.car && (() => { const [x, y] = d.car as number[], day = d.tone === 'day' || d.tone === 'morning'; const body = day ? '#6f7478' : '#101116', glass = day ? '#2c3438' : '#05060a'; return <Svg>
      <ellipse cx={x} cy={y + 4} rx={320} ry={22} fill="#000" opacity={0.45} />
      <path d={`M${x - 300} ${y - 20} q6 -70 90 -84 l76 -74 q14 -12 34 -12 h170 q22 0 38 14 l74 72 q96 10 118 84 v20 h-600 Z`} fill={body} stroke="#000" strokeOpacity={0.5} strokeWidth={3} />
      <path d={`M${x - 186} ${y - 104} l60 -58 q10 -8 22 -8 h70 v66 Z M${x - 20} ${y - 170} h78 q14 0 26 10 l58 56 h-162 Z`} fill={glass} />
      {[x - 170, x + 170].map(w => <g key={w}><circle cx={w} cy={y - 2} r={46} fill="#0a0a0c" /><circle cx={w} cy={y - 2} r={20} fill={day ? '#9a9c9e' : '#2a2c30'} /></g>)}
      <rect x={x + 276} y={y - 58} width={24} height={16} fill="#e0242a" opacity={0.85} />
    </Svg>; })()}
    {d.far && <Far blur={1} dim={0.8}><Actors p={p} cast={d.far} /></Far>}
  </>} />;
};

export const EXT: Record<string, ShotComponent> = {ext: Ext};
