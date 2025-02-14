import { create } from 'zustand';

export type themeMode = 'light' | 'dark'

type ThemeState = {
  theme: themeMode
  isSystem: boolean,
  setTheme: (theme: themeMode)=> void
  setSystemTheme: (flag: boolean)=> void
}

const useThemeStore = create<ThemeState>(set => ({
  theme: 'light',
  isSystem: false,
  setTheme: (theme: themeMode)=> {
    set({theme});
  },
  setSystemTheme: (flag: boolean) => {
    set(state => ({...state, isSystem: flag}));
  },
}));

export default useThemeStore;
