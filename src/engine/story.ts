// story.json -> shots on the beat grid (port of scripts/lib.mjs loadStory).
import {FORMATS, FPS, type FormatName} from '../studio.config';

export type Cue = [number, string];
export type StoryShot = {
  scene: string; beats: number; text?: string; style?: 'plain' | 'red'; vo?: string; who?: string;
  view?: string; voice?: string; tone?: string; fx?: string; cues?: Cue[]; mood?: number; music?: boolean;
  hush?: boolean; voLead?: number; hold?: number;
  /** free-form content for generic scenes (rules, news, next...) */
  data?: Record<string, any>;
};
export type Story = {
  title: string; format?: FormatName; bpm?: number; captionLook?: 'bold' | 'folk';
  series?: {name: string; ep?: number; next?: string}; shots: StoryShot[];
  [k: string]: unknown;
};
export type Shot = StoryShot & {i: number; from: number; frames: number; text: string; style: 'plain' | 'red'};

export function planStory(story: Story) {
  const bpm = story.bpm ?? 75;
  const beatFrames = (60 / bpm) * FPS;
  let b = 0;
  const shots: Shot[] = story.shots.map((s, i) => {
    const from = Math.round(b * beatFrames);
    b += s.beats;
    const end = Math.round(b * beatFrames);
    return {...s, i, from, frames: end - from, text: s.text ?? '', style: s.style ?? 'plain'};
  });
  const fmt = FORMATS[story.format === 'landscape' ? 'landscape' : 'portrait'];
  return {...fmt, shots, total: Math.round(b * beatFrames), beatFrames};
}

export type Mark = {text: string; kind: 'plain' | 'hl' | 'hl-red'};

/** caption marks: [คำ] = gold, {คำ} = red word. Returns lines of marked spans. */
export function parseCaption(text: string): Mark[][] {
  return text.split('\n').map(line => {
    const out: Mark[] = [];
    for (const m of line.matchAll(/\[([^\]]+)\]|\{([^}]+)\}|([^[{]+)/g)) {
      if (m[1] !== undefined) out.push({text: m[1], kind: 'hl'});
      else if (m[2] !== undefined) out.push({text: m[2], kind: 'hl-red'});
      else out.push({text: m[3], kind: 'plain'});
    }
    return out;
  });
}
