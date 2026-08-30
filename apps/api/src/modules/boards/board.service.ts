import { InternalServerError, NotFoundError } from '../../common/error/app-error.js';
import { dbContext } from '../../database-access/db-context.js';
import { ColumnService } from '../columns/column.service.js';

import type { DbContext } from '../../database-access/db-context.js';

type CreateBoardInput = {
  title: string;
};

type UpdateBoardInput = Partial<CreateBoardInput>;

type ListBoardsInput = {
  search?: string;
  sortBy: 'title' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
};

export class BoardService {
  private readonly db: DbContext;
  private readonly columnService: ColumnService;
  constructor(db: DbContext = dbContext, columnService: ColumnService = new ColumnService(db)) {
    this.db = db;
    this.columnService = columnService;
  }

  async getAllBoards(query: ListBoardsInput) {
    const { search, sortBy, sortOrder, page, limit } = query;
    const offset = (page - 1) * limit;

    const { items, total } = await this.db.boards.findMany({
      search,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      meta: {
        total,
        limit,
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getBoardById(id: string) {
    const board = await this.db.boards.findById(id);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    return board;
  }

  async getBoardViewById(id: string) {
    const board = await this.db.boards.findById(id);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    const columns = await this.columnService.getColumnsWithCards(id);

    return {
      ...board,
      columns,
    };
  }

  async createBoard(dto: CreateBoardInput) {
    return this.db.transaction(async (transactionContext) => {
      const board = await transactionContext.boards.create(dto);

      if (!board) {
        throw new InternalServerError('Board could not be created');
      }

      await this.columnService.createInitialColumns(board.id, transactionContext);

      return board;
    });
  }

  async updateBoard(id: string, dto: UpdateBoardInput) {
    if (Object.keys(dto).length === 0) {
      return this.getBoardById(id);
    }

    const board = await this.db.boards.update(id, dto);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    return board;
  }

  async deleteBoard(id: string) {
    const board = await this.db.boards.delete(id);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    return;
  }
}

export const boardService = new BoardService();
