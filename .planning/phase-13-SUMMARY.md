# Phase 13 — React Query services — Summary

## Completed

- **Dependency:** Added `@tanstack/react-query` 5.90.21 (exact).
- **Provider:** Wrapped app with `QueryClientProvider` in `index.tsx` (inside Auth0Provider).
- **Services:** For categories, subcategories, transactions, hangouts:
  - Kept existing API functions (fetch*, create*, update*, delete*, get*).
  - Added React Query hooks in `services/<resource>/hooks.ts`:
    - List: `useCategoriesQuery`, `useSubcategoriesQuery`, `useTransactionsQuery`, `useHangoutsQuery` (queryKey + fetch function).
    - Mutations: `useCreate*Mutation`, `useUpdate*Mutation`, `useDelete*Mutation` with `onSuccess` invalidating the list query.
- **Modules:** Categories, Subcategories, Transactions, Hangouts screens use the new hooks for list (data, isLoading, isError, error, refetch) and mutations (mutateAsync); retry CTA calls query `refetch()`. Each screen syncs the query result into the corresponding Zustand store in a `useEffect`. UI state (dialogs, editing id, etc.) remains in component `useState`.
- **Stores:** Zustand stores kept for global read access. Per resource: `items`, `loading`, `error`, `setFromQuery(items, loading, error)`. React Query is the source of truth; screens that run the query call `setFromQuery` so the store mirrors the latest data. Any component can read via `useCategoriesStore(s => s.items)` etc. Subcategories screen also syncs categories to store; Transactions screen also syncs subcategories and hangouts to store.
- **Tests:** Screen tests wrap with `QueryClientProvider` and a test client (retry: false). Service tests unchanged in behavior; path assertions updated to match constants (trailing slashes). Hangouts retry test path matcher updated for `/hangouts/`. All 71 tests pass.
- **Gate:** `npm test && npx biome check .` pass.

## Definition of done

- React Query is the single source of truth for server state (fetch, cache, mutations, refetch).
- Hooks live in services; modules use hooks and sync query result to Zustand store for global read access.
- Zustand stores expose items/loading/error and setFromQuery only; no fetch/mutation actions in the store.
- Retry CTA triggers query refetch.
- Gate passed; behavior preserved.
