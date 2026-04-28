import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HangoutCombobox } from '../../../components/pickers/HangoutCombobox';
import { SubcategoryCombobox } from '../../../components/pickers/SubcategoryCombobox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  type TransactionDialogFormValues,
  transactionDialogFormSchema,
} from './schema';
import type {
  TransactionFormDialogProps,
  TransactionFormPayload,
} from './types';

function toPayload(values: TransactionDialogFormValues): TransactionFormPayload {
  return {
    subcategory_id: values.subcategory_id.trim(),
    value: Number(values.value),
    description: values.description.trim(),
    date: values.date.trim(),
    hangout_id: values.hangout_id.trim() === '' ? null : values.hangout_id.trim(),
  };
}

export function TransactionFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: TransactionFormDialogProps) {
  const isEdit = initialValues !== null;
  const form = useForm<TransactionDialogFormValues>({
    resolver: zodResolver(transactionDialogFormSchema),
    defaultValues: {
      subcategory_id: '',
      value: '',
      description: '',
      date: '',
      hangout_id: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (open) {
      reset({
        subcategory_id: initialValues?.subcategory_id ?? '',
        value: initialValues?.value !== undefined ? String(initialValues.value) : '',
        description: initialValues?.description ?? '',
        date: initialValues?.date ?? '',
        hangout_id: initialValues?.hangout_id ?? '',
      });
    }
  }, [open, initialValues, reset]);

  const onValid = useCallback(
    async (values: TransactionDialogFormValues) => {
      try {
        await onSubmit(toPayload(values));
        onClose();
      } catch {
        // submitError prop surfaces the error
      }
    },
    [onSubmit, onClose],
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) onClose();
  }, [onClose, isSubmitting]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit transaction' : 'Create transaction'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}
            <FormField
              control={form.control}
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <FormControl>
                    <SubcategoryCombobox
                      value={field.value}
                      onChange={field.onChange}
                      queryEnabled={open}
                      aria-label="Subcategory"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step={1}
                      aria-label="Value"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} aria-label="Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" aria-label="Date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hangout_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hangout</FormLabel>
                  <FormControl>
                    <HangoutCombobox
                      value={field.value}
                      onChange={field.onChange}
                      queryEnabled={open}
                      aria-label="Hangout"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : isEdit ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
