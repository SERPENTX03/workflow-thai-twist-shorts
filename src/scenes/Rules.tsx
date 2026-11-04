import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent} from '../engine/episode';
import {Sprite} from '../cast/Sprite';
import {appear, backOut, kf, lerp, sec, easeInOut} from '../engine/anim';
import {T} from '../engine/theme';
import {Checklist, Meter, RuleCard, Stat, Tag} from '../kit/ui';
import {Far, ShadowBlob} from '../kit/fx';

/**
 * Survival "rules + numbers" beat over a day set. view: "card" (default) | "numbers".
 * data (card):    {no: 'กฎข้อ 1', lines: ['อย่าวิ่งลงบันได', 'ตามเพื่อน'], tag: 'คุณ · ม.4/2', who: 'man'}
 * data (numbers): {label: 'น้ำที่เหลือ', unit: 'ลิตร', from: 90, to: 29, rows: ['ปิดประตู ล็อก', ...]}
 */
export const Rules: ShotComponent = ({shot, f, len}) => {
  const d = shot.data ?? {};
  const numbers = shot.view === 'numbers';
  const zoom = kf(f, [[0, 1], [len, 1.08]], t => t);
  const rows: string[] = d.rows ?? ['ปิดประตู ล็อก', 'แปะกระดาษปิดกระจก', 'นั่งต่ำกว่าขอบหน้าต่าง'];
  const from = d.from ?? 90, to = d.to ?? 29;
  const p = appear(f, sec(0.5), sec(1.4), easeInOut);
  const out = (start: number, dist: number) => `translateX(${(1 - appear(f, start, 10)) * dist}px)`;
  return (
    <AbsoluteFill style={{background: T.day0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -60, top: -60, width: 1200, height: 2040, transform: `scale(${zoom})`, transformOrigin: '50% 50%'}}>
        <Far>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1240, background: `linear-gradient(180deg, ${T.day0}, ${T.day1})`}} />
          {[120, 440, 760].map(x => <div key={x} style={{position: 'absolute', left: x, top: 260, width: 260, height: 360, background: '#c9dbe4', border: '14px solid #8b2f2f'}} />)}
          <div style={{position: 'absolute', left: 0, right: 0, top: 700, height: 16, background: '#8b2f2f'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 1240, bottom: 0, background: 'linear-gradient(180deg, #b9a98c, #8f7f66)'}} />
        </Far>
        <ShadowBlob x={685} y={1218} />
        <div style={{position: 'absolute', left: 690, top: 640}}><Sprite id={d.who ?? 'man'} height={598} /></div>
      </div>
      <div style={{transform: `scale(${appear(f, 5, 9, backOut(2))})`, transformOrigin: '700px 545px'}}>
        {d.tag !== false && <Tag text={d.tag ?? 'คุณ'} tone="you" x={680} y={520} />}
      </div>
      {!numbers ? (
        <RuleCard no={d.no ?? 'กฎข้อ 1'} lines={d.lines ?? ['อย่าวิ่งลงบันได', 'ตามเพื่อน']} x={180} y={170}
          style={{transform: `translateY(${(1 - appear(f, 12, 14, backOut(1.5))) * -700}px) rotate(${(1 - appear(f, 12, 14)) * -3}deg)`}} />
      ) : (
        <>
          <Stat label={d.label ?? 'น้ำที่เหลือ'} value={Math.round(lerp(from, to, p))} unit={d.unit ?? 'ลิตร'} x={80} y={230} style={{transform: out(0, -600)}} />
          <Meter level={lerp(1, to / from, p)} low={to / from < 0.4} x={110} y={480} w={380} style={{transform: out(2, -600)}} />
          <Checklist rows={rows} ticks={rows.map((_, k) => appear(f, sec(0.7) + k * 14, 8, backOut(2.4)))} x={80} y={600} w={560}
            style={{transform: `translateY(${(1 - appear(f, 5, 12, backOut(1.3))) * 1500}px)`}} />
        </>
      )}
    </AbsoluteFill>
  );
};
