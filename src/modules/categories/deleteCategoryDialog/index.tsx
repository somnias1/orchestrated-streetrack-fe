import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { themeTokens } from '../../../theme/tailwind';
import type { DeleteCategoryDialogProps } from './types';

export function DeleteCategoryDialog({
  open,
  onClose,
  category,
  onConfirm,
}: DeleteCategoryDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!category) return;
    setDeleting(true);
    try {
      await onConfirm(category.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) onClose();
  };

  const name = category?.name ?? '';

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
        Delete category
      </DialogTitle>
      <DialogContent sx={{ color: themeTokens.textSecondary }}>
        Delete category «{name}»? This cannot be undone.
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
