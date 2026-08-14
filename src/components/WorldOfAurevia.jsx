import { useEffect, useRef, useState } from 'react';
import { useI18n }   from '../i18n/i18nContext';
import { useTheme }  from '../context/ThemeContext';
import { apiFetch }  from '../lib/apiFetch';

function useReveal(repeat = true) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add('revealed'); if (!repeat) observer.disconnect(); }
        else if (repeat) el.classList.remove('revealed');
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Normalise image URL — replace localhost with production
function toAbsUrl(path) {
  if (!path) return null;
  if (path.includes('localhost'))
    return path.replace(/https?:\/\/localhost:\d+/, 'https://aurevia-brand.com');
  if (path.startsWith('http')) return path;
  return `https://aurevia-brand.com${path.startsWith('/') ? '' : '/'}${path}`;
}

// Static fallback
const STATIC = [
  '/Image (Unisex).png',
  '/Image (Men).png',
  '/image 6.png',
  '/Image (Women).png',
  '/image 5.png',
  '/image 7.png',
];

export default function WorldOfAurevia() {
  const headerRef  = useReveal();
  const scrollRef  = useRef(null);
  const { t, lang } = useI18n();
  const { dark }    = useTheme();
  const isRtl       = lang === 'ar';

  const [images, setImages]   = useState(STATIC.map(s => ({ src: s, alt: '' })));
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(false);

  // ── Fetch gallery from API ──────────────────────────────────────────────────
  useEffect(() => {
    apiFetch('/gallery')
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        const list = json?.data?.gallery ?? json?.data?.images ?? json?.data ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setImages(list.map(item => ({
            src: toAbsUrl(item.imageUrl || item.url || item.image || item),
            alt: item.title || item.alt || '',
          })));
        }
      })
      .catch(() => {}); // silent — keeps static fallback
  }, []);

  // ── Scroll buttons visibility ───────────────────────────────────────────────
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => { el.removeEventListener('scroll', updateArrows); window.removeEventListener('resize', updateArrows); };
  }, [images]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  // Only show scroll buttons if images overflow
  const hasScroll = images.length > 6;

  return (
    <section className="py-20 lg:py-28 overflow-hidden"
      style={{ background: dark ? '#111009' : '#ffffff' }}>
      <style>{`
        .wa-header {
          opacity: 0; transform: translateY(-24px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .wa-header.revealed { opacity:1; transform:translateY(0); }

        /* scroll strip */
        .wa-strip {
          display: flex; gap: 0.75rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .wa-strip::-webkit-scrollbar { display: none; }

        .wa-img {
          flex: 0 0 auto;
          scroll-snap-align: start;
          overflow: hidden;
          border-radius: 1rem;
          opacity: 0;
          clip-path: inset(100% 0 0 0);
          transition: clip-path 1.1s cubic-bezier(.22,1,.36,1), opacity 0.01s;
          cursor: pointer;
        }
        .wa-img img { transition: transform 0.7s cubic-bezier(.22,1,.36,1); width:100%; height:100%; object-fit:cover; }
        .wa-img:hover img { transform: scale(1.07); }

        /* revealed — when parent has class, all children animate */
        .wa-revealed .wa-img { opacity:1; clip-path:inset(0% 0 0 0); }
        .wa-revealed .wa-img:nth-child(1) { transition-delay:0s; }
        .wa-revealed .wa-img:nth-child(2) { transition-delay:0.1s; }
        .wa-revealed .wa-img:nth-child(3) { transition-delay:0.2s; }
        .wa-revealed .wa-img:nth-child(4) { transition-delay:0.3s; }
        .wa-revealed .wa-img:nth-child(5) { transition-delay:0.4s; }
        .wa-revealed .wa-img:nth-child(6) { transition-delay:0.5s; }
        .wa-revealed .wa-img:nth-child(n+7) { transition-delay:0.6s; }

        .wa-scroll-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer;
          transition: opacity 0.3s ease, background 0.3s ease;
          z-index: 10;
        }
        .wa-scroll-btn:disabled { opacity: 0; pointer-events: none; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="wa-header text-center mb-10">
          <h2 className="font-display text-4xl sm:text-5xl font-light"
            style={{ letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}>
            {t('worldOfAurevia.title')}
          </h2>
        </div>

        {/* Gallery */}
        <div className="relative">

          {/* Left arrow */}
          {hasScroll && (
            <button className="wa-scroll-btn" onClick={() => scroll(-1)} disabled={!canLeft}
              style={{ left: '-16px', background: dark ? '#1e1b16' : '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', color: dark ? '#faf7f2' : '#1a1612' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <polyline points="9,2 4,7 9,12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Scroll strip */}
          <div ref={scrollRef} className="wa-strip wa-revealed">
            {images.map((img, i) => (
              <div key={i} className="wa-img"
                style={{ width: hasScroll ? '220px' : `calc(${100 / Math.min(images.length, 6)}% - 0.625rem)`, aspectRatio: '3/4' }}>
                <img src={img.src} alt={img.alt || `AUREVIA ${i + 1}`}
                  onError={e => { e.currentTarget.src = '/Image (Unisex).png'; }} />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {hasScroll && (
            <button className="wa-scroll-btn" onClick={() => scroll(1)} disabled={!canRight}
              style={{ right: '-16px', background: dark ? '#1e1b16' : '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', color: dark ? '#faf7f2' : '#1a1612' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <polyline points="5,2 10,7 5,12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
