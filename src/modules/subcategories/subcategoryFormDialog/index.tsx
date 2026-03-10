import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCategoriesQuery } from '../../../services/categories';
import { themeTokens } from '../../../theme/tailwind';
import { useCategoriesStore } from '../../categories/store';
import { type SubcategoryFormValues, subcategoryFormSchema } from './schema';
import type {
  SubcategoryFormDialogProps,
  SubcategoryFormPayload,
} from './types';

function toPayload(values: SubcategoryFormValues): SubcategoryFormPayload {
  return {
    category_id: values.category_id,
    name: values.name.trim(),
    description: values.description?.trim() || null,
    belongs_to_income: values.belongs_to_income,
  };
}

export function SubcategoryFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: SubcategoryFormDialogProps) {
  const isEdit = initialValues !== null;
  const { data: categories, isFetching } = useCategoriesQuery(undefined, {
    enabled: open,
  });
  const setCategoriesFromQuery = useCategoriesStore((s) => s.setFromQuery);

  const categoryOptions = useMemo(
    () =>
      (categories ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        is_income: category.is_income,
      })),
    [categories],
  );
  const [category_id, setCategoryId] = useState(
    initialValues?.category_id ?? '',
  );
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCategoriesFromQuery(categories ?? [], false, null);
  }, [categories, setCategoriesFromQuery]);

  useEffect(() => {
    if (open) {
      setCategoryId(initialValues?.category_id ?? '');
      setName(initialValues?.name ?? '');
      setDescription(initialValues?.description ?? '');
      setFieldErrors({});
    }
  }, [open, initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const raw = {
        category_id: category_id.trim(),
        name: name.trim(),
        description: description.trim() || null,
        belongs_to_income:
          categoryOptions.find((c) => c.id === category_id)?.is_income ?? false,
      };
      const parsed = subcategoryFormSchema.safeParse({
        category_id: raw.category_id,
        name: raw.name,
        description: raw.description === '' ? null : raw.description,
        belongs_to_income: raw.belongs_to_income,
      });
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const path = issue.path[0]?.toString() ?? 'form';
          if (!errors[path]) errors[path] = issue.message;
        }
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setSubmitting(true);
      try {
        await onSubmit(toPayload(parsed.data));
        onClose();
      } catch {
        // Store sets error; parent can pass submitError
      } finally {
        setSubmitting(false);
      }
    },
    [category_id, name, description, onSubmit, onClose, categoryOptions],
  );

  const handleClose = useCallback(() => {
    if (!submitting) onClose();
  }, [onClose, submitting]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: themeTokens.surface,
          border: `1px solid ${themeTokens.border}`,
          color: themeTokens.textPrimary,
        },
      }}
    >
      <form onSubmit={handleSubmit} data-testid="subcategory-form-dialog-form">
        <DialogTitle sx={{ color: themeTokens.textPrimary }}>
          {isEdit ? 'Edit subcategory' : 'Create subcategory'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          data-testid="subcategory-form-dialog-content"
        >
          {submitError && <FormHelperText error>{submitError}</FormHelperText>}
          <FormControl fullWidth error={Boolean(fieldErrors.category_id)}>
            <InputLabel
              id="subcategory-category-label"
              sx={{ color: themeTokens.textSecondary }}
            >
              Category
            </InputLabel>
            <Select
              labelId="subcategory-category-label"
              value={category_id}
              label="Category"
              disabled={isFetching}
              onChange={(e) => setCategoryId(e.target.value)}
              sx={{
                color: themeTokens.textPrimary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: themeTokens.border,
                },
              }}
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name} ({cat.is_income ? 'Income' : 'Expense'})
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.category_id && (
              <FormHelperText>{fieldErrors.category_id}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name}
            inputProps={{ 'aria-label': 'Subcategory name' }}
            sx={{
              '& .MuiInputBase-input': { color: themeTokens.textPrimary },
              '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            error={Boolean(fieldErrors.description)}
            helperText={fieldErrors.description}
            inputProps={{ 'aria-label': 'Subcategory description' }}
            sx={{
              '& .MuiInputBase-input': { color: themeTokens.textPrimary },
              '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            sx={{ color: themeTokens.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ backgroundColor: themeTokens.primary }}
          >
            {submitting ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
