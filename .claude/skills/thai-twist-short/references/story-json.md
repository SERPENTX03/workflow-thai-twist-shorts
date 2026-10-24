# story.json

```json
{
  "title": "ห้องเช่าเลขที่ 7",
  "bpm": 75,
  "voice": "th-TH-NiwatNeural",
  "voiceRate": "-8%",
  "voicePitch": "-6Hz",
  "shots": [
    { "scene": "exterior", "beats": 3, "style": "red", "text": "ห้อง 7\nค่าเช่าถูกผิดปกติ",
      "mood": 0.3, "music": true, "cues": [[0, "hit"], [0.6, "stamp"]] }
  ]
}
```

## Top level

| Field | Default | Meaning |
|---|---|---|
| `title` | — | Shown in the build report and the HTML title. |
| `bpm` | 75 | Beat grid. 75 BPM → 0.8 s per beat. Keep 75 unless the user asks for a faster cut. |
| `voice` | `th-TH-NiwatNeural` | edge-tts voice (`th-TH-NiwatNeural` male, `th-TH-PremwadeeNeural` female), or a Gemini voice as `gemini:<Name>` (key in `.env`). May be a role name from `voices`. |
| `voices` | — | Role → voice id, e.g. `{"male":"gemini:Finn","female":"gemini:Leda"}`. A shot can set `"voice": "female"` to switch speaker for its line. |
| `voiceStyle` | — | Gemini only: delivery instruction (e.g. calm everyday narration). `voiceRate`/`voicePitch` apply to edge-tts only. |
| `voiceRate`, `voicePitch` | `-8%`, `-6Hz` | Slightly slower and lower reads as more ominous. |

## Shot

| Field | Default | Meaning |
|---|---|---|
| `scene` | required | Scene name → `compositions/scene-<scene>.html`. Consecutive shots with the same scene share one clip, so camera moves can run across them. Missing file = placeholder. |
| `beats` | required | Length in beats. 3 = 2.4 s (normal), 4 = 3.2 s (key line / reveal), 2 = 1.6 s (fast re-read). |
| `text` | `""` | Caption. `\n` = line break. Empty = no caption (and no voice unless `vo` is set). |
| `style` | `plain` | `plain` (white) or `red` (accent box). |
| `vo` | = `text` | What the voice says, if different from the caption. `""` = silent shot. |
| `voLead` | 0.12 | Seconds after the cut before the line starts. Raise it (0.5–0.9) to let a hit ring first. |
| `mood` | 0.5 | 0–1 dread. Drives drone level/noise; ≥ 0.8 adds a heartbeat on every beat. |
| `music` | false | Music-box motif on every beat of this shot (use for calm openings and the sting). |
| `cues` | `[]` | `[[beatOffset, type], ...]` — SFX placed at shot start + offset × beat. |

## Cue types

`hit` (cut impact) · `bighit` (the reveal — the drone drops out 0.45 s before it) · `stamp` · `scratch` (pen strike) · `creak` (door) · `scrape` (object slides) · `step` (one footstep — use several) · `shriek` (thin dissonant tone) · `whoosh` (card/camera move) · `bell` (temple bell, sting) · `flip` (paper/calendar page) · `tick` (clock).

## Generated files (don't edit)

- `timing.json` — absolute shot times, and per scene clip the **local** time each shot starts (`scenes[].local[].at`). Animate scenes against these.
- `index.html`, `compositions/captions.html` — rebuilt by `npm run build`.
- `assets/vo/*`, `assets/voice.wav`, `assets/score.wav`, `beats.json` — rebuilt by `npm run audio`.
