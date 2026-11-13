import React from 'react';
import {AbsoluteFill} from 'remotion';
import {appear, backOut, kf} from '../engine/anim';
import type {ShotProps} from '../engine/episode';
import {T} from '../engine/theme';
import {Grain} from './horror';

// Landscape end card with a like / subscribe ask: a pointer presses "ถูกใจ", then "ติดตาม", then both stay on.
// Generic buttons (no platform logo). Captions stay in the bottom band, so the card keeps to y < 820.
//
//   {"scene": "endcard", "data": {"step": "like" | "subscribe" | "done", "title": "…", "note": "เรื่องนี้เป็นเรื่องแต่ง …"}}
//   step "like": the pointer presses like during the shot · "subscribe": like already on, presses subscribe · "done": both on

type Step = 'like' | 'subscribe' | 'done';

const LIKE = {x: 640, y: 560};
const SUB = {x: 1280, y: 560};

const Thumb: React.FC<{on: number; size?: number}> = ({on, size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `scale(${1 + 0.25 * Math.sin(Math.PI * on)})`}}>
    <path d="M2 10h4v11H2zM8 21h9.2a2 2 0 0 0 2-1.6l1.6-7.4A2 2 0 0 0 18.8 9.6H14l.8-4.1a1.6 1.6 0 0 0-.4-1.4L13.6 3 8 9z"
      fill={on > 0.5 ? T.white : 'none'} stroke={T.white} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

const Bell: React.FC<{ring: number}> = ({ring}) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{transform: `rotate(${Math.sin(ring * Math.PI * 6) * 18 * (1 - ring)}deg)`, transformOrigin: '50% 10%'}}>
    <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" fill="none" stroke={T.white} strokeWidth={1.8} strokeLinejoin="round" />
  </svg>
);

/** a mouse pointer (arrow) at x, y; `down` 0..1 squashes it for the click */
const Pointer: React.FC<{x: number; y: number; down: number}> = ({x, y, down}) => (
  <svg width={70} height={90} viewBox="0 0 14 18" style={{position: 'absolute', left: x - 8, top: y - 6, transform: `scale(${1 - 0.12 * down})`, transformOrigin: '10% 10%',
    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))'}}>
    <path d="M1 1 L1 15 L4.6 11.6 L7.2 17 L9.6 16 L7 10.6 L12 10.6 Z" fill={T.white} stroke={T.ink} strokeWidth={1} strokeLinejoin="round" />
  </svg>
);

const Ring: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) =>
  t <= 0 || t >= 1 ? null : (
    <div style={{position: 'absolute', left: x - 90 * t, top: y - 90 * t, width: 180 * t, height: 180 * t, borderRadius: '50%',
      border: `4px solid rgba(246,242,234,${0.7 * (1 - t)})`}} />
  );

const Button: React.FC<{x: number; y: number; w: number; on: number; press: number; kind: 'like' | 'sub'}> = ({x, y, w, on, press, kind}) => {
  const base = kind === 'like' ? 'rgba(246,242,234,.10)' : T.red;
  const lit = kind === 'like' ? 'rgba(246,242,234,.24)' : '#3a3a40';
  const label = kind === 'like' ? (on > 0.5 ? 'ถูกใจแล้ว' : 'ถูกใจ') : on > 0.5 ? 'ติดตามแล้ว' : 'ติดตาม';
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - 60, width: w, height: 120, borderRadius: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22,
      background: on > 0.5 ? lit : base, border: '2px solid rgba(246,242,234,.35)', transform: `scale(${1 - 0.06 * press})`,
      boxShadow: kind === 'sub' && on < 0.5 ? '0 12px 40px rgba(229,56,59,.35)' : '0 10px 30px rgba(0,0,0,.35)'}}>
      {kind === 'like' ? <Thumb on={on} /> : on > 0.5 ? <Bell ring={on} /> : null}
      <span style={{fontFamily: T.display, fontWeight: 600, fontSize: 52, color: T.white}}>{label}</span>
    </div>
  );
};

/** press timing inside a shot: pointer travels in, presses at `at`, the button turns on just after */
function pressAt(f: number, at: number) {
  const down = kf(f, [[at - 4, 0], [at, 1], [at + 5, 0]]);
  const on = kf(f, [[at, 0], [at + 8, 1]], backOut(1.6));
  const ring = kf(f, [[at, 0], [at + 18, 1]]);
  return {down, on, ring};
}

export const EndCardScene: React.FC<{p: ShotProps}> = ({p}) => {
  const {f, len} = p;
  const d = (p.shot.data ?? {}) as {step?: Step; title?: string; note?: string};
  const step: Step = d.step ?? 'done';
  const t = appear(f, 4, 18);
  const at = Math.min(Math.round(len * 0.45), 60);
  const like = step === 'like' ? pressAt(f, at) : {down: 0, on: 1, ring: 0};
  const sub = step === 'subscribe' ? pressAt(f, at) : step === 'done' ? {down: 0, on: 1, ring: 0} : {down: 0, on: 0, ring: 0};
  const target = step === 'like' ? LIKE : SUB;
  const from = step === 'like' ? {x: 1500, y: 900} : LIKE;
  const move = kf(f, [[6, 0], [at - 4, 1]]);
  const px = step === 'done' ? SUB.x + 60 : from.x + (target.x - from.x) * move;
  const py = step === 'done' ? SUB.y + 40 : from.y + (target.y - from.y) * move;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a2420 0%, #0c0b0d 70%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: t}}>
        {d.title && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: T.title, fontWeight: 400, fontSize: 80, color: T.white,
            textShadow: '0 6px 30px rgba(0,0,0,.7)'}}>{d.title}</div>
        )}
        <div style={{position: 'absolute', left: 0, right: 0, top: d.title ? 300 : 250, textAlign: 'center', fontFamily: T.ui, fontWeight: 500, fontSize: 34, color: 'rgba(246,242,234,.7)'}}>
          ขอบคุณที่ดูจนจบ
        </div>
        <Button x={LIKE.x} y={LIKE.y} w={440} on={like.on} press={like.down} kind="like" />
        <Button x={SUB.x} y={SUB.y} w={480} on={sub.on} press={sub.down} kind="sub" />
        <Ring x={LIKE.x} y={LIKE.y} t={like.ring} />
        <Ring x={SUB.x} y={SUB.y} t={sub.ring} />
        {step !== 'done' && <Pointer x={px} y={py} down={step === 'like' ? like.down : sub.down} />}
        {d.note && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 740, textAlign: 'center', fontFamily: T.ui, fontSize: 28, color: 'rgba(246,242,234,.5)', opacity: appear(f, 20, 20)}}>
            {d.note}
          </div>
        )}
      </div>
      <Grain f={f} opacity={0.1} />
    </AbsoluteFill>
  );
};
