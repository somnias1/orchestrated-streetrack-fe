import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { DeleteSubcategoryDialogProps } from './types';

export function DeleteSubcategoryDialog({
  open,
  onClose,
  subcategory,
  onConfirm,
}: DeleteSubcategoryDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!subcategory) return;
    setDeleting(true);
    try {
      await onConfirm(subcategory.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) onClose();
  };

  const name = subcategory?.name ?? '';

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete subcategory</AlertDialogTitle>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">
          Delete subcategory «{name}»? This cannot be undone.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting} onClick={handleClose}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
