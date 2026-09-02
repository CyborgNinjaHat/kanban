import { Kanban, Plus, SquareKanban } from 'lucide-react';
import { CreateBoardDialog } from '@/features/board-access/components/create-board-dialog';
import { LoadBoardDialog } from '@/features/board-access/components/load-board-dialog';
import { Button } from '@/shared/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { useDialogStore } from '@/store/dialog.store';

interface BoardAccessProps {
  onBoardSelected: (boardId: string) => void;
}

export const BoardAccess = ({ onBoardSelected }: BoardAccessProps) => {
  const activeDialog = useDialogStore((state) => state.activeDialog);
  const openDialog = useDialogStore((state) => state.openDialog);

  return (
    <>
      <Empty className="max-w-xl border bg-card shadow-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Kanban />
          </EmptyMedia>

          <EmptyTitle>Start with a board</EmptyTitle>

          <EmptyDescription>
            Create a new board or open an existing workspace with its ID.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="sm:flex-row sm:justify-center">
          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => openDialog({ type: 'create-board' })}
          >
            <Plus data-icon="inline-start" />
            New board
          </Button>

          <Button
            type="button"
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => openDialog({ type: 'load-board' })}
          >
            <SquareKanban data-icon="inline-start" />
            Load board
          </Button>
        </EmptyContent>
      </Empty>

      {activeDialog?.type === 'create-board' ? (
        <CreateBoardDialog onCreated={onBoardSelected} />
      ) : null}

      {activeDialog?.type === 'load-board' ? <LoadBoardDialog onLoaded={onBoardSelected} /> : null}
    </>
  );
};
