import { create } from 'zustand';
import {
  createSubcategory as createSubcategoryApi,
  deleteSubcategory as deleteSubcategoryApi,
  fetchSubcategories as fetchSubcategoriesApi,
  updateSubcategory as updateSubcategoryApi,
} from '../../services/subcategories';
import type {
  SubcategoryCreate,
  SubcategoryRead,
  SubcategoryUpdate,
} from '../../services/subcategories/types';

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
  createSubcategory: (body: SubcategoryCreate) => Promise<void>;
  updateSubcategory: (id: string, body: SubcategoryUpdate) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;
};

export const useSubcategoriesStore = create<
  SubcategoriesState & SubcategoriesActions
>((set, get) => ({
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

  createSubcategory: async (body) => {
    set({ error: null });
    try {
      await createSubcategoryApi(body);
      await get().fetchSubcategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create subcategory';
      set({ error: message });
      throw err;
    }
  },

  updateSubcategory: async (id, body) => {
    set({ error: null });
    try {
      await updateSubcategoryApi(id, body);
      await get().fetchSubcategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update subcategory';
      set({ error: message });
      throw err;
    }
  },

  deleteSubcategory: async (id) => {
    set({ error: null });
    try {
      await deleteSubcategoryApi(id);
      await get().fetchSubcategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete subcategory';
      set({ error: message });
      throw err;
    }
  },
}));
