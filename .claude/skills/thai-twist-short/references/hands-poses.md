# Hands and poses — keep the drawing believable

Read before drawing any shot where a hand does something (hand over, hold, point, wave, pocket, close-up of a hand). Evidence of the bug this prevents: a character handing over a coin showed **two hands on one side** — the resting hand of the default arm plus a loose hand drawn for the gesture.

## Hard rules

1. **One arm = one sleeve + one hand.** Two arms per character, so at most **two hands visible per figure**. Count them in every frame you check.
2. **Never draw a loose hand or arm next to a resting one.** Each character symbol in `cast.svg` already draws both arms hanging down. To pose an arm: put `arm-l-off` / `arm-r-off` on the `<svg class="who">` (hides that resting arm), then layer one pose symbol (`#arm-r-hold` …) after the character `<use>`.
3. **The hand belongs to the arm.** The pose arm is drawn shoulder → elbow → hand as one continuous stroke, so the hand can never float. Do not move a hand with GSAP separately from its arm; animate the whole pose `<svg>`/`<use>` or swap pose symbols on a cut.
4. **Props sit on the hand anchor** with a grip prop (`#prop-glass`, `-coin`, `-phone`, `-paper`, `-key`, `-flashlight`): `<use href="#prop-glass" transform="translate(88 244)"/>`. The prop draws the object and then the hand over its lower part — the hand is in front of what it holds, and there is still only one hand. A new prop must do the same (object first, hand circle `r=19` last, origin at the hand centre).
5. **A hand holding something never also hangs at the side.** A hand with nothing to do either rests (default arm) or is hidden on purpose (`arm-*-pocket`, behind the back = `arm-*-off` with no pose).
6. **Handing over = two figures, two arms, one prop.** Giver: `offer` arm toward the receiver with the prop on its hand. Receiver: `offer`/`hold` arm reaching the same point. Move the prop from one hand anchor to the other **on a cut** or by tweening the prop's `x/y` — never copy it onto both hands at once.
7. **Facing and side.** r = screen-right arm, l = screen-left arm. The `offer` arm points away from the body, so use the arm on the side of the receiver. Never cross an arm over the face.
8. **Hands stay in the action zone** (y 160–1180) and ≥ 38 px across on screen (the `r=19` circle at scale 1). For a close-up, draw the hand big (≥ 200 px) on its own shot: palm circle + thumb nub, no fingers (flat style).
9. **Silhouettes keep the poses** — `.sil` already blacks out the pose arms and props' skin (`--sleeve`, `--skin`); a prop's own colours are not blacked out, so give a silhouette shot only `arm-*-pocket`/`raise`, or no prop.
10. **Reuse before inventing.** Take a pose from the library below. A new gesture goes into `template/assets/kit/cast.svg` (right-arm version + mirrored left) and into this table, not into one episode.

## Pose library (`template/assets/kit/cast.svg`, "Pose library")

Frame 200 × 520. Use `viewBox="0 0 200 520"`, `class="who c-<symbol> arm-r-off"` (set `c-man`, `c-woman`, `c-auntie`, `c-raincoat`, `c-elder`, `c-student`, `c-kid`, `c-kid-girl` — it sets the sleeve colour).

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

Grip props (origin = hand centre): `prop-glass`, `-coin`, `-phone`, `-paper`, `-key`, `-flashlight`, `-bottle`, `-radio`, `-candle`, `-map`, `-rope`, `-sack` (hangs below the hand), `-bowl`, `-bandage`. Accessories that sit on a hand (`acc-watch`, `acc-hand-bandage`) use the same anchors — see `cast-library.md`.

Example (a woman hands a coin; a man sets a glass down) → `template/compositions/scene-example-poses.html`.

```html
<svg class="who c-woman arm-r-off" viewBox="0 0 200 520">
  <use href="#woman"/><use href="#arm-r-offer"/><use href="#prop-coin" transform="translate(214 222)"/>
</svg>
```

## Pose continuity (cast turnaround set)

- Give each named character 2–3 **signature poses** and reuse them across shots and episodes (e.g. lead: `hold` + `raise`; auntie: `chest` + `pocket`). Record them next to the character in `series/<name>.md`.
- A pose change happens **on a cut or on a beat**, not as a morph. Between poses the figure is in `rest`.
- Same character, same hand: if the lead holds the key in the right hand in shot 3, the key is in the right hand in shot 7 until the story shows it moving.
- Props the clue depends on (key, coin, bandaged hand) are drawn on the same side and anchor every time they appear.

## Check list (add to every frame you snapshot)

- [ ] Each figure shows ≤ 2 hands; none is doubled on one side.
- [ ] Every posed arm has its resting arm hidden (`arm-*-off`).
- [ ] Every held object is under a hand (the hand circle overlaps its lower part).
- [ ] A handing-over shot has the prop on exactly one hand.
- [ ] The hand is attached to the sleeve (no gap at the wrist).
