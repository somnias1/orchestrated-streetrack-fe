import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete transaction</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Delete this transaction? This cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
