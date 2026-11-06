import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {appear, backOut, kf, rnd} from '../../engine/anim';
import {T} from '../../engine/theme';
import {Grain} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {Phone} from '../../kit/phone';
import {MirrorFrame} from '../../kit/pov';
import {neonAt} from '../../kit/gasstation';
import {CemeteryRoad} from '../../kit/cemetery';
import {C} from './cast';
import {Notebook} from './checkpoint';

// Close-ups (directing.md §2: a macro insert is drawn big, not a sprite zoomed): hands, the phone, the tissue with the
// five rules, the rule cards, the title, and the station's small things in the neon light.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const pushK = (p: ShotProps, a = 1, b = 1.05) => a + (b - a) * kf(p.f, [[0, 0], [p.len, 1]]);
const NEON_GLOW = (k: number) => `radial-gradient(ellipse at 15% 0%, rgba(150,255,195,${0.42 * k}), rgba(0,0,0,0) 70%)`;

const Frame: React.FC<{p: ShotProps; children: React.ReactNode; bg?: string; glow?: string; z?: [number, number]; origin?: string}> = ({p, children, bg = '#07080a', glow, z = [1, 1.05], origin = '50% 50%'}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
    {glow && <div style={{position: 'absolute', inset: 0, background: glow}} />}
    <div style={{position: 'absolute', inset: 0, transform: `scale(${pushK(p, z[0], z[1])})`, transformOrigin: origin}}>{children}</div>
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)'}} />
    <Grain f={p.f} opacity={0.12} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- the tissue with the five rules

const RULES = ['1 กล่องโฟม เทปดำ 3 รอบ ห้ามแกะ', '2 ห้ามเปิดแอป ห้ามถ่ายรูป ห้ามแชร์', '3 ห้ามใช้ทางลัดหลังปั๊ม', '4 ห้ามดับเครื่อง บิดออกทันที', '5 ห้ามหันกลับไปมอง'];

const Tissue: React.FC<{mark?: number; ecu?: boolean; f: number}> = ({mark, ecu}) => (
  <div style={{position: 'absolute', left: ecu ? 120 : 380, top: ecu ? -380 : 130, width: 1160, height: 820, transform: `rotate(-4deg) scale(${ecu ? 1.9 : 1})`,
    transformOrigin: ecu ? '20% 90%' : '50% 50%', background: '#f1ede4', borderRadius: 18,
    boxShadow: '0 30px 60px rgba(0,0,0,.6)', clipPath: 'polygon(1% 3%, 30% 0, 62% 2%, 99% 1%, 100% 40%, 98% 98%, 60% 100%, 20% 97%, 0 100%, 2% 50%)'}}>
    {/* crumples */}
    {Array.from({length: 9}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(51, i) * 1100, top: rnd(52, i) * 800, width: 200, height: 4, background: 'rgba(0,0,0,.06)', transform: `rotate(${rnd(53, i) * 180}deg)`}} />)}
    {RULES.map((r, i) => (
      <div key={i} style={{position: 'absolute', left: 70, top: 80 + i * 140, fontFamily: '"Plex Thai", sans-serif', fontWeight: 500, fontSize: 60, color: '#23304a',
        transform: `rotate(${(rnd(54, i) - 0.5) * 3}deg)`, opacity: mark && mark !== i + 1 ? 0.55 : 1,
        textShadow: i === 4 ? '0 0 2px rgba(35,48,74,.6)' : undefined}}>
        {r}
        {mark === i + 1 && <div style={{position: 'absolute', left: -20, right: -30, bottom: -6, height: 10, background: 'rgba(192,57,43,.55)', borderRadius: 5}} />}
      </div>
    ))}
    {/* the ink of the 5 has bled */}
    <div style={{position: 'absolute', left: 58, top: 650, width: 60, height: 70, borderRadius: '50%', background: 'rgba(35,48,74,.35)', filter: 'blur(6px)'}} />
  </div>
);

// ---------------------------------------------------------------- the hand inserts

const HandScene: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? '';
  const lit = neonAt(p.f, 'on');
  if (v === 'glove-macro') {
    // a grey cloth glove, macro, in the neon: the tip of the forefinger streaked with black tape glue
    return (
      <Frame p={p} bg="#0a0c0d" glow={NEON_GLOW(lit)} z={[1, 1.06]}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <path d="M-40 1120 L-40 700 Q300 640 520 560 L1500 380 Q1640 360 1660 460 Q1660 540 1540 560 L760 760 Q600 900 540 1120 Z" fill="#8c8c88" />
          {Array.from({length: 90}, (_, i) => <circle key={i} cx={100 + rnd(341, i) * 1500} cy={480 + rnd(342, i) * 500} r="3" fill="rgba(60,60,58,.35)" />)}
          <path d="M520 560 L1500 380" stroke="#6a6a66" strokeWidth="6" />
          {/* the glue: a black, shiny streak where the tape was counted round */}
          <path d="M1260 430 Q1400 410 1600 440" stroke="#111" strokeWidth="38" strokeLinecap="round" fill="none" />
          <path d="M1290 422 Q1400 406 1560 428" stroke={`rgba(190,255,215,${0.5 * lit})`} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M1120 470 Q1180 460 1220 466" stroke="#1a1a1a" strokeWidth="14" strokeLinecap="round" fill="none" opacity=".7" />
          {/* dry mud in the weave of the palm */}
          <path d="M200 880 Q400 820 600 860 Q520 960 300 980 Z" fill="#5a4630" opacity=".7" />
        </svg>
      </Frame>
    );
  }

  if (v === 'cam-broken') {
    return (
      <Frame p={p} glow={NEON_GLOW(lit)}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <ellipse cx="1100" cy="520" rx="760" ry="520" fill="#14161a" />
          <rect x="820" y="330" width="520" height="340" rx="46" fill="#111316" stroke="#000" strokeWidth="6" />
          <rect x="880" y="380" width="250" height="160" rx="10" fill="#020203" stroke="#25282e" strokeWidth="6" />
          <ellipse cx="960" cy="420" rx="40" ry="14" fill="rgba(150,255,195,.14)" />
          <circle cx="1240" cy="430" r="38" fill="#1a1c20" stroke="#000" strokeWidth="4" />
        </svg>
        <Hand x={1160 + (Math.floor(p.f / 18) % 2) * 14} y={560} s={1.25} rot={-30} skin={C.skin} sleeve="#21466b" mode="open" />
        {/* the watch on the left wrist */}
        <div style={{position: 'absolute', left: 760, top: 640, width: 70, height: 70, borderRadius: '50%', background: '#f6f1e6', border: '8px solid #222'}} />
      </Frame>
    );
  }
  if (v === 'cable-ecu') {
    const fixed = d.cable === 'new';
    return (
      <Frame p={p} bg="#0a0a0b" glow={NEON_GLOW(lit)}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* the opened camera box on the cracked seat */}
          <rect x="-40" y="760" width="2000" height="360" fill="#141516" />
          {Array.from({length: 6}, (_, i) => <path key={i} d={`M${200 + i * 300} 790 l60 120`} stroke="#2a2b2d" strokeWidth="5" />)}
          <rect x="500" y="200" width="920" height="560" rx="40" fill="#121418" stroke="#000" strokeWidth="8" />
          <rect x="560" y="260" width="800" height="440" rx="20" fill="#1b1e24" />
          {[0, 1, 2, 3].map(i => <rect key={i} x={600 + i * 50} y="300" width="30" height="80" fill="#2a2e35" />)}
          {fixed ? (
            <path d="M720 520 L1240 520" stroke="#e07a2c" strokeWidth="44" strokeLinecap="round" />
          ) : (
            <>
              <path d="M700 520 L930 512 L948 530" stroke="#e07a2c" strokeWidth="44" strokeLinecap="round" fill="none" />
              <path d="M1010 540 L1030 516 L1250 520" stroke="#e07a2c" strokeWidth="44" strokeLinecap="round" fill="none" />
              {Array.from({length: 6}, (_, i) => <line key={i} x1={950 + i * 3} y1={520 + i * 4} x2={1000 + i * 4} y2={514 + i * 5} stroke="#f0c088" strokeWidth="2" />)}
            </>
          )}
          {fixed && <circle cx="1300" cy="300" r="22" fill="#ff3b30" />}
          {fixed && <circle cx="1300" cy="300" r="60" fill="rgba(255,59,48,.3)" />}
          <rect x="1400" y="820" width="380" height="36" rx="18" fill="#c0392b" transform="rotate(-12 1590 838)" />
          <rect x="1180" y="826" width="240" height="18" rx="6" fill="#aab2bd" transform="rotate(-12 1300 835)" />
        </svg>
      </Frame>
    );
  }
  if (v === 'keychain-ecu' || v === 'keychain-mud-ecu') {
    const spin = d.spin ? p.f * 0.35 : 0;
    const mud = v === 'keychain-mud-ecu';
    return (
      <Frame p={p} bg="#050506" glow={mud ? undefined : NEON_GLOW(lit)} z={[1, 1.08]}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: d.recall ? 'saturate(.4) brightness(.8)' : undefined}}>
          {/* the light trail of the spinning braid */}
          {d.spin && Array.from({length: 14}, (_, i) => {
            const a = spin - i * 0.18;
            return <circle key={i} cx={980 + Math.cos(a) * 230} cy={470 + Math.sin(a) * 230} r={22 - i} fill={`rgba(125,255,106,${0.45 - i * 0.03})`} />;
          })}
          <g transform={`translate(980 470) rotate(${(spin * 180) / Math.PI})`}>
            <path d="M0 0 Q90 40 230 0" stroke="#c9ced6" strokeWidth="10" fill="none" />
            <path d="M230 0 q30 30 0 60 q-30 30 0 60 q30 30 0 60" stroke="#7dff6a" strokeWidth="26" fill="none" strokeLinecap="round" />
            <path d="M230 0 q30 30 0 60 q-30 30 0 60 q30 30 0 60" stroke="rgba(125,255,106,.35)" strokeWidth="70" fill="none" strokeLinecap="round" />
            {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${218} ${16 + i * 30} l24 14`} stroke="#2f7a28" strokeWidth="5" />)}
          </g>
        </svg>
        {/* Chat's right hand: on a mud-caked fist in CH9, spinning at the neon in CH1 */}
        <Hand x={900} y={560} s={1.5} rot={mud ? 10 : -20} skin={mud ? '#9a7a5c' : '#e8b995'} sleeve={mud ? '#2a1e16' : '#262833'} mode="grip" />
        {mud && Array.from({length: 22}, (_, i) => <div key={i} style={{position: 'absolute', left: 760 + rnd(61, i) * 360, top: 440 + rnd(62, i) * 260, width: 30 + rnd(63, i) * 40, height: 16, borderRadius: 8, background: 'rgba(40,28,18,.7)'}} />)}
      </Frame>
    );
  }
  if (v === 'tissue' || v === 'tissue-ecu') {
    return (
      <Frame p={p} bg="#0a0b0c" glow={NEON_GLOW(lit)}>
        {/* on the fuel tank: navy paint under the paper */}
        <div style={{position: 'absolute', left: -200, top: -100, width: 2400, height: 1400, background: 'radial-gradient(ellipse at 50% 40%, #2c4f78, #0c1622 70%)'}} />
        <Tissue mark={d.mark} ecu={v === 'tissue-ecu'} f={p.f} />
        {v === 'tissue-ecu' && <Hand x={300} y={920} s={1.3} rot={-60} skin={C.skin} sleeve="#21466b" mode="open" />}
      </Frame>
    );
  }
  if (v === 'phone-off') {
    const off = kf(p.f, [[p.len * 0.45, 0], [p.len * 0.65, 1]]);
    return (
      <Frame p={p} bg="#08090b">
        <div style={{position: 'absolute', left: -100, top: 500, width: 2200, height: 700, background: 'linear-gradient(#1f2a3a, #0d121a)', borderRadius: '50% 50% 0 0'}} />
        <Phone x={900} y={560} s={0.95} rot={-8}>
          <div style={{position: 'absolute', inset: 0, background: '#12855a'}}>
            <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 44, color: '#fff'}}>ไรเดอร์ · ออนไลน์</div>
            <div style={{position: 'absolute', left: 64, top: 300, width: 300, height: 300, borderRadius: '50%', border: '18px solid rgba(255,255,255,.85)'}} />
          </div>
          <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${off})`}} />
        </Phone>
        {/* Chat's rough forefinger coming in from the right */}
        <Hand x={1260 - kf(p.f, [[0, 0], [p.len * 0.5, 1]]) * 160} y={520} s={1.3} rot={200} skin="#e8b995" sleeve="#262833" mode="open" />
      </Frame>
    );
  }
  if (v === 'calc') {
    return <PhoneInsert p={p} screen={<CalcScreen f={p.f} len={p.len} />} />;
  }
  if (v === 'box-top' || v === 'lift-ecu') {
    // the foam box on the seat from straight above (or lifted in both hands): black tape, the handwritten tag, the envelope
    const lift = v === 'lift-ecu';
    const BULB = 'radial-gradient(ellipse at 50% 0%, rgba(255,214,150,.38), rgba(0,0,0,0) 72%)';
    return (
      <Frame p={p} bg="#0b0b0c" glow={BULB}>
        {!lift && <div style={{position: 'absolute', left: -100, top: 200, width: 2200, height: 900, borderRadius: '40%', background: '#15171a'}} />}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, transform: lift ? `rotate(${-4 + Math.sin(p.f / 5) * 1.5}deg)` : undefined}}>
          <rect x="520" y="260" width="880" height="560" rx="18" fill="#f3f0e8" stroke="#a8a294" strokeWidth="8" />
          {Array.from({length: d.tape ?? 3}, (_, i) => <rect key={i} x={640 + i * 250} y="250" width="90" height="580" fill="#0d0d0d" />)}
          {d.tag && <g transform="rotate(-6 1180 520)"><rect x="1040" y="460" width="260" height="120" fill="#e8dcc0" stroke="#7a6a4a" strokeWidth="4" />
            <text x="1170" y="540" textAnchor="middle" fontSize="54" fontFamily="Plex Thai, sans-serif" fill="#2a2a4a">{d.tag}</text></g>}
          {d.envelope && !lift && <rect x="1460" y="560" width="300" height="170" fill="#a5814e" transform="rotate(8 1610 645)" />}
        </svg>
        {lift && <><Hand x={460} y={620} s={1.4} rot={10} skin={C.skin} sleeve="#21466b" mode="grip" /><Hand x={1460} y={620} s={1.4} rot={170} skin={C.skin} sleeve="#21466b" mode="grip" flip /></>}
      </Frame>
    );
  }
  if (v === 'count-ecu') {
    // the wraps of tape counted on screen: 1 2 3, and the 4th in gold; a cold, washed recall when data.recall
    const n = (d.count as number[] | undefined)?.length ?? 4;
    const shown = Math.min(n, 1 + Math.floor(kf(p.f, [[0, 0], [p.len * 0.75, n - 0.01]])));
    return (
      <Frame p={p} bg="#08080a" glow="radial-gradient(ellipse at 10% 60%, rgba(255,240,200,.35), rgba(0,0,0,0) 70%)">
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: d.recall ? 'saturate(.3) brightness(.8)' : undefined}}>
          <rect x="200" y="320" width="1520" height="520" rx="16" fill="#f3f0e8" />
          {Array.from({length: shown}, (_, i) => (
            <g key={i}>
              <rect x={380 + i * 300} y="310" width="120" height="540" fill="#0d0d0d" transform={`rotate(${i === 3 ? 4 : 0} ${440 + i * 300} 580)`} />
              <text x={440 + i * 300} y="260" textAnchor="middle" fontSize="110" fontWeight="700" fontFamily="Plex Thai, sans-serif" fill={i === 3 ? T.gold : '#f2efe6'}>{i + 1}</text>
            </g>
          ))}
        </svg>
      </Frame>
    );
  }
  if (v === 'usb-ins') {
    const blink = Math.floor(p.f / 4) % 2 === 0;
    return (
      <Frame p={p} bg="#050608" glow="radial-gradient(ellipse at 70% 30%, rgba(120,165,235,.35), rgba(0,0,0,0) 70%)">
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <rect x="1000" y="200" width="1000" height="640" rx="20" fill="#23262b" />
          <rect x="1020" y="560" width="900" height="40" fill="#15171a" />
          <rect x="1040" y="580" width="60" height="26" rx="4" fill="#0a0a0b" />
          <path d="M1070 593 Q800 600 640 700 Q520 780 400 700" stroke="#111" strokeWidth="22" fill="none" />
          <rect x="160" y="520" width="360" height="260" rx="40" fill="#121418" stroke="#000" strokeWidth="6" />
          <circle cx="260" cy="650" r="60" fill="#0a1626" />
          <circle cx="460" cy="560" r="14" fill="#2a1416" />
          <circle cx="1880" cy="230" r="10" fill={blink ? '#35e06a' : '#0e3a1c'} />
          {blink && <circle cx="1880" cy="230" r="28" fill="rgba(53,224,106,.3)" />}
        </svg>
      </Frame>
    );
  }
  if (v === 'tape-macro') {
    return (
      <Frame p={p} bg="#060606" glow="radial-gradient(ellipse at 50% 50%, rgba(200,205,220,.2), rgba(0,0,0,0) 70%)">
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: 'grayscale(1) contrast(1.3)'}}>
          <rect x="-40" y="260" width="2000" height="560" fill="#d0d0d0" />
          {[0, 1, 2].map(i => <rect key={i} x={240 + i * 420} y="250" width="150" height="580" fill="#141414" />)}
          {/* the fourth wrap: thicker and crooked */}
          <rect x="1500" y="240" width="210" height="600" fill="#0a0a0a" transform="rotate(5 1605 540)" />
          <ellipse cx="1605" cy="540" rx="200" ry="330" fill="none" stroke="#c0392b" strokeWidth="10" />
        </svg>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.16) 1px, transparent 1px)', backgroundSize: '18px 18px'}} />
      </Frame>
    );
  }
  // anything else: a hand at rest in the neon
  return <Frame p={p} glow={NEON_GLOW(lit)}><Hand x={960} y={560} s={1.4} skin={C.skin} sleeve="#21466b" mode="flat" /></Frame>;
};

// ---------------------------------------------------------------- the phone screens

const CalcScreen: React.FC<{f: number; len: number}> = ({f, len}) => {
  const step = Math.min(3, Math.floor(kf(f, [[0, 0], [len * 0.8, 3.99]])));
  const shown = ['850', '850 ×', '850 × 6', '5,100'][step];
  return (
    <div style={{position: 'absolute', inset: 0, background: '#0b0b0d', fontFamily: T.ui}}>
      <div style={{position: 'absolute', right: 30, top: 140, fontSize: step === 3 ? 110 : 84, color: step === 3 ? T.gold : '#fff', fontWeight: 300}}>{shown}</div>
      {step === 3 && <div style={{position: 'absolute', right: 34, top: 270, fontSize: 30, color: '#9aa'}}>850 × 6 =</div>}
      {Array.from({length: 16}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 24 + (i % 4) * 100, top: 380 + Math.floor(i / 4) * 100, width: 84, height: 84, borderRadius: '50%',
          background: i % 4 === 3 ? '#e0962a' : '#2a2a2e', color: '#fff', fontSize: 36, textAlign: 'center', lineHeight: '84px'}}>{'789÷456×123−0.=+'[i]}</div>
      ))}
    </div>
  );
};

const PhoneInsert: React.FC<{p: ShotProps; screen: React.ReactNode; rot?: number}> = ({p, screen, rot = -4}) => (
  <Frame p={p} bg="#070809" glow="radial-gradient(ellipse at 50% 50%, rgba(120,160,255,.34), rgba(0,0,0,0) 65%)">
    <div style={{position: 'absolute', left: -100, top: 640, width: 2200, height: 600, background: 'linear-gradient(#1c2430, #0a0d12)', borderRadius: '50% 50% 0 0'}} />
    <Hand x={1100} y={780} s={1.4} skin={C.skin} sleeve="#21466b" mode="grip" flip />
    <Phone x={960} y={520} rot={rot}>{screen}</Phone>
  </Frame>
);

const SmsScreen: React.FC<{d: Record<string, any>; f: number; ecu?: boolean}> = ({d, f, ecu}) => {
  const n: number = d.stack ?? 3;
  const msg: string = d.msg ?? '';
  return (
    <div style={{position: 'absolute', inset: 0, background: '#0d1118', fontFamily: T.ui, color: '#fff'}}>
      <div style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center', fontSize: 30, opacity: 0.8}}>{d.from ?? 'ไฟแนนซ์'}</div>
      {Array.from({length: n}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 24, top: 120 + i * 190, width: 380, padding: 22, boxSizing: 'border-box', borderRadius: 22,
          background: i === 0 ? '#2a3a5a' : 'rgba(255,255,255,.06)', fontSize: 26, lineHeight: 1.4, opacity: i === 0 ? appear(f, 4, 10) : 0.55}}>
          {i === 0 ? msg : 'แจ้งเตือนค้างชำระค่างวด กรุณาติดต่อ...'}
          {i === 0 && d.mark === 'amount' && <div style={{marginTop: 10, fontSize: ecu ? 64 : 40, fontWeight: 700, color: '#ff5a4f'}}>5,100 บาท</div>}
          {i === 0 && d.paid && <div style={{marginTop: 10, fontSize: 52, fontWeight: 700, color: '#4ade80'}}>5,100 บาท ✓</div>}
        </div>
      ))}
    </div>
  );
};

const PageScreen: React.FC<{d: Record<string, any>}> = ({d}) => (
  <div style={{position: 'absolute', inset: 0, background: '#0d1118', fontFamily: T.ui, color: '#fff'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 428, height: 220, background: 'linear-gradient(#1b2a44, #0d1118)'}} />
    <div style={{position: 'absolute', left: 134, top: 120, width: 160, height: 160, borderRadius: '50%', background: '#111316', border: '6px solid #0d1118', overflow: 'hidden'}}>
      <svg viewBox="0 -30 200 120" width={160} height={160}><path d="M26 62 C26 -16 174 -16 174 62 Q100 68 26 62 Z" fill="#1b1e23" stroke="#555" strokeWidth="3" />
        <rect x="84" y="-14" width="32" height="24" rx="5" fill="#333" /><rect x="20" y="10" width="28" height="20" rx="4" fill="#333" /></svg>
    </div>
    <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 36}}>{d.page ?? 'เจย์ไรเดอร์กะดึก'}</div>
    <div style={{position: 'absolute', top: 356, width: '100%', textAlign: 'center', fontSize: 26, color: T.gold}}>ผู้ติดตาม {d.followers ?? 312} คน</div>
    {['ขี่ดีๆ นะเจย์', 'ดูเป็นเพื่อนครับ', 'ไลฟ์อีกนะ'].map((c, i) => (
      <div key={i} style={{position: 'absolute', left: 30, top: 440 + i * 90, width: 360, padding: '16px 20px', boxSizing: 'border-box', borderRadius: 16, background: 'rgba(255,255,255,.07)', fontSize: 24}}>{c}</div>
    ))}
  </div>
);

const PhoneScene: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? 'sms';
  if (v === 'money-ins') {
    const have = d.have ?? 1700, need = d.need ?? 5100;
    return <PhoneInsert p={p} screen={
      <div style={{position: 'absolute', inset: 0, background: '#0d1118', fontFamily: T.ui, color: '#fff'}}>
        <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontSize: 28, opacity: 0.75}}>รายรับสัปดาห์นี้</div>
        <div style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center', fontSize: 84, fontWeight: 700}}>{have.toLocaleString('en-US')}</div>
        <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', fontSize: 30, opacity: 0.7}}>จาก {need.toLocaleString('en-US')} บาท</div>
        <div style={{position: 'absolute', left: 40, top: 330, width: 348, height: 26, borderRadius: 13, background: '#2a2d33'}}>
          <div style={{width: `${(100 * have) / need}%`, height: '100%', borderRadius: 13, background: '#2fbf5a'}} />
        </div>
        <div style={{position: 'absolute', top: 420, width: '100%', textAlign: 'center', fontSize: 34, opacity: 0.8}}>ยังขาด</div>
        <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontSize: 92, fontWeight: 700, color: '#ff5a4f'}}>{(need - have).toLocaleString('en-US')}</div>
      </div>
    } />;
  }
  if (v === 'incoming-ins') {
    // the call buzzing face-up on the bedsheet, no hand on it
    const buzz = Math.floor(p.f / 3) % 2 ? 3 : -3;
    return (
      <Frame p={p} bg="#14181e" glow="radial-gradient(ellipse at 50% 50%, rgba(120,160,255,.34), rgba(0,0,0,0) 65%)">
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(115deg, #3a4a62 0 60px, #34445a 60px 120px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.6) 80%)'}} />
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${buzz}px)`}}>
          <Phone x={960} y={540} rot={8}>
            <div style={{position: 'absolute', inset: 0, background: '#12161e', fontFamily: T.ui, color: '#fff'}}>
              <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontSize: 28, opacity: 0.7}}>สายเรียกเข้า</div>
              <div style={{position: 'absolute', left: 139, top: 150, width: 150, height: 150, borderRadius: '50%', background: '#e8742a', border: '6px solid #fff', overflow: 'hidden'}}>
                <div style={{position: 'absolute', left: 40, top: 70, width: 70, height: 90, background: '#f3ead8', borderRadius: 6}} />
              </div>
              <div style={{position: 'absolute', top: 340, width: '100%', textAlign: 'center', fontSize: 46, fontWeight: 700}}>{d.caller ?? 'พี่ชาติ วิน17'}</div>
              <div style={{position: 'absolute', left: 70, top: 640, width: 100, height: 100, borderRadius: '50%', background: '#e0473c'}} />
              <div style={{position: 'absolute', left: 258, top: 640, width: 100, height: 100, borderRadius: '50%', background: '#2fbf5a', boxShadow: `0 0 ${30 + (20 * (p.f % 20)) / 20}px rgba(47,191,90,.6)`}} />
            </div>
          </Phone>
        </div>
      </Frame>
    );
  }

  if (v === 'sms' || v === 'sms-ecu') {
    if (v === 'sms-ecu') {
      return (
        <Frame p={p} bg="#05070b" z={[1, 1.1]}>
          <div style={{position: 'absolute', left: 260, top: 160, width: 1400, height: 700, borderRadius: 30, background: '#2a3a5a', boxShadow: '0 0 160px rgba(120,160,255,.25)',
            fontFamily: T.ui, color: '#fff', padding: 60, boxSizing: 'border-box'}}>
            <div style={{fontSize: 54, opacity: 0.85}}>{d.paid ? 'ชำระครบแล้ว' : 'ค้างชำระ 3 งวด รวม'}</div>
            <div style={{fontSize: 230, fontWeight: 700, color: d.paid ? '#4ade80' : '#ff5a4f', lineHeight: 1.2}}>5,100 บาท</div>
            {/* the pixels of the screen */}
            <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, rgba(0,0,0,0) 2px 6px)'}} />
          </div>
          {!d.paid && <Hand x={1500} y={980} s={1.6} rot={-100} skin={C.skin} mode="open" />}
        </Frame>
      );
    }
    return <PhoneInsert p={p} screen={<SmsScreen d={d} f={p.f} />} />;
  }
  if (v === 'page') return <PhoneInsert p={p} screen={<PageScreen d={d} />} />;
  if (v === 'call-ins') {
    // 191 dialled, the thumb hovering over the green call button
    return <PhoneInsert p={p} screen={
      <div style={{position: 'absolute', inset: 0, background: '#0d1118', fontFamily: T.ui, color: '#fff'}}>
        <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontSize: 110, letterSpacing: 8}}>{d.dial ?? '191'}</div>
        {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: 54 + (i % 3) * 120, top: 300 + Math.floor(i / 3) * 100, width: 84, height: 84, borderRadius: '50%',
          background: '#2a2a2e', fontSize: 36, textAlign: 'center', lineHeight: '84px'}}>{'123456789*0#'[i]}</div>)}
        <div style={{position: 'absolute', left: 164, top: 700, width: 100, height: 100, borderRadius: '50%', background: '#2fbf5a', boxShadow: '0 0 40px rgba(47,191,90,.6)'}} />
      </div>
    } />;
  }
  return <PhoneInsert p={p} screen={<div style={{position: 'absolute', inset: 0, background: '#0d1118'}} />} />;
};

// ---------------------------------------------------------------- the station's small things (views of `station`)

export const STATION_INSERTS = new Set(['tank-ins', 'boots-low', 'boots-ins', 'key-ins', 'handlebar-ins', 'mirror-ins', 'helmet-high', 'neon-ins', 'empty-seat-ins', 'seat-ins', 'card-ins', 'notebook-high']);

export const StationInsert: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? '';
  const lit = neonAt(p.f, d.flicker ? 'flick' : 'on');
  if (v === 'empty-seat-ins') {
    // the kerb of the pump island at noon, where Chat sits every night: nobody, a ring left by his coffee can
    return (
      <Frame p={p} bg="#b8b4a8" glow="radial-gradient(ellipse at 0% 0%, rgba(255,248,220,.5), rgba(0,0,0,0) 70%)">
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#a8a49a, #c8c4b8)'}} />
        <div style={{position: 'absolute', left: -60, top: 230, width: 2100, height: 300, background: '#d8d4c8', transform: 'skewY(-4deg)'}} />
        <div style={{position: 'absolute', left: -60, top: 500, width: 2100, height: 90, transform: 'skewY(-4deg)',
          background: 'repeating-linear-gradient(90deg, #f1c40f 0 120px, #1a1a1a 120px 240px)'}} />
        <div style={{position: 'absolute', left: -60, top: 590, width: 2100, height: 60, background: 'rgba(0,0,0,.25)', transform: 'skewY(-4deg)', filter: 'blur(8px)'}} />
        {[[1180, 380], [1250, 410]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 150, height: 56, borderRadius: '50%', border: `${i ? 5 : 9}px solid rgba(90,60,30,${i ? 0.25 : 0.45})`}} />)}
        {Array.from({length: 30}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(331, i) * 1920, top: 700 + rnd(332, i) * 380, width: 8 + rnd(333, i) * 20, height: 4, background: 'rgba(60,50,40,.25)'}} />)}
      </Frame>
    );
  }
  if (v === 'seat-ins') {
    // low, through Chat's wheel spokes: the seat lifted open, and under it the black tape, a folded black raincoat, muddy gloves
    const items: string[] = d.items ?? ['tape', 'raincoat', 'gloves'];
    return (
      <Frame p={p} bg="#060708" glow={NEON_GLOW(lit)} z={[1, 1.06]}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <path d="M420 300 L1520 300 L1600 760 L340 760 Z" fill="#101214" stroke="#000" strokeWidth="8" />
          <path d="M420 300 L560 80 L1380 80 L1520 300 Z" fill="#1a1c20" />
          <path d="M560 80 L1380 80" stroke={`rgba(150,255,195,${0.4 * lit})`} strokeWidth="8" />
          {items.includes('raincoat') && <path d="M480 520 Q700 430 980 470 L1000 740 L460 740 Z" fill="#0b0c0e" stroke="#2a2d32" strokeWidth="4" />}
          {items.includes('raincoat') && <path d="M520 560 Q720 500 960 520" stroke={`rgba(150,255,195,${0.25 * lit})`} strokeWidth="10" fill="none" />}
          {items.includes('tape') && <><circle cx="1180" cy="560" r="120" fill="#141414" stroke="#2a2a2a" strokeWidth="6" /><circle cx="1180" cy="560" r="52" fill="#3a3530" /></>}
          {items.includes('gloves') && [0, 1].map(i => <path key={i} d={`M${1300 + i * 70} 660 l20 -150 l30 0 l10 120 l30 -90 l26 10 l-20 120 Q${1420 + i * 70} 760 ${1360 + i * 70} 740 Z`} fill="#8a8a86" stroke="#5a4630" strokeWidth="4" />)}
          {items.includes('gloves') && <path d="M1300 700 Q1380 680 1460 720" stroke="#5a4630" strokeWidth="18" fill="none" opacity=".8" />}
        </svg>
        {/* the blurred spokes of his front wheel across the lens */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: 'blur(10px)'}}>
          <circle cx="960" cy="1250" r="900" fill="none" stroke="#050506" strokeWidth="120" />
          {Array.from({length: 9}, (_, i) => <line key={i} x1="960" y1="1250" x2={960 + Math.cos(-0.3 - i * 0.32) * 900} y2={1250 + Math.sin(-0.3 - i * 0.32) * 900} stroke="#0a0a0b" strokeWidth="16" />)}
        </svg>
      </Frame>
    );
  }
  if (v === 'card-ins') {
    // through the fogged corner of the shop glass: Teer's khaki hand passing a small blue card back to the truck driver
    return (
      <Frame p={p} bg="#0c0e10" glow={NEON_GLOW(lit)}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #1a1c1e, #2a2c2a)'}} />
        <Hand x={720} y={560} s={1.5} rot={-80} skin="#d8a07a" sleeve="#8a7a50" mode="grip" />
        <div style={{position: 'absolute', left: 860, top: 470, width: 220, height: 140, borderRadius: 12, background: '#3a7ac8', transform: 'rotate(-8deg)', border: '4px solid #2a5a98'}}>
          <div style={{position: 'absolute', left: 20, top: 24, width: 120, height: 14, background: 'rgba(255,255,255,.7)'}} />
          <div style={{position: 'absolute', left: 20, top: 56, width: 170, height: 10, background: 'rgba(255,255,255,.5)'}} />
        </div>
        <Hand x={1240} y={600} s={1.5} rot={100} skin="#b07a52" sleeve="#3a2a2a" mode="open" flip />
        {/* the fog and the sticker edge on the glass, softening the card's print */}
        <div style={{position: 'absolute', left: 600, top: 300, width: 900, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(210,225,220,.4), rgba(210,225,220,0) 70%)', backdropFilter: 'blur(6px)'}} />
        <div style={{position: 'absolute', left: -40, top: -40, width: 700, height: 340, background: '#e74c3c', transform: 'rotate(-6deg)', opacity: 0.8}} />
      </Frame>
    );
  }
  if (v === 'notebook-high') {
    // high over Teer's khaki shoulder onto his open notebook: Jay's plate three times, one ringed in red
    return (
      <Frame p={p} bg="#0b0c0e" glow={NEON_GLOW(lit)}>
        <div style={{position: 'absolute', inset: 0, transform: 'scale(.86)', transformOrigin: '50% 40%'}}>
          <Notebook f={p.f} len={p.len} lines={6} plateLines={d.plateLines ?? 3} redCircle={d.redCircle} margin={d.margin} />
        </div>
        <div style={{position: 'absolute', left: 1380, top: -200, width: 900, height: 800, borderRadius: '50%', background: '#5a4a30', filter: 'blur(26px)', opacity: 0.9}} />
        <div style={{position: 'absolute', left: -60, right: -60, top: 780, height: 360, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.78) 55%)'}} />
      </Frame>
    );
  }

  if (v === 'tank-ins') {
    return (
      <Frame p={p} bg="#08090b" glow={NEON_GLOW(lit)}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <path d="M-40 420 Q600 220 1300 300 Q1800 360 1980 560 L1980 1120 L-40 1120 Z" fill="#2c3a4a" />
          <path d="M-40 420 Q600 220 1300 300 Q1800 360 1980 560" stroke="rgba(180,255,210,.25)" strokeWidth="10" fill="none" />
          {Array.from({length: 18}, (_, i) => <path key={i} d={`M${200 + rnd(71, i) * 1500} ${420 + rnd(72, i) * 400} l${20 + rnd(73, i) * 50} ${4 + rnd(74, i) * 10}`} stroke="#5a6a7a" strokeWidth="5" />)}
          <rect x="1260" y="700" width="420" height="160" rx="10" fill="#e8e2d0" opacity=".55" transform="rotate(-6 1470 780)" />
          <text x="1470" y="800" textAnchor="middle" fontSize="46" fontFamily="Plex Thai, sans-serif" fill="#2a3a5a" opacity=".6" transform="rotate(-6 1470 780)">ไฟแนนซ์ ส.เงินด่วน</text>
        </svg>
        <Hand x={720 + Math.sin(p.f / 10) * 40} y={380} s={1.3} rot={25} skin={C.skin} sleeve="#21466b" mode="open" />
      </Frame>
    );
  }
  if (v === 'boots-low' || v === 'boots-ins') {
    const walk = v === 'boots-low';
    const step = Math.floor(p.f / 15) % 2;
    return (
      <Frame p={p} bg="#060708" glow={NEON_GLOW(lit)} z={[1, walk ? 1.12 : 1.04]}>
        {/* the concrete at lens height, oil stains catching the neon */}
        <div style={{position: 'absolute', left: -100, top: 560, width: 2200, height: 700, background: 'linear-gradient(#17181a, #2a2b2e)'}} />
        <div style={{position: 'absolute', left: 300, top: 760, width: 900, height: 160, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,255,195,.18), rgba(0,0,0,.4) 70%)'}} />
        {[0, 1].map(i => {
          const near = walk ? (i === step ? 1.25 : 1) : 1;
          return (
            <svg key={i} width={420 * near} height={520 * near} viewBox="0 0 420 520" style={{position: 'absolute', left: 620 + i * 380, top: 640 - 380 * near + (walk ? 0 : 60)}}>
              <path d="M110 0 L310 0 L320 360 Q400 380 410 460 L410 520 L40 520 L60 380 Z" fill="#0b0c0d" />
              <path d="M60 380 Q200 360 320 360" stroke="#1d1f22" strokeWidth="14" fill="none" />
              {/* fresh mud caked on the toe and sole */}
              <path d="M40 470 Q200 430 410 470 L410 520 L40 520 Z" fill="#4a3420" />
              {Array.from({length: 8}, (_, k) => <circle key={k} cx={70 + rnd(80 + i, k) * 320} cy={440 + rnd(81 + i, k) * 40} r={8 + rnd(82, k) * 12} fill="#3a2818" />)}
              {d.mud === 'fresh' && <path d="M300 520 q6 30 2 50" stroke="#3a2818" strokeWidth="10" strokeLinecap="round" />}
            </svg>
          );
        })}
        {/* the muddy prints left behind on the concrete */}
        {walk && [0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 820 + (i % 2) * 260, top: 980 - i * 70, width: 140 - i * 30, height: 50 - i * 10, borderRadius: '40%', background: 'rgba(70,48,28,.7)'}} />)}
      </Frame>
    );
  }
  if (v === 'key-ins') {
    return (
      <Frame p={p} bg="#07080a" glow={NEON_GLOW(lit)}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <ellipse cx="900" cy="520" rx="520" ry="380" fill="#16191e" />
          <circle cx="900" cy="500" r="150" fill="#2a2e35" stroke="#000" strokeWidth="8" />
          <rect x="880" y="360" width="40" height="150" rx="10" fill="#aeb6c2" />
          <rect x="860" y="300" width="80" height="90" rx="18" fill="#1d1f22" />
          {/* the plain plastic tag on Jay's keyring, swinging a little */}
          <g transform={`rotate(${Math.sin(p.f / 7) * 12} 900 520)`}>
            <path d="M900 520 L900 640" stroke="#c9ced6" strokeWidth="6" />
            <rect x="860" y="640" width="80" height="120" rx="16" fill="#3a6ea8" />
          </g>
        </svg>
        <Hand x={1240} y={640} s={1.3} rot={200} skin={C.skin} sleeve="#21466b" mode="open" />
      </Frame>
    );
  }
  if (v === 'handlebar-ins') {
    const sw = Math.sin(p.f / 6) * 22 * (d.swing ? 1 : 0.3);
    return (
      <Frame p={p} bg="#060708" glow={NEON_GLOW(lit)}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <path d="M-40 640 Q900 520 1980 600" stroke="#141619" strokeWidth="90" fill="none" strokeLinecap="round" />
          <rect x="1160" y="560" width="460" height="130" rx="50" fill="#0c0d10" />
          {/* side mirror with the neon in it */}
          <path d="M1120 560 L1240 260" stroke="#141619" strokeWidth="24" />
          <ellipse cx="1300" cy="220" rx="170" ry="110" fill="#26303a" stroke="#0b0c0e" strokeWidth="14" />
          <ellipse cx="1260" cy="190" rx="70" ry="24" fill={`rgba(150,255,195,${0.4 * lit})`} />
          <g transform={`rotate(${sw} 980 600)`}>
            <circle cx="980" cy="640" r="20" fill="none" stroke="#c9ced6" strokeWidth="8" />
            <path d="M980 660 q30 40 0 80 q-30 40 0 80 q30 40 0 80" stroke="#7dff6a" strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d="M980 660 q30 40 0 80 q-30 40 0 80 q30 40 0 80" stroke="rgba(125,255,106,.35)" strokeWidth="64" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </Frame>
    );
  }
  if (v === 'mirror-ins') {
    // Jay's rear-view mirror: Chat small in it, the dark station behind him, only his eyes catching the light
    return (
      <Frame p={p} bg="#050607" glow={NEON_GLOW(lit)}>
        <div style={{position: 'absolute', left: -100, top: 700, width: 2200, height: 500, background: '#0e1012', filter: 'blur(10px)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M960 1100 L1010 760" stroke="#141619" strokeWidth="36" /></svg>
        <MirrorFrame x={560} y={160} w={800} h={540} W={1920} H={1080} r={270} ox={1100} oy={560} zoom={1.6}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#05070a, #15171a)'}}>
            <div style={{position: 'absolute', left: 1020, top: 470, width: 160, height: 220, borderRadius: '50% 50% 20px 20px', background: '#0a0b0c'}} />
            <div style={{position: 'absolute', left: 1050, top: 380, width: 110, height: 110, borderRadius: '50%', background: '#0e0f11'}} />
            {[1080, 1124].map(x => <div key={x} style={{position: 'absolute', left: x, top: 428, width: 10, height: 6, borderRadius: 3, background: 'rgba(190,255,215,.85)'}} />)}
            <div style={{position: 'absolute', left: 1050, top: 520, width: 100, height: 120, background: '#8f4320', opacity: 0.35}} />
          </div>
        </MirrorFrame>
      </Frame>
    );
  }
  if (v === 'helmet-high') {
    return (
      <Frame p={p} bg="#0a0c10" glow={NEON_GLOW(lit)}>
        {/* top-down on Jay's lap: navy jeans, the helmet upside down, a hand's shadow crossing it; the neon from frame left */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 35%, #3a5272, #0d1420 72%)'}} />
        <div style={{position: 'absolute', left: 400, top: 160, width: 900, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,255,195,.22), rgba(0,0,0,0) 70%)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <ellipse cx="960" cy="540" rx="420" ry="360" fill="#121418" stroke="#050506" strokeWidth="10" />
          <ellipse cx="960" cy="540" rx="320" ry="260" fill="#0a0b0d" />
          <rect x="1280" y="420" width="140" height="100" rx="14" fill="#111316" stroke="#000" strokeWidth="5" />
          <circle cx="1400" cy="440" r="8" fill="#2a1416" />
          <path d="M1330 520 q-30 60 -10 120" stroke="#e07a2c" strokeWidth="8" fill="none" />
        </svg>
        <div style={{position: 'absolute', left: 1500 - kf(p.f, [[0, 0], [p.len * 0.5, 1], [p.len, 0.2]]) * 600, top: 200, width: 520, height: 300, borderRadius: '50%',
          background: 'rgba(0,0,0,.55)', filter: 'blur(26px)'}} />
      </Frame>
    );
  }
  return <Frame p={p} glow={NEON_GLOW(lit)}><div /></Frame>;
};

// ---------------------------------------------------------------- cards, map, title

/** rule card: data {no, of, side: ghost | real, text, strike} → "กฎข้อ n / 5" on the kit card; `strike` crosses it out */
const CardScene: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? 'rule';
  const f = p.f;
  const drop = appear(f, 4, 14, backOut(1.3));
  if (v === 'red') {
    const lines = String(d.text ?? '').split('\n');
    return (
      <AbsoluteFill style={{background: '#050304', overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%, rgba(140,20,20,.45), rgba(0,0,0,0) 65%)'}} />
        <div style={{textAlign: 'center', marginTop: -160, opacity: appear(f, 2, 12)}}>
          {lines.map((l, i) => <div key={i} style={{fontFamily: T.display, fontWeight: 700, fontSize: 92, lineHeight: 1.3, color: i === lines.length - 1 ? '#ff4d43' : T.white,
            textShadow: '0 8px 40px rgba(0,0,0,.9)'}}>{l}</div>)}
        </div>
        <Grain f={f} opacity={0.16} />
      </AbsoluteFill>
    );
  }
  const real = d.side === 'real' || v === 'flip';
  const flipK = v === 'flip' ? kf(f, [[4, 0], [16, 1]]) : 1;
  const lines: string[] = String(d.text ?? '').split('\n');
  return (
    <AbsoluteFill style={{background: '#0b0907', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: real ? 'radial-gradient(ellipse at 50% 45%, rgba(40,70,110,.35), rgba(0,0,0,.85) 80%)' : 'radial-gradient(ellipse at 50% 45%, rgba(110,60,20,.3), rgba(0,0,0,.85) 80%)'}} />
      <div style={{position: 'absolute', left: 260, top: 230, width: 1400, padding: '100px 60px 70px', boxSizing: 'border-box', background: real ? '#e9eef4' : T.paper, borderRadius: 20,
        borderTop: `14px solid ${real ? '#2e6ab0' : T.red}`, textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,.6)',
        transform: `translateY(${(1 - drop) * -500}px) rotateY(${(1 - flipK) * 180}deg)`, opacity: Math.min(1, drop * 2)}}>
        <div style={{position: 'absolute', left: '50%', top: 26, transform: 'translateX(-50%)', height: 54, lineHeight: '54px', padding: '0 34px', borderRadius: 27,
          background: real ? '#2e6ab0' : T.red, color: '#fff', fontFamily: T.ui, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap'}}>
          {real ? `ความจริงของกฎข้อ ${d.no}` : `กฎข้อ ${d.no} / ${d.of ?? 5}`}
        </div>
        {lines.map((l, i) => <div key={i} style={{fontFamily: T.display, fontWeight: 700, fontSize: 70, lineHeight: 1.3, color: T.ink, whiteSpace: 'nowrap'}}>{l}</div>)}
        {d.strike && <div style={{position: 'absolute', left: 60, right: 60, top: '55%', height: 18, background: T.red, transform: `rotate(-6deg) scaleX(${kf(f, [[10, 0], [22, 1]])})`, transformOrigin: '0 50%', borderRadius: 9}} />}
      </div>
      <Grain f={f} opacity={0.12} />
    </AbsoluteFill>
  );
};

/** Chat's route on the tissue: stops drawn one by one; `shortcut` adds the dotted path from the sala to the station */
const MapScene: ShotComponent = p => {
  const d = D(p);
  const stops: string[] = d.stops ?? [];
  const pts = [[300, 300], [800, 560], [1260, 380], [1560, 620]];
  const draw = kf(p.f, [[0, 0], [p.len * 0.7, 1]]);
  return (
    <AbsoluteFill style={{background: '#0a0b0c', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #2c4f78, #0c1622 75%)'}} />
      <div style={{position: 'absolute', left: 140, top: 90, width: 1640, height: 820, background: '#f1ede4', transform: 'rotate(-2deg)', borderRadius: 18, boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
        <svg width={1640} height={820} style={{position: 'absolute', inset: 0}}>
          {stops.slice(0, 3).map((_, i) => i > 0 && (
            <line key={i} x1={pts[i - 1][0]} y1={pts[i - 1][1]} x2={pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * Math.min(1, Math.max(0, draw * 3 - (i - 1)))}
              y2={pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * Math.min(1, Math.max(0, draw * 3 - (i - 1)))} stroke="#23304a" strokeWidth="9" strokeLinecap="round" />
          ))}
          {d.shortcut && <path d={`M${pts[2][0]} ${pts[2][1]} Q1460 420 ${pts[3][0]} ${pts[3][1]}`} stroke="#c0392b" strokeWidth="9" strokeDasharray="22 18" fill="none" />}
          {d.mark === 'checkpoint' && <circle cx={pts[1][0]} cy={pts[1][1]} r="80" fill="none" stroke="#c0392b" strokeWidth="9" />}
          {stops.map((s, i) => (
            <g key={s} opacity={i < 3 ? Math.min(1, draw * 3 - i + 1) : 1}>
              <circle cx={pts[i][0]} cy={pts[i][1]} r="22" fill={i === 1 ? '#c0392b' : '#23304a'} />
              <text x={pts[i][0]} y={pts[i][1] - 50} textAnchor="middle" fontSize="54" fontFamily="Plex Thai, sans-serif" fill="#23304a">{s}</text>
            </g>
          ))}
        </svg>
      </div>
      <Grain f={p.f} opacity={0.12} />
    </AbsoluteFill>
  );
};

const TitleScene: ShotComponent = p => {
  const d = D(p);
  const lines = String(d.title ?? '').split('\n');
  const k = appear(p.f, 4, 18);
  return (
    <AbsoluteFill style={{background: '#030406', overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.35, filter: 'blur(4px)'}}><CemeteryRoad f={p.f} horizon={620} fog="thick" /></div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,.2) 20%, rgba(0,0,0,.85) 90%)'}} />
      {/* the red REC dot of the second camera */}
      <div style={{position: 'absolute', left: 1500, top: 200, width: 26, height: 26, borderRadius: '50%', background: Math.floor(p.f / 15) % 2 ? '#5a1210' : '#ff3b30', boxShadow: '0 0 30px 10px rgba(255,59,48,.35)'}} />
      <div style={{textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 20}px)`, marginTop: -120}}>
        {lines.map((l, i) => <div key={i} style={{fontFamily: T.display, fontSize: i === 0 ? 110 : 120, fontWeight: 700, color: i === 0 ? T.white : T.gold, lineHeight: 1.25, textShadow: '0 6px 30px rgba(0,0,0,.8)'}}>{l}</div>)}
        {d.note && <div style={{marginTop: 40, fontFamily: T.ui, fontSize: 30, color: '#9aa4b2'}}>{d.note}</div>}
      </div>
      <Grain f={p.f} opacity={0.14} />
    </AbsoluteFill>
  );
};

export const INSERTS: Record<string, ShotComponent> = {hand: HandScene, phone: PhoneScene, card: CardScene, map: MapScene, title: TitleScene};
