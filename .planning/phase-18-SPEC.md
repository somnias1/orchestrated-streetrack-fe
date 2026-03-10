# Phase 18 — UX/UI improvements (Spec)

**Scope:** ROADMAP Phase 18 goal and TECHSPEC §3.4, §3.7.

## Goal

- **Type as MUI Chips:** Display category/subcategory type (income vs expense) as MUI Chips with distinct colors (e.g. green/red per §3.7), wherever type is shown (Categories table, Subcategories table, forms if applicable).
- **Transactions: Button + Menu:** Replace single primary action with a split: one **Button + Menu** offering "Transaction" (opens single transaction form dialog) and "Bulk" (placeholder or stub for future bulk dialog). Align with §3.4 Transactions screen description.
- **Default current-month filter for transactions:** Transactions list defaults to the current year and month (date filter applied on load); no UX change to filter UI in this phase beyond applying the default.
- **Hangouts table action colors:** Table row actions (e.g. Edit, Delete) use primary color for primary action and error/destructive color for delete, aligned with other tables (§3.4 Hangouts row).

## TECHSPEC references

- **§3.4** — Screens & Navigation: Transactions (Button + Menu; default current month); Hangouts (action colors primary/error).
- **§3.7** — UI/UX: Status badge/pill as chips; design tokens; component patterns.

## Out of scope (Phase 18)

- Bulk transactions dialog implementation (Phase 22); "Bulk" menu item may open a stub or placeholder.
- Filter UI for date/subcategory/hangout (Phase 19); only default current-month value is applied.
- New API changes; frontend-only UX/UI.

## Acceptance

- Categories and Subcategories tables show type (income/expense) as MUI Chips with correct semantic colors.
- Transactions screen has a Button + Menu with "Transaction" and "Bulk" entries; Transaction opens existing create dialog; Bulk can be stub.
- Transactions list is filtered by current month (and year) by default on load.
- Hangouts table action buttons use primary (e.g. Edit) and error (Delete) styling consistently with other resource tables.
