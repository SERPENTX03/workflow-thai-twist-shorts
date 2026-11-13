import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {Actors as StageActors, makeSpeaking, type ChairKind, type RosterEntry} from '../../kit/stage';
import {FLOOR} from '../../kit/world';
import {NameTag, Shot as KitShot} from '../../kit/frame';
import type {CastId} from '../../cast/CastSprite';
import timeline from '../../../episodes/bed-two/timeline.json';

// พยาบาลเวรดึก: roster (brief.md → Speakers). Symbols from src/cast.json, active entries only. Traits drawn on every
// appearance a pose can carry them (sprite space 200 × 520, the character faces the viewer):
//   may    white nurse uniform, the old silver fob watch pinned on her left chest (screen right)
//   nuan   white uniform, the senior cap with two black stripes, the green marker in her right chest pocket (screen left)
//   ton    white coat over light-blue scrubs, the ID card turned backwards on its lanyard
//   phon   khaki guard uniform, the big ring of keys on his belt
//   wora   in bed: pale blue hospital gown · as the director (portrait, clip, flashback): a dark suit
// A numbered variant (may2…) is the same person without the extra, for poses that fold the body.

export const PX_CM = 3.0;

export const C = {
  white: '#eef0ee', whiteD: '#c9cdcc', cap: '#f6f7f4', stripe: '#1b1b20',
  watch: '#c8ccd2', watchD: '#6d737c', green: '#2f9a4e', greenD: '#1c5f30',
  coat: '#f1f2ef', scrub: '#8fb7cf', card: '#e9e4d2', lanyard: '#2b5aa8',
  khaki: '#9b8a5c', khakiD: '#6e6140', key: '#c9b26a', keyD: '#7b6a33',
  gown: '#a9c4d6', gownD: '#7f9db1', suit: '#2f343c', suitD: '#1d2027',
  grey: '#5b5f66', greyD: '#3a3d43', black: '#1d1c22', dress: '#24232a',
  skinW: '#d9b39a', skinWD: '#b48d74', hairG: '#bdb9b0',
};

const front = (s: string) => !s.endsWith('-back');

const Watch: React.FC<{sym: string}> = ({sym}) => front(sym) ? (
  <g>
    <path d="M124 166 q6 10 4 22" stroke={C.watchD} strokeWidth={2.5} fill="none" />
    <circle cx={128} cy={196} r={10} fill={C.watch} stroke={C.watchD} strokeWidth={2.5} />
    <circle cx={128} cy={196} r={5.5} fill="#f7f6ef" />
  </g>
) : null;

const Cap: React.FC = () => (
  <g>
    <path d="M62 48 Q100 22 138 48 L132 70 Q100 60 68 70 Z" fill={C.cap} stroke={C.whiteD} strokeWidth={2} />
    <rect x={70} y={52} width={60} height={4} fill={C.stripe} />
    <rect x={70} y={59} width={60} height={4} fill={C.stripe} />
  </g>
);

const Marker: React.FC<{sym: string}> = ({sym}) => front(sym) ? (
  <g>
    <rect x={66} y={176} width={22} height={18} rx={2} fill={C.whiteD} opacity={0.7} />
    <rect x={72} y={160} width={8} height={26} rx={3} fill={C.green} stroke={C.greenD} strokeWidth={1.5} />
  </g>
) : null;

const IdBack: React.FC<{sym: string}> = ({sym}) => front(sym) ? (
  <g>
    <path d="M86 140 L100 196 L114 140" stroke={C.lanyard} strokeWidth={3} fill="none" />
    <rect x={90} y={194} width={20} height={28} rx={2} fill={C.card} stroke="#8c8572" strokeWidth={1.5} />
  </g>
) : null;

const Keys: React.FC<{sym: string}> = ({sym}) => front(sym) ? (
  <g>
    <circle cx={134} cy={282} r={11} fill="none" stroke={C.keyD} strokeWidth={3} />
    {[-30, -5, 20, 45].map((a, i) => <rect key={i} x={132} y={290} width={4} height={18} rx={1} fill={C.key} transform={`rotate(${a} 134 284)`} />)}
  </g>
) : null;

const EyeTape: React.FC = () => (
  <g>
    {[[77, -6], [123, 6]].map(([x, a]) => <rect key={x} x={x - 17} y={68} width={34} height={13} rx={2} fill="#f4f2ea" stroke="#bdb8aa" strokeWidth={1.5} transform={`rotate(${a} ${x} 74)`} />)}
    <rect x={86} y={146} width={28} height={12} rx={4} fill="#e4ecef" stroke="#9aa6aa" strokeWidth={1.5} />
  </g>
);

const man = (id: string, cm: number, vars: Record<string, string>, extra?: RosterEntry['extra']): RosterEntry => ({cm, symbol: () => id as CastId, vars, extra});

const NURSE = {top: C.white, shirt: C.white, sleeve: C.white, skirt: C.white, pants: C.white};

export const ROSTER: Record<string, RosterEntry> = {
  may: man('lead-female-A', 160, NURSE, s => <Watch sym={s} />),
  may2: man('lead-female-A', 160, NURSE),
  nuan: man('mother-B', 163, NURSE, s => <><Cap /><Marker sym={s} /></>),
  nuan2: man('mother-B', 163, NURSE, () => <Cap />),
  pakorn: man('villain-male-B', 175, {shirt: C.grey, sleeve: C.grey, pants: C.greyD}),
  ton: man('lead-male-B', 170, {shirt: C.scrub, sleeve: C.coat, pants: C.scrub}, s => <IdBack sym={s} />),
  phon: man('paternal-grandfather-B', 175, {shirt: C.khaki, sleeve: C.khaki, pants: C.khakiD}, s => <Keys sym={s} />),
  prae: man('sister-B', 163, {shirt: C.dress, sleeve: C.dress, skirt: C.dress, pants: C.dress}),
  wora: man('father-A', 170, {shirt: C.gown, sleeve: C.gown, pants: C.gown, skin: C.skinW, 'skin-d': C.skinWD, forearm: C.skinW, hair: C.hairG}),
  // in bed 1: the white tape over both eyes (clue `tape`) and the trach tube at the throat
  woraT: {...man('father-A', 170, {shirt: C.gown, sleeve: C.gown, pants: C.gown, skin: C.skinW, 'skin-d': C.skinWD, forearm: C.skinW, hair: C.hairG}), face: () => <EyeTape />},
  worasuit: man('father-A', 170, {shirt: C.suit, sleeve: C.suit, pants: C.suitD, hair: C.hairG}),
  nuan3: man('mother-B', 163, {shirt: '#b9a3c9', sleeve: '#b9a3c9', pants: '#6a5a7a', skirt: '#6a5a7a'}),
  chair: man('villain-male-A', 172, {shirt: C.suit, sleeve: C.suit, pants: C.suitD}),
  wichai: man('police-A', 172, {}),
  police2: man('police-B', 175, {}),
  fon: man('sister-A', 158, NURSE),
  somsak: man('na-male-B', 168, {}),
  // canteen extras: hospital staff and visitors at lunch
  diner1: man('na-male-A', 170, {}),
  diner2: man('aunt-family-A', 158, {shirt: '#7a9ac0', sleeve: '#7a9ac0'}),
  diner3: man('na-female-A', 158, NURSE),
  diner4: man('uncle-family-A', 172, {}),
  diner5: man('ar-female-A', 160, {shirt: '#c97a8a', sleeve: '#c97a8a'}),
};
for (const k of Object.keys(ROSTER)) ROSTER[`${k}-sil`] = {...ROSTER[k], sil: true, extra: undefined};

export const speaking = makeSpeaking(timeline);

const isSil = (c: string) => c.split(/[@ ]/)[0].endsWith('-sil');

export const Actors: React.FC<{p: ShotProps; cast?: string[]; floor?: number; pxPerCm?: number; tint?: string}> = ({p, cast, floor = FLOOR, pxPerCm = PX_CM, tint}) => {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const list = (cast ?? d.cast ?? []) as string[];
  const z = (d.cam as number[] | undefined)?.[0] ?? 1;
  const q = z >= 2.3 && d.rim === undefined ? {...p, shot: {...p.shot, data: {...d, rim: 0}}} : p;
  const lit = list.filter(c => !isSil(c)), sil = list.filter(isSil);
  return (
    <>
      {sil.length > 0 && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(0.05)'}}><StageActors p={{...q, shot: {...q.shot, data: {...(q.shot.data ?? {}), rim: 0}}}} roster={ROSTER} speaking={speaking} cast={sil} floor={floor} pxPerCm={pxPerCm} chairs={false} /></div>}
      {lit.length > 0 && <StageActors p={q} roster={ROSTER} speaking={speaking} cast={lit} floor={floor} pxPerCm={pxPerCm} tint={tint} chairs={typeof d.seat === 'string' ? {kind: d.seat as ChairKind} : d.seat === true} />}
    </>
  );
};

/** over-the-shoulder foreground from data.foreShoulder ('l' | 'r'), data.foreColor, data.foreHair */
const ShoulderFore: React.FC<{side: string; color: string; hair?: string}> = ({side, color, hair}) => {
  const x = side === 'r' ? 1700 : 220;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={side === 'r' ? 'M1300 1100 Q1360 760 1620 720 Q1880 700 1960 760 V1100 Z' : 'M620 1100 Q560 760 300 720 Q40 700 -40 760 V1100 Z'} fill={color} />
      {hair && <ellipse cx={side === 'r' ? 1720 : 200} cy={560} rx={150} ry={190} fill={hair} />}
    </svg>
  );
};

export const Shot: React.FC<Omit<React.ComponentProps<typeof KitShot>, 'roster'>> = props => {
  const d = (props.p.shot.data ?? {}) as Record<string, any>;
  const fore = props.fore ?? (d.foreShoulder ? <ShoulderFore side={d.foreShoulder} color={d.foreColor ?? '#14141a'} hair={d.foreHair} /> : undefined);
  return <KitShot {...props} fore={fore} foreBlur={props.foreBlur ?? 9} foreDark={props.foreDark ?? 0.5} roster={ROSTER} />;
};
export {NameTag};
