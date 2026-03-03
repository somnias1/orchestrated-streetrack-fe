# Phase 02 — Layout & Protected Routes

## What was built

- **Phase 02 spec** (`.planning/phase-02-SPEC.md`): scope for layout shell, nav, and verification.
- **Layout shell** (`src/modules/layout/index.tsx`): Replaced placeholder with:
  - AppBar + Toolbar with app title "Streetrack".
  - **Home** and **Categories** nav links using `NavLink` and `routes.home` / `routes.categories` (no hardcoded paths).
  - Icons from `@mui/icons-material` (HomeRounded, ListRounded, LogoutRounded) per TECHSPEC §3.7.
  - **Log out** button calling Auth0 `logout({ logoutParams: { returnTo: window.location.origin } })`.
  - Theme tokens from `src/theme/tailwind.ts` (background, surface, textPrimary, textSecondary, primary, border) for dark shell and active/hover states.
- **package.json**: Added `@mui/icons-material` at 7.3.8 (exact, to match MUI 7.3.8).

Centralized routes, Home/Categories routes, and protected routing flow were already in place from Phase 01; this phase completed the layout shell and navigation.

## Files changed

- `.planning/phase-02-SPEC.md`: new.
- `.planning/phase-02-SUMMARY.md`: new (this file).
- `package.json`: added @mui/icons-material 7.3.8.
- `src/modules/layout/index.tsx`: full layout with nav and logout.

## Decisions made

- **Top AppBar**: Single top bar with nav links and logout (no sidebar) for a compact shell; matches "layout shell" and TECHSPEC §3.4.
- **NavLink + isActive**: Used NavLink render prop to apply active styles (primary color, surface background) without relying on MUI theme palette so all colors stay from themeTokens.
- **Logout returnTo**: `window.location.origin` so after Auth0 logout user returns to app root (login screen when unauthenticated).

## Tests added

- None (Phase 05). Manual check: login → see layout with Home/Categories; navigate; logout.

## Known issues / follow-ups

- None. Phase 03 will add categories service and Zustand store; Phase 04 will add virtualized table.
