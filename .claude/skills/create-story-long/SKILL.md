---
name: create-story-long
description: Take a raw story prompt for a Thai LONG-FORM landscape (16:9, 10–25 min) episode, audit it against the long-form rules, fill the gaps, lift it to be more fun, and produce an approved brief.md BEFORE any story.json is written. Use when the user types /create-story-long followed by their raw story idea or prompt, or asks to plan/outline/improve a long (landscape, คลิปยาว, เรื่องยาว) story first.
argument-hint: "{prompt ดิบของเนื้อเรื่อง — สั้นหรือยาวก็ได้}"
---

# /create-story-long — ตรวจ เติม ยกระดับ ก่อนเขียนเรื่องยาว

ฟอร์แมตตายตัว: **แนวนอน 16:9, 10–25 นาที** ไม่ต้องถามฟอร์แมต ถ้า prompt ดูเหมาะกับ Shorts (เรื่องสั้น ~1–2 นาที, survival "ถ้า…") ให้บอกในบรรทัดเดียวว่า `/create-story-short` เหมาะกว่า แล้วทำต่อแบบยาวถ้าผู้ใช้ไม่ค้าน

Skill นี้ **ไม่มีกฎของตัวเอง** มันอ่านกฎจริงแล้ววัดเรื่องกับกฎนั้น และไม่เขียน `story.json` เด็ดขาด (นั่นคือ step 2 ของ `thai-long-story`)

## 0. อ่านก่อนทำอะไร

1. `CLAUDE.md` (ชนะทุกอย่าง)
2. `.claude/skills/thai-long-story/references/longform-rules.md` — โครง act, retention, clue, Narrative clarity, Pacing, Blind-spot, **Long-form checklist**
3. `.claude/skills/thai-long-story/references/brief-template.md` — รูปแบบ brief ที่ต้องส่งออก
4. `.claude/story/fun-pass.md` — เกณฑ์ยกระดับความสนุก และ `.claude/story/cold-read.md` — วิธีทดสอบว่า twist เดาง่ายไหม
5. `ls episodes/` และ `series/` — อย่าซ้ำ premise ที่มีแล้ว และอ่าน brief ของเรื่องยาวสองเรื่องล่าสุดเพื่อดู role type ของคนร้าย (Concealment ข้อ 5) ถ้าต่อจากเรื่องเดิม ให้อ่าน `story.json` ของเรื่องนั้นด้วย
6. อ้างอิงงานจริง: `episodes/fifth-room/brief.md`, `episodes/father-ledger/brief.md` (เรื่องล่าสุด) และ `archive/temple-boy/episode` (เรื่องยาวเรื่องแรก ที่มาของตัวเลข pacing)
7. `universe/bible.md` และ `universe/canon.json` — กฎโลก สถานที่ ตัวละคร canon ระดับการเชื่อม (ถ้าไฟล์ไม่มี ข้าม §1.5 แล้วบอกผู้ใช้บรรทัดเดียว)

## 1. Intake — ถอด prompt เป็น Story Brief ดิบ

จาก `$ARGUMENTS` สรุปเป็นตารางสั้น: premise · ประเภท (haunting/grief mystery, ตำนานไทย, true-crime style fiction — ตาม longform-rules "Families"; survival "ถ้า…" ไม่ใช่เรื่องยาว) · สถานที่/ยุค · ภัยหรือปมหลัก · twist (ถ้ามี) · ตัวละครที่ระบุ · ความยาวเป้าหมาย · โทน

ช่องที่ prompt ไม่ได้บอก **เติมค่าเริ่มต้นเองและมาร์ก `(เดา)`** ไม่ต้องถาม ถามเฉพาะเมื่อไม่รู้แล้วทิศเรื่องเปลี่ยนจริง และถามรวมครั้งเดียวไม่เกิน 3 ข้อ (ใช้ AskUserQuestion) เช่น "ใครคือคนร้ายที่แท้จริง" ถ้า prompt ให้เฉลยมาแล้ว ห้ามถาม

## 1.5 Universe link — คิดเรื่องการเชื่อมก่อนวัด

ทำหลัง intake ก่อน audit ตอบ 5 ข้อสั้นๆ ตามที่ `universe/bible.md` กำหนด ทุกข้อเติมค่าเริ่มต้นเองและมาร์ก `(เดา)` ไม่ต้องถาม:
1. **ระดับการเชื่อม 0–4** ค่าเริ่มต้นคือ 0–2 เรื่องยาวมีที่ให้ระดับ 3 ได้ (ข่าว วิทยุ คำเล่าลือในฉาก) เสนอระดับ 4 เฉพาะเมื่อผู้ใช้ตั้งใจเป็นซีรีส์
2. **สถานที่** ใช้ `places` ใน canon (ระบุรหัส) หรือ "สถานที่ใหม่" พร้อมเหตุผลและตำแหน่งบนแผนที่ สถานที่ที่ต้องสร้างเป็น room ใน perspective ให้ระบุว่ากลับมาใช้ซ้ำในเรื่องอื่นได้ไหม
3. **ตัวละคร canon ที่ปรากฏ** (เช่น `wichai`) เฉพาะที่เรื่องต้องการ ตารางจุดสังเกต/เสียงต้องตรงกับ canon ห้ามใช้หน้า canon เป็นตัวเอกอื่น ตัวเอกประจำเรื่องต้องเปลี่ยนชื่อ + จุดเด่น + เสียงไม่ซ้ำเรื่องใกล้กัน
4. **ไม่ขัด hard canon** สถานะตัวละคร เหตุการณ์ ลำดับเวลา (`era`) ถ้าขัด ให้แก้เรื่อง ไม่แก้ canon (เว้นผู้ใช้สั่ง)
5. **สิ่งที่จะลง canon ใหม่** ข้อเท็จจริงและ thread ที่เรื่องนี้เพิ่ม/ตอบ (ต้องให้ผู้ใช้อนุมัติ)

กฎเหล็ก: ปมหลักต้องปิดในตัวเอง ไม่เฉลยปมของเรื่องอื่น ดูเดี่ยวๆ ได้ ถ้าเรื่องต้องดูเรื่องก่อนถึงจะเข้าใจ ให้ลดระดับ และอย่า bend เรื่องให้ตรงสถานที่ที่มีอยู่ ถ้าเรื่องดีกว่าเมื่อเป็นระดับ 0 ก็ปล่อยเป็นระดับ 0

## 2. Gap audit — วัดกับ Long-form checklist

ไล่ทุกข้อใน **Long-form checklist (gate for step 1)** ของ `longform-rules.md` ให้ ✓ / ✗ / (เดา) พร้อมเหตุผลหนึ่งบรรทัดต่อข้อที่ ✗ โดยเฉพาะ:
- cold open ภายใน 30–60 วินาที, midpoint 45–60%, reveal 80–90%, re-hook ทุก 60–90 วินาที (ลิสต์พร้อมเวลา)
- tracked device หนึ่งอย่าง, clue 6–10 จุด (แต่ละจุดวาง ≥ 3 ครั้ง ≥ 2 องก์ + มีช็อตคลี่), ตัวร้าย/คำตอบอยู่ในเฟรมตั้งแต่องก์ 1
- Concealment 9 ข้อ (clue มีงานบังหน้า, ผู้บรรยายไม่ชี้พิรุธของคนร้ายก่อนสลิป, ผู้ต้องสงสัยอื่น ≥ 2 คนที่มีความลับจริง, น้ำหนักกล้องเท่ากัน, casting tell, guess map, early-guess slack, ปก/ชื่อใช้แค่ cold open, cold read)
- Narrative clarity 5 ข้อ (ตรรกะชั้นเดียว, ผู้บรรยายเป็น anchor, Action-Motive-Cost, clue re-anchoring)
- Blind-spot 5 ข้อ (body-count, ตัวเอกไม่โง่, โลกภายนอกกดดัน, อารมณ์ตัวร้ายสม่ำเสมอ, Earned Catharsis)
- continuity facts เขียนเลขคณิตออกมา (ปี อายุ จำนวน ใครรู้อะไรเมื่อไร)
- plot hole ที่คนคอมเมนต์จิ้งได้ในประโยคเดียว

เรื่องที่อิงข้อเท็จจริงจริง (กฎหมาย การแพทย์ กระบวนการตำรวจ ประเพณี) ให้ตรวจ ถ้าไม่แน่ใจให้ค้นเว็บ และมาร์ก `✓ ตรวจแล้ว` หรือตัดทิ้ง

## 3. Fun pass

ทำตาม `.claude/story/fun-pass.md` ให้ผลเป็นข้อเสนอ 3 กลุ่ม (ควรทำ / แนะนำ / ทางเลือก) แยก [ของคุณ | ผมเพิ่ม | ผมตัด] ชัดเจน
ข้อเสนอต้องอยู่ในกรอบกฎเรื่องยาว ไม่เสนออะไรที่ผิด longform-rules และไม่ทิ้งสิ่งที่ prompt ตั้งใจไว้ รายละเอียดที่ผู้ใช้ใส่มาใน prompt (โทน ตัวละคร ฉาก ความชอบ) ถือเป็นข้อกำหนด ไม่ต้องถามซ้ำ

## 4. ส่งพิมพ์เขียวให้ตรวจ (ยังไม่สร้างไฟล์)

แสดงในแชต:
1. ผลลัพธ์ audit (ตาราง ✓/✗ สั้น ๆ + สิ่งที่แก้แล้ว)
2. ข้อเสนอ fun pass ให้ติ๊ก
3. ร่าง brief ตามรูปแบบ `brief-template.md` ครบทุกหัวข้อ: logline, twist, tracked device, ตาราง Speakers (voice role + symbol จาก `src/cast.json` ที่ไม่ retired ตามกฎ 12; ตัวที่เรื่องต้องการจริงแต่ไม่มีในคลัง ให้ระบุเป็น "ตัวใหม่" พร้อมเหตุผลว่าทำไมตัวเดิมใช้ไม่ได้ ดูข้อห้ามด้านล่าง), ตาราง Chapters พร้อมเวลาเป้าหมายและ re-hook, ตาราง Clues (cover → planted → pay-off), ตาราง Suspects and concealment, Sets/inserts (เสนอที่ที่ต้องสร้างเป็น room ใน perspective), Continuity checks, Blind-spot gate และหัวข้อ **Universe** (ระดับการเชื่อม · สถานที่ รหัส canon หรือ "ใหม่" · ตัวละคร canon ที่ปรากฏ · ผลเช็ก hard canon · สิ่งที่จะลง canon ใหม่ให้ติ๊กรับ-ตัด)
4. **ร่างคำบรรยายเปิด (cold open)** 5–8 บรรทัดภาษาไทย เป็นตัวอย่างน้ำเสียงเรื่อง (ยังไม่ใช่ story.json)
5. **การซ่อน twist** (แทน scorecard ให้คะแนนตัวเอง ซึ่งคนเขียนตัดสินเองไม่ได้): ตาราง Suspects, guess map 25 / 50 / 75 %, จุดแรกที่คนดูช่างสังเกตรู้คำตอบได้, role type ของคนร้ายเทียบกับสองเรื่องก่อน และผล cold read รอบ A บน beats (`.claude/story/cold-read.md`) เป็นตาราง จุดที่ยังอ่อนให้บอกตรงๆ ว่าติดอะไร ไม่ต้องให้คะแนน

จบด้วยคำถามเดียว: อนุมัติไหม / ติ๊กข้อเสนอไหนรับ-ตัด

## 5. หลังผู้ใช้อนุมัติ

1. เลือก slug (อังกฤษ เล็ก ขีดกลาง ไม่ซ้ำ `episodes/`) แจ้งผู้ใช้
2. `npm run new -- <slug> "ชื่อเรื่อง"` แล้วตั้ง `"format": "landscape"` และ `target` ใน story.json (นี่คือ step 0 ของ thai-long-story, แก้เฉพาะสองฟิลด์นี้ ห้ามใส่เนื้อเรื่อง)
3. เขียน brief ที่อนุมัติลง `episodes/<slug>/brief.md` ตาม template (รวมหัวข้อ Universe)
3b. อัปเดต `universe/canon.json` เฉพาะส่วนที่ผู้ใช้อนุมัติ: `episodes.<slug>` (link, place, era), `places` ใหม่, `events`, ตัวละคร `appears`, `threads` ที่เปิดหรือตอบ และถ้ามีสถานที่/กฎใหม่ ให้เพิ่มลง `universe/bible.md` ด้วย
4. หยุด รายงานว่า brief พร้อม แล้วถามว่าจะเริ่ม step 2 (เขียน story.json ทีละ chapter) ต่อเลยไหม ถ้าใช่ให้ invoke `thai-long-story` และทำตามนั้น (รวม `directing.md` ก่อนวางช็อต)

## ข้อห้าม
- ห้ามเขียนหรือแก้ `story.json` เกินสองฟิลด์ใน §5, ห้ามวาดฉาก, ห้ามเรียก voice/render (เสียเครดิต)
- ตัวละคร: เลือกจาก `src/cast.json` ที่ไม่ `retired` ก่อนเสมอ ห้ามใช้ตัว `retired` สร้างตัวใหม่ได้ **เฉพาะเมื่อเนื้อเรื่องต้องการจริงและไม่มีตัวใดในคลังใช้แทนได้** (เช่น บทที่ไม่มีอยู่เลย) แล้วแจ้งผู้ใช้ในพิมพ์เขียว ตอนลงมือสร้างให้ทำตาม `/twist-cast` และเพิ่มเข้า `src/cast.json` (กฎ 6 และ 12) ไม่ใช่วาดเฉพาะในตอน
- ห้ามคัดลอกกฎมาไว้ในไฟล์นี้ ถ้ากฎเปลี่ยนให้แก้ที่ `longform-rules.md`
- ข้อเสนอที่แตะ twist หรือแก่นเรื่อง ต้องให้ผู้ใช้ตัดสินเอง
- ห้ามคัดลอกกฎโลกหรือรายชื่อ canon มาไว้ในไฟล์นี้ ให้ชี้ไป `universe/` ห้ามเพิ่มหรือแก้ canon เองโดยผู้ใช้ไม่อนุมัติ และห้ามบังคับให้ทุกเรื่องเชื่อมกัน
