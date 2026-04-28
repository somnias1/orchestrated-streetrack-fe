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
import { type HangoutFormValues, hangoutFormSchema } from './schema';
import type { HangoutFormDialogProps, HangoutFormPayload } from './types';

function toPayload(values: HangoutFormValues): HangoutFormPayload {
  return {
    name: values.name.trim(),
    date: values.date.trim(),
    description:
      values.description === null || values.description.trim() === ''
        ? null
        : values.description.trim(),
  };
}

export function HangoutFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: HangoutFormDialogProps) {
  const isEdit = initialValues !== null;
  const form = useForm<HangoutFormValues>({
    resolver: zodResolver(hangoutFormSchema),
    defaultValues: {
      name: '',
      date: '',
      description: '',
    },
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
        date: initialValues?.date ?? '',
        description: initialValues?.description ?? '',
      });
    }
  }, [open, initialValues, reset]);

  const onValid = useCallback(
    async (values: HangoutFormValues) => {
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
            {isEdit ? 'Edit hangout' : 'Create hangout'}
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} aria-label="Hangout name" />
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      aria-label="Description"
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
