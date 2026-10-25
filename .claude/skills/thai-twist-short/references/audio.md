# Audio

All sound is generated from `story.json`; nothing is downloaded or sampled except the TTS voice.

## Voice — `scripts/voice.mjs`

- **Casting is fixed by `references/voices.md`**: roles `male` (narrator), `female`, `old_male`, `old_female`. Every character line sets its role, narration never does, and no raw ids or new voices without owner approval.
- Three providers, chosen by the voice id prefix: `eleven:<Name or voice_id>` (ElevenLabs, key `ELEVENLABS_API_KEY` in `.env`; ids in `scripts/eleven-voices.json`, `npm run voices -- <name>` looks one up), `gemini:<Name>`, or a plain edge-tts voice id.
- **Acting (ElevenLabs v3 only)**: a shot's `"tone"` (or the episode default `voiceTone`) is sent as audio tags in front of the line, e.g. `"tone": "whispers, scared"` → `[whispers] [scared] …`. Tags are English words: `whispers`, `softly`, `sad`, `scared`, `nervous`, `tense`, `urgent`, `warm`, `crying`, `sighs`, `gasps`. Use them to follow the episode's emotional arc: calm narration early, tense in the problem, whisper on the reveal. The caption is unaffected.
- Every synthesized line is cached by (voice, settings, text) in `assets/vo/cache`, so re-running only pays for changed lines (credits are per character on ElevenLabs).
- edge-tts (Microsoft online neural voices). Needs internet; the line text is sent to Microsoft's read-aloud service. Install once: `pip install edge-tts` (if synthesis fails with HTTP 403, upgrade: `pip install -U edge-tts`).
- One line per shot (`vo`, default = caption without line breaks), silence trimmed, placed at `shot.start + voLead`.
- If a line is longer than its shot it is sped up, max 1.3×. Above that the script prints `⚠ OVER` — shorten the line or give the shot more beats. Never let a line run across a cut.
- All lines are laid on one track, `assets/voice.wav`, high-passed and normalised to −16 LUFS.

## Score — `scripts/score.mjs`

- **Drone**: low A + fifth, louder and noisier with `mood`; it drops to near silence for the 0.45 s before every `bighit` (the "breath before the reveal").
- **Heartbeat** on every beat of shots with `mood ≥ 0.8`.
- **Music box** (A minor motif) on every beat of shots with `music: true` — calm opening, the re-read, the sting.
- **SFX** from `cues`, on their own bus.
- **Ducking**: under each voice line, music −11 dB, SFX −5 dB, 60 ms attack / 300 ms release. The voice sits ~10 dB above the bed.
- Output `assets/score.wav`, normalised to −22 LUFS so it sits under the voice.

## Sync rules

- Cuts are on beats; put `hit` on beat 0 of a shot when the cut itself is the event.
- One `bighit` per film, on the reveal line. Use `hit` elsewhere, at most every other shot.
- Footsteps: 3–4 `step` cues spaced 0.7 beats apart.
- Give a big hit room: set that shot's `voLead` to ~0.5 so the voice comes after the impact.

## Delivery loudness — `scripts/finalize.mjs`

Renders with HyperFrames (`--quality looks`, CRF 16) and runs a two-pass `loudnorm` to **−14 LUFS integrated, −1.5 dBTP** → `renders/<slug>-final.mp4`. The video stream is copied, not re-encoded.
