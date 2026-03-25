# Project State

## Current Phase

Phase 24 — Finance expansion tests and polish (complete). Next: Phase 25 — List pagination (see ROADMAP).

## Last Task Completed

Phase 24: Vitest tests for dashboard and transaction-manager; full Playwright E2E (real Auth0, real backend, page objects, auth setup, navigation, dashboard, CRUD smoke, import/export); §1.3 mapping; README E2E section.

## Next Task

**Phase 25 (spec-first):** Commit `.planning/phase-25-SPEC.md`, then implement paginated list API types (`PaginatedRead<T>`), React Query hooks, and classic `TablePagination` on Categories, Subcategories, Transactions, and Hangouts (see TECHSPEC §4.3 and `.planning/phase-00-ROADMAP.md`). **Phase 26** follows: `name` filter + MUI Autocomplete pickers per ROADMAP.

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP includes Phases **25–26** after 24 — Phase 25 list pagination (API envelope + `TablePagination`); Phase 26 searchable comboboxes for category/subcategory/hangout pickers — see `.planning/phase-00-ROADMAP.md` and TECHSPEC §4.3.

## Blockers

None.
