import { z } from 'zod';
import { cardDescriptionSchema } from './card-description.schema.js';
import { cardColumnParamsSchema } from './card-params.schema.js';
import { cardTitleSchema } from './card-title.schema.js';

export const createCardBodySchema = z.object({
  title: cardTitleSchema,
  description: cardDescriptionSchema,
});

export const createCardSchema = z.object({
  params: cardColumnParamsSchema,
  body: createCardBodySchema,
});

export type CreateCardBody = z.infer<typeof createCardBodySchema>;
export type CreateCardRequest = z.infer<typeof createCardSchema>;
