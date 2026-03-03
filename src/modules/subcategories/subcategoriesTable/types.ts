import type { SubcategoryRead } from '../../../services/subcategories/types';

export type SubcategoriesTableProps = Readonly<{
  items: SubcategoryRead[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (subcategory: SubcategoryRead) => void;
  onDelete: (subcategory: SubcategoryRead) => void;
}>;
