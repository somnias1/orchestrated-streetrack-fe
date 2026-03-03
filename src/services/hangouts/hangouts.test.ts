import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchHangouts } from './index';

const mockGet = vi.fn();
vi.mock('../../utils/callbackApi', () => ({
  callbackApi: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe('fetchHangouts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls GET hangouts with default skip and limit', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await fetchHangouts();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('hangouts', {
      params: { skip: 0, limit: 50 },
    });
  });

  it('calls GET hangouts with provided skip and limit', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await fetchHangouts({ skip: 10, limit: 20 });

    expect(mockGet).toHaveBeenCalledWith('hangouts', {
      params: { skip: 10, limit: 20 },
    });
  });

  it('returns the response data array', async () => {
    const items = [
      {
        id: '1',
        name: 'Brunch',
        description: 'Weekend brunch',
        date: '2026-03-01',
        user_id: 'u1',
      },
    ];
    mockGet.mockResolvedValue({ data: items });

    const result = await fetchHangouts();

    expect(result).toEqual(items);
  });
});
