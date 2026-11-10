# <ชื่อเรื่อง> — brief

Landscape 16:9, long-form (~<N> min), <genre>, <setting>. <Fiction note if a real institution or practice appears: "All rules and events are fiction; title card + end card say so.">

**Logline:** <one sentence>
**Twist:** <one sentence>
**Tracked device:** <the list / count the viewer follows, e.g. "กฎ 10 ข้อ, ทีละข้อ">

## Speakers (one voice role each)

| Character | Gender / age | Role | `who` | Voice role (ElevenLabs) | Symbol (`src/cast.json`) | Trait |
|---|---|---|---|---|---|---|
| ผู้บรรยาย | | narrator, third person | — | `narrator` | — | — |
| | | lead | | `lead_male` / `lead_female` | `lead-male-A` / `lead-female-A` | |
| | | supporting | | | e.g. `father-A`, `sister-A`, `police-A` | |

Approve every new voice by listening before the full voice run (`thai-twist-short/references/voices.md`).

## Chapters

Mark each chapter's first shot in story.json with `"chapter": "<name>"` (viewer-facing: the names become YouTube chapters, so no spoilers). `npm run chapter -- episodes/<slug>` fills the real times and shot ranges.

| # | Part | Target time | Shots (fill after writing) | Re-hook / mini-reveal | Ends on (open question) |
|---|---|---|---|---|---|
| 0 | Cold open | 0:00–0:45 | | | |
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
