# Phase 26 — Searchable category/subcategory/hangout pickers (SPEC)

## Goal

Add optional **`name`** (case-insensitive contains) to list query types and wire it through the API client. Replace MUI **`Select`** pickers for **categories**, **subcategories**, and **hangouts** with MUI **`Autocomplete`** plus **debounced** server search. **Do not** add `name` to **`GET /transactions/`**. Fix **`SubcategoryFormDialog`** so picker data never overwrites **`useCategoriesStore`** (already uses local query; verify and align with Autocomplete). **Split Transactions** so subcategory/hangout **picker** queries are separate from the **transactions table** query and **do not** sync picker results into **`useSubcategoriesStore`** / **`useHangoutsStore`**. Add/extend **MSW** and **tests** for debounced search and selection.

## OpenAPI (verified)

- `GET /categories/`: `skip`, `limit`, `is_income`, `name` (optional string).
- `GET /subcategories/`: `skip`, `limit`, `belongs_to_income`, `category_id`, `name`.
- `GET /hangouts/`: `skip`, `limit`, `name`.
- `GET /transactions/`: no `name` param.

## Types & services

- **`DefaultParams`** / list param types: add **`name?: string | null`** where applicable (`categories` hook params, **`SubcategoriesListParams`**, **`HangoutsListParams`**).
- **`PICKER_LIST_PARAMS`**: keep **`skip: 0`**; use a **reasonable page size** (e.g. 50, aligned with default `limit`) for autocomplete pages; document that search is server-driven via `name`.
- Optional **`GET` by id** hooks (`useCategoryQuery`, `useSubcategoryQuery`, `useHangoutQuery`) so Autocomplete can show a stable label when the selected id is not in the current search result page.

## UI

- **`filterOptions={(o) => o}`** (or equivalent) so MUI does not filter client-side; server returns filtered `items`.
- Debounce **~300ms** on input before updating `name` in query params.
- **Year/month/day** selects on Transactions remain **Select** (not name search).
- **Bulk dialog**: shared debounced search + shared options for subcategory and hangout Autocompletes across rows (one search field per resource, or equivalent clear UX).

## Transactions module

- **Remove** `useEffect` that calls **`setSubcategoriesFromQuery`** / **`setHangoutsFromQuery`** from picker fetches.
- **TransactionFormDialog** / **BulkTransactionsDialog**: own picker queries or receive options from **dedicated** picker queries (not the table query); no Zustand clobbering.

## MSW / tests

- Handlers: when `name` query present, filter mock arrays with icontains on `name` (or equivalent).
- Service tests: assert `name` is passed in params.
- Module/integration tests: Autocomplete search + selection where practical.

## Verification

- `npm test && npx biome check .` before every commit.

## Non-goals

- Infinite scroll in Autocomplete; transactions list `name` filter; changing non-picker Selects (e.g. type income/expense) unless required for consistency.
