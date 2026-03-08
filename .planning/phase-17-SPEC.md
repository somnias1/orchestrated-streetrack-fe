# Phase 17 — List screens: category & transaction names

**Goal:** Consume BE-provided category name (subcategories) and subcategory/hangout names (transactions); display them in the existing virtualized tables instead of IDs.

**Key TECHSPEC:** §4.1, §4.3, §3.4, §5.1

---

## BE response field names

- **Subcategories** (`GET /subcategories/`): each item includes `category_name` (string) in addition to `category_id`.
- **Transactions** (`GET /transactions/`): each item includes `subcategory_name` (string) and `hangout_name` (string | null) in addition to `subcategory_id` and `hangout_id`.

---

## Scope

### 1. Subcategories types and table

- **Types** ([src/services/subcategories/types.ts](src/services/subcategories/types.ts)): Add `category_name: string` to `SubcategoryRead` (per TECHSPEC §4.1).
- **Table** ([src/modules/subcategories/subcategoriesTable/index.tsx](src/modules/subcategories/subcategoriesTable/index.tsx)): Replace "Category ID" column with "Category"; use `category_name` for display with fallback to truncated `category_id` if `category_name` is missing (e.g. legacy or partial response).

### 2. Transactions types and table

- **Types** ([src/services/transactions/types.ts](src/services/transactions/types.ts)): Add `subcategory_name: string` and `hangout_name: string | null` to `TransactionRead` (per TECHSPEC §4.1).
- **Table** ([src/modules/transactions/transactionsTable/index.tsx](src/modules/transactions/transactionsTable/index.tsx)): Replace "Subcategory ID" / "Hangout ID" with "Subcategory" / "Hangout"; display `subcategory_name` and `hangout_name` (null hangout → "—"); fallback to truncated ID if name missing.

### 3. MSW and tests

- **Subcategories tests**: In [Subcategories.test.tsx](src/modules/subcategories/Subcategories.test.tsx) (and [subcategories.test.ts](src/services/subcategories/subcategories.test.ts) if needed), include `category_name` in mock list responses; optionally assert that category name is displayed in the table.
- **Transactions tests**: In [Transactions.test.tsx](src/modules/transactions/Transactions.test.tsx) (and [transactions.test.ts](src/services/transactions/transactions.test.ts) if needed), include `subcategory_name` and `hangout_name` in mock list responses; optionally assert that names are displayed.

### 4. Definition of done (§8.3)

- [x] Phase 17 spec committed (this file).
- [x] SubcategoryRead and TransactionRead updated; Subcategories and Transactions tables show names; fallbacks for missing names in place.
- [x] Tests and MSW mocks updated; gate `npm test && npx biome check .` passes.
- [x] Phase SUMMARY: `.planning/phase-17-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 17)

- Hangouts list: no change to hangout list table (only transactions list shows hangout name).
- CRUD forms: no change to create/edit payloads or pickers; only list display.
