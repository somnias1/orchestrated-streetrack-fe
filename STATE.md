```markdown
# Project State

## Current Phase

Phase 05 — Tests & Verification (complete)

## Last Task Completed

Phase 05: Vitest + RTL + MSW set up; unit tests for callbackApi (Bearer token), categories store, categories service; integration tests for ProtectedRoute, Categories screen (loading/success/error/empty/retry), Layout (Home/Categories links); coverage gate (80% lines/statements, 70% branches/functions); README and phase summary.

## Next Task

Merge `feature/phase-05-tests-verification` into main; then Phase 06+ (per ROADMAP / BACKLOG).

## Key Decisions

- **Rsbuild env**: Use `loadEnv({ prefixes: ['VITE_'] })` and `source.define: { ...publicVars }` so env vars from .env (or venv/shell) are available at build time; app config reads `process.env.VITE_*`.
- **.env**: Added to .gitignore so secrets are not committed.
- **Testing**: Vitest 4 + React Testing Library + MSW; coverage excludes app shell, auth redirect/callback, home, theme, and presentational chip so gate applies to §1.3-touched code.

## Blockers

None.
```
