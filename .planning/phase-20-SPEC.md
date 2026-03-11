# Phase 20 — Periodic expenses (subcategories)

## Goal

Subcategory `is_periodic` and `due_day` in types, form, and list (TECHSPEC §4.1, §3.4, §3.5).

## Scope

- **Types** (`src/services/subcategories/types.ts`): Add to `SubcategoryRead` — `is_periodic` (boolean, default false), `due_day` (number | null). Add to `SubcategoryCreate` and `SubcategoryUpdate`; `due_day` required when `is_periodic` is true (enforced in form + API).
- **Form** (subcategory create/edit): Zod schema + dialog fields for "Periodic expense" (checkbox) and "Due day" (1–31); due_day required when is_periodic is true; payload includes is_periodic and due_day.
- **List** (Subcategories screen): Table shows periodic indicator and due day (e.g. columns or combined cell); existing columns unchanged.

## TECHSPEC refs

- §4.1 Data Model — SubcategoryRead/Create/Update with is_periodic, due_day
- §3.4 Screens & Navigation — Subcategories list with periodic fields
- §3.5 Form Validation — Zod for form; due_day 1–31 when is_periodic

## Out of scope

- Dashboard/due-periodic-expenses API (Phase 21)
- Bulk transactions (Phase 22)

## Definition of done

- Types match §4.1; form validates and submits is_periodic/due_day; list displays them.
- `npm test && npx biome check .` passes before every commit.
