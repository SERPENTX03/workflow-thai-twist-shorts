import React from 'react';
import type {ShotProps} from '../../engine/episode';
import {appear, kf} from '../../engine/anim';
import {T} from '../../engine/theme';
import {Plate} from '../../kit/stage';
import {Hand, Ink, Page} from '../../kit/inserts';
import {ChildPhoto} from '../../kit/childroom';
import {C} from './cast';

// Chapter 5–6 clues: the two medals, the note under Chan's door, the pencil rubbing that brings back Prae's page,
// Chan's thumbprints, and the waterproof envelope from under the pier.

const D = (p: ShotProps) => (p.shot.data ?? {}) as Record<string, any>;
const SKIN = C.skin;
const Table: React.FC<{c?: string}> = ({c = 'linear-gradient(#5a4330, #3a2a1c)'}) => <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080, background: c}} />;
const RedRing: React.FC<{x: number; y: number; w: number; h: number; f: number; at?: number}> = ({x, y, w, h, f, at = 8}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `7px solid ${T.red}`, borderRadius: 26, opacity: appear(f, at, 10), boxShadow: '0 0 24px rgba(229,56,59,.5)'}} />
);

const Medal: React.FC<{x: number; y: number; metal: 'silver' | 'bronze'; label: string; ribbon: string}> = ({x, y, metal, label, ribbon}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 300, height: 480}}>
    <svg width={300} height={480}>
      <path d="M70 0 L150 200 L230 0" fill="none" stroke={ribbon} strokeWidth="44" />
      <circle cx="150" cy="300" r="120" fill={metal === 'silver' ? '#c9ccd2' : '#b8865a'} stroke={metal === 'silver' ? '#7d8590' : '#7a5230'} strokeWidth="10" />
      <path d="M90 310 Q120 280 150 310 Q180 340 210 310" fill="none" stroke={metal === 'silver' ? '#5a6470' : '#5a3a20'} strokeWidth="7" />
      <text x="150" y="380" textAnchor="middle" fontSize="26" fontWeight="700" fill={metal === 'silver' ? '#3a4450' : '#3a2410'} fontFamily="Plex Thai, sans-serif">ทีมว่ายน้ำท่าน้อย</text>
    </svg>
    <div style={{position: 'absolute', top: 440, width: 300, textAlign: 'center', fontFamily: T.display, fontSize: 36, color: T.white, textShadow: '0 3px 10px rgba(0,0,0,.6)'}}>{label}</div>
  </div>
);

/** the swimming medals: the son's silver one and the father's participation medal, same team, same year */
export const MedalScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  return (
    <Plate p={p} light="lamp" z={[1.02, 1.08]} oy={480}>
      <Table c="repeating-linear-gradient(90deg, #6a4b31 0 6px, #8a6a48 6px 110px)" />
      <Medal x={520} y={150} metal="silver" label="ของลูก" ribbon="#3b5fb0" />
      <Medal x={1080} y={170} metal="bronze" label="ของพ่อ" ribbon="#3b5fb0" />
      {d.mark === 'silver' && <RedRing x={540} y={300} w={260} h={260} f={f} />}
      <Hand x={1480} y={320} s={1.1} skin="#c48c62" sleeve={C.pho} mode="grip" flip rot={20} />
    </Plate>
  );
};

/** the note Phak slides under the door of house 6 */
export const SlipScene: React.FC<ShotProps> = p => {
  const {f, len} = p;
  const d = D(p);
  const x = kf(f, [[0, 360], [Math.min(40, len * 0.6), 820]]);
  return (
    <Plate p={p} light="night" z={[1.02, 1.08]} oy={640}>
      <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 1100, background: 'repeating-linear-gradient(90deg, #4a3424 0 6px, #5a3f2a 6px 120px)'}} />
      <div style={{position: 'absolute', left: -700, top: 600, width: 3320, height: 40, background: '#0a0706'}} />
      <div style={{position: 'absolute', left: -700, top: 640, width: 3320, height: 900, background: 'linear-gradient(#3a2e22, #241c14)'}} />
      <div style={{position: 'absolute', left: x, top: 560, width: 560, height: 150, background: '#f2ead8', transform: 'perspective(800px) rotateX(60deg)', transformOrigin: '50% 100%', boxShadow: '0 8px 20px rgba(0,0,0,.4)'}}>
        <div style={{position: 'absolute', left: 30, top: 16}}><Ink text={d.note ?? ''} size={40} color="#1e3a7a" /></div>
      </div>
      <Hand x={x - 80} y={720} s={1.1} skin={SKIN} sleeve={C.phak} mode="open" rot={-6} />
    </Plate>
  );
};

/** pencil rubbing: graphite shaded over a blank page lifts the pressed writing of the page that was torn out.
 *  rubbing 0 = blank page, 1 = shading half way, 2 = the line readable; mark 'po' rings the long tail of พ */
export const RubbingScene: React.FC<ShotProps> = p => {
  const {f, len} = p;
  const d = D(p);
  const stage: number = d.rubbing ?? 0;
  const k = stage === 0 ? kf(f, [[0, 0], [len, 0.15]]) : stage === 1 ? kf(f, [[0, 0.2], [len, 0.75]]) : 1;
  const lines = ['วันนี้ฉันจำชื่อเด็กหญิงฝนได้', 'ถ้าพรุ่งนี้ฉันเขียนชื่ออื่นไว้', 'ขอให้พี่ขูดออก'];
  return (
    <Plate p={p} light="lamp" z={[1.02, 1.08]}>
      <Table />
      <Page x={420} y={120} w={1080} h={820} rot={-1}>
        {/* the pressed writing shows only where graphite has been rubbed: white text on the grey shading */}
        <div style={{position: 'absolute', left: 60, top: 150, width: 960, height: 420, background: '#5a5a62', opacity: 0.85,
          clipPath: `inset(0 ${100 - k * 100}% 0 0)`}}>
          <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(115deg, rgba(0,0,0,.15) 0 3px, transparent 3px 9px)'}} />
          {stage > 0 && lines.map((l, i) => (
            <div key={i} style={{position: 'absolute', left: 40, top: 40 + i * 120, opacity: stage === 2 ? 1 : 0.5}}>
              <Ink text={l} size={64} color="#efe6cf" />
            </div>
          ))}
        </div>
        {d.mark === 'po' && <div style={{position: 'absolute', left: 120, top: 205, width: 190, height: 110, border: `6px solid ${T.red}`, borderRadius: 40, opacity: appear(f, 6, 10)}} />}
      </Page>
      {/* the pencil on its side */}
      <div style={{position: 'absolute', left: 420 + 60 + k * 900, top: 520, width: 360, height: 30, background: '#f6c445', borderRadius: 6, transform: 'rotate(-62deg)', transformOrigin: '0 50%', boxShadow: 'inset 0 -8px 0 #c9a22a'}} />
      <Hand x={420 + 40 + k * 900} y={720} s={1} skin={SKIN} sleeve={C.phak} mode="grip" rot={-20} />
    </Plate>
  );
};

/** the six envelopes Chan took, each signed with a thumbprint (he cannot write) */
export const ThumbScene: React.FC<ShotProps> = p => {
  const {f} = p;
  return (
    <Plate p={p} light="night" z={[1.02, 1.08]}>
      <Table c="repeating-linear-gradient(90deg, #3a2a1c 0 6px, #4a3424 6px 120px)" />
      {Array.from({length: 6}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 300 + (i % 3) * 460, top: 150 + Math.floor(i / 3) * 380, width: 400, height: 300, background: '#d9c9a0', transform: `rotate(${(i - 2.5) * 2}deg)`, boxShadow: '0 10px 24px rgba(0,0,0,.45)'}}>
          <div style={{position: 'absolute', left: 250, top: 150, width: 90, height: 110, borderRadius: '50%', background: 'repeating-radial-gradient(ellipse at 50% 60%, rgba(30,40,90,.75) 0 4px, transparent 4px 9px)', opacity: appear(f, 4 + i * 3, 10)}} />
          <div style={{position: 'absolute', left: 30, top: 30, width: 200, height: 8, background: '#8a7f6d'}} />
        </div>
      ))}
      <Hand x={1700} y={820} s={1.3} skin="#c99670" sleeve={C.chan} mode="open" rot={200} />
    </Plate>
  );
};

/** the waterproof envelope from under the pier: Ton with a mango (photo), the dated back, the funeral envelope */
export const TonEnvelopeScene: React.FC<ShotProps> = p => {
  const {f} = p;
  const d = D(p);
  if (d.funeral) {
    return (
      <Plate p={p} light="night" z={[1.02, 1.08]}>
        <Table c="linear-gradient(#2a221a, #14100c)" />
        <div style={{position: 'absolute', left: 520, top: 200, width: 880, height: 600, background: '#f6f2ea', boxShadow: '0 20px 50px rgba(0,0,0,.6)', border: '14px solid #1a1a1e'}}>
          <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: T.ui, fontSize: 48, color: '#3a3a3a'}}>ช่วยงานฌาปนกิจ</div>
          <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: T.display, fontSize: 110, color: '#1a1a1a', opacity: appear(f, 6, 16)}}>เด็กชาย{d.funeral}</div>
        </div>
      </Plate>
    );
  }
  const back = !!d.back;
  return (
    <Plate p={p} light="night" z={[1.02, 1.08]}>
      <Table c="linear-gradient(#2a221a, #14100c)" />
      <div style={{position: 'absolute', left: 380, top: 160, width: 1160, height: 760, background: 'rgba(200,220,230,.18)', border: '6px solid rgba(220,235,240,.45)', borderRadius: 30}} />
      <div style={{position: 'absolute', left: 620, top: 220, width: 680, height: 640, padding: 22, background: '#f6f2ea', transform: 'rotate(-3deg)', boxShadow: '0 16px 40px rgba(0,0,0,.6)'}}>
        {!back ? (
          <div style={{position: 'relative', width: 636, height: 596, background: '#cfe0ea', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 140, top: 60}}><ChildPhoto kind="boy" w={360} h={456} /></div>
            {/* the sour mango in his hand */}
            <div style={{position: 'absolute', left: 430, top: 380, width: 110, height: 150, borderRadius: '55% 45% 50% 50%', background: 'radial-gradient(circle at 35% 35%, #c8d860, #7a9a2a)', transform: 'rotate(20deg)'}} />
            {/* the photographer's reflection: a young woman behind the camera, in the knife blade on the table */}
            <div style={{position: 'absolute', left: 40, top: 500, width: 260, height: 40, background: 'linear-gradient(90deg, #d8dde3, #9aa4ae)', borderRadius: '4px 30px 30px 4px'}}>
              <div style={{position: 'absolute', left: 120, top: 8, width: 22, height: 22, borderRadius: '50%', background: '#3a3a42'}} />
            </div>
          </div>
        ) : (
          <div style={{position: 'relative', width: 636, height: 596, background: '#efe9da'}}>
            <div style={{position: 'absolute', left: 60, top: 80, fontFamily: T.ui, fontSize: 34, color: '#7a7a7a'}}>ร้านล้างอัดรูป · ท่าน้อย</div>
            <div style={{position: 'absolute', left: 60, top: 240, padding: '10px 24px', border: '4px solid #8a3a2a', color: '#8a3a2a', fontFamily: T.display, fontSize: 70, transform: 'rotate(-4deg)', opacity: appear(f, 4, 12)}}>
              ล้างฟิล์ม ๑๒ มี.ค.
            </div>
          </div>
        )}
      </div>
    </Plate>
  );
};
