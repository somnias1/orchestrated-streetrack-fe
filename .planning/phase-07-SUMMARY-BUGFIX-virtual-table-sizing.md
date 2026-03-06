# Phase 07 — Bugfix: Virtual Table Full-Width Alignment (transactionsTable)

## What was built

- Applied the virtualized table full-width alignment fix to `src/modules/transactions/transactionsTable/index.tsx`: header and body columns now stay aligned and the table uses the full container width.

## Files changed

- `.planning/phase-07-SPEC-BUGFIX-virtual-table-sizing.md`: Bugfix spec (Bug, Root cause, Fix approach).
- `src/modules/transactions/transactionsTable/index.tsx`: TABLE_WIDTH and GRID_TEMPLATE_FR; table `width: 100%`, `minWidth: TABLE_WIDTH`, `tableLayout: fixed`; header percentage widths and boxSizing; virtual body wrapper and rows full-width with fr-based grid.

## Decisions made

- Same pattern as subcategoriesTable and categoriesTable bugfix: layout/sizing only; no changes to column definitions, cell content, or behavior.

## Tests added

- None (layout-only fix; existing tests suffice).

## Known issues / follow-ups

- None.
