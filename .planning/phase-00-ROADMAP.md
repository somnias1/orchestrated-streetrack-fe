```markdown
# Phase Roadmap

Derived from TECHSPEC.md on 2026-03-03.

| Phase | Name                      | Goal                                                                                                            | Key TECHSPEC sections                 | Depends on |
| ----- | ------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------- |
| 01    | Foundation & Auth Setup   | Scaffold Rsbuild React app, core deps, configs, and Auth0 provider wiring to talk to streetrack-be securely.   | §1.2, §2.1, §2.2, §2.3, §3.2, §3.3, §4.4, §7.2 | —          |
| 02    | Layout & Protected Routes | Implement app layout shell, centralized routes, Home and Categories routes, and basic protected routing flow.   | §1.2, §3.1, §3.2, §3.3, §3.4, §4.4    | 01         |
| 03    | Categories Data & Store   | Define categories service and types, wire Axios client, and build a Zustand store with loading/error/empty.    | §1.2, §3.1, §3.3, §4.1, §4.2, §4.3    | 02         |
| 04    | Categories Table & UX     | Build virtualized categories table UI with MUI+Tailwind, income/expense chips, and loading/error/empty + retry.| §1.2, §3.3, §3.4, §3.7, §5.1          | 03         |
| 05    | Tests & Verification      | Set up test tooling and write unit/integration tests for auth, categories list, and API client with coverage gate.| §1.3, §2.3, §3.3, §6.1, §6.2, §8.3 | 01–04      |

## Phase sizing guidance

- Each phase targets **one chat session** worth of work.
- If a phase feels too large (>8 atomic commits), split it.
- If two phases are very small (<2 commits each), consider merging them.
- New features after the initial build continue from Phase 06+ (see FRAMEWORK.md §6).
```
