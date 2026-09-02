import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

import type { ReactNode, SubmitEventHandler } from 'react';

interface FormDialogProps {
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  error?: string;
}

export const FormDialog = ({
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel,
  pendingLabel,
  isPending,
  error,
}: FormDialogProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isPending}>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>

          {children}

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? pendingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
