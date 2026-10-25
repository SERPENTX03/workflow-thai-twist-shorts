# Thai Twist Shorts

เวิร์กโฟลว์ทำ **คลิปสั้นแนวตั้ง (9:16) เรื่องสั้นหักมุมภาษาไทย** ด้วย [HyperFrames](https://hyperframes.heygen.com) — ไม่มีคนในคลิป เล่าแบบบุรุษที่สอง ("คุณ") ภาพสไตล์ภาพวาดแบนกลางคืน ซับไตเติลไทยตัวหนาไฮไลต์กล่องแดง การ์ดข้อมูล แผนที่มุมบน เสียงพากย์ไทย และดนตรี/เสียงประกอบที่สังเคราะห์ด้วยโค้ด

ออกแบบให้ทำงานคู่กับ **Claude Code** (หรือ coding agent อื่น): บอกไอเดียเรื่อง แล้ว agent จะเดินตามขั้นตอนใน `.claude/skills/thai-twist-short/` ตั้งแต่เขียนเรื่อง → animatic → วาดฉาก → เสียง → ตรวจ → เรนเดอร์

> A HyperFrames workflow for Thai vertical twist-ending short stories. Write `story.json`; scripts generate the timeline, captions, Thai voiceover and score; you (or your agent) draw the scenes.

## ต้องมีอะไรบ้าง

| เครื่องมือ | ใช้ทำ |
|---|---|
| Node.js 22+ | สคริปต์ทั้งหมด และ HyperFrames (`npx`) |
| ffmpeg + ffprobe (อยู่ใน PATH) | ตัดต่อเสียง วัดความดัง |
| คีย์ ElevenLabs (ค่าเริ่มต้น) หรือ Python 3 + `pip install edge-tts google-genai` | เสียงพากย์ไทย: ElevenLabs (ต้องมีคีย์ ดูหัวข้อ "เสียงพากย์"), `edge-tts` = บริการออนไลน์ของ Microsoft (ไม่ต้องมีคีย์), `google-genai` = เสียง Gemini (ต้องมีคีย์) — ทุกแบบต้องต่อเน็ต และข้อความพากย์จะถูกส่งไปที่บริการนั้น |
| Google Chrome | HyperFrames ใช้เรนเดอร์ |
| Claude Code (แนะนำ) | เดินเวิร์กโฟลว์ให้อัตโนมัติ |

ติดตั้ง skill ของ HyperFrames หนึ่งครั้ง (agent จะอ่านกฎการเขียน composition จากตรงนี้):

```bash
npx hyperframes skills update
```

## เสียงพากย์ (ElevenLabs เป็นค่าเริ่มต้น)

ตอนใหม่ใช้ชุดเสียงตายตัวใน [`.claude/skills/thai-twist-short/references/voices.md`](.claude/skills/thai-twist-short/references/voices.md): `male` (ผู้บรรยาย), `female`, `old_male`, `old_female` — `template/story.json` ตั้งไว้ให้แล้ว และกฎการเลือกเสียงต่อบรรทัดอยู่ในไฟล์นั้น ตัวอย่าง Vasko/Jessica ด้านล่างเป็นค่าเดิมของเครื่องมือ

1. สร้าง API key ที่ <https://elevenlabs.io/app/settings/api-keys> เปิดสิทธิ์ **Text to Speech: Access** (ถ้าอยากให้สคริปต์หา voice id จากชื่อ เปิด **Voices: Read** เพิ่ม)
2. ก๊อป `.env.example` เป็น `.env` แล้วใส่คีย์: `ELEVENLABS_API_KEY=คีย์ของคุณ` (`.env` อยู่ใน `.gitignore` ห้าม commit หรือแชร์)
3. เสียง **Vasko** เป็นเสียงจาก Voice Library: เปิดหน้าเสียงนั้นแล้วกด "Add to my voices" แล้วคัดลอก voice id ใส่ใน `scripts/eleven-voices.json` (`"Vasko": "<id>"`) หรือรัน `npm run voices -- vasko` เพื่อค้นหา id (ต้องมีสิทธิ์ Voices: Read) ส่วน **Jessica** เป็นเสียงมาตรฐาน มี id ใส่ไว้ให้แล้ว (ตรวจให้แน่ใจว่าตรงกับบัญชีคุณ)

```json
"voice": "male",
"voices": { "male": "eleven:Vasko", "female": "eleven:Jessica" },
"voiceModel": "eleven_v3"
```

- ช็อตที่อยากเปลี่ยนผู้พูด ใส่ `"voice": "female"` ในช็อตนั้น
- ตัวเลือกเสริม: `voiceModel` (ค่าเริ่มต้น `eleven_v3` ถ้าอ่านไทยไม่ดีให้ลองโมเดลอื่นของ ElevenLabs), `voiceLang` (เช่น `"th"`), `voiceSpeed`, `voiceSettings` (เช่น `{"stability":0.5}`)
- เครดิตคิดตามจำนวนตัวอักษร สคริปต์ **เก็บแคชเสียงของแต่ละบรรทัด** (`assets/vo/cache`) ถ้าแก้บทแค่บรรทัดเดียว จะเสียเครดิตเฉพาะบรรทัดที่เปลี่ยน
- ข้อความพากย์จะถูกส่งไปที่ ElevenLabs
- ใช้ voice id ตรงๆ ได้ (ไม่ต้องเพิ่มใน `eleven-voices.json`): `"eleven:MHPwHxLx0nmGIb5Jnbly"` — ตัวอย่างจริงอยู่ที่ `episodes/flood-canal-ep2/story.json` (ผู้บรรยายชาย + ป้าแดงเสียงหญิง)

### ใส่อารมณ์ให้แต่ละบรรทัด (`tone`, เฉพาะ `eleven_v3`)

ใส่ `"tone"` ในช็อต สคริปต์จะส่งเป็นแท็กนำหน้าบรรทัด เช่น `"whispers, scared"` → `[whispers] [scared] บรรทัดพากย์` (แคปชั่นบนจอไม่เปลี่ยน) ตั้งค่าเริ่มต้นทั้งตอนได้ด้วย `"voiceTone"` ระดับบนสุด

```json
"voice": "male",
"voices": { "male": "eleven:yq05eeRaHPMGuWTVpqeP", "female": "eleven:MHPwHxLx0nmGIb5Jnbly" },
"voiceModel": "eleven_v3",
"shots": [
  { "scene": "call", "beats": 4, "voice": "female", "text": "“ต้น… ใช่ต้นไหมลูก”", "tone": "whispers, trembling" },
  { "scene": "generator", "beats": 4, "text": "กฎข้อ 5\nปั่นไฟต้องอยู่[นอกอาคาร]", "tone": "urgent" },
  { "scene": "dark", "beats": 4, "style": "red", "text": "ป้าแดง\n{ไม่เคยส่งสัญญาณ}", "tone": "whispers" }
]
```

- แท็กที่ใช้ได้ดี: `whispers`, `softly`, `sad`, `scared`, `nervous`, `urgent`, `warm`, `relieved` (เป็นคำอังกฤษ ลองฟังก่อนใช้จริง ผลต่างกันตามเสียง)
- แท็กหลายตัวทำให้เสียงช้าลงและมีช่วงหยุด บรรทัดอาจยาวเกินช็อต (`⚠ OVER`) ลดแท็กเหลือคำเดียว ย่อบทด้วย `"vo"` หรือเพิ่มจังหวะ
- เสียงเดียวกันที่ใช้ `tone` ต่างกัน ลักษณะเสียงอาจต่างกันเล็กน้อย ถ้าอยากให้บรรทัดสองบรรทัดฟังเป็นคนเดียวกัน ใช้ `tone` เดียวกัน
- ใช้เสียงอื่นได้: Gemini `"gemini:Finn"` (ต้อง `pip install google-genai` และ `GEMINI_API_KEY`) หรือ edge-tts `"th-TH-NiwatNeural"` (ฟรี ไม่ต้องมีคีย์ ต้อง `pip install edge-tts`)

## เริ่มเร็ว

```bash
git clone <this-repo> thai-twist-shorts
cd thai-twist-shorts

npm run new -- my-story "ชื่อเรื่องของฉัน"   # สร้าง episodes/my-story จาก template
# แก้ episodes/my-story/story.json (หรือบอก Claude ให้เขียนจากไอเดียของคุณ)
npm run build -- episodes/my-story           # สร้าง animatic (ฉากที่ยังไม่วาดจะเป็น placeholder)
npm run audio -- episodes/my-story           # เสียงพากย์ + ดนตรี + build ใหม่
npm run check -- episodes/my-story           # ตรวจ + ชีตภาพสำหรับรีวิว
npm run final -- episodes/my-story           # เรนเดอร์ + ปรับความดัง -14 LUFS → renders/my-story-final.mp4
```

ดูตัวอย่าง/แก้ใน Studio (ในโฟลเดอร์ episode):

```bash
cd episodes/my-story
npx hyperframes preview
```

### ใช้กับ Claude Code

เปิด Claude Code ที่โฟลเดอร์นี้ แล้วพิมพ์ เช่น:

> ทำเรื่องสั้นหักมุม "ลิฟต์ชั้น 13" ชายหนุ่มกดลิฟต์ทุกคืนตีสอง… หักมุมว่า…

Claude จะใช้ skill `thai-twist-short` เอง: เสนอโครงเรื่อง + จุดหักมุม + ปมที่ฝังไว้ให้คุณอนุมัติ → เขียน `story.json` → animatic → วาดฉากทีละฉาก → เสียง → วนตรวจจนทุกเกณฑ์ ≥ 8 → เรนเดอร์

## โครงสร้าง

```
.claude/skills/thai-twist-short/   skill เวิร์กโฟลว์ + กฎ (เรื่อง, อาร์ตไดเรกชัน, ชุดฉาก, เสียง, การรีวิว)
scripts/                           new-episode · build · voice · score · audio · check · finalize
template/                          โปรเจกต์ HyperFrames ต้นแบบของทุก episode
  assets/kit/kit.css               สี ฟอนต์ ซับไตเติล การ์ด ชิป นาฬิกา
  assets/kit/cast.svg              ตัวละคร (คุณ, ผู้หญิง, หมอผี) — ทำเป็นเงาดำได้ด้วย .sil
  compositions/                    ฉากตัวอย่าง: ห้องกลางคืน+กระจก, แผนที่มุมบน, การ์ดข่าว
episodes/room-7/                   ตัวอย่างเรื่องเต็ม "ห้องเช่าเลขที่ 7" (story.json พร้อม animatic)
```

## story.json คือหัวใจ

ทุกช็อตอยู่ในไฟล์เดียว: ฉาก, จำนวนจังหวะ (75 BPM, 1 จังหวะ = 0.8 วินาที), ซับไตเติล, สไตล์ (ขาว/แดง), ความหลอน (`mood`), ดนตรี, เสียงประกอบ (`cues`)

```json
{ "scene": "news", "beats": 4, "style": "red", "text": "ผู้เช่าคนนั้น คือคุณ",
  "mood": 1, "voLead": 0.5, "cues": [[0, "bighit"]] }
```

รายละเอียดทุกฟิลด์: [`.claude/skills/thai-twist-short/references/story-json.md`](.claude/skills/thai-twist-short/references/story-json.md)

## กฎหลักของรูปแบบนี้

- เปิดเรื่องภายใน 2 วินาทีด้วยความผิดปกติที่มีตัวเลข/กฎ/เวลาชัดเจน
- ทุก 2–4 วินาทีต้องมีอะไรใหม่บนจอ
- ปมหักมุมต้องโผล่ให้เห็นก่อนถูกเฉลย 3–5 จุด (ไม่มีเงา, กระจกเลียนท่าแต่ไม่มีหน้า, ปฏิทินค้าง, จุดกลวงบนแผนที่…)
- สีเน้นมีสีเดียวคือแดง ใช้เฉพาะประโยคที่พลิกเรื่อง
- ก่อนเรนเดอร์ต้องผ่านการรีวิว 6 เกณฑ์ ≥ 8 คะแนน

อ่านต่อ: [story-rules](.claude/skills/thai-twist-short/references/story-rules.md) · [art-direction](.claude/skills/thai-twist-short/references/art-direction.md) · [scene-kit](.claude/skills/thai-twist-short/references/scene-kit.md) · [audio](.claude/skills/thai-twist-short/references/audio.md) · [review](.claude/skills/thai-twist-short/references/review.md)

## License

โค้ด MIT · ฟอนต์ Kanit และ IBM Plex Sans Thai ใช้สัญญาอนุญาต SIL OFL 1.1 (ไฟล์ OFL อยู่ข้างฟอนต์)
