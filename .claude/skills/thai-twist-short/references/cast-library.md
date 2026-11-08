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

### Whole-body poses come with the costume

`sit`, `crouch` and `lie` are drawn on the character's own symbol (`src/cast/Body.tsx`), so the jacket, pockets, uniform, tattoos, hair and face come along, and the rig tokens work on them: `win@900 sit yaw=0.5 armR=hold prop=phone worried`.

| Token | What it draws |
|---|---|
| `sit` | facing us: knees apart, hands on the thighs. Must have something under it (CLAUDE.md rule 16): `Actors chairs` or a seat in the set |
| `sit yaw=0.5` | three-quarter: thighs out to the side, shins hanging. The seat reads in silhouette, prefer it |
| `crouch` | knees up, arms around the shins: against a wall, under a table |
| `lie` | on the back, head at frame left (`flip` for right), one knee up, hand on the stomach. Frame 520×200, the floor is its bottom edge. Faces `sleep` and `mark=zzz` go with it |
| `back` | the shared back view in the character's colours (`man-back`, `woman-back`); kids and robes hide the face instead |
| `walk` `run` | jointed legs and arms, `src/cast/Rig.tsx` |

The roster only has to name the standing symbol: `symbol: () => 'lead-male-A'`. Rosters that still map `sit: 'man-sit'` keep working: those names now only tell an `extra` overlay which frame it is in, and it stays aligned (sit 110, crouch 160). Robes (`monk`, `novice`) keep their own drawn `monk-sit`.

> [!CAUTION]
> Do not re-draw a costume over a pose in an episode. What still needs the character's colours and details passed by hand is whatever draws its own person: `Motorcycle rider`, `CarInterior`, a shot written as its own SVG (CLAUDE.md rule 13). A trait of one story (a numbered vest, a scar) goes in that episode's roster `extra`.

### Talking mouths follow the face

`worried talk`: the mouth set comes from the face. smile (`happy laugh smirk grin`) · down (`sad cry worried scared guilty tired`) · tense (`angry wary`) · shock (`shock`) · plain (no face, `hollow`). Symbols `talk-<set>-a|e|o|m`; `talkShape(f, on, face)` in `src/kit/stage.tsx` picks them on an uneven cycle. A hand-drawn talker (a rider, an own-SVG shot) should pass its face the same way.

## Layer order inside one figure (`<Sprite layers={…}>`)

```
behind pieces (acc-backpack) → body (lead-male-A, man-sit…) → face-* / talk-* → acc-* → arm-* → props on the hand → mark-*
```

## Drawing frames (when you write a Sprite by hand)

Anything layered on a posed body takes the same offset as the upper body: sit `translate(0 110)` (kid 56), crouch `translate(0 160)` (kid 92), lie `translate(0 234) rotate(-90)` in a 520×200 frame. `man-walk` none, `man-run` `rotate(8 100 300)`. Carry: `arm-l-carry` + `arm-r-carry` + `prop-box` at `translate(100 262)`.

On the landscape stage, pose `walk` / `run` works for **every person** in the cast: `src/cast/Rig.tsx` redraws legs and arms from joints and puts the figure's own symbol (head, hair, outfit) on top, so faces, `arm=`, `prop=` and `acc=` still fit. The build comes from the body the symbol uses (`legs-pants`, `body-wide`, `body-skirt`, `body-kid`; the monk shuffles under his robe). A new hand-drawn person needs its standing legs in a `display:var(--legs-rest,inline)` group and `data-rig="pants|wide|skirt|kid|robe"` on the symbol. Pets and `crowd` have no rig. Gallery: `GGait`.

## Pose rig — turn three-quarter, act with the arms (`src/cast/Pose.tsx`)

Every **standing** person in `src/cast.json` can turn and gesture without a new drawing. The rig draws the character's own symbol in passes and moves each one its own way, so the costume is the real one (rules 12–13): jacket, collar, chest pocket, outfit `acc-*`, glasses, hats, bags, the wristwatch (moved onto the jointed left wrist), short sleeves, and tattoos / bracelets (carried on the forearm). After what-if-studio's `rig.tsx`, adapted to our drawn cast.

| Field | Range | What it does |
|---|---|---|
| `yaw` | −1 … 1, use ±0.3–0.6 | 0.5 = three-quarter toward screen-right. The body narrows and a darker copy shows its turned-away side; the face (eyes, brows, mouth, moles, glasses) slides toward the turn, the hair slides back, the near ear comes onto the cheek, the far ear goes behind the skull, a shade crescent darkens the back of the head. Past ±0.7 the front-view face slides off the skull (story-check warns): use `back` or a silhouette instead. |
| `armL` / `armR` | `{a, b}` degrees, or a preset | **a** = upper arm from hanging straight down, **+ out** to that arm's own side, − in across the body. **b** = elbow, added to a for the forearm: − folds back in / up. l = screen-left arm. One arm = one sleeve + one hand (`hands-poses.md` rule 1): the rig draws both arms itself, the resting arms are switched off. `null` / `none` = no arm on that side. |
| presets | `rest hold chest offer raise reach pocket` (= the `arm-*` symbols) · `wave point face mouth chin head hip lap out` | solved once from hand anchors (`ANCHOR_R`, elbows hang down and out), so they fit every build — adults, kids, skirts. `pocket` has no hand. |
| `headTilt` | degrees, + toward screen-right | the head rocks on the neck |
| `look` | −1 … 1 | the dot eyes glance inside the face (the character's own face only, not a `face-*`) |

Draw order is automatic: arms hang behind the torso's edge as the drawings do (and over the legs / skirt), a hand across the chest is drawn in front, a hand at the mouth / cheek in front of the head.

**On the stage (actor strings, `data.cast`):**

```
"phak@820 yaw=0.4 armR=reach armL=hold prop=phone worried"
"prae@1200 yaw=-0.5 armL=mouth shock head=-6"
"phak@820 yaw=0>0.5 armR=rest>wave@6-20"        // ">" tweens across the shot, "@from-to" = those frames
"mali@700 armL=chest faces=worried@0,shock@40"  // face swaps on frame 40 through a blink ("own" = their own face)
"pho@900 armR=150,-30 armL=pocket prop=key@r"   // prop@l / @r picks the hand
```

`prop=` goes into a posed hand: the one named with `@l` / `@r`, else the arm in a holding preset (hold offer reach raise out lap point), else the posed arm, else the right. Old `arm=r-hold` strings still work on a posed actor (the rig draws hold / chest / offer / raise / reach / pocket itself; `carry` and `b-wheel` stay symbols and take their arms off the rig). They work on `stand`, `sit`, `crouch` and `lie`; on `back`, `walk` and `run` the words are ignored and `npm run story` says so.

**In a custom shot (TSX):**

```tsx
import {ARM_PRESETS, faceAt, poseAt} from '../../cast/Pose';
// one pose
<Sprite id="lead-male-A" height={620} pose={{yaw: 0.45, armR: ARM_PRESETS.reach, headTilt: -4}} propL="phone" />
// keyed: every number eases between keys, a key carries the earlier values forward
const pose = poseAt(f, [{f: 0, p: {yaw: 0}}, {f: 18, p: {yaw: 0.5, armR: ARM_PRESETS.raise}}, {f: 40, p: {armR: {a: 160, b: -20}}}]);
const {face, blink} = faceAt(f, [[0, 'worried'], [40, 'shock']]); // swaps through a two-frame blink
<Sprite id="lead-female-A" pose={pose} hideFace layers={[`face-${face}` as CastId]} />
```

Helpers: `reachLimb(side, shoulder, target, upper, fore)` solves an arm to a point in the frame (a hand on a door handle), `shouldersOf(plan, yaw)` gives the shoulders, `turnOf(yaw)` the slides. `<PoseFigure>` is the drawing itself, for a hand-built figure.

How it works (for a new character): `scripts/svg-to-tsx.mjs` finds each person's skull (`head-bare` or a `display:var(--skull-rest)` group), hair (`--hair-rest`), back hair (`--backhair-rest`) and arm marks (`--arm-l/r-rest` groups on top of a shared arm) and writes them out as `<id>--skull` / `--hair` / `--backhair` / `--marks-l|r` with `CAST_PARTS`. Ears switch one at a time with `--ear-l` / `--ear-r`. Build a new person from `head-bare` + a hair group in `--hair-rest` and the rig works with no extra step. A hand-drawn head without those groups (`elder`, `monk`, `novice`, `aunt-family-B`) turns as one piece, which reads much weaker: stage those with arms, `back` or close-ups, or give the head the groups. Gallery: `GRig` (studio → ท่าทาง → pose rig).

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
