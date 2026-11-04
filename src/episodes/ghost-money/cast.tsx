import React from 'react';
import type {ShotProps} from '../../engine/episode';
import type {CastId} from '../../cast/CastSprite';
import {T} from '../../engine/theme';
import {Actors as StageActors, ClockChip, Plate, Stage, at, makeSpeaking, parseActor, type RosterEntry} from '../../kit/stage';
import {FLOOR, H, W, WOOD} from '../../kit/world';
import {Tag} from '../../kit/ui';
import timeline from '../../../episodes/ghost-money/timeline.json';

export const PX_CM = 3.0;

export const C = {
  tham: '#2f6b55',
  thamVest: '#d97724',
  mek: '#2f5f8f',
  mekPatch: '#f6c445',
  headman: '#556859',
  mourner: '#32303a',
  auntie: '#c97b52',
  oldman: '#8c8272',
  tik: '#5a87b0',
  cop: '#8b7355',
  patient: '#cbd5e1',
  kin: '#7a5c58',
  ...WOOD,
};

/** Mek's signature clue: yellow cross-stitch patch on his blue jacket elbow */
const MekPatch: React.FC<{sym: string}> = ({sym}) => {
  const isSit = sym === 'man-sit';
  // seated: the elbow of the clasped arm bends out at about (154, 346)
  const cx = isSit ? 154 : 148;
  const cy = isSit ? 346 : 242;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <rect x="-11" y="-11" width="22" height="22" rx="4" fill="#1e3f63" stroke="#f6c445" strokeWidth="2.2" strokeDasharray="3 2" />
      <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#f6c445" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  );
};

/** Tham's authentic Thai motorcycle taxi vest (orange, gray V-neck collar, Thai flag, transport emblem, ID card pocket, reflective stripe, double cargo pockets) */
const RiderVest: React.FC<{sym: string}> = ({sym}) => {
  const dy = sym === 'man-sit' ? 110 : sym === 'man-crouch' ? 160 : 0;
  if (sym === 'man-crouch') {
    return (
      <g transform="translate(0 160)">
        {/* Orange vest body tucked above crouching thighs */}
        <path d="M64 150 L84 150 L100 172 L116 150 L136 150 L136 206 L64 206 Z" fill="#ea580c" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
        {/* Light gray V-neck collar insert */}
        <polygon points="84,150 100,172 116,150" fill="#94a3b8" stroke="#18181b" strokeWidth="1.5" />
        {/* Center zipper */}
        <line x1="100" y1="172" x2="100" y2="206" stroke="#18181b" strokeWidth="2.5" />
        <rect x="98.5" y="172" width="3" height="5" rx="1" fill="#cbd5e1" />
        {/* Thai Flag badge & Transport emblem */}
        <g transform="translate(73 156)">
          <rect x="0" y="0" width="16" height="10" rx="1.5" fill="#ef4444" stroke="#1e293b" strokeWidth="0.8" />
          <rect x="0" y="1.8" width="16" height="6.4" fill="#ffffff" />
          <rect x="0" y="3.6" width="16" height="2.8" fill="#2563eb" />
        </g>
        <circle cx="81" cy="174" r="5" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
        {/* Number 25 & ID pocket */}
        <text x="122" y="168" textAnchor="middle" fontSize="13" fontWeight="900" fill="#ffffff" stroke="#334155" strokeWidth="1.5" fontFamily="Noto Sans Thai, sans-serif">25</text>
        <rect x="110" y="172" width="18" height="11" rx="2" fill="#18181b" />
        <rect x="111.5" y="173.5" width="15" height="8" rx="1" fill="#fecdd3" />
        {/* Reflective stripe */}
        <rect x="64" y="184" width="72" height="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        {/* Lower cargo pockets */}
        <rect x="67" y="196" width="28" height="9" rx="2" fill="#181c24" stroke="#090a0f" strokeWidth="1" />
        <rect x="105" y="196" width="28" height="9" rx="2" fill="#181c24" stroke="#090a0f" strokeWidth="1" />
      </g>
    );
  }
  if (sym === 'man-back') {
    return (
      <g>
        {/* Back of orange vest */}
        <rect x="62" y="152" width="76" height="135" rx="16" fill="#ea580c" />
        <path d="M62 152 Q100 160 138 152" stroke="#18181b" strokeWidth="5" fill="none" />
        <path d="M62 152 L62 287 M138 152 L138 287" stroke="#18181b" strokeWidth="3.5" />
        {/* Wide silver reflective horizontal stripe */}
        <rect x="62" y="210" width="76" height="18" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        {/* Large bold driver number 25 */}
        <text x="100" y="196" textAnchor="middle" fontSize="30" fontWeight="900" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" fontFamily="Noto Sans Thai, sans-serif">25</text>
      </g>
    );
  }
  return (
    <g transform={`translate(0 ${dy})`}>
      {/* Orange vest body */}
      <path d="M64 150 L84 150 L100 174 L116 150 L136 150 L136 288 L64 288 Z" fill="#ea580c" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
      {/* Light gray V-neck collar insert */}
      <polygon points="84,150 100,174 116,150" fill="#94a3b8" stroke="#18181b" strokeWidth="1.5" />
      {/* Center front zipper */}
      <line x1="100" y1="174" x2="100" y2="288" stroke="#18181b" strokeWidth="2.5" />
      <rect x="98.5" y="174" width="3" height="6" rx="1" fill="#cbd5e1" />

      {/* Wearer's right chest (screen-left x ≈ 73..92): Thai Flag badge + Golden Transport emblem */}
      <g transform="translate(73 160)">
        <rect x="0" y="0" width="18" height="12" rx="2" fill="#ef4444" stroke="#1e293b" strokeWidth="1" />
        <rect x="0" y="2" width="18" height="8" fill="#ffffff" />
        <rect x="0" y="4.5" width="18" height="3" fill="#2563eb" />
      </g>
      <g transform="translate(82 184)">
        <circle cx="0" cy="0" r="7.5" fill="#f59e0b" stroke="#92400e" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="5" fill="none" stroke="#78350f" strokeWidth="0.8" />
        <path d="M-3 0 L3 0 M0 -3 L0 3" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* Wearer's left chest (screen-right x ≈ 108..132): Driver Number 25 + ID card pocket */}
      <text x="122" y="175" textAnchor="middle" fontSize="16" fontWeight="900" fill="#ffffff" stroke="#334155" strokeWidth="1.8" fontFamily="Noto Sans Thai, sans-serif">25</text>
      <line x1="108" y1="183" x2="132" y2="183" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="108" y="187" width="24" height="17" rx="3" fill="#18181b" />
      <rect x="110" y="189" width="20" height="13" rx="1.5" fill="#fecdd3" stroke="#e11d48" strokeWidth="0.8" />
      <rect x="112" y="192" width="7" height="7" rx="1" fill="#475569" />
      <line x1="121" y1="193" x2="128" y2="193" stroke="#991b1b" strokeWidth="1.2" />
      <line x1="121" y1="196" x2="126" y2="196" stroke="#991b1b" strokeWidth="1" />

      {/* Horizontal silver/gray reflective stripe across midriff */}
      <rect x="64" y="210" width="72" height="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />

      {/* Two large black zippered lower cargo pockets */}
      <rect x="67" y="232" width="29" height="38" rx="4" fill="#181c24" stroke="#090a0f" strokeWidth="1.5" />
      <line x1="70" y1="238" x2="93" y2="238" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <rect x="104" y="232" width="29" height="38" rx="4" fill="#181c24" stroke="#090a0f" strokeWidth="1.5" />
      <line x1="107" y1="238" x2="130" y2="238" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};

/** Old man's behind-the-ear hearing aid */
const HearingAid: React.FC<{sym: string}> = ({sym}) => {
  const dy = sym === 'man-sit' ? 110 : sym === 'man-crouch' ? 160 : 0;
  return (
    <g transform={`translate(0 ${dy})`}>
      <path d="M163 68 Q175 68 174 82 Q173 94 164 92" fill="none" stroke="#d9b99b" strokeWidth="5" strokeLinecap="round" />
      <circle cx="164" cy="79" r="4.5" fill="#bfa082" stroke="#5c4938" strokeWidth="1.5" />
      <circle cx="171" cy="72" r="2.2" fill="#e5383b" />
    </g>
  );
};

/** Police badge & shoulder detail */
const PoliceBadge: React.FC<{sym: string}> = ({sym}) => {
  const dy = sym === 'man-sit' ? 110 : 0;
  return (
    <g transform={`translate(0 ${dy})`}>
      <polygon points="122,164 127,172 122,180 117,172" fill="#f6c445" stroke="#5a452a" strokeWidth="1.2" />
      <rect x="68" y="168" width="22" height="7" rx="2" fill="#3d3024" />
    </g>
  );
};

/** Extra SVG symbols for props used in story.json (`prop=spoon`, `prop=book`) */
const ExtraPropsDefs: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}} aria-hidden>
    <defs>
      <symbol id="prop-spoon" overflow="visible">
        <path d="M-32 -26 A32 18 0 0 1 32 -26Z" fill="#fbfaf5" />
        <path d="M-38 -26 H38 A38 32 0 0 1 -38 -26Z" fill="#e9e4d6" stroke="#8a7f6d" strokeWidth="3" />
        <path d="M-30 -24 Q0 -14 30 -24" fill="none" stroke="#d92626" strokeWidth="2.5" />
        <path d="M6 -34 L28 -58" stroke="#c8cdd4" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="4" cy="-32" rx="9" ry="5" transform="rotate(-35 4 -32)" fill="#d8dde3" stroke="#7d8590" strokeWidth="1.5" />
        <circle cx="0" cy="8" r="15" fill="var(--skin, #e7b38c)" />
      </symbol>
      <symbol id="prop-book" overflow="visible">
        <rect x="-34" y="-76" width="68" height="84" rx="5" fill="#2c4c7e" stroke="#182a4a" strokeWidth="3.5" />
        <rect x="-28" y="-70" width="56" height="72" rx="3" fill="#f6f1e6" />
        <rect x="-28" y="-70" width="56" height="18" fill="#3b66a8" opacity=".35" />
        <path d="M-20 -42 H20 M-20 -28 H20 M-20 -14 H10" stroke="#4a5568" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="15" fill="var(--skin, #e7b38c)" />
      </symbol>
    </defs>
  </svg>
);

const poseMale = (standing: CastId) => (p: string): CastId =>
  (({sit: 'man-sit', back: 'man-back', walk: 'man-walk', run: 'man-run', crouch: 'man-crouch', lie: 'man-lie'} as Record<string, CastId>)[p] ?? standing);

const poseFemale = (standing: CastId) => (p: string): CastId =>
  (({sit: 'woman-sit', back: 'woman-back'} as Record<string, CastId>)[p] ?? standing);

export const ROSTER: Record<string, RosterEntry> = {
  tham: {
    cm: 172,
    symbol: poseMale('lead-male-A'),
    vars: {shirt: C.tham, pants: '#1b2430', hair: '#18181f', skin: '#dfa67e', 'skin-d': '#be855e'},
    extra: s => <RiderVest sym={s} />,
  },
  mek: {
    cm: 170,
    symbol: poseMale('lead-male-B'),
    vars: {shirt: C.mek, pants: '#1e293b', hair: '#1c1922', skin: '#e2ad86', 'skin-d': '#c28b66'},
  },
  headman: {
    cm: 168,
    symbol: poseMale('father-A'),
    vars: {shirt: C.headman, pants: '#252926', hair: '#2f2d30', skin: '#d89e74', 'skin-d': '#b67d56'},
  },
  mourner: {
    cm: 158,
    symbol: p => (p === 'sit' ? 'auntie-sit' : p === 'back' ? 'woman-back' : 'aunt-family-A'),
    vars: {top: C.mourner, shirt: C.mourner, pants: '#231f29', skirt: '#2b2330', hair: '#241d22', skin: '#dca47e', 'skin-d': '#bc8460'},
  },
  auntie: {
    cm: 156,
    symbol: p => (p === 'sit' ? 'auntie-sit' : p === 'back' ? 'woman-back' : 'aunt-family-B'),
    vars: {top: C.auntie, shirt: C.auntie, pants: '#4d3147', skirt: '#5c3c58', hair: '#382c30', skin: '#dfa882', 'skin-d': '#bf8864'},
  },
  oldman: {
    cm: 162,
    symbol: p => (p === 'sit' ? 'man-sit' : p === 'crouch' ? 'man-crouch' : 'maternal-grandfather-A'),
    vars: {shirt: C.oldman, pants: '#38342e', hair: '#c4bfad', skin: '#d8b498', 'skin-d': '#b89478'},
    extra: s => <HearingAid sym={s} />,
  },
  tik: {
    cm: 160,
    symbol: poseFemale('sister-A'),
    vars: {top: '#2e5955', shirt: '#2e5955', sleeve: '#2e5955', pants: '#2b3548', skirt: '#2b3548', hair: '#261c20', skin: '#eac09e', 'skin-d': '#cba07e'},
  },
  cop: {
    cm: 174,
    symbol: poseMale('police-A'),
    vars: {shirt: C.cop, pants: '#3d3024', hair: '#1a1a1f', skin: '#dda47c', 'skin-d': '#bd845c'},
    extra: s => <PoliceBadge sym={s} />,
  },
  cop2: {
    cm: 172,
    symbol: poseMale('police-B'),
    vars: {shirt: C.cop, pants: '#3d3024', hair: '#222028', skin: '#d69c74', 'skin-d': '#b57c54'},
    extra: s => <PoliceBadge sym={s} />,
  },
  patient: {
    cm: 166,
    symbol: p => (p === 'lie' ? 'man-lie' : p === 'sit' ? 'man-sit' : 'maternal-grandfather-B'),
    vars: {shirt: C.patient, pants: '#94a3b8', hair: '#9ca3af', skin: '#d5cbc0', 'skin-d': '#b5aba0'},
    noShadow: true,
  },
  kin: {
    cm: 165,
    symbol: poseMale('brother-A'),
    vars: {shirt: C.kin, pants: '#2d2930', hair: '#242024', skin: '#dfb08c', 'skin-d': '#bf906c'},
  },
};

export const speaking = makeSpeaking(timeline);

/** Episode actor layer + automatic character name tags from `shot.data.tag` */
export const Actors: React.FC<{p: ShotProps; cast?: string[]; floor?: number; pxPerCm?: number; tint?: string}> = ({
  p,
  cast,
  floor = FLOOR,
  pxPerCm = PX_CM,
  tint,
}) => {
  const tags = p.shot.data?.tag as Record<string, string> | undefined;
  const raw = (cast ?? (p.shot.data?.cast as string[] | undefined)) ?? [];
  const parsed = raw.map(parseActor);

  return (
    <>
      <ExtraPropsDefs />
      <StageActors p={p} roster={ROSTER} speaking={speaking} cast={cast} floor={floor} pxPerCm={pxPerCm} tint={tint} chairs={{wood: '#80593a', dark: '#3a2718', edge: '#a47a4f'}} />
      {tags &&
        parsed.map((a, i) => {
          const label = tags[a.who];
          if (!label) return null;
          const isSit = a.pose === 'sit' || a.pose === 'crouch';
          const top = Math.max(70, (a.y ?? floor) - (isSit ? 415 : 535));
          return (
            <div key={i} style={{position: 'absolute', left: a.x, top, transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none'}}>
              <Tag text={label} />
            </div>
          );
        })}
    </>
  );
};

export {ClockChip, Plate, Stage, at};
export {FLOOR, H, T, W};
