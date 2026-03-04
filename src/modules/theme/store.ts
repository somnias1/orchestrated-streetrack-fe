import { create } from 'zustand';
import type { ThemeMode } from '../../theme/mode';
import { setThemeMode as applyThemeMode, getThemeMode } from '../../theme/mode';

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: getThemeMode(),
  setMode: (mode) => {
    applyThemeMode(mode);
    set({ mode });
  },
  toggle: () => {
    set((state) => {
      const next: ThemeMode = state.mode === 'dark' ? 'light' : 'dark';
      applyThemeMode(next);
      return { mode: next };
    });
  },
}));
