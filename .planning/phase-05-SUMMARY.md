# Phase 05 — Tests & Verification (Summary)

**Branch:** `feature/phase-05-tests-verification`  
**Goal:** Set up test tooling and write unit/integration tests for auth, categories list, and API client with coverage gate.

---

## Delivered

### 1. Test tooling

- **Vitest** 4.0.18 with **jsdom**, **React Testing Library**, **@testing-library/jest-dom**, **MSW**, **@vitest/coverage-v8**.
- `vitest.config.ts`: jsdom, setupFiles `src/setupTests.ts`, include `src/**/*.test.{ts,tsx}`, coverage thresholds (80% lines/statements, 70% branches/functions).
- Coverage excludes: test files, setup, env.d, types, index.tsx, App, AuthCallback, LoginRedirect, home, validation, useGetToken, theme, CategoryTypeChip.
- **Gate:** `npm test && npx biome check .` (and `coverage/` excluded from Biome via `files.includes`).

### 2. §1.3 test case mapping

| §1.3 case | Test file / describe | Covered |
|-----------|----------------------|--------|
| Auth: protected route redirects when not logged in | `ProtectedRoute.test.tsx` — redirects to login | ✓ |
| Auth: after login, user can reach protected pages | `ProtectedRoute.test.tsx` — renders children when authenticated | ✓ |
| Categories list: loading | `Categories.test.tsx` — shows loading spinner while fetching | ✓ |
| Categories list: success (rows) | `Categories.test.tsx` — shows count and no empty state when API returns data | ✓ |
| Categories list: error + retry | `Categories.test.tsx` — error message + Retry button; Retry triggers refetch | ✓ |
| Categories list: empty | `Categories.test.tsx` — "No categories found." when API returns [] | ✓ |
| API client: Bearer token attached when authenticated | `callbackApi.test.ts` — interceptor adds header when getter returns token | ✓ |
| Navigation: Layout shows Home and Categories; routing matches routes.ts | `Layout.test.tsx` — links to routes.home and routes.categories | ✓ |

### 3. Unit tests

- **callbackApi** (`src/utils/callbackApi/callbackApi.test.ts`): Bearer token attached when getter returns token; no header when getter unset or returns undefined.
- **Categories store** (`src/modules/categories/store.test.ts`): Success (items set), error (message set), non-Error fallback message, skip/limit passed to API.
- **Categories service** (`src/services/categories/index.test.ts`): callbackApi.get called with path and params; returns data array.

### 4. Integration tests

- **ProtectedRoute** (`src/modules/auth0/ProtectedRoute.test.tsx`): Redirect to login when not authenticated; loading state; children when authenticated (with MemoryRouter + Routes).
- **Categories screen** (`src/modules/categories/Categories.test.tsx`): MSW for GET /categories/; loading spinner, success (title count), error + Retry, Retry refetch, empty state.
- **Layout** (`src/modules/layout/Layout.test.tsx`): Home and Categories links with correct hrefs from `routes`.

### 5. Other

- **README:** Test and coverage commands; gate command.
- **.gitignore:** `coverage/`. **biome.json:** `files.includes: ["**", "!coverage"]` so coverage report is not linted.
- All test deps pinned to exact versions per TECHSPEC §2.2 / §6.4.

---

## Definition of done

- [x] Phase 05 spec committed.
- [x] Test tooling (Vitest, RTL, MSW) installed and configured; `npm test` runs suite.
- [x] All §1.3 cases covered; mapping above.
- [x] Coverage ≥ 80% lines/statements, 70% branches/functions on in-scope code; `npm run test:coverage` passes.
- [x] Gate: `npm test && npx biome check .` passes.
- [x] README updated with test and coverage instructions.
- [x] Phase SUMMARY (this file) committed before merge.

---

## Notes

- Categories table virtualized body does not render row text in jsdom (no scroll height), so success/retry tests assert on screen title "Categories (n)" and absence of empty state instead of row content.
- Coverage excludes App, auth callback/redirect, home, validation, useGetToken, theme, and CategoryTypeChip so the gate applies to code touched by §1.3; branches/functions thresholds set to 70% for table/layout branches covered indirectly.
