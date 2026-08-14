import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/i18nContext';
import { useProducts } from '../context/ProductsContext';

// Fallback placeholder images for categories without an API image
const FALLBACK_IMGS = [
  '/Image (Women).png',
  '/Image (Men).png',
  '/Image (Unisex).png',
  '/image 7.png',
  '/image 5.png',
  '/image 6.png',
];

function useReveal(repeat = true) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('revealed');
        else if (repeat) el.classList.remove('revealed');
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function FeaturedCollection() {
  const { t }    = useI18n();
  const navigate = useNavigate();
  const headerRef = useReveal();
  const gridRef   = useReveal();

  const { apiCategories, categoryCounts, total } = useProducts();

  // Build display list from API categories or static fallback
  const displayCats = apiCategories.length > 0
    ? apiCategories
        .filter(c => c.isActive !== false)
        .map((cat, i) => ({
          id:       cat._id,
          name:     cat.name,
          img:      cat.image
            ? (cat.image.startsWith('http') ? cat.image : `https://aurevia-brand.com${cat.image.startsWith('/') ? '' : '/'}${cat.image}`)
            : FALLBACK_IMGS[i % FALLBACK_IMGS.length],
          slug:     cat.slug || cat._id,
          // Use _id as the filter value so the API gets the exact ID
          filterVal: cat._id,
          count:    categoryCounts[cat.name] ?? categoryCounts[cat._id] ?? 0,
        }))
    : [
        { id: 'women',  name: 'Women',          img: '/Image (Women).png',  slug: 'women',  filterVal: 'women',  count: categoryCounts['women']  ?? 0 },
        { id: 'men',    name: 'Men',            img: '/Image (Men).png',    slug: 'men',    filterVal: 'men',    count: categoryCounts['men']    ?? 0 },
        { id: 'unisex', name: 'Unisex',         img: '/Image (Unisex).png', slug: 'unisex', filterVal: 'unisex', count: categoryCounts['unisex'] ?? 0 },
        { id: 'all1',   name: 'Gift Sets',      img: '/image 7.png',        slug: 'all',    filterVal: 'all',    count: total },
        { id: 'all2',   name: 'Home Fragrance', img: '/image 5.png',        slug: 'all',    filterVal: 'all',    count: total },
        { id: 'all3',   name: 'Travel Size',    img: '/image 6.png',        slug: 'all',    filterVal: 'all',    count: total },
      ];

  return (
    <section id="shop" className="bg-[#faf7f2] py-24 lg:py-32 overflow-hidden">
      <style>{`
        .fc-header {
          opacity: 0; transform: translateY(-40px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1);
        }
        .fc-header.revealed { opacity: 1; transform: translateY(0); }

        .fc-card {
          opacity: 0; clip-path: inset(0 0 100% 0);
          transition: opacity 0.01s, clip-path 1.4s cubic-bezier(.22,1,.36,1);
        }
        .fc-grid.revealed .fc-card:nth-child(1) { opacity:1; clip-path:inset(0 0 0% 0); transition-delay:0s    }
        .fc-grid.revealed .fc-card:nth-child(2) { opacity:1; clip-path:inset(0 0 0% 0); transition-delay:0.15s }
        .fc-grid.revealed .fc-card:nth-child(3) { opacity:1; clip-path:inset(0 0 0% 0); transition-delay:0.3s  }
        .fc-grid.revealed .fc-card:nth-child(4) { opacity:1; clip-path:inset(0 0 0% 0); transition-delay:0.45s }
        .fc-grid.revealed .fc-card:nth-child(5) { opacity:1; clip-path:inset(0 0 0% 0); transition-delay:0.6s  }
        .fc-grid.revealed .fc-card:nth-child(6) { opacity:1; clip-path:inset(0 0 0% 0); transition-delay:0.75s }

        .fc-card img { transition: transform 0.7s cubic-bezier(.22,1,.36,1); }
        .fc-card:hover img { transform: scale(1.07); }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="fc-header text-center mb-14">
          <p className="section-label text-[#c9a96e] mb-3">{t('featured.explore')}</p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-[#1a1612]">
            {t('featured.title')}
          </h2>
        </div>

        {/* Categories Grid */}
        <div ref={gridRef} className="fc-grid flex justify-center gap-4 flex-wrap">
          {displayCats.map((cat) => (
            <a
              key={cat.id}
              className="fc-card relative rounded-2xl overflow-hidden cursor-pointer group flex-1"
              style={{ minWidth: '120px', maxWidth: '200px', height: '290px' }}
              onClick={() => navigate(`/shop?category=${cat.filterVal || cat.slug}`)}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { e.target.src = '/Image (Unisex).png'; }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-base font-light text-white leading-tight">
                  {cat.name}
                </p>
                <p className="font-body text-[0.55rem] tracking-widest text-white/70 mt-0.5">
                  {cat.count > 0 ? `${cat.count} products` : ''}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
