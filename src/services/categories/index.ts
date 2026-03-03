import { callbackApi } from '../../utils/callbackApi';
import { categoriesPaths } from './constants';
import type {
  CategoryCreate,
  CategoryRead,
  CategoryUpdate,
  GetCategoriesResponse,
} from './types';

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 50;

/**
 * Fetch categories list from the backend. Uses callbackApi (Bearer token attached by interceptor).
 * TECHSPEC §4.3: skip and limit optional; defaults 0, 50.
 */
export async function fetchCategories(options?: {
  skip?: number;
  limit?: number;
}): Promise<CategoryRead[]> {
  const skip = options?.skip ?? DEFAULT_SKIP;
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const { data } = await callbackApi.get<GetCategoriesResponse>(
    categoriesPaths.list,
    { params: { skip, limit } },
  );
  return data;
}

/**
 * Create a category. POST /categories/; returns created CategoryRead (201).
 */
export async function createCategory(
  body: CategoryCreate,
): Promise<CategoryRead> {
  const { data } = await callbackApi.post<CategoryRead>(
    categoriesPaths.list,
    body,
  );
  return data;
}

/**
 * Get a single category by id. GET /categories/{id}.
 */
export async function getCategory(id: string): Promise<CategoryRead> {
  const { data } = await callbackApi.get<CategoryRead>(categoriesPaths.get(id));
  return data;
}

/**
 * Update a category. PATCH /categories/{id}; returns updated CategoryRead (200).
 */
export async function updateCategory(
  id: string,
  body: CategoryUpdate,
): Promise<CategoryRead> {
  const { data } = await callbackApi.patch<CategoryRead>(
    categoriesPaths.update(id),
    body,
  );
  return data;
}

/**
 * Delete a category. DELETE /categories/{id}; 204 no content.
 */
export async function deleteCategory(id: string): Promise<void> {
  await callbackApi.delete(categoriesPaths.delete(id));
}
