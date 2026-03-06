# Virtualized Table: Full-Width + Header/Body Alignment Fix

Apply this fix to any module that uses a **virtualized table** (TanStack Table header + CSS grid virtualized body) so that:
1. Header and body columns stay aligned.
2. Table and body use **full width** of the container (no fixed narrow width).

**Affected modules:** `categoriesTable`, `transactionsTable`, `hangoutsTable` (and any future list table using the same pattern).  
**Reference implementation:** `src/modules/subcategories/subcategoriesTable/index.tsx`.

---

## GSD bugfix workflow (FRAMEWORK §6.3, TECHSPEC §8.3)

Bug fixes follow the same pipeline as feature phases, with a SPEC first and SUMMARY before merge. Use this flow so the fix is applied **without extra steps** and stays compliant with the framework.

1. **Prompt (start of session)**  
   Use the phase number that owns the module you’re fixing (e.g. 04 for Categories table, 07 for Transactions, 08 for Hangouts). From FRAMEWORK §6.3:

   ```
   GSD session start — Phase NN (bugfix: virtual table full-width alignment for [MODULE]).
   ```

   Replace `NN` with the phase number (e.g. `04`, `07`, `08`) and `[MODULE]` with the table module (e.g. `categoriesTable`, `transactionsTable`, `hangoutsTable`).

2. **Pre-flight**  
   Branch: `feature/phase-NN-bugfix-virtual-table-sizing` (or `hotfix/phase-NN-virtual-table-sizing` if critical).  
   Spec: `.planning/phase-NN-SPEC-BUGFIX-virtual-table-sizing.md` (or append to phase-NN-SPEC if that phase is still open).  
   Gate: `npm test && npx biome check .` before every commit.

3. **SPEC content (commit before code)**  
   - **Bug:** Observed vs expected (e.g. "Header and body column widths do not match; table does not use full container width.").
   - **Root cause:** Table uses default/min widths; header uses `getSize()`; body uses fixed px grid; no shared full-width layout.
   - **Fix approach:** Follow `.planning/VIRTUAL-TABLE-SIZING-FIX.md` and reference `src/modules/subcategories/subcategoriesTable/index.tsx`. Use TABLE_WIDTH, percentage header widths, `tableLayout: "fixed"`, and `fr`-based grid for body; full width for table and virtualized body.

4. **Tests**  
   If the bug is purely layout (no behavior change), existing tests suffice. If you add or change assertions (e.g. layout/sizing), run the gate; red → green with the fix.

5. **Definition of done**  
   SPEC committed first; implementation; gate passing; `.planning/phase-NN-SUMMARY-BUGFIX-virtual-table-sizing.md` (or summary section) committed; merge to `main` with `--no-ff`.

---

## Prompt to use in other phases (implementation detail)

Copy the following into the chat when fixing Categories, Transactions, or Hangouts table sizing:

```
Apply the virtualized table full-width alignment fix to [MODULE] (e.g. categoriesTable / transactionsTable / hangoutsTable).

Follow the pattern in .planning/VIRTUAL-TABLE-SIZING-FIX.md and the reference implementation in src/modules/subcategories/subcategoriesTable/index.tsx:

1. **Constants**
   - Keep COLUMN_SIZES as the proportional weights (same numbers as today).
   - Add TABLE_WIDTH = COLUMN_SIZES.reduce((a, b) => a + b, 0).
   - Replace any fixed pixel GRID_TEMPLATE with a single GRID_TEMPLATE_FR = COLUMN_SIZES.map((s) => `${s}fr`).join(" ") (remove unused pixel grid constant if present).

2. **Table**
   - Table element: width: "100%", minWidth: TABLE_WIDTH, tableLayout: "fixed".

3. **Header cells**
   - For each header, read size from column def: (header.column.columnDef as { size?: number }).size ?? header.getSize().
   - Set width: `${(size / TABLE_WIDTH) * 100}%`, minWidth: size, boxSizing: "border-box" (no maxWidth so columns can grow with the table).

4. **Virtualized body**
   - Wrapper Box: width: "100%", minWidth: TABLE_WIDTH, height unchanged.
   - Each virtual row Box: width: "100%", right: 0 (and remove fixed width like TABLE_WIDTH or a pixel value).
   - Row grid: gridTemplateColumns: GRID_TEMPLATE_FR (the fr-based string) so columns scale in the same ratio as the header.

Do not change column definitions, cell content, or behavior—only layout/sizing. Run the linter when done.
```

Replace `[MODULE]` with the actual table module name (e.g. `categoriesTable`).

---

## Checklist (for manual application)

| Step | What to do |
|------|------------|
| 1 | Add `TABLE_WIDTH = COLUMN_SIZES.reduce((a, b) => a + b, 0)`. |
| 2 | Add `GRID_TEMPLATE_FR = COLUMN_SIZES.map((s) => \`${s}fr\`).join(" ")`. Remove old fixed `GRID_TEMPLATE` (px) if it’s only used for the virtual body. |
| 3 | Table: `width: "100%"`, `minWidth: TABLE_WIDTH`, `tableLayout: "fixed"`. |
| 4 | Header: get `size` from `(header.column.columnDef as { size?: number }).size ?? header.getSize()`. Use `width: \`${(size / TABLE_WIDTH) * 100}%\``, `minWidth: size`, `boxSizing: "border-box"`. |
| 5 | Virtual body wrapper: `width: "100%"`, `minWidth: TABLE_WIDTH`. |
| 6 | Virtual row Box: `width: "100%"`, `right: 0` (no fixed width). |
| 7 | Virtual row grid: `gridTemplateColumns: GRID_TEMPLATE_FR`. |

---

## Why this works

- **Percentages on the table** with `tableLayout: "fixed"` make the header columns share the full width in the same ratio as COLUMN_SIZES.
- **`fr` on the grid** makes the body columns share the row width in the same ratio, so header and body stay aligned at any container width.
- **`minWidth: TABLE_WIDTH`** keeps the table from shrinking below the sum of column minimums and avoids squashing; narrow viewports get horizontal scroll.
