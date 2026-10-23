# Review loop (step 6)

Run `npm run check -- episodes/<slug>`. It runs `hyperframes check` and writes the review set to `episodes/<slug>/.hyperframes/review/`:
- `review-beats-N.jpg` — every scene start + middle and every beat,
- `review-phone-N.jpg` — the same frames at phone width,
- `review-seam-NN.jpg` — 5 frames around each cut.

**Open and look at the sheets.** Then score 1–10:

| Criterion | 8+ means |
|---|---|
| Hook (first 2 s) | the anomaly + a specific number/rule/time is readable at frame 0; something moves within 0.5 s |
| Readability at phone size | every caption readable in `review-phone.jpg`; nothing important under the caption band or in the bottom 380 px; faces ≥ ~120 px |
| Motion quality | no dead shot; camera moves eased; pops land on beats; nothing jitters across seams |
| Variety | no two consecutive shots look the same; at least 3 scene types used; a new visual event every 2–4 s |
| Story clarity | each clue is visible on screen before the reveal; the reveal frame shows its proof (photo, date, hollow dot) |

Frames that fall exactly on a cut show the next caption mid-entrance (not yet visible) — that is expected, not a bug.
| Sound sync | `hit`/`bighit` on cuts; voice never crosses a cut (no `⚠ OVER`); drone dip before the reveal |

Fix the **three worst** problems, rebuild, and score again. Repeat until all six are ≥ 8. Then show the user the preview (`npx hyperframes preview --background` in the episode) before the final render.

Report the scores to the user in a short table with one line on what was fixed in each round.

## Common fixes

- Caption covers a face → move the actor up (scenes' action zone is y 160–1180) or push the camera.
- Dead shot → add a slow push (`scale` 1 → 1.08) and one entrance (ring/chip/card) at local +0.4 s.
- Clue missed → hold it longer, ring it in red on its own shot, or put it on the map.
- Reveal flat → make it a 4-beat shot, `bighit` on beat 0, `voLead` 0.5, red caption, and a blur-to-sharp or flip on the proof.
