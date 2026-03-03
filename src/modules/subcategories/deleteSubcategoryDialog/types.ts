import type { SubcategoryRead } from '../../../services/subcategories/types';

export type DeleteSubcategoryDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  subcategory: SubcategoryRead | null;
  onConfirm: (id: string) => Promise<void>;
}>;
