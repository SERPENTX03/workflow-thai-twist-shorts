// Series covers: node covers/build-covers.mjs  -> covers/flood-canal-ep{1,2}.html (then screenshot to png)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const kit = join(here, '../template/assets/kit');
const cast = readFileSync(join(kit, 'cast.svg'), 'utf8').replace(/<!--[\s\S]*?-->/g, '')
  .replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const page = (ep, title, sub, scene, sky) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../template/assets/kit/kit.css">
<style>
html,body{margin:0;background:#000}
#c{position:relative;width:1080px;height:1920px;overflow:hidden;background:${sky}}
.badge{position:absolute;left:60px;top:90px;background:var(--red);color:#fff;font:700 76px var(--font-display);padding:6px 36px;border-radius:14px;box-shadow:0 8px 0 #7d1a1c}
.series{position:absolute;right:60px;top:112px;font:700 40px var(--font-ui);color:var(--white);opacity:.85;letter-spacing:1px}
.title{position:absolute;left:0;right:0;top:1130px;white-space:nowrap;text-align:center;font:700 190px/1.05 var(--font-display);color:var(--white);
  -webkit-text-stroke:14px #0b1328;paint-order:stroke fill;text-shadow:0 14px 0 #0b1328}
.title em{font-style:normal;color:var(--gold)}
.sub{position:absolute;left:0;right:0;top:1400px;text-align:center}
.sub span{display:inline-block;background:rgba(11,19,40,.88);color:var(--white);font:700 64px var(--font-display);padding:8px 34px;border-radius:12px}
.sub b{color:var(--gold);font-weight:700}
</style></head><body><div id="c">
<svg width="0" height="0" style="position:absolute"><defs>${cast}</defs></svg>
${scene}
<div class="vignette"></div>
<div class="badge">EP ${ep}</div><div class="series">น้ำท่วมริมคลอง</div>
<div class="title">${title}</div>
<div class="sub"><span>${sub}</span></div>
</div></body></html>`;

const stars = Array.from({ length: 28 }, (_, i) => `<circle cx="${(i * 197) % 1080}" cy="${(i * 113) % 520 + 200}" r="${i % 3 + 2}" fill="#f4ecd4" opacity=".6"/>`).join('');

const ep1 = `<svg style="position:absolute;inset:0" width="1080" height="1920" viewBox="0 0 1080 1920">
<defs><radialGradient id="h"><stop offset="0" stop-color="#f4ecd4" stop-opacity=".5"/><stop offset="1" stop-color="#f4ecd4" stop-opacity="0"/></radialGradient>
<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b5a3c"/><stop offset="1" stop-color="#2a2216"/></linearGradient></defs>
${stars}
<circle cx="820" cy="360" r="260" fill="url(#h)"/><circle cx="820" cy="360" r="90" fill="#f4ecd4"/>
<!-- stilt houses half-sunk -->
<g fill="#16202f"><path d="M-20 760 L130 640 L280 760 V900 H-20Z"/><path d="M700 780 L880 650 L1060 780 V900 H700Z"/><rect x="300" y="700" width="170" height="200"/></g>
<g fill="#ffcf8a"><rect x="60" y="780" width="46" height="56"/><rect x="760" y="800" width="46" height="56"/></g>
<rect y="880" width="1080" height="1040" fill="url(#w)"/>
<rect y="880" width="1080" height="8" fill="#e8dec0" opacity=".6"/>
<g stroke="#e8dec0" stroke-linecap="round" opacity=".35"><path d="M120 940H520" stroke-width="6"/><path d="M600 1000H980" stroke-width="5"/><path d="M200 1070H700" stroke-width="4"/></g>
<!-- ภูมิ wading, โอ่ง on a floating crate -->
<g><svg x="250" y="330" width="330" height="858" viewBox="0 0 200 520" overflow="visible"><use href="#raincoat"/></svg></g>
<g><svg x="590" y="740" width="330" height="227" viewBox="0 0 320 220" overflow="visible"><use href="#dog"/></svg></g>
<rect x="0" y="1010" width="1080" height="910" fill="#2a2216" opacity=".9"/>
<rect x="0" y="1010" width="1080" height="6" fill="#e8dec0" opacity=".5"/>
</svg>
<div class="rain" style="background-position:0 0;opacity:.7"></div>`;

const ep2 = `<svg style="position:absolute;inset:0" width="1080" height="1920" viewBox="0 0 1080 1920">
<defs><radialGradient id="s"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient>
<linearGradient id="w2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a8a86"/><stop offset="1" stop-color="#2c3a3c"/></linearGradient></defs>
<circle cx="540" cy="900" r="620" fill="url(#s)"/><circle cx="540" cy="900" r="120" fill="#fff3cf"/>
<rect y="900" width="1080" height="1020" fill="url(#w2)"/>
<rect y="900" width="1080" height="8" fill="#fff3cf" opacity=".7"/>
<path d="M300 900 H780 L700 1010 H380Z" fill="#ffe9b0" opacity=".25"/>
<!-- roof, ภูมิ + โอ่ง + ไฟฉาย beam -->
<path d="M120 1010 L540 800 L960 1010Z" fill="#2a2420"/><rect x="120" y="1005" width="840" height="30" fill="#18130f"/>
<path d="M610 770 L1080 560 V900Z" fill="#fff3cf" opacity=".28"/>
<svg x="360" y="420" width="230" height="598" viewBox="0 0 200 520" overflow="visible"><use href="#raincoat"/></svg>
<svg x="650" y="855" width="260" height="179" viewBox="0 0 320 220" overflow="visible"><use href="#dog"/></svg>
<circle cx="610" cy="770" r="26" fill="#fff"/>
<path d="M120 1260 H960 L900 1360 H180Z" fill="#7a5632"/><!-- boat -->
</svg>`;

writeFileSync(join(here, 'flood-canal-ep1.html'), page(1, 'น้ำท่วม<em>คลอง</em>', 'ตีสอง น้ำถึงวัด · <b>90 นาที</b>', ep1, '#0b1328'));
writeFileSync(join(here, 'flood-canal-ep2.html'), page(2, '<em>รอด</em>แล้ว', 'เหลือแค่ <b>ไฟฉาย</b> บนหลังคา', ep2, 'linear-gradient(#e7a96a,#f6d9a0 50%,#7a8a86)'));
console.log('ok');
