// Create episodes/<slug>/story.json from templates/story.json and register it with Remotion.
//   node scripts/new-episode.mjs <slug> ["ชื่อเรื่อง"]
import fs from 'node:fs';
import path from 'node:path';
import { die, ROOT, writeRegistry, compId } from './lib.mjs';

const slug = process.argv[2];
const title = process.argv[3];
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) die('usage: node scripts/new-episode.mjs <slug-in-latin-kebab-case> ["ชื่อเรื่อง"]');
const dest = path.join(ROOT, 'episodes', slug);
if (fs.existsSync(path.join(dest, 'story.json'))) die(`episodes/${slug} already exists`);

fs.mkdirSync(path.join(dest, 'assets'), { recursive: true });
const story = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates', 'story.json'), 'utf8'));
if (title) story.title = title;
fs.writeFileSync(path.join(dest, 'story.json'), JSON.stringify(story, null, 2) + '\n');
writeRegistry();
console.log(`✓ episodes/${slug}  (composition ${compId(slug)}, board ${compId(slug)}Board)`);
console.log(`  next: write story.json, then  npm run check -- episodes/${slug}`);
