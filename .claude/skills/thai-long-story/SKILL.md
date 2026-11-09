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
| 4 | Roster + places + inserts, then the shots — every camera shot first gets a `note` (the picture in one sentence), each recurring place is built once in perspective (`src/kit/room.tsx`) and framed from several positions (a canon place from `universe/canon.json` starts from its `set`, matches its `state`, and moves into `src/kit/` on its second story; after the review, write the `cams` that worked and the new `state` of every `keep` place back to canon — CLAUDE.md rule 17), light from a source in the frame that pools (`thai-twist-short/references/directing.md`, `depth-light.md`); any shot may be its own component | edit `src/episodes/<slug>/`, then `npm run shots` and `npm run check` (each `-- episodes/<slug>`) | tsc 0 errors; placeholders only where not drawn yet; each Board frame matches its `note` and passes `directing.md` §7; `shots` / `look` ✗ lines fixed or answered in one line |
| 5 | **One-pass review** (CLAUDE.md rule 5; no per-chapter scoring) | `npm run review -- episodes/<slug> --board` → suspect list + `out/<slug>-review.html` (`references/review-long.md`) | audit ✗ fixed or answered; suspect/changed frames looked at full size; the user scrolls the page once, flags odd shots, they are fixed once; `--accept` |
| 6 | Timing check = the single final render; a chapter preview only if the user asks or a chapter is in doubt | `npm run chapter -- episodes/<slug> <n> --render` (optional) | the user has seen the frames first (CLAUDE.md rule 4) |
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
| Bright sets, dark turn | Light tells the hour: a grade per time of night, one source per view, shadow share rising with the dread (night ≥ 45 %, suspense ≥ 60 %), the reveal the darkest frame (`depth-light.md`) |
| Look at every Board frame | Review **per chapter** on contact sheets, then chapter renders (`npm run chapter`) |

## Engine pieces built for long-form

| File | Gives you |
|---|---|
| `src/kit/stage.tsx` | `Stage` (camera from `data.cam`, light `Grade`, flashback `data.past`, grain, HUD `data.hud`), `Plate` (close-up), `Actors` (needs your roster + `makeSpeaking(timeline)`), **actor strings** in `data.cast` (`"non@900 sit worried talk arm=r-hold prop=flashlight"`), `at` |
| `src/kit/world.tsx` | 1920×1080 world with `FLOOR` 930: `Sky`, `Planks`, `Boards`, `Glow`, `Beam` + `beamAt` (flashlight), `WallClock`, `full`, `WOOD` tones |
| `src/kit/temple.tsx` | Older flat temple backdrops, kept for the episodes that use them and out of the studio: for a new temple build the place in perspective with `room.tsx` |
| `src/kit/places.tsx` | everyday Thai locations, each with `tone` day / dusk / night (lamps, lit windows and signs stay bright): `ShopRow` (ตึกแถว, signs + shutters per shop), `StiltHouse` (บ้านใต้ถุนสูง, `far` = whole roof), `Canal` (คลอง + ท่าน้ำ + เรือ), `SpiritHouse` (ศาลพระภูมิ), `Minimart` (ร้านสะดวกซื้อ, `dark`), `HospitalHall` (`flick` / `off` / `bed`), `Classroom` (`board` chalk text), `DormHall` (หอพัก), `RiceField` (คันนา, `ripe`), `BusStop` (ศาลารอรถ, `poster`); `Toned` darkens any set you draw yourself the same way |
| `src/kit/depth.tsx` | anti-flat pieces (`thai-twist-short/references/depth-light.md`): `PerspFloor` (floor seams to a vanishing point, over any set's floor), `SideWall` (receding wall, `opening` doorway), `CastShadow` (long shadow away from one light — `Actors` draws it for everyone from `data.lightAt`), `Haze` (atmosphere band); with `Grade light="noir"` + `data.focus` in `stage.tsx`, `Far dim` and `Vignette at` in `fx.tsx` |
| `src/kit/pov.tsx` | camera devices: `Pov` (peephole, keyhole, door crack, binoculars, blinds, phone camera), `Split` screen, `Cctv` footage, `MirrorFrame`; with `data.tilt` (Dutch) and `Stage fore` (foreground parallax) in `stage.tsx` — `thai-twist-short/references/cinematography.md` |
| `src/kit/props.tsx` | ของประกอบฉากที่ใช้ซ้ำ ขนาดจริง: `OfficeChair` (coat), `IvStand`; ขนาดมาตรฐานของของทุกชนิดใน `directing.md` §3.1 และเช็กลิสต์ปัญหาที่เจอซ้ำใน §9 — ไล่ §9 ก่อนส่ง Board frame ให้คนดู |
| `src/kit/inserts.tsx` | close-up `Hand` (grip/open/flat, cut pinky, wrist thread), `RainStreaks`, `Drips`, notebook `Page` + `Ink`, `RuleCardScene` (`data {no, text}`) |
| `src/kit/horror.tsx` | grain, flicker, light mask, night grade, ripples, rooms, beds, bulbs |

See them all with their code: `npm run gallery -- --only=GPlaces,GParts,GInserts,GCamera,GGrades`, serve the repo root, open `/studio/index.html#places`. Add a new kit piece to `src/gallery.json` and `src/GalleryPlaces.tsx` (a place: `good`, `cams`, `bad`, `uses`).

An episode keeps only its own pieces: roster and palette (`cast.tsx`), story rooms holding clue props, and its scene switch. Start a new episode by setting up `cast.tsx` with character symbols selected from `src/cast.json` (the Single Source of Truth for cast, e.g. `lead-male-A/B`, `lead-female-A/B`, `father-A/B`, `sister-A/B`, `police-A/B`, never legacy retired characters like `man`/`woman`). When a story room from one episode is needed by a second, move it into `src/kit/` (CLAUDE.md rule 6).

story.json knobs: `chapter`, `voiceTempo`, `breath`, `switchBreath`, `minBeats`, `fitStep`, `who`, `hold`, `hush`, `fx`, custom `sfx` (`thai-twist-short/references/story-json.md` → *Long-form landscape*).

## References

| File | Read it when |
|---|---|
| `references/longform-rules.md` | outlining, writing story.json, pacing, captions, cast, sound, safe zones — and the gate checklist |
| `references/brief-template.md` | step 1, starting `episodes/<slug>/brief.md` |
| `references/review-long.md` | steps 5–8: contact sheets, scoring, chapter renders, final, packaging |
| `thai-twist-short/references/directing.md` | **steps 2 and 4, first**: how to direct a shot (`note` → size/angle → light → build), places as rooms the camera enters (`src/kit/room.tsx`), light pools and `LightVeil`, real close-up sizes, staging around front-facing sprites, what is fixed vs free, the storyboard check |
| `thai-twist-short/references/cinematography.md` | steps 2 and 4: camera setups per scene, set coverage presets, angle triggers, layering, variety quotas (`npm run shots -- episodes/<slug>` audits per chapter) |
| `thai-twist-short/references/depth-light.md` | steps 4 and 5: no flat frames — subject on a third, 4 layers, one light + shadow share per mood, perspective, long shadows, the `noir` grade (`npm run look -- episodes/<slug> --chapter <n>` measures each chapter's Board frames) |
| `thai-twist-short/references/*` | the shared parts: story-json fields, scene kit, cast library, hands, voices, audio |

## ช็อตที่ต้องมีการเคลื่อนไหว: ประกาศใน story.json

ช็อตที่มีคนเดิน วิ่ง กล้องแพน หรือเอฟเฟกต์ที่ต้องเห็นว่าขยับ (ควันลอย ไฟกะพริบ น้ำไหล) ต้องใส่ `"data": {"motion": "walk" | "pan" | "push" | "fx"}` ตั้งแต่เขียนบท (คนเดินใช้ `data.move: [x0, x1]` ด้วย) แล้วตรวจด้วย `npm run motion -- episodes/<slug>` (ไม่ใส่เลขช็อต = ตรวจทุกช็อตที่ประกาศ) ได้ภาพ 4 ช่วงต่อช็อตในหน้าเดียวและคำเตือนเมื่อประกาศแล้วภาพไม่ขยับจริง ส่วนช็อตทั่วไปที่กล้องขยับน้อยเกินไป `npm run shots` เตือนเองโดยไม่ต้องเรนเดอร์ (push ต่ำกว่า 6% ตลอด ≥ 3 วินาทีในครึ่งหนึ่งของช็อต)
