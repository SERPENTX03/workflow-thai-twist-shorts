import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {Hand} from '../../kit/inserts';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {ActorView, parseActor} from '../../kit/stage';
import {Actors, C, PX_CM, ROSTER} from './cast';
import {BigEye, D, Lotus, Macro, Pen, Pool, Sheet, Shot, Soft, Svg, Typed} from './common';

// คลินิกหมอ (brief.md → Sets): a shop-house consulting room. Back wall of paired photographs, a desk with a brass desk lamp
// that is the warm light, a neon tube above that is the cold one; both are in the frame. shutter/front are the street.

const R = makeRoom({x: 1100, y: 410}, {x0: 700, x1: 1520, y0: 240, y1: 668}, 3.3);
const LAMP = R.P(0.34, 0.72, 0.5);

const Wall: React.FC<{r: typeof R}> = ({r}) => (
  <Svg>
    {Array.from({length: 8}, (_, i) => Array.from({length: 3}, (_, row) => {
      const q = r.P(0.05 + i * 0.115, 0.08 + row * 0.2, 0);
      const w = 42, h = 62;
      return <g key={i + '-' + row}>
        <rect x={q.x} y={q.y} width={w * 2 + 8} height={h} fill="#17140f" />
        <rect x={q.x + 3} y={q.y + 3} width={w} height={h - 6} fill={'#8f8876'} />
        <rect x={q.x + w + 5} y={q.y + 3} width={w} height={h - 6} fill={'#c6bea9'} />
        <circle cx={q.x + 3 + w / 2} cy={q.y + 24} r={12} fill="#a78d78" />
        <circle cx={q.x + w + 5 + w / 2} cy={q.y + 24} r={12} fill="#dfbfa2" />
      </g>;
    }))}
  </Svg>
);

const Room: React.FC<{p: ShotProps; warm?: boolean}> = ({p, warm}) => {
  const r = R;
  return (
    <>
      <RoomShell r={r} id={warm ? 'clinic-w' : 'clinic'} wall={warm ? '#7c6a4f' : '#5c6d68'} side="#4e5e59" sideFar="#46534f" floorC="#3c3f3b" ceiling="#22262a" floor="tiles" walls="plain" boards={12} />
      <Wall r={r} />
      {/* medicine cabinet on the right, a padded couch, drip stand */}
      <RBox r={r} u={[0.74, 0.97]} v={[0.1, 1]} w={[0.02, 0.2]} front="#a4aaa2" top="#bcc2ba" side="#7c8279" />
      {[0.26, 0.5, 0.72].map(v => { const a = r.P(0.74, v, 0.2), b = r.P(0.97, v, 0.2); return <Svg key={v}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#454a44" strokeWidth={6} /></Svg>; })}
      <Svg>{Array.from({length: 30}, (_, i) => { const q = r.P(0.76 + (i % 10) * 0.021, 0.2 + Math.floor(i / 10) * 0.24, 0.2); return <rect key={i} x={q.x} y={q.y} width={18} height={34} rx={3} fill={['#b76a2a', '#51707a', '#d8d2c0'][i % 3]} />; })}</Svg>
      <RBox r={r} u={[0.03, 0.26]} v={[0.76, 1]} w={[0.05, 0.3]} front="#5a2f2c" top="#6d3c37" side="#3e201e" />
      {/* the desk across the room: glass top, drawers */}
      <RBox r={r} u={[0.2, 0.68]} v={[0.72, 1]} w={[0.42, 0.56]} front="#5d452f" top="#a6b7b3" side="#3c2c1e" />
      {/* tube */}
      {(() => { const a = r.P(0.3, 0.01, 0.42), b = r.P(0.7, 0.01, 0.42); return <Svg><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={warm ? '#7f7a6c' : '#f3fbf6'} strokeWidth={12} /></Svg>; })()}
      <LightVeil id={warm ? 'clinic-w' : 'clinic'} lights={[[LAMP.x + 40, LAMP.y - 30, 360], ...(warm ? [] : [[1100, 300, 420] as [number, number, number]])]} o={warm ? 0.32 : 0.46} color="#050708" />
      <Svg>
        <ellipse cx={LAMP.x} cy={LAMP.y} rx={44} ry={13} fill="#7d6222" />
        <path d={`M${LAMP.x} ${LAMP.y} V${LAMP.y - 92} L${LAMP.x + 28} ${LAMP.y - 118}`} stroke="#b28a3a" strokeWidth={8} fill="none" />
        <path d={`M${LAMP.x - 8} ${LAMP.y - 92} Q${LAMP.x + 28} ${LAMP.y - 150} ${LAMP.x + 70} ${LAMP.y - 110} L${LAMP.x + 60} ${LAMP.y - 88} L${LAMP.x + 2} ${LAMP.y - 70} Z`} fill="#254a39" stroke="#0e1d16" strokeWidth={4} />
      </Svg>
      <Pool x={LAMP.x + 40} y={LAMP.y - 30} rx={380} ry={240} color="255,200,120" a={0.62} />
    </>
  );
};

const Street: React.FC<{p: ShotProps; shut?: boolean; night?: boolean}> = ({shut, night}) => (
  <>
    <div style={{position: 'absolute', left: -600, top: -400, width: 3100, height: 1900, background: night ? 'linear-gradient(#0e1120, #1a1a2c)' : 'linear-gradient(#c5d2d8, #e3ded0)'}} />
    <Svg>
      {[-300, 330, 1370, 1900].map((x, i) => <g key={x}>
        <rect x={x} y={70} width={[620, 1040, 520, 620][i]} height={780} fill={night ? '#17171f' : i === 1 ? '#7b7766' : '#6f6b5a'} stroke="#1b1a16" strokeWidth={6} />
        {i !== 1 && Array.from({length: 18}, (_, k) => <line key={k} x1={x} y1={350 + k * 28} x2={x + [620, 1040, 520, 620][i]} y2={350 + k * 28} stroke="rgba(0,0,0,.28)" strokeWidth={4} />)}
      </g>)}
      {/* sign */}
      <rect x={480} y={120} width={740} height={120} fill={night ? '#0f1c17' : '#1f5244'} stroke="#0b1612" strokeWidth={6} />
      <text x={850} y={204} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={70} fill={night ? '#7ea59a' : '#eef2e6'}>คลินิกหมอประสิทธิ์</text>
      {/* folding door */}
      <rect x={430} y={300} width={840} height={540} fill={night ? '#0d0e10' : '#2e3030'} />
      {shut && Array.from({length: 28}, (_, i) => <rect key={i} x={430 + i * 30} y={300} width={22} height={540} fill="#65696a" />)}
      {shut && <rect x={830} y={530} width={60} height={70} rx={8} fill="#b28a3a" />}
      {shut && <rect x={660} y={380} width={380} height={130} fill="#ece6cf" stroke="#444" strokeWidth={4} />}
      {shut && <text x={850} y={465} textAnchor="middle" fontFamily={'"Plex Thai", sans-serif'} fontWeight={700} fontSize={66} fill="#2e2a22">ไปธุระ</text>}
      {!shut && <rect x={430} y={600} width={840} height={240} fill="#d8efe6" />}
      {!shut && Array.from({length: 28}, (_, i) => <rect key={i} x={430 + i * 30} y={300} width={22} height={300} fill="#3a3c3d" />)}
      <rect x={-600} y={850} width={3100} height={300} fill={night ? '#111118' : '#7e796b'} />
    </Svg>
    {!shut && night && <>
      <Pool x={850} y={720} rx={620} ry={280} color="205,245,230" a={0.5} />
      <Svg><path d="M430 860 L1270 860 L1500 1100 L200 1100 Z" fill="#c9e9de" opacity={0.2} /></Svg>
    </>}
  </>
);

const PhotoPair: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#050505" at={[52, 42]} vig={0.72} inner={34}>
    <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#39453f" /></Svg>
    <div style={{position: 'absolute', left: 240, top: 110, width: 1440, height: 800, background: '#17140f', boxShadow: '0 20px 60px rgba(0,0,0,.7)'}}>
      {[0, 1].map(i => <div key={i} style={{position: 'absolute', left: 30 + i * 700, top: 30, width: 680, height: 740, background: '#a59b84', filter: 'sepia(.45)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 160, top: 90, width: 360, height: 430, borderRadius: '48% 48% 46% 46%', background: i ? C.skinP : '#d8ab8c'}} />
        <div style={{position: 'absolute', left: 150, top: 60, width: 380, height: 170, borderRadius: '180px 180px 30px 30px', background: '#1b1820'}} />
        {i === 0
          ? <svg width={680} height={740} style={{position: 'absolute', left: 0, top: 0}}>
              <path d="M220 280 q50 34 90 4 M380 284 q50 30 90 -4 M226 262 q40 -14 80 2 M384 264 q40 -16 80 0" stroke="#7a5742" strokeWidth={8} fill="none" />
              <path d="M230 360 q30 60 10 120 M450 360 q-30 60 -10 120 M280 450 q60 30 120 0 M240 200 h200 M260 230 h160" stroke="#a4785c" strokeWidth={7} fill="none" />
              <path d="M210 520 q130 70 260 0" stroke="#a4785c" strokeWidth={7} fill="none" />
            </svg>
          : <svg width={680} height={740} style={{position: 'absolute', left: 0, top: 0}}>
              <path d="M230 270 q40 -22 80 0 M378 270 q40 -22 80 0" stroke="#1b1820" strokeWidth={9} fill="none" />
              <circle cx={272} cy={286} r={11} fill="#1b1820" /><circle cx={416} cy={286} r={11} fill="#1b1820" />
              <path d="M300 420 q44 16 88 0" stroke="#b2605b" strokeWidth={9} fill="none" />
              <path d="M530 210 Q556 300 520 400" stroke="#fff5ec" strokeWidth={5} fill="none" />
            </svg>}
        <div style={{position: 'absolute', left: 120, top: 540, width: 440, height: 200, borderRadius: '50% 50% 0 0', background: '#c9c2ad'}} />
      </div>)}
    </div>
    <div style={{position: 'absolute', left: -220, top: -60, width: 960, height: 1260, background: 'rgba(0,0,0,.5)', transform: 'skewX(-14deg)', filter: 'blur(20px)'}} />
    <Pool x={1300} y={200} rx={700} color="255,226,170" a={0.3} />
  </Macro>
);

const DeskSil: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#020303" at={[60, 54]} vig={0.86} inner={26} z={1.04}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill="#26302c" />
      <rect x={-10} y={700} width={1940} height={400} fill="#2d2318" />
      {Array.from({length: 6}, (_, i) => <g key={i}><rect x={70 + i * 310} y={70} width={260} height={160} fill="#17140f" /><rect x={80 + i * 310} y={80} width={116} height={140} fill="#78725e" /><rect x={206 + i * 310} y={80} width={116} height={140} fill="#a59b84" /></g>)}
      <path d="M1180 690 L1240 560" stroke="#b28a3a" strokeWidth={14} />
      <path d="M1100 620 L1240 460 L1370 530 L1260 650 Z" fill="#254a39" stroke="#0e1d16" strokeWidth={8} />
      <rect x={1050} y={610} width={260} height={100} rx={8} fill="#573a22" stroke="#20130a" strokeWidth={5} />
    </Svg>
    <Pool x={1200} y={660} rx={520} ry={340} color="255,200,120" a={0.72} />
    <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(.05)'}}>
      <ActorView a={{...parseActor('prasit-sil@760,1300 back'), h: 1300}} roster={ROSTER} floor={1300} pxPerCm={PX_CM} f={p.f} />
    </div>
  </Macro>
);

/** The desk from above the glass: files, cup, prescription pad */
const DeskTop: React.FC<{p: ShotProps; v: string}> = ({p, v}) => {
  if (v === 'folders-ins') return (
    <Macro p={p} bg="#050503" at={[48, 40]} vig={0.76} inner={30} z={1.05}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#6d7a74" /><rect x={-10} y={-10} width={1940} height={1100} fill="#2d2318" opacity={0.6} /></Svg>
      <Sheet x={520} y={240} w={800} h={560} color="#a06a48" rot={-11} />
      <Sheet x={470} y={280} w={800} h={560} color="#3e5a66" rot={6} />
      <Sheet x={590} y={200} w={760} h={620} color="#e8dcc0" rot={-3}>
        <Lotus x={150} y={140} r={100} emboss />
        <Typed x={280} y={90} size={58} weight={700}>สัญญาจัดหา</Typed>
        {[260, 330, 400, 470].map(y => <div key={y} style={{position: 'absolute', left: 60, top: y, width: 620, height: 8, background: '#857b62'}} />)}
      </Sheet>
      <Svg><ellipse cx={1600} cy={280} rx={120} ry={70} fill="#e6e0cf" stroke="#807a68" strokeWidth={5} /><ellipse cx={1600} cy={274} rx={82} ry={44} fill="#6f4b24" /></Svg>
      <Hand x={290} y={740} s={2.5} rot={-15} skin={C.skinT} sleeve={C.dayShirt} mode="open" />
      <Pool x={960} y={330} rx={760} color="255,200,120" a={0.48} />
    </Macro>
  );
  if (v === 'drawer-ins') return (
    <Macro p={p} bg="#040403" at={[50, 46]} vig={0.86} inner={26}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#2d2318" /></Svg>
      <Sheet x={520} y={230} w={760} h={560} color="#eef0e6" rot={4}>
        <Typed x={50} y={30} size={48} weight={700} color="#1f5244">Rx</Typed>
        <Pen x={250} y={200} size={110} color="#23305a" style={{transform: 'rotate(180deg)'}}>1-7-0-3</Pen>
      </Sheet>
      <Svg><path d="M1400 760 L1500 480" stroke="#141418" strokeWidth={20} strokeLinecap="round" /><path d="M1400 760 L1385 800 L1420 772 Z" fill="#b28a3a" /></Svg>
      <Hand x={290} y={560} s={2.2} rot={-6} skin="#b89a80" sleeve="#4f6653" mode="open" />
      <Pool x={860} y={460} rx={620} color="255,200,120" a={0.48} />
    </Macro>
  );
  return (
    <Macro p={p} bg="#040403" at={[50, 44]} vig={0.9} inner={24} z={1.05}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#2d2318" /></Svg>
      <Sheet x={190} y={70} w={1540} h={980} color="#eef0e6" rot={-2}>
        <Typed x={70} y={50} size={68} weight={700} color="#1f5244">Rx</Typed>
        <Pen x={260} y={310} size={260} color="#23305a">1-7-0-3</Pen>
        {[{x: 820, y: 700}].map((q, i) => <div key={i} style={{position: 'absolute', left: q.x, top: q.y, width: 110, height: 90, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(60,90,140,.45), rgba(60,90,140,0))'}} />)}
      </Sheet>
      <Hand x={1720} y={800} s={2.2} rot={200} skin={C.skinT} mode="open" />
      <Pool x={700} y={330} rx={900} color="255,200,120" a={0.36} />
    </Macro>
  );
};

const TearEye: React.FC<{p: ShotProps}> = ({p}) => (
  <Macro p={p} bg="#040302" at={[52, 44]} vig={0.88} inner={26} z={1.05}>
    <BigEye skin="#c79a78" skinD="#9a7154" iris="#3e3324" lid={0.4} look={-0.1} brow="#b1aca2" age={1} tear={0.8} wet />
    <div style={{position: 'absolute', left: -20, top: -20, width: 620, height: 1120, background: 'linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,0))'}} />
    <Pool x={1500} y={700} rx={760} color="255,180,100" a={0.3} />
    <Svg><rect x={1660} y={960} width={280} height={10} fill="#b28a3a" transform="rotate(-20 1660 960)" /></Svg>
  </Macro>
);

const ClinicScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'photo-ins') return <PhotoPair p={p} />;
  if (v === 'desk-sil') return <DeskSil p={p} />;
  if (v === 'folders-ins' || v === 'drawer-ins' || v === 'code-ecu') return <DeskTop p={p} v={v} />;
  if (v === 'prasit-tear-ecu') return <TearEye p={p} />;
  if (v === 'shutter-wide' || v === 'front-wide') return <Shot p={p} world={<><Street p={p} shut={v === 'shutter-wide'} night={v === 'front-wide'} /><Actors p={p} /></>} />;
  return <Shot p={p} world={<>
    <Soft p={p} dim={((d.cam as number[] | undefined)?.[0] ?? 1) >= 2.2 ? 0.46 : 0.82}><Room p={p} warm={!!d.past} /></Soft>
    <Actors p={p} />
    {d.folders && <Sheet x={d.folders[0]} y={d.folders[1]} w={d.folders[2] ?? 140} h={(d.folders[2] ?? 140) * 0.75} color="#e8dcc0" rot={-6} />}
  </>} fore={d.fore === 'ots' ? <div style={{position: 'absolute', left: -240, top: 300, width: 900, height: 950, borderRadius: '46% 46% 0 0', background: '#3f5243'}}><div style={{position: 'absolute', left: 300, top: -320, width: 360, height: 400, borderRadius: '50%', background: '#c79a78'}} /></div> : undefined} foreBlur={11} foreDark={0.5}
  over={undefined} />;
};

export const CLINIC: Record<string, ShotComponent> = {clinic: ClinicScene};
export {rnd, RFace};
