import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CategoryRead } from '../../services/categories/types';
import { useCategoriesStore } from './store';

vi.mock('../../services/categories', () => ({
  fetchCategories: vi.fn(),
}));

import { fetchCategories as fetchCategoriesApi } from '../../services/categories';

describe('useCategoriesStore', () => {
  beforeEach(() => {
    vi.mocked(fetchCategoriesApi).mockReset();
    useCategoriesStore.setState({
      items: [],
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading true then items and loading false on success', async () => {
    const items: CategoryRead[] = [
      {
        id: '1',
        name: 'Food',
        description: 'Groceries',
        is_income: false,
        user_id: 'u1',
      },
    ];
    vi.mocked(fetchCategoriesApi).mockResolvedValue(items);

    await useCategoriesStore.getState().fetchCategories();

    expect(fetchCategoriesApi).toHaveBeenCalledWith(undefined);
    expect(useCategoriesStore.getState()).toMatchObject({
      items,
      loading: false,
      error: null,
    });
  });

  it('sets loading true then error and loading false on API failure', async () => {
    vi.mocked(fetchCategoriesApi).mockRejectedValue(new Error('Network error'));

    await useCategoriesStore.getState().fetchCategories();

    expect(useCategoriesStore.getState()).toMatchObject({
      items: [],
      loading: false,
      error: 'Network error',
    });
  });

  it('uses generic message when error is not an Error instance', async () => {
    vi.mocked(fetchCategoriesApi).mockRejectedValue('string error');

    await useCategoriesStore.getState().fetchCategories();

    expect(useCategoriesStore.getState().error).toBe(
      'Failed to load categories',
    );
  });

  it('passes skip and limit to API when provided', async () => {
    vi.mocked(fetchCategoriesApi).mockResolvedValue([]);

    await useCategoriesStore.getState().fetchCategories({
      skip: 10,
      limit: 20,
    });

    expect(fetchCategoriesApi).toHaveBeenCalledWith({ skip: 10, limit: 20 });
  });
});
