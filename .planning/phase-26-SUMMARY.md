# Phase 26 — Searchable pickers (SUMMARY)

## Delivered

- **List query `name` (icontains):** `CategoriesListParams`, `SubcategoriesListParams`, and `HangoutsListParams` include optional `name`; hooks pass it through to the API. **`GET /transactions/`** unchanged (no `name`).
- **`PICKER_PAGE_LIMIT` (50)** and **`PICKER_LIST_PARAMS`** use that limit for server-driven Autocomplete pages (replacing the previous 500-item Select bulk fetch).
- **GET-by-id hooks:** `useCategoryQuery`, `useSubcategoryQuery`, `useHangoutQuery` so Autocomplete can show a stable label when the selected id is not on the current search page.
- **Shared pickers:** `CategoryAutocomplete`, `SubcategoryAutocomplete`, `HangoutAutocomplete` in `src/components/pickers/` — MUI `Autocomplete`, `filterOptions={(x) => x}`, debounced `name` via `useDebouncedValue` + `PICKER_SEARCH_DEBOUNCE_MS` (300ms), optional `queryEnabled` for dialogs.
- **Subcategories:** category filter uses `CategoryAutocomplete`; no separate `useCategoriesQuery` on the list screen for a giant static list.
- **SubcategoryFormDialog:** category field is `CategoryAutocomplete`; `belongs_to_income` from `useCategoryQuery(category_id)`; **does not** write to `useCategoriesStore`.
- **Transactions:** subcategory/hangout **filters** use pickers; **removed** syncing picker fetches into `useSubcategoriesStore` / `useHangoutsStore`. **TransactionFormDialog** and **BulkTransactionsDialog** own picker queries (no `subcategoryOptions` / `hangoutOptions` props).
- **Tests:** Service tests for `name` query string and GET-by-id hooks; Subcategories/Transactions MSW extended with `GET /categories/:id/` and `GET /subcategories/:id/` where Autocomplete detail queries run.

## Verification

- `npm test && npx biome check .` before commits.

## Follow-ups (optional)

- Hangouts list screen: optional table-level `name` filter (not required by Phase 26 scope).
