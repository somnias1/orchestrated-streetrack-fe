import AddRounded from '@mui/icons-material/AddRounded';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../../services/categories';
import { categoriesQueryKey } from '../../services/categories/constants';
import type { CategoryRead } from '../../services/categories/types';
import { themeTokens } from '../../theme/tailwind';
import { CategoriesTable } from './categoriesTable';
import { CategoryFormDialog } from './categoryFormDialog';
import { DeleteCategoryDialog } from './deleteCategoryDialog';
import { useCategoriesStore } from './store';

export type CategoryTypeFilter = 'all' | 'income' | 'expense';

export function Categories() {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState<CategoryTypeFilter>('all');
  const queryParams = useMemo(() => {
    if (typeFilter === 'all') return undefined;
    return { is_income: typeFilter === 'income' };
  }, [typeFilter]);
  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCategoriesQuery(queryParams);
  const setFromQuery = useCategoriesStore((s) => s.setFromQuery);

  useEffect(() => {
    const err =
      isError && error instanceof Error
        ? error.message
        : isError
          ? 'Failed to load categories'
          : null;
    setFromQuery(items, isLoading, err);
  }, [items, isLoading, isError, error, setFromQuery]);
  const handleInvalidateCategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [categoriesQueryKey] });
  }, [queryClient]);
  const createMutation = useCreateCategoryMutation({
    onSuccess: () => {
      handleInvalidateCategories();
    },
  });
  const updateMutation = useUpdateCategoryMutation({
    onSuccess: () => {
      handleInvalidateCategories();
    },
  });
  const deleteMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      handleInvalidateCategories();
    },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [formInitial, setFormInitial] = useState<{
    name: string;
    description: string | null;
    is_income: boolean;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRead | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : isError
        ? 'Failed to load categories'
        : null;

  const openCreate = useCallback(() => {
    setEditingCategoryId(null);
    setFormInitial(null);
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((category: CategoryRead) => {
    setEditingCategoryId(category.id);
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
        if (editingCategoryId === null) {
          await createMutation.mutateAsync(data);
        } else {
          await updateMutation.mutateAsync({
            id: editingCategoryId,
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
    [editingCategoryId, createMutation, updateMutation],
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
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: themeTokens.textPrimary }}>
          Categories
          {items.length > 0 ? ` (${items.length})` : ''}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openCreate}
          sx={{ backgroundColor: themeTokens.primary }}
        >
          Create category
        </Button>
      </Box>
      <FormControl size="small" sx={{ minWidth: 140, mb: 2 }}>
        <InputLabel id="categories-type-filter-label">Type</InputLabel>
        <Select
          labelId="categories-type-filter-label"
          id="categories-type-filter"
          value={typeFilter}
          label="Type"
          onChange={(e) => setTypeFilter(e.target.value as CategoryTypeFilter)}
          sx={{ backgroundColor: themeTokens.surface }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>
      <CategoriesTable
        items={items}
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={openDelete}
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
    </Box>
  );
}
