# Phase 27 — react-hook-form migration + bulk dialog optimization

## Goal (from ROADMAP)

- Add **react-hook-form** and **@hookform/resolvers** (Zod via `zodResolver`).
- Migrate **Category**, **Subcategory**, **Transaction**, and **BulkTransactions** form dialogs to `useForm` + `zodResolver`, replacing ad-hoc `useState` + manual `safeParse` where applicable.
- **BulkTransactionsDialog**: `useFieldArray` for rows; **React.memo** on row component to limit re-renders; **lifted** subcategory/hangout list data via optional **`externalOptions`** (or equivalent) on `SubcategoryAutocomplete` / `HangoutAutocomplete` so the dialog does not run N identical list queries (one list query + optional client filter per picker type).

## TECHSPEC alignment

- **§2.2** — Stack: form library + Zod resolver consistent with existing Zod schemas.
- **§3.5** — Forms: validation remains Zod-backed; UX (labels, errors, required) unchanged unless required for RHF integration.
- **§3.4 / §5.1** — Screens/dialogs: behavior and accessibility preserved (test ids where present).

## Out of scope

- **HangoutFormDialog** — not listed in Phase 27 ROADMAP row (four dialogs only).
- Changing API contracts or non-form business logic beyond what RHF migration requires.

## Definition of done (phase)

- Dependencies added; all four dialogs use RHF + `zodResolver` (bulk uses `useFieldArray`).
- Pickers support lifted options for bulk rows; bulk row component memoized.
- `npm test && npx biome check .` pass; existing tests updated if needed.
