import { InternalServerError, NotFoundError } from '../../common/error/app-error.js';
import { maxRank, minRank, rankBetween, resolveNeighbors } from '../../common/ranking/rank.js';
import { dbContext } from '../../database-access/db-context.js';

import type { DbContext } from '../../database-access/db-context.js';

type CreateCardInput = {
  title: string;
  description: string;
};

type UpdateCardInput = Partial<CreateCardInput>;

type ReorderCardInput = {
  columnId: string;
  beforeId: string | null;
  afterId: string | null;
};

export class CardService {
  private readonly db: DbContext;

  constructor(db: DbContext = dbContext) {
    this.db = db;
  }

  async getCards(boardId: string, columnId: string) {
    await this.ensureColumn(boardId, columnId);
    const cards = await this.db.cards.findManyByColumnId(columnId);
    return cards;
  }

  async getCardById(boardId: string, columnId: string, cardId: string) {
    await this.ensureColumn(boardId, columnId);
    const card = await this.db.cards.findById(cardId);

    if (!card || card.columnId !== columnId) {
      throw new NotFoundError('Card not found');
    }

    return card;
  }

  async getCardsByColumnIds(columnIds: string[]) {
    const cards = await this.db.cards.findManyByColumnIds(columnIds);
    const cardsByColumn = new Map<string, typeof cards>();

    for (const card of cards) {
      const columnCards = cardsByColumn.get(card.columnId) ?? [];
      columnCards.push(card);
      cardsByColumn.set(card.columnId, columnCards);
    }

    return cardsByColumn;
  }

  async createCard(boardId: string, columnId: string, dto: CreateCardInput) {
    const board = await this.ensureBoard(boardId);

    return this.db.transaction(async (transactionContext) => {
      const column = await transactionContext.columns.findByIdForUpdate(columnId);

      if (!column || column.boardId !== board.id) {
        throw new NotFoundError('Column not found');
      }

      const cards = await transactionContext.cards.findManyByColumnId(column.id);
      const previousRank = cards.at(-1)?.rank ?? minRank();
      const rank = rankBetween(previousRank, maxRank());

      const card = await transactionContext.cards.create({
        ...dto,
        columnId,
        rank,
      });

      if (!card) {
        throw new InternalServerError('Card could not be created');
      }

      return card;
    });
  }

  async updateCard(boardId: string, columnId: string, cardId: string, dto: UpdateCardInput) {
    const card = await this.getCardById(boardId, columnId, cardId);

    if (Object.keys(dto).length === 0) {
      return card;
    }

    const data: { title?: string; description?: string } = {};

    if (dto.title !== undefined) {
      data.title = dto.title;
    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    const updatedCard = await this.db.cards.update(card.id, data);

    if (!updatedCard) {
      throw new NotFoundError('Card not found');
    }

    return updatedCard;
  }

  async reorderCard(
    boardId: string,
    sourceColumnId: string,
    cardId: string,
    dto: ReorderCardInput,
  ) {
    const board = await this.ensureBoard(boardId);

    return this.db.transaction(async (transactionContext) => {
      const requestedIds = [...new Set([sourceColumnId, dto.columnId])];

      const columns = await transactionContext.columns.findManyByIdsForUpdate(requestedIds);

      if (
        columns.length !== requestedIds.length ||
        columns.some((column) => column.boardId !== board.id)
      ) {
        throw new NotFoundError('Column not found');
      }

      const card = await transactionContext.cards.findByIdForUpdate(cardId);

      if (!card || card.columnId !== sourceColumnId) {
        throw new NotFoundError('Card not found');
      }

      const cards = await transactionContext.cards.findManyByColumnId(dto.columnId);

      const { before, after } = resolveNeighbors(
        cards,
        dto,
        card.columnId === dto.columnId ? card.id : undefined,
      );
      const rank = rankBetween(before?.rank ?? minRank(), after?.rank ?? maxRank());

      const updatedCard = await transactionContext.cards.update(card.id, {
        columnId: dto.columnId,
        rank,
      });

      if (!updatedCard) {
        throw new NotFoundError('Card not found');
      }

      return updatedCard;
    });
  }

  async deleteCard(boardId: string, columnId: string, cardId: string) {
    const card = await this.getCardById(boardId, columnId, cardId);
    const deletedCard = await this.db.cards.delete(card.id);

    if (!deletedCard) {
      throw new NotFoundError('Card not found');
    }

    return deletedCard;
  }

  private async ensureColumn(boardId: string, columnId: string) {
    const board = await this.ensureBoard(boardId);

    const column = await this.db.columns.findById(columnId);

    if (!column || column.boardId !== board.id) {
      throw new NotFoundError('Column not found');
    }

    return column;
  }

  private async ensureBoard(boardId: string) {
    const board = await this.db.boards.findById(boardId);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    return board;
  }
}

export const cardService = new CardService();
