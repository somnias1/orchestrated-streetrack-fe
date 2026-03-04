# Phase 15 — Summary

**Remaining Screens & CRUD on shadcn**

## Done

1. **Unified table state (§3.7, §5.1)**
   - Subcategories, Transactions, and Hangouts tables now use the same pattern as Categories (Phase 14): `STATE_ROW_MIN_HEIGHT = TABLE_MIN_HEIGHT - ROW_HEIGHT` and `verticalAlign: 'middle'` on loading, error, and empty state rows.
   - State rows have consistent min height so the table body does not shift when switching between loading / error / empty / data. Retry CTA remains on error in all three tables.

2. **Theme tokens**
   - Verified: Subcategories, Transactions, and Hangouts list screens and tables already use `themeTokens` from `src/theme/tailwind.ts`. No hardcoded hex/rgb colors found in modules.
   - CRUD dialogs (categories, subcategories, transactions, hangouts) already import and use theme tokens. No changes required for Phase 15.

3. **Reduce MUI**
   - No new MUI-heavy patterns added. All touched code uses theme tokens for styling. shadcn/ui package was not introduced; alignment is with tweakcn-style tokens and table state only.

## Commits

- `chore(planning): add phase-15 spec (remaining screens, table state, theme tokens)` (main)
- `feat(tables): unify state row min height on Subcategories, Transactions, Hangouts` (feature branch)

## Gate

`npm test && npx biome check .` passed before commit.

## Not in scope (per spec)

- Adding shadcn/ui npm package or Radix primitives.
- New routes or features.
- Changes to Categories list (already aligned in Phase 14).
