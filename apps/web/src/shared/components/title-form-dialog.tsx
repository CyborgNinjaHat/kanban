import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog } from '@/shared/components/form-dialog';
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { getApiFieldError, getGeneralFormError } from '@/shared/lib/form-error';

import type { ZodType } from 'zod';

interface TitleFormValues {
  title: string;
}

interface TitleFormDialogProps {
  title: string;
  description: string;
  initialTitle?: string;
  schema: ZodType<TitleFormValues, TitleFormValues>;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  error?: unknown;
  onErrorReset: () => void;
  onClose: () => void;
  onSubmit: (data: TitleFormValues) => void | Promise<void>;
}

export const TitleFormDialog = ({
  title,
  description,
  initialTitle = '',
  schema,
  submitLabel,
  pendingLabel,
  isPending,
  error,
  onErrorReset,
  onClose,
  onSubmit,
}: TitleFormDialogProps) => {
  const fieldId = useId();
  const form = useForm<TitleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: initialTitle },
  });

  const apiTitleError = getApiFieldError(error, 'title');
  const titleError = form.formState.errors.title?.message ?? apiTitleError;
  const generalError = getGeneralFormError(error, Boolean(apiTitleError));
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <FormDialog
      onClose={onClose}
      title={title}
      description={description}
      submitLabel={submitLabel}
      pendingLabel={pendingLabel}
      isPending={isPending}
      error={generalError}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <Field data-invalid={Boolean(titleError)}>
        <FieldLabel htmlFor={fieldId}>Title</FieldLabel>
        <Input
          id={fieldId}
          disabled={isPending}
          aria-invalid={Boolean(titleError)}
          maxLength={60}
          {...form.register('title', { onChange: onErrorReset })}
        />
        <FieldError>{titleError}</FieldError>
      </Field>
    </FormDialog>
  );
};
