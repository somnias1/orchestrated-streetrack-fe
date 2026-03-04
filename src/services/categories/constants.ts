/**
 * API path constants for categories (no leading slash; base URL from callbackApi).
 */
export const categoriesPaths = {
  list: 'categories/',
  get: (id: string) => `categories/${id}/`,
  update: (id: string) => `categories/${id}/`,
  delete: (id: string) => `categories/${id}/`,
} as const;
