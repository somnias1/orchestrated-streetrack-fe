# Phase 27 — react-hook-form migration + bulk dialog optimization

## What was built

- Added **react-hook-form** and **@hookform/resolvers** (`zodResolver`).
- **CategoryFormDialog**, **SubcategoryFormDialog**, and **TransactionFormDialog** use `useForm` + `zodResolver` and `Controller` for MUI fields and pickers; submit/close behavior unchanged.
- **SubcategoryFormDialog**: new `subcategoryDialogFormSchema` (string `due_day` + superRefine for periodic); `belongs_to_income` synced from `useCategoryQuery` when `category_id` changes.
- **TransactionFormDialog**: `transactionDialogFormSchema` for string form fields (value as string before `Number()` in `toPayload`).
- **BulkTransactionsDialog**: `bulkTransactionsFormSchema` (array superRefine using existing `bulkRowSchema`); `useFieldArray`; **memo**ized `BulkTransactionRow` with stable `remove` from `useFieldArray`; **one** `useSubcategoriesQuery` and **one** `useHangoutsQuery` at dialog level with `PICKER_LIST_PARAMS`, passed as **`externalOptions`** into each row’s pickers (no per-row list queries).
- **SubcategoryAutocomplete** / **HangoutAutocomplete**: optional **`externalOptions`** — when set, skip internal list query and filter options client-side with the existing debounced search input.

## Files changed

- `package.json` / `package-lock.json`: new dependencies.
- `src/components/pickers/SubcategoryAutocomplete.tsx`, `HangoutAutocomplete.tsx`: `externalOptions` + client filter when lifted.
- `src/modules/categories/categoryFormDialog/*`: RHF; `categoryFormSchema` description as plain `string` for controlled fields.
- `src/modules/subcategories/subcategoryFormDialog/*`: RHF + `subcategoryDialogFormSchema`.
- `src/modules/transactions/transactionFormDialog/*`: RHF + `transactionDialogFormSchema`.
- `src/modules/transactions/bulkTransactionsDialog/*`: RHF, `useFieldArray`, memo row, lifted queries.
- `src/modules/transactions/index.tsx`, `src/utils/callbackApi/types.ts`: Biome formatting only (from `biome check --write`).

## Decisions made

- **HangoutFormDialog** left on manual state (not in ROADMAP Phase 27 scope).
- **Bulk rows**: pass stable `remove` from `useFieldArray` into memo rows instead of inline `onRemove` callbacks so memoization is effective.
- **Lifted picker data**: first page only (`PICKER_LIST_PARAMS`, limit 50); search in bulk rows filters that list client-side when `externalOptions` is used.

## Tests added

- None new; existing Vitest/RTL suites cover dialogs and still pass.

## Known issues / follow-ups

- Bulk subcategory/hangout pickers use a single first-page fetch; very large datasets may need a dedicated bulk UX (e.g. shared server search) in a later phase.
