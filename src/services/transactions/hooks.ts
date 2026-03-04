import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTransaction as createTransactionApi,
  deleteTransaction as deleteTransactionApi,
  fetchTransactions as fetchTransactionsApi,
  updateTransaction as updateTransactionApi,
} from './index';
import type { TransactionUpdate } from './types';

export const transactionsQueryKey = ['transactions'] as const;

type ListOptions = { skip?: number; limit?: number };

export function useTransactionsQuery(options?: ListOptions) {
  return useQuery({
    queryKey: [...transactionsQueryKey, options ?? {}],
    queryFn: () => fetchTransactionsApi(options),
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransactionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: TransactionUpdate }) =>
      updateTransactionApi(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
    },
  });
}
