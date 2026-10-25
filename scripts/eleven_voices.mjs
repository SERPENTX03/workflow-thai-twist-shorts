// Find the voice id of an ElevenLabs voice in your account (needs the key's "Voices: Read" permission).
//
//   npm run voices -- vasko
//   npm run voices            (lists the first 50 voices)
import { searchVoices } from './eleven_tts.mjs';
import { die } from './lib.mjs';

try {
  const found = await searchVoices(process.argv[2] || '');
  if (!found.length) die('no voice found — add it to your account first (ElevenLabs → "Add to my voices")');
  for (const v of found) console.log(`${v.id}  ${v.name}  (${v.category || '?'})`);
  console.log('\nPut the id in scripts/eleven-voices.json, e.g. { "Vasko": "<id>" }');
} catch (e) {
  console.error('✖ ' + e.message);
  process.exitCode = 1;
}
