import React from 'react';

// Jointed bodies for walking and running. The cast symbols are one drawing per pose; here the legs and arms are
// drawn from joint angles every frame (hip → knee → ankle, shoulder → elbow → hand), in the same 200 × 520 frame
// and colour variables as the symbols, with the symbol's own torso and head parts on top. So faces, accessories,
// pose arms and grip props from stage.tsx still line up. Walk maths after what-if-studio's rig.tsx.
//
//   pants: the man family (man, man-walk, man-run): legs swing from the hips, knees fold on the way forward
//   robe:  the monk: feet shuffle under a swaying hem, legs never show

export type RigPlan = 'pants' | 'robe';

/** which symbols have a rig for walk / run */
export const RIG_PLAN: Record<string, RigPlan> = {man: 'pants', 'man-walk': 'pants', 'man-run': 'pants', monk: 'robe'};

type P = {x: number; y: number};
type Seg = {root: P; mid: P; end: P};
const rad = (d: number) => (d * Math.PI) / 180;

/** a two-bone limb; angles in screen degrees from straight down, + swings toward +x */
const limb = (root: P, a1: number, a2: number, l1: number, l2: number): Seg => {
  const mid = {x: root.x + Math.sin(rad(a1)) * l1, y: root.y + Math.cos(rad(a1)) * l1};
  return {root, mid, end: {x: mid.x + Math.sin(rad(a2)) * l2, y: mid.y + Math.cos(rad(a2)) * l2}};
};
const d = (s: Seg) => `M${s.root.x.toFixed(1)} ${s.root.y.toFixed(1)} L${s.mid.x.toFixed(1)} ${s.mid.y.toFixed(1)} L${s.end.x.toFixed(1)} ${s.end.y.toFixed(1)}`;

// man body (cast.svg: man-walk): hips at y 305, ankles at 500, shoulders at y 160, hands at 320
const HIP_L = {x: 86, y: 305}, HIP_R = {x: 114, y: 305};
const THIGH = 98, SHIN = 97, FOOT_Y = 500;
const SH_L = {x: 58, y: 160}, SH_R = {x: 142, y: 160};
const UPPER = 82, FORE = 78;

/** Leg angles for one leg at `phase` (the other leg is phase + π): thigh swing and the knee's backward fold. */
const legAngles = (phase: number, run: boolean) => {
  const s = Math.sin(phase);
  const thigh = (run ? 40 : 24) * s;
  const fold = Math.max(0, (run ? 95 : 42) * Math.sin(phase + 1.2)); // the knee folds while the leg travels forward
  return {thigh, shin: thigh - fold};
};

const legsAt = (phase: number, dir: 1 | -1, run: boolean) => {
  const L = legAngles(phase + Math.PI, run), R = legAngles(phase, run);
  return {
    L: limb(HIP_L, dir * L.thigh, dir * L.shin, THIGH, SHIN),
    R: limb(HIP_R, dir * R.thigh, dir * R.shin, THIGH, SHIN),
  };
};

/** How far (frame units) the body must drop so the lower foot is on the floor: the walk's natural bob. */
export const rigDrop = (plan: RigPlan, phase: number, dir: 1 | -1, run = false) => {
  if (plan !== 'pants') return 0;
  const {L, R} = legsAt(phase, dir, run);
  return FOOT_Y - Math.max(L.end.y, R.end.y);
};

export type RigProps = {
  plan: RigPlan; phase: number; dir: 1 | -1; run?: boolean;
  /** keep the right arm at rest (it holds a grip prop) */
  holdR?: boolean;
};

const Shoe: React.FC<{s: Seg; dir: 1 | -1}> = ({s, dir}) => {
  // the toe lifts as the foot leaves the ground behind and heel-strikes in front
  const tilt = Math.max(-22, Math.min(22, (Math.atan2(s.end.x - s.mid.x, s.end.y - s.mid.y) * 180) / Math.PI * 0.45));
  return (
    <rect x={s.end.x - 22 + dir * 8} y={s.end.y - 10} width={44} height={26} rx={10} fill="var(--shoe, #0f141c)"
      transform={`rotate(${(-tilt).toFixed(1)} ${s.end.x.toFixed(1)} ${s.end.y.toFixed(1)})`} />
  );
};

const Arm: React.FC<{seg: Seg; color: string; w: number; hand: number; side: 'l' | 'r'}> = ({seg, color, w, hand, side}) => {
  const len = Math.hypot(seg.end.x - seg.mid.x, seg.end.y - seg.mid.y) || 1;
  const hx = seg.end.x + ((seg.end.x - seg.mid.x) / len) * 10, hy = seg.end.y + ((seg.end.y - seg.mid.y) / len) * 10;
  return (
    <g style={{display: `var(--arm-${side}-rest, inline)`}}>
      <path d={d(seg)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r={hand} fill="var(--skin, #e7b38c)" />
    </g>
  );
};

/** arms swing against the legs; elbows bend more on the forward swing; run pumps them bent */
const armsAt = (phase: number, dir: 1 | -1, run: boolean, holdR: boolean, sh: [P, P], up = UPPER, fore = FORE) => {
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
    return limb(root, out(dir * a + splay, side), out(dir * (a + bend(a)) + splay, side), up, fore);
  };
  return {L: arm(sh[0], aL, -5), R: holdR ? limb(sh[1], 2.2, 2.2, up, fore) : arm(sh[1], aR, 5)};
};

export const RigBody: React.FC<RigProps> = ({plan, phase, dir, run = false, holdR = false}) => {
  if (plan === 'robe') {
    const s = Math.sin(phase);
    const hem = dir * 6 * s;
    const foot = (k: number, base: number) => {
      const fs = Math.sin(phase + k);
      return <ellipse cx={base + dir * 14 * fs} cy={510 - 6 * Math.max(0, Math.cos(phase + k))} rx={22} ry={9} fill="var(--skin-d, #c98f6b)" />;
    };
    const arms = armsAt(phase, dir, false, holdR, [SH_L, SH_R], 82, 80);
    return (
      <>
        {foot(Math.PI, 80)}{foot(0, 120)}
        <path d={`M58 280 H142 L${152 + hem} 498 H${48 + hem}Z`} fill="var(--robe, #c8782a)" />
        <path d={`M78 300 L${72 + hem * 0.8} 492 M100 300 L${100 + hem * 0.9} 494 M122 300 L${128 + hem} 492`} stroke="var(--robe-d, #a35f1c)" strokeWidth={5} opacity={0.6} />
        <Arm seg={arms.L} color="var(--robe, #c8782a)" w={38} hand={19} side="l" />
        <Arm seg={arms.R} color="var(--robe, #c8782a)" w={38} hand={19} side="r" />
        <use href="#monk-robe-body" /><use href="#monk-head" /><use href="#eyes-dot" />
      </>
    );
  }
  const {L, R} = legsAt(phase, dir, run);
  // the leg on the far side of the stride is drawn first and a touch darker, so the two read apart
  const back = Math.sin(phase) * dir > 0 ? 'L' : 'R';
  const leg = (s: Seg, far: boolean) => (
    <g style={far ? {filter: 'brightness(.78)'} : undefined}>
      <path d={d(s)} fill="none" stroke="var(--pants, #1d2736)" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <Shoe s={s} dir={dir} />
    </g>
  );
  const arms = armsAt(phase, dir, run, holdR, [SH_L, SH_R]);
  return (
    <>
      {/* arms behind the legs: a hand swinging back passes behind the body, never in front of the hips */}
      <Arm seg={arms.L} color="var(--shirt, #2f5f8f)" w={36} hand={20} side="l" />
      <Arm seg={arms.R} color="var(--shirt, #2f5f8f)" w={36} hand={20} side="r" />
      {back === 'L' ? <>{leg(L, true)}{leg(R, false)}</> : <>{leg(R, true)}{leg(L, false)}</>}
      <use href="#torso-shirt" /><use href="#head-short" /><use href="#eyes-dot" />
    </>
  );
};
