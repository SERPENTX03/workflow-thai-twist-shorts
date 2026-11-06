import type {ShotComponent} from '../../engine/episode';
import {StationScene} from './station';
import {NIGHT} from './night';
import {SALA} from './sala';
import {CHECKPOINT} from './checkpoint';
import {ROOMS} from './room';
import {DEVICES} from './devices';
import {INSERTS, STATION_INSERTS, StationInsert} from './inserts';
import {PAST} from './past';
import {HUT_SCENES} from './hut';
import {LIVE, liveView} from './live';

// ออเดอร์ป่าช้า... กับกล้องตัวที่สอง — scene switch: one component per place / device, `view` picks the camera.
// Every camera shot is designed from its `note` in story.json (directing.md); scenes not listed yet render as
// placeholders and `npm run story` names them.
//
//   station.tsx     the gas station (front, back, CCTV, inside the minimart)   + inserts.tsx station close-ups
//   night.tsx       the cemetery road wides, the sala in fog, the shop street, the shortcut; SalaFeed (the rear camera)
//   sala.tsx        nights 1–2: the sala at the people's scale + its close-ups, more road angles, the shop's close-ups
//   checkpoint.tsx  Teer's checkpoint + the notebook, cutter, walkie-talkie, torch beam
//   room.tsx        Jay's rented room (room.tsx kit) + the rear-camera file full-frame
//   devices.tsx     helmet close-ups, the handlebar screen
//   inserts.tsx     hands, phone, rule / red / flip cards, the tissue map, title
//   past.tsx        flashbacks
//   live.tsx        CH9–10: the view from the beam, the confrontation under two lights, dawn, the end card

const Station: ShotComponent = p => (STATION_INSERTS.has(p.shot.view ?? '') ? <StationInsert {...p} /> : <StationScene {...p} />);

/** a place's usual scene, except the views CH9–10 draw themselves (live.tsx) */
const withLive = (scene: string, Base: ShotComponent): ShotComponent => p => {
  const Own = liveView(scene, p);
  return Own ? <Own {...p} /> : <Base {...p} />;
};

// each name written out so `npm run story` can see which scenes exist
export default {
  station: Station,
  road: withLive('road', SALA.road),
  sala: withLive('sala', SALA.sala),
  shop: withLive('shop', SALA.shop),
  shortcut: NIGHT.shortcut,
  checkpoint: CHECKPOINT.checkpoint,
  room: withLive('room', ROOMS.room),
  rearfile: ROOMS.rearfile,
  helmet: DEVICES.helmet,
  barscreen: withLive('barscreen', DEVICES.barscreen),
  hand: withLive('hand', INSERTS.hand),
  phone: withLive('phone', INSERTS.phone),
  card: INSERTS.card,
  map: INSERTS.map,
  title: INSERTS.title,
  past: PAST.past,
  hut: HUT_SCENES.hut,
  livefeed: LIVE.livefeed,
  endcard: LIVE.endcard,
} as Record<string, ShotComponent>;
