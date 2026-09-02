import { zodResolver } from '@hookform/resolvers/zod';
import { createCardBodySchema } from '@kanban/contracts';
import { useForm } from 'react-hook-form';
import { FormDialog } from '@/shared/components/form-dialog';
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { getApiFieldError, getGeneralFormError } from '@/shared/lib/form-error';

import type { CreateCardBody } from '@kanban/contracts';

type CardFormDialogProps = {
  isPending: boolean;
  error?: unknown;
  onErrorReset: () => void;
  onClose: () => void;
  onSubmit: (data: CreateCardBody) => void | Promise<void>;
} & (
  | {
      mode: 'create';
      initialTitle?: string;
      initialDescription?: string;
    }
  | {
      mode: 'edit';
      initialTitle: string;
      initialDescription: string;
    }
);

export const CardFormDialog = (props: CardFormDialogProps) => {
  const { mode, initialTitle = '', initialDescription = '' } = props;
  const form = useForm<CreateCardBody>({
    resolver: zodResolver(createCardBodySchema),
    defaultValues: { title: initialTitle, description: initialDescription },
  });

  const titleId = `${mode}-card-title`;
  const descriptionId = `${mode}-card-description`;
  const apiTitleError = getApiFieldError(props.error, 'title');
  const apiDescriptionError = getApiFieldError(props.error, 'description');
  const titleError = form.formState.errors.title?.message ?? apiTitleError;
  const descriptionError = form.formState.errors.description?.message ?? apiDescriptionError;
  const generalError = getGeneralFormError(
    props.error,
    Boolean(apiTitleError || apiDescriptionError),
  );
  const handleSubmit = form.handleSubmit(props.onSubmit);

  return (
    <FormDialog
      onClose={props.onClose}
      title={mode === 'create' ? 'Add card' : 'Edit card'}
      description={mode === 'create' ? 'Add a new card.' : 'Update title and description.'}
      submitLabel={mode === 'create' ? 'Add card' : 'Save changes'}
      pendingLabel={mode === 'create' ? 'Adding…' : 'Saving…'}
      isPending={props.isPending}
      error={generalError}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <Field data-invalid={Boolean(titleError)}>
        <FieldLabel htmlFor={titleId}>Title</FieldLabel>
        <Input
          id={titleId}
          disabled={props.isPending}
          aria-invalid={Boolean(titleError)}
          maxLength={60}
          {...form.register('title', { onChange: props.onErrorReset })}
        />
        <FieldError>{titleError}</FieldError>
      </Field>

      <Field data-invalid={Boolean(descriptionError)}>
        <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
        <Textarea
          id={descriptionId}
          disabled={props.isPending}
          aria-invalid={Boolean(descriptionError)}
          rows={5}
          {...form.register('description', { onChange: props.onErrorReset })}
        />
        <FieldError>{descriptionError}</FieldError>
      </Field>
    </FormDialog>
  );
};
