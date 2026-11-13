import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {appear, backOut, kf, rnd} from '../../engine/anim';
import {T} from '../../engine/theme';
import {D, Macro, Pool, Svg} from '../../kit/frame';
import {Grain} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {FaceEcu} from '../../kit/ecu';
import {EndCardScene} from '../../kit/EndCard';
import {C, ROSTER} from './cast';
import {TvScreen} from './places';

// Inserts (brief.md → Sets and inserts): every clue object drawn big for itself, in the light of the place it lives in.
// Hands come from the side the character stands on in the neighbouring shots (May: her left hand holds the syringe).

const GLOVE = '#dfe7ee', SKIN_M = '#e2b996', SKIN_W = C.skinW, SKIN_P = '#c9a184', SKIN_N = '#d9b08f';
const TH = 'Kanit';

const Txt: React.FC<{x: number; y: number; size?: number; color?: string; children: React.ReactNode; w?: number; rot?: number; weight?: number; font?: string; center?: boolean}> = ({x, y, size = 44, color = '#222', children, w, rot = 0, weight = 500, font = TH, center}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, transform: `rotate(${rot}deg)`, transformOrigin: '0 0', whiteSpace: w ? 'normal' : 'nowrap', textAlign: center ? 'center' : undefined}}>{children}</div>
);
const HANDW = '"Itim", "Kanit", cursive';

/** a phone held or lying, its screen drawn by `children` in a 600 × 1100 box */
const Phone: React.FC<{x: number; y: number; s?: number; rot?: number; children: React.ReactNode; dark?: boolean}> = ({x, y, s = 1, rot = 0, children, dark}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 600, height: 1100, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: '0 0'}}>
    <div style={{position: 'absolute', inset: 0, background: '#0b0c0e', borderRadius: 64, boxShadow: '0 30px 60px rgba(0,0,0,.55)'}} />
    <div style={{position: 'absolute', left: 22, top: 22, right: 22, bottom: 22, borderRadius: 46, overflow: 'hidden', background: dark ? '#111418' : '#f4f5f7'}}>{children}</div>
  </div>
);
const Bubble: React.FC<{me?: boolean; children: React.ReactNode; top: number}> = ({me, children, top}) => (
  <div style={{position: 'absolute', top, [me ? 'right' : 'left']: 24, maxWidth: 420, padding: '14px 22px', borderRadius: 28, background: me ? '#7ed36b' : '#ffffff', fontFamily: TH, fontSize: 34, color: '#1a1a1a', boxShadow: '0 2px 4px rgba(0,0,0,.12)'}}>{children}</div>
);

const Syringe: React.FC<{x: number; y: number; s?: number; rot?: number; label?: string; full?: number}> = ({x, y, s = 1, rot = 0, label, full = 1}) => (
  <Svg><g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-34} width={520} height={68} rx={10} fill="#eef4f6" stroke="#9fb0b6" strokeWidth={4} opacity={0.95} />
    <rect x={-300 + 520 * (1 - full)} y={-26} width={520 * full - 8} height={52} fill="#d9eef6" opacity={0.7} />
    {Array.from({length: 10}, (_, i) => <line key={i} x1={-260 + i * 48} y1={-34} x2={-260 + i * 48} y2={-14} stroke="#5a6a70" strokeWidth={3} />)}
    <rect x={-380} y={-20} width={80} height={40} fill="#cfd8db" /><rect x={-420} y={-60} width={30} height={120} rx={8} fill="#cfd8db" />
    <path d="M220 -12 L300 -6 L300 6 L220 12 Z" fill="#b9c4c8" /><line x1={300} y1={0} x2={440} y2={0} stroke="#aab3b6" strokeWidth={5} />
    {label && <g><rect x={-180} y={-46} width={300} height={92} rx={6} fill="#fbf8ee" stroke="#cfc8b6" strokeWidth={3} />
      <text x={-30} y={-6} textAnchor="middle" fontFamily={HANDW} fontSize={40} fill={C.greenD}>{label.split('|')[0]}</text>
      <text x={-30} y={34} textAnchor="middle" fontFamily={HANDW} fontSize={34} fill={C.greenD}>{label.split('|')[1] ?? ''}</text></g>}
  </g></Svg>
);

const Vial: React.FC<{x: number; y: number; s?: number; rot?: number; label?: boolean; back?: boolean}> = ({x, y, s = 1, rot = 0, label = true, back}) => (
  <Svg><g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-150} width={120} height={260} rx={22} fill="#e9f1f4" opacity={0.9} stroke="#b9c8cd" strokeWidth={4} />
    <rect x={-46} y={-196} width={92} height={50} rx={8} fill="#c22a24" /><rect x={-32} y={-150} width={64} height={14} fill="#9aa4a8" />
    {label && !back && <g><rect x={-60} y={-80} width={120} height={150} fill="#ffffff" /><rect x={-60} y={-80} width={120} height={34} fill="#c22a24" />
      <text x={0} y={-56} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={14} fill="#fff">WARNING:</text>
      <text x={0} y={-24} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={15} fill="#1a1a1a">VECURONIUM</text>
      <text x={0} y={-4} textAnchor="middle" fontFamily="Arial" fontSize={11} fill="#c22a24">PARALYZING AGENT</text>
      {[16, 30, 44, 58].map(yy => <rect key={yy} x={-46} y={yy} width={92} height={5} fill="#c9c9c9" />)}</g>}
    {back && <g><rect x={-60} y={-80} width={120} height={150} fill="#ffffff" />{[-66, -50, -34, -18, -2, 14, 30, 46].map(yy => <rect key={yy} x={-46} y={yy} width={92} height={5} fill="#b8b8b8" />)}</g>}
  </g></Svg>
);

const BG = {
  ward: '#1a1612', steel: '#8e9396', day: '#c8bb98', desk: '#4a3420', night: '#07080a', white: '#e9ebe8',
};

/** lamp-lit counter top (wood) */
const Counter: React.FC<{night?: boolean}> = ({night = true}) => (
  <Svg><rect x={0} y={0} width={1920} height={1080} fill={night ? '#3a2a1a' : '#a98a63'} />{Array.from({length: 7}, (_, i) => <line key={i} x1={0} y1={i * 170 + 40} x2={1920} y2={i * 170 + 10} stroke={night ? '#2a1d12' : '#8d7150'} strokeWidth={5} />)}</Svg>
);
const Blanket: React.FC<{day?: boolean}> = ({day}) => (
  <Svg><rect x={0} y={0} width={1920} height={1080} fill={day ? '#eef1ef' : '#c9d0cd'} />{Array.from({length: 6}, (_, i) => <path key={i} d={`M-40 ${180 * i + 60} Q960 ${180 * i + 20} 1960 ${180 * i + 90}`} stroke={day ? '#d6dbd8' : '#aab3af'} strokeWidth={14} fill="none" />)}</Svg>
);
const Lamp: React.FC<{x?: number; y?: number; a?: number}> = ({x = 300, y = 300, a = 0.45}) => <Pool x={x} y={y} rx={800} color="255,210,150" a={a} />;

const RULES_TEXT = ['ฉีดยาตามเวลา ทุกชั่วโมง ห้ามข้าม', 'ห้ามเปิดม่านเตียงสอง เด็ดขาด', 'หลังตีสาม อย่าขานรับ เสียงเคาะประตูกระจก', 'ห้ามแกะเทปปิดตาคนไข้', 'ถ้าคนไข้ขยับ ให้ฉีดเข็มถัดไปทันที'];

const RulesSheet: React.FC<{x: number; y: number; rot?: number; s?: number; money?: boolean}> = ({x, y, rot = -3, s = 1, money}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 900, height: 980, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: '0 0', background: '#f6f1e2', boxShadow: '0 20px 40px rgba(0,0,0,.5)', padding: '50px 60px', boxSizing: 'border-box',
    backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 77px, rgba(80,110,150,.22) 77px 79px)'}}>
    <div style={{fontFamily: HANDW, fontSize: 54, color: C.greenD, marginBottom: 18}}>กฎเฝ้าไข้ เตียง 1</div>
    {RULES_TEXT.map((t, i) => <div key={i} style={{fontFamily: HANDW, fontSize: 44, color: C.greenD, lineHeight: '79px', whiteSpace: 'nowrap'}}>{i + 1}. {t}</div>)}
    {money && <div style={{position: 'absolute', right: 50, top: 46, fontFamily: HANDW, fontSize: 46, color: C.greenD, border: `4px solid ${C.green}`, borderRadius: 40, padding: '2px 22px'}}>5,000 x 3</div>}
  </div>
);

const LogBook: React.FC<{rows: number; filled: number; x?: number; y?: number; rot?: number; empty?: string}> = ({rows, filled, x = 360, y = 90, rot = -2}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 1200, height: 860, transform: `rotate(${rot}deg)`, background: '#f3efe2', boxShadow: '0 20px 40px rgba(0,0,0,.5)', padding: '36px 50px', boxSizing: 'border-box'}}>
    <div style={{display: 'flex', fontFamily: TH, fontSize: 32, color: '#444', borderBottom: '3px solid #777', paddingBottom: 8}}><div style={{width: 200}}>เวลา</div><div style={{width: 420}}>ยา</div><div>ผู้ให้ยา</div></div>
    {Array.from({length: rows}, (_, i) => {
      const h = (22 + i) % 24;
      return <div key={i} style={{display: 'flex', fontSize: 34, height: 64, alignItems: 'center', borderBottom: '2px solid #cfc8b6'}}>
        <div style={{width: 200, fontFamily: TH, color: '#333'}}>{String(h).padStart(2, '0')}:00</div>
        <div style={{width: 420, fontFamily: HANDW, color: C.greenD}}>ยากันชัก 1 เข็ม</div>
        <div style={{fontFamily: HANDW, fontSize: 40, color: '#1f3a8a'}}>{i < filled ? 'เมย์ ✓' : ''}</div>
      </div>;
    })}
  </div>
);

const Wristband: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = -8}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 330, height: 74, transform: `rotate(${rot}deg)`, background: '#f7f7f2', border: '3px solid #c9c9c0', borderRadius: 14, fontFamily: TH, fontSize: 34, color: '#333', lineHeight: '68px', paddingLeft: 22, boxSizing: 'border-box'}}>สมศักดิ์ · 72</div>
);

const PatientHand: React.FC<{x: number; y: number; s?: number; rot?: number; ink?: number; twitch?: boolean; f: number}> = ({x, y, s = 1.4, rot = 10, ink = 0, twitch, f}) => {
  const tw = twitch ? (f > 18 && f < 30 ? Math.sin(f) * 4 : f > 40 && f < 50 ? Math.sin(f) * 4 : 0) : 0;
  return (
    <>
      <Hand x={x} y={y} s={s} rot={rot + tw} skin={SKIN_W} sleeve={C.gown} mode="flat" />
      {ink > 0 && <Svg><ellipse cx={x + 150 * s} cy={y + 70 * s} rx={26 * s} ry={20 * s} fill="#7a4aa8" opacity={0.35 * ink} /></Svg>}
    </>
  );
};

const Doc: React.FC<{x: number; y: number; w: number; h: number; rot?: number; children: React.ReactNode; bg?: string}> = ({x, y, w, h, rot = 0, children, bg = '#f4f1e6'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, background: bg, boxShadow: '0 20px 40px rgba(0,0,0,.5)', padding: '40px 50px', boxSizing: 'border-box', overflow: 'hidden'}}>{children}</div>
);
const Lines: React.FC<{n: number; from?: number; w?: number}> = ({n, from = 0, w = 100}) => <>{Array.from({length: n}, (_, i) => <div key={i} style={{height: 14, width: `${w - (rnd(17, i + from) * 30)}%`, background: '#cfc9b9', margin: '18px 0'}} />)}</>;

const PatientEyes: React.FC<{p: ShotProps; tape: 'on' | 'peel' | 'back'; hand?: boolean}> = ({p, tape, hand}) => {
  const f = p.f, u = 1920 * 0.95 / 120;
  const X = (sx: number) => 960 + (sx - 100) * u, Y = (sy: number) => 1080 * 0.44 + (sy - 66) * u;
  const peel = tape === 'peel' ? kf(f, [[0, 0], [p.len, 1]]) : tape === 'back' ? 1 - kf(f, [[0, 0], [p.len * 0.7, 1]]) : 0;
  return (
    <Macro p={p} bg="#0a0c0c" z={1.04} ox={960} oy={460} at={[50, 44]} vig={0.6}>
      <FaceEcu who={peel > 0.6 ? 'wora shock acc=none' : 'wora sleep acc=none'} roster={ROSTER} f={f} len={p.len} part="eyes" fill={0.95} at={[0.5, 0.44]} shade="l" shadeA={0.4}
        back={<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #e8ece9 0%, #9aa3a0 45%, #2a302e 100%)'}} />} bg="#1a1e1d" />
      <Svg>{[77, 123].map(ex => {
        const lift = ex === 123 ? peel : tape === 'back' ? 0 : 0;
        return <g key={ex} transform={`translate(${X(ex)} ${Y(74)}) rotate(${(ex < 100 ? -6 : 6) - lift * 40}) translate(${lift * 14 * u} ${-lift * 10 * u})`}><rect x={-15 * u} y={-6 * u} width={30 * u} height={12 * u} rx={2 * u} fill="#f4f2ea" opacity={0.96} /></g>;
      })}</Svg>
      {hand && <Hand x={X(150)} y={Y(60)} s={2.2} rot={200} skin={GLOVE} sleeve={C.white} mode="pinch" />}
      <Pool x={1200} y={300} rx={700} color={tape === 'back' ? '255,246,220' : '255,214,150'} a={0.25} />
    </Macro>
  );
};

const Alphabet: React.FC<{p: ShotProps; stop?: string}> = ({p, stop}) => {
  const A = 'กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'.split('');
  const VOW = ['า', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ'];
  const idx = stop ? A.indexOf(stop) : -1;
  const t = kf(p.f, [[0, 0], [p.len * 0.8, 1]]);
  const cur = stop === 'น' ? (t < 0.5 ? idx : -2) : Math.floor(t * 41);
  return (
    <Macro p={p} bg="#0b0a09" z={1.05} ox={960} oy={460} at={[50, 44]}>
      <div style={{position: 'absolute', left: 230, top: 80, width: 1460, height: 900, background: '#f5f2e8', transform: 'rotate(-2deg)', boxShadow: '0 20px 40px rgba(0,0,0,.6)', padding: 40, boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start'}}>
        {A.map((c, i) => <div key={c} style={{width: 125, height: 118, fontFamily: '"Sarabun", "Kanit"', fontSize: 80, color: '#1f3a8a', textAlign: 'center', background: i === cur ? 'rgba(255,220,90,.55)' : undefined}}>{c}</div>)}
        {VOW.map((c, i) => <div key={c} style={{width: 125, height: 110, fontFamily: '"Sarabun", "Kanit"', fontSize: 80, color: '#8a1f1f', textAlign: 'center', background: stop === 'น' && t >= 0.5 && i === 2 ? 'rgba(255,220,90,.55)' : undefined}}>{'อ' + c}</div>)}
      </div>
      {(() => {
        const k = cur >= 0 ? cur : stop === 'น' ? 41 + 2 : 0;
        const col = k % 11, row = Math.floor(k / 11);
        return <Hand x={300 + col * 125 + 60} y={150 + row * 118 + 100} s={1.6} rot={-60} skin={GLOVE} sleeve={C.white} mode="point" />;
      })()}
      <Pool x={960} y={420} rx={700} color="255,236,190" a={0.3} />
    </Macro>
  );
};

const P = (render: (p: ShotProps) => React.ReactNode): React.FC<{p: ShotProps}> => ({p}) => <>{render(p)}</>;

export const VIEWS: Record<string, React.FC<{p: ShotProps}>> = {
  'rules-sheet-ins': P(p => <Macro p={p} bg={BG.night} z={1.07} ox={900} oy={420} at={[48, 42]} vig={0.8}>
    <Svg><rect x={420} y={40} width={1060} height={1060} rx={20} fill="#6b4a2a" /><rect x={800} y={20} width={300} height={70} rx={12} fill="#9aa3a5" /></Svg>
    <RulesSheet x={500} y={110} rot={-2} s={0.95} money />
    <Pool x={1000} y={400} rx={520} color="230,240,255" a={0.35} />
  </Macro>),
  'phone-debt-ins': P(p => <Macro p={p} bg="#0c0b0a" z={1.06} ox={960} oy={460}>
    <Phone x={660} y={20} s={0.92} rot={-4}>
      <div style={{background: '#1f4f8c', height: 220, color: '#fff', fontFamily: TH, fontSize: 40, padding: '60px 40px', boxSizing: 'border-box'}}>กยศ. · ยอดค้างชำระ</div>
      <div style={{fontFamily: TH, fontSize: 96, fontWeight: 700, color: '#1a1a1a', padding: '40px 40px 0'}}>200,000 ฿</div>
      <div style={{fontFamily: TH, fontSize: 34, color: '#777', padding: '0 40px'}}>ครบกำหนดชำระงวดถัดไป</div>
      <div style={{position: 'absolute', left: 20, right: 20, top: 520, background: '#fff', borderRadius: 26, boxShadow: '0 6px 20px rgba(0,0,0,.25)', padding: 26, fontFamily: TH, fontSize: 34, color: '#222', transform: `translateY(${(1 - appear(p.f, 18, 12, backOut(1.2))) * -160}px)`, opacity: appear(p.f, 18, 8)}}>
        <b>น้องต้น</b><br />พี่ ค่าเทอมสิ้นเดือนนะ</div>
    </Phone>
    <Hand x={940} y={980} s={1.5} rot={-90} skin={SKIN_M} sleeve={C.white} mode="grip" />
    <Pool x={960} y={400} rx={520} color="200,220,255" a={0.3} />
  </Macro>),
  'mail-ins': P(p => <Macro p={p} bg="#c8bb98" z={1.06} ox={960} oy={440}>
    <Phone x={660} y={10} s={0.92} rot={3}>
      <div style={{fontFamily: TH, fontSize: 44, fontWeight: 700, padding: '50px 36px 20px'}}>กล่องจดหมาย</div>
      {['รพ.ศูนย์', 'รพ.เอกชน', 'คลินิก', 'รพ.ชุมชน', 'รพ.จังหวัด'].map((h, i) => <div key={i} style={{padding: '18px 36px', borderBottom: '2px solid #ddd', fontFamily: TH}}>
        <div style={{fontSize: 32, color: '#222', fontWeight: 600}}>{h}</div><div style={{fontSize: 30, color: '#666'}}>ขณะนี้ยังไม่มีตำแหน่งว่าง</div></div>)}
    </Phone>
    <Hand x={960} y={1000} s={1.5} rot={-90} skin={SKIN_M} sleeve={C.white} mode="grip" />
    <Pool x={300} y={300} rx={900} color="255,246,220" a={0.35} />
  </Macro>),
  'watch-ins': P(p => <Watch p={p} day />),
  'watch-day-ins': P(p => <Watch p={p} day late />),
  'folder-ins': P(p => <Macro p={p} bg={BG.steel} z={1.06} ox={960} oy={460}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#a8adaf" />{[200, 520, 840].map(y => <line key={y} x1={0} y1={y} x2={1920} y2={y + 20} stroke="#c3c8ca" strokeWidth={4} />)}</Svg>
    <Doc x={440} y={90} w={1040} h={860} rot={-3} bg="#e8d9a8">
      <div style={{background: '#fff', display: 'inline-block', padding: '10px 26px', fontFamily: TH, fontSize: 52, fontWeight: 700}}>สมศักดิ์ · 72 ปี</div>
      <div style={{position: 'absolute', left: 60, top: 160, width: 420, height: 520, background: '#4a6a8a', border: '14px solid #fff', boxShadow: '0 6px 12px rgba(0,0,0,.3)'}}>
        <svg width={420} height={520}><rect x={0} y={0} width={420} height={520} fill="#9ec0de" />{Array.from({length: 6}, (_, i) => <line key={i} x1={40 + i * 70} y1={0} x2={40 + i * 70} y2={520} stroke="#c9b27a" strokeWidth={10} />)}
          <ellipse cx={210} cy={230} rx={60} ry={72} fill="#c9a184" /><path d="M140 190 Q210 120 280 190 L280 200 L140 200 Z" fill="#f0c419" /><rect x={130} y={300} width={160} height={220} rx={30} fill="#6a5a3a" /><path d="M180 260 Q210 280 240 260" stroke="#5a3a2a" strokeWidth={5} fill="none" /></svg></div>
      <div style={{position: 'absolute', left: 540, top: 170, right: 40}}><Lines n={9} /></div>
    </Doc>
    <Hand x={720} y={560} s={1.4} rot={-30} skin={SKIN_N} sleeve={C.white} mode="point" />
    <Pool x={300} y={300} rx={900} color="255,246,220" a={0.3} />
  </Macro>),
  'rules-unfold-ins': P(p => <Macro p={p} bg={BG.steel} z={1.06} ox={960} oy={480}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#a8adaf" /><ellipse cx={1650} cy={300} rx={110} ry={60} fill="#dfe6ea" opacity={0.7} /><rect x={1590} y={150} width={120} height={160} rx={10} fill="#e6f0f4" opacity={0.6} /></Svg>
    <RulesSheet x={460} y={120} rot={-4} s={0.9} />
    <Hand x={380} y={650} s={1.5} rot={-10} skin={SKIN_N} sleeve={C.white} mode="flat" />
    <Svg><g transform="translate(150 60) rotate(12)"><rect x={0} y={0} width={240} height={400} fill={C.white} /><rect x={30} y={-60} width={36} height={160} rx={10} fill={C.green} /></g></Svg>
    <Pool x={300} y={300} rx={900} color="255,246,220" a={0.3} />
  </Macro>),
  'fridge-ins': P(p => <Macro p={p} bg="#050608" z={1.06} ox={960} oy={520} at={[50, 50]} vig={0.85}>
    <Svg><rect x={300} y={-40} width={1320} height={1160} fill="#e6eaec" /><rect x={340} y={0} width={1240} height={1080} fill="#f4f8fa" />
      {[300, 640].map(y => <rect key={y} x={340} y={y} width={1240} height={12} fill="#cfd8db" />)}
      <rect x={480} y={420} width={960} height={200} rx={10} fill="#d8e6ea" stroke="#9fb0b6" strokeWidth={4} />
      <rect x={1300} y={430} width={120} height={60} fill="#fbf6d8" stroke="#c9b27a" strokeWidth={3} /><text x={1360} y={472} textAnchor="middle" fontFamily={TH} fontSize={30} fill="#7a5a10">ห้องยา</text></Svg>
    {Array.from({length: 9}, (_, i) => <Syringe key={i} x={560 + i * 100} y={520} s={0.32} rot={90} />)}
    <Pool x={960} y={300} rx={800} color="230,245,255" a={0.45} />
  </Macro>),
  'syringe-label-ecu': P(p => <Macro p={p} bg="#06080a" z={1.07} ox={900} oy={460} at={[48, 44]} vig={0.85}>
    <Syringe x={960} y={470} s={2.6} rot={-6} label="ยากันชัก|22:00" />
    <Pool x={960} y={700} rx={800} color="230,245,255" a={0.35} />
  </Macro>),
  'inject-close': P(p => <Inject p={p} n={1} />),
  'inject2-close': P(p => <Inject p={p} n={2} />),
  'inject3-close': P(p => <Inject p={p} n={3} />),
  'log-ins': P(p => <Macro p={p} bg="#2a1d12" z={1.05}><Counter /><LogBook rows={9} filled={1} /><Hand x={940} y={360} s={1.3} rot={-40} skin={SKIN_M} sleeve={C.white} mode="pinch" /><Lamp x={400} y={200} /></Macro>),
  'log2-ins': P(p => <Macro p={p} bg="#2a1d12" z={1.06}><Counter /><LogBook rows={11} filled={10} rot={1} /><Lamp x={400} y={200} /></Macro>),
  'log3-ins': P(p => <Macro p={p} bg="#2a1d12" z={1.05}><Counter night={false} /><LogBook rows={11} filled={11} rot={-1} />{Array.from({length: 4}, (_, i) => <Syringe key={i} x={1640} y={300 + i * 140} s={0.4} rot={0} />)}<Pool x={900} y={200} rx={900} color="255,246,220" a={0.35} /></Macro>),
  'photo-bedside-ins': P(p => <Macro p={p} bg="#141210" z={1.06} ox={960} oy={460}>
    <Svg><rect x={0} y={700} width={1920} height={400} fill="#5a5f5c" /><rect x={560} y={70} width={800} height={700} fill="#e2c35a" /><rect x={600} y={110} width={720} height={620} fill="#9ec0de" />
      {Array.from({length: 8}, (_, i) => <line key={i} x1={640 + i * 90} y1={110} x2={640 + i * 90} y2={730} stroke="#c9b27a" strokeWidth={12} />)}
      <ellipse cx={960} cy={400} rx={80} ry={96} fill="#c9a184" /><path d="M870 350 Q960 250 1050 350 L1050 364 L870 364 Z" fill="#f0c419" /><rect x={850} y={500} width={220} height={240} rx={40} fill="#6a5a3a" />
      <circle cx={930} cy={400} r={7} fill="#222" /><circle cx={990} cy={400} r={7} fill="#222" /><path d="M920 450 Q960 480 1000 450" stroke="#5a3a2a" strokeWidth={7} fill="none" /></Svg>
    <Lamp x={200} y={300} a={0.5} />
  </Macro>),
  'lamp-off-ins': P(p => <Macro p={p} bg="#030405" z={1.04} ox={960} oy={460}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#2a1d12" />
      <path d="M700 1000 q-20 -260 260 -400" stroke="#2a2a2a" strokeWidth={22} fill="none" /><path d="M900 560 l200 -40 l40 120 l-220 40 Z" fill="#3a3a38" />
      <rect x={1150} y={760} width={160} height={110} rx={12} fill="#cfcabe" /><rect x={1205} y={780} width={50} height={70} rx={8} fill={p.f > p.len * 0.4 ? '#8a857a' : '#e8e3d6'} /></Svg>
    <Hand x={1260} y={680} s={1.4} rot={-100} skin={SKIN_M} sleeve={C.white} mode="point" />
    {p.f < p.len * 0.4 && <Pool x={1000} y={700} rx={600} color="255,210,150" a={0.55} />}
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={p.f > p.len * 0.4 ? 0.7 : 0} /></Svg>
    {p.f > p.len * 0.4 && <Pool x={200} y={300} rx={300} color="80,255,150" a={0.15} />}
  </Macro>),
  'cash-ins': P(p => <Macro p={p} bg="#a98a63" z={1.05}>
    <Counter night={false} />
    <Doc x={980} y={120} w={760} h={860} rot={4}><div style={{fontFamily: TH, fontSize: 44, fontWeight: 700}}>ใบยินยอมรักษา</div><Lines n={10} /><div style={{marginTop: 30, fontFamily: TH, fontSize: 34}}>ลงชื่อ ................................ พยาน</div></Doc>
    {[0, 1, 2, 3, 4].map(i => <div key={i} style={{position: 'absolute', left: 300 + i * 26, top: 380 - i * 12, width: 520, height: 260, background: '#b9a07a', border: '6px solid #8a6a44', borderRadius: 8, transform: `rotate(${-8 + i * 3}deg)`}}><div style={{fontFamily: TH, fontSize: 70, color: '#5a3a1a', padding: 20}}>1000</div></div>)}
    <Hand x={700} y={720} s={1.5} rot={-20} skin={SKIN_P} sleeve={C.grey} mode="flat" />
    <Pool x={300} y={200} rx={900} color="255,246,220" a={0.35} />
  </Macro>),
  'briefcase-ins': P(p => <Macro p={p} bg="#a98a63" z={1.05} ox={960} oy={520}>
    <Counter night={false} />
    <Svg><rect x={180} y={60} width={1000} height={700} rx={24} fill="#6a4426" /><rect x={210} y={90} width={940} height={640} rx={14} fill="#4a2e18" />
      <rect x={260} y={140} width={560} height={420} fill="#5f8fc4" /><rect x={860} y={180} width={60} height={300} rx={20} fill="#1a1a1a" />
      <rect x={950} y={480} width={170} height={110} rx={16} fill="#2a2a2a" /><rect x={968} y={494} width={134} height={82} rx={10} fill="#7a4aa8" /></Svg>
    <Doc x={980} y={420} w={760} h={640} rot={-6}><div style={{fontFamily: TH, fontSize: 40, fontWeight: 700}}>ใบยินยอมรักษา (3/5)</div><Lines n={6} /><div style={{marginTop: 26, fontFamily: HANDW, fontSize: 52, color: '#1f3a8a'}}>เมย์</div><div style={{fontFamily: TH, fontSize: 30}}>.............................. พยาน</div></Doc>
    <Hand x={1260} y={850} s={1.4} rot={-150} skin={SKIN_M} sleeve={C.white} mode="pinch" />
    <Pool x={300} y={200} rx={900} color="255,246,220" a={0.35} />
  </Macro>),
  'line-chat-ins': P(p => <Macro p={p} bg="#c8bb98" z={1.05} ox={960} oy={440}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#d6cdb4" /><rect x={0} y={0} width={700} height={1080} fill="#fff4d8" opacity={0.6} /></Svg>
    <Phone x={660} y={10} s={0.92} rot={-2}>
      <div style={{height: 120, background: '#2b3a55', color: '#fff', fontFamily: TH, fontSize: 40, padding: '40px 30px', boxSizing: 'border-box'}}>ฝน ER</div>
      <div style={{position: 'absolute', inset: '120px 0 0 0', background: '#8aa8c8'}}>
        <Bubble top={40}>รอดคืนแรกไหมแก</Bubble>
        {p.f > 20 && <Bubble top={150}>ตึกเมตตาเตียงสองผีดุนะเว้ย</Bubble>}
        {p.f > 45 && <Bubble top={300} me>ห้าพันอะแก 😭</Bubble>}
      </div>
    </Phone>
    <Pool x={300} y={300} rx={900} color="255,246,220" a={0.35} />
  </Macro>),
  'pocket-ins': P(p => <Macro p={p} bg="#0a0a0c" z={1.08} ox={960} oy={500} vig={0.8}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill={C.coat} /><path d="M520 380 H1400 V1000 Q960 1060 520 1000 Z" fill="#e3e5e1" stroke="#b9bdb8" strokeWidth={6} />
      {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${720 + i * 150 + Math.sin(p.f / 3 + i) * 6} ${430}) rotate(${-10 + i * 7})`}><rect x={-40} y={-150} width={80} height={170} rx={16} fill="#e9f1f4" stroke="#9fb0b6" strokeWidth={4} /><rect x={-30} y={-180} width={60} height={34} rx={6} fill={i === 2 ? '#2a6aa8' : '#c9c9c9'} /><rect x={-40} y={-100} width={80} height={60} fill="#fff" /></g>)}
      <path d="M520 380 H1400" stroke="#9aa09b" strokeWidth={10} /></Svg>
    <Pool x={1100} y={300} rx={500} color="255,244,210" a={0.4} />
  </Macro>),
  'thumb-ins': P(p => <Macro p={p} bg="#0a0a0a" z={1.06} ox={960} oy={480}><Blanket /><PatientHand x={900} y={500} s={2.2} f={p.f} ink={0.8} /><Wristband x={300} y={620} /><Hand x={280} y={460} s={1.3} rot={20} skin={GLOVE} sleeve={C.white} mode="pinch" /><Lamp x={300} y={200} a={0.4} /></Macro>),
  'thumb2-ins': P(p => <Macro p={p} bg="#0a0a0a" z={1.06} ox={960} oy={480}><Blanket /><PatientHand x={900} y={500} s={2.2} f={p.f} ink={1} /><Wristband x={300} y={620} />
    <Svg><rect x={1050} y={420} width={300} height={200} rx={20} fill="#f4f6f8" opacity={0.9} transform={`rotate(-10 1200 520) translate(${Math.sin(p.f / 5) * 20} 0)`} /></Svg><Lamp x={1300} y={200} a={0.4} /></Macro>),
  'cash-pocket-ins': P(p => <Macro p={p} bg="#0b0806" z={1.08} ox={960} oy={480} vig={0.8}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill={C.khaki} /><path d="M560 300 H1360 V940 H560 Z" fill="#a8976a" stroke={C.khakiD} strokeWidth={8} /><circle cx={960} cy={350} r={22} fill="#5a4a2a" />
      {[0, 1, 2].map(i => <g key={i} transform={`rotate(${-6 + i * 4} 860 330)`}><rect x={640 + i * 20} y={250 - i * 16} width={460} height={190} rx={6} fill="#b9a07a" stroke="#8a6a44" strokeWidth={4} /><text x={680 + i * 20} y={320 - i * 16} fontFamily="Kanit" fontSize={56} fill="#5a3a1a">1000</text></g>)}
      <path d="M560 300 H1360" stroke={C.khakiD} strokeWidth={14} /></Svg>
    <Hand x={1240} y={560} s={1.6} rot={-170} skin={SKIN_P} sleeve={C.khaki} mode="flat" />
    <Pool x={700} y={420} rx={520} color="255,70,50" a={0.18} />
  </Macro>),
  'clock-wall-ins': P(p => <Macro p={p} bg="#050608" z={1.05} ox={960} oy={420}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#2a3530" /><circle cx={960} cy={400} r={300} fill="#e9e9e2" stroke="#2a2a2a" strokeWidth={20} />
      {Array.from({length: 12}, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={960 + Math.sin(a) * 250} y1={400 - Math.cos(a) * 250} x2={960 + Math.sin(a) * 280} y2={400 - Math.cos(a) * 280} stroke="#222" strokeWidth={10} />; })}
      <line x1={960} y1={400} x2={960 + Math.sin((3.33 / 12) * Math.PI * 2) * 150} y2={400 - Math.cos((3.33 / 12) * Math.PI * 2) * 150} stroke="#111" strokeWidth={18} strokeLinecap="round" />
      <line x1={960} y1={400} x2={960 + Math.sin((20 / 60) * Math.PI * 2) * 230} y2={400 - Math.cos((20 / 60) * Math.PI * 2) * 230} stroke="#111" strokeWidth={10} strokeLinecap="round" />
      <circle cx={1500} cy={900} r={130} fill={C.watch} stroke={C.watchD} strokeWidth={12} /><circle cx={1500} cy={900} r={104} fill="#f7f6ef" />
      <line x1={1500} y1={900} x2={1500 + Math.sin((3.25 / 12) * Math.PI * 2) * 60} y2={900 - Math.cos((3.25 / 12) * Math.PI * 2) * 60} stroke="#111" strokeWidth={9} />
      <line x1={1500} y1={900} x2={1500 + Math.sin((15 / 60) * Math.PI * 2) * 90} y2={900 - Math.cos((15 / 60) * Math.PI * 2) * 90} stroke="#111" strokeWidth={6} /></Svg>
    <Pool x={960} y={400} rx={500} color="80,255,150" a={0.18} />
  </Macro>),
  'hand-twitch-ins': P(p => <Macro p={p} bg="#0a0a0a" z={1.07} ox={960} oy={480}><Blanket /><Svg><path d="M200 300 Q600 360 820 520" stroke="#cfe0e6" strokeWidth={10} fill="none" /></Svg><PatientHand x={900} y={540} s={2.2} f={p.f} twitch /><Pool x={500} y={200} rx={600} color="80,255,150" a={0.16} /></Macro>),
  'chart-ins': P(p => <Macro p={p} bg="#2a1d12" z={1.05}><Counter /><Doc x={420} y={80} w={1080} h={900} rot={-2}>
    <div style={{fontFamily: TH, fontSize: 48, fontWeight: 700}}>แฟ้มผู้ป่วย · เตียง 1</div>
    {[['ชื่อ', 'สมศักดิ์'], ['อายุ', '72'], ['แพทย์เจ้าของไข้', ''], ['การวินิจฉัย', 'โคม่า'], ['ผลแล็บ', ''], ['ยา', '']].map(([k, v], i) => <div key={i} style={{display: 'flex', fontSize: 40, borderBottom: '2px solid #cfc8b6', height: 92, alignItems: 'center'}}>
      <div style={{width: 380, fontFamily: TH, color: '#555'}}>{k}</div><div style={{fontFamily: HANDW, color: C.greenD, fontSize: 48}}>{v}</div></div>)}
  </Doc><Lamp x={400} y={200} /></Macro>),
  'vials-spill-ins': P(p => <Macro p={p} bg="#050505" z={1.05} ox={960} oy={560} vig={0.85}>
    <Svg><rect x={0} y={500} width={1920} height={600} fill="#e9ecea" /><g transform={`translate(1400 300) rotate(${-kf(p.f, [[0, 20], [20, 110]])})`}><rect x={-160} y={-200} width={320} height={380} rx={20} fill="#c22a24" /><rect x={-170} y={-220} width={340} height={40} fill="#e2463c" /></g></Svg>
    {Array.from({length: 12}, (_, i) => { const t = Math.min(1, Math.max(0, (p.f - 8 - i * 2) / 25)); return <Vial key={i} x={1300 - t * (200 + rnd(5, i) * 900)} y={520 + t * (120 + rnd(6, i) * 360)} s={0.55} rot={rnd(7, i) * 300 * t + 90} label={i % 3 === 0} />; })}
    <Hand x={1580} y={260} s={1.6} rot={-150} skin={GLOVE} sleeve={C.white} mode="grip" />
    <Pool x={1000} y={700} rx={700} color="255,244,210" a={0.45} />
  </Macro>),
  'vial-label-ecu': P(p => <Macro p={p} bg="#030303" z={1.08} ox={960} oy={460} at={[50, 44]} vig={0.9}><Vial x={960} y={470} s={3.2} rot={-4} /><Hand x={820} y={930} s={2} rot={-70} skin={GLOVE} sleeve={C.white} mode="grip" /><Pool x={1100} y={300} rx={700} color="255,244,210" a={0.4} /></Macro>),
  'vial-turn-ecu': P(p => <Macro p={p} bg="#030303" z={1.05} ox={960} oy={460} vig={0.9}><Vial x={960} y={520} s={3} rot={kf(p.f, [[0, -4], [p.len, 10]])} back={p.f > p.len / 2} /><Svg><ellipse cx={1200} cy={980} rx={500} ry={40} fill="#000" opacity={0.5} /></Svg><Pool x={800} y={300} rx={700} color="255,244,210" a={0.4} /></Macro>),
  'syringe-compare-ins': P(p => <Macro p={p} bg="#030303" z={1.05} ox={960} oy={460} vig={0.85}><Syringe x={700} y={420} s={1.4} rot={-8} label="ยากันชัก|03:00" /><Vial x={1340} y={560} s={1.8} rot={8} /><Hand x={1180} y={760} s={1.8} rot={-30} skin={GLOVE} mode="grip" /><Pool x={960} y={360} rx={800} color="255,244,210" a={0.38} /></Macro>),
  'tape-peel-ecu': P(p => <PatientEyes p={p} tape="peel" hand />),
  'tape-back-ins': P(p => <PatientEyes p={p} tape="back" hand />),
  'photo-send-ins': P(p => <Macro p={p} bg="#030405" z={1.05} ox={960} oy={460}>
    <Phone x={660} y={10} s={0.92} rot={-3} dark>
      <div style={{height: 120, background: '#1b2433', color: '#fff', fontFamily: TH, fontSize: 40, padding: '40px 30px', boxSizing: 'border-box'}}>ฝน ER <span style={{float: 'right', fontSize: 30, color: '#f66'}}>ไม่มีสัญญาณ</span></div>
      <div style={{position: 'absolute', left: 20, right: 20, top: 140, background: '#2a3240', borderRadius: 20, padding: 18, fontFamily: TH, fontSize: 30, color: '#ddd'}}>📰 คลิป ผอ. ยอดวิว 3 ล้าน</div>
      {[0, 1].map(i => <div key={i} style={{position: 'absolute', right: 30, top: 300 + i * 320, width: 340, height: 280, background: i ? '#3a2a2a' : '#e9f1f4', borderRadius: 18, overflow: 'hidden'}}>
        {!i && <svg width={340} height={280}><rect x={130} y={40} width={80} height={180} rx={14} fill="#e9f1f4" stroke="#9fb0b6" strokeWidth={4} /><rect x={140} y={20} width={60} height={30} fill="#c22a24" /><rect x={130} y={100} width={80} height={60} fill="#fff" /><rect x={130} y={100} width={80} height={16} fill="#c22a24" /></svg>}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, background: 'rgba(0,0,0,.6)', color: '#fff', fontFamily: TH, fontSize: 24, textAlign: 'center'}}>40%</div></div>)}
      <div style={{position: 'absolute', right: 30, bottom: 30, fontFamily: TH, fontSize: 30, color: '#999'}}>✓</div>
    </Phone>
    <Pool x={960} y={400} rx={520} color="150,190,255" a={0.25} />
  </Macro>),
  'newspaper-ins': P(p => <Macro p={p} bg="#2a1d12" z={1.05}><Counter />
    <Doc x={360} y={80} w={1200} h={900} rot={-3} bg="#ecead9">
      <div style={{fontFamily: TH, fontSize: 36, color: '#555', borderBottom: '4px solid #222'}}>ข่าวคลองหมอก</div>
      <div style={{fontFamily: TH, fontWeight: 700, fontSize: 82, lineHeight: 1.1, margin: '20px 0'}}>ตร.ยันสัญญาณมือถือ ผอ.อยู่กัมพูชา</div>
      <div style={{display: 'flex', gap: 30}}><div style={{width: 300, height: 360, background: '#3c4a58', flexShrink: 0}}><svg width={300} height={360}><ellipse cx={150} cy={150} rx={70} ry={86} fill="#d9b39a" /><path d="M80 120 Q150 50 220 120" fill="#cfcfcf" /><rect x={95} y={130} width={44} height={26} rx={6} fill="none" stroke="#c9a24a" strokeWidth={4} /><rect x={160} y={130} width={44} height={26} rx={6} fill="none" stroke="#c9a24a" strokeWidth={4} /><circle cx={182} cy={118} r={4} fill="#5a3a2a" /><path d="M60 360 Q60 250 150 240 Q240 250 240 360 Z" fill="#232831" /></svg></div><div style={{flex: 1}}><Lines n={12} /></div></div>
    </Doc>
    <Svg><ellipse cx={1500} cy={300} rx={130} ry={56} fill="#5a3a22" /><ellipse cx={1500} cy={290} rx={110} ry={44} fill="#3a2414" /></Svg>
    <Lamp x={400} y={200} /></Macro>),
  'alphabet-ins': P(p => <Alphabet p={p} />),
  'alphabet2-ins': P(p => <Alphabet p={p} stop="น" />),
  'speaker-ins': P(p => <Macro p={p} bg="#050505" z={1.07} ox={960} oy={500} vig={0.8}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#dfe3e1" /><ellipse cx={960} cy={720} rx={760} ry={260} fill="#f3f4f2" />
      <ellipse cx={960} cy={560} rx={300} ry={190} fill="#141416" /><ellipse cx={960} cy={530} rx={250} ry={140} fill="#222226" />
      {Array.from({length: 40}, (_, i) => <circle key={i} cx={760 + (i % 10) * 44} cy={480 + Math.floor(i / 10) * 30} r={6} fill="#0a0a0c" />)}
      <circle cx={1180} cy={520} r={16} fill="#ff3a2a" /><circle cx={1180} cy={520} r={80} fill="#ff2a1f" opacity={0.18 + 0.12 * Math.abs(Math.sin(p.f / 9))} /></Svg>
    <Pool x={600} y={300} rx={800} color="255,214,150" a={0.3} />
  </Macro>),
  'phone-pole-ins': P(p => <Macro p={p} bg="#050505" z={1.06} ox={960} oy={460} vig={0.8}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#3a4642" /><rect x={930} y={-20} width={40} height={1120} fill="#aeb7bb" />
      <rect x={760} y={260} width={380} height={680} rx={40} fill="#0d0f12" /><rect x={786} y={290} width={328} height={610} fill="#7fb7ff" />
      <rect x={720} y={420} width={460} height={70} fill="#c9c08a" opacity={0.92} /><rect x={720} y={700} width={460} height={70} fill="#c9c08a" opacity={0.92} />
      <circle cx={950} cy={320} r={18} fill="#111" /><circle cx={950} cy={320} r={8} fill="#2a3a6a" />
      <rect x={1300} y={820} width={260} height={150} rx={20} fill="#e8e8e8" /><circle cx={1350} cy={860} r={10} fill="#3dff8a" />
      <path d="M1560 880 Q1760 800 1900 300" stroke="#222" strokeWidth={8} fill="none" /></Svg>
    <div style={{position: 'absolute', left: 800, top: 520, width: 300, fontFamily: TH, fontSize: 34, color: '#fff', textAlign: 'center'}}>19:12:{String(40 + Math.floor(p.f / 30)).padStart(2, '0')}</div>
    <Pool x={950} y={600} rx={500} color="150,190,255" a={0.4} />
  </Macro>),
  'vent-alarm-ins': P(p => <Macro p={p} bg="#020203" z={1.05} ox={960} oy={460} vig={0.85}>
    <Svg><rect x={300} y={120} width={1320} height={840} rx={40} fill="#4a5052" /><rect x={380} y={200} width={1160} height={620} rx={14} fill="#120a04" /></Svg>
    <div style={{position: 'absolute', left: 440, top: 260, fontFamily: 'Arial', fontWeight: 700, fontSize: 96, color: Math.floor(p.f / 8) % 2 ? '#ff8a1e' : '#6a3a10'}}>⚠ BATTERY</div>
    <div style={{position: 'absolute', left: 440, top: 420, fontFamily: 'Arial', fontSize: 160, fontWeight: 700, color: '#ff8a1e'}}>{29 - Math.floor(p.f / 30) + 1} MIN</div>
    <Pool x={960} y={500} rx={700} color="255,140,40" a={0.3} />
  </Macro>),
  'ambu-ins': P(p => <Macro p={p} bg="#020203" z={1.06} ox={960} oy={480} vig={0.85}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#2a2f2e" /><ellipse cx={600} cy={700} rx={360} ry={220} fill="#cfb39a" opacity={0.85} /><rect x={560} y={600} width={120} height={60} rx={12} fill="#e4ecef" />
      {(() => { const sq = 1 - Math.abs(Math.sin(p.f / 9)) * 0.25; return <g transform={`translate(1150 560) scale(1 ${sq})`}><ellipse cx={0} cy={0} rx={260} ry={150} fill="#ff7a2a" stroke="#c45a10" strokeWidth={8} /><rect x={-460} y={-30} width={220} height={60} fill="#e8e8e8" /></g>; })()}</Svg>
    <Hand x={1180} y={420} s={1.8} rot={-80} skin={GLOVE} sleeve={C.white} mode="grip" />
    <Pool x={1100} y={300} rx={500} color="255,244,210" a={0.5} />
  </Macro>),
  'cart-ins': P(p => <Macro p={p} bg="#020203" z={1.05} ox={960} oy={460} vig={0.85}>
    <Svg><rect x={200} y={100} width={1520} height={900} fill="#a8241e" /><rect x={240} y={300} width={1440} height={420} fill="#2a2a2a" /><rect x={240} y={740} width={1440} height={220} fill="#8e1d18" /><rect x={300} y={780} width={160} height={150} rx={20} fill="#2f8a4a" /></Svg>
    {[0, 1].map(i => <div key={i} style={{position: 'absolute', left: 520 + i * 520, top: 340, width: 360, height: 340, background: '#f4f6f6', borderRadius: 18, padding: 18, boxSizing: 'border-box', fontFamily: 'Arial', fontWeight: 700}}>
      <div style={{fontSize: 40, color: '#1a3a7a'}}>{i ? 'ATROPINE' : 'NEOSTIGMINE'}</div><div style={{fontSize: 30, color: '#333', marginTop: 120}}>EXP 08/2027</div></div>)}
    <Pool x={960} y={400} rx={600} color="255,244,210" a={0.5} />
  </Macro>),
  'msg-sent-ins': P(p => <Macro p={p} bg="#020203" z={1.05}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill={C.white} opacity={0.2} /></Svg>
    <Phone x={660} y={40} s={0.88} rot={4} dark>
      <div style={{height: 120, background: '#1b2433', color: '#fff', fontFamily: TH, fontSize: 40, padding: '40px 30px', boxSizing: 'border-box'}}>ฝน ER <span style={{float: 'right', fontSize: 30, color: '#6f6'}}>▮▮</span></div>
      {[0, 1].map(i => <div key={i} style={{position: 'absolute', right: 30, top: 200 + i * 320, width: 340, height: 280, background: '#e9f1f4', borderRadius: 18}}><div style={{position: 'absolute', right: 10, bottom: 8, fontSize: 30, color: '#3a8aff'}}>✓✓</div></div>)}
    </Phone>
    <Pool x={960} y={400} rx={520} color="60,230,120" a={0.3} />
  </Macro>),
  'keys-ins': P(p => <Macro p={p} bg="#030303" z={1.06} ox={960} oy={480} vig={0.85}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#4c5357" />{Array.from({length: 9}, (_, i) => <ellipse key={i} cx={300 + i * 160} cy={420 + Math.sin(i) * 20} rx={70} ry={40} fill="none" stroke="#9a9a92" strokeWidth={22} />)}
      <rect x={880} y={420} width={200} height={220} rx={30} fill="#7a7a72" /><path d="M910 430 Q980 300 1050 430" stroke="#9a9a92" strokeWidth={26} fill="none" />
      <g transform={`translate(1220 640) rotate(${Math.sin(p.f / 2) * 10})`}><circle cx={0} cy={0} r={70} fill="none" stroke={C.keyD} strokeWidth={14} />{Array.from({length: 9}, (_, i) => <rect key={i} x={-10} y={50} width={20} height={130} rx={6} fill={C.key} transform={`rotate(${-80 + i * 20})`} />)}</g></Svg>
    <Hand x={1120} y={600} s={1.6} rot={-40} skin={SKIN_P} sleeve={C.khaki} mode="pinch" />
    <Pool x={1000} y={540} rx={520} color="255,60,44" a={0.35} />
  </Macro>),
  'clip-mirror-ins': P(p => <TvScreen p={p} mode="clipzoom" wall={false} />),
  'poa-ins': P(p => <Macro p={p} bg="#030303" z={1.05} ox={960} oy={480} vig={0.85}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#5a564c" /></Svg>
    <Doc x={420} y={60} w={1080} h={960} rot={-5}>
      <div style={{fontFamily: TH, fontSize: 52, fontWeight: 700, textAlign: 'center'}}>หนังสือมอบอำนาจ</div><Lines n={8} />
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 40}}>
        <div style={{textAlign: 'center'}}><div style={{width: 150, height: 190, borderRadius: '50%', background: 'radial-gradient(ellipse, #7a4aa8 0%, #9a6ac8 60%, rgba(154,106,200,0) 72%)', margin: '0 auto'}} /><div style={{fontFamily: TH, fontSize: 30}}>ผู้มอบอำนาจ (ลายพิมพ์นิ้วมือ)</div></div>
        <div style={{textAlign: 'center', paddingTop: 70}}><div style={{fontFamily: HANDW, fontSize: 64, color: '#1f3a8a'}}>เมย์</div><div style={{fontFamily: TH, fontSize: 30}}>.......................... พยาน</div></div>
      </div>
    </Doc>
    <Pool x={1000} y={400} rx={600} color="255,244,210" a={0.45} />
  </Macro>),
  'land-deed-ins': P(p => <Macro p={p} bg="#030303" z={1.05} vig={0.85}>
    {[0, 1, 2].map(i => <Doc key={i} x={380 + i * 60} y={80 + i * 50} w={1060} h={760} rot={-4 + i * 3} bg="#efe6c8"><div style={{fontFamily: TH, fontSize: 56, fontWeight: 700, color: '#8a1f1f', textAlign: 'center'}}>โฉนดที่ดิน</div><Lines n={4} /><div style={{fontFamily: TH, fontSize: 44, marginTop: 20}}>ผู้ถือกรรมสิทธิ์ นพ.วรเทพ</div><Lines n={3} from={i * 9} /></Doc>)}
    <Pool x={960} y={400} rx={600} color="255,244,210" a={0.45} />
  </Macro>),
  'hand-squeeze-ins': P(p => <Macro p={p} bg="#050505" z={1.07} ox={960} oy={500} vig={0.8}><Blanket />
    <Hand x={1000} y={560} s={1.7} rot={170} skin={GLOVE} sleeve={C.white} mode="flat" />
    <Hand x={860} y={520} s={1.7} rot={10 + kf(p.f, [[0, 0], [p.len * 0.6, 14]])} skin={SKIN_W} sleeve={C.gown} mode={p.f > p.len * 0.4 ? 'grip' : 'flat'} />
    <Pool x={900} y={300} rx={600} color="255,244,210" a={0.5} /></Macro>),
  'evidence-ins': P(p => <Macro p={p} bg="#9a9488" z={1.05}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#8a6a44" />{[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={0} y={i * 200} width={1920} height={100} fill="#fff6d8" opacity={0.18} />)}</Svg>
    <div style={{position: 'absolute', left: 200, top: 120, width: 760, height: 860, border: '6px solid rgba(255,255,255,.8)', borderRadius: 20, background: 'rgba(255,255,255,.15)', overflow: 'hidden'}}><div style={{transform: 'scale(.75)', transformOrigin: '0 0'}}><RulesSheet x={40} y={60} rot={0} /></div></div>
    <div style={{position: 'absolute', left: 1040, top: 160, width: 700, height: 400, border: '6px solid rgba(255,255,255,.8)', borderRadius: 20, background: 'rgba(255,255,255,.15)'}} />
    <Syringe x={1390} y={360} s={0.9} rot={0} label="ยากันชัก|03:00" />
    <div style={{position: 'absolute', left: 1040, top: 620, width: 700, height: 300, border: '6px solid rgba(255,255,255,.8)', borderRadius: 20, background: 'rgba(255,255,255,.15)'}} />
    <Svg><rect x={1300} y={720} width={200} height={50} rx={14} fill={C.green} transform="rotate(-10 1400 745)" /></Svg>
  </Macro>),
  'cuff-ins': P(p => <Macro p={p} bg="#8a8a82" z={1.06} ox={960} oy={460}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#c9c4b8" /><rect x={0} y={760} width={1920} height={320} fill="#9a958a" /></Svg>
    <Doc x={1080} y={620} w={700} h={460} rot={8}><div style={{fontFamily: TH, fontSize: 40, fontWeight: 700}}>หนังสือมอบอำนาจ</div><div style={{width: 110, height: 140, borderRadius: '50%', background: 'radial-gradient(ellipse, #7a4aa8 0%, rgba(154,106,200,0) 72%)', marginTop: 40}} /></Doc>
    <Hand x={760} y={420} s={1.5} rot={-10} skin={SKIN_P} sleeve={C.grey} mode="fist" /><Hand x={1000} y={440} s={1.5} rot={190} skin={SKIN_P} sleeve={C.grey} mode="fist" flip />
    <Svg>{[820, 960].map((x, i) => <circle key={i} cx={x + 60} cy={440} r={50} fill="none" stroke="#c9ccd0" strokeWidth={16} />)}<line x1={930} y1={440} x2={970} y2={440} stroke="#c9ccd0" strokeWidth={10} /></Svg>
    <Pool x={600} y={200} rx={900} color="255,248,226" a={0.35} />
  </Macro>),
  'pharm-log-ins': P(p => <Macro p={p} bg="#a8adaf" z={1.05}>
    <Doc x={360} y={80} w={1200} h={900} rot={-2}><div style={{fontFamily: TH, fontSize: 44, fontWeight: 700}}>สมุดเบิกยา · ห้องยาตึกเมตตา</div>
      {Array.from({length: 11}, (_, i) => <div key={i} style={{display: 'flex', fontFamily: TH, fontSize: 34, height: 62, alignItems: 'center', borderBottom: '2px solid #cfc8b6'}}><div style={{width: 260}}>{String(i + 1).padStart(2, '0')}/10</div><div style={{width: 500}}>VECURONIUM 10 mg</div><div style={{color: '#8a1f1f', fontWeight: 700}}>N-0417</div></div>)}
    </Doc>
    <Hand x={1480} y={300 + kf(p.f, [[0, 0], [p.len, 520]])} s={1.3} rot={-160} skin="#c9a184" sleeve="#3a4a6a" mode="point" />
    <Pool x={600} y={200} rx={900} color="255,248,226" a={0.35} />
  </Macro>),
  'real-somsak-ins': P(p => <Macro p={p} bg="#4a3a2a" z={1.05}>
    <div style={{position: 'absolute', left: 520, top: 90, width: 880, height: 820, background: '#fff', padding: 30, boxSizing: 'border-box', transform: 'rotate(2deg)', boxShadow: '0 20px 40px rgba(0,0,0,.5)'}}>
      <svg width={820} height={700}><rect x={0} y={0} width={820} height={700} fill="#9fd0e8" /><rect x={0} y={420} width={820} height={280} fill="#7aa85a" /><rect x={420} y={180} width={360} height={260} fill="#8a6a44" /><polygon points="400,190 600,80 800,190" fill="#5a3a22" />
        <ellipse cx={260} cy={300} rx={70} ry={84} fill="#c9a184" /><path d="M190 260 Q260 180 330 260 L330 272 L190 272 Z" fill="#f0c419" /><rect x={180} y={380} width={170} height={260} rx={30} fill="#5a6a7a" /><rect x={300} y={400} width={90} height={150} rx={20} fill="#f4f4f0" />
        <path d="M230 340 Q260 362 290 340" stroke="#5a3a2a" strokeWidth={6} fill="none" /></svg>
    </div>
    <Pool x={960} y={400} rx={700} color="255,236,190" a={0.3} />
  </Macro>),
  'board-write-ins': P(p => <Board p={p} write />),
  'board-text-ecu': P(p => <Board p={p} />),
  'shelf-ins': P(p => <Macro p={p} bg="#030405" z={1.06} ox={960} oy={460} vig={0.88}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill="#2a2e2c" /><rect x={0} y={700} width={1920} height={40} fill="#8e8a7c" />
      <polygon points="520,300 1300,300 1360,700 460,700" fill="#f0ece0" /><polygon points="520,300 1300,300 1240,220 580,220" fill="#d8d4c6" />
      <rect x={560} y={330} width={700} height={70} fill="#c22a24" /><text x={910} y={380} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={48} fill="#fff">VECURONIUM 10 mg</text>
      <text x={910} y={460} textAnchor="middle" fontFamily="Arial" fontSize={40} fill="#c22a24">WARNING: PARALYZING AGENT</text>
      <text x={910} y={540} textAnchor="middle" fontFamily="Courier New" fontSize={44} fill="#222">LOT V24-0917</text></Svg>
    {[0, 1, 2].map(i => <Vial key={i} x={640 + i * 90} y={640} s={0.55} label={false} />)}
    <Vial x={1500} y={620} s={0.9} rot={10} />
    <Pool x={960} y={440} rx={520} color="255,244,210" a={0.5} />
  </Macro>),
  'badge-ins': P(p => <Macro p={p} bg="#e9ebe8" z={1.06} ox={960} oy={460}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill={C.white} /><path d="M300 0 V1080" stroke={C.whiteD} strokeWidth={8} /></Svg>
    <div style={{position: 'absolute', left: 520, top: 300, width: 620, height: 420, background: '#fff', borderRadius: 24, border: '4px solid #9ab', boxShadow: '0 10px 20px rgba(0,0,0,.2)', padding: 34, boxSizing: 'border-box', fontFamily: TH}}>
      <div style={{fontSize: 34, color: '#2a6a8c'}}>โรงพยาบาลคลองหมอก</div><div style={{fontSize: 72, fontWeight: 700, marginTop: 30}}>เมย์</div><div style={{fontSize: 40, color: '#444'}}>พยาบาลวิชาชีพ · ไอซียู</div></div>
    <Svg><circle cx={1400} cy={520} r={110} fill={C.watch} stroke={C.watchD} strokeWidth={10} /><circle cx={1400} cy={520} r={88} fill="#f7f6ef" /><line x1={1400} y1={520} x2={1400} y2={450} stroke="#111" strokeWidth={8} /><line x1={1400} y1={520} x2={1460} y2={540} stroke="#111" strokeWidth={6} /></Svg>
    <Pool x={300} y={200} rx={900} color="255,250,236" a={0.4} />
  </Macro>),
};

const Watch: React.FC<{p: ShotProps; day?: boolean; late?: boolean}> = ({p, late}) => (
  <Macro p={p} bg="#e9ebe8" z={1.07} ox={960} oy={460}>
    <Svg><rect x={0} y={0} width={1920} height={1080} fill={C.white} />{[0, 1, 2, 3].map(i => <path key={i} d={`M${300 + i * 400} -20 Q${360 + i * 400} 540 ${280 + i * 400} 1100`} stroke={C.whiteD} strokeWidth={10} fill="none" />)}
      <path d="M880 -20 Q960 120 940 300" stroke={C.watchD} strokeWidth={14} fill="none" />
      <circle cx={940} cy={500} r={240} fill={C.watch} stroke={C.watchD} strokeWidth={20} /><circle cx={940} cy={500} r={196} fill="#f7f6ef" />
      {Array.from({length: 12}, (_, i) => { const a = Math.PI + (i / 12) * Math.PI * 2; return <line key={i} x1={940 + Math.sin(a) * 170} y1={500 - Math.cos(a) * 170} x2={940 + Math.sin(a) * 190} y2={500 - Math.cos(a) * 190} stroke="#333" strokeWidth={8} />; })}
      {/* a nurse's watch reads upside down; hands at 12:05 */}
      <line x1={940} y1={500} x2={940} y2={620} stroke="#111" strokeWidth={14} strokeLinecap="round" />
      <line x1={940} y1={500} x2={940 - 80} y2={500 + 140} stroke="#111" strokeWidth={9} strokeLinecap="round" /></Svg>
    {!late && <Phone x={1360} y={420} s={0.5} rot={14}><div style={{fontFamily: TH, fontSize: 130, fontWeight: 700, textAlign: 'center', paddingTop: 200}}>12:10</div></Phone>}
    {late && <Svg><circle cx={1550} cy={260} r={140} fill="#e9e9e2" stroke="#555" strokeWidth={10} opacity={0.75} style={{filter: 'blur(3px)'}} /></Svg>}
    <Pool x={300} y={300} rx={900} color="255,246,220" a={0.4} />
  </Macro>
);

const Inject: React.FC<{p: ShotProps; n: number}> = ({p, n}) => {
  const push = kf(p.f, [[6, 1], [p.len * 0.8, n === 3 ? 0.5 : 0.1]]);
  const dark = n === 3;
  return (
    <Macro p={p} bg="#050505" z={1.05} ox={960} oy={480} vig={0.85}>
      <Blanket />
      <Svg><path d="M-40 260 Q600 300 900 520" stroke="#cfe0e6" strokeWidth={12} fill="none" /><rect x={860} y={480} width={110} height={70} rx={16} fill="#e9f1f4" stroke="#9fb0b6" strokeWidth={4} /></Svg>
      <PatientHand x={1060} y={600} f={p.f} rot={30} />
      <Syringe x={660} y={500} s={0.9} rot={18} full={push} label={n === 3 ? undefined : `ยากันชัก|${n === 1 ? '22:00' : '03:00'}`} />
      <Hand x={330} y={420} s={1.5} rot={18} skin={GLOVE} sleeve={C.white} mode="pinch" />
      {n === 2 && <Hand x={1300} y={420} s={1.5} rot={200} skin={GLOVE} sleeve={C.white} mode="flat" />}
      {dark ? <Pool x={700} y={300} rx={420} color="255,244,210" a={0.55} /> : <Lamp x={300} y={200} a={0.5} />}
      {dark && <Svg><rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.35} /></Svg>}
    </Macro>
  );
};

const Board: React.FC<{p: ShotProps; write?: boolean}> = ({p, write}) => {
  const t = write ? kf(p.f, [[0, 0], [p.len, 0.45]]) : 1;
  const text = 'ขอบคุณที่มาสาย';
  return (
    <Macro p={p} bg="#e9ebe8" z={write ? 1.04 : 1.08} ox={960} oy={460}>
      <Svg><rect x={0} y={0} width={1920} height={1080} fill="#a9c4d6" /><rect x={260} y={140} width={1400} height={760} rx={20} fill="#fbfcfb" stroke="#9aa4a8" strokeWidth={14} /></Svg>
      <div style={{position: 'absolute', left: 340, top: 360, fontFamily: HANDW, fontSize: 170, color: '#1f3a8a', whiteSpace: 'nowrap', transform: 'rotate(-3deg)'}}>{text.slice(0, Math.ceil(text.length * t))}</div>
      {write && <Hand x={360 + 1100 * t} y={600} s={1.6} rot={-40} skin={SKIN_W} sleeve={C.gown} mode="pinch" />}
      <Pool x={300} y={200} rx={900} color="255,250,236" a={0.4} />
    </Macro>
  );
};

// ---------------------------------------------------------------- cards

const RuleCard: ShotComponent = p => {
  const d = D(p), f = p.f, no = Number(d.no) || 1, mark = d.mark as string | undefined;
  const drop = appear(f, 3, 12, backOut(1.3)), st = appear(f, 16, 8, backOut(2));
  return (
    <AbsoluteFill style={{background: '#0b0907', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #2a2016 0%, #050403 80%)'}} />
      <div style={{position: 'absolute', left: 260, top: 230, width: 1400, height: 470, background: '#f6f1e2', borderRadius: 18, boxShadow: '0 30px 60px rgba(0,0,0,.6)', transform: `translateY(${(1 - drop) * -400}px) rotate(${-2 + (1 - drop) * -4}deg)`, opacity: Math.min(1, drop * 2),
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 93px, rgba(80,110,150,.22) 93px 95px)'}}>
        <div style={{position: 'absolute', left: 70, top: 50, fontFamily: HANDW, fontSize: 64, color: C.greenD}}>กฎข้อ {no}</div>
        <div style={{position: 'absolute', left: 70, top: 170, right: 60, fontFamily: HANDW, fontSize: 84, lineHeight: 1.15, color: C.greenD, textDecoration: mark === 'truth' ? 'line-through' : undefined, textDecorationColor: '#b8312a', textDecorationThickness: 8}}>{RULES_TEXT[no - 1]}</div>
        {mark === 'ok' && <div style={{position: 'absolute', right: 70, top: 40, width: 150, height: 150, borderRadius: '50%', border: '12px solid #2f9a4e', color: '#2f9a4e', fontSize: 110, textAlign: 'center', lineHeight: '130px', transform: `scale(${st})`}}>✓</div>}
        {mark === 'x' && <div style={{position: 'absolute', right: 70, top: 40, width: 150, height: 150, borderRadius: '50%', border: '12px solid #b8312a', color: '#b8312a', fontSize: 110, textAlign: 'center', lineHeight: '130px', transform: `scale(${st}) rotate(-12deg)`}}>✗</div>}
      </div>
      <div style={{position: 'absolute', left: 60, top: 50, padding: '8px 24px', borderRadius: 30, background: 'rgba(0,0,0,.5)', fontFamily: T.ui, fontSize: 34, color: '#f6f1e2'}}>กฎข้อ {no} / 5</div>
      <Grain f={f} opacity={0.12} />
    </AbsoluteFill>
  );
};

const ChapterCard: ShotComponent = p => {
  const d = D(p), f = p.f;
  const nums = ['', 'บทที่หนึ่ง', 'บทที่สอง', 'บทที่สาม', 'บทที่สี่', 'บทที่ห้า', 'บทที่หก', 'บทที่เจ็ด', 'บทที่แปด'];
  const n = Number(String(p.shot.vo ?? '').match(/บทที่(\S+)/) ? nums.indexOf(String(p.shot.vo).split(' ')[0]) : 0);
  const a = appear(f, 2, 10);
  return (
    <AbsoluteFill style={{background: '#050506', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`, textAlign: 'center'}}>
        <div style={{fontFamily: T.ui, fontSize: 44, color: '#b8312a', letterSpacing: 4}}>{n > 0 ? nums[n] : ''}</div>
        <div style={{fontFamily: T.title, fontSize: 120, color: '#f2efe6', marginTop: 10}}>{d.name}</div>
      </div>
      <div style={{position: 'absolute', right: 140, top: 120, width: 14, height: 14, borderRadius: 7, background: Math.floor(f / 18) % 3 !== 2 ? '#ff3a2a' : '#4a1410', boxShadow: '0 0 30px #ff2a1f'}} />
      <Grain f={f} opacity={0.1} />
    </AbsoluteFill>
  );
};

const Title: ShotComponent = p => {
  const d = D(p), f = p.f, a = appear(f, 4, 14);
  return (
    <AbsoluteFill style={{background: '#040405', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{opacity: a, textAlign: 'center'}}>
        <div style={{fontFamily: T.title, fontSize: 168, color: '#f2efe6', lineHeight: 1.15, textShadow: '0 8px 40px rgba(0,0,0,.9)'}}>{d.title}</div>
        <div style={{fontFamily: T.title, fontSize: 84, color: '#b8312a', marginTop: 10}}>{d.sub}</div>
        <div style={{fontFamily: T.ui, fontSize: 32, color: '#9a978e', marginTop: 60}}>{d.note}</div>
      </div>
      <div style={{position: 'absolute', right: 160, top: 140, width: 16, height: 16, borderRadius: 8, background: Math.floor(f / 18) % 3 !== 2 ? '#ff3a2a' : '#4a1410', boxShadow: '0 0 40px #ff2a1f'}} />
      <Grain f={f} opacity={0.12} />
    </AbsoluteFill>
  );
};

const Ins: ShotComponent = p => {
  const V = VIEWS[p.shot.view ?? ''];
  if (V) return <V p={p} />;
  return <Macro p={p}><Svg><rect x={0} y={0} width={1920} height={1080} fill="#222" /></Svg></Macro>;
};

export const INS: Record<string, ShotComponent> = {ins: Ins, title: Title, card: ChapterCard, rules: RuleCard, endcard: p => <EndCardScene p={p} />};
