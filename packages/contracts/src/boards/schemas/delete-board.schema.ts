import { z } from 'zod';
import { boardParamsSchema } from './board-params.schema.js';

export const deleteBoardParamsSchema = boardParamsSchema;

export const deleteBoardSchema = z.object({
  params: deleteBoardParamsSchema,
});

export type DeleteBoardParams = z.infer<typeof deleteBoardParamsSchema>;
export type DeleteBoardRequest = z.infer<typeof deleteBoardSchema>;
