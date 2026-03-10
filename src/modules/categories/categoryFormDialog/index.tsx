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
import { useCallback, useEffect, useState } from 'react';
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
    description: values.description?.trim() || null,
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
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [is_income, setIsIncome] = useState(initialValues?.is_income ?? false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? '');
      setDescription(initialValues?.description ?? '');
      setIsIncome(initialValues?.is_income ?? false);
      setFieldErrors({});
    }
  }, [open, initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const raw = {
        name: name.trim(),
        description: description.trim() || null,
        is_income,
      };
      const parsed = categoryFormSchema.safeParse({
        name: raw.name,
        description: raw.description === '' ? null : raw.description,
        is_income: raw.is_income,
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
    [name, description, is_income, onSubmit, onClose],
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
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: themeTokens.textPrimary }}>
          {isEdit ? 'Edit category' : 'Create category'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {submitError && <FormHelperText error>{submitError}</FormHelperText>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name}
            inputProps={{ 'aria-label': 'Category name' }}
            sx={selectFormControlSx}
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
            inputProps={{ 'aria-label': 'Category description' }}
            sx={selectFormControlSx}
          />
          <FormControl
            fullWidth
            error={Boolean(fieldErrors.is_income)}
            sx={selectFormControlSx}
          >
            <InputLabel id="category-type-label">Type</InputLabel>
            <Select
              labelId="category-type-label"
              value={is_income ? 'income' : 'expense'}
              label="Type"
              onChange={(e) => setIsIncome(e.target.value === 'income')}
              sx={selectThemedSx}
              MenuProps={{ PaperProps: { sx: selectMenuPaperSx } }}
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </Select>
            {fieldErrors.is_income && (
              <FormHelperText>{fieldErrors.is_income}</FormHelperText>
            )}
          </FormControl>
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
