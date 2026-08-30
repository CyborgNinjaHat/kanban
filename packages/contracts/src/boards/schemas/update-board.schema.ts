import { z } from 'zod';
import { boardParamsSchema } from './board-params.schema.js';
import { createBoardBodySchema } from './create-board.schema.js';

export const updateBoardParamsSchema = boardParamsSchema;
export const updateBoardBodySchema = createBoardBodySchema.partial();

export const updateBoardSchema = z.object({
  params: updateBoardParamsSchema,
  body: updateBoardBodySchema,
});

export type UpdateBoardParams = z.infer<typeof updateBoardParamsSchema>;
export type UpdateBoardBody = z.infer<typeof updateBoardBodySchema>;
export type UpdateBoardRequest = z.infer<typeof updateBoardSchema>;
