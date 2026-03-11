export type BulkRowFormValues = {
  date: string;
  subcategory_id: string;
  hangout_id: string;
  value: string;
  description: string;
};

export type BulkTransactionsDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  onSubmit: (body: {
    transactions: Array<{
      subcategory_id: string;
      value: number;
      description: string;
      date: string;
      hangout_id: string | null;
    }>;
  }) => Promise<void>;
  submitError: string | null;
  submitting: boolean;
  subcategoryOptions: {
    id: string;
    name: string;
    belongs_to_income: boolean;
  }[];
  hangoutOptions: { id: string; name: string }[];
}>;
