# Review, final and packaging (steps 5–8)

**CLAUDE.md rule 5: one pass, no scores.** A 20 min film has ~400 shots; scoring chapter after chapter on 30-frame sheets costs a lot and misses the one odd shot.

## 1. The review

1. `npm run review -- episodes/<slug> --board` (renders only changed shots' Board frames; `--all` forces all, needed after a change in `src/kit/` or `src/cast/`) prints the suspect list (look ✗, shots ✗, story ⚠ per shot) and writes `out/<slug>-review.html`.
2. Open only suspect and changed frames at full size. Fix each once, or answer it in one line that names what can be seen in the frame.
3. The user scrolls the page once (filters: all / audit-flagged / new), ticks odd shots and pastes the list; fix only those, once.
4. `npm run review -- episodes/<slug> --accept`. Timing is checked by the single final render (§3).

What to check on a frame you have open: `thai-twist-short/references/review.md` → *What to check*, plus for long-form:

| Look for | Right means |
|---|---|
| Chapter start | each chapter opens on a new image, not a continuation of the last frame; the cold open makes its question clear within 10 s |
| Subtitles | readable at 480 px wide; no face or clue under the subtitle band; faces in wides ≥ ~90 px |
| Continuity | each clue matches the brief table (side, trait, prop); HUD time only moves forward except in `past`; counts and dates match the continuity list |
| Concealment | no line or ring before the slip points at the culprit's details (`longform-rules.md` → *Concealment*); decoys get the same camera weight |
| Pace | a pattern change every 30–60 s; no same-scene run over ~90 s; no two silent shots in a row |
| Retention | the chapter has its planned re-hook and ends on an open question; the tracked device advances where planned |

## 2. One chapter, when asked

Only when the user asks to inspect a chapter or one is in doubt. Chapters come from story.json: the first shot of each has `"chapter": "<name>"` (shots before the first marker are chapter 0). `npm run story` warns when a landscape episode has none, or one is over 5 min or under 20 s.

```bash
npm run chapter -- episodes/<slug>
```

lists every chapter (start, length, shot range, frame range) and prints the YouTube chapter lines.

```bash
npm run chapter -- episodes/<slug> 3 --board
```

renders that chapter's Board frames and a sheet `out/<slug>-ch3-sheet-<firstShot>.jpg` (`--sheet` rebuilds sheets from frames already there). A sheet is for spotting a row that looks like one picture; judge a shot at full size. For a moment Board does not show (a cut, an entrance, a camera move): `npx remotion still src/index.ts <Id> out/x.png --frame=<global frame>`, or `npm run motion` for shots that declare `data.motion`.

```bash
npm run chapter -- episodes/<slug> 3 --render
```

writes a preview `out/<slug>-ch3.mp4` of just that frame range, only after the user has seen that chapter's frames (CLAUDE.md rule 4). Watch voice sync, subtitle timing, cuts mid-word, dead silence. No loudness pass; not for upload.

## 3. Final

After `--accept`:

```bash
npm run final -- episodes/<slug>
```

Renders the whole film once, normalises to −14 LUFS and runs `qc` (`renders/<slug>-qc.md`). A failed QC line is fixed in story.json / audio and the final is run again.

## 4. Packaging

- **Cover**: export `COVERS` (`[{id, component}]`) from `src/episodes/<slug>/cover.tsx`; `src/Root.tsx` finds it by itself, so archiving an episode leaves Root alone (`father-ledger` has `FatherLedgerCoverA–C`, each a real set and cast with `<CastSprite />` mounted); render 2–3 variants with `npx remotion still src/index.ts <StillId> episodes/<slug>/renders/<slug>-cover-A.jpg` and let the user pick. Big face or the key object, ≤ 4 words of text, readable at 320 px wide. The cover uses only what the cold open shows (`longform-rules.md` → *Concealment* rule 8).
- **Title**: 3 options in `renders/<slug>-description.md` — the question or the strangest number first, genre tag after `|`.
- **Description**: 2–3 lines of hook (no spoiler), a comment prompt, the fiction note, hashtags, and **YouTube chapters** — paste the lines `npm run chapter -- episodes/<slug>` prints (they start at 0:00; YouTube needs ≥ 3 chapters of ≥ 10 s). Chapter names are viewer-facing: no spoilers in them.
- Publishing or uploading is outward-facing: ask first (CLAUDE.md rule 8).
