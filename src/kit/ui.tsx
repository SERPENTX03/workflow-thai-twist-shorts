import React from 'react';
import {T} from '../engine/theme';

type Pos = {x?: number; y?: number; w?: number};
const abs = ({x = 0, y = 0, w}: Pos): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w});
type Extra = {style?: React.CSSProperties};

export const Hud: React.FC<{text: string; x?: number; y?: number} & Extra> = ({text, x = 70, y = 90, style}) => (
  <div style={{...abs({x, y}), minWidth: 250, height: 104, borderRadius: 18, background: 'rgba(239,232,218,.94)', color: T.ink, whiteSpace: 'nowrap',
    fontFamily: T.ui, fontWeight: 700, fontSize: 50, display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 22, paddingRight: 26, boxSizing: 'border-box', ...style}}>
    <div style={{width: 44, height: 44, borderRadius: '50%', boxShadow: `inset -12px -6px 0 0 ${T.ink}`}} />
    {text}
  </div>
);

export const Chip: React.FC<{text: string; red?: boolean} & Pos & Extra> = ({text, red, style, ...p}) => (
  <div style={{...abs(p), fontFamily: T.ui, fontWeight: 500, fontSize: 30, lineHeight: '52px', height: 52, padding: '0 22px', borderRadius: 26,
    background: red ? T.red : 'rgba(239,232,218,.95)', color: red ? '#fff' : T.ink, whiteSpace: 'nowrap', ...style}}>{text}</div>
);

export const Tag: React.FC<{text: string; tone?: 'ok' | 'you' | 'warn'} & Pos & Extra> = ({text, tone = 'ok', style, ...p}) => (
  <div style={{...abs(p), display: 'flex', alignItems: 'center', gap: 12, height: 50, padding: '0 20px 0 14px', borderRadius: 25,
    background: 'rgba(246,242,234,.96)', color: T.ink, fontFamily: T.ui, fontWeight: 700, fontSize: 28, whiteSpace: 'nowrap',
    boxShadow: '0 6px 16px rgba(0,0,0,.3)', ...style}}>
    <i style={{width: 18, height: 18, borderRadius: '50%', background: tone === 'you' ? T.gold : tone === 'warn' ? T.red : T.ok}} />
    {text}
  </div>
);

/** cream info card with a red spine */
export const Card: React.FC<{title?: string; children: React.ReactNode} & Pos & Extra> = ({title, children, style, ...p}) => (
  <div style={{...abs(p), background: T.cream, borderRadius: 20, boxShadow: '0 16px 40px rgba(0,0,0,.45)', padding: '34px 44px 38px 56px',
    color: T.ink, fontFamily: T.ui, overflow: 'hidden', ...style}}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: T.red}} />
    {title && <div style={{fontSize: 32, fontWeight: 500, color: 'rgba(24,32,46,.7)', marginBottom: 18}}>{title}</div>}
    {children}
  </div>
);

/** "กฎข้อ 1" + the rule */
export const RuleCard: React.FC<{no: string; lines: string[]} & Pos & Extra> = ({no, lines, style, ...p}) => (
  <div style={{...abs(p), width: 720, padding: '70px 50px 46px', borderRadius: 22, background: T.paper, color: T.ink, textAlign: 'center',
    boxShadow: '0 18px 44px rgba(0,0,0,.4)', borderTop: `12px solid ${T.red}`, ...style}}>
    <div style={{position: 'absolute', left: '50%', top: 18, marginLeft: -95, width: 190, height: 46, lineHeight: '46px', borderRadius: 23,
      background: T.red, color: '#fff', fontFamily: T.ui, fontWeight: 700, fontSize: 28}}>{no}</div>
    <div style={{fontFamily: T.display, fontWeight: 700, fontSize: 66, lineHeight: 1.25}}>
      {lines.map((l, i) => <span key={i} style={{display: 'block'}}>{l}</span>)}
    </div>
  </div>
);

/** a number that matters */
export const Stat: React.FC<{label: string; value: string | number; unit?: string} & Pos & Extra> = ({label, value, unit, style, ...p}) => (
  <div style={{...abs(p), minWidth: 300, padding: '22px 30px 24px', borderRadius: 20, background: T.paper, color: T.ink, fontFamily: T.ui,
    boxShadow: '0 14px 34px rgba(0,0,0,.4)', ...style}}>
    <div style={{fontSize: 30, fontWeight: 500, color: 'rgba(24,32,46,.65)'}}>{label}</div>
    <div>
      <span style={{fontFamily: T.display, fontWeight: 700, fontSize: 96, lineHeight: 1.1}}>{value}</span>
      {unit && <span style={{fontSize: 34, fontWeight: 700, color: T.shirt, marginLeft: 10}}>{unit}</span>}
    </div>
  </div>
);

/** level 0..1 */
export const Meter: React.FC<{level: number; low?: boolean} & Pos & Extra> = ({level, low, style, ...p}) => (
  <div style={{...abs(p), height: 26, borderRadius: 13, background: 'rgba(24,32,46,.15)', overflow: 'hidden', ...style}}>
    <b style={{display: 'block', height: '100%', width: `${Math.max(0, Math.min(1, level)) * 100}%`, borderRadius: 13, background: low ? T.red : T.shirt}} />
  </div>
);

/** rows tick one by one: ticks[i] = 0..1 progress of row i */
export const Checklist: React.FC<{rows: string[]; ticks: number[]} & Pos & Extra> = ({rows, ticks, style, ...p}) => (
  <div style={{...abs(p), padding: '30px 40px', borderRadius: 20, background: T.paper, color: T.ink, fontFamily: T.ui, fontWeight: 700,
    fontSize: 36, boxShadow: '0 14px 34px rgba(0,0,0,.4)', ...style}}>
    {rows.map((r, i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, height: 70}}>
        <div style={{position: 'relative', width: 44, height: 44, borderRadius: 10, border: '4px solid rgba(24,32,46,.35)', flex: 'none'}}>
          <div style={{position: 'absolute', inset: -4, borderRadius: 10, background: T.ok, transform: `scale(${ticks[i] ?? 0})`}}>
            <div style={{position: 'absolute', left: 14, top: 6, width: 12, height: 22, border: 'solid #fff', borderWidth: '0 6px 6px 0', rotate: '45deg'}} />
          </div>
        </div>
        {r}
      </div>
    ))}
  </div>
);
