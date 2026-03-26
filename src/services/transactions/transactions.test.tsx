import { faker } from '@faker-js/faker';
import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { config } from '../../config';
import ProviderWrapper from '../../utils/test/provider';
import { toPaginatedRead } from '../pagination';
import { transactionsPaths } from './constants';
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
  useUpdateTransactionMutation,
} from './index';
import { transactionMock, transactionsMock } from './mocks';
import type { TransactionCreate, TransactionUpdate } from './types';

const baseURL = config.apiUrl;

describe('Transactions services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const server = setupServer();

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('useTransactionsQuery', () => {
    it('fetches transactions list', async () => {
      const transactions = transactionsMock(3);
      server.use(
        http.get(`${baseURL}/${transactionsPaths.list}`, () =>
          HttpResponse.json(toPaginatedRead(transactions), { status: 200 }),
        ),
      );
      const { result } = renderHook(() => useTransactionsQuery(), {
        wrapper: ProviderWrapper,
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(toPaginatedRead(transactions));
    });

    it('sends skip, limit, year and month params', async () => {
      const transactions = transactionsMock(2);
      let capturedUrl = '';
      server.use(
        http.get(`${baseURL}/${transactionsPaths.list}`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(toPaginatedRead(transactions), {
            status: 200,
          });
        }),
      );
      const { result } = renderHook(
        () =>
          useTransactionsQuery({ skip: 10, limit: 20, year: 2026, month: 3 }),
        { wrapper: ProviderWrapper },
      );
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(capturedUrl).toContain('skip=10');
      expect(capturedUrl).toContain('limit=20');
      expect(capturedUrl).toContain('year=2026');
      expect(capturedUrl).toContain('month=3');
    });
  });

  describe('useCreateTransactionMutation', () => {
    it('POSTs to list path and returns created transaction', async () => {
      const created = transactionMock();
      const requestCreated: TransactionCreate = {
        subcategory_id: created.subcategory_id,
        value: created.value,
        description: created.description,
        date: created.date,
        hangout_id: created.hangout_id,
      };
      server.use(
        http.post(
          `${baseURL}/${transactionsPaths.list}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toMatchObject(requestCreated);
            return HttpResponse.json(created, { status: 201 });
          },
        ),
      );
      const { result } = renderHook(() => useCreateTransactionMutation(), {
        wrapper: ProviderWrapper,
      });
      result.current.mutate(requestCreated);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(created);
    });
  });

  describe('useUpdateTransactionMutation', () => {
    it('PATCHes transaction by id and returns updated', async () => {
      const updated = transactionMock();
      const requestUpdated: TransactionUpdate = {
        value: updated.value,
        description: updated.description,
        date: updated.date,
      };
      server.use(
        http.patch(
          `${baseURL}/${transactionsPaths.update(updated.id)}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toMatchObject(requestUpdated);
            return HttpResponse.json(updated, { status: 200 });
          },
        ),
      );
      const { result } = renderHook(() => useUpdateTransactionMutation(), {
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

  describe('useDeleteTransactionMutation', () => {
    it('DELETEs transaction by id', async () => {
      const deleted = faker.string.uuid();
      let deleteCalled = false;
      server.use(
        http.delete(`${baseURL}/${transactionsPaths.delete(deleted)}`, () => {
          deleteCalled = true;
          return new HttpResponse(null, { status: 204 });
        }),
      );
      const { result } = renderHook(() => useDeleteTransactionMutation(), {
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
