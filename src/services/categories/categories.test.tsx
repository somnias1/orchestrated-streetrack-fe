import { faker } from '@faker-js/faker';
import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { config } from '../../config';
import ProviderWrapper from '../../utils/test/provider';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '.';
import { categoriesPaths } from './constants';
import { categoriesMock, categoryMock } from './mocks';
import type { CategoryCreate, CategoryUpdate } from './types';

const baseURL = config.apiUrl;

describe('Categories services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const server = setupServer();

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('useCategoriesQuery', () => {
    it('fetches categories list', async () => {
      const categories = categoriesMock(3);
      server.use(
        http.get(`${baseURL}/${categoriesPaths.list}`, () =>
          HttpResponse.json(categories, { status: 200 }),
        ),
      );
      const { result } = renderHook(() => useCategoriesQuery(), {
        wrapper: ProviderWrapper,
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(categories);
    });

    it('sends skip and limit params', async () => {
      const categories = categoriesMock(2);
      let capturedUrl = '';
      server.use(
        http.get(`${baseURL}/${categoriesPaths.list}`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(categories, { status: 200 });
        }),
      );
      const { result } = renderHook(
        () => useCategoriesQuery({ skip: 10, limit: 20 }),
        { wrapper: ProviderWrapper },
      );
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(capturedUrl).toContain('skip=10');
      expect(capturedUrl).toContain('limit=20');
    });

    it('sends is_income filter', async () => {
      const categories = categoriesMock(1);
      let capturedUrl = '';
      server.use(
        http.get(`${baseURL}/${categoriesPaths.list}`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(categories, { status: 200 });
        }),
      );
      const { result } = renderHook(
        () => useCategoriesQuery({ is_income: true }),
        { wrapper: ProviderWrapper },
      );
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(capturedUrl).toContain('is_income=true');
    });
  });

  describe('useCreateCategoryMutation', () => {
    it('POSTs to list path and returns created category', async () => {
      const created = categoryMock();
      const payload: CategoryCreate = {
        name: created.name,
        description: created.description,
        is_income: created.is_income,
      };
      server.use(
        http.post(`${baseURL}/${categoriesPaths.list}`, async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>;
          expect(body).toMatchObject(payload);
          return HttpResponse.json(created, { status: 201 });
        }),
      );
      const { result } = renderHook(() => useCreateCategoryMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate(payload);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(created);
    });
  });

  describe('useUpdateCategoryMutation', () => {
    it('PATCHes category by id and returns updated', async () => {
      const updated = categoryMock();
      const body: CategoryUpdate = {
        name: updated.name,
        description: updated.description,
        is_income: updated.is_income,
      };
      server.use(
        http.patch(
          `${baseURL}/${categoriesPaths.update(updated.id)}`,
          async ({ request }) => {
            const requestBody = (await request.json()) as Record<
              string,
              unknown
            >;
            expect(requestBody).toMatchObject(body);
            return HttpResponse.json(updated, { status: 200 });
          },
        ),
      );
      const { result } = renderHook(() => useUpdateCategoryMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate({ id: updated.id, body });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(updated);
    });
  });

  describe('useDeleteCategoryMutation', () => {
    it('DELETEs category by id', async () => {
      const categoryId = faker.string.uuid();
      let deleteCalled = false;
      server.use(
        http.delete(`${baseURL}/${categoriesPaths.delete(categoryId)}`, () => {
          deleteCalled = true;
          return new HttpResponse(null, { status: 204 });
        }),
      );
      const { result } = renderHook(() => useDeleteCategoryMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate(categoryId);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(deleteCalled).toBe(true);
    });
  });
});
