import { z } from 'zod';
import { columnParamsSchema } from './column-params.schema.js';
import { createColumnBodySchema } from './create-column.schema.js';

export const updateColumnParamsSchema = columnParamsSchema;
export const updateColumnBodySchema = createColumnBodySchema.partial();

export const updateColumnSchema = z.object({
  params: updateColumnParamsSchema,
  body: updateColumnBodySchema,
});

export type UpdateColumnParams = z.infer<typeof updateColumnParamsSchema>;
export type UpdateColumnBody = z.infer<typeof updateColumnBodySchema>;
export type UpdateColumnRequest = z.infer<typeof updateColumnSchema>;
