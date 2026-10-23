// HyperFrames check + the review contact sheet, for the contact-sheet scoring loop.
//   node scripts/check.mjs episodes/<slug>
import { episodeDir, npx } from './lib.mjs';

const dir = episodeDir(process.argv[2]);
const c = npx(['hyperframes', 'check'], { cwd: dir, stdio: 'inherit' });
const s = npx(['hyperframes', 'snapshot', '--review', '--describe', 'false', '-o', '.hyperframes/review'], { cwd: dir, stdio: 'inherit' });
console.log(`\nreview sheets: ${dir}/.hyperframes/review  (review-beats-N.jpg, review-phone-N.jpg, review-seam-NN.jpg)`);
process.exit(c.status || s.status);
