import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { themeTokens } from '../../../theme/tailwind';
import { type HangoutFormValues, hangoutFormSchema } from './schema';
import type { HangoutFormDialogProps, HangoutFormPayload } from './types';

function toPayload(values: HangoutFormValues): HangoutFormPayload {
  return {
    name: values.name.trim(),
    date: values.date,
    description:
      values.description === null || values.description.trim() === ''
        ? null
        : values.description.trim(),
  };
}

export function HangoutFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: HangoutFormDialogProps) {
  const isEdit = initialValues !== null;
  const [name, setName] = useState(initialValues?.name ?? '');
  const [date, setDate] = useState(initialValues?.date ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? '');
      setDate(initialValues?.date ?? '');
      setDescription(initialValues?.description ?? '');
      setFieldErrors({});
    }
  }, [open, initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const raw = {
        name: name.trim(),
        date: date.trim(),
        description: description.trim() === '' ? null : description.trim(),
      };
      const parsed = hangoutFormSchema.safeParse(raw);
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
    [name, date, description, onSubmit, onClose],
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
          {isEdit ? 'Edit hangout' : 'Create hangout'}
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
            inputProps={{ 'aria-label': 'Hangout name' }}
            sx={{
              '& .MuiInputBase-input': { color: themeTokens.textPrimary },
              '& .MuiInputLabel-root': { color: themeTokens.textSecondary },
            }}
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
            error={Boolean(fieldErrors.date)}
            helperText={fieldErrors.date}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'aria-label': 'Hangout date' }}
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
            inputProps={{ 'aria-label': 'Hangout description' }}
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
