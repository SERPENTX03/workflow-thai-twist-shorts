import React from 'react';
import {CAST_ANCHORED, CAST_SIZE, type CastId} from './CastSprite';
import {HEIGHT_CM} from '../engine/theme';

export type SpriteVars = Partial<{
  skin: string; skinD: string; hair: string; shirt: string; pants: string; top: string; skirt: string;
  exo: string; sarong: string; eye: string; eyeWhite: string; shoe: string; uniform: string; coat: string;
  crowd: string; crowdFar: string; mouth: string; brow: string;
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
};

const SLEEVE: Record<string, string> = {
  man: 'var(--shirt, #2f5f8f)', 'man-wide': 'var(--shirt, #2f5f8f)', 'man-raise': 'var(--shirt, #2f5f8f)',
  woman: 'var(--top, #d9c9a8)', auntie: 'var(--top, #d9c9a8)', raincoat: 'var(--coat, #f2c230)',
  kid: 'var(--uniform, #f4f4f0)', 'kid-girl': 'var(--uniform, #f4f4f0)', student: 'var(--uniform, #f4f4f0)',
  elder: 'var(--exo, #e9e4d6)',
};

/** One cast symbol. Needs <CastSprite/> mounted somewhere in the composition. */
const SIL = ['skin', 'skin-d', 'hair', 'shirt', 'pants', 'top', 'skirt', 'exo', 'sarong', 'shoe', 'eye', 'eye-white', 'hair-old', 'band',
  'sleeve', 'forearm', 'uniform', 'shorts', 'sock', 'tie', 'badge', 'cap', 'cap-d', 'mask', 'bandage', 'blood', 'scarf', 'bag', 'bag-d',
  'bag-strap', 'pack', 'roll', 'strap', 'frame', 'brow', 'mouth', 'blush', 'tear', 'coat', 'coat-d', 'fur', 'fur-patch', 'nose'];

export const Sprite: React.FC<SpriteProps> = ({id, height, vars, hideFace, hideMouth, hideArmL, hideArmR, flip, silhouette, style, layers = []}) => {
  const anchored = CAST_ANCHORED.includes(id);
  const [w, h] = anchored ? [180, 180] : CAST_SIZE[id];
  const css: Record<string, string> = {};
  if (SLEEVE[id]) css['--sleeve'] = SLEEVE[id];
  if (silhouette) for (const k of SIL) css['--' + k] = '#05070b';
  if (hideFace) css['--face-rest'] = 'none';
  if (hideMouth) css['--mouth-rest'] = 'none';
  if (hideArmL) css['--arm-l-rest'] = 'none';
  if (hideArmR) css['--arm-r-rest'] = 'none';
  for (const [k, v] of Object.entries(vars ?? {})) css[cssVar(k)] = v;
  const scale = height ? height / h : 1;
  return (
    <svg
      viewBox={anchored ? '-90 -90 180 180' : `0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...(css as React.CSSProperties), ...style}}
    >
      <use href={`#${id}`} />
      {layers.map(l => <use key={l} href={`#${l}`} />)}
    </svg>
  );
};

/** Pixel height of a person at true relative height (adult 170 cm = 520 units). */
export const personHeight = (id: string, pxPerCm = 3.06) => (HEIGHT_CM[id] ?? 170) * pxPerCm;
