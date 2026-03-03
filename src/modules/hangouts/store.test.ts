import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HangoutRead } from '../../services/hangouts/types';
import { useHangoutsStore } from './store';

vi.mock('../../services/hangouts', () => ({
  fetchHangouts: vi.fn(),
}));

import { fetchHangouts as fetchHangoutsApi } from '../../services/hangouts';

describe('useHangoutsStore', () => {
  beforeEach(() => {
    vi.mocked(fetchHangoutsApi).mockReset();
    useHangoutsStore.setState({
      items: [],
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading true then items and loading false on success', async () => {
    const items: HangoutRead[] = [
      {
        id: '1',
        name: 'Brunch',
        description: null,
        date: '2026-03-01',
        user_id: 'u1',
      },
    ];
    vi.mocked(fetchHangoutsApi).mockResolvedValue(items);

    await useHangoutsStore.getState().fetchHangouts();

    expect(fetchHangoutsApi).toHaveBeenCalledWith(undefined);
    expect(useHangoutsStore.getState()).toMatchObject({
      items,
      loading: false,
      error: null,
    });
  });

  it('sets loading true then error and loading false on API failure', async () => {
    vi.mocked(fetchHangoutsApi).mockRejectedValue(new Error('Network error'));

    await useHangoutsStore.getState().fetchHangouts();

    expect(useHangoutsStore.getState()).toMatchObject({
      items: [],
      loading: false,
      error: 'Network error',
    });
  });

  it('uses generic message when error is not an Error instance', async () => {
    vi.mocked(fetchHangoutsApi).mockRejectedValue('string error');

    await useHangoutsStore.getState().fetchHangouts();

    expect(useHangoutsStore.getState().error).toBe('Failed to load hangouts');
  });

  it('passes skip and limit to API when provided', async () => {
    vi.mocked(fetchHangoutsApi).mockResolvedValue([]);

    await useHangoutsStore.getState().fetchHangouts({
      skip: 10,
      limit: 20,
    });

    expect(fetchHangoutsApi).toHaveBeenCalledWith({
      skip: 10,
      limit: 20,
    });
  });
});
