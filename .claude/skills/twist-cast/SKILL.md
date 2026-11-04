---
name: twist-cast
description: Design new characters (people and pets) for a Thai twist-shorts story in the project's flat 2D house style — shared cast.svg symbols, relative heights, one trackable trait per character, pet frame. Use when the user says ออกแบบตัวละคร, สร้างตัวละครใหม่, เพิ่มสัตว์เลี้ยง, ตัวละครสไตล์เดิม, or /twist-cast.
argument-hint: "[บทบาท/ลักษณะตัวละคร เช่น 'ครูใหญ่ใส่แว่น']"
---

# ออกแบบตัวละคร (สไตล์ประจำช่อง)

Read `references/art-direction.md` → *Cast rules*, and `src/cast/source/cast.svg` before drawing anything.

## The house style (copy this when making someone new)

- Flat 2D, no outlines. Rounded rectangles for limbs/torso, a **big round head (r≈65)**, dot eyes, a tiny mouth, faint pink cheeks. Backgrounds supply the shading, not the figures.
- People: symbol frame `viewBox="0 0 200 520"`, feet on the bottom edge. Pets: `viewBox="0 0 300 340"`, feet on the bottom edge. Side-view animals may use their own frame (see `dog`, 320 × 220).
- Colours go through CSS variables with a fallback (`fill="var(--jacket, #6b6a3e)"`) so a scene can recolour or silhouette (`<Sprite silhouette>`). Add any new variable to the `SIL` list in `src/cast/Sprite.tsx` (and `SIL_VARS` in `src/kit/stage.tsx` for stage actors), and to `SpriteVars` if scenes set it.
- **One trackable trait per named character** (a hairstyle, a garment, a prop) — it doubles as a clue device. Keep the palette to ~5 colours plus **one** bright accent.
- **Relative height, never one height for all**: draw people at ≈ cm × 2.6 px (170 cm → 442 px); pets at the same scale (cat ≈ 150 px, beagle ≈ 205, dog ≈ 225). Auntie/child/elder are visibly shorter or taller than the lead.
- Pets: big head, round glossy eyes with a highlight, a collar or marking as the trait; the animal reacts before the humans.

## Steps

1. **Single Source of Truth:** Check `src/cast.json` first for available active characters. Ask (or infer from the story) role, age, height in cm, the one trait, the accent colour. Reuse an active (non-retired) symbol from `src/cast.json` (`lead-male-A/B`, `lead-female-A/B`, `villain-male-A/B`, `father-A/B`, `mother-A/B`, `brother-A/B`, `sister-A/B`, `police-A/B`, `teacher-A/B`, `cat-black`, `cat-orange`, `beagle`, `dog-patch`) when it already fits; recolour via variables (`vars`) or accessories instead of redrawing. **Never use legacy characters marked `"retired": true` (`man`, `woman`, `auntie`, `elder`, etc.) as a base character.**
2. For a new figure: copy the nearest symbol in `src/cast/source/cast.svg`, rename the id (kebab-case, unique), change shapes and variables. Add the height to `HEIGHT_CM` in `src/engine/theme.ts`. Improve shared things in `src/`, never inside one episode (hard rule 6).
3. Show the user a preview before using it: a design canvas (Artifact, Design type) or a throw-away scene snapshot. Wait for a yes; the user tunes colour, build, face.
4. Record the character in `series/<name>.md` (name, height, trait, symbol id, variables) if the story is a series.
5. Build the body from a shared one (`legs-pants`, `body-wide`, `body-skirt`, `body-kid`) so walk / run works for free (`src/cast/Rig.tsx`); a hand-drawn body needs its legs in a `display:var(--legs-rest,inline)` group and `data-rig="…"` on the symbol (see `woman`).
6. Add the id to `KEEP` in `scripts/svg-to-tsx.mjs`, run `node scripts/svg-to-tsx.mjs`, check `npm run gallery`, and look at the frames.

