# Cast library — Single Source of Truth: `src/cast.json`

**`src/cast.json` is the SINGLE SOURCE OF TRUTH for all characters.**
The vector drawings live in `src/cast/source/cast.svg` and are generated into `src/cast/CastSprite.tsx` (`node scripts/svg-to-tsx.mjs`). See all active characters in the studio: `npm run gallery` → open `studio/index.html`.

> [!IMPORTANT]
> **Always cast from active (non-retired) characters in `src/cast.json`.**
> Legacy characters (`man`, `woman`, `auntie`, `elder`, `M1`–`B1`, `din`) are marked `"retired": true` in `src/cast.json` and must NOT be used as the base character for any new story.

**One rule for every overlay:** hide the default part first, then layer exactly one replacement. `Sprite` props: arms → `hideArmL` / `hideArmR` (see `hands-poses.md`), face → `hideFace`, mouth only → `hideMouth`; the replacement goes in `layers`. Never stack a second pair of eyes, a second mouth or a second hand on top of the default one. On the landscape stage, actor strings (`src/kit/stage.tsx`) do the hiding for you.

## Active Cast by Role (from `src/cast.json`)

All active adult characters use `viewBox="0 0 200 520"` (height ≈ cm × 2.6 px); children use `200 420`. Walking and running poses work dynamically for every person through the jointed rig (`src/cast/Rig.tsx`).

### ตัวเอก (Leads)
| Symbol | Height | Role | Voice role | Description & Signature Trait |
|---|---|---|---|---|
| `lead-male-A` | 170 cm | lead male | `lead_male` | ผมสั้นปัดข้าง, แจ็กเก็ตซิปสีน้ำเงินสวมทับเสื้อยืดขาว, นาฬิกาข้อมือซ้าย |
| `lead-male-B` | 170 cm | lead male | `lead_male` | ผมทูบล็อกแสกข้าง, แจ็กเก็ตยีนส์, กระเป๋าสะพายข้างหนัง, ไฝที่แก้มขวา |
| `lead-female-A` | 160 cm | lead female | `lead_female` | ผมบ๊อบติดกิ๊บเหลือง, คาร์ดิแกนเหลืองมัสตาร์ดปกบัวครีมผูกโบว์, กระโปรงจีบ |
| `lead-female-B` | 160 cm | lead female | `lead_female` | ผมดังโงะครึ่งหัว, แจ็กเก็ตฟิลด์สีชมพูกะปิ, กระเป๋าสะพายข้าง |

### ตัวร้าย (Villains)
| Symbol | Height | Role | Voice role | Description |
|---|---|---|---|---|
| `villain-male-A` | 175 cm | villain male | `villain_male` | ชายมาดเนี้ยบ เสื้อเชิ้ตดำ/สูท |
| `villain-male-B` | 180 cm | villain male | `villain_male` | ชายร่างใหญ่ เสื้อโปโลเข้ม/แจ็กเก็ต |
| `villain-female-A` | 168 cm | villain female | `villain_female` | หญิงมาดเฉียบ ผมรวบตึง ชุดสูทดำ |
| `villain-female-B` | 165 cm | villain female | `villain_female` | หญิงดูมีฐานะ ลึกลับ เดรสเข้ม |

### พ่อแม่ & ญาติผู้ใหญ่ (Parents & Family)
| Symbol | Height | Role | Voice role | Description |
|---|---|---|---|---|
| `father-A` | 170 cm | father | `father` | แว่นเหลี่ยม, ผมแสกข้างแซมขาว, เชิ้ตคอปกผ้าฝ้ายเขียวอมเทา |
| `father-B` | 172 cm | father | `father` | ชายวัยกลางคนร่างหนา เสื้อคอปกแขนสั้น |
| `mother-A` | 160 cm | mother | `old_female` | เสื้อคอปกสุภาพ กางเกง/ผ้ากันเปื้อน |
| `mother-B` | 158 cm | mother | `old_female` | เสื้อลูกไม้/ลายดอก กระโปรงยาว |
| `uncle-family-A/B` | 168–172 cm | uncle | `old_male` | ลุงร่างท้วม / ลุงชาวบ้าน |
| `aunt-family-A/B` | 156–158 cm | aunt | `old_female` | ป้าเสื้อลายดอก / ป้าชาวบ้าน |
| `na-male-A/B` / `na-female-A/B` | 158–170 cm | uncle/aunt | `male`/`female` | น้าชาย / น้าสาว |
| `ar-male-A/B` / `ar-female-A/B` | 158–170 cm | uncle/aunt | `male`/`female` | อาชาย / อาสาว |

### พี่น้อง & เด็ก (Siblings & Youth)
| Symbol | Height | Frame | Voice role | Description |
|---|---|---|---|---|
| `brother-A` | 170 cm | 200×520 | `casual_male` | หมวกแก๊ปแดงเลือดหมู, สตรีทแจ็กเก็ตสีกรมท่าแถบขาว-แดง |
| `brother-B` | 172 cm | 200×520 | `casual_male` | เสื้อฮู้ดดี้สตรีท |
| `sister-A` | 158 cm | 200×520 | `young_female` | เปียเดี่ยวผูกโบว์ชมพูพาดไหล่, เสื้อกั๊กไหมพรมเขียวทับเชิ้ตขาว |
| `sister-B` | 160 cm | 200×520 | `young_female` | เสื้อสเวตเตอร์วัยรุ่น |
| `younger-brother-A/B`| 120–125 cm | 200×420 | `boy` | น้องชาย เด็กประถม ขาสั้น |
| `younger-sister-A/B` | 120–125 cm | 200×420 | `young_female` | น้องสาว เด็กประถม ผมเปียสองข้าง |

### ปู่ ย่า ตา ยาย & พระ (Elders & Religious)
| Symbol | Height | Role | Voice role | Description |
|---|---|---|---|---|
| `maternal-grandfather-A/B` | 162–165 cm | grandfather | `old_male` | ตา เสื้อม่อฮ่อม ผ้าขาวม้าคาดเอว / เชิ้ตลำลอง |
| `maternal-grandmother-A/B` | 152–154 cm | grandmother | `old_female` | ยาย เสื้อคอกระเช้า / ผ้าซิ่น |
| `paternal-grandfather-A/B` | 164–166 cm | grandfather | `old_male` | ปู่ สวมแว่น / เสื้อผ้าฝ้าย |
| `paternal-grandmother-A/B` | 154–156 cm | grandmother | `old_female` | ย่า ผมดัดสั้น / สไบ |
| `monk` / `novice` | 160 / 140 cm | monk/novice | `old_male` / `boy` | พระสงฆ์ห่มจีวร / เณร |

### อาชีพ (Occupations)
| Symbol | Height | Role | Voice role | Description |
|---|---|---|---|---|
| `police-A` | 170 cm | officer | `officer` | ร้อยเวร สวมหมวกหม้อตาล เครื่องแบบสีกากีติดอินทรธนูและสายยงยศ |
| `police-B` | 175 cm | officer | `officer` | สายตรวจร่างใหญ่ สวมหมวกแก๊ป เสื้อแขนสั้น วิทยุติดบ่า เข็มขัดสนาม |
| `mechanic-A/B` | 170–172 cm | mechanic | `casual_male` | ช่างยนต์ ชุดหมี/กางเกงช่าง |
| `photographer-A/B` | 162–170 cm | photographer | `casual_male` | ช่างภาพ มีสายคล้องกล้อง |
| `detective-A/B` | 168–174 cm | detective | `officer` | นักสืบ / ตำรวจนอกเครื่องแบบ |
| `teacher-A/B` | 160–170 cm | teacher | `female`/`male` | ครู เครื่องแบบกากี / สูทครู |

### สัตว์เลี้ยง & ฝูงชน (Pets & Crowd)
| Symbol | Frame | Description |
|---|---|---|
| `crowd` | 640×520 | เงาฝูงชนด้านหน้าและด้านหลัง |
| `cat-black` / `cat-orange` | 300×340 | แมวดำ / แมวส้ม |
| `beagle` / `dog-patch` | 300×340 | หมาบีเกิล / หมาด่าง |

---

## Retired Characters (`"retired": true` ใน `src/cast.json`)
> [!WARNING]
> ห้ามใช้ตัวละครเหล่านี้เป็นโมเดลหลักในเรื่องใหม่อีกต่อไป:
> `man`, `woman`, `auntie`, `elder`, `raincoat`, `student`, `kid`, `kid-girl`, `teen-girl`, `uncle`, `young-woman`, `grandpa`, `grandma`, `M1`–`B1`, `din`

### Whole-body Pose Primitives
สัญลักษณ์ท่าทางด้านล่างนี้เป็น **รูปทรงเรขาคณิตของท่าทาง (Pose geometry primitives)** เท่านั้น ใช้เมื่อตัวละครนั่ง หมอบ หันหลัง หรือนอน:
* ชาย: `man-sit`, `man-crouch`, `man-back`, `man-lie`
* หญิง: `woman-sit`, `woman-back`, `woman-run`, `auntie-sit`
* พระ: `monk-sit`

เวลาเขียน `ROSTER` ใน `cast.tsx` ให้ใช้ฟังก์ชันแมปท่าทาง โดยค่าเริ่มต้น (Default / Standing) **ต้องเป็นโมเดลตัวละครใหม่จาก `src/cast.json` เสมอ**:
```tsx
const poseMale = (standing: CastId) => (p: string): CastId =>
  (({sit: 'man-sit', back: 'man-back', walk: 'man-walk', run: 'man-run', crouch: 'man-crouch', lie: 'man-lie'} as Record<string, CastId>)[p] ?? standing);

const poseFemale = (standing: CastId) => (p: string): CastId =>
  (({sit: 'woman-sit', back: 'woman-back'} as Record<string, CastId>)[p] ?? standing);

export const ROSTER: Record<string, RosterEntry> = {
  tham: { cm: 172, symbol: poseMale('lead-male-A'), vars: { shirt: C.tham, ... } },
  mek:  { cm: 170, symbol: poseMale('lead-male-B'), vars: { shirt: C.mek, ... } },
  tik:  { cm: 160, symbol: poseFemale('sister-A'),   vars: { top: C.tik, ... } },
};
```

> [!CAUTION]
> **กฎเหล็ก: ห้ามปล่อยให้ตัวละครในท่าทาง Pose หรือของที่ดึงจาก Gallery สวมชุด Template เริ่มต้น**
> โมเดล Pose เช่น `man-sit`, `woman-sit`, `man-crouch` หรือยานพาหนะ/ฉากจาก Gallery (เช่น `Motorcycle`, `CarInterior`) โดยค่าเริ่มต้นจะมีเพียงเสื้อยืดสีพื้นเรียบๆ (`#torso-shirt`) ซึ่งเป็นของตัวละครเดิม
> หากตัวละครหลักมีการแต่งกายเฉพาะตัว (เช่น `lead-male-A` สวมแจ็กเก็ตซิปทับเสื้อยืดขาว มีกระเป๋าหน้าอก, `teacher-B` มีปกคอเสื้อ, หรือมีรอยปะ/สัญลักษณ์เฉพาะ) **ต้องนำรายละเอียดชุดจริงของตัวละครตาม `src/cast.json` มาแสดงทับบน Pose นั้นๆ เสมอ** ผ่านพร็อพ `extra: (sym) => ...`, Custom Overlay, หรือ Layering ให้ชุดตรงกับตัวจริง 100% ตลอดทั้งเรื่อง ห้ามหลุดเป็นชุดเสื้อยืดธรรมดาของ Template เป็นอันขาด


## Layer order inside one figure (`<Sprite layers={…}>`)

```
behind pieces (acc-backpack) → body (lead-male-A, man-sit…) → face-* / talk-* → acc-* → arm-* → props on the hand → mark-*
```

## Whole-body poses

Anything layered on a posed body (face, talk mouth, accessory, mark) takes the **same transform** as the pose:

| Pose | Frame | Overlay transform | Pose arms? |
|---|---|---|---|
| `man-walk` | 200×520 | none | yes |
| `man-run` | 200×520 | `rotate(8 100 300)` | no (arms are part of the stride) |
| `man-sit` | 200×520 (legs reach x ≈ 255) | `translate(0 110)` | yes, with `translate(0 110)` |
| `man-crouch` | 200×520 | `translate(0 160)` | no (hugging knees) |
| `man-back` | 200×520 | — (no face) | rest only |
| `man-lie` | **520×200** | `translate(0 234) rotate(-90)` | no |
| `woman-sit` | 200×520 | `translate(0 104)` | yes, with `translate(0 100)` |
| `woman-run` | 200×520 | `rotate(8 100 300) translate(0 4)` | no |
| `woman-back` | 200×520 | — | rest only |
| carry | `man` + `arm-l-carry` + `arm-r-carry` + `prop-box` at `translate(100 262)` | none | it is a pose-arm pair |

On the landscape stage, pose `walk` / `run` works for **every person** in the cast: `src/cast/Rig.tsx` redraws legs and arms from joints and puts the figure's own symbol (head, hair, outfit) on top, so faces, `arm=`, `prop=` and `acc=` still fit. The build comes from the body the symbol uses (`legs-pants`, `body-wide`, `body-skirt`, `body-kid`; the monk shuffles under his robe). A new hand-drawn person needs its standing legs in a `display:var(--legs-rest,inline)` group and `data-rig="pants|wide|skirt|kid|robe"` on the symbol. Pets and `crowd` have no rig. Gallery: `GGait`.

Any standing figure can lie down: draw it rotated with `translate(0 234) rotate(-90)` in a 520×200 frame (the stage `lie` pose does this). Change pose **on a cut or a beat**, never by morphing.

**Never use `lie` for "looking / reaching under furniture" (bed, car, sofa).** The lying sprite is a standing front view turned 90°, so the face and both hands end up on the same side and the body reads as a flat log beside the dark gap. Use `back` (seen from behind, no face to get wrong) with `prop=flashlight` and `h=` about the furniture height, and aim the light into the gap with `beamX/beamY/beamAngle/beamLen` in the shot `data` (temple-boy `underbed` / `side`). To show something under the furniture, cut to a POV or insert (`planks`, `coin`, a hand) instead of drawing the lying person.

```tsx
// sitting, scared, phone in the right hand (layers share layerTransform)
<Sprite id="man-sit" height={600} hideFace hideArmR layerTransform="translate(0 110)"
  layers={['face-scared', 'arm-r-hold']} />
// + a prop-phone Sprite placed at the hand anchor (112,244) shifted by the same translate(0 110)

// the same on the landscape stage (data.cast in story.json)
"man@900 sit scared arm=r-hold prop=phone"
```

## Story kits

Story-only pieces live in `src/episodes/<slug>/` (own `Sprite`-style components, own id prefix). Promote anything reusable into `cast.svg` and add the id to `KEEP` in `scripts/svg-to-tsx.mjs`.

Short sleeves: set `--forearm: var(--skin)` on the figure (pose arms then show a skin forearm under the sleeve).

## Faces — `hideFace` + one `face-*`

`happy laugh sad cry angry scared shock worried smirk tired hollow wary guilty grin`. Match the caption line. `grin` (eye bags, small pupils, wide crescent grin with teeth, same look as ลุงชาญ's `face-lr-grin`) is for the creepy smiler. `hollow` (blank black eyes) is saved for ghosts and the twist frame. One face per figure per shot.

## Talking — `hideMouth` + `talk-*`

`talk-a` (open) `talk-e` (wide) `talk-o` (round) `talk-m` (closed). Eyes stay neutral. A `face-*` brings its own mouth, so use a face **or** talk mouths. Swap the shape on a fixed grid while the line is voiced and end on `talk-m` — `talkShape(f, on)` in `src/kit/stage.tsx` does it from the local frame:

```tsx
const speaking = shot.who === 'non' && f >= sec(shot.voLead ?? 0.12);
<Sprite id="kid" hideMouth layers={[talkShape(f, speaking)]} />
// stage actor string: add `talk` → "non@900 talk"
```

Deterministic (no random). Used on the landscape stage in `temple-boy`.

## Accessories — the one trackable trait

| Symbol | Where | Var |
|---|---|---|
| `acc-glasses` `acc-cap` `acc-mask` `acc-headband` | head | `--frame` `--cap` `--cap-d` `--mask` `--bandage` `--blood` |
| `acc-scarf` `acc-bag` `acc-amulet` `acc-straps` | body | `--scarf` `--bag` `--bag-d` `--bag-strap` `--strap` |
| `acc-backpack` | **behind** the body: put it before the character use, add `acc-straps` after | `--pack` `--roll` |
| `acc-watch` `acc-hand-bandage` | on a hand: origin = hand centre | `--bandage` `--blood` |

Resting hand anchors: man r (148,330) l (52,330) · woman/auntie r (146,318) l (54,318) · raincoat r (152,334) l (48,334) · kid r (146,262) l (54,262). Pose-arm anchors: `hands-poses.md`. Give each named character one of these and keep it on the same side every shot: it is the clue device (a bandaged hand, a missing amulet, the watch that stopped).

## Emotion marks — `mark-*`

`question exclaim anger drops zzz dizzy idea shiver gloom`. Pop in with `backOut` on the beat the line lands, hold ≥ 0.8 s, one mark per figure at a time. Outlined in ink so they read on bright and dark sets.

## Props — origin = the hand centre

One-hand grip props (object first, hand last): `prop-glass coin phone paper key flashlight bottle radio candle map rope sack bowl bandage`. `prop-sack` hangs below the hand. Two-hand: `prop-box` (carry pose). Rules in `hands-poses.md`.

## Info icons — `icon-*`, viewBox 0 0 100 100

`clock thermo warn check cross arrow drop bolt fire pin skull eye`. For cards, HUD, checklists and maps; draw at 64–140 px; `<Sprite id="icon-warn" height={96} />`. Colours read `--ink --paper --red --gold --ok` (`--icon` for the arrow).

## Set pieces — `set-*`

The viewBox is the piece's size in px at the cast scale (cm × 2.6), so drawn at its viewBox size it matches a 442 px man.

| Symbol | Size | Vars |
|---|---|---|
| `set-door` / `set-door-open` | 234×533 | `--door` `--door-frame` `--void` |
| `set-window` | 260×312 | `--frame` `--glass` (night default; set a sky colour for day) |
| `set-table` | 312×195 | `--wood-0` `--wood-1` |
| `set-chair` | 117×234 | wood tokens |
| `set-tap` | 160×200 | `--basin` |
| `set-stairs` | 300×300 | `--wall-0` |
| `set-bulb` | 120×220 | `--lamp` |
| `set-bed` | 520×200 | `--blanket` |
| `set-shrine` (ศาลพระภูมิ) | 200×360 | `--shrine` `--shrine-roof` `--shrine-pole` |

Silhouettes: `<Sprite silhouette>` blacks out people, accessories and uniforms; props, icons, marks and set pieces keep their colours.

**No back view for auntie / woman / monk bodies.** `back` on them draws a blank face with shut eyes (a viewer reads it as asleep). Use a front face (`worried`, `sad`) or turn the actor with `flip`; `back` is only for the `man` body (`man-back`) and `woman-back`.

**No `arm=` on `crouch`, `lie` or `sit` bodies for reaching / lifting.** The arm layers are drawn for a standing body: on a crouching or lying one the arm floats above the head (rain-night ch11 gate scene, 2026-11-02). Show a physical action (lifting a gate, pulling a leg free, holding a phone while lying down) with a close-up insert of the hands instead, or stand the actor up.

**Din (ดิน)** — quiet radio repairer who counts sounds with his fingers. Use `<Sprite id="din" />` for his cloud curls and two cheek moles. Dress the same actor with `layers={['acc-field-vest']}` for fieldwork or `layers={['acc-shop-apron']}` at his bench. These torso layers also fit the standard standing man. Use `hair="cloud"` on another standard head to borrow his curls.

**Casting and default outfits.** Read `src/cast.json` before assigning the episode roster. Every role has independent A/B choices: lead-male/female, villain-male/female, father/mother, uncle-family/aunt-family, na-male/female, ar-male/female, brother/sister, younger-brother/sister, paternal-grandfather/grandmother, maternal-grandfather/grandmother, police, mechanic, photographer. Use e.g. `mother-A` and `mother-B` for two different mothers; never reuse one ID for two people by changing clothes. Keep each person's ID, hair, skin and permanent facial trait stable throughout the story. If both choices are occupied, add another distinct identity before building scenes. Family roles describe casting, not an obligatory personality or moral character.

`Sprite` and `ActorView` automatically apply `defaultOutfit` and `defaultVars` from cast.json. `<Sprite id="police-A" />` is already dressed. Change clothes only when motivated by the scene: `layers={['acc-denim']}` or stage `acc=denim`; ordinary accessories like glasses retain the default outfit. To remove the garment explicitly use Sprite `outfit="none"` or stage `acc=none`. Use the same character symbol in the roster to retain identity; do not substitute `man` for another character when posing. Child outfits (varsity, sailor, stripe, overalls) fit 420-unit bodies; adult outfits fit 520-unit bodies. M1/M2, W1/W2, A1/E1, B1/G1 remain available with automatic default outfits.

**Unique hair silhouettes:** Each A/B casting identity has its own `hairStyle` and `hair-identity-*` SVG definition. Do not reuse another person's hairstyle or replace it with a generic hair override. Keep age cues when changing outfits: parents 45?55, uncles/aunts 48?65, grandparents 68?80. New identities need a visibly different silhouette, hairline, fringe or length, not only a new ID or hair colour.

**Active cast and accessories.** Exclude entries marked `retired` in cast.json when casting new stories. Their SVG symbols remain for existing episodes. `lead-male-A` is the original man, `lead-male-B` is the former A, `aunt-family-B` is the original auntie, and `uncle-family-A` is the original uncle. Keep elder and monk active. `lead-female-A` reuses Mes from rain-night exactly: woman body, bob hair translated down 4, yellow top #e8b93a, navy skirt #3d4656, hair #20191a, skin #e6b993. Default accessories are applied by Sprite and ActorView. Sprite `accessories={[]}` removes them, or pass a replacement array of full acc-* IDs. Default clothing colours apply with the default outfit, while explicit vars override them. Use a full-body acc-wristwatch for standing figures (acc-watch alone is hand-local). The default wristwatch is omitted on a replaced left arm or walking rig to prevent a floating watch.
