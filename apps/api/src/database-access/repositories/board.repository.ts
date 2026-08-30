import { eq } from 'drizzle-orm';
import { ilike } from 'drizzle-orm/pg-core/expressions';
import { boardsTable } from '../../database/schema.js';
import { BaseRepository } from './base-repository.js';

import type { BoardInsert, BoardRow } from '../../database/types.js';

type BoardCreateData = Pick<BoardInsert, 'title'>;

type BoardUpdateData = Partial<Pick<BoardInsert, 'title'>>;

type BoardListResult = {
  items: BoardRow[];
  total: number;
};

export interface FindBoardsParams {
  search?: string;
  sortBy?: 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class BoardRepository extends BaseRepository {
  async findMany(params: FindBoardsParams): Promise<BoardListResult> {
    const { search, sortBy = 'createdAt', sortOrder = 'desc', limit, offset } = params;

    const items = await this.db.query.boardsTable.findMany({
      where: search ? { title: { ilike: `%${search}%` } } : undefined,
      orderBy: (fields, { asc, desc }) => {
        const column = fields[sortBy];
        return sortOrder === 'asc' ? asc(column) : desc(column);
      },
      limit: limit ?? 20,
      offset: offset ?? 0,
    });

    const total = await this.db.$count(
      boardsTable,
      search ? ilike(boardsTable.title, `%${search}%`) : undefined,
    );

    return { items, total };
  }

  async findById(id: string): Promise<BoardRow | null> {
    const board = await this.db.query.boardsTable.findFirst({
      where: { id: { eq: id } },
    });

    return board ?? null;
  }

  async findByIdForUpdate(id: string): Promise<BoardRow | null> {
    const [board] = await this.db
      .select()
      .from(boardsTable)
      .where(eq(boardsTable.id, id))
      .for('update');

    return board ?? null;
  }

  async create(data: BoardCreateData): Promise<BoardRow | undefined> {
    const [board] = await this.db.insert(boardsTable).values(data).returning();
    return board;
  }

  async update(id: string, data: BoardUpdateData): Promise<BoardRow | null> {
    const [board] = await this.db
      .update(boardsTable)
      .set(data)
      .where(eq(boardsTable.id, id))
      .returning();

    return board ?? null;
  }

  async delete(id: string): Promise<BoardRow | null> {
    const [board] = await this.db.delete(boardsTable).where(eq(boardsTable.id, id)).returning();

    return board ?? null;
  }
}
