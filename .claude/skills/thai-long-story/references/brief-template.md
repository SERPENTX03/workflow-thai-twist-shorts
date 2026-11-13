# <ชื่อเรื่อง> — brief

Landscape 16:9, long-form (~<N> min), <genre>, <setting>. <Fiction note if a real institution or practice appears: "All rules and events are fiction; title card + end card say so.">

**Logline:** <one sentence>
**Twist:** <one sentence>
**Tracked device:** <the list / count the viewer follows, e.g. "กฎ 10 ข้อ, ทีละข้อ">

## Comprehension (`longform-rules.md` → *Comprehension load*)

**The story to a friend, three sentences, ≤ 3 names:** <who wants what> · <what stands in the way, and how this world works> · <what turns>. If it needs more, cut threads now.

| World law (≤ 3, the first is the core) | One sentence, as spoken | First said (shot / %, ≤ ~25 % for the core) | Said again (shots) |
|---|---|---|---|
| core | | | |

| Name the viewer hears (≤ ~8) | Role said with it the first time | Seen or placed before the name is said? (shot) |
|---|---|---|
| | | |

Groups heard as one label: <"เด็กหกคนบนรถ", "คนที่หายไปสามคน">. Everyone else is a role.

- **Who we are looking for, on screen early:** <shots in the first 2 min and once per act> (search / rescue stories)
- **Who is dead or not human, and when the viewer is told:** <character · shot> (or: it is the twist → clue table)
- **How each place tells apart:** <house / room · colour, landmark, tag on return>
- **Open questions per chapter (≤ ~3 at once):** <chapter · questions open · which one closes>

## Speakers (one voice role each)

| Character | Gender / age | Role | `who` | Voice role (ElevenLabs) | Symbol (`src/cast.json`) | Trait |
|---|---|---|---|---|---|---|
| ผู้บรรยาย | | narrator, third person | — | `narrator` | — | — |
| | | lead | | `lead_male` / `lead_female` | `lead-male-A` / `lead-female-A` | |
| | | supporting | | | e.g. `father-A`, `sister-A`, `police-A` | |

Approve every new voice by listening before the full voice run (`thai-twist-short/references/voices.md`).

## Hook contract (first 15 s)

Write the opening lines as spoken, then time them aloud (`longform-rules.md` → *Hook contract*). Each row is said in words by 0:15; the twist is not.

| Must land | Line (Thai, as spoken) | Time |
|---|---|---|
| Who (role) | | |
| The deal or the threat | | |
| A number | | |
| The question (may ask "คุณ" once) | | |
| Name, age, why they cannot leave (by ~0:25) | | |

## Chapters

Mark each chapter's first shot in story.json with `"chapter": "<name>"` (viewer-facing: the names become YouTube chapters, so no spoilers). `npm run chapter -- episodes/<slug>` fills the real times and shot ranges. Blocks of **2–4 min**: split an act into two or three chapters when it runs longer, and give each block its own last line, an open question that leads into the next card.

| # | Part | Target time | Shots (fill after writing) | Re-hook / mini-reveal | Ends on (open question) |
|---|---|---|---|---|---|
| 0 | Cold open | 0:00–0:30 | | | |
| 1 | Act 1 — | | | | |
| 2 | Act 2a — | | | | |
| 3 | Midpoint — | ~50–60 % | | | |
| 4 | Act 2b — | | | | |
| 5 | Slip → reveal | ~85–90 % | | | |
| 6 | Aftermath + end card | | | | |

## Clues (planted → paid off)

| Clue | Cover (the ordinary reason the story gives for it before the slip) | Planted (shots, ≥ 3, ≥ 2 acts; mark the one planted in passing) | Pay-off (shot) |
|---|---|---|---|
| | | | |

The same table lives in story.json as tags (`clues`, `clue`, `pay`, `data.mirror`); fill the shot numbers here from the ledger `npm run story` prints.

## Suspects and concealment (`longform-rules.md` → *Concealment*)

| Character | Real secret | Lie the viewer can catch | Tell / trait (drawn every time) | Secret paid off in (shot) |
|---|---|---|---|---|
| <culprit> | | | | reveal |
| <suspect 2> | | | | |
| <suspect 3> | | | | |

- **Culprit role type / face family:** <helper, authority, family, victim, employer, lead> / <`father-*`…> — previous two films: <slug: type / face>, <slug: type / face>
- **Guess map** (what the viewer believes; each wrong, reasonable, different): 25 % <…> · 50 % <…> · 75 % <…>
- **Earliest a careful viewer can know:** <shot, %> → reveal at <%>; question that carries the gap: <…>
- **Lines where the narrator must stay quiet:** <the culprit's details that are shown but never remarked on before the slip>
- **Cold read** (after story.json, before voice — `.claude/story/cold-read.md`): <date, table: cut · first guess + confidence · rank of the real answer · the line that gave it away; fair? holes?>

## Sets and inserts

| Set / insert | Views | Light / time | Reused from |
|---|---|---|---|
| | | | new / `src/kit/…` / `temple-boy` |

## Continuity checks

- <dates, years, counts — write the arithmetic out>
- <who knows what, and from which shot>
- <the trait / prop side for each character>
- Ending = <what is resolved, what stays open>

## Blind-spot gate check (ตรวจจุดบอดก่อนเขียน story.json)

- [ ] **Grounded Body-count:** ตัวร้ายไม่ได้ไล่ฆ่าพยานเป็นผักปลา (ถ้ามีคนตายในปัจจุบัน ต้องมีเหตุผลที่สมจริงและมีผลกระทบตามมา)
- [ ] **Competent Protagonist:** ตัวเอกไม่ทำเรื่องโง่ๆ ที่คนดูด่า (เช่น รู้ว่าตัวร้ายเป็นฆาตกรแต่เดินเข้าไปติดกับคนเดียวโดยไม่มีแผนสำรอง)
- [ ] **Living World:** มีแรงกดดันจากโลกภายนอก (ตำรวจ, ข่าว, ชาวบ้าน) ไม่ได้ดำเนินเรื่องในสุญญากาศ
- [ ] **Emotional Logic:** การกระทำและเป้าหมายของตัวร้ายสอดคล้องกับแผลในใจ เมื่อรู้ความจริงใหม่ต้องมีปฏิกิริยาทางอารมณ์ที่สมจริง
- [ ] **Earned Catharsis:** ตอนจบให้คุณค่าทางศีลธรรม ความจริงได้รับการชำระสะสาง ไม่ใช่จบแบบหดหู่สิ้นหวังฟรีๆ
