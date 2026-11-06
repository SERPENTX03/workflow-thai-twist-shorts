import React from 'react';
import {rnd} from '../engine/anim';
import {FLOOR, Glow, full} from './world';
import {Drips} from './inserts';

// A Thai child's bedroom drawn once and dressed per house (first used by same-child, where the SAME room sits in seven
// houses and only the wall colour and what is under the bed differ). World 1920×1080, floor line FLOOR.
//
//   door jamb with pencil height marks (x 250–420) · bed with headboard photo (x 760–1460) · medicine-cabinet mirror
//   (x 1560) · nail holes in fixed places · toy car · a back door that can open onto a dark passage (x 1700).
//
// Views are only cameras: pass the same props and frame with data.cam / presets (CHILD_ROOM_CAMS).

export type ChildRoomProps = {
  f: number;
  /** wall paint — the one thing that differs between houses */
  wall?: string;
  blanket?: 'rocket' | 'duck';
  /** pencil height marks on the jamb, top to bottom: {name, y} (y = height above the floor in px) */
  marks?: {name?: string; y: number; erased?: boolean; reversed?: boolean}[];
  /** what is under the bed */
  under?: 'medal' | 'shoe' | 'empty' | 'dust' | 'slipper';
  /** the framed photo above the bed: a boy with a duck plaster, or the reflection girl */
  photo?: 'boy' | 'girl' | 'none';
  /** medicine-cabinet mirror reflecting the photo; `reflect` shows a different child in the glass */
  mirror?: boolean;
  reflect?: 'boy' | 'girl';
  /** how readable the reflection is (0–1); keep it faint in wide shots, full in an insert */
  reflectO?: number;
  toyCar?: boolean;
  /** water soaking out of the blanket (0–1) and drips */
  wet?: number;
  /** pillow dent depth 0–1 */
  dent?: number;
  /** back door: closed / ajar / open onto the dark passage */
  door?: 'closed' | 'ajar' | 'dark';
  /** slipper wedged under the open door */
  wedge?: boolean;
  /** a lamp on the bedside table, 0–1 */
  lamp?: number;
  /** tone of the whole set (the Stage grade still applies on top) */
  dusk?: boolean;
};

export const CHILD_ROOM_CAMS: Record<string, number[]> = {
  room: [1, 1.04, 960, 540],
  bed: [1.35, 1.42, 1110, 640],
  frame: [1.9, 2.0, 335, 560],
  under: [2.1, 2.2, 1120, 860],
  mirror: [2.2, 2.3, 1560, 380],
  photo: [2.4, 2.5, 1110, 360],
  door: [1.5, 1.58, 1700, 560],
};

const Rocket: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 -26 Q10 -14 10 6 L-10 6 Q-10 -14 0 -26Z" fill="#f2efe6" />
    <path d="M-10 0 L-17 12 L-10 9Z M10 0 L17 12 L10 9Z" fill="#e5383b" />
    <circle cx="0" cy="-8" r="4" fill="#5aa0d8" />
    <path d="M-5 8 L0 18 L5 8Z" fill="#f6c445" />
  </g>
);

const Duck: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="4" rx="13" ry="9" fill="#fff6d0" />
    <circle cx="9" cy="-6" r="7" fill="#fff6d0" />
    <path d="M15 -6 L22 -4 L15 -2Z" fill="#e88a2a" />
    <circle cx="10" cy="-8" r="1.4" fill="#2a2a2a" />
  </g>
);

/** framed child photo (also used by inserts): a boy with a duck plaster round his finger, or a girl with two short pigtails */
export const ChildPhoto: React.FC<{kind: 'boy' | 'girl'; w?: number; h?: number}> = ({kind, w = 150, h = 190}) => (
  <svg width={w} height={h} viewBox="0 0 150 190" style={{display: 'block'}}>
    <rect x="0" y="0" width="150" height="190" rx="6" fill="#6a4a30" />
    <rect x="12" y="12" width="126" height="166" fill={kind === 'girl' ? '#e8d6c8' : '#cfe0ea'} />
    <path d="M30 178 Q30 120 75 118 Q120 120 120 178Z" fill={kind === 'girl' ? '#c95b6a' : '#d8d0b8'} />
    <circle cx="75" cy="86" r="30" fill="#dca27a" />
    {kind === 'boy' ? (
      <>
        <path d="M45 84 Q46 52 75 52 Q104 52 105 84 Q92 66 75 68 Q58 66 45 84Z" fill="#1b1a20" />
        <path d="M66 100 H84" stroke="#7a3b34" strokeWidth="3" strokeLinecap="round" />
        <polygon points="71,101 79,101 79,107 75,107 73.5,104.5 71,104.5" fill="#fbf8ef" />
        <rect x="96" y="132" width="16" height="22" rx="7" fill="#dca27a" />
        <rect x="95" y="138" width="18" height="9" rx="3" fill="#f6d65a" />
        <circle cx="104" cy="142.5" r="2" fill="#e88a2a" />
      </>
    ) : (
      <>
        <path d="M45 84 Q46 52 75 52 Q104 52 105 84 Q92 70 75 70 Q58 70 45 84Z" fill="#1b1a20" />
        <circle cx="40" cy="80" r="11" fill="#1b1a20" /><circle cx="110" cy="80" r="11" fill="#1b1a20" />
        <circle cx="45" cy="74" r="4" fill="#e5383b" /><circle cx="105" cy="74" r="4" fill="#e5383b" />
        <path d="M66 100 Q75 106 84 100" stroke="#7a3b34" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="98" cy="150" r="9" fill="#1e4a8a" stroke="#f6c445" strokeWidth="2.5" />
      </>
    )}
    <circle cx="64" cy="84" r="3" fill="#1a1a22" /><circle cx="86" cy="84" r="3" fill="#1a1a22" />
  </svg>
);

/** child's canvas shoe with a blue cross-stitch on the toe; the knot sits outside */
export const KidShoe: React.FC<{s?: number; knot?: boolean}> = ({s = 1, knot = true}) => (
  <svg width={180 * s} height={90 * s} viewBox="0 0 180 90" style={{display: 'block', overflow: 'visible'}}>
    <path d="M10 70 Q8 34 52 30 L96 28 Q150 30 170 62 L172 78 Q90 86 10 80Z" fill="#f1ede2" stroke="#6b6458" strokeWidth="3" />
    <path d="M10 76 Q90 84 172 76 L172 84 Q90 92 10 86Z" fill="#c9c2b3" />
    <path d="M124 44 L148 64 M148 44 L124 64" stroke="#3b7fc4" strokeWidth="5" strokeLinecap="round" />
    {knot && <circle cx="150" cy="66" r="4.5" fill="#3b7fc4" />}
    <path d="M58 32 L92 30" stroke="#8a8276" strokeWidth="3" strokeDasharray="4 4" />
  </svg>
);

const SwimMedal: React.FC = () => (
  <svg width="90" height="90" viewBox="0 0 90 90" style={{display: 'block'}}>
    <path d="M30 0 L45 34 L60 0" fill="none" stroke="#3b5fb0" strokeWidth="10" />
    <circle cx="45" cy="56" r="26" fill="#c9ccd2" stroke="#7d8590" strokeWidth="4" />
    <path d="M32 58 Q38 50 45 58 Q52 66 58 58" fill="none" stroke="#5a6470" strokeWidth="3" />
  </svg>
);

export const ToyCar: React.FC<{s?: number; missing?: boolean}> = ({s = 1, missing = true}) => (
  <svg width={120 * s} height={64 * s} viewBox="0 0 120 64" style={{display: 'block'}}>
    <path d="M8 40 L14 24 L40 20 L56 6 L88 6 L104 22 L114 26 L114 44 L8 44Z" fill="#d8463e" stroke="#7a2420" strokeWidth="3" />
    <path d="M60 10 L84 10 L96 22 L52 22Z" fill="#bfe0f2" />
    <circle cx="30" cy="46" r="12" fill="#2a2a2e" /><circle cx="30" cy="46" r="5" fill="#9aa0a8" />
    {!missing && <><circle cx="92" cy="46" r="12" fill="#2a2a2e" /><circle cx="92" cy="46" r="5" fill="#9aa0a8" /></>}
    {missing && <path d="M86 46 h12" stroke="#5a5a5e" strokeWidth="4" strokeLinecap="round" />}
  </svg>
);

export const ChildRoom: React.FC<ChildRoomProps> = ({
  f, wall = '#8fa6a0', blanket = 'rocket', marks = [{name: 'ต้น', y: 340}], under = 'empty', photo = 'boy', mirror = true, reflect,
  reflectO = 0.85, toyCar = true, wet = 0, dent = 0.5, door = 'closed', wedge, lamp = 0, dusk,
}) => {
  const bedX = 760, bedW = 700, bedTop = FLOOR - 250;
  const blanketFill = blanket === 'duck' ? '#f3d35a' : '#2f5b8f';
  const jambX = 250;
  return (
    <>
      <div style={full(`linear-gradient(180deg, ${wall} 0%, ${wall} 78%, #00000022 100%)`)} />
      {/* plank seams on the painted wall */}
      <div style={{...full('repeating-linear-gradient(90deg, rgba(0,0,0,.07) 0 3px, transparent 3px 120px)')}} />
      {/* skirting + floor */}
      <div style={{position: 'absolute', left: -700, top: FLOOR - 22, width: 3320, height: 22, background: '#5a3f2a'}} />
      <div style={{position: 'absolute', left: -700, top: FLOOR, width: 3320, height: 700,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 3px, transparent 3px 46px), linear-gradient(180deg, #7a5a3e, #4a3424)'}} />
      {/* nail holes — the same positions in every house */}
      {[[560, 260], [612, 262], [1530, 640], [1880, 300], [690, 520]].map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: 7, height: 7, borderRadius: '50%', background: 'rgba(30,20,14,.7)'}} />
      ))}

      {/* door jamb (วงกบ) with height marks */}
      <div style={{position: 'absolute', left: jambX, top: 150, width: 170, height: FLOOR - 150, background: 'rgba(0,0,0,.35)'}} />
      <div style={{position: 'absolute', left: jambX - 26, top: 130, width: 26, height: FLOOR - 130, background: '#8a6444', boxShadow: 'inset -4px 0 0 #5a3f2a'}} />
      <div style={{position: 'absolute', left: jambX + 170, top: 130, width: 26, height: FLOOR - 130, background: '#8a6444', boxShadow: 'inset 4px 0 0 #5a3f2a'}} />
      <div style={{position: 'absolute', left: jambX - 26, top: 110, width: 222, height: 24, background: '#7a5639'}} />
      {marks.map((m, i) => (
        <div key={i} style={{position: 'absolute', left: jambX + 170, top: FLOOR - m.y, width: 26, height: 0, opacity: m.erased ? 0.35 : 1}}>
          <div style={{position: 'absolute', left: 0, top: -2, width: 26, height: 3, background: '#2b2b30'}} />
          {m.name && (
            <div style={{position: 'absolute', left: 32, top: -18, fontFamily: '"Plex Thai", sans-serif', fontSize: 26, fontWeight: 600, color: '#2b2b30', whiteSpace: 'nowrap',
              transform: m.reversed ? 'scaleX(-1)' : undefined, filter: m.erased ? 'blur(1.2px)' : undefined, textDecoration: m.erased ? 'line-through' : undefined}}>{m.name}</div>
          )}
        </div>
      ))}

      {/* back door to the right; it opens onto the dark passage (same-child ch7) */}
      <div style={{position: 'absolute', left: 1640, top: 300, width: 220, height: FLOOR - 300, background: door === 'dark' ? '#050608' : '#3a2a1c', boxShadow: 'inset 0 0 0 10px #6a4a30'}}>
        {door === 'dark' && <div style={{position: 'absolute', inset: 10, background: 'radial-gradient(ellipse at 50% 70%, #1a1612 0%, #050608 70%)'}} />}
      </div>
      {door !== 'dark' && (
        <div style={{position: 'absolute', left: 1650, top: 310, width: 200, height: FLOOR - 310, background: '#7a5a3e', boxShadow: 'inset 0 0 0 6px #5a3f2a',
          transformOrigin: '0 50%', transform: door === 'ajar' ? 'perspective(900px) rotateY(-34deg)' : undefined}}>
          <div style={{position: 'absolute', left: 160, top: 300, width: 16, height: 16, borderRadius: '50%', background: '#c9a24a'}} />
        </div>
      )}
      {door === 'dark' && (
        <div style={{position: 'absolute', left: 1650, top: 310, width: 200, height: FLOOR - 310, background: '#7a5a3e', boxShadow: 'inset 0 0 0 6px #5a3f2a',
          transformOrigin: '0 50%', transform: 'perspective(900px) rotateY(-78deg)'}} />
      )}
      {wedge && <div style={{position: 'absolute', left: 1660, top: FLOOR - 18, width: 70, height: 18, borderRadius: 9, background: '#3b7fc4'}} />}

      {/* medicine cabinet with mirror */}
      {mirror && (
        <div style={{position: 'absolute', left: 1490, top: 270, width: 150, height: 200, background: '#e9e4d6', boxShadow: '0 6px 14px rgba(0,0,0,.3)', border: '6px solid #b8ae98'}}>
          <div style={{position: 'absolute', inset: 10, background: 'linear-gradient(135deg, #cfe0e8, #9fb4c0)', overflow: 'hidden'}}>
            {reflect && <div style={{position: 'absolute', left: 30, top: 20, transform: 'scaleX(-1)', opacity: reflectO, filter: reflectO < 0.6 ? 'blur(1.5px)' : undefined}}><ChildPhoto kind={reflect} w={66} h={84} /></div>}
            <div style={{position: 'absolute', left: -30, top: -10, width: 40, height: 260, background: 'rgba(255,255,255,.35)', transform: 'rotate(20deg)'}} />
            <div style={{position: 'absolute', left: 50, top: -10, width: 70, height: 260, background: `rgba(255,255,255,${0.5 - reflectO * 0.4})`, transform: 'rotate(20deg)'}} />
          </div>
        </div>
      )}

      {/* bed */}
      <div style={{position: 'absolute', left: bedX - 20, top: bedTop - 160, width: 40, height: 410, background: '#6a4a30', borderRadius: 6}} />
      <div style={{position: 'absolute', left: bedX - 20, top: bedTop - 170, width: 300, height: 34, background: '#7a5639', borderRadius: 8}} />
      {photo !== 'none' && <div style={{position: 'absolute', left: 1035, top: 250}}><ChildPhoto kind={photo} /></div>}
      <div style={{position: 'absolute', left: bedX, top: bedTop + 60, width: bedW, height: 120, background: '#5a3f2a', borderRadius: 6}} />
      {/* legs */}
      {[bedX + 10, bedX + bedW - 40].map(x => <div key={x} style={{position: 'absolute', left: x, top: bedTop + 170, width: 30, height: FLOOR - bedTop - 170, background: '#4a3424'}} />)}
      {/* mattress + pillow */}
      <div style={{position: 'absolute', left: bedX + 10, top: bedTop + 20, width: bedW - 20, height: 54, background: '#efe9da', borderRadius: 14}} />
      <div style={{position: 'absolute', left: bedX + 30, top: bedTop - 8, width: 200, height: 56, background: '#f6f1e6', borderRadius: 26, boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.08)'}}>
        <div style={{position: 'absolute', left: 60, top: 10, width: 80, height: 22, borderRadius: '50%', background: `rgba(0,0,0,${0.16 * dent})`}} />
      </div>
      {/* blanket */}
      <svg width={bedW - 220} height={110} style={{position: 'absolute', left: bedX + 220, top: bedTop + 2, overflow: 'visible'}}>
        <path d={`M0 18 Q${(bedW - 220) / 2} -4 ${bedW - 220} 16 L${bedW - 210} 104 L-6 104 Z`} fill={blanketFill} />
        {blanket === 'rocket'
          ? Array.from({length: 9}, (_, i) => <Rocket key={i} x={40 + (i % 5) * 96} y={40 + Math.floor(i / 5) * 42 + (i % 2) * 8} s={0.9} rot={-20 + rnd(7, i) * 40} />)
          : Array.from({length: 8}, (_, i) => <Duck key={i} x={50 + (i % 4) * 120} y={44 + Math.floor(i / 4) * 40} s={1.1} />)}
        {wet > 0 && <ellipse cx={(bedW - 220) * 0.45} cy={56} rx={110 * wet} ry={34 * wet} fill="rgba(20,40,70,.45)" />}
      </svg>
      {wet > 0 && <Drips x={bedX + 420} y={bedTop + 100} f={f} n={3} to={FLOOR} />}
      {/* under the bed */}
      <div style={{position: 'absolute', left: bedX + 40, top: bedTop + 180, width: bedW - 80, height: FLOOR - bedTop - 180, background: 'linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.35))'}} />
      {under === 'medal' && <div style={{position: 'absolute', left: bedX + 300, top: FLOOR - 92}}><SwimMedal /></div>}
      {under === 'shoe' && <div style={{position: 'absolute', left: bedX + 280, top: FLOOR - 70}}><KidShoe s={0.8} /></div>}
      {under === 'slipper' && <div style={{position: 'absolute', left: bedX + 300, top: FLOOR - 26, width: 110, height: 24, borderRadius: 12, background: '#3b7fc4'}} />}
      {under === 'dust' && <div style={{position: 'absolute', left: bedX + 290, top: FLOOR - 16, width: 150, height: 10, boxShadow: '0 0 0 3px rgba(200,190,170,.45)', borderRadius: 2}} />}

      {/* bedside table + lamp */}
      <div style={{position: 'absolute', left: bedX + bedW + 30, top: FLOOR - 170, width: 130, height: 170, background: '#6a4a30', boxShadow: 'inset 0 -60px 0 rgba(0,0,0,.15)'}}>
        <div style={{position: 'absolute', left: 50, top: 70, width: 30, height: 8, borderRadius: 4, background: '#c9a24a'}} />
      </div>
      <div style={{position: 'absolute', left: bedX + bedW + 70, top: FLOOR - 270, width: 50, height: 100}}>
        <div style={{position: 'absolute', left: 21, top: 40, width: 8, height: 60, background: '#3a3a3a'}} />
        <div style={{position: 'absolute', left: -10, top: 0, width: 70, height: 46, background: lamp > 0 ? '#ffe2a6' : '#d8cdb4', clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)'}} />
      </div>
      {lamp > 0 && <Glow x={bedX + bedW + 95} y={FLOOR - 250} r={420} a={0.4 * lamp} />}
      {toyCar && <div style={{position: 'absolute', left: 560, top: FLOOR - 40}}><ToyCar s={0.7} /></div>}
      {dusk && <div style={full('rgba(40,30,60,.25)')} />}
    </>
  );
};
