# Phase 20 — Periodic expenses (subcategories)

## What was built

- **Types:** `SubcategoryRead`, `SubcategoryCreate`, and `SubcategoryUpdate` now include `is_periodic` (boolean, default false) and `due_day` (number | null). Mocks and test fixtures updated.
- **Form:** Subcategory create/edit dialog has "Periodic expense" checkbox and "Due day (1–31)" field (shown when periodic); Zod schema enforces due_day 1–31 when is_periodic is true; payload sent to API includes both fields.
- **List:** Subcategories table has "Periodic" (Yes/—) and "Due day" (day number or —) columns; column layout constants adjusted for the new columns.

## Files changed

- `.planning/phase-20-SPEC.md`: Phase scope and DoD.
- `src/services/subcategories/types.ts`: Added is_periodic, due_day to Read/Create/Update.
- `src/services/subcategories/mocks.ts`: Default is_periodic, due_day in mock.
- `src/modules/subcategories/Subcategories.test.tsx`: Inline subcategory objects include is_periodic, due_day.
- `src/modules/subcategories/subcategoryFormDialog/schema.ts`: is_periodic, due_day with refine for periodic.
- `src/modules/subcategories/subcategoryFormDialog/types.ts`: Payload type extended.
- `src/modules/subcategories/subcategoryFormDialog/index.tsx`: Checkbox, due day input, state, submit payload.
- `src/modules/subcategories/index.tsx`: formInitial and handleFormSubmit include periodic fields; openEdit passes them.
- `src/modules/subcategories/subcategoriesTable/constants.ts`: COLUMN_SIZES extended for Periodic and Due day.
- `src/modules/subcategories/subcategoriesTable/index.tsx`: Periodic and Due day column definitions.

## Decisions made

- **Due day input:** Shown only when "Periodic expense" is checked; stored as string in state, parsed to number (or null) on submit; non-digits stripped and length capped to 2.
- **List columns:** Two separate columns (Periodic, Due day) for clarity; "—" when not periodic.

## Tests added

- No new test file; existing Subcategories and subcategories service tests updated for new fields. All 64 tests pass.

## Known issues / follow-ups

- None. Dashboard due-periodic-expenses display is Phase 21.
