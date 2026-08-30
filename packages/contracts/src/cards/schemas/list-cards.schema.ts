import { z } from 'zod';
import { cardColumnParamsSchema } from './card-params.schema.js';

export const listCardsSchema = z.object({
  params: cardColumnParamsSchema,
});

export type ListCardsParams = z.infer<typeof listCardsSchema>['params'];
export type ListCardsRequest = z.infer<typeof listCardsSchema>;
