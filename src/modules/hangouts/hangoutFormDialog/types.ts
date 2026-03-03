export type HangoutFormPayload = {
  name: string;
  date: string;
  description: string | null;
};

export type HangoutFormDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  initialValues: HangoutFormPayload | null;
  onSubmit: (data: HangoutFormPayload) => Promise<void>;
  submitError: string | null;
}>;
