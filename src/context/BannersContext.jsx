import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiFetch';

const CACHE_KEY = 'aurevia_banners_cache';
const BannersContext = createContext(null);

function toAbsUrl(path) {
  if (!path) return null;
  // Replace localhost with production domain
  if (path.includes('localhost')) {
    return path.replace(/https?:\/\/localhost:\d+/, 'https://aurevia-brand.com');
  }
  if (path.startsWith('http')) return path;
  return `https://aurevia-brand.com${path.startsWith('/') ? '' : '/'}${path}`;
}

function mapBanner(b) {
  return {
    id:       b._id || b.id,
    title:    b.title    || '',
    subtitle: b.subtitle || '',
    img:      toAbsUrl(b.imageUrl  || b.image),
    mobileImg: toAbsUrl(b.mobileImageUrl) || toAbsUrl(b.imageUrl || b.image),
    position: b.position,
    type:     b.type,
    order:    b.order    ?? 0,
    isActive: b.isActive ?? true,
  };
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const cached = JSON.parse(raw);
    // Invalidate cache if it contains localhost URLs
    const hasLocalhost = cached.some(b => b.img?.includes('localhost') || b.mobileImg?.includes('localhost'));
    if (hasLocalhost) { localStorage.removeItem(CACHE_KEY); return []; }
    return cached;
  } catch { return []; }
}

function saveCache(banners) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(banners)); } catch { /* noop */ }
}

export function BannersProvider({ children }) {
  // Start with cached data so UI shows immediately (no skeleton flash)
  const [banners,    setBanners]    = useState(() => loadCache());
  const [freshLoaded, setFreshLoaded] = useState(false);

  useEffect(() => {
    apiFetch('/banners')
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (!json) return;
        const list = (json?.data?.banners ?? [])
          .filter(b => b.isActive)
          .map(mapBanner)
          .sort((a, b) => a.order - b.order);
        setBanners(list);
        saveCache(list);
        setFreshLoaded(true);
      })
      .catch(() => setFreshLoaded(true)); // mark as done even on error
  }, []);

  const getBanners = (position) =>
    banners.filter(b => b.position === position);

  return (
    <BannersContext.Provider value={{
      banners,
      loading: !freshLoaded && banners.length === 0, // loading only if no cache AND no fresh data
      freshLoaded,
      getBanners,
    }}>
      {children}
    </BannersContext.Provider>
  );
}

export const useBanners = () => useContext(BannersContext);
