import type { OnChangeFn, PaginationState } from '@tanstack/react-table';
import type { HangoutRead } from '../../../services/hangouts/types';

export type HangoutsTableProps = Readonly<{
  items: HangoutRead[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (hangout: HangoutRead) => void;
  onDelete: (hangout: HangoutRead) => void;
  total: number;
  pageIndex: number;
  pageSize: number;
  onPaginationChange: OnChangeFn<PaginationState>;
}>;
