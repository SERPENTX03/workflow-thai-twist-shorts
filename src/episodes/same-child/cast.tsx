import React from 'react';
import type {ShotProps} from '../../engine/episode';
import type {CastId} from '../../cast/CastSprite';
import {Actors as StageActors, makeSpeaking, parseActor, type RosterEntry} from '../../kit/stage';
import {FLOOR} from '../../kit/world';
import {Tag} from '../../kit/ui';
import timeline from '../../../episodes/same-child/timeline.json';

// หมู่บ้านที่ทุกบ้านมีห้องของเด็กคนเดียวกัน — roster (symbols from src/cast.json, active entries only) and the
// three traits that are clues and must show on every appearance: Ton's chipped front tooth, Prae's blue jacket with
// the crooked elbow patch, Chan's wet trousers.

export const PX_CM = 3.0;

export const C = {
  phak: '#3d5a73',
  prae: '#6f9ccf', praePatch: '#c9b48a',
  rampai: '#8a5a6e',
  mali: '#b9785a',
  ton: '#d8d0b8', tonShorts: '#2f4a6b',
  chan: '#556859',
  pho: '#7a6a4a',
  skin: '#dfa67e', skinD: '#be855e',
};

/** layer offset of a whole-body pose relative to standing (stage.tsx LAYER_T) */
const dy = (sym: string) => (sym === 'man-crouch' ? 160 : sym.endsWith('-sit') ? 108 : 0);

/** Phak: lead-male-A zipped jacket overlay for template poses (man-sit, man-crouch) */
const PhakJacket: React.FC<{sym: string}> = ({sym}) => {
  if (sym !== 'man-sit' && sym !== 'man-crouch') return null;
  const isCrouch = sym === 'man-crouch';
  const t = isCrouch ? 160 : 110;
  return (
    <g transform={`translate(0 ${t})`}>
      {/* white t-shirt collar under jacket */}
      <path d="M85 140 Q100 156 115 140 Z" fill="#f2efe9" />
      {/* navy jacket collar / lapels */}
      <path d="M72 140 L86 140 L95 160 L75 154 Z M128 140 L114 140 L105 160 L125 154 Z" fill="#21466b" stroke="#183452" strokeWidth="2" strokeLinejoin="round" />
      {/* center zipper line - in crouch only down to the arms */}
      <line x1="100" y1="154" x2="100" y2={isCrouch ? 175 : 296} stroke="#183452" strokeWidth="2.5" />
      {/* silver zipper pull */}
      <rect x="98" y="164" width="4" height="9" rx="1.5" fill="#d0d7e0" />
      {/* chest pocket and slant pockets only when chest is visible (in crouch, arms and knees hug over the chest) */}
      {!isCrouch && (
        <>
          <rect x="110" y="184" width="24" height="25" rx="3" fill="#28527a" stroke="#183452" strokeWidth="2" />
          <path d="M110 192 L122 197 L134 192" fill="none" stroke="#183452" strokeWidth="2" />
          <circle cx="122" cy="194" r="2" fill="#d0d7e0" />
          <path d="M68 250 L82 256 M132 250 L118 256" stroke="#183452" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </g>
  );
};

/** Ton: chipped front tooth under the mouth line (talk-m is at y 98) */
const ChippedTooth: React.FC<{sym: string}> = ({sym}) => (
  sym.endsWith('-back') || sym === 'man-lie' ? null : (
    <g transform={`translate(0 ${dy(sym)})`}>
      <polygon points="95,100 105,100 105,107 100,107 98.5,104 95,104" fill="#fbf8ef" stroke="#7a3b34" strokeWidth="1.2" />
    </g>
  )
);

/** Prae: light-blue jacket with the patch Phak ironed on crooked (left elbow from the viewer's side) */
const CrookedPatch: React.FC<{sym: string}> = ({sym}) => {
  if (sym.endsWith('-back')) return null;
  const sit = sym.endsWith('-sit');
  const [cx, cy] = sit ? [154, 344] : [150, 244];
  return (
    <g transform={`translate(${cx} ${cy}) rotate(-24)`}>
      <rect x="-12" y="-9" width="24" height="18" rx="3" fill={C.praePatch} stroke="#6b5a3a" strokeWidth="2" />
      <path d="M-8 -5 H8 M-8 0 H8 M-8 5 H8" stroke="#8f7c56" strokeWidth="1.4" strokeDasharray="2 2" />
    </g>
  );
};

/** Chan: trousers soaked from the knee down (he dragged the fence at the old pier) */
const WetShins: React.FC<{sym: string}> = ({sym}) => {
  if (sym !== 'maternal-grandfather-A' && sym !== 'man-walk' && sym !== 'man-back') return null;
  return (
    <g opacity="0.55">
      <rect x="62" y="402" width="34" height="92" rx="6" fill="#1a2636" />
      <rect x="104" y="402" width="34" height="92" rx="6" fill="#1a2636" />
      <path d="M70 494 v10 M126 494 v12" stroke="#9fc0d8" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
};

const poseMale = (standing: CastId) => (p: string): CastId =>
  (({sit: 'man-sit', back: 'man-back', crouch: 'man-crouch', lie: 'man-lie'} as Record<string, CastId>)[p] ?? standing);
const poseFemale = (standing: CastId, sit: CastId = 'woman-sit') => (p: string): CastId =>
  (({sit, back: 'woman-back', crouch: 'man-crouch', lie: 'man-lie'} as Record<string, CastId>)[p] ?? standing);

export const ROSTER: Record<string, RosterEntry> = {
  phak: {cm: 172, symbol: poseMale('lead-male-A'), vars: {shirt: C.phak, pants: '#24303d', hair: '#1a1a20', skin: C.skin, 'skin-d': C.skinD},
    extra: s => <PhakJacket sym={s} />},
  prae: {cm: 158, symbol: poseFemale('teacher-B'), vars: {top: C.prae, shirt: C.prae, sleeve: C.prae, skirt: '#34405a', pants: '#34405a', hair: '#211a1c', skin: '#e9bd98', 'skin-d': '#c99b78'},
    extra: s => <CrookedPatch sym={s} />},
  rampai: {cm: 150, symbol: poseFemale('aunt-family-B', 'auntie-sit'), vars: {top: C.rampai, shirt: C.rampai, skirt: '#4a3440', pants: '#4a3440', skin: '#d8a27c', 'skin-d': '#b8825c'}},
  mali: {cm: 158, symbol: poseFemale('mother-A'), vars: {top: C.mali, shirt: C.mali, skirt: '#4a3a34', pants: '#4a3a34', skin: '#dcaa84', 'skin-d': '#bc8a64'}},
  ton: {cm: 124, symbol: poseMale('younger-brother-A'), vars: {shirt: C.ton, pants: C.tonShorts, shorts: C.tonShorts, skin: '#dca27a', 'skin-d': '#bc825a'},
    extra: s => <ChippedTooth sym={s} />},
  chan: {cm: 166, symbol: poseMale('maternal-grandfather-A'), vars: {shirt: C.chan, pants: '#3a3a34', skin: '#c99670', 'skin-d': '#a97650'},
    extra: s => <WetShins sym={s} />},
  pho: {cm: 170, symbol: poseMale('uncle-family-B'), vars: {shirt: C.pho, pants: '#3b3226', skin: '#c48c62', 'skin-d': '#a46c42'}},
  guard: {cm: 160, symbol: poseFemale('na-female-B'), vars: {top: '#5d6b7a', shirt: '#5d6b7a', skirt: '#2d3440'}},
  seller: {cm: 168, symbol: poseMale('paternal-grandfather-B'), vars: {}},
  wife: {cm: 156, symbol: poseFemale('maternal-grandmother-A', 'auntie-sit'), vars: {}},
  meter: {cm: 170, symbol: poseMale('mechanic-A'), vars: {}},
  police: {cm: 174, symbol: poseMale('police-A'), vars: {}},
  fon: {cm: 122, symbol: poseFemale('younger-sister-A'), vars: {}},
};

// silhouette twins (`chan-sil`): a figure drawn in one dark colour, for backlit / in-the-shadow shots (view tag -sil)
for (const k of Object.keys(ROSTER)) ROSTER[`${k}-sil`] = {...ROSTER[k], sil: true, extra: undefined};

export const speaking = makeSpeaking(timeline);

/** Episode actor layer + name tags from `shot.data.tag` */
export const Actors: React.FC<{p: ShotProps; cast?: string[]; floor?: number; pxPerCm?: number; tint?: string; chairs?: boolean}> = ({p, cast, floor = FLOOR, pxPerCm = PX_CM, tint, chairs = true}) => {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const tags = d.tag as Record<string, string> | undefined;
  // camera tags (camera.tsx): -pov hides everyone (we see through the viewer's eyes), -ots draws the listener as a
  // foreground shape in Stage instead, -sil turns the named actors into silhouettes
  if ((d.fx as string[] | undefined)?.includes('pov')) return null;
  let list = ((cast ?? d.cast) ?? []) as string[];
  const idOf = (c: string) => c.split(/[@ ]/)[0];
  if (d.ots) list = list.filter(c => idOf(c) !== d.ots);
  if (d.sil) list = list.map(c => ((d.sil as string[]).includes(idOf(c)) ? c.replace(/^[\w]+/, m => `${m}-sil`) : c));
  const parsed = list.map(parseActor);
  return (
    <>
      <StageActors p={p} roster={ROSTER} speaking={speaking} cast={list} floor={floor} pxPerCm={pxPerCm} tint={tint} chairs={chairs ? {wood: '#80593a', dark: '#3a2718', edge: '#a47a4f'} : false} />
      {tags && parsed.map((a, i) => {
        const label = tags[a.who];
        if (!label) return null;
        const low = a.pose === 'sit' || a.pose === 'crouch';
        const hpx = (ROSTER[a.who]?.cm ?? 160) * pxPerCm;
        const top = Math.max(70, (a.y ?? floor) - (low ? hpx * 0.72 : hpx) - 60);
        return (
          <div key={i} style={{position: 'absolute', left: a.x, top, transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none'}}>
            <Tag text={label} />
          </div>
        );
      })}
    </>
  );
};
