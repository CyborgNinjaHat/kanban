import { DrizzleQueryError } from 'drizzle-orm';
import { BadRequestError, ConflictError, InternalServerError } from './app-error.js';
import { PgErrorCode } from './pg-error-codes.js';

import type { AppError } from './app-error.js';

interface PgError {
  code: string;
}

const isPgError = (error: unknown): error is PgError => {
  return (
    typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
  );
};

const pgErrorToAppError: Record<PgErrorCode, (error: PgError) => AppError> = {
  [PgErrorCode.UNIQUE_VIOLATION]: () => new ConflictError('Resource already exists'),

  [PgErrorCode.FOREIGN_KEY_VIOLATION]: () => new ConflictError('Resource does not exist'),

  [PgErrorCode.NOT_NULL_VIOLATION]: () => new BadRequestError('Required field is missing'),

  [PgErrorCode.CHECK_VIOLATION]: () => new BadRequestError('Value violates database constraint'),
};

const isKnownPgErrorCode = (code: string): code is PgErrorCode => {
  return Object.hasOwn(pgErrorToAppError, code);
};

export const mapDatabaseError = (error: unknown): AppError => {
  if (!(error instanceof DrizzleQueryError)) {
    return new InternalServerError();
  }

  const cause = error.cause;

  if (!isPgError(cause) || !isKnownPgErrorCode(cause.code)) {
    return new InternalServerError();
  }

  return pgErrorToAppError[cause.code](cause);
};
