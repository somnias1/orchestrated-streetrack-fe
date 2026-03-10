/**
 * Theme tokens and Tailwind color helper for MUI sx.
 * Use twColor(color, shade) so Tailwind theme values (e.g. var(--color-gray-800)) are used consistently.
 */
type Shade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export function twColor(color: string, shade: Shade): string {
  return `var(--color-${color}-${shade})`;
}

/** Semantic tokens (tweakcn-style); values switch with [data-theme] in theme.css */
export const themeTokens = {
  background: 'var(--background)',
  surface: 'var(--card)',
  primary: 'var(--primary)',
  border: 'var(--border)',
  textPrimary: 'var(--foreground)',
  textSecondary: 'var(--muted)',
  success: 'var(--success)',
  error: 'var(--destructive)',
  warning: 'var(--warning)',
  disabled: 'var(--disabled)',
} as const;

/**
 * Shared MUI Select styling for dark/light theme readability.
 * Use on FormControl (label + outline) and Select (field + dropdown).
 */
export const selectFormControlSx = {
  '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
  '& .MuiInputLabel-root.Mui-focused': { color: themeTokens.textSecondary },
} as const;

export const selectThemedSx = {
  backgroundColor: themeTokens.surface,
  color: themeTokens.textPrimary,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: themeTokens.border },
  '& .MuiSelect-icon': { color: themeTokens.textSecondary },
  '& .MuiInputBase-input': { color: themeTokens.textPrimary },
} as const;

/** MenuProps.PaperProps.sx for Select dropdown; keeps list readable in dark theme */
export const selectMenuPaperSx = {
  backgroundColor: themeTokens.surface,
  color: themeTokens.textPrimary,
  border: `1px solid ${themeTokens.border}`,
  '& .MuiMenuItem-root': { color: themeTokens.textPrimary },
  '& .MuiMenuItem-root:hover': { backgroundColor: themeTokens.background },
  '& .MuiMenuItem-root.Mui-selected': {
    backgroundColor: themeTokens.background,
  },
  '& .MuiMenuItem-root.Mui-selected:hover': {
    backgroundColor: themeTokens.background,
  },
} as const;
