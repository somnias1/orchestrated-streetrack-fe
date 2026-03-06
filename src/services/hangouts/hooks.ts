import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createHangout as createHangoutApi,
  deleteHangout as deleteHangoutApi,
  fetchHangouts as fetchHangoutsApi,
  updateHangout as updateHangoutApi,
} from './index';
import type { HangoutUpdate } from './types';

export const hangoutsQueryKey = ['hangouts'] as const;

type ListOptions = { skip?: number; limit?: number };

export function useHangoutsQuery(options?: ListOptions) {
  return useQuery({
    queryKey: [...hangoutsQueryKey, options ?? {}],
    queryFn: () => fetchHangoutsApi(options),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useCreateHangoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHangoutApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hangoutsQueryKey });
    },
  });
}

export function useUpdateHangoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: HangoutUpdate }) =>
      updateHangoutApi(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hangoutsQueryKey });
    },
  });
}

export function useDeleteHangoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHangoutApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hangoutsQueryKey });
    },
  });
}
