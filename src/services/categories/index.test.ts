import { beforeEach, describe, expect, it, vi } from 'vitest';
import { callbackApi } from '../../utils/callbackApi';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  getCategory,
  updateCategory,
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

describe('fetchCategories', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.get).mockReset();
  });

  it('calls callbackApi.get with list path and default skip/limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse([]));

    await fetchCategories();

    expect(callbackApi.get).toHaveBeenCalledWith('categories', {
      params: { skip: 0, limit: 50 },
    });
  });

  it('calls callbackApi.get with custom skip and limit', async () => {
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse([]));

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
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse(categories));

    const result = await fetchCategories();

    expect(result).toEqual(categories);
  });
});

describe('createCategory', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.post).mockReset();
  });

  it('calls callbackApi.post with list path and body', async () => {
    const created = {
      id: 'new-1',
      name: 'New',
      description: null,
      is_income: false,
      user_id: 'u1',
    };
    vi.mocked(callbackApi.post).mockResolvedValue(mockResponse(created));

    const result = await createCategory({
      name: 'New',
      description: null,
      is_income: false,
    });

    expect(callbackApi.post).toHaveBeenCalledWith('categories', {
      name: 'New',
      description: null,
      is_income: false,
    });
    expect(result).toEqual(created);
  });
});

describe('getCategory', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.get).mockReset();
  });

  it('calls callbackApi.get with category path', async () => {
    const category = {
      id: '1',
      name: 'Food',
      description: null,
      is_income: false,
      user_id: 'u1',
    };
    vi.mocked(callbackApi.get).mockResolvedValue(mockResponse(category));

    const result = await getCategory('1');

    expect(callbackApi.get).toHaveBeenCalledWith('categories/1');
    expect(result).toEqual(category);
  });
});

describe('updateCategory', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.patch).mockReset();
  });

  it('calls callbackApi.patch with category path and body', async () => {
    const updated = {
      id: '1',
      name: 'Updated',
      description: 'Desc',
      is_income: true,
      user_id: 'u1',
    };
    vi.mocked(callbackApi.patch).mockResolvedValue(mockResponse(updated));

    const result = await updateCategory('1', {
      name: 'Updated',
      description: 'Desc',
      is_income: true,
    });

    expect(callbackApi.patch).toHaveBeenCalledWith('categories/1', {
      name: 'Updated',
      description: 'Desc',
      is_income: true,
    });
    expect(result).toEqual(updated);
  });
});

describe('deleteCategory', () => {
  beforeEach(() => {
    vi.mocked(callbackApi.delete).mockReset();
  });

  it('calls callbackApi.delete with category path', async () => {
    vi.mocked(callbackApi.delete).mockResolvedValue({
      data: undefined,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {} as never,
    });

    await deleteCategory('1');

    expect(callbackApi.delete).toHaveBeenCalledWith('categories/1');
  });
});
