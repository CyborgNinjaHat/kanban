import { z } from 'zod';
import { boardParamsSchema } from './board-params.schema.js';

export const getBoardParamsSchema = boardParamsSchema;

export const getBoardSchema = z.object({
  params: getBoardParamsSchema,
});

export type GetBoardParams = z.infer<typeof getBoardParamsSchema>;
export type GetBoardRequest = z.infer<typeof getBoardSchema>;
