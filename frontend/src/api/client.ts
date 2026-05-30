const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

type FetchOptions = RequestInit & { query?: Record<string, string | number | undefined> };

function buildUrl(path: string, query?: Record<string, any>) {
  const url = new URL(path, API_BASE);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function request<T = any>(method: string, path: string, options: FetchOptions = {}): Promise<T> {
  const { query, headers, body, ...rest } = options;
  const url = buildUrl(path, query as any);
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return (await res.text()) as unknown as T;
}

export const api = {
  get: <T = any>(path: string, opts?: FetchOptions) => request<T>("GET", path, opts),
  post: <T = any>(path: string, opts?: FetchOptions) => request<T>("POST", path, opts),
  put: <T = any>(path: string, opts?: FetchOptions) => request<T>("PUT", path, opts),
  del: <T = any>(path: string, opts?: FetchOptions) => request<T>("DELETE", path, opts),
};

export default api;
