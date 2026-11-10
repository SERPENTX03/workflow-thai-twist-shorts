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
| `title` | — | Shown in the script reports. |
| `format` | `portrait` | `portrait` = 1080×1920 Shorts. `landscape` = 1920×1080 long-form; see the last section and the `thai-long-story` skill. |
| `target` | per format | `[min, max]` runtime in seconds that `story` and `qc` check against. Without it: a Short uses its `family`, else 45–130; landscape 1080–1800 (18–30 min). |
| `family` | — | Shorts only: `"survival"` (60–110 s), `"haunting"` (45–90 s) or `"folk"` (90–130 s) — the format family from `story-rules.md`; sets the runtime range when there is no `target`. |
| `clues` | — | The clue ledger: `{"sleeves": {"label": "แขนยาวทั้งที่ร้อน", "cover": "แอร์ห้องนี้หนาว"}, "door": {"label": "เพื่อนมองประตู", "decoy": true}}`. `cover` = the ordinary reason the story gives for the detail before the turn; `decoy: true` = points at the wrong answer. Shots tag them with `clue` / `pay` (below). See *Clues and mirror pairs*. |
| `bpm` | 75 | Beat grid. 75 BPM → 0.8 s per beat. Survival: 75–85; folklore: 60–70 with 4–6 beat shots. |
| `voice` | `th-TH-NiwatNeural` | ElevenLabs voice as `eleven:<Name or voice_id>`, or an edge-tts voice (`th-TH-NiwatNeural` male, `th-TH-PremwadeeNeural` female), or a Gemini voice as `gemini:<Name>` (key in `.env`). May be a role name from `voices`. |
| `voices` | — | Role → voice id. New episodes copy the map from `references/voices.md` (`male`, `female`, `old_male`, `old_female`). A shot sets `"voice": "female"` to switch speaker for its line. |
| `voiceModel`, `voiceLang`, `voiceSpeed`, `voiceSettings` | `eleven_v3`, —, —, `{stability:0.5, similarity_boost:0.75}` | ElevenLabs only: model id, language code (e.g. `th`), speed, and voice settings overrides. |
| `voiceStyle` | — | Gemini only: delivery instruction (e.g. calm everyday narration). `voiceRate`/`voicePitch` apply to edge-tts only. |
| `voiceRate`, `voicePitch` | `-8%`, `-6Hz` | Slightly slower and lower reads as more ominous. |
| `captionLook` | `bold` | `bold` = 74 px Kanit (survival, haunting). `folk` = 56 px line on a dark pill (slow folklore tales). |
| `series` | — | `{ "name": "เมื่อไฟดับทั้งเมือง", "ep": 1, "next": "ใครอยู่หน้าประตู" }`. Put the same words in the `next` end card's `data`; `/twist-next` reads it. |
| `bible` | — | Optional path to the series bible, e.g. `"series/blackout.md"` (cast, rules, open threads). |

## Shot

| Field | Default | Meaning |
|---|---|---|
| `scene` | required | Scene name → a key in `src/episodes/<slug>/scenes.tsx`, else a generic scene in `src/scenes/` (`room`, `rules`, `map`, `news`, `next`: only the `npm run new` starter uses these; a real episode writes its own). Unknown name = placeholder (`npm run story` warns). Each shot gets its own local frame `f`; carry a camera move across shots through `data` (e.g. `data.cam`). |
| `view` | — | Variant the scene draws for this shot (`"planks"`, `"side"`…). One scene component can switch on `view`, so a set is drawn once and reused. |
| `note` | — (`npm run shots` warns when a camera shot has none) | **The picture in one sentence**, written before anything is drawn: who does what with what, seen from where, lit by what — *"ช่องใต้ประตูระดับพื้น แสงเย็นลอดเข้ามา เงาเท้าสองข้างขยับ"*. The scene must match it on the Board frame (`directing.md` §1–2, §7). Not shown on screen. |
| `data` | — | Free-form object for the scene: cast strings, camera, HUD, counters (generic scenes document theirs in `scene-kit.md`). |
| `clue` | — | `"sleeves"` or `["sleeves", "date"]`: this shot **plants** that clue — it is visible on screen here, whether or not the line mentions it. An id from the top-level `clues`. |
| `pay` | — | `"sleeves"`: this shot **pays the clue off** (the reveal shows it, or a decoy is explained). |
| `data.mirror` | — | `"key"`: the same key on a planting frame and on the reveal shot that repeats it (same camera and staging, the missing piece now visible). The first shot with a key is the original. |
| `beats` | required | Length in beats. 3 = 2.4 s (normal), 4 = 3.2 s (key line / reveal), 2 = 1.6 s (fast re-read). |
| `text` | `""` | Caption. `\n` = line break. `[คำ]` = gold keyword, `{คำ}` = red keyword (marks are stripped from the voice). Empty = no caption (and no voice unless `vo` is set). |
| `style` | `plain` | `plain` (white) or `red` (accent box). |
| `vo` | = `text` | What the voice says, if different from the caption. `""` = silent shot. |
| `voice` | episode voice | A role from `voices` (`"female"`, `"old_male"`…) for this line only. Required on every character line spoken by a non-default role; `npm run audio` stops on an unknown role. |
| `tone` | `voiceTone` | ElevenLabs v3 audio tags for this line, comma-separated: `"whispers, scared"` → `[whispers] [scared] line`. See `audio.md`. |
| `voLead` | 0.12 | Seconds after the cut before the line starts. Raise it (0.5–0.9) to let a hit ring first. |
| `mood` | 0.5 | 0–1 dread. Drives drone level/noise; ≥ 0.8 adds a heartbeat on every beat. |
| `music` | false | Music-box motif on every beat of this shot (use for calm openings and the sting). |
| `cues` | `[]` | `[[beatOffset, type], ...]` — SFX placed at shot start + offset × beat. |

## End card shot

```json
{ "scene": "next", "beats": 4, "text": "", "vo": "ตอนต่อไป ใครอยู่หน้าประตู", "voLead": 0.4, "mood": 0.4, "music": true,
  "data": { "ep": "เมื่อไฟดับทั้งเมือง · EP 2", "title": ["ใครอยู่", "หน้าประตู"], "cta": "กดติดตามไว้ ไม่พลาดตอนต่อไป" } }
```

Leave `text` empty (the card carries the words). `next` is the generic card in `src/scenes/Next.tsx` (`example-next` still resolves to it).

## Cue types

`hit` (cut impact) · `bighit` (the reveal — the drone drops out 0.45 s before it) · `stamp` · `scratch` (pen strike) · `creak` (door) · `scrape` (object slides) · `step` (one footstep — use several) · `shriek` (thin dissonant tone) · `whoosh` (card/camera move) · `bell` (temple bell, sting) · `flip` (paper/calendar page) · `tick` (clock).

## Clues and mirror pairs

The clue table of the outline / `brief.md` is also written into story.json, so `npm run story` counts the plantings and shot numbers cannot drift when shots move:

```json
{ "clues": { "pinky": {"label": "นิ้วก้อยขวาสั้น", "cover": "อุบัติเหตุเครื่องกลึง เขาเล่าเอง ฉากนี้เป็นเรื่องกุญแจ"},
             "shoes": {"label": "รองเท้าหนังดำที่ปากซอย", "decoy": true} },
  "shots": [
    {"scene": "ins", "view": "key-ots", "clue": "pinky", "data": {"mirror": "key"}, "…": "…"},
    {"scene": "cctv", "view": "hatch-cctv-reveal", "pay": "pinky", "data": {"mirror": "key"}, "…": "…"}
  ] }
```

`npm run story` prints the ledger (each clue: planted shots → pay shot; each mirror key: original → mirrors) and warns when:

- a clue is planted fewer than 3 times before its pay-off, has no pay-off, or (long-form) sits in one chapter only;
- every planting is its own insert (`-ins` / `-ecu`): one must be in passing, inside a shot about something else;
- a clue has no `cover`, or a decoy is never explained (`pay`);
- the count is outside 3–5 (Shorts) / 6–10 (long-form), or a Short has no decoy;
- a `data.mirror` key is on one shot only, or the mirror's camera centre is not the original's.

A tag used on a shot but not declared in `clues` is an error (a typo). The tags are not shown on screen and cost nothing: add them while writing the shots, and keep `brief.md`'s table as the readable copy.

## Generated files (don't edit)

- `timeline.json` — written by `npm run timeline` (last step of `audio`): absolute shot `start`/`dur` in seconds, chapters (with frame ranges), the audio tracks, and the voiced lines (`vo[]`: shot, start, dur). Scenes animate against their own local frame `f`, not these.
- `src/episodes/index.ts` — the episode registry, rewritten by `new` / `timeline` / `check`.
- `assets/vo/*`, `assets/voice.wav`, `assets/score.wav`, `beats.json` — rebuilt by `npm run audio`; `public/<slug>/` holds links to the two wavs.

## Long-form landscape (`"format": "landscape"`)

Workflow and rules: the `thai-long-story` skill. Fields:

| Field | Where | Meaning |
|---|---|---|
| `format` | top | `"landscape"` → 1920×1080, subtitles in the bottom band (`Caption` with `landscape`, max 2 lines, ≤ ~42 chars), runtime target 1080–1800 s (18–30 min). Default `"portrait"` keeps every Shorts rule. `target: [min, max]` overrides the range. |
| `voiceTempo` | top (or `tempo` per shot) | Base speed for every voiced line, e.g. `1.1` when a slow TTS read makes the film run long. `voice` applies it, `fit` sizes shots with it. No re-synthesis (and no credits): lines stay cached. |
| `breath`, `switchBreath`, `minBeats`, `fitStep` | top | `npm run fit -- episodes/<slug>` sizes every voiced shot to its measured line: voLead + line + 0.15 + breath (+ switchBreath when the next line has another `who`), rounded up to `fitStep` beats, plus the shot's `hold`. Run voice first; lines are cached, so re-running costs nothing. |
| `chapter` | shot | `"ชื่อบท"` starts a chapter on this shot; it runs until the next. Shots before the first marker are chapter 0. Written to `timeline.json` → `chapters`; `npm run chapter` lists them, renders one chapter's Board sheets or preview, and prints YouTube chapter lines. |
| `who` | shot | Who speaks (`non`, `monk`…; default narrator). Used by `fit` (switch breath) and read by scenes for talk mouths (`talkShape` in `src/kit/stage.tsx`): only the actor whose id equals `who` moves its mouth, so put `talk` on the speaker alone (CLAUDE.md rule 10). `voice` still picks the TTS role. |
| `hold` | shot | Extra beats after the line (time to look at a clue). |
| `data.cast`, `data.cam` | shot | Landscape stage staging: actor strings like `"non@900 sit worried talk arm=r-hold prop=flashlight"` and a camera `[zFrom, zTo, cx, cy]` — format in `src/kit/stage.tsx`. |
| `fx` | shot | `"phone"` (band-limited call) or `"muffled"` (through a steel wall); same voice, only the sound changes. |
| `hush` | shot | The drone fades out for a held silence. |
