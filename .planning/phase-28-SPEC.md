# Phase 28 — MUI → shadcn/ui UX overhaul

## Goal (from ROADMAP)

Replace the entire Material UI layer with **shadcn/ui** (Radix + Tailwind) throughout the application. Zero MUI/Emotion imports remain after this phase.

## TECHSPEC alignment

- **§2.2** — Stack: remove `@mui/material`, `@emotion/react`, `@emotion/styled`; add `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `sonner`, shadcn component primitives.
- **§3.1–3.5** — All screens (Home, Categories, Subcategories, Transactions, Hangouts) and the app shell (Layout sidebar) rebuilt with shadcn primitives; API contracts and data flow unchanged.
- **§6** — Coverage gate preserved: lines ≥ 80%, statements ≥ 80%, branches ≥ 70%, functions ≥ 70%.

## Scope

### In scope
- Uninstall MUI/Emotion; install shadcn dependency set
- `npx shadcn init` with Stone base color + CSS variables mode (Tailwind v4)
- Apply tweakcn dark-finance palette to `src/index.css`
- All shadcn component primitives: button, dialog, alert-dialog, input, label, form, select, checkbox, command, popover, tooltip, badge, card, skeleton, separator, sheet
- Shared `Combobox` wrapper (`src/components/pickers/Combobox.tsx`) preserving `externalOptions` contract from Phase 27
- Shared `TablePagination` component wrapping TanStack Table state
- Collapsible sidebar layout (desktop rail + mobile Sheet)
- Full screen-by-screen migration: Home, Categories, Subcategories, Transactions, Hangouts
- Sonner toasts replacing MUI Snackbar
- shadcn `Badge` replacing `CategoryTypeChip` and MUI Chip usage
- Test suite audit: RTL semantic queries, MSW handler envelopes, toast assertions
- Home module integration test (7 tests covering all 3 dashboard API paths)
- Biome lint: semantic HTML (`<progress>` for loading, no `role="columnheader"` on divs)

### Out of scope
- API contract changes
- New features
- E2E test changes

## Definition of done

- Zero `@mui/` imports anywhere in `src/`
- `npm run build` — zero errors
- `npx biome check .` — zero errors
- `npm test` — all tests pass
- `npm run test:coverage` — lines ≥ 80%, statements ≥ 80%, branches ≥ 70%, functions ≥ 70%
