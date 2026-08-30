import { z } from 'zod';
import { columnParamsSchema } from './column-params.schema.js';

export const getColumnParamsSchema = columnParamsSchema;

export const getColumnSchema = z.object({
  params: getColumnParamsSchema,
});

export type GetColumnParams = z.infer<typeof getColumnParamsSchema>;
export type GetColumnRequest = z.infer<typeof getColumnSchema>;
