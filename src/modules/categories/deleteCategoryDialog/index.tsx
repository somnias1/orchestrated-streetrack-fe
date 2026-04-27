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
    <AlertDialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category</AlertDialogTitle>
        </AlertDialogHeader>
        <p
          className="text-sm text-muted-foreground"
          data-testid="delete-category-dialog-content"
        >
          Delete category «{name}»? This cannot be undone.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting} onClick={handleClose}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
