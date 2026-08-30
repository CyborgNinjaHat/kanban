import { z } from 'zod';
import { columnBoardParamsSchema } from './column-params.schema.js';

export const listColumnsSchema = z.object({
  params: columnBoardParamsSchema,
});

export type ListColumnsParams = z.infer<typeof listColumnsSchema>['params'];
export type ListColumnsRequest = z.infer<typeof listColumnsSchema>;
