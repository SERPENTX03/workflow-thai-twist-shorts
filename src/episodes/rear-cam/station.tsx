import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {Stage, Fore} from '../../kit/stage';
import {Cctv} from '../../kit/pov';
import {GasStation, neonAt, STATION_LIGHT} from '../../kit/gasstation';
import {FLOOR} from '../../kit/world';
import {Haze, Shoulder} from '../../kit/depth';
export {Shoulder};
import {Actors, aimData} from './cast';
import {Motorcycle} from '../../kit/places';

// The gas station (brief.md → Places): one place, many camera positions. The view name says where the camera stands:
//   road-wide · jay-med · jay-close · jay-ecu · chat-close · chat-ecu · chat-low · chat-sil · two-med · two-high
//   over-chat-ots · over-jay-ots · helmet-ots · helmet-high       → front (from the highway)
//   gate-ots · gate-wide                                          → back (from the pumps toward the back gate)
//   canopy-cctv                                                   → the station's own camera, high under the canopy
//   shelf-fif · glass-fif · fridge-close · door-low               → inside the minimart, looking out through the glass
//   pump-fif                                                      → through the hanging hoses
// Inserts drawn in the station's light live in station-inserts (neon, tank, boots, key, handlebar, mirror, seat …).

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const tone = (d: Record<string, any>) => (d.light === 'day' ? 'day' : d.light === 'dawn' ? 'dawn' : 'night');
const neonMode = (d: Record<string, any>) => (d.flicker === 'off' ? 'off' : d.flicker ? 'flick' : 'on');
const gateOf = (d: Record<string, any>) => (d.backGate ?? 'closed') as 'closed' | 'open' | 'opening';

/** hoses hanging in front of the lens */
const Hoses: React.FC = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
    <path d="M140 -40 Q260 420 120 1120" stroke="#050506" strokeWidth="70" fill="none" />
    <path d="M1760 -40 Q1640 500 1820 1120" stroke="#050506" strokeWidth="90" fill="none" />
    <rect x="-40" y="-40" width="2000" height="120" fill="#050506" />
  </svg>
);

const StationWorld: React.FC<{p: ShotProps; back?: boolean; horizon?: number}> = ({p, back, horizon}) => {
  const d = D(p);
  return (
    <>
      <GasStation f={p.f} view={back ? 'back' : 'front'} tone={tone(d)} neon={neonMode(d)} gate={gateOf(d)}
        truck={d.truckPass ? 'pass' : d.truck === 'arrive' ? 'arrive' : d.truck === 'parked' ? 'parked' : undefined} patrol={!!d.patrolCar} horizon={horizon} />
      {tone(d) !== 'day' && <Haze y={620} h={260} f={p.f} a={0.1} />}
      {/* at the station Jay's helmet is off (on the tank, then his lap) until he puts it on to leave (data.helmetOn) */}
      <Actors p={p} rec={d.rec} headlight={!!d.headlight} helmet={!!d.helmetOn || !!d.headlight} />
    </>
  );
};

/** inside the minimart: shelf edges sharp in the foreground, the forecourt through the glass beyond */
const Inside: React.FC<{p: ShotProps}> = ({p}) => {
  const d = D(p);
  const v = p.shot.view ?? '';
  const lit = neonAt(p.f, neonMode(d));
  return (
    <AbsoluteFill style={{background: '#0b0d0c', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, filter: v === 'fridge-close' ? 'blur(9px) brightness(.6)' : 'blur(3px) brightness(.85)'}}>
        <Stage p={{...p, shot: {...p.shot, data: {...d, hud: undefined}}}} world={<StationWorld p={p} />} grain={0} />
      </div>
      {/* the glass: mullions, film, the promo stickers that blur the view (CH7 shot 259) */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <rect x="0" y="0" width="1920" height="70" fill="#0a0b0b" />
        <rect x="0" y="960" width="1920" height="120" fill="#0a0b0b" />
        <rect x="610" y="0" width="22" height="1080" fill="#0a0b0b" />
        <rect x="1290" y="0" width="22" height="1080" fill="#0a0b0b" />
        {!d.clear && [[220, 160, '#e74c3c', 'ลด 20%'], [1500, 220, '#f1c40f', '2 แถม 1'], [880, 120, '#2e86c1', 'ใหม่!']].map(([x, y, c, t], i) => (
          <g key={i} opacity={d.blurBy === 'glass' || v === 'glass-fif' ? 0.85 : 0.5}>
            <rect x={+x} y={+y} width="230" height="120" rx="14" fill={String(c)} />
            <text x={+x + 115} y={+y + 76} textAnchor="middle" fontSize="44" fontWeight="700" fill="#fff" fontFamily="Plex Thai, sans-serif">{t}</text>
          </g>
        ))}
        {!d.clear && <rect x="0" y="0" width="1920" height="1080" fill="rgba(200,220,215,.07)" />}
      </svg>
      {/* the shelf in front of the lens: price tag in focus (shelf-fif) */}
      {(v === 'shelf-fif' || v === 'fridge-close') && (
        <div style={{position: 'absolute', left: -40, top: 700, width: 2000, height: 420, background: 'linear-gradient(#1c1e1e, #0b0c0c)', borderTop: '14px solid #3a3d3c'}}>
          {v === 'shelf-fif' && (
            <div style={{position: 'absolute', left: 720, top: -150, width: 360, height: 150, background: '#f4efe2', border: '6px solid #c0392b', borderRadius: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${60 * lit}px rgba(160,255,200,${0.25 * lit})`}}>
              <div style={{fontFamily: 'Plex Thai, sans-serif', fontSize: 36, color: '#333'}}>สายกล้อง</div>
              <div style={{fontFamily: 'Plex Thai, sans-serif', fontWeight: 700, fontSize: 60, color: '#c0392b'}}>{d.price ? `${d.price}.-` : '290.-'}</div>
            </div>
          )}
          {Array.from({length: 14}, (_, i) => <div key={i} style={{position: 'absolute', left: 30 + i * 140, top: 30, width: 110, height: 150, borderRadius: 10,
            background: ['#3a2020', '#203a2a', '#20283a', '#3a3420'][i % 4], filter: 'blur(8px)'}} />)}
        </div>
      )}
      {v === 'fridge-close' && <div style={{position: 'absolute', left: 0, top: 0, width: 760, height: 1080, background: 'linear-gradient(90deg, rgba(230,245,255,.38), rgba(230,245,255,0))'}} />}
    </AbsoluteFill>
  );
};

export const StationScene: ShotComponent = p0 => {
  const p = {...p0, shot: {...p0.shot, data: aimData(p0)}};
  const d = D(p);
  const v = p.shot.view ?? 'road-wide';
  if (['shelf-fif', 'glass-fif', 'fridge-close'].includes(v)) return <Inside p={p} />;
  if (v === 'back-fif') {
    // through the gap of the zinc gate left ajar: the yard behind the station, the win riders' bikes parked in a row,
    // two of them under tarps, nobody there. Noon sun from the left.
    const n = d.bikes ?? 5;
    return (
      <Stage p={{...p, shot: {...p.shot, data: {...d, cast: []}}}} light="day" world={
        <>
          <GasStation f={p.f} view="back" tone="day" neon="off" gate="closed" />
          {Array.from({length: n}, (_, i) => {
            const x = 420 + i * 270, tarp = i === 1 || i === 3;
            return (
              <React.Fragment key={i}>
                <Motorcycle x={x} y={940} scale={0.72} color={['#2f6b55', '#8a2a22', '#24344a', '#5a5a5a', '#2a2a2e'][i % 5]} helmetOnBike={false} flip={i % 2 === 1} />
                {tarp && <div style={{position: 'absolute', left: x - 150, top: 700, width: 300, height: 230, borderRadius: '40% 40% 12px 12px', background: 'linear-gradient(#3a5a8a, #2a4268)', boxShadow: 'inset -20px -10px 30px rgba(0,0,0,.3)'}} />}
              </React.Fragment>
            );
          })}
        </>
      } fore={
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {[[-40, 560], [1300, 2000]].map(([a, b]) => <rect key={a} x={a} y="-40" width={b - a} height="1160" fill="#6a7072" />)}
          {[[-40, 560], [1300, 2000]].map(([a, b]) => Array.from({length: Math.ceil((b - a) / 40)}, (_, i) => <rect key={a + '-' + i} x={a + i * 40} y="-40" width="14" height="1160" fill="#4a5052" />))}
          <rect x="548" y="-40" width="12" height="1160" fill="rgba(255,240,200,.5)" />
        </svg>
      } foreBlur={5} foreDark={0.45} />
    );
  }
  const back = v === 'gate-ots' || v === 'gate-wide';
  if (v === 'canopy-cctv') {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Cctv W={p.W} H={p.H} f={p.f} cam="CAM 02 · ปั๊ม" time={d.time ?? '01:16:02'}>
          {/* security cameras gain up in the dark: the forecourt reads grey, not black */}
          <div style={{position: 'absolute', inset: 0, filter: 'brightness(1.9) contrast(1.1)'}}>
            <Stage p={{...p, shot: {...p.shot, data: {...d, hud: undefined, cam: d.cam ?? [1, 1, 960, 600]}}}} world={<StationWorld p={p} horizon={300} />} grain={0} light="lamp" />
          </div>
        </Cctv>
      </AbsoluteFill>
    );
  }
  const otsColor = d.ots === 'chat' ? '#8f4320' : d.ots === 'jay' ? '#1b3550' : d.ots === 'teer' ? '#4a3b2c' : '#111';
  const fore = d.ots ? <Shoulder side={d.ots === 'jay' ? 'l' : 'r'} color={otsColor} /> : v === 'pump-fif' ? <Hoses /> : undefined;
  return <Stage p={p} world={<StationWorld p={p} back={back} />} fore={fore} foreBlur={d.ots ? 18 : 10} foreDark={d.ots ? 0.6 : 0.3}
    light={tone(d) === 'day' ? 'day' : tone(d) === 'dawn' ? 'dawn' : 'lamp'} />;
};

export {FLOOR, STATION_LIGHT};
