# Story kit — เที่ยวสุดท้าย หนึ่งล้านบาท (the last ride)

Characters, truck, props and sets for this one story, built on the shared cast library (`cast-library.md`, `hands-poses.md`). Everything is prefixed `lr-` so it cannot collide with the shared kit.

| File | What |
|---|---|
| `template/assets/kit/stories/last-ride.svg` | every SVG symbol (`lr-*`); `build.mjs` inlines `stories/*.svg` next to `cast.svg` |
| `template/assets/kit/stories/last-ride.css` | colour tokens, sleeve classes, states, the HTML phone and ledger |
| `scripts/gallery-last-ride.mjs` | the gallery section (`npm run gallery` → section "เที่ยวสุดท้าย หนึ่งล้านบาท"); its `phoneHTML()` / `ledgerHTML()` are the markup to copy |

In a scene, link both stylesheets: `assets/kit/kit.css` then `assets/kit/stories/last-ride.css`.

**Same rules as the shared kit.** Hide the default part, then layer one replacement: `face-off` + one `face-*`, `mouth-off` + `talk-*`, `arm-l-off`/`arm-r-off` + one `arm-*`. A held prop sits on the pose arm's hand anchor and draws the hand over itself. Scale every figure by height = cm × 2.6 × your scene scale.

## People

| Symbol | Who | Frame · height | Sleeve class | Overlay transform (faces, talk, acc, mark) | Resting hands r / l |
|---|---|---|---|---|---|
| `lr-ek` | เอก, driver, cap built in | 200×520 · 172 cm | `c-lr-ek` (short sleeves) | none | (146,328) / (54,328) |
| `lr-ek-drive` + `lr-ek-drive-hands` | เอก driving (waist up, two layers) | 200×520 | `c-lr-ek` | none | on the wheel |
| `lr-chan` | ลุงชาญ, hunched, long face, thick grey brows | 200×520 · 165 | `c-lr-chan` | `translate(0 13)` | (140,332) / (60,332) |
| `lr-mom` | แม่ผู้โดยสาร | 200×520 · 158 | `c-lr-mom` | `translate(0 4)` | (146,318) / (54,318) |
| `lr-girl` | เด็กผู้โดยสาร, bob + one clip | 200×420 · 110 | `c-lr-girl` | none | (146,262) / (54,262) |
| `lr-mom-girl` | แม่จูงมือลูก, the two hands joined | 350×520 (mother at 1:1) | — | mother `translate(0 4)` | — |
| `lr-wife-sit` | ภรรยาเอก, sitting, legs to screen-right | 200×520 · 158 | `c-lr-wife` | `translate(0 104)`; pose arms `translate(0 100)` | — |
| `lr-son` | ลูกเอก | 200×420 · 125 | `c-lr-son` | none | (146,262) / (54,262) |

Poses and moods asked for in the brief:

| Who | Pose | How |
|---|---|---|
| เอก | stand / phone / reach a latch / drive | `lr-ek` · `arm-l-off` + `arm-l-hold` + `lr-phone-hand` at (88,244) · `arm-r-off` + `arm-r-reach` (hand (226,176)) · cab layers below |
| เอก | normal / wary / shocked / sad | built-in face · `face-off lr-no-cap` + `face-wary` / `face-shock` / `face-sad`, then `lr-ek-cap` on top (the brim covers the brows) |
| เอก | spirit (after the 2nd twist only) | `lr-spirit` on the same svg: colour drained, slightly light. Nothing ghostly before that. |
| ลุงชาญ | stand / hand over the key | `lr-chan` · `arm-l-off` + `arm-l-offer` + `lr-key` at (−14,222) |
| ลุงชาญ | unreadable / guilty | built-in face · `face-off` + `face-guilty` at `translate(0 13)` |
| แม่ / เด็ก | normal / wet and pale | `lr-wet` on the svg (clumped hair tips, wet patches, a few drops; no blood) — only at the reveal |
| เด็ก | holding the doll | `arm-r-off` + `arm-r-hold` + `lr-doll` at `translate(112 254) scale(.74)` + `lr-hand-cover` at (112,244) |
| แม่ + เด็ก | holding hands | `lr-mom-girl` |
| ภรรยา | sitting with the phone / worried / crying | `lr-wife-sit` + `arm-r-off`, `<g transform="translate(0 100)">` `arm-r-hold` + `lr-phone-hand` at (112,244) `</g>` · `face-off` + `face-worried` / `face-cry` at `translate(0 104)` |

Ek's watch sits on his screen-right wrist (inside the resting arm). When that arm is posed, the watch goes with the rest arm: pose the other arm, or add `lr-watch-wrist` at the pose hand anchor.

States: `lr-no-cap` · `lr-no-watch` (drive hands) · `lr-wet` · `lr-spirit` · `lr-rim` (thin warm/cool rim light so a figure separates from a night set; combine with `lr-spirit` freely).

## The truck

Side parts share `viewBox="0 0 1300 620"` (5 m at cast scale, ground y 600) and stack aligned:

```html
<svg viewBox="0 0 1300 620" class="lr-lights-on">
  <use href="#lr-truck-shadow-side"/>
  <g class="ep-truck-body">                       <!-- tilt / bounce this group -->
    <use href="#lr-truck-side-box"/>             <!-- leave out for Ek's own open pickup -->
    <use href="#lr-truck-side-body"/>
    <use href="#lr-truck-beam-side"/>            <!-- headlights on -->
    <use href="#lr-truck-damage-side"/>          <!-- accident flashback only -->
  </g>
  <use href="#lr-truck-wheel" x="330" y="520"/><use href="#lr-truck-wheel" x="1030" y="520"/>
</svg>
```

Or use the composed `lr-truck-side` with classes `lr-lights-on`, `lr-no-box`, `lr-damaged`. Tilt: rotate the body group around (680,520) by 2–4°. Spin wheels with `rotation` and `svgOrigin: "0 0"`.

Rear parts share `viewBox="-40 0 600 640"` (ground y 632): `lr-truck-rear-base` → `lr-truck-rear-inside` (dark walls, lighter floor) → `lr-wet-prints` (optional) → doors `lr-truck-rear-door-l` / `-r` (shut) or `lr-truck-rear-door-l-open` / `-r-open`. The composed `lr-truck-rear` takes `lr-doors-open` and `lr-prints`. When you place it with `<use>`, put `x="-40" width="600" height="640"` on it. The doll on the floor: `lr-doll` at (300,446), `rotate(-78) scale(.42)` in rear coordinates. Latch close-up: `lr-latch` (400×400).

Cab close-up, `viewBox="0 0 1080 960"`, right-hand drive (the driver sits screen-left):

```
lr-cab-back → lr-ek-drive → lr-cab-dash → lr-cab-wheel → lr-ek-drive-hands → lr-cab-frame
```

Ek's layers go at `x="170" y="203" width="300" height="780"`. A face on him uses the same box, then `lr-ek-cap` again. The passenger seat top is at about (770,620) for the doll or a passenger.

## Props

| Symbol / markup | Notes |
|---|---|
| `lr-phone-hand` | the handset in a hand (grip prop); `--lr-phone-glow` tints the screen to match the close-up |
| `.lr-phone[data-screen]` | HTML close-up, 420×860. Screens: `deposit` (+500,000.00 บาท), `call-chan`, `call-wife`, `voice` (tween `--lr-progress` 0→1 on `.lr-wave`). Change `data-screen` on a cut. All text is editable HTML, ≥ 28 px. |
| `.lr-ledger` / `.lr-ledger.is-open` | HTML handover book. Closed cover, or the spread: old names struck (`.lr-row.is-struck`), ชาญ, then เอก + the signature line on the next page. Toggle `is-struck` on ชาญ when the handover completes. |
| `lr-doll` | rabbit, one ear folded, button eyes; origin = the tummy. Held: add `lr-hand-cover` after it. Floor or seat: rotate or place it. `lr-wet` on any parent. |
| `lr-key` | one key, round ring, faded square tag (grip prop). Same symbol in Chan's hand and Ek's. |
| `lr-watch` / `lr-watch-wrist` | close-up 240×320 and wrist size, both stopped at 20:47 (hands at 8:47 + an ana-digi window reading 20:47). `lr-cracked` shows the crack on both. |

## Sets

| Set | Symbols (scene position) |
|---|---|
| A โกดัง | `lr-warehouse-wall` 1080×1240 (y 0) · `lr-warehouse-floor` 1080×700 (y 1220) · `lr-warehouse-lamp` 1080×1240 (over the truck, under the people) |
| B ถนน | `lr-road-bg` 1080×1240 (y 0) · `lr-road-ground` 1080×720 (y 1200) · `lr-road-fg` 1080×320 (y 1600) · one stop on the far shoulder: `lr-road-sala` 460×400 / `lr-road-shop` 480×440 / `lr-road-bridge` 1080×300 (bottom ≈ y 1210) |
| C อุบัติเหตุ | set B + `lr-road-rail-bent` 560×240 + `lr-road-debris` 420×90 + the side truck with `lr-no-box lr-damaged`, tilted |
| D ท่าเรือ | `lr-pier-bg`, `lr-pier-deck`, `lr-pier-posts`, all 1080×1920. Near deck from y 1240; the walkway runs to the warm light at y 860. Draw posts over the people. |
| E บ้านเอก | `lr-house` 1600×1920 cut-away. Inside x 0–1000 (wife on the stool x ≈ 170, son x ≈ 380); the door and porch x 1000–1600 (Ek x ≈ 1130). Crop x 0–1080 for inside, x 520–1600 for outside. |

Captions sit around y 1390: keep faces above y 1180. In the sample frames the near ground sits at y 1210–1290.

## Checked

`npm run gallery` renders every piece (the section ends with three sample frames: the warehouse handover, Ek opening the box to find the doll, and the mother and girl at the pier). A test episode built with `build.mjs` inlined the `lr-*` sprite, `hyperframes check` passed, and a snapshot showed the warehouse, the truck, Ek with the phone, and the HTML deposit screen rendering correctly.

## Landscape film (1920×1080)

The landscape film (`episodes/last-ride`) adds `lr-l-*` sets to `last-ride.svg` (the portrait ones stay): `lr-l-road-sky` + `lr-l-road-ground` (+ `lr-l-road-dash` to slide), `lr-l-road-back`, `lr-l-warehouse` + `-lamp`, `lr-l-warehouse-front`, `lr-l-pier` + `-posts`, `lr-l-house` + `lr-l-house-table`, `lr-l-cab-out` (cab core at x 352, scale 1.125). Extra pieces: `lr-own-marks` / `lr-own-dent` / `lr-own-rope` / `lr-own-sticker` (Ek's own rust-red pickup: class `lr-own lr-no-box`), `lr-cream-box` (the box truck is cream all over), `lr-rescue-side`, `lr-curve-sign`, `lr-tree-broken`, `lr-sheet`, `lr-shoe` / `lr-shoe-hand`, `lr-garland`, `lr-vest`, `lr-bag-hug`, `lr-cap-ground`, `lr-book-hand`, `lr-hand-big` / `lr-arm-big` / `lr-watch-big` (close-up hands).

`stories/last-ride.js` is the scene runtime: `LR.shots(compId, fallback)`, `LR.run(...)` (one DOM instance per shot), `LR.who(name, {face, talk, r, l, rProp, lProp, nocap…})`, `LR.cam` (pans are clamped to the zoom), `LR.phone(screen)`, `LR.ledger(page)` and reusable views `LR.V.cab / phone / ledger / mirror / road`. Two traps it documents: GSAP x/y/rotation on an SVG element replaces its `transform` attribute (keep static transforms on an inner `<g>`), and `var()` does not work inside an SVG `opacity` attribute (use `style`).

The watch reads 20:47. The wet state has no puddle (the script's clue is that there is none).
