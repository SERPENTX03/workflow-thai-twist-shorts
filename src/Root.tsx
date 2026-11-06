import React from 'react';
import {Composition, Still} from 'remotion';
import './engine/fonts';
import {FPS} from './studio.config';
import {CastSheet, GALLERY_COMPS} from './Gallery';
import {RunPreview, RUN_PREVIEW_FRAMES} from './RunPreview';
import {EPISODES} from './episodes';



import {GhostMoneyCoverA, GhostMoneyCoverB, GhostMoneyCoverC} from './episodes/ghost-money/cover';
import {SameChildCoverA, SameChildCoverB, SameChildCoverC} from './episodes/same-child/cover';

export const Root: React.FC = () => (
  <>
    {EPISODES.map(e => (
      <React.Fragment key={e.id}>
        <Composition id={e.id} component={e.Main} durationInFrames={e.plan.total} fps={FPS} width={e.plan.W} height={e.plan.H} />
        <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={e.plan.shots.length} fps={FPS} width={e.plan.W} height={e.plan.H} />
      </React.Fragment>
    ))}
    <Still id="GhostMoneyCoverA" component={GhostMoneyCoverA} width={1920} height={1080} />
    <Still id="GhostMoneyCoverB" component={GhostMoneyCoverB} width={1920} height={1080} />
    <Still id="GhostMoneyCoverC" component={GhostMoneyCoverC} width={1920} height={1080} />
    <Still id="SameChildCoverA" component={SameChildCoverA} width={1920} height={1080} />
    <Still id="SameChildCoverB" component={SameChildCoverB} width={1920} height={1080} />
    <Still id="SameChildCoverC" component={SameChildCoverC} width={1920} height={1080} />







    <Composition id="RunPreview" component={RunPreview} durationInFrames={RUN_PREVIEW_FRAMES} fps={FPS} width={1920} height={1080} />
    <Still id="Cast" component={CastSheet} width={1920} height={1080} />
    {GALLERY_COMPS.map(g => (
      <Composition key={g.id} id={g.id} component={g.component} durationInFrames={g.count} fps={FPS} width={g.width} height={g.height} />
    ))}
  </>
);
