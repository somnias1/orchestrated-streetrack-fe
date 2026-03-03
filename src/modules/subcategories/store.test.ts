import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SubcategoryRead } from '../../services/subcategories/types';
import { useSubcategoriesStore } from './store';

vi.mock('../../services/subcategories', () => ({
  fetchSubcategories: vi.fn(),
}));

import { fetchSubcategories as fetchSubcategoriesApi } from '../../services/subcategories';

describe('useSubcategoriesStore', () => {
  beforeEach(() => {
    vi.mocked(fetchSubcategoriesApi).mockReset();
    useSubcategoriesStore.setState({
      items: [],
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading true then items and loading false on success', async () => {
    const items: SubcategoryRead[] = [
      {
        id: '1',
        category_id: 'cat-1',
        name: 'Groceries',
        description: null,
        belongs_to_income: false,
        user_id: 'u1',
      },
    ];
    vi.mocked(fetchSubcategoriesApi).mockResolvedValue(items);

    await useSubcategoriesStore.getState().fetchSubcategories();

    expect(fetchSubcategoriesApi).toHaveBeenCalledWith(undefined);
    expect(useSubcategoriesStore.getState()).toMatchObject({
      items,
      loading: false,
      error: null,
    });
  });

  it('sets loading true then error and loading false on API failure', async () => {
    vi.mocked(fetchSubcategoriesApi).mockRejectedValue(
      new Error('Network error'),
    );

    await useSubcategoriesStore.getState().fetchSubcategories();

    expect(useSubcategoriesStore.getState()).toMatchObject({
      items: [],
      loading: false,
      error: 'Network error',
    });
  });

  it('uses generic message when error is not an Error instance', async () => {
    vi.mocked(fetchSubcategoriesApi).mockRejectedValue('string error');

    await useSubcategoriesStore.getState().fetchSubcategories();

    expect(useSubcategoriesStore.getState().error).toBe(
      'Failed to load subcategories',
    );
  });

  it('passes skip and limit to API when provided', async () => {
    vi.mocked(fetchSubcategoriesApi).mockResolvedValue([]);

    await useSubcategoriesStore.getState().fetchSubcategories({
      skip: 10,
      limit: 20,
    });

    expect(fetchSubcategoriesApi).toHaveBeenCalledWith({
      skip: 10,
      limit: 20,
    });
  });
});
