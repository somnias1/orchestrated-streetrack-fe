import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo } from 'react';
import {
  type Control,
  Controller,
  type UseFieldArrayRemove,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { HangoutCombobox } from '../../../components/pickers/HangoutCombobox';
import { SubcategoryCombobox } from '../../../components/pickers/SubcategoryCombobox';
import { useHangoutsQuery } from '../../../services/hangouts';
import type { HangoutRead } from '../../../services/hangouts/types';
import { useSubcategoriesQuery } from '../../../services/subcategories';
import type { SubcategoryRead } from '../../../services/subcategories/types';
import { PICKER_LIST_PARAMS } from '../../../services/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  type BulkTransactionsFormValues,
  bulkTransactionsFormSchema,
} from './schema';
import type { BulkTransactionsDialogProps } from './types';

function getDefaultDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function makeEmptyRow() {
  return {
    date: getDefaultDate(),
    subcategory_id: '',
    hangout_id: '',
    value: '',
    description: '',
  };
}

type BulkTransactionRowProps = Readonly<{
  index: number;
  subcategoryOptions: SubcategoryRead[];
  hangoutOptions: HangoutRead[];
  queryEnabled: boolean;
  canRemove: boolean;
  submitting: boolean;
  remove: UseFieldArrayRemove;
  control: Control<BulkTransactionsFormValues>;
}>;

const BulkTransactionRow = memo(function BulkTransactionRow({
  index,
  subcategoryOptions,
  hangoutOptions,
  queryEnabled,
  canRemove,
  submitting,
  remove,
  control,
}: BulkTransactionRowProps) {
  return (
    <div className="grid gap-2 items-start" style={{ gridTemplateColumns: '140px 1fr 1fr 80px 1fr auto' }}>
      <Controller
        name={`rows.${index}.date`}
        control={control}
        render={({ field }) => (
          <Input {...field} type="date" aria-label={`Row ${index + 1} date`} className="h-9" />
        )}
      />
      <Controller
        name={`rows.${index}.subcategory_id`}
        control={control}
        render={({ field }) => (
          <SubcategoryCombobox
            value={field.value}
            onChange={field.onChange}
            externalOptions={subcategoryOptions}
            queryEnabled={queryEnabled}
            aria-label={`Row ${index + 1} subcategory`}
          />
        )}
      />
      <Controller
        name={`rows.${index}.hangout_id`}
        control={control}
        render={({ field }) => (
          <HangoutCombobox
            value={field.value}
            onChange={field.onChange}
            externalOptions={hangoutOptions}
            queryEnabled={queryEnabled}
            aria-label={`Row ${index + 1} hangout`}
          />
        )}
      />
      <Controller
        name={`rows.${index}.value`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            step={1}
            aria-label={`Row ${index + 1} value`}
            className="h-9"
          />
        )}
      />
      <Controller
        name={`rows.${index}.description`}
        control={control}
        render={({ field }) => (
          <Input {...field} aria-label={`Row ${index + 1} description`} className="h-9" />
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => remove(index)}
        disabled={!canRemove || submitting}
        aria-label={`Remove row ${index + 1}`}
        className="h-9 w-9 text-muted-foreground"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});

export function BulkTransactionsDialog({
  open,
  onClose,
  onSubmit,
  submitError,
  submitting,
}: BulkTransactionsDialogProps) {
  const { data: subcategoriesPage } = useSubcategoriesQuery(PICKER_LIST_PARAMS, { enabled: open });
  const { data: hangoutsPage } = useHangoutsQuery(PICKER_LIST_PARAMS, { enabled: open });

  const subcategoryOptions = useMemo(() => subcategoriesPage?.items ?? [], [subcategoriesPage?.items]);
  const hangoutOptions = useMemo(() => hangoutsPage?.items ?? [], [hangoutsPage?.items]);

  const form = useForm<BulkTransactionsFormValues>({
    resolver: zodResolver(bulkTransactionsFormSchema),
    defaultValues: { rows: [makeEmptyRow()] },
  });

  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'rows' });

  useEffect(() => {
    if (open) reset({ rows: [makeEmptyRow()] });
  }, [open, reset]);

  const onValid = useCallback(
    async (data: BulkTransactionsFormValues) => {
      const transactions = data.rows.map((row) => ({
        subcategory_id: row.subcategory_id.trim(),
        value: Number(row.value.trim()),
        description: row.description.trim(),
        date: row.date.trim(),
        hangout_id: row.hangout_id.trim() === '' ? null : row.hangout_id.trim(),
      }));
      try {
        await onSubmit({ transactions });
        onClose();
      } catch {
        // Parent sets submitError; dialog stays open
      }
    },
    [onSubmit, onClose],
  );

  const handleClose = useCallback(() => {
    if (!submitting) onClose();
  }, [onClose, submitting]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk create transactions</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
          <div className="flex flex-col gap-2 max-h-[45vh] overflow-auto">
            {fields.map((field, index) => (
              <BulkTransactionRow
                key={field.id}
                index={index}
                control={control}
                subcategoryOptions={subcategoryOptions}
                hangoutOptions={hangoutOptions}
                queryEnabled={open}
                canRemove={fields.length > 1}
                submitting={submitting}
                remove={remove}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append(makeEmptyRow())}
            className="self-start"
          >
            Add row
          </Button>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || fields.length === 0}>
              {submitting ? 'Creating…' : 'Create all'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
