import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addColumnToView,
  removeColumnFromView,
  updateColumnInView,
} from '@/entities/board/api/board-view.cache';
import {
  createColumn,
  deleteColumn,
  reorderColumn,
  updateColumn,
} from '@/entities/column/api/column.api';

import type { CreateColumnBody, ReorderColumnBody, UpdateColumnBody } from '@kanban/contracts';

interface CreateColumnVariables {
  boardId: string;
  data: CreateColumnBody;
}

interface UpdateColumnVariables {
  boardId: string;
  columnId: string;
  data: UpdateColumnBody;
}

interface DeleteColumnVariables {
  boardId: string;
  columnId: string;
}

interface ReorderColumnVariables {
  columnId: string;
  data: ReorderColumnBody;
}

export const useCreateColumnMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }: CreateColumnVariables) => createColumn(boardId, data),
    onSuccess: (createdColumn, { boardId }) => {
      addColumnToView(queryClient, boardId, createdColumn);
    },
  });
};

export const useUpdateColumnMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, columnId, data }: UpdateColumnVariables) =>
      updateColumn(boardId, columnId, data),
    onSuccess: (updatedColumn, { boardId }) => {
      updateColumnInView(queryClient, boardId, updatedColumn);
    },
  });
};

export const useDeleteColumnMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, columnId }: DeleteColumnVariables) => deleteColumn(boardId, columnId),
    onSuccess: (_, { boardId, columnId }) => {
      removeColumnFromView(queryClient, boardId, columnId);
    },
  });
};

export const useReorderColumnMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: `board-${boardId}-reorder` },
    mutationFn: ({ columnId, data }: ReorderColumnVariables) =>
      reorderColumn(boardId, columnId, data),
    onSuccess: (updatedColumn) => {
      updateColumnInView(queryClient, boardId, updatedColumn);
    },
  });
};
