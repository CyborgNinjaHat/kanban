import { z } from 'zod';
import { paginationSchema } from '../../common/schemas/pagination.schema.js';
import { boardTitleSchema } from './board-title.schema.js';

export const listBoardsQuerySchema = paginationSchema.extend({
  search: boardTitleSchema.optional(),
  sortBy: z.enum(['title', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const listBoardsSchema = z.object({
  query: listBoardsQuerySchema,
});

export type ListBoardsQuery = z.infer<typeof listBoardsQuerySchema>;
export type ListBoardsRequest = z.infer<typeof listBoardsSchema>;
