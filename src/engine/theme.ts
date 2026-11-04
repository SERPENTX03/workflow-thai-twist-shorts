import cast from '../cast.json';
// Tokens from the old kit.css :root, as TS constants.
export const T = {
  sky0: '#0b1328', sky1: '#1c2c4f', moon: '#f4ecd4',
  wall0: '#33465c', wall1: '#26364a', floor0: '#4a3a31', floor1: '#2e241f', lamp: '#ffcf8a',
  ink: '#18202e', cream: '#efe8da', paper: '#f6f1e6', white: '#f6f2ea', mute: '#8a97ab',
  red: '#e5383b', gold: '#f6c445', ok: '#3fa66b',
  day0: '#e9e2d2', day1: '#cfc4ad', wood0: '#6b4a2f', wood1: '#3e2a1b',
  skin: '#e7b38c', skinD: '#c98f6b', hair: '#16161c', shirt: '#2f5f8f', pants: '#1d2736',
  display: 'Kanit, sans-serif', ui: '"Plex Thai", sans-serif',
  captionY: 1390,
} as const;

/** Relative heights in cm (520 svg units = 170 cm for adults). */
export const HEIGHT_CM: Record<string, number> = {
  M1: 174, M2: 167, W1: 166, W2: 156, A1: 154, E1: 162, B1: 127, G1: 122,
  man: 170, woman: 158, auntie: 150, elder: 160,
  raincoat: 165, student: 168, kid: 125, 'kid-girl': 120, monk: 160,
  'teen-girl': 158, uncle: 172, 'young-woman': 162, grandpa: 162, grandma: 150,
  ...Object.fromEntries(Object.entries(cast).filter(([, c]) => typeof c === 'object' && 'cm' in c).map(([id, c]) => [id, (c as {cm: number}).cm])),
};
