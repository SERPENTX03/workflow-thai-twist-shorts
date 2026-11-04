import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent} from '../engine/episode';
import {Sprite} from '../cast/Sprite';
import {appear, backOut, sec} from '../engine/anim';
import {T} from '../engine/theme';

/**
 * Evidence card (newspaper). The reveal device: a blurred photo that sharpens, then a red ring.
 * data: {kicker: 'ข่าวท้องถิ่น', date: '14 มีนาคม', title: ['พบผู้เช่าห้อง 7', ...], who: 'man'}
 */
export const News: ShotComponent = ({shot, f}) => {
  const d = shot.data ?? {};
  const rise = appear(f, 0, 14, backOut(1.4));
  const blur = 22 * (1 - appear(f, sec(0.9), 21, t => t));
  const ring = appear(f, sec(1.6), 10, backOut(2));
  return (
    <AbsoluteFill style={{background: '#101826', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 110, top: 240, width: 860, height: 920, background: T.paper, boxShadow: '0 20px 50px rgba(0,0,0,.5)',
        color: T.ink, fontFamily: T.ui, padding: 50, boxSizing: 'border-box',
        transform: `translateY(${(1 - rise) * 900}px) rotate(${4 - 5.5 * rise}deg)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34, fontWeight: 700, borderBottom: `5px solid ${T.ink}`, paddingBottom: 12}}>
          <span>{d.kicker ?? 'ข่าวท้องถิ่น'}</span>
          <span style={{fontWeight: 500, color: 'rgba(24,32,46,.55)', fontSize: 30}}>{d.date ?? '14 มีนาคม'}</span>
        </div>
        <div style={{fontFamily: T.display, fontWeight: 700, fontSize: 64, lineHeight: 1.25, margin: '30px 0'}}>
          {(d.title ?? ['พบผู้เช่าห้อง 7', 'เสียชีวิตในห้อง']).map((l: string, i: number) => <span key={i} style={{display: 'block'}}>{l}</span>)}
        </div>
        <div style={{position: 'absolute', left: 50, top: 400, width: 380, height: 460, background: '#2a3646', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 90, top: 40, filter: `blur(${blur}px)`}}><Sprite id={d.who ?? 'man'} /></div>
        </div>
        <div style={{position: 'absolute', left: 470, top: 400, right: 50}}>
          {['100%', '100%', '60%', '100%', '100%', '70%'].map((w, i) => <div key={i} style={{height: 14, width: w, background: 'rgba(24,32,46,.35)', marginBottom: 26}} />)}
        </div>
        <div style={{position: 'absolute', left: 90, top: 410, width: 300, height: 300, borderRadius: '50%', border: `9px solid ${T.red}`,
          opacity: ring, transform: `scale(${0.2 + 0.8 * ring})`}} />
      </div>
    </AbsoluteFill>
  );
};
