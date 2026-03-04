/**
 * API path constants for subcategories (no leading slash; base URL from callbackApi).
 */
export const subcategoriesPaths = {
  list: 'subcategories/',
  get: (id: string) => `subcategories/${id}/`,
  update: (id: string) => `subcategories/${id}/`,
  delete: (id: string) => `subcategories/${id}/`,
} as const;
