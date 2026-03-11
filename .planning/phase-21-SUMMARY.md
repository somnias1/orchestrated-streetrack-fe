# Phase 21 — Home dashboard

## What was built

- **Dashboard service** (`src/services/dashboard/`): Types `DashboardBalanceRead`, `DashboardMonthBalanceRead`, `DashboardDuePeriodicExpenseRead` matching backend OpenAPI; constants for paths and query key; React Query hooks `useDashboardBalanceQuery`, `useDashboardMonthBalanceQuery(year, month)`, `useDashboardDuePeriodicExpensesQuery(year, month)` using callbackApi.
- **Home screen** (`src/modules/home/`): Dashboard heading; year+month selector (default current month); three sections: cumulative balance (GET /dashboard/balance), month balance (GET /dashboard/month-balance), due periodic expenses list (GET /dashboard/due-periodic-expenses). Each section has loading (spinner), error (message + Retry button), and success (data). Due expenses show subcategory name, category name, due day, and paid/Due badge.

## Files changed

- `.planning/phase-21-SPEC.md`: Phase scope and DoD (committed on main before branch).
- `src/services/dashboard/types.ts`: DashboardBalanceRead, DashboardMonthBalanceRead, DashboardDuePeriodicExpenseRead, GetDashboardDuePeriodicExpensesResponse.
- `src/services/dashboard/constants.ts`: dashboardQueryKey, dashboardPaths (balance, monthBalance, duePeriodicExpenses).
- `src/services/dashboard/index.ts`: useDashboardBalanceQuery, useDashboardMonthBalanceQuery, useDashboardDuePeriodicExpensesQuery.
- `src/modules/home/constants.ts`: DEFAULT_DASHBOARD_YEAR/MONTH, MONTHS, DASHBOARD_YEAR_OPTIONS.
- `src/modules/home/index.tsx`: Home component with DashboardSection, DueExpenseItem, balance/month balance/due expenses sections and retry CTA.

## Decisions made

- **Dashboard types:** Used exact backend schemas provided by user (balance number; month balance with year/month; due periodic expense with subcategory_id/name, category_id/name, due_day, paid).
- **Month params:** Month balance and due periodic expenses share the same year+month selector; queries enabled only when params are set (always true once state is initialized).
- **Per-section loading/error/retry:** Each of the three sections has its own loading state, error message, and Retry button calling the corresponding refetch.

## Tests added

- No new test file; Home is in coverage exclude list per TECHSPEC. All 64 existing tests pass.

## Known issues / follow-ups

- None. Phase 22 (bulk transactions) next.
