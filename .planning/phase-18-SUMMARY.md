# Phase 18 — UX/UI improvements

## What was built

- **Type as MUI Chips:** Confirmed Categories and Subcategories tables already use `CategoryTypeChip` (MUI Chip) for income/expense with green/red semantic colors (§3.7). No code change.
- **Transactions: Button + Menu:** Replaced single "Create transaction" button with an "Add" button that opens a menu with "Transaction" (opens single transaction form dialog) and "Bulk" (stub for Phase 22).
- **Default current-month filter:** Transactions list is filtered to the current year and month on load; count in header reflects filtered count. Client-side filter applied to fetched list (no API change).
- **Hangouts table action colors:** Edit action uses `themeTokens.primary`, Delete uses `themeTokens.error`, aligned with Categories and other resource tables (§3.4).

## Files changed

- `src/modules/transactions/index.tsx`: Add menu (Add → Transaction / Bulk), current-year-month filter, filtered list and count.
- `src/modules/hangouts/hangoutsTable/index.tsx`: Edit IconButton `sx` color → primary, Delete → error.
- `src/modules/transactions/Transactions.test.tsx`: Add menu test (Add button, menu items Transaction/Bulk); create flow opens menu then Transaction; transaction dates use `currentMonthDate()` so default filter includes them.

## Decisions made

- **Single "Add" button with dropdown:** One primary button with endIcon dropdown; menu items "Transaction" and "Bulk" (spec: "Button + Menu").
- **Current-month filter client-side:** Filter applied in the Transactions screen to `items` by `date.slice(0, 7) === currentYearMonth`; API still returns full list. Phase 19 can add server-side date params.
- **Bulk menu item:** No-op handler for Phase 18; Phase 22 implements bulk dialog.

## Tests added

- `Transactions.test.tsx`: "has Add button with Transaction and Bulk menu" (replaces "has Create transaction button"); create flow updated to open Add → click Transaction; all transaction dates switched to `currentMonthDate()` for filter compatibility.

## Known issues / follow-ups

- None. Phase 19 will add filter UI and server-side date params; Phase 22 will implement Bulk dialog.
