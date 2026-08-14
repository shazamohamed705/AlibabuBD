import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiFetch';
import { useI18n } from '../i18n/i18nContext';

const CACHE_PREFIX = 'aurevia_page_';

function loadCache(slug, lang) {
  try { return JSON.parse(localStorage.getItem(`${CACHE_PREFIX}${slug}_${lang}`) || 'null'); } catch { return null; }
}
function saveCache(slug, lang, data) {
  try { localStorage.setItem(`${CACHE_PREFIX}${slug}_${lang}`, JSON.stringify(data)); } catch {}
}

/**
 * Fetches /api/v1/pages/:slug with Accept-Language header.
 * Stale-while-revalidate: shows cached data instantly, updates in background.
 * Re-fetches automatically when language changes.
 */
export function usePageContent(slug) {
  const { lang } = useI18n();
  const [data,    setData]    = useState(() => loadCache(slug, lang));
  const [loading, setLoading] = useState(!loadCache(slug, lang));

  useEffect(() => {
    // Show cached version for the new lang immediately
    const cached = loadCache(slug, lang);
    if (cached) { setData(cached); setLoading(false); }
    else setLoading(true);

    apiFetch(`/pages/${slug}?lang=${lang}`, { lang })
      .then(r => {
        if (r.ok) return r.json();
        // Fallback: try list endpoint with slug filter
        return apiFetch(`/pages?slug=${slug}&lang=${lang}`, { lang }).then(r2 => r2.ok ? r2.json() : null);
      })
      .then(json => {
        const page = json?.data?.page ?? json?.data?.pages?.[0] ?? null;
        if (page) { setData(page); saveCache(slug, lang, page); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, lang]); // re-fetch on lang change

  return { data, loading };
}
