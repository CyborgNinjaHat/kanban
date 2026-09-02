import { client } from '@/shared/api/http-client';

import type { RequestOptions } from '@/shared/api/http-client';
import type {
  ColumnDto,
  CreateColumnBody,
  ReorderColumnBody,
  UpdateColumnBody,
} from '@kanban/contracts';

const columnsPath = (boardId: string) => `/boards/${encodeURIComponent(boardId)}/columns`;

const columnPath = (boardId: string, columnId: string) =>
  `${columnsPath(boardId)}/${encodeURIComponent(columnId)}`;

export const createColumn = (boardId: string, data: CreateColumnBody, options?: RequestOptions) =>
  client.post<ColumnDto>(columnsPath(boardId), data, options);

export const updateColumn = (
  boardId: string,
  columnId: string,
  data: UpdateColumnBody,
  options?: RequestOptions,
) => client.patch<ColumnDto>(columnPath(boardId, columnId), data, options);

export const reorderColumn = (
  boardId: string,
  columnId: string,
  data: ReorderColumnBody,
  options?: RequestOptions,
) => client.patch<ColumnDto>(`${columnPath(boardId, columnId)}/reorder`, data, options);

export const deleteColumn = (boardId: string, columnId: string, options?: RequestOptions) =>
  client.delete(columnPath(boardId, columnId), options);
