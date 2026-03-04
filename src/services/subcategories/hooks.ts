import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubcategory as createSubcategoryApi,
  deleteSubcategory as deleteSubcategoryApi,
  fetchSubcategories as fetchSubcategoriesApi,
  updateSubcategory as updateSubcategoryApi,
} from './index';
import type { SubcategoryUpdate } from './types';

export const subcategoriesQueryKey = ['subcategories'] as const;

type ListOptions = { skip?: number; limit?: number };

export function useSubcategoriesQuery(options?: ListOptions) {
  return useQuery({
    queryKey: [...subcategoriesQueryKey, options ?? {}],
    queryFn: () => fetchSubcategoriesApi(options),
  });
}

export function useCreateSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubcategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subcategoriesQueryKey });
    },
  });
}

export function useUpdateSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: SubcategoryUpdate }) =>
      updateSubcategoryApi(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subcategoriesQueryKey });
    },
  });
}

export function useDeleteSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubcategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subcategoriesQueryKey });
    },
  });
}
