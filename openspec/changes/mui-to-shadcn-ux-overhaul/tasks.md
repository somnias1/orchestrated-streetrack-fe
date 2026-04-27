## 1. Foundation — shadcn setup, token system, package swap

- [x] 1.1 Uninstall `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- [x] 1.2 Install `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `sonner`
- [x] 1.3 Run `npx shadcn init` — select CSS variables mode, **Stone** base color, Tailwind v4 path, output to `src/components/ui/`
- [x] 1.4 Apply tweakcn dark-finance palette: paste generated CSS variables into `src/index.css` (dark + light `:root` blocks)
- [ ] 1.5 Delete `src/theme/tailwind.ts` (`themeTokens` JS object); update any lingering imports to use Tailwind utility classes
- [x] 1.6 Add `cn()` helper at `src/lib/utils.ts` (`clsx` + `tailwind-merge`)
- [x] 1.7 Add `<Toaster />` from `sonner` to app root (`src/App.tsx`)
- [ ] 1.8 Run `npm run build` — confirm zero MUI/Emotion import errors
- [ ] 1.9 Run `npx biome check .` — fix any lint issues introduced by removals
- [ ] 1.10 Commit SPEC + initial scaffold; create `.planning/phase-NN-SPEC.md` for this phase

## 2. shadcn component primitives

- [x] 2.1 `npx shadcn add button` — verify `src/components/ui/button.tsx`
- [x] 2.2 `npx shadcn add dialog alert-dialog` — for CRUD and delete confirm dialogs
- [x] 2.3 `npx shadcn add input label form` — for form fields
- [x] 2.4 `npx shadcn add select` — for dropdowns in forms and filters
- [x] 2.5 `npx shadcn add checkbox` — for boolean fields
- [x] 2.6 `npx shadcn add command popover` — for Combobox (autocomplete picker) pattern
- [x] 2.7 `npx shadcn add tooltip` — for row action button tooltips
- [x] 2.8 `npx shadcn add badge` — for income/expense type indicators and due-expense status
- [x] 2.9 `npx shadcn add card` — for dashboard sections
- [x] 2.10 `npx shadcn add skeleton` — for table loading states
- [x] 2.11 `npx shadcn add separator` — for sidebar and filter dividers
- [x] 2.12 `npx shadcn add sheet` — for mobile sidebar overlay
- [x] 2.13 Build a shared `Combobox` wrapper component at `src/components/pickers/Combobox.tsx` that accepts `options`, `value`, `onChange`, and optional `externalOptions` (preserves Phase 27 picker contract)
- [x] 2.14 Build a shared `TablePagination` UI component at `src/components/TablePagination/index.tsx` that accepts a TanStack `table` instance and renders prev/next Button (Lucide ChevronLeft/ChevronRight), page indicator, and rows-per-page shadcn Select

## 3. App shell — sidebar layout

- [x] 3.1 Create `.planning/phase-NN-SPEC.md` for sidebar phase before writing any code
- [x] 3.2 Rewrite `src/modules/layout/index.tsx` as sidebar shell — fixed left nav, brand, links, theme toggle, logout; preserve `children` prop API
- [x] 3.3 Implement collapsible sidebar: icon-only rail on `< lg`, Sheet overlay on mobile using shadcn `Sheet`
- [x] 3.4 Replace all `useAuth0` logout call and `NavLink` wrappers — use Lucide icons for nav items (`House`, `Tag`, `Layers`, `ReceiptText`, `CalendarDays`)
- [x] 3.5 Wire `useThemeStore` toggle to update `data-theme` on `document.documentElement`
- [x] 3.6 Update `src/modules/layout/Layout.test.tsx` — remove MUI AppBar assertions; assert on sidebar nav links by role/text
- [ ] 3.7 Run gate: `npm test && npx biome check .`

## 4. Home dashboard redesign

- [x] 4.1 Rewrite `src/modules/home/index.tsx` — card grid layout using shadcn `Card`
- [x] 4.2 Replace MUI `FormControl`/`Select` year/month selectors with shadcn `Select`
- [x] 4.3 Replace MUI `CircularProgress` with `Loader2` + `animate-spin` in loading states
- [x] 4.4 Replace MUI `Button` retry CTAs with shadcn `Button`
- [x] 4.5 Add shadcn `Badge` for paid/unpaid status on due expense items
- [ ] 4.6 Update or create Home test file — assert on Card content, selectors, loading/error/retry states
- [ ] 4.7 Run gate: `npm test && npx biome check .`

## 5. Categories screen and table

- [ ] 5.1 Rewrite `src/modules/categories/categoriesTable/index.tsx` — div-grid shell, shadcn Skeleton loading, shadcn Button icon actions, Lucide Pencil/Trash2 icons
- [ ] 5.2 Replace `CategoryTypeChip` with shadcn `Badge` (green for income, red for expense)
- [ ] 5.3 Replace MUI `Select` type filter with shadcn `Select` in `src/modules/categories/index.tsx`
- [ ] 5.4 Replace MUI `IconButton` clear-filters with shadcn `Button variant="ghost" size="icon"` + Lucide `FilterX`
- [ ] 5.5 Replace MUI `Snackbar` with `toast.success()` / `toast.error()`; remove `showSnackBar` state
- [ ] 5.6 Replace MUI `TablePagination` with shared `<Pagination />` component
- [x] 5.7 Rewrite `src/modules/categories/categoryFormDialog/index.tsx` — shadcn Dialog + Form + Input + Select + Checkbox
- [x] 5.8 Rewrite `src/modules/categories/deleteCategoryDialog/index.tsx` — shadcn AlertDialog
- [x] 5.9 Update `src/modules/categories/Categories.test.tsx` — remove MUI/Snackbar selectors, assert on toast text and shadcn DOM
- [ ] 5.10 Run gate: `npm test && npx biome check .`

## 6. Subcategories screen and table

- [x] 6.1 Rewrite subcategories table shell — same pattern as Categories (div-grid, Skeleton, shadcn Buttons, Badges)
- [x] 6.2 Replace filters (type, category) with shadcn `Select` components
- [x] 6.3 Replace Snackbar with `toast.*` calls; remove Snackbar state
- [x] 6.4 Replace pagination with shared `<Pagination />`
- [x] 6.5 Rewrite `subcategoryFormDialog` — shadcn Dialog + Form + Input + Select + Checkbox + `CategoryCombobox` (externalOptions contract preserved)
- [x] 6.6 Rewrite delete confirm dialog — shadcn AlertDialog
- [x] 6.7 Update `Subcategories.test.tsx` — selector audit, toast assertions
- [ ] 6.8 Run gate: `npm test && npx biome check .`

## 7. Transactions screen and table

- [ ] 7.1 Rewrite transactions table shell — div-grid, Skeleton, shadcn Buttons, Lucide icons
- [ ] 7.2 Replace filters (year/month/day, subcategory, hangout) with shadcn `Select` + `Combobox`
- [ ] 7.3 Replace Snackbar with `toast.*`; wire TanStack Table manual pagination (`manualPagination: true`, `onPaginationChange`); derive `skip`/`limit` from table state; render `<TablePagination table={table} />`; remove manual `page`/`rowsPerPage` useState
- [ ] 7.4 Rewrite `transactionFormDialog` — shadcn Dialog + Form + Input + shadcn Select (date) + `SubcategoryCombobox` + `HangoutCombobox`
- [ ] 7.5 Rewrite `bulkTransactionsDialog` — shadcn Dialog + Form + `useFieldArray` + `React.memo` BulkRow using shadcn Input + Combobox; lift picker queries as `externalOptions`
- [ ] 7.6 Rewrite `importTransactionsDialog` — shadcn Dialog + Textarea + shadcn Button
- [ ] 7.7 Rewrite delete confirm dialog — shadcn AlertDialog
- [ ] 7.8 Update `Transactions.test.tsx` — selector audit, toast assertions
- [ ] 7.9 Run gate: `npm test && npx biome check .`

## 8. Hangouts screen and table

- [ ] 8.1 Rewrite hangouts table shell — div-grid, Skeleton, shadcn Buttons, Lucide icons
- [ ] 8.2 Replace Snackbar with `toast.*`; wire TanStack Table manual pagination (`manualPagination: true`, `onPaginationChange`); derive `skip`/`limit` from table state; render `<TablePagination table={table} />`; remove manual `page`/`rowsPerPage` useState
- [ ] 8.3 Rewrite `hangoutFormDialog` — shadcn Dialog + Form + Input (name, date, description)
- [ ] 8.4 Rewrite delete confirm dialog — shadcn AlertDialog
- [ ] 8.5 Update `Hangouts.test.tsx` — selector audit, toast assertions
- [ ] 8.6 Run gate: `npm test && npx biome check .`

## 9. Test suite audit and coverage gate

- [ ] 9.1 Create `.planning/phase-NN-SPEC.md` for test audit phase
- [ ] 9.2 Run `npm run test:coverage` — review coverage report; identify any files below threshold
- [ ] 9.3 Audit all `*.test.tsx` for MUI class selectors or `data-testid` values that no longer exist — fix with RTL semantic queries
- [ ] 9.4 Verify all MSW handlers return `PaginatedRead<T>` envelope — fix any handlers that return bare arrays
- [ ] 9.5 Remove all `data-testid="*-snackbar"` attributes from production components; update test assertions to use text queries on toast content
- [ ] 9.6 Confirm lines ≥ 80%, statements ≥ 80%, branches ≥ 70%, functions ≥ 70%
- [ ] 9.7 Run final gate: `npm test && npx biome check .`
- [ ] 9.8 Commit `.planning/phase-NN-SUMMARY.md` for each phase; merge feature branches into `main`
