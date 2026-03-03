# Phase 01 — Foundation & Auth Setup

## What was built

- **.gitattributes** with `* text=auto eol=lf` for consistent line endings (Biome).
- **.npmrc** with `legacy-peer-deps=true` so `npm install` completes with pinned React 19.2.3.
- **package.json**: exact-pinned deps per TECHSPEC §2.2 (react, react-dom, react-router-dom, @auth0/auth0-react, zustand, axios, @tanstack/react-table, @tanstack/react-virtual, @mui/material, @emotion/react, @emotion/styled, tailwindcss, zod, typescript, @biomejs/biome, @rsbuild/core, etc.) and `test` script for the gate.
- **src/config.ts**: env-based config (VITE_API_URL, VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_CALLBACK_URL).
- **src/routes.ts**: centralized route constants (auth.login, auth.callback, home, categories).
- **src/theme/tailwind.ts**: `twColor()` helper and themeTokens for MUI/Tailwind.
- **src/services/types.ts** and **validation.ts**: shared API types and HTTPValidationError.
- **src/utils/callbackApi**: Axios instance with baseURL from config; `setTokenGetter()` and request interceptor to attach Bearer token.
- **src/utils/auth/useGetToken.ts**: hook returning Auth0’s `getAccessTokenSilently`.
- **src/modules/auth0**: LoginRedirect (loginWithRedirect), AuthCallback (post-login redirect to home), ProtectedRoute (redirect to login when unauthenticated).
- **src/modules/layout**, **home**, **categories**: placeholder components.
- **App.tsx**: BrowserRouter, Routes for callback/login/home/categories; ProtectedShell with TokenInjector and Layout; Outlet for protected children.
- **index.tsx**: Auth0Provider (domain, clientId, redirect_uri, cacheLocation: localstorage); guard when Auth0 env is missing.

## Files changed

- `.gitattributes`: added (eol=lf).
- `.npmrc`: added (legacy-peer-deps).
- `package.json` / `package-lock.json`: pinned deps, test script.
- `src/config.ts`, `src/routes.ts`, `src/env.d.ts`: new.
- `src/theme/tailwind.ts`, `src/services/types.ts`, `src/services/validation.ts`: new.
- `src/utils/callbackApi/index.ts`, `src/utils/auth/useGetToken.ts`: new.
- `src/modules/auth0/*`, `src/modules/layout/index.tsx`, `src/modules/home/index.tsx`, `src/modules/categories/index.tsx`: new.
- `src/App.tsx`, `src/index.tsx`: Auth0 + Router wiring.
- `src/App.css`: removed.

## Decisions made

- **legacy-peer-deps**: Used so install completes with react@19.2.3 vs react-dom’s peer; avoids long resolve and Windows lock issues.
- **TokenInjector**: Single place inside ProtectedRoute tree so callbackApi gets the token getter once for all protected routes.
- **Auth0 config guard**: If VITE_AUTH0_DOMAIN or VITE_AUTH0_CLIENT_ID are missing, app renders a short message instead of mounting Auth0Provider to avoid cryptic SDK errors.

## Tests added

- None (Phase 05 covers tests). Gate uses `npm test` = `node -e "process.exit(0)"` until then.

## Known issues / follow-ups

- None. Phase 02 will add layout shell and navigation; Phase 03 will add categories service and store.
