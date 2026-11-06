# Hands and poses — keep the drawing believable

Read before drawing any shot where a hand does something (hand over, hold, point, wave, pocket, close-up of a hand). Evidence of the bug this prevents: a character handing over a coin showed **two hands on one side** — the resting hand of the default arm plus a loose hand drawn for the gesture.

## Hard rules

1. **One arm = one sleeve + one hand.** Two arms per character, so at most **two hands visible per figure**. Count them in every frame you check.
2. **Never draw a loose hand or arm next to a resting one.** Each character symbol in `cast.svg` already draws both arms hanging down. To pose an arm: set `hideArmL` / `hideArmR` on the `Sprite` (hides that resting arm), then add one pose symbol (`arm-r-hold` …) to `layers`. Stage actor strings (`arm=r-hold`) do both. On the **pose rig** (`armL=` / `armR=`, `cast-library.md` → Pose rig) the rig draws both arms itself, shoulder → elbow → hand, and switches both resting arms off: still one sleeve + one hand per arm, and a `prop=` goes in a posed hand.
3. **The hand belongs to the arm.** The pose arm is drawn shoulder → elbow → hand as one continuous stroke, so the hand can never float. Do not move a hand separately from its arm; animate the whole `Sprite` or swap pose symbols on a cut.
4. **Props sit on the hand anchor** with a grip prop (`prop-glass`, `-coin`, `-phone`, `-paper`, `-key`, `-flashlight`): place the prop Sprite at the anchor, e.g. (88,244) for `arm-l-hold`; stage strings do it with `prop=glass`. The prop draws the object and then the hand over its lower part — the hand is in front of what it holds, and there is still only one hand. A new prop must do the same (object first, hand circle `r=19` last, origin at the hand centre).
5. **A hand holding something never also hangs at the side.** A hand with nothing to do either rests (default arm) or is hidden on purpose (`arm-*-pocket`, behind the back = `hideArm*` with no pose).
6. **Handing over = two figures, two arms, one prop.** Giver: `offer` arm toward the receiver with the prop on its hand. Receiver: `offer`/`hold` arm reaching the same point. Move the prop from one hand anchor to the other **on a cut** or by tweening the prop's `x/y` — never copy it onto both hands at once.
7. **Facing and side.** r = screen-right arm, l = screen-left arm. The `offer` arm points away from the body, so use the arm on the side of the receiver. Never cross an arm over the face.
8. **Hands stay in the action zone** (y 160–1180) and ≥ 38 px across on screen (the `r=19` circle at scale 1). For a close-up, draw the hand big (≥ 200 px) on its own shot: palm circle + thumb nub, no fingers (flat style).
9. **Silhouettes keep the poses** — `silhouette` already blacks out the pose arms and props' skin (`--sleeve`, `--skin`); a prop's own colours are not blacked out, so give a silhouette shot only `arm-*-pocket`/`raise`, or no prop.
10. **Reuse before inventing.** Take a pose from the library below. A new gesture goes into `src/cast/source/cast.svg` (right-arm version + mirrored left) and into this table, not into one episode.

## Pose library (`src/cast/source/cast.svg`, "Pose library")

Frame 200 × 520. `Sprite` sets the sleeve colour per character itself (`SLEEVE` in `src/cast/Sprite.tsx`); a new character needs an entry there.

| Pose | Symbols | Hand anchor r / l | Use for |
|---|---|---|---|
| hold | `arm-r-hold` `arm-l-hold` | (112,244) / (88,244) | holding a glass, phone, bowl in front; putting something down |
| chest | `arm-r-chest` `arm-l-chest` | (116,196) / (84,196) | "me?", pledge, panic, flinch |
| offer | `arm-r-offer` `arm-l-offer` | (214,222) / (−14,222) | hand over a coin / key / paper; take; point at |
| raise | `arm-r-raise` `arm-l-raise` | (190,110) / (10,110) | wave, stop, ask, shout |
| reach | `arm-r-reach` `arm-l-reach` | (226,176) / (−26,176) | a latch, handle or door at shoulder height |
| pocket | `arm-r-pocket` `arm-l-pocket` | hand hidden | hand in pocket, hiding a hand (a clue device) |
| rest | (default arm) | — | nothing to do |
| carry | `arm-r-carry` + `arm-l-carry` | (150,262) / (50,262) | both hands on one big object: `prop-box` at (100,262) draws both hands |
| wheel | `arm-b-wheel` + `prop-wheel` | (100,297) | both hands on a steering wheel, driver seen from the front: stage string `arm=b-wheel prop=wheel` on a **stand** pose (the dashboard in the scene hides the legs). `b` = both arms; the prop draws the rim, spokes, hub and then both hands over the rim. For a driver who is not driving (phone, notebook) use `arm=r-hold prop=…` and draw the wheel in the scene |

Grip props (origin = hand centre): `prop-glass`, `-coin`, `-phone`, `-paper`, `-key`, `-flashlight`, `-bottle`, `-radio`, `-candle`, `-map`, `-rope`, `-sack` (hangs below the hand), `-bowl`, `-bandage`. Accessories that sit on a hand (`acc-watch`, `acc-hand-bandage`) use the same anchors — see `cast-library.md`.

Example (a woman hands a coin):

```tsx
<Sprite id="woman" hideArmR layers={['arm-r-offer']} layerTransform="translate(0 4)" />
// + a prop-coin Sprite at the offer anchor (214,222)
// stage actor string: "porn@700 arm=r-offer prop=coin"
```

## Pose continuity (cast turnaround set)

- Give each named character 2–3 **signature poses** and reuse them across shots and episodes (e.g. lead: `hold` + `raise`; auntie: `chest` + `pocket`). Record them next to the character in `series/<name>.md`.
- A pose change happens **on a cut or on a beat**, not as a morph. Between poses the figure is in `rest`.
- Same character, same hand: if the lead holds the key in the right hand in shot 3, the key is in the right hand in shot 7 until the story shows it moving.
- Props the clue depends on (key, coin, bandaged hand) are drawn on the same side and anchor every time they appear.

## Check list (add to every frame you snapshot)

- [ ] Each figure shows ≤ 2 hands; none is doubled on one side.
- [ ] Every posed arm has its resting arm hidden (`hideArmL` / `hideArmR`).
- [ ] Every held object is under a hand (the hand circle overlaps its lower part).
- [ ] A handing-over shot has the prop on exactly one hand.
- [ ] The hand is attached to the sleeve (no gap at the wrist).
