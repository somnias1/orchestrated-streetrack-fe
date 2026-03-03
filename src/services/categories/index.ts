import { callbackApi } from '../../utils/callbackApi';
import { categoriesPaths } from './constants';
import type { CategoryRead, GetCategoriesResponse } from './types';

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
