import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); io.disconnect(); } },
      { threshold: 0.1 }
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
        <svg key={i} width="9" height="9" viewBox="0 0 10 10" fill={i < count ? '#c9a96e' : 'none'}>
          <polygon points="5,1 6.2,3.8 9.5,3.8 7,5.7 7.9,9 5,7.2 2.1,9 3,5.7 0.5,3.8 3.8,3.8"
            stroke="#c9a96e" strokeWidth="0.6"/>
        </svg>
      ))}
    </div>
  );
}

export default function RelatedProducts({ products }) {
  const headerRef = useReveal();
  const gridRef   = useReveal();
  const navigate  = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const { addItem } = useCart();

  const { t }       = useI18n();
  const { dark }    = useTheme();
  const toggle = id => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const c = {
    sectionBg:    dark ? '#111009' : '#faf7f2',
    text:         dark ? '#faf7f2' : '#1a1612',
    muted:        dark ? '#a09080' : '#8b7d6b',
    pillBg:       dark ? '#c9a96e' : '#1a1612',
    pillText:     dark ? '#1a1612' : '#faf7f2',
    wishBg:       dark ? 'rgba(26,22,18,0.55)' : 'rgba(255,255,255,0.9)',
    wishIcon:     dark ? '#faf7f2' : '#1a1612',
  };

  return (
    <section className="py-16 lg:py-24 overflow-hidden" style={{ background: c.sectionBg }}>
      <style>{`
        .rp-header {
          opacity:0; transform:translateY(-20px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .rp-header.revealed { opacity:1; transform:translateY(0); }

        .rp-card {
          opacity:0; transform:translateY(40px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
          cursor: pointer;
        }
        .rp-grid.revealed .rp-card:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:0s; }
        .rp-grid.revealed .rp-card:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:0.1s; }
        .rp-grid.revealed .rp-card:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:0.2s; }
        .rp-grid.revealed .rp-card:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:0.3s; }

        .rp-img { transition: transform 0.6s cubic-bezier(.22,1,.36,1); }
        .rp-card:hover .rp-img { transform: scale(1.05); }

        .rp-wishlist { transition: transform 0.2s ease; }
        .rp-wishlist:hover { transform: scale(1.1); }

        .rp-cart-label {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-width 0.5s cubic-bezier(.22,1,.36,1), opacity 0.3s ease;
        }
        .rp-card:hover .rp-cart-label { max-width: 110px; opacity: 1; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div ref={headerRef} className="rp-header text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-light"
            style={{ letterSpacing: '-0.5px', color: c.text }}>
            {t('product.related')}
          </h2>
        </div>

        <div ref={gridRef} className="rp-grid grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
          {products.map(p => (
            <article key={p.id} className="rp-card" onClick={() => navigate(`/product/${p.id}`)}>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden mb-4" style={{ paddingBottom: '115%' }}>
                <img src={p.img} alt={p.name} className="rp-img absolute inset-0 w-full h-full object-cover" />

                {/* Wishlist */}
                <button
                  onClick={e => { e.stopPropagation(); toggle(p.id); }}
                  aria-label="Wishlist"
                  className="rp-wishlist absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: c.wishBg, backdropFilter: 'blur(4px)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill={wishlist.includes(p.id) ? c.pillBg : 'none'}>
                    <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
                      stroke={c.wishIcon} strokeWidth="1.2"/>
                  </svg>
                </button>

                {/* Add to cart — slide on hover */}
                <div className="absolute bottom-3 right-3 flex items-center overflow-hidden rounded-full">
                  <span className="rp-cart-label font-body text-[0.46rem] tracking-[0.16em] uppercase pl-3 pr-1 whitespace-nowrap"
                    style={{ background: c.pillBg, color: c.pillText, paddingTop:'0.4rem', paddingBottom:'0.4rem' }}>
                    {t('shop.addToCart')}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); addItem(p); }}
                    aria-label="Add to cart"
                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ background: c.pillBg }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M1.5 1.5H2.5L4 7.5H9L10.5 3H3.5" stroke={c.pillText} strokeWidth="1" strokeLinecap="round"/>
                      <circle cx="4.5" cy="9.5" r="0.8" fill={c.pillText}/>
                      <circle cx="8.5" cy="9.5" r="0.8" fill={c.pillText}/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info */}
              <p className="font-body text-[0.46rem] tracking-[0.2em] uppercase text-[#c9a96e] mb-1">{p.notes}</p>
              <h3 className="font-display text-lg font-light leading-tight mb-0.5" style={{ color: c.text }}>{p.name}</h3>
              <p className="font-body text-[0.58rem] font-light mb-2" style={{ color: c.muted }}>{p.subtitle}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Stars count={p.stars} />
                  <span className="font-body text-[0.44rem]" style={{ color: c.muted }}>({p.reviews})</span>
                </div>
                <span className="font-display text-base font-light" style={{ color: c.text }}>{p.price} LE</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
