import { zodResolver } from '@hookform/resolvers/zod';
import { boardIdSchema } from '@kanban/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { boardViewQueryOptions } from '@/entities/board/api/board-view.query';
import { ApiError } from '@/shared/api/error';
import { FormDialog } from '@/shared/components/form-dialog';
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { useDialogStore } from '@/store/dialog.store';

const loadBoardFormSchema = z.object({
  boardId: z.string().trim().pipe(boardIdSchema),
});

type LoadBoardForm = z.infer<typeof loadBoardFormSchema>;

interface LoadBoardDialogProps {
  onLoaded: (boardId: string) => void;
}

const getLoadErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError && error.status === 404) {
    return 'Board not found. Check the ID and try again.';
  }

  return error instanceof Error ? error.message : 'Could not load the board. Please try again.';
};

export const LoadBoardDialog = ({ onLoaded }: LoadBoardDialogProps) => {
  const queryClient = useQueryClient();
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const form = useForm<LoadBoardForm>({
    resolver: zodResolver(loadBoardFormSchema),
    defaultValues: { boardId: '' },
  });

  const loadBoardMutation = useMutation({
    mutationFn: (boardId: string) => queryClient.query(boardViewQueryOptions(boardId)),
    onSuccess: (_board, boardId) => {
      loadBoardMutation.reset();
      closeDialog();
      onLoaded(boardId);
    },
  });

  const boardIdError = form.formState.errors.boardId?.message;
  const inputId = 'load-board-id';
  const handleSubmit = form.handleSubmit(({ boardId }) => loadBoardMutation.mutate(boardId));

  const handleClose = () => {
    loadBoardMutation.reset();
    closeDialog();
  };

  return (
    <FormDialog
      onClose={handleClose}
      title="Load board"
      description="Enter the board ID."
      submitLabel="Load board"
      pendingLabel="Loading…"
      isPending={loadBoardMutation.isPending}
      error={loadBoardMutation.error ? getLoadErrorMessage(loadBoardMutation.error) : undefined}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <Field data-invalid={Boolean(boardIdError)}>
        <FieldLabel htmlFor={inputId}>Board ID</FieldLabel>
        <Input
          id={inputId}
          autoComplete="off"
          spellCheck={false}
          disabled={loadBoardMutation.isPending}
          aria-invalid={Boolean(boardIdError)}
          {...form.register('boardId', { onChange: () => loadBoardMutation.reset() })}
        />
        <FieldError>{boardIdError}</FieldError>
      </Field>
    </FormDialog>
  );
};
