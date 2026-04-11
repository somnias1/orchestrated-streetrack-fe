import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  HangoutAutocomplete,
  SubcategoryAutocomplete,
} from '../../../components/pickers';
import { themeTokens } from '../../../theme/tailwind';
import {
  type TransactionDialogFormValues,
  transactionDialogFormSchema,
} from './schema';
import type {
  TransactionFormDialogProps,
  TransactionFormPayload,
} from './types';

function toPayload(
  values: TransactionDialogFormValues,
): TransactionFormPayload {
  return {
    subcategory_id: values.subcategory_id.trim(),
    value: Number(values.value),
    description: values.description.trim(),
    date: values.date.trim(),
    hangout_id:
      values.hangout_id.trim() === '' ? null : values.hangout_id.trim(),
  };
}

export function TransactionFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: TransactionFormDialogProps) {
  const isEdit = initialValues !== null;
  const form = useForm<TransactionDialogFormValues>({
    resolver: zodResolver(transactionDialogFormSchema),
    defaultValues: {
      subcategory_id: '',
      value: '',
      description: '',
      date: '',
      hangout_id: '',
    },
  });

  const { control, handleSubmit, reset, formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (open) {
      reset({
        subcategory_id: initialValues?.subcategory_id ?? '',
        value:
          initialValues?.value !== undefined ? String(initialValues.value) : '',
        description: initialValues?.description ?? '',
        date: initialValues?.date ?? '',
        hangout_id: initialValues?.hangout_id ?? '',
      });
    }
  }, [open, initialValues, reset]);

  const onValid = useCallback(
    async (values: TransactionDialogFormValues) => {
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
          {isEdit ? 'Edit transaction' : 'Create transaction'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {submitError && <FormHelperText error>{submitError}</FormHelperText>}
          <Controller
            name="subcategory_id"
            control={control}
            render={({ field, fieldState }) => (
              <SubcategoryAutocomplete
                label="Subcategory"
                value={field.value}
                onChange={field.onChange}
                required
                queryEnabled={open}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="value"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Value"
                type="number"
                required
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                inputProps={{ 'aria-label': 'Transaction value', step: 1 }}
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
                label="Description"
                required
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                inputProps={{ 'aria-label': 'Transaction description' }}
                sx={{
                  '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                  '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
                }}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date"
                type="date"
                required
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'aria-label': 'Transaction date' }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: themeTokens.textPrimary,
                  },
                  '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
                }}
              />
            )}
          />
          <Controller
            name="hangout_id"
            control={control}
            render={({ field, fieldState }) => (
              <HangoutAutocomplete
                label="Hangout"
                value={field.value}
                onChange={field.onChange}
                allowEmpty
                queryEnabled={open}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
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
