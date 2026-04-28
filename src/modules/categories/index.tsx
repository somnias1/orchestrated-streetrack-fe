import { useQueryClient } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import type { AxiosError } from 'axios';
import { FilterX, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../../services/categories';
import { categoriesQueryKey } from '../../services/categories/constants';
import type { CategoryRead } from '../../services/categories/types';
import { DEFAULT_LIST_LIMIT } from '../../services/types';
import { CategoriesTable } from './categoriesTable';
import { CategoryFormDialog } from './categoryFormDialog';
import { type CategoryTypeFilter, DEFAULT_TYPE_FILTER } from './constants';
import { DeleteCategoryDialog } from './deleteCategoryDialog';
import { useCategoriesStore } from './store';

export function Categories() {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] =
    useState<CategoryTypeFilter>(DEFAULT_TYPE_FILTER);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_LIST_LIMIT,
  });

  const queryParams = useMemo(() => {
    const base = {
      skip: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
    };
    if (typeFilter === 'all') return base;
    return { ...base, is_income: typeFilter === 'income' };
  }, [typeFilter, pagination]);

  const clearFilters = useCallback(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    setTypeFilter(DEFAULT_TYPE_FILTER);
  }, []);

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategoriesQuery(queryParams);
  const items = listData?.items ?? [];
  const total = listData?.total ?? 0;
  const setFromQuery = useCategoriesStore((s) => s.setFromQuery);

  const handleInvalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [categoriesQueryKey] });
  }, [queryClient]);

  const createMutation = useCreateCategoryMutation({
    onSuccess: () => {
      handleInvalidate();
      toast.success('Category created');
    },
  });
  const updateMutation = useUpdateCategoryMutation({
    onSuccess: () => {
      handleInvalidate();
      toast.success('Category updated');
    },
  });
  const deleteMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      handleInvalidate();
      toast.success('Category deleted');
    },
    onError: (err) => {
      toast.error(
        (err as AxiosError)?.status === 409
          ? 'Cannot delete: category has subcategories. Remove or reassign them first.'
          : 'Failed to delete category',
      );
    },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInitial, setFormInitial] = useState<{
    name: string;
    description: string | null;
    is_income: boolean;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRead | null>(
    null,
  );

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Failed to load categories'
    : null;

  // Keep Zustand store in sync for global read access
  useMemo(() => {
    setFromQuery(items, isLoading, errorMessage);
  }, [items, isLoading, errorMessage, setFromQuery]);

  const openCreate = useCallback(() => {
    setEditingId(null);
    setFormInitial(null);
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((category: CategoryRead) => {
    setEditingId(category.id);
    setFormInitial({
      name: category.name,
      description: category.description,
      is_income: category.is_income,
    });
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((category: CategoryRead) => {
    setCategoryToDelete(category);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: {
      name: string;
      description: string | null;
      is_income: boolean;
    }) => {
      setSubmitError(null);
      try {
        if (editingId === null) {
          await createMutation.mutateAsync(data);
        } else {
          await updateMutation.mutateAsync({ id: editingId, body: data });
        }
        setFormOpen(false);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
        throw err;
      }
    },
    [editingId, createMutation, updateMutation],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
      setDeleteOpen(false);
      setCategoryToDelete(null);
    },
    [deleteMutation],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-foreground">
          Categories{total > 0 ? ` (${total})` : ''}
        </h1>
        <Button onClick={openCreate} data-testid="categories-add-button">
          <Plus className="h-4 w-4" />
          Create category
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setPagination((p) => ({ ...p, pageIndex: 0 }));
            setTypeFilter(v as CategoryTypeFilter);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          disabled={typeFilter === 'all'}
          aria-label="Clear filters"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>

      <CategoriesTable
        items={items}
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={openDelete}
        total={total}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
      />

      <CategoryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialValues={formInitial}
        onSubmit={handleFormSubmit}
        submitError={submitError}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setCategoryToDelete(null);
        }}
        category={categoryToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
