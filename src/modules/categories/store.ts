import { create } from 'zustand';
import type { CategoryRead } from '../../services/categories/types';

/**
 * Global store for categories — synced from the categories list query (current page only).
 * React Query remains source of truth.
 */
type CategoriesStore = {
  items: CategoryRead[];
  loading: boolean;
  error: string | null;
  setFromQuery: (
    items: CategoryRead[],
    loading: boolean,
    error: string | null,
  ) => void;
};

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  setFromQuery: (items, loading, error) => set({ items, loading, error }),
}));
