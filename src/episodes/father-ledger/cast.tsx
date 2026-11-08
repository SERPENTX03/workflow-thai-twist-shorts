import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {Actors as StageActors, makeSpeaking, parseActor, type RosterEntry} from '../../kit/stage';
import {FLOOR} from '../../kit/world';
import {Tag} from '../../kit/ui';
import type {CastId} from '../../cast/CastSprite';
import timeline from '../../../episodes/father-ledger/timeline.json';

// สูตรลับเขียงหมูพ่อ: roster (brief.md → Speakers). Symbols come from src/cast.json, active entries only. Traits that are
// clues show on every appearance through `extra`, so a pose never has to re-draw them:
//   charn    right-shoulder burn scar, amulet on a dark cord, stained white T-shirt, thin (narrow scale on the rig)
//   phannee  white lace dress, gold hairpin, a thin line behind the left ear; no line on the face
//   prasit   safari shirt, receding hair, moustache, leather bag (the symbol's own)
// A numbered variant (thyme1) speaks for its base id (stage.tsx ownsLine), which is how Thyme changes clothes.

export const PX_CM = 3.0;

export const C = {
  skinT: '#d9a57f', skinTD: '#b98561',
  suit: '#17181f', suitL: '#2b2d38', shirtW: '#e9e6df', coat: '#e8ebee', gown: '#101116', gownRed: '#8f1f26', gold: '#d9b24c',
  scrub: '#22344f', dayShirt: '#4a5563', dayPants: '#272d38',
  scar: '#b5805f', scarD: '#8c5a42', cord: '#191512',
  tee: '#d8d2c4', teeStain: '#8d3a2c', apron: '#5b4635',
  lace: '#f1ece1', laceD: '#c9c0ae', skinP: '#efd2b6', skinPD: '#d6b08f',
  foam: '#f2efe6', tape: '#b3141c', lotus: '#c79a35', book: '#8c1c20', bookD: '#5c1216',
};

const hasFront = (s: string) => !s.endsWith('-back');

/** the right-shoulder burn (the viewer's left), rough skin showing past the collar of whatever he wears; amulet on its cord */
const CharnBody: React.FC<{sym: string}> = ({sym}) => {
  if (!hasFront(sym)) return null;
  return (
    <g>
      <path d="M58 146 Q100 132 142 146 L146 360 L54 360 Z" fill={C.tee} />
      <path d="M84 146 Q100 196 116 146" stroke={C.cord} strokeWidth={3} fill="none" />
      <rect x={93} y={174} width={14} height={18} rx={3} fill="#a8842f" stroke="#5e4716" strokeWidth={2} />
    </g>
  );
};

const CharnMarks: React.FC<{sym: string}> = ({sym}) => {
  if (!hasFront(sym)) return null;
  return (
    <g>
      <path d="M58 146 Q100 132 142 146 L146 360 L54 360 Z" fill={C.tee} />
      <path d="M78 300 q10 -14 22 -4 q10 8 22 -2 M92 240 q8 -8 16 0" stroke={C.teeStain} strokeWidth={4} fill="none" opacity={0.65} strokeLinecap="round" />
      <path d="M40 152 Q50 140 68 145 L68 172 Q52 180 40 172 Z" fill={C.scar} />
      <path d="M44 156 q10 -5 20 0 M44 164 q10 -5 20 0" stroke={C.scarD} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M84 146 Q100 196 116 146" stroke={C.cord} strokeWidth={3} fill="none" />
      <rect x={93} y={174} width={14} height={18} rx={3} fill="#a8842f" stroke="#5e4716" strokeWidth={2} />
    </g>
  );
};

/** apron over the tee, what a butcher wears: only while he stands behind the block */
const CharnApron: React.FC<{sym: string}> = ({sym}) => {
  if (!hasFront(sym)) return null;
  return <path d="M70 192 L130 192 L142 330 L58 330 Z" fill={C.apron} stroke="#2b2017" strokeWidth={2.5} />;
};

/** the gold pin in the bun and the lace of the bodice: lace reads as a row of small scallops at neck and hem */
const PhanneeLace: React.FC<{sym: string}> = ({sym}) => {
  if (!hasFront(sym)) return null;
  return (
    <g>
      {/* the neck is the age the face is not */}
      <path d="M86 132 q14 5 28 0 M85 140 q15 5 30 0" stroke={C.skinPD} strokeWidth={2.5} fill="none" />
      <path d="M72 156 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0" stroke={C.laceD} strokeWidth={3} fill="none" />
      <path d="M66 210 q8 8 17 0 q8 8 17 0 q8 8 17 0 q8 8 17 0" stroke={C.laceD} strokeWidth={2.5} fill="none" opacity={0.8} />
      <circle cx={100} cy={183} r={6} fill={C.lotus} />
      <path d="M118 8 L150 -14" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
      <circle cx={152} cy={-15} r={6} fill={C.gold} />
    </g>
  );
};

const man = (id: string, cm: number, vars: Record<string, string>, extra?: RosterEntry['extra']): RosterEntry => ({cm, symbol: () => id as CastId, vars, extra});

export const ROSTER: Record<string, RosterEntry> = {
  // Thyme's clothes by day: 0 the shirt he came home in, 1 black funeral suit, 2 white coat on the ward, 3 graduation gown
  thyme: man('lead-male-A', 172, {shirt: C.dayShirt, sleeve: C.dayShirt, forearm: C.skinT, pants: C.dayPants, skin: C.skinT, 'skin-d': C.skinTD}),
  thyme1: man('lead-male-A', 172, {shirt: C.suit, sleeve: C.suit, forearm: C.suit, pants: C.suit, skin: C.skinT, 'skin-d': C.skinTD}),
  thyme2: man('lead-male-A', 172, {shirt: C.coat, sleeve: C.coat, forearm: C.skinT, pants: '#39506a', skin: C.skinT, 'skin-d': C.skinTD}),
  thyme3: man('lead-male-A', 172, {shirt: C.gown, sleeve: C.gown, forearm: C.gown, pants: C.gown, skin: C.skinT, 'skin-d': C.skinTD},
    s => hasFront(s) ? <path d="M76 146 L100 240 L124 146" stroke={C.gownRed} strokeWidth={13} fill="none" /> : null),
  // on the ward: navy scrubs, the white coat stays on the chair
  thyme4: man('lead-male-A', 172, {shirt: C.scrub, sleeve: C.scrub, forearm: C.skinT, pants: C.scrub, skin: C.skinT, 'skin-d': C.skinTD}, s => hasFront(s) ? <g>
    <path d="M58 146 Q100 132 142 146 L146 318 L54 318 Z" fill={C.scrub} />
    <path d="M82 142 L100 182 L118 142 Z" fill={C.skinT} />
    <path d="M82 142 L100 182 L118 142" stroke="#16243a" strokeWidth={4} fill="none" />
    <rect x={110} y={204} width={24} height={26} fill="none" stroke="#16243a" strokeWidth={3} />
  </g> : null),
  thyme15: man('younger-brother-A', 150, {shirt: '#f0eee8', sleeve: '#f0eee8', forearm: '#e8b995', pants: '#2c3545'}),
  charn: man('maternal-grandfather-A', 166, {shirt: C.tee, sleeve: C.tee, forearm: '#d6a57f', pants: '#3b3a38', hair: '#4c463f', skin: '#d6a57f', 'skin-d': '#b4835f'}, s => <><CharnMarks sym={s} /><CharnApron sym={s} /></>),
  // the last two years: thinner, no apron, the same scar and amulet
  charn2: man('maternal-grandfather-A', 166, {shirt: C.tee, sleeve: C.tee, forearm: '#cfa07c', pants: '#3b3a38', hair: '#6b655c', skin: '#cfa07c', 'skin-d': '#a87c5a'}, s => <CharnMarks sym={s} />),
  charn3: man('maternal-grandfather-A', 166, {shirt: C.tee, sleeve: C.tee, forearm: '#cfa07c', pants: '#3b3a38', hair: '#6b655c', skin: '#cfa07c', 'skin-d': '#a87c5a'}, s => <CharnBody sym={s} />),
  phannee: man('villain-female-A', 160, {shirt: C.lace, sleeve: C.lace, forearm: C.skinP, pants: C.lace, top: C.lace, skirt: C.lace, skin: C.skinP, 'skin-d': C.skinPD, hair: '#17131a', jewel: C.lotus}, s => <PhanneeLace sym={s} />),
  prasit: man('uncle-family-A', 170, {hair: '#a8a49c'}),
  pa: man('aunt-family-B', 150, {}),
  undertaker: man('maternal-grandfather-B', 168, {}),
  driver: man('villain-male-B', 182, {shirt: '#14151b', sleeve: '#14151b', forearm: '#14151b', pants: '#14151b'}),
  police: man('police-A', 172, {}),
  police2: man('police-A', 170, {}),
  owner: man('uncle-family-A', 172, {shirt: '#7a6a4e', pants: '#4a4032', hair: '#2c2620'}),
  bearer: man('lead-male-B', 170, {shirt: '#3d3f46', sleeve: '#3d3f46', pants: '#25262c'}),
  bearer2: man('villain-male-A', 170, {shirt: '#55524b', sleeve: '#55524b', pants: '#2a2a2c'}),
  mate: man('younger-brother-A', 150, {shirt: '#f0eee8', sleeve: '#f0eee8', forearm: '#e8b995', pants: '#2c3545', hair: '#1d1a18'}),
};
for (const k of Object.keys(ROSTER)) ROSTER[`${k}-sil`] = {...ROSTER[k], sil: true, extra: undefined};

export const speaking = makeSpeaking(timeline);

/** where an actor's head is in world px, for aiming a close-up at someone who has been moved around the room */
export function headOf(raw: string, floor = FLOOR, ppc = PX_CM) {
  const a = parseActor(raw);
  const H = a.h ?? (ROSTER[a.who]?.cm ?? 170) * ppc, s = H / 520;
  const drop = a.pose === 'sit' ? 110 : a.pose === 'crouch' ? 160 : 0;
  return {x: a.x, y: (a.y ?? floor) - H + (65 + drop) * s, r: 65 * s};
}

const isSil = (c: string) => c.split(/[@ ]/)[0].endsWith('-sil');

export const Actors: React.FC<{p: ShotProps; cast?: string[]; floor?: number; pxPerCm?: number; tint?: string}> = ({p, cast, floor = FLOOR, pxPerCm = PX_CM, tint}) => {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  // her hair is always up, with the gold pin (the symbol's own hairstyle is a bob)
  const list = ((cast ?? d.cast ?? []) as string[]).map(c => (/^phannee[-@]/.test(c) && !/\bhair=/.test(c) ? `${c} hair=bun` : c));
  // a close-up gets its side light from the frame's shade (common.tsx Shot), not from a glowing outline
  const z = (d.cam as number[] | undefined)?.[0] ?? 1;
  const q = z >= 2.3 && d.rim === undefined ? {...p, shot: {...p.shot, data: {...d, rim: 0}}} : p;
  // a silhouette is black all through, buttons, bag and all: the symbols' details have fixed colours
  const lit = list.filter(c => !isSil(c)), sil = list.filter(isSil);
  return (
    <>
      {sil.length > 0 && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(0.05)'}}><StageActors p={{...q, shot: {...q.shot, data: {...(q.shot.data ?? {}), rim: 0}}}} roster={ROSTER} speaking={speaking} cast={sil} floor={floor} pxPerCm={pxPerCm} chairs={false} /></div>}
      {lit.length > 0 && <StageActors p={q} roster={ROSTER} speaking={speaking} cast={lit} floor={floor} pxPerCm={pxPerCm} tint={tint} chairs={d.seat !== false} />}
    </>
  );
};

/** the name tag, in frame px so it keeps its size on a close-up */
export const NameTag: React.FC<{p: ShotProps}> = ({p}) => {
  const tag = ((p.shot.data ?? {}) as Record<string, any>).tag as {name: string; line?: string} | undefined;
  if (!tag) return null;
  return <div style={{position: 'absolute', left: 60, top: 130, transform: 'scale(.95)', transformOrigin: '0 0', whiteSpace: 'nowrap'}}><Tag text={tag.line ? `${tag.name} · ${tag.line}` : tag.name} /></div>;
};
