# Phase 08 — Hangouts List & Virtual

**Goal:** Hangouts service, store, list screen with virtualized table, and Hangouts in layout nav.

**Key TECHSPEC:** §1.6, §3.2, §3.4, §4.1, §4.2, §4.3, §5.1

---

## Scope

### 1. Hangouts service (§4.1, §4.3)

- **Types** (`src/services/hangouts/types.ts`): `HangoutRead`, `HangoutCreate`, `HangoutUpdate`, `GetHangoutsResponse` matching TECHSPEC §4.1 (id, name, description, date, user_id).
- **Constants** (`src/services/hangouts/constants.ts`): path `hangouts` (no leading slash).
- **API** (`src/services/hangouts/index.ts`): `fetchHangouts(options?: { skip?, limit? })` calling `GET /hangouts/` with optional skip/limit; use callbackApi (Bearer token).

### 2. Hangouts store (§4.2)

- **Zustand store** (`src/modules/hangouts/store.ts`): state `items: HangoutRead[]`, `loading`, `error`; action `fetchHangouts(options?)`; same pattern as categories/subcategories/transactions store.

### 3. Hangouts list screen & virtualized table (§3.4, §5.1)

- **Screen** (`src/modules/hangouts/index.tsx`): Title "Hangouts (n)", call `fetchHangouts` on mount, render `HangoutsTable` with items, loading, error, onRetry.
- **Table** (`src/modules/hangouts/hangoutsTable/`): Virtualized table (TanStack Table + react-virtual) with columns: Name, Description (truncated or "—"), Date. Reuse patterns from transactionsTable: sticky header, loading/error/empty body states, retry button, grid layout, theme tokens. Types in `hangoutsTable/types.ts`.

### 4. Routes and layout (§3.2, §3.4)

- **Routes** (`src/routes.ts`): Add `hangouts: '/hangouts'`.
- **App** (`src/App.tsx`): Add route for `routes.hangouts` → Hangouts screen.
- **Layout** (`src/modules/layout/index.tsx`): Add nav link "Hangouts" to `routes.hangouts` (icon e.g. `GroupRounded` or `EventRounded`).

### 5. Tests

- **Hangouts service**: Unit test `fetchHangouts` (mocked callbackApi): correct path and params (skip, limit).
- **Hangouts store**: Unit tests: success sets items; failure sets error; pass skip/limit to API.
- **Hangouts screen**: Integration tests (MSW): loading, success (rows), error + Retry, empty state, Retry refetch.
- **Layout**: Update test to assert Hangouts link and href `routes.hangouts`.

### 6. Definition of done (§8.3)

- [x] Phase 08 spec committed (this file).
- [x] Hangouts service, store, screen, and virtualized table implemented.
- [x] Hangouts route and layout nav added.
- [x] Tests for service, store, screen; Layout test updated. Coverage gate passes.
- [x] Gate: `npm test && npx biome check .` passes.
- [x] Phase SUMMARY: `.planning/phase-08-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 08)

- Hangouts CRUD (create/edit/delete) — Phase 12.
- Filtering/sorting (optional; BACKLOG medium).
