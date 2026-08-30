import { defineRelations } from 'drizzle-orm';
import * as schema from './schema.js';

export const relations = defineRelations(schema, (relation) => ({
  boardsTable: {
    columns: relation.many.columnsTable(),
  },
  columnsTable: {
    board: relation.one.boardsTable({
      from: relation.columnsTable.boardId,
      to: relation.boardsTable.id,
    }),
    cards: relation.many.cardsTable(),
  },
  cardsTable: {
    column: relation.one.columnsTable({
      from: relation.cardsTable.columnId,
      to: relation.columnsTable.id,
    }),
  },
}));
