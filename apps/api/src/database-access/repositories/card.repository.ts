import { asc, eq, inArray } from 'drizzle-orm';
import { cardsTable } from '../../database/schema.js';
import { BaseRepository } from './base-repository.js';

import type { CardInsert, CardRow } from '../../database/types.js';

type CardCreateData = Pick<CardInsert, 'columnId' | 'title' | 'description' | 'rank'>;

type CardUpdateData = Partial<Pick<CardInsert, 'columnId' | 'title' | 'description' | 'rank'>>;

export class CardRepository extends BaseRepository {
  async findManyByColumnId(columnId: string): Promise<CardRow[]> {
    return this.db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.columnId, columnId))
      .orderBy(asc(cardsTable.rank));
  }

  async findManyByColumnIds(columnIds: string[]): Promise<CardRow[]> {
    if (columnIds.length === 0) {
      return [];
    }

    return this.db
      .select()
      .from(cardsTable)
      .where(inArray(cardsTable.columnId, columnIds))
      .orderBy(asc(cardsTable.rank));
  }

  async findById(id: string): Promise<CardRow | null> {
    const [card] = await this.db.select().from(cardsTable).where(eq(cardsTable.id, id));
    return card ?? null;
  }

  async findByIdForUpdate(id: string): Promise<CardRow | null> {
    const [card] = await this.db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.id, id))
      .for('update');

    return card ?? null;
  }

  async create(data: CardCreateData): Promise<CardRow | undefined> {
    const [card] = await this.db.insert(cardsTable).values(data).returning();
    return card;
  }

  async update(id: string, data: CardUpdateData): Promise<CardRow | null> {
    const [card] = await this.db
      .update(cardsTable)
      .set(data)
      .where(eq(cardsTable.id, id))
      .returning();

    return card ?? null;
  }

  async delete(id: string): Promise<CardRow | null> {
    const [card] = await this.db.delete(cardsTable).where(eq(cardsTable.id, id)).returning();
    return card ?? null;
  }
}
