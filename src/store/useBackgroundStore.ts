import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type BackgroundTheme =
  | 'home'
  | 'writing'
  | 'shapes'
  | 'progress'
  | 'stickers'
  | 'settings';

interface BackgroundState {
  currentTheme: BackgroundTheme;
  setTheme: (theme: BackgroundTheme) => void;
}

export const useBackgroundStore = create<BackgroundState>()(
  immer((set) => ({
    currentTheme: 'home',
    setTheme: (theme) => set((state) => {
      state.currentTheme = theme;
    }),
  }))
);
