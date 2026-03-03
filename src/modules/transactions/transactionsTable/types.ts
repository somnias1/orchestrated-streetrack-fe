import type { TransactionRead } from '../../../services/transactions/types';

export type TransactionsTableProps = Readonly<{
  items: TransactionRead[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}>;
