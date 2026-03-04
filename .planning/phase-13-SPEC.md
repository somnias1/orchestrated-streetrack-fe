# Phase 13 — React Query services

**Goal (from ROADMAP):** TanStack React Query for all resources; hooks in services; modules use hooks; Zustand only for UI state if needed.

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
- **Zustand stores:** Remove server state (items, loading, error, fetch*, create*, update*, delete*) from all four stores. Keep stores only if they still hold **UI-only state** (e.g. dialog open, editing id, form initial values, delete target). If a store becomes empty or only holds one/two simple booleans, the screen can use `useState` instead and the store can be removed.
- **Tests:**
  - Service-level: existing tests for fetch/create/update/delete **functions** remain; add tests for the new **hooks** (e.g. that useCategoriesQuery returns data after a successful fetch, that mutations invalidate queries) using React Query’s testing utilities or a wrapper with QueryClientProvider).
  - Store tests: remove or drastically simplify store tests once server state is removed; if the store is removed, remove the store test file.
  - Screen/integration tests: update mocks so that components wrapped with QueryClientProvider receive the new hooks’ behavior (or mock the hooks); ensure loading, success, error, retry, and empty states still pass.
- **Gate:** `npm test && npx biome check .` must pass before every commit.

## 2. Out of scope (Phase 13)

- Theme or layout changes (Phase 14).
- Migrating to shadcn or changing table implementation (Phase 15).
- Coverage gate or new §1.3 test-case mapping (Phase 16).

## 3. Implementation order (suggested)

1. Add `@tanstack/react-query` dependency (exact version); wrap app with `QueryClientProvider` in `index.tsx`.
2. **Categories:** Add `useCategoriesQuery`, `useCreateCategoryMutation`, `useUpdateCategoryMutation`, `useDeleteCategoryMutation` (in `services/categories` or `services/categories/hooks.ts`). Refactor `modules/categories` to use these hooks; slim or remove categories store. Update Categories tests.
3. **Subcategories:** Same pattern; refactor subcategories module and store; update tests.
4. **Transactions:** Same pattern; refactor transactions module and store; update tests.
5. **Hangouts:** Same pattern; refactor hangouts module and store; update tests.
6. Run gate; fix any regressions. Remove any unused store files and ensure no imports of removed store state/actions remain.

## 4. Definition of done

- React Query is the single source of server state for list and CRUD for all four resources.
- All list and mutation hooks live in or next to services; modules use hooks only (no store for server state).
- Zustand is used only for UI state where it adds value; otherwise local `useState` is fine.
- Retry CTA on error still triggers list refetch (via query `refetch`).
- Gate passes; existing behavior (loading, error, empty, retry, CRUD) preserved and covered by tests.
