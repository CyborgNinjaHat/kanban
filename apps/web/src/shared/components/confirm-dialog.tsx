import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Spinner } from '@/shared/components/ui/spinner';

interface ConfirmDialogProps {
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  isPending: boolean;
  errorMessage?: string;
}

export const ConfirmDialog = ({
  onClose,
  title,
  description,
  onConfirm,
  isPending,
  errorMessage: error,
}: ConfirmDialogProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      onClose();
    }
  };

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="min-w-24"
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
          >
            {isPending ? <Spinner /> : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
