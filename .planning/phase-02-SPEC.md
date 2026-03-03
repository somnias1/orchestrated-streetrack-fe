# Phase 02 — Layout & Protected Routes

**Goal:** Implement app layout shell, centralized routes, Home and Categories routes, and basic protected routing flow.

**Key TECHSPEC:** §1.2, §3.1, §3.2, §3.3, §3.4, §4.4

---

## Scope

### 1. Layout shell (§3.2, §3.4)

- **Layout** (`src/modules/layout/`): Replace placeholder with a proper shell:
  - Persistent navigation with **Home** and **Categories** links using `routes.home` and `routes.categories` (no hardcoded paths).
  - Use MUI components and theme tokens from `src/theme/tailwind.ts` (e.g. `themeTokens.background`, `themeTokens.surface`, `themeTokens.textPrimary`).
  - Style: dark gray background (gray-800/900), high-contrast light text (gray-100) per §3.7.
  - Optional: Logout control in layout (Auth0 `logout()`).
- **Icons:** Use `@mui/icons-material` (one icon library per §3.7) for nav items; pin exact version (e.g. 7.3.8 to match MUI).

### 2. Centralized routes

- Already in place: `src/routes.ts` with `auth.login`, `auth.callback`, `home`, `categories`. No new routes this phase.

### 3. Home and Categories routes

- Already in place: Both under protected layout in `App.tsx`; placeholders are sufficient. No virtualized table or API in this phase.

### 4. Protected routing flow

- Already in place: `ProtectedRoute` redirects unauthenticated users to login; callback redirects to home; `ProtectedShell` wraps Layout + TokenInjector + Outlet.

### 5. Verification

- `npm run dev`, `npm run build`, `npm run preview` must succeed.
- Manual check: Log in → see layout with Home and Categories links; navigate between them; logout (if implemented) returns to login.

---

## Out of scope (Phase 02)

- Categories API and table (Phase 03–04).
- Tests (Phase 05).

---

## Definition of done

- [x] Phase 02 spec committed (this file).
- [x] Layout shell has nav with Home and Categories links using `routes.*` and `Link`/`NavLink`.
- [x] Layout uses theme tokens (tailwind.ts) for colors/background.
- [x] Optional: Logout in layout; icons from @mui/icons-material.
- [x] Build and preview succeed; navigation between Home and Categories works.
