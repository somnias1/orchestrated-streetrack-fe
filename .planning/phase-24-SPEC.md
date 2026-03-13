# Phase 24 — Finance expansion tests and polish

## Goal (from ROADMAP)

Tests for dashboard, bulk, import/export, filters, periodic; §1.3 mapping; coverage gate. **Plus:** full E2E test suite with Playwright (real Auth0, real backend, create/cleanup data, happy-path finance flows).

## TECHSPEC sections

- §1.3 — Success criteria & test coverage
- §6.1, §6.2 — Test pyramid, coverage gates
- §8.3 — Definition of Done

## Part 1 — Vitest (unit/integration)

### 1.1 Scope

- **Dashboard**: Service/hooks tests for balance, month-balance, due-periodic-expenses (MSW); Home screen loading/success/error/retry if not already covered.
- **Bulk transactions**: Service `useBulkCreateTransactionsMutation`; BulkTransactionsDialog or transactions module integration (submit bulk payload, success/error).
- **Import/export (transaction manager)**: Service `useImportPreviewMutation`, `downloadCsvBlob` or export flow; ImportTransactionsDialog parse + preview + submit (MSW). Optional: small fixture rows for import (see §1.2).
- **Filters**: Categories (is_income), Subcategories (belongs_to_income, category_id), Transactions (year, month, day, subcategory_id, hangout_id; sort). Assert query params or list response.
- **Periodic**: Subcategory form/list for is_periodic, due_day; types and API usage.

### 1.2 §1.3 mapping

Produce a table mapping each §1.3 case (auth, categories list, API client, navigation, finance stream) to test file and describe block. Ensure all applicable cases are covered; coverage gate (80% lines/statements, 70% branches/functions) applies to §1.3-touched code.

### 1.3 Import fixture (optional)

If needed for import tests, use a minimal pasted-row fixture (e.g. 2–3 rows: category, subcategory, value, description, date) in `src/tests/e2e/fixtures/` or a shared test fixture. User may provide a preferred mock set later; implementation can use a minimal in-repo fixture so tests are unblocked.

---

## Part 2 — Playwright E2E

### 2.1 Environment and config

- **Config file**: `playwright.config.ts` at repo root.
- **Test location**: `src/tests/e2e/` (e.g. `src/tests/e2e/*.spec.ts` and `src/tests/e2e/pages/` for page objects).
- **App URL**: From env `VITE_APP_URL` (multi-environment safe). Playwright runs in Node; load `.env` in config (e.g. `dotenv` devDependency) so `process.env.VITE_APP_URL`, `VITE_E2E_USER_EMAIL`, `VITE_E2E_USER_PASSWORD` are set. Base URL in Playwright = `VITE_APP_URL`.
- **Backend**: Real backend only; app uses `VITE_API_URL` (no E2E-specific mocking). Tests hit the same backend the app is configured with.
- **Auth**: Real Auth0 login flow in the browser (no bypass). Credentials: `VITE_E2E_USER_EMAIL`, `VITE_E2E_USER_PASSWORD` (from `.env`; same as `src/config.ts` e2e section). Single role, single user.
- **Browser**: Chromium-only (e.g. Opera GX compatible). No WebKit/Firefox required.
- **Timeout**: Measure full E2E suite duration once; set default timeout to measured value + 3 minutes to allow for response delays. No CI for now; threshold is for local runs.

### 2.2 Data strategy

- **Option B**: Tests create and clean up their own data via the UI (and optionally API) to assert true user flow. Cleanup is part of the test or afterEach so data does not leak between runs.

### 2.3 Structure and patterns

- **Page object pattern** from the start: `src/tests/e2e/pages/` (e.g. `LoginPage`, `LayoutPage`, `CategoriesPage`, `TransactionsPage`, `HomePage`, etc.) with selectors and actions. Specs use page objects; direct selectors only where page object would be overkill.
- **Fixtures**: Shared auth fixture (e.g. `test.extend` with authenticated state: login once, reuse session) to avoid logging in every test. Optional: `src/tests/e2e/fixtures/` for import paste data.

### 2.4 E2E scope (happy path)

1. **Auth and navigation**
   - Unauthenticated: redirect to login; after login (real Auth0), user reaches Home and can navigate to Categories, Subcategories, Transactions, Hangouts via layout.
2. **Finance flows (happy path)**
   - **Categories**: List loads; filter by type (income/expense) if UI exposes it; at least one CRUD smoke (create category, then delete or edit).
   - **Subcategories**: List loads; filter by type and category; periodic fields (is_periodic, due_day) visible in list/form; one CRUD smoke.
   - **Transactions**: List loads; default or set current-month filter; filter by date/subcategory/hangout; sort by date (newest first); one single-transaction create; **Bulk**: open bulk dialog, add tree entries, submit, assert list update; **Import**: paste rows → Preview → Create N transactions → assert list; **Export**: Export CSV with current filters, assert download (e.g. file name or non-empty content).
   - **Home dashboard**: Balance and month balance visible; due periodic expenses for selected month (basic assertion).
3. **CRUD smoke**
   - At least one create/edit/delete flow per resource (Categories, Subcategories, Transactions, Hangouts) so full path is exercised; cleanup as part of test or afterEach.

### 2.5 Out of scope for E2E

- Visual regression (screenshot comparison).
- Mobile viewport / device emulation.
- Performance profiling is optional (nice-to-have, not required).

### 2.6 Scripts and docs

- **Script**: `npm run test:e2e` (or `playwright test`) to run E2E. Add to `package.json`. Playwright install step (browsers) documented in README.
- **README**: Document that E2E requires `.env` with `VITE_APP_URL`, `VITE_E2E_USER_EMAIL`, `VITE_E2E_USER_PASSWORD`, and a running app + backend; real Auth0 and real backend.

---

## Part 3 — Implementation order

1. Add devDependencies: `@playwright/test`, `dotenv`. Playwright config at root; load dotenv; baseURL and credentials from env.
2. Add `src/tests/e2e/` with page objects (Login, Layout, Home, Categories, Subcategories, Transactions, Hangouts) and auth fixture.
3. Implement E2E specs: auth + navigation first; then finance flows (filters, periodic, dashboard, bulk, import, export) and CRUD smoke; create/cleanup data in tests.
4. Measure full E2E run time; set timeout = measured + 3 minutes.
5. Vitest: add or extend tests for dashboard, bulk, import/export, filters, periodic; §1.3 mapping table; ensure coverage gate passes.

---

## Definition of Done (TECHSPEC §8.3)

- Spec committed before implementation.
- Gate `npm test && npx biome check .` passes before every commit.
- E2E: `npm run test:e2e` (or equivalent) runs full Playwright suite; real Auth0 and real backend; credentials from .env; Chromium-only; timeout set per spec.
- §1.3 case verification table produced; coverage gate (80%/70%) met for §1.3-touched code.
- Phase summary (phase-24-SUMMARY.md) on branch before merge.
- STATE.md updated; branch merged to main with --no-ff.
