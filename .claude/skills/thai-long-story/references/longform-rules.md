# Long-form rules — landscape story films (10–25 min)

Evidence: `episodes/temple-boy` (the first long film; QC 10/10) and the general retention shape of narrated story channels. Numbers marked *temple-boy* are measured from its `timeline.json`; treat them as a working baseline, not a law, and update this file when a later film beats them.

## Format

- 1920×1080, 30 fps, 75 BPM grid (the grid only rounds shot lengths; `fit` decides them from the voice).
- Runtime: set `target` in story.json. 10–12 min for a single-location story, 18–22 min for a multi-act mystery. Do not pad to reach a length — cut to the story.
- Families: **haunting / grief mystery** (temple-boy), **ตำนานไทย** (folklore told slowly), **true-crime style fiction**. Survival "ถ้า…" stays a Short.

## Structure — acts with timestamps

| Part | Share | temple-boy | Job |
|---|---|---|---|
| Cold open | first 30–60 s | 0:00–0:42 | The strongest strange image (names carved under the bed) + the question, before any context. No logo, no "สวัสดี". |
| Title card | 1 shot | 0:42 | Title + fiction disclaimer if it touches a real institution (temple, school, police). |
| Act 1 — the world | ~20 % | to ~4:30 | Place, routine, every named speaker introduced with a `<Tag>` and one trait. First rule, first wrong thing, first 2–3 clues planted. |
| Act 2a — escalation | ~20–30 % | ~4:30–11:00 | The tracked device advances (rule 3, 4, 5…); each step followed by an event that makes it matter. A **mini-reveal every 2–3 min**. |
| Midpoint reframe | ~50–60 % | 11:56 | A reveal that changes what everything so far meant ("นนท์เสียไปเมื่อสิบเอ็ดปีก่อน"). Red box. |
| Act 2b — the wrong answer | ~25 % | ~12:00–17:00 | Suspicion moves; the characters (and viewer) commit to a wrong explanation; the real culprit stays in frame, helpful. |
| Slip → reveal | ~85–90 % | 17:22 → 18:12 | One character says one thing they could not know; then the proof (flashback in `past` grade); the twist line on its own shot, `bighit`. |
| Aftermath | 1–2 min | 18:12–19:44 | What it costs; loose threads closed (each clue paid off on screen). Not a lecture. |
| End card | last 30–40 s | 19:44–20:30 | Outcome card + fiction note + next story / subscribe line. |

## Retention rules

- **Always an open question.** At every moment the viewer can name something they are waiting to learn. Open a new question *before* answering the current one.
- **Re-hook every 60–90 s**: a new rule, a sound with no source, a character lying, a clue held in close-up, a time jump on the HUD. temple-boy's rules land at 0:38, 3:09, 4:25, 5:22, 6:36, 7:37, 8:46, 9:36, 10:32, 15:08.
- **Act-boundary recap**: one narrator sentence that restates what we know and what is still wrong ("สามคืนแล้ว… แต่ไม่มีใครบอกเขาว่าทำไม"). Viewers join late and skip.
- **Pattern change every 30–60 s**: new set, new light (`Grade`), an insert, a flashback, a map, a card. Longest same-scene run in temple-boy: 65 s — keep runs under ~90 s.
- **Average shot 2.5–4 s** (*temple-boy 2.8 s*, 21 shots/min). Long holds (> 12 beats, `story` warns) only on purpose: inspecting a clue, a silence (`hush`).
- **Dialogue coverage**: alternate wide two-shot → speaker close → listener reaction → insert of what they talk about. Never more than 4 shots of the same `view` in a row.
- **The tracked device**: one list or count the viewer follows across the film (10 rules, years returned, nights left). Show progress on screen each time it moves ("กฎข้อ 4 / 10"). This is the long-form knowledge layer.

## Clues and continuity

- **6–10 clues**, each on screen 3+ times across at least two acts, each paid off by a shot that shows it (not only a line that says it). Keep the table in `brief.md` with shot numbers — update it as shots move.
- **Continuity facts** (dates, counts, who knows what when) go in `brief.md` *before* writing; check every line against them. A 20 min film gets comments on a wrong year.
- Same prop, same hand, same side every time (`thai-twist-short/references/hands-poses.md`). A trait that is a clue (short pinky, left-arm wound) is drawn on every appearance.
- The culprit is introduced early, helpful, and on screen often — never introduced late.
- Fair-play test: after the reveal, every earlier scene must still make sense.

## Cast and voices

- Up to ~6 speakers. One voice role each from `thai-twist-short/references/voices.md`; children and elders get their own role, never the narrator's. Two speakers on the same voice need `switchBreath` and should never talk in consecutive shots.
- Every character line has `who` (for fit + talk mouths) and `voice` (TTS role). Narration has neither.
- Narrator: third person, calm, past or present tense consistently. `voiceTone: "calm"`; per-line `tone` only where it changes (whispers, scared).
- Roster in `src/episodes/<slug>/cast.tsx` (`RosterEntry`: cm, symbol per pose, vars, extra layers for the trait). Heights from `HEIGHT_CM`.
- Faces: `hollow` only for the dead/turn; talk mouths (`talk` in the actor string) on every voiced on-screen line.

## Captions (subtitles)

- Bottom band, ≤ 2 lines, ≤ ~42 Thai characters per line (`story` warns at `capChars`). One sentence per shot; split long narration into two shots instead of a third line.
- Marks rarer than in Shorts: `[gold]` for names, numbers and the tracked device; `{red}` for danger words; about 1 line in 5.
- Red box (`style: "red"`): 3–5 in the whole film — midpoint, slip, reveal, maybe the cold-open question. temple-boy used 3.
- Quoted speech in quotes; the voice reads it in the character's role.

## Sets, inserts and light

- 6–10 recurring sets, each drawn **once** as a world wider than the frame, reused through `view` + `data.cam`. temple-boy: 25 scenes but 115 scene/view pairs. Check `src/kit/temple.tsx` and `src/kit/world.tsx` before drawing a new backdrop.
- **Inserts** (hand, mug, photo, clock, book, phone, feet) are cheap, full-frame close-ups — use them for every clue and as cutaways in dialogue.
- **Light tells time**: a HUD clock and a grade per time of night (`dusk` → `lamp` → `night` → `dim` → `dawn`). Flashbacks use `PAST_FILTER` + `Grade past`.
- Darkest frames at the reveal; the aftermath gets morning light.

## Safe zones (1920×1080)

- Subtitles live in the bottom ~220 px band; faces and clue objects stay above y ≈ 840.
- HUD top-left (70, 90); cards top-right or centre over a darkened set.
- Faces in wide shots ≥ ~90 px tall; clue objects ≥ ~120 px or get their own insert.

## Sound

- `npm run voice` → `npm run fit` → `npm run audio`. If the film runs long, raise `voiceTempo` (1.05–1.12) before cutting lines — no re-synthesis, no credits. Above ~1.15 reads rushed (`story` warns).
- `breath` 0.2–0.3, `switchBreath` 0.2–0.35, `fitStep` 0.125 for tight cuts (temple-boy: 0.2 / 0.2 / 0.125, tempo 1.1).
- Ambience beds as custom `sfx` (night, rain) under every silent stretch; `hush` for real silence before a turn; footsteps as `step` cues.
- One `bighit` per film, on the reveal. `bell` marks chapter turns. `hit` at most every other shot.
- Mastering by `npm run final`: −14 LUFS, true peak ≤ −1 dBTP.

## Long-form checklist (gate for step 1)

- [ ] Logline (1 sentence), twist (1 sentence), runtime target set.
- [ ] Cold open: strongest image + question inside 30 s, before the title.
- [ ] Chapter plan with target timestamps (each chapter ~45 s–5 min, marked with `chapter` in story.json); midpoint reframe at 45–60 %; reveal at 80–90 %.
- [ ] A re-hook planned every 60–90 s (list them with timestamps).
- [ ] One tracked device, shown with progress each time it moves.
- [ ] 6–10 clues in the brief table, each planted 3+ times in 2+ acts, each with a pay-off shot.
- [ ] Culprit/answer on screen in act 1.
- [ ] Continuity facts written down (dates, counts, who knows what).
- [ ] Speakers table: one role each, approved voices, children/elders not on the narrator.
- [ ] Fiction disclaimer planned if a real institution or practice appears.
- [ ] No plot hole a commenter would point at in one sentence.
