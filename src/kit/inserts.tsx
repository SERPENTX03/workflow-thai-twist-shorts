import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../engine/episode';
import {appear, backOut} from '../engine/anim';
import {T} from '../engine/theme';
import {Grain} from './horror';

// Landscape close-up pieces (from temple-boy): a flat hand, rain and drips over a close-up, notebook pages and
// handwriting, and a full-frame rule card. Use them inside Plate (src/kit/stage.tsx).

/** Flat close-up hand, origin at the wrist joint. grip = fingers curled round something horizontal; open = reaching;
 *  flat = palm only (layer an `open` on top). `pinkyCut` shortens the little finger (a trait clue); `thread` draws a
 *  wrist thread in `threadColor`; `sleeve` adds a cuff. Keep one hand per arm (hands-poses.md). */
export const Hand: React.FC<{x: number; y: number; s?: number; rot?: number; skin: string; sleeve?: string; pinkyCut?: boolean; mode?: 'grip' | 'open' | 'flat'; flip?: boolean; wrinkles?: boolean; thread?: boolean; threadColor?: string; o?: number}> = ({
  x, y, s = 1, rot = 0, skin, sleeve, pinkyCut, mode = 'grip', flip, wrinkles, thread, threadColor = '#9b3b36', o = 1,
}) => {
  const dark = 'rgba(0,0,0,.18)';
  return (
    <svg width={600} height={600} viewBox="-300 -300 600 600" style={{position: 'absolute', left: x - 300, top: y - 300, overflow: 'visible', opacity: o,
      transform: `rotate(${rot}deg) scale(${s * (flip ? -1 : 1)}, ${s})`}}>
      {sleeve && <path d="M-420 60 L-120 -70 L-60 70 L-380 210 Z" fill={sleeve} />}
      {sleeve && <path d="M-120 -70 L-60 70" stroke="rgba(0,0,0,.25)" strokeWidth={10} />}
      <path d="M-130 -40 L-40 -60 L-10 60 L-110 70 Z" fill={skin} />
      {thread && <path d="M-118 -46 Q-90 -4 -96 66" stroke={threadColor} strokeWidth={9} fill="none" />}
      {mode === 'grip' && (
        <>
          <rect x={-40} y={-80} width={150} height={150} rx={50} fill={skin} />
          {[0, 1, 2, 3].map(i => {
            const cut = pinkyCut && i === 3;
            const len = [120, 128, 116, 92][i] * (cut ? 0.55 : 1);
            return (
              <g key={i}>
                <rect x={60} y={-74 + i * 38} width={len} height={36} rx={cut ? 8 : 18} fill={skin} />
                <path d={`M${60 + len * 0.55} ${-70 + i * 38} v28`} stroke={dark} strokeWidth={3} />
                {cut && <path d={`M${60 + len - 2} ${-72 + i * 38} v32`} stroke="#b77f62" strokeWidth={6} strokeLinecap="round" />}
              </g>
            );
          })}
          <path d="M-20 -78 Q60 -120 120 -96 Q130 -80 110 -70 Q50 -80 0 -48 Z" fill={skin} />
          <path d="M-20 -78 Q60 -120 120 -96" stroke={dark} strokeWidth={3} fill="none" />
        </>
      )}
      {mode === 'open' && (
        <>
          <rect x={-50} y={-70} width={150} height={140} rx={46} fill={skin} />
          {[0, 1, 2, 3].map(i => {
            const cut = pinkyCut && i === 3;
            const len = [150, 162, 150, 118][i] * (cut ? 0.55 : 1);
            const yy = -66 + i * 36;
            return <rect key={i} x={70} y={yy} width={len} height={32} rx={cut ? 8 : 16} fill={skin} transform={`rotate(${(i - 1.5) * 5} 70 ${yy + 16})`} />;
          })}
          <path d="M0 -60 Q50 -140 120 -150 Q136 -134 116 -118 Q60 -100 40 -40 Z" fill={skin} />
          {wrinkles && <path d="M10 -20 q30 10 60 0 M10 10 q30 10 60 0 M90 -40 v80" stroke={dark} strokeWidth={4} fill="none" />}
        </>
      )}
    </svg>
  );
};

/** rain streaks over a close-up (the side-view set rain is Rain in fx.tsx) */
export const RainStreaks: React.FC<{f: number; a?: number}> = ({f, a = 1}) => (
  <div style={{position: 'absolute', left: -400, top: -400, width: 2800, height: 1900, pointerEvents: 'none', opacity: a, backgroundPosition: `${-f * 5}px ${f * 38}px`,
    background: 'repeating-linear-gradient(100deg, rgba(225,233,245,0) 0 46px, rgba(225,233,245,.22) 46px 49px, rgba(225,233,245,0) 49px 130px)'}} />
);

/** n drops falling from (x,y) to y=`to`, looping every 40 frames */
export const Drips: React.FC<{x: number; y: number; f: number; n?: number; to?: number}> = ({x, y, f, n = 3, to = 1000}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const t = ((f + i * 17) % 40) / 40;
      return <div key={i} style={{position: 'absolute', left: x + (i - 1) * 40, top: y + (to - y) * t * t, width: 10, height: 18, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'rgba(170,200,220,.8)'}} />;
    })}
  </>
);

/** lined notebook page; `stain` 0–1 adds a water ring */
export const Page: React.FC<{x: number; y: number; w: number; h: number; rot?: number; children?: React.ReactNode; stain?: number}> = ({x, y, w, h, rot = 0, children, stain = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#efe6cf', transform: `rotate(${rot}deg)`, boxShadow: '0 20px 50px rgba(0,0,0,.45)', overflow: 'hidden',
    backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 63px, rgba(80,100,140,.22) 63px 65px)'}}>
    {stain > 0 && <div style={{position: 'absolute', left: w * 0.4, top: h * 0.2, width: w * 0.5, height: h * 0.45, borderRadius: '48% 52% 44% 56%', opacity: stain,
      background: 'radial-gradient(ellipse, rgba(140,120,80,.05) 30%, rgba(140,120,80,.35) 62%, rgba(140,120,80,0) 72%)'}} />}
    {children}
  </div>
);

/** one handwritten line on a Page's 64 px ruling; `shake` 0–1 = unsteadier hand */
export const Ink: React.FC<{text: string; size?: number; shake?: number; color?: string; style?: React.CSSProperties}> = ({text, size = 42, shake = 0, color = '#27324a', style}) => (
  <div style={{fontFamily: '"Plex Thai", sans-serif', fontWeight: 500, fontSize: size, color, lineHeight: '64px', transform: `skewX(${-6 - shake * 6}deg) rotate(${shake * 1.5}deg)`, ...style}}>{text}</div>
);

/** full-frame rule card over a blurred notebook: data {no: "กฎข้อ 1", text: "line\nline"}; drops in with a red spine */
export const RuleCardScene: React.FC<{p: ShotProps}> = ({p}) => {
  const {f} = p;
  const d = p.shot.data ?? {};
  const drop = appear(f, 4, 14, backOut(1.3));
  const lines: string[] = String(d.text ?? '').split('\n');
  return (
    <AbsoluteFill style={{background: '#0b0907', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: -40, filter: 'blur(14px)', opacity: 0.55}}>
        <div style={{position: 'absolute', left: 300, top: 120, width: 1300, height: 900, background: '#e8dcc0', transform: 'rotate(-3deg)',
          backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 63px, rgba(80,100,140,.25) 63px 65px)'}} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,.8) 100%)'}} />
      <div style={{position: 'absolute', left: 960 - 700, top: 300, width: 1400, padding: '96px 60px 70px', boxSizing: 'border-box', background: T.paper, borderRadius: 20,
        borderTop: `14px solid ${T.red}`, textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,.6)',
        transform: `translateY(${(1 - drop) * -500}px) rotate(${(1 - drop) * -4}deg)`, opacity: Math.min(1, drop * 2)}}>
        <div style={{position: 'absolute', left: '50%', top: 26, transform: 'translateX(-50%)', height: 54, lineHeight: '54px', padding: '0 34px', borderRadius: 27,
          background: T.red, color: '#fff', fontFamily: T.ui, fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap'}}>{d.no}</div>
        {lines.map((l, i) => <div key={i} style={{fontFamily: T.display, fontWeight: 700, fontSize: 74, lineHeight: 1.3, color: T.ink, whiteSpace: 'nowrap'}}>{l}</div>)}
      </div>
      <Grain f={f} opacity={0.12} />
    </AbsoluteFill>
  );
};
