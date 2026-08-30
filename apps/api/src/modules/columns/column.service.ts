import { InternalServerError, NotFoundError } from '../../common/error/app-error.js';
import {
  maxRank,
  middleRank,
  minRank,
  rankBetween,
  resolveNeighbors,
} from '../../common/ranking/rank.js';
import { dbContext } from '../../database-access/db-context.js';
import { CardService } from '../cards/card.service.js';

import type { DbContext } from '../../database-access/db-context.js';

type CreateColumnInput = {
  title: string;
};

type UpdateColumnInput = Partial<CreateColumnInput>;

type ReorderColumnInput = {
  beforeId: string | null;
  afterId: string | null;
};

export class ColumnService {
  private readonly db: DbContext;
  private readonly cardService: CardService;

  constructor(db: DbContext = dbContext, cardService: CardService = new CardService(db)) {
    this.db = db;
    this.cardService = cardService;
  }

  async getColumnById(boardId: string, columnId: string) {
    await this.ensureBoard(boardId);
    const column = await this.db.columns.findById(columnId);

    if (!column || column.boardId !== boardId) {
      throw new NotFoundError('Column not found');
    }

    return column;
  }

  async getAllColumns(boardId: string) {
    await this.ensureBoard(boardId);

    const columns = await this.db.columns.findManyByBoardId(boardId);
    return columns;
  }

  async getColumnsWithCards(boardId: string) {
    await this.ensureBoard(boardId);

    const columns = await this.db.columns.findManyByBoardId(boardId);
    const cardsByColumn = await this.cardService.getCardsByColumnIds(
      columns.map((column) => column.id),
    );

    return columns.map((column) =>
      Object.assign({}, column, {
        cards: cardsByColumn.get(column.id) ?? [],
      }),
    );
  }

  async createColumn(boardId: string, dto: CreateColumnInput) {
    return this.db.transaction(async (transactionContext) => {
      const board = await transactionContext.boards.findByIdForUpdate(boardId);

      if (!board) {
        throw new NotFoundError('Board not found');
      }

      const columns = await transactionContext.columns.findManyByBoardId(board.id);
      const previousRank = columns.at(-1)?.rank ?? minRank();
      const rank = rankBetween(previousRank, maxRank());

      const column = await transactionContext.columns.create({
        boardId: board.id,
        title: dto.title,
        rank,
      });

      if (!column) {
        throw new InternalServerError('Column could not be created');
      }

      return column;
    });
  }

  async updateColumn(boardId: string, columnId: string, dto: UpdateColumnInput) {
    const column = await this.getColumnById(boardId, columnId);

    if (Object.keys(dto).length === 0) {
      return column;
    }

    const updatedColumn = await this.db.columns.update(column.id, dto);

    if (!updatedColumn) {
      throw new NotFoundError('Column not found');
    }

    return updatedColumn;
  }

  async reorderColumn(boardId: string, columnId: string, dto: ReorderColumnInput) {
    return this.db.transaction(async (transactionContext) => {
      const board = await transactionContext.boards.findByIdForUpdate(boardId);

      if (!board) {
        throw new NotFoundError('Board not found');
      }

      const column = await transactionContext.columns.findByIdForUpdate(columnId);

      if (!column || column.boardId !== board.id) {
        throw new NotFoundError('Column not found');
      }

      const columns = await transactionContext.columns.findManyByBoardId(board.id);
      const { before, after } = resolveNeighbors(columns, dto, column.id);
      const rank = rankBetween(before?.rank ?? minRank(), after?.rank ?? maxRank());

      const updatedColumn = await transactionContext.columns.update(column.id, { rank });

      if (!updatedColumn) {
        throw new NotFoundError('Column not found');
      }

      return updatedColumn;
    });
  }

  async deleteColumn(boardId: string, columnId: string) {
    const column = await this.getColumnById(boardId, columnId);

    const deletedColumn = await this.db.columns.delete(column.id);

    if (!deletedColumn) {
      throw new NotFoundError('Column not found');
    }

    return;
  }

  async createInitialColumns(boardId: string, transactionContext: DbContext) {
    const columns = await transactionContext.columns.createMany([
      {
        boardId,
        title: 'Todo',
        rank: rankBetween(minRank(), middleRank()),
      },
      {
        boardId,
        title: 'In Progress',
        rank: middleRank(),
      },
      {
        boardId,
        title: 'Done',
        rank: rankBetween(middleRank(), maxRank()),
      },
    ]);

    if (columns.length !== 3) {
      throw new InternalServerError('Initial columns could not be created');
    }

    return columns;
  }

  private async ensureBoard(boardId: string) {
    const board = await this.db.boards.findById(boardId);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    return board;
  }
}

export const columnService = new ColumnService();
