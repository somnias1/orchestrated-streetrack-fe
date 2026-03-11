# Project State

## Current Phase

Phase 20 — Periodic expenses (subcategories) (complete).

## Last Task Completed

Phase 20: Subcategory is_periodic and due_day in types, form (Zod + dialog), and list (Periodic and Due day columns).

## Next Task

1. Merge `feature/phase-20-periodic-expenses` to main with --no-ff.
2. Phase 21 — Home dashboard: balance, month balance, due periodic expenses (API client + Home screen).

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 24; Phases 18–24 = finance stream (UX, filters, periodic, dashboard, bulk, import/export, tests) — see `.planning/phase-00-ROADMAP.md`.

## Blockers

None.
