import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SubcategoryRead } from '../../services/subcategories/types';
import { useSubcategoriesStore } from './store';

vi.mock('../../services/subcategories', () => ({
  fetchSubcategories: vi.fn(),
  createSubcategory: vi.fn(),
  updateSubcategory: vi.fn(),
  deleteSubcategory: vi.fn(),
}));

import {
  createSubcategory as createSubcategoryApi,
  deleteSubcategory as deleteSubcategoryApi,
  fetchSubcategories as fetchSubcategoriesApi,
  updateSubcategory as updateSubcategoryApi,
} from '../../services/subcategories';

describe('useSubcategoriesStore', () => {
  beforeEach(() => {
    vi.mocked(fetchSubcategoriesApi).mockReset();
    vi.mocked(createSubcategoryApi).mockReset();
    vi.mocked(updateSubcategoryApi).mockReset();
    vi.mocked(deleteSubcategoryApi).mockReset();
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

  it('createSubcategory calls API then fetchSubcategories on success', async () => {
    vi.mocked(createSubcategoryApi).mockResolvedValue({
      id: 'new-1',
      category_id: 'cat-1',
      name: 'New',
      description: null,
      belongs_to_income: false,
      user_id: 'u1',
    });
    vi.mocked(fetchSubcategoriesApi).mockResolvedValue([]);

    await useSubcategoriesStore.getState().createSubcategory({
      category_id: 'cat-1',
      name: 'New',
      description: null,
      belongs_to_income: false,
    });

    expect(createSubcategoryApi).toHaveBeenCalledWith({
      category_id: 'cat-1',
      name: 'New',
      description: null,
      belongs_to_income: false,
    });
    expect(fetchSubcategoriesApi).toHaveBeenCalled();
  });

  it('createSubcategory sets error and rethrows on API failure', async () => {
    vi.mocked(createSubcategoryApi).mockRejectedValue(new Error('Conflict'));

    await expect(
      useSubcategoriesStore.getState().createSubcategory({
        category_id: 'cat-1',
        name: 'New',
        description: null,
        belongs_to_income: false,
      }),
    ).rejects.toThrow('Conflict');
    expect(useSubcategoriesStore.getState().error).toBe('Conflict');
  });

  it('updateSubcategory calls API then fetchSubcategories on success', async () => {
    vi.mocked(updateSubcategoryApi).mockResolvedValue({
      id: '1',
      category_id: 'cat-1',
      name: 'Updated',
      description: null,
      belongs_to_income: true,
      user_id: 'u1',
    });
    vi.mocked(fetchSubcategoriesApi).mockResolvedValue([]);

    await useSubcategoriesStore.getState().updateSubcategory('1', {
      name: 'Updated',
      belongs_to_income: true,
    });

    expect(updateSubcategoryApi).toHaveBeenCalledWith('1', {
      name: 'Updated',
      belongs_to_income: true,
    });
    expect(fetchSubcategoriesApi).toHaveBeenCalled();
  });

  it('deleteSubcategory calls API then fetchSubcategories on success', async () => {
    vi.mocked(deleteSubcategoryApi).mockResolvedValue(undefined);
    vi.mocked(fetchSubcategoriesApi).mockResolvedValue([]);

    await useSubcategoriesStore.getState().deleteSubcategory('1');

    expect(deleteSubcategoryApi).toHaveBeenCalledWith('1');
    expect(fetchSubcategoriesApi).toHaveBeenCalled();
  });
});
