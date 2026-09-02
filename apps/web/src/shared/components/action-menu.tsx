import { Ellipsis } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import type { ReactNode, SyntheticEvent } from 'react';

interface ActionMenuAction {
  id: string;
  name: string;
  icon: ReactNode;
  variant?: 'default' | 'destructive';
  onClick: () => void;
}

interface ActionMenuProps {
  actions: readonly ActionMenuAction[];
  ariaLabel: string;
}

const stopDragActivation = (event: SyntheticEvent) => {
  event.stopPropagation();
};

export const ActionMenu = ({ actions, ariaLabel }: ActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={ariaLabel}
          onPointerDown={stopDragActivation}
          onKeyDown={stopDragActivation}
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        {actions.map((action) => (
          <DropdownMenuItem key={action.id} variant={action.variant} onSelect={action.onClick}>
            {action.icon}
            {action.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
