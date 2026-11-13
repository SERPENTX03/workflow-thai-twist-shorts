import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {rnd} from '../../engine/anim';
import {LightVeil, RBox, RFace, RoomShell, makeRoom} from '../../kit/room';
import {Actors, C} from './cast';
import {IvStand, OfficeChair} from '../../kit/props';
import {D, K, Macro, Pool, Shot, Svg} from './common';

// ห้องพักแพทย์เวรดึก: where the call reaches Thyme (shots 13–16). One room built once, camera fixed on its diagonal: blinds
// and the dawn city on the left wall, the desk running at us along it, bookcase, corkboard and clock on the back wall, a
// kitchenette behind the post, lockers down the right. tone: dawn (13, desk lamp + first light) · day (14, the sun is up
// but his night is not over) · cold (15, the phone is the light that matters). 14 and 15 keep this very framing and bring
// him close to the lens, so the room stays readable behind him.

const R = makeRoom({x: 1010, y: 370}, {x0: 600, x1: 1460, y0: 210, y1: 640}, 3.4);
type Tone = 'dawn' | 'day' | 'cold';

const SKY: Record<Tone, [string, string]> = {dawn: ['#27416a', '#f0a266'], day: ['#a9cfe0', '#f4e6c4'], cold: ['#3f71a8', '#9cc0d8']};
const Q = (pts: [number, number, number][]) => R.Q(pts);

const Window: React.FC<{tone: Tone}> = ({tone}) => {
  const [top, low] = SKY[tone];
  const city = tone === 'dawn' ? '#3f4f6e' : tone === 'day' ? '#a9b4bd' : '#46688c';
  const trees = tone === 'dawn' ? '#23402f' : tone === 'day' ? '#7da06f' : '#2f5a50';
  return (
    <Svg>
      <defs>
        <linearGradient id="duty-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={low} /></linearGradient>
        <clipPath id="duty-win"><polygon points={Q([[0, 0.08, 0.2], [0, 0.08, 0.86], [0, 0.66, 0.86], [0, 0.66, 0.2]])} /></clipPath>
      </defs>
      <polygon points={Q([[0, 0.08, 0.2], [0, 0.08, 0.86], [0, 0.66, 0.86], [0, 0.66, 0.2]])} fill="url(#duty-sky)" />
      <g clipPath="url(#duty-win)">
        {Array.from({length: 9}, (_, i) => {
          const w0 = 0.22 + i * 0.07, hh = 0.3 + rnd(351, i) * 0.2;
          return <polygon key={i} points={Q([[0, hh, w0], [0, hh, w0 + 0.055], [0, 0.66, w0 + 0.055], [0, 0.66, w0]])} fill={city} />;
        })}
        {Array.from({length: 26}, (_, i) => { const w = 0.2 + i * 0.026, q = R.P(0, 0.6 + rnd(352, i) * 0.04, w); return <circle key={i} cx={q.x} cy={q.y} r={(16 + rnd(353, i) * 10) * R.s(w) * 0.55} fill={trees} />; })}
      </g>
      {/* frame, one mullion, then the blinds half down: slats run with the wall */}
      <polygon points={Q([[0, 0.08, 0.2], [0, 0.08, 0.86], [0, 0.66, 0.86], [0, 0.66, 0.2]])} fill="none" stroke="#2c3338" strokeWidth={9} />
      {(() => { const a = R.P(0, 0.08, 0.52), b = R.P(0, 0.66, 0.52); return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2c3338" strokeWidth={10} />; })()}
      {Array.from({length: 13}, (_, i) => {
        const v = 0.09 + i * 0.024;
        const a = R.P(0, v, 0.2), b = R.P(0, v, 0.86);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={tone === 'day' ? '#c4c9c6' : '#6c7780'} strokeWidth={9} />;
      })}
    </Svg>
  );
};

const Shelf: React.FC = () => (
  <>
    <RBox r={R} u={[0.02, 0.28]} v={[0.1, 0.78]} w={[0, 0.05]} front="#4e3a28" top="#5f4834" side="#3b2b1d" />
    <Svg>
      {[0.26, 0.46, 0.64].map((v, k) => (
        <g key={v}>
          {(() => { const a = R.P(0.03, v, 0.05), b = R.P(0.27, v, 0.05); return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#20150c" strokeWidth={7} />; })()}
          {Array.from({length: 13}, (_, i) => {
            const q = R.P(0.04 + i * 0.018, v, 0.05);
            const h = 52 + rnd(361 + k, i) * 16;
            return <rect key={i} x={q.x} y={q.y - h} width={13} height={h} fill={['#2f5a66', '#6d7d5b', '#8b6a44', '#3f4c6e', '#a55d45', '#d2c6a8'][(i + k) % 6]} />;
          })}
        </g>
      ))}
      {(() => { const q = R.P(0.05, 0.1, 0.05); return <><rect x={q.x} y={q.y - 44} width={70} height={44} fill="#8c7350" /><rect x={q.x + 90} y={q.y - 44} width={70} height={44} fill="#5e7a85" /></>; })()}
    </Svg>
  </>
);

const BackWall: React.FC = () => {
  const c = R.P(0.5, 0.13, 0), sign = R.P(0.36, 0.05, 0), b = R.P(0.34, 0.24, 0);
  return (
    <>
      <RFace r={R} pts={[[0.34, 0.2, 0], [0.62, 0.2, 0], [0.62, 0.58, 0], [0.34, 0.58, 0]]} fill="#8d6f4b" stroke="#3c2b1a" sw={5} />
      <Svg>
        {[[0, 0, 56, 68, '#efeadb'], [66, 8, 56, 72, '#e6e1cc'], [134, 4, 42, 34, '#e0d38e'], [186, 0, 42, 46, '#f1efe6'], [0, 86, 48, 46, '#e8dfa0'], [62, 94, 118, 58, '#f4f0e4'], [190, 62, 40, 30, '#c9483b']].map(([x, y, w, h, f], i) => (
          <rect key={i} x={b.x + (x as number)} y={b.y + (y as number)} width={w as number} height={h as number} fill={f as string} stroke="#6a5c40" strokeWidth={2} />
        ))}
      </Svg>
      <Svg>
        <circle cx={c.x} cy={c.y} r={36} fill="#f1efe7" stroke="#1b1c1f" strokeWidth={6} />
        <path d={`M${c.x} ${c.y} L${c.x + 15} ${c.y + 15} M${c.x} ${c.y} L${c.x - 7} ${c.y - 24}`} stroke="#1b1c1f" strokeWidth={5} strokeLinecap="round" />
      </Svg>
      <div style={{position: 'absolute', left: sign.x, top: sign.y - 18, width: 210, height: 36, background: '#e4dfcd', border: '3px solid #2c2720', textAlign: 'center', lineHeight: '32px', fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 19, color: '#2c2720', whiteSpace: 'nowrap'}}>ห้องพักแพทย์เวร</div>
      {/* the post, then a small kitchen behind it */}
      <RBox r={R} u={[0.66, 0.72]} v={[0, 1]} w={[0, 0.12]} front="#7a4f2d" side="#5b3a20" top="#8d6039" />
      <RFace r={R} pts={[[0.72, 0.42, 0], [1, 0.42, 0], [1, 0.6, 0], [0.72, 0.6, 0]]} fill="#c6c9bc" />
      <Svg>{Array.from({length: 12}, (_, i) => { const a = R.P(0.72 + i * 0.0233, 0.42, 0), d = R.P(0.72 + i * 0.0233, 0.6, 0); return <line key={i} x1={a.x} y1={a.y} x2={d.x} y2={d.y} stroke="#8e9186" strokeWidth={2} />; })}</Svg>
      <RBox r={R} u={[0.72, 1]} v={[0.14, 0.42]} w={[0, 0.06]} front="#8a7a5f" side="#6c5e47" />
      <RBox r={R} u={[0.72, 1]} v={[0.64, 1]} w={[0, 0.06]} front="#8a7a5f" top="#b5ab92" />
      {[0.86].map(u => { const a = R.P(u, 0.14, 0.06), d = R.P(u, 0.42, 0.06); return <Svg key={u}><line x1={a.x} y1={a.y} x2={d.x} y2={d.y} stroke="#4a3e2c" strokeWidth={4} /></Svg>; })}
    </>
  );
};

const Lockers: React.FC = () => (
  <>
    {Array.from({length: 3}, (_, i) => {
      const w0 = 0.34 + i * 0.22;
      const q = R.P(1, 0.5, w0 + 0.1), k = R.s(w0 + 0.1);
      return (
        <React.Fragment key={i}>
          <RFace r={R} pts={[[1, 0.08, w0], [1, 0.08, w0 + 0.21], [1, 1, w0 + 0.21], [1, 1, w0]]} fill="#7d8f96" stroke="#39454a" sw={5} />
          <Svg>
            <rect x={q.x - 12 * k} y={q.y - 20 * k} width={10 * k} height={44 * k} fill="#c7d0d3" />
            {[0, 1, 2].map(j => <line key={j} x1={q.x - 30 * k} y1={q.y - 150 * k + j * 13 * k} x2={q.x + 30 * k} y2={q.y - 156 * k + j * 13 * k} stroke="#39454a" strokeWidth={3} />)}
          </Svg>
        </React.Fragment>
      );
    })}
  </>
);

const Trolley: React.FC = () => {
  const a = R.P(0.84, 0.66, 0.42), b = R.P(0.97, 0.66, 0.42), c = R.P(0.84, 1, 0.42), d = R.P(0.97, 1, 0.42), m = R.P(0.84, 0.84, 0.42), n = R.P(0.97, 0.84, 0.42);
  return (
    <Svg>
      <path d={`M${a.x} ${a.y} V${c.y} M${b.x} ${b.y} V${d.y}`} stroke="#aeb7bb" strokeWidth={7} />
      <rect x={a.x - 8} y={a.y - 6} width={b.x - a.x + 16} height={14} fill="#cdd5d8" stroke="#555f63" strokeWidth={2} />
      <rect x={m.x - 8} y={m.y - 4} width={n.x - m.x + 16} height={12} fill="#cdd5d8" stroke="#555f63" strokeWidth={2} />
      {[c, d].map((q, i) => <circle key={i} cx={q.x} cy={q.y + 8} r={10} fill="#1b1c1f" />)}
      <rect x={a.x + 16} y={a.y - 40} width={30} height={34} rx={4} fill="#6d4f30" /><rect x={a.x + 54} y={a.y - 30} width={26} height={24} rx={3} fill="#dfe6e5" />
    </Svg>
  );
};

/** The desk along the left wall, seen from its near end, with one man's whole night on it */
const Desk: React.FC<{p: ShotProps; tone: Tone; mug?: boolean}> = ({p, tone, mug = true}) => {
  const top = (u: number, w: number) => R.P(u, 0.7, w);
  const screen = top(0.17, 0.62), lamp = top(0.2, 0.5);
  const paper = (u0: number, u1: number, w0: number, w1: number, fill: string, key: string) => <RFace key={key} r={R} pts={[[u0, 0.7, w0], [u1, 0.7, w0], [u1, 0.7, w1], [u0, 0.7, w1]]} fill={fill} stroke="#5b5442" sw={2} />;
  const steam = Math.sin(p.f / 9) * 5;
  return (
    <>
      <RBox r={R} u={[-0.02, 0.32]} v={[0.7, 1]} w={[0.22, 0.97]} front="#4e3620" top="#8a5f38" side="#3d2a18" />
      {/* drawers on the desk's room side */}
      <Svg>{[0.76, 0.84, 0.92].map(v => { const a = R.P(0.32, v, 0.3), b = R.P(0.32, v, 0.7); return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#20140a" strokeWidth={4} />; })}</Svg>
      {paper(0.08, 0.26, 0.74, 0.88, '#dbd6c4', 'a')}
      {paper(0.1, 0.27, 0.7, 0.82, '#ece6d4', 'b')}
      {paper(0.13, 0.29, 0.6, 0.7, '#e8e3cf', 'c')}
      {/* box files stacked against the sill */}
      <RBox r={R} u={[0, 0.05]} v={[0.46, 0.7]} w={[0.26, 0.52]} front="#6a5a4c" top="#7d6d5c" side="#57493d" />
      <RBox r={R} u={[0, 0.06]} v={[0.5, 0.7]} w={[0.54, 0.7]} front="#54607a" top="#667290" side="#46506a" />
      {/* the laptop, lit */}
      <Svg>
        <polygon points={`${screen.x - 150},${screen.y + 40} ${screen.x + 96},${screen.y + 74} ${screen.x + 130},${screen.y + 8} ${screen.x - 96},${screen.y - 18}`} fill="#b7bcbf" stroke="#34383b" strokeWidth={4} />
        <polygon points={`${screen.x - 150},${screen.y + 40} ${screen.x - 96},${screen.y - 18} ${screen.x - 118},${screen.y - 170} ${screen.x - 172},${screen.y - 106}`} fill="#26282c" />
        <polygon points={`${screen.x - 142},${screen.y + 10} ${screen.x - 102},${screen.y - 32} ${screen.x - 120},${screen.y - 150} ${screen.x - 160},${screen.y - 100}`} fill="#d8ecfa" />
        {[0, 1, 2, 3, 4].map(i => <line key={i} x1={screen.x - 152} y1={screen.y - 92 + i * 20} x2={screen.x - 122} y2={screen.y - 126 + i * 20} stroke="#6b8aa0" strokeWidth={4} />)}
      </Svg>
      {/* the banker's lamp */}
      <Svg>
        <ellipse cx={lamp.x} cy={lamp.y} rx={44} ry={15} fill="#8a6a26" stroke="#3c2c0c" strokeWidth={3} />
        <path d={`M${lamp.x} ${lamp.y} V${lamp.y - 94} L${lamp.x + 24} ${lamp.y - 120}`} stroke="#b28a3a" strokeWidth={9} fill="none" />
        <path d={`M${lamp.x - 38} ${lamp.y - 104} Q${lamp.x + 18} ${lamp.y - 164} ${lamp.x + 90} ${lamp.y - 122} L${lamp.x + 74} ${lamp.y - 92} L${lamp.x - 22} ${lamp.y - 84} Z`} fill={tone === 'day' ? '#b59a55' : '#e8a233'} stroke="#3c2c0c" strokeWidth={4} />
      </Svg>
      {/* green mug, steaming: the one that falls in the next shots */}
      {mug && (() => { const q = top(0.25, 0.46); return <Svg>
        <path d={`M${q.x + 26} ${q.y - 46} q30 0 28 22 q-2 18 -28 16`} stroke="#3c6a43" strokeWidth={8} fill="none" />
        <path d={`M${q.x - 28} ${q.y - 56} H${q.x + 28} L${q.x + 24} ${q.y} H${q.x - 24} Z`} fill="#5f8f5e" stroke="#2b4d31" strokeWidth={3} />
        <ellipse cx={q.x} cy={q.y - 56} rx={28} ry={8} fill="#3e2413" stroke="#2b4d31" strokeWidth={3} />
        <path d={`M${q.x - 6} ${q.y - 66} q${-10 + steam} -24 0 -48 q${10 - steam} -24 0 -48`} stroke="rgba(255,255,255,.5)" strokeWidth={6} fill="none" />
      </Svg>; })()}
      {/* name block, at the near end */}
      {(() => { const q = top(0.2, 0.92); return <div style={{position: 'absolute', left: q.x - 110, top: q.y - 52, width: 220, height: 46, background: '#efe7cf', border: '3px solid #413421', borderRadius: 4, textAlign: 'center', lineHeight: '40px', fontFamily: '"Plex Thai", sans-serif', fontWeight: 700, fontSize: 28, color: '#2c2720', transform: 'skewY(-11deg)'}}>นพ. ธาม</div>; })()}
    </>
  );
};

/** the room with its light. `fgBlur`: he is near the lens, so the room falls a little soft behind him */
const Room: React.FC<{p: ShotProps; tone: Tone; blur?: number; mug?: boolean; iv?: boolean}> = ({p, tone, blur = 0, mug, iv}) => {
  const wall = tone === 'dawn' ? '#5b6670' : tone === 'day' ? '#a9b0ae' : '#55708a';
  const side = tone === 'dawn' ? '#4c5660' : tone === 'day' ? '#9aa2a1' : '#476079';
  const floor = tone === 'dawn' ? '#6b6e6b' : tone === 'day' ? '#b1b3ab' : '#607d94';
  const lamp = R.P(0.2, 0.62, 0.5);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, filter: blur ? `blur(${blur}px)` : undefined}}>
      <RoomShell r={R} id={`duty-${tone}`} wall={wall} side={side} sideFar={side} floorC={floor} ceiling={tone === 'dawn' ? '#30363b' : '#7e8789'} floor="tiles" walls="plain" boards={9} />
      {/* ceiling panels */}
      {[0.25, 0.62].map(w => <RFace key={w} r={R} pts={[[0.28, 0, w], [0.72, 0, w], [0.72, 0, w + 0.14], [0.28, 0, w + 0.14]]} fill={tone === 'dawn' ? '#4d565c' : '#d9e2e0'} stroke="#3b4347" />)}
      <Shelf />
      <BackWall />
      <RBox r={R} u={[0.34, 0.62]} v={[0.76, 1]} w={[0.04, 0.2]} front="#8a7757" top="#a08c69" side="#6d5d43" />
      <RFace r={R} pts={[[0.42, 0.72, 0.1], [0.58, 0.72, 0.1], [0.56, 0.78, 0.2], [0.44, 0.78, 0.2]]} fill="#bfc2bb" />
      <Window tone={tone} />
      <Lockers />
      <Trolley />
      <Desk p={p} tone={tone} mug={mug} />
      {iv && <IvStand x={1640} y={720} s={0.9} />}
      <LightVeil id={`duty-${tone}`} lights={[[lamp.x + 40, lamp.y, tone === 'dawn' ? 520 : 400], [240, 330, 640]]} o={tone === 'dawn' ? 0.5 : tone === 'day' ? 0.1 : 0.36} color={tone === 'cold' ? '#06101c' : '#070a10'} />
      {tone !== 'day' && <Pool x={lamp.x + 30} y={lamp.y + 20} rx={460} ry={300} color="255,186,96" a={tone === 'dawn' ? 0.6 : 0.34} />}
      <Pool x={240} y={330} rx={560} ry={480} color={tone === 'dawn' ? '255,170,110' : '220,236,250'} a={tone === 'day' ? 0.32 : 0.2} />
    </div>
  );
};

/** dark half-moons under his eyes (a night of it): over the sprite's own face, following its yaw */
const Bags: React.FC<{x: number; top: number; s: number; yaw?: number}> = ({x, top, s, yaw = 0}) => (
  <svg width={2} height={2} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', mixBlendMode: 'multiply'}}>
    {[77, 123].map(ex => <ellipse key={ex} cx={x + (ex - 100 + yaw * 26) * s} cy={top + 93 * s} rx={13 * s} ry={4.5 * s} fill="#7d5a68" opacity={0.6} />)}
  </svg>
);

/** the floor by the desk from a few centimetres up: tiles to the window's light, chair's feet, the mug going over */
const Coffee: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  const tile = makeRoom({x: 1240, y: 150}, {x0: 300, x1: 2200, y0: -600, y1: 240}, 6);
  return (
    <Macro p={p} bg="#2a3238" at={[46, 46]} vig={0.66} inner={40} z={1.03}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={320} fill="#46525c" />
        {/* under the desk's far edge, and a slice of the lockers beyond */}
        <rect x={1320} y={-10} width={620} height={290} fill="#7d8f96" />
        {[1460, 1620, 1780].map(x => <line key={x} x1={x} y1={-10} x2={x} y2={280} stroke="#39454a" strokeWidth={6} />)}
        <rect x={-10} y={-10} width={620} height={270} fill="#3d2a18" />
        <rect x={80} y={-10} width={70} height={320} fill="#2a1c0f" />
      </Svg>
      <Svg>
        <polygon points="-600,1200 660,240 2200,240 2800,1200" fill="#94a3a8" />
        {Array.from({length: 13}, (_, i) => { const x = -500 + i * 240; return <line key={i} x1={1240 + (x - 1240) * 0.16} y1={240} x2={x} y2={1200} stroke="#6f8085" strokeWidth={4} />; })}
        {[290, 370, 490, 680, 980].map(y => <line key={y} x1={-200} y1={y} x2={2200} y2={y} stroke="#6f8085" strokeWidth={4} />)}
      </Svg>
      <div style={{position: 'absolute', left: -40, top: 240, width: 1300, height: 860, background: 'linear-gradient(115deg, rgba(255,214,160,.42), rgba(255,214,160,0) 66%)', mixBlendMode: 'screen'}} />
      <Svg>
        {/* the office chair's five-star foot */}
        {[[-300, 26], [-110, 62], [120, 66], [320, 30]].map(([dx, dy], i) => <g key={i}><path d={`M1440 170 L${1440 + dx} ${220 + dy}`} stroke="#17181b" strokeWidth={24} /><circle cx={1440 + dx} cy={234 + dy} r={26} fill="#0d0e10" /></g>)}
        <rect x={1422} y={-10} width={36} height={190} fill="#54585c" />
        {/* his white sneakers: not moving */}
        {[0, 1].map(i => <g key={i}>
          <rect x={250 + i * 300} y={-20} width={190} height={330} fill="#22344f" />
          <path d={`M${232 + i * 300} 300 Q${450 + i * 300} 280 ${530 + i * 300} 390 Q${540 + i * 300} 430 ${480 + i * 300} 430 L${232 + i * 300} 430 Q${190 + i * 300} 360 ${232 + i * 300} 300 Z`} fill="#f4f3ec" stroke="#a8a79b" strokeWidth={5} />
          <rect x={228 + i * 300} y={428} width={304} height={14} fill="#d7d5c7" />
          {[0, 1, 2].map(j => <path key={j} d={`M${330 + i * 300 + j * 36} ${332 + j * 14} l34 22`} stroke="#bdbcae" strokeWidth={7} strokeLinecap="round" />)}
        </g>)}
        {/* coffee thrown across the tiles, the green mug on its way over */}
        <path d={`M980 690 Q1240 ${610 + (1 - k) * 60} ${1500 + 170 * k} 720 Q1650 800 1340 830 Q1050 860 980 690 Z`} fill="#3e2413" />
        <path d="M1060 720 Q1240 660 1460 730" stroke="#7a5230" strokeWidth={7} fill="none" />
        <g transform={`translate(${950 - k * 34} ${650 - k * 16}) rotate(${78 + k * 24})`}>
          <path d="M-96 -130 H96 L80 118 H-80 Z" fill="#5f8f5e" stroke="#2b4d31" strokeWidth={6} />
          <path d="M92 -70 q72 0 68 58 q-4 48 -74 40" stroke="#3c6a43" strokeWidth={22} fill="none" />
          <ellipse cx={0} cy={-130} rx={96} ry={22} fill="#3e2413" stroke="#2b4d31" strokeWidth={6} />
        </g>
        {Array.from({length: 12}, (_, i) => <circle key={i} cx={1120 + rnd(371, i) * 560} cy={520 + rnd(372, i) * 150 - k * 30} r={6 + rnd(373, i) * 13} fill="#3e2413" />)}
      </Svg>
    </Macro>
  );
};

const DutyScene: ShotComponent = p => {
  const d = D(p), v = p.shot.view ?? '';
  if (v === 'coffee-ins') return <Coffee p={p} />;
  const tone: Tone = d.tone ?? 'dawn';
  const near = v !== 'duty-ew';
  const cast = (d.cast ?? []) as string[];
  const m = /@(\d+),(\d+)/.exec(cast[0] ?? '');
  const h = Number(/ h=(\d+)/.exec(cast[0] ?? '')?.[1] ?? 516), s = h / 520;
  const x = m ? +m[1] : 1050, y = m ? +m[2] : 930;
  const yaw = Number(/yaw=(-?[\d.]+)/.exec(cast[0] ?? '')?.[1] ?? 0);
  return <Shot p={p} world={<>
    <Room p={p} tone={tone} blur={near ? 2.4 : 0} mug={v === 'duty-ew'} iv={near} />
    {!near && <OfficeChair x={x} y={y + 12} s={s * 1.02} coat />}
    {near && v !== 'phone-close' && <OfficeChair x={x} y={y + 90} s={s * 1.02} />}
    <Actors p={p} />
    <Bags x={x} top={y - h + (d.sitDrop ?? 0) * s} s={s} yaw={yaw} />
    {d.steam && <Svg>{[0, 1].map(i => <path key={i} d={`M${d.steam[0] + i * 34} ${d.steam[1]} q${-18 + Math.sin(p.f / 8 + i) * 10} -40 0 -80`} stroke="rgba(255,255,255,.55)" strokeWidth={12} fill="none" />)}</Svg>}
    {d.glow && <><Pool x={d.glow[0]} y={d.glow[1]} rx={430} ry={520} color="150,205,255" a={0.72} /></>}
  </>} over={d.side ? <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${d.side === 'l' ? 90 : 270}deg, rgba(4,6,14,.5), rgba(4,6,14,0) 62%)`}} /> : undefined} />;
};

export const DUTY: Record<string, ShotComponent> = {ward: DutyScene};
