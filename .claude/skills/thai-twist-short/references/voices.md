# Voice cast

The only ElevenLabs voices new episodes may use. `template/story.json` already carries this map;
copy it unchanged into every new episode and never write a raw voice id in a shot.

| Role (`voices` key) | Voice id | Who | Use for |
|---|---|---|---|
| `male` | `eleven:xYmBpJREC3WfqEFpbPvO` | adult man | narrator (episode default), adult male characters |
| `female` | `eleven:MYZYcGOqrkYQcwDunXl7` | adult woman / girl | every female character who is not elderly |
| `old_male` | `eleven:5KvpaGteYkNayiswuX2h` | elderly man | grandfathers, old fishermen, monks, village elders |
| `old_female` | `eleven:p2Wol3C7j3rHbfOrbL18` | elderly woman | grandmothers, old aunties, elderly neighbours |

```json
"voice": "male",
"voices": {
  "male": "eleven:xYmBpJREC3WfqEFpbPvO",
  "female": "eleven:MYZYcGOqrkYQcwDunXl7",
  "old_male": "eleven:5KvpaGteYkNayiswuX2h",
  "old_female": "eleven:p2Wol3C7j3rHbfOrbL18"
},
"voiceModel": "eleven_v3"
```

Existing episodes keep the voices they were made with; apply this cast to new work (or when an episode is deliberately remade).

## Casting rules
1. Before writing `story.json`, list every speaking character: name | gender | age | role.
   Each gets exactly one role for the whole episode (and the whole series).
2. Every shot whose `vo` is a character's own words sets `"voice"` to that character's role.
   A woman's line without `"voice": "female"` (or `old_female`) is a bug, even one word.
3. Narration never sets `voice`; it uses the episode default `male`.
   A narrated sentence about a woman stays narration; only quoted speech switches voice.
4. Put quoted speech in its own shot. Never mix narration and a character's words in one `vo`.
5. Match age, not just gender: an elderly character (e.g. ป้าแดง, ยาย, ตา) uses `old_male`/`old_female`, not the adult voice.
6. Children have no dedicated voice. Prefer narrating a child's words, or use `female` with tone
   `"childlike, small voice"` and listen before approving.
7. Phone calls, radio and ghost voices stay in the speaker's own role; vary `tone` (`whispers`, `trembling`), not the voice.
8. Only roles from this table. A new voice needs owner approval after a listening test,
   then a new row here before any episode uses it.

## Acting (`tone`)
- Every voiced shot gets a `tone` (English ElevenLabs v3 tags, see `audio.md`).
- Tone follows the arc: calm narration early, tense in the problem, whisper on the reveal; urgency only on the line that carries it.
- Elders: slower and warmer (`slowly, warm`); fear or grief on the line that carries it, not every line.
- At most three tags per line. Avoid tags that fight the voice (`deep voice` on `female`).
- Never use tone to fake a different gender or age; switch role instead.

## Listening check (after `npm run audio`)
Play `assets/voice.wav` (or the per-line files in `assets/vo`) and confirm for each speaking character:
right gender, right age, consistent voice across shots, tone fits the moment, Thai pronunciation clear.
Regenerate changed lines before approving the preview.
