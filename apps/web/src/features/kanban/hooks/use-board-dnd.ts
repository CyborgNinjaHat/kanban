import { KeyboardSensor, PointerSensor } from '@dnd-kit/dom';
import { move } from '@dnd-kit/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from 'sonner';
import { boardViewQueryKey } from '@/entities/board/api/board-view.query';
import { useReorderCardMutation } from '@/features/kanban/api/card.mutations';
import { useReorderColumnMutation } from '@/features/kanban/api/column.mutations';
import {
  applyBoardOrder,
  createBoardOrder,
  getCardMove,
  getColumnMove,
} from '@/features/kanban/model/board-order';

import type { DragDropEventHandlers } from '@dnd-kit/react';
import type { BoardViewDto } from '@kanban/contracts';

const sensors = [
  PointerSensor.configure({
    activatorElements(source) {
      return [source.element, source.handle];
    },
  }),
  KeyboardSensor,
];

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Could not save the new order.';

export const useBoardDragAndDrop = (boardId: string) => {
  const queryClient = useQueryClient();
  const rollbackSnapshot = useRef<BoardViewDto | undefined>(undefined);
  const reorderColumnMutation = useReorderColumnMutation(boardId);
  const reorderCardMutation = useReorderCardMutation(boardId);

  const clearSnapshot = () => {
    rollbackSnapshot.current = undefined;
  };

  const restoreSnapshot = () => {
    if (rollbackSnapshot.current) {
      queryClient.setQueryData(boardViewQueryKey(boardId), rollbackSnapshot.current);
    }

    clearSnapshot();
  };

  const handleReorderError = (error: unknown) => {
    restoreSnapshot();
    toast.error(getErrorMessage(error));
  };

  const settleReorder = () => {
    clearSnapshot();
    void queryClient.invalidateQueries({ queryKey: boardViewQueryKey(boardId), exact: true });
  };

  const handleDragStart: DragDropEventHandlers['onDragStart'] = () => {
    void queryClient.cancelQueries({ queryKey: boardViewQueryKey(boardId), exact: true });

    const board = queryClient.getQueryData<BoardViewDto>(boardViewQueryKey(boardId));
    rollbackSnapshot.current = board ? structuredClone(board) : undefined;
    reorderColumnMutation.reset();
    reorderCardMutation.reset();
  };

  const handleDragOver: DragDropEventHandlers['onDragOver'] = (event) => {
    const { source } = event.operation;

    if (!source) {
      return;
    }

    event.preventDefault();

    queryClient.setQueryData<BoardViewDto>(boardViewQueryKey(boardId), (current) => {
      if (!current) {
        return current;
      }

      const order = createBoardOrder(current);
      const nextOrder =
        source.type === 'column'
          ? { ...order, columnIds: move(order.columnIds, event) }
          : source.type === 'card'
            ? { ...order, cardIdsByColumn: move(order.cardIdsByColumn, event) }
            : order;

      return nextOrder === order ? current : applyBoardOrder(current, nextOrder);
    });
  };

  const handleDragEnd: DragDropEventHandlers['onDragEnd'] = (event) => {
    const { source } = event.operation;

    if (event.canceled) {
      restoreSnapshot();
      return;
    }

    if (!source || typeof source.id !== 'string' || !rollbackSnapshot.current) {
      clearSnapshot();
      return;
    }

    const board = queryClient.getQueryData<BoardViewDto>(boardViewQueryKey(boardId));

    if (!board) {
      restoreSnapshot();
      return;
    }

    const currentOrder = createBoardOrder(board);
    const previousOrder = createBoardOrder(rollbackSnapshot.current);

    if (source.type === 'column') {
      const data = getColumnMove(currentOrder, previousOrder, source.id);

      if (!data) {
        clearSnapshot();
        return;
      }

      reorderColumnMutation.mutate(
        { columnId: source.id, data },
        { onError: handleReorderError, onSettled: settleReorder },
      );
      return;
    }

    if (source.type === 'card') {
      const cardMove = getCardMove(currentOrder, previousOrder, source.id);

      if (cardMove) {
        reorderCardMutation.mutate(
          {
            sourceColumnId: cardMove.sourceColumnId,
            cardId: source.id,
            data: cardMove.data,
          },
          { onError: handleReorderError, onSettled: settleReorder },
        );
        return;
      }
    }

    clearSnapshot();
  };

  return {
    sensors,
    isDragDisabled: reorderColumnMutation.isPending || reorderCardMutation.isPending,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
