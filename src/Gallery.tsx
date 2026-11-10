// Studio gallery compositions. Each G* composition draws item N of a list on frame N (lists: src/gallery.json, src/cast.json),
// so scripts/gallery.mjs renders a whole section with one bundle. CastSheet is the one-page overview.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CAST_ANCHORED, CAST_SIZE, CastSprite, type CastId} from './cast/CastSprite';
import {wardrobe} from './cast/outfitPresets';
import {Sprite} from './cast/Sprite';
import {RigBody, rigDrop, rigPlan} from './cast/Rig';
import {ActorView, LAYER_T, parseActor} from './kit/stage';
import {T} from './engine/theme';
import {Caption} from './kit/Captions';
import {Card, Checklist, Chip, Hud, Meter, RuleCard, Stat, Tag} from './kit/ui';
import {Grain, LightMask} from './kit/horror';
import {Actors, FloorShadow, Fore, Grade, GRADES, PAST_FILTER, Stage, Tilt, type RosterEntry} from './kit/stage';
import type {ShotProps} from './engine/episode';
import {CastShadow, Haze, PerspFloor, SideWall} from './kit/depth';
import {LightVeil, makeRoom, RBox, RFace, RoomShell, roomPxPerCm, standAt} from './kit/room';
import {BFence, BFloor, BGround, BRect, BRoof, BShadow, BWall, blockPxPerCm, blockStand, makeBlock} from './kit/exterior';
import {FaceEcu} from './kit/ecu';
import {Cone, Dust, rimFilter} from './kit/light';
import {Far} from './kit/fx';
import {Cctv, MirrorFrame, Pov, Split, cctvFrame, type PovKind} from './kit/pov';
import {GParts, GPlaces} from './GalleryPlaces';
import {Beam, Boards, FLOOR, Glow, Planks, Sky, WallClock, beamAt} from './kit/world';
import {CrackedGlass, GoldPile, LiveBadge, LiveComments} from './kit/live';
import {ShopRow} from './kit/places';
import {Drips, Hand, Ink, Page, RainStreaks, RuleCardScene} from './kit/inserts';
import {PhoneScene} from './kit/phone';
import {MemoryNotebook} from './kit/notebook';
import {EndCardScene} from './kit/EndCard';
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

/** head / upper-body crop of a lead with one extra layer, centred in a 400-wide frame. */
const OnMan: React.FC<{layer?: CastId; hideFace?: boolean; hideMouth?: boolean; scale: number; top: number; hair?: string; vars?: Record<string, string>}> = ({layer, hideFace, hideMouth, scale, top, hair, vars}) => (
  <div style={{position: 'absolute', left: 200 - 100 * scale, top}}>
    <Sprite id="lead-male-A" height={520 * scale} hideFace={hideFace} hideMouth={hideMouth} layers={layer ? [layer] : []} hair={hair} vars={vars} />
  </div>
);

const castRoster = (ids: string[]): Record<string, RosterEntry> => Object.fromEntries(ids.map(id => [id, {cm: (castJson as Record<string, {cm?: number}>)[id]?.cm ?? 170, symbol: () => id as CastId}]));
const HEADS = castRoster(['lead-male-A', 'lead-female-A', 'villain-male-A']);
/** a real cast member's head, large: what a close-up shows. Everything the actor string says goes through ActorView. */
const Head: React.FC<{who: string; x: number; tokens: string; top?: number; size?: number; f?: number; talking?: boolean}> = ({who, x, tokens, top = 44, size = 660, f = 0, talking}) => (
  <ActorView a={parseActor(`${who}@${x},${top + size} h=${size} ${tokens}`)} roster={HEADS} floor={top + size} pxPerCm={3} f={f} talking={talking} />
);

/** 640x400 one face on two leads: faces are layers, they have to work on every head */
export const GFaces: React.FC = () => {
  const face = (usePick(G.faces) as string).replace('face-', '');
  return <Pane><Head who="lead-male-A" x={170} tokens={face} /><Head who="lead-female-A" x={470} tokens={face} /></Pane>;
};

/** 1200x300 one mood's four mouth shapes while speaking. talkShape's cycle: a at frame 0, m at 4, e at 8, o at 16 */
export const GTalk: React.FC = () => {
  const {face, who} = usePick(G.talk);
  return <Pane>{[0, 8, 16, 4].map((f, i) => <Head key={f} who={who} x={150 + i * 300} top={22} size={560} tokens={`${face} talk`} f={f} talking />)}</Pane>;
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

/** 1200x560 pose rig (cast/Pose.tsx): one person three times, each an actor string `who@x <tokens>` — the same
 *  strings work in data.cast. Shows the turn (yaw −0.5 / 0 / 0.5) and the jointed arms with the costume intact. */
export const GRig: React.FC = () => {
  const item = usePick(G.rig);
  const cm = (castJson as Record<string, {cm?: number}>)[item.who]?.cm ?? 170;
  const roster = {[item.who]: {cm, symbol: () => item.who as CastId, vars: {}}};
  return (
    <Pane bg={`linear-gradient(180deg, ${T.sky1}, ${T.sky0})`}>
      {item.figures.map((tokens, i) => {
        const x = item.figures.length === 2 ? 320 + i * 560 : 220 + i * 380;
        return (
          <React.Fragment key={i}>
            <FloorShadow x={x} w={cm * 1.15} y={520} />
            <ActorView a={parseActor(`${item.who}@${x},520 ${tokens}`)} roster={roster} floor={520} pxPerCm={2.75} f={0}
              style={{filter: 'drop-shadow(3px 0 0 #15121c) drop-shadow(-3px 0 0 #15121c) drop-shadow(0 3px 0 #15121c) drop-shadow(0 -3px 0 #15121c)'}} />
            <div style={{position: 'absolute', left: x - 180, width: 360, top: 528, textAlign: 'center', fontFamily: 'monospace', fontSize: 15, color: '#e8e2d0'}}>{tokens || '(rest)'}</div>
          </React.Fragment>
        );
      })}
    </Pane>
  );
};

/** 360x360 a grip prop in a real hand, close: the hand centred, the arm coming in from the left */
export const GProps: React.FC = () => {
  const id = usePick(G.props) as string;
  const prop = id.replace('prop-', '');
  const k = 1.3, x = 180 - 114 * k, y = 190 + (520 - 222) * k;
  return (
    <Pane bg="radial-gradient(ellipse at 50% 50%, #2a3350, #141a2b 75%)">
      {prop === 'box' || prop === 'wheel'
        ? <Sprite id={id as CastId} height={prop === 'box' ? 230 : 300} />
        : <ActorView a={parseActor(`lead-male-A@${x},${y} h=${520 * k} armR=offer prop=${prop}`)} roster={HEADS} floor={y} pxPerCm={3} f={0} />}
    </Pane>
  );
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

// ---------------------------------------------------------------- landscape stage kit (src/kit/world.tsx, temple.tsx, inserts.tsx)

const WORLD_F = 36; // local frame for animated bits (flicker, sway)

/** 1920x1080 stage frame. */
const StageFrame: React.FC<{children: React.ReactNode; light?: string; man?: boolean; bg?: string}> = ({children, light, bg = '#07090d'}) => (
  <Pane bg={bg}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {children}
      {light && <Grade light={light} />}
    </div>
  </Pane>
);

const SKIN = '#e2b08a', SLEEVE = '#8c9ea6';
const pageText = (n: number) => ['๒๕๕๙', 'มาถึงประตูเวลาหกโมงเย็น', '๒๕๖๑', 'ยังจำป้าพรไม่ได้'].slice(0, n);

/** 1920x1080 close-up pieces on a dark plate. */
const INSERTS: Record<string, React.ReactNode> = {
  'live-stream': (
    <>
      <div style={{position: 'absolute', inset: 0, background: '#14161a'}} />
      <GoldPile x={700} y={600} s={1.2} f={WORLD_F} />
      <LiveBadge x={60} y={60} s={1.4} f={WORLD_F} viewers={214} />
      <LiveComments items={['ดึกจังเจย์', 'ที่ไหนเนี่ย', 'คอมเมนต์เล็กจาง']} x={1280} y={200} s={1.3} faint={2} />
      <div style={{position: 'absolute', left: 1320, top: 480, width: 428, height: 500, overflow: 'hidden', background: '#06080c', borderRadius: 30}}><CrackedGlass w={428} h={500} seed={5} /></div>
    </>
  ),
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
  if (id === 'phone-voice') {
    const shot = {scene: 'phone', view: 'voice', beats: 4, i: 0, from: 0, frames: 96, text: '', style: 'plain', data: {from: 'แพร', time: 'พุธ 19:30', dur: '0:09', pinned: true, playing: true, light: 'lamp'}} as unknown as Shot;
    return <Pane><PhoneScene p={{shot, f: 40, len: 96, W: 1920, H: 1080}} /></Pane>;
  }
  if (id === 'memory-notebook') {
    const shot = {scene: 'notebook', beats: 4, i: 0, from: 0, frames: 96, text: '', style: 'plain', data: {facts: [['กลัวห้องมืด', 'ok'], ['ชอบไข่เจียวไหม้ขอบ', 'ok'], ['วิ่งทุกเช้า', 'bad'], ['เสียงของเธอ', 'lost']], count: 4, light: 'lamp'}} as unknown as Shot;
    return <Pane><MemoryNotebook p={{shot, f: 80, len: 96, W: 1920, H: 1080}} counter={n => `จำได้ ${n} ข้อ`} /></Pane>;
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

/** 1920x1080 camera devices (src/kit/pov.tsx, Tilt / Fore in stage.tsx) over one demo view: a night shop row + a man. */
const camView = (f: number, x = 960, extra?: React.ReactNode) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <ShopRow tone="night" f={f} />
    {extra}
    <div style={{position: 'absolute', left: x - 98, top: FLOOR - 510}}><Sprite id="lead-male-A" height={510} rim="r" light="night" outline={OUTLINE} /></div>
    <Grade light="night" />
  </div>
);
const DoorEdge: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: -40, top: -40, width: 420, height: 1160, background: '#3a2a1c'}} />
    <div style={{position: 'absolute', left: 380, top: -40, width: 40, height: 1160, background: '#5a4030'}} />
    <div style={{position: 'absolute', left: 1640, top: 760, width: 400, height: 400, borderRadius: '50%', background: '#2a3a24'}} />
  </>
);
/** depth-light.md demos (src/kit/depth.tsx): one figure from src/cast.json on a third, one light, its long shadow. */
const lead = (x: number, light: string, rim: 'l' | 'r') => (
  <div style={{position: 'absolute', left: x - 98, top: FLOOR - 515}}><Sprite id="lead-male-A" height={515} rim={rim} light={light} outline={OUTLINE} /></div>
);
// a foreground silhouette only reads against something lit: this post stands in front of the lamp's pool
const Post: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 1660, top: -40, width: 230, height: 1160, background: '#07090d'}} />
    <div style={{position: 'absolute', left: 1640, top: -40, width: 22, height: 1160, background: '#161a22'}} />
    <svg width={1920} height={300} style={{position: 'absolute', left: 0, top: 0}}>
      <path d="M0 60 Q 900 240 1920 90" stroke="#05070a" strokeWidth={10} fill="none" />
      <path d="M0 110 Q 1000 290 1920 150" stroke="#05070a" strokeWidth={6} fill="none" />
    </svg>
  </>
);
// the real path an episode takes: Stage + Actors driven by story.json data (light, lightAt, cast, cam)
const DEMO_ROSTER: Record<string, RosterEntry> = {win: {cm: 172, symbol: () => 'lead-male-A'}};
const demoShot = (f: number, data: Record<string, unknown>): ShotProps => ({
  f, len: 90, W: 1920, H: 1080, shot: {scene: 'alley', view: 'lamp-wide', beats: 4, i: 0, from: 0, frames: 90, text: '', style: 'plain', data},
});
// directing.md §3: one room built in perspective (src/kit/room.tsx), framed two ways. The set is a place the camera
// walks into, so the wide and the close are the same room, the same window, the same light, not two backdrops.
const ROOM = makeRoom({x: 700, y: 470}, {x0: 520, x1: 1500, y0: 220, y1: 760}, 3.4);
const ROOM_WIN = ROOM.P(0.74, 0.37, 0);
const roomDemo = (f: number, cam: number[], id: string) => {
  const s = standAt(ROOM, 0.7, 0.45);
  const p = demoShot(f, {light: 'night', lightAt: [ROOM_WIN.x, ROOM_WIN.y], cam, cast: [`win@${Math.round(s.x)},${Math.round(s.y)} worried`]});
  const win: [number, number, number][] = [[0.62, 0.2, 0], [0.86, 0.2, 0], [0.86, 0.55, 0], [0.62, 0.55, 0]];
  return (
    <Stage p={p} world={<>
      <RoomShell r={ROOM} id={id} wall="#5e4632" side="#4a3626" sideFar="#6a503a" floorC="#3e2c1e" ceiling="#1c140e" />
      <RFace r={ROOM} pts={win} fill="#8fb0d8" stroke="#1a120c" sw={10} />
      <RFace r={ROOM} pts={[[0.74, 0.2, 0], [0.75, 0.2, 0], [0.75, 0.55, 0], [0.74, 0.55, 0]]} fill="#1a120c" />
      {/* the moonlight's pool on the floor, thrown forward from the window */}
      <RFace r={ROOM} pts={[[0.6, 1, 0.08], [0.9, 1, 0.08], [0.98, 1, 0.55], [0.64, 1, 0.55]]} fill="#9ab8e0" o={0.22} blend="screen" />
      <RBox r={ROOM} u={[0.04, 0.4]} v={[0.82, 1]} w={[0.12, 0.6]} front="#4a3020" top="#d8d2c4" side="#2e1e14" />
      <RBox r={ROOM} u={[0.02, 0.06]} v={[0.45, 1]} w={[0.56, 0.6]} front="#3a2618" />
      <RBox r={ROOM} u={[0.88, 1]} v={[0.62, 1]} w={[0.02, 0.2]} front="#3e2a1c" top="#5a3e2a" side="#2a1c12" />
      <LightVeil id={id} lights={[[ROOM_WIN.x, ROOM_WIN.y, 300], [s.x, s.y - 200, 380]]} o={0.42} />
      <Glow x={ROOM_WIN.x} y={ROOM_WIN.y} r={420} color="150,185,235" a={0.35} />
      <Dust x={ROOM_WIN.x} y={ROOM_WIN.y} floor={s.y} spread={240} f={f} />
      <Actors p={p} roster={DEMO_ROSTER} speaking={() => false} floor={FLOOR} pxPerCm={roomPxPerCm(ROOM, 0.45)} />
    </>} />
  );
};
// directing.md §5.2: an exterior is a place too. One house built from its corner (src/kit/exterior.tsx): two walls
// running to two vanishing points, the lit window as the light, a person at the gate turned to it.
const EXT = makeBlock({x: 1180, y0: 230, y1: 790, hy: 560, left: {x: 330, k: 0.46}, right: {x: 1800, k: 0.62}});
const extDemo = (f: number) => {
  const at: [number, number] = [0.14, -0.5];   // outside the fence, nearer the camera than the house
  const s = blockStand(EXT, at[0], at[1]), h = blockPxPerCm(EXT, at[0], at[1]) * 160;
  const win = EXT.W('l', 0.13, 0.52);
  return (
    <>
      <Sky tone="night" y={560} />
      <BGround b={EXT} fill="#1c1a22" far="#34303c" />
      {/* the lit window's light on the ground in front of it */}
      <BFloor b={EXT} pts={[[0.03, -0.02], [0.24, -0.02], [0.4, -0.62], [-0.1, -0.62]]} fill="#ffcf8a" o={0.26} blend="screen" blur={18} />
      <BWall b={EXT} side="r" fill="#3b312c" planks={10} />
      <BWall b={EXT} side="l" fill="#7b6352" planks={10} posts={5} />
      <BRect b={EXT} side="l" along={[0.05, 0.21]} h={[0.3, 0.74]} fill="#ffd27a" frame="#241a14" boards={5} glow="#ffcf8a" />
      {[0.29, 0.5, 0.71].map(t => <BRect key={t} b={EXT} side="l" along={[t, t + 0.15]} h={[0.3, 0.74]} fill="#141820" frame="#241a14" bars={3} />)}
      <BRect b={EXT} side="r" along={[0.34, 0.6]} h={[0, 0.72]} fill="#15110f" frame="#1c1512" />
      <BRoof b={EXT} fill="#6a4441" dark="#452c2b" depth={0.9} rise={0.6} />
      <BFence b={EXT} from={[-0.3, -0.32]} to={[1.25, -0.32]} posts={18} gate={[0.47, 0.56]} color="#3a2f28" />
      <BFence b={EXT} from={[-0.3, -0.32]} to={[-0.3, 1.1]} posts={12} color="#3a2f28" />
      <LightVeil id="ext" lights={[[win.x, win.y, 420], [s.x + 60, s.y - h * 0.55, 340]]} o={0.3} />
      <BShadow b={EXT} at={at} size={170} />
      <ActorView a={parseActor(`lead-female-A@${s.x.toFixed(0)},${s.y.toFixed(0)} h=${h.toFixed(0)} wary yaw=0.55 look=0.6 armR=chest`)} roster={HEADS} floor={s.y} pxPerCm={3} f={f} style={{filter: rimFilter('r', 'lamp', h / 500)}} />
      <Grade light="night" focus={[win.x / 1920, win.y / 1080]} />
    </>
  );
};
// directing.md §5.2: an ECU is the character's own face (src/kit/ecu.tsx), never an eye drawn in another style
const ecuDemo = (f: number) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1276, height: 1080, overflow: 'hidden'}}>
      <FaceEcu who="lead-female-A shock look=-0.4" roster={HEADS} f={f} part="eyes" W={1276} H={1080} shade="r" fill={0.9} />
    </div>
    <div style={{position: 'absolute', left: 1284, top: 0, width: 636, height: 536, overflow: 'hidden'}}>
      <FaceEcu who="lead-male-A worried" roster={HEADS} f={f} part="eye-l" W={636} H={536} at={[0.5, 0.5]} fill={0.8}
        glint={r => <>{[-1, 0, 1].map(i => <div key={i} style={{position: 'absolute', left: -r * 0.55, top: i * r * 0.36 - r * 0.07, width: r * 1.1, height: r * 0.14, background: '#ffd27a'}} />)}</>} />
    </div>
    <div style={{position: 'absolute', left: 1284, top: 544, width: 636, height: 536, overflow: 'hidden'}}>
      <FaceEcu who="villain-male-A smirk" roster={HEADS} f={f} part="mouth" W={636} H={536} at={[0.5, 0.5]} shade="l" />
    </div>
  </>
);
const HAND_MODES = ['grip', 'open', 'fist', 'point', 'pinch'] as const;
const handDemo = () => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #3a2c22, #0c0908 75%)'}}>
    {HAND_MODES.map((m, i) => (
      <div key={m} style={{position: 'absolute', left: (i % 3) * 640, top: i < 3 ? 0 : 540, width: 640, height: 540, overflow: 'hidden'}}>
        <Hand x={270} y={250} s={1.15} skin="#e8b995" sleeve="#2f5f8f" mode={m} pinkyCut={m === 'grip'} />
        <div style={{position: 'absolute', left: 60, top: 440, color: '#f1e6d2', fontFamily: T.ui, fontWeight: 700, fontSize: 40}}>{m}{m === 'grip' ? ' · pinkyCut' : ''}</div>
      </div>
    ))}
  </div>
);
const DEPTH: Record<string, (f: number) => React.ReactNode> = {
  'room-wide': f => roomDemo(f, [1, 1.04, 960, 540], 'rw'),
  'room-close': f => roomDemo(f, [3, 3.15, 1500, 470], 'rc'),
  'ext-corner': extDemo,
  'face-ecu': ecuDemo,
  'hand-modes': handDemo,
  // depth-light.md §7: the subject stands IN the one pool of light on the right third; the dark street on the left is
  // the space a threat could come from; the post (FG) cuts the lit edge; the shadow runs forward-left into that dark
  'anti-flat': f => {
    const p = demoShot(f, {light: 'noir', lightAt: [1400, 230], cam: [1, 1.05, 960, 540], cast: ['win@1260 worried']});
    return (
      <Stage p={p} fore={<Post />} foreBlur={8} foreDark={0.55} world={<>
        <Sky tone="night" y={560} />
        <Far blur={3} dim={0.55}><ShopRow tone="night" f={f} /></Far>
        <PerspFloor vx={500} vy={560} a={0.32} />
        <Haze y={780} h={320} f={f} a={0.22} color="160,175,210" />
        <Cone x={1400} y={230} floor={FLOOR} top={40} spread={360} f={f} a={0.34} />
        <Actors p={p} roster={DEMO_ROSTER} speaking={() => false} floor={FLOOR} pxPerCm={3} />
      </>} />
    );
  },
  'cast-shadow': f => (
    <>
      <Planks c0="#4a3422" c1="#24180f" /><Boards c0="#3e2c20" c1="#1a120c" />
      <Glow x={260} y={760} r={760} a={0.42} />
      <div style={{position: 'absolute', left: 230, top: 700, width: 60, height: 80, borderRadius: '40% 40% 10% 10%', background: '#ffd896', boxShadow: '0 0 40px rgba(255,210,140,.9)'}} />
      <div style={{position: 'absolute', left: 170, top: 780, width: 180, height: 150, background: '#2a1d14'}} />
      <CastShadow x={820} y={FLOOR} h={515} light={[260, 740]} />
      <CastShadow x={1380} y={FLOOR} h={480} light={[260, 740]} />
      <FloorShadow x={820} w={150} y={FLOOR} /><FloorShadow x={1380} w={140} y={FLOOR} />
      {lead(820, 'lamp', 'l')}
      <div style={{position: 'absolute', left: 1380 - 92, top: FLOOR - 480}}><Sprite id="lead-female-A" height={480} rim="l" light="lamp" outline={OUTLINE} /></div>
      <Grade light="lamp" focus={[0.3, 0.6]} />
      <Dust x={260} y={700} floor={FLOOR} spread={300} f={f} />
    </>
  ),
  'persp-room': (f: number) => (
    <>
      {/* ATMO & Deep Background */}
      <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: '#090d14'}} />
      {/* BG: Back wall in shadow */}
      <Planks x={360} y={140} w={1200} h={FLOOR - 140} c0="#2e2016" c1="#17100b" />
      {/* Window on right wall throwing moonlight */}
      <div style={{position: 'absolute', left: 1140, top: 200, width: 240, height: 280, background: '#6185a6', boxShadow: '0 0 70px rgba(97,133,166,0.5), inset 0 0 0 12px #26190f'}}>
        <div style={{position: 'absolute', left: 0, top: 90, width: '100%', height: 10, background: '#1c120a'}} />
        <div style={{position: 'absolute', left: 0, top: 180, width: '100%', height: 10, background: '#1c120a'}} />
        <div style={{position: 'absolute', left: 115, top: 0, width: 10, height: '100%', background: '#1c120a'}} />
      </div>
      {/* Off-centre vanishing point at vx=480, vy=460 */}
      <SideWall side="l" x={360} top={140} vx={480} vy={460} fill="#1c130d" opening={[0.3, 0.65]} openingFill="#030406" light={0.05} />
      <SideWall side="r" x={1560} top={140} vx={480} vy={460} fill="#3d2a1d" light={0.7} />
      <PerspFloor vx={480} vy={460} c0="#22160e" c1="#0a0704" seams={18} a={0.45} />
      {/* Moonlight pool + dust */}
      <Glow x={1260} y={420} r={580} color="140,185,230" a={0.32} />
      <Dust x={1240} y={380} floor={FLOOR} spread={320} f={f} />
      {/* Wooden bench / prop in midground */}
      <div style={{position: 'absolute', left: 740, top: FLOOR - 140, width: 220, height: 140, background: '#1a120c', borderTop: '6px solid #362418', boxShadow: 'inset -20px 0 30px rgba(0,0,0,0.6)'}} />
      {/* Cast shadow running away from window toward the dark door on the left */}
      <CastShadow x={820} y={FLOOR} h={460} light={[1260, 340]} a={0.7} />
      <FloorShadow x={820} w={180} y={FLOOR} />
      {/* MG: Character staged with intent (sitting on bench, looking worried toward the dark opening) */}
      <ActorView a={parseActor(`lead-male-A@860,${FLOOR} sit yaw=-0.5 worried`)} roster={HEADS} floor={FLOOR} pxPerCm={3} f={f} style={{filter: rimFilter('r', 'noir', 1)}} />
      {/* FG: Dirty lens frame (doorway edge and bedpost cutting the foreground) */}
      <Fore shift={[0, 0]} blur={8} dark={0.65}>
        <div style={{position: 'absolute', left: -40, top: -20, width: 260, height: 1140, background: '#05070a' }} />
        <div style={{position: 'absolute', left: -20, bottom: -40, width: 500, height: 260, borderRadius: '24px 24px 0 0', background: '#030508' }} />
      </Fore>
      {/* Atmospheric Grade (Noir with focus on character) */}
      <Grade light="noir" focus={[0.45, 0.55]} />
    </>
  ),
};

export const GCamera: React.FC = () => {
  const {id} = usePick(G.camera);
  const W = 1920, H = 1080, f = WORLD_F;
  let node: React.ReactNode;
  if (id === 'dutch') node = <Tilt deg={-6} W={W} H={H}>{camView(f)}</Tilt>;
  else if (id === 'fore') node = <>{camView(f, 1080)}<Fore><DoorEdge /></Fore></>;
  else if (id === 'phone-cam') node = <Pov kind="phone" rec="00:01:42" W={W} H={H} f={f}>{camView(f)}</Pov>;
  else if (['peephole', 'keyhole', 'crack', 'binoculars', 'blinds'].includes(id)) node = <Pov kind={id as PovKind} open={0.45} W={W} H={H} f={f}>{camView(f)}</Pov>;
  else if (id === 'split') node = <Split W={W} H={H} angle={8} a={camView(f, 960)} b={<div style={{position: 'absolute', inset: 0}}><Planks /><Boards /><Glow x={960} y={500} r={500} a={0.3} /><div style={{position: 'absolute', left: 960 - 98, top: FLOOR - 510}}><Sprite id="lead-female-A" height={480} rim="l" light="lamp" outline={OUTLINE} /></div><Grade light="lamp" /></div>} />;
  else if (id === 'cctv') node = <Cctv W={W} H={H} f={f} cam="CAM 03" time="02:14:07">{camView(cctvFrame(f), 700)}</Cctv>;
  else if (DEPTH[id]) node = DEPTH[id](f);
  else node = (
    <>
      <Planks /><Boards /><Glow x={500} y={460} r={600} a={0.3} />
      <div style={{position: 'absolute', left: 500 - 98, top: FLOOR - 510}}><Sprite id="lead-male-A" height={510} rim="r" light="lamp" outline={OUTLINE} /></div>
      <MirrorFrame x={1060} y={160} w={700} h={420} W={W} H={H} ox={700} oy={560}>
        <div style={{position: 'absolute', inset: 0}}><Planks /><Boards />
          <div style={{position: 'absolute', left: 500 - 98, top: FLOOR - 510}}><Sprite id="lead-male-A" height={510} outline={OUTLINE} /></div>
          <div style={{position: 'absolute', left: 820 - 98, top: FLOOR - 500}}><Sprite id="lead-female-A" height={480} silhouette /></div>
        </div>
      </MirrorFrame>
      <Grade light="lamp" />
    </>
  );
  return <Pane bg="#07090d"><div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>{node}</div></Pane>;
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
        <div style={{position: 'absolute', left: 960 - 98, top: FLOOR - 510}}><Sprite id="lead-male-A" height={510} rim="r" light={light} outline={OUTLINE} /></div>
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
  {id: 'GRig', component: GRig, width: 1200, height: 560, count: G.rig.length},
  {id: 'GFaces', component: GFaces, width: 640, height: 400, count: G.faces.length},
  {id: 'GTalk', component: GTalk, width: 1200, height: 300, count: G.talk.length},
  {id: 'GProps', component: GProps, width: 360, height: 360, count: G.props.length},
  {id: 'GMarks', component: GMarks, width: 400, height: 400, count: G.marks.length},
  {id: 'GUi', component: GUi, width: 1080, height: 700, count: G.ui.length},
  {id: 'GPlaces', component: GPlaces, width: 1920, height: 720, count: G.places.length},
  {id: 'GParts', component: GParts, width: 1920, height: 1080, count: G.parts.length},
  {id: 'GInserts', component: GInserts, width: 1920, height: 1080, count: G.inserts.length},
  {id: 'GCamera', component: GCamera, width: 1920, height: 1080, count: G.camera.length},
  {id: 'GGrades', component: GGrades, width: 1920, height: 1080, count: G.grades.length},
];
