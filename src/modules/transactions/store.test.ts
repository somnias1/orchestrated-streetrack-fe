import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  TransactionCreate,
  TransactionRead,
  TransactionUpdate,
} from '../../services/transactions/types';
import { useTransactionsStore } from './store';

const fetchTransactionsApi = vi.fn();
const createTransactionApi = vi.fn();
const updateTransactionApi = vi.fn();
const deleteTransactionApi = vi.fn();

vi.mock('../../services/transactions', () => ({
  fetchTransactions: (...args: unknown[]) => fetchTransactionsApi(...args),
  createTransaction: (...args: unknown[]) => createTransactionApi(...args),
  updateTransaction: (...args: unknown[]) => updateTransactionApi(...args),
  deleteTransaction: (...args: unknown[]) => deleteTransactionApi(...args),
}));

describe('useTransactionsStore', () => {
  beforeEach(() => {
    fetchTransactionsApi.mockReset();
    createTransactionApi.mockReset();
    updateTransactionApi.mockReset();
    deleteTransactionApi.mockReset();
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
    fetchTransactionsApi.mockResolvedValue(items);

    await useTransactionsStore.getState().fetchTransactions();

    expect(fetchTransactionsApi).toHaveBeenCalledWith(undefined);
    expect(useTransactionsStore.getState()).toMatchObject({
      items,
      loading: false,
      error: null,
    });
  });

  it('sets loading true then error and loading false on API failure', async () => {
    fetchTransactionsApi.mockRejectedValue(new Error('Network error'));

    await useTransactionsStore.getState().fetchTransactions();

    expect(useTransactionsStore.getState()).toMatchObject({
      items: [],
      loading: false,
      error: 'Network error',
    });
  });

  it('uses generic message when error is not an Error instance', async () => {
    fetchTransactionsApi.mockRejectedValue('string error');

    await useTransactionsStore.getState().fetchTransactions();

    expect(useTransactionsStore.getState().error).toBe(
      'Failed to load transactions',
    );
  });

  it('passes skip and limit to API when provided', async () => {
    fetchTransactionsApi.mockResolvedValue([]);

    await useTransactionsStore.getState().fetchTransactions({
      skip: 10,
      limit: 20,
    });

    expect(fetchTransactionsApi).toHaveBeenCalledWith({
      skip: 10,
      limit: 20,
    });
  });

  it('createTransaction calls API then fetchTransactions on success', async () => {
    createTransactionApi.mockResolvedValue({});
    fetchTransactionsApi.mockResolvedValue([]);

    await useTransactionsStore.getState().createTransaction({
      subcategory_id: 'sub-1',
      value: 100,
      description: 'Snack',
      date: '2026-03-01',
    } as TransactionCreate);

    expect(createTransactionApi).toHaveBeenCalledWith({
      subcategory_id: 'sub-1',
      value: 100,
      description: 'Snack',
      date: '2026-03-01',
    });
    expect(fetchTransactionsApi).toHaveBeenCalled();
    expect(useTransactionsStore.getState().error).toBeNull();
  });

  it('createTransaction sets error on API failure', async () => {
    createTransactionApi.mockRejectedValue(new Error('Create failed'));

    await expect(
      useTransactionsStore.getState().createTransaction({
        subcategory_id: 'sub-1',
        value: 100,
        description: 'Snack',
        date: '2026-03-01',
      } as TransactionCreate),
    ).rejects.toThrow('Create failed');
    expect(useTransactionsStore.getState().error).toBe('Create failed');
  });

  it('updateTransaction calls API then fetchTransactions on success', async () => {
    updateTransactionApi.mockResolvedValue({});
    fetchTransactionsApi.mockResolvedValue([]);

    await useTransactionsStore.getState().updateTransaction('tx-1', {
      description: 'Updated',
    } as TransactionUpdate);

    expect(updateTransactionApi).toHaveBeenCalledWith('tx-1', {
      description: 'Updated',
    });
    expect(fetchTransactionsApi).toHaveBeenCalled();
    expect(useTransactionsStore.getState().error).toBeNull();
  });

  it('updateTransaction sets error on API failure', async () => {
    updateTransactionApi.mockRejectedValue(new Error('Update failed'));

    await expect(
      useTransactionsStore.getState().updateTransaction('tx-1', {}),
    ).rejects.toThrow('Update failed');
    expect(useTransactionsStore.getState().error).toBe('Update failed');
  });

  it('deleteTransaction calls API then fetchTransactions on success', async () => {
    deleteTransactionApi.mockResolvedValue(undefined);
    fetchTransactionsApi.mockResolvedValue([]);

    await useTransactionsStore.getState().deleteTransaction('tx-1');

    expect(deleteTransactionApi).toHaveBeenCalledWith('tx-1');
    expect(fetchTransactionsApi).toHaveBeenCalled();
    expect(useTransactionsStore.getState().error).toBeNull();
  });

  it('deleteTransaction sets error on API failure', async () => {
    deleteTransactionApi.mockRejectedValue(new Error('Delete failed'));

    await expect(
      useTransactionsStore.getState().deleteTransaction('tx-1'),
    ).rejects.toThrow('Delete failed');
    expect(useTransactionsStore.getState().error).toBe('Delete failed');
  });
});
