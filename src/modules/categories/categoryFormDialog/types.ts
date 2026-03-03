export type CategoryFormPayload = {
  name: string;
  description: string | null;
  is_income: boolean;
};

export type CategoryFormDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  initialValues: CategoryFormPayload | null;
  onSubmit: (data: CategoryFormPayload) => Promise<void>;
  submitError: string | null;
}>;
