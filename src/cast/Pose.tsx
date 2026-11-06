import React from 'react';
import {CAST_PARTS} from './CastSprite';
import {Mitten, rigPlan, type RigPlan} from './Rig';
import {clamp, easeInOut, lerp} from '../engine/anim';

// The pose rig: a cast symbol that turns three-quarter and acts with its arms, after what-if-studio's rig.tsx
// (yaw / arm angles / head tilt / look, faces that swap through a blink, keyed poses), adapted to our drawn cast.
// Nothing is redrawn: the character's own symbol is drawn in passes, each with some parts switched off by the
// display:var(--x-rest) switches in cast.svg, and each pass moves its own way as the figure turns:
//
//   back hair   <id>--backhair            slides back (the hair mass stays behind as the face turns)
//   far arm     jointed, behind the body
//   body        the symbol below the neck, arms / head off: narrows, and a darker copy peeks out on the trailing
//               side as the turned-away side plane. Outfit (acc-*), jacket, collar, pocket all come along.
//   near arm    jointed, in front (a hand crossing the chest is always in front)
//   head        rotates on the neck by headTilt:
//                 far ear (behind the skull) · skull <id>--skull · hair <id>--hair (slides back) ·
//                 near ear (slides in) · face pass = the symbol above the neck with skull / hair / ears off:
//                 eyes, brows, mouth, moles, smile lines, glasses, face-* / talk-* layers, slid toward the turn
//   hat         caps and hats with the skull
//   arms at the face   a hand on the mouth / cheek is drawn over the head
//
// The parts come from scripts/svg-to-tsx.mjs (CAST_PARTS). A hand-drawn head without them (elder, monk, novice,
// aunt-family-B) turns as one piece. Arms reuse the walk rig's frame (cast/Rig.tsx FRAMES: shoulders, bone lengths,
// sleeve colour, short sleeves, tattoos and bracelets ride on the forearm, the wristwatch on the left wrist).
//
// Angles (what-if convention): Limb {a, b}. a = the upper arm, degrees from hanging straight down, + swings OUT to
// that arm's own side (away from the body), − swings in across the body. b = the elbow, added to a for the forearm:
// − folds the forearm back in / up toward the body, + straightens it further out. l = screen-left arm, r = screen-right.
// yaw: −1 profile facing screen-left … 0 front … 1 profile facing screen-right. Good range ±0.6 (the drawings are
// front views; past that the face slides off the skull).

export type P = {x: number; y: number};
export type Limb = {a: number; b: number; /** false = no hand (in a pocket, behind the back) */ hand?: boolean};
export type Pose = {
  yaw: number;
  /** null = the rig draws no arm on that side (a legacy two-hand pose symbol draws it) */
  armL: Limb | null;
  armR: Limb | null;
  /** degrees, + tips the head toward screen-right */
  headTilt: number;
  /** −1 … 1: the eyes slide toward screen-left / right inside the face (neutral dot eyes only) */
  look: number;
};

/** the head / body split line in every person frame (200 × 520 and the kids' 200 × 420 share the head) */
export const CUT = 130;
export const NECK: P = {x: 100, y: 132};
export const HEAD = {x: 100, y: 65, r: 65};

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** where each build's resting hand ends (cast.svg standing arms, screen-left side; the right mirrors) */
const REST_END: Record<string, [number, number]> = {pants: [52, 320], wide: [40, 316], skirt: [54, 310], kid: [54, 250], robe: [52, 322]};

/** the standing arm of a build as a Limb: the rig at yaw 0 with rest arms draws the symbol's own arms */
export const restLimb = (plan: RigPlan): Limb => {
  const [ex, ey] = REST_END[plan.build] ?? REST_END.pants;
  return {a: deg(Math.atan2(plan.f.sh[0] - ex, ey - plan.f.shY)), b: 0};
};

export const restPose = (plan?: RigPlan): Pose => {
  const r = plan ? restLimb(plan) : {a: 2, b: 0};
  return {yaw: 0, armL: r, armR: r, headTilt: 0, look: 0};
};

/** Two-bone reach: the Limb whose hand centre lands on `target` (frame units). Of the two ways to bend, the elbow
 *  that hangs lower (and, between two level ones, the one farther out from the body) wins: elbows point down and out.
 *  side −1 = l, 1 = r. */
export function reachLimb(side: -1 | 1, sh: P, target: P, upper: number, fore: number): Limb {
  const l2 = fore + 10; // the hand centre sits 10 past the wrist
  const dx = target.x - sh.x, dy = target.y - sh.y;
  const d = clamp(Math.hypot(dx, dy), Math.abs(upper - l2) + 1, upper + l2 - 0.01);
  const th = Math.atan2(dx, dy); // screen angle of shoulder → target, 0 = down, + toward +x
  const al = Math.acos(clamp((upper * upper + d * d - l2 * l2) / (2 * upper * d), -1, 1));
  const score = (u: number) => Math.cos(u) * upper + 0.5 * side * Math.sin(u) * upper; // elbow y + half its outward x
  const pick = score(th + al) >= score(th - al) ? th + al : th - al;
  const ex = sh.x + Math.sin(pick) * upper, ey = sh.y + Math.cos(pick) * upper;
  const v = Math.atan2(target.x - ex, target.y - ey);
  const a = side * deg(pick);
  return {a, b: side * deg(v) - a};
}

/** hands-poses.md anchors (screen-right arm in the 200 × 520 frame; the left mirrors) — the same gestures as the
 *  arm-*-hold / chest / offer / raise / reach symbols, as angles, so they work on every build and at any yaw */
const ANCHOR_R: Record<string, [number, number, boolean?]> = {
  hold: [112, 244], chest: [116, 196], offer: [214, 222], raise: [190, 110], reach: [226, 176],
  wave: [222, 70], point: [236, 204], face: [124, 102], mouth: [108, 104], chin: [116, 124], head: [150, 18],
  hip: [146, 292], pocket: [130, 304, false], lap: [118, 300], out: [232, 262],
};
const PANTS = rigPlan('lead-male-A')!;
export const ARM_PRESETS: Record<string, Limb> = Object.fromEntries(Object.entries(ANCHOR_R).map(([k, [x, y, hand]]) => {
  const l = reachLimb(1, {x: PANTS.f.sh[1], y: PANTS.f.shY}, {x, y}, PANTS.f.upper, PANTS.f.fore);
  return [k, hand === false ? {...l, hand: false} : l];
}));

/** "70,-10" · "70,-10,nohand" · a preset name (hold chest offer raise reach wave point face mouth chin head hip pocket lap out) · "rest" */
export function parseLimb(s: string, plan?: RigPlan): Limb | undefined {
  if (s === 'rest') return plan ? restLimb(plan) : {a: 2, b: 0};
  if (ARM_PRESETS[s]) return ARM_PRESETS[s];
  const [a, b, h] = s.split(',');
  if (!Number.isFinite(+a)) return undefined;
  return {a: +a, b: Number.isFinite(+b) ? +b : 0, ...(h === 'nohand' ? {hand: false} : {})};
}

const mixLimb = (A: Limb | null, B: Limb | null, t: number): Limb | null =>
  !A || !B ? (t < 0.5 ? A : B) : {a: lerp(A.a, B.a, t), b: lerp(A.b, B.b, t), hand: t < 0.5 ? A.hand : B.hand};

export const mixPose = (A: Pose, B: Pose, t: number): Pose => ({
  yaw: lerp(A.yaw, B.yaw, t), headTilt: lerp(A.headTilt, B.headTilt, t), look: lerp(A.look, B.look, t),
  armL: mixLimb(A.armL, B.armL, t), armR: mixLimb(A.armR, B.armR, t),
});

export type PoseKey = {f: number; p: Partial<Pose>; ease?: (t: number) => number};

/** Keyed poses: every number eases between keys (easeInOut unless the later key says otherwise); a key carries the
 *  earlier values forward, so `{f: 30, p: {armR: ARM_PRESETS.raise}}` only moves the right arm. */
export function poseAt(f: number, keys: PoseKey[], from: Pose = restPose()): Pose {
  const full: {f: number; p: Pose; ease?: (t: number) => number}[] = [];
  let cur = from;
  for (const k of keys) { cur = {...cur, ...k.p}; full.push({f: k.f, p: cur, ease: k.ease}); }
  if (!full.length) return from;
  if (f <= full[0].f) return full[0].p;
  for (let i = 0; i < full.length - 1; i++) {
    const A = full[i], B = full[i + 1];
    if (f <= B.f) return mixPose(A.p, B.p, (B.ease ?? easeInOut)((f - A.f) / Math.max(1e-6, B.f - A.f)));
  }
  return full[full.length - 1].p;
}

/** Face swaps happen through a blink (never a morph): the eyes are shut for the two frames before a change and the
 *  frame of it. keys = [[frame, face], …]; face '' = the character's own neutral face. */
export function faceAt(f: number, keys: [number, string][]): {face: string; blink: boolean} {
  let face = keys[0]?.[1] ?? '';
  let blink = false;
  keys.forEach(([k, e], i) => {
    if (f >= k) face = e;
    if (i > 0 && f >= k - 2 && f < k + 1) blink = true;
  });
  return {face, blink};
}

/** How far each layer slides for a yaw (frame units) and how much the body narrows. */
export function turnOf(yaw: number) {
  const y = clamp(yaw, -1, 1), ay = Math.abs(y), s = Math.sign(y) || 1;
  return {
    s, ay,
    body: {dx: y * 4, k: 1 - 0.3 * ay},
    /** the darker copy of the body behind it, toward the trailing side: the side plane turned away from us */
    side: -s * 9 * ay,
    skull: y * 4,
    hair: y * 4 - y * 12,
    face: {dx: y * 4 + y * 28, k: 1 - 0.22 * ay},
    /** the near ear slides in over the cheek; the far one goes behind the skull */
    earNear: y * 4 + s * 18 * ay,
    earFar: y * 4 - s * 30 * ay,
    /** a hand-drawn head with no parts turns as one piece */
    rigid: {dx: y * 14, k: 1 - 0.12 * ay},
  };
}

const scaleX = (cx: number, dx: number, k: number) => `translate(${(cx + dx).toFixed(2)} 0) scale(${k.toFixed(4)} 1) translate(${-cx} 0)`;

type ArmGeo = {side: -1 | 1; sh: P; el: P; wr: P; hand: P; v: number; v0: number; el0: P; limb: Limb};

/** the shoulders of a build on a turned body: the near one stays out at the torso's edge, the far one tucks in
 *  behind the chest */
export const shouldersOf = (plan: RigPlan, yaw: number): [P, P] => {
  const t = turnOf(yaw);
  const x = (sx: number, side: -1 | 1) => 100 + t.body.dx + (sx - 100) * t.body.k * (t.ay < 0.05 ? 1 : side === t.s ? 0.84 : 1.04);
  return [{x: x(plan.f.sh[0], -1), y: plan.f.shY}, {x: x(plan.f.sh[1], 1), y: plan.f.shY}];
};

function armGeo(plan: RigPlan, side: -1 | 1, limb: Limb, sh: P): ArmGeo {
  const {upper, fore} = plan.f;
  const u = rad(side * limb.a), v = rad(side * (limb.a + limb.b));
  const el = {x: sh.x + Math.sin(u) * upper, y: sh.y + Math.cos(u) * upper};
  const wr = {x: el.x + Math.sin(v) * fore, y: el.y + Math.cos(v) * fore};
  const hand = {x: wr.x + Math.sin(v) * 10, y: wr.y + Math.cos(v) * 10};
  // the standing arm, for carrying marks (tattoos, bracelets) and the watch over onto the jointed forearm
  const r = restLimb(plan);
  const sh0 = {x: side < 0 ? plan.f.sh[0] : plan.f.sh[1], y: plan.f.shY};
  const u0 = rad(side * r.a);
  const el0 = {x: sh0.x + Math.sin(u0) * upper, y: sh0.y + Math.cos(u0) * upper};
  return {side, sh, el, wr, hand, v: deg(v), v0: deg(u0), el0, limb};
}

/** the rest-arm → posed-forearm transform (SVG rotate is clockwise, our angles run from down toward +x) */
const foreT = (g: ArmGeo) => `translate(${g.el.x.toFixed(2)} ${g.el.y.toFixed(2)}) rotate(${(-(g.v - g.v0)).toFixed(2)}) translate(${(-g.el0.x).toFixed(2)} ${(-g.el0.y).toFixed(2)})`;
const handT = (g: ArmGeo) => `translate(${g.hand.x.toFixed(2)} ${g.hand.y.toFixed(2)}) rotate(${(-(g.v - g.v0)).toFixed(2)})`;
const seg = (a: P, b: P) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

const RigArm: React.FC<{g: ArmGeo; plan: RigPlan; sym: string; watch?: boolean; prop?: string}> = ({g, plan, sym, watch, prop}) => {
  const parts = CAST_PARTS[sym] ?? {};
  const w = plan.armW;
  const sleeve = `var(--sleeve, ${plan.arm})`;
  const forearm = `var(--forearm, ${sleeve})`;
  const sideKey = g.side < 0 ? 'l' : 'r';
  const cuff = {x: g.sh.x + (g.el.x - g.sh.x) * 0.88, y: g.sh.y + (g.el.y - g.sh.y) * 0.88};
  const whole = `${seg(g.sh, g.el)} L${g.wr.x.toFixed(1)} ${g.wr.y.toFixed(1)}`;
  const line = {fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  const ang = deg(Math.atan2(g.wr.y - g.el.y, g.wr.x - g.el.x)) - 90;
  const thumb = (100 - g.hand.x) * Math.cos(rad(ang)) > 0 ? 1 : -1;
  return (
    <g>
      {parts.short ? (
        // short sleeve: a bare arm with the sleeve over most of the upper arm (cast.svg arm-*-short)
        <>
          <path d={whole} stroke="var(--forearm, var(--skin, #e7b38c))" strokeWidth={w - 2} {...line} />
          <path d={seg(g.sh, cuff)} stroke={sleeve} strokeWidth={w + 2} {...line} />
          <path d={seg(g.sh, cuff)} stroke="rgba(255,255,255,.07)" strokeWidth={w + 2} {...line} />
        </>
      ) : (
        <>
          <path d={seg(g.sh, g.el)} stroke={sleeve} strokeWidth={w} {...line} />
          <path d={seg(g.el, g.wr)} stroke={forearm} strokeWidth={w} {...line} />
          {/* every arm in cast.svg is a touch lighter than the torso, so one crossing the body still reads */}
          <path d={whole} stroke="rgba(255,255,255,.07)" strokeWidth={w} {...line} />
        </>
      )}
      {parts.marks?.includes(sideKey) && <use href={`#${sym}--marks-${sideKey}`} transform={foreT(g)} />}
      {g.limb.hand !== false && !prop && <Mitten x={g.hand.x} y={g.hand.y} ang={ang} k={plan.f.hand / 20} thumb={thumb} />}
      {/* acc-watch is drawn around the hand centre with the wrist above it: turn it with the forearm */}
      {watch && g.side < 0 && <use href="#acc-watch" transform={handT(g)} />}
      {prop && <use href={`#prop-${prop}`} transform={`translate(${g.hand.x.toFixed(1)} ${g.hand.y.toFixed(1)})`} />}
    </g>
  );
};

export type PoseFigureProps = {
  /** the person symbol (a standing body: CAST_BUILD pants / wide / skirt / kid / robe) */
  sym: string;
  pose: Pose;
  /** a swapped hairstyle (hair-* without the prefix): replaces the symbol's own hair part */
  hair?: string;
  /** drawn with the face (face-*, talk-*, glasses, mask, blink lids) — wrap in the figure's layerTransform yourself */
  face?: React.ReactNode;
  /** drawn with the skull (caps, hats, headbands, mark-*) */
  hat?: React.ReactNode;
  /** drawn with the body (outfit acc-*, bags, necklaces, a roster trait) */
  body?: React.ReactNode;
  /** drawn behind the body (a backpack) */
  under?: React.ReactNode;
  /** a legacy pose-arm symbol (arm-b-wheel, arm-*-carry) with its prop, drawn over the body; set that side's arm to null */
  over?: React.ReactNode;
  /** grip prop (prop-* without the prefix) in the right / left hand; the prop draws the hand */
  propR?: string;
  propL?: string;
  /** the character wears acc-wristwatch: drawn on the jointed left wrist */
  watch?: boolean;
  /** the face layers' transform (cast.json layerTransform / LAYER_T), for the eyes that `look` moves */
  lt?: string;
  /** the face is the character's own (no face-* layer): `look` may move its dot eyes */
  ownFace?: boolean;
};

const OFF = 'none';
/** the body pass: no arms, no hair or face. The skull stays on: clipped below CUT it is the lower neck, drawn in the
 *  symbol's own order (over the collar, under a neck tattoo or a necklace drawn after it) */
const BODY_VARS = {'--arm-l-rest': OFF, '--arm-r-rest': OFF, '--hair-rest': OFF, '--face-rest': OFF, '--backhair-rest': OFF, '--ear-l': OFF, '--ear-r': OFF} as React.CSSProperties;
/** the face pass: no arms, skull, hair or ears */
const FACE_VARS = {'--arm-l-rest': OFF, '--arm-r-rest': OFF, '--hair-rest': OFF, '--skull-rest': OFF, '--backhair-rest': OFF, '--ear-l': OFF, '--ear-r': OFF} as React.CSSProperties;
/** a hand-drawn head: everything but the arms */
/** where each build's torso ends: below it a hanging arm lies over the legs / skirt / shorts (cast.svg draws the
 *  arms after those and before the torso), so an arm behind the body is drawn again over them from here down */
const TORSO_END: Record<string, number> = {pants: 315, wide: 316, skirt: 300, kid: 270, robe: 999};
const RIGID_VARS = {'--arm-l-rest': OFF, '--arm-r-rest': OFF, '--backhair-rest': OFF} as React.CSSProperties;

const uid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '');

/** A standing person in the pose rig, drawn in the symbol's own frame (inside its <svg viewBox="0 0 200 520">). */
export const PoseFigure: React.FC<PoseFigureProps> = ({sym, pose, hair, face, hat, body, under, over, propR, propL, watch, lt, ownFace}) => {
  const id = uid(React.useId());
  const plan = rigPlan(sym);
  const parts = CAST_PARTS[sym] ?? {};
  const t = turnOf(pose.yaw);
  const headClip = `pose-h-${id}`, bodyClip = `pose-b-${id}`, lowClip = `pose-l-${id}`;
  const bodyT = scaleX(100, t.body.dx, t.body.k);
  const tilt = pose.headTilt ? `rotate(${pose.headTilt.toFixed(2)} ${NECK.x} ${NECK.y})` : undefined;
  const base = <use href={`#${sym}`} />;

  // arms
  const arms: {g: ArmGeo; layer: 'back' | 'front' | 'top'; prop?: string; far?: boolean}[] = [];
  if (plan) {
    const [shL, shR] = shouldersOf(plan, pose.yaw);
    const sides: [-1 | 1, Limb | null, P, string | undefined][] = [[-1, pose.armL, shL, propL], [1, plan.noArmR ? null : pose.armR, shR, propR]];
    for (const [side, limb, sh, prop] of sides) {
      if (!limb) continue;
      const g = armGeo(plan, side, limb, sh);
      // an arm hangs or swings behind the torso's edge, as the drawings do; a hand across the chest comes in front,
      // a hand at the mouth / cheek in front of the head too
      const far = t.ay > 0.12 && side === t.s;
      const crossing = g.hand.x > shL.x + 6 && g.hand.x < shR.x - 6 && g.hand.y > 150;
      const atFace = Math.hypot(g.hand.x - (HEAD.x + t.face.dx), g.hand.y - HEAD.y) < HEAD.r + 4 && g.hand.y > 40;
      const layer = atFace ? 'top' : crossing ? 'front' : 'back';
      arms.push({g, layer, prop, far});
    }
  }
  const armsAt = (layer: string, near = false) => plan && arms.filter(a => a.layer === layer && !(near && a.far)).map(a => (
    <RigArm key={a.g.side} g={a.g} plan={plan} sym={sym} watch={watch} prop={a.prop} />
  ));

  const clips = (
    <defs>
      <clipPath id={headClip} clipPathUnits="userSpaceOnUse"><rect x={-600} y={-900} width={1400} height={900 + CUT} /></clipPath>
      <clipPath id={bodyClip} clipPathUnits="userSpaceOnUse"><rect x={-600} y={CUT} width={1400} height={1400} /></clipPath>
      <clipPath id={lowClip} clipPathUnits="userSpaceOnUse"><rect x={-600} y={TORSO_END[plan?.build ?? 'pants'] ?? 999} width={1400} height={1400} /></clipPath>
    </defs>
  );
  const bodyPass = (vars: React.CSSProperties) => (
    <>
      <g clipPath={`url(#${bodyClip})`}>
        {t.ay > 0.02 && (
          <g transform={scaleX(100, t.body.dx + t.side, t.body.k)} style={{...vars, filter: 'brightness(.72)'}}>{base}</g>
        )}
        <g transform={bodyT} style={vars}>{base}</g>
      </g>
      <g clipPath={`url(#${lowClip})`}>{armsAt('back', true)}</g>
      <g transform={bodyT}>{body}{over}</g>
    </>
  );

  // a hand-drawn head with no parts: the whole head turns as one piece
  if (!parts.skull) {
    return (
      <g>
        {clips}
        <g transform={bodyT}>{under}</g>
        {armsAt('back')}
        {bodyPass(RIGID_VARS)}
        {armsAt('front')}
        <g transform={tilt}>
          <g clipPath={`url(#${headClip})`}>
            <g transform={scaleX(100, t.rigid.dx, t.rigid.k)} style={RIGID_VARS}>{base}{face}</g>
          </g>
          <g transform={`translate(${t.rigid.dx.toFixed(2)} 0)`}>{hat}</g>
        </g>
        {armsAt('top')}
      </g>
    );
  }

  const hairDx = t.hair.toFixed(2);
  const hasEars = !!parts.ears && hair !== 'bob';
  const nearEar = t.s > 0 ? 'l' : 'r'; // turning toward screen-right brings the screen-left ear round onto the cheek
  const ear = (side: 'l' | 'r', dx: number) => (
    <use href="#ears" transform={`translate(${dx.toFixed(2)} 0)`} style={{'--ear-l': side === 'l' ? 'inline' : OFF, '--ear-r': side === 'r' ? 'inline' : OFF} as React.CSSProperties} />
  );
  const faceT = scaleX(100, t.face.dx, t.face.k);
  const lookDx = pose.look * 5;
  return (
    <g>
      {clips}
      {parts.backhair && <use href={`#${sym}--backhair`} transform={`translate(${hairDx} 0)`} />}
      <g transform={bodyT}>{under}</g>
      {armsAt('back')}
      {bodyPass(BODY_VARS)}
      {armsAt('front')}
      <g transform={tilt}>
        {hasEars && t.ay > 0.05 && ear(nearEar === 'l' ? 'r' : 'l', t.earFar)}
        <use href={`#${sym}--skull`} transform={`translate(${t.skull.toFixed(2)} 0)`} clipPath={`url(#${headClip})`} />
        {t.ay > 0.05 && (
          // the side of the head turned away from us, in the skin shadow colour: skull minus a circle slid toward the face
          <>
            <mask id={`pose-m-${id}`} maskUnits="userSpaceOnUse" x={-100} y={-100} width={400} height={400}>
              {/* the character's own skull, painted white (head-bare, or woman's smaller head) */}
              <use href={`#${sym}--skull`} transform={`translate(${t.skull.toFixed(2)} 0)`} style={{'--skin': '#fff', '--skin-d': '#fff'} as React.CSSProperties} />
              <circle cx={HEAD.x + t.skull + t.s * 26 * t.ay} cy={HEAD.y - 2} r={HEAD.r + 2} fill="#000" />
            </mask>
            <rect x={-20} y={-20} width={240} height={CUT + 20} fill="var(--skin-d, #c98f6b)" opacity={0.55} mask={`url(#pose-m-${id})`} />
          </>
        )}
        <g transform={`translate(${hairDx} 0)`}>
          {hair ? <use href={`#hair-${hair}`} /> : parts.hair && <use href={`#${sym}--hair`} />}
        </g>
        {hasEars && (t.ay > 0.05 ? ear(nearEar, t.earNear) : <use href="#ears" transform={`translate(${t.skull.toFixed(2)} 0)`} />)}
        <g clipPath={`url(#${headClip})`}>
          <g transform={faceT} style={FACE_VARS}>
            {base}
            {face}
            {ownFace && Math.abs(lookDx) > 0.2 && (
              // the dot eyes glance: skin over the drawn eyes, the dots again a little to the side
              <g transform={lt}>
                <ellipse cx={77} cy={72} rx={8} ry={8} fill="var(--skin, #e0b48c)" />
                <ellipse cx={123} cy={72} rx={8} ry={8} fill="var(--skin, #e0b48c)" />
                <circle cx={77 + lookDx} cy={72} r={6} fill="var(--eye, #1a1a22)" />
                <circle cx={123 + lookDx} cy={72} r={6} fill="var(--eye, #1a1a22)" />
              </g>
            )}
          </g>
        </g>
        <g transform={`translate(${(t.skull + (t.face.dx - t.skull) * 0.35).toFixed(2)} 0)`}>{hat}</g>
      </g>
      {armsAt('top')}
    </g>
  );
};

/** is a pose anything other than the standing sprite? (the rig is only used when it is) */
export const isPosed = (p: Partial<Pose>) =>
  !!(p.yaw || p.headTilt || p.look || p.armL !== undefined || p.armR !== undefined);

/** Where a Sprite / actor layer goes on a posed figure: with the face, with the skull, a legacy arm, or the body. */
export function layerRole(id: string): 'face' | 'hat' | 'arm' | 'watch' | 'under' | 'body' {
  if (/^(face-|talk-)/.test(id) || /^acc-(glasses|square-glasses|mask)$/.test(id)) return 'face';
  if (/^mark-/.test(id) || /^acc-(cap|bucket-hat|headband|hood|bow)$/.test(id)) return 'hat';
  if (/^arm-/.test(id)) return 'arm';
  if (id === 'acc-wristwatch') return 'watch';
  if (id === 'acc-backpack') return 'under';
  return 'body';
}

/** legacy pose-arm names (arm=r-hold …) that the rig draws itself; the rest (carry, wheel) stay symbols */
export const RIG_ARM = new Set(['hold', 'chest', 'offer', 'raise', 'reach', 'pocket']);
/** presets a hand holds a grip prop in: `prop=` goes to the arm in one of these when only one is */
export const GRIP = new Set(['hold', 'offer', 'reach', 'raise', 'out', 'lap', 'point']);
/** which hand gets `prop=`: "paper@l" names it, else the arm in a GRIP preset, else the one posed arm, else the right */
export function propHand(prop: string, armL?: string, armR?: string, legacySide?: string): {id: string; side: 'l' | 'r'} {
  const [id, at] = prop.split('@');
  if (at === 'l' || at === 'r') return {id, side: at};
  if (legacySide === 'l' || legacySide === 'r') return {id, side: legacySide};
  const grip = (v?: string) => !!v && GRIP.has(v.split('>').pop()!.split('@')[0]);
  if (grip(armL) && !grip(armR)) return {id, side: 'l'};
  if (grip(armR)) return {id, side: 'r'};
  return {id, side: armL && !armR ? 'l' : 'r'};
}

/** A tweened actor-string value: "0.4", "0>0.5" (eased across the shot) or "0>0.5@10-40" (frames 10–40). */
export function tweenAt<T>(v: string | undefined, f: number, len: number, parse: (s: string) => T | undefined, mix: (a: T, b: T, t: number) => T): T | undefined {
  if (v === undefined) return undefined;
  const [vals, win] = v.split('@');
  const [A, B] = vals.split('>').map(parse);
  if (A === undefined) return undefined;
  if (B === undefined) return A;
  const [f0, f1] = win ? win.split('-').map(Number) : [0, len];
  return mix(A, B, easeInOut(clamp((f - f0) / Math.max(1, (f1 ?? len) - f0))));
}
export const tweenNum = (v: string | undefined, f: number, len: number) =>
  tweenAt(v, f, len, s => (Number.isFinite(+s) && s !== '' ? +s : undefined), lerp);
export const tweenLimb = (v: string | undefined, f: number, len: number, plan?: RigPlan) =>
  tweenAt<Limb | null>(v, f, len, s => (s === 'none' ? null : parseLimb(s, plan)), mixLimb);

/** "worried@0,shock@40" → faceAt keys */
export const parseFaceKeys = (v: string): [number, string][] =>
  v.split(',').map(k => { const [face, at] = k.split('@'); return [Number(at) || 0, face === 'own' ? '' : face] as [number, string]; }).sort((a, b) => a[0] - b[0]);
