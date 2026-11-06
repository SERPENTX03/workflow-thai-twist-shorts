import React from 'react';
import type {ShotProps} from '../../engine/episode';
import type {CastId} from '../../cast/CastSprite';
import {Actors as StageActors, makeSpeaking, parseActor, talkShape, type RosterEntry} from '../../kit/stage';
import {CastShadow} from '../../kit/depth';
import {FLOOR} from '../../kit/world';
import {Motorcycle} from '../../kit/places';
import {HelmetCams, HelmetShell} from '../../kit/helmet';
import {Sprite} from '../../cast/Sprite';
import {Tag} from '../../kit/ui';
import timeline from '../../../episodes/rear-cam/timeline.json';

// ออเดอร์ป่าช้า... กับกล้องตัวที่สอง — roster. Symbols come from src/cast.json (active entries only); the traits below
// are clues and show on every appearance (brief.md → Speakers):
//   Jay   lead-male-A, navy zip jacket; on his bike he is always the shot-021 rider with the two helmet cameras
//   Chat  villain-male-A + faded orange win vest no. 17, scar at the tail of his LEFT eyebrow, neon-green braided
//         keychain in his RIGHT hand
//   Teer  police-A + black-rimmed glasses (acc=glasses in the actor string), black notebook in his LEFT hand
//   Hem   maternal-grandfather-A (mor hom, pha khao ma); drags his right leg

export const PX_CM = 3.0;

export const C = {
  jay: '#2f5f8f', jayPants: '#26364d', jayHair: '#16161c',
  vest: '#c8642e', vestD: '#8f4320', vestStripe: '#c9ced6',
  chatShirt: '#262833', chatPants: '#1b202a',
  key: '#7dff6a',
  skin: '#e2ae86', skinD: '#c48e68',
};

/** layer offset of a whole-body template pose relative to standing (stage.tsx LAYER_T) */
const dy = (sym: string) => (sym === 'man-crouch' ? 160 : sym.endsWith('-sit') ? 108 : 0);

/** Chat: the faded win vest (sleeveless, over his dark shirt), number 17, reflective band */
export const ChatVest: React.FC<{sym: string}> = ({sym}) => {
  if (sym.endsWith('-back') || sym === 'man-lie') return null;
  return (
    <g transform={`translate(0 ${dy(sym)})`}>
      <path d="M60 146 L82 146 L100 178 L118 146 L140 146 L141 314 L59 314 Z" fill={C.vest} stroke="#2a1a12" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M82 146 L100 178 L118 146" fill="none" stroke={C.vestD} strokeWidth="5" />
      <rect x="59" y="226" width="82" height="13" fill={C.vestStripe} opacity=".75" />
      <rect x="108" y="190" width="26" height="22" rx="3" fill="#f3ead8" stroke="#2a1a12" strokeWidth="1.5" />
      <text x="121" y="208" textAnchor="middle" fontSize="17" fontWeight="900" fill="#1b1b1b" fontFamily="Noto Sans Thai, sans-serif">17</text>
      {/* sun-bleached patches: the vest is old */}
      <path d="M64 270 q14 -8 30 2 M106 286 q16 -6 30 4" stroke="rgba(255,236,200,.28)" strokeWidth="9" fill="none" strokeLinecap="round" />
    </g>
  );
};

/** Chat: scar at the tail of his left eyebrow (the viewer's right) */
export const ChatScar: React.FC<{sym: string}> = ({sym}) => {
  if (sym.endsWith('-back') || sym === 'man-lie' || sym === 'man-crouch') return null;
  return (
    <g transform={`translate(0 ${dy(sym)})`}>
      <path d="M134 52 L144 66" stroke="#9a5a46" strokeWidth="4" strokeLinecap="round" />
      <path d="M131 56 L138 54 M136 62 L143 59" stroke="#9a5a46" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};

/** Chat: the neon-green braided keychain hanging from his right hand (the viewer's left) */
const ChatKey: React.FC<{sym: string}> = ({sym}) => {
  if (sym !== 'villain-male-A') return null;
  return (
    <g>
      <circle cx="46" cy="338" r="7" fill="none" stroke="#c9ced6" strokeWidth="2.5" />
      <path d="M46 345 q-6 12 0 24 q6 12 0 24" stroke={C.key} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M46 345 q-6 12 0 24 q6 12 0 24" stroke="rgba(125,255,106,.45)" strokeWidth="13" fill="none" strokeLinecap="round" />
    </g>
  );
};

/** Chat on the job (CH9): the black raincoat of the rear-camera file hanging open over the orange vest, the helmet
 *  pushed back off his brow so the scar still shows, the tinted shield raised */
const ChatRain: React.FC<{sym: string}> = ({sym}) => {
  if (sym.endsWith('-back') || sym === 'man-lie') return null;
  const hem = sym === 'man-crouch' ? 238 : sym.endsWith('-sit') ? 300 : 400;
  return (
    <g transform={`translate(0 ${dy(sym)})`}>
      <path d={`M56 148 L80 142 L84 ${hem} L42 ${hem + 8} Z M144 148 L120 142 L116 ${hem} L158 ${hem + 8} Z`} fill="#0b0c10" stroke="#020203" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M72 160 L72 ${hem - 10} M128 160 L128 ${hem - 10}`} stroke="rgba(190,205,230,.22)" strokeWidth="5" />
      <path d="M62 150 Q100 122 138 150 Q100 138 62 150 Z" fill="#050506" />
      <g transform="translate(0 -18)"><HelmetShell /></g>
      <path d="M36 28 Q100 -4 164 28 L158 4 Q100 -22 42 4 Z" fill="#101218" stroke="rgba(200,215,240,.25)" strokeWidth="2" />
    </g>
  );
};

/** Chat's head alone, helmet pushed back, drawn big for the shots from above and on his own screen. (x, y) = top of
 *  the helmet, `size` = the head's width in px */
export const ChatRainHead: React.FC<{x: number; y: number; size: number; face: string; look?: number}> = ({x, y, size, face}) => {
  const h = size * (520 / 130);
  const w = h * (200 / 520);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h * 0.27, overflow: 'visible'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h * 0.27, overflow: 'hidden', paddingTop: 0}}>
        <Sprite id={'villain-male-A' as CastId} height={h} hideFace layers={[`face-${face}` as CastId]} vars={{shirt: C.chatShirt, pants: C.chatPants}} />
      </div>
      <svg viewBox="0 -30 200 170" width={w} height={w * 0.85} style={{position: 'absolute', left: 0, top: -w * 0.15, overflow: 'visible'}}>
        <path d="M134 52 L144 66" stroke="#9a5a46" strokeWidth="4" strokeLinecap="round" />
        <path d="M131 56 L138 54 M136 62 L143 59" stroke="#9a5a46" strokeWidth="2" strokeLinecap="round" />
        <g transform="translate(0 -18)"><HelmetShell /></g>
        <path d="M36 28 Q100 -4 164 28 L158 4 Q100 -22 42 4 Z" fill="#101218" stroke="rgba(200,215,240,.25)" strokeWidth="2" />
      </svg>
    </div>
  );
};

const poseMale = (standing: CastId) => (p: string): CastId =>
  (({sit: 'man-sit', back: 'man-back', crouch: 'man-crouch', lie: 'man-lie'} as Record<string, CastId>)[p] ?? standing);

export const ROSTER: Record<string, RosterEntry> = {
  jay: {cm: 172, symbol: poseMale('lead-male-A'), vars: {shirt: C.jay, forearm: C.jay, pants: C.jayPants, hair: C.jayHair, skin: C.skin, 'skin-d': C.skinD}},
  chat: {cm: 170, symbol: poseMale('villain-male-A'), vars: {shirt: C.chatShirt, pants: C.chatPants},
    extra: s => <><ChatVest sym={s} /><ChatScar sym={s} /><ChatKey sym={s} /></>},
  teer: {cm: 174, symbol: poseMale('police-A'), vars: {}},
  hem: {cm: 164, symbol: poseMale('maternal-grandfather-A'), vars: {}},
};
for (const k of Object.keys(ROSTER)) ROSTER[`${k}-sil`] = {...ROSTER[k], sil: true, extra: undefined};
/** the roster with Chat in the raincoat (from the moment he rides out of the shortcut on the last night) */
const ROSTER_RAIN: Record<string, RosterEntry> = {...ROSTER, chat: {...ROSTER.chat, extra: s => <><ChatVest sym={s} /><ChatRain sym={s} /><ChatScar sym={s} /></>}};

export const speaking = makeSpeaking(timeline);

/** Jay on his bike (CLAUDE.md rule 11): the shot-021 rider in his own colours with the two helmet cameras.
 *  `rec` = rear camera alive (fixed after night 1); `talk` animates his mouth while his line plays. */
export const JayBike: React.FC<{x: number; y?: number; scale?: number; face?: string; f: number; rec?: boolean; dead?: boolean; talk?: boolean;
  headlight?: boolean; box?: boolean; helmet?: boolean; flip?: boolean; spin?: number; frontRec?: boolean}> = ({
  x, y = FLOOR, scale = 1, face = 'wary', f, rec, dead, talk, headlight, box, helmet = true, flip, spin = 0, frontRec,
}) => (
  <div style={{position: 'absolute', left: 0, top: 0, ...(talk ? ({'--mouth': 'transparent'} as React.CSSProperties) : {})}}>
    <Motorcycle x={x} y={y} scale={scale} color="#2c3a4a" headlight={headlight} flip={flip} wheelSpin={spin}
      rider={{shirt: C.jay, pants: C.jayPants, skin: C.skin, skinD: C.skinD, hairColor: C.jayHair, face, vest: false, helmet,
        extra: (
          <>
            {helmet && <HelmetCams side rec={rec} dead={dead} f={f} />}
            {/* the front camera streaming: its own small red light on the brow (CH9) */}
            {helmet && frontRec && Math.floor(f / 15) % 2 === 0 && <><circle cx="152" cy="-8" r="4" fill="#ff3b30" /><circle cx="152" cy="-8" r="11" fill="rgba(255,59,48,.35)" /></>}
            {/* zip and white collar of the navy jacket on the riding torso */}
            <path d="M88 142 Q100 154 112 142 Z" fill="#f2efe9" />
            <line x1="100" y1="152" x2="100" y2="312" stroke="#183452" strokeWidth="3" />
            {talk && <g transform="translate(14 0)"><use width={200} height={520} href={`#${talkShape(f, true)}`} /></g>}
          </>
        )}} />
    {box && <FoamBox x={x} y={y} scale={scale} flip={flip} />}
  </div>
);

/** the taped foam box strapped behind the rider (bike-frame coordinates, see places.tsx Motorcycle) */
const FoamBox: React.FC<{x: number; y: number; scale: number; flip?: boolean}> = ({x, y, scale, flip}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `scale(${flip ? -scale : scale}, ${scale})`, zIndex: 15}}>
    <svg width={300} height={200} viewBox="0 0 300 200" style={{position: 'absolute', left: -300, top: -330, overflow: 'visible'}}>
      <rect x="20" y="60" width="150" height="100" rx="8" fill="#f3f0e8" stroke="#bdb6a8" strokeWidth="3" />
      {[0, 1, 2].map(i => <rect key={i} x={50 + i * 34} y="58" width="14" height="104" fill="#111" />)}
      <path d="M10 160 L180 160" stroke="#c0392b" strokeWidth="6" />
    </svg>
  </div>
);

/** Episode actor layer + name tags (`data.tag` = {who, name, line}). Jay sitting = Jay on his bike. */
export const Actors: React.FC<{p: ShotProps; cast?: string[]; floor?: number; pxPerCm?: number; tint?: string; bike?: boolean; rec?: boolean; box?: boolean; headlight?: boolean; helmet?: boolean; flipBike?: boolean; helmeted?: boolean; rain?: boolean; frontRec?: boolean}> = ({
  p, cast, floor = FLOOR, pxPerCm = PX_CM, tint, bike = true, rec, box, headlight, helmet = true, flipBike, helmeted, rain, frontRec,
}) => {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  let list = ((cast ?? d.cast) ?? []) as string[];
  const idOf = (c: string) => c.split(/[@ ]/)[0];
  if (d.ots) list = list.filter(c => idOf(c) !== d.ots);
  if (d.silhouette) list = list.map(c => (idOf(c) === d.silhouette ? c.replace(/^\w+/, m => `${m}-sil`) : c));
  // Teer's black-rimmed glasses are his trait: on every appearance, whether or not the shot's string says so
  list = list.map(c => (idOf(c) === 'teer' && !/\bacc=/.test(c) ? `${c} acc=glasses` : c));
  const parsed = list.map(parseActor);
  const riding = bike ? parsed.find(a => a.who === 'jay' && a.pose === 'sit') : undefined;
  const rest = riding ? list.filter((_, i) => parsed[i] !== riding) : list;
  const talking = speaking(p.shot, p.f, p.len);
  const lightAt = Array.isArray(d.lightAt) ? (d.lightAt as [number, number]) : undefined;
  const tag = d.tag as {who: string; name: string; line?: string} | undefined;
  const tagged = tag ? parsed.find(a => a.who === tag.who) : undefined;
  return (
    <>
      {riding && (
        <>
          {lightAt && <CastShadow x={riding.x} y={riding.y ?? floor} h={400} light={lightAt} />}
          <JayBike x={riding.x - 40} y={riding.y ?? floor} face={riding.face ?? 'wary'} f={p.f} rec={rec ?? d.rec} dead={d.rec === false}
            talk={riding.talk && talking && p.shot.who === 'jay'} box={box ?? d.box === 'on-seat'} headlight={headlight ?? !!d.headlight} helmet={helmet} flip={flipBike} frontRec={frontRec} />
        </>
      )}
      <StageActors p={p} roster={rain ? ROSTER_RAIN : ROSTER} speaking={speaking} cast={rest} floor={floor} pxPerCm={pxPerCm} tint={tint} chairs={false} />
      {/* off the bike on a delivery night Jay keeps his helmet on: the shell, the shield and both cameras over his head */}
      {helmeted && rest.map(parseActor).filter(a => a.who === 'jay' && a.pose !== 'back').map((a, i) => {
        const H = a.h ?? ROSTER.jay.cm * pxPerCm, s = H / 520;
        const drop = a.pose === 'crouch' ? 160 : a.pose === 'sit' ? 110 : 0;
        const yaw = Number((a.rig?.yaw ?? '0').split('>')[0].split('@')[0]) || 0;
        return (
          <svg key={'hm' + i} viewBox="0 0 200 520" width={200 * s} height={520 * s} style={{position: 'absolute', left: a.x - 100 * s + yaw * 18 * s, top: (a.y ?? floor) - H + drop * s, overflow: 'visible', zIndex: 16}}>
            <HelmetShell shield fog={0.2} />
            <HelmetCams rec={rec ?? d.rec !== false} f={p.f} />
          </svg>
        );
      })}
      {tagged && (
        <div style={{position: 'absolute', left: tagged.x, top: Math.max(70, headOf(tagged, floor, pxPerCm).y - 200),
          transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none', whiteSpace: 'nowrap'}}>
          <Tag text={tag!.line ? `${tag!.name} · ${tag!.line}` : tag!.name} />
        </div>
      )}
    </>
  );
};

/** where an actor's head is in world px (the centre of the head circle) and its radius: standing, seated, crouched,
 *  or Jay riding (the shot-021 rig leans the torso 8°, so the head sits forward of the seat) */
export function headOf(a: ReturnType<typeof parseActor>, floor = FLOOR, pxPerCm = PX_CM, bike = true) {
  const y0 = a.y ?? floor;
  if (bike && a.who.replace(/-sil$/, '') === 'jay' && a.pose === 'sit') return {x: a.x - 90, y: y0 - 424, r: 65};
  const H = a.h ?? (ROSTER[a.who]?.cm ?? 170) * pxPerCm, s = H / 520;
  const drop = a.pose === 'sit' ? 110 : a.pose === 'crouch' ? 160 : 0;
  return {x: a.x, y: y0 - H + (65 + drop) * s, r: 65 * s};
}

const PEOPLE = new Set(Object.keys(ROSTER).filter(k => !k.endsWith('-sil')));

/** Aim a framing at the person the view names: `jay-close` → Jay's head, `over-chat-ots` → the one facing Chat,
 *  `helmet-*` → Jay. Keeps the shot's zoom (data.cam z0, z1) and places the head where that size wants it: high in
 *  the frame for a close-up (clear of the subtitle band), the eyes on the upper third for an ECU. Returns the
 *  shot data with `cam` replaced, or unchanged when the view names nobody in the cast. */
export function aimData(p: ShotProps, bike = true): Record<string, any> {
  const d = (p.shot.data ?? {}) as Record<string, any>;
  const cam = d.cam as number[] | undefined;
  if (!cam) return d;
  const v = p.shot.view ?? '';
  const cast = ((d.cast ?? []) as string[]).map(parseActor);
  const base = (w: string) => w.replace(/-sil$/, '');
  let target: string | undefined;
  const ots = v.match(/^over-(\w+)-ots$/);
  if (ots) target = cast.map(a => base(a.who)).find(w => w !== ots[1]);
  else if (v.startsWith('helmet-')) target = 'jay';
  else {
    const first = v.split('-')[0];
    if (PEOPLE.has(first)) target = first;
  }
  const a = target ? cast.find(c => base(c.who) === target) : undefined;
  if (!a) return d;
  const h = headOf(a, FLOOR, PX_CM, bike);
  const z = cam[0];
  // screen y of the head centre: ECU on the eyes at ~44%, close ~42%, medium ~33%, wider: leave the shot's own framing
  const sy = z >= 4 ? 470 : z >= 2.6 ? 440 : z >= 1.6 ? 360 : undefined;
  if (sy === undefined) return d;
  // the subject on a third with room in front of the face: Jay faces right (toward the others), everyone else left;
  // an ECU fills the frame and stays centred
  const sx = ots ? (ots[1] === 'jay' ? 1180 : 760) : z >= 4 ? 960 : base(a.who) === 'jay' ? (z < 2.6 ? 640 : 760) : 1160;
  const cx = h.x + (960 - sx) / z, cy = h.y + (540 - sy) / z;
  return {...d, cam: [cam[0], cam[1], cx, cy]};
}
