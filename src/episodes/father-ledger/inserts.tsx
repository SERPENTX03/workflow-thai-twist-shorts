import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotComponent, ShotProps} from '../../engine/episode';
import {appear, kf, rnd} from '../../engine/anim';
import {T} from '../../engine/theme';
import {Grain} from '../../kit/horror';
import {Hand} from '../../kit/inserts';
import {EndCardScene} from '../../kit/EndCard';
import {C} from './cast';
import {D, FONT, K, Lotus, Macro, Pen, Pool, Sheet, Svg, Typed} from './common';
import {ScarFrame} from './ice';
import {Urn} from './meru';

// Every paper, screen and picture the story reads aloud. A clue keeps its frame wherever it comes back (the book's
// number column 62 ↔ 109, the portrait 2 ↔ 264, the scar 32 ↔ 179).

// ---------------------------------------------------------------- the portrait

/** Charn behind the block, half a man, in a black frame. `shrine`: back on the shelf, next to the small urn. */
const Portrait: React.FC<{p: ShotProps; shrine?: boolean}> = ({p, shrine}) => (
  <Macro p={p} bg="#0b0604" at={[50, 42]} vig={0.76} inner={32} z={1.04}>
    <Svg>
      <rect x={-10} y={-10} width={1940} height={1100} fill={shrine ? '#5e4331' : '#1a0f0a'} />
      {shrine && <rect x={-10} y={850} width={1940} height={250} fill="#6e4b2d" />}
      <rect x={shrine ? 330 : 500} y={50} width={920} height={990} rx={10} fill="#0d0d11" stroke="#3a3a44" strokeWidth={8} />
      <rect x={shrine ? 385 : 555} y={105} width={810} height={880} fill="#6c665a" />
      <g transform={`translate(${shrine ? 790 : 960} 0)`}>
        {/* the red bulb, the block's edge across him, him */}
        <rect x={-405} y={105} width={810} height={880} fill="#5a3d33" />
        <circle cx={-290} cy={190} r={30} fill="#ff4a36" opacity={0.85} />
        <path d="M-290 105 v60" stroke="#111" strokeWidth={5} />
        <path d="M-300 985 Q-300 650 0 620 Q300 650 300 985 Z" fill={C.tee} />
        <path d="M-120 840 q40 -40 80 -6 q50 34 90 -10 M60 900 q24 -24 60 -4" stroke={C.teeStain} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.85} />
        <rect x={-46} y={540} width={92} height={120} fill="#b4835f" />
        <circle cy={410} r={170} fill="#d6a57f" />
        <path d="M-170 380 Q-160 230 0 226 Q160 230 170 380 Q90 300 -60 310 Q-140 320 -170 380 Z" fill="#4c463f" />
        <path d="M-90 410 h50 M40 410 h50" stroke="#2a2118" strokeWidth={16} strokeLinecap="round" />
        <path d="M-70 490 Q0 540 70 490" stroke="#5b3b2c" strokeWidth={11} fill="none" strokeLinecap="round" />
        <path d="M-140 460 q14 28 40 34 M140 460 q-14 28 -40 34" stroke="#b4835f" strokeWidth={7} fill="none" />
        <path d="M-60 640 Q0 760 60 640" stroke={C.cord} strokeWidth={6} fill="none" />
        <rect x={-18} y={726} width={36} height={46} rx={6} fill="#a8842f" />
        <rect x={-405} y={905} width={810} height={80} fill="#6a4a2e" />
      </g>
      {!shrine && <ellipse cx={1240} cy={420} rx={70} ry={110} fill="#ff9a4a" opacity={0.2} />}
      {!shrine && <path d="M500 50 L900 50 L500 500 Z" fill="#fff" opacity={0.05} />}
    </Svg>
    {shrine
      ? <><Urn x={1520} y={870} s={1.9} /><Pool x={1400} y={200} rx={900} color="255,214,150" a={0.36} /></>
      : <><Hand x={1530} y={690} s={2} rot={196} skin={C.skinT} sleeve={C.suit} mode="grip" /><Pool x={1240} y={520} rx={520} color="255,140,60" a={0.3} /></>}
  </Macro>
);

// ---------------------------------------------------------------- phones

const Screen: React.FC<{p: ShotProps; title?: string; rows?: [string, string, boolean?][]; children?: React.ReactNode; sx?: number; thumb?: boolean; bg?: string; scroll?: number}> = ({p, title, rows, children, sx = 960, thumb = true, bg = '#f0f3f2', scroll = 0}) => (
  <Macro p={p} bg="#020203" at={[50, 42]} vig={0.8} inner={30} z={1.03}>
    <div style={{position: 'absolute', left: sx - 380, top: -60, width: 760, height: 1300, borderRadius: 70, background: '#090a0d', border: '10px solid #30323a'}}>
      <div style={{position: 'absolute', left: 26, top: 40, width: 688, height: 1200, borderRadius: 34, background: bg, overflow: 'hidden', boxShadow: '0 0 200px 60px rgba(150,190,255,.26)'}}>
        {title && <div style={{height: 120, background: '#3e7a6e', color: '#fff', fontFamily: FONT.ui, fontWeight: 700, fontSize: 44, lineHeight: '120px', paddingLeft: 40}}>{title}</div>}
        <div style={{position: 'relative', transform: `translateY(${-scroll}px)`}}>
          {rows?.map(([a, b, red], i) => (
            <div key={i} style={{height: 110, borderBottom: '2px solid #cdd5d3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', fontFamily: FONT.ui, background: red ? '#fbe6e4' : undefined}}>
              <span style={{fontSize: 34, color: '#58686a'}}>{a}</span>
              <span style={{fontSize: 52, fontWeight: 700, color: red ? '#b31b1b' : '#1b2536'}}>{b}</span>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
    {thumb && <Hand x={sx + 480} y={880} s={2} rot={204} skin={C.skinT} mode="open" />}
  </Macro>
);

const VideoCall: React.FC<{p: ShotProps; half?: boolean; full?: boolean; ots?: boolean}> = ({p, half, full, ots}) => {
  const pic = (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(ellipse at 30% 10%, #6e2a22, #1c0f0c 72%)'}}>
      <svg viewBox="0 0 800 450" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
        <circle cx={250} cy={46} r={16} fill="#ff4a36" />
        <path d="M250 -10 V30" stroke="#111" strokeWidth={3} />
        <path d="M250 450 Q250 300 400 290 Q550 300 550 450 Z" fill={C.tee} />
        <rect x={376} y={240} width={48} height={60} fill="#a87c5a" />
        <circle cx={400} cy={170} r={84} fill="#cfa07c" />
        <path d="M316 150 Q320 80 400 78 Q480 80 484 150 Q440 110 370 118 Q330 124 316 150 Z" fill="#6b655c" />
        <path d="M356 164 h22 M422 164 h22" stroke="#2a2118" strokeWidth={8} strokeLinecap="round" />
        <path d="M368 210 Q400 232 432 210" stroke="#5b3b2c" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M340 190 l14 22 M460 190 l-14 22" stroke="#a87c5a" strokeWidth={5} />
        {/* thin wave */}
        {!half && !full && <><path d="M540 340 L620 210" stroke="#cfa07c" strokeWidth={24} strokeLinecap="round" /><circle cx={628} cy={196} r={22} fill="#cfa07c" /></>}
        <rect x={0} y={400} width={800} height={50} fill="#6a4a2e" />
        <rect x={0} y={394} width={800} height={10} fill="#a67d55" />
        {half && <path d="M400 400 V450" stroke="#fff" strokeWidth={3} strokeDasharray="8 8" />}
        {half && [340, 460].map(x => <path key={x} d={`M${x} 404 V450`} stroke="#ff6a5a" strokeWidth={5} strokeDasharray="8 8" />)}
      </svg>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.12) 1px, transparent 1px)', backgroundSize: '6px 6px'}} />
    </div>
  );
  if (ots) return (
    <Macro p={p} bg="#020203" at={[60, 42]} vig={0.86} inner={26} z={1.03}>
      <div style={{position: 'absolute', left: 860, top: 200, width: 700, height: 420, borderRadius: 26, border: '12px solid #2a2b30', overflow: 'hidden', transform: 'rotate(-4deg)', boxShadow: '0 0 200px 60px rgba(175,205,255,.28)'}}>{pic}</div>
      <div style={{position: 'absolute', left: -200, top: 170, width: 1000, height: 1200, borderRadius: '50% 50% 0 0', background: '#08090d', filter: 'blur(12px)'}} />
      <div style={{position: 'absolute', left: 110, top: -60, width: 500, height: 540, borderRadius: '50%', background: '#050609', filter: 'blur(12px)'}} />
      <Hand x={1490} y={770} s={1.9} rot={-66} skin={C.skinT} mode="open" />
    </Macro>
  );
  return (
    <Macro p={p} bg="#020203" at={[50, 42]} vig={0.72} inner={38} z={1.03}>
      <div style={{position: 'absolute', left: full ? 150 : 300, top: full ? 10 : 90, width: full ? 1620 : 1320, height: full ? 1040 : 790, borderRadius: 30, overflow: 'hidden', border: '14px solid #17181c'}}>{pic}
        <div style={{position: 'absolute', left: 0, top: 20, width: '100%', textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 46, color: '#fff', textShadow: '0 2px 10px #000'}}>พ่อ</div>
      </div>
    </Macro>
  );
};

const Chat: React.FC<{p: ShotProps}> = ({p}) => {
  const k = K(p);
  return (
    <Screen p={p} bg="#e7ebea" title="ร.ต.ท." thumb sx={760}>
      <div style={{position: 'absolute', left: 30, top: 150, width: 630, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
        {Array.from({length: 9}, (_, i) => <div key={i} style={{height: 170, background: i * 0.11 < k ? '#d9ceb0' : '#a4a8a4', border: '2px solid #76786f', opacity: i * 0.11 < k + 0.1 ? 1 : 0.4, position: 'relative'}}>
          {i === 0 && <div style={{position: 'absolute', left: 24, top: 24}}><Lotus x={30} y={30} r={30} /></div>}
          {[80, 104, 128].map(y => <div key={y} style={{position: 'absolute', left: 16, top: y, width: 150, height: 7, background: '#6f6a56'}} />)}
        </div>)}
      </div>
      <div style={{position: 'absolute', left: 30, top: 730, width: 630, height: 24, background: '#c1c8c6', borderRadius: 12}}><div style={{height: '100%', width: `${30 + k * 65}%`, background: '#3e7a6e', borderRadius: 12}} /></div>
    </Screen>
  );
};

const PhoneScene: ShotComponent = p => {
  const v = p.shot.view ?? '';
  const transfers: [string, string][] = Array.from({length: 11}, (_, i) => [`1 ${['พ.ย.', 'ต.ค.', 'ก.ย.', 'ส.ค.', 'ก.ค.', 'มิ.ย.', 'พ.ค.', 'เม.ย.', 'มี.ค.', 'ก.พ.', 'ม.ค.'][i]} · นาย ชาญ`, '50,000']);
  if (v === 'slip-ins') return <Screen p={p} title="รับโอน" rows={transfers} />;
  if (v === 'bank-ins') return <Screen p={p} title="รับโอน" rows={[...transfers, ...transfers]} scroll={K(p) * 700} />;
  if (v === 'bank-jump-ins') return <Screen p={p} title="รับโอน" thumb={false} rows={[['1 มี.ค. · นาย ชาญ', '50,000'], ['1 ก.พ. · นาย ชาญ', '50,000'], ['1 ม.ค. · นาย ชาญ', '50,000', true], ['1 ธ.ค. · นาย ชาญ', '8,000', true], ['1 พ.ย. · นาย ชาญ', '8,000'], ['1 ต.ค. · นาย ชาญ', '8,000'], ['1 ก.ย. · นาย ชาญ', '8,000']]}>
    <div style={{position: 'absolute', left: 0, top: 449, width: '100%', height: 10, background: '#d4241c'}} />
  </Screen>;
  if (v === 'call-ins') return <VideoCall p={p} />;
  if (v === 'call-close') return <VideoCall p={p} full />;
  if (v === 'call-thyme-ots') return <VideoCall p={p} ots />;
  if (v === 'call-half-ins') return <VideoCall p={p} full half />;
  return <Chat p={p} />;
};

// ---------------------------------------------------------------- the red book

const ROWS = [1, 2, 3, 4, 5, 6];
/** One open ledger page in frame px. `from` = instalment on the top line */
const Ledger: React.FC<{x?: number; y?: number; w?: number; h?: number; rot?: number; size?: number; shake?: number; children?: React.ReactNode}> = ({x = 150, y = -40, w = 1620, h = 1160, rot = -1, children}) => (
  <Sheet x={x} y={y} w={w} h={h} rot={rot} color="#e6dcb9" lines>{children}</Sheet>
);

const Book: ShotComponent = p => {
  const v = p.shot.view ?? '';
  const k = K(p);
  const warm: [number, number] = [50, 42];
  const page = (children: React.ReactNode, pool: string = '255,214,150', opts?: {at?: [number, number]; vig?: number}) => (
    <Macro p={p} bg="#0b0604" at={opts?.at ?? warm} vig={opts?.vig ?? 0.74} inner={32} z={1.05}>
      {children}
      <Pool x={700} y={200} rx={1000} color={pool} a={0.2} />
    </Macro>
  );
  if (v === 'names-ins') return page(<>
    <Ledger>
      <Pen x={220} y={130} size={94} color="#23305a">นาย ก. ...</Pen>
      <Pen x={1000} y={130} size={74} color="#b31b1b">ไม่พอส่ง</Pen>
      <Pen x={220} y={350} size={94} color="#23305a">นาง ข. ...</Pen>
      <Pen x={1000} y={350} size={74} color="#b31b1b">ไม่พอส่ง</Pen>
      <Pen x={220} y={590} size={118} color="#141a34" style={{fontWeight: 900}}>คุณหญิงพรรณี</Pen>
      <Lotus x={1170} y={650} r={68} color="#a58632" o={0.9} />
      <svg width={1620} height={1160} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M200 192 L850 180" stroke="#b31b1b" strokeWidth={14} /><path d="M200 412 L850 400" stroke="#b31b1b" strokeWidth={14} />
      </svg>
    </Ledger>
  </>);
  if (v === 'row-ins' || v === 'columns-ins') {
    const cols = v === 'columns-ins';
    return page(<>
      <Ledger>
        <Typed x={90} y={40} size={44} weight={700} color="#6b5f3e">งวด</Typed>
        <Typed x={300} y={40} size={44} weight={700} color="#6b5f3e">รายการ</Typed>
        <Typed x={760} y={40} size={44} weight={700} color="#6b5f3e">{cols ? 'หัก' : 'บาท'}</Typed>
        <Typed x={1120} y={40} size={44} weight={700} color="#6b5f3e">{cols ? 'เหลือ' : ''}</Typed>
        {ROWS.map((n, i) => <React.Fragment key={n}>
          <Pen x={110} y={160 + i * 140} size={82}>{n}</Pen>
          <Pen x={290} y={160 + i * 140} size={72}>{cols ? 'A-0' : 'A-0 · 500 ก.'}</Pen>
          <Pen x={cols ? 720 : 800} y={160 + i * 140} size={78}>{cols ? '125,000' : '175,000'}</Pen>
          {cols && <Pen x={1080} y={160 + i * 140} size={78} color="#b31b1b">{(3375000 - i * 125000).toLocaleString('en-US')}</Pen>}
        </React.Fragment>)}
      </Ledger>
      <Hand x={220 + (cols ? k * 900 : 0)} y={cols ? 330 : 330} s={1.8} rot={-68} skin={C.skinT} mode="open" />
    </>);
  }
  if (v === 'last-ins') return page(<>
    <Ledger>
      {[[26, '250,000'], [27, '125,000']].map(([n, r], i) => <React.Fragment key={i}>
        <Pen x={110} y={160 + i * 140} size={66} shake={0.5 + i * 0.3}>{n}</Pen>
        <Pen x={290} y={160 + i * 140} size={60} shake={0.5 + i * 0.3}>A-0</Pen>
        <Pen x={1080} y={160 + i * 140} size={66} shake={0.5 + i * 0.3} color="#b31b1b">{r}</Pen>
      </React.Fragment>)}
      <Pen x={110} y={440} size={68} shake={1.2}>28</Pen>
      <Pen x={290} y={440} size={56} shake={1.2}>A-0</Pen>
      <Pen x={1160} y={410} size={120} shake={1.2} color="#b31b1b">0</Pen>
      <svg width={1620} height={1160} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M1070 560 Q1200 546 1370 566" stroke="#b31b1b" strokeWidth={7} fill="none" />
        <path d="M1060 590 Q1210 572 1380 596" stroke="#b31b1b" strokeWidth={7} fill="none" />
      </svg>
    </Ledger>
  </>);
  if (v === 'number-ins' || v === 'number-ins2' || v === 'number-ecu') {
    const two = v === 'number-ins2', ecu = v === 'number-ecu';
    const nums = two ? ['62.0', '61.5', '...', '50.0', '49.0', '48.5', '48.0'] : ['62.0', '61.5', '61.0', '60.5', '60.0'];
    const torch = two;
    return (
      <Macro p={p} bg="#050302" at={torch ? [50, 50] : warm} vig={torch ? 0.94 : 0.74} inner={torch ? 22 : 32} z={ecu ? 1.08 : 1.05}>
        <Ledger x={560} y={-60} w={1540} h={1220} rot={0}>
          {ecu
            ? <Pen x={110} y={140} size={420} color="#23305a">62.0</Pen>
            : nums.map((n, i) => <Pen key={i} x={200} y={two ? 90 + i * 100 : 120 + i * 132} size={two ? 86 : 120} color="#23305a">{n}</Pen>)}
          {ecu && <svg width={1540} height={1220} style={{position: 'absolute', left: 0, top: 0}}><ellipse cx={620} cy={420} rx={590} ry={300} stroke="#23305a" strokeWidth={11} fill="none" transform="rotate(-3 620 420)" /></svg>}
          {!ecu && !two && <svg width={1540} height={1220} style={{position: 'absolute', left: 0, top: 0}}><ellipse cx={330} cy={190} rx={210} ry={92} stroke="#23305a" strokeWidth={8} fill="none" /></svg>}
        </Ledger>
        <div style={{position: 'absolute', left: 0, top: 0, width: 560, height: 1080, background: '#d2c8a6'}}>
          <div style={{position: 'absolute', left: 60, top: 80, fontFamily: FONT.hand, fontWeight: 700, fontSize: 66, color: '#23305a', opacity: 0.35}}>175,000</div>
          <div style={{position: 'absolute', left: 60, top: 220, fontFamily: FONT.hand, fontWeight: 700, fontSize: 66, color: '#23305a', opacity: 0.35}}>175,000</div>
        </div>
        <div style={{position: 'absolute', left: 552, top: 0, width: 8, height: 1080, background: '#7d7566'}} />
        {!ecu && <Hand x={torch ? 1520 + Math.sin(p.f / 6) * 6 : 1500} y={two ? 860 - k * 500 : 210} s={1.8} rot={196} skin={C.skinT} mode="open" />}
        {ecu && <Hand x={1760} y={880} s={1.8} rot={206} skin={C.skinT} mode="open" />}
        {torch && <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 620px 620px at 58% 48%, rgba(0,0,0,0) 60%, rgba(0,0,0,.72) 100%)'}} />}
      </Macro>
    );
  }
  if (v === 'thor-ins') return page(<>
    <Ledger x={-60} y={-60} w={2040} h={1200} rot={0}>
      {[0, 1, 2, 3].map(i => <React.Fragment key={i}>
        <Pen x={300} y={90 + i * 200} size={150} color="#141a34">ธ.</Pen>
        <Pen x={760} y={90 + i * 200} size={150} color="#23305a">50,000</Pen>
      </React.Fragment>)}
    </Ledger>
    <Hand x={1660} y={560} s={2} rot={188} skin={C.skinT} mode="open" />
  </>);
  if (v === 'split-ins' || v === 'weight-split' || v === 'left-ins') {
    const L = v === 'split-ins' ? ['ธ. 50,000', 'ธ. 50,000', 'ธ. 50,000', 'ธ. 50,000', 'ธ. 50,000'] : v === 'weight-split' ? ['62.0', '61.5', '61.0', '60.5', '60.0'] : ['3,500,000', '3,375,000', '3,250,000', '...', '0'];
    const Rr = v === 'split-ins' ? ['50,000', '50,000', '50,000', '50,000', '50,000'] : v === 'weight-split' ? ['62.0', '61.5', '61.0', '60.5', '60.0'] : ['สามล้านห้าแสน', '', '', '', ''];
    const n = Math.min(5, Math.ceil(k * 6));
    return (
      <Macro p={p} bg="#0a0806" at={[50, 42]} vig={0.56} inner={42} z={1.02}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: '#e6dcb9'}}>
          <Typed x={130} y={24} size={44} weight={700} color="#7a2020">{v === 'left-ins' ? 'สมุดแดง · ช่องเหลือ' : v === 'split-ins' ? 'สมุดแดง' : 'สมุดแดง · เลขปริศนา'}</Typed>
          {L.map((t, i) => <Pen key={i} x={130} y={100 + i * 136} size={94} color={v === 'left-ins' && i === 4 ? '#b31b1b' : '#23305a'}>{t}</Pen>)}
        </div>
        <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, background: v === 'split-ins' ? '#dfe7e4' : v === 'weight-split' ? '#efe3a6' : '#e6dfc8'}}>
          {v === 'left-ins'
            ? <><Typed x={110} y={150} size={70} weight={700}>หนังสือกู้</Typed><Typed x={110} y={290} size={110} weight={700} color="#1b2536">3,500,000</Typed><Pen x={110} y={520} size={64}>ผู้ค้ำ: ชาญ</Pen></>
            : <>
              <Typed x={230} y={24} size={44} weight={700} color="#2c5a50">{v === 'split-ins' ? 'แอปธนาคาร' : 'กระดาษข้างเครื่องชั่ง'}</Typed>
              {Rr.map((t, i) => v === 'split-ins'
              ? <Typed key={i} x={230} y={106 + i * 136} size={90} weight={700} color="#1b2536">{t}</Typed>
              : <Pen key={i} x={230} y={100 + i * 136} size={94} color="#1f2740">{t}</Pen>)}</>}
        </div>
        <div style={{position: 'absolute', left: 950, top: 0, width: 20, height: 1080, background: '#0a0806'}} />
        <Svg>
          {v === 'left-ins'
            ? <path d={`M1230 410 Q${900} 600 ${620} ${660}`} stroke="#d4241c" strokeWidth={12} fill="none" strokeDasharray="1600" strokeDashoffset={1600 * (1 - k)} />
            : Array.from({length: n}, (_, i) => <line key={i} x1={700} y1={150 + i * 136} x2={1180} y2={150 + i * 136} stroke="#d4241c" strokeWidth={6} />)}
        </Svg>
      </Macro>
    );
  }
  if (v === 'cover-ecu') {
    const dim = 1 - k * 0.5;
    return (
      <Macro p={p} bg="#020101" at={[50, 42]} vig={0.94} inner={22 - k * 8} z={1.06}>
        <Ledger x={-60} y={-60} w={2040} h={1200} rot={0}>
          <Pen x={410} y={200} size={420} color="#141a34">A-</Pen>
          <Pen x={1080} y={200} size={420} color="#141a34" style={{fontFamily: T.display}}>0</Pen>
          <svg width={2040} height={1200} style={{position: 'absolute', left: 0, top: 0}}>
            {[0, 1, 2, 3, 4, 5].map(i => <ellipse key={i} cx={1240 + rnd(301, i) * 20} cy={460 + rnd(302, i) * 20} rx={190 + i * 8} ry={250 - i * 6} stroke="#141a34" strokeWidth={9} fill="none" transform={`rotate(${i * 7} 1240 460)`} />)}
          </svg>
        </Ledger>
        <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${1 - dim})`}} />
      </Macro>
    );
  }
  if (v === 'writing-ins') return (
    <Macro p={p} bg="#0d0504" at={[50, 42]} vig={0.76} past inner={30} z={1.04}>
      <Ledger x={120} y={-10} w={1700} h={1100} rot={-3}>
        {[[25, 0.5], [26, 0.8], [27, 1.2]].map(([n, s], i) => <React.Fragment key={i}>
          <Pen x={110} y={110 + i * 190} size={78} shake={s as number}>{n}</Pen>
          <Pen x={330} y={110 + i * 190} size={100} shake={s as number} color="#141a34">ธ.</Pen>
          <Pen x={620} y={110 + i * 190} size={110} shake={s as number} color="#141a34" style={{fontWeight: 900}}>50,000</Pen>
        </React.Fragment>)}
      </Ledger>
      <Hand x={1400} y={660} s={2.3} rot={200 + Math.sin(p.f / 1.8) * 1.4} skin="#cfa07c" sleeve={C.tee} mode="grip" />
      <Svg><path d="M1240 620 L1090 660" stroke="#1e2d6e" strokeWidth={22} strokeLinecap="round" /></Svg>
      <Pool x={500} y={150} rx={900} color="255,60,44" a={0.28} />
    </Macro>
  );
  // math-ins
  return page(<>
    <Ledger>
      <Pen x={200} y={70} size={120} color="#23305a">175,000</Pen>
      <Pen x={200} y={230} size={120} color="#b31b1b">−125,000</Pen>
      <svg width={1620} height={1160} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M180 150 L800 120" stroke="#b31b1b" strokeWidth={16} />
        <path d="M180 390 H1360" stroke="#23305a" strokeWidth={8} />
      </svg>
      <Pen x={200} y={420} size={120} color="#23305a">50,000 ÷ 500 ก.</Pen>
      <Pen x={830} y={590} size={170} color="#b31b1b" style={{fontWeight: 900}}>= 100</Pen>
    </Ledger>
  </>, '245,250,255');
};

// ---------------------------------------------------------------- loose paper, photos

const Ins: ShotComponent = p => {
  const v = p.shot.view ?? '';
  const k = K(p);
  const dark = (kids: React.ReactNode, o?: {at?: [number, number]; vig?: number; bg?: string; z?: number; past?: boolean}) => <Macro p={p} bg={o?.bg ?? '#050403'} at={o?.at ?? [50, 42]} vig={o?.vig ?? 0.82} inner={28} z={o?.z ?? 1.05} past={o?.past}>{kids}</Macro>;
  switch (v) {
    case 'portrait-ins': return <Portrait p={p} />;
    case 'portrait-end-ins': return <Portrait p={p} shrine />;
    case 'scar-ins': return <ScarFrame p={p} />;
    case 'certificate-ins': return dark(<>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill={C.suit} /><path d="M-10 -10 H1940 V240 Q960 130 -10 240 Z" fill="#26282f" /></Svg>
      <Sheet x={350} y={70} w={1220} h={960} color="#e7e5da" rot={-1.5}>
        <Typed x={380} y={40} size={64} weight={700}>มรณบัตร</Typed>
        <Typed x={90} y={200} size={50}>ชื่อผู้ตาย: นายชาญ ...</Typed>
        <Typed x={90} y={300} size={50}>อายุ: 58 ปี</Typed>
        <Typed x={90} y={460} size={50} color="#5e5a4c">สาเหตุที่ตาย:</Typed>
        <Typed x={90} y={540} size={106} weight={700}>หัวใจล้มเหลว</Typed>
        <Typed x={90} y={800} size={40} color="#5e5a4c">ผู้รับรอง: นพ.ประสิทธิ์ ...</Typed>
      </Sheet>
      <Hand x={1620} y={660} s={2} rot={196} skin={C.skinT} sleeve={C.suit} mode="open" />
      <Pool x={960} y={30} rx={1000} ry={420} color="240,250,245" a={0.26} />
    </>, {vig: 0.66});
    case 'ribbon-ins': return dark(<>
      <div style={{position: 'absolute', left: 240, top: -60, width: 760, height: 1220, background: '#121116', transform: `rotate(${-2 + Math.sin(p.f / 28) * 1.6}deg)`, boxShadow: '0 20px 60px rgba(0,0,0,.6)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 90%, 0 100%)'}}>
        <div style={{position: 'absolute', left: 90, top: 200, width: 590, textAlign: 'center', fontFamily: FONT.hand, fontWeight: 700, fontSize: 92, color: C.gold, lineHeight: 1.25}}>คุณหญิง<br />พรรณี</div>
        <Lotus x={380} y={700} r={150} />
      </div>
      <div style={{position: 'absolute', left: 1300, top: -40, width: 900, height: 1200, background: '#d9d4c0', borderRadius: '50%', filter: 'blur(26px)'}} />
      <Svg>{Array.from({length: 20}, (_, i) => <ellipse key={i} cx={1300 + rnd(311, i) * 600} cy={rnd(312, i) * 1080} rx={70} ry={30} fill="#f8f5ea" transform={`rotate(${rnd(313, i) * 180} ${1300 + rnd(311, i) * 600} ${rnd(312, i) * 1080})`} style={{filter: 'blur(5px)'}} />)}</Svg>
      <Pool x={620} y={720} rx={380} color="255,240,180" a={0.3} />
    </>, {vig: 0.58});
    case 'urn-ecu': return dark(<>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#5f5344" />
        <ellipse cx={960} cy={640} rx={560} ry={150} fill="#a07f30" stroke="#5e4716" strokeWidth={14} />
        <ellipse cx={960} cy={640} rx={490} ry={118} fill="#0c0a08" />
        <path d="M470 640 Q440 1000 620 1120 H1300 Q1480 1000 1450 640" fill="#c9a24a" stroke="#5e4716" strokeWidth={14} />
        <ellipse cx={960} cy={640} rx={490} ry={118} fill="#0c0a08" />
        <path d="M640 -20 Q760 150 860 320 Q910 430 960 620 Q1010 430 1050 320 Q1170 150 1270 -20 Z" fill="#1c1a18" opacity={0.92} />
      </Svg>
      <Svg>{Array.from({length: 240}, (_, i) => { const t = (rnd(321, i) + p.f * 0.012) % 1; const w = 300 * (1 - t) + 40; return <circle key={i} cx={960 + (rnd(322, i) - 0.5) * w * 2} cy={-20 + t * 650} r={1.5 + rnd(323, i) * 4} fill={i % 3 ? '#26231f' : '#3c3833'} />; })}</Svg>
      <Hand x={1660} y={330} s={1.9} rot={205} skin={C.skinT} sleeve={C.suit} mode="open" />
      <Svg><path d="M1420 260 q14 -18 40 -14" stroke="#0a0908" strokeWidth={16} fill="none" /></Svg>
      <Pool x={400} y={200} rx={900} color="255,240,205" a={0.3} />
    </>, {vig: 0.66});
    case 'shirt-ins': return dark(<>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#3a2520" />
        <path d="M200 100 Q900 -20 1720 110 Q1850 500 1700 980 Q900 1080 240 980 Q70 520 200 100 Z" fill={C.tee} stroke="#8d8574" strokeWidth={5} />
        {[220, 420, 620, 820].map(y => <path key={y} d={`M240 ${y} Q900 ${y + 80} 1680 ${y - 20}`} stroke="#b3ab98" strokeWidth={8} fill="none" />)}
        {/* yellow chemical stains along the hem, no blood anywhere */}
        <path d="M420 780 Q700 700 1040 790 Q1320 860 1560 760 Q1600 900 1320 940 Q800 1000 420 920 Q360 860 420 780 Z" fill="#cfc272" opacity={0.75} />
        <path d="M430 800 Q720 720 1030 810 Q1310 880 1550 780" stroke="#a4963f" strokeWidth={7} fill="none" />
      </Svg>
      <Hand x={190} y={560} s={2.2} rot={-6} skin="#d3b19a" sleeve={C.dayShirt} mode="grip" />
      <Hand x={1730} y={560} s={2.2} rot={186} skin="#d3b19a" sleeve={C.dayShirt} mode="grip" />
      <Pool x={1000} y={0} rx={900} ry={520} color="255,70,50" a={0.26} />
    </>, {vig: 0.62});
    case 'newyear-ins': return dark(<>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#2f2118" /></Svg>
      <Sheet x={420} y={30} w={1080} h={1010} color="#f6f2e4" rot={2}>
        <div style={{position: 'absolute', left: 40, top: 40, width: 1000, height: 830, background: '#5a3f3a', overflow: 'hidden'}}>
          <svg viewBox="0 0 1000 830" width={1000} height={830} style={{position: 'absolute', inset: 0}}>
            {Array.from({length: 22}, (_, i) => <circle key={i} cx={rnd(331, i) * 1000} cy={rnd(332, i) * 240} r={13} fill={['#ffd35a', '#ff6f6f', '#7ad1ff'][i % 3]} />)}
            <circle cx={500} cy={260} r={96} fill="#cfa07c" />
            <path d="M405 240 Q410 170 500 166 Q590 170 595 240 Q540 210 470 216 Q430 222 405 240 Z" fill="#6b655c" />
            <path d="M462 250 h22 M516 250 h22" stroke="#2a2118" strokeWidth={8} strokeLinecap="round" />
            <path d="M470 300 Q500 324 530 300" stroke="#5b3b2c" strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M360 590 L350 400 Q430 350 500 370 Q570 350 650 400 L640 590 Z" fill={C.tee} />
            <path d="M352 400 Q400 356 462 366 L450 440 Q400 460 352 450 Z" fill={C.scar} stroke={C.scarD} strokeWidth={4} />
            <path d="M366 408 q40 -16 80 -6 M362 430 q40 -14 80 -4" stroke={C.scarD} strokeWidth={5} fill="none" />
            <circle cx={230} cy={660} r={150} fill="none" stroke="#2a2826" strokeWidth={24} />
            <circle cx={770} cy={660} r={150} fill="none" stroke="#2a2826" strokeWidth={24} />
            {/* a flowered blanket that lies flat from the lap */}
            <path d="M260 590 H740 V830 H260 Z" fill="#b5647a" />
            {Array.from({length: 16}, (_, i) => <circle key={i} cx={290 + (i % 8) * 60} cy={630 + Math.floor(i / 8) * 90} r={15} fill="#f2c2cf" />)}
          </svg>
        </div>
      </Sheet>
      <Hand x={1560} y={660} s={1.9} rot={190} skin={C.skinT} mode="grip" />
      <Pool x={960} y={300} rx={900} color="255,240,205" a={0.3} />
    </>, {vig: 0.66});
    case 'bill-ins': return dark(<>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#352519" /></Svg>
      {[[-6, 130, 100], [5, 300, 70], [-2, 520, 40]].map(([r, x, y], i) => <Sheet key={i} x={x} y={y} w={1100} h={980} color={['#e7dfa6', '#eadfa4', '#efe6b0'][i]} rot={r}>
        <Typed x={90} y={50} size={60} weight={700} color="#6a2a1a">การไฟฟ้า</Typed>
        <Typed x={90} y={180} size={44} color="#5e5a3c">ค่าไฟฟ้าประจำเดือน</Typed>
        {i === 2 && <><Typed x={90} y={320} size={44} color="#5e5a3c">หน่วยที่ใช้</Typed><Typed x={90} y={390} size={96} weight={700}>2,756</Typed><Typed x={90} y={600} size={44} color="#5e5a3c">รวมเงิน</Typed><Typed x={90} y={670} size={150} weight={700} color="#b31b1b">11,024.-</Typed></>}
      </Sheet>)}
      <Hand x={1620} y={740} s={2.2} rot={200} skin={C.skinT} mode="open" />
      <Pool x={1300} y={260} rx={800} color="255,220,160" a={0.3} />
    </>, {vig: 0.66});
    case 'debt-ins': return dark(<>
      <Sheet x={290} y={30} w={1340} h={1020} color="#d9d2b6" rot={-1}>
        <Typed x={380} y={30} size={70} weight={700} color="#3c3729">หนังสือกู้เงิน</Typed>
        <Typed x={110} y={190} size={46} color="#5a5441">ผู้กู้ นายเชษฐ์ ...</Typed>
        <Typed x={110} y={290} size={46} color="#5a5441">จำนวนเงิน</Typed>
        <Typed x={110} y={360} size={150} weight={700} color="#2c2820">3,500,000</Typed>
        <Typed x={110} y={590} size={46} color="#5a5441">ผู้ค้ำประกัน</Typed>
        <Pen x={110} y={650} size={120}>ชาญ</Pen>
        <Lotus x={1140} y={840} r={118} color="#9c8a5c" o={0.42} />
      </Sheet>
      <Hand x={110} y={930} s={1.8} rot={-30} skin={C.skinT} mode="grip" />
      <Pool x={960} y={60} rx={1000} ry={500} color="245,250,255" a={0.26} />
    </>, {vig: 0.74});
    case 'threat-ins': return dark(<>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#191918" /></Svg>
      {[0, 1].map(i => <Sheet key={i} x={140 + i * 840} y={20 + i * 14} w={800} h={590} color="#e9e4d2" rot={i ? 2 : -3}>
        <div style={{position: 'absolute', left: 30, top: 30, width: 740, height: 520, background: i ? '#7a8087' : '#5d6249', overflow: 'hidden'}}>
          <svg viewBox="0 0 740 520" width={740} height={520}>
            {i === 0
              ? <g><path d="M120 300 L370 140 L620 300 Z" fill="#3c2c1e" /><rect x={160} y={300} width={420} height={140} fill="#574030" />{[180, 360, 540].map(x => <rect key={x} x={x} y={440} width={22} height={80} fill="#2a1e14" />)}</g>
              : <g><rect x={70} y={50} width={600} height={470} fill="#9098a0" />{Array.from({length: 15}, (_, k) => <rect key={k} x={100 + (k % 5) * 110} y={80 + Math.floor(k / 5) * 110} width={70} height={70} fill="#4a525a" />)}<rect x={200} y={410} width={18} height={100} fill="#111" /><circle cx={209} cy={395} r={15} fill="#111" /><rect x={224} y={420} width={36} height={46} fill="#7a2020" /></g>}
          </svg>
        </div>
      </Sheet>)}
      <Pen x={420} y={665} size={100} color="#ff3a30" w={1300}>ลูกมึงเรียนอยู่ที่นี่ใช่ไหม</Pen>
      <Pool x={960} y={220} rx={900} color="245,250,255" a={0.26} />
    </>, {vig: 0.74});
    case 'biopsy-ins': return dark(<>
      <Sheet x={290} y={-20} w={1340} h={1140} color="#e9eae2" rot={1}>
        <Typed x={400} y={40} size={60} weight={700} color="#1f3d55">PATHOLOGY REPORT</Typed>
        <Typed x={90} y={180} size={52}>ชื่อ: นายชาญ ...</Typed>
        <Typed x={90} y={270} size={52}>อายุ: 55 ปี</Typed>
        <Typed x={90} y={380} size={110} weight={700} color="#141a34">น้ำหนัก 62 กก.</Typed>
        {[580, 660, 740, 820].map(y => <div key={y} style={{position: 'absolute', left: 90, top: y, width: 1140, height: 12, background: '#a7a99f'}} />)}
      </Sheet>
      <Hand x={1630} y={470} s={2} rot={186} skin={C.skinT} mode="open" />
      <Pool x={500} y={100} rx={1000} color="245,250,255" a={0.3} />
    </>, {vig: 0.72});
    case 'diagnosis-ecu': return dark(<>
      <Sheet x={-60} y={-60} w={2040} h={1200} color="#e9eae2" rot={0}>
        <Typed x={150} y={220} size={84} weight={700} color="#141a34">Osteosarcoma, stage IV</Typed>
        <Pen x={150} y={460} size={200} color="#1b2c6e">6-8 months</Pen>
        <svg width={2040} height={1200} style={{position: 'absolute', left: 0, top: 0}}><path d="M150 760 Q900 720 1500 770" stroke="#1b2c6e" strokeWidth={10} fill="none" /></svg>
      </Sheet>
      <Hand x={1640} y={920} s={2} rot={198 + Math.sin(p.f / 1.5) * 1.2} skin={C.skinT} mode="open" />
    </>, {vig: 0.74});
    case 'contract-ecu': return dark(<>
      <Sheet x={-60} y={-60} w={2040} h={1200} color="#e4dcc3" rot={0}>
        <Typed x={420} y={190} size={68} color="#3c3729">ผู้จัดหาตกลงส่งมอบ</Typed>
        <Typed x={420} y={320} size={210} weight={700} color="#111">เนื้อมนุษย์สด</Typed>
        <svg width={2040} height={1200} style={{position: 'absolute', left: 0, top: 0}}><path d="M420 610 H1620" stroke="#b31b1b" strokeWidth={18} /></svg>
      </Sheet>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1020px 420px at 50% 42%, rgba(0,0,0,0) 40%, rgba(0,0,0,.86) 100%)'}} />
    </>, {vig: 0.95, at: [50, 42]});
    case 'clause-ins': return dark(<>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#26221a" /></Svg>
      <Sheet x={-60} y={120} w={1240} h={980} color="#d8cdab" rot={0}>
        <Typed x={140} y={120} size={52} color="#4b4432">ข้อ 28 ...</Typed>
      </Sheet>
      <div style={{position: 'absolute', left: 500, top: 100, width: 960, height: 320, background: '#e8e0c6', clipPath: 'polygon(0 0, 100% 0, 96% 20%, 100% 38%, 91% 58%, 95% 72%, 84% 100%, 60% 86%, 44% 100%, 26% 80%, 14% 92%, 0 74%)'}}>
        <div style={{position: 'absolute', left: 120, top: 60, fontFamily: FONT.ui, fontWeight: 700, fontSize: 170, color: '#231f15', clipPath: 'inset(0 0 42% 0)'}}>ข้อ 29</div>
      </div>
      <Svg><path d="M440 80 L620 100 L610 130 L430 110 Z" fill="#b8bec0" stroke="#3d4042" strokeWidth={6} /></Svg>
      <Pool x={1100} y={200} rx={760} color="245,250,255" a={0.34} />
    </>, {vig: 0.76});
    case 'clause-see-ins': return dark(<>
      <Sheet x={230} y={0} w={1460} h={1080} color="#e4dcc3" rot={1.5}>
        <Typed x={120} y={110} size={60} color="#3c3729">ผู้รับเงื่อนไข</Typed>
        <Typed x={120} y={270} size={110} weight={700} color="#111">ผู้รับตรวจร่างด้วยตนเอง</Typed>
        <svg width={1460} height={1080} style={{position: 'absolute', left: 0, top: 0}}><path d="M120 410 H1370" stroke="#b31b1b" strokeWidth={12} /></svg>
        <Typed x={120} y={480} size={60} color="#3c3729">ก่อนปิดงวดสุดท้าย</Typed>
        <Lotus x={1200} y={800} r={140} />
      </Sheet>
      <Hand x={1760} y={580} s={2.1} rot={190} skin="#c79a78" sleeve="#4f6653" mode="grip" />
    </>, {vig: 0.74});
    case 'clause29-red': return dark(<>
      <div style={{position: 'absolute', left: -20, top: -20, width: 1960, height: 1120, background: 'radial-gradient(ellipse at 48% 44%, #fffef2 30%, #bfb695 70%)', transform: `rotate(${Math.sin(p.f / 1.6) * 0.5}deg)`}}>
        <Typed x={170} y={110} size={92} weight={700} color="#231f15">ข้อ 29</Typed>
        <Typed x={170} y={260} size={62} color="#3c3729">เมื่อครบยี่สิบแปดงวด ผู้จัดหาส่งมอบ</Typed>
        <Typed x={530} y={380} size={280} weight={700} color="#111">หัวใจ</Typed>
        <svg width={1960} height={1120} style={{position: 'absolute', left: 0, top: 0}}><path d="M520 740 H1460" stroke="#b31b1b" strokeWidth={22} /></svg>
      </div>
      <Hand x={140} y={930} s={1.8} rot={-30} skin={C.skinT} mode="grip" />
      <Hand x={1800} y={930} s={1.8} rot={210} skin={C.skinT} mode="grip" />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 860px 420px at 50% 44%, rgba(0,0,0,0) 40%, rgba(0,0,0,.78) 100%)'}} />
    </>, {vig: 0.88, at: [50, 40]});
    case 'question-card': return <QuestionHouse p={p} />;
    default: return null;
  }
};

/** The empty house, the same floor and shrine as the opening, warmer; everything sinks slowly to black. */
const QuestionHouse: React.FC<{p: ShotProps}> = ({p}) => {
  const fade = kf(p.f, [[p.len * 0.45, 0], [p.len, 0.86]]);
  return (
    <Macro p={p} bg="#070402" at={[50, 42]} vig={0.6} inner={36}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#6a4d33" />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 170} y1={-10} x2={i * 170} y2={620} stroke="#3c2a1b" strokeWidth={5} />)}
        <path d="M-10 620 H1930 V1100 H-10 Z" fill="#4c3423" />
        {Array.from({length: 13}, (_, i) => <line key={i} x1={760 + i * 34} y1={620} x2={-400 + i * 240} y2={1100} stroke="#2f1f12" strokeWidth={5} />)}
        <rect x={700} y={330} width={520} height={30} fill="#6e4b2d" />
        <circle cx={960} cy={235} r={44} fill="#c9a24a" />
        <path d="M900 330 Q900 260 960 260 Q1020 260 1020 330 Z" fill="#b89237" />
        <rect x={1070} y={270} width={90} height={60} fill="#111118" stroke="#3a3a44" strokeWidth={4} />
      </Svg>
      <Pool x={1500} y={600} rx={900} ry={520} color="255,206,140" a={0.5} />
      <Urn x={850} y={330} s={0.6} />
      <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${fade})`}} />
    </Macro>
  );
};

// ---------------------------------------------------------------- news

const NewsScene: ShotComponent = p => {
  const v = p.shot.view ?? '';
  const paper = (arrest: boolean) => (
    <Sheet x={arrest ? 260 : 640} y={30} w={arrest ? 1400 : 1200} h={1020} color="#e2dcc8" rot={arrest ? -1 : 2}>
      <div style={{position: 'absolute', left: 50, top: 24, fontFamily: FONT.display, fontWeight: 700, fontSize: arrest ? 92 : 78, color: '#1b1b1b', lineHeight: 1.1}}>{arrest ? 'จับเครือข่ายค้าศพ' : 'ศพไร้ญาติหาย 3 ศพ'}</div>
      <div style={{position: 'absolute', left: 50, top: arrest ? 150 : 130, width: 1300, height: 6, background: '#333'}} />
      {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 50 + i * (arrest ? 230 : 240), top: 190, width: arrest ? 210 : 220, height: 280, background: '#9c9786', border: '3px solid #333'}}>
        <div style={{position: 'absolute', left: 40, top: 50, width: 130, height: 180, borderRadius: '45%', background: '#f3efe2'}} />
      </div>)}
      {arrest && <div style={{position: 'absolute', left: 780, top: 190, width: 560, height: 380, background: '#6d6a60', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 180, top: 40, width: 190, height: 200, borderRadius: '50%', background: '#c9916d'}} />
        <div style={{position: 'absolute', left: 90, top: 220, width: 380, height: 200, borderRadius: '40%', background: '#14151b'}} />
        <div style={{position: 'absolute', left: 240, top: 330, width: 90, height: 30, border: '6px solid #c9ccd0', borderRadius: 16}} />
      </div>}
      {Array.from({length: 7}, (_, i) => <div key={i} style={{position: 'absolute', left: 50, top: 600 + i * 56, width: 1120 + (i % 3) * 60, height: 16, background: '#6a6658'}} />)}
    </Sheet>
  );
  if (v === 'radio-ins') return (
    <Macro p={p} bg="#030405" at={[50, 42]} vig={0.86} inner={26} z={1.04}>
      <Svg>
        <rect x={-10} y={-10} width={1940} height={1100} fill="#596469" />
        <line x1={960} y1={-10} x2={960} y2={1100} stroke="#23292c" strokeWidth={12} />
        <rect x={1160} y={380} width={22} height={210} fill="#c2cacd" />
      </Svg>
      <div style={{opacity: 0.55, position: 'absolute', left: -240, top: 0}}>{paper(false)}</div>
      <div style={{position: 'absolute', left: 720, top: 660, fontFamily: FONT.ui, fontWeight: 700, fontSize: 92, color: '#111', textShadow: '0 0 12px #e2dcc8'}}>สองปี</div>
      <Pool x={960} y={60} rx={800} color="245,250,255" a={0.3} />
    </Macro>
  );
  if (v === 'paper-ins') return (
    <Macro p={p} bg="#4a3d2c" at={[46, 40]} vig={0.42} inner={46}>
      <Svg><rect x={-10} y={-10} width={1940} height={1100} fill="#7d6243" /></Svg>
      {paper(true)}
      <Pool x={500} y={200} rx={1100} color="255,244,214" a={0.3} />
    </Macro>
  );
  // radio-card: the transistor on a crate beside the local paper
  return (
    <Macro p={p} bg="#0c0906" at={[46, 40]} vig={0.62}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#5d5848, #2d2a22)', filter: 'blur(14px)'}} />
      <Svg><rect x={-10} y={720} width={1940} height={400} fill="#6b4c2f" />{[780, 880, 980].map(y => <line key={y} x1={-10} y1={y} x2={1930} y2={y} stroke="#3e2b1a" strokeWidth={8} />)}</Svg>
      <div style={{position: 'absolute', left: 130, top: 330, width: 1200, height: 900, transform: 'scale(.72) rotate(-4deg)', transformOrigin: '0 0'}}>{paper(false)}</div>
      <Svg>
        <line x1={1500} y1={330} x2={1660} y2={40} stroke="#b7bcc0" strokeWidth={10} />
        <rect x={1060} y={330} width={720} height={440} rx={30} fill="#3e3a33" stroke="#17140f" strokeWidth={9} />
        <rect x={1100} y={380} width={320} height={340} rx={14} fill="#272420" />
        {Array.from({length: 11}, (_, i) => <line key={i} x1={1116} y1={400 + i * 30} x2={1404} y2={400 + i * 30} stroke="#141210" strokeWidth={8} />)}
        <rect x={1460} y={390} width={280} height={110} fill="#f2a24c" stroke="#1a1712" strokeWidth={6} />
        <line x1={1620} y1={395} x2={1620} y2={495} stroke="#c22a18" strokeWidth={6} />
        <circle cx={1530} cy={620} r={60} fill="#6b6459" stroke="#1a1712" strokeWidth={6} />
      </Svg>
      <Pool x={1600} y={450} rx={380} color="255,170,70" a={0.56} />
    </Macro>
  );
};

// ---------------------------------------------------------------- title + end

const Title: ShotComponent = p => {
  const end = p.shot.view === 'end';
  const a = appear(p.f, 4, 22);
  return (
    <AbsoluteFill style={{background: '#050304', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 58%, rgba(170,28,22,.55), rgba(0,0,0,0) 58%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: end ? 360 : 300, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 24}px)`}}>
        <div style={{fontFamily: T.title, fontSize: end ? 126 : 150, color: T.white, lineHeight: 1.2, textShadow: '0 8px 40px rgba(0,0,0,.9)'}}>{end ? 'เนื้อชิ้นสุดท้ายของพ่อ' : 'สูตรลับเขียงหมูพ่อ'}</div>
        <div style={{margin: '26px auto 0', width: 420, height: 7, background: C.tape}} />
        <div style={{marginTop: 26, fontFamily: T.ui, fontWeight: 500, fontSize: 36, color: '#b9b3a6'}}>เรื่องแต่งทั้งหมด ไม่เกี่ยวข้องกับบุคคล สถานที่ หรือหน่วยงานจริง</div>
      </div>
      <Grain f={p.f} opacity={0.14} />
    </AbsoluteFill>
  );
};

const End: ShotComponent = p => <EndCardScene p={p} />;

export const INSERTS: Record<string, ShotComponent> = {ins: Ins, book: Book, phone: PhoneScene, news: NewsScene, title: Title, endcard: End};
export {D, Sheet};
