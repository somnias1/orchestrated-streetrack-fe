# Phase 08 — Bugfix: Virtual Table Full-Width Alignment (hangoutsTable)

## What was built

- Applied the virtualized table full-width alignment fix to `hangoutsTable` only: header and body columns now align; table and virtualized body use full container width.

## Files changed

- `src/modules/hangouts/hangoutsTable/index.tsx`: Added `TABLE_WIDTH` and `GRID_TEMPLATE_FR`; table uses `width: 100%`, `minWidth: TABLE_WIDTH`, `tableLayout: fixed`; header cells use percentage width from column `size`; virtual body wrapper and rows use full width and `GRID_TEMPLATE_FR` for column alignment.

## Decisions made

- Followed `.planning/VIRTUAL-TABLE-SIZING-FIX.md` and reference `src/modules/subcategories/subcategoriesTable/index.tsx`; no changes to column definitions, cell content, or behavior—layout/sizing only.

## Tests added

- None (layout-only fix; existing hangoutsTable and Hangouts tests suffice).

## Known issues / follow-ups

- None.
