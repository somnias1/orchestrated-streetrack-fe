import { beforeEach, describe, expect, it, vi } from 'vitest';
import { callbackApi } from '../../utils/callbackApi';
import { fetchCategories } from './index';

vi.mock('../../utils/callbackApi', () => ({
  callbackApi: {
    get: vi.fn(),
  },
}));

describe('fetchCategories', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.get).mockReset();
  });

  it('calls callbackApi.get with list path and default skip/limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as never,
    });

    await fetchCategories();

    expect(callbackApi.get).toHaveBeenCalledWith('categories', {
      params: { skip: 0, limit: 50 },
    });
  });

  it('calls callbackApi.get with custom skip and limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as never,
    });

    await fetchCategories({ skip: 10, limit: 20 });

    expect(callbackApi.get).toHaveBeenCalledWith('categories', {
      params: { skip: 10, limit: 20 },
    });
  });

  it('returns the response data array', async () => {
    const categories = [
      {
        id: '1',
        name: 'Food',
        description: null,
        is_income: false,
        user_id: 'u1',
      },
    ];
    vi.mocked(callbackApi.get).mockResolvedValue({
      data: categories,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as never,
    });

    const result = await fetchCategories();

    expect(result).toEqual(categories);
  });
});
