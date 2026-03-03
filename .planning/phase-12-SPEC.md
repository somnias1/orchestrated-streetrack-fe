# Phase 12 — Hangouts Full CRUD UI

**Goal:** Create, edit, and delete Hangouts from the UI; forms with Zod validation; POST/PATCH/DELETE via hangouts service.

**Key TECHSPEC:** §1.6, §3.4, §3.5, §4.3 (Hangouts)

**Depends on:** Phase 08 (Hangouts list)

---

## Scope

### 1. Hangouts service (§4.3)

- **Constants** (`src/services/hangouts/constants.ts`): Add path helpers for single hangout: `get(id)`, `update(id)`, `delete(id)` (e.g. `hangouts/${id}`).
- **API** (`src/services/hangouts/index.ts`):
  - `createHangout(body: HangoutCreate)` → POST `hangouts`, returns HangoutRead (201).
  - `getHangout(id: string)` → GET `hangouts/{id}`, returns HangoutRead (200).
  - `updateHangout(id: string, body: HangoutUpdate)` → PATCH `hangouts/{id}`, returns HangoutRead (200).
  - `deleteHangout(id: string)` → DELETE `hangouts/{id}`, returns void (204).
- Use callbackApi (Bearer token). Types in `types.ts` (HangoutCreate, HangoutUpdate).

### 2. Hangouts store (§4.2)

- **Zustand store** (`src/modules/hangouts/store.ts`): Add actions:
  - `createHangout(body)` → call API; on success call `fetchHangouts()` and clear error.
  - `updateHangout(id, body)` → call API; on success call `fetchHangouts()`.
  - `deleteHangout(id)` → call API; on success call `fetchHangouts()`.
- On API errors, set store `error` (and optionally loading false) so UI can show retry or inline error.

### 3. Hangout form dialog (§3.5)

- **Dialog** (`src/modules/hangouts/hangoutFormDialog/`): Reusable for Create and Edit.
  - **Zod schema**: `name` (string, min 1), `date` (string, date format), `description` (string optional/nullable). Match HangoutCreate/HangoutUpdate.
  - **Fields**: Name (text, required), Date (date input), Description (text, optional).
  - **Actions**: Submit (primary), Cancel (secondary). On submit: validate with Zod; if invalid show inline errors; if valid call store `createHangout` or `updateHangout`, then close dialog; refetch done by store.
  - Use MUI Dialog, TextField, Button; theme from `src/theme/tailwind.ts`. Display 422 `detail[]` as inline field errors when provided.

### 4. Delete confirmation

- **Delete confirmation dialog**: Before DELETE, show a small dialog: "Delete this hangout? This cannot be undone." Confirm / Cancel. On confirm call store `deleteHangout(id)` then close.

### 5. Hangouts screen and table (§3.4)

- **Screen** (`src/modules/hangouts/index.tsx`): Add "Create hangout" button (primary) above the table. Wire open state for create dialog. No route change for create/edit (dialogs only).
- **Table** (`src/modules/hangouts/hangoutsTable/index.tsx`): Replace placeholder "—" in Actions column with:
  - **Edit** button: opens Hangout form dialog with that row's hangout (prefilled); on submit call `updateHangout(id, body)`.
  - **Delete** button: opens delete confirmation dialog; on confirm call `deleteHangout(id)`.
- Pass callbacks from screen to table: `onEdit(hangout)`, `onDelete(hangout)`; screen holds dialog open state and selected hangout for edit/delete.

### 6. Tests

- **Hangouts service**: Unit tests for `createHangout`, `getHangout`, `updateHangout`, `deleteHangout` (mocked callbackApi: correct method, path, body).
- **Hangouts store**: Unit tests for create/update/delete: success triggers refetch; failure sets error.
- **Hangouts screen + dialogs**: Integration tests (MSW): create flow, edit flow, delete flow; optionally validation errors prevent submit.
- **HangoutsTable**: Assert Edit and Delete buttons per row.

### 7. Definition of done (§8.3)

- [x] Phase 12 spec committed (this file).
- [x] Hangouts service CRUD (create, get, update, delete) implemented.
- [x] Hangouts store create/update/delete actions implemented.
- [x] Hangout form dialog (Zod) and delete confirmation dialog implemented.
- [x] Screen has Create button; table has Edit/Delete per row; all flows work.
- [x] Tests for service, store, and CRUD flows; coverage gate passes.
- [x] Gate: `npm test && npx biome check .` passes.
- [x] Phase SUMMARY: `.planning/phase-12-SUMMARY.md` committed before merge.

---

## Out of scope (Phase 12)

- Inline editing in table (use dialogs only).
- Bulk delete or bulk edit.
