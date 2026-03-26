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
  Snackbar,
  TablePagination,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../../services/categories';
import { categoriesQueryKey } from '../../services/categories/constants';
import type { CategoryRead } from '../../services/categories/types';
import { DEFAULT_LIST_LIMIT } from '../../services/types';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../theme/tailwind';
import { CategoriesTable } from './categoriesTable';
import { CategoryFormDialog } from './categoryFormDialog';
import { type CategoryTypeFilter, DEFAULT_TYPE_FILTER } from './constants';
import { DeleteCategoryDialog } from './deleteCategoryDialog';
import { useCategoriesStore } from './store';

export function Categories() {
  const queryClient = useQueryClient();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [typeFilter, setTypeFilter] =
    useState<CategoryTypeFilter>(DEFAULT_TYPE_FILTER);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIST_LIMIT);

  const queryParams = useMemo(() => {
    const base = {
      skip: page * rowsPerPage,
      limit: rowsPerPage,
    };
    if (typeFilter === 'all') return base;
    return { ...base, is_income: typeFilter === 'income' };
  }, [typeFilter, page, rowsPerPage]);

  const clearFilters = useCallback(() => {
    setPage(0);
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

  useEffect(() => {
    const err =
      isError && error instanceof Error
        ? error.message
        : isError
          ? 'Failed to load categories'
          : null;
    setFromQuery(items, isLoading, err);
  }, [items, isLoading, isError, error, setFromQuery]);

  const handleCloseSnackBar = useCallback(() => {
    setShowSnackBar(false);
  }, []);
  const handleInvalidateCategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [categoriesQueryKey] });
  }, [queryClient]);
  const createMutation = useCreateCategoryMutation({
    onSuccess: () => {
      handleInvalidateCategories();
      setShowSnackBar(true);
      setSnackBarMessage('Category created');
    },
  });
  const updateMutation = useUpdateCategoryMutation({
    onSuccess: () => {
      handleInvalidateCategories();
      setShowSnackBar(true);
      setSnackBarMessage('Category updated');
    },
  });
  const deleteMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      handleInvalidateCategories();
      setShowSnackBar(true);
      setSnackBarMessage('Category deleted');
    },
    onError: (error) => {
      setShowSnackBar(true);
      setSnackBarMessage(
        (error as AxiosError)?.status === 409
          ? 'Cannot delete category: it has subcategories. Remove or reassign them first.'
          : 'Failed to delete category',
      );
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
          {total > 0 ? ` (${total})` : ''}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openCreate}
          sx={{ backgroundColor: themeTokens.primary }}
          data-testid="categories-add-button"
        >
          Create category
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl
          size="small"
          sx={{ minWidth: 140, ...selectFormControlSx }}
        >
          <InputLabel id="categories-type-filter-label">Type</InputLabel>
          <Select
            labelId="categories-type-filter-label"
            id="categories-type-filter"
            value={typeFilter}
            label="Type"
            onChange={(e) => {
              setPage(0);
              setTypeFilter(e.target.value as CategoryTypeFilter);
            }}
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
          disabled={typeFilter === 'all'}
        >
          <FilterAltOff />
        </IconButton>
      </Box>
      <CategoriesTable
        items={items}
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number.parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          color: themeTokens.textSecondary,
          borderTop: `1px solid ${themeTokens.border}`,
        }}
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
      <Snackbar
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
        autoHideDuration={1500}
        data-testid="categories-snackbar"
      />
    </Box>
  );
}
