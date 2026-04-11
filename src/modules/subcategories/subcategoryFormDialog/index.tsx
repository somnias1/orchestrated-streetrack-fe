import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  TextField,
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { CategoryAutocomplete } from '../../../components/pickers';
import { useCategoryQuery } from '../../../services/categories';
import { themeTokens } from '../../../theme/tailwind';
import {
  type SubcategoryDialogFormValues,
  subcategoryDialogFormSchema,
} from './schema';
import type {
  SubcategoryFormDialogProps,
  SubcategoryFormPayload,
} from './types';

function toPayload(
  values: SubcategoryDialogFormValues,
): SubcategoryFormPayload {
  const dueDayNum =
    values.due_day.trim() === ''
      ? null
      : Number.parseInt(values.due_day.trim(), 10);
  return {
    category_id: values.category_id,
    name: values.name.trim(),
    description:
      values.description.trim() === '' ? null : values.description.trim(),
    belongs_to_income: values.belongs_to_income,
    is_periodic: values.is_periodic,
    due_day: values.is_periodic ? dueDayNum : null,
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
  const form = useForm<SubcategoryDialogFormValues>({
    resolver: zodResolver(subcategoryDialogFormSchema),
    defaultValues: {
      category_id: '',
      name: '',
      description: '',
      belongs_to_income: false,
      is_periodic: false,
      due_day: '',
    },
  });

  const { control, handleSubmit, reset, setValue, formState } = form;
  const { isSubmitting } = formState;

  const categoryId = useWatch({ control, name: 'category_id' });
  const { data: selectedCategory } = useCategoryQuery(categoryId || undefined, {
    enabled: open && Boolean(categoryId),
  });

  useEffect(() => {
    if (open) {
      reset({
        category_id: initialValues?.category_id ?? '',
        name: initialValues?.name ?? '',
        description: initialValues?.description ?? '',
        belongs_to_income: false,
        is_periodic: initialValues?.is_periodic ?? false,
        due_day:
          initialValues?.due_day != null ? String(initialValues.due_day) : '',
      });
    }
  }, [open, initialValues, reset]);

  useEffect(() => {
    if (selectedCategory) {
      setValue('belongs_to_income', selectedCategory.is_income);
    }
  }, [selectedCategory, setValue]);

  const onValid = useCallback(
    async (values: SubcategoryDialogFormValues) => {
      try {
        await onSubmit(toPayload(values));
        onClose();
      } catch {
        // Store sets error; parent can pass submitError
      }
    },
    [onSubmit, onClose],
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) onClose();
  }, [onClose, isSubmitting]);

  const belongsToIncome = useWatch({ control, name: 'belongs_to_income' });
  const isPeriodic = useWatch({ control, name: 'is_periodic' });

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
      <form
        onSubmit={handleSubmit(onValid)}
        data-testid="subcategory-form-dialog-form"
      >
        <DialogTitle sx={{ color: themeTokens.textPrimary }}>
          {isEdit ? 'Edit subcategory' : 'Create subcategory'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          data-testid="subcategory-form-dialog-content"
        >
          {submitError && <FormHelperText error>{submitError}</FormHelperText>}
          <Controller
            name="category_id"
            control={control}
            render={({ field, fieldState }) => (
              <CategoryAutocomplete
                label="Category"
                value={field.value}
                onChange={field.onChange}
                required
                queryEnabled={open}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                data-testid="subcategory-form-category"
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                required
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                inputProps={{
                  'aria-label': 'Subcategory name',
                  'data-testid': 'subcategory-form-name',
                }}
                sx={{
                  '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                  '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                label="Description"
                fullWidth
                multiline
                minRows={2}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                inputProps={{ 'aria-label': 'Subcategory description' }}
                sx={{
                  '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                  '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
                }}
              />
            )}
          />
          {selectedCategory && !belongsToIncome && (
            <Controller
              name="is_periodic"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      sx={{
                        color: themeTokens.textSecondary,
                        '&.Mui-checked': { color: themeTokens.primary },
                      }}
                    />
                  }
                  label="Periodic expense"
                  sx={{ color: themeTokens.textPrimary }}
                />
              )}
            />
          )}
          {isPeriodic && (
            <Controller
              name="due_day"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Due day (1–31)"
                  fullWidth
                  type="text"
                  inputMode="numeric"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, '').slice(0, 2),
                    )
                  }
                  inputProps={{
                    'aria-label': 'Due day (1–31)',
                    min: 1,
                    max: 31,
                    placeholder: 'e.g. 15',
                  }}
                  sx={{
                    '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                    '& .MuiInputLabel-root': {
                      color: themeTokens.textSecondary,
                    },
                  }}
                />
              )}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ color: themeTokens.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ backgroundColor: themeTokens.primary }}
          >
            {isSubmitting ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
