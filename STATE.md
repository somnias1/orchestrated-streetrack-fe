# Project State

## Current Phase

Phase 23 — Transaction manager import/export (complete).

## Last Task Completed

Phase 23: Transaction manager service (import preview, export CSV); ImportTransactionsDialog (paste → preview → bulk); Export CSV button using current filters; Import in Add menu.

## Next Task

Phase 24 — Finance expansion tests and polish (dashboard, bulk, import/export, filters, periodic; §1.3 mapping; coverage gate).

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 24; Phases 18–24 = finance stream (UX, filters, periodic, dashboard, bulk, import/export, tests) — see `.planning/phase-00-ROADMAP.md`.

## Blockers

None.
