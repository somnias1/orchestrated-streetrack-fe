# Phase 14 — Summary

**Theme, Layout & Categories Table Alignment**

## Done

1. **Tweakcn-style theme (§3.7)**
   - Added `src/theme/theme.css` with `@import "tailwindcss"` and semantic CSS variables: `--background`, `--foreground`, `--card`, `--primary`, `--border`, `--muted`, `--success`, `--destructive`, `--warning`, `--disabled`.
   - Dark (default) and light value sets via `:root` / `[data-theme="dark"]` and `[data-theme="light"]`.
   - Updated `src/theme/tailwind.ts`: `themeTokens` now reference these semantic variables so all consumers (layout, tables, dialogs) respect light/dark without hardcoded colors.

2. **Light/dark toggle (§3.4, §3.7)**
   - `src/theme/mode.ts`: `getThemeMode()`, `setThemeMode()`, `applySavedTheme()`; persistence in `localStorage` key `theme-mode`.
   - `src/modules/theme/store.ts`: Zustand store with `mode`, `setMode`, `toggle`; applies to `document.documentElement` via `data-theme`.
   - `src/index.tsx`: `applySavedTheme()` called before first paint; import of `theme/theme.css`.
   - Layout app bar: theme toggle (IconButton + Tooltip) using MUI `LightModeRounded` / `DarkModeRounded`; default remains dark.

3. **Layout shell (§3.2, §3.4)**
   - Layout already used `themeTokens`; with tokens now bound to CSS variables, shell (background, surface, border, text, primary) respects light/dark. No structural change; spacing (e.g. main `p: 3`) unchanged.

4. **Categories table state alignment (§3.7, §5.1)**
   - Table already used `themeTokens` and shared column grid (COLUMN_SIZES / GRID_TEMPLATE) for header and virtualized rows.
   - Added consistent `STATE_ROW_MIN_HEIGHT` for loading/error/empty TableCell so the body area has stable height and no layout shift when switching between states; `verticalAlign: 'middle'` for state content.

## Commits

- `chore(planning): add phase-14 spec (theme, layout, categories table)`
- `feat(theme): tweakcn-style CSS variables, light/dark toggle, layout uses tokens`
- `fix(categories): align table state row min height for loading/error/empty`

## Gate

`npm test && npx biome check .` passed before each commit.

## Not in scope (Phase 15)

- Migrating other screens (Subcategories, Transactions, Hangouts) to shadcn or new components.
- New routes or features.
