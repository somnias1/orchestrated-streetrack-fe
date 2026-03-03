# Project State

## Current Phase

Phase 08 — Hangouts List & Virtual (complete). **Next:** Phase 09 — Categories Full CRUD UI.

## Last Task Completed

Phase 08: Hangouts service (types, constants, fetchHangouts), Zustand store, Hangouts screen with virtualized table (Name, Description, Date); route and layout nav (Hangouts link); unit tests (service, store), integration tests (Hangouts screen loading/success/error/empty/retry), Layout test updated for Hangouts link; coverage gate and phase summary. Test script updated with `--no-file-parallelism` for stable MSW list/retry tests.

## Next Task

1. **If not done:** Merge `feature/phase-08-hangouts-list` into `main` (--no-ff).
2. **Then:** GSD session start — Phase 09. Create branch `feature/phase-09-categories-crud`, write `.planning/phase-09-SPEC.md`, implement Categories create/edit/delete UI (forms, Zod, POST/PATCH/DELETE); see `.planning/phase-00-ROADMAP.md` Phase 09.

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 12 (Subcategories/Transactions/Hangouts list + CRUD); Phase 06–08 = lists + virtualization, 09–12 = full CRUD UI (see `.planning/phase-00-ROADMAP.md` and `.planning/NEXT-PHASES.md`).

## Blockers

None.
