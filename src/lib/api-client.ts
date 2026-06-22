type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number };

type ApiFetchOptions = RequestInit & {
  timeoutMs?: number;
  retries?: number;
};

const DEFAULT_TIMEOUT = 12_000;

async function parseResponse<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveApiUrl(url: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (!base || url.startsWith("http")) return url;
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

/** Resilient client fetch — timeout, retry on network failure, safe JSON parse. */
export async function apiFetch<T = Record<string, unknown>>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<ApiResult<T>> {
  const { timeoutMs = DEFAULT_TIMEOUT, retries = 1, ...init } = options;
  const method = (init.method ?? "GET").toUpperCase();
  const maxAttempts = method === "GET" ? retries + 1 : 1;
  const requestUrl = resolveApiUrl(url);

  let lastError = "Network error. Please check your connection.";

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(requestUrl, { ...init, signal: controller.signal });
      clearTimeout(timer);

      const data = await parseResponse<T & { error?: string; success?: boolean }>(res);

      if (!res.ok) {
        const message =
          (data && typeof data === "object" && "error" in data && data.error) ||
          `Request failed (${res.status})`;
        return { ok: false, error: String(message), status: res.status };
      }

      if (data === null && res.status !== 204) {
        return { ok: false, error: "Invalid server response.", status: res.status };
      }

      return { ok: true, data: (data ?? {}) as T, status: res.status };
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof DOMException && err.name === "AbortError") {
        lastError = "Request timed out. Please try again.";
      } else {
        lastError = "Network error. Please check your connection.";
      }

      if (attempt < maxAttempts - 1) {
        await delay(400 * (attempt + 1));
        continue;
      }
    }
  }

  return { ok: false, error: lastError, status: 0 };
}
