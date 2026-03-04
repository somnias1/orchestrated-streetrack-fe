/**
 * Theme mode (light/dark) for tweakcn-style theme.
 * Persisted in localStorage; applied to document.documentElement as data-theme.
 */

const STORAGE_KEY = 'theme-mode';

export type ThemeMode = 'light' | 'dark';

export function getThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

export function setThemeMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, mode);
  document.documentElement.setAttribute('data-theme', mode);
}

/** Call before first paint so theme is applied without flash */
export function applySavedTheme(): void {
  const mode = getThemeMode();
  document.documentElement.setAttribute('data-theme', mode);
}
