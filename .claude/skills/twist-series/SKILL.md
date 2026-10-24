---
name: twist-series
description: Create or update a series bible for a Thai twist-shorts series — named cast with trackable traits, the animal companion, world rules, recurring sets and HUD counters, a 5-episode arc and open threads — saved as series/<name>.md. Use when the user says วางซีรีส์, ทำเป็นซีรีส์, วางโครงหลายตอน, ไบเบิลเรื่อง, หรือ /twist-series, and before /twist-next when no bible exists.
argument-hint: "[ชื่อซีรีส์ หรือ episodes/<slug> ที่จะใช้เป็น EP 1]"
---

# วางซีรีส์

Read `references/ref-library.md` (patterns 6 and 12) and `story-rules.md`. If an episode is given, read its `story.json` as EP 1.

Write `series/<kebab-name>.md` with exactly these sections:

```markdown
# <ชื่อซีรีส์>
Family: survival | haunting | ตำนาน · captionLook · bpm · voice
Logline ของทั้งซีรีส์ (1 ประโยค)

## Cast
| ชื่อ | บทบาท | ลักษณะที่ตามได้ (= clue device) | cast.svg symbol | สถานะ |
(lead, ≤ 3 named humans, 1 animal companion — the animal reacts before humans)

## World rules
กฎของโลกนี้ที่ห้ามแหกข้ามตอน (เช่น ไฟไม่กลับมา, ซอมบี้ได้ยินเสียง, ผีเข้าบ้านไม่ได้ถ้าไม่ขานรับ)

## Recurring sets and HUD
ฉากที่ใช้ซ้ำ (ไฟล์ scene ต้นฉบับ) · ตัวนับที่ต่อเนื่องข้ามตอน (วันที่, น้ำ ลิตร, แบต %)

## Knowledge taught (never repeat)
| EP | กฎ / ข้อเท็จจริง | ✓ checked |

## Episode arc
| EP | ชื่อตอน | คำถามที่ตอบ | หักมุม | cliffhanger → ตอนต่อไป |
(EP 1–5; escalation: place shrinks or threat grows each episode; EP 5 answers the series question)

## Open threads
สิ่งที่ปูไว้แล้วยังไม่เฉลย
```

Show the user the cast table and the 5-episode arc and get a yes. Then set `"bible": "series/<name>.md"` and `"series"` in every episode's `story.json` that belongs to it. Add any new cast symbol to `template/assets/kit/cast.svg` (never only in one episode).
