import React from 'react';
import {rnd} from '../engine/anim';
import {FLOOR, Glow, W, full} from './world';

// Everyday Thai village interiors and fronts (first used by same-child): a wooden house room (kitchen / closet /
// hall / dining), a house front with a door, a car cabin, a small rural school (front, staff board, office, walkway)
// and a photocopy counter. Same 1920×1080 world and FLOOR as places.tsx; the Stage grade sets the time of day.

const T_FONT = '"Plex Thai", sans-serif';

const Window: React.FC<{x: number; y: number; w: number; h: number; out?: string}> = ({x, y, w, h, out = 'linear-gradient(#bcd3dc, #e6e0c8)'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: out, boxShadow: 'inset 0 0 0 12px #6a4a30'}}>
    <div style={{position: 'absolute', left: w / 2 - 5, top: 0, width: 10, height: h, background: '#6a4a30'}} />
    {Array.from({length: Math.floor(h / 40)}, (_, i) => <div key={i} style={{position: 'absolute', left: 12, top: 20 + i * 40, width: w - 24, height: 6, background: 'rgba(90,63,42,.55)'}} />)}
  </div>
);

const PlankWall: React.FC<{c0?: string; c1?: string}> = ({c0 = '#8a6a48', c1 = '#6a4b31'}) => (
  <div style={full(`repeating-linear-gradient(90deg, ${c1} 0 5px, ${c0} 5px 70px, ${c0}e8 70px 112px)`)} />
);

const Floor: React.FC<{c0?: string; c1?: string}> = ({c0 = '#7a5a3e', c1 = '#4a3424'}) => (
  <>
    <div style={{position: 'absolute', left: -700, top: FLOOR - 20, width: W + 1400, height: 20, background: '#4a3424'}} />
    <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 700,
      background: `repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 3px, transparent 3px 46px), linear-gradient(180deg, ${c0}, ${c1})`}} />
  </>
);

/** low table with plates; `plates` 0–3, `fishbone` = the first plate's fish already picked clean */
export const DiningTable: React.FC<{x: number; plates?: number; fishbone?: boolean; book?: boolean}> = ({x, plates = 0, fishbone, book}) => (
  <div style={{position: 'absolute', left: x - 300, top: FLOOR - 190, width: 600, height: 190}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 600, height: 26, background: '#8a6444', borderRadius: 6, boxShadow: '0 6px 0 #5a3f2a'}} />
    {[30, 540].map(l => <div key={l} style={{position: 'absolute', left: l, top: 26, width: 28, height: 164, background: '#5a3f2a'}} />)}
    {Array.from({length: plates}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: 120 + i * 220, top: -22, width: 150, height: 30, borderRadius: '50%', background: '#f2efe6', boxShadow: 'inset 0 -5px 0 #c9c2b3'}}>
        <div style={{position: 'absolute', left: 40, top: 4, width: 70, height: 14, borderRadius: '50%', background: i === 0 && fishbone ? 'transparent' : '#d9a85a',
          border: i === 0 && fishbone ? '2px dashed #8a7f6d' : undefined}} />
      </div>
    ))}
    {book && <div style={{position: 'absolute', left: 380, top: -34, width: 170, height: 36, background: '#8a5a32', borderRadius: 4, transform: 'skewX(-18deg)', boxShadow: 'inset 0 -8px 0 #5a3a1e, 0 0 0 4px rgba(246,196,69,.0)'}} />}
  </div>
);

/** a wooden Thai house room. kitchen = window, shelf, cabinet with a pinned paper; closet = open wardrobe (optional
 *  blue jacket); hall = corridor with a door ajar to a lit room; dining = table and window. */
export const WoodRoom: React.FC<{view: 'kitchen' | 'closet' | 'hall' | 'dining'; f?: number; plates?: number; fishbone?: boolean; jacket?: boolean; book?: boolean;
  paper?: React.ReactNode; wall?: [string, string]; lamp?: number}> = ({view, plates = 0, fishbone, jacket, book, paper, wall, lamp = 0}) => (
  <>
    <PlankWall c0={wall?.[0]} c1={wall?.[1]} />
    <Floor />
    {(view === 'kitchen' || view === 'dining') && <Window x={view === 'kitchen' ? 1320 : 260} y={250} w={360} h={300} />}
    {view === 'kitchen' && (
      <>
        {/* shelf with pinto tiffins */}
        <div style={{position: 'absolute', left: 1300, top: 600, width: 420, height: 18, background: '#5a3f2a'}} />
        {[0, 1, 2].map(i => (
          <div key={i} style={{position: 'absolute', left: 1330 + i * 120, top: 470, width: 70, height: 130}}>
            {[0, 1, 2, 3].map(j => <div key={j} style={{position: 'absolute', left: 0, top: j * 30, width: 70, height: 28, background: '#c9ccd2', borderRadius: 6, boxShadow: 'inset 0 -4px 0 #8a9099'}} />)}
            <div style={{position: 'absolute', left: 30, top: -20, width: 10, height: 24, background: '#8a9099'}} />
          </div>
        ))}
        {/* cabinet with the paper pinned to its front */}
        <div style={{position: 'absolute', left: 120, top: 330, width: 420, height: FLOOR - 330, background: '#7a5639', boxShadow: 'inset 0 0 0 10px #5a3f2a, inset 210px 0 0 -205px #5a3f2a'}}>
          <div style={{position: 'absolute', left: 60, top: 60, width: 300, height: 220, background: '#f2ead8', transform: 'rotate(-2deg)', boxShadow: '0 4px 10px rgba(0,0,0,.3)'}}>{paper}</div>
        </div>
        {/* stove counter */}
        <div style={{position: 'absolute', left: 680, top: FLOOR - 260, width: 480, height: 260, background: '#6a4a30', boxShadow: 'inset 0 18px 0 #8a6444'}}>
          <div style={{position: 'absolute', left: 300, top: -46, width: 120, height: 50, borderRadius: '50% 50% 10px 10px', background: '#3a3a3a'}} />
        </div>
      </>
    )}
    {view === 'dining' && <DiningTable x={1100} plates={plates} fishbone={fishbone} book={book} />}
    {view === 'closet' && (
      <div style={{position: 'absolute', left: 1180, top: 160, width: 560, height: FLOOR - 160, background: '#5a3f2a'}}>
        <div style={{position: 'absolute', left: 30, top: 30, width: 500, height: FLOOR - 220, background: '#2a1e14'}} />
        <div style={{position: 'absolute', left: 50, top: 70, width: 460, height: 8, background: '#9aa0a8'}} />
        {[[90, '#7a6a5a'], [190, '#4a5a4a'], [380, '#6a4a5a']].map(([x, c]) => (
          <div key={String(x)} style={{position: 'absolute', left: Number(x), top: 76, width: 90, height: 300, background: String(c), borderRadius: '12px 12px 4px 4px'}} />
        ))}
        {jacket && (
          <div style={{position: 'absolute', left: 270, top: 76, width: 110, height: 330, background: '#6f9ccf', borderRadius: '14px 14px 6px 6px', boxShadow: 'inset -14px 0 0 rgba(0,0,0,.12)'}}>
            <div style={{position: 'absolute', left: 64, top: 170, width: 30, height: 22, background: '#c9b48a', transform: 'rotate(-24deg)', borderRadius: 3}} />
          </div>
        )}
        {/* open door leaf */}
        <div style={{position: 'absolute', left: -200, top: 0, width: 200, height: FLOOR - 160, background: '#7a5639', transform: 'perspective(900px) rotateY(40deg)', transformOrigin: '100% 50%'}} />
      </div>
    )}
    {view === 'hall' && (
      <>
        <div style={{position: 'absolute', left: 700, top: 200, width: 520, height: FLOOR - 200, background: '#3a2a1c'}} />
        <div style={{position: 'absolute', left: 820, top: 300, width: 260, height: FLOOR - 300, background: 'linear-gradient(#cfd8c8, #9fae9a)', boxShadow: 'inset 0 0 0 10px #6a4a30'}} />
        <div style={{position: 'absolute', left: 830, top: 310, width: 120, height: FLOOR - 310, background: '#7a5a3e', transform: 'perspective(800px) rotateY(-50deg)', transformOrigin: '0 50%'}} />
      </>
    )}
    {lamp > 0 && <Glow x={960} y={240} r={700} a={0.3 * lamp} />}
  </>
);

/** a wooden house front: steps, door, two windows, a low fence */
export const HouseFront: React.FC<{f?: number; c?: string; open?: number; night?: boolean; windows?: boolean}> = ({c = '#8a6a48', open = 0, night, windows = true}) => (
  <>
    <div style={full(night ? 'linear-gradient(#0d1730, #1a2540)' : 'linear-gradient(#a9c4d8, #e6e0c8)')} />
    <div style={{position: 'absolute', left: -700, top: FLOOR - 40, width: W + 1400, height: 800, background: night ? '#2a2620' : '#b89f7d'}} />
    <div style={{position: 'absolute', left: 260, top: 120, width: 1400, height: FLOOR - 120, background: c, boxShadow: 'inset 0 -20px 0 rgba(0,0,0,.2)'}}>
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.12) 0 4px, transparent 4px 90px)'}} />
      <div style={{position: 'absolute', left: -80, top: -70, width: 1560, height: 80, background: '#5e3424'}} />
      {windows && [150, 1050].map(x => <div key={x}><Window x={x} y={180} w={220} h={240} out={night ? 'linear-gradient(#ffd99a, #e0a050)' : undefined} /></div>)}
      {/* door */}
      <div style={{position: 'absolute', left: 560, top: 260, width: 280, height: FLOOR - 120 - 260, background: '#1a120c', boxShadow: 'inset 0 0 0 12px #5a3f2a'}} />
      <div style={{position: 'absolute', left: 572, top: 272, width: 256, height: FLOOR - 120 - 272, background: '#6a4a30', transformOrigin: '0 50%',
        transform: `perspective(900px) rotateY(${-open * 60}deg)`}}>
        <div style={{position: 'absolute', left: 210, top: 260, width: 18, height: 18, borderRadius: '50%', background: '#c9a24a'}} />
      </div>
    </div>
    {/* steps + fence */}
    <div style={{position: 'absolute', left: 780, top: FLOOR - 20, width: 360, height: 40, background: '#5a3f2a'}} />
    {Array.from({length: 18}, (_, i) => i < 6 || i > 11 ? (
      <div key={i} style={{position: 'absolute', left: -60 + i * 120, top: FLOOR - 120, width: 18, height: 160, background: '#d8d0bc'}} />
    ) : null)}
    {night && <Glow x={960} y={400} r={600} a={0.25} />}
  </>
);

/** the car cabin moved to car.tsx (CarInterior, CarWheel, CarBelt) */
export {CarInterior} from './car';

/** a small rural school front with its sign */
export const SchoolFront: React.FC<{sign?: string}> = ({sign = 'โรงเรียนบ้านท่าน้อย'}) => (
  <>
    <div style={full('linear-gradient(#a9c4d8, #e6e0c8)')} />
    <div style={{position: 'absolute', left: -700, top: FLOOR - 30, width: W + 1400, height: 800, background: '#c9b38a'}} />
    <div style={{position: 'absolute', left: 420, top: 260, width: 1400, height: FLOOR - 290, background: '#e9dcc0', boxShadow: 'inset 0 -40px 0 #c9b88f'}}>
      <div style={{position: 'absolute', left: -60, top: -80, width: 1520, height: 90, background: '#b8452e'}} />
      {Array.from({length: 6}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 60 + i * 225, top: 140, width: 150, height: 200, background: 'linear-gradient(#bcd3dc, #8fb0bf)', boxShadow: 'inset 0 0 0 8px #6a7a8a'}} />
      ))}
      <div style={{position: 'absolute', left: 380, top: 30, width: 640, height: 80, background: '#1e4a8a', border: '5px solid #f6c445', borderRadius: 10,
        color: '#fff', fontFamily: T_FONT, fontSize: 44, fontWeight: 700, textAlign: 'center', lineHeight: '70px'}}>{sign}</div>
    </div>
    {/* flagpole */}
    <div style={{position: 'absolute', left: 250, top: 120, width: 12, height: FLOOR - 140, background: '#c9ccd2'}} />
    <div style={{position: 'absolute', left: 262, top: 130, width: 130, height: 84,
      background: 'linear-gradient(#e5383b 0 17%, #fff 17% 33%, #2a3f8f 33% 67%, #fff 67% 83%, #e5383b 83%)'}} />
  </>
);

/** staff board in the school hall; `peeled` = one name card pulled off, leaving a glue rectangle */
export const StaffBoard: React.FC<{names?: string[]; peeled?: boolean}> = ({names = ['ครูสมใจ', 'ครูวิไล'], peeled = true}) => (
  <>
    <div style={full('linear-gradient(#e9dcc0, #d6c7a6)')} />
    <div style={{position: 'absolute', left: 460, top: 180, width: 1000, height: 640, background: '#2f5a3a', border: '18px solid #8a6444', borderRadius: 8}}>
      <div style={{position: 'absolute', top: 30, width: '100%', textAlign: 'center', fontFamily: T_FONT, fontSize: 52, fontWeight: 700, color: '#f6f1e6'}}>ครูเวรประจำวัน</div>
      {names.map((n, i) => (
        <div key={n} style={{position: 'absolute', left: 120 + i * 270, top: 160, width: 220, height: 300, background: '#f6f1e6', borderRadius: 6}}>
          <div style={{position: 'absolute', left: 50, top: 30, width: 120, height: 150, borderRadius: 8, background: '#cfd8c8'}} />
          <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center', fontFamily: T_FONT, fontSize: 30, fontWeight: 600, color: '#2a2a2a'}}>{n}</div>
        </div>
      ))}
      {peeled && <div style={{position: 'absolute', left: 120 + names.length * 270, top: 160, width: 220, height: 300, border: '4px solid rgba(240,230,200,.55)', borderRadius: 6,
        background: 'repeating-linear-gradient(45deg, rgba(240,230,200,.18) 0 6px, transparent 6px 14px)'}} />}
    </div>
  </>
);

/** school office / guard post: desk, logbook, window, fan. `hall` = the covered walkway outside classrooms */
export const SchoolRoom: React.FC<{view: 'office' | 'hall'; f: number}> = ({view, f}) => (
  <>
    <div style={full(view === 'hall' ? 'linear-gradient(#e9dcc0, #d9c9a4)' : 'linear-gradient(#e6dccb, #cfc2a8)')} />
    <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 700, background: view === 'hall' ? 'repeating-linear-gradient(90deg, #c9a24a 0 200px, #b8913a 200px 400px)' : '#9a8a6e'}} />
    {view === 'office' && (
      <>
        <Window x={1250} y={220} w={420} h={330} />
        <div style={{position: 'absolute', left: 260, top: 230, width: 520, height: 330, background: '#e9e4d6', boxShadow: 'inset 0 0 0 10px #6a7a8a'}}>
          {Array.from({length: 4}, (_, i) => <div key={i} style={{position: 'absolute', left: 30, top: 40 + i * 70, width: 460, height: 8, background: '#b8c2cc'}} />)}
        </div>
        <div style={{position: 'absolute', left: 1360, top: 120, width: 90, height: 90, borderRadius: '50%', border: '6px solid #6a7a8a',
          background: `conic-gradient(from ${f * 30}deg, #b8c2cc 0 30deg, transparent 30deg 120deg, #b8c2cc 120deg 150deg, transparent 150deg 240deg, #b8c2cc 240deg 270deg, transparent 270deg)`}} />
      </>
    )}
    {view === 'hall' && (
      <>
        <div style={{position: 'absolute', left: -700, top: 80, width: W + 1400, height: 60, background: '#b8452e'}} />
        {Array.from({length: 7}, (_, i) => <div key={i} style={{position: 'absolute', left: -200 + i * 380, top: 140, width: 44, height: FLOOR - 140, background: '#e9e4d6', boxShadow: 'inset -10px 0 0 #cfc8b4'}} />)}
        {Array.from({length: 4}, (_, i) => <div key={i} style={{position: 'absolute', left: 40 + i * 520, top: 300, width: 300, height: 260, background: 'linear-gradient(#8fb0bf, #6a8a9a)', boxShadow: 'inset 0 0 0 10px #6a7a8a'}} />)}
      </>
    )}
  </>
);

/** the guard's desk (drawn in front of the actors) with the open logbook */
export const OfficeDesk: React.FC<{x?: number}> = ({x = 960}) => (
  <div style={{position: 'absolute', left: x - 420, top: FLOOR - 230, width: 840, height: 230}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 840, height: 30, background: '#8a6444', borderRadius: 6}} />
    <div style={{position: 'absolute', left: 20, top: 30, width: 800, height: 200, background: '#6a4a30', boxShadow: 'inset 0 -40px 0 rgba(0,0,0,.18)'}} />
    <div style={{position: 'absolute', left: 300, top: -26, width: 260, height: 30, background: '#f2ead8', transform: 'skewX(-20deg)', boxShadow: 'inset 130px 0 0 -128px #8a7f6d'}} />
  </div>
);

/** photocopy shop counter: copier, shelves of paper, a print tray */
export const CopyCounter: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={full('linear-gradient(#dfe6e0, #c4cfc6)')} />
    <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 700, background: 'repeating-linear-gradient(90deg, #d8d0bc 0 120px, #cfc6b0 120px 240px)'}} />
    {Array.from({length: 4}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: 120, top: 180 + i * 130, width: 520, height: 16, background: '#8a6444'}}>
        {Array.from({length: 7}, (_, j) => <div key={j} style={{position: 'absolute', left: 20 + j * 70, top: -70, width: 56, height: 70, background: ['#f2efe6', '#f6c445', '#9fd0e8', '#f2efe6'][(i + j) % 4]}} />)}
      </div>
    ))}
    <div style={{position: 'absolute', left: 1300, top: 360, width: 420, height: FLOOR - 360, background: '#e9e4d6', borderRadius: 16, boxShadow: 'inset 0 30px 0 #c9c4b6'}}>
      <div style={{position: 'absolute', left: 60, top: 60, width: 300, height: 40, background: '#3a3a42', borderRadius: 6}} />
      <div style={{position: 'absolute', left: 300, top: 120, width: 26, height: 26, borderRadius: '50%', background: rnd(3, Math.floor(f / 10)) > 0.5 ? '#3fa66b' : '#2a5a3a'}} />
    </div>
    {/* counter in front */}
    <div style={{position: 'absolute', left: -200, top: FLOOR - 220, width: 1200, height: 260, background: '#6a4a30', boxShadow: 'inset 0 22px 0 #8a6444', zIndex: 8}} />
  </>
);

/** school store room: sports-trophy glass cabinet with class photos by year (left), steel cabinet with a small camera
 *  hanging from its handle at a child's height (right), boxes and balls. Frame the cabinets with data.cam. */
export const SchoolStore: React.FC<{f: number; camera?: boolean; envelopes?: number; reach?: boolean}> = ({camera = true, envelopes = 0, reach}) => (
  <>
    <div style={full('linear-gradient(#cfc4ad, #b8ab90)')} />
    <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 700, background: 'repeating-linear-gradient(90deg, #8a7f6d 0 160px, #7d7262 160px 320px)'}} />
    <Window x={980} y={140} w={200} h={180} out="linear-gradient(#e6c48a, #c98a52)" />
    {/* trophy cabinet */}
    <div style={{position: 'absolute', left: 220, top: 200, width: 600, height: FLOOR - 200, background: '#6a4a30', boxShadow: 'inset 0 0 0 14px #4a3424'}}>
      <div style={{position: 'absolute', left: 24, top: 24, width: 552, height: FLOOR - 248, background: 'rgba(190,215,225,.35)'}} />
      {[0, 1, 2].map(r => (
        <div key={r} style={{position: 'absolute', left: 24, top: 210 + r * 200, width: 552, height: 10, background: '#4a3424'}}>
          {Array.from({length: 4}, (_, i) => (
            <div key={i} style={{position: 'absolute', left: 20 + i * 132, top: -120, width: 110, height: 110, background: '#f2ead8', boxShadow: 'inset 0 0 0 7px #8a6444'}}>
              <div style={{position: 'absolute', left: 14, top: 40, width: 82, height: 50, background: 'repeating-linear-gradient(90deg, #dca27a 0 12px, transparent 12px 20px)', opacity: 0.8}} />
            </div>
          ))}
        </div>
      ))}
      {[0, 1].map(i => <div key={'t' + i} style={{position: 'absolute', left: 150 + i * 260, top: 70, width: 50, height: 70, background: '#d4a73c', borderRadius: '30px 30px 6px 6px'}} />)}
      {Array.from({length: envelopes}, (_, i) => (
        <div key={'e' + i} style={{position: 'absolute', left: 60 + i * 76, top: 470, width: 70, height: 90, background: '#d9c9a0', transform: `rotate(${(i - 2.5) * 3}deg)`, boxShadow: '0 4px 8px rgba(0,0,0,.3)'}} />
      ))}
      <div style={{position: 'absolute', left: 24, top: 24, width: 120, height: FLOOR - 248, background: 'rgba(255,255,255,.15)', transform: 'skewX(-12deg)'}} />
    </div>
    {/* steel cabinet */}
    <div style={{position: 'absolute', left: 1280, top: 260, width: 380, height: FLOOR - 260, background: 'linear-gradient(90deg, #8a949e, #a6b0ba 50%, #8a949e)', boxShadow: 'inset 0 0 0 6px #6a747e'}}>
      <div style={{position: 'absolute', left: 188, top: 10, width: 4, height: FLOOR - 280, background: '#5a646e'}} />
      <div style={{position: 'absolute', left: 166, top: 180, width: 14, height: 70, background: '#3a3a42', borderRadius: 4}} />
      {camera && (
        <>
          <div style={{position: 'absolute', left: 172, top: 250, width: 2, height: 70, background: '#2a2a30'}} />
          <div style={{position: 'absolute', left: 130, top: 316, width: 90, height: 60, background: '#24242a', borderRadius: 10}}>
            <div style={{position: 'absolute', left: 30, top: 14, width: 32, height: 32, borderRadius: '50%', background: '#4a5a76', boxShadow: 'inset 0 0 0 6px #121216'}} />
            <div style={{position: 'absolute', left: 6, top: 6, width: 16, height: 16, background: '#f6c445', clipPath: 'polygon(50% 0, 62% 38%, 100% 38%, 69% 60%, 80% 100%, 50% 75%, 20% 100%, 31% 60%, 0 38%, 38% 38%)'}} />
          </div>
        </>
      )}
    </div>
    {/* boxes, balls */}
    {[[880, 140, '#a88a5a'], [960, 100, '#b8986a'], [1700, 160, '#a88a5a']].map(([x, h, c], i) => (
      <div key={i} style={{position: 'absolute', left: Number(x), top: FLOOR - Number(h), width: 170, height: Number(h), background: String(c), boxShadow: 'inset 0 -10px 0 rgba(0,0,0,.15)'}} />
    ))}
    {[[1110, '#e5383b'], [1190, '#f6c445']].map(([x, c]) => <div key={String(x)} style={{position: 'absolute', left: Number(x), top: FLOOR - 70, width: 70, height: 70, borderRadius: '50%', background: String(c)}} />)}
    {reach && (
      <>
        <div style={{position: 'absolute', left: 820, top: 540, width: 40, height: 300, background: '#0e0a08'}} />
        <div style={{position: 'absolute', left: 840, top: 600, width: 360, height: 70, background: '#3d5a73', borderRadius: 34, transform: 'rotate(-6deg)', transformOrigin: '0 50%'}} />
        <div style={{position: 'absolute', left: 812, top: 598, width: 60, height: 54, borderRadius: 24, background: '#dfa67e', transform: 'rotate(-6deg)'}} />
      </>
    )}
  </>
);

/** a small sedan seen side-on from outside (bonnet to the left), standing on the floor line; hood = a camera on the bonnet */
export const CarOutside: React.FC<{x?: number; c?: string; camera?: boolean}> = ({x = 960, c = '#7a8a9a', camera}) => (
  <div style={{position: 'absolute', left: x - 520, top: FLOOR - 330, width: 1040, height: 330}}>
    <svg width={1040} height={330}>
      <path d="M40 250 L60 170 Q90 150 230 140 L330 60 Q360 40 420 40 L700 40 Q760 40 800 80 L880 150 Q990 160 1010 200 L1020 250Z" fill={c} stroke="#2a2f36" strokeWidth="6" />
      <path d="M350 70 L420 56 L560 56 L560 140 L300 140Z" fill="#bfd8e8" />
      <path d="M590 56 L700 56 Q740 58 770 90 L820 140 L590 140Z" fill="#bfd8e8" />
      <rect x="40" y="230" width="980" height="40" rx="14" fill="#3a4048" />
      {[230, 820].map(cx => (
        <g key={cx}><circle cx={cx} cy={270} r={58} fill="#1a1c20" /><circle cx={cx} cy={270} r={26} fill="#9aa0a8" /></g>
      ))}
      <rect x="44" y="190" width="40" height="20" rx="6" fill="#ffe8b0" />
    </svg>
    {camera && (
      <div style={{position: 'absolute', left: 120, top: 104, width: 70, height: 46, borderRadius: 8, background: '#24242a'}}>
        <div style={{position: 'absolute', left: 22, top: 10, width: 26, height: 26, borderRadius: '50%', background: '#4a5a76', boxShadow: 'inset 0 0 0 5px #121216'}} />
      </div>
    )}
  </div>
);

/** a Thai police pickup (white with the blue stripe and a light bar), side-on */
export const PoliceTruck: React.FC<{x?: number; f?: number}> = ({x = 400, f = 0}) => (
  <div style={{position: 'absolute', left: x - 480, top: FLOOR - 360, width: 960, height: 360}}>
    <svg width={960} height={360}>
      <path d="M30 280 L40 170 L300 160 L370 70 L560 70 L600 160 L930 170 L940 280Z" fill="#f2f2ee" stroke="#2a2f36" strokeWidth="6" />
      <path d="M390 86 L540 86 L570 156 L330 156Z" fill="#bfd8e8" />
      <rect x="30" y="200" width="910" height="26" fill="#1e3a8a" />
      <text x="700" y="252" fontSize="30" fontWeight="700" fill="#1e3a8a" fontFamily="Plex Thai, sans-serif">ตำรวจ</text>
      <rect x="400" y="48" width="130" height="24" rx="8" fill={Math.floor(f / 8) % 2 ? '#e5383b' : '#2f6be0'} />
      {[180, 790].map(cx => <g key={cx}><circle cx={cx} cy={290} r={58} fill="#1a1c20" /><circle cx={cx} cy={290} r={26} fill="#9aa0a8" /></g>)}
    </svg>
  </div>
);
