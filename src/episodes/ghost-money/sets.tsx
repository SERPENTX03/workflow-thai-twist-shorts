import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {Sprite} from '../../cast/Sprite';
import {W, H, FLOOR, full, Glow, Boards, Planks, Sky, WallClock, Beam} from '../../kit/world';
import {Stage as KitStage} from '../../kit/stage';
import {SideRoadSet, Motorcycle, type MotorcycleRider} from '../../kit/places';

export {SideRoadSet, Motorcycle, type MotorcycleRider};

/** Episode Stage wrapper */
export const Stage: React.FC<ShotProps & {bg?: string; hud?: string | null; cam?: number[]; presets?: Record<string, number[]>; children: React.ReactNode}> = ({
  bg,
  cam,
  presets,
  children,
  ...p
}) => <KitStage p={p} bg={bg} cam={cam} presets={presets} world={children} />;

/** Ornate Thai funeral coffin + portrait stand + candles + wreaths */
export const OrnateCoffin: React.FC<{
  x: number;
  y?: number;
  scale?: number;
  photo?: 'covered' | 'glow' | 'mek';
  clothMove?: boolean;
  candlesOut?: boolean;
  empty?: boolean;
  frame?: number;
}> = ({x, y = FLOOR, scale = 1, photo = 'covered', clothMove = false, candlesOut = false, empty = false, frame = 0}) => {
  const sway = clothMove ? Math.sin(frame / 4) * 8 : Math.sin(frame / 18) * 1.5;
  const flick = 0.88 + Math.sin(frame / 3) * 0.12;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `scale(${scale})`, pointerEvents: 'none'}}>
      {!candlesOut && <Glow x={0} y={-220} r={340} color="255,195,110" a={0.32 * flick} />}
      {photo === 'glow' && <Glow x={190} y={-210} r={220} color="255,220,140" a={0.55} />}
      <svg width="760" height="520" viewBox="-380 -480 760 520" style={{position: 'absolute', left: -380, top: -480, overflow: 'visible'}}>
        {/* Left & Right Funeral Wreaths (พวงหรีด) */}
        {[-290, 295].map((wx, idx) => (
          <g key={idx} transform={`translate(${wx} 0)`}>
            <line x1="-28" y1="-150" x2="-46" y2="0" stroke="#3e2a1b" strokeWidth="7" />
            <line x1="28" y1="-150" x2="46" y2="0" stroke="#3e2a1b" strokeWidth="7" />
            <circle cx="0" cy="-190" r="68" fill="#1e4631" stroke="#d4af37" strokeWidth="5" />
            <circle cx="0" cy="-190" r="48" fill="#f6f1e6" stroke="#d4af37" strokeWidth="3" />
            {Array.from({length: 12}, (_, i) => {
              const a = (i * Math.PI) / 6;
              return <circle key={i} cx={Math.cos(a) * 58} cy={-190 + Math.sin(a) * 58} r="10" fill={i % 2 === 0 ? '#f6f1e6' : '#f6c445'} />;
            })}
            <rect x="-56" y="-202" width="112" height="24" rx="4" fill="#2c1836" stroke="#f6c445" strokeWidth="2" />
            <text x="0" y="-185" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f6e3b4" fontFamily="Noto Sans Thai, sans-serif">
              อาลัยยิ่ง
            </text>
          </g>
        ))}

        {/* Two-tiered Golden Pedestal Base (ฐานตั้งโลง) */}
        <rect x="-230" y="-65" width="420" height="65" rx="6" fill="#4a301d" stroke="#24160c" strokeWidth="4" />
        <rect x="-215" y="-52" width="390" height="14" fill="#d4a73c" />
        <rect x="-200" y="-135" width="360" height="70" rx="4" fill="#5e3d24" stroke="#24160c" strokeWidth="4" />
        <rect x="-188" y="-120" width="336" height="40" fill="#b88928" opacity=".85" />

        {/* Ornate White & Gold Thai Coffin (โลงศพเทพพนม) */}
        <g transform={empty ? 'translate(0 0)' : undefined}>
          <polygon
            points="-190,-135 150,-135 172,-285 -212,-285"
            fill="#f7f3e8"
            stroke="#b88928"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Gold relief trim & Thai kranok diamond motifs */}
          <line x1="-198" y1="-255" x2="160" y2="-255" stroke="#d4a73c" strokeWidth="6" />
          <line x1="-186" y1="-165" x2="146" y2="-165" stroke="#d4a73c" strokeWidth="6" />
          {[-140, -70, 0, 70].map((kx, i) => (
            <polygon
              key={i}
              points={`${kx},-240 ${kx + 22},-210 ${kx},-180 ${kx - 22},-210`}
              fill="#e5c158"
              stroke="#9c7119"
              strokeWidth="2.5"
            />
          ))}
          {/* Tiered Coffin Lid (ฝาโลง) */}
          <g transform={empty ? 'translate(-45 -22) rotate(-5)' : undefined}>
            <polygon points="-222,-285 182,-285 162,-325 -202,-325" fill="#d4a73c" stroke="#6e4e10" strokeWidth="4" />
            <polygon points="-196,-325 156,-325 140,-350 -180,-350" fill="#f7f3e8" stroke="#b88928" strokeWidth="4" />
          </g>
          {empty && (
            <g>
              <rect x="-160" y="-282" width="280" height="18" fill="#181210" />
              <text x="-20" y="-210" textAnchor="middle" fontSize="22" fontWeight="900" fill="#b3261e" fontFamily="Noto Sans Thai, sans-serif">
                (โลงจัดฉาก)
              </text>
            </g>
          )}
        </g>

        {/* Sacred white cord (สายสิญจน์) from coffin */}
        <path d="M-20 -335 Q-180 -380 -370 -310" fill="none" stroke="#f6f1e6" strokeWidth="3" strokeDasharray="8 4" opacity=".85" />

        {/* Brass Candle Stands & Incense Burner in front of coffin */}
        {[-95, 55].map((cx, idx) => (
          <g key={idx} transform={`translate(${cx} 0)`}>
            <rect x="-16" y="-20" width="32" height="20" rx="4" fill="#b88928" stroke="#4a3508" strokeWidth="2.5" />
            <rect x="-6" y="-115" width="12" height="95" fill="#b88928" stroke="#4a3508" strokeWidth="2.5" />
            <ellipse cx="0" cy="-115" rx="22" ry="7" fill="#d4a73c" stroke="#4a3508" strokeWidth="2.5" />
            {/* Candle */}
            <rect x="-7" y="-175" width="14" height="60" rx="3" fill="#f3dfb2" stroke="#aa8c4a" strokeWidth="2" />
            {!candlesOut ? (
              <g transform={`translate(0 -185) scale(${flick})`}>
                <ellipse cx="0" cy="-6" rx="9" ry="18" fill="#ff9d2e" opacity=".85" />
                <ellipse cx="0" cy="-4" rx="4.5" ry="10" fill="#fff7cc" />
              </g>
            ) : (
              <path d="M0 -178 Q-8 -196 4 -214 Q14 -230 -4 -248" fill="none" stroke="rgba(200,210,225,0.55)" strokeWidth="3.5" strokeLinecap="round" />
            )}
          </g>
        ))}

        {/* Funeral Portrait Frame on Easel Stand (รูปหน้าโลง) at x = 190 */}
        <g transform="translate(190 0)">
          {/* Wooden easel legs */}
          <line x1="-42" y1="-150" x2="-62" y2="0" stroke="#3e2a1b" strokeWidth="9" strokeLinecap="round" />
          <line x1="42" y1="-150" x2="62" y2="0" stroke="#3e2a1b" strokeWidth="9" strokeLinecap="round" />
          <line x1="0" y1="-180" x2="18" y2="0" stroke="#291b10" strokeWidth="7" strokeLinecap="round" />
          {/* Ornate Gold Frame */}
          <rect x="-62" y="-305" width="124" height="158" rx="8" fill="#d4a73c" stroke="#5e430d" strokeWidth="4" />
          <rect x="-50" y="-293" width="100" height="134" rx="4" fill="#d9e6f2" stroke="#3a2a14" strokeWidth="2.5" />

          {/* Portrait inside frame (Mek with blue jacket & yellow cross patch) */}
          <g opacity={photo === 'covered' ? 0.18 : 0.92}>
            <circle cx="0" cy="-246" r="22" fill="#d8a27c" />
            <path d="M-22 -248 Q-18 -274 4 -270 Q24 -268 22 -244 Z" fill="#1c1922" />
            <path d="M-36 -162 Q-34 -216 0 -216 Q34 -216 36 -162 Z" fill="#2f5f8f" />
            {/* Yellow cross-stitch patch on elbow */}
            <g transform="translate(24 -182)">
              <rect x="-9" y="-9" width="18" height="18" rx="3" fill="#1e3f63" stroke="#f6c445" strokeWidth="2" />
              <path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke="#f6c445" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>

          {/* Translucent / Ceremonial Cloth draping the frame */}
          {(photo === 'covered' || photo === 'glow') && (
            <path
              d={`M-68 -310 H68 L${72 + sway} -138 Q0 ${-124 + sway * 0.5} ${-68 + sway} -138 Z`}
              fill={photo === 'glow' ? 'rgba(255,244,214,0.42)' : '#ede6d5'}
              stroke="#b88928"
              strokeWidth="3.5"
            />
          )}
          {photo === 'covered' && (
            <path d={`M-52 -280 Q0 -260 52 -280 M-48 -200 Q0 -182 48 -200`} fill="none" stroke="#c8bfa8" strokeWidth="3" />
          )}
        </g>
      </svg>
    </div>
  );
};

/** Chanting monks row on raised platform + rhythmic sound ripples */
export const MonksChantingRow: React.FC<{x?: number; y?: number; chant?: boolean; knocks?: number; frame?: number}> = ({
  x = 340,
  y = FLOOR,
  chant = false,
  knocks = 0,
  frame = 0,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none'}}>
    {/* Raised wooden dais (อาสนะสงฆ์) */}
    <div
      style={{
        position: 'absolute',
        left: -260,
        top: -86,
        width: 520,
        height: 86,
        background: 'linear-gradient(180deg, #7c3f2c, #4a2418)',
        borderTop: '6px solid #d4a73c',
        borderRadius: '6px 6px 0 0',
        boxShadow: '0 8px 24px rgba(0,0,0,.45)',
      }}
    />
    {[-150, 0, 150].map((mx, i) => (
      <div key={i} style={{position: 'absolute', left: mx - 85, top: -474, width: 170, height: 400}}>
        <Sprite id="monk-sit" style={{width: '100%', height: '100%'}} />
      </div>
    ))}
    {/* Sound ripples when chanting or wooden clapper knocks */}
    {(chant || knocks > 0) && (
      <svg width="500" height="300" viewBox="-250 -250 500 300" style={{position: 'absolute', left: -250, top: -380, overflow: 'visible'}}>
        {[0, 1, 2].map(i => {
          const r = 60 + ((frame * 2 + i * 45) % 140);
          const op = Math.max(0, 1 - r / 200) * (knocks > 0 ? 0.75 : 0.4);
          return (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={r}
              fill="none"
              stroke={knocks > 0 ? '#f6c445' : '#ffcf8a'}
              strokeWidth={knocks > 0 ? 4 : 2.5}
              opacity={op}
            />
          );
        })}
      </svg>
    )}
  </div>
);

/** Registration Desk with blue carbon ledger, stack of 1,000-baht banknotes, and optional spilled bowl */
export const RegistrationDesk: React.FC<{x: number; y?: number; notes?: boolean; spilled?: boolean}> = ({
  x,
  y = FLOOR,
  notes = true,
  spilled = false,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none'}}>
    <svg width="420" height="280" viewBox="-210 -240 420 280" style={{position: 'absolute', left: -210, top: -240, overflow: 'visible'}}>
      {/* Wooden Table */}
      <rect x="-175" y="-175" width="350" height="24" rx="6" fill="#734f32" stroke="#2c1d11" strokeWidth="4" />
      <rect x="-152" y="-151" width="24" height="151" fill="#4a321f" stroke="#2c1d11" strokeWidth="3.5" />
      <rect x="128" y="-151" width="24" height="151" fill="#4a321f" stroke="#2c1d11" strokeWidth="3.5" />
      <rect x="-128" y="-151" width="256" height="26" fill="#3a2617" />

      {/* Blue Carbon Ledger Book (สมุดลงชื่อกระดาษคาร์บอน) */}
      <g transform="translate(-55 -192)">
        <rect x="-52" y="-10" width="104" height="22" rx="3" fill="#23477a" stroke="#122644" strokeWidth="3" />
        <rect x="-46" y="-15" width="92" height="10" rx="2" fill="#f6f1e6" stroke="#8a8270" strokeWidth="2" />
        <rect x="-42" y="-18" width="84" height="5" fill="#3b6bc4" />
        {/* Pen */}
        <line x1="12" y1="-16" x2="38" y2="-36" stroke="#18202e" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Crisp stack of 3 x 1,000-baht banknotes */}
      {notes && (
        <g transform="translate(65 -190)">
          <rect x="-36" y="-8" width="72" height="18" rx="2" fill="#a89078" stroke="#4a3c2e" strokeWidth="2.5" />
          <rect x="-32" y="-13" width="72" height="18" rx="2" fill="#bfa68c" stroke="#4a3c2e" strokeWidth="2.5" />
          <rect x="-28" y="-18" width="72" height="18" rx="2" fill="#d5bda3" stroke="#4a3c2e" strokeWidth="2.5" />
          <circle cx="8" cy="-9" r="5" fill="#8c6d50" />
          <text x="-12" y="-5" fontSize="10" fontWeight="900" fill="#3d2e20" fontFamily="Noto Sans Thai, sans-serif">
            1000
          </text>
        </g>
      )}

      {/* Spilled porridge bowl with red thread on the floor when Tham knocks it over */}
      {spilled && (
        <g transform="translate(80 6)">
          <ellipse cx="10" cy="4" rx="75" ry="18" fill="#e8e2d0" opacity=".88" />
          <path d="M-38 -8 C-10 -24 28 -18 54 4 C20 14 -20 12 -48 2 Z" fill="#f6f1e6" />
          {/* Overturned ceramic bowl */}
          <path d="M-45 -4 A36 28 0 0 1 25 -12 Z" fill="#e9e4d6" stroke="#6e6759" strokeWidth="3.5" />
          {/* Red amulet thread tangled in spilled porridge */}
          <path d="M-32 2 Q-5 -14 18 4 Q42 18 58 -2" fill="none" stroke="#d92626" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  </div>
);

/** Front-row chairs + mourning sarong hem + porridge bowls tray */
export const FrontRowChairs: React.FC<{
  xs?: number[];
  y?: number;
  bowls?: boolean;
  sarongUnderFirst?: boolean;
  /** x of seated actors: a set chair this close to one is skipped (the actor brings their own chair) */
  seatedXs?: number[];
}> = ({xs = [560, 960, 1280], y = FLOOR, bowls = false, sarongUnderFirst = false, seatedXs = []}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, pointerEvents: 'none'}}>
    {xs.map((cx, i) => seatedXs.some(sx => Math.abs(sx - cx) < 170) ? null : (
      <div key={i} style={{position: 'absolute', left: cx - 70, top: y - 260, width: 140, height: 265}}>
        <Sprite id="set-chair" style={{width: '100%', height: '100%'}} />
      </div>
    ))}
    {/* Mourning woman's traditional sarong hem tucked under Tham's chair leg */}
    {sarongUnderFirst && xs[0] && (
      <svg width="240" height="90" viewBox="0 0 240 90" style={{position: 'absolute', left: xs[0] - 135, top: y - 55, overflow: 'visible'}}>
        <path d="M10 48 Q75 18 165 44 L152 64 Q80 48 16 64 Z" fill="#4a2c46" stroke="#241422" strokeWidth="3" />
        <path d="M22 52 H150 M26 58 H146" stroke="#d4a73c" strokeWidth="2.5" strokeDasharray="8 5" />
      </svg>
    )}
    {/* Small serving stand between chairs with rice porridge bowls & red threads */}
    {bowls && (
      <svg width="220" height="190" viewBox="-110 -170 220 190" style={{position: 'absolute', left: 760 - 110, top: y - 170, overflow: 'visible'}}>
        <rect x="-80" y="-110" width="160" height="14" rx="4" fill="#6b4a2f" stroke="#2e1d10" strokeWidth="3" />
        <rect x="-62" y="-96" width="14" height="96" fill="#4a321f" />
        <rect x="48" y="-96" width="14" height="96" fill="#4a321f" />
        {[-38, 38].map((bx, i) => (
          <g key={i} transform={`translate(${bx} -112)`}>
            <path d="M-26 -20 A26 14 0 0 1 26 -20 Z" fill="#fbfaf5" />
            <path d="M-30 -20 H30 A30 24 0 0 1 -30 -20 Z" fill="#e9e4d6" stroke="#7d7668" strokeWidth="2.5" />
            <path d="M-28 -16 Q0 -8 28 -16" fill="none" stroke="#d92626" strokeWidth="2.5" />
            <path d="M-8 -30 Q-12 -44 -4 -54 M8 -28 Q12 -42 6 -52" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    )}
  </div>
);

/** Temple Sala Funeral Set — supports night ritual, dim 04:00 candle-out, and morning aftermath */
export const SalaFuneralSet: React.FC<{
  tone?: 'night' | 'dim' | 'morning';
  clockTime?: string;
  showDesk?: boolean;
  deskX?: number;
  spilled?: boolean;
  showChairs?: boolean;
  chairXs?: number[];
  seatedXs?: number[];
  bowls?: boolean;
  sarong?: boolean;
  showCoffin?: boolean;
  coffinX?: number;
  photo?: 'covered' | 'glow' | 'mek';
  clothMove?: boolean;
  candlesOut?: boolean;
  emptyCoffin?: boolean;
  showMonks?: boolean;
  chant?: boolean;
  knocks?: number;
  frame?: number;
}> = ({
  tone = 'night',
  clockTime = '22:30',
  showDesk = false,
  deskX = 540,
  spilled = false,
  showChairs = true,
  chairXs = [580, 960, 1280],
  seatedXs = [],
  bowls = false,
  sarong = false,
  showCoffin = true,
  coffinX = 1480,
  photo = 'covered',
  clothMove = false,
  candlesOut = false,
  emptyCoffin = false,
  showMonks = false,
  chant = false,
  knocks = 0,
  frame = 0,
}) => {
  const skyTone = tone === 'morning' ? 'morning' : tone === 'dim' ? 'dawn' : 'night';
  const wallBg =
    tone === 'morning'
      ? 'linear-gradient(180deg, #544132 0%, #7d634d 100%)'
      : tone === 'dim'
        ? 'linear-gradient(180deg, #121018 0%, #221c24 100%)'
        : 'linear-gradient(180deg, #1c1614 0%, #33261d 100%)';

  return (
    <>
      <Sky tone={skyTone} y={640} />
      {/* Sala back wall & open pavilion colonnade */}
      <div style={{position: 'absolute', left: -400, top: -200, width: W + 800, height: 680, background: wallBg}} />
      <Planks y={-120} h={FLOOR + 120} c0={tone === 'morning' ? '#6e5239' : '#4a3525'} c1={tone === 'morning' ? '#4a3525' : '#2a1d14'} />
      {/* Open pavilion window/veranda cutout showing the night/morning sky */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 170,
          width: 1680,
          height: 360,
          background:
            tone === 'morning'
              ? 'linear-gradient(180deg, #b8d0e0 0%, #e6dec8 100%)'
              : tone === 'dim'
                ? 'linear-gradient(180deg, #070b16 0%, #141d33 100%)'
                : 'linear-gradient(180deg, #060a14 0%, #131e38 100%)',
          border: '10px solid #3a2618',
          boxShadow: 'inset 0 12px 40px rgba(0,0,0,.65)',
        }}
      />
      {/* Red temple roof beam & gold trim */}
      <div style={{position: 'absolute', left: -500, top: 60, width: W + 1000, height: 56, background: '#631d1b', borderBottom: '8px solid #d4a73c'}} />
      {/* Teakwood Pillars */}
      {[120, 720, 1320, 1800].map(px => (
        <div
          key={px}
          style={{
            position: 'absolute',
            left: px - 32,
            top: 60,
            width: 64,
            height: FLOOR - 60,
            background: 'linear-gradient(90deg, #2e1d12, #63432b 45%, #2e1d12)',
            borderLeft: '2px solid rgba(255,215,130,.18)',
          }}
        />
      ))}
      <Boards c0={tone === 'morning' ? '#70513b' : '#4d3626'} c1={tone === 'morning' ? '#3d2b1f' : '#241811'} />

      {/* Hanging Sala Bulbs */}
      {[420, 1020, 1560].map(bx => (
        <React.Fragment key={bx}>
          <div style={{position: 'absolute', left: bx - 48, top: 60, width: 96, height: 176}}>
            <Sprite id="set-bulb" style={{width: '100%', height: '100%', opacity: candlesOut ? 0.35 : 1}} />
          </div>
          {!candlesOut && tone !== 'morning' && <Glow x={bx} y={220} r={340} color="255,205,130" a={0.28} />}
        </React.Fragment>
      ))}

      {/* Wall Clock on pillar */}
      <WallClock x={720} y={240} t={clockTime} r={54} tick={(frame / 30) * (Math.PI / 30)} />

      {showMonks && <MonksChantingRow x={360} y={FLOOR} chant={chant} knocks={knocks} frame={frame} />}
      {showCoffin && (
        <OrnateCoffin
          x={coffinX}
          y={FLOOR}
          photo={photo}
          clothMove={clothMove}
          candlesOut={candlesOut}
          empty={emptyCoffin}
          frame={frame}
        />
      )}
      {showChairs && <FrontRowChairs xs={chairXs} y={FLOOR} bowls={bowls} sarongUnderFirst={sarong} seatedXs={seatedXs} />}
      {showDesk && <RegistrationDesk x={deskX} y={FLOOR} notes={!spilled} spilled={spilled} />}
    </>
  );
};

/** Roadside Grocery Store Set (`store:*`) */
export const GroceryStoreSet: React.FC<{showCounter?: boolean; showRoad?: boolean}> = ({showCounter = true, showRoad = true}) => (
  <>
    <Sky tone="dusk" y={680} />
    {showRoad && (
      <div
        style={{
          position: 'absolute',
          left: -500,
          top: 680,
          width: W + 1000,
          height: H - 680 + 400,
          background: 'linear-gradient(180deg, #2d3038 0%, #1c1e24 100%)',
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 14, width: '100%', height: 6, background: '#d4a73c', opacity: 0.65}} />
      </div>
    )}
    {/* Wooden Shop Structure */}
    <div
      style={{
        position: 'absolute',
        left: 260,
        top: 150,
        width: 1400,
        height: FLOOR - 150,
        background: '#4a3525',
        border: '8px solid #2b1d13',
      }}
    >
      {/* Corrugated Zinc Roof overhang */}
      <div
        style={{
          position: 'absolute',
          left: -80,
          top: -64,
          width: 1560,
          height: 76,
          background: 'repeating-linear-gradient(90deg, #6e737b 0 28px, #52575e 28px 56px)',
          borderBottom: '8px solid #3a2719',
        }}
      />
      {/* Shop Signboard */}
      <div
        style={{
          position: 'absolute',
          left: 420,
          top: -38,
          width: 560,
          height: 68,
          background: '#f6e3b4',
          border: '5px solid #7c2d12',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Noto Sans Thai, sans-serif',
          fontSize: 32,
          fontWeight: 900,
          color: '#7c2d12',
        }}
      >
        ร้านชำป้าศรี · เครื่องดื่ม - ของใช้
      </div>
      {/* Shelves with goods in background */}
      {[120, 240, 360].map((sy, r) => (
        <div key={r} style={{position: 'absolute', left: 80, top: sy, width: 1240, height: 14, background: '#2b1d13'}}>
          {Array.from({length: 14}, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 30 + i * 84,
                top: -54,
                width: 46,
                height: 54,
                borderRadius: 6,
                background: ['#c84b31', '#2f6b55', '#d4a73c', '#3b66a8', '#8c583a'][(i + r) % 5],
                border: '2px solid rgba(0,0,0,.35)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
    <Glow x={960} y={280} r={480} color="255,200,120" a={0.38} />
    <div style={{position: 'absolute', left: 912, top: 150, width: 96, height: 176}}>
      <Sprite id="set-bulb" style={{width: '100%', height: '100%'}} />
    </div>

    {/* Glass Countertop & Boiled Eggs Bowl in foreground */}
    {showCounter && (
      <svg width="1360" height="360" viewBox="0 0 1360 360" style={{position: 'absolute', left: 280, top: FLOOR - 260, overflow: 'visible', zIndex: 12}}>
        {/* Wooden counter body */}
        <rect x="0" y="50" width="1360" height="220" rx="8" fill="#6b4a2f" stroke="#2c1d11" strokeWidth="5" />
        {/* Glass top */}
        <rect x="20" y="34" width="1320" height="26" rx="4" fill="#a8d5e5" stroke="#476c78" strokeWidth="4" opacity=".88" />
        {/* Glass display window showing 3 funeral notices inside */}
        <rect x="60" y="84" width="760" height="140" rx="6" fill="#d9eef5" opacity=".32" stroke="#2c1d11" strokeWidth="4" />
        {[120, 340, 560].map((nx, i) => (
          <g key={i} transform={`translate(${nx} 102)`}>
            <rect width="160" height="104" rx="4" fill="#f6f1e6" stroke="#3a352d" strokeWidth="2.5" />
            <rect x="12" y="12" width="136" height="18" fill="#18202e" />
            <line x1="20" y1="48" x2="140" y2="48" stroke="#6c6558" strokeWidth="4" />
            <line x1="20" y1="68" x2="110" y2="68" stroke="#b3261e" strokeWidth="5" />
          </g>
        ))}
        {/* Tray/Bowl of Boiled Eggs on the counter */}
        <g transform="translate(1020 34)">
          <ellipse cx="0" cy="-4" rx="76" ry="20" fill="#d9cfc0" stroke="#5c5346" strokeWidth="3.5" />
          <ellipse cx="-26" cy="-16" rx="20" ry="25" fill="#f7ebd2" stroke="#bfa782" strokeWidth="2.5" />
          <ellipse cx="4" cy="-20" rx="20" ry="25" fill="#f7ebd2" stroke="#bfa782" strokeWidth="2.5" />
          <ellipse cx="32" cy="-14" rx="20" ry="25" fill="#f7ebd2" stroke="#bfa782" strokeWidth="2.5" />
        </g>
      </svg>
    )}
  </>
);

/** Behind the Temple Sala & Behind the Altar Set (`sala:back`, `sala:altar-back`) */
export const SalaBackSet: React.FC<{view: 'back' | 'altar-back'; beam?: boolean; pile?: boolean; frame?: number}> = ({
  view,
  beam = false,
  pile = false,
  frame = 0,
}) => {
  if (view === 'back') {
    return (
      <>
        <Sky tone="night" y={660} />
        {/* Ground & bushes behind temple pavilion */}
        <div style={full('linear-gradient(180deg, transparent 60%, #10171d 60%, #0a0e12 100%)')} />
        {/* Sala rear wooden wall */}
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 80,
            width: 1460,
            height: FLOOR - 80,
            background: '#2a1d14',
            border: '8px solid #160e09',
          }}
        >
          <Planks x={0} y={0} w={1460} h={FLOOR - 80} c0="#332318" c1="#1c130d" />
          {/* Rear window with warm crack of light from inside */}
          <div
            style={{
              position: 'absolute',
              left: 460,
              top: 180,
              width: 320,
              height: 260,
              background: '#1a120b',
              border: '10px solid #4a3322',
              boxShadow: '0 0 60px rgba(255,190,90,.28)',
            }}
          >
            <div style={{position: 'absolute', left: 148, top: 0, width: 24, height: '100%', background: '#ffcf8a', opacity: 0.65}} />
          </div>
          {/* Back door */}
          <div style={{position: 'absolute', left: 980, top: FLOOR - 80 - 520, width: 230, height: 520}}>
            <Sprite id="set-door" style={{width: '100%', height: '100%'}} />
          </div>
        </div>
        <Beam x={640} y={620} angle={68 + Math.sin(frame / 10) * 4} len={720} spread={22} a={0.45} />
      </>
    );
  }

  // `altar-back`: dark space behind the ritual altar table where victims' belongings are hidden
  return (
    <>
      <div style={full('linear-gradient(180deg, #0b090c 0%, #171216 70%, #21181c 100%)')} />
      <Planks c0="#281c16" c1="#140d0a" />
      <Boards c0="#332319" c1="#18100b" />
      {/* Back of the large altar / coffin partition */}
      <div
        style={{
          position: 'absolute',
          left: 180,
          top: 80,
          width: 780,
          height: FLOOR - 80,
          background: 'linear-gradient(90deg, #3b2618, #24160d)',
          borderRight: '10px solid #8a6522',
        }}
      />
      {/* Hidden wooden crate & pile of victims' belongings (`pile`) */}
      {pile && (
        <svg width="640" height="360" viewBox="0 0 640 360" style={{position: 'absolute', left: 1020, top: FLOOR - 290, overflow: 'visible'}}>
          {/* Wooden storage crate */}
          <rect x="40" y="90" width="460" height="210" rx="10" fill="#5c3e26" stroke="#24160c" strokeWidth="5" />
          <line x1="40" y1="160" x2="500" y2="160" stroke="#24160c" strokeWidth="4" />
          <line x1="40" y1="230" x2="500" y2="230" stroke="#24160c" strokeWidth="4" />
          {/* Blue jacket with yellow cross-stitch patch draped over crate edge */}
          <path d="M70 86 Q150 40 240 90 L220 185 Q140 165 85 190 Z" fill="#2f5f8f" stroke="#172d47" strokeWidth="4" />
          <g transform="translate(155 135)">
            <rect x="-16" y="-16" width="32" height="32" rx="5" fill="#1e3f63" stroke="#f6c445" strokeWidth="3" strokeDasharray="4 3" />
            <path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke="#f6c445" strokeWidth="4.5" strokeLinecap="round" />
          </g>
          {/* Victims' wallets, watches, and Mek's cracked-screen phone */}
          <rect x="260" y="56" width="90" height="44" rx="6" fill="#4a2c1d" stroke="#1c100a" strokeWidth="3" />
          <rect x="370" y="42" width="76" height="54" rx="8" fill="#1e2430" stroke="#64748b" strokeWidth="3" />
          <path d="M382 52 L428 84 M418 50 L390 88" stroke="#94a3b8" strokeWidth="2" />
          {/* Motorcycle helmet beside crate */}
          <path d="M510 295 A65 62 0 1 1 620 295 Z" fill="#b3261e" stroke="#24160c" strokeWidth="4" />
          <path d="M555 245 H622 L615 278 H555 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        </svg>
      )}
      {beam && <Beam x={480} y={540} angle={84 + Math.sin(frame / 8) * 3} len={920} spread={24} a={0.58} />}
      {beam && <Glow x={1280} y={720} r={340} color="255,235,175" a={0.42} />}
    </>
  );
};

/** Mek & Tik's Wooden House Set (`house:yard`, `house:porch`, `house:bike`, `house:fan`) */
export const TikHouseSet: React.FC<{
  view: 'yard' | 'porch' | 'bike';
  fan?: boolean;
  memorial?: boolean;
}> = ({view, fan = false, memorial = false}) => (
  <>
    <Sky tone="morning" y={660} />
    {/* Packed earth & grass courtyard */}
    <div
      style={{
        position: 'absolute',
        left: -400,
        top: 640,
        width: W + 800,
        height: H - 640 + 400,
        background: 'linear-gradient(180deg, #b89f7d 0%, #8f7758 100%)',
      }}
    />
    {/* Wooden House Facade & Porch */}
    <div
      style={{
        position: 'absolute',
        left: view === 'porch' ? 120 : 280,
        top: 100,
        width: view === 'porch' ? 1680 : 1360,
        height: FLOOR - 100,
        background: '#735338',
        border: '8px solid #3d2a1b',
        boxShadow: '0 16px 40px rgba(0,0,0,.35)',
      }}
    >
      <Planks x={0} y={0} w={1680} h={FLOOR - 100} c0="#7c5a3f" c1="#523a27" />
      {/* Roof overhang */}
      <div
        style={{
          position: 'absolute',
          left: -80,
          top: -60,
          width: (view === 'porch' ? 1680 : 1360) + 160,
          height: 70,
          background: 'linear-gradient(180deg, #5e3424, #3d2116)',
          borderBottom: '8px solid #2b170f',
        }}
      />
      {/* House Windows & Door */}
      <div style={{position: 'absolute', left: 180, top: 140, width: 240, height: 290}}>
        <Sprite id="set-window" style={{width: '100%', height: '100%'}} />
      </div>
      <div style={{position: 'absolute', left: 620, top: FLOOR - 100 - 520, width: 230, height: 520}}>
        <Sprite id="set-door" style={{width: '100%', height: '100%'}} />
      </div>
      <div style={{position: 'absolute', left: 1040, top: 140, width: 240, height: 290}}>
        <Sprite id="set-window" style={{width: '100%', height: '100%'}} />
      </div>
    </div>
    {/* Raised wooden porch floor */}
    <Boards y={FLOOR} c0="#8a6547" c1="#543c29" />

    {/* Porch Table with Electric Fan (`fan`) or Mek's Memorial Portrait (`memorial`) */}
    {(fan || memorial) && (
      <svg width="460" height="360" viewBox="-230 -320 460 360" style={{position: 'absolute', left: 1240 - 230, top: FLOOR - 320, overflow: 'visible'}}>
        {/* Low wooden table */}
        <rect x="-160" y="-150" width="320" height="22" rx="5" fill="#6b4a2f" stroke="#2c1d11" strokeWidth="4" />
        <rect x="-135" y="-128" width="22" height="128" fill="#4a321f" stroke="#2c1d11" strokeWidth="3" />
        <rect x="113" y="-128" width="22" height="128" fill="#4a321f" stroke="#2c1d11" strokeWidth="3" />

        {fan && (
          <g transform="translate(0 -150)">
            {/* Fan base & neck */}
            <path d="M-46 0 L-32 -22 H32 L46 0 Z" fill="#4a7c8c" stroke="#1e3640" strokeWidth="3.5" />
            <rect x="-10" y="-68" width="20" height="46" fill="#d8dde3" stroke="#475569" strokeWidth="3" />
            {/* Fan cage & 3 blades */}
            <circle cx="0" cy="-126" r="68" fill="rgba(240,246,252,0.55)" stroke="#334155" strokeWidth="5" />
            {[0, 120, 240].map(deg => (
              <ellipse
                key={deg}
                cx="0"
                cy="-154"
                rx="18"
                ry="34"
                transform={`rotate(${deg} 0 -126)`}
                fill="#5a9ab0"
                stroke="#1e3640"
                strokeWidth="2.5"
              />
            ))}
            <circle cx="0" cy="-126" r="16" fill="#334155" />
            {/* Unplugged cord / repair screwdriver beside fan */}
            <path d="M44 -8 Q88 12 110 -18" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {memorial && (
          <g transform="translate(0 -150)">
            {/* Framed photo of Mek */}
            <rect x="-58" y="-156" width="116" height="150" rx="6" fill="#d4a73c" stroke="#5e430d" strokeWidth="4" />
            <rect x="-46" y="-144" width="92" height="126" rx="4" fill="#d9e6f2" stroke="#3a2a14" strokeWidth="2" />
            <circle cx="0" cy="-102" r="20" fill="#d8a27c" />
            <path d="M-20 -104 Q-16 -128 4 -124 Q22 -122 20 -100 Z" fill="#1c1922" />
            <path d="M-34 -22 Q-30 -72 0 -72 Q30 -72 34 -22 Z" fill="#2f5f8f" />
            {/* Jasmine garland & flower vase */}
            <rect x="78" y="-56" width="28" height="56" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
            <circle cx="84" cy="-68" r="12" fill="#f6c445" />
            <circle cx="100" cy="-64" r="11" fill="#f8fafc" />
          </g>
        )}
      </svg>
    )}

    {/* Mek's blue motorcycle parked cleanly under the house shed (`house:bike`) */}
    {view === 'bike' && <Motorcycle x={960} y={FLOOR - 10} scale={1.05} color="#2f5f8f" showBox={false} helmetOnBike={false} />}
  </>
);

/** Police Station Set (`police:desk`, `police:tik-close`) */
export const PoliceStationSet: React.FC = () => (
  <>
    <div style={full('linear-gradient(180deg, #d8d2c5 0%, #bfb6a4 68%, #8a7f6d 100%)')} />
    {/* Wainscoting wall trim */}
    <div style={{position: 'absolute', left: -200, top: 540, width: W + 400, height: 400, background: '#6e5a44', borderTop: '10px solid #4a3a2a'}} />
    {/* Official Royal Thai Police style Maroon Placard */}
    <div
      style={{
        position: 'absolute',
        left: 560,
        top: 90,
        width: 800,
        height: 110,
        background: '#5c191b',
        border: '6px solid #d4a73c',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 28px rgba(0,0,0,.28)',
      }}
    >
      <div style={{fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 34, fontWeight: 900, color: '#f6e3b4', letterSpacing: 1}}>
        สถานีตำรวจภูธรดงสะเดา
      </div>
      <div style={{fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 18, fontWeight: 700, color: '#e2c785'}}>
        ห้องรับแจ้งความ · สืบสวนสอบสวน
      </div>
    </div>
    <WallClock x={1520} y={180} t="14:00" r={56} />
    <Boards y={FLOOR} c0="#5c4b3b" c1="#382d23" />

    {/* Duty Officer Desk in foreground */}
    <svg width="1100" height="290" viewBox="0 0 1100 290" style={{position: 'absolute', left: 410, top: FLOOR - 230, overflow: 'visible', zIndex: 12}}>
      <rect x="40" y="40" width="1020" height="190" rx="8" fill="#735135" stroke="#2c1d11" strokeWidth="5" />
      <rect x="20" y="22" width="1060" height="28" rx="6" fill="#8c6543" stroke="#2c1d11" strokeWidth="4" />
      {/* Folders, ledger evidence & cracked phone on desk */}
      <rect x="180" y="-12" width="140" height="34" rx="4" fill="#e5c158" stroke="#5e430d" strokeWidth="3" />
      <rect x="480" y="-18" width="160" height="40" rx="5" fill="#23477a" stroke="#122644" strokeWidth="3" />
      <rect x="720" y="-8" width="76" height="28" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
    </svg>
  </>
);

/** Wealthy Family Mansion Sickbed Set (`mansion:sickbed`) */
export const MansionSickbedSet: React.FC<{frame?: number}> = ({frame = 0}) => {
  const breath = Math.sin(frame * 0.12) * 2.5;
  const flameFlicker = Math.sin(frame * 0.35) * 1.5;
  const threadWave = Math.sin(frame * 0.08) * 5;

  return (
    <>
      <div style={full('linear-gradient(180deg, #090c13 0%, #131926 60%, #0d121c 100%)')} />

      {/* Tall mansion window with luxury crimson velvet curtains */}
      <div style={{position: 'absolute', left: 240, top: 70, width: 340, height: 540, background: '#111a2e', border: '12px solid #2d3748', overflow: 'hidden'}}>
        {/* Night window mullions */}
        <line x1="170" y1="0" x2="170" y2="540" stroke="#1e293b" strokeWidth="6" />
        <line x1="0" y1="270" x2="340" y2="270" stroke="#1e293b" strokeWidth="6" />
        {/* Soft moonlit mist behind panes */}
        <div style={{position: 'absolute', left: 40, top: 40, width: 240, height: 320, background: 'radial-gradient(circle, rgba(148,163,184,0.18) 0%, transparent 70%)'}} />
        {/* Left pleated curtain drape */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 85, height: '100%', background: 'linear-gradient(90deg, #240a14 0%, #4a1525 60%, #1f0810 100%)', boxShadow: '4px 0 12px rgba(0,0,0,0.5)'}} />
        {/* Right pleated curtain drape */}
        <div style={{position: 'absolute', right: 0, top: 0, width: 85, height: '100%', background: 'linear-gradient(270deg, #240a14 0%, #4a1525 60%, #1f0810 100%)', boxShadow: '-4px 0 12px rgba(0,0,0,0.5)'}} />
        {/* Gold curtain tiebacks */}
        <div style={{position: 'absolute', left: 60, top: 280, width: 25, height: 6, background: '#d4a73c', borderRadius: 3}} />
        <div style={{position: 'absolute', right: 60, top: 280, width: 25, height: 6, background: '#d4a73c', borderRadius: 3}} />
      </div>

      <Boards y={FLOOR} c0="#34221a" c1="#19100c" />
      {/* Warm candlelight glow around ritual table */}
      <Glow x={560} y={640} r={280} color="245,158,11" a={0.22} />
      {/* Soft bedside ambient glow */}
      <Glow x={1080} y={540} r={460} color="220,180,140" a={0.16} />

      {/* Hospital Bed, IV Drip Stand, Ritual Red Thread Altar & Realistic Bedridden Patriarch */}
      <svg width="1280" height="540" viewBox="0 0 1280 540" style={{position: 'absolute', left: 380, top: FLOOR - 470, overflow: 'visible'}}>
        <defs>
          <radialGradient id="candle-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#ea580c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
          <filter id="thread-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
          </filter>
        </defs>

        {/* 1. Ritual Side Table (โต๊ะไม้ข้างเตียง) */}
        <g transform="translate(140 230)">
          {/* Base plinth */}
          <rect x="-80" y="210" width="160" height="20" rx="3" fill="#24140b" stroke="#120904" strokeWidth="2.5" />
          {/* Cabinet body */}
          <rect x="-74" y="10" width="148" height="205" rx="5" fill="#3a2216" stroke="#1a0e08" strokeWidth="3" />
          {/* Top beveled molding */}
          <rect x="-82" y="0" width="164" height="15" rx="3" fill="#4d2f1f" stroke="#1a0e08" strokeWidth="2.5" />
          {/* Upper drawer */}
          <rect x="-64" y="24" width="128" height="48" rx="3" fill="#301b11" stroke="#1c0f08" strokeWidth="2" />
          <ellipse cx="0" cy="48" rx="10" ry="4" fill="#d4a73c" stroke="#5e430d" strokeWidth="1.5" />
          {/* Lower cabinet door line */}
          <rect x="-64" y="82" width="128" height="120" rx="3" fill="#2d1910" stroke="#1c0f08" strokeWidth="2" />
          <circle cx="48" cy="140" r="4" fill="#d4a73c" stroke="#5e430d" strokeWidth="1.2" />

          {/* Brass Pedestal Bowl (พานทองเหลืองใส่น้ำมนต์และด้ายสายสิญจน์) */}
          <g transform="translate(0 -10)">
            {/* Pedestal foot */}
            <path d="M-22 10 L-14 -4 H14 L22 10 Z" fill="#b88c28" stroke="#5e430d" strokeWidth="2" />
            <rect x="-6" y="-12" width="12" height="10" fill="#d4a73c" stroke="#5e430d" strokeWidth="1.5" />
            {/* Pedestal bowl dish */}
            <path d="M-44 -12 C-44 6 44 6 44 -12 C44 -20 -44 -20 -44 -12 Z" fill="#d4a73c" stroke="#6b4c10" strokeWidth="2.5" />
            <path d="M-42 -16 Q0 -10 42 -16" fill="none" stroke="#fef08a" strokeWidth="2" />
            {/* Holy water sheen inside bowl */}
            <ellipse cx="0" cy="-14" rx="34" ry="7" fill="#856414" opacity="0.85" />
            {/* Spool of sacred red thread (กลุ่มด้ายแดง) */}
            <ellipse cx="-12" cy="-17" rx="13" ry="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            <path d="M-20 -18 Q-12 -22 -4 -18" fill="none" stroke="#fca5a5" strokeWidth="1.2" />
            {/* Sacred beeswax candle (เทียนขี้ผึ้งต่อชะตา) */}
            <rect x="12" y="-32" width="7" height="18" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            {/* Candle flame */}
            <circle cx="15.5" cy="-38" r="24" fill="url(#candle-halo)" />
            <path d={`M15.5 -32 Q${13 + flameFlicker} -40 15.5 -48 Q${18 + flameFlicker} -40 15.5 -32 Z`} fill="#f59e0b" />
            <ellipse cx="15.5" cy="-39" rx="2" ry="4" fill="#ffffff" />
          </g>
        </g>

        {/* 2. IV Drip Stand (เสาน้ำเกลือสแตนเลส) */}
        <g transform="translate(370 30)">
          {/* Base legs with wheels on floor */}
          <path d="M-45 410 L0 385 L45 410" fill="none" stroke="#64748b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="-45" cy="413" r="4.5" fill="#1e293b" />
          <circle cx="45" cy="413" r="4.5" fill="#1e293b" />
          {/* Vertical chrome pole */}
          <line x1="0" y1="20" x2="0" y2="385" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
          {/* Height adjustment knob */}
          <rect x="-7" y="195" width="14" height="12" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5" />
          {/* Top ram-horn hooks */}
          <path d="M-28 32 Q-28 12 0 12 Q28 12 28 32" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
          {/* Hanging Saline IV Bag */}
          <g transform="translate(-18 36)">
            <rect x="-14" y="0" width="28" height="60" rx="8" fill="rgba(224,242,254,0.85)" stroke="#94a3b8" strokeWidth="2.5" />
            {/* Fluid level */}
            <rect x="-12" y="16" width="24" height="40" rx="5" fill="rgba(186,230,253,0.6)" />
            {/* Gradation ticks */}
            <line x1="-10" y1="26" x2="-4" y2="26" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="-10" y1="36" x2="-4" y2="36" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="-10" y1="46" x2="-4" y2="46" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Blue infusion spike port */}
            <rect x="-5" y="58" width="10" height="6" rx="1.5" fill="#2563eb" />
            {/* Drip chamber */}
            <rect x="-4.5" y="64" width="9" height="18" rx="3" fill="rgba(241,245,249,0.92)" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="0" cy="74" r="1.5" fill="#38bdf8" />
          </g>
        </g>

        {/* 3. The Medical / Mansion Bed (เตียงคนไข้ตระกูลผู้มีอิทธิพล) */}
        <g transform="translate(440 210)">
          {/* Bed Base & Legs */}
          <rect x="0" y="140" width="630" height="24" rx="4" fill="#475569" stroke="#334155" strokeWidth="2.5" />
          {/* Left leg & caster */}
          <rect x="25" y="164" width="18" height="66" rx="3" fill="#64748b" />
          <circle cx="34" cy="232" r="7" fill="#1e293b" />
          {/* Right leg & caster */}
          <rect x="585" y="164" width="18" height="66" rx="3" fill="#64748b" />
          <circle cx="594" cy="232" r="7" fill="#1e293b" />
          {/* Lower crossbar */}
          <line x1="34" y1="200" x2="594" y2="200" stroke="#334155" strokeWidth="5" />

          {/* Carved Dark Teak Headboard (หัวเตียงไม้สักแกะสลัก) */}
          <g transform="translate(-18 -70)">
            <rect x="0" y="0" width="34" height="270" rx="8" fill="#381e13" stroke="#1a0d07" strokeWidth="3" />
            <rect x="6" y="18" width="22" height="180" rx="4" fill="#24130a" />
            <path d="M-3 6 Q17 -16 37 6 Z" fill="#4a2a1b" stroke="#1a0d07" strokeWidth="2.5" />
            {/* Warm candlelight rim highlight on left edge */}
            <line x1="1" y1="12" x2="1" y2="250" stroke="#f59e0b" strokeWidth="2" opacity="0.35" />
          </g>

          {/* Dual-layer Hospital Mattress */}
          <rect x="12" y="60" width="606" height="82" rx="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="4" />
          <rect x="12" y="60" width="606" height="40" rx="10" fill="#f1f5f9" />
          <line x1="12" y1="100" x2="618" y2="100" stroke="#94a3b8" strokeWidth="3" />

          {/* Soft Ergonomic Hospital Pillow (หมอนหนุนศีรษะ) */}
          <g transform="translate(85 52)">
            <ellipse cx="0" cy="0" rx="66" ry="28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            {/* Pillow indentation where patient's head rests */}
            <ellipse cx="8" cy="2" rx="38" ry="16" fill="#e2e8f0" opacity="0.6" />
            {/* Subtle warm candlelight sheen on left curve */}
            <path d="M-55 -4 C-64 8 -52 20 -28 25" fill="none" stroke="#fde68a" strokeWidth="2.5" opacity="0.35" />
          </g>

          {/* ================= PATIENT (คนติดเตียง) ================= */}
          {/* Upper torso & Hospital gown */}
          <g transform={`translate(0 ${breath * 0.7})`}>
            {/* Shoulder & hospital gown */}
            <path d="M125 45 L180 40 L210 85 L125 85 Z" fill="#cbd5e1" />
            {/* V-neck collar */}
            <path d="M125 50 L155 72 L180 50" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            {/* Neck */}
            <path d="M110 40 L135 48 L142 35 L120 30 Z" fill="#b5aba0" />
          </g>

          {/* Head & Face resting ON the pillow (ศีรษะหนุนบนหมอนอย่างสมจริง) */}
          <g transform={`translate(92 ${42 + breath * 0.4}) rotate(-8)`}>
            {/* Back hair on pillow */}
            <path d="M-34 -12 C-42 16 -28 32 -14 36 C-28 22 -30 6 -24 -14 Z" fill="#9ca3af" />
            {/* Head silhouette */}
            <ellipse cx="0" cy="0" rx="34" ry="40" fill="#d5cbc0" />
            <path d="M-24 16 C-14 36 16 36 26 16 Z" fill="#d5cbc0" />
            {/* Soft jaw shadow */}
            <path d="M-16 22 C-4 32 16 32 24 18 Z" fill="#b5aba0" opacity="0.55" />

            {/* Frail elderly hairline / wispy silver hair (คุณตาตระกูลใหญ่) */}
            <path d="M-28 -18 C-14 -38 18 -36 30 -16 C20 -30 -4 -32 -18 -14 Z" fill="#9ca3af" />
            <path d="M-12 -32 Q6 -38 24 -25" fill="none" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
            <path d="M-28 0 L-24 16" stroke="#9ca3af" strokeWidth="2.8" strokeLinecap="round" />

            {/* Ear */}
            <ellipse cx="-26" cy="4" rx="7.5" ry="11" fill="#d5cbc0" stroke="#b5aba0" strokeWidth="1.5" />
            <path d="M-27 0 Q-23 4 -26 8" fill="none" stroke="#9e8b78" strokeWidth="1.5" />

            {/* Tired / Frail closed eyes (หลับตาพักผ่อนอย่างอ่อนเพลีย) */}
            <path d="M-8 2 Q1 8 11 3" fill="none" stroke="#52453b" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M-10 7 Q1 13 13 8" fill="none" stroke="#8a7c6f" strokeWidth="1.2" opacity="0.65" />
            {/* Dark eye rings from prolonged illness */}
            <ellipse cx="1" cy="9" rx="13" ry="4" fill="#6d5d51" opacity="0.22" />

            {/* Frail wrinkled brow */}
            <path d="M-10 -5 Q1 -9 13 -5" fill="none" stroke="#847a72" strokeWidth="3" strokeLinecap="round" />
            <path d="M-3 -11 Q2 -9 7 -11" stroke="#a19487" strokeWidth="1.5" strokeLinecap="round" />

            {/* Elderly nose */}
            <path d="M9 -6 L16 5 L10 9" fill="none" stroke="#9e8f82" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Pale resting lips */}
            <path d="M1 18 Q8 20 15 17" fill="none" stroke="#887067" strokeWidth="2.2" strokeLinecap="round" />

            {/* Subtle warm candle highlight on cheek and temple */}
            <circle cx="-16" cy="-8" r="14" fill="#f59e0b" opacity="0.12" />

            {/* Oxygen Nasal Cannula (สายออกซิเจนทางจมูก) */}
            <path d="M-26 4 Q-12 0 12 5" fill="none" stroke="rgba(224,242,254,0.85)" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="12" y1="5" x2="14" y2="7" stroke="rgba(224,242,254,0.95)" strokeWidth="3" strokeLinecap="round" />
            <path d="M-26 4 Q-34 22 -18 46" fill="none" stroke="rgba(224,242,254,0.7)" strokeWidth="2" />
          </g>

          {/* Luxurious Hospital Duvet / Blanket (ผ้านวมคลุมทับลำตัวจรดปลายเท้า) */}
          <g>
            {/* Turned-down clean white top sheet fold */}
            <path
              d={`M175 ${42 + breath} Q195 ${38 + breath} 215 ${42 + breath} L215 135 L175 135 Z`}
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="2.5"
            />
            {/* Main Duvet draped over body down to footboard */}
            <path
              d={`M210 ${40 + breath} Q275 ${46 + breath * 0.7} 340 ${52 + breath * 0.4} Q430 42 510 48 Q565 60 600 70 L600 138 L210 138 Z`}
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth="3.5"
            />
            {/* Highlight contour along top ridge of duvet */}
            <path
              d={`M212 ${42 + breath} Q275 ${48 + breath * 0.7} 340 ${54 + breath * 0.4} Q430 44 510 50 Q565 62 598 72`}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="3"
            />
            {/* Creases and folds of blanket over legs and knees */}
            <path d="M330 65 Q355 95 375 130" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.45" />
            <path d="M470 60 Q495 90 520 130" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.45" />
            <path d="M210 120 H600 V138 H210 Z" fill="#cbd5e1" opacity="0.6" />
          </g>

          {/* Patient's Arm & Hand resting ON TOP of the blanket */}
          <g>
            {/* Hospital gown sleeve */}
            <path
              d={`M175 ${50 + breath} L220 ${56 + breath} L215 ${80 + breath} L172 ${72 + breath} Z`}
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Frail forearm resting on blanket */}
            <path
              d={`M216 ${60 + breath} Q245 ${66 + breath * 0.8} 275 ${70 + breath * 0.6}`}
              fill="none"
              stroke="#d5cbc0"
              strokeWidth="17"
              strokeLinecap="round"
            />
            <path
              d={`M216 ${60 + breath} Q245 ${66 + breath * 0.8} 275 ${70 + breath * 0.6}`}
              fill="none"
              stroke="#b5aba0"
              strokeWidth="17"
              strokeLinecap="round"
              strokeDasharray="6 20"
              opacity="0.3"
            />

            {/* Frail resting hand with relaxed curled fingers */}
            <ellipse cx="284" cy={71 + breath * 0.6} rx="9.5" ry="6.5" fill="#d5cbc0" />
            <path
              d={`M289 ${69 + breath * 0.6} Q297 ${71 + breath * 0.6} 295 ${77 + breath * 0.6} M287 ${73 + breath * 0.6} Q295 ${76 + breath * 0.6} 293 ${81 + breath * 0.6}`}
              fill="none"
              stroke="#d5cbc0"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Medical IV Cannula dressing (พลาสเตอร์เปิดเส้นน้ำเกลือหลังมือ) */}
            <rect x="278" y={66 + breath * 0.6} width="10" height="7" rx="1.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="283" cy={69 + breath * 0.6} r="1.8" fill="#2563eb" />

            {/* Sacred Red Thread loop tied around patient's wrist (ด้ายแดงผูกข้อมือ) */}
            <ellipse cx="274" cy={70 + breath * 0.6} rx="4" ry="7" fill="none" stroke="#ef4444" strokeWidth="3" />
            <ellipse cx="274" cy={70 + breath * 0.6} rx="6" ry="9" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* Chrome Hospital Bedside Safety Rail (ราวกั้นเตียง) */}
          <g transform="translate(140 70)">
            <line x1="0" y1="42" x2="260" y2="42" stroke="#94a3b8" strokeWidth="4" />
            <line x1="0" y1="12" x2="260" y2="12" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
            {[20, 75, 130, 185, 240].map(rx => (
              <line key={rx} x1={rx} y1="12" x2={rx} y2="42" stroke="#94a3b8" strokeWidth="3" />
            ))}
            <circle cx="0" cy="42" r="5" fill="#475569" />
            <circle cx="260" cy="42" r="5" fill="#475569" />
          </g>

          {/* Carved Dark Teak Footboard (ท้ายเตียงไม้สัก) */}
          <g transform="translate(600 -10)">
            <rect x="0" y="0" width="28" height="210" rx="6" fill="#381e13" stroke="#1a0d07" strokeWidth="3" />
            <rect x="5" y="16" width="18" height="150" rx="3" fill="#24130a" />
          </g>
        </g>

        {/* 4. Clear IV Infusion Line (สายน้ำเกลือโยงจากขวดตรงเข้าหลังมือ) */}
        <path
          d={`M352 148 Q355 240 480 270 Q580 295 723 ${279 + breath * 0.6}`}
          fill="none"
          stroke="rgba(224,242,254,0.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 5. Glowing Sacred Red Thread (ด้ายแดงสะเดาะเคราะห์โยงจากพานขันน้ำมนต์สู่คนติดเตียง) */}
        {/* Glow halo */}
        <path
          d={`M128 203 Q380 ${110 + threadWave} 714 ${280 + breath * 0.6}`}
          fill="none"
          stroke="#f87171"
          strokeWidth="9"
          opacity="0.45"
          filter="url(#thread-glow)"
        />
        {/* Main ritual red cord */}
        <path
          d={`M128 203 Q380 ${110 + threadWave} 714 ${280 + breath * 0.6}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3.8"
          strokeDasharray="9 4"
        />
      </svg>
    </>
  );
};
