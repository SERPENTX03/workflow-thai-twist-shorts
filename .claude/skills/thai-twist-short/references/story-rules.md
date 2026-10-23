# Story rules — twist shorts

## Shape (fits 45–90 s, ~20–28 shots)

| Act | Shots | Job |
|---|---|---|
| Hook | 1–2 | An anomaly with a concrete number or rule on screen at 0 s ("ห้อง 7 ค่าเช่าถูกผิดปกติ", "อย่าเปิดไฟฉาย"). |
| Normal → wrong | 3–6 | Establish the routine, then break it with small, physical events (a cup moves, footsteps at 03:00). Each event escalates. |
| Belief | 2–3 | The protagonist commits to the wrong explanation ("คุณเชื่อว่าห้องนี้มีผี") and acts on it (calls an exorcist, checks the camera…). |
| The turn | 3–5 | An outside authority gives an answer that sounds like confirmation but is literally the twist ("ไม่มีวิญญาณ แต่มีคนเป็นอยู่ด้วย"). Then the camera reveals who that line was really for. |
| Re-read | 2–4 | Replay earlier events with the missing piece visible ("แก้วที่ย้าย คือเธอเก็บ"). Short, fast, one line each. |
| Reveal | 3–4 | Evidence (date, document, photo) → the line that names the twist, on a 4-beat shot with a `bighit`. |
| Sting | 1–2 | Restate the twist on the most iconic image (the map with one hollow dot). End on it, hard cut. No "follow for part 2" card unless asked. |

## Twist types that work in this format

- **The viewer is the ghost / the dead one** (the Room 7 model) — the "you" voice makes it hit.
- **Inverted haunting** — the "ghost" is a living person; the haunted one is you.
- **Time slip** — the calendar, clock or news is from another date; you are the one out of time.
- **Wrong side of the rule** — a rule ("don't turn on the light") was protecting the thing, not you.
- **Identity swap** — the person you're warning about is described exactly like you.

Avoid: "it was a dream", twists that need information the viewer never saw, twists that require dialogue between two characters (this format has one narrator).

## Planting clues (the twist must be fair)

Plant **3–5 visual clues** before the reveal; each must be visible on screen at least once, and none may be named until the re-read act.

Good clue devices (all reusable from the kit):
- **No shadow** — every living character gets `.shadow-blob`; the protagonist never does.
- **The mirror copies with no face** — reflection drawn as `.sil` doing the same pose.
- **Stuck calendar / clock** — a date that never changes across scenes.
- **Hollow dot on the map** — on top-down maps the protagonist is a dashed hollow ring; the living are solid dots.
- **Eyes that pass through** — another character's sightline (dashed line) goes past the protagonist, not to him.
- **Steam that never rises / cup never emptied** — objects that only other people use.

Name each clue in the story outline next to the shot that plants it and the shot that pays it off.

## Twist checklist (gate for step 1)

- [ ] Logline in one sentence, twist in one sentence.
- [ ] Every event before the reveal still makes sense after it (re-read the shots as the twist is true).
- [ ] 3–5 clues planted, each visible, none spoken before the re-read.
- [ ] The line that names the twist is short (≤ 20 Thai characters) and lands on its own 4-beat shot.
- [ ] Hook is on screen at frame 0 and contains something specific (number, time, rule, place).
- [ ] No plot hole a commenter would point at in one sentence (e.g. "how did a ghost hire an exorcist?" → the new tenant hired them).

## Thai caption voice

- Talk to "คุณ". Present tense, short clauses, no particles like ครับ/ค่ะ.
- One idea per shot. ≤ 2 lines, ≤ ~18 characters per line, break at a natural pause (`\n` in story.json).
- Plain white for narration; `"style": "red"` only for lines that turn the story (hook, belief, the authority's answer, the reveal, the sting) — roughly 1 in 3 shots.
- The voice reads the caption by default. Use `"vo"` to change only what is said (e.g. read "ห้องเจ็ด" for "ห้อง 7" if the TTS stumbles).
- Spaces are pauses for the TTS: "ไม่พบวิญญาณ สักดวง" reads with a beat.
