import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type CategoryFormValues, categoryFormSchema } from './schema';
import type { CategoryFormDialogProps, CategoryFormPayload } from './types';

function toPayload(values: CategoryFormValues): CategoryFormPayload {
  return {
    name: values.name.trim(),
    description:
      values.description.trim() === '' ? null : values.description.trim(),
    is_income: values.is_income,
  };
}

export function CategoryFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: CategoryFormDialogProps) {
  const isEdit = initialValues !== null;
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: '', description: '', is_income: false },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        name: initialValues?.name ?? '',
        description: initialValues?.description ?? '',
        is_income: initialValues?.is_income ?? false,
      });
    }
  }, [open, initialValues, reset]);

  const onValid = useCallback(
    async (values: CategoryFormValues) => {
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
          <DialogTitle>
            {isEdit ? 'Edit category' : 'Create category'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col gap-4"
          >
            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input {...field} aria-label="Category name" />
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
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      aria-label="Category description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={field.value ? 'income' : 'expense'}
                    onValueChange={(v) => field.onChange(v === 'income')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
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
