# Channel playbook — what the numbers say, what stays ours

Read before step 1 (brief) and step 8 (packaging). The rules it changes are written into `longform-rules.md`; this file keeps the evidence and the line between **identity** (keep) and **delivery** (fix).

## The numbers (2026-11-12)

**@raohakmum (เล่าหักมุม), Videos, last 28 days:** 473.9K views · 3.6M thumbnail impressions · **CTR 7.0 %** · **average view duration 9:56**, climbing from ~9 to ~12 min · ~12 uploads in 18 days · views per day rose to 54K (Nov 9), then 36K. Videos run 19–56 min; median views ~27K, best 120K / 110K.

**@real_lens1 (Real Lens), the benchmark:** same genre and a similar flat-2D look. Two hits, กฎกะดึก ร้าน 24 ชั่วโมง (570K / 9 d) and อย่ากินซาลาเปาไส้พิเศษ! (450K / 7 d); the rest 15K–130K (median ~51K). Both hits use premises we also made: `night-shift-rules` got 14K and `father-ledger` 36K. **The idea was not the difference.**

What the analytics say:

- **CTR 7 % is healthy.** Covers and titles already earn the click. The cover pattern stays (big face on the right third + 2 big lines + a number or ห้าม / …อะไร?, `memory: cover-performance`). Test titles. Don't redesign the covers.
- **Watch time is our edge.** 9:56 per view × 474K ≈ 78K hours in 28 days. A 10-min Real Lens video cannot give that per view. Keep the long film.
- **The limit is impressions per video,** and YouTube hands those out on early retention and average % viewed. 9:56 of a ~23-min film is about 40 % viewed. The fixes below aim at the first minute and at the dips in the middle.

## Identity: keep it

| What | Why it stays |
|---|---|
| Twist ending with fair, hidden clues (Concealment, cold read) | it is the channel's name (เล่าหักมุม) and the reason people finish |
| One long film of 18–30 min in the คลองหมอก universe | watch time per view; recurring places and characters make a series without a series |
| Third-person storyteller narrator | the channel's voice; Real Lens uses first person ("ผม"). We may add one "คุณ" question in the hook, but we do not switch voice |
| Directed shots: a `note`, places in perspective, light from a source | it is the quality edge over Real Lens, whose shots are mostly front-on sprites dead centre |
| Cover pattern | CTR 7 % |

## Delivery: fix it (measured frame by frame at 30 fps)

| Lever | Real Lens (both hits) | Ours (`night-shift-rules`, `father-ledger`) | Rule now |
|---|---|---|---|
| Premise in the opening | job + pay + rule + "คุณจะรับไหม" by 0:12; who, age and why by 0:20 | mood first (dark corridor; "มีคนเคยบอกว่า มรดก…") | **Hook contract**: premise, stakes, a number and the question inside 15 s (`longform-rules.md` → *Structure*) |
| Caption rhythm | one line of 2–4 words, a new line every ~1.3 s | two lines, held ~4.5 s | **`"captionMode": "phrase"`**: one line of ≤ 22 chars, switched at the voice's pauses (*Captions*, `src/engine/phrases.ts`) |
| Frames that move | ~60 % (push-ins, hands acting, tags popping) | 13–20 % | **Something moves in every shot**; `shots` flags > 30 % still (*Motion inside the shot*) |
| Brightness (mean luma /255) | 92–97; dark only at turns | 71–83; night-shift first minute 47 | **Dark is for turns**: film mean ≥ 80, first minute ≥ the film median (*Sets, inserts and light*) |
| Pauses | short real silence between phrases (p5 −59 dB) | the bed fills every gap (p5 −32 dB) | `bed` ≤ 0.3, so phrases breathe; dead-air rules unchanged (*Sound*) |
| Re-hook structure | 2-min EP blocks, each ending on a title card with the next EP's question | chapters 45 s–5 min, no card | **Chapter blocks of 2–4 min**, each ending on an open-question line, with a ≤ 2 s chapter card (*Retention rules*) |
| Suspect dossier | callout labels on traits (หัวโล้น · แผลเป็นพาดคิ้ว · รอยสัก), name + age tags | name tags only | **Dossier callouts on every suspect alike**, never only the culprit (*Concealment* rule 4) |
| Title | `ชื่อสั้น | ผลลัพธ์/กติกา (เต็มเรื่อง / ดูรวดเดียวจบ)` | descriptive sentence | Title formula to A/B-test (`review-long.md` → *Packaging*) |

Measure the next film the same way before claiming a change worked: the commands and numbers are in `thai-twist-short/references/ref-library.md` (2026-11-12 log row). Compare retention at 0:30, at 1:00 and at the first chapter turn in YouTube Studio. Refresh this file when the user shares newer analytics.
