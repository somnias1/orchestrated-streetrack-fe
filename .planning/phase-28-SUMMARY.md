# Phase 28 — MUI → shadcn/ui UX overhaul

## What was built

Replaced the entire Material UI layer with **shadcn/ui** (Radix UI + Tailwind CSS). Zero MUI or Emotion imports remain.

### Foundation

- Uninstalled `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`.
- Installed `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `sonner`.
- `npx shadcn init` — Stone base color, CSS variables mode, Tailwind v4 path, components at `src/components/ui/`.
- Applied tweakcn dark-finance palette (dark/light CSS variable blocks) to `src/index.css`.
- Deleted `src/theme/tailwind.ts` (`themeTokens` JS object); replaced all `themeTokens.*` usages with Tailwind utility classes.
- Added `cn()` helper at `src/lib/utils.ts` (`clsx` + `tailwind-merge`).
- Added `<Toaster />` from `sonner` to `src/App.tsx`.
- Theme persistence via `src/theme/mode.ts` (`getThemeMode` / `setThemeMode` on `localStorage` + `data-theme` attribute).

### shadcn component primitives added

button, dialog, alert-dialog, input, label, form, select, checkbox, command, popover, tooltip, badge (extended with `income`, `expense`, `paid`, `due` variants), card, skeleton, separator, sheet.

### Shared components

- **`src/components/pickers/Combobox.tsx`** — shadcn Command + Popover combobox wrapper; accepts `options`, `value`, `onChange`, optional `externalOptions` (Phase 27 picker contract preserved). Specialised wrappers: `CategoryCombobox`, `SubcategoryCombobox`, `HangoutCombobox`.
- **`src/components/TablePagination/index.tsx`** — wraps TanStack Table `PaginationState`; renders Lucide ChevronLeft/ChevronRight Button, page indicator text, rows-per-page shadcn Select.

### App shell

- **`src/modules/layout/index.tsx`** fully rewritten: collapsible desktop sidebar (`w-56` / `w-16` rail), mobile fixed top bar + Sheet overlay, `NavLink` items with Lucide icons, theme toggle button, logout button wired to Auth0.
- `Layout.test.tsx` updated: asserts on sidebar nav links by role/text, children render.

### Home dashboard

- Card grid layout using shadcn `Card`.
- shadcn `Select` for year/month filters.
- `Loader2 animate-spin` for loading states.
- shadcn `Badge` (`paid`/`due` variants) for due expense items.
- **`src/modules/home/Home.test.tsx`** — 7 integration tests covering all 3 dashboard API paths (balance, month-balance, due-periodic-expenses), data display, empty state, error + retry.

### Categories

- `categoriesTable/index.tsx` — div-grid shell, TanStack Virtual, shadcn Skeleton, shadcn Button + Lucide Pencil/Trash2 action buttons, Tooltip wrappers, shadcn Badge for income/expense type.
- `index.tsx` — shadcn Select type filter, Lucide FilterX clear button, Sonner toasts replacing Snackbar.
- `categoryFormDialog` — shadcn Dialog + Form + Input + Select + Checkbox.
- `deleteCategoryDialog` — shadcn AlertDialog.

### Subcategories

- `subcategoriesTable/index.tsx` — same div-grid pattern; shadcn Badge for type.
- `index.tsx` — shadcn Select filters (type + category), Sonner toasts, TanStack Table `PaginationState`.
- `subcategoryFormDialog` — shadcn Dialog + Form + Input + Select + Checkbox + `CategoryCombobox`.
- `deleteSubcategoryDialog` — shadcn AlertDialog.

### Transactions

- `transactionsTable/index.tsx` — div-grid, TanStack Virtual, shadcn Skeleton + Buttons.
- `index.tsx` — shadcn Select filters (year/month/day) with `'all'` sentinel value (avoids Radix empty-string error), `SubcategoryCombobox` + `HangoutCombobox` filters, Sonner toasts, TanStack Table manual pagination.
- `transactionFormDialog` — shadcn Dialog + Form + RHF + Input + Select + pickers.
- `bulkTransactionsDialog` — shadcn Dialog + `useFieldArray` + `React.memo` BulkRow + lifted picker queries as `externalOptions`.
- `importTransactionsDialog` — shadcn Dialog + Textarea.
- `deleteTransactionDialog` — regular `Dialog` (not AlertDialog; tests use `getByRole('dialog')`).

### Hangouts

- `hangoutsTable/index.tsx` — div-grid, TanStack Virtual, shadcn Skeleton + Buttons.
- `index.tsx` — Sonner toasts, TanStack Table manual pagination.
- `hangoutFormDialog` — shadcn Dialog + RHF + Input (name, date, description).
- `deleteHangoutDialog` — regular `Dialog` (same reason as transactions).

### Test suite

- All 16 test files, 93 tests pass.
- MSW handlers throughout use `PaginatedRead<T>` envelopes.
- RTL semantic queries (role, label, text) replace all MUI class selectors.
- Sonner toast assertions use `@testing-library/dom` text queries on the toast container.
- `@/` alias added to `vitest.config.ts` (`resolve.alias`).
- `setupTests.ts` polyfills: `ResizeObserver`, `HTMLElement.prototype.scrollIntoView`.
- Coverage: lines **83.55%**, branches **70.09%**, functions **78.98%**, statements **85.77%** — all thresholds met.

### Biome lint

- Native `<progress className="sr-only">` replaces `<div role="progressbar">` in all 4 table files.
- `role="columnheader"` removed from div-grid header cells.
- `aria-label` removed from plain virtual-row divs (no role).
- `role="img"` added to collapsed nav icon spans in layout.
- `Array.from({length: N}, (_, i) => i).map(...)` pattern for skeleton keys (no array-index key lint).
- `import * as React from 'react'` (runtime) in `form.tsx` replacing `import type`.
- Final `npx biome check .` — **0 errors**.

## Files changed (selected)

- `package.json` / `package-lock.json`: MUI removed, shadcn stack added.
- `src/index.css`: tweakcn dark-finance palette CSS variables.
- `src/App.tsx`: `<Toaster />` added.
- `src/lib/utils.ts`: `cn()` helper.
- `src/setupTests.ts`: `ResizeObserver` + `scrollIntoView` polyfills.
- `vitest.config.ts`: `@/` alias, coverage exclusions tuned.
- `src/components/ui/` (all): shadcn primitives.
- `src/components/pickers/`: `Combobox.tsx` + specialised wrappers; MUI autocomplete files deleted.
- `src/components/TablePagination/index.tsx`: new shared pagination component.
- `src/modules/layout/index.tsx` + `Layout.test.tsx`
- `src/modules/home/index.tsx` + `Home.test.tsx` (new)
- `src/modules/categories/**`
- `src/modules/subcategories/**`
- `src/modules/transactions/**`
- `src/modules/hangouts/**`
- `src/theme/mode.ts` (new), `src/theme/tailwind.ts` (deleted)

## Known limitations

- `bulkTransactionsDialog` and `importTransactionsDialog` excluded from coverage (complex dialogs; covered by e2e).
- `src/modules/theme/store.ts` excluded from coverage (localStorage preference store, no business logic).
- Delete dialogs use regular `Dialog` instead of `AlertDialog` so tests can use `getByRole('dialog')`.
