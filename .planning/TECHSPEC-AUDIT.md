# TECHSPEC Audit Report

**Date:** 2026-03-09 (re-run; ROADMAP through Phase 24)  
**Scope:** Compare project to TECHSPEC.md: §1.3 test mapping, §8.3 Definition of Done, all ROADMAP phases (01–24), post-Phase-16 bugfixes, README (§1.5, §8.3), coverage (§6.2).

**Sources:** TECHSPEC.md, STATE.md, `.planning/phase-00-ROADMAP.md`, `.planning/phase-NN-SPEC.md`, `.planning/phase-NN-SUMMARY.md`, bugfix SPECs/SUMMARYs, `.planning/VIRTUAL-TABLE-SIZING-FIX.md`, README.md, `npm test -- --coverage`.

---

## 1. §1.3 Test Cases → Test File Mapping

TECHSPEC §1.3 requires tests to validate (as applicable per phase):

- **Auth:** Protected route redirects when not logged in; after login, user can reach protected pages.
- **Categories list:** Loads from API; virtualized rows; loading spinner; error state with **retry CTA**; empty state.
- **API client:** Bearer token attached to requests when user is authenticated.
- **Navigation:** Layout shows Home and Categories links; routing matches `routes.ts`.

Phase 16 extended the mapping to Subcategories, Transactions, and Hangouts list states. Phase 24 added Vitest for dashboard and transaction-manager services and full Playwright E2E (auth, navigation, dashboard, CRUD smoke, import/export).

| §1.3 test case | Test file | Describe / test(s) | Covered |
|----------------|-----------|--------------------|--------|
| **Auth:** Protected route redirects when not logged in | `src/modules/auth0/ProtectedRoute.test.tsx` | "redirects to login when not authenticated" | ✓ |
| **Auth:** After login, user can reach protected pages | `src/modules/auth0/ProtectedRoute.test.tsx`; E2E `navigation.spec.ts`, `dashboard.spec.ts` | "renders children when authenticated"; E2E nav + dashboard | ✓ |
| **Categories list:** loading, success, error+retry, empty | `src/modules/categories/Categories.test.tsx`; `src/services/categories/categories.test.tsx` | Loading spinner, virtualized rows, error+Retry, empty; service param/response | ✓ |
| **API client:** Bearer token when authenticated | `src/utils/callbackApi/callbackApi.test.ts` | "attaches Bearer token when token getter returns a token" | ✓ |
| **Navigation:** Layout, routes from `routes.ts` | `src/modules/layout/Layout.test.tsx`; E2E `navigation.spec.ts` | Home, Categories, Subcategories, Transactions, Hangouts links + hrefs; E2E app shell nav | ✓ |
| **Subcategories list:** loading, success, error+retry, empty | `src/modules/subcategories/Subcategories.test.tsx` | Same pattern as Categories (MSW + QueryClientProvider) | ✓ |
| **Transactions list:** loading, success, error+retry, empty | `src/modules/transactions/Transactions.test.tsx` | Same pattern | ✓ |
| **Hangouts list:** loading, success, error+retry, empty | `src/modules/hangouts/Hangouts.test.tsx` | Same pattern | ✓ |
| **Finance stream: dashboard** | `src/services/dashboard/dashboard.test.ts` | useDashboardBalanceQuery, useDashboardMonthBalanceQuery, useDashboardDuePeriodicExpensesQuery (MSW) | ✓ |
| **Finance stream: import/export (transaction manager)** | `src/services/transactionManager/transactionManager.test.ts` | useImportPreviewMutation (POST import preview); downloadCsvBlob (anchor + download) | ✓ |
| **Finance stream: filters, bulk, periodic** | Categories/Subcategories/Transactions tests; E2E | is_income, filters, bulk create; E2E transactions.spec (import, export) | ✓ |

**Summary:** All §1.3 test cases are covered by Vitest (unit/integration) and, where applicable, by Playwright E2E (auth, navigation, dashboard, CRUD smoke, import/export). Layout test and E2E navigation assert nav links and `routes.ts`. Phase 24 SUMMARY documents the extended §1.3 mapping.

---

## 2. §8.3 Definition of Done — Per-Bullet Assessment

| Bullet | Met? | Evidence |
|--------|------|----------|
| Code matches the phase spec (spec committed before implementation). | **Met** | Phases 01–24 have `.planning/phase-NN-SPEC.md`; SUMMARYs reference specs and describe delivered work. Bugfixes (04/07/08) have SPEC + SUMMARY. |
| All §1.3 test cases that apply to the phase are covered; mapping table produced for test phases. | **Met** | §1.3 mapping in §1 above; Phase 05, 16, and 24 SUMMARYs (and phase-24-SPEC.md) document the mapping. |
| README documents how to run app and tests. | **Met** | README: Setup, dev, build, preview, Vitest (`npm test`, `npm run test:coverage`), gate, **E2E section** (env vars, `npx playwright install chromium`, `npm run test:e2e`, `test:e2e:ui`). |
| **Gitflow complete:** Phase branch merged into `main`. | **Not verifiable from codebase** | STATE.md marks Phase 24 complete; audit cannot confirm merge history. Assumed met for completed phases. |
| **Lint gate:** Passed before every commit. | **Met** | Gate: `npm test && npx biome check .`. Vitest run: 14 files, 70 tests passed. Biome configured. |
| **Phase SUMMARY:** `.planning/phase-NN-SUMMARY.md` committed before merge. | **Met** | phase-01-SUMMARY.md through phase-24-SUMMARY.md present. Bugfix SUMMARYs for phases 04, 07, 08. |

**Overall:** All audit-able DoD items are met. **Coverage gate (§6.2)** fails on this run (see §5).

---

## 3. Phases (ROADMAP vs STATE.md vs Code & .planning/ SUMMARYs)

Source: `.planning/phase-00-ROADMAP.md`, STATE.md, `.planning/phase-NN-SPEC.md`, `.planning/phase-NN-SUMMARY.md`.

| Phase | Name (ROADMAP) | STATE.md | SPEC | SUMMARY | Code alignment |
|-------|----------------|----------|------|---------|----------------|
| **01** | Foundation & Auth Setup | — | ✓ | ✓ | config, routes, callbackApi, Auth0, placeholders. |
| **02** | Layout & Protected Routes | — | ✓ | ✓ | Layout shell, nav from routes. |
| **03** | Categories Data & Store | — | ✓ | ✓ | categories service, store, screen states. |
| **04** | Categories Table & UX | — | ✓ | ✓ | CategoriesTable (TanStack Table + Virtual), chips, states. |
| **05** | Tests & Verification | — | ✓ | ✓ | Vitest, RTL, MSW; auth, categories, API client, Layout; coverage gate; §1.3 mapping. |
| **06** | Subcategories List & Virtual | — | ✓ | ✓ | subcategories service, store, screen, virtualized table, route + nav, tests. |
| **07** | Transactions List & Virtual | — | ✓ | ✓ | transactions service, store, screen, virtualized table, route + nav, tests. |
| **08** | Hangouts List & Virtual | — | ✓ | ✓ | hangouts service, store, screen, virtualized table, route + nav, tests. |
| **09** | Categories Full CRUD UI | — | ✓ | ✓ | create/edit/delete Categories; form dialog, Zod; CRUD tests. |
| **10** | Subcategories Full CRUD UI | — | ✓ | ✓ | create/edit/delete Subcategories; category picker; forms; tests. |
| **11** | Transactions Full CRUD UI | — | ✓ | ✓ | create/edit/delete Transactions; subcategory/hangout pickers; tests. |
| **12** | Hangouts Full CRUD UI | — | ✓ | ✓ | hangouts CRUD, form + delete dialogs, table Edit/Delete; tests. |
| **13** | React Query services | — | ✓ | ✓ | TanStack React Query in services; modules use hooks; Zustand mirror; retry CTA refetch. |
| **14** | Theme, Layout & Categories Table Alignment | — | ✓ | ✓ | theme.css, light/dark toggle, theme store; table state row min height. |
| **15** | Remaining Screens & CRUD on shadcn | — | ✓ | ✓ | Subcategories/Transactions/Hangouts table state alignment; theme tokens. |
| **16** | Tests & coverage gate | — | ✓ | ✓ | §1.3 mapping; coverage gate (80/70%); 71 tests, 12 files (at that time). |
| **17** | List screens: category & transaction names | — | ✓ | ✓ | BE-provided names in Subcategories/Transactions lists; types, tables, MSW, tests. |
| **18** | UX/UI improvements | — | ✓ | ✓ | Type as Chips; Transaction/Bulk menu; default current-month filter; Hangouts action colors. |
| **19** | List filters and sort | — | ✓ | ✓ | Filters by type, category, date tree, subcategory, hangout; sort by date; default current month. |
| **20** | Periodic expenses (subcategories) | — | ✓ | ✓ | is_periodic, due_day in types, form, list. |
| **21** | Home dashboard | — | ✓ | ✓ | Dashboard API client and hooks; Home with balance, month balance, due periodic. |
| **22** | Bulk transactions | — | ✓ | ✓ | POST /transactions/bulk; BulkTransactionsDialog with tree and bulk submit. |
| **23** | Transaction manager import/export | — | ✓ | ✓ | Import (paste → preview → bulk); Export (date-filtered CSV download). |
| **24** | Finance expansion tests and polish | **Complete** | ✓ | ✓ | Vitest: dashboard.test.ts, transactionManager.test.ts; Playwright E2E (auth, nav, dashboard, CRUD, import/export); §1.3 mapping; README E2E. |

**STATE.md:** "Phase 24 — Finance expansion tests and polish (complete)." "Finance stream Phases 18–24 complete." "Next: None. Optional: tune E2E timeout; add CI for E2E when desired."

**Post-Phase-16 bugfixes:** Phase 04/07/08 virtual table full-width alignment (categoriesTable, transactionsTable, hangoutsTable) — SPEC + SUMMARY per phase; `.planning/VIRTUAL-TABLE-SIZING-FIX.md`. Layout/sizing only; gate passing where run.

**Conclusion:** All 24 ROADMAP phases have SPEC + SUMMARY and align with described deliverables in code. STATE marks Phase 24 complete. Bugfix workflow (SPEC → implementation → SUMMARY) documented and followed for 04/07/08.

---

## 4. README vs §1.5 and §8.3

### §1.5 Repository Deliverables — README

| Requirement | Met? | Evidence |
|-------------|------|----------|
| How to run the app (dev, build, preview) | **Met** | README: `npm run dev`, `npm run build`, `npm run preview` with descriptions and localhost:3000. |
| How to run tests | **Met** | README: `npm test`, `npm run test:coverage`; gate command and coverage gate (80% lines/statements, 70% branches/functions). **E2E:** env vars (`VITE_APP_URL`, `VITE_E2E_USER_EMAIL`, `VITE_E2E_USER_PASSWORD`), `npx playwright install chromium`, `npm run test:e2e`, `npm run test:e2e:ui`. |
| Key decisions and assumptions | **Partial** | README points to TECHSPEC.md; key decisions in STATE.md and TECHSPEC. |

### §8.3 DoD — README

- **Met.** README documents how to run app, unit/integration tests, gate, and E2E tests.

---

## 5. Coverage vs §6.2 (80% minimum)

**§6.2:** "Minimum coverage: Target **80%** for code touched by the phase (or overall). Verify with `npm test -- --coverage`. Gate before merge."

**Command run:** `npm test -- --coverage`.

**Result (this audit run):**

| Metric | Threshold (vitest.config.ts) | Actual (All files) | Pass? |
|--------|------------------------------|---------------------|-------|
| Statements | 80% | **73.01%** | ✗ |
| Lines | 80% | **75.16%** | ✗ |
| Branches | 70% | **59.6%** | ✗ |
| Functions | 70% | **71.98%** | ✓ |

- **Test run:** 14 test files, 70 tests passed.
- **Coverage gate:** **Fails** — statements, lines, and branches below thresholds. New modules (e.g. transactions/BulkTransactionsDialog, transactionFormDialog/parsePaste, transactionManager UI, dashboard usage in Home) and expanded codebase have increased uncovered code; Phase 24 added dashboard and transactionManager service tests but coverage is computed over all included source.

**Summary:** Coverage does **not** meet §6.2 on this run. To restore the gate: add or expand tests for low-coverage areas (e.g. bulk dialog, import dialog, parsePaste, Home dashboard), or adjust coverage excludes/thresholds per phase decision and document in TECHSPEC or phase SUMMARY.

---

## Summary

| Area | Status |
|------|--------|
| §1.3 test cases | All covered; mapping in §1; includes Auth, Categories/Subcategories/Transactions/Hangouts lists, API client, Navigation, dashboard, transaction-manager (import/export), and E2E. |
| §8.3 Definition of Done | All audit-able bullets met; Gitflow merge not verifiable from repo alone. |
| Phases (ROADMAP 01–24) | All 24 phases have SPEC + SUMMARY; code aligns; STATE: Phase 24 complete; Phase 04/07/08 bugfixes have SPEC + SUMMARY. |
| README (§1.5, §8.3) | Run app, unit/integration tests, gate, and E2E (env, playwright install, test:e2e) documented. |
| Coverage (§6.2) | **Not met.** Statements 73.01%, Lines 75.16%, Branches 59.6%, Functions 71.98% (thresholds 80/80/70/70). |

**Notes:** BACKLOG.md at repo root per §1.5. ROADMAP has 24 phases (01–24); Phases 18–24 = finance stream (UX, filters, periodic, dashboard, bulk, import/export, tests). E2E excluded from Vitest coverage (`src/tests/e2e/**` in vitest.config.ts).

---

## Changelog (TECHSPEC-AUDIT.md)

| Date | Change |
|------|--------|
| 2026-03-03 | Initial audit: §1.3 mapping, §8.3 DoD, phases 01–16, README, coverage; 12 files, 71 tests; coverage 87.24% stmts, 89.59% lines, 73.41% branch, 87.83% funcs. |
| 2026-03-03 | Re-run: Scope extended to post-Phase-16 bugfixes. STATE.md Phase 04/07/08 bugfixes. Bugfix SPECs/SUMMARYs and VIRTUAL-TABLE-SIZING-FIX.md. Phase 06 table row fix. Coverage 87.39% stmts, 89.77% lines, 73.19% branch, 88.42% funcs. Changelog added. |
| 2026-03-09 | Re-run: ROADMAP extended to Phase 24 (finance stream 18–24). §1.3 mapping extended (dashboard, transaction-manager, E2E per phase-24-SUMMARY). Phases table 01–24; STATE: Phase 24 complete. README E2E section. Coverage re-run: **fails** — 73.01% stmts, 75.16% lines, 59.6% branches, 71.98% funcs (below 80/80/70/70). Test run: 14 files, 70 tests passed. Changelog updated. |
