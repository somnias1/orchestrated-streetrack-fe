import type {
  TransactionImportPreview,
  TransactionImportRow,
} from '../../../services/transactionManager/types';
import type { TransactionCreate } from '../../../services/transactions/types';

export type ImportTransactionsDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  onPreview: (
    rows: TransactionImportRow[],
  ) => Promise<TransactionImportPreview>;
  onSubmit: (body: { transactions: TransactionCreate[] }) => Promise<void>;
  previewError: string | null;
  submitError: string | null;
  previewing: boolean;
  submitting: boolean;
}>;
