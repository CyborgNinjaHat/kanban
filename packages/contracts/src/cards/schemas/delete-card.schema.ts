import { z } from 'zod';
import { cardParamsSchema } from './card-params.schema.js';

export const deleteCardSchema = z.object({
  params: cardParamsSchema,
});

export type DeleteCardParams = z.infer<typeof deleteCardSchema>['params'];
export type DeleteCardRequest = z.infer<typeof deleteCardSchema>;
