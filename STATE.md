```markdown
# Project State

## Current Phase

Phase 01 — Foundation & Auth Setup (complete)

## Last Task Completed

Phase 01 fix: Rsbuild env loading (loadEnv + source.define for VITE_*), config switched to process.env, .env in .gitignore.

## Next Task

Start Phase 02 — Layout & Protected Routes (app layout shell, Home and Categories routes, protected routing flow).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.

## Blockers

None.
```
