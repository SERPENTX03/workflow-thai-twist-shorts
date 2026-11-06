// Studio gallery: renders every gallery item (src/Gallery.tsx G* compositions) and each episode's Board with Remotion,
// then writes studio/manifest.js for studio/index.html. Voice previews come from `npm run voices` (studio/audio).
// Landscape stage kit (src/kit/world, temple, inserts + light grades): GWorld, GInserts, GCamera, GGrades, listed in src/gallery.json.
//   npm run gallery [-- --no-render] [-- --boards] [-- --only=GCast,GUi,GWorld,GPlaces,GInserts,GGrades]
// View: launch config "gallery" (serves the repo root on :3431) -> /studio/index.html
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, compId, loadStory } from './lib.mjs';

const OUT = path.join(ROOT, 'studio');
const R = path.join(OUT, 'renders');
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const withBoards = process.argv.includes('--with-boards') || process.argv.includes('--boards') || only.includes('boards');
const want = k => (k === 'boards' ? withBoards : (!only.length || only.includes(k)));
const epArg = (process.argv.find(a => a.startsWith('--episode=')) || '').slice(10);
const matchArg = (process.argv.find(a => a.startsWith('--match=')) || '').slice(8).toLowerCase();
const skipExisting = process.argv.includes('--skip-existing') || process.argv.includes('--cached');
const readJson = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

const CAST = Object.entries(readJson('src/cast.json')).filter(([k, c]) => !k.startsWith('_') && !c.retired);
const wardrobe = readJson('src/cast/wardrobe.json');
const G = readJson('src/gallery.json');
const V = readJson('voices.json');
const LISTS = {
  GCast: CAST.map(([id]) => `cast-${id}`),
  GFaces: G.faces,
  GTalk: G.talk.map((t, i) => `talk-${i}-${t.face || 'plain'}`),
  GGait: G.gait,
  GRig: G.rig.map(r => `rig-${r.id}`),
  GProps: G.props,
  GMarks: G.marks,
  GUi: G.ui.map(u => `ui-${u.id}`),
  GPlaces: G.places.map(w => `place-${w.id}`),
  GParts: G.parts.map(w => `part-${w.id}`),
  GInserts: G.inserts.map(w => `insert-${w.id}`),
  GCamera: G.camera.map(w => `camera-${w.id}`),
  GGrades: G.grades.map(w => `grade-${w.id}`),
};
const SCALE = { GUi: 0.75, GPlaces: 0.5, GParts: 0.3, GInserts: 0.3, GCamera: 0.3, GGrades: 0.3 };

const episodes = withBoards ? fs.readdirSync(path.join(ROOT, 'episodes'), { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(ROOT, 'episodes', d.name, 'story.json')))
  .map(d => ({ slug: d.name, S: loadStory(path.join(ROOT, 'episodes', d.name)) })) : [];

if (!process.argv.includes('--no-render')) {
  const { bundle } = await import('@remotion/bundler');
  const { openBrowser, selectComposition, renderStill } = await import('@remotion/renderer');
  fs.mkdirSync(R, { recursive: true });
  process.stdout.write('bundling ... ');
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src', 'index.ts') });
  console.log('ok');
  const browser = await openBrowser('chrome');
  const still = async (id, frame, file, scale = 1) => {
    const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
    await renderStill({ serveUrl, composition, frame, output: path.join(R, file), imageFormat: 'png', scale, puppeteerInstance: browser, overwrite: true });
  };
  try {
    for (const [comp, names] of Object.entries(LISTS)) {
      if (!want(comp)) continue;
      let count = 0;
      for (let i = 0; i < names.length; i++) {
        if (matchArg && !names[i].toLowerCase().includes(matchArg)) continue;
        const outFile = `${names[i]}.png`;
        if (skipExisting && fs.existsSync(path.join(R, outFile))) continue;
        await still(comp, i, outFile, SCALE[comp] || 1);
        count++;
      }
      console.log(`✓ ${comp}  ${count}/${names.length}`);
    }
    if (want('Cast') && (!matchArg || 'cast-sheet'.includes(matchArg))) {
      if (!skipExisting || !fs.existsSync(path.join(R, 'cast-sheet.png'))) {
        await still('Cast', 0, 'cast-sheet.png');
        console.log('✓ Cast sheet');
      }
    }
    if (want('boards')) {
      for (const { slug, S } of episodes) {
        if (epArg && slug !== epArg) continue;
        let count = 0;
        for (let i = 0; i < S.shots.length; i++) {
          const outFile = `board-${slug}-${i}.png`;
          if (skipExisting && fs.existsSync(path.join(R, outFile))) continue;
          await still(`${compId(slug)}Board`, i, outFile, 0.3);
          count++;
        }
        console.log(`✓ board ${slug}  ${count}/${S.shots.length}`);
      }
    }
  } finally {
    await browser.close({ silent: true });
  }
}

// which episodes actually import each kit piece (src/episodes + archive): shown on its card, so a choice is made on evidence
const walk = (d, o = []) => { if (!fs.existsSync(d)) return o; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!['assets', 'renders', 'public', 'node_modules'].includes(e.name)) walk(p, o); } else if (/\.tsx?$/.test(e.name)) o.push(p); } return o; };
const episodeSrc = [];
for (const base of ['src/episodes', 'archive']) {
  const dir = path.join(ROOT, base);
  if (!fs.existsSync(dir)) continue;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) episodeSrc.push({ slug: e.name, text: walk(path.join(dir, e.name)).map(f => fs.readFileSync(f, 'utf8')).join('\n') });
}
const usedIn = sym => (sym ? episodeSrc.filter(e => new RegExp(`\\b${sym}\\b`).test(e.text)).map(e => e.slug) : []);
const withUse = w => ({ ...w, usedIn: usedIn(w.uses) });

const img = f => (fs.existsSync(path.join(R, f)) ? `renders/${f}` : null);
const audio = f => (fs.existsSync(path.join(OUT, 'audio', f)) ? `audio/${f}` : null);
const sfxIdx = path.join(ROOT, 'sfx-library', 'index.json');

const manifest = {
  built: new Date().toISOString(),
  castSheet: img('cast-sheet.png'),
  cast: CAST.map(([id, c]) => ({ id, ...c, image: img(`cast-${id}.png`), audio: c.role ? (audio(`cast-${id}.mp3`) || audio(`role-${c.role}.mp3`)) : null })),
  voices: {
    model: V.model, settings: V.settings, default: V.default,
    roles: Object.entries(V.roles).map(([role, r]) => ({ role, ...r, audio: audio(`role-${role}.mp3`), cast: CAST.filter(([, c]) => c.role === role).map(([k]) => k) })),
  },
  faces: G.faces.map(id => ({ id, image: img(`${id}.png`), code: `"who@900 ${id.replace('face-', '')}"` })),
  gait: G.gait.map(id => {
    const [, who, pose, step] = id.match(/^(.+)-(walk|run)-(\d)$/);
    return { id, image: img(`${id}.png`), code: `<Actors cast={["who@900 ${pose}"]} />  // จังหวะ ${step} (แทน who ด้วย id ตัวละคร)` };
  }),
  rig: G.rig.map(r => ({ id: r.id, label: r.label, image: img(`rig-${r.id}.png`), code: r.figures.filter(Boolean).map(f => `"${r.who}@960 ${f}"`).join('  ') })),
  talk: G.talk.map((t, i) => ({ ...t, id: `talk-${i}`, image: img(`${LISTS.GTalk[i]}.png`), code: `"${t.who}@900 ${t.face ? t.face + ' ' : ''}talk"` })),
  props: G.props.map(id => ({ id, image: img(`${id}.png`), code: `"who@900 armR=hold prop=${id.replace('prop-', '')}"` })),
  marks: G.marks.map(id => ({ id, label: wardrobe[id]?.label, image: img(`${id}.png`), code: id.startsWith('hair-') ? `hair="${id.slice(5)}"` : `layers={['${id}']}` })),
  ui: G.ui.map(u => ({ ...u, image: img(`ui-${u.id}.png`) })),
  places: G.places.map(w => ({ ...withUse(w), image: img(`place-${w.id}.png`) })),
  parts: G.parts.map(w => ({ ...withUse(w), image: img(`part-${w.id}.png`) })),
  inserts: G.inserts.map(w => ({ ...withUse(w), image: img(`insert-${w.id}.png`) })),
  camera: G.camera.map(w => ({ ...withUse(w), image: img(`camera-${w.id}.png`) })),
  retired: G.retired,
  grades: G.grades.map(w => ({ ...w, image: img(`grade-${w.id}.png`) })),
  episodes: episodes.map(({ slug, S }) => ({
    slug, id: compId(slug), title: S.title, format: S.format, seconds: Math.round(S.total),
    chapters: S.chapters.map(c => ({ n: c.n, name: c.name, start: c.start, dur: c.dur, first: c.first, last: c.last })),
    tracks: [['voice', 'voice.wav'], ['score', 'score.wav']].filter(([, f]) => fs.existsSync(path.join(ROOT, 'public', slug, f))).map(([k, f]) => ({ k, src: `../public/${slug}/${f}` })),
    final: fs.existsSync(path.join(ROOT, 'episodes', slug, 'renders', `${slug}-final.mp4`)) ? `../episodes/${slug}/renders/${slug}-final.mp4` : null,
    shots: S.shots.map(s => ({ i: s.i, scene: s.scene, view: s.view, text: s.text, image: img(`board-${slug}-${s.i}.png`) })),
  })),
  sfx: fs.existsSync(sfxIdx)
    ? Object.entries(JSON.parse(fs.readFileSync(sfxIdx, 'utf8'))).map(([key, v]) => ({ name: v.name || key, prompt: v.prompt, src: `../sfx-library/${key}.mp3` }))
    : [],
};
fs.writeFileSync(path.join(OUT, 'manifest.js'), 'window.STUDIO = ' + JSON.stringify(manifest, null, 1) + ';\n');
console.log(`✓ studio/manifest.js  ${manifest.cast.length} cast, ${manifest.episodes.length} episodes, ${manifest.sfx.length} sfx`);
