import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductGallery  from '../components/product/ProductGallery';
import ProductInfo     from '../components/product/ProductInfo';
import ProductTabs     from '../components/product/ProductTabs';
import RelatedProducts from '../components/product/RelatedProducts';
import { useProducts, mapProduct } from '../context/ProductsContext';
import { apiFetch } from '../lib/apiFetch';
import { useI18n }  from '../i18n/i18nContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { lang, t } = useI18n();
  const { products } = useProducts();
  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    setRelated([]);
    Promise.all([
      apiFetch(`/products/${id}`).then(r => r.ok ? r.json() : null).catch(() => null),
      apiFetch(`/products/${id}/related`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([prodJson, relJson]) => {
      const raw = prodJson?.data?.product ?? null;
      setProduct(raw ? mapProduct(raw) : null);
      const relList = relJson?.data?.products ?? [];
      if (relList.length > 0) {
        setRelated(relList.map(mapProduct).slice(0, 4));
      } else if (raw) {
        const cat = (raw.category || '').toLowerCase();
        const fallback = products
          .filter(p => p.id !== raw._id && (p.category || '').toLowerCase() === cat)
          .slice(0, 4);
        setRelated(fallback.length ? fallback : products.filter(p => p.id !== raw._id).slice(0, 4));
      }
      setLoading(false);
    });
  }, [id, lang]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#16a34a', animation: 'pdSpin 0.7s linear infinite' }} />
        <style>{`@keyframes pdSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'Poppins, sans-serif' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Product not found</p>
        <Link to="/shop" style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 500 }}>← Back to Shop</Link>
      </div>
    );
  }

  return (
    <main style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <style>{`@keyframes pdSpin { to { transform: rotate(360deg); } }`}</style>

      {/* Breadcrumb */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0', fontFamily: 'Poppins', fontSize: '0.78rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: '#6b7280', textDecoration: 'none' }}>Shop</Link>
        <span>/</span>
        <span style={{ color: '#111827', fontWeight: 500 }}>{product.name}</span>
      </div>

      {/* Main section */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Gallery — full width on top */}
          <ProductGallery product={product} />

          {/* Info */}
          <ProductInfo product={product} />

          {/* Tabs */}
          <ProductTabs product={product} />

        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ height: '1px', background: '#f3f4f6' }} />
      </div>

      <RelatedProducts products={related} />
    </main>
  );
}
