import React from 'react';
import {rnd} from '../engine/anim';
import {full} from './world';
import {Haze} from './depth';

// สุสานเก่าท้ายซอย (from rear-cam, shared): a gravel road running into the fog between old Thai graves, the cemetery
// gate arch, and the octagonal sala with its round marble table. Built in depth around one vanishing point so the
// camera can stand high above the trees, low on the gravel, or behind the gate.
//
//   <CemeteryRoad f={f} tone="night" horizon={470} fog />          // road + graves + tamarinds, VP (vx, horizon)
//   <CemeteryGate x={960} y={930} s={1} />                          // the arch, drawn in front of the road
//   <Sala8 x={960} y={760} s={1} box="placed" />                    // the pavilion, table at its centre
//   <Grave x y s />  · <Tamarind x y s />  · <Headlight x y angle len />

export type CemTone = 'night' | 'day' | 'dawn';

const sky = (t: CemTone) => t === 'day' ? 'linear-gradient(#9cc0dc, #e6eef0)' : t === 'dawn' ? 'linear-gradient(#2f3d62, #9c8a98 62%, #e6b48e)' : 'linear-gradient(#020306, #070b16 55%, #0e1424)';

/** a Thai grave: a small whitewashed chedi on a plinth, leaning a little; `ink` = silhouette only */
export const Grave: React.FC<{x: number; y: number; s?: number; tone?: CemTone; lean?: number; kind?: number; ink?: boolean}> = ({x, y, s = 1, tone = 'night', lean = 0, kind = 0, ink}) => {
  const lit = tone === 'day' ? '#d8d2c4' : tone === 'dawn' ? '#8c8494' : '#262a30';
  const dark = tone === 'day' ? '#a9a294' : tone === 'dawn' ? '#5a5462' : '#14171b';
  const c = ink ? '#05060a' : lit, d = ink ? '#05060a' : dark;
  return (
    <svg width={120 * s} height={200 * s} viewBox="0 0 120 200" style={{position: 'absolute', left: x - 60 * s, top: y - 200 * s, overflow: 'visible',
      transform: `rotate(${lean}deg)`, transformOrigin: '50% 100%'}}>
      <rect x="10" y="150" width="100" height="50" fill={d} />
      <rect x="16" y="140" width="88" height="16" fill={c} />
      {kind % 3 === 0 && <path d="M30 140 L30 96 Q60 70 90 96 L90 140 Z M44 96 Q60 40 76 96 Z M58 60 L60 10 L62 60 Z" fill={c} />}
      {kind % 3 === 1 && <path d="M26 140 L34 70 L86 70 L94 140 Z M40 70 Q60 30 80 70 Z" fill={c} />}
      {kind % 3 === 2 && <rect x="34" y="70" width="52" height="70" rx="26" fill={c} />}
      <rect x="44" y="104" width="32" height="24" fill={d} opacity=".7" />
    </svg>
  );
};

/** an old tamarind: a dark crown of lobes on a twisted trunk */
export const Tamarind: React.FC<{x: number; y: number; s?: number; tone?: CemTone; seed?: number}> = ({x, y, s = 1, tone = 'night', seed = 1}) => {
  const c = tone === 'day' ? '#3e5a38' : tone === 'dawn' ? '#2a2a36' : '#05070a';
  const t = tone === 'day' ? '#4a3a2a' : '#06070a';
  return (
    <svg width={700 * s} height={800 * s} viewBox="0 0 700 800" style={{position: 'absolute', left: x - 350 * s, top: y - 800 * s, overflow: 'visible'}}>
      <path d="M330 800 Q310 600 350 470 Q300 400 250 380 M350 470 Q420 400 480 390" stroke={t} strokeWidth="46" fill="none" strokeLinecap="round" />
      {Array.from({length: 11}, (_, i) => (
        <circle key={i} cx={130 + rnd(seed, i) * 440} cy={120 + rnd(seed + 1, i) * 300} r={90 + rnd(seed + 2, i) * 70} fill={c} />
      ))}
    </svg>
  );
};

/** a headlight cone in the fog from (x, y) toward `angle` degrees (0 = right) */
export const Headlight: React.FC<{x: number; y: number; angle?: number; len?: number; spread?: number; a?: number}> = ({x, y, angle = 0, len = 900, spread = 22, a = 0.42}) => (
  <div style={{position: 'absolute', left: x, top: y - len, width: len, height: len * 2, transformOrigin: '0 50%', transform: `rotate(${angle}deg)`, pointerEvents: 'none', mixBlendMode: 'screen',
    background: `linear-gradient(90deg, rgba(255,244,205,${a}), rgba(255,244,205,0))`,
    clipPath: `polygon(0 49.6%, 100% ${50 - spread}%, 100% ${50 + spread}%, 0 50.4%)`}}>
  </div>
);

/** the gravel road into the cemetery: VP at (vx, horizon), graves both sides shrinking toward it, tamarinds, fog */
export const CemeteryRoad: React.FC<{f: number; tone?: CemTone; horizon?: number; vx?: number; fog?: boolean | 'thick'; graves?: boolean; road?: boolean}> = ({
  f, tone = 'night', horizon = 470, vx = 1100, fog = true, graves = true, road = true,
}) => {
  const night = tone !== 'day';
  const ground = tone === 'day' ? 'linear-gradient(#8a8a6a, #6f6a52)' : tone === 'dawn' ? 'linear-gradient(#3a3a44, #24242c)' : 'linear-gradient(#08090c, #121315)';
  const roadC = tone === 'day' ? '#b8aa8a' : tone === 'dawn' ? '#5a5458' : '#24221f';
  // graves along both verges: depth t 0 (horizon) .. 1 (near)
  const rows = Array.from({length: 26}, (_, i) => {
    const t = 0.08 + (i / 26) ** 1.4 * 1.05;
    const y = horizon + (1250 - horizon) * t;
    const side = i % 2 ? 1 : -1;
    const x = vx + side * (90 + 1300 * t) + (rnd(7, i) - 0.5) * 160 * t;
    return {x, y, s: 0.18 + 1.5 * t, lean: (rnd(8, i) - 0.5) * 14, kind: Math.floor(rnd(9, i) * 3)};
  });
  return (
    <>
      <div style={full(sky(tone))} />
      {tone !== 'day' && <div style={{position: 'absolute', left: 1500, top: 120, width: 70, height: 70, borderRadius: '50%', background: 'rgba(220,230,255,.18)', boxShadow: '0 0 80px 30px rgba(180,200,255,.08)'}} />}
      <Tamarind x={380} y={horizon + 60} s={0.9} tone={tone} seed={3} />
      <Tamarind x={1700} y={horizon + 40} s={1.1} tone={tone} seed={5} />
      <Tamarind x={1050} y={horizon + 10} s={0.45} tone={tone} seed={9} />
      <div style={{position: 'absolute', left: -700, top: horizon, width: 3320, height: 1600, background: ground}} />
      {road && (
        <svg width={3320} height={1100} viewBox={`-700 ${horizon} 3320 1100`} style={{position: 'absolute', left: -700, top: horizon, pointerEvents: 'none'}}>
          <polygon points={`${vx - 30},${horizon} ${vx + 30},${horizon} ${vx + 1500},${horizon + 1100} ${vx - 1400},${horizon + 1100}`} fill={roadC} />
          {/* tyre ruts + gravel */}
          {[-0.35, 0.35].map(k => <line key={k} x1={vx + k * 30} y1={horizon} x2={vx + k * 1500} y2={horizon + 1100} stroke="rgba(0,0,0,.35)" strokeWidth="24" />)}
          {Array.from({length: 160}, (_, i) => {
            const t = rnd(11, i), y = horizon + 1100 * t * t, w = (vx + 1500 - (vx - 1400)) * t * t;
            return <circle key={i} cx={vx - 1400 * t * t + rnd(12, i) * w * 0.98} cy={y} r={1 + 5 * t * t} fill={night ? 'rgba(120,110,95,.35)' : 'rgba(90,80,60,.4)'} />;
          })}
        </svg>
      )}
      {graves && rows.map((r, i) => <Grave key={i} x={r.x} y={r.y} s={r.s} tone={tone} lean={r.lean} kind={r.kind} />)}
      {fog && <Haze y={horizon - 120} h={fog === 'thick' ? 520 : 340} f={f} a={fog === 'thick' ? 0.32 : 0.2} color={tone === 'day' ? '245,245,240' : '170,180,200'} />}
      {fog && <Haze y={horizon + 160} h={260} f={f} a={fog === 'thick' ? 0.22 : 0.12} color={tone === 'day' ? '245,245,240' : '170,180,200'} seed={4} drift={0.6} />}
    </>
  );
};

/** the cemetery gate: two whitewashed piers and a curved lintel with a name board; `s` scales from a 960 px wide arch */
export const CemeteryGate: React.FC<{x: number; y: number; s?: number; tone?: CemTone; ink?: boolean; aged?: boolean}> = ({x, y, s = 1, tone = 'night', ink, aged}) => {
  const c = ink ? '#030405' : tone === 'day' ? '#cfc8b6' : '#2a2c30';
  const d = ink ? '#030405' : tone === 'day' ? '#9a917e' : '#16181b';
  return (
    <svg width={960 * s} height={900 * s} viewBox="0 0 960 900" style={{position: 'absolute', left: x - 480 * s, top: y - 900 * s, overflow: 'visible'}}>
      <rect x="40" y="200" width="150" height="700" fill={c} stroke={d} strokeWidth="8" />
      <rect x="770" y="200" width="150" height="700" fill={c} stroke={d} strokeWidth="8" />
      <path d="M20 220 Q480 20 940 220 L940 300 Q480 110 20 300 Z" fill={c} stroke={d} strokeWidth="8" />
      <rect x="360" y="120" width="240" height="70" rx="6" fill={d} />
      {!ink && <text x="480" y="168" textAnchor="middle" fontSize="40" fontFamily="Plex Thai, sans-serif" fill={tone === 'day' ? '#e8e2d2' : '#5a5e66'}>สุสานซอย ๑๑</text>}
      {[0, 1].map(i => <path key={i} d={`M${i ? 790 : 60} 240 h110 M${i ? 790 : 60} 320 h110`} stroke={d} strokeWidth="6" />)}
      {/* water stains running down the piers */}
      {[70, 120, 800, 860].map(xx => <path key={xx} d={`M${xx} 300 v${180 + (xx % 90)}`} stroke="rgba(0,0,0,.28)" strokeWidth="14" />)}
      {/* what daylight shows: cracks through the render, moss climbing the piers from the ground */}
      {aged && !ink && (
        <>
          <path d="M150 260 l-30 90 l24 60 l-40 120 M820 420 l30 70 l-26 50 l34 90 M380 190 l40 40 l-14 30" stroke="#4a4238" strokeWidth="5" fill="none" />
          {[[40, 700], [770, 680]].map(([px, py]) => <path key={px} d={`M${px} 900 L${px} ${py} Q${px + 40} ${py - 60} ${px + 80} ${py + 30} Q${px + 120} ${py - 30} ${px + 150} ${py + 60} L${px + 150} 900 Z`} fill="#5a6a3a" opacity=".75" />)}
        </>
      )}
    </svg>
  );
};

/** a roadside memorial for someone killed on the road: a wooden board on a post, a name in paint, a marigold garland
 *  (dried brown, or fresh orange), three incense sticks. 160 px wide board at s = 1 (≈ 50 cm), post ≈ 110 cm. */
export const RoadsideMemorial: React.FC<{x: number; y: number; s?: number; tone?: CemTone; fresh?: boolean; name?: string}> = ({x, y, s = 1, tone = 'day', fresh, name = 'ต้อม'}) => {
  const w = tone === 'day' ? '#9a7a54' : tone === 'dawn' ? '#5a4a40' : '#2a2016';
  return (
    <svg width={220 * s} height={360 * s} viewBox="0 0 220 360" style={{position: 'absolute', left: x - 110 * s, top: y - 340 * s, overflow: 'visible'}}>
      <ellipse cx="110" cy="340" rx="60" ry="8" fill="rgba(0,0,0,.3)" />
      <rect x="102" y="110" width="16" height="232" fill={tone === 'day' ? '#6a5032' : '#1a140e'} />
      <rect x="30" y="20" width="160" height="96" rx="4" fill={w} stroke="#2a1c10" strokeWidth="4" />
      <text x="110" y="70" textAnchor="middle" fontSize="30" fontWeight="700" fill="#2a1c10" opacity={tone === 'day' ? 0.8 : 0.3} fontFamily="Plex Thai, sans-serif">{name}</text>
      <path d="M50 92 h120" stroke="#2a1c10" strokeWidth="3" opacity=".5" />
      {Array.from({length: 11}, (_, i) => {
        const a = (i / 10) * Math.PI;
        return <circle key={i} cx={110 + Math.cos(a) * 64} cy={112 + Math.sin(a) * 34} r="9" fill={fresh ? '#f39c12' : '#6a4a22'} stroke={fresh ? '#c87a0a' : '#3a2810'} strokeWidth="2" />;
      })}
      {[96, 106, 116].map(ix => <path key={ix} d={`M${ix} 342 l${(ix - 106) / 3} -60`} stroke="#a86a3a" strokeWidth="2.5" />)}
    </svg>
  );
};

/** the octagonal sala seen from the road: tiered tile roof, five of its eight pillars, steps, and the round marble
 *  table at the centre. `box` = none | placed | open (lid lifted, gold glint) | can (the cold can of CH10).
 *  `table` = [x, y] of the table top centre in world px is returned by salaTable(x, y, s). */
export const salaTable = (x: number, y: number, s = 1) => ({x, y: y - 210 * s});
export const Sala8: React.FC<{x: number; y: number; s?: number; tone?: CemTone; box?: 'none' | 'placed' | 'open' | 'can'; lit?: number; ink?: boolean}> = ({
  x, y, s = 1, tone = 'night', box = 'none', lit = 0, ink,
}) => {
  const night = tone !== 'day';
  const roof = ink ? '#030405' : tone === 'day' ? '#7a3a2a' : '#1a1012';
  const roofD = ink ? '#030405' : tone === 'day' ? '#5a2a1e' : '#0c0809';
  const col = ink ? '#030405' : tone === 'day' ? '#e4ded0' : '#3a3c40';
  const floor = ink ? '#030405' : tone === 'day' ? '#cfc6b2' : '#2a2a2c';
  return (
    <svg width={1400 * s} height={1000 * s} viewBox="0 0 1400 1000" style={{position: 'absolute', left: x - 700 * s, top: y - 900 * s, overflow: 'visible'}}>
      {/* plinth + steps */}
      <polygon points="180,820 1220,820 1300,900 100,900" fill={floor} stroke="#0a0a0b" strokeWidth="6" />
      <rect x="520" y="900" width="360" height="40" fill={floor} stroke="#0a0a0b" strokeWidth="5" />
      <rect x="560" y="940" width="280" height="40" fill={floor} stroke="#0a0a0b" strokeWidth="5" />
      {/* pillars: back three thinner and darker, front two near the camera */}
      {[[360, 0.75], [700, 0.7], [1040, 0.75]].map(([cx, k]) => <rect key={cx} x={cx - 18} y="330" width="36" height="490" fill={col} opacity={k} />)}
      {[[230, 1], [1170, 1]].map(([cx]) => <rect key={cx} x={cx - 28} y="320" width="56" height="510" fill={col} stroke="#0a0a0b" strokeWidth="5" />)}
      {/* the marble table: a round top on a pedestal */}
      <ellipse cx="700" cy="690" rx="190" ry="44" fill={ink ? '#030405' : night ? '#6c6e72' : '#ecebe6'} stroke="#0a0a0b" strokeWidth="5" />
      <ellipse cx="700" cy="682" rx="170" ry="34" fill={ink ? '#030405' : night ? '#7d8084' : '#f6f5f1'} />
      <path d="M660 730 L640 820 L760 820 L740 730 Z" fill={ink ? '#030405' : night ? '#4a4c50' : '#cfcdc6'} />
      {!ink && [0, 1, 2].map(i => <path key={i} d={`M${590 + i * 70} 676 q20 10 40 0`} stroke="rgba(120,90,60,.35)" strokeWidth="5" fill="none" />)}
      {box === 'placed' || box === 'open' ? (
        <g transform="translate(640 600)">
          <rect x="0" y="20" width="120" height="70" rx="6" fill="#f3f0e8" stroke="#a8a294" strokeWidth="3" />
          {[0, 1, 2].map(i => <rect key={i} x={22 + i * 32} y="18" width="12" height="74" fill="#0d0d0d" />)}
          {box === 'open' && <><path d="M0 22 L120 22 L126 2 L6 0 Z" fill="#f3f0e8" stroke="#a8a294" strokeWidth="3" /><ellipse cx="60" cy="26" rx="30" ry="6" fill="#ffd45a" opacity=".85" /></>}
        </g>
      ) : null}
      {box === 'can' && <g transform="translate(686 618)"><rect x="0" y="0" width="30" height="58" rx="5" fill="#c0392b" stroke="#5a1a14" strokeWidth="2.5" /><rect x="0" y="18" width="30" height="12" fill="#f1c40f" /></g>}
      {/* tiered roof */}
      <polygon points="80,340 1320,340 1180,250 220,250" fill={roofD} />
      <polygon points="220,250 1180,250 1000,140 400,140" fill={roof} stroke="#0a0a0b" strokeWidth="5" />
      <polygon points="400,140 1000,140 860,60 540,60" fill={roofD} stroke="#0a0a0b" strokeWidth="5" />
      <path d="M700 60 L700 -40" stroke={roof} strokeWidth="16" />
      <path d="M80 340 Q40 330 30 300 M1320 340 Q1360 330 1370 300" stroke={roof} strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* light caught on the table (headlight / phone / police) */}
      {lit > 0 && <ellipse cx="700" cy="690" rx="320" ry="90" fill={`rgba(255,240,200,${0.25 * lit})`} style={{mixBlendMode: 'screen'}} />}
    </svg>
  );
};
