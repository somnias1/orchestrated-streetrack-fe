# Project State

## Current Phase

Phase 10 — Subcategories Full CRUD UI (complete). **Next:** Phase 11 — Transactions Full CRUD UI.

## Last Task Completed

Phase 10: Subcategories service CRUD (create, get, update, delete), store create/update/delete actions, subcategory form dialog (Zod, category picker), delete confirmation dialog, Subcategories screen Create button and table Edit/Delete actions; service/store/screen tests and CRUD flow integration tests; gate and phase summary.

## Next Task

1. **If not done:** Merge `feature/phase-10-subcategories-crud` into `main` (--no-ff).
2. **Then:** GSD session start — Phase 11. Create branch `feature/phase-11-transactions-crud`, write `.planning/phase-11-SPEC.md`, implement Transactions create/edit/delete UI (subcategory/hangout pickers, forms); see `.planning/phase-00-ROADMAP.md` Phase 11.

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 12 (Subcategories/Transactions/Hangouts list + CRUD); Phase 06–08 = lists + virtualization, 09–12 = full CRUD UI (see `.planning/phase-00-ROADMAP.md` and `.planning/NEXT-PHASES.md`).

## Blockers

None.
