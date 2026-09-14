/**
 * Safe API request helper that prevents HTML-as-JSON parsing crashes
 * (e.g. 'JSON.parse: unexpected character at line 1 column 1 of the JSON data')
 * when running on static hosts, offline, or when backend reverse-proxy is misconfigured.
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  data: T | null;
  status: number;
  isHtmlFallback: boolean;
  errorMessage?: string;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    // Check if the server returned HTML instead of JSON (common on Apache/Nginx 404 or index.html SPA rewrites)
    if (contentType.includes('text/html')) {
      return {
        ok: false,
        data: null,
        status: res.status,
        isHtmlFallback: true,
        errorMessage: 'پاسخ سرور نامعتبر است (HTML به جای JSON دریافت شد)'
      };
    }

    const text = await res.text();
    if (!text || text.trim().startsWith('<')) {
      return {
        ok: false,
        data: null,
        status: res.status,
        isHtmlFallback: true,
        errorMessage: 'پاسخ سرور در قالب JSON معتبر نیست'
      };
    }

    try {
      const data = JSON.parse(text) as T;
      return {
        ok: res.ok,
        data,
        status: res.status,
        isHtmlFallback: false
      };
    } catch (parseError: any) {
      return {
        ok: false,
        data: null,
        status: res.status,
        isHtmlFallback: false,
        errorMessage: parseError?.message || 'خطا در پردازش اطلاعات دریافتی'
      };
    }
  } catch (networkError: any) {
    return {
      ok: false,
      data: null,
      status: 0,
      isHtmlFallback: false,
      errorMessage: networkError?.message || 'عدم دسترسی به سرور'
    };
  }
}
