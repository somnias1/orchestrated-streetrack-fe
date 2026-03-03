import { create } from 'zustand';
import { fetchCategories as fetchCategoriesApi } from '../../services/categories';
import type { CategoryRead } from '../../services/categories/types';

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
};

export const useCategoriesStore = create<CategoriesState & CategoriesActions>(
  (set) => ({
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
  }),
);
