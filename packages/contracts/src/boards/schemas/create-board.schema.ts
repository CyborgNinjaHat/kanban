import { z } from 'zod';
import { boardTitleSchema } from './board-title.schema.js';

export const createBoardBodySchema = z.object({
  title: boardTitleSchema,
});

export const createBoardSchema = z.object({
  body: createBoardBodySchema,
});

export type CreateBoardBody = z.infer<typeof createBoardBodySchema>;
export type CreateBoardRequest = z.infer<typeof createBoardSchema>;
