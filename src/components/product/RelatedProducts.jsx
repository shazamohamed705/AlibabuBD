import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Stars({ count = 0 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 10 10"
          fill={i < Math.round(count) ? '#f59e0b' : 'none'}>
          <polygon points="5,1 6.2,3.8 9.5,3.8 7,5.7 7.9,9 5,7.2 2.1,9 3,5.7 0.5,3.8 3.8,3.8"
            stroke="#f59e0b" strokeWidth="0.6" />
        </svg>
      ))}
    </div>
  );
}

function RelatedCard({ product, wishlisted, onWishlist }) {
  const navigate    = useNavigate();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);

  const price    = product.priceAfterDiscount ?? product.price;
  const oldPrice = product.priceAfterDiscount ? product.price : null;
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null;

  return (
    <article
      style={{
        fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
        background: '#fff', borderRadius: '16px',
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
      <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', background: '#f8f9fa' }}>
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
        {product.hoverImg && (
          <img
            src={product.hoverImg}
            alt=""
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
            padding: '3px 8px', borderRadius: '6px', zIndex: 2,
          }}>-{discount}%</span>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); onWishlist(); }}
          aria-label="Wishlist"
          style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)', zIndex: 2,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill={wishlisted ? '#ef4444' : 'none'}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
              stroke={wishlisted ? '#ef4444' : '#9ca3af'} strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <h3 style={{
          fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 600,
          color: '#111827', margin: '0 0 2px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{product.name}</h3>

        {product.description && (
          <p style={{
            fontFamily: 'Poppins', fontSize: '0.68rem', color: '#9ca3af',
            margin: '0 0 6px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{product.description}</p>
        )}

        {/* Price + Cart */}
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
              flexShrink: 0, transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <Stars count={product.stars} />
      </div>
    </article>
  );
}

export default function RelatedProducts({ products }) {
  const [wishlist, setWishlist] = useState([]);
  const toggle = id => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  if (!products?.length) return (
    <section style={{ background: '#fff', padding: '2rem 0 3rem', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontFamily: 'Poppins', fontSize: '1.3rem', fontWeight: 700, color: '#14532d', margin: '0 0 1.5rem' }}>
          Related Products
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
              <div style={{ paddingBottom: '100%', background: '#f3f4f6', animation: 'pgPulse 1.4s ease infinite' }} />
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '8px', animation: 'pgPulse 1.4s ease infinite' }} />
                <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '4px', width: '60%', animation: 'pgPulse 1.4s ease infinite' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pgPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  );

  return (
    <section style={{ background: '#fff', padding: '2rem 0 3rem', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <h2 style={{ fontFamily: 'Poppins', fontSize: '1.3rem', fontWeight: 700, color: '#14532d', margin: '0 0 1.5rem' }}>
          Related Products
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          {products.map(p => (
            <RelatedCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggle(p.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
