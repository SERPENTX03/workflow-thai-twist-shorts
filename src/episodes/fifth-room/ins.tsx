import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {appear, rnd} from '../../engine/anim';
import {T} from '../../engine/theme';
import {EndCardScene} from '../../kit/EndCard';
import {D, FONT, K, Macro, Pen, Pool, Sheet, Svg, Typed} from '../../kit/frame';
import {Grain} from '../../kit/horror';
import {C} from './cast';
import {CLUES} from './clues';
import {FORM_END} from './past';

// Inserts of ห้องที่ห้า: every clue keeps one frame, one side, one hand (brief.md → Clues), so the pay-off is recognised.
// The tracked device (meter) is one component with one framing, the light changes.

const num = (n: number) => n.toLocaleString('en-US');

/** the electricity meter: disc turning behind glass, five digit wheels, the last one rolling up. mode by the hour. */
export const Meter: React.FC<{p: ShotProps; value: number; light: 'torch' | 'day' | 'am' | 'gold' | 'dusk'; stopped?: boolean; ecu?: boolean}> = ({p, value, light, stopped, ecu}) => {
  const lamp = {torch: '255,236,190', day: '255,250,230', am: '205,222,240', gold: '255,214,150', dusk: '255,196,140'}[light];
  const dark = light === 'torch';
  const spin = stopped ? 0 : p.f * 2.2;
  const digits = String(value).padStart(5, '0').split('');
  const roll = stopped ? 0 : Math.min(0.46, K(p) * 0.46);
  const s = ecu ? 1.9 : 1;
  return (
    <Macro p={p} bg={dark ? '#040406' : '#141414'} at={dark ? [42, 40] : [50, 42]} vig={dark ? 0.86 : 0.5} inner={dark ? 24 : 40} z={ecu ? 1.12 : 1.06} oy={ecu ? 300 : 430} past={false}>
      <div style={{position: 'absolute', inset: 0, background: dark ? '#17181b' : light === 'gold' ? '#a58e70' : light === 'am' ? '#7f8a90' : '#8f8d80'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: `${ecu ? 1060 : 960}px ${ecu ? 400 : 430}px`}}>
        <Svg>
          <rect x={420} y={40} width={1080} height={880} rx={40} fill="#55564f" stroke="#26261f" strokeWidth={10} />
          <circle cx={960} cy={440} r={385} fill="#25272a" stroke="#0e0f11" strokeWidth={14} />
          <circle cx={960} cy={440} r={358} fill="#c9c7ba" />
          <rect x={730} y={220} width={460} height={130} rx={8} fill="#11110f" stroke="#55534a" strokeWidth={6} />
          {digits.map((c, i) => {
            const last = i === digits.length - 1;
            const nxt = String((+c + 1) % 10);
            return (
              <g key={i}>
                <rect x={742 + i * 88} y={232} width={82} height={106} fill={last ? '#efe9d6' : '#1d1d1b'} />
                <clipPath id={`dg${i}`}><rect x={742 + i * 88} y={232} width={82} height={106} /></clipPath>
                <g clipPath={`url(#dg${i})`}>
                  <text x={783 + i * 88} y={316 - (last ? roll * 106 : 0)} textAnchor="middle" fontFamily={FONT.type} fontWeight={700} fontSize={92} fill={last ? '#a11818' : '#efe9d6'}>{c}</text>
                  {last && <text x={783 + i * 88} y={422 - roll * 106} textAnchor="middle" fontFamily={FONT.type} fontWeight={700} fontSize={92} fill="#a11818">{nxt}</text>}
                </g>
              </g>
            );
          })}
          <text x={960} y={400} textAnchor="middle" fontFamily={FONT.ui} fontWeight={600} fontSize={34} fill="#3b3a34">หน่วย (kWh)</text>
          {/* the disc, edge-on behind a slot: the black mark comes round */}
          <rect x={700} y={500} width={520} height={120} rx={14} fill="#1b1b1a" />
          <ellipse cx={960} cy={560} rx={240} ry={38} fill="#b9bbb6" stroke="#55564f" strokeWidth={5} />
          <rect x={960 + Math.sin(spin / 16) * 225 - 18} y={530} width={36} height={60} rx={8} fill="#111" opacity={0.3 + 0.7 * Math.max(0, Math.cos(spin / 16))} />
          <path d="M660 650 h600" stroke="#55564f" strokeWidth={4} />
          <text x={960} y={700} textAnchor="middle" fontFamily={FONT.ui} fontWeight={600} fontSize={26} fill="#55534a">เลขมิเตอร์ 0483-5 · บ้านเลขที่ 5</text>
          {/* glass */}
          <path d="M660 180 Q880 90 1130 170 L1010 520 Q820 480 600 510 Z" fill="#fff" opacity={0.1} />
          <circle cx={960} cy={440} r={358} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth={8} />
          {Array.from({length: 40}, (_, i) => <circle key={i} cx={620 + rnd(51, i) * 680} cy={120 + rnd(52, i) * 640} r={2 + rnd(53, i) * 5} fill="#2c2b25" opacity={0.3} />)}
        </Svg>
      </div>
      {dark ? <>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 620px 520px at 44% 36%, rgba(0,0,0,0) 40%, rgba(0,0,0,.88) 100%)'}} />
        <Pool x={840} y={380} rx={620} color={lamp} a={0.42} />
      </> : <>
        <div style={{position: 'absolute', inset: 0, background: light === 'gold' ? 'linear-gradient(100deg, rgba(255,190,110,.18), rgba(20,10,0,.5))' : 'linear-gradient(100deg, rgba(0,0,0,.42), rgba(0,0,0,0) 60%)'}} />
        <Pool x={1500} y={160} rx={900} color={lamp} a={0.34} />
      </>}
    </Macro>
  );
};

/** the bank's plan across a lap in the car's roof light, pen touching each room */
const PlanLap: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p), n = Math.min(3, Math.floor(k * 4));
  const room = [[440, 300], [800, 300], [1120, 300], [1400, 300]];
  return (
    <Macro p={p} bg="#050403" at={[50, 40]} vig={0.85} inner={30} z={1.05}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#191613" />
        <path d="M-10 800 Q960 760 1930 800 V1100 H-10 Z" fill="#2a2520" />
      </Svg>
      <Sheet x={220} y={70} w={1480} h={780} color="#e9e2cb" rot={-1.5}>
        <Svg>
          <rect x={80} y={70} width={1320} height={560} fill="none" stroke="#2a3250" strokeWidth={11} />
          {[420, 720, 1060].map(x => <line key={x} x1={x} y1={70} x2={x} y2={630} stroke="#2a3250" strokeWidth={8} />)}
          {['ห้องนั่งเล่น', 'ครัว', 'ห้องนอนใหญ่', 'ห้องนอนเล็ก'].map((t, i) => <text key={t} x={[250, 570, 890, 1230][i]} y={370} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#2a3250">{t}</text>)}
          <text x={80} y={50} fontFamily={FONT.ui} fontWeight={600} fontSize={28} fill="#7a2a24">แปลนทรัพย์รอการขาย · บ้านเลขที่ 5</text>
        </Svg>
      </Sheet>
      <Svg>
        <circle cx={room[n][0] - 80} cy={room[n][1] + 120} r={32} fill="none" stroke="#b3201f" strokeWidth={7} />
        <path d={`M${room[n][0] - 76} ${room[n][1] + 124} L${room[n][0] + 240} ${room[n][1] + 480}`} stroke="#14161c" strokeWidth={26} strokeLinecap="round" />
        <path d={`M${room[n][0] + 240} ${room[n][1] + 480} L${room[n][0] + 620} ${room[n][1] + 700}`} stroke={C.skinR} strokeWidth={84} strokeLinecap="round" />
      </Svg>
      <Pool x={960} y={260} rx={760} ry={420} color="255,226,170" a={0.36} />
    </Macro>
  );
};

export const VIEWS: Record<string, React.FC<{p: ShotProps}>> = {
  'plan-lap-ins': PlanLap,
  'form-sign-ins': FORM_END,
  ...CLUES,
};

const Ins: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v.startsWith('meter')) {
    const light = v.endsWith('-day') ? 'day' : v.endsWith('-am') || v.endsWith('-wed') ? 'am' : v.endsWith('-thu') ? 'dusk' : v === 'meter-stop-ecu' ? 'gold' : 'torch';
    return <Meter p={p} value={d.meter ?? 18406} light={light} stopped={v === 'meter-stop-ecu'} ecu={v === 'meter-ecu' || v === 'meter-stop-ecu'} />;
  }
  const V = VIEWS[v];
  if (V) return <V p={p} />;
  return <Macro p={p} bg="#121212"><Typed x={200} y={420} size={60} color="#888">{v}</Typed><Pen x={200} y={520} size={40} color="#666">ยังไม่ได้วาด</Pen></Macro>;
};

const Title: ShotComponent = p => {
  const a = appear(p.f, 4, 22), d = D(p);
  return (
    <AbsoluteFill style={{background: '#040305', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 24}px)`}}>
        <div style={{fontFamily: T.title, fontSize: 168, color: T.white, lineHeight: 1.2, textShadow: '0 8px 40px rgba(0,0,0,.9)'}}>{d.title}</div>
        <div style={{margin: '26px auto 0', width: 560, display: 'flex', flexDirection: 'column', gap: 9}}>
          {[0.5, 1, 0.5].map((o, i) => <div key={i} style={{height: 5, background: '#ffd27a', opacity: o * 0.9, boxShadow: '0 0 16px rgba(255,200,110,.7)'}} />)}
        </div>
        <div style={{marginTop: 34, fontFamily: T.ui, fontWeight: 500, fontSize: 36, color: '#b9b3a6'}}>{d.sub}</div>
      </div>
      <Grain f={p.f} opacity={0.14} />
    </AbsoluteFill>
  );
};

const End: ShotComponent = p => <EndCardScene p={p} />;

export const INS: Record<string, ShotComponent> = {ins: Ins, title: Title, endcard: End};
