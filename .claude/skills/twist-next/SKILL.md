---
name: twist-next
description: Plan the next episode of an existing Thai twist-shorts series — reads the last episode's story.json and the series bible, answers its cliffhanger, keeps cast, animal, rules and look consistent, escalates the threat and sets up the following cliffhanger. Use when the user says ช่วยคิดตอนต่อไป, ทำ EP ถัดไป, ภาคต่อ, ตอนที่ 2, หรือ /twist-next.
argument-hint: "[episodes/<slug> ของตอนล่าสุด]"
---

# ช่วยคิดตอนต่อไป

## 1. Load the series state

- The episode: `episodes/<slug>/story.json` (if not given, the most recently modified folder in `episodes/`). Read all captions, `series` (`name`, `ep`, `next`) and the last two shots (the cliffhanger and the card).
- The bible: `story.json → bible`, else `series/<series-name>.md`. If there is none, create one first with `/twist-series` using this episode as EP 1.
- Rules: `.claude/skills/thai-twist-short/references/story-rules.md` and `ref-library.md`.

Summarise in 5 lines: what the viewer knows, what they don't, the open question (`series.next`), the cast still alive, rules already taught.

## 2. Next-episode rules

- **Answer the cliffhanger in the first 10 s.** If EP 1 ended "ใครอยู่หน้าประตู", EP 2's hook shows the door. Recap at most one shot ("ตอนที่แล้ว…").
- **Same world, new pressure**: time moves on (วันที่ 1 → วันที่ 4), a resource runs lower, or the place changes (ห้อง → บันได → ดาดฟ้า).
- **Teach new knowledge** — never repeat a rule from earlier episodes; you may *use* an old rule to set up a new one.
- **Keep continuity**: names, traits, the animal, the HUD counters (same units, values that follow on), the palette of each set.
- **A new twist type**, different from last episode's.
- **End on a fresh question**, and fill `series.next` for the episode after.

## 3. Deliver 3 options

For each: ชื่อตอน · ฮุก (frame-0 text) · คำตอบของ cliffhanger เดิม · ความรู้ใหม่ 3 ข้อ · หักมุม · cliffhanger ใหม่. Recommend one.

After the user picks: write the full outline (same shape as `/twist-idea` step 3), then update the bible (episode list, open threads, cast status). Create the folder with `npm run new -- <slug>-ep<N> "ชื่อตอน"` and set `"series": { "name", "ep": N, "next" }` and `"bible"` in its `story.json`, copying `voice`, `voices`, `voiceStyle`, `captionLook` and `bpm` from the previous episode. Then continue with the `thai-twist-short` workflow.

Scenes that recur (the same room, the map) may be copied from the previous episode's `compositions/` — say which ones you reused.
