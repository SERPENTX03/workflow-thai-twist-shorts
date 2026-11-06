import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {Stage} from '../../kit/stage';
import {roomPxPerCm} from '../../kit/room';
import {RENTED_ROOM, RentedRoom, rentedRoomScreen} from '../../kit/rentedroom';
import {Cctv, cctvFrame} from '../../kit/pov';
import {Grain} from '../../kit/horror';
import {Actors, aimData, C, headOf, PX_CM} from './cast';
import {parseActor} from '../../kit/stage';
import {SalaFeed, type FeedState} from './night';

// ห้องเช่าเจย์ (brief.md → Places): a narrow rented room built once in perspective (room.tsx). Bed along the left
// wall, a folding table with the laptop against the back wall, one window right. The laptop screen is the light at
// night (CH5, CH8); the single ceiling tube in the evening (CH7); grey dawn through the window at the end of CH5.
// Jay sits on the low bed edge at (u .40, w .63), where the room's scale is the cast's (≈3 px/cm), so close-ups aim at
// his real head. The rear-camera file plays full-frame in RearFileScene.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const {ROOM, HIGH, CORNER, BED_EDGE: JAY_AT} = RENTED_ROOM;
const screenAt = rentedRoomScreen;
const RoomSet = RentedRoom;

/** Jay on the bed edge: the story's `jay@…` string moved to his place in the room, never on the bike */
const placeJay = (p: ShotProps): ShotProps => {
  const d = D(p);
  const cast = ((d.cast ?? []) as string[]).map(c => (c.startsWith('jay@') ? c.replace(/^jay@[\d.,]+/, `jay@${JAY_AT.x},${JAY_AT.y}`) : c));
  return {...p, shot: {...p.shot, data: {...d, cast}}};
};

const RoomScene: ShotComponent = p0 => {
  const p = placeJay(p0);
  const pa = {...p, shot: {...p.shot, data: aimData(p, false)}};
  const d = D(pa);
  const v = pa.shot.view ?? 'door-wide';
  const dawn = d.light === 'dawn' ? 1 : d.dawnRim ? 0.6 : 0;
  const tube = d.light === 'lamp';
  const screen = !tube || v === 'screen-ots';
  if (v === 'screen-ots') {
    // over Jay's dark shoulder onto the laptop: the player with its timeline, a cursor scrubbing to the moment
    const k = kf(pa.f, [[0, 0], [pa.len * 0.7, 1]]);
    return (
      <AbsoluteFill style={{background: '#040506', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 360, top: 120, width: 1280, height: 800, background: '#0b0d10', borderRadius: 18, border: '14px solid #1c1e22', boxShadow: '0 0 200px 40px rgba(120,165,235,.22)'}}>
          <div style={{position: 'absolute', left: 30, top: 30, right: 30, bottom: 110, overflow: 'hidden', background: '#000'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(.635)', transformOrigin: '0 0', filter: 'grayscale(.5) contrast(1.15)'}}>
              {d.screen === 'paused-visor' || d.scrub === undefined ? <SalaFeed f={0} state="figure-turn" /> : <SalaFeed f={cctvFrame(pa.f, 3)} state={d.scrub === '02:15:19' ? 'leave' : 'sala-box'} keychain={d.scrub === '02:15:19'} />}
            </div>
          </div>
          <div style={{position: 'absolute', left: 30, right: 30, bottom: 50, height: 12, borderRadius: 6, background: '#2a2d33'}}>
            <div style={{width: `${30 + 40 * k}%`, height: '100%', borderRadius: 6, background: '#e0473c'}} />
          </div>
          <div style={{position: 'absolute', left: 30, bottom: 10, fontFamily: 'monospace', fontSize: 28, color: '#9aa4b2'}}>REAR_0214.MP4 · {d.scrub ?? '02:14:44'}</div>
          <svg width={40} height={50} viewBox="0 0 14 18" style={{position: 'absolute', left: `${30 + 40 * k}%`, bottom: 30}}>
            <path d="M1 1 L1 15 L4.6 11.6 L7.2 17 L9.6 16 L7 10.6 L12 10.6 Z" fill="#fff" stroke="#000" strokeWidth={1} />
          </svg>
        </div>
        {/* Jay's shoulder and head, dark and soft, frame left */}
        <div style={{position: 'absolute', left: -260, top: 300, width: 900, height: 1000, borderRadius: '50% 50% 0 0', background: '#0a1522', filter: 'blur(14px)'}} />
        <div style={{position: 'absolute', left: -40, top: 120, width: 420, height: 460, borderRadius: '50%', background: '#07090c', filter: 'blur(14px)'}} />
        <Grain f={pa.f} opacity={0.14} />
      </AbsoluteFill>
    );
  }
  const r = v === 'ceiling-high' ? HIGH : v === 'window-wide' || v === 'corner-wide' ? CORNER : ROOM;
  // in the high and corner rooms the bed edge sits somewhere else: move Jay with it
  // on the bed edge, feet on the floor just in front of it; against the wall on the mattress for the high / corner views
  const back = v === 'ceiling-high' || v === 'corner-wide';
  const ppc = back ? roomPxPerCm(r, 0.3) : PX_CM;
  const q = back ? r.P(0.3, 0.9, 0.3) : v === 'window-wide' ? r.P(0.62, 1, 0.55) : r === ROOM ? JAY_AT : r.P(0.28, 1, 0.63);
  // up on the mattress the lap sits on its surface (the sit sprite's lap is ≈.22 of his height above his feet)
  const at = {x: q.x, y: q.y + (back ? 0.22 * 170 * ppc : 0)};
  const Hj = 170 * ppc;
  const cast = ((d.cast ?? []) as string[]).map(c => (c.startsWith('jay@') ? c.replace(/^jay@[\d.,]+/, `jay@${Math.round(at.x)},${Math.round(at.y)}`) : c));
  const s = screenAt(r);
  const pp = {...pa, shot: {...pa.shot, data: {...d, cast, ...(v === 'door-wide' ? {cam: [0.92, 0.97, 1080, 540]} : {}), lightAt: tube ? [960, 220] : dawn >= 1 ? [r.P(0.73, 0.35, 0).x, r.P(0.73, 0.35, 0).y] : [s.x, s.y]}}};
  const cams: Record<string, number[]> = {'door-wide': [0.92, 0.97, 900, 540], 'ceiling-high': [1.0, 1.04, 960, 560], 'window-wide': [0.95, 1.0, 1000, 540], 'corner-wide': [0.95, 1.0, 960, 540], 'phone-wide': [0.95, 1.0, 900, 540]};
  return (
    <Stage p={pp} light={tube ? 'lamp' : dawn >= 1 ? 'dawn' : 'dim'} cam={v === 'door-wide' ? [0.92, 0.97, 1080, 540] : d.cam ?? cams[v] ?? [1, 1.04, 960, 540]} world={
      <>
        <RoomSet r={r} p={pa} screen={screen} tube={tube} dawn={dawn} />
        <Actors p={pp} bike={false} pxPerCm={ppc} />
        {/* against the wall on the bed: knees drawn up under the crumpled blanket */}
        {back && <div style={{position: 'absolute', left: at.x - 0.3 * Hj, top: at.y - 0.3 * Hj, width: 0.6 * Hj, height: 0.34 * Hj, borderRadius: '48% 52% 30% 30% / 70% 70% 30% 30%',
          background: 'linear-gradient(170deg, #8494aa, #5a6678 70%)', boxShadow: 'inset -10px -14px 24px rgba(0,0,0,.35)', zIndex: 20}} />}
      </>
    } />
  );
};

// ---------------------------------------------------------------- the file on the laptop, full-frame

const STATE: Record<string, FeedState> = {'full-cctv': 'sala-box', 'bike-ecu': 'bike', 'rider-cctv': 'rider', 'turn-ecu': 'figure-turn', 'wait-cctv': 'wait', 'leave-cctv': 'leave', 'handlebar-ecu': 'leave', 'keychain-ecu': 'leave'};

/** the gloved finger counting the wraps of tape, pixelated as the zoomed file is */
const CountMacro: React.FC<{f: number; len: number}> = ({f, len}) => {
  const n = Math.min(4, 1 + Math.floor(kf(f, [[0, 0], [len * 0.7, 3.99]])));
  const x = 520 + (n - 1) * 260;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#111', imageRendering: 'pixelated'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <rect x="200" y="300" width="1520" height="560" fill="#cfcfcf" />
        {[0, 1, 2, 3].map(i => <rect key={i} x={460 + i * 260} y="290" width="110" height="580" fill="#141414" transform={`rotate(${i === 3 ? 4 : 0} ${515 + i * 260} 580)`} />)}
        {/* the glove: a dark cloth hand from the top, forefinger on the wrap being counted */}
        <path d={`M${x - 140} -40 L${x + 160} -40 L${x + 120} 300 L${x + 30} 380 L${x - 30} 340 Z`} fill="#3a3a3a" />
        <rect x={x - 30} y="300" width="70" height="200" rx="34" fill="#4a4a4a" />
      </svg>
      {/* blocky zoom artefacts */}
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.18) 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
      <div style={{position: 'absolute', left: 60, top: 60, fontFamily: 'monospace', fontWeight: 700, fontSize: 60, color: '#fff'}}>{n}</div>
    </div>
  );
};

/** the file zoomed to 800 % on the dark bike's right handlebar: blocks of pixels, and in them the braid, glowing */
const KeyMacro: React.FC<{f: number; near: boolean}> = ({f, near}) => (
  <div style={{position: 'absolute', inset: 0, background: '#0a0a0b'}}>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <rect x="-40" y="380" width="2000" height="140" fill="#1a1b1d" />
      <rect x="1100" y="360" width="600" height="180" rx="40" fill="#121314" />
      <g transform={`translate(${near ? 960 : 1000} 520) scale(${near ? 1.4 : 0.6})`}>
        <path d="M0 0 q40 60 0 120 q-40 60 0 120 q40 60 0 120" stroke="#7dff6a" strokeWidth="40" fill="none" strokeLinecap="round" />
        <path d="M0 0 q40 60 0 120 q-40 60 0 120 q40 60 0 120" stroke="rgba(125,255,106,.4)" strokeWidth="110" fill="none" strokeLinecap="round" />
      </g>
    </svg>
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.35) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,.35) 2px, transparent 2px)',
      backgroundSize: near ? '40px 40px' : '24px 24px'}} />
  </div>
);

const RearFileScene: ShotComponent = p => {
  const d = D(p);
  const v = p.shot.view ?? 'full-cctv';
  const cam = d.cam as number[] | undefined;
  const z = cam ? cam[0] + (cam[1] - cam[0]) * kf(p.f, [[0, 0], [p.len, 1]]) : 1;
  const paused = !!d.paused;
  const f = paused ? 0 : cctvFrame(p.f, 2);
  const picture = v === 'count-ecu' ? <CountMacro f={p.f} len={p.len} /> : v === 'keychain-ecu' || v === 'handlebar-ecu' ? <KeyMacro f={p.f} near={v === 'keychain-ecu'} /> : (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cam?.[2] ?? 960}px ${cam?.[3] ?? 620}px`, transform: `scale(${Math.max(1, z / 1.6)})`}}>
      <SalaFeed f={f} state={STATE[v] ?? 'sala-box'} keychain={v === 'handlebar-ecu' || v === 'keychain-ecu'} />
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Cctv W={p.W} H={p.H} f={paused ? 0 : p.f} cam="REAR_0214.MP4" time={d.time ?? '02:14:20'} glitch={v === 'keychain-ecu' ? 0.6 : 0.2}>
        <div style={{position: 'absolute', inset: 0, filter: 'brightness(1.25)'}}>{picture}</div>
      </Cctv>
      {paused && (
        <div style={{position: 'absolute', left: 900, top: 470, width: 120, height: 140, display: 'flex', gap: 24}}>
          <div style={{width: 40, height: 140, background: 'rgba(255,255,255,.8)'}} />
          <div style={{width: 40, height: 140, background: 'rgba(255,255,255,.8)'}} />
        </div>
      )}
      {(v === 'keychain-ecu' || v === 'handlebar-ecu') && (
        <div style={{position: 'absolute', left: 60, bottom: 220, fontFamily: 'monospace', fontWeight: 700, fontSize: 40, color: '#e8f0e8'}}>ZOOM {v === 'keychain-ecu' ? '800' : '400'}%</div>
      )}
    </AbsoluteFill>
  );
};

export const ROOMS: Record<string, ShotComponent> = {room: RoomScene, rearfile: RearFileScene};
export {C, rnd};
