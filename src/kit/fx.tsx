import React from 'react';

/** Corner darkness. `at` = [x, y] in 0–1 of the frame where the light stays (put it on the subject or the lamp,
 *  not the dead centre); `a` = edge darkness (≈ .55 day, .8–.9 suspense); `inner` = % of the radius left clear. */
export const Vignette: React.FC<{at?: [number, number]; a?: number; inner?: number}> = ({at = [0.5, 0.46], a = 0.55, inner = 40}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
    background: `radial-gradient(ellipse at ${at[0] * 100}% ${at[1] * 100}%, rgba(0,0,0,0) ${inner}%, rgba(0,0,0,${a}) 100%)`}} />
);

/** someone who casts a shadow is alive; the protagonist never gets one */
export const ShadowBlob: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 240}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: 36, borderRadius: '50%', background: 'rgba(5,7,12,.45)'}} />
);

/** soft-focus layer for far sets; `dim` < 1 darkens it so the midground (cast, clue) stays the brightest thing
 *  (depth-light.md: background 30–50 % darker than the midground at night → dim 0.5–0.7) */
export const Far: React.FC<{children: React.ReactNode; blur?: number; dim?: number}> = ({children, blur = 6, dim}) => (
  <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px)${dim !== undefined ? ` brightness(${dim})` : ''}`}}>{children}</div>
);

/** falling rain streaks; `f` drives the scroll */
export const Rain: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: -100, pointerEvents: 'none', backgroundPosition: `${-f * 5}px ${f * 38}px`,
    background:
      'repeating-linear-gradient(100deg, rgba(225,233,245,0) 0 46px, rgba(225,233,245,.32) 46px 49px, rgba(225,233,245,0) 49px 130px),' +
      'repeating-linear-gradient(97deg, rgba(225,233,245,0) 0 80px, rgba(225,233,245,.2) 80px 82px, rgba(225,233,245,0) 82px 190px)'}} />
);
