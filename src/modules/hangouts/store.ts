import { create } from 'zustand';
import type { HangoutRead } from '../../services/hangouts/types';

/**
 * Global store for hangouts — synced from the hangouts list query (current page only).
 * React Query remains source of truth.
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
