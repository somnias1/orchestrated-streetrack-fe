import { z } from 'zod';

/**
 * Zod schema for hangout form (create/edit). TECHSPEC §3.5.
 * date: YYYY-MM-DD; description optional.
 */
export const hangoutFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().nullable(),
});

export type HangoutFormValues = z.infer<typeof hangoutFormSchema>;
