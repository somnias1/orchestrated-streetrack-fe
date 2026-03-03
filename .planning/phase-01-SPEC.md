# Phase 01 — Foundation & Auth Setup

**Goal:** Scaffold Rsbuild React app, core deps, configs, and Auth0 provider wiring to talk to streetrack-be securely.

**Key TECHSPEC:** §1.2, §2.1, §2.2, §2.3, §3.2, §3.3, §4.4, §7.2

---

## Scope

### 1. Git & tooling (§2.3)

- Add `.gitattributes` with `* text=auto eol=lf` so Biome runs cleanly on all platforms.
- Add `"test": "node -e \"process.exit(0)\""` to `package.json` so the gate `npm test && npx biome check .` passes until Phase 05.

### 2. Dependencies (§2.2)

Pin **exact** versions (no `^` or `~`) for:

| Package | Version |
|---------|---------|
| react | 19.2.3 |
| react-dom | 19.2.3 |
| react-router-dom | 7.13.0 |
| @auth0/auth0-react | 2.15.0 |
| zustand | 5.0.11 |
| axios | 1.13.5 |
| @tanstack/react-table | 8.21.3 |
| @tanstack/react-virtual | 3.13.19 |
| @mui/material | 7.3.8 |
| tailwindcss | 4.1.18 |
| zod | 3.25.76 |
| typescript | 5.9.3 |
| @biomejs/biome | 2.3.8 |
| @rsbuild/core | 1.7.1 |

Dev: @rsbuild/plugin-react, @tailwindcss/postcss, @types/react, @types/react-dom — exact versions as needed.

### 3. Project structure (§3.2)

- **Entry:** `src/index.tsx`, `src/App.tsx`; Auth0Provider and Router wrap the app.
- **Config:** `src/config.ts` — read `import.meta.env` for API URL and Auth0 (e.g. `VITE_API_URL`, `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_CALLBACK_URL`).
- **Routes:** `src/routes.ts` — centralized route path constants (auth.login, auth.callback, home, categories).
- **Modules:** `src/modules/auth0/`, `src/modules/layout/`, `src/modules/home/`, `src/modules/categories/` — minimal placeholders (e.g. index exporting a placeholder component or route config).
- **Services:** `src/services/types.ts` (shared API types placeholder); no categories service implementation in Phase 01.
- **Theme:** `src/theme/tailwind.ts` — placeholder exporting a `twColor`-style helper or theme tokens.
- **Utils:** `src/utils/callbackApi/` — Axios instance that will attach Bearer token (token set at runtime via interceptor); `src/utils/auth/useGetToken.ts` — hook that returns token from Auth0 (e.g. `getAccessTokenSilently`).

Remove or replace default `App.css` usage with theme-driven styling where applicable.

### 4. Auth0 wiring (§4.4)

- In `src/index.tsx` (or `App.tsx`): wrap app with `Auth0Provider` using domain, clientId, authorizationParams.redirectUri from config.
- Use `cacheLocation: 'localstorage'` so session persists across refresh.
- Define `routes.auth.login` and `routes.auth.callback`; callback route renders Auth0 callback handling (e.g. component that uses SDK and redirects to home).
- Protected route component: redirect to login if not authenticated (implementation can be minimal — redirect to `routes.auth.login`).

### 5. API client (§3.3)

- `src/utils/callbackApi/index.ts`: create Axios instance with baseURL from config. Interceptor that sets `Authorization: Bearer <token>` when token is available (token provided by a setter or from a hook). No direct Axios calls from outside this module.
- `useGetToken` in `src/utils/auth/useGetToken.ts`: uses Auth0’s `useAuth0()` and returns a function or token getter (e.g. `getAccessTokenSilently`) so the API client can attach the token to requests.

### 6. App entry and routing

- `App.tsx`: Router with routes for callback, login, home, categories (placeholders). Layout not required in Phase 01 beyond optional shell; Home and Categories can render a simple placeholder div.
- Build and preview: `npm run dev`, `npm run build`, `npm run preview` must succeed.

---

## Out of scope (Phase 01)

- Categories API service implementation (Phase 03).
- Layout shell and full navigation (Phase 02).
- Virtualized table and full Categories UI (Phase 04).
- Real tests (Phase 05).

---

## Definition of done (this phase)

- [ ] `.gitattributes` present; gate script in package.json.
- [ ] All core deps pinned exact in package.json; `npm install` and `npx biome check .` pass.
- [ ] `src/` structure matches §3.2; `routes.ts` and `config.ts` in use.
- [ ] Auth0Provider wraps app; login and callback routes work with env config.
- [ ] callbackApi Axios instance and useGetToken exist; token can be attached to requests.
- [ ] `npm run dev`, `npm run build`, `npm run preview` succeed.
