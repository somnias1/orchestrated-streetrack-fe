# Phase 07 — Transactions List & Virtual

**Goal:** Transactions service, store, list screen with virtualized table, and Transactions in layout nav.

**Key TECHSPEC:** §1.6, §3.2, §3.4, §4.1, §4.2, §4.3, §5.1

---

## Scope

### 1. Transactions service (§4.1, §4.3)

- **Types** (`src/services/transactions/types.ts`): `TransactionRead`, `TransactionCreate`, `TransactionUpdate`, `GetTransactionsResponse` matching TECHSPEC §4.1 (id, subcategory_id, value, description, date, hangout_id, user_id).
- **Constants** (`src/services/transactions/constants.ts`): path `transactions` (no leading slash).
- **API** (`src/services/transactions/index.ts`): `fetchTransactions(options?: { skip?, limit? })` calling `GET /transactions/` with optional skip/limit; use callbackApi (Bearer token).

### 2. Transactions store (§4.2)

- **Zustand store** (`src/modules/transactions/store.ts`): state `items: TransactionRead[]`, `loading`, `error`; action `fetchTransactions(options?)`; same pattern as categories/subcategories store.

### 3. Transactions list screen & virtualized table (§3.4, §5.1)

- **Screen** (`src/modules/transactions/index.tsx`): Title "Transactions (n)", call `fetchTransactions` on mount, render `TransactionsTable` with items, loading, error, onRetry.
- **Table** (`src/modules/transactions/transactionsTable/`): Virtualized table (TanStack Table + react-virtual) with columns: Description, Value (formatted number), Date, Subcategory ID (truncated), Hangout ID (truncated or "—"). Reuse patterns from subcategoriesTable: sticky header, loading/error/empty body states, retry button, grid layout, theme tokens. Types in `transactionsTable/types.ts`.

### 4. Routes and layout (§3.2, §3.4)

- **Routes** (`src/routes.ts`): Add `transactions: '/transactions'`.
- **App** (`src/App.tsx`): Add route for `routes.transactions` → Transactions screen.
- **Layout** (`src/modules/layout/index.tsx`): Add nav link "Transactions" to `routes.transactions` (icon e.g. `ReceiptLongRounded` or `PaymentRounded`).

### 5. Tests

- **Transactions service**: Unit test `fetchTransactions` (mocked callbackApi): correct path and params (skip, limit).
- **Transactions store**: Unit tests: success sets items; failure sets error; pass skip/limit to API.
- **Transactions screen**: Integration tests (MSW): loading, success (rows), error + Retry, empty state, Retry refetch.
- **Layout**: Update test to assert Transactions link and href `routes.transactions`.

### 6. Definition of done (§8.3)

- [x] Phase 07 spec committed (this file).
- [x] Transactions service, store, screen, and virtualized table implemented.
- [x] Transactions route and layout nav added.
- [x] Tests for service, store, screen; Layout test updated. Coverage gate passes.
- [x] Gate: `npm test && npx biome check .` passes.
- [x] Phase SUMMARY: `.planning/phase-07-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 07)

- Transactions CRUD (create/edit/delete) — Phase 11.
- Filtering/sorting by date or category (optional; BACKLOG medium).
- Resolving subcategory/hangout names in list (show IDs for now).
