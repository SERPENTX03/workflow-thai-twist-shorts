# Art direction

The look: a quiet, flat 2D night illustration — like a storybook drawn in vector shapes — with clean UI cards laid on top. Calm frames, precise motion, one red accent that only appears when the story turns.

## Palette (tokens in `assets/kit/kit.css`)

| Role | Token | Notes |
|---|---|---|
| Night sky / map ground | `--sky-0` `--sky-1` | navy gradient; never pure black backgrounds |
| Interior | `--wall-0/1`, `--floor-0/1` | cool blue-grey walls, warm brown wood floors |
| Light | `--lamp`, `--moon` | the only warm sources; use soft radial glows (`mix-blend-mode: screen`) |
| UI paper | `--cream`, `--paper`, `--ink` | cards, newspapers, HUD |
| Accent | `--red` | captions that turn the story, rings, stamps, the "คุณ" chip. **Nothing else is red.** |
| Cast | `--skin`, `--hair`, `--shirt`, `--pants` | protagonist always wears the blue shirt so he reads at a glance |

## Type

- **Display**: Kanit 600/700 — captions, headlines, big numbers.
- **UI**: IBM Plex Sans Thai 500/700 — cards, chips, HUD, labels.
- No third face. No outlined or gradient text. Caption size 74 px (do not go below 64 px — phone readability).

## Frame and safe zones (1080×1920)

- Action and faces live in **y 160–1180**. Captions sit centred at **y ≈ 1390** on a soft dark band.
- Bottom **~380 px** stays free of essential content (platform UI covers it).
- Cards: top area (y 240–700) when the scene is behind them, or lower (y 1490–1830) on map scenes where the map fills the top.
- HUD clock top-left (70, 90). Only in night/time-critical scenes.

## Scene types (reusable vocabulary)

| Type | Example file | Use for |
|---|---|---|
| Side-view interior | `scene-example-room.html` | most story beats; layered wall → props → light → people → night grade |
| Top-down map | `scene-example-map.html` | movement, "god view", who is where, the final sting |
| Evidence card | `scene-example-news.html` | newspaper, contract, calendar, phone screen — the reveal's proof |
| Exterior | (draw per episode) | establishing hook: building, corridor, door number |
| Info card over scene | `.card` | counts, lists, dials ("ของที่ย้ายที่เอง ×12", "วิญญาณที่พบ 0") |

## Camera and motion

- Every shot has motion: a slow push (scale 1 → 1.1 over the shot), a pan, or an entrance. Never a dead frame for a full shot.
- Entrances: slide-up through a mask, back-out pops for chips/rings, drop-in for cards. **Banned**: everything fading in, centred title on a gradient, glow on UI, generic particle bursts, corner labels or frame borders.
- Hard cuts between shots (on the beat). Camera continuity inside a scene clip.
- Highlight with **dashed red rings/ellipses** that pop in (back.out), not arrows.
- Ease: `power2/3.out` for moves, `back.out(1.8–2.2)` for pops, `power2.inOut` for camera.

## Cast rules

- Characters come from `assets/kit/cast.svg` (`man`, `man-wide`, `man-raise`, `woman`, `elder`). Add new symbols there, same 200×520 frame, colours through CSS variables.
- The living cast a `.shadow-blob`; the protagonist-ghost never does (if the twist is a ghost twist).
- Silhouettes / reflections / shadows = the same symbol with `.sil`.
- Faces are dots; emotion = `man-wide` (wide eyes, open mouth). Keep characters ≥ 600 px tall when they matter.
