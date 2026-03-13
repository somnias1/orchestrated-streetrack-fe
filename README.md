# Streetrack Frontend

Personal finance / expense-tracking web app (React, Rsbuild, Auth0, streetrack-be API). See TECHSPEC.md for full technical spec.

## Setup

Install the dependencies:

```bash
npm install
```

## Get started

Start the dev server; the app will be available at [http://localhost:3000](http://localhost:3000).

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Tests

Run the test suite (Vitest + React Testing Library + MSW):

```bash
npm test
```

Run tests with coverage (gate: 80% lines/statements, 70% branches/functions on in-scope code):

```bash
npm run test:coverage
```

**Gate (before every commit on a phase branch):** `npm test && npx biome check .` must pass.

## E2E tests (Playwright)

E2E tests use **real Auth0 login** and the **real backend** (no API mocking). Ensure your `.env` has:

- `VITE_APP_URL` — base URL of the app (e.g. `http://localhost:8080` or your dev URL)
- `VITE_E2E_USER_EMAIL` — test user email (Auth0)
- `VITE_E2E_USER_PASSWORD` — test user password

The app and backend must be running (e.g. `npm run dev` and your backend server). Install browsers once, then run the suite:

```bash
npx playwright install chromium
npm run test:e2e
```

Or run with UI: `npm run test:e2e:ui`. Tests create and clean up their own data (categories, subcategories, transactions, hangouts) to keep runs isolated.

## Learn more

- [Rsbuild documentation](https://rsbuild.rs)
- [TECHSPEC.md](./TECHSPEC.md) — technical specification and phase roadmap
