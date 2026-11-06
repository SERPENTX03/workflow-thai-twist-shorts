// Studio gallery: places as they are shot, parts as they are lit. A place card is one set from three camera positions,
// with people doing something in the set's own light (the framings rear-cam actually uses: wide z .9, medium z 1.8,
// close z 3.2), because a place is a place to shoot from, not one picture. A part card is one kit piece on a plate.
// Lists: src/gallery.json (places, parts). Frame N draws item N.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CastSprite, type CastId} from './cast/CastSprite';
import {Sprite} from './cast/Sprite';
import type {ShotProps} from './engine/episode';
import castJson from './cast.json';
import G from './gallery.json';
import {CarInterior, CarKnee, CarWheel, DRIVER} from './kit/car';
import {CaretakerHut, Dapple, HutBench, PressureLantern, Raincoat, SunRake} from './kit/hut';
import {CemeteryGate, CemeteryRoad, Grave, Headlight, RoadsideMemorial, Sala8, Tamarind} from './kit/cemetery';
import {Checkpoint} from './kit/checkpoint';
import {ChildPhoto, ChildRoom, KidShoe, ToyCar} from './kit/childroom';
import {Haze} from './kit/depth';
import {GasStation} from './kit/gasstation';
import {BarScreen, HelmetBack, HelmetCams, HelmetOnSeat, HelmetShell} from './kit/helmet';
import {Grain} from './kit/horror';
import {GoldPile} from './kit/live';
import {DarkPassage} from './kit/passage';
import {Canal, Motorcycle, ShopRow, SideRoadSet, StiltHouse} from './kit/places';
import {RENTED_ROOM, RentedRoom, rentedRoomScreen} from './kit/rentedroom';
import {Actors, Stage, type RosterEntry} from './kit/stage';
import {CarOutside, CopyCounter, HouseFront, PoliceTruck, SchoolFront, SchoolRoom, SchoolStore, WoodRoom} from './kit/village';
import {FallenBike, Sedan} from './kit/vehicles';
import {FLOOR, Glow, WallClock} from './kit/world';

const usePick = <X,>(list: readonly X[]) => list[Math.min(useCurrentFrame(), list.length - 1)];
const F = 36;

const roster = (cast: string[]) => Object.fromEntries(cast.map(c => {
  const id = c.split(/[@ ]/)[0];
  return [id, {cm: (castJson as Record<string, {cm?: number}>)[id]?.cm ?? 170, symbol: () => id as CastId} as RosterEntry];
}));
const shotOf = (data: Record<string, unknown>): ShotProps => ({
  f: F, len: 90, W: 1920, H: 1080, shot: {scene: 'gallery', view: '', beats: 4, i: 0, from: 0, frames: 90, text: '', style: 'plain', data},
});

const RIDER = {shirt: '#2f5f8f', pants: '#26364d', skin: '#e2ae86', skinD: '#c48e68', hairColor: '#16161c', vest: false, helmet: true};
const Bike: React.FC<{x?: number; face?: string; helmet?: boolean; headlight?: boolean; flip?: boolean}> = ({x = 660, face = 'wary', helmet = true, headlight, flip}) => (
  <Motorcycle x={x} y={FLOOR} color="#2c3a4a" headlight={headlight} flip={flip} rider={{...RIDER, face, helmet, extra: (
    <>
      {helmet && <HelmetCams side rec f={F} />}
      <path d="M88 142 Q100 154 112 142 Z" fill="#f2efe9" />
      <line x1="100" y1="152" x2="100" y2="312" stroke="#183452" strokeWidth="3" />
    </>
  )}} />
);

type Place = {
  /** drawn behind the people */
  set: React.ReactNode;
  /** drawn in front of the people */
  front?: React.ReactNode;
  light: string;
  lightAt?: [number, number];
  cast?: string[];
  /** [zoom, centre x, centre y]: the big frame, then the two small ones */
  cams: [[number, number, number], [number, number, number], [number, number, number]];
  floor?: number;
  ppc?: number;
};

const R = RENTED_ROOM.ROOM;
const SCREEN = rentedRoomScreen(R);
const BED = RENTED_ROOM.BED_EDGE;

const PLACES: Record<string, Place> = {
  'gas-station': {
    set: <><GasStation f={F} tone="night" neon="on" /><Haze y={620} h={260} f={F} a={0.1} /><Bike helmet={false} face="tired" /></>,
    cast: ['villain-male-A@1240 yaw=-0.35 armR=pocket armL=chest smirk'],
    light: 'lamp', lightAt: [420, 240], cams: [[0.9, 960, 540], [1.8, 900, 500], [3.2, 1240, 510]],
  },
  'gas-station-back': {
    set: <GasStation f={F} view="back" tone="night" neon="flick" gate="opening" />,
    cast: ['lead-male-A@760 back'],
    light: 'lamp', lightAt: [1520, 240], cams: [[0.95, 960, 540], [1.6, 1300, 520], [2.6, 1320, 620]],
  },
  checkpoint: {
    set: <><Checkpoint f={F} /><Bike /></>,
    cast: ['police-A@1240 yaw=-0.4 armL=hold prop=book@l acc=glasses wary'],
    light: 'night', lightAt: [1500, 330], cams: [[0.95, 960, 540], [1.5, 900, 760], [3.2, 1240, 505]],
  },
  'cemetery-road': {
    set: <><CemeteryRoad f={F} tone="night" horizon={470} fog /><CemeteryGate x={1240} y={880} s={0.8} tone="night" /><Headlight x={600} y={760} angle={-8} len={900} a={0.36} /><Bike x={420} /></>,
    light: 'night', lightAt: [980, 640], cams: [[0.9, 960, 540], [1.3, 1040, 680], [2.6, 340, 530]],
  },
  'sala-8': {
    set: <>
      <CemeteryRoad f={F} tone="night" horizon={560} vx={1000} road={false} fog />
      <Sala8 x={1000} y={990} s={1.3} tone="night" box="placed" lit={0.8} />
      <Headlight x={170} y={760} angle={6} len={900} spread={18} a={0.4} />
      <Haze y={860} h={220} f={F} a={0.16} />
    </>,
    cast: ['lead-male-A@700 yaw=0.4 armR=offer prop=box worried'],
    light: 'night', lightAt: [520, 640], cams: [[0.9, 1000, 540], [1.8, 720, 500], [3, 700, 510]],
  },
  'caretaker-hut': {
    set: <>
      <CemeteryRoad f={F} tone="day" horizon={640} fog={false} road={false} />
      <CaretakerHut x={1180} y={930} s={1} tone="day" line={false} />
      <HutBench x={1600} y={938} s={1.05} />
      <Dapple f={F} x={-100} y={840} w={2100} h={260} seed={5} a={0.35} />
    </>,
    front: <SunRake />,
    cast: ['lead-male-A@560 yaw=0.4 armR=hold armL=rest wary', 'maternal-grandfather-A@1240 yaw=-0.3 armL=reach wary'],
    light: 'day', lightAt: [180, 120], cams: [[0.9, 960, 540], [1.6, 1240, 640], [3.3, 1240, 535]],
  },
  'rented-room': {
    set: <RentedRoom r={R} screen tube={false} dawn={0} />,
    cast: [`lead-male-A@${Math.round(BED.x)},${Math.round(BED.y)} sit yaw=0.45 armR=chin worried`],
    light: 'dim', lightAt: [SCREEN.x, SCREEN.y], cams: [[0.92, 900, 540], [1.9, 760, 620], [3.2, Math.round(BED.x), Math.round(BED.y) - 310]],
  },
  'highway-road': {
    set: <><SideRoadSet tone="night" frame={F} moving /><Bike x={960} headlight /></>,
    light: 'night', lightAt: [1240, 620], cams: [[1, 960, 540], [1.6, 900, 760], [2.8, 870, 530]],
  },
  'shop-row': {
    set: <><ShopRow tone="night" f={F} /><Haze y={700} h={240} f={F} a={0.12} /></>,
    cast: ['lead-male-A@700 yaw=0.3 armL=face shock'],
    light: 'night', lightAt: [860, 200], cams: [[0.9, 960, 540], [1.7, 760, 640], [3.2, 700, 510]],
  },
  'child-room': {
    set: <ChildRoom f={F} under="shoe" reflect="girl" />,
    cast: ['mother-B@1430 sit yaw=-0.45 armR=chest worried'],
    light: 'lamp', lightAt: [1500, 380], cams: [[1, 960, 540], [1.35, 1110, 640], [3, 1430, 640]],
  },
  'wood-kitchen': {
    set: <WoodRoom view="kitchen" />,
    cast: ['mother-A@1240 yaw=-0.4 armR=hold prop=bowl wary'],
    light: 'lamp', lightAt: [1400, 300], cams: [[1, 960, 540], [1.7, 1100, 560], [3.2, 1240, 515]],
  },
  'wood-closet': {
    set: <WoodRoom view="closet" jacket />,
    cast: ['lead-male-A@560 yaw=0.5 armR=reach worried'],
    light: 'lamp', lightAt: [1200, 300], cams: [[1, 960, 540], [1.7, 1100, 520], [3.2, 560, 510]],
  },
  'house-front': {
    set: <HouseFront open={0.6} night />,
    cast: ['lead-female-A@560 yaw=0.5 armR=chest worried'],
    light: 'night', lightAt: [960, 500], cams: [[0.95, 960, 540], [1.7, 800, 560], [3.2, 560, 515]],
  },
  'car-cabin': {
    set: <><CarInterior view="drive" f={F} night moving /><CarWheel /></>,
    front: <CarKnee />,
    cast: ['lead-male-A@740 arm=b-wheel prop=wheel wary'],
    floor: DRIVER.floor, ppc: DRIVER.pxPerCm,
    light: 'night', lightAt: [960, 200], cams: [[1, 960, 540], [1.6, 760, 500], [2.8, 740, 340]],
  },
  'car-seat': {
    set: <CarInterior view="seat" f={F} seat="torn" />,
    light: 'morning', cams: [[1, 960, 540], [1.6, 960, 620], [2.6, 960, 720]],
  },
  'car-outside': {
    set: <><HouseFront windows={false} /><PoliceTruck x={420} f={F} /><CarOutside x={1360} camera /></>,
    light: 'dusk', cams: [[0.95, 960, 540], [1.6, 1360, 700], [2, 420, 720]],
  },
  'school-front': {
    set: <SchoolFront />,
    cast: ['teacher-B@560 yaw=0.45 armR=chest worried'],
    light: 'day', cams: [[0.95, 960, 540], [1.7, 720, 600], [3.2, 560, 515]],
  },
  'school-office': {
    set: <SchoolRoom view="office" f={F} />,
    cast: ['teacher-A@1300 sit yaw=-0.5 armL=hold prop=paper tired'],
    light: 'warm', lightAt: [1300, 240], cams: [[1, 960, 540], [1.7, 1200, 600], [3.2, 1300, 625]],
  },
  'school-store': {
    set: <SchoolStore f={F} envelopes={6} />,
    cast: ['lead-male-A@1240 back'],
    light: 'lamp', lightAt: [900, 240], cams: [[1, 960, 540], [1.7, 700, 500], [2.4, 1240, 620]],
  },
  'copy-shop': {
    set: <CopyCounter f={F} />,
    cast: ['aunt-family-A@960 yaw=-0.3 armR=hold prop=paper wary'],
    light: 'warm', cams: [[1, 960, 540], [1.7, 960, 520], [3.2, 960, 515]],
  },
  'dark-passage': {
    set: <DarkPassage f={F} view="passage" />,
    light: 'lamp', lightAt: [240, 500], cams: [[1, 960, 540], [1.6, 700, 620], [2.4, 960, 860]],
  },
  'stilt-house': {
    set: <StiltHouse tone="night" f={F} far />,
    cast: ['maternal-grandmother-A@1240 yaw=-0.4 armL=hold prop=lantern@l wary'],
    light: 'night', lightAt: [960, 440], cams: [[1, 960, 540], [1.6, 1100, 640], [3.2, 1240, 535]],
  },
  canal: {
    set: <Canal tone="dusk" f={F} />,
    cast: ['lead-male-A@560 crouch yaw=0.3 worried'],
    light: 'dusk', cams: [[1, 960, 540], [1.6, 720, 720], [3, 560, 670]],
  },
};

const Panel: React.FC<{x: number; y: number; k: number; pl: Place; cam: [number, number, number]}> = ({x, y, k, pl, cam}) => {
  const cast = pl.cast ?? [];
  const p = shotOf({light: pl.light, lightAt: pl.lightAt, cam: [cam[0], cam[0], cam[1], cam[2]], cast});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: '0 0', overflow: 'hidden'}}>
      <Stage p={p} light={pl.light} world={
        <>
          {pl.set}
          {cast.length > 0 && <Actors p={p} roster={roster(cast)} speaking={() => false} floor={pl.floor ?? FLOOR} pxPerCm={pl.ppc ?? 3} />}
          {pl.front}
        </>
      } />
    </div>
  );
};

/** 1920x720: the big frame and two more camera positions of the same place */
export const GPlaces: React.FC = () => {
  const {id} = usePick(G.places);
  const pl = PLACES[id];
  return (
    <AbsoluteFill style={{background: '#07090d', overflow: 'hidden'}}>
      <CastSprite />
      <Panel x={0} y={0} k={2 / 3} pl={pl} cam={pl.cams[0]} />
      <Panel x={1284} y={0} k={636 / 1920} pl={pl} cam={pl.cams[1]} />
      <Panel x={1284} y={362} k={636 / 1920} pl={pl} cam={pl.cams[2]} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- parts: one kit piece, lit, on a plate

const Night: React.FC<{children: React.ReactNode; glow?: [number, number, number]}> = ({children, glow = [960, 460, 720]}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#10141c, #0a0d14 62%, #15171b 62%, #0b0c0f)'}} />
    <Glow x={glow[0]} y={glow[1]} r={glow[2]} color="190,205,235" a={0.3} />
    {children}
  </>
);
const Day: React.FC<{children: React.ReactNode}> = ({children}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#b8c4c8, #dfe0d4 62%, #8f7f64 62%, #6f614a)'}} />
    {children}
  </>
);
const Desk: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = '#2a2019'}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 42%, ${color}, #08090c 78%)`}} />
    {children}
  </>
);
/** a drawing made for a 200 x 520 head frame, at any size */
const Frame200: React.FC<{x: number; y: number; s: number; children: React.ReactNode}> = ({x, y, s, children}) => (
  <svg viewBox="0 0 200 520" width={200 * s} height={520 * s} style={{position: 'absolute', left: x - 100 * s, top: y, overflow: 'visible'}}>{children}</svg>
);
const Place2: React.FC<{x: number; y: number; s?: number; children: React.ReactNode}> = ({x, y, s = 1, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: '50% 50%'}}>{children}</div>
);

const PARTS: Record<string, React.ReactNode> = {
  graves: <Day><Grave x={520} y={780} s={1.7} tone="day" kind={0} /><Grave x={960} y={810} s={2.1} tone="day" kind={1} lean={-5} /><Grave x={1400} y={780} s={1.7} tone="day" kind={2} lean={4} /></Day>,
  tamarind: <Day><Tamarind x={960} y={900} s={1.1} tone="day" /></Day>,
  'cemetery-gate': <Night><CemeteryGate x={960} y={930} s={0.92} tone="night" aged /></Night>,
  'sala-8-part': <Night><Sala8 x={960} y={950} s={1.05} tone="night" box="open" lit={0.7} /></Night>,
  memorial: <Day><RoadsideMemorial x={960} y={830} s={1.8} tone="day" fresh /></Day>,
  'pressure-lantern': <Desk><PressureLantern x={960} y={260} s={2.4} lit={1} tone="night" /></Desk>,
  raincoat: <Desk color="#2c2a26"><Raincoat x={960} y={160} s={1.7} logo="17" tag tone="day" /></Desk>,
  'hut-bench': <Day><HutBench x={960} y={820} s={2} /></Day>,
  'helmet-shell': <Desk color="#20262e"><Frame200 x={960} y={300} s={4.4}><HelmetShell shield fog={0.2} /><HelmetCams rec f={F} /></Frame200></Desk>,
  'helmet-back': <HelmetBack f={F} rec cable tilt={-4} />,
  'helmet-seat': <HelmetOnSeat f={F} rec rearDead />,
  'bar-screen': <BarScreen f={F} signal road="gravel" label="● REAR" />,
  'gold-pile': <Desk color="#2a2218"><GoldPile x={960} y={620} s={2.2} f={F} /></Desk>,
  'motorcycle-parked': <Night glow={[960, 560, 760]}><Motorcycle x={960} y={880} scale={1.25} color="#8a2a22" helmetOnBike /></Night>,
  sedan: <Night glow={[1200, 700, 700]}><Sedan x={960} y={840} s={1.7} /></Night>,
  'fallen-bike': <Night glow={[960, 700, 600]}><FallenBike x={960} y={720} s={1.6} rot={-10} /></Night>,
  'police-truck': <Night><div style={{position: 'absolute', left: 0, top: -60, width: 1920, height: 1080}}><PoliceTruck x={960} f={F} /></div></Night>,
  'car-side': <Night><div style={{position: 'absolute', left: 0, top: -60, width: 1920, height: 1080}}><CarOutside x={960} camera /></div></Night>,
  'child-things': <Desk color="#3a2e24"><Place2 x={420} y={180} s={3}><ChildPhoto kind="girl" /></Place2><Place2 x={1040} y={330} s={2.6}><KidShoe /></Place2><Place2 x={1120} y={720} s={2.6}><ToyCar /></Place2></Desk>,
  'wall-clock-part': <Desk color="#57503f"><WallClock x={960} y={520} t="03:52" r={330} tick={1.2} /></Desk>,
};

/** 1920x1080: one kit piece on a plate, in light */
export const GParts: React.FC = () => {
  const {id} = usePick(G.parts);
  return (
    <AbsoluteFill style={{background: '#07090d', overflow: 'hidden'}}>
      <CastSprite />
      {PARTS[id]}
      <Grain f={F} opacity={0.08} />
    </AbsoluteFill>
  );
};

export {Sprite};
