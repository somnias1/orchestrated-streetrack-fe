# Phase 13 — React Query services — Summary

## Completed

- **Dependency:** Added `@tanstack/react-query` 5.90.21 (exact).
- **Provider:** Wrapped app with `QueryClientProvider` in `index.tsx` (inside Auth0Provider).
- **Services:** For categories, subcategories, transactions, hangouts:
  - Kept existing API functions (fetch*, create*, update*, delete*, get*).
  - Added React Query hooks in `services/<resource>/hooks.ts`:
    - List: `useCategoriesQuery`, `useSubcategoriesQuery`, `useTransactionsQuery`, `useHangoutsQuery` (queryKey + fetch function).
    - Mutations: `useCreate*Mutation`, `useUpdate*Mutation`, `useDelete*Mutation` with `onSuccess` invalidating the list query.
- **Modules:** Categories, Subcategories, Transactions, Hangouts screens now use the new hooks for list (data, isLoading, isError, error, refetch) and mutations (mutateAsync); retry CTA calls query `refetch()`. UI state (dialogs, editing id, etc.) remains in component `useState`.
- **Stores:** Removed all four Zustand stores and their tests (categories, subcategories, transactions, hangouts); server state lives only in React Query.
- **Tests:** Screen tests wrap with `QueryClientProvider` and a test client (retry: false). Service tests unchanged in behavior; path assertions updated to match constants (trailing slashes). Hangouts retry test path matcher updated for `/hangouts/`. All 71 tests pass.
- **Gate:** `npm test && npx biome check .` pass.

## Definition of done

- React Query is the single source of server state for list and CRUD for all four resources.
- Hooks live in services; modules use hooks only.
- Zustand removed for server state; UI state is local state.
- Retry CTA triggers query refetch.
- Gate passed; behavior preserved.
