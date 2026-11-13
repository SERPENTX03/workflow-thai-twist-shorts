import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {Actors as StageActors, makeSpeaking, type RosterEntry} from '../../kit/stage';
import {FLOOR} from '../../kit/world';
import {NameTag, Shot as KitShot} from '../../kit/frame';
import type {CastId} from '../../cast/CastSprite';
import timeline from '../../../episodes/fifth-room/timeline.json';

// ห้องที่ห้า: roster (brief.md → Speakers). Symbols from src/cast.json, active entries only. Traits that are clues show
// through `extra` on every appearance a pose can carry them:
//   rin      steel tape in its yellow case at the right hip
//   chaloem  green rubber boots (the short right little finger is big enough to read only in the hand inserts)
//   thawat   polished black shoes
// A numbered variant speaks for its base id: chaloem2 has no boots for the poses that fold the legs.

export const PX_CM = 3.0;

export const C = {
  skinR: '#e6b993', sleeveR: '#e8b93a',
  skinC: '#e0b08c', skinCD: '#b98c6a', shirtC: '#36494e',
  boot: '#3f7a46', bootD: '#26502d', bootL: '#6aa56f', mud: '#3a2f22',
  tape: '#e8c21f', tapeD: '#8f7410',
  shoe: '#0c0c10', shoeL: '#62656e',
  skinN: '#d9b79c', skinND: '#b4917a', faded: '#7d6a68', fadedP: '#8d9188', fadedT: '#7e8691',
  plaster: '#a39a85', plasterD: '#6d6656', roof: '#6d3f30', roofD: '#43261d', wood: '#57402c', woodD: '#2c1f14', iron: '#26282c',
};

const hasFront = (s: string) => !s.endsWith('-back');

const Tape: React.FC<{sym: string}> = ({sym}) => hasFront(sym) ? (
  <g>
    <rect x={132} y={268} width={26} height={26} rx={5} fill={C.tape} stroke={C.tapeD} strokeWidth={2.5} />
    <rect x={137} y={288} width={16} height={6} fill="#3a3a3a" />
  </g>
) : null;

const Boots: React.FC<{sym: string}> = () => (
  <g>
    <path d="M64 420 H98 L100 508 Q100 518 88 518 H56 Q50 518 54 508 Z" fill={C.boot} stroke={C.bootD} strokeWidth={3} />
    <path d="M102 420 H136 L146 508 Q150 518 144 518 H112 Q100 518 100 508 Z" fill={C.boot} stroke={C.bootD} strokeWidth={3} />
    <path d="M66 428 H96 M104 428 H134" stroke={C.bootL} strokeWidth={4} />
    <path d="M56 510 h44 M104 510 h44" stroke={C.mud} strokeWidth={8} opacity={0.8} />
  </g>
);

const Shoes: React.FC = () => (
  <g>
    <path d="M58 496 H98 V514 Q98 519 90 519 H52 Q46 516 58 496 Z" fill={C.shoe} />
    <path d="M102 496 H142 Q154 516 148 519 H110 Q102 519 102 514 Z" fill={C.shoe} />
    <path d="M60 508 q12 -5 24 -3 M118 505 q12 -2 24 3" stroke={C.shoeL} strokeWidth={3} fill="none" />
  </g>
);

const man = (id: string, cm: number, vars: Record<string, string>, extra?: RosterEntry['extra']): RosterEntry => ({cm, symbol: () => id as CastId, vars, extra});

export const ROSTER: Record<string, RosterEntry> = {
  rin: man('lead-female-A', 160, {}, s => <Tape sym={s} />),
  rin2: man('lead-female-A', 160, {}),
  chaloem: man('father-A', 170, {skin: C.skinC, 'skin-d': C.skinCD, forearm: C.skinC}, () => <Boots sym="" />),
  chaloem2: man('father-A', 170, {skin: C.skinC, 'skin-d': C.skinCD, forearm: C.skinC}),
  thawat: man('villain-male-A', 172, {}, () => <Shoes />),
  nim: man('aunt-family-B', 150, {}),
  wichai: man('police-A', 172, {}),
  police2: man('police-B', 175, {}),
  napa: man('mother-A', 158, {shirt: C.faded, sleeve: C.faded, forearm: C.skinN, skin: C.skinN, 'skin-d': C.skinND, skirt: '#403a3c', pants: '#403a3c', hair: '#1d181b'}),
  prae: man('sister-A', 156, {shirt: C.fadedP, sleeve: C.fadedP, forearm: C.skinN, skin: C.skinN, 'skin-d': C.skinND, skirt: '#3b3f46', pants: '#3b3f46'}),
  ton: man('younger-brother-A', 122, {shirt: C.fadedT, sleeve: C.fadedT, forearm: C.skinN, skin: C.skinN, 'skin-d': C.skinND}),
  manop: man('father-B', 175, {}),
  yai: man('paternal-grandmother-A', 150, {}),
  lan: man('younger-sister-B', 125, {}),
  rinpast: man('lead-female-A', 160, {}),
  hunter: man('villain-male-A', 172, {}, () => <Shoes />),
};
for (const k of Object.keys(ROSTER)) ROSTER[`${k}-sil`] = {...ROSTER[k], sil: true, extra: undefined};

export const speaking = makeSpeaking(timeline);

const isSil = (c: string) => c.split(/[@ ]/)[0].endsWith('-sil');

export const Actors: React.FC<{p: ShotProps; cast?: string[]; floor?: number; pxPerCm?: number; tint?: string}> = ({p, cast, floor = FLOOR, pxPerCm = PX_CM, tint}) => {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const list = (cast ?? d.cast ?? []) as string[];
  const z = (d.cam as number[] | undefined)?.[0] ?? 1;
  // a close-up gets its side light from the frame's shade, not from a glowing outline
  const q = z >= 2.3 && d.rim === undefined ? {...p, shot: {...p.shot, data: {...d, rim: 0}}} : p;
  const lit = list.filter(c => !isSil(c)), sil = list.filter(isSil);
  return (
    <>
      {sil.length > 0 && <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(0.05)'}}><StageActors p={{...q, shot: {...q.shot, data: {...(q.shot.data ?? {}), rim: 0}}}} roster={ROSTER} speaking={speaking} cast={sil} floor={floor} pxPerCm={pxPerCm} chairs={false} /></div>}
      {lit.length > 0 && <StageActors p={q} roster={ROSTER} speaking={speaking} cast={lit} floor={floor} pxPerCm={pxPerCm} tint={tint} chairs={d.seat === true} />}
    </>
  );
};

/** over-the-shoulder foreground from data.foreShoulder ('l' | 'r'), data.foreColor (shirt), data.foreHair (back of the head) */
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
  return <KitShot {...props} fore={fore} foreBlur={props.foreBlur ?? 9} foreDark={props.foreDark ?? 0.5} roster={ROSTER} />;
};
export {NameTag};
