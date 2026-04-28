import { useQueryClient } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import type { AxiosError } from 'axios';
import { FilterX, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { CategoryCombobox } from '../../components/pickers/CategoryCombobox';
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useSubcategoriesQuery,
  useUpdateSubcategoryMutation,
} from '../../services/subcategories';
import { subcategoriesQueryKey } from '../../services/subcategories/constants';
import type { SubcategoryRead } from '../../services/subcategories/types';
import { DEFAULT_LIST_LIMIT } from '../../services/types';
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_TYPE_FILTER,
  type SubcategoryTypeFilter,
} from './constants';
import { DeleteSubcategoryDialog } from './deleteSubcategoryDialog';
import { useSubcategoriesStore } from './store';
import { SubcategoriesTable } from './subcategoriesTable';
import { SubcategoryFormDialog } from './subcategoryFormDialog';

export function Subcategories() {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] =
    useState<SubcategoryTypeFilter>(DEFAULT_TYPE_FILTER);
  const [categoryIdFilter, setCategoryIdFilter] =
    useState<string>(DEFAULT_CATEGORY_ID);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_LIST_LIMIT,
  });

  const queryParams = useMemo(() => {
    const params: {
      belongs_to_income?: boolean;
      category_id?: string;
      skip: number;
      limit: number;
    } = {
      skip: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
    };
    if (typeFilter !== 'all')
      params.belongs_to_income = typeFilter === 'income';
    if (categoryIdFilter) params.category_id = categoryIdFilter;
    return params;
  }, [typeFilter, categoryIdFilter, pagination]);

  const clearFilters = useCallback(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    setTypeFilter(DEFAULT_TYPE_FILTER);
    setCategoryIdFilter(DEFAULT_CATEGORY_ID);
  }, []);

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useSubcategoriesQuery(queryParams);
  const items = listData?.items ?? [];
  const total = listData?.total ?? 0;
  const setSubcategoriesFromQuery = useSubcategoriesStore(
    (s) => s.setFromQuery,
  );

  useEffect(() => {
    const err =
      isError && error instanceof Error
        ? error.message
        : isError
          ? 'Failed to load subcategories'
          : null;
    setSubcategoriesFromQuery(items, isLoading, err);
  }, [items, isLoading, isError, error, setSubcategoriesFromQuery]);

  const handleInvalidateSubcategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [subcategoriesQueryKey] });
  }, [queryClient]);

  const createMutation = useCreateSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
      toast.success('Subcategory created');
    },
  });
  const updateMutation = useUpdateSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
      toast.success('Subcategory updated');
    },
  });
  const deleteMutation = useDeleteSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
      toast.success('Subcategory deleted');
    },
    onError: (error) => {
      toast.error(
        (error as AxiosError)?.status === 409
          ? 'Cannot delete subcategory: it has transactions. Remove or reassign them first.'
          : 'Failed to delete subcategory',
      );
    },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [formInitial, setFormInitial] = useState<{
    category_id: string;
    name: string;
    description: string | null;
    belongs_to_income: boolean;
    is_periodic: boolean;
    due_day: number | null;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] =
    useState<SubcategoryRead | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : isError
        ? 'Failed to load subcategories'
        : null;

  const openCreate = useCallback(() => {
    setEditingSubcategoryId(null);
    setFormInitial(null);
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((subcategory: SubcategoryRead) => {
    setEditingSubcategoryId(subcategory.id);
    setFormInitial({
      category_id: subcategory.category_id,
      name: subcategory.name,
      description: subcategory.description,
      belongs_to_income: subcategory.belongs_to_income,
      is_periodic: subcategory.is_periodic,
      due_day: subcategory.due_day,
    });
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((subcategory: SubcategoryRead) => {
    setSubcategoryToDelete(subcategory);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: {
      category_id: string;
      name: string;
      description: string | null;
      belongs_to_income: boolean;
      is_periodic: boolean;
      due_day: number | null;
    }) => {
      setSubmitError(null);
      try {
        if (editingSubcategoryId === null) {
          await createMutation.mutateAsync(data);
        } else {
          await updateMutation.mutateAsync({
            id: editingSubcategoryId,
            body: data,
          });
        }
        setFormOpen(false);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
        throw err;
      }
    },
    [editingSubcategoryId, createMutation, updateMutation],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
      setDeleteOpen(false);
      setSubcategoryToDelete(null);
    },
    [deleteMutation],
  );

  const filtersActive =
    typeFilter !== DEFAULT_TYPE_FILTER ||
    categoryIdFilter !== DEFAULT_CATEGORY_ID;

  return (
    <div className="py-2 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          Subcategories{total > 0 ? ` (${total})` : ''}
        </h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create subcategory
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setPagination((p) => ({ ...p, pageIndex: 0 }));
            setTypeFilter(v as SubcategoryTypeFilter);
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

        <div className="w-56">
          <CategoryCombobox
            value={categoryIdFilter}
            onChange={(id) => {
              setPagination((p) => ({ ...p, pageIndex: 0 }));
              setCategoryIdFilter(id);
            }}
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        <Button
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          disabled={!filtersActive}
          aria-label="Clear filters"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>

      <SubcategoriesTable
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

      <SubcategoryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialValues={formInitial}
        onSubmit={handleFormSubmit}
        submitError={submitError}
      />

      <DeleteSubcategoryDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSubcategoryToDelete(null);
        }}
        subcategory={subcategoryToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
