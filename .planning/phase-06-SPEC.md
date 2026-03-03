# Phase 06 — Subcategories List & Virtual

**Goal:** Subcategories service, store, list screen with virtualized table, and Subcategories in layout nav.

**Key TECHSPEC:** §1.6, §3.2, §3.4, §4.1, §4.2, §4.3, §5.1

---

## Scope

### 1. Subcategories service (§4.1, §4.3)

- **Types** (`src/services/subcategories/types.ts`): `SubcategoryRead`, `SubcategoryCreate`, `SubcategoryUpdate`, `GetSubcategoriesResponse` matching TECHSPEC §4.1.
- **Constants** (`src/services/subcategories/constants.ts`): path `subcategories` (no leading slash).
- **API** (`src/services/subcategories/index.ts`): `fetchSubcategories(options?: { skip?, limit? })` calling `GET /subcategories/` with optional skip/limit; use callbackApi (Bearer token).

### 2. Subcategories store (§4.2)

- **Zustand store** (`src/modules/subcategories/store.ts`): state `items: SubcategoryRead[]`, `loading`, `error`; action `fetchSubcategories(options?)`; same pattern as categories store.

### 3. Subcategories list screen & virtualized table (§3.4, §5.1)

- **Screen** (`src/modules/subcategories/index.tsx`): Title "Subcategories (n)", call `fetchSubcategories` on mount, render `SubcategoriesTable` with items, loading, error, onRetry.
- **Table** (`src/modules/subcategories/subcategoriesTable/`): Virtualized table (TanStack Table + react-virtual) with columns: Name, Description, Type (Income/Expense chip from `belongs_to_income`), Category ID (display truncated or placeholder). Reuse patterns from `categoriesTable`: sticky header, loading/error/empty body states, retry button, grid layout, theme tokens. Types in `subcategoriesTable/types.ts`.
- **Chip**: Reuse or mirror `CategoryTypeChip` for Income/Expense (subcategories use `belongs_to_income`).

### 4. Routes and layout (§3.2, §3.4)

- **Routes** (`src/routes.ts`): Add `subcategories: '/subcategories'`.
- **App** (`src/App.tsx`): Add route for `routes.subcategories` → Subcategories screen.
- **Layout** (`src/modules/layout/index.tsx`): Add nav link "Subcategories" to `routes.subcategories` (icon e.g. `AccountTreeRounded` or similar).

### 5. Tests

- **Subcategories service**: Unit test `fetchSubcategories` (mocked callbackApi): correct path and params (skip, limit).
- **Subcategories store**: Unit tests: success sets items; failure sets error; pass skip/limit to API.
- **Subcategories screen**: Integration tests (MSW): loading, success (rows), error + Retry, empty state, Retry refetch.
- **Layout**: Update test to assert Subcategories link and href `routes.subcategories`.

### 6. Definition of done (§8.3)

- [ ] Phase 06 spec committed (this file).
- [ ] Subcategories service, store, screen, and virtualized table implemented.
- [ ] Subcategories route and layout nav added.
- [ ] Tests for service, store, screen; Layout test updated. Coverage gate passes.
- [ ] Gate: `npm test && npx biome check .` passes.
- [ ] Phase SUMMARY: `.planning/phase-06-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 06)

- Subcategories CRUD (create/edit/delete) — Phase 10.
- Filtering by category in list (optional; can add in Phase 10 with category picker).
- Resolving category name in list (show category_id for now).
