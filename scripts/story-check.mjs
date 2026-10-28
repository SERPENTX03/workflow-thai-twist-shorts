// Offline story.json preflight (no network, no credits). Catches script problems before voice/render.
//   node scripts/story-check.mjs episodes/<slug>        (npm run story -- episodes/<slug>)
// Errors (exit 1): schema, unknown cue/role, cue outside its shot, character line without role.
// Warnings: runtime vs channel target, caption length, estimated voice overrun, cue density, missing scene files.
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory, plain, sfxFile } from './lib.mjs';

const CUES = new Set(['hit', 'bighit', 'stamp', 'scratch', 'creak', 'scrape', 'step', 'shriek', 'whoosh', 'bell', 'flip', 'tick']);
const CHARS_PER_SEC = 9;   // median Thai narration rate measured on boat-10-days (range 5–12)
const TAIL = 0.15;

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
const TARGET = S.target;   // per format (lib.mjs FORMATS): portrait = brand/channel.md pilot 55–80 s, landscape = long-form 600–720 s
const HOLD = S.format === 'landscape' ? 12 : 6;   // beats before a shot counts as a long hold
const errors = [], warns = [];
const err = (i, m) => errors.push(i === null ? m : `shot ${i}: ${m}`);
const warn = (i, m) => warns.push(i === null ? m : `shot ${i}: ${m}`);

const roles = S.voices || {};
const thaiLen = t => [...String(t).replace(/[\sัิ-ฺ็-๎.,!?…"“”'-]/g, '')].length;

if (S.total < TARGET[0] || S.total > TARGET[1]) warn(null, `runtime ${S.total.toFixed(1)}s is outside the ${TARGET[0]}–${TARGET[1]}s target`);
if (S.voice && !roles[S.voice] && !/^(eleven|gemini):|^[a-z]{2}-[A-Z]{2}-/.test(S.voice)) err(null, `default voice "${S.voice}" is neither a role nor a voice id`);
if (Object.values(roles).some(v => !/^(eleven|gemini):/.test(v))) warn(null, 'voices map has an entry without eleven:/gemini: prefix');

const sfxDefs = S.sfx || {};
for (const [name, e] of Object.entries(sfxDefs)) {
  if (CUES.has(name)) err(null, `sfx "${name}" shadows a built-in cue name`);
  if (!e.prompt || !String(e.prompt).trim()) err(null, `sfx "${name}" has no prompt`);
  if (!(e.dur >= 0.5 && e.dur <= 30) && e.dur !== undefined) err(null, `sfx "${name}": dur must be 0.5–30s`);
  if (e.prompt && !fs.existsSync(sfxFile(e))) warn(null, `sfx "${name}" not generated — run npm run sfx -- episodes/<slug> (dry run first), then --yes`);
}
const brandVoices = path.resolve('brand/voices.md');
if (fs.existsSync(brandVoices)) {
  const cast = fs.readFileSync(brandVoices, 'utf8');
  for (const [r, id] of Object.entries(roles)) if (!cast.includes(String(id).replace(/^eleven:/, '')))
    warn(null, `role "${r}" uses ${id}, which is not in brand/voices.md (new episodes must copy that map)`);
}

const idxFile = path.join(dir, 'assets', 'vo', 'index.json');
const hasVoice = fs.existsSync(idxFile);
let bigs = 0, hardKinds = new Set();
S.shots.forEach(s => {
  const i = s.i;
  const lines = plain(s.text).split('\n');
  if (lines.length > 2) warn(i, `caption has ${lines.length} lines (max 2)`);
  if (lines.some(l => thaiLen(l) > S.capChars)) warn(i, `caption line over ~${S.capChars} characters may wrap: "${lines.find(l => thaiLen(l) > S.capChars)}"`);
  if (s.beats > HOLD) warn(i, `${s.beats} beats (${s.dur}s) — long hold; confirm it is a deliberate inspection beat`);
  if (s.voice && !roles[s.voice] && !/^(eleven|gemini):|^[a-z]{2}-[A-Z]{2}-/.test(s.voice)) err(i, `unknown voice role "${s.voice}" (roles: ${Object.keys(roles).join(', ') || 'none'})`);
  if (s.fx && !['phone', 'muffled'].includes(s.fx)) err(i, `unknown voice fx "${s.fx}" (phone, muffled)`);
  if (s.mood < 0 || s.mood > 1) err(i, `mood ${s.mood} outside 0–1`);
  if (s.voLead < 0 || s.voLead >= s.dur) err(i, `voLead ${s.voLead} outside the shot`);

  if (s.vo) {
    // character-count estimate is only for the pre-voice draft; once assets/vo/index.json exists the real durations are used below
    const need = thaiLen(s.vo) / CHARS_PER_SEC, room = s.dur - s.voLead - TAIL;
    if (!hasVoice && need > room * 1.3) warn(i, `voice likely OVER: ~${need.toFixed(1)}s of speech in ${room.toFixed(1)}s (1.3× limit ${(room * 1.3).toFixed(1)}s) — shorten or add beats`);
    if (/[“”"]/.test(s.text) && !s.voice) warn(i, 'quoted speech with no "voice" role — fine for Milo/narrator (both `male`), a bug for any other speaker');
  }
  for (const c of s.cues) {
    const [beat, type] = c;
    if (!CUES.has(type) && !sfxDefs[type]) err(i, `unknown cue "${type}" (built-ins, or declare it in story.json sfx)`);
    if (typeof beat !== 'number' || beat < 0 || beat >= s.beats) err(i, `cue "${type}" at beat ${beat} falls outside the ${s.beats}-beat shot`);
    if (type === 'bighit') bigs++;
    if (type === 'hit' || type === 'bighit') hardKinds.add(i);
  }
});

if (bigs === 0) warn(null, 'no bighit — the reveal has no impact cue (optional, but audio.md expects one per film)');
if (bigs > 1) warn(null, `${bigs} bighits — audio.md says one per film, on the reveal`);
const hitShots = [...hardKinds].sort((a, b) => a - b);
for (let k = 1; k < hitShots.length; k++) if (hitShots[k] - hitShots[k - 1] === 1) warn(hitShots[k], 'hit on consecutive shots — use hits at most every other shot');

const scenesDir = path.join(dir, 'compositions');
for (const sc of new Set(S.shots.map(s => s.scene))) {
  if (!fs.existsSync(path.join(scenesDir, `scene-${sc}.html`))) warn(null, `scene "${sc}" has no compositions/scene-${sc}.html — will render as placeholder`);
}

// actual voice durations, when audio has already been generated
if (hasVoice) {
  for (const v of JSON.parse(fs.readFileSync(idxFile, 'utf8'))) {
    const s = S.shots[v.shot];
    if (!s) { warn(null, `assets/vo/index.json lists shot ${v.shot}, which no longer exists — regenerate audio`); continue; }
    if (v.start + v.dur > s.start + s.dur - 0.05) warn(v.shot, `generated voice ends ${(v.start + v.dur - (s.start + s.dur)).toFixed(2)}s past the cut`);
    if (v.tempo > 1.15) warn(v.shot, `voice sped up ×${v.tempo} — rushed read`);
  }
}

const brief = path.join(dir, 'brief.md');
if (!fs.existsSync(brief)) warn(null, 'no brief.md — copy brand/episode-brief.md and fill the speaker table and preflight gate');

console.log(`${path.basename(dir)}: ${S.shots.length} shots, ${S.total.toFixed(1)}s, ${S.totalBeats} beats @ ${S.bpm} BPM`);
for (const e of errors) console.log('✖ ' + e);
for (const w of warns) console.log('⚠ ' + w);
if (!errors.length && !warns.length) console.log('✓ clean');
else console.log(`\n${errors.length} error(s), ${warns.length} warning(s). This is a script gate only — also work through references/story-rules.md (pillar, evidence, Milo's choice).`);
process.exit(errors.length ? 1 : 0);
