import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string][] = [
  ['Kanit', 'fonts/Kanit-SemiBold.ttf', '600'],
  ['Kanit', 'fonts/Kanit-Bold.ttf', '700'],
  ['Chonburi', 'fonts/Chonburi-Regular.ttf', '400'],
  ['Srisakdi', 'fonts/Srisakdi-Bold.ttf', '700'],
  ['Mitr', 'fonts/Mitr-Bold.ttf', '700'],
  ['Prompt', 'fonts/Prompt-Bold.ttf', '700'],
  ['Plex Thai', 'fonts/IBMPlexSansThai-Medium.ttf', '500'],
  ['Plex Thai', 'fonts/IBMPlexSansThai-Bold.ttf', '700'],
];

// Import this module once (Root does); rendering waits until every face is loaded.
const handle = delayRender('fonts');
Promise.all(faces.map(([family, file, weight]) => loadFont({family, url: staticFile(file), weight})))
  .then(() => continueRender(handle))
  .catch(err => { throw err; });
