export const FPS = 30;

export const FORMATS = {
  portrait: {format: 'portrait', W: 1080, H: 1920, target: [55, 80], capChars: 26},
  landscape: {format: 'landscape', W: 1920, H: 1080, target: [600, 720], capChars: 42},
} as const;

export type FormatName = keyof typeof FORMATS;
