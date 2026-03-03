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

## Learn more

- [Rsbuild documentation](https://rsbuild.rs)
- [TECHSPEC.md](./TECHSPEC.md) — technical specification and phase roadmap
