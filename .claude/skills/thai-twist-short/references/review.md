# Review (step 6) — one pass, no scores

CLAUDE.md rule 5. Long-form (landscape) episodes: `thai-long-story` → `references/review-long.md`.

1. `npm run check -- episodes/<slug>` once after drawing (tsc + story + full Board, one key frame per shot at 60 % of the shot, in `out/<slug>-board/element-N.jpeg`). Afterwards `npm run review -- episodes/<slug> --board` re-renders only shots whose story.json entry or scene source changed (`--all` forces everything; use it after a change in `src/kit/` or `src/cast/`, which touches every shot).
2. The command prints the **suspect list** (look / shots / story ✗ per shot) and writes `out/<slug>-review.html`. Open **only the suspect and changed frames at full size**; fix each once, or answer it in one line that names what can be seen in the frame.
3. Give the user the page. They scroll the whole film once, tick the odd shots (hands, wrong mouth, floating things, a picture you cannot name) and paste the list. Fix only those, once.
4. `npm run review -- episodes/<slug> --accept` records the state; later runs list only what changed since.

No 1–10 scores, no "fix the three worst and score again", no contact sheets of every shot.

## What to check on a frame you have open

- **Phone size**: also look at it scaled to ~360 px wide.
- **Seams and motion**: Board shows one moment per shot. For a cut or an entrance, take stills either side of it: `npx remotion still src/index.ts <Id> out/x.png --frame=<global frame>` (shot start = `timeline.json` `start` × 30). Shots that declare `data.motion` / `data.move`: `npm run motion -- episodes/<slug>`.
- A frame that falls exactly on a cut shows the next caption mid-entrance; that is expected.

| Look for | Right means |
|---|---|
| Hook (first 2 s) | the anomaly + a specific number / rule / time is readable at frame 0; something moves within 0.5 s |
| Readability | every caption readable at phone width; nothing important under the caption band or in the bottom 380 px; faces ≥ ~120 px |
| Hands and motion | ≤ 2 hands per figure, none doubled on one side, held objects under a hand (`hands-poses.md`); no dead shot; camera moves eased; pops land on beats |
| Direction and light | the frame matches its `note` and the storyboard check in `directing.md` §7; a close-up is acting, not an ID photo (§5.1); one style in the frame (§5.2); light from something in the frame that pools; each `-low` / `-pov` / `-fif` view looks like its name |
| Story | each clue is visible where the outline says; the reveal frame shows its proof (photo, date, bandage, hollow dot); no clue is circled or pointed at before the turn (`story-rules.md` → *Hiding the twist*) |
| Sound | `hit` / `bighit` on cuts; voice never crosses a cut (no `⚠ OVER`); drone dip before the reveal; every speaker matches `voices.md` (gender, age, one role each) when listened to |
| Value | a fact, rule or number on screen every 3–5 shots (survival / folklore); something counts about every 10 s; a series ends on its cliffhanger + ตอนต่อไป card |

**Always fixed when seen**, whoever flags them: a doubled or floating hand, a wrong voice, a listener's mouth moving, a frame lit evenly from nowhere, a held thing that is not in a hand, someone sitting on air.

Report to the user in a few lines: which suspects were fixed, which were answered and why. Then the single final render (CLAUDE.md rule 4).

## Common fixes

- Two hands on one side / floating hand → pose the figure's own arm (`armR=…`, `arm=r-phone`), which removes the resting one, plus a grip prop from the library (`hands-poses.md`).
- Caption covers a face → move the actor up (action zone y 160–1180) or push the camera.
- Dead shot → a push the eye can see (8–15 %) or one entrance (ring / chip / card) at local +0.4 s.
- Clue missed → hold it longer or give it one more planting; ring it in red only at or after the turn.
- Reveal flat → a 4-beat shot, `bighit` on beat 0, `voLead` 0.5, red caption, and a blur-to-sharp or flip on the proof.
- Too many red boxes → keep the full box on 2–4 turn lines; turn the rest into `[gold]` or `{red}` keyword marks.
- Same-looking shots in a row → rewrite their `note`s as different pictures: the object the line is about, the listener's face, a hand, the place from the other side of the room, a diagram of the mechanism.
- One backdrop for a whole scene → build the place with `room.tsx` and shoot it from several positions (`directing.md` §3).
- "Close-up" that is really waist-up → `data.cam` at z ≈ 3–3.6 on the head (the `Stage` auto-close is a medium).
- Face-on close-up → turn the head to what they look at (`yaw` 0.4–0.6 + `look`), a hand in frame, a face change mid-shot (`directing.md` §5.1).
- Flat frame (even light, figure dead centre, wall parallel to the screen, floating feet) → one source you can see + `data.lightAt`, `LightVeil` with a hole at that light, the lead on a third (`cx = x ± W/(6z)`), the place rebuilt in perspective, `Far dim` at night (`depth-light.md` §9 fix table).
- Nothing to learn → a stat tile, meter or checklist with a checked fact on the knowledge shots.
- Flat ending → cliffhanger line with "…" on a 4-beat shot, then the `next` card.
