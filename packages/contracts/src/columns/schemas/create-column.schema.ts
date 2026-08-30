import { z } from 'zod';
import { columnBoardParamsSchema } from './column-params.schema.js';
import { columnTitleSchema } from './column-title.schema.js';

export const createColumnBodySchema = z.object({
  title: columnTitleSchema,
});

export const createColumnSchema = z.object({
  params: columnBoardParamsSchema,
  body: createColumnBodySchema,
});

export type CreateColumnBody = z.infer<typeof createColumnBodySchema>;
export type CreateColumnRequest = z.infer<typeof createColumnSchema>;
