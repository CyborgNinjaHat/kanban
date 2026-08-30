import { databaseClient } from '../database/db-client.js';
import { BoardRepository } from './repositories/board.repository.js';
import { CardRepository } from './repositories/card.repository.js';
import { ColumnRepository } from './repositories/column.repository.js';

import type { DatabaseExecutor } from '../database/types.js';

export class DbContext {
  private readonly client: DatabaseExecutor;
  private boardsRepository?: BoardRepository;
  private columnsRepository?: ColumnRepository;
  private cardsRepository?: CardRepository;

  constructor(client: DatabaseExecutor = databaseClient) {
    this.client = client;
  }

  get boards(): BoardRepository {
    return (this.boardsRepository ??= new BoardRepository(this.client));
  }

  get columns(): ColumnRepository {
    return (this.columnsRepository ??= new ColumnRepository(this.client));
  }

  get cards(): CardRepository {
    return (this.cardsRepository ??= new CardRepository(this.client));
  }

  async transaction<T>(callback: (context: DbContext) => Promise<T>): Promise<T> {
    return this.client.transaction(async (tx) => {
      const transactionContext = new DbContext(tx);
      return callback(transactionContext);
    });
  }
}

export const dbContext = new DbContext();
