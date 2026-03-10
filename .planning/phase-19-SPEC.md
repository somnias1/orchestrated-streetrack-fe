# Phase 19 — List filters and sort (SPEC)

## Goal (from ROADMAP)

- **Categories:** filter by type (income / expense via `is_income`).
- **Subcategories:** filter by type (`belongs_to_income`) and by category (`category_id`).
- **Transactions:** filter by date tree (year, month, day), subcategory, hangout; sort by date (newest first); **default** filter = current month (year + month).

## TECHSPEC sections

- **§4.3** — List endpoints and query params: `GET /categories/?is_income=`, `GET /subcategories/?belongs_to_income=&category_id=`, `GET /transactions/?year=&month=&day=&subcategory_id=&hangout_id=`; sort by date newest first.
- **§3.4** — Screens: Categories/Subcategories/Transactions list behaviour (filters, default current month on Transactions).

## Scope

1. **Categories screen**
   - Add filter UI for type: All | Income | Expense (maps to no param / `is_income=true` / `is_income=false`).
   - Pass selected filter into `useCategoriesQuery(params)`.

2. **Subcategories screen**
   - Add filter UI for type: All | Income | Expense (`belongs_to_income`).
   - Add filter UI for category: dropdown (or select) of categories; optional “All”.
   - Pass filters into `useSubcategoriesQuery(params)`.
   - Subcategories screen needs categories list for the category filter; use existing categories query or store.

3. **Transactions screen**
   - Default list params: current year + current month (already in `defaultTransactionsListParams`; verify and keep).
   - Add filter UI: date tree (year, month, optional day), subcategory (dropdown), hangout (dropdown). “All” / clear for each.
   - Backend sort: newest first (per §4.3; confirm BE contract from `localhost:8000/openapi.json` if needed; TECHSPEC states default sort newest first).
   - Pass filters into `useTransactionsQuery(listParams)`; ensure queryKey includes params so changing filters refetches.

4. **Services**
   - Categories: already support `is_income` in query params.
   - Subcategories: already have `SubcategoriesListParams` with `belongs_to_income`, `category_id`.
   - Transactions: already have `TransactionsListParams` with `year`, `month`, `day`, `subcategory_id`, `hangout_id`.
   - No backend URL changes; only ensure params are sent and UI state drives them.

## Out of scope (Phase 19)

- Bulk transactions (Phase 22).
- Dashboard or periodic expenses (Phases 20–21).
- Import/export (Phase 23).
- New tests for filter behaviour (can be Phase 24); existing gate remains.

## Definition of done (per phase)

- Spec committed before implementation.
- Categories: type filter visible and applied.
- Subcategories: type + category filters visible and applied.
- Transactions: date (year/month/day), subcategory, hangout filters visible and applied; default = current month; sort newest first.
- Gate: `npm test && npx biome check .` passes before every commit.
