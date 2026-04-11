import { z } from 'zod';

export const bulkRowSchema = z.object({
  subcategory_id: z.string().min(1, 'Subcategory is required'),
  value: z.coerce.number().int('Value must be an integer'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  hangout_id: z.string().nullable(),
});

export type BulkRowParsed = z.infer<typeof bulkRowSchema>;

const bulkRowFormFieldsSchema = z.object({
  date: z.string(),
  subcategory_id: z.string(),
  hangout_id: z.string(),
  value: z.string(),
  description: z.string(),
});

export const bulkTransactionsFormSchema = z
  .object({
    rows: z.array(bulkRowFormFieldsSchema).min(1, 'Add at least one row'),
  })
  .superRefine((data, ctx) => {
    for (let i = 0; i < data.rows.length; i++) {
      const row = data.rows[i];
      const raw = {
        subcategory_id: row.subcategory_id.trim(),
        value: row.value.trim() === '' ? Number.NaN : Number(row.value),
        description: row.description.trim(),
        date: row.date.trim(),
        hangout_id: row.hangout_id.trim() === '' ? null : row.hangout_id.trim(),
      };
      const parsed = bulkRowSchema.safeParse(raw);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0]?.toString() ?? 'form';
          ctx.addIssue({
            ...issue,
            path: ['rows', i, key],
          });
        }
      }
    }
  });

export type BulkTransactionsFormValues = z.infer<
  typeof bulkTransactionsFormSchema
>;
