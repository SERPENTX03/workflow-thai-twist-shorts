// Phrase captions (story.json `"captionMode": "phrase"`): one short line at a time, switched where the voice breathes.
// channel-playbook.md (2026-11-12): the benchmark shows one line of 2–4 words every ~1.3 s; whole-sentence captions held
// ~4.5 s read slower than the voice. Pure functions of the shot text and the voice line's timing: deterministic.
import {FPS} from '../studio.config';

/** one entry of timeline.json `vo` (scripts/voice.mjs index + `gaps` from scripts/timeline.mjs) */
export type VoLine = {shot: number; start: number; dur: number; gaps?: number[][]};
export type Phrase = {text: string; from: number};

const MARKS = /[ัิ-ฺ็-๎]/g;
/** characters you see: brackets, spaces and Thai vowel/tone marks above or below the line do not take width */
export const visibleLen = (t: string) => t.replace(/[[\]{}\s]/g, '').replace(MARKS, '').length;

/** split into words on spaces and line breaks, never inside a [gold] or {red} mark; `null` = a forced break (\n) */
function tokens(text: string): (string | null)[] {
  const out: (string | null)[] = [];
  let cur = '', depth = 0;
  for (const ch of text) {
    if (ch === '[' || ch === '{') depth++;
    if (ch === ']' || ch === '}') depth = Math.max(0, depth - 1);
    if (depth === 0 && (ch === ' ' || ch === '\n')) {
      if (cur) out.push(cur);
      cur = '';
      if (ch === '\n') out.push(null);
      continue;
    }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

/** a word run longer than one phrase (Thai is written without spaces) is cut at Thai word boundaries, never inside a mark */
const SEG = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new (Intl as any).Segmenter('th', {granularity: 'word'}) : null;
function cutLong(t: string, maxChars: number): string[] {
  if (!SEG || visibleLen(t) <= maxChars) return [t];
  const parts = Math.ceil(visibleLen(t) / maxChars), aim = visibleLen(t) / parts;
  const out: string[] = [];
  let cur = '', depth = 0;
  for (const {segment} of SEG.segment(t) as Iterable<{segment: string}>) {
    if (cur && depth === 0 && visibleLen(cur) >= aim && out.length < parts - 1) { out.push(cur); cur = ''; }
    cur += segment;
    for (const ch of segment) { if (ch === '[' || ch === '{') depth++; if (ch === ']' || ch === '}') depth = Math.max(0, depth - 1); }
  }
  if (cur) out.push(cur);
  return out;
}

/** greedy grouping into phrases of ≤ maxChars visible characters; a line break in the text always ends a phrase */
export function splitPhrases(text: string, maxChars = 22): string[] {
  const out: string[] = [];
  let cur = '';
  // pieces cut from one word run join back without a space (`glue`), whole words with one
  const words = tokens(text).flatMap(t => (t === null ? [null] : cutLong(t, maxChars).map((p, k) => ({p, glue: k > 0}))));
  for (const w of words) {
    if (w === null) { if (cur) out.push(cur); cur = ''; continue; }
    if (cur && visibleLen(cur + w.p) > maxChars) { out.push(cur); cur = w.p; }
    else cur = cur ? `${cur}${w.glue ? '' : ' '}${w.p}` : w.p;
  }
  if (cur) out.push(cur);
  // a lone tail word ("ๆ", "แล้ว") reads as a stutter: fold it back into the phrase before it
  if (out.length > 1 && visibleLen(out[out.length - 1]) <= 3) out.splice(-2, 2, `${out[out.length - 2]} ${out[out.length - 1]}`);
  return out;
}

/**
 * Time the phrases of one shot. Each boundary is first placed in proportion to the characters spoken, then snapped to
 * the nearest pause the voice really makes (within 0.6 s). Returns shot-local start frames; the first phrase starts at 0.
 */
export function timePhrases(text: string, vo: VoLine | undefined, shotFrom: number, shotFrames: number, maxChars = 22): Phrase[] {
  const parts = splitPhrases(text, maxChars);
  if (parts.length < 2 || !vo) return [{text, from: 0}];
  const total = parts.reduce((s, p) => s + visibleLen(p), 0) || 1;
  const mids = (vo.gaps ?? []).map(([a, b]) => (a + b) / 2);
  const used = new Set<number>();
  const out: Phrase[] = [{text: parts[0], from: 0}];
  let cum = 0, last = 0;
  for (let k = 1; k < parts.length; k++) {
    cum += visibleLen(parts[k - 1]);
    let t = (vo.dur * cum) / total;
    let best = -1;
    mids.forEach((m, j) => { if (!used.has(j) && m > last + 0.4 && Math.abs(m - t) < 0.6 && (best < 0 || Math.abs(m - t) < Math.abs(mids[best] - t))) best = j; });
    if (best >= 0) { used.add(best); t = mids[best]; }
    t = Math.max(t, last + 0.5);
    last = t;
    const from = Math.round((vo.start + t) * FPS) - shotFrom;
    out.push({text: parts[k], from: Math.min(Math.max(from, out[out.length - 1].from + 8), shotFrames - 6)});
  }
  return out.filter((p, k) => k === out.length - 1 || out[k + 1].from > p.from);
}
