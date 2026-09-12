import { apiEnv } from './env';
import { getIdToken } from './firebase';
import { getSupabaseAccessToken } from './supabase';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** Which token to send as the bearer credential. Defaults to Firebase. */
  auth?: 'firebase' | 'supabase' | 'none';
};

async function authHeader(auth: RequestOptions['auth']): Promise<Record<string, string>> {
  if (auth === 'none') return {};
  const token = auth === 'supabase' ? await getSupabaseAccessToken() : await getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Calls the Python (FastAPI) backend, attaching the caller's bearer token. */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = 'firebase', headers, ...rest } = options;

  const response = await fetch(`${apiEnv.baseUrl}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader(auth)),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with ${response.status}`, response.status, payload);
  }
  return payload as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
};
