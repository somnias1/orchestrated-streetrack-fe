import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TransactionImportPreview } from '../../../services/transactionManager/types';
import { parsePastedRows } from './parsePaste';
import type { ImportTransactionsDialogProps } from './types';

const PASTE_PLACEHOLDER =
  'Paste rows (tab-separated):\nDate\t$\tValue\tCategory\tSubcategory\t[Description]\n\nExample:\n07/03/2026\t$\t130.000,00\tExpenses\tHangout with friends';

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
      // Parent sets submitError; dialog stays open
    }
  }, [preview, onSubmit, onClose]);

  const handleClose = useCallback(() => {
    if (!previewing && !submitting) onClose();
  }, [onClose, previewing, submitting]);

  const errorMessage = previewError ?? previewRequestError ?? submitError;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import transactions</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Paste tab-separated rows: <strong>Date</strong>, <strong>$</strong>,{' '}
            <strong>Value</strong>, <strong>Category</strong>,{' '}
            <strong>Subcategory</strong>. Optional 6th column:{' '}
            <strong>Description</strong>.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.currentTarget.value)}
            placeholder={PASTE_PLACEHOLDER}
            rows={8}
            className="font-mono text-sm p-3 text-foreground bg-card border border-border rounded-md resize-y w-full"
            aria-label="Paste import data"
          />
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          {preview && (
            <div>
              <p className="text-sm text-foreground">
                Valid: {preview.transactions.length} · Invalid:{' '}
                {preview.invalid_rows.length}
              </p>
              {preview.invalid_rows.length > 0 && (
                <ul className="mt-1 pl-4 text-sm text-destructive list-disc">
                  {preview.invalid_rows.map((inv) => (
                    <li key={inv.row_index}>
                      Row {inv.row_index + 1}: {inv.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={previewing || submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            disabled={previewing || submitting || !pasteText.trim()}
          >
            {previewing ? 'Previewing…' : 'Preview'}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              previewing ||
              !preview ||
              preview.transactions.length === 0 ||
              preview.invalid_rows.length > 0
            }
          >
            {submitting
              ? 'Creating…'
              : `Create ${preview?.transactions.length ?? 0} transactions`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
