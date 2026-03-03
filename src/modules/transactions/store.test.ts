import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TransactionRead } from '../../services/transactions/types';
import { useTransactionsStore } from './store';

vi.mock('../../services/transactions', () => ({
  fetchTransactions: vi.fn(),
}));

import { fetchTransactions as fetchTransactionsApi } from '../../services/transactions';

describe('useTransactionsStore', () => {
  beforeEach(() => {
    vi.mocked(fetchTransactionsApi).mockReset();
    useTransactionsStore.setState({
      items: [],
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading true then items and loading false on success', async () => {
    const items: TransactionRead[] = [
      {
        id: '1',
        subcategory_id: 'sub-1',
        value: 500,
        description: 'Lunch',
        date: '2026-03-01',
        hangout_id: null,
        user_id: 'u1',
      },
    ];
    vi.mocked(fetchTransactionsApi).mockResolvedValue(items);

    await useTransactionsStore.getState().fetchTransactions();

    expect(fetchTransactionsApi).toHaveBeenCalledWith(undefined);
    expect(useTransactionsStore.getState()).toMatchObject({
      items,
      loading: false,
      error: null,
    });
  });

  it('sets loading true then error and loading false on API failure', async () => {
    vi.mocked(fetchTransactionsApi).mockRejectedValue(
      new Error('Network error'),
    );

    await useTransactionsStore.getState().fetchTransactions();

    expect(useTransactionsStore.getState()).toMatchObject({
      items: [],
      loading: false,
      error: 'Network error',
    });
  });

  it('uses generic message when error is not an Error instance', async () => {
    vi.mocked(fetchTransactionsApi).mockRejectedValue('string error');

    await useTransactionsStore.getState().fetchTransactions();

    expect(useTransactionsStore.getState().error).toBe(
      'Failed to load transactions',
    );
  });

  it('passes skip and limit to API when provided', async () => {
    vi.mocked(fetchTransactionsApi).mockResolvedValue([]);

    await useTransactionsStore.getState().fetchTransactions({
      skip: 10,
      limit: 20,
    });

    expect(fetchTransactionsApi).toHaveBeenCalledWith({
      skip: 10,
      limit: 20,
    });
  });
});
