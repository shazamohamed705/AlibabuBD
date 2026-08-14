import { useNavigate } from 'react-router-dom';
import { useCart }      from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useI18n }      from '../../i18n/i18nContext';
import { useTheme }     from '../../context/ThemeContext';

// ─── Single product card ──────────────────────────────────────────────────────
function WishlistCard({ product, onRemove, onAddToCart, colors: c }) {
  const navigate  = useNavigate();
  const productId = product._id ?? product.id;

  const imageUrl = (() => {
    const raw = product.coverImageUrl ?? product.coverImage ?? product.img ?? null;
    if (!raw) return '/Image (Unisex).png';
    // Replace localhost with production domain
    if (raw.includes('localhost')) {
      return raw.replace(/https?:\/\/localhost:\d+/, 'https://aurevia-brand.com');
    }
    // Relative path → absolute
    if (!raw.startsWith('http')) {
      return `https://aurevia-brand.com${raw.startsWith('/') ? '' : '/'}${raw}`;
    }
    return raw;
  })();

  const displayPrice = product.priceAfterDiscount ?? product.price;
  const hasDiscount  = product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  return (
    <div
      className="wl-card rounded-2xl overflow-hidden flex flex-col"
      style={{ background: c.card, border: `1px solid ${c.border}` }}
    >
      {/* Image */}
      <div
        className="overflow-hidden cursor-pointer"
        style={{ aspectRatio: '1/1' }}
        onClick={() => navigate(`/product/${productId}`)}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="wl-img w-full h-full object-cover"
          onError={e => { e.currentTarget.src = '/placeholder.png'; }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="font-body text-[0.46rem] tracking-[0.2em] uppercase" style={{ color: '#c9a96e' }}>
          {product.brand ?? product.category ?? ''}
        </p>
        <h3
          className="font-display text-base font-light leading-tight cursor-pointer transition-colors"
          style={{ color: c.text }}
          onClick={() => navigate(`/product/${productId}`)}
          onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
          onMouseLeave={e => e.currentTarget.style.color = c.text}
        >
          {product.name}
        </h3>
        <p className="font-body text-[0.55rem] font-light" style={{ color: c.muted }}>
          {product.description ?? ''}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-display text-base font-light" style={{ color: c.text }}>
            {displayPrice} LE
          </span>
          {hasDiscount && (
            <span className="font-body text-[0.52rem] line-through" style={{ color: c.muted }}>
              {product.price} LE
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button className="wl-add-btn" onClick={() => onAddToCart(product)}>
          Add to Cart
        </button>
        <button
          className="wl-remove"
          onClick={() => onRemove(productId)}
          aria-label="Remove from wishlist"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="1" y1="1" x2="9" y2="9" stroke={c.removeLine} strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="9" y1="1" x2="1" y2="9" stroke={c.removeLine} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyWishlist({ colors: c }) {
  const navigate = useNavigate();
  const { t }    = useI18n();

  return (
    <div className="text-center py-20">
      <svg className="mx-auto mb-6" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 40S8 30 8 18a8 8 0 0116 0 8 8 0 0116 0c0 12-16 22-16 22z"
          stroke={c.muted} strokeWidth="1.2" fill="none"
        />
      </svg>
      <p className="font-display text-2xl font-light mb-4" style={{ color: c.muted }}>
        {t('dashboard.wishlistEmpty')}
      </p>
      <button
        onClick={() => navigate('/shop')}
        className="font-body text-[0.58rem] tracking-[0.2em] uppercase underline transition-colors"
        style={{ color: '#c9a96e' }}
        onMouseEnter={e => e.currentTarget.style.color = c.text}
        onMouseLeave={e => e.currentTarget.style.color = '#c9a96e'}
      >
        {t('dashboard.exploreCollection')}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashWishlist() {
  const { t }    = useI18n();
  const { dark } = useTheme();
  const { addItem } = useCart();
  const { favorites, loading, removeFavorite } = useFavorites();

  const c = {
    card:          dark ? '#1a1612' : '#ffffff',
    border:        dark ? '#2d2926' : '#ede8e0',
    text:          dark ? '#faf7f2' : '#1a1612',
    muted:         dark ? '#a09080' : '#8b7d6b',
    goldHover:     dark ? '#faf7f2' : '#1a1612',
    btnBg:         dark ? '#c9a96e' : '#1a1612',
    btnText:       dark ? '#1a1612' : '#faf7f2',
    btnHoverBg:    dark ? '#e8d5b0' : '#2d2520',
    removeBorder:  dark ? '#4a4238' : '#d4c9b8',
    removeLine:    dark ? '#a09080' : '#8b7d6b',
    removeHoverBg: dark ? '#c9a96e' : '#1a1612',
  };

  return (
    <div style={{ animation: 'dashFade 0.5s ease both' }}>
      <style>{`
        @keyframes dashFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .wl-card { transition: box-shadow 0.3s ease; }
        .wl-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.08); }

        .wl-img { transition: transform 0.6s cubic-bezier(.22,1,.36,1); }
        .wl-card:hover .wl-img { transform: scale(1.04); }

        .wl-add-btn {
          flex: 1;
          background: var(--wl-btn-bg);
          color: var(--wl-btn-text);
          border: none;
          border-radius: 999px;
          padding: 0.7rem 1rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .wl-add-btn:hover { background: var(--wl-btn-hover-bg); }

        .wl-remove {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1px solid var(--wl-remove-border);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .wl-remove:hover { border-color: var(--wl-remove-hover-bg); background: var(--wl-remove-hover-bg); }
        .wl-remove:hover svg line { stroke: #faf7f2; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-light" style={{ color: c.text }}>
          {t('dashboard.wishlist')}{' '}
          <span className="font-body text-sm font-light" style={{ color: c.muted }}>
            ({favorites.length})
          </span>
        </h2>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
              style={{ background: c.card, border: `1px solid ${c.border}`, aspectRatio: '3/4' }} />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && favorites.length > 0 && (
        <div
          className="grid grid-cols-2 lg:grid-cols-3 gap-5"
          style={{
            '--wl-btn-bg':        c.btnBg,
            '--wl-btn-text':      c.btnText,
            '--wl-btn-hover-bg':  c.btnHoverBg,
            '--wl-remove-border': c.removeBorder,
            '--wl-remove-hover-bg': c.removeHoverBg,
          }}
        >
          {favorites.map(product => (
            <WishlistCard
              key={product._id ?? product.id}
              product={product}
              colors={c}
              onRemove={removeFavorite}
              onAddToCart={addItem}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && favorites.length === 0 && <EmptyWishlist colors={c} />}
    </div>
  );
}
