// Channel profile logo: node brand/build-logo.mjs  -> brand/logo.svg (then screenshot to logo.png)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cast = readFileSync(join(here, '../template/assets/kit/cast.svg'), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const S = 2.2, WATER = 566, CX = 540;
const top = WATER - 215 * S; // symbol y=215 sits on the waterline

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
<defs>
${cast}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0b1328"/><stop offset="1" stop-color="#27406b"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1c2c4f"/><stop offset="1" stop-color="#070b17"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#f4ecd4" stop-opacity=".55"/><stop offset="1" stop-color="#f4ecd4" stop-opacity="0"/></radialGradient>
<clipPath id="above"><rect x="0" y="0" width="1080" height="${WATER}"/></clipPath>
<clipPath id="below"><rect x="0" y="${WATER}" width="1080" height="${1080 - WATER}"/></clipPath>
</defs>
<rect width="1080" height="1080" fill="url(#sky)"/>
<circle cx="780" cy="200" r="210" fill="url(#halo)"/>
<circle cx="780" cy="200" r="80" fill="#f4ecd4"/>
<rect y="${WATER}" width="1080" height="${1080 - WATER}" fill="url(#sea)"/>

<!-- the living one: ภูมิ in the yellow raincoat -->
<g clip-path="url(#above)">
  <svg x="${CX - 100 * S}" y="${top}" width="${200 * S}" height="${520 * S}" viewBox="0 0 200 520" overflow="visible"><use href="#raincoat"/></svg>
</g>

<!-- the reflection is not him: a woman with a bun, red eyes -->
<g clip-path="url(#below)" opacity=".9">
  <g transform="translate(0 ${WATER}) scale(1 -1) translate(0 ${-WATER})">
    <svg x="${CX - 100 * S}" y="${top}" width="${200 * S}" height="${520 * S}" viewBox="0 0 200 520" overflow="visible"
      style="--skin:#0a0f1c;--skin-d:#0a0f1c;--hair:#0a0f1c;--top:#0a0f1c;--skirt:#0a0f1c;--shoe:#0a0f1c;--eye:#e5383b"><use href="#auntie"/></svg>
  </g>
</g>
<g stroke="#9fb6e0" stroke-linecap="round" fill="none" opacity=".5">
  <path d="M230 ${WATER + 4} H850" stroke-width="5"/>
  <path d="M330 ${WATER + 60} H760" stroke-width="4" opacity=".7"/>
  <path d="M400 ${WATER + 120} H690" stroke-width="3" opacity=".5"/>
</g>
<circle cx="540" cy="540" r="520" fill="none" stroke="#f6c445" stroke-width="14"/>
</svg>`;
writeFileSync(join(here, 'logo.svg'), svg);
console.log('wrote brand/logo.svg');
