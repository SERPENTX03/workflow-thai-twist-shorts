# Story rules — twist shorts

Evidence for these rules: `ref-library.md` (high-view clips the user picked).

## Pick a format family first

| Family | Hook shape | Narrator | Length | Pace | Ending |
|---|---|---|---|---|---|
| **Survival "ถ้า…"** (default) | "ถ้า X เกิดขึ้นตอนคุณอยู่ที่ Y" — school, condo, BTS, farm, flooded village | "คุณ" **or** a named lead ("เจย์") seen from outside | 60–110 s | cut every 2.5–3 s | twist or cliffhanger → ตอนต่อไป card |
| **Haunting twist** (Room 7 model) | an anomaly with a number ("ห้อง 7 ค่าเช่าถูกผิดปกติ") | "คุณ" | 45–90 s | 2.4–3.2 s shots | twist line → sting |
| **ตำนานไทย** (folklore) | "กลางดึก มีคนเรียกยายแพง" — a named villager, a village rule | third person, calm storyteller | 90–130 s | slow camera, long holds, `captionLook: "folk"` | creature reveal → ตอนหน้า card |

Survival is the default: it combines a twist with **useful knowledge**, which is what the reference clips share.

## Survival "ถ้า…" — shape (~25–35 shots)

| Act | Shots | Job |
|---|---|---|
| Hook | 1–2 | Scenario + place + clock at frame 0 ("ไฟดับทั้งกรุงเทพฯ", "10:40 · ม.4/2"). |
| Rule 1 | 3–5 | A numbered rule card, why it matters, a diagram or number that proves it. |
| Problem | 3–5 | Something physical breaks (น้ำหยุดไหล, ลิฟต์ค้าง, ห้องร้อน 36 °C). A meter drains or a counter changes. |
| Rule 2 / fix | 3–5 | The smart move, shown step by step (checklist ticks, cross-section, before/after). |
| Clue beats | spread | 3–5 physical clues planted inside the knowledge shots (see below). Never named yet. |
| Turn | 2–4 | "ทุกอย่างถูกหมด… ยกเว้นเรื่องเดียว" — the rules were right, one fact was missed. |
| Reveal | 2–3 | Close-up proof (the bandage, the date, the face) → the twist line, 4 beats, `bighit`. |
| Cliffhanger + card | 2 | A short line that opens the next episode ("ตีสอง… แล้วเรียกชื่อเขา…"), then the `example-next` end card. |

## Haunting twist — shape (~20–28 shots)

| Act | Shots | Job |
|---|---|---|
| Hook | 1–2 | An anomaly with a concrete number or rule on screen at 0 s. |
| Normal → wrong | 3–6 | Establish the routine, then break it with small, physical events. Each event escalates. |
| Belief | 2–3 | The protagonist commits to the wrong explanation and acts on it. |
| The turn | 3–5 | An outside authority gives an answer that sounds like confirmation but is literally the twist. |
| Re-read | 2–4 | Replay earlier events with the missing piece visible. Short, fast, one line each. |
| Reveal | 3–4 | Evidence (date, document, photo) → the line that names the twist, 4-beat shot, `bighit`. |
| Sting | 1–2 | The twist on the most iconic image, then the next-episode card if this is a series. |

## The knowledge layer (survival and folklore)

- **One fact every 3–5 shots**: a number, a rule, a mechanism ("น้ำที่ค้างในท่อ", "5 คนต่อตารางเมตร", "จมูกหมามีตัวรับกลิ่นราว 300 ล้าน").
- Facts must be **true and safe**. Check any number you are not sure of (search if needed) and say in the outline which ones you checked. No medical or survival advice that could hurt someone who copies it.
- Show every fact as a picture: stat tile, meter, diagram, checklist, calendar. A fact said only in the caption is wasted.
- Folklore: the "fact" is the village rule or belief ("ห้ามขานรับเสียงเรียกตอนกลางคืน"), told as belief, not as truth.

## Cast

- A **named lead** and **one animal companion** recur across a series (เจย์ + แมวส้มโอ). Give each a `.tag` the first time they appear.
- At most 3 named humans per episode; each has one visual trait the viewer can track (long sleeves, a cap, glasses).
- "คุณ" stories can still have named friends ("ต้น", "ฟ้า-หัวหน้าห้อง").

## Twist types that work

- **The danger is already inside** — the friend in long sleeves was bitten from the start; someone was already inside the fence.
- **The rule was protecting the thing, not you** — wrong side of the rule.
- **The viewer is the ghost / the dead one** (Room 7) — the "you" voice makes it hit.
- **Inverted haunting** — the "ghost" is a living person; the haunted one is you.
- **Time slip** — the calendar, clock or news is from another date.
- **Identity swap** — the person you're warning about is described exactly like you.

Avoid: "it was a dream", twists that need information the viewer never saw, twists that require dialogue between two characters.

## Planting clues (the twist must be fair)

Plant **3–5 visual clues** before the reveal; each visible on screen at least **3 times**, none named until the turn.

Good clue devices:
- **Wrong clothes for the situation** — long sleeves at 36 °C; a coat indoors; wet hair on a dry day.
- **A number that should have changed** — a calendar stuck on one date; one more person on the count than in the room.
- **No shadow** — every living character gets `.shadow-blob`; the protagonist-ghost never does.
- **The mirror copies with no face** — reflection drawn as `.sil`.
- **Hollow dot on the map** — the protagonist is a dashed hollow ring; the living are solid dots.
- **The animal reacts first** — the dog growls at someone who seems fine; the cat won't go near the door.
- **Eyes that pass through** — another character's sightline goes past the protagonist.

Name each clue in the outline next to the shots that plant it and the shot that pays it off.

## Twist checklist (gate for step 1)

- [ ] Format family chosen; logline in one sentence, twist in one sentence.
- [ ] Every event before the reveal still makes sense after it.
- [ ] 3–5 clues planted, each visible 3+ times, none spoken before the turn.
- [ ] Survival/folklore: at least one checked fact every 3–5 shots, each with a visual.
- [ ] The twist line is short (≤ 20 Thai characters) and lands on its own 4-beat shot.
- [ ] Hook is on screen at frame 0 and contains a place + a threat or a number.
- [ ] Series: the last line opens a question the next episode answers; `series.next` is set.
- [ ] No plot hole a commenter would point at in one sentence.

## Thai caption voice

- Survival/haunting: talk to "คุณ" or about the named lead. Present tense, short clauses, no ครับ/ค่ะ.
- Folklore: storyteller voice, past tense allowed ("กลางดึก มีคนเรียกยายแพง").
- One idea per shot. ≤ 2 lines, ≤ ~18 characters per line, break at a natural pause (`\n`).
- Mostly plain white. Colour **one keyword** with `[คำ]` (gold: numbers, facts, the smart move) or `{คำ}` (red: danger). Not every line needs a mark — about 1 in 2.
- `"style": "red"` (full red box) only for the 2–4 lines that turn the story: hook, the turn, the reveal, the cliffhanger.
- Ellipses "…" are allowed on cliffhanger lines ("ตีสอง…") and pull the viewer into the next shot.
- The voice reads the caption by default (marks are stripped). Use `"vo"` to change only what is said.
- Spaces are pauses for the TTS: "ไม่พบวิญญาณ สักดวง" reads with a beat.
