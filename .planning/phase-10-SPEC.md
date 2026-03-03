# Phase 10 — Subcategories Full CRUD UI

**Goal:** Create, edit, and delete Subcategories from the UI; forms with Zod validation; category picker; POST/PATCH/DELETE via subcategories service.

**Key TECHSPEC:** §1.6, §3.4, §3.5, §4.3 (Subcategories)

---

## Scope

### 1. Subcategories service (§4.3)

- **Constants** (`src/services/subcategories/constants.ts`): Add path helpers for single subcategory: `get(id)`, `update(id)`, `delete(id)` (e.g. `subcategories/${id}`).
- **API** (`src/services/subcategories/index.ts`):
  - `createSubcategory(body: SubcategoryCreate)` → POST `subcategories`, returns SubcategoryRead (201).
  - `getSubcategory(id: string)` → GET `subcategories/{id}`, returns SubcategoryRead (200).
  - `updateSubcategory(id: string, body: SubcategoryUpdate)` → PATCH `subcategories/{id}`, returns SubcategoryRead (200).
  - `deleteSubcategory(id: string)` → DELETE `subcategories/{id}`, returns void (204).
- Use callbackApi (Bearer token). Types already exist in `types.ts` (SubcategoryCreate, SubcategoryUpdate).

### 2. Subcategories store (§4.2)

- **Zustand store** (`src/modules/subcategories/store.ts`): Add actions:
  - `createSubcategory(body)` → call API; on success call `fetchSubcategories()` and clear error.
  - `updateSubcategory(id, body)` → call API; on success call `fetchSubcategories()`.
  - `deleteSubcategory(id)` → call API; on success call `fetchSubcategories()`.
- On API errors, set store `error` (and optionally loading false) so UI can show retry or inline error.

### 3. Subcategory form dialog (§3.5)

- **Dialog** (`src/modules/subcategories/subcategoryFormDialog/`): Reusable for Create and Edit.
  - **Zod schema**: `category_id` (string, min 1), `name` (string, min 1), `description` (string optional, nullable), `belongs_to_income` (boolean, default false). Match SubcategoryCreate/SubcategoryUpdate.
  - **Fields**: Category (select/picker from categories store), Name (text, required), Description (text optional), Type (Income/Expense select).
  - **Actions**: Submit (primary), Cancel (secondary). On submit: validate with Zod; if invalid show inline errors; if valid call store `createSubcategory` or `updateSubcategory`, then close dialog and refetch is done by store.
  - Use MUI Dialog, TextField, Select (category picker), Button; theme tokens from `src/theme/tailwind.ts`. Display 422 `detail[]` as inline field errors when provided.

### 4. Delete confirmation

- **Delete confirmation dialog**: Before DELETE, show a small dialog: “Delete subcategory «name»? This cannot be undone.” Confirm / Cancel. On confirm call store `deleteSubcategory(id)` then close.

### 5. Subcategories screen and table (§3.4)

- **Screen** (`src/modules/subcategories/index.tsx`): Add “Create subcategory” button (primary) above the table. Wire open state for create dialog. No route change for create/edit (dialogs only). Ensure categories are fetched (for form picker) when needed.
- **Table** (`src/modules/subcategories/subcategoriesTable/index.tsx`): Replace placeholder “—” in Actions column with:
  - **Edit** button (icon or text): opens Subcategory form dialog with that row’s subcategory (prefilled); on submit call `updateSubcategory(id, body)`.
  - **Delete** button: opens delete confirmation dialog; on confirm call `deleteSubcategory(id)`.
- Pass callbacks from screen to table: `onEdit(subcategory)`, `onDelete(subcategory)`; screen holds dialog open state and selected subcategory for edit/delete.

### 6. Tests

- **Subcategories service**: Unit tests for `createSubcategory`, `getSubcategory`, `updateSubcategory`, `deleteSubcategory` (mocked callbackApi: correct method, path, body).
- **Subcategories store**: Unit tests for create/update/delete: success triggers refetch (or updates state); failure sets error.
- **Subcategories screen + dialogs**: Integration tests (MSW): create flow (open dialog, fill, submit, list includes new item); edit flow (open edit, change, submit, list updated); delete flow (confirm, list no longer contains item). Optionally: validation errors (empty name) prevent submit.
- **SubcategoriesTable**: Assert Edit and Delete buttons per row; no need to test dialog opening in table unit test if screen tests cover flows.

### 7. Definition of done (§8.3)

- [x] Phase 10 spec committed (this file).
- [x] Subcategories service CRUD (create, get, update, delete) implemented.
- [x] Subcategories store create/update/delete actions implemented.
- [x] Subcategory form dialog (Zod, category picker) and delete confirmation dialog implemented.
- [x] Screen has Create button; table has Edit/Delete per row; all flows work.
- [x] Tests for service, store, and CRUD flows; coverage gate passes.
- [x] Gate: `npm test && npx biome check .` passes.
- [x] Phase SUMMARY: `.planning/phase-10-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 10)

- Transactions or Hangouts CRUD — Phases 11–12.
- Inline editing in table (use dialogs only).
- Bulk delete or bulk edit.
