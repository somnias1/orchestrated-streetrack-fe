import { create } from 'zustand';
import { fetchHangouts as fetchHangoutsApi } from '../../services/hangouts';
import type { HangoutRead } from '../../services/hangouts/types';

type HangoutsState = {
  items: HangoutRead[];
  loading: boolean;
  error: string | null;
};

type HangoutsActions = {
  fetchHangouts: (options?: { skip?: number; limit?: number }) => Promise<void>;
};

export const useHangoutsStore = create<HangoutsState & HangoutsActions>(
  (set) => ({
    items: [],
    loading: false,
    error: null,

    fetchHangouts: async (options) => {
      set({ loading: true, error: null });
      try {
        const items = await fetchHangoutsApi(options);
        set({ items, loading: false, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load hangouts';
        set({ error: message, loading: false, items: [] });
      }
    },
  }),
);
