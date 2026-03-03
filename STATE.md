# Project State

## Current Phase

Phase 07 — Transactions List & Virtual (complete). **Next:** Phase 08 — Hangouts List & Virtual.

## Last Task Completed

Phase 07: Transactions service (types, constants, fetchTransactions), Zustand store, Transactions screen with virtualized table (Description, Value, Date, Subcategory ID, Hangout ID); route and layout nav (Transactions link); unit tests (service, store), integration tests (Transactions screen loading/success/error/empty/retry), Layout test updated for Transactions link; coverage gate and phase summary. Retry tests in Subcategories and Transactions updated to use pathname-based MSW matcher for robustness.

## Next Task

1. **If not done:** Merge `feature/phase-07-transactions-list` into `main` (--no-ff).
2. **Then:** GSD session start — Phase 08. Create branch `feature/phase-08-hangouts-list`, write `.planning/phase-08-SPEC.md`, implement hangouts service + store + list screen with virtualized table; add Hangouts to layout nav (see `.planning/phase-00-ROADMAP.md` Phase 08).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 12 (Subcategories/Transactions/Hangouts list + CRUD); Phase 06–08 = lists + virtualization, 09–12 = full CRUD UI (see `.planning/phase-00-ROADMAP.md` and `.planning/NEXT-PHASES.md`).

## Blockers

None.
