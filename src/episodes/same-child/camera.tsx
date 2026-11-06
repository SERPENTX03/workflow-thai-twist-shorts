import React from 'react';
import {ActorView, parseActor} from '../../kit/stage';
import {FLOOR} from '../../kit/world';
import {PX_CM, ROSTER} from './cast';

// Camera setups for same-child (cinematography.md §1): a `view` may end in setup tags (`tonroom-close`, `sala-ots`,
// `drawer-top`, `camera-cctv`). scenes.tsx strips them before the set sees its own view name and passes them on as
// `data.fx`; Stage (sets.tsx) and Actors (cast.tsx) draw the effect. The camera numbers themselves are written into
// story.json (`data.cam`) so they can be read and tuned there.

/** tokens the audit counts (scripts/shot-audit.mjs); only these are stripped, so `class-mirror` stays a view name */
export const CAMERA_TAGS = new Set(['wide', 'med', 'ew', 'close', 'ecu', 'ins', 'low', 'high', 'top', 'dutch', 'ots', 'pov', 'fif', 'sil', 'split', 'cctv', 'snap']);

export function splitView(view?: string): {core?: string; tags: string[]} {
  if (!view) return {tags: []};
  const parts = view.split('-');
  const tags: string[] = [];
  while (parts.length > 1 && CAMERA_TAGS.has(parts[parts.length - 1])) tags.unshift(parts.pop()!);
  if (parts.length === 1 && CAMERA_TAGS.has(parts[0]) && !tags.length) return {tags: [parts[0]]};
  return {core: parts.join('-'), tags};
}

/** the listener of an over-the-shoulder shot: a big, dark, out-of-focus head and shoulder at the frame edge */
export const OtsFore: React.FC<{who: string; cast: string[]; side: 'l' | 'r'}> = ({who, cast, side}) => {
  const raw = cast.find(c => c.split(/[@ ]/)[0] === who);
  if (!raw || !ROSTER[who]) return null;
  const a = parseActor(raw);
  const H = 1500;
  const x = side === 'l' ? 120 : 1800;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <ActorView a={{...a, x, y: 1080 + 640, h: H, pose: a.pose === 'sit' ? 'stand' : a.pose, talk: false, arm: undefined, prop: undefined, flip: side === 'r'}} roster={ROSTER} floor={FLOOR}
        pxPerCm={PX_CM} f={0} />
    </div>
  );
};

/** frame-in-frame: a dark, soft foreground (door jamb, post, net) eating the edges of the picture */
export const FifFore: React.FC<{kind?: 'door' | 'posts'}> = ({kind = 'door'}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', left: -40, top: -40, width: kind === 'door' ? 520 : 300, height: 1160, background: 'linear-gradient(90deg, #0b0806 70%, rgba(11,8,6,0))'}} />
    <div style={{position: 'absolute', right: -40, top: -40, width: kind === 'door' ? 360 : 300, height: 1160, background: 'linear-gradient(270deg, #0b0806 70%, rgba(11,8,6,0))'}} />
    <div style={{position: 'absolute', left: 0, top: -40, width: 1920, height: 170, background: 'linear-gradient(180deg, #0b0806 60%, rgba(11,8,6,0))'}} />
    {kind === 'door' && <div style={{position: 'absolute', left: 470, top: -40, width: 38, height: 1160, background: '#2a1c12'}} />}
  </div>
);

/** perspective tilt of the whole world for a low (looking up) or high (looking down) camera */
export const keystone = (tags: string[]): React.CSSProperties | undefined =>
  tags.includes('low') ? {transform: 'perspective(1500px) rotateX(9deg)', transformOrigin: '50% 100%'}
    : tags.includes('high') ? {transform: 'perspective(1500px) rotateX(-10deg)', transformOrigin: '50% 0%'}
      : undefined;
