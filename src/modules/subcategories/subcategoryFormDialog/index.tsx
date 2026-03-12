import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCategoriesQuery } from '../../../services/categories';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../../theme/tailwind';
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
    is_periodic: values.is_periodic,
    due_day: values.is_periodic ? values.due_day : null,
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
  const [is_periodic, setIsPeriodic] = useState(
    initialValues?.is_periodic ?? false,
  );
  const [due_day, setDueDay] = useState<string>(
    initialValues?.due_day != null ? String(initialValues.due_day) : '',
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
      setIsPeriodic(initialValues?.is_periodic ?? false);
      setDueDay(
        initialValues?.due_day != null ? String(initialValues.due_day) : '',
      );
      setFieldErrors({});
    }
  }, [open, initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const dueDayNum =
        due_day.trim() === '' ? null : Number.parseInt(due_day.trim(), 10);
      const raw = {
        category_id: category_id.trim(),
        name: name.trim(),
        description: description.trim() || null,
        belongs_to_income:
          categoryOptions.find((c) => c.id === category_id)?.is_income ?? false,
        is_periodic,
        due_day: dueDayNum,
      };
      const parsed = subcategoryFormSchema.safeParse({
        category_id: raw.category_id,
        name: raw.name,
        description: raw.description === '' ? null : raw.description,
        belongs_to_income: raw.belongs_to_income,
        is_periodic: raw.is_periodic,
        due_day: raw.due_day,
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
    [
      category_id,
      name,
      description,
      is_periodic,
      due_day,
      onSubmit,
      onClose,
      categoryOptions,
    ],
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
          <FormControl
            fullWidth
            error={Boolean(fieldErrors.category_id)}
            sx={selectFormControlSx}
          >
            <InputLabel id="subcategory-category-label">Category</InputLabel>
            <Select
              labelId="subcategory-category-label"
              value={category_id}
              label="Category"
              disabled={isFetching}
              onChange={(e) => setCategoryId(e.target.value)}
              sx={selectThemedSx}
              MenuProps={{
                PaperProps: { sx: { ...selectMenuPaperSx, maxHeight: 350 } },
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
          <FormControlLabel
            control={
              <Checkbox
                checked={is_periodic}
                onChange={(e) => setIsPeriodic(e.target.checked)}
                sx={{
                  color: themeTokens.textSecondary,
                  '&.Mui-checked': { color: themeTokens.primary },
                }}
              />
            }
            label="Periodic expense"
            sx={{ color: themeTokens.textPrimary }}
          />
          {is_periodic && (
            <TextField
              label="Due day (1–31)"
              value={due_day}
              onChange={(e) =>
                setDueDay(e.target.value.replace(/\D/g, '').slice(0, 2))
              }
              fullWidth
              type="text"
              inputMode="numeric"
              error={Boolean(fieldErrors.due_day)}
              helperText={fieldErrors.due_day}
              inputProps={{
                'aria-label': 'Due day (1–31)',
                min: 1,
                max: 31,
                placeholder: 'e.g. 15',
              }}
              sx={{
                '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
              }}
            />
          )}
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
