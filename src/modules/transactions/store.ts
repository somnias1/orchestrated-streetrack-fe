import { create } from 'zustand';
import type { TransactionRead } from '../../services/transactions/types';

/**
 * Global store for transactions — synced from the transactions list query (current page only).
 * React Query remains source of truth.
 */
type TransactionsStore = {
  items: TransactionRead[];
  loading: boolean;
  error: string | null;
  setFromQuery: (
    items: TransactionRead[],
    loading: boolean,
    error: string | null,
  ) => void;
};

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  setFromQuery: (items, loading, error) => set({ items, loading, error }),
}));
