import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../../engine/episode';
import {appear, kf} from '../../engine/anim';
import {T} from '../../engine/theme';
import {Plate} from '../../kit/stage';
import {Hand, Ink, Page} from '../../kit/inserts';
import {ChildPhoto, ChildRoom, KidShoe, ToyCar} from '../../kit/childroom';
import {PhoneScene as KitPhone} from '../../kit/phone';
import {MemoryNotebook} from '../../kit/notebook';
import {Grain} from '../../kit/horror';
import {HOUSE} from './sets';
import {C} from './cast';

// Full-frame inserts for every clue in same-child. Words on paper / screens come from shot.data.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const SKIN = C.skin;
const box = (x: number, y: number, w: number | string, h: number | string, bg: string, extra?: React.CSSProperties): React.CSSProperties =>
  ({position: 'absolute', left: x, top: y, width: w, height: h, background: bg, ...extra});
const Label: React.FC<{text: string; x: number; y: number; w: number; color?: string}> = ({text, x, y, w, color = T.white}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: 'center', fontFamily: T.display, fontSize: 40, color, textShadow: '0 3px 10px rgba(0,0,0,.6)'}}>{text}</div>
);
const RedRing: React.FC<{x: number; y: number; w: number; h: number; f: number; at?: number}> = ({x, y, w, h, f, at = 8}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `7px solid ${T.red}`, borderRadius: 26, opacity: appear(f, at, 10), boxShadow: '0 0 24px rgba(229,56,59,.5)'}} />
);

/** a printed photo of one house's child room (the whole ChildRoom, scaled) */
export const RoomPic: React.FC<{house: keyof typeof HOUSE; w: number; f: number; crop?: [number, number, number]; tint?: string}> = ({house, w, f, crop, tint}) => {
  const [cx, cy, z] = crop ?? [960, 540, 1];
  const s = (w / 1920) * z;
  const h = (w * 1080) / 1920;
  return (
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <ChildRoom f={f} {...HOUSE[house]} />
      </div>
      {tint && <div style={{position: 'absolute', inset: 0, background: tint}} />}
    </div>
  );
};

const Print: React.FC<{x: number; y: number; rot?: number; children: React.ReactNode; label?: string}> = ({x, y, rot = 0, children, label}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, padding: 18, paddingBottom: label ? 70 : 18, background: '#f6f2ea', boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
    {children}
    {label && <div style={{position: 'absolute', left: 0, bottom: 14, width: '100%', textAlign: 'center', fontFamily: T.ui, fontSize: 34, fontWeight: 600, color: '#3a3a3a'}}>{label}</div>}
  </div>
);

const Table: React.FC<{c?: string}> = ({c = 'linear-gradient(#5a4330, #3a2a1c)'}) => <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: c}} />;

// ---------------------------------------------------------------- photos

export const PhotoScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const v = p.shot.view ?? 'pair';
  const d = D(p);
  if (v === 'pair') {
    return (
      <Plate p={p} light="day" z={[1, 1.04]}>
        <Table />
        <Print x={120} y={250} rot={-2} label="บ้านป้ารำไพ"><RoomPic house="rumpai" w={780} f={f} /></Print>
        <Print x={1010} y={270} rot={1.5} label="บ้านมะลิ"><RoomPic house="mali" w={780} f={f} /></Print>
      </Plate>
    );
  }
  if (v === 'overlay') {
    // three prints slide onto one another; 'under' rings the shadow under the bed (the only place they differ)
    const k = kf(f, [[0, 0], [Math.min(40, p.len * 0.6), 1]]);
    const houses: (keyof typeof HOUSE)[] = ['stilt', 'mali', 'rumpai'];
    return (
      <Plate p={p} light="lamp" z={[1, 1.04]}>
        <Table c="linear-gradient(#24282e, #121418)" />
        {houses.map((h, i) => (
          <div key={h} style={{position: 'absolute', left: 260 + (1 - k) * (i - 1) * 420, top: 160 + (1 - k) * (i - 1) * 40, opacity: i === 0 ? 1 : 0.5}}>
            <RoomPic house={h} w={1400} f={f} />
          </div>
        ))}
        {d.step === 'under' && <RedRing x={260 + 1400 * 0.42} y={160 + 787 * 0.75} w={1400 * 0.34} h={787 * 0.2} f={f} at={2} />}
      </Plate>
    );
  }
  if (v === 'under') {
    const items: string[] = d.items ?? ['medal', 'shoe', 'empty'];
    const names = ['บ้านลุงเพิ่ม', 'บ้านมะลิ', 'บ้านป้ารำไพ'];
    const houses: (keyof typeof HOUSE)[] = ['stilt', 'mali', 'rumpai'];
    return (
      <Plate p={p} light="lamp" z={[1, 1.03]}>
        <Table c="linear-gradient(#24282e, #121418)" />
        {items.map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 90 + i * 600, top: 260}}>
            <Print x={0} y={0} label={names[i]}><RoomPic house={houses[i]} w={540} f={f} crop={[1110, 860, 2.6]} /></Print>
            {d.mark === i && <RedRing x={-10} y={-10} w={596} h={420} f={f} />}
          </div>
        ))}
      </Plate>
    );
  }
  if (v === 'print' || v === 'mirror') {
    // the print of Mali's room on the copy-shop cutting mat; mirror = pushed into the medicine cabinet glass
    const mirror = v === 'mirror';
    const crop: [number, number, number] = mirror ? [1565, 370, 4.2] : d.mirror ? [1400, 380, 1.9] : [1100, 400, 1.5];
    return (
      <Plate p={p} light="day" z={mirror ? [1.02, 1.08] : [1, 1.04]}>
        <Table c="repeating-linear-gradient(0deg, #2e6a4a 0 2px, #3a7a58 2px 60px)" />
        <Print x={mirror ? 260 : 320} y={mirror ? 90 : 140} rot={-1}><RoomPic house="mali" w={mirror ? 1360 : 1240} f={f} crop={crop} /></Print>
        {mirror && d.mark === 'compare' && (
          <>
            <div style={{position: 'absolute', left: 1500, top: 220, padding: 10, background: '#f6f2ea', transform: 'rotate(3deg)', boxShadow: '0 12px 30px rgba(0,0,0,.5)'}}><ChildPhoto kind="boy" w={220} h={280} /></div>
            <Label text="บนผนัง" x={1480} y={540} w={280} />
            <Label text="ในกระจก" x={680} y={30} w={600} color={T.gold} />
          </>
        )}
        {mirror && d.mark === 'badge' && <RedRing x={880} y={440} w={120} h={110} f={f} />}
        {!mirror && <Hand x={1640} y={900} s={1.2} skin={SKIN} sleeve={C.phak} mode="grip" rot={-20} />}
      </Plate>
    );
  }
  return <Plate p={p}><Table /></Plate>;
};

// ---------------------------------------------------------------- phone pictures

/** Children's Day photo: a boy on a little chair, arm round Prae's shoulder; prae=false → bare wall, the arm round
 *  nothing; hand → a hand from the wall edge holds the paper flower; hand 'fade' → it fades out */
const ChildDay: React.FC<{f: number; prae: boolean; hand?: boolean | string; mark?: string}> = ({f, prae, hand, mark}) => {
  const handO = hand === 'fade' ? 1 - appear(f, 4, 26) : hand ? appear(f, 6, 18) : 0;
  return (
    <svg width={428} height={808} viewBox="0 0 428 808">
      <rect width="428" height="808" fill="#0f1726" />
      <rect x="0" y="150" width="428" height="520" fill="#e6dccb" />
      <path d="M0 160 H428" stroke="#c95b6a" strokeWidth="8" strokeDasharray="20 14" />
      <rect x="0" y="590" width="428" height="80" fill="#c9b38a" />
      {/* boy on a chair (left) */}
      <rect x="70" y="520" width="110" height="80" fill="#8a6444" />
      <path d="M80 600 Q78 470 125 466 Q172 470 170 600Z" fill="#f2efe6" />
      <circle cx="125" cy="430" r="40" fill="#dca27a" />
      <path d="M85 428 Q88 386 125 386 Q162 386 165 428 Q148 404 125 406 Q102 404 85 428Z" fill="#1b1a20" />
      <circle cx="112" cy="430" r="4" fill="#1a1a22" /><circle cx="138" cy="430" r="4" fill="#1a1a22" />
      <path d="M112 450 Q125 458 138 450" stroke="#7a3b34" strokeWidth="3" fill="none" />
      {/* his arm reaching right, around a shoulder */}
      <path d="M160 500 Q220 470 268 470" stroke="#f2efe6" strokeWidth="22" strokeLinecap="round" fill="none" />
      <circle cx="270" cy="470" r="13" fill="#dca27a" />
      {mark === 'arm' && <rect x="150" y="440" width="150" height="70" rx="20" fill="none" stroke={T.red} strokeWidth="6" />}
      {prae && (
        <g>
          {/* Prae kneeling, light-blue jacket, paper flower in hand */}
          <path d="M230 640 Q226 500 300 494 Q372 500 368 640Z" fill={C.prae} />
          <circle cx="300" cy="440" r="44" fill="#e9bd98" />
          <path d="M254 446 Q254 392 300 390 Q346 392 346 446 Q340 420 300 414 Q262 420 254 446Z" fill="#211a1c" />
          <circle cx="286" cy="444" r="4" fill="#1a1a22" /><circle cx="314" cy="444" r="4" fill="#1a1a22" />
          <path d="M286 466 Q300 476 314 466" stroke="#7a3b34" strokeWidth="3" fill="none" />
          <rect x="332" y="560" width="22" height="16" rx="3" fill={C.praePatch} transform="rotate(-24 343 568)" />
        </g>
      )}
      {(prae || handO > 0) && (
        <g opacity={prae ? 1 : handO}>
          {!prae && <path d="M428 540 Q380 540 352 548" stroke="#e9bd98" strokeWidth="26" strokeLinecap="round" />}
          <circle cx={prae ? 250 : 340} cy={prae ? 560 : 546} r="14" fill="#e9bd98" />
          <path d={`M${prae ? 250 : 340} ${prae ? 556 : 540} v-80`} stroke="#3a7a3a" strokeWidth="5" />
          {Array.from({length: 6}, (_, i) => {
            const a = (i * Math.PI) / 3;
            const cx = (prae ? 250 : 340) + Math.cos(a) * 20, cy = (prae ? 478 : 462) + Math.sin(a) * 20;
            return <circle key={i} cx={cx} cy={cy} r="14" fill="#f2a6c0" />;
          })}
          <circle cx={prae ? 250 : 340} cy={prae ? 478 : 462} r="10" fill="#f6c445" />
        </g>
      )}
      <text x="214" y="730" textAnchor="middle" fontSize="28" fill="#e6e1d6" fontFamily="Plex Thai, sans-serif">วันเด็ก ✿ ป.2</text>
    </svg>
  );
};

export const PhoneScene: React.FC<ShotProps> = p => {
  const d = D(p);
  return (
    <KitPhone p={p} sleeve={C.phak} skin={SKIN} photo={v => {
      if (v === 'childday') return <ChildDay f={p.f} prae={d.prae !== false && !d.hand} hand={d.hand} mark={d.mark} />;
      if (v === 'photo') return (
        <>
          <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 34}}>บ้าน{d.house ?? ''} · รูปเมื่อเช้า</div>
          <div style={{position: 'absolute', left: 0, top: 240}}><RoomPic house="rumpai" w={428} f={p.f} /></div>
        </>
      );
      return null;
    }} />
  );
};

// ---------------------------------------------------------------- hand / object close-ups

const Boards: React.FC<{c0?: string; c1?: string}> = ({c0 = '#7a5a3e', c1 = '#5a3f2a'}) => (
  <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080,
    background: `repeating-linear-gradient(0deg, ${c1} 0 6px, ${c0} 6px 130px)`}} />
);

const YellowSneaker: React.FC<{s?: number; flip?: boolean}> = ({s = 1, flip}) => (
  <svg width={320 * s} height={150 * s} viewBox="0 0 320 150" style={{display: 'block', transform: flip ? 'scaleX(-1)' : undefined}}>
    <path d="M16 112 Q10 56 80 48 L170 40 Q260 44 300 100 L304 120 Q160 132 16 124Z" fill="#f2efe6" stroke="#5a5a62" strokeWidth="4" />
    <path d="M14 120 Q160 134 306 120 L306 140 Q160 152 14 138Z" fill="#f6c445" stroke="#a07a1a" strokeWidth="3" />
    {[0, 1, 2, 3].map(i => <path key={i} d={`M${110 + i * 26} 56 l14 26`} stroke="#5a5a62" strokeWidth="5" />)}
  </svg>
);

const FishBead: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={130 * s} height={70 * s} viewBox="0 0 130 70" style={{display: 'block'}}>
    <path d="M10 35 Q40 4 84 14 Q104 20 110 35 Q104 50 84 56 Q40 66 10 35Z" fill="#d8a85a" stroke="#7a5a2a" strokeWidth="3" />
    <path d="M108 35 L128 18 L124 35 L128 52Z" fill="#d8a85a" stroke="#7a5a2a" strokeWidth="3" />
    <path d="M30 30 q14 -12 30 -4 M40 44 q16 6 34 -2" stroke="#3b7fc4" strokeWidth="4" fill="none" />
    <path d="M60 24 q6 10 0 22" stroke="#e5383b" strokeWidth="4" fill="none" />
    <circle cx="26" cy="32" r="4" fill="#2a2a2a" />
    <circle cx="94" cy="35" r="5" fill="#3a2a1a" />
  </svg>
);

export const HandScene: React.FC<ShotProps> = p => {
  const {f, len} = p;
  const v = p.shot.view ?? '';
  const d = D(p);
  if (v === 'toycar') {
    const x = kf(f, [[0, 260], [Math.min(36, len * 0.5), 820]]);
    return (
      <Plate p={p} light="day" z={[1.02, 1.08]} oy={620}>
        <Boards />
        <div style={{position: 'absolute', left: 1180, top: 420, width: 300, height: 560, background: '#24303d', borderRadius: '40px 40px 0 0'}} />
        <div style={{position: 'absolute', left: 1120, top: 860, width: 400, height: 140, background: '#2a2a30', borderRadius: '60px 80px 20px 20px'}} />
        <div style={{position: 'absolute', left: x, top: 640}}><ToyCar s={3.2} /></div>
        <RedRing x={x + 250} y={760} w={180} h={170} f={f} at={Math.min(40, len * 0.6)} />
      </Plate>
    );
  }
  if (v === 'shoes') {
    return (
      <Plate p={p} light={d.light ?? 'day'} z={[1, 1.05]} oy={560}>
        <Table c="linear-gradient(90deg, #4a5a6e, #5c6e84 50%, #4a5a6e)" />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 8px, transparent 8px 60px)'}} />
        <div style={{position: 'absolute', left: 520, top: 420, transform: 'rotate(-6deg)'}}><YellowSneaker s={1.7} /></div>
        <div style={{position: 'absolute', left: 860, top: 560, transform: 'rotate(4deg)'}}><YellowSneaker s={1.7} flip /></div>
        {d.give && <Hand x={1500} y={700} s={1.3} skin={SKIN} sleeve={C.phak} mode="open" flip />}
      </Plate>
    );
  }
  if (v === 'log') {
    // school sign-in book: two signed rows each day, then one blank row; dent = a pressed signature in it
    const rows = [['ครูสมใจ', 'ส.ใจดี'], ['ครูวิไล', 'วิไล'], ['', '']];
    return (
      <Plate p={p} light="day" z={[1.02, 1.1]} ox={900} oy={560}>
        <Table c="linear-gradient(#8a6444, #6a4a30)" />
        <Page x={360} y={160} w={1200} h={780}>
          <div style={{position: 'absolute', left: 40, top: 20}}><Ink text="สมุดลงเวลาปฏิบัติราชการ" size={40} color="#3a3a3a" /></div>
          {[0, 1, 2].map(day => rows.map(([n, sig], r) => (
            <div key={`${day}-${r}`} style={{position: 'absolute', left: 60, top: 110 + (day * 3 + r) * 64, width: 1080, height: 64}}>
              <div style={{position: 'absolute', left: 0, fontFamily: T.ui, fontSize: 30, lineHeight: '64px', color: '#555'}}>{`${12 + day} ต.ค.`}</div>
              <div style={{position: 'absolute', left: 220}}><Ink text={n} size={34} /></div>
              <div style={{position: 'absolute', left: 640}}><Ink text={sig} size={34} color="#1e3a7a" /></div>
              {!n && d.dent && day === 1 && <div style={{position: 'absolute', left: 220, top: 6, opacity: 0.18, filter: 'blur(.6px)'}}><Ink text="ครูแพร        แพร" size={34} color="#fff" style={{textShadow: '0 -1px 0 rgba(0,0,0,.6)'}} /></div>}
              {!n && <div style={{position: 'absolute', left: 200, top: 8, width: 860, height: 48, border: d.blank && day === 1 ? `4px dashed ${T.red}` : undefined, borderRadius: 10, opacity: appear(f, 6, 10)}} />}
            </div>
          )))}
        </Page>
        {d.dent && <Hand x={760} y={620} s={1} skin={SKIN} sleeve={C.phak} mode="open" rot={-12} />}
      </Plate>
    );
  }
  if (v === 'notebook-cover') {
    // a brown school notebook, ragged stubs along the spine where pages were torn out
    return (
      <Plate p={p} light="lamp" z={[1, 1.06]}>
        <Table />
        <div style={{position: 'absolute', left: 680, top: 220, width: 560, height: 700, transform: 'rotate(-7deg)'}}>
          <div style={{position: 'absolute', left: 14, top: 14, width: 560, height: 700, background: '#efe6cf', borderRadius: 8}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: 560, height: 700, background: '#8a5a32', borderRadius: 8, boxShadow: '0 24px 60px rgba(0,0,0,.5)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 56, height: 700, background: '#5e3a1e', borderRadius: '8px 0 0 8px'}} />
            <div style={{position: 'absolute', left: 140, top: 110, width: 320, height: 100, background: '#efe6cf', borderRadius: 6}}>
              {[30, 62].map(y => <div key={y} style={{position: 'absolute', left: 24, top: y, width: 270, height: 3, background: 'rgba(80,100,140,.35)'}} />)}
            </div>
            <div style={{position: 'absolute', left: 400, top: 0, width: 26, height: 700, background: '#2a2a30', opacity: 0.85}} />
          </div>
          {/* torn stubs sticking out along the spine edge */}
          <svg width={60} height={700} style={{position: 'absolute', left: 56, top: -18}}>
            {Array.from({length: 9}, (_, i) => <path key={i} d={`M0 ${30 + i * 74} l${22 + (i % 3) * 8} -8 l-6 18 l14 6 l-30 10Z`} fill="#efe6cf" />)}
          </svg>
        </div>
        <RedRing x={700} y={170} w={150} h={800} f={f} at={16} />
      </Plate>
    );
  }
  if (v === 'coat') {
    return (
      <Plate p={p} light={d.light} z={[1.02, 1.08]} oy={520}>
        <Table c={d.kid ? 'linear-gradient(#b89f7d, #9a8160)' : 'linear-gradient(#3a2a1c, #241a12)'} />
        <div style={{position: 'absolute', left: 300, top: 180, width: 1320, height: 720, background: C.prae, borderRadius: 80, transform: 'rotate(-8deg)', boxShadow: 'inset -60px -40px 0 rgba(0,0,0,.12)'}}>
          <div style={{position: 'absolute', left: 760, top: 260, width: 220, height: 160, background: C.praePatch, borderRadius: 14, transform: 'rotate(-24deg)', border: '6px solid #8f7c56'}}>
            {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 16, top: 24 + i * 32, width: 180, height: 0, borderTop: '4px dashed #6b5a3a'}} />)}
          </div>
        </div>
        {d.kid ? <Hand x={1420} y={420} s={0.8} skin="#dca27a" mode="open" rot={160} /> : <Hand x={360} y={840} s={1.2} skin={SKIN} sleeve={C.phak} mode="grip" rot={-10} />}
      </Plate>
    );
  }
  if (v === 'plaster') {
    return (
      <Plate p={p} light={d.light} z={[1.1, 1.4]} ox={1060} oy={640}>
        <Table c="linear-gradient(#8fa6a0, #7a928c)" />
        <div style={{position: 'absolute', left: 640, top: 90}}><ChildPhoto kind="boy" w={640} h={810} /></div>
      </Plate>
    );
  }
  if (v === 'bead') {
    return (
      <Plate p={p} light={d.light} z={[1.04, 1.14]} ox={960} oy={520}>
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: '#2a1e14'}} />
        {/* two floorboards with a gap, the bead stuck between them */}
        <div style={{position: 'absolute', left: -700, top: 200, width: 3320, height: 290, background: 'linear-gradient(#8a6a48, #6a4b31)'}} />
        <div style={{position: 'absolute', left: -700, top: 540, width: 3320, height: 290, background: 'linear-gradient(#8a6a48, #6a4b31)'}} />
        <div style={{position: 'absolute', left: -700, top: 490, width: 3320, height: 50, background: 'linear-gradient(#0c0806, #1e140c)'}} />
        <div style={{position: 'absolute', left: 820, top: 470}}><FishBead s={1.9} /></div>
        {d.keys && (
          <div style={{position: 'absolute', left: 1380, top: 140, width: 400, height: 300, background: '#f6f2ea', padding: 14, transform: 'rotate(4deg)', boxShadow: '0 20px 40px rgba(0,0,0,.5)', filter: 'sepia(.3)'}}>
            <div style={{position: 'absolute', inset: 14, background: 'linear-gradient(#cfd8c8, #9fae9a)'}}>
              <div style={{position: 'absolute', left: 90, top: 70, width: 70, height: 110, background: '#9aa0a8', borderRadius: '30px 30px 8px 8px'}} />
              <div style={{position: 'absolute', left: 170, top: 120}}><FishBead s={1.1} /></div>
            </div>
          </div>
        )}
      </Plate>
    );
  }
  if (v === 'coin') {
    return (
      <Plate p={p} light={d.light} z={[1.02, 1.08]} oy={640}>
        <Boards />
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 760, background: '#a08a68'}} />
        <div style={{position: 'absolute', left: 860, top: 700, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(#e6e0c8, #b8a878)', boxShadow: '0 6px 0 #7a6a48'}}>
          <div style={{position: 'absolute', inset: 0, textAlign: 'center', lineHeight: '150px', fontFamily: T.display, fontSize: 70, color: '#7a6a48'}}>1</div>
        </div>
        <div style={{position: 'absolute', left: 1240, top: 300, width: 260, height: 200, background: '#1a1a1e', borderRadius: 24}}>
          <div style={{position: 'absolute', left: 80, top: 50, width: 100, height: 100, borderRadius: '50%', background: '#3a4a66', boxShadow: 'inset 0 0 0 14px #2a2a30'}} />
        </div>
        {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 1360, top: 500, width: 10, height: 460, background: '#2a2a30', transformOrigin: '50% 0', transform: `rotate(${(i - 1) * 22}deg)`}} />)}
      </Plate>
    );
  }
  if (v === 'shoe') {
    return (
      <Plate p={p} light={d.light} z={[1.04, 1.12]} oy={600}>
        <Boards />
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 880, background: 'linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.2))'}} />
        <div style={{position: 'absolute', left: 560, top: 520}}><KidShoe s={4} /></div>
        {/* the pencil hooking the lace */}
        <div style={{position: 'absolute', left: 1080, top: 380, width: 640, height: 26, background: '#f6c445', transform: 'rotate(-28deg)', transformOrigin: '0 50%', borderRadius: 6, boxShadow: 'inset 0 -6px 0 #c9a22a'}} />
        {d.mark === 'knot' && <RedRing x={1080} y={720} w={150} h={150} f={f} />}
      </Plate>
    );
  }
  return <Plate p={p}><Table /></Plate>;
};

// ---------------------------------------------------------------- map, notebook, clock, title

/** the tiffin-delivery chart: seven houses along the canal bend, numbered from the road head; names fill in under them */
export const MapScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  const names: Record<string, string> = d.names ?? {};
  const pos = [[300, 300], [500, 420], [720, 510], [950, 550], [1180, 510], [1390, 420], [1570, 300]];
  return (
    <Plate p={p} light={d.light === 'night' ? 'lamp' : d.light} z={[1, 1.04]}>
      <Table />
      <Page x={160} y={120} w={1600} h={840} rot={-0.8}>
        <svg width={1600} height={840} style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M60 420 Q300 820 800 820 Q1300 820 1540 420" stroke="#4a7ab0" strokeWidth="40" fill="none" opacity=".55" strokeLinecap="round" />
          <path d="M40 120 H360" stroke="#6a6a6a" strokeWidth="14" strokeDasharray="30 16" />
          <text x="60" y="100" fontSize="32" fill="#5a5a5a" fontFamily="Plex Thai, sans-serif">ถนนเข้า</text>
        </svg>
        <div style={{position: 'absolute', left: 1180, top: 40}}><Ink text="ส่งปิ่นโต" size={48} color="#5a2a24" /></div>
        {pos.map(([x, y], i) => {
          const n = i + 1;
          const hl = d.mark === 'all' || d.mark === n;
          return (
            <div key={i} style={{position: 'absolute', left: x - 140, top: y - 220}}>
              <svg width={120} height={100}><path d="M10 95 V45 L60 8 L110 45 V95Z" fill="#f2ead8" stroke="#3a3a3a" strokeWidth="5" /></svg>
              <div style={{position: 'absolute', left: 0, top: 100, width: 120, textAlign: 'center', fontFamily: T.display, fontSize: 40, color: '#3a3a3a'}}>{n}</div>
              {names[n] && <div style={{position: 'absolute', left: -40, top: 150, width: 200, textAlign: 'center', opacity: appear(f, 6, 14)}}><Ink text={names[n]} size={44} color="#b0262b" /></div>}
              {hl && <div style={{position: 'absolute', left: -20, top: -16, width: 160, height: 170, borderRadius: '50%', border: `6px solid ${T.red}`, opacity: appear(f, 6, 10)}} />}
            </div>
          );
        })}
      </Page>
    </Plate>
  );
};

export const NotebookScene: React.FC<ShotProps> = p => <MemoryNotebook p={p} title="สิ่งที่รู้แน่ ๆ เกี่ยวกับแพร" counter={n => `จำแพรได้ ${n} ข้อ`} />;

export const ClockScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  const [hh, mm] = String(d.due ?? '20:00').split(':').map(Number);
  const ha = ((hh % 12) / 12) * 360 + mm * 0.5, ma = (mm / 60) * 360;
  return (
    <AbsoluteFill style={{background: '#0d1016'}}>
      <svg width={1920} height={1080}>
        <g transform="translate(620 540)">
          <circle r="300" fill="#1c2230" stroke={T.gold} strokeWidth="12" />
          <circle r="262" fill="#f6f2ea" />
          {Array.from({length: 12}, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <line key={i} x1={Math.sin(a) * 214} y1={-Math.cos(a) * 214} x2={Math.sin(a) * 244} y2={-Math.cos(a) * 244} stroke="#1e293b" strokeWidth={i % 3 === 0 ? 10 : 5} />;
          })}
          <line x1="0" y1="0" x2={Math.sin((ha * Math.PI) / 180) * 140} y2={-Math.cos((ha * Math.PI) / 180) * 140} stroke="#0f172a" strokeWidth="18" strokeLinecap="round" />
          <line x1="0" y1="0" x2={Math.sin((ma * Math.PI) / 180) * 200} y2={-Math.cos((ma * Math.PI) / 180) * 200} stroke="#0f172a" strokeWidth="11" strokeLinecap="round" />
          <line x1="0" y1="0" x2={Math.sin(f / 5) * 220} y2={-Math.cos(f / 5) * 220} stroke={T.red} strokeWidth="5" />
          <circle r="16" fill={T.red} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 1050, top: 330, width: 720, padding: '40px 0', borderRadius: 28, background: '#1a1420', border: `6px solid ${T.gold}`, textAlign: 'center',
        transform: `scale(${0.94 + 0.06 * appear(f, 2, 12)})`}}>
        <div style={{fontFamily: T.display, fontSize: 46, color: '#cbd5e1'}}>{d.label ?? ''}</div>
        <div style={{fontFamily: T.display, fontSize: 150, color: T.gold, lineHeight: 1.1}}>{d.due ?? ''}</div>
        <div style={{fontFamily: T.display, fontSize: 40, color: '#fca5a5'}}>น.</div>
      </div>
      <Grain f={f} opacity={0.1} />
    </AbsoluteFill>
  );
};

export const TitleScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  const lines = String(d.title ?? '').split('\n');
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #1e2630 0%, #07090d 72%)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: 0.18, filter: 'blur(3px)'}}>
        <RoomPic house="rumpai" w={1920} f={f} />
      </div>
      <div style={{textAlign: 'center', opacity: appear(f, 4, 18), transform: `translateY(${(1 - appear(f, 4, 18)) * 20}px)`}}>
        {lines.map((l, i) => (
          <div key={i} style={{fontFamily: T.display, fontSize: i === 0 ? 96 : 120, fontWeight: 700, color: i === 0 ? T.white : T.gold, lineHeight: 1.25,
            textShadow: '0 6px 30px rgba(0,0,0,.8)'}}>{l}</div>
        ))}
        {d.note && <div style={{marginTop: 40, fontFamily: T.ui, fontSize: 30, color: '#9aa4b2'}}>{d.note}</div>}
      </div>
      <Grain f={f} opacity={0.14} />
    </AbsoluteFill>
  );
};
