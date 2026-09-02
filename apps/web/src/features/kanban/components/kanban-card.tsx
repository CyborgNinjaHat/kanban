import { Feedback } from '@dnd-kit/dom';
import { useSortable } from '@dnd-kit/react/sortable';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { ActionMenu } from '@/shared/components/action-menu';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { useDialogStore } from '@/store/dialog.store';

import type { CardDto } from '@kanban/contracts';

interface KanbanCardProps {
  card: CardDto;
  index: number;
  isDragDisabled: boolean;
}

export const KanbanCard = ({ card, index, isDragDisabled }: KanbanCardProps) => {
  const openDialog = useDialogStore((state) => state.openDialog);
  const { handleRef, isDragging, ref } = useSortable({
    id: card.id,
    index,
    group: card.columnId,
    type: 'card',
    accept: 'card',
    plugins: [Feedback.configure({ feedback: 'clone' })],
    data: { columnId: card.columnId },
    disabled: isDragDisabled,
  });

  return (
    <Card
      ref={ref}
      size="sm"
      data-dragging={isDragging || undefined}
      className={cn('transition-[box-shadow,opacity,transform]', isDragging && 'opacity-40')}
    >
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle className="min-w-0 flex-1 truncate" title={card.title}>
          {card.title}
        </CardTitle>
        <div className="flex shrink-0 items-center">
          <ActionMenu
            ariaLabel={`Open actions for ${card.title}`}
            actions={[
              {
                id: 'edit',
                name: 'Edit',
                icon: <Pencil />,
                onClick: () =>
                  openDialog({ type: 'edit-card', columnId: card.columnId, cardId: card.id }),
              },
              {
                id: 'delete',
                name: 'Delete',
                icon: <Trash2 />,
                variant: 'destructive',
                onClick: () =>
                  openDialog({ type: 'delete-card', columnId: card.columnId, cardId: card.id }),
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
            aria-label={`Drag ${card.title} card`}
          >
            <GripVertical />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{card.description}</CardDescription>
      </CardContent>
    </Card>
  );
};
