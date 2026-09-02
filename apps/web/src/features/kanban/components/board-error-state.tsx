import { Link } from 'react-router';
import { BoardContainer } from '@/features/kanban/components/board-container';
import { Button } from '@/shared/components/ui/button';
import { CardContent } from '@/shared/components/ui/card';

interface BoardErrorStateProps {
  isNotFound: boolean;
  onRetry: () => void;
}

export const BoardErrorState = ({ isNotFound, onRetry }: BoardErrorStateProps) => (
  <BoardContainer>
    <CardContent className="grid h-full min-h-0 place-items-center px-0 p-6 text-center">
      <div className="grid max-w-md gap-3">
        <h1 className="font-heading text-xl font-semibold">
          {isNotFound ? 'Board not found' : 'Could not load board'}
        </h1>

        <p className="text-sm text-muted-foreground">
          {isNotFound
            ? 'This board does not exist or has been deleted.'
            : 'Something went wrong while loading the board.'}
        </p>

        <div className="flex justify-center gap-2">
          {!isNotFound ? (
            <Button type="button" onClick={onRetry}>
              Try again
            </Button>
          ) : null}

          <Button asChild type="button" variant="outline">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </BoardContainer>
);
