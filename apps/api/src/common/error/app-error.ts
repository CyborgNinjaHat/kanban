import { HTTPException } from 'hono/http-exception';
import { HttpStatus } from './http-status-codes.js';

import type { ContentfulStatusCode } from 'hono/utils/http-status';

export interface ErrorBody {
  error: string;
  details?: Record<string, string[]>;
}

export class AppError extends HTTPException {
  constructor(message: string, status: ContentfulStatusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(status, { message });
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  readonly details?: Record<string, string[]>;

  constructor(message = 'Validation failed', details?: Record<string, string[]>) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
