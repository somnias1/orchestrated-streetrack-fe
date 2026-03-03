# Phase 09 — Categories Full CRUD UI

**Goal:** Create, edit, and delete Categories from the UI; forms with Zod validation; POST/PATCH/DELETE via categories service.

**Key TECHSPEC:** §1.6, §3.4, §3.5, §4.3 (Categories)

---

## Scope

### 1. Categories service (§4.3)

- **Constants** (`src/services/categories/constants.ts`): Add path helpers for single category: `get(id)`, `update(id)`, `delete(id)` (e.g. `categories/${id}`).
- **API** (`src/services/categories/index.ts`):
  - `createCategory(body: CategoryCreate)` → POST `categories`, returns CategoryRead (201).
  - `getCategory(id: string)` → GET `categories/{id}`, returns CategoryRead (200).
  - `updateCategory(id: string, body: CategoryUpdate)` → PATCH `categories/{id}`, returns CategoryRead (200).
  - `deleteCategory(id: string)` → DELETE `categories/{id}`, returns void (204).
- Use callbackApi (Bearer token). Types already exist in `types.ts` (CategoryCreate, CategoryUpdate).

### 2. Categories store (§4.2)

- **Zustand store** (`src/modules/categories/store.ts`): Add actions:
  - `createCategory(body)` → call API; on success call `fetchCategories()` and clear error.
  - `updateCategory(id, body)` → call API; on success call `fetchCategories()`.
  - `deleteCategory(id)` → call API; on success call `fetchCategories()`.
- On API errors, set store `error` (and optionally loading false) so UI can show retry or inline error.

### 3. Category form dialog (§3.5)

- **Dialog** (`src/modules/categories/categoryFormDialog/` or under `categoriesTable/`): Reusable for Create and Edit.
  - **Zod schema**: `name` (string, min 1), `description` (string optional, nullable), `is_income` (boolean, default false). Match CategoryCreate/CategoryUpdate.
  - **Fields**: Name (text, required), Description (text optional), Type (Income/Expense toggle or select).
  - **Actions**: Submit (primary), Cancel (secondary). On submit: validate with Zod; if invalid show inline errors; if valid call store `createCategory` or `updateCategory`, then close dialog and refetch is done by store.
  - Use MUI Dialog, TextField, Button; theme tokens from `src/theme/tailwind.ts`. Display 422 `detail[]` as inline field errors when provided.

### 4. Delete confirmation

- **Delete confirmation dialog**: Before DELETE, show a small dialog: “Delete category «name»? This cannot be undone.” Confirm / Cancel. On confirm call store `deleteCategory(id)` then close.

### 5. Categories screen and table (§3.4)

- **Screen** (`src/modules/categories/index.tsx`): Add “Create category” button (primary) above the table. Wire open state for create dialog. No route change for create/edit (dialogs only).
- **Table** (`src/modules/categories/categoriesTable/index.tsx`): Replace placeholder “—” in Actions column with:
  - **Edit** button (icon or text): opens Category form dialog with that row’s category (prefilled); on submit call `updateCategory(id, body)`.
  - **Delete** button: opens delete confirmation dialog; on confirm call `deleteCategory(id)`.
- Pass callbacks from screen to table: `onEdit(category)`, `onDelete(category)`; screen holds dialog open state and selected category for edit/delete.

### 6. Tests

- **Categories service**: Unit tests for `createCategory`, `getCategory`, `updateCategory`, `deleteCategory` (mocked callbackApi: correct method, path, body).
- **Categories store**: Unit tests for create/update/delete: success triggers refetch (or updates state); failure sets error.
- **Categories screen + dialogs**: Integration tests (MSW): create flow (open dialog, fill, submit, list includes new item); edit flow (open edit, change, submit, list updated); delete flow (confirm, list no longer contains item). Optionally: validation errors (empty name) prevent submit.
- **CategoriesTable**: Assert Edit and Delete buttons per row; no need to test dialog opening in table unit test if screen tests cover flows.

### 7. Definition of done (§8.3)

- [x] Phase 09 spec committed (this file).
- [x] Categories service CRUD (create, get, update, delete) implemented.
- [x] Categories store create/update/delete actions implemented.
- [x] Category form dialog (Zod) and delete confirmation dialog implemented.
- [x] Screen has Create button; table has Edit/Delete per row; all flows work.
- [x] Tests for service, store, and CRUD flows; coverage gate passes.
- [x] Gate: `npm test && npx biome check .` passes.
- [x] Phase SUMMARY: `.planning/phase-09-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 09)

- Subcategories, Transactions, or Hangouts CRUD — Phases 10–12.
- Inline editing in table (use dialogs only).
- Bulk delete or bulk edit.
