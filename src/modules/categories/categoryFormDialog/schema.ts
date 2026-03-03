import { z } from 'zod';

/**
 * Zod schema for category form (create/edit). TECHSPEC §3.5.
 */
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable(),
  is_income: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
