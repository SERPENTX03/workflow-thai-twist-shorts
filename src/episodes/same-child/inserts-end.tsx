import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {appear} from '../../engine/anim';
import {T} from '../../engine/theme';
import {Plate} from '../../kit/stage';
import {Hand, Ink, Page} from '../../kit/inserts';
import {ChildPhoto} from '../../kit/childroom';
import {RoomPic} from './inserts';
import {C} from './cast';

// Chapter 7–9 inserts: Rampai's bedside drawer, Prae's torn pages, the spoon in the cabinet mirror, Ton in six rooms,
// and the two photos at the car (the thumb, the self-timer).

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const SKIN = C.skin;
const Table: React.FC<{c?: string}> = ({c = 'linear-gradient(#2a221a, #14100c)'}) => <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: c}} />;
const RedRing: React.FC<{x: number; y: number; w: number; h: number; f: number; at?: number}> = ({x, y, w, h, f, at = 8}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `7px solid ${T.red}`, borderRadius: 26, opacity: appear(f, at, 10), boxShadow: '0 0 24px rgba(229,56,59,.5)'}} />
);

const BrownBook: React.FC<{x: number; y: number; label: string; rot?: number}> = ({x, y, label, rot = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 300, height: 380, background: '#8a5a32', borderRadius: 6, transform: `rotate(${rot}deg)`, boxShadow: '0 10px 24px rgba(0,0,0,.5), inset 22px 0 0 #5e3a1e'}}>
    <div style={{position: 'absolute', left: 60, top: 60, width: 200, height: 70, background: '#efe6cf', borderRadius: 4, textAlign: 'center', lineHeight: '70px', fontFamily: T.ui, fontWeight: 600, fontSize: 30, color: '#3a3a3a'}}>{label}</div>
  </div>
);

/** the bedside drawer pulled open: three brown notebooks labelled by job; slot = an empty envelope waiting for Phak's */
export const DrawerScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  const labels: string[] = d.labels ?? ['', '', ''];
  return (
    <Plate p={p} light="lamp" z={[1.02, 1.08]} oy={560}>
      <Table c="linear-gradient(#3a2a1c, #1e140c)" />
      <div style={{position: 'absolute', left: 260, top: 200, width: 1400, height: 760, background: '#4a3424', boxShadow: 'inset 0 0 0 26px #6a4a30, 0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{position: 'absolute', left: 26, top: 26, width: 1348, height: 708, background: '#1e140c'}} />
        {[0, 1, 2].map(i => <BrownBook key={i} x={80 + i * 330} y={140 + i * 14} label={labels[i] ?? ''} rot={(i - 1) * 3} />)}
        {d.slot && (
          <div style={{position: 'absolute', left: 1090, top: 180, width: 240, height: 320, background: '#d9c9a0', boxShadow: '0 10px 24px rgba(0,0,0,.5)', opacity: appear(f, 4, 14)}}>
            <div style={{position: 'absolute', left: 20, top: 120, width: 200}}><Ink text="พี่ชายครู" size={40} color="#5a2a24" /></div>
          </div>
        )}
      </div>
      <div style={{position: 'absolute', left: 860, top: 960, width: 200, height: 40, borderRadius: 20, background: '#c9a24a'}} />
    </Plate>
  );
};

/** Prae's torn-out pages. match = the ragged edge laid against the stubs in Phak's notebook; label = the empty envelope;
 *  page 'last' = her last entry */
export const TornScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  if (d.label) {
    return (
      <Plate p={p} light="lamp" z={[1.04, 1.1]}>
        <Table c="linear-gradient(#3a2a1c, #1e140c)" />
        <div style={{position: 'absolute', left: 560, top: 200, width: 800, height: 620, background: '#d9c9a0', boxShadow: '0 20px 50px rgba(0,0,0,.6)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 800, height: 260, background: '#cbb88a', clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}} />
          <div style={{position: 'absolute', left: 170, top: 330, opacity: appear(f, 6, 14)}}><Ink text={d.label} size={96} color="#5a2a24" /></div>
        </div>
      </Plate>
    );
  }
  if (d.page === 'last') {
    const lines = ['วันนี้ป้าถามว่าพี่จำหนูได้จากอะไร', 'หนูบอกว่าเสียงเคาะ', 'แต่หนูโกหกป้าว่า พี่เคาะตอบสามที'];
    return (
      <Plate p={p} light="lamp" z={[1.02, 1.08]}>
        <Table c="linear-gradient(#3a2a1c, #1e140c)" />
        <Page x={420} y={130} w={1080} h={800} rot={1.5}>
          <svg width={40} height={800} style={{position: 'absolute', left: 0, top: 0}}>
            <path d={`M0 0 ${Array.from({length: 40}, (_, i) => `L${10 + (i % 3) * 8} ${i * 20 + 10} L0 ${i * 20 + 20}`).join(' ')}`} fill="#1e140c" />
          </svg>
          {lines.map((l, i) => (
            <div key={i} style={{position: 'absolute', left: 90, top: 120 + i * 128, opacity: appear(f, 4 + i * 8, 12)}}><Ink text={l} size={54} color={i === 2 ? '#b0262b' : '#27324a'} /></div>
          ))}
        </Page>
      </Plate>
    );
  }
  // match: the torn page's left edge against the stubs left in Phak's notebook
  return (
    <Plate p={p} light="lamp" z={[1.04, 1.12]} ox={900}>
      <Table c="linear-gradient(#3a2a1c, #1e140c)" />
      <div style={{position: 'absolute', left: 300, top: 180, width: 520, height: 720, background: '#8a5a32', borderRadius: 8, boxShadow: '0 20px 50px rgba(0,0,0,.6)'}}>
        <div style={{position: 'absolute', right: 0, top: 0, width: 40, height: 720, background: '#5e3a1e'}} />
        <svg width={44} height={720} style={{position: 'absolute', left: 520, top: 0}}>
          <path d={`M0 0 ${Array.from({length: 36}, (_, i) => `L${12 + (i % 3) * 9} ${i * 20 + 10} L0 ${i * 20 + 20}`).join(' ')}`} fill="#efe6cf" />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 900, top: 160, width: 720, height: 760, background: '#efe6cf', boxShadow: '0 20px 50px rgba(0,0,0,.6)',
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 63px, rgba(80,100,140,.22) 63px 65px)'}}>
        <svg width={44} height={760} style={{position: 'absolute', left: -40, top: 0}}>
          <path d={`M44 0 ${Array.from({length: 38}, (_, i) => `L${32 - (i % 3) * 9} ${i * 20 + 10} L44 ${i * 20 + 20}`).join(' ')}`} fill="#efe6cf" />
        </svg>
        <div style={{position: 'absolute', left: 50, top: 60}}><Ink text="แพร · จดไว้กันลืม" size={44} color="#27324a" /></div>
      </div>
      <RedRing x={800} y={150} w={150} h={780} f={f} />
    </Plate>
  );
};

/** the medicine-cabinet mirror at night: in the glass, a hand holding a spoon to the wood behind the cabinet */
export const SpoonMirrorScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const tap = Math.sin(f / 4) > 0.6 ? -10 : 0;
  return (
    <Plate p={p} light="night" z={[1.04, 1.12]}>
      <Table c="linear-gradient(#3a4654, #26303c)" />
      <div style={{position: 'absolute', left: 560, top: 140, width: 800, height: 800, background: '#e9e4d6', border: '24px solid #b8ae98', boxShadow: '0 20px 50px rgba(0,0,0,.6)'}}>
        <div style={{position: 'absolute', inset: 30, background: 'linear-gradient(135deg, #2a3440, #141a22)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 740, height: 740, background: 'repeating-linear-gradient(90deg, #1e1610 0 6px, #2a1e14 6px 90px)', opacity: 0.8}} />
          {/* the reflected hand, in Rampai's sleeve, tapping the spoon */}
          <div style={{position: 'absolute', left: 360, top: 300 + tap, width: 360, height: 90, background: C.rampai, borderRadius: 40, transform: 'rotate(-10deg)'}} />
          <div style={{position: 'absolute', left: 300, top: 300 + tap, width: 100, height: 90, borderRadius: 40, background: '#d8a27c', transform: 'rotate(-10deg)'}} />
          <div style={{position: 'absolute', left: 170, top: 316 + tap, width: 170, height: 16, borderRadius: 8, background: '#d8dde3', transform: 'rotate(-10deg)'}} />
          <div style={{position: 'absolute', left: 150, top: 300 + tap, width: 50, height: 40, borderRadius: '50%', background: '#d8dde3', transform: 'rotate(-10deg)'}} />
          <div style={{position: 'absolute', left: -60, top: -20, width: 120, height: 900, background: 'rgba(255,255,255,.08)', transform: 'rotate(18deg)'}} />
        </div>
      </div>
      <RedRing x={680} y={380} w={300} h={150} f={f} at={14} />
    </Plate>
  );
};

/** Ton in six rooms at once: the same child-room photo six times, a different wall colour each, the same boy on every bed */
export const Rooms6Scene: React.FC<ShotProps> = p => {
  const {f} = p;
  const walls = ['#cfa98a', '#a08a68', '#9fb0c8', '#c8b07a', '#a8b89a', '#c4a0a8'];
  return (
    <Plate p={p} light="lamp" z={[1, 1.05]}>
      <Table />
      {walls.map((w, i) => (
        <div key={i} style={{position: 'absolute', left: 140 + (i % 3) * 560, top: 130 + Math.floor(i / 3) * 420, padding: 12, background: '#f6f2ea', transform: `rotate(${(i - 2.5) * 1.5}deg)`, boxShadow: '0 12px 30px rgba(0,0,0,.5)', opacity: appear(f, i * 4, 10)}}>
          <div style={{position: 'relative', width: 500, height: 281, overflow: 'hidden'}}>
            <RoomPic house="mali" w={500} f={f} />
            <div style={{position: 'absolute', inset: 0, background: w, mixBlendMode: 'multiply', opacity: 0.55}} />
            <div style={{position: 'absolute', left: 230, top: 120, width: 34, height: 34, borderRadius: '50%', background: '#1b1a20'}} />
            <div style={{position: 'absolute', left: 222, top: 150, width: 50, height: 60, borderRadius: '20px 20px 6px 6px', background: '#d8d0b8'}} />
          </div>
        </div>
      ))}
    </Plate>
  );
};

/** the shot of the shoes that came out as Prae's thumb over the lens */
export const ThumbPhotoScene: React.FC<ShotProps> = p => (
  <Plate p={p} light="dawn" z={[1, 1.04]}>
    <Table c="linear-gradient(#6a5a48, #3a2e22)" />
    <div style={{position: 'absolute', left: 460, top: 140, width: 1000, height: 760, padding: 22, background: '#f6f2ea', transform: 'rotate(-2deg)', boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
      <div style={{position: 'relative', width: 956, height: 716, overflow: 'hidden', background: 'linear-gradient(#4a5a6e, #2a3440)'}}>
        <div style={{position: 'absolute', left: 300, top: 420, width: 300, height: 90, borderRadius: 30, background: '#f2efe6', boxShadow: '0 20px 0 #f6c445', filter: 'blur(6px)'}} />
        <div style={{position: 'absolute', left: 180, top: -80, width: 620, height: 900, borderRadius: '48% 48% 40% 40%', background: 'radial-gradient(circle at 50% 40%, #f0c8a8, #c99070 70%)'}} />
        <div style={{position: 'absolute', left: 330, top: 40, width: 280, height: 300, borderRadius: '46% 46% 30% 30%', background: 'rgba(255,235,225,.55)', boxShadow: 'inset 0 -14px 0 rgba(200,140,120,.5)'}} />
        <div style={{position: 'absolute', left: 260, top: 420, width: 420, height: 14, borderRadius: 7, background: 'rgba(150,90,70,.35)'}} />
      </div>
    </div>
  </Plate>
);

/** the self-timer photo: Prae laughing, whole, beside the car; Phak only half a shoulder at the edge. keep = saved */
export const TimerPhotoScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  return (
    <Plate p={p} light="dawn" z={[1, 1.05]}>
      <Table c="linear-gradient(#6a5a48, #3a2e22)" />
      <div style={{position: 'absolute', left: 400, top: 120, width: 1120, height: 800, padding: 22, background: '#f6f2ea', transform: 'rotate(1.5deg)', boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
        <svg width={1076} height={756} style={{display: 'block'}}>
          <rect width="1076" height="756" fill="#d8c8b8" />
          <rect y="0" width="1076" height="420" fill="#e8c8a0" />
          <rect y="560" width="1076" height="196" fill="#b8a888" />
          <path d="M0 560 L60 460 Q100 440 260 430 L340 360 L620 360 L700 440 Q860 450 900 500 L900 600 L0 600Z" fill="#7a8a9a" />
          {/* Prae, laughing, full in frame */}
          <g transform="translate(520 300)">
            <path d="M-80 330 Q-84 150 0 144 Q84 150 80 330Z" fill={C.prae} />
            <circle cx="0" cy="70" r="70" fill="#e9bd98" />
            <path d="M-72 78 Q-72 -4 0 -6 Q72 -4 72 78 Q60 34 0 28 Q-60 34 -72 78Z" fill="#211a1c" />
            <path d="M-26 66 Q-18 58 -10 66 M10 66 Q18 58 26 66" stroke="#1a1a22" strokeWidth="5" fill="none" />
            <path d="M-26 96 Q0 130 26 96Z" fill="#7a3b34" />
            <rect x="52" y="210" width="26" height="20" rx="3" fill={C.praePatch} transform="rotate(-24 65 220)" />
          </g>
          {/* half of Phak's shoulder at the right edge, blurred by the run */}
          <path d="M1000 756 Q990 470 1076 440 L1076 756Z" fill={C.phak} opacity=".9" />
        </svg>
      </div>
      {d.keep && <div style={{position: 'absolute', left: 1420, top: 820, padding: '12px 26px', borderRadius: 18, background: 'rgba(12,14,20,.85)', border: `3px solid ${T.gold}`, fontFamily: T.display, fontSize: 36, color: T.gold, opacity: appear(f, 8, 10)}}>เก็บรูปนี้ ✓</div>}
      <Hand x={1640} y={760} s={1} skin={SKIN} sleeve={C.phak} mode="grip" flip rot={-20} />
    </Plate>
  );
};

export {ChildPhoto};
