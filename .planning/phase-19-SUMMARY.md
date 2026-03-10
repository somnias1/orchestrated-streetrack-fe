# Phase 19 — List filters and sort

## What was built

- **Categories:** Type filter (All / Income / Expense) via Select; `is_income` passed to `useCategoriesQuery`.
- **Subcategories:** Type filter (All / Income / Expense) and Category filter (All + category list); `belongs_to_income` and `category_id` passed to `useSubcategoriesQuery`. Categories loaded via `useCategoriesQuery` for the dropdown.
- **Transactions:** Date filters (Year, Month, Day optional), Subcategory filter, Hangout filter; default = current year + month. Params built from local state and passed to `useTransactionsQuery`. Backend sort by date (newest first) per §4.3.
- **Fix:** `src/modules/transactions/constants.ts` now imports `TransactionsListParams` from `types` instead of non-existent `hooks`.

## Files changed

- `.planning/phase-19-SPEC.md`: Phase scope and DoD.
- `src/modules/categories/index.tsx`: Type filter state, query params, Type Select UI.
- `src/modules/subcategories/index.tsx`: Type and category filter state, `useCategoriesQuery` for options, query params, filter Selects UI.
- `src/modules/transactions/constants.ts`: Import `TransactionsListParams` from `../../services/transactions/types`.
- `src/modules/transactions/index.tsx`: Filter state (year, month, day, subcategory_id, hangout_id), `listParams` derived via useMemo, filter UI (Year, Month, Day, Subcategory, Hangout Selects).

## Decisions made

- **Filter UI:** MUI FormControl + Select for all filters for consistency and accessibility.
- **Transactions default:** Current year and month from `defaultTransactionsListParams`; day optional (“All” = no day param).
- **Sort:** Newest first is backend default (TECHSPEC §4.3); no frontend sort control added.

## Tests added

- None this phase; existing tests pass. Filter behaviour can be covered in Phase 24 (finance expansion tests).

## Known issues / follow-ups

- None. Backend must support query params per §4.3 (is_income, belongs_to_income, category_id, year, month, day, subcategory_id, hangout_id); verify against `localhost:8000/openapi.json` if needed.
