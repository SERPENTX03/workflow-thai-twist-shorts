import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CAST_IDS, CAST_SIZE, CastSprite, type CastId} from './cast/CastSprite';
import {Sprite, personHeight} from './cast/Sprite';
import {T} from './engine/theme';

const PEOPLE: CastId[] = ['man', 'man-wide', 'man-raise', 'woman', 'auntie', 'elder', 'raincoat', 'student', 'kid', 'kid-girl'];
const PETS: CastId[] = ['cat-black', 'cat-orange', 'beagle', 'dog-patch'];

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#141b2d', color: '#e8ecf4', fontFamily: T.ui, padding: 40}}>
    <CastSprite />
    {children}
  </AbsoluteFill>
);

const Title: React.FC<{children: string}> = ({children}) => (
  <div style={{fontFamily: T.display, fontWeight: 700, fontSize: 40, color: T.gold, margin: '24px 0 12px'}}>{children}</div>
);

const Tile: React.FC<{id: CastId; h: number; label?: string; bg?: string; box?: number}> = ({id, h, label, bg = '#2a3b55', box}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
    <div style={{background: bg, borderRadius: 16, padding: 12, display: 'flex', alignItems: 'flex-end', height: box ?? h + 24}}>
      <Sprite id={id} height={h} />
    </div>
    <div style={{fontSize: 22, fontWeight: 500}}>{label ?? id}</div>
  </div>
);

/** 1920x1080: main cast at true relative heights, crowd, pets. */
export const CastSheet: React.FC = () => (
  <Frame>
    <Title>ตัวละครหลัก</Title>
    <div style={{display: 'flex', gap: 14, alignItems: 'flex-end'}}>
      {PEOPLE.map(id => <Tile key={id} id={id} h={personHeight(id, 2.2)} box={400} label={`${id} · ${personHeight(id, 1)}`} />)}
    </div>
    <div style={{display: 'flex', gap: 40}}>
      <div><Title>ฝูงชน</Title><Tile id="crowd" h={190} label="crowd" /></div>
      <div><Title>สัตว์</Title>
        <div style={{display: 'flex', gap: 14}}>{PETS.map(id => <Tile key={id} id={id} h={190} />)}</div>
      </div>
    </div>
  </Frame>
);

const grid = (ids: readonly CastId[], h: number, bg?: string) => (
  <div style={{display: 'flex', flexWrap: 'wrap', gap: 14}}>
    {ids.map(id => <Tile key={id} id={id} h={h} bg={bg} />)}
  </div>
);
const byPrefix = (p: string) => CAST_IDS.filter(i => i.startsWith(p));

/** Faces + mouths drawn over a bare head: one "man" per face. */
export const Faces: React.FC = () => (
  <Frame>
    <Title>สีหน้า</Title>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 14}}>
      {byPrefix('face-').map(id => (
        <div key={id} style={{textAlign: 'center'}}>
          <div style={{background: '#2a3b55', borderRadius: 16, padding: 10}}>
            <Sprite id="man" height={300} hideFace layers={[id]} />
          </div>
          <div style={{fontSize: 20}}>{id}</div>
        </div>
      ))}
    </div>
  </Frame>
);

export const Props: React.FC = () => (
  <Frame>
    <Title>Props</Title>{grid(byPrefix('prop-'), 110)}
    <Title>Icons</Title>{grid(byPrefix('icon-'), 100)}
    <Title>Marks / Accessories (วางบนตัวละคร)</Title>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 36}}>
      {[...byPrefix('mark-'), ...byPrefix('acc-')].map(id => (
        <div key={id} style={{textAlign: 'center'}}>
          <div style={{background: '#2a3b55', borderRadius: 12, padding: 6, display: 'flex', alignItems: 'flex-end'}}>
            <Sprite id="man" height={150} layers={[id]} />
          </div>
          <div style={{fontSize: 16}}>{id}</div>
        </div>
      ))}
    </div>
  </Frame>
);

export const Sets: React.FC = () => (
  <Frame>
    <Title>Set pieces</Title>{grid(byPrefix('set-'), 330)}
    <Title>Poses</Title>{grid(CAST_IDS.filter(i => /^(man|woman)-(walk|run|sit|crouch|back|lie)$/.test(i)), 300)}
  </Frame>
);

export const gallerySizes = {CAST_SIZE};
