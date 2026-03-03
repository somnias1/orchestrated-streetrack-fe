import { create } from 'zustand';
import { fetchTransactions as fetchTransactionsApi } from '../../services/transactions';
import type { TransactionRead } from '../../services/transactions/types';

type TransactionsState = {
  items: TransactionRead[];
  loading: boolean;
  error: string | null;
};

type TransactionsActions = {
  fetchTransactions: (options?: {
    skip?: number;
    limit?: number;
  }) => Promise<void>;
};

export const useTransactionsStore = create<
  TransactionsState & TransactionsActions
>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchTransactions: async (options) => {
    set({ loading: true, error: null });
    try {
      const items = await fetchTransactionsApi(options);
      set({ items, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load transactions';
      set({ error: message, loading: false, items: [] });
    }
  },
}));
