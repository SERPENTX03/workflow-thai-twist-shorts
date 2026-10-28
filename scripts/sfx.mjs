// Hard-to-synthesize sound effects via ElevenLabs, behind an approval gate.
//   node scripts/sfx.mjs episodes/<slug>          dry run: lists what is cached and what would be generated (no network, no credits)
//   node scripts/sfx.mjs episodes/<slug> --yes    generate only the missing ones, once, into sfx-library/
// story.json declares them in a top-level `sfx` map and cues reference them by name:
//   "sfx": { "boat-engine": { "prompt": "small outboard boat engine idling on calm sea", "dur": 6, "influence": 0.5, "gain": 0.7 } }
//   { "cues": [[0, "boat-engine"]] }
// Entries are cached by (prompt, dur, influence); changing any of them is a new, paid generation. gain only affects the mix.
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory, die, sfxSpec, sfxKey, sfxFile, SFX_LIB } from './lib.mjs';
import { elevenSFX } from './eleven_tts.mjs';

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const yes = process.argv.includes('--yes');
const entries = Object.entries(S.sfx || {});
if (!entries.length) { console.log('story.json has no `sfx` entries — nothing to do.'); process.exit(0); }

const used = new Set(S.shots.flatMap(s => s.cues.map(c => c[1])));
const todo = [];
for (const [name, e] of entries) {
  const sp = sfxSpec(e);
  if (!sp.prompt) die(`sfx "${name}" has no prompt`);
  if (!(sp.dur >= 0.5 && sp.dur <= 30)) die(`sfx "${name}": dur must be 0.5–30 seconds (got ${sp.dur})`);
  const have = fs.existsSync(sfxFile(e));
  console.log(`${have ? '✓ cached' : '• missing'}  ${name.padEnd(18)} ${String(sp.dur).padStart(4)}s  ${used.has(name) ? '' : '(not used by any cue) '}${sp.prompt}`);
  if (!have) todo.push([name, e]);
}
if (!todo.length) { console.log('\nAll sound effects are cached. Run npm run audio to mix them.'); process.exit(0); }

const secs = todo.reduce((a, [, e]) => a + sfxSpec(e).dur, 0);
if (!yes) {
  console.log(`\nDRY RUN: ${todo.length} effect(s), ${secs}s of audio would be generated and billed to your ElevenLabs plan.`);
  console.log('Listen-test one first if unsure. Approve with:  npm run sfx -- ' + path.relative(process.cwd(), dir) + ' --yes');
  process.exit(0);
}

fs.mkdirSync(SFX_LIB, { recursive: true });
const idxFile = path.join(SFX_LIB, 'index.json');
const idx = fs.existsSync(idxFile) ? JSON.parse(fs.readFileSync(idxFile, 'utf8')) : {};
for (const [name, e] of todo) {
  const sp = sfxSpec(e);
  try { await elevenSFX({ text: sp.prompt, durationSeconds: sp.dur, promptInfluence: sp.influence, out: sfxFile(e) }); }
  catch (err) { die(`sfx "${name}": ${err.message}`); }
  idx[sfxKey(e)] = { name, ...sp, episode: path.basename(dir) };
  fs.writeFileSync(idxFile, JSON.stringify(idx, null, 1));
  console.log(`✓ generated ${name} -> sfx-library/${sfxKey(e)}.mp3`);
}
console.log('\nListen to the files before approving the mix, then run npm run audio -- ' + path.relative(process.cwd(), dir));
