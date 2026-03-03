import { z } from 'zod';

/**
 * Zod schema for subcategory form (create/edit). TECHSPEC §3.5.
 */
export const subcategoryFormSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable(),
  belongs_to_income: z.boolean(),
});

export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;
