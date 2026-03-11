# Project State

## Current Phase

Phase 21 — Home dashboard (complete).

## Last Task Completed

Phase 21: Dashboard service (types, constants, React Query hooks) and Home screen with balance, month balance (year+month selector), due periodic expenses; loading/error + retry per section.

## Next Task

1. Merge `feature/phase-21-home-dashboard` to main with --no-ff.
2. Phase 22 — Bulk transactions: POST /transactions/bulk, BulkTransactionsDialog.

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 24; Phases 18–24 = finance stream (UX, filters, periodic, dashboard, bulk, import/export, tests) — see `.planning/phase-00-ROADMAP.md`.

## Blockers

None.
