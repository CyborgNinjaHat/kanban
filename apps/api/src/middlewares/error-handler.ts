import { DrizzleQueryError } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { AppError, InternalServerError, ValidationError } from '../common/error/app-error.js';
import { mapDatabaseError } from '../common/error/db-error-mapper.js';

import type { ErrorBody } from '../common/error/app-error.js';
import type { ErrorHandler } from 'hono';

const resolveAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof DrizzleQueryError) {
    return mapDatabaseError(error);
  }
  if (error instanceof HTTPException) {
    return new AppError(error.message || 'Request failed', error.status);
  }
  return new InternalServerError();
};

export const errorHandler: ErrorHandler = (error, context) => {
  const appError = resolveAppError(error);
  const message = appError.status >= 500 ? 'Internal server error' : appError.message;

  if (appError.status >= 500) {
    console.error(error);
  } else {
    console.warn(`${appError.status}: ${appError.message}`);
  }

  const body: ErrorBody = {
    error: message,
    ...(appError instanceof ValidationError && appError.details
      ? { details: appError.details }
      : {}),
  };

  return context.json(body, appError.status);
};
