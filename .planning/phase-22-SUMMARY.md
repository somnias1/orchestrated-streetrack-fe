# Phase 22 — Bulk transactions

## What was built

- **Transactions bulk API**: `TransactionBulkCreate` and `BulkCreateTransactionsResponse` types; `transactionsPaths.bulk`; `useBulkCreateTransactionsMutation` calling POST `/transactions/bulk` via callbackApi.
- **BulkTransactionsDialog**: Dialog opened from Transactions “Add → Bulk”. Editable rows (date, subcategory, hangout, value, description); Add row / Remove row; Zod validation per row; Submit sends `{ transactions: TransactionCreate[] }`; on success dialog closes and transactions list invalidates; on error message shown and dialog stays open for retry.
- **Transactions screen**: Replaced bulk stub with `BulkTransactionsDialog`; bulk mutation invalidates transactions query on success; bulk submit error state and loading (submitting) passed into dialog.

## Files changed

- `src/services/transactions/types.ts`: Added `TransactionBulkCreate`, `BulkCreateTransactionsResponse`.
- `src/services/transactions/constants.ts`: Added `bulk` path.
- `src/services/transactions/index.ts`: Added `useBulkCreateTransactionsMutation`.
- `src/modules/transactions/bulkTransactionsDialog/types.ts`: New; props and row form type.
- `src/modules/transactions/bulkTransactionsDialog/schema.ts`: New; `bulkRowSchema` (Zod) for one row.
- `src/modules/transactions/bulkTransactionsDialog/index.tsx`: New; dialog with row grid, add/remove, validation, submit.
- `src/modules/transactions/index.tsx`: Wired `BulkTransactionsDialog`, `openBulk`, `handleBulkSubmit`, `useBulkCreateTransactionsMutation` with invalidation.

## Decisions made

- **Bulk request shape**: Use OpenAPI `TransactionBulkCreate` (flat `transactions: TransactionCreate[]`) for Phase 22; no normalized tree UI.
- **Row identity**: Rows have a stable `id` (`bulk-0`, `bulk-1`, …) for React keys to satisfy Biome `noArrayIndexKey`.
- **Vitest globals**: Removed direct `vitest` imports from test files and `setupTests.ts`; added `/// <reference types="vitest/globals" />` so the runner is found (fixes “Vitest failed to find the runner” on this codebase).

## Tests added

- None. Existing Transactions tests (including “Add button with Transaction and Bulk menu”) still pass; bulk dialog is not yet covered by a dedicated test.

## Known issues / follow-ups

- Phase 24 will add tests for bulk and other finance flows; §1.3 mapping then.
- Optional: add a test that opens Bulk, fills one row, and mocks POST /transactions/bulk success.
