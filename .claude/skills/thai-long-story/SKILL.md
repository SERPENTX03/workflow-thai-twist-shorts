---
name: thai-long-story
description: Make a Thai long-form landscape (16:9, 10–25 min) narrated story video in this repo with Remotion — horror, grief, mystery or Thai folklore told by a narrator plus voiced characters, flat 2D sets on a camera stage, subtitles, ElevenLabs voices and a synthesized score. Use for any request about a landscape / long episode (คลิปยาว, เรื่องยาว, 16:9, 10 นาที, 20 นาที, YouTube ยาว) — outline, brief, story.json, scenes, voice, review, chapter renders, final render, cover and description.
---

# Thai Long Story — workflow

Same engine, cast and scripts as `thai-twist-short`; this skill replaces only the **story rules, pacing, review and render steps** that do not scale from a 60 s Short to a 20 min film. Read `thai-twist-short/SKILL.md` once for the shared pipeline; where they disagree for a landscape episode, this file wins (and `CLAUDE.md` wins over both).

Reference build: `episodes/temple-boy` (20:30, 442 shots, 25 scenes / 115 views, 6 voice roles, QC 10/10). Copy its patterns before inventing new ones: `src/episodes/temple-boy/{cast,sets,inserts,scenes}.tsx`.

## Pipeline

| Step | Do | Command | Gate |
|---|---|---|---|
| 0 | New episode, then set `"format": "landscape"` and `target` in story.json | `npm run new -- <slug> "ชื่อเรื่อง"` | story.json exists |
| 1 | **Brief + outline** — copy `references/brief-template.md` to `episodes/<slug>/brief.md`: logline, twist, speakers, chapter plan with timestamps, clue table, continuity facts | — | passes the *Long-form checklist* in `references/longform-rules.md`; user says yes to the brief |
| 2 | Write story.json **one chapter at a time**: the chapter's first shot carries `"chapter": "<name>"`; draft beats roughly, `fit` sizes them later | `npm run story -- episodes/<slug>` after each chapter; `npm run chapter -- episodes/<slug>` lists them | 0 errors; caption + chapter warnings fixed |
| 3 | Voice draft (cached per line; only new/changed lines cost credits) → fit → audio | `npm run voice`, `npm run fit`, `npm run audio` (each `-- episodes/<slug>`) | no `⚠ OVER`; runtime inside `target`; listen to one line per speaker (`thai-twist-short/references/voices.md`) |
| 4 | Roster + sets + inserts, then scenes switching on `view` | edit `src/episodes/<slug>/`, then `npm run check -- episodes/<slug>` | tsc 0 errors; placeholders only where not drawn yet |
| 5 | **Chapter review loop** | `npm run chapter -- episodes/<slug> <n> --board` → `out/<slug>-ch<n>-sheet-*.jpg` (`references/review-long.md`) | every criterion ≥ 8 for that chapter |
| 6 | Chapter preview render (timing, voice sync, captions over time) | `npm run chapter -- episodes/<slug> <n> --render` | the user has seen the chapter frames first (CLAUDE.md rule 4) |
| 7 | Final render + loudness + QC | `npm run final -- episodes/<slug>` | `renders/<slug>-final.mp4`, QC all ✓ |
| 8 | Packaging: cover stills, title, description with YouTube chapters (`npm run chapter` prints them) | `references/review-long.md` → *Packaging* | user picks a title and cover |

## What changes from Shorts

| Shorts rule | Long-form rule (details: `references/longform-rules.md`) |
|---|---|
| Hook at frame 0 | **Cold open** 30–60 s with the strongest image + the central question, then a title card |
| Something new every 2–4 s | Average shot 2.5–4 s (temple-boy 2.8 s); a **pattern change every 30–60 s** (new set, insert, flashback, light change) |
| One twist | **Act structure**: midpoint reframe, a mini-reveal every 2–3 min, final reveal at ~85–90 % |
| ≤ 3 named humans | Up to ~6 speakers, each one voice role and one trackable trait |
| 2–4 red boxes | 3–5 red boxes in the whole film, only on turn lines |
| Fact every 3–5 shots | One **tracked device** across the film (10 rules, a count of years, a calendar), shown with progress |
| Cut on beats, fixed 3-beat shots | `fit` sizes shots to the real voice; `hold` for looking, `hush` for silence |
| 7 shot types rotating | Recurring sets drawn once with many `view`s; inserts for every clue |
| Look at every Board frame | Review **per chapter** on contact sheets, then chapter renders (`npm run chapter`) |

## Engine pieces built for long-form

| File | Gives you |
|---|---|
| `src/kit/stage.tsx` | `Stage` (camera from `data.cam`, light `Grade`, flashback `data.past`, grain, HUD `data.hud`), `Plate` (close-up), `Actors` (needs your roster + `makeSpeaking(timeline)`), **actor strings** in `data.cast` (`"non@900 sit worried talk arm=r-hold prop=flashlight"`), `at` |
| `src/kit/world.tsx` | 1920×1080 world with `FLOOR` 930: `Sky`, `Planks`, `Boards`, `Glow`, `Beam` + `beamAt` (flashlight), `WallClock`, `full`, `WOOD` tones |
| `src/kit/temple.tsx` | Thai temple backdrops: `Gate` (sign text as a prop), `Road`, `Sala`, `Path` (ตะเคียน tree), `BenchSet`, `TowerShape` (bell tower), `WellSet`, `Corridor`, `Porch` |
| `src/kit/places.tsx` | everyday Thai locations, each with `tone` day / dusk / night (lamps, lit windows and signs stay bright): `ShopRow` (ตึกแถว, signs + shutters per shop), `StiltHouse` (บ้านใต้ถุนสูง, `far` = whole roof), `Canal` (คลอง + ท่าน้ำ + เรือ), `SpiritHouse` (ศาลพระภูมิ), `Minimart` (ร้านสะดวกซื้อ, `dark`), `HospitalHall` (`flick` / `off` / `bed`), `Classroom` (`board` chalk text), `DormHall` (หอพัก), `RiceField` (คันนา, `ripe`), `BusStop` (ศาลารอรถ, `poster`); `Toned` darkens any set you draw yourself the same way |
| `src/kit/inserts.tsx` | close-up `Hand` (grip/open/flat, cut pinky, wrist thread), `RainStreaks`, `Drips`, notebook `Page` + `Ink`, `RuleCardScene` (`data {no, text}`) |
| `src/kit/horror.tsx` | grain, flicker, light mask, night grade, ripples, rooms, beds, bulbs |

See them all with their code: `npm run gallery -- --only=GWorld,GPlaces,GInserts,GGrades`, serve the repo root, open `/studio/index.html#stage` (also lists each episode's chapters). Add any new kit piece to `src/gallery.json` and `src/Gallery.tsx`.

An episode keeps only its own pieces: roster and palette (`cast.tsx`), story rooms holding clue props, and its scene switch. Start a new episode by setting up `cast.tsx` with character symbols selected from `src/cast.json` (the Single Source of Truth for cast, e.g. `lead-male-A/B`, `lead-female-A/B`, `father-A/B`, `sister-A/B`, `police-A/B`, never legacy retired characters like `man`/`woman`). When a story room from one episode is needed by a second, move it into `src/kit/` (CLAUDE.md rule 6).

story.json knobs: `chapter`, `voiceTempo`, `breath`, `switchBreath`, `minBeats`, `fitStep`, `who`, `hold`, `hush`, `fx`, custom `sfx` (`thai-twist-short/references/story-json.md` → *Long-form landscape*).

## References

| File | Read it when |
|---|---|
| `references/longform-rules.md` | outlining, writing story.json, pacing, captions, cast, sound, safe zones — and the gate checklist |
| `references/brief-template.md` | step 1, starting `episodes/<slug>/brief.md` |
| `references/review-long.md` | steps 5–8: contact sheets, scoring, chapter renders, final, packaging |
| `thai-twist-short/references/*` | the shared parts: story-json fields, scene kit, cast library, hands, voices, audio |
