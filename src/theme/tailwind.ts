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
