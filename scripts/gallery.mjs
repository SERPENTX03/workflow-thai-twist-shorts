// Studio gallery: renders every gallery item (src/Gallery.tsx G* compositions) and each episode's Board with Remotion,
// then writes studio/manifest.js for studio/index.html. Voice previews come from `npm run voices` (studio/audio).
//   npm run gallery [-- --no-render] [-- --only=GCast,GUi,boards]
// View: launch config "gallery" (serves the repo root on :3431) -> /studio/index.html
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, compId, loadStory } from './lib.mjs';

const OUT = path.join(ROOT, 'studio');
const R = path.join(OUT, 'renders');
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const want = k => !only.length || only.includes(k);
const readJson = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

const CAST = Object.entries(readJson('src/cast.json')).filter(([k]) => !k.startsWith('_'));
const G = readJson('src/gallery.json');
const V = readJson('voices.json');
const LISTS = {
  GCast: CAST.map(([id]) => `cast-${id}`),
  GFaces: G.faces,
  GPoses: [...G.poses, ...G.arms],
  GProps: G.props,
  GMarks: G.marks,
  GUi: G.ui.map(u => `ui-${u.id}`),
  GScenes: G.scenes.map((s, i) => `scene-${i}-${s.scene}${s.view ? '-' + s.view : ''}`),
};
const SCALE = { GScenes: 0.4, GUi: 0.75 };

const episodes = fs.readdirSync(path.join(ROOT, 'episodes'), { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(ROOT, 'episodes', d.name, 'story.json')))
  .map(d => ({ slug: d.name, S: loadStory(path.join(ROOT, 'episodes', d.name)) }));

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
      for (let i = 0; i < names.length; i++) await still(comp, i, `${names[i]}.png`, SCALE[comp] || 1);
      console.log(`✓ ${comp}  ${names.length}`);
    }
    if (want('Cast')) { await still('Cast', 0, 'cast-sheet.png'); console.log('✓ Cast sheet'); }
    if (want('boards')) {
      for (const { slug, S } of episodes) {
        for (let i = 0; i < S.shots.length; i++) await still(`${compId(slug)}Board`, i, `board-${slug}-${i}.png`, 0.3);
        console.log(`✓ board ${slug}  ${S.shots.length}`);
      }
    }
  } finally {
    await browser.close({ silent: true });
  }
}

const img = f => (fs.existsSync(path.join(R, f)) ? `renders/${f}` : null);
const audio = f => (fs.existsSync(path.join(OUT, 'audio', f)) ? `audio/${f}` : null);
const sfxIdx = path.join(ROOT, 'sfx-library', 'index.json');

const manifest = {
  built: new Date().toISOString(),
  castSheet: img('cast-sheet.png'),
  cast: CAST.map(([id, c]) => ({ id, ...c, image: img(`cast-${id}.png`), audio: c.role ? audio(`cast-${id}.mp3`) : null })),
  voices: {
    model: V.model, settings: V.settings, default: V.default,
    roles: Object.entries(V.roles).map(([id, r]) => ({ id, ...r, audio: audio(`role-${id}.mp3`), cast: CAST.filter(([, c]) => c.role === id).map(([k]) => k) })),
  },
  faces: G.faces.map(id => ({ id, image: img(`${id}.png`) })),
  poses: [...G.poses, ...G.arms].map(id => ({ id, image: img(`${id}.png`), code: id.startsWith('arm-') ? `<Sprite id="man" hideArm${id[4].toUpperCase()} layers={['${id}']} />` : `<Sprite id="${id}" />` })),
  props: G.props.map(id => ({ id, image: img(`${id}.png`), code: `<Sprite id="${id}" />` })),
  marks: G.marks.map(id => ({ id, image: img(`${id}.png`), code: `layers={['${id}']}` })),
  ui: G.ui.map(u => ({ ...u, image: img(`ui-${u.id}.png`) })),
  scenes: G.scenes.map((s, i) => ({ ...s, image: img(`${LISTS.GScenes[i]}.png`), code: JSON.stringify({ scene: s.scene, ...(s.view ? { view: s.view } : {}), data: s.data }) })),
  episodes: episodes.map(({ slug, S }) => ({
    slug, id: compId(slug), title: S.title, format: S.format, seconds: Math.round(S.total),
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
