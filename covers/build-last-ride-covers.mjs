// Covers for เที่ยวสุดท้าย หนึ่งล้านบาท: node covers/build-last-ride-covers.mjs
//   -> covers/last-ride-vertical.html (1080x1920, the short) + covers/last-ride-youtube.html (1280x720, the full film)
// Uses the kit sprite (cast.svg + stories/last-ride.svg): ลุงชาญ with the creepy grin (face-lr-grin), key in hand.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const kit = join(here, '../template/assets/kit');
const body = (f) => readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const sprite = body(join(kit, 'cast.svg')) + body(join(kit, 'stories/last-ride.svg'));

// Chan, waist up: grin, key held up in his screen-left hand
const chan = (x, y, h) => `<svg class="who c-lr-chan face-off arm-l-off lr-rim" style="left:${x}px;top:${y}px;width:${h * 200 / 520}px;height:${h}px" viewBox="0 0 200 520" overflow="visible">
  <use href="#lr-chan" width="200" height="520"/><use href="#face-lr-grin" width="200" height="520" transform="translate(0 13)"/>
  <use href="#arm-l-hold" width="200" height="520"/><use href="#lr-key" transform="translate(88 244)"/></svg>`;

const page = (w, h, inner, css) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../template/assets/kit/kit.css">
<link rel="stylesheet" href="../template/assets/kit/stories/last-ride.css">
<style>
html,body{margin:0;background:#000}
#c{position:relative;width:${w}px;height:${h}px;overflow:hidden;background:#0b1020}
.set{position:absolute;left:0;top:0}
.shade{position:absolute;inset:0;pointer-events:none}
.t{position:absolute;font-family:var(--font-display);font-weight:700;color:var(--white);-webkit-text-stroke:12px #0b1328;paint-order:stroke fill;text-shadow:0 10px 0 #0b1328;white-space:nowrap}
.t em{font-style:normal;color:var(--gold)}
.chip{position:absolute;background:var(--red);color:#fff;font:700 56px/1 var(--font-display);padding:16px 34px;border-radius:14px;box-shadow:0 8px 0 #7d1a1c;white-space:nowrap}
${css}
</style></head><body><div id="c">
<svg width="0" height="0" style="position:absolute"><defs>${sprite}</defs></svg>
${inner}
</div></body></html>`;

// ---------- vertical 1080x1920 (the short): face fills the top half, title below; bottom ~300 px left clear for the app UI
const vertical = page(1080, 1920, `
<svg class="set" width="1080" height="1920" viewBox="0 0 1080 1920"><use href="#lr-warehouse-wall" width="1080" height="1240"/><use href="#lr-warehouse-floor" y="1220" width="1080" height="700"/><use href="#lr-warehouse-lamp" width="1080" height="1240"/></svg>
${chan(-60, 160, 3100)}
<div class="shade" style="background:linear-gradient(0deg, rgba(255,214,150,.10), rgba(6,10,26,.38) 55%)"></div>
<div class="shade" style="background:radial-gradient(ellipse at 50% 32%, rgba(0,0,0,0) 25%, rgba(4,6,14,.75) 70%), linear-gradient(180deg, rgba(4,6,14,0) 50%, rgba(4,6,14,.92) 72%)"></div>
<div class="chip" style="left:50%;top:1150px;transform:translateX(-50%) rotate(-3deg)">“ล้านนึง… ไปไหม?”</div>
<div class="t" style="left:0;right:0;top:1290px;text-align:center;font-size:150px;line-height:1.08">เที่ยวสุดท้าย<br><em>หนึ่งล้านบาท</em></div>
`, '');

// ---------- YouTube 1280x720 (the full film): face right, hook + title left; bottom-right corner kept clear for the timestamp
const youtube = page(1280, 720, `
<svg class="set" width="1280" height="720" viewBox="0 0 1920 1080"><use href="#lr-l-warehouse" width="1920" height="1080"/><use href="#lr-l-warehouse-lamp" width="1920" height="1080" x="320"/></svg>
<svg class="set lr-cream-box" width="1280" height="720" viewBox="0 0 1920 1080"><g opacity=".55" transform="translate(-60 560) scale(.55)"><use href="#lr-truck-side" width="1300" height="620"/></g></svg>
${chan(690, 40, 1700)}
<div class="shade" style="background:linear-gradient(0deg, rgba(255,214,150,.08), rgba(6,10,26,.32) 60%)"></div>
<div class="shade" style="background:linear-gradient(90deg, rgba(4,6,14,.92) 0, rgba(4,6,14,.75) 38%, rgba(4,6,14,0) 62%), radial-gradient(ellipse at 76% 30%, rgba(0,0,0,0) 30%, rgba(4,6,14,.55) 80%)"></div>
<div class="chip" style="left:48px;top:70px;font-size:46px;transform:rotate(-2deg)">ห้ามเปิดดู</div>
<div class="t" style="left:48px;top:190px;font-size:118px;line-height:1.08">เที่ยวสุดท้าย<br><em>หนึ่งล้านบาท</em></div>
<div class="t" style="left:52px;top:500px;font-size:54px;-webkit-text-stroke:8px #0b1328;text-shadow:0 6px 0 #0b1328">“ล้านนึง… ไปไหม?”</div>
`, '');

writeFileSync(join(here, 'last-ride-vertical.html'), vertical);
writeFileSync(join(here, 'last-ride-youtube.html'), youtube);
console.log('ok');
