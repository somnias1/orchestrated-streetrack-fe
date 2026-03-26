/**
 * Shared API types. Resource-specific types live in src/services/<resource>/types.ts.
 */

export type { HTTPValidationError, ValidationError } from './validation';

/** Paginated list envelope (OpenAPI PaginatedRead_*), TECHSPEC §4.3 */
export type PaginatedRead<T> = {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
  next_skip: number;
};

export type DefaultParams = {
  skip?: number;
  limit?: number;
};

/** Backend default page size per TECHSPEC §4.3 */
export const DEFAULT_LIST_LIMIT = 50;

/**
 * Large single-page fetch for MUI Select options until Phase 26 (Autocomplete + name search).
 */
export const PICKER_LIST_PARAMS = {
  skip: 0,
  limit: 500,
} as const satisfies DefaultParams;
