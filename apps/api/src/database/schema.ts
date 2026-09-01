import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const boardsTable = pgTable('boards', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const columnsTable = pgTable(
  'columns',
  {
    id: uuid().primaryKey().defaultRandom(),
    boardId: uuid('board_id')
      .notNull()
      .references(() => boardsTable.id, { onDelete: 'cascade' }),
    title: varchar({ length: 255 }).notNull(),
    rank: varchar({ length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('columns_board_rank_unique').on(table.boardId, table.rank),
    uniqueIndex('columns_board_title_unique').on(table.boardId, table.title),
  ],
);

export const cardsTable = pgTable(
  'cards',
  {
    id: uuid().primaryKey().defaultRandom(),
    columnId: uuid('column_id')
      .notNull()
      .references(() => columnsTable.id, { onDelete: 'cascade' }),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    rank: varchar({ length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('cards_column_rank_unique').on(table.columnId, table.rank)],
);
