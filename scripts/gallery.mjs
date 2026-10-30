// Studio gallery: renders the cast / faces / props / sets stills with Remotion and writes studio/manifest.js.
//   npm run gallery [-- --no-render]      then open studio/index.html via  npm run studio:gallery  (port 3431)
import fs from 'node:fs';
import path from 'node:path';
import { npx, ROOT, compId, loadStory } from './lib.mjs';

const OUT = path.join(ROOT, 'studio');
const STILLS = [['Cast', 'ตัวละคร'], ['Faces', 'สีหน้า'], ['Props', 'Props / ไอคอน / เครื่องหมาย'], ['Sets', 'ฉาก / ท่าทาง']];
fs.mkdirSync(path.join(OUT, 'renders'), { recursive: true });

if (!process.argv.includes('--no-render')) {
  for (const [id] of STILLS) {
    const r = npx(['remotion', 'still', 'src/index.ts', id, `studio/renders/${id}.png`], { cwd: ROOT, stdio: 'inherit' });
    if (r.status) { console.error(`✖ still ${id} failed`); process.exit(1); }
  }
}

const episodes = fs.readdirSync(path.join(ROOT, 'episodes'), { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(ROOT, 'episodes', d.name, 'story.json')))
  .map(d => {
    const S = loadStory(path.join(ROOT, 'episodes', d.name));
    return { slug: d.name, id: compId(d.name), title: S.title, format: S.format, shots: S.shots.length, seconds: Math.round(S.total) };
  });

const sfxIdx = path.join(ROOT, 'sfx-library', 'index.json');
const sfx = fs.existsSync(sfxIdx)
  ? Object.entries(JSON.parse(fs.readFileSync(sfxIdx, 'utf8'))).map(([key, v]) => ({ key, file: `../sfx-library/${key}.mp3`, name: v.name, prompt: v.prompt, dur: v.dur }))
  : [];

fs.writeFileSync(path.join(OUT, 'manifest.js'), 'window.STUDIO = ' + JSON.stringify({ stills: STILLS.map(([id, label]) => ({ id, label, src: `renders/${id}.png` })), episodes, sfx }, null, 1) + ';\n');
console.log(`✓ studio/manifest.js  ${STILLS.length} stills, ${episodes.length} episodes, ${sfx.length} sfx`);
