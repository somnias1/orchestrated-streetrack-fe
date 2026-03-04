# Phase 15 — Remaining Screens & CRUD on shadcn

**Goal:** Migrate Subcategories, Transactions, Hangouts lists and all CRUD dialogs to shadcn; unify table state; reduce MUI.

**Key TECHSPEC:** §3.2 (Project structure), §3.4 (Screens & navigation), §3.5 (Form validation), §3.7 (UI/UX design guidelines), §5.1 (Performance / virtualization).

**Depends on:** Phase 14 (Theme, layout & Categories table alignment).

---

## 1. Unify table state (§3.7, §5.1)

- **Pattern:** Categories table (Phase 14) uses a single state-row min height and `verticalAlign: 'middle'` for loading, error, and empty states so the table body area does not shift when switching between states.
- **Deliverable:** Subcategories, Transactions, and Hangouts tables must use the same pattern:
  - Define `STATE_ROW_MIN_HEIGHT = TABLE_MIN_HEIGHT - ROW_HEIGHT` (or equivalent) so the state row fills the remaining body height.
  - Apply `minHeight: STATE_ROW_MIN_HEIGHT` and `verticalAlign: 'middle'` to the single `TableCell` used for loading, error, and empty states.
  - Error state must include a **retry CTA** (already required by §3.3); ensure it is present and styled with theme tokens.
- **Outcome:** All four list screens (Categories, Subcategories, Transactions, Hangouts) have consistent table state behavior and no layout shift between loading/error/empty/rows.

## 2. Theme tokens on remaining screens and dialogs (§3.2, §3.7)

- **Lists:** Subcategories, Transactions, and Hangouts list screens and their tables already use `themeTokens` from `src/theme/tailwind.ts`. Verify no hardcoded hex/pixel colors; replace any with tokens or spacing scale.
- **CRUD dialogs:** Ensure all create/edit and delete confirmation dialogs (Categories, Subcategories, Transactions, Hangouts) use `themeTokens` for background, border, text, primary, error, and buttons. No new hardcoded colors in dialog content or overlays.
- **Consistency:** Same semantic tokens (background, surface, primary, border, textPrimary, textSecondary, error, etc.) across all four modules so light/dark mode applies everywhere.

## 3. Reduce MUI (§3.7)

- **Scope:** Do not add new MUI-heavy patterns. Existing tables and dialogs continue to use MUI components (Table, Dialog, Button, etc.) but must be styled exclusively via theme tokens (and existing Tailwind/theme layer). No new MUI `sx` with hardcoded colors.
- **“shadcn” alignment:** In this phase, “shadcn” means aligning with the same design system as Categories: tweakcn-style CSS variables and semantic tokens, unified table state, and consistent dialog/button styling. Introducing the shadcn/ui component library (e.g. Radix-based components) is **out of scope** for Phase 15; the focus is token consistency and table state unification.

## 4. Form validation (§3.5)

- **No change required:** All CRUD forms already use Zod for validation and inline errors. Verify that form dialogs (category, subcategory, transaction, hangout create/edit) still use Zod schemas and theme tokens for error text and borders; fix any that do not.

## 5. Out of scope (Phase 15)

- Adding the shadcn/ui npm package or Radix primitives; no component-library migration.
- New routes or new features; only alignment of existing Subcategories, Transactions, Hangouts screens and existing CRUD dialogs.
- Changes to Categories list or layout beyond what is already done in Phase 14.

## 6. Definition of done

- Subcategories, Transactions, and Hangouts tables use `STATE_ROW_MIN_HEIGHT` and `verticalAlign: 'middle'` for loading/error/empty state rows; retry CTA present on error.
- All list screens and CRUD dialogs (all four resources) use theme tokens only; no hardcoded colors in Phase 15–touched code.
- Gate (`npm test && npx biome check .`) passes before every commit.
- Phase summary (`.planning/phase-15-SUMMARY.md`) written; STATE.md updated; branch merged to main with `--no-ff`.
