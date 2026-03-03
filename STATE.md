```markdown
# Project State

## Current Phase

Phase 02 — Layout & Protected Routes (complete)

## Last Task Completed

Phase 02: Layout shell with AppBar, Home/Categories nav links (routes.*, MUI Icons), theme tokens, and Log out; phase spec and summary added.

## Next Task

Start Phase 03 — Categories Data & Store (categories service, types, Axios client, Zustand store with loading/error/empty).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.

## Blockers

None.
```
