import React from 'react';
import type {ShotComponent} from '../../engine/episode';
import {CAR} from './car';
import {EXT} from './ext';
import {INS, VIEWS} from './ins';
import {NIMS} from './nim';
import {PAST} from './past';
import {ROOM5} from './room5';
import {ROOMS} from './rooms';
import {YARD} from './yard';

// ห้องที่ห้า: scene switch. One file per place, `view` picks the picture; cam, cast, light live in story.json.
// A view drawn as an insert (clues.tsx) is one frame wherever the story meets it, whichever place it belongs to.
const orClue = (S: ShotComponent): ShotComponent => p => {
  const V = VIEWS[p.shot.view ?? ''];
  return V ? <V p={p} /> : <S {...p} />;
};

export default {
  ext: orClue(EXT.ext),
  car: orClue(CAR.car),
  ins: INS.ins,
  title: INS.title,
  endcard: INS.endcard,
  living: orClue(ROOMS.living),
  kitchen: orClue(ROOMS.kitchen),
  bedroom: orClue(ROOMS.bedroom),
  room5: orClue(ROOM5.room5),
  nim: orClue(NIMS.nim),
  yard: orClue(YARD.yard),
  past: PAST.past,
  cctv: PAST.cctv,
  plan: PAST.plan,
  station: orClue(PAST.station),
} as Record<string, ShotComponent>;
