import React from 'react';
import {CAST_BUILD} from './CastSprite';

// Jointed bodies for walking and running. The cast symbols are one drawing per pose; here the legs and arms are
// drawn from joint angles every frame (hip → knee → ankle, shoulder → elbow → hand), in the symbol's own frame and
// colour variables, and then the symbol itself goes on top with its standing legs and resting arms hidden
// (--legs-rest, --arm-*-rest). So every head, hairstyle, outfit, face, pose arm and grip prop still lines up.
// Walk maths after what-if-studio's rig.tsx.
//
//   pants / wide: trousers (legs-pants, body-wide): legs swing from the hips, knees fold on the way forward
//   skirt:        bare legs under a skirt (body-skirt, woman, auntie): the skirt stays, the legs move under it
//   kid:          the 200 × 420 kid frame (body-kid, kid-girl): short legs with socks
//   robe:         the monk: feet shuffle under a swaying hem, legs never show
// Which build a symbol uses comes from cast.svg (CAST_BUILD, written by scripts/svg-to-tsx.mjs).

type Build = 'pants' | 'wide' | 'skirt' | 'kid' | 'robe';
type P = {x: number; y: number};
type Seg = {root: P; mid: P; end: P};

type Frame = {
  hip: [number, number]; hipY: number; thigh: number; shin: number; footY: number;
  leg: string; legW: number; shoe: number; shoeH: number; sock?: number;
  sh: [number, number]; shY: number; upper: number; fore: number; armW: number; hand: number;
};

const SKIN = 'var(--skin, #e7b38c)';
const SHIRT = 'var(--shirt, #2f5f8f)';
// joint positions measured off the standing drawings in cast.svg (hips, ankles, shoulders, resting hands)
const FRAMES: Record<Build, Frame> = {
  pants: {hip: [86, 114], hipY: 305, thigh: 98, shin: 97, footY: 500, leg: 'var(--pants, #1d2736)', legW: 28, shoe: 44, shoeH: 26,
    sh: [58, 142], shY: 160, upper: 82, fore: 78, armW: 36, hand: 20},
  wide: {hip: [82, 118], hipY: 305, thigh: 98, shin: 97, footY: 500, leg: 'var(--pants, #3a3a36)', legW: 32, shoe: 48, shoeH: 26,
    sh: [50, 150], shY: 162, upper: 80, fore: 76, armW: 38, hand: 20},
  skirt: {hip: [86, 114], hipY: 305, thigh: 98, shin: 97, footY: 500, leg: SKIN, legW: 24, shoe: 40, shoeH: 24,
    sh: [60, 140], shY: 160, upper: 76, fore: 72, armW: 32, hand: 18},
  kid: {hip: [84, 116], hipY: 300, thigh: 50, shin: 50, footY: 400, leg: SKIN, legW: 26, shoe: 40, shoeH: 24, sock: 26,
    sh: [60, 140], shY: 160, upper: 46, fore: 42, armW: 30, hand: 17},
  robe: {hip: [86, 114], hipY: 305, thigh: 98, shin: 97, footY: 500, leg: 'none', legW: 0, shoe: 0, shoeH: 0,
    sh: [58, 142], shY: 160, upper: 82, fore: 80, armW: 38, hand: 19},
};

/** hand-drawn bodies whose sleeves are not --shirt, or that draw something of their own under the arms */
const LOOK: Record<string, {arm?: string; armW?: number; under?: string; noArmR?: boolean}> = {
  woman: {arm: 'var(--top, #d9c9a8)', under: 'woman-backhair'},
  'lead-female-A': {arm: 'var(--top, #d9c9a8)', under: 'woman-backhair'},
  auntie: {arm: 'var(--top, #d9c9a8)'},
  'aunt-family-B': {arm: 'var(--top, #d9c9a8)'},
  raincoat: {arm: 'var(--coat, #f2c230)', armW: 38},
  elder: {arm: 'var(--exo, #e9e4d6)', noArmR: true}, // the right hand holds his candle in the drawing itself
  'kid-girl': {arm: 'var(--shirt, #e8a0b4)', armW: 28},
  monk: {arm: 'var(--robe, #c8782a)'},
  novice: {arm: 'var(--robe, #de8728)'},
  'maternal-grandmother-A': {arm: SKIN},
};

/** whole-body pose symbols that walk as their standing body */
const BASE: Record<string, string> = {'man-walk': 'man', 'man-run': 'man', 'woman-run': 'woman'};

export type RigPlan = {build: Build; base: string; f: Frame; arm: string; armW: number; under?: string; noArmR?: boolean};

/** the rig for a roster symbol in pose walk / run, or undefined when that body has none (pets, crowd, sit poses) */
export function rigPlan(sym: string): RigPlan | undefined {
  const base = BASE[sym] ?? sym;
  const build = CAST_BUILD[base];
  if (!build) return undefined;
  const f = FRAMES[build], look = LOOK[base] ?? {};
  return {build, base, f, arm: look.arm ?? SHIRT, armW: look.armW ?? f.armW, under: look.under, noArmR: look.noArmR};
}

/** legs that touch the floor (everything but the robe, whose hem hides the stride) */
export const rigHasLegs = (plan: RigPlan | undefined) => !!plan && plan.build !== 'robe';

const rad = (d: number) => (d * Math.PI) / 180;

/** a two-bone limb; angles in screen degrees from straight down, + swings toward +x */
const limb = (root: P, a1: number, a2: number, l1: number, l2: number): Seg => {
  const mid = {x: root.x + Math.sin(rad(a1)) * l1, y: root.y + Math.cos(rad(a1)) * l1};
  return {root, mid, end: {x: mid.x + Math.sin(rad(a2)) * l2, y: mid.y + Math.cos(rad(a2)) * l2}};
};
const d = (s: Seg) => `M${s.root.x.toFixed(1)} ${s.root.y.toFixed(1)} L${s.mid.x.toFixed(1)} ${s.mid.y.toFixed(1)} L${s.end.x.toFixed(1)} ${s.end.y.toFixed(1)}`;

/** Leg angles for one leg at `phase` (the other leg is phase + π): thigh swing and the knee's backward fold. */
const legAngles = (phase: number, run: boolean) => {
  const s = Math.sin(phase);
  const thigh = (run ? 40 : 24) * s;
  const fold = Math.max(0, (run ? 95 : 42) * Math.sin(phase + 1.2)); // the knee folds while the leg travels forward
  return {thigh, shin: thigh - fold};
};

const legsAt = (f: Frame, phase: number, dir: 1 | -1, run: boolean) => {
  const L = legAngles(phase + Math.PI, run), R = legAngles(phase, run);
  return {
    L: limb({x: f.hip[0], y: f.hipY}, dir * L.thigh, dir * L.shin, f.thigh, f.shin),
    R: limb({x: f.hip[1], y: f.hipY}, dir * R.thigh, dir * R.shin, f.thigh, f.shin),
  };
};

/** How far (frame units) the body must drop so the lower foot is on the floor: the walk's natural bob. */
export const rigDrop = (plan: RigPlan, phase: number, dir: 1 | -1, run = false) => {
  if (!rigHasLegs(plan)) return 0;
  const {L, R} = legsAt(plan.f, phase, dir, run);
  return plan.f.footY - Math.max(L.end.y, R.end.y);
};

export type RigProps = {
  plan: RigPlan; phase: number; dir: 1 | -1; run?: boolean;
  /** keep the right arm at rest (it holds a grip prop) */
  holdR?: boolean;
};

const Shoe: React.FC<{s: Seg; dir: 1 | -1; w: number; h: number}> = ({s, dir, w, h}) => {
  // the toe lifts as the foot leaves the ground behind and heel-strikes in front
  const tilt = Math.max(-22, Math.min(22, (Math.atan2(s.end.x - s.mid.x, s.end.y - s.mid.y) * 180) / Math.PI * 0.45));
  return (
    <rect x={s.end.x - w / 2 + dir * 8} y={s.end.y - 10} width={w} height={h} rx={10} fill="var(--shoe, #0f141c)"
      transform={`rotate(${(-tilt).toFixed(1)} ${s.end.x.toFixed(1)} ${s.end.y.toFixed(1)})`} />
  );
};

/** The same mitten as cast.svg's hands, centred on (x, y): local +y runs down the forearm (`ang` = forearm direction
 *  − 90°), the thumb (±1) toward the body's centre line, k = size (1 at a 20-unit adult hand). Shared with cast/Pose.tsx. */
export const Mitten: React.FC<{x: number; y: number; ang: number; k: number; thumb: 1 | -1}> = ({x, y, ang, k, thumb}) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${k})`} fill="var(--skin, #e7b38c)">
    <ellipse cx={thumb * 10} cy={-3} rx={6.2} ry={10} transform={`rotate(${thumb * -30} ${thumb * 10} -3)`} />
    <ellipse cx={0} cy={2} rx={14} ry={16.5} />
  </g>
);

const Arm: React.FC<{seg: Seg; color: string; w: number; hand: number; side: 'l' | 'r'}> = ({seg, color, w, hand, side}) => {
  const len = Math.hypot(seg.end.x - seg.mid.x, seg.end.y - seg.mid.y) || 1;
  const hx = seg.end.x + ((seg.end.x - seg.mid.x) / len) * 10, hy = seg.end.y + ((seg.end.y - seg.mid.y) / len) * 10;
  const ang = (Math.atan2(seg.end.y - seg.mid.y, seg.end.x - seg.mid.x) * 180) / Math.PI - 90;
  const thumb = (100 - hx) * Math.cos(rad(ang)) > 0 ? 1 : -1;
  return (
    <g style={{display: `var(--arm-${side}-rest, inline)`}}>
      <path d={d(seg)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      {/* every arm in cast.svg is a touch lighter than the torso, so one crossing the body still reads */}
      <path d={d(seg)} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <Mitten x={hx} y={hy} ang={ang} k={hand / 20} thumb={thumb} />
    </g>
  );
};

/** arms swing against the legs; elbows bend more on the forward swing; run pumps them bent */
const armsAt = (f: Frame, phase: number, dir: 1 | -1, run: boolean, holdR: boolean) => {
  const s = Math.sin(phase);
  const swing = run ? 38 : 18;
  const bend = (a: number) => (run ? 88 : 8 + 16 * Math.max(0, a / swing));
  const aL = swing * s; // the left arm goes forward with the right leg (the right leg leads at sin > 0)
  const aR = -swing * s;
  // + is forward (toward dir); a small outward splay keeps the arms off the torso. An arm never swings in across
  // the body (side = -1 left, +1 right): past its shoulder it just hangs, which reads as passing behind the body.
  const out = (ang: number, side: number) => (side < 0 ? Math.min(ang, 1) : Math.max(ang, -1));
  const arm = (root: P, a: number, splay: number) => {
    const side = Math.sign(splay);
    return limb(root, out(dir * a + splay, side), out(dir * (a + bend(a)) + splay, side), f.upper, f.fore);
  };
  const shL = {x: f.sh[0], y: f.shY}, shR = {x: f.sh[1], y: f.shY};
  return {L: arm(shL, aL, -5), R: holdR ? limb(shR, 2.2, 2.2, f.upper, f.fore) : arm(shR, aR, 5)};
};

/** the symbol on top with its standing legs and resting arms switched off */
const Top: React.FC<{base: string}> = ({base}) => (
  <g style={{'--legs-rest': 'none', '--arm-l-rest': 'none', '--arm-r-rest': 'none', '--backhair-rest': 'none'} as React.CSSProperties}>
    <use href={`#${base}`} />
  </g>
);

export const RigBody: React.FC<RigProps> = ({plan, phase, dir, run = false, holdR = false}) => {
  const {f} = plan;
  const arms = armsAt(f, phase, dir, run, holdR);
  const armsEl = (
    <>
      <Arm seg={arms.L} color={plan.arm} w={plan.armW} hand={f.hand} side="l" />
      {!plan.noArmR && <Arm seg={arms.R} color={plan.arm} w={plan.armW} hand={f.hand} side="r" />}
    </>
  );
  const under = plan.under && <use href={`#${plan.under}`} />;
  if (plan.build === 'robe') {
    const s = Math.sin(phase);
    const hem = dir * 6 * s;
    const foot = (k: number, base: number) => {
      const fs = Math.sin(phase + k);
      return <ellipse cx={base + dir * 14 * fs} cy={510 - 6 * Math.max(0, Math.cos(phase + k))} rx={22} ry={9} fill="var(--skin-d, #c98f6b)" />;
    };
    return (
      <>
        {under}
        {foot(Math.PI, 80)}{foot(0, 120)}
        <path d={`M58 280 H142 L${152 + hem} 498 H${48 + hem}Z`} fill="var(--robe, #c8782a)" />
        <path d={`M78 300 L${72 + hem * 0.8} 492 M100 300 L${100 + hem * 0.9} 494 M122 300 L${128 + hem} 492`} stroke="var(--robe-d, #a35f1c)" strokeWidth={5} opacity={0.6} />
        {armsEl}
        <Top base={plan.base} />
      </>
    );
  }
  const {L, R} = legsAt(f, phase, dir, run);
  // the leg on the far side of the stride is drawn first and a touch darker, so the two read apart
  const back = Math.sin(phase) * dir > 0 ? 'L' : 'R';
  const leg = (s: Seg, far: boolean) => {
    const sock = f.sock && {x: s.end.x + ((s.mid.x - s.end.x) * f.sock) / f.shin, y: s.end.y + ((s.mid.y - s.end.y) * f.sock) / f.shin};
    return (
      <g style={far ? {filter: 'brightness(.78)'} : undefined}>
        <path d={d(s)} fill="none" stroke={f.leg} strokeWidth={f.legW} strokeLinecap="round" strokeLinejoin="round" />
        {sock && <path d={`M${sock.x.toFixed(1)} ${sock.y.toFixed(1)} L${s.end.x.toFixed(1)} ${s.end.y.toFixed(1)}`} stroke="var(--sock, #f4f4f0)" strokeWidth={f.legW} strokeLinecap="round" />}
        <Shoe s={s} dir={dir} w={f.shoe} h={f.shoeH} />
      </g>
    );
  };
  return (
    <>
      {under}
      {/* arms behind the legs: a hand swinging back passes behind the body, never in front of the hips */}
      {armsEl}
      {back === 'L' ? <>{leg(L, true)}{leg(R, false)}</> : <>{leg(R, true)}{leg(L, false)}</>}
      <Top base={plan.base} />
    </>
  );
};
