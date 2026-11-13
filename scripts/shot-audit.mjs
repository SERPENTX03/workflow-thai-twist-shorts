// Visual-variety audit (offline, read-only). Reads each shot's camera setup from its `view` suffix and checks the
// pacing / quota rules in .claude/skills/thai-twist-short/references/cinematography.md (§1 vocabulary, §6 quotas).
//   node scripts/shot-audit.mjs episodes/<slug> [--list]        (npm run shots -- episodes/<slug>)
// Portrait: one report for the whole film. Landscape: one per chapter (chapters over 90 s get the angle/device
// quota) plus film-wide totals. Advisory: always exits 0. Every ✗ is a question to answer on the Board frame (fix it,
// or write one line on why the shot is right as it is): the numbers serve the picture (directing.md §8), not the reverse.
// Also: shots with no `note` (the one-sentence picture, directing.md §2) and the same framing of one set repeated.
import fs from 'node:fs';
import path from 'node:path';
import { episodeDir, loadStory, clock, ROOT } from './lib.mjs';

const GROUP_OF = {
  ew: 'EYE', wide: 'EYE', med: 'EYE',
  close: 'CLOSE', ecu: 'CLOSE', ins: 'CLOSE',
  low: 'ANGLE', high: 'ANGLE', top: 'ANGLE', dutch: 'ANGLE',
  ots: 'DEVICE', pov: 'DEVICE', fif: 'DEVICE', sil: 'DEVICE', split: 'DEVICE', mirror: 'DEVICE', cctv: 'DEVICE', snap: 'DEVICE',
};
const RANK = { EYE: 0, CLOSE: 1, ANGLE: 2, DEVICE: 3 };
const CARD_SCENE = /^(example-)?(rule|rules|title|diagram|news|map|next|card|end|endcard)$/i;
const INSERT_SCENE = /^(hand|hands|insert|inserts|phone|photo|page|note|notes|clock|object|prop)/i;

const dir = episodeDir(process.argv[2]);
const LIST = process.argv.includes('--list');
const S = loadStory(dir);
const RAW = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8')).shots;
const landscape = S.format === 'landscape';

/** setup of one shot: group, the vocabulary tokens, and a key that two "same setup" shots share */
function setupOf(s) {
  const tokens = (s.view ?? '').toLowerCase().split('-').filter(t => GROUP_OF[t]);
  if (CARD_SCENE.test(s.scene)) return { group: 'CARD', tokens, key: `${s.scene}:card` };
  let group = tokens.reduce((g, t) => (RANK[GROUP_OF[t]] > RANK[g] ? GROUP_OF[t] : g), 'EYE');
  if (!tokens.length && INSERT_SCENE.test(s.scene)) group = 'CLOSE';
  const tag = tokens.length ? [...new Set(tokens)].sort().join('+') : group === 'CLOSE' ? 'ins' : 'eye';
  return { group, tokens, key: `${s.scene}:${tag}` };
}

const shots = S.shots.map(s => ({ ...s, ...setupOf(s), past: !!RAW[s.i]?.data?.past }));

const LIMIT = landscape
  ? { sameSetup: 3, sameView: 4, eyeMax: 0.5, closeMin: 0.3, angleMin: 1, deviceMin: 1, distinct: 4, dutchShare: 0.03, quotaMinDur: 90 }
  : { sameSetup: 1, sameView: 1, eyeMax: 0.4, closeMin: 0.3, angleMin: 3, deviceMin: 2, distinct: 6, dutchMax: 2, quotaMinDur: 0 };

const lines = [];
const ok = (pass, msg) => lines.push(`  ${pass ? '✓' : '✗'} ${msg}`);
const pct = x => `${Math.round(x * 100)}%`;

/** runs of consecutive shots sharing `keyFn` that are longer than `max` */
function runs(list, keyFn, max) {
  const out = [];
  let a = 0;
  for (let i = 1; i <= list.length; i++) {
    if (i < list.length && keyFn(list[i]) === keyFn(list[a])) continue;
    if (i - a > max) out.push({ from: list[a].i, to: list[i - 1].i, n: i - a, key: keyFn(list[a]) });
    a = i;
  }
  return out;
}

function audit(list, label, dur) {
  lines.push(`\n${label}`);
  const cam = list.filter(s => s.group !== 'CARD');
  if (!cam.length) { lines.push('  (cards only)'); return; }
  const count = g => cam.filter(s => s.group === g).length;
  const share = g => count(g) / cam.length;
  const has = t => cam.filter(s => s.tokens.includes(t)).length;
  lines.push(`  ${cam.length} camera shots (+${list.length - cam.length} cards): EYE ${pct(share('EYE'))} · CLOSE ${pct(share('CLOSE'))} · ANGLE ${count('ANGLE')} · DEVICE ${count('DEVICE')}`);

  for (const r of runs(list, s => s.key, LIMIT.sameSetup)) ok(false, `shots ${r.from}–${r.to}: same setup "${r.key}" ${r.n}× in a row (max ${LIMIT.sameSetup})`);
  for (const r of runs(list, s => `${s.scene}:${s.view ?? ''}`, LIMIT.sameView)) ok(false, `shots ${r.from}–${r.to}: same view "${r.key}" ${r.n}× in a row (max ${LIMIT.sameView})`);

  ok(share('EYE') <= LIMIT.eyeMax, `flat EYE share ${pct(share('EYE'))} (≤ ${pct(LIMIT.eyeMax)}; a view with no suffix counts as EYE)`);
  ok(share('CLOSE') >= LIMIT.closeMin, `CLOSE/insert share ${pct(share('CLOSE'))} (≥ ${pct(LIMIT.closeMin)})`);
  const quota = dur === undefined || dur > LIMIT.quotaMinDur;
  if (quota) {
    ok(count('ANGLE') >= LIMIT.angleMin, `ANGLE shots ${count('ANGLE')} (≥ ${LIMIT.angleMin})`);
    ok(count('DEVICE') >= LIMIT.deviceMin, `DEVICE shots ${count('DEVICE')} (≥ ${LIMIT.deviceMin})`);
  }
  if (!landscape) ok(has('low') >= 1 && has('high') + has('top') >= 1, `low ${has('low')}, high/top ${has('high') + has('top')} (≥ 1 each)`);
  const distinct = new Set(cam.map(s => s.key)).size;
  ok(distinct >= LIMIT.distinct, `${distinct} distinct setups (≥ ${LIMIT.distinct})`);
  if (!landscape) ok(has('dutch') <= LIMIT.dutchMax, `dutch ${has('dutch')} (≤ ${LIMIT.dutchMax})`);
}

console.log(`shot audit — ${path.basename(dir)} (${S.format ?? 'portrait'}, ${shots.length} shots)`);
if (LIST) for (const s of shots) console.log(`  ${String(s.i).padStart(3)} ${clock(s.start).padStart(5)}  ${(s.scene + ':' + (s.view ?? '')).padEnd(28)} ${s.group.padEnd(6)} ${s.past ? 'past' : ''}`);

if (landscape && S.chapters.length) {
  for (const c of S.chapters) audit(shots.slice(c.first, c.last + 1), `chapter ${c.n} "${c.name}" (${clock(c.start)}, ${Math.round(c.dur)} s, shots ${c.first}–${c.last})`, c.dur);
  lines.push('\nfilm');
  const cam = shots.filter(s => s.group !== 'CARD');
  const has = t => cam.filter(s => s.tokens.includes(t)).length;
  ok(new Set(cam.map(s => s.key)).size >= 10, `${new Set(cam.map(s => s.key)).size} distinct setups in the film (≥ 10)`);
  ok(has('low') >= 1 && has('high') + has('top') >= 1, `low ${has('low')}, high/top ${has('high') + has('top')} (≥ 1 each)`);
  // short chapters skip the per-chapter quota, so the film carries it: one ANGLE and one DEVICE shot per 90 s
  const per90 = Math.max(1, Math.floor(S.total / 90));
  const group = g => cam.filter(s => s.group === g).length;
  ok(group('ANGLE') >= per90, `ANGLE shots ${group('ANGLE')} in the film (≥ ${per90}: one per 90 s)`);
  ok(group('DEVICE') >= per90, `DEVICE shots ${group('DEVICE')} in the film (≥ ${per90}: one per 90 s)`);
  ok(has('dutch') <= Math.max(1, Math.floor(cam.length * LIMIT.dutchShare)), `dutch ${has('dutch')} (≤ 3% of camera shots)`);
  const snaps = has('snap');
  ok(snaps <= 5, `snap shots ${snaps} (level 3: ≤ 5 in the film)`);
} else {
  audit(shots, 'film');
  ok(shots.filter(s => s.tokens.includes('snap')).length <= 3, `snap shots ${shots.filter(s => s.tokens.includes('snap')).length} (level 3: ≤ 3)`);
}

// directing.md §2: every camera shot carries its picture in one sentence before anything is drawn
const camShots = shots.filter(s => s.group !== 'CARD');
const noNote = camShots.filter(s => !String(RAW[s.i]?.note ?? '').trim());
lines.push('\npictures');
ok(noNote.length === 0, `${camShots.length - noNote.length}/${camShots.length} camera shots have a "note" (the picture in one sentence)${noNote.length ? ` — missing: ${noNote.slice(0, 12).map(s => s.i).join(' ')}${noNote.length > 12 ? ' …' : ''}` : ''}`);
// the same set from the same camera, again and again: one picture zoomed is not coverage (directing.md §0)

// directing.md §9 item 7: a camera shot of 3 s or more whose camera barely moves reads as a still picture. A shot that
// declares `data.motion` ("walk" | "pan" | "push" | "fx") or `data.move` is checked by npm run motion instead.
const still = camShots.filter(s => {
  const d = RAW[s.i]?.data ?? {};
  if (s.dur < 3 || d.motion || d.move || d.tilt || !d.cam) return false;
  const [z0, z1, cx, cy, cx1 = cx, cy1 = cy] = d.cam;
  return Math.abs(z1 / z0 - 1) < 0.06 && Math.hypot((cx1 - cx) * z0, (cy1 - cy) * z0) < 80;
});
// channel-playbook.md (2026-11-12): ~60 % of the benchmark's frames move, 13–20 % of ours; long-form allows 30 % still.
const STILL_MAX = S.format === 'landscape' ? 0.3 : 0.5;
ok(still.length <= camShots.length * STILL_MAX, `${still.length}/${camShots.length} camera shots of ≥ 3 s move under 6 % push / 80 px pan (≤ ${Math.round(STILL_MAX * 100)} %; hold shots with hush are fine, say so in the note)${still.length ? ` — e.g. ${still.slice(0, 10).map(s => s.i).join(' ')}` : ''}`);

// Staging (CLAUDE.md rule 14, directing.md §5 and §5.1): the cast are front-facing sprites, so a person who stands
// face-on with both arms down is a paper cutout, and a "close-up" of a face that looks straight out of the frame is
// an ID photo with the background swapped. Read from the actor strings; own-SVG shots are not seen here, look at them.
{
  const stageSrc = fs.readFileSync(path.join(ROOT, 'src', 'kit', 'stage.tsx'), 'utf8');
  const POSES = new Set([...(stageSrc.match(/const POSES = new Set\(\[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map(m => m[1]));
  POSES.delete('stand');
  const actors = camShots.flatMap(s => (RAW[s.i]?.data?.cast ?? []).map(a => ({ i: s.i, tokens: s.tokens, words: String(a).trim().split(/\s+/).slice(1) })));
  const val = (w, k) => w.find(x => x.startsWith(k + '='))?.slice(k.length + 1);
  // what reads on screen, not what is typed: yaw under ~0.3 still looks face-on (fifth-room shot 126 at yaw −0.35 is
  // only just turned), head is in degrees, look is the eyes alone
  const MIN = { yaw: 0.3, look: 0.3, head: 4 };
  const turned = w => Object.keys(MIN).some(k => { const v = val(w, k); return v !== undefined && v.split('@')[0].split('>').some(x => Math.abs(+x) >= MIN[k]); });
  const busy = w => w.some(x => /^(arm|armL|armR|prop)=/.test(x) && !/^arm[LR]=rest$/.test(x));
  const uniq = list => [...new Set(list.map(a => a.i))];
  const some = list => `${uniq(list).slice(0, 12).join(' ')}${uniq(list).length > 12 ? ' …' : ''}`;
  if (actors.length) {
    const stiff = actors.filter(a => !a.words.some(w => POSES.has(w)) && !busy(a.words) && !turned(a.words));
    ok(stiff.length <= actors.length * 0.1, `${stiff.length}/${actors.length} figures stand face-on with both arms at rest (≤ 10 %): give the hands something to do, turn them to what they look at (yaw=), sit them, or shoot them from behind${stiff.length ? ` — shots ${some(stiff)}` : ''}`);
    const closeActors = actors.filter(a => a.tokens.includes('close') || a.tokens.includes('ecu'));
    const idPhoto = closeActors.filter(a => !turned(a.words) && !busy(a.words));
    if (closeActors.length) ok(idPhoto.length <= closeActors.length * 0.3, `${idPhoto.length}/${closeActors.length} faces in close-ups look straight out with nothing in the hands (≤ 30 %): a close-up is acting — turn the head to the other person or the thing (yaw= head= look=), bring a hand into frame, change the face mid-shot (faces=)${idPhoto.length ? ` — shots ${some(idPhoto)}` : ''}`);
  }
  // a film of faces and objects with no room around them: the viewer stops knowing where anyone is
  const closeShare = camShots.filter(s => s.group === 'CLOSE').length / Math.max(1, camShots.length);
  ok(closeShare <= 0.6, `CLOSE/insert share ${pct(closeShare)} of the film (≤ 60 %): past that the places disappear — return to a wide when the situation changes`);
  // each place the cast stands in is seen whole at least once (directing.md §2: open on geography)
  const WIDE = new Set(['wide', 'ew', 'high', 'top']);
  const places = new Map();
  for (const s of camShots) if ((RAW[s.i]?.data?.cast ?? []).length) places.set(s.scene, [...(places.get(s.scene) ?? []), s]);
  for (const [scene, list] of places) {
    if (list.length < 8) continue;
    const all = camShots.filter(s => s.scene === scene);
    if (!all.some(s => s.tokens.some(t => WIDE.has(t)))) ok(false, `place "${scene}": ${all.length} shots and none is a wide (-wide, -ew, -high, -top): show the whole place once so the close shots have somewhere to be`);
  }
}

const frameKey = s => { const d = RAW[s.i]?.data ?? {}; return `${s.scene}:${s.view ?? ''}:${JSON.stringify(d.cam ?? null)}`; };
const seen = new Map();
// inserts of a clue repeat their frame on purpose (cinematography.md A2), so only sets are counted
for (const s of camShots.filter(s => !INSERT_SCENE.test(s.scene))) seen.set(frameKey(s), [...(seen.get(frameKey(s)) ?? []), s.i]);
const repeats = [...seen.entries()].filter(([, v]) => v.length > (landscape ? 6 : 2)).sort((a, b) => b[1].length - a[1].length);
for (const [k, v] of repeats.slice(0, 6)) ok(false, `same framing ${v.length}× (${k.split(':').slice(0, 2).join(':')}, shots ${v.slice(0, 8).join(' ')}${v.length > 8 ? ' …' : ''}) — move the camera inside the place, or build the place as a room (room.tsx)`);
const byScene = new Map();
for (const s of camShots) byScene.set(s.scene, (byScene.get(s.scene) ?? 0) + 1);
const top = [...byScene.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
lines.push(`  · busiest scenes: ${top.map(([k, n]) => `${k} ${n}`).join(' · ')} — a scene used this often must be a place the camera moves through, not one backdrop`);

console.log(lines.join('\n'));
const bad = lines.filter(l => l.includes('✗')).length;
console.log(bad ? `\n${bad} ✗ — each is a question for the Board frame: directing.md (the picture), cinematography.md §4 (triggers) and §6 (guides).` : '\nall variety checks pass — now check on the Board frames that each view really looks like its name.');
