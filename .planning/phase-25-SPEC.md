# Phase 25 — List pagination (SPEC)

## Goal

Align the frontend with backend **`PaginatedRead<T>`** list responses (`items`, `total`, `skip`, `limit`, `has_more`, `next_skip`) per TECHSPEC §4.1 / §4.3. Implement **MUI `TablePagination`** on Categories, Subcategories, Transactions, and Hangouts list screens (classic page-based UX only — no infinite scroll). Zustand mirrors store **the current list page’s `items`** only. MSW and tests return and assert the envelope. **Out of scope:** Phase 26 (`name` icontains, Autocomplete pickers).

## Types & API

- Add **`PaginatedRead<T>`** in `src/services/types.ts` with fields matching OpenAPI.
- Replace bare-array list response aliases with **`PaginatedRead<ResourceRead>`** in each resource `types.ts`.
- **`DefaultParams`:** `skip` / `limit` (defaults 0 / 50 on the wire as per backend).
- **`PICKER_LIST_PARAMS`:** `{ skip: 0, limit: 500 }` — used for MUI **Select** pickers (category filter on Subcategories, Subcategory form category list, Transactions filter subcategories/hangouts) until Phase 26 server search.

## Hooks

- **`useCategoriesQuery`**, **`useSubcategoriesQuery`**, **`useTransactionsQuery`**, **`useHangoutsQuery`:** response type is the paginated envelope; callers use **`data?.items`**, **`data?.total`**, etc.

## Zustand

- **`setFromQuery(items, …)`** receives **`items` from the current list query** (one page). Update store comments to state “current page” explicitly.
- **SubcategoryFormDialog:** stop syncing categories query into the global categories store (picker query must not overwrite the list mirror). Dialog uses local options from **`useCategoriesQuery(PICKER_LIST_PARAMS, { enabled: open })`** and **`data?.items`**.

## UI

- Each list screen: local state **`page`** (0-based) and **`rowsPerPage`**; build query params with **`skip = page * rowsPerPage`**, **`limit = rowsPerPage`**. Reset **`page`** to **0** when list filters change.
- **`TablePagination`:** `count={total}`, `page`, `rowsPerPage`, `onPageChange`, `onRowsPerPageChange` (reset page on size change). Place below the table container, styled consistently (e.g. `TablePagination` with `sx` using theme tokens).
- Header counts (e.g. “Categories (N)”) use **`total`** from the envelope when available, not only `items.length`.

## MSW / tests

- Service tests: handlers return **`PaginatedRead`** JSON; adjust expectations from bare arrays.
- Module tests (`Categories.test.tsx`, `Subcategories.test.tsx`, `Transactions.test.tsx`, `Hangouts.test.tsx`): same envelope for list GETs; fix any assertions on `data` shape.

## Verification

- `npm test && npx biome check .` before every commit.
- Manual: list screens paginate; filters reset page; CRUD still invalidates queries.

## Non-goals (Phase 26)

- Optional `name` query param, Autocomplete, debounced search, or splitting picker queries beyond large `limit` for Selects.
