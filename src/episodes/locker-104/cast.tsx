import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {Actors as StageActors, makeSpeaking, type RosterEntry} from '../../kit/stage';
import {FLOOR} from '../../kit/world';
import {NameTag, Shot as KitShot} from '../../kit/frame';
import type {CastId} from '../../cast/CastSprite';
import timeline from '../../../episodes/locker-104/timeline.json';

// ล็อคเกอร์ 104: roster (brief.md → Speakers). Symbols from src/cast.json, active entries only.
//   sommai   paternal-grandfather-A, khaki station-master uniform (the scar on the right palm reads only in the hand inserts)
//   theera   detective-A, grey hair; the green raincoat is acc=raincoat in its own colours, the hood an extra layer
//   khem     mechanic-A shop shirt; the yellow signal-box key tag hangs at his left hip on every front view
//   sai      aunt-family-B
//   fon      younger-sister-A (sailor dress, red bows)
// Past versions (2542, 2560) are their own ids so hair and uniform change with the year.

export const PX_CM = 3.0;

export const C = {
  skinS: '#e8b995', skinSD: '#c99374', khaki: '#c8b594', khakiD: '#9c8a68',
  coat: '#56633a', coatD: '#3d4828', coatL: '#71804c',
  shop: '#2f4659', keyTag: '#f2c230', keyTagD: '#a8851c',
  skinT: '#e8b995', skinK: '#e8b995', skinA: '#d9a982',
  tin: '#5b6066', tinD: '#3a3e44', locker: '#5d7466', lockerD: '#3d4f45', lockerL: '#7a9283',
  plank: '#5a4632', plankD: '#33271b', rail: '#7d7f82', railD: '#3f4144', ballast: '#3c3a38',
  neon: '228,246,236', lamp: '255,214,150', fluo: '226,240,236', head: '255,236,170',
  paper: '#e9e0c6', ink: '#27324a', red: '#a32b26', brass: '#c9a24a', brassD: '#8a6b26',
};

const front = (s: string) => !s.endsWith('-back') && !s.endsWith('-sit') && !s.endsWith('-crouch') && !s.endsWith('-lie');

const KeyTag: React.FC<{sym: string}> = ({sym}) => front(sym) ? (
  <g>
    <path d="M136 300 v14" stroke="#8d9095" strokeWidth={3} />
    <circle cx={136} cy={318} r={6} fill="none" stroke="#8d9095" strokeWidth={3} />
    <rect x={128} y={322} width={18} height={30} rx={3} fill={C.keyTag} stroke={C.keyTagD} strokeWidth={2} />
  </g>
) : null;

/** hood up; `hide` sinks the face into the hood's shadow (the man on the platform before he lowers it) */
const Hood: React.FC<{hide?: boolean}> = ({hide}) => (
  <g>
    <use href="#acc-hood" width={200} height={520} />
    {hide && <ellipse cx={100} cy={84} rx={50} ry={54} fill="#0b0d0a" opacity={0.92} />}
  </g>
);

const man = (id: string, cm: number, vars: Record<string, string>, extra?: RosterEntry['extra']): RosterEntry => ({cm, symbol: () => id as CastId, vars, extra});

const THEERA = {hair: '#cfcac0', coat: C.coat, 'coat-d': C.coatD, pants: '#2f2b26'};

export const ROSTER: Record<string, RosterEntry> = {
  sommai: man('paternal-grandfather-A', 170, {shirt: C.khaki, pants: '#4e3e33'}),
  sommai53: man('paternal-grandfather-A', 170, {shirt: C.khaki, pants: '#4e3e33', hair: '#8f8a82'}),
  sommai35: man('paternal-grandfather-A', 170, {shirt: C.khaki, pants: '#4e3e33', hair: '#2a2420'}),
  theera: man('detective-A', 175, THEERA),
  'theera-hood': man('detective-A', 175, THEERA, () => <Hood hide />),
  'theera-hoodup': man('detective-A', 175, THEERA, () => <Hood />),
  theera53: man('detective-A', 175, {...THEERA, hair: '#6f6a64'}),
  theera37: man('detective-A', 175, {hair: '#221d1a', shirt: '#8b7355', pants: '#4a3b2c', coat: C.coat, 'coat-d': C.coatD}),
  khem: man('mechanic-A', 170, {}, s => <KeyTag sym={s} />),
  khem10: man('younger-brother-A', 124, {}),
  sai: man('aunt-family-B', 150, {}),
  sai33: man('aunt-family-B', 150, {hair: '#2b2522'}),
  fon: man('younger-sister-A', 124, {}),
  chod: man('uncle-family-B', 175, {shirt: '#354b61'}),
  guard: man('father-B', 175, {shirt: C.khaki, pants: '#3e3328'}),
};
for (const k of Object.keys(ROSTER)) ROSTER[`${k}-sil`] = {...ROSTER[k], sil: true, extra: undefined};
// the man in the doorway keeps his hood in silhouette: the outline must not show who he is
ROSTER['theera-hood-sil'] = {...ROSTER['theera-hood'], sil: true};

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
      {lit.length > 0 && <StageActors p={q} roster={ROSTER} speaking={speaking} cast={lit} floor={floor} pxPerCm={pxPerCm} tint={tint} chairs={d.seat === true} />}
    </>
  );
};

/** over-the-shoulder foreground from data.foreShoulder ('l' | 'r'), data.foreColor (shirt), data.foreHair */
const ShoulderFore: React.FC<{side: string; color: string; hair?: string}> = ({side, color, hair}) => {
  const x = side === 'r' ? 1700 : 220;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <ellipse cx={x + (side === 'r' ? 60 : -60)} cy={1060} rx={520} ry={420} fill={color} />
      {hair && <ellipse cx={x} cy={520} rx={210} ry={260} fill={hair} />}
    </svg>
  );
};

export const Shot: React.FC<Omit<React.ComponentProps<typeof KitShot>, 'roster'>> = props => {
  const d = (props.p.shot.data ?? {}) as Record<string, any>;
  const fore = props.fore ?? (d.foreShoulder ? <ShoulderFore side={d.foreShoulder} color={d.foreColor ?? '#14141a'} hair={d.foreHair} /> : undefined);
  return <KitShot {...props} fore={fore} foreBlur={props.foreBlur ?? 10} foreDark={props.foreDark ?? (d.foreShoulder ? 0.22 : 0.5)} roster={ROSTER} />;
};
export {NameTag};
