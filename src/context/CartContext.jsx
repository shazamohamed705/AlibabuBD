import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const API = import.meta.env.VITE_API_BASE_URL || 'https://aurevia-brand.com/api/v1';
const CART_CACHE_KEY = 'aurevia_cart_cache';

// ─── Cache helpers ────────────────────────────────────────────────────────────
function saveCartCache(items) {
  try { localStorage.setItem(CART_CACHE_KEY, JSON.stringify(items)); } catch {}
}
function loadCartCache() {
  try { return JSON.parse(localStorage.getItem(CART_CACHE_KEY) || '[]'); } catch { return []; }
}

// ─── URL normaliser ───────────────────────────────────────────────────────────
function toAbsUrl(path) {
  if (!path) return '/Image (Unisex).png';
  if (path.includes('localhost'))
    return path.replace(/https?:\/\/localhost:\d+/, 'https://aurevia-brand.com');
  if (path.startsWith('http')) return path;
  return `https://aurevia-brand.com${path.startsWith('/') ? '' : '/'}${path}`;
}

// ─── API item → local shape ───────────────────────────────────────────────────
function mapCartItem(item) {
  const productId  = typeof item.product === 'object'
    ? (item.product._id || item.product.id)
    : item.product;

  return {
    key:        productId,          // used for local dedup
    cartItemId: item._id ?? null,   // backend cart item _id — used for PATCH/DELETE
    product: {
      id:    productId,
      name:  item.name || item.product?.name,
      price: item.price ?? item.product?.price ?? 0,
      currency: 'LE',
      img:   toAbsUrl(item.coverImage || item.product?.coverImage),
    },
    qty: item.quantity ?? 1,
  };
}

// ─── Authenticated fetch helper ───────────────────────────────────────────────
async function authFetch(url, token, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const { user, getAuthToken } = useAuth();
  const [items,    setItems]   = useState(() => loadCartCache());
  const [isOpen,   setIsOpen]  = useState(false);
  const [syncing,  setSyncing] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => { saveCartCache(items); }, [items]);

  // ── Fetch cart from API ──────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    setFetching(true);
    try {
      const res  = await authFetch(`${API}/cart`, token);
      if (!res.ok) return;
      const json = await res.json();
      const list = json?.data?.cart?.items ?? json?.data?.items ?? [];
      const mapped = list.map(mapCartItem);
      setItems(mapped);
      saveCartCache(mapped);
    } catch { /* silent */ }
    finally { setFetching(false); }
  }, [getAuthToken]);

  // Re-fetch whenever auth state changes
  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  // ── Add item ─────────────────────────────────────────────────────────────────
  const addItem = useCallback(async (product, size = null, qty = 1) => {
    const token = getAuthToken();

    // Optimistic local update
    setItems(prev => {
      const exists = prev.find(i => i.key === product.id);
      if (exists) return prev.map(i => i.key === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key: product.id, cartItemId: null, product, size, qty }];
    });
    setIsOpen(true);

    if (token) {
      setSyncing(true);
      try {
        const res  = await authFetch(`${API}/cart`, token, {
          method: 'POST',
          body:   JSON.stringify({ productId: product.id, quantity: qty }),
        });
        if (res.ok) {
          const json = await res.json();
          const list = json?.data?.cart?.items ?? [];
          if (list.length > 0) setItems(list.map(mapCartItem));
        }
      } catch { /* keep local state */ }
      finally { setSyncing(false); }
    }
  }, [getAuthToken]);

  // ── Remove item ──────────────────────────────────────────────────────────────
  const removeItem = useCallback(async (key) => {
    const token = getAuthToken();
    const item  = items.find(i => i.key === key);
    setItems(prev => prev.filter(i => i.key !== key));
    if (token && item?.cartItemId) {
      try { await authFetch(`${API}/cart/${item.cartItemId}`, token, { method: 'DELETE' }); }
      catch { /* keep local */ }
    }
  }, [getAuthToken, items]);

  // ── Update quantity ──────────────────────────────────────────────────────────
  const updateQty = useCallback(async (key, qty) => {
    if (qty < 1) { removeItem(key); return; }
    const token = getAuthToken();
    const item  = items.find(i => i.key === key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
    if (token && item?.cartItemId) {
      try {
        await authFetch(`${API}/cart/${item.cartItemId}`, token, {
          method: 'PATCH',
          body:   JSON.stringify({ quantity: qty }),
        });
      } catch { /* keep local */ }
    }
  }, [getAuthToken, removeItem, items]);

  // ── Clear cart ───────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    const token = getAuthToken();
    setItems([]);
    saveCartCache([]);
    if (token) {
      try { await authFetch(`${API}/cart`, token, { method: 'DELETE' }); }
      catch { /* keep local */ }
    }
  }, [getAuthToken]);

  // ── Computed ─────────────────────────────────────────────────────────────────
  const total = items.reduce((sum, i) => sum + (Number(i.product.price) || 0) * i.qty, 0);

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      isOpen, setIsOpen,
      total, count, syncing, fetching,
      refreshCart: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
