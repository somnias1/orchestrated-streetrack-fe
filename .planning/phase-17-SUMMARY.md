# Phase 17 — Summary

**Phase 17 — List screens: category & transaction names.** Completed 2026-03-08.

## Done

- **TECHSPEC** §4.1 and §4.3 updated: `SubcategoryRead` includes `category_id` and `category_name`; `TransactionRead` includes `subcategory_id`, `subcategory_name`, `hangout_id`, and `hangout_name`. BE returns both IDs (for operations) and names (for display).
- **ROADMAP**: Phase 17 row added to `.planning/phase-00-ROADMAP.md`; phase sizing note updated.
- **phase-17-SPEC.md**: Created with goal, BE field names, scope (types, tables, MSW, tests), and DoD.
- **phase-06-SPEC.md / phase-07-SPEC.md**: Out-of-scope lines updated to reference Phase 17.
- **Types**: `SubcategoryRead` and `TransactionRead` extended with name fields; IDs retained for form prefilling and API operations.
- **Subcategories table**: "Category ID" column replaced with "Category"; displays `category_name` only (fallback "—" if missing).
- **Transactions table**: "Subcategory ID" / "Hangout ID" replaced with "Subcategory" / "Hangout"; displays `subcategory_name` and `hangout_name` only (null/missing → "—").
- **Edit flows**: Use `category_id`, `subcategory_id`, and `hangout_id` from API response for form initial values and mutations.
- **Tests**: Service and screen tests updated with name and id fields in mocks. All 71 tests pass.
- **Gate**: `npm test && npx biome check .` passes.

## Not in scope

- Hangouts list unchanged. No CRUD payload or form changes.
