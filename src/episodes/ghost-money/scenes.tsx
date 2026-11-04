import React from 'react';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {FLOOR, Sky, Boards, Planks, Glow} from '../../kit/world';
import {Gate, Road} from '../../kit/temple';
import {RuleCardScene} from '../../kit/inserts';
import {EndCardScene} from '../../kit/EndCard';
import {Actors} from './cast';
import {parseActor} from '../../kit/stage';
import {
  Stage,
  SideRoadSet,
  Motorcycle,
  SalaFuneralSet,
  SalaBackSet,
  GroceryStoreSet,
  TikHouseSet,
  PoliceStationSet,
  MansionSickbedSet,
} from './sets';
import {
  HandScene,
  PhoneScene,
  ClockScene,
  StoreInsertScene,
  HouseFanInsert,
  PolicePlanInsert,
  DiagramScene,
  TitleScene,
} from './inserts';

const SALA_PRESETS: Record<string, number[]> = {
  wide: [1, 1.04, 960, 540],
  desk: [1.1, 1.15, 880, 560],
  'desk-close': [1.6, 1.65, 880, 560],
  row: [1.08, 1.12, 1010, 600],
  'tham-close': [1.85, 1.90, 900, 590],
  'mek-close': [1.85, 1.90, 1120, 590],
  behind: [1.15, 1.20, 1000, 600],
  exit: [1.15, 1.20, 960, 560],
};

const SalaScene: ShotComponent = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  const v = shot.view ?? 'wide';
  const tone = d.light === 'dim' ? 'dim' : d.light === 'morning' ? 'morning' : 'night';
  const seatedXs = ((d.cast ?? []) as string[]).map(parseActor).filter(a => a.pose === 'sit').map(a => a.x);

  if (v === 'back' || v === 'altar-back') {
    return (
      <Stage {...p} presets={SALA_PRESETS}>
        <SalaBackSet view={v} beam={Boolean(d.beam)} pile={Boolean(d.pile)} frame={frame} />
        <Actors p={p} />
      </Stage>
    );
  }

  return (
    <Stage {...p} presets={SALA_PRESETS}>
      {v === 'wide' && (
        <SalaFuneralSet
          tone={tone}
          clockTime="22:30"
          showDesk
          deskX={480}
          showChairs
          seatedXs={seatedXs}
          chairXs={[860, 1140]}
          showCoffin
          coffinX={1560}
          frame={frame}
        />
      )}

      {(v === 'desk' || v === 'desk-close') && (
        <SalaFuneralSet
          tone={tone}
          clockTime="22:05"
          showDesk
          deskX={880}
          spilled={Boolean(d.spilled)}
          showChairs={false}
          showCoffin={false}
          frame={frame}
        />
      )}

      {(v === 'row' || v === 'tham-close' || v === 'mek-close') && (
        <SalaFuneralSet
          tone={tone}
          clockTime="23:15"
          showDesk={false}
          showChairs
          seatedXs={seatedXs}
          chairXs={[660, 960, 1260]}
          bowls={Boolean(d.bowls)}
          showCoffin={false}
          knocks={Number(d.knocks ?? 0)}
          frame={frame}
        />
      )}

      {v === 'behind' && (
        <SalaFuneralSet
          tone={tone}
          clockTime="22:40"
          showDesk={false}
          showChairs
          seatedXs={seatedXs}
          chairXs={[580, 1080]}
          sarong
          showCoffin={false}
          frame={frame}
        />
      )}

      {v === 'coffin' && (
        <SalaFuneralSet
          tone={tone}
          clockTime={d.candles === 'out' ? '04:00' : '01:00'}
          showDesk={false}
          showChairs={false}
          showCoffin
          coffinX={1180}
          photo={(d.photo as 'covered' | 'glow' | 'mek') ?? 'covered'}
          clothMove={d.cloth === 'move'}
          candlesOut={d.candles === 'out'}
          emptyCoffin={Boolean(d.empty)}
          showMonks={Boolean(d.monks)}
          chant={Boolean(d.chant)}
          knocks={Number(d.knocks ?? 0)}
          frame={frame}
        />
      )}

      {v === 'exit' && (
        <SalaFuneralSet
          tone="dim"
          clockTime="04:00"
          showDesk={false}
          showChairs
          seatedXs={seatedXs}
          chairXs={[520, 820]}
          showCoffin={false}
          candlesOut
          frame={frame}
        />
      )}

      {(v === 'under-chair' || v === 'clock-glass') && (
        <SalaFuneralSet
          tone={tone}
          clockTime="23:45"
          showDesk={false}
          showChairs={v === 'under-chair'}
          seatedXs={seatedXs}
          chairXs={[780, 1120]}
          showCoffin
          coffinX={v === 'clock-glass' ? 1020 : 1460}
          photo="glow"
          frame={frame}
        />
      )}

      <Actors p={p} />
    </Stage>
  );
};

const StoreScene: ShotComponent = p => {
  const v = p.shot.view ?? 'front';
  if (v === 'eggs' || v === 'glass' || v === 'glass-close') {
    return <StoreInsertScene {...p} />;
  }
  return (
    <Stage {...p}>
      <GroceryStoreSet showCounter={v !== 'front'} showRoad={v === 'front'} />
      {v === 'front' && <Motorcycle x={380} y={FLOOR + 12} scale={0.95} showBox />}
      <Actors p={p} />
    </Stage>
  );
};

const RoadScene: ShotComponent = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  const v = shot.view ?? 'parked';
  const isDay = d.light === 'morning' || d.light === 'day';

  return (
    <Stage {...p}>
      <SideRoadSet tone={isDay ? 'day' : 'dusk'} moving={v === 'ride'} frame={frame} />
      {v === 'ride' ? (
        <Motorcycle
          x={680}
          y={860}
          scale={1.06}
          headlight
          showBox
          rider={{face: isDay ? 'happy' : 'wary'}}
          wheelSpin={frame * 18}
        />
      ) : (
        <>
          <Motorcycle
            x={1180}
            y={875}
            scale={v === 'bike' ? 1.08 : 1.02}
            headlight={!isDay}
            showBox
          />
          <Actors
            p={p}
            floor={885}
            cast={v === 'tham-close' ? ['tham@720 happy arm=r-hold prop=phone'] : undefined}
          />
        </>
      )}
    </Stage>
  );
};

const GateScene: ShotComponent = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  const v = shot.view ?? 'approach';
  const isDay = d.light === 'morning' || d.light === 'day';

  if (v === 'stairs') {
    return (
      <Stage {...p}>
        <Sky tone="dawn" y={640} />
        <Planks y={-100} h={FLOOR + 100} c0="#261b14" c1="#140e0a" />
        {/* Wooden pavilion stairs going down */}
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 360 + i * 180,
              top: FLOOR - 120 + i * 32,
              width: 1200 - i * 180,
              height: 36,
              background: '#3d2a1d',
              borderTop: '4px solid #5c402c',
            }}
          />
        ))}
        <Boards y={FLOOR} c0="#2a1d15" c1="#140d09" />
        <Glow x={480} y={360} r={320} color="180,200,255" a={0.18} />
        <Actors p={p} />
      </Stage>
    );
  }

  return (
    <Stage {...p}>
      <Gate tone={isDay ? 'morning' : 'night'} sign="วัดดงสะเดา" open={1} />
      <Motorcycle
        x={680}
        y={FLOOR - 10}
        scale={1.02}
        headlight={!isDay}
        showBox
        eggsBag={!isDay}
        rider={{face: isDay ? 'happy' : 'wary'}}
        wheelSpin={frame * 16}
      />
    </Stage>
  );
};

const HouseScene: ShotComponent = p => {
  const {shot} = p;
  const d = shot.data ?? {};
  const v = shot.view ?? 'yard';
  if (v === 'fan') {
    return <HouseFanInsert {...p} />;
  }
  return (
    <Stage {...p}>
      <TikHouseSet view={v as 'yard' | 'porch' | 'bike'} fan={Boolean(d.fan)} memorial={Boolean(d.memorial)} />
      <Actors p={p} />
    </Stage>
  );
};

const PoliceScene: ShotComponent = p => {
  if (p.shot.view === 'plan') {
    return <PolicePlanInsert {...p} />;
  }
  return (
    <Stage {...p}>
      <PoliceStationSet />
      <Actors p={p} />
    </Stage>
  );
};

const MansionScene: ShotComponent = p => (
  <Stage {...p}>
    <MansionSickbedSet frame={p.f} />
    <Actors p={p} cast={((p.shot.data?.cast as string[] | undefined) ?? []).filter(c => !c.startsWith('patient'))} />
  </Stage>
);

export const scenes: Record<string, ShotComponent> = {
  sala: SalaScene,
  hand: HandScene,
  phone: PhoneScene,
  store: StoreScene,
  road: RoadScene,
  gate: GateScene,
  clock: ClockScene,
  rule: p => <RuleCardScene p={p} />,
  house: HouseScene,
  police: PoliceScene,
  mansion: MansionScene,
  diagram: DiagramScene,
  title: TitleScene,
  end: p => <EndCardScene p={p} />,
};

export default scenes;
