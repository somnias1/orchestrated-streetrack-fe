import { beforeEach, describe, expect, it, vi } from 'vitest';
import { callbackApi } from '../../utils/callbackApi';
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  getTransaction,
  updateTransaction,
} from './index';

const mockResponse = (data: unknown) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as never,
});

vi.mock('../../utils/callbackApi', () => ({
  callbackApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('fetchTransactions', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.get).mockReset();
  });

  it('calls callbackApi.get with list path and default skip/limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse([]));

    await fetchTransactions();

    expect(callbackApi.get).toHaveBeenCalledWith('transactions/', {
      params: { skip: 0, limit: 50 },
    });
  });

  it('calls callbackApi.get with custom skip and limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse([]));

    await fetchTransactions({ skip: 10, limit: 20 });

    expect(callbackApi.get).toHaveBeenCalledWith('transactions/', {
      params: { skip: 10, limit: 20 },
    });
  });

  it('returns the response data array', async () => {
    const items = [
      {
        id: '1',
        subcategory_id: 'sub-1',
        subcategory_name: 'Groceries',
        value: 1000,
        description: 'Coffee',
        date: '2026-03-01',
        hangout_id: null,
        hangout_name: null,
        user_id: 'u1',
      },
    ];
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse(items));

    const result = await fetchTransactions();

    expect(result).toEqual(items);
  });
});

describe('createTransaction', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.post).mockReset();
  });

  it('calls callbackApi.post with list path and body', async () => {
    const created = {
      id: 'new-1',
      subcategory_id: 'sub-1',
      subcategory_name: 'Groceries',
      value: 500,
      description: 'Lunch',
      date: '2026-03-01',
      hangout_id: null,
      hangout_name: null,
      user_id: 'u1',
    };
    vi.mocked(callbackApi.post).mockResolvedValue(mockResponse(created));

    const result = await createTransaction({
      subcategory_id: 'sub-1',
      value: 500,
      description: 'Lunch',
      date: '2026-03-01',
    });

    expect(callbackApi.post).toHaveBeenCalledWith('transactions/', {
      subcategory_id: 'sub-1',
      value: 500,
      description: 'Lunch',
      date: '2026-03-01',
    });
    expect(result).toEqual(created);
  });
});

describe('getTransaction', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.get).mockReset();
  });

  it('calls callbackApi.get with transaction path', async () => {
    const transaction = {
      id: '1',
      subcategory_id: 'sub-1',
      subcategory_name: 'Groceries',
      value: 1000,
      description: 'Coffee',
      date: '2026-03-01',
      hangout_id: null,
      hangout_name: null,
      user_id: 'u1',
    };
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse(transaction));

    const result = await getTransaction('1');

    expect(callbackApi.get).toHaveBeenCalledWith('transactions/1/');
    expect(result).toEqual(transaction);
  });
});

describe('updateTransaction', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.patch).mockReset();
  });

  it('calls callbackApi.patch with transaction path and body', async () => {
    const updated = {
      id: '1',
      subcategory_id: 'sub-1',
      subcategory_name: 'Groceries',
      value: 600,
      description: 'Updated',
      date: '2026-03-02',
      hangout_id: null,
      hangout_name: null,
      user_id: 'u1',
    };
    vi.mocked(callbackApi.patch).mockResolvedValue(mockResponse(updated));

    const result = await updateTransaction('1', {
      value: 600,
      description: 'Updated',
      date: '2026-03-02',
    });

    expect(callbackApi.patch).toHaveBeenCalledWith('transactions/1/', {
      value: 600,
      description: 'Updated',
      date: '2026-03-02',
    });
    expect(result).toEqual(updated);
  });
});

describe('deleteTransaction', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.delete).mockReset();
  });

  it('calls callbackApi.delete with transaction path', async () => {
    vi.mocked(callbackApi.delete).mockResolvedValue({
      data: undefined,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {} as never,
    });

    await deleteTransaction('1');

    expect(callbackApi.delete).toHaveBeenCalledWith('transactions/1/');
  });
});
