import React from 'react';
import {Composition, Still} from 'remotion';
import './engine/fonts';
import {FPS} from './studio.config';
import {CastSheet, GALLERY_COMPS} from './Gallery';
import {RunPreview, RUN_PREVIEW_FRAMES} from './RunPreview';
import {EPISODES} from './episodes';

// An episode's covers: export COVERS from src/episodes/<slug>/cover.tsx. Found by webpack rather than imported by name,
// so `npm run archive` can move the episode out without touching this file.
type CoverStill = {id: string; component: React.FC};
const coverFiles = (require as unknown as {context: (dir: string, deep: boolean, re: RegExp) => {keys(): string[]; (k: string): {COVERS?: CoverStill[]}}}).context('./episodes', true, /\/cover\.tsx$/);
const COVERS: CoverStill[] = coverFiles.keys().flatMap(k => coverFiles(k).COVERS ?? []);

export const Root: React.FC = () => (
  <>
    {EPISODES.map(e => (
      <React.Fragment key={e.id}>
        <Composition id={e.id} component={e.Main} durationInFrames={e.plan.total} fps={FPS} width={e.plan.W} height={e.plan.H} />
        <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={e.plan.shots.length} fps={FPS} width={e.plan.W} height={e.plan.H} />
      </React.Fragment>
    ))}







    <Composition id="RunPreview" component={RunPreview} durationInFrames={RUN_PREVIEW_FRAMES} fps={FPS} width={1920} height={1080} />
    <Still id="Cast" component={CastSheet} width={1920} height={1080} />
    {COVERS.map(c => <Still key={c.id} id={c.id} component={c.component} width={1920} height={1080} />)}
    {GALLERY_COMPS.map(g => (
      <Composition key={g.id} id={g.id} component={g.component} durationInFrames={g.count} fps={FPS} width={g.width} height={g.height} />
    ))}
  </>
);
