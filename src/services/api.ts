// src/services/api.ts
const API_BASE_URL = "https://compass-io-js.vercel.app";

type RequestOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { query, headers, ...rest } = options;

  const response = await fetch(buildUrl(path, query), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}