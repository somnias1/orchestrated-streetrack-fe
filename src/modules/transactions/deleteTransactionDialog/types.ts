import type { TransactionRead } from '../../../services/transactions/types';

export type DeleteTransactionDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  transaction: TransactionRead | null;
  onConfirm: (id: string) => Promise<void>;
}>;
