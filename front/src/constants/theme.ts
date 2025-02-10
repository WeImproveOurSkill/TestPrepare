// src/styles/theme.ts
import colors, { Colors } from './colors';

export const lightTheme: Colors = {
  ...colors,
};

export const darkTheme: Colors = {
  ...colors,
  background: {
    default: '#1A1A1A',
    grey: '#333333',
    dark: '#000000',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    light: '#999999',
    white: '#FFFFFF',
  },
};

export type Theme = Colors;
