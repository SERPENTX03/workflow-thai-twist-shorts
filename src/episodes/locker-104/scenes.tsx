import type {ShotComponent} from '../../engine/episode';
import {INS, VIEWS} from './ins';
import {BOX_SCENES} from './box';
import {OFFICE_SCENES} from './office';
import {PAST_SCENES} from './past';
import {PLATFORM_SCENES} from './platform';

// ล็อคเกอร์ 104: scene switch. One file per place; `view` picks the picture; cam, cast and light live in story.json.
// An insert (ins.tsx → VIEWS) is one frame wherever the story meets it, whichever place it belongs to.
const orIns = (S: ShotComponent): ShotComponent => p => {
  const V = VIEWS[p.shot.view ?? ''];
  return V ? V(p) : S(p);
};

export default {
  ins: INS.ins,
  title: INS.title,
  endcard: INS.endcard,
  office: orIns(OFFICE_SCENES.office),
  platform: orIns(PLATFORM_SCENES.platform),
  front: orIns(PLATFORM_SCENES.front),
  track: orIns(PLATFORM_SCENES.track),
  train: orIns(PLATFORM_SCENES.train),
  box: orIns(BOX_SCENES.box),
  boxext: orIns(BOX_SCENES.boxext),
  shed: orIns(BOX_SCENES.shed),
  past: orIns(PAST_SCENES.past),
} as Record<string, ShotComponent>;
