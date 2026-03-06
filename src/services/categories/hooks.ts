import {
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  fetchCategories as fetchCategoriesApi,
  updateCategory as updateCategoryApi,
} from './index';
import type { CategoryUpdate, GetCategoriesResponse } from './types';

export const categoriesQueryKey = ['categories'] as const;

type ListOptions = { skip?: number; limit?: number };

export function useCategoriesQuery(
  options?: ListOptions,
  queryOptions?: Partial<
    UseQueryOptions<GetCategoriesResponse, Error, GetCategoriesResponse>
  >,
) {
  return useQuery<GetCategoriesResponse, Error, GetCategoriesResponse>({
    queryKey: [...categoriesQueryKey, options ?? {}],
    queryFn: () => fetchCategoriesApi(options),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CategoryUpdate }) =>
      updateCategoryApi(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
}
