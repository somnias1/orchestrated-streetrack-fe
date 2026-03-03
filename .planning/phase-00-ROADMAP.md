# Phase Roadmap

Derived from TECHSPEC.md on 2026-03-03. Extended 2026-03-03 from BACKLOG.md and TECHSPEC-AUDIT.md.

| Phase | Name                           | Goal                                                                 | Key TECHSPEC sections                    | Depends on |
| ----- | ------------------------------ | -------------------------------------------------------------------- | ---------------------------------------- | ---------- |
| 01    | Foundation & Auth Setup        | Scaffold Rsbuild React app, core deps, configs, Auth0 provider.     | §1.2, §2.1, §2.2, §2.3, §3.2, §3.3, §4.4, §7.2 | —          |
| 02    | Layout & Protected Routes      | App layout shell, routes, Home and Categories, protected routing.     | §1.2, §3.1, §3.2, §3.3, §3.4, §4.4        | 01         |
| 03    | Categories Data & Store        | Categories service, types, Zustand store, loading/error/empty.       | §1.2, §3.1, §3.3, §4.1, §4.2, §4.3        | 02         |
| 04    | Categories Table & UX          | Virtualized categories table, chips, loading/error/empty + retry.     | §1.2, §3.3, §3.4, §3.7, §5.1              | 03         |
| 05    | Tests & Verification           | Vitest, RTL, MSW; tests for auth, categories, API client; coverage.   | §1.3, §2.3, §3.3, §6.1, §6.2, §8.3        | 01–04      |
| 06    | Subcategories List & Virtual   | Subcategories service, store, list screen, virtualized table, nav.    | §1.6, §3.2, §3.4, §4.1, §4.2, §4.3, §5.1  | 05         |
| 07    | Transactions List & Virtual   | Transactions service, store, list screen, virtualized table, nav.     | §1.6, §3.2, §3.4, §4.1, §4.2, §4.3, §5.1  | 05         |
| 08    | Hangouts List & Virtual        | Hangouts service, store, list screen, virtualized table, nav.        | §1.6, §3.2, §3.4, §4.1, §4.2, §4.3, §5.1  | 05         |
| 09    | Categories Full CRUD UI        | Create, edit, delete Categories; forms, Zod, POST/PATCH/DELETE.       | §1.6, §3.4, §3.5, §4.3 (Categories)       | 05         |
| 10    | Subcategories Full CRUD UI    | Create, edit, delete Subcategories; category picker; forms.           | §1.6, §3.4, §3.5, §4.3 (Subcategories)     | 06         |
| 11    | Transactions Full CRUD UI     | Create, edit, delete Transactions; subcategory/hangout pickers.       | §1.6, §3.4, §3.5, §4.3 (Transactions)     | 07, 08     |
| 12    | Hangouts Full CRUD UI         | Create, edit, delete Hangouts; forms, Zod.                            | §1.6, §3.4, §3.5, §4.3 (Hangouts)         | 08         |

## Phase sizing guidance

- Each phase targets **one chat session** worth of work.
- If a phase feels too large (>8 atomic commits), split it.
- If two phases are very small (<2 commits each), consider merging them.
- New features after Phase 12 (e.g. import/export UI, reports) continue from Phase 13+ (see FRAMEWORK.md §6).
