export type SubcategoryFormPayload = {
  category_id: string;
  name: string;
  description: string | null;
  belongs_to_income: boolean;
};

export type SubcategoryFormDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  initialValues: SubcategoryFormPayload | null;
  onSubmit: (data: SubcategoryFormPayload) => Promise<void>;
  submitError: string | null;
  categoryOptions: { id: string; name: string }[];
}>;
