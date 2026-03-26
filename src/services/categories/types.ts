/**
 * Categories API types (TECHSPEC §4.1). Match backend OpenAPI schemas.
 */

import type { DefaultParams, PaginatedRead } from '../types';

export type CategoryRead = {
  id: string;
  name: string;
  description: string | null;
  is_income: boolean;
  user_id: string | null;
};

export type CategoryCreate = {
  name: string;
  description?: string | null;
  is_income?: boolean;
};

export type CategoryUpdate = {
  name?: string | null;
  description?: string | null;
  is_income?: boolean | null;
};

/** GET /categories/ response */
export type GetCategoriesResponse = PaginatedRead<CategoryRead>;

/** GET /categories/ query (TECHSPEC §4.3) */
export type CategoriesListParams = DefaultParams & {
  is_income?: boolean;
  name?: string | null;
};
