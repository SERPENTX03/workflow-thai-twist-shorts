import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CAST_SIZE, type CastId} from '../cast/CastSprite';
import {kf} from '../engine/anim';
import type {ShotProps} from '../engine/episode';
import {Grain} from './horror';
import {rimFilter} from './light';
import {blinkAt, breathe, gait, motionCss, seedOf} from './motion';
import {wardrobe} from '../cast/outfitPresets';
import {castDefaults} from '../cast/defaults';
import {RigBody, rigDrop, rigHasLegs, rigPlan} from '../cast/Rig';
import {HairLayer} from '../cast/Sprite';
import {Hud} from './ui';

// Landscape "stage": a world drawn in px, a camera that pushes / pans across it, and actors described by short
// strings in story.json (`data.cast`), so long-form episodes don't need one component per shot.
// Shot wrappers at the bottom: Stage, Plate, Actors, makeSpeaking. Backdrops: world.tsx, temple.tsx; close-ups: inserts.tsx.
//
//   "non@1020 sit worried talk arm=r-chest prop=flashlight flip mark=question h=480 o=0.6"
//   who@x[,floorY]  then any of: pose (sit back walk run crouch lie) · face (worried, hollow…) · talk · flip
//                   arm=<side>-<pose> (r-hold, l-offer…) · prop=<grip prop> · acc=<accessory> · mark=<mark> · h=<px> · o=<opacity>
//                   rim=l|r|red|0 (rim light side; default from data.rim, colour from data.light)
//                   hair=<style> (bob, ponytail, bun… swaps the hairstyle on any standard head)

export type Actor = {
  who: string; x: number; y?: number; pose: string; face?: string; talk: boolean; flip: boolean;
  arm?: string; prop?: string; acc?: string; mark?: string; h?: number; o?: number; rim?: string; hair?: string;
};

const POSES = new Set(['sit', 'back', 'walk', 'run', 'crouch', 'lie', 'stand']);
const FACES = new Set(['happy', 'laugh', 'sad', 'cry', 'angry', 'scared', 'shock', 'worried', 'smirk', 'tired', 'hollow', 'wary', 'guilty', 'grin']);
/** face words that are really a face + an emotion mark */
const FACE_MARK: Record<string, [string, string]> = {question: ['worried', 'question'], dizzy: ['tired', 'dizzy']};

export function parseActor(s: string): Actor {
  const [head, ...rest] = s.trim().split(/\s+/);
  const [who, pos] = head.split('@');
  const [x, y] = (pos ?? '960').split(',').map(Number);
  const a: Actor = {who, x, y: Number.isFinite(y) ? y : undefined, pose: 'stand', talk: false, flip: false};
  for (const t of rest) {
    const [k, v] = t.split('=');
    if (v !== undefined) {
      if (k === 'arm') a.arm = v;
      else if (k === 'prop') a.prop = v;
      else if (k === 'acc') a.acc = v;
      else if (k === 'mark') a.mark = v;
      else if (k === 'h') a.h = +v;
      else if (k === 'o') a.o = +v;
      else if (k === 'rim') a.rim = v;
      else if (k === 'hair') a.hair = v;
    } else if (POSES.has(t)) a.pose = t;
    else if (FACES.has(t)) a.face = t;
    else if (FACE_MARK[t]) [a.face, a.mark] = FACE_MARK[t];
    else if (t === 'talk') a.talk = true;
    else if (t === 'flip') a.flip = true;
  }
  return a;
}

/** How one roster entry draws: symbol per pose, colours, height in cm, face offset per symbol. */
export type RosterEntry = {
  cm: number;
  symbol: (pose: string) => CastId;
  vars?: Record<string, string>;
  /** extra layers on top (accessories, a trait) — function of the symbol so a sit pose can shift them */
  extra?: (symbol: string) => React.ReactNode;
  /** silhouette: every colour var black */
  sil?: boolean;
  noShadow?: boolean;
};

/** overlay transform that faces / arms need on a posed body (cast-library.md → poses) */
export const LAYER_T: Record<string, string> = {
  'man-sit': 'translate(0 110)', 'monk-sit': 'translate(0 110)', 'woman-sit': 'translate(0 104)', 'auntie-sit': 'translate(0 104)',
  'man-crouch': 'translate(0 160)', 'man-run': 'rotate(8 100 300)', auntie: 'translate(0 4)', woman: 'translate(0 4)',
  'man-lie': 'translate(0 234) rotate(-90)',
};
/** pose arms on a sitting body sit 100–110 lower */
const ARM_T: Record<string, string> = {'man-sit': 'translate(0 110)', 'monk-sit': 'translate(0 110)', 'woman-sit': 'translate(0 100)', 'auntie-sit': 'translate(0 100)', 'man-crouch': 'translate(0 160)'};

/** hand anchors for grip props, 200×520 frame (hands-poses.md) */
const ANCHOR: Record<string, [number, number]> = {
  'r-hold': [112, 244], 'l-hold': [88, 244], 'r-chest': [116, 196], 'l-chest': [84, 196], 'r-offer': [214, 222], 'l-offer': [-14, 222],
  'r-raise': [190, 110], 'l-raise': [10, 110], 'r-reach': [226, 176], 'l-reach': [-26, 176], 'r-rest': [148, 330], 'l-rest': [52, 330],
};

const SIL_VARS = ['skin', 'skin-d', 'hair', 'shirt', 'pants', 'top', 'skirt', 'shoe', 'eye', 'eye-white', 'blush', 'tear', 'robe', 'robe-d', 'stubble', 'sleeve', 'forearm', 'uniform', 'detail', 'shorts', 'mouth', 'brow', 'tattoo', 'jewel', 'red', 'tie'];
const TALK = ['talk-a', 'talk-m', 'talk-e', 'talk-o', 'talk-m'];

/** A frame-driven mouth: open shapes on a 0.13 s grid while `on`, closed otherwise. */
export const talkShape = (f: number, on: boolean) => (on ? TALK[Math.floor(f / 4) % TALK.length] : 'talk-m');

export type ActorProps = {a: Actor; roster: Record<string, RosterEntry>; floor: number; pxPerCm: number; f: number; talking?: boolean; style?: React.CSSProperties;
  /** eyes shut this frame (Actors drives it with blinkAt) */
  blink?: boolean;
  /** a jointed body (cast/Rig.tsx) drawn instead of the symbol; layerT replaces the symbol's layer transform */
  body?: {node: React.ReactNode; layerT?: string}};

/** faces whose eyes are already shut or curved: no blink over them */
const NO_BLINK = new Set(['happy', 'laugh', 'cry', 'tired']);

/** One actor standing on the floor line at a.x (feet centre). */
export const ActorView: React.FC<ActorProps> = ({a, roster, floor, pxPerCm, f, talking, style, blink, body}) => {
  const r = roster[a.who];
  if (!r) return null;
  const sym = r.symbol(a.pose);
  const baseSym = r.symbol('stand');
  const baseDef = castDefaults(baseSym);
  const poseDef = castDefaults(sym);
  const defaults = {
    ...baseDef,
    ...poseDef,
    defaultVars: {...(baseDef.defaultVars ?? {}), ...(poseDef.defaultVars ?? {})},
    defaultAccessories: [...new Set([...(baseDef.defaultAccessories ?? []), ...(poseDef.defaultAccessories ?? [])])],
  };
  const defaultAcc = defaults.defaultOutfit?.replace(/^acc-/, '');
  const acc = a.acc === 'none' ? undefined : (wardrobe['acc-' + a.acc] ? a.acc : defaultAcc);
  const accessory = a.acc && a.acc !== 'none' && a.acc !== acc ? a.acc : undefined;
  const [w, h] = CAST_SIZE[sym] ?? [200, 520];
  const fullH = (a.h ?? r.cm * pxPerCm);
  const scale = fullH / 520;
  const W = w * scale, H = h * scale;
  const lt = body ? body.layerT : LAYER_T[sym] ?? defaults.layerTransform;
  const at = ARM_T[sym];
  const css: Record<string, string> = {};
  for (const [k, v] of Object.entries(defaults.defaultVars ?? {})) css['--' + k] = v;
  const outfit = wardrobe['acc-' + acc];
  if (outfit) {
    for (const [key, color] of Object.entries(outfit.vars)) css['--' + key] = color;
    css['--sleeve'] = outfit.vars.shirt;
  }
  if (!outfit || 'acc-' + acc === defaults.defaultOutfit) {
    for (const [k, v] of Object.entries(defaults.defaultVars ?? {})) css['--' + k] = v;
    if (defaults.defaultVars?.shirt) css['--sleeve'] = defaults.defaultVars.shirt;
  }
  for (const [k, v] of Object.entries(r.vars ?? {})) css['--' + k] = v;
  if (r.vars?.shirt || r.vars?.top) {
    if (!r.vars?.sleeve) {
      css['--sleeve'] = css['--shirt'] ?? css['--top'];
    }
  }
  if (r.vars?.skin && !r.vars?.forearm && defaults.defaultVars?.forearm === defaults.defaultVars?.skin) {
    css['--forearm'] = css['--skin'];
  } else if (!css['--forearm']) {
    css['--forearm'] = css['--sleeve'] ?? css['--shirt'] ?? css['--top'];
  }
  if (r.sil) for (const k of SIL_VARS) css['--' + k] = '#05070b';
  // Pose arms are drawn for a standing body. On a crouching / lying / rigged-running body they float over the head, and
  // monk-sit already folds its hands, so there the pose arm is ignored (the body keeps its own arms) and story-check
  // reports the string. Show the action with a standing actor or a hand insert instead (cast-library.md).
  const noPoseArms = sym === 'man-lie' || sym === 'monk-sit' || (sym === 'man-run' && !body);
  const poseArm = noPoseArms ? undefined : a.arm;
  const armSide = poseArm?.[0];
  if (armSide === 'r') css['--arm-r-rest'] = 'none';
  if (armSide === 'l') css['--arm-l-rest'] = 'none';
  const showFace = !!a.face && !r.sil && a.pose !== 'back';
  // a body with no back view (monk, auntie) turned away: hide the features
  const fakeBack = a.pose === 'back' && !sym.endsWith('-back');
  if (showFace || fakeBack) css['--face-rest'] = 'none';
  if (fakeBack) css['--mouth-rest'] = 'none';
  const activeHair = a.hair ?? ((sym.startsWith('man-') || sym.startsWith('woman-') || sym.startsWith('auntie-')) ? baseDef.hairStyle : undefined);
  const swapHair = !!activeHair && a.pose !== 'back' && !r.sil;
  if (swapHair) css['--hair-rest'] = 'none';
  const talkOn = a.talk && !!talking && a.pose !== 'back' && !r.sil;
  if (talkOn && !showFace) css['--mouth-rest'] = 'none';
  // drawn whole-body poses with the face and hands somewhere else (a rigged run puts them back where they belong)
  const frozen = sym === 'man-lie' || sym === 'man-crouch' || (sym === 'man-run' && !body);
  const anchor = a.prop && !frozen && !noPoseArms ? ANCHOR[poseArm ?? 'r-rest'] : undefined;
  const shut = !!blink && !r.sil && !fakeBack && a.pose !== 'back' && !frozen && !NO_BLINK.has(a.face ?? '');
  const top = (a.y ?? floor) - H;
  const left = a.x - W / 2;
  return (
    <div style={{position: 'absolute', left, top, width: W, height: H, opacity: a.o, ...style}}>
      <svg viewBox={`0 0 ${w} ${h}`} width={W} height={H}
        style={{overflow: 'visible', transform: a.flip ? 'scaleX(-1)' : undefined, ...(css as React.CSSProperties)}}>
        {body ? body.node : <use href={`#${sym}`} />}
        {r.extra?.(sym)}
        <g transform={lt}>
          {swapHair && <HairLayer hair={activeHair!} />}
          {showFace && <use width={200} height={520} href={`#face-${a.face}`} style={talkOn ? ({'--mouth': 'transparent'} as React.CSSProperties) : undefined} />}
          {talkOn && <use width={200} height={520} href={`#${talkShape(f, true)}`} transform={showFace ? 'translate(0 6)' : undefined} />}
          {acc && acc !== 'none' && !fakeBack && <use width={200} height={outfit ? CAST_SIZE['acc-' + acc][1] : 520} href={`#acc-${acc}`} />}
          {accessory && !fakeBack && <use width={200} height={520} href={`#acc-${accessory}`} />}
          {!fakeBack && a.acc !== 'none' && (defaults.defaultAccessories ?? []).filter(id => id !== 'acc-' + accessory && !(id === 'acc-wristwatch' && (body || a.arm?.startsWith('l-') || sym.endsWith('-sit')))).map(id => <use key={id} width={200} height={520} href={`#${id}`} />)}
        </g>
        <g transform={at}>
          {poseArm && <use width={200} height={520} href={`#arm-${poseArm}`} />}
          {anchor && <use href={`#prop-${a.prop}`} transform={`translate(${anchor[0]} ${anchor[1]})`} />}
        </g>
        {a.mark && <g transform={lt}><use width={200} height={520} href={`#mark-${a.mark}`} /></g>}
        {shut && (
          // lids over whatever eyes are drawn: skin patches and a closed line (eyes at 77/123, 72 in the 200×520 frame)
          <g transform={lt}>
            <ellipse cx={77} cy={73} rx={13} ry={11} fill="var(--skin, #e0b48c)" />
            <ellipse cx={123} cy={73} rx={13} ry={11} fill="var(--skin, #e0b48c)" />
            <path d="M67 74 Q77 79 87 74 M113 74 Q123 79 133 74" stroke="var(--eye, #1a1a22)" strokeWidth={4.5} fill="none" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};

/** Camera over a world of size W×H: zoom z, world point (cx, cy) at the frame centre. */
export const Cam: React.FC<{W: number; H: number; z: number; cx: number; cy: number; children: React.ReactNode; shake?: {x: number; y: number}}> = ({W, H, z, cx, cy, children, shake}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0',
    transform: `translate(${W / 2 - cx * z + (shake?.x ?? 0)}px, ${H / 2 - cy * z + (shake?.y ?? 0)}px) scale(${z})`}}>{children}</div>
);

/** `data.cam` = [z0, z1, cx, cy] (optionally cx1, cy1 for a pan) → camera at frame f; slow eased push by default */
export function camAt(f: number, len: number, cam: number[] | undefined, def: number[] = [1, 1.04, 960, 540]) {
  const [z0, z1, cx, cy, cx1 = cx, cy1 = cy] = cam ?? def;
  const t = kf(f, [[0, 0], [len, 1]]);
  return {z: z0 + (z1 - z0) * t, cx: cx + (cx1 - cx) * t, cy: cy + (cy1 - cy) * t};
}

/** Light grades for landscape sets: a colour wash + vignette. `past` = desaturated memory look. */
export const GRADES: Record<string, {wash: string; vig: number; filter?: string}> = {
  day: {wash: 'rgba(255,240,210,0)', vig: 0.25},
  morning: {wash: 'rgba(200,220,235,.08)', vig: 0.3},
  dusk: {wash: 'rgba(120,60,90,.18)', vig: 0.45},
  warm: {wash: 'rgba(60,30,10,.12)', vig: 0.5},
  lamp: {wash: 'rgba(20,14,20,.35)', vig: 0.7},
  lantern: {wash: 'rgba(24,14,10,.32)', vig: 0.72},
  night: {wash: 'rgba(6,12,26,.48)', vig: 0.72},
  dim: {wash: 'rgba(6,10,20,.62)', vig: 0.8},
  dark: {wash: 'rgba(3,5,10,.74)', vig: 0.86},
  dawn: {wash: 'rgba(70,80,120,.25)', vig: 0.5},
};

export const Grade: React.FC<{light?: string; past?: boolean}> = ({light = 'night', past}) => {
  const g = GRADES[light] ?? GRADES.night;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: g.wash, pointerEvents: 'none'}} />
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,${g.vig}) 100%)`}} />
      {past && <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'rgba(120,100,70,.16)', mixBlendMode: 'multiply'}} />}
    </>
  );
};

/** CSS filter for a flashback (memory) layer */
export const PAST_FILTER = 'saturate(.35) sepia(.35) contrast(1.05) brightness(.9)';

// ---------------------------------------------------------------- shot wrappers (landscape stage episodes)

type Timeline = {vo: {shot: number; start: number; dur: number}[]; shots: {i: number; start: number}[]};

/** speaking(shot, f, len): is this shot's line being voiced at local frame f? Uses timeline.json `vo` when the
 *  episode is voiced, else guesses from voLead. Build one per episode: `export const speaking = makeSpeaking(timeline)`. */
export function makeSpeaking(timeline: Timeline) {
  const VO = new Map(timeline.vo.map(v => [v.shot, v]));
  const SHOT_START = new Map(timeline.shots.map(s => [s.i, s.start]));
  return (shot: ShotProps['shot'], f: number, len: number) => {
    const v = VO.get(shot.i), s0 = SHOT_START.get(shot.i);
    if (v && s0 !== undefined) {
      const a = (v.start - s0) * 30, b = a + v.dur * 30;
      return f >= a && f <= b - 3;
    }
    const lead = (shot.voLead ?? 0.12) * 30;
    return !!(shot.vo ?? shot.text) && f >= lead && f <= len - 18;
  };
}

/** soft floor shadow for the living */
export const FloorShadow: React.FC<{x: number; w: number; y: number}> = ({x, w, y}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - 14, width: w, height: 28, borderRadius: '50%', background: 'rgba(4,5,8,.42)'}} />
);

export type ActorsProps = {
  p: ShotProps; roster: Record<string, RosterEntry>; speaking: ReturnType<typeof makeSpeaking>;
  cast?: string[]; floor: number; pxPerCm: number; tint?: string;
  /** draw a chair behind every seated actor (front-facing sit pose: knees together, hands in the lap) */
  chairs?: boolean | {wood?: string; dark?: string; edge?: string};
};

/** Front-view chair behind a seated actor, drawn in the actor's 200x520 frame so it always matches the sit pose:
 *  backrest behind the shoulders, seat edge under the knees, legs to the floor line. */
export const SeatChair: React.FC<{x: number; y: number; h: number; wood?: string; dark?: string; edge?: string; o?: number}> = ({x, y, h, wood = '#6b4a2f', dark = '#3e2a1b', edge = '#8a6440', o}) => {
  const s = h / 520;
  return (
    <svg width={200 * s} height={520 * s} viewBox="0 0 200 520" style={{position: 'absolute', left: x - 100 * s, top: y - 520 * s, overflow: 'visible', opacity: o, pointerEvents: 'none'}}>
      <rect x="52" y="456" width="12" height="54" rx="3" fill={dark} />
      <rect x="136" y="456" width="12" height="54" rx="3" fill={dark} />
      <rect x="22" y="246" width="16" height="222" rx="5" fill={wood} />
      <rect x="162" y="246" width="16" height="222" rx="5" fill={wood} />
      <rect x="26" y="250" width="148" height="120" rx="12" fill={wood} />
      <rect x="38" y="262" width="124" height="96" rx="8" fill={dark} opacity=".35" />
      <path d="M32 252 H168" stroke={edge} strokeWidth="4" strokeLinecap="round" />
      <rect x="14" y="446" width="172" height="26" rx="9" fill={wood} />
      <path d="M22 449 H178" stroke={edge} strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="470" width="16" height="46" rx="4" fill={wood} />
      <rect x="162" y="470" width="16" height="46" rx="4" fill={wood} />
      <rect x="26" y="472" width="148" height="8" fill={dark} opacity=".7" />
    </svg>
  );
};

/** Actors from `cast` (default data.cast) on the floor line, with shadows for the living. `data.move` = [x0, x1]
 *  walks the first actor across the shot; other walkers drift `data.drift` px/frame (default 1.2, 0 = stay put).
 *  Everyone breathes and blinks, walkers step (kit/motion.ts), and `data.rim` (l | r | red | 0, default r) puts a
 *  rim light in the colour of `data.light` on them (kit/light.tsx). Episodes wrap it with their roster: see temple-boy/cast.tsx. */
export const Actors: React.FC<ActorsProps> = ({p, roster, speaking, cast, floor, pxPerCm, tint, chairs}) => {
  const list: Actor[] = ((cast ?? p.shot.data?.cast ?? []) as string[]).map(parseActor);
  const talking = speaking(p.shot, p.f, p.len);
  // only the speaker's mouth moves: `talk` on anyone else (a listener, the far end of a phone call, a narrated shot) stays shut.
  // A numbered variant speaks for its base id (win19 for win).
  const speaker = p.shot.who;
  const ownsLine = (who: string) => !!speaker && (who === speaker || who.replace(/\d+$/, '') === speaker);
  const d = p.shot.data ?? {};
  const move: number[] | undefined = d.move;
  return (
    <>
      {list.map((a, i) => {
        const r = roster[a.who];
        if (!r) return null;
        let x = a.x;
        if (i === 0 && move) x = move[0] + (move[1] - move[0]) * Math.min(1, p.f / p.len);
        const bodyH = a.h ?? r.cm * pxPerCm;
        const seed = seedOf(a.who) + i;
        // walkers step (bob, rock, squash) instead of sliding; a walker with no `move` drifts slowly the way it faces
        const walking = a.pose === 'walk' || a.pose === 'run';
        const speed = i === 0 && move ? (move[1] - move[0]) / Math.max(1, p.len) : 0;
        const dir: 1 | -1 = speed ? (speed > 0 ? 1 : -1) : a.flip ? -1 : 1;
        if (walking && !(i === 0 && move) && d.drift !== 0) x += dir * (d.drift ?? 1.2) * p.f;
        const run = a.pose === 'run';
        const sym = r.symbol(a.pose);
        const plan = walking && !r.sil ? rigPlan(sym) : undefined;
        const m = walking ? gait(p.f, bodyH, speed, dir, run, seed, rigHasLegs(plan)) : a.pose === 'lie' ? undefined : breathe(p.f, seed);
        let body: ActorProps['body'];
        if (plan && m?.phase !== undefined) {
          // the rig is drawn inside the (maybe flipped) symbol frame, so its own direction flips with it
          const local: 1 | -1 = a.flip ? (-dir as 1 | -1) : dir;
          const holdR = !!a.prop && !a.arm;
          body = {node: <RigBody plan={plan} phase={m.phase} dir={local} run={run} holdR={holdR} />, layerT: LAYER_T[plan.base]};
          m.dy += rigDrop(plan, m.phase, local, run) * (bodyH / 520);
        }
        const rim = rimFilter(a.rim ?? d.rim ?? 'r', d.light ?? 'night', bodyH / 500);
        const filter = [rim, tint].filter(Boolean).join(' ') || undefined;
        const w = (a.pose === 'sit' ? 1.0 : 0.75) * r.cm * pxPerCm * 0.42;
        return (
          <React.Fragment key={i}>
            {chairs && a.pose === 'sit' && !r.sil && <SeatChair x={x} y={a.y ?? floor} h={bodyH} o={a.o} {...(typeof chairs === 'object' ? chairs : {})} />}
            {!r.noShadow && !r.sil && <FloorShadow x={x} w={w * (m?.shadow ?? 1)} y={a.y ?? floor} />}
            <ActorView a={{...a, x}} roster={roster} floor={floor} pxPerCm={pxPerCm} f={p.f} talking={talking && ownsLine(a.who)} blink={blinkAt(p.f, seed)} body={body}
              style={{filter, transform: m && motionCss(m), transformOrigin: '50% 100%'}} />
          </React.Fragment>
        );
      })}
    </>
  );
};

/** Scale that keeps a W×H frame covered after rotating its content by `deg` (no empty corners). */
export const tiltCover = (deg: number, W: number, H: number) => {
  const r = (Math.abs(deg) * Math.PI) / 180;
  return Math.cos(r) + (Math.max(W, H) / Math.min(W, H)) * Math.sin(r);
};

/** `data.tilt` → degrees at frame f: a number, or [from, to] eased across the shot (a slow drift into a Dutch angle). */
export function tiltAt(f: number, len: number, tilt: number | number[] | undefined) {
  if (tilt === undefined) return 0;
  if (typeof tilt === 'number') return tilt;
  const [a, b = a] = tilt;
  return a + (b - a) * kf(f, [[0, 0], [len, 1]]);
}

/** Dutch angle: rotates the camera (everything inside) around the frame centre and scales up so no corner shows.
 *  Use 5–8°; keep one direction for a whole scene (cinematography.md S9). Cards and HUD stay outside it. */
export const Tilt: React.FC<{deg: number; W: number; H: number; children: React.ReactNode}> = ({deg, W, H, children}) =>
  deg ? (
    <div style={{position: 'absolute', inset: 0, transformOrigin: `${W / 2}px ${H / 2}px`, transform: `rotate(${deg}deg) scale(${tiltCover(deg, W, H)})`}}>{children}</div>
  ) : <>{children}</>;

/** Foreground layer (cinematography.md §5): drawn in frame px, soft and dark, moving `k` × more than the world on a
 *  pan / push so it reads as nearer than the cast. `shift` = [dx, dy] in frame px, `scale` about the frame centre
 *  (Stage computes both from the camera; pass them yourself in a scene that has no Stage). */
export const Fore: React.FC<{children: React.ReactNode; shift?: [number, number]; scale?: number; blur?: number; dark?: number}> = ({children, shift = [0, 0], scale = 1, blur = 7, dark = 0.45}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', transform: `translate(${shift[0]}px, ${shift[1]}px) scale(${scale})`,
    filter: `blur(${blur}px) brightness(${dark})`}}>{children}</div>
);

/** small time chip, top-left, fades in */
export const ClockChip: React.FC<{text: string; f: number}> = ({text, f}) => (
  <Hud text={text} x={60} y={50} style={{transform: 'scale(.82)', transformOrigin: '0 0', opacity: Math.min(1, f / 10) * 0.92}} />
);

/** Standard landscape shot: `world` under the camera (data.cam ?? presets?.[view] ?? cam), light grade (data.light ?? light), flashback
 *  filter (data.past), grain and the HUD clock (data.hud). Auto-frames close-ups if data.cam is omitted. */
export const Stage: React.FC<{
  p: ShotProps;
  world: React.ReactNode;
  over?: React.ReactNode;
  light?: string;
  cam?: number[];
  presets?: Record<string, number[]>;
  bg?: string;
  grain?: number;
  /** foreground layer in frame px (door edge, net, OTS shoulder): blurred, darkened, parallax `foreK` × the camera */
  fore?: React.ReactNode;
  foreK?: number;
  foreBlur?: number;
  foreDark?: number;
}> = ({
  p, world, over, light, cam, presets, bg = "#07090d", grain = 0.12, fore, foreK = 0.4, foreBlur, foreDark,
}) => {
  const d = p.shot.data ?? {};
  const v = p.shot.view ?? "";
  let effectiveCam = d.cam ?? presets?.[v] ?? cam;

  // Auto-focus on speaker/target actor if this is a close-up and no camera was provided
  if (!effectiveCam && (v.endsWith("-close") || v === "close")) {
    const rawCast = (d.cast as string[] | undefined) ?? [];
    if (rawCast.length > 0) {
      const targetWho = p.shot.who || v.replace(/-close$/, "");
      const parsed = rawCast.map(parseActor);
      const matched = parsed.find(a => a.who === targetWho) || (parsed.length === 1 ? parsed[0] : undefined);
      if (matched) {
        const isSit = matched.pose === "sit" || matched.pose === "crouch";
        effectiveCam = [1.75, 1.82, matched.x, isSit ? 590 : 490];
      }
    }
  }

  const c = camAt(p.f, p.len, effectiveCam);
  const past = !!d.past;
  const deg = tiltAt(p.f, p.len, d.tilt);
  // foreground parallax: the FG travels (1 + foreK) × as far as the world does on a pan, and grows faster on a push
  const c0 = camAt(0, p.len, effectiveCam);
  const k1 = 1 + foreK;
  const foreShift: [number, number] = [-(c.cx - c0.cx) * c.z * k1, -(c.cy - c0.cy) * c.z * k1];
  const foreScale = Math.pow(c.z / c0.z, k1);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, filter: past ? PAST_FILTER : undefined}}>
        <Tilt deg={deg} W={p.W} H={p.H}>
          <Cam W={p.W} H={p.H} z={c.z} cx={c.cx} cy={c.cy}>{world}</Cam>
          {fore && <Fore shift={foreShift} scale={foreScale} blur={foreBlur} dark={foreDark}>{fore}</Fore>}
        </Tilt>
        <Grade light={light ?? d.light} past={past} />
        {over}
      </div>
      <Grain f={p.f} opacity={past ? 0.24 : grain} />
      {d.hud && <ClockChip text={d.hud} f={p.f} />}
    </AbsoluteFill>
  );
};

/** a flat full-frame insert (close-ups): Stage with a slow push z[0]→z[1] on (ox, oy) */
export const Plate: React.FC<{p: ShotProps; children: React.ReactNode; bg?: string; light?: string; z?: [number, number]; ox?: number; oy?: number}> = ({
  p, children, bg = '#0b0d10', light, z = [1, 1.06], ox = 960, oy = 540,
}) => (
  <Stage p={p} bg={bg} light={light ?? (p.shot.data?.light === 'dark' ? 'dark' : 'lamp')} cam={[z[0], z[1], ox, oy]} world={children} />
);

/** absolutely positioned helper */
export const at = (x: number, y: number, children: React.ReactNode, style?: React.CSSProperties) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);
