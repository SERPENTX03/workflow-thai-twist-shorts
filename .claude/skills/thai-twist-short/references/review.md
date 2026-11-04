# Review loop (step 6)

Run `npm run check -- episodes/<slug>`. It runs tsc + story-check and writes one Board frame per shot (the key frame at 60 % of the shot) to `out/<slug>-board/element-N.jpeg`.

- **Phone size**: look at the frames scaled down to ~360 px wide (read them at small scale), not only at full size.
- **Seams and motion**: Board shows one moment per shot. For a cut or an entrance, take stills either side of it: `npx remotion still src/index.ts <Id> out/x.png --frame=<global frame>` (shot start = `timeline.json` `start` × 30).

**Open and look at the frames.** Then score 1–10:

| Criterion | 8+ means |
|---|---|
| Hook (first 2 s) | the anomaly + a specific number/rule/time is readable at frame 0; something moves within 0.5 s |
| Readability at phone size | every caption readable with the frame at phone width; nothing important under the caption band or in the bottom 380 px; faces ≥ ~120 px |
| Motion quality | **hands: ≤ 2 per figure, none doubled on one side, held objects under a hand (`hands-poses.md`)** — any doubled hand caps this at 5; no dead shot; camera moves eased; pops land on beats; nothing jitters across seams |
| Variety | no two consecutive shots of the same type (see art-direction → shot vocabulary); at least 4 types used; not one palette for the whole film; a new visual event every 2–4 s |
| Story clarity | each clue is visible on screen 3+ times before the reveal; the reveal frame shows its proof (photo, date, bandage, hollow dot) |
| Sound sync | `hit`/`bighit` on cuts; voice never crosses a cut (no `⚠ OVER`); drone dip before the reveal; every speaker matches the cast in `voices.md` (gender, age, one role each) when listened to — any wrong voice caps this score at 5 |
| Value + pull | a fact, rule or number on screen every 3–5 shots (survival/folklore); something counts at least every ~10 s; at least one close-up and one diagram; the ending opens the next episode (cliffhanger + ตอนต่อไป card) when it is a series |

Frames that fall exactly on a cut show the next caption mid-entrance (not yet visible) — that is expected, not a bug.

Fix the **three worst** problems, rebuild, and score again. Repeat until all seven are ≥ 8. Then show the user the preview (`npm run studio`) before the final render.

Report the scores to the user in a short table with one line on what was fixed in each round.

## Common fixes

- Two hands on one side / floating hand → hide the resting arm (`hideArmR`) and use one pose arm + grip prop from the library (`hands-poses.md`).
- Caption covers a face → move the actor up (scenes' action zone is y 160–1180) or push the camera.
- Dead shot → add a slow push (`scale` 1 → 1.08) and one entrance (ring/chip/card) at local +0.4 s.
- Clue missed → hold it longer, ring it in red on its own shot, or put it on the map.
- Reveal flat → make it a 4-beat shot, `bighit` on beat 0, `voLead` 0.5, red caption, and a blur-to-sharp or flip on the proof.
- Too many red boxes → keep the full box on 2–4 turn lines; turn the rest into `[gold]` or `{red}` keyword marks.
- Same-looking shots in a row → swap one for a close-up of the object the line is about, or a diagram of the mechanism.
- Nothing to learn → add a stat tile, meter or checklist with a checked fact to the knowledge shots.
- Flat ending → cliffhanger line with "…" on a 4-beat shot, then the `next` card.

Long-form (landscape) episodes use the review in the `thai-long-story` skill instead.
