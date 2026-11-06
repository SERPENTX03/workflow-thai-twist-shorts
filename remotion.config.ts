import fs from 'node:fs';
import path from 'node:path';
import {Config} from '@remotion/cli/config';

// Route Remotion temp frames to .remotion-temp in workspace to prevent C: drive ENOSPC
const tempDir = path.resolve(__dirname, '.remotion-temp');
if (!fs.existsSync(tempDir)) {
  try {
    fs.mkdirSync(tempDir, {recursive: true});
  } catch {}
}
process.env.TEMP = tempDir;
process.env.TMP = tempDir;

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);
Config.setOverwriteOutput(true);
Config.setEntryPoint('src/index.ts');

