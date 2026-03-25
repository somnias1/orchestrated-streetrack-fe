# Technical Specification (TECHSPEC) — Streetrack Frontend

> **GSD-aligned.** This spec drives the phase-based development pipeline (see FRAMEWORK.md). Keep it the single source of technical truth; ROADMAP and STATE.md should stay consistent with it.

---

## 1. Problem & Context

### 1.1 Problem Statement

Users need a **personal finance / expense-tracking** application to manage **income and expenses** in a structured way. Money flows are organized into **Categories** (e.g. Food, Transport, Salary) and **Subcategories**; **Transactions** record individual entries and can be linked to **Subcategories** and **Hangouts** (e.g. outings or events). All data is **user-scoped**: the backend (streetrack-be) enforces ownership via Auth0 JWT. The frontend must provide a fast, accessible web app that authenticates users, fetches and displays their data, and (as the product evolves) supports full CRUD for categories, subcategories, transactions, and hangouts.

### 1.2 Goals (GSD: what must be TRUE when done)

- Users can **log in** (Auth0), land on a **Home** and navigate to **Categories** via a persistent layout.
- **Categories** screen shows the user's categories in a **virtualized table** (name, description, income/expense, actions) with loading, error, and empty states; errors offer a **retry** action.
- Categories data is loaded from the **real backend API** with the user's **Bearer token**; session is persisted (e.g. localStorage) so refresh does not flash the login screen.
- **Specs are written before implementation**; git history reflects spec-driven development. New features (e.g. Categories CRUD UI, Subcategories, Transactions, Hangouts) are added in phases with clear phase specs and summaries.

### 1.3 Success Criteria (observable) & Test Coverage

- Auth: protected routes redirect unauthenticated users to login; after login, callback restores session and user can access Home and Categories.
- Categories list: loads from API; displays virtualized rows; shows loading spinner while fetching; shows error state with **retry CTA** that triggers refetch; shows empty state when there are no categories.
- **Tests validate (as applicable per phase):**
  - **Auth**: Protected route redirects when not logged in; after login, user can reach protected pages.
  - **Categories list**: Renders loading, success (rows), error (with retry), and empty states.
  - **API client**: Bearer token is attached to requests when user is authenticated.
  - **Navigation**: Layout shows Home and Categories links; routing matches `routes.ts`.
  - **Finance stream (Phases 18–24):** Filters, dashboard, bulk transactions, import/export, and periodic subcategory behaviour covered by tests; §1.3 mapping in Phase 24.
  - **List pagination (Phase 25):** List endpoints return a paginated envelope; UI uses classic MUI `TablePagination` (page size + `skip`/`limit`); tests/MSW match envelope and paging behaviour.
  - **Searchable pickers (Phase 26):** Categories, subcategories, and hangouts list queries support optional `name` (icontains); pickers/filters use server-driven search (e.g. MUI `Autocomplete`); tests cover debounced search and selection.
- Test suite runs and passes; coverage meets the gate in §6.2.

### 1.4 Out of Scope (v1 / current)

- No backend implementation in this repo; backend lives in **streetrack-be** (FastAPI, PostgreSQL, Auth0).
- Subcategories, Transactions, and Hangouts **UI** are planned but not yet in scope for the initial TECHSPEC phases; they will be added via spec updates and new phases.
- Import/export UI is later priority (see BACKLOG.md).

### 1.5 Repository Deliverables

- **README**: How to run the app (dev, build, preview) and tests; key decisions and assumptions.
- **BACKLOG.md**: Kept in sync with streetrack-be; Done / High / Medium / Later priorities.

### 1.6 BACKLOG Alignment

The **BACKLOG.md** at repo root is the single full-stack backlog (backend + frontend). Priorities: **virtualization** and **unit tests** first; **import/export** last. Summary and mapping into this TECHSPEC:

| BACKLOG area | Frontend scope | TECHSPEC / phases |
| ------------ | -------------- | ----------------- |
| **Done** | Auth0, layout, all four resources (list + CRUD), React Query, theme, tests & coverage, names in lists (Phase 17) | §1.2, §3.4, §4.3, §4.4, §6 |
| **High** | Phase 18 UX/UI (chips, Transaction/Bulk menu, current-month default, Hangouts actions); Phase 19 list filters and sort; Phase 20 periodic expenses; Phase 21 Home dashboard; Phase 22 bulk transactions; Phase 23 import/export UI; Phase 24 tests and polish; **Phase 25** paginated list API + `TablePagination`; **Phase 26** `name` filter + Autocomplete pickers | §3.4, §4.1, §4.3, §6; ROADMAP 18–26 |
| **Medium** | Loading/error refinements; layout and navigation polish | §3.4 |
| **Later** | Import/export UI refinements (clipboard); reports/dashboards; optional PWA | §4.3; Phase 23 covers main import/export |

Backend list endpoints for **categories, subcategories, transactions, and hangouts** return a **`PaginatedRead<T>`** JSON object: `items`, `total`, `skip`, `limit`, `has_more`, `next_skip` (see OpenAPI). Query params include **`skip`** and **`limit`** (defaults 0 and 50). Optional **`name`** (case-insensitive contains) on **categories**, **subcategories**, and **hangouts** list routes only (not transactions list). **Frontend UX:** classic **page-based** pagination only — MUI **`TablePagination`** driven by `total` and client-computed `skip`/`limit`; **do not** use `has_more` / `next_skip` for infinite scroll in Phases 25–26. Keep BACKLOG and TECHSPEC in sync when adding new features: update BACKLOG Done, then add or update TECHSPEC sections and phase specs.

---

## 2. Tech Stack & Constraints

### 2.1 Runtime & Platform

| Area                       | Choice           | Notes                    |
| -------------------------- | ---------------- | ------------------------ |
| **Platform**               | Web (SPA)        | Browser only.            |
| **Build / dev**            | Rsbuild          | React build tooling.     |
| **Language(s)**            | TypeScript       | Pin exact; see §2.2.     |
| **Package manager**        | npm              |                          |
| **Linting / formatting**   | Biome            | Lint + format in one.    |

### 2.2 Core Dependencies & Versions

Pin **exact** versions in `package.json` (no `^` or `~`). Reference values from current `package.json`:

| Package                     | Version  | Purpose                              |
| --------------------------- | -------- | ------------------------------------ |
| react                       | 19.2.3  | UI                                   |
| react-dom                   | 19.2.3  | DOM render                           |
| react-router-dom            | 7.13.0  | Routing                              |
| @auth0/auth0-react          | 2.15.0  | Auth (login, callback, logout)       |
| zustand                     | 5.0.11  | Global read store per resource (synced from React Query); UI-only state (Phase 13+) |
| @tanstack/react-query       | (Phase 13) | Server state: queries, mutations, cache, refetch (see §3.3, §4.2) |
| axios                       | 1.13.5  | HTTP client (via callbackApi)        |
| @tanstack/react-table       | 8.21.3  | Table model for categories           |
| @tanstack/react-virtual     | 3.13.19 | Virtualized table body               |
| @mui/material               | 7.3.8   | UI components                        |
| tailwindcss                  | 4.1.18  | Utility CSS (with theme helper)      |
| zod                         | 3.25.76 | Validation (forms, etc.)             |
| typescript                  | 5.9.3   | Type safety                          |
| @biomejs/biome              | 2.3.8   | Lint + format                        |
| @rsbuild/core               | 1.7.1   | Build                                |

### 2.3 Hard Constraints

- **Spec-driven development**: Create a brief spec (TECHSPEC or phase spec) before implementing features; git history must show specs before implementation.
- **Gitflow**: Each phase is developed on a **feature branch** from `main` (e.g. `feature/phase-NN-<slug>`). Merge into `main` at phase end (merge commit or squash). No phase is complete until its branch is merged.
- **Centralized routes**: All route paths are defined in `src/routes.ts`; navigation and links use these constants — no hardcoded path strings.
- **TypeScript**: Prefer `type` over `interface`; component props must be `Readonly<{ … }>` (in `types.ts`).
- **Error feedback**: Every error state that can be retried must include an **actionable retry CTA** (e.g. button that calls refetch or re-invokes the request). No passive "try again later" without a button.
- **Exact dependency versions** in `package.json`; no `^` or `~`.
- **Line endings**: `.gitattributes` with `* text=auto eol=lf` from Phase 01 to avoid CRLF breaking Biome.

### 2.4 Preferences (soft)

- State: Phase 13+ uses TanStack React Query for server state (list/CRUD); Zustand stores hold a global read mirror (items, loading, error) synced from the query in screens, plus UI-only state (e.g. dialog open). API: Axios with Bearer token from Auth0; single callbackApi / client entry point.
- Prefer minimal dependencies; add libraries only when they clearly improve quality or performance.
- Virtualization for large lists (categories done; subcategories and transactions when those screens exist).

---

## 3. Architecture

### 3.1 High-Level Architecture

- **Web SPA** talking to **streetrack-be** (FastAPI). Single process: browser → React app → Axios (Bearer token) → backend API.
- **Screen flow**: (1) **Login** (Auth0) → **Callback** → (2) **Home** (placeholder) and **Categories** (list in virtualized table). Layout provides navigation (Home, Categories). Future: Subcategories, Transactions, Hangouts.
- **Auth**: Auth0 React SDK; token obtained via `useAuth0()` and passed to the API client so every request includes the JWT. Session persisted (e.g. localStorage) to avoid login flash on refresh.
- **Categories**: Fetched from backend via React Query; result mirrored in Zustand (categories store) for global read access; table uses TanStack Table + TanStack Virtual; loading/error/empty handled in the table body with retry on error.

### 3.2 Project Structure

All application source under **`src/`**. Root holds config, docs, tooling.

- **Entry**: `src/index.tsx`, `src/App.tsx`; routing via React Router; Auth0Provider and router wrap the app.
- **Routes**: Centralized in `src/routes.ts`; layout and screens import from here.
- **Modules**: Feature-based under `src/modules/` (e.g. `auth0/`, `layout/`, `categories/`). Each module can have: `index.tsx`, components, store, hooks, dialogs. Component folders follow the pattern: `componentName/index.tsx`, `componentName/types.ts` (e.g. `categoriesTable/`, `categoriesTableBody/`, `categoriesTableHeader/`).
- **Services**: API layer under `src/services/` (e.g. `categories/index.ts`, `categories/types.ts`, `categories/constants.ts`). Services call Axios (callbackApi) with base URL and auth token.
- **Theme**: `src/theme/` (e.g. `tailwind.ts` for Tailwind theme values in MUI `sx`). Design tokens and shared styling live here or in a single constants/theme file.
- **Utils**: `src/utils/` (e.g. `callbackApi/`, `auth/useGetToken.ts`) for shared API client and auth helpers.

```
[ROOT]/
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── config.ts
│   ├── routes.ts
│   ├── modules/
│   │   ├── auth0/           # login, callback, logout, protectedRoute
│   │   ├── layout/           # layout shell, layoutRoutes
│   │   ├── home/
│   │   └── categories/       # index, store, hooks, components (table, dialogs)
│   ├── services/
│   │   ├── types.ts          # shared API types
│   │   └── categories/       # index, types, constants
│   ├── theme/
│   │   └── tailwind.ts       # twColor etc.
│   └── utils/
│       ├── callbackApi/      # Axios instance, Bearer token
│       └── auth/             # useGetToken
├── package.json
├── tsconfig.json
├── biome.json
├── TECHSPEC.md
├── FRAMEWORK.md
├── STATE.md
└── BACKLOG.md
```

### 3.3 Key Boundaries & Conventions

- **HTTP client**: All API calls go through a **single callbackApi** (Axios) that attaches the Auth0 Bearer token. No raw Axios calls from screens or stores; go through the shared client.
- **Auth**: Auth0 React SDK for login/callback/logout; token is read (e.g. `useGetToken`) and set on the API client so authenticated requests succeed.
- **State**: Phase 13+: Server state (list, loading, error, refetch) via **TanStack React Query** (hooks from services); Zustand stores per resource hold a read-only mirror (items, loading, error) synced from the query in screens, so any component can read from the store; plus local UI state (e.g. dialog open, selected id). Pre-Phase 13: Zustand stores per feature held list, loading, error, refetch.
- **Centralized routes**: All paths in `src/routes.ts`. Navigation and `<Link>` use `routes.*` — never inline path strings.
- **TypeScript**: Prefer `type`; component props as `Readonly<{ … }>` in `types.ts`.
- **Error + retry**: Every user-facing error state must include a **retry CTA** that calls refetch (query client or store) or re-invokes the request.
- **Virtualization**: Large lists (categories, and later subcategories/transactions) use @tanstack/react-virtual so only visible rows are rendered. Table layout (grid columns) and min height for tbody are defined so rows stay at the top when there are few items.

### 3.4 Screens & Navigation

| Screen        | Route / path      | Purpose                                      |
| ------------- | ----------------- | -------------------------------------------- |
| **Login**    | `routes.auth.login`    | Auth0 login redirect.                        |
| **Callback** | `routes.auth.callback` | Auth0 callback; then redirect to app.        |
| **Home**     | `routes.home`         | Dashboard: cumulative balance, month balance (month+year selector), due periodic expenses for selected month; loading/error + retry (Phases 18–24). |
| **Categories** | `routes.categories`  | List in virtualized table; filter by type (income/expense); loading/error/empty + retry; CRUD dialogs. |
| **Subcategories** | `routes.subcategories` | List in virtualized table; filter by type and category; periodic expense fields (is_periodic, due_day) in form and list; CRUD dialogs. |
| **Transactions** | `routes.transactions` | List in virtualized table; default filter current month (year+month); filter by date tree, subcategory, hangout; sort by date (newest first). Button + Menu: “Transaction” (single form dialog), “Bulk” (bulk dialog). CRUD + bulk (Phases 18–24). |
| **Hangouts** | `routes.hangouts` | List in virtualized table; CRUD dialogs. Table action colors aligned with other tables (primary/error). |
| **Transaction manager** | (e.g. under Transactions or dedicated route) | Import: paste sheet data → preview → bulk create; Export: date-filtered CSV download (Phases 22–23). |

All paths are defined in `src/routes.ts`.

### 3.5 Form Validation

- When forms are added (e.g. Category create/edit), use **Zod** for schema validation. Display inline errors per field; submit only when valid.
- (No form screens in current scope; this section reserved for future CRUD forms.)

### 3.6 Complexity Exceptions

None for current scope. Document any exception and rationale here if added later.

### 3.7 UI/UX Design Guidelines

> For the general principles template, see **FRAMEWORK.md §8**. What follows is the filled-in version for Streetrack.

#### Style reference

> Clean, dark personal-finance web app — dark gray backgrounds (e.g. gray-800/900), high-contrast light text (gray-100), MUI components with Tailwind for spacing and semantic colors. Primary actions use a clear accent (e.g. indigo or primary); success/error/warning use distinct chips or badges (e.g. green/red for income/expense). Tables are grid-based, compact, with sticky header and virtualized body. Minimal shadows; emphasis on readability and density for data-heavy screens.

#### Design tokens

All tokens live in a **centralized** place: **`src/theme/tailwind.ts`** (and Tailwind config) for colors/spacing. Use the **`twColor(color, shade)`** helper in MUI `sx` so Tailwind theme values (e.g. `var(--color-gray-800)`) are used consistently. No hardcoded hex or pixel values in components; use theme or a shared spacing scale.

Required token categories (derive from Tailwind palette and style reference):

| Category                | Purpose                               |
| ----------------------- | ------------------------------------- |
| Background              | Screen-level fill (e.g. gray-900)     |
| Card / Surface          | Table, cards (e.g. gray-800)          |
| Primary                 | CTAs, links, focus                    |
| Success / Error / Warning | Income/expense chips, alerts, retry |
| Text primary / secondary | Headers vs metadata                 |
| Border                  | Dividers, table borders (e.g. gray-600) |
| Disabled                | Inactive controls                     |
| Status-specific         | Income (green) / Expense (red) pills  |

#### Spacing and layout system

Use a small spacing scale (4, 8, 12, 16, 24, 40) consistently: screen padding, table cell padding, gaps between sections, bottom padding on scroll areas.

#### Component patterns

- **Virtualized table**: Sticky header row; tbody height at least viewport so few rows stay at top; grid columns for name, description, type (income/expense), actions. Loading: spinner in tbody; error: message + retry button; empty: “No categories found.”
- **Status badge / pill**: Income vs Expense chips with distinct bg+text (e.g. green-700 / red-700 with light text).
- **Primary / secondary buttons**: MUI Button; primary for main CTAs, outline for cancel/secondary. Retry CTA must be clearly actionable.
- **List card / row**: Table rows with hover state; compact padding; truncation for long text (e.g. description) with tooltip if needed.

#### Interaction and feedback

- **Loading**: Spinner (e.g. MUI CircularProgress) in primary or neutral color while fetching.
- **Error recovery**: Error state always includes a **retry CTA** that calls the store’s refetch or re-invokes the request (per §3.3).
- **Keyboard / focus**: Focusable elements reachable and visible; table and buttons work with keyboard where applicable.

#### Icons

Use **one icon library** consistently (e.g. MUI Icons — `@mui/icons-material`). Same set across layout nav, table actions, dialogs, and future screens.

#### Accessibility

- Sufficient contrast (WCAG AA) for text and controls.
- Status (e.g. income/expense) not conveyed by color alone — pair with icon or text.
- Interactive elements have clear focus and labels.

---

## 4. Data & APIs

**Source of truth:** Backend API is described by **OpenAPI 3.1** at `GET {BASE_URL}/openapi.json` when the backend is running. Frontend types in `src/services/<resource>/types.ts` must match these schemas. Below is the **expanded** contract derived from that spec.

### 4.1 Data Model (core entities)

All resources are **user-scoped**; `user_id` is set from the Auth0 token on the backend and may appear in Read schemas. IDs are UUIDs.

#### Category

| Schema | Fields | Notes |
|--------|--------|--------|
| **CategoryRead** | `id` (uuid), `name` (string), `description` (string \| null), `is_income` (boolean, default false), `user_id` (string \| null) | Returned by list and get/create/update. |
| **CategoryCreate** | `name` (string, required), `description` (string \| null), `is_income` (boolean, default false) | Body for POST. user_id from token. |
| **CategoryUpdate** | `name` (string \| null), `description` (string \| null), `is_income` (boolean \| null) | Body for PATCH; all optional. |

#### Subcategory

| Schema | Fields | Notes |
|--------|--------|--------|
| **SubcategoryRead** | `id`, `category_id` (uuid), `category_name` (string, from BE for list display), `name`, `description` (string \| null), `belongs_to_income` (boolean, default false), `is_periodic` (boolean, default false), `due_day` (number \| null), `user_id` (string \| null) | Belongs to a category; backend checks category ownership. Periodic expenses: `due_day` (1–31) required when `is_periodic` is true. |
| **SubcategoryCreate** | `category_id` (uuid, required), `name` (required), `description` (string \| null), `belongs_to_income` (boolean, default false), `is_periodic` (boolean, default false), `due_day` (number \| null) | user_id from token; `due_day` required when `is_periodic=true`. |
| **SubcategoryUpdate** | `category_id`, `name`, `description`, `belongs_to_income`, `is_periodic`, `due_day` (all optional) | PATCH body. |

#### Transaction

| Schema | Fields | Notes |
|--------|--------|--------|
| **TransactionRead** | `id`, `subcategory_id` (uuid), `subcategory_name` (string, from BE for list display), `value` (integer), `description` (string), `date` (date string), `hangout_id` (uuid \| null), `hangout_name` (string \| null, from BE for list display), `user_id` (string \| null) | Links to subcategory and optionally to a hangout. GET list/single returns IDs (for operations) and names (for display). |
| **TransactionCreate** | `subcategory_id` (uuid, required), `value` (integer, required), `description` (string, required), `date` (date, required), `hangout_id` (uuid \| null) | |
| **TransactionUpdate** | `subcategory_id`, `value`, `description`, `date`, `hangout_id` (all optional) | PATCH body. |
| **TransactionBulkCreate** | Normalized tree: category → subcategory → hangout → transaction items (per BE contract). | Body for POST `/transactions/bulk`; response 201: TransactionRead[]. |

#### Dashboard (Home)

| Schema | Fields | Notes |
|--------|--------|--------|
| **DashboardBalanceRead** | Cumulative balance (structure per BE OpenAPI). | GET `/dashboard/balance`. |
| **DashboardMonthBalanceRead** | Balance for a given month (structure per BE OpenAPI). | GET `/dashboard/month-balance?year=&month=`. |
| **DashboardDuePeriodicExpenseRead** | Due periodic expense item for selected month (structure per BE OpenAPI). | GET `/dashboard/due-periodic-expenses?year=&month=` → array. |

#### Transaction manager

| Schema | Purpose |
|--------|--------|
| **TransactionImportRequest** | Body for POST `/transaction-manager/import` (e.g. pasted sheet rows, format per BE). |
| **TransactionImportPreview** | Response: payload ready for POST `/transactions/bulk` or validation errors. |

#### Hangout

| Schema | Fields | Notes |
|--------|--------|--------|
| **HangoutRead** | `id`, `name`, `description` (string \| null), `date` (date string), `user_id` (string \| null) | User-scoped. |
| **HangoutCreate** | `name` (required), `date` (date, required), `description` (string \| null) | |
| **HangoutUpdate** | `name`, `date`, `description` (all optional) | PATCH body. |

#### Common error shapes

| Schema | Purpose |
|--------|--------|
| **HTTPValidationError** | `422` body: `{ detail: ValidationError[] }`. |
| **ValidationError** | `loc` (array), `msg` (string), `type` (string); optional `input`, `ctx`. |

Frontend types live in `src/services/<resource>/types.ts` (e.g. `categories/types.ts`). Export Read/Create/Update types and **list response types** as **`PaginatedRead<ResourceRead>`** (shared generic in `src/services/types.ts`: `items`, `total`, `skip`, `limit`, `has_more`, `next_skip`) so they match OpenAPI `PaginatedRead_*` schemas — not a bare array.

### 4.2 Storage

| Concern           | Choice      | Notes                                      |
| ----------------- | ----------- | ------------------------------------------ |
| **Feature state** | **Zustand** (Phase 13+: global read mirror + UI) | Per-module; after Phase 13, server state in React Query; Zustand holds mirror (items, loading, error) synced from query for global read access, plus dialog open, selection, etc. After Phase **25**, list mirrors hold **`items` for the current list page only** (paginated API); do not assume the full collection is in the store. |
| **Server state**  | Backend + **React Query** (Phase 13+) | No offline DB in frontend; React Query caches and refetches; refetch on load/retry. |
| **Session**       | Auth0 + localStorage | Persist auth so refresh doesn’t flash login. |

### 4.3 APIs & Contracts

- **Backend**: **streetrack-be** (FastAPI). Base URL from env (e.g. `VITE_API_URL`). **OpenAPI spec**: `GET {BASE_URL}/openapi.json` (expand $refs for full contracts). All authenticated endpoints require **HTTPBearer** (Auth0 JWT).
- **Unsecured**: `GET /` (root), `GET /health` — no Bearer.
- **Error handling**: On 4xx/5xx or network failure, surface in UI with **retry CTA** (refetch or re-call). On 422, parse `detail[]` (ValidationError) for inline field errors in forms.

#### Endpoints (expanded from OpenAPI)

**Paginated list responses:** `GET /categories/`, `GET /subcategories/`, `GET /transactions/`, and `GET /hangouts/` return **200** with body **`PaginatedRead<T>`**: `items` (array of `T`), `total`, `skip`, `limit`, `has_more`, `next_skip`. The frontend implements **classic pagination** (MUI `TablePagination`) using `total` and request `skip`/`limit` only — not infinite scroll via `next_skip` (Phases 25–26).

List endpoints accept optional **`?skip`** and **`?limit`** (query; defaults 0 and 50). Filter/sort params below apply per OpenAPI. All IDs in paths are UUIDs.

| Method | Path | Request | Response | Errors |
|--------|------|---------|----------|--------|
| **Categories** |
| GET | `/categories/` | query: skip?, limit?, is_income?, name? (icontains) | 200: PaginatedRead&lt;CategoryRead&gt; | 401, 422 |
| POST | `/categories/` | body: CategoryCreate | 201: CategoryRead | 401, 422 |
| GET | `/categories/{category_id}` | path: category_id | 200: CategoryRead | 401, 404 |
| PATCH | `/categories/{category_id}` | path + body: CategoryUpdate | 200: CategoryRead | 401, 404, 422 |
| DELETE | `/categories/{category_id}` | path | 204 | 401, 404 |
| **Subcategories** |
| GET | `/subcategories/` | query: skip?, limit?, belongs_to_income?, category_id?, name? (icontains) | 200: PaginatedRead&lt;SubcategoryRead&gt; (rows include `category_name`, `is_periodic`, `due_day`) | 401, 422 |
| POST | `/subcategories/` | body: SubcategoryCreate | 201: SubcategoryRead | 401, 404, 422 |
| GET | `/subcategories/{subcategory_id}` | path | 200: SubcategoryRead | 401, 404 |
| PATCH | `/subcategories/{subcategory_id}` | path + body: SubcategoryUpdate | 200: SubcategoryRead | 401, 404, 422 |
| DELETE | `/subcategories/{subcategory_id}` | path | 204 | 401, 404 |
| **Transactions** |
| GET | `/transactions/` | query: skip?, limit?, year?, month?, day?, subcategory_id?, hangout_id?; sort by date (newest first) default | 200: PaginatedRead&lt;TransactionRead&gt; (rows include `subcategory_name`, `hangout_name`) | 401, 422 |
| POST | `/transactions/` | body: TransactionCreate | 201: TransactionRead | 401, 404, 422 |
| POST | `/transactions/bulk` | body: TransactionBulkCreate | 201: TransactionRead[] | 401, 404, 422 |
| GET | `/transactions/{transaction_id}` | path | 200: TransactionRead | 401, 404 |
| PATCH | `/transactions/{transaction_id}` | path + body: TransactionUpdate | 200: TransactionRead | 401, 404, 422 |
| DELETE | `/transactions/{transaction_id}` | path | 204 | 401, 404 |
| **Hangouts** |
| GET | `/hangouts/` | query: skip?, limit?, name? (icontains) | 200: PaginatedRead&lt;HangoutRead&gt; | 401, 422 |
| POST | `/hangouts/` | body: HangoutCreate | 201: HangoutRead | 401, 422 |
| GET | `/hangouts/{hangout_id}` | path | 200: HangoutRead | 401, 404 |
| PATCH | `/hangouts/{hangout_id}` | path + body: HangoutUpdate | 200: HangoutRead | 401, 404, 422 |
| DELETE | `/hangouts/{hangout_id}` | path | 204 | 401, 404 |
| **Dashboard** |
| GET | `/dashboard/balance` | none | 200: DashboardBalanceRead | 401 |
| GET | `/dashboard/month-balance` | query: year, month | 200: DashboardMonthBalanceRead | 401, 422 |
| GET | `/dashboard/due-periodic-expenses` | query: year, month | 200: DashboardDuePeriodicExpenseRead[] | 401, 422 |
| **Transaction manager** |
| POST | `/transaction-manager/import` | body: TransactionImportRequest | 200: TransactionImportPreview | 401, 404, 422 |
| GET | `/transaction-manager/export` | query: year?, month?, day?, subcategory_id?, hangout_id? | 200: text/csv (oldest to newest) | 401, 422 |

Frontend service layout per resource: `src/services/<resource>/index.ts` (client functions), `types.ts` (Read/Create/Update + list response types), `constants.ts` (path strings, no leading slash). Add `dashboard` (or `home`) service for dashboard endpoints; transaction-manager for import/export (see BACKLOG §1.6 and ROADMAP Phases 18–24).

### 4.4 Authentication & Authorization

- **Mechanism**: **Auth0** (OAuth2 / OIDC). Login redirect, callback, logout; React SDK wraps the app.
- **Token**: Obtained after login; attached to every API request via the shared callbackApi client. Token refresh handled by Auth0 SDK.
- **Protected routes**: Routes under the app shell require authenticated user; otherwise redirect to login.
- **Scopes/roles**: Not used in v1; backend validates JWT and user_id.

---

## 5. Non-Functional Requirements

### 5.1 Performance

- **Virtualization**: Categories list (and future large lists) use @tanstack/react-virtual so only visible rows render. Table tbody height uses CSS grid (e.g. min height from container) so few rows stay at top.
- List and navigation should feel responsive; no jank on scroll or route change.

### 5.2 Security

- **Token**: Never log or expose the JWT in client code. Store only in memory or Auth0-managed storage.
- **API**: All requests to backend are authenticated; no sensitive data in URL or client-side only.

### 5.3 Accessibility

- Contrast and focus per §3.7. Status not by color alone. Interactive elements labeled.

### 5.4 Observability

- **Logging**: Errors only; optional minimal debug gated by env. No PII in logs.
- **Monitoring**: Optional; not required for v1.

---

## 6. Testing Strategy

### 6.1 Test Pyramid

| Level           | Tool              | Scope                                                                 |
| --------------- | ----------------- | --------------------------------------------------------------------- |
| **Unit**        | Jest (or Vitest)  | Stores, utils, services (with mocked Axios or MSW).                   |
| **Integration** | React Testing Library | Screens and flows: auth redirect, categories list (loading/success/error/empty, retry). Mock API. |
| **E2E / manual** | Optional          | Manual UAT in browser.                                                |

- **API mocking**: Use **MSW** (or mocked Axios) in tests so no real backend is called. Response shapes must match `src/services/*/types.ts`.
- **Coverage**: Must cover all cases listed in §1.3 that apply to the phase. Before closing a test phase, map each §1.3 case to a test file/describe block.

### 6.2 Coverage & Gates

- **Minimum coverage**: Target **80%** for code touched by the phase (or overall, as decided per phase). Verify with `npm test -- --coverage` (or equivalent). Gate before merge.
- **Gate command**: `npm test && npx biome check .` must pass **before every commit** on the phase branch.

### 6.3 Verification (GSD goal-backward)

- Auth and categories list behavior from §1.2 and §1.3 are covered by tests.
- Test run is repeatable and documented in README.

### 6.4 Test Setup Notes

- Test files can live next to source (`*.test.tsx`) or under `__tests__/`; ensure the bundler does not include test files in the production build.
- If using MSW: run only in Node (Jest) environment; do not start MSW in the production app bundle.
- Pin test deps (e.g. testing-library, jest) to exact versions to avoid flakiness.

#### Auth0 and provider wrapper (Vitest)

- **setupTests.ts** mocks `@auth0/auth0-react` so that `useAuth0()` returns `React.useContext(Auth0MockContext)`. All tests therefore resolve Auth0 from the same mock context.
- **Auth0MockContext** and **Auth0MockProvider** live in `src/utils/test/auth0MockContext.tsx`. The default mock is a logged-in user (`isAuthenticated: true`, `getAccessTokenSilently` resolves a token). Override by wrapping with `<Auth0MockProvider value={{ isAuthenticated: false }}>` (or other partial overrides).
- **ProviderWrapper** (`src/utils/test/provider/index.tsx`) wraps the tree with `QueryClientProvider` and `Auth0MockProvider`. Use it as the `wrapper` in `render()` or `renderHook()` for any test that needs API calls (e.g. screens, hooks that use callbackApi). This keeps a consistent authenticated context and avoids per-test Auth0 setup.

---

## 7. Deployment & Environment

### 7.1 Environments

| Env     | Purpose      | Config / URL                          |
| ------- | ------------ | ------------------------------------- |
| **Local** | Development | `npm run dev`; Rsbuild dev server.    |
| **Build** | Production   | `npm run build`; output in `dist/` (or as configured). |
| **Preview** | Local prod  | `npm run preview` to serve build.     |

### 7.2 Build & Release

- **Dev**: `npm run dev` (Rsbuild dev, open browser).
- **Build**: `npm run build`.
- **Preview**: `npm run preview`.
- **CI**: Run `npm test` and `npx biome check .` on push/PR.

### 7.3 Environment Variables & Secrets

- **Auth0**: Domain, client ID (and callback URL) for Auth0 React SDK. Typically from `VITE_*` or `import.meta.env` (Rsbuild).
- **API**: Backend base URL (e.g. `VITE_API_URL`). No secrets in frontend; token is obtained at runtime from Auth0.

---

## 8. GSD Integration Notes

### 8.1 Phase → TECHSPEC Mapping

| Phase (example from ROADMAP)     | Primary TECHSPEC sections    |
| -------------------------------- | ---------------------------- |
| Foundation (scaffold, deps, auth) | §2, §3.2, §3.3, §4.4         |
| Layout & routing                 | §3.2, §3.4, routes.ts        |
| Categories list + API + store    | §3.1, §3.4, §4.1, §4.3       |
| Virtualized table + loading/error/retry | §3.3, §3.7, §5.1      |
| Tests & verification             | §1.3, §6                     |

(Actual phases come from `.planning/phase-00-ROADMAP.md` generated at bootstrap.)

### 8.2 Plan Constraints for Agents

- All app source under **`src/`**; root for config and docs.
- All API calls through the **shared callbackApi** with Bearer token.
- **Centralized routes**: use `src/routes.ts` only; no hardcoded paths.
- **TypeScript**: `type` over `interface`; props as `Readonly<{ … }>`.
- **Error states**: always include a **retry CTA** (refetch or re-invoke).
- **Spec-first**: Create and commit `.planning/phase-NN-SPEC.md` **before** implementation. No code without a committed spec.
- **Pre-flight checklist**: At phase start, agent prints phase name, branch name, spec file, gate command and **waits for user confirmation** before coding.
- **Gitflow**: Feature branch from `main`; merge at phase end. Phase not done until branch is merged.
- **Lint gate per commit**: `npm test && npx biome check .` must pass before every commit on the phase branch.

### 8.3 Definition of Done (per phase)

- Code matches the phase spec (spec committed before implementation).
- All §1.3 test cases that apply to the phase are covered; mapping table produced for test phases.
- README documents how to run app and tests.
- **Gitflow complete**: Phase branch merged into `main`.
- **Lint gate**: Passed before every commit.
- **Phase SUMMARY**: `.planning/phase-NN-SUMMARY.md` committed before merge; no phase complete without it.

---

## Changelog

| Date       | Change |
| ---------- | ------ |
| 2026-03-09 | **Finance stream (Phases 18–24):** §4.1 Subcategory: added `is_periodic`, `due_day`; Transaction: added TransactionBulkCreate; new Dashboard and Transaction manager DTOs. §4.3: list filters (categories is_income; subcategories belongs_to_income, category_id; transactions year, month, day, subcategory_id, hangout_id; sort newest first); POST /transactions/bulk; GET dashboard/balance, month-balance, due-periodic-expenses; POST /transaction-manager/import, GET /transaction-manager/export. §3.4: Screens table expanded (Home dashboard, Categories/Subcategories/Transactions filters and behaviour, Hangouts actions, Transaction manager). Aligned with ROADMAP and BE_TECHSPEC. |
| 2026-02-26 | TECHSPEC rewritten for Streetrack (frontend): §1 Problem & Context (personal finance, categories, Auth0, virtualized list). §2 Web stack (React, Rsbuild, Auth0, Zustand, TanStack Table/Virtual, MUI, Tailwind, Biome). §3 Architecture (SPA, modules, services, theme, routes). §3.7 UI/UX (dark fintech style, tokens, table patterns, retry CTA). §4 Data & APIs (Category, backend, Auth0). §5–§8 NFRs, testing, deployment, GSD integration. Aligned with FRAMEWORK.md and BACKLOG.md. |
| 2026-03-03 | **Phases 13–16**: §2.2 added @tanstack/react-query (Phase 13). §2.4, §3.3, §4.2 updated for React Query as server state (Phase 13+), Zustand as global read mirror synced from query + UI state; retry CTA may call query client refetch. ROADMAP and BACKLOG extended with Phase 13 (React Query services), 14 (Theme, layout & Categories table), 15 (Remaining screens & CRUD on shadcn), 16 (Tests & coverage gate). |
| 2026-03-03 | **Phase 13 follow-up**: Zustand stores re-added as global read layer; §2.2, §2.4, §3.1, §3.3, §4.2 updated to describe mirror (items, loading, error) synced from React Query in screens. Phase 13 SPEC and SUMMARY updated accordingly. |
| 2026-02-26 | **§1.6 BACKLOG alignment**: Added subsection summarizing BACKLOG.md (Done / High / Medium / Later) and mapping to TECHSPEC sections and phases; noted skip/limit support for list endpoints. **§4 expanded from OpenAPI**: §4.1 full data model for Category, Subcategory, Transaction, Hangout (Read/Create/Update schemas) and HTTPValidationError/ValidationError; §4.3 full endpoint table (method, path, request, response, errors) for all four resources; OpenAPI source of truth at `GET {BASE_URL}/openapi.json`. |
