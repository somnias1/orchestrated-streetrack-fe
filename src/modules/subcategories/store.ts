import { create } from 'zustand';
import { fetchSubcategories as fetchSubcategoriesApi } from '../../services/subcategories';
import type { SubcategoryRead } from '../../services/subcategories/types';

type SubcategoriesState = {
  items: SubcategoryRead[];
  loading: boolean;
  error: string | null;
};

type SubcategoriesActions = {
  fetchSubcategories: (options?: {
    skip?: number;
    limit?: number;
  }) => Promise<void>;
};

export const useSubcategoriesStore = create<
  SubcategoriesState & SubcategoriesActions
>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchSubcategories: async (options) => {
    set({ loading: true, error: null });
    try {
      const items = await fetchSubcategoriesApi(options);
      set({ items, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load subcategories';
      set({ error: message, loading: false, items: [] });
    }
  },
}));
