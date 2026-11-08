// Offline story.json preflight (no network, no credits). Catches script problems before voice/render.
//   node scripts/story-check.mjs episodes/<slug>        (npm run story -- episodes/<slug>)
// Errors (exit 1): schema, unknown cue/role, cue outside its shot, character line without role.
// Warnings: runtime vs channel target, caption length, estimated voice overrun, cue density, missing scene files.
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory, plain, sfxFile, ROOT } from './lib.mjs';

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
    const isClose = s.view?.endsWith('-close') || s.view === 'close';
    const isExit = s.view === 'exit' || RAW_SHOTS[i]?.data?.move;
    if (!isClose && !isExit && prevCast.length > currCast.length && currCast.length > 0) {
      for (const prevA of prevCast) {
        if (!currCast.some(c => c.who === prevA.who)) {
          warn(i, `actor "${prevA.who}" was present in shot ${i - 1} in scene "${s.scene}" but vanished in shot ${i} — keep both actors in cast or frame with a close-up camera`);
        }
      }
    }
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
for (const e of errors) console.log('✖ ' + e);
for (const w of warns) console.log('⚠ ' + w);
if (!errors.length && !warns.length) console.log('✓ clean');
else console.log(`\n${errors.length} error(s), ${warns.length} warning(s). This is a script gate only — also work through the story checklist (story-rules.md, or longform-rules.md for landscape).`);
process.exit(errors.length ? 1 : 0);
