import type {ShotComponent} from '../engine/episode';
import {Room} from './Room';
import {Rules} from './Rules';
import {MapView} from './MapView';
import {News} from './News';
import {Next} from './Next';

/** Generic scenes every episode can use by name in story.json. Per-episode scenes.tsx entries override these. */
export const genericScenes: Record<string, ShotComponent> = {
  room: Room, rules: Rules, map: MapView, news: News, next: Next,
  // names used by the old template
  'example-room': Room, 'example-rules': Rules, 'example-map': MapView, 'example-news': News, 'example-next': Next,
};
