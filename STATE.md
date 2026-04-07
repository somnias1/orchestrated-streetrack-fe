# Project State

## Current Phase

Phase 27 — react-hook-form migration + bulk dialog optimization (in progress)

## Last Task Completed

Phase 26: optional `name` on list params; `CategoryAutocomplete` / `SubcategoryAutocomplete` / `HangoutAutocomplete` + debounced search; GET-by-id queries; Transactions picker/store split; SubcategoryFormDialog uses local category picker + `useCategoryQuery`; MSW and service tests; `.planning/phase-26-SPEC.md` + `phase-26-SUMMARY.md`.

## Next Task

Create branch feature/phase-27-rhf-migration. Install react-hook-form + @hookform/resolvers. Migrate all form dialogs to useForm + zodResolver. Refactor BulkTransactionsDialog with useFieldArray, memoized rows, and lifted picker queries.

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Phase 27**: Introduce react-hook-form + @hookform/resolvers for all form dialogs. BulkTransactionsDialog optimized via useFieldArray (row-level re-renders), React.memo on BulkRow, and lifted picker queries (externalOptions prop on Autocomplete pickers).

## Blockers

None.
