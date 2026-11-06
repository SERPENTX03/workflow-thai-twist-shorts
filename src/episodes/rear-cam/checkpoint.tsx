import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {Stage} from '../../kit/stage';
import {Checkpoint, BEACON_AT, beaconColor} from '../../kit/checkpoint';
import {Grain} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {Actors, aimData, C, JayBike} from './cast';
import {Shoulder} from './station';

// ด่านปากซอย 11 (brief.md → Places): Teer's checkpoint. The camera stands by the cones (low), over Teer's khaki
// shoulder onto Jay at the barrier (ots), at Teer's eye line watching the tail light go (pov), or wide on the empty
// checkpoint (CH7). Close-ups: the torch beam on the helmet camera, the black notebook, the cutter, the walkie-talkie.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;

/** Teer's black notebook: the rows of plates (`lines` rows above Jay's), the line being written, a red circle */
export const Notebook: React.FC<{f: number; len: number; lines?: number; write?: string; redCircle?: string; margin?: string; recall?: boolean; plateLines?: number}> = ({
  f, len, lines = 6, write, redCircle, margin, recall, plateLines,
}) => {
  const PLATES = ['กท 2087 · 02:04', 'ขม 5512 · 02:11', 'งร 9031 · 01:58', 'จต 4418 · 02:07', 'ฉน 7745 · 02:02', 'ชบ 1290 · 02:09'];
  const jay = plateLines ? Array.from({length: plateLines}, (_, i) => `กข 4471 · ${['02:06', '02:02', '01:51'][i] ?? '02:00'}`) : [];
  const typed = write ? write.slice(0, Math.ceil(write.length * kf(f, [[0, 0.2], [len * 0.7, 1]]))) : '';
  return (
    <div style={{position: 'absolute', left: 300, top: 60, width: 1320, height: 900, background: '#f1ece0', borderRadius: 10, transform: 'rotate(-3deg)',
      boxShadow: '0 30px 60px rgba(0,0,0,.6)', filter: recall ? 'saturate(.3) brightness(.85)' : undefined,
      backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 74px, rgba(60,80,120,.25) 74px 76px)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 90, height: '100%', background: '#141414', borderRadius: '10px 0 0 10px'}} />
      {PLATES.slice(0, lines).map((t, i) => (
        <div key={i} style={{position: 'absolute', left: 140, top: 30 + i * 76, fontFamily: '"Plex Thai", sans-serif', fontSize: 50, color: '#22304a', transform: `rotate(${(rnd(131, i) - 0.5) * 2}deg)`}}>{t}</div>
      ))}
      {jay.map((t, i) => (
        <div key={'j' + i} style={{position: 'absolute', left: 140, top: 30 + (lines + i) * 76, fontFamily: '"Plex Thai", sans-serif', fontSize: 50, color: '#22304a'}}>{t}</div>
      ))}
      {typed && <div style={{position: 'absolute', left: 140, top: 30 + (lines + jay.length) * 76, fontFamily: '"Plex Thai", sans-serif', fontSize: 50, color: '#22304a'}}>{typed}</div>}
      {redCircle && <div style={{position: 'absolute', left: 120, top: 18 + lines * 76, width: 430, height: 90, borderRadius: '50%', border: '7px solid #c0392b', transform: 'rotate(-4deg)'}} />}
      {margin && <div style={{position: 'absolute', left: 600, top: 30 + lines * 76, fontFamily: '"Plex Thai", sans-serif', fontSize: 40, color: '#c0392b'}}>{margin}</div>}
    </div>
  );
};

const Insert: React.FC<{p: ShotProps; children: React.ReactNode; beacon?: boolean}> = ({p, children, beacon = true}) => {
  const bc = beaconColor(p.f);
  return (
    <AbsoluteFill style={{background: '#06070a', overflow: 'hidden'}}>
      {beacon && <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 85% 10%, rgba(${bc},.32), rgba(0,0,0,0) 65%)`}} />}
      <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.05 * kf(p.f, [[0, 0], [p.len, 1]])})`}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)'}} />
      <Grain f={p.f} opacity={0.12} />
    </AbsoluteFill>
  );
};

const CheckpointScene: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const v = p.shot.view ?? 'cones-low';
  const empty = v === 'empty-wide' || d.beacon === 'off';
  if (v === 'notebook-ins') {
    const dawn = d.light === 'dawn';
    return (
      <Insert p={p} beacon={!d.recall && !dawn}>
        <div style={{position: 'absolute', inset: 0, background: dawn ? '#2c2318' : d.recall ? '#0e1218' : '#10141a'}} />
        <div style={{position: 'absolute', inset: 0, transform: d.write && d.plateLines ? 'translateY(-70px)' : undefined}}><Notebook f={p.f} len={p.len} lines={d.lines ?? 6} write={d.write} redCircle={d.redCircle} margin={d.margin} recall={!!d.recall || !!d.past} plateLines={d.plateLines} /></div>
        {/* the torch strapped to his chest lighting the page; at dawn the low sun from the right, no torch */}
        <div style={{position: 'absolute', left: 300, top: 0, width: 1400, height: 1000, borderRadius: '50%', background: dawn ? 'radial-gradient(ellipse at 90% 20%, rgba(255,206,130,.32), rgba(0,0,0,0) 70%)' : 'radial-gradient(ellipse, rgba(255,250,230,.18), rgba(0,0,0,0) 65%)'}} />
        {d.write && <Hand x={1400} y={720} s={1.2} rot={-140} skin="#e8b995" sleeve="#8b7355" mode="grip" />}
        <div style={{position: 'absolute', left: -60, right: -60, top: 800, height: 340, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.78) 55%)'}} />
      </Insert>
    );
  }
  if (v === 'cutter-ecu') {
    const out = d.retract ? 1 - kf(p.f, [[p.len * 0.4, 0], [p.len * 0.8, 1]]) : kf(p.f, [[0, 0.3], [p.len * 0.8, 1]]);
    return (
      <Insert p={p}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: d.past ? 'saturate(.35) sepia(.35)' : undefined}}>
          {/* the box's black tape filling the bottom of the frame, the yellow cutter coming in from the right */}
          <rect x="-40" y="600" width="2000" height="520" fill="#f2efe6" />
          {[0, 1, 2].map(i => <rect key={i} x="-40" y={640 + i * 130} width="2000" height="80" fill="#0c0c0c" />)}
          <rect x="1100" y="420" width="900" height="150" rx="30" fill="#f1c40f" stroke="#7a5a00" strokeWidth="6" />
          {Array.from({length: 8}, (_, i) => <rect key={i} x={1180 + i * 80} y="440" width="12" height="110" fill="#c9a20a" />)}
          <polygon points={`${1100 - out * 420},560 1100,470 1100,560`} fill="#c9ced6" stroke="#6a7078" strokeWidth="4" />
          {[0, 1, 2, 3].map(i => <line key={i} x1={1100 - out * 420 + i * 80} y1="560" x2={1100 - out * 420 + i * 80 + 40} y2="520" stroke="#8a9098" strokeWidth="3" />)}
          {/* the tip pressing a dent into the first wrap */}
          <ellipse cx={1100 - out * 420} cy="644" rx="40" ry="8" fill="rgba(0,0,0,.35)" />
        </svg>
        <div style={{position: 'absolute', left: -60, right: -60, top: 780, height: 360, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.8) 50%)'}} />
      </Insert>
    );
  }
  if (v === 'walkie-ins') {
    return (
      <Insert p={p}>
        <div style={{position: 'absolute', inset: 0, background: '#4a3b2c', filter: d.past ? 'saturate(.35)' : undefined}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* khaki shirt front, the radio clipped on the chest pocket */}
          <path d="M-40 -40 L1960 -40 L1960 1120 L-40 1120 Z" fill="#6f5b44" />
          <path d="M960 -40 L960 1120" stroke="#4a3b2c" strokeWidth="10" />
          <rect x="760" y="260" width="400" height="620" rx="40" fill="#15171a" stroke="#000" strokeWidth="8" />
          <rect x="840" y="160" width="40" height="140" rx="10" fill="#15171a" />
          {Array.from({length: 7}, (_, i) => <rect key={i} x="820" y={340 + i * 40} width="280" height="14" rx="7" fill="#24272c" />)}
          <circle cx="1080" cy="300" r="22" fill={Math.floor(p.f / 6) % 2 ? '#35e06a' : '#0e3a1c'} />
          {Math.floor(p.f / 6) % 2 === 0 && <circle cx="1080" cy="300" r="60" fill="rgba(53,224,106,.3)" />}
        </svg>
      </Insert>
    );
  }
  if (v === 'beam-ins') {
    return (
      <Insert p={p}>
        {/* the torch beam sliding up from the foam box to the helmet camera, the lens flaring */}
        <div style={{position: 'absolute', inset: 0, background: '#08090b'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <rect x="300" y="760" width="560" height="300" rx="20" fill="#e8e4da" />
          {[0, 1, 2].map(i => <rect key={i} x={380 + i * 150} y="760" width="44" height="300" fill="#0e0e0e" />)}
          <ellipse cx="1180" cy="300" rx="520" ry="360" fill="#16181c" />
          <rect x="1060" y="170" width="240" height="160" rx="24" fill="#111316" stroke="#000" strokeWidth="5" />
          <circle cx="1180" cy="250" r="56" fill="#0a1626" stroke="#2a2e35" strokeWidth="10" />
        </svg>
        {(() => {
          const k = kf(p.f, [[0, 0], [p.len * 0.7, 1]]);
          const x = 580 + k * 600, y = 900 - k * 650;
          return (
            <>
              <div style={{position: 'absolute', left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,252,235,.6), rgba(255,252,235,0) 70%)', mixBlendMode: 'screen'}} />
              {k > 0.85 && <div style={{position: 'absolute', left: 1180 - 30, top: 250 - 30, width: 60, height: 60, borderRadius: '50%', background: '#fff', boxShadow: '0 0 80px 40px rgba(255,255,255,.7)'}} />}
            </>
          );
        })()}
      </Insert>
    );
  }
  if (v === 'table-ins') {
    return (
      <Insert p={p} beacon={false}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 0%, rgba(255,170,80,.25), #050608 70%)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <polygon points="200,420 1720,420 1900,820 20,820" fill="#7a7468" />
          <ellipse cx="760" cy="560" rx="120" ry="40" fill="none" stroke="#4a3a2a" strokeWidth="10" opacity=".7" />
          <rect x="1180" y="900" width="260" height="22" rx="11" fill="#1f3a78" transform="rotate(18 1310 911)" />
          <rect x="420" y="480" width="200" height="40" rx="8" fill="#5a544a" opacity=".6" />
        </svg>
      </Insert>
    );
  }
  // the checkpoint itself, from wherever the view stands
  const raise = v === 'teer-low' && /raise/.test(((d.cast ?? []) as string[]).join(' ')) ? kf(p.f, [[p.len * 0.3, 0], [p.len * 0.8, 1]]) : 0;
  const otsColor = d.ots === 'teer' ? '#5a4836' : d.ots === 'jay' ? '#1b3550' : '#111';
  const pov = v === 'teer-pov';
  return (
    <Stage p={p} light="night" world={
      <>
        <Checkpoint f={p.f} empty={empty} raise={raise} />
        {pov ? (
          // Teer's eye line: Jay's red tail light shrinking down the dark soi
          <div style={{position: 'absolute', left: 1040 - kf(p.f, [[0, 0], [p.len, 1]]) * 10, top: 560 - kf(p.f, [[0, 0], [p.len, 1]]) * 60, width: 26, height: 18, borderRadius: 8,
            background: '#ff2a20', boxShadow: '0 0 36px 14px rgba(255,40,30,.55)'}} />
        ) : (
          <Actors p={p} box={d.box !== 'none'} helmeted />
        )}
      </>
    } fore={d.ots ? <Shoulder side={d.ots === 'teer' ? 'r' : 'l'} color={otsColor} /> : pov ? (
      // his notebook coming up into the frame bottom left, the pen moving
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <rect x="140" y="780" width="560" height="380" rx="14" fill="#141414" transform="rotate(-8 420 970)" />
        <rect x="190" y="800" width="460" height="320" rx="6" fill="#d8d2c4" transform="rotate(-8 420 970)" />
      </svg>
    ) : undefined} foreBlur={d.ots ? 18 : 6} foreDark={d.ots ? 0.6 : 0.5} />
  );
};

export const CHECKPOINT: Record<string, ShotComponent> = {checkpoint: CheckpointScene};
export {BEACON_AT, JayBike, C};
