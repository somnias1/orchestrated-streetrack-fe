# Project State

## Current Phase

Phase 18 — UX/UI improvements (in progress).

## Last Task Completed

Phase 17 merged: TECHSPEC §4.1/§4.3 updated; types (SubcategoryRead/TransactionRead with names + IDs); tables display names only; edit flows use IDs from API; tests updated; gate passing.

## Next Task

1. Create branch `feature/phase-18-ux-improvements`, spec `.planning/phase-18-SPEC.md`, implement type chips, Transaction/Bulk menu, transactions default current month, Hangouts action colors (per `.planning/phase-00-ROADMAP.md`).

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 24; Phases 18–24 = finance stream (UX, filters, periodic, dashboard, bulk, import/export, tests) — see `.planning/phase-00-ROADMAP.md`.

## Blockers

None.
