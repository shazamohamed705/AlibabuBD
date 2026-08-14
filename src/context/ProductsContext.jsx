import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/apiFetch';
import { useI18n } from '../i18n/i18nContext';

const API   = import.meta.env.VITE_API_BASE_URL || 'https://aurevia-brand.com/api/v1';
const BASE_URL = API.replace('/api/v1', '');

/** Prefix relative image paths with the base URL.
 *  In dev: use relative path so Vite proxy handles it (avoids 422).
 *  In prod: use full absolute URL.
 */
function toAbsoluteUrl(path) {
  if (!path) return null;
  // Replace localhost references with production domain
  if (path.includes('localhost')) {
    return path.replace(/https?:\/\/localhost:\d+/, 'https://aurevia-brand.com');
  }
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `https://aurevia-brand.com${normalized}`;
}

const ProductsContext = createContext(null);

/** Map API product shape → app product shape.
 *  Pass catMap (id→name) to resolve category IDs to names.
 */
export function mapProduct(p, catMap = {}) {
  const cover = toAbsoluteUrl(p.coverImageUrl || p.coverImage);
  const imgs  = (p.imagesUrl || p.images || []).map(toAbsoluteUrl).filter(Boolean);

  // Resolve category: object → name, string ID → lookup, plain string → as-is
  const rawCat = p.category;
  let categoryName;
  if (rawCat && typeof rawCat === 'object') {
    categoryName = rawCat.name;
  } else if (rawCat && catMap[rawCat]) {
    categoryName = catMap[rawCat];
  } else {
    categoryName = rawCat || '';
  }

  return {
    id:               p._id || p.id,
    slug:             p.slug || p._id || p.id,
    name:             p.name,
    description:      p.description,
    price:            p.price,
    priceAfterDiscount: p.priceAfterDiscount ?? null,
    currency:         'LE',
    img:      cover || imgs[0] || '/Image (Unisex).png',
    hoverImg: imgs[0] || cover || '/Image (Unisex).png',
    // gallery: cover first, then additional images (deduplicated)
    gallery: [cover, ...imgs].filter(Boolean).filter((url, i, arr) => arr.indexOf(url) === i),
    category:      categoryName,
    brand:         p.brand,
    stock:         p.stock         ?? 0,
    sold:          p.sold          ?? 0,
    ratingsAverage: p.ratingsAverage ?? 0,
    ratingsCount:   p.ratingsCount   ?? 0,
    tags:          p.tags || [],
    sizes:         p.sizes || [],
    fragranceNotes: p.fragranceNotes || null,
    story:         p.story || p.description || '',
    isFeatured:   p.isFeatured   ?? false,
    isNewArrival: p.isNewArrival ?? false,
    isBestSeller: p.isBestSeller ?? false,
    isActive:     p.isActive     ?? true,
    tag: p.isBestSeller ? 'Best Seller'
       : p.isNewArrival ? 'New Arrival'
       : null,
    stars:   Math.round(p.ratingsAverage) || 0,
    reviews: p.ratingsCount || 0,
    _raw: p,
  };
}

export function ProductsProvider({ children }) {
  const { lang } = useI18n();
  const LIMIT = 12;

  // ── All products cache (used for home best-sellers, categories, etc.) ──
  const [products,    setProducts]    = useState([]);
  const [allLoading,  setAllLoading]  = useState(true);
  const [allError,    setAllError]    = useState(null);

  // ── Categories from API ──
  const [apiCategories, setApiCategories] = useState([]);

  // ── Shop grid server-side pagination state ──
  const [shopProducts,   setShopProducts]   = useState([]);
  const [shopLoading,    setShopLoading]    = useState(false);
  const [shopError,      setShopError]      = useState(null);
  const [shopPage,       setShopPage]       = useState(1);
  const [shopTotalPages, setShopTotalPages] = useState(1);
  const [shopTotal,      setShopTotal]      = useState(0);
  const [shopFilter,     setShopFilter]     = useState('all');

  // ── Initial load: products + categories in parallel (re-fetch on lang change) ──
  useEffect(() => {
    const fetchAll = async () => {
      setAllLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          apiFetch(`/products?page=1&limit=100&sort=-sold`, { lang }),
          apiFetch(`/categories`, { lang }),
        ]);

        let catMap = {};
        if (catRes.ok) {
          const json = await catRes.json();
          const cats = json?.data?.categories ?? [];
          setApiCategories(cats);
          // build id→name lookup
          catMap = cats.reduce((acc, c) => { acc[c._id] = c.name; return acc; }, {});
        }

        if (prodRes.ok) {
          const json = await prodRes.json();
          setProducts((json?.data?.products ?? []).map(p => mapProduct(p, catMap)));
        }
      } catch (err) {
        setAllError(err.message);
      } finally {
        setAllLoading(false);
      }
    };
    fetchAll();
  }, [lang]);

  // ── Shop grid: fetch specific page + optional category filter ──
  const fetchShopPage = useCallback(async (page = 1, category = 'all') => {
    setShopLoading(true);
    setShopError(null);
    setShopPage(page);
    setShopFilter(category);
    try {
      const catParam = category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
      // read lang from document to avoid stale closure
      const currentLang = document.documentElement.lang || 'en';
      const res = await apiFetch(`/products?page=${page}&limit=${LIMIT}&sort=-createdAt${catParam}`, { lang: currentLang });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = json?.data?.products ?? [];
      setShopProducts(list.map(mapProduct));
      const totalCount = json?.pagination?.total ?? json?.results ?? list.length;
      setShopTotal(totalCount);
      setShopTotalPages(Math.ceil(totalCount / LIMIT) || 1);
    } catch (err) {
      setShopError(err.message);
    } finally {
      setShopLoading(false);
    }
  }, []); // stable — reads lang from document at call time

  // Initial shop load
  useEffect(() => { fetchShopPage(1, 'all'); }, [fetchShopPage]);

  // Re-fetch shop page when language changes (keep same page/filter)
  useEffect(() => {
    fetchShopPage(shopPage, shopFilter);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Single product lookup ──
  const getProduct = useCallback(async (idOrSlug) => {
    // Don't use cache when we need a fresh language response
    try {
      const currentLang = document.documentElement.lang || 'en';
      const res = await apiFetch(`/products/${idOrSlug}`, { lang: currentLang });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return mapProduct(json?.data?.product ?? json?.data ?? json);
    } catch {
      // fallback to cache
      return products.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
    }
  }, [products]);

  // ── Derived from all-products cache ──
  // Prefer isBestSeller → isFeatured → sold desc.
  // If nothing is flagged, fall back to all products sorted by sold (shows something always).
  const flagged = products.filter(p => p.isBestSeller || p.isFeatured);
  const bestSellers = (flagged.length > 0 ? flagged : [...products])
    .sort((a, b) => {
      if (b.isBestSeller !== a.isBestSeller) return b.isBestSeller ? 1 : -1;
      if (b.isFeatured   !== a.isFeatured)   return b.isFeatured   ? 1 : -1;
      return (b.sold ?? 0) - (a.sold ?? 0);
    })
    .slice(0, 8);

  // Product categories derived from loaded products (for filter pills)
  const categories = [
    'all',
    ...Array.from(new Set(products.map(p => (p.category || '').trim()).filter(Boolean))),
  ];

  const categoryCounts = products.reduce((acc, p) => {
    const cat = (p.category || '').trim();
    acc[cat] = (acc[cat] || 0) + 1;
    acc.all  = (acc.all  || 0) + 1;
    return acc;
  }, {});

  return (
    <ProductsContext.Provider value={{
      // all-products cache
      products,
      loading: allLoading,
      error:   allError,
      bestSellers,
      categories,
      categoryCounts,
      getProduct,
      // API categories (for Header dropdown + FeaturedCollection)
      apiCategories,
      // shop grid pagination
      shopProducts,
      shopLoading,
      shopError,
      shopPage,
      shopTotalPages,
      shopTotal,
      shopFilter,
      fetchShopPage,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
