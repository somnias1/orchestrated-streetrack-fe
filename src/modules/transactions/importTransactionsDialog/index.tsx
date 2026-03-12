import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { TransactionImportPreview } from '../../../services/transactionManager/types';
import { themeTokens } from '../../../theme/tailwind';
import { parsePastedRows } from './parsePaste';
import type { ImportTransactionsDialogProps } from './types';

const PASTE_PLACEHOLDER =
  'Paste rows (tab-separated):\nDate	$	Value	Category	Subcategory	[Description]\n\nExample with description:\n07/03/2026	$	130.000,00	Expenses	Hangout with friends';

export function ImportTransactionsDialog({
  open,
  onClose,
  onPreview,
  onSubmit,
  previewError,
  submitError,
  previewing,
  submitting,
}: ImportTransactionsDialogProps) {
  const [pasteText, setPasteText] = useState('');
  const [preview, setPreview] = useState<TransactionImportPreview | null>(null);
  const [previewRequestError, setPreviewRequestError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setPasteText('');
      setPreview(null);
      setPreviewRequestError(null);
    }
  }, [open]);

  const handlePreview = useCallback(async () => {
    const rows = parsePastedRows(pasteText);
    if (rows.length === 0) {
      setPreviewRequestError(
        'Paste at least one row (Category, Subcategory, Value, Description, Date).',
      );
      setPreview(null);
      return;
    }
    setPreviewRequestError(null);
    try {
      const result = await onPreview(rows);
      setPreview(result);
    } catch {
      setPreview(null);
    }
  }, [pasteText, onPreview]);

  const handleSubmit = useCallback(async () => {
    if (!preview || preview.transactions.length === 0) return;
    try {
      await onSubmit({ transactions: preview.transactions });
      onClose();
    } catch {
      // Parent sets submitError; dialog stays open for retry
    }
  }, [preview, onSubmit, onClose]);

  const handleClose = useCallback(() => {
    if (!previewing && !submitting) onClose();
  }, [onClose, previewing, submitting]);

  const errorMessage = previewError ?? previewRequestError ?? submitError;

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
      <DialogTitle sx={{ color: themeTokens.textPrimary }}>
        Import transactions
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" sx={{ color: themeTokens.textSecondary }}>
          Paste tab-separated rows: <strong>Date</strong>, <strong>$</strong>,{' '}
          <strong>Value</strong>, <strong>Category</strong>,{' '}
          <strong>Subcategory</strong>. Optional 6th column:{' '}
          <strong>Description</strong> (if omitted, subcategory is used). Names
          must match your existing categories/subcategories.
        </Typography>
        <Box
          component="textarea"
          value={pasteText}
          onChange={(e) => setPasteText(e.currentTarget.value)}
          placeholder={PASTE_PLACEHOLDER}
          rows={8}
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            p: 1.5,
            color: themeTokens.textPrimary,
            backgroundColor: themeTokens.surface,
            border: `1px solid ${themeTokens.border}`,
            borderRadius: 1,
            resize: 'vertical',
          }}
          aria-label="Paste import data"
        />
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        {preview && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: themeTokens.textPrimary }}>
              Valid: {preview.transactions.length} · Invalid:{' '}
              {preview.invalid_rows.length}
            </Typography>
            {preview.invalid_rows.length > 0 && (
              <Box
                component="ul"
                sx={{
                  mt: 0.5,
                  pl: 2,
                  color: themeTokens.error,
                  fontSize: '0.875rem',
                }}
              >
                {preview.invalid_rows.map((inv) => (
                  <li key={inv.row_index}>
                    Row {inv.row_index + 1}: {inv.message}
                  </li>
                ))}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          type="button"
          onClick={handleClose}
          disabled={previewing || submitting}
          sx={{ color: themeTokens.textSecondary }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={handlePreview}
          disabled={previewing || submitting || !pasteText.trim()}
          sx={{
            color: themeTokens.textPrimary,
            '&:disabled': {
              color: themeTokens.disabled,
            },
          }}
        >
          {previewing ? 'Previewing…' : 'Preview'}
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={handleSubmit}
          disabled={
            submitting ||
            previewing ||
            !preview ||
            preview.transactions.length === 0 ||
            preview.invalid_rows.length > 0
          }
          sx={{
            backgroundColor: themeTokens.primary,
            '&:disabled': {
              backgroundColor: themeTokens.disabled,
            },
          }}
        >
          {submitting
            ? 'Creating…'
            : `Create ${preview?.transactions.length ?? 0} transactions`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
