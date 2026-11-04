// Archive and restore episodes so the active workspace and Remotion studio stay lean and fast.
//   npm run archive <slug>             # Moves episode out of active Remotion bundle
//   npm run archive -- --restore <slug> # Restores archived episode to active workspace
//   npm run archive -- --list           # Shows active vs archived episodes
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, die, writeRegistry } from './lib.mjs';

const ARCHIVE_ROOT = path.join(ROOT, 'archive');
const EPISODES_ROOT = path.join(ROOT, 'episodes');
const SRC_EPISODES_ROOT = path.join(ROOT, 'src', 'episodes');
const PUBLIC_ROOT = path.join(ROOT, 'public');
const RENDERS_ROOT = path.join(ROOT, 'studio', 'renders');
const OUT_ROOT = path.join(ROOT, 'out');

const args = process.argv.slice(2);
const isList = args.includes('--list') || args.includes('-l');
const isRestore = args.includes('--restore') || args.includes('-r');
const rawSlug = args.find(a => !a.startsWith('-'));
const slug = rawSlug ? rawSlug.replace(/^episodes[\\/]/, '').replace(/[\\/]$/, '') : null;

function getActiveEpisodes() {
  if (!fs.existsSync(EPISODES_ROOT)) return [];
  return fs.readdirSync(EPISODES_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(EPISODES_ROOT, d.name, 'story.json')))
    .map(d => {
      try {
        const s = JSON.parse(fs.readFileSync(path.join(EPISODES_ROOT, d.name, 'story.json'), 'utf8'));
        return { slug: d.name, title: s.title || '', shots: (s.shots || []).length };
      } catch {
        return { slug: d.name, title: '', shots: 0 };
      }
    });
}

function getArchivedEpisodes() {
  if (!fs.existsSync(ARCHIVE_ROOT)) return [];
  return fs.readdirSync(ARCHIVE_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && (
      fs.existsSync(path.join(ARCHIVE_ROOT, d.name, 'episode', 'story.json')) ||
      fs.existsSync(path.join(ARCHIVE_ROOT, d.name, 'story.json'))
    ))
    .map(d => {
      const sPath = fs.existsSync(path.join(ARCHIVE_ROOT, d.name, 'episode', 'story.json'))
        ? path.join(ARCHIVE_ROOT, d.name, 'episode', 'story.json')
        : path.join(ARCHIVE_ROOT, d.name, 'story.json');
      try {
        const s = JSON.parse(fs.readFileSync(sPath, 'utf8'));
        return { slug: d.name, title: s.title || '', shots: (s.shots || []).length };
      } catch {
        return { slug: d.name, title: '', shots: 0 };
      }
    });
}

function safeMove(src, dest) {
  try {
    fs.renameSync(src, dest);
  } catch (err) {
    if (err.code === 'EXDEV' || err.code === 'EPERM' || err.code === 'EBUSY') {
      fs.cpSync(src, dest, { recursive: true });
      fs.rmSync(src, { recursive: true, force: true });
    } else {
      throw err;
    }
  }
}

function updateStudioManifest() {
  spawnSync(process.execPath, ['scripts/gallery.mjs', '--no-render'], { cwd: ROOT, stdio: 'ignore' });
}

if (isList || (!slug && !isRestore)) {
  const active = getActiveEpisodes();
  const archived = getArchivedEpisodes();
  console.log(`\nActive episodes (${active.length}):`);
  if (!active.length) console.log('  (none)');
  for (const ep of active) {
    console.log(`  • ${ep.slug.padEnd(20)} "${ep.title}" (${ep.shots} shots)`);
  }
  console.log(`\nArchived episodes (${archived.length}):`);
  if (!archived.length) console.log('  (none)');
  for (const ep of archived) {
    console.log(`  • ${ep.slug.padEnd(20)} "${ep.title}" (${ep.shots} shots)`);
  }
  console.log('\nUsage:');
  console.log('  npm run archive <slug>              # archive episode');
  console.log('  npm run archive -- --restore <slug> # restore episode');
  process.exit(0);
}

if (isRestore) {
  if (!slug) die('Please specify an episode slug to restore: npm run archive -- --restore <slug>');
  const targetArch = path.join(ARCHIVE_ROOT, slug);
  if (!fs.existsSync(targetArch)) die(`Archived episode not found: archive/${slug}`);

  const activeEpDir = path.join(EPISODES_ROOT, slug);
  if (fs.existsSync(activeEpDir)) die(`episodes/${slug} already exists in active workspace`);

  console.log(`Restoring episode "${slug}"...`);
  fs.mkdirSync(EPISODES_ROOT, { recursive: true });

  // 1. Episode data
  const archEpSub = path.join(targetArch, 'episode');
  if (fs.existsSync(archEpSub)) {
    safeMove(archEpSub, activeEpDir);
  } else if (fs.existsSync(path.join(targetArch, 'story.json'))) {
    // If files were stored directly under archive/<slug>
    fs.mkdirSync(activeEpDir, { recursive: true });
    for (const f of fs.readdirSync(targetArch)) {
      if (['src', 'public', 'renders'].includes(f)) continue;
      safeMove(path.join(targetArch, f), path.join(activeEpDir, f));
    }
  }

  // 2. Src episode components
  const archSrc = path.join(targetArch, 'src');
  if (fs.existsSync(archSrc)) {
    fs.mkdirSync(SRC_EPISODES_ROOT, { recursive: true });
    safeMove(archSrc, path.join(SRC_EPISODES_ROOT, slug));
  }

  // 3. Public assets (voice, score)
  const archPub = path.join(targetArch, 'public');
  if (fs.existsSync(archPub)) {
    fs.mkdirSync(PUBLIC_ROOT, { recursive: true });
    safeMove(archPub, path.join(PUBLIC_ROOT, slug));
  }

  // 4. Stored board renders
  const archRenders = path.join(targetArch, 'renders');
  if (fs.existsSync(archRenders)) {
    fs.mkdirSync(RENDERS_ROOT, { recursive: true });
    for (const f of fs.readdirSync(archRenders)) {
      safeMove(path.join(archRenders, f), path.join(RENDERS_ROOT, f));
    }
  }

  // Clean up empty archive dir
  try {
    fs.rmSync(targetArch, { recursive: true, force: true });
  } catch {}

  writeRegistry();
  updateStudioManifest();
  console.log(`✓ Restored "${slug}" -> active in Remotion & workspace.`);
  process.exit(0);
}

// Default action: Archive
const srcEpDir = path.join(EPISODES_ROOT, slug);
if (!fs.existsSync(srcEpDir)) {
  const active = getActiveEpisodes();
  die(`Episode "episodes/${slug}" not found.\nActive episodes: ${active.map(e => e.slug).join(', ') || 'none'}`);
}

const targetArch = path.join(ARCHIVE_ROOT, slug);
if (fs.existsSync(targetArch) && fs.readdirSync(targetArch).length > 0) {
  die(`Archive folder "archive/${slug}" already exists and is not empty. Remove or rename it first.`);
}

console.log(`Archiving episode "${slug}"...`);
fs.mkdirSync(targetArch, { recursive: true });

// 1. Move episodes/<slug> -> archive/<slug>/episode
safeMove(srcEpDir, path.join(targetArch, 'episode'));

// 2. Move src/episodes/<slug> -> archive/<slug>/src (if exists)
const srcEpCustom = path.join(SRC_EPISODES_ROOT, slug);
if (fs.existsSync(srcEpCustom)) {
  safeMove(srcEpCustom, path.join(targetArch, 'src'));
}

// 3. Move public/<slug> -> archive/<slug>/public (if exists)
const publicDir = path.join(PUBLIC_ROOT, slug);
if (fs.existsSync(publicDir)) {
  safeMove(publicDir, path.join(targetArch, 'public'));
}

// 4. Move board stills from studio/renders/board-<slug>-*.png -> archive/<slug>/renders
if (fs.existsSync(RENDERS_ROOT)) {
  const boardPrefix = `board-${slug}-`;
  const renders = fs.readdirSync(RENDERS_ROOT).filter(f => f.startsWith(boardPrefix));
  if (renders.length > 0) {
    const archRenders = path.join(targetArch, 'renders');
    fs.mkdirSync(archRenders, { recursive: true });
    for (const f of renders) {
      safeMove(path.join(RENDERS_ROOT, f), path.join(archRenders, f));
    }
    console.log(`  Moved ${renders.length} board renders out of studio/renders/`);
  }
}

// 5. Clean out/<slug>-board/ if exists
const outBoard = path.join(OUT_ROOT, `${slug}-board`);
if (fs.existsSync(outBoard)) {
  fs.rmSync(outBoard, { recursive: true, force: true });
}

// 6. Update Remotion registry and Studio manifest
writeRegistry();
updateStudioManifest();

console.log(`✓ Archived "${slug}" into archive/${slug}/`);
console.log(`✓ Remotion registry and Studio manifest updated.`);
console.log(`  To restore later: npm run archive -- --restore ${slug}`);
