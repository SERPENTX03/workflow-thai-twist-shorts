import type {ShotComponent} from '../../engine/episode';
import {MERU} from './meru';
import {STALL} from './stall';
import {ICE} from './ice';
import {HOUSE} from './house';
import {CLINIC} from './clinic';
import {OTHERS} from './others';
import {DUTY} from './duty';
import {INSERTS} from './inserts';

// สูตรลับเขียงหมูพ่อ: scene switch. One file per place, `view` picks the picture; cam, cast, light live in story.json.
export default {
  meru: MERU.meru,
  stall: STALL.stall,
  ice: ICE.ice,
  house: HOUSE.house,
  clinic: CLINIC.clinic,
  ward: DUTY.ward,
  sala: OTHERS.sala,
  temple: OTHERS.temple,
  fire: OTHERS.fire,
  school: OTHERS.school,
  flash: OTHERS.flash,
  farm: OTHERS.farm,
  hospital: OTHERS.hospital,
  station: OTHERS.station,
  grad: OTHERS.grad,
  clinic2: OTHERS.clinic2,
  ins: INSERTS.ins,
  book: INSERTS.book,
  phone: INSERTS.phone,
  news: INSERTS.news,
  title: INSERTS.title,
  endcard: INSERTS.endcard,
} as Record<string, ShotComponent>;
