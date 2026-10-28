# Cast library — ready-made pieces in `cast.svg`

Everything here lives in `template/assets/kit/cast.svg` and is inlined into every episode by `build`. See all of it on one page: `npm run gallery` → open `template/assets/kit/gallery.html`. Reuse before drawing; a new piece that will come back goes into `template/` (and this table), never into one episode only.

**One rule for every overlay:** hide the default part first, then layer exactly one replacement. Arms → `arm-l-off` / `arm-r-off` (see `hands-poses.md`). Face → `face-off`. Mouth only → `mouth-off`. Never stack a second pair of eyes, a second mouth or a second hand on top of the default one.

## Layer order inside one figure `<svg class="who …">`

```
behind pieces (acc-backpack) → body (man, man-sit…) → face-* / talk-* → acc-* → arm-* → props on the hand → mark-*
```

## People

| Symbol | Frame | Height | Notes |
|---|---|---|---|
| `man` `man-wide` `man-raise` | 200×520 | 170 cm | default lead |
| `woman` | 200×520 | 158 | faces/acc need `translate(0 4)` |
| `auntie` | 200×520 | 150 | faces/acc need `translate(0 4)` |
| `elder` | 200×520 | 160 | right hand holds a candle (no right pose arm) |
| `raincoat` | 200×520 | 165 | `--coat` |
| `student` | 200×520 | 165 | Thai high-school uniform: `--uniform` `--badge` |
| `kid` | **200×420** | 120 | primary-school boy: `--uniform` `--shorts` `--sock`; draw height = cm × 2.6, width = height × 200 / 420 |
| `kid-girl` | **200×420** | 120 | pigtails `--tie`, navy skirt `--shorts` |
| `crowd` | 640×520 | mixed | silhouettes, front row `--crowd`, back row `--crowd-far`; panic / queue / stairs |

Kids share the man's head and shoulder coordinates, so `face-*`, `talk-*`, `acc-*` and `arm-*` fit them with no transform. Sleeve class: `c-kid`, `c-kid-girl`, `c-student`.

## Whole-body poses

Anything layered on a posed body (face, talk mouth, accessory, mark) takes the **same transform** as the pose:

| Pose | Frame | Overlay transform | Pose arms? |
|---|---|---|---|
| `man-walk` | 200×520 | none | yes |
| `man-run` | 200×520 | `rotate(8 100 300)` | no (arms are part of the stride) |
| `man-sit` | 200×520 (legs reach x ≈ 255) | `translate(0 110)` | yes, with `translate(0 110)` |
| `man-crouch` | 200×520 | `translate(0 160)` | no (hugging knees) |
| `man-back` | 200×520 | — (no face) | rest only |
| `man-lie` | **520×200** | `translate(0 234) rotate(-90)` | no |
| `woman-sit` | 200×520 | `translate(0 104)` | yes, with `translate(0 100)` |
| `woman-run` | 200×520 | `rotate(8 100 300) translate(0 4)` | no |
| `woman-back` | 200×520 | — | rest only |
| carry | `man` + `arm-l-carry` + `arm-r-carry` + `prop-box` at `translate(100 262)` | none | it is a pose-arm pair |

Any standing figure can lie down: `<g transform="translate(0 234) rotate(-90)"><use href="#woman" width="200" height="520"/></g>` in a `viewBox="0 0 520 200"` svg. Change pose **on a cut or a beat**, never by morphing.

```html
<!-- sitting, scared, phone in the right hand -->
<svg class="who c-man face-off arm-r-off" viewBox="0 0 200 520">
  <use href="#man-sit"/>
  <use href="#face-scared" transform="translate(0 110)"/>
  <g transform="translate(0 110)"><use href="#arm-r-hold"/><use href="#prop-phone" transform="translate(112 244)"/></g>
</svg>
```

## Story kits

Story-only pieces live in `template/assets/kit/stories/<story>.svg` + `.css` with their own id prefix; `build.mjs` and the gallery pick them up automatically. Current kits: `last-ride.md` (`lr-`).

Short sleeves: set `--forearm: var(--skin)` on the figure (pose arms then show a skin forearm under the sleeve).

## Faces — `face-off` + one `face-*`

`happy laugh sad cry angry scared shock worried smirk tired hollow wary guilty`. Match the caption line. `hollow` (blank black eyes) is saved for ghosts and the twist frame. One face per figure per shot.

## Talking — `mouth-off` + `talk-*`

`talk-a` (open) `talk-e` (wide) `talk-o` (round) `talk-m` (closed). Eyes stay neutral. A `face-*` brings its own mouth, so use a face **or** talk mouths. Animate by swapping the `href` on a fixed 0.12 s grid while the line is voiced, and end on `talk-m`:

```js
// in the scene script; #ep-mouth is <use id="ep-mouth" href="#talk-m"/> inside the figure svg
const SHAPES = ["#talk-a", "#talk-m", "#talk-e", "#talk-o", "#talk-m"];
function talk(sel, from, to) {
  let i = 0;
  for (let t = from; t < to; t += 0.12) tl.set(sel, { attr: { href: SHAPES[i++ % SHAPES.length] } }, t);
  tl.set(sel, { attr: { href: "#talk-m" } }, to);
}
talk("#ep-mouth", 0.4, 2.1); // the voice line's local start/end from timing.json
```

Deterministic (no random). Not yet run through `hyperframes check` in an episode: snapshot it the first time you use it.

## Accessories — the one trackable trait

| Symbol | Where | Var |
|---|---|---|
| `acc-glasses` `acc-cap` `acc-mask` `acc-headband` | head | `--frame` `--cap` `--cap-d` `--mask` `--bandage` `--blood` |
| `acc-scarf` `acc-bag` `acc-amulet` `acc-straps` | body | `--scarf` `--bag` `--bag-d` `--bag-strap` `--strap` |
| `acc-backpack` | **behind** the body: put it before the character use, add `acc-straps` after | `--pack` `--roll` |
| `acc-watch` `acc-hand-bandage` | on a hand: origin = hand centre | `--bandage` `--blood` |

Resting hand anchors: man r (148,330) l (52,330) · woman/auntie r (146,318) l (54,318) · raincoat r (152,334) l (48,334) · kid r (146,262) l (54,262). Pose-arm anchors: `hands-poses.md`. Give each named character one of these and keep it on the same side every shot: it is the clue device (a bandaged hand, a missing amulet, the watch that stopped).

## Emotion marks — `mark-*`

`question exclaim anger drops zzz dizzy idea shiver gloom`. Pop in with `back.out` on the beat the line lands, hold ≥ 0.8 s, one mark per figure at a time. Outlined in ink so they read on bright and dark sets.

## Props — origin = the hand centre

One-hand grip props (object first, hand last): `prop-glass coin phone paper key flashlight bottle radio candle map rope sack bowl bandage`. `prop-sack` hangs below the hand. Two-hand: `prop-box` (carry pose). Rules in `hands-poses.md`.

## Info icons — `icon-*`, viewBox 0 0 100 100

`clock thermo warn check cross arrow drop bolt fire pin skull eye`. For cards, HUD, checklists and maps; draw at 64–140 px; `<svg viewBox="0 0 100 100"><use href="#icon-warn"/></svg>`. Colours read `--ink --paper --red --gold --ok` (`--icon` for the arrow).

## Set pieces — `set-*`

The viewBox is the piece's size in px at the cast scale (cm × 2.6), so drawn at its viewBox size it matches a 442 px man.

| Symbol | Size | Vars |
|---|---|---|
| `set-door` / `set-door-open` | 234×533 | `--door` `--door-frame` `--void` |
| `set-window` | 260×312 | `--frame` `--glass` (night default; set a sky colour for day) |
| `set-table` | 312×195 | `--wood-0` `--wood-1` |
| `set-chair` | 117×234 | wood tokens |
| `set-tap` | 160×200 | `--basin` |
| `set-stairs` | 300×300 | `--wall-0` |
| `set-bulb` | 120×220 | `--lamp` |
| `set-bed` | 520×200 | `--blanket` |
| `set-shrine` (ศาลพระภูมิ) | 200×360 | `--shrine` `--shrine-roof` `--shrine-pole` |

Silhouettes: `.sil` blacks out people, accessories and uniforms; props, icons, marks and set pieces keep their colours.
