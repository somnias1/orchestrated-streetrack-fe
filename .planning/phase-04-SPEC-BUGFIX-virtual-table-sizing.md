# Phase 04 — BUGFIX: Virtual table full-width alignment (categoriesTable)

**Phase:** 04 (Categories Table & UX) — bugfix only.  
**Branch:** `feature/phase-04-bugfix-virtual-table-sizing`.  
**Target:** `src/modules/categories/categoriesTable/index.tsx`.  
**Reference:** `src/modules/subcategories/subcategoriesTable/index.tsx`, `.planning/VIRTUAL-TABLE-SIZING-FIX.md`.

---

## 1. Bug

- **Observed:** Header and body column widths do not match; table does not use full container width. Header uses `getSize()` (fixed px); body uses fixed px grid (`GRID_TEMPLATE`); table has fixed `minWidth: 560` so it does not expand to 100%.
- **Expected:** Header and body columns stay aligned; table and virtualized body use full width of the container (100% with shared proportional layout).

## 2. Root cause

- Table uses default/min widths; header uses `getSize()`; body uses fixed px grid; no shared full-width layout or proportional (fr) grid for the virtual body.

## 3. Fix approach

- Follow `.planning/VIRTUAL-TABLE-SIZING-FIX.md` and reference `src/modules/subcategories/subcategoriesTable/index.tsx`.
- **Constants:** Add `TABLE_WIDTH = COLUMN_SIZES.reduce((a, b) => a + b, 0)`. Replace fixed px `GRID_TEMPLATE` with `GRID_TEMPLATE_FR = COLUMN_SIZES.map((s) => \`${s}fr\`).join(" ")`.
- **Table:** `width: "100%"`, `minWidth: TABLE_WIDTH`, `tableLayout: "fixed"`.
- **Header cells:** Get `size` from `(header.column.columnDef as { size?: number }).size ?? header.getSize()`. Use `width: (size / TABLE_WIDTH) * 100 + "%"`, `minWidth: size`, `boxSizing: "border-box"`.
- **Virtual body wrapper:** `width: "100%"`, `minWidth: TABLE_WIDTH`.
- **Virtual row Box:** `width: "100%"`, `right: 0`; row grid `gridTemplateColumns: GRID_TEMPLATE_FR`.
- No change to column definitions, cell content, or behavior—layout/sizing only.

## 4. Definition of done (§8.3)

- Spec committed before implementation.
- Gate `npm test && npx biome check .` passed before every commit.
- `.planning/phase-04-SUMMARY-BUGFIX-virtual-table-sizing.md` committed before merge.
- Branch merged into `main` with `--no-ff`.
