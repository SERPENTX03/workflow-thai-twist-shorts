import React from 'react';
import {reachLimb, type Limb, type Pose} from './Pose';
import {rigPlan, type RigPlan} from './Rig';

// Whole-body poses drawn on the character's OWN symbol. Sit, crouch and lie used to be separate drawings (man-sit,
// woman-sit, man-crouch, man-lie) in a generic blue shirt, patched per episode with jacket and vest overlays. Here the
// person's own symbol goes through the pose rig (cast/Pose.tsx) with its standing legs off (--legs-rest), so the jacket,
// pockets, uniform, tattoos, hair and face come along on every pose; only the legs below are new. The pose rig tokens
// work on all three: `sit yaw=0.5 armR=hold prop=phone`.
//
//   sit      yaw 0: facing us, thighs coming toward the camera, knees apart, hands on the thighs
//            yaw ≠ 0: three-quarter, thighs run out to the side the person faces, shins hang: the seat reads in silhouette
//   crouch   knees up against the chest, arms around them: against a wall, under a table, behind a door
//   lie      on their back, head to the left of the frame (flip for the right), one knee up, a hand on the stomach
//
// Robes (monk, novice) keep their own drawn sit: a robe has no legs to redraw. Frames: sit and crouch are the symbol's
// own frame with the upper body dropped; lie is 520 × 200 (kid 420 × 200) with the head at the left and the floor at
// the bottom edge. Layer offsets match the old symbols (sit 110, crouch 160) so anything placed by them still lines up.

export type BodyKind = 'sit' | 'crouch' | 'lie';

const isKind = (pose?: string): pose is BodyKind => pose === 'sit' || pose === 'crouch' || pose === 'lie';

/** the pose to draw on this person's own body, or undefined when the pose keeps its own symbol (robes, pets, crowd) */
export const bodyKindOf = (pose: string | undefined, standing: string): BodyKind | undefined => {
  if (!isKind(pose)) return undefined;
  const plan = rigPlan(standing);
  return plan && plan.build !== 'robe' ? pose : undefined;
};

/** how far the upper body comes down in this pose, frame units */
export const bodyDrop = (plan: RigPlan, kind: BodyKind) => {
  if (kind === 'lie') return 0;
  const kid = plan.build === 'kid';
  return kind === 'sit' ? (kid ? 56 : 110) : kid ? 92 : 160;
};

export const bodyFrame = (plan: RigPlan, kind: BodyKind, w: number, h: number): [number, number] =>
  kind === 'lie' ? [plan.build === 'kid' ? 420 : 520, 200] : [w, h];

/** the transform from the frame to the upper body */
export const bodyT = (plan: RigPlan, kind: BodyKind) => (kind === 'lie' ? 'translate(0 234) rotate(-90)' : `translate(0 ${bodyDrop(plan, kind)})`);
/** the transform from the upper body back to the frame (a roster's overlays are placed in the frame) */
export const bodyTInv = (plan: RigPlan, kind: BodyKind) => (kind === 'lie' ? 'rotate(90) translate(-234 0)' : `translate(0 ${-bodyDrop(plan, kind)})`);

/** below this the base symbol's skirt and outfit legs would run through the floor: cut them, the legs below replace them */
export const bodyEnd = (plan: RigPlan, kind: BodyKind) => (kind === 'lie' ? undefined : plan.build === 'skirt' ? 300 : plan.build === 'kid' ? 300 : plan.f.hipY + 14);

/** where the hands rest in this pose, as limbs. Sit: on the thighs. Crouch: around the knees. Lie: near hand on the stomach. */
export const bodyRest = (plan: RigPlan, kind: BodyKind, yaw = 0): Pick<Pose, 'armL' | 'armR'> => {
  const {f} = plan;
  const reach = (side: -1 | 1, x: number, y: number): Limb =>
    reachLimb(side, {x: side < 0 ? f.sh[0] : f.sh[1], y: f.shY}, {x, y}, f.upper, f.fore);
  const kid = plan.build === 'kid';
  if (kind === 'crouch') {
    // around the shins, below the knees: a straighter arm than a hand on the knee, the elbows stay in
    const y = kid ? 262 : 290;
    return {armL: reach(-1, 84, y), armR: reach(1, 116, y)};
  }
  // lying seen from the side the far arm is behind the body: none unless the actor string asks for one
  if (kind === 'lie') return {armL: reach(-1, 112, f.hipY - 58), armR: null};
  const y = f.hipY + (kid ? -2 : 12);
  const s = Math.abs(yaw) < 0.15 ? 0 : Math.sign(yaw);
  return s ? {armL: reach(-1, 100 + s * 36, y + 2), armR: reach(1, 100 + s * 46, y + 2)} : {armL: reach(-1, 76, y), armR: reach(1, 124, y)};
};

const SHADE = 'rgba(0,0,0,.2)';
const line = {fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

const Limb2: React.FC<{d: string; w: number; color: string; shade?: boolean}> = ({d, w, color, shade}) => (
  <>
    <path d={d} stroke={color} strokeWidth={w} {...line} />
    {shade && <path d={d} stroke={SHADE} strokeWidth={w} {...line} />}
  </>
);

const Shoe: React.FC<{x: number; y: number; w: number; h: number; dx?: number}> = ({x, y, w, h, dx = 0}) => (
  <rect x={x - w / 2 + dx} y={y - 6} width={w} height={h} rx={h * 0.42} fill="var(--shoe, #0f141c)" />
);

/** kids keep their socks and (when they have them) their shorts */
const Sock: React.FC<{x: number; y0: number; y1: number; w: number}> = ({x, y0, y1, w}) => (
  <path d={`M${x} ${y0} L${x} ${y1}`} stroke="var(--sock, #f4f4f0)" strokeWidth={w} strokeLinecap="round" />
);

/** Legs of a seated / crouched body in the upper body's coordinates (frame y = local y + drop). Drawn with the body,
 *  in front of the torso and behind the hands. */
export const BodyLegs: React.FC<{plan: RigPlan; kind: BodyKind; yaw?: number}> = ({plan, kind, yaw = 0}) => {
  const {f, build} = plan;
  const drop = bodyDrop(plan, kind);
  const foot = f.footY - drop;
  const kid = build === 'kid', skirt = build === 'skirt';
  const w = f.legW;
  const socks = !!f.sock;

  if (kind === 'crouch') {
    const kneeY = f.hipY - (kid ? 42 : 96), kx: [number, number] = kid ? [78, 122] : [74, 126];
    return (
      <>
        {skirt && <path d={`M58 268 H142 L152 ${foot + 6} H48Z`} fill="var(--skirt, #3b4c5e)" />}
        {kid && <path d={`M60 250 H140 L146 ${foot} H54Z`} fill="var(--shorts, #1f2a4a)" />}
        {kx.map((x, i) => {
          const ankle = x + (i ? 4 : -4);
          return (
            <React.Fragment key={i}>
              <Limb2 d={`M${x} ${kneeY + 8} L${ankle} ${foot}`} w={w + 4} color={f.leg} />
              {socks && <Sock x={ankle} y0={foot - f.sock! + 6} y1={foot} w={w} />}
              <Shoe x={ankle} y={foot + 6} w={f.shoe} h={f.shoeH} dx={i ? 3 : -3} />
              <ellipse cx={x + (i ? 2 : -2)} cy={kneeY} rx={w * 0.95} ry={w * 1.15} fill={f.leg} />
              <path d={`M${x - w * 0.5} ${kneeY - w * 0.72} Q${x} ${kneeY - w * 1.02} ${x + w * 0.5} ${kneeY - w * 0.72}`} stroke="rgba(255,255,255,.09)" strokeWidth={5} {...line} />
            </React.Fragment>
          );
        })}
      </>
    );
  }

  if (kind !== 'sit') return null;
  const s = Math.abs(yaw) < 0.15 ? 0 : Math.sign(yaw);
  const hipY = f.hipY + (kid ? 2 : 6);

  if (s) {
    // three-quarter: both thighs run out toward the way the person faces, the far one shorter and darker
    const reach = kid ? f.thigh * 1.12 : f.thigh * 0.94;
    const leg = (far: boolean) => {
      const kx = 100 + s * reach * (far ? 0.76 : 1), ky = hipY + (far ? 2 : 10);
      const ax = kx - s * (far ? 6 : 2);
      return (
        <g key={far ? 'far' : 'near'} style={far ? {filter: 'brightness(.76)'} : undefined}>
          <Limb2 d={`M${kx} ${ky} L${ax} ${foot}`} w={w} color={f.leg} />
          {socks && <Sock x={ax} y0={foot - f.sock! + 6} y1={foot} w={w} />}
          <Shoe x={ax} y={foot + 6} w={f.shoe + 4} h={f.shoeH} dx={s * 12} />
          {!skirt && <Limb2 d={`M${100 - s * 8} ${hipY - 4} L${kx} ${ky}`} w={w + 8} color={kid ? 'var(--shorts, #1f2a4a)' : f.leg} />}
        </g>
      );
    };
    return (
      <>
        {leg(true)}
        {leg(false)}
        {/* the skirt lies over the thighs to a rounded knee, its hem falling a little below them */}
        {skirt && <path d={`M${100 - s * 40} 288 L${100 + s * 40} 288 L${100 + s * (reach + 4)} ${hipY - 8} Q${100 + s * (reach + 26)} ${hipY + 14} ${100 + s * (reach + 8)} ${hipY + 40} L${100 - s * 48} ${hipY + 32} Z`} fill="var(--skirt, #3b4c5e)" />}
      </>
    );
  }

  // facing us: thighs foreshortened toward the camera, knees apart, shins straight down, feet a little out
  const kneeY = hipY + (kid ? 22 : 44);
  const kx: [number, number] = [f.hip[0] - (kid ? 8 : 14), f.hip[1] + (kid ? 8 : 14)];
  return (
    <>
      {kx.map((x, i) => {
        const ankle = x + (i ? 2 : -2);
        return (
          <React.Fragment key={i}>
            <Limb2 d={`M${x} ${kneeY} L${ankle} ${foot}`} w={w + 1} color={f.leg} shade />
            {socks && <Sock x={ankle} y0={foot - f.sock! + 6} y1={foot} w={w} />}
            <Shoe x={ankle} y={foot + 6} w={f.shoe + 2} h={f.shoeH} dx={i ? 3 : -3} />
          </React.Fragment>
        );
      })}
      {skirt ? (
        <path d={`M58 288 H142 L${kx[1] + w + 2} ${kneeY + 4} Q100 ${kneeY + 22} ${kx[0] - w - 2} ${kneeY + 4} Z`} fill="var(--skirt, #3b4c5e)" />
      ) : (
        <>
          {f.hip.map((h, i) => <Limb2 key={i} d={`M${h} ${hipY} L${kx[i]} ${kneeY}`} w={w + 16} color={kid ? 'var(--shorts, #1f2a4a)' : f.leg} />)}
          {kx.map((x, i) => <path key={i} d={`M${x - w * 0.55} ${kneeY - w * 0.36} Q${x} ${kneeY - w * 0.72} ${x + w * 0.55} ${kneeY - w * 0.36}`} stroke="rgba(255,255,255,.09)" strokeWidth={5} {...line} />)}
          <path d={`M100 ${hipY + 4} V${kneeY + 8}`} stroke="rgba(0,0,0,.28)" strokeWidth={3} />
        </>
      )}
      {skirt && <path d={`M${kx[0] - w + 4} ${kneeY + 2} Q100 ${kneeY + 18} ${kx[1] + w - 4} ${kneeY + 2}`} stroke="rgba(0,0,0,.22)" strokeWidth={4} {...line} />}
    </>
  );
};

/** Legs of a lying body, behind the torso. Local coordinates: +x is up on the screen, +y runs from the head to the feet. */
export const LieLegs: React.FC<{plan: RigPlan}> = ({plan}) => {
  const {f, build} = plan;
  const w = f.legW;
  const hipY = f.hipY, full = f.thigh + f.shin;
  const shoe = (x: number, y: number) => (
    <rect x={x - f.shoeH * 0.6} y={y - 6} width={f.shoe + 10} height={f.shoeH} rx={f.shoeH * 0.42} fill="var(--shoe, #0f141c)" />
  );
  // one knee up: hip → knee out toward the ceiling → ankle back on the bed
  const kneeX = 100 + f.thigh * 0.72, kneeY = hipY + f.thigh * 0.62, ankleUpY = hipY + full * 0.8;
  const ankleY = hipY + full;
  const sock = (x: number, y: number) => f.sock && <path d={`M${x} ${y - f.sock + 6} L${x} ${y}`} stroke="var(--sock, #f4f4f0)" strokeWidth={w} strokeLinecap="round" />;
  return (
    <>
      <g style={{filter: 'brightness(.78)'}}>
        <path d={`M${f.hip[1]} ${hipY} L${kneeX} ${kneeY} L${f.hip[1] + 4} ${ankleUpY}`} stroke={f.leg} strokeWidth={w + 2} {...line} />
        {sock(f.hip[1] + 4, ankleUpY)}
        {shoe(f.hip[1] + 4, ankleUpY)}
      </g>
      <path d={`M${f.hip[0]} ${hipY} L${f.hip[0] + 2} ${ankleY}`} stroke={f.leg} strokeWidth={w + 2} {...line} />
      {sock(f.hip[0] + 2, ankleY)}
      {shoe(f.hip[0] + 2, ankleY)}
      {build === 'kid' && <path d={`M${f.hip[0]} ${hipY - 6} L${f.hip[0]} ${hipY + 14}`} stroke="var(--shorts, #1f2a4a)" strokeWidth={w + 6} {...line} />}
    </>
  );
};
