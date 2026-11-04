import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {parseCaption} from '../engine/story';
import {T} from '../engine/theme';

type Props = {text: string; red?: boolean; look?: 'bold' | 'folk'; landscape?: boolean; frame?: number};

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Caption with slide-up mask entrance (0.26 s, 0.08 s stagger per line) and gold / red keyword marks. */
export const Caption: React.FC<Props> = ({text, red, look = 'bold', landscape, frame}) => {
  const cur = useCurrentFrame();
  const f = frame ?? cur;
  const lines = parseCaption(text);
  const size = landscape ? 52 : look === 'folk' ? 56 : 74;
  return (
    <div style={{
      position: 'absolute', left: landscape ? 120 : 60, right: landscape ? 120 : 60,
      top: landscape ? undefined : T.captionY, bottom: landscape ? 70 : undefined,
      transform: landscape ? undefined : 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center',
    }}>
      {lines.map((marks, li) => {
        const t0 = li * 2.4;
        const y = interpolate(f - t0, [0, 8], [105, 0], {...clampOpts, easing: Easing.out(Easing.cubic)});
        const sx = red ? interpolate(f - t0, [0, 10], [0.6, 1], {...clampOpts, easing: Easing.out(Easing.back(2.2))}) : 1;
        return (
          <div key={li} style={{overflow: 'hidden', padding: '0 4px'}}>
            <span style={{
              display: 'block', transform: `translateY(${y}%) scaleX(${sx})`,
              fontFamily: T.display, fontWeight: red ? 700 : 600, fontSize: size, lineHeight: 1.32, color: T.white,
              textShadow: red ? 'none' : '0 4px 22px rgba(0,0,0,.75)',
              background: red ? T.red : look === 'folk' ? 'rgba(10,14,24,.72)' : undefined,
              borderRadius: red ? 12 : look === 'folk' ? 14 : undefined,
              padding: red || look === 'folk' ? '0 28px' : undefined,
            }}>
              {marks.map((m, i) => (
                <span key={i} style={{
                  color: m.kind === 'hl' ? (red ? '#fff' : T.gold) : m.kind === 'hl-red' ? (red ? '#fff' : T.red) : undefined,
                  textDecoration: red && m.kind !== 'plain' ? 'underline 6px' : undefined,
                  textUnderlineOffset: 12,
                }}>{m.text}</span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
};
