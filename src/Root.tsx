import React from 'react';
import {Composition, Still} from 'remotion';
import './engine/fonts';
import {FPS} from './studio.config';
import {CastSheet, Faces, Props, Sets} from './Gallery';
import {EPISODES} from './episodes';

export const Root: React.FC = () => (
  <>
    {EPISODES.map(e => (
      <React.Fragment key={e.id}>
        <Composition id={e.id} component={e.Main} durationInFrames={e.plan.total} fps={FPS} width={e.plan.W} height={e.plan.H} />
        <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={e.plan.shots.length} fps={FPS} width={e.plan.W} height={e.plan.H} />
      </React.Fragment>
    ))}
    <Still id="Cast" component={CastSheet} width={1920} height={1080} />
    <Still id="Faces" component={Faces} width={1920} height={1080} />
    <Still id="Props" component={Props} width={1920} height={1080} />
    <Still id="Sets" component={Sets} width={1920} height={1080} />
  </>
);
