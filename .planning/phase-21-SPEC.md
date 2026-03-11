# Phase 21 — Home dashboard

## Goal

Dashboard API client and hooks; Home screen with balance, month balance, due periodic expenses (TECHSPEC §3.4, §4.3, §4.1).

## Scope

- **Dashboard service** (`src/services/dashboard/`):
  - **types.ts**: `DashboardBalanceRead` (`{ balance: number }`), `DashboardMonthBalanceRead` (`{ balance: number, year: number, month: number }`), `DashboardDuePeriodicExpenseRead` (`subcategory_id`, `subcategory_name`, `category_id`, `category_name`, `due_day: number | null`, `paid: boolean`). GET `/dashboard/due-periodic-expenses` returns array of `DashboardDuePeriodicExpenseRead`.
  - **constants.ts**: Path strings for `dashboard/balance`, `dashboard/month-balance`, `dashboard/due-periodic-expenses` (no leading slash); query key(s).
  - **index.ts**: API client via callbackApi; React Query hooks: `useDashboardBalanceQuery`, `useDashboardMonthBalanceQuery(year, month)`, `useDashboardDuePeriodicExpensesQuery(year, month)`.
- **Home screen** (`src/modules/home/index.tsx`):
  - Display cumulative balance (GET `/dashboard/balance`).
  - Display month balance for selected year+month (GET `/dashboard/month-balance?year=&month=`); year+month selector (default current month).
  - Display due periodic expenses for selected month (GET `/dashboard/due-periodic-expenses?year=&month=`); list/cards with subcategory name, category name, due day, paid flag.
  - Loading and error states with retry CTA (refetch) for each section or combined as appropriate.

## TECHSPEC refs

- §3.4 Screens & Navigation — Home: dashboard (balance, month balance, due periodic expenses; loading/error + retry)
- §4.1 Data Model — Dashboard DTOs (DashboardBalanceRead, DashboardMonthBalanceRead, DashboardDuePeriodicExpenseRead)
- §4.3 APIs & Contracts — GET dashboard/balance, month-balance, due-periodic-expenses; frontend service layout

## Out of scope

- Bulk transactions (Phase 22)
- Transaction manager import/export (Phase 23)

## Definition of done

- Dashboard types match backend OpenAPI; service and hooks in place; Home shows balance, month balance (with selector), due periodic expenses; loading/error + retry.
- `npm test && npx biome check .` passes before every commit.
