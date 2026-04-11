import { zodResolver } from '@hookform/resolvers/zod';
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
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../../theme/tailwind';
import { type CategoryFormValues, categoryFormSchema } from './schema';
import type { CategoryFormDialogProps, CategoryFormPayload } from './types';

function toPayload(values: CategoryFormValues): CategoryFormPayload {
  return {
    name: values.name.trim(),
    description:
      values.description.trim() === '' ? null : values.description.trim(),
    is_income: values.is_income,
  };
}

export function CategoryFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: CategoryFormDialogProps) {
  const isEdit = initialValues !== null;
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      is_income: false,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        name: initialValues?.name ?? '',
        description: initialValues?.description ?? '',
        is_income: initialValues?.is_income ?? false,
      });
    }
  }, [open, initialValues, reset]);

  const onValid = useCallback(
    async (values: CategoryFormValues) => {
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
      <form onSubmit={handleSubmit(onValid)}>
        <DialogTitle sx={{ color: themeTokens.textPrimary }}>
          {isEdit ? 'Edit category' : 'Create category'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {submitError && <FormHelperText error>{submitError}</FormHelperText>}
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
                inputProps={{ 'aria-label': 'Category name' }}
                sx={selectFormControlSx}
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
                inputProps={{ 'aria-label': 'Category description' }}
                sx={selectFormControlSx}
              />
            )}
          />
          <Controller
            name="is_income"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl
                fullWidth
                error={Boolean(fieldState.error)}
                sx={selectFormControlSx}
              >
                <InputLabel id="category-type-label">Type</InputLabel>
                <Select
                  labelId="category-type-label"
                  value={field.value ? 'income' : 'expense'}
                  label="Type"
                  onChange={(e) => field.onChange(e.target.value === 'income')}
                  sx={selectThemedSx}
                  MenuProps={{ PaperProps: { sx: selectMenuPaperSx } }}
                >
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                </Select>
                {fieldState.error && (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
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
