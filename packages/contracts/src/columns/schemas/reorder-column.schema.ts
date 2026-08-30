import { z } from 'zod';
import { columnIdSchema, columnParamsSchema } from './column-params.schema.js';

export const reorderColumnBodySchema = z.object({
  beforeId: columnIdSchema.nullable(),
  afterId: columnIdSchema.nullable(),
});

export const reorderColumnSchema = z.object({
  params: columnParamsSchema,
  body: reorderColumnBodySchema,
});

export type ReorderColumnParams = z.infer<typeof reorderColumnSchema>['params'];
export type ReorderColumnBody = z.infer<typeof reorderColumnBodySchema>;
export type ReorderColumnRequest = z.infer<typeof reorderColumnSchema>;
