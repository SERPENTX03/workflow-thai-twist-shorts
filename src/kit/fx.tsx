import React from 'react';

export const Vignette: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)'}} />
);

/** someone who casts a shadow is alive; the protagonist never gets one */
export const ShadowBlob: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 240}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: 36, borderRadius: '50%', background: 'rgba(5,7,12,.45)'}} />
);

/** soft-focus layer for far sets */
export const Far: React.FC<{children: React.ReactNode; blur?: number}> = ({children, blur = 6}) => (
  <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px)`}}>{children}</div>
);

/** falling rain streaks; `f` drives the scroll */
export const Rain: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: -100, pointerEvents: 'none', backgroundPosition: `${-f * 5}px ${f * 38}px`,
    background:
      'repeating-linear-gradient(100deg, rgba(225,233,245,0) 0 46px, rgba(225,233,245,.32) 46px 49px, rgba(225,233,245,0) 49px 130px),' +
      'repeating-linear-gradient(97deg, rgba(225,233,245,0) 0 80px, rgba(225,233,245,.2) 80px 82px, rgba(225,233,245,0) 82px 190px)'}} />
);
