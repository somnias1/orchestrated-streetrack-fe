import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { config } from '../../config';
import useCallbackApi from '../../utils/callbackApi';
import { dashboardPaths, dashboardQueryKey } from './constants';
import type {
  DashboardBalanceRead,
  DashboardMonthBalanceRead,
  GetDashboardDuePeriodicExpensesResponse,
} from './types';

const baseURL = config.apiUrl;

export function useDashboardBalanceQuery(
  queryOptions?: Partial<
    UseQueryOptions<DashboardBalanceRead, Error, DashboardBalanceRead>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<DashboardBalanceRead, Error, DashboardBalanceRead>({
    queryKey: [dashboardQueryKey, 'balance'],
    queryFn: () =>
      callbackApi<DashboardBalanceRead>(dashboardPaths.balance, { baseURL }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export type DashboardMonthParams = { year: number; month: number };

export function useDashboardMonthBalanceQuery(
  params: DashboardMonthParams | null,
  queryOptions?: Partial<
    UseQueryOptions<DashboardMonthBalanceRead, Error, DashboardMonthBalanceRead>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<DashboardMonthBalanceRead, Error, DashboardMonthBalanceRead>({
    queryKey: [dashboardQueryKey, 'month-balance', params ?? {}],
    queryFn: () => {
      if (!params) throw new Error('Month params required');
      return callbackApi<DashboardMonthBalanceRead>(
        dashboardPaths.monthBalance,
        {
          params,
          baseURL,
        },
      );
    },
    enabled: params !== null,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useDashboardDuePeriodicExpensesQuery(
  params: DashboardMonthParams | null,
  queryOptions?: Partial<
    UseQueryOptions<
      GetDashboardDuePeriodicExpensesResponse,
      Error,
      GetDashboardDuePeriodicExpensesResponse
    >
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<
    GetDashboardDuePeriodicExpensesResponse,
    Error,
    GetDashboardDuePeriodicExpensesResponse
  >({
    queryKey: [dashboardQueryKey, 'due-periodic-expenses', params ?? {}],
    queryFn: () => {
      if (!params) throw new Error('Month params required');
      return callbackApi<GetDashboardDuePeriodicExpensesResponse>(
        dashboardPaths.duePeriodicExpenses,
        { params, baseURL },
      );
    },
    enabled: params !== null,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}
