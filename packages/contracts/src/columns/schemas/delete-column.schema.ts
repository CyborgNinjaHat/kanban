import { z } from 'zod';
import { deleteColumnParamsSchema } from './column-params.schema.js';

export const deleteColumnSchema = z.object({
  params: deleteColumnParamsSchema,
});

export type DeleteColumnParams = z.infer<typeof deleteColumnSchema>['params'];
export type DeleteColumnRequest = z.infer<typeof deleteColumnSchema>;
