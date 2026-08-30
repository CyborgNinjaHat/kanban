import type { relations } from './relations.js';
import type { boardsTable, cardsTable, columnsTable } from './schema.js';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { NodePgDatabase, NodePgTransaction } from 'drizzle-orm/node-postgres';

export type DatabaseInstance = NodePgDatabase<typeof relations>;
export type Transaction = NodePgTransaction<typeof relations>;

export type DatabaseExecutor = DatabaseInstance | Transaction;

export type BoardRow = InferSelectModel<typeof boardsTable>;
export type BoardInsert = InferInsertModel<typeof boardsTable>;

export type ColumnRow = InferSelectModel<typeof columnsTable>;
export type ColumnInsert = InferInsertModel<typeof columnsTable>;

export type CardRow = InferSelectModel<typeof cardsTable>;
export type CardInsert = InferInsertModel<typeof cardsTable>;
