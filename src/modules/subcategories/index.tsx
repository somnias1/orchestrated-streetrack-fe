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
import { useCategoriesQuery } from '../../services/categories';
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useSubcategoriesQuery,
  useUpdateSubcategoryMutation,
} from '../../services/subcategories';
import { subcategoriesQueryKey } from '../../services/subcategories/constants';
import type { SubcategoryRead } from '../../services/subcategories/types';
import { DEFAULT_LIST_LIMIT, PICKER_LIST_PARAMS } from '../../services/types';
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
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [typeFilter, setTypeFilter] =
    useState<SubcategoryTypeFilter>(DEFAULT_TYPE_FILTER);
  const [categoryIdFilter, setCategoryIdFilter] =
    useState<string>(DEFAULT_CATEGORY_ID);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIST_LIMIT);

  const { data: categoriesData } = useCategoriesQuery(PICKER_LIST_PARAMS);
  const categories = categoriesData?.items ?? [];

  const queryParams = useMemo(() => {
    const params: {
      belongs_to_income?: boolean;
      category_id?: string;
      skip: number;
      limit: number;
    } = {
      skip: page * rowsPerPage,
      limit: rowsPerPage,
    };
    if (typeFilter !== 'all')
      params.belongs_to_income = typeFilter === 'income';
    if (categoryIdFilter) params.category_id = categoryIdFilter;
    return params;
  }, [typeFilter, categoryIdFilter, page, rowsPerPage]);

  const clearFilters = useCallback(() => {
    setPage(0);
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

  const handleCloseSnackBar = useCallback(() => {
    setShowSnackBar(false);
  }, []);

  const handleInvalidateSubcategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [subcategoriesQueryKey] });
  }, [queryClient]);

  const createMutation = useCreateSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
      setShowSnackBar(true);
      setSnackBarMessage('Subcategory created');
    },
  });
  const updateMutation = useUpdateSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
      setShowSnackBar(true);
      setSnackBarMessage('Subcategory updated');
    },
  });
  const deleteMutation = useDeleteSubcategoryMutation({
    onSuccess: () => {
      handleInvalidateSubcategories();
      setShowSnackBar(true);
      setSnackBarMessage('Subcategory deleted');
    },
    onError: (error) => {
      setShowSnackBar(true);
      setSnackBarMessage(
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
          {total > 0 ? ` (${total})` : ''}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openCreate}
          sx={{ backgroundColor: themeTokens.primary }}
          data-testid="subcategories-add-button"
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
            onChange={(e) => {
              setPage(0);
              setTypeFilter(e.target.value as SubcategoryTypeFilter);
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
            onChange={(e) => {
              setPage(0);
              setCategoryIdFilter(e.target.value);
            }}
            sx={selectThemedSx}
            MenuProps={{
              PaperProps: { sx: { ...selectMenuPaperSx, maxHeight: 350 } },
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
      <Snackbar
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
        autoHideDuration={1500}
        data-testid="subcategories-snackbar"
      />
    </Box>
  );
}
