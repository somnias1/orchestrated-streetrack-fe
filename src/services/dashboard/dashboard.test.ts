import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { config } from '../../config';
import ProviderWrapper from '../../utils/test/provider';
import {
  useDashboardBalanceQuery,
  useDashboardDuePeriodicExpensesQuery,
  useDashboardMonthBalanceQuery,
} from '.';
import { dashboardPaths } from './constants';
import type { DashboardBalanceRead } from './types';

const baseURL = config.apiUrl;

describe('Dashboard services', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('useDashboardBalanceQuery', () => {
    it('fetches cumulative balance', async () => {
      const data: DashboardBalanceRead = { balance: 1000 };
      server.use(
        http.get(`${baseURL}/${dashboardPaths.balance}`, () =>
          HttpResponse.json(data, { status: 200 }),
        ),
      );
      const { result } = renderHook(() => useDashboardBalanceQuery(), {
        wrapper: ProviderWrapper,
      });
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(data);
    });
  });

  describe('useDashboardMonthBalanceQuery', () => {
    it('fetches month balance when params provided', async () => {
      const data = { balance: 500, year: 2026, month: 3 };
      server.use(
        http.get(`${baseURL}/${dashboardPaths.monthBalance}`, ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('year')).toBe('2026');
          expect(url.searchParams.get('month')).toBe('3');
          return HttpResponse.json(data, { status: 200 });
        }),
      );
      const { result } = renderHook(
        () => useDashboardMonthBalanceQuery({ year: 2026, month: 3 }),
        { wrapper: ProviderWrapper },
      );
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(data);
    });
  });

  describe('useDashboardDuePeriodicExpensesQuery', () => {
    it('fetches due periodic expenses for month', async () => {
      const data = [
        {
          subcategory_id: 'sub-1',
          subcategory_name: 'Rent',
          category_id: 'cat-1',
          category_name: 'Housing',
          due_day: 5,
          paid: false,
        },
      ];
      server.use(
        http.get(
          `${baseURL}/${dashboardPaths.duePeriodicExpenses}`,
          ({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get('year')).toBe('2026');
            expect(url.searchParams.get('month')).toBe('3');
            return HttpResponse.json(data, { status: 200 });
          },
        ),
      );
      const { result } = renderHook(
        () => useDashboardDuePeriodicExpensesQuery({ year: 2026, month: 3 }),
        { wrapper: ProviderWrapper },
      );
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toEqual(data);
    });
  });
});
