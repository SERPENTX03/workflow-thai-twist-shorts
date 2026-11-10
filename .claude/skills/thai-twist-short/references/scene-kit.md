# Scene kit — building scenes in Remotion (TSX)

A **scene** is a React component for one shot: `ShotComponent = ({shot, f, len, W, H}) => JSX`. `f` is the frame inside the shot (0 … `len`), `shot` is the story.json entry (`shot.view`, `shot.data`, `shot.who`). It is a **pure function of `f`**: no state, no `Math.random()` / `Date.now()` (use `rnd(seed, i)` from `src/engine/anim.ts`), no network. Captions are drawn by the engine above the scene, never inside it.

## Where things live

| Need | Use | File |
|---|---|---|
| a character, pet, pose, prop, icon, mark | `<Sprite id="lead-male-A" height={600} />` (ids: active entries of `src/cast.json`) | `src/cast/Sprite.tsx` (symbols are generated into `src/cast/CastSprite.tsx`) |
| extra layers on one figure (face, accessory, arm pose, mark) | `layers={['face-angry', 'acc-cap']}` + `hideFace` / `hideArmL` / `hideArmR` | `Sprite` props |
| silhouette (shadow, reflection, ghost) | `<Sprite id="lead-male-A" silhouette />` | |
| cards / chips / tags / rule card / stat / meter / checklist / hud | `Card Chip Tag RuleCard Stat Meter Checklist Hud` | `src/kit/ui.tsx` |
| vignette (`at` = where the light stays), shadow blob, soft-focus `Far` (`dim` for night backgrounds), `Rain` | | `src/kit/fx.tsx` |
| **a place the camera can go inside**: `makeRoom` (VP + back-wall box + depth), `RoomShell`, `RFace` (window, door, rug, light pool), `RBox` (furniture with contact shadow), `RShadow`, `standAt` / `roomPxPerCm` (where a person stands and how big), `LightVeil` (mid-tones sink, light stays where it falls) | `directing.md` §3–4, gallery `room-wide` / `room-close` | `src/kit/room.tsx` |
| depth & light against the flat look: `PerspFloor`, `SideWall`, `CastShadow`, `Haze`; stage `data.lightAt` / `data.focus`, grade `noir` | when to use each: `depth-light.md` | `src/kit/depth.tsx`, `src/kit/stage.tsx` |
| landscape stage: `Stage`, `Plate`, `Actors`, `makeSpeaking`, actor strings, `camAt`, `Grade` | | `src/kit/stage.tsx` |
| world helpers: `Sky Planks Boards Glow Beam beamAt WallClock`. Older temple backdrops `Gate Road Sala Path BenchSet TowerShape WellSet Corridor Porch` are flat single views, out of the studio: for a new temple build the place in perspective with `room.tsx` | | `src/kit/world.tsx`, `src/kit/temple.tsx` |
| places shot from many positions: `GasStation` (front, back), `Checkpoint`, `CemeteryRoad CemeteryGate Sala8 Grave Tamarind`, `CaretakerHut`, `RentedRoom` + `RENTED_ROOM`; vehicles `Sedan FallenBike`; over-the-shoulder `Shoulder` (`depth.tsx`) | studio `#places`, `#parts` | `src/kit/gasstation.tsx`, `checkpoint.tsx`, `cemetery.tsx`, `hut.tsx`, `rentedroom.tsx`, `vehicles.tsx` |
| everyday Thai locations & vehicles: `ShopRow StiltHouse Canal SpiritHouse Minimart HospitalHall Classroom DormHall RiceField BusStop SideRoadSet Motorcycle` | | `src/kit/places.tsx` |
| close-ups: `Hand`, `RainStreaks`, `Drips`, notebook `Page`/`Ink`, `RuleCardScene` | | `src/kit/inserts.tsx` |
| camera devices: `Pov` (peephole / keyhole / crack / binoculars / blinds / phone), `Split`, `Cctv` + `cctvFrame`, `MirrorFrame`; Dutch `data.tilt` / `Tilt` and foreground `Stage fore` / `Fore` | | `src/kit/pov.tsx`, `src/kit/stage.tsx` (when to use each: `cinematography.md`) |
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

Then `npm run timeline -- episodes/<slug>` (or `npm run check`) regenerates the registry. Entries here override the generic scenes of the same name. Promote a piece into `src/kit/` once a second episode uses it (CLAUDE.md rule 6).

## Rules that still apply

1. **Hands:** never draw a hand beside a resting arm. Stage actors: pose the figure's own arm (`armR=reach`, `arm=r-phone prop=phone`), which removes the resting one. A bare `Sprite`: `hideArmL` / `hideArmR`, then layer ONE pose arm + grip prop (`hands-poses.md`). Held props (`prop-*`, `acc-watch`) are anchored at (0,0): put them in their own `<Sprite>` or an `<svg><use href="#prop-coin" transform="translate(x y)"/></svg>`.
2. **Faces:** `hideFace`, then one `face-*` layer per figure per shot; change mood on a cut or beat (stage actors: the face word, or `faces=worried@0,shock@40` to change inside a shot).
3. **Layer order:** sky → background set (`Far`) → perspective floor/walls (`PerspFloor`, `SideWall`) → haze → light glows / cones (`mixBlendMode: 'screen'`) → shadows (`CastShadow`, `ShadowBlob`) → people → foreground frame (`Fore`) → night grade + vignette (`Grade`, or `rgba(6,10,26,.55)` + `<Vignette at>`) → rings/highlights → HUD. The protagonist who is a ghost gets no shadow. Every set shot passes `depth-light.md` §9.
4. **Closing lines need ≥ 2 s on screen.** Anything that appears in the last shot must land early.
5. Anything that enters later starts fully off-canvas; use `appear()` so scrubbing backwards is clean.
6. SVG shapes: animate geometry (`r`, `strokeDashoffset`) instead of CSS-scaling a shape inside a scaled `<svg>`.
7. Text under 28 px is unreadable on a phone.
8. `<use href="#id">` only works inside the same document: mount `<CastSprite/>` once (the engine's `Main` and `Board` already do; gallery frames do too).
9. **Motorcycle & riding shots (Global standard from `ghost-money` shot `021`):** Whenever any character rides or parks a motorcycle in any episode, import `SideRoadSet` and `Motorcycle` from `src/kit/places.tsx` (gallery: `highway-road`, `motorcycle-ride`, `motorcycle-parked`). Always use the side-riding posture from `ghost-money` shot `021` via `<Motorcycle x={680} y={860} scale={1.06} headlight rider={{shirt, pants, skin, hair, face, vest}} wheelSpin={f * 18} />` — never place a standing `<Actors>` sprite on top of a moving motorcycle.
10. **Costume consistency:** `sit`, `crouch`, `lie` come in the character's own costume (`src/cast/Body.tsx`), so do not re-draw one over a pose. A piece that draws its own person (`Motorcycle rider`, `CarInterior`, an own-SVG shot) takes their colours and signature details from `src/cast.json` by hand.
11. **The gallery is a library to search, not a menu.** Write the shot's `note` first, then look. A place card shows the set from three cameras and says what it tells, where to shoot from and what not to use it for. No shot has to be built from gallery pieces at all.
12. **Every shot is yours to author** (`directing.md`). Use `Stage` when it helps (camera keys, `fore`, grades, speaking mouths), or write the whole shot as its own SVG/React component — any shot, not only suspense beats (the `what-if-studio` `dead-come-home` S1–S18 pattern: a component per shot, its own camera, its own light, its own foreground). A scene component may switch on `view` for a few framings of one place, or a place can be a function `(cam) => world` that several shot components share. Build interiors once with `room.tsx` so every framing of the place stays true; promote a place into `src/kit/` once a second episode wants it.

## Checking a scene

`npm run check -- episodes/<slug>` renders `out/<slug>-board/element-N.jpeg` (one key frame per shot at 60 % of the shot). To see a different moment: `npx remotion still src/index.ts <Id> out/x.png --frame=<global frame>`. Look at the frames before any video render.
