import { z } from 'zod';
import { cardParamsSchema } from './card-params.schema.js';
import { createCardBodySchema } from './create-card.schema.js';

export const updateCardParamsSchema = cardParamsSchema;
export const updateCardBodySchema = createCardBodySchema.partial();

export const updateCardSchema = z.object({
  params: updateCardParamsSchema,
  body: updateCardBodySchema,
});

export type UpdateCardParams = z.infer<typeof updateCardParamsSchema>;
export type UpdateCardBody = z.infer<typeof updateCardBodySchema>;
export type UpdateCardRequest = z.infer<typeof updateCardSchema>;
