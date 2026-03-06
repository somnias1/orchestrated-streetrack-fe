# Project State

## Current Phase

Phase 16 — Tests & coverage gate (complete). **Phase 04 bugfix** (virtual table full-width alignment for categoriesTable) complete. **Next:** Phase 17+ per ROADMAP / FRAMEWORK.md §6.

## Last Task Completed

Phase 04 bugfix: virtual table full-width alignment in `categoriesTable` (TABLE_WIDTH, GRID_TEMPLATE_FR, tableLayout fixed, percentage header widths). Phase 16: §1.3 → test mapping documented; coverage gate verified; gate passing.

## Next Task

1. Phase 17+ (or backlog): New features (e.g. import/export UI, reports) per `.planning/phase-00-ROADMAP.md` and FRAMEWORK.md §6.

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP extended to Phase 16; Phase 14 = theme, layout, Categories table; Phase 15 = remaining screens & CRUD on shadcn (table state + tokens); Phase 16 = tests & coverage gate (see `.planning/phase-00-ROADMAP.md`).

## Blockers

None.
