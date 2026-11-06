// RETIRED from src/kit/places.tsx. Not bundled, not in the studio.
// SpiritHouse, Minimart, HospitalHall, Classroom, DormHall, RiceField, BusStop: flat front elevations, lit evenly, that no
// episode ever imported. Kept as a reference for their details (signs, shelves, door numbers): rebuild a place in
// perspective with src/kit/room.tsx when a story needs it (directing.md, "places, not backdrops"), do not restore these.
// They used helpers from places.tsx (Toned, night, Sky ...).

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

