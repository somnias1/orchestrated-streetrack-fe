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
import { subcategoriesPaths } from './constants';
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useSubcategoriesQuery,
  useUpdateSubcategoryMutation,
} from './index';
import { subcategoriesMock, subcategoryMock } from './mocks';
import type { SubcategoryCreate, SubcategoryUpdate } from './types';

const baseURL = config.apiUrl;

describe('Subcategories services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const server = setupServer();

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('useSubcategoriesQuery', () => {
    it('fetches subcategories list', async () => {
      const subcategories = subcategoriesMock(3);
      server.use(
        http.get(`${baseURL}/${subcategoriesPaths.list}`, () =>
          HttpResponse.json(subcategories, { status: 200 }),
        ),
      );
      const { result } = renderHook(() => useSubcategoriesQuery(), {
        wrapper: ProviderWrapper,
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(subcategories);
    });

    it('sends skip, limit, belongs_to_income and category_id params', async () => {
      const subcategories = subcategoriesMock(2);
      let capturedUrl = '';
      server.use(
        http.get(`${baseURL}/${subcategoriesPaths.list}`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(subcategories, { status: 200 });
        }),
      );
      const { result } = renderHook(
        () =>
          useSubcategoriesQuery({
            skip: 10,
            limit: 20,
            belongs_to_income: false,
            category_id: 'cat-uuid',
          }),
        { wrapper: ProviderWrapper },
      );
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(capturedUrl).toContain('skip=10');
      expect(capturedUrl).toContain('limit=20');
      expect(capturedUrl).toContain('belongs_to_income=false');
      expect(capturedUrl).toContain('category_id=cat-uuid');
    });
  });

  describe('useCreateSubcategoryMutation', () => {
    it('POSTs to list path and returns created subcategory', async () => {
      const created = subcategoryMock();
      const requestCreated: SubcategoryCreate = {
        category_id: created.category_id,
        name: created.name,
        description: created.description,
        belongs_to_income: created.belongs_to_income,
      };
      server.use(
        http.post(
          `${baseURL}/${subcategoriesPaths.list}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toMatchObject(requestCreated);
            return HttpResponse.json(created, { status: 201 });
          },
        ),
      );
      const { result } = renderHook(() => useCreateSubcategoryMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate(requestCreated);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(created);
    });
  });

  describe('useUpdateSubcategoryMutation', () => {
    it('PATCHes subcategory by id and returns updated', async () => {
      const updated = subcategoryMock();
      const requestUpdated: SubcategoryUpdate = {
        name: updated.name,
        description: updated.description,
        belongs_to_income: updated.belongs_to_income,
      };
      server.use(
        http.patch(
          `${baseURL}/${subcategoriesPaths.update(updated.id)}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toMatchObject(requestUpdated);
            return HttpResponse.json(updated, { status: 200 });
          },
        ),
      );
      const { result } = renderHook(() => useUpdateSubcategoryMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate({
        id: updated.id,
        body: requestUpdated,
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(updated);
    });
  });

  describe('useDeleteSubcategoryMutation', () => {
    it('DELETEs subcategory by id', async () => {
      const deleted = faker.string.uuid();
      let deleteCalled = false;
      server.use(
        http.delete(`${baseURL}/${subcategoriesPaths.delete(deleted)}`, () => {
          deleteCalled = true;
          return new HttpResponse(null, { status: 204 });
        }),
      );
      const { result } = renderHook(() => useDeleteSubcategoryMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate(deleted);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(deleteCalled).toBe(true);
    });
  });
});
