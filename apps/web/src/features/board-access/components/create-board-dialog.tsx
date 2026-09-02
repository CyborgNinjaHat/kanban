import { createBoardBodySchema } from '@kanban/contracts';
import { useMutation } from '@tanstack/react-query';
import { createBoard } from '@/entities/board/api/board.api';
import { TitleFormDialog } from '@/shared/components/title-form-dialog';
import { useDialogStore } from '@/store/dialog.store';

import type { CreateBoardBody } from '@kanban/contracts';

interface CreateBoardDialogProps {
  onCreated: (boardId: string) => void;
}

export const CreateBoardDialog = ({ onCreated }: CreateBoardDialogProps) => {
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const createBoardMutation = useMutation({
    mutationFn: (data: CreateBoardBody) => createBoard(data),
  });

  const handleClose = () => {
    createBoardMutation.reset();
    closeDialog();
  };

  return (
    <TitleFormDialog
      title="Create board"
      description="Give your new board a short, recognizable name."
      schema={createBoardBodySchema}
      submitLabel="Create board"
      pendingLabel="Creating…"
      isPending={createBoardMutation.isPending}
      error={createBoardMutation.error}
      onErrorReset={createBoardMutation.reset}
      onClose={handleClose}
      onSubmit={(data) => {
        createBoardMutation.mutate(data, {
          onSuccess: (board) => {
            createBoardMutation.reset();
            closeDialog();
            onCreated(board.id);
          },
        });
      }}
    />
  );
};
