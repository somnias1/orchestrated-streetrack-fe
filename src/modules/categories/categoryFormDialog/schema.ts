import { z } from 'zod';

/**
 * Zod schema for category form (create/edit). TECHSPEC §3.5.
 */
/** Form state uses string for description; payload maps empty to null in `toPayload`. */
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  is_income: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
