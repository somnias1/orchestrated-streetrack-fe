# Phase 11 — Transactions Full CRUD UI

**Goal:** Create, edit, and delete Transactions from the UI; forms with Zod validation; subcategory and hangout pickers; POST/PATCH/DELETE via transactions service.

**Key TECHSPEC:** §1.6, §3.4, §3.5, §4.3 (Transactions)

**Depends on:** Phase 07 (Transactions list), Phase 08 (Hangouts list)

---

## Scope

### 1. Transactions service (§4.3)

- **Constants** (`src/services/transactions/constants.ts`): Add path helpers for single transaction: `get(id)`, `update(id)`, `delete(id)` (e.g. `transactions/${id}`).
- **API** (`src/services/transactions/index.ts`):
  - `createTransaction(body: TransactionCreate)` → POST `transactions`, returns TransactionRead (201).
  - `getTransaction(id: string)` → GET `transactions/{id}`, returns TransactionRead (200).
  - `updateTransaction(id: string, body: TransactionUpdate)` → PATCH `transactions/{id}`, returns TransactionRead (200).
  - `deleteTransaction(id: string)` → DELETE `transactions/{id}`, returns void (204).
- Use callbackApi (Bearer token). Types in `types.ts` (TransactionCreate, TransactionUpdate).

### 2. Transactions store (§4.2)

- **Zustand store** (`src/modules/transactions/store.ts`): Add actions:
  - `createTransaction(body)` → call API; on success call `fetchTransactions()` and clear error.
  - `updateTransaction(id, body)` → call API; on success call `fetchTransactions()`.
  - `deleteTransaction(id)` → call API; on success call `fetchTransactions()`.
- On API errors, set store `error` (and optionally loading false) so UI can show retry or inline error.

### 3. Transaction form dialog (§3.5)

- **Dialog** (`src/modules/transactions/transactionFormDialog/`): Reusable for Create and Edit.
  - **Zod schema**: `subcategory_id` (string, min 1), `value` (number, integer), `description` (string, min 1), `date` (string, date format), `hangout_id` (string nullable/optional). Match TransactionCreate/TransactionUpdate.
  - **Fields**: Subcategory (select from subcategories store), Value (number input), Description (text, required), Date (date input), Hangout (select, optional — "None" or list from hangouts store).
  - **Actions**: Submit (primary), Cancel (secondary). On submit: validate with Zod; if invalid show inline errors; if valid call store `createTransaction` or `updateTransaction`, then close dialog; refetch done by store.
  - Use MUI Dialog, TextField, Select (subcategory + hangout pickers), Button; theme from `src/theme/tailwind.ts`. Display 422 `detail[]` as inline field errors when provided.

### 4. Delete confirmation

- **Delete confirmation dialog**: Before DELETE, show a small dialog: “Delete this transaction? This cannot be undone.” Confirm / Cancel. On confirm call store `deleteTransaction(id)` then close.

### 5. Transactions screen and table (§3.4)

- **Screen** (`src/modules/transactions/index.tsx`): Add “Create transaction” button (primary) above the table. Wire open state for create dialog. No route change for create/edit (dialogs only). Fetch subcategories and hangouts when needed (for form pickers).
- **Table** (`src/modules/transactions/transactionsTable/index.tsx`): Replace placeholder “—” in Actions column with:
  - **Edit** button: opens Transaction form dialog with that row’s transaction (prefilled); on submit call `updateTransaction(id, body)`.
  - **Delete** button: opens delete confirmation dialog; on confirm call `deleteTransaction(id)`.
- Pass callbacks from screen to table: `onEdit(transaction)`, `onDelete(transaction)`; screen holds dialog open state and selected transaction for edit/delete.

### 6. Tests

- **Transactions service**: Unit tests for `createTransaction`, `getTransaction`, `updateTransaction`, `deleteTransaction` (mocked callbackApi: correct method, path, body).
- **Transactions store**: Unit tests for create/update/delete: success triggers refetch; failure sets error.
- **Transactions screen + dialogs**: Integration tests (MSW): create flow, edit flow, delete flow; optionally validation errors prevent submit.
- **TransactionsTable**: Assert Edit and Delete buttons per row.

### 7. Definition of done (§8.3)

- [x] Phase 11 spec committed (this file).
- [x] Transactions service CRUD (create, get, update, delete) implemented.
- [x] Transactions store create/update/delete actions implemented.
- [x] Transaction form dialog (Zod, subcategory + hangout pickers) and delete confirmation dialog implemented.
- [x] Screen has Create button; table has Edit/Delete per row; all flows work.
- [x] Tests for service, store, and CRUD flows; coverage gate passes.
- [x] Gate: `npm test && npx biome check .` passes.
- [x] Phase SUMMARY: `.planning/phase-11-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 11)

- Hangouts Full CRUD UI — Phase 12.
- Inline editing in table (use dialogs only).
- Bulk delete or bulk edit.
