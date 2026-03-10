import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { config } from '../../config';
import useCallbackApi from '../../utils/callbackApi';
import { hangoutsPaths, hangoutsQueryKey } from './constants';
import type {
  GetHangoutsResponse,
  HangoutCreate,
  HangoutRead,
  HangoutsListParams,
  HangoutUpdate,
} from './types';

const baseURL = config.apiUrl;

export function useHangoutsQuery(
  params?: HangoutsListParams,
  queryOptions?: Partial<
    UseQueryOptions<GetHangoutsResponse, Error, GetHangoutsResponse>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<GetHangoutsResponse, Error, GetHangoutsResponse>({
    queryKey: [hangoutsQueryKey, params ?? {}],
    queryFn: () =>
      callbackApi<GetHangoutsResponse>(hangoutsPaths.list, {
        params,
        baseURL,
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useCreateHangoutMutation(
  options?: Partial<UseMutationOptions<HangoutRead, Error, HangoutCreate>>,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<HangoutRead, Error, HangoutCreate>({
    mutationFn: (body: HangoutCreate) =>
      callbackApi<HangoutRead>(hangoutsPaths.list, {
        data: body,
        method: 'POST',
        baseURL,
      }),
    ...options,
  });
}

export function useUpdateHangoutMutation(
  options?: Partial<
    UseMutationOptions<HangoutRead, Error, { id: string; body: HangoutUpdate }>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<HangoutRead, Error, { id: string; body: HangoutUpdate }>({
    mutationFn: ({ id, body }: { id: string; body: HangoutUpdate }) =>
      callbackApi<HangoutRead>(hangoutsPaths.update(id), {
        data: body,
        method: 'PATCH',
        baseURL,
      }),
    ...options,
  });
}

export function useDeleteHangoutMutation(
  options?: Partial<UseMutationOptions<void, Error, string>>,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) =>
      callbackApi<void>(hangoutsPaths.delete(id), {
        method: 'DELETE',
        baseURL,
      }),
    ...options,
  });
}
