import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { config } from '../../config';
import useCallbackApi from '../../utils/callbackApi';
import { categoriesPaths, categoriesQueryKey } from './constants';
import type {
  CategoriesListParams,
  CategoryCreate,
  CategoryRead,
  CategoryUpdate,
  GetCategoriesResponse,
} from './types';

const baseURL = config.apiUrl;

export function useCategoriesQuery(
  params?: CategoriesListParams,
  queryOptions?: Partial<
    UseQueryOptions<GetCategoriesResponse, Error, GetCategoriesResponse>
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<GetCategoriesResponse, Error, GetCategoriesResponse>({
    queryKey: [categoriesQueryKey, params ?? {}],
    queryFn: () => callbackApi(categoriesPaths.list, { params, baseURL }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useCategoryQuery(
  id: string | undefined,
  queryOptions?: Partial<UseQueryOptions<CategoryRead, Error, CategoryRead>>,
) {
  const { callbackApi } = useCallbackApi();
  return useQuery<CategoryRead, Error, CategoryRead>({
    queryKey: [categoriesQueryKey, 'detail', id],
    queryFn: () =>
      callbackApi<CategoryRead>(categoriesPaths.get(id as string), {
        baseURL,
      }),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useCreateCategoryMutation(
  options?: Partial<UseMutationOptions<CategoryRead, Error, CategoryCreate>>,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<CategoryRead, Error, CategoryCreate>({
    mutationFn: (body: CategoryCreate) =>
      callbackApi<CategoryRead>(categoriesPaths.list, {
        data: body,
        method: 'POST',
        baseURL,
      }),
    ...options,
  });
}

export function useUpdateCategoryMutation(
  options?: Partial<
    UseMutationOptions<
      CategoryRead,
      Error,
      { id: string; body: CategoryUpdate }
    >
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<CategoryRead, Error, { id: string; body: CategoryUpdate }>(
    {
      mutationFn: ({ id, body }: { id: string; body: CategoryUpdate }) =>
        callbackApi<CategoryRead>(categoriesPaths.update(id), {
          data: body,
          method: 'PATCH',
          baseURL,
        }),
      ...options,
    },
  );
}

export function useDeleteCategoryMutation(
  options?: Partial<UseMutationOptions<void, Error, string>>,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) =>
      callbackApi<void>(categoriesPaths.delete(id), {
        method: 'DELETE',
        baseURL,
      }),
    ...options,
  });
}
