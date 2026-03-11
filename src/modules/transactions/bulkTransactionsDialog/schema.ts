import { z } from 'zod';

export const bulkRowSchema = z.object({
  subcategory_id: z.string().min(1, 'Subcategory is required'),
  value: z.coerce.number().int('Value must be an integer'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  hangout_id: z.string().nullable(),
});

export type BulkRowParsed = z.infer<typeof bulkRowSchema>;
