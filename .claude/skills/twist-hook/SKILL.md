---
name: twist-hook
description: Write and test hooks, titles and cover text for a Thai twist-shorts episode — the frame-0 caption, the first 2 shots, the post title and the thumbnail line — following the hook patterns of high-view reference clips. Use when the user says ช่วยคิดฮุก, ช่วยตั้งชื่อเรื่อง, ชื่อคลิป, แคปชั่นโพสต์, ปก, หรือ /twist-hook.
argument-hint: "[episodes/<slug> หรือ ไอเดียเรื่อง]"
---

# ช่วยคิดฮุก / ชื่อเรื่อง

Read the episode's `story.json` (or the idea the user gave) and `references/ref-library.md` → patterns 1, 3, 4.

## Hook patterns that worked in the references

| Pattern | Example |
|---|---|
| ถ้า + ภัย + ที่ที่คนรู้จัก | "ถ้าซอมบี้บุกตอนคุณเรียนอยู่" |
| เหตุการณ์ใหญ่ + ผลเล็กที่ใกล้ตัว | "ไฟดับทั้งกรุงเทพฯ… แล้วมันไม่กลับมาอีกเลย" |
| คำสั่งห้าม | "อย่าวิ่งลงบันไดตามเพื่อน" |
| ตัวเลขที่ผิดปกติ | "ห้อง 7 ค่าเช่าถูกผิดปกติ" |
| ตำนาน + ชื่อคน | "กลางดึก มีคนเรียกยายแพง" |

## Deliver

1. **6 frame-0 captions** (≤ 2 lines, ≤ ~18 characters per line), at least 3 patterns. For each say what is on screen at frame 0 and what moves by 0.5 s. Mark `[gold]`/`{red}` keywords.
2. **Shot 2 line** for the top 2 — it must raise a question, not explain.
3. **5 post titles** (≤ 40 characters, no clickbait that the clip doesn't deliver) and **3 cover lines** (≤ 3 words, readable on a phone grid).
4. Recommend one set. Before writing it into `story.json`, show the change and ask.

If the user approves, edit `story.json` shots 0–1 only, then run `npm run audio -- episodes/<slug>` so voice and timing follow.
