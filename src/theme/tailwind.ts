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

export const themeTokens = {
  background: 'var(--color-gray-900)',
  surface: 'var(--color-gray-800)',
  primary: 'var(--color-indigo-500)',
  border: 'var(--color-gray-600)',
  textPrimary: 'var(--color-gray-100)',
  textSecondary: 'var(--color-gray-400)',
  success: 'var(--color-green-600)',
  error: 'var(--color-red-600)',
  warning: 'var(--color-amber-600)',
} as const;
