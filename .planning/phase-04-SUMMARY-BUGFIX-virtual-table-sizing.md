# Phase 04 — BUGFIX: Virtual table full-width alignment (categoriesTable)

## What was built

- **Categories table** now uses full container width with header/body column alignment: added `TABLE_WIDTH`, `GRID_TEMPLATE_FR`, table `width: 100%` / `tableLayout: "fixed"`, percentage header widths, and `fr`-based grid for the virtualized body (per `.planning/VIRTUAL-TABLE-SIZING-FIX.md` and `subcategoriesTable` reference).

## Files changed

- **`.planning/phase-04-SPEC-BUGFIX-virtual-table-sizing.md`** — Spec (bug, root cause, fix approach); committed before implementation.
- **`src/modules/categories/categoriesTable/index.tsx`** — Constants: `TABLE_WIDTH`, `GRID_TEMPLATE_FR` (replaced px `GRID_TEMPLATE`). Table: `width: "100%"`, `minWidth: TABLE_WIDTH`, `tableLayout: "fixed"`. Header cells: `size` from column def, `width` as percentage, `minWidth: size`, `boxSizing: "border-box"`. Virtual body wrapper: `width: "100%"`, `minWidth: TABLE_WIDTH`. Virtual rows: `right: 0`, `gridTemplateColumns: GRID_TEMPLATE_FR`.

## Decisions made

- Followed VIRTUAL-TABLE-SIZING-FIX.md checklist and subcategoriesTable pattern exactly; no behavior or column content changes, layout/sizing only.
- Chore commit on this branch to fix pre-existing biome format/organize and one useExhaustiveDependencies so the gate passes before every commit.

## Tests added

- None; existing Categories tests and full test suite cover behavior. Layout-only fix.

## Known issues / follow-ups

- None. Same fix can be applied to `transactionsTable` and `hangoutsTable` in future bugfix phases if desired.
