# Phase 07 — Bugfix: Virtual Table Full-Width Alignment (transactionsTable)

## Bug

- **Observed:** Header and body column widths do not match; table does not use full container width. The transactions table uses a fixed pixel grid for the virtualized body and `getSize()` for headers, with a fixed `minWidth: 800`, so columns can misalign and the table does not expand to fill the container.
- **Expected:** Header and body columns stay aligned at any container width; table and virtualized body use the full width of the container.

## Root cause

Table uses default/min widths; header uses `getSize()`; body uses a fixed px grid (`GRID_TEMPLATE` with px units); no shared full-width layout or proportional column distribution.

## Fix approach

Follow `.planning/VIRTUAL-TABLE-SIZING-FIX.md` and reference `src/modules/subcategories/subcategoriesTable/index.tsx`:

- Add `TABLE_WIDTH = COLUMN_SIZES.reduce((a, b) => a + b, 0)` and `GRID_TEMPLATE_FR` (fr-based) from `COLUMN_SIZES`; remove fixed pixel `GRID_TEMPLATE` for the virtual body.
- Table element: `width: "100%"`, `minWidth: TABLE_WIDTH`, `tableLayout: "fixed"`.
- Header cells: get `size` from `(header.column.columnDef as { size?: number }).size ?? header.getSize()`; set `width: \`${(size / TABLE_WIDTH) * 100}%\``, `minWidth: size`, `boxSizing: "border-box"`.
- Virtualized body wrapper: `width: "100%"`, `minWidth: TABLE_WIDTH`.
- Virtual row: `width: "100%"`, `right: 0`; row grid `gridTemplateColumns: GRID_TEMPLATE_FR`.

Layout/sizing only; no changes to column definitions, cell content, or behavior.
