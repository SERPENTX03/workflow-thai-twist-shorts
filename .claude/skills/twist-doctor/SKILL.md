---
name: twist-doctor
description: Check a Thai twist-shorts story.json against the project's story, caption and pacing rules before any scene is drawn — hook, knowledge layer, clue fairness, red-box count, keyword marks, shot-type variety, length, voice fit and series ending — and list concrete fixes. Use when the user says ตรวจเรื่อง, เช็กสคริปต์, story นี้โอเคไหม, ก่อนวาดฉาก, หรือ /twist-doctor.
argument-hint: "[episodes/<slug>]"
---

# ตรวจเรื่อง (ก่อนวาดฉาก)

Read `episodes/<slug>/story.json`, `references/story-rules.md`, `art-direction.md` (shot vocabulary) and `story-json.md`. Run `npm run story -- episodes/<slug>` for the length and the script warnings (offline, no credits); read `timeline.json` / `assets/vo/index.json` if voice exists.

A landscape (`"format": "landscape"`) story is checked against `thai-long-story` → `references/longform-rules.md` instead: use its *Long-form checklist* in place of checks 1–10 below, keep 11–14.

## Checks (pass / fix)

| # | Check | Rule |
|---|---|---|
| 1 | Hook | shot 0 has place + threat or a number; ≤ 2 lines |
| 2 | Length | fits the family: survival 60–110 s, haunting 45–90 s, ตำนาน 90–130 s |
| 3 | Captions | ≤ 2 lines, ≤ ~18 characters per line; one idea per shot |
| 4 | Red boxes | `style: "red"` on 2–4 turn lines only |
| 5 | Keyword marks | about 1 in 2 lines has one `[gold]` or `{red}`; never more than one mark per line |
| 6 | Knowledge | survival/ตำนาน: a fact or rule every 3–5 shots; each names the visual that shows it |
| 7 | Clues | 3–5 clues, each planted in 3+ shots before the turn, none named early |
| 8 | Variety | plan a shot type per shot (set / close-up / diagram / map / card / exterior / silhouette); no two in a row the same; ≥ 4 types; ≥ 1 close-up and 1 diagram; every `view` names its camera setup and `npm run shots` is clean (`thai-twist-short/references/cinematography.md`) |
| 9 | Palette arc | not one palette for the whole film; darkest frame at the reveal |
| 10 | Twist line | ≤ 20 characters, 4 beats, `bighit`, `voLead` ≈ 0.5 |
| 11 | Voice fit + casting | no `⚠ OVER` in the last voice run; long lines get more beats; `voices` map equals `references/voices.md`; every quoted line of a character carries that character's role (elders → `old_*`), narration carries none, no raw ids |
| 12 | Ending | series → cliffhanger + `next` card, `series.next` set; stand-alone → sting on the iconic image |
| 13 | Continuity | (series) names, traits, counters and rules match the bible |
| 14 | Universe | (CLAUDE.md rule 17, `universe/canon.json`) the episode has a link level; nothing contradicts hard canon (a dead canon character, a place's `state`, the order of events); a canon character keeps name, face, traits and voice role; no other character wears a canon face; the story makes sense watched alone and answers no other episode's mystery |

## Report

A table of the 14 checks (✓ / ✗ + one line), then the **three most important fixes** written as exact `story.json` edits (shot index, old → new). Apply them only after the user says yes, then `npm run audio -- episodes/<slug>`.
