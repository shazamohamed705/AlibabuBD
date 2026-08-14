import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/apiFetch';
import { useAuth }  from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user, getAuthToken } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading,   setLoading]   = useState(false);

  // ─── GET /api/v1/favorites ──────────────────────────────────────────────────
  const fetchFavorites = useCallback(async () => {
    const token = getAuthToken();
    if (!token) { setFavorites([]); return; }

    setLoading(true);
    try {
      const res  = await apiFetch('/favorites', { token });
      const json = await res.json();
      setFavorites(json?.data?.favorites?.products ?? []);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  // ─── POST /api/v1/favorites ─────────────────────────────────────────────────
  const addFavorite = useCallback(async (productId) => {
    const token = getAuthToken();
    if (!token) return;

    const res  = await apiFetch('/favorites', {
      method: 'POST',
      token,
      body: JSON.stringify({ productId }),
    });
    const json = await res.json();
    if (json?.data?.favorites?.products) {
      setFavorites(json.data.favorites.products);
    }
  }, [getAuthToken]);

  // ─── DELETE /api/v1/favorites/:productId ────────────────────────────────────
  const removeFavorite = useCallback(async (productId) => {
    const token = getAuthToken();
    if (!token) return;

    // optimistic
    setFavorites(prev => prev.filter(p => (p._id ?? p.id) !== productId));

    await apiFetch(`/favorites/${productId}`, { method: 'DELETE', token });
  }, [getAuthToken]);

  // ─── helper ─────────────────────────────────────────────────────────────────
  const isFavorite = useCallback(
    (productId) => favorites.some(p => (p._id ?? p.id) === productId),
    [favorites],
  );

  // re-fetch when auth state changes
  useEffect(() => {
    if (user) fetchFavorites();
    else      setFavorites([]);
  }, [user, fetchFavorites]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, fetchFavorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
