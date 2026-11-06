import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {Stage as KitStage, parseActor} from '../../kit/stage';
import {Cctv, Pov} from '../../kit/pov';
import {FifFore, OtsFore, keystone} from './camera';
import {FLOOR, Glow, W, full} from '../../kit/world';

const T_FONT = '"Plex Thai", sans-serif';
import {ChildRoom, type ChildRoomProps} from '../../kit/childroom';

/** Episode Stage wrapper: KitStage plus the camera setups named by the view's tags (data.fx, see camera.tsx):
 *  low / high keystone the world, ots draws the listener as a dark foreground shape, fif a door-jamb foreground,
 *  pov looks through a door crack or a phone camera, cctv is recorded footage, dutch tilts (data.tilt). */
export const Stage: React.FC<ShotProps & {bg?: string; cam?: number[]; presets?: Record<string, number[]>; fore?: React.ReactNode; light?: string; children: React.ReactNode}> = ({
  bg, cam, presets, fore, light, children, ...p
}) => {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const fx = (d.fx ?? []) as string[];
  const cast = (d.cast ?? []) as string[];
  let foreNode = fore;
  if (fx.includes('ots') && d.ots) {
    const speaker = cast.map(parseActor).find(a => a.who === p.shot.who);
    const listener = cast.map(parseActor).find(a => a.who === d.ots);
    const side: 'l' | 'r' = listener && speaker && listener.x > speaker.x ? 'r' : 'l';
    foreNode = <OtsFore who={d.ots} cast={cast} side={side} />;
  }
  if (fx.includes('fif')) foreNode = <FifFore kind={d.fif === 'posts' ? 'posts' : 'door'} />;
  const ks = keystone(fx);
  const world = ks ? <div style={{position: 'absolute', inset: 0, ...ks}}>{children}</div> : children;
  const node = <KitStage p={p} bg={bg} cam={cam} presets={presets} fore={foreNode} foreBlur={fx.includes('ots') ? 9 : undefined} foreDark={fx.includes('ots') ? 0.55 : undefined} light={light} world={world} />;
  if (fx.includes('pov')) {
    const kind = (d.pov ?? 'crack') as 'crack' | 'phone' | 'peephole';
    return <Pov kind={kind} W={p.W} H={p.H} f={p.f} open={d.povOpen ?? 0.6} rec="00:00:21" sway={kind === 'phone' ? 5 : 2}>{node}</Pov>;
  }
  if (fx.includes('cctv')) return <Cctv W={p.W} H={p.H} f={p.f} cam={d.cctv ?? 'CAM 01'} time={d.cctvTime ?? '21:52:10'} tint="grey">{node}</Cctv>;
  return node;
};

// ---------------------------------------------------------------- the same room in three houses
// Everything matches except the wall paint and what lies under the bed (brief.md → clues).

export const HOUSE: Record<'rumpai' | 'mali' | 'stilt', Partial<ChildRoomProps>> = {
  rumpai: {wall: '#8fa6a0', under: 'empty', photo: 'boy', reflect: 'boy'},
  mali: {wall: '#cfa98a', under: 'shoe', photo: 'boy', reflect: 'girl'},
  stilt: {wall: '#a08a68', under: 'medal', photo: 'boy', reflect: 'boy'},
};

/** ChildRoom for a house, dressed from shot.data (blanket, height, under, erased, wet, door, dust, lamp…) */
export const HouseRoom: React.FC<{house: keyof typeof HOUSE; p: ShotProps; extra?: Partial<ChildRoomProps>}> = ({house, p, extra}) => {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const marks: ChildRoomProps['marks'] = [{name: d.height ?? 'ต้น', y: 340}];
  if (d.erased) marks.push({name: 'เอก', y: 352, erased: true});
  if (d.under === '8-rev') marks.push({name: '๘', y: 318, reversed: true});
  // the lowest mark, hidden by the bed until the last morning: Ton's own line
  if (d.note || d.mark === 'lowest') marks.push({name: d.note ?? 'ปีหน้าผมจะสูงกว่าแม่', y: 96});
  const night = ['night', 'lamp', 'dark'].includes(d.light);
  return (
    <ChildRoom f={p.f} {...HOUSE[house]} blanket={d.blanket ?? 'rocket'} marks={marks}
      under={d.dust === 'book' ? 'dust' : HOUSE[house].under} wet={Number(d.wet ?? 0)}
      door={d.passage || p.shot.view?.startsWith('threshold') ? 'dark' : d.door === 'open' ? 'ajar' : 'closed'} wedge={!!d.wedge}
      dent={d.pillow === 'fade' ? 0.1 : 0.5} lamp={night || d.lamp ? 1 : 0} reflectO={0.3} {...extra} />
  );
};

// ---------------------------------------------------------------- stilt house (Pho / Ek)

/** the hung casting net on a bamboo pole, with six nails for the mended lines */
export const NetRack: React.FC<{x: number; y?: number}> = ({x, y = 260}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 420, height: 560}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 420, height: 14, background: '#b8a06a', borderRadius: 7}} />
    <svg width={420} height={540} style={{position: 'absolute', left: 0, top: 10}}>
      <path d="M60 4 Q40 300 10 520 L410 520 Q380 300 360 4Z" fill="rgba(220,215,190,.18)" stroke="#d8d0b0" strokeWidth="2" />
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${60 + i * 22} 4 Q${40 + i * 28} 300 ${10 + i * 30} 520`} stroke="rgba(216,208,176,.6)" strokeWidth="1.5" fill="none" />)}
      {Array.from({length: 12}, (_, i) => <path key={'h' + i} d={`M${50 - i * 3} ${30 + i * 42} H${370 + i * 3}`} stroke="rgba(216,208,176,.5)" strokeWidth="1.5" />)}
      {Array.from({length: 18}, (_, i) => <circle key={'s' + i} cx={14 + i * 22} cy={520} r={5} fill="#7d8590" />)}
    </svg>
  </div>
);

/** under the stilt house: posts, the slatted floor overhead with light between the boards, dust floor where Ton draws */
export const StiltUnder: React.FC<{f: number; dust?: 'houses' | 'wiped'; slit?: boolean}> = ({f, dust = 'houses', slit}) => (
  <>
    <div style={full('linear-gradient(180deg, #3a2e22 0%, #6a5a44 40%, #b89f7d 100%)')} />
    {/* slatted floor overhead */}
    <div style={{position: 'absolute', left: -700, top: -500, width: W + 1400, height: 680, background: '#3a2a1c'}} />
    {Array.from({length: 40}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: -700 + i * 90, top: 150, width: 6, height: 30, background: `rgba(255,230,170,${slit && Math.abs(-700 + i * 90 - 1180) < 140 ? 0.9 : 0.45})`}} />
    ))}
    <div style={{position: 'absolute', left: -700, top: 170, width: W + 1400, height: 30, background: '#2a1e14'}} />
    {/* posts */}
    {[120, 620, 1420, 1840].map(x => <div key={x} style={{position: 'absolute', left: x, top: 190, width: 54, height: FLOOR - 160, background: 'linear-gradient(90deg, #5a4630, #3a2e20)'}} />)}
    {/* far canal glimpse */}
    <div style={{position: 'absolute', left: -700, top: 380, width: W + 1400, height: 440, background: 'linear-gradient(rgba(122,138,122,0), rgba(154,168,154,.35) 60%, rgba(154,168,154,0))'}} />
    {/* ground */}
    <div style={{position: 'absolute', left: -700, top: FLOOR - 120, width: W + 1400, height: 900, background: 'linear-gradient(#b89f7d, #9a8160)'}} />
    {/* drawings in the dust: several small houses in a row (wiped = smeared) */}
    <svg width={760} height={120} style={{position: 'absolute', left: 820, top: FLOOR - 40, opacity: dust === 'wiped' ? 0.25 : 0.85, filter: dust === 'wiped' ? 'blur(3px)' : undefined}}>
      {Array.from({length: 7}, (_, i) => (
        <path key={i} d={`M${20 + i * 100} 90 v-40 l40 -30 l40 30 v40 Z`} fill="none" stroke="#6a5438" strokeWidth="4" />
      ))}
    </svg>
    {[[300, 980], [1500, 990], [900, 1010]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 60 + rnd(9, i) * 60, height: 10, borderRadius: 5, background: 'rgba(80,60,40,.25)'}} />)}
    <Glow x={1180} y={150} r={300} color="255,230,170" a={0.18 + 0.04 * Math.sin(f / 9)} />
  </>
);

// ---------------------------------------------------------------- flashback: the siblings' rooms (past)

/** two bedrooms either side of one thin plank wall: Prae's (left, lamp) and Phak's (right). knock 2/1 rings on the wall */
export const SiblingRoom: React.FC<{f: number; knock?: number; lampOff?: boolean}> = ({f, knock = 0, lampOff}) => (
  <>
    <div style={full('linear-gradient(#5a6a7a, #3a4654)')} />
    <div style={{position: 'absolute', left: -700, top: FLOOR, width: W + 1400, height: 700, background: 'linear-gradient(#5a4632, #3a2e20)'}} />
    {/* the shared wall */}
    <div style={{position: 'absolute', left: 930, top: 60, width: 60, height: FLOOR - 60, background: 'repeating-linear-gradient(0deg, #7a5a3e 0 40px, #6a4a30 40px 44px)'}} />
    {[
      {x: 220, lamp: !lampOff, kid: 'girl'},
      {x: 1150, lamp: true, kid: 'boy'},
    ].map(({x, lamp, kid}) => (
      <div key={x}>
        <div style={{position: 'absolute', left: x, top: FLOOR - 170, width: 540, height: 120, background: '#5a3f2a', borderRadius: 8}} />
        <div style={{position: 'absolute', left: x + 10, top: FLOOR - 210, width: 520, height: 50, background: kid === 'girl' ? '#e8a6b6' : '#6f9ccf', borderRadius: 16}} />
        <div style={{position: 'absolute', left: x + (kid === 'girl' ? 380 : 20), top: FLOOR - 240, width: 140, height: 50, background: '#f6f1e6', borderRadius: 24}} />
        {/* the child's head on the pillow */}
        <div style={{position: 'absolute', left: x + (kid === 'girl' ? 420 : 60), top: FLOOR - 282, width: 64, height: 64, borderRadius: '50%', background: '#e0ac86'}}>
          <div style={{position: 'absolute', left: -2, top: -4, width: 68, height: 34, borderRadius: '34px 34px 6px 6px', background: '#1b1a20'}} />
          {kid === 'girl' && <><div style={{position: 'absolute', left: -14, top: 10, width: 20, height: 20, borderRadius: '50%', background: '#1b1a20'}} /><div style={{position: 'absolute', left: 58, top: 10, width: 20, height: 20, borderRadius: '50%', background: '#1b1a20'}} /></>}
        </div>
        <div style={{position: 'absolute', left: x + (kid === 'girl' ? 560 : -120), top: FLOOR - 230, width: 70, height: 100}}>
          <div style={{position: 'absolute', left: 30, top: 40, width: 8, height: 60, background: '#3a3a3a'}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: 70, height: 46, background: lamp ? '#ffe2a6' : '#7a7466', clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)'}} />
        </div>
        {lamp && <Glow x={x + (kid === 'girl' ? 595 : -85)} y={FLOOR - 210} r={360} a={0.45} />}
      </div>
    ))}
    {/* knock rings on the wall */}
    {Array.from({length: knock}, (_, i) => {
      const t = ((f - i * 12) % 40) / 40;
      return t > 0 ? <div key={i} style={{position: 'absolute', left: 960 - 40 - t * 80, top: 600 - 40 - t * 80 + i * 60, width: 80 + t * 160, height: 80 + t * 160, borderRadius: '50%',
        border: `4px solid rgba(255,230,170,${0.8 * (1 - t)})`}} /> : null;
    })}
  </>
);

// ---------------------------------------------------------------- flashback: the school bus in the canal (past)

/** the school van slid off the bank after heavy rain: front lifted clear, rear door jammed against the bank, under water */
export const BusInCanal: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={full('linear-gradient(#3a4654, #5a6470)')} />
    <div style={{...full('repeating-linear-gradient(100deg, rgba(220,230,240,0) 0 46px, rgba(220,230,240,.25) 46px 49px, rgba(220,230,240,0) 49px 130px)'), backgroundPosition: `${-f * 5}px ${f * 38}px`}} />
    <svg width={1100} height={900} style={{position: 'absolute', left: -300, top: 360}}>
      <path d="M0 0 L760 40 Q900 200 1000 600 L0 600Z" fill="#5a4632" />
      <path d="M0 0 L760 40" stroke="#7a6a44" strokeWidth="14" />
    </svg>
    <div style={{position: 'absolute', left: 520, top: 380, width: 900, height: 300, transform: 'rotate(-12deg)', transformOrigin: '0 100%'}}>
      <div style={{position: 'absolute', inset: 0, background: '#e0b830', borderRadius: '30px 60px 20px 20px', boxShadow: 'inset 0 -40px 0 #b8922a'}} />
      {Array.from({length: 5}, (_, i) => <div key={i} style={{position: 'absolute', left: 120 + i * 140, top: 40, width: 110, height: 90, background: '#3a4654', borderRadius: 8}} />)}
      <div style={{position: 'absolute', left: 20, top: 40, width: 80, height: 200, background: '#2a2a30', boxShadow: 'inset 0 0 0 6px #8a6a1a'}} />
      <div style={{position: 'absolute', left: 300, top: 150, width: 400, height: 40, color: '#2a2a2a', fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 32}}>รถรับส่งนักเรียน</div>
    </div>
    <div style={{position: 'absolute', left: -700, top: 660 + Math.sin(f / 8) * 4, width: 3320, height: 800, background: 'linear-gradient(rgba(70,90,90,.92), rgba(30,40,44,.98))'}} />
    {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: 300 + i * 240 + Math.sin(f / 9 + i) * 20, top: 680 + (i % 2) * 30, width: 120, height: 6, borderRadius: 3, background: 'rgba(200,220,220,.35)'}} />)}
  </>
);

// ---------------------------------------------------------------- the old pier at night (chapter 6)

/** a sala roof over the end of the pier (posts at 480 and 1440), with a hanging bulb */
export const SalaRoof: React.FC<{f: number}> = ({f}) => (
  <>
    <div style={{position: 'absolute', left: 380, top: 120, width: 1160, height: 70, background: '#5e3424', clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0 100%)'}} />
    {[480, 1420].map(x => <div key={x} style={{position: 'absolute', left: x, top: 190, width: 30, height: FLOOR - 190, background: '#e8dcc4', boxShadow: 'inset -8px 0 0 #c9bca2'}} />)}
    <div style={{position: 'absolute', left: 520, top: FLOOR - 120, width: 880, height: 22, background: '#6a4a30'}} />
    <div style={{position: 'absolute', left: 958, top: 190, width: 4, height: 90, background: '#2a2a2e'}} />
    <div style={{position: 'absolute', left: 945, top: 278, width: 30, height: 36, borderRadius: '50%', background: '#ffe2a6'}} />
    <Glow x={960} y={300} r={520} a={0.32 + 0.03 * Math.sin(f / 7)} />
  </>
);

/** under the pier deck: pilings in black water, faded blue numbers 1–6 painted by the searchers; mark rings them */
export const PierPosts: React.FC<{f: number; mark?: boolean}> = ({f, mark}) => (
  <>
    <div style={full('linear-gradient(#0a0e14, #141c24)')} />
    <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 720, background: 'repeating-linear-gradient(90deg, #1e1610 0 8px, #2a1e14 8px 140px)'}} />
    {Array.from({length: 6}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: 240 + i * 260, top: 200, width: 90, height: 760, background: 'linear-gradient(90deg, #2a2018, #4a3828 50%, #2a2018)'}}>
        <div style={{position: 'absolute', left: 8, top: 160, width: 74, height: 90, textAlign: 'center', fontFamily: T_FONT, fontWeight: 700, fontSize: 72, color: 'rgba(120,175,240,.95)', textShadow: '0 0 12px rgba(120,175,240,.45)'}}>{i + 1}</div>
        {mark && <div style={{position: 'absolute', left: -10, top: 150, width: 110, height: 110, borderRadius: '50%', border: '6px solid #e5383b', opacity: Math.min(1, Math.max(0, (f - 6 - i * 4) / 8))}} />}
      </div>
    ))}
    <div style={{position: 'absolute', left: -700, top: 620 + Math.sin(f / 9) * 4, width: 3320, height: 900, background: 'linear-gradient(rgba(16,24,30,.9), rgba(6,10,14,.98))'}} />
    {Array.from({length: 5}, (_, i) => <div key={i} style={{position: 'absolute', left: 200 + i * 360 + Math.sin(f / 10 + i) * 20, top: 640, width: 140, height: 5, borderRadius: 3, background: 'rgba(120,160,190,.3)'}} />)}
    <Glow x={960} y={360} r={700} color="255,220,160" a={0.22} />
  </>
);

/** a hinged plank in the pier floor lifted open: the boatmen's locker with a plastic-wrapped envelope inside */
export const PierHatch: React.FC<{f: number}> = ({f}) => {
  const open = Math.min(1, f / 30);
  return (
    <>
      <div style={full('repeating-linear-gradient(0deg, #2a1e14 0 8px, #4a3828 8px 150px)')} />
      <div style={{position: 'absolute', left: 560, top: 360, width: 800, height: 360, background: '#0a0706'}}>
        <div style={{position: 'absolute', left: 260, top: 120, width: 300, height: 180, background: 'rgba(210,225,235,.35)', border: '4px solid rgba(230,240,245,.5)', borderRadius: 16}}>
          <div style={{position: 'absolute', left: 30, top: 30, width: 240, height: 120, background: '#d9c9a0'}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 560, top: 220, width: 800, height: 140, background: 'repeating-linear-gradient(0deg, #2a1e14 0 8px, #5a4430 8px 70px)',
        transformOrigin: '50% 100%', transform: `perspective(900px) rotateX(${-open * 70}deg) translateY(${-open * 0}px)`}} />
      {[640, 1240].map(x => <div key={x} style={{position: 'absolute', left: x, top: 350, width: 50, height: 22, background: '#7d8590', borderRadius: 4}} />)}
      <Glow x={960} y={520} r={420} color="255,230,170" a={0.28} />
    </>
  );
};
