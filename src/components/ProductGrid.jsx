import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

/* ── Reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('revealed'); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Stars ── */
function Stars({ count = 0, total = 5 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 10 10"
          fill={i < Math.round(count) ? '#f59e0b' : 'none'}>
          <polygon
            points="5,1 6.2,3.8 9.5,3.8 7,5.7 7.9,9 5,7.2 2.1,9 3,5.7 0.5,3.8 3.8,3.8"
            stroke="#f59e0b" strokeWidth="0.6" />
        </svg>
      ))}
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        width: '100%', paddingBottom: '125%', background: '#f3f4f6',
        borderRadius: '10px', marginBottom: '12px',
        animation: 'pgPulse 1.4s ease-in-out infinite',
      }} />
      <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '4px', width: '40%', marginBottom: '8px', animation: 'pgPulse 1.4s ease-in-out infinite' }} />
      <div style={{ height: '14px', background: '#f3f4f6', borderRadius: '4px', width: '75%', marginBottom: '6px', animation: 'pgPulse 1.4s ease-in-out infinite' }} />
      <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '4px', width: '50%', animation: 'pgPulse 1.4s ease-in-out infinite' }} />
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, wishlisted, onWishlist }) {
  const navigate   = useNavigate();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);

  const price    = product.priceAfterDiscount ?? product.price;
  const oldPrice = product.priceAfterDiscount ? product.price : null;
  const discount = oldPrice
    ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
    : null;

  return (
    <article
      className="pg-card"
      style={{
        fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'hidden',
      }}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '100%',
        overflow: 'hidden', background: '#f8f9fa' }}>

        {/* Main image */}
        <img
          src={product.img}
          alt={product.name}
          onError={e => { e.target.src = '/Image (Unisex).png'; }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease, opacity 0.4s ease',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            opacity: (hovered && product.hoverImg) ? 0 : 1,
          }}
        />

        {/* Hover image */}
        {product.hoverImg && (
          <img
            src={product.hoverImg}
            alt={product.name}
            onError={e => { e.target.style.display = 'none'; }}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease, opacity 0.4s ease',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              opacity: hovered ? 1 : 0,
            }}
          />
        )}

        {/* Discount badge */}
        {discount && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#dc2626', color: '#fff',
            fontFamily: 'Poppins', fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: '6px',
            zIndex: 2,
          }}>
            {discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); onWishlist(); }}
          aria-label="Wishlist"
          style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s',
            zIndex: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#ef4444' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke={wishlisted ? '#ef4444' : '#9ca3af'} strokeWidth="1.2" />
          </svg>
        </button>

        {/* Add to cart — removed from image, shown in info section */}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        {/* Name */}
        <h3 style={{
          fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 600,
          color: '#111827', margin: '0 0 2px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p style={{
            fontFamily: 'Poppins', fontSize: '0.68rem', color: '#9ca3af',
            margin: '0 0 6px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {product.description}
          </p>
        )}

        {/* Price + Cart btn */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontFamily: 'Poppins', fontSize: '0.92rem', fontWeight: 700, color: '#16a34a' }}>
              {price} {product.currency}
            </span>
            {oldPrice && (
              <span style={{ fontFamily: 'Poppins', fontSize: '0.7rem', color: '#dc2626', textDecoration: 'line-through' }}>
                {oldPrice} {product.currency}
              </span>
            )}
          </div>
          <button
              onClick={e => { e.stopPropagation(); addItem(product); }}
              aria-label="Add to cart"
              style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: '#16a34a', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                  stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
        </div>

        {/* Stars + rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Stars count={product.stars} />
          {product.stars > 0 && (
            <span style={{ fontFamily: 'Poppins', fontSize: '0.68rem', color: '#6b7280', fontWeight: 500 }}>
              {product.stars}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Category label formatter ── */
function formatCategory(cat) {
  if (!cat || cat === 'all') return 'All';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

/* ── Main export ── */
export default function ProductGrid({ title = 'Weekly Trending' }) {
  const { products, loading, categories, bestSellers } = useProducts();
  const [activeFilter, setActiveFilter] = useState('all');
  const [wishlist,     setWishlist]     = useState([]);
  const gridRef = useReveal();

  const displayed = activeFilter === 'all'
    ? bestSellers
    : products.filter(p => (p.category || '').trim() === activeFilter).slice(0, 8);

  const toggleWishlist = id =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <section style={{ background: '#fff', padding: '2.5rem 0 1.5rem', fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        @keyframes pgPulse {
          0%,100% { opacity:1; } 50% { opacity:0.5; }
        }
        .pg-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .pg-grid.revealed .pg-card:nth-child(1)  { opacity:1; transform:translateY(0); transition-delay:0s;    }
        .pg-grid.revealed .pg-card:nth-child(2)  { opacity:1; transform:translateY(0); transition-delay:.06s;  }
        .pg-grid.revealed .pg-card:nth-child(3)  { opacity:1; transform:translateY(0); transition-delay:.12s;  }
        .pg-grid.revealed .pg-card:nth-child(4)  { opacity:1; transform:translateY(0); transition-delay:.18s;  }
        .pg-grid.revealed .pg-card:nth-child(5)  { opacity:1; transform:translateY(0); transition-delay:.24s;  }
        .pg-grid.revealed .pg-card:nth-child(6)  { opacity:1; transform:translateY(0); transition-delay:.30s;  }
        .pg-grid.revealed .pg-card:nth-child(7)  { opacity:1; transform:translateY(0); transition-delay:.36s;  }
        .pg-grid.revealed .pg-card:nth-child(8)  { opacity:1; transform:translateY(0); transition-delay:.42s;  }
        .pg-filter-btn {
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem; font-weight: 500;
          padding: 0.3rem 1rem; border-radius: 999px;
          border: 1.5px solid #e5e7eb;
          background: transparent; color: #6b7280;
          cursor: pointer; transition: all 0.2s ease;
          white-space: nowrap;
        }
        .pg-filter-btn:hover { border-color: #14532d; color: #14532d; }
        .pg-filter-btn.active {
          background: #14532d; color: #fff; border-color: #14532d;
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 700,
            color: '#14532d', margin: 0,
          }}>
            {title}
          </h2>

          {/* Filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',
            flexWrap: 'wrap', overflowX: 'auto' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`pg-filter-btn${activeFilter === cat ? ' active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat === 'all' ? 'All' : formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="pg-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}
        >
          <style>{`
            @media (min-width: 640px)  { .pg-grid { grid-template-columns: repeat(3, 1fr) !important; } }
            @media (min-width: 1024px) { .pg-grid { grid-template-columns: repeat(4, 1fr) !important; } }
          `}</style>
          {loading && products.length === 0
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlisted={wishlist.includes(product.id)}
                  onWishlist={() => toggleWishlist(product.id)}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
}
