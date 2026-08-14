import { useState } from 'react';
import { useCart } from '../../context/CartContext';

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 10 10"
          fill={i < Math.round(count) ? '#f59e0b' : 'none'}>
          <polygon points="5,1 6.2,3.8 9.5,3.8 7,5.7 7.9,9 5,7.2 2.1,9 3,5.7 0.5,3.8 3.8,3.8"
            stroke="#f59e0b" strokeWidth="0.6" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductInfo({ product }) {
  const sizes = product.sizes?.length ? product.sizes : null;
  const [size,  setSize]  = useState(sizes?.[0] || null);
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const price    = product.priceAfterDiscount ?? product.price;
  const oldPrice = product.priceAfterDiscount ? product.price : null;
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null;

  const handleAdd = () => {
    addItem(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {product.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'Poppins', fontSize: '0.65rem', fontWeight: 600,
              color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.08em',
              background: '#f0fdf4', padding: '3px 10px', borderRadius: '999px',
              border: '1px solid #bbf7d0',
            }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Name */}
      <h1 style={{
        fontFamily: 'Poppins', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: 700, color: '#111827', margin: '0 0 6px', lineHeight: 1.25,
      }}>
        {product.name}
      </h1>

      {/* Subtitle */}
      {product.subtitle && (
        <p style={{ fontFamily: 'Poppins', fontSize: '0.9rem', color: '#6b7280', margin: '0 0 12px' }}>
          {product.subtitle}
        </p>
      )}

      {/* Stars + reviews + stock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {product.stars > 0 && (
          <>
            <Stars count={product.stars} />
            <span style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#6b7280' }}>
              ({product.reviews || 0} reviews)
            </span>
          </>
        )}
        {product.stock > 0 ? (
          <span style={{
            fontFamily: 'Poppins', fontSize: '0.72rem', fontWeight: 600,
            color: '#16a34a', background: '#f0fdf4',
            padding: '2px 10px', borderRadius: '999px', border: '1px solid #bbf7d0',
          }}>
            STOCK: {product.stock}
          </span>
        ) : (
          <span style={{
            fontFamily: 'Poppins', fontSize: '0.72rem', fontWeight: 600,
            color: '#dc2626', background: '#fef2f2',
            padding: '2px 10px', borderRadius: '999px',
          }}>Out of Stock</span>
        )}
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>
          {price} <span style={{ fontSize: '1rem', fontWeight: 600 }}>{product.currency}</span>
        </span>
        {oldPrice && (
          <>
            <span style={{ fontFamily: 'Poppins', fontSize: '1rem', color: '#dc2626', textDecoration: 'line-through' }}>
              {oldPrice} {product.currency}
            </span>
            <span style={{
              fontFamily: 'Poppins', fontSize: '0.72rem', fontWeight: 700,
              color: '#fff', background: '#dc2626',
              padding: '2px 8px', borderRadius: '4px',
            }}>-{discount}%</span>
          </>
        )}
      </div>

      {/* Sizes */}
      {sizes && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
            SIZE
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {sizes.map(s => (
              <button key={s} onClick={() => setSize(s)} style={{
                fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 500,
                padding: '6px 16px', borderRadius: '8px',
                border: `2px solid ${size === s ? '#16a34a' : '#e5e7eb'}`,
                background: size === s ? '#f0fdf4' : '#fff',
                color: size === s ? '#16a34a' : '#374151',
                cursor: 'pointer', transition: 'all 0.18s',
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
          QUANTITY
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
            width: '40px', height: '40px', border: '1px solid #e5e7eb',
            borderRadius: '8px 0 0 8px', background: '#f9fafb',
            fontFamily: 'Poppins', fontSize: '1.2rem', cursor: 'pointer', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>−</button>
          <div style={{
            width: '56px', height: '40px', border: '1px solid #e5e7eb',
            borderLeft: 'none', borderRight: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Poppins', fontSize: '0.95rem', fontWeight: 600, color: '#111827',
          }}>{qty}</div>
          <button onClick={() => setQty(q => q + 1)} style={{
            width: '40px', height: '40px', border: '1px solid #e5e7eb',
            borderRadius: '0 8px 8px 0', background: '#f9fafb',
            fontFamily: 'Poppins', fontSize: '1.2rem', cursor: 'pointer', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>+</button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <button onClick={handleAdd} disabled={product.stock === 0} style={{
          fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700,
          padding: '14px', borderRadius: '10px', border: 'none',
          background: added ? '#15803d' : '#16a34a',
          color: '#fff', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
          opacity: product.stock === 0 ? 0.5 : 1,
          transition: 'background 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 10a4 4 0 01-8 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {added ? '✓ Added to Cart!' : 'Add to Cart'}
        </button>

        <button onClick={() => addItem(product, size, qty)} disabled={product.stock === 0} style={{
          fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700,
          padding: '14px', borderRadius: '10px',
          border: '2px solid #16a34a',
          background: '#fff', color: '#16a34a',
          cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
          opacity: product.stock === 0 ? 0.5 : 1,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#16a34a'; }}
        >
          Buy Now
        </button>
      </div>

      {/* Delivery note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M1 3h15v13H1z" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8h4l3 3v5h-7V8z" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="5.5" cy="18.5" r="1.5" stroke="#16a34a" strokeWidth="1.5"/>
          <circle cx="18.5" cy="18.5" r="1.5" stroke="#16a34a" strokeWidth="1.5"/>
        </svg>
        <span style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#374151' }}>
          Free delivery on orders over 500 {product.currency}
        </span>
      </div>
    </div>
  );
}
