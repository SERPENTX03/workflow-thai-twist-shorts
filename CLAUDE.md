# Thai Twist Shorts — agent rules

This repo makes Thai vertical (9:16) and landscape twist-ending short stories with **Remotion** (TSX).

**For any request about an episode — a new story idea, writing, scenes, voice, sound, review or render — invoke the `thai-twist-short` skill first** (`.claude/skills/thai-twist-short/SKILL.md`). For a landscape long-form episode (`"format": "landscape"`, 10–25 min) invoke `thai-long-story` instead (`.claude/skills/thai-long-story/SKILL.md`). Where a skill disagrees with this file, this file wins. Before planning shots or drawing scenes, read `.claude/skills/thai-twist-short/references/directing.md`: you are the director and art director of every frame.

## Hard rules

1. `episodes/<slug>/story.json` is the single source of truth. Never hand-edit generated files: `episodes/<slug>/timeline.json`, `assets/voice.wav`, `assets/score.wav`, `src/episodes/index.ts`, `src/cast/CastSprite.tsx`.
2. Run scripts from the repo root: `npm run <new|timeline|audio|voice|score|fit|story|shots|look|chapter|check|qc|final|gallery|studio> -- episodes/<slug>`. `shots` audits camera-setup variety (`.claude/skills/thai-twist-short/references/cinematography.md`); `look` measures light and depth on the Board frames (`references/depth-light.md`; `check` runs it at the end).
3. After any change: `npm run check -- episodes/<slug>` (tsc + story-check + Board frames in `out/<slug>-board/`), then open the frames and look. A passing check is not proof it looks right.
4. Do not render a video (`npm run final`, `remotion render`) until you have looked at stills of the scenes you changed and told the user what the frames show.
   - While editing, use `remotion still` / Board frames only; never render to "see how it looks".
   - Render the full video once, after the frames pass, to check timing, voice sync and captions over time.
   - Exception: the user explicitly asks for a render.
5. Review loop before the final render: all seven scores in `references/review.md` ≥ 8 (long-form: per chapter, `thai-long-story/references/review-long.md`).
6. Shared things (cast, props, captions, kit components) live in `src/` — improve them there, never only inside one episode.
7. Deterministic only: no `Math.random()`, `Date.now()` or network in components; use `rnd()` from `src/engine/anim.ts`.
8. Ask before anything outward-facing (publishing renders, pushing to a remote).
9. Do not delete an episode's `assets/` (paid voice/SFX) or untracked files without asking.
10. Only the character who is actually speaking moves their mouth. `talk` goes only on the actor whose id is the shot's `who`; everyone else on screen (listeners, the near end of a phone call, anyone during narration) gets a listening face that fits the moment (`worried`, `sad`, `shock`…), never `talk`. When the speaker is off screen (a phone voice, a recording, a voice from another room), nobody on screen talks. The speaker's face matches what they are saying. `src/kit/stage.tsx` mutes every non-speaker and `npm run story` warns on a stray `talk` — fix the warning in story.json, don't ignore it.
11. **Motorcycle & riding posture (shot `021` standard):** For any motorcycle riding or parked motorcycle scene across all future projects, use the global `<SideRoadSet>` and `<Motorcycle>` from `src/kit/places.tsx` (registered in `src/gallery.json` under `places`: `highway-road`, `motorcycle-ride`, `motorcycle-parked`). When any character is riding a motorcycle, always use `<Motorcycle rider={{shirt, pants, skin, hair, face, vest}} />` (the side-riding sitting posture established in `ghost-money` shot `021`). This fixes the bike and the rider's posture, not the camera: shoot it from any angle (low by the wheel, over the shoulder, headlight on the road, the mirror).
12. **Cast single source of truth:** `src/cast.json` is the SINGLE SOURCE OF TRUTH for character selection, metadata, heights, voice roles, and outfits. Always cast from active, non-retired characters in `src/cast.json` (`lead-male-A/B`, `lead-female-A/B`, `villain-male-A/B`, `father-A/B`, `mother-A/B`, `brother-A/B`, `sister-A/B`, `police-A/B`, etc.). Never use legacy retired characters (`man`, `woman`, `auntie`, `elder`, `M1`...`B1`, `din`, etc., marked `"retired": true`). Whole-body pose symbols (`man-sit`, `man-crouch`, `man-back`, `woman-sit`, etc.) are only base pose shapes for sitting, crouching or lying down, while the character's base identity symbol must always come from `src/cast.json`.
13. **Costume & identity preservation across gallery assets & poses:** Whenever pulling props, vehicles, places, sets, or template poses (`man-sit`, `woman-sit`, `man-crouch`, `Motorcycle`, `CarInterior`, etc.) from the template gallery, NEVER leave the character wearing the template's generic/fallback clothing (such as the generic blue t-shirt from legacy `man-sit`). The character's ACTUAL outfit details defined in `src/cast.json` (such as `lead-male-A`'s zipped navy jacket, white t-shirt collar, chest pocket, wrist watch, hair style, eyebrows, signature patches) MUST be preserved and transferred onto the pose or scene component via `extra` layers, custom pose overlays, or explicit props. Characters must remain visually consistent in costume across all standing, sitting, driving, and action shots throughout the episode.
14. **You direct every shot** (`.claude/skills/thai-twist-short/references/directing.md`, both formats). Every camera shot is a picture you design, written first as its `note` in story.json (who does what with what, seen from where, lit by what), then built to match it. You choose the camera, size, angle, composition, set and light; any shot may be its own SVG/React component in `src/episodes/<slug>/` (the `what-if-studio` `dead-come-home` S1–S18 pattern), and `<Stage>` is a convenience, not a requirement. There is no class of "routine" shots built from a preset backdrop.
    - **Places, not backdrops:** build each recurring place once in perspective (interiors with `src/kit/room.tsx`: `makeRoom`, `RoomShell`, `RBox`, `standAt`) and shoot it from several positions — wide to learn the room, then medium, real close-ups (the head about half the frame, z ≈ 3–3.6 in 16:9), inserts, low and high angles. One flat elevation zoomed in and out is not coverage.
    - **Light from a source:** every set shot has a light you can point to in the frame (window, bulb, lamp, phone, headlight); mid-tones sink (`LightVeil`), the light pools, the face is the brightest thing near it, shadows run away from the light (`data.lightAt`, `CastShadow`). Bright is allowed; lit evenly from nowhere is not. The reveal is the darkest frame.
    - **No cardboard staging:** no character standing face-on with arms down at dead centre as the picture. Stage people doing something with something (sitting on the bed edge, crouched against a wall, back turned to a door, a hand on the bolt); the cast are front-facing sprites, so favour close-ups, inserts, over-the-shoulder, backs and silhouettes over full-body stands.
    - **Depth when the picture needs it:** midground / background / atmosphere in every set shot; a dark blurred foreground when there is a reason for one (watched, over the shoulder, trapped) — about a third of shots, not a blob stuck on every frame.
    - **Audits are questions, the picture decides:** `npm run shots` and `npm run look` print ✗ for missing notes, repeated framings, even light, shadow share; answer each ✗ on a shot you changed with a fix or one line of why. Numbers passing on a flat frame is a fail; a good frame with a reason beats a number.
15. **The gallery is a parts bin and a scale ruler, not a shot.** `src/gallery.json` / `/studio/index.html` cards stand a `man 170cm` at dead centre only to show an asset's size. Never copy that framing, and never feel bound to build a shot from gallery pieces: draw what the picture needs, then promote anything reusable into `src/kit/` and the gallery (rule 6). Rules 11–13 still hold for whatever you use: the motorcycle and rider design, the cast and their costumes. They fix *what* is drawn, never where the camera stands.

## Layout

```
src/
  index.ts, Root.tsx          registers <Id>, <Id>Board per episode + Cast / Faces / Props / Sets stills
  engine/                     story.ts (story.json -> shots), episode.tsx (defineEpisode), anim.ts, fonts.ts, theme.ts
  kit/Captions.tsx            captions with [gold] / {red} marks
  cast/                       CastSprite.tsx (GENERATED from source/cast.svg by scripts/svg-to-tsx.mjs), Sprite.tsx
  Gallery.tsx                 gallery compositions
  episodes/index.ts           GENERATED registry; <slug>/scenes.tsx (optional) = {sceneName: ShotComponent}
scripts/                      timeline, voice, score, sfx, fit, qc, story-check, check, finalize, new-episode, gallery, svg-to-tsx
studio/                       static gallery (index.html + manifest.js, generated by npm run gallery)
templates/story.json          starting story for npm run new
episodes/<slug>/              story.json, assets/ (voice, score, vo cache), timeline.json, renders/
public/                       fonts + <slug>/voice.wav, score.wav (linked by npm run timeline)
series/<name>.md              series bible
sfx-library/                  cached ElevenLabs SFX
```

## Commands

- `npm run dev` — static gallery at http://localhost:3431/studio/index.html (run `npm run gallery` when cast/kit images need refreshing). `npm run studio` — Remotion Studio on :3430.
- `npm run gallery` — renders reusable asset library (Cast, Places, Sets, Props, Poses, UI, Grades). Excludes episode board stills by default for maximum speed. Pass `--boards` or `--boards --episode=<slug>` if board stills are needed.
- `npm run archive <slug>` — archives completed episodes out of active Remotion bundling into `archive/<slug>/` (keeps bundling instant ~2s and prevents workspace bloat). Use `npm run archive -- --list` to view episodes or `npm run archive -- --restore <slug>` to reactivate.
- Gallery content: cast in `src/cast.json`, item lists in `src/gallery.json` (incl. the landscape stage kit: `world`, `places` (ready Thai locations, `src/kit/places.tsx`), `inserts`, `grades`; compositions `GWorld` `GPlaces` `GInserts` `GGrades` in `src/Gallery.tsx`), voice roles in `voices.json`. A new shared kit piece goes into the matching `gallery.json` list so it shows in the studio. `npm run voices` makes the voice previews (ElevenLabs credits; only changed lines). `npm run voice-list` searches your ElevenLabs voices.
- Thinking helpers live as project skills: `/twist-idea`, `/twist-next`, `/twist-hook`, `/twist-series`, `/twist-ref`, `/twist-doctor`, `/twist-cast`. They end at an approved outline or a report; building goes through `thai-twist-short`.
