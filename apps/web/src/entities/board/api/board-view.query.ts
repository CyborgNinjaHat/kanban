import { queryOptions } from '@tanstack/react-query';
import { getBoardView } from './board.api';

export const boardViewQueryKey = (boardId: string) => ['boards', 'view', boardId] as const;

export const boardViewQueryOptions = (boardId: string) =>
  queryOptions({
    queryKey: boardViewQueryKey(boardId),
    queryFn: ({ signal }) => getBoardView(boardId, { signal }),
  });
