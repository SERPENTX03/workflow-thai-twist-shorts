// Gallery section for the story kit "เที่ยวสุดท้าย หนึ่งล้านบาท" (template/assets/kit/stories/last-ride.*).
// Imported by scripts/gallery.mjs; every card uses the same <use href="#lr-…"> markup a scene would.

const A = 'width="200" height="520"';   // adult frame
const K = 'width="200" height="420"';   // kid frame

// ---- HTML props (also the markup to copy into a scene; text stays editable)
const handset = '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" fill="#fff"/></svg>';
const bars = [34, 58, 80, 46, 96, 70, 40, 88, 62, 104, 50, 74, 92, 44, 66, 84, 38, 56, 78, 48, 30, 60, 42, 26];
const wave = `<div class="lr-wave-bars">${bars.map((h) => `<span style="height:${h}px"></span>`).join("")}</div>`;
export const phoneHTML = (screen) => `<div class="lr-phone" data-screen="${screen}"><div class="lr-phone-screen">
  <div class="lr-status"><span>23:12</span><i></i></div>
  <div class="lr-screen lr-screen--deposit"><div class="lr-bank-app">แจ้งเตือนบัญชี</div><div class="lr-bank-icon">฿</div><div class="lr-bank-label">เงินเข้า</div><div class="lr-bank-amount">+500,000.00</div><div class="lr-bank-unit">บาท</div><div class="lr-bank-from">จาก ชาญ ส.</div><div class="lr-bank-time">วันนี้ 23:12 น.</div></div>
  <div class="lr-screen lr-screen--call-chan"><div class="lr-call-sub">สายเรียกเข้า…</div><div class="lr-call-avatar">ช</div><div class="lr-call-name">ลุงชาญ</div><div class="lr-call-buttons"><div class="lr-call-btn"><b>${handset}</b>ปฏิเสธ</div><div class="lr-call-btn is-accept"><b>${handset}</b>รับสาย</div></div></div>
  <div class="lr-screen lr-screen--call-wife"><div class="lr-call-sub">สายเรียกเข้า…</div><div class="lr-call-avatar">ภ</div><div class="lr-call-name">ภรรยา</div><div class="lr-call-buttons"><div class="lr-call-btn"><b>${handset}</b>ปฏิเสธ</div><div class="lr-call-btn is-accept"><b>${handset}</b>รับสาย</div></div></div>
  <div class="lr-screen lr-screen--voice"><div class="lr-voice-head">ข้อความเสียง</div><div class="lr-voice-from">จาก ภรรยา</div><div class="lr-wave">${wave}<div class="lr-wave-played">${wave}</div></div><div class="lr-voice-time">0:07 / 0:21</div><div class="lr-voice-play"><i></i><i></i></div></div>
</div></div>`;
export const ledgerHTML = (open) => `<div class="lr-ledger${open ? " is-open" : ""}">
  <div class="lr-ledger-cover"><div class="lr-ledger-label"><b>สมุดส่งมอบรถ</b><span>เล่มที่ 3</span></div></div>
  <div class="lr-ledger-spread">
    <div class="lr-page"><div class="lr-page-title">ผู้รับมอบรถ</div>
      <div class="lr-row is-struck"><b>บุญมี</b><small>2519</small></div>
      <div class="lr-row is-struck"><b>สมศักดิ์</b><small>2538</small></div>
      <div class="lr-row is-struck"><b>ชาญ</b><small>2549</small></div>
    </div>
    <div class="lr-page"><div class="lr-page-title">ผู้รับมอบรถ (ต่อ)</div>
      <div class="lr-row is-new"><b>เอก</b><small>วันนี้</small></div>
      <svg class="lr-sign" viewBox="0 0 300 80"><path d="M10 56 C40 10 60 70 84 40 S120 20 132 50 S170 70 196 30 S240 46 286 34"/></svg>
    </div>
  </div>
</div>`;

export function lastRideSection(card) {
  const fig = (label, cls, inner, vb = "-40 -60 280 600", w = 160, h = 340) =>
    card(label, `<svg class="w ${cls}" viewBox="${vb}">${inner}</svg>`, w, h);
  const kidfig = (label, cls, inner) => fig(label, cls, inner, "-40 -60 280 500", 160, 290);
  const headCrop = (label, cls, inner) => card(label, `<svg class="w ${cls}" style="overflow:hidden" viewBox="10 -40 180 200">${inner}</svg>`, 150, 166);
  const scaled = (html, w, h, k) => `<div style="position:relative;width:${w * k}px;height:${h * k}px"><div style="position:absolute;left:0;top:0;transform:scale(${k});transform-origin:0 0">${html.replace('class="lr-phone"', 'class="lr-phone" style="position:relative"').replace(/class="lr-ledger( is-open)?"/, (m) => m + ' style="position:relative"')}</div></div>`;
  const htmlCard = (label, html, w, h, k) => `<figure><div class="art lr-flat" style="width:${w * k + 30}px;height:${h * k + 30}px;align-items:center">${scaled(html, w, h, k)}</div><figcaption>${label}</figcaption></figure>`;

  // ---------- people
  const ek = [
    fig("เอก · ยืน", "c-lr-ek", `<use href="#lr-ek" ${A}/>`),
    fig("เอก · ถือโทรศัพท์", "c-lr-ek arm-l-off", `<use href="#lr-ek" ${A}/><use href="#arm-l-hold" ${A}/><use href="#lr-phone-hand" transform="translate(88 244)"/>`),
    fig("เอก · เอื้อมเปิดกลอน", "c-lr-ek arm-r-off", `<use href="#lr-ek" ${A}/><use href="#arm-r-reach" ${A}/>`, "-40 -60 300 600", 170),
    fig("เอก · ถอดหมวก (lr-no-cap)", "c-lr-ek lr-no-cap", `<use href="#lr-ek" ${A}/>`),
    fig("เอก · วิญญาณ (lr-spirit)", "c-lr-ek lr-spirit", `<use href="#lr-ek" ${A}/>`),
    fig("lr-ek-cap (ชิ้นแยก)", "", `<use href="#lr-ek-cap" ${A}/>`, "10 -40 180 120", 150, 110),
  ].join("");
  const ekFace = (label, face) => headCrop(label, `c-lr-ek${face ? " face-off lr-no-cap" : ""}`,
    `<use href="#lr-ek" ${A}/>` + (face ? `<use href="#${face}" ${A}/><use href="#lr-ek-cap" ${A}/>` : ""));
  const ekFaces = [ekFace("ปกติ", ""), ekFace("ระแวง · face-wary", "face-wary"), ekFace("ตกใจ · face-shock", "face-shock"), ekFace("เศร้า · face-sad", "face-sad")].join("");
  const chan = [
    fig("ลุงชาญ · ยืน", "c-lr-chan", `<use href="#lr-chan" ${A}/>`),
    fig("ลุงชาญ · ยื่นกุญแจ", "c-lr-chan arm-l-off", `<use href="#lr-chan" ${A}/><use href="#arm-l-offer" ${A}/><use href="#lr-key" transform="translate(-14 222)"/>`, "-80 -60 320 600", 180),
    headCrop("นิ่ง อ่านไม่ออก", "c-lr-chan", `<use href="#lr-chan" ${A}/>`),
    headCrop("รู้สึกผิด · face-guilty", "c-lr-chan face-off", `<use href="#lr-chan" ${A}/><use href="#face-guilty" ${A} transform="translate(0 13)"/>`),
  ].join("");
  const girlDoll = (cls) => `<use href="#lr-girl" ${K}/><use href="#arm-r-hold" ${A}/><use href="#lr-doll" transform="translate(112 254) scale(.74)"/><use href="#lr-hand-cover" transform="translate(112 244)"/>`;
  const passengers = [
    fig("แม่ · ปกติ", "c-lr-mom", `<use href="#lr-mom" ${A}/>`),
    fig("แม่ · เปียกซีด (lr-wet)", "c-lr-mom lr-wet", `<use href="#lr-mom" ${A}/>`),
    kidfig("เด็ก · ยืน", "c-lr-girl", `<use href="#lr-girl" ${K}/>`),
    kidfig("เด็ก · จับตุ๊กตา", "c-lr-girl arm-r-off", girlDoll()),
    kidfig("เด็ก · เปียกซีด", "c-lr-girl arm-r-off lr-wet", girlDoll()),
    fig("แม่จูงมือลูก (lr-mom-girl)", "", `<use href="#lr-mom-girl" width="350" height="520"/>`, "-30 -60 410 600", 230),
    fig("แม่จูงมือลูก · เปียก", "lr-wet", `<use href="#lr-mom-girl" width="350" height="520"/>`, "-30 -60 410 600", 230),
  ].join("");
  const family = [
    fig("ภรรยา · นั่งถือโทรศัพท์", "c-lr-wife arm-r-off", `<use href="#lr-wife-sit" ${A}/><g transform="translate(0 100)"><use href="#arm-r-hold" ${A}/><use href="#lr-phone-hand" transform="translate(112 244)"/></g>`, "-40 -60 320 600", 180),
    headCrop("ภรรยา · กังวล", "c-lr-wife face-off", `<use href="#lr-wife-sit" ${A} transform="translate(0 -100)"/><use href="#face-worried" ${A} transform="translate(0 4)"/>`),
    headCrop("ภรรยา · ร้องไห้", "c-lr-wife face-off", `<use href="#lr-wife-sit" ${A} transform="translate(0 -100)"/><use href="#face-cry" ${A} transform="translate(0 4)"/>`),
    kidfig("ลูกเอก · ยืน", "c-lr-son", `<use href="#lr-son" ${K}/>`),
  ].join("");
  // line-up at relative height: 520 units = 170 cm
  const H = (cm) => (520 * cm) / 170;
  const at = (x, id, cm, frame, cls) => { const h = H(cm), w = (h * 200) / frame; return `<svg class="${cls}" x="${x}" y="${560 - h}" width="${w}" height="${h}" viewBox="0 0 200 ${frame}" overflow="visible"><use href="#${id}" width="200" height="${frame}"/></svg>`; };
  const lineup = card("ความสูงจริง: เอก 172 · ชาญ 165 · แม่ 158 · ลูกเอก 125 · เด็ก 110",
    `<svg class="w" viewBox="0 0 1000 580">${at(20, "lr-ek", 172, 520, "c-lr-ek")}${at(230, "lr-chan", 165, 520, "c-lr-chan")}${at(440, "lr-mom", 158, 520, "c-lr-mom")}${at(640, "lr-son", 125, 420, "c-lr-son")}${at(820, "lr-girl", 110, 420, "c-lr-girl")}</svg>`, 560, 330);

  // ---------- truck
  const side = (label, cls, extraVb = 0) => card(label, `<svg class="w ${cls}" viewBox="-20 -20 ${1340 + extraVb} 660"><use href="#lr-truck-side" width="1300" height="620"/></svg>`, 360 + extraVb / 5, 190);
  const crash = card("รถเอกหลังชน (ไม่มีตู้ + damage + เอียง)", `<svg class="w lr-no-box lr-damaged" viewBox="-20 -20 1340 660">
      <use href="#lr-truck-shadow-side" width="1300" height="620"/>
      <g transform="rotate(-3 680 520)"><use href="#lr-truck-side-body" width="1300" height="620"/><use href="#lr-truck-damage-side" width="1300" height="620"/></g>
      <use href="#lr-truck-wheel" x="330" y="520"/><use href="#lr-truck-wheel" x="1030" y="494" transform="rotate(20 1030 494)"/></svg>`, 360, 190);
  const parts = ["lr-truck-side-box", "lr-truck-side-body", "lr-truck-beam-side", "lr-truck-damage-side", "lr-truck-shadow-side"]
    .map((id) => card(id.replace("lr-truck-", ""), `<svg class="w" viewBox="-20 -20 1840 660"><use href="#${id}" width="1300" height="620"/></svg>`, 230, 100)).join("")
    + card("wheel", `<svg class="w" viewBox="-100 -100 200 200"><use href="#lr-truck-wheel"/></svg>`, 100, 100);
  const rear = (label, cls, extra = "") => card(label, `<svg class="w ${cls}" viewBox="-60 -20 640 680"><use href="#lr-truck-rear" x="-40" width="600" height="640"/>${extra}</svg>`, 200, 212);
  const doll = (x, y, r, k) => `<use href="#lr-doll" transform="translate(${x} ${y}) rotate(${r}) scale(${k})"/>`;
  const cab = (label, cls, face, extra = "") => card(label, `<svg class="w c-lr-ek ${cls}" viewBox="0 0 1080 960">
      <use href="#lr-cab-back" width="1080" height="960"/>${extra}
      <use href="#lr-ek-drive" x="170" y="203" width="300" height="780"/>${face ? `<use href="#${face}" x="170" y="203" width="300" height="780"/><use href="#lr-ek-cap" x="170" y="203" width="300" height="780"/>` : ""}
      <use href="#lr-cab-dash" width="1080" height="960"/><use href="#lr-cab-wheel" width="1080" height="960"/>
      <use href="#lr-ek-drive-hands" x="170" y="203" width="300" height="780"/><use href="#lr-cab-frame" width="1080" height="960"/></svg>`, 300, 267);
  const truck = [
    side("ด้านข้าง · ปิดไฟ", ""), side("ด้านข้าง · lr-lights-on", "lr-lights-on", 480), side("รถส่วนตัวเอก · lr-no-box", "lr-no-box"), crash,
    rear("ด้านหลัง · ปิด", ""), rear("ประตูเปิด · lr-doors-open", "lr-doors-open"), rear("เปิด + รอยเท้าเปียก (lr-prints)", "lr-doors-open lr-prints"),
    rear("ตุ๊กตาบนพื้นตู้", "lr-doors-open lr-prints", doll(300, 446, -78, 0.42)),
    card("กลอน close-up (lr-latch)", `<svg class="w" viewBox="0 0 400 400"><use href="#lr-latch" width="400" height="400"/></svg>`, 200, 200),
    cab("ห้องโดยสาร · เอกขับรถ", "", ""),
    cab("ห้องโดยสาร · ระแวง + ตุ๊กตาบนเบาะ", "face-off lr-no-cap", "face-wary", doll(770, 620, 0, 1.3)),
  ].join("");

  // ---------- props
  const flat = (label, inner, vb, w = 140, h = 170, cls = "") => card(label, `<svg class="w ${cls}" viewBox="${vb}">${inner}</svg>`, w, h).replace('class="art"', 'class="art lr-flat"');
  const props = [
    flat("lr-key", `<use href="#lr-key"/>`, "-60 -110 120 170"),
    flat("lr-phone-hand", `<use href="#lr-phone-hand"/>`, "-60 -110 120 140"),
    flat("lr-doll · แห้ง", `<use href="#lr-doll"/>`, "-70 -135 140 200"),
    flat("lr-doll · เปียก", `<use href="#lr-doll"/>`, "-70 -135 140 200", 140, 170, "lr-wet"),
    flat("lr-watch · 20:47", `<use href="#lr-watch" width="240" height="320"/>`, "0 0 240 320", 140, 186),
    flat("lr-watch · lr-cracked", `<use href="#lr-watch" width="240" height="320"/>`, "0 0 240 320", 140, 186, "lr-cracked"),
    flat("นาฬิกาบนข้อมือเอก", `<use href="#lr-ek" ${A}/>`, "60 150 140 210", 140, 210, "c-lr-ek"),
  ].join("");
  const phones = ["deposit", "call-chan", "call-wife", "voice"].map((s) => htmlCard(`.lr-phone data-screen="${s}"`, phoneHTML(s), 420, 860, 0.42)).join("");
  const ledgers = htmlCard("สมุดส่งมอบรถ · ปิด", ledgerHTML(false), 520, 700, 0.4) + htmlCard("สมุดส่งมอบรถ · is-open", ledgerHTML(true), 1040, 700, 0.4);

  // ---------- sets
  const S = (inner) => inner;
  const road = (stop) => S(`<use href="#lr-road-bg" width="1080" height="1240"/><use href="#lr-road-ground" y="1200" width="1080" height="720"/>${stop}`);
  const fg = `<use href="#lr-road-fg" y="1600" width="1080" height="320"/>`;
  const warehouse = `<use href="#lr-warehouse-wall" width="1080" height="1240"/><use href="#lr-warehouse-floor" y="1220" width="1080" height="700"/>`;
  const lamp = `<use href="#lr-warehouse-lamp" width="1080" height="1240"/>`;
  const pier = `<use href="#lr-pier-bg" width="1080" height="1920"/><use href="#lr-pier-deck" width="1080" height="1920"/>`;
  const posts = `<use href="#lr-pier-posts" width="1080" height="1920"/>`;
  const truckSide = (tx, ty, k, cls = "") => `<svg class="${cls}" x="${tx}" y="${ty}" width="${1300 * k}" height="${620 * k}" viewBox="0 0 1300 620" overflow="visible"><use href="#lr-truck-side" width="1300" height="620"/></svg>`;
  const crashed = (tx, ty, k) => `<svg class="lr-no-box lr-damaged" x="${tx}" y="${ty}" width="${1300 * k}" height="${620 * k}" viewBox="0 0 1300 620" overflow="visible"><use href="#lr-truck-shadow-side" width="1300" height="620"/><g transform="rotate(-4 680 520)"><use href="#lr-truck-side-body" width="1300" height="620"/><use href="#lr-truck-damage-side" width="1300" height="620"/></g><use href="#lr-truck-wheel" x="330" y="520"/><use href="#lr-truck-wheel" x="1030" y="484"/></svg>`;
  const scene = (label, inner, vbw = 1080) => card(label, `<svg class="w" viewBox="0 0 ${vbw} 1920" style="overflow:hidden">${inner}</svg>`, Math.round(216 * vbw / 1080), 384);
  const sets = [
    scene("A · โกดังรับรถ", warehouse + lamp),
    scene("B · ถนนเปลี่ยว + ศาลาร้าง", road(`<use href="#lr-road-sala" x="560" y="812" width="460" height="400"/>`) + fg),
    scene("C · จุดอุบัติเหตุ", road(`<use href="#lr-road-rail-bent" x="500" y="1004" width="560" height="240"/>`) + crashed(-60, 1010, 0.62) + `<use href="#lr-road-debris" x="560" y="1290" width="420" height="90"/>` + fg),
    scene("D · ท่าเรือเก่า", pier + posts),
    scene("E · บ้านเอก (cut-away 1600 กว้าง)", `<use href="#lr-house" width="1600" height="1920"/>`, 1600),
  ].join("");
  const stops = [
    flat("lr-road-sala", `<use href="#lr-road-sala" width="460" height="400"/>`, "-20 -20 500 440", 200, 176),
    flat("lr-road-shop", `<use href="#lr-road-shop" width="480" height="440"/>`, "-20 -20 520 480", 200, 184),
    flat("lr-road-bridge", `<use href="#lr-road-bridge" width="1080" height="300"/>`, "-20 -20 1120 340", 330, 100),
    flat("lr-road-rail-bent", `<use href="#lr-road-rail-bent" width="560" height="240"/>`, "-20 -20 600 280", 230, 107),
    flat("lr-road-debris", `<use href="#lr-road-debris" width="420" height="90"/>`, "-20 -20 460 130", 230, 65),
  ].join("");

  // ---------- three sample frames (1080 x 1920)
  const person = (id, cm, x, feet, k, cls, inner = "", frame = 520) => {
    const h = 2.6 * cm * k, w = (h * 200) / frame;
    return `<svg class="${cls}" x="${x}" y="${feet - h}" width="${w}" height="${h}" viewBox="0 0 200 ${frame}" overflow="visible"><use href="#${id}" width="200" height="${frame}"/>${inner}</svg>`;
  };
  const ex1 = warehouse + truckSide(-400, 724, 0.8) + lamp
    + person("lr-ek", 172, 470, 1215, 0.8, "c-lr-ek arm-r-off lr-rim", `<use href="#arm-r-offer" ${A}/>`)
    + person("lr-chan", 165, 700, 1215, 0.8, "c-lr-chan arm-l-off lr-rim", `<use href="#arm-l-offer" ${A}/><use href="#lr-key" transform="translate(-14 222)"/>`);
  const ex2 = road("") + `<g class="lr-doors-open lr-prints" transform="translate(330 600) scale(.95)"><use href="#lr-truck-rear" x="-40" width="600" height="640"/>${doll(300, 446, -78, 0.42)}</g>`
    + person("lr-ek", 172, 110, 1212, 0.95, "c-lr-ek arm-r-off face-off lr-no-cap lr-rim", `<use href="#arm-r-reach" ${A}/><use href="#face-shock" ${A}/><use href="#lr-ek-cap" ${A}/>`) + fg;
  const ex3 = pier + `<g class="lr-doors-open" transform="translate(-170 760) scale(.82)"><use href="#lr-truck-rear" x="-40" width="600" height="640"/></g>`
    + `<svg class="lr-wet lr-rim" x="400" y="870" width="282" height="420" viewBox="0 0 350 520" overflow="visible"><use href="#lr-mom-girl" width="350" height="520"/></svg>` + posts;
  const samples = [
    scene("เอกกับลุงชาญรับรถที่โกดัง", ex1),
    scene("เอกเปิดตู้เจอตุ๊กตา", ex2),
    scene("แม่กับเด็กลงรถที่ท่าเรือ", ex3),
  ].join("").replaceAll('width:216px;height:384px', 'width:270px;height:480px');

  return `
<h2 id="last-ride">เที่ยวสุดท้าย หนึ่งล้านบาท</h2>
<p class="n">story kit · assets/kit/stories/last-ride.svg + last-ride.css · id/class ขึ้นต้นด้วย lr- · วิธีใช้: references/last-ride.md</p>
<h3>ตัวละคร</h3>
<div class="row">${lineup}</div>
<h4>เอก</h4><div class="row">${ek}</div><div class="row" style="margin-top:14px">${ekFaces}</div>
<h4>ลุงชาญ</h4><div class="row">${chan}</div>
<h4>แม่และเด็กผู้โดยสาร</h4><div class="row">${passengers}</div>
<h4>ครอบครัวเอก</h4><div class="row">${family}</div>
<h3>กระบะตู้ทึบ</h3><div class="row">${truck}</div>
<h4>ชิ้นแยกด้านข้าง (viewBox เดียวกัน วางซ้อนได้)</h4><div class="row">${parts}</div>
<h3>พร็อพ</h3><div class="row">${props}</div>
<h4>โทรศัพท์ (HTML · ข้อความแก้ได้)</h4><div class="row">${phones}</div>
<h4>สมุดส่งมอบรถ (HTML)</h4><div class="row">${ledgers}</div>
<h3>ฉาก</h3><div class="row">${sets}</div>
<h4>ชิ้นสลับบนถนน</h4><div class="row">${stops}</div>
<h3>ตัวอย่างประกอบ</h3><div class="row">${samples}</div>`;
}
