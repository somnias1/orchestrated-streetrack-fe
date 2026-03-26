import type { PaginatedRead } from './types';

/** Build a PaginatedRead for tests/MSW; totals match a full collection of `total` rows. */
export function toPaginatedRead<T>(
  items: T[],
  options?: {
    total?: number;
    skip?: number;
    limit?: number;
  },
): PaginatedRead<T> {
  const skip = options?.skip ?? 0;
  const limit = options?.limit ?? items.length;
  const total = options?.total ?? items.length;
  const end = skip + items.length;
  return {
    items,
    total,
    skip,
    limit,
    has_more: end < total,
    next_skip: end < total ? skip + limit : skip,
  };
}
