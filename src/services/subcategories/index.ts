import { callbackApi } from '../../utils/callbackApi';
import { subcategoriesPaths } from './constants';
import type { GetSubcategoriesResponse, SubcategoryRead } from './types';

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
