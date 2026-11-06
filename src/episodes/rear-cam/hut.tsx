import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {kf, rnd} from '../../engine/anim';
import {Stage} from '../../kit/stage';
import {full, FLOOR} from '../../kit/world';
import {CemeteryRoad, Grave, Tamarind} from '../../kit/cemetery';
import {CaretakerHut, Dapple, hutAt, HutBench, PressureLantern, Raincoat, SunRake} from '../../kit/hut';
import {Grain} from '../../kit/horror';
import {Actors, aimData} from './cast';
import {Shoulder} from './station';

// ลุงเหม's hut at the edge of the cemetery (CH6, brief.md → Places): built once at the people's scale (kit/hut.tsx),
// the door where Hem stands at x ≈ 1200, the bamboo bench out front at x ≈ 1650 where he sits, Jay in the yard at
// x 700. Hard sun from upper left (data.lightAt [180, 120]): short shadows to the right, the eave's band of shade
// across the wall, sun spots through the big tree. The wide and the imagined night (214) use the same hut small.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const HUT = {x: 1260, y: FLOOR, s: 1.07};
const G = hutAt(HUT.x, HUT.y, HUT.s);
const HEM_INK = '#26304a';
const SUN = 'radial-gradient(ellipse at 0% 0%, rgba(255,246,215,.55), rgba(0,0,0,0) 70%)';

/** Hem sitting is Hem on the bench; walking views are seen from behind */
const stage = (p: ShotProps): ShotProps => {
  const d = D(p);
  const v = p.shot.view ?? '';
  const cast = ((d.cast ?? []) as string[]).map(c => {
    let s = c;
    if (/^hem@/.test(s) && /\bsit\b/.test(s)) s = s.replace(/^hem@[\d.,]+/, `hem@${Math.round(G.bench.x)}`);
    if (v === 'walk-wide') s = s.replace(/\bwalk\b/, 'back');
    return s;
  });
  return {...p, shot: {...p.shot, data: {...d, cast, ...(v === 'over-hem-ots' ? {ots: 'hem'} : {})}}};
};

const Yard: React.FC<{p: ShotProps; night?: boolean}> = ({p, night}) => (
  <>
    <div style={full(night ? 'linear-gradient(#020306, #070b16 60%, #0e1424)' : 'linear-gradient(#9cc0dc, #e8eee8)')} />
    {/* the cemetery behind: pale graves in rows, a far tamarind, the chedi spire of the sala's temple */}
    <Tamarind x={260} y={690} s={0.7} tone={night ? 'night' : 'day'} seed={21} />
    <div style={{position: 'absolute', left: -700, top: 640, width: 3320, height: 900, background: night ? 'linear-gradient(#07080a, #121210)' : 'linear-gradient(#9a9670, #7e7656)'}} />
    {Array.from({length: 9}, (_, i) => <Grave key={i} x={-60 + i * 110 + rnd(41, i) * 40} y={700 + (i % 3) * 22} s={0.42 + (i % 3) * 0.06} tone={night ? 'night' : 'day'} lean={(rnd(42, i) - 0.5) * 10} kind={i} />)}
    {/* the big tree over the hut: its crown fills the top of the frame */}
    <Tamarind x={1500} y={760} s={2.0} tone={night ? 'night' : 'day'} seed={23} />
    {/* the packed-earth yard, a worn path to the door */}
    <svg width={1920} height={500} viewBox="0 640 1920 500" style={{position: 'absolute', left: 0, top: 640}}>
      <path d="M-40 1100 Q500 940 1080 935 L1320 935 Q900 1000 700 1120 Z" fill={night ? '#16140f' : '#b4a27a'} opacity=".8" />
    </svg>
  </>
);

const HutWorld: React.FC<{p: ShotProps}> = ({p}) => (
  <>
    <Yard p={p} />
    <CaretakerHut x={HUT.x} y={HUT.y} s={HUT.s} tone="day" line={false} />
    <HutBench x={G.bench.x} y={HUT.y + 8} s={1.05} />
    <Dapple f={p.f} x={-100} y={840} w={2100} h={260} seed={5} a={0.35} />
    <Actors p={p} bike={false} />
    <SunRake />
  </>
);

const Plate: React.FC<{p: ShotProps; children: React.ReactNode; bg: string; glow?: string; z?: number}> = ({p, children, bg, glow, z = 1.05}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
    {glow && <div style={{position: 'absolute', inset: 0, background: glow}} />}
    <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + (z - 1) * kf(p.f, [[0, 0], [p.len, 1]])})`}}>{children}</div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,.45) 100%)'}} />
    <Grain f={p.f} opacity={0.1} />
  </AbsoluteFill>
);

const HutScene: ShotComponent = p0 => {
  const ps = stage(p0);
  const p = {...ps, shot: {...ps.shot, data: aimData(ps, false)}};
  const d = D(p);
  const v = p.shot.view ?? 'hut-wide';

  if (v === 'hut-wide' || v === 'night-lantern-wide') {
    // the hut small under its tree, the cemetery around it; at night (Hem's story) only the lantern's pool
    const night = v === 'night-lantern-wide';
    const s = 0.62, x = 1180, y = 860;
    const g = hutAt(x, y, s);
    return (
      <Stage p={{...p, shot: {...p.shot, data: {...d, cam: d.cam ?? [1, 1.04, 960, 540], ...(night ? {hud: undefined} : {})}}}} light={night ? 'night' : 'day'} world={
        <>
          <Yard p={p} night={night} />
          <CaretakerHut x={x} y={y} s={s} tone={night ? 'night' : 'day'} door={night ? 'closed' : 'open'} lantern={night ? 1 : 0} />
          <HutBench x={g.bench.x} y={y + 6} s={0.62} tone={night ? 'night' : 'day'} />
          {night && <div style={{position: 'absolute', left: g.lantern.x - 520, top: g.lantern.y - 200, width: 1040, height: 760, borderRadius: '50%', mixBlendMode: 'screen',
            background: 'radial-gradient(ellipse, rgba(255,200,110,.55), rgba(255,190,90,.18) 40%, rgba(0,0,0,0) 68%)'}} />}
          {!night && <Dapple f={p.f} x={400} y={820} w={1500} h={200} seed={9} a={0.3} />}
          {!night && <Actors p={p} bike={false} floor={900} pxPerCm={1.9} />}
          {!night && <SunRake a={0.8} />}
        </>
      } />
    );
  }

  if (v === 'lantern-ins') {
    // the lantern hung from the eave, close: soot on the globe, a new black wick, sun spots sliding over the glass
    return (
      <Plate p={p} bg="#5a6a5a" glow={SUN}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#7a5a3a 0 22%, #4a3826 22% 26%, #8a6a48 26%)', filter: 'blur(10px)'}} />
        <div style={{position: 'absolute', left: -40, top: 0, width: 2000, height: 240, background: 'repeating-linear-gradient(90deg, #8a9092 0 44px, #6a7072 44px 60px)'}} />
        <div style={{position: 'absolute', left: -40, top: 220, width: 2000, height: 26, background: '#5a3a22'}} />
        <PressureLantern x={960} y={250} s={3.6} lit={0} tone="day" />
        <Dapple f={p.f} x={700} y={400} w={520} h={500} n={9} seed={3} a={0.55} flat={0.8} />
      </Plate>
    );
  }

  if (v === 'raincoat-ins') {
    return (
      <Plate p={p} bg="#3a2a1c" glow={SUN} z={1.06}>
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, #8a6a48 0 150px, #5a4230 150px 160px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(20,14,8,.5), rgba(20,14,8,0) 40%)'}} />
        <Raincoat x={960} y={20} s={2.6} logo={d.logo ?? 'มูลนิธิ'} tag />
      </Plate>
    );
  }

  if (v === 'limp-ins') {
    // Hem's right leg, low on the dry earth: the indigo trouser leg, the knee turned in, the foot dragging a groove
    const k = kf(p.f, [[0, 0], [p.len, 1]]);
    return (
      <Plate p={p} bg="#b4a27a" glow={SUN} z={1.03}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#8a9a7a 0 18%, #c8b48a 30%, #a8946a)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 60}, (_, i) => <circle key={i} cx={rnd(51, i) * 1920} cy={320 + rnd(52, i) * 760} r={2 + rnd(53, i) * 6} fill="rgba(90,70,40,.35)" />)}
          {/* the drag mark behind the foot, a long groove for every step */}
          <path d={`M-40 900 Q${500 + k * 200} 880 ${880 + k * 260} 868`} stroke="rgba(90,66,36,.55)" strokeWidth="26" fill="none" strokeLinecap="round" />
          <g transform={`translate(${k * 260} 0)`}>
            <ellipse cx="960" cy="900" rx="210" ry="26" fill="rgba(40,28,14,.35)" />
            <path d="M840 -40 L1110 -40 L1090 520 Q1050 640 1000 700 L860 700 Q880 600 870 520 Z" fill={HEM_INK} />
            <path d="M880 120 Q960 160 1080 120 M870 380 Q960 420 1090 380" stroke="#1a2036" strokeWidth="10" fill="none" />
            <path d="M870 690 L1010 690 Q1040 760 1020 830 L800 870 Q760 860 780 820 Z" fill="#c48e68" />
            <path d="M770 850 L1030 820 L1040 880 L760 900 Z" fill="#3a2a1a" />
          </g>
          {/* the bamboo cane jabbing the earth beside it */}
          <path d={`M${1380 - k * 40} -40 L${1330 + k * 120} 900`} stroke="#c8b070" strokeWidth="30" strokeLinecap="round" />
          {[200, 420, 640].map(y => <path key={y} d={`M${1360 - (y / 940) * 30} ${y} l30 0`} stroke="#8a7240" strokeWidth="10" />)}
        </svg>
      </Plate>
    );
  }

  if (v === 'walk-wide') {
    // from behind on the dirt path between the graves: Hem ahead with his cane, Jay a step behind, sun spots under the tree
    const cast = ((d.cast ?? []) as string[]).map(c => c.replace(/^hem@[\d.,]+/, 'hem@1040,850').replace(/^jay@[\d.,]+/, 'jay@760,990'));
    const pw = {...p, shot: {...p.shot, data: {...d, cast}}};
    return (
      <Stage p={pw} light="day" world={
        <>
          <CemeteryRoad f={p.f} tone="day" horizon={520} vx={1060} fog={false} />
          <Dapple f={p.f} x={300} y={700} w={1400} h={380} seed={13} a={0.4} />
          <Actors p={pw} bike={false} />
          <SunRake />
        </>
      } />
    );
  }

  // the people's scale: door, raincoat, Hem, Jay
  const ots = v === 'over-hem-ots';
  const camFor: Record<string, number[]> = {'raincoat-fif': [1.7, 1.78, G.raincoat.x, G.raincoat.y + 150]};
  const fore = v === 'raincoat-fif' ? (
    // the slats of the fence in front of the lens, sunlit edges
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {[-120, 300, 1300, 1720].map(x => <rect key={x} x={x} y="-40" width="260" height="1160" fill="#2a2016" />)}
      {[-120, 300, 1300, 1720].map(x => <rect key={'e' + x} x={x + 250} y="-40" width="10" height="1160" fill="rgba(255,236,190,.4)" />)}
    </svg>
  ) : ots ? <Shoulder side="r" color={HEM_INK} /> : v === 'door-low' ? (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><rect x="-40" y="960" width="2000" height="160" fill="#2a1c10" /></svg>
  ) : undefined;
  const pp = camFor[v] ? {...p, shot: {...p.shot, data: {...d, cam: camFor[v]}}} : p;
  return <Stage p={pp} light="day" world={<HutWorld p={pp} />} fore={fore} foreBlur={ots ? 18 : v === 'raincoat-fif' ? 12 : 6} foreDark={ots ? 0.6 : 0.4} />;
};

export const HUT_SCENES: Record<string, ShotComponent> = {hut: HutScene};
