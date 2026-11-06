---
name: thai-twist-short
description: Make a Thai vertical (9:16) twist-ending short story video in this repo with Remotion (TSX) — faceless, flat 2D illustration, survival "ถ้า…" scenarios, haunting twists or Thai folklore, bold Thai captions with keyword highlights, rule cards, counters and diagrams, Thai TTS voiceover and a synthesized score, often as a series with a ตอนต่อไป card. Use for any request to write, storyboard, build, voice, score, review or render an episode in episodes/, or to start a new one from a story idea.
---

# Thai Twist Short — workflow

This repo turns a short story idea into a 45–130 s vertical video. **`story.json` is the single source of truth**: every shot, caption, voice line, beat length and sound cue lives there. Scripts generate the timeline, voice and score from it; the engine draws captions. You hand-make only the **scenes** (`src/episodes/<slug>/scenes.tsx`, or use the generic ones in `src/scenes/`).

Scenes are React components (`references/scene-kit.md`); the shared cast, props and UI live in `src/`. This skill owns the format and the process.

**You are the director and art director.** Every shot is a picture you design: what it shows, from where, in what light, and you are free to write any shot as its own SVG/React component, build new sets and move the camera anywhere. The kit and the studio gallery are a parts bin and a scale ruler, never a template to copy. How to think a shot through, and why our older frames looked like one flat backdrop: `references/directing.md` — read it before the shot list and before drawing.

**Long-form landscape episodes** (`"format": "landscape"`, 10–25 min) use the `thai-long-story` skill for story rules, pacing, review and render; the shared references here (story-json, scene-kit, cast, hands, voices, audio) still apply.

## Pipeline

```
idea ─► 1 story ─► 2 story.json ─► 3 animatic ─► 4 scenes ─► 5 audio ─► 6 review loop ─► 7 render
           (references/story-rules.md)        (check)   (scene-kit)  (voice+score)  (review.md)  (final)
```

| Step | Do | Command | Gate (do not continue until) |
|---|---|---|---|
| 0 | New episode folder | `npm run new -- <slug> "ชื่อเรื่อง"` | `episodes/<slug>/story.json` exists |
| 1 | Write the story beats | — | passes every check in `references/story-rules.md` → *Twist checklist*; show the user the logline + twist + clue list and get a yes |
| 2 | Write `story.json` with a picture per shot | `npm run shots -- episodes/<slug>` | schema in `references/story-json.md`; each caption ≤ 2 lines, ≤ ~18 Thai characters per line; cast voices from `references/voices.md` (list each speaker, gender, age, role first); **every camera shot has a `note`: the picture in one sentence — who does what with what, seen from where, lit by what** (`directing.md` §1–2); every cut changes size or angle; `view` names what the picture is (`cinematography.md` vocabulary) |
| 3 | Animatic | `npm run check -- episodes/<slug>` | typechecks, lints the story, renders Board frames; every missing scene shows as a placeholder; length fits the format family (`story-rules.md`) |
| 4 | Storyboard: draw each shot right at its key frame, then animate — places built once in perspective (`src/kit/room.tsx`) and framed many ways, light from things you can see (`directing.md` §3–4, `depth-light.md`) | edit `src/episodes/<slug>/scenes.tsx` (any number of components; one per shot is fine), then `npm run check` (ends with the look audit) | tsc = 0 errors; every Board frame passes the storyboard check in `directing.md` §7 (it matches its `note`, reads in one second at phone size, light from a source, sizes change); each `shots` / `look` ✗ on a changed shot is fixed or answered in one line |
| 5 | Voice + score | `npm run audio -- episodes/<slug>` | no `⚠ OVER` lines from voice; score says *ducked under voice*; then do the `voices.md` listening check per speaking character |
| 6 | Review loop | `npm run check -- episodes/<slug>` → look at `out/<slug>-board/` | every score in `references/review.md` ≥ 8 |
| 7 | Render + loudness | `npm run final -- episodes/<slug>` | `renders/<slug>-final.mp4`, −14 LUFS ±0.5 |

Rules for the loop:
- **Edit `story.json`, never the generated files** (`timeline.json`, `assets/voice.wav`, `assets/score.wav`, `src/episodes/index.ts`). After any change to text, beats, or cues: `npm run audio -- episodes/<slug>` (re-voices, re-scores, rewrites `timeline.json`).
- After drawing or changing a scene: `npm run check -- episodes/<slug>`, then **look at the Board frames** in `out/<slug>-board/` (or `npx remotion still src/index.ts <Id> out/x.png --frame=<n>` for another moment) before saying it works. A passing check does not show how it looks. The look audit printed at the end of `check` measures shadow share, light direction and contrast per frame: read its ✗ lines next to the frames, not instead of them.
- Each shot's scene gets its own local frame `f` (0 … `len`); animate against it. Shot start times are in `timeline.json`.
- Render only after the review loop passes and the user has seen the frames (`npm run studio` opens Remotion Studio on :3430 for scrubbing).

## The format in one screen

- **9:16, 1080×1920, 30 fps, 75 BPM grid** (1 beat = 0.8 s). Shots are 3 beats (2.4 s); key lines get 4 (3.2 s).
- **Three format families** (`references/story-rules.md`): survival "ถ้า…" (default, 60–110 s), haunting twist (45–90 s), ตำนานไทย (90–130 s, slow, `captionLook: "folk"`).
- **Twist + knowledge.** A real fact, rule or number on screen every 3–5 shots, shown as a card, counter, meter or diagram. Something counts at least every ~10 s.
- **Named cast + one animal**, labelled with `.tag` the first time. "คุณ" or a named lead.
- **Something new every 2–4 s**, and no two consecutive shots of the same type (set, close-up, diagram, map, card…). Bright sets are normal; darkness is saved for the turn.
- **Designed pictures, not a backdrop** (`references/directing.md`): each place is built once in perspective and the camera goes inside it — wide to learn the room, then medium, real close-ups (the head about half the frame), inserts of hands and objects, low and high angles. Light comes from something in the frame and pools; mid-tones sink; the face is the brightest thing near it. Bright is allowed; flat is not (`depth-light.md`).
- **Captions mostly white**; colour one keyword with `[gold]` or `{red}`; full red boxes only on the 2–4 lines that turn the story.
- **Clues are visual and honest**: on screen 3+ times before the twist is said.
- **Hook in the first 2 s**: a place + a threat or a number, on screen at frame 0.
- **Series ending**: cliffhanger line → ตอนต่อไป card (generic `next` scene), `series` set in `story.json`.

## Commands (project skills)

| Say | Skill | Does |
|---|---|---|
| ช่วยคิดไอเดีย | `/twist-idea` | 5 ideas scored against the reference patterns → pick one → logline, twist, clues, facts |
| ช่วยคิดตอนต่อไป | `/twist-next` | reads an episode + its series bible → next episode outline that answers the cliffhanger |
| ช่วยคิดฮุก / ชื่อเรื่อง | `/twist-hook` | hook lines, titles and cover text for an episode |
| วางซีรีส์ | `/twist-series` | series bible: cast, animal, world rules, 5-episode arc |
| วิเคราะห์ ref | `/twist-ref` | analyse a reference clip with ffmpeg and log new patterns to `references/ref-library.md` |
| ตรวจเรื่อง | `/twist-doctor` | score a story.json against the rules before any scene is drawn |

The commands stop at an approved outline or a report; building still follows the pipeline above.

## References

| File | Read it when |
|---|---|
| `references/ref-library.md` | what the high-view reference clips do — the evidence behind every rule |
| `references/story-rules.md` | writing or judging the story — format families, structure, knowledge layer, cast, twist types, clue planting, Thai caption voice |
| `references/story-json.md` | writing `story.json` — every field, cue types, timing math |
| `references/directing.md` | **first, before the shot list and before drawing** — how a director thinks a shot (note → size/angle → light → build), places as rooms the camera enters (`src/kit/room.tsx`), light pools and `LightVeil`, staging, what is fixed vs free, the storyboard check, why the old frames looked flat |
| `references/art-direction.md` | choosing palette, type, framing, camera, the cast, what is banned |
| `references/cinematography.md` | the camera vocabulary to draw on — setup names for `view`, 18 signature setups, scene archetypes (phone call, clue, villain, travel, flashback…), when to switch angle, FG/MG/BG layering, variety guides; audit with `npm run shots -- episodes/<slug>` |
| `references/depth-light.md` | drawing or reviewing any set shot — layers (FG / MG / BG / ATMO), one light + how dark per mood, perspective (room kit, `PerspFloor`, `SideWall`), long shadows (`CastShadow`, `data.lightAt`), `LightVeil`, `noir` grade; audit with `npm run look -- episodes/<slug>` |
| `references/scene-kit.md` | building a scene file — Remotion scene components, `Sprite`, kit UI, generic scenes, rules |
| `references/cast-library.md` | before drawing any person, pose, face, prop, icon or set piece — the reusable library in cast.svg (`npm run gallery` shows it) |
| `references/hands-poses.md` | drawing any hand, gesture, hand-over or held object — one-hand rule, pose library, grip props |
| `references/audio.md` | voice, score, SFX cues, ducking, loudness |
| `references/review.md` | the contact-sheet scoring loop and the fix list |

## Tools this workflow needs

Node ≥ 22, ffmpeg/ffprobe on PATH, an `ELEVENLABS_API_KEY` in `.env` for the default ElevenLabs voices (or Python 3 with `pip install edge-tts` for the free Microsoft voices); internet is required and the caption text is sent to the voice service, Remotion brings its own Chromium on first render (pinned in the root `package.json`).
