import { z } from 'zod';
import { cardParamsSchema } from './card-params.schema.js';

export const getCardParamsSchema = cardParamsSchema;

export const getCardSchema = z.object({
  params: getCardParamsSchema,
});

export type GetCardParams = z.infer<typeof getCardParamsSchema>;
export type GetCardRequest = z.infer<typeof getCardSchema>;
