# Project State

## Current Phase

Phase 06 — Subcategories List & Virtual (complete). **Next:** Phase 07 — Transactions List & Virtual.

## Last Task Completed

Phase 06: Subcategories service (types, constants, fetchSubcategories), Zustand store, Subcategories screen with virtualized table (Name, Description, Type chip, Category ID); route and layout nav (Subcategories link); unit tests (service, store), integration tests (Subcategories screen loading/success/error/empty/retry), Layout test updated for Subcategories link; coverage gate and phase summary.

## Next Task

1. **If not done:** Merge `feature/phase-06-subcategories-list` into `main` (--no-ff).
2. **Then:** GSD session start — Phase 07. Create branch `feature/phase-07-transactions-list`, write `.planning/phase-07-SPEC.md`, implement transactions service + store + list screen with virtualized table; add Transactions to layout nav (see `.planning/phase-00-ROADMAP.md` Phase 07).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 12 (Subcategories/Transactions/Hangouts list + CRUD); Phase 06–08 = lists + virtualization, 09–12 = full CRUD UI (see `.planning/phase-00-ROADMAP.md` and `.planning/NEXT-PHASES.md`).

## Blockers

None.
