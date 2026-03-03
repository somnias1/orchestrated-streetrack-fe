export type TransactionFormPayload = {
  subcategory_id: string;
  value: number;
  description: string;
  date: string;
  hangout_id: string | null;
};

export type TransactionFormDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  initialValues: TransactionFormPayload | null;
  onSubmit: (data: TransactionFormPayload) => Promise<void>;
  submitError: string | null;
  subcategoryOptions: { id: string; name: string }[];
  hangoutOptions: { id: string; name: string }[];
}>;
