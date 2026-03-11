# Phase 23 — Transaction manager import/export

## What was built

- **Transaction manager service** (`src/services/transactionManager/`): types (TransactionImportRow, TransactionImportRequest, TransactionImportPreview, TransactionExportParams), path constants, `useImportPreviewMutation`, and `downloadCsvBlob` helper for CSV download.
- **Import flow**: ImportTransactionsDialog with paste textarea (tab- or comma-separated), Preview (POST /transaction-manager/import), display of valid/invalid rows, and Create N transactions (POST /transactions/bulk). Parse helper `parsePastedRows` for pasted text.
- **Export flow**: Export CSV button on Transactions screen; uses current list filters (year, month, day, subcategory_id, hangout_id), GET /transaction-manager/export with responseType blob, triggers file download.
- **Transactions screen**: Add menu now has Transaction | Bulk | Import; Export CSV button added; Import and Export wired with error handling and loading states.

## Files changed

- `src/services/transactionManager/constants.ts`: path constants for import and export.
- `src/services/transactionManager/types.ts`: OpenAPI-aligned import/export types.
- `src/services/transactionManager/index.ts`: useImportPreviewMutation, downloadCsvBlob, export of transactionManagerPaths.
- `src/modules/transactions/importTransactionsDialog/parsePaste.ts`: parse pasted text into TransactionImportRow[].
- `src/modules/transactions/importTransactionsDialog/types.ts`: ImportTransactionsDialogProps.
- `src/modules/transactions/importTransactionsDialog/index.tsx`: Import dialog UI (paste, preview, submit).
- `src/modules/transactions/index.tsx`: Import in Add menu, Export CSV button, ImportTransactionsDialog, handlers and state.

## Decisions made

- **Export**: Reuse current Transactions list filters for export params; single “Export CSV” button (no separate export dialog). Filename: `transactions-export-YYYY-MM-DD.csv`.
- **Import submit**: Submit only when preview has no invalid rows (user must fix or remove bad rows before creating).
- **Paste format**: Tab or comma as delimiter; columns Category, Subcategory, Value, Description, Date, optional HangoutId; backend resolves category/subcategory by name.

## Tests added

- None this phase. Phase 24 covers finance expansion tests (dashboard, bulk, import/export, filters).

## Known issues / follow-ups

- None. Optional later: “Copy to clipboard” / “Paste from clipboard” refinements (BACKLOG Later).
