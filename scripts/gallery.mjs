// Cast gallery: every symbol in template/assets/kit/cast.svg on one page.
// npm run gallery  ->  template/assets/kit/gallery.html (open it in a browser)
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const kit = resolve("template/assets/kit");
const cast = readFileSync(resolve(kit, "cast.svg"), "utf8");
const css = readFileSync(resolve(kit, "kit.css"), "utf8");

const inline = cast.replace(/^<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute">');
const ids = [...cast.matchAll(/<symbol id="([^"]+)"([^>]*)>/g)].map((m) => ({ id: m[1], attrs: m[2] }));
const vb = (a) => /viewBox="([^"]+)"/.exec(a)?.[1];
const has = (id) => ids.some((s) => s.id === id);
const box = (id) => vb(ids.find((s) => s.id === id).attrs).split(" ").map(Number);
const prefixed = (p) => ids.filter((s) => s.id.startsWith(p)).map((s) => s.id);

// people at their real relative height (cm), 520 units = 170 cm
const people = [["man", 170], ["man-wide", 170], ["man-raise", 170], ["woman", 158], ["auntie", 150], ["elder", 160],
  ["raincoat", 165], ["student", 165], ["kid", 120], ["kid-girl", 120]].filter(([id]) => has(id));
const animals = ["cat-black", "cat-orange", "beagle", "dog-patch", "dog", "dog-growl"].filter(has);
const props = prefixed("prop-");
const faces = prefixed("face-");
const talks = prefixed("talk-");
const accs = prefixed("acc-");
const marks = prefixed("mark-");
const icons = prefixed("icon-");
const sets = prefixed("set-");
const poses = ["hold", "chest", "offer", "raise", "pocket", "carry"];
const cls = (id) => (id === "kid-girl" ? "c-kid-girl" : `c-${id.split("-")[0]}`);
const FIG = 'width="200" height="520"';

const card = (label, svg, w = 200, h = 260) =>
  `<figure><div class="art" style="width:${w}px;height:${h}px">${svg}</div><figcaption>${label}</figcaption></figure>`;

const person = ([id, cm]) => {
  const [, , fw, fh] = box(id);
  const h = (520 * cm) / 170, w = (h * fw) / fh;
  return card(`${id} · ${cm}`, `<svg class="w ${cls(id)}" viewBox="-20 -20 240 560"><use href="#${id}" x="${(200 - w) / 2}" y="${520 - h}" width="${w}" height="${h}"/></svg>`, 130, 300);
};
const animal = (id) => {
  const [, , w, h] = box(id);
  return card(id, `<svg class="w" viewBox="-20 -20 ${w + 40} ${h + 40}"><use href="#${id}"/></svg>`, 220, 190);
};
const body = (label, inner, c = "c-man") =>
  card(label, `<svg class="w ${c}" viewBox="-40 -40 280 580">${inner}</svg>`, 170, 330);
const pose = (side, p) =>
  card(`arm-${side}-${p}`, `<svg class="w c-man arm-${side}-off" viewBox="-90 -20 380 560"><use href="#man" ${FIG}/><use href="#arm-${side}-${p}" ${FIG}/></svg>`, 190, 280);
const head = (label, cls2, inner, dy = 0) =>
  card(label, `<svg class="w ${cls2}" style="overflow:hidden" viewBox="15 -20 170 190"><use href="#man" ${FIG}/>${inner}</svg>`, 170, 190);
const face = (who, id, dy = 0) =>
  card(id.slice(5), `<svg class="w c-${who} face-off" style="overflow:hidden" viewBox="15 -20 170 190"><use href="#${who}" ${FIG}/><use href="#${id}" ${FIG} transform="translate(0 ${dy})"/></svg>`, 170, 190);
const acc = (id) => {
  const hand = id === "acc-watch" || id === "acc-hand-bandage";
  const inner = id === "acc-backpack"
    ? `<use href="#acc-backpack" ${FIG}/><use href="#man" ${FIG}/><use href="#acc-straps" ${FIG}/>`
    : `<use href="#man" ${FIG}/>` + (hand ? `<use href="#${id}" transform="translate(148 330)"/>` : `<use href="#${id}" ${FIG}/>`);
  return card(id.slice(4), `<svg class="w c-man" style="overflow:hidden" viewBox="-40 -50 280 420">${inner}</svg>`, 180, 270);
};
const mark = (id) =>
  card(id.slice(5), `<svg class="w c-man" style="overflow:hidden" viewBox="-30 -135 270 310"><use href="#man" ${FIG}/><use href="#${id}" ${FIG}/></svg>`, 180, 206);
const prop = (id) =>
  id === "prop-box"
    ? card(id, `<svg class="w" viewBox="-90 -90 180 140"><use href="#${id}"/></svg>`, 200, 156)
    : card(id, `<svg class="w" viewBox="-70 -125 140 225"><use href="#${id}"/></svg>`, 124, 200);
const icon = (id) => card(id.slice(5), `<svg class="w" viewBox="-12 -12 124 124"><use href="#${id}" width="100" height="100"/></svg>`, 110, 110);
const setp = (id) => {
  const [, , w, h] = box(id);
  return card(`${id.slice(4)} · ${w}×${h}`, `<svg class="w" viewBox="-20 -20 ${w + 40} ${h + 40}"><use href="#${id}" width="${w}" height="${h}"/></svg>`, 220, 220);
};

const bodies = [
  body("man-walk", `<use href="#man-walk" ${FIG}/>`),
  body("man-run", `<use href="#man-run" ${FIG}/>`),
  body("man-sit", `<use href="#man-sit" ${FIG}/>`),
  body("man-crouch", `<use href="#man-crouch" ${FIG}/>`),
  body("man-back", `<use href="#man-back" ${FIG}/>`),
  body("carry + prop-box", `<use href="#man" ${FIG}/><use href="#arm-l-carry" ${FIG}/><use href="#arm-r-carry" ${FIG}/><use href="#prop-box" transform="translate(100 262)"/>`, "c-man arm-l-off arm-r-off"),
  body("woman-sit", `<use href="#woman-sit" ${FIG}/>`, "c-woman"),
  body("woman-run", `<use href="#woman-run" ${FIG}/>`, "c-woman"),
  body("woman-back", `<use href="#woman-back" ${FIG}/>`, "c-woman"),
  body("sit + face-scared", `<use href="#man-sit" ${FIG}/><use href="#face-scared" ${FIG} transform="translate(0 110)"/>`, "c-man face-off"),
  body("run + face-shock", `<use href="#man-run" ${FIG}/><use href="#face-shock" ${FIG} transform="rotate(8 100 300)"/>`, "c-man face-off"),
  body("sit + arm-r-hold + phone", `<use href="#man-sit" ${FIG}/><g transform="translate(0 110)"><use href="#arm-r-hold" ${FIG}/><use href="#prop-phone" transform="translate(112 244)"/></g>`, "c-man arm-r-off"),
].join("");
const lying = card("man-lie (520×200)", `<svg class="w c-man" viewBox="-20 -20 560 240"><use href="#man-lie" width="520" height="200"/></svg>`, 300, 150);
const crowd = card("crowd (640×520)", `<svg class="w" viewBox="-20 -20 680 560"><use href="#crowd" width="640" height="520"/></svg>`, 300, 250);

const vars = [...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})/g)].filter((m, i, a) => a.findIndex((n) => n[1] === m[1]) === i);
const swatches = vars
  .map((m) => `<div class="sw"><i style="background:${m[2]}"></i><b>${m[1]}</b><span>${m[2]}</span></div>`)
  .join("");

const html = `<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cast gallery</title>
<style>
${css}

body{margin:0;padding:40px;background:#131a2b;color:#efe8da;font-family:"Plex Thai",sans-serif}
h1{font-family:Kanit,sans-serif;font-size:36px;margin:0 0 6px}
h2{font-family:Kanit,sans-serif;font-size:24px;margin:44px 0 6px;color:#f6c445}
p.n{margin:0 0 14px;color:#8a97ab;font-size:15px}
code{color:#efe8da;background:#ffffff14;padding:1px 6px;border-radius:5px}
.row{display:flex;flex-wrap:wrap;gap:18px}
figure{margin:0;text-align:center}
.art{background:linear-gradient(#33465c,#26364a);border-radius:14px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.art .w{width:100%;height:100%;overflow:visible}
figcaption{margin-top:8px;font-size:15px;color:#c9d2e0;max-width:220px}
.sw{display:flex;align-items:center;gap:10px;width:230px;font-size:14px}
.sw i{width:30px;height:30px;border-radius:8px;border:1px solid #fff3}
.sw span{color:#8a97ab;margin-left:auto}
</style></head><body>
${inline}
<h1>Cast gallery</h1>
<p class="n">ทุก symbol ใน assets/kit/cast.svg &nbsp;·&nbsp; สร้างจาก npm run gallery &nbsp;·&nbsp; วิธีใช้: .claude/skills/thai-twist-short/references/cast-library.md</p>
<h2>ตัวละคร (สูงตามจริง · ซม.)</h2><p class="n">วาดที่ ซม. × 2.6 px · kid / kid-girl ใช้กรอบ 200×420</p><div class="row">${people.map(person).join("")}</div>
<h2>ฝูงชน</h2><div class="row">${crowd}</div>
<h2>สัตว์</h2><div class="row">${animals.map(animal).join("")}</div>
<h2>ท่าทั้งตัว</h2><p class="n">สีหน้า / ปาก / เครื่องประกอบ / mark บนท่าเหล่านี้ใส่ transform เดียวกับท่า (ดูตารางใน cast-library.md)</p><div class="row">${bodies}${lying}</div>
<h2>ท่ามือขวา (บนตัว man)</h2><p class="n"><code>arm-r-off</code> แล้ววาง <code>arm-r-*</code> ทับ · แขนหนึ่งข้าง = มือเดียว</p><div class="row">${poses.map((p) => pose("r", p)).join("")}</div>
<h2>ท่ามือซ้าย (บนตัว man)</h2><div class="row">${poses.map((p) => pose("l", p)).join("")}</div>
<h2>สีหน้า (man)</h2><p class="n"><code>face-off</code> แล้ววาง <code>face-*</code> ทับ</p><div class="row">${faces.map((f) => face("man", f)).join("")}</div>
<h2>สีหน้า (woman, translate 0 4)</h2><div class="row">${faces.map((f) => face("woman", f, 4)).join("")}</div>
<h2>ปากพูด</h2><p class="n"><code>mouth-off</code> (ตายังอยู่) แล้วสลับ href ของ <code>talk-*</code> ทุก 0.12 วิ ตอนพูด</p><div class="row">${talks.map((t) => head(t.slice(5), "c-man mouth-off", `<use href="#${t}" ${FIG}/>`)).join("")}</div>
<h2>เครื่องประกอบ (trait ประจำตัว)</h2><p class="n">backpack วางก่อนตัวละคร · watch / hand-bandage วางที่จุดมือ</p><div class="row">${accs.filter((a) => a !== "acc-straps").map(acc).join("")}</div>
<h2>สัญลักษณ์อารมณ์</h2><div class="row">${marks.map(mark).join("")}</div>
<h2>prop (จุดกำเนิด = กลางมือ)</h2><div class="row">${props.map(prop).join("")}</div>
<h2>ไอคอนอินโฟกราฟิก</h2><div class="row">${icons.map(icon).join("")}</div>
<h2>ชิ้นฉาก (viewBox = px ที่สเกลตัวละคร)</h2><div class="row">${sets.map(setp).join("")}</div>
<h2>สีใน kit.css</h2><div class="row">${swatches}</div>
</body></html>`;

writeFileSync(resolve(kit, "gallery.html"), html);
console.log(`gallery.html: ${people.length} people, ${animals.length} animals, ${props.length} props, ${faces.length} faces, ${accs.length} accessories, ${marks.length} marks, ${icons.length} icons, ${sets.length} set pieces`);
