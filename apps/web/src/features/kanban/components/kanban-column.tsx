import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { KanbanCard } from '@/features/kanban/components/kanban-card';
import { ActionMenu } from '@/shared/components/action-menu';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { useDialogStore } from '@/store/dialog.store';

import type { BoardViewColumnDto } from '@kanban/contracts';

interface KanbanColumnProps {
  column: BoardViewColumnDto;
  index: number;
  isDragDisabled: boolean;
}

export const KanbanColumn = ({ column, index, isDragDisabled }: KanbanColumnProps) => {
  const openDialog = useDialogStore((state) => state.openDialog);
  const { handleRef, isDragging, ref } = useSortable({
    id: column.id,
    index,
    type: 'column',
    accept: ['column', 'card'],
    collisionPriority: CollisionPriority.Low,
    data: { columnId: column.id },
    disabled: isDragDisabled,
  });

  return (
    <Card
      ref={ref}
      data-dragging={isDragging || undefined}
      className={cn(
        'h-full max-h-full w-80 shrink-0 gap-0 py-0 transition-[box-shadow,opacity,transform]',
        isDragging && 'opacity-40 shadow-xl',
      )}
    >
      <CardHeader className="flex h-14 grid-cols-none flex-row items-center justify-between gap-3 border-b py-0 pb-0!">
        <h2 className="min-w-0 truncate font-heading text-base font-semibold">{column.title}</h2>
        <div className="flex shrink-0 items-center">
          <ActionMenu
            ariaLabel={`Open actions for ${column.title} column`}
            actions={[
              {
                id: 'rename',
                name: 'Rename',
                icon: <Pencil />,
                onClick: () => openDialog({ type: 'rename-column', columnId: column.id }),
              },
              {
                id: 'delete',
                name: 'Delete',
                icon: <Trash2 />,
                variant: 'destructive',
                onClick: () => openDialog({ type: 'delete-column', columnId: column.id }),
              },
            ]}
          />
          <Button
            ref={handleRef}
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isDragDisabled}
            className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
            aria-label={`Drag ${column.title} column`}
          >
            <GripVertical />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="min-h-24 flex-1 space-y-3 overflow-y-auto py-3">
        {column.cards.map((card, cardIndex) => (
          <KanbanCard key={card.id} card={card} index={cardIndex} isDragDisabled={isDragDisabled} />
        ))}
      </CardContent>

      <CardFooter className="p-2">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => openDialog({ type: 'create-card', columnId: column.id })}
        >
          <Plus />
          Create
        </Button>
      </CardFooter>
    </Card>
  );
};
