import {wardrobe} from './outfitPresets';
import {castDefaults} from './defaults';
import React from 'react';
import {CAST_ANCHORED, CAST_SIZE, type CastId} from './CastSprite';
import {HEIGHT_CM} from '../engine/theme';
import {inkFor, rimFilter} from '../kit/light';
import {layerRole, PoseFigure, restPose, type Pose} from './Pose';
import {rigPlan} from './Rig';

export type SpriteVars = Partial<{
  skin: string; skinD: string; hair: string; shirt: string; pants: string; top: string; skirt: string;
  exo: string; sarong: string; eye: string; eyeWhite: string; shoe: string; uniform: string; coat: string;
  crowd: string; crowdFar: string; mouth: string; brow: string; robe: string; robeD: string; stubble: string; cat: string; catH: string; catD: string; lamp: string;
  sleeve: string; forearm: string;
}>;

const cssVar = (k: string) => '--' + k.replace(/[A-Z]/g, c => '-' + c.toLowerCase());

export type SpriteProps = {
  id: CastId;
  /** rendered height in px; width follows the symbol's viewBox. Default = native units. */
  height?: number;
  vars?: SpriteVars;
  hideFace?: boolean; hideMouth?: boolean; hideArmL?: boolean; hideArmR?: boolean;
  flip?: boolean;
  /** same figure with no features: a shadow, a reflection, a ghost */
  silhouette?: boolean;
  style?: React.CSSProperties;
  /** extra symbols drawn on top in the same frame (face / mouth / accessory / mark / arm) */
  layers?: CastId[];
  /** Optional outfit override; none removes the default garment. Other accessories do not replace it. */
  outfit?: CastId | 'none';
  /** Replace the character's default accessories, or pass [] to remove them. */
  accessories?: CastId[];
  /** rim light: 'l' | 'r' | 'red' (see kit/light.tsx rimFilter); colour comes from `light`, a grade name (night, lamp, dusk…) */
  rim?: string;
  light?: string;
  /** ink outline around the whole figure, px at a 500 px adult (scales with height); true = 4. Colour follows `light` (kit/light.tsx inkFor) unless `outlineColor` is set */
  outline?: boolean | number;
  outlineColor?: string;
  /** swap the hairstyle on any standard head: 'short' | 'messy' | 'side' | 'buzz' | 'ponytail' | 'bob' | 'receding' |
   *  'crop' | 'bun' | 'tufts' (cast.svg hair-*). Colour with vars.hair. Not on back views. */
  hair?: string;
  /** transform for the front layers, e.g. 'translate(0 160)' for faces on `man-crouch` (see cast-library.md → poses) */
  layerTransform?: string;
  /** the pose rig (cast/Pose.tsx): turn three-quarter and move the arms, on any standing person —
   *  {yaw: 0.4, armR: ARM_PRESETS.raise, headTilt: 6} or a frame of poseAt(). Missing fields stay at rest. */
  pose?: Partial<Pose>;
  /** grip prop (prop-* without the prefix) in the posed right / left hand */
  propR?: string;
  propL?: string;
};

/** layers drawn BEHIND the figure (before the body symbol) */
const BEHIND: string[] = ['acc-backpack'];

const SLEEVE: Record<string, string> = {
  din: 'var(--shirt, #2f5f8f)',
  man: 'var(--shirt, #2f5f8f)',
  woman: 'var(--top, #d9c9a8)', auntie: 'var(--top, #d9c9a8)', raincoat: 'var(--coat, #f2c230)',
  kid: 'var(--shirt, #2f5f8f)', 'kid-girl': 'var(--shirt, #e8a0b4)', student: 'var(--shirt, #2f5f8f)',
  elder: 'var(--exo, #e9e4d6)',
  monk: 'var(--robe, #c8782a)', 'monk-sit': 'var(--robe, #c8782a)', novice: 'var(--robe, #de8728)', 'auntie-sit': 'var(--top, #d9c9a8)',
};

/** One cast symbol. Needs <CastSprite/> mounted somewhere in the composition. */
const SIL = ['skin', 'skin-d', 'hair', 'shirt', 'pants', 'top', 'skirt', 'exo', 'sarong', 'shoe', 'eye', 'eye-white', 'hair-old', 'band',
  'sleeve', 'forearm', 'uniform', 'shorts', 'sock', 'tie', 'badge', 'cap', 'cap-d', 'mask', 'bandage', 'blood', 'scarf', 'bag', 'bag-d',
  'detail', 'vest', 'trim', 'apron', 'bag-strap', 'pack', 'roll', 'strap', 'frame', 'brow', 'mouth', 'blush', 'tear', 'coat', 'coat-d', 'fur', 'fur-patch', 'nose', 'bow', 'tattoo', 'jewel', 'red'];

export const Sprite: React.FC<SpriteProps> = ({id, height, vars, hideFace, hideMouth, hideArmL, hideArmR, flip, silhouette, style, layers = [], outfit: outfitOverride, accessories, layerTransform, rim, light = 'night', outline, outlineColor, hair, pose, propR, propL}) => {
  const defaults = castDefaults(id);
  const garment = outfitOverride === 'none' ? undefined : outfitOverride ?? defaults.defaultOutfit;
  if (garment && !layers.some(l => wardrobe[l])) layers = [garment as CastId, ...layers];
  layers = [...new Set([...layers, ...(accessories ?? defaults.defaultAccessories ?? []) as CastId[]])];
  if (hideArmL) layers = layers.filter(layer => layer !== 'acc-wristwatch');
  layerTransform ??= defaults.layerTransform;
  const anchored = CAST_ANCHORED.includes(id);
  const [w, h] = anchored ? [180, 180] : CAST_SIZE[id];
  const css: Record<string, string> = {};
  for (const [key, value] of Object.entries(defaults.defaultVars ?? {})) css[cssVar(key)] = value;
  if (SLEEVE[id]) css['--sleeve'] = SLEEVE[id];
  for (const layer of layers) {
    const outfit = wardrobe[layer];
    if (outfit) {
      for (const [key, color] of Object.entries(outfit.vars)) css[cssVar(key)] = color;
      css['--sleeve'] = outfit.vars.shirt;
    }
  }
  if (!layers.some(layer => wardrobe[layer] && layer !== defaults.defaultOutfit)) {
    for (const [key, value] of Object.entries(defaults.defaultVars ?? {})) css[cssVar(key)] = value;
    if (defaults.defaultVars?.shirt) css['--sleeve'] = defaults.defaultVars.shirt;
  }
  if (silhouette) for (const k of SIL) css['--' + k] = '#05070b';
  const swapHair = !!hair && !id.endsWith('-back') && !silhouette;
  if (swapHair) css['--hair-rest'] = 'none';
  if (hideFace) css['--face-rest'] = 'none';
  if (hideMouth) css['--mouth-rest'] = 'none';
  if (hideArmL) css['--arm-l-rest'] = 'none';
  if (hideArmR) css['--arm-r-rest'] = 'none';
  for (const [k, v] of Object.entries(vars ?? {})) css[cssVar(k)] = v;
  if (vars?.shirt || vars?.top) {
    if (!vars?.sleeve) {
      css['--sleeve'] = css['--shirt'] ?? css['--top'];
    }
  }
  if (vars?.skin && !vars?.forearm && defaults.defaultVars?.forearm === defaults.defaultVars?.skin) {
    css['--forearm'] = css['--skin'];
  }
  const scale = height ? height / h : 1;
  // rim scales with the figure (rimFilter's k = 1 for a 500 px adult); a silhouette (a shadow, a ghost) gets none
  const rimCss = rim && !silhouette ? rimFilter(rim, light, (height ?? h) / 500) : undefined;
  const lineCss = outline ? outlineFilter(outline === true ? 4 : outline, (height ?? h) / 500, outlineColor ?? inkFor(light)) : undefined;
  const filter = [lineCss, rimCss].filter(Boolean).join(' ') || undefined;
  const plan = pose ? rigPlan(id) : undefined;
  let content: React.ReactNode;
  if (plan && pose) {
    // posed: the same layers, sorted onto the face, the skull or the body (cast/Pose.tsx)
    const full: Pose = {...restPose(plan), ...pose};
    if (hideArmL && pose.armL === undefined) full.armL = null;
    if (hideArmR && pose.armR === undefined) full.armR = null;
    const pick = (role: string) => layers.filter(l => layerRole(l) === role && !BEHIND.includes(l)).map(l => (
      <use key={l} href={`#${l}`} width={wardrobe[l] ? CAST_SIZE[l][0] : undefined} height={wardrobe[l] ? CAST_SIZE[l][1] : undefined} />
    ));
    content = (
      <PoseFigure sym={id} pose={full} hair={swapHair ? hair : undefined} lt={layerTransform}
        ownFace={!hideFace && !layers.some(l => l.startsWith('face-'))} watch={layers.includes('acc-wristwatch' as CastId) && !hideArmL}
        propR={propR} propL={propL}
        under={layers.filter(l => BEHIND.includes(l)).map(l => <use key={l} href={`#${l}`} />)}
        face={<g transform={layerTransform}>{pick('face')}</g>}
        hat={<g transform={layerTransform}>{pick('hat')}</g>}
        body={<g transform={layerTransform}>{pick('body')}</g>}
        over={<g transform={layerTransform}>{pick('arm')}</g>} />
    );
  }
  return (
    <svg
      viewBox={anchored ? '-90 -90 180 180' : `0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, filter, ...(css as React.CSSProperties), ...style}}
    >
      {content ?? (
        <>
          {layers.filter(l => BEHIND.includes(l)).map(l => <use key={l} href={`#${l}`} />)}
          <use href={`#${id}`} />
          <g transform={layerTransform}>
            {swapHair && <HairLayer hair={hair!} />}
            {layers.filter(l => !BEHIND.includes(l)).map(l => <use key={l} href={`#${l}`} width={wardrobe[l] ? CAST_SIZE[l][0] : undefined} height={wardrobe[l] ? CAST_SIZE[l][1] : undefined} />)}
          </g>
        </>
      )}
    </svg>
  );
};

/** An ink outline around a figure's silhouette: four hard drop-shadows, each built on the last, so the line follows
 *  every shape (head, hands, props) as one edge. `w` px at a 500 px adult, scaled by `k`. */
export const outlineFilter = (w: number, k = 1, color = '#15121c') => {
  const t = Math.max(1, w * k).toFixed(1);
  return [`${t}px 0`, `-${t}px 0`, `0 ${t}px`, `0 -${t}px`].map(o => `drop-shadow(${o} 0 ${color})`).join(' ');
};

/** hairstyles that cover the ears; every other one gets the ears drawn back over it */
const COVERS_EARS = new Set(['bob']);
/** A swapped-in hairstyle (cast.svg hair-*) on the standard head, with the ears back on top unless it covers them. */
export const HairLayer: React.FC<{hair: string}> = ({hair}) => (
  <>
    <use href={`#hair-${hair}`} />
    {!COVERS_EARS.has(hair) && <use href="#ears" />}
  </>
);

/** Pixel height of a person at true relative height (adult 170 cm = 520 units). */
export const personHeight = (id: string, pxPerCm = 3.06) => (HEIGHT_CM[id] ?? 170) * pxPerCm;
