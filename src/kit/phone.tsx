import React from 'react';
import type {ShotProps} from '../engine/episode';
import {appear, kf, rnd} from '../engine/anim';
import {T} from '../engine/theme';
import {Plate} from './stage';
import {Hand} from './inserts';

// A phone held in a hand, full-frame (from rain-night + ghost-money, now shared). One component, the view picks the
// screen; every word on it comes from shot.data so story.json stays the source.
//
//   voice   voice message      data {from, time, dur, playing, pinned}
//   chat    one message        data {from, msg}
//   call    incoming / live    data {from, ringing, live}   (pair the line with fx: "phone")
//   calls   missed calls       data {to, calls}
//   send    files going out    data {files: string[], sent}
//   photo / any other view     the episode draws the picture: <PhoneScene photo={…}>

const box = (x: number, y: number, w: number | string, h: number | string, bg: string, extra?: React.CSSProperties): React.CSSProperties =>
  ({position: 'absolute', left: x, top: y, width: w, height: h, background: bg, ...extra});

export const Wave: React.FC<{f: number; w: number; h: number; play?: number; seed?: number; color?: string}> = ({f, w, h, play = 0, seed = 3, color = '#e6e1d6'}) => (
  <div style={{position: 'relative', width: w, height: h}}>
    {Array.from({length: 40}, (_, i) => {
      const a = 0.2 + rnd(seed, i) * 0.8;
      const on = i / 40 < play;
      const live = on ? 1 + 0.25 * Math.sin(f / 3 + i) : 1;
      return <div key={i} style={box(i * (w / 40), h / 2 - (a * h * live) / 2, w / 40 - 4, a * h * live, on ? T.gold : color, {borderRadius: 3})} />;
    })}
  </div>
);

/** the handset; `children` is the 428×808 screen */
export const Phone: React.FC<{children: React.ReactNode; x?: number; y?: number; s?: number; rot?: number}> = ({children, x = 960, y = 520, s = 1, rot = 0}) => (
  <div style={{position: 'absolute', left: x - 230 * s, top: y - 420 * s, width: 460 * s, height: 840 * s, transform: `rotate(${rot}deg)`}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 60 * s, background: '#121418', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}} />
    <div style={{position: 'absolute', inset: 16 * s, borderRadius: 46 * s, overflow: 'hidden', background: '#0f1726', fontFamily: T.ui, color: T.white}}>
      <div style={{transform: `scale(${s})`, transformOrigin: '0 0', width: 428, height: 808, position: 'relative'}}>{children}</div>
    </div>
  </div>
);

const Avatar: React.FC<{name: string; ring?: number}> = ({name, ring = 0}) => (
  <div style={{position: 'absolute', left: 134, top: 170, width: 160, height: 160, borderRadius: '50%', background: '#3a4a66', color: T.white,
    boxShadow: `0 0 0 ${10 + ring * 30}px rgba(246,196,69,${0.35 * (1 - ring)})`, fontFamily: T.display, fontSize: 80, textAlign: 'center', lineHeight: '160px'}}>
    {name.replace(/^(ลุง|ป้า|ครู|พี่|น้อง)/, '').slice(0, 1) || '?'}
  </div>
);

const Title: React.FC<{t: string; sub?: string; y?: number}> = ({t, sub, y = 380}) => (
  <>
    <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 44}}>{t}</div>
    {sub && <div style={{position: 'absolute', top: y + 66, width: '100%', textAlign: 'center', fontSize: 28, opacity: 0.7}}>{sub}</div>}
  </>
);

/** the standard screens; returns null for a view the episode draws itself */
export function phoneScreen(p: ShotProps, v: string): React.ReactNode {
  const {f, len} = p;
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const name: string = d.from ?? '';
  if (v === 'voice') {
    const play = d.playing ? kf(f, [[0, 0.05], [len, 1]]) : 0;
    return (
      <>
        <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 36}}>{name}</div>
        {d.pinned && <div style={box(130, 118, 168, 40, 'rgba(246,196,69,.2)', {borderRadius: 20, fontSize: 22, textAlign: 'center', lineHeight: '40px', color: T.gold})}>● ปักหมุด</div>}
        <div style={box(28, 330, 372, 190, '#24324c', {borderRadius: 30})}>
          <div style={{position: 'absolute', left: 30, top: 40}}><Wave f={f} w={250} h={90} play={play} seed={(d.time ?? '').length + 3} /></div>
          <div style={box(296, 58, 54, 54, T.gold, {borderRadius: '50%'})}>
            <div style={{position: 'absolute', left: d.playing ? 17 : 20, top: 15, width: d.playing ? 20 : 0, height: 24,
              borderLeft: d.playing ? '6px solid #18202e' : '18px solid #18202e', borderRight: d.playing ? '6px solid #18202e' : undefined,
              borderTop: d.playing ? undefined : '12px solid transparent', borderBottom: d.playing ? undefined : '12px solid transparent', boxSizing: 'border-box'}} />
          </div>
          <div style={{position: 'absolute', left: 30, top: 144, fontSize: 24, opacity: 0.75}}>{d.dur ?? ''}</div>
          <div style={{position: 'absolute', right: 30, top: 144, fontSize: 24, opacity: 0.75}}>{d.time ?? ''}</div>
        </div>
      </>
    );
  }
  if (v === 'chat') {
    return (
      <>
        <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 36}}>{name}</div>
        <div style={box(36, 360, 340, 'auto', '#2a3a5a', {padding: 22, borderRadius: 26, fontSize: 30, lineHeight: 1.4, opacity: appear(f, 6, 10)})}>{d.msg ?? ''}</div>
      </>
    );
  }
  if (v === 'call') {
    const ring = d.ringing ? (f % 30) / 30 : 0;
    return (
      <>
        <Avatar name={name} ring={ring} />
        <Title t={name} sub={d.ringing ? 'สายเรียกเข้า' : 'กำลังสนทนา'} />
        {d.live && <div style={{position: 'absolute', left: 64, top: 560}}><Wave f={f} w={300} h={80} play={1} /></div>}
        {d.ringing && <div style={box(164, 640, 100, 100, T.ok, {borderRadius: '50%', transform: `scale(${1 + 0.06 * Math.sin(f / 3)})`})} />}
      </>
    );
  }
  if (v === 'calls') {
    const n: number = d.calls ?? 10;
    const shown = Math.min(n, Math.ceil(kf(f, [[0, 3], [len * 0.7, Math.min(n, 9)]])));
    return (
      <>
        <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 36}}>ประวัติการโทร</div>
        {Array.from({length: shown}, (_, i) => (
          <div key={i} style={box(30, 140 + i * 66, 368, 56, 'rgba(255,255,255,.06)', {borderRadius: 14, fontSize: 26, lineHeight: '56px', paddingLeft: 20, boxSizing: 'border-box', color: '#ff8f8f'})}>
            ↗ {d.to ?? ''} · ไม่มีผู้รับสาย
          </div>
        ))}
        <div style={box(120, 744, 188, 44, T.red, {borderRadius: 22, textAlign: 'center', lineHeight: '44px', fontSize: 26})}>{n} สาย</div>
      </>
    );
  }
  if (v === 'send') {
    const files: string[] = d.files ?? [];
    const pr = kf(f, [[0, 0], [len * 0.8, 1]]);
    return (
      <>
        <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 36}}>{d.to ?? 'ส่งไฟล์'}</div>
        {files.map((t, i) => {
          const k = Math.min(1, Math.max(0, pr * files.length - i));
          return (
            <div key={t} style={box(40, 170 + i * 130, 348, 100, k >= 1 ? '#2a5a3a' : '#2a3a5a', {borderRadius: 20, padding: '0 24px', boxSizing: 'border-box', fontSize: 28, lineHeight: '100px', overflow: 'hidden'})}>
              {t}<div style={box(0, 90, 348 * k, 10, T.gold)} />
            </div>
          );
        })}
        {d.sent && pr >= 1 && <div style={{position: 'absolute', top: 700, width: '100%', textAlign: 'center', fontSize: 30, color: T.gold}}>ส่งแล้ว ✓✓</div>}
      </>
    );
  }
  return null;
}

/** full-frame phone insert. `photo` draws views the kit does not know (a picture on screen); `sleeve` / `skin` colour the hand */
export const PhoneScene: React.FC<{p: ShotProps; photo?: (v: string) => React.ReactNode; sleeve?: string; skin?: string}> = ({p, photo, sleeve = '#3d5a73', skin = '#dfa67e'}) => {
  const v = p.shot.view ?? 'chat';
  const d = (p.shot.data ?? {}) as Record<string, any>;
  // a phone screen is its own light: never grade the insert darker than a lamp-lit room
  const light = ['dim', 'dark', 'night'].includes(d.light) || !d.light ? 'lamp' : d.light;
  const screen = phoneScreen(p, v) ?? photo?.(v) ?? null;
  const warm = light === 'day' || light === 'morning' || light === 'dawn';
  return (
    <Plate p={p} bg="#0b0d10" light={light} z={[1, 1.05]}>
      <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: warm ? 'linear-gradient(#6a4b31, #3f2c1d)' : 'linear-gradient(#2a2622, #121110)'}} />
      <Hand x={1080} y={760} s={1.4} skin={skin} sleeve={sleeve} mode="grip" flip />
      <Phone>{screen}</Phone>
    </Plate>
  );
};
