import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addCardToView,
  removeCardFromView,
  updateCardInView,
} from '@/entities/board/api/board-view.cache';
import { createCard, deleteCard, reorderCard, updateCard } from '@/entities/card/api/card.api';

import type { CreateCardBody, ReorderCardBody, UpdateCardBody } from '@kanban/contracts';

interface CreateCardVariables {
  boardId: string;
  columnId: string;
  data: CreateCardBody;
}

interface UpdateCardVariables {
  boardId: string;
  columnId: string;
  cardId: string;
  data: UpdateCardBody;
}

interface DeleteCardVariables {
  boardId: string;
  columnId: string;
  cardId: string;
}

interface ReorderCardVariables {
  sourceColumnId: string;
  cardId: string;
  data: ReorderCardBody;
}

export const useCreateCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, columnId, data }: CreateCardVariables) =>
      createCard(boardId, columnId, data),
    onSuccess: (createdCard, { boardId, columnId }) => {
      addCardToView(queryClient, boardId, columnId, createdCard);
    },
  });
};

export const useUpdateCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, columnId, cardId, data }: UpdateCardVariables) =>
      updateCard(boardId, columnId, cardId, data),
    onSuccess: (updatedCard, { boardId }) => {
      updateCardInView(queryClient, boardId, updatedCard);
    },
  });
};

export const useDeleteCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, columnId, cardId }: DeleteCardVariables) =>
      deleteCard(boardId, columnId, cardId),
    onSuccess: (_data, { boardId, columnId, cardId }) => {
      removeCardFromView(queryClient, boardId, columnId, cardId);
    },
  });
};

export const useReorderCardMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: `board-${boardId}-reorder` },
    mutationFn: ({ sourceColumnId, cardId, data }: ReorderCardVariables) =>
      reorderCard(boardId, sourceColumnId, cardId, data),
    onSuccess: (updatedCard) => {
      updateCardInView(queryClient, boardId, updatedCard);
    },
  });
};
