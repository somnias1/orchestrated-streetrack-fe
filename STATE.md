# Project State

## Current Phase

Phase 12 — Hangouts Full CRUD UI (complete). **Next:** Phase 13+ (see ROADMAP / FRAMEWORK.md §6).

## Last Task Completed

Phase 12: Hangouts service CRUD (create, get, update, delete), store create/update/delete actions, hangout form dialog (Zod), delete confirmation dialog, Hangouts screen Create button and table Edit/Delete actions; service/store/screen/table tests and CRUD flow integration tests; gate and phase summary.

## Next Task

1. Merge `feature/phase-12-hangouts-crud` into `main` (--no-ff).
2. Future phases (e.g. import/export UI, reports) from `.planning/phase-00-ROADMAP.md` and FRAMEWORK.md §6.

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 12 (Subcategories/Transactions/Hangouts list + CRUD); Phase 06–08 = lists + virtualization, 09–12 = full CRUD UI (see `.planning/phase-00-ROADMAP.md` and `.planning/NEXT-PHASES.md`).

## Blockers

None.
