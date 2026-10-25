# Scene kit — building `compositions/scene-<name>.html`

Start by copying the closest example (`scene-example-room.html`, `scene-example-rules.html`, `scene-example-map.html`, `scene-example-news.html`, `scene-example-next.html`) to `scene-<name>.html`, rename every id prefix and the composition id, then run `npm run build`. The build wires it in automatically (the host id becomes `scene-<name>`).

## File shape (HyperFrames sub-composition)

```html
<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <link rel="stylesheet" href="assets/kit/kit.css" />
      <style>
        #root { position: absolute; inset: 0; overflow: hidden; background: #05070c; }
        #door-panel { … }              /* prefix every id with the scene name */
      </style>
      <div id="root" data-composition-id="scene-door" data-width="1080" data-height="1920">
        …
      </div>
      <script>
        const tl = gsap.timeline({ paused: true });
        tl.fromTo("#door-panel", { x: 0 }, { x: -200, duration: 1.2, ease: "power2.inOut" }, 0.4);
        window.__timelines["scene-door"] = tl;
      </script>
    </template>
  </body>
</html>
```

- Times in the scene are **local to the clip**. Get each shot's local start from `timing.json → scenes[] → local[].at`.
- Composition id = `scene-<name>` = the `window.__timelines` key.
- Styles and scripts go **inside** `<template>`; style the root by `#root`, never a class.
- Use `gsap.fromTo` (not `from`) so seeking backwards replays cleanly.

## Kit classes (`assets/kit/kit.css`)

| Class | What |
|---|---|
| `.card` + `.card-title` / `.card-big` | cream info card with red spine |
| `.chip`, `.chip.red` | pill label (names on maps, "ยังไม่ได้…", "ไม่มีเงา") |
| `.hud` + `.hud-moon` | clock chip, e.g. `<div class="hud"><div class="hud-moon"></div>03:00</div>` |
| `.who` | an SVG cast member box (200×520 by default — set width/height to scale) |
| `.sil` | turns any cast member into a featureless black silhouette |
| `.shadow-blob` | floor shadow under living characters |
| `.vignette` | already applied over everything by the captions layer |
| `.tag` (+ `.you`, `.warn`) | name tag with a coloured dot: `<div class="tag you"><i></i>คุณ · ม.4/2</div>` |
| `.rule-card` + `.rule-no` / `.rule-text > span` | "กฎข้อ 1" card, red top edge |
| `.stat` + `.stat-label` / `.stat-num` / `.stat-unit` | a number that matters; count it with a tween on a plain object + `onUpdate` (see `scene-example-rules.html`) |
| `.meter > b` (+ `.low`) | a level that drains or fills — tween the `b`'s `width` |
| `.checklist > .row > .box > .tick` | rows that tick — pop each `.tick` with `scale` 0 → 1 on a beat |
| `.next-card` + `.next-kicker` / `.next-title > span` / `.next-cta` | series end card (`scene-example-next.html`) |
| `.rain` | falling streaks; tween `backgroundPosition` with `ease: "none"` across the clip |
| `.flood` | flood / canal water band; set `top` + `height`, tween `y` (negative) to make it rise — tweening `top` fails `check` |
| `.mirror-y` | water reflection wrapper (flipped, faint); a ghost gets none |
| `.far` | soft-focus wrapper for the far set (depth); keep cast and props outside it |

## Example scenes

| File | Shows |
|---|---|
| `scene-example-room.html` | side-view night interior, mirror silhouette, HUD clock |
| `scene-example-rules.html` | day set in `.far`, name tag, rule card drop, stat count-down, meter drain, checklist ticks — across two shots in one clip |
| `scene-example-map.html` | top-down map, hollow dot, dashed paths |
| `scene-example-news.html` | evidence card with blur-to-sharp photo and red ring |
| `scene-example-next.html` | ตอนต่อไป end card; all text lands by 1.0 s so it is read for ≥ 2 s |
| `scene-example-cast.html` | dusk line-up: `hero` + `dog-patch`, `beagle`, `cat-orange`, `cat-black` (300×340 pet frame), relative heights, staggered pop-in, `.tag` labels |

Cast member: `<svg class="who" viewBox="0 0 200 520"><use href="#man-wide" /></svg>` — symbols: `man`, `man-wide`, `man-raise`, `woman`, `elder`, `raincoat` (hooded lead, `--coat`). Animal companion: `dog`, `dog-growl` use their own frame, `viewBox="0 0 320 220"` (side view facing right, `--fur` / `--fur-patch`); flip with `scaleX(-1)` on a wrapper.

## Gotchas found while building this kit (all verified)

1. **External sprite refs do not render.** `<use href="assets/kit/cast.svg#man">` draws nothing. Use `href="#man"`: `build.mjs` inlines `cast.svg` into `index.html`, so the symbols are in the document. Add new characters to `cast.svg`, then rebuild.
2. **Don't scale SVG shapes inside a scaled `<svg>` with GSAP `scale`/`transformOrigin`** — the shape drifts off its position. Animate the geometry instead: `tl.fromTo("#ring", { attr: { r: 20 } }, { attr: { r: 72 } }, t)`.
3. **Intentional overflow** (camera world bigger than the frame, panning grids, a figure cropped by a photo frame, caption lines sliding through their mask) must carry `data-layout-allow-overflow`, or `check` reports layout findings.
4. **Closing lines need ≥ 2 s on screen.** A chip or label that appears in the last shot must land early enough (check reports `line_unread`).
5. No `<br>` in text: split lines into block `<span>`s.
6. Never put a CSS `transform` on an element you also tween (`gsap_css_transform_conflict`) — set the start state in `fromTo`.
7. A named `font-family` must have an `@font-face` that reaches the file; linking `kit.css` (which declares Kanit and Plex Thai) is enough.
8. An element that enters later must start **fully** off-canvas in its `fromTo` start state (e.g. `y: 1500`, not `y: 900`), or it sits visible below the frame content during earlier shots.
9. Reading text under 28 px fails `check` (`text_below_floor`). Mark pure texture with `data-layout-ignore`.

## Layer order inside a scene

background (sky/wall) → set dressing → light glows (`mix-blend-mode: screen`) → shadows → people → night grade overlay (`rgba(6,10,26,.55)`) → rings/highlights → HUD. Captions and vignette come from the captions layer above every scene — don't draw captions in scenes.
