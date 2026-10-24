---
name: twist-idea
description: Brainstorm new episode ideas for this Thai twist-shorts channel — survival "ถ้า…" scenarios, haunting twists, Thai folklore — scored against the patterns of high-view reference clips, then turn the chosen one into a logline, twist, clue list and fact list. Use when the user says ช่วยคิดไอเดีย, คิดเรื่องใหม่, ขอไอเดียคลิป, หรือ /twist-idea, with or without a theme.
argument-hint: "[ธีม หรือ สถานที่ เช่น 'น้ำท่วม' 'รถไฟฟ้า' (ไม่ใส่ก็ได้)]"
---

# ช่วยคิดไอเดีย

Read first: `.claude/skills/thai-twist-short/references/ref-library.md` and `story-rules.md`. Also list `episodes/` and `series/` so you don't repeat a premise that already exists.

## 1. Generate 8 raw premises, keep the best 5

Mix the families: at least 3 survival "ถ้า…", 1 haunting twist, 1 ตำนานไทย. Build each from:

- **A Thai place the viewer knows**: ห้องเรียน ม.4, คอนโดชั้น 23, BTS ค้างกลางราง, ร้านสะดวกซื้อ 24 ชม., หมู่บ้านริมคลอง, รพ.ตอนตีสอง, ค่ายลูกเสือ, หอพักมหาลัย, ตลาดน้ำ, โรงงาน
- **A threat with rules**: ไฟดับทั้งเมือง, น้ำท่วม, ฝุ่น PM สูงจนออกจากบ้านไม่ได้, ลิฟต์ค้าง, ซอมบี้/โรคระบาด, หลงป่า, คลื่นความร้อน, ผีที่มีกฎ
- **Usable knowledge** that the story can teach (water, air, doors, crowds, heat, first aid basics, how a building works)
- **A twist type** from `story-rules.md` (the danger is already inside, the rule protected the thing, you are the ghost, time slip, identity swap)

## 2. Score each of the 5 (0–2 each, max 14)

| Criterion | 2 = |
|---|---|
| Hook | place + threat in ≤ 12 Thai characters, readable at frame 0 |
| Relatable | most Thai viewers have stood in that place |
| Knowledge | ≥ 5 true, checkable facts or rules the story can show as visuals |
| Twist | fair, physical clue, re-read works |
| Visual variety | needs ≥ 4 shot types (set, close-up, diagram, map, card…) |
| Series potential | the ending opens an obvious next question |
| Fresh | not already in `episodes/` or a stock creepypasta |

Show the user a table: ชื่อเรื่อง · ครอบครัว (survival/haunting/ตำนาน) · ฮุก (frame 0 text) · หักมุมใน 1 ประโยค · คะแนน. Mark your pick and why in one line.

## 3. After the user picks one

Write a one-screen outline:

- ชื่อเรื่อง + logline (1 ประโยค) + twist (1 ประโยค)
- Format family, target length, `captionLook`
- Cast: lead, ≤ 2 named friends, the animal companion, each with one trackable trait
- Rules (กฎข้อ 1–3) and **facts** — mark each fact `✓ checked` (search when unsure) or drop it
- Clues: 3–5, each with where it is planted (×3) and where it pays off
- Act-by-act beats (≈ shot count per act, per `story-rules.md`)
- Ending: twist line (≤ 20 characters) + cliffhanger + ตอนต่อไป title if it is a series

Get a yes, then hand off to the `thai-twist-short` workflow at step 0 (`npm run new -- <slug> "ชื่อเรื่อง"`). If the user wants a series, run `/twist-series` before writing `story.json`.

Don't write `story.json` or draw scenes inside this skill.
