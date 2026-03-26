# Project State

## Current Phase

Phase 25 — List pagination (complete). Next: Phase 26 — Searchable category/subcategory/hangout pickers (see ROADMAP).

## Last Task Completed

Phase 25: `PaginatedRead<T>` types, `TablePagination` on four list screens, Zustand mirrors for current page `items`, `PICKER_LIST_PARAMS` for Select pickers, MSW/tests updated; `.planning/phase-25-SPEC.md` + `phase-25-SUMMARY.md`.

## Next Task

**Phase 26:** Optional `name` (icontains) on list queries; MUI `Autocomplete` + debounced server search for category/subcategory/hangout pickers; tests (see TECHSPEC §4.3 and ROADMAP).

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Next phases**: ROADMAP includes Phases **25–26** after 24 — Phase 25 list pagination (API envelope + `TablePagination`); Phase 26 searchable comboboxes for category/subcategory/hangout pickers — see `.planning/phase-00-ROADMAP.md` and TECHSPEC §4.3.

## Blockers

None.
