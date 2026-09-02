import { client } from '@/shared/api/http-client';

import type { RequestOptions } from '@/shared/api/http-client';
import type { CardDto, CreateCardBody, ReorderCardBody, UpdateCardBody } from '@kanban/contracts';

const cardsPath = (boardId: string, columnId: string) =>
  `/boards/${encodeURIComponent(boardId)}/columns/${encodeURIComponent(columnId)}/cards`;

const cardPath = (boardId: string, columnId: string, cardId: string) =>
  `${cardsPath(boardId, columnId)}/${encodeURIComponent(cardId)}`;

export const createCard = (
  boardId: string,
  columnId: string,
  data: CreateCardBody,
  options?: RequestOptions,
) => client.post<CardDto>(cardsPath(boardId, columnId), data, options);

export const updateCard = (
  boardId: string,
  columnId: string,
  cardId: string,
  data: UpdateCardBody,
  options?: RequestOptions,
) => client.patch<CardDto>(cardPath(boardId, columnId, cardId), data, options);

export const reorderCard = (
  boardId: string,
  sourceColumnId: string,
  cardId: string,
  data: ReorderCardBody,
  options?: RequestOptions,
) => client.patch<CardDto>(`${cardPath(boardId, sourceColumnId, cardId)}/reorder`, data, options);

export const deleteCard = (
  boardId: string,
  columnId: string,
  cardId: string,
  options?: RequestOptions,
) => client.delete(cardPath(boardId, columnId, cardId), options);
