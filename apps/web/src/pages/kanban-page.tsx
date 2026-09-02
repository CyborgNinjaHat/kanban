import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { boardViewQueryOptions } from '@/entities/board/api/board-view.query';
import { BoardErrorState } from '@/features/kanban/components/board-error-state';
import { BoardLoadingState } from '@/features/kanban/components/board-loading-state';
import { Kanban } from '@/features/kanban/components/kanban';
import { ApiError } from '@/shared/api/error';

export const KanbanPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const boardQuery = useQuery({
    ...boardViewQueryOptions(boardId ?? ''),
    enabled: Boolean(boardId),
  });

  const isNotFound = boardQuery.error instanceof ApiError && boardQuery.error.status === 404;

  return (
    <main className="h-svh overflow-hidden p-3 sm:p-5">
      {boardQuery.isPending && <BoardLoadingState />}

      {boardQuery.isError && (
        <BoardErrorState isNotFound={isNotFound} onRetry={() => void boardQuery.refetch()} />
      )}

      {boardQuery.isSuccess && (
        <Kanban board={boardQuery.data} onClose={() => void navigate('/')} />
      )}
    </main>
  );
};
