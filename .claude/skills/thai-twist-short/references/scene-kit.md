# Scene kit — building scenes in Remotion (TSX)

A **scene** is a React component for one shot: `ShotComponent = ({shot, f, len, W, H}) => JSX`. `f` is the frame inside the shot (0 … `len`), `shot` is the story.json entry (`shot.view`, `shot.data`, `shot.who`). It is a **pure function of `f`**: no state, no `Math.random()` / `Date.now()` (use `rnd(seed, i)` from `src/engine/anim.ts`), no network. Captions are drawn by the engine above the scene, never inside it.

## Where things live

| Need | Use | File |
|---|---|---|
| a character, pet, pose, prop, icon, mark | `<Sprite id="man" height={600} />` | `src/cast/Sprite.tsx` (symbols are generated into `src/cast/CastSprite.tsx`) |
| extra layers on one figure (face, accessory, arm pose, mark) | `layers={['face-angry', 'acc-cap']}` + `hideFace` / `hideArmL` / `hideArmR` | `Sprite` props |
| silhouette (shadow, reflection, ghost) | `<Sprite id="man" silhouette />` | |
| cards / chips / tags / rule card / stat / meter / checklist / hud | `Card Chip Tag RuleCard Stat Meter Checklist Hud` | `src/kit/ui.tsx` |
| vignette, shadow blob, soft-focus `Far`, `Rain` | | `src/kit/fx.tsx` |
| tokens (colours, fonts, caption y) | `T` | `src/engine/theme.ts` |
| easing / keyframes / pop-in | `kf(f, [[0,0],[12,1]])`, `appear(f, start, dur, ease)`, `backOut(k)`, `sec(s)`, `easeOut`, `easeInOut` | `src/engine/anim.ts` |

## Generic scenes (ready, parameterised by `data` in story.json)

| Scene name | `view` | `data` | Shows |
|---|---|---|---|
| `room` | — | `{hud, reflection}` | side-view night room, mirror silhouette, HUD clock |
| `rules` | `card` / `numbers` | card: `{no, lines, tag, who}` · numbers: `{label, unit, from, to, rows}` | day set, name tag, rule card drop · stat count-down, meter, checklist |
| `map` | — | `{her, me}` | top-down map, dashed path, hollow dot, red ring |
| `news` | — | `{kicker, date, title[], who}` | newspaper evidence card, blur-to-sharp photo, red ring |
| `next` | — | `{ep, title[], cta}` | ตอนต่อไป end card (leave the caption empty) |

The old `example-*` names still resolve to the same components. A scene named in story.json that has no component renders a placeholder and `npm run story` warns.

## Episode-specific scenes

Create `src/episodes/<slug>/scenes.tsx`:

```tsx
import type {ShotComponent} from '../../engine/episode';
import {Sprite} from '../../cast/Sprite';
import {appear, backOut} from '../../engine/anim';

const Door: ShotComponent = ({shot, f, len}) => (/* … */);
export default {door: Door};   // key = the `scene` name in story.json
```

Then `npm run timeline -- episodes/<slug>` (or `npm run check`) regenerates the registry. Entries here override the generic scenes of the same name. Promote anything reusable into `src/scenes/` and `src/kit/`.

## Rules found in the HyperFrames era that still apply

1. **Hands:** never draw a hand beside a resting arm. `hideArmL` / `hideArmR` on the `Sprite`, then layer ONE pose arm + grip prop (`hands-poses.md`). Held props (`prop-*`, `acc-watch`) are anchored at (0,0): put them in their own `<Sprite>` or an `<svg><use href="#prop-coin" transform="translate(x y)"/></svg>`.
2. **Faces:** `hideFace`, then one `face-*` layer per figure per shot; change mood on a cut or beat. `woman` / `auntie` need `transform="translate(0 4)"` on face layers (see `cast-library.md`).
3. **Layer order:** background → set dressing → light glows (`mixBlendMode: 'screen'`) → shadows (`ShadowBlob`) → people → night grade overlay (`rgba(6,10,26,.55)`) → rings/highlights → HUD. The protagonist who is a ghost gets no shadow.
4. **Closing lines need ≥ 2 s on screen.** Anything that appears in the last shot must land early.
5. Anything that enters later starts fully off-canvas; use `appear()` so scrubbing backwards is clean.
6. SVG shapes: animate geometry (`r`, `strokeDashoffset`) instead of CSS-scaling a shape inside a scaled `<svg>`.
7. Text under 28 px is unreadable on a phone.
8. `<use href="#id">` only works inside the same document: mount `<CastSprite/>` once (the engine's `Main` and `Board` already do; gallery frames do too).

## Checking a scene

`npm run check -- episodes/<slug>` renders `out/<slug>-board/element-N.jpeg` (one key frame per shot at 60 % of the shot). To see a different moment: `npx remotion still src/index.ts <Id> out/x.png --frame=<global frame>`. Look at the frames before any video render.
