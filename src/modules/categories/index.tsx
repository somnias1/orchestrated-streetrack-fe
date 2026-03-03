import AddRounded from '@mui/icons-material/AddRounded';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { CategoryRead } from '../../services/categories/types';
import { themeTokens } from '../../theme/tailwind';
import { CategoriesTable } from './categoriesTable';
import { CategoryFormDialog } from './categoryFormDialog';
import { DeleteCategoryDialog } from './deleteCategoryDialog';
import { useCategoriesStore } from './store';

export function Categories() {
  const {
    items,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoriesStore();

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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
          await createCategory(data);
        } else {
          await updateCategory(editingCategoryId, data);
        }
        setFormOpen(false);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
        throw err;
      }
    },
    [editingCategoryId, createCategory, updateCategory],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteCategory(id);
      setDeleteOpen(false);
      setCategoryToDelete(null);
    },
    [deleteCategory],
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
      <CategoriesTable
        items={items}
        loading={loading}
        error={error}
        onRetry={fetchCategories}
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
