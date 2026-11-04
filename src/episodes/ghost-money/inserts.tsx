import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotProps} from '../../engine/episode';
import {appear, backOut, easeOut} from '../../engine/anim';
import {Stage} from './sets';

const ease = easeOut;
const spring = (f: number, dur = 18) => appear(f, 0, dur, backOut(1.4));

/** Close-up 2D vector hand & prop inserts (`scene: "hand"`) */
export const HandScene: React.FC<ShotProps> = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  const view = shot.view ?? 'notes';
  const pop = spring(frame, 18);

  return (
    <Stage {...p} bg="#121016">
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {/* 1. `notes`: Three 1,000-baht banknotes placed on the wooden registration desk */}
        {view === 'notes' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#2c1d12" />
            {Array.from({length: 10}, (_, i) => (
              <line key={i} x1="0" y1={i * 115} x2="1920" y2={i * 115} stroke="#1a1009" strokeWidth="6" />
            ))}
            {/* Blue carbon registration book on left */}
            <g transform="translate(220 180)">
              <rect width="520" height="680" rx="16" fill="#204274" stroke="#0f2240" strokeWidth="8" />
              <rect x="28" y="28" width="464" height="624" rx="8" fill="#f6f1e6" />
              <rect x="28" y="28" width="464" height="90" fill="#2c5696" opacity=".25" />
              <text x="260" y="86" textAnchor="middle" fontSize="34" fontWeight="900" fill="#18202e" fontFamily="Noto Sans Thai, sans-serif">
                สมุดลงชื่อรับจ้างฟังสวด
              </text>
              {[180, 260, 340, 420].map((ly, idx) => (
                <line key={idx} x1="60" y1={ly} x2="460" y2={ly} stroke="#94a3b8" strokeWidth="4" />
              ))}
              <text x="72" y="246" fontSize="28" fontWeight="700" fill="#1e293b" fontFamily="Noto Sans Thai, sans-serif">
                3 พ.ย. — นายเมฆ / นายธาม
              </text>
            </g>

            {/* Three crisp 1,000-baht Thai banknotes fanned out */}
            {[0, 1, 2].map(i => {
              const slide = ease(Math.min(1, Math.max(0, (frame - i * 4) / 14)));
              const rot = (i - 1) * 6;
              const bx = 1080 + i * 75 + (1 - slide) * 120;
              const by = 430 + i * 38;
              return (
                <g key={i} transform={`translate(${bx} ${by}) rotate(${rot})`}>
                  <rect x="-250" y="-115" width="500" height="230" rx="12" fill="#d8c3a8" stroke="#4a3928" strokeWidth="6" />
                  <rect x="-232" y="-97" width="464" height="194" rx="6" fill="none" stroke="#8c6f52" strokeWidth="3" strokeDasharray="10 6" />
                  <circle cx="-110" cy="0" r="62" fill="#b89d7e" stroke="#6e553c" strokeWidth="3" />
                  <rect x="40" y="-76" width="170" height="52" rx="8" fill="#7c5836" />
                  <text x="125" y="-38" textAnchor="middle" fontSize="36" fontWeight="900" fill="#f6f1e6" fontFamily="Noto Sans Thai, sans-serif">
                    1000
                  </text>
                  <text x="125" y="54" textAnchor="middle" fontSize="26" fontWeight="800" fill="#4a3928" fontFamily="Noto Sans Thai, sans-serif">
                    หนึ่งพันบาท
                  </text>
                </g>
              );
            })}

            {/* Headman's hand resting by the notes */}
            <g transform={`translate(${1460 + (1 - pop) * 90} 230)`}>
              <rect x="40" y="-180" width="130" height="240" rx="30" fill="#556859" stroke="#222b24" strokeWidth="6" />
              <ellipse cx="105" cy="80" rx="76" ry="58" fill="#d89e74" stroke="#6e482c" strokeWidth="5" />
            </g>
          </svg>
        )}

        {/* 2. `pocket`: Tham sliding the 3,000-baht notes into his rider vest pocket */}
        {view === 'pocket' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#1e4638" />
            {/* Rider vest reflective stripe & fabric */}
            <rect x="0" y="180" width="1920" height="70" fill="#f6e05e" opacity=".88" />
            {/* Folded banknotes sliding into pocket */}
            <g transform={`translate(960 ${440 + ease(Math.min(1, frame / 22)) * 110}) rotate(-8)`}>
              <rect x="-180" y="-130" width="360" height="220" rx="10" fill="#c9b194" stroke="#4a3928" strokeWidth="6" />
              <rect x="-160" y="-150" width="360" height="220" rx="10" fill="#d8c3a8" stroke="#4a3928" strokeWidth="6" />
              <text x="20" y="-40" textAnchor="middle" fontSize="48" fontWeight="900" fill="#4a3928" fontFamily="Noto Sans Thai, sans-serif">
                3,000 ฿
              </text>
            </g>
            {/* Pocket front flap covering bottom of notes */}
            <path d="M560 520 H1360 V920 Q960 980 560 920 Z" fill="#265947" stroke="#122b22" strokeWidth="8" />
            <line x1="590" y1="560" x2="1330" y2="560" stroke="#f6c445" strokeWidth="5" strokeDasharray="16 10" />
            {/* Tham's hand with wristwatch */}
            <g transform={`translate(960 ${320 + ease(Math.min(1, frame / 22)) * 80})`}>
              <ellipse cx="0" cy="40" rx="95" ry="72" fill="#dfa67e" stroke="#6e482c" strokeWidth="6" />
              <rect x="-65" y="-120" width="130" height="60" rx="10" fill="#1e293b" stroke="#0f172a" strokeWidth="5" />
              <circle cx="0" cy="-90" r="36" fill="#f6f1e6" stroke="#d4a73c" strokeWidth="6" />
            </g>
          </svg>
        )}

        {/* 3. `sarong`: Woman's hand pulling her patterned sarong hem from under Tham's chair leg */}
        {view === 'sarong' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#2b1e16" />
            {Array.from({length: 8}, (_, i) => (
              <line key={i} x1="0" y1={140 + i * 130} x2="1920" y2={140 + i * 130} stroke="#160f0b" strokeWidth="6" />
            ))}
            {/* Patterned Thai sarong hem being tugged to the left */}
            <g transform={`translate(${-ease(Math.min(1, frame / 20)) * 180} 0)`}>
              <path d="M120 420 Q620 360 1180 560 L1140 760 Q620 680 120 740 Z" fill="#4d2c4a" stroke="#1f101e" strokeWidth="7" />
              <path d="M140 500 Q620 450 1150 610 M140 650 Q620 600 1140 710" fill="none" stroke="#d4a73c" strokeWidth="8" strokeDasharray="20 12" />
              {/* Mourning woman's hand gripping the cloth */}
              <ellipse cx="380" cy="560" rx="88" ry="64" fill="#dca47e" stroke="#5e3e28" strokeWidth="6" />
            </g>
            {/* Heavy wooden chair leg pressing down on the right */}
            <rect x="1060" y="0" width="130" height="680" rx="10" fill="#5c3d26" stroke="#24160c" strokeWidth="8" />
            <ellipse cx="1125" cy="685" rx="78" ry="22" fill="rgba(0,0,0,.55)" />
          </svg>
        )}

        {/* 4. `knee`: Mek's blue-sleeved hand (with yellow cross patch) gripping Tham's knee tightly */}
        {view === 'knee' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#141824" />
            {/* Sound wave rings from the coffin knock */}
            {[1, 2, 3].map(i => (
              <circle
                key={i}
                cx="960"
                cy="540"
                r={180 + i * 130 + (frame % 25) * 6}
                fill="none"
                stroke="#f6c445"
                strokeWidth="4"
                opacity={0.35 / i}
              />
            ))}
            {/* Tham's dark pants leg / knee */}
            <path d="M680 280 Q980 260 1120 480 L1160 1080 H620 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="8" />
            {/* Mek's blue jacket arm reaching across */}
            <g transform={`translate(${(1 - pop) * 80} 0)`}>
              <path d="M1920 260 L1060 450 L1120 640 L1920 520 Z" fill="#2f5f8f" stroke="#152c47" strokeWidth="8" />
              {/* Yellow cross-stitch patch visible on Mek's elbow */}
              <g transform="translate(1480 440) rotate(-12)">
                <rect x="-48" y="-48" width="96" height="96" rx="14" fill="#1e3f63" stroke="#f6c445" strokeWidth="6" strokeDasharray="10 6" />
                <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke="#f6c445" strokeWidth="12" strokeLinecap="round" />
              </g>
              {/* Mek's hand gripping the knee */}
              <ellipse cx="1020" cy="540" rx="105" ry="82" fill="#e2ad86" stroke="#6e482c" strokeWidth="7" />
              {[-45, -15, 15, 45].map((fy, i) => (
                <rect key={i} x="900" y={525 + fy} width="76" height="24" rx="12" fill="#d49c74" stroke="#6e482c" strokeWidth="4" />
              ))}
            </g>
          </svg>
        )}

        {/* 5. `eggs-bar`: Bag of 3 boiled eggs tied to the motorcycle handlebar */}
        {view === 'eggs-bar' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#231c2e" />
            {/* Motorcycle handlebar & mirror stem */}
            <path d="M180 340 H1560" stroke="#262a30" strokeWidth="54" strokeLinecap="round" />
            <rect x="1180" y="298" width="380" height="84" rx="22" fill="#14171c" stroke="#000" strokeWidth="6" />
            <path d="M840 310 L960 220 H1180 L1140 310 Z" fill="#2f6b55" stroke="#142e24" strokeWidth="6" />
            {/* Plastic bag with 3 boiled eggs hanging from bar */}
            <g transform={`translate(960 360) rotate(${Math.sin(frame / 7) * 3})`}>
              <path
                d="M-30 0 C-90 120 -180 240 -150 410 C-120 530 120 530 150 410 C180 240 90 120 30 0 Z"
                fill="rgba(248,244,234,0.86)"
                stroke="#948c7e"
                strokeWidth="6"
              />
              {/* Red rubber band knot */}
              <rect x="-48" y="36" width="96" height="22" rx="10" fill="#e5383b" />
              {/* Three warm boiled eggs */}
              <ellipse cx="-58" cy="370" rx="58" ry="74" fill="#f7ebd2" stroke="#bfa782" strokeWidth="5" />
              <ellipse cx="58" cy="375" rx="58" ry="74" fill="#f7ebd2" stroke="#bfa782" strokeWidth="5" />
              <ellipse cx="0" cy="295" rx="58" ry="74" fill="#f7ebd2" stroke="#bfa782" strokeWidth="5" />
            </g>
          </svg>
        )}

        {/* 6. `ledger`: Headman writing on the ledger with blue carbon paper underneath */}
        {view === 'ledger' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#2a1c12" />
            {/* Ledger book */}
            <rect x="320" y="110" width="1280" height="860" rx="20" fill="#1e3f6e" stroke="#0d1f38" strokeWidth="10" />
            {/* Blue carbon sheet visible underneath */}
            <rect x="380" y="160" width="1160" height="760" rx="10" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="5" />
            <text x="960" y="870" textAnchor="middle" fontSize="34" fontWeight="900" fill="#bfdbfe" fontFamily="Noto Sans Thai, sans-serif">
              แผ่นสำเนากระดาษคาร์บอนสีน้ำเงิน (เก็บเป็นหลักฐานพิธีกรรม)
            </text>
            {/* Top white registration sheet with bottom-right corner peeled up */}
            <path d="M380 160 H1540 V640 L1280 800 H380 Z" fill="#f6f1e6" stroke="#948c7c" strokeWidth="5" />
            <path d="M1540 640 L1280 800 L1320 620 Z" fill="#dfd7c6" stroke="#948c7c" strokeWidth="5" />
            <text x="450" y="250" fontSize="42" fontWeight="900" fill="#18202e" fontFamily="Noto Sans Thai, sans-serif">
              บัญชีรายชื่อผู้รับจ้างนั่งฟังสวดกะดึก
            </text>
            <line x1="450" y1="290" x2="1460" y2="290" stroke="#475569" strokeWidth="4" />
            <text x="450" y="370" fontSize="34" fontWeight="700" fill="#334155" fontFamily="Noto Sans Thai, sans-serif">
              1. นายเมฆ   — แถวหน้าสุด (3,000 บาท)
            </text>
            <text x="450" y="455" fontSize="34" fontWeight="700" fill="#334155" fontFamily="Noto Sans Thai, sans-serif">
              2. นายธาม   — แถวหน้าสุด (3,000 บาท)
            </text>
            {/* Hand holding ballpoint pen writing */}
            <g transform={`translate(${1080 + Math.sin(frame / 4) * 18} 440)`}>
              <line x1="0" y1="0" x2="220" y2="-240" stroke="#1e293b" strokeWidth="22" strokeLinecap="round" />
              <polygon points="-12,12 12,-4 -4,-12" fill="#1d4ed8" />
              <ellipse cx="140" cy="-120" rx="92" ry="64" fill="#d89e74" stroke="#6e482c" strokeWidth="6" />
            </g>
          </svg>
        )}

        {/* 7. `patch`: Macro close-up of Mek's yellow cross-stitch elbow patch */}
        {view === 'patch' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#0f1522" />
            {/* Bent blue denim jacket sleeve */}
            <path
              d="M420 120 L1080 460 L1520 220 L1680 490 L1080 860 L260 440 Z"
              fill="#2f5f8f"
              stroke="#16304d"
              strokeWidth="12"
              strokeLinejoin="round"
            />
            {/* Yellow cross-stitch patch on the elbow */}
            <g transform="translate(1050 610)">
              <circle r="190" fill="none" stroke="#f6c445" strokeWidth="5" strokeDasharray="16 10" opacity={0.75} />
              <rect x="-110" y="-110" width="220" height="220" rx="24" fill="#1e3f63" stroke="#f6c445" strokeWidth="8" strokeDasharray="18 10" />
              <path d="M-64 -64 L64 64 M64 -64 L-64 64" stroke="#f6c445" strokeWidth="24" strokeLinecap="round" />
            </g>
            <rect x="560" y="880" width="800" height="84" rx="16" fill="rgba(15,23,42,0.9)" stroke="#f6c445" strokeWidth="4" />
            <text x="960" y="936" textAnchor="middle" fontSize="38" fontWeight="900" fill="#f6c445" fontFamily="Noto Sans Thai, sans-serif">
              จุดสังเกต: รอยปะด้ายเหลืองรูปกากบาทที่ข้อศอกเสื้อเมฆ
            </text>
          </svg>
        )}

        {/* 8. `clapper`: Hand striking the wooden ritual clapper block against the coffin */}
        {view === 'clapper' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#16110e" />
            {/* Coffin side wood on left */}
            <rect x="0" y="80" width="760" height="920" fill="#f7f3e8" stroke="#b88928" strokeWidth="14" />
            <rect x="680" y="80" width="44" height="920" fill="#d4a73c" />
            {/* Impact rings */}
            {[1, 2, 3].map(i => (
              <circle
                key={i}
                cx="760"
                cy="520"
                r={80 + i * 95 + (frame % 15) * 8}
                fill="none"
                stroke="#f6c445"
                strokeWidth="6"
                opacity={0.7 / i}
              />
            ))}
            {/* Hand & wooden clapper striking */}
            <g transform={`translate(${820 + Math.abs(Math.sin(frame / 4)) * 70} 520)`}>
              <rect x="-60" y="-42" width="340" height="84" rx="18" fill="#6b3e23" stroke="#2b170b" strokeWidth="8" />
              <ellipse cx="280" cy="0" rx="95" ry="74" fill="#d89e74" stroke="#5e3e28" strokeWidth="7" />
            </g>
            <text x="1220" y="300" textAnchor="middle" fontSize="64" fontWeight="900" fill="#f6c445" fontFamily="Noto Sans Thai, sans-serif">
              ก๊อก! ก๊อก!
            </text>
          </svg>
        )}

        {/* 9. `bowl`: Rice porridge bowl with red ritual thread (full, eating, empty, or spilled) */}
        {view === 'bowl' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#1e1510" />
            {d.spilled ? (
              /* Spilled bowl on floorboards */
              <g transform="translate(960 560)">
                <ellipse cx="60" cy="80" rx="520" ry="190" fill="#e8e2d0" />
                <path d="M-380 40 Q0 -90 420 60 Q180 220 -320 150 Z" fill="#fbfaf5" />
                {/* Overturned ceramic bowl */}
                <g transform="translate(-180 -60) rotate(-32)">
                  <path d="M-240 0 H240 A240 190 0 0 1 -240 0 Z" fill="#e9e4d6" stroke="#6e6658" strokeWidth="10" />
                  <rect x="-110" y="165" width="220" height="28" rx="8" fill="#bfb8a8" stroke="#6e6658" strokeWidth="6" />
                </g>
                {/* Red ritual thread tangled in the spilled porridge */}
                <path
                  d="M-220 60 C-80 -40 120 160 280 20 C380 -60 440 110 310 160"
                  fill="none"
                  stroke="#e5383b"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              /* Upright bowl on wooden tray */
              <g transform="translate(960 560)">
                <ellipse cx="0" cy="210" rx="440" ry="90" fill="rgba(0,0,0,.5)" />
                {/* Ceramic Bowl */}
                <path d="M-340 -80 H340 A340 270 0 0 1 -340 -80 Z" fill="#e9e4d6" stroke="#6e6658" strokeWidth="10" />
                <ellipse cx="0" cy="-80" rx="340" ry="110" fill="#fbfaf5" stroke="#8c8373" strokeWidth="8" />
                {/* Porridge fill level based on `d.eaten` */}
                {(d.eaten ?? 0) < 1 && (
                  <ellipse
                    cx="0"
                    cy={-76 + Number(d.eaten ?? 0) * 35}
                    rx={305 - Number(d.eaten ?? 0) * 60}
                    ry={88 - Number(d.eaten ?? 0) * 20}
                    fill="#f3efe2"
                  />
                )}
                {/* Conspicuous Red Ritual Thread coiled around the rim & inside */}
                <path
                  d="M-330 -65 C-180 45 180 45 330 -65 C220 -155 -200 -155 -280 -55 C-140 15 110 -15 190 -75"
                  fill="none"
                  stroke="#e5383b"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Ceramic Spoon */}
                <g transform="translate(140 -140) rotate(-28)">
                  <rect x="-18" y="-220" width="36" height="220" rx="16" fill="#e2ddd0" stroke="#6e6658" strokeWidth="6" />
                  <ellipse cx="0" cy="10" rx="58" ry="38" fill="#fbfaf5" stroke="#6e6658" strokeWidth="6" />
                </g>
                {/* Optional frail old hand reaching (`d.hand === 'old'`) */}
                {d.hand === 'old' && (
                  <g transform="translate(340 -260)">
                    <ellipse cx="0" cy="0" rx="95" ry="66" fill="#d8b498" stroke="#6e5644" strokeWidth="6" />
                  </g>
                )}
                {/* Optional label badge (`d.label`) */}
                {d.label && (
                  <g transform="translate(0 310)">
                    <rect x="-260" y="-44" width="520" height="84" rx="16" fill="#7f1d1d" stroke="#f6c445" strokeWidth="5" />
                    <text x="0" y="12" textAnchor="middle" fontSize="38" fontWeight="900" fill="#fef2f2" fontFamily="Noto Sans Thai, sans-serif">
                      ชามข้าวต้มผูกด้ายแดง ({String(d.label)})
                    </text>
                  </g>
                )}
              </g>
            )}
          </svg>
        )}

        {/* 10. `hearing-aid`: Close-up of the old man's ear with a behind-the-ear hearing aid */}
        {view === 'hearing-aid' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#141820" />
            {/* Side of old man's head & grey hair */}
            <circle cx="760" cy="560" r="360" fill="#d8b498" stroke="#6e5644" strokeWidth="8" />
            <path d="M420 480 Q460 160 840 180 Q1080 200 1090 480 Z" fill="#c4bfad" stroke="#5c584c" strokeWidth="8" />
            {/* Ear */}
            <ellipse cx="1060" cy="560" rx="74" ry="118" fill="#cfa88a" stroke="#6e5644" strokeWidth="8" />
            {/* Behind-the-ear Hearing Aid */}
            <path d="M1085 450 Q1210 450 1195 610 Q1180 710 1105 680" fill="none" stroke="#e5c7a3" strokeWidth="42" strokeLinecap="round" />
            <path d="M1085 450 Q1035 480 1055 560" fill="none" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
            <circle cx="1055" cy="565" r="26" fill="#d6b48e" stroke="#4a3928" strokeWidth="5" />
            <circle cx="1175" cy="495" r="12" fill="#e5383b" />
            <rect x="560" y="880" width="800" height="84" rx="16" fill="rgba(15,23,42,0.9)" stroke="#f6c445" strokeWidth="4" />
            <text x="960" y="936" textAnchor="middle" fontSize="38" fontWeight="900" fill="#f6f1e6" fontFamily="Noto Sans Thai, sans-serif">
              ชายชราสวมเครื่องช่วยฟัง (ผู้รับจ้างรายใหม่)
            </text>
          </svg>
        )}

        {/* 11. `photo`: Close-up of the funeral portrait frame showing Mek & his yellow cross-stitch patch */}
        {view === 'photo' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill={d.flowers ? '#3b2c20' : '#10131c'} />
            {/* Ornate Gold Portrait Frame */}
            <g transform="translate(960 510)">
              <rect x="-340" y="-430" width="680" height="840" rx="28" fill="#d4a73c" stroke="#5e430d" strokeWidth="12" />
              <rect x="-290" y="-380" width="580" height="740" rx="12" fill="#d9e6f2" stroke="#3a2a14" strokeWidth="8" />
              {/* Mek's Portrait inside frame */}
              <circle cx="0" cy="-140" r="115" fill="#e2ad86" stroke="#6e482c" strokeWidth="6" />
              <path d="M-115 -150 Q-95 -290 20 -270 Q125 -255 115 -135 L85 -175 Q0 -210 -85 -165 Z" fill="#1c1922" />
              <circle cx="-42" cy="-135" r="10" fill="#1a1a22" />
              <circle cx="42" cy="-135" r="10" fill="#1a1a22" />
              <path d="M-28 -78 Q0 -62 28 -78" fill="none" stroke="#6e3b34" strokeWidth="6" strokeLinecap="round" />
              {/* Mek's blue denim jacket */}
              <path d="M-230 350 C-220 40 -120 -10 0 -10 C120 -10 220 40 230 350 Z" fill="#2f5f8f" stroke="#16304d" strokeWidth="8" />
              {/* Yellow cross-stitch patch on the elbow */}
              <g transform="translate(155 210)">
                <rect x="-46" y="-46" width="92" height="92" rx="12" fill="#1e3f63" stroke="#f6c445" strokeWidth="6" strokeDasharray="10 6" />
                <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke="#f6c445" strokeWidth="12" strokeLinecap="round" />
                {!d.flowers && <circle r="82" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="14 8" />}
              </g>
              {/* Jasmine garland & memorial flowers when `d.flowers` is true */}
              {d.flowers && (
                <g transform="translate(0 360)">
                  {[-180, -120, -60, 0, 60, 120, 180].map((fx, i) => (
                    <circle key={i} cx={fx} cy="0" r="32" fill={i % 2 === 0 ? '#f8fafc' : '#f6c445'} stroke="#cbd5e1" strokeWidth="4" />
                  ))}
                </g>
              )}
            </g>
          </svg>
        )}

        {/* 12. `belongings`: Hidden crate behind altar containing victims' phones, wallets, and Mek's jacket */}
        {view === 'belongings' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#0d0b0e" />
            {/* Flashlight spotlight circle */}
            <circle cx="960" cy="540" r="520" fill="#2b2319" stroke="#f6e3b4" strokeWidth="4" opacity=".92" />
            {/* Wooden crate interior */}
            <rect x="340" y="160" width="1240" height="760" rx="24" fill="#4a311e" stroke="#24160c" strokeWidth="12" />
            <rect x="390" y="210" width="1140" height="660" rx="12" fill="#2e1d11" />
            {/* Mek's folded blue jacket with yellow cross-stitch patch */}
            <g transform="translate(620 460)">
              <rect x="-190" y="-170" width="380" height="320" rx="22" fill="#2f5f8f" stroke="#142b44" strokeWidth="8" />
              <rect x="30" y="-40" width="96" height="96" rx="12" fill="#1e3f63" stroke="#f6c445" strokeWidth="6" strokeDasharray="10 6" />
              <path d="M52 -18 L104 34 M104 -18 L52 34" stroke="#f6c445" strokeWidth="12" strokeLinecap="round" />
            </g>
            {/* Mek's cracked-screen phone */}
            <g transform="translate(1060 390) rotate(8)">
              <rect x="-90" y="-160" width="180" height="320" rx="22" fill="#1e293b" stroke="#94a3b8" strokeWidth="7" />
              <rect x="-74" y="-130" width="148" height="260" rx="8" fill="#0f172a" />
              <path d="M-74 -90 L40 20 L-50 90 M40 20 L74 -40" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            </g>
            {/* Leather wallets & ID cards of previous victims */}
            <rect x="960" y="610" width="240" height="150" rx="14" fill="#5c2d16" stroke="#261107" strokeWidth="7" />
            <rect x="1240" y="540" width="220" height="140" rx="14" fill="#3b2314" stroke="#1a0e07" strokeWidth="7" />
          </svg>
        )}

        {/* 13. `ledger-open`: Open carbon ledger revealing the list of dates & crossed-out victims */}
        {view === 'ledger-open' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#1c1510" />
            <rect x="220" y="90" width="1480" height="900" rx="24" fill="#1e3f6e" stroke="#0d1f38" strokeWidth="10" />
            <rect x="270" y="130" width="1380" height="820" rx="12" fill="#f6f1e6" stroke="#8c8270" strokeWidth="6" />
            <line x1="960" y1="130" x2="960" y2="950" stroke="#cbd5e1" strokeWidth="6" />
            <text x="960" y="210" textAnchor="middle" fontSize="42" fontWeight="900" fill="#18202e" fontFamily="Noto Sans Thai, sans-serif">
              สมุดบัญชีพิธีสะเดาะเคราะห์ (สำเนากระดาษคาร์บอน)
            </text>
            {[
              {d: '31 ต.ค.', name: 'นายสมชาย (รับเคราะห์คืนที่ 1)', done: true},
              {d: '1 พ.ย.', name: 'นายวิชัย (รับเคราะห์คืนที่ 2)', done: true},
              {d: '2 พ.ย.', name: 'นายบุญมี (รับเคราะห์คืนที่ 3)', done: true},
              {d: '3 พ.ย.', name: 'นายเมฆ (รับเคราะห์คืนที่ 4)', done: true},
              {d: '4 พ.ย.', name: 'นายธาม / ชายชรา (คืนที่ 5)', done: false},
            ].map((row, i) => {
              const ry = 320 + i * 115;
              return (
                <g key={i}>
                  <line x1="330" y1={ry + 28} x2="1590" y2={ry + 28} stroke="#cbd5e1" strokeWidth="3" />
                  <text x="360" y={ry} fontSize="36" fontWeight="900" fill="#1e293b" fontFamily="Noto Sans Thai, sans-serif">
                    {row.d}
                  </text>
                  <text x="580" y={ry} fontSize="36" fontWeight="700" fill={row.done ? '#64748b' : '#b91c1c'} fontFamily="Noto Sans Thai, sans-serif">
                    {row.name}
                  </text>
                  {row.done ? (
                    <g>
                      <line x1="560" y1={ry - 14} x2="1360" y2={ry - 14} stroke="#dc2626" strokeWidth="6" />
                      <text x="1460" y={ry} fontSize="34" fontWeight="900" fill="#dc2626" fontFamily="Noto Sans Thai, sans-serif">
                        ✕ สำเร็จ
                      </text>
                    </g>
                  ) : (
                    <text x="1460" y={ry} fontSize="34" fontWeight="900" fill="#d97706" fontFamily="Noto Sans Thai, sans-serif">
                      ? รอพิธี
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* 14. `ledger-bag`: The ledger sealed inside a police evidence bag (`ของกลาง`) */}
        {view === 'ledger-bag' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#1e242b" />
            {/* Clear plastic evidence bag */}
            <rect x="420" y="90" width="1080" height="900" rx="28" fill="rgba(226,232,240,0.22)" stroke="#94a3b8" strokeWidth="8" />
            {/* Red zip-lock seal at top */}
            <line x1="440" y1="150" x2="1480" y2="150" stroke="#ef4444" strokeWidth="12" />
            {/* Blue carbon ledger inside */}
            <rect x="560" y="240" width="800" height="560" rx="16" fill="#204274" stroke="#0f2240" strokeWidth="8" />
            <rect x="600" y="280" width="720" height="480" rx="8" fill="#f6f1e6" />
            {/* Evidence label sticker */}
            <rect x="520" y="640" width="880" height="260" rx="14" fill="#fff" stroke="#dc2626" strokeWidth="8" />
            <rect x="520" y="640" width="880" height="74" rx="8" fill="#dc2626" />
            <text x="960" y="690" textAnchor="middle" fontSize="38" fontWeight="900" fill="#fff" fontFamily="Noto Sans Thai, sans-serif">
              วัตถุพยานสำคัญ (ของกลาง) · สภ.ดงสะเดา
            </text>
            <text x="960" y="775" textAnchor="middle" fontSize="34" fontWeight="800" fill="#1e293b" fontFamily="Noto Sans Thai, sans-serif">
              สมุดลงชื่อกระดาษคาร์บอน และด้ายแดงประกอบพิธีอำพราง
            </text>
            <text x="960" y="845" textAnchor="middle" fontSize="28" fontWeight="700" fill="#64748b" fontFamily="Noto Sans Thai, sans-serif">
              ผู้ต้องหา: ผู้ใหญ่บ้านหมู่ 4 · คดีจัดฉากพิธีศพและกักขังหน่วงเหนี่ยว
            </text>
          </svg>
        )}

        {/* 15. `handlebar`: Tham's hand firmly gripping the motorcycle throttle in warm morning light */}
        {view === 'handlebar' && (
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#d9c39e" />
            {/* Moving asphalt road lines below */}
            <rect x="0" y="540" width="1920" height="540" fill="#333842" />
            <line x1="0" y1="620" x2="1920" y2="620" stroke="#f6c445" strokeWidth="12" strokeDasharray="120 80" />
            {/* Motorcycle handlebar & speedometer */}
            <path d="M120 480 H1680" stroke="#262a30" strokeWidth="58" strokeLinecap="round" />
            <circle cx="560" cy="390" r="110" fill="#1e293b" stroke="#94a3b8" strokeWidth="10" />
            <circle cx="560" cy="390" r="86" fill="#f8fafc" />
            <line x1="560" y1="390" x2="610" y2="335" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
            {/* Rubber throttle grip */}
            <rect x="1040" y="432" width="460" height="96" rx="24" fill="#14171c" stroke="#000" strokeWidth="7" />
            {/* Tham's hand + wristwatch + green rider sleeve */}
            <g transform="translate(1240 480)">
              <rect x="120" y="-420" width="210" height="360" rx="40" fill="#2f6b55" stroke="#142e24" strokeWidth="8" />
              <rect x="125" y="-110" width="200" height="46" rx="10" fill="#1e293b" />
              <circle cx="225" cy="-87" r="34" fill="#f6f1e6" stroke="#d4a73c" strokeWidth="6" />
              <ellipse cx="40" cy="0" rx="120" ry="88" fill="#dfa67e" stroke="#6e482c" strokeWidth="7" />
            </g>
          </svg>
        )}
      </AbsoluteFill>
    </Stage>
  );
};

/** Close-up 2D vector smartphone screens (`scene: "phone"`) */
export const PhoneScene: React.FC<ShotProps> = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  const view = shot.view ?? 'repo';
  const cracked = Boolean(d.cracked);
  const stamp = d.stamp ? String(d.stamp) : null;

  return (
    <Stage {...p} bg="#0d111a">
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <rect width="1920" height="1080" fill={view === 'voice-msg' ? '#2c3e35' : '#0d111a'} />
          {/* Hand holding phone */}
          <ellipse cx="640" cy="680" rx="140" ry="220" fill="#dca47e" stroke="#5e3e28" strokeWidth="8" />
          <ellipse cx="1280" cy="680" rx="140" ry="220" fill="#dca47e" stroke="#5e3e28" strokeWidth="8" />

          {/* Smartphone body */}
          <g transform="translate(960 510)">
            <rect x="-330" y="-440" width="660" height="880" rx="52" fill="#1e293b" stroke="#64748b" strokeWidth="10" />
            <rect x="-296" y="-380" width="592" height="760" rx="24" fill={view === 'ad' ? '#111827' : '#f8fafc'} />
            {/* Top speaker & signal bar */}
            <rect x="-70" y="-414" width="140" height="12" rx="6" fill="#475569" />

            {/* View 1: `repo` (Finance SMS warning) */}
            {view === 'repo' && (
              <g>
                <rect x="-296" y="-380" width="592" height="110" rx="20" fill="#b91c1c" />
                <text x="0" y="-310" textAnchor="middle" fontSize="38" fontWeight="900" fill="#fff" fontFamily="Noto Sans Thai, sans-serif">
                  ⚠️ แจ้งเตือนด่วน · {String(d.from ?? 'ไฟแนนซ์')}
                </text>
                <rect x="-256" y="-220" width="512" height="360" rx="20" fill="#fef2f2" stroke="#ef4444" strokeWidth="5" />
                <text x="0" y="-135" textAnchor="middle" fontSize="34" fontWeight="900" fill="#991b1b" fontFamily="Noto Sans Thai, sans-serif">
                  ค้างชำระค่างวดรถจักรยานยนต์
                </text>
                <text x="0" y="-50" textAnchor="middle" fontSize="64" fontWeight="900" fill="#dc2626" fontFamily="Noto Sans Thai, sans-serif">
                  3,000 บาท
                </text>
                <text x="0" y="35" textAnchor="middle" fontSize="28" fontWeight="700" fill="#7f1d1d" fontFamily="Noto Sans Thai, sans-serif">
                  ชำระก่อน 09:00 น. มิฉะนั้นยึดรถทันที
                </text>
              </g>
            )}

            {/* View 2: `ad` (Urgent late-night funeral sitting job post) */}
            {view === 'ad' && (
              <g>
                <rect x="-296" y="-380" width="592" height="100" rx="20" fill="#1f2937" />
                <text x="0" y="-316" textAnchor="middle" fontSize="34" fontWeight="900" fill="#60a5fa" fontFamily="Noto Sans Thai, sans-serif">
                  📌 {String(d.from ?? 'กลุ่มหางานด่วน')}
                </text>
                <rect x="-256" y="-240" width="512" height="440" rx="20" fill="#1e293b" stroke="#f59e0b" strokeWidth="5" />
                <text x="0" y="-160" textAnchor="middle" fontSize="38" fontWeight="900" fill="#fbbf24" fontFamily="Noto Sans Thai, sans-serif">
                  ด่วน! รับคนนั่งฟังสวดกะดึก
                </text>
                <text x="0" y="-75" textAnchor="middle" fontSize="56" fontWeight="900" fill="#34d399" fontFamily="Noto Sans Thai, sans-serif">
                  ค่าจ้าง 3,000 บาท
                </text>
                <text x="0" y="5" textAnchor="middle" fontSize="28" fontWeight="700" fill="#e2e8f0" fontFamily="Noto Sans Thai, sans-serif">
                  นั่งแถวหน้า 1 ชั่วโมง · รับเงินสดทันที
                </text>
                <rect x="-180" y="70" width="360" height="72" rx="36" fill="#2563eb" />
                <text x="0" y="118" textAnchor="middle" fontSize="30" fontWeight="900" fill="#fff" fontFamily="Noto Sans Thai, sans-serif">
                  📍 วัดดงสะเดา (คืนนี้)
                </text>
              </g>
            )}

            {/* View 3: `record` (Mek's voice message to Tik on cracked phone) */}
            {view === 'record' && (
              <g>
                <rect x="-296" y="-380" width="592" height="100" rx="20" fill="#047857" />
                <text x="0" y="-316" textAnchor="middle" fontSize="36" fontWeight="900" fill="#fff" fontFamily="Noto Sans Thai, sans-serif">
                  แชทครอบครัว · {String(d.to ?? 'ติ๊ก (น้องสาว)')}
                </text>
                {/* Signal indicator */}
                <text x="240" y="-320" textAnchor="end" fontSize="24" fontWeight="800" fill="#fde047" fontFamily="Noto Sans Thai, sans-serif">
                  {String(d.status).includes('ไม่สำเร็จ') ? '📵 ไม่มีสัญญาณ' : '📶 4G'}
                </text>
                {/* Voice note bubble */}
                <rect x="-240" y="-210" width="480" height="190" rx="24" fill="#d1fae5" stroke="#059669" strokeWidth="5" />
                <circle cx="-165" cy="-115" r="42" fill="#059669" />
                <polygon points="-178,-135 -178,-95 -144,-115" fill="#fff" />
                {/* Animated audio waveform */}
                {Array.from({length: 14}, (_, i) => {
                  const bh = 24 + Math.abs(Math.sin(frame / 4 + i * 0.7)) * 68;
                  return <rect key={i} x={-95 + i * 22} y={-115 - bh / 2} width="12" height={bh} rx="6" fill="#047857" />;
                })}
                <text x="0" y="65" textAnchor="middle" fontSize="28" fontWeight="700" fill="#475569" fontFamily="Noto Sans Thai, sans-serif">
                  "ติ๊ก พี่ได้เงินแล้วนะ พรุ่งนี้เอาพัดลมแม่ไปซ่อมได้เลย..."
                </text>
                {/* Status badge */}
                <rect
                  x="-190"
                  y="130"
                  width="380"
                  height="76"
                  rx="38"
                  fill={String(d.status).includes('ไม่สำเร็จ') ? '#fee2e2' : '#dcfce7'}
                  stroke={String(d.status).includes('ไม่สำเร็จ') ? '#dc2626' : '#16a34a'}
                  strokeWidth="5"
                />
                <text
                  x="0"
                  y="180"
                  textAnchor="middle"
                  fontSize="34"
                  fontWeight="900"
                  fill={String(d.status).includes('ไม่สำเร็จ') ? '#dc2626' : '#15803d'}
                  fontFamily="Noto Sans Thai, sans-serif"
                >
                  {String(d.status ?? 'กำลังอัด…')}
                </text>
              </g>
            )}

            {/* View 4: `chat` (Message from Headman + optional false-info stamp) */}
            {view === 'chat' && (
              <g>
                <rect x="-296" y="-380" width="592" height="100" rx="20" fill="#1e3a8a" />
                <text x="0" y="-316" textAnchor="middle" fontSize="36" fontWeight="900" fill="#fff" fontFamily="Noto Sans Thai, sans-serif">
                  💬 {String(d.from ?? 'ผู้ใหญ่บ้าน')}
                </text>
                <rect x="-250" y="-210" width="500" height="240" rx="24" fill="#e2e8f0" stroke="#64748b" strokeWidth="4" />
                <text x="0" y="-110" textAnchor="middle" fontSize="32" fontWeight="800" fill="#0f172a" fontFamily="Noto Sans Thai, sans-serif">
                  "{String(d.msg ?? '')}"
                </text>
                {stamp && (
                  <g transform="translate(0 40) rotate(-14)">
                    <rect x="-210" y="-65" width="420" height="130" rx="16" fill="rgba(220,38,38,0.16)" stroke="#dc2626" strokeWidth="10" />
                    <text x="0" y="18" textAnchor="middle" fontSize="62" fontWeight="900" fill="#dc2626" fontFamily="Noto Sans Thai, sans-serif">
                      {stamp}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* View 5: `voice-msg` (Tham listening to Tik's thank-you voice message) */}
            {view === 'voice-msg' && (
              <g>
                <rect x="-296" y="-380" width="592" height="100" rx="20" fill="#0284c7" />
                <text x="0" y="-316" textAnchor="middle" fontSize="36" fontWeight="900" fill="#fff" fontFamily="Noto Sans Thai, sans-serif">
                  🔊 ข้อความเสียงจาก: {String(d.from ?? 'ติ๊ก')}
                </text>
                <rect x="-240" y="-190" width="480" height="210" rx="24" fill="#e0f2fe" stroke="#0284c7" strokeWidth="5" />
                {Array.from({length: 16}, (_, i) => {
                  const bh = 28 + Math.abs(Math.sin(frame / 3 + i * 0.6)) * 84;
                  return <rect key={i} x={-180 + i * 24} y={-85 - bh / 2} width="14" height={bh} rx="7" fill="#0369a1" />;
                })}
                <text x="0" y="110" textAnchor="middle" fontSize="32" fontWeight="800" fill="#0f172a" fontFamily="Noto Sans Thai, sans-serif">
                  "พัดลมแม่ซ่อมเสร็จแล้วนะพี่ธาม ขอบคุณมากนะพี่"
                </text>
              </g>
            )}

            {/* Cracked screen glass overlay when `d.cracked` is true */}
            {cracked && (
              <g pointerEvents="none">
                <path
                  d="M-296 -260 L-40 -60 L296 -180 M-40 -60 L-190 280 M-40 -60 L180 340 M-110 80 L-296 140"
                  fill="none"
                  stroke="rgba(148,163,184,0.85)"
                  strokeWidth="5"
                />
                <circle cx="-40" cy="-60" r="14" fill="none" stroke="rgba(148,163,184,0.9)" strokeWidth="4" />
              </g>
            )}
          </g>
        </svg>
      </AbsoluteFill>
    </Stage>
  );
};

/** Deadline Clock & 3,000-Baht Counter (`scene: "clock"`) */
export const ClockScene: React.FC<ShotProps> = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  return (
    <Stage {...p} bg="#140c10">
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <rect width="1920" height="1080" fill="#160d12" />
          {/* Left: Ticking Deadline Clock */}
          <g transform="translate(560 520)">
            <circle r="290" fill="#3a1d24" stroke="#ef4444" strokeWidth="14" />
            <circle r="250" fill="#f8fafc" />
            {Array.from({length: 12}, (_, i) => {
              const a = (i * Math.PI) / 6;
              return (
                <line
                  key={i}
                  x1={Math.sin(a) * 205}
                  y1={-Math.cos(a) * 205}
                  x2={Math.sin(a) * 235}
                  y2={-Math.cos(a) * 235}
                  stroke="#1e293b"
                  strokeWidth={i % 3 === 0 ? 10 : 5}
                />
              );
            })}
            {/* Hands pointing to 09:00 */}
            <line x1="0" y1="0" x2="-145" y2="0" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" />
            <line x1="0" y1="0" x2="0" y2="-195" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" />
            <line
              x1="0"
              y1="0"
              x2={Math.sin(frame / 4) * 210}
              y2={-Math.cos(frame / 4) * 210}
              stroke="#dc2626"
              strokeWidth="6"
            />
            <circle r="16" fill="#dc2626" />
          </g>

          {/* Right: Deadline & Amount Card */}
          <g transform="translate(1320 520)">
            <rect x="-360" y="-250" width="720" height="500" rx="28" fill="#2b1419" stroke="#f59e0b" strokeWidth="8" />
            <text x="0" y="-140" textAnchor="middle" fontSize="42" fontWeight="900" fill="#fca5a5" fontFamily="Noto Sans Thai, sans-serif">
              เส้นตายก่อนถูกยึดรถทำกิน
            </text>
            <text x="0" y="-10" textAnchor="middle" fontSize="96" fontWeight="900" fill="#fbbf24" fontFamily="Noto Sans Thai, sans-serif">
              {Number(d.need ?? 3000).toLocaleString()} บาท
            </text>
            <rect x="-240" y="70" width="480" height="100" rx="20" fill="#dc2626" />
            <text x="0" y="136" textAnchor="middle" fontSize="48" fontWeight="900" fill="#fff" fontFamily="Noto Sans Thai, sans-serif">
              ⏰ ก่อนเวลา {String(d.due ?? '09:00')} น.
            </text>
          </g>
        </svg>
      </AbsoluteFill>
    </Stage>
  );
};

/** Grocery Store Close-up Inserts (`store:eggs`, `store:glass`, `store:glass-close`) */
export const StoreInsertScene: React.FC<ShotProps> = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  const view = shot.view ?? 'glass';

  if (view === 'eggs') {
    return (
      <Stage {...p} bg="#261a12">
        <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            <rect width="1920" height="1080" fill="#3b281b" />
            {/* Glass countertop surface */}
            <rect x="0" y="420" width="1920" height="660" fill="#7097a8" opacity=".45" />
            <line x1="0" y1="420" x2="1920" y2="420" stroke="#cbe7f2" strokeWidth="10" />
            {/* Ceramic bowl / bag with 3 warm boiled eggs */}
            <g transform="translate(960 520)">
              <ellipse cx="0" cy="90" rx="340" ry="110" fill="#d9cfc0" stroke="#5c5346" strokeWidth="10" />
              <ellipse cx="-120" cy="-10" rx="88" ry="110" fill="#f7ebd2" stroke="#bfa782" strokeWidth="7" />
              <ellipse cx="120" cy="-5" rx="88" ry="110" fill="#f7ebd2" stroke="#bfa782" strokeWidth="7" />
              <ellipse cx="0" cy="-45" rx="88" ry="110" fill="#f7ebd2" stroke="#bfa782" strokeWidth="7" />
              {/* Warm steam */}
              {[-90, 0, 90].map((sx, i) => (
                <path
                  key={i}
                  d={`M${sx} -180 Q${sx - 25} -250 ${sx + 10} -320`}
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              ))}
            </g>
          </svg>
        </AbsoluteFill>
      </Stage>
    );
  }

  // `glass` and `glass-close`: 3 consecutive funeral notices under the shop's glass countertop
  const zoom = view === 'glass-close' ? 1.16 : 1;
  const dates = (d.dates as string[] | undefined) ?? ['31 ต.ค.', '1 พ.ย.', '2 พ.ย.'];
  const names = ['นายสมชาย ดงสะเดา', 'นายวิชัย ศรีสวัสดิ์', 'นายบุญมี ทองคำ'];

  return (
    <Stage {...p} bg="#1f2933">
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <rect width="1920" height="1080" fill="#4a3321" />
          <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
            {/* Three funeral notices lined up side by side */}
            {[0, 1, 2].map(i => {
              const nx = 170 + i * 540;
              return (
                <g key={i} transform={`translate(${nx} 150)`}>
                  <rect width="480" height="740" rx="12" fill="#f6f1e6" stroke="#1e293b" strokeWidth="8" />
                  <rect x="24" y="24" width="432" height="692" fill="none" stroke="#334155" strokeWidth="4" />
                  <rect x="24" y="24" width="432" height="96" fill="#18202e" />
                  <text x="240" y="86" textAnchor="middle" fontSize="36" fontWeight="900" fill="#f6e3b4" fontFamily="Noto Sans Thai, sans-serif">
                    กำหนดการสวดพระอภิธรรม
                  </text>
                  <text x="240" y="185" textAnchor="middle" fontSize="28" fontWeight="700" fill="#475569" fontFamily="Noto Sans Thai, sans-serif">
                    ณ ศาลาใน วัดดงสะเดา (กะดึก)
                  </text>
                  <rect x="60" y="230" width="360" height="140" rx="10" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
                  <text x="240" y="312" textAnchor="middle" fontSize="34" fontWeight="900" fill="#0f172a" fontFamily="Noto Sans Thai, sans-serif">
                    {names[i]}
                  </text>
                  {/* Date box */}
                  <rect x="70" y="450" width="340" height="130" rx="14" fill="#fef2f2" stroke="#b91c1c" strokeWidth="5" />
                  <text x="240" y="505" textAnchor="middle" fontSize="26" fontWeight="800" fill="#7f1d1d" fontFamily="Noto Sans Thai, sans-serif">
                    คืนวันที่สวด (1 คืนเดียว)
                  </text>
                  <text x="240" y="558" textAnchor="middle" fontSize="48" fontWeight="900" fill="#dc2626" fontFamily="Noto Sans Thai, sans-serif">
                    {dates[i]}
                  </text>
                  {d.mark === 'dates' && (
                    <ellipse
                      cx="240"
                      cy="515"
                      rx="195"
                      ry="92"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="8"
                      strokeDasharray="18 10"
                      opacity={0.75 + Math.sin(frame / 4) * 0.25}
                    />
                  )}
                </g>
              );
            })}
            {/* Glass countertop reflection streaks */}
            <path d="M0 240 L1920 80 L1920 220 L0 380 Z" fill="rgba(200,235,250,0.16)" />
          </g>
        </svg>
      </AbsoluteFill>
    </Stage>
  );
};

/** Repaired Electric Fan Close-up (`house:fan`) */
export const HouseFanInsert: React.FC<ShotProps> = p => {
  const {f: frame} = p;
  const spin = frame * 22;
  return (
    <Stage {...p} bg="#2d3b36">
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <rect width="1920" height="1080" fill="#d9ccb4" />
          <rect x="0" y="780" width="1920" height="300" fill="#7c5a3f" />
          {/* Vintage Desk Fan spinning smoothly */}
          <g transform="translate(960 540)">
            {/* Stand & buttons */}
            <path d="M-210 340 L-130 220 H130 L210 340 Z" fill="#3b7a8c" stroke="#183640" strokeWidth="10" />
            <rect x="-42" y="40" width="84" height="190" fill="#cbd5e1" stroke="#334155" strokeWidth="8" />
            {/* Spinning 3-blade rotor */}
            <circle cx="0" cy="-90" r="290" fill="rgba(240,249,255,0.65)" stroke="#334155" strokeWidth="12" />
            <g transform={`translate(0 -90) rotate(${spin})`}>
              {[0, 120, 240].map(deg => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-135"
                  rx="75"
                  ry="135"
                  transform={`rotate(${deg})`}
                  fill="#4ea8de"
                  stroke="#1d4e6b"
                  strokeWidth="6"
                  opacity=".85"
                />
              ))}
            </g>
            <circle cx="0" cy="-90" r="64" fill="#1e293b" stroke="#94a3b8" strokeWidth="6" />
            {/* Fluttering ribbons tied to fan cage showing cool breeze */}
            {[-140, 0, 140].map((rx, i) => (
              <path
                key={i}
                d={`M${rx} -90 Q${rx + 60} ${-110 + Math.sin(frame / 3 + i) * 28} ${rx + 150} ${-80 + Math.cos(frame / 3 + i) * 32}`}
                fill="none"
                stroke={i === 1 ? '#f59e0b' : '#38bdf8'}
                strokeWidth="10"
                strokeLinecap="round"
              />
            ))}
          </g>
        </svg>
      </AbsoluteFill>
    </Stage>
  );
};

/** Tactical Map of Wat Dong Sadao (`police:plan`) */
export const PolicePlanInsert: React.FC<ShotProps> = p => (
  <Stage {...p} bg="#1e293b">
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <rect width="1920" height="1080" fill="#5c4028" />
        <rect x="180" y="90" width="1560" height="900" rx="20" fill="#f6f1e6" stroke="#1e293b" strokeWidth="10" />
        <text x="960" y="175" textAnchor="middle" fontSize="44" fontWeight="900" fill="#18202e" fontFamily="Noto Sans Thai, sans-serif">
          แผนผังปฏิบัติการตรวจค้น · ศาลาใน วัดดงสะเดา
        </text>
        {/* Sala Box */}
        <rect x="560" y="280" width="800" height="460" rx="16" fill="#e2e8f0" stroke="#334155" strokeWidth="8" />
        <text x="960" y="420" textAnchor="middle" fontSize="38" fontWeight="900" fill="#0f172a" fontFamily="Noto Sans Thai, sans-serif">
          ศาลาใน (จุดจัดพิธีสวดกะดึก)
        </text>
        {/* Altar & hidden room behind */}
        <rect x="680" y="300" width="560" height="75" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="5" />
        <text x="960" y="348" textAnchor="middle" fontSize="28" fontWeight="800" fill="#b91c1c" fontFamily="Noto Sans Thai, sans-serif">
          หลังโต๊ะหมู่บูชา (จุดซ่อนทรัพย์สินเหยื่อ)
        </text>
        {/* Arrows for Police & Tham */}
        <path d="M320 620 H540" fill="none" stroke="#2563eb" strokeWidth="12" strokeDasharray="18 10" />
        <circle cx="320" cy="620" r="24" fill="#2563eb" />
        <text x="320" y="685" textAnchor="middle" fontSize="30" fontWeight="900" fill="#1d4ed8" fontFamily="Noto Sans Thai, sans-serif">
          สายตรวจปิดล้อมทางเข้า
        </text>
        <path d="M1580 340 H1260" fill="none" stroke="#d97706" strokeWidth="12" strokeDasharray="18 10" />
        <circle cx="1580" cy="340" r="24" fill="#d97706" />
        <text x="1580" y="405" textAnchor="middle" fontSize="30" fontWeight="900" fill="#b45309" fontFamily="Noto Sans Thai, sans-serif">
          จุดซุ่มสังเกตการณ์หลังศาลา
        </text>
      </svg>
    </AbsoluteFill>
  </Stage>
);

/** Ritual Belief Transfer Diagram (`diagram:transfer`) */
export const DiagramScene: React.FC<ShotProps> = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  return (
    <Stage {...p} bg="#0d090c">
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <rect width="1920" height="1080" fill="#0f0a0e" />
          <text x="960" y="150" textAnchor="middle" fontSize="48" fontWeight="900" fill="#f6c445" fontFamily="Noto Sans Thai, sans-serif">
            กลไกการจัดฉากพิธีสะเดาะเคราะห์ (ความเชื่อต่อชะตา)
          </text>

          {/* Left Node: Hired Victim */}
          <g transform="translate(460 540)">
            <rect x="-280" y="-220" width="560" height="440" rx="28" fill="#1e293b" stroke="#60a5fa" strokeWidth="8" />
            <circle cx="0" cy="-70" r="76" fill="#2f5f8f" />
            <text x="0" y="90" textAnchor="middle" fontSize="42" fontWeight="900" fill="#f8fafc" fontFamily="Noto Sans Thai, sans-serif">
              {String(d.from ?? 'ผู้รับจ้าง')}
            </text>
            <text x="0" y="155" textAnchor="middle" fontSize="28" fontWeight="700" fill="#94a3b8" fontFamily="Noto Sans Thai, sans-serif">
              ลงชื่อกระดาษคาร์บอน · กินข้าวต้มด้ายแดง
            </text>
          </g>

          {/* Right Node: Bedridden Patient */}
          <g transform="translate(1460 540)">
            <rect x="-280" y="-220" width="560" height="440" rx="28" fill="#2b161b" stroke="#f87171" strokeWidth="8" />
            <circle cx="0" cy="-70" r="76" fill="#7f1d1d" />
            <text x="0" y="90" textAnchor="middle" fontSize="42" fontWeight="900" fill="#fef2f2" fontFamily="Noto Sans Thai, sans-serif">
              {String(d.to ?? 'ผู้ป่วยติดเตียง')}
            </text>
            <text x="0" y="155" textAnchor="middle" fontSize="28" fontWeight="700" fill="#fca5a5" fontFamily="Noto Sans Thai, sans-serif">
              ตระกูลผู้มีอิทธิพลผู้ว่าจ้างจัดพิธี
            </text>
          </g>

          {/* Center Red Thread Binding & Arrow */}
          <path
            d={`M740 540 Q960 ${440 + Math.sin(frame / 4) * 35} 1180 540`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="14"
            strokeDasharray="24 12"
          />
          <rect x="750" y="470" width="420" height="140" rx="22" fill="#7f1d1d" stroke="#f6c445" strokeWidth="6" />
          <text x="960" y="555" textAnchor="middle" fontSize="38" fontWeight="900" fill="#fef2f2" fontFamily="Noto Sans Thai, sans-serif">
            {String(d.label ?? 'รับเคราะห์แทน')}
          </text>
        </svg>
      </AbsoluteFill>
    </Stage>
  );
};

/** Cold-open Title Card (`scene: "title"`) */
export const TitleScene: React.FC<ShotProps> = p => {
  const {shot, f: frame} = p;
  const d = shot.data ?? {};
  const pop = spring(frame, 20);
  return (
    <Stage {...p} bg="#08060a" hud={null}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 45%, #2a1810 0%, #09070b 72%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${0.92 + 0.08 * pop})`,
            padding: '48px 96px',
            borderRadius: 24,
            border: '4px solid #d4a73c',
            background: 'rgba(12, 9, 14, 0.85)',
            boxShadow: '0 24px 80px rgba(0,0,0,.85)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'Noto Sans Thai, sans-serif',
              fontSize: 112,
              fontWeight: 900,
              color: '#f6c445',
              letterSpacing: 4,
              textShadow: '0 6px 28px rgba(246,196,69,.35)',
            }}
          >
            {String(d.title ?? 'เงินปากผี')}
          </div>
          {d.sub && (
            <div
              style={{
                marginTop: 20,
                fontFamily: 'Noto Sans Thai, sans-serif',
                fontSize: 32,
                fontWeight: 600,
                color: '#cbd5e1',
              }}
            >
              {String(d.sub)}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
