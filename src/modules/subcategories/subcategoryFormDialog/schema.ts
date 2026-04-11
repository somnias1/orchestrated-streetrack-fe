import { z } from 'zod';

/**
 * RHF dialog fields: `due_day` as input string; validated then mapped to API payload.
 */
export const subcategoryDialogFormSchema = z
  .object({
    category_id: z.string().min(1, 'Category is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    belongs_to_income: z.boolean(),
    is_periodic: z.boolean(),
    due_day: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.is_periodic || data.belongs_to_income) return;
    const trimmed = data.due_day.trim();
    const n = trimmed === '' ? Number.NaN : Number.parseInt(trimmed, 10);
    if (Number.isNaN(n) || n < 1 || n > 31) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Due day (1–31) is required for periodic expenses',
        path: ['due_day'],
      });
    }
  });

export type SubcategoryDialogFormValues = z.infer<
  typeof subcategoryDialogFormSchema
>;

/**
 * Zod schema for subcategory form (create/edit). TECHSPEC §3.5.
 * due_day (1–31) required when is_periodic is true.
 */
export const subcategoryFormSchema = z
  .object({
    category_id: z.string().min(1, 'Category is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable(),
    belongs_to_income: z.boolean(),
    is_periodic: z.boolean(),
    due_day: z
      .number()
      .int('Due day must be a whole number')
      .min(1, 'Due day must be 1–31')
      .max(31, 'Due day must be 1–31')
      .nullable(),
  })
  .refine(
    (data) =>
      !data.is_periodic ||
      (data.due_day != null && data.due_day >= 1 && data.due_day <= 31),
    {
      message: 'Due day (1–31) is required for periodic expenses',
      path: ['due_day'],
    },
  );

export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;
