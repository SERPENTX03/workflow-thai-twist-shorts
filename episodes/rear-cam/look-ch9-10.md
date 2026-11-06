# Look audit — CH9–10 answers

`npm run look -- episodes/rear-cam --chapter <n> --all` after the first scene pass for CH9–10.

**Built in this pass:**
- `src/episodes/rear-cam/live.tsx`: the view from the beam (grainy live picture, then the same framing in colour with the police), the confrontation at the mouth of the shortcut under two lights, dawn at the sala, the desk before the last night, the shop opened at dawn, the live phone screens, the end card.
- `src/kit/live.tsx` (shared, in the gallery as `live-stream`): `LiveBadge`, `LiveComments`, `CrackedGlass`, `GoldPile`, `viewersAt`.
- Chat wears the black raincoat from the rear-camera file throughout CH9, hanging open over the orange vest, helmet pushed back so the scar shows (`rain` on `Actors`, `ChatRainHead`).

**Story data changed (no voice or timing change):** Teer moved from x 1240 to 1500 in shots 324–342, because he was standing on Chat · shot 341 tightened to a real ECU (z 5.4) · shot 351 Teer `smirk` (the note wants his eyes open) · shot 353 `plateLines: 3` · note on shot 295 rewritten to match the picture.

Each flag left is answered here (CLAUDE.md rule 14: fix, or one line of why).

| Shot | View | Flag | Why the frame is right as it is |
|---|---|---|---|
| 288 | room:desk-high | shadow 37 % | The tube lights the table: tools laid out like instruments must all read. |
| 289 | room:jay-ecu | shadow 25 % | The lit face fills the frame. |
| 292 | checkpoint:empty-wide | murky | Mirror of 251: no beacon again, the darkness is the news. |
| 296 | sala:beam-ins | washed 63 | A black phone and black tape on old teak: the lens is the subject, and it reads. |
| 297, 328, 329, 335 | table-top, notebook-ins, board-ins, notebook-high | shadow 17–38 % | Objects that are clues (the box, the plates, the board, the red ring). They must read in full. |
| 306 | livefeed:count-ecu | shadow 25 % | The white box fills the frame, as in shot 177, which it mirrors. |
| 312 | barscreen:live-pov | murky | The stream has just died: a dark screen is the beat. |
| 325 | sala:teer-low | shadow 45 % | On the line, and the police beams have just lit the set. |
| 331 | checkpoint:walkie-ins | shadow 16 % | Mirror of 147: Teer's khaki shirt fills the frame behind the radio. |
| 332 | past:stake-fif | murky | Hidden men in the dark in a memory. Fixed once (moon on the path, rims on the men and the wheel); still dark on purpose. |
| 334 | station:glass-fif | murky | Mirror of 257, seen through the minimart glass under one neon. |
| 338, 339, 341, 342 | kneel-close, chat-close, chat-ecu | shadow 11–28 % | Chat's face fills the frame in two sets of headlights: exposing him is the point of the scene. |
| 340 | past:road-high | murky | Mirror of 71: only the fallen bike's headlight and the tail lights going away. |
| 344 | sala:jay-close | flat 1.21 | A close of Jay's lit face between two lights. |
| 348 | sala:jay-med | centre 48 % | He stands on the left third in the frame (screen x ≈ 30 %), with the parked bike and the pillar beside him; the audit reads the actor's world x, not where the camera puts him. |
| 356 | road:memorial-ins | flat 1.20 / washed | Tom's board at dawn: the name and the fresh garland must read. |

**The opening, redrawn (`src/episodes/rear-cam/opening.tsx`):** shots 0 and 1 did not say what they showed. Shot 0 is now one rider on a pale road through the graves, heading for the gate; shot 347 mirrors the same framing at dawn. Shot 1 is the real bike at ground level on its front wheel. Shot 1 flag "shadow 35 %": the lit fog is the backdrop that makes the wheel and the black graves read. Also redrawn: shot 5 (the helmet from behind and to the side, the camera's lens looking back down the road at the sala) and shot 11 (the whole gate black against bright fog, one red tail light going away down the road; shot 360 shares the framing).

Opening flags after the redraw: shot 2 (contrast 43) shows the helmet camera filling the frame with its red REC light as the bright point. Shot 4 (murky) shows the small screen with the sala in it as the only lit thing, and the dark round it is what makes the screen the subject.

**Fixed after review (the user's pass):** 351 Teer's glasses are the sprite's own accessory again, on his eyes (the hand-drawn pair floated by his fist) · 240, 241, 244 and 247 Jay holds the phone with his own right arm (`arm=r-phone`, shared in `cast.svg`), after an extra drawn arm gave him three · 345 redrawn as a wide shot at the sala with the real sprites: Teer holds the wrist of Chat, who is cuffed; view renamed `cuffed-wide` (the high-angle version made of shapes did not read as people).

**Known gaps:**
- Shots 345 and 326 are drawn from above with `HighFigure` (head + tapering coat), because the sprites only exist front-on.
- The tyre lever lying in the mud is not shown in 338: the close stays on his face and the keychain.
