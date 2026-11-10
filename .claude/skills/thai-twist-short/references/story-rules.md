# Story rules — twist shorts

Evidence for these rules: `ref-library.md` (high-view clips the user picked). These are **Shorts** rules (portrait, under ~2 min); a landscape long-form story follows `thai-long-story` → `longform-rules.md`.

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
| Cliffhanger + card | 2 | A short line that opens the next episode ("ตีสอง… แล้วเรียกชื่อเขา…"), then the `next` end card. |

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

### Staging & Dialogue Continuity (Never vanish or jump)

- **Coverage, not a fixed two-shot** (`directing.md` §2): a dialogue does not need both people in every shot. Cut between the speaker close, the listener's reaction, a hand, the object they talk about and a wide when the situation changes. In a shot that does show both, the speaker gets `talk` and the partner a listening face (`wary`, `worried`, `shock`, `sad`).
- **Same view, same people**: within one `view` (the same camera on the same place) nobody disappears and nobody changes seat between consecutive cuts, unless they walk (`data.move`). To show one person alone, change the camera (a real close-up, `directing.md` §5.1), don't delete the partner from the wide.
- **True close-ups**: a `*-close` view frames the head at about half the frame (z ≈ 3–3.6 in 16:9, `directing.md` §2). z 1.7–1.9 is a medium.
- **Preflight check**: `npm run story -- episodes/<slug>` warns on position jumps within one view and on a `-close` with no camera; `npm run shots` counts stiff standing figures and face-on close-ups.

## Shot plan & visual variety (มิติภาพ)

The camera is part of the story: it stays plain while the story gives information and changes when truth, power or safety changes. Full guide, setup vocabulary and per-scene patterns: `cinematography.md`.

- **Name the setup in `view`** with a suffix from `cinematography.md` §1 (`-close` `-ecu` `-ins` `-low` `-high` `-top` `-dutch` `-ots` `-pov` `-fif` `-sil` `-split` `-mirror` `-cctv` `-snap`). A view with no suffix counts as a flat eye-level side view (EYE).
- **Story beat decides the angle** (`cinematography.md` §4.2): a lie gets an `-ecu`/`-ins` on the liar's tell; a clue gets a macro insert framed the same way every time; a villain reveal goes `-sil` → `-low`; a cornered or guilty character goes `-high`; paranoia gets `-fif` or empty space behind them; a flashback gets `data.past` and **mirror framing** (the reveal reuses the planting shot's `data.cam` and staging, with the missing piece now visible).
- **Layers** in every set shot: sharp lit midground (cast and clue), soft `Far` background, air between them; a dark blurred foreground (door edge, mosquito net, shoulder) when the picture has a reason for one — watched, over the shoulder, trapped — about a third of shots. `cinematography.md` §5.
- **One hard rule**: no two neighbouring shots with the same size and angle. **Guides for a Short** that `npm run shots` prints as ✗ — each a question to answer with a fix or one line about the frame, not a quota to fill (CLAUDE.md rule 14): EYE ≤ 40 % of camera shots; close/insert 30–60 %; ≥ 3 angle shots (a low and a high/top); ≥ 2 device shots; ≥ 6 distinct setups; ≤ 2 dutch; level-3 shots (`-snap`, the reveal frame) only on the 2–4 red-box lines.
- **Contrast before impact**: the shot before a twist, a jump or a villain reveal is its opposite: wide, still and quiet before tight, fast and loud.

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
- **No shadow** — every living character gets a `<ShadowBlob>` (`src/kit/fx.tsx`); the protagonist-ghost never does.
- **The mirror copies with no face** — reflection drawn as `<Sprite silhouette>`.
- **Hollow dot on the map** — the protagonist is a dashed hollow ring; the living are solid dots.
- **The animal reacts first** — the dog growls at someone who seems fine; the cat won't go near the door.
- **Eyes that pass through** — another character's sightline goes past the protagonist.

Name each clue in the outline next to the shots that plant it and the shot that pays it off.

## Hiding the twist (fair is not enough)

The clue rules above make a twist fair. On their own they also make it easy: a detail the camera isolates three times and the caption remarks on is a signpost. A twist the viewer calls at shot 8 is a plot summary. These rules hide what the clue rules plant; long-form adds more in `thai-long-story` → `longform-rules.md` → *Concealment*.

1. **Every clue has a cover job.** Before the turn the story gives the viewer an ordinary reason for the detail to be on screen (long sleeves: "แอร์ห้องนี้หนาว"; the dog growling: "มันหิว"), so they file it under something else. In the outline's clue table write the cover next to the clue. A clue with no cover is a spoiler.
2. **The caption never points.** Before the turn no line says a detail is odd, repeats it, or explains it ("เขาใส่แขนยาวทั้งที่ร้อน" is pointing; a thermometer at 36 °C in the same frame as the sleeves is planting). Show it; let the line be about something else. No red ring on a real clue before the turn.
3. **At least one planting is in passing**: inside a shot that is about something else, not in its own insert. The other plantings may be inserts, framed the same way each time.
4. **One decoy.** One detail gets the same camera weight as the real clues and points at the wrong answer (the friend who keeps looking at the door). It is explained in one line at or after the reveal, never left hanging.
5. **Write down the first guess.** In the outline: "what a viewer guesses by shot 5". If the twist is that guess, change the twist or change which question it answers. The six twist types above are well known; a stock type needs a turn the type does not predict (the viewer guesses "he is the ghost"; the reveal is who has been keeping him there).
6. **The hook, title and cover sell the question, never half the answer.** They may use only what the first two shots show.
7. **Cold read before voice** (`.claude/story/cold-read.md`): a reader who has not seen the outline gets the captions up to the shot before the turn and guesses. Too easy → fix with rules 1–5 and test again with a new reader, twice at most; then the result goes to the user.

## Twist checklist (gate for step 1)

- [ ] Format family chosen; logline in one sentence, twist in one sentence.
- [ ] Every event before the reveal still makes sense after it.
- [ ] 3–5 clues planted, each visible 3+ times, none spoken before the turn.
- [ ] Hidden as well as fair (*Hiding the twist*): every clue has a cover job; no caption points at a clue; one planting in passing; one decoy that is explained; the viewer's first guess is written down and is not the twist; hook, title and cover give away nothing past shot 2.
- [ ] Cold read done on the finished captions before voice (step 2 → 5), result shown to the user.
- [ ] Survival/folklore: at least one checked fact every 3–5 shots, each with a visual.
- [ ] The twist line is short (≤ 20 Thai characters) and lands on its own 4-beat shot.
- [ ] Hook is on screen at frame 0 and contains a place + a threat or a number.
- [ ] Series: the last line opens a question the next episode answers; `series.next` is set.
- [ ] Narrative clarity: no obscure subtext leap; motives paired with actions; the twist punchline is unmistakable.
- [ ] No plot hole a commenter would point at in one sentence.

## Shot-plan checklist (gate for step 2 → 3, before any scene is drawn)

- [ ] Every camera shot has a `note`: the picture in one sentence — who does what with what, from where, lit by what (`directing.md` §1). A shot whose note you cannot write is not ready.
- [ ] Every shot's `view` names what the picture is (a setup suffix, or the scene is an insert/card).
- [ ] Every cut changes size or angle; each place is seen from several positions, with real close-ups and inserts.
- [ ] Every `npm run shots -- episodes/<slug>` `✗` is fixed or answered in one line (the numbers are guides; the picture wins).
- [ ] Every trigger in the story (lie, clue found, villain reveal, paranoia, cornered, flashback, off-screen voice) has the setup `cinematography.md` §4.2 gives it.
- [ ] Each clue is framed the same way each time it appears; the reveal shot names the planting shot it mirrors, or uses a setup not seen in the 10 shots before it.
- [ ] The shot before each impact moment is its opposite (wide/still/quiet).
- [ ] After drawing: on the Board frames each view looks like its name (a `-low` that reads flat fails, whatever the audit says), and the midground separates from the background at 360 px wide.

## Narrative clarity (ความชัดเจนในการสื่อสาร)

- **One-punchline rule:** คนดูฟังเสียงแค่รอบเดียว ห้ามทิ้งปมที่ต้องอนุมานเกิน 1 ทอดไว้ลอยๆ ต้องมีประโยคสรุปตรรกะหรือแรงจูงใจที่ชัดเจนเสมอ
- **Action-Motive pair:** เมื่อตัวละครทำสิ่งผิดปกติ (โกหก, แอบซ่อน, ละเมิดกฎ) ต้องบอกความกลัว/แรงจูงใจประกบคู่ทันที ไม่ปล่อยให้คนดูสงสัยว่า "ทำไปทำไม"
- **Narrator clarity:** คำบรรยายช่วยเสริมความเข้าใจ ไม่ปล่อยให้บทสนทนากำกวมจนคนดูหลุดโฟกัส

## Thai caption voice

- Survival/haunting: talk to "คุณ" or about the named lead. Present tense, short clauses, no ครับ/ค่ะ.
- Folklore: storyteller voice, past tense allowed ("กลางดึก มีคนเรียกยายแพง").
- One idea per shot. ≤ 2 lines, ≤ ~18 characters per line, break at a natural pause (`\n`).
- Mostly plain white. Colour **one keyword** with `[คำ]` (gold: numbers, facts, the smart move) or `{คำ}` (red: danger). Not every line needs a mark — about 1 in 2.
- `"style": "red"` (full red box) only for the 2–4 lines that turn the story: hook, the turn, the reveal, the cliffhanger.
- Ellipses "…" are allowed on cliffhanger lines ("ตีสอง…") and pull the viewer into the next shot.
- The voice reads the caption by default (marks are stripped). Use `"vo"` to change only what is said.
- Spaces are pauses for the TTS: "ไม่พบวิญญาณ สักดวง" reads with a beat.
