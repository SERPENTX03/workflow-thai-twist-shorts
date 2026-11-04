import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent} from '../engine/episode';
import {appear, backOut, kf} from '../engine/anim';
import {T} from '../engine/theme';

/**
 * Series end card. Everything lands by 1.0 s so the closing lines stay on screen; leave this shot's caption empty.
 * data: {ep: 'เมื่อไฟดับทั้งเมือง · EP 2', title: ['ใครอยู่', 'หน้าประตู'], cta: 'กดติดตามไว้ ไม่พลาดตอนต่อไป'}
 */
export const Next: ShotComponent = ({shot, f}) => {
  const d = shot.data ?? {};
  const title: string[] = d.title ?? ['ใครอยู่', 'หน้าประตู'];
  const mask = (start: number, children: React.ReactNode) => (
    <span style={{display: 'block', overflow: 'hidden'}}>
      <span style={{display: 'block', transform: `translateY(${(1 - appear(f, start, 9)) * 105}%)`}}>{children}</span>
    </span>
  );
  const dot = appear(f, 27, 11, backOut(2));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${T.sky1}, ${T.sky0} 70%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 560, textAlign: 'center', color: T.white, fontFamily: T.display}}>
        <div style={{fontFamily: T.ui, fontWeight: 700, fontSize: 34, color: T.mute, marginBottom: 26,
          opacity: appear(f, 2, 9), transform: `translateY(${(1 - appear(f, 2, 9)) * 40}px)`}}>{d.ep ?? shot.who ?? ''}</div>
        <div style={{display: 'inline-block', padding: '0 26px', height: 52, lineHeight: '52px', borderRadius: 26, background: T.red,
          fontFamily: T.ui, fontWeight: 700, fontSize: 30, transform: `scale(${appear(f, 5, 9, backOut(2.2))})`}}>ตอนต่อไป</div>
        <div style={{fontWeight: 700, fontSize: 84, lineHeight: 1.25, marginTop: 34}}>
          {title.map((l, i) => <React.Fragment key={i}>{mask(12 + i * 3, l)}</React.Fragment>)}
        </div>
        <div style={{fontFamily: T.ui, fontWeight: 500, fontSize: 32, color: T.mute, marginTop: 30}}>
          {mask(18, d.cta ?? 'กดติดตามไว้ ไม่พลาดตอนต่อไป')}
        </div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: 1180, marginLeft: -60, width: 120, height: 120, borderRadius: '50%', border: `8px dashed ${T.red}`,
        boxSizing: 'border-box', opacity: dot, transform: `scale(${0.2 + 0.8 * dot}) rotate(${kf(f, [[30, 0], [96, 90]], t => t)}deg)`}} />
    </AbsoluteFill>
  );
};
