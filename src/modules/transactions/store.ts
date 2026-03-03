import { create } from 'zustand';
import {
  createTransaction as createTransactionApi,
  deleteTransaction as deleteTransactionApi,
  fetchTransactions as fetchTransactionsApi,
  updateTransaction as updateTransactionApi,
} from '../../services/transactions';
import type {
  TransactionCreate,
  TransactionRead,
  TransactionUpdate,
} from '../../services/transactions/types';

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
  createTransaction: (body: TransactionCreate) => Promise<void>;
  updateTransaction: (id: string, body: TransactionUpdate) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

export const useTransactionsStore = create<
  TransactionsState & TransactionsActions
>((set, get) => ({
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

  createTransaction: async (body) => {
    set({ error: null });
    try {
      await createTransactionApi(body);
      await get().fetchTransactions();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create transaction';
      set({ error: message });
      throw err;
    }
  },

  updateTransaction: async (id, body) => {
    set({ error: null });
    try {
      await updateTransactionApi(id, body);
      await get().fetchTransactions();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update transaction';
      set({ error: message });
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    set({ error: null });
    try {
      await deleteTransactionApi(id);
      await get().fetchTransactions();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete transaction';
      set({ error: message });
      throw err;
    }
  },
}));
