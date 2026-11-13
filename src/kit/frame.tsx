import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../engine/episode';
import {kf, rnd} from '../engine/anim';
import {T} from '../engine/theme';
import {Grain} from './horror';
import {ClockChip, PAST_FILTER, Stage, parseActor} from './stage';
import {Tag} from './ui';

// Pieces of a directed frame, shared by episodes (moved here from father-ledger when fifth-room needed them, CLAUDE.md rule 6):
// the macro plate, soft close-up backgrounds, pools of light, paper and handwriting, faces drawn big, hanging bulbs.
// Everything is drawn at full frame size, never a zoomed sprite.

export const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
export const K = (p: ShotProps) => kf(p.f, [[0, 0], [p.len, 1]]);
export const zOf = (p: ShotProps) => (D(p).cam as number[] | undefined)?.[0] ?? 1;

export const FONT = {hand: T.accent, type: '"Courier New", monospace', ui: T.ui, title: T.title, display: T.display};

/** A frame drawn for itself: slow push about (ox, oy), a vignette that keeps `at` lit, the past grade and the clock. */
export const Macro: React.FC<{p: ShotProps; bg?: string; z?: number; ox?: number; oy?: number; at?: [number, number]; vig?: number; inner?: number; past?: boolean; children: React.ReactNode; grain?: number; tilt?: number}> = ({
  p, bg = '#07070a', z = 1.05, ox = 960, oy = 480, at = [50, 45], vig = 0.7, inner = 42, past, children, grain = 0.12, tilt = 0,
}) => {
  const d = D(p);
  const isPast = past ?? !!d.past;
  const s = 1 + (z - 1) * K(p);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, filter: isPast ? PAST_FILTER : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${tilt}deg) scale(${s})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</div>
        <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at ${at[0]}% ${at[1]}%, rgba(0,0,0,0) ${inner}%, rgba(0,0,0,${vig}) 100%)`}} />
        <CapShade />
      </div>
      <Grain f={p.f} opacity={isPast ? 0.22 : grain} />
      {d.hud && <ClockChip text={d.hud} f={p.f} />}
    </AbsoluteFill>
  );
};

/** A camera shot: Stage, plus the name tag in frame px and, on a close-up, the side of the face away from the light sunk
 *  (the sprites are flat, so the one-sided light is laid over them). `data.shade`: 'l' | 'r' dark side, false for none;
 *  default from data.lightAt. `data.key` = "r,g,b" tints the lit side. */
/** keeps the subtitle band readable over anything bright */
export const CapShade: React.FC = () => <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, pointerEvents: 'none', background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.5) 60%, rgba(0,0,0,.62))'}} />;

/** Blur and sink a set behind a close-up */
export const Soft: React.FC<{p: ShotProps; children: React.ReactNode; dim?: number}> = ({p, children, dim}) => {
  const z = zOf(p);
  const b = z >= 2.2 ? 2.8 : z >= 1.6 ? 1.1 : 0;
  const k = dim ?? (z >= 2.2 ? 0.78 : 1);
  if (!b && k === 1) return <>{children}</>;
  return <div style={{position: 'absolute', left: 0, top: 0, filter: `${b ? `blur(${b}px) ` : ''}${k !== 1 ? `brightness(${k})` : ''}`}}>{children}</div>;
};

/** absolute full-frame svg in 1920×1080 */
export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}>{children}</svg>
);

/** soft pool of light */
export const Pool: React.FC<{x: number; y: number; rx: number; ry?: number; color?: string; a?: number; blend?: boolean}> = ({x, y, rx, ry = rx, color = '255,235,200', a = 0.5, blend = true}) => (
  <div style={{position: 'absolute', left: x - rx, top: y - ry, width: rx * 2, height: ry * 2, borderRadius: '50%', pointerEvents: 'none', mixBlendMode: blend ? 'screen' : undefined,
    background: `radial-gradient(ellipse, rgba(${color},${a}) 0%, rgba(${color},${a * 0.45}) 40%, rgba(${color},0) 72%)`}} />
);

/** Haze low along the floor: cold breath of the ice room, or smoke */
export const FloorMist: React.FC<{y?: number; f: number; a?: number; color?: string; n?: number; h?: number; x0?: number; x1?: number; seed?: number}> = ({y = 880, f, a = 0.35, color = '205,220,235', n = 9, h = 170, x0 = -300, x1 = 2200, seed = 3}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const w = 520 + rnd(seed, i) * 620, xx = x0 + (x1 - x0) * (i / n) + Math.sin(f / 70 + i * 1.7) * 60 + f * (0.15 + rnd(seed, i + 9) * 0.2);
      const yy = y - h / 2 + rnd(seed, i + 20) * h * 0.6;
      return <div key={i} style={{position: 'absolute', left: xx - w / 2, top: yy, width: w, height: h, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(26px)',
        background: `radial-gradient(ellipse, rgba(${color},${a}) 0%, rgba(${color},0) 70%)`}} />;
    })}
  </>
);

/** A sheet of paper in frame px; children positioned inside. */
export const Sheet: React.FC<{x: number; y: number; w: number; h: number; rot?: number; color?: string; children?: React.ReactNode; shadow?: boolean; lines?: boolean; style?: React.CSSProperties}> = ({x, y, w, h, rot = 0, color = '#e9dfc4', children, shadow = true, lines, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: color, transform: `rotate(${rot}deg)`, boxShadow: shadow ? '0 22px 60px rgba(0,0,0,.6)' : undefined, overflow: 'hidden',
    backgroundImage: lines ? 'repeating-linear-gradient(180deg, transparent 0 69px, rgba(70,90,130,.28) 69px 71px)' : undefined, ...style}}>{children}</div>
);

/** Thai handwriting in ballpoint */
export const Pen: React.FC<{x: number; y: number; size?: number; color?: string; shake?: number; children: React.ReactNode; w?: number; style?: React.CSSProperties}> = ({x, y, size = 58, color = '#23305a', shake = 0, children, w, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, whiteSpace: 'nowrap', fontFamily: typeof children === 'string' && children.includes('A-') ? T.display : FONT.hand, fontWeight: 700, fontSize: size, color, lineHeight: 1.1, transform: `rotate(${shake * -1.6}deg) skewX(${-4 - shake * 6}deg)`, ...style}}>{children}</div>
);

export const Typed: React.FC<{x: number; y: number; size?: number; color?: string; children: React.ReactNode; weight?: number; style?: React.CSSProperties}> = ({x, y, size = 46, color = '#2c2820', children, weight = 500, style}) => (
  <div style={{position: 'absolute', left: x, top: y, whiteSpace: 'nowrap', fontFamily: FONT.ui, fontWeight: weight, fontSize: size, color, lineHeight: 1.2, ...style}}>{children}</div>
);

/** One eye as big as the frame. `look` −1…1 moves the iris, `lid` 0 wide … 1 shut. `glint` draws what the eye sees. */
export const BigEye: React.FC<{cx?: number; cy?: number; s?: number; skin: string; skinD: string; iris?: string; lid?: number; look?: number; brow?: string; browTilt?: number; glint?: React.ReactNode; tear?: number; wet?: boolean; age?: number}> = ({
  cx = 960, cy = 440, s = 1, skin, skinD, iris = '#2a1a12', lid = 0.25, look = 0, brow = '#17151a', browTilt = 0, glint, tear = 0, wet, age = 0,
}) => {
  const open = 170 * (1 - lid);
  const clip = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const ix = look * 110;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${cx} ${cy}) scale(${s})`}>
        <rect x={-1400} y={-1000} width={2800} height={2200} fill={skin} />
        <ellipse cx={0} cy={300} rx={720} ry={170} fill={skinD} opacity={0.14} />
        <path d={`M-430 ${-20} Q0 ${-open * 1.2 - 60} 430 ${-20} Q0 ${open * 0.9 + 40} -430 ${-20} Z`} fill={skinD} opacity={0.55} />
        <defs><clipPath id={clip}><path d={`M-360 0 Q0 ${-open * 1.25} 360 0 Q0 ${open * 0.9} -360 0 Z`} /></clipPath></defs>
        <path d={`M-360 0 Q0 ${-open * 1.25} 360 0 Q0 ${open * 0.9} -360 0 Z`} fill={age ? '#d8cfbd' : '#ece6dc'} />
        <g clipPath={`url(#${clip})`}>
          <circle cx={ix} cy={-6} r={155} fill={iris} />
          <circle cx={ix} cy={-6} r={155} fill="none" stroke="#0b0705" strokeWidth={14} />
          <circle cx={ix} cy={-6} r={72} fill="#050404" />
          <g transform={`translate(${ix} -6)`}>{glint}</g>
          <path d={`M-360 0 Q0 ${-open * 1.25} 360 0 L360 -400 L-360 -400 Z`} fill="rgba(0,0,0,.18)" transform="translate(0 46)" />
          {wet && <path d={`M-300 ${open * 0.42} Q0 ${open * 0.86} 300 ${open * 0.42}`} stroke="rgba(255,255,255,.65)" strokeWidth={14} fill="none" />}
        </g>
        <path d={`M-372 6 Q0 ${-open * 1.28} 372 6`} fill="none" stroke="#14100e" strokeWidth={26} strokeLinecap="round" />
        <path d={`M-340 8 Q0 ${open * 0.92} 340 8`} fill="none" stroke={skinD} strokeWidth={12} strokeLinecap="round" />
        {age > 0 && <path d="M390 -10 l140 -50 M400 30 l150 10 M380 66 l120 60 M-300 150 q300 90 600 0 M-260 200 q260 70 520 0" stroke={skinD} strokeWidth={9} fill="none" strokeLinecap="round" />}
        <path d={`M-470 ${-250 + browTilt} Q0 ${-340} 470 ${-250 - browTilt}`} stroke={brow} strokeWidth={62} fill="none" strokeLinecap="round" />
        {tear > 0 && <path d={`M240 ${open * 0.62} q24 ${160 * tear} 8 ${360 * tear}`} stroke="rgba(235,245,255,.85)" strokeWidth={22} fill="none" strokeLinecap="round" />}
      </g>
    </svg>
  );
};

/** Lower face, frame-size: the nose's underside at the top, shaped lips, the chin's shadow. `smile` lifts the corners
 *  (more on the right, a one-sided smile; negative pulls them down), `open` 0–1, `teeth` shows them; `lip` colour. */
export const BigMouth: React.FC<{skin: string; skinD: string; lip?: string; open?: number; smile?: number; teeth?: boolean; cy?: number; breath?: React.ReactNode}> = ({skin, skinD, lip = '#9a4a42', open = 0, smile = 0, teeth, cy = 490, breath}) => {
  const lx = 470, rx = 1450;
  const ly = cy - smile * 70, ry = cy - smile * 130;
  const gap = 8 + open * 190;
  const up = cy - 10, dn = up + gap;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
      <rect width={1920} height={1080} fill={skin} />
      {/* cheeks and jaw turn away from the light */}
      <rect width={1920} height={1080} fill={skinD} opacity={0.24} />
      <ellipse cx={960} cy={400} rx={760} ry={520} fill={skin} />
      <path d={`M720 -20 Q960 80 1200 -20 Q1180 120 960 140 Q740 120 720 -20 Z`} fill={skinD} opacity={0.55} />
      <ellipse cx={860} cy={70} rx={46} ry={26} fill={skinD} /><ellipse cx={1060} cy={70} rx={46} ry={26} fill={skinD} />
      <path d={`M930 170 Q960 230 990 170`} stroke={skinD} strokeWidth={12} fill="none" opacity={0.5} />
      {/* inside of the mouth */}
      <path d={`M${lx + 40} ${ly + 6} Q960 ${up - 8} ${rx - 40} ${ry + 6} Q960 ${dn + 40} ${lx + 40} ${ly + 6} Z`} fill="#1a0a0a" />
      {teeth && <>
        <path d={`M${lx + 80} ${ly + 8} Q960 ${up + 2} ${rx - 80} ${ry + 8} Q960 ${up + 60 + open * 60} ${lx + 80} ${ly + 8} Z`} fill="#f3efe4" />
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M${680 + i * 70} ${up + 6} v${44 + open * 40}`} stroke="#c9c3b3" strokeWidth={4} />)}
      </>}
      {/* upper lip with its bow, lower lip fuller and lit */}
      <path d={`M${lx} ${ly} Q700 ${up - 70} 880 ${up - 64} Q960 ${up - 36} 1040 ${up - 64} Q1220 ${up - 70} ${rx} ${ry} Q960 ${up + 14} ${lx} ${ly} Z`} fill={lip} />
      <path d={`M${lx} ${ly} Q960 ${dn + 26} ${rx} ${ry} Q1240 ${dn + 110} 960 ${dn + 118} Q680 ${dn + 110} ${lx} ${ly} Z`} fill={lip} />
      <ellipse cx={960} cy={dn + 66} rx={210} ry={20} fill="#fff" opacity={0.2} />
      <path d={`M780 ${dn + 170} Q960 ${dn + 214} 1140 ${dn + 170}`} stroke={skinD} strokeWidth={14} fill="none" opacity={0.55} />
      {breath}
    </svg>
  );
};

/** Hanging bulb on its flex: `color` r,g,b; the butcher's red, the market's yellow. (x, y) = the bulb. */
export const HangBulb: React.FC<{x: number; y: number; color?: string; top?: number; r?: number; a?: number}> = ({x, y, color = '255,60,44', top = -300, r = 26, a = 1}) => (
  <>
    <svg width={2} height={2} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <line x1={x} y1={top} x2={x} y2={y - r} stroke="#0d0b0a" strokeWidth={5} />
      <rect x={x - 9} y={y - r - 16} width={18} height={20} fill="#2a2522" />
      <circle cx={x} cy={y} r={r} fill={`rgb(${color})`} opacity={a} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#fff" opacity={0.75 * a} />
    </svg>
    <Pool x={x} y={y} rx={r * 8} color={color} a={0.6 * a} />
  </>
);

/** where an actor's head is in world px, for aiming a close-up */
export function headOf(raw: string, roster: Record<string, {cm: number}>, ppc = 3, floor = 930) {
  const a = parseActor(raw);
  const H = a.h ?? (roster[a.who]?.cm ?? 170) * ppc, s = H / 520;
  const drop = a.pose === 'sit' ? 110 : a.pose === 'crouch' ? 160 : 0;
  return {x: a.x, y: (a.y ?? floor) - H + (65 + drop) * s, r: 65 * s};
}

/** the name tag, in frame px so it keeps its size on a close-up */
export const NameTag: React.FC<{p: ShotProps}> = ({p}) => {
  const raw = ((p.shot.data ?? {}) as Record<string, any>).tag as {name: string; line?: string} | string | undefined;
  if (!raw) return null;
  const tag = typeof raw === 'string' ? {name: raw} : raw;
  return <div style={{position: 'absolute', left: 60, top: 130, transform: 'scale(.95)', transformOrigin: '0 0', whiteSpace: 'nowrap'}}><Tag text={tag.line ? `${tag.name} · ${tag.line}` : tag.name} /></div>;
};

/** Suspect dossier (channel-playbook.md → dossier callouts): `data.callouts` = 2–3 short labels, each on a thin line that
 *  points at the first actor of `data.cast` (head, chest, hip in turn). Give every suspect the same treatment. */
export const Dossier: React.FC<{p: ShotProps; roster: Record<string, {cm: number}>; ppc?: number}> = ({p, roster, ppc = 3}) => {
  const d = D(p);
  const labels = d.callouts as string[] | undefined, cast = (d.cast ?? []) as string[];
  if (!labels?.length || !cast.length) return null;
  const cam = (d.cam as number[] | undefined) ?? [1, 1, 960, 540];
  const t = Math.min(1, p.f / Math.max(1, p.len)), z = cam[0] + (cam[1] - cam[0]) * t;
  const a = parseActor(cast.find(c => !c.split(/[@ ]/)[0].endsWith('-sil')) ?? cast[0]);
  const h = headOf(cast[0], roster, ppc);
  const H = a.h ?? (roster[a.who]?.cm ?? 170) * ppc;
  const sx = 960 + (h.x - cam[2]) * z;
  const pts = [h.y, h.y + H * 0.3, h.y + H * 0.55].map(y => 540 + (y - cam[3]) * z);
  const right = sx < 960, x0 = right ? sx + 120 : sx - 120, lx = right ? Math.min(1500, sx + 330) : Math.max(420, sx - 330);
  return (
    <>
      {labels.slice(0, 3).map((l, i) => {
        const k = Math.max(0, Math.min(1, (p.f - 8 - i * 9) / 8)), y = Math.max(170, Math.min(760, pts[i] ?? pts[0]));
        return (
          <React.Fragment key={i}>
            <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: k}}>
              <circle cx={x0} cy={y} r={6} fill="#f6f2ea" />
              <line x1={x0} y1={y} x2={x0 + (lx - x0) * k} y2={y - 30} stroke="#f6f2ea" strokeWidth={3} />
            </svg>
            <div style={{position: 'absolute', top: y - 56, left: right ? lx + 10 : undefined, right: right ? undefined : 1920 - lx + 10, opacity: k,
              fontFamily: T.ui, fontWeight: 700, fontSize: 34, color: '#f6f2ea', whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(0,0,0,.9)'}}>{l}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Shot: React.FC<{p: ShotProps; world: React.ReactNode; roster: Record<string, {cm: number}>; ppc?: number; fore?: React.ReactNode; foreBlur?: number; foreDark?: number; foreK?: number; over?: React.ReactNode; bg?: string; grain?: number}> = ({p, world, roster, ppc = 3, fore, foreBlur, foreDark, foreK, over, bg, grain}) => {
  const d = D(p), z = zOf(p);
  const cast = (d.cast ?? []) as string[];
  let shade: React.ReactNode = null;
  if (z >= 2.3 && cast.length && d.shade !== false) {
    const cam = d.cam as number[], h = headOf(cast[0], roster, ppc);
    const sx = 960 + (h.x - cam[2]) * z;
    const lit = Array.isArray(d.lightAt) ? (d.lightAt[0] < h.x ? 'l' : 'r') : 'r';
    const dark = d.shade ?? (lit === 'l' ? 'r' : 'l');
    const amt = d.shadeA ?? 0.62;
    const key = d.key as string | undefined;
    shade = (
      <>
        <div style={{position: 'absolute', inset: 0, background: dark === 'l'
          ? `linear-gradient(90deg, rgba(4,3,6,${amt}) ${Math.max(0, sx - 330) / 19.2}%, rgba(4,3,6,${amt * 0.72}) ${(sx - 90) / 19.2}%, rgba(4,3,6,0) ${(sx + 110) / 19.2}%)`
          : `linear-gradient(270deg, rgba(4,3,6,${amt}) ${Math.max(0, 1920 - sx - 330) / 19.2}%, rgba(4,3,6,${amt * 0.72}) ${(1920 - sx - 90) / 19.2}%, rgba(4,3,6,0) ${(1920 - sx + 110) / 19.2}%)`}} />
        {key && <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `radial-gradient(ellipse 640px 620px at ${dark === 'l' ? sx + 170 : sx - 170}px 430px, rgba(${key},.34), rgba(${key},0) 100%)`}} />}
      </>
    );
  }
  return <Stage p={p} world={world} fore={fore} foreBlur={foreBlur} foreDark={foreDark} foreK={foreK} bg={bg} grain={grain} over={<>{shade}{over}<CapShade /><NameTag p={p} /><Dossier p={p} roster={roster} ppc={ppc} /></>} />;
};
