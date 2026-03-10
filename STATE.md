# Project State

## Current Phase

Phase 18 — UX/UI improvements (complete).

## Last Task Completed

Phase 18: Type as MUI Chips (already present); Transactions Add menu (Transaction/Bulk); default current-month filter for transactions; Hangouts table action colors (primary/error). SUMMARY and merge pending.

## Next Task

1. Merge `feature/phase-18-ux-improvements` to main with --no-ff.
2. Phase 19 — List filters and sort (Categories by type; Subcategories by type and category; Transactions by date tree, subcategory, hangout; sort by date newest first; default current month on Transactions).

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 24; Phases 18–24 = finance stream (UX, filters, periodic, dashboard, bulk, import/export, tests) — see `.planning/phase-00-ROADMAP.md`.

## Blockers

None.
