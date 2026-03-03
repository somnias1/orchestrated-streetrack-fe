```markdown
# Project State

## Current Phase

Phase 03 — Categories Data & Store (complete)

## Last Task Completed

Phase 03: Categories service (types, constants, fetchCategories via callbackApi), Zustand store (items, loading, error, fetch/retry), Categories screen with loading/error/empty/success and Retry CTA; phase spec and summary added.

## Next Task

Start Phase 04 — Categories Table & UX (virtualized table with MUI+Tailwind, income/expense chips, loading/error/empty + retry).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.

## Blockers

None.
```
