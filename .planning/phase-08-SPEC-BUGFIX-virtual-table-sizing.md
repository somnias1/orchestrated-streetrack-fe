# Phase 08 — Bugfix: Virtual Table Full-Width Alignment (hangoutsTable)

## Bug

- **Observed:** Header and body column widths do not match; table does not use full container width. Header uses `getSize()` (fixed px); virtualized body uses a fixed px grid (`GRID_TEMPLATE`). Table has `minWidth: 700` and body wrapper `minWidth: 700`, so layout is not full-width and column alignment can drift.
- **Expected:** Header and body columns stay aligned; table and virtualized body use full width of the container.

## Root cause

Table uses default/min widths; header uses `getSize()`; body uses fixed px grid; no shared full-width layout (no `TABLE_WIDTH`, no percentage header widths, no `fr`-based grid for body).

## Fix approach

Follow `.planning/VIRTUAL-TABLE-SIZING-FIX.md` and reference `src/modules/subcategories/subcategoriesTable/index.tsx`:

- Add `TABLE_WIDTH = COLUMN_SIZES.reduce((a, b) => a + b, 0)` and `GRID_TEMPLATE_FR = COLUMN_SIZES.map((s) => \`${s}fr\`).join(" ")`; remove fixed px `GRID_TEMPLATE` for virtual body.
- Table: `width: "100%"`, `minWidth: TABLE_WIDTH`, `tableLayout: "fixed"`.
- Header cells: get `size` from `(header.column.columnDef as { size?: number }).size ?? header.getSize()`; set `width: \`${(size / TABLE_WIDTH) * 100}%\``, `minWidth: size`, `boxSizing: "border-box"`.
- Virtualized body wrapper: `width: "100%"`, `minWidth: TABLE_WIDTH`.
- Virtual row: `width: "100%"`, `right: 0`; row grid `gridTemplateColumns: GRID_TEMPLATE_FR`.

No changes to column definitions, cell content, or behavior—only layout/sizing in `src/modules/hangouts/hangoutsTable/index.tsx`.
