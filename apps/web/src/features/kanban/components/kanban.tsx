import { KanbanDialogHost } from '@/features/kanban/components/dialogs/kanban-dialog-host';
import { KanbanBoard } from '@/features/kanban/components/kanban-board';

import type { BoardViewDto } from '@kanban/contracts';

interface KanbanProps {
  board: BoardViewDto;
  onClose: () => void;
}

export const Kanban = ({ board, onClose }: KanbanProps) => {
  return (
    <div className="h-full">
      <KanbanBoard board={board} onClose={onClose} />
      <KanbanDialogHost board={board} onClose={onClose} />
    </div>
  );
};
