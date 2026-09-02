import { DragDropProvider } from '@dnd-kit/react';
import { CircleX, ClipboardCopy, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BoardContainer } from './board-container';
import { KanbanColumn } from '@/features/kanban/components/kanban-column';
import { useBoardDragAndDrop } from '@/features/kanban/hooks/use-board-dnd';
import { ActionMenu } from '@/shared/components/action-menu';
import { Button } from '@/shared/components/ui/button';
import { CardContent, CardHeader } from '@/shared/components/ui/card';
import { useDialogStore } from '@/store/dialog.store';

import type { BoardViewDto } from '@kanban/contracts';

interface KanbanBoardProps {
  board: BoardViewDto;
  onClose: () => void;
}

export const KanbanBoard = ({ board, onClose }: KanbanBoardProps) => {
  const openDialog = useDialogStore((state) => state.openDialog);
  const { sensors, isDragDisabled, handleDragStart, handleDragOver, handleDragEnd } =
    useBoardDragAndDrop(board.id);

  const copyBoardId = () => {
    void navigator.clipboard.writeText(board.id).then(
      () => toast.success('Board ID copied.'),
      () => toast.error('Could not copy the board ID.'),
    );
  };

  return (
    <BoardContainer>
      <CardHeader className="flex min-h-16 grid-cols-none flex-row items-center justify-between gap-4 border-b py-4 pb-4!">
        <h1
          className="min-w-0 flex-1 truncate font-heading text-xl font-semibold tracking-tight sm:text-2xl"
          title={board.title}
        >
          {board.title}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => openDialog({ type: 'create-column' })}
          >
            <Plus data-icon="inline-start" />
            Add column
          </Button>
          <ActionMenu
            ariaLabel={`Open actions for ${board.title} board`}
            actions={[
              {
                id: 'rename',
                name: 'Rename',
                icon: <Pencil />,
                onClick: () => openDialog({ type: 'rename-board' }),
              },
              {
                id: 'copy-id',
                name: 'Copy ID',
                icon: <ClipboardCopy />,
                onClick: copyBoardId,
              },
              {
                id: 'close',
                name: 'Close board',
                icon: <CircleX />,
                onClick: onClose,
              },
              {
                id: 'delete',
                name: 'Delete',
                icon: <Trash2 />,
                variant: 'destructive',
                onClick: () => openDialog({ type: 'delete-board' }),
              },
            ]}
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-x-auto px-0">
        <DragDropProvider
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full min-w-max items-stretch gap-4 p-4">
            {board.columns.length === 0 ? (
              <div className="grid h-full w-80 place-items-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                This board has no columns yet.
              </div>
            ) : null}

            {board.columns.map((column, index) => (
              <KanbanColumn
                key={column.id}
                column={column}
                index={index}
                isDragDisabled={isDragDisabled}
              />
            ))}
          </div>
        </DragDropProvider>
      </CardContent>
    </BoardContainer>
  );
};
