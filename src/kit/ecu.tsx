import React from 'react';
import {ActorView, parseActor, type RosterEntry} from './stage';

// Extreme close-up of a face, made from the character's own face (directing.md §5.2 "สไตล์เดียวทั้งเฟรม").
//
// An ECU drawn from scratch (an eye with an iris and lashes, lips with a gradient) is another person in another
// style: the cast have dot eyes, a brow stroke and a line for a mouth. This frames the real sprite so that the eyes,
// one eye, the mouth or the whole face fill the frame: same skin, hair, glasses, sweat, tears and face words as in
// every other shot, and the face still acts (faces=, look=, talk).
//
//   <FaceEcu who="rin shock look=-0.4" roster={ROSTER} f={f} part="eyes" shade="r" />
//   <FaceEcu who="chaloem guilty" roster={ROSTER} f={f} part="mouth" talking />
//   <FaceEcu who="rin wary" roster={ROSTER} f={f} part="eye-l" glint={r => <WindowBars r={r} />} />   // what she sees, in her eye
//
// `who` is an actor string without the position ("id face words rig words"): the same words as data.cast.

export type EcuPart = 'eyes' | 'eye-l' | 'eye-r' | 'mouth' | 'face';
/** what the frame is centred on and how many sprite units (the cast frame is 200 wide) span its width */
const PART: Record<EcuPart, {cx: number; cy: number; span: number}> = {
  face: {cx: 100, cy: 80, span: 175},     // brows to chin: the whole expression
  eyes: {cx: 100, cy: 66, span: 120},     // both eyes and the brows
  'eye-l': {cx: 77, cy: 70, span: 56},    // the eye on screen left
  'eye-r': {cx: 123, cy: 70, span: 56},
  mouth: {cx: 100, cy: 103, span: 70},
};
const EYES: [number, number][] = [[77, 74], [123, 74]];

export const FaceEcu: React.FC<{
  who: string; roster: Record<string, RosterEntry>; f: number; len?: number;
  part?: EcuPart; W?: number; H?: number;
  /** where the part sits in the frame, 0–1 (default: centre, a little high so the subtitle band stays clear) */
  at?: [number, number];
  /** 1 = the part spans the frame width; 0.8 leaves air round it */
  fill?: number;
  talking?: boolean;
  /** side of the face that falls into shadow, away from the light; `shadeA` = how dark */
  shade?: 'l' | 'r'; shadeA?: number;
  /** drawn inside each dot eye, clipped to it, origin at the eye's centre; gets the eye's radius in px. Faces with dot eyes only. */
  glint?: (r: number) => React.ReactNode;
  /** what is behind the head: the same room, blurred (default: near black) */
  back?: React.ReactNode; bg?: string;
}> = ({who, roster, f, len = 90, part = 'eyes', W = 1920, H = 1080, at = [0.5, 0.45], fill = 1, talking, shade, shadeA = 0.55, glint, back, bg = '#0a0808'}) => {
  const {cx, cy, span} = PART[part];
  const u = (W * fill) / span;                       // px per sprite unit
  const x = W * at[0] - (cx - 100) * u, floor = H * at[1] + (520 - cy) * u;
  const [id, ...words] = who.trim().split(/\s+/);
  const a = parseActor(`${id}@${x.toFixed(1)},${floor.toFixed(1)} h=${(520 * u).toFixed(1)} ${words.join(' ')}`);
  const r = 5.4 * u;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden', background: bg}}>
      {back}
      <ActorView a={a} roster={roster} floor={floor} pxPerCm={1} f={f} len={len} talking={talking} />
      {glint && EYES.map(([ex, ey], i) => (
        <div key={i} style={{position: 'absolute', left: x + (ex - 100) * u - r, top: floor - (520 - ey) * u - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: r, top: r}}>{glint(r)}</div>
        </div>
      ))}
      {shade && <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(${shade === 'r' ? 90 : 270}deg, rgba(0,0,0,0) 38%, rgba(4,3,8,${shadeA}) 100%)`}} />}
    </div>
  );
};
