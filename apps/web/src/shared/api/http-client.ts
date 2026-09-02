import { ApiError, readApiError } from './error';
import { API_BASE_URL } from '@/shared/config/api';

type JsonRequestMethod = 'GET' | 'POST' | 'PATCH';
type RequestMethod = JsonRequestMethod | 'DELETE';
export type RequestOptions = Pick<RequestInit, 'signal'>;

type JsonResponse = Response & {
  json<TResponse>(): Promise<TResponse>;
};

const buildUrl = (path: string): string => {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL is not configured');
  }
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return new URL(path.replace(/^\/+/, ''), baseUrl).toString();
};

const sendRequest = async (
  path: string,
  method: RequestMethod,
  data: unknown,
  signal: RequestOptions['signal'],
): Promise<JsonResponse> => {
  const init: RequestInit = { method, signal };
  if (data !== undefined) {
    init.body = JSON.stringify(data);
    init.headers = { 'Content-Type': 'application/json; charset=UTF-8' };
  }
  const response: JsonResponse = await fetch(buildUrl(path), init);
  if (!response.ok) {
    const error = await readApiError(response);
    throw new ApiError(
      response.status,
      error?.error || response.statusText || `Request failed with status ${response.status}`,
      error?.details,
    );
  }
  return response;
};

const requestJson = async <TResponse>(
  path: string,
  method: JsonRequestMethod,
  data: unknown,
  options?: RequestOptions,
): Promise<TResponse> => {
  const response = await sendRequest(path, method, data, options?.signal);
  return response.json<TResponse>();
};

const requestVoid = async (path: string, options?: RequestOptions): Promise<void> => {
  await sendRequest(path, 'DELETE', undefined, options?.signal);
};

export const client = {
  get: <TResponse>(path: string, options?: RequestOptions) =>
    requestJson<TResponse>(path, 'GET', undefined, options),
  post: <TResponse>(path: string, data: unknown, options?: RequestOptions) =>
    requestJson<TResponse>(path, 'POST', data, options),
  patch: <TResponse>(path: string, data: unknown, options?: RequestOptions) =>
    requestJson<TResponse>(path, 'PATCH', data, options),
  delete: (path: string, options?: RequestOptions) => requestVoid(path, options),
};
