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

## Narrative clarity & communication (กฎความชัดเจนในการสื่อสาร)

ในคลิปเล่าเรื่อง คนดูได้ยินเสียงผ่านหูแค่รอบเดียว การเขียนบทแบบ Subtext ซ้อน Subtext หรือพึ่งพาการตีความเองของคนดูมากเกินไปจะทำให้ "หลุดประเด็น" ต้องยึด 5 กฎนี้เสมอ:

1. **One-Punchline Logic (ตรรกะชั้นเดียว ไม่ปล่อยให้คนดูต่อจุดเกิน 1 ทอด):**
   - ห้ามทิ้งปมที่ต้องอาศัยการอนุมานซับซ้อนไว้ลอยๆ (เช่น ชู้สาว → กลัวความลับแตก → ย้ายที่ยืน → มุมมองเปลี่ยน → จำใจตัดรถคันแรกออก)
   - ต้องมี **"ประโยคตบท้าย (Punchline)"** ที่ระบุข้อเท็จจริงหรือแรงจูงใจแท้จริงตรงไปตรงมาเสมอ (ตัวละครพูดหรือผู้บรรยายช่วยขมวดปม เช่น *"เพื่อไม่ให้ใครรู้เรื่องชู้สาว ประจวบเลยเลือกตัดรถสีครีมทิ้ง แล้วปล่อยให้รถน้ำแข็งรับกรรมแทน"*)
2. **Narrator as Cognitive Anchor (ผู้บรรยายเป็นเข็มทิศความคิด แปลง Subtext ในใจ):**
   - ผู้บรรยายต้องไม่อ่านเฉพาะการเคลื่อนไหวทางกายภาพ แต่ในจุดสำคัญ/จุดพลิกผัน ต้องช่วยบรรยาย **"การตีความในใจของตัวละคร"** เพื่อให้คนดูเข้าใจทันทีว่าทำไมตัวละครถึงทำแบบนั้น (เช่น ฉากครูเทียน: แทนที่จะปล่อยให้คนดูงงว่า "นับนิ้วถึงสอง" เกี่ยวอะไรกับการปล่อยให้ตาย ผู้บรรยายต้องช่วยชี้: *"ในสายตาคนเป็นพ่อ คำว่าเด็กนับนิ้วได้ถึงสองไม่ใช่การช่วยชีวิต แต่มันคือหลักฐานว่าเด็กยังไม่ตายตอนนั้น แต่ต้นยืนมองดูจนเด็กหมดลม"* )
3. **Action-Motive Pairing (บอกการกระทำ ต้องประกบคู่เหตุผลทันที):**
   - เมื่อตัวละครพูดถึงการกระทำผิดปกติ (โกหกตำรวจ, ซ่อนหลักฐาน, ผลักคนลงบ่อ) ห้ามเล่าแต่ Action ลอยๆ ต้องประกบด้วย Motive (ความกลัว, ความเข้าใจผิด, ความละอาย) ในช็อตติดกันเสมอ ตามสูตร: `[Action: ทำอะไร]` + `[Motive: ทำไมถึงทำแบบนั้น]` + `[Cost: ผลร้ายที่เกิดกับเหยื่อ]`
4. **Clue Re-Anchoring (ดึงความจำเบาะแสเก่าด้วยคำขยายความบริบท):**
   - ในเรื่องยาว 15–50 นาที เมื่อ Clue เดิมถูกดึงกลับมาใช้ตอน Climax/เฉลย ห้ามใช้คำสั้นโดดๆ (เช่น "นับนิ้ว", "ร่มแดง", "กล่องชอล์ก") ให้ใส่คำขยายความที่กระตุ้นความจำคนดูสั้นๆ เสมอ (เช่น *"สองนิ้วที่เด็กพยายามนับก่อนหมดลม"*, *"ข้ออ้างเรื่องยืนซื้อยากลางฝน"*)
5. **Multi-modal Support (ภาพหรือซับช่วยเมื่อคำพูดกำกวม):**
   - หากบทพูดเป็นคำเปรียบเปรยหรืออารมณ์ตัดพ้อ ภาพบนจอ (Insert / Mark / Flashback) หรือคำเน้น `[gold]` / `{red}` ต้องบอกเหตุการณ์ตรงตัวเพื่อให้หูและตาประสานกัน ไม่ปล่อยให้คนดูงง

## Pacing & Dead-Air control (กฎความกระชับและการคุมเดดแอร์)

ช่องว่างเงียบ (Dead Air) ในคลิปวิดีโอ 2D เป็นจุดเสี่ยงอันดับ 1 ที่ทำให้ผู้ชมกดข้ามหรือคิดว่าคลิปค้าง:

1. **Zero Consecutive Empty Shots:** ห้ามมีช็อตว่าง (ช็อตที่ `text: ""`) ติดต่อกันเกิน 1 ช็อตเด็ดขาด ช็อตแทรก (Insert / Cutaway) ให้ใช้เสียงบรรยายหรือเสียงตัวละครพูดคร่อมภาพ (L-cut / J-cut) เสมอ
2. **Max Silence Cap (เพดานความเงียบ ≤ 2.5 วินาที):** ช็อตว่างเดี่ยวๆ อนุญาตให้ยาวได้ไม่เกิน 3 beats (~2.4 วินาที) สำหรับจังหวะตกใจ (Shock), จังหวะค้นพบเบาะแสสำคัญ, หรือ SFX โดดเด่นเท่านั้น ห้ามแช่ภาพนิ่งของฉาก/สิ่งของโดยไม่มีเสียงนานเกินกว่านี้
3. **Tight Boundary (เข้าเนื้อเรื่องทันทีหลังตัดฉาก):** เมื่อเปลี่ยนฉากหรือเปลี่ยน `view` บทพูดหรือคำบรรยายต้องเริ่มภายในวินาทีแรก (≤ 1.5 beats) ไม่เว้นช็อตเปิดฉากให้เงียบทิ้งไว้
4. **Total Silence Ratio ≤ 8%:** ผลรวมของ beats ที่ไม่มีเสียงพูดในทั้งเรื่องต้องไม่เกิน 8% ของความยาวเรื่องทั้งหมด (ตัดเดดแอร์ที่ไม่จำเป็นออกเพื่อเพิ่มความกระชับและดึง Retention)

## Story Blind-Spot Prevention (กฎเหล็กกำจัดจุดบอดเนื้อเรื่อง)

เพื่อป้องกันปัญหาตรรกะพังทลายหรือความไม่สมเหตุสมผลที่มักพบบ่อยในบทสืบสวน/ดราม่า:

1. **Grounded Body-Count (เพดานศพและความสมจริง):**
   - ในเรื่องดราม่า/สืบสวนสมจริง ห้ามฆ่าพยานทิ้งทุกคนเพียงเพื่อผลักดันเรื่อง (ห้ามติด Serial Killer Syndrome) ตัวร้ายที่เป็นคนธรรมดา (เช่น คนแก่, ครู, พ่อ) จะไม่สามารถออกล่าสังหารคน 3–4 คนในเวลาไม่กี่วันโดยไม่มีใครจับได้
   - พยานมีวิธีปิดปากอื่นที่สมจริง: หนีไปต่างจังหวัด, ป่วยธรรมชาติ, โดนขู่, หรือเกิดความละอายใจ
   - หากมีการตายในปัจจุบัน ต้องมีผลกระทบตามมาเสมอ (ชาวบ้านกลัว, ตำรวจเริ่มตั้งข้อสงสัย)
2. **Competent Protagonist (ตัวเอกต้องไม่โง่กะทันหันในองค์ 3):**
   - ตัวเอกต้องไม่ตัดสินใจกระทำการที่โง่กว่าคนดู (ห้ามถือ Idiot Ball)
   - หากตัวเอกรู้แล้วว่าตัวร้ายอันตรายหรือเป็นฆาตกร ตัวเอก **ห้าม** เดินดุ่มๆ เข้าไปในที่รโหฐานคนเดียวโดยไม่มีแผนสำรอง
   - หากตัวเอกต้องเพลี่ยงพล้ำ ต้องเกิดจากกลลวงใหม่ที่แยบยล, ความจำเป็นในการช่วยชีวิตผู้อื่น, หรือเหตุสุดวิสัยทางกายภาพ แม้ตัวเอกจะระวังตัวเต็มที่แล้ว
3. **Living World & Institutional Pressure (โลกแวดล้อมไม่สุญญากาศ):**
   - เรื่องต้องไม่ดำเนินอยู่ในสุญญากาศที่มีแค่ตัวเอกกับตัวร้าย เมื่อมีคดีสะเทือนขวัญ ต้องมีเสียงสะท้อนจากโลกภายนอกเสมอ (วิทยุข่าว, ตำรวจตรวจที่เกิดเหตุ, ชาวบ้านซุบซิบ)
   - แรงกดดันจากสังคมและตำรวจจะทำหน้าที่เป็น **Ticking Clock** บีบให้ตัวร้ายร้อนรนและก่อความผิดพลาดอย่างสมเหตุสมผล
4. **Emotional & Motive Consistency (ตรรกะทางอารมณ์ของตัวร้ายต้องไม่ย้อนแย้ง):**
   - การกระทำของตัวร้ายต้องผูกติดกับบาดแผลในใจ (Core Wound) อย่างแท้จริง
   - เมื่อตัวร้ายเผชิญกับ "ความจริงที่ทำลายความเชื่อเดิม" (เช่น รู้ว่าความจริงคนที่ฆ่าลูกคือคนในครอบครัวตัวเอง ไม่ใช่เหยื่อที่ตนล้างแค้น) ตัวร้ายต้องเกิดความพังทลายทางอารมณ์ (Emotional Collapse), ความสับสน หรือการยอมรับกรรม ไม่ใช่ก้มหน้าก้มตาฆ่าคนปิดปากต่อไปอย่างไร้หัวใจเหมือนหุ่นยนต์
5. **Earned Catharsis (ตอนจบต้องให้รางวัลทางอารมณ์ ไม่ใช่สิ้นหวังฟรีๆ):**
   - ในเรื่องยาว (15–50 นาที) คนดูลงทุนเวลาและอารมณ์มหาศาล ตอนจบสามารถเศร้าหรือสะเทือนใจได้ (Tragic) แต่ต้องมี **Moral Victory**: ความจริงต้องได้รับการเปิดเผย ความเสียสละของตัวเอกต้องมีความหมาย และตราบาปของคนบริสุทธิ์ต้องถูกชำระล้างอย่างสมศักดิ์ศรี

## Cast and voices

- Up to ~6 speakers. One voice role each from `thai-twist-short/references/voices.md`; children and elders get their own role, never the narrator's. Two speakers on the same voice need `switchBreath` and should never talk in consecutive shots.
- Every character line has `who` (for fit + talk mouths) and `voice` (TTS role). Narration has neither.
- Narrator: third person, calm, past or present tense consistently. `voiceTone: "calm"`; per-line `tone` only where it changes (whispers, scared).
- Roster in `src/episodes/<slug>/cast.tsx` (`RosterEntry`: cm, symbol per pose, vars, extra layers for the trait). **Symbols must be chosen from active (non-retired) characters in `src/cast.json` (the Single Source of Truth)**. Heights from `HEIGHT_CM` / `cast.json`.
- Faces: `hollow` only for the dead/turn; talk mouths (`talk` in the actor string) on every voiced on-screen line — **on the speaker only** (CLAUDE.md rule 10). The actor id must equal the shot's `who` (`win19` counts for `win`). Listeners, the person holding the phone while the other end speaks (`fx: "phone"`), and everyone in a narrated shot get a reaction face instead. Off-screen speaker → no `talk` on screen at all.

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
- [ ] Narrative clarity: no subtext-only leaps requiring > 1 deduction; motives paired with actions; clue re-anchoring on late callbacks.
- [ ] Pacing & Dead-air: no consecutive empty text shots; max silence cap ≤ 2.5s; total silence beats ≤ 8%.
- [ ] Blind-spot check: grounded body-count (no serial killer creep); competent protagonist (no unforced idiot moves in act 3); living world pressure; earned catharsis.
- [ ] No plot hole a commenter would point at in one sentence.
