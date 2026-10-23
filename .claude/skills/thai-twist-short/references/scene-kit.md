# Scene kit — building `compositions/scene-<name>.html`

Start by copying the closest example (`scene-example-room.html`, `scene-example-map.html`, `scene-example-news.html`) to `scene-<name>.html`, rename every id prefix and the composition id, then run `npm run build`. The build wires it in automatically (the host id becomes `scene-<name>`).

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

Cast member: `<svg class="who" viewBox="0 0 200 520"><use href="#man-wide" /></svg>` — symbols: `man`, `man-wide`, `man-raise`, `woman`, `elder`.

## Gotchas found while building this kit (all verified)

1. **External sprite refs do not render.** `<use href="assets/kit/cast.svg#man">` draws nothing. Use `href="#man"`: `build.mjs` inlines `cast.svg` into `index.html`, so the symbols are in the document. Add new characters to `cast.svg`, then rebuild.
2. **Don't scale SVG shapes inside a scaled `<svg>` with GSAP `scale`/`transformOrigin`** — the shape drifts off its position. Animate the geometry instead: `tl.fromTo("#ring", { attr: { r: 20 } }, { attr: { r: 72 } }, t)`.
3. **Intentional overflow** (camera world bigger than the frame, panning grids, a figure cropped by a photo frame, caption lines sliding through their mask) must carry `data-layout-allow-overflow`, or `check` reports layout findings.
4. **Closing lines need ≥ 2 s on screen.** A chip or label that appears in the last shot must land early enough (check reports `line_unread`).
5. No `<br>` in text: split lines into block `<span>`s.
6. Never put a CSS `transform` on an element you also tween (`gsap_css_transform_conflict`) — set the start state in `fromTo`.
7. A named `font-family` must have an `@font-face` that reaches the file; linking `kit.css` (which declares Kanit and Plex Thai) is enough.

## Layer order inside a scene

background (sky/wall) → set dressing → light glows (`mix-blend-mode: screen`) → shadows → people → night grade overlay (`rgba(6,10,26,.55)`) → rings/highlights → HUD. Captions and vignette come from the captions layer above every scene — don't draw captions in scenes.
