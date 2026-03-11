import { faker } from '@faker-js/faker';
import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { config } from '../../config';
import ProviderWrapper from '../../utils/test/provider';
import { hangoutsPaths } from './constants';
import {
  useCreateHangoutMutation,
  useDeleteHangoutMutation,
  useHangoutsQuery,
  useUpdateHangoutMutation,
} from './index';
import { hangoutMock, hangoutsMock } from './mocks';
import type { HangoutCreate, HangoutUpdate } from './types';

const baseURL = config.apiUrl;

describe('Hangouts services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const server = setupServer();

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('useHangoutsQuery', () => {
    it('fetches hangouts list', async () => {
      const hangouts = hangoutsMock(3);
      server.use(
        http.get(`${baseURL}/${hangoutsPaths.list}`, () =>
          HttpResponse.json(hangouts, { status: 200 }),
        ),
      );
      const { result } = renderHook(() => useHangoutsQuery(), {
        wrapper: ProviderWrapper,
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(hangouts);
    });

    it('sends skip and limit params', async () => {
      const hangouts = hangoutsMock(2);
      let capturedUrl = '';
      server.use(
        http.get(`${baseURL}/${hangoutsPaths.list}`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(hangouts, { status: 200 });
        }),
      );
      const { result } = renderHook(
        () => useHangoutsQuery({ skip: 10, limit: 20 }),
        { wrapper: ProviderWrapper },
      );
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(capturedUrl).toContain('skip=10');
      expect(capturedUrl).toContain('limit=20');
    });
  });

  describe('useCreateHangoutMutation', () => {
    it('POSTs to list path and returns created hangout', async () => {
      const created = hangoutMock();
      const requestCreated: HangoutCreate = {
        name: created.name,
        date: created.date,
        description: created.description,
      };
      server.use(
        http.post(`${baseURL}/${hangoutsPaths.list}`, async ({ request }) => {
          const body = await request.json();
          expect(body).toMatchObject(requestCreated);
          return HttpResponse.json(created, { status: 201 });
        }),
      );
      const { result } = renderHook(() => useCreateHangoutMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate(requestCreated);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(created);
    });
  });

  describe('useUpdateHangoutMutation', () => {
    it('PATCHes hangout by id and returns updated', async () => {
      const updated = hangoutMock();
      const requestUpdated: HangoutUpdate = {
        name: updated.name,
        date: updated.date,
      };
      server.use(
        http.patch(
          `${baseURL}/${hangoutsPaths.update(updated.id)}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toMatchObject(requestUpdated);
            return HttpResponse.json(updated, { status: 200 });
          },
        ),
      );
      const { result } = renderHook(() => useUpdateHangoutMutation(), {
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

  describe('useDeleteHangoutMutation', () => {
    it('DELETEs hangout by id', async () => {
      const deleted = faker.string.uuid();
      let deleteCalled = false;
      server.use(
        http.delete(`${baseURL}/${hangoutsPaths.delete(deleted)}`, () => {
          deleteCalled = true;
          return new HttpResponse(null, { status: 204 });
        }),
      );
      const { result } = renderHook(() => useDeleteHangoutMutation(), {
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
