# Phase 03 — Categories Data & Store

**Goal:** Define categories service and types, wire Axios client, and build a Zustand store with loading/error/empty.

**Key TECHSPEC:** §1.2, §3.1, §3.3, §4.1, §4.2, §4.3

---

## Scope

### 1. Categories types (§4.1)

- **`src/services/categories/types.ts`**:
  - `CategoryRead`: `id` (string/uuid), `name` (string), `description` (string | null), `is_income` (boolean), `user_id` (string | null).
  - `CategoryCreate`, `CategoryUpdate` per TECHSPEC §4.1 (for future CRUD; list only this phase).
  - `GetCategoriesResponse = CategoryRead[]` (GET `/categories/` returns array).
- Types must match backend OpenAPI; no leading slash in path constants.

### 2. Categories service (§4.3, §3.3)

- **`src/services/categories/constants.ts`**: Path strings for categories API (e.g. `categories: 'categories'` or `categoriesList: 'categories'`); no leading slash.
- **`src/services/categories/index.ts`**:
  - `fetchCategories(options?: { skip?: number; limit?: number }): Promise<CategoryRead[]>`.
  - Uses **callbackApi** only (no raw Axios); GET with optional `?skip` and `?limit` (defaults 0, 50 per §4.3).
  - Export only this function from the service for now; single entry for list.

### 3. Zustand categories store (§4.2, §3.3)

- **`src/modules/categories/store.ts`** (or `src/modules/categories/categoriesStore.ts`):
  - State: `items: CategoryRead[]`, `loading: boolean`, `error: string | null`.
  - Actions: `fetchCategories()` (or `loadCategories`): sets loading true, error null; calls `services/categories` `fetchCategories`; on success sets items and loading false; on failure sets error message and loading false.
  - **Refetch / retry**: Expose the same fetch action so UI can call it for retry (error state must have retry CTA per §2.3).
  - No persistence; server state lives on backend; refetch on load and on retry.

### 4. Wire store to Categories screen (minimal UX)

- **`src/modules/categories/index.tsx`**:
  - On mount (or when entering the screen), trigger store’s `fetchCategories()`.
  - Render based on store state:
    - **Loading**: Show loading spinner (e.g. MUI CircularProgress).
    - **Error**: Show error message and a **retry** button that calls the store’s fetch again.
    - **Empty** (items.length === 0 and !loading && !error): Show “No categories” (or similar).
    - **Success** (items.length > 0): Show simple list or count for now (e.g. “N categories” or minimal list); full virtualized table is Phase 04.
  - Use theme tokens / Tailwind where applicable; no hardcoded colors.

### 5. Token wiring

- Ensure **TokenInjector** (or equivalent) in layout has already set `setTokenGetter` with Auth0’s getter so that when the categories store calls the service, callbackApi attaches the Bearer token. No change to callbackApi or useGetToken unless not yet wired in layout.

### 6. Verification

- `npm run dev`, `npm run build`, `npm run preview` succeed.
- Manual: Log in → go to Categories → see loading then list or empty or error; on error, retry button refetches.

---

## Out of scope (Phase 03)

- Virtualized table UI (Phase 04).
- Categories CRUD (create/edit/delete) (later phase).
- Unit tests for store/service (Phase 05).

---

## Definition of done

- [x] Phase 03 spec committed (this file).
- [x] `src/services/categories/types.ts` with CategoryRead, GetCategoriesResponse (and Create/Update for future).
- [x] `src/services/categories/constants.ts` with path constant(s).
- [x] `src/services/categories/index.ts` with `fetchCategories({ skip?, limit? })` using callbackApi.
- [x] `src/modules/categories/store.ts` (or categoriesStore.ts) with items, loading, error, fetch + retry.
- [x] Categories screen triggers fetch and shows loading / error (with retry) / empty / success.
- [x] Gate: `npm test && npx biome check .` passes; build and preview succeed.
