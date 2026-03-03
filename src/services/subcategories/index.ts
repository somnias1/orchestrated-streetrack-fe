import { callbackApi } from '../../utils/callbackApi';
import { subcategoriesPaths } from './constants';
import type {
  GetSubcategoriesResponse,
  SubcategoryCreate,
  SubcategoryRead,
  SubcategoryUpdate,
} from './types';

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 50;

/**
 * Fetch subcategories list from the backend. Uses callbackApi (Bearer token attached by interceptor).
 * TECHSPEC §4.3: skip and limit optional; defaults 0, 50.
 */
export async function fetchSubcategories(options?: {
  skip?: number;
  limit?: number;
}): Promise<SubcategoryRead[]> {
  const skip = options?.skip ?? DEFAULT_SKIP;
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const { data } = await callbackApi.get<GetSubcategoriesResponse>(
    subcategoriesPaths.list,
    { params: { skip, limit } },
  );
  return data;
}

/**
 * Create a subcategory. POST /subcategories/; returns created SubcategoryRead (201).
 */
export async function createSubcategory(
  body: SubcategoryCreate,
): Promise<SubcategoryRead> {
  const { data } = await callbackApi.post<SubcategoryRead>(
    subcategoriesPaths.list,
    body,
  );
  return data;
}

/**
 * Get a single subcategory by id. GET /subcategories/{id}.
 */
export async function getSubcategory(id: string): Promise<SubcategoryRead> {
  const { data } = await callbackApi.get<SubcategoryRead>(
    subcategoriesPaths.get(id),
  );
  return data;
}

/**
 * Update a subcategory. PATCH /subcategories/{id}; returns updated SubcategoryRead (200).
 */
export async function updateSubcategory(
  id: string,
  body: SubcategoryUpdate,
): Promise<SubcategoryRead> {
  const { data } = await callbackApi.patch<SubcategoryRead>(
    subcategoriesPaths.update(id),
    body,
  );
  return data;
}

/**
 * Delete a subcategory. DELETE /subcategories/{id}; 204 no content.
 */
export async function deleteSubcategory(id: string): Promise<void> {
  await callbackApi.delete(subcategoriesPaths.delete(id));
}
