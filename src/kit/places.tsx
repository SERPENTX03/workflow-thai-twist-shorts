import React from 'react';
import {rnd} from '../engine/anim';
import {flicker} from './horror';
import {Cone} from './light';
import {Boards, FLOOR, Glow, H, Sky, W, WallClock, full} from './world';

// Everyday Thai locations, ready to drop under the stage camera (src/kit/stage.tsx) in the 1920×1080 landscape world
// (src/kit/world.tsx): actors stand on FLOOR at 3 px/cm, the drawing runs past the frame edges for pans.
// Outdoor sets take `tone` (day | dusk | night): the buildings are drawn once in daylight colours and darkened by
// <Toned>, then lamps, lit windows and signs are drawn on top so they stay bright at night. Studio: #stage → ฉากสำเร็จ.

export type Tone = 'day' | 'dusk' | 'night';
const skyOf = (t: Tone) => (t === 'day' ? 'morning' : t);
const night = (t: Tone) => t === 'night';
const KANIT = 'Kanit, sans-serif';

const TONE_FILTER: Record<Tone, string | undefined> = {
  day: undefined,
  dusk: 'brightness(.8) saturate(.85) sepia(.3) hue-rotate(-18deg)',
  night: 'brightness(.42) saturate(.55) sepia(.3) hue-rotate(185deg)',
};

/** darkens its children for dusk / night; draw light sources after it */
export const Toned: React.FC<{tone: Tone; children: React.ReactNode}> = ({tone, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1080, filter: TONE_FILTER[tone]}}>{children}</div>
);

const box = (left: number, top: number, width: number, height: number, background: string, extra?: React.CSSProperties): React.CSSProperties =>
  ({position: 'absolute', left, top, width, height, background, ...extra});

/** concrete electric pole with cross arms, a transformer and the famous tangle of wires running off both sides */
export const PowerPole: React.FC<{x: number; top?: number; tangle?: boolean}> = ({x, top = -300, tangle = true}) => (
  <>
    <div style={box(x - 14, top, 28, FLOOR + 40 - top, 'linear-gradient(90deg, #b9b4a8, #8f8a7f)')} />
    {[top + 260, top + 330].map(y => <div key={y} style={box(x - 110, y, 220, 14, '#6d6a62')} />)}
    <div style={box(x + 18, top + 380, 70, 110, '#7a8088', {borderRadius: 6, boxShadow: 'inset -10px 0 0 rgba(0,0,0,.2)'})} />
    <svg width={W + 1400} height={700} style={{position: 'absolute', left: -700, top: top + 200, overflow: 'visible'}}>
      {Array.from({length: tangle ? 9 : 4}, (_, i) => {
        const y0 = 66 + (i % 4) * 30, sag = 60 + rnd(71, i) * 90;
        return <path key={i} d={`M0 ${y0 + 40} Q${(x + 700) / 2} ${y0 + sag + 40} ${x + 700} ${y0} Q${(x + 700 + 3320) / 2} ${y0 + sag} 3320 ${y0 + 30}`} stroke="#1d1d1f" strokeWidth={i % 3 ? 3 : 5} fill="none" />;
      })}
      {tangle && [0, 1, 2].map(i => <ellipse key={i} cx={x + 700 + 30 - i * 24} cy={250 + i * 22} rx={46 + i * 10} ry={22} stroke="#1d1d1f" strokeWidth={4} fill="none" />)}
      {tangle && <path d={`M${x + 690} 270 Q${x + 660} 400 ${x + 640} 460`} stroke="#1d1d1f" strokeWidth={4} fill="none" />}
    </svg>
  </>
);

/** street lamp on a curved arm; returns the lamp head position via `at` = [x, y] of the bulb */
const Lamp: React.FC<{x: number; side?: 1 | -1; head?: number}> = ({x, side = -1, head = 210}) => (
  <>
    <div style={box(x - 9, head - 20, 18, FLOOR + 30 - head, '#3e4146')} />
    <svg width={260} height={80} style={{position: 'absolute', left: side < 0 ? x - 250 : x - 10, top: head - 40, transform: side < 0 ? undefined : 'scaleX(-1)', transformOrigin: '10px 40px'}}>
      <path d="M250 60 Q240 10 140 14 L30 18" stroke="#3e4146" strokeWidth={12} fill="none" />
      <rect x={0} y={10} width={70} height={22} rx={8} fill="#2c2e32" />
    </svg>
  </>
);
const lampHead = (x: number, side: 1 | -1 = -1, head = 210): [number, number] => [x + side * 215, head + 4];

/** night lamp light: bulb, halo, cone to the floor */
const LampLight: React.FC<{at: [number, number]; f: number; color?: string; seed?: number; a?: number}> = ({at: [x, y], f, color = '255,214,150', seed = 1, a = 1}) => (
  <>
    <div style={box(x - 30, y + 2, 60, 12, `rgb(${color})`, {borderRadius: 6, opacity: a})} />
    <Glow x={x} y={y + 10} r={420} color={color} a={0.38 * a} />
    <Cone x={x} y={y + 14} floor={FLOOR} top={24} spread={300} f={f} color={color} a={0.16 * a} dust={14} seed={seed} />
  </>
);

const Pavement: React.FC<{road?: boolean}> = ({road = true}) => (
  <>
    <div style={box(-700, FLOOR, W + 1400, 70, 'repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 3px, transparent 3px 90px), linear-gradient(#b3ada1, #9a948a)')} />
    <div style={box(-700, FLOOR + 70, W + 1400, 18, 'repeating-linear-gradient(90deg, #e9e4d8 0 120px, #c23a2e 120px 240px)')} />
    {road && <div style={box(-700, FLOOR + 88, W + 1400, 600, 'linear-gradient(#4a4a4c, #2c2c2e)')} />}
  </>
);

// ---------------------------------------------------------------- ตึกแถว

const SHOP_WALLS = ['#d9cba8', '#c7d0bf', '#e3bfa3', '#cfc6b8', '#bfcad3', '#e0d3b3'];
const SIGN_BG = ['#b3261e', '#1f5a8a', '#2f6b3a', '#7a3d8c', '#c47a1a', '#3a3a3a'];

/** a shop's name board; drawn again after <Toned> at night so it reads as lit (o = how lit) */
const ShopSign: React.FC<{x: number; i: number; text: string; o?: number}> = ({x, i, text, o = 1}) => (
  <div style={box(x + 20, 176, 540, 104, SIGN_BG[i], {opacity: o, border: '6px solid #f2e3b0', boxSizing: 'border-box', color: '#fff6d8', fontFamily: KANIT, fontWeight: 700, fontSize: 54, textAlign: 'center', lineHeight: '90px'})}>{text}</div>
);

/** ตึกแถว: a row of shophouses with roll-up steel shutters, shop signs, window grilles, AC units, a power pole and
 *  a street lamp. `signs` / `open` (0 shut … 1 open, per shop) start at the shop left of centre. */
export const ShopRow: React.FC<{tone: Tone; f: number; signs?: string[]; open?: number[]}> = ({
  tone, f, signs = ['ร้านทอง', 'ก๋วยเตี๋ยว', 'ซ่อมมือถือ', 'ขายยา'], open = [0, 0.85, 0, 0.3],
}) => {
  const shops = Array.from({length: 6}, (_, i) => ({i, x: -420 + i * 580, sign: signs[(i + 39) % signs.length], open: open[(i + 39) % open.length]}));
  const SH = FLOOR - 330;
  return (
    <>
      <Sky tone={skyOf(tone)} y={600} />
      <Toned tone={tone}>
        {shops.map(({i, x, sign, open: o}) => (
          <React.Fragment key={i}>
            <div style={box(x, -400, 580, FLOOR + 400, SHOP_WALLS[i])} />
            <div style={box(x + 90, -130, 400, 220, '#2a3038', {boxShadow: 'inset 0 0 0 10px #8b8478'})} />
            <div style={box(x + 90, -130, 400, 220, 'repeating-linear-gradient(90deg, #4a4740 0 6px, transparent 6px 44px), repeating-linear-gradient(0deg, #4a4740 0 6px, transparent 6px 55px)')} />
            {i % 2 === 0 && <div style={box(x + 420, 104, 110, 60, '#e6e4dc', {borderRadius: 6, boxShadow: 'inset 0 0 0 4px #b9b6ad'})} />}
            {i % 2 === 1 && <div style={box(x + 60, 110, 70, 50, '#2f6b3a', {borderRadius: '50% 50% 8px 8px'})} />}
            <ShopSign x={x} i={i} text={sign} />
            <div style={box(x + 30, 290, 520, 40, '#55585c')} />
            <div style={box(x + 40, 330, 500, SH, o > 0.5 ? '#e7d3a6' : '#3a3530')} />
            {o > 0 && [0, 1, 2].map(r => <div key={r} style={box(x + 60, 420 + r * 150, 460, 12, '#7a5a3e')} />)}
            {o > 0 && Array.from({length: 18}, (_, k) => <div key={k} style={box(x + 70 + (k % 6) * 74, 380 + Math.floor(k / 6) * 150, 50, 40, ['#c23a2e', '#2f6b9a', '#e0b23a', '#4b8a4a'][(k + i) % 4], {borderRadius: 4})} />)}
            <div style={box(x + 40, 330, 500, SH * (1 - o), 'repeating-linear-gradient(0deg, #8d9196 0 10px, #6f7378 10px 14px, #a2a6ab 14px 22px)', {boxShadow: 'inset 0 -14px 0 #55585c'})} />
            <div style={box(x + 566, -400, 28, FLOOR + 400, '#9a9288')} />
          </React.Fragment>
        ))}
        <PowerPole x={1240} />
        <Lamp x={1760} />
        <Pavement />
      </Toned>
      {tone !== 'day' && shops.filter(s => s.open > 0).map(s => (
        <React.Fragment key={s.i}>
          <div style={box(s.x + 40, 330 + SH * (1 - s.open), 500, SH * s.open, 'rgba(255,214,140,.55)', {mixBlendMode: 'screen'})} />
          <Glow x={s.x + 290} y={FLOOR} r={420} a={0.3} />
        </React.Fragment>
      ))}
      {tone !== 'day' && shops.map(s => <ShopSign key={s.i} x={s.x} i={s.i} text={s.sign} o={night(tone) ? 0.82 : 0.4} />)}
      {tone !== 'day' && <LampLight at={lampHead(1760)} f={f} seed={5} />}
    </>
  );
};

// ---------------------------------------------------------------- บ้านไม้ใต้ถุนสูง

/** บ้านไม้ใต้ถุนสูง: wooden house on posts, high gable roof with กาแล, open shutters, a ladder stair, and under the
 *  house a bamboo แคร่, a hammock and water jars. Actors stand under the house (clear height ~185 cm) or in the yard;
 *  `far` sets the house back in the yard so the whole roof shows (establishing shot). */
export const StiltHouse: React.FC<{tone: Tone; f: number; far?: boolean}> = ({tone, f, far}) => {
  const swing = Math.sin(f / 30) * 6;
  const zoom: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: W, height: 1080, transform: far ? 'scale(.6)' : undefined, transformOrigin: `850px ${FLOOR - 60}px`};
  return (
    <>
      <Sky tone={skyOf(tone)} y={640} />
      <Toned tone={tone}>
        {[[-420, 300], [2050, 340], [2350, 280]].map(([x, s], i) => (
          <svg key={i} width={420} height={760} style={{position: 'absolute', left: x, top: FLOOR - 760 + (i ? 30 : 0)}}>
            <path d={`M210 760 Q${200 + i * 10} 400 ${215 - i * 6} 120`} stroke="#6a5a44" strokeWidth={22} fill="none" />
            {Array.from({length: 7}, (_, k) => {
              const a = (k / 7) * Math.PI * 2;
              return <path key={k} d={`M210 120 Q${210 + Math.cos(a) * s * 0.5} ${100 + Math.sin(a) * 50} ${210 + Math.cos(a) * s * 0.65} ${150 + Math.abs(Math.sin(a)) * 90}`} stroke="#4f7a3e" strokeWidth={16} fill="none" strokeLinecap="round" />;
            })}
          </svg>
        ))}
        <div style={box(-700, 780, W + 1400, 800, 'linear-gradient(#a1916d, #7d6c4f)')} />
        {Array.from({length: 26}, (_, i) => <div key={i} style={box(-600 + i * 130 + rnd(81, i) * 60, 800 + rnd(82, i) * 260, 40, 20, '#6f7d48', {borderRadius: '50% 50% 0 0'})} />)}
        <div style={zoom}>
        <svg width={1700} height={520} style={{position: 'absolute', left: 60, top: -440}}>
          <path d="M60 470 L850 70 L1640 470 Z" fill="#6b4a33" />
          <path d="M60 470 L850 70 L1640 470" stroke="#3f2c1d" strokeWidth={22} fill="none" />
          {Array.from({length: 8}, (_, i) => <path key={i} d={`M${160 + i * 90} ${420 - i * 44} L${1540 - i * 90} ${420 - i * 44}`} stroke="rgba(0,0,0,.18)" strokeWidth={4} />)}
          <path d="M850 70 L760 -10 M850 70 L940 -10" stroke="#3f2c1d" strokeWidth={22} strokeLinecap="round" />
        </svg>
        <div style={box(200, 20, 1300, 330, 'repeating-linear-gradient(90deg, #3f2c1d 0 5px, #8a6a48 5px 52px, #7d5e3e 52px 92px)')} />
        {[330, 760, 1190].map(x => (
          <React.Fragment key={x}>
            <div style={box(x, 110, 180, 170, '#1e1611')} />
            <div style={box(x - 92, 110, 88, 170, '#9a7a52', {boxShadow: 'inset 0 0 0 6px #5d422b'})} />
            <div style={box(x + 184, 110, 88, 170, '#9a7a52', {boxShadow: 'inset 0 0 0 6px #5d422b'})} />
          </React.Fragment>
        ))}
        <div style={box(170, 340, 1360, 44, '#4a3424')} />
        {[230, 620, 1010, 1440].map(x => <div key={x} style={box(x, 384, 36, FLOOR - 384 + 20, 'linear-gradient(90deg, #6a4b31, #3f2c1d)')} />)}
        <svg width={420} height={600} style={{position: 'absolute', left: 1460, top: 360}}>
          <path d="M20 10 L300 580 M110 10 L390 580" stroke="#5a4030" strokeWidth={16} />
          {Array.from({length: 9}, (_, i) => <path key={i} d={`M${38 + i * 31} ${48 + i * 60} L${128 + i * 31} ${48 + i * 60}`} stroke="#7a5a3e" strokeWidth={12} />)}
        </svg>
        <svg width={420} height={200} style={{position: 'absolute', left: 250, top: 600}}>
          <path d={`M10 20 Q205 ${170 + swing} 400 20`} stroke="#8a3a2c" strokeWidth={30} fill="none" />
          <path d={`M10 20 Q205 ${150 + swing} 400 20`} stroke="#c25a3a" strokeWidth={10} fill="none" />
        </svg>
        <div style={box(1060, 780, 360, 26, 'repeating-linear-gradient(90deg, #c9b07a 0 14px, #a8915e 14px 18px)')} />
        {[1080, 1380].map(x => <div key={x} style={box(x, 806, 16, FLOOR - 806, '#7a6440')} />)}
        </div>
        {[[1760, 1], [1880, 0.8]].map(([x, s]) => <div key={x} style={box(x - 70 * s, FLOOR - 170 * s, 140 * s, 170 * s, 'radial-gradient(ellipse at 40% 35%, #8a5a3a, #4a2c1c)', {borderRadius: '45% 45% 40% 40%', boxShadow: `inset 0 ${16 * s}px 0 #2a1a10`})} />)}
      </Toned>
      {night(tone) && (
        <div style={zoom}>
          {[330, 760, 1190].map(x => <div key={x} style={box(x, 110, 180, 170, 'rgba(255,200,120,.75)', {mixBlendMode: 'screen'})} />)}
          {[420, 850, 1280].map(x => <Glow key={x} x={x} y={200} r={300} a={0.3} />)}
          <div style={box(818, 384, 4, 60, '#111')} />
          <LampLight at={[820, 440]} f={f} seed={8} a={0.8} />
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- คลอง + ท่าน้ำ

/** คลอง: a wooden landing (ท่าน้ำ) with a small roof on the left, steps into the water, a moored boat, and houses
 *  on stilts along the far bank. Actors stand on the landing (x < 1250). */
export const Canal: React.FC<{tone: Tone; f: number}> = ({tone, f}) => {
  const bob = Math.sin(f / 18) * 4;
  return (
    <>
      <Sky tone={skyOf(tone)} y={520} />
      <Toned tone={tone}>
        <div style={box(-700, 470, W + 1400, 100, '#3f5a3a')} />
        {Array.from({length: 9}, (_, i) => {
          const x = -560 + i * 400 + rnd(91, i) * 80, w = 200 + rnd(92, i) * 80;
          return (
            <svg key={i} width={w + 40} height={260} style={{position: 'absolute', left: x, top: 360}}>
              <path d={`M0 90 L${(w + 40) / 2} 10 L${w + 40} 90 Z`} fill={['#7a4a36', '#5d5a52', '#6b4a33'][i % 3]} />
              <rect x={20} y={90} width={w} height={90} fill={['#9a7a52', '#b8ab8e', '#7d5e3e'][i % 3]} />
              <rect x={w / 2} y={115} width={36} height={44} fill="#2a1d14" />
              {[30, w / 2 + 10, w].map(px => <rect key={px} x={px} y={180} width={10} height={80} fill="#4a3424" />)}
            </svg>
          );
        })}
        <div style={box(-700, 600, W + 1400, 1000, 'linear-gradient(#5f7c74, #2d403c)')} />
        {Array.from({length: 40}, (_, i) => {
          const y = 620 + rnd(93, i) * 440, x = ((rnd(94, i) * 3320 + f * (0.6 + rnd(95, i))) % 3320) - 700;
          return <div key={i} style={box(x, y, 60 + rnd(96, i) * 120, 4, 'rgba(220,235,230,.28)', {borderRadius: 2})} />;
        })}
        <svg width={760} height={240} style={{position: 'absolute', left: 1340, top: 880 + bob}}>
          <path d="M0 40 Q80 140 360 140 Q640 140 740 30 L700 70 Q380 90 40 70 Z" fill="#5a3a26" />
          <path d="M40 70 Q380 90 700 70" stroke="#2a1a10" strokeWidth={10} fill="none" />
          <path d="M0 40 Q30 20 60 50" stroke="#5a3a26" strokeWidth={14} fill="none" />
        </svg>
        <svg width={400} height={200} style={{position: 'absolute', left: 1150, top: 860}}>
          <path d={`M60 40 Q160 ${110 + bob} 250 ${60 + bob}`} stroke="#b8a070" strokeWidth={5} fill="none" />
        </svg>
        <svg width={1500} height={420} style={{position: 'absolute', left: -560, top: 50}}>
          <path d="M40 300 L760 40 L1480 300 Z" fill="#8c4339" /><rect x={40} y={296} width={1440} height={22} fill="#d6b45a" />
        </svg>
        {[-420, 140, 760].map(x => <div key={x} style={box(x, 360, 34, FLOOR - 360, '#e6dcc6', {boxShadow: 'inset -8px 0 0 rgba(0,0,0,.12)'})} />)}
        <div style={box(-700, FLOOR, 1950, 40, 'repeating-linear-gradient(90deg, #3f2c1d 0 4px, #7a5a3e 4px 90px)')} />
        {Array.from({length: 13}, (_, i) => <div key={i} style={box(-680 + i * 150, FLOOR + 40, 24, 400, '#3a2a1c')} />)}
        {[0, 1, 2].map(k => <div key={k} style={box(1250 + k * 60, FLOOR + 30 + k * 40, 120, 26, '#6a4b31')} />)}
      </Toned>
      {night(tone) && (
        <>
          <div style={box(774, 400, 30, 40, '#ffd890', {borderRadius: '45%'})} />
          <Glow x={790} y={430} r={460} a={0.36} />
          <div style={box(740, 640, 100, 440, 'repeating-linear-gradient(0deg, rgba(255,214,150,.4) 0 6px, transparent 6px 22px)', {mixBlendMode: 'screen', transform: `skewX(${Math.sin(f / 12) * 6}deg)`})} />
          {[200, 900, 1700, 2300].map((x, i) => <div key={x} style={box(x, 475, 34, 40, 'rgba(255,200,120,.8)', {mixBlendMode: 'screen', opacity: 0.6 + rnd(97, i) * 0.4})} />)}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------- ศาลพระภูมิ

/** ศาลพระภูมิ: spirit house on a pillar in a house yard: tiered red-gold roof, garlands, red soda bottles, zebra
 *  figures, incense smoke; corner of the house on the left. `bulb` lights the shrine (on by default at night). */
export const SpiritHouse: React.FC<{tone: Tone; f: number; bulb?: boolean}> = ({tone, f, bulb = night(tone)}) => (
  <>
    <Sky tone={skyOf(tone)} y={560} />
    <Toned tone={tone}>
      <svg width={900} height={700} style={{position: 'absolute', left: 1500, top: 40}}>
        {[[420, 260, 360, 250], [250, 330, 220, 170], [600, 330, 230, 170]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={['#4f6e44', '#456238', '#587a4b'][i]} />)}
        <rect x={400} y={420} width={50} height={300} fill="#5d4a36" />
      </svg>
      <div style={box(-700, 560, W + 1400, FLOOR - 560, 'linear-gradient(#d4cdbd, #bcb4a2)', {boxShadow: 'inset 0 22px 0 #a39b8a'})} />
      <div style={box(-700, 80, 1220, FLOOR - 80, '#e8dfcd', {boxShadow: 'inset -24px 0 0 rgba(0,0,0,.1)'})} />
      <div style={box(-80, 300, 340, 280, '#33404a', {boxShadow: 'inset 0 0 0 12px #c9bfa8'})} />
      <div style={box(-80, 300, 340, 280, 'repeating-linear-gradient(90deg, #5a5650 0 5px, transparent 5px 48px)')} />
      <div style={box(-700, FLOOR, W + 1400, 650, 'repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 3px, transparent 3px 160px), linear-gradient(#9a958a, #77726a)')} />
      <div style={box(1000, FLOOR - 50, 300, 50, '#d8d0bc', {boxShadow: 'inset 0 8px 0 #eee6d4'})} />
      <div style={box(1125, 560, 50, FLOOR - 610, 'linear-gradient(90deg, #f2ead6, #cfc2a0)')} />
      <div style={box(1000, 540, 300, 26, '#d9b04a')} />
      <div style={box(1040, 400, 220, 140, '#efe2bf', {boxShadow: 'inset 0 0 0 6px #d9b04a'})} />
      <div style={box(1120, 440, 60, 100, '#3a1a14', {borderRadius: '30px 30px 0 0', border: '4px solid #d9b04a'})} />
      {[1050, 1230].map(x => <div key={x} style={box(x, 400, 20, 140, '#d9b04a')} />)}
      <svg width={400} height={340} style={{position: 'absolute', left: 950, top: 80}}>
        <path d="M30 330 L200 210 L370 330 Z" fill="#a8302a" /><path d="M30 330 L200 210 L370 330" stroke="#d9b04a" strokeWidth={8} fill="none" />
        <path d="M80 240 L200 140 L320 240 Z" fill="#a8302a" /><path d="M80 240 L200 140 L320 240" stroke="#d9b04a" strokeWidth={8} fill="none" />
        <path d="M30 330 q-20 -20 -6 -40 M370 330 q20 -20 6 -40 M80 240 q-18 -18 -4 -36 M320 240 q18 -18 4 -36" stroke="#d9b04a" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M188 150 L200 20 L212 150 Z" fill="#d9b04a" />
      </svg>
      {Array.from({length: 7}, (_, i) => (
        <div key={i} style={box(1010 + i * 42, 562, 26, 40 + (i % 2) * 14, `linear-gradient(${['#f2e9c8', '#e0b23a', '#c23a2e'][i % 3]} 0 70%, #c23a2e 70%)`, {borderRadius: '0 0 13px 13px'})} />
      ))}
      {[0, 1, 2, 3].map(i => (
        <React.Fragment key={i}>
          <div style={box(1020 + i * 30, FLOOR - 120, 20, 70, '#c41e2a', {borderRadius: '6px 6px 3px 3px'})} />
          <div style={box(1029 + i * 30, FLOOR - 150, 3, 40, '#f2f2f2', {transform: 'rotate(12deg)'})} />
        </React.Fragment>
      ))}
      {[1360, 1470].map((x, i) => (
        <svg key={x} width={110} height={110} style={{position: 'absolute', left: x, top: FLOOR - 110 + i * 4}}>
          <rect x={14} y={36} width={78} height={36} rx={14} fill="#f4f4f0" />
          <path d="M30 36 V72 M46 36 V72 M62 36 V72 M78 36 V72" stroke="#1d1d1f" strokeWidth={5} />
          <rect x={72} y={6} width={22} height={40} rx={8} fill="#f4f4f0" transform="rotate(14 83 26)" />
          {[20, 36, 66, 84].map(lx => <rect key={lx} x={lx} y={70} width={7} height={36} fill="#f4f4f0" />)}
        </svg>
      ))}
      <div style={box(1220, 510, 40, 30, '#8a6a48', {borderRadius: '4px 4px 14px 14px'})} />
    </Toned>
    <svg width={200} height={260} style={{position: 'absolute', left: 1140, top: 260, opacity: 0.5}}>
      {[0, 1, 2].map(i => <path key={i} d={`M${90 + i * 8} 250 Q${60 + Math.sin(f / 14 + i) * 30} ${170} ${100 + i * 6} ${110} Q${130 + Math.sin(f / 11 + i) * 26} 60 ${96 + i * 10} 0`} stroke="#d8d8d8" strokeWidth={4} fill="none" />)}
    </svg>
    {[1226, 1238, 1250].map(x => <div key={x} style={box(x, 476, 3, 36, '#a03030')} />)}
    {bulb && (
      <>
        <div style={box(1120, 440, 60, 100, 'rgba(255,150,90,.75)', {borderRadius: '30px 30px 0 0', mixBlendMode: 'screen'})} />
        <Glow x={1150} y={480} r={360} color="255,150,90" a={0.42} />
      </>
    )}
  </>
);

// ---------------------------------------------------------------- ร้านสะดวกซื้อ

/** ร้านสะดวกซื้อ: a generic 24-hour minimart (no real brand): sign band, bright glass front with shelves and a
 *  counter, ice-cream chest, bin and a parked motorbike outside. The glass and sign stay lit in every tone. */
export const Minimart: React.FC<{tone: Tone; f: number; sign?: string; dark?: boolean}> = ({tone, f, sign = 'มินิมาร์ท 24 ชม.', dark}) => {
  const lit = dark ? 0 : flicker(f, 61, 0.15);
  return (
    <>
      <Sky tone={skyOf(tone)} y={600} />
      <Toned tone={tone}>
        <div style={box(-700, 60, 900, FLOOR - 60, '#7d7468')} />
        <div style={box(1720, 100, 900, FLOOR - 100, '#8a8478')} />
        <div style={box(200, 140, 1520, FLOOR - 140, '#eceee9')} />
        <Pavement />
      </Toned>
      <div style={box(260, 340, 1400, FLOOR - 340, dark ? '#101418' : 'linear-gradient(#f4f8f6, #dfe8e4)')} />
      {!dark && [0, 1, 2, 3].map(r => (
        <React.Fragment key={r}>
          <div style={box(300, 430 + r * 120, 560, 10, '#9aa5a2')} />
          <div style={box(1080, 430 + r * 120, 300, 10, '#9aa5a2')} />
          {Array.from({length: 14}, (_, k) => {
            const x = k < 9 ? 310 + k * 60 : 1090 + (k - 9) * 58;
            return <div key={k} style={box(x, 384 + r * 120, 40, 46, ['#d64a3a', '#2f7ab0', '#f0c23a', '#4a9a5a', '#e07ab0'][(k * 3 + r) % 5], {borderRadius: 4})} />;
          })}
        </React.Fragment>
      ))}
      {!dark && <div style={box(1420, 640, 220, 290, '#c9cfcc', {boxShadow: 'inset 0 18px 0 #a9b0ad'})} />}
      <div style={box(880, 340, 2, FLOOR - 340, '#8e9895')} />
      <div style={box(1060, 340, 2, FLOOR - 340, '#8e9895')} />
      <div style={box(260, 340, 1400, FLOOR - 340, 'linear-gradient(115deg, rgba(255,255,255,.0) 30%, rgba(255,255,255,.35) 38%, rgba(255,255,255,0) 46%)', {boxShadow: 'inset 0 0 0 12px #c8ceca'})} />
      <div style={box(200, 190, 1520, 120, '#1f7a6d', {opacity: dark ? 0.35 : 1})} />
      <div style={box(200, 190, 1520, 120, 'transparent', {color: '#fdfbf2', fontFamily: KANIT, fontWeight: 700, fontSize: 70, textAlign: 'center', lineHeight: '120px', opacity: dark ? 0.3 : lit})}>{sign}</div>
      <div style={box(200, 300, 1520, 22, '#f0a83a', {opacity: dark ? 0.35 : 1})} />
      <Toned tone={tone}>
        <div style={box(220, FLOOR - 150, 120, 150, '#2f6b4a', {borderRadius: '12px 12px 4px 4px'})} />
        <div style={box(1480, FLOOR - 130, 240, 130, '#e9edf0', {borderRadius: 10, boxShadow: 'inset 0 -26px 0 #2f7ab0, inset 0 18px 0 #cfd6da'})} />
        <svg width={460} height={300} style={{position: 'absolute', left: 1820, top: FLOOR - 270}}>
          <circle cx={80} cy={210} r={56} fill="#1d1d1f" /><circle cx={360} cy={210} r={56} fill="#1d1d1f" />
          <circle cx={80} cy={210} r={22} fill="#8a8a8a" /><circle cx={360} cy={210} r={22} fill="#8a8a8a" />
          <path d="M80 210 L170 120 H300 L360 210 M150 130 L120 60 H70" stroke="#2a2a2c" strokeWidth={18} fill="none" strokeLinecap="round" />
          <path d="M160 140 Q230 90 320 130 L300 160 H170 Z" fill="#b3261e" />
        </svg>
      </Toned>
      {!dark && tone !== 'day' && (
        <>
          <Glow x={960} y={FLOOR + 40} r={900} color="220,245,240" a={0.35} />
          <Glow x={960} y={250} r={700} color="120,220,200" a={0.2 * lit} />
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------- โรงพยาบาล

/** ทางเดินโรงพยาบาลรัฐ: two-tone green wall with a handrail, ward doors with numbers, a hanging sign, a row of joined
 *  waiting chairs, tube lights (`flick` makes them stutter, `off` = only the exit sign), glossy tiles; `bed` adds a gurney. */
export const HospitalHall: React.FC<{f: number; sign?: string; doors?: string[]; flick?: boolean; off?: boolean; bed?: boolean}> = ({
  f, sign = 'หอผู้ป่วยใน', doors = ['301', '302', '303'], flick, off, bed,
}) => {
  const tubes = [260, 960, 1660];
  const k = (i: number) => (off ? 0 : flick ? flicker(f, 50 + i, 0.8) : 1);
  return (
    <>
      <div style={full('#cfd6d0')} />
      <div style={box(-700, 140, W + 1400, 500, '#dfe7df')} />
      <div style={box(-700, 640, W + 1400, FLOOR - 640, '#8fb3a3')} />
      <div style={box(-700, 600, W + 1400, 14, '#c9c2b0', {boxShadow: '0 6px 0 rgba(0,0,0,.12)'})} />
      {[-560, 120, 820, 1520, 2220].map((x, i) => (
        <React.Fragment key={x}>
          <div style={box(x, 310, 230, FLOOR - 310, '#6f8f9b', {boxShadow: 'inset 0 0 0 10px #4d6670'})} />
          <div style={box(x + 85, 360, 60, 120, '#26323a', {boxShadow: 'inset 0 0 0 5px #4d6670'})} />
          <div style={box(x + 160, 640, 14, 40, '#c9c9c9', {borderRadius: 4})} />
          <div style={box(x + 50, 250, 130, 46, '#f4f4f0', {color: '#20343c', fontFamily: KANIT, fontWeight: 700, fontSize: 32, textAlign: 'center', lineHeight: '46px', boxShadow: 'inset 0 0 0 3px #4d6670'})}>{doors[(i + 2) % doors.length]}</div>
        </React.Fragment>
      ))}
      <div style={box(1020, 0, 4, 160, '#555')} />
      <div style={box(1250, 0, 4, 160, '#555')} />
      <div style={box(980, 150, 320, 70, '#1f5a8a', {color: '#fff', fontFamily: KANIT, fontWeight: 700, fontSize: 38, textAlign: 'center', lineHeight: '70px'})}>{sign}</div>
      <div style={box(1700, 520, 110, 50, off ? '#2bd36b' : '#1f9a52', {color: '#fff', fontFamily: KANIT, fontWeight: 700, fontSize: 26, textAlign: 'center', lineHeight: '50px'})}>ทางออก</div>
      {Array.from({length: 4}, (_, i) => (
        <React.Fragment key={i}>
          <div style={box(1100 + i * 100, 730, 86, 80, '#3a6f9a', {borderRadius: '10px 10px 0 0'})} />
          <div style={box(1096 + i * 100, 806, 94, 22, '#2f5c80', {borderRadius: 6})} />
        </React.Fragment>
      ))}
      <div style={box(1090, 828, 420, 12, '#8a8f94')} />
      {[1110, 1480].map(x => <div key={x} style={box(x, 840, 12, FLOOR - 840, '#8a8f94')} />)}
      {bed && (
        <svg width={520} height={300} style={{position: 'absolute', left: 260, top: FLOOR - 300}}>
          <rect x={10} y={110} width={500} height={34} rx={8} fill="#f4f4f0" /><rect x={10} y={140} width={500} height={14} fill="#a9b0b4" />
          <path d="M60 154 V270 M460 154 V270" stroke="#a9b0b4" strokeWidth={10} />
          <circle cx={60} cy={284} r={14} fill="#333" /><circle cx={460} cy={284} r={14} fill="#333" />
          <rect x={30} y={90} width={110} height={30} rx={14} fill="#ffffff" />
          <path d="M500 60 V140" stroke="#a9b0b4" strokeWidth={8} />
        </svg>
      )}
      <div style={box(-700, FLOOR, W + 1400, 650, 'repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0 3px, transparent 3px 140px), linear-gradient(#c2c9c3, #8e968f)')} />
      {tubes.map((x, i) => (
        <React.Fragment key={x}>
          <div style={box(x - 130, 96, 260, 20, '#f4fbff', {opacity: 0.3 + 0.7 * k(i), borderRadius: 6})} />
          <Glow x={x} y={130} r={560} color="225,245,240" a={0.32 * k(i)} />
          <div style={box(x - 90, FLOOR + 30, 180, 220, 'rgba(240,250,248,.3)', {opacity: k(i), filter: 'blur(14px)'})} />
        </React.Fragment>
      ))}
      <div style={full(`rgba(6,12,16,${off ? 0.72 : 0.3 * (1 - Math.min(...tubes.map((_, i) => k(i))))})`, {pointerEvents: 'none'})} />
    </>
  );
};

// ---------------------------------------------------------------- ห้องเรียน

/** ห้องเรียนโรงเรียนรัฐ: green chalkboard (`board` text in chalk), louvre windows, ceiling fan, wall clock, bunting,
 *  student desks on the left and the teacher's desk on the right; the middle stays free for actors. */
export const Classroom: React.FC<{tone: Tone; f: number; board?: string; time?: string}> = ({tone, f, board = 'วันนี้ไม่มีใครขาดเรียน\nเลขที่ 13 ?', time = '15:40'}) => {
  const spin = Math.cos(f / 3);
  return (
    <>
      <div style={full(tone === 'night' ? '#0c1222' : tone === 'dusk' ? '#c98a5a' : '#bcd7e6')} />
      <Toned tone={tone}>
        <div style={box(-700, 60, 2140, FLOOR - 60, '#efe4c8')} />
        <div style={box(-700, 760, 2140, FLOOR - 760, '#c9b78e')} />
        <div style={box(-700, -500, W + 1400, 560, '#d9d1bb')} />
        <div style={box(1440, 60, 1200, FLOOR - 60, '#efe4c8')} />
        <div style={box(1440, 760, 1200, FLOOR - 760, '#c9b78e')} />
        <div style={box(1480, 220, 420, 420, 'transparent', {boxShadow: 'inset 0 0 0 14px #6a8a9a'})} />
        <div style={box(1494, 234, 392, 392, 'repeating-linear-gradient(0deg, rgba(255,255,255,.55) 0 18px, transparent 18px 40px)')} />
        <div style={box(230, 250, 1060, 410, '#7a5a3e')} />
        <div style={box(250, 270, 1020, 370, '#2f4a3a')} />
        <div style={box(250, 270, 1020, 370, 'transparent', {color: 'rgba(240,240,230,.85)', fontFamily: KANIT, fontWeight: 400, fontSize: 64, padding: '40px 50px', boxSizing: 'border-box', whiteSpace: 'pre-line', lineHeight: 1.45})}>{board}</div>
        <div style={box(230, 652, 1060, 18, '#6a4b31')} />
        <svg width={1300} height={120} style={{position: 'absolute', left: 230, top: 120}}>
          <path d="M0 20 Q650 90 1300 20" stroke="#6a5a44" strokeWidth={3} fill="none" />
          {Array.from({length: 16}, (_, i) => {
            const x = 40 + i * 80, y = 20 + Math.sin((x / 1300) * Math.PI) * 52;
            return <path key={i} d={`M${x - 24} ${y} L${x + 24} ${y} L${x} ${y + 46} Z`} fill={['#c23a2e', '#f0c23a', '#2f7ab0', '#f4f4f0'][i % 4]} />;
          })}
        </svg>
        <WallClock x={1660} y={140} t={time} r={56} />
        <div style={box(958, -500, 4, 560, '#555')} />
        <div style={box(940, 56, 40, 24, '#7a7f84', {borderRadius: 8})} />
        {[-1, 1].map(s => <div key={s} style={box(960 - 240, 60, 480, 16, '#9aa0a5', {borderRadius: 8, transform: `scaleX(${s * spin})`})} />)}
        <Boards c0="#8a6a48" c1="#5a4030" />
        {[-60, 300].map(x => (
          <svg key={x} width={340} height={300} style={{position: 'absolute', left: x, top: FLOOR - 300}}>
            <rect x={20} y={70} width={240} height={22} fill="#a8875c" /><rect x={40} y={92} width={200} height={40} fill="#7a5a3e" />
            <path d="M40 132 V300 M240 132 V300" stroke="#55585c" strokeWidth={8} />
            <rect x={200} y={150} width={120} height={14} fill="#a8875c" /><path d="M300 60 V300 M210 164 V300" stroke="#55585c" strokeWidth={8} /><rect x={286} y={60} width={24} height={100} fill="#a8875c" />
          </svg>
        ))}
        <svg width={420} height={300} style={{position: 'absolute', left: 1440, top: FLOOR - 260}}>
          <rect x={0} y={0} width={420} height={30} fill="#8a6a48" /><rect x={20} y={30} width={380} height={230} fill="#6a4b31" />
          <rect x={50} y={60} width={140} height={20} fill="#4a3424" /><rect x={300} y={-40} width={70} height={40} fill="#e9e4d6" /><rect x={290} y={-12} width={90} height={12} fill="#2f6b9a" />
        </svg>
      </Toned>
      {tone === 'day' && <Glow x={1690} y={430} r={700} color="255,250,230" a={0.35} />}
      {tone === 'night' && <Glow x={1690} y={430} r={500} color="170,200,255" a={0.25} />}
    </>
  );
};

// ---------------------------------------------------------------- หอพัก

/** ทางเดินหอพัก: open-air apartment corridor at night: numbered doors, shoe racks, a potted plant, laundry, a tube
 *  light (`flick`), and the balcony wall in front below the floor line. */
export const DormHall: React.FC<{f: number; doors?: string[]; flick?: boolean}> = ({f, doors = ['204', '205', '206'], flick}) => {
  const k = flick ? flicker(f, 70, 0.85) : 1;
  return (
    <>
      <div style={full('#20242a')} />
      <div style={box(-700, -500, W + 1400, 600, '#9a978e')} />
      <div style={box(-700, 100, W + 1400, FLOOR - 100, '#d8d2c2')} />
      <div style={box(-700, 740, W + 1400, FLOOR - 740, 'repeating-linear-gradient(90deg, rgba(0,0,0,.12) 0 2px, transparent 2px 60px), #a7b0a6')} />
      {[-500, 220, 940, 1660, 2380].map((x, i) => (
        <React.Fragment key={x}>
          <div style={box(x, 320, 220, FLOOR - 320, '#7a5a3e', {boxShadow: 'inset 0 0 0 10px #5a4030, inset 0 0 0 30px #7a5a3e, inset 0 0 0 34px #5a4030'})} />
          <div style={box(x + 102, 420, 16, 16, '#222', {borderRadius: '50%', boxShadow: '0 0 0 4px #b9a35a'})} />
          <div style={box(x + 170, 620, 30, 16, '#b9a35a', {borderRadius: 4})} />
          <div style={box(x + 60, 240, 100, 50, '#e9e4d6', {color: '#3a2a1c', fontFamily: KANIT, fontWeight: 700, fontSize: 34, textAlign: 'center', lineHeight: '50px'})}>{doors[(i + 2) % doors.length]}</div>
          <div style={box(x + 250, FLOOR - 160, 150, 160, 'transparent', {boxShadow: 'inset 0 0 0 6px #6d6a62'})} />
          {[0, 1].map(r => <div key={r} style={box(x + 250, FLOOR - 160 + 50 + r * 55, 150, 6, '#6d6a62')} />)}
          {[0, 1, 2, 3].map(s => <div key={s} style={box(x + 262 + (s % 2) * 66, FLOOR - 100 + Math.floor(s / 2) * 55 - 44 + 44, 56, 18, ['#c23a2e', '#2f2f33', '#e9e4d6', '#2f6b9a'][(s + i) % 4], {borderRadius: '10px 14px 4px 4px'})} />)}
        </React.Fragment>
      ))}
      <svg width={260} height={340} style={{position: 'absolute', left: 1360, top: FLOOR - 340}}>
        <path d="M80 250 L100 340 H160 L180 250 Z" fill="#a0583a" />
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M130 250 Q${40 + i * 30} ${120 - (i % 3) * 30} ${20 + i * 36} ${30 + (i % 2) * 40}`} stroke="#3f6a3a" strokeWidth={14} fill="none" strokeLinecap="round" />)}
      </svg>
      <svg width={900} height={200} style={{position: 'absolute', left: 500, top: 40}}>
        <path d="M0 20 Q450 60 900 20" stroke="#555" strokeWidth={3} fill="none" />
        {[[100, '#d9c9a8', 80], [300, '#2f5f8f', 100], [520, '#f4f4f0', 76], [700, '#b3261e', 64]].map(([x, c, h]) => (
          <rect key={x as number} x={x as number} y={30 + Math.sin(((x as number) / 900) * Math.PI) * 26} width={110} height={h as number} fill={c as string} transform={`rotate(${Math.sin(f / 25 + (x as number)) * 2} ${(x as number) + 55} 40)`} />
        ))}
      </svg>
      <div style={box(-700, FLOOR, W + 1400, 650, 'linear-gradient(#bcb6a8, #8c877c)')} />
      <div style={box(-700, FLOOR + 40, W + 1400, 600, 'repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 2px, transparent 2px 80px), #c7c1b2', {boxShadow: 'inset 0 14px 0 #a39d90'})} />
      <div style={box(470, 60, 300, 22, '#f4fbff', {opacity: 0.3 + 0.7 * k, borderRadius: 8})} />
      <Glow x={620} y={100} r={700} color="225,245,240" a={0.34 * k} />
      <div style={full(`rgba(6,10,20,${0.32 + 0.4 * (1 - k)})`, {pointerEvents: 'none'})} />
    </>
  );
};

// ---------------------------------------------------------------- ทุ่งนา

/** ทุ่งนา: rice paddies to the hills, a raised dike path (คันนา) on the floor line for walking, a เถียงนา hut and a
 *  scarecrow in a งอบ hat; rice tufts in front sway. */
export const RiceField: React.FC<{tone: Tone; f: number; ripe?: boolean}> = ({tone, f, ripe}) => {
  const rice = ripe ? ['#e0c45a', '#b8962e'] : ['#7fa84a', '#5d8a36'];
  return (
    <>
      <Sky tone={skyOf(tone)} y={560} />
      <Toned tone={tone}>
        <svg width={W + 1400} height={300} style={{position: 'absolute', left: -700, top: 330}}>
          <path d="M0 260 L400 120 L700 220 L1100 60 L1500 200 L1900 100 L2300 230 L2800 90 L3320 240 V300 H0 Z" fill="#6f8aa0" opacity={0.7} />
        </svg>
        <div style={box(-700, 560, W + 1400, 1100, `linear-gradient(${rice[0]}, ${rice[1]})`)} />
        <svg width={W + 1400} height={420} style={{position: 'absolute', left: -700, top: 560}}>
          {Array.from({length: 14}, (_, r) => {
            const t = (r + 1) / 14, y = 10 + t * t * 380, gap = 14 + t * 56, sz = 3 + t * 15;
            const d = Array.from({length: Math.ceil(3320 / gap)}, (_, k) => {
              const x = k * gap + (r % 2) * gap * 0.5;
              return `M${x} ${y}l${-sz * 0.45} ${-sz}M${x} ${y}l0 ${-sz * 1.25}M${x} ${y}l${sz * 0.45} ${-sz}`;
            }).join('');
            return <path key={r} d={d} stroke={rice[1]} strokeWidth={1 + t * 3} strokeLinecap="round" opacity={0.75} />;
          })}
        </svg>
        {[200, 900, 1700, 2500].map(x => <div key={x} style={box(x, 470, 8, 120, '#4a4a44')} />)}
        <svg width={420} height={420} style={{position: 'absolute', left: 1380, top: 470}}>
          <path d="M20 160 L210 40 L400 160 Z" fill="#b39a62" /><path d="M20 160 L210 40 L400 160" stroke="#8c7444" strokeWidth={10} fill="none" />
          {[50, 200, 360].map(x => <rect key={x} x={x} y={160} width={14} height={220} fill="#5d4a36" />)}
          <rect x={40} y={250} width={340} height={20} fill="#8a6a48" />
        </svg>
        <svg width={260} height={480} style={{position: 'absolute', left: 280, top: FLOOR - 470}}>
          <path d="M130 480 V60 M30 170 H230" stroke="#6a5a44" strokeWidth={12} />
          <path d="M70 150 H190 L210 290 H50 Z" fill="#2f5f8f" /><circle cx={130} cy={110} r={40} fill="#d9c9a8" />
          <path d="M60 92 Q130 30 200 92 Z" fill="#c9a865" /><path d="M120 50 L130 20 L140 50" fill="#c9a865" />
          <path d="M30 170 l-12 24 M230 170 l12 24" stroke="#c9a865" strokeWidth={8} />
        </svg>
        <div style={box(-700, FLOOR - 20, W + 1400, 90, 'linear-gradient(#9a7a52, #7a5e3e)', {borderRadius: 30})} />
        {Array.from({length: 46}, (_, i) => {
          const x = -680 + i * 72, sway = Math.sin(f / 22 + i * 0.7) * 6;
          return (
            <svg key={i} width={70} height={130} style={{position: 'absolute', left: x, top: FLOOR + 50}}>
              {[-2, -1, 0, 1, 2].map(j => <path key={j} d={`M35 130 Q${35 + j * 6} 60 ${35 + j * 12 + sway} ${10 + Math.abs(j) * 10}`} stroke={rice[(i + j) & 1]} strokeWidth={6} fill="none" strokeLinecap="round" />)}
            </svg>
          );
        })}
      </Toned>
      {tone === 'night' && <Glow x={1500} y={140} r={500} color="210,220,245" a={0.3} />}
    </>
  );
};

// ---------------------------------------------------------------- ศาลารอรถ

/** ศาลารอรถริมถนนต่างจังหวัด: concrete bus shelter with a bench and a faded poster, a bus-stop sign, a street lamp
 *  with moths at night, fields behind and the road in front. */
export const BusStop: React.FC<{tone: Tone; f: number; poster?: string}> = ({tone, f, poster = 'คนหาย\nโทร 08x-xxx-xxxx'}) => {
  const head = lampHead(1900, -1, 230);
  return (
    <>
      <Sky tone={skyOf(tone)} y={620} />
      <Toned tone={tone}>
        <div style={box(-700, 620, W + 1400, 400, 'linear-gradient(#7d9a5a, #5d7a42)')} />
        <div style={box(380, 300, 1080, 60, '#d8d2c2', {boxShadow: 'inset 0 -16px 0 #2f6b9a'})} />
        <div style={box(380, 300, 1080, 44, 'transparent', {color: '#2a3a4a', fontFamily: KANIT, fontWeight: 700, fontSize: 34, textAlign: 'center', lineHeight: '44px'})}>ศาลาที่พักผู้โดยสาร</div>
        <svg width={1200} height={80} style={{position: 'absolute', left: 320, top: 230}}><path d="M0 76 L60 10 H1140 L1200 76 Z" fill="#b3261e" /></svg>
        <div style={box(420, 360, 1000, 420, '#cfc8b8', {boxShadow: 'inset 0 -20px 0 rgba(0,0,0,.08)'})} />
        <div style={box(980, 420, 300, 300, '#e9dfc8', {boxShadow: 'inset 0 0 0 6px #b9ad92', color: '#5a4a3a', fontFamily: KANIT, fontWeight: 700, fontSize: 32, textAlign: 'center', paddingTop: 80, boxSizing: 'border-box', whiteSpace: 'pre-line', lineHeight: 1.3, opacity: 0.85})}>{poster}</div>
        <div style={box(1010, 440, 240, 30, 'rgba(0,0,0,.08)')} />
        {[400, 1400].map(x => <div key={x} style={box(x, 360, 44, FLOOR - 360, '#e2dccd', {boxShadow: 'inset -10px 0 0 rgba(0,0,0,.12)'})} />)}
        <div style={box(520, 790, 760, 26, '#9a948a')} />
        {[560, 1220].map(x => <div key={x} style={box(x, 816, 20, FLOOR - 816, '#77726a')} />)}
        <div style={box(1580, 300, 12, FLOOR - 300, '#8a8f94')} />
        <div style={box(1520, 230, 132, 100, '#1f5a8a', {borderRadius: 10, boxShadow: 'inset 0 0 0 5px #f4f4f0', color: '#fff', fontFamily: KANIT, fontWeight: 700, fontSize: 26, textAlign: 'center', paddingTop: 52, boxSizing: 'border-box'})}>ป้ายรถ</div>
        <svg width={70} height={40} style={{position: 'absolute', left: 1551, top: 244}}><rect x={4} y={4} width={62} height={28} rx={6} fill="#f4f4f0" /><circle cx={18} cy={34} r={5} fill="#f4f4f0" /><circle cx={52} cy={34} r={5} fill="#f4f4f0" /></svg>
        <Lamp x={1900} head={230} />
        <div style={box(-700, FLOOR, W + 1400, 40, '#a39d90')} />
        <div style={box(-700, FLOOR + 40, W + 1400, 600, 'linear-gradient(#4a4a4c, #2c2c2e)')} />
        <div style={box(-700, FLOOR + 110, W + 1400, 10, 'repeating-linear-gradient(90deg, rgba(240,230,190,.6) 0 120px, transparent 120px 240px)')} />
      </Toned>
      {tone !== 'day' && (
        <>
          <LampLight at={head} f={f} seed={9} />
          {Array.from({length: 9}, (_, i) => {
            const a = f / (8 + i) + i * 2;
            return <div key={i} style={box(head[0] + Math.cos(a) * (40 + i * 9), head[1] + 30 + Math.sin(a * 1.3) * (24 + i * 5), 6, 4, 'rgba(255,240,200,.85)', {borderRadius: 3})} />;
          })}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------- ถนนทางหลวง + มอเตอร์ไซค์ (ท่านั่งช็อต 021)

/** ถนนทางหลวงด้านข้าง (Side-scrolling Highway Road): layered sunset/day/night sky, horizon sun/moon, two-tone clouds,
 *  scalloped treeline, palm trees, double-arm highway street lamps, passing sedans in background lane, and horizontal asphalt road. */
export const SideRoadSet: React.FC<{
  tone?: Tone;
  moving?: boolean;
  frame?: number;
}> = ({tone = 'dusk', moving = false, frame = 0}) => {
  const skyGrad =
    tone === 'night'
      ? 'linear-gradient(180deg, #16182c 0%, #2b2945 48%, #4d3b52 82%, #6e4f58 100%)'
      : tone === 'day'
        ? 'linear-gradient(180deg, #91525c 0%, #cb7355 38%, #ec9e58 72%, #f7cf74 100%)'
        : 'linear-gradient(180deg, #64394e 0%, #a8544b 36%, #dc834d 70%, #f3be67 100%)';

  const shift = moving ? (frame * 14) % 1920 : 0;
  const carShift = moving ? (frame * 5) % 2400 : 0;
  const dashShift = moving ? (frame * 22) % 200 : 0;

  return (
    <>
      <div style={full(skyGrad)} />
      <svg width={W + 800} height={H} viewBox="-400 0 2720 1080" style={{position: 'absolute', left: -400, top: 0, pointerEvents: 'none'}}>
        <defs>
          <radialGradient id="road-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={tone === 'night' ? '#dbeafe' : '#fff8c8'} stopOpacity="0.95" />
            <stop offset="55%" stopColor={tone === 'night' ? '#93c5fd' : '#fde07a'} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sun / Moon disc on the right horizon */}
        <circle cx="1480" cy="410" r="210" fill="url(#road-sun-glow)" />
        <circle cx="1480" cy="410" r="108" fill={tone === 'night' ? '#e2e8f0' : '#fff4b8'} opacity={tone === 'night' ? 0.75 : 0.95} />

        {/* Two-tone stylized rounded clouds */}
        {[
          {x: 610, y: 155, s: 1.05},
          {x: 1210, y: 58, s: 0.95},
          {x: 1840, y: 150, s: 1.0},
          {x: -80, y: 120, s: 0.85},
        ].map((c, i) => {
          const cx = c.x - (moving ? (frame * 1.2) % 400 : 0);
          const topCol = tone === 'night' ? '#524b6e' : '#e6bc79';
          const botCol = tone === 'night' ? '#36314c' : '#a66266';
          return (
            <g key={i} transform={`translate(${cx} ${c.y}) scale(${c.s})`}>
              <path
                d="M-150 30 C-175 -20 -120 -68 -65 -52 C-35 -92 45 -92 75 -52 C135 -64 180 -12 155 36 C130 72 -125 72 -150 30 Z"
                fill={topCol}
                opacity="0.92"
              />
              <path
                d="M-130 48 C-150 10 -100 -28 -52 -16 C-24 -48 38 -48 64 -16 C115 -24 152 16 130 52 C105 84 -105 84 -130 48 Z"
                fill={botCol}
                opacity="0.95"
              />
            </g>
          );
        })}

        {/* Continuous scalloped horizon treeline */}
        <path
          d={`M-400 460 L-400 395 ${Array.from({length: 68}, (_, i) => {
            const bx = -400 + i * 42;
            const by = 368 + (i % 3 === 0 ? -12 : i % 2 === 0 ? 4 : -6);
            return `Q ${bx + 21} ${by} ${bx + 42} 395`;
          }).join(' ')} L 2450 460 Z`}
          fill={tone === 'night' ? '#231f30' : '#73493d'}
        />

        {/* Palm trees rising above the treeline */}
        {[95, 760, 1680].map((px, idx) => {
          const tx = ((px - shift * 0.35 + 2400) % 2400) - 200;
          const palmCol = tone === 'night' ? '#1c1926' : '#694338';
          return (
            <g key={idx} transform={`translate(${tx} 415)`}>
              <rect x="-4" y="-125" width="8" height="125" fill={palmCol} />
              {[-72, -45, -18, 18, 45, 72].map((deg, fIdx) => (
                <path
                  key={fIdx}
                  d="M0 -122 Q22 -142 46 -116 Q22 -122 0 -116 Z"
                  fill={palmCol}
                  transform={`rotate(${deg} 0 -122)`}
                />
              ))}
              <path d="M0 -122 Q-26 -142 -48 -114 Q-22 -120 0 -116 Z" fill={palmCol} transform="rotate(-15 0 -122)" />
              <path d="M0 -122 Q-26 -142 -48 -114 Q-22 -120 0 -116 Z" fill={palmCol} transform="rotate(25 0 -122)" />
            </g>
          );
        })}

        {/* Double-arm curved street lamps along the highway */}
        {[540, 1320, 2100].map((lx, idx) => {
          const sx = ((lx - shift + 2400) % 2340) - 200;
          const poleCol = tone === 'night' ? '#474559' : '#7d5f5b';
          return (
            <g key={idx} transform={`translate(${sx} 615)`}>
              <rect x="-5" y="-455" width="10" height="455" fill={poleCol} />
              <path d="M0 -425 Q-18 -462 -86 -460 M0 -425 Q18 -462 86 -460" fill="none" stroke={poleCol} strokeWidth="7" strokeLinecap="round" />
              <rect x="-112" y="-465" width="32" height="9" rx="4" fill={poleCol} />
              <rect x="80" y="-465" width="32" height="9" rx="4" fill={poleCol} />
              {tone === 'night' && (
                <>
                  <circle cx="-96" cy="-454" r="18" fill="#fef08a" opacity="0.55" />
                  <circle cx="96" cy="-454" r="18" fill="#fef08a" opacity="0.55" />
                </>
              )}
            </g>
          );
        })}

        {/* Upper sandy road berm / divider */}
        <rect x="-400" y="440" width="2720" height="175" fill={tone === 'night' ? '#352f42' : '#c49b6c'} />
        {[465, 495, 525, 555].map((ly, i) => (
          <line key={i} x1="-400" y1={ly} x2="2320" y2={ly} stroke={tone === 'night' ? '#282334' : '#b08659'} strokeWidth="4" />
        ))}

        {/* Background lane cars (sedans) */}
        {[
          {x: 160, body: tone === 'night' ? '#585266' : '#a3898e', win: '#423f4d'},
          {x: 1380, body: tone === 'night' ? '#464352' : '#73645b', win: '#3d3c47'},
        ].map((car, idx) => {
          const cx = ((car.x - carShift + 2600) % 2500) - 350;
          return (
            <g key={idx} transform={`translate(${cx} 605)`}>
              <path
                d="M-320 0 L-305 -86 Q-285 -112 -225 -114 L-150 -200 Q-115 -224 45 -224 Q120 -224 165 -192 L245 -112 L345 -98 Q372 -92 375 -60 L375 0 Z"
                fill={car.body}
              />
              <path d="M-195 -114 L-132 -186 Q-105 -204 -18 -204 L-18 -114 Z" fill={car.win} />
              <path d="M2 -114 L2 -204 Q98 -204 142 -180 L212 -114 Z" fill={car.win} />
              <path d="M-135 -196 Q0 -218 148 -188" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="4" />
              <line x1="-305" y1="-96" x2="355" y2="-96" stroke="rgba(255,255,255,0.22)" strokeWidth="3" />
              <rect x="368" y="-58" width="18" height="32" rx="4" fill="#d8dee9" />
            </g>
          );
        })}

        {/* Main Horizontal Asphalt Road */}
        <rect x="-400" y="605" width="2720" height="310" fill={tone === 'night' ? '#2c2836' : '#5e505d'} />
        <line
          x1={-400 - dashShift}
          y1="755"
          x2="2320"
          y2="755"
          stroke={tone === 'night' ? '#686275' : '#9c8f9b'}
          strokeWidth="10"
          strokeDasharray="110 90"
        />
        <rect x="-400" y="880" width="2720" height="80" fill="#2b262e" />
        <rect x="-400" y="960" width="2720" height="120" fill="#3a332c" />
        <line x1="-400" y1="995" x2="2320" y2="995" stroke="#52483e" strokeWidth="10" />

        {/* Red & white roadside milestone bollards at bottom corners */}
        {[30, 1890].map((mx, i) => (
          <g key={i} transform={`translate(${mx} 900)`}>
            <rect x="-18" y="0" width="36" height="140" rx="4" fill="#d8d4cc" />
            <rect x="-18" y="0" width="36" height="42" rx="4" fill="#b8332a" />
            <circle cx="0" cy="21" r="6" fill="#facc15" />
          </g>
        ))}
      </svg>
    </>
  );
};

/** Configuration for any character sitting in the standard side-riding motorcycle posture (shot 021 reference). */
export interface MotorcycleRider {
  /** Wear matte black half-shell motorcycle helmet while riding (default `true`) */
  helmet?: boolean;
  /** Facial expression (`'wary'` | `'happy'` | any `face-*` id from CastSprite) */
  face?: string;
  /** Torso / sleeve color (default `'#2f6b55'`) */
  shirt?: string;
  /** Pants / leg color (default `'#1b2430'`) */
  pants?: string;
  /** Skin tone (default `'#dfa67e'`) */
  skin?: string;
  /** Shaded skin tone for neck & ears (default `'#be855e'`) */
  skinD?: string;
  /** Hairstyle id from CastSprite without `'hair-'` prefix (default `'short'`) */
  hair?: string;
  /** Hair color (default `'#18181f'`) */
  hairColor?: string;
  /** Show rider vest stripe + number badge (`true` / number = show badge, `false` = plain shirt; default `14`) */
  vest?: boolean | number;
  /** Show wristwatch on riding arm (default `true`) */
  watch?: boolean;
  /** Optional extra SVG nodes rendered on the torso */
  extra?: React.ReactNode;
}

/** มอเตอร์ไซค์ + ท่านั่งขี่ด้านข้าง (อิงช็อต 021):
 *  Full-sized 2D vector Thai commuter motorcycle (1.65x true scale relative to 510px characters) with optional `rider`
 *  in the side-riding sitting posture (bent legs on footpegs, leaning torso, head looking forward, extended arm gripping throttle).
 *  Can be used parked (`rider` omitted) or ridden by any character (`rider={{shirt, pants, skin, hair, face, vest}}`). */
export const Motorcycle: React.FC<{
  x: number;
  y?: number;
  scale?: number;
  color?: string;
  flip?: boolean;
  headlight?: boolean;
  eggsBag?: boolean;
  showBox?: boolean;
  /** Show matte black half-shell motorcycle helmet resting on the bike when parked (default `true`) */
  helmetOnBike?: boolean;
  rider?: MotorcycleRider | boolean;
  wheelSpin?: number;
}> = ({
  x,
  y = FLOOR,
  scale = 1,
  color = '#2f6b55',
  flip = false,
  headlight = false,
  eggsBag = false,
  helmetOnBike = true,
  rider,
  wheelSpin = 0,
}) => {
  const r: MotorcycleRider | null = rider ? (typeof rider === 'boolean' ? {} : rider) : null;
  const shirt = r?.shirt ?? '#2f6b55';
  const pants = r?.pants ?? '#1b2430';
  const skin = r?.skin ?? '#dfa67e';
  const skinD = r?.skinD ?? '#be855e';
  const hair = r?.hair ?? 'short';
  const hairColor = r?.hairColor ?? '#18181f';
  const face = r?.face ?? 'wary';
  const vest = r?.vest !== undefined ? r.vest : 14;
  const watch = r?.watch ?? true;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        transform: `scale(${flip ? -scale : scale}, ${scale})`,
        pointerEvents: 'none',
        zIndex: 14,
      }}
    >
      <svg width="1100" height="620" viewBox="-380 -540 1100 620" style={{position: 'absolute', left: -380, top: -540, overflow: 'visible'}}>
        <defs>
          <linearGradient id="headlight-cone" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#fff7c2" stopOpacity="0.62" />
            <stop offset="55%" stopColor="#fde68a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wide warm headlight beam cone */}
        {headlight && (
          <g>
            <polygon points="196,-254 840,-330 840,-10" fill="url(#headlight-cone)" />
            <circle cx="196" cy="-254" r="28" fill="rgba(255, 247, 194, 0.5)" />
          </g>
        )}

        {/* Far-side leg of rider (behind motorcycle body) */}
        {r && (
          <g>
            <path
              d="M-92 -202 L8 -175 L-4 -86"
              fill="none"
              stroke="#141b24"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="-20" y="-96" width="44" height="22" rx="10" fill="#0b0f16" />
          </g>
        )}

        {/* Thai Commuter Motorcycle scaled 1.65x so it is 100% proportional to 510px characters */}
        <g transform="scale(1.65)">
          {/* Ground shadow */}
          <ellipse cx="0" cy="4" rx="155" ry="12" fill="rgba(0,0,0,.45)" />
          {/* Kickstand (when parked) */}
          {!r && <line x1="-18" y1="-38" x2="-42" y2="4" stroke="#3a3f47" strokeWidth="6" strokeLinecap="round" />}
          {/* Rear & Front Spoked Wheels */}
          {[-108, 108].map((wx, idx) => (
            <g key={idx} transform={`translate(${wx} -54) rotate(${wheelSpin})`}>
              <circle r="52" fill="none" stroke="#16191f" strokeWidth="16" />
              <circle r="40" fill="none" stroke="#aeb6c2" strokeWidth="5" />
              <circle r="12" fill="#4a525d" />
              {Array.from({length: 8}, (_, i) => {
                const a = (i * Math.PI) / 4;
                return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 38} y2={Math.sin(a) * 38} stroke="#8c96a4" strokeWidth="2.2" />;
              })}
            </g>
          ))}
          {/* Exhaust pipe */}
          <path d="M-20 -46 L-126 -52 L-134 -62 L-30 -60 Z" fill="#68707c" stroke="#262a30" strokeWidth="3" />
          <rect x="-118" y="-58" width="64" height="8" rx="4" fill="#b8c0cc" />
          {/* Engine block & chain cover */}
          <rect x="-46" y="-82" width="62" height="44" rx="8" fill="#49515c" stroke="#22262c" strokeWidth="3.5" />
          <circle cx="-18" cy="-58" r="13" fill="#6b7480" stroke="#22262c" strokeWidth="2.5" />
          {/* Rear suspension */}
          <line x1="-88" y1="-112" x2="-102" y2="-56" stroke="#d9a91c" strokeWidth="8" strokeDasharray="6 3" />
          {/* Body fairing */}
          <path
            d="M-132 -118 Q-80 -132 -28 -116 L28 -86 L74 -158 L106 -152 L88 -74 L24 -54 L-36 -58 L-112 -92 Z"
            fill={color}
            stroke="#182026"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Side stripe */}
          <path d="M-98 -110 L-18 -96 L48 -124" fill="none" stroke="#f6c445" strokeWidth="5" strokeLinecap="round" />
          {/* Front fender */}
          <path d="M68 -96 Q116 -112 146 -78 L112 -72 Q92 -86 72 -80 Z" fill={color} stroke="#182026" strokeWidth="3.5" />
          {/* Front fork */}
          <line x1="78" y1="-148" x2="108" y2="-54" stroke="#9aa3b0" strokeWidth="9" strokeLinecap="round" />
          {/* Dual seat */}
          <path d="M-126 -122 Q-72 -142 -18 -122 L-24 -106 L-120 -106 Z" fill="#1e2229" stroke="#0f1217" strokeWidth="3.5" />
          {/* Matte black half-shell helmet resting on seat when parked */}
          {!r && helmetOnBike !== false && (
            <g transform="translate(-70 -138) rotate(-4)">
              <ellipse cx="0" cy="3" rx="32" ry="7" fill="rgba(0,0,0,.42)" />
              <path d="M-30 0 C-30 -32 30 -32 30 0 Q0 3 -30 0 Z" fill="#1b1e23" stroke="#0d0f12" strokeWidth="2.5" />
              <path d="M-20 -15 C-12 -25 12 -25 20 -15" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="3" strokeLinecap="round" />
              <path d="M-30 0 Q0 3 30 0" fill="none" stroke="#090b0e" strokeWidth="4" strokeLinecap="round" />
              <circle cx="-24" cy="-2" r="1.6" fill="#e2e8f0" stroke="#475569" strokeWidth="0.5" />
              <circle cx="0" cy="1" r="1.6" fill="#e2e8f0" stroke="#475569" strokeWidth="0.5" />
              <circle cx="24" cy="-2" r="1.6" fill="#e2e8f0" stroke="#475569" strokeWidth="0.5" />
              <path d="M-6 0 C-6 14 10 18 12 30" fill="none" stroke="#16181c" strokeWidth="3" strokeLinecap="round" />
              <rect x="9" y="26" width="6" height="5" rx="1.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            </g>
          )}
          {/* Rear grab rail / rack */}
          <path d="M-126 -124 L-156 -130 L-148 -114 L-120 -114" fill="none" stroke="#7d8590" strokeWidth="6" strokeLinecap="round" />
          {/* Headlight cowl & handlebar */}
          <path d="M62 -162 L114 -168 L122 -142 L74 -138 Z" fill={color} stroke="#182026" strokeWidth="3.5" />
          <ellipse cx="118" cy="-154" rx="8" ry="12" fill={headlight ? '#fff6bd' : '#d8e2ec'} stroke="#262a30" strokeWidth="2.5" />
          <line x1="50" y1="-172" x2="86" y2="-164" stroke="#22262c" strokeWidth="7" strokeLinecap="round" />
          {/* Rearview mirror */}
          <path d="M68 -168 L58 -198 L42 -202" fill="none" stroke="#22262c" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="38" cy="-202" rx="12" ry="8" fill="#495464" stroke="#182026" strokeWidth="2.5" />
          {/* Tail light & license plate */}
          <rect x="-142" y="-114" width="12" height="16" rx="3" fill="#e5383b" />
          <rect x="-152" y="-96" width="22" height="16" rx="2" fill="#f6f1e6" stroke="#18202e" strokeWidth="2" />
          {/* Plastic bag with 3 boiled eggs hanging on handlebar */}
          {eggsBag && (
            <g transform="translate(64 -154)">
              <path d="M0 -8 C-6 6 -16 18 -14 34 C-12 46 12 46 14 34 C16 18 6 6 0 -8 Z" fill="rgba(245,242,235,0.82)" stroke="#b5ada0" strokeWidth="2" />
              <line x1="-6" y1="2" x2="6" y2="2" stroke="#e5383b" strokeWidth="3" />
              <ellipse cx="-5" cy="28" rx="6" ry="7.5" fill="#f7ebd2" stroke="#bfa782" strokeWidth="1.5" />
              <ellipse cx="5" cy="30" rx="6" ry="7.5" fill="#f7ebd2" stroke="#bfa782" strokeWidth="1.5" />
              <ellipse cx="0" cy="20" rx="6" ry="7.5" fill="#f7ebd2" stroke="#bfa782" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* Foreground parts of rider in shot 021 side-riding posture */}
        {r && (
          <g>
            {/* Near-side bent leg on footpeg */}
            <path
              d="M-82 -202 L22 -172 L8 -82"
              fill="none"
              stroke={pants}
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="-8" y="-92" width="44" height="22" rx="10" fill="#0f141c" />

            {/* Leaning torso + head */}
            <g transform="translate(-174 -492) rotate(8 92 240)">
              {/* Neck, Head & Ears */}
              <rect x="88" y="118" width="24" height="26" fill={skinD} />
              <circle cx="100" cy="65" r="65" fill={skin} />
              {hair === 'short' ? (
                <path
                  d="M30 80 C20 14 66 -10 100 -10 C138 -10 182 14 170 80 C164 58 150 44 130 40 C112 54 86 52 70 38 C52 46 38 60 30 80Z"
                  fill={hairColor}
                />
              ) : (
                <use href={`#hair-${hair}`} style={{'--hair': hairColor} as React.CSSProperties} />
              )}
              <circle cx="35" cy="78" r="10" fill={skinD} />
              <circle cx="165" cy="78" r="10" fill={skinD} />
              {/* Matte black half-shell motorcycle helmet over head */}
              {r.helmet !== false && (
                <g>
                  <path d="M26 62 C26 -16 174 -16 174 62 Q100 68 26 62 Z" fill="#1b1e23" stroke="#0d0f12" strokeWidth="2.5" />
                  <path d="M48 24 C68 2 132 2 152 24" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M24 62 Q100 69 176 62" fill="none" stroke="#090b0d" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="42" cy="58" r="2.8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
                  <circle cx="100" cy="65" r="2.8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
                  <circle cx="158" cy="58" r="2.8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
                </g>
              )}

              {/* Facial expression shifted slightly right toward the road */}
              <g transform="translate(14 0)">
                {face === 'happy' ? (
                  <>
                    <path d="M65 72 Q77 60 89 72 M111 72 Q123 60 135 72" fill="none" stroke="#1a1a22" strokeWidth="5" strokeLinecap="round" />
                    <path d="M84 94 Q100 112 116 94 Z" fill="#7a3b34" />
                  </>
                ) : face === 'wary' ? (
                  <>
                    <circle cx="77" cy="72" r="6" fill="#1a1a22" />
                    <circle cx="123" cy="72" r="6" fill="#1a1a22" />
                    <line x1="65" y1="58" x2="87" y2="61" stroke="#1a1a22" strokeWidth="4.5" strokeLinecap="round" />
                    <line x1="113" y1="61" x2="135" y2="58" stroke="#1a1a22" strokeWidth="4.5" strokeLinecap="round" />
                    <ellipse cx="100" cy="97" rx="9" ry="3" fill="#7a3b34" />
                  </>
                ) : (
                  <use href={`#face-${face}`} />
                )}
              </g>

              {/* Torso */}
              <rect x="58" y="140" width="84" height="175" rx="30" fill={shirt} />
              {vest && (
                <g>
                  {/* Orange vest body with V-neck */}
                  <path d="M58 152 L78 152 L94 176 L110 152 L142 152 L142 312 L58 312 Z" fill="#ea580c" stroke="#18181b" strokeWidth="2.5" />
                  <polygon points="78,152 94,176 110,152" fill="#94a3b8" stroke="#18181b" strokeWidth="1.5" />
                  <line x1="94" y1="176" x2="94" y2="312" stroke="#18181b" strokeWidth="2.5" />
                  {/* Thai Flag */}
                  <g transform="translate(64 160)">
                    <rect x="0" y="0" width="16" height="11" rx="2" fill="#ef4444" stroke="#1e293b" strokeWidth="0.8" />
                    <rect x="0" y="2" width="16" height="7" fill="#ffffff" />
                    <rect x="0" y="4" width="16" height="3" fill="#2563eb" />
                  </g>
                  <circle cx="72" cy="184" r="6.5" fill="#f59e0b" stroke="#92400e" strokeWidth="1.2" />
                  {/* Driver number */}
                  <text x="124" y="174" textAnchor="middle" fontSize="16" fontWeight="900" fill="#ffffff" stroke="#334155" strokeWidth="1.8" fontFamily="Noto Sans Thai, sans-serif">
                    {typeof vest === 'number' ? vest : 14}
                  </text>
                  {/* ID card pocket */}
                  <rect x="110" y="184" width="22" height="15" rx="2" fill="#18181b" />
                  <rect x="112" y="186" width="18" height="11" rx="1.5" fill="#fecdd3" />
                  {/* Silver reflective stripe */}
                  <rect x="58" y="214" width="84" height="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                  {/* Lower black zip cargo pockets */}
                  <rect x="62" y="238" width="34" height="38" rx="4" fill="#181c24" stroke="#090a0f" strokeWidth="1.5" />
                  <line x1="65" y1="244" x2="92" y2="244" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <rect x="100" y="238" width="34" height="38" rx="4" fill="#181c24" stroke="#090a0f" strokeWidth="1.5" />
                  <line x1="103" y1="244" x2="130" y2="244" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
              {r.extra}
            </g>

            {/* Riding arm reaching forward to grip the motorcycle handlebar */}
            <path
              d="M-64 -332 L18 -292 L106 -276"
              fill="none"
              stroke={shirt}
              strokeWidth="34"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {watch && (
              <>
                <rect x="78" y="-294" width="12" height="32" rx="4" transform="rotate(10 84 -278)" fill="#1e293b" />
                <circle cx="84" cy="-278" r="8" fill="#f6f1e6" stroke="#d4a73c" strokeWidth="2" />
              </>
            )}
            {/* Hand gripping throttle */}
            <circle cx="112" cy="-275" r="15" fill={skin} />
          </g>
        )}
      </svg>
    </div>
  );
};
