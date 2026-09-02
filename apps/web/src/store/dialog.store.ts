import { create } from 'zustand';

type AppDialog =
  | { type: 'create-board' }
  | { type: 'load-board' }
  | { type: 'rename-board' }
  | { type: 'delete-board' }
  | { type: 'create-column' }
  | { type: 'rename-column'; columnId: string }
  | { type: 'delete-column'; columnId: string }
  | { type: 'create-card'; columnId: string }
  | { type: 'edit-card'; columnId: string; cardId: string }
  | { type: 'delete-card'; columnId: string; cardId: string };

interface DialogState {
  activeDialog: AppDialog | null;
  openDialog: (dialog: AppDialog) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>()((set) => ({
  activeDialog: null,
  openDialog: (activeDialog) => set({ activeDialog }),
  closeDialog: () => set({ activeDialog: null }),
}));
