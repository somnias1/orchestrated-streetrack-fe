import { create } from 'zustand';
import type { HangoutRead } from '../../services/hangouts/types';

/**
 * Global store for hangouts — synced from React Query in screens that use useHangoutsQuery.
 * Use this to read hangouts from anywhere. React Query remains source of truth.
 */
type HangoutsStore = {
  items: HangoutRead[];
  loading: boolean;
  error: string | null;
  setFromQuery: (
    items: HangoutRead[],
    loading: boolean,
    error: string | null,
  ) => void;
};

export const useHangoutsStore = create<HangoutsStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  setFromQuery: (items, loading, error) => set({ items, loading, error }),
}));
