# Phase 05 — Tests & Verification

**Goal:** Set up test tooling and write unit/integration tests for auth, categories list, and API client with coverage gate.

**Key TECHSPEC:** §1.3, §2.3, §3.3, §6.1, §6.2, §8.3

---

## Scope

### 1. Test tooling (§6.1, §6.2)

- **Runner**: Vitest (TECHSPEC allows Jest or Vitest; Vitest works well with ESM and Rsbuild).
- **Unit**: Stores, utils, services with mocked Axios or MSW.
- **Integration**: React Testing Library for screens and flows; mock Auth0 and API.
- **API mocking**: MSW (or mocked Axios) so response shapes match `src/services/*/types.ts`.
- **Coverage**: Minimum **80%** for code touched by the phase; gate with `npm test -- --coverage`.
- **Gate command**: `npm test && npx biome check .` must pass before every commit (§8.2).

### 2. §1.3 test case mapping

| §1.3 case | Type | What to test | Test file / describe |
|-----------|------|--------------|----------------------|
| Auth: protected route redirects when not logged in | Integration | Unauthenticated user visiting `/` or `/categories` is redirected to `routes.auth.login` | `ProtectedRoute.test.tsx` |
| Auth: after login, user can reach protected pages | Integration | When `isAuthenticated === true`, ProtectedRoute renders children; Home/Categories are reachable | `ProtectedRoute.test.tsx`, routing test |
| Categories list: loading | Integration | Categories screen shows loading spinner while fetching | `Categories.test.tsx` (MSW handler delay or loading state) |
| Categories list: success (rows) | Integration | When API returns categories, table shows rows with name, type chip | `Categories.test.tsx` |
| Categories list: error + retry | Integration | On API error, error message and Retry button are shown; Retry triggers refetch | `Categories.test.tsx` |
| Categories list: empty | Integration | When API returns `[]`, "No categories found." is shown | `Categories.test.tsx` |
| API client: Bearer token attached when authenticated | Unit | callbackApi request interceptor adds `Authorization: Bearer <token>` when token getter returns a token | `callbackApi.test.ts` |
| Navigation: Layout shows Home and Categories links; routing matches routes.ts | Integration | Layout contains links to `routes.home` and `routes.categories`; route paths match `src/routes.ts` | `Layout.test.tsx`, `App.test.tsx` or routes test |

### 3. Unit tests

- **callbackApi** (`src/utils/callbackApi/index.ts`): Set a token getter; make a request; assert header `Authorization: Bearer <token>`. Without getter or with getter returning undefined, no Bearer header.
- **Categories store** (optional but recommended): With mocked `fetchCategories` API, `fetchCategories()` sets loading then items or error; state transitions.
- **Categories service** (optional): With mocked Axios, `fetchCategories()` calls `callbackApi.get` with correct path and params (skip, limit).

### 4. Integration tests

- **ProtectedRoute**: Mock `useAuth0()`: when `isAuthenticated === false`, render results in `<Navigate to={routes.auth.login} />`; when `true`, children render.
- **Categories screen**: Wrap with MSW (e.g. `GET /categories/`), mock Auth0. Test: loading state (spinner), success (rows), error (message + Retry button), empty ("No categories found."). Retry: after error, trigger click on Retry and assert refetch (e.g. second request).
- **Layout**: Render Layout with Router; assert presence of links to Home and Categories (paths from `routes`).
- **App routing**: Routes for `routes.home`, `routes.categories`, `routes.auth.login`, `routes.auth.callback` resolve to correct components (high-level or smoke).

### 5. Configuration and CI

- **Vitest config**: `vitest.config.ts` (or `.ts`) with environment `jsdom`, globals if desired, coverage provider (v8 or istanbul), include `src/**/*.test.{ts,tsx}`, exclude node_modules and build output.
- **Test files**: Colocate `*.test.ts` / `*.test.tsx` next to source or under `src/__tests__/`; ensure production build excludes them.
- **README**: Document how to run tests (`npm test`) and coverage (`npm test -- --coverage`); mention gate command.

### 6. Definition of done (§8.3)

- [ ] Phase 05 spec committed (this file).
- [ ] Test tooling (Vitest, RTL, MSW or Axios mock) installed and configured; `npm test` runs suite.
- [ ] All §1.3 cases above covered; mapping table in phase summary.
- [ ] Coverage ≥ 80% for code touched (or overall); `npm test -- --coverage` passes.
- [ ] Gate: `npm test && npx biome check .` passes before every commit.
- [ ] README updated with test and coverage instructions.
- [ ] Phase SUMMARY: `.planning/phase-05-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 05)

- E2E tests (optional per §6.1).
- Testing Auth0 callback flow against real Auth0 (mock only).
- Subcategories, Transactions, Hangouts (not yet in app).
