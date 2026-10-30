import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent} from '../engine/episode';
import {Sprite} from '../cast/Sprite';
import {appear, backOut, kf, sec} from '../engine/anim';
import {T} from '../engine/theme';
import {Hud} from '../kit/ui';

/** Night room, side view, with the mirror twist device. data: {hud?: '03:00', reflection?: boolean} */
export const Room: ShotComponent = ({shot, f, len}) => {
  const d = shot.data ?? {};
  const zoom = kf(f, [[0, 1], [Math.max(len, sec(2.4)), 1.12]]);
  const refl = d.reflection === false ? 0 : 0.95 * appear(f, 9, 24);
  const ring = appear(f, 36, 11, backOut(2));
  return (
    <AbsoluteFill style={{background: '#05070c', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '540px 900px', transform: `scale(${zoom})`}}>
        <div style={{position: 'absolute', left: -200, right: -200, top: 0, height: 1240,
          background: `repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 40px, transparent 40px 90px), linear-gradient(180deg, ${T.wall1}, ${T.wall0})`}} />
        <div style={{position: 'absolute', left: -200, right: -200, top: 1210, height: 30, background: '#1c2838'}} />
        <div style={{position: 'absolute', left: -200, right: -200, top: 1240, height: 900,
          background: `repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 3px, transparent 3px 120px), linear-gradient(180deg, ${T.floor0}, ${T.floor1})`}} />
        <div style={{position: 'absolute', left: 90, top: 430, width: 320, height: 360, border: '16px solid #1a2433', background: `linear-gradient(180deg, ${T.sky0}, ${T.sky1})`}}>
          <div style={{position: 'absolute', left: 190 - 106, top: 60, width: 90, height: 90, borderRadius: '50%', background: T.moon, boxShadow: '0 0 80px 20px rgba(244,236,212,.25)'}} />
        </div>
        <div style={{position: 'absolute', left: 600, top: 380, width: 260, height: 860, borderRadius: 130, border: '20px solid #3c2c22',
          background: 'linear-gradient(160deg, #4d6178, #22303f)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 30 - 20, top: 300 - 20, opacity: refl}}>
            <Sprite id="man-raise" silhouette />
          </div>
        </div>
        <div style={{position: 'absolute', left: -300, top: 300, width: 1100, height: 1100, borderRadius: '50%', mixBlendMode: 'screen',
          background: 'radial-gradient(circle, rgba(255,190,120,.28), rgba(255,190,120,0) 65%)'}} />
        <div style={{position: 'absolute', left: 250, top: 520}}><Sprite id="man-raise" height={702} /></div>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(6,10,26,.55)'}} />
        <div style={{position: 'absolute', left: 600, top: 380, width: 260, height: 860, borderRadius: 140, border: `6px dashed ${T.red}`,
          opacity: ring, transform: `scale(${0.2 + 0.8 * ring})`}} />
      </div>
      {d.hud !== false && <Hud text={d.hud ?? '03:00'} style={{transform: `translateY(${(1 - appear(f, 0, 12, backOut())) * -200}px)`}} />}
    </AbsoluteFill>
  );
};
