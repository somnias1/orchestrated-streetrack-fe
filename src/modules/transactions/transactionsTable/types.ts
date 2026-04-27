import type { OnChangeFn, PaginationState } from '@tanstack/react-table';
import type { TransactionRead } from '../../../services/transactions/types';

export type TransactionsTableProps = Readonly<{
  items: TransactionRead[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (transaction: TransactionRead) => void;
  onDelete: (transaction: TransactionRead) => void;
  total: number;
  pageIndex: number;
  pageSize: number;
  onPaginationChange: OnChangeFn<PaginationState>;
}>;
