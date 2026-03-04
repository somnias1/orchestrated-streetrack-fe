import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { callbackApi } from '../../utils/callbackApi';
import {
  createHangout,
  deleteHangout,
  fetchHangouts,
  getHangout,
  updateHangout,
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

describe('fetchHangouts', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.get).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls GET hangouts with default skip and limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse([]));

    await fetchHangouts();

    expect(callbackApi.get).toHaveBeenCalledTimes(1);
    expect(callbackApi.get).toHaveBeenCalledWith('hangouts/', {
      params: { skip: 0, limit: 50 },
    });
  });

  it('calls GET hangouts with provided skip and limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse([]));

    await fetchHangouts({ skip: 10, limit: 20 });

    expect(callbackApi.get).toHaveBeenCalledWith('hangouts/', {
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
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse(items));

    const result = await fetchHangouts();

    expect(result).toEqual(items);
  });
});

describe('createHangout', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.post).mockReset();
  });

  it('calls callbackApi.post with list path and body', async () => {
    const created = {
      id: 'new-1',
      name: 'Brunch',
      description: 'Weekend brunch',
      date: '2026-03-01',
      user_id: 'u1',
    };
    vi.mocked(callbackApi.post).mockResolvedValue(mockResponse(created));

    const result = await createHangout({
      name: 'Brunch',
      date: '2026-03-01',
      description: 'Weekend brunch',
    });

    expect(callbackApi.post).toHaveBeenCalledWith('hangouts/', {
      name: 'Brunch',
      date: '2026-03-01',
      description: 'Weekend brunch',
    });
    expect(result).toEqual(created);
  });
});

describe('getHangout', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.get).mockReset();
  });

  it('calls callbackApi.get with hangout path', async () => {
    const hangout = {
      id: '1',
      name: 'Brunch',
      description: null,
      date: '2026-03-01',
      user_id: 'u1',
    };
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse(hangout));

    const result = await getHangout('1');

    expect(callbackApi.get).toHaveBeenCalledWith('hangouts/1/');
    expect(result).toEqual(hangout);
  });
});

describe('updateHangout', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.patch).mockReset();
  });

  it('calls callbackApi.patch with hangout path and body', async () => {
    const updated = {
      id: '1',
      name: 'Updated brunch',
      description: null,
      date: '2026-03-02',
      user_id: 'u1',
    };
    vi.mocked(callbackApi.patch).mockResolvedValue(mockResponse(updated));

    const result = await updateHangout('1', {
      name: 'Updated brunch',
      date: '2026-03-02',
    });

    expect(callbackApi.patch).toHaveBeenCalledWith('hangouts/1/', {
      name: 'Updated brunch',
      date: '2026-03-02',
    });
    expect(result).toEqual(updated);
  });
});

describe('deleteHangout', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.delete).mockReset();
  });

  it('calls callbackApi.delete with hangout path', async () => {
    vi.mocked(callbackApi.delete).mockResolvedValue({
      data: undefined,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {} as never,
    });

    await deleteHangout('1');

    expect(callbackApi.delete).toHaveBeenCalledWith('hangouts/1/');
  });
});
