import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {appear, kf} from '../../engine/anim';
import {T} from '../../engine/theme';
import {FLOOR, full} from '../../kit/world';
import {Canal, StiltHouse} from '../../kit/places';
import {CarInterior, CarKnee, CarWheel, DRIVER} from '../../kit/car';
import {CameraScene, ClassPhotoScene, EnvelopeScene, NewsScene} from './inserts-school';
import {CHILD_ROOM_CAMS} from '../../kit/childroom';
import {CarOutside, CopyCounter, HouseFront, OfficeDesk, PoliceTruck, SchoolFront, SchoolRoom, SchoolStore, StaffBoard, WoodRoom} from '../../kit/village';
import {Glow} from '../../kit/world';
import {parseActor} from '../../kit/stage';
import {EndCardScene} from '../../kit/EndCard';
import {Actors} from './cast';
import {splitView} from './camera';
import {BusInCanal, HouseRoom, NetRack, PierHatch, PierPosts, SalaRoof, SiblingRoom, Stage, StiltUnder} from './sets';
import {MedalScene, RubbingScene, SlipScene, ThumbScene, TonEnvelopeScene} from './inserts-night';
import {DrawerScene, Rooms6Scene, SpoonMirrorScene, ThumbPhotoScene, TimerPhotoScene, TornScene} from './inserts-end';
import {DarkPassage} from '../../kit/passage';
import {ClockScene, HandScene, MapScene, NotebookScene, PhoneScene, PhotoScene, TitleScene} from './inserts';

// same-child scene switch: one component per set, `view` picks the camera (and a few dressing details).
// Close-up views ending in -close reuse the wide set; Stage auto-frames the speaker when data.cam is absent.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const base = (v: string) => v.replace(/-close$/, '');
const withData = (p: ShotProps, extra: Record<string, unknown>, view?: string): ShotProps =>
  ({...p, shot: {...p.shot, view: view ?? p.shot.view, data: {...(p.shot.data ?? {}), ...extra}}});

/** child-room cameras per view name (all three houses share the room, so they share these) */
const ROOM_CAMS: Record<string, number[]> = {
  room: CHILD_ROOM_CAMS.room,
  tonroom: CHILD_ROOM_CAMS.room,
  bed: CHILD_ROOM_CAMS.bed,
  'bed-close': [1.6, 1.68, 1000, 700],
  frame: CHILD_ROOM_CAMS.frame,
  tondoor: CHILD_ROOM_CAMS.door,
  door: CHILD_ROOM_CAMS.door,
};

const Flash: React.FC<{f: number; at?: number}> = ({f, at = 12}) => {
  const k = f < at ? 0 : Math.max(0, 1 - (f - at) / 8);
  return k > 0 ? <AbsoluteFill style={{background: `rgba(255,255,255,${0.7 * k})`, pointerEvents: 'none'}} /> : null;
};

/** knocks travelling through the wall: rings at the jamb; walk = the answer slides along the wall to the door frame */
const WallKnock: React.FC<{f: number; walk?: boolean; x0?: number; n?: number}> = ({f, walk, x0 = 520, n = 2}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const t = ((f - i * 14) % 44) / 44;
      const x = walk ? 1500 - Math.min(1, f / 60) * 1080 : x0;
      return t > 0 ? <div key={i} style={{position: 'absolute', left: x - 40 - t * 90, top: 520 - t * 90, width: 80 + t * 180, height: 80 + t * 180, borderRadius: '50%',
        border: `5px solid rgba(255,235,190,${0.85 * (1 - t)})`, pointerEvents: 'none'}} /> : null;
    })}
  </>
);

/** Ton hugs his pillow, dented as if he just got up */
const Pillow: React.FC<{x: number}> = ({x}) => (
  <div style={{position: 'absolute', left: x - 75, top: FLOOR - 250, width: 150, height: 90, background: '#f6f1e6', borderRadius: 34, boxShadow: '0 6px 0 rgba(0,0,0,.15)', zIndex: 30}}>
    <div style={{position: 'absolute', left: 40, top: 22, width: 70, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,.14)'}} />
  </div>
);

// ---------------------------------------------------------------- Mali's house (house 2)

const MaliScene: ShotComponent = p => {
  const v = p.shot.view ?? 'room';
  const d = D(p);
  if (v === 'door' || v === 'porch') {
    return (
      <Stage {...p} presets={{door: [1.02, 1.06, 960, 560], porch: [1.1, 1.16, 960, 600]}}>
        <HouseFront c="#b98a62" open={v === 'porch' ? 0.9 : 0.6} night={['night', 'lamp', 'dark'].includes(d.light)} />
        <Actors p={p} />
        {d.pillow && ((d.cast ?? []) as string[]).map(parseActor).filter(a => a.who === 'ton').map(a => <Pillow key="pillow" x={a.x} />)}
      </Stage>
    );
  }
  if (v === 'table' || v === 'table-close') {
    return (
      <Stage {...p} presets={{table: [1.04, 1.08, 960, 600]}}>
        <WoodRoom view="dining" plates={d.plates ?? 0} fishbone={(d.plates ?? 0) > 1} lamp={['night', 'lamp'].includes(d.light) ? 1 : 0} wall={['#a8805c', '#8a6444']} />
        <Actors p={p} />
      </Stage>
    );
  }
  const cast = (d.cast ?? []) as string[];
  const presets = cast.length && v === 'frame' ? {...ROOM_CAMS, frame: [1.3, 1.36, 640, 600]} : ROOM_CAMS;
  return (
    <Stage {...p} presets={presets}>
      <HouseRoom house="mali" p={p} />
      {d.knock && <WallKnock f={p.f} walk={d.knock === 'walk'} />}
      <Actors p={p} />
    </Stage>
  );
};

// ---------------------------------------------------------------- Rampai's house (house 1, road head)

const PintoPaper: React.FC = () => (
  <svg width={300} height={220} viewBox="0 0 300 220">
    <text x="20" y="34" fontSize="26" fill="#5a2a24" fontFamily="Plex Thai, sans-serif">ส่งปิ่นโต</text>
    <path d="M20 120 Q150 210 280 120" stroke="#4a7ab0" strokeWidth="10" fill="none" opacity=".6" />
    {[[30, 92], [70, 120], [115, 140], [150, 146], [185, 140], [230, 120], [270, 92]].map(([x, y], i) => (
      <rect key={i} x={x - 12} y={y - 30} width={24} height={20} fill="#f2ead8" stroke="#3a3a3a" strokeWidth="2.5" />
    ))}
  </svg>
);

const RumpaiScene: ShotComponent = p => {
  const v = base(p.shot.view ?? 'kitchen');
  const d = D(p);
  if (v === 'kitchen' || v === 'table') {
    return (
      <Stage {...p} presets={{kitchen: [1, 1.04, 960, 560], table: [1.25, 1.3, 960, 640], 'table-close': [1.6, 1.66, 900, 640]}}>
        <WoodRoom view={v === 'table' ? 'dining' : 'kitchen'} paper={<PintoPaper />} book={v === 'table' && !!d.notebook} plates={v === 'table' ? 1 : 0} />
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'closet') {
    return (
      <Stage {...p} presets={{closet: [1.02, 1.06, 1000, 560]}}>
        <WoodRoom view="closet" jacket />
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'hall') {
    return (
      <Stage {...p} presets={{hall: [1.04, 1.08, 960, 560], 'hall-close': [1.5, 1.56, 760, 520]}}>
        <WoodRoom view="hall" />
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'fence') {
    return (
      <Stage {...p} presets={{fence: [1.1, 1.14, 960, 600]}}>
        <HouseFront c="#7a8a84" night windows open={0} />
        <Glow x={1840} y={760} r={90} a={0.7} />
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'drawer') return <DrawerScene {...p} />;
  if (v === 'mirror') return <SpoonMirrorScene {...p} />;
  const cast = (d.cast ?? []) as string[];
  const cams: Record<string, number[]> = {
    ...ROOM_CAMS,
    cabinet: [1.3, 1.36, 1180, 520],
    tondoor: cast.length ? [1.12, 1.18, 1300, 580] : CHILD_ROOM_CAMS.door,
    threshold: [1.15, 1.2, 1250, 600],
    frame: [1.7, 1.78, 430, 720],
  };
  return (
    <Stage {...p} presets={cams}>
      <HouseRoom house="rumpai" p={p} />
      {v === 'cabinet' && d.knock && <WallKnock f={p.f} x0={1565} n={d.knock} />}
      <Actors p={p} />
      {d.flash && <Flash f={p.f} />}
    </Stage>
  );
};

// ---------------------------------------------------------------- the stilt house (house 3, Pho / Ek)

const StiltScene: ShotComponent = p => {
  const v = base(p.shot.view ?? 'wide');
  const d = D(p);
  const tone = d.light === 'night' || d.light === 'lamp' ? 'night' : d.light === 'dusk' ? 'dusk' : 'day';
  if (v === 'door') {
    return (
      <Stage {...p} presets={{door: [1.25, 1.3, 760, 560]}}>
        <HouseRoom house="stilt" p={p} />
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'under') {
    return (
      <Stage {...p} presets={{under: [1.4, 1.45, 960, 720]}}>
        <StiltUnder f={p.f} dust={d.dust === 'wiped' ? 'wiped' : 'houses'} slit={(p.shot.data?.cast ?? []).some((a: string) => a.includes('arm=r-reach'))} />
        <Actors p={p} floor={FLOOR + 20} />
      </Stage>
    );
  }
  // wide / nets / porch: the house, the hung net beside the stilts
  return (
    <Stage {...p} presets={{wide: [1, 1.04, 960, 540], nets: [1.35, 1.4, 1050, 620], 'nets-close': [1.8, 1.86, 1180, 600], porch: [1.35, 1.4, 1050, 620]}}>
      <StiltHouse tone={tone} f={p.f} />
      <NetRack x={1350} y={430} />
      {d.medals === 'pair' && [1300, 1340].map((x, i) => (
        <div key={x} style={{position: 'absolute', left: x, top: 520}}>
          <div style={{width: 4, height: 50, margin: '0 auto', background: '#3b5fb0'}} />
          <div style={{width: 34, height: 34, borderRadius: '50%', background: i ? '#b8865a' : '#c9ccd2', border: '3px solid #5a5a62'}} />
        </div>
      ))}
      {d.mango === 'half' && (
        <div style={{position: 'absolute', left: 880, top: FLOOR - 120, width: 160, height: 120}}>
          <div style={{position: 'absolute', left: 0, top: 70, width: 160, height: 50, background: '#6a4a30'}} />
          <div style={{position: 'absolute', left: 20, top: 40, width: 70, height: 36, borderRadius: '0 0 35px 35px', background: '#f2efe6'}}>
            <div style={{position: 'absolute', left: 10, top: -10, width: 50, height: 26, borderRadius: '50%', background: '#c8d860'}} />
          </div>
          <div style={{position: 'absolute', left: 104, top: 54, width: 36, height: 20, borderRadius: '0 0 18px 18px', background: '#f6f6f6'}} />
        </div>
      )}
      <Actors p={p} />
    </Stage>
  );
};

// ---------------------------------------------------------------- school

const SchoolScene: ShotComponent = p => {
  const v = base(p.shot.view ?? 'front');
  if (v === 'log') return <HandScene {...p} />;
  if (v === 'store' || v === 'cabinet') {
    const d = D(p);
    const cam = v === 'cabinet' ? (d.camera ? [2.1, 2.2, 1450, 520] : d.reach ? [1.5, 1.56, 820, 600] : [1.7, 1.78, 520, 600]) : undefined;
    return (
      <Stage {...p} cam={cam} presets={{store: [1.02, 1.06, 960, 560]}}>
        <SchoolStore f={p.f} envelopes={v === 'cabinet' && d.envelopes ? d.envelopes : 0} reach={!!d.reach} />
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'front') return <Stage {...p} presets={{front: [1, 1.05, 960, 540]}}><SchoolFront /><Actors p={p} /></Stage>;
  if (v === 'board') return <Stage {...p} presets={{board: [1.05, 1.12, 960, 500]}}><StaffBoard /></Stage>;
  if (v === 'guard') {
    return (
      <Stage {...p} presets={{guard: [1.04, 1.08, 960, 560]}}>
        <SchoolRoom view="office" f={p.f} />
        <Actors p={p} />
        <OfficeDesk x={1180} />
      </Stage>
    );
  }
  return (
    <Stage {...p} presets={{hall: [1.02, 1.06, 960, 560]}}>
      <SchoolRoom view="hall" f={p.f} />
      <Actors p={p} />
    </Stage>
  );
};

// ---------------------------------------------------------------- the rest

const CarScene: ShotComponent = p => {
  const v = p.shot.view ?? 'seat';
  if (v === 'hood') {
    return (
      <Stage {...p} presets={{hood: [1.06, 1.1, 1000, 600]}}>
        <HouseFront c="#c9b88f" windows={false} />
        <CarOutside x={1320} camera={p.shot.who === 'prae' && /กล้อง/.test(p.shot.text)} />
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'seat') {
    return (
      <Stage {...p} presets={{seat: [1.02, 1.08, 960, 560]}}>
        <CarInterior view="seat" f={p.f} seat="new" />
      </Stage>
    );
  }
  // drive / parked: the cabin seen from the front through the windscreen (car.tsx). Phak is a STAND pose at the driver's seat
  // (his own jacket, not the generic sit shirt); the wheel is part of the `arm=b-wheel prop=wheel` pose when he drives, and a
  // wheel behind him otherwise. The knee panel hides his legs.
  const d = D(p);
  const night = ['night', 'lamp', 'dark'].includes(d.light);
  const holdsWheel = ((d.cast ?? []) as string[]).map(parseActor).some(a => a.prop === 'wheel');
  return (
    <Stage {...p} presets={{drive: [1, 1.04, 960, 540], parked: [1, 1.04, 960, 540]}}>
      <CarInterior view="drive" f={p.f} night={night} moving={v === 'drive'} />
      {!holdsWheel && <CarWheel night={night} />}
      <Actors p={p} chairs={false} floor={DRIVER.floor} pxPerCm={DRIVER.pxPerCm} />
      <CarKnee night={night} />
    </Stage>
  );
};

const CanalScene: ShotComponent = p => {
  const d = D(p);
  const tone = d.light === 'dusk' ? 'dusk' : d.light === 'day' ? 'day' : 'night';
  const lantern = ((d.cast ?? []) as string[]).map(parseActor).find(a => a.prop === 'lantern');
  const v = base(p.shot.view ?? 'pier');
  if (v === 'posts') return <Stage {...p} presets={{posts: [1.02, 1.08, 960, 520]}}><PierPosts f={p.f} mark={!!d.mark} /></Stage>;
  if (v === 'hatch') return <Stage {...p} presets={{hatch: [1.05, 1.12, 960, 480]}}><PierHatch f={p.f} /></Stage>;
  if (v === 'sala') {
    return (
      <Stage {...p} presets={{sala: [1.08, 1.12, 960, 600]}}>
        <Canal tone={tone} f={p.f} />
        <SalaRoof f={p.f} />
        <Actors p={p} />
        {((d.cast ?? []) as string[]).map(parseActor).filter(a => a.prop === 'flashlight').map(a => <Glow key="torch" x={a.x - 260} y={FLOOR - 40} r={260} a={0.4} />)}
      </Stage>
    );
  }
  return (
    <Stage {...p} presets={{pier: [1.08, 1.12, 960, 600]}}>
      <Canal tone={tone} f={p.f} />
      {d.lamp && (
        <>
          <div style={{position: 'absolute', left: 1296, top: 640, width: 12, height: FLOOR - 640, background: '#5a3f2a'}} />
          <div style={{position: 'absolute', left: 1280, top: 600, width: 44, height: 56, borderRadius: 10, background: '#ffd98a', boxShadow: '0 0 0 6px #3a2a1c'}} />
          <Glow x={1302} y={628} r={380} a={0.55 + 0.05 * Math.sin(p.f / 5)} />
        </>
      )}
      {/* rotten planks near the end of the pier */}
      <div style={{position: 'absolute', left: 1120, top: FLOOR - 4, width: 120, height: 34, background: '#120c08', transform: 'skewX(-14deg)'}} />
      <div style={{position: 'absolute', left: 1240, top: FLOOR - 2, width: 60, height: 14, background: '#5a3f2a', transform: 'rotate(18deg)'}} />
      <Actors p={p} />
      {lantern && <Glow x={lantern.x + 30} y={FLOOR - 250} r={360} a={0.45} />}
    </Stage>
  );
};

const VillageScene: ShotComponent = p => {
  const v = p.shot.view ?? 'houses';
  const d = D(p);
  if (v === 'houses' || v === 'windows') {
    const lit: number[] = d.lit ?? [];
    return (
      <Stage {...p} presets={{houses: [1.02, 1.06, 960, 560], windows: [1.1, 1.14, 960, 520]}}>
        <Canal tone="night" f={p.f} />
        {/* lit windows of the houses along the bend (houses 4–7 light up in chapter 7) */}
        {[[240, 4], [700, 5], [1160, 6], [1620, 7]].map(([x, n]) => (
          lit.includes(n) ? <Glow key={n} x={x} y={470} r={160} a={0.6} /> : null
        ))}
        {((d.calls ?? []) as string[]).map((name, i) => (
          <div key={name} style={{position: 'absolute', left: [240, 700, 1160, 1620][i] - 70, top: 300 - (i % 2) * 40, width: 140, textAlign: 'center',
            fontFamily: T.display, fontSize: 44, color: T.gold, opacity: appear(p.f, 6 + i * 10, 10), textShadow: '0 3px 12px rgba(0,0,0,.8)'}}>“{name}”</div>
        ))}
        <Actors p={p} />
      </Stage>
    );
  }
  if (v === 'window5') {
    return (
      <Stage {...p} presets={{window5: [1.6, 1.66, 960, 420]}}>
        <HouseFront c="#8a6a48" night windows={false} />
        <div style={{position: 'absolute', left: 820, top: 300, width: 280, height: 240, background: 'linear-gradient(#ffd99a, #e0a050)', boxShadow: 'inset 0 0 0 12px #6a4a30'}}>
          <div style={{position: 'absolute', left: 30, top: 150, width: 220, height: 50, background: '#2f5b8f', borderRadius: 10}} />
        </div>
        <Glow x={960} y={420} r={420} a={0.45} />
      </Stage>
    );
  }
  const open = v === 'door4' ? kf(p.f, [[0, 0.6], [Math.min(50, p.len * 0.7), 0]]) : v === 'door7' ? 0.3 : 0;
  return (
    <Stage {...p} presets={{door4: [1.3, 1.36, 960, 560], door6: [1.3, 1.36, 960, 560], door7: [1.3, 1.36, 960, 560]}}>
      <HouseFront c={v === 'door6' ? '#5a4a3a' : v === 'door7' ? '#7a6a58' : '#8a6a48'} open={open} night={v !== 'door6'} />
      {v === 'door7' && (
        <div style={{position: 'absolute', left: 832, top: 380, width: 256, height: FLOOR - 380, background: 'repeating-linear-gradient(0deg, rgba(20,20,24,.6) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(20,20,24,.6) 0 2px, transparent 2px 6px)'}}>
          <div style={{position: 'absolute', left: 80, top: 60, width: 96, height: 96, borderRadius: '50%', background: '#1a1416'}} />
          <div style={{position: 'absolute', left: 50, top: 150, width: 156, height: 330, borderRadius: '60px 60px 10px 10px', background: '#1a1416'}} />
        </div>
      )}
    </Stage>
  );
};

const DarkScene: ShotComponent = p => {
  const v = base(p.shot.view ?? 'passage') as 'passage' | 'line' | 'deep' | 'meet';
  return (
    <Stage {...p} light="dim" presets={{passage: [1, 1.05, 960, 560], line: [1.02, 1.06, 960, 600], deep: [1.2, 1.26, 1250, 560], meet: [1.1, 1.15, 970, 600]}}>
      <DarkPassage f={p.f} view={v} from={v === 'deep' ? 'none' : 'left'} cloth={v === 'deep'} />
      <Actors p={p} />
    </Stage>
  );
};

const RoadScene: ShotComponent = p => (
  <Stage {...p} presets={{police: [1.02, 1.06, 960, 580]}}>
    <HouseFront c="#8fa6a0" open={0.4} />
    <PoliceTruck x={300} f={p.f} />
    <Actors p={p} />
  </Stage>
);

const CopyScene: ShotComponent = p => (
  <Stage {...p} presets={{counter: [1.02, 1.06, 960, 560]}}>
    <CopyCounter f={p.f} />
    <Actors p={p} />
  </Stage>
);

const PastScene: ShotComponent = p => {
  const v = p.shot.view ?? 'kidroom';
  const d = D(p);
  if (v === 'kidroom') {
    return (
      <Stage {...p} presets={{kidroom: [1.3, 1.36, 960, 720]}}>
        <SiblingRoom f={p.f} knock={d.knock ?? 0} lampOff={d.lamp === 'off'} />
      </Stage>
    );
  }
  if (v === 'school-hall') return <SchoolScene {...withData(p, {cast: ['phak@700 shock', 'rampai@1180 happy']}, 'hall')} />;
  if (v === 'kitchen') return <RumpaiScene {...withData(p, {cast: ['phak@720 sit wary', 'rampai@1180 happy']}, 'kitchen')} />;
  if (v === 'rampai-room') {
    const q = withData(p, {cast: ['rampai@1000 sit sad']}, 'tonroom');
    return (
      <Stage {...q} presets={{tonroom: [1.3, 1.36, 1060, 640]}}>
        <HouseRoom house="rumpai" p={q} extra={{lamp: 0.4}} />
        <Actors p={q} />
        {d.sound === 'mango' && <div style={{position: 'absolute', left: 1240, top: 520, fontFamily: T.display, fontSize: 56, color: '#e8f0a0', opacity: appear(p.f, 10, 8), transform: 'rotate(-8deg)'}}>กร้วม</div>}
        {d.finger && <div style={{position: 'absolute', left: 1060, top: 690, width: 60, height: 22, borderRadius: 11, background: '#dca27a', boxShadow: '0 0 18px rgba(255,240,200,.6)', opacity: appear(p.f, 6, 14)}} />}
      </Stage>
    );
  }
  if (v === 'rampai-visit') {
    if (d.under) {
      const q = withData(p, {cast: ['rampai@1100 crouch sad']}, 'bed');
      return <Stage {...q} presets={{bed: CHILD_ROOM_CAMS.bed}}><HouseRoom house="mali" p={q} /><Actors p={q} /></Stage>;
    }
    const q = withData(p, {cast: ['rampai@760 worried', 'mali@1160 cry']}, 'door');
    return <Stage {...q} presets={{door: [1.04, 1.08, 960, 560]}}><HouseFront c="#b98a62" open={0.7} night /><Actors p={q} /></Stage>;
  }
  if (v === 'mali-past') {
    const q = withData(p, {cast: ['mali@1000 sit cry', 'ton@1560 sad']}, 'room');
    return <Stage {...q} presets={ROOM_CAMS}><HouseRoom house="mali" p={q} extra={{door: 'ajar', lamp: 0.5}} /><Actors p={q} /></Stage>;
  }
  if (v === 'chan-table') {
    return (
      <Stage {...p} presets={{'chan-table': [1.25, 1.3, 960, 640]}}>
        <WoodRoom view="dining" book plates={1} />
        <Actors p={p} cast={['chan@900 sit wary']} />
      </Stage>
    );
  }
  if (v === 'bus') return <Stage {...p} presets={{bus: [1.02, 1.08, 960, 560]}}><BusInCanal f={p.f} /></Stage>;
  return <Stage {...p}><div style={full('#1a1612')} /></Stage>;
};

const CardScene: ShotComponent = p => {
  const d = D(p);
  const lines = String(d.text ?? '').split('\n');
  if (p.shot.style === 'red') {
    const k = appear(p.f, 2, 20);
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #2a0e10, #06050a 70%)'}}>
        <div style={{position: 'absolute', left: 860, top: 260, width: 200, height: 420, opacity: 0.9}}>
          <div style={{position: 'absolute', left: 60, top: 0, width: 84, height: 84, borderRadius: '50%', background: '#0a0a0e', boxShadow: '0 0 40px rgba(255,120,120,.25)'}} />
          <div style={{position: 'absolute', left: 30, top: 80, width: 140, height: 240, borderRadius: '50px 50px 10px 10px', background: '#0a0a0e'}} />
          <div style={{position: 'absolute', left: 20, top: 150, width: 160, height: 90, borderRadius: 34, background: '#d8d0c0'}} />
          <div style={{position: 'absolute', left: 50, top: 320, width: 40, height: 100, background: '#0a0a0e'}} /><div style={{position: 'absolute', left: 110, top: 320, width: 40, height: 100, background: '#0a0a0e'}} />
        </div>
        {Array.from({length: 6}, (_, i) => {
          const a = Math.PI * (1.05 + i * 0.18);
          return (
            <div key={i} style={{position: 'absolute', left: 960 + Math.cos(a) * 520 - 60, top: 480 + Math.sin(a) * 300 + 40, width: 120, height: 100, opacity: k}}>
              <svg width={120} height={100}><path d="M10 95 V45 L60 8 L110 45 V95Z" fill="none" stroke={i === 0 ? T.gold : '#5a5a66'} strokeWidth="6" /></svg>
              <div style={{position: 'absolute', top: 104, width: 120, textAlign: 'center', fontFamily: T.display, fontSize: 30, color: i === 0 ? T.gold : '#5a5a66'}}>{i === 0 ? 'ฝน' : '?'}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #2a0e10, #08060a 70%)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{padding: '50px 90px', borderRadius: 24, background: 'rgba(0,0,0,.5)', border: `5px solid ${T.red}`, transform: `scale(${0.94 + 0.06 * appear(p.f, 2, 12)})`}}>
        {lines.map((l, i) => <div key={i} style={{fontFamily: T.display, fontSize: 86, fontWeight: 700, color: i === 0 ? T.white : '#ff9a9a', textAlign: 'center', lineHeight: 1.3}}>{l}</div>)}
      </div>
    </AbsoluteFill>
  );
};

const raw: Record<string, ShotComponent> = {
  mali: MaliScene,
  rumpai: RumpaiScene,
  stilt: StiltScene,
  school: SchoolScene,
  car: CarScene,
  copy: CopyScene,
  past: PastScene,
  phone: PhoneScene,
  photo: p => {
    const v = p.shot.view;
    if (v === 'class' || v === 'class-mirror') return <ClassPhotoScene {...p} />;
    if (v === 'rooms6') return <Rooms6Scene {...p} />;
    if (v === 'thumb') return <ThumbPhotoScene {...p} />;
    if (v === 'timer') return <TimerPhotoScene {...p} />;
    return <PhotoScene {...p} />;
  },
  dark: DarkScene,
  road: RoadScene,
  hand: p => {
    const v = p.shot.view;
    if (v === 'camera') return <CameraScene {...p} />;
    if (v === 'envelope7') return <EnvelopeScene {...p} />;
    if (v === 'medal') return <MedalScene {...p} />;
    if (v === 'slip') return <SlipScene {...p} />;
    if (v === 'rubbing') return <RubbingScene {...p} />;
    if (v === 'thumb') return <ThumbScene {...p} />;
    if (v === 'envelope-ton') return <TonEnvelopeScene {...p} />;
    if (v === 'torn') return <TornScene {...p} />;
    return <HandScene {...p} />;
  },
  village: VillageScene,
  canal: CanalScene,
  news: NewsScene,
  map: MapScene,
  notebook: NotebookScene,
  clock: ClockScene,
  title: TitleScene,
  card: CardScene,
  endcard: p => <EndCardScene p={p} />,
};

/** every scene reads its own view name; the camera tags on the end of it (camera.tsx) travel in data.fx */
const withCamera = (C: ShotComponent): ShotComponent => p => {
  const {core, tags} = splitView(p.shot.view);
  if (!tags.length) return <C {...p} />;
  const q: ShotProps = {...p, shot: {...p.shot, view: core, data: {...(p.shot.data ?? {}), fx: tags}}};
  return <C {...q} />;
};

export const scenes: Record<string, ShotComponent> = Object.fromEntries(Object.entries(raw).map(([k, C]) => [k, withCamera(C)]));

export default scenes;
