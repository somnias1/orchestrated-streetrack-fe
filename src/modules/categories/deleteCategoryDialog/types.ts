import type { CategoryRead } from '../../../services/categories/types';

export type DeleteCategoryDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  category: CategoryRead | null;
  onConfirm: (id: string) => Promise<void>;
}>;
