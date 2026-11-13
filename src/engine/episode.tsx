import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CastSprite} from '../cast/CastSprite';
import {Caption} from '../kit/Captions';
import {planStory, type Shot, type Story} from './story';
import {timePhrases, type VoLine} from './phrases';
import {T} from './theme';
import {genericScenes} from '../scenes';

/** A shot is a pure function of its own frame `f` (0..len). No state, no Math.random. */
export type ShotProps = {shot: Shot; f: number; len: number; W: number; H: number};
export type ShotComponent = React.FC<ShotProps>;

const Placeholder: ShotComponent = ({shot, W, H}) => (
  <AbsoluteFill style={{background: `linear-gradient(${T.sky1}, ${T.sky0})`, alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: T.ui, fontWeight: 700, fontSize: Math.round(W / 20), color: T.mute, textAlign: 'center'}}>
      scene “{shot.scene}”{shot.view ? ` · ${shot.view}` : ''}
      <div style={{fontSize: Math.round(W / 36), opacity: 0.7}}>#{shot.i} · {shot.frames}f · {Math.round(H)}px</div>
    </div>
  </AbsoluteFill>
);

const ShotView: React.FC<{shot: Shot; Scene: ShotComponent; story: Story; W: number; H: number; f: number; vo?: VoLine}> = ({shot, Scene, story, W, H, f, vo}) => {
  // phrase mode: one short line at a time, switched at the voice's pauses (src/engine/phrases.ts); red boxes stay whole
  const phrases = shot.text && story.captionMode === 'phrase' && shot.style !== 'red'
    ? timePhrases(shot.text, vo, shot.from, shot.frames, story.phraseChars ?? 22) : null;
  const cur = phrases ? [...phrases].reverse().find(p => f >= p.from) ?? phrases[0] : null;
  return (
    <AbsoluteFill>
      <Scene shot={shot} f={f} len={shot.frames} W={W} H={H} />
      {cur
        ? <Caption key={cur.from} text={cur.text} look={story.captionLook} landscape={W > H} frame={f - cur.from} />
        : shot.text && <Caption text={shot.text} red={shot.style === 'red'} look={story.captionLook} landscape={W > H} frame={f} />}
    </AbsoluteFill>
  );
};

const LocalFrame: React.FC<{children: (f: number) => React.ReactNode}> = ({children}) => <>{children(useCurrentFrame())}</>;

/** Registers a film: `Main` plays every shot in a Sequence, `Board` shows one key frame per shot. */
export type EpisodeAudio = {voice?: string; score?: string};

export function defineEpisode(id: string, story: Story, scenes: Record<string, ShotComponent> = {}, audio: EpisodeAudio = {}, vo: VoLine[] = []) {
  const plan = planStory(story);
  const voOf = new Map(vo.map(v => [v.shot, v]));
  const pick = (s: Shot) => scenes[s.scene] ?? genericScenes[s.scene] ?? Placeholder;

  const Main: React.FC = () => (
    <AbsoluteFill style={{background: T.sky0}}>
      <CastSprite />
      {audio.score && <Audio src={staticFile(audio.score)} />}
      {audio.voice && <Audio src={staticFile(audio.voice)} />}
      {plan.shots.map(s => (
        <Sequence key={s.i} from={s.from} durationInFrames={s.frames} layout="none">
          <LocalFrame>{f => <ShotView shot={s} Scene={pick(s)} story={story} W={plan.W} H={plan.H} f={f} vo={voOf.get(s.i)} />}</LocalFrame>
        </Sequence>
      ))}
    </AbsoluteFill>
  );

  const Board: React.FC = () => {
    const f = useCurrentFrame();
    const s = plan.shots[Math.min(f, plan.shots.length - 1)];
    const key = Math.min(s.frames - 1, Math.round(s.frames * 0.6));
    return (
      <AbsoluteFill style={{background: T.sky0}}>
        <CastSprite />
        <ShotView shot={s} Scene={pick(s)} story={story} W={plan.W} H={plan.H} f={key} vo={voOf.get(s.i)} />
      </AbsoluteFill>
    );
  };

  return {id, plan, Main, Board};
}
