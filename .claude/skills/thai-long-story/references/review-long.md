# Review, chapter renders, final and packaging (steps 5–8)

A 20 min film has ~400+ shots; one Board frame each is too many to judge one by one. Review **one chapter at a time** on contact sheets, then check timing with a chapter render. Everything here goes through `npm run chapter` (`scripts/chapter.mjs`).

## 1. Chapters → contact sheets

Chapters come from story.json: the first shot of each has `"chapter": "<name>"` (shots before the first marker are chapter 0). `npm run story` warns when a landscape episode has none, or one is over 5 min or under 20 s.

```bash
npm run chapter -- episodes/<slug>
```

lists every chapter (start, length, shot range, frame range) and prints the YouTube chapter lines. For one chapter:

```bash
npm run chapter -- episodes/<slug> 3 --board
```

renders only that chapter's Board frames (one key frame per shot, into `out/<slug>-board/`) and builds `out/<slug>-ch3-sheet-<firstShot>.jpg`, 30 shots per sheet. `--sheet` rebuilds the sheets from Board frames already there (after `npm run check`). Open every sheet and look; use the same sheet at small size for the phone/TV readability check. For a moment Board does not show (a cut, an entrance, a camera move): `npx remotion still src/index.ts <Id> out/x.png --frame=<global frame>` (frame ranges are in the `chapter` listing and in `timeline.json` → `chapters`).

## 2. Score each chapter 1–10

| Criterion | 8+ means |
|---|---|
| Opening (cold open chapter) / chapter start | the question is clear within 10 s of the film; each chapter starts on a new image, not a continuation of the last frame |
| Readability | every subtitle readable on the sheet at 480 px wide; no face or clue under the subtitle band; faces in wides ≥ ~90 px |
| Motion + hands | ≤ 2 hands per figure, none doubled (`hands-poses.md`, a doubled hand caps this at 5); every shot moves (camera or entrance); talk mouths on voiced on-screen lines, on the speaker only (a listener or phone-holder mouthing someone else's line caps this at 5) |
| Variety + pace | no more than 4 same-view / 3 same-setup shots in a row; `npm run shots` clean for the chapter; each angle/device view really looks like its name on the sheet, with foreground / midground / background separated (`thai-twist-short/references/cinematography.md`); a pattern change every 30–60 s; no same-scene run over ~90 s; passes Dead-Air control (no consecutive empty text shots, no dead air > 2.5s) |
| Story clarity + continuity | each clue in this chapter matches the brief table (side, trait, prop); HUD time only moves forward (except flashbacks, which are graded `past`); counts and dates match the continuity list; passes Narrative Clarity (no obscure subtext leap; motives paired with actions) |
| Sound | no `⚠ OVER`; every speaker in their role (a wrong voice caps this at 5); ambience under silent stretches; cues land on the action |
| Retention | the chapter has its planned re-hook(s) and ends on an open question; the tracked device advances visibly where planned |

Fix the three worst problems in the chapter, re-run `check`, rebuild the sheets, score again. Report a small table per chapter to the user.

## 3. Chapter preview render

Only after the user has seen that chapter's frames (CLAUDE.md rule 4). Renders just the frame range, so a fix costs minutes, not the whole film:

```bash
npm run chapter -- episodes/<slug> 3 --render
```

writes `out/<slug>-ch3.mp4` (`remotion render --frames=<from>-<to>` underneath). Watch for voice sync, subtitle timing, cuts that land mid-word, and silence that feels dead. This file is a preview: no loudness pass, not for upload.

## 4. Final

When every chapter scores ≥ 8 and the previews are fine:

```bash
npm run final -- episodes/<slug>
```

Renders the whole film once, normalises to −14 LUFS and runs `qc` (`renders/<slug>-qc.md`). A failed QC line is fixed in story.json / audio and the final is run again.

## 5. Packaging

- **Cover**: a `Still` in `src/episodes/<slug>/cover.tsx` registered in `src/Root.tsx` (temple-boy has `TempleBoyCover`, `CoverMonkA–C`); render 2–3 variants with `npx remotion still src/index.ts <StillId> episodes/<slug>/renders/<slug>-cover-A.jpg` and let the user pick. Big face or the key object, ≤ 4 words of text, readable at 320 px wide.
- **Title**: 3 options in `renders/<slug>-description.md` — the question or the strangest number first, genre tag after `|`.
- **Description**: 2–3 lines of hook (no spoiler), a comment prompt, the fiction note, hashtags, and **YouTube chapters** — paste the lines `npm run chapter -- episodes/<slug>` prints (they start at 0:00; YouTube needs ≥ 3 chapters of ≥ 10 s). Chapter names are viewer-facing: no spoilers in them.
- Publishing or uploading is outward-facing: ask first (CLAUDE.md rule 8).
