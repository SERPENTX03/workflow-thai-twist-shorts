// cast.svg (symbol sprite) -> src/cast/CastSprite.tsx, keeping only the symbols the Remotion kit uses.
// Usage: node scripts/svg-to-tsx.mjs   (re-run after editing the keep list or the source svg)
import fs from 'node:fs';
import { DOMParser } from '@xmldom/xmldom';

const SRC = 'src/cast/source/cast.svg';
const OUT = 'src/cast/CastSprite.tsx';

const KEEP = [...new Set([
  // people + crowd
  ...Object.keys(JSON.parse(fs.readFileSync('src/cast.json', 'utf8'))).filter(id => !id.startsWith('_')),
  'man', 'din', 'woman', 'auntie', 'elder', 'raincoat', 'student', 'kid', 'kid-girl', 'crowd', 'monk', 'monk-sit', 'auntie-sit',
  'M1', 'M2', 'W1', 'W2', 'A1', 'E1', 'B1', 'G1',
  ...Object.keys(JSON.parse(fs.readFileSync('src/cast/wardrobe.json', 'utf8'))),
  // pets
  'teen-girl', 'uncle', 'young-woman', 'grandpa', 'grandma',
  'cat-black', 'cat-orange', 'beagle', 'dog-patch',
  // whole-body poses
  'man-walk', 'man-run', 'man-sit', 'man-crouch', 'man-back', 'man-lie', 'woman-back', 'woman-sit', 'woman-run',
  // arms
  ...['r', 'l'].flatMap(s => ['hold', 'chest', 'offer', 'raise', 'pocket', 'carry', 'reach', 'phone'].map(p => `arm-${s}-${p}`)),
  'arm-b-wheel', 'prop-wheel',
  // faces + mouths
  ...['happy', 'laugh', 'sad', 'cry', 'angry', 'scared', 'shock', 'worried', 'smirk', 'tired', 'hollow', 'wary', 'guilty', 'grin'].map(f => `face-${f}`),
  'talk-a', 'talk-e', 'talk-o', 'talk-m',
  'talk-smile-a', 'talk-smile-e', 'talk-smile-o', 'talk-smile-m', 'talk-down-a', 'talk-down-e', 'talk-down-o', 'talk-down-m', 'talk-tense-a', 'talk-tense-e', 'talk-tense-o', 'talk-tense-m', 'talk-shock-a', 'talk-shock-e', 'talk-shock-o', 'talk-shock-m',
  'face-sleep',
  // accessories + marks
  "acc-wristwatch", "acc-beads", "acc-necklace", "acc-square-glasses", "acc-bucket-hat", "acc-tote",
  ...['glasses', 'cap', 'mask', 'headband', 'scarf', 'bag', 'amulet', 'backpack', 'straps', 'watch', 'hand-bandage',
    'field-vest', 'shop-apron', 'school', 'school-kid', 'bow', 'raincoat', 'hood', 'pakama'].map(a => `acc-${a}`),
  ...['question', 'exclaim', 'anger', 'drops', 'zzz', 'dizzy', 'idea', 'shiver', 'gloom'].map(m => `mark-${m}`),
  // frequently used props, icons, set pieces
  ...['glass', 'coin', 'phone', 'paper', 'key', 'flashlight', 'bowl', 'box', 'lantern', 'mug', 'spoon', 'book'].map(p => `prop-${p}`),
  ...['clock', 'warn', 'check', 'cross', 'arrow', 'pin', 'fire'].map(i => `icon-${i}`),
  ...['door', 'door-open', 'window', 'table', 'chair', 'bulb'].map(s => `set-${s}`),
])];

const doc = new DOMParser().parseFromString(fs.readFileSync(SRC, 'utf8'), 'image/svg+xml');
const kids = n => Array.from(n.childNodes).filter(c => c.nodeType === 1);
const all = [];
const walk = n => { all.push(n); kids(n).forEach(walk); };
walk(doc.documentElement);

const symbols = new Map();
const defs = new Map();
for (const top of kids(doc.documentElement)) {
  if (top.tagName === 'symbol') symbols.set(top.getAttribute('id'), top);
  if (top.tagName === 'defs') for (const d of kids(top)) if (d.getAttribute('id')) defs.set(d.getAttribute('id'), d);
}

const missing = KEEP.filter(id => !symbols.has(id));
if (missing.length) console.warn('! not in cast.svg:', missing.join(', '));

// reachability: <use href="#x"> and url(#x)
const refs = el => {
  const out = new Set(); const stack = [el];
  while (stack.length) {
    const n = stack.pop();
    for (const a of Array.from(n.attributes || [])) {
      for (const m of a.value.matchAll(/#([\w-]+)/g)) if (a.name.includes('href') || a.value.includes('url(')) out.add(m[1]);
    }
    kids(n).forEach(k => stack.push(k));
  }
  return out;
};
const keepDefs = new Set(); const todo = [];
for (const id of KEEP) if (symbols.has(id)) todo.push(symbols.get(id));
// hair styles and age lines are swapped in at runtime (Sprite hair=, stage hair=): keep them all
for (const [id, d] of defs) if (/^(hair-|wrinkles$|ears$)/.test(id)) { keepDefs.add(id); todo.push(d); }
while (todo.length) {
  for (const r of refs(todo.pop())) if (defs.has(r) && !keepDefs.has(r)) { keepDefs.add(r); todo.push(defs.get(r)); }
}

const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const attrName = n => ({ class: 'className', 'xlink:href': 'href' }[n] || (n.startsWith('data-') ? n : camel(n)));
function styleObj(v) {
  const parts = v.split(';').map(s => s.trim()).filter(Boolean).map(p => {
    const i = p.indexOf(':'); const k = p.slice(0, i).trim(); const val = p.slice(i + 1).trim();
    return `${k.startsWith('--') ? JSON.stringify(k) : camel(k)}: ${JSON.stringify(val)}`;
  });
  return `{{ ${parts.join(', ')} }}`;
}
function jsx(n, depth) {
  const pad = '  '.repeat(depth);
  const attrs = Array.from(n.attributes).filter(a => a.name !== 'xmlns').map(a =>
    a.name === 'style' ? `style=${styleObj(a.value)}` : `${attrName(a.name)}=${JSON.stringify(a.value)}`).join(' ');
  const cs = kids(n);
  const open = `${n.tagName}${attrs ? ' ' + attrs : ''}`;
  if (!cs.length) return `${pad}<${open} />`;
  return `${pad}<${open}>\n${cs.map(c => jsx(c, depth + 1)).join('\n')}\n${pad}</${n.tagName}>`;
}

const body = [
  `    <defs>`,
  ...[...defs.entries()].filter(([id]) => keepDefs.has(id)).map(([, d]) => jsx(d, 3)),
  `    </defs>`,
  ...KEEP.filter(id => symbols.has(id)).map(id => jsx(symbols.get(id), 2)),
].join('\n');

const ids = KEEP.filter(id => symbols.has(id));
// which jointed build (cast/Rig.tsx) walks / runs each body: data-rig on the symbol, else the shared body it uses
const BODY_BUILD = { 'legs-pants': 'pants', 'body-wide': 'wide', 'body-skirt': 'skirt', 'body-kid': 'kid' };
const build = Object.fromEntries(ids.flatMap(id => {
  const s = symbols.get(id);
  const own = s.getAttribute('data-rig');
  if (own) return [[id, own]];
  const used = kids(s).filter(c => c.tagName === 'use').map(c => (c.getAttribute('href') || c.getAttribute('xlink:href') || '').slice(1));
  const b = used.map(u => BODY_BUILD[u]).find(Boolean);
  return b ? [[id, b]] : [];
}));
const vb = Object.fromEntries(ids.map(id => [id, (symbols.get(id).getAttribute('viewBox') || '0 0 200 520').trim().split(/\s+/).slice(2).map(Number)]));

// Pose rig parts (cast/Pose.tsx): a person's skull, hair, back hair and arm marks (tattoos, bracelets) as symbols of
// their own, `<id>--skull` `<id>--hair` `<id>--backhair` `<id>--marks-l|r`, so the rig can turn the head (skull, hair and
// face slide apart) and carry the marks on a jointed forearm. Found by walking the symbol through its <use>s:
// skull = <use href="#head-bare"> or a display:var(--skull-rest) group; hair / back hair = the --hair-rest /
// --backhair-rest group; marks = --arm-l/r-rest groups drawn in the symbol itself on top of a shared arm.
const hrefOf = n => (n.getAttribute('href') || n.getAttribute('xlink:href') || '').slice(1);
const styleHas = (n, v) => (n.getAttribute('style') || '').includes(v);
const SHARED_ARMS = new Set(['arm-l-down', 'arm-r-down', 'arm-l-short', 'arm-r-short', 'body-wide', 'body-wide-short', 'body-skirt', 'body-kid']);
const partSyms = [];
const parts = {};
for (const id of ids) {
  if (!build[id]) continue;
  const found = {skull: [], hair: [], backhair: []}; const marks = {l: [], r: []}; const used = new Set();
  const visit = (n, tf, inDef) => {
    for (const c of kids(n)) {
      const t = c.getAttribute('transform'); const tf2 = t ? [...tf, t] : tf;
      if (c.tagName === 'use') {
        const r = hrefOf(c); used.add(r);
        if (r === 'head-bare') found.skull.push({ref: r, tf: tf2});
        else if (r === 'ears') found.ears = true;
        else if (defs.has(r)) visit(defs.get(r), tf2, true);
        else if (symbols.has(r)) visit(symbols.get(r), tf2, true);
        continue;
      }
      // a part keeps its own group (fill, stroke, transform); `tf` = the transforms of the groups around it
      const side = styleHas(c, '--arm-l-rest') ? 'l' : styleHas(c, '--arm-r-rest') ? 'r' : '';
      if (styleHas(c, '--skull-rest')) found.skull.push({node: c, tf});
      else if (styleHas(c, '--hair-rest')) found.hair.push({node: c, tf});
      else if (styleHas(c, '--backhair-rest')) found.backhair.push({node: c, tf});
      else if (side) { if (!inDef) marks[side].push({node: c, tf}); }
      else visit(c, tf2, inDef);
    }
  };
  visit(symbols.get(id), [], false);
  if (!found.skull.length) continue;
  const [w, h] = vb[id];
  const emit = (name, list) => {
    const body = list.map(({node, ref, tf}) => {
      let inner = `<use href="#${ref}" />`;
      if (node) { const g = node.cloneNode(true); g.removeAttribute('style'); inner = jsx(g, 4); }
      return tf.length ? `<g transform=${JSON.stringify(tf.join(' '))}>\n${inner}\n</g>` : inner;
    }).join('\n');
    partSyms.push(`    <symbol id="${id}--${name}" viewBox="0 0 ${w} ${h}" overflow="visible">\n${body}\n    </symbol>`);
  };
  const p = {};
  for (const k of ['skull', 'hair', 'backhair']) if (found[k].length) { emit(k, found[k]); p[k] = 1; }
  if (found.ears) p.ears = 1;
  const shared = [...used].some(u => SHARED_ARMS.has(u));
  const ms = [];
  for (const s of ['l', 'r']) if (shared && marks[s].length) { emit(`marks-${s}`, marks[s]); ms.push(s); }
  if (ms.length) p.marks = ms;
  if ([...used].some(u => /^(arm-[lr]|body-[a-z]+)-short$/.test(u))) p.short = 1;
  parts[id] = p;
}
fs.writeFileSync(OUT, `// GENERATED by scripts/svg-to-tsx.mjs from ${SRC} — edit the keep list there, not this file.
import React from 'react';

export const CAST_IDS = ${JSON.stringify(ids)} as const;
export const CAST_SIZE: Record<string, [number, number]> = ${JSON.stringify(vb)};
/** symbols without a viewBox are drawn around (0,0) (props held in a hand): Sprite frames them as -90 -90 180 180 */
export const CAST_ANCHORED: readonly string[] = ${JSON.stringify(ids.filter(id => !symbols.get(id).getAttribute('viewBox')))};
export type CastId = (typeof CAST_IDS)[number];
/** the jointed build each body walks / runs with (cast/Rig.tsx) */
export const CAST_BUILD: Record<string, 'pants' | 'wide' | 'skirt' | 'kid' | 'robe'> = ${JSON.stringify(build)};
/** pose-rig parts per person (cast/Pose.tsx): which <id>--skull / --hair / --backhair / --marks-l|r symbols exist,
 *  whether the head has the shared ears, and short sleeves */
export const CAST_PARTS: Record<string, {skull?: 1; hair?: 1; backhair?: 1; ears?: 1; short?: 1; marks?: ('l' | 'r')[]}> = ${JSON.stringify(parts)};

/** Mount once at the top of a composition; <Sprite id="man"/> then references these symbols. */
export const CastSprite: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
${body}
${partSyms.join('\n')}
  </svg>
);
`);
console.log(`wrote ${OUT}: ${ids.length} symbols, ${keepDefs.size} shared defs, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
