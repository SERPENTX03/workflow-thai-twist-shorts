# Voice cast

The fixed ElevenLabs voice cast for Thai Twist Shorts. `templates/story.json` carries this map;
copy it into every new episode and never write a raw voice id in a shot.

| Role (`voices` key) | Voice id | Who / Voice Name | Use for |
|---|---|---|---|
| `narrator` | `eleven:weRAVUYgqjjfUEEu5BsB` | Patinya (Calm Thai Narrator) | ผู้บรรยายเรื่องหลัก (Episode default) เสียงคมชัด สุขุม นิ่ง และเสถียรสูง |
| `lead_male` | `eleven:xYmBpJREC3WfqEFpbPvO` | Songkran (Calm & Humble) | ตัวเอกชายหลัก (Lead Male A/B, คุณ) |
| `lead_female` | `eleven:MYZYcGOqrkYQcwDunXl7` | HammyTH (Warm & Friendly) | ตัวเอกหญิง / นางเอกหลัก (Lead Female A/B, คุณแม่) |
| `male` | `eleven:xYmBpJREC3WfqEFpbPvO` | Songkran | บทชายทั่วไป (backward compatibility) |
| `female` | `eleven:MYZYcGOqrkYQcwDunXl7` | HammyTH | บทหญิงทั่วไป (backward compatibility) |
| `old_male` | `eleven:5KvpaGteYkNayiswuX2h` | Helmut (Deep Elderly) | ปู่, ตา, พระสงฆ์ผู้ใหญ่, ผู้เฒ่า, ชายชรา |
| `old_female` | `eleven:p2Wol3C7j3rHbfOrbL18` | Lisa (Gentle Elderly) | ย่า, ยาย, ป้า, หญิงสูงอายุ |
| `boy` | `eleven:yq05eeRaHPMGuWTVpqeP` | ToNCe (Chill Teen) | สามเณร, วัยรุ่นชาย, น้องชาย, เด็กหนุ่ม |
| `young_female` | `eleven:cgSgspJ2msm6clMCkdW9` | Jessica (Bright & Clear) | ช่างภาพสาว, หญิงสาวรุ่น, ครูหญิง, พี่สาว, น้องสาว, น้าสาว, อาสาว |
| `father` | `eleven:KhBRXgEQjvfdIyXOu7G3` | PapaAndy (Warm Native) | พ่อ, ลุง, ชายวัยกลางคนอบอุ่น มีความเป็นผู้นำ |
| `officer` | `eleven:JTfQv1rq84UdcXVunY5m` | AKE (Confident Pro) | ตำรวจ, นักสืบ, ครูชาย, เจ้าหน้าที่ทางการ |
| `casual_male` | `eleven:RwilAvCC3o05RLuACpAn` | Bankky (Casual Guy) | ช่างซ่อม, พี่ชาย, ชายหนุ่มคล่องแคล่ว, น้าชาย, อาชาย |
| `villain_male` | `eleven:Vl27Cllkuw8BhyPqus2n` | VASKO (Deep Ominous) | ตัวร้ายชาย, ชายลึกลับ, ฆาตกร, เสียงข่มขู่ทุ้มต่ำ |
| `villain_female` | `eleven:EXAVITQu4vr4xnSDxMaL` | Sarah (Mature & Cold) | ตัวร้ายหญิง, หญิงสาวเจ้าเล่ห์, ผู้บงการลับ |

```json
"voice": "narrator",
"voices": {
  "narrator": "eleven:weRAVUYgqjjfUEEu5BsB",
  "lead_male": "eleven:xYmBpJREC3WfqEFpbPvO",
  "lead_female": "eleven:MYZYcGOqrkYQcwDunXl7",
  "male": "eleven:xYmBpJREC3WfqEFpbPvO",
  "female": "eleven:MYZYcGOqrkYQcwDunXl7",
  "old_male": "eleven:5KvpaGteYkNayiswuX2h",
  "old_female": "eleven:p2Wol3C7j3rHbfOrbL18",
  "boy": "eleven:yq05eeRaHPMGuWTVpqeP",
  "young_female": "eleven:cgSgspJ2msm6clMCkdW9",
  "father": "eleven:KhBRXgEQjvfdIyXOu7G3",
  "officer": "eleven:JTfQv1rq84UdcXVunY5m",
  "casual_male": "eleven:RwilAvCC3o05RLuACpAn",
  "villain_male": "eleven:Vl27Cllkuw8BhyPqus2n",
  "villain_female": "eleven:EXAVITQu4vr4xnSDxMaL"
},
"voiceModel": "eleven_v3"
```

## Casting rules
1. Before writing `story.json`, list every speaking character: name | gender | age | role.
   Each gets exactly one role for the whole episode (and the whole series).
2. Every shot whose `vo` is a character's own words sets `"voice"` to that character's role.
3. Narration never sets `voice`; it uses the episode default `"narrator"` (`Patinya`).
   This cleanly separates the narrator's voice from the protagonist (`Songkran`), avoiding confusion.
4. Put quoted speech in its own shot. Never mix narration and a character's words in one `vo`.
5. Match age and archetype: an elderly character uses `old_male`/`old_female`, a child/teen uses `boy` or `young_female` with appropriate tone.
6. Only roles from this table.
