/**
 * API path constants for categories (no leading slash; base URL from callbackApi).
 */

export const categoriesQueryKey = 'categories';
export const categoriesPath = 'categories/' as const;

export const categoriesPaths = {
  list: categoriesPath,
  get: (id: string) => `${categoriesPath}${id}/`,
  update: (id: string) => `${categoriesPath}${id}/`,
  delete: (id: string) => `${categoriesPath}${id}`,
} as const;
