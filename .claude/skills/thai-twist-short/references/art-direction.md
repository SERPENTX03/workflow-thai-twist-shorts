# Art direction

The look: flat 2D vector illustration like a storybook, with clean UI cards, counters and diagrams laid on top. Calm frames, precise motion. Colour accents are rationed so they mean something. Evidence: `ref-library.md`.

## Palette (tokens `T` in `src/engine/theme.ts`)

Pick a **set palette per scene**, not one for the whole film. Bright sets are normal; darkness is saved for the turn.

| Set | Tokens | Use for |
|---|---|---|
| Day (school, street, farm) | `T.day0` `T.day1`, real sky blue, green grass | survival openings, rules, knowledge beats |
| Warm wood / lantern | `T.wood0` `T.wood1`, `T.lamp` glow | Thai houses, folklore interiors |
| Night city / interior | `T.sky0/1`, `T.wall0/1`, `T.floor0/1`, `T.moon` | night beats, the turn, the reveal |
| UI paper | `T.cream`, `T.paper`, `T.ink` | cards, stat tiles, checklists, newspapers |

Landscape stage grades (`night`, `lamp`, …, plus `past` for flashbacks) live in `GRADES` / `<Grade>` in `src/kit/stage.tsx`.

Accents:

| Token | Means | Where |
|---|---|---|
| `T.red` | danger / the story turns | full red caption box (2–4 per film), `{คำ}` keyword, rings, rule-card spine, ตอนต่อไป kicker |
| `T.gold` | a fact, a number, the smart move | `[คำ]` keyword, `<Tag tone="you">` dot |
| `T.ok` | done / safe | checklist ticks, `<Tag>` dot for living cast |

Arc: open bright or warm → drift darker each act → the reveal is the darkest frame → end card on navy.

## Type

- **Display**: Kanit 600/700 — captions, rule text, big numbers.
- **UI**: IBM Plex Sans Thai 500/700 — cards, tags, HUD, labels. Never under 28 px (`check` flags it).
- Caption 74 px (`bold` look) or 56 px on a dark pill (`folk` look). No third face, no outlined or gradient text.

## Frame and safe zones (1080×1920; landscape: `thai-long-story` → `longform-rules.md`)

- Action and faces live in **y 160–1180**. Captions centred at **y ≈ 1390**.
- Bottom **~380 px** carries no essential content, but the **set continues to the bottom edge** (floor, grass, water). Never leave it flat black.
- Cards: top area (y 170–700) when the scene is behind them, or lower (y 1490–1830) on map scenes.
- HUD clock top-left (70, 90) whenever time matters — in survival stories that is most of the film.

## Shot vocabulary (rotate them: no two consecutive shots of the same type)

| Type | Example | Use for |
|---|---|---|
| Side-view set + cast | generic `room` | most story beats |
| Rules / numbers over a set | generic `rules` | "กฎข้อ N", stat tile, meter, checklist |
| Close-up object or face | (draw per episode) | ~1 in 4 shots: hand on the tap, dog nose, sweating face, bandage — the clue shots |
| Diagram / cross-section | (draw per episode) | how something works: pipe from pump to floor 23, door open-in vs open-out, crowd per m² from above |
| Top-down map | generic `map` | who is where, distance rings, the final sting |
| Evidence card | generic `news` | newspaper, calendar, phone alert — the reveal's proof |
| Exterior / establishing | (draw per episode) | hook: skyline going dark, school with flag, stilt house in rain |
| Silhouette crowd / backlit door | (draw per episode with `<Sprite silhouette>` / `crowd`) | panic, stairs full of people, someone at the door |
| Next-episode card | generic `next` | series ending |

Generic scenes: `src/scenes/`, their `data` in `scene-kit.md`.

## Information graphics (the reference clips' signature)

- **Something counts on screen at least every ~10 s**: clock, day counter, stat tile, meter, thermometer, calendar.
- Counters tick with the voice (count 90 → 29 while the line is read), meters drain with a `tick` cue.
- Checklists tick one row per beat. Rule cards drop in with a `stamp`.
- Label every named character the first time with a `<Tag>` (dot + name + one fact: "เจย์ · 28 ปี").
- Diagrams use the paper palette, thick ink lines, one gold or red highlight, labels as `<Chip>` (`src/kit/ui.tsx`).

## Camera and motion

- Every shot has motion: slow push (scale 1 → 1.08), a pan, or an entrance. Never a dead frame for a full shot.
- **Depth**: put the far set inside `<Far>` (soft blur, `src/kit/fx.tsx`); keep the cast and props sharp; foreground objects may cross the frame edge.
- Entrances: slide-up through a mask, back-out pops for chips/rings/ticks, drop-in for cards, count-up for numbers. **Banned**: everything fading in, centred title on a gradient, glow on UI, generic particle bursts, frame borders.
- Hard cuts between shots (on the beat). Camera continuity inside a scene clip.
- Highlight with **dashed red rings** that pop in (`backOut`), not arrows.
- Ease (`src/engine/anim.ts`): `easeOut` for moves, `backOut(1.8–2.4)` for pops, `easeInOut` for camera and counters.
- Folklore look: slower pushes (whole shot), lamp flicker, rain; still cut on beats but hold longer.

## Cast rules

- **Single Source of Truth:** Characters and metadata come from `src/cast.json` (full list: `cast-library.md`, studio: `npm run gallery`). Always cast from active (non-retired) symbols (`lead-male-A/B`, `lead-female-A/B`, `villain-male-A/B`, `father-A/B`, `mother-A/B`, `police-A/B`, etc.). Legacy symbols (`man`, `woman`, `auntie`, `elder`, `M1`–`B1`, `din`) are retired (`"retired": true` in `src/cast.json`). To add new symbols, add them in `src/cast/source/cast.svg`, register in `src/cast.json`, and regenerate `CastSprite.tsx` with `node scripts/svg-to-tsx.mjs`.
- **Prototype 1 cast** (design canvas https://claude.ai/artifact/TuLAda3PXVngzNaWVrjR1S): pets `cat-black`, `cat-orange`, `beagle`, `dog-patch` (300×340 frame; the old `dog` stays for the temple dog in flood-canal). Share one look: big round head, dot or round glossy eyes, soft pink cheeks.
- **Relative height**: keep one px-per-cm per shot — `personHeight(id, pxPerCm)` in `src/cast/Sprite.tsx` reads `HEIGHT_CM` (man 170, raincoat 165, student 165, elder 160, monk 160, woman 158, auntie 150, kid / kid-girl 120 in their own 200×420 frame). Pets at the same scale (at 2.6 px/cm: cat 150 px, beagle 205, dog-patch 225). Never stretch every character to one height.
- **Hands (hard rule):** one arm = one sleeve + one hand; hide the resting arm before posing it; use the pose library and grip props. Full rules, anchors and checklist: `hands-poses.md`.
- **Faces:** pick the mood from the face library (`face-*` in `cast.svg`, gallery: `npm run gallery`); hide the neutral face with `hideFace` first — never draw a second pair of eyes over it. Match the mood to the caption line; `hollow` is saved for the turn.
- Give each named character **one trackable trait** (long sleeves, cap, glasses) — it doubles as a clue device.
- The animal companion appears in at least 3 shots and reacts before the humans do.
- The living cast a `<ShadowBlob>`; a ghost protagonist never does (stage roster: `noShadow`).
- Silhouettes / reflections / crowds = the same symbol with `<Sprite silhouette>` (stage roster: `sil`).
- Close-up faces: draw the head big (≥ 500 px) with sweat drops or wide eyes; full figures that matter ≥ 600 px tall.
