import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { ProductCard } from '../ProductGrid';

function SkeletonCard() {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ width: '100%', paddingBottom: '125%', background: '#f3f4f6', borderRadius: '10px', marginBottom: '12px', animation: 'pgPulse 1.4s ease-in-out infinite' }} />
      <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '4px', width: '40%', marginBottom: '8px', animation: 'pgPulse 1.4s ease-in-out infinite' }} />
      <div style={{ height: '14px', background: '#f3f4f6', borderRadius: '4px', width: '75%', marginBottom: '6px', animation: 'pgPulse 1.4s ease-in-out infinite' }} />
      <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '4px', width: '50%', animation: 'pgPulse 1.4s ease-in-out infinite' }} />
    </div>
  );
}

export default function ShopGrid() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');

  const {
    shopProducts, shopLoading, shopError,
    shopPage, shopTotalPages, shopTotal,
    shopFilter, fetchShopPage, apiCategories,
  } = useProducts();

  useEffect(() => {
    const cat = urlCategory || 'all';
    if (cat !== shopFilter) fetchShopPage(1, cat);
  }, [urlCategory]); // eslint-disable-line

  const handleFilter = (cat) => fetchShopPage(1, cat);
  const handlePage   = (p) => { fetchShopPage(p, shopFilter); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <section style={{ background: '#fff', padding: '1.5rem 0 3rem', fontFamily: 'Poppins, sans-serif' }}>
      <style>{`@keyframes sgPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Filter + count row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', overflowX: 'auto' }}>
          <button onClick={() => handleFilter('all')} style={{
            fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: shopFilter === 'all' ? 700 : 500,
            padding: '0.3rem 1rem', borderRadius: '999px',
            border: '1.5px solid ' + (shopFilter === 'all' ? '#14532d' : '#e5e7eb'),
            background: shopFilter === 'all' ? '#14532d' : '#fff',
            color: shopFilter === 'all' ? '#fff' : '#6b7280',
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}>All</button>

          {apiCategories.filter(c => c.isActive !== false).map(cat => (
            <button key={cat._id} onClick={() => handleFilter(cat._id)} style={{
              fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: shopFilter === cat._id ? 700 : 500,
              padding: '0.3rem 1rem', borderRadius: '999px',
              border: '1.5px solid ' + (shopFilter === cat._id ? '#14532d' : '#e5e7eb'),
              background: shopFilter === cat._id ? '#14532d' : '#fff',
              color: shopFilter === cat._id ? '#fff' : '#6b7280',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>{cat.name}</button>
          ))}

          <span style={{ marginLeft: 'auto', fontFamily: 'Poppins', fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
            {shopTotal} products
          </span>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }} className="sg-grid-new">
          <style>{`
            @keyframes pgPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
            @media (min-width: 640px)  { .sg-grid-new { grid-template-columns: repeat(3,1fr) !important; } }
            @media (min-width: 1024px) { .sg-grid-new { grid-template-columns: repeat(4,1fr) !important; } }
          `}</style>
          {shopLoading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : shopProducts.map(p => <ProductCard key={p.id} product={p} wishlisted={false} onWishlist={() => {}} />)
          }
        </div>

        {/* Pagination */}
        {shopTotalPages > 1 && !shopLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button onClick={() => handlePage(shopPage - 1)} disabled={shopPage === 1} style={{
              fontFamily: 'Poppins', fontSize: '0.78rem', padding: '6px 16px',
              borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff',
              color: '#374151', cursor: shopPage === 1 ? 'not-allowed' : 'pointer',
              opacity: shopPage === 1 ? 0.4 : 1,
            }}>← Prev</button>

            {Array.from({ length: shopTotalPages }).map((_, i) => {
              const p = i + 1;
              if (Math.abs(p - shopPage) > 2 && p !== 1 && p !== shopTotalPages) return null;
              return (
                <button key={p} onClick={() => handlePage(p)} style={{
                  fontFamily: 'Poppins', fontSize: '0.78rem',
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: '1px solid ' + (shopPage === p ? '#16a34a' : '#e5e7eb'),
                  background: shopPage === p ? '#16a34a' : '#fff',
                  color: shopPage === p ? '#fff' : '#374151',
                  cursor: 'pointer', fontWeight: shopPage === p ? 700 : 400,
                }}>{p}</button>
              );
            })}

            <button onClick={() => handlePage(shopPage + 1)} disabled={shopPage === shopTotalPages} style={{
              fontFamily: 'Poppins', fontSize: '0.78rem', padding: '6px 16px',
              borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff',
              color: '#374151', cursor: shopPage === shopTotalPages ? 'not-allowed' : 'pointer',
              opacity: shopPage === shopTotalPages ? 0.4 : 1,
            }}>Next →</button>
          </div>
        )}

        {shopError && (
          <p style={{ textAlign: 'center', fontFamily: 'Poppins', color: '#9ca3af', padding: '2rem' }}>
            Failed to load products. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
