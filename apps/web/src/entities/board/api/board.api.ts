import { client } from '@/shared/api/http-client';

import type { RequestOptions } from '@/shared/api/http-client';
import type { BoardDto, BoardViewDto, CreateBoardBody, UpdateBoardBody } from '@kanban/contracts';

export const getBoardView = (boardId: string, options?: RequestOptions) =>
  client.get<BoardViewDto>(`/boards/${encodeURIComponent(boardId)}/view`, options);

export const createBoard = (data: CreateBoardBody, options?: RequestOptions) =>
  client.post<BoardDto>('/boards', data, options);

export const updateBoard = (boardId: string, data: UpdateBoardBody, options?: RequestOptions) =>
  client.patch<BoardDto>(`/boards/${encodeURIComponent(boardId)}`, data, options);

export const deleteBoard = (boardId: string, options?: RequestOptions) =>
  client.delete(`/boards/${encodeURIComponent(boardId)}`, options);
