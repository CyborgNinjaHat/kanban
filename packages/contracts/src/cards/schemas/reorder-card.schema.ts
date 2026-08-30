import { z } from 'zod';
import { idSchema } from '../../common/schemas/id.schema.js';
import { cardIdSchema, cardParamsSchema } from './card-params.schema.js';

export const reorderCardBodySchema = z.object({
  columnId: idSchema,
  beforeId: cardIdSchema.nullable(),
  afterId: cardIdSchema.nullable(),
});

export const reorderCardSchema = z.object({
  params: cardParamsSchema,
  body: reorderCardBodySchema,
});

export type ReorderCardParams = z.infer<typeof reorderCardSchema>['params'];
export type ReorderCardBody = z.infer<typeof reorderCardBodySchema>;
export type ReorderCardRequest = z.infer<typeof reorderCardSchema>;
