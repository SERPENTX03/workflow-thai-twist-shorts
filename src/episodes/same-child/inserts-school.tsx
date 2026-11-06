import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {appear} from '../../engine/anim';
import {T} from '../../engine/theme';
import {Plate} from '../../kit/stage';
import {Hand, Ink, Page} from '../../kit/inserts';
import {KidShoe} from '../../kit/childroom';
import {Cctv} from '../../kit/pov';
import {C} from './cast';

// Chapter 3–4 clues from the school store room: the ป.2 class photo, the newspaper clipping, Prae's camera with its
// three clips, and the seventh envelope.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const SKIN = C.skin;
const Table: React.FC<{c?: string}> = ({c = 'linear-gradient(#5a4330, #3a2a1c)'}) => <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: c}} />;
const RedRing: React.FC<{x: number; y: number; w: number; h: number; f: number; at?: number}> = ({x, y, w, h, f, at = 8}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `7px solid ${T.red}`, borderRadius: 26, opacity: appear(f, at, 10), boxShadow: '0 0 24px rgba(229,56,59,.5)'}} />
);
const Label: React.FC<{text: string; x: number; y: number; w: number; color?: string}> = ({text, x, y, w, color = T.white}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: 'center', fontFamily: T.display, fontSize: 40, color, textShadow: '0 3px 10px rgba(0,0,0,.6)'}}>{text}</div>
);
const STAR = 'polygon(50% 0, 62% 38%, 100% 38%, 69% 60%, 80% 100%, 50% 75%, 20% 100%, 31% 60%, 0 38%, 38% 38%)';

/** one child in the class photo; `girl` adds two short pigtails; the name card can be mirror-written */
const Kid: React.FC<{x: number; y: number; girl?: boolean; sign?: string; reversed?: boolean; s?: number}> = ({x, y, girl, sign, reversed, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-34 90 Q-34 40 0 38 Q34 40 34 90Z" fill="#f2efe6" />
    <circle cx="0" cy="0" r="30" fill="#dca27a" />
    <path d="M-30 -2 Q-28 -32 0 -32 Q28 -32 30 -2 Q16 -18 0 -17 Q-16 -18 -30 -2Z" fill="#1b1a20" />
    {girl && <><circle cx="-32" cy="-4" r="10" fill="#1b1a20" /><circle cx="32" cy="-4" r="10" fill="#1b1a20" /></>}
    <circle cx="-10" cy="2" r="3" fill="#1a1a22" /><circle cx="10" cy="2" r="3" fill="#1a1a22" />
    <path d="M-8 14 Q0 19 8 14" stroke="#7a3b34" strokeWidth="2.5" fill="none" />
    {sign && (
      <g transform="translate(0 64)">
        <rect x="-40" y="-18" width="80" height="40" fill="#fbf8ef" stroke="#8a8276" strokeWidth="2" />
        <text x="0" y="12" textAnchor="middle" fontSize="26" fontWeight="700" fill="#2a2a2a" fontFamily="Plex Thai, sans-serif" transform={reversed ? 'scale(-1 1)' : undefined}>{sign}</text>
      </g>
    )}
  </g>
);

const NAMES = ['บอย', 'นุ่น', 'อู๋', 'เอก', 'แก้ม', 'ต้อง', 'มิ้น', 'เจ', 'ปาล์ม', 'ฟ้า', 'เบียร์', 'ออม', 'ตาล', 'ภู', 'โอม', 'แพม', 'บีม'];

/** ป.2 class photo from twenty years ago; the girl at the back holds her card mirror-written.
 *  data.mark 'girl' | 'sign' rings her / her card; data.cover = a finger over the card; view class-mirror = read in glass */
export const ClassPhotoScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const v = p.shot.view ?? 'class';
  const d = D(p);
  const name: string = d.name ?? 'ฝน';
  if (v === 'class-mirror') {
    return (
      <Plate p={p} light="lamp" z={[1.04, 1.1]}>
        <Table c="linear-gradient(#6a4a30, #3a2a1c)" />
        <div style={{position: 'absolute', left: 1080, top: 260, width: 560, height: 320, padding: 14, background: '#f6f2ea', transform: 'rotate(3deg)', boxShadow: '0 16px 40px rgba(0,0,0,.5)'}}>
          <div style={{position: 'absolute', inset: 14, background: '#efe9da', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.ui, fontWeight: 700, fontSize: 130, color: '#2a2a2a', transform: 'scaleX(-1)'}}>{name}</div>
        </div>
        <Label text="กระดาษในรูป" x={1080} y={620} w={560} />
        <div style={{position: 'absolute', left: 220, top: 200, width: 700, height: 600, background: 'linear-gradient(135deg, rgba(200,225,235,.55), rgba(150,180,195,.45))', boxShadow: 'inset 0 0 0 16px #4a3424'}}>
          <div style={{position: 'absolute', left: 180, top: 180, width: 340, height: 200, background: 'rgba(239,233,218,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.ui, fontWeight: 700, fontSize: 130, color: '#2a2a2a', opacity: appear(f, 8, 20)}}>{name}</div>
          <div style={{position: 'absolute', left: 40, top: 0, width: 110, height: 600, background: 'rgba(255,255,255,.22)', transform: 'skewX(-12deg)'}} />
        </div>
        <Label text="ในกระจกตู้รางวัล" x={220} y={130} w={700} color={T.gold} />
      </Plate>
    );
  }
  // photo is 1352×812 inside a 1400×860 print at (260, 110); the girl sits back row, right of centre
  const gx = 1000, gy = 150;
  const zoom = d.mark === 'sign' || d.cover;
  const sx = 284 + gx, sy = 134 + gy;
  const rows: [number, number][] = [[6, 290], [6, 440], [5, 590]];
  return (
    <Plate p={p} light="lamp" z={zoom ? [1.5, 1.6] : [1, 1.05]} ox={zoom ? sx : 960} oy={zoom ? sy + 60 : 540}>
      <Table />
      <div style={{position: 'absolute', left: 260, top: 110, width: 1400, height: 860, padding: 24, boxSizing: 'border-box', background: '#f6f2ea', boxShadow: '0 24px 60px rgba(0,0,0,.5)', filter: 'sepia(.35) saturate(.8)'}}>
        <svg width={1352} height={812} style={{display: 'block'}}>
          <rect width="1352" height="812" fill="#c9d6dc" />
          <rect y="560" width="1352" height="252" fill="#b8a27a" />
          {rows.map(([n, y], ri) => Array.from({length: n}, (_, i) => {
            const x = 676 + (i - (n - 1) / 2) * 200 + (ri === 1 ? 30 : 0);
            return <Kid key={`${ri}-${i}`} x={x} y={y} sign={NAMES[(ri * 6 + i) % NAMES.length]} s={1.1} />;
          }))}
          <Kid x={gx} y={gy} girl sign={name} reversed s={1.1} />
          <text x="676" y="790" textAnchor="middle" fontSize="34" fill="#4a3a2a" fontFamily="Plex Thai, sans-serif">ชั้น ป.2 · โรงเรียนบ้านท่าน้อย</text>
        </svg>
      </div>
      {d.mark === 'girl' && <RedRing x={sx - 60} y={sy - 50} w={120} h={180} f={f} />}
      {d.mark === 'sign' && <RedRing x={sx - 56} y={sy + 50} w={112} h={64} f={f} />}
      {d.cover && <Hand x={sx - 140} y={sy + 90} s={0.55} skin={SKIN} sleeve={C.phak} mode="open" />}
    </Plate>
  );
};

/** newspaper clipping: data {head, ago, mark: 6 rings the death toll} */
export const NewsScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  return (
    <Plate p={p} light="lamp" z={[1, 1.06]} oy={500}>
      <Table c="linear-gradient(#6a4a30, #3a2a1c)" />
      <div style={{position: 'absolute', left: 360, top: 120, width: 1200, height: 840, background: '#e9e2cc', transform: 'rotate(-2deg)', boxShadow: '0 24px 60px rgba(0,0,0,.5)', filter: 'sepia(.25)'}}>
        <div style={{position: 'absolute', left: 50, top: 30, fontFamily: T.ui, fontSize: 28, color: '#5a5a5a'}}>ข่าวท้องถิ่น · {d.ago ?? 'ยี่สิบปีก่อน'}</div>
        <div style={{position: 'absolute', left: 50, top: 80, width: 1100, fontFamily: T.display, fontSize: 70, lineHeight: 1.15, color: '#1a1a1a'}}>{d.head ?? ''}</div>
        <div style={{position: 'absolute', left: 50, top: 300, width: 560, height: 380, background: '#7a7a72', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 230, width: 560, height: 150, background: '#5a6460'}} />
          <div style={{position: 'absolute', left: 110, top: 150, width: 320, height: 130, background: '#d8c24a', transform: 'rotate(14deg)', borderRadius: 10}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: 560, height: 380, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.1) 0 2px, transparent 2px 5px)'}} />
        </div>
        {Array.from({length: 11}, (_, i) => <div key={i} style={{position: 'absolute', left: 650, top: 310 + i * 34, width: 500 - (i % 4) * 30, height: 12, background: '#9a9486'}} />)}
        {d.mark === 6 && <div style={{position: 'absolute', left: 640, top: 160, width: 520, height: 100, border: `7px solid ${T.red}`, borderRadius: 50, opacity: appear(f, 6, 10)}} />}
      </div>
    </Plate>
  );
};

/** the old camera Phak gave Prae: star sticker, a three-clip card. data.playing 1 = her hand on a drawn village map,
 *  2 = a dim room (her whisper), 3 = black (sound only); data.freeze = paused on her face; data.sticker rings the star */
export const CameraScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  const files: number = d.files ?? 3;
  const play: number | undefined = d.playing;
  let screen: React.ReactNode;
  if (d.freeze) {
    screen = (
      <svg width={560} height={380}>
        <rect width="560" height="380" fill="#3a4250" />
        <circle cx="280" cy="200" r="110" fill="#e9bd98" />
        <path d="M170 206 Q172 90 280 88 Q388 90 390 206 Q372 130 280 126 Q188 130 170 206Z" fill="#211a1c" />
        <circle cx="240" cy="200" r="8" fill="#1a1a22" /><circle cx="320" cy="200" r="8" fill="#1a1a22" />
        <ellipse cx="280" cy="260" rx="22" ry="14" fill="#7a3b34" />
        <rect x="24" y="24" width="18" height="50" fill="#fff" /><rect x="52" y="24" width="18" height="50" fill="#fff" />
      </svg>
    );
  } else if (play === 1) {
    screen = (
      <svg width={560} height={380}>
        <rect width="560" height="380" fill="#e9e2cc" />
        <path d="M30 140 Q140 330 280 330 Q420 330 530 140" stroke="#4a7ab0" strokeWidth="18" fill="none" opacity=".6" />
        {Array.from({length: 7}, (_, i) => {
          const a = Math.PI * (0.1 + i * 0.133);
          return <rect key={i} x={280 - Math.cos(a) * 230 - 16} y={120 + Math.sin(a) * 170 - 16} width={32} height={26} fill="#f2ead8" stroke="#3a3a3a" strokeWidth="3" />;
        })}
        {d.map && Array.from({length: 6}, (_, i) => <rect key={'e' + i} x={60 + i * 76} y={20} width={60} height={70} fill="#d9c9a0" stroke="#8a7f6d" strokeWidth="2" />)}
        <g transform={`translate(${380 + Math.sin(f / 12) * 20} 270)`}>
          <rect x="-200" y="-26" width="150" height="52" fill={C.prae} />
          <ellipse rx="56" ry="36" fill="#e9bd98" /><rect x="36" y="-12" width="80" height="24" rx="12" fill="#e9bd98" />
        </g>
      </svg>
    );
  } else if (play === 2) {
    screen = (
      <svg width={560} height={380}>
        <rect width="560" height="380" fill="#1a1e26" />
        <rect x="200" y="60" width="160" height="300" fill="#0a0c10" stroke="#3a3a42" strokeWidth="8" />
        <rect x="0" y="330" width="560" height="50" fill="#2a2620" />
        <circle cx="430" cy="200" r={30 + 4 * Math.sin(f / 5)} fill="none" stroke="rgba(255,230,170,.35)" strokeWidth="4" />
      </svg>
    );
  } else if (play === 3) {
    screen = <svg width={560} height={380}><rect width="560" height="380" fill="#050607" /><text x="280" y="200" textAnchor="middle" fill="#6a6a72" fontSize="30" fontFamily="Plex Thai, sans-serif">ไม่มีภาพ · มีแต่เสียง</text></svg>;
  } else {
    screen = (
      <svg width={560} height={380}>
        <rect width="560" height="380" fill="#121620" />
        {Array.from({length: files}, (_, i) => (
          <g key={i} transform={`translate(${30 + i * 176} 110)`}>
            <rect width="150" height="110" fill={['#c9b38a', '#2a2e38', '#0a0a0c'][i % 3]} stroke="#f6c445" strokeWidth={i === 0 ? 4 : 0} />
            <text x="75" y="150" textAnchor="middle" fill="#cbd5e1" fontSize="24" fontFamily="Plex Thai, sans-serif">{`คลิป ${i + 1}`}</text>
          </g>
        ))}
      </svg>
    );
  }
  if ((d.fx as string[] | undefined)?.includes('cctv')) {
    // the clip itself, full frame, as recorded footage (cinematography S16)
    return (
      <Cctv W={p.W} H={p.H} f={f} cam={`CLIP ${play ?? 1}/${files}`} time={['10:12:04', '10:18:40', '10:31:15'][(play ?? 1) - 1] ?? '10:12:04'} tint="grey" glitch={0.2}>
        <div style={{position: 'absolute', left: 0, top: -110, width: 560, height: 380, transform: 'scale(3.43)', transformOrigin: '0 0'}}>{screen}</div>
      </Cctv>
    );
  }
  return (
    <Plate p={p} light="lamp" z={[1.02, 1.08]} oy={520}>
      <Table c="linear-gradient(#8a949e, #5a646e)" />
      <div style={{position: 'absolute', left: 520, top: 200, width: 880, height: 600, background: '#24242a', borderRadius: 40, boxShadow: '0 30px 70px rgba(0,0,0,.6)'}}>
        <div style={{position: 'absolute', left: 60, top: 60, width: 560, height: 380, overflow: 'hidden', borderRadius: 8, boxShadow: '0 0 0 8px #121216'}}>{screen}</div>
        {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 700, top: 90 + i * 110, width: 70, height: 70, borderRadius: '50%', background: '#3a3a42'}} />)}
        <div style={{position: 'absolute', left: 690, top: 460, width: 100, height: 100, background: '#f6c445', clipPath: STAR, transform: 'rotate(-8deg)'}} />
        {play && <div style={{position: 'absolute', left: 60, top: 480, fontFamily: T.ui, fontSize: 34, color: T.red}}>● คลิป {play} / {files}</div>}
        {d.sticker && <RedRing x={670} y={440} w={140} h={140} f={f} />}
      </div>
      <Hand x={460} y={720} s={1.3} skin={SKIN} sleeve={C.phak} mode="grip" />
    </Plate>
  );
};

/** the seventh envelope, folded from exercise paper: front = the teacher's stamp; back (data.drawing) = blue-cross shoe + note */
export const EnvelopeScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  const back = !!d.drawing;
  return (
    <Plate p={p} light="lamp" z={[1.02, 1.08]}>
      <Table c="linear-gradient(#6a4a30, #3a2a1c)" />
      <Page x={460} y={170} w={1000} h={720} rot={back ? 2 : -2}>
        {!back && <div style={{position: 'absolute', left: 80, top: 100}}><Ink text="แบบฝึกหัดคัดลายมือ ป.2" size={40} color="#5a5a62" /></div>}
        {!back && (
          <div style={{position: 'absolute', left: 420, top: 300, padding: '16px 30px', border: '6px solid #c0262b', borderRadius: 14, color: '#c0262b', fontFamily: T.display, fontSize: 64,
            transform: `rotate(-10deg) scale(${1.2 - 0.2 * appear(f, 4, 10)})`, opacity: appear(f, 4, 10), whiteSpace: 'nowrap'}}>{d.stamp ?? ''}</div>
        )}
        {back && <div style={{position: 'absolute', left: 270, top: 120}}><KidShoe s={2.6} /></div>}
        {back && <div style={{position: 'absolute', left: 230, top: 470, opacity: appear(f, 10, 16)}}><Ink text={`"${d.note ?? ''}"`} size={64} color="#1e3a7a" /></div>}
      </Page>
    </Plate>
  );
};
