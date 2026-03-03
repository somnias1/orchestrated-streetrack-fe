import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSubcategories } from './index';

const mockGet = vi.fn();
vi.mock('../../utils/callbackApi', () => ({
  callbackApi: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe('fetchSubcategories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls GET subcategories with default skip and limit', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await fetchSubcategories();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('subcategories', {
      params: { skip: 0, limit: 50 },
    });
  });

  it('calls GET subcategories with provided skip and limit', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await fetchSubcategories({ skip: 10, limit: 20 });

    expect(mockGet).toHaveBeenCalledWith('subcategories', {
      params: { skip: 10, limit: 20 },
    });
  });

  it('returns the response data array', async () => {
    const items = [
      {
        id: '1',
        category_id: 'cat-1',
        name: 'Groceries',
        description: null,
        belongs_to_income: false,
        user_id: 'u1',
      },
    ];
    mockGet.mockResolvedValue({ data: items });

    const result = await fetchSubcategories();

    expect(result).toEqual(items);
  });
});
