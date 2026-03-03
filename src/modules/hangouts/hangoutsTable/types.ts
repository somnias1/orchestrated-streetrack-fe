import type { HangoutRead } from '../../../services/hangouts/types';

export type HangoutsTableProps = Readonly<{
  items: HangoutRead[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (hangout: HangoutRead) => void;
  onDelete: (hangout: HangoutRead) => void;
}>;
