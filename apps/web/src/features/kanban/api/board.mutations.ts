import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBoardInView } from '@/entities/board/api/board-view.cache';
import { boardViewQueryKey } from '@/entities/board/api/board-view.query';
import { deleteBoard, updateBoard } from '@/entities/board/api/board.api';

import type { UpdateBoardBody } from '@kanban/contracts';

interface UpdateBoardVariables {
  boardId: string;
  data: UpdateBoardBody;
}

export const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }: UpdateBoardVariables) => updateBoard(boardId, data),
    onSuccess: (updatedBoard) => {
      updateBoardInView(queryClient, updatedBoard);
    },
  });
};

export const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardId: string) => deleteBoard(boardId),
    onSuccess: (_, boardId) => {
      queryClient.removeQueries({ queryKey: boardViewQueryKey(boardId), exact: true });
    },
  });
};
