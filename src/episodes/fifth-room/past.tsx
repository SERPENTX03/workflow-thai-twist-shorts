import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {Cctv, cctvFrame} from '../../kit/pov';
import {Hand as HandKit} from '../../kit/inserts';
import {D, FONT, K, Macro, Pool, Pen, Sheet, Soft, Svg} from '../../kit/frame';
import {PoliceOffice} from '../../kit/policestation';
import {FLOOR} from '../../kit/world';
import {Actors, C, Shot} from './cast';
import {Street} from './ext';
import {WardrobeInside} from './rooms';
import {YardWorld} from './yard';
import {R5} from './room5';
import {LightVeil, RFace, RoomShell} from '../../kit/room';

// The flashbacks (data.past on every shot, one size tighter than the present), the gate and wardrobe cameras, the floor plan,
// and the police office. The two pier flashbacks share one frame: only the man on the pier changes.

/** the form on a car bonnet: signed from the road, signed in the end after counting. Same frame both times. */
const Form: React.FC<{p: ShotProps; end?: boolean}> = ({p, end}) => {
  const k = Math.min(1, p.f / Math.max(1, p.len * 0.6));
  return (
    <Macro p={p} bg={end ? '#22201a' : '#14110c'} at={[42, 46]} vig={end ? 0.4 : 0.6} inner={38} z={1.05} past={!end}>
      <div style={{position: 'absolute', inset: 0, background: end ? 'linear-gradient(#e4d7b8 0, #d4c29d 34%, #6c655a 35%, #4e4a43)' : 'linear-gradient(#c8c0a4 0, #b4aa8f 34%, #5a5650 35%, #3c3a36)'}} />
      {/* the house behind, soft: boards still on in the first, window open in the last */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 380, filter: 'blur(7px)'}}>
        <Svg>
          <rect x={980} y={70} width={1000} height={320} fill={end ? '#c4b296' : '#a79f88'} />
          <path d="M920 80 L1120 -30 H2000 V80 Z" fill={end ? '#86503a' : '#6a5748'} />
          {[1040, 1230, 1420, 1610, 1800].map((x, i) => <rect key={x} x={x} y={130} width={120} height={190} fill={end ? (i === 4 ? '#6e5a3e' : '#3a4042') : '#39403f'} stroke="#231a12" strokeWidth={6} />)}
        </Svg>
      </div>
      <Svg>
        <path d="M-20 370 Q960 330 1940 370 V1100 H-20 Z" fill={end ? '#767a7d' : '#596062'} />
        <path d="M-20 372 Q960 332 1940 372" stroke="#fff" strokeOpacity={0.4} strokeWidth={6} fill="none" />
      </Svg>
      <Sheet x={360} y={330} w={1040} h={620} color="#ece6d2" rot={-3}>
        <div style={{position: 'absolute', left: 50, top: 34, fontFamily: FONT.ui, fontWeight: 700, fontSize: 40, color: '#2a2a2a'}}>แบบรายงานการตรวจทรัพย์</div>
        <div style={{position: 'absolute', left: 50, top: 110, width: 940, height: 3, background: '#7c7768'}} />
        <div style={{position: 'absolute', left: 50, top: 150, fontFamily: FONT.ui, fontWeight: 500, fontSize: 36, color: '#3a3a3a'}}>ผู้อยู่อาศัยในทรัพย์</div>
        <div style={{position: 'absolute', left: 440, top: 136, width: 320, height: 86, border: '4px solid #3a3a3a'}} />
        <Pen x={490} y={136} size={70} color="#23305a">{k > 0.35 ? 'ว่าง' : ''}</Pen>
        <div style={{position: 'absolute', left: 50, top: 270, fontFamily: FONT.ui, fontWeight: 500, fontSize: 36, color: '#3a3a3a'}}>ผู้ตรวจ</div>
        <Pen x={210} y={250} size={64} color="#23305a">{k > 0.7 ? 'ริน' : ''}</Pen>
        <div style={{position: 'absolute', left: 210, top: 330, width: 460, height: 3, background: '#7c7768'}} />
        {end && <div style={{position: 'absolute', left: 50, top: 380, fontFamily: FONT.ui, fontWeight: 500, fontSize: 34, color: '#3a3a3a'}}>จำนวนห้องที่นับเอง: <span style={{fontFamily: FONT.hand, fontWeight: 700, fontSize: 56, color: '#23305a'}}>5</span></div>}
      </Sheet>
      <Pool x={1560} y={80} rx={900} color="255,226,170" a={end ? 0.42 : 0.2} />
    </Macro>
  );
};

export const FORM_END: React.FC<{p: ShotProps}> = ({p}) => <Form p={p} end />;

/** in the wardrobe, from inside the room: the panel closing on Manop's face */
const PanelClose: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#080604" at={[50, 42]} vig={0.72} inner={30} z={1.04} past>
      <Svg>
        <rect x={-20} y={-20} width={1960} height={1120} fill="#2d2118" />
        <rect x={420} y={-20} width={760 + (1 - k) * 60} height={1140} fill="#e6c98e" />
      </Svg>
      <Pool x={700} y={400} rx={560} color="255,220,160" a={0.3} />
      <Actors p={p} />
      <Svg>
        <rect x={1120 - k * 180} y={-20} width={1200} height={1140} fill="#4a3525" stroke="#1b130c" strokeWidth={10} />
        {[1300, 1460, 1620, 1780].map(x => <line key={x} x1={x - k * 180} y1={-20} x2={x - k * 180} y2={1100} stroke="#33241a" strokeWidth={6} />)}
      </Svg>
    </Macro>
  );
};

/** a hand and a spike at a flat tyre under one far street lamp */
const Tire: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#050505" at={[50, 50]} vig={0.72} inner={30} z={1.05} past>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#12141c, #1b1b1f 60%, #2a2a2c 61%, #1b1b1b)'}} />
    <Svg>
      <path d="M-20 110 Q600 40 1200 130 L1320 660 H-20 Z" fill="#2c3036" />
      <path d="M-20 240 H1240" stroke="#14171c" strokeWidth={6} />
      <circle cx={760} cy={660} r={320} fill="#101012" />
      <path d="M440 800 Q760 900 1080 800 L1080 880 H440 Z" fill="#101012" />
      <circle cx={760} cy={650} r={170} fill="#2f3236" stroke="#0a0a0c" strokeWidth={14} />
      {Array.from({length: 8}, (_, i) => <line key={i} x1={760} y1={650} x2={760 + Math.cos(i * 0.785) * 150} y2={650 + Math.sin(i * 0.785) * 150} stroke="#14161a" strokeWidth={10} />)}
      {/* the boot beside the wheel */}
      <path d="M1260 940 V520 H1520 L1560 860 Q1700 880 1720 940 Z" fill={C.boot} stroke={C.bootD} strokeWidth={8} />
      <path d="M1264 530 H1518" stroke={C.bootL} strokeWidth={14} />
      <path d="M1250 930 h480" stroke={C.mud} strokeWidth={18} opacity={0.85} />
      {/* the spike and the right hand */}
      <path d="M1080 650 L880 610" stroke="#c9ccd1" strokeWidth={14} strokeLinecap="round" />
    </Svg>
    <HandKit x={1200} y={700} s={1.5} rot={-8} skin={C.skinC} sleeve={C.shirtC} pinkyCut flip />
    <Pool x={200} y={60} rx={780} color="255,190,120" a={0.24} />
  </Macro>
);

/** the house Rin signed for. Composition from the Flow reference: closed gate and notice behind, their things on the road edge
 *  with the grandmother and child sitting among them, Rin's back filling the right, late sun raking in from the left. */
const Eviction: React.FC<{p: ShotProps}> = ({p}) => (
  <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -300, top: -300, width: 2600, height: 1000, background: 'linear-gradient(#ecd9ae, #f4e6c4)'}} />
    <Svg>
      {/* the house: wood upstairs under a tin roof, plaster below */}
      <path d="M300 170 L420 70 L1400 70 L1500 170 Z" fill="#7c5a40" stroke="#3d2a1c" strokeWidth={5} />
      {Array.from({length: 10}, (_, i) => <line key={i} x1={330 + i * 118} y1={170} x2={440 + i * 96} y2={72} stroke="#4f3726" strokeWidth={3} />)}
      <rect x={350} y={168} width={1100} height={230} fill="#8d6b4a" />
      {Array.from({length: 22}, (_, i) => <line key={i} x1={350 + i * 50} y1={168} x2={350 + i * 50} y2={398} stroke="#6a4e35" strokeWidth={3} />)}
      {[520, 860, 1200].map(x => <g key={x}><rect x={x} y={205} width={160} height={150} fill="#33291e" stroke="#2a1d12" strokeWidth={6} /><line x1={x + 80} y1={205} x2={x + 80} y2={355} stroke="#6a4e35" strokeWidth={5} /></g>)}
      <path d="M320 398 H1480 L1520 440 H290 Z" fill="#6c6a60" stroke="#3a3830" strokeWidth={4} />
      <rect x={350} y={438} width={1100} height={270} fill="#57483a" />
      <rect x={560} y={470} width={270} height={236} fill="#2c241c" />
      {/* the low wall right of the gate */}
      <rect x={1080} y={500} width={800} height={208} fill="#cbbb98" stroke="#8c7e62" strokeWidth={4} />
      <rect x={1080} y={488} width={800} height={18} fill="#ddcfae" />
      {/* the gate shut, chain and notice */}
      <rect x={380} y={430} width={700} height={278} fill="rgba(20,16,12,.2)" />
      {Array.from({length: 18}, (_, i) => <rect key={i} x={386 + i * 40} y={425} width={8} height={285} fill="#25211d" />)}
      <rect x={374} y={424} width={712} height={13} fill="#25211d" /><rect x={374} y={612} width={712} height={11} fill="#25211d" />
      <rect x={366} y={410} width={26} height={300} fill="#3a342c" /><rect x={1070} y={410} width={26} height={300} fill="#3a342c" />
      <path d="M600 520 q16 26 34 0 q16 26 34 0 q16 26 34 0" stroke="#c9c9c0" strokeWidth={9} fill="none" />
      <rect x={666} y={526} width={42} height={40} rx={5} fill="#6d6a5c" />
      <g transform="rotate(-2 470 500)"><rect x={410} y={445} width={140} height={108} fill="#efe8d4" stroke="#a12c24" strokeWidth={7} /><rect x={428} y={468} width={104} height={9} fill="#a12c24" /><rect x={428} y={492} width={104} height={7} fill="#8d8675" /><rect x={428} y={512} width={78} height={7} fill="#8d8675" /></g>
      {/* the pole and its wires on the left */}
      <rect x={196} y={-40} width={42} height={790} fill="#6f675a" stroke="#3a342b" strokeWidth={4} />
      <rect x={120} y={80} width={200} height={14} fill="#4a4338" />
      <path d="M-40 60 Q420 170 1000 40 M-40 110 Q500 220 1300 30 M220 90 Q700 240 1940 80" stroke="#231f1a" strokeWidth={4} fill="none" />
      <path d="M210 300 Q320 420 400 450" stroke="#231f1a" strokeWidth={4} fill="none" />
      {/* pavement and road: the road runs to a point off the upper right */}
      <rect x={-40} y={704} width={2000} height={70} fill="#b6a98c" />
      <path d="M-40 704 H1960" stroke="#857a60" strokeWidth={5} />
      <path d="M-40 774 H1960 V1140 H-40 Z" fill="#6e6a5f" />
      <path d="M-40 774 H1960" stroke="#4a463c" strokeWidth={8} />
      <path d="M300 1120 L1100 790" stroke="#d6c9a6" strokeWidth={9} strokeDasharray="60 44" opacity={0.7} />
      {/* the shadows of the gate bars and pole across the pavement, low sun */}
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${420 + i * 80} 708 l180 66 h14 l-180 -66 Z`} fill="#3b352b" opacity={0.45} />)}
      <path d="M216 750 L720 1120 H620 L196 760 Z" fill="#37322a" opacity={0.42} />
      {/* their things */}
      <g stroke="#2e2318" strokeWidth={3}>
        <rect x={440} y={590} width={12} height={150} fill="#6a4a2e" /><rect x={544} y={590} width={12} height={150} fill="#6a4a2e" /><rect x={436} y={590} width={124} height={70} rx={6} fill="#8a6440" /><rect x={428} y={668} width={140} height={15} fill="#8a6440" /><rect x={434} y={683} width={12} height={58} fill="#6a4a2e" /><rect x={552} y={683} width={12} height={58} fill="#6a4a2e" />
        <rect x={585} y={585} width={150} height={160} rx={54} fill="#d9cfb6" /><path d="M610 600 V730 M710 600 V730" stroke="#7a2f26" strokeWidth={8} fill="none" />
        <rect x={980} y={640} width={150} height={104} fill="#b78f5e" /><path d="M980 668 H1130 M1055 640 V744" stroke="#7c5c36" fill="none" />
        <rect x={1020} y={560} width={110} height={82} fill="#c7a26f" />
        <ellipse cx={1200} cy={700} rx={92} ry={50} fill="#6a7a78" /><path d="M1140 672 q60 -46 120 0" stroke="#3e4c4b" fill="none" /><circle cx={1200} cy={652} r={16} fill="#6a7a78" />
        <ellipse cx={1290} cy={712} rx={64} ry={38} fill="#7e6a55" />
        <circle cx={1130} cy={510} r={46} fill="#384240" /><circle cx={1130} cy={510} r={12} fill="#889390" /><path d="M1130 556 V600" stroke="#384240" strokeWidth={10} />
      </g>
    </Svg>
    {/* warm light: the wall catches it, the gate side stays in shade */}
    <div style={{position: 'absolute', left: -300, top: -300, width: 2600, height: 1500, background: 'linear-gradient(100deg, rgba(255,190,110,.26), rgba(255,190,110,0) 45%, rgba(40,24,10,.32) 100%)', mixBlendMode: 'multiply'}} />
    <Pool x={-60} y={440} rx={1000} color="255,214,150" a={0.42} />
    <Actors p={p} />
  </>} />
);

const Past: ShotComponent = p => {
  const v = p.shot.view ?? '', d = D(p);
  if (v === 'signed-ins') return <Form p={p} />;
  if (v === 'manop-panel-close') return <PanelClose p={p} />;
  if (v === 'tire-ins') return <Tire p={p} />;
  if (v === 'eviction-high') return <Eviction p={p} />;
  if (v === 'nim-wall-close') return <Shot p={p} world={<>
    <div style={{position: 'absolute', left: -600, top: -500, width: 3200, height: 2200, background: '#3f5a4c'}} />
    <Pool x={1100} y={420} rx={560} color="255,160,80" a={0.62} />
    <Svg><rect x={1180} y={520} width={34} height={180} fill="#efe8cf" /><path d="M1197 480 q-24 26 0 42 q24 -16 0 -42 Z" fill="#ffcf6a" /></Svg>
    <Actors p={p} />
  </>} />;
  // pier flashbacks, one frame
  return <Shot p={p} world={<>
    <Soft p={p}><YardWorld p={p} tone="moon" /></Soft>
    {d.sil && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}><Actors p={p} cast={d.sil} /></div>}
    <Actors p={p} />
    {d.envelope && <Svg><g transform={`translate(${d.envelope[0]} ${d.envelope[1]}) rotate(-14)`}><rect x={-30} y={-20} width={60} height={40} fill="#e7dcbf" stroke="#7b7056" strokeWidth={3} /></g></Svg>}
    {d.splash && <Svg>{Array.from({length: 18}, (_, i) => <circle key={i} cx={d.splash[0] + (rnd(101, i) - 0.5) * 240} cy={d.splash[1] - rnd(102, i) * 120} r={3 + rnd(103, i) * 7} fill="#cfe0f0" opacity={0.75} />)}</Svg>}
  </>} />;
};

/** Close: two big hands shoving a chest. Drawn for itself. */
const PushClose: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Macro p={p} bg="#04050a" at={[50, 46]} vig={0.7} inner={28} z={1.06} past>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#0f1626, #1c2740 50%, #0a1018)'}} />
      <div style={{position: 'absolute', left: 500 - k * 70, top: 60 + k * 20, width: 720, height: 960, background: '#58523f', borderRadius: '120px 120px 40px 40px', transform: `rotate(${-6 - k * 8}deg)`}} />
      <Svg>
        <g transform={`translate(${-k * 70} ${k * 20}) rotate(${-6 - k * 8} 860 500)`}>
          <path d="M650 180 Q860 340 1070 180" stroke="#222" strokeWidth={8} fill="none" />
          <rect x={816} y={330} width={80} height={96} rx={12} fill="#c9a24a" stroke="#5e4716" strokeWidth={6} />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 640 - k * 180, top: 690 + k * 260, width: 280, height: 180, background: '#e7dcbf', border: '6px solid #7b7056', transform: `rotate(${-20 - k * 60}deg)`}} />
      <HandKit x={1400} y={380} s={2.4} rot={-6} skin={C.skinC} sleeve={C.shirtC} mode="open" flip />
      <HandKit x={1500} y={640} s={2.4} rot={4} skin={C.skinC} sleeve={C.shirtC} mode="open" pinkyCut flip />
      <Svg>{Array.from({length: 22}, (_, i) => <circle key={i} cx={rnd(111, i) * 1000 + 200} cy={920 + rnd(112, i) * 150} r={4 + rnd(113, i) * 10} fill="#d7e6f5" opacity={0.6} />)}</Svg>
    </Macro>
  );
};

const PastAll: ShotComponent = p => (p.shot.view === 'pier-push-close' ? <PushClose p={p} /> : <Past {...p} />);

// ---------------------------------------------------------------- the cameras

const CamGate: React.FC<{p: ShotProps; ecu?: boolean}> = ({p, ecu}) => {
  const f2 = cctvFrame(p.f);
  const q = {...p, f: f2};
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Cctv W={1920} H={1080} f={p.f} cam="หน้ารั้ว" time="22:05:11" date="พุธ">
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: ecu ? 'scale(2.8)' : 'scale(1.5)', transformOrigin: ecu ? '1160px 700px' : '1100px 720px'}}>
          <Street p={{...q, shot: {...q.shot, data: {...D(q), tone: 'night', five: 'off'}}}} />
          <Actors p={q} />
        </div>
      </Cctv>
    </div>
  );
};

/** the camera in the wardrobe looks down at the hatch. The hand comes in exactly as it did in key-ots. */
const CamHatch: React.FC<{p: ShotProps; cover?: boolean}> = ({p, cover}) => {
  const k = K(p);
  const f2 = cctvFrame(p.f);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Cctv W={1920} H={1080} f={p.f} cam="ในตู้" time={cover ? '22:03:40' : '22:00:03'} date="พฤหัส" tint="green" glitch={0.5}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>
          <div style={{position: 'absolute', inset: 0, filter: 'brightness(.7)'}}><WardrobeInside p={{...p, f: f2}} /></div>
          {cover ? <>
            <Svg>
              <ellipse cx={960} cy={580} rx={250} ry={300} fill={C.skinCD} />
              <path d="M720 440 Q960 240 1200 440 L1200 380 Q960 170 720 380 Z" fill="#141216" />
              {[850, 1070].map(x => <g key={x}><rect x={x - 80} y={500} width={160} height={90} rx={12} fill="#0a0a0a" stroke="#0a0a0a" strokeWidth={8} /><rect x={x - 66} y={514} width={132} height={62} rx={8} fill="#b8ffc6" /></g>)}
              <path d="M930 546 h60" stroke="#0a0a0a" strokeWidth={10} />
              <path d="M880 720 q80 20 160 0" stroke="#231814" strokeWidth={10} fill="none" />
            </Svg>
            {k > 0.62 && <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${Math.min(1, (k - 0.62) * 6)})`}} />}
            {k > 0.55 && <HandKit x={960} y={880 - Math.min(1, (k - 0.55) * 5) * 420} s={4.6} rot={-90} skin={C.skinC} mode="open" />}
          </> : <>
            {/* same place, same side, same size as the key hand */}
            <Svg><path d="M520 590 q50 -86 92 -14 q10 44 -30 66 q-60 16 -62 -52 Z" fill="#d6d6c8" /><rect x={560} y={500} width={46} height={18} fill="#6a6a60" /></Svg>
            <HandKit x={1120} y={560} s={2.4} rot={-6} skin={C.skinC} sleeve={C.shirtC} pinkyCut flip />
          </>}
        </div>
      </Cctv>
    </div>
  );
};

const CctvScene: ShotComponent = p => {
  const v = p.shot.view ?? '';
  if (v === 'gate-cctv') return <CamGate p={p} />;
  if (v === 'gate-cctv-ecu') return <CamGate p={p} ecu />;
  return <CamHatch p={p} cover={v === 'cover-cctv'} />;
};

// ---------------------------------------------------------------- the plan

const PlanTop: ShotComponent = p => {
  const v = p.shot.view ?? '';
  const missing = v === 'missing-top', sum = v === 'rooms-sum-top';
  return (
    <Macro p={p} bg="#0b0a08" at={[50, 42]} vig={missing ? 0.72 : 0.5} inner={32} z={1.04}>
      <div style={{position: 'absolute', inset: 0, background: '#3d3425'}} />
      <Sheet x={130} y={40} w={1660} h={830} color="#e7dfc7">
        <Svg>
          <text x={60} y={66} fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#7a2a24">แปลนทรัพย์ · บ้านเลขที่ 5</text>
          {/* the four rooms */}
          <rect x={60} y={190} width={1150} height={440} fill="none" stroke="#2a3250" strokeWidth={10} />
          {[340, 640, 930].map(x => <line key={x} x1={x} y1={190} x2={x} y2={630} stroke="#2a3250" strokeWidth={7} />)}
                    {['ห้องนั่งเล่น', 'ครัว', 'ห้องนอนใหญ่', 'ห้องนอนเล็ก'].map((t, i) => <text key={t} x={[200, 490, 785, 1070][i]} y={420} textAnchor="middle" fontFamily={FONT.ui} fontWeight={600} fontSize={32} fill="#2a3250">{t}</text>)}
          {/* windows on the front line */}
          {[130, 390, 720, 1050].map(x => <rect key={x} x={x} y={622} width={140} height={16} fill="#e7dfc7" stroke="#2a3250" strokeWidth={5} />)}
                    {sum && ['2.60', '2.20', '2.20', '2.00'].map((t, i) => <text key={i} x={[200, 490, 785, 1070][i]} y={160} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#23305a">{t}</text>)}
          {sum && <text x={640} y={740} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={82} fill="#23305a">รวม 9.00 ม.</text>}
          {missing && <>
            <rect x={1214} y={190} width={380} height={444} fill="rgba(179,32,31,.28)" stroke="#b3201f" strokeWidth={8} strokeDasharray="20 14" />
            <path d="M1214 190 L1594 634 M1594 190 L1214 634" stroke="#b3201f" strokeWidth={3} opacity={0.45} />
            <rect x={1340} y={622} width={120} height={18} fill="#ffd27a" stroke="#b3201f" strokeWidth={5} />
            <text x={1404} y={410} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={58} fill="#7d1414">2.40 ม.</text>
            <text x={1660} y={410} textAnchor="middle" fontFamily={FONT.ui} fontWeight={500} fontSize={26} fill="#555" transform="rotate(90 1610 410)">บ้านป้านิ่ม</text>
            <text x={640} y={750} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={70} fill="#7d1414">11.40 − 9.00 = 2.40 ม.</text>
          </>}
        </Svg>
      </Sheet>
      {v === 'floor-top' && <Svg>
        <path d="M1500 560 L1860 960" stroke="#14161c" strokeWidth={26} strokeLinecap="round" />
        <circle cx={1490} cy={548} r={34} fill="none" stroke="#b3201f" strokeWidth={7} />
      </Svg>}
      <Pool x={960} y={260} rx={900} ry={420} color="255,226,170" a={0.28} />
    </Macro>
  );
};

// ---------------------------------------------------------------- police office

const Station: ShotComponent = p => (
  <Shot p={p} grain={0.08} world={<>
    <Soft p={p}><PoliceOffice behind={D(p).behind && <Actors p={p} cast={D(p).behind} />} /></Soft>
    <Actors p={p} />
  </>} />
);

export const PAST: Record<string, ShotComponent> = {past: PastAll, cctv: CctvScene, plan: PlanTop, station: Station};
void FLOOR; void R5; void RFace; void RoomShell; void LightVeil;
