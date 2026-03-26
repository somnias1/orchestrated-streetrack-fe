# Phase 25 — List pagination (SUMMARY)

## Delivered

- **`PaginatedRead<T>`** in `src/services/types.ts` with `DEFAULT_LIST_LIMIT` (50) and **`PICKER_LIST_PARAMS`** (`skip: 0`, `limit: 500`) for MUI Select pickers until Phase 26.
- **`toPaginatedRead()`** in `src/services/pagination.ts` for tests and MSW.
- List response types for categories, subcategories, transactions, hangouts now use **`PaginatedRead<ResourceRead>`**.
- **List screens:** `page` / `rowsPerPage` state, query `skip`/`limit`, **`TablePagination`** below each table, header counts use **`total`**, filters reset page (with Biome suppressions where the exhaustive-deps rule disagrees with intentional reset effects).
- **Transactions:** picker queries use **`PICKER_LIST_PARAMS`** for subcategories and hangouts; list query stays paginated.
- **Subcategories:** category filter dropdown uses **`PICKER_LIST_PARAMS`** for `useCategoriesQuery`.
- **SubcategoryFormDialog:** `useCategoriesQuery(PICKER_LIST_PARAMS)` when open; **removed** syncing categories into the global Zustand store so the list mirror is not overwritten by the picker fetch.
- **Zustand** store comments updated: mirrors hold **current list page** `items` only.
- **MSW / Vitest:** list GET handlers return the paginated envelope; expectations updated.

## Commits / gate

- Pre-app: `.planning/phase-25-SPEC.md`; Biome format on `rsbuild.config.ts` where needed for `npx biome check .`.
- Implementation: `npm test && npx biome check .` before commits.

## Follow-ups (Phase 26)

- Optional `name` query, Autocomplete, debounced search; narrow picker queries instead of `limit: 500` where appropriate.
