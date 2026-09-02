import { BoardContainer } from '@/features/kanban/components/board-container';
import { CardContent } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';

export const BoardLoadingState = () => (
  <BoardContainer>
    <CardContent className="grid h-full min-h-0 place-items-center px-0">
      <Spinner className="size-6" />
    </CardContent>
  </BoardContainer>
);
