# Project State

## Current Phase

Phase 13 — React Query services (complete). **Next:** Phase 14+ (see ROADMAP / FRAMEWORK.md §6).

## Last Task Completed

Phase 13: TanStack React Query for all resources; hooks in services (categories, subcategories, transactions, hangouts); modules refactored to use hooks; Zustand stores removed; screen tests wrapped with QueryClientProvider; service test path assertions aligned with constants; gate and phase summary.

## Next Task

1. Merge `feature/phase-13-react-query-services` into `main` (--no-ff).
2. Future phases (Phase 14: Theme, layout & Categories table alignment) from `.planning/phase-00-ROADMAP.md` and FRAMEWORK.md §6.

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 12 (Subcategories/Transactions/Hangouts list + CRUD); Phase 06–08 = lists + virtualization, 09–12 = full CRUD UI (see `.planning/phase-00-ROADMAP.md` and `.planning/NEXT-PHASES.md`).

## Blockers

None.
