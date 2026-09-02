import { boardViewQueryKey } from './board-view.query';

import type { BoardDto, BoardViewDto, CardDto, ColumnDto } from '@kanban/contracts';
import type { QueryClient } from '@tanstack/react-query';

const updateBoardView = (
  queryClient: QueryClient,
  boardId: string,
  update: (board: BoardViewDto) => BoardViewDto,
) => {
  queryClient.setQueryData<BoardViewDto>(boardViewQueryKey(boardId), (current) =>
    current ? update(current) : current,
  );
};

export const updateBoardInView = (queryClient: QueryClient, board: BoardDto) => {
  updateBoardView(queryClient, board.id, (current) => ({ ...current, ...board }));
};

export const addColumnToView = (queryClient: QueryClient, boardId: string, column: ColumnDto) => {
  updateBoardView(queryClient, boardId, (current) => ({
    ...current,
    columns: [...current.columns, { ...column, cards: [] }],
  }));
};

export const updateColumnInView = (
  queryClient: QueryClient,
  boardId: string,
  column: ColumnDto,
) => {
  updateBoardView(queryClient, boardId, (current) => ({
    ...current,
    columns: current.columns.map((currentColumn) =>
      currentColumn.id === column.id ? { ...currentColumn, ...column } : currentColumn,
    ),
  }));
};

export const removeColumnFromView = (
  queryClient: QueryClient,
  boardId: string,
  columnId: string,
) => {
  updateBoardView(queryClient, boardId, (current) => ({
    ...current,
    columns: current.columns.filter((column) => column.id !== columnId),
  }));
};

export const addCardToView = (
  queryClient: QueryClient,
  boardId: string,
  columnId: string,
  card: CardDto,
) => {
  updateBoardView(queryClient, boardId, (current) => ({
    ...current,
    columns: current.columns.map((column) =>
      column.id === columnId ? { ...column, cards: [...column.cards, card] } : column,
    ),
  }));
};

export const updateCardInView = (queryClient: QueryClient, boardId: string, card: CardDto) => {
  updateBoardView(queryClient, boardId, (current) => ({
    ...current,
    columns: current.columns.map((column) => ({
      ...column,
      cards: column.cards.map((currentCard) =>
        currentCard.id === card.id ? { ...currentCard, ...card } : currentCard,
      ),
    })),
  }));
};

export const removeCardFromView = (
  queryClient: QueryClient,
  boardId: string,
  columnId: string,
  cardId: string,
) => {
  updateBoardView(queryClient, boardId, (current) => ({
    ...current,
    columns: current.columns.map((column) =>
      column.id === columnId
        ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
        : column,
    ),
  }));
};
