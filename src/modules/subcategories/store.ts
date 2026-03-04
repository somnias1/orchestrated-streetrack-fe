import { create } from 'zustand';
import type { SubcategoryRead } from '../../services/subcategories/types';

/**
 * Global store for subcategories — synced from React Query in screens that use useSubcategoriesQuery.
 * Use this to read subcategories from anywhere. React Query remains source of truth.
 */
type SubcategoriesStore = {
  items: SubcategoryRead[];
  loading: boolean;
  error: string | null;
  setFromQuery: (
    items: SubcategoryRead[],
    loading: boolean,
    error: string | null,
  ) => void;
};

export const useSubcategoriesStore = create<SubcategoriesStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  setFromQuery: (items, loading, error) => set({ items, loading, error }),
}));
