// Preview: candidate characters (child / elderly woman) running side by side, drawn by the joint rig (cast/Rig.tsx).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CastSprite, type CastId} from './cast/CastSprite';
import {RigBody, rigDrop, rigPlan} from './cast/Rig';
import {ActorView, LAYER_T} from './kit/stage';
import {T} from './engine/theme';
import castJson from './cast.json';

const CANDIDATES: {id: CastId; th: string; sub: string}[] = [
  {id: 'kid-girl' as CastId, th: 'เด็กหญิง', sub: 'kid-girl'},
  {id: 'kid' as CastId, th: 'เด็ก (น้ำเงิน)', sub: 'kid'},
  {id: 'auntie' as CastId, th: 'ป้า', sub: 'auntie'},
  {id: 'grandma' as CastId, th: 'ยาย', sub: 'grandma'},
];

const FLOOR = 800, PX_PER_CM = 3.6, CYCLE = 14; // frames per stride cycle
export const RUN_PREVIEW_FRAMES = 150;

const Runner: React.FC<{sym: CastId; f: number}> = ({sym, f}) => {
  const plan = rigPlan(sym);
  if (!plan) return null;
  const cm = (castJson as Record<string, {cm?: number}>)[sym]?.cm ?? 150;
  const phase = (f / CYCLE) * Math.PI * 2;
  const roster = {x: {cm, symbol: () => sym, vars: {}}};
  const dy = rigDrop(plan, phase, 1, true) * ((cm * PX_PER_CM) / 520);
  return (
    <ActorView a={{who: 'x', x: 240, pose: 'run', face: 'happy'} as any} roster={roster as any} floor={FLOOR} pxPerCm={PX_PER_CM} f={f}
      body={{node: <RigBody plan={plan} phase={phase} dir={1} run />, layerT: LAYER_T[plan.base]}} style={{transform: `translateY(${dy}px)`}} />
  );
};

export const RunPreview: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${T.sky1}, ${T.sky0})`, fontFamily: T.display, color: '#fff'}}>
      <CastSprite />
      <div style={{position: 'absolute', top: 50, width: '100%', textAlign: 'center', fontSize: 64, fontWeight: 700}}>เลือกตัวละครวิ่ง</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR, height: 8, background: 'rgba(255,255,255,.25)'}} />
      {/* ground ticks scroll backwards so the run reads as forward motion */}
      {Array.from({length: 40}).map((_, i) => {
        const x = ((i * 120 - f * 16) % 4800 + 4800) % 4800 - 120;
        return x < 1920 ? <div key={i} style={{position: 'absolute', left: x, top: FLOOR + 30, width: 60, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.12)'}} /> : null;
      })}
      {CANDIDATES.map((c, i) => (
        <div key={c.id} style={{position: 'absolute', left: i * 480, top: 0, width: 480, height: 1080}}>
          <Runner sym={c.id} f={f} />
          <div style={{position: 'absolute', top: 880, width: '100%', textAlign: 'center', fontSize: 56, fontWeight: 700}}>{i + 1}. {c.th}</div>
          <div style={{position: 'absolute', top: 960, width: '100%', textAlign: 'center', fontSize: 34, opacity: 0.7}}>{c.sub}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
