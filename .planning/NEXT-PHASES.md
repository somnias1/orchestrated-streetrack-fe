# Next Phases — Planning Summary

**Date:** 2026-03-03  
**Based on:** TECHSPEC-AUDIT.md, BACKLOG.md, STATE.md, FRAMEWORK.md §5–§6.

---

## Audit outcome (short)

- **§1.3 test cases:** All covered; mapping in audit and `phase-05-SUMMARY.md`.
- **§8.3 Definition of Done:** All audit-able bullets met; complete Phase 05 by merging `feature/phase-05-tests-verification` into `main` if not already done.
- **Phases 01–05:** Aligned with ROADMAP and code; STATE marks Phase 05 complete.
- **Coverage:** Gate passes (80%+ lines/statements, 70%+ branches/functions).

---

## ROADMAP extension (Phase 06–12)

Phases 06–12 were added to `.planning/phase-00-ROADMAP.md` to match BACKLOG **High** (virtualization for Subcategories and Transactions) and **Medium** (full CRUD for all four resources):

| Phase | Name                         | BACKLOG alignment |
| ----- | ---------------------------- | ------------------ |
| **06** | Subcategories List & Virtual | High: Subcategories virtual list |
| **07** | Transactions List & Virtual  | High: Transactions virtual list |
| **08** | Hangouts List & Virtual      | Medium: Hangouts list (enables picker in Phase 11) |
| **09** | Categories Full CRUD UI      | Medium: Categories create/edit/delete |
| **10** | Subcategories Full CRUD UI  | Medium: Subcategories list + CRUD |
| **11** | Transactions Full CRUD UI    | Medium: Transactions list + CRUD (uses 07 + 08 for pickers) |
| **12** | Hangouts Full CRUD UI        | Medium: Hangouts list + CRUD |

Order rationale: deliver all **list + virtual** screens first (06–08), then **CRUD** in an order that allows pickers (Categories first; Subcategories need categories; Transactions need subcategories + hangouts; Hangouts standalone).

---

## What to do next

1. **Merge Phase 05** (if branch not yet merged):  
   `git checkout main && git merge --no-ff feature/phase-05-tests-verification`
2. **Start Phase 06:** In a new chat (or this one), send:  
   **`GSD session start — Phase 06.`**  
   The agent will use the ROADMAP and TECHSPEC to run pre-flight, create `phase-06-SPEC.md`, branch `feature/phase-06-subcategories-list`, and implement.

Each phase should include tests for new code and keep coverage above the gate; no separate “unit tests only” phase was added because BACKLOG unit-test items are satisfied by tests in each feature phase (and Phase 05 already established the pattern).

Later work (import/export UI, reports, PWA) continues from **Phase 13+** per FRAMEWORK.md §6.
