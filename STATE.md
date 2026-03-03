# Project State

## Current Phase

Phase 05 — Tests & Verification (complete). **Next:** Phase 06 — Subcategories List & Virtual.

## Last Task Completed

Phase 05: Vitest + RTL + MSW set up; unit tests for callbackApi (Bearer token), categories store, categories service; integration tests for ProtectedRoute, Categories screen (loading/success/error/empty/retry), Layout (Home/Categories links); coverage gate (80% lines/statements, 70% branches/functions); README and phase summary.

## Next Task

1. **If not done:** Merge `feature/phase-05-tests-verification` into `main` (--no-ff).
2. **Then:** GSD session start — Phase 06. Create branch `feature/phase-06-subcategories-list`, write `.planning/phase-06-SPEC.md`, implement subcategories service + store + list screen with virtualized table; add Subcategories to layout nav (see `.planning/phase-00-ROADMAP.md` Phase 06).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 12 (Subcategories/Transactions/Hangouts list + CRUD); Phase 06–08 = lists + virtualization, 09–12 = full CRUD UI (see `.planning/phase-00-ROADMAP.md` and `.planning/NEXT-PHASES.md`).

## Blockers

None.
