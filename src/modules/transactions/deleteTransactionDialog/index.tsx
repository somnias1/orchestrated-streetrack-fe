import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { themeTokens } from '../../../theme/tailwind';
import type { DeleteTransactionDialogProps } from './types';

export function DeleteTransactionDialog({
  open,
  onClose,
  transaction,
  onConfirm,
}: DeleteTransactionDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!transaction) return;
    setDeleting(true);
    try {
      await onConfirm(transaction.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
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
        Delete transaction
      </DialogTitle>
      <DialogContent sx={{ color: themeTokens.textSecondary }}>
        Delete this transaction? This cannot be undone.
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={deleting}
          sx={{ color: themeTokens.textSecondary }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={deleting}
          sx={{ backgroundColor: themeTokens.error }}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
