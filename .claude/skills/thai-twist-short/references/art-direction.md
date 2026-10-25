# Art direction

The look: flat 2D vector illustration like a storybook, with clean UI cards, counters and diagrams laid on top. Calm frames, precise motion. Colour accents are rationed so they mean something. Evidence: `ref-library.md`.

## Palette (tokens in `assets/kit/kit.css`)

Pick a **set palette per scene**, not one for the whole film. Bright sets are normal; darkness is saved for the turn.

| Set | Tokens | Use for |
|---|---|---|
| Day (school, street, farm) | `--day-0` `--day-1`, real sky blue, green grass | survival openings, rules, knowledge beats |
| Warm wood / lantern | `--wood-0` `--wood-1`, `--lamp` glow | Thai houses, folklore interiors |
| Night city / interior | `--sky-0/1`, `--wall-0/1`, `--floor-0/1`, `--moon` | night beats, the turn, the reveal |
| UI paper | `--cream`, `--paper`, `--ink` | cards, stat tiles, checklists, newspapers |

Accents:

| Token | Means | Where |
|---|---|---|
| `--red` | danger / the story turns | full red caption box (2–4 per film), `{คำ}` keyword, rings, rule-card spine, ตอนต่อไป kicker |
| `--gold` | a fact, a number, the smart move | `[คำ]` keyword, `.tag.you` dot |
| `--ok` | done / safe | checklist ticks, `.tag` dot for living cast |

Arc: open bright or warm → drift darker each act → the reveal is the darkest frame → end card on navy.

## Type

- **Display**: Kanit 600/700 — captions, rule text, big numbers.
- **UI**: IBM Plex Sans Thai 500/700 — cards, tags, HUD, labels. Never under 28 px (`check` flags it).
- Caption 74 px (`bold` look) or 56 px on a dark pill (`folk` look). No third face, no outlined or gradient text.

## Frame and safe zones (1080×1920)

- Action and faces live in **y 160–1180**. Captions centred at **y ≈ 1390**.
- Bottom **~380 px** carries no essential content, but the **set continues to the bottom edge** (floor, grass, water). Never leave it flat black.
- Cards: top area (y 170–700) when the scene is behind them, or lower (y 1490–1830) on map scenes.
- HUD clock top-left (70, 90) whenever time matters — in survival stories that is most of the film.

## Shot vocabulary (rotate them: no two consecutive shots of the same type)

| Type | Example | Use for |
|---|---|---|
| Side-view set + cast | `scene-example-room.html` | most story beats |
| Rules / numbers over a set | `scene-example-rules.html` | "กฎข้อ N", stat tile, meter, checklist |
| Close-up object or face | (draw per episode) | ~1 in 4 shots: hand on the tap, dog nose, sweating face, bandage — the clue shots |
| Diagram / cross-section | (draw per episode) | how something works: pipe from pump to floor 23, door open-in vs open-out, crowd per m² from above |
| Top-down map | `scene-example-map.html` | who is where, distance rings, the final sting |
| Evidence card | `scene-example-news.html` | newspaper, calendar, phone alert — the reveal's proof |
| Exterior / establishing | (draw per episode) | hook: skyline going dark, school with flag, stilt house in rain |
| Silhouette crowd / backlit door | (draw per episode with `.sil`) | panic, stairs full of people, someone at the door |
| Next-episode card | `scene-example-next.html` | series ending |

## Information graphics (the reference clips' signature)

- **Something counts on screen at least every ~10 s**: clock, day counter, stat tile, meter, thermometer, calendar.
- Counters tick with the voice (count 90 → 29 while the line is read), meters drain with a `tick` cue.
- Checklists tick one row per beat. Rule cards drop in with a `stamp`.
- Label every named character the first time with a `.tag` (dot + name + one fact: "เจย์ · 28 ปี").
- Diagrams use the paper palette, thick ink lines, one gold or red highlight, labels as `.chip`.

## Camera and motion

- Every shot has motion: slow push (scale 1 → 1.08), a pan, or an entrance. Never a dead frame for a full shot.
- **Depth**: put the far set inside `.far` (soft blur); keep the cast and props sharp; foreground objects may cross the frame edge (`data-layout-allow-overflow`).
- Entrances: slide-up through a mask, back-out pops for chips/rings/ticks, drop-in for cards, count-up for numbers. **Banned**: everything fading in, centred title on a gradient, glow on UI, generic particle bursts, frame borders.
- Hard cuts between shots (on the beat). Camera continuity inside a scene clip.
- Highlight with **dashed red rings** that pop in (back.out), not arrows.
- Ease: `power2/3.out` for moves, `back.out(1.8–2.4)` for pops, `power2.inOut` for camera and counters.
- Folklore look: slower pushes (whole shot), lamp flicker, rain; still cut on beats but hold longer.

## Cast rules

- Characters come from `assets/kit/cast.svg` (`man`, `man-wide`, `man-raise`, `woman`, `elder`). Add new symbols there (students, an animal companion, a creature), same frame convention, colours through CSS variables.
- **Prototype 1 cast** (design canvas https://claude.ai/artifact/TuLAda3PXVngzNaWVrjR1S): `hero` is the **owner's personal** survival lead — opt-in only, used when the user says "ตัวเอกของฉัน" / "my-hero" (see `/twist-cast`), never the default; for other stories treat it as a style reference — skinhead with a straight hairline, olive streak-camo jacket, grey fleece + cream hood, navy striped tee, white-edged pack straps, orange roll and paracord as the single bright accent. Pets: `cat-black`, `cat-orange`, `beagle`, `dog-patch` (new 300×340 frame; the old `dog` stays for the temple dog in flood-canal). Share one look: big round head, dot or round glossy eyes, soft pink cheeks.
- **Relative height**: draw people at ≈ cm × 2.6 px — hero 170 (442 px), raincoat 165, elder 160, woman 158, auntie 150 (shortest). Pets at the same scale: cat 150 px, beagle 205, dog-patch 225. Never stretch every character to one height.
- Give each named character **one trackable trait** (long sleeves, cap, glasses) — it doubles as a clue device.
- The animal companion appears in at least 3 shots and reacts before the humans do.
- The living cast a `.shadow-blob`; a ghost protagonist never does.
- Silhouettes / reflections / crowds = the same symbol with `.sil`.
- Close-up faces: draw the head big (≥ 500 px) with sweat drops or wide eyes; full figures that matter ≥ 600 px tall.
