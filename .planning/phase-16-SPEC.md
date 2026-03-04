# Phase 16 — Tests & Coverage Gate

**Goal:** Update/add tests for Phases 13–15; meet 80% lines/statements, 70% branches/functions; §1.3 mapping.

**Key TECHSPEC:** §1.3 (Success criteria & test coverage), §6.1 (Test pyramid), §6.2 (Coverage & gates), §8.3 (Definition of done).

**Depends on:** Phase 15 (Remaining screens & CRUD on shadcn).

---

## 1. Scope of code under test (§6.1)

- **Phases 13–15:** React Query services (hooks, mutations), theme/layout, Categories table alignment, Subcategories/Transactions/Hangouts lists and CRUD dialogs, unified table state, theme tokens.
- **In scope:** Services (categories, subcategories, transactions, hangouts) and their React Query usage; layout; protected route; list screens and their loading/error/empty/retry behavior; API client (Bearer token). Coverage excludes per `vitest.config.ts`: app shell (index, App), auth callback/redirect, home, theme, presentational chips, table index files.

## 2. §1.3 mapping (§6.1, §8.3)

Produce a mapping table: each §1.3 success criterion → test file(s) and describe block(s) that validate it.

| §1.3 criterion | Test location |
|----------------|---------------|
| Auth: protected route redirect when not logged in | ProtectedRoute.test.tsx |
| Auth: after login, user can reach protected pages | (integration or ProtectedRoute) |
| Categories list: loading, success (rows), error (retry), empty | Categories.test.tsx |
| API client: Bearer token attached when authenticated | callbackApi.test.ts |
| Navigation: Layout shows Home and Categories links; routing matches routes.ts | Layout.test.tsx |

Extend the table for Subcategories, Transactions, Hangouts list behavior (loading/error/empty/retry) where tests exist or are added. Document the final mapping in this spec or in phase-16-SUMMARY.md.

## 3. Coverage gate (§6.2)

- **Thresholds (existing):** lines 80%, statements 80%, branches 70%, functions 70% (vitest.config.ts).
- **Action:** Run `npm run test:coverage`; fix any failing thresholds by adding or updating tests. Do not lower thresholds; adjust coverage excludes only if aligned with TECHSPEC (e.g. presentational components already excluded).
- **Gate:** `npm test && npx biome check .` must pass before every commit.

## 4. Test updates for Phases 13–15

- **React Query (Phase 13):** Ensure service tests and screen tests mock React Query or MSW so list/mutation flows are covered; no regressions from switching to hooks.
- **Theme/layout (Phase 14):** Layout and Categories tests still pass; no new untested logic in theme that falls inside coverage include.
- **Remaining screens (Phase 15):** Subcategories, Transactions, Hangouts modules and hangouts table already have tests; ensure they cover loading/error/empty and retry where applicable, and that coverage of touched code meets the gate.

## 5. Out of scope (Phase 16)

- E2E or Playwright; only unit + integration (Vitest + RTL + MSW).
- Adding coverage for explicitly excluded paths (e.g. AuthCallback, LoginRedirect, home, theme, CategoryTypeChip, table index files) unless TECHSPEC is updated.
- New features or UI changes; tests and coverage only.

## 6. Definition of done

- §1.3 → test mapping table complete and documented (in SPEC or SUMMARY).
- Coverage gate (80% lines/statements, 70% branches/functions) passes with `npm run test:coverage`.
- `npm test && npx biome check .` passes before every commit.
- Phase summary (`.planning/phase-16-SUMMARY.md`) written; STATE.md updated; branch merged to main with `--no-ff`.
