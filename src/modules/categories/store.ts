import { create } from 'zustand';
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  fetchCategories as fetchCategoriesApi,
  updateCategory as updateCategoryApi,
} from '../../services/categories';
import type {
  CategoryCreate,
  CategoryRead,
  CategoryUpdate,
} from '../../services/categories/types';

type CategoriesState = {
  items: CategoryRead[];
  loading: boolean;
  error: string | null;
};

type CategoriesActions = {
  fetchCategories: (options?: {
    skip?: number;
    limit?: number;
  }) => Promise<void>;
  createCategory: (body: CategoryCreate) => Promise<void>;
  updateCategory: (id: string, body: CategoryUpdate) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoriesStore = create<CategoriesState & CategoriesActions>(
  (set, get) => ({
    items: [],
    loading: false,
    error: null,

    fetchCategories: async (options) => {
      set({ loading: true, error: null });
      try {
        const items = await fetchCategoriesApi(options);
        set({ items, loading: false, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load categories';
        set({ error: message, loading: false, items: [] });
      }
    },

    createCategory: async (body) => {
      set({ error: null });
      try {
        await createCategoryApi(body);
        await get().fetchCategories();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create category';
        set({ error: message });
        throw err;
      }
    },

    updateCategory: async (id, body) => {
      set({ error: null });
      try {
        await updateCategoryApi(id, body);
        await get().fetchCategories();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update category';
        set({ error: message });
        throw err;
      }
    },

    deleteCategory: async (id) => {
      set({ error: null });
      try {
        await deleteCategoryApi(id);
        await get().fetchCategories();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to delete category';
        set({ error: message });
        throw err;
      }
    },
  }),
);
