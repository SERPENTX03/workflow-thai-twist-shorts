// Studio gallery compositions. Each G* composition draws item N of a list on frame N (lists: src/gallery.json, src/cast.json),
// so scripts/gallery.mjs renders a whole section with one bundle. CastSheet is the one-page overview.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CAST_ANCHORED, CAST_SIZE, CastSprite, type CastId} from './cast/CastSprite';
import {Sprite} from './cast/Sprite';
import {T} from './engine/theme';
import {Caption} from './kit/Captions';
import {Card, Checklist, Chip, Hud, Meter, RuleCard, Stat, Tag} from './kit/ui';
import {genericScenes} from './scenes';
import type {Shot} from './engine/story';
import castJson from './cast.json';
import G from './gallery.json';

type CastEntry = {nameTh: string; name: string; role?: string; cm?: number};
export const CAST = Object.entries(castJson).filter(([k]) => !k.startsWith('_')) as [CastId, CastEntry][];
const PET_OR_CROWD = (id: string) => !(castJson as Record<string, {cm?: number}>)[id]?.cm;

const BG = '#1c2438';
const Pane: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = BG}) => (
  <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
    <CastSprite />
    {children}
  </AbsoluteFill>
);
const usePick = <X,>(list: readonly X[]) => list[Math.min(useCurrentFrame(), list.length - 1)];

/** 600x640 card art: people at true relative height (170 cm fills the frame), pets and crowd fitted. */
export const GCast: React.FC = () => {
  const [id, c] = usePick(CAST);
  const h = PET_OR_CROWD(id) ? (id === 'crowd' ? 360 : 420) : (c.cm! / 170) * 580;
  return (
    <Pane bg={`linear-gradient(180deg, ${T.sky1}, ${T.sky0})`}>
      <div style={{position: 'absolute', bottom: 24, display: 'flex', justifyContent: 'center', width: '100%'}}>
        <Sprite id={id} height={h} />
      </div>
    </Pane>
  );
};

/** head / upper-body crop of `man` with one extra layer, centred in a 400-wide frame. */
const OnMan: React.FC<{layer: CastId; hideFace?: boolean; hideMouth?: boolean; scale: number; top: number}> = ({layer, hideFace, hideMouth, scale, top}) => (
  <div style={{position: 'absolute', left: 200 - 100 * scale, top}}>
    <Sprite id="man" height={520 * scale} hideFace={hideFace} hideMouth={hideMouth} layers={[layer]} />
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
        {id.startsWith('arm-') ? <Sprite id="man" height={500} hideArmR layers={[id]} /> : <Sprite id={id} height={h * fit} />}
      </div>
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

/** 400x400 marks and accessories, on `man`. */
export const GMarks: React.FC = () => {
  const id = usePick(G.marks) as CastId;
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

/** 1920x1080 one-page overview: every character at true relative height. */
export const CastSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#141b2d', color: '#e8ecf4', fontFamily: T.ui, padding: 40}}>
    <CastSprite />
    <div style={{fontFamily: T.display, fontWeight: 700, fontSize: 40, color: T.gold, margin: '24px 0 12px'}}>ตัวละครหลัก · ความสูงจริง</div>
    <div style={{display: 'flex', gap: 22, alignItems: 'flex-end', height: 640}}>
      {CAST.filter(([id]) => !PET_OR_CROWD(id)).map(([id, c]) => (
        <div key={id} style={{textAlign: 'center'}}>
          <Sprite id={id} height={c.cm! * 3.2} />
          <div style={{fontSize: 24, marginTop: 8}}>{c.nameTh} · {c.cm}</div>
        </div>
      ))}
    </div>
    <div style={{display: 'flex', gap: 30, alignItems: 'flex-end', marginTop: 30}}>
      {CAST.filter(([id]) => PET_OR_CROWD(id)).map(([id, c]) => (
        <div key={id} style={{textAlign: 'center'}}><Sprite id={id} height={id === 'crowd' ? 200 : 180} /><div style={{fontSize: 22}}>{c.nameTh}</div></div>
      ))}
    </div>
  </AbsoluteFill>
);

export const GALLERY_COMPS = [
  {id: 'GCast', component: GCast, width: 600, height: 640, count: CAST.length},
  {id: 'GFaces', component: GFaces, width: 400, height: 400, count: G.faces.length},
  {id: 'GPoses', component: GPoses, width: 400, height: 560, count: G.poses.length + G.arms.length},
  {id: 'GProps', component: GProps, width: 360, height: 360, count: G.props.length},
  {id: 'GMarks', component: GMarks, width: 400, height: 400, count: G.marks.length},
  {id: 'GUi', component: GUi, width: 1080, height: 700, count: G.ui.length},
  {id: 'GScenes', component: GScenes, width: 1080, height: 1920, count: G.scenes.length},
];
