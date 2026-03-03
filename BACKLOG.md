# Streetrack – Full-stack backlog

Single backlog for **streetrack-be** (backend) and **streetrack-fe** (frontend). Move items to **Done** as you complete them. Priorities: **virtualization** and **unit tests** first; **import/export** last.

---

## Done

### Backend (streetrack-be)

- [x] FastAPI app, CORS, health/root
- [x] PostgreSQL + Alembic migrations, UUID/user_id schema
- [x] Auth0 JWT validation, `CurrentUserId` dependency
- [x] CRUD for Categories (user-scoped)
- [x] CRUD for Subcategories (user-scoped, category ownership check)
- [x] CRUD for Transactions (user-scoped, subcategory/hangout ownership check)
- [x] CRUD for Hangouts (user-scoped)
- [x] Pydantic schemas (Create/Update/Read) for all resources
- [x] `.env.example` and config (DB, Auth0, CORS)
- [x] Optional `description` on Category and Subcategory (models, schemas, services, routers, migration)

### Frontend (streetrack-fe)

- [x] Auth0: login, callback, logout, protected routes, token in API client
- [x] Session persistence (localStorage cache), no login flash on refresh
- [x] Layout with navigation (Home, Categories)
- [x] Home and basic routing
- [x] Categories: list view, API service, store (Zustand), “About” dialog
- [x] Categories list: virtualized table (@tanstack/react-virtual), grid layout, loading/error/empty states
- [x] API client with Bearer token (callbackApi)
- [x] Tailwind + MUI, theme helper for Tailwind colors in `sx`

---

## High priority

### Backend

- [ ] **Unit tests**
  - [ ] Auth: JWT validation, `get_current_user_id` (valid / invalid / missing token)
  - [ ] Services: CategoryService CRUD (user scoping, 404 for wrong user)
  - [ ] Services: SubcategoryService (category ownership)
  - [ ] Services: TransactionService (subcategory/hangout ownership)
  - [ ] Services: HangoutService CRUD
  - [ ] Routers: at least one endpoint per resource (list, get, create) with mocked DB + auth
  - [ ] Optional: integration tests (test client + DB or in-memory SQLite)

### Frontend

- [ ] **Virtualization (performance for large lists)**
  - [ ] **Subcategories list**: virtual list wherever many subcategories are shown (per category or global).
  - [ ] **Transactions list**: virtual list for main transactions view (likely largest dataset).
  - [ ] Optional: use backend `skip`/`limit` for cursor- or page-based “load more” (or total count) if you prefer windowed fetch over “fetch all + virtualize DOM”.
  - [ ] Keep scroll position and focus (keyboard, a11y) usable.
- [ ] **Unit tests**
  - [ ] Components (e.g. category list, transaction form when it exists)
  - [ ] API client / hooks (mocked backend)
  - [ ] Auth flow (login, token, logout) if applicable

---

## Medium priority

### Backend

- [ ] Pagination metadata (e.g. total count, next/prev) for list endpoints if needed
- [ ] Consistent validation messages and error response shape for frontend
- [ ] Optional: filtering/sorting for transactions (date, category, etc.)
- [ ] Optional: OpenAPI tags/descriptions for docs

### Frontend

- [ ] Categories: create, edit, delete (full CRUD UI)
- [ ] Subcategories: list (per category or global), create, edit, delete
- [ ] Transactions: list, create, edit, delete (link to subcategory/hangout)
- [ ] Hangouts: list, create, edit, delete
- [ ] Loading and error states across screens
- [ ] Basic navigation and layout refinements

---

## Later / Nice to have

### Backend

- [ ] **Import/export (clipboard, defined format)**
  - [ ] Define format (e.g. JSON or CSV: categories, subcategories, transactions, hangouts)
  - [ ] Export: endpoint (or action) returning current user’s data in that format (for clipboard or download)
  - [ ] Import: endpoint accepting same format; validate and create/update scoped to current user
  - [ ] Idempotency / conflict handling (by id or business key) if needed
- [ ] Rate limiting or abuse protection if needed
- [ ] Optional: audit log or “last updated” for sensitive operations

### Frontend

- [ ] **Import/export UI**
  - [ ] “Copy to clipboard” (export in defined format)
  - [ ] “Paste from clipboard” (parse and call import API)
  - [ ] Clear feedback on success and validation errors
- [ ] Reports or dashboards (e.g. spending by category, by period)
- [ ] Offline / PWA if relevant

---

## How to use this backlog

1. **Backend** repo: `streetrack-be`. **Frontend** repo: `streetrack-fe`. This same `BACKLOG.md` lives in both repos—keep them in sync when you update.
2. Move tasks from High / Medium / Later into **Done** as you complete them.
3. **Virtualization**: do early so categories, subcategories, and transactions stay smooth with large data. Backend already supports `?skip=` and `?limit=` on list endpoints.
4. **Unit tests**: add as you build (or right after). Keep “Unit tests” in High until both backend and frontend have a solid test set.
5. **Import/export**: do after core CRUD and tests. Define the format once; implement backend first, then frontend clipboard/UI.

---

_Last updated: virtualized categories table (staged). Copy to streetrack-be BACKLOG.md to keep repos in sync._
