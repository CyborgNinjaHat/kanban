import { z } from 'zod';
import { idSchema } from '../../common/schemas/id.schema.js';

export const cardIdSchema = idSchema;

export const cardColumnParamsSchema = z.object({
  boardId: idSchema,
  columnId: idSchema,
});

export const cardParamsSchema = z.object({
  boardId: idSchema,
  columnId: idSchema,
  cardId: cardIdSchema,
});

export type CardId = z.infer<typeof cardIdSchema>;
export type CardColumnParams = z.infer<typeof cardColumnParamsSchema>;
export type CardParams = z.infer<typeof cardParamsSchema>;
