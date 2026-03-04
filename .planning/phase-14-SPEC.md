# Phase 14 — Theme, Layout & Categories Table Alignment

**Goal:** Introduce tweakcn-style theme, light/dark toggle, layout shell, table state alignment on Categories list.

**Key TECHSPEC:** §3.2 (Project structure), §3.4 (Screens & navigation), §3.7 (UI/UX design guidelines), §5.1 (Performance / virtualization).

**Depends on:** Phase 13 (React Query services).

---

## 1. Tweakcn-style theme (§3.7)

- **CSS variables:** Define semantic design tokens as CSS custom properties (e.g. `--background`, `--foreground`, `--primary`, `--border`, `--muted`, `--card`) so components consume `var(--…)` and theme can switch by redefining those variables.
- **Centralized tokens:** Keep `src/theme/tailwind.ts` as the single place for token names and helpers; add a theme layer that maps light/dark palettes to the same variable names (tweakcn-style: one set of names, two value sets).
- **Tailwind alignment:** Ensure Tailwind theme (if used for CSS) or a small global CSS layer defines the variables; MUI `sx` and existing `themeTokens` / `twColor` continue to be used, with token values resolving from CSS variables where appropriate so light/dark swap works everywhere.

## 2. Light/dark toggle (§3.4, §3.7)

- **Toggle control:** Add a theme-mode toggle (e.g. light/dark) in the layout shell (e.g. in the app bar) that switches the active palette.
- **Persistence:** Persist user preference (e.g. `localStorage` key such as `theme-mode`) so the choice survives refresh.
- **Application:** Apply mode via a class or attribute on a root element (e.g. `data-theme="light"` or `data-theme="dark"` on `#root` or `html`) so CSS variable selectors can switch values. Default to dark to match current style reference (§3.7).

## 3. Layout shell (§3.2, §3.4)

- **Shell structure:** Layout remains the single shell for protected routes (AppBar, nav links, main content area). Ensure the shell uses the centralized theme tokens (or CSS variables) for background, surface, border, text, and primary so it respects light/dark.
- **Spacing:** Main content area uses the spacing scale (e.g. p: 3 or equivalent) per §3.7. No structural change to routes or navigation; only styling and theme alignment.

## 4. Categories table state alignment (§3.7, §5.1)

- **Single visual block:** The Categories list table (header + body) is one consistent block: same background/surface/border from theme, same column grid for header and all body states.
- **States:** Loading, error (with retry CTA), empty, and virtualized rows all use the same column widths / grid template so that when switching between states there is no layout shift. Table body container has a minimum height so that few rows still sit at the top (§5.1).
- **Tokens:** Table uses theme tokens (or CSS variables) for background, border, text, primary, error so it respects light/dark. No hardcoded hex/pixel for colors; use theme or spacing scale.

## 5. Out of scope (Phase 14)

- Migrating other screens (Subcategories, Transactions, Hangouts) to shadcn or new components — Phase 15.
- Adding new routes or features — only theme, layout styling, and Categories table alignment.

## 6. Definition of done

- CSS variables for semantic theme tokens; light and dark value sets; root element reflects mode.
- Toggle in layout; preference persisted; default dark.
- Layout shell and Categories table use theme variables/tokens; table states aligned (same grid, min height, retry CTA on error).
- Gate (`npm test && npx biome check .`) passes before every commit.
- No new hardcoded colors in layout or Categories table; existing contrast and accessibility preserved.
