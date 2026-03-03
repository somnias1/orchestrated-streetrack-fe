import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CategoryRead } from '../../services/categories/types';
import { useCategoriesStore } from './store';

vi.mock('../../services/categories', () => ({
  fetchCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  fetchCategories as fetchCategoriesApi,
  updateCategory as updateCategoryApi,
} from '../../services/categories';

describe('useCategoriesStore', () => {
  beforeEach(() => {
    vi.mocked(fetchCategoriesApi).mockReset();
    vi.mocked(createCategoryApi).mockReset();
    vi.mocked(updateCategoryApi).mockReset();
    vi.mocked(deleteCategoryApi).mockReset();
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

  it('createCategory calls API then fetchCategories on success', async () => {
    vi.mocked(createCategoryApi).mockResolvedValue({
      id: 'new-1',
      name: 'New',
      description: null,
      is_income: false,
      user_id: 'u1',
    });
    vi.mocked(fetchCategoriesApi).mockResolvedValue([]);

    await useCategoriesStore.getState().createCategory({
      name: 'New',
      description: null,
      is_income: false,
    });

    expect(createCategoryApi).toHaveBeenCalledWith({
      name: 'New',
      description: null,
      is_income: false,
    });
    expect(fetchCategoriesApi).toHaveBeenCalled();
  });

  it('createCategory sets error and rethrows on API failure', async () => {
    vi.mocked(createCategoryApi).mockRejectedValue(new Error('Conflict'));

    await expect(
      useCategoriesStore.getState().createCategory({
        name: 'New',
        description: null,
        is_income: false,
      }),
    ).rejects.toThrow('Conflict');
    expect(useCategoriesStore.getState().error).toBe('Conflict');
  });

  it('updateCategory calls API then fetchCategories on success', async () => {
    vi.mocked(updateCategoryApi).mockResolvedValue({
      id: '1',
      name: 'Updated',
      description: null,
      is_income: true,
      user_id: 'u1',
    });
    vi.mocked(fetchCategoriesApi).mockResolvedValue([]);

    await useCategoriesStore.getState().updateCategory('1', {
      name: 'Updated',
      is_income: true,
    });

    expect(updateCategoryApi).toHaveBeenCalledWith('1', {
      name: 'Updated',
      is_income: true,
    });
    expect(fetchCategoriesApi).toHaveBeenCalled();
  });

  it('deleteCategory calls API then fetchCategories on success', async () => {
    vi.mocked(deleteCategoryApi).mockResolvedValue(undefined);
    vi.mocked(fetchCategoriesApi).mockResolvedValue([]);

    await useCategoriesStore.getState().deleteCategory('1');

    expect(deleteCategoryApi).toHaveBeenCalledWith('1');
    expect(fetchCategoriesApi).toHaveBeenCalled();
  });
});
