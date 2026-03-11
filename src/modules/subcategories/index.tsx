import AddRounded from '@mui/icons-material/AddRounded';
import FilterAltOff from '@mui/icons-material/FilterAltOff';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCategoriesQuery } from '../../services/categories';
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useSubcategoriesQuery,
  useUpdateSubcategoryMutation,
} from '../../services/subcategories';
import { subcategoriesQueryKey } from '../../services/subcategories/constants';
import type { SubcategoryRead } from '../../services/subcategories/types';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../theme/tailwind';
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
  const { data: categories = [] } = useCategoriesQuery();
  const queryParams = useMemo(() => {
    const params: { belongs_to_income?: boolean; category_id?: string } = {};
    if (typeFilter !== 'all')
      params.belongs_to_income = typeFilter === 'income';
    if (categoryIdFilter) params.category_id = categoryIdFilter;
    return Object.keys(params).length > 0 ? params : undefined;
  }, [typeFilter, categoryIdFilter]);

  const clearFilters = useCallback(() => {
    setTypeFilter(DEFAULT_TYPE_FILTER);
    setCategoryIdFilter(DEFAULT_CATEGORY_ID);
  }, []);

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useSubcategoriesQuery(queryParams);
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
    },
  });
  const updateMutation = useUpdateSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
    },
  });
  const deleteMutation = useDeleteSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
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
          Subcategories
          {items.length > 0 ? ` (${items.length})` : ''}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openCreate}
          sx={{ backgroundColor: themeTokens.primary }}
        >
          Create subcategory
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl
          size="small"
          sx={{ minWidth: 140, ...selectFormControlSx }}
        >
          <InputLabel id="subcategories-type-filter-label">Type</InputLabel>
          <Select
            labelId="subcategories-type-filter-label"
            id="subcategories-type-filter"
            value={typeFilter}
            label="Type"
            onChange={(e) =>
              setTypeFilter(e.target.value as SubcategoryTypeFilter)
            }
            sx={selectThemedSx}
            MenuProps={{
              PaperProps: { sx: selectMenuPaperSx },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: 180, ...selectFormControlSx }}
        >
          <InputLabel id="subcategories-category-filter-label">
            Category
          </InputLabel>
          <Select
            labelId="subcategories-category-filter-label"
            id="subcategories-category-filter"
            value={categoryIdFilter}
            label="Category"
            onChange={(e) => setCategoryIdFilter(e.target.value)}
            sx={selectThemedSx}
            MenuProps={{
              PaperProps: { sx: selectMenuPaperSx },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: themeTokens.border }}
        />
        <IconButton
          onClick={clearFilters}
          sx={{
            alignSelf: 'flex-start',
            color: themeTokens.textSecondary,
            '&.Mui-disabled': { color: themeTokens.disabled },
          }}
          disabled={
            typeFilter === 'all' && categoryIdFilter === DEFAULT_CATEGORY_ID
          }
        >
          <FilterAltOff />
        </IconButton>
      </Box>
      <SubcategoriesTable
        items={items}
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={openDelete}
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
    </Box>
  );
}
