/**
 * Thin wrapper around fetch that automatically injects:
 *  - Accept-Language header  (e.g. 'ar' or 'en')
 *  - lang query parameter    (appended to URL for backends that read ?lang=)
 *  - Authorization Bearer token if available
 *
 * Usage:
 *   const res = await apiFetch('/products?page=1', { lang: 'ar' });
 */

const API = import.meta.env.VITE_API_BASE_URL || 'https://aurevia-brand.com/api/v1';

export function apiFetch(path, { lang, token, ...options } = {}) {
  // Read lang from argument → document attribute fallback → default 'en'
  const activeLang = lang || document.documentElement.lang || 'en';

  // Append ?lang= to URL (handles both relative and absolute paths)
  let url = path.startsWith('http') ? path : `${API}${path}`;
  const separator = url.includes('?') ? '&' : '?';
  // Only add if not already present
  if (!url.includes('lang=')) {
    url = `${url}${separator}lang=${activeLang}`;
  }

  const headers = {
    'Content-Type':   'application/json',
    'Accept-Language': activeLang,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(url, { ...options, headers });
}
