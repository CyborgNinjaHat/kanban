import { z } from 'zod';
import { idSchema } from '../../common/schemas/id.schema.js';

export const columnIdSchema = idSchema;

export const columnBoardParamsSchema = z.object({
  boardId: idSchema,
});

export const columnParamsSchema = z.object({
  boardId: idSchema,
  columnId: columnIdSchema,
});

export const deleteColumnParamsSchema = columnParamsSchema;

export type ColumnId = z.infer<typeof columnIdSchema>;
export type ColumnBoardParams = z.infer<typeof columnBoardParamsSchema>;
export type ColumnParams = z.infer<typeof columnParamsSchema>;
