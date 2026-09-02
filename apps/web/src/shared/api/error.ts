import type { ApiErrorResponse } from '@kanban/contracts';

export class ApiError extends Error {
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(
    status: number,
    message = `Request failed with status ${status}`,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!isRecord(value) || typeof value.error !== 'string') {
    return false;
  }
  const { details } = value;
  if (details === undefined) {
    return true;
  }
  if (!isRecord(details)) {
    return false;
  }
  return Object.values(details).every(
    (messages) =>
      Array.isArray(messages) && messages.every((message) => typeof message === 'string'),
  );
};

export const readApiError = async (response: Response): Promise<ApiErrorResponse | undefined> => {
  try {
    const body: unknown = await response.json();
    return isApiErrorResponse(body) ? body : undefined;
  } catch {
    return undefined;
  }
};
