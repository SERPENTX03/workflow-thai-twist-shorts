import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent} from '../engine/episode';
import {appear, backOut, kf, sec} from '../engine/anim';
import {Chip} from '../kit/ui';

/**
 * Top-down room map ("god view"). A solid dot is someone alive; the hollow dashed dot is the protagonist once the twist is known.
 * data: {her: 'คนเป็น', me: 'คุณ'}
 */
export const MapView: ShotComponent = ({shot, f, len}) => {
  const d = shot.data ?? {};
  const draw = appear(f, 0, sec(0.9), t => t * t * (3 - 2 * t));
  const her = appear(f, 21, 10, backOut(2));
  const ring = appear(f, 30, 10, backOut(2));
  const fade = kf(f, [[sec(2.6), 1], [sec(3.8), 0.25]]);
  const zoom = kf(f, [[0, 1.06], [Math.min(len, sec(2.4)), 1]]);
  return (
    <AbsoluteFill style={{background: '#132033', overflow: 'hidden'}}>
      <svg viewBox="0 0 1080 1300" width={1080} height={1300} style={{position: 'absolute', left: 0, top: 0, transform: `scale(${zoom})`, transformOrigin: '540px 650px'}}>
        <rect x={140} y={200} width={800} height={900} fill="#3f3129" />
        <path stroke="rgba(0,0,0,.25)" strokeWidth={3} d="M220 200V1100M300 200V1100M380 200V1100M460 200V1100M540 200V1100M620 200V1100M700 200V1100M780 200V1100M860 200V1100" />
        <rect x={140} y={200} width={800} height={900} fill="none" stroke="#0a0f18" strokeWidth={28} />
        <rect x={200} y={1086} width={160} height={30} fill="#3f3129" />
        <path d="M200 1100 A160 160 0 0 1 360 940" fill="none" stroke="rgba(239,232,218,.35)" strokeWidth={4} strokeDasharray="10 10" />
        <rect x={340} y={186} width={260} height={28} fill="#6f8fb8" />
        <rect x={620} y={250} width={280} height={400} rx={16} fill="#5d6f86" />
        <rect x={650} y={270} width={220} height={80} rx={20} fill="#eee9de" />
        <rect x={200} y={520} width={220} height={150} rx={14} fill="#6b4d3a" />
        <circle cx={380} cy={560} r={18} fill="#f0d29e" />
        <path d="M280 1080 C300 900 420 820 560 800 S760 820 800 880" fill="none" stroke="rgba(239,232,218,.75)" strokeWidth={8}
          strokeLinecap="round" strokeDasharray="1 26" pathLength={900} strokeDashoffset={900 * (1 - draw)} opacity={draw > 0 ? 1 : 0} />
        <circle cx={800} cy={880} r={34 * her} fill="#d9c9a8" stroke="#fff" strokeWidth={6} />
        <circle cx={620} cy={440} r={30} fill="none" stroke="rgba(239,232,218,.8)" strokeWidth={6} strokeDasharray="10 8" opacity={fade} />
        <circle cx={620} cy={440} r={20 + 52 * ring} fill="none" stroke="#e5383b" strokeWidth={7} strokeDasharray="12 10" opacity={ring} />
      </svg>
      <Chip text={d.her ?? 'คนเป็น'} x={700} y={760} style={{opacity: appear(f, 24, 9), transform: `translateY(${(1 - appear(f, 24, 9)) * 30}px)`}} />
      <Chip text={d.me ?? 'คุณ'} red x={560} y={330} style={{opacity: appear(f, 33, 9), transform: `translateY(${(1 - appear(f, 33, 9)) * 30}px)`}} />
    </AbsoluteFill>
  );
};
