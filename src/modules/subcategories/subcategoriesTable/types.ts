import type { OnChangeFn, PaginationState } from '@tanstack/react-table';
import type { SubcategoryRead } from '../../../services/subcategories/types';

export type SubcategoriesTableProps = Readonly<{
  items: SubcategoryRead[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (subcategory: SubcategoryRead) => void;
  onDelete: (subcategory: SubcategoryRead) => void;
  total: number;
  pageIndex: number;
  pageSize: number;
  onPaginationChange: OnChangeFn<PaginationState>;
}>;
