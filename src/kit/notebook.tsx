import React from 'react';
import type {ShotProps} from '../engine/episode';
import {appear, kf} from '../engine/anim';
import {T} from '../engine/theme';
import {Plate} from './stage';
import {Ink, Page} from './inserts';

// The long-form "tracked device" as a notebook page: a list the viewer follows across the film (first used by
// same-child: สิ่งที่รู้แน่ ๆ เกี่ยวกับแพร). Each row is [text, state]:
//   ok   = a true fact (ink, gold tick)        bad  = written by someone else (red, wavy underline)
//   lost = something gone (struck through, "?") new rows (the last one by default) write themselves in.
// data {facts, count, mark (row index to circle), note (pencil note in the margin), real (true count shown on the chip)}

export type Fact = [string, 'ok' | 'bad' | 'lost'];

export const MemoryNotebook: React.FC<{p: ShotProps; title?: string; counter?: (n: number) => string}> = ({p, title = 'สิ่งที่รู้แน่ ๆ', counter = n => `${n} ข้อ`}) => {
  const {f, len} = p;
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const facts: Fact[] = d.facts ?? [];
  const fresh: number = d.fresh ?? facts.length - 1;
  const real = d.real ?? facts.filter(x => x[1] === 'ok').length;
  const mark: number | undefined = d.mark;
  const write = kf(f, [[4, 0], [Math.min(len * 0.6, 50), 1]]);
  const x0 = 470, y0 = 120, w = 980, h = 860;
  return (
    <Plate p={p} bg="#0d0b09" light={d.light === 'night' || d.light === 'dark' ? 'lamp' : d.light} z={[1.02, 1.08]} oy={500}>
      <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: 'radial-gradient(ellipse at 50% 45%, #5a4330, #241a12 70%)'}} />
      <Page x={x0} y={y0} w={w} h={h} rot={-1.2}>
        <div style={{position: 'absolute', left: 90, top: 0, width: 3, height: h, background: 'rgba(200,80,80,.35)'}} />
        <div style={{position: 'absolute', left: 120, top: 40}}><Ink text={title} size={44} color="#5a2a24" /></div>
        {facts.map(([t, s], i) => {
          const isNew = i === fresh && d.fresh !== false;
          const k = isNew ? write : 1;
          const color = s === 'bad' ? '#b0262b' : s === 'lost' ? '#6a6a72' : '#27324a';
          return (
            <div key={i} style={{position: 'absolute', left: 120, top: 128 + i * 64, width: 760, height: 64}}>
              <div style={{clipPath: `inset(0 ${100 - k * 100}% 0 0)`}}>
                <Ink text={`${i + 1}. ${t}${s === 'lost' ? '  ?' : ''}`} size={38} color={color} shake={s === 'bad' ? 0.2 : 0} />
              </div>
              {s === 'lost' && <div style={{position: 'absolute', left: 40, top: 32, width: 520 * k, height: 4, background: '#6a6a72'}} />}
              {s === 'bad' && <div style={{position: 'absolute', left: 40, top: 54, width: 600 * k, height: 6, opacity: 0.8,
                background: 'repeating-linear-gradient(90deg, #b0262b 0 10px, transparent 10px 16px)'}} />}
              {s === 'ok' && k >= 1 && <div style={{position: 'absolute', left: -46, top: 4, fontSize: 40, color: '#b8902a', fontFamily: T.display}}>✓</div>}
              {mark === i && <div style={{position: 'absolute', left: 20, top: -2, width: 700, height: 66, border: '5px solid #b0262b', borderRadius: 40, opacity: appear(f, 10, 10)}} />}
            </div>
          );
        })}
        {d.note && <div style={{position: 'absolute', left: 120, top: 128 + facts.length * 64 + 20, opacity: appear(f, 12, 12)}}><Ink text={d.note} size={32} color="#6a5a48" /></div>}
      </Page>
      {/* counter chip */}
      <div style={{position: 'absolute', left: 1480, top: 140, padding: '14px 26px', borderRadius: 18, background: 'rgba(12,14,20,.82)', border: `3px solid ${T.gold}`,
        fontFamily: T.display, fontSize: 40, color: T.gold, transform: `scale(${0.9 + 0.1 * appear(f, 2, 10)})`, whiteSpace: 'nowrap'}}>{counter(real)}</div>
      {d.count !== undefined && d.count !== real && (
        <div style={{position: 'absolute', left: 1480, top: 226, padding: '10px 22px', borderRadius: 16, background: 'rgba(60,10,12,.85)', border: `3px solid ${T.red}`,
          fontFamily: T.display, fontSize: 30, color: '#ffb3b3', whiteSpace: 'nowrap', opacity: appear(f, 8, 10)}}>เขียนไว้ {d.count} ข้อ</div>
      )}
    </Plate>
  );
};
