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

---

## Extension: UX/UI improvements (post-merge)

Documenting follow-up changes merged as an extension to Phase 23.

### Snackbars (CRUD feedback)

- **Categories, Subcategories, Hangouts, Transactions**: Success Snackbar (autoHideDuration 1500ms) on create, update, and delete. Categories also show error Snackbar on delete failure (e.g. 409 "Cannot delete category: it has subcategories. Remove or reassign them first.").

### Tables (layout and scroll)

- **Categories, Subcategories, Hangouts, Transactions**: Table header rendered outside the scrollable body (grid-based header row) so it stays visible; body in a scrollable container with `maxHeight: 67vh`. Categories use MUI `TableContainer` for the scroll region. Improves readability with long lists.

### Theme

- **theme.css**: Themed scrollbars (thin, `--primary` thumb, `--border` track) for both Firefox and WebKit, respecting light/dark theme.
- **tailwind.ts**: `selectFormControlSx` extended with `& .MuiInputBase-input` color for consistent select field text in theme.

### Services

- **categories/constants.ts, subcategories/constants.ts**: Delete path no trailing slash to match backend.
- **dashboard/index.ts**: Removed `refetchOnMount: false` from balance, month-balance, and due-periodic-expenses queries so dashboard data refetches on mount.

### Import (paste format)

- **parsePaste.ts**: User format supported — Date (DD/MM/YYYY), $, European value (e.g. 78.294,00), Category, Subcategory, optional 6th column Description. Description defaults to subcategory when omitted.
- **importTransactionsDialog**: Placeholder and help text updated for the above format.

### Tests and lint

- **Categories.test.tsx**: Delete flow MSW handler updated to request URL without trailing slash to match new delete path.
- Snackbar close handlers use `[]` deps (setState setter is stable). Biome quote style (single) applied across touched files.
