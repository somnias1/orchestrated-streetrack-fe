# Phase 22 — Bulk transactions

## Goal

Add **bulk transaction creation** to the Transactions screen:

- Frontend can create many transactions in one request via **POST `/transactions/bulk`**
- Users can open a **Bulk** dialog from the existing Transactions “Add” menu, enter multiple rows, validate, and submit
- On success, Transactions list is refreshed and the dialog closes; on failure, an actionable error is shown

## Scope

### 1) API / services

- Add `TransactionBulkCreate` types matching backend OpenAPI:
  - Request body: `{ transactions: TransactionCreate[] }`
  - Response: `TransactionRead[]` (201)
- Add `useBulkCreateTransactionsMutation` React Query mutation using the shared `callbackApi` and `config.apiUrl`
- Add a `transactionsPaths.bulk` constant for the endpoint path (no leading slash, consistent with other services)

### 2) UI — `BulkTransactionsDialog`

- Implement `BulkTransactionsDialog` and wire it to the existing stub (`Transactions` → Add menu → Bulk)
- Dialog contents:
  - A compact editable **table/list of rows** (each row = one TransactionCreate)
  - Controls: **Add row**, **Remove row**, **Cancel**, **Submit**
  - Fields per row:
    - `date` (required, yyyy-mm-dd)
    - `subcategory_id` (required; select from loaded Subcategories)
    - `hangout_id` (optional; select from loaded Hangouts; allow “None”)
    - `value` (required integer; allow negative/positive as entered)
    - `description` (required non-empty)
- Validation:
  - Use Zod (same style as `TransactionFormDialog`) for per-row validation and show inline errors
  - Disable Submit if there are no rows or if validation fails
- UX:
  - Show submit loading state
  - On mutation error, show a visible error message and keep the dialog open (user can fix and retry)

## Non-goals

- Import/paste parsing and preview flow (that’s Phase 23 “Transaction manager import/export”)
- Advanced “normalized tree” UI (group by category/subcategory/hangout). For Phase 22 we send the OpenAPI request shape.

## Acceptance criteria

- From `Transactions` screen, selecting **Add → Bulk** opens `BulkTransactionsDialog`
- Submitting valid rows calls **POST `/transactions/bulk`** with `{ transactions: [...] }`
- On success:
  - Dialog closes
  - Transactions list is invalidated/refetched
- On error:
  - Dialog stays open
  - Error message is shown with the ability to retry by pressing Submit again

## Gate (before every commit)

```bash
npm test && npx biome check .
```

