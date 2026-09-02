import { createBoardBodySchema, createColumnBodySchema } from '@kanban/contracts';
import { useEffect } from 'react';
import {
  useDeleteBoardMutation,
  useUpdateBoardMutation,
} from '@/features/kanban/api/board.mutations';
import {
  useCreateCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from '@/features/kanban/api/card.mutations';
import {
  useCreateColumnMutation,
  useDeleteColumnMutation,
  useUpdateColumnMutation,
} from '@/features/kanban/api/column.mutations';
import { CardFormDialog } from '@/features/kanban/components/dialogs/card-form-dialog';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { TitleFormDialog } from '@/shared/components/title-form-dialog';
import { useDialogStore } from '@/store/dialog.store';

import type { BoardViewDto } from '@kanban/contracts';

interface KanbanDialogHostProps {
  board: BoardViewDto;
  onClose: () => void;
}

export const KanbanDialogHost = ({ board, onClose }: KanbanDialogHostProps) => {
  const activeDialog = useDialogStore((state) => state.activeDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const updateBoardMutation = useUpdateBoardMutation();
  const deleteBoardMutation = useDeleteBoardMutation();
  const createColumnMutation = useCreateColumnMutation();
  const updateColumnMutation = useUpdateColumnMutation();
  const deleteColumnMutation = useDeleteColumnMutation();
  const createCardMutation = useCreateCardMutation();
  const updateCardMutation = useUpdateCardMutation();
  const deleteCardMutation = useDeleteCardMutation();

  const selectedColumnId =
    activeDialog && 'columnId' in activeDialog ? activeDialog.columnId : undefined;
  const selectedColumn = board.columns.find((column) => column.id === selectedColumnId);
  const selectedCardId = activeDialog && 'cardId' in activeDialog ? activeDialog.cardId : undefined;
  const selectedCard = selectedColumn?.cards.find((card) => card.id === selectedCardId);
  const hasMissingColumn =
    (activeDialog?.type === 'rename-column' ||
      activeDialog?.type === 'delete-column' ||
      activeDialog?.type === 'create-card') &&
    !selectedColumn;
  const hasMissingCard =
    (activeDialog?.type === 'edit-card' || activeDialog?.type === 'delete-card') && !selectedCard;
  const hasMissingTarget = hasMissingColumn || hasMissingCard;

  useEffect(() => {
    if (hasMissingTarget) {
      closeDialog();
    }
  }, [closeDialog, hasMissingTarget]);

  const closeAndReset = (reset: () => void) => () => {
    reset();
    closeDialog();
  };

  const completeMutation = (reset: () => void, afterClose?: () => void) => {
    reset();
    closeDialog();
    afterClose?.();
  };

  if (activeDialog?.type === 'rename-board') {
    return (
      <TitleFormDialog
        title="Rename board"
        description="Choose a new name for this board."
        initialTitle={board.title}
        schema={createBoardBodySchema}
        submitLabel="Save name"
        pendingLabel="Saving…"
        isPending={updateBoardMutation.isPending}
        error={updateBoardMutation.error}
        onErrorReset={updateBoardMutation.reset}
        onClose={closeAndReset(updateBoardMutation.reset)}
        onSubmit={(data) => {
          updateBoardMutation.mutate(
            { boardId: board.id, data },
            { onSuccess: () => completeMutation(updateBoardMutation.reset) },
          );
        }}
      />
    );
  }

  if (activeDialog?.type === 'delete-board') {
    return (
      <ConfirmDialog
        title={`Delete “${board.title}”?`}
        description="This permanently deletes the board and all of its columns and cards. This action cannot be undone."
        isPending={deleteBoardMutation.isPending}
        errorMessage={deleteBoardMutation.error?.message}
        onClose={closeAndReset(deleteBoardMutation.reset)}
        onConfirm={() => {
          deleteBoardMutation.mutate(board.id, {
            onSuccess: () => completeMutation(deleteBoardMutation.reset, onClose),
          });
        }}
      />
    );
  }

  if (activeDialog?.type === 'create-column') {
    return (
      <TitleFormDialog
        title="Add column"
        description="Add a new column to this board."
        schema={createColumnBodySchema}
        submitLabel="Add column"
        pendingLabel="Adding…"
        isPending={createColumnMutation.isPending}
        error={createColumnMutation.error}
        onErrorReset={createColumnMutation.reset}
        onClose={closeAndReset(createColumnMutation.reset)}
        onSubmit={(data) => {
          createColumnMutation.mutate(
            { boardId: board.id, data },
            { onSuccess: () => completeMutation(createColumnMutation.reset) },
          );
        }}
      />
    );
  }

  if (activeDialog?.type === 'rename-column' && selectedColumn) {
    return (
      <TitleFormDialog
        title="Rename column"
        description="Choose a new name for this column."
        initialTitle={selectedColumn.title}
        schema={createColumnBodySchema}
        submitLabel="Save name"
        pendingLabel="Saving…"
        isPending={updateColumnMutation.isPending}
        error={updateColumnMutation.error}
        onErrorReset={updateColumnMutation.reset}
        onClose={closeAndReset(updateColumnMutation.reset)}
        onSubmit={(data) => {
          updateColumnMutation.mutate(
            { boardId: board.id, columnId: selectedColumn.id, data },
            { onSuccess: () => completeMutation(updateColumnMutation.reset) },
          );
        }}
      />
    );
  }

  if (activeDialog?.type === 'delete-column' && selectedColumn) {
    return (
      <ConfirmDialog
        title={`Delete “${selectedColumn.title}”?`}
        description="This permanently deletes the column and every card it contains. This action cannot be undone."
        isPending={deleteColumnMutation.isPending}
        errorMessage={deleteColumnMutation.error?.message}
        onClose={closeAndReset(deleteColumnMutation.reset)}
        onConfirm={() => {
          deleteColumnMutation.mutate(
            { boardId: board.id, columnId: selectedColumn.id },
            { onSuccess: () => completeMutation(deleteColumnMutation.reset) },
          );
        }}
      />
    );
  }

  if (activeDialog?.type === 'create-card' && selectedColumn) {
    return (
      <CardFormDialog
        mode="create"
        isPending={createCardMutation.isPending}
        error={createCardMutation.error}
        onErrorReset={createCardMutation.reset}
        onClose={closeAndReset(createCardMutation.reset)}
        onSubmit={(data) => {
          createCardMutation.mutate(
            { boardId: board.id, columnId: selectedColumn.id, data },
            { onSuccess: () => completeMutation(createCardMutation.reset) },
          );
        }}
      />
    );
  }

  if (activeDialog?.type === 'edit-card' && selectedColumn && selectedCard) {
    return (
      <CardFormDialog
        mode="edit"
        initialTitle={selectedCard.title}
        initialDescription={selectedCard.description}
        isPending={updateCardMutation.isPending}
        error={updateCardMutation.error}
        onErrorReset={updateCardMutation.reset}
        onClose={closeAndReset(updateCardMutation.reset)}
        onSubmit={(data) => {
          updateCardMutation.mutate(
            {
              boardId: board.id,
              columnId: selectedColumn.id,
              cardId: selectedCard.id,
              data,
            },
            { onSuccess: () => completeMutation(updateCardMutation.reset) },
          );
        }}
      />
    );
  }

  if (activeDialog?.type === 'delete-card' && selectedColumn && selectedCard) {
    return (
      <ConfirmDialog
        title={`Delete “${selectedCard.title}”?`}
        description="This permanently deletes the card. This action cannot be undone."
        isPending={deleteCardMutation.isPending}
        errorMessage={deleteCardMutation.error?.message}
        onClose={closeAndReset(deleteCardMutation.reset)}
        onConfirm={() => {
          deleteCardMutation.mutate(
            {
              boardId: board.id,
              columnId: selectedColumn.id,
              cardId: selectedCard.id,
            },
            { onSuccess: () => completeMutation(deleteCardMutation.reset) },
          );
        }}
      />
    );
  }

  return null;
};
