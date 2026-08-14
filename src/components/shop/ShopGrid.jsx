import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductsContext';


function useReveal(repeat = true) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { el.classList.add('revealed'); if (!repeat) io.disconnect(); }
        else if (repeat) el.classList.remove('revealed');
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill={i < count ? '#c9a96e' : 'none'}>
          <polygon points="5,1 6.2,3.8 9.5,3.8 7,5.7 7.9,9 5,7.2 2.1,9 3,5.7 0.5,3.8 3.8,3.8" stroke="#c9a96e" strokeWidth="0.6" />
        </svg>
      ))}
    </div>
  );
}

function SkeletonCard({ dark }) {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl mb-4" style={{ paddingBottom: '120%', background: dark ? '#2d2926' : '#f0ede8' }} />
      <div className="h-2 rounded mb-2" style={{ background: dark ? '#2d2926' : '#f0ede8', width: '60%' }} />
      <div className="h-3 rounded mb-2" style={{ background: dark ? '#2d2926' : '#f0ede8', width: '80%' }} />
      <div className="h-2 rounded"     style={{ background: dark ? '#2d2926' : '#f0ede8', width: '40%' }} />
    </div>
  );
}

function ProductCard({ product, dark }) {
  const navigate    = useNavigate();
  const { addItem } = useCart();
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';

  const pillBg   = dark ? '#c9a96e' : '#1a1612';
  const pillText = dark ? '#1a1612' : '#faf7f2';

  const displayPrice = product.priceAfterDiscount
    ? `${product.priceAfterDiscount} ${product.currency}`
    : `${product.price} ${product.currency}`;

  return (
    <article className="sg-card group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden mb-4" style={{ paddingBottom: '120%' }}>
        <img src={product.img}      alt={product.name} className="sg-img-main absolute inset-0 w-full h-full object-cover" onError={e => { e.target.src = '/Image (Unisex).png'; }} />
        <img src={product.hoverImg} alt={product.name} className="sg-img-hover absolute inset-0 w-full h-full object-cover opacity-0" onError={e => { e.target.src = '/Image (Unisex).png'; }} />

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="font-body text-[0.5rem] tracking-[0.2em] uppercase text-white/90">Out of Stock</span>
          </div>
        )}

        {product.tag && (
          <span className="absolute top-3 left-3 font-body text-[0.45rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: '#1a1612', color: '#faf7f2', fontWeight: isRtl ? 700 : undefined }}>
            {t(`shopGrid.tags.${product.tag}`) || product.tag}
          </span>
        )}

        {product.priceAfterDiscount && (
          <span className="absolute top-3 right-3 font-body text-[0.44rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
            style={{ background: '#c9a96e', color: '#fff' }}>
            -{Math.round((1 - product.priceAfterDiscount / product.price) * 100)}%
          </span>
        )}

        {product.stock > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center overflow-hidden rounded-full">
            <span className="sg-cart-label font-body text-[0.48rem] tracking-[0.18em] uppercase pl-3 pr-1 whitespace-nowrap"
              style={{ background: pillBg, color: pillText, paddingTop: '0.45rem', paddingBottom: '0.45rem' }}>
              {t('shopGrid.addToCart')}
            </span>
            <button aria-label="Add to cart" className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full"
              onClick={e => { e.stopPropagation(); addItem(product); }}
              style={{ background: pillBg }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1.5 1.5H2.5L4 7.5H9L10.5 3H3.5" stroke={pillText} strokeWidth="1" strokeLinecap="round" />
                <circle cx="4.5" cy="9.5" r="0.8" fill={pillText} />
                <circle cx="8.5" cy="9.5" r="0.8" fill={pillText} />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        {product.tags?.length > 0 && (
          <p className="font-body text-[0.48rem] tracking-[0.22em] uppercase text-[#c9a96e] mb-1">
            {product.tags.join(' · ')}
          </p>
        )}
        <h3 className="font-display text-xl font-light leading-tight mb-0.5"
          style={{ color: dark ? '#faf7f2' : '#1a1612' }}>
          {product.name}
        </h3>
        {product.description && (
          <p className="font-body text-[0.62rem] font-light mb-2.5 line-clamp-1"
            style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Stars count={product.stars} />
            {product.reviews > 0 && (
              <span className="font-body text-[0.46rem]" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
                ({product.reviews})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {product.priceAfterDiscount && (
              <span className="font-body text-[0.55rem] line-through" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
                {product.price} {product.currency}
              </span>
            )}
            <span className="font-display text-base font-light" style={{ color: dark ? '#faf7f2' : '#1a1612', letterSpacing: '-0.3px' }}>
              {displayPrice}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ShopGrid() {
  const [searchParams] = useSearchParams();
  const urlCategory    = searchParams.get('category');
  const barRef  = useReveal(false);
  const gridRef = useReveal(false);

  const { t, lang }   = useI18n();
  const { dark }      = useTheme();
  const isRtl = lang === 'ar';

  const {
    shopProducts, shopLoading, shopError,
    shopPage, shopTotalPages, shopTotal,
    shopFilter, fetchShopPage,
    apiCategories,
  } = useProducts();

  // Sync URL category on mount / change
  useEffect(() => {
    const cat = urlCategory || 'all';
    if (cat !== shopFilter) fetchShopPage(1, cat);
  }, [urlCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (cat) => fetchShopPage(1, cat);
  const handlePage   = (p)   => {
    fetchShopPage(p, shopFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section style={{ background: dark ? '#111009' : '#ffffff', paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <style>{`
        .sg-bar { opacity:0; transform:translateY(-20px); transition:opacity 0.8s cubic-bezier(.22,1,.36,1),transform 0.8s cubic-bezier(.22,1,.36,1); }
        .sg-bar.revealed { opacity:1; transform:translateY(0); }
        .sg-card { opacity:0; transform:translateY(40px); transition:opacity 0.7s cubic-bezier(.22,1,.36,1),transform 0.7s cubic-bezier(.22,1,.36,1); }
        .sg-grid.revealed .sg-card:nth-child(1)  { opacity:1;transform:translateY(0);transition-delay:0s }
        .sg-grid.revealed .sg-card:nth-child(2)  { opacity:1;transform:translateY(0);transition-delay:.06s }
        .sg-grid.revealed .sg-card:nth-child(3)  { opacity:1;transform:translateY(0);transition-delay:.12s }
        .sg-grid.revealed .sg-card:nth-child(4)  { opacity:1;transform:translateY(0);transition-delay:.18s }
        .sg-grid.revealed .sg-card:nth-child(5)  { opacity:1;transform:translateY(0);transition-delay:.24s }
        .sg-grid.revealed .sg-card:nth-child(6)  { opacity:1;transform:translateY(0);transition-delay:.30s }
        .sg-grid.revealed .sg-card:nth-child(7)  { opacity:1;transform:translateY(0);transition-delay:.36s }
        .sg-grid.revealed .sg-card:nth-child(8)  { opacity:1;transform:translateY(0);transition-delay:.42s }
        .sg-grid.revealed .sg-card:nth-child(9)  { opacity:1;transform:translateY(0);transition-delay:.48s }
        .sg-grid.revealed .sg-card:nth-child(10) { opacity:1;transform:translateY(0);transition-delay:.54s }
        .sg-grid.revealed .sg-card:nth-child(11) { opacity:1;transform:translateY(0);transition-delay:.60s }
        .sg-grid.revealed .sg-card:nth-child(12) { opacity:1;transform:translateY(0);transition-delay:.66s }
        .sg-img-main  { transition:transform 0.7s cubic-bezier(.22,1,.36,1),opacity 0.4s ease; }
        .sg-img-hover { transition:transform 0.7s cubic-bezier(.22,1,.36,1),opacity 0.4s ease; }
        .sg-card:hover .sg-img-main  { transform:scale(1.06);opacity:0; }
        .sg-card:hover .sg-img-hover { transform:scale(1.06);opacity:1; }
        .sg-cart-label { max-width:0;opacity:0;overflow:hidden;transition:max-width 0.5s cubic-bezier(.22,1,.36,1),opacity 0.3s ease; }
        .sg-card:hover .sg-cart-label { max-width:120px;opacity:1; }
        .sg-filter { transition:background 0.25s ease,color 0.25s ease,border-color 0.25s ease; }
        .sg-filter.active { background:#1a1612 !important;color:#faf7f2 !important;border-color:#1a1612 !important; }
        .sg-bar { scrollbar-width:none; }
        .sg-bar::-webkit-scrollbar { display:none; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Filter bar */}
        <div ref={barRef} className="sg-bar flex flex-nowrap sm:flex-wrap items-center gap-3 mb-10 overflow-x-auto sm:overflow-visible">
          {/* All button */}
          <button onClick={() => handleFilter('all')}
            className={`sg-filter font-body text-[0.58rem] tracking-[0.18em] uppercase px-4 py-2 rounded-full border whitespace-nowrap flex-shrink-0 ${shopFilter === 'all' ? 'active' : ''}`}
            style={{ background: 'transparent', color: dark ? '#a09080' : '#8b7d6b', borderColor: dark ? '#2d2926' : '#d4c9b8' }}>
            {t('shopGrid.filters.all')}
          </button>
          {/* Dynamic API categories */}
          {apiCategories.filter(c => c.isActive !== false).map(cat => (
            <button key={cat._id} onClick={() => handleFilter(cat._id)}
              className={`sg-filter font-body text-[0.58rem] tracking-[0.18em] uppercase px-4 py-2 rounded-full border whitespace-nowrap flex-shrink-0 ${shopFilter === cat._id ? 'active' : ''}`}
              style={{ background: 'transparent', color: dark ? '#a09080' : '#8b7d6b', borderColor: dark ? '#2d2926' : '#d4c9b8', fontWeight: isRtl ? 700 : undefined }}>
              {cat.name}
            </button>
          ))}
          <span className="ml-auto font-body text-[0.52rem] tracking-wide flex-shrink-0" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
            {shopTotal} {t('shopGrid.count')}
          </span>
        </div>

        {/* Error */}
        {shopError && (
          <p className="text-center font-body text-sm py-10" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
            Failed to load products. Please try again.
          </p>
        )}

        {/* Grid */}
        <div ref={gridRef} className="sg-grid grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 mb-14">
          {shopLoading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} dark={dark} />)
            : shopProducts.map(p => <ProductCard key={p.id} product={p} dark={dark} />)
          }
        </div>

        {/* Pagination */}
        {shopTotalPages > 1 && !shopLoading && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => handlePage(shopPage - 1)}
              disabled={shopPage === 1}
              className="font-body text-[0.55rem] tracking-[0.18em] uppercase px-4 py-2 rounded-full border transition-all disabled:opacity-30"
              style={{ color: dark ? '#a09080' : '#8b7d6b', borderColor: dark ? '#2d2926' : '#d4c9b8' }}>
              ←
            </button>

            {/* Page numbers */}
            {Array.from({ length: shopTotalPages }).map((_, i) => {
              const p = i + 1;
              // show first, last, current ±1, and ellipsis
              const show = p === 1 || p === shopTotalPages || Math.abs(p - shopPage) <= 1;
              const ellipsisBefore = p === shopPage - 2 && shopPage > 3;
              const ellipsisAfter  = p === shopPage + 2 && shopPage < shopTotalPages - 2;
              if (ellipsisBefore || ellipsisAfter) {
                return <span key={p} className="font-body text-[0.55rem]" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>…</span>;
              }
              if (!show) return null;
              return (
                <button key={p} onClick={() => handlePage(p)}
                  className="w-8 h-8 rounded-full font-body text-[0.55rem] transition-all"
                  style={{
                    background: shopPage === p ? '#1a1612' : 'transparent',
                    color: shopPage === p ? '#faf7f2' : dark ? '#a09080' : '#8b7d6b',
                    border: `1px solid ${shopPage === p ? '#1a1612' : dark ? '#2d2926' : '#d4c9b8'}`,
                  }}>
                  {p}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => handlePage(shopPage + 1)}
              disabled={shopPage === shopTotalPages}
              className="font-body text-[0.55rem] tracking-[0.18em] uppercase px-4 py-2 rounded-full border transition-all disabled:opacity-30"
              style={{ color: dark ? '#a09080' : '#8b7d6b', borderColor: dark ? '#2d2926' : '#d4c9b8' }}>
              →
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
