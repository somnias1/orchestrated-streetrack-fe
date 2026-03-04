# Project State

## Current Phase

Phase 14 — Theme, layout & Categories table alignment (complete). **Next:** Phase 15+ (see ROADMAP / FRAMEWORK.md §6).

## Last Task Completed

Phase 14: Tweakcn-style theme (semantic CSS variables in theme.css, light/dark value sets); light/dark toggle in layout with localStorage persistence; theme mode store and applySavedTheme before first paint; layout and Categories table use theme tokens; Categories table state row min height aligned for loading/error/empty.

## Next Task

1. Merge `feature/phase-14-theme-layout-categories-table` into `main` (--no-ff).
2. Future phases (Phase 15: Remaining screens & CRUD on shadcn) from `.planning/phase-00-ROADMAP.md` and FRAMEWORK.md §6.

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 16; Phase 14 = theme, layout, Categories table; Phase 15 = remaining screens & CRUD on shadcn (see `.planning/phase-00-ROADMAP.md`).

## Blockers

None.
