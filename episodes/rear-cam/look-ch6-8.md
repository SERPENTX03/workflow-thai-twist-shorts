# Look audit — CH6–8 answers

`npm run look -- episodes/rear-cam --chapter <n> --all` after the first scene pass for CH6–8.

**Built in this pass:**
- Uncle Hem's hut, in the new shared kit `src/kit/hut.tsx` (`CaretakerHut`, `HutBench`, `PressureLantern`, `Raincoat`, `Dapple`, `SunRake`, `hutAt`).
- The roadside memorial and the cracked, mossy gate, both in `src/kit/cemetery.tsx` (`RoadsideMemorial`, `CemeteryGate aged`).
- The curve by day, from the ground, high above and Jay's eye line.
- The shortcut by day: tread, sun spots and the zinc gate.
- The station's back yard.
- The station inserts: empty seat, seat compartment, card, notebook.
- The phone screens: money app and incoming call.
- The glove macro.

**Fixed after the audit:** the day sets had no direction, so `SunRake` (hard sun from the upper left) now goes on the hut, the curve, the gate and the walk.

Each flag left is answered here (CLAUDE.md rule 14: fix, or one line of why).

| Shot | View | Flag | Why the frame is right as it is |
|---|---|---|---|
| 203 | sala:day-wide | flat 1.21 | CH6 is the "daylight shows what night hid" beat: the sala is meant to look plain and harmless at noon. The contrast is in the story, not the light. |
| 204, 218, 226, 238 | mud-macro, memorial-ins, limp-ins, empty-seat-ins | flat / washed | Daylight macros of a clue (old tread over new, Tom's name legible, the dragged foot, Chat's empty seat). The object fills the frame and must read in full. |
| 206 | hut:lantern-ins | flat 1.13 | The lantern is unlit at noon on purpose (it was lit all night). The sun spots on the globe are the light. |
| 221 | road:hem-ecu | flat 1.17 | Hem's face fills the frame in full sun: an ECU of his mouth as he speaks. |
| 214 | hut:night-lantern-wide | murky | Hem's imagined night: one lantern and darkness all round is the picture he describes ("so they know someone is here"). |
| 241, 244, 247 | room:jay-close / ecu | shadow 20–25 % | The phone calls under the one ceiling tube: the lit face fills the close-up. |
| 242 | phone:money-ins | murky | The app screen is the only light, and the red 3,400 is the brightest thing in the frame. |
| 248 | shop:gap-low | shadow 42 % | Same set-up as 57 and 98: the warm band under the shutter is the subject. |
| 251 | checkpoint:empty-wide | murky | The checkpoint that isn't there: no beacon tonight, so the darkness is the news. |
| 261 | station:notebook-high | shadow 17 % | Paper clue (Jay's plate three times, one ringed red). It must read. |
| 264 | station:teer-sil | murky | A silhouette under the neon by design. |
| 279 | hand:glove-macro | shadow 36 % | A grey glove filling the frame, with the glue streak catching the neon. |
| 282 | rearfile:handlebar-ecu | murky | The file zoomed 400 %: black pixels and one green squiggle. Finding that dot is the beat. |
| 284, 286 | hand:keychain-ecu, tissue-ecu | shadow 58 % / 15 % | Faded-memory inserts (`recall`). The tissue is paper and must read. |

**Known gaps:**
- **Jay's helmet:** in the hut shots it isn't drawn in his hand, because the pose rig has no helmet prop.
- **The bench in 230:** Hem sitting on the bench is out of frame in that medium. He is seen seated in 231.
