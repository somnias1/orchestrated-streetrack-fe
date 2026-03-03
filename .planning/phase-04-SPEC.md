# Phase 04 — Categories Table & UX

**Goal:** Build virtualized categories table UI with MUI+Tailwind, income/expense chips, and loading/error/empty + retry.

**Key TECHSPEC:** §1.2, §3.3, §3.4, §3.7, §5.1

---

## Scope

### 1. Virtualized table structure (§3.7, §5.1)

- **TanStack Table** for column model and row data; **TanStack Virtual** for virtualized tbody so only visible rows render.
- **Columns**: Name, Description, Type (income/expense), Actions (placeholder for future CRUD; e.g. empty or “—” for now).
- **Sticky header**; tbody with **min height** (e.g. viewport or container) so few rows stay at top; grid-based layout.
- Table lives under `src/modules/categories/` (e.g. `categoriesTable/` with header/body subcomponents or a single table component).

### 2. Income / expense chips (§3.7)

- **Status badge**: Income = green chip/pill (e.g. green-700 bg + light text); Expense = red (e.g. red-700 + light text).
- Use **theme tokens** from `src/theme/tailwind.ts` (e.g. success/error or status-specific); no hardcoded hex.
- **Accessibility**: Status not by color alone — pair with text “Income” / “Expense” (and optionally icon per §3.7).

### 3. Table body states (§3.3, §3.7)

- **Loading**: Spinner (MUI CircularProgress) in tbody when `loading === true`.
- **Error**: Error message + **retry** button in tbody that calls store’s `fetchCategories()`.
- **Empty**: “No categories found.” when `items.length === 0` and !loading && !error.
- **Success**: Virtualized rows with name, description (truncate if long; optional tooltip), type chip, actions.

### 4. Categories screen wiring

- **`src/modules/categories/index.tsx`**: On mount, trigger store’s `fetchCategories()`. Render the **virtualized table** for all states; table is responsible for showing loading/error/empty inside its body (single place for data states per §3.7).
- Use theme tokens and Tailwind (twColor / themeTokens) for colors and spacing; compact padding, hover state on rows.

### 5. Layout and styling

- Spacing scale (4, 8, 12, 16, 24) for padding/gaps; table borders and surfaces from theme (e.g. gray-800 surface, gray-600 border).
- Description column: truncate long text; optional Tooltip for full text.

---

## Out of scope (Phase 04)

- Categories CRUD (create/edit/delete) — actions column is placeholder.
- Unit/integration tests for table (Phase 05).
- “About” dialog or other dialogs.

---

## Definition of done

- [x] Phase 04 spec committed (this file).
- [x] Virtualized categories table with TanStack Table + TanStack Virtual; columns: Name, Description, Type, Actions.
- [x] Income/Expense chips with theme tokens; status not by color alone.
- [x] Table body shows loading (spinner), error (message + retry), empty (“No categories found.”), and success (virtualized rows).
- [x] Categories screen uses the table for all states; single table component.
- [x] Gate: `npm test && npx biome check .` and `npm run build` / `npm run preview` succeed.
