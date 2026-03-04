# Project State

## Current Phase

Phase 15 — Remaining screens & CRUD on shadcn (complete). **Next:** Phase 16 (see ROADMAP / FRAMEWORK.md §6).

## Last Task Completed

Phase 15: Unified table state (STATE_ROW_MIN_HEIGHT, verticalAlign) on Subcategories, Transactions, and Hangouts tables; verified theme tokens used across list screens and CRUD dialogs; no new MUI patterns; shadcn/ui package not added (tweakcn-style alignment only).

## Next Task

1. Phase 16: Tests & coverage gate (see `.planning/phase-00-ROADMAP.md` and FRAMEWORK.md §6).

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 16; Phase 14 = theme, layout, Categories table; Phase 15 = remaining screens & CRUD on shadcn (table state + tokens); Phase 16 = tests & coverage gate (see `.planning/phase-00-ROADMAP.md`).

## Blockers

None.
