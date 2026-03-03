import type { HangoutRead } from '../../../services/hangouts/types';

export type DeleteHangoutDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  hangout: HangoutRead | null;
  onConfirm: (id: string) => Promise<void>;
}>;
