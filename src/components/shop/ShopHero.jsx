import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useBanners } from '../../context/BannersContext';

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

export default function ShopHero() {
  const contentRef = useReveal();
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';
  const { getBanners, loading } = useBanners();
  const apiBanners = getBanners('CATEGORY_PAGE');
  const banner = apiBanners[0];

  if (loading) {
    return (
      <section className="animate-pulse relative w-full overflow-hidden" style={{ height: 'clamp(300px, 40vw, 650px)', background: '#1a1612' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2d2520 0%, #1a1612 100%)' }} />
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(300px, 40vw, 650px)' }}
    >
      <style>{`
        .sh-bg { animation: shKenBurns 10s ease-out forwards; }
        @keyframes shKenBurns { from { transform: scale(1.06); } to { transform: scale(1); } }
        .sh-content {
          opacity: 0; transform: translateY(30px); filter: blur(6px);
          transition: opacity 1.1s cubic-bezier(.22,1,.36,1), transform 1.1s cubic-bezier(.22,1,.36,1), filter 1.1s cubic-bezier(.22,1,.36,1);
        }
        .sh-content.revealed { opacity:1; transform:translateY(0); filter:blur(0); }
      `}</style>

      {/* Background */}
      <img
        src={banner?.img || '/pexels-jakubzerdzicki-19059657.jpg'}
        alt={banner?.title || 'Shop'}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center center' }}
        onError={e => { e.target.src = '/pexels-jakubzerdzicki-19059657.jpg'; }}
      />

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,8,6,0.75) 0%, rgba(10,8,6,0.35) 60%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.5) 0%, transparent 60%)' }} />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={contentRef} className="sh-content text-center px-6">
          <p className="font-body text-[0.52rem] tracking-[0.35em] uppercase text-[#c9a96e] mb-3"
            style={{ fontWeight: isRtl ? 700 : undefined }}>
            {t('shopHero.eyebrow')}
          </p>
          <h1
            className="font-display font-light text-white mb-4"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '-1px', lineHeight: 1.1, fontWeight: isRtl ? 700 : undefined }}
          >
            {banner?.title || t('shopHero.title')}
          </h1>
          <p className="font-body text-xs font-light text-white/60 max-w-sm mx-auto"
            style={{ fontWeight: isRtl ? 500 : undefined }}>
            {banner?.subtitle || t('shopHero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
