import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { CategoryCombobox } from '../../../components/pickers/CategoryCombobox';
import { useCategoryQuery } from '../../../services/categories';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  type SubcategoryDialogFormValues,
  subcategoryDialogFormSchema,
} from './schema';
import type { SubcategoryFormDialogProps, SubcategoryFormPayload } from './types';

function toPayload(values: SubcategoryDialogFormValues): SubcategoryFormPayload {
  const dueDayNum =
    values.due_day.trim() === '' ? null : Number.parseInt(values.due_day.trim(), 10);
  return {
    category_id: values.category_id,
    name: values.name.trim(),
    description: values.description.trim() === '' ? null : values.description.trim(),
    belongs_to_income: values.belongs_to_income,
    is_periodic: values.is_periodic,
    due_day: values.is_periodic ? dueDayNum : null,
  };
}

export function SubcategoryFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
}: SubcategoryFormDialogProps) {
  const isEdit = initialValues !== null;
  const form = useForm<SubcategoryDialogFormValues>({
    resolver: zodResolver(subcategoryDialogFormSchema),
    defaultValues: {
      category_id: '',
      name: '',
      description: '',
      belongs_to_income: false,
      is_periodic: false,
      due_day: '',
    },
  });

  const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = form;

  const categoryId = useWatch({ control, name: 'category_id' });
  const { data: selectedCategory } = useCategoryQuery(categoryId || undefined, {
    enabled: open && Boolean(categoryId),
  });

  useEffect(() => {
    if (open) {
      reset({
        category_id: initialValues?.category_id ?? '',
        name: initialValues?.name ?? '',
        description: initialValues?.description ?? '',
        belongs_to_income: false,
        is_periodic: initialValues?.is_periodic ?? false,
        due_day: initialValues?.due_day != null ? String(initialValues.due_day) : '',
      });
    }
  }, [open, initialValues, reset]);

  useEffect(() => {
    if (selectedCategory) {
      setValue('belongs_to_income', selectedCategory.is_income);
    }
  }, [selectedCategory, setValue]);

  const onValid = useCallback(
    async (values: SubcategoryDialogFormValues) => {
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

  const belongsToIncome = useWatch({ control, name: 'belongs_to_income' });
  const isPeriodic = useWatch({ control, name: 'is_periodic' });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit subcategory' : 'Create subcategory'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col gap-4"
            data-testid="subcategory-form-dialog-form"
          >
            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}
            <FormField
              control={control}
              name="category_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryCombobox
                      value={field.value}
                      onChange={field.onChange}
                      queryEnabled={open}
                      data-testid="subcategory-form-category"
                    />
                  </FormControl>
                  {fieldState.error && <FormMessage />}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label="Subcategory name"
                      data-testid="subcategory-form-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      aria-label="Subcategory description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedCategory && !belongsToIncome && (
              <FormField
                control={control}
                name="is_periodic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="is-periodic"
                      />
                    </FormControl>
                    <FormLabel htmlFor="is-periodic" className="font-normal cursor-pointer">
                      Periodic expense
                    </FormLabel>
                  </FormItem>
                )}
              />
            )}
            {isPeriodic && (
              <FormField
                control={control}
                name="due_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due day (1–31)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        aria-label="Due day (1–31)"
                        inputMode="numeric"
                        placeholder="e.g. 15"
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, '').slice(0, 2))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
