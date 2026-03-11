# Phase 23 — Transaction manager import/export

## Goal (from ROADMAP)

Import (paste → preview → bulk); Export (date-filtered CSV download).

## TECHSPEC sections

- §4.3 — API endpoints (transaction-manager: import, export)
- §3.4 — Screens and UX (Transactions: entry points for Import and Export)

## Scope

### 1. Transaction manager service (`src/services/transactionManager/`)

- **Types** (OpenAPI-aligned):
  - `TransactionImportRow`: category_name, subcategory_name, value, description, date, hangout_id?
  - `TransactionImportRequest`: { rows: TransactionImportRow[] }
  - `TransactionImportInvalidRow`: row_index, message
  - `TransactionImportPreview`: { transactions: TransactionCreate[], invalid_rows: TransactionImportInvalidRow[] }
- **Constants**: paths `transaction-manager/import`, `transaction-manager/export` (no leading slash).
- **Import**: `importPreview(body: TransactionImportRequest)` → POST, returns `TransactionImportPreview`. Used to validate pasted rows and get payload for bulk create.
- **Export**: `exportCsv(params?: ExportParams)` → GET with query year?, month?, day?, subcategory_id?, hangout_id?; response type blob (text/csv); returns Blob for download.

### 2. React Query hooks (in same service)

- `useImportPreviewMutation`: mutation that calls import preview API.
- Export: no query/mutation cache needed; call export API and trigger file download (e.g. imperative in click handler using callbackApi with responseType: 'blob').

### 3. Import UI

- **Entry**: Transactions screen — add "Import" to the Add menu (Transaction | Bulk | Import) or a separate Import button.
- **Flow**: User opens Import dialog → pastes text (e.g. TSV/CSV rows: category, subcategory, value, description, date[, hangout_id]) → "Preview" calls POST /transaction-manager/import → show preview: valid rows count + invalid rows (row index + message). User can "Create X transactions" to submit preview.transactions via existing POST /transactions/bulk. On success close dialog and invalidate transactions list.
- **Parsing**: Backend expects `TransactionImportRequest.rows` — each row has category_name, subcategory_name, value, description, date, hangout_id?. Frontend must parse pasted text into rows (e.g. split by newline, then by tab or comma) and build rows array. Exact format can be documented in UI (e.g. "Paste rows: Category	Subcategory	Value	Description	Date	HangoutId (optional)").
- **Import dialog**: Paste textarea, Preview button, preview results (valid count, invalid rows list), Submit bulk button (enabled when preview has transactions and no errors, or allow submit valid only). Error state with retry.

### 4. Export UI

- **Entry**: Transactions screen — "Export" button (e.g. next to filters or in header).
- **Flow**: User sets filters (reuse existing year, month, day, subcategory_id, hangout_id from list params) or a dedicated export form; clicks Export → GET /transaction-manager/export with same query params → download CSV file (e.g. filename `transactions-YYYY-MM-DD.csv` or `transactions-export.csv`).
- **Implementation**: Use current list filters as export params by default; optional: small export dialog with same filter controls and "Download CSV". Simplest: one "Export" button that uses current filters and triggers download.

### 5. Wiring

- Transactions module: add Import to Add menu (or separate button), add Export button. Import dialog and Export action use transaction-manager service and existing bulk mutation (for import submit).

## Out of scope this phase

- Clipboard copy/paste refinements (BACKLOG Later).
- Changing backend API contract.

## Definition of Done (TECHSPEC §8.3)

- Spec committed before implementation.
- Gate `npm test && npx biome check .` passes before every commit.
- Phase summary (phase-23-SUMMARY.md) on branch before merge.
- STATE.md updated; branch merged to main with --no-ff.
