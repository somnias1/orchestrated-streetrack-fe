import type { CategoryRead } from '../../../services/categories/types';

export type CategoriesTableProps = Readonly<{
  items: CategoryRead[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (category: CategoryRead) => void;
  onDelete: (category: CategoryRead) => void;
}>;
