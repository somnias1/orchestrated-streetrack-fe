# Project State

## Current Phase

Phase 27 — Complete

## Last Task Completed

Phase 27 merged to `main`: react-hook-form + @hookform/resolvers; Category, Subcategory, Transaction, and BulkTransactions dialogs on RHF + zodResolver; bulk dialog uses useFieldArray, memoized rows, lifted picker lists via `externalOptions`; SPEC + SUMMARY committed.

## Next Task

Define or start the next ROADMAP phase when ready.

## Key Decisions

- **Server state + global store (Phase 13):** React Query is the source of truth for fetch, cache, mutations, and refetch. Zustand stores (per resource) hold a mirror (`items`, `loading`, `error`) synced from the query in screens via `setFromQuery`, so any component can read from the store without using the query hook.
- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.
- **Phase 27**: Introduce react-hook-form + @hookform/resolvers for all form dialogs. BulkTransactionsDialog optimized via useFieldArray (row-level re-renders), React.memo on BulkRow, and lifted picker queries (externalOptions prop on Autocomplete pickers).

## Blockers

None.
