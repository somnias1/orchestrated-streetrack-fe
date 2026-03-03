import { create } from 'zustand';
import {
  createHangout as createHangoutApi,
  deleteHangout as deleteHangoutApi,
  fetchHangouts as fetchHangoutsApi,
  updateHangout as updateHangoutApi,
} from '../../services/hangouts';
import type {
  HangoutCreate,
  HangoutRead,
  HangoutUpdate,
} from '../../services/hangouts/types';

type HangoutsState = {
  items: HangoutRead[];
  loading: boolean;
  error: string | null;
};

type HangoutsActions = {
  fetchHangouts: (options?: { skip?: number; limit?: number }) => Promise<void>;
  createHangout: (body: HangoutCreate) => Promise<void>;
  updateHangout: (id: string, body: HangoutUpdate) => Promise<void>;
  deleteHangout: (id: string) => Promise<void>;
};

export const useHangoutsStore = create<HangoutsState & HangoutsActions>(
  (set, get) => ({
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

    createHangout: async (body) => {
      set({ error: null });
      try {
        await createHangoutApi(body);
        await get().fetchHangouts();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create hangout';
        set({ error: message });
        throw err;
      }
    },

    updateHangout: async (id, body) => {
      set({ error: null });
      try {
        await updateHangoutApi(id, body);
        await get().fetchHangouts();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update hangout';
        set({ error: message });
        throw err;
      }
    },

    deleteHangout: async (id) => {
      set({ error: null });
      try {
        await deleteHangoutApi(id);
        await get().fetchHangouts();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to delete hangout';
        set({ error: message });
        throw err;
      }
    },
  }),
);
