import AddRounded from '@mui/icons-material/AddRounded';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { SubcategoryRead } from '../../services/subcategories/types';
import { themeTokens } from '../../theme/tailwind';
import { useCategoriesStore } from '../categories/store';
import { DeleteSubcategoryDialog } from './deleteSubcategoryDialog';
import { useSubcategoriesStore } from './store';
import { SubcategoriesTable } from './subcategoriesTable';
import { SubcategoryFormDialog } from './subcategoryFormDialog';

export function Subcategories() {
  const {
    items,
    loading,
    error,
    fetchSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  } = useSubcategoriesStore();
  const { items: categories, fetchCategories } = useCategoriesStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [formInitial, setFormInitial] = useState<{
    category_id: string;
    name: string;
    description: string | null;
    belongs_to_income: boolean;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] =
    useState<SubcategoryRead | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
    }) => {
      setSubmitError(null);
      try {
        if (editingSubcategoryId === null) {
          await createSubcategory(data);
        } else {
          await updateSubcategory(editingSubcategoryId, data);
        }
        setFormOpen(false);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
        throw err;
      }
    },
    [editingSubcategoryId, createSubcategory, updateSubcategory],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteSubcategory(id);
      setDeleteOpen(false);
      setSubcategoryToDelete(null);
    },
    [deleteSubcategory],
  );

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

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
      <SubcategoriesTable
        items={items}
        loading={loading}
        error={error}
        onRetry={fetchSubcategories}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <SubcategoryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialValues={formInitial}
        onSubmit={handleFormSubmit}
        submitError={submitError}
        categoryOptions={categoryOptions}
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
