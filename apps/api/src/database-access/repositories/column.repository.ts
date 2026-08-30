import { asc, eq } from 'drizzle-orm';
import { inArray } from 'drizzle-orm/pg-core/expressions';
import { columnsTable } from '../../database/schema.js';
import { BaseRepository } from './base-repository.js';

import type { ColumnInsert, ColumnRow } from '../../database/types.js';

type ColumnCreateData = Pick<ColumnInsert, 'boardId' | 'title' | 'rank'>;

type ColumnUpdateData = Partial<Pick<ColumnInsert, 'title' | 'rank'>>;

export class ColumnRepository extends BaseRepository {
  async findManyByBoardId(boardId: string): Promise<ColumnRow[]> {
    return this.db
      .select()
      .from(columnsTable)
      .where(eq(columnsTable.boardId, boardId))
      .orderBy(asc(columnsTable.rank));
  }

  async findById(id: string): Promise<ColumnRow | null> {
    const [column] = await this.db.select().from(columnsTable).where(eq(columnsTable.id, id));
    return column ?? null;
  }

  async findByIdForUpdate(id: string): Promise<ColumnRow | null> {
    const [column] = await this.db
      .select()
      .from(columnsTable)
      .where(eq(columnsTable.id, id))
      .for('update');

    return column ?? null;
  }

  async findManyByIdsForUpdate(ids: string[]): Promise<ColumnRow[]> {
    const uniqueIds = [...new Set(ids)].toSorted();

    return this.db
      .select()
      .from(columnsTable)
      .where(inArray(columnsTable.id, uniqueIds))
      .orderBy(asc(columnsTable.id))
      .for('update');
  }

  async create(data: ColumnCreateData): Promise<ColumnRow | undefined> {
    const [column] = await this.db.insert(columnsTable).values(data).returning();
    return column;
  }

  async createMany(data: ColumnCreateData[]): Promise<ColumnRow[]> {
    if (data.length === 0) {
      return [];
    }

    return this.db.insert(columnsTable).values(data).returning();
  }

  async update(id: string, data: ColumnUpdateData): Promise<ColumnRow | null> {
    const [column] = await this.db
      .update(columnsTable)
      .set(data)
      .where(eq(columnsTable.id, id))
      .returning();

    return column ?? null;
  }

  async delete(id: string): Promise<ColumnRow | null> {
    const [column] = await this.db.delete(columnsTable).where(eq(columnsTable.id, id)).returning();
    return column ?? null;
  }
}
