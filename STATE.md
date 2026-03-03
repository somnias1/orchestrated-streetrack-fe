```markdown
# Project State

## Current Phase

Phase 04 — Categories Table & UX (complete)

## Last Task Completed

Phase 04: Virtualized categories table (TanStack Table + TanStack Virtual) with columns Name, Description, Type, Actions; income/expense chips with theme tokens; table body states (loading, error with retry, empty, virtualized rows); Categories screen always renders table; phase spec and summary added.

## Next Task

Start Phase 05 — Tests & Verification (test tooling, unit/integration tests for auth, categories list, API client, coverage gate).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.

## Blockers

None.
```
