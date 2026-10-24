# Thai Twist Shorts — agent rules

This repo makes Thai vertical (9:16) twist-ending short stories with HyperFrames.

**For any request about an episode — a new story idea, writing, scenes, voice, sound, review or render — invoke the `thai-twist-short` skill first** (`.claude/skills/thai-twist-short/SKILL.md`). It owns the format and the step-by-step workflow; load `/hyperframes-core` before writing composition HTML.

## Hard rules

1. `episodes/<slug>/story.json` is the single source of truth. Never hand-edit `index.html`, `compositions/captions.html`, `timing.json`, `assets/voice.wav`, `assets/score.wav` — they are regenerated.
2. Run scripts from the repo root: `npm run <new|build|audio|voice|score|check|final> -- episodes/<slug>`.
3. After any change: build, then look at frames (`npx hyperframes snapshot --at …` inside the episode). A passing check is not proof it looks right.
4. Review loop before the final render: all seven scores in `references/review.md` ≥ 8.
5. `template/` is the starting point for every episode. Improve shared things (kit.css, cast.svg, example scenes) there, never only inside one episode.
6. Deterministic only: no `Math.random()`, `Date.now()` or network in compositions.
7. Ask before anything outward-facing (publishing renders, pushing to a remote).

## Layout

```
.claude/skills/thai-twist-short/   workflow skill + references (story, art, scene kit, audio, review)
scripts/                           new-episode, build, voice, score, audio, check, finalize
template/                          HyperFrames project every episode is copied from
  assets/kit/                      kit.css (tokens + components), cast.svg (characters), fonts (OFL)
  compositions/                    _placeholder + example scenes (example-room, example-map, example-news)
episodes/<slug>/                   one HyperFrames project per episode
series/<name>.md                   series bible: cast, animal, world rules, episode list, open threads
```

## Commands

Thinking helpers live as project skills next to the workflow skill: `/twist-idea` (ช่วยคิดไอเดีย), `/twist-next` (ช่วยคิดตอนต่อไป), `/twist-hook` (ฮุก/ชื่อเรื่อง), `/twist-series` (วางซีรีส์), `/twist-ref` (วิเคราะห์คลิป ref), `/twist-doctor` (ตรวจเรื่องก่อนวาด). They end at an approved outline or a report; building always goes through `thai-twist-short`.
