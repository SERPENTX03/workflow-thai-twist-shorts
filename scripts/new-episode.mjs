// Create episodes/<slug> from template/.
//   node scripts/new-episode.mjs <slug> ["ชื่อเรื่อง"]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { die } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const title = process.argv[3];
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) die('usage: node scripts/new-episode.mjs <slug-in-latin-kebab-case> ["ชื่อเรื่อง"]');
const dest = path.join(ROOT, 'episodes', slug);
if (fs.existsSync(path.join(dest, 'story.json'))) die(`episodes/${slug} already exists`);

const SKIP = new Set(['node_modules', '.hyperframes', 'renders', 'timing.json', 'index.html']);
fs.cpSync(path.join(ROOT, 'template'), dest, {
  recursive: true,
  filter: src => !SKIP.has(path.basename(src)) && !/assets[\\/](vo|voice\.wav|score\.wav)/.test(src),
});

const story = JSON.parse(fs.readFileSync(path.join(dest, 'story.json'), 'utf8'));
if (title) story.title = title;
fs.writeFileSync(path.join(dest, 'story.json'), JSON.stringify(story, null, 2) + '\n');
for (const f of ['meta.json', 'package.json']) {
  const p = path.join(dest, f), j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.name = slug;
  if (f === 'meta.json') { j.id = slug; delete j.createdAt; }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}
console.log(`✓ episodes/${slug}`);
console.log('  next: write story.json, then  npm run build -- episodes/' + slug);
