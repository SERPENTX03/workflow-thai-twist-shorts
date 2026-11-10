# Long-form rules — landscape story films (18–30 min)

Evidence: `temple-boy` (the first long film; QC 10/10; now in `archive/temple-boy/`) and the general retention shape of narrated story channels. Numbers marked *temple-boy* are measured from its `timeline.json`; treat them as a working baseline, not a law, and update this file when a later film beats them.

## Format

- 1920×1080, 30 fps, 75 BPM grid (the grid only rounds shot lengths; `fit` decides them from the voice).
- Runtime: 18–30 min is the base. Set `target` (seconds, `[min, max]`) in story.json: about 18–22 min for a single-location story, 24–30 min for a multi-act mystery; shorter or longer only when the user asks (set `target` to match). Do not pad to reach a length. Without `target`, `npm run story` checks against 1080–1800 s. Do not pad to reach a length — cut to the story.
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
- **Dialogue coverage**: alternate wide two-shot → speaker close (or `-ots`) → listener reaction → insert of what they talk about. Never more than 4 shots of the same `view` in a row, never more than 3 of the same setup (`cinematography.md` §6).
- **The tracked device**: one list or count the viewer follows across the film (10 rules, years returned, nights left). Show progress on screen each time it moves ("กฎข้อ 4 / 10"). This is the long-form knowledge layer.

## Clues and continuity

- **6–10 clues**, each on screen 3+ times across at least two acts, each paid off by a shot that shows it (not only a line that says it). Keep the table in `brief.md`, and tag the shots in story.json (`clues`, `clue`, `pay`, `data.mirror` — `thai-twist-short/references/story-json.md` → *Clues and mirror pairs*): `npm run story` then counts the plantings and prints the ledger with the real shot numbers, so the brief is copied from it instead of kept by hand.
- **Continuity facts** (dates, counts, who knows what when) go in `brief.md` *before* writing; check every line against them. A 20 min film gets comments on a wrong year.
- Same prop, same hand, same side every time (`thai-twist-short/references/hands-poses.md`). A trait that is a clue (short pinky, left-arm wound) is drawn on every appearance.
- The culprit is on screen in act 1 and often after, with a job in the story of their own — never introduced late. They are **not the only helpful person and not the only person with an oddity** (*Concealment* below).
- Fair-play test: after the reveal, every earlier scene must still make sense.

## Concealment (กฎซ่อนหักมุม) — fair is not enough

The rules above make the twist fair. On their own they also make it easy to call: one character who is always there and always helpful, one physical trait the narrator remarks on, one wrong suspect who looks like a villain. `fifth-room` shows it: the caretaker enters at 1:27 and within 20 seconds the narrator says he came from behind the house and not the lane, that his right little finger is a joint short, and that his boots have fresh mud though it has not rained in a week. All three are the evidence of the reveal at 80 %. A viewer has the answer at 9 % of the film. These rules hide what the clue rules plant.

1. **Every clue has a cover job.** Before the slip the story itself gives an ordinary reason for the detail (muddy boots: he waters the garden in shot N; the short finger: a lathe accident he jokes about, and the scene is about the keys). In the brief's clue table, fill the *Cover* column. A clue with no cover is a spoiler.
2. **The narrator does not point.** Before the slip the narrator never calls a culprit's detail strange, never says "ทั้งที่…", never notes it twice. The picture carries it; the line in that shot is about something else. The narrator may point freely at details of the *wrong* suspects. Clue re-anchoring (clarity rule 4) starts at the slip, not before.
3. **A field of suspects, not one decoy.** At least **two** characters besides the culprit each have: a real secret, one lie the viewer can catch, a tell or trait drawn with the same care, and inserts of their own. Each secret is paid off by the aftermath (the debt collector was looking for the same man; the neighbour had heard the knocking and told no one). The wrong answer of act 2b rests on real evidence the viewer has seen, not on a face.
4. **Same camera weight.** If the culprit's trait gets an insert, a decoy's does too, in the same chapter. If a liar gets an ECU on their tell (`cinematography.md` §4.2), an innocent person hiding something smaller gets one as well. The camera treating only one person as worth a close look is itself the tell.
5. **Casting tell.** A viewer of this channel learns its habits. In the brief, write the culprit's *role type* (helper, authority, family, victim, the one who hired the lead, the lead) and the face family they wear (`villain-*`, `father-*`…), next to those of the last two long films (`universe/canon.json` → `episodes`, their briefs). Do not repeat the role type of the previous film, and do not put the only `villain-*` face on the decoy every time.
6. **A guess map.** In the brief, one line each for 25 %, 50 % and 75 %: *what the viewer believes is going on*. Each must be wrong, reasonable from what is on screen, and different from the one before. If the belief at 50 % is already the answer, the structure is the problem, not the wording.
7. **Early-guess slack.** Mark in the brief the earliest moment a careful viewer could know the answer. From there to the reveal is at most about 10 % of the runtime, unless a second question takes over (they know *who*, and now wait for *why* or *whether she gets out*). `father-ledger`: the wheelchair, the weight column and the half-seen body allow the guess near 40 %; the reveal is at 65 %; a gap that long needs a second question the viewer is still waiting on.
8. **Cover, title, chapter names and the cold open** may use only what the cold open shows. A cover that states the midpoint ("มีคนอยู่ในห้องลับ") spends it.
9. **Cold read before voice** (`.claude/story/cold-read.md`): after story.json is written and before `npm run voice`, readers who have not seen the brief get the spoken lines cut at 25 %, 50 % and 75 % and guess. The answer as first guess at 50 % = too easy: fix with rules 1–7, test again with new readers, twice at most, then the table goes to the user.

Clarity and concealment do not fight: clarity rules govern how the reveal and everything after it is told (one punchline, motive paired with action); concealment governs what the narrator stays quiet about before it.

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
   - ในเรื่องยาว เมื่อ Clue เดิมถูกดึงกลับมาใช้ตอน Climax/เฉลย ห้ามใช้คำสั้นโดดๆ (เช่น "นับนิ้ว", "ร่มแดง", "กล่องชอล์ก") ให้ใส่คำขยายความที่กระตุ้นความจำคนดูสั้นๆ เสมอ (เช่น *"สองนิ้วที่เด็กพยายามนับก่อนหมดลม"*, *"ข้ออ้างเรื่องยืนซื้อยากลางฝน"*)
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
   - ในเรื่องยาว คนดูลงทุนเวลาและอารมณ์มหาศาล ตอนจบสามารถเศร้าหรือสะเทือนใจได้ (Tragic) แต่ต้องมี **Moral Victory**: ความจริงต้องได้รับการเปิดเผย ความเสียสละของตัวเอกต้องมีความหมาย และตราบาปของคนบริสุทธิ์ต้องถูกชำระล้างอย่างสมศักดิ์ศรี

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

- **Places, then pictures** (`thai-twist-short/references/directing.md`): 6–10 recurring places, each **built once in perspective** (interiors with `src/kit/room.tsx`; exteriors in depth layers) and wider than any frame, so the camera can stand anywhere inside them. Every shot is then a designed picture of that place — its own `note`, its own camera, its own light — reused through `view` + `data.cam` or written as its own component. There is no lower class of "routine" shot: an exposition shot can be simpler than a climax, but it is still a picture you chose. Any shot may be a custom SVG/React component (the `what-if-studio` `dead-come-home` S1–S18 pattern); `Stage` is a convenience, not a requirement. Check `src/kit/` before drawing a place from scratch, and promote new places there.
- **The gallery is a library to search, not a menu:** write the shot's `note` first, then look; never a composition to copy.
- **Inserts** (hand, mug, photo, clock, book, phone, feet) are cheap, full-frame close-ups — use them for every clue and as cutaways in dialogue.
- **Light tells time**: a HUD clock and a grade per time of night (`dusk` → `lamp` → `night` → `dim` → `dawn`). Flashbacks use `PAST_FILTER` + `Grade past`.
- **Each set has a light plan**: the source of every view (lamp, window, street lamp, phone, headlight) drawn in the set and written as `data.lightAt` on its shots, so shadows, rim side and vignette agree; a 1 a.m. room is not lit like noon (`same-child` shots 375–380: the night bedroom at 7 % shadow). Interrogations, confessions and the reveal use `noir` (`thai-twist-short/references/depth-light.md` §4).
- Darkest frames at the reveal; the aftermath gets morning light.

## Camera & visual variety (มิติภาพ)

A 20 min film shot mostly from one flat eye-level side view feels like a slideshow. `ghost-money` shows the failure: all five sala presets (`wide` `desk` `row` `behind` `exit`) are z 1.0–1.2 at cy 540–600, the same angle shifted sideways, and `sala:row` alone is 17 of 112 shots (`npm run shots` reports 0 angle and 0 device shots). Full guide: `thai-twist-short/references/cinematography.md`.

1. **Place coverage.** Every recurring place is shot from several real positions inside it, not one backdrop zoomed — a guide of **6 setups across 3 sizes and 2 angles**: `-wide` (or `-ew`), a medium two-shot, a `-close` per regular speaker, one `-ots`, one angle (`-low` or `-high`; draw a real high-angle view of the set if it needs one) and one `-fif`/`-pov` (through a door, net, window or under the floor). Name presets with the `cinematography.md` §1 suffixes so `npm run shots` can read them. Add an `-ins` insert for every clue object the set holds.
2. **Beats pick the angle**, not habit: use the trigger table in `cinematography.md` §4.2 (lie → tell insert / split light; trust broken → `-dutch` for the rest of the scene; villain → `-sil` then `-low`; cornered or guilty → `-high`; watched → `-fif` / empty space behind; off-screen voice → listener close, source as `-sil`/`-ins`).
3. **Escalation ladder** (`cinematography.md` §4.3): level 0 (eye-level wide/medium) for information, 1 (close, insert, OTS, top) for emotion and clues, 2 (low, high, silhouette, frame-in-frame, POV, mirror, CCTV, split, dutch) for power shifts and threat, 3 (snap zoom, red rim, the darkest frame) only on the 3–5 red-box lines. Climb one level at a time; drop back to 0–1 for at least one shot after a level-3 moment.
4. **Per-chapter guides** (`npm run shots` warns; a warning is a question for the sheet, answered by a fix or one line of why — the picture wins over the number): EYE ≤ 50 % of camera shots; close/insert ≥ 30 %; ≥ 4 distinct setups; chapters over 90 s have ≥ 1 angle and ≥ 1 device shot. Film: ≥ 10 distinct setups; at least one ANGLE and one DEVICE shot per 90 s of runtime; both a low and a high/top; dutch ≤ 3 % and never in a calm chapter; 3–5 level-3 shots.
5. **Layers and one light** in every set shot (`directing.md` §4, `depth-light.md`): sharp rim-lit midground, soft dimmed background whose floor/walls run to one vanishing point (room kit, or `PerspFloor` / `SideWall` over an old set), atmosphere (`Haze`, dust, rain), a foreground when the picture has a reason for one (watched, over the shoulder, trapped), parallax on pans; light from a source in the frame that pools (`LightVeil`), shadows thrown away from it. Real close-ups: the head about half the frame (z ≈ 3–3.6), not waist-up. The midground must separate from the background on the contact sheet at 480 px, and `npm run look -- episodes/<slug> --chapter <n>` has no unexplained ✗ (night ≥ 45 % shadow, suspense ≥ 60 % with the subject lit, the reveal darker than the median frame).
6. **Flashback look stays fixed**: `data.past` (warm desaturated + grain) is always the past, the present stays cool; the past is framed one size tighter with a heavier vignette. The final reveal **mirrors the planting shot** (same `data.cam`, same staging, the missing piece visible): write both shot numbers in the clue table of `brief.md`.
7. **The 180° line**: each pair keeps its sides for a whole scene (`story` warns on x jumps). Cross it on purpose once, when the scene turns (the questioner becomes the accused).

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
- [ ] Concealment: every clue has a cover job; the narrator points at none of the culprit's details before the slip; two other suspects with a real secret, a lie and a tell each, all paid off; equal camera weight; culprit role type differs from the previous film; guess map at 25 / 50 / 75 % written and wrong each time; earliest-guess moment marked; cover and title use only the cold open.
- [ ] Cold read (step 2, after story.json and before voice): `npm run coldread`, result table shown to the user.
- [ ] Continuity facts written down (dates, counts, who knows what).
- [ ] Speakers table: one role each, approved voices, children/elders not on the narrator.
- [ ] Fiction disclaimer planned if a real institution or practice appears.
- [ ] Narrative clarity: no subtext-only leaps requiring > 1 deduction; motives paired with actions; clue re-anchoring on late callbacks.
- [ ] Pacing & Dead-air: no consecutive empty text shots; max silence cap ≤ 2.5s; total silence beats ≤ 8%.
- [ ] Blind-spot check: grounded body-count (no serial killer creep); competent protagonist (no unforced idiot moves in act 3); living world pressure; earned catharsis.
- [ ] No plot hole a commenter would point at in one sentence.
- [ ] Shot plan (before step 4): every camera shot has its `note` (the picture in one sentence); each recurring place is seen from several positions (sizes and angles) named with `cinematography.md` suffixes; every `npm run shots -- episodes/<slug>` `✗` is fixed or answered; every lie / clue / villain / paranoia / flashback beat has its §4.2 setup; the reveal shot names the planting shot it mirrors.
