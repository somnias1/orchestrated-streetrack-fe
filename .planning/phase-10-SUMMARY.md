# Phase 10 — Summary

**Branch:** `feature/phase-10-subcategories-crud`  
**Goal:** Subcategories full CRUD UI (create, edit, delete) with forms, Zod, and category picker.

---

## Delivered

### 1. Subcategories service (§4.3)

- **Constants** (`src/services/subcategories/constants.ts`): Added `get(id)`, `update(id)`, `delete(id)` path helpers.
- **API** (`src/services/subcategories/index.ts`): `createSubcategory(body)`, `getSubcategory(id)`, `updateSubcategory(id, body)`, `deleteSubcategory(id)` using callbackApi (POST/GET/PATCH/DELETE).

### 2. Subcategories store

- **Store** (`src/modules/subcategories/store.ts`): Actions `createSubcategory`, `updateSubcategory`, `deleteSubcategory`; each on success calls `fetchSubcategories()`, on error sets `error` and rethrows (create/update) or sets error (delete).

### 3. Subcategory form dialog (§3.5)

- **Dialog** (`src/modules/subcategories/subcategoryFormDialog/`): Zod schema (category_id required, name required, description optional, belongs_to_income); MUI Dialog with Category (select from categories store), Name, Description, Type (Income/Expense); Submit/Cancel; used for Create and Edit. Category picker options from `useCategoriesStore` (categories fetched on Subcategories screen mount).

### 4. Delete confirmation

- **Dialog** (`src/modules/subcategories/deleteSubcategoryDialog/`): Confirms “Delete subcategory «name»? This cannot be undone.” Confirm/Cancel; on confirm calls store `deleteSubcategory(id)`.

### 5. Subcategories screen and table

- **Screen** (`src/modules/subcategories/index.tsx`): Fetches categories (for form picker) and subcategories on mount; “Create subcategory” button; state for form (open, initial values, editing id) and delete dialog (open, subcategory); passes `onEdit` and `onDelete` to table.
- **Table** (`src/modules/subcategories/subcategoriesTable/index.tsx`): Actions column: Edit and Delete icon buttons per row (aria-labels, theme tokens); props extended with `onEdit`, `onDelete`.

### 6. Tests

- **Service** (`src/services/subcategories/subcategories.test.ts`): createSubcategory, getSubcategory, updateSubcategory, deleteSubcategory (mocked callbackApi; method, path, body).
- **Store** (`src/modules/subcategories/store.test.ts`): create/update/delete success → refetch; create failure → error and throw.
- **Subcategories screen** (`src/modules/subcategories/Subcategories.test.tsx`): create flow (dialog, category picker, submit, list shows new); edit flow (Edit, change name, submit, list updated); delete flow (Delete, confirm, list empty). Virtualizer mocked; GET categories handler added for form picker. Dialog queries scoped with `within(dialog)` to avoid matching table “Category ID” header.

---

## Gate

- `npm test` — 78 tests passed.
- `npx biome check .` — passed (format and lint applied).

---

## Out of scope (Phase 10)

- Transactions/Hangouts CRUD (Phases 11–12).
- Inline table editing; bulk actions.
