# Phase 13 — React Query services

**Goal (from ROADMAP):** TanStack React Query for all resources; hooks in services; modules use hooks; Zustand as global store for read access, synced from React Query.

**Key TECHSPEC:** §3.3, §4.2, §2.2, §6.

**Depends on:** Phase 12.

---

## 1. Scope

- Add **@tanstack/react-query** (exact version per TECHSPEC §2.2; pin in `package.json`).
- Provide **QueryClient** and **QueryClientProvider** at app root (e.g. in `index.tsx` inside Auth0Provider).
- For each resource (**categories**, **subcategories**, **transactions**, **hangouts**):
  - Keep existing service **functions** (fetch*, create*, update*, delete*, get*) as the API layer used by React Query.
  - Add **React Query hooks** in the service layer (or a dedicated hooks file next to the service):
    - **List:** `useCategoriesQuery(options?)`, `useSubcategoriesQuery(options?)`, `useTransactionsQuery(options?)`, `useHangoutsQuery(options?)` — use `useQuery` with appropriate queryKey (e.g. `['categories', options]`), call the existing fetch function.
    - **Mutations:** `useCreateCategoryMutation()`, `useUpdateCategoryMutation()`, `useDeleteCategoryMutation()` (and equivalents for subcategories, transactions, hangouts) — use `useMutation`; on success invalidate the list query (e.g. `queryClient.invalidateQueries({ queryKey: ['categories'] })`) so lists refetch. Mutations call existing create/update/delete service functions.
- **Modules (screens):** Categories, Subcategories, Transactions, Hangouts screens (and any components that currently use the store for list/loading/error/refetch or create/update/delete) must switch to the new React Query hooks. Use `data`, `isLoading`, `isError`, `error`, `refetch` from the list query and mutation callbacks for refetch/error handling. **Retry CTA** must call `refetch()` from the query (TECHSPEC §3.3).
- **Zustand stores:** Keep a **global store per resource** for read access. Store shape: `items`, `loading`, `error`, and a single action `setFromQuery(items, loading, error)`. React Query remains the source of truth; screens that use the React Query hooks sync the query result into the store in a `useEffect`, so any component can read from the store (e.g. `useCategoriesStore(s => s.items)`). No fetch/create/update/delete actions in the store — those live in React Query hooks only.
- **Tests:**
  - Service-level: existing tests for fetch/create/update/delete **functions** remain; add tests for the new **hooks** (e.g. that useCategoriesQuery returns data after a successful fetch, that mutations invalidate queries) using React Query’s testing utilities or a wrapper with QueryClientProvider).
  - Store tests: optional; stores are thin (setFromQuery only) and synced from query in screens; no dedicated store tests required if sync is covered by screen tests.
  - Screen/integration tests: update mocks so that components wrapped with QueryClientProvider receive the new hooks’ behavior (or mock the hooks); ensure loading, success, error, retry, and empty states still pass.
- **Gate:** `npm test && npx biome check .` must pass before every commit.

## 2. Out of scope (Phase 13)

- Theme or layout changes (Phase 14).
- Migrating to shadcn or changing table implementation (Phase 15).
- Coverage gate or new §1.3 test-case mapping (Phase 16).

## 3. Implementation order (suggested)

1. Add `@tanstack/react-query` dependency (exact version); wrap app with `QueryClientProvider` in `index.tsx`.
2. **Categories:** Add React Query hooks in services. Add or update categories store with `items`, `loading`, `error`, `setFromQuery`. Refactor `modules/categories` to use hooks and sync query result to store in `useEffect`. Update Categories tests.
3. **Subcategories:** Same pattern; store synced from query (and categories store synced when categories query runs on this screen). Update tests.
4. **Transactions:** Same pattern; store synced from query (and subcategories/hangouts stores synced when those queries run). Update tests.
5. **Hangouts:** Same pattern; store synced from query. Update tests.
6. Run gate; fix any regressions.

## 4. Definition of done

- React Query is the single source of truth for server state (fetch, cache, mutations, refetch).
- All list and mutation hooks live in services; modules use these hooks and sync query result to Zustand store so the store holds a mirror for global read access.
- Zustand stores (per resource) expose `items`, `loading`, `error`, `setFromQuery`; any component can read from the store; no fetch/mutation actions in the store.
- Retry CTA on error still triggers list refetch (via query `refetch`).
- Gate passes; existing behavior (loading, error, empty, retry, CRUD) preserved and covered by tests.
