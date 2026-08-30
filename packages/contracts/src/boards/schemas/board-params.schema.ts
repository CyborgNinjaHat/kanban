import { z } from 'zod';
import { idSchema } from '../../common/schemas/id.schema.js';

export const boardIdSchema = idSchema;

export const boardParamsSchema = z.object({
  id: boardIdSchema,
});

export type BoardId = z.infer<typeof boardIdSchema>;
export type BoardParams = z.infer<typeof boardParamsSchema>;
