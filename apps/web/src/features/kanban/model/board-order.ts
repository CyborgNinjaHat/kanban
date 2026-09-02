import type { BoardViewDto, ReorderCardBody, ReorderColumnBody } from '@kanban/contracts';

interface BoardOrder {
  columnIds: string[];
  cardIdsByColumn: Record<string, string[]>;
}

interface CardPosition {
  columnId: string;
  index: number;
}

interface CardMove {
  sourceColumnId: string;
  data: ReorderCardBody;
}

export const createBoardOrder = (board: BoardViewDto): BoardOrder => ({
  columnIds: board.columns.map((column) => column.id),
  cardIdsByColumn: Object.fromEntries(
    board.columns.map((column) => [column.id, column.cards.map((card) => card.id)]),
  ),
});

export const applyBoardOrder = (board: BoardViewDto, order: BoardOrder): BoardViewDto => {
  const columnsById = new Map(board.columns.map((column) => [column.id, column]));
  const cardsById = new Map(
    board.columns.flatMap((column) => column.cards.map((card) => [card.id, card] as const)),
  );

  const columns = order.columnIds.flatMap((columnId) => {
    const column = columnsById.get(columnId);

    if (!column) {
      return [];
    }

    const cards = (order.cardIdsByColumn[columnId] ?? []).flatMap((cardId) => {
      const card = cardsById.get(cardId);
      return card ? [{ ...card, columnId }] : [];
    });

    return [{ ...column, cards }];
  });

  return { ...board, columns };
};

export const getColumnMove = (
  current: BoardOrder,
  previous: BoardOrder,
  columnId: string,
): ReorderColumnBody | undefined => {
  const previousIndex = previous.columnIds.indexOf(columnId);
  const currentIndex = current.columnIds.indexOf(columnId);

  if (previousIndex === -1 || currentIndex === -1 || previousIndex === currentIndex) {
    return undefined;
  }

  return {
    beforeId: current.columnIds[currentIndex - 1] ?? null,
    afterId: current.columnIds[currentIndex + 1] ?? null,
  };
};

const findCard = (order: BoardOrder, cardId: string): CardPosition | undefined => {
  for (const [columnId, cardIds] of Object.entries(order.cardIdsByColumn)) {
    const index = cardIds.indexOf(cardId);

    if (index !== -1) {
      return { columnId, index };
    }
  }

  return undefined;
};

export const getCardMove = (
  current: BoardOrder,
  previous: BoardOrder,
  cardId: string,
): CardMove | undefined => {
  const source = findCard(previous, cardId);
  const destination = findCard(current, cardId);

  if (
    !source ||
    !destination ||
    (source.columnId === destination.columnId && source.index === destination.index)
  ) {
    return undefined;
  }

  const destinationCardIds = current.cardIdsByColumn[destination.columnId] ?? [];

  return {
    sourceColumnId: source.columnId,
    data: {
      columnId: destination.columnId,
      beforeId: destinationCardIds[destination.index - 1] ?? null,
      afterId: destinationCardIds[destination.index + 1] ?? null,
    },
  };
};
