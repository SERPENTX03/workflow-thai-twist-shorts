import React from 'react';
import type {ShotComponent} from '../../engine/episode';
import {INS, VIEWS} from './ins';
import {PLACES} from './places';
import {WARDS} from './ward';

// พยาบาลเวรดึก: scene switch. One file per kind of place, `view` picks the picture; cam, cast, light live in story.json.
// An insert (ins.tsx → VIEWS) is one frame wherever the story meets it, whichever place its shot is filed under.
const orIns = (S: ShotComponent): ShotComponent => p => {
  const V = VIEWS[p.shot.view ?? ''];
  return V ? <V p={p} /> : <S {...p} />;
};

export default {
  ward: orIns(WARDS.ward),
  ins: INS.ins,
  title: INS.title,
  card: INS.card,
  rules: INS.rules,
  endcard: INS.endcard,
  canteen: orIns(PLACES.canteen),
  lobby: orIns(PLACES.lobby),
  stair: orIns(PLACES.stair),
  booth: orIns(PLACES.booth),
  pharm: orIns(PLACES.pharm),
  icu: orIns(PLACES.icu),
  station: orIns(PLACES.station),
  ext: orIns(PLACES.ext),
  phone: PLACES.phone,
  past: PLACES.past,
} as Record<string, ShotComponent>;
