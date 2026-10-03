export const palette = {
  primary: '#0B57D0',
  primaryDark: '#0A4FBF',
  blue: '#1D6FE0',
  green: '#0B7A4F',
  greenDeep: '#0B6B43',
  greenBright: '#0B9A63',
  amber: '#92650F',
  orange: '#B45309',
  red: '#B91C1C',
  purple: '#7C3AED',
};

export const lightTheme = {
  bg: '#F5F7FA',
  card: '#FFFFFF',
  text: '#14181F',
  sub: '#5B6472',
  mute: '#8B94A3',
  border: '#E6E9F0',
  field: '#F3F5FA',
  chip: '#EEF1F6',
  track: '#E8EAEE',
  tintBlue: '#E4ECFB',
  tintGreen: '#D6F5E6',
  tintAmber: '#FDF0DC',
  tintOrange: '#FDE8D2',
  tintRed: '#FDE8E6',
  tintPurple: '#E7E6FB',
};

export const darkTheme: typeof lightTheme = {
  bg: '#0E1116',
  card: '#181C23',
  text: '#F1F3F7',
  sub: '#A4ACB9',
  mute: '#7D8696',
  border: '#272D38',
  field: '#1F242D',
  chip: '#222833',
  track: '#2A303B',
  tintBlue: '#17284A',
  tintGreen: '#12382A',
  tintAmber: '#3A2E14',
  tintOrange: '#3A2A16',
  tintRed: '#3D1D1B',
  tintPurple: '#25234A',
};

export type Theme = typeof lightTheme;

export const heading = { fontWeight: '700' as const, letterSpacing: -0.2 };
