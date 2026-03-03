import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchTransactions } from './index';

const mockGet = vi.fn();
vi.mock('../../utils/callbackApi', () => ({
  callbackApi: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe('fetchTransactions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls GET transactions with default skip and limit', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await fetchTransactions();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('transactions', {
      params: { skip: 0, limit: 50 },
    });
  });

  it('calls GET transactions with provided skip and limit', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await fetchTransactions({ skip: 10, limit: 20 });

    expect(mockGet).toHaveBeenCalledWith('transactions', {
      params: { skip: 10, limit: 20 },
    });
  });

  it('returns the response data array', async () => {
    const items = [
      {
        id: '1',
        subcategory_id: 'sub-1',
        value: 1000,
        description: 'Coffee',
        date: '2026-03-01',
        hangout_id: null,
        user_id: 'u1',
      },
    ];
    mockGet.mockResolvedValue({ data: items });

    const result = await fetchTransactions();

    expect(result).toEqual(items);
  });
});
