# Phase 24 — Finance expansion tests and polish

## What was built

### Vitest (unit/integration)

- **Dashboard service** (`src/services/dashboard/dashboard.test.ts`): useDashboardBalanceQuery, useDashboardMonthBalanceQuery, useDashboardDuePeriodicExpensesQuery with MSW; assert balance, month-balance, due-periodic-expenses requests and responses.
- **Transaction manager service** (`src/services/transactionManager/transactionManager.test.ts`): useImportPreviewMutation (POST import, preview response); downloadCsvBlob (anchor creation and download attribute).
- Existing Categories, Subcategories, Transactions, Hangouts tests already cover list/CRUD and (where applicable) filters; no new filter-specific tests added beyond existing param assertions.

### Playwright E2E

- **Config**: `playwright.config.ts` at repo root; loads `.env` via dotenv; baseURL from `VITE_APP_URL`; Chromium-only; timeout 120s; projects: no-auth (auth.spec.ts), setup (auth.setup.ts), chromium (all other specs with saved auth state).
- **Auth**: Real Auth0 login in `auth.setup.ts`; credentials from `VITE_E2E_USER_EMAIL` / `VITE_E2E_USER_PASSWORD`; storage state saved to `playwright/.auth/user.json` and reused by authenticated specs.
- **Page objects** (`src/tests/e2e/pages/`): LoginPage, LayoutPage, HomePage, CategoriesPage, SubcategoriesPage, TransactionsPage, HangoutsPage.
- **Specs**: auth.spec.ts (unauthenticated redirect); navigation.spec.ts (app shell, navigate to Home/Categories/Subcategories/Transactions/Hangouts); dashboard.spec.ts (dashboard visible); categories.spec.ts (CRUD: create + delete); hangouts.spec.ts (CRUD: create + delete with date); subcategories.spec.ts (create category → create subcategory → delete sub → delete category); transactions.spec.ts (Export CSV download; Import flow: create category+sub, paste rows, preview, create, cleanup).
- **Scripts**: `npm run test:e2e`, `npm run test:e2e:ui`; README updated with E2E requirements and commands.

## Files changed

- `playwright.config.ts`: new; dotenv, baseURL, projects (no-auth, setup, chromium), storageState.
- `package.json`: devDependencies dotenv, @playwright/test; scripts test:e2e, test:e2e:ui.
- `.gitignore`: playwright/.auth/, test-results/, playwright-report/, .playwright/.
- `src/tests/e2e/auth.setup.ts`: authenticate and save storage state.
- `src/tests/e2e/auth.spec.ts`: redirect when unauthenticated.
- `src/tests/e2e/navigation.spec.ts`, `dashboard.spec.ts`, `categories.spec.ts`, `hangouts.spec.ts`, `subcategories.spec.ts`, `transactions.spec.ts`: happy-path flows and CRUD smoke.
- `src/tests/e2e/pages/*.ts`: page objects.
- `src/services/dashboard/dashboard.test.ts`: new; dashboard hooks with MSW.
- `src/services/transactionManager/transactionManager.test.ts`: new; import preview mutation and downloadCsvBlob.
- `README.md`: E2E section (env vars, playwright install, test:e2e).

## §1.3 case verification (mapping)

| §1.3 case | Test file / describe |
|-----------|----------------------|
| Auth: protected route redirect | ProtectedRoute.test.tsx; auth.spec.ts (E2E) |
| Auth: after login, user can reach protected pages | E2E navigation.spec.ts, dashboard.spec.ts |
| Categories list: load, loading, error+retry, empty | Categories.test.tsx; categories.test.tsx |
| API client: Bearer token on requests | callbackApi.test.ts |
| Navigation: layout, routes | Layout.test.tsx; E2E navigation.spec.ts |
| Finance stream: filters, dashboard, bulk, import/export, periodic | categories.test.tsx (is_income); dashboard.test.ts; transactionManager.test.ts; Transactions.test.tsx (bulk/create); E2E transactions.spec.ts (import, export) |

## Decisions made

- **E2E auth**: One-time login in setup project; storage state reused so authenticated specs do not log in again.
- **E2E data**: Tests create and delete their own data (categories, subcategories, hangouts, transactions) for full user-flow assertion and cleanup.
- **Timeout**: Default 120s per test; spec says measure full run then set threshold + 3 min when needed.
- **Import E2E**: Single row with created category/subcategory names; tab-separated format matching parsePaste (Date, $, Value, Category, Subcategory, Description).

## Tests added

- dashboard.test.ts: 3 tests (balance, month-balance, due-periodic-expenses).
- transactionManager.test.ts: 2 tests (import preview mutation, downloadCsvBlob).
- E2E: auth (1), navigation (1), dashboard (1), categories (1), hangouts (1), subcategories (1), transactions (2).

## Known issues / follow-ups

- E2E suite requires real Auth0 and backend; not run in CI in this phase.
- downloadCsvBlob Vitest test triggers jsdom "Not implemented: navigation" on anchor.click(); test still passes (assertions run before click).
- Timeout threshold to be tuned after first full E2E run (spec: measured duration + 3 min).
- Coverage gate (80%/70%): Vitest coverage excludes `src/tests/e2e/**` (Playwright specs). If global coverage falls below threshold, it may be due to other uncovered modules; Phase 24 adds coverage for dashboard and transaction-manager services.
