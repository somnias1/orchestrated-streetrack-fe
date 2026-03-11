import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { config } from '../../config';
import useCallbackApi from '../../utils/callbackApi';
import { transactionsPaths, transactionsQueryKey } from './constants';
import type {
  BulkCreateTransactionsResponse,
  GetTransactionsResponse,
  TransactionBulkCreate,
  TransactionCreate,
  TransactionRead,
  TransactionsListParams,
  TransactionUpdate,
} from './types';

const baseURL = config.apiUrl;

export function useTransactionsQuery(
  params?: TransactionsListParams,
  queryOptions?: Partial<
    UseQueryOptions<GetTransactionsResponse, Error, GetTransactionsResponse>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<GetTransactionsResponse, Error, GetTransactionsResponse>({
    queryKey: [transactionsQueryKey, params ?? {}],
    queryFn: () =>
      callbackApi<GetTransactionsResponse>(transactionsPaths.list, {
        params,
        baseURL,
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useCreateTransactionMutation(
  options?: Partial<
    UseMutationOptions<TransactionRead, Error, TransactionCreate>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<TransactionRead, Error, TransactionCreate>({
    mutationFn: (body: TransactionCreate) =>
      callbackApi<TransactionRead>(transactionsPaths.list, {
        data: body,
        method: 'POST',
        baseURL,
      }),
    ...options,
  });
}

export function useUpdateTransactionMutation(
  options?: Partial<
    UseMutationOptions<
      TransactionRead,
      Error,
      { id: string; body: TransactionUpdate }
    >
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<
    TransactionRead,
    Error,
    { id: string; body: TransactionUpdate }
  >({
    mutationFn: ({ id, body }: { id: string; body: TransactionUpdate }) =>
      callbackApi<TransactionRead>(transactionsPaths.update(id), {
        data: body,
        method: 'PATCH',
        baseURL,
      }),
    ...options,
  });
}

export function useDeleteTransactionMutation(
  options?: Partial<UseMutationOptions<void, Error, string>>,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) =>
      callbackApi<void>(transactionsPaths.delete(id), {
        method: 'DELETE',
        baseURL,
      }),
    ...options,
  });
}

export function useBulkCreateTransactionsMutation(
  options?: Partial<
    UseMutationOptions<
      BulkCreateTransactionsResponse,
      Error,
      TransactionBulkCreate
    >
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<
    BulkCreateTransactionsResponse,
    Error,
    TransactionBulkCreate
  >({
    mutationFn: (body: TransactionBulkCreate) =>
      callbackApi<BulkCreateTransactionsResponse>(transactionsPaths.bulk, {
        data: body,
        method: 'POST',
        baseURL,
      }),
    ...options,
  });
}
