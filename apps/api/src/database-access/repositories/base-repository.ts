import type { DatabaseExecutor } from '../../database/types.js';

export abstract class BaseRepository {
  protected readonly db: DatabaseExecutor;
  constructor(db: DatabaseExecutor) {
    this.db = db;
  }
}
