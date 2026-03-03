import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  HangoutCreate,
  HangoutRead,
  HangoutUpdate,
} from '../../services/hangouts/types';
import { useHangoutsStore } from './store';

const fetchHangoutsApi = vi.fn();
const createHangoutApi = vi.fn();
const updateHangoutApi = vi.fn();
const deleteHangoutApi = vi.fn();

vi.mock('../../services/hangouts', () => ({
  fetchHangouts: (...args: unknown[]) => fetchHangoutsApi(...args),
  createHangout: (...args: unknown[]) => createHangoutApi(...args),
  updateHangout: (...args: unknown[]) => updateHangoutApi(...args),
  deleteHangout: (...args: unknown[]) => deleteHangoutApi(...args),
}));

describe('useHangoutsStore', () => {
  beforeEach(() => {
    fetchHangoutsApi.mockReset();
    createHangoutApi.mockReset();
    updateHangoutApi.mockReset();
    deleteHangoutApi.mockReset();
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
    fetchHangoutsApi.mockResolvedValue(items);

    await useHangoutsStore.getState().fetchHangouts();

    expect(fetchHangoutsApi).toHaveBeenCalledWith(undefined);
    expect(useHangoutsStore.getState()).toMatchObject({
      items,
      loading: false,
      error: null,
    });
  });

  it('sets loading true then error and loading false on API failure', async () => {
    fetchHangoutsApi.mockRejectedValue(new Error('Network error'));

    await useHangoutsStore.getState().fetchHangouts();

    expect(useHangoutsStore.getState()).toMatchObject({
      items: [],
      loading: false,
      error: 'Network error',
    });
  });

  it('uses generic message when error is not an Error instance', async () => {
    fetchHangoutsApi.mockRejectedValue('string error');

    await useHangoutsStore.getState().fetchHangouts();

    expect(useHangoutsStore.getState().error).toBe('Failed to load hangouts');
  });

  it('passes skip and limit to API when provided', async () => {
    fetchHangoutsApi.mockResolvedValue([]);

    await useHangoutsStore.getState().fetchHangouts({
      skip: 10,
      limit: 20,
    });

    expect(fetchHangoutsApi).toHaveBeenCalledWith({
      skip: 10,
      limit: 20,
    });
  });

  it('createHangout calls API then fetchHangouts on success', async () => {
    createHangoutApi.mockResolvedValue({});
    fetchHangoutsApi.mockResolvedValue([]);

    await useHangoutsStore.getState().createHangout({
      name: 'Brunch',
      date: '2026-03-01',
      description: null,
    } as HangoutCreate);

    expect(createHangoutApi).toHaveBeenCalledWith({
      name: 'Brunch',
      date: '2026-03-01',
      description: null,
    });
    expect(fetchHangoutsApi).toHaveBeenCalled();
    expect(useHangoutsStore.getState().error).toBeNull();
  });

  it('createHangout sets error on API failure', async () => {
    createHangoutApi.mockRejectedValue(new Error('Create failed'));

    await expect(
      useHangoutsStore.getState().createHangout({
        name: 'Brunch',
        date: '2026-03-01',
      } as HangoutCreate),
    ).rejects.toThrow('Create failed');
    expect(useHangoutsStore.getState().error).toBe('Create failed');
  });

  it('updateHangout calls API then fetchHangouts on success', async () => {
    updateHangoutApi.mockResolvedValue({});
    fetchHangoutsApi.mockResolvedValue([]);

    await useHangoutsStore.getState().updateHangout('h-1', {
      name: 'Updated',
      date: '2026-03-02',
    } as HangoutUpdate);

    expect(updateHangoutApi).toHaveBeenCalledWith('h-1', {
      name: 'Updated',
      date: '2026-03-02',
    });
    expect(fetchHangoutsApi).toHaveBeenCalled();
    expect(useHangoutsStore.getState().error).toBeNull();
  });

  it('updateHangout sets error on API failure', async () => {
    updateHangoutApi.mockRejectedValue(new Error('Update failed'));

    await expect(
      useHangoutsStore.getState().updateHangout('h-1', {}),
    ).rejects.toThrow('Update failed');
    expect(useHangoutsStore.getState().error).toBe('Update failed');
  });

  it('deleteHangout calls API then fetchHangouts on success', async () => {
    deleteHangoutApi.mockResolvedValue(undefined);
    fetchHangoutsApi.mockResolvedValue([]);

    await useHangoutsStore.getState().deleteHangout('h-1');

    expect(deleteHangoutApi).toHaveBeenCalledWith('h-1');
    expect(fetchHangoutsApi).toHaveBeenCalled();
    expect(useHangoutsStore.getState().error).toBeNull();
  });

  it('deleteHangout sets error on API failure', async () => {
    deleteHangoutApi.mockRejectedValue(new Error('Delete failed'));

    await expect(
      useHangoutsStore.getState().deleteHangout('h-1'),
    ).rejects.toThrow('Delete failed');
    expect(useHangoutsStore.getState().error).toBe('Delete failed');
  });
});
