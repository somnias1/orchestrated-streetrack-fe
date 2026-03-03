import { z } from 'zod';

/**
 * Zod schema for transaction form (create/edit). TECHSPEC §3.5.
 * value: integer (cents or base unit); date: YYYY-MM-DD.
 */
export const transactionFormSchema = z.object({
  subcategory_id: z.string().min(1, 'Subcategory is required'),
  value: z.coerce.number().int('Value must be an integer'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  hangout_id: z.string().nullable(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
