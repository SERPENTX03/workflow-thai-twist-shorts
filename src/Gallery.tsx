// Studio gallery compositions. Each G* composition draws item N of a list on frame N (lists: src/gallery.json, src/cast.json),
// so scripts/gallery.mjs renders a whole section with one bundle. CastSheet is the one-page overview.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CAST_ANCHORED, CAST_SIZE, CastSprite, type CastId} from './cast/CastSprite';
import {wardrobe} from './cast/outfitPresets';
import {Sprite} from './cast/Sprite';
import {RigBody, rigDrop, rigPlan} from './cast/Rig';
import {ActorView, LAYER_T} from './kit/stage';
import {T} from './engine/theme';
import {Caption} from './kit/Captions';
import {Card, Checklist, Chip, Hud, Meter, RuleCard, Stat, Tag} from './kit/ui';
import {Grain, LightMask} from './kit/horror';
import {Grade, GRADES, PAST_FILTER} from './kit/stage';
import {Beam, Boards, FLOOR, Glow, Planks, Sky, WallClock, beamAt} from './kit/world';
import {BenchSet, Corridor, Gate, Path, Porch, Road, Sala, TowerShape, WellSet} from './kit/temple';
import {BusStop, Canal, Classroom, DormHall, HospitalHall, Minimart, Motorcycle, RiceField, ShopRow, SideRoadSet, SpiritHouse, StiltHouse} from './kit/places';
import {Drips, Hand, Ink, Page, RainStreaks, RuleCardScene} from './kit/inserts';
import {EndCardScene} from './kit/EndCard';
import {genericScenes} from './scenes';
import type {Shot} from './engine/story';
import castJson from './cast.json';
import G from './gallery.json';

type CastEntry = {nameTh: string; name: string; role?: string; cm?: number};
export const CAST = Object.entries(castJson).filter(([k, c]) => !k.startsWith('_') && !(c as {retired?: boolean}).retired) as [CastId, CastEntry][];
const PET_OR_CROWD = (id: string) => !(castJson as Record<string, {cm?: number}>)[id]?.cm;

const BG = '#1c2438';
const Pane: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = BG}) => (
  <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
    <CastSprite />
    {children}
  </AbsoluteFill>
);
/** every figure in the studio gets the ink outline (Sprite outline, px at a 500 px adult) */
const OUTLINE = 4;
const usePick = <X,>(list: readonly X[]) => list[Math.min(useCurrentFrame(), list.length - 1)];

/** 600x640 card art: people at true relative height (170 cm fills the frame), pets and crowd fitted. */
export const GCast: React.FC = () => {
  const [id, c] = usePick(CAST);
  const h = PET_OR_CROWD(id) ? (id === 'crowd' ? 360 : 420) : (c.cm! / 170) * 530;
  return (
    <Pane bg={`linear-gradient(180deg, ${T.sky1}, ${T.sky0})`}>
      <div style={{position: 'absolute', bottom: 24, display: 'flex', justifyContent: 'center', width: '100%'}}>
        <Sprite id={id} height={h} outline={OUTLINE} />
      </div>
    </Pane>
  );
};

/** head / upper-body crop of `man` with one extra layer, centred in a 400-wide frame. */
const OnMan: React.FC<{layer?: CastId; hideFace?: boolean; hideMouth?: boolean; scale: number; top: number; hair?: string; vars?: Record<string, string>}> = ({layer, hideFace, hideMouth, scale, top, hair, vars}) => (
  <div style={{position: 'absolute', left: 200 - 100 * scale, top}}>
    <Sprite id="man" height={520 * scale} hideFace={hideFace} hideMouth={hideMouth} layers={layer ? [layer] : []} hair={hair} vars={vars} outline={OUTLINE} />
  </div>
);

/** 400x400 faces and talk mouths. */
export const GFaces: React.FC = () => {
  const id = usePick(G.faces) as CastId;
  return <Pane><OnMan layer={id} hideFace={id.startsWith('face-')} hideMouth={id.startsWith('talk-')} scale={2.2} top={60} /></Pane>;
};

/** 400x560 whole-body poses and pose arms, all on `man`. */
export const GPoses: React.FC = () => {
  const id = usePick([...G.poses, ...G.arms]) as CastId;
  const [w, h] = CAST_SIZE[id];
  const fit = Math.min(500 / h, 360 / w);
  return (
    <Pane>
      <div style={{position: 'absolute', bottom: 24}}>
        {id.startsWith('arm-') ? <Sprite id="man" height={500} hideArmR layers={[id]} outline={OUTLINE} /> : <Sprite id={id} height={h * fit} outline={OUTLINE} />}
      </div>
    </Pane>
  );
};

/** 400x560 walk / run frames drawn by the joint rig (cast/Rig.tsx): what Actors draws for pose walk / run. id = <symbol>-<walk|run>-<step 0..2> */
export const GGait: React.FC = () => {
  const m = usePick(G.gait).match(/^(.+)-(walk|run)-(\d)$/)!;
  const [sym, run, phase] = [m[1] as CastId, m[2] === 'run', (Number(m[3]) * Math.PI * 2) / 3];
  const plan = rigPlan(sym);
  if (!plan) return <Pane>{null}</Pane>;
  const cm = (castJson as Record<string, {cm?: number}>)[sym]?.cm ?? 170;
  const roster = {x: {cm, symbol: () => sym, vars: {}}};
  const dy = rigDrop(plan, phase, 1, run) * ((cm * 3) / 520);
  return (
    <Pane>
      <ActorView a={{who: 'x', x: 200, pose: run ? 'run' : 'walk', face: 'happy'} as any} roster={roster} floor={520} pxPerCm={3} f={0}
        body={{node: <RigBody plan={plan} phase={phase} dir={1} run={run} />, layerT: LAYER_T[plan.base]}} style={{transform: `translateY(${dy}px)`, filter: 'drop-shadow(0 0 0 #000)'}} />
    </Pane>
  );
};

/** 360x360 props (hand-anchored ones fill the frame), icons and set pieces. */
export const GProps: React.FC = () => {
  const id = usePick(G.props) as CastId;
  const [w, h] = CAST_ANCHORED.includes(id) ? [180, 180] : CAST_SIZE[id];
  const fit = Math.min(300 / h, 300 / w);
  return <Pane><Sprite id={id} height={h * fit} /></Pane>;
};

/** outfits are shown whole-body on someone they suit, coloured the way a scene would (cast.svg: acc-*) */
const SCHOOL = {shirt: '#f4f4f0', pants: '#1f2a4a', skirt: '#1f2a4a', shorts: '#1f2a4a'};
const OUTFIT: Record<string, [CastId, Record<string, string>]> = {
  'acc-field-vest': ['din', {}],
  'acc-shop-apron': ['din', {}],
  'acc-school': ['student', SCHOOL],
  'acc-school-kid': ['kid', SCHOOL],
  'acc-bow': ['teen-girl', {...SCHOOL, hair: '#2a1d18'}],
  'acc-raincoat': ['young-woman', {shirt: '#f2c230', hair: '#3a2418'}],
  'acc-hood': ['raincoat', {}],
  'acc-pakama': ['grandpa', {shirt: '#2f3b5a'}],
};

/** 400x400 marks and accessories, on `man`; outfits on a fitting body. */
export const GMarks: React.FC = () => {
  const id = usePick(G.marks) as CastId;
  // hairstyles: swapped onto man's head (old-age styles in their own colour, with wrinkles they go with)
  if (id.startsWith('hair-')) {
    const h = id as string;
    const old = h === 'hair-bun' || h === 'hair-tufts';
    return <Pane><OnMan hair={h.slice(5)} scale={1.4} top={110} vars={old ? {hair: h === 'hair-bun' ? '#d9d6d0' : '#ecebe6'} : undefined} /></Pane>;
  }
  const preset = wardrobe[id];
  const preview = preset ? [preset.model, {}] as const : OUTFIT[id];
  if (preview) {
    const [who, vars] = preview;
    const h = CAST_SIZE[who][1] * 0.72;
    return (
      <Pane>
        <div style={{position: 'absolute', bottom: 12}}><Sprite id={who} height={h} vars={vars} layers={[id]} outline={OUTLINE} /></div>
      </Pane>
    );
  }
  const body = ['acc-bag', 'acc-backpack', 'acc-straps', 'acc-amulet', 'acc-scarf'].includes(id);
  return <Pane><OnMan layer={id} scale={body ? 1.15 : 1.4} top={body ? 30 : 160} /></Pane>;
};

/** 1080x700 UI components on a night wall. */
export const GUi: React.FC = () => {
  const {id} = usePick(G.ui);
  const content: Record<string, React.ReactNode> = {
    caption: <div style={{position: 'absolute', inset: 0, top: -1040}}><Caption text={'น้ำเหลือ[ไม่ถึงสามสิบลิตร]\nก่อน{ไฟดับ}'} frame={30} /></div>,
    'caption-red': <div style={{position: 'absolute', inset: 0, top: -1040}}><Caption text={'ผู้เช่าคนนั้น\nคือคุณ'} red frame={30} /></div>,
    rule: <RuleCard no="กฎข้อ 1" lines={['อย่าวิ่งลงบันได', 'ตามเพื่อน']} x={180} y={150} />,
    stat: <><Stat label="น้ำที่เหลือ" value={29} unit="ลิตร" x={140} y={150} /><Meter level={0.32} low x={170} y={420} w={420} /></>,
    checklist: <Checklist rows={['ปิดประตู ล็อก', 'แปะกระดาษปิดกระจก', 'นั่งต่ำกว่าขอบหน้าต่าง']} ticks={[1, 1, 0]} x={200} y={160} w={640} />,
    card: (
      <Card title="รู้หรือไม่" x={140} y={170} w={800}>
        <div style={{fontFamily: T.display, fontWeight: 700, fontSize: 60, lineHeight: 1.25}}>คนเราอยู่ได้ 3 วัน<br />ถ้าไม่มีน้ำดื่ม</div>
      </Card>
    ),
    tags: (
      <>
        <Hud text="03:00" x={120} y={130} />
        <Tag text="คุณ · ม.4/2" tone="you" x={120} y={330} /><Tag text="เจ้าด่าง" x={460} y={330} /><Tag text="ป้าแดง" tone="warn" x={720} y={330} />
        <Chip text="คนเป็น" x={120} y={480} /><Chip text="คุณ" red x={330} y={480} />
      </>
    ),
  };
  return <Pane bg={`linear-gradient(180deg, ${T.wall1}, ${T.sky0})`}><AbsoluteFill>{content[id]}</AbsoluteFill></Pane>;
};

/** 1080x1920 generic scene previews at 60 % of a 3-beat shot. */
export const GScenes: React.FC = () => {
  const s = usePick(G.scenes);
  const Scene = genericScenes[s.scene];
  const shot = {scene: s.scene, view: s.view, data: s.data, beats: 3, i: 0, from: 0, frames: 72, text: '', style: 'plain'} as Shot;
  return <Pane><Scene shot={shot} f={44} len={72} W={1080} H={1920} /></Pane>;
};

// ---------------------------------------------------------------- landscape stage kit (src/kit/world.tsx, temple.tsx, inserts.tsx)

const WORLD_F = 36; // local frame for animated bits (flicker, sway)

/** 1920x1080 stage frame; `man` stands on the floor line as a scale reference (170 cm at 3 px/cm). */
const StageFrame: React.FC<{children: React.ReactNode; light?: string; man?: boolean; bg?: string}> = ({children, light, man = true, bg = '#07090d'}) => (
  <Pane bg={bg}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {children}
      {man && <div style={{position: 'absolute', left: 960 - 98, top: FLOOR - 510}}><Sprite id="man" height={510} rim="r" light={light} outline={OUTLINE} /></div>}
      {light && <Grade light={light} />}
    </div>
  </Pane>
);

const WORLD: Record<string, React.ReactNode> = {
  'sky-night': <><Sky tone="night" /><Boards /></>,
  'sky-dusk': <><Sky tone="dusk" /><Boards /></>,
  'sky-dawn': <><Sky tone="dawn" /><Boards /></>,
  'sky-morning': <><Sky tone="morning" /><Boards /></>,
  'planks-boards': <><Planks /><Boards /></>,
  'gate-dusk': <Gate tone="dusk" sign="วัดตัวอย่าง" />,
  'gate-night': <Gate tone="night" sign="วัดตัวอย่าง" />,
  'gate-morning': <Gate tone="morning" sign="วัดตัวอย่าง" />,
  road: <Road tone="dusk" />,
  'road-voided': <Road tone="night" voided />,
  sala: <Sala />,
  path: <Path f={WORLD_F} />,
  bench: <BenchSet f={WORLD_F} tower />,
  tower: <><Sky tone="dusk" y={560} /><Boards c0="#55524b" c1="#2a2925" /><TowerShape x={960} y={70} s={0.95} f={WORLD_F} swing={4} ropeSwing={2} /></>,
  well: <WellSet f={WORLD_F} />,
  corridor: <Corridor f={WORLD_F} drip={0.5} />,
  porch: <Porch f={WORLD_F} />,
};

/** 1920x1080 backdrops with a 170 cm man for scale. */
export const GWorld: React.FC = () => {
  const {id} = usePick(G.world);
  return <StageFrame light={id.startsWith('sky') || id === 'planks-boards' ? undefined : 'night'} man={id !== 'road' && id !== 'road-voided'}>{WORLD[id]}</StageFrame>;
};

const PLACES: Record<string, React.ReactNode> = {
  'shop-row': <ShopRow tone="day" f={WORLD_F} />,
  'stilt-house': <StiltHouse tone="night" f={WORLD_F} far />,
  canal: <Canal tone="dusk" f={WORLD_F} />,
  'spirit-house': <SpiritHouse tone="night" f={WORLD_F} />,
  minimart: <Minimart tone="night" f={WORLD_F} />,
  hospital: <HospitalHall f={WORLD_F} />,
  classroom: <Classroom tone="day" f={WORLD_F} />,
  dorm: <DormHall f={WORLD_F} />,
  'rice-field': <RiceField tone="dusk" f={WORLD_F} ripe />,
  'bus-stop': <BusStop tone="night" f={WORLD_F} />,
  'highway-road': <SideRoadSet tone="dusk" frame={WORLD_F} />,
};

/** 1920x1080 everyday Thai locations (src/kit/places.tsx), `man` for scale; they carry their own day / night tone. */
export const GPlaces: React.FC = () => {
  const {id} = usePick(G.places);
  return <StageFrame man>{PLACES[id]}</StageFrame>;
};


const SKIN = '#e2b08a', SLEEVE = '#8c9ea6';
const pageText = (n: number) => ['๒๕๕๙', 'มาถึงประตูเวลาหกโมงเย็น', '๒๕๖๑', 'ยังจำป้าพรไม่ได้'].slice(0, n);

/** 1920x1080 close-up pieces on a dark plate. */
const INSERTS: Record<string, React.ReactNode> = {
  'hand-grip': <Hand x={960} y={540} s={1.7} skin={SKIN} sleeve="#2f5f8f" mode="grip" />,
  'hand-open': <Hand x={960} y={540} s={1.7} skin={SKIN} mode="open" />,
  rain: <RainStreaks f={WORLD_F} />,
  drips: <><div style={{position: 'absolute', left: 900, top: 240, width: 120, height: 14, background: '#3a3f4a', borderRadius: 7}} /><Drips x={960} y={260} f={WORLD_F} n={3} to={900} /></>,
  notebook: (
    <Page x={560} y={120} w={800} h={820}>
      <div style={{padding: '50px 60px'}}>
        {pageText(4).map((t, i) => i % 2 ? <Ink key={i} text={t} size={38} shake={0.3} /> : <Ink key={i} text={t} size={30} color="#7a2a22" />)}
      </div>
    </Page>
  ),
  'wall-clock': <WallClock x={960} y={520} t="03:52" r={330} tick={1.2} />,
  flashlight: (
    <>
      <Planks />
      <Boards />
      <Beam x={520} y={900} angle={38} len={1100} spread={22} a={0.55} />
      <LightMask x={beamAt(0, 72, [[0, 1180, 400]])[0]} y={400} rx={360} ry={260} dark={0.9} />
    </>
  ),
};

export const GInserts: React.FC = () => {
  const {id} = usePick(G.inserts);
  if (id === 'rule-card') {
    const shot = {scene: 'rule', beats: 3, i: 0, from: 0, frames: 72, text: '', style: 'plain', data: {no: 'กฎข้อ 1', text: 'ห้ามอ่านชื่อ\nใต้เตียงออกเสียง'}} as unknown as Shot;
    return <Pane><RuleCardScene p={{shot, f: 40, len: 72, W: 1920, H: 1080}} /></Pane>;
  }
  if (id === 'end-card') {
    const shot = {scene: 'endcard', beats: 5, i: 0, from: 0, frames: 120, text: '', style: 'plain', data: {step: 'like', title: 'ชื่อเรื่อง', note: 'เรื่องนี้เป็นเรื่องแต่ง'}} as unknown as Shot;
    return <Pane><EndCardScene p={{shot, f: 62, len: 120, W: 1920, H: 1080}} /></Pane>;
  }
  const dark = !['notebook', 'wall-clock', 'flashlight'].includes(id);
  const bg = id === 'notebook' ? 'linear-gradient(#8a6a48, #3f2c1d)' : id === 'wall-clock' ? '#d9cfb8' : '#0b0d10';
  return (
    <StageFrame man={false} bg={bg} light={dark ? 'lamp' : id === 'flashlight' ? undefined : 'lantern'}>
      {INSERTS[id]}
      <Grain f={WORLD_F} opacity={0.12} />
    </StageFrame>
  );
};

/** 1920x1080 light grades on one set (floor, wall, lamp glow, a man) + the flashback filter. */
export const GGrades: React.FC = () => {
  const {id} = usePick(G.grades);
  const past = id === 'past';
  const light = past ? 'lamp' : (id in GRADES ? id : 'night');
  return (
    <Pane bg="#07090d">
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', filter: past ? PAST_FILTER : undefined}}>
        <Planks c0="#6a4b31" c1="#3f2c1d" />
        <Boards />
        <Glow x={1300} y={420} r={700} a={0.35} />
        <div style={{position: 'absolute', left: 960 - 98, top: FLOOR - 510}}><Sprite id="man" height={510} rim="r" light={light} outline={OUTLINE} /></div>
        <Grade light={light} past={past} />
      </div>
      <Grain f={WORLD_F} opacity={past ? 0.24 : 0.12} />
    </Pane>
  );
};

/** 1920x1080 one-page overview: every character at true relative height. */
export const CastSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#141b2d', color: '#e8ecf4', fontFamily: T.ui, padding: 40}}>
    <CastSprite />
    <div style={{fontFamily: T.display, fontWeight: 700, fontSize: 40, color: T.gold, margin: '24px 0 12px'}}>ตัวละครหลัก · ความสูงจริง</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px 8px', alignItems: 'end'}}>
      {CAST.filter(([id]) => !PET_OR_CROWD(id)).map(([id, c]) => (
        <div key={id} style={{textAlign: 'center'}}>
          <Sprite id={id} height={c.cm! * 1.8} outline={OUTLINE} />
          <div style={{fontSize: 17, marginTop: 4}}>{c.nameTh} · {c.cm}</div>
        </div>
      ))}
    </div>
    <div style={{display: 'flex', gap: 30, alignItems: 'flex-end', marginTop: 30}}>
      {CAST.filter(([id]) => PET_OR_CROWD(id)).map(([id, c]) => (
        <div key={id} style={{textAlign: 'center'}}><Sprite id={id} height={id === 'crowd' ? 135 : 120} outline={OUTLINE} /><div style={{fontSize: 22}}>{c.nameTh}</div></div>
      ))}
    </div>
  </AbsoluteFill>
);

export const GALLERY_COMPS = [
  {id: 'GCast', component: GCast, width: 600, height: 640, count: CAST.length},
  {id: 'GGait', component: GGait, width: 400, height: 560, count: G.gait.length},
  {id: 'GFaces', component: GFaces, width: 400, height: 400, count: G.faces.length},
  {id: 'GPoses', component: GPoses, width: 400, height: 560, count: G.poses.length + G.arms.length},
  {id: 'GProps', component: GProps, width: 360, height: 360, count: G.props.length},
  {id: 'GMarks', component: GMarks, width: 400, height: 400, count: G.marks.length},
  {id: 'GUi', component: GUi, width: 1080, height: 700, count: G.ui.length},
  {id: 'GScenes', component: GScenes, width: 1080, height: 1920, count: G.scenes.length},
  {id: 'GWorld', component: GWorld, width: 1920, height: 1080, count: G.world.length},
  {id: 'GPlaces', component: GPlaces, width: 1920, height: 1080, count: G.places.length},
  {id: 'GInserts', component: GInserts, width: 1920, height: 1080, count: G.inserts.length},
  {id: 'GGrades', component: GGrades, width: 1920, height: 1080, count: G.grades.length},
];
