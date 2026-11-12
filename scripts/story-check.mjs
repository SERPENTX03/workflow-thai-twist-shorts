// Offline story.json preflight (no network, no credits). Catches script problems before voice/render.
//   node scripts/story-check.mjs episodes/<slug>        (npm run story -- episodes/<slug>)
// Errors (exit 1): schema, unknown cue/role, cue outside its shot, character line without role.
// Warnings: runtime vs channel target, caption length, estimated voice overrun, cue density, missing scene files.
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory, plain, sfxFile, ROOT, deadAir, DEAD_AIR } from './lib.mjs';

const CUES = new Set(['hit', 'bighit', 'stamp', 'scratch', 'creak', 'scrape', 'step', 'shriek', 'whoosh', 'bell', 'flip', 'tick']);
const CHARS_PER_SEC = 9;   // median Thai narration rate measured on boat-10-days (range 5–12)
const TAIL = 0.15;

// Staging vocabulary, read from the source of truth so the lint never drifts from the renderer
const setOf = (src, name) => new Set([...(src.match(new RegExp(`const ${name} = new Set\\(\\[([^\\]]*)\\]`))?.[1] ?? '').matchAll(/'([^']+)'/g)].map(m => m[1]));
const stageSrc = fs.readFileSync(path.join(ROOT, 'src', 'kit', 'stage.tsx'), 'utf8');
const STAGE = {
  poses: setOf(stageSrc, 'POSES'),
  faces: setOf(stageSrc, 'FACES'),
  faceMarks: new Set([...(stageSrc.match(/const FACE_MARK[^=]*=\s*\{([^}]*)\}/)?.[1] ?? '').matchAll(/(\w+):/g)].map(m => m[1])),
};
const castSpriteSrc = fs.readFileSync(path.join(ROOT, 'src', 'cast', 'CastSprite.tsx'), 'utf8');
const CAST_IDS = new Set([...(castSpriteSrc.match(/CAST_IDS = \[([^\]]*)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map(m => m[1]));
// pose rig words (src/cast/Pose.tsx): arm presets are the keys of ANCHOR_R
const poseSrc = fs.readFileSync(path.join(ROOT, 'src', 'cast', 'Pose.tsx'), 'utf8');
const ARM_PRESETS = new Set([...[...(poseSrc.match(/const ANCHOR_R[^=]*=\s*\{([\s\S]*?)\};/)?.[1] ?? '').matchAll(/(\w+):\s*\[/g)].map(m => m[1]), 'rest', 'none']);
const RIG_KEYS = new Set(['yaw', 'armL', 'armR', 'head', 'look']);
const num = v => v !== '' && Number.isFinite(+v);
/** a rig value, maybe tweened: "0.4", "0>0.5", "rest>wave@6-20" → the problem with it, or '' */
function rigProblem(k, v) {
  const [vals, win] = v.split('@');
  if (win !== undefined && !/^\d+-\d+$/.test(win)) return `"@${win}" should be frames "from-to" (e.g. @6-20)`;
  for (const x of vals.split('>')) {
    if (k === 'armL' || k === 'armR') {
      const [a, b, h] = x.split(',');
      if (!ARM_PRESETS.has(x) && !(num(a) && (b === undefined || num(b)) && (h === undefined || h === 'nohand')))
        return `"${x}" is not an arm: use "a,b" degrees or a preset (${[...ARM_PRESETS].join(' ')})`;
    } else if (!num(x)) return `"${x}" is not a number`;
    else if ((k === 'yaw' || k === 'look') && Math.abs(+x) > 1) return `${k} runs −1 … 1`;
  }
  return '';
}
/** poses whose body has no standing shoulders for a pose arm to attach to (keep in step with ActorView's NO_POSE_ARMS) */
const NO_POSE_ARMS = new Set([]);

const dir = episodeDir(process.argv[2]);
const S = loadStory(dir);
// loadStory keeps timing fields only; staging (data.cast) is read from the file itself
const RAW_SHOTS = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8')).shots;
const TARGET = S.target;   // story.json "target", else the Shorts "family", else the format's range (lib.mjs FORMATS / FAMILIES)
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
  if (S.captionMode === 'phrase' && s.style !== 'red') {
    // phrase captions split at spaces, then at Thai word boundaries (src/engine/phrases.ts); a space where the voice
    // breathes gives a better cut than the word splitter, so very long runs are flagged
    const PH = S.phraseChars ?? 22;
    const run = plain(s.text).split(/\s+/).find(w => thaiLen(w) > PH * 1.6);
    if (run) warn(i, `phrase captions: "${run}" (${thaiLen(run)} chars) has no space — it will be cut at a word boundary; a space where the voice breathes cuts better`);
  } else if (lines.some(l => thaiLen(l) > S.capChars)) warn(i, `caption line over ~${S.capChars} characters may wrap: "${lines.find(l => thaiLen(l) > S.capChars)}"`);
  if (s.beats > HOLD) warn(i, `${s.beats} beats (${s.dur}s) — long hold; confirm it is a deliberate inspection beat`);
  if (s.voice && !roles[s.voice] && !/^(eleven|gemini):|^[a-z]{2}-[A-Z]{2}-/.test(s.voice)) err(i, `unknown voice role "${s.voice}" (roles: ${Object.keys(roles).join(', ') || 'none'})`);
  if (s.fx && !['phone', 'muffled'].includes(s.fx)) err(i, `unknown voice fx "${s.fx}" (phone, muffled)`);
  if (s.mood < 0 || s.mood > 1) err(i, `mood ${s.mood} outside 0–1`);
  if (s.voLead < 0 || s.voLead >= s.dur) err(i, `voLead ${s.voLead} outside the shot`);

  if (s.vo) {
    // character-count estimate is only for the pre-voice draft; once assets/vo/index.json exists the real durations are used below
    const need = thaiLen(s.vo) / CHARS_PER_SEC, room = s.dur - s.voLead - TAIL;
    if (!hasVoice && need > room * 1.3) warn(i, `voice likely OVER: ~${need.toFixed(1)}s of speech in ${room.toFixed(1)}s (1.3× limit ${(room * 1.3).toFixed(1)}s) — shorten or add beats`);
    if (/[“”"]/.test(s.text) && !s.voice) warn(i, 'quoted speech with no "voice" role — fine when the narrator quotes someone, a bug when a character speaks the line (add "voice" and "who")');
  }
  // talk mouths belong to the speaker only (CLAUDE.md): a listener or the near end of a phone call must not mouth someone else's line
  for (const a of RAW_SHOTS[i]?.data?.cast ?? []) {
    if (!/\btalk\b/.test(a)) continue;
    const who = String(a).split('@')[0];
    if (!s.who) warn(i, `"${who}" has talk on a narrated line — only the speaker's mouth moves; drop talk or set "who"`);
    else if (who !== s.who && who.replace(/\d+$/, '') !== s.who) warn(i, `"${who}" has talk but the line is ${s.who}'s — only the speaker's mouth moves; give ${who} a listening face instead`);
  }

  // A walker or runner must say how it moves: data.move [x0, x1] (kit Actors travels them) or data.motion ("walk"...) when the
  // scene moves them itself. Undeclared, the figure may cycle its legs on the spot (dont-open-curtain shot 14). npm run motion checks the declared ones.
  if ((RAW_SHOTS[i]?.data?.cast ?? []).some(a => String(a).split(/\s+/).some(w => w === 'walk' || w === 'run')) && !RAW_SHOTS[i]?.data?.move && !RAW_SHOTS[i]?.data?.motion)
    warn(i, 'walk / run with no data.move and no data.motion: declare how the figure travels, or it may run on the spot (npm run motion checks it)');

  // Staging vocabulary + pose-library gaps (hands-poses.md rule 10): every word in an actor string must exist.
  // An unknown word is silently dropped by parseActor, and an arm drawn for a standing body floats over a crouching one,
  // so the shot "works" but shows the wrong thing. Report the gap here instead; then draw the missing piece in cast.svg.
  for (const a of RAW_SHOTS[i]?.data?.cast ?? []) {
    const [head, ...words] = String(a).trim().split(/\s+/);
    const who = head.split('@')[0];
    const pose = words.find(w => STAGE.poses.has(w)) ?? 'stand';
    for (const w of words) {
      const [k, v] = w.split('=');
      if (v === undefined) {
        if (!STAGE.poses.has(w) && !STAGE.faces.has(w) && !STAGE.faceMarks.has(w) && !['talk', 'flip'].includes(w))
          err(i, `"${who}": unknown word "${w}" — not a pose, face or flag, so it is ignored. Pick from the library (poses: ${[...STAGE.poses].join(' ')}) or draw the missing one in src/cast/source/cast.svg and list it in hands-poses.md / cast-library.md`);
      } else if (RIG_KEYS.has(k)) {
        const why = rigProblem(k, v);
        if (why) err(i, `"${who}": ${k}=${v} — ${why} (cast-library.md → pose rig)`);
        else if (!['stand', 'sit', 'crouch', 'lie'].includes(pose)) warn(i, `"${who}": ${k}= is ignored on a "${pose}" body — the pose rig turns and poses standing people only`);
        else if (k === 'yaw' && v.split('@')[0].split('>').some(x => Math.abs(+x) > 0.7)) warn(i, `"${who}": yaw=${v} — past ±0.7 the front-view face slides off the skull; use back, a silhouette or a cut instead`);
      } else if (k === 'faces') {
        for (const key of v.split(',')) {
          const [face, at] = key.split('@');
          if (face !== 'own' && !STAGE.faces.has(face)) err(i, `"${who}": faces=${v} — "${face}" is not a face (${[...STAGE.faces].join(' ')}, or own)`);
          if (at !== undefined && !/^\d+$/.test(at)) err(i, `"${who}": faces=${v} — "@${at}" should be a frame number`);
        }
      } else if (k === 'prop' && v.includes('@')) {
        const [id, at] = v.split('@');
        if (!CAST_IDS.has(`prop-${id}`)) err(i, `"${who}": prop=${id} is not in the library (no "prop-${id}" symbol)`);
        if (!['l', 'r'].includes(at)) err(i, `"${who}": prop=${v} — the hand is @l or @r`);
        if (!words.some(w => RIG_KEYS.has(w.split('=')[0]))) err(i, `"${who}": prop=${v} — @l / @r picks a hand on the pose rig only; add armL= / armR=, or use arm=l-hold prop=${id}`);
      } else if (['arm', 'prop', 'acc', 'mark'].includes(k) && !(k === 'acc' && v === 'none') && !CAST_IDS.has(`${k}-${v}`)) {
        err(i, `"${who}": ${k}=${v} is not in the library (no "${k}-${v}" symbol) — ASSET GAP: draw it in src/cast/source/cast.svg (right + mirrored left), add it to hands-poses.md, then npm run timeline; do not substitute another pose`);
      }
    }
    if (words.some(w => w.startsWith('arm=') || w.startsWith('prop=')) && NO_POSE_ARMS.has(pose))
      err(i, `"${who}": arm=/prop= on a "${pose}" body — pose arms are drawn for a standing body and float over the head here (cast-library.md). Stand the actor up, or cut to a hand insert`);
  }

  // Continuity & Staging checks: catch vanishing actors, teleporting actors, and unframed close-ups
  const currCast = (RAW_SHOTS[i]?.data?.cast ?? []).map(a => {
    const [head] = String(a).trim().split(/\s+/);
    const [who, pos] = head.split('@');
    const [x] = (pos ?? '960').split(',').map(Number);
    return {who, x: Number.isFinite(x) ? x : 960};
  });
  const prevShot = i > 0 ? S.shots[i - 1] : null;
  const prevCast = i > 0 ? (RAW_SHOTS[i - 1]?.data?.cast ?? []).map(a => {
    const [head] = String(a).trim().split(/\s+/);
    const [who, pos] = head.split('@');
    const [x] = (pos ?? '960').split(',').map(Number);
    return {who, x: Number.isFinite(x) ? x : 960};
  }) : [];

  const isStagedScene = s.scene && !['hand', 'phone', 'clock', 'rule', 'news', 'map', 'next'].includes(s.scene);
  if (prevShot && prevShot.scene === s.scene && isStagedScene) {
    // A cut to one person, a hand or an object is coverage, not a continuity error (directing.md §2
    // "ไม่ต้องเห็นทุกคนทุกช็อต"). Only the SAME view with a person missing or moved is a jump.
    if (s.view === prevShot.view && !RAW_SHOTS[i]?.data?.move && !RAW_SHOTS[i - 1]?.data?.move && currCast.length > 0)
      for (const pa of prevCast) if (!currCast.some(c => c.who === pa.who))
        warn(i, `actor "${pa.who}" is gone from "${s.scene}:${s.view}" though the camera did not move since shot ${i - 1} — keep them, or change the view (a real close-up, an insert)`);
    for (const ca of currCast) {
      const pa = prevCast.find(p => p.who === ca.who);
      if (pa && Math.abs(pa.x - ca.x) > 100 && !RAW_SHOTS[i]?.data?.move && !RAW_SHOTS[i - 1]?.data?.move && s.view === prevShot.view) {
        warn(i, `actor "${ca.who}" jumped position from x=${pa.x} to x=${ca.x} in consecutive shots of "${s.scene}:${s.view}" — keep positions consistent`);
      }
    }
  }

  if ((s.view?.endsWith('-close') || s.view === 'close') && !RAW_SHOTS[i]?.data?.cam) {
    const isInsert = ['hand', 'phone', 'clock', 'store'].includes(s.scene);
    if (!isInsert) {
      warn(i, `view "${s.view}" suggests a close-up, but "data.cam" is missing (add data.cam or use camera presets so camera zooms in)`);
    }
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

// a hand or arm drawn beside an actor is a third arm: the actor already has two (hands-poses.md rules 1–2)
{
  const epDir = path.join(ROOT, 'src', 'episodes', path.basename(dir));
  for (const file of fs.existsSync(epDir) ? fs.readdirSync(epDir).filter(n => n.endsWith('.tsx')) : []) {
    for (const block of fs.readFileSync(path.join(epDir, file), 'utf8').split(/^(?=(?:export )?const \w+)/m)) {
      const together = block.split(/^\s*if \(/m).some(b => /<(Actors|JayBike|ActorView|Motorcycle)\b/.test(b) && /<Hand\b/.test(b));
      if (!together) continue;
      warn(null, `${file} ${block.match(/const (\w+)/)?.[1] ?? ''}: draws <Hand> next to an actor. Three hands? Pose the actor's own arm instead (arm=r-phone, armR=…), which takes the resting arm away`);
    }
  }
}
// Clue ledger (story-json.md → Clues): the brief's clue table as data, so the plantings are counted by the machine and
// the shot numbers cannot drift. Top level `clues: {id: {label, cover, decoy?}}`; a shot plants with `"clue": "id"`
// (or a list) and pays off with `"pay": "id"`. Rules: story-rules.md → Planting clues / Hiding the twist,
// longform-rules.md → Clues and continuity / Concealment.
const ledger = [];
{
  const RAW_STORY = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
  const defs = RAW_STORY.clues ?? {};
  const list = v => (v === undefined ? [] : Array.isArray(v) ? v : [v]).map(String);
  const chapterOf = i => S.chapters.findIndex(c => i >= c.first && i <= c.last);
  const isInsert = s => /(^|-)(ins|ecu)(-|$)/.test(s.view ?? '') || /^(hand|hands|insert|inserts|ins|photo|page|note|clock)$/i.test(s.scene);
  const plants = {}, pays = {};
  RAW_SHOTS.forEach((r, i) => {
    for (const id of list(r.clue)) (plants[id] ??= []).push(i);
    for (const id of list(r.pay)) (pays[id] ??= []).push(i);
  });
  const used = new Set([...Object.keys(plants), ...Object.keys(pays)]);
  for (const id of used) if (!defs[id]) err(null, `clue "${id}" is tagged on shot ${(plants[id] ?? pays[id])[0]} but not declared in the top-level "clues" (a typo, or add {"label", "cover"})`);
  const landscape = S.format === 'landscape';
  if (!Object.keys(defs).length && !used.size) {
    warn(null, 'no clue tags: declare "clues" at the top and tag the shots that plant ("clue") and pay off ("pay") each one, so the 3 plantings are counted here and not by hand (story-json.md → Clues)');
  } else {
    for (const [id, c] of Object.entries(defs)) {
      const pay = (pays[id] ?? [])[0];
      const before = (plants[id] ?? []).filter(i => pay === undefined || i < pay);
      const name = c.decoy ? `decoy "${id}"` : `clue "${id}"`;
      if (!before.length) warn(null, `${name} is declared but no shot plants it`);
      else {
        if (!c.decoy && before.length < 3) warn(before[0], `${name} is planted ${before.length}× before its pay-off (shots ${before.join(' ')}): the viewer needs to have seen it 3 times`);
        if (!c.decoy && landscape && new Set(before.map(chapterOf)).size < 2) warn(before[0], `${name} is planted in one chapter only (shots ${before.join(' ')}): spread it over at least two acts`);
        if (!c.decoy && before.length >= 2 && before.every(i => isInsert(S.shots[i]))) warn(before[0], `${name}: every planting is its own insert (shots ${before.join(' ')}): plant it once in passing, inside a shot about something else`);
      }
      if (pay === undefined) warn(null, c.decoy ? `${name} is never explained ("pay"): a decoy left hanging reads as a plot hole` : `${name} has no pay-off shot ("pay": "${id}")`);
      if (!c.decoy && !String(c.cover ?? '').trim()) warn(null, `${name} has no "cover": the ordinary reason the story gives for it before the turn (a clue with no cover is a spoiler)`);
      ledger.push(`  ${c.decoy ? 'decoy' : 'clue '} ${id.padEnd(14)} planted ${before.length ? before.join(' ') : '—'}  →  pay ${pay ?? '—'}${c.label ? `   (${c.label})` : ''}`);
    }
    const real = Object.values(defs).filter(c => !c.decoy).length, decoys = Object.values(defs).filter(c => c.decoy).length;
    const [lo, hi] = landscape ? [6, 10] : [3, 5];
    if (real < lo || real > hi) warn(null, `${real} clues declared (${landscape ? 'long-form' : 'Shorts'}: ${lo}–${hi})`);
    if (!landscape && !decoys) warn(null, 'no decoy: one detail with the same camera weight that points at the wrong answer ("decoy": true), explained at the reveal');
  }
  // Mirror pairs (data.mirror: "<key>"): the first shot with a key is the planting frame, later ones are its mirror at
  // the reveal, built from the same component (directing.md §7). With data.cam on both, the camera must be the same.
  const groups = {};
  RAW_SHOTS.forEach((r, i) => { const k = r.data?.mirror; if (k) (groups[String(k)] ??= []).push(i); });
  for (const [k, g] of Object.entries(groups)) {
    if (g.length < 2) { warn(g[0], `data.mirror "${k}" is on one shot only: tag the planting frame and its mirror with the same key`); continue; }
    // a key may cover a short sequence (the car close-up, then the house): compare each shot with the first of its own scene
    for (const i of g.slice(1)) {
      const first = g.find(j => j < i && RAW_SHOTS[j].scene === RAW_SHOTS[i].scene);
      const cam0 = first === undefined ? undefined : RAW_SHOTS[first].data?.cam, cam = RAW_SHOTS[i].data?.cam;
      if (cam0 && cam && Math.hypot(cam0[2] - cam[2], cam0[3] - cam[3]) > 40) warn(i, `mirror "${k}": the camera centre differs from the planting frame, shot ${first} (${cam0.slice(2, 4)} vs ${cam.slice(2, 4)}): a mirror repeats the frame and changes only the light and the missing piece`);
    }
    ledger.push(`  mirror ${k.padEnd(13)} ${g[0]}  →  ${g.slice(1).join(' ')}`);
  }
}

// Comprehension load (longform-rules.md → Comprehension load; story-rules.md → Narrative clarity). Evidence:
// same-child, which viewers called hard to follow: 7 speakers, ~8 world laws, the core law first said at 44 %.
// Laws are declared like clues: top level `rules: {id: {label, core?}}`, `"rule": "id"` on each shot that SAYS it.
{
  const RAW = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
  const landscape = S.format === 'landscape';
  const at = i => (S.shots[i]?.start ?? 0) / (S.total || 1);
  const pct = i => `${Math.round(at(i) * 100)} %`;
  const list = v => (v === undefined ? [] : Array.isArray(v) ? v : [v]).map(String);

  const firstLine = {};
  RAW_SHOTS.forEach((r, i) => { const w = String(r.who ?? '').replace(/\d+$/, ''); if (w && r.text && !(w in firstLine)) firstLine[w] = i; });   // thyme15 = thyme at another age
  const speakers = Object.keys(firstLine), maxSpeakers = landscape ? 6 : 3;
  if (speakers.length > maxSpeakers) warn(null, `${speakers.length} speakers (${speakers.join(', ')}); the viewer holds ≤ ${maxSpeakers}: let the narrator carry the minor ones, or merge roles`);
  for (const [who, i] of Object.entries(firstLine)) if (landscape && at(i) > 0.5) warn(i, `"${who}" speaks for the first time at ${pct(i)}: a speaker met after half the film is a new face to learn late; introduce them in act 1, or let the narrator carry the line`);

  const defs = RAW.rules, said = {};
  RAW_SHOTS.forEach((r, i) => { for (const id of list(r.rule)) (said[id] ??= []).push(i); });
  for (const id of Object.keys(said)) if (!defs?.[id]) err(null, `rule "${id}" is tagged on shot ${said[id][0]} but not declared in the top-level "rules" (a typo, or add {"label", "core"})`);
  if (defs === undefined) {
    if (landscape) warn(null, 'no "rules": declare the world laws the plot runs on (a curse, a door, a condition) and tag the shots that say them ("rule"), or "rules": {} if there are none (story-json.md → Clues → World laws)');
  } else {
    const ids = Object.keys(defs), maxRules = landscape ? 3 : 2;
    if (ids.length > maxRules) warn(null, `${ids.length} world laws (${ids.join(', ')}); the viewer holds ≤ ${maxRules}: cut one, or say it as a consequence of the core law`);
    const core = ids.find(id => defs[id]?.core) ?? ids[0];
    for (const id of ids) {
      const s = said[id] ?? [];
      if (!s.length) { warn(null, `rule "${id}" is never said in words (no shot has "rule": "${id}"): a law the viewer must infer is a law they do not have`); continue; }
      if (id === core && at(s[0]) > 0.25) warn(s[0], `core law "${id}" is first said at ${pct(s[0])}: say it plainly by ~25 % (same-child: 44 %, and viewers got lost)`);
      if (id === core && landscape && s.length < 3) warn(s[0], `core law "${id}" is said ${s.length}× (shots ${s.join(' ')}): say it again in other words at the midpoint and before the climax`);
      ledger.push(`  rule  ${id.padEnd(14)} said ${s.join(' ')}  (first at ${pct(s[0])})${defs[id]?.label ? `   (${defs[id].label})` : ''}`);
    }
  }
}

const scenesFile = path.join(ROOT, 'src', 'episodes', path.basename(dir), 'scenes.tsx');
const scenesSrc = fs.existsSync(scenesFile) ? fs.readFileSync(scenesFile, 'utf8') : '';
for (const sc of new Set(S.shots.map(s => s.scene))) {
  if (!scenesSrc.includes(`'${sc}'`) && !scenesSrc.includes(`"${sc}"`) && !new RegExp(`\\b${sc}\\s*:`).test(scenesSrc)) {
    warn(null, `scene "${sc}" is not in src/episodes/${path.basename(dir)}/scenes.tsx — will render as placeholder`);
  }
}

// actual voice durations, when audio has already been generated
if (hasVoice) {
  for (const v of JSON.parse(fs.readFileSync(idxFile, 'utf8'))) {
    const s = S.shots[v.shot];
    if (!s) { warn(null, `assets/vo/index.json lists shot ${v.shot}, which no longer exists — regenerate audio`); continue; }
    if (v.start + v.dur > s.start + s.dur - 0.05) warn(v.shot, `generated voice ends ${(v.start + v.dur - (s.start + s.dur)).toFixed(2)}s past the cut`);
    if (v.tempo > 1.15) warn(v.shot, `voice sped up ×${v.tempo} — rushed read`);
  }
  // dead air: stretches with no voice (longform-rules.md -> Pacing & Dead-air control)
  if (S.format === 'landscape') {
    const mm = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    const d = deadAir(JSON.parse(fs.readFileSync(idxFile, 'utf8')), S);
    for (const g of d.tooLong.slice(0, 12)) warn(null, `dead air ${g.len.toFixed(1)}s with no voice at ${mm(g.from)}${g.hush ? ' (hush)' : ''} - add a line, a sound cue or an insert, or cut the shot (max ${DEAD_AIR.gapMax}s, ${DEAD_AIR.hushMax}s on a hush)`);
    if (d.tooLong.length > 12) warn(null, `... ${d.tooLong.length - 12} more dead-air gaps over the limit`);
    if (d.free > DEAD_AIR.freeMax) warn(null, `${Math.round(d.free * 100)}% of the film has no voice (<= ${DEAD_AIR.freeMax * 100}%): shorten the pauses (breath / switchBreath / hold) or cover them with lines`);
    if (d.perMin > DEAD_AIR.longPerMin) warn(null, `${d.long.length} gaps over ${DEAD_AIR.longGap}s (${d.perMin.toFixed(1)}/min, <= ${DEAD_AIR.longPerMin}/min): the film breathes too slowly`);
  }
}

// chapters (long-form): each one a review + preview-render unit
if (S.format === 'landscape' && !S.chapters.length) warn(null, 'no chapters — mark the first shot of each chapter with "chapter": "<name>" (npm run chapter lists them)');
for (const c of S.chapters) {
  if (c.dur > 300) warn(c.first, `chapter ${c.n} "${c.name}" runs ${Math.round(c.dur)}s — over ~5 min is hard to review; split it`);
  if (c.dur < 20) warn(c.first, `chapter ${c.n} "${c.name}" is only ${c.dur.toFixed(1)}s — merge it (YouTube needs chapters ≥ 10s, and short ones add little)`);
}
if (S.chapters.length && S.chapters[0].start !== 0) warn(null, 'first chapter does not start at 0:00 (YouTube needs it)');

const brief = path.join(dir, 'brief.md');
if (!fs.existsSync(brief)) warn(null, S.format === 'landscape'
  ? 'no brief.md — copy .claude/skills/thai-long-story/references/brief-template.md and fill it'
  : 'no brief.md — add one with the speaker table (references/voices.md) and the clue list');

console.log(`${path.basename(dir)}: ${S.shots.length} shots, ${S.total.toFixed(1)}s, ${S.totalBeats} beats @ ${S.bpm} BPM`);
if (ledger.length) console.log('ledger (clues, mirror pairs, world laws):\n' + ledger.join('\n'));
for (const e of errors) console.log('✖ ' + e);
for (const w of warns) console.log('⚠ ' + w);
if (!errors.length && !warns.length) console.log('✓ clean');
else console.log(`\n${errors.length} error(s), ${warns.length} warning(s). This is a script gate only — also work through the story checklist (story-rules.md, or longform-rules.md for landscape).`);
process.exit(errors.length ? 1 : 0);
