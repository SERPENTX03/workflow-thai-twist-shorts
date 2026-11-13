import React from 'react';
import {rnd, shake} from '../engine/anim';
import {T} from '../engine/theme';
import {Grain} from './horror';

// Camera devices for thriller shots (cinematography.md S12–S16): looking *through* something (peephole, keyhole,
// door crack, binoculars, blinds, a phone camera), split screen, CCTV / recorded footage and a mirror frame.
// Every piece wraps a full-frame `children` (a Stage, a set, an insert) and works in 9:16 and 16:9: pass W, H.

export type PovKind = 'peephole' | 'keyhole' | 'crack' | 'binoculars' | 'blinds' | 'phone';

/** Look through something. `children` is what the character sees; the mask is drawn over it. `sway` (px) makes the
 *  view drift like a held eye or hand (0 = locked off, e.g. a hidden camera). `open` 0–1 widens the door crack. */
export const Pov: React.FC<{
  kind: PovKind; W: number; H: number; f: number; children: React.ReactNode;
  sway?: number; open?: number; rec?: string; id?: string;
}> = ({kind, W, H, f, children, sway = kind === 'phone' ? 4 : 3, open = 0.5, rec = '00:00:12', id = 'pov'}) => {
  const s = shake(Math.floor(f / 3), sway, 11);
  const cx = W / 2, cy = H * 0.45, m = Math.min(W, H);
  const mid = `${id}-${kind}`;
  // holes (black in the mask = see-through)
  let holes: React.ReactNode = null;
  if (kind === 'peephole') holes = <circle cx={cx} cy={cy} r={m * 0.36} fill="black" />;
  if (kind === 'binoculars') holes = <><circle cx={cx - m * 0.22} cy={cy} r={m * 0.27} fill="black" /><circle cx={cx + m * 0.22} cy={cy} r={m * 0.27} fill="black" /></>;
  if (kind === 'keyhole') holes = <><circle cx={cx} cy={cy - m * 0.12} r={m * 0.2} fill="black" /><path d={`M${cx - m * 0.1} ${cy - m * 0.04} L${cx - m * 0.18} ${cy + m * 0.42} L${cx + m * 0.18} ${cy + m * 0.42} L${cx + m * 0.1} ${cy - m * 0.04} Z`} fill="black" /></>;
  if (kind === 'crack') {
    const w = W * (0.06 + 0.22 * open);
    holes = <rect x={cx - w / 2} y={-20} width={w} height={H + 40} fill="black" />;
  }
  const lens = kind === 'peephole' ? 1.14 : kind === 'binoculars' ? 1.35 : kind === 'keyhole' ? 1.25 : 1.06;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#05060a'}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `translate(${s.x}px, ${s.y}px) scale(${lens})`,
        filter: kind === 'peephole' ? 'saturate(.8)' : undefined}}>{children}</div>
      {holes && (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
          <defs>
            <mask id={mid}><rect width={W} height={H} fill="white" />{holes}</mask>
            <radialGradient id={`${mid}-v`} cx="50%" cy="45%" r="50%"><stop offset="55%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity=".85" /></radialGradient>
          </defs>
          {kind === 'peephole' && <circle cx={cx} cy={cy} r={m * 0.36} fill={`url(#${mid}-v)`} />}
          <rect width={W} height={H} fill={kind === 'crack' ? '#120c08' : '#040507'} mask={`url(#${mid})`} />
          {kind === 'crack' && <rect x={cx - W * (0.06 + 0.22 * open) / 2 - 14} y={0} width={14} height={H} fill="#5a4030" />}
          {kind === 'peephole' && <circle cx={cx} cy={cy} r={m * 0.36} fill="none" stroke="#1a1d24" strokeWidth={m * 0.03} />}
        </svg>
      )}
      {kind === 'blinds' && (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
          {Array.from({length: Math.ceil(H / 70) + 1}, (_, i) => (
            <rect key={i} x={-10} y={i * 70 - 6} width={W + 20} height={70 * (1 - 0.3 - 0.4 * open)} fill="#1c1a17" opacity={0.92} />
          ))}
        </svg>
      )}
      {kind === 'phone' && <PhoneCamUi W={W} H={H} f={f} rec={rec} />}
    </div>
  );
};

/** phone-camera overlay: corner brackets, blinking REC + timer, battery, focus box */
const PhoneCamUi: React.FC<{W: number; H: number; f: number; rec: string}> = ({W, H, f, rec}) => {
  const m = Math.min(W, H), pad = m * 0.07, arm = m * 0.08, sw = Math.max(4, m * 0.006);
  const on = Math.floor(f / 15) % 2 === 0;
  const corner = (x: number, y: number, dx: number, dy: number) => <path d={`M${x} ${y + dy * arm} L${x} ${y} L${x + dx * arm} ${y}`} stroke="#fff" strokeWidth={sw} fill="none" opacity={0.85} />;
  const txt = {fontFamily: T.ui, fontWeight: 700, fontSize: Math.max(30, m * 0.034), fill: '#fff'} as const;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {corner(pad, pad, 1, 1)}{corner(W - pad, pad, -1, 1)}{corner(pad, H - pad, 1, -1)}{corner(W - pad, H - pad, -1, -1)}
      {on && <circle cx={pad + m * 0.03} cy={pad + m * 0.06} r={m * 0.014} fill={T.red} />}
      <text x={pad + m * 0.06} y={pad + m * 0.075} {...txt}>REC {rec}</text>
      <rect x={W - pad - m * 0.1} y={pad + m * 0.04} width={m * 0.08} height={m * 0.036} rx={4} fill="none" stroke="#fff" strokeWidth={3} />
      <rect x={W - pad - m * 0.094} y={pad + m * 0.046} width={m * 0.03} height={m * 0.024} fill={T.red} />
      <rect x={W / 2 - m * 0.09} y={H * 0.45 - m * 0.09} width={m * 0.18} height={m * 0.18} fill="none" stroke={T.gold} strokeWidth={sw * 0.7} opacity={0.8} />
    </svg>
  );
};

/** Split screen: two full-frame panels cut by one line. dir 'v' = left | right (16:9 phone calls), 'h' = top / bottom
 *  (9:16). `angle` tilts the cut (6–10° reads tense). `center` slides each panel so its frame centre sits in its own
 *  half — draw each panel framed on its subject as if it were the whole shot. `at` 0–1 moves the cut. */
export const Split: React.FC<{
  W: number; H: number; a: React.ReactNode; b: React.ReactNode;
  dir?: 'v' | 'h'; at?: number; angle?: number; line?: number; color?: string; center?: boolean;
}> = ({W, H, a, b, dir = W > H ? 'v' : 'h', at = 0.5, angle = 0, line = 8, color = '#0b0d10', center = true}) => {
  const t = Math.tan((angle * Math.PI) / 180);
  let polyA: string, polyB: string, shiftA: string, shiftB: string, l: [number, number, number, number];
  if (dir === 'v') {
    const x = W * at, d = (H / 2) * t;
    polyA = `0 0, ${x + d}px 0, ${x - d}px ${H}px, 0 ${H}px`;
    polyB = `${x + d}px 0, ${W}px 0, ${W}px ${H}px, ${x - d}px ${H}px`;
    shiftA = `translateX(${center ? x / 2 - W / 2 : 0}px)`;
    shiftB = `translateX(${center ? (x + W) / 2 - W / 2 : 0}px)`;
    l = [x + d, 0, x - d, H];
  } else {
    const y = H * at, d = (W / 2) * t;
    polyA = `0 0, ${W}px 0, ${W}px ${y - d}px, 0 ${y + d}px`;
    polyB = `0 ${y + d}px, ${W}px ${y - d}px, ${W}px ${H}px, 0 ${H}px`;
    shiftA = `translateY(${center ? y / 2 - H / 2 : 0}px)`;
    shiftB = `translateY(${center ? (y + H) / 2 - H / 2 : 0}px)`;
    l = [0, y + d, W, y - d];
  }
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: color}}>
      <div style={{position: 'absolute', inset: 0, clipPath: `polygon(${polyA})`}}><div style={{position: 'absolute', inset: 0, transform: shiftA}}>{a}</div></div>
      <div style={{position: 'absolute', inset: 0, clipPath: `polygon(${polyB})`}}><div style={{position: 'absolute', inset: 0, transform: shiftB}}>{b}</div></div>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        <line x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={color} strokeWidth={line} />
      </svg>
    </div>
  );
};

/** The frame a CCTV clip shows at frame f: footage stutters at a low frame rate. Pass it to the scene inside <Cctv>. */
export const cctvFrame = (f: number, step = 3) => Math.floor(f / step) * step;

/** add whole seconds to "hh:mm:ss" */
const clockPlus = (t: string, s: number) => {
  const [h, m, x] = t.split(':').map(Number);
  const n = (h * 3600 + m * 60 + (x || 0) + s) % 86400;
  return [Math.floor(n / 3600), Math.floor(n / 60) % 60, n % 60].map(v => String(v).padStart(2, '0')).join(':');
};

/** Surveillance / recorded footage (S16): grey-green, high contrast, scanlines, grain, slight fisheye, label + running
 *  timestamp (keep it in step with the HUD / continuity), blinking REC. `glitch` 0–1 adds rare tearing bands. */
export const Cctv: React.FC<{
  W: number; H: number; f: number; children: React.ReactNode;
  cam?: string; time?: string; date?: string; tint?: 'green' | 'grey'; glitch?: number;
}> = ({W, H, f, children, cam = 'CAM 03', time = '02:14:07', date, tint = 'grey', glitch = 0.3}) => {
  const m = Math.min(W, H), fs = Math.max(30, m * 0.036);
  const k = Math.floor(f / 3);
  const tear = rnd(5, k) < glitch * 0.25 ? (rnd(6, k) - 0.5) * 40 : 0;
  const txt = {position: 'absolute', fontFamily: 'monospace', fontWeight: 700, fontSize: fs, color: '#e8f0e8', textShadow: '0 0 6px rgba(0,0,0,.8)', letterSpacing: 2} as const;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(1.08) translateX(${tear}px)`,
        filter: `grayscale(1) contrast(1.3) brightness(1.05)${tint === 'green' ? ' sepia(.4) hue-rotate(60deg) saturate(1.6)' : ''}`}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 2px, rgba(0,0,0,0) 2px 5px)'}} />
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)'}} />
      <Grain f={f} opacity={0.32} />
      <div style={{...txt, left: m * 0.05, top: m * 0.05}}>{cam}</div>
      <div style={{...txt, right: m * 0.05, top: m * 0.05, display: 'flex', alignItems: 'center', gap: 12}}>
        <span style={{width: fs * 0.55, height: fs * 0.55, borderRadius: '50%', background: Math.floor(f / 15) % 2 ? 'transparent' : T.red}} />REC
      </div>
      <div style={{...txt, left: m * 0.05, bottom: m * 0.05}}>{date ? `${date}  ` : ''}{clockPlus(time, Math.floor(f / 30))}</div>
    </div>
  );
};

/** A mirror / rear-view mirror / window reflection (S15): `children` (a full-frame view) flipped, cooled and softened
 *  inside a rounded frame at (x, y, w, h). The difference between the room and its reflection is the clue. */
export const MirrorFrame: React.FC<{
  x: number; y: number; w: number; h: number; W: number; H: number; children: React.ReactNode;
  r?: number; frame?: string; flip?: boolean; ox?: number; oy?: number; zoom?: number;
}> = ({x, y, w, h, W, H, children, r = 40, frame = '#1a1c22', flip = true, ox = W / 2, oy = H / 2, zoom = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, overflow: 'hidden',
    boxShadow: `0 0 0 ${Math.max(10, w * 0.03)}px ${frame}, 0 18px 40px rgba(0,0,0,.6)`}}>
    <div style={{position: 'absolute', left: w / 2 - ox, top: h / 2 - oy, width: W, height: H, transformOrigin: `${ox}px ${oy}px`,
      transform: `scale(${flip ? -zoom : zoom}, ${zoom})`, filter: 'saturate(.6) brightness(.85) blur(.6px)'}}>{children}</div>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.14) 42%, rgba(255,255,255,0) 52%)'}} />
  </div>
);
