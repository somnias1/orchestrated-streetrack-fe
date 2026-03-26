import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { config } from '../../config';
import useCallbackApi from '../../utils/callbackApi';
import { subcategoriesPaths, subcategoriesQueryKey } from './constants';
import type {
  GetSubcategoriesResponse,
  SubcategoriesListParams,
  SubcategoryCreate,
  SubcategoryRead,
  SubcategoryUpdate,
} from './types';

const baseURL = config.apiUrl;

export function useSubcategoriesQuery(
  params?: SubcategoriesListParams,
  queryOptions?: Partial<
    UseQueryOptions<GetSubcategoriesResponse, Error, GetSubcategoriesResponse>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<GetSubcategoriesResponse, Error, GetSubcategoriesResponse>({
    queryKey: [subcategoriesQueryKey, params ?? {}],
    queryFn: () =>
      callbackApi<GetSubcategoriesResponse>(subcategoriesPaths.list, {
        params,
        baseURL,
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useSubcategoryQuery(
  id: string | undefined,
  queryOptions?: Partial<
    UseQueryOptions<SubcategoryRead, Error, SubcategoryRead>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<SubcategoryRead, Error, SubcategoryRead>({
    queryKey: [subcategoriesQueryKey, 'detail', id],
    queryFn: () =>
      callbackApi<SubcategoryRead>(subcategoriesPaths.get(id as string), {
        baseURL,
      }),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useCreateSubcategoryMutation(
  options?: Partial<
    UseMutationOptions<SubcategoryRead, Error, SubcategoryCreate>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<SubcategoryRead, Error, SubcategoryCreate>({
    mutationFn: (body: SubcategoryCreate) =>
      callbackApi<SubcategoryRead>(subcategoriesPaths.list, {
        data: body,
        method: 'POST',
        baseURL,
      }),
    ...options,
  });
}

export function useUpdateSubcategoryMutation(
  options?: Partial<
    UseMutationOptions<
      SubcategoryRead,
      Error,
      { id: string; body: SubcategoryUpdate }
    >
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<
    SubcategoryRead,
    Error,
    { id: string; body: SubcategoryUpdate }
  >({
    mutationFn: ({ id, body }: { id: string; body: SubcategoryUpdate }) =>
      callbackApi<SubcategoryRead>(subcategoriesPaths.update(id), {
        data: body,
        method: 'PATCH',
        baseURL,
      }),
    ...options,
  });
}

export function useDeleteSubcategoryMutation(
  options?: Partial<UseMutationOptions<void, Error, string>>,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) =>
      callbackApi<void>(subcategoriesPaths.delete(id), {
        method: 'DELETE',
        baseURL,
      }),
    ...options,
  });
}
