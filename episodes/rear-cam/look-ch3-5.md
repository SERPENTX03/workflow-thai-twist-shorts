# Look audit — CH3–5 answers

`npm run look -- episodes/rear-cam --chapter <n> --all` after the first scene pass. Fixed in this pass: 115 headlight-pov (a real headlight pool on the road), 122 mud-macro (the headlamp pool on the wet mud, so the tread reads dark on lit ground), and 117 graves-wide (moonlit fog band and a brighter lantern pool; still flagged, see below). Each flag left is answered here (CLAUDE.md rule 14: fix, or one line of why). Re-check after any change to these shots.

| Shot | View | Flag | Why the frame is right as it is |
|---|---|---|---|
| 95, 100 | shop:street-wide, shutter-low | murky | The caption says the shop is completely dark. The neon sign and the gap under the shutter are the only light, and the rider and box read against them. |
| 96 | shop:knock-ins | shadow 16 % | A macro of the knuckles on the steel shutter. The object fills the frame on purpose. |
| 98 | shop:gap-low | shadow 42 % / washed | The warm light from under the shutter is the subject (the box coming out), so it has to be the bright band. |
| 102 | hand:lift-ecu | shadow 45 % | It sits on the line. It's the "too heavy" box beat, with the hands in the forecourt light. |
| 103, 121, 161 | shop / sala:jay-med | centre | False positive. `aimData` re-aims these mediums, and Jay's head now sits at 33 % with the box or table on the right third. The audit reads the story's raw `cam`, not the aimed one. |
| 104 | road:highway-side | flat 1.24 | Just under 1.25. A side-on ride along the lit highway, with the headlight and the pool ahead. |
| 111, 194 | checkpoint:notebook-ins | shadow 35 % / 36 % | The notebook is the clue (plates and times). It's white paper under Teer's torch and must read. |
| 114, 151 | road:gate-low, gate-high | murky | Fog at the cemetery gate. The headlight cone is the one light, and Jay and the bike read inside it. |
| 117 | road:graves-wide | murky 97 % | The beat is one lantern floating in the dark among the graves. The fog band and the lantern pool are the only light, and the graves read in rows. |
| 120 | sala:table-top | shadow 38 % | The polished table top in the headlight is where the box goes. It is meant to be the bright plane. |
| 123, 158 | sala:path-fif, dark-fif | murky | Shots from the "someone is watching" point of view: a dark foreground pillar with Jay small in the lit middle. The darkness is the threat. |
| 125, 136 | barscreen:nosignal-pov, rear-pov | murky | The bar-screen POV, as in shots 4 and 94: the 2-inch screen is the only light by design. |
| 147 | checkpoint:walkie-ins | shadow 14 % | A walkie-talkie insert held up to the torch. The object fills the frame. |
| 153 | sala:trip-wide | murky | Jay is a silhouette tripping on the step, in silhouette on purpose. The light pool on the sala floor is behind him. |
| 172 | hand:usb-ins | murky | A cable pulled out of the helmet camera in a dark room, with the laptop's glow on the plug. It sets up the next shot, which is the screen. |
| 177 | rearfile:count-ecu | shadow 55 % | The file's own frame: grey CCTV tape, counted wrap by wrap. The pixels are the evidence, so they stay legible. |
| 183 | hand:tape-macro | shadow 52 % | The black-and-white tape macro on the desk. The tape is the clue. |
| 193, 197 | room:jay-close | shadow 56 % | A close-up lit by the laptop. The face is the brightest thing in the frame by design (directing.md: the face is the brightest thing near the light). |
| 196 | phone:call-ins | murky | Dialling 191 in the dark. The phone screen is the only light. |

Room staging (CH5, CH7 room shots): the bed is now low (v .9) so the seated sprite's lap meets its edge, and Jay sits at u .28 in front of it. In the ceiling-high and corner-wide shots he is up on the mattress against the wall, with his knees under the blanket, scaled to that depth. In window-wide he stands with his back to the camera at the laptop. The phone calls (240, 241, 244, 247, `data.phone: "ear"`) draw the hand and phone at his ear, because the sit pose keeps its hands in its lap.
