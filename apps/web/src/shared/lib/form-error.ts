import { ApiError } from '@/shared/api/error';

export const getApiFieldError = (error: unknown, field: string): string | undefined =>
  error instanceof ApiError ? error.details?.[field]?.[0] : undefined;

export const getGeneralFormError = (error: unknown, hasFieldError: boolean): string | undefined => {
  if (!error || hasFieldError) {
    return undefined;
  }

  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
};
